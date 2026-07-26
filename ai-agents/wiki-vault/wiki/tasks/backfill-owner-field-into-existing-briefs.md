# Backfill the `## Owner` field into all existing briefs

**Source**: `ai-agents/tasks/done/0105-backfill-owner-field-into-existing-briefs/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0105 · priority 87 · owner `fkit-coder`

## Goal

Populate `## Owner` on every brief that already existed, so the new column shows a real owner on every row rather than only on briefs created after the schema change.

## Key Changes

**The interesting part is the split, not the bulk edit.** Of the briefs measured: most carried a recoverable owner in prose (the `## Notes` owner line, or the board-row `owner: fkit-X` cell) — **derived, not invented**. A residual set had **no recorded owner anywhere**.

The brief's binding instruction for that residual: **never default an unknown owner to a plausible role.** A wrong owner on a closed task is a quietly false record. They were derived as a dated list in the task's `worklog.md` and **handed to the owner for assignment before any value was written** — the same discipline as the ID-collision guard, which hands off rather than inventing. Where the `## Notes` line and the board cell **disagreed**, the conflict was recorded rather than silently resolved.

The measured counts in the brief were explicitly marked a snapshot: *"re-measure at run time; do not trust these as a worklist."*

## Outcome

**Done, agent-closed.** Final verification recorded in the worklog: **108 briefs, 108 `## Owner` headings**, exactly one per brief; values are exactly four valid roles — **72 `fkit-coder` · 24 `fkit-architect` · 10 `fkit-wiki` · 2 `fkit-producer`** — with no tester and no junk; position confirmed between `## Status` and `## Context` across all three boards; `dashboard.sh` reported **0 drift**; and the git scope was 108 `brief.md` files plus the loop's own bookkeeping, with no source or board-content edits.

The redundant prose owner line in `## Notes` was **left in place** — removing it risked dropping the extra context some carry, and the field is the source of truth regardless. Three low-confidence assignments were owner-ratified. The backfill script was kept throwaway in `/tmp`, deliberately **not** shipped into the repo.

## Related
- [[tasks/add-owner-field-to-brief-schema-and-task-brief-skill]] — the schema half (hard dependency)
- [[tasks/render-owner-column-in-fkit-status]] — the render, whose acceptance needed this data
- [[tasks/assign-global-task-ids-and-create-registry]] — the same shape: cheap mechanical majority, judgment-bearing residual
- [[systems/fkit]]
- [[systems/knowledge-base-structure]] — Knowledge-Base Structure
