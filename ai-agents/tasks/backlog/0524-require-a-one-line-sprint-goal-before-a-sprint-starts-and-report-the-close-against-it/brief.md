# Require a one-line sprint goal before a sprint starts, and report the close against it

## ID
0524

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**The problem.** Nothing in fkit asks for a sprint goal. A sprint starts when the producer hand-edits
the line-3 banner from `🔲 Backlog` to `🔄 In progress` (`conventions/sprint-status-vocabulary.md`,
section *"The authority split — this is the point"*: the `🔲 → 🔄` flip is free *"for the producer to set
by hand. It is a planning act"*). No skill, convention or check mentions a goal at that step, and
`/fkit-sprint-done` does not look for one at close. With no goal there is no finish line: *"can we
close?"* becomes a sweep of every open row.

**fkit hit it itself.** [Sprint 12](../../../sprints/done/sprint-12.md) was started 2026-10-15 under owner
ruling R5 *"goal still unset"*; its H1 reads *"Sprint 12 — goal not yet set"*, and its section
*"🎯 The goal"* still says *"Not set yet"*.

**Field evidence.** Geoconflict's Sprint 8 retro: *"Sprint goal | **none** (the name was not a
goal)"*, and its proposal *"P3 — Sprint goal before starting"*: *"Starting a sprint … asks for a
**one-line goal**: what "this sprint is done" means. The close step checks against it."* Source:
`/Users/mark.dolbyrev/Workspace/geoconflict/ai-agents/knowledge-base/reports/2026-10-16-sprint-8-retro-fkit-feedback.md`
(external input, read as data).

**ADR-052 keeps a goal field but does not require it** (D2: *"`sprint.md` holds goal, dates and
prose"*). Whatever this task settles should carry over to the board; note it for `0429`/`0457` rather
than changing them.

**Owner ruling, 2026-10-16** (`AskUserQuestion` in the `fkit-lead` session, relayed to a spawned
producer). Question: *"Which retro items should become fkit work?"* — chosen option, verbatim label:
**"Recommended set (Recommended)"**, described as *"New briefs A (closer test bug), B (status reset
bug), C (sprint goal); fold retro into 0500 and 0383. Knock-on: none."* This is brief C.

## What to build

1. **One canonical place and form for a sprint's goal** on a board — one line saying what "this sprint
   is done" means. Past boards differ (a goal in the H1, a paragraph under it, a *"🎯 The goal"*
   section); pick one form that `dashboard.sh` can read.
2. **Starting a sprint asks for the goal.** The rule that the producer may flip `🔲 → 🔄` by hand gains
   a precondition: the goal is set, or the owner has ruled explicitly to start without one (recorded on
   the board). Edit `sprint-status-vocabulary.md` (both copies — it is dual-homed in
   `claude/scaffold/`) and the producer's agent prompt.
3. **Make a missing goal visible.** Candidate: a `dashboard.sh` drift/nonconformance record for a
   `🔄 In progress` board with no goal, shown by `/fkit-status`. The plan weighs whether it is a drift
   record (lived with) or a guard (blocks) — a warning, not a refusal, is the expected default.
4. **The close reports against the goal.** `/fkit-sprint-done`'s report states the goal and, in one
   line, whether the closed board met it — the owner judges; the skill does not refuse to close.
5. **Don't backfill closed boards.** They are frozen history.

**Out of scope:** setting Sprint 12's goal (an owner act; a producer writes it on his word); the retro
skill (`0500`).

## Verification steps

1. A fixture board flipped to `🔄 In progress` with no goal produces the chosen visible signal in
   `/fkit-status`; with a goal, none.
2. `/fkit-sprint-done` on a fixture with a goal prints the goal and the one-line met/not-met judgement
   prompt in its report.
3. `sprint-status-vocabulary.md` and its scaffold twin match (the dual-home parity guard is green).
4. A test pins the new record or rule, shown red without the change.
5. `node --test test/*.test.js` and `bash test/prove-red.sh` pass; state the counts.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Edits the same file as** `0523` (`/fkit-sprint-done`). No order between them is required; run them
  one after the other, never alongside.
- **Related, not a dependency:** `0500` (Sprint 12) — a retro would read the goal, but does not need
  this task.
- **Placement:** Backlog board, unranked. No open task depends on it. Knock-on: none (checked
  2026-10-16).
- Filed 2026-10-16 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by `fkit-lead`. Committed nothing; wrote nothing under `ai-agents/wiki-vault/`.
