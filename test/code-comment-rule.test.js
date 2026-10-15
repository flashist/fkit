// Pins the "comment WHY, not WHAT" rule's wording where agents read it (task 0506).
// Presence of text only — whether agents obey it is the task's live check, not this.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const CONVENTION_PATH = 'ai-agents/knowledge-base/conventions/code-comments.md';
const SCAFFOLD_CONVENTION = `claude/scaffold/${CONVENTION_PATH}`;
const RULES = 'claude/scaffold/universal-rules.md';
const CODER = 'claude/agents/fkit-coder.md';
const DESIGN_SPEC = 'claude/skills/fkit-design-spec/SKILL.md';
const DENSITY = 'naming, structure, comment density';

// A read error must not pass as "text missing", which is the drift this file catches.
function read(rel) {
  try {
    return readFileSync(join(REPO, rel), 'utf8');
  } catch (err) {
    throw new Error(`cannot read ${rel}: ${err.code}`, { cause: err });
  }
}

// Prose re-wraps, so a phrase split across lines must still match.
const flat = (s) => s.replace(/\s+/g, ' ');

function checkTerms(text, where, terms) {
  const missing = terms.filter((t) => !flat(text).includes(t));
  assert.deepEqual(missing, [], `${where} is missing ${JSON.stringify(missing)}. Restore the wording; do ` +
    'not delete the term from this list to go green.');
}

function checkAbsent(text, where, phrase) {
  assert.ok(!flat(text).includes(phrase), `${where} still says ${JSON.stringify(phrase)} — it tells the ` +
    'coder to copy a heavily commented file\'s comment density, which contradicts code-comments.md.');
}

test('the rules block names the convention, and the convention ships', () => {
  checkTerms(read(RULES), RULES, ['**Code comments say WHY, never WHAT**', `\`${CONVENTION_PATH}\``]);
  assert.ok(existsSync(join(REPO, SCAFFOLD_CONVENTION)), `${SCAFFOLD_CONVENTION} is missing — the rules ` +
    'block points every fkit session at a file that does not ship.');
});

// Every prompt defers to this file as "the full rule", so its core must not erode unnoticed.
test('the convention carries the rule it is cited for', () => {
  checkTerms(read(SCAFFOLD_CONVENTION), SCAFFOLD_CONVENTION, ['**Comment only WHY, never WHAT.**',
    '**At most 1–2 lines per comment.**', 'never by line number', '**No history comments**',
    'fix or delete any comment the change makes wrong', '**A project\'s own written comment rules win**',
    'It never means comment density.']);
});

test('the coder prompt links the convention and no longer matches comment density', () => {
  const text = read(CODER);
  checkTerms(text, CODER, ['conventions/code-comments.md', '**Comments say WHY, never WHAT**',
    '**but not its comment density**']);
  checkAbsent(text, CODER, DENSITY);
});

test('design-spec stubs carry one-line doc comments', () => {
  checkTerms(read(DESIGN_SPEC), DESIGN_SPEC, ['one-line doc comments']);
});

test('control: the old density wording is caught, even line-wrapped', () => {
  const text = read(CODER);
  const mutated = text.replace('naming, structure, and idioms', 'naming, structure,\n  comment density, and idioms');
  assert.notEqual(mutated, text, 'control fixture: the coder bullet was not found to mutate');
  assert.throws(() => checkAbsent(mutated, CODER, DENSITY), /comment density/,
    'checkAbsent did not fail on the restored density wording — the checker is vacuous');
});
