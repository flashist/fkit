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
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, readdirSync, chmodSync, existsSync } from 'node:fs';
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
    // Mirror the ## ID fold: task 0106 made ## Owner mandatory, so a brief without one now emits a
    // `brief-missing-owner` drift. Inject a default owner when absent so existing fixtures stay clean;
    // a fixture that WANTS the missing-owner case declares `## Owner` with an empty value (that matches
    // this guard, so no injection, and the empty value renders `—` + drift).
    const withOwner = /\n## Owner\n/.test(withId)
      ? withId
      : withId.replace(/^(# .*\n\n(?:## ID\n\d+\n\n)?)/, `$1## Owner\nfkit-coder\n\n`);
    writeFileSync(join(folder, 'brief.md'), withOwner);
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

// `planName` exists because for ADR-040's T2–T11 THE FILENAME IS THE THING UNDER TEST (rung 2).
// Defaulted to the historic `sprint-1.md`, so every pre-existing caller is unaffected.
function fixture({ plan, briefs = {}, planDir = 'sprints', planName = 'sprint-1.md' }) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/backlog', 'tasks/done', 'tasks/cancelled', 'sprints', 'sprints/done']) {
    mkdirSync(join(agents, d), { recursive: true });
  }
  const planText = foldBriefsAndPlan(agents, briefs, plan);
  const planPath = join(agents, planDir, planName);
  writeFileSync(planPath, planText);
  return planPath;
}

function brief({ title = 'T', sprint = 'Sprint 1', status = '🔲 Backlog', priority = 1, id = null, extra = '' }) {
  const idBlock = id ? `## ID\n${id}\n\n` : '';
  return `# ${title}\n\n${idBlock}## Sprint\n${sprint}\n\n## Priority\n${priority}\n\n## Status\n${status}\n\n## Context\n\nBody.\n${extra}\n`;
}

// ADR-047 §2 — the line-3 sprint-status banner. ⚠️ THE DEFAULT IS NOT DECORATION: after ADR-047 a
// board with no banner has status `unresolved`, is never eligible, and (with an eligible identity)
// emits `drift sprint-status-missing`. Measured on this suite: adding that one drift reds 17
// render-path tests — exact-stdout, roll-up, `0210/*`, `task 65/*` — none of which is about sprint
// status. Giving the two shared fixture builders a default banner takes all 17 back to green with NO
// expected-stdout string touched, because the banner lives in the plan SOURCE and never reaches the
// rendered board.
//
// ⚠️ ACCEPTED COST, NAMED: "no banner" stops being the default fixture state, so a regression where the
// render path FAILS to emit `sprint-status-missing` is pinned by P3 alone. ⛔ P3 is therefore not
// optional and must assert both routes.
//
// Pass `banner: null` for a fixture that must genuinely carry no status.
const DEFAULT_BANNER = '> ## 🔄 In progress — 2026-01-01.';

// A plan with the given table rows (each already a `| … |` line).
function plan(rows, { title = '# Sprint 1 — Test', extraSections = '', banner = DEFAULT_BANNER } = {}) {
  const head = banner ? `${title}\n\n${banner}\n>\n` : `${title}\n`;
  return `${head}\nIntro prose that claims 99 tickets, which is a lie the script must ignore.\n\n## Status\n\n| Status | Priority | Task | Brief |\n|---|---|---|---|\n${rows.join('\n')}\n\n## Notes\n\nTail.\n${extraSections}\n`;
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
  assert.match(out, /^⟦fkit-dashboard v2⟧/);
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
  assert.ok(facts(out).some((f) => f.startsWith('drift disagreement 0001 ')), 'the fact must be emitted');
  assert.match(rollup(out), /drift on tasks 0001 — see above\./);
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
    facts(out).some((f) => f.includes('drift nonconformance 0001 kind="cancelled-without-reason"')),
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
    facts(out).some((f) => f.includes('drift disagreement 0001') && f.includes('moved_target="Sprint 2"') && f.includes('brief_sprint="Sprint 5"')),
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
    facts(out).some((f) => f.includes('drift relocated 0001') && f.includes('found="../tasks/done/0001-a/brief.md"')),
    'the relocation is reported',
  );
  assert.match(boardRows(out)[0], /\(\.\.\/tasks\/done\/0001-a\/brief\.md\)/, 'the board renders the corrected link');
});

// 8 — a missing brief is reported, and THE ROW STILL RENDERS. A board that drops a row lies about scope.
test('missing brief: fact emitted, row still renders', () => {
  // Folder-shape href to a folder that does not exist → missing-brief (not malformed: nothing is there).
  const p = fixture({ plan: plan(['| 🔲 Backlog | 1 | Ghost | [`gone`](../tasks/backlog/0099-gone/brief.md) |']), briefs: {} });
  const { out } = run(p);
  // ⚠️ `0099`, NOT the priority `1` — task 0103. `tid` is derived SYNTACTICALLY from the href, with no
  // filesystem requirement, so an unresolvable row still names the task the reader must go and find.
  assert.ok(facts(out).some((f) => f.includes('drift missing-brief 0099')));
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
  assert.ok(facts(out).some((f) => f === 'derive 0001 depends="task 26 and task 27."'));
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

// 9b — task 0107: a DECORATED declaration (label not flush against `**`) is the task-84 misreport
// shape. It must render LOUD (⟨UNPARSEABLE — see brief⟩ + drift), NEVER silent `none recorded`/`ready`.
test('decorated Depends-on (⚠️ before the label) → LOUD ⟨UNPARSEABLE⟩ + drift, never a false ready', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: {
      'backlog/a.md': brief({
        title: 'Alpha',
        priority: 1,
        extra: '\n- **⚠️ Depends on tasks 82, 83 and 81 Part D — a real dependency.** The work…\n',
      }),
    },
  });
  const { out } = run(p);
  assert.match(boardRows(out)[0], /⟨derive: UNPARSEABLE — see brief⟩/, 'the decorated declaration is read LOUD');
  assert.doesNotMatch(boardRows(out)[0], /none recorded|ready|after/, 'never a fabricated absence');
  assert.ok(
    facts(out).some((f) => /^drift depends-unparseable 0001 /.test(f) && /form="U"/.test(f)),
    'a drift fact is emitted so the LOUD row reaches the owner',
  );
});

// 9c — the guard is LETTER-BLOCKED: prose that merely MENTIONS "Depends on" (a letter before the label,
// or inside a code span) is NOT a declaration and must NOT trip the guard. Regression guard for the
// naive "any mention" reading, which would fabricate drift on task 0107's own brief.
test('prose mention of Depends on (letters before the label) → still ⟨none recorded⟩, no drift', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: {
      'backlog/a.md': brief({
        title: 'Alpha',
        priority: 1,
        extra: '\nObserved: task 84 declares "Depends on tasks 82, 83" in its Notes, and teaching the\nscript to read a `Depends on:` line is one option.\n',
      }),
    },
  });
  const { out } = run(p);
  assert.match(boardRows(out)[0], /⟨derive: none recorded⟩/, 'a bare prose mention is not a declaration');
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'no phantom drift on prose');
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
  assert.ok(facts(out).some((f) => f.includes('drift nonconformance 0002 kind="unknown-marker"')));
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
    '⟦fkit-dashboard v2⟧',
    '⟦BOARD⟧',
    '| Status | # | Task | Filename | Owner | Next step |',
    '|---|---|---|---|---|---|',
    // ⚠️ The ✅ row is ABSENT BY DESIGN (task 65: the board shows open work only). The roll-up below
    // still reads `1 done · 1 backlog  —  of 2` — that mismatch between rows shown and rows counted
    // is the contract, not a bug. Do not "restore" the done row to make them agree.
    '| 🔲 Backlog | 2 | Beta | [`b.md`](../tasks/backlog/0002-b/brief.md) | fkit-coder | ⟨derive: none recorded⟩ |',
    '',
    '1 done · 1 backlog  —  of 2',
    '⟦FACTS⟧',
    'total 2',
    'count done 1',
    'count backlog 1',
    'derive 0002 depends="none recorded"',
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
    facts(out).includes('derive 0001 depends="task 26 and task 27."'),
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
  assert.ok(facts(out).includes('derive 0001 depends="task 5."'));
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
  assert.ok(facts(out).includes(`derive 0001 depends="${dep}"`), 'raw, whole, uncapped');
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
  assert.ok(facts(out).some((f) => f.startsWith('drift missing-sprint 0001')), 'fail loud, not silent');
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

// R8 (third case) — ⛔ KNOWN-RED, ON PURPOSE. THIS TEST IS EXPECTED TO FAIL on today's dashboard.sh.
// If you are staring at a red suite: this is a filed, known defect, not a break you just caused.
//
// The defect — reported by a downstream fkit project running 0.2.1, against the same 945-line
// dashboard.sh we ship:
//   ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md
// Task 0259 files this fixture · task 0260 decided the fix shape → ADR-040 (accepted), where this
// case is required test T1 · task 0264 is the implementation follow-on, and landing ADR-040's
// identity grammar there is what turns this green.
//
// ⚠️ WHAT THIS CASE DOES *NOT* PROVE: it goes green under ANY identity that is not `Sprint 9` —
// including ADR-040's REJECTED numeric-only widening, which resolves `plan-sprint-4.md` → `Sprint 4`
// correctly by luck on this one filename. T1 alone cannot tell a correct grammar from a lucky one.
// ADR-040's T2 (`plan-sprint-4c.md`) is the discriminator, and it belongs to 0264, not here.
//
// ⛔ Do NOT make it pass by widening either matcher ad hoc. ADR-040's hard constraint: a WRONG
// identity is strictly WORSE than NO identity — `plan-sprint-4c.md` naively resolving to "Sprint 4"
// makes rule 1 live and wrong, turning today's LOUD failure into a SILENT one.
//
// Why the two R8 cases above do not catch it: :641 proves the filename fallback works when the
// filename ALREADY matches `^sprint-[0-9]+$`; :654 uses `hardening.md` and pins the REPORTING path.
// Neither asserts the shape real projects actually use — a `plan-`prefixed filename AND a
// product-prefixed H1 — where BOTH rungs miss and rule 1 goes inert. Green for a fixture-shaped
// reason. Filename and H1 are taken verbatim from the report's §7 table of 12 real plan names.
//
// Built by hand like the :654 case rather than through fixture(): that helper names the plan file
// `sprint-1.md`, and THE FILENAME IS THE THING UNDER TEST.
//
// ⚠️ ONE DELIBERATE DEVIATION FROM §7: the status heading here is `## Status`, not the reporter's
// `## Sprint 4 Status`. Theirs dies at dashboard.sh:206 before any drift logic runs — their own data
// defect, report §7 note 2, which they explicitly asked us not to fix. This fixture has to REACH
// rule 1 to say anything about it.
test('R8: a product-prefixed H1 on a `plan-sprint-N.md` filename must keep rule 1 alive', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/backlog', 'tasks/done', 'tasks/cancelled', 'sprints', 'sprints/done']) {
    mkdirSync(join(agents, d), { recursive: true });
  }
  const planText = foldBriefsAndPlan(
    agents,
    { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
    plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |'], {
      title: '# Geoconflict — Sprint 4 — In-App Monetization & Citizenship',
    }),
  );
  const planPath = join(agents, 'sprints', 'plan-sprint-4.md');
  writeFileSync(planPath, planText);
  const { out } = run(planPath);
  // The drift facts ride the assertion message on purpose: the red output must show
  // `drift unresolved-plan-sprint` — the identity failing to resolve — so a reader can see it is red
  // for THE STATED REASON and not some other one, without a second assertion that would itself
  // invert to red the moment 0264 lands.
  const drift = facts(out).filter((f) => f.startsWith('drift '));
  // Fixture-integrity guard. The assertion below is an ABSENCE check, so an unresolved plan→brief
  // link satisfies it while the defect is fully intact — dashboard.sh emits `drift missing-brief`
  // instead of `drift disagreement`, `unresolved-plan-sprint` still fires, and the case flips green
  // for a reason that has nothing to do with what it pins (verified by A/B). This guard holds both
  // today and once 0264 lands — the link resolves in both — so it never inverts.
  assert.equal(
    drift.filter((f) => f.includes('missing-brief')).length,
    0,
    `the plan→brief link must resolve, or the absence check below proves nothing. Drift facts: ${JSON.stringify(drift)}`,
  );
  assert.equal(
    drift.filter((f) => f.startsWith('drift disagreement')).length,
    0,
    `rule 1 must still skip: the brief belongs to Sprint 9, not to this plan. Drift facts: ${JSON.stringify(drift)}`,
  );
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// ADR-040 T2–T11 — the identity grammar (task 0264). T1 is the case immediately above (task 0259);
// it is NOT duplicated here. ADR-040:
//   ai-agents/knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md
//
// The grammar's hard constraint, in ADR-040's words: a WRONG identity is strictly worse than NO
// identity. A wrong one makes drift rule 1 live and wrong — a silent failure; no identity at all is
// reported as `unresolved-plan-sprint` — a loud one. Most cases below therefore pin a REFUSAL.
//
// ⛔ T8 is deliberately absent: ADR-040's T8 is the existing R7 test `task 68: the backlog identity
// also silences the plan-level drift clause, not just the fact`. Its obligation is that it stays
// GREEN BYTE-UNCHANGED, not that it be duplicated here.

// Every case below asserts an ABSENCE, or a presence that a broken fixture would also produce, so
// each one first proves the plan→brief link resolved — the same guard T1's own comment explains. A
// fixture whose link is broken emits `drift missing-brief` instead, and the real assertions then
// pass (or fail) for a reason that has nothing to do with the identity grammar.
function adr040Drift(out, where) {
  const drift = facts(out).filter((f) => f.startsWith('drift '));
  assert.equal(
    drift.filter((f) => f.includes('missing-brief')).length,
    0,
    `${where}: the plan→brief link must resolve, or these assertions prove nothing. Drift facts: ${JSON.stringify(drift)}`,
  );
  return drift;
}

const ADR040_ROW = '| ✅ Done | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |';

