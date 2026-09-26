#!/usr/bin/env node
// fkit's read-only board reader — task 0411, Track 1 ("A now") of ADR-051.
//
// WHAT THIS IS. A local HTTP server that serves aiboard's UNMODIFIED web UI over fkit's UNMODIFIED
// ai-agents/ tree. fkit's tree stays the single store; aiboard reads it and renders it. It is the
// interim that runs NOW, while B — aiboard as the single store — sits behind ADR-051's gate.
//
// ⛔ READ-ONLY. There is no write path, in any mode, behind any flag. Every method that is not GET is
// refused. Nothing here opens a file for writing, renames anything, or shells out to a mover.
//
// ⛔ ONE GRAMMAR FOR SPRINT STATUS. conventions/sprint-status-vocabulary.md, under "The carrier — the
// line-3 banner": "The recognizer has exactly one implementation, in `dashboard.sh`. Do not re-state
// the regex anywhere else." So this file contains NO banner regex and none of the banner's markers.
// Open boards get identity AND status from ONE `dashboard.sh select-active` call; archived boards take
// their status from LOCATION, which the same convention names as the second carrier under "Location —
// the second carrier". test/board-reader.test.js greps this WHOLE file — comments included — and goes
// red if a banner marker, the banner's blockquoted-heading prefix, or the in-progress status literal
// ever appears in it. Comments included ON PURPOSE: a guard that must first parse comments out can be
// fooled into a false pass, and nothing here needs to quote those tokens to explain itself.
//
// ⚠️ TASK status is a DIFFERENT vocabulary and IS read here, deliberately. The convention's "Tell a
// task status from a sprint status by POSITION" rule is what makes that legitimate: a task status is
// the `## Status` field of a brief, a sprint status is a blockquoted H2 on line 3 of a board. Reading
// the former is not a second implementation of the latter. Only two task markers are ever matched
// (`🔄` and `🚧`); the rest of a task's status comes from which folder the task's directory is in,
// because the folder is the key (ADR-029) and the movers move folders.
//
// PROVENANCE. The throwaway spike at
//   ai-agents/tasks/done/0404-…/assets/external-expert-spike/fkit_board_spike.py
// is READ, never extended: its endpoint set and its `read_only: true` flag survive as DESIGN, and the
// file itself does not. Its hard-coded absolute paths, its second copy of the banner grammar and its
// `priority: "medium"` flattening are all gone. See this task's plan.md §2.
//
// ANOTHER PROJECT'S TREE (task 0412). `--root <path>` points the reader at another fkit-using
// project's ai-agents/. The rule: TOOLS come from fkit's own checkout, DATA comes from `--root`. So
// `dashboard.sh` and aiboard's sibling default are always found next to THIS file, and only the
// ai-agents/ being read moves. The target's own copy of `dashboard.sh` is never run.

import { createServer } from 'node:http';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const DEFAULT_PORT = 8585;

// aiboard's own column vocabulary. NOT fkit's task vocabulary — the mapping between the two is
// mapTaskStatus() below, and it invents no value: `🚧 Blocked` rides aiboard's NATIVE `blocked` chip
// rather than becoming a fifth column, and `➡️ Moved` never reaches here at all (it is a row
// disposition, never a brief status — measured zero across all 411 briefs).
const COLUMNS = ['backlog', 'in-progress', 'done', 'cancelled'];

const TASK_BOARDS = ['backlog', 'done', 'cancelled'];
const TASK_DIR_RE = /^(\d{4})-/;
const TASK_ID_RE = /^\d{4}$/;

// The brief fields this reader consumes: the heading line, then the first NON-BLANK line under it.
// Briefs are written both with and without a blank line between the two, so `\n+` spans either.
//
// ⚠️ The `(?!## )` is what stops an EMPTY field from EATING the next heading. Without it, `## Priority`
// + blank + `## Status` matched with `## Status` as Priority's VALUE: the value was then discarded as
// bogus, but the regex had already CONSUMED the heading, so `## Status` was never matched as a field
// and the task's real status vanished. The lookahead makes the match fail at that position instead,
// so the scan resumes and finds `## Status`. Verified a no-op across all 411 live briefs.
const FIELD_RE = /^## (ID|Sprint|Priority|Status|Owner)[^\S\n]*\n+(?!## )([^\n]+)/gm;

// ⚠️ The exact marker `dashboard.sh` stamps on `select-active` output. Its own contract note says a
// consumer reading an unknown shape must REFUSE rather than guess, so an unrecognised marker is a
// startup failure here, not a silent degrade to `unresolved`.
const DASHBOARD_MARKER = '⟦fkit-dashboard v2⟧';

