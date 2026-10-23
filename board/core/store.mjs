// The board's filesystem store: a faithful port of aiboard/store.py at aiboard a1592dc, except that
// snapshot() reads each task once (aiboard T-021, built in per ADR-052 D9).
//
//     tasks/<status>/<T-001-slug>/brief.md, worklog.md, comments.md
//     sprints/<status>/<S-001-slug>/sprint.md
//
// The folder a task or sprint sits in *is* its status. Every call is synchronous, as in Python, so
// one process never interleaves two store calls; writers in different processes take writeLock.
import {
  closeSync,
  constants,
  copyFileSync,
  cpSync,
  lstatSync,
  mkdirSync,
  openSync,
  readdirSync,
  readlinkSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  unlinkSync,
  utimesSync,
} from 'node:fs';
import { NestedLockError, acquireLock, releaseLock } from './lock.mjs';
import {
  BRIEF_FILE,
  COMMENTS_FILE,
  DEFAULT_STALE_HOURS,
  PRIORITIES,
  RANK_STEP,
  SPRINT_FILE,
  SPRINT_PREFIX,
  STATUSES,
  TASK_PREFIX,
  WORKLOG_FILE,
  Sprint,
  Task,
  dumpFrontMatter,
  formatId,
  formatWorklogEntry,
  normalizeId,
  normalizePriority,
  normalizeStatus,
  nowIso,
  parseFrontMatter,
  parseIso,
  parseWorklog,
  slugify,
} from './model.mjs';
import {
  AttributeError,
  PY_WS_CLASS,
  ValueError,
  metaGet,
  pyAsciiDigits,
  pyCompare,
  pyFloat,
  pyFloorDiv,
  pyFormatG,
  pyInt,
  pyJsonDumps,
  pyJsonLoads,
  pyList,
  pyOr,
  pyPathName,
  pyPosixPath,
  pyReadText,
  pyRepr,
  pyResolve,
  pyRound,
  pyStr,
  pyStrip,
  pySubTemplate,
  pyTimedeltaHoursMs,
  pyTruthy,
  pyTypeName,
  pyWriteText,
} from './python-compat.mjs';

export class BoardError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BoardError';
  }
}

export class NotFound extends BoardError {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
  }
}

class StopIteration extends Error {
  constructor() {
    super('');
    this.name = 'StopIteration';
  }
}

// Python's \d is Unicode and its $ also matches before one final \n.
export const ID_DIR = /^([A-Z])-(\p{Nd}+)(?:-([^\n]*))?\n?$/u;
export const LOCK_FILE = '.aiboard.lock';
export const CONFIG_FILE = 'aiboard.json';

// Python's re.M ^ and $ break lines only at \n; JS's m flag also breaks at \r, U+2028 and U+2029.
const HEADING_LINE = /(?<![^\n])# [^\n]*(?![^\n])/u;
const TITLE_LINE = new RegExp(`(?<![^\\n])#${PY_WS_CLASS}+([^\\n]+?)${PY_WS_CLASS}*(?![^\\n])`, 'u');
const TASKS_SECTION = new RegExp(`(?<![^\\n])## Tasks${PY_WS_CLASS}*\\n[\\s\\S]*?(?=(?<![^\\n])## |(?![\\s\\S]))`, 'u');

// ----------------------------------------------------------------------------- pathlib / shutil

// Path.exists / is_dir / is_file: these errors mean "no", any other is raised.
const IGNORED = new Set(['ENOENT', 'ENOTDIR', 'EBADF', 'ELOOP']);

function stat(p) {
  try {
    return statSync(p);
  } catch (e) {
    if (IGNORED.has(e.code)) return null;
    throw e;
  }
}

const exists = (p) => stat(p) !== null;
const isDir = (p) => stat(p)?.isDirectory() ?? false;
const isFile = (p) => stat(p)?.isFile() ?? false;

// Python's Path "/" joins without collapsing "..", and an absolute right side replaces the left.
function pj(base, ...names) {
  let out = base;
  for (const name of names) out = name.startsWith('/') ? name : `${out}/${name}`;
  return pyPosixPath(out);
}

function parentOf(p) {
  const i = p.lastIndexOf('/');
  if (i === -1) return '.';
  return i === 0 ? '/' : p.slice(0, i);
}

function parents(p) {
  const out = [];
  for (let cur = p, up = parentOf(p); up !== cur; cur = up, up = parentOf(up)) out.push(up);
  return out;
}

export function relativeTo(path, other) {
  const parts = (p) => (p.startsWith('/') ? ['/', ...p.split('/').filter(Boolean)] : p.split('/').filter(Boolean));
  const a = parts(path);
  const b = parts(other);
  if (b.length > a.length || b.some((x, i) => x !== a[i])) return null;
  return a.slice(b.length).join('/') || '.';
}

function mkdir(p, { parents: withParents = false, existOk = false } = {}) {
  try {
    mkdirSync(p, 0o777);
  } catch (e) {
    if (e.code === 'ENOENT' && withParents && parentOf(p) !== p) {
      mkdir(parentOf(p), { parents: true, existOk: true });
      mkdir(p, { existOk });
      return;
    }
    if (!existOk || !isDir(p)) throw e;
  }
}

function touch(p) {
  try {
    const now = new Date();
    utimesSync(p, now, now);
  } catch {
    closeSync(openSync(p, constants.O_CREAT | constants.O_WRONLY, 0o666));
  }
}

