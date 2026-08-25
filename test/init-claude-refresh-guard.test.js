// The §3 .claude/ refresh contract (task 0327) — init must not refresh through a symlink.
//
// §1 of fkit-claude-init.sh wrote the doctrine down ("`[ -L ]` is the one test that does not lie, so it
// has to come first"), §6 applies it to the orphan cleanup and §4 got it in 0046. §3 never did — and §3
// is the site with the WORST consequence, because it is the one that DELETES before it copies:
// `mkdir -p`, `rm -f`, `rm -rf` and `cp`/`cp -R` all DEREFERENCE. With `.claude` symlinked out of the
// project this removed the user's `agents/fkit-*.md` and `rm -rf`'d their `skills/fkit-*/` AT THE LINK
// TARGET, wrote the whole fkit payload out there, and exited 0 with an empty stderr. Reproduced, not
// theorized — and a symlinked `.claude/agents` or `.claude/skills` does the same one half at a time.
//
// TWO guarded halves, not one, because the halves fail independently and are independently survivable:
// a symlinked `.claude/skills` must not cost the user their agents. A2 and A3 are what assert that.
//
// A refusal is NOT a failure the user has to fix in order to launch — the same bar §1, §4 and 0088 set.
// §3 warns on stderr and setup carries on, and init's exit status is UNCHANGED (owner ruling, 0327 Q1a).
// A known and accepted consequence of that ruling: on a FRESH project with a symlinked `.claude` the
// session start then fails with Claude Code's own "agent not found" rather than fkit's. Nothing is
// destroyed, which is the point. Do not "fix" that here — see the task's plan §6 Q1.
//
// The interesting assertions are the NEGATIVE ones, and they are written against a two-way manifest()
// freeze of the OUTSIDE directory rather than spot checks: manifest() only ever walks the tree it is
// handed, and a freeze of the project cannot see an escape *from* the project.
//
// Counts are DERIVED from claude/agents and claude/skills, never hardcoded, so adding a role or a skill
// later cannot red this suite.
//
// ⚠️ CONTAINMENT. A test for an escape bug must not itself escape. Every "outside" directory is
// mkdtempSync(join(tmpdir(), 'fkit-outside-')) and every project is mkdtempSync(join(tmpdir(),
// 'fkit-refresh-')) — never a fixed path, never anything under the repo — and every one is removed in
// after(). The symlink escapes the throwaway PROJECT, which is the point; it never leaves os.tmpdir()
// and it never reaches the repo. `git status` stays clean.

import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, lstatSync, cpSync, symlinkSync } from 'node:fs';
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
// NOT makeProject() — that drives the launcher, and §3 is init's own contract.
function makeRefreshProject() {
  const dir = tmp('fkit-refresh-');
  cpSync(join(REPO, 'claude', 'scaffold', 'ai-agents'), join(dir, 'ai-agents'), { recursive: true });
  return dir;
}

// Derived, not hardcoded — exactly the sets §3's two globs copy.
const AGENTS = readdirSync(join(REPO, 'claude', 'agents'))
  .filter((n) => n.startsWith('fkit-') && n.endsWith('.md')).sort();
