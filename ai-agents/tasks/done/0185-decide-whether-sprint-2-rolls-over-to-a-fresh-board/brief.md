# Decide whether Sprint 2 rolls over to a fresh board

## ID
0185

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

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

## Resolution — 2026-08-06

### The ruling, recorded with its date and channel (verification step 4)

**The owner signed. Three rulings, all given 2026-08-06 via `AskUserQuestion` in a live `fkit lead`
session:**

1. **"Roll over to Sprint 3."**
2. **"Follow the Sprint 1 precedent"** — for the archival shape.
3. **"Pull it into Sprint 3"** — naming task `0182`, having been told `0181` is its gate and would come
   with it.

**The gate this brief set is therefore discharged.** The `## Out of scope` prohibitions above
(*"⛔ Do not roll the board"*, *"⛔ Do not create a `sprint-3.md`"*) were **conditional on the absence of a
ruling**, and they held for five days. They are now spent, not violated.

### ⚠️ Reconciling this brief's own status contradiction, honestly

**This brief has been internally inconsistent since it was written, and a prior status run surfaced it.**
Its `## Status` cell read `🔲 Backlog` while its `## Notes` dependency line read
*"🚧 **Blocked on an owner ruling** — deferred 2026-08-01."* Those are two different states. The
dependency line was the accurate one for 2026-08-01 → 2026-08-05; the `## Status` cell was wrong for
that whole window and **nothing caught it**, because `🚧 Blocked` is free for any session to set and no
control cross-checks a status cell against prose in the same file.

**It is not being retroactively corrected** — the original line is left byte-identical above, per this
project's dated-correction convention. **It is corrected forward:** as of 2026-08-06 the block is
discharged, the work is done, and the task closes. Recording the contradiction is the point; silently
overwriting the older line would erase the evidence that a status cell and its own brief can disagree
for five days undetected. **That is worth its own task and does not have one.**

### What was executed, and by whom

Executed by a **spawned `fkit-producer` with no owner channel**, acting on the three rulings above.

| Act | Result |
|---|---|
| Archive the board | `ai-agents/sprints/sprint-2.md` → `ai-agents/sprints/done/sprint-2.md` (`git mv`), with a `🔒 CLOSED` banner in the Sprint 1 shape |
| Re-point links | **341** internal links in the archived board + **12** inbound links in 5 other files |
| Create the fresh board | [`ai-agents/sprints/sprint-3.md`](../../../sprints/sprint-3.md) — ranks restart at `P1` |
| Carry the one open row | `0222` → Sprint 3 `P3`; its Sprint 2 row keeps the frozen `P189` |
| Pull in the named work | `0181` → `P1`, `0182` → `P2`, from the Backlog board |
| Renumber a closed row | **None. Not one, on any board.** |

### The four scope questions this brief required — all answered

Answered in full on the new board under §"Rollover record". In short: **(1) in-flight tasks** — none
existed, so the case is **unexercised and still unspecified**; **(2) citations** — they point at a frozen
board, not at nothing, and every broken *link* was re-pointed, while **107 files of prose citations were
deliberately left** for a dedicated task, per the Sprint 1 precedent (`0076`); **(3) dashboard discovery**
— verified first-hand **before** the roll, not after: `/fkit-status` globs `sprint-*.md` at the top of
`ai-agents/sprints/` and treats `done/` as closed, so the archival is exactly what makes Sprint 3 active;
**(4) rank numbering** — **restarts at `P1`**, with the resulting `P<n>` ambiguity between two boards
stated as an accepted cost.

### ⚠️ Three things this task did NOT do — none of them silent

1. **The prose-citation sweep** — 107 files still carry the literal string `ai-agents/sprints/sprint-2.md`.
2. **The wiki re-sync** — `ai-agents/wiki-vault/` still calls Sprint 2 active. **Only `fkit-wiki` may
   write the vault (ADR-005).** This session wrote nothing there.
3. **`0182`'s glob defect** — its brief globs `sprints/sprint-*.md`, which no longer reaches the archived
   board. A separate unit is queued; it was deliberately not repaired here.

**Plus one defect this rollover exposed:** the **round-trip drift**, ceiling **45 rows** — see the new
board's §"Known follow-ups this rollover created". **None of the four has a filed task yet.**
