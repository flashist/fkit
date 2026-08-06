// The closed-rank immutability guard — task 0182.
//
// THE INVARIANT (0181's rule, second clause): a closed row on a sprint board is NEVER renumbered.
// Once a row's Status starts with ✅ Done, ⛔ Cancelled, or ➡️ Moved, its Priority cell (`P<n>`) is
// frozen: history, not plan. The 0174 filing renumbered EIGHT closed rows in one commit and nothing
// caught it; this suite is what catches the next one.
//
// SCOPE CATEGORY: an invariant over the repo's own `ai-agents/` CONTENT, the category
// test/task-id-uniqueness.test.js declared and recorded (see its header: ADR-014 §2 fenced the scope,
// ADR-017 widened it, ADR-029 pre-authorized the content category). This suite is the same category,
// not a new widening.
//
// WHAT IT WATCHES. Every `sprint-*.md` under ai-agents/sprints/ and ai-agents/sprints/done/, keyed by
// BASENAME so the archival rename (sprint-2.md → done/sprint-2.md) is transparent — an archived board
// stays watched. backlog.md is excluded BY CONSTRUCTION: the Backlog board is unranked by design
// (every Priority cell reads `—`), so it has no rank to hold still.
//
// TWO LIVE LEGS, and their honest ceiling. Leg 1: working tree vs HEAD. Leg 2: HEAD vs HEAD^.
// ⛔ This is NOT continuous protection: there is no CI, so the guard sees only the current
// uncommitted transition plus the last committed one. A breach committed while nobody ran the suite
// in that window is never caught. The vacuous-pass assertion (non-zero closed rows parsed from the
// earlier revision, DERIVED at runtime, never hardcoded) stops a parser change from going green over
// a corpus it stopped reading.
//
// FIXTURES — the 0174 replay. test/fixtures/closed-rank-0174-before.md and -after.md are byte-exact
// copies of ai-agents/sprints/sprint-2.md at, respectively:
//   before: commit ba3619658e0f95116dd2134aa5d5b0953ffd76f2 (parent of the 0174 filing)
//   after:  commit 8540d0315547619611bd7cc8bb8ee94f7f7408fd (the 0174 filing, 2026-08-01)
// Committed as files rather than read via `git show` at runtime because a depth-1 clone does not have
// those commits. Provenance lives HERE, never inside the fixture bytes. Owner ruled 2026-08-06: full
// files, byte-exact (~672KB) — they also exercise the header anchor against real historical boards.
//
// ⚠️ PROVE-RED GAP, stated for the record (owner ruled 2026-08-06: "State the gap"): prove-red.sh
// gains NO mutation for this suite — none of its mutations may reach the real ai-agents/ boards, and
// a copied-tree seam has no .git so this guard would SKIP there, not go red. Named-assertion mutation
// coverage arrives if/when tasks 0214/0215 land. Until then the red proof lives IN-SUITE: the 0174
// fixture replay plus the tmp-git-repo breach test below.
//
// TWO RATIFIED READINGS (owner ruled 2026-08-06, "Ratify both"):
//   1. Pipes inside backtick code spans are MASKED before the field split (a live row quotes
//      `Status: in-review | closed-out` inside a code span); the fail-loud 4-cell throw is the
//      backstop for every shape masking does not cover.
//   2. A closed row ABSENT from the later revision is NOT flagged — the invariant text is "appears
//      with a different rank"; row deletion is a different breach and a different guard's job.
//
// ⚠️ ONE DELIBERATE WIDENING vs the approved plan's parser sketch, recorded here and in the task
// worklog: the plan said rank must match `^P\d+$`, but done/sprint-1.md's Priority cells are the
// bare `1`..`14` of the board's first era (verified on disk: "| ➡️ Moved to [Sprint 2](sprint-2.md)
// … | 1 |"), and one of them carries an annotation ("8 (optional)"). A `^P\d+$` throw would crash
// live leg 1 on a board the plan requires both watched and green. Rank therefore accepts
// `P?<digits>`, optionally followed by one parenthesized annotation — and is compared VERBATIM as a
// string, so immutability semantics are unchanged: any movement (`1`→`2`, `P1`→`P2`, or even
// stripping the annotation from a frozen cell) is still a difference and still flags, which is the
// fail-safe direction. `—` / empty / prose still throw.
//
// READ-ONLY: the repo is never written. Every fixture repo lives under os.tmpdir().

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPO, cleanup } from './harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(HERE, 'fixtures');

const MADE = [];
after(() => MADE.forEach(cleanup));

// ── The pure functions under test ────────────────────────────────────────────────────────────────

