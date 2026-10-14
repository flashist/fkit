// The asking-the-owner rule guard — task 0504.
//
// THE RULE THIS FILE GUARDS. conventions/asking-the-owner.md: every `AskUserQuestion` an fkit session
// puts to the owner explains first, carries the standing option (label `Explain more, then ask again`,
// description `Give me more context in simple terms, then re-ask the question.`) last, and treats a reply
// that is not a choice — that option, or a typed question — as a question to answer in chat, never as an
// answer or as consent. The shared rules block holds only a pointer to the convention (the block's byte
// budget, task 0130), so the words that reach an agent at ask time live in SIX role prompts, the sprint
// ship-loop, the open-questions interview, fkit-heal's consent step, and the shipped convention. Those copies can drift apart; this
// file pins them.
//
// SCOPE: an invariant over the repo's own shipped content (the category test/task-id-uniqueness.test.js
// established), in the method of test/spawned-write-marker.test.js. ADR-014 governs the mechanics
// (node --test, zero devDependencies, hand-rolled).
//
// ⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT — read this before trusting a green run.
//   1. It guards SOURCE TEXT, never runtime obedience. A green run says the words are on disk; whether an
//      agent actually answers a typed follow-up in chat is the task's live check (owner-run), not this.
//   2. It reads `claude/` ONLY — never the gitignored `.claude/` copies and never `ai-agents/` (so it is
//      not in `test:docs`). The live convention's byte-identity with the scaffold copy is
//      test/dual-home-parity.test.js's job.
//   3. Presence, not correctness.
//
// TWO MATCH MODES. The option's label and description are BYTE-EXACT and must sit on ONE line: they are
// the strings the owner's own instructions also use, and a line-wrap inside one would break a search for
// it. Everything else is prose that re-wraps, so it is WHITESPACE-NORMALIZED before matching.
//
// NO `path:NNN` COORDINATES (conventions/durable-citation-anchors.md). Constants derived from the text on
// disk, 2026-10-10. THIS TEST READS THE REPO, read-only, and writes nothing anywhere.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const LABEL = 'Explain more, then ask again';
const DESCRIPTION = 'Give me more context in simple terms, then re-ask the question.';

const ROLES = ['lead', 'producer', 'coder', 'architect', 'reviewer', 'wiki'];
const prompt = (r) => `claude/agents/fkit-${r}.md`;
const LEAD = prompt('lead');
const CODER = prompt('coder');
const PRODUCER = prompt('producer');
const SPRINT = 'claude/skills/fkit-sprint-ship-loop/SKILL.md';
const INTERVIEW = 'claude/skills/fkit-open-questions-interview/SKILL.md';
const HEAL = 'claude/skills/fkit-heal/SKILL.md';
const RULES = 'claude/scaffold/universal-rules.md';
const CONVENTION_PATH = 'ai-agents/knowledge-base/conventions/asking-the-owner.md';
const SCAFFOLD_CONVENTION = `claude/scaffold/${CONVENTION_PATH}`;

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

// Byte-exact, one line: the backticked label and description each appear on a single line of `text`.
function checkOption(text, where) {
  for (const [name, s] of [['label', LABEL], ['description', DESCRIPTION]]) {
    const needle = `\`${s}\``;
    const onOneLine = text.split('\n').some((line) => line.includes(needle));
    assert.ok(onOneLine, `${where}: the standing option's ${name} ${JSON.stringify(s)} is not present ` +
      'byte-exact on one line. Restore it exactly; a reword or a line-wrap inside it breaks the search ' +
      'the task\'s verification relies on.');
  }
}

function checkTerms(text, where, terms) {
  const f = flat(text);
  const missing = terms.filter((t) => !f.includes(t));
  assert.deepEqual(missing, [], `${where} is missing ${JSON.stringify(missing)}. Restore the wording; do ` +
    'not delete the term from this list to go green.');
}

