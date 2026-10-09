# Plan — 0493: make the sprint ship-loop say when a waiting task waits on a later sprint

**Approving this plan is the owner's "specific word" the brief asks for.** Nothing is built before that approval.

## 0. Goal
`/fkit-sprint-ship-loop` reads the `drift depends-on-later-sprint` record that `dashboard.sh` emits (shipped by 0492) and says what it means to the owner at two points:
- **At the start of a run, before any spawn:** which of this sprint's open rows wait on which task, in which later or unplaceable sprint (or on the Backlog board), and that this sprint cannot finish them as planned. This is an owner decision: relayed, never resolved.
- **At the dependency-deadlock stop** (the step-1 bullet and the stop-table row): when the chain's blocker is named by a record, the report gives that blocker's sprint and how many of this sprint's open rows wait on it.

The facts come from `dashboard.sh`'s output and are never worked out again from the briefs. Eligibility, ordering and the skip memory are untouched.

## 1. The record the loop reads (as 0492 shipped it)
```
drift depends-on-later-sprint <task> blocker="<D>" blocker_sprint="<M>" reason="<r>" [via="<X>"]
```
- **One record per (dependent, final blocker) pair.** "How many of this sprint's open rows wait on D" = the number of records with `blocker="D"`. That count includes `via=` records: those rows wait *through* another row of this board. A row with two blockers is counted under each.
- **"Open" means a plan cell of 🔲, 🔄 or 🚧.** So the count can include rows owned by someone else (🔄) or blocked (🚧). The wording says "open rows", not "backlog rows".
- **How each `reason` is worded:**

| `reason` | Wording | Notes |
|---|---|---|
| `backlog-board` | "on the Backlog board" | |
| `not-started` | "on Sprint M, not started yet" | |
| `later-sprint` | "on Sprint M, a later sprint" | |
| `sprint-closed` | "on Sprint M, which is closed though the task is still open" | |
| `sprint-unresolved` | "on `<blocker_sprint>`, a sprint the board cannot place" | **Never "later".** Per 0492's accepted residual `archived-closed-sprint-reads-unresolved`, a closed sprint whose board was archived also reads this way. |

- **The record never fires on the Backlog board.** It fires only on a real `Sprint N` board, so a run on any other board has nothing to say.

## 2. Exact text changes: `claude/skills/fkit-sprint-ship-loop/SKILL.md` (canonical source, never `.claude/`)
None of the new text uses the words "plan review" or "plan-review". That keeps `plan-review-switch.test.js`'s vocabulary-leak check green. The anchors that `spawned-write-marker.test.js` and `plan-review-switch.test.js` pin are in sections this plan does not touch.

**2a. Step 1: a new bullet placed right after "Get the board via the deterministic reader".** Draft (Q1 option A):
```
- **A row that waits on a later sprint — say it before driving anything.** If the board's `⟦FACTS⟧`
  carries any `drift depends-on-later-sprint` record (`fkit-status/SKILL.md` lists its fields), say so
  in the opening report, **before the first spawn**. Per `blocker`: its sprint, worded by `reason`
  (below); which of this sprint's open rows wait on it, and how many (the records with that
  `blocker=`; a `via=` record waits through another row of this board); and that this sprint cannot
  finish them as planned. **Read it from the records — never re-derive it from the briefs.** Wording by
  `reason`: `backlog-board` → "on the Backlog board"; `not-started` → "on Sprint M, not started yet";
  `later-sprint` → "on Sprint M, a later sprint"; `sprint-closed` → "on Sprint M, which is closed
  though the task is still open"; `sprint-unresolved` → "on `<blocker_sprint>`, a sprint the board
  cannot place" — never "later" (a closed sprint already archived reads this way too). **It is the
  owner's decision — relay it, do not resolve it:** the driver moves no task and re-points no link.
  Those rows are not eligible (a dependency is not `✅ Done`), so the run drives the rest of the
  eligible set.
```
If Q1 is answered B, the last sentence is replaced by a go/stop `AskUserQuestion` ("start the run" / "stop so I can re-plan"). That is not a placement question, so the knock-on convention does not apply. The record itself already is the knock-on.

