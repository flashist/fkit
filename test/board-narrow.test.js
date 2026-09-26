// The `0405` Stage 0 format probe's contract — bin/board-narrow.mjs.
//
// SUBJECT: the filter that re-renders `dashboard.sh`'s `⟦BOARD⟧` into a fixed-width, non-wrapping
// form. ⛔ The probe never edits `dashboard.sh`; assertion F pins that as a fact about the tree rather
// than a promise in a comment.
//
// WHY THESE ASSERTIONS AND NOT A GENERAL SUITE. `0405`'s plan §3 names ONE cost and one recurring
// failure class, and every test below aims at it:
//
//   A — the width table, character by character. ⚠️ `.length` is RIGHT for 🔲 and WRONG for ⛔; both
//       are asserted, because a table that got either backwards would still look plausible.
//   B — ⭐ `⚠️` (U+26A0 + VS16) is 2 columns while BARE U+26A0 is 1. This is the case the plan's §3
//       table OMITS, and it is 34 live occurrences.
//   C — clip() and displayWidth() share one rule. A draft scored VS16's base at 1 in clip and 2 in
//       displayWidth, so every clipped cell holding a `⚠️` over-ran its column by one. This is that
//       regression, pinned.
//   D — ⭐ THE POINT OF THE WHOLE PROBE: over the LIVE board, at four widths, no rendered line exceeds
//       the target width and every data row's columns begin at the same display column. A probe whose
//       own alignment drifts cannot be evidence about alignment.
//   E — an unrecognised version marker REFUSES (exit 3). `dashboard.sh`'s own contract note is
//       "REFUSE, not translate"; this filter is a consumer of that shape and obeys it.
//   F — the probe does not edit its input: `dashboard.sh` is byte-identical to git HEAD after a run.
//
// ⚠️ ADR-014's testing law: `node --test`, zero devDependencies. Nothing here writes into the repo.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { REPO } from './harness.mjs';
import { displayWidth, clip, cell, bareId, plainText, shortStatus, shortOwner, shortNext,
  columnWidths, renderBoard, WIDTH_TABLE } from '../bin/board-narrow.mjs';

const DASHBOARD = join(REPO, 'claude', 'skills', 'fkit-status', 'dashboard.sh');
const BACKLOG = join(REPO, 'ai-agents', 'sprints', 'backlog.md');
const MARKER = '⟦fkit-dashboard v2⟧';

// ⚠️ MEMOISED, and that is a fix rather than a tidy-up. `dashboard.sh` takes ~7.5 s on the live
// 411-task tree; rendering it once per assertion meant three renders, and under `node --test
// test/*.test.js` — where every test file runs concurrently — the third blew a 30 s timeout and the
// file went red for load, not for a defect. Observed 2026-09-21. One render, one generous ceiling.
//
// ⚠️ spawnSync, so the exit status is read off `r.status` DIRECTLY and never through a pipe — the same
// rule the probe's own `--from` path follows.
const DASHBOARD_TIMEOUT_MS = 120000;
let cachedBoard;
function liveBoard() {
  if (cachedBoard === undefined) {
    const r = spawnSync('bash', [DASHBOARD, BACKLOG], { encoding: 'utf8', timeout: DASHBOARD_TIMEOUT_MS });
    assert.equal(r.error, undefined, `dashboard.sh could not be run: ${r.error?.message}`);
    assert.equal(r.status, 0, `dashboard.sh exited ${r.status}: ${r.stderr}`);
    cachedBoard = r.stdout.replace(/\n$/, '');
  }
  return cachedBoard;
}

test('A — the width table: .length is right for 🔲 and wrong for ⛔', () => {
  // Astral emoji: two UTF-16 units, two columns. `.length` happens to agree.
  for (const ch of ['🔲', '🔄', '🚧']) {
    assert.equal(ch.length, 2, `${ch} should be 2 UTF-16 units`);
    assert.equal(displayWidth(ch), 2, `${ch} should be 2 display columns`);
  }
  // BMP emoji: ONE UTF-16 unit, TWO columns. `.length` is wrong by one, every time.
  for (const ch of ['⛔', '✅', '⭐']) {
    assert.equal(ch.length, 1, `${ch} should be 1 UTF-16 unit`);
    assert.equal(displayWidth(ch), 2, `${ch} should be 2 display columns — this is the trap`);
    assert.notEqual(ch.length, displayWidth(ch));
  }
  for (const ch of ['—', '…', '⟨', '⟩', '§', '·', '–', '≥', '↔', '→', '×', '⟦', '⟧']) {
    assert.equal(displayWidth(ch), 1, `${ch} should be 1 display column`);
  }
  assert.equal(displayWidth('abc'), 3);
  assert.equal(displayWidth(''), 0);
});

