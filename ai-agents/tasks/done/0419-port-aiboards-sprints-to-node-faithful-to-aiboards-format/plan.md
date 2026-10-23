# Plan: 0419, port aiboard's sprint move / add / remove to Node (the rest of the sprint code came with 0418)

- **Planning only. No files written**, plan.md included. I was spawned without `EnterPlanMode`, so planning-only was a rule I kept myself, not a runtime block. aiboard was only read (`git show a1592dc:...`). No plan-review switch line in the spawn, so plan review was not run.
- **Stated up front: `test_check_detects_and_fixes_stale_sprint_list` will NOT be seen red first.** The code it runs (`check`, `refreshSprint`, `_renderSprintTaskList`, `_writeSprint`) already shipped in 0418 (scope moved by owner ruling 2026-10-21, *"Approve, move the line (Recommended)"*; 0418 worklog forward note says the same). *Verification* 1 cannot be met for that one test. Replacement evidence: a negative control. In a throwaway scratch copy of `board/`, break the stale-list path, show the test fails, then delete the copy. The other two ported tests are seen red first.
- **The one pre-approved test file: `test/board/sprints.test.js`** (new; owner ruling A3, 2026-10-20). No second file. `test/board/store.test.js` is not touched.
- **Scope:** 3 methods added to `board/core/store.mjs`: `moveSprint`, `sprintAdd`, `sprintRemove`, about 40 lines, a faithful port of `store.py` lines 647–678 @ `a1592dc`. Nothing else in `board/` changes.
- **No slow tests.** No child processes, no lock races. Each test should take under about 50 ms, and the file under 0.5 s. `npm test` stays within noise of today's 67–75 s, inside the 120 s budget (ADR-057 D10).
- **`package.json`: no change.** The existing `test/board/*.test.js` glob already runs the new file inside `npm test`. No dependency added (ADR-014).

## 1. Files

| Path | New/changed | What |
|---|---|---|
| `board/core/store.mjs` | changed | Add `moveSprint`, `sprintAdd`, `sprintRemove` right after `createSprint`, before `_sprintSetTasks`: Python's order. No other line changes |
| `test/board/sprints.test.js` | new: **the one pre-approved file** | §3 |
| `ai-agents/tasks/backlog/0419-.../worklog.md` | new | Red run, negative control, green runs, `npm test` time, Python parity result, limits, decision log |

Untouched: `board/core/model.mjs`, `python-compat.mjs`, `lock.mjs`, `test/board/store.test.js`, `test/board/model.test.js`, `package.json`, `claude/`, `install.sh`, every `.claude/` copy, the wiki, docs. CHANGELOG: no entry, because nothing ships. Wiki check: the vault has no page on the Node store or on sprint membership code. Nothing binding.

## 2. The code (same conventions as 0418)

camelCase methods. Required arguments are positional. Synchronous, wrapped in `writeLock`, which is re-entrant, so the nested `updateTask` calls are fine. `pyList` copies Python's "iterate any iterable" behaviour: a string iterates its characters, as in Python, and a non-iterable throws `TypeError`. Branch order is Python's: `getSprint` runs before `normalizeStatus`, so a bad sprint ref gives `NotFound` before a bad status gives `ValueError`.

```js
  moveSprint(ref, status) {
    return this.writeLock(() => {
      const sprint = this.getSprint(ref);
      const st = normalizeStatus(status);
      if (st === sprint.status) return sprint;
      const dest = pj(this.sprintsDir, st, pyPathName(sprint.path));
      if (exists(dest)) throw new BoardError(`destination already exists: ${dest}`);
      move(sprint.path, dest);
      const moved = this._loadSprint(sprint.id, st, dest);
      this._writeSprint(moved, moved.meta, moved.body);
      return this.getSprint(sprint.id);
    });
  }

  sprintAdd(sprintRef, taskRefs) {
    return this.writeLock(() => {
      const sprint = this.getSprint(sprintRef);
      for (const ref of pyList(taskRefs)) this.updateTask(ref, { sprint: sprint.id });
      return this.getSprint(sprint.id);
    });
  }

  sprintRemove(sprintRef, taskRefs) {
    return this.writeLock(() => {
      let sprint = this.getSprint(sprintRef);
      for (const ref of pyList(taskRefs)) {
        const task = this.getTask(ref);
        if (task.sprint === sprint.id) {
          this.updateTask(task.id, { sprint: null });
        } else {
          sprint = this.getSprint(sprint.id);
          this._sprintSetTasks(sprint, sprint.tasks.filter((t) => t !== task.id));
        }
      }
      return this.getSprint(sprint.id);
    });
  }
```