const HEADER_ROW = '| Status | Priority | Task | Brief |';
const SEPARATOR = /^\|[\s\-:|]+\|$/;
// Closed ⇔ Status STARTS WITH one of these — live rows carry suffixes ("✅ Done (agent-closed — not
// owner-verified)", "➡️ Moved to [Backlog](../backlog.md)"), so prefix match is the correct reading.
const CLOSED_MARKERS = ['✅ Done', '⛔ Cancelled', '➡️ Moved'];

// Neither placeholder can appear in board text: they are control characters.
const ESC = '\u0000\u0000'; // masks the two-character sequence `\|`
const SPAN = '\u0001'; // masks a bare `|` inside a backtick code span

// Mask every pipe that is CONTENT, not a cell delimiter: first escaped `\|`, then bare pipes inside
// backtick code spans (ratified reading 1). Code spans pair CommonMark-style: a backtick run closes
// only against a run of the SAME length. An unclosed opener leaves the rest of the line masked —
// which breaks the 4-cell shape and lands in parseBoard's THROW, the ratified backstop: loud, never
// silently wrong.
function maskContentPipes(line) {
  const s = line.replaceAll('\\|', ESC);
  let out = '';
  let i = 0;
  let openLen = 0; // length of the run that opened the current span; 0 = outside any span
  while (i < s.length) {
    if (s[i] === '`') {
      let j = i;
      while (j < s.length && s[j] === '`') j++;
      const len = j - i;
      if (openLen === 0) openLen = len;
      else if (len === openLen) openLen = 0;
      out += s.slice(i, j);
      i = j;
    } else {
      out += openLen > 0 && s[i] === '|' ? SPAN : s[i];
      i++;
    }
  }
  return out;
}

function unmask(text) {
  return text.replaceAll(ESC, '\\|').replaceAll(SPAN, '|');
}

// Parse ONE board's Status table → [{ id, status, rank, closed, line }]. Throws on any malformation,
// always naming `sourceName` — a skipped row is a row the guard silently stopped watching, so the
// fail-loud rule is the load-bearing half of this parser.
//
// Anchor: the exact header row, required to appear EXACTLY ONCE in the file (re-measured 2026-08-06:
// exactly one in each live board). Seven live addendum rows carry both a brief link and a `P<n>`
// cell, so any line-shape regex over the whole file is unsafe; the unique-header anchor is the
// defense against those decoys.
function parseBoard(text, sourceName) {
  const lines = text.split('\n');
  const headerAt = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === HEADER_ROW) headerAt.push(i);
  }
  if (headerAt.length !== 1) {
    throw new Error(`${sourceName}: found ${headerAt.length} Status-table header rows ` +
      `(${JSON.stringify(HEADER_ROW)}) — exactly one is required to anchor the parse. With zero the ` +
      'board is unscanned (vacuous green); with two the anchor is ambiguous. Neither may be guessed at.');
  }
  const start = headerAt[0];
  const sep = (lines[start + 1] ?? '').trim();
  if (!SEPARATOR.test(sep)) {
    throw new Error(`${sourceName}: the line after the Status-table header is not a separator row: ` +
      `${JSON.stringify(sep)}`);
  }

  const rows = [];
  const seenIds = new Set();
  // The loop consumes any line whose first non-whitespace character is `|` — NOT only lines that
  // start with `|`. An indented table row must not silently end the table (review R1, owner-ruled):
  // markdown still renders it as a row, so a `startsWith('|')` loop would drop it AND every row
  // after it from the watch with no throw — and an entirely indented later table would parse to
  // zero rows and read as deletion (green). Fail-loud instead.
  for (let i = start + 2; i < lines.length && /^\s*\|/.test(lines[i]); i++) {
    const rowName = `${sourceName} row at line ${i + 1}`;
    if (!lines[i].startsWith('|')) {
      throw new Error(`${rowName}: table row has leading whitespace before its first | — a silently ` +
        'un-parsed row is a row this guard stops watching, so it throws rather than ending the ' +
        `table early: ${lines[i].slice(0, 120)}`);
    }
    // The masking sentinels are control characters and are ENFORCED absent, not assumed (review R2,
    // owner-ruled): a cell containing literal U+0000/U+0001 bytes would survive mask→unmask as a
    // different string and could make a frozen cell compare equal to a changed one.
    if (/[\u0000\u0001]/.test(lines[i])) {
      throw new Error(`${rowName}: row contains a control character (U+0000/U+0001) — these are ` +
        'the parser\'s masking sentinels and may not appear in board text.');
    }
    const cells = maskContentPipes(lines[i]).split('|');
    // A 4-cell row splits into '' + 4 cells + a final piece that is empty (or trailing whitespace).
    if (cells.length !== 6 || cells[0] !== '' || cells[5].trim() !== '') {
      throw new Error(`${rowName}: expected the 4-cell | Status | Priority | Task | Brief | shape, ` +
        `got ${cells.length - 2 >= 0 ? cells.length - 2 : 0} cells after masking content pipes: ` +
        `${unmask(lines[i]).slice(0, 120)} — a mis-fielded row is a row this guard stops watching, ` +
        'so it throws rather than skips.');
    }
    const status = unmask(cells[1]).trim();
    const rank = unmask(cells[2]).trim();
    // Sprint boards are ranked. `P<n>` is the current era; done/sprint-1.md's first era used bare
    // `<n>`, once with an annotation ("8 (optional)") — see the file-header widening note. `—` —
    // the Backlog board's unranked marker — never appears on a sprint board and throws.
    if (!/^P?\d+(?: \([^()]*\))?$/.test(rank)) {
      throw new Error(`${rowName}: Priority cell ${JSON.stringify(rank)} is not a rank ` +
        '(expected P<n>, or the first-era bare <n> with an optional parenthesized annotation).');
    }
    const idMatch = unmask(cells[4]).match(/\/(\d{4})-[^/]*\/brief\.md/);
    if (!idMatch) {
      throw new Error(`${rowName}: Brief cell carries no /<NNNN>-…/brief.md link — without the ` +
        'folder ID the row cannot be joined across revisions.');
    }
    const id = idMatch[1];
    if (seenIds.has(id)) {
      throw new Error(`${sourceName}: folder ID ${id} appears in two rows of one Status table — ` +
        'the cross-revision join would be ambiguous.');
    }
    seenIds.add(id);
    rows.push({
      id,
      status,
      rank,
      closed: CLOSED_MARKERS.some((m) => status.startsWith(m)),
      line: i + 1,
    });
  }
  return rows;
}

