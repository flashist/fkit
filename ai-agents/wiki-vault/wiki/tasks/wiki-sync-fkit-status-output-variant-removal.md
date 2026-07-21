# Wiki sync fkit status output variant removal

**Source**: `ai-agents/tasks/done/0096-wiki-sync-fkit-status-output-variant-removal/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID **0096** · priority 45 · owner fkit-wiki

## Goal
A pre-filed **"sync the vault after"** task — its subject is the removal of `/fkit-status` output variants (one skill, one output). One of the **six queued wiki-syncs** (priorities 45 / 51 / 66 / 69 / 71 / 73) the owner ruled on 2026-07-19 must **wait for the task-folder migration and batch into task 99** ([[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] §9.2, design spec §9.2) — rather than run first and have the vault write those pages twice against a structure about to change. Sprint 2's own task 11 taught that precedent.

## Key Changes
No standalone vault work — **the subject was already recorded** on its implementation page, and this task's own sync is discharged as part of the post-migration re-description run (task 99, 2026-07-21).

## Outcome
Done. **Its subject is present in the vault** on [[tasks/remove-output-variants-from-fkit-status]] — checked by name per task 99's verification contract. The batching avoided a double-write of the structural pages.

## Related
- [[tasks/remove-output-variants-from-fkit-status]] — the implementation this sync task covers; where the subject actually lives
- [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] — task 76, the migration these six waited on
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — §9.2, the batching ruling
- [[tasks/sprint-2-remove-omnigent]] · [[systems/fkit]]
