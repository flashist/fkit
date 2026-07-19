# ADR-012: The skill lockdown is session-scoped; `skills:` frontmatter is dropped, not generated

**Date**: 2026-07-11
**Status**: accepted — **Decisions 3 and 4 superseded by [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]** (2026-07-16); §§1, 2 (structural-in-session half), 5 remain in force

**Supersedes (in part)**: [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] §Decision 2 and §Decision 5

> ⚠️ **Read this before trusting Decision 2's "advisory in a consult" language below.** [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] reopened Decisions 3 and 4 (their own pre-registered re-raise trigger was met) and adopted the `PreToolUse` skill-ownership hook — now **implemented and verified** ([[tasks/implement-pretooluse-skill-ownership-hook]]). Enforcement now follows the **real caller at any spawn depth**, so the "structural in a session, advisory in a consult" split this page draws **no longer describes current truth**. `CONSULT_SKILLS` (Decision 3) is retired. This file is kept intact as the historical record; **ADR-018 is the current ground truth for the consult-path question.**

## Context
ADR-010 locked every session to one role and claimed the lock was **structural**: *"Role separation is enforced structurally, not by instruction."* It also left one thing to the coder: `skills_for_role()` is the single source of truth, and the `skills:` frontmatter *"must be generated from it or dropped."*

Closing that established — **empirically, from live spawns** — that **the mechanism is not what ADR-010 assumed.**

### What the mechanism actually is
```
skill availability in ANY context (session or spawned consult)
  = all installed skills − the skillOverrides of the SESSION THAT LAUNCHED THE PROCESS

`skills:` frontmatter  →  inert; no effect on enforcement
```

**A consult's skill set is a function of the *caller's* role, not the consultee's.** Three independent spawns from a **coder** session, each reporting the *coder's* skills rather than its own:

1. A spawned `fkit-lead` was advertised **every** fkit skill, and the harness **accepted** its `Skill(fkit-status)` call — a **producer-owned** skill. **Only the `⛔ Owner:` prose banner in the skill body stopped it.**
2. A spawned `fkit-architect` reported the coder's set — none of its own five procedures.
3. A spawned `fkit-producer` saw the **coder's** skills and **could not see its own** (`initiate-project`, `task-done`, `task-cancelled`).

This matches the Claude Code docs: `skills:` controls **preloading only** — *"Subagents can still invoke unlisted project, user, and plugin skills through the Skill tool."* `skillOverrides` has **no per-subagent scoping**.

## Decision
1. **Drop the `skills:` frontmatter from all 7 agents.** It is inert. **Keeping it — even generated — would preserve a field that *looks* like the invariant and isn't.** `skills_for_role()` in `claude/fkit-claude.sh` is the **only** place role→skill ownership is expressed. **Do not re-add it.**
2. **State the lock's scope honestly.** It is **structural in a session** and **advisory in a consult**. The skill's `⛔ Owner:` banner is therefore **load-bearing, not decorative — it may not be deleted as "redundant."**
3. **`CONSULT_SKILLS` is the escape valve inheritance forces.** `fkit-survey-project` and `fkit-query` stay **on for every role**, because `/fkit-initiate-project` has the **producer** spawn the architect to run the survey — with it off, initiation could not run its own architecture survey. **The set is deliberately minimal; adding to it is a decision, not a convenience.**

## Consequences
- **The property that matters survives**: in a role *session* the lock is real, and reviewer independence rests on exactly that.
- **The accepted cost of `CONSULT_SKILLS`**: any role session can invoke `/fkit-survey-project` by name.
- **A finding must say which path it means.** *"The skill lock is only prompt-enforced"* is **false of a session** and **true of a consult**. Do not restate this as a blanket defect.
- **The only mechanism that could make per-role skill ownership real on the consult path is a `PreToolUse` gate on the `Skill` tool** — deferred, and **now priced**: decisions 2 and 3 exist *because* we don't have it.
- ⚠️ **Open question, and it decides whether this is even fixable:** does the `PreToolUse` hook payload expose the **calling subagent's identity**? **If it does not, the hook cannot discriminate by role, and the option is not merely deferred but *unavailable*.** This must be established before anyone plans the hook as the fix.

## Related
- [[systems/role-locked-sessions]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[systems/fkit]]
- [[tasks/reconcile-skill-ownership-source-of-truth]]
- [[systems/review-and-model-diversity]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[systems/testing-and-verification]]
- [[tasks/add-e2e-smoke-script-for-fkit-itself]]
- [[tasks/add-shared-instructions-layer-for-all-agents]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[tasks/record-pretooluse-skill-gate-adr-amendment]]
- [[tasks/implement-pretooluse-skill-ownership-hook]]
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the advisory `⛔ Owner:` banner is why a spawned producer is not a second judgment
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — this ADR is why the planned tester **structurally cannot verify fkit's own session lockdown**: a spawned subagent inherits the *caller's* skill overrides and would report a confident green on the caller's settings. **Do not scope the tester to it** — a real session test must shell out to a subprocess
- [[decisions/adr-029-stop-hook-enforces-turn-completion-contract]] — this ADR is why fkit **cannot fully test** the new `Stop` hook itself: a spawned subagent inherits the caller's settings, so session-scoped hook behaviour stays hand-verified
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — the advisory banner is why a spawned producer adds a role name, not a second judgment