// The comparator — the pure function the fixtures feed. Joins strictly WITHIN one basename on folder
// ID (rank is never a key): a row closed in `earlier` that appears in `later` with a different
// Priority cell is a violation.
//
// ➡️ Moved rule: a moved row is closed on its SOURCE board, so its source rank is frozen by this
// ordinary same-board comparison; the destination board's row lives under a different basename and
// is never compared against it (runLeg only ever pairs same-basename texts).
//
// Ratified reading 2: a closed row ABSENT from `later` is NOT flagged — the invariant text is
// "appears with a different rank"; row deletion is a different breach and a different guard's job.
//
// A row that CLOSES between the two revisions is not constrained: the freeze reads from the EARLIER
// revision's status. And a closed row whose status TEXT mutates (e.g. gains the agent-closed marker)
// while its rank holds is fine — only the Priority cell is frozen.
function findRankViolations(earlierText, laterText, boardBasename) {
  const earlier = parseBoard(earlierText, `${boardBasename} (earlier)`);
  const later = parseBoard(laterText, `${boardBasename} (later)`);
  const byId = new Map(earlier.map((r) => [r.id, r]));
  const violations = [];
  for (const r of later) {
    const prev = byId.get(r.id);
    if (!prev || !prev.closed) continue;
    if (prev.rank !== r.rank) {
      violations.push({ id: r.id, board: boardBasename, oldRank: prev.rank, newRank: r.rank });
    }
  }
  return violations;
}

function explainViolations(violations) {
  return 'closed rows changed rank — a closed row is history, not plan, and is NEVER renumbered ' +
    '(0181\'s rule; the invariant this suite guards, task 0182):\n' +
    violations.map((v) => `  ${v.id}: ${v.oldRank} → ${v.newRank} (${v.board})`).join('\n') +
    '\nA row is closed once its Status starts with ✅ Done, ⛔ Cancelled, or ➡️ Moved. See the task ' +
    'brief: ai-agents/tasks/*/0182-build-the-closed-rank-immutability-guard/brief.md.';
}

// ── Board discovery (both legs share the basename key) ───────────────────────────────────────────

const BOARD_NAME = /^sprint-.*\.md$/;
const BOARD_DIRS = ['ai-agents/sprints', 'ai-agents/sprints/done'];

// The working tree's boards, keyed by basename. A basename present at BOTH paths in one revision is
// ambiguous (a half-done archival rename) and throws rather than guessing which copy is the board.
function worktreeBoards(repoRoot) {
  const boards = new Map();
  for (const rel of BOARD_DIRS) {
    const dir = join(repoRoot, rel);
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      if (err.code === 'ENOENT') continue; // a repo without that boards dir has no boards there
      throw new Error(`cannot read ${dir}: ${err.code} — the scan would be silently incomplete`,
        { cause: err });
    }
    for (const e of entries) {
      if (!e.isFile() || !BOARD_NAME.test(e.name)) continue;
      if (boards.has(e.name)) {
        throw new Error(`board ${e.name} present at two paths in the working tree — refusing to ` +
          'guess which copy is the board.');
      }
      boards.set(e.name, readFileSync(join(dir, e.name), 'utf8'));
    }
  }
  return boards;
}

