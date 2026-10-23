// The board's data model and Markdown front-matter handling: a faithful port of aiboard/model.py at
// aiboard a1592dc. Front matter is a Map, so key order and duplicate keys behave as Python's dict.
import {
  AttributeError,
  ValueError,
  PY_WS_CLASS,
  PY_NON_WS_CLASS,
  metaGet,
  pyAsciiDigits,
  pyInt,
  pyList,
  pyLstrip,
  pyMax,
  pyOr,
  pyPathName,
  pyPosixPath,
  pyRepr,
  pySplitlines,
  pyStr,
  pyStrip,
  pyTruthy,
  pyTypeName,
} from './python-compat.mjs';

export { ValueError };

export const STATUSES = ['backlog', 'in-progress', 'done', 'cancelled'];
// Ascending. "critical" is for drop-everything work, e.g. production is broken.
export const PRIORITIES = ['low', 'medium', 'high', 'critical'];
export const TASK_PREFIX = 'T';
export const SPRINT_PREFIX = 'S';
export const BRIEF_FILE = 'brief.md';
export const WORKLOG_FILE = 'worklog.md';
export const COMMENTS_FILE = 'comments.md';
export const DEFAULT_STALE_HOURS = 24;
// Gap between neighbouring ranks: a move takes the midpoint, so it rewrites one file.
export const RANK_STEP = 1000;
export const SPRINT_FILE = 'sprint.md';

export const STATUS_ALIASES = new Map([
  ['todo', 'backlog'],
  ['open', 'backlog'],
  ['in_progress', 'in-progress'],
  ['inprogress', 'in-progress'],
  ['in progress', 'in-progress'],
  ['wip', 'in-progress'],
  ['doing', 'in-progress'],
  ['started', 'in-progress'],
  ['closed', 'done'],
  ['complete', 'done'],
  ['completed', 'done'],
  ['canceled', 'cancelled'],
  ['cancel', 'cancelled'],
]);

export function nowIso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// CPython _strptime's patterns for "%Y-%m-%dT%H:%M:%SZ", compiled case-insensitive with Unicode \d.
const D = '\\p{Nd}';
const ISO_PATTERN = new RegExp(
  `^(${D}${D}${D}${D})-(1[0-2]|0[1-9]|[1-9])-(3[01]|[12]${D}|0[1-9]|[1-9]| [1-9])` +
    `T(2[0-3]|[0-1]${D}|${D}):([0-5]${D}|${D}):(6[0-1]|[0-5]${D}|${D})Z`,
  'iu',
);

const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const daysIn = (y, m) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

export function parseIso(value) {
  if (!pyTruthy(value)) return null;
  const s = pyStr(value);
  const m = ISO_PATTERN.exec(s);
  if (!m || m[0].length !== s.length) return null;
  const [y, mo, d, h, mi, sec] = m.slice(1).map((x) => Number(pyAsciiDigits(pyStrip(x))));
  if (y < 1 || d > daysIn(y, mo) || sec > 59) return null;
  const date = new Date(0);
  date.setUTCFullYear(y, mo - 1, d);
  date.setUTCHours(h, mi, sec, 0);
  return date;
}

export const PRIORITY_ALIASES = new Map([['urgent', 'critical']]);

/** Lower-case and resolve aliases, without validating (`urgent` -> `critical`). */
export function canonicalPriority(value) {
  const key = pyStrip(value).toLowerCase();
  return PRIORITY_ALIASES.has(key) ? PRIORITY_ALIASES.get(key) : key;
}

export function normalizePriority(value) {
  const key = canonicalPriority(value);
  if (!PRIORITIES.includes(key)) {
    throw new ValueError(`unknown priority ${pyRepr(value)}; expected one of ${PRIORITIES.join(', ')}`);
  }
  return key;
}

