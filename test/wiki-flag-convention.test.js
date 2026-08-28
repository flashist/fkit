// The wiki completion-flag convention guard — task 0154.
//
// THE RULE THIS FILE GUARDS. All three fkit-wiki skills (`fkit-wiki-ingest`, `fkit-wiki-sync`,
// `fkit-wiki-lint`) carry one shared block of prose: the wiki closes nothing and moves no task file,
// it emits a *flag* instead, and the flag has an exact two-line form the caller carries verbatim.
// Since ADR-033 the task movers are the producer's alone. The block is duplicated in three files and
// nothing in the repo reconciled the copies, so a reword in one — or a deletion in all three — landed
// silently. This file pins five subjects in all three copies and proves the three blocks are the same
// text modulo one uniform indent offset.
//
// SCOPE: the FOURTH test-scope category — an invariant over the repo's own shipped content rather
// than over product behavior — as established by test/task-id-uniqueness.test.js's header and reused
// by test/skill-frontmatter.test.js. Cited, not re-argued; ADR-014 governs the mechanics (node --test,
// zero devDependencies, hand-rolled). This is a further instance of that fourth category, not a fifth.
//
// ORIGIN. Task 0125 landed the convention as prose. Task 0153 rewrote it, and then task 0173 rewrote
// it again — and 0173 REVERSED one of 0153's two deliverables: 0153 required both flag lines to carry
// a brief path (`ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`); 0173 removed it, moving the path
// lookup to the caller, and says so in the block's own last sentence ("The flag carries the ID only;
// that one lookup is the caller's, and it is what stops the flag rotting when the folder moves
// boards."). ⚠️ A guard written from 0153's brief description would have pinned a string that does not
// exist. That is why every constant below was derived from the text on disk, and why the next editor
// of this file must re-derive rather than trust any quotation in a brief, a plan, or this comment.
//
// THE NEAR-MISS THIS FILE EXISTS TO PREVENT. Task 0125's own check 4 anchored on
// `/The wiki \*\*closes nothing/` while the text reads `**The wiki closes nothing` — the asterisks sit
// before "The", not before "closes". It matched zero lines in all three files, compared three EMPTY
// extractions, found them equal, and printed `UNIFORM`. It was caught by chance at build time. Hence
// extractBlock() below THROWS rather than returning empty, and hence a minimum line count.
//
// ⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT — read this before trusting a green run.
//   1. It guards SOURCE TEXT, never EMITTED FORM. All five strings were present, unchanged, throughout
//      the 2026-07-29 task 0141 deviation — so THIS TEST WOULD HAVE BEEN GREEN FOR ITS ENTIRE
//      DURATION. It cannot see whether a run actually emitted the flag. Where an emitted-form check
//      can live is task 0165, still open. Do not read this file as covering 0141's failure mode.
//   2. It reads `claude/skills/` ONLY. The `.claude/skills/` mirrors are gitignored copies refreshed
//      by claude/fkit-claude-init.sh; asserting against them would make the suite depend on whether
//      init has run. No `.claude/` path appears anywhere in this file, and the paths are explicit, so
//      no glob can wander into the mirror. It passes in a fresh clone — ⚠️ an LF checkout, which is
//      the qualification that belongs here (round-2 review R10, owner-ruled a residual 2026-08-28).
//      On a CRLF checkout the raw assertions T1/T2 go RED, because countWholeLines() compares whole
//      lines and every line keeps a trailing \r. That is a false RED and never a false green — this
//      guard can only OVER-report drift, never hide it — and T7 was already CRLF-red before this file
//      pinned anything. fkit states no CRLF policy and ships no .gitattributes; a CRLF checkout is
//      not a supported state, so the matcher is deliberately NOT loosened. See review.md's accepted
//      residuals for the re-raise condition.
//   3. It asserts five subjects are PRESENT and the three copies are UNIFORM. It does not verify the
//      block is correct, complete, current, or followed by anything at runtime.
//   4. test/skill-frontmatter.test.js records a standing limitation — "A skill's BODY ... remains
//      untested by anything in this repo". That is now PARTLY false: this file and
//      test/structure-repair.test.js each test one specific body. It remains true in general.
//      ⚠️ Do NOT read a green run here as coverage of skill behaviour.
//
// TWO MATCH MODES, DELIBERATELY — do not "simplify" this to one.
//   * BYTE-EXACT WHOLE LINE (raw) for A1/A2, the two flag lines. These are the contract a caller
//     "carries verbatim"; 0153 verification step 1 requires them byte-identical across the three
//     files. They are single-line and cannot legitimately wrap. Rewording one SHOULD go red — that is
//     the point. ⚠️ It is whole-LINE equality, not a substring count, and the difference is measured:
//     under a substring count, appending ` (deprecated — use the new form)` after the closing backtick
//     in all three files left the suite green while the contract line visibly changed. Only the
//     LEADING indent is tolerated (sync sits at a smaller one); trailing text and trailing whitespace
//     are not.
//   * WHITESPACE-NORMALIZED (flat) for A3/A4/A5. These are prose sentences that already wrap and will
//     re-wrap on any nearby edit. ⚠️ MEASURED 2026-08-28 on the live text: a raw matcher finds A3 and
//     A5 ZERO times in all three files — six false negatives on rules that are right there. Anyone
//     "simplifying" A3/A5 to raw matching makes T3 and T5 red on the UNMUTATED tree, so `npm test`
//     catches the change immediately; this note is why, not merely that.
//
// NO `path:NNN` COORDINATES ANYWHERE. Per conventions/durable-citation-anchors.md, every anchor here
// is quoted text, and that is not theoretical: the block has already MOVED once since task 0153
// recorded where its two flag lines sat, so coordinates pinned then would already be wrong today.
// Tasks are cited by their NNNN prefix only.
//
// ⚠️ IF THE BLOCK EVER ACQUIRES A FOURTH HOME — a new fkit-wiki skill, or a dual-homed copy under
// claude/scaffold/ — THIS FILE MUST BE TAUGHT IT. Checked at build time: the block lives in exactly
// these three files and claude/scaffold/ holds no skills/ tree, so test/dual-home-parity.test.js is
// not implicated. T0 goes red first if a fourth fkit-wiki-* skill appears.
//
// THE REUSABLE PATTERN, NAMED SO THE NEXT TASK CAN COPY IT (task 0154 ND-3: file nothing, build no
// framework). This file is deliberately single-purpose — three named paths, hand-written constants,
// no shared helper module, no generalized extractor, no second consumer. What generalizes is the
// method: (1) two match modes, byte-exact for verbatim contract text and normalized for prose that
// will re-wrap — choosing wrong in either direction is a real defect; (2) extract-and-GATE before
// comparing — anchors found, ordered, and a minimum line count, throwing rather than passing on an
// empty extraction; (3) relative-dedent comparison for the same text duplicated at different nesting
// depths. Copy the method; do not grow this file into an instrument.
//
// THIS TEST READS THE REPO, read-only, and writes nothing anywhere — every fixture below is an
// in-memory array of strings, so not even os.tmpdir() is touched. harness.mjs's rule ("nothing here
// writes into the repo") is intact.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

