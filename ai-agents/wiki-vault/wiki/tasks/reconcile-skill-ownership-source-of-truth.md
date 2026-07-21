# Reconcile the skill-ownership source of truth

**Source**: `ai-agents/tasks/done/0063-reconcile-skill-ownership-source-of-truth/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 6 (Phase 3 — independent)

## Goal
Collapse the **two disagreeing declarations** of role→skill ownership into one.

## Key Changes
Ownership was declared in two places that **already diverged**:

1. `skills_for_role()` in `claude/fkit-claude.sh` — drove `skillOverrides` for **interactive sessions**.
2. The `skills:` frontmatter in `claude/agents/*.md` — believed to govern **spawned consults**.

The shell granted every role `fkit-team`; **six of seven agent files omitted it.** Because the two governed *different* code paths, the disagreement broke nothing yet — *which is exactly why it was worth closing while it was cheap and boring, rather than after it had quietly become a real bug.* **The skill lockdown is the flavor's central invariant; two sources of truth for an invariant is one too many.**

The brief left the call open — *generate* the frontmatter from the shell, or *drop* it — and required establishing **how the consult spawn path actually resolves skills** first.

## Outcome
Done, and it **changed the architecture's understanding of its own invariant.** Investigating the spawn path established **empirically, from live spawns**, that `skills:` frontmatter is **inert** — Claude Code treats it as a *preload hint*, not an allowlist — and that a consult inherits the **caller's** overrides, not its own.

**So the frontmatter was dropped, not generated.** Keeping it — even generated — *"would have preserved a field that looks like the invariant and isn't."*

This produced [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]], which corrected two of ADR-010's decisions. **A reconciliation task that ended up revising the decision it was implementing.**

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[systems/role-locked-sessions]]
- [[tasks/add-full-board-switch-to-fkit-status]]
- [[tasks/rename-task-plan-skill-to-task-brief]] — a later atomic flip of the ownership source of truth
