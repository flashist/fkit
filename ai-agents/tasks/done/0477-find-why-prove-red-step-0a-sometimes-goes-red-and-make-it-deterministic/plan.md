# Plan — 0477: find why prove-red step 0a sometimes goes red, and make it deterministic

## Summary
- **Cause found and reproduced (in a scratch copy of the repo, not the real tree):** other agents writing into `ai-agents/` during a test run. A no-writer control run was green (1017/1017). The same suite with a filing loop running alongside it went red 3 times out of 3.
- **The brief's guess was partly wrong.** Its suspect was a board row written before the task folder exists. The tests actually exposed under the producer's normal order (brief first, then row) are three tests that **read the live tree twice, at different moments, and expect the two reads to agree**:
  - `test/board-reader.test.js` › **A** ("every task id is a JSON string…"): it counts folders with `readdir`, then takes a ~2.5 s reader snapshot. If a folder appears between the two, it fails with `482 !== 483`.
  - `test/board-reader.test.js` › **E** ("a full crawl plus every route leaves ai-agents/ byte-identical in git's eyes"): it compares `git status` before and after a 5 s crawl. Any outside write shows up as a difference.
  - `test/board-root.test.js` › **R1** ("with no --root the root resolves exactly as before…"): it counts task folders, then runs `--bench` (3–14 s).
  - Hit counts: race run 1 failed R1; run 2 failed A, E and R1; run 3 failed A and R1.
- **The brief's own guessed mechanism is real, but only for out-of-order or mid-move states.** These are single-read tests that are right to fail, because at that moment the tree really is inconsistent (see Finding F2). They are not fixed by this plan; see Open question 2.
- **The race reaches the first half of `npm test` too.** All three race runs were plain `node --test test/*.test.js`, which is exactly that first half. It also reaches **0b** and every `run_suite` step, not only 0a (Finding F3). Fixing the tests themselves covers every one of these at once, at no extra cost.
- **Fix:** (1) prove-red keeps each failing step's own output outside the repo and prints where it is; (2) A and R1 switch to a "before/after bracket" comparison that tolerates outside writes at any rate and stays exact when nothing changes; (3) E switches to a private git copy of `ai-agents/`. Nothing under `claude/` changes.

## Findings from read-only investigation (2026-10-04, in a scratch copy of the working tree; the real tree was never written)

**F1. The race, reproduced.**
- A writer modelled a producer filing briefs at about 4 s per brief. It wrote `brief.md` (folder and file in one step), then 2 s later rewrote `backlog.md` with a new row appended.
- Results: no-writer control: `pass 1017 / fail 0`. Race runs: `1016/1`, `1014/3`, `1015/2`. The failing tests were only A, E and R1, as listed in the Summary.
- Shape of the failures:
  - R1: `expected /^corpus: 482 tasks, /` but bench printed 483.
  - A: `every task folder is rendered, and nothing else is — 482 !== 483`.
  - E: `git status` changed during the crawl.

**F2. Static intermediate states.** The full suite was run once against each frozen state:

| State | What it models | Result |
|---|---|---|
| S1: brief written, no row yet | the producer's documented order | **green** |
| S2: row added, no folder | the brief's guess | red: `reference-integrity` › **L2** (dangling link) |
| S3: lone folder, no `brief.md` | | red: board-reader **A** (482 vs 483 — A counts bare `NNNN-` names; the reader requires `brief.md`) |
| S4: `backlog.md` truncated to 0 bytes | a non-atomic rewrite | red: `board-narrow` **D, D2, F** |
| S5: `brief.md` present but empty | | red: `task-id-uniqueness` › "live corpus has no duplicate IDs" (no `## ID`) |
| S6: brief + row both written | the finished filing | **green** |
| S7: folder moved to `done/`, boards not yet updated | what `/fkit-task-done` step 3 → step 5 does for several seconds | red: `reference-integrity` › **L2** |

