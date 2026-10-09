// The ship loops read the `drift depends-on-later-sprint` record — task 0493.
//
// THE RULE THIS FILE GUARDS. Task 0492 made `dashboard.sh` emit a `drift depends-on-later-sprint`
// record when an open row on a sprint board waits on a task this sprint cannot count on. Task 0493
// made `/fkit-sprint-ship-loop` say so to the owner — at the start of a run, and at the
// dependency-deadlock stop (step 1's bullet AND the stop table) — and made `/fkit-task-ship-loop`
// mention it at its plan gate. The incident behind both: a deadlock stop that said only "waiting",
// never that the blocker sat in a later sprint. This file pins that the words are still there:
//   1. the sprint loop's step 1 names the record at least twice (start-of-run bullet + deadlock bullet),
//      and tells the driver to name the row a `via=` record waits through;
//   2. the stop table's `Dependency deadlock` row names it;
//   3. step 1 words all five `reason` values; no `sprint-unresolved` wording says "later", and an empty
//      `blocker_sprint` has its own wording;
//   4. fkit-status still lists the record kind — so a rename breaks both sides;
//   5. the task loop's plan gate (step 3) names it, names the `via=` row, and says a check that did not
//      run is never "no record";
//   6. the mid-run sentence (step 5) and the "Opening the run" sentence name it (review round 1, R2).
//
// SCOPE: the fourth test-scope category — an invariant over the repo's own shipped content — as
// established by test/task-id-uniqueness.test.js's header. ADR-014 governs the mechanics (node --test,
// zero devDependencies, hand-rolled).
//
// ⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT. It guards SOURCE TEXT, never runtime obedience: a green
// run says the words sit where they should, not that a driver reads the record or words it right. It
// reads `claude/` ONLY — never the gitignored `.claude/` copies, never `ai-agents/` (so it needs no
// `test:docs` entry).
//
// NO `path:NNN` COORDINATES. Anchors are quoted headings and phrases. THIS TEST READS THE REPO,
// read-only, and writes nothing anywhere.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const SPRINT = 'claude/skills/fkit-sprint-ship-loop/SKILL.md';
const TASK_LOOP = 'claude/skills/fkit-task-ship-loop/SKILL.md';
const STATUS = 'claude/skills/fkit-status/SKILL.md';

const KIND = 'drift depends-on-later-sprint';
const REASONS = ['backlog-board', 'not-started', 'later-sprint', 'sprint-closed', 'sprint-unresolved'];

const read = (rel) => readFileSync(join(REPO, rel), 'utf8');
const norm = (s) => s.replace(/\s+/g, ' ');

// Throwing extractor: the text from `start` up to (not including) `end`. A missing anchor is a
// failure, never an empty section that passes vacuously.
function between(text, start, end, rel) {
  const i = text.indexOf(start);
  if (i < 0) throw new Error(`${rel}: anchor not found: ${JSON.stringify(start)}`);
  const j = text.indexOf(end, i + start.length);
  if (j < 0) throw new Error(`${rel}: end anchor not found after ${JSON.stringify(start)}: ${JSON.stringify(end)}`);
  return text.slice(i, j);
}

const sprintStep1 = () => norm(between(read(SPRINT), '### 1.', '### 2.', SPRINT));
const count = (hay, needle) => hay.split(needle).length - 1;

test('0493: the sprint loop step 1 names the record at the run start AND the deadlock stop', () => {
  const s1 = sprintStep1();
  assert.ok(count(s1, KIND) >= 2,
    `${SPRINT} step 1 must name \`${KIND}\` at least twice (start-of-run bullet + deadlock bullet); found ${count(s1, KIND)}`);
  const at = s1.indexOf('**Dependency deadlock**');
  assert.ok(at >= 0, `${SPRINT} step 1 lost its Dependency deadlock bullet`);
  // The deadlock bullet is the last one in step 1, so it runs to the end of the section.
  assert.ok(s1.slice(at).includes('depends-on-later-sprint'),
    `${SPRINT} step 1's Dependency deadlock bullet must name \`depends-on-later-sprint\``);
  assert.ok(s1.includes('For a `via=` record, name the row it waits through'),
    `${SPRINT} step 1 must tell the driver to name the row a \`via=\` record waits through`);
});

test('0493: the stop table\'s Dependency deadlock row names the record', () => {
  const rows = read(SPRINT).split('\n').filter((l) => l.startsWith('| **Dependency deadlock**'));
  assert.equal(rows.length, 1, `${SPRINT}: expected exactly one stop-table row starting "| **Dependency deadlock**", found ${rows.length}`);
  assert.ok(rows[0].includes('depends-on-later-sprint'),
    `${SPRINT}: the stop table's Dependency deadlock row must name \`depends-on-later-sprint\``);
});

