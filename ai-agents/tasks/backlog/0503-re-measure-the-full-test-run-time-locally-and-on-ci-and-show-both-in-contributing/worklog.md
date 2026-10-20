# 0503 worklog

Build worker (fkit-coder), spawned by `fkit-sprint-ship-loop` from the `fkit-lead` session, Sprint 12,
under the ADR-055 declared-approval marker. Owner approval, quoted by the lead: 2026-10-19,
AskUserQuestion — "Two phases, ask me (Recommended)", "One (Recommended)", "All, X8 as lower bound
(Recommended)", "Approve (Recommended)". Plan verified before start: `plan.md` blob
`80c7cd579b1293072bc7a4b5cee88f65232de408`, 21174 bytes, pasted text equal to the file.

**Phase 1 of 2** (this entry): CI measurement (plan Step 1), local preconditions (Step 2), CI side of
the dominance analysis (Step 4). **No timed local run, no `CONTRIBUTING.md` edit, no watchdog** —
those are phase 2, after the owner's "go".

## Preconditions (Step 2), taken 2026-10-19 ~09:20Z

- **Commit:** HEAD `78b746482ae252a1df7b8a715556c0bdd2ed6059`; `git status --porcelain | wc -l` = 50
  (same with `-uall`). The tree carries uncommitted Sprint 12 work, so the SHA alone does **not** pin
  the suite; suite size comes from run output.
- **Suite in the working tree:** `test/prove-red.sh` has 16 baselines (0a–0p) and **55 mutations**
  (1–55); HEAD has the same 16 / 55. `run_suite` is called by 0a, 0b, 2, 15, 30 and 31 (6 calls).
  42 `test/*.test.js` files. Four test files are modified in the tree (`prove-red.sh`,
  `structure-manifest`, `structure-notice`, `turn-completion-hook`).
- **Machine:** Apple M4 Pro, `hw.ncpu` 14 (10 performance + 4 efficiency cores).
- **Node:** v24.13.0; `os.availableParallelism()` = 14.
- **Power:** AC attached, battery 84%, not charging; `powermode 0` (low-power mode off).
- **Load:** 1-min **8.66** at 09:20Z (8.66 / 8.33 / 8.78); 6.94 a few minutes later. Not idle — above
  the plan's 8.0 start gate at the first reading.
- **What is running (`ps`, process names only, no arguments):** web-page content processes
  (`com.apple.WebKit.WebContent` + `com.apple.WebKit.GPU`, ~220% CPU together — Safari is open; other
  apps that show web pages also use these), Yandex browser (~30%), Google Chrome, Docker Desktop,
  ChatGPT app, Codex processes (15), Visual Studio Code, 10 `claude` processes (other Claude sessions
  and agents, this one included). No other test suite running. Total ~354% CPU.