// FKIT_WIKI_FLAG_ROOT lets the red-gate (prove-red.sh) point this suite at a deliberately-broken COPY
// of claude/ without touching the real tree — the same whole-directory seam FKIT_FRONTMATTER_ROOT
// provides for the frontmatter suite (not a single-file redirect: three files are read).
// ⚠️ Announce a non-default root to stderr, same reasoning as harness.mjs's FKIT_LAUNCHER guard: a
// STALE inherited FKIT_WIKI_FLAG_ROOT would otherwise make `npm test` silently audit some other tree
// and report green while the real skills have drifted.
const DEFAULT_ROOT = join(REPO, 'claude');
const ROOT = process.env.FKIT_WIKI_FLAG_ROOT || DEFAULT_ROOT;
if (ROOT !== DEFAULT_ROOT) {
  process.stderr.write(`[wiki-flag-convention.test.js] ⚠ auditing NON-default tree via FKIT_WIKI_FLAG_ROOT: ${ROOT}\n`);
}

// ── The three copies, named explicitly (task 0154 ND-1: this task adds no SKILL.md walk) ──────────
//
// Three named paths, not a directory walk. 0136's private walk stays private and untouched; task
// 0152 remains free to extract a shared one. T0's readdir below is a ROSTER pin, not a walk: it reads
// one directory to prove this list is complete, and never sources the list from it.