All the helpers used already exist in `store.mjs` / `model.mjs` from 0417/0418: `pj`, `exists`, `move` (shutil.move incl. the copy-then-delete fallback), `pyPathName`, `normalizeStatus`, `_loadSprint`, `_writeSprint`, `_sprintSetTasks`, `updateTask`, `pyList`. No new import. No comments needed: the file header already says it is a faithful port.

Python behaviour kept on purpose (faithful, phase 3 may change it):
- `moveSprint` to the same status returns without writing (`updated` unchanged).
- `moveSprint` does not touch the sprint's tasks. It does not stop a move to `done` while tasks are open; `check()` reports that instead.
- `sprintRemove`'s else branch rewrites `sprint.md` (and bumps `updated`) even when the task was not listed at all.
- No rollback. A `NotFound` partway through `taskRefs` leaves the earlier refs applied.
- `sprintAdd` on a task already in that sprint still rewrites its brief (`updateTask` bumps `updated`).
- A sprint folder with no `sprint.md`: `moveSprint` writes one (only `updated` plus a `## Tasks` section), as Python does.

## 3. `test/board/sprints.test.js`

Setup is copied from `store.test.js`, not imported, because importing a test file would run its tests:
- `beforeEach`: `realpathSync(mkdtempSync(tmpdir()/board-sprints-))`, then `new Board(tmp).init()`.
- `afterEach`: `rmSync` with `recursive` and `force`.

Header comment: one line saying it ports aiboard `a1592dc`'s sprint `BoardTests`, names verbatim, so 0423 can map them.

`describe('BoardTests')`: Python names verbatim, in Python's order:
1. `test_sprint_membership_stays_in_sync`
   - `createSprint('Sprint 1', {goal, start, end})` gives `S-001`.
   - `createTask('One', {sprint: 'S-001'})`, then `createTask('Two')`, then `sprintAdd('S-001', ['T-002'])`.
   - `getSprint('1').tasks` is `['T-001','T-002']`, and T-002's `sprint` is `'S-001'`.
   - `sprint.md` contains `- [ ] T-001 — One (backlog)`.
   - `moveTask` to done, then `- [x] T-001 — One (done)`; `sprintProgress` (total, done, percent) is `[2,1,50]`.
   - `sprintRemove`, then `['T-001']`, and T-002's `sprint` is `null`.
   - `createSprint('Sprint 2')`, then `updateTask('T-001', {sprint: 'S-002'})`; S-001 lists `[]` and S-002 lists `['T-001']`.
   - `check()` returns `[]`.
   - **Expected red:** `TypeError: board.sprintAdd is not a function`.
2. `test_move_sprint`: `sprints/in-progress/S-001-sprint-1/sprint.md` exists and `status` is `in-progress`. **Expected red:** `TypeError: board.moveSprint is not a function`.
3. `test_check_detects_and_fixes_stale_sprint_list`
   - Python's `shutil.move` by hand becomes `renameSync`.
   - Then: a problem containing "stale" and "S-001"; `check({fix: true})` returns a problem ending `(fixed)`; then `check()` returns `[]`; `sprint.md` contains `- [x] T-001 — One (done)`.
   - **Expected: green on its first run** (see the top of this plan).

Porting rules, as in 0418: `assertEqual` on lists becomes `deepStrictEqual`, `assertIsNone` becomes `equal(..., null)`, `assertIn` on text becomes `ok(text.includes(...))`, and `any(...)` becomes `problems.some(...)`.

`describe('fkit additions')`: 3 small tests in the same file. The reason is CONTRIBUTING key list item 4: a code path that writes or deletes files in a user's project needs a test, or the gap is a defect. The three aiboard tests leave these write branches untested:

