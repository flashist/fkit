// The board's command line: a faithful port of aiboard/cli.py at aiboard a1592dc. Every command supports
// --json for agents; stdout, stderr and exit codes match aiboard under Python 3.9.6.
import { readSync } from 'node:fs';
import { ArgumentParser, SystemExit, sys } from './argparse.mjs';
import { installBlock, renderBlock } from '../core/instructions.mjs';
import { PRIORITIES, STATUSES, canonicalPriority } from '../core/model.mjs';
import {
  PyFloat,
  ValueError,
  metaGet,
  pyDecodeUtf8,
  pyFormatG,
  pyFormatLeft as L,
  pyInt,
  pyJoin,
  pyJsonDumps,
  pyOr,
  pyPosixPath,
  pyReadText,
  pyRstrip,
  pyStr,
  pyStrip,
  pyTruthy,
} from '../core/python-compat.mjs';
import { Board, BoardError, relativeTo } from '../core/store.mjs';
import { serve } from '../server/server.mjs';

export { SystemExit };

const VERSION = '0.1.0';
const DEFAULT_AUTHOR = process.env.AIBOARD_AUTHOR || process.env.USER || 'agent';

const print = (text) => sys.stdout.write(`${text}\n`);
const printErr = (text) => sys.stderr.write(`${text}\n`);

// argparse errors honour --json too, so agents have one place to look for errors.
class Parser extends ArgumentParser {
  error(message) {
    if (process.argv.slice(2).includes('--json')) {
      print(pyJsonDumps(new Map([['error', message]]), null));
      throw new SystemExit(1);
    }
    super.error(message);
  }
}

const priorityType = Object.assign((value) => canonicalPriority(value), { pyName: 'canonical_priority' });
const intType = Object.assign((value) => pyInt(value), { pyName: 'int' });

const boardOf = (args) => Board.locate(args.root);

function emit(args, data, text) {
  print(args.json ? pyJsonDumps(data, 2, { ensureAscii: false }) : text);
}

// sys.stdin.read() on POSIX under a UTF-8 locale: strict UTF-8, and \r\n kept as is, since CPython opens
// stdin with newline="\n" (no universal newlines there, unlike Path.read_text).
const readStdin = () => pyDecodeUtf8(sys.readStdin());

function readBody(args) {
  if (pyTruthy(args.body_file ?? null)) {
    if (args.body_file === '-') return readStdin();
    return pyReadText(args.body_file);
  }
  return pyOr(args.body ?? null, '');
}

// ----------------------------------------------------------------------------- formatting

function taskRow(t) {
  const sprint = pyOr(t.sprint, '-');
  const who = pyOr(t.assignee, '-');
  const flag = t.blocked ? 'blocked' : t.stale ? 'stale' : t.needsReply ? 'reply?' : '';
  return `${L(t.id, 6)} ${L(t.status, 12)} ${L(t.priority, 8)} ${L(sprint, 6)} ${L(who, 12)} ${L(flag, 8)} ${t.title}`;
}

const boardLine = (board) => `board: ${board.name} (${board.root})`;

function taskTable(tasks) {
  if (!tasks.length) return '(no tasks)';
  const header = `${L('ID', 6)} ${L('STATUS', 12)} ${L('PRIO', 8)} ${L('SPRINT', 6)} ${L('ASSIGNEE', 12)} ${L('', 8)} TITLE`;
  return [header, ...tasks.map(taskRow)].join('\n');
}

const dates = (s) => `${pyStr(pyOr(metaGet(s.meta, 'start'), '?'))} → ${pyStr(pyOr(metaGet(s.meta, 'end'), '?'))}`;

function sprintTable(board, sprints) {
  if (!sprints.length) return '(no sprints)';
  const rows = [`${L('ID', 6)} ${L('STATUS', 12)} ${L('DONE', 9)} ${L('DATES', 23)} TITLE`];
  for (const s of sprints) {
    const p = board.sprintProgress(s);
    const done = `${p.counts.done}/${p.total}`;
    rows.push(`${L(s.id, 6)} ${L(s.status, 12)} ${L(done, 9)} ${L(dates(s), 23)} ${s.title}`);
  }
  return rows.join('\n');
}

function withoutTasks(progress) {
  const { tasks: _tasks, ...rest } = progress;
  return rest;
}