// T2 — THE DISCRIMINATOR T1 cannot be. T1 goes green under ADR-040's REJECTED numeric-only widening,
// which resolves `plan-sprint-4.md` → `Sprint 4` correctly by luck. This case does not.
//
// ⚠️ Under that rejected widening — an UNANCHORED numeric match, which finds `Sprint 4` inside the
// segment `Sprint 4c` — BOTH assertions below invert: (A) identity `Sprint 4` would equal the
// brief's, rule 1 would stop skipping, and a disagreement would fire; (B) identity `Sprint 4` would
// differ from the brief's `Sprint 4c`, rule 1 would skip, and the real disagreement would vanish.
// That two-way inversion is the whole point of the case — do not drop either sub-case.
test('ADR-040 T2: a letter-suffixed H1 segment resolves as `Sprint 4c`, never as `Sprint 4`', () => {
  const title = '# Geoconflict — Sprint 4c — Production Stabilization';

  // A) the brief belongs to `Sprint 4` — a DIFFERENT sprint. Rule 1 must skip the cross-check.
  const a = fixture({
    planName: 'plan-sprint-4c.md',
    plan: plan([ADR040_ROW], { title }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 4', status: '🔲 Backlog', priority: 1 }) },
  });
  const driftA = adr040Drift(run(a).out, 'T2a');
  assert.equal(
    driftA.filter((f) => f.startsWith('drift disagreement')).length,
    0,
    `rule 1 must skip: Sprint 4 is not this plan's Sprint 4c. Drift facts: ${JSON.stringify(driftA)}`,
  );

  // B) the brief belongs to `Sprint 4c` — THIS plan. Rule 1 must NOT skip, and the full rule-3
  //    cross-check must find the plan's `✅ Done` against the brief's `🔲 Backlog`.
  const b = fixture({
    planName: 'plan-sprint-4c.md',
    plan: plan([ADR040_ROW], { title }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 4c', status: '🔲 Backlog', priority: 1 }) },
  });
  const driftB = adr040Drift(run(b).out, 'T2b');
  assert.equal(
    driftB.filter((f) => f.startsWith('drift disagreement')).length,
    1,
    `rule 1 must NOT skip: the brief names this very plan. Drift facts: ${JSON.stringify(driftB)}`,
  );
});

// T3 — CONTAINMENT IS NOT IDENTITY. `Post-Sprint 2 Hotfix Tasks` is a real plan name from the
// downstream report's §7 table, and it is deliberately NOT Sprint 2. A "find `Sprint N` anywhere"
// rule claims it and hands rule 1 a WRONG identity. Asserting all three consumers, per R7's
// precedent: the fact, the rule-1 behaviour, and the roll-up clause.
test('ADR-040 T3: `Post-Sprint 2` is prose containment, not the Sprint 2 identity', () => {
  const p = fixture({
    planName: 'hotfix-post-sprint2.md',
    plan: plan([ADR040_ROW], { title: '# Geoconflict — Post-Sprint 2 Hotfix Tasks' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
  });
  const { out } = run(p);
  const drift = adr040Drift(out, 'T3');
  // consumer 1 — the identity is empty, so rule 1 must NOT skip and the cross-check must run.
  assert.equal(
    drift.filter((f) => f.startsWith('drift disagreement')).length,
    1,
    `an unresolved identity must not silently activate rule 1's skip. Drift facts: ${JSON.stringify(drift)}`,
  );
  // consumer 2 — and the unresolved identity is itself reported.
  assert.ok(
    drift.some((f) => f.startsWith('drift unresolved-plan-sprint')),
    `the refusal must be LOUD. Drift facts: ${JSON.stringify(drift)}`,
  );
  // consumer 3 — and it reaches the roll-up.
  assert.match(rollup(out), /on the plan itself/);
});

// T4 — a plan with no sprint identity anywhere: prose H1, prose filename.
test('ADR-040 T4: `plan-index.md` with a prose H1 resolves EMPTY and is reported', () => {
  const p = fixture({
    planName: 'plan-index.md',
    plan: plan([ADR040_ROW], { title: '# Geoconflict — Execution Plan Index' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
  });
  const { out } = run(p);
  const drift = adr040Drift(out, 'T4');
  assert.ok(
    drift.some((f) => f.startsWith('drift unresolved-plan-sprint')),
    `Drift facts: ${JSON.stringify(drift)}`,
  );
  assert.match(rollup(out), /on the plan itself/);
});

// T5 — THE BINDING REGRESSION GUARD. ADR-040 §7: "A genuinely unidentifiable plan MUST still report
// `unresolved-plan-sprint`." An implementation that drops this case does not satisfy ADR-040,
// however well it resolves the other eleven rows. The pressure this guard is under is that every
// other case pushes toward resolving MORE plans; this one pins the floor.
test('ADR-040 T5: a genuinely unidentifiable plan is still REPORTED, not silently ignored', () => {
  for (const [where, title] of [
    // (a) ADR-040's own named fixture shape — no `Sprint` token at all.
    ['T5a', '# Hardening'],
    // (b) new coverage the widened rung 1 makes possible: a COLON-delimited segment that contains
    //     `Sprint 4` as prose. The segment is `Sprint 4 carryover`, which is not the token.
    ['T5b', '# Roadmap: Sprint 4 carryover'],
  ]) {
    const p = fixture({
      planName: 'hardening.md',
      plan: plan([ADR040_ROW], { title }),
      briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
    });
    const { out } = run(p);
    const drift = adr040Drift(out, where);
    assert.ok(
      drift.some((f) => f.startsWith('drift unresolved-plan-sprint')),
      `${where} (${title}): the refusal must be reported. Drift facts: ${JSON.stringify(drift)}`,
    );
    assert.match(rollup(out), /on the plan itself/, `${where} (${title}): and it must reach the roll-up`);
  }
});

// T6 — TWO DIFFERENT identity tokens in one H1: refuse, do not guess. ADR-040 §2.5. Both sub-cases
// below use `# Sprint 5 — Sprint 6`, so what they pin is the REFUSAL on two different tokens, and
// where the identity comes from once rung 1 has refused.
//
// ⚠️ WHAT THIS TEST DOES **NOT** COVER (0264 review R3, deferred by owner ruling 2026-08-11).
// The rule counts DISTINCT tokens, not total, so `# Sprint 5 — Sprint 5` names one sprint twice and
// still RESOLVES. That behavior is implemented (the `seen` de-dup at `dashboard.sh:118`) but **no
// test pins it**: dropping `seen` entirely leaves the whole suite green (measured). Both fixtures
// here use two DIFFERENT identities, so neither exercises the de-dup. An earlier version of this
// comment claimed that coverage; it did not exist. Adding the guard is filed as follow-up work —
// see residual A2 item 1 in this task's `review.md`. Do not read this test as covering it.
test('ADR-040 T6: an H1 naming two different sprints refuses at rung 1', () => {
  const title = '# Sprint 5 — Sprint 6';

  // (a) rung 1 refuses, so the FILENAME decides. Discriminated on purpose: a brief reading
  //     `## Sprint: Sprint 5` plus a status mismatch fires a disagreement only if the identity is
  //     `Sprint 5`. It would NOT fire if rung 1 had guessed `Sprint 6`.
  const a = fixture({
    planName: 'sprint-5.md',
    plan: plan([ADR040_ROW], { title }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 5', status: '🔲 Backlog', priority: 1 }) },
  });
  const driftA = adr040Drift(run(a).out, 'T6a');
  assert.equal(
    driftA.filter((f) => f.startsWith('drift disagreement')).length,
    1,
    `the identity must be the filename's Sprint 5, not a guess at Sprint 6. Drift facts: ${JSON.stringify(driftA)}`,
  );

  // (b) with no filename to fall back on, the refusal stands and is reported.
  const b = fixture({
    planName: 'hardening.md',
    plan: plan([ADR040_ROW], { title }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
  });
  const outB = run(b).out;
  const driftB = adr040Drift(outB, 'T6b');
  assert.ok(
    driftB.some((f) => f.startsWith('drift unresolved-plan-sprint')),
    `an ambiguous H1 must resolve EMPTY and say so. Drift facts: ${JSON.stringify(driftB)}`,
  );
  assert.match(rollup(outB), /on the plan itself/);
});

// 0271/1 — THE DISTINCT-vs-TOTAL COUNT. ADR-040 §2.5 refuses on two or more DISTINCT tokens, so
// `# Sprint 5 — Sprint 5` names ONE sprint twice and must RESOLVE. The `seen` de-dup at
// `dashboard.sh:100` is what implements that, and T6 above cannot pin it — both of its fixtures use
// two DIFFERENT tokens. Measured in 0264: dropping `seen` left the whole suite green at 129/129.
//
// ⚠️ `planName: 'hardening.md'` is LOAD-BEARING. Rung 2 must be unable to answer, or a mutant that
// refuses at rung 1 would fall through to the filename and this test would pass while proving nothing
// — which is exactly how T6a is built, in the opposite direction.
//
// ⚠️ ASSERTION IDIOM (owner ruling 2026-09-10, verbatim "Field-tolerant"): assert on the FIELDS under
// test, never on whole-line stdout equality. 0338 extends this script's output grammar on purpose; a
// guard written as exact equality would red it for doing its job. Accepted cost, named by the owner:
// a stray EXTRA field would not be caught here.
test('ADR-040 0271/1: an H1 naming the SAME sprint twice resolves — the count is DISTINCT, not total', () => {
  const p = fixture({
    planName: 'hardening.md',
    plan: plan([ADR040_ROW], { title: '# Sprint 5 — Sprint 5' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 5', status: '🔲 Backlog', priority: 1 }) },
  });
  const drift = adr040Drift(run(p).out, '0271/1');
  assert.equal(
    drift.filter((f) => f.startsWith('drift unresolved-plan-sprint')).length,
    0,
    `one identity named twice must RESOLVE at rung 1, not refuse. Drift facts: ${JSON.stringify(drift)}`,
  );
  // The discriminating half: the identity really is `Sprint 5`, so rule 1 does NOT skip, and the row's
  // `✅ Done` against the brief's `🔲 Backlog` fires exactly one disagreement. Resolve to anything else
  // — or to nothing — and rule 1 skips, and this count is 0.
  assert.equal(
    drift.filter((f) => f.startsWith('drift disagreement')).length,
    1,
    `the resolved identity must be Sprint 5, and must be cross-checked. Drift facts: ${JSON.stringify(drift)}`,
  );
});

// 0271/2 — FIRST LINE ONLY. ADR-040 §2.1 reads the H1 from line 1, and `dashboard.sh:85` is
// `head -1 "$1"` — a deliberate narrowing of the former whole-file scan, not a no-op. Measured in
// 0264: replacing it with `cat "$1"` left the whole suite green at 129/129. Two consequences go
// unguarded without this test — the owner-approved narrowing can be silently reverted, and a
// whole-file scan can `print` twice and hand PLAN_SPRINT a MULTI-LINE value, a shape no consumer
// expects.
//
// The fixture puts a decoy H1 on LINE 2. Line 1 carries no identity token, so the landed code resolves
// EMPTY and reports it; under `cat` the decoy answers instead and the report goes quiet — which is the
// silent revert this pins. `planName: 'hardening.md'` again keeps rung 2 out of the way.
test('ADR-040 0271/2: the H1 is read from LINE 1 ONLY — a token on line 2 does not resolve', () => {
  const p = fixture({
    planName: 'hardening.md',
    plan: plan([ADR040_ROW], { title: '# Hardening plan\n# Decoy — Sprint 7 — tail' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
  });
  const out = run(p).out;
  const drift = adr040Drift(out, '0271/2');
  assert.ok(
    drift.some((f) => f.startsWith('drift unresolved-plan-sprint')),
    `a token on line 2 must not resolve the plan's identity. Drift facts: ${JSON.stringify(drift)}`,
  );
  assert.match(rollup(out), /on the plan itself/);
});

// T7 — the suffix bound is exactly ONE lowercase letter (owner-ruled 2026-08-10, verbatim option
// label "One letter (Recommended)").
//   `Sprint 4th` — ADR-040's own T7 row: two letters, refused.
//   `Sprint 4C`  — uppercase, refused. Not an ADR row; it is coverage for ADR-040 §5's refusal list,
//                  added here because it is the same fixture shape and costs one loop iteration.
test('ADR-040 T7: the suffix is one LOWERCASE letter — `Sprint 4th` and `Sprint 4C` are refused', () => {
  for (const [where, title] of [
    ['T7a', '# Foo — Sprint 4th — bar'],
    ['T7b', '# Foo — Sprint 4C — bar'],
  ]) {
    const p = fixture({
      planName: 'hardening.md',
      plan: plan([ADR040_ROW], { title }),
      briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
    });
    const { out } = run(p);
    const drift = adr040Drift(out, where);
    assert.ok(
      drift.some((f) => f.startsWith('drift unresolved-plan-sprint')),
      `${where} (${title}): must resolve EMPTY and be reported. Drift facts: ${JSON.stringify(drift)}`,
    );
    assert.match(rollup(out), /on the plan itself/, `${where} (${title}): and it must reach the roll-up`);
  }
});

// T9 — THE `moved_target` COMPANION (ADR-040 §6). `moved_target` is NOT one of the three
// PLAN_SPRINT consumers — it is an independent parser of the same sprint vocabulary, and drift
// rule 2 compares it against the brief's `## Sprint`. Making `Sprint 4c` a first-class identity
// without making it a first-class MOVE TARGET arms a phantom `drift disagreement` on every moved
// row: `[Sprint 4c]` parses as `Sprint 4`, which disagrees with a brief reading `Sprint 4c`.
// ⚠️ RED before the companion change, by construction.
test('ADR-040 T9: a `➡️ Moved to [Sprint 4c]` target keeps its suffix', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to [Sprint 4c](../sprint-4c.md) — priority 3 | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 4c', status: '🔲 Backlog', priority: 1 }) },
  });
  const { out } = run(p);
  const drift = adr040Drift(out, 'T9');
  assert.equal(
    drift.filter((f) => f.startsWith('drift disagreement')).length,
    0,
    `the move target IS the brief's sprint — a phantom disagreement here is the new defect. Drift facts: ${JSON.stringify(drift)}`,
  );
  assert.equal(
    drift.filter((f) => f.includes('missing-sprint')).length,
    0,
    `Drift facts: ${JSON.stringify(drift)}`,
  );
  assert.equal(
    facts(out).filter((f) => f.includes('moved-without-target')).length,
    0,
    `the target must still parse at all. Facts: ${JSON.stringify(facts(out))}`,
  );
});

// T10 — THE ONLY TEST THAT EXERCISES RUNG 2's `plan-` PREFIX AT ALL. The prefix was owner-ruled in
// on 2026-08-10 ("Include `plan-` (Recommended)") KNOWING no observed file requires it — every row
// in the downstream report's §7 table resolves at rung 1. ADR-040 §3 marks the rung a deliberate
// forward bet, and ADR-040:158-160 states the consequence: "an unevidenced rung that no test
// exercises can ship broken and stay broken."
//
// ⚠️ Sub-case B is NOT optional. Sub-case A alone goes green under ANY resolved identity that is
// not `Sprint 9` — including a broken one — which is precisely the weakness T1's own comment names
// about itself. B pins the VALUE `Sprint 7`.
test('ADR-040 T10: rung 2 resolves `plan-sprint-7.md` to `Sprint 7` through the `plan-` prefix', () => {
  const title = '# Hardening push'; // genuinely prose — rung 1 must find nothing here.

  // A) the rung is reached at all: nothing is reported unresolved, and rule 1 skips a foreign brief.
  const a = fixture({
    planName: 'plan-sprint-7.md',
    plan: plan([ADR040_ROW], { title }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
  });
  const driftA = adr040Drift(run(a).out, 'T10a');
  assert.equal(
    driftA.filter((f) => f.startsWith('drift unresolved-plan-sprint')).length,
    0,
    `rung 2 must resolve this filename. Drift facts: ${JSON.stringify(driftA)}`,
  );
  assert.equal(
    driftA.filter((f) => f.startsWith('drift disagreement')).length,
    0,
    `rule 1 must skip: Sprint 9 is not this plan. Drift facts: ${JSON.stringify(driftA)}`,
  );

  // B) and the resolved value is `Sprint 7` specifically — a brief naming it must NOT be skipped.
  const b = fixture({
    planName: 'plan-sprint-7.md',
    plan: plan([ADR040_ROW], { title }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 7', status: '🔲 Backlog', priority: 1 }) },
  });
  const driftB = adr040Drift(run(b).out, 'T10b');
  assert.equal(
    driftB.filter((f) => f.startsWith('drift disagreement')).length,
    1,
    `the identity must be Sprint 7 exactly, not merely "something". Drift facts: ${JSON.stringify(driftB)}`,
  );
});

// T11 — THE ALLOWLIST IS CLOSED. An open `.*sprint-<N>` rung would claim this filename as
// `Sprint 2` — a WRONG identity, the failure mode ADR-040 exists to prevent.
//
// ⚠️ THE FIXTURE IS `hotfix-post-sprint-2.md`, WITH A HYPHEN BEFORE THE DIGIT. It is deliberately
// NOT the downstream reporter's real `hotfix-post-sprint2.md` — that file is T3 above. The real
// file's MISSING hyphen means an open rung would not claim it, so the real file would have hidden
// this failure by luck. These are two tests, not a typo of one. Do not "correct" the filename.
test('ADR-040 T11: the `plan-` allowlist is closed — `hotfix-post-sprint-2.md` resolves EMPTY', () => {
  const p = fixture({
    planName: 'hotfix-post-sprint-2.md',
    plan: plan([ADR040_ROW], { title: '# Hardening push' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
  });
  const { out } = run(p);
  const drift = adr040Drift(out, 'T11');
  assert.ok(
    drift.some((f) => f.startsWith('drift unresolved-plan-sprint')),
    `an open rung would wrongly claim this as Sprint 2. Drift facts: ${JSON.stringify(drift)}`,
  );
  assert.match(rollup(out), /on the plan itself/);
});

// §2.2 — THE DELIMITER LIST IS NORMATIVE, AND THREE QUARTERS OF IT WAS UNGUARDED (0264 review R1).
// Every other H1 fixture in this file — the ten ADR-040 cases above and every pre-existing one —
// uses the EM DASH. Collapsing the split to em-dash-only therefore left the whole suite green
// (measured), so an edit dropping the colon, en dash or spaced hyphen would ship silently and
// `# Roadmap: Sprint 4`, `# Product – Sprint 4 – theme` and `# Product - Sprint 4 - theme` would
// quietly stop resolving. T5b's `# Roadmap: Sprint 4 carryover` does not cover this: it is a
// REFUSAL case, and it refuses whether or not colon splitting works.
//
// Each sub-case below is therefore a POSITIVE one — the split is what MANUFACTURES the matching
// segment, so deleting that one `gsub` reds that one sub-case and no other.
//
// ⚠️ Both assertions are needed to pin the VALUE, and neither does it alone (the trap T10's comment
// names). The plan cell is `✅ Done`, the brief is `🔲 Backlog`, and the brief names `Sprint 4`:
//   · identity `Sprint 4`  -> rule 1 does NOT skip -> disagreement 1, unresolved 0   <- the only pass
//   · identity EMPTY       -> rule 1 inert         -> disagreement 1, unresolved 1   <- reds on #1
//   · identity `Sprint 9`  -> rule 1 SKIPS         -> disagreement 0, unresolved 0   <- reds on #2
// The em dash is deliberately NOT re-tested here — it is exercised by T2, T3, T5, T6 and T7 above.
for (const [delim, h1] of [
  ['a colon', '# Geoconflict: Sprint 4: Monetization'],
  ['an en dash', '# Geoconflict – Sprint 4 – Monetization'],
  ['a spaced hyphen', '# Geoconflict - Sprint 4 - Monetization'],
]) {
  test(`ADR-040 §2.2: ${delim} bounds a segment — \`${h1}\` resolves as \`Sprint 4\``, () => {
    // `hardening.md` is a prose stem, so rung 2 resolves nothing: the H1 split is the ONLY source.
    const p = fixture({
      planName: 'hardening.md',
      plan: plan([ADR040_ROW], { title: h1 }),
      briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 4', status: '🔲 Backlog', priority: 1 }) },
    });
    const drift = adr040Drift(run(p).out, `§2.2 ${delim}`);
    assert.equal(
      drift.filter((f) => f.startsWith('drift unresolved-plan-sprint')).length,
      0,
      `${delim} must split the H1, or rung 1 finds no whole segment. Drift facts: ${JSON.stringify(drift)}`,
    );
    assert.equal(
      drift.filter((f) => f.startsWith('drift disagreement')).length,
      1,
      `the resolved identity must be Sprint 4 exactly, not merely "something". Drift facts: ${JSON.stringify(drift)}`,
    );
  });
}

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
    facts(out).some((f) => f.startsWith('drift disagreement 0001')),
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
  assert.ok(facts(out).includes('derive 0001 depends="task 12."'), "the repo's own prescribed form must parse");
});

test('R19: a `## Depends on` section is parsed', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n## Depends on\ntask 7\n' }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).includes('derive 0001 depends="task 7"'));
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
  assert.ok(facts(out).some((f) => f.startsWith('drift depends-unparseable 0001')), 'reported, not guessed');
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
    facts(out).includes('derive 0001 depends="task 11 (the scaffold extraction) and task 99."'),
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
  const f = facts(out).find((l) => l.startsWith('derive 0001'));
  assert.match(f, /other-task/, 'the content after an immediately-closed bold must survive');
});

test('R20: `**Depends on: x.** trailing prose` stops at the bold close', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on: nothing.** Some trailing rationale that is not a dependency.\n' }) },
  });
  const { out } = run(p);
  assert.ok(facts(out).includes('derive 0001 depends="nothing."'), 'trailing prose is not part of the declaration');
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
    const f = facts(out).find((l) => l.startsWith('derive 0001')) || '';
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
    const f = facts(out).find((l) => l.startsWith('derive 0001')) || '';
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
  const f = facts(out).find((l) => l.startsWith('derive 0001')) || '';
  assert.match(f, /tasks 25, 26, 27, 28/, 'the FIRST declaration is the dependency');
  assert.doesNotMatch(f, /^derive 0001 depends="28 \(hard\)/, 'the later mention must not hijack it');
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
  // the rendered markdown is six columns.
  assert.equal(
    boardRows(out)[0],
    '| 🚧 Blocked — a \\| b | 1 | Alpha | [`a.md`](../tasks/backlog/0001-a/brief.md) | fkit-coder | ⟨derive: none recorded⟩ |',
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
    assert.equal(boardRows(out)[0].split('|').length - 2, 6, 'the board stays six columns');
  }
});

// Task 0106 — the Owner column. dashboard.sh reads the brief's `## Owner` (same pass as `## Status`)
// and renders it as the 5th cell, between Filename and Next step. `## Owner` is mandatory (0104), so an
// absent owner renders `—` AND is flagged as `brief-missing-owner` drift, mirroring `brief-missing-status`.
test('task 0106: the Owner column renders the brief owner; a missing owner is `—` + drift', () => {
  // Explicit `## Owner` bodies: the fold injects a default only when `## Owner` is ABSENT, so an empty
  // `## Owner` value survives as the intentional missing-owner case.
  const withOwner = '# Alpha\n\n## Sprint\nSprint 1\n\n## Priority\n1\n\n## Status\n🔲 Backlog\n\n## Owner\nfkit-wiki\n\n## Context\n\nBody.\n';
  // Beta is ✅ Done — normally OMITTED from the open-work board. Its empty `## Owner` therefore also
  // proves `mark_drift`'s FUSED effects: the drift both FORCE-RENDERS the otherwise-hidden row AND
  // reaches the roll-up drift clause — not just the `add_fact` record (regression guard, review R1).
  const noOwner = '# Beta\n\n## Sprint\nSprint 1\n\n## Priority\n2\n\n## Status\n✅ Done\n\n## Owner\n\n## Context\n\nBody.\n';
  const p = fixture({
    plan: plan([
      '| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |',
      '| ✅ Done | 2 | Beta | [`b.md`](../tasks/done/b.md) |',
    ]),
    briefs: { 'backlog/a.md': withOwner, 'done/b.md': noOwner },
  });
  const { code, out } = run(p);
  assert.equal(code, 0);
  // header carries Owner, positioned between Filename and Next step
  assert.match(out, /\| Status \| # \| Task \| Filename \| Owner \| Next step \|/);
  const rows = boardRows(out);
  // Owner is the 5th ` | `-delimited field (Status·#·Task·Filename·Owner·Next step)
  const alpha = rows.find((r) => r.includes('Alpha'));
  assert.equal(alpha.split(' | ')[4], 'fkit-wiki', 'the brief owner renders in the Owner column');
  // the ✅ Done Beta row is present ONLY because its brief-missing-owner drift force-rendered it
  const beta = rows.find((r) => r.includes('Beta'));
  assert.ok(beta, 'the missing-owner Done row is force-rendered by its drift, not silently dropped');
  assert.equal(beta.split(' | ')[4], '—', 'a missing owner renders `—`, not a blank/broken row');
  // mandatory-field enforcement + the fused mark_drift effects: the FACT and the roll-up drift clause
  assert.ok(facts(out).includes('drift nonconformance 0002 kind="brief-missing-owner"'), 'missing owner is a drift fact');
  assert.match(rollup(out), /drift on tasks .*\b0002\b/, 'brief-missing-owner reaches the roll-up drift clause');
  assert.equal(
    facts(out).filter((f) => f.includes('brief-missing-owner')).length,
    1,
    'only the empty-owner brief drifts',
  );
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
    assert.match(facts(out).find((l) => l.startsWith('derive 0001')) || '', /task 12/, `${name}: the real declaration must win`);
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
    assert.ok(facts(out).some((f) => f.startsWith('drift depends-unparseable 0001')), 'a broken declaration must be loud');
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
  const f = facts(out).find((l) => l.startsWith('derive 0001')) || '';
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
  assert.ok(facts(out).includes('derive 0001 depends="task 42."'), 'the declaration wins; the span is masked, not fatal');
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
  assert.ok(facts(out).includes('derive 0001 depends="task 12."'), 'the real declaration, not the example');
});

// ⚠️ THE INVERSE OF MASKING. A dependency may legitimately BE a code span. Masking must preserve
// LENGTH (locate on the masked copy, extract from the raw) — deleting spans would destroy this.
test('R46/R47: a dependency that IS a code span survives masking', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', priority: 1, extra: '\n- **Depends on:** [`design-x`](../done/design-x.md) **(hard).**\n' }) },
  });
  const { out } = run(p);
  assert.match(facts(out).find((l) => l.startsWith('derive 0001')) || '', /design-x/, 'masking must not eat real content');
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
    '⟦fkit-dashboard v2⟧',
    '⟦BOARD⟧',
    '| Status | # | Task | Filename | Owner | Next step |',
    '|---|---|---|---|---|---|',
    '| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/0001-a/brief.md) | fkit-coder | ⟨derive: UNPARSEABLE — see brief⟩ |',
    '',
    '1 backlog  —  of 1  — as recorded; drift on tasks 0001 — see above.',
    '⟦FACTS⟧',
    'total 1',
    'count backlog 1',
    'drift depends-unparseable 0001 brief="../tasks/backlog/0001-a/brief.md" form="BL"',
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
  assert.match(facts(out).find((l) => l.startsWith('derive 0001')) || '', /nothing/);
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
  const f = facts(out).find((l) => l.startsWith('derive 0001'));
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
  assert.match(rollup(out), /drift on tasks 0001\b/, 'and it reaches the roll-up drift clause');
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
  assert.ok(facts(out).some((f) => f.startsWith('drift disagreement 0001')));
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

// Re-pointed by task 0103: the id is now the folder's bare `NNNN` prefix, not the whole folder name.
// The POINT of the test is unchanged and still load-bearing — an unranked board must not collapse
// every drifted row to a single unattributable `?`.
test('task 0103: FACTS records key by the FOLDER ID even when the priority cell is `—`', () => {
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
    facts(out).some((f) => /^drift nonconformance \d{4} /.test(f)),
    'keyed by the folder ID prefix, not `?`',
  );
  assert.doesNotMatch(rollup(out), /drift on tasks \?/, 'an unattributable `?` is the failure mode');
  assert.match(rollup(out), /drift on tasks \d{4}/);
});

// ⚠️ THE FOLDER ID WINS, AND THIS TEST WAS DELIBERATELY INVERTED (task 0103; decision report
// 2026-07-26-decide-task-folder-name-numeric-prefix.md §8 item 5). It used to assert the PRIORITY won
// (`drift nonconformance 7`) — the pre-Option-C contract, and the reason a red bar here on the day
// item 1 landed was the change WORKING. Priority is mutable board rank; the folder ID is permanent
// identity (ADR-029 Decisions 3 and 6). Do NOT "restore" the old assertion or revert step 1.
test('task 0103: a numbered sprint plan keys FACTS by the FOLDER ID, not by the priority', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 7 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': '# Alpha\n\n## Sprint\nSprint 1\n\n## Priority\n7\n\n## Context\n\nB.\n' },
  });
  const { out } = run(p);
  assert.ok(facts(out).some((f) => f.startsWith('drift nonconformance 0001 ')), 'the folder ID wins');
  assert.doesNotMatch(out, /drift nonconformance 7 /, 'the priority must not be the id');
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
  assert.ok(facts(out).some((f) => /^drift nonconformance \d{4} /.test(f)), 'the folder ID still keys the record');
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
// ⚠️ TASK 0103 ADDED THE THIRD ROW, AND WITHOUT IT THIS TEST PROVES NOTHING. Once the folder ID
// became the primary id, the first two fixtures key on their SAFE numeric prefixes (`0001`, `0002`)
// and never reach the sanitiser this test exists to guard — it would have stayed GREEN while its
// coverage silently vanished, which is worse than a red bar. The third row's folder carries NO
// numeric prefix, so the ladder falls through to arm 3 and the sanitiser is exercised for real.
test('task 0103: a folder with spaces or glob metacharacters cannot break the FACTS grammar', () => {
  const p = backlogFixture(
    [
      '| 🔲 Backlog | — | Spaced | [`my task.md`](../tasks/backlog/my task.md) |',
      '| 🔲 Backlog | — | Globby | [`re[a]d.md`](../tasks/backlog/re[a]d.md) |',
      // Written raw: its slug is absent from `briefs`, so the ID fold leaves the href alone and the
      // folder name reaches the ladder unprefixed — `raw name` → arm 3 → sanitised `raw-name`.
      '| 🔲 Backlog | — | Raw | [`raw name`](../tasks/backlog/raw name/brief.md) |',
    ],
    {
      'backlog/my task.md': '# S\n\n## Sprint\nBacklog\n\n## Priority\nUnscheduled\n\n## Context\n\nB.\n',
      'backlog/re[a]d.md': '# G\n\n## Sprint\nBacklog\n\n## Priority\nUnscheduled\n\n## Context\n\nB.\n',
    },
  );
  const { out } = run(p);
  // Every ROW-LEVEL drift record carries its id POSITIONALLY in field 3 — the hazard is the id itself,
  // not the kind, so collect across kinds (the unprefixed row reports `missing-brief`, not nonconformance).
  const ids = facts(out)
    .filter((f) => /^drift (nonconformance|missing-brief) /.test(f))
    .map((f) => f.split(' ')[2]);
  assert.equal(ids.length, 3, 'three rows, three records');
  for (const id of ids) {
    assert.doesNotMatch(id, /[^A-Za-z0-9._-]/, `id ${id} must be a single safe token`);
  }
  assert.ok(ids.includes('raw-name'), 'the unprefixed folder reached the sanitiser (arm 3), not a raw space');
  // The roll-up must name exactly the three real tasks — not four, and not a phantom.
  const named = rollup(out).replace(/^.*drift on tasks /, '').replace(/ — see above\..*$/, '').split(', ');
  assert.equal(named.length, 3, `roll-up invented a task: ${JSON.stringify(named)}`);
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
// `priority` is the PLAN ROW's Priority cell, defaulted to `1` so every existing caller is unchanged.
// It is a parameter at all so task 0103's red-proof can HOLD the folder and MOVE the priority — the
// only way to show the FACTS id follows the folder rather than merely correlating with it.
function folderTree({ folderName, briefBody = null, companions = [], priority = '1' }) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/done', 'sprints']) mkdirSync(join(agents, d), { recursive: true });
  const folder = join(agents, 'tasks', 'done', folderName);
  mkdirSync(folder, { recursive: true });
  if (briefBody !== null) writeFileSync(join(folder, 'brief.md'), briefBody);
  for (const c of companions) writeFileSync(join(folder, c), 'reserved companion\n');
  const planPath = join(agents, 'sprints', 'sprint-1.md');
  writeFileSync(planPath, plan([`| ✅ Done | ${priority} | Alpha | [\`alpha\`](../tasks/done/${folderName}/brief.md) |`]));
  return run(planPath);
}

const doneBrief = (id) => `# Alpha\n\n## ID\n${id}\n\n## Sprint\nSprint 1\n\n## Priority\n1\n\n## Status\n✅ Done\n\n## Context\n\nB.\n`;

// §3.5 / ADR-029 Decision 5 — the brief's `## ID` and the folder-name prefix are two carriers; the
// folder is authoritative and the disagreement is REPORTED (never auto-corrected), naming both values.
test('task 76: id-mismatch — brief ## ID disagrees with folder prefix → drift naming BOTH; correcting it clears the record', () => {
  const bad = folderTree({ folderName: '0042-alpha', briefBody: doneBrief('0099') });
  assert.equal(bad.code, 0, 'a disagreement is a drift record, not a hard failure');
  assert.ok(
    facts(bad.out).some((f) => /^drift id-mismatch 0042 brief_id="0099" folder="0042-alpha"/.test(f)),
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
    facts(bad.out).some((f) => /^drift malformed-folder 0042 folder="0042-alpha" location="done\/"/.test(f)),
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
    facts(bad.out).some((f) => /^drift nonconformance 0042 kind="brief-missing-id" folder="0042-alpha"/.test(f)),
    'a brief lacking ## ID is reported as brief-missing-id, naming the folder',
  );
  // RED-PROVE: add ## ID matching the folder — the record MUST disappear.
  const good = folderTree({ folderName: '0042-alpha', briefBody: doneBrief('0042') });
  assert.equal(
    facts(good.out).filter((f) => f.includes('brief-missing-id')).length, 0,
    'a brief carrying ## ID has no missing-id nonconformance — the guard bites',
  );
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// TASK 0103 — the FACTS id comes from the FOLDER, not the priority (ADR-029 Decision 6, completed;
// decision report 2026-07-26-decide-task-folder-name-numeric-prefix.md §8 item 1). RED-PROVED in
// BOTH directions: hold one variable, move the other, and watch which one the id follows. One leg
// alone is satisfiable by coincidence — leg 1 passes if the id merely CORRELATES with the folder,
// and leg 2 is what rules the priority out as the carrier.
// ─────────────────────────────────────────────────────────────────────────────────────────────────
test('task 0103: the FACTS id follows the FOLDER ID, and does not follow the priority', () => {
  const idOf = (r) => facts(r.out).find((f) => f.startsWith('drift nonconformance ')).split(' ')[2];

  // Leg 1 — HOLD the priority (both rows write `1`), MOVE the folder. The id must move.
  const a = folderTree({ folderName: '0042-alpha', briefBody: noIdBrief });
  const b = folderTree({ folderName: '0055-alpha', briefBody: noIdBrief });
  assert.equal(idOf(a), '0042');
  assert.equal(idOf(b), '0055', 'same priority, different folder → different id: the id is the FOLDER');

  // Leg 2 — HOLD the folder, MOVE the priority. The id must NOT move.
  const c = folderTree({ folderName: '0042-alpha', briefBody: noIdBrief, priority: '9' });
  assert.equal(idOf(c), '0042', 'same folder, different priority → same id: the priority is NOT the id');
  assert.doesNotMatch(c.out, /drift nonconformance 9 /, 'the priority must not surface as an id anywhere');
});

// The same inversion, proved through the `P<n>` rank token the board now renders (report §8 item 2).
// `task_id()` already strips the `P` (verified by execution), so the token is inert to the id — but
// nothing asserted it, and a parser change that broke it would otherwise ship silently.
test('task 0103: a `P<n>` priority cell parses cleanly and still does not become the id', () => {
  const r = folderTree({ folderName: '0042-alpha', briefBody: noIdBrief, priority: 'P9' });
  assert.equal(r.code, 0, 'a P-prefixed rank cell is not a parse failure');
  const id = facts(r.out).find((f) => f.startsWith('drift nonconformance ')).split(' ')[2];
  assert.equal(id, '0042', 'the folder ID wins over a P-prefixed rank cell too');
  assert.doesNotMatch(r.out, /drift nonconformance 9 /, 'the stripped rank number must not surface as an id');
  assert.match(boardRows(r.out)[0], /\| P9 \|/, 'and the board renders the rank cell verbatim, `P` and all');
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// task 0210 — THE REVERSE MOVE: `➡️ Moved to [Backlog](backlog.md)`.
//
// The target extractor only ever knew the word `Sprint`, so a row de-scoped back onto the backlog
// board parsed as target-less and was reported `moved-without-target` — a correctly-written marker
// flagged as malformed.
//
// ⚠️ THE FIX IS `sed -nE`, AND THAT IS NOT COSMETIC. The obvious repair — a BRE alternation
// `\(Sprint [0-9][0-9]*\|Backlog\)` — is a REGRESSION on BSD sed, which reads `\|` as a literal pipe:
// neither branch then matches, so the FORWARD form breaks too and every live `➡️ Moved to [Sprint N]`
// row becomes drift. It passes on GNU/Linux CI and fails on the consumer's Mac. Case E below is the
// forward-form regression guard that catches exactly that; do not delete it as redundant.
// ─────────────────────────────────────────────────────────────────────────────────────────────────

// A — the happy path the task exists for.
test('0210/A: ➡️ Moved to [Backlog] with a matching brief ## Sprint: parsed, no drift, off the board', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to [Backlog](backlog.md) | P12 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Backlog', status: '🔲 Backlog', priority: 'Unscheduled' }) },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'a correctly-written reverse move is not drift');
  assert.ok(facts(out).includes('count moved 1'), 'it still counts as moved');
  assert.equal(boardRows(out).length, 0, 'moved is inert: the row is filtered off the board');
});

// B — rule 2 still bites in this direction: the brief must be updated to `Backlog` too.
test('0210/B: ➡️ Moved to [Backlog] whose brief still names a sprint: IS drift', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to [Backlog](backlog.md) | P12 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 2', status: '🔲 Backlog' }) },
  });
  const { out } = run(p);
  assert.ok(
    facts(out).some((f) => f.includes('drift disagreement 0001') && f.includes('moved_target="Backlog"') && f.includes('brief_sprint="Sprint 2"')),
    'plan says moved to Backlog, brief still claims Sprint 2 — real drift',
  );
  assert.match(boardRows(out)[0], /\| waiting on owner \|$/);
});

// C — the R6 shape, with a Backlog target: unresolvable, so reported, not rendered clean.
test('0210/C: ➡️ Moved to [Backlog] with a brief that has no ## Sprint is reported', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to [Backlog](backlog.md) | P12 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': '# Alpha\n\n## Priority\nUnscheduled\n\n## Status\n🔲 Backlog\n\n## Context\nNo sprint heading.\n' },
  });
  const { out } = run(p);
  assert.ok(
    facts(out).some((f) => f.startsWith('drift missing-sprint 0001') && f.includes('moved_target="Backlog"')),
    'fail loud, and name the target it DID resolve',
  );
});

// D — the genuinely target-less marker must STILL be caught, AND the widened vocabulary must not have
// widened to "anything". TWO fixtures, because they are two different guards and only one of them was
// here before 0210's round-1 review (finding R3): the bare `➡️ Moved` row exercises the no-`Moved to`
// path only, so an OVER-WIDE repair — `s/.*Moved to \[*([A-Za-z]+ ?[0-9]*).*/\1/p`, which happily
// resolves `➡️ Moved to Narnia` to the target `Narnia` — left every other case in this file green and
// would have shipped silently. The second row is what makes this test guard what its name claims.
test('0210/D: a bare ➡️ Moved AND a ➡️ Moved to a non-target are both still moved-without-target', () => {
  const p = fixture({
    plan: plan([
      '| ➡️ Moved | P12 | Alpha | [`a.md`](../tasks/backlog/a.md) |',
      '| ➡️ Moved to Narnia | P12 | Beta | [`b.md`](../tasks/backlog/b.md) |',
    ]),
    briefs: {
      'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 1', status: '🔲 Backlog' }),
      'backlog/b.md': brief({ title: 'Beta', sprint: 'Sprint 1', status: '🔲 Backlog' }),
    },
  });
  const { out } = run(p);
  assert.ok(
    facts(out).some((f) => f.includes('drift nonconformance 0001') && f.includes('kind="moved-without-target"')),
    'no target is still no target',
  );
  assert.ok(
    facts(out).some((f) => f.includes('drift nonconformance 0002') && f.includes('kind="moved-without-target"')),
    'the vocabulary is `Sprint N` and `Backlog` — nothing else. An over-wide parser reads `Narnia` as a target and must go red here',
  );
});

// E — ⚠️ THE BSD REGRESSION GUARD. Two digits, so a `[0-9][0-9]*`-to-ERE slip that dropped the `+`
// would read `Sprint 1`; and an alternation written as a BSD-hostile `\|` would read NOTHING here.
test('0210/E: the forward form still parses, multi-digit and all (BSD \\| regression guard)', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to [Sprint 12](../sprint-12.md) — priority 3 | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 12', status: '🔲 Backlog', priority: 3 }) },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'the forward form must not regress: `Sprint 12`, not `Sprint 1`, not empty');
  assert.ok(facts(out).includes('count moved 1'));
  assert.equal(boardRows(out).length, 0);
});

// F — the archived href. A sprint plan moves to `sprints/done/` and its marker becomes `../backlog.md`
// (the link-rot class tasks 0050/0076 repaired). The parse is href-agnostic; pin that it stays so.
test('0210/F: the archived `../backlog.md` href parses identically — the label is what is read', () => {
  // ⚠️ THE BANNER IS PART OF THE FIXTURE, NOT DECORATION (ADR-047 §7). This is the suite's ONLY
  // `sprints/done/` fixture, and an archived board with a non-terminal status emits
  // `drift sprint-archived-not-terminal` — which would red the zero-drift assertion below for a reason
  // that has nothing to do with the href parse under test. A `✅ Done` board under `done/` is the
  // consistent pair, so both carriers agree and no sprint-level drift fires.
  const p = fixture({
    planDir: 'sprints/done',
    plan: plan(['| ➡️ Moved to [Backlog](../backlog.md) | P12 | Alpha | [`a.md`](../../tasks/backlog/a.md) |'],
      { banner: '> ## ✅ Done — 2026-01-01. Closed by /fkit-sprint-done.' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Backlog', status: '🔲 Backlog', priority: 'Unscheduled' }) },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'the href is swallowed by `.*`; only the label is read');
  assert.ok(facts(out).includes('count moved 1'));
});

// G — ⚠️ THE `\[*` GUARD (round-1 review, finding R4). The extractor's `\[*` is zero-or-more ON
// PURPOSE: historic rows recorded the move as UNLINKED PROSE (`➡️ Moved to Sprint 2 — priority 7`,
// live in ai-agents/sprints/done/sprint-1.md), and those must keep parsing. Nothing pinned that `*`
// — every other `Moved to` fixture in this file is bracketed — so tightening it to a mandatory `\[`
// left the ENTIRE suite green while turning every legacy unlinked row into `moved-without-target`
// drift. The comment above the extractor in dashboard.sh asserts this behavior; this is the test.
test('0210/G: the legacy UNLINKED prose form still parses — `\\[*` is zero-or-more by design', () => {
  const p = fixture({
    plan: plan(['| ➡️ Moved to Sprint 2 — priority 7 | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 2', status: '🔲 Backlog', priority: 7 }) },
  });
  const { out } = run(p);
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0, 'an unbracketed legacy move row is well-formed, not drift');
  assert.ok(facts(out).includes('count moved 1'), 'and it resolves to `Sprint 2`, so rule 2 agrees with the brief');
});

// ===================================================================================================
// ADR-041 — selection by resolved identity (task 0265). S1–S8 plus the §2 `Backlog` token cases.
//
// ⚠️ WHY THESE TEST A MODE AND NOT JUST A FUNCTION. ADR-041 §1.4 (ordering) and §1.5 (the
// same-identity tie-break) are SELECTION-level rules. If `dashboard.sh` only answered "what is THIS
// file's identity?", both would live in `fkit-status/SKILL.md` prose — LLM-executed, untestable, and
// exactly the gap §1.4 names when it says the ordering is "pinned by no test". `select-active` exists
// so S1–S8 are mechanically assertable. See ADR-041 §5.
//
// ⚠️ ON S1, STATED HONESTLY. This is A CONTRACT BEING WRITTEN FOR THE FIRST TIME, not a bug being
// fixed. ADR-041 §1.4 explicitly WITHDRAWS the earlier claim that today's code text-sorts
// `sprint-9` above `sprint-10` — there is no sort anywhere in the code; SKILL.md:26-28 is prose
// instructing a model, and a model asked for the highest N will most likely answer 10. The real
// defect was weaker and still sufficient: nothing pinned the ordering. Do not restate the withdrawn
// claim in a test name or a comment.

function runMode(args, env = {}) {
  const r = spawnSync('bash', [SCRIPT, ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}

// Several plans in one `sprints/`. `plans` maps filename -> full plan text.
//
// ⚠️ `foldBriefsAndPlan` is called once PER PLAN and is idempotent: it restarts its sequence each
// call, so every plan gets the same brief ids and the shared brief files are rewritten identically.
function sprintsFixture({ plans, briefs = {} }) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/backlog', 'tasks/done', 'tasks/cancelled', 'sprints', 'sprints/done']) {
    mkdirSync(join(agents, d), { recursive: true });
  }
  for (const [name, text] of Object.entries(plans)) {
    writeFileSync(join(agents, 'sprints', name), foldBriefsAndPlan(agents, briefs, text));
  }
  return { sprintsDir: join(agents, 'sprints'), planPath: (n) => join(agents, 'sprints', n) };
}

// A plan whose H1 carries no identity — the filename rung is then the thing under test.
// ⭐ It carries the same default line-3 banner as `plan()` (see DEFAULT_BANNER), so the S-scenarios keep
// testing the IDENTITY ladder instead of silently turning into status tests. `banner: null` suppresses it.
const prosePlan = (h1 = '# Hardening — the launcher sprint', banner = DEFAULT_BANNER) =>
  (banner ? `${h1}\n\n${banner}\n>\n\nBody prose.\n` : `${h1}\n\nBody prose.\n`);

function selectLines(out) {
  return out.split('⟦SELECT⟧')[1].split('⟦FACTS⟧')[0].trim().split('\n').filter(Boolean);
}
const activeLines = (out) => selectLines(out).filter((l) => l.startsWith('active'));
// ⛔ `activeLine` MUST NOT BE `find(l => l.startsWith('active'))` — ADR-047 §2.4 and P17. `active` is
// PLURAL after ADR-047, and `find` silently returns only the first, so a test asserting one line while
// the script printed three would stay GREEN. It throws instead: a wrong test can no longer pass quietly.
// Use `activeLines` for the plural cases.
const activeLine = (out) => {
  const ls = activeLines(out);
  if (ls.length > 1) {
    throw new Error(`activeLine() on PLURAL output (${ls.length} lines) — use activeLines(): ${JSON.stringify(ls)}`);
  }
  return ls[0];
};
// ⛔ AND NEITHER MAY `boardLine` BE A `find` — same ADR-047 §2.4 hazard, same reason. `board` is
// EXACTLY ONE line by contract, so a second one is the script being broken, and `find` is precisely
// the shape that would let P6/P7 stay green while it printed two. Only P1 and P17 pin board-line
// cardinality today and NEITHER carries a `⭐ ACTIVE BOARD` marker — so without this, the marker
// override, the one path that CHOOSES which board line to print, has no cardinality guard at all.
const boardLine = (out) => {
  // ⭐ NO TRAILING SPACE in the prefix — `activeLines` and `candidates` both filter without one, and a
  // bare `board` or a `board\tfile="…"` (the format string itself broken) must NOT slip past the plural
  // check (review R10). `active`, `board` and `candidate` are the only ⟦SELECT⟧ prefixes, so dropping
  // the space cannot over-match; it can only make this throw fire more often, which is the point.
  const ls = selectLines(out).filter((l) => l.startsWith('board'));
  if (ls.length > 1) {
    throw new Error(`boardLine() on PLURAL output (${ls.length} lines) — the script must print exactly one: ${JSON.stringify(ls)}`);
  }
  return ls[0];
};
const candidates = (out) => selectLines(out).filter((l) => l.startsWith('candidate'));

// S1 — §1.4 integer ordering. `Sprint 10` > `Sprint 9`, which a byte/text comparison gets backwards.
//
// ⚠️ REPINNED BY ADR-047 §2.4/§8.2, AND THE TEST NAME IS STILL ACCURATE — read it as a statement about
// ORDERING, not about selection. ADR-047 falsifies §1.4's DIRECTION only: the ordering is unchanged, the
// selector now takes the LOWEST of it. So `Sprint 10` still orders above `Sprint 9`, which now shows up
// as the ASCENDING order of the two `active` lines and as `Sprint 9` being the `board`.
// ⭐ It still discriminates: a byte/text comparison would sort `10` BELOW `9` and name `Sprint 10` the
// board — the exact inversion of what is asserted here.
test('ADR-041 S1: `Sprint 10` outranks `Sprint 9` — the ordering is a pinned contract, not prose', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'plan-sprint-9.md': prosePlan('# P — Sprint 9 — a'),
      'plan-sprint-10.md': prosePlan('# P — Sprint 10 — b'),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  assert.deepEqual(activeLines(out), [
    'active file="plan-sprint-9.md" identity="Sprint 9" status="In progress"',
    'active file="plan-sprint-10.md" identity="Sprint 10" status="In progress"',
  ]);
  assert.equal(boardLine(out),
    'board file="plan-sprint-9.md" identity="Sprint 9" status="In progress" reason="lowest-ordered"');
});

// S1b — the leading-zero normalization. `test -gt` would also get this right; the length-then-bytes
// comparison must too, and this is what pins it when someone "simplifies" the comparison.
test('ADR-041 S1b: a leading zero does not outrank — `sprint-9` beats `sprint-08`', () => {
  const { sprintsDir } = sprintsFixture({
    plans: { 'sprint-08.md': prosePlan(), 'sprint-9.md': prosePlan() },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  // ⚠️ REPINNED for ADR-047's flipped direction, and it STILL DISCRIMINATES: unnormalized, `08` is two
  // characters against `9`'s one, so length-then-bytes would rank `Sprint 08` ABOVE `Sprint 9` and the
  // lowest-ordered board would come out as `sprint-9.md` — the opposite of what is asserted.
  // ⚠️ The identity string keeps the leading zero (`Sprint 08`) — normalization lives in `id_digits`,
  // i.e. in the COMPARISON, never in the identity the ladder reports. Do not "tidy" this to `Sprint 8`.
  assert.deepEqual(activeLines(out), [
    'active file="sprint-08.md" identity="Sprint 08" status="In progress"',
    'active file="sprint-9.md" identity="Sprint 9" status="In progress"',
  ]);
  assert.equal(boardLine(out),
    'board file="sprint-08.md" identity="Sprint 08" status="In progress" reason="lowest-ordered"');
});

// S2 — suffix ordering: absent < `a` < `b` < …
test('ADR-041 S2: `Sprint 4c` > `Sprint 4b` > `Sprint 4` — the suffix orders after the number', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'plan-sprint-4.md': prosePlan(),
      'plan-sprint-4b.md': prosePlan(),
      'plan-sprint-4c.md': prosePlan(),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  // ⚠️ REPINNED for ADR-047: three DISTINCT identities, all `In progress`, so all three are active and
  // the suffix order is now read off the ASCENDING sequence. `Sprint 4` (no suffix) sorts first because
  // the empty string precedes any letter under `LC_ALL=C`, which is the property under test.
  assert.deepEqual(activeLines(out), [
    'active file="plan-sprint-4.md" identity="Sprint 4" status="In progress"',
    'active file="plan-sprint-4b.md" identity="Sprint 4b" status="In progress"',
    'active file="plan-sprint-4c.md" identity="Sprint 4c" status="In progress"',
  ]);
  assert.equal(boardLine(out),
    'board file="plan-sprint-4.md" identity="Sprint 4" status="In progress" reason="lowest-ordered"');
});

// S3 — the compounded defect, half 1. Under the retired glob `sprint-backlog.md` was the ONLY
// `sprint-*.md` match on the reporter's repo, so a bare /fkit-status called it the active sprint.
test('ADR-041 S3: `sprint-backlog.md` resolves `Backlog` and is never the active sprint', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      // `banner: null` — a Backlog board carries no sprint banner, and §7 carve-out 1 keeps that quiet.
      'sprint-backlog.md': prosePlan('# Geoconflict — Sprint Backlog', null),
      'plan-sprint-6.md': prosePlan(),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  assert.equal(activeLine(out), 'active file="plan-sprint-6.md" identity="Sprint 6" status="In progress"');
  assert.ok(candidates(out).includes('candidate file="sprint-backlog.md" identity="Backlog" status="unresolved"'),
    'it must still be listed — §1.6 wants every candidate, its identity AND its status');
  assert.ok(!activeLine(out).includes('sprint-backlog.md'), 'Backlog is never eligible');
});

// S4 — the compounded defect, half 2, and the REGAINED CHECK. `sprint-backlog.md` used to resolve
// EMPTY (its basename is not `backlog`), so it never reached the `[ "$PLAN_SPRINT" = "Backlog" ]` arm
// and lost that arm's "scheduled but still parked on the unscheduled board" test — which the script's
// own comment calls the single highest-value drift this board can surface.
//
// ⚠️ THE FIXTURE'S STATUS AND LOCATION MUST AGREE WITH THE PLAN CELL. If they disagree, rule 3 fires
// for an unrelated reason and the test proves nothing about the regained check. Measured against the
// pre-0265 script, this exact fixture was SILENT.
test('ADR-041 S4: a `sprint-backlog.md` row whose brief names a real sprint is drift — the regained check', () => {
  const p = fixture({
    planName: 'sprint-backlog.md',
    plan: plan(['| 🔲 Backlog | — | Alpha | [`a.md`](../tasks/backlog/a.md) |'],
      { title: '# Geoconflict — Sprint Backlog' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 2', status: '🔲 Backlog', priority: 'Unscheduled' }) },
  });
  const { code, out } = run(p);
  assert.equal(code, 0);
  assert.ok(facts(out).some((f) => f.startsWith('drift disagreement')),
    'scheduled into Sprint 2 but still on the unscheduled board — that is the check');
  assert.equal(facts(out).filter((f) => f.includes('unresolved-plan-sprint')).length, 0,
    'and the identity resolved, so the plan-level fact must not fire');

  // A/B twin — the ONLY difference is the brief's ## Sprint. It must go silent.
  const q = fixture({
    planName: 'sprint-backlog.md',
    plan: plan(['| 🔲 Backlog | — | Alpha | [`a.md`](../tasks/backlog/a.md) |'],
      { title: '# Geoconflict — Sprint Backlog' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Backlog', status: '🔲 Backlog', priority: 'Unscheduled' }) },
  });
  assert.equal(facts(run(q).out).filter((f) => f.startsWith('drift')).length, 0,
    'a genuinely unscheduled row on the unscheduled board is not drift');
});

// S5 — §1.6. An empty eligible set says so and stops. NEVER a `Backlog` fallback.
test('ADR-041 S5: an all-ineligible candidate set reports and stops — no fallback to the backlog board', () => {
  // ⭐ `banner: null` makes this a LIVE GUARD for ADR-047 §7 carve-out 1 as well: a `Backlog`-identity
  // board with no line-3 banner must emit NO `sprint-status-missing`, or `ai-agents/sprints/backlog.md`
  // reports a false drift on every run, forever.
  const { sprintsDir } = sprintsFixture({ plans: { 'backlog.md': prosePlan('# Backlog — the unsprinted board', null) } });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 3, 'exit 3 — no answer, and the caller must be able to tell');
  assert.equal(activeLine(out), 'active none');
  assert.ok(candidates(out).includes('candidate file="backlog.md" identity="Backlog" status="unresolved"'));
  assert.ok(!out.includes('active file='), 'a `Backlog` board must never be selected as active');
  assert.ok(!out.includes('board file='), 'no active sprint means no `board` line at all');
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0,
    'carve-out 1: a banner-less Backlog board is well-formed, not drift');
});

// S6 — §1.5's tie-break, all three halves. The ruling is worthless if the flag can be dropped.
test('ADR-041 S6: same identity → byte-order pick, AND both claimants named, AND the roll-up says so', () => {
  const { sprintsDir, planPath } = sprintsFixture({
    plans: {
      'sprint-6.md': prosePlan(),
      'plan-sprint-6.md': plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |'],
        { title: '# Sprint 6 — Test' }),
    },
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 6', status: '🔲 Backlog' }) },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  // 1 — the pick: `p` < `s` in byte order. ⭐ ONE `active` line, not two: §2.3a is one line per SPRINT,
  // and the losing claimant appears only as a `candidate` and in the drift record's `also=`.
  assert.equal(activeLine(out), 'active file="plan-sprint-6.md" identity="Sprint 6" status="In progress"');
  // 2 — the flag names EVERY claimant, not just that there was a collision.
  assert.ok(facts(out).includes('drift ambiguous-active-sprint identity="Sprint 6" chosen="plan-sprint-6.md" also="sprint-6.md"'),
    'the chosen file AND the other claimant must both be named');
  // 3 — and in board mode the collision reaches the ROLL-UP, by the same route unresolved-plan-sprint takes.
  const b = run(planPath('plan-sprint-6.md'));
  assert.equal(b.code, 0);
  assert.ok(facts(b.out).includes('drift ambiguous-plan-identity identity="Sprint 6" plan="plan-sprint-6.md" also="sprint-6.md"'));
  assert.ok(rollup(b.out).includes('on the plan itself'),
    'a drift kind that does not reach the roll-up clause is invisible to beat 6');
});

// S7 — §1.5's locale independence. The script sets and exports LC_ALL=C; this pins that it actually
// governs glob order for a caller running under a collating locale.
//
// ⚠️ IF THIS EVER FAILS, the fix is an explicit byte-order sort of the basenames — NOT relaxing the
// assertion. Board selection must not depend on the reader's locale.
test('ADR-041 S7: the selection is byte-identical under a non-C locale', () => {
  // ⚠️ THE FIXTURE NAMES ARE THE THING UNDER TEST — do not "tidy" them to `sprint-6`/`plan-sprint-6`.
  // That pair orders `p` < `s` in BOTH byte order and locale collation, so it can never discriminate;
  // review R1 measured the whole suite staying green (141/141) with the `LC_ALL=C` pin deleted.
  //
  // `Qlan-` vs `plan-` DOES discriminate: byte order puts `Q` (0x51) before `p` (0x70), while
  // en_US.UTF-8 collation sorts alphabetically and case-insensitively, putting `plan` before `Qlan`.
  // Measured on this machine, bash glob expansion honours the difference.
  //
  // ⚠️ AND IT CANNOT USE `Plan-`/`plan-` — the ADR's own illustration. macOS filesystems are
  // case-insensitive by default, so those two names COLLIDE and only one file survives.
  const mk = () => sprintsFixture({
    plans: { 'Qlan-sprint-6.md': prosePlan('# Sprint 6 — Q variant'), 'plan-sprint-6.md': prosePlan() },
  }).sprintsDir;
  const c = runMode(['select-active', mk()], { LC_ALL: 'C', LANG: 'C' });
  const u = runMode(['select-active', mk()], { LC_ALL: 'en_US.UTF-8', LANG: 'en_US.UTF-8' });
  assert.equal(u.code, c.code);
  assert.equal(u.out, c.out, 'same repo, two locales, one answer');
  assert.equal(activeLine(c.out), 'active file="Qlan-sprint-6.md" identity="Sprint 6" status="In progress"',
    'byte order, not collation: `Q` precedes `p`');
});

// R1 — THE PORTABLE HALF OF THE LOCALE GUARD, and the one that always reds.
//
// ⚠️ S7 above is a BEHAVIORAL test and is only as strong as the environment it runs in: where the
// `en_US.UTF-8` locale is not installed (minimal CI images), setting it falls back to C, both runs
// agree trivially, and S7 stops discriminating WITHOUT FAILING. This assertion has no such hole — it
// reads the script and reds the moment the pin is deleted, on every machine.
//
// ADR-041 §1.5: "Board selection must not depend on the reader's locale. `LC_ALL=C` is the only
// setting that makes the rule a fact." A source assertion is the honest way to pin a claim about the
// script's own configuration.
test('ADR-041 R1: dashboard.sh pins and exports `LC_ALL=C` — locale independence is structural', () => {
  const src = readFileSync(SCRIPT, 'utf8');
  assert.match(src, /^LC_ALL=C$/m, 'the LC_ALL=C pin is what makes byte-order selection a fact');
  assert.match(src, /^export LC_ALL$/m, 'and it must be EXPORTED, or the subshells and `sort` below drift');
});

// S8 — §2's stated RESIDUAL, accepted as a loud failure. An unscheduled board carrying neither token
// resolves EMPTY: not eligible (safe), but it loses the regained check and says so on every run.
test('ADR-041 S8: `sprint-backlog.md` with neither token resolves EMPTY, is ineligible, and stays loud', () => {
  // `banner: null` — and note this is ADR-047 §1.2's BOTH case: `unresolved` in the identity field AND
  // in the status field, told apart by POSITION and never inferred one from the other. Carve-out 1
  // covers the unresolved IDENTITY, so `sprint-status-missing` must stay silent here too.
  const { sprintsDir } = sprintsFixture({ plans: { 'sprint-backlog.md': prosePlan('# Unscheduled work', null) } });
  const id = runMode(['identity', join(sprintsDir, 'sprint-backlog.md')]);
  assert.equal(id.code, 3);
  assert.equal(id.out, '', 'unresolved prints NOTHING — it never guesses');

  const sel = runMode(['select-active', sprintsDir]);
  assert.equal(sel.code, 3);
  assert.equal(activeLine(sel.out), 'active none');
  assert.ok(candidates(sel.out).includes('candidate file="sprint-backlog.md" identity="unresolved" status="unresolved"'));
  assert.equal(facts(sel.out).filter((f) => f.startsWith('drift')).length, 0,
    'carve-out 1 covers the unresolved IDENTITY as well as the `Backlog` one');

  const b = run(fixture({
    planName: 'sprint-backlog.md',
    plan: plan(['| 🔲 Backlog | — | Alpha | [`a.md`](../tasks/backlog/a.md) |'], { title: '# Unscheduled work' }),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Backlog', status: '🔲 Backlog', priority: 'Unscheduled' }) },
  }));
  assert.ok(facts(b.out).some((f) => f.startsWith('drift unresolved-plan-sprint')), 'ADR-040 §7 guard');
  assert.ok(rollup(b.out).includes('on the plan itself'));
});

// §2-a — the `Backlog` token itself, and its NORMALIZATION. The value is `Backlog`, never
// `Sprint Backlog`: that exact string is what briefs carry and what the rule-1 arm compares against.
test('ADR-041 §2: both `Backlog` and `Sprint Backlog` resolve to the value `Backlog`', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'backlog.md': prosePlan('# Backlog — the default home for unsprinted task briefs'),
      'a.md': prosePlan('# X — Sprint Backlog'),
      // Normalize-BEFORE-dedupe: one identity named twice must resolve, not trip the two-token refusal.
      'b.md': prosePlan('# Backlog — Sprint Backlog'),
    },
  });
  for (const f of ['backlog.md', 'a.md', 'b.md']) {
    const r = runMode(['identity', join(sprintsDir, f)]);
    assert.equal(r.code, 0, f);
    assert.equal(r.out, 'Backlog\n', `${f} must resolve to Backlog — never "Sprint Backlog"`);
  }
});

// §2-b — ADR-040's two-distinct-tokens refusal EARNS ITS PLACE here (ADR-041 §2, required outcome).
test('ADR-041 §2: `# Sprint 5 — Backlog` refuses at the H1 rung and the filename rung decides', () => {
  const { sprintsDir } = sprintsFixture({ plans: { 'sprint-5.md': prosePlan('# Sprint 5 — Backlog') } });
  const r = runMode(['identity', join(sprintsDir, 'sprint-5.md')]);
  assert.equal(r.code, 0);
  assert.equal(r.out, 'Sprint 5\n', 'two distinct tokens → refuse, fall through, resolve by filename');
});

// compat — the one-argument form is untouched, and a subcommand is recognised ONLY in the two-argument
// form (so a plan file literally named `identity` still renders as a board).
test('ADR-041: the historic one-argument board render is unchanged; a bad subcommand is a usage error', () => {
  const p = fixture({
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha' }) },
  });
  const { code, out } = run(p);
  assert.equal(code, 0);
  assert.ok(out.startsWith('⟦fkit-dashboard v2⟧\n⟦BOARD⟧'));
  assert.equal(facts(out).filter((f) => f.startsWith('drift')).length, 0);
  // The new sibling read must stay silent when the plan's identity is unshared — otherwise every
  // exact-stdout fixture in this file would have moved.
  assert.equal(facts(out).filter((f) => f.includes('ambiguous-plan-identity')).length, 0);

  const bad = runMode(['bogus', p]);
  assert.equal(bad.code, 1);
  assert.match(bad.err, /usage: bash dashboard\.sh <plan> \| identity <plan> \| select-active <sprints-dir>/);
});

// R5 — AN UNREADABLE CANDIDATE MUST NEVER RESOLVE TO A WRONG IDENTITY.
//
// `head -1` fails on an unreadable file, awk exits 0 on the resulting empty input, and that is
// indistinguishable from "an H1 with no identity token" — so the FILENAME rung answers about a file
// whose contents were never read. Measured before the `[ -r ]` guard: this exact fixture printed
// `Sprint 1` with exit 0 while the real H1 said `Sprint 99`.
//
// ADR-040 §Context: a WRONG identity is STRICTLY WORSE than none, because unresolved is loud and
// wrong is silent. 0265 is where this had to be fixed rather than left to 0264's ladder: only 0265
// runs the ladder over files the caller never named (`select-active`, `sibling_claimants`), so one
// unreadable file could mis-select the active sprint for the whole board.
test('ADR-041 R5: an unreadable candidate resolves to `unresolved`, never to a wrong identity', () => {
  const { sprintsDir } = sprintsFixture({
    plans: { 'sprint-1.md': prosePlan('# X — Sprint 99'), 'sprint-3.md': prosePlan('# Sprint 3 — real') },
  });
  const victim = join(sprintsDir, 'sprint-1.md');
  chmodSync(victim, 0o000);
  try {
    const id = runMode(['identity', victim]);
    assert.notEqual(id.out.trim(), 'Sprint 1', 'the filename rung must not answer for a file it could not read');
    assert.equal(id.out, '', 'unresolved prints NOTHING');
    assert.equal(id.code, 3);

    const sel = runMode(['select-active', sprintsDir]);
    // ⚠️ REPINNED BY ADR-047, AND THIS SITE IS MISSING FROM §2.4's LIST OF EIGHT — it is the ninth
    // exact-equality `activeLine` assertion, and it breaks TWICE over: the added `status=` field, and
    // the fixture going ineligible without a banner. Measured while building `0338`.
    // ⭐ The unreadable file is `unresolved` in BOTH fields: `[ -r ]` fails ahead of the identity ladder
    // AND ahead of the line-3 read, so neither invents an answer about a file it could not open.
    assert.ok(candidates(sel.out).includes('candidate file="sprint-1.md" identity="unresolved" status="unresolved"'),
      'and it is listed as unresolved, so §1.6 still names it');
    assert.equal(activeLine(sel.out), 'active file="sprint-3.md" identity="Sprint 3" status="In progress"',
      'an unreadable file must not be able to win the selection');
  } finally {
    chmodSync(victim, 0o644);   // or the harness cleanup cannot remove it
  }
});

// --- 0271 items 4 / 5a / 5b — select-active's unpinned halves (0265 residuals A1 and A2) -----------
//
// ⚠️ ASSERTION IDIOM for all three, and it is NOT the S1–S8 idiom above (owner ruling 2026-09-10,
// verbatim "Field-tolerant"): match on the FIELDS under test with a prefix or a regex, NEVER on
// whole-line equality. 0338 extends this mode's output grammar deliberately — `candidate` lines gain a
// `status=` field, and a separate single-board line appears — and an exact-equality guard would red for
// that deliberate change. Accepted cost, named by the owner: a stray EXTRA field on a line these tests
// read would not be caught.
//
// ⚠️ CORRECTION, made when 0338 shipped: this note predicted the new line would be `chosen file=`.
// ADR-047 §2.3a named it `board`, and `chosen=` stayed what it always was — a FIELD on the two
// ambiguity drift records. The prediction is withdrawn; the idiom it justifies is unchanged, and the
// three tests below passed untouched.

// 0271/4 — the `[ -f ]` no-match guard on the candidate glob (0265 finding R4, residual A1).
// With no plan at depth 1, `"$1"/*.md` matches nothing and stays LITERAL; the guard at
// `dashboard.sh:242` is what stops `<dir>/*.md` becoming a record. Measured in 0265: removing it left
// the whole suite green at 141/141.
//
// ⚠️ DO NOT CONFLATE THE TWO HALVES OF THIS CONSTRUCT, and do not read this test as "globbing is
// untested". The dangerous half — the `set +f` / `set -f` glob-enable wrapper — IS already pinned:
// removing it reds 7 tests (re-measured in 0265). Only the `[ -f ]` no-match half is unpinned, and its
// blast radius when unguarded is COSMETIC NOISE (one phantom candidate line), not a mis-selection: the
// selection itself stays correct at `active none`, exit 3.
//
// ⚠️ The brief additionally claimed the unguarded case emits a `head:` stderr line. That half is STALE:
// 0265's R5 fix put `[ -r "$1" ] || return 0` ahead of the `head`, so resolve_identity returns before
// `head` ever runs. The phantom-candidate half stands, and it is what this test pins.
//
// (`sprintsFixture` pre-creates `sprints/done/`, so the directory is empty of `.md` AT DEPTH 1 rather
// than empty outright. That is the right seam — the glob is depth-1.)
test('ADR-041 0271/4: an empty sprints/ lists NO candidate — the glob no-match guard', () => {
  const { sprintsDir } = sprintsFixture({ plans: {} });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(
    candidates(out).length,
    0,
    `no plan at depth 1 means no candidate. Candidates: ${JSON.stringify(candidates(out))}`,
  );
  assert.ok(
    !candidates(out).some((l) => l.includes('*.md')),
    `the UNEXPANDED glob must never be reported as a candidate. Candidates: ${JSON.stringify(candidates(out))}`,
  );
  assert.match(activeLine(out), /^active none\b/);
  assert.equal(code, 3);
});

// 0271/5a — a plan under `sprints/done/` is never a candidate (ADR-041 §1.1; 0265 finding R7,
// residual A2, half a).
//
// ⚠️ WHAT ACTUALLY IMPLEMENTS THE EXCLUSION — and the brief's account of it is wrong, so this comment
// is the correction. There is NO exclusion code to neutralize: the exclusion is EMERGENT from the
// DEPTH-1 glob at `dashboard.sh:241` (`"$1"/*.md`), whose own inline comment says exactly that, and
// 0338's brief says the same of `cancelled/` ("likewise never seen by construction"). Owner ruling
// 2026-09-10, verbatim "Widen the glob to depth 2": the red-proof for this test widens that glob to
// `"$1"/*/*.md`, which is faithful to the real mechanism. The BEHAVIOR pinned here is real and
// probe-confirmed; only the brief's description of the mechanism was wrong.
//
// ⚠️ THIS IS AN ABSENCE-ASSERTION, SO IT CARRIES ITS OWN POSITIVE CONTROL AND ITS OWN FIXTURE CHECK.
// Round-1 review R1 measured the defect: with `plans: {}` this mode's stdout is BYTE-IDENTICAL whether
// or not `done/sprint-9.md` exists, so deleting the `writeFileSync` below left all three assertions
// green and the test collapsed into a duplicate of `0271/4`. Re-measured here before the fix: 148/148
// green with the write deleted. Two additions answer that, and neither is decoration:
//
//   (a) THE DEPTH-1 CONTROL (`control-depth-1.md`) — asserted PRESENT in the candidate list. It proves
//       the glob, the fixture directory and the candidate printer are all LIVE, so the absence of
//       `sprint-9.md` means "excluded", not "nothing ran". Owner ruling 2026-09-10, verbatim "Add a
//       depth-1 sibling".
//   (b) THE FIXTURE PRECONDITION (`existsSync`) — the ONLY thing that can red on the write being
//       deleted, precisely BECAUSE the exclusion is invisible to stdout. No assertion on `out` can do
//       it; that is the behaviour, not a gap in the assertions.
//
// ⚠️ THE CONTROL IS DELIBERATELY INELIGIBLE, AND IT GOES ON THE CANDIDATE LINE, NEVER THE ACTIVE ONE.
// `mode_select_active` prints candidates for EVERY record, eligible or not, so an ineligible control is
// still a positive control. A control named `sprint-9.md` at depth 1 would instead resolve via the
// filename rung, become ELIGIBLE, and turn `active none` into `active file="sprint-9.md"` — pinning the
// wrong thing.
//
// ⚠️ CORRECTION, made when 0338 shipped: this note's second half said `prosePlan` carries no status, so
// the control would stay ineligible under 0338 for a DIFFERENT reason. `prosePlan` now carries the
// suite's default `🔄 In progress` banner (see DEFAULT_BANNER), so that reason is GONE. The test still
// holds, on the FIRST reason alone: `control-depth-1` matches neither identity rung, so it is
// ineligible by IDENTITY and `active none` survives. The status half of the claim is withdrawn.
//
// Per residual U1 the control matches the `file="…"` FIELD by prefix — never whole-line equality — so
// 0338's added `status=` field cannot red it.
test('ADR-041 0271/5a: a plan under sprints/done/ is never a candidate', () => {
  const { sprintsDir } = sprintsFixture({ plans: {} });
  writeFileSync(join(sprintsDir, 'control-depth-1.md'), prosePlan());
  writeFileSync(join(sprintsDir, 'done', 'sprint-9.md'), prosePlan('# Sprint 9 — a closed sprint'));
  assert.ok(
    existsSync(join(sprintsDir, 'done', 'sprint-9.md')),
    'the excluded plan must actually exist, or this test asserts the absence of a file nobody wrote',
  );
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.ok(
    candidates(out).some((l) => /^candidate file="control-depth-1\.md"/.test(l)),
    `POSITIVE CONTROL: a depth-1 plan MUST be listed, or the absence below proves nothing. Candidates: ${JSON.stringify(candidates(out))}`,
  );
  assert.ok(
    !candidates(out).some((l) => /^candidate file="sprint-9\.md"/.test(l)),
    `a closed sprint plan must never reach candidacy. Candidates: ${JSON.stringify(candidates(out))}`,
  );
  assert.match(activeLine(out), /^active none\b/);
  assert.equal(code, 3);
});

// 0271/5b — a plan file literally named `identity.md` still renders as a board (0265 finding R7,
// residual A2, half b). A subcommand is recognised ONLY in the TWO-argument form (`dashboard.sh:304`),
// which is what stops the CLI's `identity` MODE WORD and a plan FILE of that name from colliding.
// Verified correct by probe in 0265; nothing pinned it, because no test used the filename.
test('ADR-041 0271/5b: a plan file named identity.md still renders as a board, not a mode word', () => {
  const p = fixture({
    planName: 'identity.md',
    plan: plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |']),
    briefs: { 'backlog/a.md': brief({ title: 'Alpha' }) },
  });
  const { code, out } = run(p);
  assert.equal(code, 0, 'one argument is a board render, never a usage error');
  assert.ok(out.startsWith('⟦fkit-dashboard v2⟧'), 'a board envelope, not a bare identity value');
  assert.ok(out.includes('⟦BOARD⟧') && out.includes('⟦FACTS⟧'), 'the full board is rendered');
});

// ===================================================================================================
// ADR-047 — a sprint has an explicit status, and "current" means EVERY `In progress` sprint (task 0338).
// P1–P17 are the ADR's own "Required tests — the decision is not satisfied without these".
//
// ⚠️ READ THE TWO `unresolved`s BY POSITION (ADR-047 §1.2). `identity="unresolved"` means the identity
// ladder returned nothing; `status="unresolved"` means line 3 carried no banner, or a malformed one.
// They are independent, and a board can be one, the other, both, or neither.

// Line-3 banners, written once so a typo cannot make a fixture quietly mean something else.
const BANNER = {
  backlog: '> ## 🔲 Backlog — 2026-01-01.',
  inprogress: '> ## 🔄 In progress — 2026-01-01.',
  done: '> ## ✅ Done — 2026-01-01. Closed by /fkit-sprint-done.',
  cancelled: '> ## ⛔ Cancelled — 2026-01-01. Closed by /fkit-sprint-cancelled — no longer needed.',
  closed: '> ## 🔒 CLOSED — 2026-08-13. Superseded by [Sprint 8](../sprint-8.md).',
};
// A RENDERABLE board (it has a `## Status` table) with an explicit banner — needed wherever a test
// exercises the render path as well as `select-active`.
const boardPlan = (title, banner) =>
  plan(['| 🔲 Backlog | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |'], { title, banner });
const ALPHA = { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Backlog', status: '🔲 Backlog' }) };

// P1 — §6.3 row 1: plural-current is LEGAL. Two different identities both `In progress` is not drift.
test('ADR-047 P1: two `In progress` sprints are both active, ascending, with ONE board line and NO drift', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'sprint-8.md': prosePlan('# Eight', BANNER.inprogress),
      'sprint-9.md': prosePlan('# Nine', BANNER.inprogress),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  assert.deepEqual(activeLines(out), [
    'active file="sprint-8.md" identity="Sprint 8" status="In progress"',
    'active file="sprint-9.md" identity="Sprint 9" status="In progress"',
  ]);
  // ⭐ NO TRAILING SPACE in the prefix — same reason as `boardLine` above (review R10, owner ruling
  // AE1): a bare `board`, or a `board\tfile="…"` if the format string itself broke, must not slip past
  // THIS cardinality count either. It cannot over-match — see the reason recorded at `boardLine`.
  assert.equal(selectLines(out).filter((l) => l.startsWith('board')).length, 1, 'EXACTLY one board line');
  assert.equal(boardLine(out),
    'board file="sprint-8.md" identity="Sprint 8" status="In progress" reason="lowest-ordered"');
  assert.equal(facts(out).length, 0, 'plural-current is legal — zero drift facts');
});

// P2 — OQ-3 + owner ruling V3: `🔒 CLOSED` is a PERMANENT compat rung, read forever and written never.
test('ADR-047 P2: a legacy `🔒 CLOSED` board reads as `Done`, and is never active and never the board', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'sprint-6.md': prosePlan('# Six', BANNER.closed),
      'sprint-8.md': prosePlan('# Eight', BANNER.inprogress),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  assert.equal(activeLine(out), 'active file="sprint-8.md" identity="Sprint 8" status="In progress"');
  assert.equal(boardLine(out),
    'board file="sprint-8.md" identity="Sprint 8" status="In progress" reason="lowest-ordered"');
  assert.ok(candidates(out).includes('candidate file="sprint-6.md" identity="Sprint 6" status="Done"'),
    'the legacy banner resolves to the `Done` TOKEN — it is a grammar member, not a special case');
});