- **No `timeout` / `gtimeout` on this Mac** (confirms plan-review X4's premise).
- **Sanity check (not a timed run):** `node --test test/coordination-citation-policy.test.js` →
  22 tests, 22 pass, 0 fail. The tree is green where CI at HEAD was red.
- **Still to confirm with the driver before Run A:** no other fkit worker writes to `ai-agents/`
  during the window (the suite reads the live tree).

### X2 tree fingerprint — method prepared, before-value NOT taken

To be run immediately before and after Run A; any mismatch discards the run. One sha256 over:

```bash
{ git rev-parse HEAD
  git ls-files -s
  git diff HEAD --binary
  git status --porcelain -uall
  git ls-files -o --exclude-standard -z -- ai-agents test | sort -z | xargs -0 shasum -a 256
} | shasum -a 256 | cut -d' ' -f1
```

Dry run in phase 1: two reads back to back gave the same value (value not recorded — it is not the
before-fingerprint). Untracked, non-ignored files outside `ai-agents/` and `test/`: 0 today. ⚠️ This
worklog sits under `ai-agents/` and is untracked, so it is inside the fingerprint: **do not write it
during Run A** — record results after the after-fingerprint is taken.

## CI measurement (Step 1)

**Method:** `gh run list --workflow test.yml --limit 60 --json databaseId,headSha,createdAt,conclusion,event,status`;
kept runs with `event == "push"` (X5) and `git merge-base --is-ancestor acd23a9 <sha>`; per run,
`gh run view <id> --json jobs` for job and step times and `gh run view <id> --log` (scratchpad only)
for the split. **Unit phase** = `Run npm test` step start → the `ℹ duration_ms` line. **Prove-red** =
that line → the `✓ hard gate PASSED` line. First prove-red step (0a) is timed from the `ℹ duration_ms`
line (X6). Job time is job start → end, so queue wait is excluded.

**Dataset: 13 green push runs, 2026-10-09 → 2026-10-16** (commits `acd23a9` … `b5b46b8`). Every one
carries Sprint 10's suite: each log shows baselines 0a–0p (16) and mutations through at least 43.
All 14 descendant runs are `push`; no pull-request or manual run is among the last 60, so the event
filter excluded nothing.

| Run id | Job start (UTC) | Commit | Whole job | `npm test` step | Unit | Prove-red | Overhead | Tests / suites | Baselines / mutations | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| 39013591527 | 2026-10-17 07:25:48 | `78b7464` | 99 s | 92 s | 92.3 s | — (never ran) | 7 s | 1156 / 24 | — (never ran) | **excluded**: unit phase red (1155 pass, 1 fail: `L2 live corpus: RESIDUAL is 0 under the settled condition`), prove-red never ran |
| 38904713361 | 2026-10-16 13:01:34 | `b5b46b8` | 1318 s (21m58s) | 1310 s | 93.5 s | 1217.0 s | 8 s | 1146 / 24 | 16 / 48 | dataset |
| 38770624988 | 2026-10-15 16:38:01 | `6227119` | 774 s (12m54s) | 769 s | 76.9 s | 692.0 s | 5 s | 1133 / 24 | 16 / 43 | dataset |
| 38695388731 | 2026-10-15 06:55:38 | `96c7263` | 769 s (12m49s) | 761 s | 76.8 s | 684.0 s | 8 s | 1133 / 24 | 16 / 43 | dataset |
| 38536502958 | 2026-10-14 08:38:11 | `ae1473a` | 773 s (12m53s) | 764 s | 76.1 s | 688.1 s | 9 s | 1107 / 24 | 16 / 43 | dataset |
| 38534681419 | 2026-10-14 08:22:49 | `bfb86f0` | 756 s (12m36s) | 745 s | 74.9 s | 670.5 s | 11 s | 1107 / 24 | 16 / 43 | dataset |
| 38526943590 | 2026-10-14 07:13:32 | `0916b6e` | 782 s (13m02s) | 776 s | 77.3 s | 699.0 s | 6 s | 1107 / 24 | 16 / 43 | dataset |
| 38067364114 | 2026-10-10 16:22:00 | `1461196` | 747 s (12m27s) | 741 s | 75.5 s | 665.5 s | 6 s | 1096 / 24 | 16 / 43 | dataset |
| 38066339971 | 2026-10-10 16:06:59 | `5d25d1c` | 753 s (12m33s) | 745 s | 75.3 s | 669.7 s | 8 s | 1096 / 24 | 16 / 43 | dataset |
| 38064272969 | 2026-10-10 15:36:09 | `79a7dbf` | 613 s (10m13s) | 602 s | 59.6 s | 542.3 s | 11 s | 1096 / 24 | 16 / 43 | dataset |
| 38033296145 | 2026-10-10 07:06:54 | `0d1712f` | 543 s (9m03s) | 534 s | 51.3 s | 483.0 s | 9 s | 1096 / 24 | 16 / 43 | dataset |
| 38031274614 | 2026-10-10 06:32:14 | `47b4e99` | 745 s (12m25s) | 737 s | 73.3 s | 664.4 s | 8 s | 1096 / 24 | 16 / 43 | dataset |
| 37979484507 | 2026-10-09 19:19:56 | `d457593` | 746 s (12m26s) | 737 s | 74.7 s | 662.6 s | 9 s | 1096 / 24 | 16 / 43 | dataset |
| 37961366174 | 2026-10-09 16:45:11 | `acd23a9` | 737 s (12m17s) | 731 s | 73.1 s | 658.2 s | 6 s | 1096 / 24 | 16 / 43 | dataset |

CI rows have no load, power or uncommitted-path columns: the runner checks out the commit clean and
its load is not in the log. Its core count is not in the log either, so it is not asserted.

**Summary (13 green runs):**
- Whole job: **543–1318 s** (9m03s–21m58s). Slowest: run 38904713361, 2026-10-16, `b5b46b8`,
  1318 s. Fastest: run 38033296145, 2026-10-10, 543 s.
- `npm test` step: 534–1310 s. Unit phase: 51.3–93.5 s. Prove-red: 483.0–1217.0 s.
- The 12 runs of the 43-mutation suite: job 543–782 s; 10 of them sit in 737–782 s. The two fast ones
  (2026-10-10, 613 s and 543 s) are fast in every step alike (6 `run_suite` steps 335 s and 296 s vs
  418–445 s elsewhere), same suite (1096 tests).
- Unit + prove-red equals the `npm test` step to within 0.4 s.
- **Overhead beyond the `npm test` step: 5–11 s per job.** Per step (GitHub stamps whole seconds,
  so ±1 s each): set up job 0–1 s, checkout 1–3 s, setup-node 0–4 s, post setup-node 0–1 s, post
  checkout 0–1 s, complete job 0–1 s.
- Suite sizes in the dataset: 1096 tests (7 runs), 1107 (3), 1133 (2), 1146 (1); 24 suites; 16
  baselines; 43 mutations (12 runs) or 48 (1 run, the slowest).

## CI side of "what dominates" (Step 4)

Per-step prove-red times from log line timestamps; a step's time is the gap from the previous result
line (0a: from `ℹ duration_ms`).

**Typical run 38770624988 (43 mutations, `npm test` 769 s):**
- (a) Unit pass: 76.9 s. (b) 6 `run_suite` steps: 445.4 s (0a 77.0, 0b 76.5, 2 77.6, 15 60.6,
  30 77.2, 31 76.5). **(a)+(b) = 522.3 s = 68% of the step** — 7 full passes of ~61–78 s each.
- (c) Single-file steps: 246.5 s — 8 steps of 18–19 s (0i, 14, 32, 36–40) = 145.1 s; 10 steps of
  ~7 s (0k, 18–22, 25, 26, 42, 43) = 70.6 s; 35 steps under 5 s = 30.8 s.
- So on CI the "~7 full passes" picture **holds for the 43-mutation suite: about two thirds**.

**Slowest run 38904713361 (48 mutations, `npm test` 1310 s):**
- (a) Unit 93.5 s + (b) 6 `run_suite` steps 538.3 s = 631.8 s = **48%** of the step.
- Mutations 44–48 (absent from every other run): **343.1 s = 26%**. Step 48 alone (*"watchdog left
  armed — "0284/no-stray" should go RED"*) **217.8 s**, the slowest step in any run.
- Five slowest steps: 48 = 217.8 s, 0a = 93.1, 0b = 92.7, 2 = 92.4, 30 = 91.6 (31 = 91.6, 15 = 77.0,
  44 = 61.7 next).
- The 7 full passes are not the majority any more on this suite; the five new mutation steps are a
  quarter of it.

**Why the slowest run is slow — from the log, step by step, against run 38770624988:**
- +343.1 s: mutations 44–48, new in this suite.
- +92.9 s: each of the 6 `run_suite` steps ~15–16 s longer (1146 tests vs 1133).
- +76.5 s: the three update-banner steps (0j, 16, 17) took 26.7 s each vs 1.2 s.
- +16.6 s: the unit pass (93.5 s vs 76.9 s).
- Other common steps: within ~1 s each.
- So it is **not a slow-runner outlier**: the 43 steps it shares with the other runs took 873.8 s vs
  691.9 s, and the difference sits in the steps whose suites grew. No cause is claimed beyond this.

## Local runs — historical, older suite (verified in their worklogs)

Not merged with phase 2's run. Shown for context only.

| Task | Date | Wall time | Load | Tests | Mutations | Result | Use |
|---|---|---|---|---|---|---|---|
| 0502, *Verification* V6 | 2026-10-09 | 1385 s (23.1 min), unit 109 s | 2.6 start / 2.7 end | 1096 | not stated | green | sanity check beside Run A |
| 0502, process review, *Full suite … run once* | 2026-10-09 | 1705 s (28.4 min), unit 131 s | 1.71 start, ~5.7 during, 3.50 end | 1096 | not stated | green | context (load rose during it) |
| 0498, *Verification* | 2026-10-09 | 28m39s (1719 s) | 3.9 at start | 1096 | 43 | green | context |
| 0493, *Round-1 full-suite result* | 2026-10-09 | 1870 s | 2.39 start / 3.70 end | 1096 | 43 | **red** — "hard gate FAILED — Failed step(s): 0a" | **not a valid time** (red run) |
| 0473, *Final full suite* | 2026-10-06 | ~48 min (13:19–14:07 UTC) | 10.8 start, ~28 mid, 5.1 end | 1072 | 43 | green | the loaded figure for X8 |

0502's two runs do not state a mutation count (same day and same 1096 tests as 0498's 43-mutation
run); the others state 43 directly. The `0493`+`0494` "2134 s" was not looked for further and is not
used.

## Findings (for the owner — nothing acted on)

1. **CI slowest job 1318 s (21m58s) is over half the 33-min timeout (990 s)** — run 38904713361,
   2026-10-16. The slow part is **prove-red** (1217.0 s); the unit pass was 93.5 s. It is the newest
   suite, not an outlier (see above). Timeout is `0395`'s ground; out of scope.
2. **No green CI run carries today's suite.** HEAD and the working tree have 55 mutations; the
   slowest measured run had 48. Mutations 49–55 (the `0334` group) have never been timed on CI. The
   only run at HEAD (39013591527) was red in the unit phase, so prove-red never ran. The next green
   run's time is unmeasured; no estimate is made.
3. **CI on `main` is red at `78b7464`** — run 39013591527, one failing unit test (`L2 live corpus:
   RESIDUAL is 0 under the settled condition`). The sanity check above passes on today's tree.
   Not this task's.
4. **Possible speed-up, from timings only:** prove-red step 48 alone is 217.8 s on CI (17% of the
   slowest `npm test`), and mutations 44–48 together 343.1 s. Also the update-banner steps (0j, 16,
   17) went from 1.2 s to 26.7 s each between `6227119` and `b5b46b8`. Recorded only.

## Decision log

- **Dataset is 13 green runs, not the plan's "11 such green runs exist today".** The plan's own rule
  (`git merge-base --is-ancestor acd23a9 <sha>`) counts `acd23a9` itself, and every run's log shows
  16 baselines and at least 43 mutations, i.e. Sprint 10's 0p and 41–43 are present. The plan marked
  its CI figures "to be re-measured". Min, max and slowest are the same with or without `acd23a9`'s
  own run (737 s). Mechanical, in plan.
- **X5 applied:** `event == "push"` filter explicit; it removed nothing (all 14 descendants are push).
- **X6 applied:** 0a timed from the `ℹ duration_ms` line.
- **0493's 1870 s marked red, not a valid time.** Its worklog says exit 1, step 0a failed. The plan's
  rule for Run A ("A red run is discarded, not timed") applied to the historical row. Obvious winner
  within the plan's intent; it changes no figure the plan would publish (CONTRIBUTING uses Run A and,
  for X8, `0473`).
