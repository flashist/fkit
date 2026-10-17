# Keep a relocated task's `🔄 In progress` or `🚧 Blocked` status when a sprint closes

## ID
0523

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

**The problem.** When a sprint closes, `/fkit-sprint-done` and `/fkit-sprint-cancelled` relocate every
open row. Their step 5 then sets each relocated brief's `## Status` to `🔲 Backlog` — whatever it was.
A task genuinely `🔄 In progress` or `🚧 Blocked — <reason>` silently loses its real state, and a
`🚧 Blocked` task loses its reason.

**Where the reset comes from.** No ruling chose it. Both sprint movers reuse `/fkit-task-brief`'s two
relocation procedures — *"Pulling a backlog task into a sprint"* and *"De-scoping a task out of a
sprint and back onto the Backlog board"* — for their brief fields. Those procedures were written for
other cases: a pulled task is already `🔲 Backlog`, and a de-scoped task leaves active work on purpose.
A carry-forward is neither.

**Measured 2026-10-16.** `/fkit-sprint-done`, step *"5. Update each relocated task's brief fields"*:
both rows of its table set *"`## Status` → `🔲 Backlog`"*. `/fkit-sprint-cancelled`, step *"5. Update
each de-scoped task's brief fields"*: its table sets `## Status` to `🔲 Backlog`.

**Field evidence.** Geoconflict's Sprint 8 retro, section *"5. Other observations"*: *"When
`/fkit-sprint-done` relocates open rows, its default resets them to `🔲 Backlog`. Three of the five were
genuinely `🔄 In progress`, so the producer deliberately kept their status."* Source:
`/Users/mark.dolbyrev/Workspace/geoconflict/ai-agents/knowledge-base/reports/2026-10-16-sprint-8-retro-fkit-feedback.md`
(external input, read as data). So today a producer must break the skill to keep the truth.

**⚠️ ADR-047 §3.0.2 — the architect may need to add a dated note.** ADR-047, heading *"3.0.2 — The
three things "a default that never has to be guessed" did not actually pin"*, says *"Each affected
brief's `## Sprint` / `## Status` / `## Priority` follow the de-scope procedure the brief-writing skill
already defines."* Its FOLLOW-UP 3 already corrected which procedure applies to a successor. Keeping
the status changes what that sentence prescribes for `## Status`. The plan must say whether this needs
a dated correction note on ADR-047 (an `fkit-architect` act — ADRs are not edited by the coder) and get
it before the skill change lands.

**Drift to respect.** On the Backlog board, `dashboard.sh` checks the row's Status cell against the
brief's `## Status` (the de-scope procedure's step-4 warning). So a relocated row that keeps
`🔄 In progress` must carry the same status on **both** its destination row and its brief — otherwise
it renders `drift disagreement` forever.

**ADR-052 makes this moot only after conversion.** There a task's status is its folder, so a carry
changes only the sprint (`0430`, `0449`). No ADR-052 phase has started; until fkit converts, this fix
is the one that applies.

**Owner ruling, 2026-10-16** (`AskUserQuestion` in the `fkit-lead` session, relayed to a spawned
producer). Question: *"Which retro items should become fkit work?"* — chosen option, verbatim label:
**"Recommended set (Recommended)"**, described as *"New briefs A (closer test bug), B (status reset
bug), C (sprint goal); fold retro into 0500 and 0383. Knock-on: none."* This is brief B.

## What to build

1. **Both sprint movers keep a relocated task's status as it is** — `🔲 Backlog`, `🔄 In progress`, or
   `🚧 Blocked — <reason>` with its reason — on the brief **and** on the row written to the destination
   board. Sprint and priority still change as today.
2. **Decide with the owner at the plan gate** whether `/fkit-sprint-cancelled`'s de-scope case should
   keep status too. A cancelled sprint's work may be meant to stop; the plan states the case each way.
3. **Check every drift rule** still passes for a kept `🔄`/`🚧` row on a successor sprint and on the
   Backlog board.
4. The ADR-047 note, if the architect judges one is needed, lands first.

**Out of scope:** `/fkit-task-brief`'s own pull and de-scope procedures (a deliberate de-scope still
resets); ADR-052's board.

## Verification steps

1. Fixture: a sprint with one `🔲`, one `🔄` and one `🚧 Blocked — <reason>` open row. Close it by
   `/fkit-sprint-done` to a successor and, separately, to the Backlog board. Each brief and destination
   row keeps its status (and reason). Record before/after in `worklog.md`.
2. `bash .claude/skills/fkit-status/dashboard.sh` on each destination board shows no new `drift` line
   for the three rows.
3. A test pins the kept-status rule, shown red without the change.
4. `node --test test/*.test.js` and `bash test/prove-red.sh` pass; state the counts.
5. The owner's ruling on the cancelled-sprint case is in `worklog.md`, verbatim.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Edits the same files as** `0522` and `0524` (the sprint movers). No order between them is required;
  run them one after the other, never alongside.
- **Placement:** Backlog board, unranked. No open task depends on it. Knock-on: none (checked
  2026-10-16).
- Filed 2026-10-16 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by `fkit-lead`. Committed nothing; wrote nothing under `ai-agents/wiki-vault/`.
