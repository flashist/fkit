# Wire `fkit-sprint-ship-loop` into `skills_for_role()` + the four mirrors (same commit)

**Source**: `ai-agents/tasks/done/0112-wire-lead-sprint-ship-loop-skill-ownership-and-mirrors/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0112 · priority 94 · owner `fkit-coder`

## Goal

Register the new skill as **lead-owned**, so the ADR-018 hook allows lead to run it and denies every other role.

## Key Changes

**One line of authority, four human copies.** `skills_for_role()` in `claude/skills-for-role.sh` stays the **single source of truth** — no second list — and the hook then allows/denies with no further change. `lead` gains `fkit-sprint-ship-loop` **and nothing else** (spawns are Agent-tool calls, not skills).

**The four human mirrors must move in the same commit**, because this exact mirror set has shipped false docs before ([[tasks/extend-mover-reference-sweep-to-the-knowledge-base]]): `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`, and the `architecture.md` skill-ownership row.

The test asserts **allow for lead, deny for every other role**, pinning the JSON deny shape rather than just an exit code.

## Outcome

**Done, agent-closed.** Verified this sync (2026-07-26): `skills-for-role.sh` lists `fkit-sprint-ship-loop` under `lead` and no other role; `claude/skills/fkit-sprint-ship-loop/SKILL.md` exists; the skill count is **25**.

> ⚠️ **This task shipped claiming the ADR-027 dual-home parity test passed. That test does not exist** — the brief called for running it, and it had never been built. The gap was caught later and carries a named obligation to re-verify this task's five touched files. See [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]; the reconciliation and the test itself are separate, still-open backlog work.

**ADR-033 does not undo this.** Lead's `fkit-sprint-ship-loop` ownership stays valid; only the separate **mover** ownership in the same file was reverted, by [[tasks/revert-task-movers-to-producer-only]].

## Related
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] · [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — `skills_for_role()` as the single source of truth
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that enforces it
- [[tasks/build-fkit-sprint-ship-loop-skill]] — hard dependency
- [[tasks/revert-task-movers-to-producer-only]] — the mover half of the same file, reverted separately
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — the precedent for mirrors shipping stale
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the unrunnable verification step
- [[tasks/amend-project-brief-for-lead-conductor]] · [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — what this blocks
- [[systems/fkit]] · [[systems/role-locked-sessions]]
- [[systems/testing-and-verification]] — Testing & Verification
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — Evolve `fkit-lead` into the orchestrating conductor (reverse the non-doer stance)