test('a. the standing option is byte-exact in each of the six role prompts', () => {
  for (const r of ROLES) {
    const text = read(prompt(r));
    checkOption(text, prompt(r));
    checkTerms(text, `${prompt(r)} *Asking the owner*`, [
      '**Asking the owner.**', 'conventions/asking-the-owner.md',
      'A reply that is not a choice', 'is not an answer and not consent',
      'open no new question that turn',
      'Put the same question back on the owner\'s next message',
    ]);
  }
});

test('a. the standing option is byte-exact in the shipped convention', () => {
  checkOption(read(SCAFFOLD_CONVENTION), SCAFFOLD_CONVENTION);
});

test('b. the rules block points at the convention, and the convention ships', () => {
  checkTerms(read(RULES), RULES, [`\`${CONVENTION_PATH}\``]);
  assert.ok(existsSync(join(REPO, SCAFFOLD_CONVENTION)), `${SCAFFOLD_CONVENTION} is missing — the rules ` +
    'block points every fkit session at a file that does not ship.');
});

// D8 — a non-choice reply is never consent, said where an approval gates a write.
const NOT_APPROVAL = 'is not an answer and not approval';
test('c. lead, coder and sprint loop: a non-choice reply is not approval', () => {
  for (const rel of [LEAD, CODER, SPRINT]) {
    checkTerms(read(rel), rel, ['"Explain more, then ask again"', 'a typed question or request for', NOT_APPROVAL]);
  }
});

// R1 (review round 1) — the lead's D8 sentence re-asks on the owner's NEXT message (D2, owner Q1), not in
// the same turn, where a new dialog would cover the answer.
test('c. lead: the D8 re-ask waits for the owner\'s next message', () => {
  checkTerms(read(LEAD), LEAD, ['answer it in chat, re-ask on the owner\'s next message, and spawn no writer']);
});

// R2 (review round 1) — fkit-heal step 4 is the one consent gate before a file-writing apply; a lost or
// weakened "not consent" clause there would let an "Explain more" pick through as approval.
test('c. fkit-heal step 4: a non-choice reply is not consent', () => {
  checkTerms(read(HEAL), HEAL, [
    '"Explain more, then ask again"', 'or a typed question, is not consent',
    'answer it in chat and re-ask on the owner\'s next message',
  ]);
});

// L2 — the interview's "a returned result is ANSWERED" callout keeps its carve-out, or a picked
// "Explain more" silently closes the question and the promised re-ask never comes.
test('c. open-questions interview: a non-choice reply leaves the question open', () => {
  checkTerms(read(INTERVIEW), INTERVIEW, [
    'Except a reply that is not a choice', '"Explain more, then ask again"',
    'is not an answer — the question stays open',
  ]);
});

// X5 — the ≤3-option cap and the merge fallback travel to every worker-side and relayer-side source.
test('d. the 3-option cap and the merge fallback: lead, coder, producer, sprint loop', () => {
  for (const rel of [LEAD, CODER, PRODUCER, SPRINT]) {
    checkTerms(read(rel), rel, ['at most 3 options', 'standing option as the 4th', 'least-recommended']);
  }
  // L1 — a relayer's merged option keeps both knock-ons (placement-questions-state-the-knock-on.md).
  for (const rel of [LEAD, SPRINT]) checkTerms(read(rel), rel, ['keeping both knock-ons']);
});

test('e. control: a one-char-mutated description is caught (the checker is not vacuous)', () => {
  const text = read(LEAD);
  assert.doesNotThrow(() => checkOption(text, LEAD), 'precondition: the unmutated prompt passes');
  const mutated = text.replace(DESCRIPTION, DESCRIPTION.replace('simple', 'simpel'));
  assert.notEqual(mutated, text, 'control fixture: the description was not found to mutate');
  assert.throws(() => checkOption(mutated, LEAD), /description/,
    'checkOption did not fail on a mutated description — the checker is vacuous');
});

test('e. control: a line-wrapped label is caught', () => {
  const text = read(LEAD);
  const mutated = text.replace(`\`${LABEL}\``, '`Explain more,\n  then ask again`');
  assert.notEqual(mutated, text, 'control fixture: the label was not found to mutate');
  assert.throws(() => checkOption(mutated, LEAD), /label/,
    'checkOption did not fail on a wrapped label — the one-line rule is not checked');
});
