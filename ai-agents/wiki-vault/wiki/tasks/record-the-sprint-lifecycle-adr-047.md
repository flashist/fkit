# Record the sprint lifecycle — explicit sprint statuses, and "current sprint(s)" = every sprint In progress

**Source**: `ai-agents/tasks/done/0337-record-the-decision-that-the-current-sprint-is-the-lowest-numbered-open-sprint-not-the-highest/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 8 · `P1` · `0337` · ✅ Done (agent-closed — not owner-verified)

## Goal

⭐ **The task the owner filed because agents kept answering the wrong question.** The report, verbatim,
2026-08-25:

> When I ask leads about the status of the current sprint, they are always getting confused by what I
> mean when I am saying "current sprint", very often they are telling me about the not completed sprint
> with the highest number, but it's incorrect, because the "current" sprint means the sprint that is
> currently active, usually it's the sprint with the smallest number which is not completed.

⚠️ **The folder name still says *"the lowest-numbered open sprint, not the highest"* — that is the
question as filed, and the owner's own second answer reframed it into something larger.** ⛔ **Do not
read the folder name as the scope.**

## Key Changes

### ⭐ The reframe — the owner did not pick an option, and that is the point

On **OQ-2** (same-`N` suffix order) the owner declined the option list and answered instead:

> I think we need to change the way we work with sprints: we need to add the statuses to the sprints,
> similarly to the way we work with tasks: backlog, in progress, done, cancelled. If we do it that
> way, when we ask abut the status of the sprint, actually ALL the currently active sprints should be
> reported about.

⭐ **That turned a tie-break question into a lifecycle.**

### Six owner rulings, all 2026-08-25, all live via `AskUserQuestion`

| # | Verbatim option label | What it fixed |
|---|---|---|
| OQ-1 | *"Default lowest + marker override (Recommended)"* | Where exactly one board must be chosen |
| OQ-3 | *"Yes — banner makes it ineligible (Recommended)"* | A finished-but-unarchived plan is never active |
| OQ-2 | *(no option picked — the reframe above)* | The whole lifecycle |
| SD-1 | *"Line-3 banner (Recommended)"* | The status **carrier** |
| SD-2 | *"`sprints/cancelled/` (Recommended)"* | Cancelled plans get their own folder |
| SD-3 | *"Mover skills, producer-only (Recommended)"* | `/fkit-sprint-done` + `/fkit-sprint-cancelled` |

### ⛔ Two constraints the design had to route around

1. **`## Status` was already taken.** In a sprint plan the `## Status` heading **is the task table** —
   `dashboard.sh` defines `STATUS_HEADING_RE` as exactly `## Status` and dies without it. ⛔ **A
   sprint's own status therefore could not live under that heading.** Hence SD-1's line-3 banner.
2. **`/fkit-status` is one skill, one output.** Reporting *all* In-progress sprints is still one
   output — but the briefing was written as seven beats about **one** sprint, so the N-sprint shape had
   to be specified rather than left to the model.

### What sprint status looked like before

- **Location only** — *"Completed sprints move to `sprints/done/`"*. No `sprints/cancelled/`, no
  `Backlog`/`In progress` distinction; every plan at the top was treated as live.
- **A banner, by precedent** — every archived plan opened with `> ## 🔒 CLOSED — <date>.` at line 3.
  ⛔ **The selector never read it**, which is why a finished Sprint 5 kept being reported as active
  until `0294` moved it — see [[tasks/archive-sprint-5-move-the-plan-into-sprints-done]].
- **No mover skill.** Each archival was a hand-scoped, owner-ruled task; nothing tied the banner and
  the move together.

## Outcome

⭐ **Delivered as [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]**,
accepted 2026-09-10 — four statuses mirroring the task lifecycle, the strictly-line-3 banner, the
two terminal values mover-only, `"current" = every In progress sprint`, lowest-ordered as the
single-board default with a `⭐ ACTIVE BOARD` marker override, and **ADR-041 superseded in part**
(its candidate set, identity ladder, tie-break and `Backlog` token untouched).

⚠️ **The ADR was amended TWICE after acceptance, and the first amendment introduced defects of its
own** — round 2 found eleven findings, **five created or left open by round 1**. ⛔ **The
load-bearing one:** round 1's fix required drifts to reach a roll-up `select-active` does not have,
making five tests unwritable and `0338` unstartable.

⛔ **An ordering constraint came out of it, owner-ruled: the backfill (`0340`) MUST precede the
selector (`0338`)** — otherwise the ship-loop gets `active none` mid-sprint and cannot find the board
it is running on.

⭐ **It is a PROTOCOL break, not only prose** — the dashboard marker goes to `⟦fkit-dashboard v2⟧`, and
⭐ **the first draft named the prose ripple and missed the protocol entirely.**

⚠️ **`Backlog` is now one word with two meanings** (a plan *identity* and a *status*). **The owner
overruled the architect on it, and the objection is on the record.**

## Related
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]]
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]]
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]]
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]
- [[tasks/give-the-selector-a-status-rung-and-a-lowest-first-choice]]
- [[tasks/backfill-a-sprint-status-onto-every-existing-sprint-plan]]
- [[tasks/build-the-producer-only-sprint-movers]]
- [[tasks/teach-the-roles-what-current-sprint-means]]
- [[tasks/archive-sprint-5-move-the-plan-into-sprints-done]]
- *Added 2026-09-16 (sync `b4a1a52`→`a351cb6`, closing a one-way link):* [[systems/fkit]] — the team page carrying the `MOVERS` invariant this ADR widened from two movers to four
