# Evolve `fkit-lead` into the orchestrating conductor (reverse the non-doer stance)

**Source**: `ai-agents/tasks/done/0110-evolve-fkit-lead-into-orchestrating-conductor/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0110 · priority 92 · owner `fkit-coder`

## Goal

Change **the agent definition only** — `claude/agents/fkit-lead.md` — from router to conductor, per [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]].

## Key Changes

**This edit is two things at once**, and the brief is explicit about which is which:

- **A stance reversal.** ADR-010 §Decision 3 deliberately made lead *"not a doer / no Write or Edit tools."* ADR-031 reverses it.
- **A prose correction of a live drift.** The *"no Write or Edit tools"* line was **already stale** — [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] relaxed tools for all six Claude-side roles, so lead had inherited Write/Edit long before this task.

**The conductor remit added:** given a goal, spawn whatever typed `fkit-<role>` subagent is needed, assign one bounded unit of work, await the return, relay any surfaced decision to the owner, and advance — spawn the next role, or report done.

**Three driver disciplines, carried as prose:**

1. **Delegate, never substitute.** The conductor spawns each role's actual work into its own fresh typed subagent; it **never writes source and never reviews**. A conductor that reviews or designs "just this once" breaks the separation-of-authority thesis.
2. **Hold the owner channel.** Only the lead session has `AskUserQuestion`; spawned workers **return** questions, they do not ask.
3. **Spawn typed `fkit-<role>` subagents, never generic helpers** — a non-fkit subagent carries no fkit identity and is denied **every** `fkit-*` skill by the ADR-018 hook.

The router remit was **kept**: lead drives when asked to *do*, points when asked to *point*.

## Outcome

**Done, agent-closed.** Verified: no current "not a doer" / "no Write or Edit tools" assertion remains (the phrase survives only as a historical note in the ADR-031-reversal context); the router sections are intact; all three driver disciplines are present; **exactly one source file changed**, as scoped. The reviewer independently confirmed fidelity to ADR-031's Decisions 1–3 and the honesty clause. Nothing committed — the brief required shipping 0110 together with 0111 and 0112.

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the decision implemented
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — the design (hard dependency)
- [[tasks/build-fkit-sprint-ship-loop-skill]] · [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] · [[tasks/update-launcher-menu-help-for-conductor]] · [[tasks/amend-project-brief-for-lead-conductor]] · [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — everything this blocks
- [[tasks/retire-team-room-in-docs-and-agent-definitions]] — later rewrites the same file's "team room" framing
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] · [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] · [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]
- [[systems/fkit]] · [[systems/role-locked-sessions]]
