# Plan: 0503, re-measure the full test run time, locally and on CI, and show both in CONTRIBUTING

## Summary
- **Scope:** docs and measurement only. One repo file changes, `CONTRIBUTING.md`, plus the task folder's `worklog.md`. No test, script or workflow is edited.
- **Local:** one full `npm test` on the owner's Mac (Apple M4 Pro, 14 cores, Node v24.13.0), timed per output line, behind a load gate. Plus one `npm run test:docs` and one pass that times each unit file alone, to rank them.
- **CI:** read every green `test.yml` push run that carries Sprint 10's suite, meaning descendants of `acd23a9` (2026-10-09). 11 such green runs exist today.
- **Seen while planning** (to be re-measured, not taken as final): CI `npm test` jobs of ~12–13 min, and one of **~22 min** (run 38904713361, 2026-10-16). That is over half the 33-min timeout, so the brief's "record it as a finding" rule will probably fire.
- ⚠️ **Not this task's, but news:** CI on `main` is **red** at HEAD `78b7464`.
  - Run 39013591527, 2026-10-17: one unit test, `coordination-citation-policy` L2, flagged a line-number cite in `0507`'s `plan-review.md`. That file was still under `backlog/` at that commit.
  - The working tree has since moved `0507` to `done/` (uncommitted), and that single test file now passes locally. The next push should be green; not verified.
  - That red run is **excluded** from the CI figures, because prove-red never ran.
- **Load gate:** the load average was 6–10 while planning. The build will not start a timed run at a 1-min load of 8 or above. It labels a run "idle" only below 3. See NEEDS-DECISION 1.

## Changes after plan-review round 1 (architect: APPROVE; its non-blocking notes adopted)
- Load wording is written after the numbers exist. No ratio is drawn across suites of different size (note 3).
- No SHA in CONTRIBUTING. The SHA and the count of uncommitted paths go in the worklog only (note 4).
- What-to-run rows carry only the local figure (note 5).
- The CI job figure states what it includes beyond the `npm test` step (note 6).
- The round-2 reply (APPROVE) added one small note: the suite-size line names the CI suite size where it differs. This was already in the edge cases and is now explicit in Step 5. I did not re-ask; it is wording only.

## Classification (for plan review)
Code-only: it changes contributor docs and records measurements. What fkit delivers to its users is unchanged.

## Ground truth (checked while planning)
- **`package.json`:** `test` = `node --test test/*.test.js && bash test/prove-red.sh`. `test:unit`, `test:prove-red` and `test:docs` (11 named files) are defined there too.
- **`test/prove-red.sh`:** 16 baselines (0a–0p) and 55 mutations.
  - `run_suite` is a full `node --test test/*.test.js` pass. It is called 6 times: 0a, 0b, and mutations 2, 15, 30 and 31. Every other step runs one test file.
  - Add `npm test`'s own unit pass and that makes **7 full passes**, as the brief says. The build checks whether they dominate the time.
- **prove-red output:** one line per step (`<label>. … green|red`), with no timestamps. The build adds timestamps from outside, with no edit to the script.
- **Timing figures in `CONTRIBUTING.md` today:**
  - *Tests* block: `npm test` ~12 min, `test:unit` ~1 min, `test:prove-red` ~11 min, `test:docs` ~30 s, then "Times are from a busy Apple M4 Pro (2026-10); yours will differ."
  - The what-to-run table repeats them: `test:docs` (~30 s) twice, `test:unit` (~1 min) once, `npm test` (~12 min) once.
  - No other top-level doc, `architecture.md` or wiki page quotes these figures.
- **Tests that read CONTRIBUTING:** only `test/top-level-doc-links.test.js`.
- **Earlier local runs** (to be verified in their files during the build):
  - `0502` V6: 1385 s at load 2.6 (unit 109 s).
  - `0498`: 28m39s.
  - `0493`: 1870 s.
  - `0473`: ~48 min, load 10.8 at start, ~28 mid-run.
  - The `0493`+`0494` "2134 s" is unverified (per the brief) and is not used unless found in a file.
