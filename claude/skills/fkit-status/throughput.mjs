#!/usr/bin/env node
// throughput.mjs — count task CREATIONS vs CLOSES per ISO week from git history, and report the
// record-repair share of currently-open work.
//
//   ⚠️  INVOKE AS:  node .claude/skills/fkit-status/throughput.mjs [flags]
//   ⚠️  NEVER AS:   ./throughput.mjs
//   ⚠️  NEVER AS:   bash .claude/skills/fkit-status/throughput.mjs   ← bash cannot run JavaScript
//
// The shebang above is DECORATIVE, for the same reason `dashboard.sh`'s header gives: the installer
// chmod +x's a HARDCODED LIST OF TWO FILENAMES ("fkit-claude.sh fkit-claude-init.sh"), this file is
// not on that list, and it rides a GitHub tarball + `cp -R` chain that does not guarantee the exec
// bit. Invoking through the interpreter sidesteps the bit entirely and needs no installer change.
// `dashboard.sh` reaches that outcome with `bash`; this file is JavaScript, so the interpreter is
// `node`. Substituting `bash` here does not merely style-clash — it exits 2 with "command not found".
//
// WHY THIS EXISTS: `/fkit-status` renders ONE snapshot of a board, and its Backlog beat therefore
// forbade any growth/shrink claim on the stated ground that "the source set has no history to ground
// a trend in". Git IS that history. This script supplies it, so the ban could narrow from "no trend
// claims" to "no UNMEASURED trend claims". The skill's amended line names this file as the source.
//
// CONTRACT: pure function of (a git repository, a revision) -> (stdout, exit code).
//   - Reads git history and one tree listing. Writes nothing. No network. No dependency (ADR-014).
//   - `--at <rev>` reads that revision's tree via `git ls-tree`; it NEVER reads the worktree, so the
//     figure is honest with a dirty tree by construction. The default reads HEAD — also not the
//     worktree. The output always states which revision it read.
//   - ⛔ There is deliberately NO `--worktree` mode. An uncommitted close is not in the history the
//     per-week counts come from, so a worktree headline would mix two different corpora in one
//     report. Uncommitted closes are counted once they are committed.
//   - Emits its OWN markers (⟦fkit-throughput v1⟧ / ⟦WEEKS⟧ / ⟦REPAIR⟧ / ⟦END⟧). Nothing that parses
//     `dashboard.sh`'s ⟦fkit-dashboard v1⟧ / ⟦BOARD⟧ / ⟦FACTS⟧ sees a new token. `dashboard.sh` is
//     not touched by this file's existence; it remains the sole producer of the board.
//   - This script COUNTS. It never closes a task, never moves a folder, never edits a `## Status`.
//
// PORTABILITY: node >= 18, no dependency, no `package.json` change. The ISO-week number is computed
// here in JS rather than taken from `git log --date=format:%G-W%V`, because that path goes through
// the platform's strftime and %G/%V are not portable across the libc implementations this ships to.

import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// --- the record-repair rule -------------------------------------------------------------------
//
// A task folder is a RECORD REPAIR when the leading token of its slug (the word after the `NNNN-`
// prefix) is one of the verbs below — work whose subject is THE PROJECT'S OWN WRITTEN RECORD rather
// than its behaviour.
//
// ⚠️ THE RULE IS A PROXY, PERMANENTLY. A leading verb is not a category. It is cheap, stable, and
// auditable, and those are the only claims made for it. `--list` prints the verdict for every open
// row precisely so a disputed row can be checked by hand rather than argued about in the abstract.
//
// The set below was pinned by READING ALL 129 OPEN ROWS at the 2026-08-29 baseline revision and
// recording a judgement per row — NOT by adjusting the list until it reproduced a target count.
// Curve-fitting was a live hazard here: at that revision the seven-verb core scores 44, and BOTH
// `gloss` and `reconcile` add exactly one row, so two different eight-verb sets each reproduce the
// baseline's 45 while disagreeing about which row is in it. Reading the two rows settles it — both
// are record repairs, so both verbs are in, and the honest count is 46, not 45.
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