export function normalizeStatus(value) {
  let key = pyStrip(value).toLowerCase();
  if (STATUS_ALIASES.has(key)) key = STATUS_ALIASES.get(key);
  if (!STATUSES.includes(key)) {
    throw new ValueError(`unknown status ${pyRepr(value)}; expected one of ${STATUSES.join(', ')}`);
  }
  return key;
}

export function slugify(text, maxLen = 48) {
  let slug = text.toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/^-+|-+$/g, '');
  slug = slug.slice(0, maxLen).replace(/-+$/, '');
  return slug || 'untitled';
}

// Formats the digits, not a float, so an id beyond 2^53 keeps its precision; sign as Python's 03d.
export function formatId(prefix, number) {
  if (typeof number === 'number' && !Number.isInteger(number)) {
    throw new ValueError("Unknown format code 'd' for object of type 'float'");
  }
  const n = BigInt(number);
  const digits = String(n < 0n ? -n : n);
  return n < 0n ? `${prefix}--${digits.padStart(2, '0')}` : `${prefix}-${digits.padStart(3, '0')}`;
}

/** Turn `T-1`, `t-001`, `1` or `T-001-some-slug` into `T-001`. */
export function normalizeId(prefix, ref) {
  // Python's ref.strip(): a list such as [1] must fail, not be read as id 1.
  if (typeof ref !== 'string') throw new AttributeError(`'${pyTypeName(ref)}' object has no attribute 'strip'`);
  const r = pyStrip(ref);
  // [^\n] because Python's "." matches \r and \u2028, which JS's "." does not.
  const m = new RegExp(`^(?:${prefix}-?)?(\\p{Nd}+)(?:-[^\\n]*)?$`, 'iu').exec(r);
  if (!m) return null;
  return formatId(prefix, BigInt(pyAsciiDigits(m[1])));
}

// --------------------------------------------------------------------------
// Front matter
// --------------------------------------------------------------------------

const CANONICAL_INT = /^-?[0-9]+$/;

function parseScalar(raw) {
  raw = pyStrip(raw);
  if (raw === '' || raw === 'null' || raw === '~' || raw === 'None') return null;
  if (raw === 'true' || raw === 'True') return true;
  if (raw === 'false' || raw === 'False') return false;
  if (raw.length >= 2 && raw[0] === raw[raw.length - 1] && (raw[0] === '"' || raw[0] === "'")) {
    let inner = raw.slice(1, -1);
    if (raw[0] === '"') inner = inner.replaceAll('\\"', '"').replaceAll('\\\\', '\\');
    return inner;
  }
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = pyStrip(raw.slice(1, -1));
    if (!inner) return [];
    return inner.split(',').map(parseScalar);
  }
  // Only canonical integers become ints: "0013" stays a string, so a zero-padded id survives.
  if (CANONICAL_INT.test(raw) && String(BigInt(raw)) === raw) {
    const n = BigInt(raw);
    return n >= BigInt(Number.MIN_SAFE_INTEGER) && n <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(n) : n;
  }
  return raw;
}

/** Split a Markdown document into [metadata Map, body]. */
export function parseFrontMatter(text) {
  if (!text.startsWith('---')) return [new Map(), text];
  const lines = pySplitlines(text);
  if (pyStrip(lines[0]) !== '---') return [new Map(), text];
  let end = null;
  for (let i = 1; i < lines.length; i++) {
    if (pyStrip(lines[i]) === '---') {
      end = i;
      break;
    }
  }
  if (end === null) return [new Map(), text];
  const meta = new Map();
  let currentListKey = null;
  for (const line of lines.slice(1, end)) {
    if (!pyStrip(line) || pyLstrip(line).startsWith('#')) continue;
    const stripped = pyStrip(line);
    if (stripped.startsWith('- ') && currentListKey !== null) {
      if (!Array.isArray(meta.get(currentListKey))) meta.set(currentListKey, []);
      meta.get(currentListKey).push(parseScalar(stripped.slice(2)));
      continue;
    }
    if (stripped === '-' && currentListKey !== null) continue;
    const colon = stripped.indexOf(':');
    if (colon === -1) continue;
    const key = pyStrip(stripped.slice(0, colon));
    const value = stripped.slice(colon + 1);
    if (pyStrip(value) === '') {
      // Either a null scalar or the start of a block list; decided by the next line.
      meta.set(key, null);
      currentListKey = key;
    } else {
      meta.set(key, parseScalar(value));
      currentListKey = null;
    }
  }
  let body = lines.slice(end + 1).join('\n');
  if (body.startsWith('\n')) body = body.slice(1);
  return [meta, body];
}