const SKILLS = ['fkit-wiki-ingest', 'fkit-wiki-sync', 'fkit-wiki-lint'];
const pathFor = (name) => join(ROOT, 'skills', name, 'SKILL.md');
const labelFor = (name) => `claude/skills/${name}/SKILL.md`;

// The R2 lesson test/skill-frontmatter.test.js records for the task-id guard: UNREADABLE is not the
// same as ABSENT. A read error propagates carrying the path, and is never swallowed into "not found"
// — which, for a presence assertion, would look exactly like the drift this file hunts.
function readSkill(name) {
  const p = pathFor(name);
  try {
    return readFileSync(p, 'utf8');
  } catch (err) {
    throw new Error(`cannot read ${p}: ${err.code} — this guard would otherwise report the text as ` +
      'MISSING, which is indistinguishable from the drift it exists to catch', { cause: err });
  }
}

// ── The constants — every one derived from the text on disk, 2026-08-28 ───────────────────────────
//
// ⚠️ THESE ARE NOT TRIPWIRES TO EDIT UNTIL GREEN. Each failure message below says what to do instead.

// A1/A2 — the two flag lines, byte-exact as WHOLE lines (leading indent aside; see countWholeLines).
// `<NNNN>` is literal in the source: it is the placeholder the
// skill tells the wiki to substitute, so the pinned text contains it verbatim.
const FLAG_COMPLETE = "- complete → `Task <NNNN>'s vault work is complete — ready to close`";
const FLAG_PARTIAL = '- partial or uncertain → `Task <NNNN>: partial — not ready to close`';

// A3 — the standing hard rule, which lives under each file's `## Hard rules` heading, OUTSIDE the flag
// block. Written here as it reads FLATTENED; how it is line-broken in the source is irrelevant because
// both sides are normalized before comparing.
const HARD_RULE = '- **Close nothing.** The wiki does not hold the task movers (ADR-033) and never ' +
  'invokes one, never moves a task file, and never edits a brief or the sprint plan. It **flags**; ' +
  'the producer closes.';

// A4 — the third branch of the flag rule. Without it the block reverts to emitting a `partial` line
// for every fkit-wiki-owned backlog brief, on every run, forever.
const R2_BRANCH = '- **Unrelated to this run** → **say nothing about it at all.**';

// A5 — the fourth forbidden act, sitting next to a ready-to-run `@fkit-producer` line on a path the
// ADR-018 hook PERMITS, which is exactly why it must be spelled out in prose.
// ⛔ THIS PINS CURRENT ADR-033 POLICY. Do not drop, weaken, or invert it. (The rule is that the WIKI
// must not spawn a producer on its own initiative; a driver doing so is a different actor.)
const R5_CLAUSE = 'do not spawn the producer to close it yourself.';

// Block anchors. ⚠️ BLOCK_START's asterisks precede "The", not "closes" — that is precisely the
// near-miss recorded in the header. BLOCK_END is a full sentence fragment, unique in each file.
const BLOCK_START = /\*\*The wiki closes nothing/;
const BLOCK_END = /stops the flag rotting when the folder moves boards\./;

// A GATE, not a pin. The live block is 41 lines in all three files; this is the floor below which an
// "extraction" is not a block at all. Deliberately well under 41 so a legitimate trim does not go red,
// and far above 0 so 0125's three-empty-extractions state cannot recur.
const MIN_BLOCK_LINES = 30;

// ── The matcher ───────────────────────────────────────────────────────────────────────────────────

const flat = (s) => s.replace(/\s+/g, ' ');