// ⚠️ This server is SINGLE-THREADED and `spawnSync` BLOCKS it. With no timeout, a hung `dashboard.sh`
// wedges startup — or every later poll — forever, with no error to read. 30 s is ~300× the measured
// 92–110 ms, so it cannot fire on a healthy machine; when it does fire, `spawnSync` sets `r.error`,
// which the two call sites already treat as "could not be run": a problem on /api/check plus
// `unresolved` boards mid-run, and a refusal to start at startup. The guard adds no new behaviour —
// it routes a hang into the loud failure path that was already there.
const DASHBOARD_TIMEOUT_MS = 30000;

// ── Path discovery — nothing is hard-coded to a machine ──────────────────────────────────────────

// fkit's root: walk up from this file until a directory holding `ai-agents/` is found.
export function findRoot(from = dirname(fileURLToPath(import.meta.url))) {
  let dir = resolve(from);
  for (;;) {
    if (existsSync(join(dir, 'ai-agents', 'tasks')) && existsSync(join(dir, 'ai-agents', 'sprints'))) return dir;
    const up = dirname(dir);
    if (up === dir) throw new Error(`fkit-board: no ai-agents/ tree found above ${from}`);
    dir = up;
  }
}

// `dashboard.sh` lives in the CANONICAL `claude/` tree. ⚠️ The `.claude/` copy is gitignored and
// re-created by fkit-claude-init.sh, so it is absent on the clean checkout this reader must start on;
// it is accepted as a fallback and never as the first choice.
export function findDashboard(root) {
  for (const rel of [join('claude', 'skills', 'fkit-status', 'dashboard.sh'),
                     join('.claude', 'skills', 'fkit-status', 'dashboard.sh')]) {
    const p = join(root, rel);
    if (existsSync(p)) return p;
  }
  throw new Error('fkit-board: dashboard.sh not found under claude/skills/fkit-status/ or '
    + '.claude/skills/fkit-status/. Sprint status has exactly one recognizer and this reader will not '
    + 'guess at it.');
}

// aiboard's web UI. ⛔ NOT vendored into fkit — a copy would fork aiboard's UI, drift the moment the
// Node port lands, and invert the one-way dependency the owner set (fkit adapts to aiboard).
//
// ⚠️ An EXPLICIT path that does not exist is an ERROR, never a fall-through to the default. Serving
// some other file because the one the owner named was missing is exactly the silent wrong answer the
// plan forbids. Only the sibling default is soft.
export function resolveAiboard({ flag, env, root }) {
  // ⚠️ isFile, not exists. `existsSync` is TRUE for a DIRECTORY, so `--aiboard /some/dir` resolved,
  // the server started, and `/` then died with an EISDIR 500 — instead of the non-zero exit naming
  // all three ways that this function promises. What is being resolved is a FILE to serve.
  const isFile = (p) => { try { return statSync(p).isFile(); } catch { return false; } };
  const fail = (why) => {
    const e = new Error(
      `fkit-board: ${why}\n`
      + 'Point it at aiboard\'s web/index.html in one of these three ways:\n'
      + '  1. --aiboard <path>            (highest precedence)\n'
      + '  2. FKIT_AIBOARD=<path>         (environment)\n'
      + `  3. the sibling default          ${join(root, '..', 'aiboard', 'aiboard', 'web', 'index.html')}`);
    e.code = 'AIBOARD_UNRESOLVED';
    return e;
  };
  if (flag) {
    if (!isFile(flag)) throw fail(`--aiboard ${flag} is not a readable file.`);
    return { path: resolve(flag), how: '--aiboard' };
  }
  if (env) {
    if (!isFile(env)) throw fail(`FKIT_AIBOARD=${env} is not a readable file.`);
    return { path: resolve(env), how: 'FKIT_AIBOARD' };
  }
  const fallback = resolve(join(root, '..', 'aiboard', 'aiboard', 'web', 'index.html'));
  if (isFile(fallback)) return { path: fallback, how: 'sibling default' };
  throw fail('aiboard\'s web UI was not found.');
}

// The tree to READ. No flag → `home`, fkit's own root, exactly as before `--root` existed.
//
// ⚠️ The same rule as resolveAiboard: an EXPLICIT path that does not resolve is an ERROR, never a
// fall-through to fkit's own tree — serving one project's board under another's name is the silent
// wrong answer. isDirectory, not exists: a FILE named like the project must not pass. Every missing
// piece is named in one message, so a half-built tree is not fixed one error at a time.
export function resolveRoot({ flag, home }) {
  if (flag === undefined) return { path: home, how: 'default' };
  const kind = (p) => {
    try { return statSync(p).isDirectory() ? 'dir' : 'other'; } catch { return 'missing'; }
  };
  const missing = [];
  if (flag === '') {
    missing.push('a path (it was given an empty string)');
  } else if (kind(flag) === 'missing') {
    missing.push('the directory itself (no such path)');
  } else if (kind(flag) === 'other') {
    missing.push('the directory itself (the path is not a directory)');
  } else {
    for (const sub of ['tasks', 'sprints']) {
      if (kind(join(flag, 'ai-agents', sub)) !== 'dir') missing.push(`ai-agents/${sub}/`);
    }
  }
  // ⚠️ A directory that stats as one but cannot be LISTED is not a tree to read either: further down,
  // existsSync reads it as absent (an empty board, served silently) or readdirSync throws (a crash, or
  // a 500 per poll). So every directory the reader walks is listed once here, and refused by name.
  const unreadable = [];
  if (!missing.length) {
    const probe = (rel, children) => {
      let names;
      try { names = readdirSync(join(flag, rel)); } catch (err) {
        unreadable.push(`${rel}/ (${err.code})`);
        return;
      }
      for (const c of children) if (names.includes(c)) probe(`${rel}/${c}`, []);
    };
    probe('ai-agents/tasks', TASK_BOARDS);
    probe('ai-agents/sprints', ['done', 'cancelled']);
  }
  if (missing.length || unreadable.length) {
    const e = new Error(
      `fkit-board: --root ${JSON.stringify(flag)} is not a readable fkit project tree.\n`
      + (missing.length ? `  missing: ${missing.join(', ')}\n` : '')
      + (unreadable.length ? `  unreadable: ${unreadable.join(', ')}\n` : '')
      + 'It must be a directory holding both ai-agents/tasks/ and ai-agents/sprints/. '
      + 'fkit-board does not fall back to its own tree.');
    e.code = 'ROOT_UNRESOLVED';
    throw e;
  }
  return { path: resolve(flag), how: '--root' };
}

// ── Reading fkit's tree ──────────────────────────────────────────────────────────────────────────

function fields(text) {
  const out = {};
  for (const m of text.matchAll(FIELD_RE)) {
    const value = m[2].trim();
    // ⚠️ An EMPTY field followed by the next heading would otherwise capture that heading as its
    // value. First occurrence wins, matching the brief template's one-field-once shape.
    if (value === '' || value.startsWith('## ') || out[m[1]] !== undefined) continue;
    out[m[1]] = value;
  }
  return out;
}

// A board id usable as aiboard's `sprint` key. `Sprint 11` → `S-011`; `Backlog` → `BACKLOG`.
// ⚠️ A non-numeric sprint suffix (`Sprint 4c`) passes through UNPADDED rather than being coerced —
// `Sprint 4` and `Sprint 4c` are different sprints and must not collide.
export function boardId(identity) {
  if (!identity) return null;
  if (/^Backlog\b/.test(identity)) return 'BACKLOG';
  const m = /^Sprint\s+(\S+)/.exec(identity);
  if (!m) return null;
  return /^\d+$/.test(m[1]) ? `S-${m[1].padStart(3, '0')}` : `S-${m[1]}`;
}

// ⚠️ `plan-sprint-N.md` is an older board-naming convention, and dashboard.sh's file-name rung accepts
// exactly that one prefix (ADR-040 §3) — so an ARCHIVED `plan-sprint-4.md` keeps the `S-004` it had
// while open, when its H1 title and file name agree (an open board's id comes from its H1 first), and
// its tasks stay attached (task 0415). `plan-` is stripped only before `sprint-`.
// ⛔ The H1 is deliberately NOT read here: identity has one grammar, in dashboard.sh (ADR-041 §5).
function boardIdFromFile(file) {
  const stem = basename(file, '.md');
  if (stem === 'backlog') return 'BACKLOG';
  return boardId(stem.replace(/^(?:plan-)?sprint-/, 'Sprint ')) || `S-${stem}`;
}

// fkit's six-value task vocabulary → aiboard's four columns + its native `blocked` chip.
// ⛔ No value is invented. The FOLDER is authoritative (the movers move folders, ADR-029), with the
// single exception that an in-progress brief still sitting in backlog/ shows in-progress.
function mapTaskStatus(board, statusField) {
  if (board === 'backlog' && statusField.startsWith('🔄')) return 'in-progress';
  return board;
}