// shutil.move: a rename, else (another filesystem, or a missing status folder) copy then delete.
function move(src, dst) {
  try {
    renameSync(src, dst);
  } catch (e) {
    if (e.errno === undefined) throw e;
    if (lstatSync(src).isSymbolicLink()) {
      symlinkSync(readlinkSync(src), dst);
      unlinkSync(src);
    } else if (isDir(src)) {
      cpSync(src, dst, { recursive: true, verbatimSymlinks: true, preserveTimestamps: true, errorOnExist: true, force: false });
      rmSync(src, { recursive: true });
    } else {
      copyFileSync(src, dst);
      unlinkSync(src);
    }
  }
}

function rstripNewlines(s) {
  let end = s.length;
  while (end > 0 && s[end - 1] === '\n') end -= 1;
  return s.slice(0, end);
}

// dict.get on whatever json.loads returned: only a dict has .get.
function dictGet(d, key, fallback = null) {
  if (!(d instanceof Map)) throw new AttributeError(`'${pyTypeName(d)}' object has no attribute 'get'`);
  return d.has(key) ? d.get(key) : fallback;
}

// `key in dict`: a list or dict key is unhashable in Python, so the lookup raises.
function pyIn(map, key) {
  if (Array.isArray(key) || key instanceof Map) throw new TypeError(`unhashable type: '${pyTypeName(key)}'`);
  return map.has(key);
}

function minOf(xs) {
  return xs.reduce((a, b) => (b < a ? b : a));
}

function maxOf(xs) {
  return xs.reduce((a, b) => (b > a ? b : a));
}

// ----------------------------------------------------------------------------- discovery

/**
 * Walk up from `start` (default: cwd) to find a board root, like git does. A folder is a board root
 * when it holds aiboard.json or both tasks/ and sprints/; an aiboard.json with a "board" key points
 * to the board folder, relative to the file. Returns the root path, or null.
 */
export function findBoardRoot(start = null) {
  const here = pyResolve(pyTruthy(start) ? start : process.cwd());
  for (const candidate of [here, ...parents(here)]) {
    const cfg = pj(candidate, CONFIG_FILE);
    if (isFile(cfg)) {
      let data;
      try {
        data = pyJsonLoads(pyReadText(cfg));
      } catch (e) {
        if (!(e instanceof ValueError)) throw e;
        data = new Map();
      }
      const target = data instanceof Map ? metaGet(data, 'board') : null;
      if (pyTruthy(target)) {
        const pointed = pyResolve(pj(candidate, pyStr(target)));
        if (isDir(pointed)) return pointed;
      }
      return candidate;
    }
    if (isDir(pj(candidate, 'tasks')) && isDir(pj(candidate, 'sprints'))) return candidate;
  }
  return null;
}

// ----------------------------------------------------------------------------- the board

export class Board {
  constructor(root) {
    if (typeof root !== 'string') throw new TypeError(`expected str, bytes or os.PathLike object, not ${pyTypeName(root)}`);
    this.root = pyResolve(root);
    this._lockDepth = 0;
    this._lockFd = null;
    this._lockHandle = null;
  }

  /** Resolve the board: explicit root, then $AIBOARD_ROOT, then walk up from cwd. */
  static locate(root = null) {
    if (pyTruthy(root)) return new Board(root);
    const env = process.env.AIBOARD_ROOT;
    if (env) return new Board(env);
    const found = findBoardRoot();
    return new Board(found ?? process.cwd());
  }

  /** Contents of aiboard.json as a Map (re-read on every access; it is tiny and may change). */
  get config() {
    const f = pj(this.root, CONFIG_FILE);
    try {
      return isFile(f) ? pyJsonLoads(pyReadText(f)) : new Map();
    } catch (e) {
      if (e instanceof ValueError) throw new BoardError(`${f} is not valid JSON: ${e.message}`);
      throw e;
    }
  }

  get name() {
    return pyStr(pyOr(dictGet(this.config, 'name'), pyPathName(this.root)));
  }

  /**
   * Run `fn` holding the cross-process write lock (re-entrant per Board) and return its result.
   * `fn` must be synchronous: the lock is released as soon as it returns.
   */
  writeLock(fn) {
    if (this._lockDepth === 0) {
      this._require();
      const lockPath = pj(this.root, LOCK_FILE);
      // Python's flock file, kept so the board folder looks the same on disk.
      this._lockFd = openSync(lockPath, constants.O_RDWR | constants.O_CREAT, 0o644);
      try {
        this._lockHandle = acquireLock(lockPath);
      } catch (e) {
        closeSync(this._lockFd);
        this._lockFd = null;
        if (e instanceof NestedLockError) throw new BoardError(e.message);
        throw e;
      }
    }
    this._lockDepth += 1;
    try {
      return fn();
    } finally {
      this._lockDepth -= 1;
      if (this._lockDepth === 0 && this._lockFd !== null) {
        releaseLock(this._lockHandle);
        this._lockHandle = null;
        closeSync(this._lockFd);
        this._lockFd = null;
      }
    }
  }

  // --------------------------------------------------------------------------- paths
  get tasksDir() {
    return pj(this.root, 'tasks');
  }

  get sprintsDir() {
    return pj(this.root, 'sprints');
  }

  exists() {
    return isDir(this.tasksDir) && isDir(this.sprintsDir);
  }

  init({ name = null } = {}) {
    const created = [];
    mkdir(this.root, { parents: true, existOk: true });
    for (const base of [this.tasksDir, this.sprintsDir]) {
      for (const status of STATUSES) {
        const p = pj(base, status);
        if (!exists(p)) {
          mkdir(p, { parents: true });
          created.push(p);
        }
        const keep = pj(p, '.gitkeep');
        if (!exists(keep)) touch(keep);
      }
    }
    const cfg = pj(this.root, CONFIG_FILE);
    if (!exists(cfg)) {
      pyWriteText(cfg, pyJsonDumps(new Map([['name', pyOr(name, pyPathName(this.root))], ['version', 1]])) + '\n');
      created.push(cfg);
    }
    return created;
  }