// P3 — §2 + §7 + §7.2. ⛔ NOT OPTIONAL: the fixture helpers now default to a banner, so this is the ONE
// test standing between a silent regression and a render path that stops reporting a missing status.
// ⛔ REACH IS ASSERTED TWICE, by each mode's own route.
test('ADR-047 P3: an eligible board with NO banner is never active, and `sprint-status-missing` reaches beat 6 by BOTH routes', () => {
  const { sprintsDir, planPath } = sprintsFixture({
    plans: { 'sprint-2.md': boardPlan('# Sprint 2 — Test', null) },
    briefs: ALPHA,
  });
  const sel = runMode(['select-active', sprintsDir]);
  assert.equal(sel.code, 3, 'no banner → never eligible → no active sprint at all');
  assert.equal(activeLine(sel.out), 'active none');
  assert.ok(candidates(sel.out).includes('candidate file="sprint-2.md" identity="Sprint 2" status="unresolved"'));
  // Route 1 — `select-active`: the record appears in ⟦FACTS⟧, and the mode has NO roll-up (§7.2).
  assert.ok(facts(sel.out).includes('drift sprint-status-missing plan="sprint-2.md"'));
  assert.ok(!sel.out.includes('—  of '), 'select-active has no roll-up and must not grow one');

  // Route 2 — the render path: ⟦FACTS⟧ *and* the roll-up's drift clause.
  const b = run(planPath('sprint-2.md'));
  assert.equal(b.code, 0);
  assert.ok(facts(b.out).includes('drift sprint-status-missing plan="sprint-2.md"'));
  assert.ok(rollup(b.out).includes('on the plan itself'),
    'a drift kind that does not reach the roll-up clause is invisible to beat 6');
});

