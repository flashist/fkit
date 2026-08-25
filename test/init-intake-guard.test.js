// The §4 intake-write contract (task 0046) — init must not write .fkit/interview through a symlink.
//
// §1 of fkit-claude-init.sh wrote the doctrine down ("`[ -L ]` is the one test that does not lie, so it
// has to come first") and §6 applies it to fkit's one delete outside the namespace it manages (0327:
// it is NOT its only unrecoverable one — §3's refresh is unrecoverable for a squatter). §4 never got
// it: `mkdir -p` and `cat >` both DEREFERENCE, so a symlinked `.fkit` put the intake script at the
// link target and a symlinked `.fkit/interview` OVERWROTE whatever file was there — both outside the
// project, both silent, both with init still exiting 0. Reproduced, not theorized.
//
// The interesting assertions here are the NEGATIVE ones, and they are written against a two-way
// manifest() freeze of the OUTSIDE directory rather than spot checks: manifest() only ever walks the
// tree it is handed, and a freeze of the project cannot see an escape *from* the project.
//
// A refusal is NOT a failure the user has to fix in order to launch — the same bar §1 sets. The intake
// is optional (the launcher probes `[ -x .fkit/interview ]` and lets the LLM interview instead when it
// is absent), so §4 warns on stderr and setup carries on. Half the tests below pin that non-fatality,
// because a guard that aborts init is a worse bug than the one it fixes.
//
// ⚠️ CONTAINMENT. A test for an escape bug must not itself escape. Every "outside" directory is
// mkdtempSync(join(tmpdir(), 'fkit-outside-')) — never a fixed path, never anything under the repo —
// and every one is removed in after(). The symlink escapes the throwaway PROJECT, which is the point;
// it never leaves os.tmpdir() and it never reaches the repo. `git status` stays clean.

import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, lstatSync, cpSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO, runInit, manifest, cleanup } from './harness.mjs';

const trash = [];
after(() => { trash.forEach(cleanup); });

function tmp(prefix) {
  const d = mkdtempSync(join(tmpdir(), prefix));
  trash.push(d);
  return d;
}

// A bare, already-set-up project: a copy of the scaffold's ai-agents/ and nothing else. Deliberately
// NOT makeProject() — that drives the launcher, and §4 is init's own contract.
function makeIntakeProject() {
  const dir = tmp('fkit-intake-');
  cpSync(join(REPO, 'claude', 'scaffold', 'ai-agents'), join(dir, 'ai-agents'), { recursive: true });
  return dir;
}

// A line from the heredoc body. Its presence proves the intake script was written intact — the net for
// the one mechanical mistake this change can make (reindenting a quoted heredoc, or moving its
// terminator off column 0).
const INTAKE_MARKER = '# fkit first-run intake.';

