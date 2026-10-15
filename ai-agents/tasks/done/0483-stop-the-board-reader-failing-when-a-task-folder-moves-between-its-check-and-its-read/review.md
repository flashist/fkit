# Review — 0483

Task: ai-agents/tasks/done/0483-stop-the-board-reader-failing-when-a-task-folder-moves-between-its-check-and-its-read/brief.md
File(s) under review: bin/fkit-board.mjs, test/board-reader.test.js, CHANGELOG.md (0483's `## Unreleased` line only)
Status: closed-out
Coverage: reasoning-only second opinion — round 1: Codex ran (`codex-cli 0.157.1`, exit 0) and executed `node --test test/board-reader.test.js`, but the read-only sandbox denied temp-dir creation (`EPERM`), so H7–H12 never ran there and its findings rest on reading; the measurement is the reviewer's (board tests 37/37, 9 scratch-copy mutants, 1 race probe).

## Reviewer findings
| #  | Round | Sev | Location | Claim |
|----|-------|-----|----------|-------|
| R1 | 1 | low | bin/fkit-board.mjs:512, bin/fkit-board.mjs:543 | `taskDetail` / `sprintDetail` return `null` (→ 404) right away when the requested task or board is missing from **this call's own** fresh snapshot. The retry only covers a failed read after a successful lookup. So a task moved **once**, inside the gap of the recompute the detail request itself triggered, gets a 404, though the plan (§2) says only a task moved twice should. Measured: a scratch probe (warm the reader, add a task so the cache key changes, move 0001 on its brief read) gets `null`; the next call finds it in `done`. Not a 500 and nothing invented; narrow window, heals on the next request. The CHANGELOG line ("no longer answers … a task's details or a sprint's details with an error") is slightly too broad for this window. H11/H12 test a stale **cached** path only, so no test covers this. Raised by both. |
| R2 | 1 | low | bin/fkit-board.mjs:286 | No test pins "only `ENOENT` is tolerated". Mutant `return null` for **every** error (so `EACCES`/`EISDIR` would silently drop a card, and never cache) passes all 37 tests in the three board test files. The code is right today; nothing stops a regression. |
| R3 | 1 | low | bin/fkit-board.mjs:435, bin/fkit-board.mjs:499 | Two of the plan's stated invariants are not pinned: the duplicate-id warning reading `present[i]` (mutant `boardFiles[i]` passes 37/37), and `byId` built from kept entries only (mutant `for (const e of taskDirs)` passes 37/37). Both only matter when a board or task vanished in the same snapshot as a duplicate id, so the blast radius is a misnamed warning or a detail lookup on a vanished copy. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT (sev low, mine: narrow window, a 404 not a 500, heals on the next request) | Defect | Verified at bin/fkit-board.mjs:512 and :543 (pre-fix `if (!task) return null;` / `if (!board) return null;`): the lookup miss returned before the retry. Red first: new H13 (taskDetail) and H13b (sprintDetail) got `undefined` status, i.e. `null`. Fix: a miss retries when this call's snapshot was not cached (`cached !== snap` means it skipped a moved file), else returns `null` as before; retry bound stays 2, so a task moved twice still gets "not found right now" (plan §2). Comment above `taskDetail` updated to 2 lines. CHANGELOG line now accurate as written; unchanged. | ✅ done |
| R2 | CORRECT (sev low: test gap, code right today) | Defect | Verified bin/fkit-board.mjs:286 is the one tolerance point. Added H14: a `brief.md` that is a directory lists fine and reads `EISDIR`; `snapshot()` must throw `{ code: 'EISDIR' }`. Real error, no fake. Mutant `return null` for every error reds H14 only. | ✅ done |
| R3 | CORRECT (sev low: test gap; blast radius a misnamed warning or a mismatched detail on a duplicate id) | Defect | Verified bin/fkit-board.mjs:435 (`present[i]`) and :499 (`byId` from `read`). Added H15: open `sprint-97.md` vanishes on its read before the `sprint-98.md` + `done/sprint-98.md` duplicate pair; the warning must name `(sprint-98.md, done/sprint-98.md)` and not sprint-97. Added H15b: duplicate 0001 in backlog/ and done/; the backlog copy is gone for its own read and back by the done copy's read, so `taskDetail` must serve the done copy's brief. Mutant `boardFiles[i]` reds H15 only; mutant `for (const e of taskDirs)` reds H15b only. | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)
