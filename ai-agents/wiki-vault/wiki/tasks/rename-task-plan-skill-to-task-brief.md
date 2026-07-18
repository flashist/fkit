# Rename the producer's `fkit-task-plan` skill to `fkit-task-brief`

**Source**: `ai-agents/tasks/done/rename-task-plan-skill-to-task-brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 50

## Goal
Rename the producer's `/fkit-task-plan` (scope a description into backlog briefs) to `/fkit-task-brief` — it was the coder's `/fkit-plan-task` (read a brief, produce an implementation plan) with **the same two words swapped**, at opposite ends of the task lifecycle. The new name says what the skill produces: briefs.

## Key Changes
- **Atomic on purpose:** the skill directory, `claude/skills-for-role.sh` (the ownership source of truth), and the ADR-018 `PreToolUse` hook allowlist flip together — a half-done rename means the producer loses the skill entirely (old name gone, new name not allowed).
- Live functional references updated: launcher, `fkit-producer.md`, `fkit-team`/README listings, and the conventions pair (`evidence-before-assertion.md`, `task-status-vocabulary.md`) in **both** homes — live `ai-agents/` and `claude/scaffold/` (the owner's dual-home parity ruling).
- **Every `task-plan` grep hit read, not batch-replaced** — half the vocabulary belongs to the coder's un-renamed `plan-task`. The coder's skill is byte-untouched.
- **History stays frozen:** closed plans, done briefs, dated reports, ADRs keep the old name — true when written.

## Outcome
**Done.** `/fkit-task-brief` runs in a producer session; the hook allows the producer and denies other roles under the new name; tests green. Wiki impact was pre-filed as task 51 (this sync applies the rename to living vault pages; historical pages keep the old name with a note).

## Related
- [[tasks/add-task-plan-skill-to-producer]] — task 14, which created the skill under its original name
- [[tasks/reconcile-skill-ownership-source-of-truth]] — why the ownership flip must be atomic
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that had to flip with it
- [[systems/fkit]] · [[systems/role-locked-sessions]]
- [[tasks/sprint-2-remove-omnigent]]
