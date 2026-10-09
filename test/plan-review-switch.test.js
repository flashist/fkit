// The opt-in plan-review switch guard — task 0473 (ADR-056).
//
// THE RULE THIS FILE GUARDS. ADR-056: plan review is OFF by default. It runs only in a
// `/fkit-sprint-ship-loop` run started with `--plan-review`, and every other path behaves exactly as
// before. The build keeps that promise by putting ALL the new behaviour inside one marked block per
// file — `<!-- plan-review:begin -->` … `<!-- plan-review:end -->` — in
// claude/skills/fkit-plan-task/SKILL.md and claude/skills/fkit-sprint-ship-loop/SKILL.md, and leaving
// the default text around it as it was. This file pins the parts of that shape a word check can see
// (the ⚠️ section below says what it cannot):
//   1. fkit-plan-task: exactly one marker pair; the block opens with its gate (the switch line, and
//      "otherwise skip"); NO plan-review vocabulary outside it.
//   2. the sprint loop: one marker pair; outside it the vocabulary appears only in an allowlist of exact
//      sentences (the argument and the progress-report line); the Plan row is unchanged; the switch
//      line is the same in both files.
//   3. the argument says default off, absent = off.
//   4. the classification rule is the owner-approved wording, byte-exact, and names nothing
//      project-specific (owner, 2026-10-02: "The instructions shouldn't be fkit-specific").
//   5. producer and architect carry the APPROVE / CHANGES REQUESTED reply shape.
//   6. the adversarial-review skill accepts a plan, and its fallback banner is unchanged.
//   7. fkit-task-ship-loop has no plan-review vocabulary (session paths unchanged — ADR-056 Decision 3).
//   8. the lead passes the flag only when asked, never unasked.
// Control arms prove the checkers are not vacuous.
//
// SCOPE: the fourth test-scope category — an invariant over the repo's own shipped content — as
// established by test/task-id-uniqueness.test.js's header; the method copies
// test/spawned-write-marker.test.js (throwing extractors, whitespace-normalized matching, in-file
// control arms). ADR-014 governs the mechanics (node --test, zero devDependencies, hand-rolled).
//
// ⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT — read this before trusting a green run.
//   1. It guards SOURCE TEXT, never runtime obedience. A green run says the words sit where they
//      should; it says nothing about whether a driver adds the switch line unasked or a coder skips a
//      round. That is ADR-056 Decision 8's "trust, not proof".
//   2. "Off = today" is NOT proven here. What this file detects is narrower: plan-review VOCABULARY
//      (`/plan[- ]review/i`) outside the markers, or outside the sprint loop's allowlist. New behaviour
//      worded without that phrase — e.g. "always spawn the architect to approve the plan", added
//      outside the markers — stays green (measured, 0473 review round 1). The byte comparison against
//      the pre-0473 text is in task 0473's worklog (a snapshot diff), not here — this file has no
//      older copy to compare with.
//   3. It reads `claude/` ONLY — never the gitignored `.claude/` copies, never `ai-agents/` (so it
//      needs no `test:docs` entry).
//
// NO `path:NNN` COORDINATES. Anchors are quoted headings and phrases. Every constant below was derived
// from the text on disk, 2026-10-06. THIS TEST READS THE REPO, read-only, and writes nothing anywhere.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const PLAN_TASK = 'claude/skills/fkit-plan-task/SKILL.md';
const SPRINT = 'claude/skills/fkit-sprint-ship-loop/SKILL.md';
const TASK_LOOP = 'claude/skills/fkit-task-ship-loop/SKILL.md';
const LEAD = 'claude/agents/fkit-lead.md';
const PRODUCER = 'claude/agents/fkit-producer.md';
const ARCHITECT = 'claude/agents/fkit-architect.md';
const ADV_SKILL = 'claude/skills/fkit-adversarial-review/SKILL.md';

const BEGIN = '<!-- plan-review:begin -->';
const END = '<!-- plan-review:end -->';

// The vocabulary: "plan review", "plan-review", "--plan-review", "PLAN-REVIEW", any case.
const VOCAB = /plan[- ]review/i;

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