const SKILLS = readdirSync(join(REPO, 'claude', 'skills'), { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name.startsWith('fkit-')).map((e) => e.name).sort();

// What §3 actually installed into a project, by name, counting only REGULAR files / REAL directories.
function installedAgents(p) {
  const d = join(p, '.claude', 'agents');
  if (!existsSync(d)) return [];
  return readdirSync(d, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.startsWith('fkit-') && e.name.endsWith('.md'))
    .map((e) => e.name).sort();
}
function installedSkills(p) {
  const d = join(p, '.claude', 'skills');
  if (!existsSync(d)) return [];
  return readdirSync(d, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith('fkit-'))
    .map((e) => e.name).sort();
}

// Seed an "outside" dir with the user's own fkit-named agent + skill — i.e. exactly what the bug ate.
function seedVictimTree(outside) {
  mkdirSync(join(outside, 'agents'), { recursive: true });
  mkdirSync(join(outside, 'skills', 'fkit-myskill'), { recursive: true });
  writeFileSync(join(outside, 'agents', 'fkit-mine.md'), "the user's own agent\n");
  writeFileSync(join(outside, 'skills', 'fkit-myskill', 'SKILL.md'), "the user's own skill\n");
  writeFileSync(join(outside, 'unrelated'), "the user's own file\n");
}

describe('A. a symlink anywhere in the .claude chain is refused — the refresh never lands outside', () => {
  test('A1 — .claude symlinked outside → both halves refused, nothing outside is touched', () => {
    const p = makeRefreshProject();
    const outside = tmp('fkit-outside-');
    seedVictimTree(outside);
    symlinkSync(outside, join(p, '.claude'));
    const outsideBefore = manifest(outside);

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.ok(existsSync(join(outside, 'agents', 'fkit-mine.md')),
      "init DELETED the user's own agent through the .claude symlink");
    assert.ok(existsSync(join(outside, 'skills', 'fkit-myskill', 'SKILL.md')),
      "init rm -rf'd the user's own skill through the .claude symlink");
    // Two-way freeze: nothing changed AND nothing appeared. A one-way check cannot see a CREATE, and
    // this bug both deletes and creates.
    assert.deepEqual([...manifest(outside)], [...outsideBefore],
      'init refreshed through the .claude symlink — the outside directory must be untouched');
    assert.match(r.stderr, /skipped the \.claude\/agents refresh/);
    assert.match(r.stderr, /skipped the \.claude\/skills refresh/);
    assert.ok(!/• refreshed /.test(r.stdout),
      'init announced a refresh it did not perform');
  });

  test('A2 — .claude/skills symlinked outside → skills refused, AGENTS STILL INSTALL', () => {
    // The halves fail independently and must survive independently: a symlinked skills dir must not
    // cost the user their agents. This is the assertion that forces two path_contained calls, not one.
    const p = makeRefreshProject();
    const outside = tmp('fkit-outside-');
    mkdirSync(join(outside, 'fkit-myskill'), { recursive: true });
    writeFileSync(join(outside, 'fkit-myskill', 'SKILL.md'), "the user's own skill\n");
    writeFileSync(join(outside, 'unrelated'), "the user's own file\n");
    mkdirSync(join(p, '.claude'), { recursive: true });
    symlinkSync(outside, join(p, '.claude', 'skills'));
    const outsideBefore = manifest(outside);

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.ok(existsSync(join(outside, 'fkit-myskill', 'SKILL.md')),
      "init rm -rf'd the user's own skill through the .claude/skills symlink");
    assert.deepEqual([...manifest(outside)], [...outsideBefore],
      'init refreshed through the .claude/skills symlink — the outside directory must be untouched');
    // The surviving half really ran, and landed as real files inside the project.
    assert.deepEqual(installedAgents(p), AGENTS,
      'a refused skills half must not cost the user their agents');
    for (const a of AGENTS) {
      assert.ok(lstatSync(join(p, '.claude', 'agents', a)).isFile(), `${a} must be a regular file`);
    }
    assert.match(r.stderr, /skipped the \.claude\/skills refresh/);
    assert.ok(!/skipped the \.claude\/agents refresh/.test(r.stderr),
      'the agents half was not symlinked and must not be refused');
    assert.match(r.stdout, new RegExp(`• refreshed ${AGENTS.length} agents → \\.claude/agents/$`, 'm'));
    assert.ok(!/skills → \.claude\/skills\//.test(r.stdout),
      'init announced a skills refresh it did not perform');
  });

  test('A3 — .claude/agents symlinked outside → agents refused, SKILLS STILL INSTALL', () => {
    const p = makeRefreshProject();
    const outside = tmp('fkit-outside-');
    writeFileSync(join(outside, 'fkit-mine.md'), "the user's own agent\n");
    writeFileSync(join(outside, 'unrelated'), "the user's own file\n");
    mkdirSync(join(p, '.claude'), { recursive: true });
    symlinkSync(outside, join(p, '.claude', 'agents'));
    const outsideBefore = manifest(outside);

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.ok(existsSync(join(outside, 'fkit-mine.md')),
      "init DELETED the user's own agent through the .claude/agents symlink");
    assert.deepEqual([...manifest(outside)], [...outsideBefore],
      'init refreshed through the .claude/agents symlink — the outside directory must be untouched');
    assert.deepEqual(installedSkills(p), SKILLS,
      'a refused agents half must not cost the user their skills');
    for (const s of SKILLS) {
      assert.ok(lstatSync(join(p, '.claude', 'skills', s)).isDirectory(), `${s} must be a real directory`);
    }
    assert.match(r.stderr, /skipped the \.claude\/agents refresh/);
    assert.ok(!/skipped the \.claude\/skills refresh/.test(r.stderr),
      'the skills half was not symlinked and must not be refused');
    assert.match(r.stdout, new RegExp(`• refreshed ${SKILLS.length} skills → \\.claude/skills/$`, 'm'));
    assert.ok(!/agents → \.claude\/agents\//.test(r.stdout),
      'init announced an agents refresh it did not perform');
  });

  test('A4 — .claude a DANGLING symlink → refuse, init COMPLETES', () => {
    // `mkdir -p` on a dangling symlink FAILS on BSD/macOS, and init runs under `set -euo pipefail`:
    // pre-fix this does not "write through", it kills init AT :527 and §4/§5/§6/the summary never run.
    // Which is exactly why the guard has to sit BEFORE the mkdir — a guard after it never runs at all.
    const p = makeRefreshProject();
    const outside = tmp('fkit-outside-');
    const target = join(outside, 'never-created');
    symlinkSync(target, join(p, '.claude'));

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init died on a dangling .claude (rc=${r.code})\n${r.stderr}`);
    assert.ok(!existsSync(target), 'the guard must not bring the dangling target into existence');
    assert.match(r.stderr, /skipped the \.claude\/agents refresh/);
    assert.match(r.stderr, /skipped the \.claude\/skills refresh/);
    assert.ok(existsSync(join(p, '.gitignore')), '§5 must still run after a §3 refusal');
    assert.match(r.stdout, /Role-locked sessions/, 'setup must complete past a dangling .claude');
  });

  test('A5 — .claude symlinked INSIDE the project is refused too', () => {
    // The rule is "no symlink anywhere in the chain", not "does it escape" — exactly as §1, §4 and §6
    // have it. Deciding escape means resolving the path, and resolving is how you get talked into a
    // path you did not mean. This is a real behaviour change and it is pinned here on purpose.
    const p = makeRefreshProject();
    mkdirSync(join(p, 'inner'), { recursive: true });
    symlinkSync(join(p, 'inner'), join(p, '.claude'));

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.deepEqual(readdirSync(join(p, 'inner')), [],
      'a symlinked component is refused wherever it points');
    assert.match(r.stderr, /skipped the \.claude\/agents refresh/);
    assert.match(r.stderr, /skipped the \.claude\/skills refresh/);
  });

  test('A6 — a fkit-* ENTRY under .claude/skills symlinked outside → refused, the target survives', () => {
    // One level BELOW the guarded leaf, and the guard above cannot see it: `path_contained
    // ".claude/skills"` walks `.claude` and `skills` and stops — it never walks the `fkit-*` entries
    // the `rm -rf` actually names. The rm loop's glob carries a TRAILING SLASH, which resolves the
    // link before `rm` is even reached, so the LINK TARGET's whole tree goes. Measured against the
    // round-1 tree: the outside dir was deleted, rc 0, empty stderr, and stdout announced a refresh
    // of all 7 agents and 26 skills as if it had worked (0327 review R1).
    const p = makeRefreshProject();
    const outside = tmp('fkit-outside-');
    mkdirSync(join(outside, 'precious'), { recursive: true });
    writeFileSync(join(outside, 'precious', 'data.txt'), "the user's own data\n");
    writeFileSync(join(outside, 'unrelated'), "the user's own file\n");
    mkdirSync(join(p, '.claude', 'skills'), { recursive: true });
    symlinkSync(join(outside, 'precious'), join(p, '.claude', 'skills', 'fkit-evil'));
    const outsideBefore = manifest(outside);

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.ok(existsSync(join(outside, 'precious', 'data.txt')),
      "init rm -rf'd the user's tree through a symlinked .claude/skills/fkit-* entry");
    assert.deepEqual([...manifest(outside)], [...outsideBefore],
      'init refreshed through a symlinked fkit-* entry — the outside directory must be untouched');
    // The link itself is left exactly as the user left it — refusing is not a licence to delete it.
    assert.ok(lstatSync(join(p, '.claude', 'skills', 'fkit-evil')).isSymbolicLink(),
      "the user's own symlink must survive the refusal");
    assert.match(r.stderr, /skipped the \.claude\/skills refresh/);
    assert.match(r.stderr, /'fkit-evil' is a symlink — fkit will not refresh through one/,
      'the refusal must name the offending entry, not just the directory');
    // The other half is independent and must still land — the same rule A2 pins one level up.
    assert.deepEqual(installedAgents(p), AGENTS,
      'a refused skills half must not cost the user their agents');
    assert.ok(!/skills → \.claude\/skills\//.test(r.stdout),
      'init announced a skills refresh it did not perform');
  });

  test('A7 — a DANGLING fkit-* entry under .claude/skills → refuse, init COMPLETES', () => {
    // The rm loop's `fkit-*/` glob cannot see a dangling link at all (`[ -d ]` is false), so pre-fix
    // it survived to the `cp -R` — and when its name collides with a payload skill, cp died with
    // "Not a directory" under `set -euo pipefail`: rc 1, a bare cp error with NO fkit refusal, and
    // §5 (.gitignore) and §6 (orphan cleanup) never ran (0327 review R2). A symlink to a FILE is the
    // same shape. The name is DERIVED from the payload so adding or renaming a skill cannot rot it.
    const p = makeRefreshProject();
    const outside = tmp('fkit-outside-');
    const target = join(outside, 'never-created');
    mkdirSync(join(p, '.claude', 'skills'), { recursive: true });
    symlinkSync(target, join(p, '.claude', 'skills', SKILLS[0]));

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3,
      `init died on a dangling .claude/skills/${SKILLS[0]} (rc=${r.code})\n${r.stderr}`);
    assert.ok(!existsSync(target), 'the guard must not bring the dangling target into existence');
    assert.match(r.stderr, /skipped the \.claude\/skills refresh/);
    assert.match(r.stderr, new RegExp(`'${SKILLS[0]}' is a symlink — fkit will not refresh through one`));
    assert.ok(!/cp: /.test(r.stderr), 'init must refuse in its own words, not die inside cp');
    assert.ok(existsSync(join(p, '.gitignore')), '§5 must still run after a §3 refusal');
    assert.match(r.stdout, /Role-locked sessions/, 'setup must complete past a dangling fkit-* entry');
    assert.deepEqual(installedAgents(p), AGENTS,
      'a refused skills half must not cost the user their agents');
  });
});