// A committed revision's boards, keyed by basename — same filter, read via git. Any git failure here
// (an unlistable rev, a show error on a listed path) THROWS: a crash is distinguishable from a skip,
// and neither is a pass.
function revBoards(repoRoot, rev) {
  // `-z` (NUL-separated) so filenames arrive RAW (review R3, owner-ruled): without it git C-quotes
  // any non-ASCII filename, which then fails both the BOARD_DIRS and BOARD_NAME filters and drops
  // from the HEAD side silently — an unwatched board with no throw.
  const listing = execFileSync('git', ['ls-tree', '-r', '--name-only', '-z', rev, '--', 'ai-agents/sprints/'],
    { cwd: repoRoot, encoding: 'utf8' });
  const boards = new Map();
  for (const path of listing.split('\0').filter(Boolean)) {
    const base = path.slice(path.lastIndexOf('/') + 1);
    const dir = path.slice(0, path.lastIndexOf('/'));
    if (!BOARD_DIRS.includes(dir) || !BOARD_NAME.test(base)) continue; // e.g. sprints/reviews/*
    if (boards.has(base)) {
      throw new Error(`board ${base} present at two paths in ${rev} — refusing to guess which copy ` +
        'is the board.');
    }
    boards.set(base, execFileSync('git', ['show', `${rev}:${path}`], { cwd: repoRoot, encoding: 'utf8' }));
  }
  return boards;
}

// One leg: pair earlier/later boards by basename and collect violations. A board with no counterpart
// in the later set (renamed outside the sprint-* shape, or deleted) has nothing to compare — board
// removal is a different breach and a different guard, same reasoning as ratified reading 2. The
// closed-row count comes from the EARLIER revision and feeds the vacuous-pass assertion.
function runLeg(earlierBoards, laterBoards) {
  let closedRows = 0;
  const violations = [];
  for (const base of [...earlierBoards.keys()].sort()) {
    const earlierText = earlierBoards.get(base);
    closedRows += parseBoard(earlierText, `${base} (earlier)`).filter((r) => r.closed).length;
    const laterText = laterBoards.get(base);
    if (laterText === undefined) continue;
    violations.push(...findRankViolations(earlierText, laterText, base));
  }
  return { closedRows, violations };
}

// Environment gates for the live legs. Each failed probe is a SKIP with a stated reason — reported
// as skipped, never a silent pass; any other git failure inside a leg still throws.
function gitProbe(repoRoot) {
  const run = (args) => {
    try {
      return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch {
      return null;
    }
  };
  return {
    workTree: run(['rev-parse', '--is-inside-work-tree'])?.trim() === 'true',
    head: run(['rev-parse', '--verify', 'HEAD']) !== null,
    parent: run(['rev-parse', '--verify', '--quiet', 'HEAD^']) !== null,
  };
}

// ── Synthetic-board helpers (tmpdir fixtures only) ───────────────────────────────────────────────

function row(id, { status = '🔲 Planned', rank = 'P1', task = `Task ${id}` } = {}) {
  return `| ${status} | ${rank} | ${task} | [\`${id}-t\`](../../tasks/backlog/${id}-t/brief.md) |`;
}

function boardText(rows, { addendum = '' } = {}) {
  return '# A sprint board\n\nIntro prose.\n\n## Status\n\n' +
    `${HEADER_ROW}\n|---|---|---|---|\n${rows.join('\n')}\n\nPostscript prose.\n${addendum}`;
}

// The decoy shape the anchor must ignore: an addendum table whose rows carry BOTH a brief link AND a
// `P<n>` cell (seven such rows exist on the live boards) — but under a different header.
const DECOY_ADDENDUM = '\n## Addendum\n\n| # | Site | Rank | Brief |\n|---|---|---|---|\n' +
  '| 1 | over there | P3 | [`0999-decoy`](../../tasks/done/0999-decoy/brief.md) |\n';

const GIT_ID = ['-c', 'user.name=fkit-test', '-c', 'user.email=fkit-test@example.invalid',
  '-c', 'commit.gpgsign=false'];

function tmpGitRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-rank-'));
  MADE.push(dir);
  execFileSync('git', ['init', '-q'], { cwd: dir });
  return dir;
}

function commitAll(dir, msg) {
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', [...GIT_ID, 'commit', '-q', '-m', msg], { cwd: dir });
}

// ── Parser tests ─────────────────────────────────────────────────────────────────────────────────

test('parseBoard: anchors on the unique header and ignores decoy addendum tables', () => {
  const text = boardText([row('0001', { status: '✅ Done', rank: 'P1' }), row('0002', { rank: 'P2' })],
    { addendum: DECOY_ADDENDUM });
  const rows = parseBoard(text, 'synthetic');
  assert.deepEqual(rows.map((r) => r.id), ['0001', '0002'],
    'the decoy row (0999, with both a brief link and a P-cell) must not be parsed');
});

