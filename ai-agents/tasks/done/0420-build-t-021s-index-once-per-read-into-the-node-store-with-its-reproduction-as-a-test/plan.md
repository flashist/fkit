# Plan: 0420, build T-021's index-once-per-read into the Node store, with its reproduction as a test

**Summary**
- **T-021 was only filed in aiboard, never fixed.** It sits in `tasks/backlog/` at `a1592dc`, and still does at aiboard HEAD `784e0ca`. No aiboard code or test exists for it. So the "original reproduction" to port is the method in T-021's brief: the cProfile count of `_scan` calls, the "loads 471 tasks to describe 234" count, the timing table, and its acceptance criteria. Read with `git show` only; nothing was written in aiboard.
- **The cause, confirmed in our port** (`board/core/store.mjs`). `snapshot()` calls `sprintProgress(s)`, which calls `getTask(tid)` once per sprint member. Each call does `_locate`, which runs a full `_scan` of all four status folders and stats every child, and then loads the task again. A member with blockers also builds a whole `_statusIndex()`, which reads every brief. So the cost is O(members × n).
- **The fix.** `snapshot()` loads every task once and passes a map of id to Task into `sprintProgress(sprint, index)`. With no index, `sprintProgress` keeps today's exact path, as T-021's acceptance criterion asks.
- **Output stays the same.** The map keeps the **first** folder found per id, in scan order, as `_locate` does. The lookup goes through the same `normalizeId` call, so odd refs, missing refs and the int-entry `TypeError` behave as before.
- **One new test file, `test/board/snapshot-index.test.js`** (the file A3 pre-approved). It runs inside `npm test` with **no timing assertions**: it counts scans and task loads, so a busy machine cannot make it flaky. Estimated ≤ 0.5 s; I will measure and quote it. The wall-clock benchmark is in the same file but **opt-in** (`FKIT_BOARD_BENCH=1`), so it never runs in the 2-minute budget.
- **Proof that output is unchanged:** a Node before-vs-after comparison over 1,400+ op programs, plus a Python `a1592dc` vs Node-after parity run. Both are scratchpad only, reusing the b419 drivers.
- **No other files change.** No `package.json` change; the `test/board/*.test.js` glob already picks the file up. No `.claude/` edits.

## 1. What I read
- The brief, all its dated notes. A3 is the start word for phase 2. One test file is pre-approved, under `test/board/`. The port source is `a1592dc`. The 2026-10-20 correction says board tests run inside `npm test`, within the 2-minute budget, and any slow test must be named in the plan.
- ADR-052 §D9 row 2: *"T-021 (speed) … built in with their original reproductions as tests."*
- ADR-057: §D1's ⛔ note, §D2.1's ⚠️ note (six pre-approved files, one per task, `0420` included), and §D10 (≤ 2 min on an idle Mac; CI fails the job over that).
- aiboard `a1592dc`: `aiboard/store.py`, plus `server.py`, `cli.py` and `mcp.py`, to see who calls `snapshot` and `sprint_progress`.
- 0418's worklog (parity method, accepted gaps, § For 0423), its `review.md` (4 Accepted residuals: ranks past 2^53, terminated worker, zombie holder, hostname change), and its plan line *"T-021's index-once is `0420`"*.
- 0419's worklog: the forward note on the four triggers for `TypeError` vs `AttributeError`, and the test mapping. Its `review.md`.
- `board/core/store.mjs` in full, `model.mjs` (`Sprint.tasks`, `normalizeId`, `Task.toDict`), and the existing `test/board/*.test.js`.
- The parity drivers under `…/scratchpad/b419/scripts/`. Their programs already include `snapshot` and `progress` ops and a final `snapshot()`.
- CONTRIBUTING: `board/` is key-list item 3, and the "anything else" row means `npm test`.
- A `npm test` run in 0419's scratch output: 74.8 s.
- fkit's corpus today: 188 backlog + 317 done + 32 cancelled = **537 task folders**.

## 2. The change (`board/core/store.mjs`, canonical; it is untracked like the rest of `board/`)