// Non-overlapping occurrence count. EXACTLY-ONCE, not at-least-once, in both modes: a duplicated block
// is drift too, and a count gives a far better failure message than a boolean.
function countOccurrences(haystack, needle) {
  let count = 0;
  let i = 0;
  while ((i = haystack.indexOf(needle, i)) !== -1) {
    count += 1;
    i += needle.length;
  }
  return count;
}

// The raw mode is WHOLE-LINE equality, modulo leading indent — not a substring count (round-1 review
// R2). A1/A2 are named byte-identical and the guard has to mean it: a substring count leaves text
// APPENDED after the flag line's closing backtick invisible, and appending
// ` (deprecated — use the new form)` identically in all three files held the suite 10/10 green while
// the two-line contract a caller "carries verbatim" visibly changed (measured 2026-08-28). Leading
// indent is the one difference that IS legitimate — sync carries the block at a smaller indent than
// ingest and lint — so it, and only it, is tolerated. Trailing whitespace is not: two trailing spaces
// are a markdown hard break, which is a real change to the emitted line.
function countWholeLines(source, needle) {
  return source.split('\n').filter((l) => l.replace(/^[ \t]+/, '') === needle).length;
}

// One failure-message template for every presence assertion, so a red run never needs a grep: it names
// the ASSERTION, the FILE, the SUBJECT, the MODE, the COUNT, why the rule exists, and what to do.
function expectExactlyOnce({ id, skill, source, needle, mode, subject, why, constant }) {
  const raw = mode === 'raw';
  const found = raw
    ? countWholeLines(source, needle)
    : countOccurrences(flat(source), flat(needle));
  assert.equal(found, 1,
    `${id}: ${labelFor(skill)} — expected exactly 1 occurrence of the ${subject} ` +
    `"${needle}" (${raw ? 'byte-exact WHOLE LINE, modulo leading indent' : 'whitespace-normalized'}), ` +
    `found ${found}.\n` +
    `${why}\n` +
    `⚠️ If this text was DELIBERATELY reworded, update ${constant} in this file as part of that same ` +
    'change. Do NOT relax the assertion to turn a red run green.');
}

// ── Extraction — fails CLOSED (the R3 defect from 0125's review, closed) ──────────────────────────
//
// Every exit that is not a real block THROWS naming the file. Returning an empty array here is the
// single failure that produced this task.
const ANCHOR_ADVICE = '\n⚠️ If the block was DELIBERATELY restructured, update BLOCK_START / ' +
  'BLOCK_END / MIN_BLOCK_LINES in this file as part of that same change. Do NOT loosen the gate to ' +
  'turn a red run green.';

const linesMatching = (lines, re) => lines.reduce((acc, l, i) => (re.test(l) ? [...acc, i] : acc), []);