// P4 — §7 carve-out 1, the false-drift trap. `ai-agents/sprints/backlog.md` has plain prose at line 3
// and will NEVER carry a banner; without the carve-out it reports drift on every run, forever.
// ⚠️ The carve-out is read in IDENTITY-space (§1.2). Read in status-space it would swallow the drift
// entirely, since every banner-less board has `unresolved` STATUS — P3 above is the backstop for that.
test('ADR-047 P4: a lone `backlog.md` emits ZERO drift — carve-out 1, in identity-space', () => {
  const { sprintsDir } = sprintsFixture({
    plans: { 'backlog.md': prosePlan('# Backlog — the default home for unsprinted task briefs', null) },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 3);
  assert.equal(activeLine(out), 'active none');
  assert.ok(candidates(out).includes('candidate file="backlog.md" identity="Backlog" status="unresolved"'));
  assert.equal(facts(out).length, 0, 'ZERO facts — not "no missing-status drift", none at all');
});

// P5 — §6: the board is the LOWEST-ordered eligible sprint. ⚠️ With the integer comparator unchanged
// this also proves `10` did not sort below `9` — a byte comparison would make `sprint-10.md` the board.
test('ADR-047 P5: the `board` is the LOWEST-ordered `In progress` sprint, and 10 does not sort below 9', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'sprint-4.md': prosePlan('# Four', BANNER.inprogress),
      'sprint-9.md': prosePlan('# Nine', BANNER.inprogress),
      'sprint-10.md': prosePlan('# Ten', BANNER.inprogress),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  assert.equal(boardLine(out),
    'board file="sprint-4.md" identity="Sprint 4" status="In progress" reason="lowest-ordered"');
  assert.deepEqual(activeLines(out).map((l) => l.match(/identity="([^"]+)"/)[1]),
    ['Sprint 4', 'Sprint 9', 'Sprint 10'], 'ascending by identity, integer not text');
});

