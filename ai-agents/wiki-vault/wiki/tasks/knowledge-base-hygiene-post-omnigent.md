# Knowledge-base hygiene after the removal

**Source**: `ai-agents/tasks/done/knowledge-base-hygiene-post-omnigent.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 10 (Phase 5a)

## Goal
File the knowledge base against the post-removal reality: mark the Omnigent-only ADRs superseded, and route the loose root documents to the folder that matches their kind.

## Key Changes
**The governing principle: archive, don't delete. Nothing is destroyed; everything is filed.**

**Timing mattered:** this ran in Phase 5, **not earlier** — *an ADR should not claim to be superseded while the code it describes is still shipping.*

- **ADRs 003, 004, 006, 007** → marked **superseded**, every file kept. ADR-005 marked **superseded on mechanism only — its rule remains in force.** ADR-001 → superseded by ADR-011; ADR-008 → superseded but **explicitly kept as the record of *why fkit left Omnigent***.
- The loose root files were moved into `reports/` and `conventions/` per ADR-013, taking dated names (`YYYY-MM-DD-<slug>.md`).

## Outcome
Done — **but the brief had to be rewritten mid-flight, and that is the interesting part.**

> ⚠️ **The brief originally improvised its own routing rule, and it was wrong.** It sent an evaluation, a verification, the audit, the plan **and the 2026-07-10 incident** into `history/` — which would have **emptied `incidents/` on the day it was formalized**, and mis-filed four *records* as superseded *designs*.

[[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] landed first and rewrote it. **The correcting principle: records don't go stale, designs do.** An audit, a verification, an evaluation, a plan, an incident — none of them become *false* when the system they describe is removed. **They stay true; they happened.** `history/` is for **superseded design docs only**, and it stays closed at the four it already holds.

**This is a live case for why a convention must exist *before* the pass that needs it** — in its absence, a task brief will invent one, confidently, and be wrong.

⚠️ **Fallout it did not cover:** moving the conventions broke shipped skills that still pointed at the old paths — chased separately in [[tasks/repair-knowledge-base-paths-in-product-source]]. And `architecture.md` §8/§9.6 still claim ADRs 003/004/006/007 are *"marked `accepted` today"*, which this task made false.

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[tasks/formalize-knowledge-base-incidents-folder]]
- [[tasks/repair-knowledge-base-paths-in-product-source]]
- [[systems/knowledge-base-structure]]
- [[decisions/adr-002-archive-pre-omnigent-design-docs]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
- [[tasks/rewrite-docs-post-omnigent]]
