# Status report format

> How the producer answers *"what's the status?"* — the conventional shape of a project status
> briefing in this project. **Working draft, iterating with the owner.** Once settled, this gets baked
> into `claude/agents/fkit-producer.md` (session-start briefing) and a `/fkit-status` skill
> (on-demand), so it persists across sessions and ships to every fkit project.

## The standard being aimed at

**Answer like a producer being asked in person, not like a dashboard being rendered.**

The owner asked for *"as if I ask the producer of the project what the status is, and they provide it
in a simple yet informative way."* That is the whole spec. A real producer doesn't recite the board —
they tell you where things stand, what's stuck, and what they need from you. Short, plain, honest.

## The structure — six beats, then the board

**1. The headline — one sentence.**
Where the project actually is, in plain words. If someone reads only this line, they should not be
surprised by anything below it. Lead with the truth, not the framing.

**2. Where we are.**
Sprint name, progress (`N of M done`), and what phase that actually means. One or two lines.

**3. What's moving.**
What is genuinely in progress *right now*, and who has it. **If nothing is moving, say so plainly** —
"nothing's in progress" is a real and important status, not an empty section.

**4. What's next.**
The **one** thing to pick up, and why it's that one. Not a ranked list of five — a recommendation.

**5. What's in the way.**
Blockers and *live* risks. **Only real ones.** If nothing is blocked, say "nothing's blocked" and move
on. Never manufacture a risk to fill the section, and never restate a risk the owner has already
absorbed — repeating known risks trains them to skim.

**6. What I need from you.**
Decisions only the owner can make. **If nothing — say "nothing, you're clear."** This section exists to
be empty as often as it's full; an owner who sees it populated should trust that it matters.

**7. The dashboard — the task board, last.**
A compact table of the sprint's tasks with these columns, in this order:

| Column | Contents |
|---|---|
| **Status** | The task's real state, rendered **exactly as the vocabulary writes it, marker and all** — see [`task-status-vocabulary.md`](task-status-vocabulary.md): `🔲 Backlog` · `🔄 In progress` · `🚧 Blocked — <reason>` · `✅ Done` · `⛔ Cancelled (YYYY-MM-DD) — <reason>` · `➡️ Moved to [Sprint N](…) — priority M`. **Never invent a value** (no "Not started", no "WIP") — if the board shows a distinction the vocabulary can't express, the board is lying. |
| **#** | Priority number, matching the sprint plan. |
| **Task** | Short title — the same wording the sprint plan uses. |
| **Filename** | The brief's filename, linked to its path (`backlog/`, `done/`, or `cancelled/`). |
| **Next step** | What actually unblocks or advances it — "ready", "after 4", "waiting on owner". |

It goes **at the end, after the answer** — it is reference material, not the briefing. The reader who
wants the summary stops at beat 6; the reader who wants the detail scrolls.

- Keep it to **one row per task**, no wrapped prose in cells.
- Show the **real** status of every task — including cancelled/moved rows if the sprint carries them.
  A board that hides its dead rows is a board that lies about scope.
- Add a **one-line roll-up** under it so the shape is legible without counting rows:
  `N done · N in progress · N blocked · N backlog · N cancelled · N moved  —  of M`.
  Print **only the non-zero terms**, and **always print `— of M`** (the sprint's total task count) —
  the total is what makes an under-counting line structurally impossible: `4 done · 10 cancelled — of
  14` cannot be mistaken for a 4-task sprint, and the terms must sum to M or a row was missed. The
  roll-up names states in the **vocabulary's** words — `backlog`, never "not started".
- If the board and reality disagree, **the prose above wins and the drift gets flagged** (see Rules).
  Never quietly render a stale board as if it were true.

## Rules

- **Short by default.** Aim for something readable in under 30 seconds. Detail is available on
  request — lead with the answer, not the evidence.
- **Prose and short bullets in beats 1–6. The only table is the dashboard (beat 7).** A table is a
  report; beats 1–6 are an answer. Don't turn the answer back into a report.
- **Sparing emphasis.** Bold the headline and genuine blockers. **No decorative emoji in the prose
  beats (1–6)**, no 🔥 — that kind of decoration is noise once the owner already knows the plan. **The
  dashboard's Status column is the exception**: it carries the canonical emoji markers from
  [`task-status-vocabulary.md`](task-status-vocabulary.md) (`🔲 🔄 🚧 ✅ ⛔ ➡️`) verbatim, because those
  markers *are* the vocabulary — not decoration.
- **Say "nothing" when it's nothing.** Empty sections are information. Padding them is how a status
  report starts lying.
- **Lead with bad news.** If something slipped, broke, or was missed, it goes in the headline — not
  buried under progress. The owner should never learn a problem from the bottom of a list.
- **Flag drift.** If the board says one thing and reality says another (a stale marker, a task done
  but not closed), say so — reconciling the record is the producer's job.
- **The working tree is not the record — committed history is.** `git status`/`git diff` answer "what
  changed since the last commit," not "does this work exist" or "is this committed." See
  [`evidence-before-assertion.md`](evidence-before-assertion.md).
- **Skip what hasn't changed.** On a repeat status in the same session, report the *delta*, not the
  whole state again.

## Anti-patterns — what this replaces

- A 40-line rendering of the full status table with a dependency graph. That's the board; the owner
  can read the board. They asked *you*.
- Restating every risk in the sprint plan every time. Say it once; after that, only say it if it
  changed or became live.
- Sections that exist because the template has them, filled with "N/A"-grade content.
- Burying "nothing is actually in progress" under a wall of planning detail.
