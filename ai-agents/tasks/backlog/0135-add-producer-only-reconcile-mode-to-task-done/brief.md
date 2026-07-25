# Add the sanctioned producer-only reconcile mode to `/fkit-task-done` — and mirror both ship-loops as one unit

## ID
0135

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Implements the ADR from task **0134**. Today a close that moves a task folder into
`ai-agents/tasks/done/` but leaves a status row or an href stale is repairable by **nobody but the owner** —
`/fkit-task-done` stops on an already-moved folder (`claude/skills/fkit-task-done/SKILL.md:60-64`, its one
exception owner-only) and `✅ Done` is skill-gated, never hand-editable (`:265-267`). Task 0123's review
finding **R1** proved the previously-written remedy (*"re-spawn the producer to reconcile"*) was literally
**unperformable**; both loops now report the limit honestly instead of pretending to fix it.

This task closes the gap for real. **Its scope is three files, and they move as one reviewed unit** —
because the same doctrine is stated in all three, and 0123's R1 was itself a defect in *shared* doctrine
rather than in one file.

## What to build

Exactly what ADR 0134 rules — **do not re-decide any of it here**. Expected shape, subject to the ADR:

1. **`claude/skills/fkit-task-done/SKILL.md`** — a sanctioned **producer-only** reconcile mode for an
   already-moved folder: a third branch alongside the existing stop and the owner-verification upgrade.
   It performs the status/href updates only, never a move, and carries the ADR's **must-never** list
   verbatim in its own prose (never upgrade the agent-closed marker; never mint a `✅ Done` where no landed
   close exists; refuse when both locations already agree).
2. **`claude/skills/fkit-task-cancelled/SKILL.md`** — the mirror mode, **only if ADR 0134 rules it in
   scope.** If the ADR rules it out, say so in the worklog and change nothing here.
3. **Both ship-loops, in the same change** —
   `claude/skills/fkit-sprint-ship-loop/SKILL.md` and `claude/skills/fkit-task-ship-loop/SKILL.md`. Their
   half-landed-close recovery branches currently escalate to the owner **because no agent could act**. Once
   an agent can act, that reasoning is false in both files and both must route to the new mode.
   0123's accepted residual states this requirement directly: *"both loops must be updated together."*

### ⚠️ The three ADR-033 carve-out sites — this task is the sanctioned occasion to revisit them

0123 round 3 added a carve-out at **three** invariant sites, each naming the half-landed close as *the
single sanctioned disagreement* between the brief's `## Status` and the sprint row:

- `claude/skills/fkit-sprint-ship-loop/SKILL.md:218-223`
- `claude/skills/fkit-task-ship-loop/SKILL.md:110-115`
- `claude/skills/fkit-task-ship-loop/SKILL.md:205-207`

0123's ledger carries a standing warning — **"do not fix any of those three carve-outs away"** — because
removing one restores the R6 contradiction. **That warning is aimed at a casual later reader, not at this
task.** The carve-outs exist *only* because no agent could lawfully reconcile the disagreement. If this
task makes reconciliation possible, the carve-outs' stated justification changes, and leaving them
unexamined ships a second generation of the same defect.

**So: do not silently delete them, and do not silently keep them.** ADR 0134 verification step 5 rules on
them. Carry that ruling, cite it at each site, and state in the worklog what happened to all three. Line
numbers above are from 2026-07-25 — **re-derive them, never carry them forward** (0123's R7/R9 were exactly
this drift).

## Verification steps

1. `/fkit-task-done` has a producer-only reconcile branch for an already-moved folder, matching ADR 0134,
   with the must-never list present in its prose.
2. The branch **refuses** for a non-producer identity and **refuses** when both locations already agree.
3. It never writes plain `✅ Done` over `✅ Done (agent-closed — not owner-verified)`, and never creates a
   `✅ Done` where no landed close exists. State how you verified each — by reading the branch, and by a
   dry-run if one is possible.
4. `/fkit-task-cancelled` matches the ADR's ruling (mode added, or explicitly out of scope and untouched).
5. **Both** ship-loops' half-landed-close recovery routes to the new mode; neither still claims no agent
   can act. Diff-check both, not one.
6. **All three carve-out sites are accounted for** — each either amended, kept with a restated reason, or
   removed, per ADR 0134 step 5, and each named individually in the worklog with its re-derived line range.
7. `node --test test/*.test.js` is green. ⚠️ **State plainly that this proves no regression, not the
   change** — no test reads any `SKILL.md` at runtime (0123 established this; task 0136 is the partial fix,
   and it guards frontmatter only, not body prose).
8. `test/skill-ownership-hook.test.js` still asserts producer-only movers (this task must not widen the
   ADR-033 §1 grant as a side effect).
9. Refresh the gitignored `.claude/skills/` mirrors for every skill touched, and `diff` each against its
   canonical source.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** **0134** (the ADR — hard; the must-never list is the deliverable and it is not this
  task's to invent) **and 0124** (which rewrites both movers' SKILL prose to producer-only; landing this
  first would collide in `fkit-task-done/SKILL.md` and `fkit-task-cancelled/SKILL.md`).
- **Blocks:** nothing.
- **Source:** task 0123 review findings **R1**/**R6**; recorded as an accepted residual in
  [0123's ledger](../../done/0123-route-sprint-ship-loop-close-to-producer/review.md) whose *"re-raise
  only if"* condition is **this task landing**.
- **Filed 2026-07-25** by the producer on the 0123 ship-loop's hand-off. Sibling: **0134** (the ADR).
- **⚠️ This is a four-file doctrine change, not a one-file edit.** 0123's R1 was a defect in shared
  doctrine that had *already shipped* into the closed task 0122's file. The same class of mistake here
  means one loop reconciles and the other still escalates. Review the set together or not at all.
- **⚠️ Line-number citations in this brief are from 2026-07-25 and will drift.** Re-derive every one before
  editing; 0123 corrected the same citations twice (R7, then R9).
- No commit — leave the coordinated edit in the working tree (the four files must move together when the
  owner does commit).