// P6 — §2.1 + OQ-1's override half. The marker moves the BOARD; it does not change the ACTIVE set.
test('ADR-047 P6: `⭐ ACTIVE BOARD` overrides the lowest-ordered default, and every active line still prints', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'sprint-4.md': prosePlan('# Four', BANNER.inprogress),
      'sprint-9.md': prosePlan('# Nine', `${BANNER.inprogress} ⭐ ACTIVE BOARD`),
      'sprint-10.md': prosePlan('# Ten', BANNER.inprogress),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  assert.equal(boardLine(out),
    'board file="sprint-9.md" identity="Sprint 9" status="In progress" reason="active-marker"');
  assert.equal(activeLines(out).length, 3, 'the override changes the BOARD, never the active set');
  assert.equal(facts(out).length, 0, 'one marker on one `In progress` board is the designed case, not drift');
});

// P7 — §7's `ambiguous-active-marker`. ⚠️ ASSERT ALL THREE: the fallback is worthless if the flag can be
// dropped, and the flag is worthless if it never reaches beat 6.
// ⛔ NO ROLL-UP ASSERTION HERE. This is §7.2's ONE `⟦FACTS⟧`-only fact — it has no render-path route at
// all, because it needs LINE 3 of every sibling board and the render path reads sibling FIRST LINES only.
test('ADR-047 P7: two `⭐ ACTIVE BOARD` claimants → drift naming every claimant, AND a lowest-ordered fallback', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'sprint-4.md': prosePlan('# Four', BANNER.inprogress),
      'sprint-9.md': prosePlan('# Nine', `${BANNER.inprogress} ⭐ ACTIVE BOARD`),
      'sprint-10.md': prosePlan('# Ten', `${BANNER.inprogress} ⭐ ACTIVE BOARD`),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  // 1 — the fallback: an ambiguous marker does NOT win; the lowest-ordered default stands.
  assert.equal(boardLine(out),
    'board file="sprint-4.md" identity="Sprint 4" status="In progress" reason="lowest-ordered"');
  // 2 + 3 — the flag names every claimant, and it reaches beat 6 through ⟦FACTS⟧.
  assert.ok(facts(out).includes('drift ambiguous-active-marker chosen="sprint-4.md" also="sprint-9.md, sprint-10.md"'),
    `every claimant must be named, not merely that there was ambiguity. Facts: ${JSON.stringify(facts(out))}`);
  assert.ok(!out.includes('—  of '), 'and it must NOT invent a roll-up to reach beat 6 through');
});