// ----------------------------------------------------------------------------- commands

function cmdInit(args) {
  const board = new Board(pyOr(pyOr(args.root, args.dir), '.'));
  const created = board.init({ name: args.name });
  if (pyTruthy(args.dir) && !pyTruthy(args.root)) {
    const pointer = board.writePointer(process.cwd());
    if (pointer !== null) created.push(pointer);
  }
  emit(
    args,
    { root: board.root, name: board.name, created: [...created] },
    `Board '${board.name}' ready at ${board.root} (${created.length} entries created)\n` +
      'Next: `aiboard agents-md` to add agent instructions, `aiboard serve` for the web board.',
  );
}

function cmdTaskNew(args) {
  const board = boardOf(args);
  const t = board.createTask(args.title, {
    body: readBody(args),
    status: args.status,
    sprint: args.sprint,
    priority: args.priority,
    assignee: args.assignee,
    labels: pyOr(args.label, []),
    author: args.by,
    blocked_by: pyOr(args.blocked_by, []),
  });
  emit(args, t.toDict(), `Created ${t.id} in ${t.status}: ${t.path}`);
}

function cmdTaskList(args) {
  const board = boardOf(args);
  let tasks = board.listTasks({
    status: args.status,
    sprint: args.sprint,
    unblocked: args.unblocked,
    stale: args.stale,
    needs_reply: args.needs_reply,
  });
  if (args.blocked) tasks = tasks.filter((t) => t.blocked);
  if (pyTruthy(args.assignee)) tasks = tasks.filter((t) => t.assignee === args.assignee);
  emit(args, tasks.map((t) => t.toDict()), `${boardLine(board)}\n${taskTable(tasks)}`);
}

function cmdTaskShow(args) {
  const board = boardOf(args);
  const t = board.getTask(args.id);
  const blockers = t.blockers.length ? t.blockers.map((b) => `${b.id} (${b.status})`).join(', ') : '-';
  const lines = [
    `${t.id}: ${t.title}`,
    `status:   ${t.status}`,
    `sprint:   ${pyStr(pyOr(t.sprint, '-'))}`,
    `priority: ${t.priority}`,
    `rank:     ${pyStr(t.rank)}`,
    `assignee: ${pyStr(pyOr(t.assignee, '-'))}`,
    `labels:   ${pyOr(pyJoin(', ', pyOr(metaGet(t.meta, 'labels'), [])), '-')}`,
    `blocked:  ${blockers}${t.blocked ? '  <- BLOCKED' : ''}`,
    `folder:   ${t.path}`,
    '',
    pyStrip(t.body),
  ];
  if (t.stale) lines.splice(2, 0, `STALE: no activity since ${pyStr(t.lastActivity)}`);
  if (t.comments.length) {
    lines.push('', '--- comments ---');
    for (const e of t.comments) lines.push(`[${e.timestamp}] ${e.author}: ${e.text}`);
  }
  if (t.worklog.length) {
    lines.push('', '--- worklog ---');
    for (const e of t.worklog) lines.push(`[${e.timestamp}] ${e.author}: ${e.text}`);
  }
  emit(args, t.toDict(true), lines.join('\n'));
}

function cmdTaskChangeStatus(args) {
  const t = boardOf(args).moveTask(args.id, args.status, { author: args.by, note: args.note, force: args.force });
  emit(args, t.toDict(), `${t.id} is now ${t.status}: ${t.path}`);
}

function cmdTaskBlock(args) {
  const t = boardOf(args).block(args.id, args.blockers, { author: args.by });
  emit(args, t.toDict(), `${t.id} is blocked by ${pyOr(pyJoin(', ', t.blockedBy), 'nothing')}`);
}

function cmdTaskRank(args) {
  const t = boardOf(args).rankTask(args.id, { top: args.top, bottom: args.bottom, before: args.before, after: args.after });
  const where = pyTruthy(args.top)
    ? 'to the top'
    : pyTruthy(args.bottom)
      ? 'to the bottom'
      : pyTruthy(args.before)
        ? `before ${args.before}`
        : `after ${pyStr(args.after)}`;
  emit(args, t.toDict(), `Ranked ${t.id} ${where} (rank ${pyStr(t.rank)})`);
}

