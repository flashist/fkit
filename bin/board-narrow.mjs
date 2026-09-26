// board-narrow.mjs — the `0405` Stage 0 FORMAT PROBE.
//
//   bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md | node bin/board-narrow.mjs
//   node bin/board-narrow.mjs --from ai-agents/sprints/backlog.md     # ⭐ PREFER THIS — see below
//   node bin/board-narrow.mjs --calibrate                             # the width ruler
//
// WHAT IT IS: a FILTER over `dashboard.sh`'s stdout that re-renders the `⟦BOARD⟧` table into a
// fixed-width, non-wrapping form — link syntax dropped to a bare task id, emphasis stripped, one row
// per line, every cell clipped to the terminal's width. `0405`'s plan §8 Stage 0, owner-ruled Q1
// (2026-09-21): *"this may fix 'hard to read' outright. If it does, the terminal-UI question is
// answered for near-zero cost and the task ends there."*
//
// ⛔ IT NEVER EDITS `dashboard.sh`, AND THAT IS A CONSTRAINT, NOT A PREFERENCE. That script's stdout is
// a machine contract with a live consumer — `bin/fkit-board.mjs` shells out to `dashboard.sh
// select-active` and `test/dashboard-contract.test.js` guards the shape. Everything here is
// downstream of a byte of that output and changes none of it.
//
// ⛔ THIS IS NOT STAGE 1. There is no cursor, no scrolling, no pager, no key handling, no redraw. It
// reads stdin once and writes stdout once. If you are about to add a renderer, you are on the wrong
// task — Stage 1 is unauthorised until Stage 0 is judged.
//
// ⚠️ WHY `--from` IS THE PREFERRED CALL. A shell pipe DISCARDS `dashboard.sh`'s exit code — `$?` is the
// filter's, and a board that failed to render is indistinguishable from an empty one. `--from` spawns
// it with `spawnSync` and reads the status off `r.status` DIRECTLY, never through a pipe, exactly as
// `bin/fkit-board.mjs` does at its own two call sites.

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// ⚠️ IMPORTED, never re-implemented. A second copy of the root walk and the canonical-vs-`.claude`
// fallback would be a second thing to keep true. `fkit-board.mjs` guards its own `main()` on argv[1],
// so importing it starts no server.
import { findRoot, findDashboard } from './fkit-board.mjs';

// ⚠️ The version marker `dashboard.sh` stamps. Its own contract note is explicit that a consumer
// reading an unknown shape REFUSES rather than guesses ("There is no `v1`-compat reader anywhere and
// none is being written: the contract is REFUSE, not translate"). So an unrecognised marker exits 3
// here. Do not soften this into a best-effort parse.
const VERSION_MARKER = '⟦fkit-dashboard v2⟧';

const DASHBOARD_TIMEOUT_MS = 30000;   // matches fkit-board.mjs's guard against a hung render

// The elision marker, with its counting rule stated — `0405` plan §3 records a measurement gap traced
// to "an elision marker that is 4 bytes, not 3", so this file names both numbers rather than leaving
// a reader to assume one. U+2026 HORIZONTAL ELLIPSIS: 3 bytes UTF-8, 1 display column, 1 JS unit.
const ELLIPSIS = '…';

const FALLBACK_WIDTH = 120;
const MIN_WIDTH = 60;

