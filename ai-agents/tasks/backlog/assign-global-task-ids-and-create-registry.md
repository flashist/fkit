# Assign a global task ID to every brief and write down the allocation procedure

## Sprint
Sprint 2

## Priority
75

## Status
🔲 Backlog

## Context

The task-folder restructure ([task 74](../done/design-task-folder-structure-and-id-scheme.md)) names folders
by a **global task ID** — a concept that does not exist in this project today. No brief carries an
`## ID` field; the numbers used in conversation are sprint-scoped priority and collide across sprints.

This task assigns the IDs **without moving a single file**. That separation is deliberate: ID
assignment is the one part of the migration that is **permanent and unrecoverable if wrong** — a
collision or a reused number cannot be cleanly undone once links point at it — while the file moves
themselves are mechanical and reversible. Shipping the IDs first makes them reviewable on their own,
against an unchanged tree.

**⚠️ Rescoped 2026-07-19 — owner ruled against a stored registry file** (task 74's design spec §3.6).
The brief's original title and scope named a registry; **no registry file is created.** Authority for
IDs rests on exactly two carriers: the **folder name** (once task 76 creates the folders) and the
brief's **`## ID`** field, reconciled by an `id-mismatch` drift check in `dashboard.sh`. Allocation is
derived from the tree (`1 + max`), not read from a file. *(The filename of this brief still says
`-and-create-registry`; it is left alone so inbound links keep resolving — task 76 renames it.)*

**Depends on task 74** for the ID format, the allocation rule, and the ordering rule that decides which
existing task gets which number.

## ⚠️ Pin the corpus to a commit SHA before starting

**The set of briefs is a moving target, and the assignment must not move with it.** The corpus went
from 89 to 94 to 95 over a matter of days — twice while a brief describing it was being written. If the
assignment is derived at whatever moment the work happens to run, **two people applying the same rule
get different IDs**, which is exactly the bar task 74's design is built to meet (*"two people applying
it to the same set produce identical IDs"*). Deriving from "whatever is in the tree right now" fails
that bar silently.

**Before any ID is assigned:**

1. Record a **named commit SHA** in this brief, under a `## Pinned corpus` heading, with its date.
2. Derive the ordered brief list **as of that SHA** (`git ls-tree`), not from the working tree.
3. Assign IDs from that list.

**Any brief created after the pin is not in the backfill.** It gets its ID from the ordinary allocation
procedure (`1 + max`) like any new task — it does **not** trigger a re-derivation. Re-deriving after a
new brief lands would renumber tasks that already have IDs, which is precisely the permanent,
unrecoverable failure this task exists to prevent.

**Deriving the *count* at execution time is still correct** — that is how you verify every brief in the
pinned set got a field. It is the **assignment** that is pinned, not the counting.

## What to build

- **An `## ID` field on every existing brief**, across `backlog/`, `done/`, and `cancelled/`, in the
  format and position task 74's design specifies. **Derive how many briefs that is — do not trust any
  number written down anywhere**, including in this brief:
  `ls ai-agents/tasks/{backlog,done,cancelled}/*.md | wc -l`.
- **The allocation procedure written down** where the next person will find it — how a new brief gets
  the next ID (the `1 + max` derivation from task 74's design), and what a session does to avoid
  claiming an ID another session is already using.

**No registry file. No file moves, no folder creation, no link rewriting.** The moves are task 76; the
registry is not built at all.

## Verification steps

- **Every brief carries exactly one `## ID`.** Count the briefs with an `## ID` field and confirm it
  equals the total brief count — **derive both numbers at execution time, do not compare against a
  figure written in a brief or on the sprint board.** (Counting is live; the *assignment* is pinned.)
- **Every ID is unique.** Sort the IDs and confirm no duplicates; this is the assertion the whole task
  exists to guarantee.
- **A `## Pinned corpus` section names a commit SHA and a date**, and it was recorded *before* the
  assignment was made — not backfilled afterwards.
- The IDs follow task 74's ordering rule reproducibly: **re-deriving the assignment from the rule
  against the pinned SHA** produces the same result. Re-derive it as the check, do not assume it.
- Any brief created after the pin is either absent from the backfill or carries an ID allocated by
  `1 + max` — **no brief in the pinned set was renumbered.**
- The allocation procedure is written down and a reader can apply it to allocate the next ID without
  asking anyone.
- `git status` shows **no** file renames or deletions under `ai-agents/tasks/` — content edits only,
  and **no new registry file.**
- The dashboard still runs clean: `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md`
  reports the same counts as before this task, with no new drift records.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 74 — hard**, including its owner-approval gate and the recorded ADR.
- **Blocks: task 76.**
- **This task is deliberately reversible.** It edits fields; nothing moves. If the ID scheme turns out
  wrong, it is undone by reverting content — which is why it is separated from the migration rather
  than folded into it.
- The dashboard verification step matters more than it looks: it proves that adding the `## ID` field
  did not disturb the `## Status` parsing that `dashboard.sh` depends on.