  /**
   * Write <projectDir>/aiboard.json = {"board": "<relative path>"} so the board is discoverable from
   * the whole project. Returns null, writing nothing, if a config exists there.
   */
  writePointer(projectDir) {
    const project = pyResolve(projectDir);
    if (project === this.root) return null;
    const pointer = pj(project, CONFIG_FILE);
    if (exists(pointer)) return null;
    const rel = relativeTo(this.root, project);
    if (rel === null) return null;
    pyWriteText(pointer, pyJsonDumps(new Map([['board', rel]])) + '\n');
    return pointer;
  }

  _require() {
    if (!this.exists()) throw new BoardError(`no board at ${this.root} (run \`aiboard init\` first)`);
  }

  // --------------------------------------------------------------------------- scanning
  /** Yield [id, status, path] for every entity folder under base. */
  *_scan(base, prefix) {
    for (const status of STATUSES) {
      const statusDir = pj(base, status);
      if (!isDir(statusDir)) continue;
      for (const name of readdirSync(statusDir).sort(pyCompare)) {
        const child = pj(statusDir, name);
        if (!isDir(child)) continue;
        const m = ID_DIR.exec(name);
        if (!m || m[1] !== prefix) continue;
        yield [formatId(prefix, BigInt(pyAsciiDigits(m[2]))), status, child];
      }
    }
  }

  _locate(base, prefix, ref) {
    const wanted = normalizeId(prefix, ref);
    if (wanted === null) throw new NotFound(`${pyRepr(ref)} is not a valid ${prefix}-id`);
    for (const [eid, status, path] of this._scan(base, prefix)) {
      if (eid === wanted) return [eid, status, path];
    }
    throw new NotFound(`${wanted} not found under ${base}`);
  }

  // A BigInt, so an id past 2^53 still gets the next number exactly.
  _nextNumber(base, prefix) {
    const numbers = [...this._scan(base, prefix)].map(([eid]) => BigInt(eid.split('-')[1]));
    return numbers.length ? maxOf(numbers) + 1n : 1n;
  }

  // --------------------------------------------------------------------------- tasks
  _loadTask(tid, status, path) {
    const brief = pj(path, BRIEF_FILE);
    const [meta, body] = exists(brief) ? parseFrontMatter(pyReadText(brief)) : [new Map(), ''];
    const worklogPath = pj(path, WORKLOG_FILE);
    const worklog = exists(worklogPath) ? parseWorklog(pyReadText(worklogPath)) : [];
    const commentsPath = pj(path, COMMENTS_FILE);
    const comments = exists(commentsPath) ? parseWorklog(pyReadText(commentsPath)) : [];
    const title = pyOr(pyOr(metaGet(meta, 'title'), _titleFromBody(body)), pyPathName(path));
    const task = new Task({ id: tid, title: pyStr(title), status, path, meta, body, worklog, comments });
    task.stale = this._isStale(task);
    return task;
  }

  get staleAfterHours() {
    const raw = dictGet(this.config, 'stale_after_hours', DEFAULT_STALE_HOURS);
    try {
      return pyFloat(raw);
    } catch (e) {
      if (e instanceof TypeError || e instanceof ValueError) return DEFAULT_STALE_HOURS;
      throw e;
    }
  }

  /** In progress with no worklog entry or comment for longer than staleAfterHours. */
  _isStale(task) {
    if (task.status !== 'in-progress') return false;
    const last = parseIso(task.lastActivity);
    if (last === null) return true;
    const age = Date.now() - last.getTime();
    return age > pyTimedeltaHoursMs(this.staleAfterHours);
  }

  /** id -> [status, title] for every task, without parsing worklogs. */
  _statusIndex() {
    const index = new Map();
    for (const [tid, st, path] of this._scan(this.tasksDir, TASK_PREFIX)) {
      const brief = pj(path, BRIEF_FILE);
      let title = pyPathName(path);
      if (exists(brief)) {
        const [meta, body] = parseFrontMatter(pyReadText(brief));
        title = pyStr(pyOr(pyOr(metaGet(meta, 'title'), _titleFromBody(body)), pyPathName(path)));
      }
      index.set(tid, [st, title]);
    }
    return index;
  }

  _resolveBlockers(task, index = null) {
    const ids = task.blockedBy;
    if (!ids.length) {
      task.blockers = [];
      return task;
    }
    const idx = index ?? this._statusIndex();
    task.blockers = ids.map((b) =>
      idx.has(b) ? { id: b, status: idx.get(b)[0], title: idx.get(b)[1] } : { id: b, status: 'missing', title: null },
    );
    return task;
  }

  listTasks(filters = {}) {
    return this._listTasks(filters, null);
  }

  /** listTasks, also filling byId (when given) with the first task per id in scan order, as _locate finds. */
  _listTasks({ status = null, sprint = null, unblocked = false, stale = false, needs_reply = false } = {}, byId) {
    this._require();
    const wanted = pyTruthy(status) ? normalizeStatus(status) : null;
    const sprintId = pyTruthy(sprint) ? normalizeId(SPRINT_PREFIX, sprint) : null;
    const index = this._statusIndex();
    const out = [];
    for (const [tid, st, path] of this._scan(this.tasksDir, TASK_PREFIX)) {
      if (pyTruthy(wanted) && st !== wanted) continue;
      const task = this._loadTask(tid, st, path);
      if (pyTruthy(sprintId) && task.sprint !== sprintId) continue;
      this._resolveBlockers(task, index);
      if (pyTruthy(unblocked) && task.blocked) continue;
      if (pyTruthy(stale) && !task.stale) continue;
      if (pyTruthy(needs_reply) && !task.needsReply) continue;
      out.push(task);
      if (byId !== null && !byId.has(tid)) byId.set(tid, task);
    }
    return out.sort(_cmpRankKey);
  }