// Rows carrying a repair-class leading verb whose subject is a GENUINE SOURCE DEFECT, not a record.
// ⚠️ NOT DERIVABLE FROM THE SLUG — each is a human judgement, so each is named with its reason and
// printed under `exception` in the output. A disputed row is then visible rather than silently
// reclassified. This is the ONLY hand-maintained list in the file.
const SOURCE_DEFECT_EXCEPTIONS = new Map([
  ['0215', 'repairs a work-dir landmine in the prove-red harness — test infrastructure, not a record'],
  ['0234', "fixes dashboard.sh's drift rule for a task that moves twice — rendering logic, not a record"],
  ['0334', "fixes the launcher's name-existence agents fail-safe — a launcher defect, not a record"],
]);

/**
 * Classify one task-folder slug.
 * @param {string} slug e.g. "0234-fix-dashboard-drift-rule-2"
 * @returns {{id: string|null, verb: string|null, recordRepair: boolean, exception: string|null}}
 */
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

// --- ISO week ----------------------------------------------------------------------------------

/**
 * ISO-8601 week label for a date, by the Thursday-of-week rule.
 * Reads only the calendar date written in the string — the commit's own local date, as git recorded
 * it. Deliberately NOT re-projected into UTC: a commit made at 01:00 +03:00 belongs to the week its
 * author was in, and shifting it would silently move a Monday commit into the previous week.
 * @param {string} isoDate e.g. "2026-07-21T17:10:29+03:00" (a bare "YYYY-MM-DD" is also accepted)
 * @returns {string} e.g. "2026-W30"
 */
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

// --- transition folding ------------------------------------------------------------------------

const BRIEF_FOLDER = /^ai-agents\/tasks\/(backlog|done|cancelled)\/([^/]+)\/brief\.md$/;
const BRIEF_FLAT   = /^ai-agents\/tasks\/(backlog|done|cancelled)\/([^/]+)\.md$/;

/**
 * Resolve a path to { segment, identity } or null if it is not a task brief.
 *
 * IDENTITY, as pinned by this script:
 *   - Post-migration (a task IS a folder, ADR-029): the folder's `NNNN` prefix.
 *   - Pre-migration (flat `*.md`): the filename stem. No ID existed then — IDs were assigned BY the
 *     migration — so per-week counts are exact before it but per-ID drill-down is not available.
 */
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

