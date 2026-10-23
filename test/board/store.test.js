// The board's task store (board/core/store.mjs), ported from aiboard a1592dc's tests/test_board.py.
// BoardTests keeps aiboard's test names verbatim, in aiboard's order, so 0423 can match each one.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { hostname, tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, test } from 'node:test';
import { Worker, threadId } from 'node:worker_threads';
import { Board, BoardError, NotFound, findBoardRoot } from '../../board/core/store.mjs';
import { ValueError } from '../../board/core/python-compat.mjs';

const STORE_URL = new URL('../../board/core/store.mjs', import.meta.url).href;

let tmp;
let board;

const read = (p) => readFileSync(p, 'utf8');
const order = (filters = {}) => board.listTasks(filters).map((t) => t.id);
const makeTmp = () => realpathSync(mkdtempSync(join(tmpdir(), 'board-store-')));

// One child process per call, all started before any is awaited: real concurrent writers.
const CHILD = `
const [url, root, op, a, b] = process.argv.slice(1);
const { Board } = await import(url);
try {
  const board = new Board(root);
  if (op === 'create') board.createTask(a, { sprint: b });
  else if (op === 'move') board.moveTask(a, b);
  else if (op === 'start') board.start(a, b, { author: b });
  else if (op === 'hold') board.writeLock(() => {
    process.stdout.write('held\\n');
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 60000);
  });
} catch (e) {
  process.stderr.write(e.constructor.name + ': ' + e.message);
  process.exit(1);
}
`;

function childEnv() {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  return env;
}