describe('B. the shared helper says what the caller is actually doing', () => {
  test('B1 — §3 says "refresh", §4 still says "write", §6 still says "delete"', () => {
    // All three sections walk the same chain through the same helper in the same run. The verb is a
    // parameter so no message goes vague — and keeping §4's and §6's byte-identical is what makes
    // "adding §3's call did not regress them" checkable rather than asserted.
    const p = makeRefreshProject();
    const fkitOutside = tmp('fkit-outside-');
    mkdirSync(join(fkitOutside, 'agents'), { recursive: true });
    writeFileSync(join(fkitOutside, 'agents', 'residue.yaml'), 'name: fkit-coder\n');
    writeFileSync(join(fkitOutside, 'run'), '#!/bin/sh\necho omnigent\n');
    symlinkSync(fkitOutside, join(p, '.fkit'));
    const claudeOutside = tmp('fkit-outside-');
    seedVictimTree(claudeOutside);
    symlinkSync(claudeOutside, join(p, '.claude'));

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.match(r.stderr, /'\.claude' is a symlink — fkit will not refresh through one/,
      '§3 must refuse in its own verb');
    assert.match(r.stderr, /'\.fkit' is a symlink — fkit will not write through one/,
      "§4's refusal wording must not drift");
    assert.match(r.stderr, /'\.fkit' is a symlink — fkit will not delete through one/,
      "§6's refusal wording must not drift");
  });
});

