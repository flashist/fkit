# Cost widening the citation guard's target class to source-file coordinates — investigation only, ⛔ no implementation

## ID
0371

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

⚠️ **INVESTIGATION / COSTING ROW. ⛔ It ships a cost, not a change.**

**Owner ruling G3**, given at [`0176`](../../done/0176-build-the-coordination-citation-policy-guard/brief.md)'s
plan gate on **2026-09-02**, live via `AskUserQuestion`. Question: *"Should the target class widen to
source-file coordinates?"* **The option label is the verbatim text: "No, refuse — file follow-up if
wanted (Rec)".**

The settlement, verbatim: ⛔ *"**Refused.** Source-file `path:NNN` stays legal — the convention's row 1
rules it correct, and re-measured cost is **249 across 45**. ⭐ A follow-up may be filed to cost it;
that is the producer's and does not block this task."*

⭐ **This row is that follow-up. It exists to COST the widening, not to perform it, and not to reopen
the refusal.**

### What the guard covers today, and what widening would add

`test/coordination-citation-policy.test.js` fires only on `ai-agents/`-prefixed **coordination
documents**. `0356`'s `plan.md` §2.1 states the exclusions in terms — it *"Does not fire on: … an ADR,
`architecture.md`, `README.md`, `claude/`, `test/` or `bin/` path with or without a line number."*

Widening would bring in `path:NNN` citations into **source files** — `claude/`, `test/`, `bin/` — and
into `ai-agents/knowledge-base/` documents that are not task-keyed (ADRs, `architecture.md`,
`README.md`).

**The one measured figure that exists: 249 occurrences across 45 files** (re-measured at `0176`'s plan
gate, 2026-09-02). ⛔ **It is a dated observation, not a permanent fact. Re-derive it.**

### ⛔ The refusal is NOT the question this row asks

⛔ **Source-file `path:NNN` is legal and this row does not propose making it illegal.** Row 1 of
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md) rules
it **correct** for *"a source file … cited in a design doc or a finding"*. ⚠️ **A run that arrives
recommending a ban has misread its own charter.**

The real question is narrower and more interesting: **is there a sub-class of source-file coordinates
that genuinely rots**, distinct from the ones that are fine — and if so, what would it cost to detect
only that sub-class?

⭐ **Two live specimens exist to reason from**, both recorded in
[`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s worklog as an
**ownerless class**: `dashboard.sh`'s comment pointing at a line that no longer holds what it claims,
and `test/prove-red.sh`'s stale numeral. ⛔ **Nothing owns them today.**

## What to build

**A report under `ai-agents/knowledge-base/reports/`. ⛔ No guard change, no test, no convention edit.**

1. **Re-derive the census firsthand.** State your own occurrence and file counts, and say whether the
   **249 across 45** reproduces. ⛔ Count occurrences, not lines.
2. **Classify the population** — how much of it is a coordinate that still lands where it means
   (correct, and must never be flagged), versus one that has drifted. ⭐ **This ratio is the entire
   decision**: a guard that flags 249 sites to catch a handful is not worth building.
3. **Cost at least three shapes**, with the false-positive rate for each: widen the existing guard;
   a separate, narrower check for a specific rotting sub-class; and **do nothing, with the residual
   stated**. ⛔ **"Do nothing" must be costed as seriously as the others.**
4. **Say whether a mechanical check can even distinguish a drifted coordinate from a correct one**
   without resolving each against disk — and what resolving them costs at suite runtime.
5. **Recommend one shape with its main tradeoff.** ⛔ Do not implement it.

⛔ **Out of scope:** any change to the guard, any test, any convention edit, any repair of an
individual site (those are separate rows); `ai-agents/wiki-vault/`
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. The census is **reproduced firsthand with its own totals**, and the run says whether **249 across
   45** still holds.
2. The **correct-versus-drifted ratio is measured**, not estimated — with the method stated.
3. **Three shapes are costed**, including "do nothing", each with its false-positive consequence.
4. The report answers **whether a mechanical check can distinguish drift from correctness**, and at
   what runtime cost.
5. **One recommendation, with its main tradeoff.**
6. ⛔ **`git diff --stat` shows a new report file and nothing else** — no guard, test, or convention
   was touched.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
this is genuinely optional and belongs low: nothing is broken today, the refusal it follows up is settled, and its value is deciding whether to spend on detection at all — but it is cheap, and it would tell the owner whether the two live rot instances are a pattern or a coincidence.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⭐ **Same family, different job:** the ownerless-coordinate repair row takes two live instances of
  exactly this rot. ⛔ **Neither gates the other** — that row repairs, this row costs whether to
  detect. Whoever runs second should read the first.
- ⚠️ **`0176`'s recorded re-raise condition:** *"**G3 — source-file coordinates stay legal** — Re-raise
  only if: the owner takes the follow-up."* ⭐ **Filing this row IS the owner taking it.**
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
