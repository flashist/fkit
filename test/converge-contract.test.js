// The convergence contract — task 28.
//
// What this suite defends: fkit tops up an EXISTING ai-agents/ with scaffold paths it does not have,
// on every launch, unattended, in the one code path that touches a user's own documents. The whole
// design rests on one owner-ratified invariant:
//
//     Convergence NEVER writes to a path that already exists.
//     Create-if-absent only. No overwrite, no move, no delete — ever — inside ai-agents/.
//
// There is no rollback and no dry-run BECAUSE of that invariant (no torn state — nothing is mutated,
// only added). So Group A is not "a test"; it is the thing that licenses the design. If it ever goes
// red, the feature is not "slightly broken", it is a different and much more dangerous feature.
//
// Runner: node --test, zero devDependencies (ADR-014 §4). Nothing here writes into the repo.

import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  existsSync, writeFileSync, mkdirSync, rmSync, readFileSync, symlinkSync, chmodSync, readdirSync,
} from 'node:fs';
import { join } from 'node:path';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import {
  runInit, runFkit, makeConvergeProject, manifest, cleanup, cleanupStub, SCAFFOLD, INIT,
} from './harness.mjs';

const projects = [];
function project() { const p = makeConvergeProject(); projects.push(p); return p; }
after(() => { for (const p of projects) cleanup(p); cleanupStub(); });

const aa = (p, ...rest) => join(p, 'ai-agents', ...rest);

// A project that looks like a REAL one someone has been working in: briefs in backlog (and therefore
// no .gitkeep there — people delete it once the dir has content), an edited README, and a
// knowledge-base predating task 25 (conventions/ only). This is the shape convergence exists for.
function realisticProject() {
  const p = project();
  for (const d of ['decisions', 'incidents', 'reports', 'history']) rmSync(aa(p, 'knowledge-base', d), { recursive: true, force: true });
  rmSync(aa(p, 'tasks', 'backlog', '.gitkeep'), { force: true });
  writeFileSync(aa(p, 'tasks', 'backlog', 'my-task.md'), '# A real brief\n');
  writeFileSync(aa(p, 'README.md'), 'MY OWN HEAVILY EDITED README\n');
  return p;
}

// =================================================================================================
// Group A — THE INVARIANT. The one that matters most, first.
// =================================================================================================
describe('Group A — the invariant: convergence never writes to a path that already exists', () => {
  test('1. every pre-existing file is byte-for-byte identical after a converging run', () => {
    const p = realisticProject();
    const before = manifest(aa(p));
    runInit(p);
    const after_ = manifest(aa(p));

    for (const [rel, hash] of before) {
      assert.ok(after_.has(rel), `pre-existing file was DELETED or MOVED: ${rel}`);
      assert.equal(after_.get(rel), hash, `pre-existing file was MODIFIED: ${rel}`);
    }
  });

  test('2. content drift is NOT fixed — an edited scaffold file is stepped over, deliberately', () => {
    // This is the accepted residual, and it is the SAME PROPERTY as the safety above: a drifted file
    // is a path that already exists. If this ever goes green-by-overwriting, the invariant is gone.
    const p = realisticProject();
    runInit(p);
    assert.equal(readFileSync(aa(p, 'README.md'), 'utf8'), 'MY OWN HEAVILY EDITED README\n');
  });

  test('3. the only delta is newly-created paths', () => {
    const p = realisticProject();
    const before = manifest(aa(p));
    runInit(p);
    const added = [...manifest(aa(p)).keys()].filter((k) => !before.has(k));
    // Everything new must be something the scaffold actually ships.
    for (const rel of added) assert.ok(existsSync(join(SCAFFOLD, rel)), `invented a path not in the scaffold: ${rel}`);
  });
});

// =================================================================================================
// Group B — it actually converges. The entire point of the task.
// =================================================================================================
describe('Group B — convergence', () => {
  test('1. a pre-task-25 knowledge-base gains decisions/, incidents/, reports/, history/', () => {
    const p = realisticProject();
    runInit(p);
    for (const d of ['decisions', 'incidents', 'reports', 'history']) {
      assert.ok(existsSync(aa(p, 'knowledge-base', d)), `did not converge: knowledge-base/${d}`);
    }
  });

  test('2. a missing nested file is restored', () => {
    const p = project();
    rmSync(aa(p, 'knowledge-base', 'conventions', 'status-report-format.md'));
    runInit(p);
    assert.ok(existsSync(aa(p, 'knowledge-base', 'conventions', 'status-report-format.md')));
  });

  test('3. idempotent — a second run creates nothing further', () => {
    const p = realisticProject();
    runInit(p);
    const after1 = manifest(aa(p));
    runInit(p);
    assert.deepEqual([...manifest(aa(p)).keys()].sort(), [...after1.keys()].sort());
  });
});