test('B — ⚠️ is 2 columns, bare ⚠ is 1: the case the plan\'s §3 table omits', () => {
  const withVs = '⚠️';
  const bare = '⚠';
  assert.equal(withVs.length, 2, 'the VS16 sequence is 2 UTF-16 units');
  assert.equal(displayWidth(bare), 1, 'bare U+26A0 is a 1-column text glyph');
  assert.equal(displayWidth(withVs), 2, 'VS16 forces emoji presentation → 2 columns');
  // ⛔ A table built from plan §3 alone scores this 1 + 0 = 1 and drifts every ⚠️ row by a column.
  assert.notEqual(displayWidth(withVs), displayWidth(bare) + displayWidth('️'));
  // VS15 pins a 2-column glyph back to text presentation.
  assert.equal(displayWidth('⛔︎'), 1);
});

test('C — clip() and displayWidth() agree, including across a variation selector', () => {
  // The pinned regression: a cell clipped mid-`⚠️`.
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20]) {
    const s = '⚠️ warning ⛔ stop \u{1F532} box';
    const c = clip(s, n);
    assert.ok(displayWidth(c) <= n, `clip(${n}) produced ${displayWidth(c)} columns: ${JSON.stringify(c)}`);
    assert.equal(displayWidth(cell(s, n)), n, `cell(${n}) must be exactly ${n} columns`);
  }
  // Short enough to pass through untouched.
  assert.equal(clip('abc', 10), 'abc');
  assert.equal(cell('abc', 6), 'abc   ');
  assert.equal(clip('', 5), '');
  // A wide glyph that would straddle the cut is dropped whole and the column padded.
  assert.equal(displayWidth(clip('a\u{1F532}b', 3)), 3);
});

test('D — over the LIVE board, nothing exceeds the width and every column starts square', () => {
  const board = liveBoard();
  assert.ok(board.startsWith(MARKER), 'fixture assumption: the live board carries the v2 marker');

  for (const width of [80, 100, 120, 200]) {
    const out = renderBoard(board, width);
    const lines = out.split('\n');
    const w = columnWidths(width);

    // ⭐ THE CLAIM THE PROBE EXISTS TO MAKE. Not "most lines" — every line.
    for (const line of lines) {
      assert.ok(displayWidth(line) <= width,
        `width ${width}: a line rendered ${displayWidth(line)} columns: ${JSON.stringify(line.slice(0, 80))}`);
    }

    // Column alignment: on every data row the Id column begins at the same display column.
    const idStart = w.status + 1 + w.rank + 1;
    const rows = lines.filter((l) => /^[^─⟦]/.test(l) && /\s\d{4}\s/.test(l));
    assert.ok(rows.length > 100, `width ${width}: expected the live backlog's ~116 rows, got ${rows.length}`);
    for (const row of rows) {
      const prefix = [...row];
      let acc = '';
      let seen = 0;
      for (const ch of prefix) { if (seen >= idStart) break; acc += ch; seen = displayWidth(acc); }
      assert.equal(displayWidth(acc), idStart,
        `width ${width}: a row's Id column does not start at ${idStart}: ${JSON.stringify(row.slice(0, 40))}`);
    }
  }
});

test('D2 — the filter shrinks the board it is given', () => {
  const board = liveBoard();
  const before = board.split('\n').map(displayWidth);
  const after = renderBoard(board, 120).split('\n').map(displayWidth);
  assert.ok(Math.max(...before) > 1000, `fixture assumption: the raw board has very long lines (max ${Math.max(...before)})`);
  assert.equal(after.filter((n) => n > 120).length, 0, 'no filtered line may exceed 120 columns');
  assert.ok(Math.max(...after) <= 120);
});

test('E — an unrecognised version marker REFUSES rather than guessing', () => {
  assert.throws(() => renderBoard('⟦fkit-dashboard v1⟧\n⟦BOARD⟧\n', 120),
    (e) => e.exitCode === 3 && /REFUSE/.test(e.message));
  assert.throws(() => renderBoard('some other tool\n', 120), (e) => e.exitCode === 3);
  // And through the CLI, on a real process, so the exit code is the process's.
  const r = spawnSync(process.execPath, [join(REPO, 'bin', 'board-narrow.mjs')],
    { input: 'not a board\n', encoding: 'utf8' });
  assert.equal(r.status, 3, `expected exit 3, got ${r.status}: ${r.stderr}`);
});