test('parseBoard: a file with NO Status-table header throws (vacuous green refused)', () => {
  assert.throws(() => parseBoard('# Just prose\n\nNo table here.\n', 'bare'),
    /bare: found 0 Status-table header rows/);
});

test('parseBoard: a file with TWO Status-table headers throws (ambiguous anchor)', () => {
  const twice = boardText([row('0001')]) + '\n' + boardText([row('0002')]);
  assert.throws(() => parseBoard(twice, 'double'), /double: found 2 Status-table header rows/);
});

test('parseBoard: escaped \\| stays inside its cell', () => {
  const r = `| ➡️ Moved to [Backlog](../backlog.md) | P5 | Uses \\| in prose, twice \\| even | [\`0042-t\`](../../tasks/backlog/0042-t/brief.md) |`;
  const rows = parseBoard(boardText([r]), 'escaped');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, '0042');
  assert.equal(rows[0].rank, 'P5');
  assert.equal(rows[0].closed, true, '➡️ Moved is a closed marker');
});

test('parseBoard: a bare | inside a backtick code span stays inside its cell (ratified reading 1)', () => {
  // The live 0169 row's shape: a schema quoted in a code span, pipe and all.
  const r = '| ✅ Done | P4 | The `Status: in-review | closed-out` schema | [`0169-t`](../../tasks/backlog/0169-t/brief.md) |';
  const rows = parseBoard(boardText([r]), 'span');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, '0169');
  assert.equal(rows[0].rank, 'P4');
});

test('parseBoard: a genuinely mis-fielded row THROWS naming board and row — never skips', () => {
  // A bare pipe outside any code span: 5 cells. This is the anti-vacuous-skip proof.
  const r = '| ✅ Done | P4 | A bare | pipe | [`0042-t`](../../tasks/backlog/0042-t/brief.md) |';
  assert.throws(() => parseBoard(boardText([r]), 'bad'),
    /bad row at line \d+: expected the 4-cell/);
});

test('parseBoard: an unranked (—) or garbage Priority cell throws', () => {
  assert.throws(() => parseBoard(boardText([row('0001', { rank: '—' })]), 'dash'),
    /Priority cell "—" is not a rank/);
  assert.throws(() => parseBoard(boardText([row('0001', { rank: 'high' })]), 'prose'),
    /Priority cell "high" is not a rank/);
});

test('parseBoard: first-era rank forms are accepted (the done/sprint-1.md widening)', () => {
  const rows = parseBoard(boardText([
    row('0001', { status: '✅ Done', rank: '4' }),
    row('0002', { status: '✅ Done', rank: '8 (optional)' }),
  ]), 'era1');
  assert.equal(rows[0].rank, '4');
  assert.equal(rows[1].rank, '8 (optional)', 'compared verbatim: stripping the annotation would flag');
});

test('parseBoard: a row with no brief link throws — the row cannot be joined', () => {
  const r = '| ✅ Done | P4 | No link here | plain text |';
  assert.throws(() => parseBoard(boardText([r]), 'nolink'), /carries no .*brief\.md link/);
});

test('parseBoard: a duplicate folder ID within one table throws (ambiguous join)', () => {
  const text = boardText([row('0042', { rank: 'P1' }), row('0042', { rank: 'P2' })]);
  assert.throws(() => parseBoard(text, 'dup'), /folder ID 0042 appears in two rows/);
});

test('parseBoard: a leading-whitespace table row throws — never silently ends the parse (review R1)', () => {
  const good = row('0001', { status: '✅ Done', rank: 'P1' });
  const indented = '  ' + row('0002', { rank: 'P2' });
  assert.throws(() => parseBoard(boardText([good, indented]), 'indent'),
    /indent row at line \d+: table row has leading whitespace/,
    'an indented row must throw, not drop itself and every row after it from the watch');
});

test('parseBoard: an entirely indented table throws rather than parsing to zero rows (review R1 worst case)', () => {
  // The Codex articulation: indent the whole later table and renumber a closed row — pre-fix the
  // later revision parsed to zero rows and read as deletion (green). The trim()-anchored header is
  // still found; the first indented row must now throw.
  const shifted = boardText([row('0001', { status: '✅ Done', rank: 'P1' })])
    .split('\n').map((l) => (l.startsWith('|') ? ' ' + l : l)).join('\n');
  assert.throws(() => parseBoard(shifted, 'shifted'),
    /shifted row at line \d+: table row has leading whitespace/);
});

test('parseBoard: a row containing a masking-sentinel control character throws (review R2)', () => {
  // U+0000 U+0000 unmasks to \| — a frozen cell of raw NULs could compare equal to a real \| change.
  const nul = `| ✅ Done | P\u0000\u0000 | x | [\`0042-t\`](../../tasks/backlog/0042-t/brief.md) |`;
  assert.throws(() => parseBoard(boardText([nul]), 'nul'), /nul row at line \d+: row contains a control character/);
  const soh = `| ✅ Done | P4 | x\u0001y | [\`0042-t\`](../../tasks/backlog/0042-t/brief.md) |`;
  assert.throws(() => parseBoard(boardText([soh]), 'soh'), /soh row at line \d+: row contains a control character/);
});