// ── Character width ──────────────────────────────────────────────────────────────────────────────
//
// ⛔ THE WHOLE COST OF THIS FILE IS HERE, and `0405`'s plan §3 says why: "there is no naive count that
// is right for both emoji groups". Measured on the live backlog render (246 lines, 74,980 bytes,
// 2026-09-21 — byte-identical to `0409`'s `after-backlog.txt`), the board uses 21 distinct non-ASCII
// characters, and JS `.length` is CORRECT for 🔲 and WRONG for ⛔ in the same row.
//
// ⚠️ EVERY WIDTH BELOW IS DERIVED FROM UNICODE PROPERTIES, NOT MEASURED IN THE OWNER'S TERMINAL. The
// plan is emphatic about the difference, and terminals genuinely disagree about the BMP emoji.
// `--calibrate` prints the ruler that settles it; correct this table from what it shows.
//
// ⚠️ EXPORTED so the test can cross-check every entry against V8's OWN Unicode database
// (`\p{Emoji_Presentation}`) rather than against a second hand-copied table. That catches a typo here
// — it does NOT catch a terminal that disagrees with Unicode, which only the ruler can.
export const WIDTH_TABLE = new Map([
  // Width 2 — Emoji_Presentation=Yes. ⚠️ The first three are ASTRAL, so `.length` is 2 and happens to
  // be right; the last three are BMP, so `.length` is 1 and is WRONG. Same table, opposite errors.
  ['\u{1F532}', 2],  // 🔲  119 live
  ['\u{1F504}', 2],  // 🔄   14 live
  ['\u{1F6A7}', 2],  // 🚧    3 live
  ['\u{26D4}', 2],   // ⛔   42 live  ← .length says 1
  ['\u{2705}', 2],   // ✅   18 live  ← .length says 1
  ['\u{2B50}', 2],   // ⭐    6 live  ← .length says 1

  // ⚠️ U+26A0 is Emoji_Presentation=NO — BARE it is a 1-column text glyph. It reaches 2 columns only
  // because a VARIATION SELECTOR follows it, which is handled in displayWidth() below, not here.
  //
  // ⛔ THIS IS A CORRECTION TO THE PLAN'S §3 TABLE, made by measuring rather than inheriting. That
  // table lists U+FE0F as a row of its own ("bare variation selector, 34 live occurrences") and omits
  // U+26A0 entirely. On the live corpus there is NO bare U+FE0F: all 34 occurrences follow U+26A0 and
  // nothing else, and there are ZERO bare U+26A0. A table built from §3 alone scores `⚠️` as 1 + 0 = 1
  // column; it renders as 2 wherever VS16 is honoured. Every `⚠️` on the board would drift one column.
  ['\u{26A0}', 1],   // ⚠   34 live, always followed by U+FE0F
  // ⭐ ADDED AFTER THE TABLE WAS FIRST WRITTEN, AND BY THE WARNING BELOW RATHER THAN BY INSPECTION.
  // The first draft was built from the BACKLOG board alone and did not contain this. Sweeping all 11
  // sprint boards, `ai-agents/sprints/done/sprint-2.md` tripped the unknown-codepoint report on
  // 2026-09-21: `➡️ Moved` is a status that appears on archived boards and nowhere on the open ones.
  // ⛔ This is the plan's predicted failure arriving on schedule — a hand-written board introducing a
  // character the table does not know — and it is the evidence that the loud channel earns its keep.
  // (The fallback happened to guess 1 correctly here; that is luck, not a reason to rely on it.)
  ['\u{27A1}', 1],   // ➡   archived boards only, always followed by U+FE0F

  // Width 1 — unambiguous, `.length` is right for all of these.
  ['\u{2014}', 1],   // —  295 live
  ['\u{27E8}', 1],   // ⟨  116
  ['\u{27E9}', 1],   // ⟩  116
  ['\u{2026}', 1],   // …  113
  ['\u{00A7}', 1],   // §   12
  ['\u{27E6}', 1],   // ⟦    4
  ['\u{27E7}', 1],   // ⟧    4
  ['\u{00B7}', 1],   // ·    4
  ['\u{2013}', 1],   // –    3
  ['\u{2265}', 1],   // ≥    1
  ['\u{2194}', 1],   // ↔    1
  ['\u{2192}', 1],   // →    1
  ['\u{00D7}', 1],   // ×    1
]);

const VS16 = '\u{FE0F}';   // forces EMOJI presentation on the preceding base → 2 columns
const VS15 = '\u{FE0E}';   // forces TEXT presentation on the preceding base → stays 1 column
const ZWJ  = '\u{200D}';

// ⚠️ THE FALLBACK, AND WHY IT IS LOUD. A codepoint not in the table above is guessed at from these
// ranges — and `0405`'s plan names the real finding precisely here: "briefs are hand-written, so the
// first new emoji misaligns SILENTLY. That silent-failure property is the recurring class, not the
// table." So this probe refuses to be silent: every fallback resolution is recorded and reported on
// stderr unless `--quiet` is passed. The misalignment still happens; what changes is that you find
// out. It is not a fix, and must not be reported as one.
const WIDE_RANGES = [
  [0x1100, 0x115F], [0x2E80, 0x303E], [0x3041, 0x33FF], [0x3400, 0x4DBF],
  [0x4E00, 0x9FFF], [0xA000, 0xA4CF], [0xAC00, 0xD7A3], [0xF900, 0xFAFF],
  [0xFE30, 0xFE6F], [0xFF00, 0xFF60], [0xFFE0, 0xFFE6],
  [0x1F300, 0x1F64F], [0x1F680, 0x1F6FF], [0x1F900, 0x1F9FF], [0x1FA70, 0x1FAFF],
];