describe('C. the ordinary case is untouched (the control)', () => {
  test('C1 — ordinary project → both halves install, summary byte-identical, idempotent', () => {
    // Must pass BOTH before and after the change. If this ever reds, the fix broke the happy path.
    const p = makeRefreshProject();
    // A user's OWN agent and skill, under non-fkit- names: these must survive the refresh untouched.
    mkdirSync(join(p, '.claude', 'agents'), { recursive: true });
    mkdirSync(join(p, '.claude', 'skills', 'my-skill'), { recursive: true });
    writeFileSync(join(p, '.claude', 'agents', 'my-agent.md'), "the user's own agent\n");
    writeFileSync(join(p, '.claude', 'skills', 'my-skill', 'SKILL.md'), "the user's own skill\n");

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.deepEqual(installedAgents(p), AGENTS);
    assert.deepEqual(installedSkills(p), SKILLS);
    for (const a of AGENTS) {
      assert.ok(lstatSync(join(p, '.claude', 'agents', a)).isFile(), `${a} must be a regular file`);
    }
    for (const s of SKILLS) {
      assert.ok(lstatSync(join(p, '.claude', 'skills', s)).isDirectory(), `${s} must be a real directory`);
    }
    // The announcement, byte-identical to what it has always been when both halves run.
    assert.ok(r.stdout.includes(
      `• refreshed ${AGENTS.length} agents → .claude/agents/, ${SKILLS.length} skills → .claude/skills/\n`),
      `the both-halves summary line drifted:\n${r.stdout}`);
    assert.ok(!/skipped the \.claude\//.test(r.stderr), 'an ordinary project must not be refused');
    // The user's own non-fkit- names are never touched.
    assert.equal(readFileSync(join(p, '.claude', 'agents', 'my-agent.md'), 'utf8'), "the user's own agent\n");
    assert.equal(readFileSync(join(p, '.claude', 'skills', 'my-skill', 'SKILL.md'), 'utf8'), "the user's own skill\n");

    // Idempotent: a second run leaves .claude/ byte-identical.
    const before = manifest(join(p, '.claude'));
    const r2 = runInit(p);
    assert.ok(r2.code === 0 || r2.code === 3, `second init rc=${r2.code}\n${r2.stderr}`);
    assert.deepEqual([...manifest(join(p, '.claude'))], [...before]);
  });
});

describe('D. what the corrected "only unrecoverable delete" wording rests on', () => {
  test('D1 — a REAL user path squatting the fkit-* namespace is deleted and NOT put back', () => {
    // C1 pins the other side: non-fkit- names survive untouched. This pins the side the corrected
    // comments actually claim — §3's header, §6's header, claude/orphan-targets and
    // test/orphan-cleanup.test.js all now say in words that §3's delete is recoverable only for
    // fkit's OWN payload names, and unrecoverable for a user path squatting that namespace. Nothing
    // else pinned that, so the comments could go false in silence (0327 review R3/R5).
    //
    // A REAL file and a REAL directory on purpose — a symlinked squatter is A6/A7's refusal, and the
    // two must not be confused: fkit refuses the symlink and deletes the real one.
    const p = makeRefreshProject();
    mkdirSync(join(p, '.claude', 'agents'), { recursive: true });
    mkdirSync(join(p, '.claude', 'skills', 'fkit-myskill'), { recursive: true });
    writeFileSync(join(p, '.claude', 'agents', 'fkit-mine.md'), "the user's own agent\n");
    writeFileSync(join(p, '.claude', 'skills', 'fkit-myskill', 'SKILL.md'), "the user's own skill\n");

    const r = runInit(p);
    assert.ok(r.code === 0 || r.code === 3, `init rc=${r.code}\n${r.stderr}`);
    assert.ok(!existsSync(join(p, '.claude', 'agents', 'fkit-mine.md')),
      "§3's rm -f leaves a user's fkit-named agent alone — the comments say it does not");
    assert.ok(!existsSync(join(p, '.claude', 'skills', 'fkit-myskill')),
      "§3's rm -rf leaves a user's fkit-named skill alone — the comments say it does not");
    // "NOT put back" is the second half of the claim: neither name is in the payload, so the `cp`
    // that follows cannot restore them. Derived from claude/, never hardcoded.
    assert.ok(!AGENTS.includes('fkit-mine.md'), 'the payload would restore it — the claim is wrong');
    assert.ok(!SKILLS.includes('fkit-myskill'), 'the payload would restore it — the claim is wrong');
    // And it is a delete, not a partial refresh: the payload still lands in full.
    assert.deepEqual(installedAgents(p), AGENTS);
    assert.deepEqual(installedSkills(p), SKILLS);
  });
});
