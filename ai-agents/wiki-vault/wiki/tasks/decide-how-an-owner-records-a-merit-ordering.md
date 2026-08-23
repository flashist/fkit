# Decide how an owner records a merit ordering that board rank can no longer carry

**Source**: `ai-agents/tasks/done/0174-decide-how-an-owner-records-a-merit-ordering-board-rank-cannot-carry/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-01
**Sprint/Tag**: Sprint 2 · ID 0174 · owner fkit-architect

## Goal
Task `0160` ruled this question **out of class by name** and **handed it back as its own task** — it is a *rule-consequence* question, not a stale-coordinate one, and *"no anchor form answers it."* The defect: `/fkit-task-brief` step 5 forbids inserting into the owner's ranking, so a row can only be re-ranked **within its own open segment**, because a closed row above it is a wall. As the board closes out, those segments fragment and rows become **unreachable** — their merit position is no longer expressible as a rank at all.

⚠️ **The brief's single most important instruction was: do not inherit the numbers, re-derive them.** `0160`'s headline proof case — a singleton that *"can never move at all"* — **had already expired within two days**. *"A finding whose headline proof case expires in two days while its underlying mechanism gets worse is a finding that needs its own task with its own live measurement."*

⚠️ **And the brief stated, rather than let anyone discover, that filing this very task moved the board it measures.**

## Key Changes
Produced `ai-agents/knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md` and **[[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]]**.

**Board state measured 2026-08-01, reviewer-confirmed cell for cell and independently reproduced by Codex:** **155 rows · 126 closed (81%) · 29 open · 5 segments · 16 of 29 unreachable · 1 singleton.**

⚠️ **The headline share improved for a reason that is NOT progress.** Unreachability fell 68% → 55% while **no open row moved from unreachable to reachable — not one.** The movement was entirely two unreachable rows **closing**, plus fresh rows appending into the reachable zone and **inflating the denominator**. *Read the absolute count, not the share: 17 → 16 against +7 new rows.*

**The ruling:** where a merit position is out of reach, the row **appends** and the intent is recorded in the brief as a **canonical, relative, non-numeric merit statement** naming its neighbour by **folder ID** — `- **On merit:** immediately above 0154 — <reason>`.

**Candidates ruled OUT by name**, as the brief required: a periodic renumbering pass (it rewrites the ranks of rows that **stay**, invalidating every rank citation in the corpus in one commit); formalizing the owner re-rank act harder; and relaxing the closed-row rule. **Ruled IN, though the brief's own list did not contain it:** where execution order must actually **bind**, it belongs in `Depends on` / `Blocks`, which **outranks board reading order** — three carriers with three jobs, and the merit statement is the **advisory** one.

**Enforcement, answered in the literal words the brief demanded:** *"nothing can enforce this."* *"There is nothing to assert. The question is what an owner writes down, not what a file contains."*

## Outcome
⚠️ **The task's own filing turned out to be the proof case.** Reckoning with it was an explicit brief requirement, and the answer was damning: `0174` was inserted mid-board on 2026-08-01 under an explicit owner ruling invoking the exception, and **renumbered eight closed rows** — verified against the filing commit's diff by the architect and **independently re-derived exactly by the reviewer**. **Two live records assert the opposite and both are false**, including `0174`'s own brief.

**The producer recorded its authority in full, checked the effect, and wrote a specific merit justification — and still breached an absolute rule, because the check ran in the wrong direction:** it verified the ranks **above** the insertion point. An insertion renumbers what is **below** it.

A second, quieter finding: the filing note called P119 the head of the earliest *"reachable"* open segment in a **different sense** of the word than the measurement uses. Under the measurement's sense, **`0174` was itself one of the 16 unreachable rows — the task filed to fix unreachability sat in an unreachable slot, described in its own filing note as reachable.**

**Eight follow-ups named, none filed** (`0178`–`0185`), the highest-leverage of which — rolling Sprint 2 onto a fresh board — the report ruled **in as a mechanism** while stating in the same breath that **its execution is a separate decision it does not authorize**. **The owner deferred it 2026-08-01.** *A deferral is an outcome, not a failure.*

> *✅ Dated update 2026-08-06 (recorded by the 2026-08-07 sync; paragraph above byte-identical):*
> three of the eight have now shipped — follow-up 4 as
> [[tasks/narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank]] (`0181`, the step-5 edit),
> follow-up 5 as [[tasks/build-the-closed-rank-immutability-guard]] (`0182`, the guard), and
> follow-up 8 as [[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]] (`0185`): **the owner
> signed the rollover** and Sprint 2 archived to `sprints/done/sprint-2.md`, succeeded by
> [[tasks/sprint-3-close-the-rank-integrity-loop]] — with not one closed rank renumbered.

## Related
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the decision this report produced (its §4.2)
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — task `0160`, which ruled this **out of class** and handed it back; this task is its follow-up 6
- [[tasks/state-task-brief-step-5s-append-rule-in-full]] — task `0157`, the append rule stated in full and the missing sanctioned exception
- [[tasks/sweep-the-stale-rank-citations]] — task `0159`, the repair sweep; *the decay is the finding*
- [[tasks/disambiguate-the-frozen-history-clause]] — task `0161`, whose close **expired this question's headline proof case**
- [[tasks/implement-task-folder-name-scheme-change]] — task `0103`, where `priority-is-rank-not-identity.md` was filed
- [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — task `0107`, the `Depends on` form the binding-order ruling relies on
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — permanent folder IDs make the merit statement durable
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — the sibling ADR from the same sprint run
- [[tasks/sprint-2-remove-omnigent]] · [[systems/fkit]]
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — ADR-035 and ADR-037 forbid the same mid-board insertion on **two separate axes**
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — task `0158` — the precedence axis: the instruction relayed no named owner ruling on placement
- [[tasks/record-the-canonical-merit-statement-form-in-the-convention-page]] — ✅ *Added 2026-08-22:* task `0178`, **follow-up 1 of this report, shipped 2026-08-21** — the two canonical shapes, the four rules, and the three-carrier table, dual-homed byte-identically. ⚠️ Its `brief-missing-merit` guard is **"Specified, not built yet."**
