# Fix `dashboard.sh` drift rule 2 — a task may move more than once

## ID
0234

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Filed on a named owner ruling** taken via `AskUserQuestion` in a live `fkit lead` session on
**2026-08-06** — verbatim: **"File it against dashboard.sh."**

### The defect, measured today

The Sprint 2 → Sprint 3 rollover (task `0185`) pulled `0181` and `0182` off the Backlog board and into
Sprint 3. The **archived** Sprint 2 board now emits two **permanent** drift records:

```
drift disagreement 0181 plan="➡️ Moved to [Backlog](../backlog.md)" brief_sprint="Sprint 3" moved_target="Backlog"
drift disagreement 0182 plan="➡️ Moved to [Backlog](../backlog.md)" brief_sprint="Sprint 3" moved_target="Backlog"
```

**Both board rows are correct and both briefs are correct.** Nothing was done wrong. The Sprint 2 row
records, truthfully, that the task left Sprint 2 for the Backlog board. The brief records, truthfully,
that the task now lives in Sprint 3. There is **no edit to either file that reconciles them without one
of them lying.**

### Where the assumption is

`dashboard.sh` computes disagreement drift in the `-- disagreement drift --` block, in the arm
introduced by the comment *"Rule 2: but DO check the Moved target against the brief's `## Sprint`."*
That arm compares the row's **frozen** `moved_target` against the brief's **current** `## Sprint`
field, and reports `drift disagreement` when they differ.

That comparison is only sound if **a task moves at most once.** The lifecycle the Backlog board itself
documents allows more: `Sprint N → Backlog → Sprint M` is a sanctioned, five-edit reverse move followed
by an ordinary three-edit forward pull. The moment a task takes the second leg, the first leg's frozen
marker can never equal the brief's current sprint again.

### Scope — the ceiling is 45 rows

**45 rows on the archived Sprint 2 board read `➡️ Moved to [Backlog]`.** Every one of them that is ever
pulled into a sprint adds another permanent drift record with no possible repair. Two exist today; the
ceiling is 45, and it only grows as more reverse moves happen.

**This is not caused by the archival.** The records read identically had `sprint-2.md` stayed at the
top of `ai-agents/sprints/`. Do not scope this as rollover fallout.

### ⛔ The tempting wrong repair — prohibited

**Do NOT "fix" this by rewriting, falsifying, or deleting a `➡️ Moved` marker on any board.** The
Sprint 2 rows say the task moved to Backlog because **the task moved to Backlog.** Changing that row to
read `➡️ Moved to [Sprint 3]` asserts a transition that never happened and erases a real one — a silent
history edit, and a closed row is frozen history. The rollover producer identified this as the repair
most likely to be reached for; it is out of bounds. **A finding proposing it is closeout, not a new
defect.**

The same prohibition covers the mirror-image cheat: blanking or re-pointing the brief's `## Sprint` so
the strings match. The brief's `## Sprint` is what makes the task reachable on the board it is
actually on.

## What to build

A change to `claude/skills/fkit-status/dashboard.sh` — and to its mirrored copy if `dashboard.sh` is
dual-homed; check before assuming it is not — so that the sanctioned multi-move lifecycle stops
producing an unrepairable drift record, **without** losing the drift rule 2 was built to catch.

### The distinction the fix has to make

Rule 2's real target is a **half-done move**: a producer flipped the board row and forgot the brief's
`## Sprint`, so the task is advertised as being somewhere it is not. That defect is worth catching and
must keep being caught.

What must stop being reported is a **superseded** move marker: the row records a transition that
genuinely happened and has since been followed by another one. Distinguishing the two is the whole
task, and **the shape of that distinction is the implementer's call** — this brief does not prescribe
it. Whatever is chosen, state in the plan **what evidence** tells the two cases apart and **what it
costs**: any rule that lets a superseded marker pass will, by construction, also let some genuinely
half-done moves pass. **Name that residual explicitly rather than implying the fix is total.**

### Constraints

- **⛔ No board file is edited by this task.** Not `backlog.md`, not `sprint-3.md`, not
  `sprints/done/sprint-2.md`. Not one `➡️ Moved` marker, not one `P<n>`, not one status cell.
- **⛔ No task brief's `## Sprint` is edited by this task.**
- **⛔ No new devDependency** (ADR-014).
- **⛔ No `:NNN` line-number citations** in this task's artifacts — the coordination-citation rule from
  `0160`'s ruling. Cite `dashboard.sh` by its named block or its comment text, as this brief does.
- **A drift that is genuinely unrepairable must never be silently swallowed.** If the chosen fix
  suppresses a record, it suppresses it because the state is *legitimate*, not because it is
  *inconvenient*. Suppressing a real finding is the failure mode this whole file's comments warn about.

## Verification steps

1. Reproduce the defect **before** changing anything: run the dashboard over
   `ai-agents/sprints/done/sprint-2.md` and record the two `drift disagreement` lines for `0181` and
   `0182` verbatim in the worklog. A fix with no recorded red state is unverified.
2. After the change, the same run over `sprints/done/sprint-2.md` reports **neither** record, and the
   `0181`/`0182` rows still render.
3. **The half-done move is still caught.** Build a fixture where a sprint row reads
   `➡️ Moved to [Sprint N]` and the brief's `## Sprint` was never updated, and show the dashboard still
   reports `drift disagreement` on it. This is the regression that matters most.
4. Run the dashboard over **all four live boards** — `sprints/backlog.md`, `sprints/sprint-3.md`,
   `sprints/done/sprint-1.md`, `sprints/done/sprint-2.md` — and report each roll-up and drift set
   before and after. **No board gains a drift record.**
5. `npm test` passes, including `test/prove-red.sh`'s hard gate. If a test asserts on drift rule 2's
   behaviour, show its mutation still fails.
6. `git diff --stat` shows **no file under `ai-agents/sprints/` and no `brief.md` modified.**
7. State the residual from §"The distinction the fix has to make" by name in the close report. **A
   close report presenting this fix as complete detection has failed verification.**

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Related, not blocking:** `0210` (specifies and supports the reverse move `Sprint → Backlog`) — this
  task is the *dashboard's* half of the same lifecycle. The reverse move is documented and sanctioned;
  the drift rule never learned about it.
- **⚠️ Both known instances sit on an ARCHIVED board, and an archived board is MOVED, not FROZEN.**
  Sprint 1's archived board was edited three more times after archiving. Do not assume
  `sprints/done/sprint-2.md` is immutable, and do not build a fix that depends on it being so.
- **Priority is `—` (unscheduled).** Filed to the Backlog board on the owner's ruling; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
- **⚠️ This brief decays.** The two drift records and the 45-row ceiling were measured on
  **2026-08-06**. Re-measure at implementation time; the count moves every time a task is pulled back
  into a sprint.