function extractBlock(lines, label) {
  // ⚠️ EXACTLY-ONCE ON BOTH ANCHORS, not first-match. Taking the FIRST end match let a duplicated
  // closing sentence — one identical copy planted 32 lines into the block, in all three files —
  // truncate every extraction to 32 lines, clear the 30-line floor, and hold the suite 10/10 green
  // over a genuine one-copy drift of the real tail below the truncation point (measured 2026-08-28).
  // The five subject assertions above are all exactly-once for the same reason: a duplicate is drift.
  const starts = linesMatching(lines, BLOCK_START);
  const ends = linesMatching(lines, BLOCK_END);
  if (starts.length === 0) {
    throw new Error(`${label}: START anchor matched NOTHING — the flag block is absent, or its ` +
      'opening sentence was reworded. This is the 0125 failure verbatim: an anchor that matches ' +
      'nothing must never be read as an empty block.' + ANCHOR_ADVICE);
  }
  if (ends.length === 0) {
    throw new Error(`${label}: END anchor matched NOTHING — the block's closing sentence is absent ` +
      'or reworded. Extraction stops here rather than silently running to end-of-file.' + ANCHOR_ADVICE);
  }
  if (starts.length > 1) {
    throw new Error(`${label}: START anchor matched ${starts.length} lines, expected exactly 1 — ` +
      'extraction would silently pick one of them. A duplicated opening sentence is drift too, and ' +
      'a wrong pick compares the wrong span.' + ANCHOR_ADVICE);
  }
  if (ends.length > 1) {
    throw new Error(`${label}: END anchor matched ${ends.length} lines, expected exactly 1 — ` +
      'extraction cannot tell which one closes the block, and the consequence depends on where the ' +
      'extra one sits: INSIDE the block, the first match truncates it and every drift below the cut ' +
      'goes invisible behind a green run; ABOVE it, the anchors read as out of order; BELOW it, the ' +
      "block extracts correctly but the closing sentence is quoted somewhere it should not be. All " +
      'three are drift. The gate refuses to guess between them.' + ANCHOR_ADVICE);
  }
  const [start] = starts;
  const [end] = ends;
  if (end <= start) {
    throw new Error(`${label}: anchors are OUT OF ORDER — END at line ${end + 1} is not after START ` +
      `at line ${start + 1}. The block was reordered or one anchor matched some other text.` +
      ANCHOR_ADVICE);
  }
  const block = lines.slice(start, end + 1);
  if (block.length < MIN_BLOCK_LINES) {
    throw new Error(`${label}: extracted only ${block.length} lines, below the ${MIN_BLOCK_LINES}-line ` +
      'floor — that is not a block. Either the anchors are matching the wrong text, or the block was ' +
      'legitimately TRIMMED below the floor; comparing a near-empty extraction to another would ' +
      'compare near-nothing to near-nothing and print UNIFORM.' + ANCHOR_ADVICE);
  }
  return block;
}

// Remove ONE uniform offset — the minimum leading-space count over the NON-BLANK lines — from every
// line, blanks included. ⚠️ NEVER trimStart(): blanket-stripping destroys RELATIVE nesting, which is
// the one thing that distinguishes "the whole block moved" (legitimate) from "one list item's indent
// broke" (a bug). T8 pins that difference.
function dedent(block) {
  const indents = block.filter((l) => l.trim() !== '').map((l) => l.match(/^ */)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return block.map((l) => l.slice(min)).join('\n');
}

const extractAndDedent = (text, label) => dedent(extractBlock(text.split('\n'), label));

// ── Synthetic fixtures (in-memory only; nothing is written anywhere) ──────────────────────────────
//
// A stand-in block with both anchors, blank lines, and a nested list level, at a chosen base indent.
// 30 lines — exactly the MIN_BLOCK_LINES floor, so the shortening fixture in T6 needs to remove only
// one line to prove the gate fires.
function synthBlock(baseIndent) {
  const pad = ' '.repeat(baseIndent);
  const out = [`${pad}**The wiki closes nothing and moves no task file.** Since **ADR-033** the task movers`];
  for (let i = 1; i <= 28; i += 1) {
    if (i % 7 === 0) out.push('');                                  // blank lines carry no indent
    else if (i % 3 === 0) out.push(`${pad}  - a nested list item, ${i}`);   // +2 relative nesting
    else out.push(`${pad}body line ${i}`);
  }
  out.push(`${pad}lookup is the caller's, and it is what stops the flag rotting when the folder moves boards.`);
  return out;
}

// ── T0 · The roster pin, first (task 0154 ND-2: T0 is included) ───────────────────────────────────
//
// ⚠️ What T0 does and does not carry. Non-vacuity over a THINNED or EMPTY corpus is held by
// construction, not by T0: SKILLS is hard-coded and readSkill() throws, so T1–T5 and T7 cannot pass
// over a corpus that is not there (measured: seven of ten red). What T0 uniquely catches is the one
// case a hard-coded list cannot see — a FOURTH fkit-wiki-* skill, added without the flag block.

test('roster: claude/skills holds exactly the three fkit-wiki skills', () => {
  const dir = join(ROOT, 'skills');
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    throw new Error(`cannot read ${dir}: ${err.code} — the roster would be silently empty and every ` +
      'assertion below trivially true', { cause: err });
  }
  // withFileTypes is load-bearing, the R33 lesson from adr-number-uniqueness.test.js: a FILE named
  // `fkit-wiki-something` would otherwise count as a skill.
  const found = entries.filter((e) => e.isDirectory() && e.name.startsWith('fkit-wiki-'))
    .map((e) => e.name).sort();

  assert.deepEqual(found, [...SKILLS].sort(),
    `T0: discovered fkit-wiki skills [${found.join(', ')}] under ${dir}, expected exactly ` +
    `[${[...SKILLS].sort().join(', ')}].\n` +
    'A FOURTH wiki skill added without the flag block would otherwise be SILENTLY UNCOVERED — this ' +
    'pin is the only thing that notices it. (⚠️ It is not what stops a thinned or empty corpus: ' +
    'SKILLS is hard-coded and readSkill() throws on a missing file, so a thinned or emptied tree ' +
    'reds seven of these ten tests, measured. T0 owns the fourth-skill case, and that case alone.)\n' +
    '⚠️ If a wiki skill was legitimately ADDED or REMOVED, update SKILLS in this file as a DELIBERATE ' +
    'part of that same change — and if it was added, make sure it CARRIES the flag block first. Do ' +
    'NOT edit the list merely to turn a red run green.');
});

