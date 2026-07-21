// The ADR-number uniqueness guard — task 81 Part B.
//
// SCOPE: same FOURTH test-scope category as test/task-id-uniqueness.test.js — an invariant over the
// repo's own `ai-agents/` content rather than over product behavior. ADR-014 §2 fenced the scope at two
// things; ADR-017 rule 4 widened it to a third (a shipped skill executable's stdout contract); that
// file's header records the fourth. This suite is a second instance of the fourth, not a fifth
// category, so the widening is cited rather than re-argued. See task-id-uniqueness.test.js:3-11.
//
// WHY IT EXISTS — a collision that actually happened, on 2026-07-19. `/fkit-record-decision` derived
// the next ADR number by listing `ai-agents/knowledge-base/decisions/`, saw adr-028 as the highest, and
// allocated 029. But 029 was already claimed: a task brief referenced `adr-029-stop-hook-…` and ~10
// wiki-vault pages had ingested it. The one place it was NOT claimed was the decisions/ directory —
// the file did not exist on disk yet. The stop-hook decision had to be renumbered to ADR-030.
//
// ⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT — read this before trusting it (review R28).
// Task 81 Part B fixed the *authoring* path — which now derives the next number from ADR FILENAMES ON
// DISK ONLY. (A sweep over every place a number could be claimed was built and removed: prose in
// ordinary documents poisoned it three times.) This
// file is a NARROWER mechanical backstop: it detects the collision only in its **settled** form —
// two ADR FILES on disk sharing a number. It does NOT detect the 2026-07-19 shape, where 029 was
// claimed in a brief and in vault pages with no file in decisions/ at all.
//
// A pre-emptive claim-site guard for that shape was built and then REMOVED (owner-ruled 2026-07-20):
// ordinary prose citing a slugged ADR number turned the build red — the review ledger documenting the
// guard broke the guard; it compared maxima only, so it went blind the moment the colliding file
// landed; and its tests exercised a JS reimplementation, never the shell pipeline the skill ships.
// Prevention for the pre-emptive case lives solely in `/fkit-record-decision`'s numbering step.
//
// ⚠️ TWO ADRs SHARING A NUMBER STAY RESOLVABLE, which is why a link check cannot find this. Both files
// exist, every link resolves, nothing 404s. The corpus is internally consistent and quietly wrong. The
// 2026-07-19 collision was caught by a person noticing.
//
// ⚠️ NON-VACUITY IS LOAD-BEARING. A duplicate check over zero discovered ADRs passes trivially. If the
// decisions/ directory moves or is renamed, this must go RED, not green. Hence the non-zero assertion.
//
// THIS TEST READS THE REPO, read-only. Every fixture lives under os.tmpdir(); harness.mjs:9's rule
// ("nothing here writes into the repo") is intact.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO, cleanup } from './harness.mjs';

const MADE = [];
after(() => MADE.forEach(cleanup));

// ── The pure functions under test ────────────────────────────────────────────────────────────────

// `adr-029-a-task-is-a-folder.md` -> { number: 29, padded: '029', slug: 'a-task-is-a-folder', … }
// Returns null for anything that is not an ADR filename, so a README in decisions/ is skipped rather
// than counted as a malformed ADR.
// ⚠️ IDENTITY IS NUMERIC (review R21). `number` is an INTEGER. Three artifacts once used three
// different definitions — raw string here, Number() there, string-dedupe in the shell — so `029` and
// `0029` were treated as different ADRs and their collision slipped through.
//
// ⚠️ THE `padded` FIELD IS GONE, and the reason is worth recording because it retires work this review
// asked for. R30/R36/R39 built and then guarded a display of every padded spelling, so an
// `adr-029`/`adr-0029` collision would show both forms. **R43's fix made that unreachable:** requiring
// EXACTLY three digits means `adr-0029-…` is a malformed filename, rejected by `parseAdrFilename` and
// flagged by the shipped pipeline's Step A. Two valid ADR filenames can no longer disagree about
// padding, so there is nothing left for `padded` to preserve. Keeping a field and a test for a state
// the shape now forbids would be theatre. The R30/R36/R39 concern was real when `{3,}` was the rule —
// it is the rule that changed, not the reasoning.
// ⚠️ THE CANONICAL SHAPE, and all three artifacts must agree on it (review R47/R43):
// `adr-<NNN>-<slug>.md` — **exactly three digits**, NON-EMPTY slug, case-insensitive.
//
// ⚠️ EXACTLY THREE, not "three or more" — and this review forced both positions in turn. R6/R11
// established "read numbers longer than three digits whole", which is precisely what let a
// DATE-STAMPED filename parse as an ADR number: `adr-2026-07-20-notes.md` returned **2026**, so the
// next ADR would have been 2027, permanently. Bounding to {3,4} does not help — 2026 is four digits.
// Every ADR in this repo is three digits; four-digit support was hypothetical throughout, introduced
// by the review itself and retired by it.
//
// **Accepted limit, stated rather than discovered later:** this caps the scheme at ADR-999. That is the
// same shape of residual ADR-029 accepted for four-digit task IDs. Raising it means changing the rule
// in all three artifacts together — and re-checking the date-stamped case, which is what a wider
// pattern reopens. A shape this rejects but the allocation
// pipeline accepts (or vice versa) means allocation can create a series the detectors cannot see.
// `/fkit-record-decision` Step A rejects the same set; `/fkit-wiki-lint` assumes it.
function parseAdrFilename(name) {
  const m = name.match(/^adr-(\d{3})-(.+)\.md$/i);
  return m ? { number: Number(m[1]), padded: m[1], slug: m[2], source: name } : null;
}

