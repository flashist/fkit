# Warn when filing or re-pointing puts a blocker in a later sprint than its dependents

## ID
0494

## Sprint
Sprint 10

## Priority
P14

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.
> The sprint ship-loop's per-task plan approval, given live by the owner, is where that word is given.

**The incident and the owner rulings** are recorded in full in
[`0492`](../../done/0492-flag-a-sprint-task-that-hard-depends-on-an-open-later-sprint-task-as-a-dashboard-drift-record/brief.md)'s
*Context*. In short: in a consuming project (geoconflict), a sprint task's `Depends on:` was re-pointed
at a new task filed into the **next** sprint, and 5 tasks behind it came to wait on that sprint too.
The producer that filed it gave no warning.

**Owner ruling (b), 2026-10-05:** *"Warn when filing"* — `/fkit-task-brief`, and any producer edit that
re-points a `Depends on:` line, **warns — never refuses** — when the result puts a blocker in a later
sprint than a task that depends on it.

**Why warn and never refuse.** That project had a standing owner rule: *split build and verify; put the
verify task at the top of the next sprint*. A refusal would overrule legitimate owner rulings. The
warning makes the knock-on visible; the owner decides.

**Overlap, flagged — not a dependency.** ADR-052 phase-5 tasks `0450` (`/fkit-task-brief` through the
board) and `0457` (agent prompts) rewrite the same files. Neither has started. Build on the current
tree; whichever lands second carries the other.

## What to build

1. **In `/fkit-task-brief`** (`claude/skills/fkit-task-brief/SKILL.md`): a step after the board update
   that checks the result. When a new brief's placement, or a `Depends on:` line it writes, means an
   open task on sprint `N` hard-depends on an open task in a **later or not-yet-started sprint or the
   Backlog board**, the skill **warns**:
   - naming every dependent (direct, and how many stand behind it), the blocker, and both sprints;
   - offering the three ways out: **move the dependents to the blocker's sprint**, **place the new task
     earlier**, or **accept it and record why** in the brief's `## Notes` (and the board addendum).
   - In a session, the warning is an `AskUserQuestion`; in a spawned consult, it is returned as a
     `NEEDS-DECISION` in the report. It never blocks filing and never moves anything by itself.
2. **The same warning for any producer edit that re-points a `Depends on:` line** — state it in
   `claude/agents/fkit-producer.md` (behavioural rules), so it covers edits made outside the skill.
3. **How the check is done:** reuse `0492`'s `drift` record — run `dashboard.sh` on the affected board(s)
   after the edit and read the record — rather than a second, hand-written detection rule. If the plan
   finds that cannot cover a case (e.g. the dependent is on a different board from the one edited),
   say so and propose the smallest addition.
4. Edit the canonical sources under `claude/`, never the `.claude/` copies.

## Verification steps

1. A fixture walk-through: filing a brief into a later sprint and re-pointing an existing sprint-`N`
   task's `Depends on:` at it → the skill's step produces the warning naming the dependents, the blocker,
   both sprints, and the three options. Show the text in the review.
2. Filing into the **same** sprint, or a blocker that is `✅ Done`, produces **no** warning.
3. The skill text says **warn, never refuse**, and that a spawned producer returns it as a
   `NEEDS-DECISION`.
4. `fkit-producer.md` carries the rule for hand edits of a `Depends on:` line.
5. `node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js` passes, and any test
   pinning `/fkit-task-brief`'s step list passes or is updated with the reason stated.

## Notes

- **Depends on:** 0492 (the check reads the `drift` record it creates).
- **Blocks:** nothing.
- Filed 2026-10-05 by a spawned `fkit-producer` on `fkit-lead`'s instruction, under the owner rulings
  recorded in `0492`. ⚠️ `P14` is append rank, NOT a merit ranking — append is also the owner's placement ruling
  (*"Sprint 10, at the end"*). **On merit this belongs directly below `0493`, where it is**, because
  both consume `0492`; the order between the two is free.