1. **`listTasks` becomes a thin wrapper.** `listTasks(filters)` calls `this._listTasks(filters, null)`. `_listTasks({ status, sprint, unblocked, stale, needs_reply } = {}, byId)` is today's body unchanged, plus one line after `out.push(task)`: `if (byId !== null && !byId.has(tid)) byId.set(tid, task);`.
   - That gives first-wins in **scan order**, which is the order `_locate` searches. Python's `_status_index` keeps the last copy instead, and that is not the semantics `getTask` uses.
   - The public signature and behaviour of `listTasks` are unchanged. A status filter still skips loading tasks in other statuses, so a broken task elsewhere still does not throw.
2. **`sprintProgress(sprint, index = null)`.**
   - With `index === null`: today's loop, byte-for-byte the same.
   - With an index: for each `tid` of `sprint.tasks`, in order, call `const id = normalizeId(TASK_PREFIX, tid)` (the same call `_locate` makes, so it throws the same errors). If `id` is null or not in the index, skip the entry, which is what the NotFound catch does today. Otherwise use `index.get(id)`.
   - Counts, sort (`_cmpRankKey`, stable), total, percent and remaining are unchanged.
   - JSDoc: the index maps an id to the Task `getTask` would return (the first folder per id in scan order). Python has no such parameter; T-021's acceptance criterion adds it.
3. **`snapshot()`.** Build `const byId = new Map()`, set `tasks = this._listTasks({}, byId)`, then call `this.sprintProgress(s, byId)` per sprint. The rest is unchanged. One WHY comment, at most 2 lines: per-member `getTask` re-scanned the tree, which made the snapshot quadratic (aiboard T-021).
4. **Header comment** (line 1): add that `snapshot` reads each task once (aiboard T-021, built in per ADR-052 D9). It says what differs from `a1592dc`, not history.

**Why the output cannot change in sequential use:**
- Every task `getTask` would load per member has already been loaded by `listTasks` in the same call: the same files, the same parse, and the same blocker resolution from a `_statusIndex` over the same files.
- Every load or parse error a member could raise is already raised by `listTasks` first, in both versions.
- The only per-member work left is `normalizeId`, kept as is.
- `snapshot` throws away `progress.tasks` and keeps only `total`, `counts`, `percent` and `remaining`.

**Deliberately not changed:**
- `check()` and `_renderSprintTaskList` still call `getTask` per member, so they are also O(members × n). Not polled. See open question Q1.
- `getTask`, `_statusIndex` and every write path.

## 3. The one test file: `test/board/snapshot-index.test.js` (new; A3-pre-approved; ADR-057 §D2.1)

House style follows `sprints.test.js`: `node:test`, `assert/strict`, a temp board per test, `realpathSync(mkdtempSync(...))`, removed in `afterEach`, and a header comment naming aiboard T-021. Counting uses instance shadowing: `board._scan` and `board._loadTask` are replaced on the instance with counting wrappers around `Board.prototype`, so the store is not touched.

- **Test A: the T-021 reproduction** (default lane, no timing).
  - Name: `snapshot scans the tree a fixed number of times and loads each task once, however many tasks the sprints hold (aiboard T-021)`.
  - Two boards built through the API: N=3 and N=12 tasks, every task in a sprint, one third with a blocker.
  - Asserts: the `_scan` call count during `snapshot()` is the **same for both N**, which is T-021's "`_scan` is called O(1) times per snapshot". The `_loadTask` count is **exactly N**, which is T-021's "loads 471 tasks to describe 234".
  - **Red today:** scans = 3 + members + blocked members, and loads = 2N.
  - Note: T-021's 28,543 comes from cProfile counting generator resumptions. The test counts calls, and the worklog says so.
- **Test B: behaviour lock** (default lane). Name: `snapshot sprint progress is unchanged by the index: first copy of a duplicate id, odd refs, missing tasks, errors`. One board holds:
  - tasks in all four statuses;
  - a blocked member;
  - a **duplicate id**: a hand-made `tasks/backlog/T-0003-copy/` while T-003 is done, so the first-found copy wins;
  - a sprint whose `tasks:` holds `'1'`, `'t-2'`, `'T-0004'`, `'T-999'`, `'bogus'` and `'T-001'` (normalized refs, a missing one, an invalid one, and a duplicate entry);
  - an empty sprint.

  Asserts:
  - every sprint's `progress` from `snapshot()` equals **hard-coded expected values** (independent of the code) and also equals `sprintProgress(s)` with no index;
  - `snapshot().tasks` deep-equals `listTasks().map(toDict)`;
  - then a hand-typed int entry (`- 1`) in a sprint's `tasks:` makes `snapshot()` throw the same class and message as `sprintProgress(s)` with no index.

  B passes before the change too (it is the lock). The negative controls in §5 show it can fail.