  getTask(ref) {
    this._require();
    const [tid, status, path] = this._locate(this.tasksDir, TASK_PREFIX, ref);
    return this._resolveBlockers(this._loadTask(tid, status, path));
  }

  createTask(title, { body = '', status = 'backlog', sprint = null, priority = 'medium', assignee = null, labels = null, author = 'aiboard', blocked_by = null } = {}) {
    return this.writeLock(() => {
      this._require();
      const st = normalizeStatus(status);
      const prio = _priority(priority);
      const sprintObj = pyTruthy(sprint) ? this.getSprint(sprint) : null;
      const blockers = this._normalizeBlockers(pyOr(blocked_by, []), null);
      const tid = formatId(TASK_PREFIX, this._nextNumber(this.tasksDir, TASK_PREFIX));
      const ranks = this._rankEntries().map((t) => t.rank);
      let rank;
      if (prio === 'critical') rank = ranks.length ? minOf(ranks) - RANK_STEP : RANK_STEP;
      else rank = ranks.length ? maxOf(ranks) + RANK_STEP : RANK_STEP;
      const folder = pj(this.tasksDir, st, `${tid}-${slugify(title)}`);
      mkdir(folder, { parents: true });
      const ts = nowIso();
      const meta = new Map([
        ['id', tid],
        ['title', title],
        ['sprint', sprintObj ? sprintObj.id : null],
        ['priority', prio],
        ['rank', rank],
        ['assignee', assignee],
        ['labels', pyOr(labels, [])],
        ['blocked_by', blockers],
        ['created', ts],
        ['updated', ts],
      ]);
      const text = pyStrip(body) || '_No description yet._';
      pyWriteText(pj(folder, BRIEF_FILE), dumpFrontMatter(meta, `# ${pyStr(title)}\n\n${text}\n`));
      pyWriteText(pj(folder, WORKLOG_FILE), '# Worklog\n\n' + formatWorklogEntry(ts, author, `Task created in \`${st}\`.`));
      if (sprintObj) this._sprintSetTasks(sprintObj, [...sprintObj.tasks, tid]);
      return this.getTask(tid);
    });
  }

  /**
   * Update front-matter fields, given as a Map or a plain object; new keys land in the given order.
   * Keys are the front-matter names (`blocked_by`, not `blockedBy`). Passing `sprint` keeps sprint
   * files in sync.
   */
  updateTask(ref, fields = {}) {
    return this.writeLock(() => {
      const task = this.getTask(ref);
      const wasCritical = task.priority === 'critical';
      const meta = new Map(task.meta);
      const f = new Map(fields instanceof Map ? fields : Object.entries(fields));
      for (const [k, v] of f) if (v === undefined) f.set(k, null);
      if (f.has('sprint')) {
        const newSprint = f.get('sprint');
        f.delete('sprint');
        const newId = pyTruthy(newSprint) ? this.getSprint(newSprint).id : null;
        if (pyTruthy(task.sprint) && task.sprint !== newId) {
          try {
            const old = this.getSprint(task.sprint);
            this._sprintSetTasks(old, old.tasks.filter((t) => t !== task.id));
          } catch (e) {
            if (!(e instanceof NotFound)) throw e;
          }
        }
        if (pyTruthy(newId)) {
          const sp = this.getSprint(newId);
          if (!sp.tasks.includes(task.id)) this._sprintSetTasks(sp, [...sp.tasks, task.id]);
        }
        meta.set('sprint', newId);
      }
      if (f.has('priority')) f.set('priority', _priority(f.get('priority')));
      if (f.has('blocked_by')) f.set('blocked_by', this._normalizeBlockers(pyOr(f.get('blocked_by'), []), task.id));
      for (const [k, v] of f) {
        if (v !== null || meta.has(k)) meta.set(k, v);
      }
      meta.set('updated', nowIso());
      let body = task.body;
      if (f.has('title') && pyTruthy(f.get('title'))) {
        // re.sub expands escapes in the new title, so `C:\path` raises "bad escape \p" as in aiboard.
        const expand = pySubTemplate(`# ${pyStr(f.get('title'))}`, 0);
        body = body.replace(HEADING_LINE, (m) => expand([m]));
      }
      pyWriteText(pj(task.path, BRIEF_FILE), dumpFrontMatter(meta, body));
      if (metaGet(meta, 'priority') === 'critical' && !wasCritical) return this.rankTask(task.id, { top: true });
      return this.getTask(task.id);
    });
  }

  // --------------------------------------------------------------------------- ranking
  /** Every task in queue order, loaded light (front matter and brief only, no logs). */
  _rankEntries() {
    const out = [];
    for (const [tid, st, path] of this._scan(this.tasksDir, TASK_PREFIX)) {
      const brief = pj(path, BRIEF_FILE);
      const [meta, body] = exists(brief) ? parseFrontMatter(pyReadText(brief)) : [new Map(), ''];
      out.push(new Task({ id: tid, title: pyStr(pyOr(metaGet(meta, 'title'), pyPathName(path))), status: st, path, meta, body }));
    }
    return out.sort(_cmpRankKey);
  }

  /** Store a rank next to `priority` without touching `updated`: reordering is not work on the task. */
  _writeRank(task, rank) {
    const meta = new Map();
    for (const [key, value] of task.meta) {
      if (key === 'rank') continue;
      meta.set(key, value);
      if (key === 'priority') meta.set('rank', rank);
    }
    if (!meta.has('rank')) meta.set('rank', rank);
    pyWriteText(pj(task.path, BRIEF_FILE), dumpFrontMatter(meta, task.body));
  }

