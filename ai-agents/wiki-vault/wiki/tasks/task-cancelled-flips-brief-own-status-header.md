# Make `/fkit-task-cancelled` flip the moved brief's own `## Status` header

**Source**: `ai-agents/tasks/done/0089-task-cancelled-flips-brief-own-status-header/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 35

## Goal
The same gap as [[tasks/task-done-flips-brief-own-status-header]] (task 34), on the other mover: `/fkit-task-cancelled` flipped the sprint-plan cell to `⛔ Cancelled (YYYY-MM-DD) — <reason>` and moved the brief into `cancelled/`, but **never updated the moved brief's own `## Status` field** — so a cancelled brief kept reading `🔲 Backlog` internally while the board read `⛔ Cancelled`.

Split from task 34 because the two skills are separate files, each independently shippable, and the cancelled marker carries **extra structure** — a mandatory date and reason — that the brief header must reproduce faithfully, a distinct correctness requirement worth its own verification.

## Key Changes
- Extended `/fkit-task-cancelled` so that after moving the brief into `cancelled/`, it also sets the brief's `## Status` to the **full canonical cancelled marker** — `⛔ Cancelled (YYYY-MM-DD) — <reason>` — using the **same date and reason** written into the board. A bare `⛔ Cancelled` in the brief is nonconformant (the reason is mandatory per the vocabulary).
- **Idempotent** — re-running leaves the section byte-identical: one marker, the original date preserved, no duplicated reason.
- **Missing-section case flagged, not invented**; **only the brief just moved** is touched (no historical sweep); **no commit.**
- **Canonical source is `claude/skills/fkit-task-cancelled/SKILL.md`** (no scaffold copy; `.claude/` copy is gitignored). Skill-text only.

## Outcome
**Done**, co-landed with task 34 — they share a design (idempotent header write, missing-section flag). The extra requirement here was faithful reproduction of the date+reason; getting it out of sync with the board would create the very nonconformance this closes. Reconciling any pre-existing cancelled briefs was the owner's call and out of scope.

## Related
- [[tasks/task-done-flips-brief-own-status-header]] — the sibling `/fkit-task-done` fix
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — task 22, the same mover-drift class
- [[systems/knowledge-base-structure]] — the task-status vocabulary, where `⛔ Cancelled` requires a reason
- [[tasks/sprint-2-remove-omnigent]]