function cmdTaskUnblock(args) {
  const t = boardOf(args).unblock(args.id, args.blockers, { author: args.by });
  emit(args, t.toDict(), `${t.id} is blocked by ${pyOr(pyJoin(', ', t.blockedBy), 'nothing')}`);
}

function cmdTaskAssign(args) {
  const t = boardOf(args).assign(args.id, pyOr(args.assignee, null), { author: args.by, force: args.force });
  emit(args, t.toDict(), `${t.id} assigned to ${pyStr(pyOr(t.assignee, 'nobody'))}`);
}

function cmdTaskStart(args) {
  const board = boardOf(args);
  const who = pyOr(args.as_, args.by);
  const t = board.start(args.id, who, { author: args.by, force: args.force });
  emit(args, t.toDict(), `${t.id} started by ${who}: ${t.path}`);
}

function cmdTaskLog(args) {
  const board = boardOf(args);
  const message = args.message !== '-' ? args.message : readStdin();
  const t = board.log(args.id, message, { author: args.by });
  emit(args, t.toDict(true), `Logged to ${t.id} (${t.worklog.length} entries)`);
}

function cmdTaskComment(args) {
  const board = boardOf(args);
  const message = args.message !== '-' ? args.message : readStdin();
  const t = board.comment(args.id, message, { author: args.by });
  emit(args, t.toDict(true), `Commented on ${t.id} (${t.comments.length} comments)`);
}

function cmdTaskEdit(args) {
  const board = boardOf(args);
  const fields = {};
  if (pyTruthy(args.title)) fields.title = args.title;
  if (pyTruthy(args.priority)) fields.priority = args.priority;
  if (args.assignee !== null) fields.assignee = pyOr(args.assignee, null);
  if (args.sprint !== null) fields.sprint = pyOr(args.sprint, null);
  if (args.label !== null) fields.labels = args.label;
  if (args.blocked_by !== null) fields.blocked_by = args.blocked_by.filter(pyTruthy);
  if (!Object.keys(fields).length) throw new BoardError('nothing to change');
  const t = board.updateTask(args.id, fields);
  emit(args, t.toDict(), `Updated ${t.id}`);
}

function cmdSprintNew(args) {
  const board = boardOf(args);
  const s = board.createSprint(args.title, {
    goal: pyOr(args.goal, ''),
    body: readBody(args),
    status: args.status,
    start: args.start,
    end: args.end,
  });
  emit(args, s.toDict(), `Created ${s.id} in ${s.status}: ${s.path}`);
}

function cmdSprintList(args) {
  const board = boardOf(args);
  const sprints = board.listSprints({ status: args.status });
  // Progress is worked out per sprint member, as in aiboard, so a broken task outside every sprint
  // cannot fail the listing (0421 plan, Q1).
  const data = sprints.map((s) => {
    const d = s.toDict();
    d.progress = withoutTasks(board.sprintProgress(s));
    return d;
  });
  emit(args, data, `${boardLine(board)}\n${sprintTable(board, sprints)}`);
}

function cmdSprintShow(args) {
  const board = boardOf(args);
  const s = board.getSprint(args.id);
  const p = board.sprintProgress(s);
  const c = p.counts;
  const lines = [
    `${s.id}: ${s.title}`,
    `status:   ${s.status}`,
    `goal:     ${pyStr(pyOr(metaGet(s.meta, 'goal'), '-'))}`,
    `dates:    ${dates(s)}`,
    `progress: ${p.percent}% done  ` +
      `(backlog ${c.backlog}, in-progress ${c['in-progress']}, done ${c.done}, cancelled ${c.cancelled})`,
    `folder:   ${s.path}`,
    '',
    taskTable(p.tasks),
  ];
  const d = s.toDict(true);
  d.progress = withoutTasks(p);
  d.tasks_detail = p.tasks.map((t) => t.toDict());
  emit(args, d, lines.join('\n'));
}

function cmdSprintChangeStatus(args) {
  const s = boardOf(args).moveSprint(args.id, args.status);
  emit(args, s.toDict(), `${s.id} is now ${s.status}: ${s.path}`);
}

function cmdSprintRefresh(args) {
  const s = boardOf(args).refreshSprint(args.id);
  emit(args, s.toDict(), `Re-rendered task list in ${pyPosixPath(`${s.path}/sprint.md`)}`);
}