// ── T1–T5 · The five subjects, in all three files ─────────────────────────────────────────────────

test('all three: the complete-flag line is byte-identical, exactly once', () => {
  for (const skill of SKILLS) {
    expectExactlyOnce({
      id: 'T1', skill, source: readSkill(skill), needle: FLAG_COMPLETE, mode: 'raw',
      subject: 'complete-flag line',
      why: "This is the line /fkit-task-done's caller reads and carries verbatim; a dropped or " +
        'reworded flag is the whole bug the convention exists to fix. It is pinned BYTE-EXACT on ' +
        'purpose — it is a contract, not prose, and it cannot legitimately wrap.',
      constant: 'FLAG_COMPLETE',
    });
  }
});

test('all three: the partial-flag line is byte-identical, exactly once', () => {
  for (const skill of SKILLS) {
    expectExactlyOnce({
      id: 'T2', skill, source: readSkill(skill), needle: FLAG_PARTIAL, mode: 'raw',
      subject: 'partial-flag line',
      why: 'This is the line that expresses "never resolve doubt as complete" in emittable form. ' +
        'Without it, uncertainty has nowhere to go but a complete flag or silence. Pinned BYTE-EXACT ' +
        'for the same reason as the complete line.',
      constant: 'FLAG_PARTIAL',
    });
  }
});

test('all three: the hard-rule bullet (ADR-033, wiki holds no movers) is present', () => {
  for (const skill of SKILLS) {
    expectExactlyOnce({
      id: 'T3', skill, source: readSkill(skill), needle: HARD_RULE, mode: 'flat',
      subject: 'ADR-033 hard-rule bullet',
      why: 'This states the ADR-033 boundary as a STANDING hard rule under `## Hard rules`, outside ' +
        'the flag block — so it survives even if the procedure step is restructured. It wraps across ' +
        'two source lines, which is why the match is whitespace-normalized; a raw match finds it ZERO ' +
        'times in every one of the three files.',
      constant: 'HARD_RULE',
    });
  }
});

test('all three: the R2 third branch — unrelated → say nothing at all', () => {
  for (const skill of SKILLS) {
    expectExactlyOnce({
      id: 'T4', skill, source: readSkill(skill), needle: R2_BRANCH, mode: 'flat',
      subject: 'third branch of the flag rule',
      why: 'Without this branch the block reverts to emitting a `partial` line for every ' +
        'fkit-wiki-owned backlog brief, on every run, forever — the noise that made the flags ' +
        'unreadable and therefore ignorable.',
      constant: 'R2_BRANCH',
    });
  }
});

