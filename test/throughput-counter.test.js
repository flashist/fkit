// The throughput-counter suite — claude/skills/fkit-status/throughput.mjs (task 0359).
//
// SCOPE: the same recorded widening dashboard-contract.test.js rides — ADR-017 rule 4 admits "the
// stdout contract of a shipped skill executable" as fkit's third tested thing. This is the second
// such executable. Not a new fence, the existing one.
//
// ⚠️ NOTHING HERE ASSERTS AGAINST THE LIVE, MOVING CORPUS. The repo's open-task count changes every
// time a task closes, so an assertion on today's number is a test that goes red for being correct.
// Every assertion runs against either (a) a throwaway git repo built in os.tmpdir(), or (b) the
// PINNED revision a9c2709 — a commit, not a moving target. Live-corpus reads are t.diagnostic only.
//
// ⚠️ Invoked as `node <path>`, never `bash <path>` and never `./<path>`. dashboard.sh reaches
// exec-bit independence through `bash` because it is shell; this file is JavaScript, and `bash` on a
// .mjs exits 2 with "command not found". The interpreter differs; the reason for naming one does not.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { REPO, cleanup } from './harness.mjs';
import { classify, isoWeek, foldTransitions, briefIdentity, parseArgs }
  from '../claude/skills/fkit-status/throughput.mjs';

const SCRIPT = join(REPO, 'claude', 'skills', 'fkit-status', 'throughput.mjs');
const BASELINE_REV = 'a9c2709';          // the 2026-08-29 tree: 129 open task folders
const MADE = [];
after(() => MADE.forEach(cleanup));

// --- 1. isoWeek: the pure date function, incl. the boundaries strftime gets wrong ------------------

test('isoWeek/basic — a mid-year date lands in its ISO week', () => {
  assert.equal(isoWeek('2026-07-21T17:10:29+03:00'), '2026-W30');
  assert.equal(isoWeek('2026-08-29T09:00:00+03:00'), '2026-W35');
});

test('isoWeek/week-boundary — Monday starts the week, Sunday ends the previous one', () => {
  assert.equal(isoWeek('2026-07-19'), '2026-W29');   // Sunday
  assert.equal(isoWeek('2026-07-20'), '2026-W30');   // Monday
  assert.equal(isoWeek('2026-07-26'), '2026-W30');   // Sunday
});

test('isoWeek/year-boundary — the ISO year is the Thursday\'s year, not the date\'s', () => {
  // 1 Jan 2027 is a Friday, so it belongs to ISO week 53 of 2026.
  assert.equal(isoWeek('2027-01-01'), '2026-W53');
  assert.equal(isoWeek('2026-12-31'), '2026-W53');
  // 1 Jan 2026 is a Thursday — week 1 of its own year.
  assert.equal(isoWeek('2026-01-01'), '2026-W01');
  // 31 Dec 2024 is a Tuesday, and belongs to week 1 of 2025.
  assert.equal(isoWeek('2024-12-31'), '2025-W01');
});

test('isoWeek/unparseable — refuses rather than guessing', () => {
  assert.throws(() => isoWeek('not-a-date'), /unparseable/);
});

// --- 2. classify: the record-repair rule ------------------------------------------------------------

test('classify/verbs — every pinned verb marks a record repair', () => {
  for (const verb of ['amend', 'append', 'backfill', 'correct', 'fix', 'gloss',
    'reconcile', 'record', 'repair']) {
    const r = classify(`0999-${verb}-something-in-a-record`);
    assert.equal(r.recordRepair, true, `${verb} should classify as a record repair`);
    assert.equal(r.verb, verb);
    assert.equal(r.id, '0999');
  }
});

test('classify/other — a behaviour verb is not a record repair', () => {
  for (const verb of ['build', 'add', 'decide', 'gate', 'make', 'design', 'refresh']) {
    assert.equal(classify(`0999-${verb}-a-thing`).recordRepair, false, `${verb} should NOT be a repair`);
  }
});