// =================================================================================================
// Group C — the .gitkeep rule. The one a naive create-if-absent implementation fails.
// =================================================================================================
describe('Group C — .gitkeep', () => {
  test('1. NOT resurrected in a directory that already existed', () => {
    // A user with real briefs in tasks/backlog/ has deleted its .gitkeep. Re-creating it on every
    // launch dirties `git status` forever — convergence quietly editing the user's repo.
    const p = realisticProject();
    runInit(p);
    assert.equal(existsSync(aa(p, 'tasks', 'backlog', '.gitkeep')), false,
      '.gitkeep was resurrected in a pre-existing directory');
  });

  test('2. still NOT resurrected after repeat runs', () => {
    const p = realisticProject();
    runInit(p); runInit(p); runInit(p);
    assert.equal(existsSync(aa(p, 'tasks', 'backlog', '.gitkeep')), false);
  });

  test('3. IS created when this pass created the directory', () => {
    const p = realisticProject();
    runInit(p);
    assert.ok(existsSync(aa(p, 'knowledge-base', 'reports', '.gitkeep')),
      'a newly-created empty dir must get its .gitkeep, or git will not carry it');
  });

  test('4. the rule covers every .gitkeep the scaffold ships (count is derived, not trusted)', () => {
    // Pinned against the scaffold itself so adding one later cannot quietly escape the rule.
    const p = project();
    const keeps = [...manifest(SCAFFOLD).keys()].filter((k) => k.endsWith('.gitkeep'));
    assert.ok(keeps.length > 0);
    for (const k of keeps) rmSync(aa(p, k));            // dirs remain, .gitkeeps gone
    runInit(p);
    for (const k of keeps) {
      assert.equal(existsSync(aa(p, k)), false, `resurrected .gitkeep in a pre-existing dir: ${k}`);
    }
  });
});