function cmdSprintAdd(args) {
  const s = boardOf(args).sprintAdd(args.id, args.tasks);
  emit(args, s.toDict(), `${s.id} now has ${s.tasks.length} tasks: ${pyJoin(', ', s.tasks)}`);
}

function cmdSprintRemove(args) {
  const s = boardOf(args).sprintRemove(args.id, args.tasks);
  emit(args, s.toDict(), `${s.id} now has ${s.tasks.length} tasks: ${pyOr(pyJoin(', ', s.tasks), '-')}`);
}

function cmdBoard(args) {
  const board = boardOf(args);
  const snap = board.snapshot();
  if (args.json) {
    print(pyJsonDumps(snap, 2, { ensureAscii: false }));
    return;
  }
  const tasks = board.listTasks({ sprint: args.sprint });
  const columns = new Map(STATUSES.map((s) => [s, tasks.filter((t) => t.status === s)]));
  const width = 28;
  print(boardLine(board));
  print(STATUSES.map((s) => L(`${s.toUpperCase()} (${columns.get(s).length})`, width)).join(''));
  print('-'.repeat(width * STATUSES.length));
  const height = Math.max(0, ...[...columns.values()].map((v) => v.length));
  for (let i = 0; i < height; i++) {
    let row = '';
    for (const s of STATUSES) {
      let cell = '';
      if (i < columns.get(s).length) {
        const t = columns.get(s)[i];
        cell = `${t.id} ${t.title}`;
        // By code point, as Python's len() and slicing count: an emoji is one character, not two.
        const cps = Array.from(cell);
        if (cps.length > width - 2) cell = cps.slice(0, width - 3).join('') + '…';
      }
      row += L(cell, width);
    }
    print(pyRstrip(row));
  }
  if (!height) print('(no tasks)');
}

function cmdInfo(args) {
  const board = boardOf(args);
  if (!board.exists()) throw new BoardError(`no board at ${board.root} (run \`aiboard init\`, or cd into a project that has one)`);
  const tasks = board.listTasks();
  const counts = Object.fromEntries(STATUSES.map((s) => [s, tasks.filter((t) => t.status === s).length]));
  const sprints = board.listSprints();
  const active = sprints.filter((s) => s.status === 'in-progress').map((s) => s.id);
  const data = {
    name: board.name,
    root: board.root,
    config: board.config,
    task_counts: counts,
    sprints: sprints.length,
    active_sprints: active,
    stale_after_hours: new PyFloat(board.staleAfterHours),
  };
  emit(
    args,
    data,
    [
      `board:    ${board.name}`,
      `root:     ${board.root}`,
      `tasks:    ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}`,
      `sprints:  ${sprints.length} (active: ${pyOr(active.join(', '), '-')})`,
      `stale after: ${pyFormatG(board.staleAfterHours)}h`,
    ].join('\n'),
  );
}

function cmdCheck(args) {
  const board = boardOf(args);
  const problems = board.check({ fix: args.fix });
  const remaining = problems.filter((p) => !p.endsWith('(fixed)'));
  emit(
    args,
    { ok: !remaining.length, problems },
    !problems.length ? 'OK: board is consistent' : problems.map((p) => `- ${p}`).join('\n'),
  );
  if (remaining.length) throw new SystemExit(1);
}

function cmdAgentsMd(args) {
  const board = boardOf(args);
  const rel = relativeTo(board.root, process.cwd());
  const hint = rel === null ? `\`${board.root}\`` : rel === '.' ? 'this repository' : `\`${rel}/\``;
  if (args.print) {
    sys.stdout.write(renderBlock(hint));
    return;
  }
  const targets = [pyPosixPath(args.file)];
  if (args.claude) targets.push('CLAUDE.md');
  const results = new Map();
  for (const t of targets) results.set(t, installBlock(t, hint));
  emit(args, results, [...results].map(([k, v]) => `${k}: ${v}`).join('\n'));
}

// Not ported yet (0421 plan, Q2): its parser is, so help, choices and argument errors already match.
function cmdMcp(args) {
  boardOf(args);
  throw new BoardError('aiboard mcp is not ported to Node yet (task 0468, after v1)');
}

// Returns at once; the listening server keeps the process alive until Ctrl+C.
function cmdServe(args) {
  serve(boardOf(args), { host: args.host, port: args.port, open_browser: !args.no_open, read_only: args.read_only });
}