test('classify/exceptions — the three named source-defect rows carry a reason', () => {
  for (const id of ['0215', '0234', '0334']) {
    const slug = `${id}-repair-something`;
    const r = classify(slug);
    assert.equal(r.recordRepair, true, 'the exception rows still match a repair verb');
    assert.ok(r.exception, `${id} must carry a stated reason, not just a flag`);
  }
  // The exception is keyed on the ID and fires only for a row the verb already matched.
  assert.equal(classify('0215-build-a-thing').exception, null);
  assert.equal(classify('0999-repair-a-record').exception, null);
});

test('classify/no-id — a slug with no NNNN prefix still classifies by its verb', () => {
  const r = classify('correct-a-flat-era-record');
  assert.equal(r.id, null);
  assert.equal(r.verb, 'correct');
  assert.equal(r.recordRepair, true);
  assert.equal(r.exception, null, 'an exception needs an ID to key on');
});

// --- 3. briefIdentity: which paths are briefs, and what identity they carry --------------------------

test('briefIdentity/eras — a folder brief keys on NNNN, a flat brief on its stem', () => {
  assert.deepEqual(briefIdentity('ai-agents/tasks/backlog/0359-the-counter/brief.md'),
    { segment: 'backlog', identity: '0359', folder: '0359-the-counter', era: 'folder' });
  assert.deepEqual(briefIdentity('ai-agents/tasks/done/add-ci-validate-bundles.md'),
    { segment: 'done', identity: 'add-ci-validate-bundles', folder: 'add-ci-validate-bundles', era: 'flat' });
});

test('briefIdentity/non-briefs — plan/worklog/review and .gitkeep are not briefs', () => {
  assert.equal(briefIdentity('ai-agents/tasks/backlog/0359-the-counter/plan.md'), null);
  assert.equal(briefIdentity('ai-agents/tasks/backlog/0359-the-counter/worklog.md'), null);
  assert.equal(briefIdentity('ai-agents/tasks/backlog/.gitkeep'), null);
  assert.equal(briefIdentity('ai-agents/sprints/sprint-7.md'), null);
});

// --- 4. foldTransitions: the three cases that make this more than a rename count ---------------------

const W30 = '2026-07-21T10:00:00+03:00';    // 2026-W30
const W31 = '2026-07-28T10:00:00+03:00';    // 2026-W31

const rec = (status, to, date, from = null) => ({ commit: 'c'.repeat(40), date, status, from, to });

test('foldTransitions/ordinary — created in backlog, closed by a rename into done', () => {
  const f = foldTransitions([
    rec('A', 'ai-agents/tasks/backlog/0001-build-a-thing/brief.md', W30),
    rec('R100', 'ai-agents/tasks/done/0001-build-a-thing/brief.md', W31,
      'ai-agents/tasks/backlog/0001-build-a-thing/brief.md'),
  ]);
  assert.equal(f.created, 1);
  assert.equal(f.closed, 1);
  assert.deepEqual(f.weeks.get('2026-W30'), { created: 1, closed: 0 });
  assert.deepEqual(f.weeks.get('2026-W31'), { created: 0, closed: 1 });
});

test('foldTransitions/born-closed — a brief ADDED under done counts as both, in one week', () => {
  const f = foldTransitions([
    rec('A', 'ai-agents/tasks/done/0002-batch-committed/brief.md', W30),
  ]);
  assert.equal(f.created, 1, 'a born-closed task was still created');
  assert.equal(f.closed, 1);
  assert.deepEqual(f.weeks.get('2026-W30'), { created: 1, closed: 1 });
});

test('foldTransitions/migration-is-not-a-close — a same-segment reshape counts as nothing', () => {
  // ⛔ THE NAMED ASSERTION. This is the rule whose absence puts a false ~79-close spike into the
  // migration week: a rename whose board segment did not change is a shape change, not a transition.
  const f = foldTransitions([
    rec('R098', 'ai-agents/tasks/done/0003-old-task/brief.md', W30,
      'ai-agents/tasks/done/old-task.md'),
    rec('R099', 'ai-agents/tasks/done/0004-renamed-slug/brief.md', W31,
      'ai-agents/tasks/done/0004-original-slug/brief.md'),
  ]);
  assert.equal(f.closed, 0, 'a same-segment rename must contribute ZERO closes');
  assert.equal(f.created, 0, 'and ZERO creations');
  assert.equal(f.shapeChanges, 2, 'both reshapes are counted and reported, not silently dropped');
  assert.equal(f.weeks.size, 0);
});