- **Test C: the benchmark** (opt-in). `{ skip: !process.env.FKIT_BOARD_BENCH }`, so `npm test` reports it as skipped and it costs about 0 s.
  - Builds synthetic boards by writing files directly with `dumpFrontMatter`, because `createTask` into sprints is itself quadratic. Sizes: n = 100, 405, **540** (≥ fkit's 537) and 800. Brief about 9.2 KB and worklog about 16.9 KB (T-021's medians). Every task in a sprint of about 30. No blockers, which matches T-021's set-up.
  - Times two paths: the **old path**, `listTasks()` + `listSprints()` + `sprintProgress(s)` with no index (exactly the pre-fix snapshot algorithm, still present), and the new `snapshot()`. One warm-up, then the median of 5 runs each.
  - Asserts only that both give equal output, apart from `generated`.
  - Reports ms, the ratio, and the scan and load counts via `t.diagnostic`.
  - Run with `FKIT_BOARD_BENCH=1 node --test test/board/snapshot-index.test.js`. Estimate: about 30–60 s, outside the budget (D10 counts only the default lane).

**Time inside `npm test`:** A + B estimated ≤ 0.5 s (about 20 `createTask` calls plus a few hand edits; `sprints.test.js` does 7 tests in about 100 ms). Measured at build and quoted. **If the file takes > 2 s in `npm test`, I stop and return NEEDS-DECISION** rather than ship it. **Flakiness under load:** none possible in the default lane, because no assertion reads a clock.

