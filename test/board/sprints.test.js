// Sprint move / add / remove in board/core/store.mjs, ported from aiboard a1592dc's tests/test_board.py.
// BoardTests keeps aiboard's sprint test names verbatim, in aiboard's order, so 0423 can match each one.
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, test } from 'node:test';
import { Board, BoardError, NotFound } from '../../board/core/store.mjs';

let tmp;
let board;

const read = (p) => readFileSync(p, 'utf8');
const sprintFile = (ref) => join(board.getSprint(ref).path, 'sprint.md');

// A fixed past `updated`, so "was it rewritten?" does not depend on the clock ticking between writes.
const OLD = '2000-01-01T00:00:00Z';
const backdate = (p) => writeFileSync(p, read(p).replace(/^updated: .*$/m, `updated: "${OLD}"`));

beforeEach(() => {
  tmp = realpathSync(mkdtempSync(join(tmpdir(), 'board-sprints-')));
  board = new Board(tmp);
  board.init();
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('BoardTests', () => {
  test('test_sprint_membership_stays_in_sync', () => {
    let s = board.createSprint('Sprint 1', { goal: 'Ship', start: '2026-09-14', end: '2026-09-25' });
    assert.equal(s.id, 'S-001');
    board.createTask('One', { sprint: 'S-001' });
    board.createTask('Two');
    board.sprintAdd('S-001', ['T-002']);
    s = board.getSprint('1');
    assert.deepStrictEqual(s.tasks, ['T-001', 'T-002']);
    assert.equal(board.getTask('T-002').sprint, 'S-001');
    let text = read(join(s.path, 'sprint.md'));
    assert.ok(text.includes('- [ ] T-001 — One (backlog)'));

    board.moveTask('T-001', 'done');
    text = read(join(s.path, 'sprint.md'));
    assert.ok(text.includes('- [x] T-001 — One (done)'));
    const p = board.sprintProgress(board.getSprint('S-001'));
    assert.deepStrictEqual([p.total, p.counts.done, p.percent], [2, 1, 50]);

    board.sprintRemove('S-001', ['T-002']);
    assert.deepStrictEqual(board.getSprint('S-001').tasks, ['T-001']);
    assert.equal(board.getTask('T-002').sprint, null);

    board.createSprint('Sprint 2');
    board.updateTask('T-001', { sprint: 'S-002' });
    assert.deepStrictEqual(board.getSprint('S-001').tasks, []);
    assert.deepStrictEqual(board.getSprint('S-002').tasks, ['T-001']);
    assert.deepStrictEqual(board.check(), []);
  });

  test('test_move_sprint', () => {
    board.createSprint('Sprint 1');
    const s = board.moveSprint('S-001', 'in-progress');
    assert.ok(existsSync(join(tmp, 'sprints/in-progress/S-001-sprint-1/sprint.md')));
    assert.equal(s.status, 'in-progress');
  });

  test('test_check_detects_and_fixes_stale_sprint_list', () => {
    board.createSprint('Sprint 1');
    const t = board.createTask('One', { sprint: 'S-001' });
    // move by hand, as the README allows
    renameSync(t.path, join(tmp, 'tasks/done', t.path.split('/').at(-1)));
    let problems = board.check();
    assert.ok(problems.some((p) => p.includes('stale') && p.includes('S-001')), String(problems));
    problems = board.check({ fix: true });
    assert.ok(problems.some((p) => p.endsWith('(fixed)')), String(problems));
    assert.deepStrictEqual(board.check(), []);
    assert.ok(read(sprintFile('S-001')).includes('- [x] T-001 — One (done)'));
  });
});

describe('fkit additions', () => {
  test("move_sprint keeps the sprint's tasks, writes nothing for the same status, and refuses a same-name destination", () => {
    board.createSprint('Sprint 1');
    const t = board.createTask('One', { sprint: 'S-001' });
    const brief = join(t.path, 'brief.md');
    const briefBefore = readFileSync(brief);
    backdate(sprintFile('S-001'));
    assert.equal(board.getSprint('S-001').meta.get('updated'), OLD);

    board.moveSprint('S-001', 'in-progress');
    const moved = board.getSprint('S-001');
    assert.equal(moved.status, 'in-progress');
    assert.notEqual(moved.meta.get('updated'), OLD);
    assert.deepStrictEqual(moved.tasks, ['T-001']);
    assert.ok(read(join(moved.path, 'sprint.md')).includes('- [ ] T-001 — One (backlog)'));
    assert.deepStrictEqual(readFileSync(brief), briefBefore);
    assert.deepStrictEqual(board.check(), []);

    backdate(join(moved.path, 'sprint.md'));
    const sprintBefore = readFileSync(join(moved.path, 'sprint.md'));
    assert.equal(board.moveSprint('S-001', 'in-progress').status, 'in-progress');
    assert.deepStrictEqual(readFileSync(join(moved.path, 'sprint.md')), sprintBefore);

    const dest = join(tmp, 'sprints/done/S-001-sprint-1');
    mkdirSync(dest);
    assert.throws(() => board.moveSprint('S-001', 'done'), (e) => {
      assert.ok(e instanceof BoardError);
      assert.equal(e.message, `destination already exists: ${dest}`);
      return true;
    });
    assert.ok(existsSync(join(tmp, 'sprints/in-progress/S-001-sprint-1/sprint.md')));
    assert.deepStrictEqual(readdirSync(dest), []);
  });

  test('sprint_add moves a task out of its old sprint', () => {
    board.createSprint('Sprint 1');
    board.createSprint('Sprint 2');
    board.createTask('One', { sprint: 'S-001' });
    board.sprintAdd('S-002', ['T-001']);
    assert.deepStrictEqual(board.getSprint('S-001').tasks, []);
    assert.deepStrictEqual(board.getSprint('S-002').tasks, ['T-001']);
    assert.equal(board.getTask('T-001').sprint, 'S-002');
    assert.ok(read(sprintFile('S-001')).includes('_No tasks attached yet._'));
    assert.ok(!read(sprintFile('S-001')).includes('T-001'));
    assert.ok(read(sprintFile('S-002')).includes('- [ ] T-001 — One (backlog)'));
    assert.deepStrictEqual(board.check(), []);
  });

  test('sprint_remove drops a stale listing without touching the task', () => {
    board.createSprint('Sprint 1');
    board.createSprint('Sprint 2');
    board.createTask('One', { sprint: 'S-001' });
    const brief = join(tmp, 'tasks/backlog/T-001-one/brief.md');
    writeFileSync(brief, read(brief).replaceAll('sprint: S-001', 'sprint: S-002'));
    const briefBefore = readFileSync(brief);

    board.sprintRemove('S-001', ['T-001']);
    assert.deepStrictEqual(board.getSprint('S-001').tasks, []);
    assert.deepStrictEqual(readFileSync(brief), briefBefore);
    assert.deepStrictEqual(board.check(), ['T-001 says it is in S-002, but S-002 does not list it']);
    assert.throws(() => board.sprintRemove('S-001', ['T-009']), NotFound);
  });

  test('sprint_remove of a member then a stale listing in one call keeps the member removed', () => {
    board.createSprint('Sprint 1');
    board.createSprint('Sprint 2');
    board.createTask('One', { sprint: 'S-001' });
    board.createTask('Two', { sprint: 'S-001' });
    const brief = join(tmp, 'tasks/backlog/T-002-two/brief.md');
    writeFileSync(brief, read(brief).replaceAll('sprint: S-001', 'sprint: S-002'));
    const briefBefore = readFileSync(brief);

    board.sprintRemove('S-001', ['T-001', 'T-002']);
    assert.deepStrictEqual(board.getSprint('S-001').tasks, []);
    assert.equal(board.getTask('T-001').sprint, null);
    assert.deepStrictEqual(readFileSync(brief), briefBefore);
    assert.ok(read(sprintFile('S-001')).includes('_No tasks attached yet._'));
    assert.deepStrictEqual(board.check(), ['T-002 says it is in S-002, but S-002 does not list it']);
  });
});
