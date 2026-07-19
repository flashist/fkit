# Assign global task IDs to all 89 briefs and create the ID registry

## Sprint
Sprint 2

## Priority
75

## Status
🔲 Backlog

## Context

The task-folder restructure ([task 74](design-task-folder-structure-and-id-scheme.md)) names folders
by a **global task ID** — a concept that does not exist in this project today. No brief carries an
`## ID` field; the numbers used in conversation are sprint-scoped priority and collide across sprints.

This task creates the IDs and the registry **without moving a single file**. That separation is
deliberate: ID assignment is the one part of the migration that is **permanent and unrecoverable if
wrong** — a collision or a reused number cannot be cleanly undone once links point at it — while the
file moves themselves are mechanical and reversible. Shipping the IDs first makes them reviewable on
their own, against an unchanged tree.

**Depends on task 74** for the ID format, the allocation rule, the registry shape, and the ordering
rule that decides which existing task gets which number.

## What to build

- **The registry file**, at the path task 74's design specifies, populated with one entry per existing
  task — all 89, across `backlog/`, `done/`, and `cancelled/`.
- **The ID recorded on each brief**, if and only if task 74's design ruled that `## ID` is a brief
  field. If the design ruled the folder name is the sole carrier, this task creates the registry only
  and says so.
- **The allocation procedure written down** where the next person will find it — how a new brief gets
  the next ID, and what prevents two concurrent sessions claiming the same one.

**No file moves, no folder creation, no link rewriting.** Those are task 76.

## Verification steps

- The registry contains exactly 89 entries — cross-check against
  `ls ai-agents/tasks/{backlog,done,cancelled}/*.md | wc -l`.
- **Every ID is unique.** Sort the ID column and confirm no duplicates; this is the assertion the whole
  task exists to guarantee.
- Every entry maps to a brief file that actually exists, and every brief file appears in exactly one
  entry — the mapping is a bijection, checked in both directions.
- The IDs follow task 74's ordering rule reproducibly: re-deriving the assignment from the rule
  produces the same result.
- `git status` shows **no** file renames or deletions under `ai-agents/tasks/` — only content edits
  and the new registry file.
- The dashboard still runs clean: `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md`
  reports the same counts as before this task, with no new drift records.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 74 — hard**, including its owner-approval gate and the recorded ADR.
- **Blocks: task 76.**
- **This task is deliberately reversible.** It adds a file and edits fields; nothing moves. If the ID
  scheme turns out wrong, it is undone by reverting content — which is why it is separated from the
  migration rather than folded into it.
- The last verification step matters more than it looks: it proves that adding the ID field did not
  disturb the `## Status` parsing that `dashboard.sh` depends on.