- **CI was last measured by `0395`:** 7.4–10.9 min, before Sprint 10. Method: `gh run list` / `gh run view --json jobs`, with the unit/prove-red split from the `--log` timestamps. The unit phase ends at `ℹ duration_ms`; prove-red ends at `✓ hard gate PASSED`.

## Steps

### Step 1: CI measurement (no local load; can run at any time)
1. `gh run list --workflow test.yml --limit 50 --json databaseId,headSha,createdAt,conclusion,event`.
2. Keep each run whose `headSha` passes `git merge-base --is-ancestor acd23a9 <sha>`.
   - **Green** runs are the dataset.
   - **Non-green** runs are listed as excluded, with the reason. Example: 39013591527, whose unit phase was red, so prove-red never ran.
3. For each green run, take from `gh run view <id> --json jobs`: the job's start and end, and the `Run npm test` step's start and end.
4. From `gh run view <id> --log`, saved to the scratchpad and never to the repo, take:
   - the unit/prove-red split, by the `0395` method;
   - `ℹ tests` and `ℹ suites`, for the suite size;
   - the baseline and mutation counts, from the step lines.
5. For the slowest run, also take per-step prove-red times from the log's line timestamps. These feed CI's side of Step 4 at no extra cost.
6. Report min, max and the slowest whole job (run id and date), and the range of `npm test` step times.
   - If the slowest job is over 16.5 min (half the timeout), record a finding: is the slow part unit or prove-red, and is the run an outlier against the others?
   - Job start→end excludes queue wait. State what the job figure includes beyond the `npm test` step (set-up, checkout, setup-node, post-steps; seconds each), so that unit + prove-red + overhead accounts for the whole job.
   - No timeout edit (out of scope; that is `0395`'s ground).
   - No guess at the cause beyond what the log shows.

### Step 2: local preconditions (no timed run)
1. Record:
   - **Commit:** HEAD SHA plus `git status --porcelain | wc -l`. The tree carries uncommitted Sprint 12 work, so the SHA alone does not pin the suite. The worklog says so.
   - **Machine:** `machdep.cpu.brand_string`, `hw.ncpu`.
   - **Node:** `node --version`, and `node -p 'require("os").availableParallelism()'`, which sets how many test files `node --test` runs at once.
   - **Power:** `pmset -g batt` (AC or battery) and low-power mode. A run on battery or in low-power mode is labelled as such and is never presented as "idle".
2. A `ps` check for other running test suites or heavy jobs. Confirm with the driver that no other fkit worker writes to `ai-agents/` during the window, because the suite reads the live tree (see prove-red's header).
3. Sanity check that the tree is green where CI was red: `node --test test/coordination-citation-policy.test.js` (under 1 s, not a timed run). A red full run gives no usable time, so a red here stops the build.

### Step 3: local timed runs (load-gated)
**Load gate, on every timed run:**
- The 1-min load is read **in the same command** as the launch: `sysctl -n vm.loadavg`, field 2.
- **8 or above:** do not start. Re-check at most every 5 min, for at most 60 min, with plain `sysctl` reads (no `pgrep` loop). Still 8 or above → return `NEEDS-DECISION`.
- **Below 3:** the run is labelled **idle**.
- **3 to under 8:** the run goes ahead, labelled **"normal load (x.x)"**, never "idle".
- NEEDS-DECISION 1 covers how the idle window is obtained.

**Run A: full `npm test`, run the way a contributor runs it.**
- Command: `caffeinate -i bash -c 'set -o pipefail; npm test 2>&1 | perl -MTime::HiRes=time -ne "…"' > <scratchpad>/runA.log`.
- The perl filter prefixes each output line with the epoch time and the 1-min load. It re-reads the load at most once every 30 s, so it adds almost no extra processes.
- `caffeinate -i` stops idle sleep and exits with the command, so nothing lingers.
- The exit code comes through `pipefail`, so the pipe cannot hide a red.
- The run takes ~20–30 min, past the Bash tool's 10-min foreground limit. It uses the Bash tool's own `run_in_background`, which reports back when the run exits. No polling loop.
- It gives:
  - wall time;
  - load at start, mid-run (the 30 s samples) and at end;
  - the unit/prove-red split, from the `ℹ duration_ms` line;
  - per-step prove-red times (the gap between consecutive step result lines);
  - suite size: `ℹ tests`, plus the baseline and mutation step counts.
- After the run, check `pmset -g log` for any `Sleep`, `Wake` or `DarkWake` entry inside the run's window. The log is in local time with an offset, so the window is converted first. Any hit → the run is discarded and redone.
- **A red run** is discarded, not timed. Its failing step is reported and the build returns `NEEDS-DECISION`, because fixing tests is out of scope.

**Run B: `npm run test:docs`, once.** Same gate, same timestamping. It is the source for that command's row.

**Run C: unit file ranking.** Each `test/*.test.js` file runs alone, one after another, each timed. Same gate at the start, with the load recorded at start and end. The whole pass takes a few minutes.
- Its result is a ranking only.
- Run A's parallel unit time stays the source for every CONTRIBUTING figure.

**Number of full runs:** see NEEDS-DECISION 2. Recommended: one Run A.

### Step 4: "what dominates" analysis (in the worklog)
- Group Run A's per-step times into:
  - (a) the unit pass;
  - (b) the 6 `run_suite` steps (0a, 0b, 2, 15, 30, 31);
  - (c) the single-file steps;
  - (d) the gaps between steps (copying, setup).
- Compare (a)+(b) with the "~7 full passes" picture. Confirm or correct it, in numbers.
- Short ranked lists, each backed by timings:
  - the 5 slowest prove-red steps;
  - the 5 slowest unit files (from Run C);
  - CI's per-step view of its slowest run (from Step 1).
- Note local vs CI parallelism. The local `availableParallelism` is measured. CI's runner core count is not asserted unless the log shows it.
- Any easy speed-up the timings suggest is recorded as a **finding for the owner**. Nothing is acted on.

### Step 5: edit `CONTRIBUTING.md`
- **Tests block:** the four commands stay as written, with their inline `(~…)` times removed. Below them goes a small table, every figure taken from a worklog row:

  | Command | Local: Apple M4 Pro, <load label>, <date> | CI: `ubuntu-latest`, <n> green runs, <date range> |
  |---|---|---|
  | `npm test` | ~N min (unit ~a + prove-red ~b) | N–M min (slowest job ~K min) |
  | `npm run test:unit` | ~a | a1–a2 |
  | `npm run test:prove-red` | ~b | b1–b2 |
  | `npm run test:docs` | ~s | — (CI runs it only inside `npm test`) |

  One line under the table carries:
  - **Suite size and date:** `<tests> tests; prove-red <B> baselines + <M> mutations`, measured <date>. If the CI runs measured a different suite size, the line gives the CI size too, or the CI column header carries its own.
  - **No SHA in CONTRIBUTING.** The timed tree is HEAD plus uncommitted work, so a SHA would point a reader at a different suite. The SHA and the uncommitted-path count live in the worklog only.
  - **The measured loaded figure**, under the wording rule below.
  - **The kept "yours will differ".**
- **Load wording follows the data, and is written after the numbers exist.**
  - The loaded figure comes from a verified past run, for example `0473`'s ~48 min at load 10.8, if its worklog confirms it.
  - No loaded run is staged; no CPU burners.
  - If the loaded and idle figures come from the same-size suite, state the measured multiplier.
  - If, as expected, the loaded figure comes from an older, smaller suite, show both figures side by side, each labelled with date, load and suite size, and state no ratio.
  - The word "doubles" appears only if the data shows about 2×.
- **What-to-run table:** each in-row figure becomes **one labelled local figure**, for example `npm test` (~N min locally). One figure per row. The CI side lives only in the Tests-block table, to limit drift between the two places.
- The "busy Apple M4 Pro (2026-10)" sentence is replaced by the table's labelled headers.
- After the edit, `grep -n "12 min" CONTRIBUTING.md` must return nothing, or only a labelled figure the table supports.
- **No `CHANGELOG.md` entry.** This is contributor docs that fkit's users would not notice, which is CONTRIBUTING's own test: "people who use fkit would notice". This is an assumption; the reviewer may challenge it.

### Step 6: worklog (task folder)
`worklog.md` holds:
- **The measurement table, one row per run.** Local rows and CI rows are kept apart.
  - Local rows: A, B and C, plus the verified earlier runs, marked "historical, older suite".
  - CI rows carry their run id.
  - Columns: date (UTC), commit SHA plus uncommitted-path count, wall time, unit/prove-red split, load at start / mid / end, test count, baselines/mutations, power, and an excluded/discarded flag with its reason.
- The dominance analysis from Step 4.
- The findings: the CI run over half the timeout, any speed-up, and the CI red at `78b7464`.
- A decision log.
- ⚠️ **No `file:line` cites of coordination docs** (briefs, boards, worklogs, review ledgers) in the worklog. It sits in an open task folder, and `coordination-citation-policy` reds on exactly that; it is what turned CI red at HEAD. Cite by heading plus a quoted fragment.

### Step 7: checks
- **Run after the edit, under the same load gate:**
  - `npm run test:docs`: CONTRIBUTING's own table names it for `CONTRIBUTING.md` and for anything under `ai-agents/`, which covers the worklog.
  - `npm run test:unit`: the brief's verification 5. `top-level-doc-links` reads `CONTRIBUTING.md`.
- **Skipped, and why: a second full `npm test` after the edit.**
  - Run A was already a full green `npm test` on this same tree minus the edit.
  - The edit touches only `CONTRIBUTING.md` and the task folder. prove-red neither names nor mutates either; `grep -F CONTRIBUTING test/prove-red.sh` returns 0 matches, checked while planning.
  - This is not a release.
- Before return, `ps` confirms that no `node --test`, `prove-red`, `caffeinate` or `perl` process remains.

## Edge cases and failure modes
- **The tree changes mid-run:** another agent writes to `ai-agents/` during Run A. The suite tolerates two reads that differ (`0477`), but a red costs a re-run. Mitigation: confirm with the driver that no parallel worker is running.
- **The pipe hides a red:** handled with `pipefail`. The `✓ hard gate PASSED` line must also be present.
- **Sleep, lid close, App Nap:** `caffeinate -i` plus the `pmset` check. Discard on any hit.
- **Heat or battery:** the power state is recorded. A battery or low-power-mode run is labelled.
- **Time-zone mix-up:** the `pmset` log is in local time with an offset; every recorded time is UTC. Convert explicitly.
- **The SHA does not pin the suite:** the tree has uncommitted changes, so the suite size comes from the run output, not from the SHA.
- **CI and local measure different trees:** CI rows carry their own test counts. CONTRIBUTING states each column's suite size, or one size plus a note where the two differ.
- **One local run is a sample of one:** `0502` V6 (1385 s at load 2.6, older suite) is shown alongside it as a sanity check, not merged in.
- **Rounding:** CONTRIBUTING rounds to whole minutes, or to 10 s for docs. The worklog keeps exact seconds, so each figure can be spot-checked.

## Out of scope (recorded as findings only)
`test.yml`'s `timeout-minutes` and its comment; any speed-up of the suite; the CI red at `78b7464`.

## Owner rulings at the plan gate (2026-10-19, AskUserQuestion, fkit-lead session)

This section is the lead's; the plan above and the post-Codex questions below are copied from the
coder's return. Where they differ from the plan above, the rulings below govern.

- Idle machine (NEEDS-DECISION 1): **"Two phases, ask me (Recommended)"** — option 1: the build does the CI reading and preparation first, then stops and returns NEEDS-DECISION; the driver asks the owner to idle the Mac; the timed runs and the CONTRIBUTING edit happen only after his "go", in a re-spawned worker.
- Number of full runs (NEEDS-DECISION 2): **"One (Recommended)"** — one Run A.
- Codex fixes (NEEDS-DECISION 3): **"All, X8 as lower bound (Recommended)"** — option 1: the coder-check fixes for X1–X7 as written in the plan-review record (X1 reason for a non-idle run; X2 tree fingerprint before/after, discard on change; X3 "load at each step end" plus the longest gap; X4 ~60-min watchdog killing the run's process group; X5 push runs only; X6 first step's boundary is the unit summary line; X7 grep every old figure), plus X8 as a lower bound with both figures labelled ("at least ~2×"), which replaces the plan's no-ratio rule for that line.
- Plan: **"Approve (Recommended)"** — this is also the owner's specific word to start 0503 (its brief's ⛔ line).

## Post-Codex questions and open questions

NEEDS-DECISION {
  question: "How does the build get an idle machine for the ~25-min local timed run?",
  options: [
    "(Rec) Two phases: the build worker does the CI reading and preparation first, then stops and returns NEEDS-DECISION. The driver asks the owner to idle the Mac: pause other fkit work, close heavy apps such as the ChatGPT/Codex desktop app, stay on AC power. On his 'go', a re-spawned worker runs the timed runs and edits CONTRIBUTING.",
    "One phase: the worker waits up to 60 min for the 1-min load to fall below 3, checking every 5 min. If it never does, it runs while the load is below 8 and labels the result 'normal load (x.x)', with the reason in the worklog.",
    "The owner runs `npm test` himself through a command line the worker gives him, then hands back the log; the worker does the analysis."
  ],
  recommendation: "Option 1",
  context: "The brief says the idle run 'needs the owner's cooperation — ask before starting it', and its top says 'Do not start without the owner's specific word'. The Mac's load average was 6–10 while I planned, so it is not idle by itself. The sprint loop's own workers also add load. Option 1 is the only one that asks first and gets a real idle figure. Option 2 never asks; it may end up publishing a 'normal load' figure. Option 3 costs the owner the most hands-on time. The architect backs option 1. It also covers the architect's question of whether placing 0503 in Sprint 12 counts as the owner's word: option 1 asks before the timed run either way. knock-on: none (checked) — no task's placement or Depends-on link changes."
}

NEEDS-DECISION {
  question: "How many full local `npm test` runs?",
  options: [
    "(Rec) One: the brief's minimum, ~25 min of idle machine. 0502's earlier 23-min run is shown next to it as a sanity check, not merged in.",
    "Two, back to back: shows the spread between runs, but doubles the owner's idle time to ~50 min."
  ],
  recommendation: "One",
  context: "CONTRIBUTING rounds to whole minutes, so a second run rarely changes the published number. It would mainly show how much runs vary. The architect agrees one is enough. knock-on: none (checked)."
}

NEEDS-DECISION {
  question: "Codex found 8 gaps in the plan. Which fixes go in before the build starts? (Under the review rule the plan is frozen after Codex; you decide.)",
  options: [
    "(Rec) All of them: the mechanical fixes for X1–X7 (say why a run is not idle; fingerprint the tree before and after and discard on change; word load samples honestly; a 60-min watchdog that kills the run's process group; push runs only; the first step's start boundary; grep for every old figure), plus X8 as a lower bound: 'loaded, an older smaller suite took ~48 min — at least ~2× today's idle run'.",
    "X1–X7 only: keep the architect's no-ratio rule for the load wording, so the two figures sit side by side with no 'doubles' claim.",
    "Build as planned, with no Codex fixes."
  ],
  recommendation: "Option 1",
  context: "X1–X7 are small, checkable fixes. Without them the build could publish a non-idle figure without saying why (X1), time a tree that changed mid-run (X2), claim load samples it did not take (X3), leave a hung test process behind (X4), mix pull-request runs into the CI range (X5), or miss a leftover old figure (X7). X6 is mostly a wording fix. X8 is a judgment: the brief asks for a plain 'load can roughly double' line. The architect's adopted note forbids a ratio across different-size suites. A lower-bound wording satisfies both: an older, smaller suite is faster, so its 2× is if anything an understatement. Option 2 keeps the architect's stricter wording and may fall short of the brief's line. knock-on: none (checked)."
}

Open items (information, no decision needed from this plan):
- **CI on `main` is red at `78b7464`** (run 39013591527). The cause is a line-number cite in `0507`'s `plan-review.md`, under `backlog/` at that commit. The uncommitted move of `0507` to `done/` makes it pass locally; whether the next push is green is not verified. Fixing it is outside 0503.
- **CI job of ~22 min on 2026-10-16** (run 38904713361), against the 33-min timeout. The build records it as a finding; the timeout is `0395`'s ground and out of scope.
