# Decide whether Sprint 2 rolls over to a fresh board

## ID
0185

## Sprint
Sprint 2

## Priority
163

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

**This is follow-up 8 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§3.6, §8 and §9). Report §8 marks it **⚠️ NOT RULED, awaiting the owner**, and simultaneously calls it
**the highest-leverage of the eight**.

### 🚧 THIS TASK IS OWNER-GATED. NOTHING MAY BE ROLLED WITHOUT A SIGNED RULING.

> **The owner deferred this decision on 2026-08-01.** Report §3.6 rules the rollover **IN as a
> mechanism** and states, in the same breath, *"Its execution is a separate decision and is NOT ruled
> here … Nothing in this report authorizes rolling the board."* ADR-035 repeats it: *"deferred by the
> owner as of 2026-08-01, and nothing here rules on it."*
>
> **Do not read candidate 6's ruling as authorization.** This brief scopes the decision; it does not
> make it.

### The state of the board, measured 2026-08-01 18:32 MSK

| Measure | Value |
|---|---|
| Board rows with a `P<n>` cell | **155** |
| Closed | **126 (81%)** |
| Open | **29** |
| Disjoint open segments | **5** |
| Open rows unreachable from the append zone | **16 of 29 (55%)** |
| Singletons (cannot move at all) | **1** — task `0143` |
| Board file size | ~3,300 lines |

Reviewer-confirmed cell for cell, and independently reproduced by Codex.

**⚠️ The headline share improved for a reason that is not progress.** The unreachable share fell 68% →
55%, and **no open row moved from unreachable to reachable** over the interval — not one. The movement
was entirely (1) two unreachable rows **closing**, and (2) fresh rows appending into the reachable zone
and inflating the denominator. **Read the absolute count, not the share: 17 → 16, against +7 new rows.**
A metric that improves only when work disappears or unrelated work is added is not measuring the defect
getting better. **These figures are a snapshot and this batch of eight briefs has already moved them —
re-measure before putting the decision to the owner.**

### Why a rollover, and why it is not candidate 3

**It is the only mechanism that restores reachability.** Rolling the open rows onto a fresh contiguous
board, with sprint 2 frozen and closed, resets every open row into **one** segment. Unreachability goes
to **zero in one act** — and it **renumbers no closed row**, because the closed rows stay on the frozen
board at the ranks they already hold.

**Distinguish it from a periodic renumbering pass, which report §3.3 ruled OUT.** A renumbering pass
rewrites the ranks of rows that **stay** on the board — a mass rewrite of closed history, invalidating
every rank citation in every closed brief, addendum, ledger and report in one commit. A rollover
**moves open rows to a new board and leaves the old one frozen**. The first rewrites history; the second
does not touch it. **They are not variants of one idea**, and conflating them is the fastest way to get
this decision wrong.

**The report's own recommendation, stated as a recommendation and not a ruling:** everything else in the
eight makes an unrepresentable ordering **recordable and binding**. This is the only one that makes it
**representable again**, and the only one that moves the absolute unreachable count down for a reason
other than work disappearing.

## What to build

**A decision brief for the owner, and a scope if the owner says yes. Nothing is rolled by this task
until the owner signs.**

### Phase 1 — put the decision to the owner

Re-measure the board live, then present: the current figures, the mechanism, the three things below that
must be answered before any roll is possible, and a recommendation. **This is an owner sign-off gate,
not a producer judgement call.**

### Phase 2 — only if the owner signs: scope it

Report §8 names **three things the scope must state**, and none of them is optional:

1. **What happens to in-flight tasks** — rows that are `🔄 In progress` or `🚧 Blocked` when the roll
   happens, and any task with an open review ledger.
2. **What happens to every existing citation into the sprint-2 board.** The board is cited from briefs,
   addenda, review ledgers, ADRs and reports across the corpus. A roll that leaves those pointing at a
   frozen board is fine; a roll that leaves them pointing at nothing is not. **Say which.**
3. **What happens to the dashboard's board discovery.** `/fkit-status` finds the active sprint by
   globbing `sprint-*.md`. Two `sprint-*.md` files where there was one changes what "active" means, and
   the answer must be stated before the second file exists, not discovered by a status run.

**Add a fourth, which the mechanism's own arithmetic forces:** state whether the new board **restarts
rank numbering at `P1`** or continues from `P156`. Restarting makes every existing *"P119"*-style
reference in the corpus ambiguous between two boards; continuing leaves a board whose first row is
`P156`. **Both are defensible; leaving it unstated is not.**

### Out of scope

- **⛔ Do not roll the board.** Not partially, not as a draft, not behind a flag. Owner-gated.
- **⛔ Do not re-rank, renumber or move any existing row.**
- **⛔ Do not create a `sprint-3.md`** — creating the file is the roll.
- **⛔ Do not treat this as a renumbering pass.** §3.3 ruled that OUT.
- **⛔ Write no `:NNN` line-number citations.**
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. The board is **re-measured live** at decision time, with its own as-of timestamp and the method
   stated, and the figures above appear **only** as the prior reading being compared against.
2. The decision put to the owner names the rollover as **distinct from a renumbering pass**, and says
   why in one sentence.
3. All **four** scope questions are answered in writing, or the decision explicitly records which are
   deferred and what that blocks.
4. **The owner's ruling is recorded with its date and the channel it came through** before any file is
   created or moved. **If no ruling is recorded, no roll happened — verify that too.**
5. If the owner declines or defers again, the task records the decision and the figures, and closes or
   re-blocks accordingly. **A deferral is an outcome, not a failure.**
6. `git diff` shows **no `P<n>` cell changed** anywhere in `ai-agents/sprints/` while the task is in its
   decision phase.
7. `grep` for `\.md:[0-9]` over any artifact this task writes returns nothing.

## Notes

- **Depends on:** nothing mechanically. **🚧 Blocked on an owner ruling** — deferred 2026-08-01.
- **Blocks:** nothing formally. In practice it is the only act that makes every open row reachable
  again, so the longer it is deferred the more rows accumulate behind walls.
- **⚠️ Priority 163 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** immediately above `0132` — the report calls it the highest-leverage of the eight, and it
  is the **only** item that reduces the absolute unreachable count for a reason other than work
  disappearing. Its append rank is the **bottom of the board**, 26 open rows below its merit position —
  which is itself a demonstration of the defect the task addresses.
- **⚠️ This brief is a decision brief, not an implementation brief.** If the owner signs, the execution
  is scoped as its own task or tasks — the producer files them. **Do not let this task grow into the
  roll itself.**
- **Merit form used here** is the canonical `**On merit:**` shape from report §3.1 / ADR-035. Flagged so
  it is not read as drift.
- No existing row was renumbered by this brief.
