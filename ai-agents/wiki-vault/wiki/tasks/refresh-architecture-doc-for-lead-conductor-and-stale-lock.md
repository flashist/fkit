# Refresh architecture.md for the lead conductor + fix the stale §5.2 lock description

**Source**: `ai-agents/tasks/done/0115-refresh-architecture-doc-for-lead-conductor-and-stale-lock/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0115 · priority 97 · owner `fkit-architect`

## Goal

Two `architecture.md` fixes bundled because they touch the same file and the same subject — the lead role, and the lock mechanism.

## Key Changes

**(a) Lead's nature.** The role description and skill row now describe the orchestrating conductor (spawns/drives roles, holds the owner channel, relays owner decisions live) with the `fkit-sprint-ship-loop` skill on its row — **nature changed, count unchanged**.

**(b) The stale-lock fix — the one that was not cosmetic.** `architecture.md` §5.2 still described the role lock as a `skillOverrides` "off" list plus a `CONSULT_SKILLS` exception — **the pre-ADR-018 mechanism, retired**. The live lock is the `PreToolUse` skill-ownership hook keyed on the real invoking agent's `agent_type` at any spawn depth.

> **This stale description is the exact fact that decided the conductor's feasibility answer**, which is why the design refused to treat correcting it as optional and folded it into this task.

The correction rewrote the lock's scope formula from *"all installed skills − the `skillOverrides` of the session that launched the process"* to *"ALLOWED ⇔ `skills_for_role(agent_type of the REAL invoking agent)` owns it"*, and re-stated the consult path as **structural**, superseding ADR-012 §2's "advisory in a consult." It also recorded ADR-018's two accepted costs (a non-owned skill stays *visible* and is denied only on invocation; a **non-fkit** subagent is denied every `fkit-*` skill including `fkit-query`, fail-closed by design), retired the `CONSULT_SKILLS` escape-valve description with a **do not re-add** note, and closed §9.3 and open question 1 — the *"does the hook payload expose the caller's identity?"* question — as **resolved**, kept as a closed pointer so it is not reopened.

**Three-way coordination on one file**, all flagged in the brief: this task owns lead's prose and §5.2; [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] owns the skill-ownership mirror row; [[tasks/revert-task-movers-to-producer-only]] owns the mover-ownership rows. None was to revert another.

## Outcome

**Done, agent-closed.** Verified against the tree this sync (2026-07-26): `architecture.md` is dated 2026-07-23, describes lead as *"lead + orchestrating conductor,"* counts **25 skills** (was 21), states there is *"no orchestrator **daemon**"* with the conductor explicitly noted as an in-session driver rather than a counter-example, describes the ADR-018 hook mechanism in §5.2, cites `skills-for-role.sh` as the source-of-truth location, and carries the producer-only mover rows from ADR-033.

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the live mechanism the doc now describes
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — §2 superseded by the corrected description
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the mover rows in the same file
- [[tasks/amend-project-brief-for-lead-conductor]] — the sibling product half
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] · [[tasks/revert-task-movers-to-producer-only]] — the two co-editors of this file
- [[tasks/refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role]] — the prior refresh
- [[tasks/implement-pretooluse-skill-ownership-hook]]
- [[systems/role-locked-sessions]] · [[systems/fkit]] · [[systems/knowledge-base-structure]]
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — Evolve `fkit-lead` into the orchestrating conductor (reverse the non-doer stance)
