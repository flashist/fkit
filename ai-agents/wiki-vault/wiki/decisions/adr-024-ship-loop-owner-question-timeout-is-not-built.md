# ADR-024: The ship-loop's owner-question timeout is feasible but NOT built — declined on cost, not feasibility

**Date**: 2026-07-18
**Status**: accepted
**Harness pinned**: feasibility facts measured on **Claude Code 2.1.214**

## Context
The owner asked (2026-07-18) that `fkit-task-ship-loop`'s owner-question stops stop blocking forever: present options with one marked *recommended*, and if the owner is silent ~30s, proceed on it. He said *"if possible"* — feasibility was explicitly part of the question.

**The investigation went through two feasibility verdicts, and the first was wrong.** Recorded so the mistake is not repeated:

- **First verdict — "not runtime-expressible" — WRONG.** It reasoned from the turn model plus the `AskUserQuestion` per-call schema (which genuinely has **no `timeout` parameter**) and concluded a timed auto-proceed could not be built. This is the exact *"measure the binary, don't reason it"* trap the brief warned of ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] precedent) — and it reproduced it.
- **Corrected verdict — it IS feasible.** Claude Code has a settings/env-level **AFK timeout**: `askUserQuestionTimeout` in *user* settings (verified present on 2.1.214, value `"never"`), plus `CLAUDE_AFK_TIMEOUT_MS` / `CLAUDE_AFK_COUNTDOWN_MS`. On timeout the runtime shows a countdown and **auto-continues on whichever option is pre-selected**.

**But the safe version carries real cost**, shaped by four constraints: the timeout is **session-global, not per-question** (so it would fire on the plan-approval gate and the done-gate, which must never auto-proceed); the setting is **user-scope only** (a repo cannot set it, so fkit would need a dedicated ship-loop launch mode); "recommended" must be expressed as pre-selection; and the mechanism's own guidance warns against short-timeouts on flows gating irreversible actions (a reported case auto-processed 160 items on a timed-out empty answer).

The safe design surviving all four: a dedicated launch arming the timer for that session only, mid-loop questions timed, **plan-gate and done-gate re-expressed as plain waits** so the global timer never fires on them. **The owner weighed it and declined.**

## Decision
1. **No change to `fkit-task-ship-loop`.** Owner-question stops continue to wait for the owner. No AFK timer, no launch mode, no gate re-expression.
2. **The decision is on cost/complexity, NOT feasibility.** Recorded explicitly so neither error recurs: not *"it can't be done"* (it can), and not *"just add a 30s timeout, it's easy"* (the safe version is a launch mode + gate re-expression + a version-scoped, user-scope, session-global timer).
3. The plan-gate and done-gate exclusions stand regardless — never in scope, and the mechanism's own guidance confirms why.
4. Task 59 cancelled; task 60 (implementation) never created.

## Consequences
- No new launch mode, no gate re-expression, no dependency on a version-scoped harness timer. The two owner gates keep their guarantees trivially.
- Both the **corrected feasibility fact** and the **cost** are on record.
- **Negative, accepted unmitigated: the ship-loop still blocks forever on an owner question if the owner is away.** That was the owner's original complaint.
- **Re-raise only if** the cost equation changes — a future Claude Code exposing a **per-question or per-skill** timeout scope, or project-scope config of `askUserQuestionTimeout` (re-check against the binary; facts pinned to 2.1.214) — **or** unattended ship-loop operation becomes a stated need, not a convenience. **The stall being merely annoying is not the trigger; a concrete blocked workflow is.** Do **not** re-raise "it can't be built", "just add a timeout, it's easy", or any auto-proceed on the done-gate/plan-gate.

## Related
- [[tasks/design-ship-loop-timeout-auto-proceed]] — task 59, cancelled by this ADR
- [[tasks/implement-ship-loop-timeout-auto-proceed]] — task 60, cancelled with its parent
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the ship-loop's autonomy model and owner gates, **unchanged** by this decision
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the "measure the seam, don't reason it" precedent this investigation first violated, then honored
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — which later removed the done-gate this ADR protected
- [[tasks/implement-task-ship-loop-skill]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[systems/role-locked-sessions]]
- [[tasks/investigate-askuserquestion-availability-for-agents]]
- [[tasks/restructure-coder-report-summary-then-interview]]
- [[tasks/stop-agents-asserting-unchecked-repo-state]]