test('F — the probe is a filter: dashboard.sh is unchanged by a run', () => {
  const rel = 'claude/skills/fkit-status/dashboard.sh';
  const before = execFileSync('git', ['hash-object', rel], { cwd: REPO, encoding: 'utf8' }).trim();
  const r = spawnSync(process.execPath, [join(REPO, 'bin', 'board-narrow.mjs'), '--from', BACKLOG, '--width', '120'],
    { cwd: REPO, encoding: 'utf8', timeout: DASHBOARD_TIMEOUT_MS });
  assert.equal(r.status, 0, `probe exited ${r.status}: ${r.stderr}`);
  const after = execFileSync('git', ['hash-object', rel], { cwd: REPO, encoding: 'utf8' }).trim();
  assert.equal(after, before, 'board-narrow must never modify dashboard.sh');
  // ⚠️ And the live board introduces NO codepoint the table does not know. When this goes red, a
  // brief has introduced a new emoji — which is the plan's predicted failure, arriving loudly.
  assert.equal(r.stderr.trim(), '', `unexpected stderr (new codepoints?): ${r.stderr}`);
});

test('G — cell transforms drop what the 51% is made of', () => {
  assert.equal(bareId('[`0013-add-two-worked-examples`](../tasks/backlog/0013-add/brief.md)'), '0013');
  assert.equal(bareId('[`0408-build-the-deterministic-mover`](../x/brief.md)'), '0408');
  assert.equal(bareId('no link here'), 'no link here');          // degrades readably, never to ''
  assert.equal(shortOwner('fkit-coder'), 'coder');
  assert.equal(shortOwner('fkit-producer'), 'producer');
  assert.equal(shortNext('⟨derive: nothing.⟩'), 'nothing.');
  assert.equal(shortNext('⟨derive: `0407` — hard⟩'), '0407 — hard');
  assert.equal(shortStatus('🔲 Backlog'), '🔲 Backlog');
  assert.equal(shortStatus('🚧 Blocked — sequenced behind `0408` (ADR-050)'), '🚧 Blocked');
  assert.equal(plainText('**Build the mover** … `0407`'), 'Build the mover … 0407');
});

// ⭐ WHY THIS EXISTS, stated plainly because the gap it closes is easy to miss. D, D2 and F all measure
// the probe's OUTPUT with the probe's OWN `displayWidth()`. A wrong entry in WIDTH_TABLE therefore
// agrees with itself and all three stay GREEN while the real terminal misaligns — verified by
// mutation on 2026-09-21 (⛔ scored 1 instead of 2: only assertion A went red). This assertion is the
// independent oracle: V8's Unicode database, not a second hand-copied table.
//
// ⛔ IT STILL DOES NOT PROVE THE TERMINAL AGREES. Unicode says ⛔ is Emoji_Presentation; a terminal is
// free to render it in one column anyway, and plan §3 says some do. Only `--calibrate` settles that,
// and only a human can read it.
test('I — every table entry agrees with V8\'s own Unicode database', () => {
  for (const [ch, width] of WIDTH_TABLE) {
    const isEmojiPres = /\p{Emoji_Presentation}/u.test(ch);
    assert.equal(width === 2, isEmojiPres,
      `U+${ch.codePointAt(0).toString(16).toUpperCase()} is scored ${width} but Emoji_Presentation=${isEmojiPres}`);
  }
  // 20 characters measured on the backlog render, less U+FE0F (handled in displayWidth(), not here),
  // plus U+27A1 which the unknown-codepoint warning found on an ARCHIVED board. A change to this
  // number is a change to the corpus and should be made deliberately, not to make a test pass.
  assert.equal(WIDTH_TABLE.size, 21);
});

test('J — no status value is ever elided in the primary scan column', () => {
  // ⛔ The regression this pins: `status: 11` rendered `🔄 In progress` as `🔄 In prog…`. Clipping the
  // column you scan by is worse than the wide board the probe is meant to improve on.
  const w = columnWidths(120);
  for (const s of ['🔄 In progress', '⛔ Cancelled', '🔲 Backlog', '🚧 Blocked', '➡️ Moved', '✅ Done']) {
    assert.ok(displayWidth(s) <= w.status, `${s} is ${displayWidth(s)} columns, Status is ${w.status}`);
    assert.equal(cell(shortStatus(s), w.status).trimEnd(), s, `${s} must survive the Status column intact`);
  }
});

test('H — column budget adds up at every width', () => {
  for (const total of [60, 80, 120, 200, 400]) {
    const w = columnWidths(total);
    const sum = w.status + w.rank + w.task + w.id + w.owner + w.next + 5;
    assert.equal(sum, total, `columnWidths(${total}) sums to ${sum}`);
  }
});