test('parseBoard: an empty table parses to zero rows', () => {
  assert.deepEqual(parseBoard(boardText([]).replace('\n\nPostscript', '\nPostscript'), 'empty'), []);
});

// ── Comparator tests ─────────────────────────────────────────────────────────────────────────────

const B = 'sprint-x.md';

test('findRankViolations: a clean transition reports nothing', () => {
  const a = boardText([row('0001', { status: '✅ Done', rank: 'P1' }), row('0002', { rank: 'P2' })]);
  const b = boardText([row('0001', { status: '✅ Done', rank: 'P1' }), row('0002', { rank: 'P2' }),
    row('0003', { rank: 'P3' })]);
  assert.deepEqual(findRankViolations(a, b, B), []);
});

test('findRankViolations: a re-ranked closed row is flagged with old and new rank', () => {
  const a = boardText([row('0001', { status: '✅ Done', rank: 'P1' })]);
  const b = boardText([row('0001', { status: '✅ Done', rank: 'P7' })]);
  assert.deepEqual(findRankViolations(a, b, B),
    [{ id: '0001', board: B, oldRank: 'P1', newRank: 'P7' }]);
});

// THE STEP-2 PROOF (brief verification step 2): the join is on folder ID, never on rank. The closed
// row moves and an OPEN row takes its old rank — the closed row is flagged, the taker is not.
test('findRankViolations: joins on ID, not rank — the rank-taker is not flagged', () => {
  const a = boardText([row('0001', { status: '✅ Done', rank: 'P1' }), row('0002', { rank: 'P2' })]);
  const b = boardText([row('0001', { status: '✅ Done', rank: 'P2' }), row('0002', { rank: 'P1' })]);
  assert.deepEqual(findRankViolations(a, b, B),
    [{ id: '0001', board: B, oldRank: 'P1', newRank: 'P2' }],
    'exactly the closed mover, never the open taker of its old rank');
});

test('findRankViolations: two closed rows swapping ranks are BOTH flagged', () => {
  const a = boardText([row('0001', { status: '✅ Done', rank: 'P1' }),
    row('0002', { status: '⛔ Cancelled', rank: 'P2' })]);
  const b = boardText([row('0001', { status: '✅ Done', rank: 'P2' }),
    row('0002', { status: '⛔ Cancelled', rank: 'P1' })]);
  assert.deepEqual(findRankViolations(a, b, B), [
    { id: '0001', board: B, oldRank: 'P1', newRank: 'P2' },
    { id: '0002', board: B, oldRank: 'P2', newRank: 'P1' },
  ]);
});

test('findRankViolations: an OPEN row re-ranked is not flagged — open rows may move', () => {
  const a = boardText([row('0002', { rank: 'P2' })]);
  const b = boardText([row('0002', { rank: 'P9' })]);
  assert.deepEqual(findRankViolations(a, b, B), []);
});

test('findRankViolations: a row that CLOSES between revisions is not constrained', () => {
  // The freeze reads from the EARLIER revision's status: open before, closed (and moved) after.
  const a = boardText([row('0002', { rank: 'P2' })]);
  const b = boardText([row('0002', { status: '✅ Done', rank: 'P5' })]);
  assert.deepEqual(findRankViolations(a, b, B), []);
});

test('findRankViolations: a status-text mutation with rank held is not flagged', () => {
  const a = boardText([row('0001', { status: '✅ Done', rank: 'P3' })]);
  const b = boardText([row('0001', { status: '✅ Done (agent-closed — not owner-verified)', rank: 'P3' })]);
  assert.deepEqual(findRankViolations(a, b, B), []);
});

test('findRankViolations: a closed row DELETED from the later revision is not flagged (ratified reading 2)', () => {
  const a = boardText([row('0001', { status: '✅ Done', rank: 'P1' }), row('0002', { rank: 'P2' })]);
  const b = boardText([row('0002', { rank: 'P2' })]);
  assert.deepEqual(findRankViolations(a, b, B), [],
    'deletion is a different breach and a different guard');
});

test('runLeg: the same ID on two basenames at different ranks is no violation (the Moved rule)', () => {
  // 0042 was Moved off board a (closed there, rank frozen at P3) and landed on board b at P9.
  // The basename key means the two rows are never compared against each other.
  const earlier = new Map([
    ['sprint-a.md', boardText([row('0042', { status: '➡️ Moved to [Sprint b](sprint-b.md)', rank: 'P3' })])],
  ]);
  const later = new Map([
    ['sprint-a.md', boardText([row('0042', { status: '➡️ Moved to [Sprint b](sprint-b.md)', rank: 'P3' })])],
    ['sprint-b.md', boardText([row('0042', { rank: 'P9' })])],
  ]);
  const { violations } = runLeg(earlier, later);
  assert.deepEqual(violations, []);
});

