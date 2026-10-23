# Worklog — 0418

## 2026-10-21 — fkit-coder (Build worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Built the approved `plan.md` (blob `ec6aecc4`, checked with `git hash-object`) under the declared-approval
marker. Owner approval relayed: `AskUserQuestion`, 2026-10-21, `fkit-lead` session, selected *"Approve, move
the line (Recommended)"*. That settles open question 1 = (A): 0418 ports the sprint code the task half and
its tests need; `move_sprint`, `sprint_add`, `sprint_remove` and 0419's three tests stay in 0419. Open
question 2 (test 27's 31-day shift) stands as planned. No commit, no push. `plan.md` not edited.

### Change surface

- `board/core/store.mjs` (new): port of `aiboard/store.py` @ `a1592dc`, the §2 scope under option (A).
- `board/core/lock.mjs` (new): the cross-process lock of plan §5.
- `board/core/python-compat.mjs` (0417's file, additions only): one `import` line at the top and a block
  appended at the end. No existing function changed. See the decision log for the names added beyond the
  plan's list.
- `test/board/store.test.js` (new): **the one pre-approved test file**, 31 tests (29 `BoardTests` + 2 fkit
  additions). No other test file.
- `ai-agents/tasks/backlog/0418-…/worklog.md` (this file).
- Untouched: `board/core/model.mjs`, `package.json`, `claude/`, `install.sh`, every `.claude/` copy, the
  wiki, 0419's brief.

### Red run (stub `store.mjs` / `lock.mjs`, every method throwing `not implemented`)

`node --test test/board/store.test.js`, exit 1: tests 31, pass 0, fail 31. All 31 fail with
`Error: not implemented`, thrown by `beforeEach`'s `init()` (as the plan expected):

```
✖ test_requires_init                                   ✖ test_assign_logs
✖ test_critical_priority_and_urgent_alias              ✖ test_parallel_writers_get_unique_ids
✖ test_hand_edited_urgent_reads_as_critical            ✖ test_init_writes_config_and_discovery_walks_up
✖ test_new_tasks_join_the_bottom_and_critical_ones_the_top  ✖ test_pointer_file_discovery
✖ test_rank_top_bottom_before_after                    ✖ test_dependencies
✖ test_a_move_rewrites_only_the_moved_task             ✖ test_start_is_an_atomic_claim
✖ test_rank_respaces_when_a_gap_runs_out               ✖ test_assign_refuses_to_steal_without_force
✖ test_rank_validation                                 ✖ test_parallel_start_has_exactly_one_winner
✖ test_rank_survives_status_changes_and_orders_every_view  ✖ test_comments_and_stale_detection
✖ test_raising_to_critical_moves_to_the_top_once       ✖ test_not_found
✖ test_ranking_does_not_touch_updated                  ✖ test_snapshot_shape
✖ test_boards_without_ranks_keep_id_order              ✖ reads and writes files the way Python does (port guard)
✖ test_check_reports_a_malformed_rank                  ✖ a lock left by a killed process is broken
✖ test_create_and_move_task
✖ test_log_appends
✖ test_check_detects_inconsistency
✖ test_quoted_title_survives_store
✖ test_hand_made_task_is_readable
```

### Green run

- `node --test test/board/store.test.js`, exit 0: tests 31, pass 31, fail 0, 1.2 s. The slow tests alone:
  `test_parallel_writers_get_unique_ids` 0.6–1.0 s, `test_parallel_start_has_exactly_one_winner` 0.17–0.2 s,
  `a lock left by a killed process is broken` 0.03–0.05 s.
- `time npm test`, exit 0: tests 887, pass 887, fail 0, **67.5 s** wall (load average 4.57 at the start,
  5.99 at the end; 14-core Mac). Inside the 120 s budget (ADR-057 D10). `0284/term-ignored` (`0537`)
  passed in all three full runs this session.
- ⚠️ **Inside the full `npm test` the slow tests are much slower than the plan's "under about 2 s each":**
  writers 5.0–5.4 s, start race 12.3–13.0 s, stale-lock test 9.0–9.8 s (three full runs). Whole-suite time
  did not grow (67.5–67.9 s; the plan quoted 75–87 s before this file). Instrumented once (then reverted):
  9.2 s passes between the parent's `spawn()` call and the child process's own start time
  (`performance.timeOrigin`); import and lock take 6 ms. So the delay is before the child process exists,
  not in the lock. **Cause not found.** It is not CPU load (14 busy loops: 1.0 s / 0.19 s / 0.05 s), not any
  single other test file (each of the 22 paired with this file: start race ≤ 219 ms), and not system-wide
  spawn latency (a separate Node process spawning `node` every 200 ms during the suite: median 14 ms, max
  78 ms). The 60 s per-test timeout still leaves a wide margin.

### Repeat runs of the two parallel tests (real `node` processes)

- `node --test --test-name-pattern parallel test/board/store.test.js`: **25 runs, 25 passed** (writers
  max 0.80 s).
- 5 more runs while `npm test` ran at the same time (load average 8.16): **5 passed**. That `npm test`
  run also passed (887/887).

### Stress, kill test and negative control (scratchpad only, not kept)

- **Stress, creators:** 50 processes × 2 tasks each, each into sprint `S-001`, × 10 rounds: 0 bad rounds
  (100 unique ids, `check()` empty, sprint lists 100, no owner file left).
- **Stress, starters:** 30 processes racing `start('T-001')` × 10 rounds: exactly 1 winner every round;
  every loser a `BoardError` (`in-progress by …` / `already assigned …`); one status-change entry.
- **Kill test A:** 20 writers × 5 tasks, 5–6 `SIGKILL`ed at random, × 30 rounds: survivors never failed;
  ids unique; no owner or break file left; next writer 4–8 ms.
- **Kill test B:** 10 writers, *all* `SIGKILL`ed at a random moment, × 40 rounds: a dead holder's owner file
  was left in 39–40 rounds and the next writer broke it every time. One round left a task folder with no
  `brief.md`/`worklog.md` (killed between `mkdir` and the first write) — limit 2 below, same as Python.
- **Negative control:** a scratchpad copy of `board/` with `writeLock` turned into `return fn()`: both
  parallel tests **fail** in 3 of 3 runs (duplicate ids such as `T-003` ×3, `T-009` ×5; more than one
  start winner). So the tests can see a missing lock.

### Python parity (one-off, scratchpad only)

aiboard `a1592dc` extracted with `git archive` into an empty folder; drivers run with `python3 -I`
(3.9.6) from a separate folder. Each program runs in a fresh board through both stores; compared: every
result (`to_dict(include_body=True)` for tasks and sprints), error class and message, every file's bytes
(and the folder list), final `check()` and `snapshot()`. Timestamps and the root path replaced by
placeholders first.

- **1,000 generated programs** (seeds 1–1000; 19,872 ops in the first 500 alone, 3,574 of them errors of
  30+ kinds — hostile titles: emoji, quotes, `\`, `:`, CR/LF/U+2028 inside, `\g<0>`, `\1`, octal; CRLF bodies;
  create / update / rank / move / block / unblock / start / assign / log / comment / get / list / check /
  check --fix / snapshot / sprints; hand edits: CRLF, CR, BOM, removed / malformed / negative rank,
  `urgent`, old stamps, deleted worklog; config edits): **1,000 identical, 0 differences.**
- **10 hand-written edge programs:** config values (`"1_0"`, `"inf"`, `"nan"`, `true`, list, `{}`, `1e400`,
  huge ints, Unicode digits, non-dict configs, duplicate keys), invalid JSON / BOM / bad-UTF-8 config,
  decoding (BOM, lone CR, U+2028 headings, truncated / invalid / surrogate UTF-8), lone surrogates in titles,
  odd folders (`T-٣`, `T-0007`, duplicate ids, `X-` folders, a file named like a task, an id past 2^53),
  a deleted status folder (`shutil.move`'s copy fallback), discovery and pointers, sprints, ranks, cycles:
  **9 identical; 1 differs** (big-number rank, below).
- Differences found:
  1. The *"is not valid JSON: <detail>"* detail text — accepted gap (plan §3).
  2. ⚠️ **New, not in the plan's gap list:** a task whose rank is past 2^53 — reached only by an id
     ≥ about 9×10^12 (rank = id × 1000) or a hand-edited huge rank. Python writes `rank:
     12345678901234567891000`; the port writes `rank: 1.2345678901234568e+22`, which then reads back as a
     malformed rank (`check` reports it). Cause: 0417's `Task.rank` returns a JS number (`pyInt` →
     `Number`), so precision is gone before the store sees it. Not fixed here: the plan leaves `model.mjs`
     untouched. Forward note below.

### Locking: what it does and does not guarantee (plan §5, carried here as verification step 4 asks)

Mechanism: an `O_EXCL` owner file, `.aiboard.lock.owner`, holding `{pid, threadId, host, token, acquired}`.
Python's empty `.aiboard.lock` is still created and held open. A holder that died is detected
(`process.kill(pid, 0)` → `ESRCH`, same host) and its file removed by whoever holds
`.aiboard.lock.break`, after re-checking the bytes and inode. Waiting backs off 2–50 ms with jitter; no
timeout.

It does **not** guarantee:

1. Readers take no lock, as in Python. A reader can see a half-written brief or a task folder mid-move,
   and may throw.
2. Writes are not atomic. A crash mid-write leaves a partial file, as in Python (seen in kill test B). A
   multi-file operation (brief + worklog + sprint) is atomic only towards other writers, not towards a
   crash.
3. No mutual exclusion with Python aiboard writing the same board at the same time (different
   mechanisms).
4. Network or sync filesystems (NFS variants, SMB, Dropbox, some FUSE) may not make `O_EXCL` atomic.
5. Automatic stale breaking works only for a holder on the same host and in the same PID namespace. A
   reused pid, another host, or another container sharing a volume under the same hostname can make a
   dead holder look alive, and the writer then waits forever.
6. A hung live holder blocks every writer forever (as `flock` does). No fairness or ordering among
   waiters.
7. After a `SIGKILL`/`SIGINT` or a power loss, `.aiboard.lock.owner` stays on disk until the next writer
   breaks it. Python's kernel lock vanishes.
8. Within one process, ordering holds only because the store is synchronous. 0422 must keep store calls
   synchronous or queue them itself.
9. *(added at build)* The reverse of 5: a **live** holder in another PID namespace with the same hostname
   (e.g. a container sharing the volume) can look dead (`ESRCH`) and have its lock broken while it still
   writes — two writers at once.
10. *(added at build)* A holder paused for more than 10 s between creating the owner file and writing its
    record (e.g. `SIGSTOP`) is judged dead and broken; it then writes on, believing it holds the lock.
11. *(added at build)* If a breaker dies holding `.aiboard.lock.break`, the file is removed after 10 s.
    Two waiters removing that same old file at once can both go on to break; a small window remains in
    which one of them removes a fresh lock just taken by a third writer. Needs a crashed breaker first.
12. *(added at build)* A second `Board` on the same root, used inside the first one's `writeLock` in the
    same thread, throws `BoardError` (Python would deadlock). One `Board` per root per process (0422).

### Decision log (calls made inside the approved plan, without asking)

- **`python-compat.mjs` names beyond plan §1's list.** Added, additive only: `JSONDecodeError`
  (`ValueError`), `OverflowError`, `AttributeError`, `RuntimeError`, `IndexError`, `ReError` (Python's
  `re.error`, not a `ValueError`) and `pyTimedeltaHoursMs`. Why it qualified: each is the Python error or
  check that a §3 item names (timedelta's `OverflowError`/`ValueError`; `re.error` for `bad escape`;
  `dict.get` on a non-dict config raising `AttributeError`; the symlink-loop `RuntimeError` of
  `Path.resolve`; `IndexError` for `\g<name>`), so they are the plan's own behaviour, given names.
  Small private helpers (`pj` join, `exists`/`isDir`/`isFile`, `mkdir`, `touch`, `move`) live in
  `store.mjs`, not in the shared file.
- **`shutil.move` copies when the rename fails, not only on `EXDEV`.** Plan §3 said `renameSync`, with
  cross-filesystem moves an accepted gap. Found at build: Python's `shutil.move` falls back to
  copy-then-delete on *any* rename error, so moving to a deleted status folder (`tasks/cancelled/` removed
  by hand) **succeeds** in aiboard (`copytree` creates the folder) and would fail in a bare `renameSync`
  port. Implemented the fallback (`cpSync` keeping symlinks and timestamps, then `rmSync`). Why it
  qualified: faithfulness is the plan's goal, it is local to one helper, and it also closes the plan's
  `EXDEV` gap. Parity program `missing_status_dir` is identical to Python.
- **Wall clock for one lock check.** Plan §5 says timing uses `performance.now()`, never `Date`. The
  backoff does. The "unwritten record older than 10 s" and "break file older than 10 s" checks compare
  against a file's mtime, which is wall-clock time, so they use `Date.now()`. No other choice is possible.
- **`pyWriteText` truncates before encoding.** Python's `write_text` opens (truncating) and then fails on
  a lone surrogate, leaving an empty file. Copied, and confirmed identical in the `surrogates` parity
  program.
- **Test 21 (`test_init_writes_config_and_discovery_walks_up`)** deletes the extra temp folder it makes
  for `find_board_root(...) is None`; Python leaks it. No assertion changed.
- **Test 26 extra assertion** (plan §4): every loser exits 1 with a `BoardError` text. Done as planned.
- **Test 27** uses the planned 31-day shift. Logged here as the plan asks.
- **Test 29** also walks the snapshot and asserts it holds no `Map`, `undefined` or `BigInt`, because
  `JSON.stringify` (unlike `json.dumps`) would silently write a `Map` as `{}`.
- **Obvious-winner calls without asking: none** beyond the items above.

### Accepted gaps (plan §3, plus two found at build)

- `aiboard.json` only: Python accepts `NaN`/`Infinity`; integer-like keys in a config object come out
  reordered; the *"not valid JSON: <detail>"* text differs. Phase 3 drops `aiboard.json`.
- `_findCycles` recursion depth (Python stops near 1,000 levels; JS goes deeper).
- *(found at build)* `pyFormatG`, used only for `stale_after_hours` in a `check` message: on an exact
  decimal tie at the 6th digit (e.g. `1234565`), JS rounds up and Python rounds to even. Noted in the
  code.
- *(found at build)* Ranks past 2^53 — see Python parity, difference 2. Not accepted by anyone yet:
  flagged to the driver.

### Forward notes

- **0417's `Task.rank` returns a JS number**, so ranks past 2^53 lose precision and the store writes them
  in exponent form. Fix belongs in `model.mjs` (`rank` as `BigInt` when unsafe) plus the store's rank
  arithmetic; not in 0418's plan.
- **0419:** `test_check_detects_and_fixes_stale_sprint_list` will pass on its first run, since `check`,
  `refreshSprint` and the `## Tasks` renderer are ported here (plan open question 1, cost of (A)).
- **0422:** keep store calls synchronous (limit 8) and use one `Board` per root (limit 12).
- **Inherited aiboard crash, kept:** `updateTask` with a title such as `C:\path` throws `bad escape \p at
  position 4` (Python's `re.sub` template rules). Phase 3.

### Checks skipped

- `npm run test:prove-red`: no file it mutates or runs is touched (CONTRIBUTING, row 3).
- `npm run test:release`: `bin/release.mjs` untouched.
- A separate `node --test test/*.test.js`: `npm test` covers it.

### Fence

- `git status --porcelain` after the build is identical to the pre-build baseline. The new files sit
  inside folders that were already untracked at baseline (`board/`, `test/board/`, and the task folder);
  `--untracked-files=all` shows exactly: `board/core/lock.mjs`, `board/core/store.mjs` (new),
  `board/core/python-compat.mjs` (changed, 0417's), `test/board/store.test.js` (new), this worklog.
- `git diff package.json`: only 0417's two script lines, already in the baseline; nothing from 0418.
- Raw U+2028 / U+2029 / U+FEFF / U+0085 in the four changed source files: none (escapes only).
- No temp folders, lock files or child processes left behind.

## 2026-10-21 — fkit-coder (Verify worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Read-only on source; no commit. Result: **pass**.

- `node --test test/board/store.test.js`: 31/31, 1.1 s. `node --test test/board/*.test.js`: 42/42.
- `npm test`: 887/887 in every run (7 runs, 73.8–76.6 s wall; inside the 120 s budget, ADR-057 D10).
  `0284/term-ignored` (0537) passed every run (6.3–6.7 s).
- Parallel tests alone, 15 runs: 15 passed (writers 0.64–0.79 s, start race 0.15–0.23 s).
- Negative control, fresh copy of `board/` + `test/board/` with `writeLock` returning `fn()`: both
  parallel tests fail, 3 of 3 runs.
- Python parity (Build's driver scripts copied; aiboard `a1592dc` re-extracted with `git archive`;
  `python3 -I`, 3.9.6): 1,000 generated programs identical; 10 hand-written programs: 9 identical,
  1 differs (`folders`: rank past 2^53, see below). The JSON-detail text gap is masked by the driver.
- Leftovers: no `board-store-*` temp folders, no `.aiboard.lock*` files in the repo, no child processes.
  Raw U+2028/U+2029/U+FEFF/U+0085 in the four changed source files and this worklog: none.
- Fence: `git diff package.json` shows only 0417's two script lines. `model.mjs` is untracked (no git
  diff possible); its mtime (2026-10-20 21:37) predates this build.

**Build flag 1, slow parallel tests inside `npm test` — reproduced, located, cause still unknown.**
Under `npm test` (7/7 runs): writers 4.5–5.4 s, start race 11.2–12.7 s, stale-lock 9.9–10.9 s. The
identical command launched any other way — `node --test test/*.test.js test/board/*.test.js` directly
(3 runs), via `sh -c`, via a Node parent, or with npm's exported environment but no npm — gives
0.86–0.92 s / 0.19–0.28 s / 0.04–0.12 s, and the whole suite takes 55–58 s instead of 74–77 s. A spawn
probe (scratchpad, `--import` patch of `child_process.spawn`) shows: `spawn()` returns in 0.2 ms, the
`spawn` event fires within 11 ms, but the child's `performance.timeOrigin` comes 1.0 s (create),
3.3 s (move), 12.1 s (start) and 10.4 s (hold) later — all children of one batch start within ~0.1 s
of each other, so they wait on something shared before Node's own startup. The npm penalty also hits
other spawn-heavy files (symlink tests 40 s under npm vs 7–11 s direct), so it is not 0418's code.
Not a defect here; the 60 s per-test timeout leaves margin. One outlier: the run with npm's
environment but no npm took 135 s overall (store tests fast; `Group B — hook wiring` 88 s); not
repeated.

**Build flag 2, ranks past 2^53 — reproduced.** Own minimal repro (hand-edit `rank: 9007199254740993`
on T-001, then create T-002): Python reads 9007199254740993 and writes `rank: 9007199254741993`;
the port reads 9007199254740992 and writes `rank: 9007199254741992`. `check()` is empty on both sides,
so the loss is silent at this size. At ~1e22 (parity program `folders`) the port writes
`1.2345678901234568e+22` and `check` then reports it malformed. Cause as the Build said: `model.mjs`
`Task.rank` returns a JS number. Not fixed (outside the plan).

Checks skipped: `npm run test:prove-red` (no file it mutates or runs is touched); `npm run
test:release` (`bin/release.mjs` untouched); a `git diff` of `model.mjs`/`python-compat.mjs` (both
untracked — no baseline to diff against).

Decision log: none (verify only, no fix applied).

## 2026-10-21 — fkit-coder (Process-review worker, round 1, spawned by fkit-sprint-ship-loop / fkit-lead)

Processed `review.md` R1–R5 under the declared-approval marker (plan blob `ec6aecc4`, unchanged) and the
owner's rulings of 2026-10-21 (`AskUserQuestion`, `fkit lead` session): R5 *"Make it loud
(Recommended)"*; R1–R3 *"Fix cheap ones, list rest (Recommended)"*. No commit, no push. `model.mjs`
and `plan.md` not edited.

### Change surface

- `board/core/lock.mjs`: R3 — `breakStale` returns `false` when another waiter holds `.break`; the
  acquire loop then backs off instead of spinning.
- `board/core/store.mjs`: R5 — `check()` reports ranks too big to store exactly.
- `test/board/store.test.js` (the one approved file): 3 tests added under `fkit additions` (34 now).
- This worklog; `review.md` *Coder response* rows and *Accepted residuals* (never *Reviewer findings*).

### Checks

- `node --test test/board/store.test.js`: 34/34, 1.3 s.
- Parallel, worker and killed-holder tests (`--test-name-pattern 'parallel|worker threads|killed
  process'`): **15 runs, 15 passed**.
- `npm test`: 890/890, 75.4 s wall (load average 7.73 at the start, 6.02 at the end). `0284/term-ignored`
  (0537) passed (6.3 s). Inside the 120 s budget.
- Negative controls (scratchpad copy of `board/` + `test/board/`, deleted after): copy fallback replaced
  by a rethrow → the move test fails; `writeLock` a no-op → the worker test fails 3/3 (6, 8, 9
  duplicate ids); big-rank check removed → its test fails.
- R3 probe (dead holder + fresh `.break`, one waiter): before **9.99 s CPU in 10.0 s**; after **0.04 s
  CPU in 10.1 s**; lock taken; no owner or break file left.
- Leftovers: no `board-store-*` temp folders, no `.aiboard.lock*` files in the repo, no child processes.
  Raw U+2028/U+2029/U+FEFF/U+0085 in `lock.mjs`, `store.mjs`, the test file and this worklog: none.
- Skipped: Python parity re-run (the drivers were scratchpad-only and are gone; the only parity change is
  the intended R5 message, below); `npm run test:prove-red` and `npm run test:release` (no file they
  cover is touched).

### Locking limits added (continues the list above)

13. *(review R1)* A worker thread ended with `worker.terminate()` while it holds the lock leaves
    `.aiboard.lock.owner`. Same pid, other `threadId` reads as alive, so every writer in every process
    waits, with no message, until that whole process exits. A terminated worker runs no `exit` hook
    (probed), and Node cannot tell one thread whether another still runs. A worker that throws or
    returns releases normally.
14. *(review R2a)* A holder killed but not yet reaped (a zombie) passes `kill(pid, 0)` and reads as
    alive. A process that kills its own holding child and writes before its event loop reaps it waits
    forever, with no message.
15. *(review R2b)* If the machine's hostname changes (macOS does this when the network changes) while a
    dead holder's owner file is on disk, the record reads as "another host" and every writer waits
    forever, with no message, until `.aiboard.lock.owner` is deleted by hand. Reasoned, not measured.

**For 0422 (the server):** never terminate a worker thread that may hold the board lock — let it finish
or exit by itself; always wait for `close`/`exit` of any child process it kills before its next board
write; and keep limits 8 and 12 (synchronous store calls, one `Board` per root).

### For 0423 (the parity gate): an intended difference from Python's `check()`

*(Corrected in review round 2, R6: the stored-rank message and the cases below.)* By owner ruling (R5,
above), `check()` adds one of two problems aiboard does not print, only for a task whose rank a JS
number cannot hold exactly:
- `<id>: rank <raw> cannot be stored exactly (it must be between -9007199254740991 and
  9007199254740991)`: the stored rank is a whole number outside -9007199254740991..9007199254740991
  (negative ranks too: a hand-typed `rank: -9007199254740993` loses precision the same way).
- `<id>: its id-based rank is too big to store exactly (largest is 9007199254740991)`: the task has **no
  usable stored rank** (none, or a malformed one, which also prints aiboard's own *"is not a whole
  number"* line first) and its id is ≥ about 9×10^12, so the id-based rank is past the limit.

The parity gate must expect these on such boards and nowhere else. One more case shows up only on a
later run: a safe stored rank within 1000 of the limit can give a new task a rank past it (measured:
`rank: 9007199254740991`, then `createTask` writes `rank: 9007199254741992`, one off from the
`9007199254741991` Python's exact integers give, by arithmetic, not run); the next `check()` reports that new rank with the first message. The precision gap
itself stays (Accepted residual *Ranks past 2^53*, which covers ranks past ±9007199254740991, not only
above it); the earlier forward note on `model.mjs` stands.

### Decision log (fixes applied without per-fix approval, under the standing approval)

- **R3 → `lock.mjs` back-off while `.break` is held.** Answers R3 (waiters spin with no sleep). Changed:
  `breakStale` returns `true` after an attempt and `false` when `.break` is busy; the loop's
  `isStale(...) && breakStale(...)` then falls through to the existing back-off sleep. Why it qualified:
  verified `CORRECT` (measured 9.99 s CPU), mechanical and local to two lines, inside plan §5 (the waiting
  rule already says to back off), and named cheap by the owner's R1–R3 ruling.
- **R4 → test `a move into a status folder deleted by hand copies the task, then deletes the
  original`.** Answers R4 (key-list item 4 delete path untested). Changed: one test in the approved file.
  Why it qualified: verified `CORRECT` (CONTRIBUTING key list item 4), test-only, inside the one
  pre-approved test file, and named by the driver's spawn instructions.
- **R5 → `check()` big-rank problems + test `check reports a rank too big to store exactly`.** Answers
  R5. Changed: after the whole-number check, a stored rank whose value is not a safe integer is reported;
  so is an id-based rank (no stored rank) that is not. Why it qualified: it is exactly the owner's ruling
  *"Make it loud (Recommended)"*; local to `check()`; `model.mjs` untouched.
- **Obvious-winner call: the id-based branch of the R5 check.** The ruling says "any task whose rank
  cannot be held exactly"; an id-derived rank past 2^53 is such a rank and costs one `else if`. Kept
  inside the ruling's wording; reaches only ids ≥ about 9×10^12.
- **Obvious-winner call: worker-thread lock test** `worker threads in one process take turns on the lock`
  (6 workers × 5 creates; ids unique, `check()` empty, no owner file left). Allowed by the driver's spawn
  ("may also add … if cheap"), inside the one approved test file; it is the cross-thread test ADR-052
  risk 6 asks for in phase 2. Shown able to fail (negative control above).
- **R1, R2: no code change** — no reliable detection exists that cannot break a live holder (owner ruling:
  list the rest). Recorded as limits 13–15 and Accepted residuals.

## 2026-10-21 — fkit-coder (Verify worker, re-verify after review round 1, spawned by fkit-sprint-ship-loop / fkit-lead)

### Re-verify (post-review)

Read-only on source; no commit. Result: **pass**. `plan.md` blob still `ec6aecc4…` (`git hash-object`).

- `node --test test/board/store.test.js`: 34/34, 1.2 s.
- Parallel, worker and killed-holder tests (`--test-name-pattern 'parallel|worker threads|killed process'`):
  12 runs, 12 passed.
- `npm test`: 890/890, 74.2 s wall (load 6.16 at start, 8.01 at end); inside the 120 s budget.
  `0284/term-ignored` (0537) passed (6.4 s). Under npm the slow-test pattern is unchanged (writers 5.3 s,
  start race 12.6 s, killed holder 10.4 s; worker test 0.15 s).
- Negative controls (own fresh scratch copies of `board/` + `test/board/`): `writeLock` returning `fn()` →
  both parallel tests and the worker test fail, 3 of 3 runs (real assertion failures: duplicate ids,
  several start winners); big-rank check removed → only `check reports a rank too big to store exactly`
  fails (33/34).
- R3 probe (own script: dead holder's owner file + fresh `.break`, one waiter in a child process):
  **168–170 ms CPU in 10.07 s**, task created, no lock files left. Same probe on a copy with the old
  `breakStale` (always `true`): **9,980 ms CPU in 9.98 s**.
- Python parity: the saved drivers were still in the scratchpad (`verify418/scripts/`), copied into a
  fresh folder; aiboard `a1592dc` re-extracted with `git archive` (made read-only); `python3 -I` 3.9.6;
  programs regenerated (byte-identical to the earlier set). 1,000 generated programs: 1,000 identical.
  10 hand-written: 9 identical, 1 differs (`folders`, 4 diffs). Against the earlier Verify's Node output
  the only change is the new message
  `T-12345678901234567890: its id-based rank is too big to store exactly (largest is 9007199254740991)`
  (once in a mid-program `check`, once in the final `check`). The other two diffs are the known
  accepted residual *Ranks past 2^53* (file written as `rank: 1.2345678901234568e+22`, then reported
  "not a whole number"). The JSON-detail text gap stays masked by the driver.
- Leftovers: no `board-store-*` or probe temp folders, no `.aiboard.lock*` files in the repo, no child
  processes of these runs. Raw U+2028/U+2029/U+FEFF/U+0085 in `lock.mjs`, `store.mjs`, the test file,
  `review.md` and this worklog: none (byte scan).
- Skipped: `npm run test:prove-red` and `npm run test:release` (no file they cover is touched).

Decision log: none (verify only, no fix applied).

## 2026-10-21 — fkit-coder (Process-review worker, round 2, spawned by fkit-sprint-ship-loop / fkit-lead)

Processed `review.md` R6 (and the reviewer's suggestions X2, X3) under the declared-approval marker
(plan blob `ec6aecc4`, unchanged) and the owner's R5 ruling *"Make it loud (Recommended)"* (2026-10-21,
`AskUserQuestion`, `fkit lead` session). No commit, no push. `model.mjs`, `lock.mjs` and `plan.md` not
edited.

### Change surface

- `board/core/store.mjs` `check()`: the stored-rank message now names both limits; an id-based rank is
  also checked when the stored rank is malformed (it was checked only when no rank was stored).
- `test/board/store.test.js` (the one approved file): the big-rank test now covers ±9007199254740991
  (silent), ±9007199254740993 (reported), no stored rank on a big id (X3) and a malformed rank on a big id
  (R6b); new test `a break file left by a dead breaker is removed, and waiters back off meanwhile` (X2).
  35 tests.
- This worklog (0423 note corrected above; this section); `review.md` *Coder response* R6 row and header
  `Status:`.

### Checks

- Probe before the fix (scratchpad, deleted): `rank: -9007199254740993` printed *"too big … (largest is
  9007199254740991)"*; `rank: abc` on `T-9100000000000` printed only *"not a whole number"*. Both as R6
  says.
- `node --test test/board/store.test.js`: 35/35.
- Parallel, worker, killed-holder and break-file tests (`--test-name-pattern 'parallel|worker|killed|break
  file'`): **12 runs, 12 passed** (load average about 5.2).
- `npm test`: 891/891, 73.1 s wall (load 5.12 at the start, 6.78 at the end); `0284/term-ignored` (0537)
  passed. Inside the 120 s budget.
- Negative controls (scratchpad copies of `board/` + `test/board/`, deleted after): negative ranks not
  reported → the big-rank test fails; id-based check only when no rank is stored → it fails; R3 reverted
  (loop retries at once after a busy `.break`) → the break-file test fails (*"used 1022.925 ms of CPU in
  1001.9 ms: it spun instead of sleeping"*).
- The break-file test takes about 1.1 s (its `.break` is dated 9 s back, so the 10 s grace runs out
  after about 1 s); no child process. It also covers limit 11's delete of `.aiboard.lock.break` (a file
  deleted in a user's project, CONTRIBUTING key list item 4).
- Leftovers: no `board-store-*`/probe temp folders, no `.aiboard.lock*` files in the repo, no child
  processes. Raw U+2028/U+2029/U+FEFF/U+0085 in `store.mjs`, `lock.mjs` and the test file: none (byte
  scan).
- Skipped: Python parity re-run (the R6 change only touches the fkit-only message, recorded in the 0423
  note); `npm run test:prove-red` and `npm run test:release` (no file they cover is touched).

### Decision log (fixes applied without per-fix approval, under the standing approval)

- **R6a → stored-rank message names both limits.** Answers R6 (a): the check fired correctly on
  `rank: -9007199254740993` (that rank does lose precision) but its text said *"too big … largest is
  9007199254740991"*, and the 0423 note said *"only … past 9007199254740991"*. Changed: the message to
  `cannot be stored exactly (it must be between -9007199254740991 and 9007199254740991)` and the 0423
  note to match. Why it qualified: verified `CORRECT` (probe), local to one message, inside the owner's
  *"Make it loud"* ruling (loud and accurate); the check still fires on exactly the same ranks as before.
- **R6b → id-based rank also checked when the stored rank is malformed.** Answers R6 (b): `Task.rank`
  falls back to the id-based rank for a malformed stored rank, but the check looked at the id-based rank
  only when no rank was stored. Changed: the `else if` now runs whenever there is no usable stored rank.
  Why it qualified: verified `CORRECT` (probe), one branch in `check()`, the ruling's own wording (any
  rank that cannot be held exactly). Chosen over "record it only": the fix is smaller than the note.
- **Obvious-winner call: X2 and X3 tests** (the reviewer's suggestions; allowed "if cheap" by the
  driver's spawn): both in the one approved file; each shown able to fail (negative controls above).
- **Obvious-winner call: the near-limit case is recorded, not fixed.** A safe rank within 1000 of the
  limit can yield a derived rank past it; flagging that before it is written would mean checking inside
  the rank arithmetic, outside `check()` and outside the ruling. It is reported on the next `check()`;
  written into the 0423 note.

## 2026-10-21 — fkit-coder (Final re-verify, spawned by fkit-sprint-ship-loop / fkit-lead)

Read-only on source; no commit. Result: **pass**.

- Fence: `lock.mjs`, `model.mjs`, `python-compat.mjs` byte-identical to the predecessor re-verify's
  scratchpad copies (`reverify418/neg-norank`, `neg-nolock`; `r2/lock.orig`). `store.mjs` vs the
  pre-round-2 copy (`r2/store.orig`): only the `check()` rank block differs. `plan.md` blob still
  `ec6aecc4…`.
- `node --test test/board/store.test.js`: 35/35. Parallel/worker/killed/break-file tests: 12 runs,
  12 passed (load 3.4 → 6.2).
- `npm test`: 891/891, 78 s wall (load 5.8 → 6.7), inside the 120 s budget; `0284/term-ignored` passed
  (6.3 s).
- Python parity (scripts copied to a fresh `finalverify418/`; aiboard `a1592dc` re-extracted with
  `git archive`, read-only, identical to the earlier extract; programs regenerated byte-identical;
  `python3 -I` 3.9.6): 1,000 generated programs identical. 10 hand-written: 9 identical, `folders`
  differs (5 diffs): the id-based-rank message for `T-12345678901234567890` (twice), the known
  accepted residual *Ranks past 2^53* (file `rank: 1.2345678901234568e+22`, then "not a whole number"),
  and one new line vs the predecessor run — `T-12345678901234567891: its id-based rank is too big to
  store exactly …`, which is R6b (id check now also runs on a malformed stored rank). Every other
  output file identical to the predecessor run's.
- Leftovers: no `board-store-*`/`b418-par-*` temp folders, no `.aiboard.lock*` in the repo, no child
  processes (the two `bin/fkit-board.mjs` servers on ports 9001/9002 predate this run). No raw
  U+2028/U+2029/U+FEFF/U+0085 in `store.mjs`, `lock.mjs`, `model.mjs`, the test file, `review.md`,
  this worklog.
- Skipped: `npm run test:prove-red`, `npm run test:release` (no file they cover is touched).

Decision log: none (verify only, no fix applied).
