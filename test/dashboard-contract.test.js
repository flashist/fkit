// The dashboard contract suite — claude/skills/fkit-status/dashboard.sh (ADR-017 rule 4).
//
// SCOPE: ADR-014 §2 fenced fkit's test scope at "exactly two things" (the argv handed to `claude`, and
// the skillOverrides map). ADR-017 rule 4 WIDENS that fence to a third: the stdout contract of a
// shipped skill executable. This suite is that third thing. It is not a scope violation — it is the
// recorded widening. See adr-017 §Decision 4.
//
// The renderer is a pure function of (sprint plan + the briefs it links) -> (stdout, exit code), so it
// tests as fixtures-in, exact-text-out. No model, no auth, no network.
//
// ⚠️ DELIBERATELY NOT ROUTED THROUGH THE LAUNCHER. harness.mjs's makeProject() spawns fkit-claude.sh
// and stubs `claude` on PATH; this script needs none of that — it needs a fixture directory. Testing a
// pure function through `exec claude` would be testing the wrong boundary (design spec §7 caveat). We
// reuse only REPO and cleanup() from the harness.
//
// ⚠️ Invoked as `bash <path>`, never `./<path>` — mirroring the skill's real call site, which is what
// makes the exec bit irrelevant (ADR-017 rule 2). A test that ran ./dashboard.sh would pass here and
// prove nothing about a consumer's machine.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO, cleanup } from './harness.mjs';

const SCRIPT = join(REPO, 'claude', 'skills', 'fkit-status', 'dashboard.sh');
const MADE = [];
after(() => MADE.forEach(cleanup));

// Build a throwaway ai-agents/ tree. `briefs` maps "<dir>/<file>.md" -> brief body fields.
function fixture({ plan, briefs = {}, planDir = 'sprints' }) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/backlog', 'tasks/done', 'tasks/cancelled', 'sprints', 'sprints/done']) {
    mkdirSync(join(agents, d), { recursive: true });
  }
  for (const [rel, body] of Object.entries(briefs)) {
    writeFileSync(join(agents, 'tasks', rel), body);
  }
  const planPath = join(agents, planDir, 'sprint-1.md');
  writeFileSync(planPath, plan);
  return planPath;
}

function brief({ title = 'T', sprint = 'Sprint 1', status = '🔲 Backlog', priority = 1, extra = '' }) {
  return `# ${title}\n\n## Sprint\n${sprint}\n\n## Priority\n${priority}\n\n## Status\n${status}\n\n## Context\n\nBody.\n${extra}\n`;
}

// A plan with the given table rows (each already a `| … |` line).
function plan(rows, { title = '# Sprint 1 — Test', extraSections = '' } = {}) {
  return `${title}\n\nIntro prose that claims 99 tickets, which is a lie the script must ignore.\n\n## Status\n\n| Status | Priority | Task | Brief |\n|---|---|---|---|\n${rows.join('\n')}\n\n## Notes\n\nTail.\n${extraSections}\n`;
}

function run(planPath) {
  const r = spawnSync('bash', [SCRIPT, planPath], { encoding: 'utf8' });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}

// The rendered board rows (between the delimiters), excluding header and separator.
function boardRows(out) {
  const body = out.split('⟦BOARD⟧')[1].split('⟦FACTS⟧')[0];
  return body.split('\n').filter((l) => l.startsWith('| ') && !l.startsWith('| Status |'));
}
function facts(out) {
  return out.split('⟦FACTS⟧')[1].split('⟦END⟧')[0].trim().split('\n').filter(Boolean);
}
function rollup(out) {
  const body = out.split('⟦BOARD⟧')[1].split('⟦FACTS⟧')[0];
  return body.split('\n').find((l) => l.includes('—  of '));
}
// Sum the roll-up's numeric terms — the invariant the whole task exists for.
function rollupSum(out) {
  return rollup(out)
    .split('—  of ')[0]
    .split('·')
    .map((t) => parseInt(t.trim(), 10))
    .filter((n) => !Number.isNaN(n))
    .reduce((a, b) => a + b, 0);
}