test('runLeg: a board with no later counterpart has nothing to compare; its closed rows still count', () => {
  const earlier = new Map([['sprint-a.md', boardText([row('0001', { status: '✅ Done', rank: 'P1' })])]]);
  const { closedRows, violations } = runLeg(earlier, new Map());
  assert.equal(closedRows, 1, 'the vacuous-pass count reads the EARLIER revision');
  assert.deepEqual(violations, []);
});

// ── The 0174 replay (brief verification step 3, rewritten as a fixture test) ─────────────────────

test('the 0174 replay: exactly the eight renumbered closed rows, with the measured ranks', () => {
  const before = readFileSync(join(FIXTURES, 'closed-rank-0174-before.md'), 'utf8');
  const after = readFileSync(join(FIXTURES, 'closed-rank-0174-after.md'), 'utf8');
  const violations = findRankViolations(before, after, 'sprint-2.md');
  // Exactly these eight — no more, no fewer — in board order. A ninth flag or a missed one is a
  // comparator defect, not a corpus change: the fixtures are frozen bytes.
  assert.deepEqual(violations, [
    { id: '0151', board: 'sprint-2.md', oldRank: 'P123', newRank: 'P124' },
    { id: '0147', board: 'sprint-2.md', oldRank: 'P125', newRank: 'P126' },
    { id: '0150', board: 'sprint-2.md', oldRank: 'P126', newRank: 'P127' },
    { id: '0157', board: 'sprint-2.md', oldRank: 'P130', newRank: 'P131' },
    { id: '0161', board: 'sprint-2.md', oldRank: 'P131', newRank: 'P132' },
    { id: '0148', board: 'sprint-2.md', oldRank: 'P132', newRank: 'P133' },
    { id: '0159', board: 'sprint-2.md', oldRank: 'P140', newRank: 'P141' },
    { id: '0160', board: 'sprint-2.md', oldRank: 'P141', newRank: 'P142' },
  ]);
});

test('the 0174 fixtures parse in full — the anchor works on real historical boards', () => {
  const before = parseBoard(readFileSync(join(FIXTURES, 'closed-rank-0174-before.md'), 'utf8'), 'before');
  const after = parseBoard(readFileSync(join(FIXTURES, 'closed-rank-0174-after.md'), 'utf8'), 'after');
  // Row counts re-measured at build (2026-08-06). Frozen bytes, so these MAY be hardcoded — unlike
  // the live legs' counts, which are derived because the live corpus moves.
  assert.equal(before.length, 148);
  assert.equal(after.length, 154);
  assert.equal(before.filter((r) => r.closed).length, 124);
});

// ── Git-leg plumbing, against throwaway repos in tmpdir ──────────────────────────────────────────

test('gitProbe: a non-git directory reports no work tree — the legs would SKIP, not pass', () => {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-nogit-'));
  MADE.push(dir);
  const p = gitProbe(dir);
  assert.equal(p.workTree, false);
});

test('gitProbe: a single-commit repo runs leg 1 and skips leg 2 (no HEAD^)', () => {
  const repo = tmpGitRepo();
  mkdirSync(join(repo, 'ai-agents', 'sprints'), { recursive: true });
  writeFileSync(join(repo, 'ai-agents', 'sprints', 'sprint-9.md'),
    boardText([row('0001', { status: '✅ Done', rank: 'P1' }), row('0002', { rank: 'P2' })]));
  commitAll(repo, 'initial board');
  const p = gitProbe(repo);
  assert.equal(p.workTree, true);
  assert.equal(p.head, true);
  assert.equal(p.parent, false, 'leg 2 must skip: HEAD^ does not exist');
  // Leg 1 still runs, and is green: the working tree matches HEAD.
  const { closedRows, violations } = runLeg(revBoards(repo, 'HEAD'), worktreeBoards(repo));
  assert.equal(closedRows, 1);
  assert.deepEqual(violations, []);
});

// THE IN-SUITE RED PROOF (the mutation seam prove-red cannot supply — see the file header's
// prove-red gap statement): a working tree that re-ranks a closed row makes leg 1 report exactly
// that violation.
test('the in-suite red proof: a re-ranked closed row in a working tree goes red at leg 1', () => {
  const repo = tmpGitRepo();
  const dir = join(repo, 'ai-agents', 'sprints');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'sprint-9.md'),
    boardText([row('0001', { status: '✅ Done', rank: 'P1' }), row('0002', { rank: 'P2' })]));
  commitAll(repo, 'initial board');
  // The breach: the closed row 0001 is renumbered P1 → P5 in the working tree.
  writeFileSync(join(dir, 'sprint-9.md'),
    boardText([row('0001', { status: '✅ Done', rank: 'P5' }), row('0002', { rank: 'P2' })]));
  const { violations } = runLeg(revBoards(repo, 'HEAD'), worktreeBoards(repo));
  assert.deepEqual(violations, [{ id: '0001', board: 'sprint-9.md', oldRank: 'P1', newRank: 'P5' }],
    'the guard must go red at exactly this violation, or it guards nothing');
});