function discoverAdrs(decisionsDir) {
  let entries;
  try {
    // ⚠️ withFileTypes IS LOAD-BEARING (review R33). Parsing entries by NAME alone counted a
    // *directory* called `adr-001-placeholder.md` as an ADR — so `records.length > 0` passed over a
    // decisions/ holding zero actual ADR files. That is precisely the vacuous-green this file's header
    // calls the one thing that must go RED, and it was the single guarantee that did not hold.
    entries = readdirSync(decisionsDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    // R2's lesson from the task-id guard: unreadable is not the same as absent.
    throw new Error(`cannot read ${decisionsDir}: ${err.code} — the scan would be silently incomplete`,
      { cause: err });
  }
  return entries.filter(e => e.isFile()).map(e => parseAdrFilename(e.name)).filter(Boolean)
    .sort((a, b) => (a.source < b.source ? -1 : 1));
}

// Group by number, keep only numbers carried by more than one ADR.
// ⚠️ Returns the SOURCES. The remedy is "renumber the newcomer", which is impossible without knowing
// which files collided — the same reasoning as the task-id guard's failure message.
function findDuplicateNumbers(records) {
  const byNumber = new Map();
  for (const r of records) {
    if (!byNumber.has(r.number)) byNumber.set(r.number, []);
    byNumber.get(r.number).push(r);
  }
  return [...byNumber.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([number, group]) => ({
      number,
      // R30 — surface every padded spelling seen, so an adr-029/adr-0029 collision shows BOTH forms
      // rather than flattening to "ADR 29" and hiding what makes the two filenames look distinct.
      padded: group[0].padded,        // uniform by construction: exactly three digits (R43)
      sources: group.map(g => g.source).sort(),
    }))
    .sort((a, b) => (a.number < b.number ? -1 : 1));
}

// ── Fixtures (os.tmpdir() only) ──────────────────────────────────────────────────────────────────

function fixture(filenames) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-adr-'));
  MADE.push(root);
  const dir = join(root, 'decisions');
  mkdirSync(dir, { recursive: true });
  for (const n of filenames) writeFileSync(join(dir, n), `# ${n}\n`);
  return dir;
}

// ── Unit tests ───────────────────────────────────────────────────────────────────────────────────

test('findDuplicateNumbers: a clean corpus reports nothing', () => {
  const dir = fixture(['adr-001-a.md', 'adr-002-b.md', 'adr-003-c.md']);
  assert.deepEqual(findDuplicateNumbers(discoverAdrs(dir)), []);
});

// ⚠️ NOTE THE NAME (review R4). This is TWO FILES ON DISK sharing a number — the collision in its
// SETTLED form, which is all this guard claims to detect. It is NOT the 2026-07-19 state, where 029
// was claimed only in a brief and in vault pages with no file in decisions/ at all.
//
// ⚠️ THAT PRE-EMPTIVE CASE IS DELIBERATELY NOT GUARDED HERE — owner-ruled 2026-07-20, after a
// claim-site guard was built and then removed. It failed three ways: ordinary prose citing a slugged
// ADR number turned the build red (the review ledger documenting the guard broke the guard); it
// compared maxima only, so it went BLIND the moment the colliding file actually landed — the one case
// that matters; and its tests exercised a JS reimplementation, never the shell pipeline the skill
// ships. Prevention now lives solely in `/fkit-record-decision`'s numbering step. This file asserts
// only what it can assert soundly: no two ADR FILES share a number.
test('findDuplicateNumbers: two files sharing a number are caught, with both named', () => {
  const dir = fixture([
    'adr-028-eighth-role.md',
    'adr-029-a-task-is-a-folder.md',
    'adr-029-stop-hook-enforces-turn-completion.md',
  ]);
  const dupes = findDuplicateNumbers(discoverAdrs(dir));
  assert.equal(dupes.length, 1);
  assert.equal(dupes[0].number, 29);
  assert.deepEqual(dupes[0].sources,
    ['adr-029-a-task-is-a-folder.md', 'adr-029-stop-hook-enforces-turn-completion.md']);
});

