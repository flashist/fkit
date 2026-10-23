// snapshot() reads each task once: aiboard T-021 ("the board re-scans the whole tree per sprint
// member"), built into board/core/store.mjs per ADR-052 D9. T-021 was filed but never fixed in
// aiboard, so its reproduction is ported from its brief: it counted _scan calls and task loads.
// The default lane counts calls and never reads a clock; FKIT_BOARD_BENCH=1 adds the timing run.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { cpus, loadavg, tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { dumpFrontMatter, formatWorklogEntry, parseFrontMatter } from '../../board/core/model.mjs';
import { Board } from '../../board/core/store.mjs';

let tmp;

beforeEach(() => {
  tmp = realpathSync(mkdtempSync(join(tmpdir(), 'board-snapshot-')));
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

const newBoard = (name) => {
  const b = new Board(join(tmp, name));
  b.init();
  return b;
};

// Shadowed on the instance, so the store itself is untouched.
function countCalls(b) {
  const calls = { scans: 0, loads: 0 };
  b._scan = function (...args) {
    calls.scans += 1;
    return Board.prototype._scan.apply(this, args);
  };
  b._loadTask = function (...args) {
    calls.loads += 1;
    return Board.prototype._loadTask.apply(this, args);
  };
  return calls;
}

function setSprintTasks(b, ref, tasks) {
  const file = join(b.getSprint(ref).path, 'sprint.md');
  const [meta, body] = parseFrontMatter(readFileSync(file, 'utf8'));
  meta.set('tasks', tasks);
  writeFileSync(file, dumpFrontMatter(meta, body));
}

const progressOf = (snap, id) => snap.sprints.find((s) => s.id === id).progress;

function withoutTasks(progress) {
  const { tasks: _tasks, ...rest } = progress;
  return rest;
}

const counts = (backlog, inProgress, done, cancelled) => ({ backlog, 'in-progress': inProgress, done, cancelled });

test('snapshot scans the tree a fixed number of times and loads each task once, however many tasks the sprints hold (aiboard T-021)', () => {
  const measure = (n) => {
    const b = newBoard(`n${n}`);
    b.createSprint('First');
    b.createSprint('Second');
    for (let i = 1; i <= n; i += 1) {
      const blocked_by = i % 3 === 0 ? [`T-${String(i - 1).padStart(3, '0')}`] : null;
      b.createTask(`Task ${i}`, { sprint: i % 2 ? 'S-001' : 'S-002', blocked_by });
    }
    const calls = countCalls(b);
    const snap = b.snapshot();
    assert.equal(snap.tasks.length, n);
    assert.equal(snap.sprints.reduce((sum, s) => sum + s.progress.total, 0), n);
    return calls;
  };
  const small = measure(3);
  const large = measure(12);
  assert.ok(small.scans > 0, 'the _scan counter saw no calls: was Board.prototype._scan renamed?');
  assert.equal(large.scans, small.scans, 'scans per snapshot must not grow with the number of sprint members');
  assert.equal(small.loads, 3);
  assert.equal(large.loads, 12);
});

test('snapshot sprint progress is unchanged by the index: first copy of a duplicate id, odd refs, missing tasks, errors', () => {
  const b = newBoard('board');
  b.createTask('One');
  b.createTask('Two', { status: 'in-progress' });
  b.createTask('Three', { status: 'done' });
  b.createTask('Four', { status: 'cancelled' });
  b.createTask('Five', { blocked_by: ['T-002'] });
  b.createTask('Six', { status: 'done' });
  // Backlog is scanned before done, so this copy is the T-003 that getTask finds.
  const copy = join(b.tasksDir, 'backlog', 'T-0003-copy');
  mkdirSync(copy);
  writeFileSync(join(copy, 'brief.md'), dumpFrontMatter(new Map([['id', 'T-003'], ['title', 'Three, copy'], ['rank', 99000]]), '# Three, copy\n'));
  for (const title of ['Odd refs', 'Plain', 'Empty']) b.createSprint(title);
  setSprintTasks(b, 'S-001', ['1', 't-2', 'T-003', 'T-0004', 'T-005', 'T-999', 'bogus', 'T-001']);
  setSprintTasks(b, 'S-002', ['T-006', 'T-002', 'T-004']);

  const snap = b.snapshot();
  assert.deepStrictEqual(progressOf(snap, 'S-001'), { total: 6, counts: counts(4, 1, 0, 1), percent: 0, remaining: 5 });
  assert.deepStrictEqual(progressOf(snap, 'S-002'), { total: 3, counts: counts(0, 1, 1, 1), percent: 33, remaining: 1 });
  assert.deepStrictEqual(progressOf(snap, 'S-003'), { total: 0, counts: counts(0, 0, 0, 0), percent: 0, remaining: 0 });
  for (const s of b.listSprints()) {
    assert.deepStrictEqual(progressOf(snap, s.id), withoutTasks(b.sprintProgress(s)), s.id);
  }
  assert.deepStrictEqual(snap.tasks, b.listTasks().map((t) => t.toDict()));

  setSprintTasks(b, 'S-002', ['T-006', 1]);
  let expected;
  try {
    b.sprintProgress(b.getSprint('S-002'));
  } catch (e) {
    expected = e;
  }
  assert.ok(expected, 'an int entry in tasks: must throw without the index');
  assert.throws(
    () => b.snapshot(),
    (e) => e.constructor === expected.constructor && e.message === expected.message,
  );
});

// The pre-fix snapshot: listTasks, then getTask per sprint member through sprintProgress.
function oldSnapshot(b) {
  const tasks = b.listTasks();
  const sprints = [];
  for (const s of b.listSprints()) {
    const d = s.toDict();
    d.progress = withoutTasks(b.sprintProgress(s));
    sprints.push(d);
  }
  return { tasks: tasks.map((t) => t.toDict()), sprints };
}

function newSnapshot(b) {
  const { tasks, sprints } = b.snapshot();
  return { tasks, sprints };
}

// Written straight to disk: createTask into a sprint re-renders the sprint, itself per-member.
function syntheticBoard(n) {
  const b = newBoard(`bench${n}`);
  const ts = '2026-10-01T00:00:00Z';
  const brief = '# Brief\n\n' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(160);
  const entry = formatWorklogEntry(ts, 'bench', 'Did a step. '.repeat(40));
  const worklog = '# Worklog\n\n' + entry.repeat(Math.ceil(16900 / entry.length));
  const perSprint = 30;
  const sprintCount = Math.ceil(n / perSprint);
  for (let k = 1; k <= sprintCount; k += 1) {
    const sid = `S-${String(k).padStart(3, '0')}`;
    const ids = [];
    for (let i = (k - 1) * perSprint + 1; i <= Math.min(n, k * perSprint); i += 1) ids.push(`T-${String(i).padStart(3, '0')}`);
    const folder = join(b.sprintsDir, 'backlog', `${sid}-sprint-${k}`);
    mkdirSync(folder);
    const meta = new Map([['id', sid], ['title', `Sprint ${k}`], ['tasks', ids], ['created', ts], ['updated', ts]]);
    writeFileSync(join(folder, 'sprint.md'), dumpFrontMatter(meta, `# Sprint ${k}\n\n## Tasks\n\n_No tasks attached yet._\n`));
    for (const [j, tid] of ids.entries()) {
      const status = ['backlog', 'in-progress', 'done', 'cancelled'][j % 4];
      const dir = join(b.tasksDir, status, `${tid}-task`);
      mkdirSync(dir);
      const tmeta = new Map([
        ['id', tid],
        ['title', `Task ${tid}`],
        ['sprint', sid],
        ['priority', 'medium'],
        ['rank', Number(tid.slice(2)) * 1000],
        ['blocked_by', []],
        ['created', ts],
        ['updated', ts],
      ]);
      writeFileSync(join(dir, 'brief.md'), dumpFrontMatter(tmeta, brief));
      writeFileSync(join(dir, 'worklog.md'), worklog);
    }
  }
  return b;
}

function medianMs(fn, runs = 5) {
  fn();
  const times = [];
  for (let i = 0; i < runs; i += 1) {
    const start = process.hrtime.bigint();
    fn();
    times.push(Number(process.hrtime.bigint() - start) / 1e6);
  }
  times.sort((x, y) => x - y);
  return times[Math.floor(runs / 2)];
}

test('benchmark: snapshot against the per-member path on corpus-sized boards (FKIT_BOARD_BENCH=1)', { skip: process.env.FKIT_BOARD_BENCH !== '1' }, (t) => {
  t.diagnostic(`machine: ${cpus()[0]?.model ?? 'unknown'} x${cpus().length}; load average ${loadavg().map((x) => x.toFixed(2)).join(' ')}`);
  for (const n of [100, 405, 540, 800]) {
    const b = syntheticBoard(n);
    assert.deepStrictEqual(newSnapshot(b), oldSnapshot(b));
    const oldCalls = countCalls(b);
    oldSnapshot(b);
    const newCalls = countCalls(b);
    newSnapshot(b);
    delete b._scan;
    delete b._loadTask;
    const oldMs = medianMs(() => oldSnapshot(b));
    const newMs = medianMs(() => newSnapshot(b));
    t.diagnostic(
      `n=${n}: old ${oldMs.toFixed(1)} ms, new ${newMs.toFixed(1)} ms, ratio ${(oldMs / newMs).toFixed(1)}x; ` +
        `scans old ${oldCalls.scans} new ${newCalls.scans}; loads old ${oldCalls.loads} new ${newCalls.loads}`,
    );
  }
});
