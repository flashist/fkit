# Build `fkit reconnect` tooling for disconnected subagent runners

**Source**: `ai-agents/tasks/done/0021-build-fkit-reconnect-tooling/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 1

## Goal
Codify the manual recovery recipe for disconnected fkit teammate runners so a repeat incident does not require rediscovering the reconnect sequence under pressure.

## Key Changes
- Added a client-side `fkit reconnect` stopgap for human operators.
- Kept the solution scoped to the repo's shell tooling instead of trying to patch the upstream Omnigent runtime.
- Used the runner-disconnect incident as the source of truth for the recovery steps and the known platform bugs.

## Outcome
The team now has a repeatable reconnect command for disconnected runners while the upstream Omnigent bugs remain external to this repo. The task is explicitly a bridge, not the permanent fix.

> ✅ **Sync 2026-09-30 (`a351cb6`→`3915417`) — the brief's own `## Status` was repaired to plain `✅ Done` on
> 2026-09-18.** It had read `🔲 Backlog` inside `done/` since the 2026-07-21 folder migration created it that
> way (*born wrong, not drifted*); the owner had closed the task himself on 2026-07-10 (commit `f7b23f4`). The
> repair was made by a spawned producer under a **one-time, two-brief owner grant** recorded as the 2026-09-18
> addendum on [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — ⛔ **not a precedent**.

> ⛔ **Dated correction 2026-10-10 (sync `3915417`→`79a7dbf`) — the 2026-09-30 note above repeats a cause git does not support; it is
> left byte-identical.** Task `0472` (owner ruling R6, 2026-10-02) corrected the source records: the 2026-07-21
> folder migration (`331f298`) only **renamed** this brief, content unchanged (R100). It was **created in `backlog/`
> already reading `🔲 Backlog`** (2026-07-10), and the owner's close commit `f7b23f4` moved it **unedited**. So
> *"since the 2026-07-21 folder migration created it that way"* is wrong: the field existed at close and the close did
> not update it. Nothing caught it for **70 days**, not 59. The repair to plain `✅ Done` and its grant stand.

## Related
- [[systems/subagent-runner-connectivity]]
- [[systems/fkit]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/amend-subagent-disconnect-incident-doc]]
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`):* [[tasks/tidy-fkits-documents-after-adr-052-machine-paths-stale-pointers-adr-049-oqs]] — `0472`, the R6 correction of how this brief's status went wrong