// R36 — the padded display was unguarded: swapping `${d.padded}` for `${d.number}` in the failure
// message left the suite fully green. `padded` exists precisely so an adr-029/adr-0029 collision shows
// BOTH spellings rather than flattening to "ADR 29"; if nothing asserts that, the field silently
// decays back into the flattening it was added to prevent.
// R30/R36/R39 retired by R43 — recorded as a test so the reasoning is executable, not just prose.
// Two valid ADR filenames can no longer disagree about padding, so the "show both spellings" display
// this review built has nothing left to show.
test('two valid ADR filenames cannot disagree about padding (R30/R36/R39 retired by R43)', () => {
  const dupes = findDuplicateNumbers(discoverAdrs(fixture(['adr-029-a.md', 'adr-0029-b.md'])));
  assert.deepEqual(dupes, [],
    'adr-0029-b.md is not a valid ADR filename, so there is no collision and no rival spelling');
  assert.deepEqual(discoverAdrs(fixture(['adr-029-a.md', 'adr-0029-b.md'])).map(r => r.source),
    ['adr-029-a.md'], 'the 4-digit name is not discovered at all');
});

test('findDuplicateNumbers: a three-way collision names all three', () => {
  const dir = fixture(['adr-007-x.md', 'adr-007-y.md', 'adr-007-z.md', 'adr-008-ok.md']);
  const dupes = findDuplicateNumbers(discoverAdrs(dir));
  assert.equal(dupes.length, 1);
  assert.equal(dupes[0].sources.length, 3);
});

test('findDuplicateNumbers: an empty corpus reports nothing', () => {
  assert.deepEqual(findDuplicateNumbers([]), []);
});

test('parseAdrFilename: non-ADR files in decisions/ are skipped, not miscounted', () => {
  assert.equal(parseAdrFilename('README.md'), null);
  assert.equal(parseAdrFilename('adr-draft-notes.md'), null);
  assert.deepEqual(parseAdrFilename('adr-030-stop-hook.md'),
    { number: 30, padded: '030', slug: 'stop-hook', source: 'adr-030-stop-hook.md' });
});

// R43 — the case the "three or more digits" rule let through. A date-stamped filename is not an ADR.
test('parseAdrFilename: a date-stamped filename is NOT an ADR number (R43)', () => {
  assert.equal(parseAdrFilename('adr-2026-07-20-notes.md'), null,
    'under the old {3,} rule this parsed as ADR 2026 — the next ADR would have been 2027, forever');
  assert.equal(parseAdrFilename('adr-1029-x.md'), null, 'four digits are out of the scheme (ADR-999 cap)');
  assert.equal(parseAdrFilename('adr-029-a.md').number, 29, 'three digits still parse');
});

// R21/R43 — identity is numeric, and the padding question is now closed by the SHAPE rather than by
// comparison: a 4-digit name is not a valid ADR filename at all, so `029` has no rival spelling.
test('parseAdrFilename: identity is numeric, and 0029 is malformed rather than a rival spelling (R21/R43)', () => {
  assert.equal(parseAdrFilename('adr-029-a.md').number, 29, 'not the string "029"');
  assert.equal(parseAdrFilename('adr-0029-b.md'), null,
    'exactly three digits — a zero-padded 4-digit name is malformed, not a same-number twin');
});

// R47/R48 — allocation and detection must agree on filename shape, including case.
test('parseAdrFilename: the shape matches what allocation accepts (R47/R48)', () => {
  assert.equal(parseAdrFilename('adr-031.md'), null, 'no slug — allocation rejects it, so must we');
  assert.equal(parseAdrFilename('adr-031-.md'), null, 'empty slug — same');
  assert.equal(parseAdrFilename('ADR-031-x.md')?.number, 31, 'uppercase is the same ADR to a human');
  assert.equal(parseAdrFilename('adr-031-x.md')?.number, 31);
});