- S3, S4 and S5 last microseconds when a brief is written in one step, so the risk is small.
- **S2 and S7 can last seconds to minutes.** S7 happens on every agent-run close, because the mover moves the folder first and edits the boards afterwards.
- In those states the tree really does hold a broken link, so L2 is reporting the truth. Snapshotting the tree does not help, since the snapshot can capture the same state. Only a wait-and-retry would hide it — see Open question 2.

**F3. Brief imprecision.**
- The brief says only 0a reads the live tree. In fact `run_suite` always runs `$repo/test/*.test.js`, and `harness.mjs` derives `REPO` from where the test file sits.
- So **0b and every `run_suite` mutation step also read the live `ai-agents/`.** Only the launcher is a copy.
- The mutation steps expect red at a named assertion, so a stray race red does not usually change their verdict. 0b expects green and is exposed exactly like 0a.

**F4. prove-red has 55 steps, and each runs exactly one suite.**
- Steps: 0a–0o, then mutations 1–40.
- Counts: 55 `run_*suite "` calls, 55 step headers, 183 `fail=1` sites.
- A full run took 12m10s in a copy. It overlapped one other suite run part of the time, so that figure is inflated.

**F5. The incident's actual failing test is still unknown** (its output was lost). A, E and R1 are the tests now shown to be exposed. That they caused the 2026-10-02 reds is very likely but not proven.

## Scope (files)

1. `test/prove-red.sh` — keep each failing step's output (step 1 below).
2. `test/harness.mjs` — one small shared helper for the live task-folder listing (used by A and R1).
3. `test/board-reader.test.js` — A gets the bracket; E uses a private copy; the header comment is updated.
4. `test/board-root.test.js` — R1 gets the bracket.
5. `CONTRIBUTING.md` — one line: "on a red, prove-red prints where it kept the failing step's output."
6. Nothing under `claude/` changes, so there is no `.claude/` refresh (brief item 4 is then "n/a, stated").

No product code (`bin/`, `claude/`) changes. Nothing is written under `ai-agents/` by any test or helper.

## Steps

### Step 1 — prove-red keeps the failing step's output (brief item 1)