  /**
   * Jira's "Rank": move a task to the top or bottom of the queue, or just before or after another
   * task. Usually rewrites only this task's brief; with no room between the neighbours, the whole
   * order is respaced by RANK_STEP.
   */
  rankTask(ref, { top = false, bottom = false, before = null, after = null } = {}) {
    if ([top, bottom, before, after].filter(pyTruthy).length !== 1) {
      throw new BoardError('give exactly one of top, bottom, before or after');
    }
    return this.writeLock(() => {
      const task = this.getTask(ref);
      const others = this._rankEntries().filter((t) => t.id !== task.id);
      let index;
      if (pyTruthy(top)) index = 0;
      else if (pyTruthy(bottom)) index = others.length;
      else {
        const anchor = this.getTask(pyOr(before, after));
        if (anchor.id === task.id) throw new BoardError(`${task.id} cannot be ranked relative to itself`);
        const at = others.findIndex((t) => t.id === anchor.id);
        if (at === -1) throw new StopIteration();
        index = pyTruthy(before) ? at : at + 1;
      }
      const prev = index > 0 ? others[index - 1] : null;
      const nxt = index < others.length ? others[index] : null;
      const alreadyThere = task.hasStoredRank && (prev === null || _cmpRankKey(prev, task) < 0) && (nxt === null || _cmpRankKey(task, nxt) < 0);
      if (alreadyThere) return task;
      let rank;
      if (prev === null && nxt === null) rank = RANK_STEP;
      else if (prev === null) rank = nxt.rank - RANK_STEP;
      else if (nxt === null) rank = prev.rank + RANK_STEP;
      else if (nxt.rank - prev.rank >= 2) rank = pyFloorDiv(prev.rank + nxt.rank, 2);
      else rank = null;
      if (rank !== null) {
        this._writeRank(task, rank);
      } else {
        const order = [...others.slice(0, index), task, ...others.slice(index)];
        order.forEach((t, i) => {
          const position = (i + 1) * RANK_STEP;
          if (!t.hasStoredRank || t.rank !== position) this._writeRank(t, position);
        });
      }
      return this.getTask(task.id);
    });
  }

  moveTask(ref, status, { author = 'aiboard', note = null, force = false } = {}) {
    return this.writeLock(() => {
      const task = this.getTask(ref);
      const st = normalizeStatus(status);
      if (st === task.status) return task;
      if (st === 'in-progress' && task.blocked && !pyTruthy(force)) {
        const openIds = task.blockers.filter((b) => b.status !== 'done' && b.status !== 'cancelled').map((b) => b.id);
        throw new BoardError(`${task.id} is blocked by ${openIds.join(', ')}; finish those first or pass --force`);
      }
      const dest = pj(this.tasksDir, st, pyPathName(task.path));
      if (exists(dest)) throw new BoardError(`destination already exists: ${dest}`);
      move(task.path, dest);
      const moved = this._loadTask(task.id, st, dest);
      let message = `Status changed \`${task.status}\` → \`${st}\`.`;
      if (pyTruthy(note)) message += ` ${pyStr(note)}`;
      this._appendWorklog(moved, author, message);
      this._touch(moved);
      if (pyTruthy(moved.sprint)) {
        try {
          this.refreshSprint(moved.sprint);
        } catch (e) {
          if (!(e instanceof NotFound)) throw e;
        }
      }
      return this.getTask(task.id);
    });
  }

  _normalizeBlockers(refs, selfId) {
    const out = [];
    const index = this._statusIndex();
    for (const ref of pyList(refs)) {
      const tid = normalizeId(TASK_PREFIX, pyStr(ref));
      if (tid === null) throw new BoardError(`${pyRepr(ref)} is not a valid task id`);
      if (tid === selfId) throw new BoardError(`${tid} cannot block itself`);
      if (!index.has(tid)) throw new NotFound(`${tid} not found under ${this.tasksDir}`);
      if (!out.includes(tid)) out.push(tid);
    }
    return out;
  }

  /** Add blockers (Jira: "is blocked by"). */
  block(ref, blockerRefs, { author = 'aiboard' } = {}) {
    return this.writeLock(() => {
      const task = this.getTask(ref);
      const added = this._normalizeBlockers(blockerRefs, task.id).filter((b) => !task.blockedBy.includes(b));
      if (!added.length) return task;
      this.updateTask(task.id, { blocked_by: [...task.blockedBy, ...added] });
      this._appendWorklog(this.getTask(task.id), author, `Blocked by ${added.join(', ')}.`);
      return this.getTask(task.id);
    });
  }

  unblock(ref, blockerRefs, { author = 'aiboard' } = {}) {
    return this.writeLock(() => {
      const task = this.getTask(ref);
      const drop = pyList(blockerRefs).map((r) => normalizeId(TASK_PREFIX, r));
      const removed = task.blockedBy.filter((b) => drop.includes(b));
      if (!removed.length) return task;
      this.updateTask(task.id, { blocked_by: task.blockedBy.filter((b) => !drop.includes(b)) });
      this._appendWorklog(this.getTask(task.id), author, `No longer blocked by ${removed.join(', ')}.`);
      return this.getTask(task.id);
    });
  }

