# 0502: make `test/board-root.test.js` reliable under machine load

## 0. Gate
The brief says "Do not start without the owner's specific word". **The owner approving this plan is that word.** Nothing is built before it.

## 1. What is already measured (planning pass, read-only, nothing written)
| Call | Wall time | Load average then |
|---|---|---|
| `node -e 0` (bare process start) | 0.02 s ×3 | ~6–11 |
| `node bin/fkit-board.mjs --port 0 --root /nonexistent-…` (R3's path) | 0.03 s ×3 | ~11 |
| `node bin/fkit-board.mjs --bench` (R1's path; 502 tasks, 12 boards) | 0.54 s | ~11 |

**Code reading (confirms the producer's reading):** in `main()` of `bin/fkit-board.mjs`, three R3 cases (`--root` given twice ×2, `--root=…`, a trailing `--root`) return 2 before `findRoot()`. The rest return 2 from the `resolveRoot()` catch, which comes before the `select-active` probe spawn. The module imports only `node:` built-ins. So R3's refuse path costs node start-up plus about 10 ms of stats. In the failing runs, a single call went past 20 s, about 600 times its normal cost. **Hypothesis for Build to test:** the stall is OS-level (process spawn, memory or disk pressure while every test file runs at once), not CLI work. R1's `--bench` does real work, but only about 0.5 s of it.

**Reds observed, per the brief's worklog quotes:** the R3 test took 35–47 s in total, including one 20 s kill. So the other calls averaged about 2 s each under that load, and one call stalled past 20 s. How long it would really have taken is unknown, because it was killed.

**Exposure:** `npm test` = unit stage, then `prove-red.sh` (which runs only if the unit stage is green). `run_suite()` re-runs the whole `test/*.test.js` glob in steps 0a, 0b and mutation steps 2, 15, 30 and 31. That is **7 runs of this file per `npm test`**, each with files running in parallel. That is why one slow test goes red so often.

## 2. Build step 1: measure under load (bounded, gentle, capped)
**Before touching the test file:** copy `test/board-root.test.js` to the scratchpad (`board-root.0477-snapshot.js`). It is the baseline for the snapshot diff in step 6. 0477's uncommitted edits stay in place and are built on, never reverted.

**Measurement harness: scratchpad only, never the repo.** A small script times, from the parent side, N=20 each of: (a) `node -e 0`; (b) a module-only load (`node -e "await import('<READER>')"`); (c) one R3 bad-root CLI call; (d) R1's `--bench`. For (c) and (d) it also runs the CLI with `--import <scratch preload>`. The preload records `performance.timeOrigin` and the time it ran, and prints them on exit. That splits each call into **spawn → process start** (OS), **process start → preload** (node bootstrap) and **preload → exit** (module load plus `main()`). It also samples the load average (`sysctl -n vm.loadavg`) and free memory (`memory_pressure`, last line). It leaves the CLI file untouched.

**Load ladder.** Never two rungs at once, never alongside a full `npm test`. Stop at the first rung that reproduces:
- **Rung 0: no synthetic load** (baseline numbers).
- **Rung 1:** 7 CPU burners (half the 14 cores), `nice -n 10`.
- **Rung 2:** 14 CPU burners (one per core), `nice -n 10`. This is the brief's "a CPU-burning process per core".
- **Rung 3: no burners.** A back-to-back loop of at most 3 `npm run test:unit` runs (about 1 min each) as the load. This is the brief's own "concurrent full `npm run test:unit`", and is no heavier than the unit stage of any normal `npm test`. Not a full `npm test`.

**Caps and stopping:**
- **Each burner ends itself:** `node -e "const end=Date.now()+600000; while(Date.now()<end){}" fkit-0502-burn`. So a rung can never outlive **10 min**, even if everything else fails. Total synthetic-load time across the whole Build is at most **30 min**.
- **Burner PIDs go to a scratchpad file.** Stop = `kill $(cat pids)`, then `pkill -f fkit-0502-burn` as a backstop. The rung-3 loop is a bounded `for` loop of 3, run in the background with its PID recorded and killed the same way.
- **Pre-start guard:** start a rung only if the 1-min load average is below 10 and free memory is at least 25%. Other agent sessions already put the machine at about 6–11; if the guard fails, wait and re-check, never force it.
- **In-flight watchdog** (background, samples every 10 s): kills the load at once if the 1-min load average goes above 24 or free memory drops below 15%.
- **No memory or disk-I/O load generators at all.**

**Per rung:** N=20 runs of `node --test test/board-root.test.js` on the **unfixed** file, plus the harness timings above. Record the failure count, per-run times and load samples.

**Decision rule from the measurement:**
- Time sits in spawn or bootstrap (not CLI code): go ahead with §3. This is the expected outcome.
- Refuse path slow **inside** `main()` (preload → exit large while the other segments are small): **STOP, return `NEEDS-DECISION`.** A `bin/fkit-board.mjs` change is outside scope per brief item 5.
- Worst loaded call above 40 s (so 120 s would be less than 3× headroom): **STOP, return `NEEDS-DECISION`** with the numbers.
- **No rung reproduces a red:** do not escalate further. Use the deterministic stall injection in §5, step V1b, subject to Q1.

## 3. Options weighed (brief item 2), each against the R3 "starts nothing" proof
| Option | Verdict | Why |
|---|---|---|
| **Raise the per-call limit** (one named constant) | **Chosen** | The cause is per-process tail delay; a ceiling is the matching fix. Green-path cost is **zero**, because the limit is only used up by a call that does not end. The R3 proof stays: a CLI that keeps a listener up still never returns, still times out and is still red, just after 120 s instead of 20 s. The repo has done this before (`board-narrow.test.js`, 120 s, same "red for load, not for a defect" story). |
| Lighter R3 (fewer real starts) | Rejected | Each start costs about 30 ms, so it is not slow. The stall is random per process, so fewer starts only lowers the odds. 4 of the 11 cases (`--root=`, a trailing `--root`, `--root` twice ×2) exist only in `main()`, so `resolveRoot` cannot cover them and they must keep real starts. Cutting the other 7 loses end-to-end coverage of the exit-2 message. A lighter R1 is impossible: R1's whole claim is fkit's own tree. |
| Isolate (split out of the `prove-red` re-runs) | Rejected | It needs a `test/prove-red.sh` change (outside the brief's default scope). It does not fix the unit-stage red (0495 round 2, run 1). And the tests would run less often. |
| Retry once on timeout | Rejected | It is the weakest against the R3 proof, it doubles a real hang's time, and a retry after 20 s is in effect a 40 s limit with an extra process. Nothing beats a longer limit here. |

## 4. The change (`test/board-root.test.js` only)
1. **Add one constant** above `cli()`: `const CLI_TIMEOUT_MS = 120000;`. Its comment says why the value: per-process tail delay under load, the 0502 evidence (20 s limit, calls about 30 ms idle, killed under load average 5–13), the `board-narrow` precedent, that the limit is spent only when a call does not end, and that **R3's "no listener stayed up" proof relies on it being finite**. (120 s unless the measurement or Q2 says otherwise.)
2. **`cli()`:** `timeout: 20000` becomes `timeout: CLI_TIMEOUT_MS`.
3. **`serveCli()` banner timer:** `20000` becomes `CLI_TIMEOUT_MS` (brief item 4: yes, it changes too, same risk). Its message gains `after ${CLI_TIMEOUT_MS / 1000} s`.
4. **`runUntilBannerOrExit()` timer** (R9): `20000` becomes `CLI_TIMEOUT_MS`. This is the **third** 20 s timer, which the brief does not name. Same risk.
5. **Diagnosis only (assertions unchanged):** both R3 tests' `assert.equal(r.status, 2, …)` message gains `, error: ${r.error?.code}`. A future timeout then reads `ETIMEDOUT` instead of a bare `null !== 2` with empty stderr. **R1's line `assert.equal(r.status, 0, r.stderr)` is left alone.** It sits inside 0477's hunk, and editing it would tangle the two tasks' diffs.
- **No assertion is deleted, weakened or reordered.** 0477's R1 before/after bracket and its `liveTaskFolders` import are untouched. `test/harness.mjs` is untouched. Every 0502 line sits outside 0477's hunks (imports and the R1 body), so the two diffs stay apart.
- **No `CHANGELOG.md` entry:** a test-only change is not something "people who use fkit would notice" (the CONTRIBUTING rule).
- **Worst-case cost, stated:** if the CLI really hangs, each affected test fails after one limit (it stops at its first failing assertion). 7 tests use the CLI, so at most about 14 min in the unit stage. `prove-red` does not run after a red unit stage (`&&`), so this stays under the 33-min CI job limit (0395). Green-path time is unchanged.

## 5. Verification (brief's steps)
- **V1 (red first):** from §2, the first rung with at least 1 failure out of N=20 on the unfixed file. **V1b, if no rung reproduces (Q1):** deterministic stall injection in a **scratchpad copy** of the working tree (copy excludes `.git`; `REPO` comes from the test file's own location, so the copy tests itself). The copy's `bin/fkit-board.mjs` sleeps 25 s **once** (a marker file in the copy's temp dir; `Atomics.wait`). Run `node --test --test-name-pattern "^R3: a bad --root" <copy>/test/board-root.test.js`. Unfixed copy: red, `null !== 2`, the brief's exact signature. Fixed copy: green.
- **V2 (green under the same load):** the same rung, same N=20, on the fixed file: **0 failures.** Record N, load samples and per-run times. (With V1b instead: the fixed copy is green.)
- **V3 (the R3 proof still bites):** mutants in the scratchpad copy only; the real `bin/` is never touched. Each runs only the first R3 test, so each costs about 120 s:
  - **M1 (falls back and serves):** in the `resolveRoot` catch, print the message, then fall back to `{ path: home, how: 'default' }` and carry on to serving. Expected: red, call timed out.
  - **M2 (only wrong thing: a listener stays up):** print the correct refusal, set `process.exitCode = 2`, start `createServer().listen(0)`, print no URL, and `return 0`, so the process stays alive. Expected: red. This is the case **only** the finite-limit proof catches.
  - The real repo is unaffected; the copy is deleted afterwards. No retry was chosen, so no "always hangs with retry" check is needed.
- **V4 (no assertion lost):** a diff review listing every `assert.*` in R1 and both R3 tests, before (snapshot) and after. Expected: same count and same conditions; only the two R3 status messages change. 0477's bracket and `liveTaskFolders` use are intact.
- **V5 (unloaded cost):** `node --test test/board-root.test.js` run 5× before (snapshot) and 5× after, at the machine's normal load, with medians and load averages recorded. Full suite: **one** `npm test` after the fix (driver cap); its time is compared with CONTRIBUTING's about 12 min plus the file-level delta. **No measured "before" full run** (Q3). Expected change: about 0, because only a hang uses the limit.
- **V6 (full suite green):** `npm test` (unit stage plus `prove-red.sh`) exits 0. That is the ONE full run, with no load generator running and only after every burner is confirmed dead (`pgrep -f fkit-0502-burn` returns nothing).
- **V7 (scope):** `git diff --stat` on `test/board-root.test.js` and `test/harness.mjs` matches 0477's numbers plus this task's lines only. `diff <scratchpad snapshot> test/board-root.test.js` is reported as **0502's own lines**, separate from 0477's.

## 6. Checks (CONTRIBUTING's "what changed → what to run" table)
- `test/` changed → **`npm test`**, run once (V6). It covers `test:unit`, `test:docs` and `prove-red`.
- Targeted runs: `node --test test/board-root.test.js` (V1, V2, V5) and the scratchpad-copy runs (V1b, V3).
- Skipped: a second full `npm test` before the change, because the driver caps Build at one; reported as skipped, not passed.

## 7. Edge cases and failure modes
- Other agents' sessions already load the machine (about 6–11 measured). Rung-0 numbers may already be "loaded"; the load is recorded with every sample.
- Another agent may edit `test/board-root.test.js` or `test/harness.mjs` during Build. Before editing, check that the file still matches the scratchpad snapshot. If it does not, stop and report.
- Another agent may file or close tasks while R1 runs: 0477's bracket already handles that.
- An orphan burner if the session dies: each burner ends itself within 10 min.
- A watchdog kill mid-rung counts as an incomplete measurement, never as "green".
- The chmod-000 R3 test skips when run as root; unchanged.

## 8. Not done / out of scope
- No CPU or worker caps (dropped by the owner). No `bin/fkit-board.mjs` change, unless the measurement says so, and then only with the owner asked first. No `prove-red.sh` change. No commit.
- Related, not depended on: committing 0477's edits first would make 0502's diff cleaner. The owner has been told; this plan works either way, through the snapshot diff.