// P8 — §2.3's empty case and §5. Every candidate is still listed, WITH its status.
test('ADR-047 P8: no `In progress` board anywhere → `active none`, exit 3, every candidate with its status', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'backlog.md': prosePlan('# Backlog — unsprinted', null),
      'sprint-3.md': prosePlan('# Three', BANNER.backlog),
      'sprint-4.md': prosePlan('# Four', BANNER.done),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 3);
  assert.equal(activeLine(out), 'active none');
  assert.ok(!out.includes('board file='), '`active none` is a sentinel — no board line may follow it');
  assert.deepEqual(candidates(out), [
    'candidate file="backlog.md" identity="Backlog" status="unresolved"',
    'candidate file="sprint-3.md" identity="Sprint 3" status="Backlog"',
    'candidate file="sprint-4.md" identity="Sprint 4" status="Done"',
  ]);
  assert.equal(facts(out).length, 0, 'a scoped-but-unstarted board and a finished one are both well-formed');
});

// P9 — §2's recognizer and §2.3a's new `status <plan>` mode, one board per banner form.
// ⚠️ It mirrors `identity`'s value-not-rendering contract: ONE token, NO `⟦…⟧` markers, so a caller
// reads it with a single command substitution.
test('ADR-047 P9: `status <plan>` prints one token per banner form; `🔒 CLOSED` → `Done`; no banner → exit 3', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'sprint-1.md': prosePlan('# One', BANNER.backlog),
      'sprint-2.md': prosePlan('# Two', BANNER.inprogress),
      'sprint-3.md': prosePlan('# Three', BANNER.done),
      'sprint-4.md': prosePlan('# Four', BANNER.cancelled),
      'sprint-5.md': prosePlan('# Five', BANNER.closed),
      'sprint-6.md': prosePlan('# Six', null),
    },
  });
  const expected = {
    'sprint-1.md': 'Backlog',
    'sprint-2.md': 'In progress',
    'sprint-3.md': 'Done',
    'sprint-4.md': 'Cancelled',
    'sprint-5.md': 'Done',
  };
  for (const [f, want] of Object.entries(expected)) {
    const r = runMode(['status', join(sprintsDir, f)]);
    assert.equal(r.code, 0, f);
    assert.equal(r.out, `${want}\n`, f);
    assert.ok(!r.out.includes('⟦'), 'a VALUE, not a rendering — no envelope markers');
  }
  const none = runMode(['status', join(sprintsDir, 'sprint-6.md')]);
  assert.equal(none.code, 3, 'unresolved is exit 3');
  assert.equal(none.out, '', 'and it prints NOTHING — it never guesses');
  assert.equal(runMode(['status', join(sprintsDir, 'nope.md')]).code, 1, 'no such file is a usage error');
});

