# Plan: 0418, port aiboard's task store to Node with cross-process locking

- **Planning only. No files written**, plan.md included. I was spawned without `EnterPlanMode`, so planning-only was a rule I kept myself, not something the runtime blocked. The aiboard repo was only read, with `git show a1592dc:…`. The scratchpad holds no files from this run.
- **Plan review not run.** The spawn prompt had no `Plan review: on` switch line.
- **Main finding: the brief's task/sprint split does not match the code.** `store.py` is one `Board` class. Task methods call sprint methods: `create_task(sprint=)` calls `get_sprint` and `_sprint_set_tasks`, `move_task` calls `refresh_sprint`, `check` calls `list_sprints`. Four of 0418's own named tests also create sprints: both cross-process tests' sibling `test_parallel_writers_get_unique_ids`, plus `test_snapshot_shape`, `test_check_detects_inconsistency` and `test_rank_survives_status_changes_and_orders_every_view`. This plan is written for open question 1, option (A): port the sprint code these need, and leave `move_sprint`, `sprint_add`, `sprint_remove` and 0419's three tests to 0419.
- **The one test file: `test/board/store.test.js`.** No second file. It holds 31 tests: 29 ported `BoardTests` (the two carried over from 0417 included) and 2 fkit additions.
- **Slow tests, named before build (ADR-057 D10):**
  - `test_parallel_writers_get_unique_ids`: 40 real `node` processes, two waves of 20.
  - `test_parallel_start_has_exactly_one_winner`: 12 processes.
  - fkit's stale-lock test: 1 process.
  - Cost check, measured today: 20 parallel `node` starts that import `board/core/model.mjs` took 0.11 s wall on this Mac (load average 3.4).
  - Expected: under about 2 s each; the whole file about 2 to 5 s. `npm test` is 75 to 87 s today, so this stays inside 120 s.
  - Risk: spawning 20 processes while `node --test` runs the other files may worsen the load-sensitive test `0537`.
- **Locking mechanism:** an `O_EXCL` owner file, `.aiboard.lock.owner`. Node has no `flock`, and the zero-dependency rule (ADR-014) rules out an addon.
  - A lock left by a dead holder is broken safely, through a second `O_EXCL` file.
  - Python's empty `.aiboard.lock` is still created, so the board folder looks the same on disk.
  - The limits are listed in §5 and go into the worklog (verification step 4).
- **Date-bound test** (`test_comments_and_stale_detection`, red at `a1592dc` because it hard-codes `2026-09-`): ported with one line changed. It moves every timestamp back 31 days instead of replacing the literal `2026-09-`. No clock mocking: CONTRIBUTING says board tests go through the exported API, with no mocking of internals.
- **Read/write like Python** (forward note from 0417):
  - Python's `read_text` turns both `\r\n` **and a lone `\r`** into `\n` (checked with Python 3.9.6 today).
  - It keeps a BOM, so Node must not strip one. Node's `TextDecoder` strips it by default, so it is created with `ignoreBOM: true`.
  - It raises `UnicodeDecodeError`, a `ValueError`, on bad UTF-8. The store's `except ValueError` paths depend on that.
- `package.json`: no change. The existing `test/board/*.test.js` glob already picks up the new file. No dependency added.

## 1. Files

