# Add an exit-table row for a failed **Build / Verify / Review** spawn in the sprint loop

## ID
0208

## Sprint
Sprint 2

## Priority
186

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Follow-up 2 of `0202`'s review** — finding `R5`, verdict **CORRECT**, classified *Defect (process gap,
not documentary)*, dispositioned by the owner as `deferred → follow-up (owner ruling)`. The ledger is
`ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/review.md`
(row `R5`).

`/fkit-sprint-ship-loop`'s exit table (**§5.4 — "Stop conditions — the driver's exit table"**) enumerates
every terminal state the driver may end a task in. Verified first-hand 2026-08-03 at
`claude/skills/fkit-sprint-ship-loop/SKILL.md:243-256`, the table has nine rows and covers:

- sprint shipped / sprint drained
- plan rejected
- **Blocked — verification** (the no-progress budget)
- **Blocked — review non-convergence**
- owner decision pending
- dependency deadlock
- **Blocked — hand-off didn't land** — *a failed **producer** spawn*
- no Codex, degraded

**There is no row for a Build, Verify or Review spawn that fails outright** — the worker dying, being
denied, or returning nothing. Only the *producer* spawn (the close) has a failure row.

### Why the gap matters now, and did not before

Since `0202` the driver writes `<task-folder>/plan.md` **at plan approval, before the Build worker is
spawned**. So a Build spawn that fails now leaves a **durable approved-plan artifact on disk for a task
that is not being worked** — an orphaned artifact, with the task's status telling a future driver
nothing about it.

**The resume guidance for exactly this window exists, and is in the wrong place.** It sits in
`ai-agents/tasks/done/0202-…/worklog.md:60-74` — a task worklog. **No future driver reads another task's
worklog.** Guidance that only a human archaeologist will find is not guidance the loop has.

## What to build

**One new row in the §5.4 exit table, plus whatever minimal supporting text that row needs. Nothing
else.**

1. Add a terminal-state row to the exit table at
   `claude/skills/fkit-sprint-ship-loop/SKILL.md` §5.4 covering a **Build / Verify / Review spawn that
   fails, is denied, or returns nothing**. (⚠️ **Re-verify the line numbers at implementation time** —
   `0203` and `0164` also edit this file and will move them.)
2. The row must say what the driver writes as status, and it must satisfy the section's own stated
   **invariant** immediately below the table: *"no path ends in silence"* — accurate status in **both**
   the brief's `## Status` **and** the sprint row, plus an owner-visible report.
3. **The row must say what happens to the already-written `plan.md`.** This is the whole reason the gap
   is worth a row: state whether it is left in place, and what a resuming driver should do when it finds
   a `plan.md` for a task whose status is not `🔄 In progress`. Lift the substance from
   `0202`'s `worklog.md:60-74` rather than re-deriving it, then put it somewhere a driver actually reads.
4. Keep it consistent with the existing **Blocked — hand-off didn't land** row's shape — same table, same
   voice, same level of detail. Do not restructure the table.

⛔ **Out of scope:** the *"Rules that make this honor the ADRs"* bullet (`0203`), the Build row's content
requirement (`0164`), any hook (`0204`), `claude/agents/fkit-coder.md`, `/fkit-task-ship-loop`, and
`ai-agents/wiki-vault/`.

⚠️ **This file is contended.** `0203` edits the Rules bullet and `0164` edits the Build row of the same
`SKILL.md`. §5.4 is a different region from both, but **do not work them in parallel** — whichever lands
second re-verifies its coordinates.

## Verification steps

1. §5.4's exit table contains a row whose trigger is a failed / denied / empty **Build, Verify or
   Review** spawn — distinct from the existing **Blocked — hand-off didn't land** row, which stays about
   the **producer** spawn.
2. The new row names the status the driver writes, in **both** locations (brief `## Status` and sprint
   row), satisfying the no-path-ends-in-silence invariant.
3. The new row (or adjacent text) states what happens to an already-written `<task-folder>/plan.md`, and
   what a resuming driver does when it finds one.
4. **The guidance is no longer only in `0202`'s worklog** — a driver reading `SKILL.md` alone now has it.
5. **Change surface is exactly one file** — `claude/skills/fkit-sprint-ship-loop/SKILL.md`.
   `git diff --stat` shows nothing else.
6. **Frontmatter guard green:** `node --test test/skill-frontmatter.test.js` passes.
7. **`npm test` passes.** Record pass/fail/suite counts.

## Notes

- **Depends on:** nothing hard. `0202` has shipped, which is what makes the gap live.
- **Blocks:** nothing.
- **Coordinates with `0203` and `0164`** — same file, different regions. Adjacency, not dependency.
- **⚠️ Priority 186 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0203`** — it repairs a **running control** (the driver's own
  exit table, executing right now) rather than a record, and the hole it fills was opened by `0202`
  landing. That puts it above the three documentary corrections appended near it (`0205`, `0207`) and
  above the wiki ingest (`0206`). **Append rank and merit diverge by roughly four places** — a real
  divergence, but a small one. Filed by a spawned producer with no owner channel, which never re-ranks
  (ADR-035).
- **Source:** `0202`'s review ledger, row `R5`; the orphan-window guidance in `0202`'s `worklog.md:60-74`.