4. `move_sprint keeps the sprint's tasks, writes nothing for the same status, and refuses a same-name destination`
   - Sprint with T-001, moved to in-progress: front-matter `tasks` is kept, the `## Tasks` line is there, the task's brief bytes are unchanged, and `check()` returns `[]`.
   - `moveSprint` again to in-progress: `sprint.md` bytes are identical (compare bytes, not `updated`, so it does not depend on timing).
   - `mkdirSync` of `sprints/done/S-001-sprint-1`, then `moveSprint('S-001','done')`: throws `BoardError` with `destination already exists: <path>`, and the sprint is still in in-progress.
5. `sprint_add moves a task out of its old sprint`
   - T-001 in S-001, then `sprintAdd('S-002', ['T-001'])`.
   - S-001 lists `[]` and S-002 lists `['T-001']`; the task's `sprint` is `S-002`; each `sprint.md` checklist matches; `check()` returns `[]`.
6. `sprint_remove drops a stale listing without touching the task`
   - T-001 created in S-001, with S-002 existing. The brief is hand-edited `sprint: S-001` to `sprint: S-002`, the way aiboard's own `test_check_detects_inconsistency` does it.
   - `sprintRemove('S-001', ['T-001'])`: S-001 lists `[]` and the brief bytes are unchanged.
   - `check()` now holds exactly one problem: `T-001 says it is in S-002, but S-002 does not list it`.
   - `sprintRemove('S-001', ['T-009'])` throws `NotFound`.

All six run through the exported API only: no internals, no mocking (CONTRIBUTING test rules). Tests 4–6 are expected red, because the methods are missing.

## 4. Sequence

1. Baseline: run `git status --porcelain --untracked-files=all`, and `git hash-object` the approved plan.md.
2. Write `test/board/sprints.test.js` (§3).
3. **Red run:** `node --test test/board/sprints.test.js`. Expected: tests 1, 2, 4, 5, 6 fail with `... is not a function`, and test 3 passes. Record the output in the worklog as it is, including test 3 passing.
4. **Negative control for test 3**, in the scratchpad, never in the repo:
   - Copy `board/` and `test/board/sprints.test.js` into a fresh folder.
   - In the copy's `check()`, make the stale-list comparison never fire.
   - Show test 3 fails, then delete the copy.
   - Second variant: make the `fix` branch skip `refreshSprint`, and show the `(fixed)` / clean-recheck assertions fail.
5. Add the three methods to `store.mjs` (§2).
6. **Green:** `node --test test/board/sprints.test.js` shows 6/6. Run it 5 times to look for flakiness.
7. **Negative controls for the new code**, in a scratch copy: (a) in `sprintRemove`, drop the else branch, and tests 1/6 fail; (b) in `moveSprint`, drop `_writeSprint`, and test 4 fails; (c) in `moveSprint`, drop the dest-exists check, and test 4 fails.
8. **`time npm test`:** must be all green, inside 120 s; record the load average.
9. **Python parity**, scratchpad only, not kept:
   - Extract aiboard `a1592dc` with `git archive` into its own empty folder and make it read-only. Run the drivers with `python3 -I`, from a separate folder.
   - Each program runs one sequence of `create_sprint` / `create_task` / `sprint_add` / `sprint_remove` / `move_sprint` / `update_task(sprint=)` / hand moves and edits / `check(fix=)` on both runtimes.
   - Each run prints returned ids, `tasks` lists, statuses, and the exception class plus message. Then it dumps every file under the board.
   - Before comparing, replace the tmp root with `<ROOT>` and every `YYYY-MM-DDTHH:MM:SSZ` stamp with `<TS>`.
   - Inputs: a few hundred generated programs, plus hand-written cases. The hand cases: a string `taskRefs`, a bad status, a missing `sprint.md`, a same-status move, an existing destination, a deleted status folder, a stale listing, a NotFound partway through a list, duplicate refs, and a non-ASCII title.
   - Expect identical output. Every difference gets a worklog entry and an explanation. Known non-differences: 0418's big-rank `check()` messages are not reachable here.