// Split a file at its ONE marker pair. THROWS on a missing, doubled or reversed marker, and on a
// near-empty block — an empty extraction must never pass a check.
function split(text, label, minChars) {
  const nb = text.split(BEGIN).length - 1;
  const ne = text.split(END).length - 1;
  if (nb !== 1 || ne !== 1) {
    throw new Error(`${label}: expected exactly one ${BEGIN} and one ${END}, found ${nb} and ${ne}`);
  }
  const b = text.indexOf(BEGIN);
  const e = text.indexOf(END);
  if (e < b) throw new Error(`${label}: ${END} comes before ${BEGIN}`);
  const inside = text.slice(b + BEGIN.length, e);
  if (inside.trim().length < minChars) {
    throw new Error(`${label}: the gated block is ${inside.trim().length} chars, under the ${minChars} floor`);
  }
  return { inside, outside: text.slice(0, b) + '\n' + text.slice(e + END.length) };
}

// Extract from a start anchor to an end anchor (end included or not), THROWING on a missing anchor.
function extract(source, label, startNeedle, endNeedle, { includeEnd = false, minChars = 20 } = {}) {
  const start = source.indexOf(startNeedle);
  if (start === -1) throw new Error(`${label}: start anchor not found: ${JSON.stringify(startNeedle)}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end === -1) throw new Error(`${label}: end anchor not found after start: ${JSON.stringify(endNeedle)}`);
  const block = source.slice(start, includeEnd ? end + endNeedle.length : end);
  if (block.trim().length < minChars) {
    throw new Error(`${label}: extracted block is ${block.trim().length} chars, under the ${minChars} floor`);
  }
  return block;
}

const vocabLines = (text) => text.split('\n').filter((l) => VOCAB.test(l));

// ── Constants derived from the text on disk ─────────────────────────────────────────────────────────

// The switch line the driver adds and the coder gates on. Both files state it; they must agree.
const SWITCH_LINE = 'Plan review: on — set by the owner for this fkit-sprint-ship-loop run (--plan-review, ' +
  '<date>), run <board> started <UTC>';

// The classification rule, byte-exact: the approved plan's §3.2 wording (owner-approved 2026-10-06),
// as quoted in ADR-056 Decision 1. A reword is an owner decision, not an edit.
const CLASSIFICATION = [
  '**Classify the change in one line, with your reason.** "Product" means what this project delivers to its users.',
  '- **Product change** — adds or changes what the project delivers: features, behaviour or output its users get. → the **producer and the architect** approve.',
  '- **Code-only** — internal; what the project delivers stays the same: refactors, tests, tooling, infrastructure. → the **architect** approves.',
  '- **Unclear** — you cannot tell which. → **both** approve.',
  '',
  'If an approver disputes a code-only classification, treat the task as unclear and add the producer.',
].join('\n');
const CLASSIFICATION_END = 'treat the task as unclear and add the producer.';

// Words that would make the classification rule project-specific (owner, Q1, 2026-10-02).
const NOT_GENERIC = /fkit|skill|hook|ADR|sprint/i;

// The sprint loop's allowed plan-review sentences OUTSIDE its gated block (whitespace-normalized).
const SPRINT_ALLOWLIST = [
  '**`--plan-review`** is optional and **default off — absent = off**; it turns on the opt-in plan ' +
    'review for every task planned in this run (see *Plan review — only in a `--plan-review` run*, under ' +
    '§2; [ADR-056](../../../ai-agents/knowledge-base/decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md)).',
  '- **Plan review — only when the run has it on:** the opening says *"Plan review: ON for this run"* ' +
    'and the roll-up says *"Plan review: on"* with each task\'s Codex plan-pass mode (see the gated ' +
    'block under §2). A run without `--plan-review` reports exactly as before — no plan-review line at all.',
];

// The Plan row's worker cell — the default plan step, unchanged by 0473.
const PLAN_ROW = 'run `/fkit-plan-task`; **write no source**; return the plan + open questions';

// The adversarial reviewer's fallback banner — unchanged by 0473 (ADR-054; ADR-056 Decision 4.5).
const BANNER = [
  '> ```',
  '> ⚠️ [claude-fallback — NOT model-diverse] — THIS REVIEW IS INCOMPLETE.',
  '> Codex was unreachable (<reason>), so this pass had NO independent second opinion:',
  '> the model that reviewed this code is the same model family that may have written it.',
  '> Treat it as a partial safety net, not a completed adversarial review.',
  '> Fix:  codex login   (or install Codex, then re-run the review)',
  '> ```',
].join('\n');

// ── Checkers (named, so the control arms run the very same code on mutated copies) ─────────────────

function checkPlanTask(text) {
  const { inside, outside } = split(text, PLAN_TASK, 2000);
  const leaked = vocabLines(outside);
  assert.deepEqual(leaked, [], `${PLAN_TASK}: plan-review vocabulary OUTSIDE the gated block: ` +
    `${JSON.stringify(leaked)}. Off must mean the default text is unchanged (ADR-056 Decision 4).`);
  // "Opens with": the block's first line is its heading, and the paragraph right under it is the gate.
  const heading = '## Plan review — only when the switch is on';
  assert.ok(inside.trimStart().startsWith(`${heading}\n`), `${PLAN_TASK}: the gated block does not open with ` +
    `its heading ${JSON.stringify(heading)}`);
  const gate = flat(inside.trimStart().slice(heading.length).replace(/^\n+/, '').split('\n\n')[0]);
  for (const t of [SWITCH_LINE, 'Otherwise skip this whole section']) {
    assert.ok(gate.includes(t), `${PLAN_TASK}: the gated block does not OPEN with its gate — missing ` +
      `${JSON.stringify(t)} in its first paragraph.`);
  }
  return inside;
}

function checkSprint(text) {
  const { inside, outside } = split(text, SPRINT, 2000);
  let rest = flat(outside);
  for (const s of SPRINT_ALLOWLIST) {
    const n = rest.split(s).length - 1;
    assert.equal(n, 1, `${SPRINT}: allowlisted sentence found ${n} times outside the block, expected 1: ` +
      `${JSON.stringify(s)}. Re-derive it from the text, or move the wording inside the block.`);
    rest = rest.replace(s, ' ');
  }
  const leaked = rest.match(new RegExp(`.{0,60}${VOCAB.source}.{0,60}`, 'gi')) || [];
  assert.deepEqual(leaked, [], `${SPRINT}: plan-review vocabulary outside the gated block and outside the ` +
    `allowlist: ${JSON.stringify(leaked)}`);
  return { inside, outside };
}

// ── Arms ─────────────────────────────────────────────────────────────────────────────────────────────

test('1. fkit-plan-task: one gated block, opening with its gate; no vocabulary outside it', () => {
  checkPlanTask(read(PLAN_TASK));
});

test('2. sprint loop: one gated block; outside it only the allowlist; Plan row unchanged; same switch line', () => {
  const text = read(SPRINT);
  const { inside, outside } = checkSprint(text);
  const n = text.split(PLAN_ROW).length - 1;
  assert.equal(n, 1, `${SPRINT}: the Plan row phrase ${JSON.stringify(PLAN_ROW)} occurs ${n} times, expected 1`);
  assert.ok(outside.includes(PLAN_ROW), `${SPRINT}: the Plan row phrase moved inside the gated block`);
  assert.ok(flat(inside).includes(SWITCH_LINE), `${SPRINT}: the gated block does not state the switch line ` +
    `${JSON.stringify(SWITCH_LINE)} — the driver's line and the coder's gate must be the same text`);
  assert.ok(flat(checkPlanTask(read(PLAN_TASK))).includes(SWITCH_LINE), `${PLAN_TASK}: switch line drifted`);
});

test('3. sprint loop: the argument says default off, absent = off', () => {
  const f = flat(read(SPRINT));
  for (const t of ['**`--plan-review`** is optional', '**default off — absent = off**',
    'not *how the same output looks*']) {
    assert.ok(f.includes(t), `${SPRINT}: the Argument paragraph is missing ${JSON.stringify(t)} (ADR-056 Decision 2)`);
  }
});

function checkClassification(inside) {
  const block = extract(inside, `${PLAN_TASK} classification`, '**Classify the change in one line',
    CLASSIFICATION_END, { includeEnd: true, minChars: 200 });
  assert.equal(block, CLASSIFICATION, `${PLAN_TASK}: the classification rule is not the owner-approved ` +
    'wording (approved plan §3.2; ADR-056 Decision 1). A reword needs an owner ruling.');
  const m = block.match(NOT_GENERIC);
  assert.equal(m, null, `${PLAN_TASK}: the classification rule names ${JSON.stringify(m && m[0])} — it must ` +
    'stay generic, for any project (owner, 2026-10-02).');
}

test('4. the classification rule is the approved wording and is generic', () => {
  checkClassification(checkPlanTask(read(PLAN_TASK)));
});

test('5. producer and architect carry the APPROVE / CHANGES REQUESTED reply shape', () => {
  for (const rel of [PRODUCER, ARCHITECT]) {
    const f = flat(read(rel));
    for (const t of ['**Asked to approve a plan**', '**`APPROVE`**', '**`CHANGES REQUESTED`**',
      'then numbered reasons', 'say so first', 'At hop 2 you consult no one']) {
      assert.ok(f.includes(t), `${rel}: the plan-approval reply shape is missing ${JSON.stringify(t)}`);
    }
  }
});

test('6. adversarial review: accepts a plan; the fallback banner is unchanged', () => {
  const text = read(ADV_SKILL);
  const f = flat(text);
  for (const t of ['**Or a plan:**', '**When the input is a plan**', 'never `path:line`']) {
    assert.ok(f.includes(t), `${ADV_SKILL}: plan input is missing ${JSON.stringify(t)}`);
  }
  const n = text.split(BANNER).length - 1;
  assert.equal(n, 1, `${ADV_SKILL}: the fallback banner occurs ${n} times byte-exact, expected 1 — it is ` +
    'load-bearing (ADR-054) and 0473 must not change it');
});

test('7. fkit-task-ship-loop: no plan-review vocabulary (session paths unchanged)', () => {
  const leaked = vocabLines(read(TASK_LOOP));
  assert.deepEqual(leaked, [], `${TASK_LOOP}: plan-review vocabulary found: ${JSON.stringify(leaked)}. ` +
    'ADR-056 Decision 3: session paths have no plan review; that needs a new owner ruling.');
});

function checkLead(text) {
  const bullet = flat(extract(text, `${LEAD} plan-review bullet`, '**Plan review is opt-in, per sprint-loop run',
    '\n- **', { minChars: 200 }));
  for (const t of ['`--plan-review`', '**only when the owner asks**', '**Never add it unasked**',
    'never carry it to another run']) {
    assert.ok(bullet.includes(t), `${LEAD}: the plan-review bullet is missing ${JSON.stringify(t)} (ADR-056 Decision 2)`);
  }
}

test('8. lead: passes --plan-review only when asked, never unasked', () => {
  checkLead(read(LEAD));
});

// ── Control arms ─────────────────────────────────────────────────────────────────────────────────────

test('C1. control: a plan-review line moved OUTSIDE the plan-task block goes red', () => {
  const text = read(PLAN_TASK);
  const line = '`plan review incomplete: <what>` loudly at the top. Never present it as a reviewed plan.';
  assert.ok(text.includes(line), `${PLAN_TASK}: control fixture text not found — re-derive ${JSON.stringify(line)}`);
  const moved = text.replace(`${line}\n`, '').replace(END, `${END}\n${line}`);
  assert.throws(() => checkPlanTask(moved), /OUTSIDE the gated block/,
    'arm 1 did not fail on a vocabulary line outside the markers — the checker is vacuous');
});

test('C2. control: a sprint-loop sentence outside the block and the allowlist goes red', () => {
  const text = read(SPRINT);
  const mutated = text.replace('## Hard rules\n', '## Hard rules\n- Plan review runs on every task.\n');
  assert.notEqual(mutated, text, 'control fixture: "## Hard rules" heading not found');
  assert.throws(() => checkSprint(mutated), /outside the allowlist/,
    'arm 2 did not fail on a stray plan-review sentence — the checker is vacuous');
});

test('C3. control: a missing end marker throws', () => {
  assert.throws(() => checkPlanTask(read(PLAN_TASK).replace(END, '')), /expected exactly one/);
  assert.throws(() => checkSprint(read(SPRINT).replace(END, '')), /expected exactly one/);
});

test('C4. control: a project-specific word in the classification rule goes red', () => {
  const inside = checkPlanTask(read(PLAN_TASK));
  const mutated = inside.replace('refactors, tests, tooling', 'refactors, tests, hooks, tooling');
  assert.notEqual(mutated, inside, 'control fixture: classification text not found');
  assert.throws(() => checkClassification(mutated), /approved/,
    'arm 4 did not fail on a changed classification — the checker is vacuous');
});

test('C5. control: an allowlisted sentence changed to "default on" goes red', () => {
  const text = read(SPRINT);
  const mutated = text.replace('**default off — absent =\noff**', '**default on — absent =\non**');
  assert.notEqual(mutated, text, 'control fixture: "default off — absent = off" not found as wrapped');
  assert.throws(() => checkSprint(mutated), /allowlisted sentence found 0 times/,
    'arm 2 did not fail when the default flipped — the checker is vacuous');
});

test('C6. control: the lead bullet without "Never add it unasked" goes red', () => {
  const text = read(LEAD);
  const mutated = text.replace('**Never add it unasked**, and', 'And');
  assert.notEqual(mutated, text, 'control fixture: "**Never add it unasked**" not found');
  assert.throws(() => checkLead(mutated), /Never add it unasked/,
    'arm 8 did not fail without "Never add it unasked" — the checker is vacuous');
});
