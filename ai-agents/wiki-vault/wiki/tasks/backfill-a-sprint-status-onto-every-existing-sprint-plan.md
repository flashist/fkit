# Backfill a sprint status onto every existing sprint plan in this repo

**Source**: `ai-agents/tasks/done/0340-backfill-a-sprint-status-onto-every-existing-sprint-plan-in-this-repo/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 8 · `P3` (⭐ **re-ranked from `P6`**) · `0340` · ✅ Done (agent-closed — not owner-verified)

## Goal

**The data migration `0337` and `0338` create.** Until this repo's own plans carried a status, the
new selector would find nothing active here. ⭐ **This repo's records, not the product — so a producer
act, deliberately separate from the coder's `0338`.**

## Key Changes

⛔ **The title overstates the task, and the title stays.** `0340`'s real remaining deliverable is
**one line inserted at line 3 of one file** — the live Sprint 8 board — plus its report.

**Why the scope shrank, re-measured 2026-09-10:**

| `0340`'s brief said | Measured at pickup |
|---|---|
| *"Today the top holds only `sprint-6.md` and `backlog.md`"* | ⛔ **`backlog.md` + `sprint-8.md`.** Sprint 6 was archived 2026-08-29 |
| *"`sprints/done/sprint-1..5.md`"* — five plans | ⛔ **`sprint-1.md` … `sprint-7.md` — SEVEN**, every one carrying `> ## 🔒 CLOSED — <date>.` at line 3 |

⭐ **The conditional in the brief was settled by owner ruling 2026-09-10, verbatim *"Keep — permanent
compat rung (Rec)"*: the legacy `🔒 CLOSED` banner reads as `Done` PERMANENTLY**, not as a migration
to be undone. ⛔ **So all seven archived plans end byte-identical** and the branch that would have
rewritten them is closed.

### ⛔ Why the folder was NOT renamed to match the narrowed scope

- ⭐ **The brief is the live scope**, and the board says so on every row; the folder name is an
  identifier, not a specification.
- ⛔ **The decisive reason: renaming would MOVE A TASK FOLDER** — precisely the link-surface hazard
  `0381` exists to fix, and `0381` had not shipped. A rename re-points every inbound link and
  invalidates `NAMED_EXEMPT` keys no mover has a step for. ⭐ **Paying that cost to fix a cosmetic
  title, on the one board with the fix queued at `P4`, is the wrong trade** — and doing it mid-sprint
  on a live board is worse.

⚠️ **Re-titling after `0381` shipped is cheap and defensible — and is explicitly NOT authorised by
that note.**

### ⚠️ The collision that was found now rather than in a diff

`0322` (escape the stray board pipes) edits `sprints/done/sprint-2.md` and `sprint-5.md` **in the body
of the file**, while this task required every archived plan to end **byte-identical**. ⛔ **`0322` was
deliberately not on the board, so no conflict was live** — but if it is ever pulled while a backfill is
open, the two must be ordered explicitly and must not run concurrently.

## Outcome

⭐ **Shipped at `P3`, one rank ahead of the reader that verifies it** — by owner ruling `S6`. Its
`## Verification steps` step 1 runs `select-active` and expects the banner read back; ⛔ **that could
not pass at `P3`, because the rung that reads it arrived at `P6`.**

⭐ **The verification was DEFERRED, not skipped:** `0340` wrote the banner in `0337`'s grammar and
checked it **by inspection** against the accepted ADR, and
[[tasks/give-the-selector-a-status-rung-and-a-lowest-first-choice]]'s own verification became the
place Sprint 8's criterion (a) was actually demonstrated.

⚠️ **The brief carried a 2026-08-29 dated correction of its own** — written 2026-08-25 naming
`sprint-6.md` as the open plan, corrected when Sprint 6 was archived, and ⛔ **by pickup Sprint 7 had
been archived too.** ⭐ *"Do not stamp `🔄 In progress` onto a 21-of-21 board"* — the brief's own
warning against asserting a status a board does not have.

## Related
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]]
- [[tasks/record-the-sprint-lifecycle-adr-047]]
- [[tasks/give-the-selector-a-status-rung-and-a-lowest-first-choice]]
- [[tasks/give-the-task-movers-a-step-for-the-named-exempt-keys]]
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]]