// ----------------------------------------------------------------------------- parser

export function buildParser() {
  const p = new Parser({ prog: 'aiboard', description: 'File-based issue tracker for AI agents and humans.' });
  p.add_argument('--root', { help: 'board root (default: $AIBOARD_ROOT, else the nearest parent holding a board)' });
  p.add_argument('--json', { action: 'store_true', help: 'machine-readable output' });
  p.add_argument('--version', { action: 'version', version: `aiboard ${VERSION}` });
  const sub = p.add_subparsers({ dest: 'cmd', required: true, parser_class: Parser });

  let s = sub.add_parser('init', { help: 'create a board (folder skeleton + aiboard.json)' });
  s.add_argument('dir', { nargs: '?', help: 'where to create it (default: current directory)' });
  s.add_argument('--name', { help: 'board name shown in the web UI (default: folder name)' });
  s.set_defaults({ func: cmdInit });

  // tasks
  const task = sub.add_parser('task', { help: 'manage tasks' }).add_subparsers({ dest: 'task_cmd', required: true, parser_class: Parser });

  s = task.add_parser('new', { help: 'create a task' });
  s.add_argument('title');
  s.add_argument('--body', { help: 'description text (Markdown)' });
  s.add_argument('--body-file', { help: "read description from file ('-' for stdin)" });
  s.add_argument('--status', { default: 'backlog', help: 'backlog (default) | in-progress | done | cancelled' });
  s.add_argument('--sprint', { help: 'attach to sprint, e.g. S-001' });
  s.add_argument('--priority', {
    default: 'medium',
    type: priorityType,
    choices: PRIORITIES,
    help: "critical = drop everything, e.g. production is broken ('urgent' also works)",
  });
  s.add_argument('--assignee');
  s.add_argument('--label', { action: 'append', help: 'repeatable' });
  s.add_argument('--blocked-by', { action: 'append', metavar: 'ID', help: 'repeatable; task that must finish first' });
  s.add_argument('--by', { default: DEFAULT_AUTHOR, help: 'author for the worklog entry' });
  s.set_defaults({ func: cmdTaskNew });

  s = task.add_parser('list', { help: 'list tasks in queue order, top first (metadata only; use `show` for the brief)' });
  s.add_argument('--status');
  s.add_argument('--sprint');
  s.add_argument('--assignee');
  s.add_argument('--unblocked', { action: 'store_true', help: 'only tasks whose blockers are all done or cancelled' });
  s.add_argument('--blocked', { action: 'store_true', help: 'only tasks that are currently blocked' });
  s.add_argument('--stale', { action: 'store_true', help: 'only in-progress tasks with no recent activity' });
  s.add_argument('--needs-reply', { action: 'store_true', help: 'only tasks whose latest comment is not from the assignee' });
  s.set_defaults({ func: cmdTaskList });

  s = task.add_parser('show', { help: 'show brief and worklog' });
  s.add_argument('id');
  s.set_defaults({ func: cmdTaskShow });

  s = task.add_parser('change-status', { aliases: ['status', 'move'], help: 'change status (moves the folder)' });
  s.add_argument('id');
  s.add_argument('status', { help: 'backlog | in-progress | done | cancelled' });
  s.add_argument('--note', { help: 'extra text for the worklog entry' });
  s.add_argument('--force', { action: 'store_true', help: 'start even if blocked by open tasks' });
  s.add_argument('--by', { default: DEFAULT_AUTHOR });
  s.set_defaults({ func: cmdTaskChangeStatus });

  s = task.add_parser('block', { help: "mark a task as blocked by other tasks (Jira: 'is blocked by')" });
  s.add_argument('id');
  s.add_argument('blockers', { nargs: '+', metavar: 'BLOCKER' });
  s.add_argument('--by', { default: DEFAULT_AUTHOR });
  s.set_defaults({ func: cmdTaskBlock });

  s = task.add_parser('rank', {
    help: 'reorder the queue (Jira: Rank): move a task to the top, the bottom, or next to another task',
  });
  s.add_argument('id');
  const where = s.add_mutually_exclusive_group({ required: true });
  where.add_argument('--top', { action: 'store_true', help: 'top of the queue' });
  where.add_argument('--bottom', { action: 'store_true', help: 'bottom of the queue' });
  where.add_argument('--before', { metavar: 'ID', help: 'just above this task' });
  where.add_argument('--after', { metavar: 'ID', help: 'just below this task' });
  s.set_defaults({ func: cmdTaskRank });

  s = task.add_parser('unblock', { help: 'remove blockers from a task' });
  s.add_argument('id');
  s.add_argument('blockers', { nargs: '+', metavar: 'BLOCKER' });
  s.add_argument('--by', { default: DEFAULT_AUTHOR });
  s.set_defaults({ func: cmdTaskUnblock });

  s = task.add_parser('assign', { help: 'set the assignee (records it in the worklog)' });
  s.add_argument('id');
  s.add_argument('assignee', { nargs: '?', default: '', help: 'omit to unassign' });
  s.add_argument('--force', { action: 'store_true', help: 'reassign even if someone else holds the task' });
  s.add_argument('--by', { default: DEFAULT_AUTHOR });
  s.set_defaults({ func: cmdTaskAssign });

  s = task.add_parser('start', {
    help: 'claim a backlog task and move it to in-progress in one atomic step (Jira: Start progress)',
  });
  s.add_argument('id');
  s.add_argument('--as', { dest: 'as_', metavar: 'NAME', help: 'assignee (default: --by / $AIBOARD_AUTHOR)' });
  s.add_argument('--force', {
    action: 'store_true',
    help: 'take it even if assigned to someone else, not in backlog, or blocked',
  });
  s.add_argument('--by', { default: DEFAULT_AUTHOR });
  s.set_defaults({ func: cmdTaskStart });

  s = task.add_parser('log', { help: 'append a worklog entry' });
  s.add_argument('id');
  s.add_argument('message', { help: "Markdown text ('-' for stdin)" });
  s.add_argument('--by', { default: DEFAULT_AUTHOR });
  s.set_defaults({ func: cmdTaskLog });

  s = task.add_parser('comment', {
    help: "add to the task's discussion (comments.md), e.g. a question or review note",
  });
  s.add_argument('id');
  s.add_argument('message', { help: "Markdown text ('-' for stdin)" });
  s.add_argument('--by', { default: DEFAULT_AUTHOR });
  s.set_defaults({ func: cmdTaskComment });

  s = task.add_parser('edit', { help: 'change metadata fields' });
  s.add_argument('id');
  s.add_argument('--title');
  s.add_argument('--priority', { type: priorityType, choices: PRIORITIES });
  s.add_argument('--assignee', { help: "use '' to clear" });
  s.add_argument('--sprint', { help: "use '' to detach" });
  s.add_argument('--label', { action: 'append', help: 'repeatable; replaces all labels' });
  s.add_argument('--blocked-by', {
    action: 'append',
    metavar: 'ID',
    help: "repeatable; replaces all blockers (use '' to clear)",
  });
  s.set_defaults({ func: cmdTaskEdit });

  // sprints
  const sprint = sub.add_parser('sprint', { help: 'manage sprints' }).add_subparsers({ dest: 'sprint_cmd', required: true, parser_class: Parser });

  s = sprint.add_parser('new', { help: 'create a sprint' });
  s.add_argument('title');
  s.add_argument('--goal');
  s.add_argument('--body', { help: 'description text (Markdown)' });
  s.add_argument('--body-file');
  s.add_argument('--status', { default: 'backlog' });
  s.add_argument('--start', { help: 'YYYY-MM-DD' });
  s.add_argument('--end', { help: 'YYYY-MM-DD' });
  s.set_defaults({ func: cmdSprintNew });

  s = sprint.add_parser('list', { help: 'list sprints with progress' });
  s.add_argument('--status');
  s.set_defaults({ func: cmdSprintList });

  s = sprint.add_parser('show', { help: 'sprint status and its tasks' });
  s.add_argument('id');
  s.set_defaults({ func: cmdSprintShow });

  s = sprint.add_parser('change-status', { aliases: ['status', 'move'], help: 'change sprint status (moves the folder)' });
  s.add_argument('id');
  s.add_argument('status');
  s.set_defaults({ func: cmdSprintChangeStatus });

  s = sprint.add_parser('refresh', { help: 're-render the task checklist in sprint.md after hand edits' });
  s.add_argument('id');
  s.set_defaults({ func: cmdSprintRefresh });

  s = sprint.add_parser('add', { help: 'attach tasks to a sprint' });
  s.add_argument('id');
  s.add_argument('tasks', { nargs: '+' });
  s.set_defaults({ func: cmdSprintAdd });

  s = sprint.add_parser('remove', { help: 'detach tasks from a sprint' });
  s.add_argument('id');
  s.add_argument('tasks', { nargs: '+' });
  s.set_defaults({ func: cmdSprintRemove });

  // board-wide
  s = sub.add_parser('board', { help: 'print a kanban view' });
  s.add_argument('--sprint', { help: 'only tasks of this sprint' });
  s.set_defaults({ func: cmdBoard });

  sub.add_parser('info', { help: 'which board the CLI resolves to from here, and a summary' }).set_defaults({ func: cmdInfo });

  s = sub.add_parser('check', { help: 'validate consistency between tasks and sprints' });
  s.add_argument('--fix', { action: 'store_true', help: 'repair what can be repaired (stale sprint task lists)' });
  s.set_defaults({ func: cmdCheck });

  s = sub.add_parser('agents-md', { help: 'add (or refresh) aiboard instructions in AGENTS.md for any coding agent' });
  s.add_argument('--file', { default: 'AGENTS.md', help: 'target file (default: AGENTS.md in the current directory)' });
  s.add_argument('--claude', { action: 'store_true', help: 'also write the block into CLAUDE.md' });
  s.add_argument('--print', { action: 'store_true', help: 'print the block instead of writing files' });
  s.set_defaults({ func: cmdAgentsMd });

  s = sub.add_parser('mcp', { help: 'run an MCP server over stdio for agents (Claude Code, Codex, Cursor, ...)' });
  s.add_argument('--author', { help: "name recorded in worklogs (default: $AIBOARD_AUTHOR or 'mcp-agent')" });
  s.set_defaults({ func: cmdMcp });

  s = sub.add_parser('serve', { help: 'run the web board' });
  s.add_argument('--host', { default: '127.0.0.1' });
  s.add_argument('--port', { type: intType, default: 8484 });
  s.add_argument('--no-open', { action: 'store_true', help: 'do not open a browser' });
  s.add_argument('--read-only', { action: 'store_true', help: 'disable editing from the browser' });
  s.set_defaults({ func: cmdServe });
  return p;
}