// P10 — §2's STRICT-POSITION rule, and the tolerance it buys. A `> ## ` banner deeper in a board is not
// a status, does not make the board ambiguous, and emits NO drift. That is the whole reason strict
// position was chosen over "the first line of the leading blockquote".
test('ADR-047 P10: only LINE 3 is read — a second banner further down the file is not a status', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'sprint-3.md': `# Three\n\n${BANNER.backlog}\n>\n\nBody prose.\n\n${BANNER.inprogress}\n\nMore prose.\n`,
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 3, 'line 3 says `Backlog`, so nothing is active — the deeper line is not read');
  assert.equal(activeLine(out), 'active none');
  assert.ok(candidates(out).includes('candidate file="sprint-3.md" identity="Sprint 3" status="Backlog"'));
  assert.equal(facts(out).length, 0, 'a second `> ## ` line is tolerated, not drift');
  assert.equal(runMode(['status', join(sprintsDir, 'sprint-3.md')]).out, 'Backlog\n');
});

// P11 — §7 carve-out 2's assignment. `sprint-terminal-not-archived` is the RENDER PATH's, never
// `select-active`'s, and it reaches the roll-up because on this path a roll-up exists.
test('ADR-047 P11: a `Done` board still at the top of sprints/ is `sprint-terminal-not-archived` — render path only', () => {
  const { sprintsDir, planPath } = sprintsFixture({
    plans: { 'sprint-8.md': boardPlan('# Sprint 8 — Test', BANNER.done) },
    briefs: ALPHA,
  });
  const b = run(planPath('sprint-8.md'));
  assert.equal(b.code, 0);
  assert.ok(facts(b.out).includes('drift sprint-terminal-not-archived plan="sprint-8.md" status="Done"'));
  assert.ok(rollup(b.out).includes('on the plan itself'), 'render-path drift must reach the roll-up clause');

  const sel = runMode(['select-active', sprintsDir]);
  assert.equal(facts(sel.out).filter((f) => f.includes('terminal-not-archived')).length, 0,
    'a depth-1 mode must not emit a fact about archiving — carve-out 2');
});

// P12 — §6.4's FILTER-FIRST rule and §8.2's rule-survives / set-changes split. Same identity, MIXED
// status. ⛔ The `Done` board must never win selection, whatever the byte order says — tie-break-first
// would reintroduce the Sprint 5 failure (a finished board reported as active) through the side door.
test('ADR-047 P12: mixed-status same-identity → filter first, so the `In progress` board wins even against byte order', () => {
  const { sprintsDir, planPath } = sprintsFixture({
    plans: {
      'plan-sprint-6.md': boardPlan('# Sprint 6 — done twin', BANNER.done),
      'sprint-6.md': boardPlan('# Sprint 6 — live twin', BANNER.inprogress),
    },
    briefs: ALPHA,
  });
  const sel = runMode(['select-active', sprintsDir]);
  assert.equal(sel.code, 0);
  // `plan-` sorts BEFORE `sprint-` in byte order, so a tie-break-first implementation picks the Done board.
  assert.equal(activeLine(sel.out), 'active file="sprint-6.md" identity="Sprint 6" status="In progress"');
  assert.equal(boardLine(sel.out),
    'board file="sprint-6.md" identity="Sprint 6" status="In progress" reason="lowest-ordered"');
  // The DRIFT is genuinely untouched: status decides which board is chosen, not whether the collision
  // is reported. ⛔ And it lands in ⟦FACTS⟧, not a roll-up.
  assert.ok(facts(sel.out).includes('drift ambiguous-active-sprint identity="Sprint 6" chosen="sprint-6.md" also="plan-sprint-6.md"'),
    `Facts: ${JSON.stringify(facts(sel.out))}`);
  assert.ok(!sel.out.includes('—  of '));

  // The render path's SEPARATELY-NAMED counterpart — ⛔ not merged with the record above; `plan=` and
  // `chosen=` state different facts, and §7's table foot rests on that.
  const b = run(planPath('sprint-6.md'));
  assert.ok(facts(b.out).includes('drift ambiguous-plan-identity identity="Sprint 6" plan="sprint-6.md" also="plan-sprint-6.md"'));
  assert.ok(rollup(b.out).includes('on the plan itself'));

  // ...and the Done twin, sitting at depth 1, additionally trips the archival drift.
  const d = run(planPath('plan-sprint-6.md'));
  assert.ok(facts(d.out).includes('drift sprint-terminal-not-archived plan="plan-sprint-6.md" status="Done"'));
});

// P13 — §7's emitter column and carve-out 2's CORRECTED three-drift list.
// ⚠️ "or to an explicit sweep" was struck from the ADR: no sweep mode exists and none is created here.
test('ADR-047 P13: `sprint-archived-not-terminal` and `sprint-status-location-mismatch` are render-path facts', () => {
  const stale = fixture({
    planDir: 'sprints/done',
    planName: 'sprint-5.md',
    plan: boardPlan('# Sprint 5 — archived but open', BANNER.inprogress),
    briefs: ALPHA,
  });
  const a = run(stale);
  assert.equal(a.code, 0);
  assert.ok(facts(a.out).includes('drift sprint-archived-not-terminal plan="sprint-5.md" location="done/"'),
    `Facts: ${JSON.stringify(facts(a.out))}`);
  assert.ok(rollup(a.out).includes('on the plan itself'));

  const mismatch = fixture({
    planDir: 'sprints/done',
    planName: 'sprint-6.md',
    plan: boardPlan('# Sprint 6 — cancelled, filed under done', BANNER.cancelled),
    briefs: ALPHA,
  });
  const m = run(mismatch);
  assert.equal(m.code, 0);
  assert.ok(facts(m.out).includes('drift sprint-status-location-mismatch plan="sprint-6.md" status="Cancelled" location="done/"'),
    `Facts: ${JSON.stringify(facts(m.out))}`);
  assert.ok(rollup(m.out).includes('on the plan itself'));
  assert.equal(facts(m.out).filter((f) => f.includes('archived-not-terminal')).length, 0,
    'a Cancelled board IS terminal — the mismatch is the finding, not "not terminal"');

  // ⛔ And neither is `select-active`'s to emit: it is depth-1 and structurally cannot see inside done/.
  const { sprintsDir } = sprintsFixture({ plans: { 'sprint-8.md': prosePlan('# Eight', BANNER.inprogress) } });
  writeFileSync(join(sprintsDir, 'done', 'sprint-5.md'), prosePlan('# Five', BANNER.inprogress));
  assert.ok(existsSync(join(sprintsDir, 'done', 'sprint-5.md')),
    'the archived board must actually exist, or this asserts the absence of a file nobody wrote');
  const sel = runMode(['select-active', sprintsDir]);
  assert.equal(facts(sel.out).length, 0, 'no archival fact, and no phantom candidate from depth 2');
});