test('0493: step 1 words every `reason`, and never calls `sprint-unresolved` "later"', () => {
  const s1 = sprintStep1();
  for (const r of REASONS) {
    assert.ok(s1.includes(`\`${r}\` → "`),
      `${SPRINT} step 1 must word reason \`${r}\` (as \`${r}\` → "…")`);
  }
  assert.equal(unresolvedLaterProblem(s1), null);
});

// The `sprint-unresolved` wording runs from `\`sprint-unresolved\` → ` up to ` — never "later"`. Every
// quoted phrase in it is what the driver says, so none of them may contain "later"; and the empty
// `blocker_sprint` case must have its own wording. Returns the problem, or null.
function unresolvedLaterProblem(s1) {
  const start = s1.indexOf('`sprint-unresolved` → "');
  if (start < 0) return 'no `sprint-unresolved` → "…" wording';
  const end = s1.indexOf(' — never "later"', start);
  if (end < 0) return 'the `sprint-unresolved` wording does not say it is never "later"';
  const seg = s1.slice(start, end);
  const said = seg.match(/"[^"]*"/g) || [];
  if (said.length === 0) return 'the `sprint-unresolved` wording quotes nothing';
  const bad = said.find((q) => /later/i.test(q));
  if (bad) return `the \`sprint-unresolved\` wording says "later": ${bad}`;
  if (!/when `blocker_sprint` is empty, "[^"]+"/.test(seg)) return 'no wording for an empty `blocker_sprint`';
  return null;
}

test('0493: fkit-status still lists the record kind the loops read', () => {
  assert.ok(read(STATUS).includes(KIND),
    `${STATUS} no longer lists \`${KIND}\` — the ship loops name it; rename both sides together`);
});

test('0493: the task loop names the record at its plan gate (step 3)', () => {
  const t = read(TASK_LOOP);
  const s3 = norm(between(t, '3. **⛔ STOP — plan approval.**', '4. **Persist the plan', TASK_LOOP));
  assert.ok(s3.includes('depends-on-later-sprint'),
    `${TASK_LOOP} step 3 (the plan gate) must name \`depends-on-later-sprint\``);
  assert.ok(s3.includes('for a `via=` record the row it waits through'),
    `${TASK_LOOP} step 3 must name the row a \`via=\` record waits through`);
  assert.ok(s3.includes('say the check did not run — never that there is no record'),
    `${TASK_LOOP} step 3 must say a check that did not run is never "no record"`);
  // Order (review round 3, R7): the board is rendered and checked BEFORE the gate waits — otherwise
  // the owner can approve before the record is shown.
  const wait = s3.indexOf('and wait');
  assert.ok(wait >= 0, `${TASK_LOOP} step 3 lost "and wait"`);
  for (const p of ['dashboard.sh <plan>', 'say the check did not run']) {
    const at = s3.indexOf(p);
    assert.ok(at >= 0 && at < wait, `${TASK_LOOP} step 3: "${p}" must come before "and wait"`);
  }
});

test('0493: the mid-run sentence (step 5) and the "Opening the run" sentence name the record', () => {
  const t = read(SPRINT);
  const s5 = norm(between(t, '### 5. Advance', '\n---', SPRINT));
  assert.ok(s5.includes('carries a `drift depends-on-later-sprint` record the owner has not yet been told of'),
    `${SPRINT} step 5 must re-check the record mid-run, before the next spawn`);
  const open = norm(between(t, '- **Opening the run:**', '- **Per task:**', SPRINT));
  assert.ok(open.includes('**If the board carries a `drift depends-on-later-sprint` record, the opening says so**'),
    `${SPRINT} "Opening the run" must say the opening names the record`);
});

// Control arm — the extractor throws on a missing anchor, so no section passes vacuously.
test('0493/control: a missing anchor throws, never yields an empty section', () => {
  assert.throws(() => between('abc', 'zzz', 'c', 'fixture'), /anchor not found/);
  assert.throws(() => between('abc', 'a', 'zzz', 'fixture'), /end anchor not found/);
  assert.equal(count('x drift depends-on-later-sprint y drift depends-on-later-sprint', KIND), 2);
});

// Control arm — the "never later" checker is not vacuous: it reds a wording that says "later".
test('0493/control: the `sprint-unresolved` checker reds a wording that says "later"', () => {
  const ok = '`sprint-unresolved` → "on `X`, a sprint the board cannot place", or, when `blocker_sprint` is empty, "with no sprint set" — never "later" (…)';
  assert.equal(unresolvedLaterProblem(ok), null);
  assert.match(unresolvedLaterProblem(ok.replace('cannot place', 'cannot place, a later sprint')), /says "later"/);
  assert.match(unresolvedLaterProblem(ok.replace(', or, when `blocker_sprint` is empty, "with no sprint set"', '')), /empty/);
  assert.match(unresolvedLaterProblem(ok.replace(' — never "later"', '')), /never "later"/);
});
