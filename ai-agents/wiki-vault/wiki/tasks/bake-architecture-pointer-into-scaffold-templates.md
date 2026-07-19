# Bake the Architecture pointer into the scaffold templates

**Source**: `ai-agents/tasks/done/bake-architecture-pointer-into-scaffold-templates.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 12 (carried from Sprint 1, rescoped)

## Goal
Replace the Architecture fill-in placeholder in the scaffold templates with a **pointer** to `ai-agents/knowledge-base/architecture.md`.

## Key Changes
The scaffold templates shipped an Architecture section with a fill-in placeholder (`<!-- project-specific — fill this in -->`).

But **unlike the Project Overview — which is genuinely project-specific — the Architecture section always has the same answer in every fkit project**: the detail lives in `architecture.md`, written by the architect's `survey-project`. **A placeholder asking each project to re-describe its architecture in `CLAUDE.md` is asking for a duplicate that will drift.**

**Rescoped 2026-07-11 (Sprint 1 → Sprint 2):** originally targeted `omnigent/scaffold/`, *which was being deleted*. The underlying gap was real and runtime-independent, so the task survived, **retargeted to `claude/scaffold/`** — where the scaffold lives after Phase 0.1.

## Outcome
Done. New projects now get a `CLAUDE.md` that **points at** the architecture doc instead of inviting a divergent copy.

The sibling of [[tasks/extend-initiate-project-fill-overview]]: together they close both halves of the placeholder gap — *the Architecture half by baking in a pointer, the Project-Overview half at the source, in the skill.*

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/extract-scaffold-into-claude]]
- [[tasks/extend-initiate-project-fill-overview]]
- [[tasks/fix-claude-agents-md-placeholder-text]]
- [[systems/knowledge-base-structure]]
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] — the fourth parity instance
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — one of the four prior point-fixes this ADR generalizes