  /**
   * Jira's "Start progress", done atomically: claim the task and move it to in-progress. Fails
   * unless the task is in backlog and unassigned (or already assigned to `assignee`).
   */
  start(ref, assignee, { author = 'aiboard', force = false } = {}) {
    const who = assignee === undefined ? null : assignee;
    return this.writeLock(() => {
      const task = this.getTask(ref);
      if (task.status !== 'backlog' && !pyTruthy(force)) {
        const by = pyTruthy(task.assignee) ? ` by ${pyStr(task.assignee)}` : '';
        throw new BoardError(`${task.id} is ${task.status}${by}, not in backlog; pick another task or pass --force`);
      }
      if (pyTruthy(task.assignee) && task.assignee !== who && !pyTruthy(force)) {
        throw new BoardError(`${task.id} is already assigned to ${pyStr(task.assignee)}; pick another task or pass --force`);
      }
      if (task.blocked && !pyTruthy(force)) {
        const openIds = task.blockers.filter((b) => b.status !== 'done' && b.status !== 'cancelled').map((b) => b.id);
        throw new BoardError(`${task.id} is blocked by ${openIds.join(', ')}; finish those first or pass --force`);
      }
      if (task.assignee !== who) {
        this.updateTask(task.id, { assignee: who });
        this._appendWorklog(this.getTask(task.id), author, `Assigned to \`${pyStr(who)}\`.`);
      }
      return this.moveTask(task.id, 'in-progress', { author, force: true });
    });
  }

  assign(ref, assignee, { author = 'aiboard', force = false } = {}) {
    const who = assignee === undefined ? null : assignee;
    return this.writeLock(() => {
      const task = this.getTask(ref);
      if (task.assignee === who) return task;
      if (pyTruthy(task.assignee) && pyTruthy(who) && task.assignee !== author && !pyTruthy(force)) {
        throw new BoardError(`${task.id} is already assigned to ${pyStr(task.assignee)}; pass --force to reassign`);
      }
      this.updateTask(task.id, { assignee: who });
      const name = pyTruthy(who) ? `\`${pyStr(who)}\`` : 'nobody';
      this._appendWorklog(this.getTask(task.id), author, `Assigned to ${name}.`);
      return this.getTask(task.id);
    });
  }

  log(ref, message, { author = 'aiboard' } = {}) {
    return this.writeLock(() => {
      const task = this.getTask(ref);
      this._appendWorklog(task, author, message);
      this._touch(task);
      return this.getTask(task.id);
    });
  }

  /** Append to the task's discussion (comments.md), separate from the worker's worklog. */
  comment(ref, message, { author = 'aiboard' } = {}) {
    return this.writeLock(() => {
      const task = this.getTask(ref);
      const path = pj(task.path, COMMENTS_FILE);
      let existing = exists(path) ? pyReadText(path) : '# Comments\n\n';
      if (!existing.endsWith('\n\n')) existing = rstripNewlines(existing) + '\n\n';
      pyWriteText(path, existing + formatWorklogEntry(nowIso(), author, message));
      this._touch(task);
      return this.getTask(task.id);
    });
  }

  _appendWorklog(task, author, message) {
    const path = pj(task.path, WORKLOG_FILE);
    let existing = exists(path) ? pyReadText(path) : '# Worklog\n\n';
    if (!existing.endsWith('\n\n')) existing = rstripNewlines(existing) + '\n\n';
    pyWriteText(path, existing + formatWorklogEntry(nowIso(), author, message));
  }

  _touch(task) {
    const meta = new Map(task.meta);
    meta.set('updated', nowIso());
    pyWriteText(pj(task.path, BRIEF_FILE), dumpFrontMatter(meta, task.body));
  }

  // --------------------------------------------------------------------------- sprints
  _loadSprint(sid, status, path) {
    const f = pj(path, SPRINT_FILE);
    const [meta, body] = exists(f) ? parseFrontMatter(pyReadText(f)) : [new Map(), ''];
    const title = pyOr(pyOr(metaGet(meta, 'title'), _titleFromBody(body)), pyPathName(path));
    return new Sprint({ id: sid, title: pyStr(title), status, path, meta, body });
  }

  listSprints({ status = null } = {}) {
    this._require();
    const wanted = pyTruthy(status) ? normalizeStatus(status) : null;
    const out = [];
    for (const [sid, st, path] of this._scan(this.sprintsDir, SPRINT_PREFIX)) {
      if (!pyTruthy(wanted) || st === wanted) out.push(this._loadSprint(sid, st, path));
    }
    return out.sort((a, b) => pyCompare(a.id, b.id));
  }

  getSprint(ref) {
    this._require();
    const [sid, status, path] = this._locate(this.sprintsDir, SPRINT_PREFIX, ref);
    return this._loadSprint(sid, status, path);
  }

  createSprint(title, { goal = '', body = '', status = 'backlog', start = null, end = null } = {}) {
    return this.writeLock(() => {
      this._require();
      const st = normalizeStatus(status);
      const sid = formatId(SPRINT_PREFIX, this._nextNumber(this.sprintsDir, SPRINT_PREFIX));
      const folder = pj(this.sprintsDir, st, `${sid}-${slugify(title)}`);
      mkdir(folder, { parents: true });
      const ts = nowIso();
      const meta = new Map([
        ['id', sid],
        ['title', title],
        ['goal', pyOr(goal, null)],
        ['start', start],
        ['end', end],
        ['tasks', []],
        ['created', ts],
        ['updated', ts],
      ]);
      let text = `# ${pyStr(title)}\n\n`;
      if (pyTruthy(goal)) text += `**Goal:** ${pyStr(goal)}\n\n`;
      text += pyStrip(body) ? pyStrip(body) + '\n\n' : '';
      text += '## Tasks\n\n_No tasks attached yet._\n';
      pyWriteText(pj(folder, SPRINT_FILE), dumpFrontMatter(meta, text));
      return this.getSprint(sid);
    });
  }

