# Add a structured `## Owner` field to the brief schema and the task-brief skill

**Source**: `ai-agents/tasks/done/0104-add-owner-field-to-brief-schema-and-task-brief-skill/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0104 · priority 86 · owner `fkit-coder`

## Goal

Make **Owner** a first-class structured brief field — the same standing as `## Status` — so `/fkit-status` can render it from the record instead of scraping it out of board-row prose.

## Key Changes

The owner asked (2026-07-22, with a screenshot) for Owner rendered *"the same way as Status, #, Task, Filename, Next step"*, positioned just before Next step, and ruled the value must come from a **structured field**, not prose.

**It was not a field.** The value lived as free prose in two places — `owner: fkit-X` inside roughly half the board-row cells, and `- **Owner: fkit-X.**` in most briefs' `## Notes`. This task is the **schema-and-tooling half**: `## Owner` added to the `fkit-task-brief` skeleton immediately after `## Status` (identity → status → owner, grouped), with an allocation step so every *new* brief carries a populated value.

**The valid values are the seven live roles** — and the brief explicitly bars the not-yet-built eighth (tester) role from the enum until it exists. That vocabulary became its own convention doc, `knowledge-base/conventions/task-owner-vocabulary.md`: exactly one role per brief, mandatory, populated at creation, and *"if a value you need isn't here, amend this doc — don't invent one inline."*

Two sub-decisions were deliberately left to the plan gate rather than pre-judged: whether an absent `## Owner` becomes a `dashboard.sh` drift kind mirroring `brief-missing-status`, and whether the value is validated against the role enum (validation catches typos but couples the field to a role list ADR-028 will change).

## Outcome

**Done, agent-closed.** The field, the skill step, and the vocabulary doc exist; existing briefs were untouched by design ([[tasks/backfill-owner-field-into-existing-briefs]] did those) and the render is [[tasks/render-owner-column-in-fkit-status]].

## Related
- [[tasks/backfill-owner-field-into-existing-briefs]] — the data half (blocked on this)
- [[tasks/render-owner-column-in-fkit-status]] — the render half
- [[tasks/enforce-task-status-vocabulary]] — the sibling closed-vocabulary convention for `## Status`
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the `## ID` field this mirrors
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — why the enum is seven, not eight
- [[systems/knowledge-base-structure]] · [[systems/fkit]]
