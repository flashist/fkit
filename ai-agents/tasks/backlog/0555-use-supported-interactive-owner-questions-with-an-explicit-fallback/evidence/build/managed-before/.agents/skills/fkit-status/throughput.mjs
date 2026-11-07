#!/usr/bin/env node
// Run as: node .claude/skills/fkit-status/throughput.mjs [flags]. Never ./ (exec bit, ADR-017 rule 2); never
// bash, which cannot run JavaScript (0359 worklog D2). The shebang is decorative.

// Gives /fkit-status a measured trend from git history in place of a snapshot (0359 plan §7, ruling W6).

// Pure function of (repo, revision) -> (stdout, exit code): reads git, never the worktree; writes nothing;
// node >= 18, no dependency (ADR-014). No --worktree mode on purpose (0359 plan, ruling W5).

// Emits its own ⟦fkit-throughput v1⟧ markers: no dashboard.sh parser sees a new token (0359 plan §6).

import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// A RECORD REPAIR: the slug's leading verb is one of these, i.e. work on the project's own written record.
// ⚠️ The rule is A PROXY, PERMANENTLY: --list prints each open row's verdict for a check by hand.

// The verbs were pinned by reading every open row, never by fitting a target count (0359 worklog D1).
const REPAIR_VERBS = new Map([
  ['amend',    'amends a written record to say something different'],
  ['append',   'appends a dated note to an existing record; the record is the subject'],
  ['backfill', 'fills a field that records already in place are missing'],
  ['correct',  'corrects a false or stale claim inside a record'],
  ['fix',      'repairs a defect in a record-writing rule (see the source-defect exceptions)'],
  ['gloss',    'defines an undefined term inside a record so the record reads correctly'],
  ['reconcile','settles a disagreement between two records about the same fact'],
  ['record',   "writes the project's own record: a convention, an ADR, a decision"],
  ['repair',   'repairs a record gone stale or self-contradictory (see the exceptions)'],
]);

// Repair-verb rows whose subject is a source defect, not a record: a human judgement the slug cannot give,
// so each is named and printed as `exception`. The only hand-maintained list in this file.
const SOURCE_DEFECT_EXCEPTIONS = new Map([
  ['0215', 'repairs a work-dir landmine in the prove-red harness — test infrastructure, not a record'],
  ['0234', "fixes dashboard.sh's drift rule for a task that moves twice — rendering logic, not a record"],
  ['0334', "fixes the launcher's name-existence agents fail-safe — a launcher defect, not a record"],
]);

// Takes a folder slug, e.g. "0234-fix-dashboard-drift-rule-2".
export function classify(slug) {
  const m = /^(\d{4})-(.+)$/.exec(slug);
  const id = m ? m[1] : null;
  const rest = m ? m[2] : slug;
  const verbMatch = /^([a-z0-9]+)(?:-|$)/.exec(rest);
  const verb = verbMatch ? verbMatch[1] : null;
  const recordRepair = verb !== null && REPAIR_VERBS.has(verb);
  const exception = recordRepair && id !== null && SOURCE_DEFECT_EXCEPTIONS.has(id)
    ? SOURCE_DEFECT_EXCEPTIONS.get(id)
    : null;
  return { id, verb, recordRepair, exception };
}

// ISO-8601 week by the Thursday rule, in JS because git's %G/%V go through a non-portable strftime (0359
// plan §3). Reads the date as written, never re-projected to UTC: a commit belongs to its author's week.
export function isoWeek(isoDate) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(isoDate));
  if (!m) throw new Error(`isoWeek: unparseable date ${JSON.stringify(isoDate)}`);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  const dow = (d.getUTCDay() + 6) % 7;                 // Monday = 0 … Sunday = 6
  d.setUTCDate(d.getUTCDate() - dow + 3);              // the Thursday of this ISO week
  const year = d.getUTCFullYear();                     // ISO year = the year that Thursday is in
  const jan4 = new Date(Date.UTC(year, 0, 4));         // 4 Jan is always in ISO week 1
  const jan4dow = (jan4.getUTCDay() + 6) % 7;
  const week1Thursday = Date.UTC(year, 0, 4 - jan4dow + 3);
  const week = 1 + Math.round((d.getTime() - week1Thursday) / 604800000);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

const BRIEF_FOLDER = /^ai-agents\/tasks\/(backlog|done|cancelled)\/([^/]+)\/brief\.md$/;
const BRIEF_FLAT   = /^ai-agents\/tasks\/(backlog|done|cancelled)\/([^/]+)\.md$/;