function startChild(...args) {
  return spawn(process.execPath, ['--input-type=module', '-e', CHILD, '--', STORE_URL, tmp, ...args], {
    env: childEnv(),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function finished(child) {
  return new Promise((resolve) => {
    let stderr = '';
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (code) => resolve({ code, stderr }));
  });
}

const runAll = (argsList) => Promise.all(argsList.map((args) => finished(startChild(...args))));

beforeEach(() => {
  tmp = makeTmp();
  board = new Board(tmp);
  board.init();
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('BoardTests', () => {
  test('test_requires_init', () => {
    assert.throws(() => new Board(join(tmp, 'nope')).listTasks(), BoardError);
  });

  test('test_critical_priority_and_urgent_alias', () => {
    let t = board.createTask('Prod is down', { priority: 'critical' });
    assert.equal(t.priority, 'critical');
    // The alias is resolved before writing, so the file only ever holds the canonical name.
    t = board.createTask('Checkout broken', { priority: 'urgent' });
    assert.equal(t.priority, 'critical');
    assert.ok(read(join(t.path, 'brief.md')).includes('priority: critical'));
    t = board.updateTask(t.id, { priority: 'high' });
    assert.equal(t.priority, 'high');
    t = board.updateTask(t.id, { priority: 'Urgent' });
    assert.equal(t.priority, 'critical');
    assert.throws(() => board.createTask('x', { priority: 'bogus' }), BoardError);
    assert.throws(() => board.updateTask(t.id, { priority: 'bogus' }), BoardError);
  });

  test('test_hand_edited_urgent_reads_as_critical', () => {
    const t = board.createTask('Hand edited');
    const brief = join(t.path, 'brief.md');
    writeFileSync(brief, read(brief).replaceAll('priority: medium', 'priority: urgent'));
    assert.equal(board.getTask(t.id).priority, 'critical');
  });

  test('test_new_tasks_join_the_bottom_and_critical_ones_the_top', () => {
    for (const title of ['a', 'b', 'c']) board.createTask(title);
    assert.deepStrictEqual(order(), ['T-001', 'T-002', 'T-003']);
    board.createTask('prod is down', { priority: 'critical' });
    board.createTask('d');
    assert.deepStrictEqual(order(), ['T-004', 'T-001', 'T-002', 'T-003', 'T-005']);
  });

  test('test_rank_top_bottom_before_after', () => {
    for (const title of ['a', 'b', 'c', 'd']) board.createTask(title);
    board.rankTask('T-4', { top: true });
    assert.deepStrictEqual(order(), ['T-004', 'T-001', 'T-002', 'T-003']);
    board.rankTask('T-1', { bottom: true });
    assert.deepStrictEqual(order(), ['T-004', 'T-002', 'T-003', 'T-001']);
    board.rankTask('T-1', { before: 'T-2' });
    assert.deepStrictEqual(order(), ['T-004', 'T-001', 'T-002', 'T-003']);
    board.rankTask('T-4', { after: 'T-3' });
    assert.deepStrictEqual(order(), ['T-001', 'T-002', 'T-003', 'T-004']);
  });

  test('test_a_move_rewrites_only_the_moved_task', () => {
    for (const title of ['a', 'b', 'c', 'd']) board.createTask(title);
    const briefs = new Map(board.listTasks().map((t) => [t.id, read(join(t.path, 'brief.md'))]));
    board.rankTask('T-004', { after: 'T-001' });
    const changed = board.listTasks().filter((t) => read(join(t.path, 'brief.md')) !== briefs.get(t.id)).map((t) => t.id);
    assert.deepStrictEqual(changed, ['T-004']);
    assert.equal(board.getTask('T-004').rank, 1500);
    // Ranking a task to where it already is writes nothing at all.
    const before = read(join(board.getTask('T-004').path, 'brief.md'));
    board.rankTask('T-004', { after: 'T-001' });
    assert.equal(read(join(board.getTask('T-004').path, 'brief.md')), before);
  });

  test('test_rank_respaces_when_a_gap_runs_out', () => {
    board.createTask('first');
    board.createTask('last');
    const inserted = [];
    for (let i = 0; i < 15; i++) {
      const t = board.createTask(`filler ${i}`);
      board.rankTask(t.id, { after: 'T-001' });
      inserted.push(t.id);
    }
    assert.deepStrictEqual(order(), ['T-001', ...inserted.reverse(), 'T-002']);
    const ranks = board.listTasks().map((t) => t.rank);
    assert.equal(new Set(ranks).size, ranks.length);
  });

  test('test_rank_validation', () => {
    board.createTask('a');
    board.createTask('b');
    assert.throws(() => board.rankTask('T-001'), BoardError);
    assert.throws(() => board.rankTask('T-001', { top: true, before: 'T-002' }), BoardError);
    assert.throws(() => board.rankTask('T-001', { before: 'T-001' }), BoardError);
    assert.throws(() => board.rankTask('T-001', { after: 'T-099' }), NotFound);
  });

  test('test_rank_survives_status_changes_and_orders_every_view', () => {
    const sp = board.createSprint('Sprint 1');
    for (const title of ['a', 'b', 'c']) board.createTask(title, { sprint: sp.id });
    board.rankTask('T-003', { top: true });
    board.moveTask('T-003', 'in-progress');
    board.moveTask('T-001', 'in-progress');
    assert.deepStrictEqual(order({ status: 'in-progress' }), ['T-003', 'T-001']);
    const progress = board.sprintProgress(board.getSprint(sp.id));
    assert.deepStrictEqual(progress.tasks.map((t) => t.id), ['T-003', 'T-001', 'T-002']);
  });

  test('test_raising_to_critical_moves_to_the_top_once', () => {
    for (const title of ['a', 'b', 'c']) board.createTask(title);
    board.updateTask('T-003', { priority: 'critical' });
    assert.equal(order()[0], 'T-003');
    board.rankTask('T-003', { bottom: true });
    // Already critical: other edits leave the manual order alone.
    board.updateTask('T-003', { priority: 'critical', title: 'still critical' });
    assert.equal(order().at(-1), 'T-003');
  });

  test('test_ranking_does_not_touch_updated', () => {
    board.createTask('a');
    const t = board.createTask('b');
    const brief = join(t.path, 'brief.md');
    writeFileSync(brief, read(brief).replaceAll(t.meta.get('updated'), '2020-01-01T00:00:00Z'));
    board.rankTask('T-002', { top: true });
    assert.equal(board.getTask('T-002').meta.get('updated'), '2020-01-01T00:00:00Z');
  });

  test('test_boards_without_ranks_keep_id_order', () => {
    for (const title of ['a', 'b', 'c']) {
      const t = board.createTask(title);
      const brief = join(t.path, 'brief.md');
      writeFileSync(brief, read(brief).split(/(?<=\n)/).filter((l) => !l.startsWith('rank:')).join(''));
    }
    assert.deepStrictEqual(order(), ['T-001', 'T-002', 'T-003']);
    board.rankTask('T-003', { before: 'T-002' });
    assert.deepStrictEqual(order(), ['T-001', 'T-003', 'T-002']);
    assert.equal(board.getTask('T-003').rank, 1500);
    assert.equal(board.getTask('T-002').meta.get('rank') ?? null, null);
  });

  test('test_check_reports_a_malformed_rank', () => {
    const t = board.createTask('a');
    const brief = join(t.path, 'brief.md');
    writeFileSync(brief, read(brief).replaceAll('rank: 1000', 'rank: soon'));
    assert.ok(board.check().some((p) => p.includes('rank') && p.includes('T-001')));
  });

  test('test_create_and_move_task', () => {
    let t = board.createTask('Fix login', { body: 'Details', priority: 'high', assignee: 'claude' });
    assert.equal(t.id, 'T-001');
    assert.equal(t.status, 'backlog');
    assert.ok(existsSync(join(tmp, 'tasks/backlog/T-001-fix-login/brief.md')));
    assert.ok(existsSync(join(tmp, 'tasks/backlog/T-001-fix-login/worklog.md')));

    t = board.moveTask('T-001', 'in progress', { author: 'claude' });
    assert.equal(t.status, 'in-progress');
    assert.ok(statSync(join(tmp, 'tasks/in-progress/T-001-fix-login')).isDirectory());
    assert.ok(!existsSync(join(tmp, 'tasks/backlog/T-001-fix-login')));
    assert.ok(t.worklog.at(-1).text.includes('backlog'));
    assert.equal(t.worklog.at(-1).author, 'claude');

    const t2 = board.createTask('Second');
    assert.equal(t2.id, 'T-002');
    assert.deepStrictEqual(board.listTasks({ status: 'backlog' }).map((x) => x.id), ['T-002']);
  });

  test('test_log_appends', () => {
    board.createTask('A');
    board.log('1', 'did a thing', { author: 'bot' });
    const t = board.getTask('T-001');
    assert.equal(t.worklog.at(-1).text, 'did a thing');
    assert.equal(t.worklog.length, 2);
  });

  test('test_check_detects_inconsistency', () => {
    board.createSprint('Sprint 1');
    board.createTask('One', { sprint: 'S-001' });
    const brief = join(tmp, 'tasks/backlog/T-001-one/brief.md');
    writeFileSync(brief, read(brief).replaceAll('sprint: S-001', 'sprint: S-009'));
    const problems = board.check();
    assert.ok(problems.some((p) => p.includes('missing sprint S-009')));
    assert.ok(problems.some((p) => p.includes('says sprint=S-009')));
  });

  test('test_quoted_title_survives_store', () => {
    const t = board.createTask('Fix "quoted" bug: x');
    assert.equal(board.getTask(t.id).title, 'Fix "quoted" bug: x');
  });

  test('test_hand_made_task_is_readable', () => {
    const d = join(tmp, 'tasks/in-progress/T-007-hand-made');
    mkdirSync(d);
    writeFileSync(join(d, 'brief.md'), '# Hand made task\n\nJust a heading, no front matter.\n');
    const t = board.getTask('T-007');
    assert.deepStrictEqual([t.title, t.status], ['Hand made task', 'in-progress']);
    assert.equal(board.createTask('Next').id, 'T-008');
    assert.ok(board.check().includes('T-007 has no worklog.md'));
  });

  test('test_assign_logs', () => {
    board.createTask('A');
    let t = board.assign('T-001', 'agent-7', { author: 'agent-7' });
    assert.equal(t.assignee, 'agent-7');
    assert.ok(t.worklog.at(-1).text.includes('agent-7'));
    t = board.assign('T-001', null);
    assert.equal(t.assignee, null);
    assert.ok(t.worklog.at(-1).text.includes('nobody'));
  });

  // Slow (ADR-057 D10): 40 real node processes, in two waves of 20.
  test('test_parallel_writers_get_unique_ids', { timeout: 60_000 }, async () => {
    board.createSprint('S');
    let results = await runAll(Array.from({ length: 20 }, (_, i) => ['create', `job ${i}`, 'S-001']));
    assert.deepStrictEqual(results.filter((r) => r.code !== 0).map((r) => r.stderr), []);
    const ids = board.listTasks().map((t) => t.id);
    assert.deepStrictEqual(ids, Array.from({ length: 20 }, (_, i) => `T-${String(i + 1).padStart(3, '0')}`));
    results = await runAll(ids.map((id) => ['move', id, 'done']));
    assert.deepStrictEqual(results.filter((r) => r.code !== 0).map((r) => r.stderr), []);
    assert.deepStrictEqual(board.check(), []);
    assert.equal(board.sprintProgress(board.getSprint('S-001')).percent, 100);
  });

  test('test_init_writes_config_and_discovery_walks_up', () => {
    assert.equal(board.name, tmp.split('/').at(-1));
    const cfg = join(tmp, 'aiboard.json');
    assert.ok(existsSync(cfg));
    writeFileSync(cfg, '{"name": "My Product", "version": 1}');
    assert.equal(new Board(tmp).name, 'My Product');
    const deep = join(tmp, 'src', 'pkg');
    mkdirSync(deep, { recursive: true });
    assert.equal(findBoardRoot(deep), tmp);
    const empty = makeTmp();
    try {
      assert.equal(findBoardRoot(empty), null);
    } finally {
      rmSync(empty, { recursive: true, force: true });
    }
    const cwd = process.cwd();
    try {
      process.chdir(deep);
      assert.equal(Board.locate(null).root, tmp);
      process.env.AIBOARD_ROOT = join(tmp, 'elsewhere');
      assert.equal(Board.locate(null).root, join(tmp, 'elsewhere'));
    } finally {
      delete process.env.AIBOARD_ROOT;
      process.chdir(cwd);
    }
    assert.equal(Board.locate(tmp).root, tmp);
    assert.equal(board.snapshot().name, 'My Product');
  });

  test('test_pointer_file_discovery', () => {
    const project = makeTmp();
    try {
      const sub = new Board(join(project, 'board'));
      sub.init({ name: 'Sub' });
      assert.notEqual(sub.writePointer(project), null);
      assert.equal(sub.writePointer(project), null);
      assert.deepStrictEqual(JSON.parse(read(join(project, 'aiboard.json'))), { board: 'board' });
      const deep = join(project, 'src', 'x');
      mkdirSync(deep, { recursive: true });
      assert.equal(findBoardRoot(deep), join(project, 'board'));
      assert.equal(new Board(findBoardRoot(deep)).name, 'Sub');
    } finally {
      rmSync(project, { recursive: true, force: true });
    }
  });

  test('test_dependencies', () => {
    board.createTask('A');
    let b = board.createTask('B', { blocked_by: ['T-1'] });
    assert.deepStrictEqual(b.blockedBy, ['T-001']);
    assert.ok(b.blocked);
    assert.equal(b.blockers[0].status, 'backlog');
    assert.deepStrictEqual(board.listTasks({ unblocked: true }).map((t) => t.id), ['T-001']);
    assert.throws(() => board.moveTask('T-002', 'in-progress'), (e) => e instanceof BoardError && e.message.includes('blocked by T-001'));
    board.moveTask('T-002', 'in-progress', { force: true });
    assert.ok(board.check().join(' ').includes('in progress but blocked'));
    board.moveTask('T-002', 'backlog', { force: true });
    board.moveTask('T-001', 'done');
    b = board.getTask('T-002');
    assert.ok(!b.blocked);
    board.moveTask('T-002', 'in-progress');
    // block / unblock keep a worklog trail and validate ids
    board.createTask('C');
    let c = board.block('T-003', ['T-002', '2'], { author: 'x' });
    assert.deepStrictEqual(c.blockedBy, ['T-002']);
    assert.ok(c.worklog.at(-1).text.includes('Blocked by T-002'));
    assert.throws(() => board.block('T-003', ['T-003']), BoardError);
    assert.throws(() => board.block('T-003', ['T-999']), NotFound);
    c = board.unblock('T-003', ['T-002']);
    assert.deepStrictEqual(c.blockedBy, []);
    assert.ok(c.worklog.at(-1).text.includes('No longer blocked'));
    // cycles and dangling references are reported by check
    board.updateTask('T-001', { blocked_by: ['T-003'] });
    board.updateTask('T-003', { blocked_by: ['T-001'] });
    const problems = board.check();
    assert.ok(problems.some((p) => p.includes('dependency cycle') && p.includes('T-001')), problems.join('\n'));
    const brief = join(board.getTask('T-003').path, 'brief.md');
    writeFileSync(brief, read(brief).replaceAll('- T-001', '- T-777'));
    assert.ok(board.check().some((p) => p.includes('missing task T-777')));
    assert.equal(board.getTask('T-003').blockers[0].status, 'missing');
  });

  test('test_start_is_an_atomic_claim', () => {
    board.createTask('A');
    const t = board.start('T-001', 'agent-1', { author: 'agent-1' });
    assert.deepStrictEqual([t.status, t.assignee], ['in-progress', 'agent-1']);
    assert.deepStrictEqual(t.worklog.map((e) => e.author).slice(-2), ['agent-1', 'agent-1']);
    assert.throws(() => board.start('T-001', 'agent-2', { author: 'agent-2' }), (e) => e instanceof BoardError && e.message.includes('in-progress by agent-1'));
    board.createTask('B', { assignee: 'agent-1' });
    assert.throws(() => board.start('T-002', 'agent-2', { author: 'agent-2' }), (e) => e instanceof BoardError && e.message.includes('already assigned to agent-1'));
    assert.equal(board.start('T-002', 'agent-1', { author: 'agent-1' }).status, 'in-progress');
    board.createTask('C', { blocked_by: ['T-001'] });
    assert.throws(() => board.start('T-003', 'agent-2'), BoardError);
    assert.equal(board.start('T-003', 'agent-2', { force: true }).assignee, 'agent-2');
  });

  test('test_assign_refuses_to_steal_without_force', () => {
    board.createTask('A');
    board.assign('T-001', 'agent-1', { author: 'agent-1' });
    assert.throws(() => board.assign('T-001', 'agent-2', { author: 'agent-2' }), (e) => e instanceof BoardError && e.message.includes('already assigned to agent-1'));
    assert.equal(board.assign('T-001', 'agent-2', { author: 'agent-1' }).assignee, 'agent-2');
    assert.equal(board.assign('T-001', null, { author: 'someone' }).assignee, null);
    board.assign('T-001', 'agent-3', { author: 'agent-3' });
    assert.equal(board.assign('T-001', 'boss', { author: 'boss', force: true }).assignee, 'boss');
  });

  // Slow (ADR-057 D10): 12 real node processes race for one task.
  test('test_parallel_start_has_exactly_one_winner', { timeout: 60_000 }, async () => {
    board.createTask('Contended');
    const results = await runAll(Array.from({ length: 12 }, (_, i) => ['start', 'T-001', `agent-${i}`]));
    assert.equal(results.filter((r) => r.code === 0).length, 1, JSON.stringify(results));
    // Beyond aiboard: every loser failed on the claim itself, not on a crash.
    for (const r of results.filter((x) => x.code !== 0)) {
      assert.equal(r.code, 1);
      assert.match(r.stderr, /^BoardError: T-001 is (in-progress by agent-\d+, not in backlog|already assigned to agent-\d+)/);
    }
    const t = board.getTask('T-001');
    assert.equal(t.status, 'in-progress');
    assert.ok(t.assignee.startsWith('agent-'));
    assert.equal(t.worklog.map((e) => e.text).filter((x) => x === 'Status changed `backlog` → `in-progress`.').length, 1);
  });

  test('test_comments_and_stale_detection', () => {
    board.createTask('A');
    let t = board.comment('T-001', 'Is this still needed?', { author: 'mark' });
    assert.equal(t.comments.length, 1);
    assert.deepStrictEqual([t.comments[0].author, t.comments[0].text], ['mark', 'Is this still needed?']);
    assert.ok(existsSync(join(t.path, 'comments.md')));
    assert.equal(t.worklog.length, 1);
    assert.equal(t.toDict().comments_count, 1);
    assert.equal(t.toDict(true).comments[0].author, 'mark');
    assert.ok(!t.stale);

    t = board.start('T-001', 'bot');
    assert.ok(!t.stale);
    // aiboard ages the stamps with replace("2026-09-", "2026-08-"), which only works in September 2026.
    const monthAgo = (s) => s.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g, (ts) => new Date(Date.parse(ts) - 31 * 86_400_000).toISOString().replace(/\.\d{3}Z$/, 'Z'));
    for (const name of ['worklog.md', 'comments.md', 'brief.md']) {
      const f = join(t.path, name);
      writeFileSync(f, monthAgo(read(f)));
    }
    t = board.getTask('T-001');
    assert.ok(t.stale);
    assert.deepStrictEqual(board.listTasks({ stale: true }).map((x) => x.id), ['T-001']);
    assert.ok(board.check().some((p) => p.includes('no worklog entry or comment since')));
    writeFileSync(join(tmp, 'aiboard.json'), '{"name": "x", "stale_after_hours": 100000}');
    assert.ok(!board.getTask('T-001').stale);
    writeFileSync(join(tmp, 'aiboard.json'), '{"name": "x"}');
    board.comment('T-001', 'still on it', { author: 'bot' });
    assert.ok(!board.getTask('T-001').stale);
    // needs_reply: latest comment from someone other than the assignee
    assert.ok(!board.getTask('T-001').needsReply);
    board.comment('T-001', 'how is it going?', { author: 'mark' });
    t = board.getTask('T-001');
    assert.ok(t.needsReply);
    assert.equal(t.lastCommentBy, 'mark');
    assert.deepStrictEqual(board.listTasks({ needs_reply: true }).map((x) => x.id), ['T-001']);
    board.comment('T-001', 'nearly done', { author: 'bot' });
    assert.ok(!board.getTask('T-001').needsReply);
  });

  test('test_not_found', () => {
    assert.throws(() => board.getTask('T-042'), NotFound);
  });

  test('test_snapshot_shape', () => {
    board.createSprint('S');
    board.createTask('T', { sprint: 'S-001' });
    const snap = board.snapshot();
    assert.deepStrictEqual(snap.statuses, ['backlog', 'in-progress', 'done', 'cancelled']);
    assert.equal(snap.sprints[0].progress.total, 1);
    // json.dumps raises on what JSON cannot hold; JSON.stringify would quietly write a Map as {}.
    const walk = (v) => {
      assert.ok(!(v instanceof Map) && v !== undefined && typeof v !== 'bigint', String(v));
      if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(snap);
    JSON.stringify(snap);
  });
});

describe('fkit additions', () => {
  // Each expected value is what aiboard a1592dc gives on Python 3.9 for the same files and calls.
  test('reads and writes files the way Python does (port guard)', () => {
    const crlf = join(tmp, 'tasks/backlog/T-001-crlf');
    mkdirSync(crlf);
    writeFileSync(join(crlf, 'brief.md'), '---\r\nid: T-001\r\ntitle: Crlf\r\nrank: 1000\r\n---\r\n\r\n# Crlf\rbody line\r\n');
    let t = board.getTask('T-001');
    assert.deepStrictEqual([t.title, t.body], ['Crlf', '# Crlf\nbody line']);
    assert.deepStrictEqual(t.meta, new Map([['id', 'T-001'], ['title', 'Crlf'], ['rank', 1000]]));
    board.log('T-001', 'noted', { author: 'x' });
    const rewritten = read(join(crlf, 'brief.md')).replace(/updated: \S+/, 'updated: TS');
    assert.equal(rewritten, '---\nid: T-001\ntitle: Crlf\nrank: 1000\nupdated: TS\n---\n\n# Crlf\nbody line\n');

    const bom = join(tmp, 'tasks/backlog/T-002-bom');
    mkdirSync(bom);
    writeFileSync(join(bom, 'brief.md'), Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from('---\nid: T-002\ntitle: Bom\n---\n\n# Bom\n')]));
    t = board.getTask('T-002');
    assert.deepStrictEqual([t.title, t.body, t.meta.size, t.rank], ['Bom', '\ufeff---\nid: T-002\ntitle: Bom\n---\n\n# Bom\n', 0, 2000]);

    const bad = join(tmp, 'tasks/backlog/T-003-bad');
    mkdirSync(bad);
    writeFileSync(join(bad, 'brief.md'), Buffer.concat([Buffer.from('---\nid: T-003\n---\n\nok '), Buffer.from([0xff, 0x0a])]));
    assert.throws(() => board.getTask('T-003'), (e) => e instanceof ValueError && e.name === 'UnicodeDecodeError' &&
      e.message === "'utf-8' codec can't decode byte 0xff in position 22: invalid start byte");
    rmSync(bad, { recursive: true });

    const sprint = board.createSprint('Eight');
    const ids = Array.from({ length: 8 }, (_, i) => board.createTask(`p${i}`, { sprint: sprint.id }).id);
    board.moveTask(ids[0], 'done');
    assert.equal(board.sprintProgress(board.getSprint(sprint.id)).percent, 12);

    const fd = new Board(join(tmp, 'fd'));
    fd.init();
    for (const x of ['a', 'b', 'c']) fd.createTask(x);
    for (const [tid, from, to] of [['T-001', 'rank: 1000', 'rank: -1999'], ['T-002', 'rank: 2000', 'rank: 0']]) {
      const p = join(fd.getTask(tid).path, 'brief.md');
      writeFileSync(p, read(p).replaceAll(from, to));
    }
    assert.equal(fd.rankTask('T-003', { after: 'T-001' }).rank, -1000);
    assert.deepStrictEqual(fd.listTasks().map((x) => x.id), ['T-001', 'T-003', 'T-002']);

    t = fd.updateTask('T-003', { title: 'A\\nB\\\\C' });
    assert.deepStrictEqual([t.title, t.body], ['A\\nB\\\\C', '# A\nB\\C\n\n_No description yet._']);
    const before = read(join(t.path, 'brief.md'));
    assert.throws(() => fd.updateTask('T-003', { title: 'C:\\path' }), { message: 'bad escape \\p at position 4' });
    assert.equal(read(join(t.path, 'brief.md')), before);

    new Board(join(tmp, 'caf')).init({ name: 'Caf\u00e9 \u2713\x7f' });
    assert.equal(read(join(tmp, 'caf/aiboard.json')), '{\n  "name": "Caf\\u00e9 \\u2713\\u007f",\n  "version": 1\n}\n');
  });

  test('a move into a status folder deleted by hand copies the task, then deletes the original', () => {
    const t = board.createTask('Copy me', { body: 'Details' });
    mkdirSync(join(t.path, 'notes'));
    writeFileSync(join(t.path, 'notes/a.txt'), 'kept\n');
    rmSync(join(tmp, 'tasks/cancelled'), { recursive: true });
    const moved = board.moveTask('T-001', 'cancelled', { author: 'bot' });
    assert.equal(moved.status, 'cancelled');
    assert.equal(moved.path, join(tmp, 'tasks/cancelled/T-001-copy-me'));
    assert.ok(!existsSync(t.path));
    assert.equal(read(join(moved.path, 'notes/a.txt')), 'kept\n');
    assert.equal(moved.body, t.body);
    assert.equal(moved.worklog.length, 2);
    assert.deepStrictEqual(board.check(), []);
  });

  // Not in aiboard (owner ruling, 0418 review R5): ranks are JS numbers, so one past 2^53 is reported.
  test('check reports a rank too big to store exactly', () => {
    const t = board.createTask('a');
    const brief = join(t.path, 'brief.md');
    const setRank = (line) => writeFileSync(brief, read(brief).replace(/^rank: .*\n/m, line));
    const limits = '(it must be between -9007199254740991 and 9007199254740991)';
    assert.deepStrictEqual(board.check(), []);
    for (const edge of ['9007199254740991', '-9007199254740991']) {
      setRank(`rank: ${edge}\n`);
      assert.deepStrictEqual(board.check(), []);
    }
    for (const big of ['9007199254740993', '-9007199254740993']) {
      setRank(`rank: ${big}\n`);
      assert.deepStrictEqual(board.check(), [`T-001: rank ${big} cannot be stored exactly ${limits}`]);
    }
    // With no usable stored rank, the rank comes from the id, which can be past the limit too.
    const bigId = 'T-9100000000000';
    writeFileSync(brief, read(brief).replace('id: T-001', `id: ${bigId}`));
    renameSync(t.path, t.path.replace('T-001', bigId));
    const bigBrief = join(t.path.replace('T-001', bigId), 'brief.md');
    const idRank = `${bigId}: its id-based rank is too big to store exactly (largest is 9007199254740991)`;
    writeFileSync(bigBrief, read(bigBrief).replace(/^rank: .*\n/m, ''));
    assert.deepStrictEqual(board.check(), [idRank]);
    writeFileSync(bigBrief, read(bigBrief).replace('title:', 'rank: abc\ntitle:'));
    assert.deepStrictEqual(board.check(), [`${bigId}: rank 'abc' is not a whole number (it sorts by its id instead)`, idRank]);
  });

  // Node-only: a breaker that died leaves `.break`; waiters back off until it is old enough to remove.
  test('a break file left by a dead breaker is removed, and waiters back off meanwhile', () => {
    const owner = join(tmp, '.aiboard.lock.owner');
    const brk = join(tmp, '.aiboard.lock.break');
    const record = { pid: process.pid, threadId, host: hostname(), token: 'left-by-an-earlier-process' };
    writeFileSync(owner, JSON.stringify(record) + '\n');
    writeFileSync(brk, '');
    const nineSecondsAgo = (Date.now() - 9_000) / 1000;
    utimesSync(brk, nineSecondsAgo, nineSecondsAgo);
    const cpuBefore = process.cpuUsage();
    const start = performance.now();
    assert.equal(board.createTask('after the break').id, 'T-001');
    const wallMs = performance.now() - start;
    const cpu = process.cpuUsage(cpuBefore);
    const cpuMs = (cpu.user + cpu.system) / 1000;
    assert.ok(wallMs >= 500, `took ${wallMs} ms: it did not wait for the break file to age`);
    assert.ok(cpuMs < wallMs / 2, `used ${cpuMs} ms of CPU in ${wallMs} ms: it spun instead of sleeping`);
    assert.ok(!existsSync(owner));
    assert.ok(!existsSync(brk));
  });

  test('worker threads in one process take turns on the lock', { timeout: 60_000 }, async () => {
    const code = `
      const { workerData } = require('node:worker_threads');
      import(workerData.url).then(({ Board }) => {
        const board = new Board(workerData.root);
        for (let i = 0; i < 5; i++) board.createTask('w' + workerData.n + '-' + i);
      });
    `;
    const exits = Array.from({ length: 6 }, (_, n) => {
      const w = new Worker(code, { eval: true, workerData: { url: STORE_URL, root: tmp, n } });
      return new Promise((resolve, reject) => {
        w.on('error', reject);
        w.on('exit', resolve);
      });
    });
    assert.deepStrictEqual(await Promise.all(exits), Array(6).fill(0));
    const ids = order();
    assert.equal(ids.length, 30);
    assert.equal(new Set(ids).size, 30);
    assert.deepStrictEqual(board.check(), []);
    assert.ok(!existsSync(join(tmp, '.aiboard.lock.owner')));
  });

  // Node-only: Python's flock dies with its holder, but an O_EXCL owner file is left behind.
  test('a lock left by a killed process is broken', { timeout: 60_000 }, async () => {
    const child = startChild('hold');
    const done = finished(child);
    await new Promise((resolve, reject) => {
      let out = '';
      child.stdout.on('data', (d) => {
        out += d;
        if (out.includes('held')) resolve();
      });
      child.on('close', () => reject(new Error('holder exited before taking the lock')));
    });
    const owner = join(tmp, '.aiboard.lock.owner');
    assert.ok(existsSync(owner));
    child.kill('SIGKILL');
    await done;
    assert.ok(existsSync(owner));
    assert.equal(board.createTask('after the kill').id, 'T-001');
    assert.ok(!existsSync(owner));
    assert.ok(existsSync(join(tmp, '.aiboard.lock')));
  });
});