- **CONTRIBUTING's CI column will name a different suite size from local** (CI ≤ 1146 tests / 48
  mutations; local today 55 mutations). The plan's edge case covers it; phase 2 applies it.
- **Fingerprint script kept in the session scratchpad;** its commands are copied above so a
  re-spawned worker can rebuild it.
- **No fix applied without asking, no review processed:** none.

## Checks run in phase 1

- `npm run test:docs` after writing this worklog: 410 tests, 410 pass, 0 fail, exit 0 (pass/fail
  check only, not a timed run; load was 7–12).
- Worklog grep for a coordination-doc path followed by `:<line>`: 0 hits.
- `ps` at 09:25Z: no `node --test` or `prove-red` process; no `perl`. Two `caffeinate` processes
  (1–2 min old) are children of `claude` processes — the Claude app's own, not started by this build.
  No background process was started in phase 1. Load at 09:25Z: 12.29 / 9.58 / 9.06.

## Phase 2 — not started

Waits for the owner's "go". Remaining: X2 before-fingerprint; Run A under the load gate with the X4
watchdog and X1 labelling; X2 after-fingerprint and `pmset` sleep check; Run B; Run C; local
dominance analysis; `CONTRIBUTING.md` edit (X7 grep, X8 lower-bound wording); Step 7 checks; `ps`
sweep.

**Expected length — a planning note, not a measurement.** On the same 43-mutation suite, 0502's V6
(1385 s, load 2.6) took ~1.85× the CI job (737–753 s for 1096 tests). The slowest CI run of the
48-mutation suite took 1318 s; the tree now has 55. So Run A should take **at least ~40 min**, plus
Run B (~30 s) and Run C (each file alone, serially: minutes). The approved X4 watchdog "at about
60 min" leaves little margin over that; raised to the owner with the "go" question.
