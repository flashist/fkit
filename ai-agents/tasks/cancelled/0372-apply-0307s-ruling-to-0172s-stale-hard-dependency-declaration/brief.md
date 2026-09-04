# Apply `0307`'s ruling to `0172`'s stale **hard** dependency declaration — a live board-semantics change, ⛔ not a citation repair

## ID
0372

## Sprint
Backlog

## Priority
Unscheduled

## Status
⛔ Cancelled (agent-closed — not owner-verified) (2026-09-04) — absorbed into `0307` as its third instance under owner ruling H24 — correctly filed and correctly flagged as a near-duplicate the same day, and the owner chose the merge; ⛔ NOT filed in error

## Owner
fkit-producer

## Context

**Owner ruling H2**, given at [`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s
plan gate on **2026-09-03**, live via `AskUserQuestion` in the driving `fkit lead` session. **The
option label is the verbatim text: "Surface it, hand to producer (Rec)".** The settlement, verbatim:
⛔ *"**Do NOT repair the live dependency-declaration line.** It is recorded as a named residual and
handed to the producer with the close list. **Board semantics are the producer's.**"*

### ⛔⛔ READ THIS FIRST — THIS ROW IS GATED ON A DECISION THAT HAS NOT BEEN MADE

⚠️⚠️ **[`0307`](../../backlog/0307-decide-how-the-derive-cell-reaches-a-corrected-dependency-line/brief.md) owns
the question *how* a corrected dependency line reaches the dashboard's derive cell, and it is still
open.** `0307` names `0046` and `0168` as its instances. ⛔ **It does not name `0172`.**

⭐ **So this row is the third instance, not a second decision.** It applies whatever `0307` rules, to a
site `0307` does not cover. ⛔ **It must not pre-decide `0307`'s question, invent its own repair form,
or ship before `0307` rules.** ⚠️ **[`0184`](../../backlog/0184-record-depends-on-blocks-as-the-binding-execution-order/brief.md)
separately owns the declaration *form*** — also open, also not to be pre-decided here.

⛔ **If a run reaches this row and `0307` is still open, the correct outcome is to stop and say so —
not to choose a treatment.**

### The site, verified firsthand 2026-09-04

`ai-agents/tasks/backlog/0172-narrow-the-architect-output-format-path-line-mandate/brief.md`,
§"Notes", the dependency-declaration bullet. It declares a **hard** dependency on `0171`, and its
stated rationale reads *"a pointer to a page that does not exist is the defect class this whole arc is
about."*

⛔ **`0171` is closed** (`ai-agents/tasks/done/0171-write-the-durable-citation-anchors-convention-page`,
closed 2026-08-22) **and the convention page exists.** So the declaration's rationale is now false, and
the hard dependency it asserts is discharged.

`dashboard.sh` currently derives, for that row:
`derive 0172 depends="0171 (the convention page this bullet points at). … Hard — a pointer to a page
that does not exist is the defect class this whole arc is about"`.

### ⛔⛔ WHY THIS IS DANGEROUS — two hazards, both measured

**1. Editing it changes what the board computes.** ⛔ *"Board semantics are the producer's. Editing it
changes what the dashboard derives and **can flip a truthful `ready` row false**."* This is a
**board-semantics change, not a citation repair** — which is exactly why `0356` refused it.

**2. ⛔⛔ QUOTING THE LABEL VERBATIM FIRES THE DEFECT.** `dashboard.sh` matches the bold `Depends on`
label **mid-line**. When an earlier draft of `0309`'s brief quoted it literally, the board rendered
`derive 0309 depends="0171 (the convention page this bullet points at)…"` — ⭐ **the `task-84`
misreport class, fired by a brief about citation defects, inside the very table listing the defect.**

⛔ **That is why this brief DESCRIBES the bullet instead of quoting its label, and that is not
sloppiness. Do not "restore" a verbatim quote anywhere in this task's records.**

## What to build

1. **Check `0307`'s state first.** ⛔ **If `0307` has not ruled, stop and report that** — this row
   cannot proceed. Do not choose a treatment on its behalf.
2. **Once `0307` has ruled, apply its ruling to `0172`'s bullet** — and only its ruling. ⛔ **No new
   repair form is invented here.**
3. **Capture what `dashboard.sh` renders for `0172` BEFORE and AFTER**, and justify the change against
   the before-capture. ⚠️ This evidence shape is prescribed by `0309`'s brief and is not optional.
4. **State explicitly whether the change flips `0172`'s readiness**, and whether that flip is truthful.
   ⛔ **A run that changes the derived cell without saying what it did to readiness has skipped the
   only thing that made this the producer's call.**
5. **Describe, never quote, the bold dependency label** in every record this task writes.

⛔ **Out of scope:** `0307`'s decision itself; `0184`'s declaration-form question; `0046` and `0168`
(they are `0307`'s own instances); any other brief; any `## Status` change; any task-file move
([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md));
`ai-agents/wiki-vault/` ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. `0307`'s state is checked and reported **before** any edit.
2. `dashboard.sh`'s `derive 0172 …` line is captured **before and after**, both shown.
3. The run states **whether readiness flipped**, and whether the new value is truthful.
4. ⛔ **No record written by this task quotes the bold dependency label verbatim** — verified by
   re-running the dashboard and confirming no spurious `derive` line appeared for this task itself.
5. `git diff -U0` touches **exactly one** bullet in one brief.
6. `npm test` stays green.

## Notes

- **Depends on:** ⛔ **`0307` — HARD.** This row applies `0307`'s ruling and cannot ship before it.
- **Blocks:** nothing.
this belongs immediately below `0307`, since it is worthless before `0307` rules and near-mechanical after — and it should never be ranked above it.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⭐⭐ **NEAR-DUPLICATE REPORTED, DELIBERATELY FILED ANYWAY.** `0307` owns the *decision*; this row
  owns one *instance* `0307` does not name. ⛔ **If the owner would rather add `0172` to `0307`'s
  instance list and drop this row, that is a clean and reasonable alternative** — it is flagged here
  rather than decided.
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