// ⚠️ A SET, not a counter, and deliberately so. `displayWidth()` is called several times over the same
// string (clip, then cell's padding), so any occurrence tally here would be a multiple of the truth —
// and a wrong number reported confidently is the exact failure `0405` plan §3 catalogues four times.
// The DISTINCT codepoints are the finding; how often each appears is not claimed.
const unknownSeen = new Set();

function isWideByRange(cp) {
  for (const [lo, hi] of WIDE_RANGES) if (cp >= lo && cp <= hi) return true;
  return false;
}

// The width of ONE codepoint, with no knowledge of its neighbours.
function codepointWidth(ch) {
  const cp = ch.codePointAt(0);
  if (cp < 0x7F) return cp < 0x20 ? 0 : 1;              // ASCII; control chars contribute nothing
  if (ch === VS16 || ch === VS15 || ch === ZWJ) return 0;
  const known = WIDTH_TABLE.get(ch);
  if (known !== undefined) return known;
  // Combining marks occupy no column of their own.
  if (cp >= 0x0300 && cp <= 0x036F) return 0;
  if (cp >= 0xFE00 && cp <= 0xFE0F) return 0;           // the rest of the variation selectors
  unknownSeen.add(cp.toString(16).toUpperCase().padStart(4, '0'));
  return isWideByRange(cp) ? 2 : 1;
}

// ⚠️ Iterates by CODEPOINT (`for…of` on a string), not by `.length`, and folds the variation selectors
// into the base they modify. VS16 after a 1-column base UPGRADES it to 2; VS15 pins it at 1. This is
// the only place `⚠️` gets its second column, which is why the table above can list U+26A0 as 1.
export function displayWidth(str) {
  let w = 0;
  let prevWidth = 0;
  for (const ch of str) {
    if (ch === VS16) { if (prevWidth === 1) { w += 1; prevWidth = 2; } continue; }
    if (ch === VS15) { if (prevWidth === 2) { w -= 1; prevWidth = 1; } continue; }
    const cw = codepointWidth(ch);
    w += cw;
    prevWidth = cw;
  }
  return w;
}

// Clip to `cols` DISPLAY columns, marking the cut. ⚠️ Never splits a codepoint, and never leaves a
// 2-column glyph half-in: a wide char that would straddle the boundary is dropped whole and the
// leftover column is padded, so the column edge holds even mid-emoji.
//
// ⛔ THIS MUST ACCOUNT FOR THE VARIATION SELECTORS EXACTLY AS `displayWidth()` DOES, and an earlier
// draft of this file did not — it scored VS16 as 0 and left its base at 1, so `⚠️` measured 1 here and
// 2 there. `cell()` pads on `displayWidth`, so every clipped cell containing a `⚠️` over-ran its
// column by one and shifted the whole rest of the row. The two functions share one rule or the
// alignment this probe exists to test is wrong in the probe itself.
export function clip(str, cols) {
  if (cols <= 0) return '';
  if (displayWidth(str) <= cols) return str;
  const budget = cols - 1;   // one column reserved for ELLIPSIS
  let out = '';
  let w = 0;
  let prevWidth = 0;
  for (const ch of str) {
    if (ch === VS16) {
      // The selector upgrades the base already emitted. If that upgrade would overflow, stop BEFORE
      // the selector — the base stays in at its narrow width, which is what will actually render.
      if (prevWidth === 1) {
        if (w + 1 > budget) break;
        w += 1;
        prevWidth = 2;
      }
      out += ch;
      continue;
    }
    if (ch === VS15) {
      if (prevWidth === 2) { w -= 1; prevWidth = 1; }
      out += ch;
      continue;
    }
    const cw = codepointWidth(ch);
    if (w + cw > budget) break;
    out += ch;
    w += cw;
    prevWidth = cw;
  }
  return out + ' '.repeat(budget - w) + ELLIPSIS;
}

