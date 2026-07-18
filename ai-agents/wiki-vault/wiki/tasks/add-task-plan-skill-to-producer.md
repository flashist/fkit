# Add a `task-plan` skill to fkit-producer

**Source**: `ai-agents/tasks/done/add-task-plan-skill-to-producer.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 14 (carried from Sprint 1, rescoped)

## Goal
Give the producer a procedure for **writing a task brief** — the thing it is asked to do most, and the one thing it had no procedure for.

## Key Changes
The producer had `initiate-project` / `task-done` / `task-cancelled` — **the *create* leg of the task lifecycle was missing.** This formalizes work the producer already did by hand every time a task was scoped in conversation.

**Owner's decomposition rule, which widened the scope:**

> *"All tasks should be split into the smallest possible shippable tasks — if a part can be developed, tested and shipped separately, it's worth a sub-task. Sometimes the producer decides alone; sometimes they consult the architect to clarify the technical scope."*

**The test is independent shippability, not size.** And: **splits must carry their dependency links, or the split has lost information.**

## Outcome
Done. `/fkit-task-plan` became a producer-owned skill — **since renamed to `/fkit-task-brief`** (Sprint 2 task 50, [[tasks/rename-task-plan-skill-to-task-brief]]) to break the name collision with the coder's `/fkit-plan-task`.

The rule it encodes is visible in Sprint 2's own shape — most clearly in the **21 / 22 split**, where the one-off link repair and the process fix that stops the rot recurring were deliberately made **separate tasks**, on the grounds that *"landing only 21 buys nothing durable."*

## Related
- [[tasks/rename-task-plan-skill-to-task-brief]] — the later rename to `/fkit-task-brief`
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/add-status-skill-to-producer]]
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]]
- [[systems/fkit]]