  moveSprint(ref, status) {
    return this.writeLock(() => {
      const sprint = this.getSprint(ref);
      const st = normalizeStatus(status);
      if (st === sprint.status) return sprint;
      const dest = pj(this.sprintsDir, st, pyPathName(sprint.path));
      if (exists(dest)) throw new BoardError(`destination already exists: ${dest}`);
      move(sprint.path, dest);
      const moved = this._loadSprint(sprint.id, st, dest);
      this._writeSprint(moved, moved.meta, moved.body);
      return this.getSprint(sprint.id);
    });
  }

  sprintAdd(sprintRef, taskRefs) {
    return this.writeLock(() => {
      const sprint = this.getSprint(sprintRef);
      for (const ref of pyList(taskRefs)) this.updateTask(ref, { sprint: sprint.id });
      return this.getSprint(sprint.id);
    });
  }

  sprintRemove(sprintRef, taskRefs) {
    return this.writeLock(() => {
      let sprint = this.getSprint(sprintRef);
      for (const ref of pyList(taskRefs)) {
        const task = this.getTask(ref);
        if (task.sprint === sprint.id) {
          this.updateTask(task.id, { sprint: null });
        } else {
          sprint = this.getSprint(sprint.id);
          this._sprintSetTasks(sprint, sprint.tasks.filter((t) => t !== task.id));
        }
      }
      return this.getSprint(sprint.id);
    });
  }

  _sprintSetTasks(sprint, taskIds) {
    const seen = [];
    for (const t of taskIds) if (!seen.includes(t)) seen.push(t);
    const meta = new Map(sprint.meta);
    meta.set('tasks', seen);
    this._writeSprint(sprint, meta, sprint.body);
  }

  _writeSprint(sprint, meta, body) {
    const m = new Map(meta);
    m.set('updated', nowIso());
    const text = this._renderSprintTaskList(pyOr(metaGet(m, 'tasks'), []), body);
    pyWriteText(pj(sprint.path, SPRINT_FILE), dumpFrontMatter(m, text));
  }

  /** Regenerate the human-readable "## Tasks" section of sprint.md. */
  _renderSprintTaskList(taskIds, body) {
    const lines = [];
    for (const tid of pyList(taskIds)) {
      try {
        const t = this.getTask(tid);
        const box = t.status === 'done' ? 'x' : t.status === 'cancelled' ? '-' : ' ';
        lines.push(`- [${box}] ${t.id} — ${t.title} (${t.status})`);
      } catch (e) {
        if (!(e instanceof NotFound)) throw e;
        lines.push(`- [ ] ${pyStr(tid)} — _missing_`);
      }
    }
    const section = '## Tasks\n\n' + (lines.length ? lines.join('\n') : '_No tasks attached yet._') + '\n';
    if (TASKS_SECTION.test(body)) return body.replace(TASKS_SECTION, () => section);
    return rstripNewlines(body) + '\n\n' + section;
  }

  /** Re-render the task list in sprint.md (e.g. after tasks changed status). */
  refreshSprint(ref) {
    return this.writeLock(() => {
      const sprint = this.getSprint(ref);
      this._writeSprint(sprint, sprint.meta, sprint.body);
      return this.getSprint(sprint.id);
    });
  }

  /**
   * `index`, when given, maps an id to the Task getTask would return (the first folder per id in scan
   * order); aiboard has no such parameter, T-021 adds it.
   */
  sprintProgress(sprint, index = null) {
    const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    const tasks = [];
    if (index === null) {
      for (const tid of sprint.tasks) {
        try {
          const t = this.getTask(tid);
          counts[t.status] += 1;
          tasks.push(t);
        } catch (e) {
          if (!(e instanceof NotFound)) throw e;
        }
      }
    } else {
      for (const tid of sprint.tasks) {
        const id = normalizeId(TASK_PREFIX, tid);
        if (id === null || !index.has(id)) continue;
        const t = index.get(id);
        counts[t.status] += 1;
        tasks.push(t);
      }
    }
    tasks.sort(_cmpRankKey);
    const total = tasks.length;
    const finished = counts.done + counts.cancelled;
    return {
      total,
      counts,
      percent: total ? pyRound((100 * counts.done) / total) : 0,
      remaining: total - finished,
      tasks,
    };
  }

