// The orphan-cleanup contract (task 36) — the ONLY destructive operation in fkit.
//
// Everything else init does is additive by invariant; this deletes paths in a user's project with no
// rollback. So the bar is not "does it delete the four paths" but "can it ever delete anything else":
// the interesting assertions here are the NEGATIVE ones (settings survives, the gate refuses, dry-run
// is byte-identical), and they are written against a manifest of the whole tree rather than spot checks
// so that a delete we did not think of still fails the suite.
//
// Nothing here writes into the repo: every project and every launcher copy lives under os.tmpdir().

import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, appendFileSync, cpSync, symlinkSync, chmodSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO, runInit, runFkit, makeProject, manifest, readSettings, cleanup, cleanupStub } from './harness.mjs';

const TARGETS = ['.fkit/agents', '.fkit/run', '.fkit/team-session', '.omnigent'];
const trash = [];
after(() => { trash.forEach(cleanup); cleanupStub(); });

function tmp(prefix) {
  const d = mkdtempSync(join(tmpdir(), prefix));
  trash.push(d);
  return d;
}

// A project carrying the full Omnigent residue AND the live .fkit/ state that must survive it.
// The decoys are the point: .fkit/settings is live ADR-010 lockdown state that revision 1 of the
// migration report wrongly listed for deletion.
function seedResidue(dir) {
  mkdirSync(join(dir, '.fkit', 'agents', 'fkit-coder'), { recursive: true });
  writeFileSync(join(dir, '.fkit', 'agents', 'fkit-coder', 'agent.yaml'), 'name: fkit-coder\n');
  writeFileSync(join(dir, '.fkit', 'run'), '#!/bin/sh\necho omnigent\n');
  writeFileSync(join(dir, '.fkit', 'team-session'), 'session state\n');
  mkdirSync(join(dir, '.omnigent'), { recursive: true });
  writeFileSync(join(dir, '.omnigent', 'config.yaml'), 'runtime: omnigent\n');
  // live state — none of it Omnigent's, none of it ever a target
  mkdirSync(join(dir, '.fkit', 'settings'), { recursive: true });
  writeFileSync(join(dir, '.fkit', 'settings', 'coder.json'), '{"hooks":{}}\n');
  mkdirSync(join(dir, '.fkit', 'tmp'), { recursive: true });
  writeFileSync(join(dir, '.fkit', 'tmp', 'scratch'), 'scratch\n');
  writeFileSync(join(dir, '.fkit', 'intake.md'), '# fkit intake\n\nthe owner typed this\n');
  // Deliberately NOT .fkit/interview: init's §4 rewrites it on every run, so seeding one would measure
  // that pre-existing behavior rather than the cleanup, and the freeze assertions would fail on a file
  // the cleanup never touches.
}

// A project that already looks set up (init's convergence branch — the only branch this residue is
// ever found on), plus the residue.
function makeResidueProject() {
  const dir = tmp('fkit-orphan-');
  cpSync(join(REPO, 'claude', 'scaffold', 'ai-agents'), join(dir, 'ai-agents'), { recursive: true });
  seedResidue(dir);
  return dir;
}

// A throwaway COPY of claude/ whose init we can run — used to prove the reference-check gate by
// injecting a reference without touching the real sources.
function copyClaude() {
  const root = tmp('fkit-src-');
  cpSync(join(REPO, 'claude'), join(root, 'claude'), { recursive: true });
  return join(root, 'claude');
}