// P14 — ⛔ A SILENT-REGRESSION GUARD FOR §6.1's MECHANICAL CHANGE. ⚠️ IT IS NOT THE ONLY ONE, AND AN
// EARLIER VERSION OF THIS COMMENT CLAIMED IT WAS — withdrawn (review R8). ⭐ MEASURED: applying the trap
// below to a scratch copy reds FOUR tests — `ADR-041 S6`, `ADR-041 S7`, this test, and `ADR-047 P18`.
// ⛔ So none of the four is redundant with this one, and none may be deleted as such.
//
// The selection site is a FUNCTION CALL, not an operator, so "invert the comparison" admits two
// readings and one of them silently breaks ADR-041 §1.5:
//   ⛔ `! identity_gt "$_i" "$_best_id"`  → `<=` — a tie REPLACES the incumbent → first-wins becomes
//                                          LAST-wins → this fixture yields `sprint-6.md`.
//   ⭐ `identity_gt "$_best_id" "$_i"`    → strictly less, ties keep the first → `plan-sprint-6.md`.
//
// ⛔ THE DIRECTION FIXTURE (P5) CANNOT DISCRIMINATE — measured: trap and swap BOTH pick `Sprint 4`
// there, because a tie never arises. A tie only arises when two files claim ONE identity, which is
// exactly this fixture. And the failure is SILENT, because `also=` still names every claimant either way.
test('ADR-047 P14: one identity, two files, both `In progress` → the FIRST in byte order wins the tie', () => {
  const { sprintsDir } = sprintsFixture({
    plans: {
      'plan-sprint-6.md': prosePlan('# Six — plan', BANNER.inprogress),
      'sprint-6.md': prosePlan('# Six — sprint', BANNER.inprogress),
    },
  });
  const { code, out } = runMode(['select-active', sprintsDir]);
  assert.equal(code, 0);
  assert.equal(activeLine(out), 'active file="plan-sprint-6.md" identity="Sprint 6" status="In progress"',
    'ADR-041 §1.5: `p` precedes `s` under LC_ALL=C, and a tie keeps the FIRST candidate');
  assert.equal(boardLine(out),
    'board file="plan-sprint-6.md" identity="Sprint 6" status="In progress" reason="lowest-ordered"');
  assert.equal(activeLines(out).length, 1, 'one identity is ONE active line, however many files claim it');
  assert.ok(facts(out).includes('drift ambiguous-active-sprint identity="Sprint 6" chosen="plan-sprint-6.md" also="sprint-6.md"'));
});

// P15 — §7's `active-marker-on-non-active`, which previously had no test at all.
// ⛔ Reach asserted per §7.2, BOTH routes.
test('ADR-047 P15: `⭐ ACTIVE BOARD` on a non-`In progress` banner is drift, by both routes, and wins nothing', () => {
  const { sprintsDir, planPath } = sprintsFixture({
    plans: {
      'sprint-3.md': boardPlan('# Sprint 3 — scoped', `${BANNER.backlog} ⭐ ACTIVE BOARD`),
      'sprint-4.md': boardPlan('# Sprint 4 — finished', `${BANNER.done} ⭐ ACTIVE BOARD`),
    },
    briefs: ALPHA,
  });
  const sel = runMode(['select-active', sprintsDir]);
  assert.equal(sel.code, 3, 'a marker cannot promote a board that is not `In progress`');
  assert.equal(activeLine(sel.out), 'active none');
  assert.ok(!sel.out.includes('board file='));
  // Route 1 — ⟦FACTS⟧, no roll-up.
  assert.ok(facts(sel.out).includes('drift active-marker-on-non-active plan="sprint-3.md" status="Backlog"'));
  assert.ok(facts(sel.out).includes('drift active-marker-on-non-active plan="sprint-4.md" status="Done"'));
  assert.ok(!sel.out.includes('—  of '));
  // Route 2 — the render path: ⟦FACTS⟧ *and* the roll-up's drift clause, for either board.
  for (const [f, st] of [['sprint-3.md', 'Backlog'], ['sprint-4.md', 'Done']]) {
    const b = run(planPath(f));
    assert.ok(facts(b.out).includes(`drift active-marker-on-non-active plan="${f}" status="${st}"`),
      `Facts for ${f}: ${JSON.stringify(facts(b.out))}`);
    assert.ok(rollup(b.out).includes('on the plan itself'));
  }
});

// P16 — §2's TIGHTENED recognizer. ⚠️ The date is part of the recognizer, not just of the grammar above
// it: §1 has the producer writing `🔲 Backlog` and `🔄 In progress` BY HAND, the exact path that drops a
// date, so a loose recognizer silently accepts a banner the grammar forbids.
// ⛔ `missing` and `malformed` must stay DISTINGUISHABLE — "the producer typed it wrong" must never
// read as "nobody typed it".
test('ADR-047 P16: a malformed banner is `unresolved` + `sprint-status-malformed` — never `missing`, and never carved out', () => {
  const bad = {
    'sprint-1.md': '> ## 🔄 In progress',
    'sprint-2.md': '> ## 🔄 In progress arbitrary trailing garbage',
    'sprint-3.md': '> ## ✅ Done — not-a-date.',
    'sprint-4.md': '> ## ✅ Done — 2026-09-10',
  };
  const plans = {};
  for (const [f, line3] of Object.entries(bad)) plans[f] = boardPlan(`# ${f}`, line3);
  // ⛔ AND a `Backlog`-IDENTITY board with a malformed banner DOES emit it — the carve-out is
  // `sprint-status-missing`-only (§2, §7.1). A malformed banner is not a well-formed board.
  plans['backlog.md'] = prosePlan('# Backlog — unsprinted', '> ## 🔲 Backlog — nope.');
  const { sprintsDir, planPath } = sprintsFixture({ plans, briefs: ALPHA });

  const sel = runMode(['select-active', sprintsDir]);
  assert.equal(sel.code, 3, 'a malformed banner is never eligible');
  assert.equal(activeLine(sel.out), 'active none');
  assert.equal(facts(sel.out).filter((f) => f.includes('sprint-status-missing')).length, 0,
    '⛔ the two must be distinguishable — a typo is not an absence');
  for (const [f, line3] of Object.entries(bad)) {
    assert.ok(candidates(sel.out).some((l) => l.startsWith(`candidate file="${f}"`) && l.endsWith('status="unresolved"')), f);
    assert.ok(facts(sel.out).includes(`drift sprint-status-malformed plan="${f}" line3="${line3}"`),
      `Facts: ${JSON.stringify(facts(sel.out))}`);
    assert.equal(runMode(['status', join(sprintsDir, f)]).code, 3, `${f} must not resolve to a status`);
  }
  assert.ok(facts(sel.out).includes('drift sprint-status-malformed plan="backlog.md" line3="> ## 🔲 Backlog — nope."'),
    'the carve-out covers `sprint-status-missing` and NOTHING ELSE');

  // Reach, route 2 — the render path emits it AND sets the roll-up's drift clause.
  const b = run(planPath('sprint-1.md'));
  assert.ok(facts(b.out).includes('drift sprint-status-malformed plan="sprint-1.md" line3="> ## 🔄 In progress"'));
  assert.ok(rollup(b.out).includes('on the plan itself'));

  // ...and the LIVE archived boards — owner ruling V3's permanent compat rung, checked against the real
  // files rather than a fixture imitating them. ⚠️ `>= 7` not `=== 7`: boards keep being archived, and
  // the property under test is "every one of them", not "there are exactly seven".
  //
  // ⚠️ THE GUARD IS STRUCTURAL, NOT A CONVENIENCE, AND IT IS DELIBERATELY NARROW. `test/prove-red.sh`
  // runs this whole suite from a COPIED repo root whose `make_repo_copy` copies `claude/`, `test/` and
  // `package.json` and NOTHING ELSE — there is no `ai-agents/` there by design. Reading the live
  // archive unguarded throws in that copy, which reds the UNMUTATED copy at gate 0i and disarms
  // mutations 14 and 32: they would go red for the wrong reason while still reporting success.
  // ⛔ So the skip is keyed on `ai-agents/` being absent ENTIRELY — the prove-red copy's exact shape.
  // If `ai-agents/` exists but the archive under it does not, that is a REAL failure and it still reds.
  const agentsDir = join(REPO, 'ai-agents');
  if (existsSync(agentsDir)) {
    const doneDir = join(agentsDir, 'sprints', 'done');
    assert.ok(existsSync(doneDir), 'ai-agents/ exists but sprints/done/ does not — that is a real defect, not a copy');
    const archived = readdirSync(doneDir).filter((f) => /^sprint-\d+[a-z]?\.md$/.test(f));
    assert.ok(archived.length >= 7, `expected the seven archived boards or more, saw ${archived.length}`);
    for (const f of archived) {
      const r = runMode(['status', join(doneDir, f)]);
      assert.equal(r.code, 0, `${f} must parse`);
      assert.equal(r.out, 'Done\n', `${f}: a legacy 🔒 CLOSED banner reads as Done, forever`);
    }
  }
});

// P17 — ⛔ §2.3's two `⟦SELECT⟧` blocks, BYTE FOR BYTE, envelope included. Exact stdout equality, not a
// substring match: field order, the single-space separators, `status=` AND `reason=` on the `board`
// line, and `active none` carrying NO fields at all.
// ⚠️ The helper this test reads through must not be `find(l => l.startsWith('active'))` — §2.4 — or the
// plural case passes while returning one line. `activeLine` throws on plural for exactly this reason.
test('ADR-047 P17: the two `⟦SELECT⟧` blocks of §2.3 are pinned byte for byte', () => {
  const two = sprintsFixture({
    plans: {
      'backlog.md': prosePlan('# Backlog — unsprinted', null),
      'sprint-8.md': prosePlan('# Eight', BANNER.inprogress),
      'sprint-9.md': prosePlan('# Nine', BANNER.inprogress),
    },
  });
  const a = runMode(['select-active', two.sprintsDir]);
  assert.equal(a.code, 0);
  assert.equal(a.out, [
    '⟦fkit-dashboard v2⟧',
    '⟦SELECT⟧',
    'active file="sprint-8.md" identity="Sprint 8" status="In progress"',
    'active file="sprint-9.md" identity="Sprint 9" status="In progress"',
    'board file="sprint-8.md" identity="Sprint 8" status="In progress" reason="lowest-ordered"',
    'candidate file="backlog.md" identity="Backlog" status="unresolved"',
    'candidate file="sprint-8.md" identity="Sprint 8" status="In progress"',
    'candidate file="sprint-9.md" identity="Sprint 9" status="In progress"',
    '⟦FACTS⟧',
    '⟦END⟧',
    '',
  ].join('\n'));

  const zero = sprintsFixture({
    plans: {
      'backlog.md': prosePlan('# Backlog — unsprinted', null),
      'sprint-7.md': prosePlan('# Seven', BANNER.done),
    },
  });
  const z = runMode(['select-active', zero.sprintsDir]);
  assert.equal(z.code, 3);
  assert.equal(z.out, [
    '⟦fkit-dashboard v2⟧',
    '⟦SELECT⟧',
    'active none',
    'candidate file="backlog.md" identity="Backlog" status="unresolved"',
    'candidate file="sprint-7.md" identity="Sprint 7" status="Done"',
    '⟦FACTS⟧',
    '⟦END⟧',
    '',
  ].join('\n'));
});

// P18 — ⭐ review round 1, finding R6: the `⭐ ACTIVE BOARD` marker crossed with a SAME-IDENTITY
// collision. Before this test the combination had NO coverage in either direction, which is what R6
// actually costs — P7 marks two DIFFERENT identities, P14 collides one identity with NO marker.
//
// ⛔ DIRECTION A PINS A KNOWN UNDER-COUNT, DELIBERATELY. Two files, one identity, BOTH marked meets
// §7's literal condition for `ambiguous-active-marker` — "more than one board carries the marker" —
// and the record does NOT fire. `_n_claim` is counted over `_ordered`, which has already collapsed
// each identity to one record, so two marked files of one identity count ONCE. ⭐ This is the
// ACCEPTED RESIDUAL `marker-under-count-on-shared-identity` in this task's review ledger, under the
// owner's ruling "Residual + add the test (Rec)" — it is recorded behaviour, NOT a bug to fix on
// sight. Nothing goes unreported: `ambiguous-active-sprint` fires and names BOTH files, and both
// markers name the SAME sprint, so the answer is unambiguous in a way P7's genuinely is not.
// ⚠️ If you widen `_n_claim` to count FILES, this assertion is the one that tells you so — re-read the
// residual's "Re-raise only if" before changing it, and change the residual with it.
//
// ⛔ DIRECTION B is the mirror, and it is the build's D7 frontier-move, not a defect: a marker on the
// file that LOST the byte-order tie is ignored ENTIRELY — claimants are drawn from the printed
// `active` set, so `_n_claim` is 0 and the board falls back to lowest-ordered.
test('ADR-047 P18: `⭐ ACTIVE BOARD` on a same-identity collision — the recorded under-count, both directions', () => {
  // A — BOTH files of the colliding identity are marked.
  const both = sprintsFixture({
    plans: {
      'sprint-4.md': prosePlan('# Four', BANNER.inprogress),
      'plan-sprint-6.md': prosePlan('# Six — plan', `${BANNER.inprogress} ⭐ ACTIVE BOARD`),
      'sprint-6.md': prosePlan('# Six — sprint', `${BANNER.inprogress} ⭐ ACTIVE BOARD`),
    },
  });
  const a = runMode(['select-active', both.sprintsDir]);
  assert.equal(a.code, 0);
  // The marker still wins the board, and it resolves to the tie WINNER — ADR-041 §1.5's first-in-byte-order.
  assert.equal(boardLine(a.out),
    'board file="plan-sprint-6.md" identity="Sprint 6" status="In progress" reason="active-marker"');
  assert.deepEqual(activeLines(a.out), [
    'active file="sprint-4.md" identity="Sprint 4" status="In progress"',
    'active file="plan-sprint-6.md" identity="Sprint 6" status="In progress"',
  ], 'one identity is ONE active line, however many files claim it — the marker does not change the set');
  // ⛔ THE UNDER-COUNT ITSELF, asserted positively so it cannot drift silently in either direction.
  assert.ok(!a.out.includes('ambiguous-active-marker'),
    'recorded residual `marker-under-count-on-shared-identity`: two marked files of ONE identity count ' +
    `once, so this record does not fire. Facts: ${JSON.stringify(facts(a.out))}`);
  // ⭐ AND THE MITIGATION, which is why the under-count is acceptable: the collision IS reported, by name.
  assert.deepEqual(facts(a.out),
    ['drift ambiguous-active-sprint identity="Sprint 6" chosen="plan-sprint-6.md" also="sprint-6.md"'],
    'the collision must still be reported naming both files — nothing about this case is silent');

  // B — the mirror: only the tie LOSER is marked (build decision D7).
  const loser = sprintsFixture({
    plans: {
      'sprint-4.md': prosePlan('# Four', BANNER.inprogress),
      'plan-sprint-6.md': prosePlan('# Six — plan', BANNER.inprogress),
      'sprint-6.md': prosePlan('# Six — sprint', `${BANNER.inprogress} ⭐ ACTIVE BOARD`),
    },
  });
  const b = runMode(['select-active', loser.sprintsDir]);
  assert.equal(b.code, 0);
  assert.equal(boardLine(b.out),
    'board file="sprint-4.md" identity="Sprint 4" status="In progress" reason="lowest-ordered"',
    'D7: a marker on the tie LOSER is ignored — naming it the board would contradict ' +
    '"the board is one of the active sprints"');
  assert.deepEqual(facts(b.out),
    ['drift ambiguous-active-sprint identity="Sprint 6" chosen="plan-sprint-6.md" also="sprint-6.md"'],
    'the ignored marker is not silent either — the collision that swallowed it is reported');
});