// Pad to exactly `cols` display columns. Clips first, so the return is always `cols` wide.
export function cell(str, cols) {
  const c = clip(str, cols);
  return c + ' '.repeat(Math.max(0, cols - displayWidth(c)));
}

// ── Cell transforms — what actually gets dropped ─────────────────────────────────────────────────
//
// ⚠️ Measured shares of the render, from `0405` plan §4: Filename 26.4%, Next step 24.7%, Task 16.1%.
// Filename and Next step are 51% together and `0409` touched neither. These four functions are aimed
// at that 51%; nothing here re-does `0409`'s work on the Task cell.

// `[`0013-add-two-worked-examples…`](../tasks/backlog/0013-…/brief.md)` → `0013`.
// ⚠️ Falls back to the link TEXT, then to the raw cell — an unparseable row degrades to something
// readable rather than to an empty column. A blank Filename cell would be indistinguishable from a
// row that genuinely has none.
export function bareId(s) {
  const link = /\[`?([^`\]]+)`?\]\([^)]*\)/.exec(s);
  const text = link ? link[1] : s.replace(/[`*]/g, '').trim();
  const id = /^(\d{4})\b/.exec(text);
  return id ? id[1] : text;
}

// `**Build the mover outcome verifier** …` → `Build the mover outcome verifier …`
export function plainText(s) {
  return s.replace(/\[`?([^`\]]+)`?\]\([^)]*\)/g, '$1')   // links → their text
    .replace(/\*\*/g, '').replace(/[`*]/g, '')
    .replace(/\s+/g, ' ').trim();
}

// `🚧 Blocked — sequenced behind `0408` (ADR-050's…)` → `🚧 Blocked`.
// ⚠️ The emoji is KEPT ON PURPOSE. Dropping it would make every column align trivially and would dodge
// the exact hazard this probe exists to expose. Cut at the first em-dash separator; clipping does the
// rest for a status with no separator.
export function shortStatus(s) {
  return plainText(s.split(' — ')[0]);
}

// `fkit-coder` → `coder`. The `fkit-` prefix is 5 columns, recovered on every one of the backlog
// board's 116 rows and identical on all of them, so it carries no information.
export function shortOwner(s) {
  return plainText(s).replace(/^fkit-/, '');
}

// `⟨derive: nothing.⟩` → `nothing.`
export function shortNext(s) {
  const t = plainText(s);
  const m = /^⟨\s*derive:\s*([\s\S]*?)\s*⟩$/.exec(t);
  return m ? m[1] : t.replace(/^⟨\s*/, '').replace(/\s*⟩$/, '');
}

// ── Layout ───────────────────────────────────────────────────────────────────────────────────────

// ⚠️ Column order is dashboard.sh's, UNCHANGED, and that is deliberate. Putting the bare id first
// would read better — and would make the side-by-side capture compare two variables at once instead
// of one. The probe changes the FORM, not the order; reordering is Stage 1's to argue for.
//
// ⚠️ `status: 14` IS MEASURED, not chosen. The first draft used 11, which rendered Sprint 11's only
// in-progress row as `🔄 In prog…` — clipping the PRIMARY SCAN COLUMN, which is worse than the wide
// board it replaces. Measured across every status the live boards actually carry: `🔄 In progress`
// 14, `⛔ Cancelled` 12, `🔲 Backlog` 10, `🚧 Blocked` 10, `➡️ Moved` 8, `✅ Done` 7. 14 is the max,
// so no status is ever elided. ⛔ Counted in DISPLAY COLUMNS — the emoji is 2 of them, not 1.
const FIXED = { status: 14, rank: 4, id: 4, owner: 9 };

export function columnWidths(total) {
  const gaps = 5;   // one space between six columns
  const flex = total - (FIXED.status + FIXED.rank + FIXED.id + FIXED.owner + gaps);
  const task = Math.ceil(flex * 0.55);
  return { ...FIXED, task, next: flex - task };
}

function splitRow(line) {
  // `| a | b | … |` → the cells. Trailing/leading pipe removed, then split on ` | `.
  const inner = line.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
  return inner.split('|').map((c) => c.trim());
}