// 1 — a clean sprint renders, and the roll-up carries NON-ZERO TERMS ONLY (no zero-filled slots).
test('clean sprint: board renders; roll-up prints only non-zero terms', () => {
  const p = fixture({
    plan: plan([
      '| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |',
      '| 🔲 Backlog | 2 | Beta | [`b.md`](../tasks/backlog/b.md) |',
    ]),
    briefs: {
      'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }),
      'backlog/b.md': brief({ title: 'Beta', priority: 2 }),
    },
  });
  const { code, out } = run(p);
  assert.equal(code, 0);
  assert.match(out, /^⟦fkit-dashboard v1⟧/);
  assert.equal(boardRows(out).length, 2);
  assert.equal(rollup(out).trim(), '1 done · 1 backlog  —  of 2');
  assert.doesNotMatch(rollup(out), /0 /, 'zero-filled slots are the N/A-grade anti-pattern');
});

// 2 — THE invariant: counts sum to M, and M is the ROW COUNT, never a number the plan's prose quotes.
test('counts sum to M, and M is the row count — not the prose', () => {
  const rows = [];
  const briefs = {};
  for (let i = 1; i <= 7; i++) {
    rows.push(`| ✅ Done | ${i} | T${i} | [\`t${i}.md\`](../tasks/done/t${i}.md) |`);
    briefs[`done/t${i}.md`] = brief({ title: `T${i}`, status: '✅ Done', priority: i });
  }
  rows.push('| 🔲 Backlog | 8 | T8 | [`t8.md`](../tasks/backlog/t8.md) |');
  briefs['backlog/t8.md'] = brief({ title: 'T8', priority: 8 });

  const { out } = run(fixture({ plan: plan(rows), briefs }));
  assert.match(rollup(out), /—  of 8$/, 'M is the row count, not the prose "99 tickets"');
  assert.equal(rollupSum(out), 8, 'the roll-up terms must sum to M');
  assert.ok(facts(out).includes('total 8'));
});

// 3 — disagreement drift: the `waiting on owner` OVERRIDE + the fact + the roll-up clause.
test('disagreement drift: waiting on owner override, fact, and roll-up clause', () => {
  const p = fixture({
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    // Plan says Done and it sits in done/ — but the brief still reads Backlog. The live task-34/35 gap.
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '🔲 Backlog', priority: 1 }) },
  });
  const { out } = run(p);
  assert.match(boardRows(out)[0], /\| waiting on owner \|$/, 'a drifted ✅ row reads waiting on owner, not closed');
  assert.ok(facts(out).some((f) => f.startsWith('drift disagreement 1 ')), 'the fact must be emitted');
  assert.match(rollup(out), /drift on tasks 1 — see above\./);
  assert.equal(rollupSum(out), 1, 'drift does not break the sum');
});

// 4 — ⚠️ THE SPLIT THAT MATTERS. Nonconformance does NOT take the override: a cancelled row stays
// `dead`. Printing `waiting on owner` on five dead rows makes a graveyard look like a to-do list.
test('nonconformance (⛔ without a reason): fact emitted, next step STAYS dead', () => {
  const p = fixture({
    plan: plan(['| ⛔ Cancelled (2026-07-11) | 1 | Alpha | [`a.md`](../tasks/cancelled/a.md) |']),
    briefs: { 'cancelled/a.md': brief({ title: 'Alpha', status: '⛔ Cancelled (2026-07-11)', priority: 1 }) },
  });
  const { out } = run(p);
  assert.ok(
    facts(out).some((f) => f.includes('drift nonconformance 1 kind="cancelled-without-reason"')),
    'a ⛔ cell with no — reason is nonconformance',
  );
  assert.match(boardRows(out)[0], /\| dead \|$/, 'nonconformance must NOT take the waiting-on-owner override');
});

// 5 — ⚠️ MATTERS. A ➡️ Moved row whose brief's ## Sprint matches the target is NOT drift. Flagging it
// would flag every moved row of every closed sprint forever, and hand the owner phantom decisions.
test('➡️ Moved with a matching brief ## Sprint: NOT drift; next step is in Sprint N', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 12 (rescoped) | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    // The brief lives in backlog/ reading `🔲 Backlog` — CORRECT for its new sprint.
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 2', status: '🔲 Backlog', priority: 12 }) },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'a correctly-moved row is not drift');
  assert.match(boardRows(out)[0], /\| in Sprint 2 \|$/);
  assert.doesNotMatch(rollup(out), /drift/);
});

