# Ship the one-skill-one-output convention in the scaffold

**Source**: `ai-agents/tasks/done/ship-one-skill-one-output-convention-in-scaffold.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 48

## Goal
Task 47 recorded the "one skill, one output" convention — but only in this repo's live knowledge-base (its write boundary, correctly). Consuming projects never received it. This task copies `conventions/one-skill-one-output.md` + its README index row into `claude/scaffold/ai-agents/knowledge-base/conventions/` — **the fourth instance of the live-vs-scaffold parity gap**, closed without waiting for the cause investigation (task 49, backlog).

## Key Changes
- Scaffold now ships all four conventions; delivery to **existing** projects is free via task-28 additive convergence (a new file is a missing path — it arrives on next launch).
- **Accepted limitation, stated not solved:** convergence cannot update the conventions `README.md` *index* in existing projects (the file already exists; the invariant forbids touching existing paths) — existing projects get the convention with an index that doesn't list it.

## Outcome
**Done.** Verified by clean-init (all four entries present, README lists all four) and a convergence check (file created, announcement names it, pre-existing README untouched — the limitation observed, not assumed).

## Related
- [[tasks/record-one-skill-one-output-convention]] — task 47, the convention this ships
- [[tasks/converge-ai-agents-additively-on-launch]] — the delivery mechanism to existing projects
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the invariant behind the accepted README limitation
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] · [[tasks/fix-scaffold-knowledge-base-folders]] · [[tasks/bake-architecture-pointer-into-scaffold-templates]] — the three prior parity instances
- [[systems/knowledge-base-structure]]
- [[tasks/sprint-2-remove-omnigent]]