test('foldTransitions/flat-to-folder-across-segments IS a close', () => {
  // The one migration-shaped rename that DID change segment: backlog flat -> done folder.
  const f = foldTransitions([
    rec('A', 'ai-agents/tasks/backlog/late-flat-task.md', W30),
    rec('R097', 'ai-agents/tasks/done/0005-late-flat-task/brief.md', W31,
      'ai-agents/tasks/backlog/late-flat-task.md'),
  ]);
  assert.equal(f.created, 1);
  assert.equal(f.closed, 1);
  assert.equal(f.shapeChanges, 0);
});

test('foldTransitions/rename-carries-identity — a reshaped task is one task, not two', () => {
  const f = foldTransitions([
    rec('A', 'ai-agents/tasks/backlog/flat-task.md', W30),
    rec('R100', 'ai-agents/tasks/backlog/0006-flat-task/brief.md', W30,
      'ai-agents/tasks/backlog/flat-task.md'),
    rec('R100', 'ai-agents/tasks/done/0006-flat-task/brief.md', W31,
      'ai-agents/tasks/backlog/0006-flat-task/brief.md'),
  ]);
  assert.equal(f.created, 1, 'the reshape must not invent a second creation');
  assert.equal(f.closed, 1);
  assert.ok(f.tasks.has('0006') && !f.tasks.has('flat-task'), 'state moved to the new identity');
});

test('foldTransitions/reopen — the first close stands, and the reopen is reported', () => {
  const f = foldTransitions([
    rec('A', 'ai-agents/tasks/backlog/0007-reopened/brief.md', W30),
    rec('R100', 'ai-agents/tasks/done/0007-reopened/brief.md', W30,
      'ai-agents/tasks/backlog/0007-reopened/brief.md'),
    rec('R100', 'ai-agents/tasks/backlog/0007-reopened/brief.md', W31,
      'ai-agents/tasks/done/0007-reopened/brief.md'),
    rec('R100', 'ai-agents/tasks/done/0007-reopened/brief.md', W31,
      'ai-agents/tasks/backlog/0007-reopened/brief.md'),
  ]);
  assert.equal(f.closed, 1, 'first close wins — a reopened task is not two closes');
  assert.equal(f.created, 1);
  assert.equal(f.reopens.length, 2, 'the reopen and the re-close are both surfaced');
});

test('foldTransitions/cancelled counts as closed', () => {
  const f = foldTransitions([
    rec('A', 'ai-agents/tasks/backlog/0008-dropped/brief.md', W30),
    rec('R100', 'ai-agents/tasks/cancelled/0008-dropped/brief.md', W31,
      'ai-agents/tasks/backlog/0008-dropped/brief.md'),
  ]);
  assert.equal(f.closed, 1);
});

test('foldTransitions/deletion is not a close, and non-briefs are ignored', () => {
  const f = foldTransitions([
    rec('A', 'ai-agents/tasks/backlog/0009-thing/brief.md', W30),
    rec('A', 'ai-agents/tasks/backlog/0009-thing/plan.md', W30),
    rec('M', 'ai-agents/tasks/backlog/0009-thing/brief.md', W30),
    rec('D', 'ai-agents/tasks/backlog/0009-thing/brief.md', W31),
  ]);
  assert.equal(f.created, 1, 'plan.md must not create a second task');
  assert.equal(f.closed, 0, 'a deletion is not a close — the movers never delete a brief');
});

// --- 5. parseArgs -------------------------------------------------------------------------------------