test('discoverAdrs: a missing directory is empty; an unreadable one throws', () => {
  assert.deepEqual(discoverAdrs(join(tmpdir(), 'fkit-adr-definitely-not-here')), []);
  const dir = fixture(['adr-001-a.md']);
  writeFileSync(join(dir, '..', 'notadir'), 'x');
  assert.throws(() => discoverAdrs(join(dir, '..', 'notadir')), /cannot read/);
});

// R33 — the one guarantee the header calls load-bearing, and the one that did not hold. Parsing
// entries by NAME let a DIRECTORY named `adr-001-placeholder.md` satisfy the non-vacuity assertion
// over a decisions/ containing zero actual ADR files: green over nothing, which is the exact state
// `:22-23` says must go red.
test('discoverAdrs: a DIRECTORY named like an ADR is not an ADR (R33)', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-adr-dir-'));
  MADE.push(root);
  const dir = join(root, 'decisions');
  mkdirSync(join(dir, 'adr-001-placeholder.md'), { recursive: true });
  assert.deepEqual(discoverAdrs(dir), [],
    'a directory must not be counted as an ADR — it would defeat the non-vacuity guarantee');
});

// R31 — restores the permission coverage the claim-site deletion took with it. R9 turned this rule on
// (unreadable is not absent); without a test, nothing holds discoverAdrs to it.
// Skipped as root, where the permission bits do not bite and it would pass for the wrong reason.
test('discoverAdrs: an UNREADABLE directory throws, it is not treated as absent (R9/R31)', { skip: process.getuid?.() === 0 ? 'runs as root' : false }, () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-adr-perm-'));
  MADE.push(root);
  const dir = join(root, 'decisions');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'adr-001-a.md'), '# ADR-001\n');
  chmodSync(dir, 0o000);
  try {
    assert.throws(() => discoverAdrs(dir), /cannot read .*EACCES/,
      'an unreadable decisions/ must fail loudly, not silently report zero ADRs');
  } finally {
    chmodSync(dir, 0o755);                        // always restore, or cleanup() cannot remove it
  }
});

// ⚠️ THE FAILURE MESSAGE IS A SEPARATE FUNCTION SO IT CAN BE TESTED (review R39).
// R36 asked for the padded display to be guarded. The first attempt asserted `dupes[0].padded` — the
// FIELD — which left the rendered message unguarded: swapping `${d.padded}` for `${d.number}` in the
// template still passed 12/12. Asserting the presence of a fix is not the same as asserting the
// absence of the defect. Rendering through a named function makes the actual output assertable.
function renderDuplicates(dupes) {
  return dupes.map(d => `  ADR ${d.padded} is carried by ${d.sources.length} files:\n` +
    d.sources.map(s => `    - ${s}`).join('\n')).join('\n');
}

test('renderDuplicates: the MESSAGE names the number and every colliding file (R39)', () => {
  const out = renderDuplicates(findDuplicateNumbers(discoverAdrs(
    fixture(['adr-029-first.md', 'adr-029-second.md']))));
  assert.match(out, /ADR 029 is carried by 2 files/, 'the padded number as it appears in filenames');
  assert.match(out, /- adr-029-first\.md/);
  assert.match(out, /- adr-029-second\.md/);
});

// ── The live corpus ──────────────────────────────────────────────────────────────────────────────

test('the live knowledge-base has no duplicate ADR numbers', () => {
  const dir = join(REPO, 'ai-agents', 'knowledge-base', 'decisions');
  const records = discoverAdrs(dir);

  // Non-vacuity first — everything below is trivially true over an empty corpus.
  assert.ok(records.length > 0,
    `discovered ZERO ADRs under ${dir} — the scan is vacuous, not clean. If decisions/ moved, ` +
    'discoverAdrs() must be taught the new location before this guard means anything.');

  const dupes = findDuplicateNumbers(records);
  assert.deepEqual(dupes, [],
    `duplicate ADR numbers across ${records.length} ADRs — renumber the NEWCOMER before anything ` +
    'links to it. (This is the collision in its SETTLED form: two files already on disk. The ' +
    '2026-07-19 incident was the earlier shape — a number claimed with no file yet — which this ' +
    'guard deliberately does not detect; prevention for that lives in /fkit-record-decision.)\n' +
    renderDuplicates(dupes));
});
