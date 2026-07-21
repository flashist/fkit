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
//
// ⚠️ POST-MIGRATION LAYOUT (task 76). A brief now lives at `tasks/<board>/<NNNN>-<slug>/brief.md`,
// not `tasks/<board>/<slug>.md`. This helper folds each brief into a folder transparently: it assigns
// a deterministic 4-digit ID (insertion order), writes the brief as `brief.md` inside `<ID>-<slug>/`,
// injects a matching `## ID` field (so the `id-mismatch` drift check stays silent), and folder-izes
// every task href in the plan text — `../tasks/<B>/<slug>.md` → `../tasks/<B>/<ID>-<slug>/brief.md`,
// PRESERVING the board token `<B>` the test wrote so the link-rot/relocation cases still fire. Tests
// keep writing the flat `slug.md` shape in their inline rows and briefs maps; the fold is invisible
// to them except where a test pins exact stdout (those expectations carry the folder href).
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Shared fold: assign a deterministic 4-digit ID per brief (insertion order), write it as `brief.md`
// inside `<board>/<ID>-<slug>/`, inject a matching `## ID`, and folder-ize the plan's task hrefs
// (keeping the board token the caller wrote). Returns the rewritten plan text. Used by both fixtures.
function foldBriefsAndPlan(agents, briefs, planText) {
  let seq = 0;
  const idBySlug = {};
  for (const [rel, body] of Object.entries(briefs)) {
    const [board, file] = rel.split('/');
    const slug = file.replace(/\.md$/, '');
    seq += 1;
    const id = String(seq).padStart(4, '0');
    idBySlug[slug] = id;
    const folder = join(agents, 'tasks', board, `${id}-${slug}`);
    mkdirSync(folder, { recursive: true });
    const withId = /\n## ID\n/.test(body)
      ? body
      : body.replace(/^(# .*\n\n)/, `$1## ID\n${id}\n\n`);
    writeFileSync(join(folder, 'brief.md'), withId);
  }
  let out = planText;
  for (const [slug, id] of Object.entries(idBySlug)) {
    out = out.replace(
      new RegExp(`(\\.\\./(?:\\.\\./)?tasks/(?:backlog|done|cancelled)/)${escapeRe(slug)}\\.md`, 'g'),
      (_m, prefix) => `${prefix}${id}-${slug}/brief.md`,
    );
  }
  return out;
}

function fixture({ plan, briefs = {}, planDir = 'sprints' }) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/backlog', 'tasks/done', 'tasks/cancelled', 'sprints', 'sprints/done']) {
    mkdirSync(join(agents, d), { recursive: true });
  }
  const planText = foldBriefsAndPlan(agents, briefs, plan);
  const planPath = join(agents, planDir, 'sprint-1.md');
  writeFileSync(planPath, planText);
  return planPath;
}

function brief({ title = 'T', sprint = 'Sprint 1', status = '🔲 Backlog', priority = 1, id = null, extra = '' }) {
  const idBlock = id ? `## ID\n${id}\n\n` : '';
  return `# ${title}\n\n${idBlock}## Sprint\n${sprint}\n\n## Priority\n${priority}\n\n## Status\n${status}\n\n## Context\n\nBody.\n${extra}\n`;
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
  // The board shows OPEN WORK ONLY (task 65) — the clean ✅ row is omitted. The roll-up is unchanged
  // and still counts it, which is the whole mitigation: rows hidden, scope visible.
  assert.equal(boardRows(out).length, 1, 'the done row is filtered out of the board');
  assert.match(boardRows(out)[0], /Beta/);
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
  // ➡️ Moved is the third inert state and is filtered from the board (task 65). The `in Sprint N`
  // next-step rendering is covered by the clause-trim test below, whose no-brief fixture renders a
  // moved row via `missing-brief` drift WITHOUT a disagreement — the only combination that still
  // reaches `in Sprint N`. ⚠️ NOT by the disagreeing-target test that follows this one: disagreement
  // takes the `waiting on owner` override, so it can never assert this shape. An earlier revision of
  // this comment claimed it did, and the shape silently lost all coverage (review R1).
  assert.equal(boardRows(out).length, 0, 'a clean moved row is off the board');
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
    facts(out).some((f) => f.includes('drift relocated 1') && f.includes('found="../tasks/done/0001-a/brief.md"')),
    'the relocation is reported',
  );
  assert.match(boardRows(out)[0], /\(\.\.\/tasks\/done\/0001-a\/brief\.md\)/, 'the board renders the corrected link');
});

// 8 — a missing brief is reported, and THE ROW STILL RENDERS. A board that drops a row lies about scope.
test('missing brief: fact emitted, row still renders', () => {
  // Folder-shape href to a folder that does not exist → missing-brief (not malformed: nothing is there).
  const p = fixture({ plan: plan(['| 🔲 Backlog | 1 | Ghost | [`gone`](../tasks/backlog/0099-gone/brief.md) |']), briefs: {} });
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
  // Clean ✅ ⇒ filtered from the board (task 65). For an inert marker, "absent" is equivalent to
  // "undrifted": a phantom drift fact would have forced the row to render.
  assert.equal(boardRows(out).length, 0, 'no drift, so the done row stays off the board');
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

// 12 — a reason recorded as a paragraph is trimmed to its FIRST CLAUSE; the table NEVER wraps.
// ⚠️ The fixture must contain a REAL clause boundary. The original used a single 400-char token and
// asserted only `length < 400` + the presence of `…` — which passes against ANY truncation, and so
// blessed a byte-cap implementation that did not honour the contract at all (R11/R12). Assert the
// trim POINT, not merely that something got shorter.
test('paragraph reason in a cell: trimmed at the first clause boundary', () => {
  const p = fixture({
    plan: plan(['| 🚧 Blocked — the owner must rule first. Then a second clause. And a third. | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', status: '🚧 Blocked — reason', priority: 1 }) },
  });
  const { out } = run(p);
  const cells = boardRows(out)[0].split('|').map((c) => c.trim());
  assert.equal(cells[1], '🚧 Blocked — the owner must rule first…', 'cut at the first ". ", ellipsis visible');
  assert.equal(boardRows(out).length, 1, 'one row per task — never wraps into a second');
});

// A short multi-clause cell is NOT immune just because it is under some byte count, and a long
// single-clause cell is NOT cut mid-sentence. Both were wrong under the byte cap (R12).
test('the clause trim is not a byte count: long single clause survives whole', () => {
  const oneClause = `🔲 Backlog — ${'word '.repeat(40).trim()}`;
  const p = fixture({
    plan: plan([`| ${oneClause} | 1 | Alpha | [\`a.md\`](../tasks/backlog/a.md) |`]),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1 }) },
  });
  const { out } = run(p);
  const cells = boardRows(out)[0].split('|').map((c) => c.trim());
  assert.equal(cells[1], oneClause, 'no clause boundary → nothing to trim, however long');
  assert.doesNotMatch(cells[1], /…/);
});

// ⚠️ A markdown link contains a period (`sprint-2.md`). Cutting at the first bare `.` would sever it.
// The boundary is period-SPACE. This is why every live ➡️ Moved cell survives.
test('the clause trim never severs a markdown link in a moved cell', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 12 (rescoped) | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    // ⚠️ NO BRIEF, deliberately. A clean ➡️ Moved row is filtered off the board (task 65), so this
    // presentation test needs the row to RENDER: the resulting `missing-brief` drift forces it back
    // on. The Status cell — the only thing under test — is byte-for-byte what it always was.
    briefs: {},
  });
  const { out } = run(p);
  const cells = boardRows(out)[0].split('|').map((c) => c.trim());
  assert.match(cells[1], /\(\.\.\/sprint-2\.md\)/, 'the link survives intact');
  assert.doesNotMatch(cells[1], /…/);
  // ⚠️ THE SOLE SURVIVING COVERAGE of the `in Sprint N` next-step shape (review R1). It lives here,
  // on a presentation test, because this is the only fixture left that renders a moved row without a
  // disagreement — every other moved row is either filtered off the board (clean) or overridden to
  // `waiting on owner` (disagreeing). Do not remove it, and do not give this fixture a brief.
  assert.match(boardRows(out)[0], /\| in Sprint 2 \|$/, 'moved rows still resolve to `in Sprint N`');
});