test('parseArgs — flags, defaults, and a refusal on an unknown flag', () => {
  assert.equal(parseArgs([]).rev, 'HEAD');
  assert.equal(parseArgs([]).list, false);
  assert.equal(parseArgs(['--at', 'abc123']).rev, 'abc123');
  assert.equal(parseArgs(['--repo', '/tmp/x', '--list']).repo, '/tmp/x');
  assert.equal(parseArgs(['--repo', '/tmp/x', '--list']).list, true);
  assert.throws(() => parseArgs(['--worktree']), /unknown argument/);
});

// --- 6. the git seam: a throwaway repository with a scripted history ------------------------------------

function makeFixtureRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-throughput-'));
  MADE.push(dir);
  const g = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  g('init', '-q', '-b', 'main');
  g('config', 'user.email', 'fixture@example.invalid');
  g('config', 'user.name', 'Fixture');
  g('config', 'commit.gpgsign', 'false');

  const write = (rel, body) => {
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    writeFileSync(join(dir, rel), body);
  };
  const commit = (msg, date) => {
    g('add', '-A');
    execFileSync('git', ['-C', dir, 'commit', '-q', '-m', msg], {
      env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
    });
  };
  const B = 'ai-agents/tasks/backlog';
  const D = 'ai-agents/tasks/done';

  // W30: two ordinary creations, and one flat-era brief that predates the folder shape.
  write(`${B}/0001-build-a-thing/brief.md`, '# Build a thing\n');
  write(`${B}/0002-correct-a-record/brief.md`, '# Correct a record\n');
  write(`${D}/legacy-flat-task.md`, '# A legacy flat task\n');
  commit('seed', '2026-07-21T10:00:00+03:00');

  // W31: 0001 closes; the flat legacy task is RESHAPED into a folder inside done/ (the migration
  // shape) — that reshape must contribute nothing; and a born-closed task is added straight to done.
  g('mv', `${B}/0001-build-a-thing`, `${D}/0001-build-a-thing`);
  mkdirSync(join(dir, D, '0003-legacy-flat-task'), { recursive: true });
  g('mv', `${D}/legacy-flat-task.md`, `${D}/0003-legacy-flat-task/brief.md`);
  write(`${D}/0004-append-a-note/brief.md`, '# Append a note\n');
  commit('close, migrate, and batch-commit one', '2026-07-28T10:00:00+03:00');

  return dir;
}

function runScript(args) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
  assert.equal(r.status, 0, `throughput.mjs exited ${r.status}: ${r.stderr}`);
  return r.stdout;
}

const facts = (out) => Object.fromEntries(
  out.split('\n').filter((l) => /^[a-z-]+ /.test(l)).map((l) => {
    const i = l.indexOf(' ');
    return [l.slice(0, i), l.slice(i + 1)];
  }),
);

test('git seam/fixture — created and closed per week, migration reshape excluded', () => {
  const dir = makeFixtureRepo();
  const out = runScript(['--repo', dir]);

  assert.match(out, /^⟦fkit-throughput v1⟧$/m, 'its own version marker, not the dashboard\'s');
  assert.doesNotMatch(out, /fkit-dashboard/, 'must not emit a token the board parser reads');
  assert.match(out, /^⟦WEEKS⟧$/m);
  assert.match(out, /^⟦REPAIR⟧$/m);
  assert.match(out, /^⟦END⟧$/m);

  // W31 has exactly TWO closes — 0001's rename out of backlog, and 0004 born under done. The legacy
  // task's reshape INSIDE done/ is not one of them.
  // ⚠️ This line stays GREEN if the segment check is deleted, and that is not a gap in it: the
  // reshaped task was already closed under its flat name, so first-close-wins refuses the second.
  // The assertion that actually holds the segment check honest is the unit fixture above, where the
  // rename's source side has no prior state — which is the only situation the check can save.
  assert.match(out, /^week 2026-W31 created 1 closed 2$/m,
    'migration reshape must not be counted as a close');
  assert.match(out, /^week 2026-W30 created 3 closed 1$/m,
    'the flat legacy brief was born under done/ — created and closed in W30');

  const f = facts(out);
  assert.equal(f.totals, 'created 4 closed 3');
  assert.equal(f.open, '1', 'created - closed must equal the open row count');
  assert.match(out, /^horizon task-folder-migration [0-9a-f]{40} 2026-W31$/m);
  assert.match(out, /^note .*per-ID drill-down is unavailable/m,
    'the pre-migration limitation must be stated in the output, not only in the header');
});

