# Implement the coder's `task-ship-loop` skill

**Source**: `ai-agents/tasks/done/0055-implement-task-ship-loop-skill/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 53

## Goal
Build exactly the owner-approved design from task 52 ([[tasks/design-task-ship-loop-skill]]): the coder's autonomous brief-to-done loop — plan → build → verify → stateful review → ready-for-done — with a single up-front plan approval, stops only for "important questions" and the owner-only done-gate. The approved spec wins over the brief wherever they differ; starting before the owner approval was explicitly forbidden.

## Key Changes
- The skill directory `claude/skills/fkit-task-ship-loop/` with the approved loop and the `⛔ Owner: the coder` banner.
- Registered in the coder's list in `claude/skills-for-role.sh` — so the session lockdown and the ADR-018 `PreToolUse` hook allow the coder and deny everyone else; hook suite proves both directions.
- Argument contract per the one-skill-one-output convention: the task-brief path is an operand; no output variants.
- Writes the ADR-020 per-task artifacts — since the task-folder migration ([[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]], 2026-07-21) these are `plan.md` and `worklog.md` **inside the task folder**, not the former top-level `plans/<task-id>.md` / `worklogs/<task-id>.md`.

## Outcome
**Done** — skill live, registered for the coder, hook suite green (per the sprint board close-out). The loop is **session-only by design** and refuses spawned/headless invocation.

⚠️ **Three claims on this page went stale and are corrected here (lint 2026-07-19; sync 2026-07-19):**
- **The loop now closes its own task.** Task 64 ([[tasks/implement-spawned-invocation-for-task-movers]]) made the loop's terminal act a self-close writing `✅ Done (agent-closed — not owner-verified)`. The earlier statement *"it still does not move task files itself"* is **no longer true.**
- **The done-gate is gone.** [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] removed it — any role but the adversarial reviewer may run either mover, **including the coder closing its own task**. ADR-019 sold this loop's autonomy on **two** human gates; **only the plan gate remains**, and it is the one unremovable checkpoint. ⚠️ **The composition is the concerning part**: plan approval, then unattended build → verify → review → judge → close. That is ADR-025's **L1 (the confused optimist) at full strength** — the loop can turn a row green on its own judgment with no human having looked. The loop's prose stops short of self-closing a *degraded* run (no Codex pass, red verification, unresolved residual) and never self-cancels, but those are **loop-local conservatism, not guarantees ADR-025 provides** — nothing enforces them.
- **Tasks 59/60 are cancelled, not backlog, and the feasibility WAS measured.** [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] established that a timed auto-proceed **is** buildable (a real AFK timeout exists on Claude Code 2.1.214) and was **declined on cost**, not feasibility. The first investigation verdict said "not runtime-expressible" and was **wrong** — do not repeat it.

## Related
- [[tasks/design-task-ship-loop-skill]] — task 52, the approved design this implements
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the loop contract
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the artifacts the loop writes
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that gates the new skill
- [[tasks/record-one-skill-one-output-convention]] — the argument-contract rule it follows
- [[systems/fkit]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — the timeout follow-up, declined on cost; the loop is unchanged
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — removes the done-gate this loop stopped at; the plan-gate survives
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64, which made this loop close its own task
- [[tasks/restructure-coder-report-summary-then-interview]] — the coder's general report contract; this loop's own contract wins inside the loop
- [[tasks/design-ship-loop-timeout-auto-proceed]]
- [[tasks/implement-ship-loop-timeout-auto-proceed]]
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — task 63, whose ruling removed this loop's done-gate
