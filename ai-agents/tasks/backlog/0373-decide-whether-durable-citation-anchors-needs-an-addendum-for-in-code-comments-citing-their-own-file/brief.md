# Decide whether `durable-citation-anchors.md` needs an addendum for **in-code comments citing their own file**

## ID
0373

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

⚠️ **DECISION ROW. ⛔ A run that arrives having already chosen has failed it.**

**Authority:** [`0344`](../../done/0344-refresh-the-stale-line-refs-and-moot-r5-rationale-inside-release-mjss-fenced-summary-block/brief.md)'s
open question, carried out of
[`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s
[`worklog.md`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/worklog.md)
§"Named residuals carried out of this sweep", item 9: *"⚠️ **`0344`'s open question stands,
undecided:** whether `durable-citation-anchors.md` needs an addendum for **in-code comments citing
their own file**. Option B was used, so the question is live."*

⚠️ **No owner ruling attaches to this row.** `0344`'s framing was *"surfaced, not decided"*, and the
plan-level forcing of Option B was a plan constraint, not an `AskUserQuestion`. Stated so nobody cites
a ruling that does not exist.

### The gap in the convention

⛔ **The convention's table does not name this target.** Row 1 rules `path:NNN` **correct** for
*"a source file … cited in a design doc or a finding"*. But an **in-code comment pointing into its own
living file** is neither — and the convention has a section, *"Applying the two conditions to a target
the table does not name"*, that exists precisely for this.

`0344` applied that test and recorded the argument:

- **Condition 1 — does the file grow above the citation for reasons unrelated to it?** ⭐ *"**Yes,
  twice now**, and the fence guarantees the citing block stays at the bottom where every insertion
  pushes it down."*
- **Condition 2 — is there a unique quotable anchor?** ⭐ *"**Yes** — all four target fragments are
  unique, just measured."*
- ⛔ **Both conditions met, so `path:NNN` is the wrong form there** and the numbers were dropped.

**The drift that proved it:** *"⚠️ **The brief's snapshot was taken against a 408-line file; the file is
463 lines today, and the fence marker `// --- summary ---` has itself moved well below where the brief
records it.** ⛔ **Every number in that brief is stale.**"*

### ⭐ A second live specimen exists — use it

`claude/skills/fkit-status/dashboard.sh` carries a comment that names a line in its **own file** by
number — *"(see line 181)"* — and that line today holds an identity-ordering warning, **not** the awk
program the comment claims. Verified firsthand 2026-09-04. ⭐ **Two independent instances is the
evidence that this is a class and not a one-off.**

### ⛔ The fence

⛔ *"**The convention is dual-homed and owner-ruled — not mine to edit.**"* It lives at
`ai-agents/knowledge-base/conventions/durable-citation-anchors.md` **and** its `claude/scaffold/`
twin; [ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)'s
parity test binds them. ⛔ **Any edit lands in both homes in the same change, or the parity test reds.**

## What to build

1. **Decide whether the convention needs an addendum at all.** ⛔ **"Yes" is not the assumed answer** —
   the existing *"target the table does not name"* section may already be sufficient, in which case the
   honest outcome is a recorded "no" with the reason.
2. **If yes, write the addendum** — a new row or a named sub-case saying which form an in-code comment
   citing its own file should use, and why. ⛔ **Land it in BOTH homes in the same change.**
3. **Reason from both live specimens**, not one — `bin/release.mjs`'s fenced summary block and
   `dashboard.sh`'s self-pointing comment. ⚠️ They differ: one sits under a fence that guarantees
   downward drift, the other does not. ⛔ **Say whether the rule covers both or only the fenced case.**
4. **Say whether it generalises to a comment citing a *different* file.** ⛔ Do not widen silently; row
   1 already rules that case, and re-opening it is a bigger change than this question asks.
5. **Record it as an ADR** if it changes a rule any role follows.

⛔ **Out of scope:** repairing any individual site (those are separate rows); changing row 1's
source-file ruling; the guard's target class; `ai-agents/wiki-vault/`
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. The deliverable **states a decision — addendum or no addendum — with its reason**. ⛔ A document
   that only restates the question fails.
2. **Both live specimens are examined** and the run says whether the answer covers both.
3. The run says explicitly **whether it generalises to comments citing other files**, and does not
   silently change row 1.
4. If the convention was edited, **both homes changed in the same commit** and `npm test`'s dual-home
   parity check passes.
5. `npm test` stays green.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing hard.
this belongs low among the decision rows: two instances is a thin base for a convention change, and the existing *"target the table does not name"* section may already answer it — but it is cheap to settle and stops each future run re-deriving the same argument.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⭐ **The ownerless-coordinate repair row holds the `dashboard.sh` specimen.** ⛔ Neither gates the
  other, but this row should be shown that specimen before deciding.
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
