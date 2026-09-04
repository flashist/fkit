# Pin the three unpinned fence-**opener** branches in the coordination-citation guard — each mutant passes 20/20 today

## ID
0370

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner ruling, 2026-09-03**, given live via `AskUserQuestion` at
[`0176`](../../done/0176-build-the-coordination-citation-policy-guard/brief.md)'s review. **The option
label is the verbatim text: "Follow-up (Rec)".** Finding **R3** was recorded as
*"Defect (coverage) — **deferred by owner ruling, not reclassified**"*.

⚠️ **A recorded severity disagreement, carried rather than smoothed:** the reviewer rated R3
**medium**; the coder rated it **low** and said so. Both are on the record.

### What is unpinned

`C1` and `C2` pin the fence regex's CommonMark **close** rule and nothing else — so **three
*opener* branches** in `test/coordination-citation-policy.test.js` can each be mutated with the suite
staying green:

| # | Branch | Mutation | Result |
|---|---|---|---|
| 1 | the `~{3,}` alternative | drop it | passes **20/20**; live total unchanged at **166** |
| 2 | the `^\s{0,3}` indent tolerance | require column 0 (`^`) | passes **20/20**; live total unchanged at **166** |
| 3 | the `` ([^`~]*) `` info-string capture | reject any info-string opener (`(\s*)`) | passes **20/20**; live corpus moves **166 across 66 → 159 across 64, SILENTLY** |

⛔ **Branch 3 is the dangerous one — it changes the live measurement and nothing reds.**

⭐ **The gap is specific, not general, and there is a contrast that proves it:** the **blockquote**
branch **is** pinned — mutating `/^\s*>/` → `/^>/` reds `C3`.

### Why it was deferred

⛔ *"Rejected alternative: pinning all three now, which the owner declined this round as scope the
plan's arm list did not carry."* ⚠️ **Real, but lower-stakes than R1/R2** — and the branch that
actually broke historically (a closing fence carrying an info string, introduced once and copied into
both specification masters) **is** already pinned by `C2`.

## What to build

1. **Re-measure all three mutants firsthand before writing a test.** ⛔ **Do not trust this brief's
   figures** — state your own pass counts and your own live-corpus totals. If a mutant now reds on its
   own, **say so and do not add a redundant test.**
2. **Add one pinning case per unpinned branch** — three cases, each of which **reds** when its branch
   is mutated and **greens** when it is not.
3. **Wire each new case as a `prove-red.sh` mutation**, so the pin is itself proved rather than
   asserted. ⚠️ This repo's standing bar is that a guard which cannot be shown to red is not a guard.
4. **Re-state the live corpus total** after the change, and confirm it is unmoved by the *tests*
   themselves.

⛔ **Out of scope:** changing the fence regex's behaviour; widening the guard's target class (a
separate costing row); any change to what the guard scans or exempts;
`ai-agents/wiki-vault/` ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. Each of the three branches has a test that **reds under its own mutation** — demonstrated, not
   claimed, with the mutation named.
2. The **blockquote branch's existing pin still reds** (`C3`), proving the new cases did not displace
   it.
3. The live corpus total is **stated before and after** and is unchanged by the test additions.
4. `npm test` passes and `bash test/prove-red.sh` passes with its **new** mutations named in the run.
5. `git diff --stat` shows changes only under `test/`.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
this belongs with the other guard-hardening rows and below the correctness repairs: it closes a coverage hole in a guard that already works, and the branch most likely to break in practice is already pinned.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⚠️ **`0176`'s recorded re-raise condition for this residual:** *"a fence-opener branch is
  *edited*, or the live total moves without a matching edit to `TARGET` or to the corpus, or the
  follow-up the producer may file lands and re-opens it."* ⭐ **This row is that follow-up.**
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