test('git seam/fixture — the record-repair share of the open rows', () => {
  const dir = makeFixtureRepo();
  const f = facts(runScript(['--repo', dir]));
  assert.equal(f.open, '1');
  assert.equal(f.repair, '1', '0002-correct-... is the one open row, and `correct` is a repair verb');
  assert.equal(f['repair-pct'], '100.0');
});

test('git seam/fixture — --list names the verdict, verb and reason for every open row', () => {
  const dir = makeFixtureRepo();
  const out = runScript(['--repo', dir, '--list']);
  assert.match(out, /^⟦fkit-throughput-list v1⟧$/m);
  assert.match(out, /^row 0002 record-repair verb=correct exception=no 0002-correct-a-record$/m);
  assert.match(out, /^verb correct — /m, 'each verb carries its stated reason');
  assert.match(out, /^exception 0215 — /m, 'each exception carries its stated reason');
});

test('git seam/fixture — --at reads a REVISION, never the worktree', () => {
  const dir = makeFixtureRepo();
  const head = execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  // Dirty the worktree with an uncommitted close. The report must not move.
  rmSync(join(dir, 'ai-agents/tasks/backlog/0002-correct-a-record'), { recursive: true });
  const f = facts(runScript(['--repo', dir, '--at', head]));
  assert.equal(f.open, '1', 'an uncommitted close is not in the history, so it is not counted');
  assert.equal(f.repair, '1');
});

// --- 6b. round-1 review regressions — one test per fix, each pinned to the measured failure ------------

test('R1 cwd-independence — a subdirectory must not turn the report into silent zeros', () => {
  const dir = makeFixtureRepo();
  const fromRoot = runScript(['--repo', dir]);
  // ⛔ THE MEASURED FAILURE: a git pathspec resolves against the CALLER'S cwd. Before the fix, both
  // of these emitted a complete, well-formed report of all zeros at exit 0.
  const fromSubdirArg = runScript(['--repo', join(dir, 'ai-agents', 'tasks')]);
  const r = spawnSync(process.execPath, [SCRIPT, '--repo', '.'],
    { encoding: 'utf8', cwd: join(dir, 'ai-agents') });
  assert.equal(r.status, 0, `exited ${r.status}: ${r.stderr}`);

  assert.equal(fromSubdirArg, fromRoot, '--repo pointing at a subdirectory must read the whole repo');
  assert.equal(r.stdout, fromRoot, 'running from a subdirectory must read the whole repo');
  assert.doesNotMatch(fromRoot, /^totals created 0 closed 0$/m, 'and the report is not all zeros');
});

test('R2 rename detection is FORCED — the figures cannot depend on the reader\'s gitconfig', () => {
  const dir = makeFixtureRepo();
  const base = runScript(['--repo', dir]);
  // ⛔ THE MEASURED FAILURE: at the pinned baseline, `diff.renames=false` silently turned
  // `created 351 closed 222` into `created 452 closed 312` at exit 0 — every close re-reported as an
  // unrelated add plus delete. GIT_CONFIG_* injects the setting without touching any config file.
  const r = spawnSync(process.execPath, [SCRIPT, '--repo', dir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: 'diff.renames',
      GIT_CONFIG_VALUE_0: 'false',
    },
  });
  assert.equal(r.status, 0, `exited ${r.status}: ${r.stderr}`);
  assert.equal(r.stdout, base, 'output under diff.renames=false must be byte-identical');
});

