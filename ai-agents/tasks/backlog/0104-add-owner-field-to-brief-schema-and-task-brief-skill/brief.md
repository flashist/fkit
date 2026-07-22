# Add a structured `## Owner` field to the brief schema and the task-brief skill

## ID
0104

## Sprint
Sprint 2

## Priority
86

## Status
🔲 Backlog

## Context

The owner wants `/fkit-status` to render **Owner** as a first-class field, *"the same way as Status,
#, Task, Filename, Next step"*, positioned **just before Next step** (owner request + screenshot,
2026-07-22). The owner ruled the value must come from a **structured brief field**, not be scraped
from the board-row prose — *"the same way as Status"*, and Status comes from the structured `## Status`
field.

**Owner is not a structured field today.** No brief has a `## Owner` heading. The value lives as free
prose in two places: `owner: fkit-X` inside ~47/85 board-row task cells, and `- **Owner: fkit-X.**` in
~78/103 briefs' `## Notes`. This task creates the field; task
[0105](../0105-backfill-owner-field-into-existing-briefs/brief.md) populates the ~103 existing briefs;
task [0106](../0106-render-owner-column-in-fkit-status/brief.md) renders it.

**This is the schema-and-tooling half — it defines the field and makes every *new* brief carry it.** It
does not touch existing briefs (that is 0105) and does not change the render (that is 0106).

## What to build

- **Add `## Owner` to the brief skeleton** documented in
  [`fkit-task-brief/SKILL.md`](../../../../claude/skills/fkit-task-brief/SKILL.md) step 4 — positioned
  **after `## Status`** in the brief file (identity → status → owner, grouped), with the value on the
  next line. *(The **render** position — before Next step — is 0106's concern; the brief-field position
  is a separate, editor-facing choice.)*
- **Add an allocation/population step** to the task-brief skill so every new brief is created with a
  populated `## Owner` — the producer already decides the owner when scoping (it is in the board row
  today), so this only moves that decision into a field.
- **Define the valid values.** A single fkit role name. The seven live roles are the candidates
  (`fkit-producer`, `fkit-coder`, `fkit-architect`, `fkit-reviewer`, `fkit-adversarial-reviewer`,
  `fkit-wiki`, `fkit-lead`). **⚠️ ADR-028's eighth role (the tester) is decided-not-built** — do not
  add it as a valid owner until it exists.
- **Update `ai-agents/README.md`** (and the scaffold copy if one exists) if it documents the brief
  schema, so the field is part of the canonical structure — mirror how `## ID` was documented.

## Verification steps

- `fkit-task-brief/SKILL.md`'s brief skeleton includes `## Owner`, positioned after `## Status`.
- Running the task-brief skill on a scratch description produces a brief whose `## Owner` field is
  present and populated with a valid role name.
- The list of valid owner values is written down somewhere a reader/linter can find it, and it does
  **not** include the not-yet-built eighth role.
- No existing brief is modified by this task (that is 0105) — `git status` shows only source/skill/doc
  changes, no edits under `ai-agents/tasks/`.
- The dashboard still runs clean:
  `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` reports the same counts
  and **no new drift** (this task adds the field to the schema, not yet to any brief, so no
  `id-mismatch`-style reconciliation fires).

## Notes

- **Owner: fkit-coder** — a change to the `fkit-task-brief` skill source and the schema docs.
- **Depends on: nothing.**
- **Blocks: tasks 0105 and 0106** — backfill needs the field defined; render needs the schema.
- **Two design sub-decisions for the plan gate (owner to confirm), not pre-judged here:**
  1. **Is `## Owner` mandatory** (like `## Status`), and does `dashboard.sh` gain an **`owner-missing`
     drift kind** mirroring `brief-missing-status`? Leaning yes for consistency — but it expands scope
     into 0106's `dashboard.sh` work, so if adopted it belongs there, flagged here.
  2. **Is the value validated against the role enum**, or free text? Validation catches typos but
     couples the field to the role list (which ADR-028 will change when the eighth role ships).
- **The now-redundant `**Owner:**` line in `## Notes`** is left for 0105 to decide (dedupe vs leave) —
  not this task's concern.
