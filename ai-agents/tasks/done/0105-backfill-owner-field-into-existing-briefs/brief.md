# Backfill the `## Owner` field into all existing briefs

## ID
0105

## Sprint
Sprint 2

## Priority
87

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

Task [0104](../../done/0104-add-owner-field-to-brief-schema-and-task-brief-skill/brief.md) adds `## Owner` to
the brief schema so *new* briefs carry it. This task adds it to the **~103 briefs that already exist**
across `backlog/`, `done/`, and `cancelled/`, so the render (task
[0106](../0106-render-owner-column-in-fkit-status/brief.md)) shows a real owner on every row, not just
on briefs created after 0104.

**The wrinkle, measured 2026-07-22 — the owner is not recoverable for every brief.** Of 103 briefs:

- **~78 carry an owner mention** in prose — the `- **Owner: fkit-X.**` line in `## Notes`, and/or
  `owner: fkit-X` in their board row. For these, the value is **derived**, not invented.
- **~25 have no recorded owner anywhere.** For these the owner cannot be scraped and **must not be
  guessed** — a wrong owner on a closed task is a quietly false record. They are **derived as a list
  and handed to the owner (or producer) for assignment**, exactly as the ID-collision guard hands off
  rather than inventing.

**These counts are a 2026-07-22 snapshot — re-measure at run time.** The set moves as briefs are
created and closed between now and this task's run. Derive the have/haven't split yourself; do not
trust the numbers above as a worklist.

## What to build

- **Every existing brief gains a populated `## Owner` field**, in the schema position 0104 defined,
  with a valid role value.
- **For the ~78 with a recoverable owner:** derive it from the brief's `## Notes` owner line, falling
  back to the board-row `owner: fkit-X` cell. Where both exist and **disagree**, do not pick silently —
  record the conflict for the owner.
- **For the residual set with no recorded owner:** produce a dated list of those briefs in this task's
  `worklog.md`, and get the owner's assignment for each **before** writing a value. **Never default an
  unknown owner to a plausible role** — that is the "asserting the behavior you assume" failure the
  `evidence-before-assertion` convention names.
- **The now-redundant prose owner mention** — decide once, apply uniformly: either leave the `## Notes`
  line as-is (harmless, and some carry extra context like *"fkit-coder, task does not split"*), or
  dedupe it. State which, and why, in the worklog. **Leaning: leave it** — removing it risks dropping
  the extra context, and the field is the source of truth regardless.

## Verification steps

- **Every** brief under `backlog/`, `done/`, `cancelled/` has a `## Owner` field — count of `## Owner`
  headings equals the count of `brief.md` files.
- Every populated value is a valid role name per 0104's enum (and none is the not-yet-built eighth
  role).
- The residual-unknown list exists in this task's `worklog.md`, is dated, and **every** entry on it was
  resolved by an owner assignment — not one was filled by inference.
- Any `## Notes`-vs-board-cell owner **disagreements** found are listed and resolved, not silently
  overwritten.
- `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` reports **no new drift**
  — in particular no `id-mismatch` and, if 0104 added an `owner-missing` drift kind, zero of those.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 0104 — hard** (the field must be defined before it can be backfilled).
- **Blocks: task 0106** — the render shows real owners only once the data exists; 0106's acceptance
  ("board shows the correct owner per row") cannot pass until this lands.
- **This is a bulk edit to `ai-agents/tasks/` but touches no other tree** — no source, no board rows,
  no status changes. A brief's `## Status` and folder are untouched; only the new `## Owner` line is
  added.
- **~25 owner assignments are an owner decision, not a coder one** — budget for a round-trip. This is
  the same shape as the task-ID backfill: the mechanical 78 are cheap, the judgment 25 are the real
  work.
