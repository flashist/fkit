// The spawned-write declared-approval marker guard — task 0475 (ADR-055).
//
// THE RULE THIS FILE GUARDS. ADR-055: a spawned coder may write source only under ONE declared-approval
// marker, sent by either of two drivers — `fkit-sprint-ship-loop` or `fkit-lead` (conductor) — with the
// same four fields: (a) caller, (b) the approved plan verbatim or the exact approved scope, (c) the
// owner's approval (on the lead path quoted verbatim, with date and channel), (d) the worker role.
// Everything else refuses. The shape is stated in THREE places that can drift apart: the coder's side
// (claude/agents/fkit-coder.md, §Mode, "A second scoped exception"), the lead's side
// (claude/agents/fkit-lead.md, the conductor-remit bullet "Spawning a coder to write"), and the sprint
// loop's pointer (claude/skills/fkit-sprint-ship-loop/SKILL.md, "Rules that make this honor the ADRs").
// This file pins the words in all three.
//
// SCOPE: the fourth test-scope category — an invariant over the repo's own shipped content — as
// established by test/task-id-uniqueness.test.js's header and reused by
// test/wiki-flag-convention.test.js, whose method this file copies (extract-and-GATE, two match modes).
// ADR-014 governs the mechanics (node --test, zero devDependencies, hand-rolled).
//
// ⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT — read this before trusting a green run.
//   1. It guards SOURCE TEXT, never runtime obedience. A green run says the words are on disk; it says
//      nothing about whether a spawned coder actually refuses a defective marker, or whether a driver
//      actually quotes the owner. That is ADR-055 Decision 7's "trust, not proof", and task 0475's dry
//      run (verification 7) — not this file — is the only behavioural check.
//   2. It reads `claude/` ONLY, never the gitignored `.claude/` copies and never `ai-agents/` (so it is
//      not in `test:docs`). It does not check the ADRs.
//   3. Presence, not correctness: it cannot tell a field stated right from a field merely mentioned.
//
// TWO MATCH MODES. The coder's condition-(b) phrase (arm 4) is BYTE-EXACT: it is the anchor that
// claude/carry-check-hook.mjs's header names as the coder's "condition (b)", so a reword must go red here.
// The hook does NOT reproduce those bytes — it paraphrases them as "it carries a concrete APPROVED plan
// verbatim" (caps, no markdown), a mismatch older than 0475 — and this file never reads the hook, so a
// reword of the hook's own quote is NOT detected. Everything else is prose that re-wraps, so it is
// WHITESPACE-NORMALIZED before matching — whitespace only: inline markup (`**`, backticks) is part of a
// term and matches literally, so an emphasis-only edit (e.g. dropping the `**` from "**or** `fkit-lead`")
// goes red with the meaning unchanged. That red is fail-safe, never a false green: re-derive the term's
// markup from the text; never drop the term.
//
// NO `path:NNN` COORDINATES. Anchors are quoted headings and phrases (conventions/
// durable-citation-anchors.md). Every constant below was derived from the text on disk, 2026-10-06.
//
// THIS TEST READS THE REPO, read-only, and writes nothing anywhere.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const CODER = 'claude/agents/fkit-coder.md';
const LEAD = 'claude/agents/fkit-lead.md';
const SPRINT = 'claude/skills/fkit-sprint-ship-loop/SKILL.md';

// UNREADABLE is not ABSENT: a read error propagates with the path, never swallowed into "not found".
function read(rel) {
  try {
    return readFileSync(join(REPO, rel), 'utf8');
  } catch (err) {
    throw new Error(`cannot read ${rel}: ${err.code} — this guard would otherwise report the text as ` +
      'MISSING, which is indistinguishable from the drift it exists to catch', { cause: err });
  }
}

const flat = (s) => s.replace(/\s+/g, ' ');