**2b. Step 1: the Dependency deadlock bullet.** Keep the existing sentence and append:
```
  **If a `drift depends-on-later-sprint` record in this turn's render names the chain's blocker, the
  report says so — "waiting" alone is not enough:** the blocker's sprint (worded by `reason`, as above)
  and how many of this sprint's open rows wait on it. No record → report the chain as before, but do
  not say nothing waits on a later sprint: the record reads only hard, 4-digit `Depends on:` IDs, and
  follows an indirect wait only through rows of this board.
```

**2c. Stop table, `Dependency deadlock` row, "Driver does" cell.** Becomes:
```
stop; report the blocking chain — plus, per blocker a `drift depends-on-later-sprint` record names, its sprint and how many of this sprint's open rows wait on it (step 1)
```
The Trigger cell is unchanged.

**2d. Progress reporting, "Opening the run" bullet.** Append one sentence:
```
**If the board carries a `drift depends-on-later-sprint` record, the opening says so** (step 1).
```

**2e. Step 5, Advance (only if Q3 = A).** Append one sentence:
```
If the re-derived board carries a `drift depends-on-later-sprint` record the owner has not yet been told of, say so the same way (step 1) before the next spawn.
```

## 3. `claude/skills/fkit-task-ship-loop/SKILL.md` (the brief's item 4: "say what the plan chose")
**Chosen, pending Q2:** one sentence at step 3 (the plan gate). Why: the task loop drives one named task and never reads the board today. The only useful moment is when the owner approves that task's plan. Draft, inserted after "Present the plan (+ any open questions) and wait.":
```
If `bash .claude/skills/fkit-status/dashboard.sh <the brief's sprint board>` carries a `drift depends-on-later-sprint` record for this task, present it with the plan — its blocker and that blocker's sprint, worded by `reason` — as the owner's decision; do not resolve it.
```
- This is a read-only Bash call, which plan mode allows.
- On the Backlog board the record never fires, so nothing is shown.
- No eligibility check is added: the task loop still does not check dependency readiness.

If Q2 = B, this file is not touched at all.

## 4. `CHANGELOG.md`, under `## Unreleased`
One line (Q2 = A form):
```
- `/fkit-sprint-ship-loop` now says, at the start of a run and when it stops on a dependency deadlock, when a task on the sprint waits on a task in a later sprint or on the Backlog board, read from the board's `drift depends-on-later-sprint` record. `/fkit-task-ship-loop` mentions it at its plan gate.
```
- If Q2 = B, the last sentence is dropped.
- Observed, not fixed: 0492 added no CHANGELOG line for the record itself. That is out of this task's scope and is flagged for the driver.

## 5. New test: `test/sprint-loop-later-sprint-record.test.js` (small, prose pin)
The brief's verification 1 is mechanical, and 0453 will later rewrite both loops. A pin test is the "carry this" signal. It asserts:
1. In `fkit-sprint-ship-loop/SKILL.md`, the step-1 section (from `### 1.` up to `### 2.`) contains `drift depends-on-later-sprint` at least twice (the start-of-run bullet and the deadlock bullet).
2. The stop-table line that starts `| **Dependency deadlock**` contains `depends-on-later-sprint`.
3. All five `reason` words appear in the step-1 section, and the `sprint-unresolved` wording contains "never".
4. `fkit-status/SKILL.md` still lists the kind `drift depends-on-later-sprint`, so a rename breaks both sides.
5. Only if Q2 = A: `fkit-task-ship-loop/SKILL.md` step 3 contains `depends-on-later-sprint`.

Notes:
- It reads only `claude/`, so it needs no `test:docs` entry.
- `node --test test/*.test.js` picks the file up automatically.
- **Prove-red:** run it against the snapshot copies. Asserts 1–3 (and 5) must go red. Assert 4 is green on the old text by design, and the report will say so.

## 6. Dry read (the brief's verification 2)
1. Build a scratch fixture tree in the scratchpad, outside the repo (`ai-agents/{sprints,tasks/backlog,tasks/done,tasks/cancelled}`), using the same banner and row shapes as the 0492 tests.
2. The fixture has:
   - `sprint-1.md` 🔄 and `sprint-2.md` 🔲
   - 0001 → 0002 (on Sprint 2)
   - 0003 and 0004 → 0001 (`via` records)
   - 0005 → 0006 (on the Backlog board)
   - 0007 → 0008 (`## Sprint: Sprint 9`, no board → `sprint-unresolved`)