// =================================================================================================
// Group D — announce, and stay silent otherwise.
// =================================================================================================
describe('Group D — announcement', () => {
  test('1. a converging run says what it created', () => {
    const p = realisticProject();
    const r = runInit(p);
    assert.match(r.stderr, /added new paths to ai-agents\//);
    assert.match(r.stderr, /knowledge-base\/reports\//);
  });

  test('2. a converged project is COMPLETELY silent on stderr', () => {
    const p = realisticProject();
    runInit(p);
    const r = runInit(p);
    assert.equal(r.stderr.trim(), '', 'the happy path runs on every launch forever; it must say nothing');
  });

  test('3. ⚠️ THE TRAP — the announcement survives the launcher\'s `>/dev/null`', async () => {
    // Convergence ONLY ever fires on an already-set-up project, and that is exactly the project the
    // launcher silences init's stdout for. An announcement on stdout is therefore discarded 100% of
    // the time: implemented, invisible, and passing a naive "the code echoes it" review. This
    // assertion is the reason the announcement goes to stderr — it drives the REAL launcher.
    const p = realisticProject();
    mkdirSync(join(p, '.claude', 'agents'), { recursive: true });  // → the launcher's quiet branch
    writeFileSync(aa(p, 'knowledge-base', 'PROJECT.md'), '# Not fresh\n');
    const r = await runFkit(['coder'], { project: p });
    assert.match(r.stderr, /added new paths to ai-agents\//,
      'the user never saw it — the announcement was swallowed by the launcher');
  });
});

// =================================================================================================
// Group E — the opt-out. Deletion has to be respectable.
// =================================================================================================
describe('Group E — ai-agents/.fkit-keep-out', () => {
  test('1. a listed whole tree is not recreated', () => {
    const p = project();
    rmSync(aa(p, 'wiki-vault'), { recursive: true, force: true });
    writeFileSync(aa(p, '.fkit-keep-out'), '# not using the wiki\nwiki-vault\n');
    runInit(p);
    assert.equal(existsSync(aa(p, 'wiki-vault')), false);
  });

  test('2. it holds across repeat launches, and stays silent about it', () => {
    const p = project();
    rmSync(aa(p, 'wiki-vault'), { recursive: true, force: true });
    writeFileSync(aa(p, '.fkit-keep-out'), 'wiki-vault/\n');   // trailing slash tolerated
    runInit(p);
    const r = runInit(p);
    assert.equal(existsSync(aa(p, 'wiki-vault')), false);
    assert.equal(r.stderr.trim(), '');
  });

  test('3. a single file can be opted out', () => {
    const p = project();
    rmSync(aa(p, 'knowledge-base', 'conventions', 'status-report-format.md'));
    writeFileSync(aa(p, '.fkit-keep-out'), 'knowledge-base/conventions/status-report-format.md\n');
    runInit(p);
    assert.equal(existsSync(aa(p, 'knowledge-base', 'conventions', 'status-report-format.md')), false);
  });

  test('4. it opts out only what it names', () => {
    const p = realisticProject();
    writeFileSync(aa(p, '.fkit-keep-out'), 'knowledge-base/reports\n');
    runInit(p);
    assert.equal(existsSync(aa(p, 'knowledge-base', 'reports')), false);
    assert.ok(existsSync(aa(p, 'knowledge-base', 'incidents')), 'an unlisted path must still converge');
  });

  // --- round-1 review fixes ---------------------------------------------------------------------

  test('6. R1 — an UNREADABLE keep-out fails CLOSED: refuse loudly, converge nothing', () => {
    // It failed OPEN and SILENTLY: chmod 000 → "no opt-outs" → the deliberately-deleted folder was
    // resurrected on every launch, and the announcement then listed the very path opted out of. We
    // know intent was recorded and cannot read it; guessing "they meant nothing" is worst exactly here.
    const p = project();
    rmSync(aa(p, 'wiki-vault'), { recursive: true, force: true });
    rmSync(aa(p, 'knowledge-base', 'reports'), { recursive: true, force: true });
    const ko = aa(p, '.fkit-keep-out');
    writeFileSync(ko, 'wiki-vault\n');
    chmodSync(ko, 0o000);
    try {
      const r = runInit(p);
      assert.match(r.stderr, /\.fkit-keep-out cannot be read/);
      assert.equal(existsSync(aa(p, 'wiki-vault')), false, 'opt-out failed OPEN — the folder came back');
      assert.equal(existsSync(aa(p, 'knowledge-base', 'reports')), false,
        'refusing must converge NOTHING — fkit does not guess around an unreadable opt-out');
    } finally { chmodSync(ko, 0o644); }
  });

  test('7. R1 — a keep-out that is a DIRECTORY also fails closed', () => {
    const p = project();
    rmSync(aa(p, 'wiki-vault'), { recursive: true, force: true });
    mkdirSync(aa(p, '.fkit-keep-out'));
    const r = runInit(p);
    assert.match(r.stderr, /\.fkit-keep-out cannot be read/);
    assert.equal(existsSync(aa(p, 'wiki-vault')), false);
  });

  // A CWD that a `wiki-*` glob WOULD match. This bait is the whole test: without it the pattern
  // expands to nothing, bash leaves it literal by default, and the bug hides — which is exactly how
  // the first version of these two assertions passed against the unfixed code.
  function cwdWithGlobBait() {
    const d = mkdtempSync(join(tmpdir(), 'fkit-bait-'));
    projects.push(d);
    writeFileSync(join(d, 'wiki-vault'), 'bait\n');
    return d;
  }

  test('8. R3 — entries are matched literally, never glob-expanded against the CWD', () => {
    // `for k in $keep_out` unquoted → globbing. A `wiki-*` line was expanded against the LAUNCHER'S
    // CWD, so the same repo with the same opt-out converged differently depending on where you ran
    // fkit from. Pinning IFS did not cover this; `set -f` does. These are path patterns, not globs.
    const p = project();
    rmSync(aa(p, 'wiki-vault'), { recursive: true, force: true });
    writeFileSync(aa(p, '.fkit-keep-out'), 'wiki-*\n');
    // Literally, `wiki-*` matches no scaffold path → wiki-vault must come BACK, even though a file
    // named wiki-vault sits in the CWD. If globbing leaks, the CWD silently opts the user out.
    const r = spawnSync(INIT, [p], { cwd: cwdWithGlobBait(), stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
    assert.equal(r.status, 0);
    assert.ok(existsSync(aa(p, 'wiki-vault')),
      'the CWD glob-matched a keep-out entry — convergence depends on where fkit was launched');
  });

  test('9. R3 — the same keep-out gives the same result from ANY working directory', () => {
    const results = [];
    for (const cwd of [cwdWithGlobBait(), tmpdir()]) {
      const p = project();
      rmSync(aa(p, 'wiki-vault'), { recursive: true, force: true });
      writeFileSync(aa(p, '.fkit-keep-out'), 'wiki-*\n');
      spawnSync(INIT, [p], { cwd, stdio: 'ignore' });
      results.push(existsSync(aa(p, 'wiki-vault')));
    }
    assert.equal(new Set(results).size, 1,
      `convergence depended on the CWD fkit was launched from: ${JSON.stringify(results)}`);
  });

  test('5. ⚠️ it lives in ai-agents/ (tracked) — NOT .fkit/ (gitignored), so it survives a clone', () => {
    // The trap that killed the version cursor: an opt-out under .fkit/ is invisible to a teammate who
    // clones, and THEIR launch resurrects the folder the owner deliberately deleted. Assert the file
    // fkit reads is one git would actually carry.
    const p = project();
    rmSync(aa(p, 'wiki-vault'), { recursive: true, force: true });
    writeFileSync(aa(p, '.fkit-keep-out'), 'wiki-vault\n');
    runInit(p);
    const gi = join(p, '.gitignore');
    const ignored = existsSync(gi) ? readFileSync(gi, 'utf8') : '';
    assert.equal(ignored.split('\n').some((l) => l.trim() === 'ai-agents/'), false);
    assert.ok(existsSync(aa(p, '.fkit-keep-out')), 'the opt-out must be a real file inside the tracked tree');

    // and a fresh clone-shaped copy (tracked files only) still honours it
    const clone = mkdtempSync(join(tmpdir(), 'fkit-clone-'));
    projects.push(clone);
    mkdirSync(join(clone, 'ai-agents'), { recursive: true });
    writeFileSync(join(clone, 'ai-agents', '.fkit-keep-out'), 'wiki-vault\n');
    runInit(clone);
    assert.equal(existsSync(aa(clone, 'wiki-vault')), false, 'the opt-out did not survive the clone');
  });
});

// =================================================================================================
// Group F — hazards. Every convergence write inherits the symlink hazard (tasks 26 + 27).
// =================================================================================================
describe('Group F — weird state and failure', () => {
  test('1. a symlinked SUBDIR is not written through — the seam per-path writes created', () => {
    // The preflight only guards ai-agents/ itself. ai-agents/knowledge-base -> /elsewhere reads as a
    // real directory to -d, and mkdir/cp would land OUTSIDE the project fkit was pointed at.
    const p = project();
    const outside = mkdtempSync(join(tmpdir(), 'fkit-outside-'));
    projects.push(outside);
    rmSync(aa(p, 'knowledge-base'), { recursive: true, force: true });
    symlinkSync(outside, aa(p, 'knowledge-base'));
    const r = runInit(p);
    assert.match(r.stderr, /is a symlink/);
    assert.deepEqual(readdirSync(outside), [], 'fkit wrote through a symlink, outside the project');
  });

  test('2. a file where a directory belongs → refuse the subtree, do not clobber the file', () => {
    const p = project();
    rmSync(aa(p, 'knowledge-base'), { recursive: true, force: true });
    writeFileSync(aa(p, 'knowledge-base'), 'i am a file\n');
    const r = runInit(p);
    assert.match(r.stderr, /is not a directory/);
    assert.equal(readFileSync(aa(p, 'knowledge-base'), 'utf8'), 'i am a file\n');
  });

  test('4. R4 — an unreadable existing dir is refused ONCE, not warned about per child forever', () => {
    // We used to descend anyway: `[ -e ]` is false for every child (we cannot stat them, not that they
    // are absent), so we tried to re-create files that already exist and emitted a warning per child,
    // on every launch, forever. Warning noise is how a real refusal stops being read.
    const p = project();
    chmodSync(aa(p, 'wiki-vault'), 0o000);
    try {
      const r = runInit(p);
      const noise = (r.stderr.match(/could not create/g) || []).length;
      assert.equal(noise, 0, `emitted ${noise} bogus "could not create" warnings for paths that exist`);
      assert.match(r.stderr, /cannot be read into/);
    } finally { chmodSync(aa(p, 'wiki-vault'), 0o755); }
  });

  test('3. non-fatal — a failed convergence write never costs the user the rest of setup', () => {
    const p = project();
    rmSync(aa(p, 'knowledge-base', 'reports'), { recursive: true, force: true });
    chmodSync(aa(p, 'knowledge-base'), 0o555);           // read-only: the mkdir must fail
    try {
      const r = runInit(p);
      assert.match(r.stderr, /could not create ai-agents\/knowledge-base\/reports/);
      assert.equal(r.code, 0, 'init must not die on a convergence write failure');
      assert.ok(existsSync(join(p, '.claude', 'agents', 'fkit-coder.md')),
        'the rest of setup must still run — a user must always be able to reach their agents');
    } finally {
      chmodSync(aa(p, 'knowledge-base'), 0o755);         // or the temp dir cannot be cleaned up
    }
  });
});

// =================================================================================================
// Group G — the fresh path must not regress. It is the one that already worked.
// =================================================================================================
describe('Group G — fresh project', () => {
  test('1. an empty dir still gets the full scaffold, byte-for-byte', () => {
    const p = mkdtempSync(join(tmpdir(), 'fkit-fresh-'));
    projects.push(p);
    const r = runInit(p);
    assert.match(r.stdout, /created ai-agents\/ \(from scaffold\)/);
    assert.deepEqual([...manifest(aa(p))].sort(), [...manifest(SCAFFOLD)].sort(),
      'the fresh-project tree drifted from the scaffold');
  });

  test('2. a fresh project says nothing about convergence — it did not converge', () => {
    const p = mkdtempSync(join(tmpdir(), 'fkit-fresh2-'));
    projects.push(p);
    const r = runInit(p);
    assert.doesNotMatch(r.stderr, /added new paths/);
  });
});
