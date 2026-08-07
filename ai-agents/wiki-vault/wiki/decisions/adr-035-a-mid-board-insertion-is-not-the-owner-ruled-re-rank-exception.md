# ADR-035: A mid-board insertion is not the owner-ruled re-rank exception

**Date**: 2026-08-01
**Status**: accepted

> **What this ADR decides, in one line:** the owner-ruled re-rank exception lets an owner move an **existing** row **within its own contiguous run of open rows** — it does **not** let anyone insert a new row mid-board, because on an interleaved board that always renumbers closed history.

## Context

`/fkit-task-brief` **step 5** carries two rules that were read as compatible and are not.

- **The append rule and its exception** — *"Targeting a named sprint: append **after** the existing highest priority. Do not renumber or insert into the owner's ranking"*, with *"the one exception — an owner-ruled re-rank. A re-rank is the owner's call."*
- **The closed-row rule**, stated absolutely — *"`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — **not even under an owner ruling**."* And: *"A closed row is a wall, not a step."*

**They collide on an arithmetic fact.** Inserting a row at any position renumbers **every row below it**. On a board where closed and open rows **interleave**, the only insertion point with no closed row beneath it lies inside the final run of open rows — which is to say, appending. Hence the ADR's central sentence:

> **On an interleaved board there is no mid-board insertion point that does not renumber a closed row.**

Sprint 2 is such a board: measured 2026-08-01, **126 of 155 ranked rows are closed**, scattered through the open ones in **five disjoint open segments**.

**This is not theoretical — it already happened, and nobody noticed.** Task `0174` — itself the task about ordering — was inserted mid-board on 2026-08-01 under an explicit owner ruling invoking the exception. Verified against the filing commit's own diff, the insertion **renumbered eight closed rows**: `0151`, `0147`, `0150`, `0157`, `0161`, `0148`, `0159`, `0160`. All eight read `✅ Done` at the time.

⚠️ **Two live records assert the opposite, and both are false** — the sprint-2 filing addendum (*"no closed row was renumbered by the insertion"*) and `0174`'s own brief, which repeats it verbatim. **The reasoning that produced the error is visible and will recur:** the producer checked the ranks **above** the insertion point — the owner's named band, all closed — and correctly concluded that placing the row below them renumbered none of *them*. **An insertion renumbers what is below it. The check ran in the wrong direction.**

## Decision

**The owner-ruled re-rank exception permits moving an existing row within its own contiguous run of open rows. It does not permit inserting a new row mid-board.**

The closed-row rule is **absolute and outranks the exception**, exactly as it already says. An owner may re-rank their own board; an owner may **not** renumber closed history.

**Where a new row's merit position is out of reach, it appends and the ordering intent is recorded in the brief** as a relative, non-numeric merit statement naming its neighbour **by folder ID**:

```
- **On merit:** immediately above 0154 — <reason>
- **On merit:** as ranked
```

**Corollary, stated so it is not rediscovered as a defect:** the append rule is a **forced consequence** of the closed-row rule, not an independent policy. Anyone proposing to allow insertions must argue the **closed-row rule**.

### Rejected by name — a finding proposing any of these is closeout, not a new defect
- **Leave step 5 alone, treat `0174` as a one-off error.** *"A rule that survives only until someone reads it carefully is not a rule."*
- **Relax the closed-row rule.** The substantive rejection: renumbering closed rows invalidates every rank reference in every closed brief, ledger and report at once — the failure tasks `0157` and `0159` were spent repairing.
- **Formalize the owner-ruled re-rank harder.** `0174`'s filing already did this impeccably — dated, channel named, authority before outcome — and **still breached the rule eight times, because the problem is arithmetic, not authority.**
- **Revert the `0174` insertion.** Reverting renumbers the same eight closed rows **a second time**. **Correct the record; do not revert.**

## Consequences