3. Render `sprint-1.md` with `dashboard.sh`. Capture the `⟦FACTS⟧` records verbatim.
4. Following the new skill text, write the start-of-run wording, and the deadlock wording for the same board with every other row closed.
5. Both go into `worklog.md` for the review.
6. Also render the live `sprint-10.md` (expected: 0 records; it was 0 at plan time). That shows the opening report adds nothing on a clean board.

## 7. Sequencing (Build)
1. **Snapshot first.**
   - Copy the 3 target files to `<scratchpad>/0493-snap/` with `SHA256SUMS`. All 3 are already dirty against HEAD from other tasks.
   - The diff for review is `diff -u <snapshot> <current>` on these files, **not `git diff`**.
   - Re-hash at build start against the plan-time text: if 0494 or another task has changed either loop file since, stop and say so.
2. Write the new test. Prove-red against the snapshot copies in a scratch copy.
3. Make the edits: 2a–2d (and 2e if Q3 = A), §3 (if Q2 = A), §4.
4. Run the quick checks (§8), then the dry read (§6), then the decision log in `worklog.md` (or `none`).
5. Run one full `npm test` (§8).
6. Do **not** run `claude/fkit-claude-init.sh .`. The driver refreshes `.claude/`, as on 0492.

## 8. Checks (CONTRIBUTING.md "What to run for a change")
- **`npm test`, full, once.** Required because `skills/fkit-sprint-ship-loop/SKILL.md` is named in `test/prove-red.sh` (mutation 9 de-indents its description) and because a test file is added. It is the heaviest row, so it covers the `test:unit` row for the task-loop file.
  - Runs in a scratch copy of the whole repo **including `.git`**, never in parallel with another run.
  - Expected around 12–30 min under load.
- **Quick, before the full run:** `node --test test/plan-review-switch.test.js test/spawned-write-marker.test.js test/sprint-loop-later-sprint-record.test.js test/reference-integrity.test.js test/task-id-uniqueness.test.js`. The last two are the brief's verification step 4, named explicitly; they also run inside `npm test`.
- **No existing test pins the deadlock wording or stop-table row.** A grep for "deadlock" / "blocking chain" in `test/` found nothing, so no existing test needs updating.
- **Skipped:** no new `prove-red.sh` mutation. Not asked for; prove-red for the new test is done by hand (§5).
- **Not covered by any check:** `CHANGELOG.md` (CONTRIBUTING row 1), checked by eye.

## 9. Edge cases and risks
- **`sprint-unresolved` is not "later".** An archived closed sprint, a missing board, or a garbage `## Sprint` all read this way. The wording never says "later" for it (0492 residual `archived-closed-sprint-reads-unresolved`).
- **Known misses in the record.** A record only covers hard, 4-digit IDs. It does not follow cross-board indirect waits, soft-marked IDs, ranges, or a soft/hard word written before the ID. So "no record" is never reported as "nothing waits on a later sprint" (2b).
- **Mid-run changes.** A worker may file or re-point a task mid-run (the incident's own shape). The deadlock wording uses **this turn's** render, and step 5 already re-derives the board (evidence-before-assertion). 2e covers the opening-report gap (Q3).
- **No placement question is created by default.** Under Q1 A the loop asks nothing, so the knock-on convention does not trigger. If the owner then asks the loop to move tasks, that placement question follows the convention through the existing §3 paragraph. Unchanged.
- **Separation of authority is unchanged.** The driver moves no task, re-points no link and writes no status for these rows. Moving tasks between sprints is the producer's or owner's job.
- **One dependent, several blockers.** It is listed under each blocker. The count is per blocker, not a sprint total, so no double-count is claimed.
- **Fact values are escaped.** `blocker_sprint` is escaped with `fact_value` and is shown as-is.
- **Conflict risk with other tasks.** Concurrent edits to the same loop files by 0494 or 0453 are caught by the re-hash at build step 1. 0498 touches only `fkit-lead.md`.
- **No ADR edit.** ADR-032 says "deadlock → stop and report the chain". This enriches the report and does not change the decision.