test('R2 reconciliation — the invariant is EVALUATED, and a violation refuses to print', () => {
  const dir = makeFixtureRepo();
  assert.match(runScript(['--repo', dir]), /^reconciliation created-minus-closed 1 open 1$/m);

  // Delete a brief outright. A deletion is not a close, so the task is created, never closed, and
  // not open — created - closed no longer equals the open count, and the report must refuse.
  const g = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  g('rm', '-q', '-r', 'ai-agents/tasks/backlog/0002-correct-a-record');
  execFileSync('git', ['-C', dir, 'commit', '-q', '-m', 'delete a brief'], {
    env: { ...process.env, GIT_AUTHOR_DATE: W31, GIT_COMMITTER_DATE: W31 },
  });
  const r = spawnSync(process.execPath, [SCRIPT, '--repo', dir], { encoding: 'utf8' });
  assert.equal(r.status, 1, 'a failed reconciliation must exit non-zero');
  assert.match(r.stderr, /reconciliation FAILED/, 'and say so');
  assert.match(r.stderr, /diff\.renames/, 'and name the usual cause');
  assert.doesNotMatch(r.stdout, /⟦END⟧/, 'and print no quotable report');
});

test('R3 the migration note is COMPUTED, never asserted', () => {
  // ⛔ THE MEASURED FAILURE: the note read "it contributes zero closes and zero creations" while the
  // migration commit carries one rename that DOES cross a board segment, correctly counted as a
  // close. Here the reshape commit also closes a task, so a hardcoded "zero" would be visibly wrong.
  const f = foldTransitions([
    { commit: 'm'.repeat(40), date: W30, status: 'A', from: null, to: 'ai-agents/tasks/backlog/flat-one.md' },
    { commit: 'x'.repeat(40), date: W31, status: 'R098', from: 'ai-agents/tasks/done/other.md', to: 'ai-agents/tasks/done/0002-other/brief.md' },
    { commit: 'x'.repeat(40), date: W31, status: 'R097', from: 'ai-agents/tasks/backlog/flat-one.md', to: 'ai-agents/tasks/done/0001-flat-one/brief.md' },
  ]);
  const tally = f.byCommit.get('x'.repeat(40));
  assert.equal(tally.sameSegment, 1, 'the reshape contributes nothing');
  assert.equal(tally.closed, 1, 'but the one real close in the SAME commit is counted — not zero');
  assert.equal(tally.created, 0, 'the closed task was created in an earlier commit, so 0 here');
});

test('R4 pre-migration revisions report a REAL share, not a fabricated zero', () => {
  // ⛔ THE MEASURED FAILURE: `ls-tree -d` lists directories only, so a pre-migration tree — which
  // holds flat `<slug>.md` briefs and no directories — reported `open 0` / `repair-pct 0.0` at exit
  // 0 for a board that actually held 11 briefs. Ruling W2 put that era in scope.
  // A FLAT-ERA repo: backlog holds `<slug>.md` briefs and NOT ONE directory, which is precisely the
  // shape `ls-tree -d` could not see.
  const dir = mkdtempSync(join(tmpdir(), 'fkit-throughput-flat-'));
  MADE.push(dir);
  const g = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  g('init', '-q', '-b', 'main');
  g('config', 'user.email', 'fixture@example.invalid');
  g('config', 'user.name', 'Fixture');
  mkdirSync(join(dir, 'ai-agents/tasks/backlog'), { recursive: true });
  writeFileSync(join(dir, 'ai-agents/tasks/backlog/correct-a-record.md'), '# Correct a record\n');
  writeFileSync(join(dir, 'ai-agents/tasks/backlog/build-a-thing.md'), '# Build a thing\n');
  g('add', '-A');
  execFileSync('git', ['-C', dir, 'commit', '-q', '-m', 'flat era'],
    { env: { ...process.env, GIT_AUTHOR_DATE: W30, GIT_COMMITTER_DATE: W30 } });

  assert.equal(execFileSync('git', ['-C', dir, 'ls-tree', '-d', '--name-only', 'HEAD',
    'ai-agents/tasks/backlog/'], { encoding: 'utf8' }).trim(), '',
  'precondition: `ls-tree -d` sees nothing here — that was the whole bug');

  const f = facts(runScript(['--repo', dir]));
  assert.equal(f.open, '2', 'the two flat-era backlog briefs are open rows');
  assert.equal(f.repair, '1', '`correct-a-record` classifies by the same verb rule, keyed on its stem');
  assert.equal(f['repair-pct'], '50.0', 'a real share, never a fabricated zero');
});