// Read all of fd 0 synchronously; a non-blocking stdin (a tty, or some pipes) reports EAGAIN until data comes.
function readStdinSync() {
  const chunks = [];
  const buf = Buffer.alloc(65536);
  for (;;) {
    let n;
    try {
      n = readSync(0, buf, 0, buf.length, null);
    } catch (e) {
      if (e.code === 'EAGAIN') {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
        continue;
      }
      if (e.code === 'EOF') break;
      throw e;
    }
    if (n === 0) break;
    chunks.push(Buffer.from(buf.subarray(0, n)));
  }
  return Buffer.concat(chunks);
}

function run(argv) {
  const parser = buildParser();
  argv = [...(argv ?? process.argv.slice(2))];
  // --json is accepted anywhere on the command line, not only before the subcommand
  const jsonFlag = argv.includes('--json');
  argv = argv.filter((a) => a !== '--json');
  const args = parser.parse_args(argv);
  args.json = jsonFlag;
  try {
    args.func(args);
  } catch (e) {
    if (!(e instanceof BoardError || e instanceof ValueError)) throw e;
    if (args.json) print(pyJsonDumps(new Map([['error', e.message]]), null));
    else printErr(`error: ${e.message}`);
    return 1;
  }
  return 0;
}

/**
 * aiboard's main(): returns 0 or 1, or throws SystemExit where Python's sys.exit() would (argument
 * errors 2, help and version 0, a --json argument error 1, `check` with problems left 1). `io` stands in
 * for sys.stdout / sys.stderr / sys.stdin; stdout and stderr need only a write(string) method.
 */
export function main(argv = null, io = {}) {
  const saved = { ...sys };
  sys.stdout = io.stdout ?? process.stdout;
  sys.stderr = io.stderr ?? process.stderr;
  sys.readStdin = io.readStdin ?? readStdinSync;
  try {
    return run(argv);
  } finally {
    Object.assign(sys, saved);
  }
}