  // --------------------------------------------------------------------------- check
  /**
   * Return a list of human-readable consistency problems. With `fix`, the repairable ones (stale
   * sprint task lists) are repaired and reported as fixed.
   */
  check({ fix = false } = {}) {
    this._require();
    const problems = [];
    const tasks = new Map(this.listTasks().map((t) => [t.id, t]));
    const sprints = new Map(this.listSprints().map((s) => [s.id, s]));
    const seenDirs = new Map();
    for (const [tid, , path] of this._scan(this.tasksDir, TASK_PREFIX)) {
      if (seenDirs.has(tid)) problems.push(`${tid} exists twice: ${seenDirs.get(tid)} and ${path}`);
      seenDirs.set(tid, path);
      if (!exists(pj(path, BRIEF_FILE))) problems.push(`${tid} has no ${BRIEF_FILE}`);
      if (!exists(pj(path, WORKLOG_FILE))) problems.push(`${tid} has no ${WORKLOG_FILE}`);
    }
    for (const t of tasks.values()) {
      const rawRank = metaGet(t.meta, 'rank');
      let rank = null;
      if (rawRank !== null) {
        try {
          rank = pyInt(pyStrip(pyStr(rawRank)));
        } catch (e) {
          if (!(e instanceof ValueError)) throw e;
          problems.push(`${t.id}: rank ${pyRepr(rawRank)} is not a whole number (it sorts by its id instead)`);
        }
      }
      // Not in aiboard: Task.rank is a JS number, so ranks worked out from this one are saved slightly wrong.
      if (rank !== null) {
        if (!Number.isSafeInteger(rank)) {
          problems.push(
            `${t.id}: rank ${pyRepr(rawRank)} cannot be stored exactly` +
              ` (it must be between -${Number.MAX_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER})`,
          );
        }
      } else if (!Number.isSafeInteger(t.rank)) {
        problems.push(`${t.id}: its id-based rank is too big to store exactly (largest is ${Number.MAX_SAFE_INTEGER})`);
      }
      if (pyTruthy(metaGet(t.meta, 'id')) && t.meta.get('id') !== t.id) {
        problems.push(`${t.id}: front matter id is ${pyRepr(t.meta.get('id'))}`);
      }
      for (const b of t.blockedBy) {
        if (b === t.id) problems.push(`${t.id} is blocked by itself`);
        else if (!tasks.has(b)) problems.push(`${t.id} is blocked by missing task ${b}`);
      }
      if (t.stale) {
        problems.push(
          `${t.id} is in progress but has had no worklog entry or comment since ${pyStr(pyOr(t.lastActivity, 'unknown'))}` +
            ` (stale after ${pyFormatG(this.staleAfterHours)}h; assignee ${pyStr(pyOr(t.assignee, 'nobody'))})`,
        );
      }
      if (t.status === 'in-progress' && t.blocked) {
        const openIds = t.blockers.filter((b) => b.status !== 'done' && b.status !== 'cancelled').map((b) => b.id);
        problems.push(`${t.id} is in progress but blocked by ${openIds.join(', ')}`);
      }
      if (pyTruthy(t.sprint)) {
        if (!pyIn(sprints, t.sprint)) problems.push(`${t.id} references missing sprint ${pyStr(t.sprint)}`);
        else if (!sprints.get(t.sprint).tasks.includes(t.id)) {
          problems.push(`${t.id} says it is in ${t.sprint}, but ${t.sprint} does not list it`);
        }
      }
    }
    const graph = new Map([...tasks.values()].map((t) => [t.id, t.blockedBy.filter((b) => tasks.has(b))]));
    for (const cycle of _findCycles(graph)) problems.push('dependency cycle: ' + cycle.join(' -> '));
    for (const s of sprints.values()) {
      if (!exists(pj(s.path, SPRINT_FILE))) problems.push(`${s.id} has no ${SPRINT_FILE}`);
      for (const tid of s.tasks) {
        if (!pyIn(tasks, tid)) problems.push(`${s.id} lists missing task ${pyStr(tid)}`);
        else if (tasks.get(tid).sprint !== s.id) {
          problems.push(`${s.id} lists ${tid}, but ${tid} says sprint=${pyStr(tasks.get(tid).sprint)}`);
        }
      }
      if (s.status === 'done') {
        const openTasks = s.tasks.filter((tid) => pyIn(tasks, tid) && ['backlog', 'in-progress'].includes(tasks.get(tid).status));
        if (openTasks.length) problems.push(`${s.id} is done but still has open tasks: ${openTasks.join(', ')}`);
      }
      const fresh = this._renderSprintTaskList(s.tasks, s.body);
      if (pyStrip(fresh) !== pyStrip(s.body)) {
        if (pyTruthy(fix)) {
          this.refreshSprint(s.id);
          problems.push(`${s.id}: task list in ${SPRINT_FILE} was stale (fixed)`);
        } else {
          problems.push(`${s.id}: task list in ${SPRINT_FILE} is stale; run \`aiboard sprint refresh ${s.id}\` or \`aiboard check --fix\``);
        }
      }
    }
    return problems;
  }

  // --------------------------------------------------------------------------- summary
  /** Everything the web board needs, as plain JSON-able objects. */
  snapshot() {
    // getTask per sprint member re-scanned the whole tree, making the snapshot quadratic (aiboard T-021).
    const byId = new Map();
    const tasks = this._listTasks({}, byId);
    const sprints = [];
    for (const s of this.listSprints()) {
      const { tasks: _tasks, ...progress } = this.sprintProgress(s, byId);
      const d = s.toDict();
      d.progress = progress;
      sprints.push(d);
    }
    return {
      root: this.root,
      name: this.name,
      statuses: STATUSES,
      tasks: tasks.map((t) => t.toDict()),
      sprints,
      generated: nowIso(),
    };
  }
}

/** Each elementary cycle once, as a list of ids ending where it started. */
function _findCycles(graph) {
  const cycles = [];
  const seenKeys = new Set();
  const state = new Map();
  const stack = [];
  const visit = (node) => {
    state.set(node, 1);
    stack.push(node);
    for (const nxt of graph.get(node) ?? []) {
      if ((state.get(nxt) ?? 0) === 0) visit(nxt);
      else if (state.get(nxt) === 1) {
        const cyc = [...stack.slice(stack.indexOf(nxt)), nxt];
        const key = JSON.stringify([...new Set(cyc)].sort());
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          cycles.push(cyc);
        }
      }
    }
    stack.pop();
    state.set(node, 2);
  };
  for (const n of [...graph.keys()].sort(pyCompare)) {
    if ((state.get(n) ?? 0) === 0) visit(n);
  }
  return cycles;
}

// Python's (rank, id) tuple order.
function _cmpRankKey(a, b) {
  const [ra, rb] = [a.rank, b.rank];
  if (ra !== rb) return ra < rb ? -1 : 1;
  return pyCompare(a.id, b.id);
}

function _priority(value) {
  try {
    return normalizePriority(pyStr(value));
  } catch (e) {
    if (!(e instanceof ValueError)) throw e;
    throw new BoardError(`priority must be one of ${PRIORITIES.join(', ')}`);
  }
}

function _titleFromBody(body) {
  const m = TITLE_LINE.exec(body);
  return m ? m[1] : null;
}