// 13 — two ## Status tables: parse the FIRST and REPORT the fact. The script must not silently pick
// one of two candidate boards. No such plan exists today; this is a hand-edit guard.
test('two ## Status sections: the first is parsed, and the ambiguity is reported', () => {
  const p = fixture({
    // ⚠️ An OPEN row, so the board-length assertion below measures table selection rather than the
    // task-65 open-work filter. With a ✅ row here, "1 row" and "0 rows" would both be explicable and
    // the test would stop discriminating.
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |'], {
      extraSections: '\n## Status\n\n| Status | Priority | Task | Brief |\n|---|---|---|---|\n| 🔲 Backlog | 9 | Decoy | [`z.md`](../tasks/backlog/z.md) |\n',
    }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1 }) },
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

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Round-1 review regressions (ledger: ai-agents/reviews/build-deterministic-dashboard-script-for-
// fkit-status.md). Each pins a defect that shipped green because the suite asserted substrings
// rather than exact output (R10). Fixture-shaped gaps, not code-shaped: mutation testing could not
// have surfaced them, because no fixture contained the triggering input.
// ─────────────────────────────────────────────────────────────────────────────────────────────────

// R10 — ⚠️ THE KEYSTONE. §7 mandates "assert exact stdout"; nothing did, which is *why* R2/R3/R7
// shipped green. This pins the whole contract at once: row rendering, fact ordering, the roll-up's
// exact spacing, AND the absence of any extra record.
test('R10: exact stdout — the full contract, pinned byte for byte', () => {
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
  assert.equal(out, [
    '⟦fkit-dashboard v1⟧',
    '⟦BOARD⟧',
    '| Status | # | Task | Filename | Next step |',
    '|---|---|---|---|---|',
    // ⚠️ The ✅ row is ABSENT BY DESIGN (task 65: the board shows open work only). The roll-up below
    // still reads `1 done · 1 backlog  —  of 2` — that mismatch between rows shown and rows counted
    // is the contract, not a bug. Do not "restore" the done row to make them agree.
    '| 🔲 Backlog | 2 | Beta | [`b.md`](../tasks/backlog/0002-b/brief.md) | ⟨derive: none recorded⟩ |',
    '',
    '1 done · 1 backlog  —  of 2',
    '⟦FACTS⟧',
    'total 2',
    'count done 1',
    'count backlog 1',
    'derive 2 depends="none recorded"',
    '⟦END⟧',
    '',
  ].join('\n'));
});

// R1 — ⚠️ the extractor must find the DECLARATION, not prose that merely mentions the field. This
// reproduced live on this script's own task brief: the sentinel rendered `⟨derive: ` line is⟩`.
// The LLM is forbidden to re-open the brief, so a mis-located field means it derives from garbage.
test('R1: a brief that discusses `Depends on:` in prose does not poison the sentinel', () => {
  const decoy = [
    '',
    'Some prose about the format: `Depends on:` is free text and cannot be parsed reliably.',
    '',
    '- **Depends on: task 26 and task 27.**',
    '',
  ].join('\n');
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: decoy }) },
  });
  const { out } = run(p);
  assert.ok(
    facts(out).includes('derive 1 depends="task 26 and task 27."'),
    'the bold declaration wins over the earlier code-span prose',
  );
});

// R1 — the declaration is NOT always at column 1; anchoring to line-start would miss live briefs.
test('R1: a mid-line bold declaration is still found', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\nSome lead-in prose. **Depends on: task 5.**\n' }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).includes('derive 1 depends="task 5."'));
});

// R2 — ⚠️ §9's flagship invariant. A row that does not parse must NOT vanish: `M` is the table's row
// count, not "rows that survived parsing". Owner ruled hard-fail (a) → the skill's flagged fallback.
test('R2: an unparseable row hard-fails rather than silently vanishing from the board', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  mkdirSync(join(agents, 'tasks', 'done'), { recursive: true });
  mkdirSync(join(agents, 'sprints'), { recursive: true });
  writeFileSync(join(agents, 'tasks', 'done', 'a.md'), brief({ title: 'Alpha', status: '✅ Done' }));
  const planPath = join(agents, 'sprints', 'sprint-1.md');
  writeFileSync(planPath, [
    '# Sprint 1 — Test', '', '## Status', '',
    '| Status | Priority | Task | Brief |',
    '|---|---|---|---|',
    '| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |',
    '| BROKEN ROW',
    '',
  ].join('\n'));
  const { code, out, err } = run(planPath);
  assert.notEqual(code, 0, 'must not exit 0 with a row quietly missing');
  assert.match(err, /unparseable row/);
  assert.doesNotMatch(out, /of 1/, 'must never redefine M as the surviving-row count');
});

// R3 — ⚠️ §9's protected split. An out-of-vocabulary marker is NONCONFORMANCE, and nonconformance
// does not take the `waiting on owner` override. Structural: an unknown marker can never equal the
// brief's key, so an unguarded rule 3 fires on every such row.
test('R3: an out-of-vocabulary marker does NOT take the waiting-on-owner override', () => {
  const p = fixture({
    plan: plan(['| WIP | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }) },
  });
  const { out } = run(p);
  assert.doesNotMatch(boardRows(out)[0], /waiting on owner/, 'nonconformance must not take the override');
  assert.equal(
    facts(out).filter((f) => f.startsWith('drift disagreement')).length,
    0,
    'and it must not double-report as a disagreement',
  );
  assert.ok(facts(out).some((f) => f.includes('kind="unknown-marker"')));
});

// R4 — the sentinel must carry the dependency WHOLE. A cap silently deleted trailing task numbers
// while SKILL.md orders the LLM to name every task and forbids re-opening the brief.
test('R4: a long dependency list is not truncated — no task number is lost', () => {
  const dep = 'task 11 (the scaffold extraction, which must land first and be verified end to end), and also task 99.';
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: `\n- **Depends on: ${dep}**\n` }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).includes(`derive 1 depends="${dep}"`), 'raw, whole, uncapped');
  assert.match(boardRows(out)[0], /task 99/, 'the last dependency survives into the cell');
});

// R5 — an ABSENT source says nothing; that is not a disagreement (SKILL.md:88). Reported as a defect
// in the brief, and deliberately off the override.
test('R5: a brief with no ## Status is nonconformance, not a false disagreement', () => {
  const p = fixture({
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    briefs: { 'done/a.md': '# Alpha\n\n## Sprint\nSprint 1\n\n## Context\nNo status heading at all.\n' },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.includes('kind="brief-missing-status"')));
  assert.equal(facts(out).filter((f) => f.startsWith('drift disagreement')).length, 0);
  assert.match(boardRows(out)[0], /\| closed \|$/, 'an absent brief status must not force waiting on owner');
});

// R6 — an unresolvable moved row must not render as cleanly moved.
test('R6: a ➡️ Moved brief with no ## Sprint is reported, not rendered clean', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 3 | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': '# Alpha\n\n## Priority\n3\n\n## Status\n🔲 Backlog\n\n## Context\nNo sprint heading.\n' },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.startsWith('drift missing-sprint 1')), 'fail loud, not silent');
});

// R7 — tab is IFS whitespace and `read` collapses it, so an empty cell shifted every later field
// left: the brief link landed in Task, Filename emptied, and a phantom missing-brief reached beat 6.
test('R7: an empty Task cell holds its position — no field shifting, no phantom drift', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 |  | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1 }) },
  });
  const { out } = run(p);
  const cells = boardRows(out)[0].split('|').map((c) => c.trim());
  assert.equal(cells[3], '', 'the empty Task cell stays empty');
  assert.equal(cells[4], '[`a.md`](../tasks/backlog/0001-a/brief.md)', 'the link stays in Filename');
  assert.equal(facts(out).filter((f) => f.includes('missing-brief')).length, 0, 'no phantom drift');
});

// R8 — rule 1 needs the plan's sprint identity. Losing it silently disabled the rule and failed
// toward MORE drift — the phantom decisions §5.2r1 exists to prevent.
test('R8: a prose H1 falls back to the filename, keeping rule 1 alive', () => {
  const p = fixture({
    // H1 is prose, but the file is sprint-1.md → identity recoverable.
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |'], { title: '# Hardening — the launcher sprint' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
  });
  const { out } = run(p);
  assert.equal(
    facts(out).filter((f) => f.startsWith('drift disagreement')).length,
    0,
    'rule 1 still applies: the brief belongs to Sprint 9, not this plan',
  );
});

test('R8: an entirely unresolvable plan sprint is REPORTED, not silently ignored', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  mkdirSync(join(agents, 'tasks', 'backlog'), { recursive: true });
  mkdirSync(join(agents, 'sprints'), { recursive: true });
  writeFileSync(join(agents, 'tasks', 'backlog', 'a.md'), brief({ title: 'Alpha', sprint: 'Sprint 9' }));
  // Neither the H1 nor the filename yields a sprint identity.
  const planPath = join(agents, 'sprints', 'hardening.md');
  writeFileSync(planPath, plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |'], { title: '# Hardening' }));
  const { out } = run(planPath);
  assert.ok(
    facts(out).some((f) => f.startsWith('drift unresolved-plan-sprint')),
    'rule 1 being inert must itself be a reported fact',
  );
});

// R14 — `grep -c` prints 0 AND exits 1, so `|| echo 0` emitted both and yielded "0\n0", which would
// throw "integer expression expected". Unreachable today; pinned so it cannot arm itself later.
test('R14: STATUS_SECTIONS is a clean integer on a single-table plan', () => {
  const p = fixture({
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }) },
  });
  const { code, out, err } = run(p);
  assert.equal(code, 0);
  assert.doesNotMatch(err, /integer expression/);
  assert.equal(facts(out).filter((f) => f.includes('multiple-status-tables')).length, 0);
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Round-2 regressions. The lesson of round 2, in the reviewer's words: round 1 "closed the INSTANCE
// the finding named, not the CLASS it belonged to". R2 named `NF<5` → two more doors dropped rows.
// R1 named unanchored matching → the anchor then fit one author's convention, not the documented
// contract. R4 named the byte cap → the line-based truncator underneath survived it.
// These tests pin the CLASS. When touching row admission or field extraction, ask "what ELSE reaches
// this outcome?" — not "is the named case fixed?".
// ─────────────────────────────────────────────────────────────────────────────────────────────────

// R17 — ⚠️ ROW ADMISSION IS A CLASS. Any line that fails to become a record silently redefines M.
test('R17: an empty Status cell still produces a row — M is the table, not the survivors', () => {
  const p = fixture({
    plan: plan([
      '| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |',
      '|  | 2 | Beta | [`b.md`](../tasks/backlog/b.md) |',
      '| 🔲 Backlog | 3 | Gamma | [`c.md`](../tasks/backlog/c.md) |',
    ]),
    briefs: {
      'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }),
      'backlog/b.md': brief({ title: 'Beta', priority: 2 }),
      'backlog/c.md': brief({ title: 'Gamma', priority: 3 }),
    },
  });
  const { out } = run(p);
  // The ✅ row is filtered (task 65); the blank-status row is NOT — it carries `missing-status-cell`
  // nonconformance, and a drifted row always renders. THE POINT OF R17 IS UNCHANGED and is now
  // carried by the roll-up: M is still 3, so the unparsed row did not vanish from the record.
  assert.equal(boardRows(out).length, 2, 'the blank-status row renders on its drift; only the clean ✅ is hidden');
  assert.ok(boardRows(out).some((r) => r.includes('Beta')), 'the blank-status row is the one that must not vanish');
  assert.match(rollup(out), /—  of 3$|—  of 3 /, 'M counts the table, not the rows that parsed');
  assert.equal(rollupSum(out), 3, 'and the terms still sum to it');
  assert.ok(facts(out).some((f) => f.includes('kind="missing-status-cell"')), 'the blank cell is reported');
});

