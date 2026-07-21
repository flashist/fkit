# Design the coder's `task-ship-loop` skill — the autonomous brief-to-done loop

**Source**: `ai-agents/tasks/done/0031-design-task-ship-loop-skill/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 52

## Goal
Design (not build) a coder skill that takes a task from brief to *done* with **minimal owner involvement** — *"run the loop, walk away, trust the coder to decide, only important questions asked of me."* The owner sketched a 13-step loop and ruled the sketch **not final**: the coder/architect/producer refine it together and **the owner approves the steps before implementation** — the design-then-implement split (the 40/41, 42/43 pattern). Blocks task 53 (implementation) — hard.

## Key Changes
The design (deliverable: `knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md`, rev 3, **owner-approved**) resolved the five flagged conflicts as owner-facing proposals:
- **Done-gate:** the loop **stops** at the gate and the owner closes via the normal `/fkit-task-done`; relayed-consent (spawning a producer on a "Yes") **rejected** — it violates "do not tell anyone else to move a task."
- **Autonomy vs the coder's owner-present contract:** autonomy becomes the loop's **built-in default** after a single plan approval — a scoped, deliberate **amendment** to `fkit-coder.md`, not drift.
- **Sub-agents can't ask the owner:** all owner contact funnels through the coder session; no task-39 dependency.
- **Consult envelope:** the loop is hop 0, its consults hop 1 — no new topology.
- Built **on** the ADR-018 hook (coder → reviewer spawn works).

A **Codex adversarial pass** (model diversity intact) was decisive: it killed rev 1's headline — narrowing `fkit-process-stateful-review`'s gate via a cross-skill note was **unenforceable** (no runtime loop-context signal; `CORRECT` ≠ mechanical) — and its findings X2–X7 shaped the durable design (re-verify after review fixes, durable per-task artifacts, honest status invariants). The autonomous class is bounded by fix **shape** + an obvious-winner rule, not verdict.

## Outcome
**Done** (owner-approved, 2026-07-17). Spawned two ADRs — [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] (the loop contract & consent model) and [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] (the per-task `plans/` + `worklogs/` artifacts). Task 53 ([[tasks/implement-task-ship-loop-skill]]) implemented exactly this spec and is now Done. *(The 2026-07-17 sync's uncommitted-working-tree caveat is resolved — the brief move and board flip are committed and re-confirmed.)*

## Related
- [[tasks/implement-task-ship-loop-skill]] — task 53, the implementation of this spec
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the loop contract this design produced
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the artifacts the loop writes
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook the loop builds on
- [[systems/review-and-model-diversity]] — the Codex adversarial pass that reshaped the design
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the consult envelope the loop fits within
- [[tasks/sprint-2-remove-omnigent]]
