# Reopen ADR-012 Decisions 3 & 4 — record the `PreToolUse` skill-gate hook

**Source**: `ai-agents/tasks/done/0065-record-pretooluse-skill-gate-adr-amendment/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 42

## Goal
Record the ADR that reopens [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] Decisions 3 and 4 and adopts the `PreToolUse` skill-ownership hook. This is the **design-then-implement** split (the 40/41 pattern): task 42 records the decision; [[tasks/implement-pretooluse-skill-ownership-hook]] (task 43) builds it and must not start before the ADR is reviewed with the owner.

## Key Changes
The trigger was a **live bug** found 2026-07-16: a coder session spawning `@fkit-reviewer` for a stateful review failed with `Skill fkit-stateful-review is disabled … in skillOverrides settings` — a **second instance** of the exact bug class ADR-012 hand-patched with `CONSULT_SKILLS`. `skillOverrides` is one flat process-wide setting inherited by every subagent at any depth. ADR-012's own pre-registered re-raise trigger was confirmed met: verified against the running Claude Code binary that the `PreToolUse` payload **does** expose the real caller identity (`agent_type`/`agent_id`) at any spawn depth.

The task recorded — it did not invent — the "hook-flip" design settled in three architect consults that day: drop the `skillOverrides` off-list, add a `PreToolUse` deny keyed on `skills_for_role()`, retire `CONSULT_SKILLS`, and make **fail-closed** a hard requirement (Claude Code hooks fail open by default). It also settled the menu-visibility question and recorded the rejected prose-only-self-refusal alternative by name.

**Owner: fkit-architect**, via `/fkit-record-decision`. The producer scoped; the architect wrote the decision — same division as the shared-instructions tombstone.

## Outcome
**Done** → [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]. The analysis was already complete; this was the recording step. It unblocked the implementation (task 43).

## Related
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the ADR this task recorded
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — the ADR it reopens
- [[tasks/implement-pretooluse-skill-ownership-hook]] — the sibling implementation this blocks
- [[systems/role-locked-sessions]]
- [[tasks/sprint-2-remove-omnigent]]