// Identity: a folder's NNNN (ADR-029); before the migration, the flat filename stem, so per-week counts are
// exact there but per-ID drill-down is not (0359 plan, ruling W2).
export function briefIdentity(path) {
  let m = BRIEF_FOLDER.exec(path);
  if (m) {
    const idm = /^(\d{4})-/.exec(m[2]);
    return { segment: m[1], identity: idm ? idm[1] : m[2], folder: m[2], era: 'folder' };
  }
  m = BRIEF_FLAT.exec(path);
  if (m && m[2] !== '.gitkeep') {
    return { segment: m[1], identity: m[2], folder: m[2], era: 'flat' };
  }
  return null;
}

const CLOSED_SEGMENTS = new Set(['done', 'cancelled']);

// records must be oldest first, as readHistory returns them.
export function foldTransitions(records) {
  const weeks = new Map();
  const tasks = new Map();          // identity -> { created: week|null, closed: week|null, folder }
  const byCommit = new Map();       // commit -> { created, closed, sameSegment } — for honest notes
  const reopens = [];
  let shapeChanges = 0;
  let created = 0;
  let closed = 0;

  const commitTally = (commit) => {
    if (!byCommit.has(commit)) byCommit.set(commit, { created: 0, closed: 0, sameSegment: 0 });
    return byCommit.get(commit);
  };
  const bump = (week, key, commit) => {
    if (!weeks.has(week)) weeks.set(week, { created: 0, closed: 0 });
    weeks.get(week)[key] += 1;
    commitTally(commit)[key] += 1;
  };
  const state = (identity) => {
    if (!tasks.has(identity)) tasks.set(identity, { created: null, closed: null, folder: null });
    return tasks.get(identity);
  };

  for (const rec of records) {
    const to = briefIdentity(rec.to);
    if (!to) continue;                                    // not a task brief — ignore entirely
    const week = isoWeek(rec.date);
    const isRename = /^[RC]\d*$/.test(rec.status);
    const from = isRename && rec.from ? briefIdentity(rec.from) : null;

    if (isRename && from) {
      // A rename carries identity, so a flat stem and the NNNN it was given count as one task.
      const prior = tasks.get(from.identity);
      if (prior && from.identity !== to.identity) {
        tasks.delete(from.identity);
        tasks.set(to.identity, prior);
      }
      const st = state(to.identity);
      st.folder = to.folder;

      if (from.segment === to.segment) {
        // A same-segment rename (the migration, a slug rename) is a shape change, not a transition. The guard
        // matters where the carry cannot fire, e.g. a shallow history (0359 worklog D4; 0359 review R5).
        shapeChanges += 1;
        commitTally(rec.commit).sameSegment += 1;
        continue;
      }
      if (CLOSED_SEGMENTS.has(to.segment)) {
        if (st.closed === null) { st.closed = week; closed += 1; bump(week, 'closed', rec.commit); }
        else reopens.push({ identity: to.identity, week, kind: 're-closed', commit: rec.commit });
        // A task whose brief was never committed under backlog/ still has to have been created.
        if (st.created === null) { st.created = week; created += 1; bump(week, 'created', rec.commit); }
        continue;
      }
      // done/cancelled -> backlog: a reopen. The FIRST close stands; the reopen is reported, never
      // silently dropped, so a re-close cannot look like a second task.
      if (st.closed !== null) reopens.push({ identity: to.identity, week, kind: 'reopened', commit: rec.commit });
      if (st.created === null) { st.created = week; created += 1; bump(week, 'created', rec.commit); }
      continue;
    }

    // A brief can be born closed: created and closed between two pushes, it first appears under done/.
    if (rec.status === 'A') {
      const st = state(to.identity);
      st.folder = to.folder;
      if (st.created === null) { st.created = week; created += 1; bump(week, 'created', rec.commit); }
      if (CLOSED_SEGMENTS.has(to.segment) && st.closed === null) {
        st.closed = week; closed += 1; bump(week, 'closed', rec.commit);
      }
      continue;
    }
    // 'M' and 'D' are not transitions. The movers never delete a brief, so a D means the file left by another
    // route, and inventing a close for it would be a guess.
  }

  return { weeks, tasks, byCommit, reopens, shapeChanges, created, closed };
}