test('R17: a GFM row without leading/trailing pipes is still admitted', () => {
  const p = fixture({
    plan: plan([
      '| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |',
      '🔲 Backlog | 2 | Beta | [`b.md`](../tasks/backlog/b.md)',
    ]),
    briefs: {
      'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }),
      'backlog/b.md': brief({ title: 'Beta', priority: 2 }),
    },
  });
  const { out } = run(p);
  // The pipe-less row is the ADMISSION being tested; the ✅ row is filtered by task 65. Admission is
  // therefore asserted through the roll-up (M=2), which counts every admitted row regardless of the
  // board filter — a stronger check here than a row count that the filter also moves.
  assert.equal(boardRows(out).length, 1, 'the open pipe-less row reaches the board');
  assert.match(boardRows(out)[0], /Beta/, 'and it is the pipe-less one');
  assert.equal(rollupSum(out), 2, 'GFM allows the outer pipes to be omitted — both rows were admitted');
});

// R18 — ⚠️ THE SPLIT IS ABOUT THE OVERRIDE, NOT DETECTION. Round 1 over-corrected and let a cosmetic
// defect (a missing em-dash) SUPPRESS a genuine plan/brief/location contradiction.
test('R18: a nonconforming marker does not suppress genuine drift detection', () => {
  const p = fixture({
    // Plan says Blocked (and omits the mandatory reason); the brief says Done and sits in done/.
    plan: plan(['| 🚧 Blocked | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.includes('kind="blocked-without-reason"')), 'the cosmetic defect is reported');
  assert.ok(
    facts(out).some((f) => f.startsWith('drift disagreement 1')),
    'AND the real contradiction is still found — the whole point of the skill',
  );
  assert.match(boardRows(out)[0], /\| waiting on owner \|$/, 'a genuine disagreement still takes the override');
});

// ...but an UNPARSEABLE plan marker still must not manufacture a disagreement (R3 must not regress):
// it can never equal the brief's key, so comparing it is meaningless, not informative.
test('R18/R3: an unparseable marker is reported without a phantom disagreement', () => {
  const p = fixture({
    plan: plan(['| WIP | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.includes('kind="unknown-marker"')));
  assert.equal(facts(out).filter((f) => f.startsWith('drift disagreement')).length, 0);
  assert.doesNotMatch(boardRows(out)[0], /waiting on owner/);
});

// R19 — ⚠️ the anchor must accept the forms THE PROJECT DOCUMENTS, not the ones one author happened
// to write. `fkit-task-brief/SKILL.md:70` — the only instruction in the repo for recording a
// dependency — prescribes an UNBOLDED `Depends on:` in `## Notes`.
test('R19: the unbolded form fkit-task-brief prescribes is parsed', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n## Notes\n\n- Depends on: task 12.\n' }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).includes('derive 1 depends="task 12."'), "the repo's own prescribed form must parse");
});

test('R19: a `## Depends on` section is parsed', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n## Depends on\ntask 7\n' }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).includes('derive 1 depends="task 7"'));
});

// The loud fallback: a brief that MENTIONS a dependency but declares none we can locate must not be
// reported as having none. `none recorded` → the LLM prints `ready` → the ABSENCE of a dependency is
// invented, which is R1's failure with the sign flipped.
// ⚠️ The fixture must be a genuine DECLARATION that yields nothing — not prose. An earlier version of
// this test used prose ("this depends on something…") and so asserted the over-broad `grep -qi`
// behaviour that R31 proved wrong: it manufactured drift on 4 live briefs. Prose is not a
// declaration, and the loud fallback must fire on a broken declaration, not on the English language.
test('R19: a declaration that yields nothing fails loud, never as `none recorded`', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on:**\n' }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.startsWith('drift depends-unparseable 1')), 'reported, not guessed');
  assert.doesNotMatch(boardRows(out)[0], /none recorded/, 'must never claim there is no dependency');
});

// R20 — ⚠️ TRUNCATION IS A CLASS TOO. Round 1 removed the byte cap and left `grep -m1`, which is
// line-based: a wrapped declaration lost every dependency after the wrap, and now without even the
// `…` that had signalled the loss.
test('R20: a wrapped declaration keeps every dependency across the line break', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: {
      'backlog/a.md': brief({
        title: 'Alpha',
        priority: 1,
        extra: '\n- **Depends on: task 11 (the scaffold extraction) and\n  task 99.**\n',
      }),
    },
  });
  const { out } = run(p);
  assert.ok(
    facts(out).includes('derive 1 depends="task 11 (the scaffold extraction) and task 99."'),
    'the wrap is joined; no dependency is lost',
  );
  assert.match(boardRows(out)[0], /task 99/);
});

// Both live bold forms need opposite handling — content inside the bold vs after it.
test('R20: `**Depends on:** <content>` (bold closed early) keeps its content', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on:** [`other-task`](../done/other-task.md) **(hard).**\n' }) },
  });
  const { out } = run(p);
  const f = facts(out).find((l) => l.startsWith('derive 1'));
  assert.match(f, /other-task/, 'the content after an immediately-closed bold must survive');
});

test('R20: `**Depends on: x.** trailing prose` stops at the bold close', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on: nothing.** Some trailing rationale that is not a dependency.\n' }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).includes('derive 1 depends="nothing."'), 'trailing prose is not part of the declaration');
});

// R21 — ⚠️ REGRESSION GUARD. Presentation must never rewrite semantics. The clause trim ran before
// marker/nonconformance checks and manufactured drift on rows that were clean.
test('R21: the clause trim is presentation-only and never manufactures drift', () => {
  const p = fixture({
    plan: plan(['| ⛔ Cancelled (2026-07-16). Superseded — see task 9 | 1 | Alpha | [`a.md`](../tasks/cancelled/a.md) |']),
    briefs: { 'cancelled/a.md': brief({ title: 'Alpha', status: '⛔ Cancelled (2026-07-16) — superseded', priority: 1 }) },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'date and reason are both present — no defect');
  // Clean ⛔ ⇒ filtered from the board (task 65). Absence IS the assertion here: had the trim
  // manufactured a `cancelled-without-reason`, the row would have been forced back onto the board.
  assert.equal(boardRows(out).length, 0, 'no manufactured drift, so the cancelled row stays hidden');
});

// R22 — every drift record must reach the roll-up clause, or SKILL.md's "every drift record is an
// owner decision" is false for the ones that never surface.
test('R22: plan-level drift reaches the roll-up clause', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  mkdirSync(join(agents, 'tasks', 'backlog'), { recursive: true });
  mkdirSync(join(agents, 'sprints'), { recursive: true });
  const planText = foldBriefsAndPlan(
    agents,
    { 'backlog/a.md': brief({ title: 'Alpha' }) },
    plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |'], { title: '# Hardening' }),
  );
  const planPath = join(agents, 'sprints', 'hardening.md');
  writeFileSync(planPath, planText);
  const { out } = run(planPath);
  assert.ok(facts(out).some((f) => f.startsWith('drift unresolved-plan-sprint')));
  assert.match(rollup(out), /drift on the plan itself/, 'a bare roll-up would hide it from the owner');
});

