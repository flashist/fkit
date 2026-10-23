# Worklog — 0420

## 2026-10-22 — fkit-coder (Build worker, spawned by fkit-sprint-ship-loop / fkit-lead)

Built the approved `plan.md` (blob `39274005921b32bd1d8efabbb77efd18ff8d5d04`, 16307 bytes, checked with
`git hash-object` / `wc -c` at the start) under the declared-approval marker. Owner approval relayed:
`AskUserQuestion`, 2026-10-22, `fkit-lead` session, selected *"Approve, snapshot only (Recommended)"*. That
settles Q1 = snapshot only (`check()` untouched) and Q2 = opt-in benchmark inside the one approved test file.
No commit, no push. `plan.md` not edited.

### Change surface

- `board/core/store.mjs` (untracked, like all of `board/`), +33 / −10 lines:
  - header comment: `snapshot()` reads each task once (aiboard T-021, ADR-052 D9);
  - `listTasks(filters)` is now a thin wrapper over `_listTasks(filters, byId)` (today's body, plus one line
    filling `byId` first-wins in scan order);
  - `sprintProgress(sprint, index = null)`: no index → today's loop (same statements, re-indented one level
    under `if (index === null)`); with an index → `normalizeId(TASK_PREFIX, tid)`, skip null or absent ids,
    else `index.get(id)`. Counts, sort, total, percent, remaining unchanged;
  - `snapshot()` builds one `byId` map and passes it to every `sprintProgress`. One WHY comment.
- `test/board/snapshot-index.test.js` (new): **the one A3-pre-approved test file**. 3 tests: A (T-021
  reproduction), B (behaviour lock), C (benchmark, skipped unless `FKIT_BOARD_BENCH=1`).
- `ai-agents/tasks/backlog/0420-…/worklog.md` (this file).
- Untouched: `model.mjs`, `python-compat.mjs`, `lock.mjs` (byte-identical to the pre-build copy), other
  `test/board/*` files, `package.json`, `.claude/`, the wiki, docs. `check()`, `getTask`, `_statusIndex` and
  every write path unchanged.

### T-021's reproduction, as ported

T-021 was filed in aiboard but never fixed (still in `tasks/backlog/` at `a1592dc` and at HEAD `784e0ca`), so
there was no aiboard test to port; test A ports its brief's method. T-021 counted `_scan` with cProfile
(28,543, which counts generator resumptions); test A counts **calls** to `_scan` and `_loadTask`, via
counting wrappers set on the board instance (the store is not patched). No clock is read in the default lane.

### Red run (test written, store not yet changed)

`node --test test/board/snapshot-index.test.js`: tests 3, pass 1, fail 1, skipped 1.

```
✖ snapshot scans the tree a fixed number of times ... (aiboard T-021)
  AssertionError: scans per snapshot must not grow with the number of sprint members
  19 !== 7
✔ snapshot sprint progress is unchanged by the index: ...
﹣ benchmark: ... # SKIP
```

Pre-fix counts (same boards, scratch probe): N=3 → 7 scans, 6 loads; N=12 → 19 scans, 24 loads
(= 3 + members + blocked members scans; 2N loads). B passed before the change, as planned (it is the lock).

### Green run

- `node --test test/board/snapshot-index.test.js`: tests 3, pass 2, fail 0, skipped 1, ~93 ms.
  After: 3 scans and N loads for both N.
- `node --test test/board/*.test.js`: tests 56, pass 55, fail 0, skipped 1.
- `npm test`, exit 0: tests 901, pass 900, fail 0, skipped 1 (test C), **73.9 s** wall (budget 120 s,
  ADR-057 D10). This file inside `npm test`: test A 115 ms, test B 36 ms, C skipped — well under the 2 s stop
  line. `0284/term-ignored` passed. `npm test` now shows "skipped 1" (was 0) — the opt-in benchmark, Q2.
- The `MODULE_TYPELESS_PACKAGE_JSON` warning when running the file directly is pre-existing (same for
  `sprints.test.js`).

### Negative controls (scratch copies of `board/core/` + the test file, deleted after)

| Mutation (copy only) | Result |
|---|---|
| (a) `snapshot` calls `sprintProgress(s)` with no index | A fails (`19 !== 7`); B passes |
| (b) index built last-wins (no `has` guard) | B fails (duplicate T-003: the done copy wins) |
| (c) `index.get(tid)` with no `normalizeId` | B fails (`'1'`, `'t-2'`, `'T-0004'` dropped) |
| (d) `normalizeId` wrapped in a catch-all | B fails (`Missing expected exception` on the int entry) |