test('revBoards: a non-ASCII board filename is listed raw, never C-quoted and silently dropped (review R3)', () => {
  // Without -z, git C-quotes non-ASCII paths ("ai-agents/sprints/sprint-\303\251.md"), which fails
  // both the BOARD_DIRS and BOARD_NAME filters — the board vanishes from the HEAD side with no throw.
  const repo = tmpGitRepo();
  const dir = join(repo, 'ai-agents', 'sprints');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'sprint-é.md'),
    boardText([row('0001', { status: '✅ Done', rank: 'P1' })]));
  commitAll(repo, 'non-ascii board name');
  const boards = revBoards(repo, 'HEAD');
  assert.equal(boards.size, 1, 'the board must be watched on the HEAD side, not silently dropped');
  const [text] = boards.values();
  assert.equal(parseBoard(text, 'accented').length, 1);
});

test('worktreeBoards: one basename at both paths throws — a half-done archival rename', () => {
  const repo = tmpGitRepo();
  mkdirSync(join(repo, 'ai-agents', 'sprints', 'done'), { recursive: true });
  const text = boardText([row('0001', { status: '✅ Done', rank: 'P1' })]);
  writeFileSync(join(repo, 'ai-agents', 'sprints', 'sprint-9.md'), text);
  writeFileSync(join(repo, 'ai-agents', 'sprints', 'done', 'sprint-9.md'), text);
  assert.throws(() => worktreeBoards(repo), /sprint-9\.md present at two paths/);
});

test('worktreeBoards / revBoards: the archival rename is transparent — an archived board stays watched', () => {
  const repo = tmpGitRepo();
  const top = join(repo, 'ai-agents', 'sprints');
  mkdirSync(top, { recursive: true });
  writeFileSync(join(top, 'sprint-9.md'), boardText([row('0001', { status: '✅ Done', rank: 'P1' })]));
  commitAll(repo, 'board at top');
  // The rename — and a breach smuggled into the same move.
  mkdirSync(join(top, 'done'), { recursive: true });
  execFileSync('git', ['mv', 'ai-agents/sprints/sprint-9.md', 'ai-agents/sprints/done/sprint-9.md'],
    { cwd: repo });
  writeFileSync(join(top, 'done', 'sprint-9.md'),
    boardText([row('0001', { status: '✅ Done', rank: 'P2' })]));
  const { violations } = runLeg(revBoards(repo, 'HEAD'), worktreeBoards(repo));
  assert.deepEqual(violations, [{ id: '0001', board: 'sprint-9.md', oldRank: 'P1', newRank: 'P2' }],
    'keyed by basename: the move must not un-watch the board');
});

// ── The live corpus ──────────────────────────────────────────────────────────────────────────────

test('live leg 1: working tree vs HEAD — closed ranks unmoved', (t) => {
  const p = gitProbe(REPO);
  if (!p.workTree) return t.skip('not inside a git work tree — no HEAD to compare the boards against');
  if (!p.head) return t.skip('repo has zero commits — no HEAD revision exists yet');
  const { closedRows, violations } = runLeg(revBoards(REPO, 'HEAD'), worktreeBoards(REPO));
  assert.ok(closedRows > 0,
    'parsed ZERO closed rows from the HEAD boards — the scan is vacuous, not clean. Either the ' +
    'boards moved somewhere discovery does not look, or the parser stopped reading them; teach it ' +
    'the new shape before this guard means anything.');
  assert.deepEqual(violations, [], explainViolations(violations));
});

test('live leg 2: HEAD vs HEAD^ — closed ranks unmoved across the last commit', (t) => {
  const p = gitProbe(REPO);
  if (!p.workTree) return t.skip('not inside a git work tree — no committed revisions to compare');
  if (!p.head) return t.skip('repo has zero commits — no HEAD revision exists yet');
  if (!p.parent) return t.skip('HEAD^ does not exist (depth-1 clone) — leg 2 has no earlier revision; leg 1 still ran');
  const { closedRows, violations } = runLeg(revBoards(REPO, 'HEAD^'), revBoards(REPO, 'HEAD'));
  assert.ok(closedRows > 0,
    'parsed ZERO closed rows from the HEAD^ boards — the scan is vacuous, not clean (see leg 1).');
  assert.deepEqual(violations, [], explainViolations(violations));
});