10. Fence check:
    - `git status` must show only the 3 paths in §1 (the new file sits inside the already-untracked `test/board/`).
    - Byte scan of changed files for raw U+2028 / U+2029 / U+FEFF / U+0085: none.
    - No temp folders and no `.aiboard.lock*` left in the repo.
11. Worklog: change surface, red/green output, negative controls, timings, parity result, limits (§6), decision log (or `none`).

## 5. Checks

- **Run:** `node --test test/board/sprints.test.js` (red, then green), then `npm test`. Row "Anything else" of CONTRIBUTING's table: `board/`, `test/`. The brief's *Verification* 2 `node --test test/*.test.js` was superseded by the 2026-10-20 correction: `npm test` is the whole suite.
- **Skip `npm run test:prove-red`:** it mutates or runs none of these files (CONTRIBUTING row 3).
- **Skip `npm run test:release`:** `bin/release.mjs` is untouched.
- **Not automated:** the Python parity check (step 9) is scratch evidence, not a kept test. The corpus gate is 0423's.

## 6. Edge cases and failure modes

- **Test 3 passes before the code is written.** Handled by the negative control (step 4) and stated in the worklog. It is not presented as red-first.
- **macOS tmp path** (`/var` is really `/private/var`): `realpathSync` the tmp root, as `store.test.js` does, so path assertions match `pyResolve`.
- **Same-second timestamps:** no test asserts that `updated` changed. "Writes nothing" is checked by comparing file bytes.
- **The destination appears between the check and the move:** Node's `renameSync` onto an existing *empty* folder replaces it, while Python's `shutil.move` would move the sprint *inside* it. This can only happen in that gap, while the board lock is held, so only a hand edit or another non-locking tool can cause it. Accepted, low; listed as a worklog limit.
- **A sprint status folder deleted by hand:** handled by 0418's shared `move` fallback (copy then delete), which 0418 review R4's test already covers. No new test; it is in the parity hand cases.
- **Nested locks:** `sprintAdd` / `sprintRemove` call `updateTask` while holding the lock. `writeLock` is re-entrant per Board through `_lockDepth`, so there is no `NestedLockError` (that is only for a second Board in the same thread).
- **`taskRefs` as a string:** it iterates characters, as Python does (`'T'` gives `NotFound "'T' is not a valid T-id"`). That is faithful, not a fix. 0421's CLI passes arrays.
- **Bad status:** throws `ValueError` (from `normalizeStatus`), not `BoardError`, as in Python. 0421 must catch it, as aiboard's CLI does.
- **Hand-typed non-string entries in a sprint's `tasks:` list:** `!==` and `includes` compare the way Python's `!=` and `in` do for str against int. Covered by parity.
- **0423 mapping:** aiboard's `BoardTests` class is now split across two Node files (`store.test.js` with 29 tests, `sprints.test.js` with 3). 0423's table maps by test name, so this works. Noted in the worklog for 0423.
- **0418's 4 Accepted residuals** (ranks past 2^53, terminated worker thread holding the lock, zombie holder, hostname change): none is touched or worsened. These methods add no rank arithmetic, no threads and no child processes.

## 7. Assumptions

- **A new file, not more tests in `store.test.js`.** Adding the three tests to `store.test.js` would add no file and keep `BoardTests` in one file. I followed the brief and the driver instead: one file, named by path.
- **The 3 fkit additions (§3, tests 4–6) are in scope** under CONTRIBUTING key list item 4, inside the one approved file. They are droppable if the owner wants only the three aiboard tests.

open questions:
1. Keep the 3 fkit-addition tests (4–6) in `test/board/sprints.test.js`?
   - (Rec) Keep: these are file-writing branches on the CONTRIBUTING key list (item 4), where a missing test counts as a defect; about 50 ms each; same file.
   - Drop: port only the 3 aiboard tests. Then `sprintRemove`'s stale-list branch and `moveSprint`'s refusal and same-status branches go untested.
   - Not blocking: the plan as written keeps them.
   - Knock-on: none (checked). No task moves and no `Depends on:` changes; 0421 and 0422 still wait on 0419, all in Sprint 14.
