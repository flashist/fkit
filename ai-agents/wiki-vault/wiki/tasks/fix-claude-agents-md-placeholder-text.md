# Replace leftover placeholder text in CLAUDE.md / AGENTS.md

**Source**: `ai-agents/tasks/done/0041-fix-claude-agents-md-placeholder-text/brief.md`
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

> ✅ **Sync 2026-09-30 (`a351cb6`→`3915417`) — the brief's own `## Status` was repaired to plain `✅ Done` on
> 2026-09-18.** It had read `🔲 Backlog` inside `done/` since the 2026-07-21 folder migration created it that
> way; the owner had closed the task himself on 2026-07-10 (commit `6daf3cc`). Repaired by a spawned producer
> under a **one-time, two-brief owner grant** — the 2026-09-18 addendum on
> [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]. ⛔ **Not a precedent.**

> ⛔ **Dated correction 2026-10-10 (sync `3915417`→`79a7dbf`) — the 2026-09-30 note above repeats a cause git does not support; it is
> left byte-identical.** Task `0472` (owner ruling R6, 2026-10-02) corrected the source records: the 2026-07-21
> folder migration (`331f298`) only **renamed** this brief, content unchanged (R100). It was **created in `backlog/`
> already reading `🔲 Backlog`** (2026-07-10), and the owner's close commit `6daf3cc` moved it **unedited**. So
> *"since the 2026-07-21 folder migration created it that way"* is wrong: the field existed at close and the close did
> not update it. Nothing caught it for **70 days**, not 59. The repair to plain `✅ Done` and its grant stand.

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[systems/fkit]]
- [[tasks/bake-architecture-pointer-into-scaffold-templates]]
- [[tasks/extend-initiate-project-fill-overview]]
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`):* [[tasks/tidy-fkits-documents-after-adr-052-machine-paths-stale-pointers-adr-049-oqs]] — `0472`, the R6 correction of how this brief's status went wrong