// R24 — control records must be out-of-band. A row whose Status is literally `MALFORMED` is data.
test('R24: a literal MALFORMED status is data, not a control record', () => {
  const p = fixture({
    plan: plan(['| MALFORMED | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }) },
  });
  const { code, out } = run(p);
  assert.equal(code, 0, 'must not hard-fail the board on legitimate cell content');
  assert.ok(facts(out).some((f) => f.includes('kind="unknown-marker"')));
});

// R25 — a missing date and a missing reason are different defects; naming the wrong one sends the
// owner to fix something already present.
test('R25: a cancelled cell missing its DATE says so, not "without-reason"', () => {
  const p = fixture({
    plan: plan(['| ⛔ Cancelled — superseded by task 9 | 1 | Alpha | [`a.md`](../tasks/cancelled/a.md) |']),
    briefs: { 'cancelled/a.md': brief({ title: 'Alpha', status: '⛔ Cancelled — superseded', priority: 1 }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.includes('kind="cancelled-without-date"')), 'name the actual defect');
  assert.equal(facts(out).filter((f) => f.includes('cancelled-without-reason')).length, 0);
});

// R27 (task 64, review R3) — the ADR-025 agent-closed qualifier contains an em-dash of its OWN, so a
// naive `grep -q '—'` on the raw cell accepts a cancellation that has NO reason: the qualifier
// satisfies the check meant for the reason. The lint then reports CLEAN on the one closure path
// nobody audits (`cancelled/`), which is strictly worse than having no lint — it manufactures
// confidence. The fix strips `(agent-closed …)` before both conformance tests.
//
// ⚠️ ASSERT THE OWNER FORM TOO. Stripping is a rewrite of the value the checks see, so it can regress
// the plain owner marker just as easily as it fixes the agent one. Both directions are pinned here.
test('R27: an agent-closed cancellation with NO reason is caught, not passed as clean', () => {
  const st = '⛔ Cancelled (agent-closed — not owner-verified) (2026-07-19)';
  const p = fixture({
    plan: plan([`| ${st} | 1 | Alpha | [\`a.md\`](../tasks/cancelled/a.md) |`]),
    briefs: { 'cancelled/a.md': brief({ title: 'Alpha', status: st, priority: 1 }) },
  });
  const { out } = run(p);
  assert.ok(
    facts(out).some((f) => f.includes('kind="cancelled-without-reason"')),
    'the qualifier must not satisfy the reason requirement',
  );
});

test('R27b: an agent-closed cancellation WITH a reason is clean, and its date still parses', () => {
  const st = '⛔ Cancelled (agent-closed — not owner-verified) (2026-07-19) — superseded by task 70';
  const p = fixture({
    plan: plan([`| ${st} | 1 | Alpha | [\`a.md\`](../tasks/cancelled/a.md) |`]),
    briefs: { 'cancelled/a.md': brief({ title: 'Alpha', status: st, priority: 1 }) },
  });
  const { out } = run(p);
  assert.equal(
    facts(out).filter((f) => f.includes('cancelled-without-')).length,
    0,
    'a well-formed agent-closed cancellation must raise no nonconformance',
  );
});

test('R27c: the plain OWNER cancelled form is unaffected by the qualifier strip', () => {
  const st = '⛔ Cancelled (2026-07-19) — superseded by task 70';
  const p = fixture({
    plan: plan([`| ${st} | 1 | Alpha | [\`a.md\`](../tasks/cancelled/a.md) |`]),
    briefs: { 'cancelled/a.md': brief({ title: 'Alpha', status: st, priority: 1 }) },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.includes('cancelled-without-')).length, 0);
});

// R26 — a literal US byte in a cell must not shift fields (it is the field delimiter).
test('R26: a literal US byte in a cell cannot corrupt field alignment', () => {
  const p = fixture({
    plan: plan([`| 🔲 Backlog | 1 | Alpha | [\`a.md\`](../tasks/backlog/a.md) |`]),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1 }) },
  });
  const { out } = run(p);
  const cells = boardRows(out)[0].split('|').map((c) => c.trim());
  assert.equal(cells[4], '[`a.md`](../tasks/backlog/0001-a/brief.md)', 'the link stays in Filename despite the US byte');
  assert.equal(facts(out).filter((f) => f.includes('missing-brief')).length, 0, 'no phantom drift');
  assert.doesNotMatch(out, //, 'the byte is neutralised, not passed through into the board');
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// THE DEPENDENCY GRAMMAR MATRIX (round 3, finding R36).
//
// ⚠️ WHY THIS EXISTS. `depends_raw` was wrong three rounds running while its tests stayed green,
// because I wrote each fixture from the shape I had just made work. The clearest proof: the round-2
// fixture for `**Depends on:** <content>` was live task 41's declaration FLATTENED ONTO ONE LINE —
// and flattening is precisely what hid the bug that the real, wrapped declaration exposed. A fixture
// derived from the implementation cannot falsify the implementation.
//
// So: enumerate the GRAMMAR (4 forms) crossed with the HAZARDS (wrapped · fan-in · pipe), and take
// the shapes from LIVE BRIEFS, not from what the parser happens to accept.
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FORMS = {
  'S  section':      '\n## Depends on\n- task 12\n',
  'BL bold-label':   '\n- **Depends on:** [`t12`](../done/t12.md)\n',
  'BI bold-inline':  '\n- **Depends on: task 12.** Trailing rationale that is not a dependency.\n',
  'P  plain':        '\n## Notes\n\n- Depends on: task 12.\n',
  'BI colonless':    '\n- **Depends on task 12.**\n',   // 4 live briefs write `**Depends on nothing.**`
};

for (const [name, extra] of Object.entries(FORMS)) {
  test(`grammar: ${name} — locates the dependency`, () => {
    const p = fixture({
      plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
      briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra }) },
    });
    const { out } = run(p);
    const f = facts(out).find((l) => l.startsWith('derive 1')) || '';
    assert.match(f, /task 12|t12/, `${name}: the dependency must be found`);
    assert.equal(facts(out).filter((l) => l.includes('depends-unparseable')).length, 0, `${name}: not unparseable`);
  });
}

// HAZARD × FORM. Each of these lost a dependency in a previous round.
const HAZARDS = {
  // ⚠️ Taken VERBATIM from live task 41 — wrapped, which is what the flattened fixture hid.
  'BL wrapped (live task 41 shape)': {
    extra: '\n- **Depends on:** [`t12`](../done/t12.md)\n  **(hard).** Do not begin before that spec is owner-reviewed.\n',
    must: [/t12/, /hard/],
  },
  'BI wrapped fan-in': {
    extra: '\n- **Depends on: task 11 (the scaffold) and\n  task 99.**\n',
    must: [/task 11/, /task 99/],
  },
  'S fan-in': {
    extra: '\n## Depends on\n- task 12\n- task 99\n',
    must: [/task 12/, /task 99/],
  },
  'P wrapped': {
    extra: '\n## Notes\n\n- Depends on: task 12 and\n  task 99.\n',
    must: [/task 12/, /task 99/],
  },
};

for (const [name, { extra, must }] of Object.entries(HAZARDS)) {
  test(`grammar hazard: ${name} — loses nothing`, () => {
    const p = fixture({
      plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
      briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra }) },
    });
    const { out } = run(p);
    const f = facts(out).find((l) => l.startsWith('derive 1')) || '';
    for (const re of must) assert.match(f, re, `${name}: ${re} must survive`);
  });
}

// ⚠️ The FIRST declaration wins. Live task 36's continuation prose contains a SECOND
// `**Depends on: 28 (hard).**`, and awk's greedy `.*` selected it once wrap-joining was added —
// silently dropping tasks 25, 26 and 27. This cell was missing from the matrix and the bug shipped
// through a green suite for exactly that reason.
test('grammar hazard: a second declaration in continuation prose does not hijack the first', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: {
      'backlog/a.md': brief({
        title: 'Alpha',
        priority: 1,
        extra: '\n- **Depends on: tasks 25, 26, 27, 28.** The owner gated this. Task 28 is nearest and\n  reuses task 26\'s bar. **Depends on: 28 (hard).**\n',
      }),
    },
  });
  const { out } = run(p);
  const f = facts(out).find((l) => l.startsWith('derive 1')) || '';
  assert.match(f, /tasks 25, 26, 27, 28/, 'the FIRST declaration is the dependency');
  assert.doesNotMatch(f, /^derive 1 depends="28 \(hard\)/, 'the later mention must not hijack it');
});

// R34 — GFM escapes a literal pipe in a cell as `\|`. It is CONTENT. Splitting on it shifted every
// later field: a six-column board, the priority set to cell debris, and a phantom drift on a row that
// was clean.
test('R34: a GFM-escaped pipe in the Status cell is content, not a delimiter', () => {
  const p = fixture({
    plan: plan(['| 🚧 Blocked — a \\| b | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', status: '🚧 Blocked — a b', priority: 1 }) },
  });
  const { out } = run(p);
  // ⚠️ Assert the exact row: a naive split('|') would itself re-split the escape and "prove" a
  // six-column board that isn't there. The escape must survive INTO the output, still escaped, so
  // the rendered markdown is five columns.
  assert.equal(
    boardRows(out)[0],
    '| 🚧 Blocked — a \\| b | 1 | Alpha | [`a.md`](../tasks/backlog/0001-a/brief.md) | ⟨derive: none recorded⟩ |',
  );
  assert.ok(facts(out).includes('total 1'));
  assert.equal(facts(out).filter((f) => f.startsWith('drift disagreement')).length, 0, 'no phantom drift');
});

// A `|` anywhere in a declaration must never reach the board — it would add a column.
test('grammar hazard: a pipe in any form cannot break the table', () => {
  for (const extra of ['\n## Depends on\n- task 12 | task 99\n', '\n- **Depends on: task 12 | task 99.**\n']) {
    const p = fixture({
      plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
      briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra }) },
    });
    const { out } = run(p);
    assert.equal(boardRows(out)[0].split('|').length - 2, 5, 'the board stays five columns');
  }
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// THE NEGATIVE AXIS (round 4, the second half of R36's lesson).
//
// ⚠️ Round 3's matrix fixed WHERE fixtures came from (live briefs, not the implementation) but every
// cell was still a WELL-FORMED DECLARATION. Nothing in it could falsify the FALLBACK — so four highs
// hid in the space the matrix had no axis for: a form the guard didn't know, a parse that returned
// text but the wrong text, prose that outranked a real declaration. A happy-path matrix cannot test
// a guard whose entire job is the unhappy path.
//
// So: {prose-with-colon · code-span · near-miss heading · label-with-no-content · sub-bullets}
//     × {before / after the real declaration}.
// The contract being pinned, in one line: SILENCE means no declaration; LOUD means a declaration we
// could not read. Never the reverse — a fabricated `ready` is invisible, a false alarm is not.
// ─────────────────────────────────────────────────────────────────────────────────────────────────

// NEGATIVE: things that must NOT be read as declarations, and must NOT trip the loud path either.
const NOT_DECLARATIONS = {
  'English prose':        '\n## Context\nWhether this ships depends on the owner ruling first.\n',
  'prose with a colon':   '\n## Context\nWe discuss Depends on: formats at length in this section.\n',
  'code-span prose':      '\n## Context\nThe `Depends on:` line is free text and cannot be parsed.\n',
  'near-miss heading':    '\n## Dependencies\n- task 12\n',
};

