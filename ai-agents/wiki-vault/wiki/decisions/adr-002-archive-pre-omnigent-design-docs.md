# ADR-002: Archive the pre-Omnigent research/review documents into `knowledge-base/history/`

**Date**: 2026-07-09
**Status**: accepted

## Context
Four large documents at the repo root described an earlier fkit architecture based on a different layout and a compile pipeline. The initiation survey established that those documents no longer describe the current `omnigent/fkit-*` bundle model, even though they remain useful as historical context for why the rewrite happened.

Leaving those documents at the root made them read like current architecture to a new reader.

## Decision
Move the four superseded documents into `ai-agents/knowledge-base/history/` and add a banner README there that explains their status as historical records.

## Consequences
- The repo root no longer suggests that the pre-Omnigent design is current.
- The historical material remains preserved where project knowledge already lives.
- If the old architecture were ever revived, the same history pattern should be extended rather than replaced ad hoc.

## Related
- [[systems/fkit]]
- [[systems/knowledge-base-structure]] — `history/` is for **superseded design docs only**; this ADR is what scoped it, and it stays closed at the four documents it already holds.
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[tasks/formalize-knowledge-base-incidents-folder]]
- [[tasks/knowledge-base-hygiene-post-omnigent]]