function listTaskDirs(root) {
  const out = [];
  for (const board of TASK_BOARDS) {
    const dir = join(root, 'ai-agents', 'tasks', board);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).sort()) {
      const m = TASK_DIR_RE.exec(name);
      if (!m) continue;
      const path = join(dir, name);
      const brief = join(path, 'brief.md');
      let mtimeMs;
      try {
        if (!statSync(path).isDirectory()) continue;
        mtimeMs = statSync(brief).mtimeMs;
      } catch { continue; }
      out.push({ id: m[1], board, name, path, brief, mtimeMs });
    }
  }
  return out;
}

function listBoardFiles(root) {
  const sprints = join(root, 'ai-agents', 'sprints');
  const out = [];
  const scan = (dir, location) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir).sort()) {
      if (!name.endsWith('.md')) continue;
      const path = join(dir, name);
      let mtimeMs;
      try {
        if (!statSync(path).isFile()) continue;
        mtimeMs = statSync(path).mtimeMs;
      } catch { continue; }
      out.push({ name, path, location, mtimeMs });
    }
  };
  scan(sprints, 'open');
  scan(join(sprints, 'done'), 'done');
  scan(join(sprints, 'cancelled'), 'cancelled');
  return out;
}

function readTask(entry) {
  const text = readFileSync(entry.brief, 'utf8');
  const f = fields(text);
  const h1 = /^# (.+)$/m.exec(text);
  const statusField = f.Status || '';
  const blocked = statusField.startsWith('🚧');
  const labels = [];
  if (statusField.includes('agent-closed')) labels.push('agent-closed');
  if (blocked) labels.push('blocked');
  for (const extra of ['plan.md', 'review.md', 'worklog.md']) {
    if (existsSync(join(entry.path, extra))) labels.push(extra.slice(0, -3));
  }
  return {
    // ⚠️ The id is the FOLDER's 4-digit key and always a JSON STRING. aiboard's T-023 (all-digit
    // front-matter coerced to an int, `0013` → `13`) fires on aiboard's WRITE path, which this reader
    // never reaches — but the id must still survive the read path intact, so it is never Number()'d.
    id: entry.id,
    title: h1 ? h1[1].trim() : entry.name,
    status: mapTaskStatus(entry.board, statusField),
    sprint: boardId(f.Sprint),
    // ⛔ The board's REAL priority, not a flattened `medium`. `—` where a brief states none — that is
    // aiboard's own glyph for absence, and it is not one of fkit's status values.
    priority: f.Priority || '—',
    assignee: f.Owner || null,
    labels,
    blocked,
    blocked_by: [],
    blockers: [],
    // ⛔ Briefs carry no timestamps. A file mtime is a DIFFERENT claim and is not dressed up as one.
    created: null,
    updated: null,
    last_activity: null,
    stale: false,
    // ⛔ fkit has no comment store.
    comments_count: 0,
    last_comment_by: null,
    needs_reply: false,
    folder: entry.name,
    path: entry.path,
  };
}

// ⚠️ ONE `select-active` call per snapshot covers EVERY open board. The per-board alternative —
// `status <board>`, one call each — was measured at ~240 ms for ten boards against a 3-second poll.
//
// ⚠️ MEASURED FROM HERE, which is the only figure that matters: this one call costs **92–110 ms** when
// spawned from inside Node, against 60–70 ms for the same command under `/usr/bin/time -p`. The gap is
// fork/exec overhead out of a larger process. It is the DOMINANT cost of a full snapshot (reading all
// 411 briefs is ~73 ms), which is what makes the mtime cache below worth its complexity.
//
// ⛔ Parsed BY KEY, never by position — the convention's "Parse by key, never by position. Field order
// is fixed so the output is diffable; it is not a licence to read field 3 positionally."
//
// ⚠️ spawnSync, so the exit code is read DIRECTLY off `status` and never through a pipe. Exit 3
// ("no sprint is eligible") is an ANSWER, not a failure: the candidate records are still parsed.
function selectActive(root, dashboard) {
  const r = spawnSync('bash', [dashboard, 'select-active', join(root, 'ai-agents', 'sprints')],
    { cwd: root, encoding: 'utf8', timeout: DASHBOARD_TIMEOUT_MS });
  const problems = [];
  const byFile = new Map();
  if (r.error) {
    problems.push(`dashboard.sh could not be run: ${r.error.message}`);
    return { byFile, problems, code: null };
  }
  const stdout = r.stdout || '';
  if (!stdout.includes(DASHBOARD_MARKER)) {
    problems.push(`dashboard.sh did not emit ${DASHBOARD_MARKER}; sprint status is not being read.`);
    return { byFile, problems, code: r.status };
  }
  for (const line of stdout.split('\n')) {
    if (!line.startsWith('candidate ')) continue;
    const rec = {};
    for (const m of line.matchAll(/(\w+)="([^"]*)"/g)) rec[m[1]] = m[2];
    if (rec.file) byFile.set(rec.file, { identity: rec.identity || '', status: rec.status || 'unresolved' });
  }
  return { byFile, problems, code: r.status };
}