### Benchmark (`FKIT_BOARD_BENCH=1 node --test test/board/snapshot-index.test.js`, 16.8 s)

Synthetic boards written straight to disk: brief ~9.2 KB, worklog ~16.9 KB (T-021's medians), every task in a
sprint of 30, statuses round-robin, no blockers (T-021's set-up). Old = `listTasks` + `listSprints` +
`sprintProgress(s)` with no index (the pre-fix algorithm, still in the store). Median of 5 after 1 warm-up.
Both paths gave equal output on every board. Machine: Apple M4 Pro ×14, load average 4.94 at start (other
sessions running), 4.59 at end.

| n | old ms | new ms | ratio | scans old / new | loads old / new |
|---|---|---|---|---|---|
| 100 | 39.9 | 13.2 | 3.0× | 103 / 3 | 200 / 100 |
| 405 | 295.6 | 54.9 | 5.4× | 408 / 3 | 810 / 405 |
| **540** (≥ fkit's 537) | **466.5** | **75.9** | **6.1×** | 543 / 3 | 1080 / 540 |
| 800 | 923.7 | 115.7 | 8.0× | 803 / 3 | 1600 / 800 |

The counts are machine-independent: old scans = n + 3, new = 3; old loads = 2n, new = n. The ratio grows with
n (quadratic vs linear). For reference only, Python `a1592dc`'s own `snapshot()` on the same 540 / 800 boards:
median 904.5 / 1884.4 ms.

### Proof the output is unchanged (scratchpad only, not kept)

b419's drivers copied (not edited in place) into `b420/scripts/`, plus `gen_fixed420.mjs` (11 hand programs:
duplicate ids across statuses ×2, odd / missing / duplicate / padded refs, a string `tasks:` value, an int
`tasks:` value, int entries, blocked members incl. a missing blocker, empty sprints, a deleted `tasks/done`,
8 sprints × 20 tasks, bad briefs in members) and a three-way `compare420.mjs`. aiboard `a1592dc` re-extracted
with `git archive` into an empty folder, made read-only (identical to b419's extract); `python3 -I` 3.9.6 run
from the scripts folder. Regenerated 0419 programs are byte-identical to b419's.

- **Node before vs Node after** (pre-build copy of `board/core/` vs the live one; results, error class and
  message, every file's bytes, final `check()` and `snapshot()`): **1,429 / 1,429 byte-identical** (1,000
  `gen.mjs` seeds 1–1000, 400 `gen419`, 18 fixed-0419, 11 fixed-0420).
- **Python `a1592dc` vs Node after:** `gen.mjs` 1,000 / 1,000 identical; fixed-0420 10 / 11; `gen419` 351 / 400;
  fixed-0419 16 / 18. **Every difference is 0419's known trigger 1** (an int entry hand-typed in `tasks:`:
  `AttributeError: 'int' object has no attribute 'strip'` vs `TypeError: s.slice is not a function`) — 283
  diffs across 51 programs on the 0419 sets, exactly 0419's count, plus the one fixed-0420 `int-entries` case.
  No other difference.
- **Corpus-sized:** `snapshot()` on the 540 and 800 synthetic boards, Python vs Node after (minus `generated`):
  JSON equal, 540 / 800 tasks, all in sprint totals.

### Decision log (calls made without asking)

1. **Test B's sprint list also holds `T-003` and `T-005`** (the plan listed `'1'`, `'t-2'`, `'T-0004'`,
   `'T-999'`, `'bogus'`, `'T-001'`), so the duplicate-id copy and the blocked member are sprint members and
   reach the index. Answers plan §3 B's own bullet list (duplicate + blocked member must be tested); what
   changed: two more entries in the hand-written `tasks:`; why it qualified: mechanical, inside the plan's
   intent.
2. **Test B uses three sprints** (odd refs; a plain one holding done / in-progress / cancelled, so `percent`
   is non-zero; an empty one). The int-entry case rewrites the plain sprint. Mechanical, in-plan.
3. **Test A asserts scans equal across N, not a fixed 3**, as the plan wrote, so it does not pin internals
   beyond T-021's claim. Loads asserted exactly N.
4. **Fixed-0420 parity case `odd-refs` first wrote `- 1` unquoted**, which parses as an int (trigger 1) and
   hid the rest of the case; re-written as `- "1"`. Scratchpad only.
5. **`sprintProgress`'s no-index loop is re-indented** under `if (index === null)`; statements unchanged. Plan
   said "byte-for-byte the same" — the bytes differ by indentation only; the before/after parity above is the
   evidence of unchanged behaviour.

### Checks

- Run: the file alone (red, then green); `node --test test/board/*.test.js`; `npm test`; the opt-in
  benchmark; parity (above).
- Skipped: `npm run test:prove-red` (touches none of its files); `npm run test:release` (`bin/release.mjs`
  untouched); a separate `node --test test/*.test.js` (`npm test` covers it; brief *Verification* 3 is
  superseded by the 2026-10-20 correction note).

### Fence

- Only `board/core/store.mjs`, `test/board/snapshot-index.test.js` and this worklog changed. `git status
  --porcelain --untracked-files=all` vs the pre-build baseline: one new line, the test file (`board/` was
  already untracked; this worklog is added after that check).
- No raw U+2028, U+2029, U+FEFF or U+0085 in either source file (checked).
- No temp folders, lock files or child processes left (checked `os.tmpdir()` for the test, driver and probe
  prefixes, and `pgrep`). Scratch corpus boards deleted.

### Limits

- Under a concurrent writer the snapshot is now built from one read pass instead of two: more consistent, and
  visible only in a race. Reads take no lock, in Python or in the port.
- `stale` is computed once per task instead of twice; `snapshot` drops `progress.tasks`, so this is not
  visible there.
- `sprintProgress(s, index)` returns the same Task objects that are in the index.
- `check()` and `_renderSprintTaskList` still call `getTask` per member (Q1 ruling: snapshot only).

### Forward notes

- **0421:** the CLI `sprint list` (and aiboard's MCP equivalent) calls `sprint_progress` per sprint — pass one
  index; `_listTasks({}, byId)` is the builder. `aiboard check` on fkit's corpus keeps the per-member path.
- **0422:** serve `snapshot()` as is.
- **0423:** 0420 adds no output difference against Python (1,000 + 400 + 29 programs and two corpus-sized
  boards above), apart from the race-only case under Limits. The benchmark reruns with `FKIT_BOARD_BENCH=1`.

## Verify (2026-10-22, independent; read-only on source)

**Result: pass.**

- **Diff vs the pre-build copy** (`b420/before/store.mjs`, itself identical to 0419 Verify's clean copy): only
  plan §2's four changes (header line; `listTasks` → `_listTasks` + first-wins `byId`; `sprintProgress(sprint,
  index = null)` with `normalizeId` on the index path; `snapshot()` builds one index). `lock`, `model`,
  `python-compat` byte-identical.
- **Tests:** the new file alone 4 runs, each 2 pass / 1 skipped / 0 fail (~94 ms); `node --test
  test/board/*.test.js` 56 tests, 55 pass, 1 skipped; `npm test` 901 tests, 900 pass, 1 skipped (the
  benchmark), 0 fail, 73 s wall (budget 2 min), the new file's A + B ≈ 154 ms in the suite. `0284/term-ignored`
  passed.
- **Negative controls** (fresh copies in `scratchpad/verify420/`): no index in `snapshot` → A fails (scans 19
  vs 7); last-wins index → B fails (S-001 backlog 3 / done 1, expected 4 / 0); no `normalizeId` → B fails
  (total 3, expected 6); index path that swallows errors → B's int-entry assert fails. Unmodified copy: green.
- **Parity** (Build's scripts copied; aiboard `a1592dc` re-extracted with `git archive`, read-only, identical
  to Build's; `python3 -I`; regenerated programs byte-identical to Build's): Node before vs after **1,429 /
  1,429 byte-identical**. Python vs after: `gen.mjs` 1,000 / 1,000; `gen419` 351 / 400; fixed-0419 16 / 18;
  fixed-0420 10 / 11 (`int-entries`). **One difference class only: 0419's trigger 1** (`AttributeError: 'int'
  object has no attribute 'strip'` vs `TypeError: s.slice is not a function`), 283 diffs in 51 programs on
  the 0419 sets, as Build reported. The comparison is sensitive: last-wins / no-`normalizeId` copies give 2 / 3
  before≠after on fixed-0420. Corpus 540 / 800: `snapshot()` JSON equal Python vs Node, all tasks in totals.
- **Benchmark** (`FKIT_BOARD_BENCH=1`, load avg ~6): ratio 3.0× / 5.4× / 6.4× / 8.5× at n = 100 / 405 / 540 /
  800; scans old n + 3, new 3; loads old 2n, new n.
- **Hygiene:** no raw U+2028 / U+2029 / U+FEFF / U+0085 in the two source files or this worklog; `plan.md`
  blob `39274005…` unchanged; git status unchanged by Verify; no `board-snapshot-*` temp dirs, lock files or
  stray processes. Pre-existing, not 0420: each `npm test` run leaves 3 `fkit-proj-*` dirs in the OS temp
  folder (`test/harness.mjs`; 1,038 there since 10-18).
- **Skipped:** `npm run test:prove-red` and `npm run test:release` (CONTRIBUTING table: no file of theirs
  changed).

## 2026-10-22 — fkit-coder (Process-review worker, round 1, spawned by fkit-sprint-ship-loop / fkit-lead)

Processed `review.md` R1, R2 under the declared-approval marker (plan blob `39274005…`, 16307 bytes, re-checked).
No commit, no push. Reviewer findings untouched; ledger `Status: closed-out`.

### Decision log (calls made without asking)

1. **R1 guard line** — answers R1's side effect (a renamed `_scan` made the scan assertion pass at 0 === 0).
   What changed: one line in test A, `assert.ok(small.scans > 0, '… was Board.prototype._scan renamed?')`.
   Why it qualified: obvious winner within the plan's intent (the spawn named this guard as optional and
   in-plan); test A's counting method itself is unchanged per the owner's R1 ruling ("Keep, record
   exception (Recommended)", 2026-10-22), recorded as an Accepted residual in `review.md`. Proven on a scratch
   copy with `_scan` shadowed under another name: without the guard pass 2 / fail 0 (vacuous), with it fails
   with the guard's message. Scratch copy deleted.
2. **R2 gate fix** — answers R2 (`FKIT_BOARD_BENCH=0` ran the benchmark). What changed: the benchmark test's
   `{ skip: !process.env.FKIT_BOARD_BENCH }` → `{ skip: process.env.FKIT_BOARD_BENCH !== '1' }`. Why it
   qualified: verified `CORRECT`, mechanical and localized (one expression), inside the plan (§3 C names
   `FKIT_BOARD_BENCH=1`).

### Checks

- Gate: unset, `=0`, `=true`, `=1x` → benchmark `# SKIP`, 2 pass; `=1` → runs, 3 pass / 0 fail, 16.6 s
  (ratios 2.6× / 4.1× / 6.3× / 8.6× at n = 100 / 405 / 540 / 800, load average ~6.6; scans old n + 3, new 3;
  loads old 2n, new n).
- `node --test test/board/*.test.js`: 56 tests, 55 pass, 1 skipped, 0 fail.
- `npm test`, exit 0: 901 tests, 900 pass, 1 skipped (the benchmark), 0 fail, 73.5 s wall. Test A 136 ms,
  test B 31 ms. `0284/term-ignored` passed.
- Skipped: `npm run test:prove-red`, `npm run test:release` (none of their files changed).
- Fence: only `test/board/snapshot-index.test.js` (2 lines), `review.md` (Coder response, residual,
  `Status:`) and this worklog changed. No `board-snapshot-*` temp dirs or stray processes left.

## 2026-10-22 — fkit-coder (Re-verify (post-review), spawned by fkit-sprint-ship-loop / fkit-lead)

Read-only on source. No commit, no push. Result: **pass**.

- **Fence:** `test/board/snapshot-index.test.js` differs from Verify's clean copy (`scratchpad/verify420/neg-clean/`)
  by exactly the 2 review lines (R1 guard, R2 `!== '1'` gate). `board/core/store.mjs` byte-identical to that copy
  (sha1 `d96f12f2…`): untouched since Verify.
- **Default lane:** `node --test test/board/snapshot-index.test.js` ×3 with `FKIT_BOARD_BENCH` unset, ×1 with `=0`:
  each 2 pass / 1 skipped (benchmark) / 0 fail.
- **Benchmark** (`=1`, one run): 3 pass / 0 fail, 16.7 s, load average ~5.7; ratio 3.0× / 5.1× / 6.5× / 8.4× at
  n = 100 / 405 / 540 / 800; scans old n + 3, new 3; loads old 2n, new n.
- **`npm test`**, exit 0: 901 tests, 900 pass, 1 skipped, 0 fail, 74 s wall (under the 2-minute budget). Test A
  116 ms, test B 34 ms. `0284/term-ignored` passed.
- **Negative control** (fresh copy, `scratchpad/reverify420/`): `_scan` renamed in its `store.mjs` → test A fails
  with the guard's message (`the _scan counter saw no calls: was Board.prototype._scan renamed?`); copy deleted.
- **Hygiene:** `plan.md` blob `39274005…` unchanged; git status unchanged by this run; no `board-snapshot-*` temp
  dirs, lock files or stray `node --test` processes. Pre-existing, not 0420: `npm test` added 3 more `fkit-proj-*`
  dirs to the OS temp folder (`test/harness.mjs`).
- **Skipped:** `npm run test:prove-red`, `npm run test:release` (none of their files changed).