function dumpScalar(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'bigint' || (typeof value === 'number' && Number.isInteger(value))) return String(value);
  const s = pyStr(value);
  if (
    s === '' ||
    s !== pyStrip(s) ||
    [...':#[]{}'].some((c) => s.includes(c)) ||
    ['true', 'false', 'null'].includes(s.toLowerCase()) ||
    parseScalar(s) !== s
  ) {
    return '"' + s.replaceAll('\\', '\\\\').replaceAll('"', '\\"') + '"';
  }
  return s;
}

export function dumpFrontMatter(meta, body) {
  const out = ['---'];
  for (const [key, value] of meta) {
    if (Array.isArray(value)) {
      if (!value.length) {
        out.push(`${pyStr(key)}: []`);
      } else {
        out.push(`${pyStr(key)}:`);
        for (const v of value) out.push(`  - ${dumpScalar(v)}`);
      }
    } else {
      out.push(`${pyStr(key)}: ${dumpScalar(value)}`);
    }
  }
  out.push('---');
  out.push('');
  // body.rstrip('\n') as a loop: /\n+$/ rescans every interior newline run, quadratic on long ones.
  let end = body.length;
  while (end > 0 && body[end - 1] === '\n') end -= 1;
  out.push(body.slice(0, end));
  out.push('');
  return out.join('\n');
}

// --------------------------------------------------------------------------
// Entities
// --------------------------------------------------------------------------

export class WorklogEntry {
  constructor({ timestamp, author, text }) {
    this.timestamp = timestamp;
    this.author = author;
    this.text = text;
  }

  toDict() {
    return { timestamp: this.timestamp, author: this.author, text: this.text };
  }
}

export const WORKLOG_HEADING = new RegExp(
  `^##${PY_WS_CLASS}+(${PY_NON_WS_CLASS}+)${PY_WS_CLASS}+[—-]+${PY_WS_CLASS}+([^\\n]+?)${PY_WS_CLASS}*$`,
  'u',
);

export function parseWorklog(text) {
  const entries = [];
  let current = null;
  let buf = [];
  for (const line of pySplitlines(text)) {
    const m = WORKLOG_HEADING.exec(line);
    if (m) {
      if (current !== null) {
        current.text = pyStrip(buf.join('\n'));
        entries.push(current);
      }
      current = new WorklogEntry({ timestamp: m[1], author: m[2], text: '' });
      buf = [];
    } else if (current !== null) {
      buf.push(line);
    }
  }
  if (current !== null) {
    current.text = pyStrip(buf.join('\n'));
    entries.push(current);
  }
  return entries;
}

export function formatWorklogEntry(timestamp, author, text) {
  return `## ${pyStr(timestamp)} — ${pyStr(author)}\n\n${pyStrip(text)}\n\n`;
}