function runInitFrom(claudeDir, project, extraEnv = {}) {
  const r = spawnSync(join(claudeDir, 'fkit-claude-init.sh'), [project], {
    stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', env: { ...process.env, ...extraEnv },
  });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

describe('A. the target list', () => {
  test('is exactly the four Omnigent orphans — and never .fkit/settings', () => {
    const listed = readFileSync(join(REPO, 'claude', 'orphan-targets'), 'utf8')
      .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    assert.deepEqual(listed, TARGETS);
    // The rev-1 mistake, pinned. Any future edit that adds live state fails here, loudly.
    assert.ok(!listed.some((l) => l.includes('settings')), '.fkit/settings must never be a target');
  });

  test('every target is genuinely dead — zero references in the shipped sources', () => {
    // The reference-check gate, re-run at BUILD time (the brief asks for both). This is the assertion
    // that would have caught revision 1 of the migration report.
    //
    // ⚠️ It MUST use the same matcher as the runtime gate (-E -i + the segment boundary). A build-time
    // check that matches differently is a second parser that can disagree with the first — which is the
    // C6 defect wearing a build-time hat, and it bit exactly once: this test was case-SENSITIVE while
    // the runtime gate is not, so a `.Fkit/Run` in a comment sailed past CI and was caught only by the
    // runtime refusing to clean anything. Keep these two in lockstep.
    for (const t of TARGETS) {
      const esc = t.replace(/[\]\[\\.*^$(){}?+|]/g, '\\$&');
      const r = spawnSync('grep', ['-rlEi', '--', `${esc}($|[^A-Za-z0-9_.-])`, join(REPO, 'claude')], { encoding: 'utf8' });
      const hits = (r.stdout || '').split('\n').filter(Boolean)
        .filter((f) => f !== join(REPO, 'claude', 'orphan-targets'));
      assert.deepEqual(hits, [], `${t} is still referenced by: ${hits.join(', ')}`);
    }
  });
});

describe('B. the cleanup removes those, and only those', () => {
  test('the four orphans go; every other path survives byte-identical', () => {
    const p = makeResidueProject();
    const before = manifest(p);
    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);

    for (const t of TARGETS) assert.ok(!existsSync(join(p, t)), `${t} should be gone`);

    // The negative half, and the one that matters: nothing ELSE was deleted or mutated. Compared over
    // the whole tree, so a delete nobody anticipated still trips it.
    const after_ = manifest(p);
    for (const [rel, fp] of before) {
      if (TARGETS.some((t) => rel === t || rel.startsWith(`${t}/`))) continue;   // the sanctioned deletes
      assert.equal(after_.get(rel), fp, `${rel} must be untouched by the cleanup`);
    }
  });

  test('.fkit/settings survives, and a launch still builds the role lockdown on top of it', async () => {
    const p = makeProject();
    seedResidue(p);
    await runFkit(['coder'], { project: p });
    for (const t of TARGETS) assert.ok(!existsSync(join(p, t)), `${t} should be gone`);
    assert.ok(existsSync(join(p, '.fkit', 'settings')), '.fkit/settings must survive');
    // Prove the lockdown state is intact, not merely that a directory is there.
    const s = readSettings(p, 'coder');
    assert.ok(s.hooks?.PreToolUse?.length, 'the role session must still get its skill lockdown hook');
    // The owner's own state is not fkit's to delete either.
    assert.ok(existsSync(join(p, '.fkit', 'intake.md')), '.fkit/intake.md is the owner\'s answers');
  });

  test('a project with no residue is silent and unchanged (the every-launch case, forever)', () => {
    const p = makeResidueProject();
    runInit(p);                                    // first run cleans
    const before = manifest(p);
    const r = runInit(p);                          // second run has nothing to do
    assert.ok(r.code === 0 || r.code === 3);
    assert.ok(!/Omnigent/i.test(r.stderr), `must say nothing on a clean project, said:\n${r.stderr}`);
    assert.deepEqual([...manifest(p)], [...before]);
  });
});

describe('C. announce-only (the owner\'s consent model)', () => {
  test('every removed path is named, on the run it happens', () => {
    const p = makeResidueProject();
    const r = runInit(p);
    for (const t of TARGETS) assert.match(r.stderr, new RegExp(t.replace(/\./g, '\\.')), `${t} must be announced`);
    assert.match(r.stderr, /removed these dead Omnigent paths/);
  });

  test('THE TRAP — the announcement survives the launcher\'s >/dev/null', async () => {
    // The launcher silences init on exactly the already-set-up projects that carry this residue. An
    // announcement on stdout would be discarded 100% of the time: implemented, invisible, review-green.
    const p = makeProject();
    seedResidue(p);
    const r = await runFkit(['coder'], { project: p });
    assert.match(r.stderr, /removed these dead Omnigent paths/, 'the announcement must reach the user');
    assert.match(r.stderr, /\.omnigent/);
  });

  test('no prompt, and no stored consent state anywhere', () => {
    const p = makeResidueProject();
    const r = runInit(p);                          // stdin is /dev/null; a prompt would hang or skip
    assert.ok(r.code === 0 || r.code === 3);
    assert.ok(!/\[y\/N\]|continue\?|confirm/i.test(r.stdout + r.stderr), 'announce-only: never prompt');
    const state = manifest(p);
    for (const rel of state.keys()) {
      assert.ok(!/consent|cleaned|orphan-done|\.fkit-cleanup/.test(rel), `no consent cursor: found ${rel}`);
    }
  });
});

describe('D. dry run', () => {
  test('reports the deletion set and removes nothing', () => {
    const p = makeResidueProject();
    const before = manifest(p);
    const r = runInitFrom(join(REPO, 'claude'), p, { FKIT_CLEANUP_DRY_RUN: '1' });
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.match(r.stderr, /WOULD remove/);
    for (const t of TARGETS) assert.match(r.stderr, new RegExp(t.replace(/\./g, '\\.')));
    // Every path that existed still exists, byte-identical. Not "the targets survived" — NOTHING was
    // deleted or mutated. (Init legitimately ADDS paths on this run — CLAUDE.md, .claude/, convergence.
    // Dry-run is a claim about destruction, so this checks the before-set, not the after-set.)
    const after_ = manifest(p);
    for (const [rel, fp] of before) {
      assert.equal(after_.get(rel), fp, `dry run must not touch ${rel}`);
    }
  });
});

describe('E. the reference-check gate', () => {
  test('a target that has gained a reference is REFUSED, not deleted', () => {
    const claudeDir = copyClaude();
    // Simulate the rev-1 mistake: the list says `.fkit/run` is dead, the code says otherwise.
    appendFileSync(join(claudeDir, 'fkit-claude.sh'), '\n# later change: we now write .fkit/run\n');
    const p = makeResidueProject();

    const r = runInitFrom(claudeDir, p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.ok(existsSync(join(p, '.fkit', 'run')), '.fkit/run must NOT be deleted while referenced');
    assert.match(r.stderr, /did NOT remove/);
    assert.match(r.stderr, /still referenced/);
    assert.match(r.stderr, /fkit-claude\.sh/, 'the discrepancy must name the referencing file');
    // The gate is per-target, not all-or-nothing: the genuinely dead ones still go.
    assert.ok(!existsSync(join(p, '.omnigent')), 'an unreferenced target is still cleaned');
  });

  test('the list file itself does not count as a reference', () => {
    // Otherwise the gate refuses everything, forever, and the feature is a silent no-op.
    const p = makeResidueProject();
    const r = runInit(p);
    assert.ok(!/still referenced/.test(r.stderr), `nothing should be refused, got:\n${r.stderr}`);
  });

  // R2 — the gate must fail CLOSED. "I could not run the check" and "I ran the check and found
  // nothing" were the same empty string, so a broken grep read as "verified dead" and we deleted.
  // A gate whose failure mode is `delete` is not a gate.
  test('a reference check that CANNOT RUN refuses the target — it never reads as "dead"', () => {
    const claudeDir = copyClaude();
    const p = makeResidueProject();
    // A grep that errors (rc 2) — the shape of grep missing, denied, or broken. Prepended to PATH so
    // the init subprocess picks it up instead of the real one.
    const fakeBin = tmp('fkit-bin-');
    writeFileSync(join(fakeBin, 'grep'), '#!/bin/sh\nexit 2\n');
    chmodSync(join(fakeBin, 'grep'), 0o755);

    const r = runInitFrom(claudeDir, p, { PATH: `${fakeBin}:${process.env.PATH}` });
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    for (const t of TARGETS) {
      assert.ok(existsSync(join(p, t)), `${t} must NOT be deleted on an unproven reference check`);
    }
    assert.match(r.stderr, /could not be run/);
  });

  // C1 — a byte-substring match makes `.fkit/run` hit `.fkit/runner`. Fails closed (a spurious refusal,
  // never a wrong delete), but it would be a baffling "why won't it clean up" six months from now.
  test('the gate matches whole path segments, not byte substrings', () => {
    const claudeDir = copyClaude();
    // A reference to a DIFFERENT path that merely starts with a target's bytes.
    appendFileSync(join(claudeDir, 'fkit-claude.sh'), '\n# unrelated later feature: .fkit/runner-cache\n');
    const p = makeResidueProject();

    const r = runInitFrom(claudeDir, p);
    assert.ok(!existsSync(join(p, '.fkit', 'run')), '.fkit/run must still be cleaned — .fkit/runner-cache is not it');
    assert.ok(!/still referenced/.test(r.stderr), `nothing should be refused, got:\n${r.stderr}`);
  });

  test('a reference to a path INSIDE a target still counts as a reference', () => {
    // The boundary must not overshoot: .fkit/run/foo is a use of .fkit/run.
    const claudeDir = copyClaude();
    appendFileSync(join(claudeDir, 'fkit-claude.sh'), '\n# we now write .fkit/run/state.json\n');
    const p = makeResidueProject();

    const r = runInitFrom(claudeDir, p);
    assert.ok(existsSync(join(p, '.fkit', 'run')), '.fkit/run is referenced via a child path — refuse it');
    assert.match(r.stderr, /still referenced/);
  });
});

describe('G. the list is data, and the code does not trust it', () => {
  // C5 — macOS filesystems are case-insensitive; the guards were not. A list line of `.Fkit/Settings`
  // would sail past a case-sensitive `*settings*` check and then match the real lockdown state on disk.
  // That hazard is real, it is why the guard lower-cases before matching, and it stays covered here.
  //
  // 0283 — but as first written this test only PROVED the guard on a case-INSENSITIVE filesystem, and
  // so went red on the first Linux CI run. The refusal DECISION is filesystem-independent — `tr` plus a
  // glob over the line's TEXT, not a lookup on disk. (Not "no stat", as this comment first said:
  // reaching that decision lstats the parent chain in `orphan_contained`, and `exists` is stat'd just
  // before it. Neither can turn a refusal into a deletion — that is the sense in which the decision is
  // filesystem-independent. ⚠️ They CAN change the refusal REASON, which is a different thing and the
  // one this test cares about: make `.fkit` a symlink and `orphan_contained` refuses this very line as
  // `'.fkit' is a symlink — fkit will not delete through one`, BEFORE the `*settings*` guard is ever
  // reached, so the lockdown-state sentence never renders at all. Measured, not reasoned.)
  // The ANNOUNCEMENT, though, is gated on the path existing,
  // deliberately, so a list line naming nothing does not nag on every launch forever with nothing at
  // stake. On macOS `.Fkit/Settings` resolved onto the real lockdown state, so
  // it existed and the guard spoke; on Linux it named nothing, so the guard stayed silent and
  // `assert.match(stderr, /lockdown state/)` got ''. The test was asserting "the filesystem folded case
  // for me", not the guard. Two changes make it filesystem-independent:
  //   1. seed `.Fkit/Settings` so it exists either way — a genuinely distinct directory where case
  //      matters, and the very same object as `.fkit/settings` where it does not, which is exactly how
  //      the original macOS hazard stays covered on macOS;
  //   2. list the REAL `.fkit/settings` alongside it. ⚠️ NOT — as this comment first claimed — "so the
  //      survival assertion bites everywhere". That was measured FALSE. The second line does make
  //      `.fkit/settings` a deletion CANDIDATE on either filesystem, but `claude/fkit-claude.sh:311-312`
  //      writes `.fkit/settings/<role>.json` on every launch, so `orphan_refs` always finds the path
  //      referenced in fkit's own sources and refuses it there too. Remove the whole `*settings*` guard
  //      and `coder.json` STILL survives (measured); the survival assertion fires only when BOTH gates
  //      are down. ⚠️ And be exact about what the second line buys, because the obvious answer is also
  //      measured FALSE: it is NOT what lets the per-line assertion below tell "refused AS lockdown
  //      state" apart from "refused for some other reason". That power is intrinsic — the assertion
  //      pins the reason TO the line — and with the cased line ALONE and no second line, the per-line
  //      assertion still goes red under the C5 regression. So does the broad `/lockdown state/` match,
  //      because with nothing else listed that string is absent from stderr entirely. What the second
  //      line measurably DOES is put a lowercase line on either filesystem that is refused as lockdown
  //      state — and that is precisely why the broad match STOPS detecting C5 (it finds its substring
  //      on THIS line) and why the per-line assertion below is left as the SOLE detector. That per-line
  //      assertion is what carries this test.
  // Proved on both kinds of filesystem, for the two lines this test seeds — both of which exist on disk
  // with no symlink anywhere in their parent chain: a `*settings*` line, however cased, is refused FOR
  // BEING LOCKDOWN STATE (named as that, on its own line — not refused incidentally), is announced, and
  // the lockdown state is still on disk afterwards. ⚠️ Those two conditions are the claim's limits, not
  // decoration — earlier text spells out both exceptions and both are measured: symlink a parent and
  // that line is refused by containment first, with no lockdown-state sentence for it at all; point a
  // `*settings*` line at nothing and it is still never deleted, but nothing is announced for it either.
  // Neither is a hole — the deletion is refused either way — and neither is what this test measures.
  test('the never-delete-lockdown-state guard is case-insensitive', () => {
    const claudeDir = copyClaude();
    writeFileSync(join(claudeDir, 'orphan-targets'), '.Fkit/Settings\n.fkit/settings\n');
    const p = makeResidueProject();
    mkdirSync(join(p, '.Fkit', 'Settings'), { recursive: true });

    const r = runInitFrom(claudeDir, p);
    assert.ok(r.code === 0 || r.code === 3);
    assert.ok(existsSync(join(p, '.fkit', 'settings', 'coder.json')),
      'lockdown state must survive a differently-cased list line');
    assert.match(r.stderr, /lockdown state/);
    // Each line refused on the strength of the *settings* match — the reason is named per line, so a
    // pass cannot come from the guard doing something else that happens to leave coder.json alone.
    // ⛔ DO NOT loosen or delete this loop. Measured in the 0283 review: with the C5 lowercasing
    // regression live, this is the ONLY assertion in the suite that goes red — delete it and the suite
    // reports a clean 23/23 on BOTH filesystems while the guard is defeated. Any replacement must still
    // name the refusal reason AND bind it to the line — IN ONE RENDERED LINE. That last clause is the
    // whole floor, not pedantry: a replacement that names the reason and the line with a regex allowed
    // to span lines meets the floor literally and measured 23/23 GREEN with the regression live, which
    // is the same false pass by another route. The broad `/lockdown state/` match just above is
    // the second layer (it is what fires when the whole guard is removed) — never weaken the two in the
    // same edit. Expected to go red only if the refusal text in `claude/fkit-claude-init.sh` is
    // deliberately changed; then update it in that same commit, never loosen it.
    for (const line of ['.Fkit/Settings', '.fkit/settings']) {
      assert.ok(r.stderr.includes(`${line} — refused: fkit will never delete lockdown state`),
        `${line} must be refused as lockdown state, got:\n${r.stderr}`);
    }
  });

  // R8 — the absolute-path refusal existed but could never fire: the leading `/` was stripped during
  // "normalization" before the check that looks for it, so `/tmp/cache` quietly became `tmp/cache` and
  // deleted a real path inside the project. Red-proved before the fix: data.txt was destroyed and
  // announced as a clean removal.
  test('an absolute list line is REFUSED, not silently rewritten into a project-relative one', () => {
    const claudeDir = copyClaude();
    writeFileSync(join(claudeDir, 'orphan-targets'), '/tmp/cache\n.omnigent\n');
    const p = makeResidueProject();
    mkdirSync(join(p, 'tmp', 'cache'), { recursive: true });
    writeFileSync(join(p, 'tmp', 'cache', 'data.txt'), 'nobody named this path\n');

    const r = runInitFrom(claudeDir, p);
    assert.ok(r.code === 0 || r.code === 3);
    assert.ok(existsSync(join(p, 'tmp', 'cache', 'data.txt')),
      'an absolute line must be refused outright, never normalized into a different real path');
    assert.match(r.stderr, /absolute path/);
    assert.ok(!existsSync(join(p, '.omnigent')), 'a valid target alongside a refused one is still cleaned');
  });

  // C6 — the runtime and the suite must agree on what a comment is. They did not: an indented `#` was
  // a comment to the test's parser and a TARGET PATH to the runtime's.
  test('an indented comment is a comment to the runtime, not a target', () => {
    const claudeDir = copyClaude();
    writeFileSync(join(claudeDir, 'orphan-targets'), '   # .omnigent is dead, says this comment\n  \n\t.fkit/run\n');
    const p = makeResidueProject();

    const r = runInitFrom(claudeDir, p);
    assert.ok(r.code === 0 || r.code === 3);
    assert.ok(existsSync(join(p, '.omnigent')), 'a commented-out path must NOT be deleted');
    // ...and a whitespace-padded real line still works.
    assert.ok(!existsSync(join(p, '.fkit', 'run')), 'an indented real target is still a target');
  });
});

describe('F. weird state and failure', () => {
  test('a symlink AT a target path is refused, never followed', () => {
    const p = makeResidueProject();
    const outside = tmp('fkit-outside-');
    writeFileSync(join(outside, 'precious'), 'not fkit\'s to delete\n');
    cleanup(join(p, '.omnigent'));
    symlinkSync(outside, join(p, '.omnigent'));

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3);
    assert.ok(existsSync(join(outside, 'precious')), 'must never delete through a symlink');
    assert.match(r.stderr, /symlink/);
  });

  // R1 — the leaf test above passed while this one was absent, which is exactly why it existed.
  // A symlinked PARENT makes the leaf a real directory: -L on the leaf is false, -e is true, and the
  // rm goes straight through, outside the project. The assertion has to live OUTSIDE $dest, because
  // manifest() only ever walks the project (R4) — a whole-tree freeze of $dest cannot see an escape.
  test('a symlink in the PARENT chain is refused — the delete never escapes the project', () => {
    const p = makeResidueProject();
    const outside = tmp('fkit-outside-');
    mkdirSync(join(outside, 'agents', 'sub'), { recursive: true });
    writeFileSync(join(outside, 'agents', 'precious.md'), 'the user\'s real work\n');
    writeFileSync(join(outside, 'agents', 'sub', 'deep.md'), 'nested, also not fkit\'s\n');
    writeFileSync(join(outside, 'run'), 'also outside\n');

    // .fkit itself is the symlink. Everything under it resolves outside the project.
    cleanup(join(p, '.fkit'));
    symlinkSync(outside, join(p, '.fkit'));
    const outsideBefore = manifest(outside);

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    // Nothing outside was DELETED, MUTATED, or CREATED. This was a one-way check until 0046: init's §4
    // was itself unguarded, so with .fkit symlinked it created .fkit/interview at the link target and a
    // "nothing appeared" freeze here would have failed for §4's reason and hidden this cleanup's. 0046
    // guarded §4 (see test/init-intake-guard.test.js), so the freeze the comment said was blocked is now
    // the assertion — and a second, independent net over the same escape, written by a different task.
    const outsideAfter = manifest(outside);
    assert.deepEqual([...outsideAfter], [...outsideBefore],
      'nothing outside the project may be deleted, mutated, or created — the parent chain must be checked, not just the leaf');
    assert.match(r.stderr, /symlink/);
    assert.ok(existsSync(join(p, '.fkit')), 'the symlink itself is left alone too');
  });

  test('a list line containing .. is refused and escapes nothing', () => {
    const claudeDir = copyClaude();
    const outside = tmp('fkit-outside-');
    writeFileSync(join(outside, 'precious'), 'must survive\n');
    // The rev-1 class of mistake, in its worst form: a list line that leaves the project entirely.
    writeFileSync(join(claudeDir, 'orphan-targets'), `../${outside.split('/').pop()}\n.omnigent\n`);
    const p = makeResidueProject();
    // Point the escape at a real sibling of the project so a successful escape would be observable.
    const sibling = join(p, '..', outside.split('/').pop());

    const r = runInitFrom(claudeDir, p);
    assert.ok(r.code === 0 || r.code === 3);
    assert.ok(existsSync(join(outside, 'precious')), 'a .. line must never delete outside the project');
    assert.match(r.stderr, /\.\.|escape/, 'and must say why it refused');
    assert.ok(!existsSync(sibling) || existsSync(outside), 'sanity');
    // Per-target, not all-or-nothing: the good line still runs.
    assert.ok(!existsSync(join(p, '.omnigent')), 'a valid target alongside a refused one is still cleaned');
  });

  test('non-fatal — a failed removal never bricks the launcher, and the loop carries on', async () => {
    const p = makeProject();
    seedResidue(p);
    // A read-only .fkit makes the unlink fail for everything under it — but .omnigent is elsewhere and
    // must still be cleaned. Without that assertion this test passes even if the loop aborts on the
    // first failure, which is precisely the bar it claims to defend (C7).
    chmodSync(join(p, '.fkit'), 0o500);
    try {
      const r = await runFkit(['coder'], { project: p });
      assert.equal(r.exec, true, 'fkit must still start the session');
      assert.match(r.stderr, /could not remove|PARTLY removed|did NOT remove/, 'must say what it could not do');
      assert.ok(!existsSync(join(p, '.omnigent')),
        'the loop must CONTINUE past a failure — an unaffected target is still cleaned');
    } finally {
      chmodSync(join(p, '.fkit'), 0o700);          // let the teardown clean up
    }
  });

  // ⛔ THE PARTIAL-DELETE ANNOUNCEMENT IS KNOWINGLY WRONG, AND THERE IS DELIBERATELY NO TEST HERE.
  //
  // Owner-ruled 2026-07-17 (review round 2, R6/R7): the three-state announcement catches only the FLAT
  // case. `ls -A | wc -l` counts one level; `rm -rf` recurses. Lock a target at 0500 with a writable
  // subdir and the nested contents are destroyed while the top-level count is unchanged — so fkit
  // announces "left as it is" about a subtree it has emptied. See the accepted residual
  // "Partial-delete announcement is shallow (R6)" in the review ledger.
  //
  // The test that used to sit here was DELETED rather than left, and that is the point (R7). It was
  // built on a comment claiming `rm -rf` needs write on the PARENT to unlink contents. That is false —
  // unlinking needs write on the directory holding the entry — so its `if (emptied)` branch was dead
  // code and its `else` asserted the WRONG message as correct. It made CI certify the bug. A test that
  // lies about a known-broken behavior is worse than the absence of one: it converts an open question
  // into a settled fact. If the residual is ever re-raised, write the test against the NESTED fixture
  // (0500 target, writable subdir) and run it red first.


  test('an unreadable target list fails CLOSED — nothing is deleted, init survives', () => {
    const claudeDir = copyClaude();
    chmodSync(join(claudeDir, 'orphan-targets'), 0o000);
    const p = makeResidueProject();
    try {
      const r = runInitFrom(claudeDir, p);
      assert.ok(r.code === 0 || r.code === 3, 'an unreadable list must not brick init');
      assert.match(r.stderr, /missing or unreadable/);
      // "Cannot read the list" is not "there are no targets". Never delete on a guess.
      for (const t of TARGETS) assert.ok(existsSync(join(p, t)), `${t} must survive an unreadable list`);
    } finally {
      chmodSync(join(claudeDir, 'orphan-targets'), 0o600);
    }
  });

  test('a missing target list skips the cleanup, non-fatally', () => {
    const claudeDir = copyClaude();
    cleanup(join(claudeDir, 'orphan-targets'));
    const p = makeResidueProject();
    const r = runInitFrom(claudeDir, p);
    assert.ok(r.code === 0 || r.code === 3, 'a missing list must not brick init');
    assert.match(r.stderr, /orphan-target list is missing/);
    assert.ok(existsSync(join(p, '.omnigent')), 'and must not guess at what to delete');
  });
});
