# Implement the coder's `task-ship-loop` skill

**Source**: `ai-agents/tasks/done/implement-task-ship-loop-skill.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 53

## Goal
Build exactly the owner-approved design from task 52 ([[tasks/design-task-ship-loop-skill]]): the coder's autonomous brief-to-done loop — plan → build → verify → stateful review → ready-for-done — with a single up-front plan approval, stops only for "important questions" and the owner-only done-gate. The approved spec wins over the brief wherever they differ; starting before the owner approval was explicitly forbidden.

## Key Changes
- The skill directory `claude/skills/fkit-task-ship-loop/` with the approved loop and the `⛔ Owner: the coder` banner.
- Registered in the coder's list in `claude/skills-for-role.sh` — so the session lockdown and the ADR-018 `PreToolUse` hook allow the coder and deny everyone else; hook suite proves both directions.
- Argument contract per the one-skill-one-output convention: the task-brief path is an operand; no output variants.
- Writes the ADR-020 per-task artifacts (`plans/<task-id>.md`, `worklogs/<task-id>.md`).

## Outcome
**Done** — skill live, registered for the coder, hook suite green (per the sprint board close-out). The loop is **session-only by design** and refuses spawned/headless invocation; it does **not** move task files (the done-gate stays owner-invoked). Follow-up already filed from use: tasks 59/60 (timeout-auto-proceed for owner questions, design-first — feasibility unmeasured) are backlog.

## Related
- [[tasks/design-task-ship-loop-skill]] — task 52, the approved design this implements
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the loop contract
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the artifacts the loop writes
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that gates the new skill
- [[tasks/record-one-skill-one-output-convention]] — the argument-contract rule it follows
- [[systems/fkit]]
- [[tasks/sprint-2-remove-omnigent]]
