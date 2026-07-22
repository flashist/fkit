# Wiki sync after the task-folder migration

**Source**: `ai-agents/tasks/done/0099-wiki-sync-task-folder-migration/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID **0099** · priority 78 · owner fkit-wiki

## Goal
Re-describe the vault after [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] (task 76) changed the path shape of **every** task brief. The vault held **~104 references** to the old `tasks/<board>/<slug>.md` form — the single largest concentration of task links in the project — **and this was more than a link repair:** the vault's synthesized pages described the one-file-per-task structure, the three separate artifact directories, and the review-ledger key, all of which became **factually wrong** the moment the migration landed, not merely stale in their hrefs.

**Its own task, not part of task 77**, because only the `fkit-wiki` role may write `ai-agents/wiki-vault/` — a hard rule.

## Key Changes
- **Re-pointed 104 task-brief path references across 82 vault files** to `tasks/<board>/<NNNN>-<slug>/brief.md`, after mapping all 81 referenced slugs against the live tree (0 unmapped).
- **Rewrote the structural prose:** [[systems/fkit]]'s data-model section (the folder + global-ID model, no registry, `git mv`-the-folder movers, the absorbed dirs), [[systems/review-and-model-diversity]], and a supersession banner on [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] (whose §6 folder end-state ADR-029 executes) — annotating the record, not falsifying it.
- **Ingested the new concepts:** the folder layout, the permanent four-digit global ID, the `## ID` field + `id-mismatch` reconciliation, and the **owner's no-registry ruling**.
- **Created 11 task pages** for the migration cluster and the six batched wiki-syncs — the owner ruled (ADR-029 §9.2) that syncs 45/51/66/69/71/73 wait for the migration and **batch into this run** rather than write those pages twice against a structure about to change.

## Outcome
Done — **fkit-wiki's own work** (2026-07-21), closed by the owner 2026-07-22. Every task-99 verification step was walked: 0 flat task paths remain; all links resolve; no page describes a single-file task or a live `plans/`/`worklogs/`/`reviews/` directory; the global ID and folder layout are findable; no ID registry is described; the six batched subjects are each present by name. A follow-up full-vault lint (2026-07-22) confirmed the vault clean.

## Related
- [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] — task 76, the migration this describes
- [[tasks/repair-task-links-outside-the-wiki-after-migration]] — task 77, the in-tree link repair this ran parallel to (disjoint file sets, different write authorities)
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the decision whose model this ingested; §9.2, the batching ruling
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the artifact-directory arrangement this re-described as absorbed
- [[systems/fkit]] · [[systems/review-and-model-diversity]] · [[tasks/sprint-2-remove-omnigent]]
- [[tasks/repair-stale-adr-029-stop-hook-links-in-the-vault]] — task 80, the ADR-029/030 vault link repair