for (const [name, extra] of Object.entries(NOT_DECLARATIONS)) {
  test(`negative: ${name} is not a declaration — silent, not loud`, () => {
    const p = fixture({
      plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
      briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra }) },
    });
    const { out } = run(p);
    assert.match(boardRows(out)[0], /⟨derive: none recorded⟩/, `${name}: no declaration → none recorded`);
    assert.equal(facts(out).filter((f) => f.includes('depends-unparseable')).length, 0, `${name}: must not manufacture drift`);
  });
}

// ⚠️ PRECEDENCE. Prose mentioning the field must never outrank a real declaration further down —
// awk runs per LINE, so gating on "first match" silently made the first LINE win, and a real bold
// declaration lost to a sentence about formats.
for (const [name, extra] of Object.entries({
  'prose-with-colon BEFORE bold': '\n## Context\nWe discuss Depends on: formats here.\n\n- **Depends on: task 12.**\n',
  'prose-with-colon BEFORE section': '\n## Context\nWe discuss Depends on: formats here.\n\n## Depends on\n- task 12\n',
  'code-span BEFORE plain': '\n## Context\nThe `Depends on:` line is free text.\n\n## Notes\n\n- Depends on: task 12.\n',
})) {
  test(`negative: ${name} — the DECLARATION wins, not the first line`, () => {
    const p = fixture({
      plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
      briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra }) },
    });
    const { out } = run(p);
    assert.match(facts(out).find((l) => l.startsWith('derive 1')) || '', /task 12/, `${name}: the real declaration must win`);
  });
}

// LOUD: a declaration we cannot read. The ONLY thing that may fire the fallback.
test('negative: a declaration with no content is LOUD, never `none recorded`', () => {
  for (const extra of ['\n- **Depends on:**\n', '\n## Depends on\n\n## Notes\nx\n']) {
    const p = fixture({
      plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
      briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra }) },
    });
    const { out } = run(p);
    assert.ok(facts(out).some((f) => f.startsWith('drift depends-unparseable 1')), 'a broken declaration must be loud');
    assert.doesNotMatch(boardRows(out)[0], /none recorded/, 'and must never read as "there is no dependency"');
  }
});

// ⚠️ Sub-bullets are part of the declaration. `**Depends on:** hard prerequisites:` + `- task 12` /
// `- task 13` returned `hard prerequisites:` — NON-EMPTY, so the loud path never fired and both tasks
// vanished silently. This is why the fallback cannot be gated on emptiness alone.
test('negative: a label whose dependencies are sub-bullets keeps them', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on:** hard prerequisites:\n  - task 12\n  - task 13\n' }) },
  });
  const { out } = run(p);
  const f = facts(out).find((l) => l.startsWith('derive 1')) || '';
  assert.match(f, /task 12/, 'sub-bullet 1 survives');
  assert.match(f, /task 13/, 'sub-bullet 2 survives');
});

// R41 — the admission window: opens AT the separator, closes at the first blank/pipe-less line.
test('R41: pipe-prose BEFORE the table is not admitted', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  mkdirSync(join(agents, 'tasks', 'backlog'), { recursive: true });
  mkdirSync(join(agents, 'sprints'), { recursive: true });
  writeFileSync(join(agents, 'tasks', 'backlog', 'a.md'), brief({ title: 'Alpha' }));
  const planPath = join(agents, 'sprints', 'sprint-1.md');
  writeFileSync(planPath, [
    '# Sprint 1 — Test', '', '## Status', '',
    'Progress | 3 done | 2 backlog | updated today',   // pipe-prose BEFORE the table
    '',
    '| Status | Priority | Task | Brief |',
    '|---|---|---|---|',
    '| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |',
    '',
  ].join('\n'));
  const { out } = run(planPath);
  assert.ok(facts(out).includes('total 1'), 'M counts the table, not the caption');
  assert.equal(boardRows(out).length, 1);
});

test('R41: a pipe block with NO separator row is not a table — hard-fail, not a plausible board', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  mkdirSync(join(agents, 'tasks', 'backlog'), { recursive: true });
  mkdirSync(join(agents, 'sprints'), { recursive: true });
  writeFileSync(join(agents, 'tasks', 'backlog', 'a.md'), brief({ title: 'Alpha' }));
  const planPath = join(agents, 'sprints', 'sprint-1.md');
  writeFileSync(planPath, [
    '# Sprint 1 — Test', '', '## Status', '',
    '| Status | Priority | Task | Brief |',
    '| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |',   // no |---| row: not GFM
    '',
  ].join('\n'));
  const { code } = run(planPath);
  assert.notEqual(code, 0, 'GFM requires the delimiter row; without it there is no board to render');
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// POSITIONAL NEGATIVE SPACE (round 5). The axis added in round 4 covered "shapes that must not
// parse". It had no cell for **shapes that must not parse because of WHERE THEY SIT** — inside a code
// span, inside a fence, inside a sentence. That gap is where R45–R48 hid.
//
// ⚠️ And the inverse matters more: the span rule was implemented as a LINE-scoped veto, so a real
// declaration sharing a line with a span mention was discarded whole → `none recorded` → a FABRICATED
// `ready`. Masking (not vetoing) is what fixes both directions at once.
// ─────────────────────────────────────────────────────────────────────────────────────────────────

// R46 — ⚠️ the high. Rule 3 ORDERS over-including trailing prose, so a declaration sharing a line
// with a span mention is expected, not exotic.
test('R46: a span mention does not veto a real declaration on the same line', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on: task 42.** See the `Depends on:` note for format.\n' }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).includes('derive 1 depends="task 42."'), 'the declaration wins; the span is masked, not fatal');
  assert.doesNotMatch(boardRows(out)[0], /none recorded/, 'a fabricated absence is the worst direction');
});

// R47 — a bold declaration inside a code span is an EXAMPLE, not a declaration.
test('R47: a bold declaration inside a code span does not parse', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n## Context\nWrite it as `**Depends on: task 77.**` in the notes.\n' }) },
  });
  const { out } = run(p);
  assert.match(boardRows(out)[0], /none recorded/, 'an example is not a declaration');
  assert.equal(facts(out).filter((f) => f.includes('task 77')).length, 0);
});

// R48 — fenced blocks. 4 of the 41 live briefs carry both a fence and a declaration.
test('R48: a declaration inside a fence does not parse, and no fence marker leaks', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n## Context\nExample:\n\n```\n- **Depends on: task 99.**\n```\n' }) },
  });
  const { out } = run(p);
  assert.match(boardRows(out)[0], /none recorded/);
  assert.doesNotMatch(out, /```/, 'the fence marker must never leak into the sentinel');
});

test('R48: a fenced example does not shadow a real declaration after it', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n## Context\n```\n- **Depends on: task 99.**\n```\n\n- **Depends on: task 12.**\n' }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).includes('derive 1 depends="task 12."'), 'the real declaration, not the example');
});

// ⚠️ THE INVERSE OF MASKING. A dependency may legitimately BE a code span. Masking must preserve
// LENGTH (locate on the masked copy, extract from the raw) — deleting spans would destroy this.
test('R46/R47: a dependency that IS a code span survives masking', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on:** [`design-x`](../done/design-x.md) **(hard).**\n' }) },
  });
  const { out } = run(p);
  assert.match(facts(out).find((l) => l.startsWith('derive 1')) || '', /design-x/, 'masking must not eat real content');
});

// R51 — ONE grammar for "is this the ## Status heading?". Three variants (two prefix, one exact) made
// a `## Status report` section count as a second table and emit a false fact, while the parser
// correctly ignored it.
test('R51: a `## Status report` section is not a second Status table', () => {
  const p = fixture({
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |'], {
      extraSections: '\n## Status report\n\nSome prose about reporting.\n',
    }),
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }) },
  });
  const { code, out } = run(p);
  assert.equal(code, 0);
  assert.equal(
    facts(out).filter((f) => f.includes('multiple-status-tables')).length,
    0,
    'one grammar for the heading, or the guard disagrees with the parser',
  );
});

// R56 — ⚠️ THE GUARD AND THE PARSER MUST NOT DISAGREE ABOUT WHAT A HEADING IS.
// `[ \t]` is not portable across grep dialects: BSD grep (what a consumer actually has) reads it as
// the literal set {backslash, space, t} and does NOT match a tab; awk expands `\t` and does. So the
// same regex text gave two answers, and `## Status<TAB>` made the guard `die` while the parser
// happily accepted the section. The fix is a REAL tab, expanded in bash, so neither engine parses the
// escape at all.
//
// ⚠️ This was invisible on the dev machine because `grep` on PATH is ugrep, which agrees with awk —
// so this suite was green against a grep no consumer has. The fix makes the answer dialect-
// independent, which is the only reason this test means anything regardless of which grep runs it.
test('R56: a `## Status` heading with a trailing tab parses — guard and parser agree', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  mkdirSync(join(agents, 'tasks', 'backlog'), { recursive: true });
  mkdirSync(join(agents, 'sprints'), { recursive: true });
  writeFileSync(join(agents, 'tasks', 'backlog', 'a.md'), brief({ title: 'Alpha' }));
  const planPath = join(agents, 'sprints', 'sprint-1.md');
  writeFileSync(planPath, [
    '# Sprint 1 — Test', '', '## Status\t', '',          // ← trailing TAB on the heading
    '| Status | Priority | Task | Brief |',
    '|---|---|---|---|',
    '| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |',
    '',
  ].join('\n'));
  const { code, out } = run(planPath);
  assert.equal(code, 0, 'the guard must not reject a section the parser accepts');
  assert.ok(facts(out).includes('total 1'));
});