export function renderBoard(text, total) {
  const lines = text.split('\n');
  if (lines[0] !== VERSION_MARKER) {
    const err = new Error(`board-narrow: expected ${VERSION_MARKER} on line 1, got ${JSON.stringify(lines[0] ?? '')}. `
      + 'dashboard.sh\'s contract is REFUSE on an unknown shape, not translate — this filter will not guess at it.');
    err.exitCode = 3;
    throw err;
  }
  const w = columnWidths(total);
  if (w.task < 10 || w.next < 10) {
    const err = new Error(`board-narrow: --width ${total} leaves no room for the flexible columns (min ${MIN_WIDTH}).`);
    err.exitCode = 2;
    throw err;
  }

  const out = [];
  let inBoard = false;
  let headerDone = false;

  for (const line of lines) {
    if (line === '⟦BOARD⟧') { inBoard = true; continue; }
    if (line === '⟦FACTS⟧' || line === '⟦END⟧') { inBoard = false; out.push(clip(line, total)); continue; }
    if (line === VERSION_MARKER) { out.push(line); continue; }

    if (inBoard && line.startsWith('|')) {
      const c = splitRow(line);
      if (c.length < 6) { out.push(clip(line, total)); continue; }
      if (/^-+$/.test(c[0])) continue;                       // the markdown separator row: dropped
      if (!headerDone) {
        headerDone = true;
        out.push([cell('Status', w.status), cell('#', w.rank), cell('Task', w.task),
          cell('Id', w.id), cell('Owner', w.owner), cell('Next step', w.next)].join(' ').trimEnd());
        out.push('─'.repeat(total));
        continue;
      }
      out.push([
        cell(shortStatus(c[0]), w.status),
        cell(plainText(c[1]), w.rank),
        cell(plainText(c[2]), w.task),
        cell(bareId(c[3]), w.id),
        cell(shortOwner(c[4]), w.owner),
        cell(shortNext(c[5]), w.next),
      ].join(' ').trimEnd());
      continue;
    }
    // The roll-up line, the blank lines, and every `⟦FACTS⟧` line: clipped, never wrapped.
    out.push(clip(line, total));
  }
  return out.join('\n');
}

// ── The width ruler ──────────────────────────────────────────────────────────────────────────────
//
// ⛔ READ THIS BEFORE TRUSTING ANY NUMBER IN `WIDTH_TABLE`. The table is DERIVED from Unicode
// properties. `0405`'s plan is explicit that the figures were "not measured in his terminal" and that
// "the design must measure them there" — and that for ⛔ ✅ ⭐ "terminals themselves genuinely
// disagree, so this is not 'use the right table'".
//
// HOW TO READ IT: each row prints five copies of one character followed by `|`. The reference row is
// ten ASCII `#`. If the `|` lands exactly under the reference's right edge, that character is 2
// columns. If it lands halfway, it is 1. Anywhere else, the terminal is doing something this probe
// does not model — write down what you see and correct the table.
//
// ⚠️ An automatic probe (ANSI DSR `ESC[6n` cursor-position report) WAS considered and deliberately NOT
// shipped: it needs raw mode on a real tty, this probe was built where `[ -t 1 ]` is false, and an
// untested raw-mode read can wedge a terminal. A ruler cannot. The trade is five seconds of the
// owner's eyes against a failure mode nobody could test.
const CALIBRATION_SET = [
  ['U+26D4', '⛔', 'BMP emoji — .length says 1, table says 2'],
  ['U+2705', '✅', 'BMP emoji — .length says 1, table says 2'],
  ['U+2B50', '⭐', 'BMP emoji — .length says 1, table says 2'],
  ['U+1F532', '🔲', 'astral emoji — .length says 2, table says 2'],
  ['U+1F504', '🔄', 'astral emoji — .length says 2, table says 2'],
  ['U+1F6A7', '🚧', 'astral emoji — .length says 2, table says 2'],
  ['U+26A0 FE0F', '⚠️', 'base + VS16 — ⛔ ABSENT FROM THE PLAN\'S TABLE; table says 2'],
  ['U+26A0', '⚠', 'the SAME base, bare — table says 1. If these two rows differ, VS16 is honoured.'],
  ['U+27E8', '⟨', 'table says 1'],
  ['U+2014', '—', 'table says 1'],
];

