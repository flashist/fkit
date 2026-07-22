# Render the Owner column in `/fkit-status`, just before Next step

## ID
0106

## Sprint
Sprint 2

## Priority
88

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

The feature the owner actually asked for (2026-07-22, with screenshot): `/fkit-status` shows **Owner**
as its own field in the per-task output, *"the same way as Status, #, Task, Filename, Next step"*, and
it goes **just before Next step**. Today the owner is buried inside the Task cell's prose parenthetical
(`… owner: fkit-wiki)`), if it appears at all.

**This is the render half, and it depends on the other two:** task
[0104](../../done/0104-add-owner-field-to-brief-schema-and-task-brief-skill/brief.md) defines the `## Owner`
field and task [0105](../../done/0105-backfill-owner-field-into-existing-briefs/brief.md) populates the ~103
existing briefs. `dashboard.sh` already opens each brief to read `## Status`, so reading `## Owner` from
the same place is a small extension of an existing mechanism — **not** a new prose-scrape of the board
row.

## What to build

- **`dashboard.sh` reads `## Owner`** from each brief (same pass that reads `## Status`) and emits a new
  **Owner** column in the `⟦BOARD⟧` table, positioned **between Filename and Next step** — i.e. the
  header becomes `| Status | # | Task | Filename | Owner | Next step |`.
- **The `⟦FACTS⟧` block** carries the owner per task if that helps a consumer — a small `owner <task>
  <role>` record, at the coder's discretion per the design; not required by the owner's ask, so keep it
  minimal.
- **The [`fkit-status/SKILL.md`](../../../../claude/skills/fkit-status/SKILL.md) contract updated** — the
  documented column list, the "paste verbatim" board description, and any example output now include the
  Owner column. The contract text currently names five columns in several places; all must move together
  or the skill and the script disagree.
- **A `dashboard-contract.test.js` fixture** covering the Owner column — the suite is already
  fixtures-in / exact-text-out, so this is an ordinary fixture case: a brief with `## Owner`, asserting
  the rendered column.
- **The missing-owner render** — decide with 0104's sub-decision: if `## Owner` is absent, render `—`
  (or `unknown`), mirroring the ID `?` fallback. If 0104/0105 made the field mandatory and an
  `owner-missing` drift kind exists, an absent owner is *also* a drift record; keep the two consistent.

## Verification steps

- `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` emits a board whose
  header is `| Status | # | Task | Filename | Owner | Next step |`, Owner between Filename and Next
  step.
- Each rendered row shows the owner from that task's `## Owner` field — spot-checked against the brief.
- A brief with **no** `## Owner` renders the agreed placeholder, not a blank cell or a broken row.
- The `fkit-status/SKILL.md` contract and the script **agree** on the column set — no place in the
  skill still describes the old five-column board as current.
- The dashboard-contract and launcher-contract test suites pass, including the new Owner fixture.
- The roll-up and drift behavior are unchanged by the added column — counts still sum to `M`, no new
  spurious drift.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 0104 (schema) and task 0105 (data) — hard.** The column can be *built* after 0104
  alone, but its acceptance ("shows the correct owner per row") needs 0105's backfill, so it waits on
  both.
- **A review is worth it** — this edits `dashboard.sh`, the single most load-bearing consumer, and its
  column contract is mirrored in `SKILL.md` in several places (the exact drift that bit the review
  grammar six times; see the `⟦FACTS⟧` doc history).
- **Owner's explicit placement instruction:** *before Next step.* Not after, not at the end — between
  Filename and Next step. Honor it exactly.