| Path | New/changed | What |
|---|---|---|
| `board/core/store.mjs` | new | Port of `aiboard/store.py` @ `a1592dc`, in the same order and branch order: `BoardError`, `NotFound`, `ID_DIR`, `LOCK_FILE`, `CONFIG_FILE`, `findBoardRoot`, `Board` (all task methods, init, discovery, rank, check, snapshot, and the sprint subset in §2), `_findCycles`, `_rankKey`, `_priority`, `_titleFromBody` |
| `board/core/lock.mjs` | new | The cross-process lock (§5). Kept separate because it is new fkit code, not ported code, and 0422's server will use it |
| `board/core/python-compat.mjs` | changed (0417's file; additions only) | `pyReadText`, `pyWriteText`, `pyResolve`, `pyJsonLoads`, `pyJsonDumps`, `pyFloat`, `pyFormatG`, `pyRound`, `pyFloorDiv`, `pySubTemplate`, `UnicodeDecodeError`/`UnicodeEncodeError` (both extend `ValueError`), and export the existing `cmpCodePoints` as `pyCompare` for `sorted()`. No existing function changes |
| `test/board/store.test.js` | new: **the one pre-approved file** | §4 |
| `ai-agents/tasks/backlog/0418-…/worklog.md` | new | Red and green runs, repeat-run counts, stress and negative control, Python parity result, **locking limits**, decision log |

Untouched: `board/core/model.mjs`, `package.json`, `claude/`, `install.sh`, every `.claude/` copy, the wiki. Nothing ships. CHANGELOG: no entry, because nothing reaches users. Wiki check: the vault has no page on the store or on locking.

**API shape:**
- Methods are camelCase (`createTask`, `updateTask`, `rankTask`, `moveTask`, `listTasks`, `getTask`, `block`, `unblock`, `start`, `assign`, `log`, `comment`, `check`, `snapshot`, `writeLock`, `init`, `writePointer`, `Board.locate`).
- Required arguments are positional. Optional ones go in one options object, keyed by **Python's own keyword names** (`blocked_by`, `needs_reply`, `force`, `author`, `note`, `top`/`bottom`/`before`/`after`, `fix`).
  - Why: `update_task(**fields)` writes its keys straight into the front matter, so those keys must be Python's snake_case anyway. One rule for every method avoids a translation table, and 0421/0422 map straight from aiboard's CLI and server source.
- `updateTask` takes a Map or a plain object and keeps key order: new keys land in the file in the order given.
- `config` returns a Map, like front matter.
- The store builds plain objects for the dicts it creates itself (`blockers` entries, `sprintProgress`, `snapshot`), as 0417's forward note asks.
- Everything is **synchronous**, as in Python. Inside one process, a store call always runs to the end before the next one starts.

## 2. Scope under option (A)

- **Ported (task half):** `__init__`/`root` (via `pyResolve`), `locate`, `config`, `name`, `writeLock`, `tasksDir`/`sprintsDir`, `exists`, `init`, `writePointer`, `_require`, `_scan`, `_locate`, `_nextNumber`, `_loadTask`, `staleAfterHours`, `_isStale`, `_statusIndex`, `_resolveBlockers`, `listTasks`, `getTask`, `createTask`, `updateTask`, `_rankEntries`, `_writeRank`, `rankTask`, `moveTask`, `_normalizeBlockers`, `block`, `unblock`, `start`, `assign`, `log`, `comment`, `_appendWorklog`, `_touch`, `check` (whole), `snapshot`, `findBoardRoot`. Discovery and `init` are ported faithfully; dropping them is `0432`'s job.
- **Ported (sprint code that the task half or 0418's tests need):** `_loadSprint`, `listSprints`, `getSprint`, `createSprint`, `_sprintSetTasks`, `_writeSprint`, `_renderSprintTaskList`, `refreshSprint`, `sprintProgress`.
- **Left for 0419:** `moveSprint`, `sprintAdd`, `sprintRemove`, and `test_sprint_membership_stays_in_sync`, `test_move_sprint`, `test_check_detects_and_fixes_stale_sprint_list`.
- **Not done here:** T-021's index-once is `0420`. `_statusIndex` is ported as aiboard has it: O(n) per call, so O(n²) in places.

## 3. Python behaviour the store must copy (beyond 0417's list)

Each item below is checked against Python in §6.

- **Reading:** `pyReadText` uses `TextDecoder('utf-8', {fatal: true, ignoreBOM: true})`, then turns `\r\n` and lone `\r` into `\n`. Bad UTF-8 throws `UnicodeDecodeError extends ValueError`. That matters for two paths:
  - `findBoardRoot` (`except ValueError` → `{}`);
  - `config` (`except ValueError` → `BoardError "… is not valid JSON"`).
- **Writing:** `pyWriteText` does a plain truncate-and-write, as Python does: no temp file and rename, default mode `0o666` minus umask. A lone surrogate throws `UnicodeEncodeError`, which is what Python raises. Node would otherwise write U+FFFD silently.
- **Paths:**
  - `pyResolve` copies Python 3.9's non-strict `Path.resolve()`: walk the parts, expand symlinks with `readlinkSync`, keep going lexically past missing parts, and pop `..` lexically. macOS's `/var` → `/private/var` comes out right.
  - Joins never use `path.join`/`path.resolve`, because they collapse `..` before symlinks are seen. Python's `/` does not.
  - `relative_to` is lexical.
- **Sorting:** `sorted(iterdir())` becomes `readdirSync` sorted by code point (`pyCompare`). JS's default sort compares UTF-16 units. `is_dir()` is `statSync` with errors read as false, so an entry that vanishes mid-scan is skipped, as in Python.
- **`ID_DIR`** becomes `^([A-Z])-(\p{Nd}+)(?:-([^\n]*))?\n?$` with the `u` flag only. Python's `\d` is Unicode and its `$` also matches before a final `\n`. Numbers go through `BigInt` in `_nextNumber`, so ids beyond 2^53 stay exact.
- **Multiline regexes** (`_titleFromBody`, `updateTask`'s `^# .*$`, the sprint `## Tasks` pattern): the JS `m` flag is not used, because its `^`/`$` also break at `\r`, `U+2028` and `U+2029`. Line starts become `(?<![^\n])`, line ends `(?![^\n])`, and `.` becomes `[^\n]`. Python `\s` is 0417's `PY_WS_CLASS`, which includes `\n`, as `#\s+` needs. `\Z` becomes end of input.
- **`re.sub` replacement text** (`updateTask` title): Python processes escapes in it. `pySubTemplate` copies that:
  - `\\`, `\n`, `\t`, `\r` and the other escapes are expanded, and `\g<0>` is the match;
  - a group reference throws, because the pattern has no groups;
  - an unknown ASCII-letter escape throws `re.error`. Example: a title `C:\path` throws `bad escape \p`, checked in Python today. That is an inherited aiboard crash, kept, and noted for phase 3.
  - JS `$&` patterns are avoided by using a function replacer.
- **Numbers:**
  - `pyRound` rounds half to even (`int(round(100*1/8))` is 12; `Math.round` gives 13), in `sprintProgress` percent.
  - `pyFloorDiv` for `(prev.rank + nxt.rank) // 2`: ranks go negative after critical tasks, and `(-1999)//2` is -1000, not -999.
  - `pyFormatG` for `{stale_after_hours:g}` (`24`, `0.5`, `1.23457e+06`).
  - `pyFloat` for `float(config value)`: Unicode digits, `_`, whitespace, `inf`/`nan`, `True` → 1.0, `TypeError` for list or None, as Python does.
  - `timedelta`'s range limit: Python raises `OverflowError` on `inf` or huge hours and `ValueError` on `nan`. The port throws the same.
- **JSON:**
  - `pyJsonDumps` copies `json.dumps(…, indent=2)` with `ensure_ascii`: every character outside space to `~` is escaped as lowercase `\uXXXX`, U+007F included (checked: `"U+00E9 U+007F" (written as escapes)`). `JSON.stringify` writes these raw.
  - `pyJsonLoads` is `JSON.parse` with objects turned into Maps. That way `str(dict)` works, as 0417 review R2 asks.
  - Accepted gaps, logged in the worklog: Python accepts `NaN`/`Infinity`; integer-like keys in a config object get reordered; the *"not valid JSON: <detail>"* detail text differs. Only `aiboard.json` is affected, which phase 3 drops.
- **Text building:** every f-string piece that can be None, bool or a number goes through `pyStr` (e.g. `says sprint=None`), and every `!r` through `pyRepr`. Truthiness tests (`sprint if sprint`, `blocked_by or []`, `before or after`, `env AIBOARD_ROOT`) use `pyTruthy`.
- **Moving a task:** `shutil.move` becomes `renameSync`. Accepted gap: across filesystems (`EXDEV`) Python copies and Node throws. `tasks/` is one folder tree, so this is not reachable in practice.
- **Recursion:** `_findCycles` recursion depth. Python hits `RecursionError` at about 1000 levels; JS goes much deeper. Accepted; only a dependency chain of about 1000 tasks would show it.

## 4. `test/board/store.test.js`

Setup and teardown:
- `beforeEach`: `mkdtempSync` → `realpathSync` → `new Board(tmp).init()`.
- `afterEach`: `rmSync` with `recursive`.

`describe('BoardTests')`, with Python names verbatim so 0423 can match them, in Python's order:
1. `test_requires_init`
2. `test_critical_priority_and_urgent_alias` (carried from 0417)
3. `test_hand_edited_urgent_reads_as_critical` (carried from 0417)
4. `test_new_tasks_join_the_bottom_and_critical_ones_the_top`
5. `test_rank_top_bottom_before_after`
6. `test_a_move_rewrites_only_the_moved_task`
7. `test_rank_respaces_when_a_gap_runs_out`
8. `test_rank_validation`
9. `test_rank_survives_status_changes_and_orders_every_view`
10. `test_raising_to_critical_moves_to_the_top_once`
11. `test_ranking_does_not_touch_updated`
12. `test_boards_without_ranks_keep_id_order`
13. `test_check_reports_a_malformed_rank`
14. `test_create_and_move_task`
15. `test_log_appends`
16. `test_check_detects_inconsistency`
17. `test_quoted_title_survives_store`
18. `test_hand_made_task_is_readable`
19. `test_assign_logs`
20. `test_parallel_writers_get_unique_ids` (**slow**)
21. `test_init_writes_config_and_discovery_walks_up`
22. `test_pointer_file_discovery`
23. `test_dependencies`
24. `test_start_is_an_atomic_claim`
25. `test_assign_refuses_to_steal_without_force`
26. `test_parallel_start_has_exactly_one_winner` (**slow**)
27. `test_comments_and_stale_detection`
28. `test_not_found`
29. `test_snapshot_shape`

That is the brief's 16 named tests plus the 2 carried over, plus 11 more task-store tests the brief's "indicative" list left out: 3 from the `rank_*` group and 8 others. Every `BoardTests` test except 0419's three lands here.

How the tests are ported:
- **The parallel tests (20, 26):**
  - Python spawns its CLI; the CLI is 0421. Here each child is `process.execPath --input-type=module -e <inline script>`. The script imports `board/core/store.mjs` by file URL, runs one call (`createTask(title, {sprint: 'S-001'})`, `moveTask(id, 'done')`, or `start('T-001', 'agent-i', {author: 'agent-i'})`), and exits 1 with the message on stderr on an error. Inline, so no second file is needed.
  - The children are started with async `spawn` all at once, then awaited: real concurrent processes.
  - `NODE_TEST_CONTEXT` is removed from the children's environment.
  - Each parallel test has `{timeout: 60_000}`, so a lock hang fails the test instead of stalling the suite.
  - One assertion added to test 26 beyond Python: each of the 11 losers exits 1 with a `BoardError` text (`not in backlog` / `already assigned`). Otherwise "all crashed but one" would pass.
  - 0421 may move these to the real CLI later.
- **Test 27:** the Python line `.replace("2026-09-", "2026-08-")` becomes "move every `YYYY-MM-DDTHH:MM:SSZ` stamp in the three files back 31 days". Everything else is byte-faithful. With `stale_after_hours: 100000`, it still reads as not stale. This deviation is logged in the worklog.
- **Exceptions:** `assertRaises` becomes `assert.throws(…, BoardError | NotFound)`. `str(cm.exception)` becomes `err.message`.
- **Field names:** `t.meta["x"]` becomes `.get('x')`, and Python properties become 0417's getters (`needsReply`, `lastCommentBy`, `toDict(true)`). `chdir` and `AIBOARD_ROOT` are restored in `finally`.

`describe('fkit additions')`:

30. **`reads and writes files the way Python does (port guard)`.** Every expected value comes from the Python reference run (§6). It covers:
    - a hand-written CRLF brief with a lone `\r`: read correctly, and LF bytes after `log` rewrites it;
    - a BOM-led brief, read as Python reads it;
    - bad UTF-8 throws;
    - percent 12 for 1 of 8 done (banker's rounding);
    - floor division on negative ranks;
    - a title with `\n` and `\\` escapes in `updateTask`, and the `bad escape` throw;
    - `init` writing `ensure_ascii` JSON for a non-ASCII name.
31. **`a lock left by a killed process is broken`** (Node-only; Python's `flock` cannot leave a stale lock). Steps:
    - a child takes `writeLock`, prints `held` and sleeps;
    - the parent sends `SIGKILL`, so no exit handler runs;
    - then `createTask` must succeed, and `.aiboard.lock.owner` must be gone afterwards.

    It deletes a file in a user's project: CONTRIBUTING key-list item 4.

## 5. The lock (`board/core/lock.mjs`, used by `Board.writeLock`)

Acquire, at depth 0 only (Python's per-Board re-entrant depth counter is kept):
1. Run `_require()` first, as Python does.
2. `openSync(root/.aiboard.lock, O_RDWR|O_CREAT, 0o644)`, closed again on release. This is Python's file and footprint, unchanged.
3. Loop:
   - `openSync(root/.aiboard.lock.owner, 'wx', 0o644)`, then write one JSON line: `{pid, threadId, host, token, acquired}`. `token` is random per acquisition.
   - On `EEXIST`, read the owner record and decide whether it is stale:
     - **unparseable or empty** (the holder is between create and write): stale only if the file's mtime is more than 10 s old;
     - **another host:** never stale; wait;
     - **same host, other pid:** `process.kill(pid, 0)`. `ESRCH` means stale. Success or `EPERM` means alive; wait;
     - **same pid, other `threadId`** (worker threads): alive; wait;
     - **same pid and thread, token held by this thread:** a second `Board` on the same root is nested inside the first. Throw `BoardError`. Python would deadlock here.
     - **same pid and thread, token not held:** left over from an earlier process that had this pid. Stale.
   - **Breaking a stale lock:**
     - take `.aiboard.lock.break` with `'wx'`;
     - re-read the owner record and break only if it is byte-identical **and** has the same inode;
     - `unlinkSync` the owner file, then unlink `.break`.

     Only a `.break` holder ever removes someone else's lock, so two waiters cannot both break and win. A `.break` file older than 10 s is removed, which covers a breaker that crashed.
   - **Waiting:** a synchronous sleep with `Atomics.wait`, backing off from 2 ms to 50 ms with jitter. **No timeout**, the same as `flock(LOCK_EX)`. Timing uses `performance.now()`, never `Date`.
4. Release: unlink the owner file only if it still holds this token. A `process.on('exit')` handler releases held locks on a normal exit or an uncaught exception.

**What it does NOT guarantee** (this list goes into the worklog):
1. Readers take no lock, as in Python. A reader can see a half-written brief or a task folder mid-move, and may throw.
2. Writes are not atomic. A crash mid-write leaves a partial file, as in Python. A multi-file operation (brief + worklog + sprint) is atomic only with respect to other writers, not to a crash.
3. No mutual exclusion with Python aiboard writing the same board at the same time (different mechanisms).
4. Network or sync filesystems (NFS variants, SMB, Dropbox, some FUSE) may not make `O_EXCL` atomic.
5. Automatic stale breaking works only for a holder on the same host and in the same PID namespace. A reused pid, another host, or another container sharing a volume under the same hostname can make a dead holder look alive, and the writer then waits forever.
6. A hung live holder blocks every writer forever (as `flock` does). There is no fairness or ordering among waiters.
7. After a `SIGKILL`/`SIGINT` or a power loss, `.aiboard.lock.owner` stays on disk until the next writer breaks it. Python's kernel lock vanishes.
8. Within one process, ordering holds only because the store is synchronous. 0422 must keep store calls synchronous or queue them itself.

## 6. Sequence and checks

1. Baseline `git status --porcelain` into the scratchpad. The tree is already dirty with other work, so the fence check is the difference from this baseline.
2. Write `test/board/store.test.js`.
3. Write a stub `store.mjs` and `lock.mjs` that export every name, with each method throwing `not implemented`. Red run `node --test test/board/store.test.js`: all 31 ✖, each listed in the worklog. Most fail in `beforeEach`'s `init`; that is still a red per test, as in 0417.
4. Write the `python-compat.mjs` additions, `lock.mjs` and `store.mjs`.
5. Green: 31/31.
6. **Repeat runs:** the two parallel tests, `--test-name-pattern parallel`, **25 runs** in a loop. Plus one run with `npm test` going at the same time, for load.
7. **Scratchpad only, not kept:**
   - stress: 50 creators × 10 rounds and 30 starters × 10 rounds;
   - kill test: `SIGKILL` holders at random;
   - **negative control:** a scratchpad copy of `board/` with `writeLock` turned into a no-op must make the parallel tests fail (duplicate ids, more than one winner). If it does not, the tests cannot see a missing lock, and I report that.
8. **Python parity, one-off** (as in 0417; scratchpad only):
   - extract with `git archive a1592dc` into a new, empty folder; run `python3 -I` 3.9.6 on scripts kept in a separate folder;
   - drive the same generated sequences of operations through both stores: hostile titles (emoji, quotes, `\`, `:`, CRLF bodies), create, move, rank, block/unblock, start, assign, log, comment, title and priority edits, and hand-edits (CRLF, CR, BOM, removed or malformed or negative rank);
   - compare every file's bytes, each result's `to_dict(include_body=True)`, error class and message, `check()` output and `snapshot`;
   - timestamps and the root path are replaced with placeholders before comparing;
   - target: 0 differences beyond the §3 accepted gaps.
9. `time npm test`, with the load average recorded. Then `git diff package.json` (expected: no diff), the fence check against the baseline, and a scan of the changed files for raw U+2028/U+2029/U+FEFF/U+0085. Escapes only, as 0417 did.
10. Worklog: red, green, repeat count, stress and control results, parity counts, timings, the §5 limits, and a decision log.

Checks I will skip, and why:
- `npm run test:prove-red`: no file it mutates or runs is touched (CONTRIBUTING, row 3).
- `npm run test:release`: `bin/release.mjs` is untouched.
- A separate `node --test test/*.test.js`: `npm test` covers it (the brief's own correction note).

## 7. Failure modes to watch

- **`pyResolve` on macOS tmp:** if the Python `/var` symlink handling is copied wrong, every root comparison fails at once. Easy to see.
- **`test_init_writes_config_and_discovery_walks_up`:** it assumes no `aiboard.json`, or no `tasks/` plus `sprints/`, in any parent of the tmp folder. That holds on macOS `/var/folders`, and holds in Python too.
- **Child spawn on a loaded CI machine:** the 60 s timeout leaves a large margin.
- **Two `Board` instances on one root in the same process:** this now throws instead of deadlocking. No ported test does it. 0422 must use one `Board` per root.

open questions:

1. **Where the task/sprint line falls** (this changes what 0418 builds). `store.py` is one class. The task code calls sprint code, and four of 0418's named tests (one of the two parallel tests among them) create sprints. So a pure "task half" either cannot run those tests, or it needs most of the sprint code anyway.
   - **(A) Rec:** port the task half plus the sprint code it calls or its tests use (create, get and list sprints, the sprint-file writer and `## Tasks` renderer, refresh, progress, all of `check`). Leave `move_sprint`, `sprint_add`, `sprint_remove` and 0419's 3 tests to 0419. Cost: 0419 gets smaller, and its `test_check_detects_and_fixes_stale_sprint_list` will already pass when ported, so 0419 cannot see that one red first; its plan should say so. **Knock-on: none (checked):** no `Depends on:` line changes; 0419 still waits on 0418, and 0421/0422 on 0419, all in Sprint 14.
   - **(B):** port all of `store.py` and all 32 `BoardTests` here; 0419 has nothing left, and the producer/owner cancels or re-scopes it. **Knock-on:** 0421's and 0422's `Depends on: 0419` would need re-pointing to 0418 (both stay in Sprint 14; they would then wait only on 0418), or 0419 stays open as an empty step.
   - **(C):** strictly task code only. The 4 sprint-using tests (including `test_parallel_writers_get_unique_ids`) move to 0419. Then the brief's verification step 2 (both parallel tests here) is not met, and `createTask(sprint=…)` is written untested. **Knock-on: none (checked).** Not recommended.
   - Plain-language context: aiboard keeps tasks and sprints in one piece of code that calls itself back and forth. The brief cut it into two tasks along a line the code does not have. (A) moves the line to where the code really splits, and keeps both tasks.
2. **Test 27's one-line change** (not blocking; it goes into the plan as written unless the owner objects). The Python test is red today because it hard-codes September 2026. The plan moves the timestamps back 31 days instead of mocking the clock. Alternative: a frozen clock with `node:test`'s `mock.timers`, which keeps the test body byte-identical but mocks a global, which CONTRIBUTING's "no mocking" wording argues against. **Rec:** the 31-day shift. **Knock-on: none (checked).**