function calibrate(write) {
  write('board-narrow --calibrate — measure these in YOUR terminal; the table in this file is derived,\n');
  write('not measured. Five copies of each character, then a `|`. Compare against the reference row.\n\n');
  write(`  ${'reference'.padEnd(16)} ##########|   ← the | here is at column 11\n`);
  write(`  ${' '.repeat(16)} 1234567890\n\n`);
  for (const [name, ch, note] of CALIBRATION_SET) {
    write(`  ${name.padEnd(16)} ${ch.repeat(5)}|   ${note}\n`);
  }
  write('\n  | under column 11 → 2 display columns.  | under column  6 → 1 display column.\n');
  write(`  This build's derived widths: ${CALIBRATION_SET.map(([n, ch]) => `${n}=${displayWidth(ch)}`).join('  ')}\n`);
}

// ── main ─────────────────────────────────────────────────────────────────────────────────────────

function arg(argv, name) {
  const eq = argv.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

export function resolveWidth(argv, columns) {
  const flag = arg(argv, '--width');
  if (flag !== undefined) {
    const n = Number(flag);
    if (!Number.isInteger(n) || n < MIN_WIDTH) return { error: `--width must be an integer ≥ ${MIN_WIDTH}, got ${JSON.stringify(flag)}` };
    return { width: n, how: 'the --width flag' };
  }
  if (Number.isInteger(columns) && columns >= MIN_WIDTH) return { width: columns, how: 'process.stdout.columns' };
  return { width: FALLBACK_WIDTH, how: `the ${FALLBACK_WIDTH}-column fallback (stdout is not a tty)` };
}

function main(argv) {
  const out = (s) => process.stdout.write(s);
  const err = (s) => process.stderr.write(s);

  if (argv.includes('--help') || argv.includes('-h')) {
    err('board-narrow.mjs — 0405 Stage 0 format probe (a filter over dashboard.sh; never edits it)\n'
      + '  --from <sprint-plan>   run dashboard.sh and filter it (exit code read directly, not via a pipe)\n'
      + '  --width <n>            target display width (default: stdout.columns, else 120)\n'
      + '  --calibrate            print the character-width ruler and exit\n'
      + '  --quiet                suppress the unknown-codepoint report on stderr\n'
      + '  (no --from)            read dashboard.sh output on stdin\n');
    return 0;
  }

  if (argv.includes('--calibrate')) { calibrate(out); return 0; }

  const w = resolveWidth(argv, process.stdout.columns);
  if (w.error) { err(`board-narrow: ${w.error}\n`); return 2; }

  let text;
  const from = arg(argv, '--from');
  if (from !== undefined) {
    if (!from || from.startsWith('--')) { err('board-narrow: --from needs a path to a sprint plan\n'); return 2; }
    const dashboard = findDashboard(findRoot());
    // ⚠️ spawnSync, so the exit code is read off `r.status` DIRECTLY. A pipe would replace it with this
    // filter's own, and a board that failed to render would look like a board with no rows.
    const r = spawnSync('bash', [dashboard, from], { encoding: 'utf8', timeout: DASHBOARD_TIMEOUT_MS });
    if (r.error) { err(`board-narrow: dashboard.sh could not be run: ${r.error.message}\n`); return 2; }
    if (r.status !== 0) {
      err(`board-narrow: dashboard.sh exited ${r.status} — not filtering a failed render.\n${r.stderr ?? ''}`);
      return r.status;
    }
    text = r.stdout;
  } else {
    text = readFileSync(0, 'utf8');
  }

  let rendered;
  try {
    rendered = renderBoard(text.replace(/\n$/, ''), w.width);
  } catch (e) {
    err(`board-narrow: ${e.message}\n`);
    return e.exitCode ?? 1;
  }
  out(`${rendered}\n`);

  // ⚠️ THE LOUD FAILURE. A codepoint the table does not know was guessed at from a range; on the live
  // board that set is EMPTY, and the first hand-written brief to introduce a new emoji is what puts
  // something here. Reported on stderr so it cannot be lost in a redirect of stdout.
  if (!argv.includes('--quiet') && unknownSeen.size > 0) {
    const list = [...unknownSeen].map((cp) => `U+${cp}`).join(' ');
    err(`board-narrow: ${unknownSeen.size} codepoint(s) not in WIDTH_TABLE — width GUESSED, columns may drift: ${list}\n`);
  }
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const code = main(process.argv.slice(2));
  if (code !== 0) process.exit(code);
}
