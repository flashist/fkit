# Amend PROJECT.md for the evolved `fkit-lead` conductor

**Source**: `ai-agents/tasks/done/0114-amend-project-brief-for-lead-conductor/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID 0114 · priority 96 · owner `fkit-producer`

## Goal

Correct the **product-document** half of the lead-conductor doc ripple — `PROJECT.md` only, at product-brief altitude.

## Key Changes

**Split by owner and by file**, the same precedent as the eighth-role pair: the **producer** owns `PROJECT.md`, the **architect** owns `architecture.md` ([[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]]). Both descend from the same design item.

The lead description became *"the **single point of interaction** — a conductor that spawns and drives any role… while keeping its routing remit,"* explicitly noting it reverses the old *"does no work itself"* stance, and that it conducts **but never performs** — still writes no source, runs no reviews.

**The role count was not to change**, and did not: ADR-031 changes lead's *nature*, not the team size. Seven live; the eighth remains decided-but-not-built.

⚠️ The brief flagged that this **needed owner sign-off on the wording**, because reversing a deliberately-stated product stance is a stance restatement, not a copy edit — the same handling as [[tasks/amend-project-brief-for-the-eighth-role]].

## Outcome

**Done** — and closed *without* the agent-closed marker, i.e. owner-verified. Verified this sync (2026-07-26) against the tree: `PROJECT.md` describes lead as the conductor with retained routing, cites ADR-031, and the seven-role count is intact.

The same task-set later also brought `PROJECT.md`'s **task-lifecycle** paragraph up to date for [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — it now reads *"only the producer may invoke them,"* with the honest note that this one **is** structural (hook-enforced) but restores separation of identity, not prevention.

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]
- [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — the sibling architecture half
- [[tasks/amend-project-brief-for-the-eighth-role]] — the split precedent
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] · [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] — hard dependencies
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the count that did **not** change
- [[systems/knowledge-base-structure]] · [[systems/fkit]]
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill
