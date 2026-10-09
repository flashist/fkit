# 0502 worklog

Build worker: `fkit-coder`, spawned by `fkit-sprint-ship-loop` (Sprint 10) under the declared-approval
marker. Owner approval relayed by the lead, 2026-10-09, `AskUserQuestion`: "Approve, no CPU burners
(Recommended)"; Q2 "120 s (Recommended)"; Q3 "One run after (Recommended)".

**Rulings applied to the plan:** §2 Rungs 1 and 2 (CPU burners) removed — no burner process is ever
started. Measure at Rung 0 only (Rung 3 optional). Prove the fix with V1b (deliberate 25 s pause in a
scratchpad copy) and V3 mutants. `CLI_TIMEOUT_MS = 120000`. One full `npm test` after the fix.

## Pre-edit snapshot

Snapshot folder: the session scratchpad's `0502-snap/` (under `/private/tmp`, wiped on restart — the
sha256 values below let a lost snapshot be checked against git history plus 0477's diff).

| File | sha256 before any 0502 edit |
|---|---|
| `test/board-root.test.js` (with 0477's uncommitted edit) | `2d982e446052443556bf18d2a676c7750237eac50ee8b89bc330dd8e0328606f` |
| `test/harness.mjs` (with 0477's uncommitted edit) | `0cd3f465faf9e8d51f4f6dfd2980c9c45c7c264dc9e7f04280c16c1ca4f9c23b` |
| `bin/fkit-board.mjs` (never edited by 0502) | `57838d75917035022c92423415336fdfb6eb20f3e0336bcc5b26abce23cc333b` |

`git diff --stat` before 0502: `test/board-root.test.js` 35 (+19/−16), `test/harness.mjs` 30 (+29/−1) —
all 0477's.

After the edit: `test/board-root.test.js` sha256
`a7d2184fdac1f980ff7cc7ba5d6dccdb8ab803f3f773a7d7b90c2a9054036819`. `test/harness.mjs` and
`bin/fkit-board.mjs` unchanged (same hashes as above).

## Machine safety

Before every heavier step: `uptime` plus a `ps` check for other test suites. 1-min load stayed 2.5–8.0
for the whole Build; no other suite was running at any start. **No CPU burner was ever started**
(`pgrep -f fkit-0502-burn` empty). Nothing heavy ran alongside anything else heavy; the only overlap
was the plan's own Rung 3 design (the `test:unit` loop as load, with single-file runs on top).

## Step 1 — measurement (plan §2; Rungs 1 and 2 removed by the owner)

Harness (scratchpad only): times each call from the parent; for CLI calls a `--import` preload splits
it into OS spawn → process start, node bootstrap, and module load + `main()`. N=20 each. Times in ms.

**Rung 0 — normal load** (1-min load 3.1–3.3, memory free 88–89%):

| Call | median | p90 | max | spawn (OS) | bootstrap | module + main |
|---|---|---|---|---|---|---|
| `node -e 0` | 22.5 | 23.7 | 24.4 | – | – | – |
| module load only | 34.8 | 35.7 | 35.7 | – | – | – |
| R3 bad-`--root` call | 31.6 | 33.0 | 33.3 | 11.4 | 10.0 | 9.0 |
| R1 `--bench` | 458 | 532 | 538 | 11.7 | 11.1 | 430 |

`node --test test/board-root.test.js`, unfixed, N=20: **0 failures**, 1.99–2.42 s, median 2.02 s.

**Rung 3 — 3 back-to-back `npm run test:unit` as load** (bounded loop of 3, PID recorded; each run
111–122 s, all three green; 1-min load 4.5–8.0 during it):

- `node --test test/board-root.test.js`, unfixed, N=20: **0 failures** — no red reproduced. But clear
  slowdowns: runs of 53.9 s, 45.0 s, 20.9 s, 12.7 s (normal ~2 s). Worst single tests: R3 (bad root,
  11 calls) 19.7 s in total; R3 (unreadable, 2–3 calls) 24.2 s in total; R2 14.5 s.
- Harness under the same load: `node -e 0` p90 **336 ms**, max **515 ms** (×20 its idle time), while
  the R3 refuse call's own `main()` segment stayed ~11 ms (p90 11.8) and `--bench`'s ~490 ms.

**Decision rule (plan §2):** the slow tail sits in process start (spawn/bootstrap), not in the CLI's
refuse path → go ahead with §3. No call was seen near 40 s (the largest whole-test time anywhere was
39.4 s for all 11 R3 calls together, in V6's unit stage). Rung 3 reproduced no red, so the fix is
proved with V1b.

## Step 2 — the change (plan §4, `test/board-root.test.js` only)

1. `const CLI_TIMEOUT_MS = 120000;` above `cli()`, with a comment giving the reason and that it must
   stay finite for R3's proof.
2. `cli()`: `timeout: 20000` → `CLI_TIMEOUT_MS`.
3. `serveCli()` banner timer: `20000` → `CLI_TIMEOUT_MS`; message gains `(after 120 s)`.
4. `runUntilBannerOrExit()` timer: `20000` → `CLI_TIMEOUT_MS` (wrapped to a second line).
5. Both R3 `assert.equal(r.status, 2, …)` messages gain `, error: ${r.error?.code}`. R1's line untouched.

0502's own lines (diff against the snapshot): +19 / −5. `git diff --stat test/board-root.test.js`:
59 (+38/−21) = 0477's +19/−16 plus 0502's +19/−5. `test/harness.mjs`: 30, unchanged (all 0477's).

## Verification

- **V1b (red first):** scratchpad copy of the working tree (no `.git`); the copy's CLI sleeps 25 s once
  (marker file, `Atomics.wait`) at the top of `main()`. Unfixed test file: **red** after 20.0 s —
  `exit 2 (stderr: )` / `null !== 2`, the brief's exact signature. Fixed test file, marker reset:
  **green** (the test took 26.0 s).
- **V2:** no rung reproduced a red, so V1b's fixed run stands in for it (plan §5).
- **V3 (R3 proof still bites), fixed test file, copy only:** M1 (refuse message, then fall back to
  fkit's own tree and serve) → **red** at 120.0 s, `null !== 2`, `error: ETIMEDOUT`. M2 (correct
  refusal, `exitCode = 2`, a bare listener up, `return 0`) → **red** at 120.0 s, same signature. No
  leftover mutant processes. Copy deleted after.
- **V4 (no assertion lost):** R1 + both R3 tests: 20 `assert.*` lines before, 20 after; file total 55
  before, 55 after. Only difference: the two R3 status messages. 0477's bracket and `liveTaskFolders`
  import/use intact.
- **V5 (unloaded cost):** before (unfixed, first 5 of Rung 0) median 2.01 s at load ~3.2; after (fixed,
  5 runs) 1.93–1.97 s, median 1.95 s at load ~3.0. No change.
- **V6 (full suite):** `npm test` **exit 0**, 1385 s (23.1 min), load 2.6 at start / 2.7 at end. Unit
  stage 1096/1096 pass (109 s; R3 took 39.4 s there and passed); prove-red: *"✓ hard gate PASSED —
  real + unmutated copy green; each mutation reds its NAMED assertion."* cmp proof: sha256 of every
  tracked file and `git status --porcelain` identical before and after the run; the test file
  byte-identical to its pre-run copy. Note: CONTRIBUTING's "~12 min" is stale on this machine — other
  full runs today, with the old file, took 28m39s (0498) and 1870 s (0493); this run is not slower.
- **V7 (scope):** 0502 wrote only `test/board-root.test.js` and this worklog. No `CHANGELOG.md` entry
  (test-only change).

## Not done

- No "before" full `npm test` (owner Q3 ruling).
- No loaded green-run batch (V2) — no rung reproduced red; V1b covers the mechanism, not a real overload
  (as the owner's chosen option said).
- Rungs 1 and 2 (CPU burners) not run (owner ruling).

## Decision log

Calls made unattended under the approved plan (Build worker; no review fixes in this pass):

1. **Ran the optional Rung 3.** Load was 3.8 (below ~8) and no other suite was running; the ruling
   allowed it. Qualified: inside the approved plan as amended by the owner.
2. **V5 "before" = the first 5 of Rung 0's 20 unfixed runs**, not a separate batch of 5. Same file,
   same load window, fewer process starts on a machine that has been force-restarting. Qualified:
   obvious winner within the plan's intent (same measurement, less load).
3. **Constant comment states what was measured** ("the reader's own refuse path still takes about
   10 ms; the slow tail is in starting the process") rather than the plan's longer list of reasons;
   all the plan's points are kept (evidence, board-narrow precedent, cost only on a hang, must stay
   finite). Qualified: wording, inside §4 item 1.
4. **Wrapped the `runUntilBannerOrExit()` timer line** after swapping in the constant, to keep it near
   the original length. Mechanical.

## Review round 1 — Process-review worker

Process-review worker: `fkit-coder`, spawned by `fkit-sprint-ship-loop` (Sprint 10) under the
declared-approval marker. Owner rulings relayed by the lead, 2026-10-09, `AskUserQuestion`: R1 "Coder
rewords it (Recommended)"; R2 "Accept as settled (Recommended)"; R3 "Yes, settled (Recommended)".

**Snapshot before any round-1 edit** (session scratchpad `0502-r1snap/`, wiped on restart):

| File | sha256 before | sha256 after |
|---|---|---|
| `test/board-root.test.js` | `a7d2184fdac1f980ff7cc7ba5d6dccdb8ab803f3f773a7d7b90c2a9054036819` | `fc2faa05fe93feddbc5664f2556312e8c4c38fb5acdde4b4813c0df461249490` |
| `test/harness.mjs` | `0cd3f465faf9e8d51f4f6dfd2980c9c45c7c264dc9e7f04280c16c1ca4f9c23b` | unchanged |
| `bin/fkit-board.mjs` | `57838d75917035022c92423415336fdfb6eb20f3e0336bcc5b26abce23cc333b` | unchanged |
| `review.md` | `b535d17dc97aca1b926dbc7bd5cca1522b7d42f8514301468949afd541b9a476` | Coder response + 2 residuals + Status |
| `worklog.md` | `95cff094d8b3a490b336bd27e8e1df3dd461d7e3f3ceb7847268738e317346f6` | this section appended |

**Change:** the `CLI_TIMEOUT_MS` comment only (8 lines → 9). No code line changed; `node --check` ok.

**Full suite (CONTRIBUTING: a `test/` change → `npm test`), run once** in a fresh scratchpad copy of the
working tree including `.git`. Before: `uptime` load 1.71 / 2.12 / 2.16, `ps` showed no other test
suite (any project). Copy checked identical to the real tree first (`diff -rq` excluding `.git`: no
difference; `git status --porcelain` sha256 equal).
- Result: **exit 0**. Unit stage 1096/1096 pass (131 s); prove-red: *"✓ hard gate PASSED — real +
  unmutated copy green; each mutation reds its NAMED assertion."* Wall time 1705 s (28.4 min); load
  rose to ~5.7 during it (end: 3.50 / 4.66 / 4.53).
- cmp proof after: `test/board-root.test.js` byte-identical (`cmp`) between copy and real tree; the
  copy's `git status --porcelain` sha256 unchanged by the run. `diff -rq` copy vs real showed only
  `review.md` (this round's ledger write, made after the copy), `ai-agents/sprints/backlog.md` and a new
  `0503-…/brief.md` in the real tree (another session filing task 0503 during the run) — none from the
  suite. Copy deleted after.

## Decision log — review round 1

1. **R1 — reworded the `CLI_TIMEOUT_MS` comment.** Finding: the comment stated an inference as measured
   and over-generalised. Changed: it now says `node --test` runs up to availableParallelism() − 1 files
   at once (verified: Node v24.13.0, 14 cores → 13 of 37 files); gives R3's ~30 ms / `null !== 2` and
   R1's `--bench` ~0.5 s / `null !== 0` separately (verified: the file imports `node:assert/strict`, so
   a timed-out R1 reads `null !== 0`); quotes only the measured start-up tail (p90 ~336 ms, max ~515 ms;
   refuse path ~10 ms); and says no 20 s+ stall was caught, so "slow tail in process start" is an
   inference. Qualified: verified `CORRECT`, mechanical/localized (comment only), inside the approved
   plan §4 item 1 (the constant's comment), and the owner ruled "Coder rewords it".
2. **R2, R3 — no code change;** `won't fix (frontier)` with residual entries, per the owner's rulings.
   Not unattended calls.