/**
 * Fold a chronological list of name-status records into per-week creation and close counts.
 *
 * @param {Array<{commit: string, date: string, status: string, from: string|null, to: string}>} records
 *        Oldest commit first. `from` is set only for renames/copies.
 * @returns {{weeks: Map<string,{created:number,closed:number}>, created:number, closed:number,
 *            reopens:Array, shapeChanges:number, tasks:Map}}
 *
 * ⭐ THE THREE CASES THAT MAKE THIS MORE THAN A RENAME COUNT:
 *
 * 1. BORN-CLOSED tasks. This repo commits in batches. A task created and closed between two pushes
 *    never exists under `backlog/` in ANY committed tree — its brief is ADDED straight under `done/`.
 *    Counting only renames undercounts closes and reports zero creations for those tasks. Both
 *    events land in the same ISO week, correctly: from git's point of view that is when both became
 *    true.
 *
 * 2. THE MIGRATION IS NOT A CLOSE. The commit that turned every flat `done/<slug>.md` into
 *    `done/<NNNN-slug>/brief.md` is a rename whose BOARD SEGMENT DID NOT CHANGE — only the shape
 *    did. The rule is general, not a hardcoded commit: a rename inside the SAME segment is never a
 *    transition. That also covers a `done`→`done` slug rename.
 *
 *    ⚠️ MEASURED, because the obvious claim about this guard is WRONG and worth not repeating: with
 *    case 3 below in place, DELETING this segment check does NOT put a false ~79-close spike into
 *    the migration week. It was checked by execution against this repo's own history — the per-week
 *    counts came back BYTE-IDENTICAL. Identity-carrying already defeats the double count, because
 *    every reshaped task was ALREADY closed under its flat name, so a second close is refused by
 *    first-close-wins. What deleting the check actually breaks is the report's narrative: 90
 *    spurious `re-closed` records appear and the shape-change count reads 0. (90, not 100: the
 *    100 same-segment renames split 79 `done` + 11 `cancelled` + 10 `backlog`, and only the 90
 *    landing in a CLOSED segment reach the re-close branch.)
 *
 *    ⭐ THE CHECK STILL EARNS ITS PLACE, as defence in depth for the case where the carry CANNOT
 *    fire — a shallow clone or any grafted history where the rename's source side was never walked,
 *    so the reshaped task has no prior state to carry. Then the segment check is the only thing
 *    standing between the report and a fabricated close. That is the case the unit fixture pins.
 *
 * 3. RENAME CARRIES IDENTITY. Whatever the segments, a rename means the OLD identity and the NEW one
 *    are the same task, so state moves with it. That is what links a pre-migration flat stem to the
 *    `NNNN` it was given, without the two being counted as two tasks.
 */
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
      // Carry state across the rename: same task, new name.
      const prior = tasks.get(from.identity);
      if (prior && from.identity !== to.identity) {
        tasks.delete(from.identity);
        tasks.set(to.identity, prior);
      }
      const st = state(to.identity);
      st.folder = to.folder;

      if (from.segment === to.segment) {
        // ⛔ Shape change only (the migration, or a slug rename). NOT a transition.
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

    if (rec.status === 'A') {
      const st = state(to.identity);
      st.folder = to.folder;
      if (st.created === null) { st.created = week; created += 1; bump(week, 'created', rec.commit); }
      if (CLOSED_SEGMENTS.has(to.segment) && st.closed === null) {
        st.closed = week; closed += 1; bump(week, 'closed', rec.commit);   // born closed — case 1
      }
      continue;
    }
    // 'M' (edited in place) and 'D' (deleted) are not transitions. A deletion is not a close: the
    // movers never delete a brief, so a `D` here means the file left the tree by some other route
    // and inventing a close for it would be a guess.
  }

  return { weeks, tasks, byCommit, reopens, shapeChanges, created, closed };
}

// --- git plumbing --------------------------------------------------------------------------------