**1a. One output file per step.**
- Add a `step <label>` function. Insert one call as the **first statement of each of the 55 step blocks**: directly under each `# --- 0x.` and `# --- Mutation N:` header, before any `make_*copy` and before the no-op guards, because those can set `fail=1` themselves.
- `step` does two things:
  - **(i) Finishes the previous step.** If `fail` ≠ 0, it copies that step's `$out` into the keep dir as `<prev-label>.txt` and prints `   ↳ kept this step's output: <path>`. It then appends the label to `failed_steps`, sets `any_fail=1` and **resets `fail=0`**. Today `fail` only ever goes 0→1, so this reset is what lets a second failing step be recognised.
  - **(ii) Starts the new step:** sets `cur_step=$1` and `out="$work/out/$1.txt"`.
- The 183 `fail=1` sites and every `grep … "$out"` stay untouched; they now act on the current step's own file.
- Before the final summary, call `step end` to finish the last step. The final pass/fail reads `any_fail`, not `fail`.
- Labels are the printed step numbers (`0a` … `0o`, `1` … `40`).
- The Build worker audits that every `run_*suite` call sits in a block with its own `step`, and that no `fail=1` occurs before the first `step`.

**1b. A guard so a future step can't silently overwrite another's output.**
- Each `run_*` function first checks `[ ! -e "$out" ]`. If the file already exists, it echoes `reused` instead of `green`/`red`.
- Every step check then fails, because baselines need `green` and mutations need `red`. A future step added without a `step` call therefore fails loudly instead of overwriting another step's evidence.

**1c. Where the output is kept.**
- Created lazily on the first failure: `keep="$(mktemp -d "${TMPDIR:-/tmp}/fkit-prove-red-kept.XXXXXX")"`.
- It is outside `$work`, so the existing `trap 'rm -rf "$work"' EXIT` still cleans the large copy trees but never this directory.
- It is outside the repo and outside `ai-agents/`, so keeping output is not itself a concurrent write into the tree the suite reads.
- No absolute machine path is written into any file: `${TMPDIR:-/tmp}` is a variable, and `/tmp` is a generic fallback.
- **A green run never creates it**, so nothing is left behind.
- The final `✗ hard gate FAILED` line also prints the keep dir and the failed step labels.

**1d. Abnormal exit.**
- The trap becomes a small function. On a non-zero exit, if `cur_step`'s output exists and was not already kept, it keeps it as `<label>-aborted.txt` and prints the path. It then removes `$work` as today.
- This covers a `set -e` abort in the middle of a step.

**1e.** Update prove-red's header comment so the "how to read a red" story matches.

### Step 2 — reproduce on purpose, before the fix (brief item 2; verification 1)

**Where it runs:** a scratch copy of the working tree (`cp -R` including `.git`) under the session scratchpad. Inside that copy, `harness.mjs`'s `REPO` and prove-red's `$repo` both resolve to the copy, so 0a reads the **copy's** `ai-agents/`. See Open question 3.

**The helper — not committed; its full text goes in `worklog.md`.** It runs in two modes:
- **(a) Filing loop:** brief written in one step, then the backlog row about 2 s later (non-atomic rewrite), about every 4 s, for the length of 0a+0b (~140 s). This is the F1 writer.
- **(b) Mover:** `mv` one backlog task folder to `done/`, then update the board link about 5 s later.

It also re-confirms the static states S2, S3 and S7 from F2. Each probe uses a fresh, unused ID, and the helper removes everything it created at the end.

**The before-fix run:** run the copy's prove-red with Step 1 already in place, and the writer started alongside 0a. Expected: 0a red, naming at least one of A/E/R1, with the kept `0a.txt` path printed. Its relevant lines are quoted in the worklog.

**Gate:** if this shows a failing test that is **not** a "two reads at different moments" test, or not one of A/E/R1, → **stop with NEEDS-DECISION**. Do not widen the fix on a guess.

**Also:** grep the other live-tree tests for the same two-read pattern (count-then-run, before/after). Run the filing-loop writer at least 3 more times so the exposed list rests on more than 3 runs. Any newly exposed **two-read** test gets the same treatment as below and is recorded. Any other kind → NEEDS-DECISION.

### Step 3 — make the exposed tests deterministic (brief item 3)

**3a. `harness.mjs`.**
- Export `liveTaskFolders(root)`: a sorted list of `board/name` for every `NNNN-` directory that holds a `brief.md` under `ai-agents/tasks/{backlog,done,cancelled}`.
- This is the reader's own rule (`listTaskDirs`: a directory plus a stat-able `brief.md`). It matches R1's existing `isTask`, which is then replaced by the helper.

**3b. A — the bracket.**
- Take `before = liveTaskFolders(ROOT)`, then `snap = reader.snapshot()`, then `after = liveTaskFolders(ROOT)`.
- Key each snapshot task as `basename(dirname(t.path)) + '/' + t.folder`.
- Assert:
  - every key in `before ∩ after` is in the snapshot. No task that existed throughout may be dropped.
  - every snapshot key is in `before ∪ after`. Nothing may be invented.
  - the snapshot has no duplicate ids.
- When nothing changed (`before === after`), this reduces to **exact equality**, which is today's claim. Only a folder that changed during the window is tolerated.
- Keep the `> 400` sanity check and the 0013 assertions.
- This also fixes S3, since a lone folder with no `brief.md` is not counted on either side.

**3c. R1 — the bracket on a count.**
- `--bench` prints only a count, so the check is `|before ∩ after| ≤ N ≤ |before ∪ after|`.
- That is exact when nothing changed.
- This also covers a mid-move snapshot that sees the moved folder once or twice.

**3d. E — a private copy.**
- Copy the working tree's `ai-agents/` into an `os.tmpdir()` dir. `git init`, add and commit there, following the git-fixture idiom the suite already uses (for example in `closed-rank-immutability`).
- Run the same crawl via `startServer({ root: <copy>, dashboard: DASHBOARD, … })`.
- Assert that `git status --porcelain` in the copy is **empty** afterwards. Remove the copy.
- This is **stronger** than today's E. Today's E is blind to writes into files already showing ` M` and into untracked dirs, which its own E2 comment admits. A clean private repo sees any write under the root.
- What E gives up: it no longer watches a reader that ignores its `root` and writes into the real `REPO`. E2's static proof (the reader imports no write-capable API) already covers that, and the new comment says so.
- Update the file's header note ("E READS git state…") to match.

**3e. Why not a snapshot of the tree for 0a.**
- It would protect only prove-red, not the first half of `npm test` (which F1 shows is exposed). It would change what 0a means ("the real tree is green").
- It also cannot remove the S2/S7 class, because the snapshot can capture them.
- Fixing the three tests removes the race wherever they run.

**3f. Prove the new assertions can still fail** (in the scratch copy, all reverted; recorded in the worklog; no new prove-red mutations — see Open question 4):
- Make the reader drop one task → A red and R1 red.
- Make the server write one file under its root → E red.
- Run with no writer → A, R1 and E all green.

### Step 4 — `CONTRIBUTING.md`
Add one line beside the `npm run test:prove-red` line saying that a red prints where the failing step's output was kept.

## Verification (maps to the brief's five steps)

1. **Before the fix:** the Step 2 run is red at 0a. The failing test(s) are named. The kept-file path printed by prove-red and its relevant lines are quoted in the worklog.
2. **Output kept on red, in the scratch copy:**
   - Break mutation 5's grep pattern → step 5 fails. `5.txt` holds the **marker-hook** suite output, and no `0a.txt` is present.
   - Break 5 and 27 together → two files, each holding its own suite's output. This proves the per-step reset.
   - Insert a `false` mid-step → `<label>-aborted.txt` is kept.
   - On a green run, the number of `fkit-prove-red-kept.*` dirs in `$TMPDIR` is unchanged, and no `$work` dir is left.
3. **After the fix:** the same filing-loop reproduction, **5 full prove-red runs** in the scratch copy, run one after another (~60 min). 0a and 0b are green every time. State the count and results. Also 5 plain unit runs with the writer running, all green.
4. **Quiet tree:** `npm test` green on the real tree. State the unit pass count (expected about 1017; same count, since no tests are added) and prove-red's final line.
5. **No stray changes:** `git diff --stat` shows changes only in the 5 files under Scope, nothing under `ai-agents/` except this task's own `plan.md`/`worklog.md`, and no absolute machine path in any changed file (grep the diff).

## Risks and residuals (to be stated in the worklog, not hidden)

- **R-a. Single-read live-corpus checks are unchanged.** L2, task-id-uniqueness, and board-narrow D/D2/F still go red if the tree is truly inconsistent at the moment they read it: a row before its folder, a close in progress (S7), or a microsecond partial write. This is a true reading, not a test bug — see Open question 2.
- **R-b. Partial-write windows.** E's private copy, or A's snapshot, could catch a half-written file during a concurrent write. The window is microseconds, and the after-fix runs will show whether it matters.
- **R-c. Reader read-gap (product code, out of scope).** `bin/fkit-board.mjs` checks `brief.md` in `listTaskDirs` and reads it later in `readTask`. A move in that gap could make `snapshot()` throw. It was not seen in any run. Noted for the producer, not fixed here.
- **R-d. Run time.** Full prove-red took about 12 min in a copy. Five after-fix runs is about an hour, run in the background inside the loop.
- **R-e. Incident attribution unproven** (F5).
