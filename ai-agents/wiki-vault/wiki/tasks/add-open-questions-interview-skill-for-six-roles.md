# Add the `/fkit-open-questions-interview` skill for the six Claude-side roles

**Source**: `ai-agents/tasks/done/add-open-questions-interview-skill-for-six-roles.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 70

## Goal
A skill — *"If there are any open questions, interview me about them."* It sweeps the session for questions put to the owner and left unanswered, then interviews the owner about them.

## Key Changes
Three owner rulings, settled at scoping and not to be reopened:
1. **Source = the current session's history only.** Not the sprint plan, not briefs, not docs. Questions the owner **partially** answered count — the unanswered remainder is still open.
2. **Scope = the six Claude-side roles.** `fkit-adversarial-reviewer` is excluded: Codex-run, restricted allowlist ([[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]), **no interactive channel**. This is the task-39 finding applied — *"all agents" excluding the second model is the structural reality*, not an oversight, and no ADR change was needed.
3. **Interview only.** Answers live in the conversation; **zero write surface**.

- **`claude/skills/fkit-open-questions-interview/SKILL.md`** — sweep, dedup, and if none found **say so and stop; never invent a question**.
- **The ADR-021 seam is designed in, not discovered later:** `AskUserQuestion` is session-only, so the skill interviews in a session (batched, ≤4 per call) and **degrades in a spawned consult** to listing the unanswered questions in its reply — the existing consult pattern.
- Registered for the six roles in `skills_for_role()`, enforced by the task-43 `PreToolUse` gate, with six-allow / one-deny tests.

## Outcome
Done — skill dir, registration and tests landed as one unit (a registered skill with no file, or a file no role may run, ships nothing). fkit's skill count goes 22 → 23.

## Related
- [[tasks/add-dumb-down-skill-for-six-roles]] — task 72, the sibling six-role skill of the same week; same registration shape, **no ADR-021 seam** because it needs no owner channel
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the session/consult seam this skill degrades across
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — why the adversarial reviewer is excluded
- [[tasks/implement-pretooluse-skill-ownership-hook]] — task 43, the gate that enforces the six-role registration
- [[tasks/investigate-askuserquestion-availability-for-agents]] — task 39, whose "all agents excludes the second model" finding is applied here
- [[systems/role-locked-sessions]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[tasks/restructure-coder-report-summary-then-interview]]