test('R9 parseArgs refuses a flag where a value belongs', () => {
  assert.throws(() => parseArgs(['--at', '--list']), /got the flag/);
  assert.throws(() => parseArgs(['--repo', '--at', 'x']), /got the flag/);
  assert.throws(() => parseArgs(['--at']), /needs a value/);
});

// --- 7. the PINNED baseline — repeatable because it names a commit, not a date -------------------------

test('pinned baseline a9c2709 — 129 open rows, and the figures the rule yields', (t) => {
  const probe = spawnSync('git', ['-C', REPO, 'rev-parse', '--verify', `${BASELINE_REV}^{commit}`],
    { encoding: 'utf8' });
  if (probe.status !== 0) {
    t.skip(`revision ${BASELINE_REV} is not in this checkout (shallow clone or a copied tree with no `
      + `.git) — the baseline cannot be reproduced here. NOT a pass: nothing was checked.`);
    return;
  }
  const out = runScript(['--repo', REPO, '--at', BASELINE_REV]);
  const f = facts(out);

  // The corpus the 2026-08-29 baseline was measured on. Pinned to a commit precisely because the
  // live tree has moved past it and can never reproduce 129 again.
  assert.equal(f.open, '129', 'the anchor revision is the 129-open-folder tree');

  // ⚠️ 46, NOT the 45 the brief records. The brief's figure is reproducible only by admitting exactly
  // ONE of `gloss` (row 0279) and `reconcile` (row 0317) — and reading both rows says both are record
  // repairs. Dropping either to reach 45 would be curve-fitting, which the task forbids by name.
  assert.equal(f.repair, '46');
  assert.equal(f['repair-pct'], '35.7');
  assert.equal(f['repair-excluding-source-defects'], '43');
  assert.equal(f['repair-excluding-source-defects-pct'], '33.3');

  // The reconciliation: every task is created once and closed at most once, so
  // created - closed == open. It holds exactly at this revision, with no residual.
  assert.equal(f.totals, 'created 351 closed 222');
  assert.equal(351 - 222, 129);
  assert.equal(f.reconciliation, 'created-minus-closed 129 open 129');

  // ⛔ R3's exact false claim, pinned against the real corpus. The migration commit contributes ONE
  // close (`backlog/migrate-tasks-…md` → `done/0062-…/brief.md` crosses a board segment); the note
  // used to deny it in machine-readable output that `0360`'s banner would quote.
  assert.match(out, /^note that commit is overwhelmingly a reshape: 100 same-segment renames contribute nothing, and it contributes 1 close and 0 creations$/m);

  t.diagnostic(`baseline ${BASELINE_REV}: 46/129 = 35.7% record repair; brief records 45/129 = 34.9%`);
});

test('live corpus — reported, never asserted', (t) => {
  const probe = spawnSync('git', ['-C', REPO, 'rev-parse', '--verify', 'HEAD'], { encoding: 'utf8' });
  if (probe.status !== 0) { t.skip('no git history here'); return; }
  const f = facts(runScript(['--repo', REPO]));
  // ⛔ NO assertion on these numbers. They change every time a task closes; asserting them would be a
  // test that goes red for being correct.
  t.diagnostic(`HEAD: open ${f.open}, repair ${f.repair} (${f['repair-pct']}%), `
    + `excluding source defects ${f['repair-excluding-source-defects']} `
    + `(${f['repair-excluding-source-defects-pct']}%)`);
  t.diagnostic(`HEAD totals: ${f.totals}`);
  assert.ok(Number(f.open) > 0, 'the only structural claim: the corpus is non-empty');
});