// Extract from a start anchor to an end anchor, and THROW on a missing anchor or a near-empty block —
// an empty extraction must never pass a presence check (the near-miss test/wiki-flag-convention.test.js
// records).
function extract(source, label, startNeedle, endNeedle, minChars) {
  const start = source.indexOf(startNeedle);
  if (start === -1) throw new Error(`${label}: start anchor not found: ${JSON.stringify(startNeedle)}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end === -1) throw new Error(`${label}: end anchor not found after start: ${JSON.stringify(endNeedle)}`);
  const block = source.slice(start, end);
  if (block.trim().length < minChars) {
    throw new Error(`${label}: extracted block is ${block.trim().length} chars, under the ${minChars} floor`);
  }
  return block;
}

// The coder's carve-out: from the second-exception heading to the next `##` heading.
const CODER_START = '**A second scoped exception';
const CODER_END = '\n## Your procedures';
const coderSection = () => extract(read(CODER), CODER, CODER_START, CODER_END, 2000);

// The lead's conductor bullet: from its bold lead-in to the next `##` heading.
const LEAD_START = '**Spawning a coder to write';
const LEAD_END = '\n## The team';
const leadBullet = () => extract(read(LEAD), LEAD, LEAD_START, LEAD_END, 400);

// Both drivers and every field, as the coder states them.
const CODER_TERMS = [
  'fkit-sprint-ship-loop', 'fkit-lead',
  'approved plan', 'verbatim', 'approved scope', 'quotes that approval verbatim',
  'date', 'channel', 'worker role', 'Build', 'Process-review', 'ADR-055',
];

function missingTerms(text, terms) {
  const f = flat(text);
  return terms.filter((t) => !f.includes(t));
}

// Arm 1 — the coder names both drivers and all four fields. A named function so the control arm
// (7) can run the very same check against a mutated copy.
function checkCoderFields(text) {
  const missing = missingTerms(text, CODER_TERMS);
  assert.deepEqual(missing, [], `${CODER} §Mode "A second scoped exception" is missing ${JSON.stringify(missing)}. ` +
    'ADR-055 Decision 1–2: one marker, two drivers, four fields. Restore the wording; do not delete the term ' +
    'from this list to go green.');
}

// Field (a) ITSELF must name both drivers. Arm 1 alone cannot see this: the section mentions `fkit-lead`
// elsewhere (field (c), the task-folder rule), so reverting field (a) to sprint-loop-only would stay green.
const FIELD_A_START = '- **(a)**';
const FIELD_A_END = '- **(b)**';
function checkFieldA(section) {
  const fieldA = extract(section, `${CODER} field (a)`, FIELD_A_START, FIELD_A_END, 40);
  const missing = missingTerms(fieldA, ['fkit-sprint-ship-loop', '**or** `fkit-lead`']);
  assert.deepEqual(missing, [], `${CODER} field (a) is missing ${JSON.stringify(missing)} — the caller ` +
    'field must accept BOTH drivers (ADR-055 Decision 1).');
}

test('1. coder: the second exception names both drivers and every marker field', () => {
  checkCoderFields(coderSection());
  checkFieldA(coderSection());
});

test('2. coder: the explicit refusal list is present', () => {
  const f = flat(coderSection());
  const terms = [
    'Still refuses; write no source',
    'No marker',
    'plan-only spawn',
    'by reference only',
    'paraphrased or summarized',
    'NEEDS-DECISION` naming the failed field',
    'an approval for X is never reused for Y',
    'commit or push',
    'Process-review spawned by `fkit-lead` needs a task folder',
  ];
  const missing = terms.filter((t) => !f.includes(t));
  assert.deepEqual(missing, [], `${CODER}: refusal list is missing ${JSON.stringify(missing)} (ADR-055 Decision 4).`);
});

test('3. coder: the carve-out still says "trust, not proof"', () => {
  assert.ok(flat(coderSection()).includes('This is trust, not proof'),
    `${CODER}: "This is trust, not proof" is gone from the carve-out (ADR-055 Decision 7; ADR-032 A3).`);
});

test('4. coder: the carry-check phrase for condition (b) is byte-exact', () => {
  const phrase = 'it carries a concrete **approved plan** verbatim';
  const n = read(CODER).split(phrase).length - 1;
  assert.equal(n, 1, `${CODER}: ${JSON.stringify(phrase)} occurs ${n} times, expected exactly 1. ` +
    'claude/carry-check-hook.mjs names this phrase as the coder\'s condition (b) (paraphrased there, not ' +
    'byte-quoted); a reword breaks that citation.');
});

// Arm 5 — a named function so the control arm (9) can run the very same check against a mutated copy.
function checkLeadBullet(text) {
  const missing = missingTerms(text, [
    'declared-approval marker', 'ADR-055', 'plan-only', 'caller `fkit-lead`',
    '**all four** fields',
    'plan verbatim', 'exact approved scope', 'quoted verbatim', 'date', 'channel', 'worker role',
    'A summary is not a quote',
    'No real owner answer → spawn plan-only', 'never put the marker on a plan-only spawn',
    'Process-review needs a task folder',
  ]);
  assert.deepEqual(missing, [], `${LEAD}: the "Spawning a coder to write" bullet is missing ${JSON.stringify(missing)}.`);
}

test('5. lead: the conductor bullet names the marker, its four fields, and plan-only', () => {
  checkLeadBullet(leadBullet());
});

test('6. sprint loop: still names the declared-approval marker and points at ADR-055', () => {
  const f = flat(read(SPRINT));
  assert.ok(f.includes('declared-approval marker'), `${SPRINT}: "declared-approval marker" is gone.`);
  assert.ok(f.includes('ADR-055'), `${SPRINT}: the pointer to ADR-055 (the shared marker) is gone.`);
});

test('7. control: arm 1 goes red when fkit-lead is removed from the coder text', () => {
  const mutated = coderSection().replaceAll('fkit-lead', 'REMOVED');
  assert.throws(() => checkCoderFields(mutated), /fkit-lead/,
    'arm 1 did not fail on a copy without fkit-lead — the checker is vacuous');
});

// Control for the field-(a) pin: revert ONLY field (a) to sprint-loop-only (every other `fkit-lead` in the
// section stays). The whole-section check stays green on this copy — which is why checkFieldA exists.
test('8. control: arm 1 goes red when field (a) alone drops fkit-lead', () => {
  const section = coderSection();
  const cut = '\n  **or** `fkit-lead` (the conductor, ADR-031);';
  assert.ok(section.includes(cut), `${CODER}: control-arm fixture text not found — re-derive ${JSON.stringify(cut)}`);
  const mutated = section.replace(cut, ';');
  assert.doesNotThrow(() => checkCoderFields(mutated), 'precondition: the whole-section check alone misses this');
  assert.throws(() => checkFieldA(mutated), /fkit-lead/,
    'field-(a) check did not fail on a sprint-loop-only field (a) — the checker is vacuous');
});

// Control for the lead pin: drop ONLY "No real owner answer → spawn plan-only" ("plan-only" still occurs
// in "Spawn `@fkit-coder` **plan-only** first").
test('9. control: arm 5 goes red when the lead drops "No real owner answer → spawn plan-only"', () => {
  const bullet = leadBullet();
  const cut = '**No real owner answer → spawn plan-only**, and never put the marker on';
  assert.ok(bullet.includes(cut), `${LEAD}: control-arm fixture text not found — re-derive ${JSON.stringify(cut)}`);
  const mutated = bullet.replace(cut, 'Never put the marker on');
  assert.throws(() => checkLeadBullet(mutated), /No real owner answer/,
    'arm 5 did not fail without "No real owner answer → spawn plan-only" — the checker is vacuous');
});