## 4. Sequence (tests first)
1. Baseline: `git status --porcelain --untracked-files=all` to the scratchpad. Copy `board/core/` to `…/scratchpad/b420/before/` (the reference for the before/after comparison).
2. Write the test file. Run `node --test test/board/snapshot-index.test.js`. **Red:** A fails, with the actual vs expected counts quoted. B passes. C is skipped.
3. Make the §2 change.
4. **Green:** the file alone, then `node --test test/board/*.test.js`, then `npm test` (total time and this file's time quoted).
5. Negative controls (§5).
6. Parity (§6).
7. Run the benchmark (§3 C). Quote the table in the worklog.
8. Write the worklog. Fence check.

## 5. Negative controls (scratch copies, deleted after; each must turn a test red)
- (a) `snapshot` back to `sprintProgress(s)` with no index → A fails. This is also the red run.
- (b) Index built last-wins (`byId.set` with no `has` guard) → B fails on the duplicate T-003.
- (c) `index.get(tid)` with no `normalizeId` → B fails on `'1'`, `'t-2'` and `'T-0004'`.
- (d) An index path that catches every error → B's int-entry assert fails.

## 6. Proof the output is unchanged (scratchpad only, not kept; same method as 0418/0419)
- Copy, never edit in place, `b419/scripts/{drive_js.mjs,drive_py.py,compare.mjs,gen.mjs,gen419.mjs,gen_fixed419.mjs}` into `…/scratchpad/b420/scripts/`. Do a fresh `git archive a1592dc` into an empty, read-only folder, and run Python with `python3 -I` from the scripts folder.
- Add a `gen_fixed420.mjs` of about 10 hand programs: duplicate ids across statuses with sprint membership; odd, missing and duplicate refs in `tasks:`; a string `tasks:` value; int entries; blocked members; empty sprints; a deleted status folder; many sprints. Each ends in `snapshot` and `progress`.
- **Node before vs Node after** (b420/before vs the live `board/core`): seeds 1–1000 of `gen.mjs`, the 400 `gen419` programs, the 0419 fixed cases and the new hand cases. **Expect 100% identical JSON**: results, error class and message, every file's bytes, final `check()` and `snapshot()`.
- **Python `a1592dc` vs Node after**, on the same programs. Expect identical except the already-documented differences: 0418's accepted gaps (`aiboard.json` details, ranks past 2^53) and 0419's `TypeError`/`AttributeError` triggers 1–4. Any other difference means stop and fix, or report.
- **Corpus-sized:** `snapshot()` on the 540 and 800 synthetic boards, Python vs Node after, normalized JSON equal. Python's own snapshot time on the same boards is quoted next to T-021's table, as a reference only.

## 7. Checks
- **Run:** `node --test test/board/snapshot-index.test.js` (red, then green); `node --test test/board/*.test.js`; **`npm test`** (CONTRIBUTING "anything else" row; `board/` is key-list item 3); the opt-in benchmark; the §6 parity runs (scratchpad).
- **Skipped:** `npm run test:prove-red` (touches none of its files, row 3); `npm run test:release` (`bin/release.mjs` untouched); a separate `node --test test/*.test.js`, which `npm test` covers. The brief's Verification 3 is superseded by the 2026-10-20 correction note.

## 8. Worklog (`ai-agents/tasks/backlog/0420-…/worklog.md`, process doc)
- Change surface; red and green output; negative controls.
- Benchmark table: n, old ms, new ms, ratio, scans, loads, machine and load average. The counts are machine-independent; the ratio roughly is.
- Parity counts; a decision log (calls made without asking, or `none`); checks skipped and why.
- Fence: only `board/core/store.mjs`, `test/board/snapshot-index.test.js` and the worklog change. No U+2028, U+2029, U+FEFF or U+0085 raw bytes. No temp folders or lock files left behind.
- Forward notes:
  - **0421:** the CLI `sprint list` (and aiboard's MCP equivalent) calls `sprint_progress` per sprint. It can pass one index; `_listTasks(…, byId)` is the builder.
  - **0422:** serve `snapshot()` as is.
  - **0423:** 0420 should produce no output difference against Python, apart from the race-only case under Limits.
- Limits:
  - Under a concurrent writer, the snapshot is now built from one read pass instead of two. This is more consistent, and it is only visible in a race. Reads take no lock, in Python or in the port.
  - `stale` is computed once per task instead of twice. `progress.tasks` is thrown away by `snapshot`, so this cannot be seen there.
  - `sprintProgress(s, index)` returns the same Task objects that are in the index.

## 9. Edge cases covered
- Duplicate id folders: first in scan order wins, matching `_locate`, not `_status_index`.
- Non-normalized, invalid, missing or duplicated `tasks:` entries: handled by the same `normalizeId` call.
- Non-string entries: the same `TypeError` (0419 trigger 1).
- A string `tasks:` value iterates its characters through `pyList`, unchanged; `'1'` normalizes to T-001, as before.
- A `pyList` error from `sprint.tasks`: thrown before the loop on both paths.
- Board deleted mid-snapshot: race only.
- Blocked members: the old path's extra `_statusIndex` per member is gone; the blocker data is the same.
- 0418's 4 accepted residuals: untouched. No locking, threads or rank arithmetic change.

open questions:
- Q1. **Scope: snapshot only, or also `check()`?** `check()` (and the `## Tasks` re-render it compares) still does a full scan per sprint member, so `aiboard check` on fkit's 537 tasks keeps the slow per-member path. The web board's 3-second poll, which is T-021's case, does not. (Rec) Snapshot only, as T-021 names. `check()` and the CLI `sprint list` go to forward notes for 0421. Option 2: also pass the index into `check()`'s render. That is about 5 more lines, the same parity proof, and slightly beyond T-021's wording. knock-on: none (checked); no `Depends on:` link changes.
- Q2. **Where the wall-clock benchmark lives.** (Rec) An opt-in, env-gated test inside the one pre-approved file. It is skipped in `npm test`, so `npm test` shows "skipped 1" where 0418 and 0419 showed "skipped 0". It is kept, so 0423 and later tasks can rerun it. Option 2: a scratchpad one-off whose output the worklog pastes, with nothing kept (like 0423's own check). knock-on: none (checked).
- Neither question blocks: the plan as written takes the Rec on both. The owner can overturn either at plan approval.