// 6 — ⚠️ MATTERS. The other half of rule 2: the ➡️ target IS checked against the brief's ## Sprint.
test('➡️ Moved whose target disagrees with the brief ## Sprint: IS drift', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 12 | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 5', status: '🔲 Backlog', priority: 12 }) },
  });
  const { out } = run(p);
  assert.ok(
    facts(out).some((f) => f.includes('drift disagreement 1') && f.includes('moved_target="Sprint 2"') && f.includes('brief_sprint="Sprint 5"')),
    'plan says moved to Sprint 2, brief claims Sprint 5 — real drift',
  );
  assert.match(boardRows(out)[0], /\| waiting on owner \|$/);
});

// 6b — ⚠️ Rule 1 in its GENERAL form, not just via a ➡️ row. The brief's ## Sprint is read FIRST: if
// it names a different sprint than the plan, the status cross-check is SKIPPED entirely — the brief
// belongs to that other sprint now and its status is that sprint's business. Without this, a closed
// plan flags every departed row forever and hands the owner phantom decisions.
// (Caught by mutation testing: tests 5/6 only covered the `moved` branch and left this one green.)
test('rule 1: a brief claiming another sprint skips the status cross-check, even on a non-moved row', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    // Plan (Sprint 1) says Backlog; the brief says ✅ Done — but the brief has moved on to Sprint 2,
    // so its status is not this plan's to reconcile.
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 2', status: '✅ Done', priority: 1 }) },
  });
  const { out } = run(p);
  assert.equal(
    facts(out).filter((f) => f.startsWith('drift disagreement')).length,
    0,
    'the brief belongs to another sprint — not this plan\'s drift to report',
  );
  assert.doesNotMatch(boardRows(out)[0], /waiting on owner/, 'and it must not take the override');
});

// 7 — link rot (tasks 21/22): the plan links backlog/, the brief is in done/. Resolve it, report it,
// and render the CORRECTED link — a script that trusts a stale link renders a broken board.
test('link rot: brief resolved by filename, relocated fact, corrected link rendered', () => {
  const p = fixture({
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }) },
  });
  const { out } = run(p);
  assert.ok(
    facts(out).some((f) => f.includes('drift relocated 1') && f.includes('found="../tasks/done/a.md"')),
    'the relocation is reported',
  );
  assert.match(boardRows(out)[0], /\(\.\.\/tasks\/done\/a\.md\)/, 'the board renders the corrected link');
});

// 8 — a missing brief is reported, and THE ROW STILL RENDERS. A board that drops a row lies about scope.
test('missing brief: fact emitted, row still renders', () => {
  const p = fixture({ plan: plan(['| 🔲 Backlog | 1 | Ghost | [`gone.md`](../tasks/backlog/gone.md) |']), briefs: {} });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.includes('drift missing-brief 1')));
  assert.equal(boardRows(out).length, 1, 'the row still renders');
  assert.equal(rollupSum(out), 1);
});

// 9 — the sentinel carries the RAW Depends on: text. The script never interprets it: `ready` vs
// `after N` is the one column the skill calls the easiest place to start making things up.
test('🔲 with a Depends on: line → ⟨derive: …⟩ carrying the raw text, never a guess', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on: task 26 and task 27.**\n' }) },
  });
  const { out } = run(p);
  assert.match(boardRows(out)[0], /⟨derive: task 26 and task 27\.⟩/, 'raw text, verbatim');
  assert.ok(facts(out).some((f) => f === 'derive 1 depends="task 26 and task 27."'));
  assert.doesNotMatch(boardRows(out)[0], /after 26|ready/, 'the script must never resolve the dependency itself');
});

test('no Depends on: line → ⟨derive: none recorded⟩ — still not a guess', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1 }) },
  });
  const { out } = run(p);
  assert.match(boardRows(out)[0], /⟨derive: none recorded⟩/);
});