// R50/R53 — ⚠️ the negative axis and the exact-stdout pin never intersected, which is exactly how an
// undocumented `form=` field shipped green: no assertion had ever seen the loud path's full output.
// One exact-stdout assertion on the UNHAPPY path retires that whole class.
test('R50/R53: exact stdout on the LOUD path — the fact is pinned in full', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on:**\n' }) },
  });
  const { code, out } = run(p);
  assert.equal(code, 0);
  assert.equal(out, [
    '⟦fkit-dashboard v1⟧',
    '⟦BOARD⟧',
    '| Status | # | Task | Filename | Next step |',
    '|---|---|---|---|---|',
    '| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/0001-a/brief.md) | ⟨derive: UNPARSEABLE — see brief⟩ |',
    '',
    '1 backlog  —  of 1  — as recorded; drift on tasks 1 — see above.',
    '⟦FACTS⟧',
    'total 1',
    'count backlog 1',
    'drift depends-unparseable 1 brief="../tasks/backlog/0001-a/brief.md" form="BL"',
    '⟦END⟧',
    '',
  ].join('\n'));
});

// R31 — the colonless declaration is a DECLARATION, not an unparseable mention. 4 live briefs.
test('R31: `**Depends on nothing.**` declares no dependency — it is not drift', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on nothing.** Relates to: task 22.\n' }) },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.includes('depends-unparseable')).length, 0, 'a live form must not be called unparseable');
  assert.match(facts(out).find((l) => l.startsWith('derive 1')) || '', /nothing/);
});

// ...and ordinary prose using the words must not trip the loud fallback either.
test('R31: prose saying "depends on" does not manufacture drift', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\nWhether this ships depends on the owner ruling first.\n' }) },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.includes('depends-unparseable')).length, 0, 'prose is not a declaration');
  assert.match(boardRows(out)[0], /none recorded/);
});

// R29 — ⚠️ THE TWIN CLASS QUESTION: can a line produce a record that is NOT a row? Widening admission
// to any pipe-bearing line turned prose after the table into a phantom task with an invented id.
test('R29: prose after the table is not a phantom task', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  mkdirSync(join(agents, 'tasks', 'backlog'), { recursive: true });
  mkdirSync(join(agents, 'sprints'), { recursive: true });
  writeFileSync(join(agents, 'tasks', 'backlog', 'a.md'), brief({ title: 'Alpha' }));
  const planPath = join(agents, 'sprints', 'sprint-1.md');
  writeFileSync(planPath, [
    '# Sprint 1 — Test', '', '## Status', '',
    '| Status | Priority | Task | Brief |',
    '|---|---|---|---|',
    '| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |',
    '',
    'Progress | 3 done | 2 backlog | updated today',   // prose with four pipe-separated cells
    '',
  ].join('\n'));
  const { code, out } = run(planPath);
  assert.equal(code, 0, 'prose after the table must not hard-fail the board either');
  assert.equal(boardRows(out).length, 1, 'one real row');
  assert.ok(facts(out).includes('total 1'), 'M is the table, not the table plus the prose');
  assert.doesNotMatch(out, /invented|updated today/, 'prose never becomes a task');
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

// ───────────────────────────────────────────────────────────────────────────────────────────────────
// TASK 65 — THE OPEN-WORK FILTER. The board renders open work only; ✅/⛔/➡️ rows are omitted.
//
// ⚠️ THIS IS A CONSCIOUS REVERSAL of the script's original "show the dead rows" principle (owner
// ruling, 2026-07-18), and these tests exist to stop it being silently reverted BACK by a reader who
// finds the old principle quoted in an older SKILL.md revision or an ADR. The reversal is only safe
// because of three properties, and there is a test below for each: the roll-up still counts every
// row, ⟦FACTS⟧ still reports on hidden rows, and a DRIFTED row renders whatever its marker says.
// ───────────────────────────────────────────────────────────────────────────────────────────────────

// The three inert states, in one plan, each with a matching brief so none of them drifts.
const INERT_PLAN = [
  '| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |',
  '| ⛔ Cancelled (2026-07-16) — superseded | 2 | Beta | [`b.md`](../tasks/cancelled/b.md) |',
  '| ➡️ Moved to [Sprint 2](../sprint-2.md) — priority 12 | 3 | Gamma | [`c.md`](../tasks/backlog/c.md) |',
  '| 🔲 Backlog | 4 | Delta | [`d.md`](../tasks/backlog/d.md) |',
];
const INERT_BRIEFS = {
  'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }),
  'cancelled/b.md': brief({ title: 'Beta', status: '⛔ Cancelled (2026-07-16) — superseded', priority: 2 }),
  'backlog/c.md': brief({ title: 'Gamma', sprint: 'Sprint 2', status: '🔲 Backlog', priority: 12 }),
  'backlog/d.md': brief({ title: 'Delta', priority: 4 }),
};

test('task 65: done, cancelled and moved rows are all omitted from the board', () => {
  const p = fixture({ plan: plan(INERT_PLAN), briefs: INERT_BRIEFS });
  const { code, out } = run(p);
  assert.equal(code, 0);
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'the fixture is clean — nothing forced to render');
  assert.equal(boardRows(out).length, 1, 'only the open row survives the filter');
  assert.match(boardRows(out)[0], /Delta/);
  for (const gone of ['Alpha', 'Beta', 'Gamma']) {
    assert.doesNotMatch(boardRows(out).join('\n'), new RegExp(gone), `${gone} is inert and must not render`);
  }
});

// PROPERTY 1 — scope stays visible. This is the mitigation the owner ruled in when reversing
// "show the dead rows": rows go, totals stay. A roll-up that counted only rendered rows would hide
// the scope twice over and make the board lie in the direction the old principle warned about.
test('task 65: the roll-up still counts every hidden row, and M is the whole table', () => {
  const p = fixture({ plan: plan(INERT_PLAN), briefs: INERT_BRIEFS });
  const { out } = run(p);
  assert.equal(rollup(out).trim(), '1 done · 1 backlog · 1 cancelled · 1 moved  —  of 4');
  assert.equal(rollupSum(out), 4, 'the terms sum to M even though only one row rendered');
  assert.equal(boardRows(out).length, 1, 'rows shown ≠ rows counted — deliberately');
});

// PROPERTY 2 — a hidden row is still REPORTED. Beats 2 and 6 narrate from ⟦FACTS⟧, so drift on a
// closed task must survive the filter; otherwise filtering the board would silently filter the
// owner's decision list too.
test('task 65: a drift fact on a closed-marked row survives into ⟦FACTS⟧ and the roll-up clause', () => {
  const p = fixture({
    // ⛔ with no date: nonconformance. It does NOT flip the state to unknown, so the row stays
    // cancelled — and the fact must still reach ⟦FACTS⟧.
    //
    // ⚠️ THE ROW HERE RENDERS, and the title says so deliberately (review R5). "A drift fact about a
    // HIDDEN row" is an unreachable scenario by construction — every in-loop drift fact calls
    // `mark_drift`, which is what forces the row back onto the board. What survives the filter for a
    // genuinely hidden row is `total` / `count *`, asserted in the roll-up test above.
    plan: plan([
      '| ⛔ Cancelled — superseded | 1 | Alpha | [`a.md`](../tasks/cancelled/a.md) |',
      '| 🔲 Backlog | 2 | Beta | [`b.md`](../tasks/backlog/b.md) |',
    ]),
    briefs: {
      'cancelled/a.md': brief({ title: 'Alpha', status: '⛔ Cancelled — superseded', priority: 1 }),
      'backlog/b.md': brief({ title: 'Beta', priority: 2 }),
    },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.includes('kind="cancelled-without-date"')), 'the fact survives the board filter');
  assert.match(rollup(out), /drift on tasks 1\b/, 'and it reaches the roll-up drift clause');
});

// PROPERTY 3 — THE SAFETY VALVE, and the reason we filter on RECONCILED state rather than the raw
// marker. A row stamped ✅ whose brief disagrees is not known to be done; hiding it would bury the
// finding. ⚠️ If this test ever fails, the filter has started hiding drift — stop and fix the filter,
// do not relax the test.
test('task 65: a done-marked row WITH drift still renders, and says waiting on owner', () => {
  const p = fixture({
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    // The plan says done; the brief says backlog, from backlog/. Disagreement — state is UNKNOWN.
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', status: '🔲 Backlog', priority: 1 }) },
  });
  const { out } = run(p);
  assert.equal(boardRows(out).length, 1, 'a drifted row renders whatever its marker claims');
  assert.match(boardRows(out)[0], /\| waiting on owner \|$/);
  assert.ok(facts(out).some((f) => f.startsWith('drift disagreement 1')));
});

// The `closed` and `dead` next-step shapes are still reachable — on rows a NONCONFORMANCE forced back
// onto the board. Nonconformance does not take the waiting-on-owner override (SKILL.md), so a
// cancelled row stays `dead` even while rendering. Without this, filtering would quietly delete two of
// the script's four next-step shapes from the suite's coverage.
test('task 65: nonconformance renders the row but leaves its next step inert', () => {
  const p = fixture({
    plan: plan([
      '| ⛔ Cancelled — superseded | 1 | Alpha | [`a.md`](../tasks/cancelled/a.md) |',
      '| ✅ Done | 2 | Beta | [`b.md`](../tasks/done/b.md) |',
    ]),
    briefs: {
      'cancelled/a.md': brief({ title: 'Alpha', status: '⛔ Cancelled — superseded', priority: 1 }),
      // No ## Status heading ⇒ `brief-missing-status` nonconformance ⇒ renders, but no disagreement.
      'done/b.md': '# Beta\n\n## Sprint\nSprint 1\n\n## Priority\n2\n\n## Context\n\nBody.\n',
    },
  });
  const { out } = run(p);
  const rows = boardRows(out);
  assert.equal(rows.length, 2, 'both were forced back on by nonconformance');
  assert.match(rows.find((r) => r.includes('Alpha')), /\| dead \|$/, 'cancelled stays dead, not waiting on owner');
  assert.match(rows.find((r) => r.includes('Beta')), /\| closed \|$/, 'done stays closed');
});

