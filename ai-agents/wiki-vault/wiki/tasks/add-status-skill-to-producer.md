# Add a `status` skill to fkit-producer

**Source**: `ai-agents/tasks/done/0011-add-status-skill-to-producer/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 16

## Goal
Give the producer a procedure for answering *"what's the status?"* — so the format stops being improvised every time.

## Key Changes
**The improvisation had already produced a concrete failure.** On 2026-07-11 a producer status report claimed *"0 in progress · 14 not started"* — **when no `In progress` status existed in the project at all**, and every row simply read `Backlog`.

> **The report looked precise and was fabricated.** A skill exists to stop that recurring.

**The format was already designed and owner-approved — the brief explicitly forbade redesigning it.** Two documents are the spec: `conventions/status-report-format.md` and `conventions/task-status-vocabulary.md`.

The standard being aimed at: **answer like a producer being asked in person, not like a dashboard being rendered.** *"A real producer doesn't recite the board."*

## Outcome
Done. `/fkit-status` is a producer-owned skill reading the two conventions as **live contracts**.

The sibling of [[tasks/add-task-plan-skill-to-producer]], on the same logic: **formalize what the producer already does by hand into a repeatable, sanctioned procedure.** Its dependence on `conventions/` is exactly why [[tasks/repair-knowledge-base-paths-in-product-source]] mattered — a skill that can't find its contract **silently falls back to an inline copy**.

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-task-plan-skill-to-producer]]
- [[tasks/enforce-task-status-vocabulary]]
- [[tasks/repair-knowledge-base-paths-in-product-source]]
- [[systems/knowledge-base-structure]]
- [[tasks/stop-agents-asserting-unchecked-repo-state]]
- [[tasks/design-deterministic-dashboard-for-fkit-status]]
- [[tasks/add-full-board-switch-to-fkit-status]]
- [[tasks/remove-output-variants-from-fkit-status]] — the one-output reversion applied to this skill
- [[tasks/filter-fkit-status-board-to-open-tasks]] — the board filtered to open work
- [[tasks/report-backlog-board-in-fkit-status-on-request-only]] — `Backlog` added as a resolvable named target