test('all three: the R5 clause — do not spawn the producer to close it yourself', () => {
  for (const skill of SKILLS) {
    expectExactlyOnce({
      id: 'T5', skill, source: readSkill(skill), needle: R5_CLAUSE, mode: 'flat',
      subject: 'R5 clause (the fourth forbidden act)',
      why: 'This is the fourth forbidden act, and it sits next to a ready-to-run `@fkit-producer` ' +
        'line on a path the ADR-018 hook PERMITS — so prose is the only thing stopping it. ' +
        '⛔ It pins CURRENT ADR-033 policy: do not drop, weaken, or invert this assertion. It wraps ' +
        'across two source lines, so the match is whitespace-normalized; raw finds it ZERO times.',
      constant: 'R5_CLAUSE',
    });
  }
});

// ── T6 · Fail closed (0125 review residual R3) ────────────────────────────────────────────────────
//
// SIX cases, and the name says so: missing START, missing END, DUPLICATED START, DUPLICATED END,
// reversed anchors, and a sub-floor block. (e) and (f) were added by round-1 review R1; the test was
// renamed with them, on the owner's ruling, so the name keeps describing what it actually tests.

test('extraction fails closed: missing / duplicated / reversed anchors and a sub-floor block all THROW', () => {
  // (a) START matches nothing — 0125's check 4, verbatim. It must NOT return an empty block.
  const noStart = synthBlock(0).slice();
  noStart[0] = 'The wiki **closes nothing** and moves no task file.';   // the 0125 mis-anchoring
  assert.throws(() => extractBlock(noStart, 'fixture-a'),
    /fixture-a: START anchor matched NOTHING/,
    'T6(a): a START anchor that matches nothing MUST throw. Returning an empty block is exactly how ' +
    "0125's check 4 compared three empty extractions and printed UNIFORM.");

  // (b) END matches nothing — extraction must stop, not run to end-of-file.
  const noEnd = synthBlock(0).slice(0, -1);
  assert.throws(() => extractBlock(noEnd, 'fixture-b'),
    /fixture-b: END anchor matched NOTHING/,
    'T6(b): a missing END anchor MUST throw rather than silently extending the block.');

  // (c) Anchors present but REVERSED — the end sentence appears above the start sentence.
  const src = synthBlock(0);
  const reversed = [src[src.length - 1], ...src.slice(1, -1), src[0]];
  assert.throws(() => extractBlock(reversed, 'fixture-c'),
    /fixture-c: anchors are OUT OF ORDER/,
    'T6(c): anchors out of order MUST throw. slice() would otherwise return an empty or nonsense ' +
    'range and the comparison would pass over it.');

  // (d) Both anchors present, in order, but the block is BELOW the line floor.
  const short = [synthBlock(0)[0], 'body', synthBlock(0)[synthBlock(0).length - 1]];
  assert.throws(() => extractBlock(short, 'fixture-d'),
    /fixture-d: extracted only 3 lines, below the 30-line floor/,
    'T6(d): a non-empty but absurdly short extraction MUST throw. Non-empty is not the same as ' +
    'plausible — the gate is a MINIMUM LINE COUNT, not a truthiness check.');

  // (e) END anchor DUPLICATED inside the block — the fifth fail-closed case (round-1 review R1).
  // ⚠️ THE SPLICE POSITION IS LOAD-BEARING, and getting it wrong once is why this comment is long
  // (round-2 review R8). The duplicate is planted at the LAST body line, so a first-match extraction
  // takes 30 lines — exactly the floor, therefore ABOVE it — and would NOT throw. That is what makes
  // this fixture isolate the R1 hole rather than some other gate. Planted earlier (it was at index
  // 20) a first-match extraction takes 21 lines, the FLOOR catches it, and the fixture would be
  // proving (d) over again while claiming to prove the duplicate case. On the real tree the hole is
  // reachable with room to spare — one duplicated closing sentence 32 lines into a 41-line block
  // truncates to 33 and held the whole suite green over a genuine drift of the real tail.
  const dupEnd = synthBlock(0);
  dupEnd.splice(dupEnd.length - 1, 0, dupEnd[dupEnd.length - 1]);
  assert.throws(() => extractBlock(dupEnd, 'fixture-e'),
    /fixture-e: END anchor matched 2 lines, expected exactly 1/,
    'T6(e): a DUPLICATED end anchor MUST throw. This fixture is built so a first-match extraction ' +
    'clears the line floor (30 lines exactly), so the ONLY thing that can catch it is the ' +
    'exactly-once gate — which is the point: on the real tree that state hides every drift below the ' +
    'truncation point behind a green run.');

  // (f) START anchor DUPLICATED — the same hole on the other anchor, closed the same way.
  const dupStart = synthBlock(0);
  dupStart.splice(10, 0, dupStart[0]);
  assert.throws(() => extractBlock(dupStart, 'fixture-f'),
    /fixture-f: START anchor matched 2 lines, expected exactly 1/,
    'T6(f): a DUPLICATED start anchor MUST throw rather than silently picking one of them.');

  // And the control: the unmutated fixture extracts cleanly, so (a)-(f) are not throwing for some
  // unrelated reason. A fixture that never passes proves nothing about the cases that fail.
  assert.equal(extractBlock(synthBlock(0), 'fixture-ok').length, 30,
    'T6 control: the unmutated synthetic fixture must extract cleanly at exactly the line floor.');
});