// 10 — a ## Status value is free text that MAY WRAP. Match the marker PREFIX, not the whole line.
test('brief ## Status wrapping across lines: matched by marker prefix', () => {
  const p = fixture({
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    briefs: {
      'done/a.md': brief({
        title: 'Alpha',
        priority: 1,
        status: '✅ Done — landed after a long review that\nspilled onto a second line and kept going.',
      }),
    },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'the wrapped ✅ matches ✅ — no phantom drift');
  assert.match(boardRows(out)[0], /\| closed \|$/);
});

// 11 — a malformed plan exits NON-ZERO with a message on stderr. This is what drives the skill's
// short flagged fallback (§5.4): degrade loudly, never wall the owner out of their own status.
test('malformed plan (no ## Status table): non-zero exit, message on stderr', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  mkdirSync(join(root, 'ai-agents', 'tasks', 'backlog'), { recursive: true });
  mkdirSync(join(root, 'ai-agents', 'sprints'), { recursive: true });
  const p = join(root, 'ai-agents', 'sprints', 'sprint-1.md');
  writeFileSync(p, '# Sprint 1\n\nNo status section at all.\n');
  const { code, err } = run(p);
  assert.notEqual(code, 0, 'must fail loudly, not emit an empty board');
  assert.match(err, /dashboard\.sh:/);
});

test('missing plan file: non-zero exit, message on stderr', () => {
  const { code, err } = run('/nonexistent/sprint-99.md');
  assert.notEqual(code, 0);
  assert.match(err, /no such sprint plan/);
});

// 12 — a reason recorded as a paragraph is trimmed; the table NEVER wraps.
test('paragraph-length reason in a cell: trimmed, and no cell ever contains a newline', () => {
  const long = 'x'.repeat(400);
  const p = fixture({
    plan: plan([`| 🚧 Blocked — ${long} | 1 | Alpha | [\`a.md\`](../tasks/backlog/a.md) |`]),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', status: '🚧 Blocked — reason', priority: 1 }) },
  });
  const { out } = run(p);
  const row = boardRows(out)[0];
  assert.equal(boardRows(out).length, 1, 'one row per task — the long cell must not wrap into a second');
  assert.ok(row.length < 400, 'the paragraph reason is trimmed');
  assert.match(row, /…/, 'and the trim is visible, not silent');
});

// 13 — two ## Status tables: parse the FIRST and REPORT the fact. The script must not silently pick
// one of two candidate boards. No such plan exists today; this is a hand-edit guard.
test('two ## Status sections: the first is parsed, and the ambiguity is reported', () => {
  const p = fixture({
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |'], {
      extraSections: '\n## Status\n\n| Status | Priority | Task | Brief |\n|---|---|---|---|\n| 🔲 Backlog | 9 | Decoy | [`z.md`](../tasks/backlog/z.md) |\n',
    }),
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }) },
  });
  const { out } = run(p);
  assert.equal(boardRows(out).length, 1, 'only the first table is parsed');
  assert.doesNotMatch(out, /Decoy/, 'the second table is not silently merged in');
  assert.ok(facts(out).some((f) => f.includes('drift multiple-status-tables count=2')), 'reported, not guessed');
});

// The unrecognized bucket exists so that a marker outside the closed six cannot silently vanish from
// the roll-up. `counts sum to M` is BY CONSTRUCTION — an unbucketed row would break it silently.
test('a marker outside the six: reported as nonconformance and still counted', () => {
  const p = fixture({
    plan: plan([
      '| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |',
      '| WIP | 2 | Beta | [`b.md`](../tasks/backlog/b.md) |',
    ]),
    briefs: {
      'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }),
      'backlog/b.md': brief({ title: 'Beta', priority: 2 }),
    },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.includes('drift nonconformance 2 kind="unknown-marker"')));
  assert.equal(rollupSum(out), 2, 'an unrecognized marker must not vanish from the sum');
  assert.match(rollup(out), /1 unrecognized/);
});

// The FACTS grammar is what beats 2 and 6 narrate from. A `"` inside a value (live: sprint-2 task 36
// quotes the owner) would close the field early and hand the skill an unparseable record.
test('a quote inside a Depends on: line cannot break the key="value" grammar', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on: the owner said "after 25 lands".**\n' }) },
  });
  const { out } = run(p);
  const f = facts(out).find((l) => l.startsWith('derive 1'));
  assert.equal((f.match(/"/g) || []).length, 2, 'exactly the two delimiting quotes survive');
});