- **Accepted cost, and it is not small:** an owner **cannot** place a new task at its merit position when that position sits behind a closed row. Measured 2026-08-01, **16 of 29 open sprint-2 rows** sit behind a closed wall. The board's reading order will keep drifting from merit order as the board closes out.
- **The merit statement is advisory** — it changes nothing about which task is picked up next. Where ordering must actually **bind**, it belongs in `Depends on` / `Blocks`, not in rank and not in a merit note.
- **The rule is checkable**, so a guard becomes possible — but **none is built here**. The proposed `test/closed-rank-immutability.test.js` is a **diff** check across a commit range (no property of a single board file reveals that a closed row was renumbered), ranked LOW, and **would be red on the commit that filed `0174`** — which is why it needs a baseline decision first.
  - *✅ Dated correction 2026-08-06 (recorded by the 2026-08-07 sync; original above byte-identical):* **the guard is now BUILT** — [[tasks/build-the-closed-rank-immutability-guard]] (`0182`, Sprint 3 P2). The baseline question was **dissolved rather than answered**, on owner-delegated architect rulings: baseline = `HEAD`, scope = the transition in progress (plus a `HEAD`↔`HEAD^` leg), **no history range** — so the `0174` filing commit is not red and not exempted; it is **outside the guard's stated scope**. The "would be red" replay survives as a fixture test over the two `0174` revisions. ⛔ The guard is **not continuous protection**: no CI runs it, and a breach committed with no test run in the window is never caught.
- **Left undone deliberately:** the step-5 skill edit is **not** made here (task `0181`); the two false live records are **not** repaired here (task `0183`); nothing is re-ranked or reverted.
  - *✅ Dated correction 2026-08-06:* the step-5 edit has landed — [[tasks/narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank]] (`0181`, Sprint 3 P1): the exception narrowed in this ADR's words, remedy and corollary in the same step.
- **Not covered:** whether the open rows should be rolled onto a fresh board to restore reachability wholesale — **deferred by the owner** 2026-08-01 (task `0185`).
  - *✅ Dated correction 2026-08-06:* the owner signed — **Sprint 2 rolled to Sprint 3** ([[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]]); ranks restart at `P1`, no closed row renumbered on any board, this ADR's wall re-applying the moment the first Sprint 3 row closed.

## Related
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174`, the investigation and decision report this ADR records (§4.2)
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — task `0160`, which ruled this question **out of class** and handed it back as its own task; it also supplies the citation form used here — **and this ADR extends it: a bullet ordinal is a line number wearing different clothes**
- [[tasks/state-task-brief-step-5s-append-rule-in-full]] · [[tasks/sweep-the-stale-rank-citations]] — tasks `0157` and `0159`, the stale-rank rule and its repair sweep; the precedent that a stale rank reference is fixed by **naming the folder ID**, not by restoring numbers
- [[tasks/implement-task-folder-name-scheme-change]] — where `priority-is-rank-not-identity.md` was filed; the reason closed ranks must not move
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — permanent folder IDs are what make the relative, non-numeric merit statement durable
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — the sibling ADR accepted out of the same sprint run; both follow `0160`'s citation form
- [[tasks/sprint-2-remove-omnigent]] · [[systems/fkit]]
- Source: `ai-agents/knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md`, `ai-agents/knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md`
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — forbids ADR-037's **instance A** on a separate axis — the two agree, and neither does the other's work
- [[tasks/tighten-the-wiki-completion-flag-block]] — task `0173` — a live case where **append rank contradicted the dependency links**, and the links were the binding record
- [[tasks/specify-and-support-the-reverse-move-sprint-to-backlog]] — task `0210` — a reverse-moved sprint row **keeps its `P<n>` as frozen history**; rewriting it would be a renumber
- [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]] — task `0191`, whose clause governs the **instruction** side of the same 2026-07-27 act this ADR forbids on the **arithmetic** side. **The two agree and neither does the other's work**
- [[tasks/narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank]] — task `0181`, the step-5 skill edit implementing this ADR (Sprint 3 P1, closed 2026-08-06)
- [[tasks/build-the-closed-rank-immutability-guard]] — task `0182`, the mechanical guard (Sprint 3 P2, closed 2026-08-06)
- [[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]] — task `0185`, the rollover this ADR's arithmetic made the only reachability mechanism — ruled and executed 2026-08-06
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — the fresh board, ranked on merit while it had no closed rows
