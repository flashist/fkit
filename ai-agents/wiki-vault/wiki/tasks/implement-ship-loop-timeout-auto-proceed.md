# Implement the ship-loop timeout-auto-proceed

**Source**: `ai-agents/tasks/cancelled/implement-ship-loop-timeout-auto-proceed.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 2 — priority 60. Cancelled 2026-07-18 — parent design task 59 declined.

## Goal
Build the ship-loop's timed auto-proceed from the approved design.

## Key Changes
None — no work was started. Pre-filed as the implementation half of a design-then-implement pair, gated on the parent design's approval.

## Outcome
**Cancelled without being started.** The parent design ([[tasks/design-ship-loop-timeout-auto-proceed]], task 59) was **declined on cost**, so there was no approved design to implement. Per [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] Decision 1: no change to `fkit-task-ship-loop` at all — no AFK timer wired in, no dedicated launch mode, no gate re-expressed.

**Note the ADR's framing: the feature is buildable.** It was declined on cost/complexity, not feasibility — so a future re-raise starts from *"is the cost equation different now?"*, not from *"can this be done?"*

## Related
- [[tasks/design-ship-loop-timeout-auto-proceed]] — task 59, the declined parent
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — the ruling
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] · [[tasks/implement-task-ship-loop-skill]] — the loop left unchanged
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