// ── T7–T9 · Uniformity: identical modulo ONE uniform offset ───────────────────────────────────────

test('uniformity: identical modulo ONE uniform offset', () => {
  const [ingest, sync, lint] = SKILLS.map((s) => extractAndDedent(readSkill(s), labelFor(s)));

  const advice = '\n⚠️ The three copies must stay the same text. If the block was DELIBERATELY ' +
    'edited, apply the SAME edit to all three files in that same change — never edit one and relax ' +
    'this assertion. A per-file indent difference is fine (sync sits at a smaller indent than ingest ' +
    'and lint); anything else is drift.';

  assert.equal(ingest, sync,
    `T7: ${labelFor('fkit-wiki-ingest')} and ${labelFor('fkit-wiki-sync')} carry DIFFERENT flag ` +
    `blocks once their common indent is removed.${advice}`);
  assert.equal(ingest, lint,
    `T7: ${labelFor('fkit-wiki-ingest')} and ${labelFor('fkit-wiki-lint')} carry DIFFERENT flag ` +
    `blocks once their common indent is removed.${advice}`);
});

test('uniformity rejects a NON-uniform offset (broken list-item indent)', () => {
  const base = synthBlock(3);
  const broken = base.slice();
  const idx = broken.findIndex((l) => l.includes('- a nested list item'));
  assert.notEqual(idx, -1, 'T8 fixture: the nested list item must exist or this proves nothing');
  broken[idx] = `  ${broken[idx]}`;                       // one item pushed +2 out of step

  assert.notEqual(dedent(base), dedent(broken),
    'T8: dedent() ACCEPTED a broken relative indent. One list item pushed out of step is a real ' +
    'formatting bug, and the whole reason dedent() removes ONE uniform minimum instead of stripping ' +
    'each line: relative nesting is content.');

  // Why the uniform-minimum rule is required, made concrete: a per-line blanket strip cannot tell
  // these two apart at all. This is the implementation that would silently accept the bug.
  const blanketStrip = (b) => b.map((l) => l.replace(/^\s+/, '')).join('\n');
  assert.equal(blanketStrip(base), blanketStrip(broken),
    'T8 control: a per-line blanket strip is supposed to be BLIND to this bug — if it is not, this ' +
    'fixture no longer demonstrates why dedent() must use one uniform minimum.');
});

test('uniformity ACCEPTS a whole-block uniform shift', () => {
  // sync's existing state (it sits at a smaller indent than ingest and lint), and any future
  // re-nesting of the whole block. Guards against OVER-pinning: the offsets themselves are not pinned.
  assert.equal(dedent(synthBlock(0)), dedent(synthBlock(3)),
    'T9: a whole-block uniform shift must stay GREEN. It is the live state of the three files today ' +
    '— re-nesting the block inside a numbered step is a legitimate edit, not drift.');
  assert.equal(dedent(synthBlock(0)), dedent(synthBlock(7)),
    'T9: a LARGER uniform shift must also stay green — the accepted offset is any uniform one, not a ' +
    'pinned magic number.');
});
