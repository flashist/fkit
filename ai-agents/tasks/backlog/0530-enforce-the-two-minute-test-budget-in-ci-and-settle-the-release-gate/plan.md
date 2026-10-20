# Plan — 0530: enforce the two-minute test budget in CI and settle the release gate

**Planning-only. No file written.** Owner decisions (Q1–Q4 at the end) are not settled here.

## Where ADR-057 and the brief differ (ADR wins)
- Release test path: brief says `test/release-summary.test.js`; it is now `test/release/release-summary.test.js`, run by `npm run test:release` (ADR-057 §D4 dated note 2026-10-20). Brief left to the producer.
- No other conflict found.

## Facts found at plan time (2026-10-20)
- 0529's cut is **uncommitted** (working tree only). `origin/main` = HEAD `3cfd93a` still has the old suite. Nothing can be measured on the GitHub runner until the owner commits and pushes.
- Last runner data, old suite (run 39388117472, 2026-10-20, read-only via `gh`): unit pass `node --test test/*.test.js` = **76.4 s**, 1156 tests; whole job 19 min (prove-red ~17.6 min). The cut suite (845 tests, no assertion changed, release test moved out) is a subset of that pass → expected ≤ ~76 s on the runner. **Estimate, not measured.**
- Local (busy Mac, load 10–20, 0529's runs): `npm test` 77–89 s; `test:release` 46.8 s; `test:prove-red` 151.6 s.
- `bin/release.mjs` gate: `runTests()` spawns only `npm test`. Stale text: help `(10+ min)` (line 79), comment line 334 `10+ min separate this gate`, line 350 `5+ minutes of silence`, line 351 `(10+ min; includes prove-red.sh)`, line 362 `~6-minute gate`. Header comment lines 16–18.
- `test/release/release-summary.test.js`: lines 46 and 498 say `~6-minute gate`. Its 4 gate-ON tests run the real release.mjs in a fixture whose package.json has only a `test` script; 3 assert stdout includes ``running `npm test` ``; one asserts stderr `(during npm test)`. Fixture branch `other` is cut from the initial commit (package.json with no scripts).
- `.github/workflows/test.yml`: `timeout-minutes: 33` with an old basis comment; single step `run: npm test`.
- RELEASING.md cites `bin/release.mjs:<line>` 12 times and `.github/workflows/test.yml:<line>` 4 times, each with a quoted fragment; ADR-015 cites `bin/release.mjs:8-10` (header lines not moved by this plan; ADRs append-only anyway).
- GitHub docs (fetched 2026-10-20) on `schedule`: runs only on the default branch, on its latest commit; UTC by default; "can be delayed during periods of high loads … High load times include the start of every hour"; "some queued jobs may be dropped"; "In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days"; notifications go to the user who last modified the cron syntax (re-enabling a disabled workflow moves them to the re-enabler), by email or web if that user has Actions notifications on.
- The owner's commits are linked to his GitHub account: `gh api repos/flashist/fkit/commits/3cfd93a` → author and committer login `flashist`, the authenticated `gh` user (checked 2026-10-20).

## Steps

### 1. CI budget — `.github/workflows/test.yml`
- Replace `- run: npm test` with one timed step:
  ```yaml
      # ADR-057 §D10: CI fails the job when the default suite goes over its budget. Timed here, not
      # with a step timeout, so the failure names the budget and the time taken.
      - name: npm test (budget, ADR-057 §D10)
        env:
          BUDGET_S: 120
        run: |
          start=$(date +%s)
          npm test
          took=$(( $(date +%s) - start ))
          echo "npm test took ${took} s (budget ${BUDGET_S} s)"
          if [ "$took" -gt "$BUDGET_S" ]; then
            echo "::error title=Test budget exceeded::npm test took ${took} s, over the ${BUDGET_S} s budget (ADR-057 §D10)."
            exit 1
          fi
  ```
  `BUDGET_S` = the owner's Q3 answer (120 recommended). A red `npm test` fails the step first (GitHub runs `bash -e`), so the budget line only judges a green run.
- `timeout-minutes: 33` → **10**, basis comment rewritten: the old-suite runner figure (76.4 s unit pass, run 39388117472), "post-cut runner times: <filled in step 7>", and why 10: kills a hung run (the budget step can only judge a run that finishes) at ~5× the budget, far below GitHub's 6 h default. The old prove-red basis text goes.
- Header comment (lines 1–11) unchanged — still true under Q1 (a).

### 2. Nightly prove-red — new file `.github/workflows/prove-red.yml`
New CI file (not a test file, no new prove-red case — ADR-057 D2 not engaged).
```yaml
# fkit — nightly prove-red (ADR-057 §D3, task 0530): the four mutation cases, outside `npm test` and
# outside its 2-minute budget (§D10). A red run is seen next morning, not at push time ("fine for now").
# Scheduled runs use main's latest commit only; GitHub may delay or drop them at busy times.
name: prove-red

on:
  schedule:
    - cron: '17 3 * * *'   # 03:17 UTC daily; off the hour, which GitHub names as its busiest time
  workflow_dispatch:

permissions:
  contents: read

jobs:
  prove-red:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # same checkout prove-red last ran green in (inside test.yml's job)
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm run test:prove-red
```
Not on push, not in the budget. Still runnable by hand (`npm run test:prove-red`) and on demand (`workflow_dispatch`). 15 min: ~6× the local 151.6 s; the old 43-mutation prove-red took ~9–17 min on this runner; 4 cases + 2 baselines should be far under.

**How a red night reaches the owner:** GitHub notifies (email or web) the user who last changed the cron line — the owner, who pushes it; his commits are linked to his account (checked). **One unverified condition:** his GitHub notification settings must have Actions notifications on (github.com/settings/notifications → Actions; one look). Also visible as a red run on the Actions tab. Not chosen: auto-opening an issue on failure (needs `issues: write` + more YAML) — the re-raise lever if email proves unnoticed (ADR-057 §Consequences).

**Known limits (written into CONTRIBUTING):** main only (branches, PRs and a release's working tree are not covered); may be delayed or dropped at busy times — a dropped night sends no message; auto-disabled after 60 days without repo activity (fkit is active; low risk).

### 3. Release gate — `bin/release.mjs` (branches on Q1/Q2)
**Q1 (a) + Q2 "yes, release test" (recommended):**
- `runTests()` runs `npm test`, then `npm run test:release`, stopping at the first red with `<cmd> failed (exit N) — refusing to release an untested tree.` + the existing "Nothing was changed…" lines. Same position, same `--no-test` skip (skips all), same `stdio: "inherit"`.
- Progress line keeps the substring the tests check: ``• running `npm test` and `npm run test:release` before release v${target} (about 2 min)``; `✓ npm test green` → `✓ npm test and npm run test:release green`. `(during npm test)` HEAD-moved wording unchanged.
- Text: header lines 16–18 name the scripts; help `(10+ min)` → `(about 2 min)` and names them; line 334 `10+ min` → `about 2 min`; line 350 `5+ minutes of silence` → `two minutes of silence`; line 362 `~6-minute gate` → `the test gate (about 2 min)`.
**Q1 (a) + Q2 "also prove-red":** as above plus `npm run test:prove-red` third; times `(about 4.5 min)`.
**Q1 (a) + Q2 "no":** gate unchanged (npm test only); only the time text: `(about 1.5 min)`; drop `includes prove-red.sh`.
**Q1 (b):** sketched only — replace the local run with: refuse unless HEAD is pushed and the `test` workflow concluded `success` for that sha (Node's built-in `fetch` to the public GitHub API; no new dependency), and refuse a dirty tree. This reverses the 2026-08-08 owner ruling that fkit has **both** CI and an in-release gate (architecture.md open question 2; test.yml header lines 9–11), contradicts the gate's documented "IT DOES NOT REQUIRE A CLEAN TREE" contract, and rewrites the four gate-ON tests. **If the owner picks (b), I return for a re-plan before any build.**

### 4. Release test — `test/release/release-summary.test.js` (only if Q2 is not "no"; no new test file, no new case)
Needed because the gate-ON fixtures would otherwise fail on "Missing script":
- `makeFixture()`'s package.json gains `"scripts": { "test:release": "true" }` (plus `"test:prove-red": "true"` under the prove-red option) — so the `other` branch, cut from the initial commit, has it too (0300 switches HEAD to it mid-gate).
- `setTestScript()` writes the same stub(s) beside `test`; the 0300 test's raw package.json write gains them.
- `releaseWithGateOn()`'s recursion guard also checks each stub exists and names no npm/node/release (same reason as SEAL 2).
- Comments lines 46 and 498: `~6-minute gate` → `the test gate`. SEAL 2's comment ("no `test` script") stays true.
- No assertion added or removed except the guard's extension. Not added: an assertion that release.mjs calls the extra script(s) (outside the key list → suggestion only, D2.3); the behaviour is shown by `release:dry` (L5) and a one-off scratch check (L6).

### 5. Docs
- **CONTRIBUTING.md:** Tests block times re-measured (L3, step 7) for local and CI, each lane's when/how long: `npm test` (budget 2 min, CI-enforced), `test:release` (run by `npm run release` unless Q2 "no"; then by hand before a release), `test:prove-red` (nightly 03:17 UTC in CI + by hand; run by the release only under that Q2 option; outside the budget); replace "to be re-measured by `0530`"; CI paragraph names the budget step and `prove-red.yml` with its limits (step 2) and the one-time notification-setting check; drop the ⚠️ "Not all of this is true yet" paragraph (0528 hand-off: last of 0529/0530 drops it); "`npm test` is what CI and `npm run release` always run" and the *What to run* last row's "until `0530` lands…" text updated; tree listing gains `prove-red.yml`.
- **RELEASING.md:** §3 item 3 — drop the "Until task `0530`…" by-hand block; replace with one line on what the release now runs, plus (unless Q2 "also prove-red") "check the last nightly prove-red run is green on the Actions tab; if you changed the launcher or hook files since, run `npm run test:prove-red`". §3 item 5 "still runs the full suite" → "still runs the test gate (about N min)". §4: gate sentence names the scripts; CI paragraph adds the budget and the nightly workflow; `timeout-minutes: 33` → 10. Re-point every `bin/release.mjs:N` and `.github/workflows/test.yml:N` citation to the edited files, each checked against its quoted fragment.
- **architecture.md:** line ~523 "(its nightly CI lane is task 0530's)" → names `prove-red.yml`; CI bullet adds the budget step; in-release gate bullet names the extra script(s).
- **ADRs: not edited** (append-only). Hand-off to the driver for an architect dated note: ADR-057 §D3's "When it runs" note and its "The schedule is not in `0530`'s brief today" bullet, §D4's note ("`bin/release.mjs` still runs only `npm test`"), ADR-026 / ADR-028 "by hand until 0530" notes; and, only if Q3 = 150 s, ADR-057 §D10 ("CI fails the job if it goes over"): "CI threshold set to 150 s by owner ruling <date>" — set before any runner data, so not the §Consequences "raise the budget after a breach" re-raise. Wiki sync → fkit-wiki.

### 6. Local checks (expected times; never the old suite — it no longer exists)
| # | Check | Expected time |
|---|---|---|
| L1 | `ruby -ryaml` parse of both workflow files; `node --check bin/release.mjs` and the test file | < 2 s |
| L2 | Budget logic: the exact `run:` block extracted from test.yml by awk, run with `bash -e` and a PATH-shim `npm` that sleeps: `BUDGET_S=2`, sleep 3 → exit 1 + the `::error` line; sleep 0 → exit 0; shim exits 1 → step fails, no budget line | ~10 s total |
| L3 | Same block with the real `npm`, `BUDGET_S=120`, × 3 — doubles as the three local timings; load1 recorded at each start; wait ≤ 3 min for load1 < 4, else recorded as busy (not idle) | ~3 × 60–90 s + waits ≈ 4–8 min |
| L4 | `npm run test:release` (after the fixture edits; skipped under Q2 "no" — no edit) | ~45 s |
| L5 | `npm run release:dry` — gate runs the chosen scripts, plan printed, nothing touched (`git status` before/after equal); plus `--help` output | ~2–2.5 min (Q2 yes), ~4.5 min (prove-red option), ~1.5 min (no) |
| L6 | One-off scratch fixture (not a test file): copy of release.mjs, package.json `test: "true"`, extra script(s) `"false"`, `--dry-run` → exit 1 naming the failing script | ~2 s |
| L7 | `grep` for `12 min`, `10+ min`, `6-minute`, `5+ minutes`, `33 min`, `timeout-minutes: 33`, `until .0530` over live docs/code (excl. done/, ADRs, reports, wiki) → pasted | < 1 s |
| L8 | `npm run test:prove-red` — only if Q4 = local only (else the runner dispatch replaces it) | ~150 s |
Skipped: a pushed deliberate-slow branch (verification 1 → L2 local proof instead, stated as such).

### 7. Owner-gated CI step (only if Q4 = measure on GitHub; the driver asks the owner at that moment)
The owner commits (0529 + 0530 together) and pushes to `main` (= live to new installs). Then: the push run of `test` (1) + 2 × `workflow_dispatch` of `test` → three runner timings of the budget step; 1 × `workflow_dispatch` of `prove-red` → its runner wall time. Read with `gh run view <id> --json jobs`. Expected: `test` ~1.5–2 min each, `prove-red` ~3–5 min. Then fill CONTRIBUTING's CI times and test.yml's basis comment, and check `BUDGET_S` against the three timings: if any is > 80% of the budget, stop and ask the owner (never raise the budget quietly — ADR-057 re-raise condition). The fill-in is a second small commit, again the owner's call.

### 8. Verification mapping (brief)
V1 → L2 (local, stated); V2 → workflow in file + step 7 dispatch or L8; V3 → L3 + step 7 + L7; V4 → L5 + L6.

## Edge cases / failure modes
- Runner slower than the estimate → budget red on the first push; step 7 catches it before close.
- Second-resolution timing: ±1 s, irrelevant at 120 s.
- A failing test inside the budget step reports the test failure, not the budget; correct.
- Nightly red with Actions notifications off → unnoticed (ADR re-raise condition); owner checks the setting once.
- Fixture `true` stub relies on `sh` (npm's default script shell on macOS/Linux); the release test isn't run on Windows.
- RELEASING line citations drift when release.mjs/test.yml lines move → step 5 re-points all.
- A release on a tree where an extra gate script is red now refuses — intended; `--no-test` skips all.
- ADR-057 §Consequences risk "its next-morning delay lets a role-lock regression reach a release": covered by the RELEASING check-the-nightly line (a remembered hand step), or automatically by Q2's prove-red option.

## Open questions for the owner (plan approval)
- **Q1 Release gate.** (a) `npm run release` keeps running the tests itself — **Rec**. (b) Trust a green CI run instead — needs a re-plan, and reverses the 2026-08-08 ruling that fkit has both CI and a release gate.
- **Q2 What else the release runs.** "Release test too": `npm run release` also runs `npm run test:release` (+~45 s; release ≈ 2–2.5 min) — **Rec**. "Also prove-red": release test plus the four prove-red cases (+~3.5 min total; release ≈ 4.5 min) — no role-lock break can reach a tag before the next nightly run. "No": release test stays by hand.
- **Q3 CI time limit (provisional).** 120 s, same as the Mac rule — **Rec**. 150 s — a CI-only allowance for a slower runner; the ≤ 2 min idle-Mac rule does not change, but ADR-057 §D10 gets a dated note. Either way the number is checked against three runner timings in step 7 (if Q4 allows); above 80% of it → stop and ask you, never raised quietly.
- **Q4 Measure on GitHub.** After build, the driver asks you to commit + push, then runs `test` 3× and `prove-red` 1× on GitHub — **Rec**. Local proof only — then the brief's runner-measured CI number, prove-red's runner time and "three CI runs" stay unmet: the task closes only if you accept that gap or a follow-up task does the measuring, and the budget is never checked on the runner (the first push could go red).
- **One-time check for you (not a question):** github.com/settings/notifications → Actions notifications on, so a red nightly run emails you.
Knock-on of Q1–Q3: none (checked). Q4 local-only: a follow-up measurement task would be new (placement the producer's/your call); no existing task moves sprint or `Depends on:`.
