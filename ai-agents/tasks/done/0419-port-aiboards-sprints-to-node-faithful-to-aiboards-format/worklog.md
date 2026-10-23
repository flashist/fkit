# Worklog — 0419

## 2026-10-21 — fkit-coder (Build worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Built the approved `plan.md` (blob `1f5962313721c9a06f4b62ff941e01e7fb89d3e6`, 15799 bytes, checked with
`git hash-object` / `wc -c` at the start) under the declared-approval marker. Owner approval relayed:
`AskUserQuestion`, 2026-10-21, `fkit-lead` session, selected *"Approve, keep extra tests (Recommended)"*.
That settles open question 1 = keep tests 4–6. No commit, no push. `plan.md` not edited.

### Change surface

- `board/core/store.mjs` (0418's file, still untracked): 3 methods added right after `createSprint`, before
  `_sprintSetTasks` (Python's order): `moveSprint`, `sprintAdd`, `sprintRemove`, 40 lines, the plan §2 code
  as written. No other line changed, no new import.
- `test/board/sprints.test.js` (new): **the one pre-approved test file**, 6 tests (3 `BoardTests` with
  aiboard's names verbatim + 3 fkit additions).
- `ai-agents/tasks/backlog/0419-…/worklog.md` (this file).
- Untouched: `model.mjs`, `python-compat.mjs`, `lock.mjs`, `test/board/store.test.js`, `test/board/model.test.js`,
  `package.json`, `claude/`, `install.sh`, `.claude/` copies, the wiki, docs. No CHANGELOG entry (nothing ships).

### Red run (methods not yet written)

`node --test test/board/sprints.test.js`, exit 1: tests 6, pass 1, fail 5.

```
✖ test_sprint_membership_stays_in_sync          TypeError: board.sprintAdd is not a function
✖ test_move_sprint                              TypeError: board.moveSprint is not a function
✔ test_check_detects_and_fixes_stale_sprint_list
✖ move_sprint keeps the sprint's tasks, ...     TypeError: board.moveSprint is not a function
✖ sprint_add moves a task out of its old sprint TypeError: board.sprintAdd is not a function
✖ sprint_remove drops a stale listing ...       TypeError: board.sprintRemove is not a function
```

**`test_check_detects_and_fixes_stale_sprint_list` passed before any 0419 code** — as the plan said: its code
(`check`, `refreshSprint`) shipped in 0418. *Verification* 1 is not met for that test; the negative control
below stands in for it.

### Negative controls (scratch copies of `board/` + the test file, deleted after each run)

Each mutation was checked to apply (diff of the copy vs the repo file is non-empty) before running.

| Mutation (in the copy only) | Result |
|---|---|
| `check()`: stale-list comparison never fires (`if (false)`) | test 3 fails (the "stale" assertion) |
| `check({fix})`: skip `refreshSprint` | test 3 fails (the clean re-check `deepStrictEqual([])`). The `(fixed)` assertion alone still passes — the message is pushed either way |
| `sprintRemove`: drop the else branch | test 6 fails. **Plan said tests 1/6; test 1 never reaches the else branch** (T-002 is listed by and points at S-001), so only 6 fails |
| `moveSprint`: drop `_loadSprint` + `_writeSprint` | test 4 fails (after the test fix below) |
| `moveSprint`: drop the dest-exists check | test 4 fails (`Missing expected exception`) |
| `moveSprint`: same status rewrites `sprint.md` | test 4 fails (bytes differ; after the test fix below) |
| `sprintAdd`: loop does nothing | tests 1 and 5 fail |
| `sprintRemove`: if branch does nothing | test 1 fails |

First pass found two gaps, fixed in the test (see decision log): (1) dropping `_writeSprint` from `moveSprint`
left test 4 green, because the moved `sprint.md` is already correct and only `updated` changes; (2) a
same-status rewrite was invisible inside one clock second. A first "drop the dest check" run also hit the
identical line in `moveTask` (perl replaces the first match) — re-run anchored on `move(sprint.path, dest)`.

### Green run

- `node --test test/board/sprints.test.js`, exit 0: tests 6, pass 6, fail 0. Ten repeat runs (5 before, 5
  after the test-4 fix): all 6/6, 80–94 ms per file run, each test 3–16 ms.
- `time npm test`, exit 0: tests 897, pass 897, fail 0, **75.04 s** wall (load average 4.95 at start, 6.90 at
  end). Inside the 120 s budget (ADR-057 D10), within the 67–75 s noise. `0284/term-ignored` passed.
- The `MODULE_TYPELESS_PACKAGE_JSON` warning printed when running the file directly is pre-existing (same for
  `store.test.js`); `package.json` is out of scope.

### Python parity (scratchpad only, not kept)

aiboard `a1592dc` extracted with `git archive` into its own empty folder, made read-only, run with
`python3 -I` from a separate scripts folder. Drivers copied from 0418's (not edited in place) and extended
with `move_sprint` / `sprint_add` / `sprint_remove` / `get_sprint` and hand edits (move a task folder, replace
text in a brief or `sprint.md`, delete `sprint.md`, make a same-name destination folder, delete a status
folder). Output: returned values, exception class + message, every file under the board, final `check()` and
`snapshot()`; tmp root → `ROOT`, timestamps → `TS`.

- **18 hand cases** (string `taskRefs`, `5` / `null` `taskRefs`, bad status, bad ref + bad status, missing
  `sprint.md` on move and on add, same-status move, existing destination, deleted status folder, stale listing,
  NotFound partway through a list, duplicate refs, non-ASCII titles, sprint done with open tasks, ref forms,
  task moved between sprints, task pointing at a missing sprint, non-string `tasks:` entries ×2): 16 identical.
- **400 generated programs** (seeded, sprint-focused, 15–50 ops each): 351 identical, 49 differing.
  New-method calls exercised: `sprintAdd` 1080 ok / 297 NotFound / 64 TypeError; `sprintRemove` 1139 ok /
  281 NotFound / 32 TypeError; `moveSprint` 877 ok / 149 NotFound / 117 ValueError / 12 BoardError / 27 TypeError.
- **Every difference (283 across 51 programs: 49 generated + 2 hand cases) is one pattern, and nothing else differs** (all files and all
  other return values identical): a hand-typed **non-string entry in a sprint's `tasks:` list** (e.g. `- 1`).
  Python raises `AttributeError: 'int' object has no attribute 'strip'`; Node raises
  `TypeError: s.slice is not a function`. Both fail on the same op, leaving the same files.
  - Cause: 0417's `normalizeId` → `pyStrip` on a non-string (`getTask(1)` from `_renderSprintTaskList` /
    `check()`). **Not 0419 code**: the same difference shows on 0418-only ops (`check`, `snapshot`, `update`,
    `create`, `move`, `refresh_sprint`, `progress`). 0418's parity never hand-typed an int task entry, so it
    did not see it.
  - Not fixed: `model.mjs` / `python-compat.mjs` are outside the approved plan. Forward note below.
- Plan §6 edge case "non-string entries compare as Python does" holds for `!==` / `includes`; the end result
  still differs as above because every write re-renders the list.

### Decision log (calls made inside the approved plan, without asking)

1. **Test 4 strengthened with a fixed past `updated`** (`backdate()` writes `updated: "2000-01-01T00:00:00Z"`
   into `sprint.md`). Answers: plan step 7(b) required "drop `_writeSprint` → test 4 fails", and it did not.
   Changed: before the move, backdate and assert `updated` was read back as that value; after the move assert
   `updated` changed; backdate again before the same-status call so the byte compare catches any rewrite. Why
   it qualified: obvious winner inside the plan's intent — same test, same file, still no timing dependence
   (plan §6 "no test asserts `updated` changed" meant *by clock*; this one uses a fixed value).
2. **Test 4's "still in in-progress" is checked as** `sprints/in-progress/S-001-sprint-1/sprint.md` exists and
   the hand-made destination folder is still empty, not via `getSprint` (the empty same-name folder is a second
   `S-001` folder; `getSprint` returns the first by status order either way). Mechanical, in-plan.
3. **Test 5's "each `sprint.md` checklist matches"** written as: S-001's file shows `_No tasks attached yet._`
   and no `T-001`; S-002's shows `- [ ] T-001 — One (backlog)`. Mechanical, in-plan.

### Limits (plan §6, carried)

- Python behaviour kept on purpose: same-status `moveSprint` writes nothing; `moveSprint` ignores open tasks
  (`check()` reports a done sprint with open tasks); `sprintRemove`'s else branch rewrites `sprint.md` even
  when the task was not listed; no rollback after a NotFound partway; `sprintAdd` on a member still rewrites
  its brief; a sprint folder with no `sprint.md` gets one on move.
- Destination appearing between the exists-check and the move: Node's `renameSync` onto an empty folder
  replaces it, Python's `shutil.move` would nest inside it. Only reachable by a non-locking writer in that
  gap. Accepted, low.
- String `taskRefs` iterate characters, as in Python. Bad status raises `ValueError`, not `BoardError` — 0421's
  CLI must catch it, as aiboard's does.
- 0418's 4 accepted residuals untouched: no rank arithmetic, threads or child processes added.

### Forward notes

- **For 0423 / whoever owns `model.mjs`:** non-string input to 0417's `normalizeId` (via `pyStrip`) or
  `normalizeStatus` raises `TypeError` in Node and `AttributeError` in Python: exception class and
  message only; the files on disk are identical in every case. All known triggers (updated in review
  round 1; Build found the first, Verify the next two, the reviewer the last):
  1. a non-string entry hand-typed into a sprint's `tasks:` list (e.g. `- 1`);
  2. a bare number hand-typed into a task brief's `sprint:` field (e.g. `sprint: 1`);
  3. a program passing int refs to `sprintAdd` / `sprintRemove` / `moveSprint` (e.g. `sprintAdd('S-001', [1])`);
  4. a `null` status to `moveSprint` or to 0418's `moveTask`.

  None is reachable from the normal CLI / web paths: ids are always `T-NNN` / `S-NNN` strings and
  statuses are strings. A corpus with triggers 1 or 2 in it will show the mismatch.
- **For 0423's test mapping:** aiboard's `BoardTests` is split across `store.test.js` (29) and
  `sprints.test.js` (3); names are verbatim in both.

### Checks skipped

- `npm run test:prove-red`: touches none of these files (CONTRIBUTING row 3).
- `npm run test:release`: `bin/release.mjs` untouched.

### Fence

- `git status --porcelain --untracked-files=all` vs the start: only `test/board/sprints.test.js` and this
  worklog are new paths; `board/core/store.mjs` was already untracked (0418) and is the third changed file.
- Raw U+2028 / U+2029 / U+FEFF / U+0085 byte scan of `store.mjs` and `sprints.test.js`: none.
- No `.aiboard.lock*` in the repo; no `board-sprints-*` / `b419-par-*` temp folders left; no driver processes
  running. Scratch copies and negative-control folders deleted.

## 2026-10-21 — fkit-coder (Verify worker, spawned by fkit-sprint-ship-loop / fkit-lead) — PASS

Read-only on source; every number below re-run independently.

- **Diff:** the scratchpad `finalverify418/` holds no `store.mjs` copy. Baseline used: the pre-0419 copies in
  scratchpad `m/` and `r3/` (identical to each other; their `model.mjs` / `python-compat.mjs` /
  `store.test.js` / `model.test.js` match the repo). Current `board/core/store.mjs` with lines 839–876
  (`moveSprint`, `sprintAdd`, `sprintRemove`) deleted is byte-identical to that baseline: the diff is
  exactly the 3 methods.
- **`node --test test/board/sprints.test.js`:** 9 runs, all 6/6 pass, 0 fail.
- **`npm test`:** exit 0, 897/897 pass, 74 s wall (budget 120 s), load average about 5. `0284/term-ignored` passed.
- **Negative controls** (fresh copies in scratchpad `verify419/`, never the repo; unmutated copy 6/6):
  stale-list check made never-true → only test 3 fails; `sprintRemove` else-branch dropped → only test 6
  fails (plan step 7a also expected test 1 — it stays green); `moveSprint` dest-exists check dropped →
  only test 4 fails; extra: `_writeSprint` dropped from `moveSprint` → only test 4 fails.
- **Python parity:** Build's scripts copied unedited; aiboard `a1592dc` re-extracted with `git archive`,
  read-only, `aiboard/` package identical to the Build's; `python3 -I` 3.9.6; programs regenerated
  byte-identical. 18 hand cases: 16 identical, 2 differ. 400 generated: 351 identical, 49 differ. 283
  differing values over 51 programs, **all one class**: Python `AttributeError: 'int' object has no attribute
  'strip'` vs Node `TypeError: s.slice is not a function`. No file under the board differs in any program.
- **Build's cause statement partly refuted — same class, more triggers.** 35 of the 51 follow a non-string
  entry hand-typed into a sprint's `tasks:` list (as Build said). **The other 16 follow a different hand
  edit: a bare number typed in a task brief's `sprint:` field** (e.g. `sprint: 1`). A probe also hits it with
  no hand edit at all: a program passing an int ref (`sprintAdd('S-001', [1])`, `sprintRemove`, `moveSprint(1, …)`).
  Same 0417 `normalizeId` → `pyStrip` root cause. Not reachable through the normal write paths: ids are
  always `T-NNN` / `S-NNN` strings and `updateTask` normalizes `sprint`. A normal add / remove / move / check
  probe gave identical results.
- **Fence:** raw U+2028 / U+2029 / U+FEFF / U+0085 in `store.mjs`, `sprints.test.js`, `plan.md`, `worklog.md`: none.
  `plan.md` blob `1f5962313721c9a06f4b62ff941e01e7fb89d3e6` (unchanged). No `.aiboard.lock*` in the repo; no
  `b419-par-*` or Python temp folders left; no driver processes running. Two `fkit-board` servers (ports
  9001/9002) were already running before this check and are not from it. `npm test` left 3 `fkit-proj-*`
  folders in the system temp folder. Every suite run does this (`test/harness.mjs` `makeProject`). Removing them
  was blocked by the permission system, so they are still there. Scratch folder `verify419/` kept as evidence.
- **Skipped:** `npm run test:prove-red` (CONTRIBUTING row 3: no prove-red file touched); `npm run test:release`
  (`bin/release.mjs` untouched).

## 2026-10-22 — fkit-coder (Process-review worker, spawned by fkit-sprint-ship-loop / fkit-lead) — review round 1

Marker checked: plan.md blob `1f5962313721c9a06f4b62ff941e01e7fb89d3e6` (unchanged); owner approval relayed as
`AskUserQuestion`, 2026-10-21, `fkit-lead` session, *"Approve, keep extra tests (Recommended)"*. No commit, no push.

- **Review round 1:** "Ready to merge", no finding rows, one suggestion, one out-of-scope observation. No
  accepted residuals in the ledger; no ADR's "Re-raise only if" in play. Nothing to disposition; `review.md`
  *Coder response* gets a no-rows note; header `Status: closed-out`. *Reviewer findings* not edited.
- **Suggestion applied:** a 7th test in `test/board/sprints.test.js` (the one approved file),
  `sprint_remove of a member then a stale listing in one call keeps the member removed`: T-001 and T-002 in
  S-001, T-002's brief hand-edited to `sprint: S-002`, then `sprintRemove('S-001', ['T-001', 'T-002'])`.
  Asserts S-001 lists `[]`, T-001's `sprint` is `null`, T-002's brief bytes unchanged, S-001's `sprint.md`
  shows `_No tasks attached yet._`, and `check()` holds exactly the T-002 problem. Same expected result as
  aiboard `a1592dc` `store.py` `sprint_remove`, which also re-reads the sprint in its else branch (read with
  `git show` in the aiboard repo).
- **Mutant proof** (scratch copy of `board/` + the test file, deleted after): unmutated copy 7/7; with
  `sprint = this.getSprint(sprint.id);` deleted from `sprintRemove`'s else branch (diff checked: exactly that
  line) → 6 pass / 1 fail, only the new test, `actual: [ 'T-001' ]` vs `expected: []`.
- **Forward note for 0423** rewritten above to name all four known triggers of the `TypeError` vs
  `AttributeError` mismatch. Node side re-probed this round (scratch, deleted): `moveSprint` / `moveTask`
  with `null` status → `TypeError: Cannot read properties of null (reading 'length')`; int refs to
  `sprintAdd` / `sprintRemove` / `moveSprint` → `TypeError: s.slice is not a function`. Python side not
  re-run: taken from the Verify worker's parity run and the reviewer's round-1 run.
- **Checks:** `node --test test/board/sprints.test.js` ×3: 7/7 each, about 94 ms. `npm test`: exit 0,
  898/898 pass, 75.82 s wall (budget 120 s), load average 5.23 at start, 6.00 at end. `0284/term-ignored`
  passed (no failures in the run). Skipped: `npm run test:prove-red` and `npm run test:release` (same reasons
  as Build).
- **Fence:** raw U+2028 / U+2029 / U+FEFF / U+0085 in `sprints.test.js`, `store.mjs`, `worklog.md`,
  `review.md`: none. No `.aiboard.lock*` in the repo. Scratch mutant and probe folders deleted. `npm test`
  leaves its usual `fkit-proj-*` folders in the system temp folder (`test/harness.mjs`), not in the repo.

### Decision log (round 1, without asking)

1. **Added the reviewer's suggested test as a 7th test**, in the one approved file. Answers: the round-1
   suggestion (surviving mutant: no `getSprint` re-read in `sprintRemove`'s else branch). Changed: one new
   test in `describe('fkit additions')`; no source change; tests 1–6 untouched. Why it qualified:
   obvious winner within the plan's intent: the plan put tests 4–6 in this file for CONTRIBUTING key list
   item 4 (code that writes a user's files), and this mutant makes `sprintRemove` write a removed task back
   into `sprint.md`. A separate test, not an edit to test 6, so the six approved tests stay as approved.
   Note: the owner's approval text said "all 6 tests"; the file now has 7. Drop the 7th if that matters.
2. **Rewrote the 0423 forward note** (docs only) to list the four triggers. Answers: the round-1
   out-of-scope observation. Mechanical, requested by the driver.

## 2026-10-22 — fkit-coder (VERIFY worker, spawned by fkit-sprint-ship-loop / fkit-lead) — Re-verify (post-review)

Read-only on source; no commit, no push. **Result: pass.**

- **No source drift since the first Verify:** `board/` is byte-identical to the Verify copy
  (`diff -r` against `scratchpad/verify419/neg-base/board`, `store.mjs` included). The only change in
  `test/board/sprints.test.js` is the one added 7th test. `plan.md` blob still
  `1f5962313721c9a06f4b62ff941e01e7fb89d3e6`.
- `node --test test/board/sprints.test.js` ×3: 7/7 each, about 102–107 ms.
- **Mutant:** fresh scratch copy (`scratchpad/reverify419/`): unmutated 7/7; with
  `sprint = this.getSprint(sprint.id);` deleted from `sprintRemove`'s else branch (diff: exactly that
  line) → 6 pass / 1 fail, only the new test (`actual: [ 'T-001' ]`, `expected: []`). Copy deleted.
- `npm test`: exit 0, 898/898, 81 s wall (budget 120 s), load average 4.22 at start, 6.69 at end.
  `0284/term-ignored` passed.
- **Clean-up:** no `.aiboard.lock*` in the repo; no test or driver processes left (the two `fkit-board`
  servers on ports 9001/9002 were running before and are not from this check). `npm test` again left 3
  `fkit-proj-*` folders in the system temp folder (`test/harness.mjs`, known); not removed.
- **Skipped:** `npm run test:prove-red` (no prove-red file touched); `npm run test:release`
  (`bin/release.mjs` untouched).
