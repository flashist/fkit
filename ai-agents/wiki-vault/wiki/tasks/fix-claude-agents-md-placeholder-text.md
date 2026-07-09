# Replace leftover placeholder text in CLAUDE.md / AGENTS.md

**Source**: `ai-agents/tasks/done/fix-claude-agents-md-placeholder-text.md`
**Status**: done
**Sprint/Tag**: Sprint 1

## Goal
Replace the scaffold placeholder prose in `CLAUDE.md` and `AGENTS.md` with the same thin project-overview and architecture-pointer pattern used in `PROJECT.md`.

## Key Changes
Both root instruction files were normalized to:
- keep a short project overview instead of `_fill in_` placeholder text
- point the Architecture section at `ai-agents/knowledge-base/architecture.md`
- preserve the thin, pointer-first style rather than duplicating the full brief

## Outcome
The root agent instructions no longer look like unfinished scaffold output, and the sprint now has a concrete completed documentation-consistency task alongside the onboarding work.

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[systems/fkit]]
