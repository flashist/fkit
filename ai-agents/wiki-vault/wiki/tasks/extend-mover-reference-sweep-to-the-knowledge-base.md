# Extend the task movers' reference sweep to `knowledge-base/` — and guard the next-ADR-number derivation

**Source**: `ai-agents/tasks/done/0036-extend-mover-reference-sweep-to-the-knowledge-base/brief.md`
**Status**: done — ⚠️ **`(agent-closed — not owner-verified)`**
**Sprint/Tag**: Sprint 2 · ID **0036** · priority 81 · owner fkit-coder

## Goal
Close a **live defect found by observation, not by reading.** Both movers sweep for inbound references after moving a brief so links get re-pointed instead of rotting — but the sweep grepped only `ai-agents/sprints/ ai-agents/tasks/`, **not `ai-agents/knowledge-base/`**. Every ADR and report that back-links a task brief is outside it, so the movers **leave rotted knowledge-base links behind on every close, by design.** While closing task 74 and the tester decision, five stale links needed repair — **three of the five were in `knowledge-base/`.** Same class as tasks 21/22.

## Key Changes
- **Part A:** both `fkit-task-done` and `fkit-task-cancelled` sweep `knowledge-base/` too — the recursion was thought through, the **root set** was not. `fkit-task-cancelled` had the gap in two places (the step-4 sweep and the later dependency search).
- **Part B — the next-ADR-number guard (added 2026-07-19, owner ruling).** ⚠️ **This guard exists because a collision actually happened on 2026-07-19** — a new ADR-029 was recorded on a number already in use, forcing the stop-hook ADR to renumber to ADR-030 and leaving the vault pointing at the wrong decision. The ADR-number derivation looked in too few places. **It is not hypothetical hardening and must not be deleted later as speculative.**

## Outcome
Done, agent-closed. Part A stops *new* knowledge-base rot; the accumulated rot it had already caused is cleared by [[tasks/repair-task-links-outside-the-wiki-after-migration]] (task 77). **Part B is the first structural defence against the ADR-number-reuse failure** the vault has flagged repeatedly — though it guards the *knowledge-base* allocation, not the vault's own ingest; a lint-side cross-check remains an open owner question.

## Related
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] · [[tasks/repair-broken-links-in-closed-sprint-plans]] — tasks 21/22, the same link-rot class one iteration earlier
- [[tasks/repair-task-links-outside-the-wiki-after-migration]] — task 77, which cleared the rot this defect had already caused
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the ADR whose number collision motivated Part B
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — the ADR forced to renumber by that collision
- [[systems/knowledge-base-structure]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
