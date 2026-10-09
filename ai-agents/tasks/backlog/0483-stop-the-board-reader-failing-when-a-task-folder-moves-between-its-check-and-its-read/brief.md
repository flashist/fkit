# Stop the board reader failing when a task folder moves between its check and its read

## ID
0483

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Where this comes from.** Residual **R-c** of task
[`0477`](../../done/0477-find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic/brief.md)
(see its `plan.md` § Risks and residuals, "R-c. Reader read-gap", and its `review.md` § Accepted
residuals, R-c). `0477`'s scope was test-only, so this product-code gap was noted and not fixed there.

**Owner ruling behind this task** (2026-10-04, `fkit-lead` session, `AskUserQuestion`, selected option,
relayed to a spawned producer): *"File a backlog task."* Filed on the Backlog board, not on Sprint 10 —
nothing gets built now.

**The gap, checked in the code at filing (2026-10-04, read, not run):**
- `listTaskDirs` in `bin/fkit-board.mjs` `stat`s each task folder's `brief.md` (inside a `try` that
  skips the folder if it is missing) and records its path.
- `readTask` later reads that path with `readFileSync` and **no `try`**.
- `snapshot()` calls `listTaskDirs`, then maps every entry through `readTask`. If another agent moves a
  task folder (for example `/fkit-task-done` moving it from `backlog/` to `done/`) **between** the two,
  the read fails with "file not found" and `snapshot()` throws.
- **Effect today:** the HTTP handler catches the throw and answers that request with a `500`
  ("internal read error (ENOENT)"). The next poll re-lists the folders and recovers. The `--bench` mode
  has no such catch and would exit with the error.
- **Never seen in any run.** It is a narrow timing window. Low priority.

**Same pattern, two more places (the plan decides whether they are in scope):**
- `taskDetail` reads `entry.brief` (and `worklog.md`) from the **cached** snapshot's path, so a folder
  moved since the last snapshot can fail the same way on the detail request.
- `listBoardFiles` checks each sprint board file, and `readBoards` reads it later; `/fkit-sprint-done`
  and `/fkit-sprint-cancelled` move board files, so the same gap exists for boards.

**No conflict with a locked decision found.** The reader stays read-only (it must never write to the
tree it reads). Folder location stays the authority for a task's state (ADR-029).

## What to build

1. Make one `snapshot()` survive a task folder that moves or disappears between the listing and the
   read. The reader must not throw and must not invent data. The plan picks the behaviour and says why;
   reasonable choices include skipping that task for this snapshot (the next poll sees it in its new
   place) or re-listing once. Whatever is chosen, the snapshot must not be cached in a state that hides
   the task once the tree is quiet again.
2. Decide, in the plan, whether the two related places above (`taskDetail`'s cached path, and the
   board-file read) get the same treatment in this task, and say why. If left out, record them as
   residuals.
3. Add tests that simulate the move inside the gap (no real timing race needed — for example a test
   hook or a fake that removes the folder after listing), red before the fix and green after.

## Verification steps

1. A new test removes or moves a task folder after `listTaskDirs` and before `readTask`; before the fix
   it shows `snapshot()` throwing; after the fix `snapshot()` returns without throwing and the moved
   task is handled as the plan said.
2. A follow-up `snapshot()` on the quiet tree shows the task in its new place (no stale cache).
3. If the plan brings `taskDetail` and/or the board-file read into scope: a matching test for each,
   red before, green after.
4. `npm test` green; state the unit pass count and prove-red's final line.
5. `git diff` shows no change under `ai-agents/` made by the tests.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Related:** [`0477`](../../done/0477-find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic/brief.md)
  (source of residual R-c; its `review.md` says re-raise R-c if `snapshot()` is seen throwing on a
  moved folder, or if this task is cancelled without fixing it).
- **Why one brief:** one file, one class of fault (check, then read later, with a move in between).
  The two related sites are the same fix pattern; the plan may split them out if they turn out
  larger.
- **Not yet scheduled:** on the Backlog board by the owner's ruling. Pulling it into a sprint is the
  owner's call.
- **Consulted:** none at filing.
- Filed 2026-10-04 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  ruling above; it decides nothing beyond that ruling.