// A plan of nothing but closed work renders an EMPTY board — legitimately. The roll-up is what tells
// the owner the sprint exists and is finished; an empty board must not be mistaken for a parse
// failure, which exits non-zero and takes SKILL.md's flagged fallback instead.
test('task 65: an all-closed sprint renders an empty board, exit 0, roll-up intact', () => {
  const p = fixture({
    plan: plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/done/a.md) |']),
    briefs: { 'done/a.md': brief({ title: 'Alpha', status: '✅ Done', priority: 1 }) },
  });
  const { code, out } = run(p);
  assert.equal(code, 0, 'an empty board is a valid board, not a failure');
  assert.equal(boardRows(out).length, 0);
  assert.equal(rollup(out).trim(), '1 done  —  of 1', 'the roll-up still tells the whole story');
  assert.ok(facts(out).includes('total 1'));
});

// ───────────────────────────────────────────────────────────────────────────────────────────────────
// TASK 68 — THE BACKLOG BOARD. `ai-agents/sprints/backlog.md` is a real board with the same table
// shape as a sprint plan, but two things a sprint plan never has: no `Sprint N` identity, and no
// priority numbers (its cells are `—`, because the board is unranked by design).
//
// ⚠️ Both of those used to degrade the output silently — a permanent false `unresolved-plan-sprint`
// drift record, and every FACTS record keyed `?` so several distinct drifted rows collapsed to one
// unattributable entry. These tests pin both fixes AND pin that the numbered sprint path is unchanged.
// ───────────────────────────────────────────────────────────────────────────────────────────────────

// A backlog board: unranked (`—`) priorities, prose H1, filename `backlog.md`.
function backlogFixture(rows, briefs = {}) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/backlog', 'tasks/done', 'tasks/cancelled', 'sprints', 'sprints/done']) {
    mkdirSync(join(agents, d), { recursive: true });
  }
  const planText = foldBriefsAndPlan(
    agents,
    briefs,
    `# Backlog — the default home for unsprinted task briefs\n\nProse header.\n\n## Status\n\n| Status | Priority | Task | Brief |\n|---|---|---|---|\n${rows.join('\n')}\n\n## Notes\n\nTail.\n`,
  );
  const planPath = join(agents, 'sprints', 'backlog.md');
  writeFileSync(planPath, planText);
  return planPath;
}

test('task 68: the backlog board resolves to the `Backlog` identity — no phantom unresolved-plan-sprint', () => {
  const p = backlogFixture(
    ['| 🔲 Backlog | — | Alpha | [`a.md`](../tasks/backlog/a.md) |'],
    { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Backlog', priority: 'Unscheduled' }) },
  );
  const { code, out } = run(p);
  assert.equal(code, 0);
  // Neither the H1 nor the filename yields `Sprint N`; without the backlog rule this would fire.
  assert.equal(
    facts(out).filter((f) => f.includes('unresolved-plan-sprint')).length, 0,
    'a well-formed backlog board must not report drift against itself',
  );
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'and no other drift either');
});

// Rule 1 skips the status cross-check when a brief names a DIFFERENT sprint than the board. A
// `Backlog` board and a `## Sprint: Backlog` brief MATCH, so the rule does not skip and real drift is
// still caught.
//
// ⚠️ SCOPE OF THIS TEST, stated honestly (review R6): the fixture writes its own brief, so this pins
// the SCRIPT'S behavior given matching values. It does **not** and cannot guarantee that the repo's
// real briefs still say `Backlog` — if task 67's normalization were reverted in the live tree, this
// test would stay green. That coupling is enforced by the live board, not here.
test('task 68: rule 1 does NOT skip on the backlog board — real status drift is still found', () => {
  const p = backlogFixture(
    ['| 🔲 Backlog | — | Alpha | [`a.md`](../tasks/backlog/a.md) |'],
    // Brief says done, and lives in done/ — genuine disagreement with the board's `🔲 Backlog`.
    { 'done/a.md': brief({ title: 'Alpha', sprint: 'Backlog', status: '✅ Done', priority: 'Unscheduled' }) },
  );
  const { out } = run(p);
  assert.ok(
    facts(out).some((f) => f.startsWith('drift disagreement')),
    'the cross-check must run — a silent rule-1 skip here would hide every backlog status drift',
  );
});

test('task 68: FACTS records key by brief filename stem when the priority is `—`', () => {
  const p = backlogFixture(
    [
      '| 🔲 Backlog | — | Alpha | [`alpha.md`](../tasks/backlog/alpha.md) |',
      '| 🔲 Backlog | — | Zeta | [`zeta.md`](../tasks/backlog/zeta.md) |',
    ],
    {
      // No ## Status ⇒ brief-missing-status, on zeta only.
      'backlog/zeta.md': '# Zeta\n\n## Sprint\nBacklog\n\n## Priority\nUnscheduled\n\n## Context\n\nB.\n',
      'backlog/alpha.md': brief({ title: 'Alpha', sprint: 'Backlog', priority: 'Unscheduled' }),
    },
  );
  const { out } = run(p);
  assert.ok(
    facts(out).some((f) => /^drift nonconformance \d{4}-zeta /.test(f)),
    'keyed by the folder name (`<ID>-<slug>`), not `?`',
  );
  assert.doesNotMatch(rollup(out), /drift on tasks \?/, 'an unattributable `?` is the failure mode');
  assert.match(rollup(out), /drift on tasks \d{4}-zeta/);
});

// ⚠️ THE FALLBACK IS A FALLBACK. A numbered plan must keep numbering — the skill narrates
// `drift on tasks 59, 60`, and switching sprint plans to filename ids would break every such reference.
test('task 68: a numbered sprint plan still keys FACTS by number, not by filename', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 7 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': '# Alpha\n\n## Sprint\nSprint 1\n\n## Priority\n7\n\n## Context\n\nB.\n' },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.startsWith('drift nonconformance 7 ')), 'numbers win where they exist');
  assert.doesNotMatch(out, /drift nonconformance a /);
});

test('task 68: `—` priority cells render verbatim and the roll-up is still correct', () => {
  const p = backlogFixture(
    [
      '| 🔲 Backlog | — | Alpha | [`a.md`](../tasks/backlog/a.md) |',
      '| 🚧 Blocked — waiting on the owner | — | Beta | [`b.md`](../tasks/backlog/b.md) |',
    ],
    {
      'backlog/a.md': brief({ title: 'Alpha', sprint: 'Backlog', priority: 'Unscheduled' }),
      'backlog/b.md': brief({ title: 'Beta', sprint: 'Backlog', status: '🚧 Blocked — waiting on the owner', priority: 'Unscheduled' }),
    },
  );
  const { code, out } = run(p);
  assert.equal(code, 0);
  assert.equal(boardRows(out).length, 2, 'both open rows render');
  for (const r of boardRows(out)) assert.match(r, /\| — \|/, 'the unranked cell is rendered as written');
  assert.equal(rollup(out).trim(), '1 blocked · 1 backlog  —  of 2');
  assert.equal(rollupSum(out), 2);
});

// A brief whose ## Priority carries a free-text qualifier (`Unscheduled — high-value (…)`) is live in
// this repo. It must not become a number, and must not break the stem fallback.
test('task 68: a free-text ## Priority qualifier does not leak into the board or the FACTS id', () => {
  const p = backlogFixture(
    ['| 🔲 Backlog | — | Alpha | [`a.md`](../tasks/backlog/a.md) |'],
    { 'backlog/a.md': '# Alpha\n\n## Sprint\nBacklog\n\n## Priority\nUnscheduled — high-value (see Context)\n\n## Context\n\nB.\n' },
  );
  const { code, out } = run(p);
  assert.equal(code, 0);
  assert.match(boardRows(out)[0], /\| — \|/, 'the board shows the plan cell, never the brief field');
  assert.ok(facts(out).some((f) => /^drift nonconformance \d{4}-a /.test(f)), 'folder-name fallback still applies');
  // ⚠️ THE DISTINGUISHING ASSERTION (review R5). Without this the test passes for ANY brief priority,
  // so it proved nothing about the free-text qualifier it exists to test. The qualifier must not reach
  // the board cell, the FACTS id, or anywhere else in the output.
  assert.doesNotMatch(out, /high-value/, 'the free-text qualifier leaks nowhere');
  assert.doesNotMatch(out, /Unscheduled/, 'nor does the brief-side Priority field at all');
});

// R7 — `PLAN_SPRINT` has THREE consumers, not one. I claimed only drift rule 1 changed behavior; the
// review showed the `unresolved-plan-sprint` fact and the roll-up's plan-level-drift clause changed
// too. Those two ARE the intended fix — but nothing asserted them, so a regression would be silent.
test('task 68: the backlog identity also silences the plan-level drift clause, not just the fact', () => {
  const p = backlogFixture(
    ['| 🔲 Backlog | — | Alpha | [`a.md`](../tasks/backlog/a.md) |'],
    { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Backlog', priority: 'Unscheduled' }) },
  );
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.includes('unresolved-plan-sprint')).length, 0, 'consumer 2: the fact');
  assert.doesNotMatch(rollup(out), /on the plan itself/, 'consumer 3: the roll-up clause');
  assert.doesNotMatch(rollup(out), /drift/, 'a clean backlog board carries no drift clause at all');
});