function git(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

const COMMIT_HEADER = /^C([0-9a-f]{40}) (.+)$/;

// ⛔ Resolve the repo root: a pathspec is relative to the caller's cwd, so a subdirectory run printed a
// well-formed report of all zeros at exit 0 (0359 review R1).
function repoRoot(repo) {
  return git(repo, ['rev-parse', '--show-toplevel']).trim();
}

// ⛔ The pathspec stays the whole ai-agents/tasks/ tree: narrowed, git cannot see a rename's source side and
// every close reads as an add (0359 plan §0.3). --find-renames is forced, not config (0359 review R2).
export function readHistory(repo, rev) {
  const raw = git(repoRoot(repo), [
    'log', rev, '--no-merges', '--reverse', '-z', '--name-status', '--find-renames',
    '--date=iso-strict', '--format=C%H %ad', '--', ':/ai-agents/tasks/',
  ]);
  const tokens = raw.split('\0');
  const records = [];
  let commit = null;
  let date = null;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i].replace(/^\n/, '');
    if (tok === '') continue;
    const head = COMMIT_HEADER.exec(tok);
    if (head) { commit = head[1]; date = head[2]; continue; }
    // Otherwise `tok` is a status field; the path(s) follow it.
    const status = tok;
    if (/^[RC]\d*$/.test(status)) {
      const from = tokens[++i];
      const to = tokens[++i];
      records.push({ commit, date, status, from, to });
    } else {
      const to = tokens[++i];
      records.push({ commit, date, status, from: null, to });
    }
  }
  return records;
}

