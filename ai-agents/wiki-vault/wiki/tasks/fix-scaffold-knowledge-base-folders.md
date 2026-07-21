# Fix the scaffold — ship the knowledge-base folders its own README promises

**Source**: `ai-agents/tasks/done/0043-fix-scaffold-knowledge-base-folders/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 25

## Goal
**The scaffold contradicted itself on day one, for 100% of projects created from then on.** Its `ai-agents/README.md` shipped [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]'s law naming **five** knowledge-base folders; the scaffold created **one**. A project scaffolded today shipped with a README instructing its agents to file documents into **four folders that do not exist on its disk**.

## Key Changes
- **Created the four missing folders** in `claude/scaffold/ai-agents/knowledge-base/`: `decisions/`, `incidents/`, `reports/`, `history/` — each with a `.gitkeep`. **Empty-with-`.gitkeep` is correct**: they are *filing destinations*, and their contents are project-specific. **Not seeded with examples.**
- **Added `conventions/README.md`** to the scaffold, ported from this repo's and **generalized for a fresh project** (it must not carry fkit-specific content).
- **Corrected a second, independent self-contradiction in the same file:** the README's `sprints/` row said **`plan-sprint-N.md`**; the shipped producer skills write **`sprint-N.md`**, and the file on this repo's disk is `sprint-2.md`. **The scaffold's own README disagreed with the scaffold's own skills, and every new project inherited it.** The skills are the authority — *they are what actually writes the file*.

**Scope boundary, held:** this fixes what **new** projects receive. It does **nothing** for projects that already exist — those need additive convergence (Sprint 2 task 28, still backlog). **The two are complementary and independently shippable**; this one shipped first because it is free and it was that day's bug.

**Explicitly not touched:** this repo's own `ai-agents/README.md`, which has drifted. **Content drift is a deliberate owner deferral** — see [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]].

## Outcome
**Done.** *"Not a migration problem — a plain defect in fkit's current output, needing no mechanism, gated on nothing."* **No ADR:** ADR-013 already made the decision; **the scaffold simply never implemented it.**

The verification that mattered was the comparison, not the tree-walk: **scaffold a fresh project, then confirm every folder its README names actually exists on disk** — *the failure being fixed is precisely "the README promises a path the disk does not have."*

⚠️ **The residue is accepted knowingly:** existing projects keep the wrong `plan-sprint-N.md` README **forever** under ADR-015's invariant, and *that file is read by an agent at runtime*.

## Related
- [[tasks/converge-ai-agents-additively-on-launch]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] — the law the scaffold never implemented
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — why existing projects keep the drift
- [[tasks/design-version-to-version-migration-mechanism]] — the investigation that surfaced it
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] — a later divergence in the same README pair
- [[tasks/formalize-knowledge-base-incidents-folder]]
- [[systems/launch-convergence-and-init]]
- [[systems/knowledge-base-structure]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/stop-init-failure-bricking-the-launcher]]
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] — the fourth parity instance
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — one of the four prior point-fixes this ADR generalizes
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49, same drift class