export class Task {
  constructor({ id, title, status, path, meta = new Map(), body = '', worklog = [], blockers = [], comments = [], stale = false }) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.path = pyPosixPath(path);
    this.meta = meta;
    this.body = body;
    this.worklog = worklog;
    this.blockers = blockers;
    this.comments = comments;
    this.stale = stale;
  }

  get lastCommentBy() {
    return this.comments.length ? this.comments[this.comments.length - 1].author : null;
  }

  /** The latest comment came from someone other than the assignee. */
  get needsReply() {
    return this.comments.length > 0 && this.assignee !== null && this.comments[this.comments.length - 1].author !== this.assignee;
  }

  /** Timestamp of the latest worklog entry or comment, else the updated field. */
  get lastActivity() {
    const stamps = [...this.worklog.map((e) => e.timestamp), ...this.comments.map((e) => e.timestamp)];
    if (pyTruthy(metaGet(this.meta, 'updated'))) stamps.push(pyStr(this.meta.get('updated')));
    return stamps.length ? pyMax(stamps) : null;
  }

  get sprint() {
    return pyOr(metaGet(this.meta, 'sprint'), null);
  }

  /** Queue position, lower is nearer the top; with no stored rank, id number x RANK_STEP. */
  get rank() {
    const raw = metaGet(this.meta, 'rank');
    if (raw !== null) {
      try {
        return pyInt(pyStrip(pyStr(raw)));
      } catch (e) {
        if (!(e instanceof ValueError)) throw e;
        // reported by `aiboard check`; fall back to the id-based default
      }
    }
    const part = this.id.split('-')[1];
    if (part === undefined) throw new RangeError('list index out of range');
    return pyInt(part) * RANK_STEP;
  }

  get hasStoredRank() {
    return metaGet(this.meta, 'rank') !== null;
  }

  get priority() {
    // Resolve aliases here too, so a hand-edited "priority: urgent" still reads as critical.
    return canonicalPriority(pyStr(pyOr(metaGet(this.meta, 'priority'), 'medium')));
  }

  get assignee() {
    return pyOr(metaGet(this.meta, 'assignee'), null);
  }

  get folder() {
    return pyPathName(this.path);
  }

  get blockedBy() {
    let raw = pyOr(metaGet(this.meta, 'blocked_by'), []);
    if (typeof raw === 'string') raw = [raw];
    const out = [];
    for (const ref of pyList(raw)) {
      const tid = normalizeId(TASK_PREFIX, pyStr(ref));
      if (tid && !out.includes(tid)) out.push(tid);
    }
    return out;
  }

  /** True while any blocker is still open. `blockers` is filled in by the store. */
  get blocked() {
    return this.blockers.some((b) => b.status !== 'done' && b.status !== 'cancelled');
  }

  toDict(includeBody = false) {
    const d = {
      id: this.id,
      title: this.title,
      status: this.status,
      sprint: this.sprint,
      priority: this.priority,
      rank: this.rank,
      assignee: this.assignee,
      labels: pyList(pyOr(metaGet(this.meta, 'labels'), [])),
      blocked_by: this.blockedBy,
      blocked: this.blocked,
      blockers: [...this.blockers],
      last_activity: this.lastActivity,
      stale: this.stale,
      comments_count: this.comments.length,
      last_comment_by: this.lastCommentBy,
      needs_reply: this.needsReply,
      created: metaGet(this.meta, 'created'),
      updated: metaGet(this.meta, 'updated'),
      folder: this.folder,
      path: this.path,
    };
    if (includeBody) {
      d.brief = this.body;
      d.worklog = this.worklog.map((e) => e.toDict());
      d.comments = this.comments.map((e) => e.toDict());
    }
    return d;
  }
}

export class Sprint {
  constructor({ id, title, status, path, meta = new Map(), body = '' }) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.path = pyPosixPath(path);
    this.meta = meta;
    this.body = body;
  }

  get tasks() {
    return pyList(pyOr(metaGet(this.meta, 'tasks'), []));
  }

  get folder() {
    return pyPathName(this.path);
  }

  toDict(includeBody = false) {
    const d = {
      id: this.id,
      title: this.title,
      status: this.status,
      goal: metaGet(this.meta, 'goal'),
      start: metaGet(this.meta, 'start'),
      end: metaGet(this.meta, 'end'),
      tasks: this.tasks,
      created: metaGet(this.meta, 'created'),
      updated: metaGet(this.meta, 'updated'),
      folder: this.folder,
      path: this.path,
    };
    if (includeBody) d.description = this.body;
    return d;
  }
}