// The open rows in rev's TREE, both eras: folders and flat <slug>.md briefs (0359 review R4, ruling W2).
// --full-tree makes the path root-relative, the same silent-zero hazard as repoRoot (0359 review R1).
export function readOpenRows(repo, rev) {
  let out = '';
  try {
    out = git(repoRoot(repo), ['ls-tree', '--full-tree', rev, 'ai-agents/tasks/backlog/']);
  } catch {
    return [];
  }
  const rows = [];
  for (const line of out.split('\n')) {
    if (!line) continue;
    // `<mode> <type> <object>\t<path>`
    const tab = line.indexOf('\t');
    if (tab < 0) continue;
    const type = line.slice(0, tab).split(/\s+/)[1];
    const name = line.slice(tab + 1).replace(/^.*\//, '');
    if (type === 'tree') rows.push(name);
    else if (type === 'blob' && name.endsWith('.md')) rows.push(name.replace(/\.md$/, ''));
  }
  return rows.sort();
}

/** The commit that turned flat task files into folders, if it is in this history. */
function findMigration(records) {
  for (const rec of records) {
    if (!/^[RC]\d*$/.test(rec.status) || !rec.from) continue;
    const from = briefIdentity(rec.from);
    const to = briefIdentity(rec.to);
    if (from && to && from.era === 'flat' && to.era === 'folder' && from.segment === to.segment) {
      return { commit: rec.commit, date: rec.date, week: isoWeek(rec.date) };
    }
  }
  return null;
}

function pct(n, d) { return d === 0 ? '0.0' : (Math.round((n / d) * 1000) / 10).toFixed(1); }

function classifyRows(rows) {
  const classified = rows.map((slug) => ({ slug, ...classify(slug) }));
  const repair = classified.filter((r) => r.recordRepair);
  const exceptions = repair.filter((r) => r.exception !== null);
  return { classified, repair, exceptions };
}

function renderReport(repo, rev) {
  const revSha = git(repo, ['rev-parse', rev]).trim();
  const records = readHistory(repo, revSha);
  const fold = foldTransitions(records);
  const rows = readOpenRows(repo, revSha);
  const { repair, exceptions } = classifyRows(rows);
  const migration = findMigration(records);

  const out = [];
  out.push('⟦fkit-throughput v1⟧');
  out.push('⟦WEEKS⟧');
  out.push(`at ${rev} ${revSha}`);
  out.push(`totals created ${fold.created} closed ${fold.closed}`);
  // Self-check: every task is created once and closed at most once, so created - closed must equal open;
  // the report refuses to print when it does not, e.g. with rename detection off (0359 review R2).
  out.push(`reconciliation created-minus-closed ${fold.created - fold.closed} open ${rows.length}`);
  if (migration) {
    out.push(`horizon task-folder-migration ${migration.commit} ${migration.week}`);
    out.push('note the pre-migration era IS counted, by flat-filename identity — no history is discarded');
    out.push('note before that commit a task had no ID, so per-week counts are exact but per-ID drill-down is unavailable');
    // ⛔ Computed from the fold, never asserted: the migration commit also carries one real close
    // (0359 review R3).
    const mt = fold.byCommit.get(migration.commit) || { created: 0, closed: 0, sameSegment: 0 };
    const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
    out.push(`note that commit is overwhelmingly a reshape: ${plural(mt.sameSegment,
      'same-segment rename contributes', 'same-segment renames contribute')} nothing, and it`
      + ` contributes ${plural(mt.closed, 'close', 'closes')}`
      + ` and ${plural(mt.created, 'creation', 'creations')}`);
  } else {
    out.push('note no task-folder migration commit is present in this history');
  }
  out.push(`note ${fold.shapeChanges} same-segment renames excluded as shape changes, not transitions`);
  for (const r of fold.reopens) out.push(`reopen ${r.identity} ${r.week} ${r.kind}`);
  for (const week of [...fold.weeks.keys()].sort()) {
    const w = fold.weeks.get(week);
    out.push(`week ${week} created ${w.created} closed ${w.closed}`);
  }
  out.push('⟦REPAIR⟧');
  out.push(`open ${rows.length}`);
  out.push(`repair ${repair.length}`);
  out.push(`repair-pct ${pct(repair.length, rows.length)}`);
  out.push(`repair-excluding-source-defects ${repair.length - exceptions.length}`);
  out.push(`repair-excluding-source-defects-pct ${pct(repair.length - exceptions.length, rows.length)}`);
  for (const e of exceptions) out.push(`exception ${e.id} repairs-source-defect`);
  out.push('⟦END⟧');
  if (fold.created - fold.closed !== rows.length) {
    throw new Error(
      `reconciliation FAILED at ${rev} (${revSha}): created ${fold.created} - closed ${fold.closed}`
      + ` = ${fold.created - fold.closed}, but ${rows.length} rows are open. The counts cannot be`
      + ' trusted and no figure from this run may be quoted.\n'
      + '  The usual cause is git not detecting renames, which re-reports every close as an'
      + ' unrelated add plus delete. Check `git config --get diff.renames` and `merge.renames`.');
  }
  return out.join('\n') + '\n';
}

function renderList(repo, rev) {
  const revSha = git(repo, ['rev-parse', rev]).trim();
  const rows = readOpenRows(repo, revSha);
  const { classified } = classifyRows(rows);
  const out = [];
  out.push('⟦fkit-throughput-list v1⟧');
  out.push('⟦ROWS⟧');
  out.push(`at ${rev} ${revSha}`);
  for (const r of classified) {
    out.push(`row ${r.id ?? '?'} ${r.recordRepair ? 'record-repair' : 'other'} verb=${r.verb ?? '?'}`
      + ` exception=${r.exception ? 'yes' : 'no'} ${r.slug}`);
  }
  out.push('⟦VERBS⟧');
  for (const [verb, reason] of REPAIR_VERBS) out.push(`verb ${verb} — ${reason}`);
  for (const [id, reason] of SOURCE_DEFECT_EXCEPTIONS) out.push(`exception ${id} — ${reason}`);
  out.push('⟦END⟧');
  return out.join('\n') + '\n';
}

const USAGE = `throughput.mjs — created vs closed per ISO week, plus the record-repair share of open work.

  node .claude/skills/fkit-status/throughput.mjs [--repo <path>] [--at <rev>] [--list]

  --repo <path>  repository to read (default: the current directory)
  --at <rev>     revision whose history and open-row tree to read (default: HEAD)
                 ⚠️ always a revision, never the worktree — an uncommitted close is not counted
  --list         print the classification of every open row instead of the counts
`;

export function parseArgs(argv) {
  const opts = { repo: process.cwd(), rev: 'HEAD', list: false, help: false };
  // ⚠️ A flag is never a value: `--at --list` must be a usage error, not a bad revision (0359 review R9).
  const value = (flag, next) => {
    if (next === undefined) throw new Error(`${flag} needs a value\n\n${USAGE}`);
    if (/^--/.test(next)) {
      throw new Error(`${flag} needs a value, but got the flag ${JSON.stringify(next)}\n\n${USAGE}`);
    }
    return next;
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--repo') opts.repo = value(a, argv[++i]);
    else if (a === '--at') opts.rev = value(a, argv[++i]);
    else if (a === '--list') opts.list = true;
    else if (a === '--help' || a === '-h') opts.help = true;
    else throw new Error(`unknown argument ${JSON.stringify(a)}\n\n${USAGE}`);
  }
  return opts;
}

export function run(argv) {
  const opts = parseArgs(argv);
  if (opts.help) return USAGE;
  return opts.list ? renderList(opts.repo, opts.rev) : renderReport(opts.repo, opts.rev);
}

// ⚠️ realpathSync and pathToFileURL are both load-bearing: a symlinked argv[1] (macOS /tmp) or a path with a
// space or # never matches import.meta.url, and the script exits 0 printing nothing (0359 worklog D3).
function isDirectInvocation() {
  if (!process.argv[1]) return false;
  try {
    return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
  } catch {
    return false;
  }
}
if (isDirectInvocation()) {
  try {
    process.stdout.write(run(process.argv.slice(2)));
  } catch (err) {
    process.stderr.write(`throughput.mjs: ${err.message}\n`);
    process.exit(1);
  }
}