function readBoards(root, dashboard, boardFiles, tasks) {
  const { byFile, problems } = selectActive(root, dashboard);
  const boards = boardFiles.map((f) => {
    let identity = '';
    let status;
    if (f.location === 'open') {
      const sel = byFile.get(f.name);
      if (sel) { identity = sel.identity; status = sel.status; }
      else { status = 'unresolved'; problems.push(`${f.name}: no candidate record from dashboard.sh.`); }
    } else {
      // ⛔ LOCATION is the second carrier of the two terminal states. No banner is parsed here and no
      // extra subprocess is spent: `sprints/done/` is Done, `sprints/cancelled/` is Cancelled.
      status = f.location === 'done' ? 'Done' : 'Cancelled';
    }
    const id = (identity && boardId(identity)) || boardIdFromFile(f.name);
    const lines = readFileSync(f.path, 'utf8').split('\n');
    const members = tasks.filter((t) => t.sprint === id);
    const counts = Object.fromEntries(COLUMNS.map((c) => [c, members.filter((t) => t.status === c).length]));
    return {
      id,
      title: (lines[0] || f.name).replace(/^#+\s*/, '').trim().slice(0, 120),
      // ⚠️ The canonical status string, VERBATIM: exactly what `dashboard.sh` resolved for an open
      // board, or the location constant for an archived one. `unresolved` renders as `unresolved` and
      // is NEVER silently reported as `Backlog` or as active.
      status,
      identity: identity || null,
      // ⛔ NULL, DELIBERATELY. fkit's board format has NO goal field. Line 3 is the STATUS BANNER, so
      // publishing it here put the status in a field labelled "Goal" on every sprint card and in the
      // drawer's <dt>Goal</dt> — and stripping its blockquoted-heading prefix to do so was a SECOND
      // read of the one-grammar carrier (see the header's ONE GRAMMAR note). Both are fixed by not
      // reading line 3 at all. ⚠️ The prefix is not quoted here: assertion C scans this file's
      // COMMENTS too, and nothing here needs to spell the grammar out to explain itself.
      // ⚠️ "The first non-blank line AFTER the banner" was considered and rejected: the banner is a
      // blockquote spanning many lines, so finding where it ENDS is exactly the grammar this file may
      // not re-derive. aiboard renders `s.goal ? … : '—'`, so null degrades to its own absence glyph.
      goal: null,
      start: null,
      end: null,
      tasks: members.map((t) => t.id),
      created: null,
      updated: null,
      folder: f.name,
      path: f.path,
      progress: {
        total: members.length,
        counts,
        percent: members.length ? Math.round((100 * counts.done) / members.length) : 0,
        remaining: counts.backlog + counts['in-progress'],
      },
    };
  });

  // ⚠️ Two board FILES can map to one id (`backlog.md` + `sprint-backlog.md` both become BACKLOG). Both
  // then list the same tasks, and /api/sprints/<id> opens only the first — the other board is silently
  // shadowed. This SAYS so, as a warning: nothing is merged or renamed, and `ok` on /api/check is not
  // flipped by it (owner ruling for 0412; 0411's residual R10). Names are sprints-relative — no path.
  const claims = new Map();
  boards.forEach((b, i) => {
    const f = boardFiles[i];
    const name = f.location === 'open' ? f.name : `${f.location}/${f.name}`;
    claims.set(b.id, (claims.get(b.id) || []).concat(name));
  });
  const warnings = [...claims].filter(([, files]) => files.length > 1).map(([id, files]) =>
    `board id ${id} is claimed by ${files.length} files (${files.join(', ')}): each lists the same `
    + `tasks, and /api/sprints/${id} opens only ${files[0]}.`);
  return { boards, problems, warnings };
}

// ── The snapshot, and its mtime cache ────────────────────────────────────────────────────────────

// ⚠️ The key carries PER-BOARD counts as well as a max mtime. A max alone cannot see a DELETION:
// remove any file that is not the newest and the max does not move.
//
// ⚠️ PER-BOARD, not a total, and that is the whole point. A closed-and-moved task — the case this
// comment used to claim and not deliver — leaves the TOTAL unchanged (backlog/ loses one, done/ gains
// one) and `mv`/`git mv` PRESERVE the brief's mtime, so a total-plus-max key served the old board
// indefinitely. `119/273/19` → `118/274/19` catches it.
//
// ⚠️ What this still does NOT catch, stated rather than implied: a RENAME INSIDE one board
// (`0123-old` → `0123-new`) moves no count and no mtime. Out of scope here — the movers relocate
// folders between boards, which is the case that occurs.
function cacheKey(taskDirs, boardFiles) {
  let max = 0;
  const perBoard = new Map(TASK_BOARDS.map((b) => [b, 0]));
  for (const e of taskDirs) {
    if (e.mtimeMs > max) max = e.mtimeMs;
    perBoard.set(e.board, perBoard.get(e.board) + 1);
  }
  for (const f of boardFiles) if (f.mtimeMs > max) max = f.mtimeMs;
  return `${TASK_BOARDS.map((b) => perBoard.get(b)).join('/')}:${boardFiles.length}:${max}`;
}

export function makeReader({ root, dashboard }) {
  let cached = null;

  function snapshot() {
    const taskDirs = listTaskDirs(root);
    const boardFiles = listBoardFiles(root);
    const key = cacheKey(taskDirs, boardFiles);
    if (cached && cached.key === key) return cached;

    const tasks = taskDirs.map(readTask);
    const { boards, problems, warnings } = readBoards(root, dashboard, boardFiles, tasks);
    const data = {
      root: join(root, 'ai-agents'),
      name: `${basename(root)} (read-only)`,
      statuses: COLUMNS,
      tasks,
      sprints: boards,
      generated: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
      // ⭐ aiboard's UI ACTS on this: it shows the read-only badge, disables the new-task and
      // new-sprint buttons, strips `draggable` off every card, and renders the drawer without a single
      // control. The read-only promise is kept in the UI as well as at the HTTP layer.
      read_only: true,
    };
    // ⚠️ FIRST occurrence wins, because `taskDetail` finds its card with `tasks.find()`, which also
    // takes the first. A Map built by `.map()` keeps the LAST, so two folders sharing a 4-digit id
    // (a botched move leaving a copy in both backlog/ and done/) served one task's title and status
    // beside the OTHER task's brief and worklog. Zero duplicates exist today; the two lookups now
    // agree by construction rather than by luck.
    const byId = new Map();
    for (const e of taskDirs) if (!byId.has(e.id)) byId.set(e.id, e);
    cached = { key, data, problems, warnings, byId };
    return cached;
  }

  function taskDetail(id) {
    const snap = snapshot();
    const task = snap.data.tasks.find((t) => t.id === id);
    if (!task) return null;
    const entry = snap.byId.get(id);
    const worklog = join(entry.path, 'worklog.md');
    return {
      ...task,
      brief: readFileSync(entry.brief, 'utf8'),
      comments: [],
      worklog: existsSync(worklog)
        ? [{ timestamp: '', author: 'worklog.md', text: readFileSync(worklog, 'utf8') }]
        : [],
    };
  }

  // The board markdown is capped, because the biggest board is 855,821 characters and the drawer is
  // not a file viewer. ⚠️ A cap that does not SAY it cut is the same class of fault as a status field
  // labelled "Goal": the board shows you something and does not tell you it is partial.
  //
  // ⚠️ The marker LEADS the text rather than trailing it, and that placement is load-bearing: aiboard
  // renders the description as `(s.description || '').replace(/^## Tasks[\s\S]*$/m, '')` — everything
  // from a `## Tasks` heading onward is STRIPPED. A trailing marker survives only while no board puts
  // `## Tasks` inside the cap (true today, luck tomorrow). A leading one always renders.
  const DESCRIPTION_CAP = 20000;

  function sprintDetail(id) {
    const snap = snapshot();
    const board = snap.data.sprints.find((s) => s.id === id);
    if (!board) return null;
    const full = readFileSync(board.path, 'utf8');
    const cut = full.length > DESCRIPTION_CAP;
    const n = (x) => x.toLocaleString('en-US');
    return {
      ...board,
      description: cut
        ? `⚠️ … truncated, ${n(DESCRIPTION_CAP)} of ${n(full.length)} characters …\n\n`
          + full.slice(0, DESCRIPTION_CAP)
        : full,
      tasks_detail: snap.data.tasks.filter((t) => t.sprint === id),
    };
  }

  return {
    snapshot: () => snapshot().data,
    problems: () => snapshot().problems,
    warnings: () => snapshot().warnings,
    taskDetail,
    sprintDetail,
  };
}

// ── The server ───────────────────────────────────────────────────────────────────────────────────

export function startServer({ root, dashboard, aiboardPath, port = DEFAULT_PORT, host = '127.0.0.1' }) {
  const reader = makeReader({ root, dashboard });

  const server = createServer((req, res) => {
    const send = (code, body, type = 'application/json; charset=utf-8') => {
      const buf = Buffer.isBuffer(body) ? body : Buffer.from(body);
      res.writeHead(code, {
        'Content-Type': type,
        'Content-Length': buf.length,
        'Cache-Control': 'no-store',
      });
      res.end(buf);
    };
    const json = (code, value) => send(code, JSON.stringify(value));
    // ⛔ 404s never name a filesystem path.
    const notFound = () => json(404, { error: 'not found' });

    // ⛔ THE WRITE REFUSAL. Everything that is not GET is refused — a superset of the POST/PUT/PATCH/
    // DELETE the plan names, so no method can slip through by not having been listed.
    if (req.method !== 'GET') {
      return json(405, { error: 'fkit-board is read-only: it serves GET and nothing else. Nothing is ever written.' });
    }

    const path = (req.url || '/').split('?')[0];
    try {
      if (path === '/' || path === '/index.html') {
        return send(200, readFileSync(aiboardPath), 'text/html; charset=utf-8');
      }
      if (path === '/api/board') return json(200, reader.snapshot());
      if (path === '/api/check') {
        const problems = reader.problems();
        // `ok` still means "sprint status is being read"; `warnings` never flips it.
        return json(200, { ok: problems.length === 0, problems, warnings: reader.warnings() });
      }
      if (path.startsWith('/api/tasks/')) {
        const id = path.slice('/api/tasks/'.length);
        if (!TASK_ID_RE.test(id)) return notFound();
        const task = reader.taskDetail(id);
        return task ? json(200, task) : notFound();
      }
      if (path.startsWith('/api/sprints/')) {
        const board = reader.sprintDetail(decodeURIComponent(path.slice('/api/sprints/'.length)));
        return board ? json(200, board) : notFound();
      }
      return notFound();
    } catch (err) {
      // ⚠️ NEITHER a stack NOR a path — and the message is NOT echoed, because an fs error message
      // CARRIES the absolute path it failed on ("ENOENT: no such file or directory, open '/abs/…'").
      // Echoing it was how this handler leaked the filesystem while its own comment said it did not.
      // The error CODE names the failure class without naming the machine, which is what a 500 here
      // is for; the loud, path-naming diagnosis belongs to startup, where resolveAiboard() does it.
      return json(500, { error: `fkit-board: internal read error${err.code ? ` (${err.code})` : ''}` });
    }
  });

  server.listen(port, host);
  return server;
}

// ── CLI ──────────────────────────────────────────────────────────────────────────────────────────

function arg(argv, name) {
  const i = argv.indexOf(name);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : undefined;
}

function main(argv) {
  // ⚠️ `arg()` reads neither `--root=<path>` nor a trailing `--root` with no value — both would come
  // back `undefined` and silently serve fkit's OWN tree. Each is refused here instead. So is a SECOND
  // `--root`: `arg()` takes the first, so the other would be silently ignored — never validated, and
  // a trailing bare one would slip past the "needs a path" check below.
  if (argv.filter((a) => a === '--root').length > 1) {
    process.stderr.write('fkit-board: --root given more than once; give exactly one --root <path>. '
      + 'fkit-board does not fall back to its own tree.\n');
    return 2;
  }
  if (argv.some((a) => a.startsWith('--root='))) {
    process.stderr.write('fkit-board: write --root <path> (a space, not "="). '
      + 'fkit-board does not fall back to its own tree.\n');
    return 2;
  }
  if (argv.includes('--root') && arg(argv, '--root') === undefined) {
    process.stderr.write('fkit-board: --root needs a path: --root <path>. '
      + 'fkit-board does not fall back to its own tree.\n');
    return 2;
  }

  // `home` is fkit's own checkout — where the TOOLS live. `root` is the tree being READ.
  const home = findRoot();
  let rootInfo;
  try {
    rootInfo = resolveRoot({ flag: arg(argv, '--root'), home });
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    return 2;
  }
  const root = rootInfo.path;
  const foreign = rootInfo.how === '--root';

  // ⚠️ ALWAYS fkit's own copy, and ALWAYS absolute. `dashboard.sh` is spawned with `cwd: root`, so a
  // RELATIVE path would resolve inside the TARGET project — and on a target that carries its own
  // (possibly older) copy at the same relative path, would silently run THAT one instead.
  let dashboard;
  try {
    dashboard = resolve(findDashboard(home));
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    return 2;
  }
  // Visibility only: does the target carry its own copy that is being passed over? A stat, not a read.
  let targetCopy = null;
  if (foreign) {
    try { targetCopy = resolve(findDashboard(root)); } catch { targetCopy = null; }
    if (targetCopy === dashboard) targetCopy = null;
  }
  const treeLine = `  tree     ${join(root, 'ai-agents')}${foreign ? '  (--root)' : ''}\n`;
  const statusLine = `  status   ${dashboard}`
    + `${foreign ? '  (fkit\'s own — the target\'s copy is not used)' : ''}\n`;
  const noteLine = targetCopy
    ? '  note     this project carries its own dashboard.sh; it is NOT used. If that install is older '
      + 'than this fkit,\n           its own /fkit-status may read boards differently from this board.\n'
    : '';
  // ⚠️ Checked AT STARTUP, loudly. A reader that cannot read sprint status refuses to start rather
  // than serving every board as `unresolved` and letting the owner discover it by eye.
  const probe = spawnSync('bash', [dashboard, 'select-active', join(root, 'ai-agents', 'sprints')],
    { cwd: root, encoding: 'utf8' });
  if (probe.error || !(probe.stdout || '').includes(DASHBOARD_MARKER)) {
    process.stderr.write(`fkit-board: ${dashboard} did not emit ${DASHBOARD_MARKER}. `
      + 'Sprint status has exactly one recognizer and this reader will not guess at it.\n');
    return 2;
  }

  // ⚠️ TWO NUMBERS, NOT ONE, and the counting rule is printed beside each. A FULL RECOMPUTE gets a
  // FRESH reader every iteration, so nothing is served from the cache — that is the number comparable
  // to the Python spike's, which had no cache. A CACHE HIT re-stats every brief and board file and
  // then returns the memo; it is what the 3-second poll actually costs once the tree is quiet.
  // Reporting only the second would be a flattering number measuring the wrong thing.
  if (argv.includes('--bench')) {
    if (foreign) process.stdout.write(treeLine + statusLine);
    let snap;
    for (let i = 0; i < 3; i++) {
      const fresh = makeReader({ root, dashboard });
      const t0 = process.hrtime.bigint();
      snap = fresh.snapshot();
      const ms = Number(process.hrtime.bigint() - t0) / 1e6;
      process.stdout.write(`full recompute (fresh reader, no cache): ${ms.toFixed(1)} ms\n`);
    }
    const warm = makeReader({ root, dashboard });
    warm.snapshot();
    for (let i = 0; i < 3; i++) {
      const t0 = process.hrtime.bigint();
      warm.snapshot();
      process.stdout.write(`cache hit (re-stat ${snap.tasks.length} briefs + board files, then memo): `
        + `${(Number(process.hrtime.bigint() - t0) / 1e6).toFixed(2)} ms\n`);
    }
    process.stdout.write(`corpus: ${snap.tasks.length} tasks, ${snap.sprints.length} boards, `
      + `${Buffer.byteLength(JSON.stringify(snap))} payload bytes\n`);
    return 0;
  }

  let aiboard;
  try {
    // aiboard is fkit's tool, not the target's data: its sibling default sits next to `home`.
    aiboard = resolveAiboard({ flag: arg(argv, '--aiboard'), env: process.env.FKIT_AIBOARD, root: home });
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    return 2;
  }

  const port = Number(arg(argv, '--port') ?? DEFAULT_PORT);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    process.stderr.write(`fkit-board: --port must be an integer 0-65535, got ${arg(argv, '--port')}\n`);
    return 2;
  }

  const server = startServer({ root, dashboard, aiboardPath: aiboard.path, port });
  server.on('listening', () => {
    const a = server.address();
    process.stdout.write(
      `fkit-board  http://127.0.0.1:${a.port}/   (read-only — Ctrl+C to stop)\n`
      + treeLine
      + `  aiboard  ${aiboard.path}  (${aiboard.how})\n`
      + statusLine
      + noteLine);
  });
  server.on('error', (err) => {
    process.stderr.write(`fkit-board: ${err.message}\n`);
    process.exitCode = 2;
  });
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const code = main(process.argv.slice(2));
  if (code !== 0) process.exit(code);
}
