# Design a timeout-auto-proceed for the ship-loop's owner questions

**Source**: `ai-agents/tasks/cancelled/design-ship-loop-timeout-auto-proceed.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 2 — priority 59. Cancelled 2026-07-18 — declined on cost per ADR-024.

## Goal
Stop `fkit-task-ship-loop`'s owner-question stops from blocking forever: present options with one marked *recommended*, and if the owner is silent for ~30s, proceed on it. The owner said *"if possible"* — feasibility was explicitly part of the question.

## Key Changes
The investigation was completed and is retained. **It produced two feasibility verdicts, and the first was wrong** — recorded so the mistake is not repeated:

- **First verdict — "not runtime-expressible" — WRONG.** Reasoned from the turn model and `AskUserQuestion`'s per-call schema (which genuinely has no `timeout` parameter). **This reproduced the exact "measure the binary, don't reason it" trap the brief warned of** (the ADR-021 precedent).
- **Corrected verdict — feasible.** Claude Code has a settings/env-level **AFK timeout** (`askUserQuestionTimeout`, verified present on 2.1.214, plus `CLAUDE_AFK_TIMEOUT_MS` / `CLAUDE_AFK_COUNTDOWN_MS`), which auto-continues on the **pre-selected** option after a countdown.

The safe design that survived all four constraints — a dedicated ship-loop launch arming the timer for that session only, mid-loop questions timed, **plan-gate and done-gate re-expressed as plain waits** so the session-global timer never fires on them.

## Outcome
**Cancelled — the owner weighed the safe design and declined it on cost, not feasibility.** A new launch mode plus gate re-expression plus reliance on a session-global, user-scope timer is more machinery and more moving safety-parts than the convenience warrants. Recorded as [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]]; its implementation sibling [[tasks/implement-ship-loop-timeout-auto-proceed]] (task 60) was cancelled with it.

**The ship-loop still blocks forever on an owner question if the owner is away** — the original complaint, accepted unmitigated.

## Related
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — the ruling that cancelled this task
- [[tasks/implement-ship-loop-timeout-auto-proceed]] — task 60, cancelled with this parent
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the precedent this investigation first violated, then honored
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] · [[tasks/implement-task-ship-loop-skill]] — the loop and its gates, unchanged
- [[tasks/investigate-askuserquestion-availability-for-agents]] — task 39, the seam-measuring precedent
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
