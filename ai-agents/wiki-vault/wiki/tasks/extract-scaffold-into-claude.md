# Extract the shared scaffold into `claude/`

**Source**: `ai-agents/tasks/done/0038-extract-scaffold-into-claude/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 1 (Phase 0.1, blocking)

## Goal
Remove the Claude flavor's runtime dependency on `omnigent/`, so that `omnigent/` can later be deleted safely.

## Key Changes
**The single most important fact about the whole sprint:** `omnigent/` could not simply be deleted, because **the Claude flavor read its scaffold at runtime.** `claude/fkit-claude-init.sh` set `scaffold="$here/../omnigent/scaffold"` and copied the `ai-agents/` tree *and* `AGENTS.md` from it; `claude/scaffold/` held only `CLAUDE.md`.

- Move `omnigent/scaffold/ai-agents/` → `claude/scaffold/ai-agents/` (via `git mv`, preserving history).
- Repoint `claude/fkit-claude-init.sh` at the new location.

## Outcome
Done. The first of three blocking foundations — **nothing in Phase 1 or 2 could start until it landed.** With the scaffold moved, deleting `omnigent/` no longer hard-fails Claude init.

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/delete-omnigent-directory]]
- [[tasks/bake-architecture-pointer-into-scaffold-templates]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/install-and-self-update]]
