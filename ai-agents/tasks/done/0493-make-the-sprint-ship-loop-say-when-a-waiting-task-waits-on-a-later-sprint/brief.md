# Make the sprint ship-loop say when a waiting task waits on a later sprint

## ID
0493

## Sprint
Sprint 10

## Priority
P13

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.
> The sprint ship-loop's per-task plan approval, given live by the owner, is where that word is given.

**The incident and the owner rulings** are recorded in full in
[`0492`](../../done/0492-flag-a-sprint-task-that-hard-depends-on-an-open-later-sprint-task-as-a-dashboard-drift-record/brief.md)'s
*Context*. In short: in a consuming project (geoconflict), 6 of a sprint's 8 open rows came to depend on
a task in the **next** sprint, and `/fkit-sprint-ship-loop`'s dependency-deadlock stop reported only
that tasks were "waiting" — never that the blocker sat in a later sprint, so the sprint could not finish
as planned. The owner found it by hand. Owner ruling (a), 2026-10-05: *"Board flags it"* — and the
ship-loop surfaces it.

**This brief is the ship-loop half of ruling (a).** `0492` makes `dashboard.sh` emit the new `drift`
record; this brief makes the sprint ship-loop **read and say** it. Split from `0492` because it is a
separate file, a separate procedure, and can be checked on its own.

**Overlap, flagged — not a dependency.** ADR-052 phase-5 task `0453` rewires both ship loops through
the board. It has not started. Build on the current tree; whichever lands second carries the other.

## What to build

In `claude/skills/fkit-sprint-ship-loop/SKILL.md` (canonical source — never the `.claude/` copy):

1. **At the start of a run (step 1, after reading the board):** if `dashboard.sh` emitted the `0492`
   drift record for any row, say so to the owner **before** driving anything: which tasks on this sprint
   wait on which task in which later sprint (or the Backlog board), and that this sprint cannot finish
   them as planned. It is an owner decision — relay it, do not resolve it.
2. **At the dependency-deadlock stop** (step 1's bullet and the stop-conditions table): when the
   blocking chain ends in a task on a later sprint or the Backlog board, the report says so — the
   blocker's sprint, and how many of this sprint's open rows wait on it. "Waiting" alone is not enough.
3. **Read the record, do not re-derive it.** The loop already says *"never hand-derive status"*; the
   later-sprint fact comes from `dashboard.sh`'s output, not from the driver re-reading briefs.
4. Whether `/fkit-task-ship-loop` needs the same is a question for the plan step — it drives one task,
   so it likely needs only a one-line mention when its task is the dependent. Say what the plan chose.

## Verification steps

1. The skill text names the new `drift` kind (as `0492` shipped it) at both points above, in the stop
   table as well as the step-1 bullet.
2. A dry read: given `dashboard.sh` output carrying the record for a fixture board, a reader following
   the skill would report the later-sprint blocker at the start of the run and at the deadlock stop.
   Show that output and the resulting report wording in the review.
3. Nothing else in the loop's behaviour changes: eligibility, ordering, and the skip memory are
   untouched (diff review).
4. `node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js` passes, and any
   test that pins the ship-loop's stop table passes or is updated with the reason stated.

## Notes

- **Depends on:** 0492 (it defines the `drift` record this loop reads).
- **Blocks:** nothing.
- Filed 2026-10-05 by a spawned `fkit-producer` on `fkit-lead`'s instruction, under the owner rulings
  recorded in `0492`. ⚠️ `P13` is append rank, NOT a merit ranking — append is also the owner's placement ruling
  (*"Sprint 10, at the end"*). **On merit this belongs directly below `0492`, where it is**, because it
  consumes `0492`'s record.
