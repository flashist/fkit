# Wiki sync after the Omnigent removal

**Source**: `ai-agents/tasks/done/wiki-sync-post-omnigent.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 11 (Phase 5b — genuinely last)

## Goal
The vault described a runtime that no longer existed. **9 vault files referenced Omnigent**, and `wiki/systems/fkit.md` still opened *"fkit is a distributable Omnigent-based team"* — **the headline sentence of the vault's page about the project itself was false.**

## Key Changes
- **Ran `/fkit-wiki-sync`** — a delta-ingest from watermark `f7b23f4`, picking up ADR-009/ADR-010, the rewritten root docs, and the removal of `omnigent/`.
- **The named failure mode, and it was the right thing to name:** *"a delta sync keyed on changed **sources** may not revisit a vault page whose source was **deleted** rather than modified. Deleted sources are the failure mode here."* The 9 Omnigent-referencing files were checked **explicitly**, not left to the delta.
- **[[systems/subagent-runner-connectivity]] was marked 🕰️ historical** rather than deleted — *its whole subject went with Omnigent; it is kept as the record of why fkit left.*
- **Fixed two dangling source pointers** from the `plan-sprint-N.md` → `sprint-N.md` rename, and Sprint 1's move to `sprints/done/`.
- **Ran `/fkit-wiki-lint`** afterward.

## Outcome
**Done.** 44 commits, 87 changed files, 45 ingest-worthy. Rewrote [[systems/fkit]]; created [[systems/role-locked-sessions]], [[systems/install-and-self-update]], [[systems/review-and-model-diversity]], [[systems/knowledge-base-structure]]; created 9 decision pages and 25 task pages; marked ADRs 001/003/004 superseded. **Vault left at 0 broken links, 0 one-way links, 0 index gaps.**

**Why it was sequenced genuinely last, and it is the durable lesson:** *"syncing before the docs are rewritten just ingests the drift — and then it's wrong in **two** places, with the vault carrying the authority of 'verified knowledge.'"* The task's own gate: **confirm the docs rewrite and the KB hygiene are both Done before starting; if not, stop.**

**Wiki writes are exclusive to `fkit-wiki`** — *"and only fkit-wiki. It is the exclusive write gateway; no other agent or session writes there, ever."*

⚠️ **It flagged a source defect it could not fix:** `architecture.md` §8/§9.6 claimed ADRs 003/004/006/007 were *"still marked `accepted`"* when they had just been superseded. **That flag is still open** — see [[systems/testing-and-verification]] and [[systems/install-and-self-update]].

## Related
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — reads decentralized, writes fkit-wiki-exclusive
- [[tasks/rewrite-docs-post-omnigent]] · [[tasks/knowledge-base-hygiene-post-omnigent]] — its hard dependencies
- [[systems/subagent-runner-connectivity]]
- [[systems/knowledge-base-structure]]
- [[systems/fkit]]
- [[tasks/sprint-2-remove-omnigent]]