describe('A. a symlinked .fkit is refused — the intake never lands outside the project', () => {
  test('.fkit symlinked outside → refuse, nothing lands outside', () => {
    const p = makeIntakeProject();
    const outside = tmp('fkit-outside-');
    writeFileSync(join(outside, 'unrelated'), 'the user\'s own file\n');
    symlinkSync(outside, join(p, '.fkit'));
    const outsideBefore = manifest(outside);

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.ok(!existsSync(join(outside, 'interview')), 'the intake escaped the project');
    // Two-way freeze: nothing changed AND nothing appeared. A one-way check cannot see a CREATE, which
    // is precisely the shape of this bug.
    assert.deepEqual([...manifest(outside)], [...outsideBefore],
      'init wrote through the .fkit symlink — the outside directory must be untouched');
    assert.match(r.stderr, /skipped the \.fkit\/interview intake/);
    assert.match(r.stderr, /symlink/);
  });

  test('the refusal is non-fatal — §5 and the summary still run', () => {
    // Not in the red set: pre-fix this passes, because writing THROUGH the link also leaves §5 and the
    // summary reachable. It is here as the regression net for the guard itself — a guard that aborts
    // init would trade this bug for a worse one.
    const p = makeIntakeProject();
    const outside = tmp('fkit-outside-');
    symlinkSync(outside, join(p, '.fkit'));

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.ok(existsSync(join(p, '.gitignore')), '§5 must still run after a §4 refusal');
    assert.match(r.stdout, /Role-locked sessions/, 'the summary must still print after a §4 refusal');
  });

  test('.fkit a DANGLING symlink → refuse, init completes', () => {
    // `mkdir -p` on a dangling symlink FAILS on BSD/macOS, and init runs under `set -euo pipefail`:
    // pre-fix this does not "write through", it kills init at §4 and §5/§6/the summary never run.
    // The -L-first guard fixes both shapes, which is the point of checking -L before anything else.
    const p = makeIntakeProject();
    const outside = tmp('fkit-outside-');
    const target = join(outside, 'never-created');
    symlinkSync(target, join(p, '.fkit'));

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init died on a dangling .fkit (rc=${r.code})\n${r.stderr}`);
    assert.ok(!existsSync(target), 'the guard must not bring the dangling target into existence');
    assert.match(r.stderr, /skipped the \.fkit\/interview intake/);
    assert.match(r.stdout, /Role-locked sessions/, 'setup must complete past a dangling .fkit');
  });

  test('a symlinked LEAF is not written through', () => {
    // The destructive shape: `cat >` follows a symlinked leaf and overwrites the target in place, with
    // no rollback. -L on the leaf is the same walk that catches the parent — one call covers both.
    const p = makeIntakeProject();
    const outside = tmp('fkit-outside-');
    const victim = join(outside, 'victim');
    writeFileSync(victim, 'ORIGINAL user content\n');
    mkdirSync(join(p, '.fkit'), { recursive: true });
    symlinkSync(victim, join(p, '.fkit', 'interview'));
    const outsideBefore = manifest(outside);

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.equal(readFileSync(victim, 'utf8'), 'ORIGINAL user content\n',
      'init overwrote a file outside the project through a symlinked leaf');
    assert.deepEqual([...manifest(outside)], [...outsideBefore]);
    assert.match(r.stderr, /skipped the \.fkit\/interview intake/);
  });

  test('.fkit symlinked INSIDE the project is refused too', () => {
    // The rule is "no symlink anywhere in the chain", not "does it escape" — exactly as §1 and §6 have
    // it. Deciding escape means resolving the path, and resolving is how you get talked into a path you
    // did not mean. This is a real behaviour change and it is pinned here on purpose.
    const p = makeIntakeProject();
    mkdirSync(join(p, 'inner'), { recursive: true });
    symlinkSync(join(p, 'inner'), join(p, '.fkit'));

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.ok(!existsSync(join(p, 'inner', 'interview')), 'a symlinked component is refused wherever it points');
    assert.match(r.stderr, /skipped the \.fkit\/interview intake/);
  });
});

describe('B. the shared helper says what the caller is actually doing', () => {
  test('§6 says "delete", §4 says "write"', () => {
    // Both sections walk the same chain through the same helper in the same run. The verb is a
    // parameter so neither message goes vague — and keeping §6's byte-identical is what makes "the
    // extraction did not regress §6" checkable rather than asserted.
    const p = makeIntakeProject();
    const outside = tmp('fkit-outside-');
    mkdirSync(join(outside, 'agents'), { recursive: true });
    writeFileSync(join(outside, 'agents', 'residue.yaml'), 'name: fkit-coder\n');
    writeFileSync(join(outside, 'run'), '#!/bin/sh\necho omnigent\n');
    symlinkSync(outside, join(p, '.fkit'));

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.match(r.stderr, /'\.fkit' is a symlink — fkit will not delete through one/,
      "§6's refusal wording must not drift");
    assert.match(r.stderr, /'\.fkit' is a symlink — fkit will not write through one/,
      '§4 must refuse in its own verb');
  });
});

describe('C. the ordinary case is untouched (the control)', () => {
  test('ordinary .fkit → executable intake, idempotent', () => {
    // Must pass BOTH before and after the change. If this ever reds, the fix broke the happy path —
    // most likely by mangling the heredoc.
    const p = makeIntakeProject();

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    const intake = join(p, '.fkit', 'interview');
    assert.ok(existsSync(intake), 'the intake must still be installed on an ordinary project');
    const st = lstatSync(intake);
    assert.ok(st.isFile(), 'the intake must be a regular file, not a symlink');
    assert.ok((st.mode & 0o111) !== 0, 'the intake must be executable');
    const body = readFileSync(intake, 'utf8');
    assert.ok(body.includes(INTAKE_MARKER), 'the heredoc body was mangled');
    assert.ok(body.startsWith('#!/bin/sh\n'), 'the heredoc was reindented — the shebang must be at column 0');
    assert.match(r.stdout, /created intake \.fkit\/interview/);

    // Idempotent: a second run leaves it byte-identical.
    const before = manifest(join(p, '.fkit'));
    const r2 = runInit(p);
    assert.ok(r2.code === 0 || r2.code === 3, `second init rc=${r2.code}\n${r2.stderr}`);
    assert.deepEqual([...manifest(join(p, '.fkit'))], [...before]);
  });
});
