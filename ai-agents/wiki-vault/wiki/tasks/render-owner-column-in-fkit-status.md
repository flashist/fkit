# Render the Owner column in `/fkit-status`, just before Next step

**Source**: `ai-agents/tasks/done/0106-render-owner-column-in-fkit-status/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0106 · priority 88 · owner `fkit-coder`

## Goal

Show **Owner** as its own column in the `/fkit-status` board, positioned **between Filename and Next step** — the owner's explicit placement instruction, honored exactly.

## Key Changes

`dashboard.sh` already opened each brief to read `## Status`, so reading `## Owner` in the same pass is a small extension of an existing mechanism — **not** a new prose-scrape of the board row. The board header becomes:

```
| Status | # | Task | Filename | Owner | Next step |
```

**The contract had to move with the script.** `fkit-status/SKILL.md` names the column list in several places — the documented columns, the "paste verbatim" board description, and the example output. The brief flags this as the exact drift that bit the review grammar six times: all sites move together, or the skill and the script disagree. A `dashboard-contract.test.js` fixture pins the new column, the suite being fixtures-in / exact-text-out.

A missing `## Owner` renders an agreed placeholder rather than a blank cell or a broken row, kept consistent with whatever drift kind the schema task settled on.

## Outcome

**Done, agent-closed.** Verified live this sync (2026-07-26): `dashboard.sh` emits the six-column header with Owner between Filename and Next step, and every rendered row carries a real role from the brief's field.

## Related
- [[tasks/add-owner-field-to-brief-schema-and-task-brief-skill]] · [[tasks/backfill-owner-field-into-existing-briefs]] — hard dependencies (schema, then data)
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — the script this extends
- [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — the sibling `dashboard.sh` change that landed alongside
- [[tasks/remove-output-variants-from-fkit-status]] · [[tasks/record-one-skill-one-output-convention]]
- [[systems/fkit]]
- [[systems/knowledge-base-structure]] — Knowledge-Base Structure