function git(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

const COMMIT_HEADER = /^C([0-9a-f]{40}) (.+)$/;

/**
 * The repository root for `repo`, which may be any directory INSIDE the repository.
 *
 * ⛔ LOAD-BEARING, AND ITS ABSENCE FAILED SILENTLY. A git pathspec is resolved relative to the
 * CALLER'S CWD, not the repository root. Without this, running the counter from any subdirectory —
 * or pointing `--repo` at one — matched nothing, and the script printed a complete, well-formed,
 * machine-readable report of ALL ZEROS and exited 0. The amended `/fkit-status` cell names this
 * script as the source of a quoted figure and states no cwd precondition, so that report would have
 * been quoted as measured fact. Every git call below goes through the resolved root.
 */
function repoRoot(repo) {
  return git(repo, ['rev-parse', '--show-toplevel']).trim();
}

/**
 * Read the whole `ai-agents/tasks/` history as name-status records, oldest first.
 *
 * ⛔ THE PATHSPEC IS THE WHOLE `ai-agents/tasks/` TREE, AND NARROWING IT IS A BUG, NOT A SPEEDUP.
 * Git cannot see the source side of a rename when the pathspec excludes it: with a pathspec of
 * `ai-agents/tasks/done/*` every single close reports as an `A` and the rename count is ZERO.
 * Filtering happens in `foldTransitions`, after git has had the whole tree to match renames across.
 * For the same reason there is no `--no-renames` and no narrow `--diff-filter` here.
 *
 * ⛔ `--find-renames` IS FORCED, NOT INHERITED. `diff.renames` is reader configuration, and this
 * script's whole purpose is a figure that does not depend on who runs it. Measured at the pinned
 * baseline: with the git default the totals are `created 351 closed 222`; under `diff.renames=false`
 * the SAME revision reports `created 452 closed 312`, silently, at exit 0 — every close re-reported
 * as an unrelated add-plus-delete. A banner is a permanent sourced claim, so the flag is explicit.
 */
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

/**
 * The open (backlog) task rows in `rev`'s TREE — never the worktree.
 *
 * ⛔ BOTH ERAS, because ruling W2 put the pre-migration era in scope. Listing directories only
 * (`ls-tree -d`) was wrong for any revision before the task-folder migration: that tree holds flat
 * `<slug>.md` briefs and NO directories, so the counter reported `open 0` / `repair-pct 0.0` at
 * exit 0 for a board that actually held 11 briefs — a FABRICATED share, not an unavailable one.
 * A folder row keys on its `NNNN`; a flat row keys on its filename stem, exactly as `briefIdentity`
 * does, so the classification rule reads the same token in both eras.
 *
 * ⛔ `--full-tree` makes the path root-relative. Without it `ls-tree` resolves it against the
 * caller's cwd — the same silent-zero hazard `repoRoot` exists to close.
 */
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

// --- reporting ------------------------------------------------------------------------------------

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
  // ⭐ THE SELF-CHECK, EVALUATED RATHER THAN MERELY DOCUMENTED. Every task is created once and
  // closed at most once, so `created - closed` MUST equal the number of rows still open. It is the
  // one cheap invariant that catches a whole class of silent corruption from OUTSIDE this file —
  // notably a reader whose git is configured not to detect renames, which re-reports every close as
  // an unrelated add and yields 140 against an open count of 129. `renderReport` refuses to print a
  // report that fails it: a wrong number quoted as measured is worse than no number at all.
  out.push(`reconciliation created-minus-closed ${fold.created - fold.closed} open ${rows.length}`);
  if (migration) {
    out.push(`horizon task-folder-migration ${migration.commit} ${migration.week}`);
    out.push('note the pre-migration era IS counted, by flat-filename identity — no history is discarded');
    out.push('note before that commit a task had no ID, so per-week counts are exact but per-ID drill-down is unavailable');
    // ⛔ THIS NOTE IS COMPUTED, NEVER ASSERTED. It previously read "that commit is a shape change
    // inside one board segment, so it contributes zero closes and zero creations", which is FALSE:
    // the migration commit carries one rename that DOES cross a board segment
    // (`backlog/migrate-tasks-…md` → `done/0062-…/brief.md`), and the counter correctly counts it as
    // one close. Printing a false measured claim in machine-readable output is the exact failure
    // this task exists to prevent, so the numbers now come from the fold rather than from prose.
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
  // ⚠️ A FLAG IS NEVER A VALUE. The old guard only caught a MISSING final argument, so
  // `--at --list` silently bound the revision to the string "--list" and dropped the flag — the user
  // then got a `git rev-parse` failure about an unknown revision instead of the usage error this
  // code intends. Refusing a `--`-prefixed value turns a confusing downstream error into the right
  // one at the point of the mistake.
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

// ⚠️ BOTH `realpathSync` AND `pathToFileURL` ARE LOAD-BEARING, and the naive
// `import.meta.url === \`file://${process.argv[1]}\`` fails on two ordinary paths:
//   - a SYMLINKED path. Node's ESM loader resolves symlinks, so `import.meta.url` is the realpath
//     while argv[1] is what the caller typed. On macOS `/tmp` IS a symlink to `/private/tmp`, so
//     running a copy from `/tmp` matched nothing and the script exited 0 having printed NOTHING —
//     a silent no-output success, the worst possible failure for something a status run quotes.
//   - a path containing a SPACE or `#`. Only `pathToFileURL` percent-encodes it correctly.
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