// A plan with NO recoverable identity must still report — the backlog rule is one filename, not a
// blanket "stop complaining about unresolved sprints".
test('task 68: a genuinely unidentifiable plan still reports unresolved-plan-sprint', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/backlog', 'sprints']) mkdirSync(join(agents, d), { recursive: true });
  writeFileSync(join(agents, 'tasks/backlog/a.md'), brief({ title: 'Alpha' }));
  // Prose H1, and a filename that is neither `sprint-N` nor `backlog`.
  const planPath = join(agents, 'sprints', 'hardening.md');
  writeFileSync(planPath, '# Hardening — the launcher push\n\n## Status\n\n| Status | Priority | Task | Brief |\n|---|---|---|---|\n| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |\n');
  const { out } = run(planPath);
  assert.ok(facts(out).some((f) => f.includes('unresolved-plan-sprint')), 'the backlog rule must not over-reach');
  assert.match(rollup(out), /on the plan itself/);
});

// R2 — the stem is NOT always a single token. Reproduced live before the guard: two rows yielded
// `drift on tasks my, re[a]d, task` — a phantom third task, and a broken positional FACTS grammar.
// ⚠️ Glob metacharacters matter as much as spaces: `$DRIFT_TASKS` is word-split UNQUOTED.
test('task 68: a filename with spaces or glob metacharacters cannot break the FACTS grammar', () => {
  const p = backlogFixture(
    [
      '| 🔲 Backlog | — | Spaced | [`my task.md`](../tasks/backlog/my task.md) |',
      '| 🔲 Backlog | — | Globby | [`re[a]d.md`](../tasks/backlog/re[a]d.md) |',
    ],
    {
      'backlog/my task.md': '# S\n\n## Sprint\nBacklog\n\n## Priority\nUnscheduled\n\n## Context\n\nB.\n',
      'backlog/re[a]d.md': '# G\n\n## Sprint\nBacklog\n\n## Priority\nUnscheduled\n\n## Context\n\nB.\n',
    },
  );
  const { out } = run(p);
  const ids = facts(out).filter((f) => f.startsWith('drift nonconformance')).map((f) => f.split(' ')[2]);
  assert.equal(ids.length, 2, 'two rows, two records');
  for (const id of ids) {
    assert.doesNotMatch(id, /[^A-Za-z0-9._-]/, `id ${id} must be a single safe token`);
  }
  // The roll-up must name exactly the two real tasks — not three, and not a phantom.
  const named = rollup(out).replace(/^.*drift on tasks /, '').replace(/ — see above\..*$/, '').split(', ');
  assert.equal(named.length, 2, `roll-up invented a task: ${JSON.stringify(named)}`);
});

// R1 — THE REGRESSION GUARD. Giving `backlog.md` a `Backlog` identity activated drift rule 1's skip,
// silently losing a finding the script reported before task 68. A/B verified at the time; this test is
// what stops it coming back.
//
// ⚠️ "Scheduled but still on the unscheduled board" is the backlog board's HIGHEST-VALUE drift. Rule 1
// exists to excuse a brief that names another sprint — legitimate on a sprint board (a moved row),
// and precisely the defect here. If this test goes red, do not relax it: the skip has been
// re-activated and the board has gone quiet about scheduled work.
test('task 68 / R1: a backlog row whose brief names a real sprint is DRIFT, never a rule-1 skip', () => {
  const p = backlogFixture(
    ['| 🔲 Backlog | — | Alpha | [`a.md`](../tasks/backlog/a.md) |'],
    { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 2', status: '🔄 In progress', priority: 7 }) },
  );
  const { out } = run(p);
  const d = facts(out).find((f) => f.startsWith('drift disagreement'));
  assert.ok(d, 'the skip must NOT apply on the backlog board');
  assert.match(d, /brief_sprint="Sprint 2"/, 'and the record names the actual problem');
  assert.match(boardRows(out)[0], /\| waiting on owner \|$/);
});

// The mirror case: rule 1 STILL skips on a real sprint board. The backlog arm must not have broken it.
test('task 68 / R1: rule 1 still skips normally on a numbered sprint board', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '✅ Done', priority: 3 }) },
  });
  const { out } = run(p);
  assert.equal(
    facts(out).filter((f) => f.startsWith('drift disagreement')).length, 0,
    'a brief naming another sprint is a legitimate skip on a SPRINT board — rule 1 is intact',
  );
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// TASK 76 — the two new drift kinds the folder migration introduces (design spec §3.5, §4; ADR-029
// Decisions 5 and 1). Both are §10 "assertions to add" and both are RED-PROVED: the negative case
// confirms the check bites, so a check that reported regardless of input cannot pass here
// (test/prove-red.sh:4-8 is the same discipline applied to the launcher guards).

// Build a single-task tree at tasks/done/<folderName>/ with a caller-controlled brief body (no `## ID`
// auto-injection — these tests deliberately control the ID carrier), plus optional companion files.
function folderTree({ folderName, briefBody = null, companions = [] }) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/done', 'sprints']) mkdirSync(join(agents, d), { recursive: true });
  const folder = join(agents, 'tasks', 'done', folderName);
  mkdirSync(folder, { recursive: true });
  if (briefBody !== null) writeFileSync(join(folder, 'brief.md'), briefBody);
  for (const c of companions) writeFileSync(join(folder, c), 'reserved companion\n');
  const planPath = join(agents, 'sprints', 'sprint-1.md');
  writeFileSync(planPath, plan([`| ✅ Done | 1 | Alpha | [\`alpha\`](../tasks/done/${folderName}/brief.md) |`]));
  return run(planPath);
}

const doneBrief = (id) => `# Alpha\n\n## ID\n${id}\n\n## Sprint\nSprint 1\n\n## Priority\n1\n\n## Status\n✅ Done\n\n## Context\n\nB.\n`;

// §3.5 / ADR-029 Decision 5 — the brief's `## ID` and the folder-name prefix are two carriers; the
// folder is authoritative and the disagreement is REPORTED (never auto-corrected), naming both values.
test('task 76: id-mismatch — brief ## ID disagrees with folder prefix → drift naming BOTH; correcting it clears the record', () => {
  const bad = folderTree({ folderName: '0042-alpha', briefBody: doneBrief('0099') });
  assert.equal(bad.code, 0, 'a disagreement is a drift record, not a hard failure');
  assert.ok(
    facts(bad.out).some((f) => /^drift id-mismatch 1 brief_id="0099" folder="0042-alpha"/.test(f)),
    'the record names BOTH carriers (folder authoritative), like the status cross-check',
  );
  // RED-PROVE: make the ID match the folder — the record MUST disappear. A check that fired regardless
  // would still fire here and fail this assertion.
  const good = folderTree({ folderName: '0042-alpha', briefBody: doneBrief('0042') });
  assert.equal(
    facts(good.out).filter((f) => f.includes('id-mismatch')).length, 0,
    'when ## ID equals the folder prefix there is no disagreement — the guard bites',
  );
});

// §4 / ADR-029 Decision 1 — a task folder WITHOUT brief.md is malformed and reported; the normal case
// (brief.md present, optionally with reserved companions plan.md/worklog.md/review.md/assets) is not.
test('task 76: malformed-folder — a folder without brief.md is drift; adding brief.md clears it; reserved companions are never drift', () => {
  const bad = folderTree({ folderName: '0042-alpha', briefBody: null });
  assert.equal(bad.code, 0, 'malformed is reported, not fatal');
  assert.ok(
    facts(bad.out).some((f) => /^drift malformed-folder 1 folder="0042-alpha" location="done\/"/.test(f)),
    'a task folder lacking brief.md is reported as malformed',
  );
  // RED-PROVE: add brief.md — the malformed record MUST disappear.
  const good = folderTree({ folderName: '0042-alpha', briefBody: doneBrief('0042') });
  assert.equal(
    facts(good.out).filter((f) => f.includes('malformed-folder')).length, 0,
    'a folder containing brief.md is the normal case — the guard bites',
  );
  // And brief.md PLUS a reserved companion (plan.md) is still the normal case, never malformed —
  // assert it explicitly, or the check would flag every task that has a plan.
  const withPlan = folderTree({ folderName: '0042-alpha', briefBody: doneBrief('0042'), companions: ['plan.md'] });
  assert.equal(
    facts(withPlan.out).filter((f) => f.includes('malformed-folder')).length, 0,
    'brief.md + plan.md is the normal case; reserved companions are not drift',
  );
});

// R#4 (owner-approved) — a brief with NO `## ID` is `brief-missing-id`, symmetric with
// `brief-missing-status`: an absent second carrier the id-mismatch reconciliation cannot see. Since
// ADR-029 every brief carries `## ID`, so its absence is a real defect. Red-proved.
const noIdBrief = '# Alpha\n\n## Sprint\nSprint 1\n\n## Priority\n1\n\n## Status\n✅ Done\n\n## Context\n\nB.\n';

test('task 76: brief-missing-id — a brief with no ## ID is nonconformance; adding ## ID clears it', () => {
  const bad = folderTree({ folderName: '0042-alpha', briefBody: noIdBrief });
  assert.equal(bad.code, 0, 'a missing ## ID is a drift record, not a hard failure');
  assert.ok(
    facts(bad.out).some((f) => /^drift nonconformance 1 kind="brief-missing-id" folder="0042-alpha"/.test(f)),
    'a brief lacking ## ID is reported as brief-missing-id, naming the folder',
  );
  // RED-PROVE: add ## ID matching the folder — the record MUST disappear.
  const good = folderTree({ folderName: '0042-alpha', briefBody: doneBrief('0042') });
  assert.equal(
    facts(good.out).filter((f) => f.includes('brief-missing-id')).length, 0,
    'a brief carrying ## ID has no missing-id nonconformance — the guard bites',
  );
});
