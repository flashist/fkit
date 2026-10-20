# Worklog — 0530: enforce the two-minute test budget in CI and settle the release gate

Build worker: `fkit-coder`, spawned by `fkit-sprint-ship-loop` (Sprint 13) under the ADR-055 declared-approval
marker. Approved plan: `plan.md` in this folder (blob `aef841177d2f6c22f4d438f0409919b73140da3d`, matched by
`git hash-object` before the build). Owner rulings relayed in the spawn (2026-10-20): Q1 (a), Q2 "Release test
too", Q3 `BUDGET_S: 120`, Q4 "measure on GitHub" (step 7 is the driver's, not this build's), Q5 fold in X1, X2,
C1, C3, C4 (X3 not added). Steps 1–6 built. Nothing staged, committed or pushed; no workflow triggered.

## Step 0 — pre-flight

- `git status --short` at start: only this folder's untracked `plan.md` / `plan-review.md`.
- ⚠️ **Plan fact out of date:** the plan (and the spawn) say 0529's cut is uncommitted. It is not — it was
  committed in `f92ddff` ("Sprint push") and that is `origin/main`. Its push run of `test` exists:
  run `39406193972` (2026-10-20, success), `Run npm test` step 10:11:51 → 10:13:03 = **72 s**, whole job 79 s
  (read-only `gh run view --json jobs`). That is one post-cut runner timing; it is written into `test.yml`'s
  basis comment and `CONTRIBUTING.md` as 1 of 3, the other two marked PENDING (step 7). Step 7 now commits
  only 0530's files.

## Change surface

| File | Change |
|---|---|
| `.github/workflows/test.yml` | `- run: npm test` → timed budget step (`BUDGET_S: 120`, ms timing, `::error` naming budget + time); `timeout-minutes: 33` → `10`; basis comment rewritten (old-suite 76.4 s, post-cut 72 s, two PENDING) |
| `.github/workflows/prove-red.yml` | **new** — nightly `cron: '17 3 * * *'` + `workflow_dispatch`, `npm run test:prove-red`, `timeout-minutes: 15`, `fetch-depth: 0` |
| `bin/release.mjs` | gate runs `npm test` then `npm run test:release`, first red stops; HEAD check after each script (C1); header, help and comment times → "about 2 min" |
| `test/release/release-summary.test.js` | fixtures carry a `test:release: "true"` stub (makeFixture, setTestScript, 0300's raw write); `releaseWithGateOn()` guard checks both scripts; two `~6-minute gate` comments |
| `RELEASING.md` | §3 item 3 rewritten (release runs both; check-the-nightly line naming all six files, X2); §3 item 5; §4 gate sentence, "Before the test gate starts" (C4), CI paragraph (budget, nightly, `timeout-minutes: 10`); all 11 `bin/release.mjs:N` + `:N` shorthands and 4 `test.yml:N` citations re-pointed (C3) |
| `CONTRIBUTING.md` | Tests block times + when-each-runs list; CI paragraph (budget step, runner time, prove-red.yml + limits + notification check); ⚠️ "Not all of this is true yet" paragraph dropped; *What to run* lead line and last row; tree listing gains `prove-red.yml` |
| `ai-agents/knowledge-base/architecture.md` | §9.1: prove-red's nightly lane named; CI budget step; in-release gate names both scripts |

## Decision log (autonomous choices under the standing approval)

- **X1 — strict budget check → millisecond timing, `-gt` on ms.** Finding: second-resolution `-gt` let a run
  up to ~120.99 s pass. Chosen: `node -p 'Date.now()'` before and after (node is on the runner via setup-node and
  on every dev machine; `date +%s%N` is GNU-only and macOS bash 3.2 has no `EPOCHREALTIME`), fail if
  `took_ms > BUDGET_S*1000`. Rejected `-ge` on seconds: it fails some runs under budget (floor of both ends).
  Side effect, stated: the measured time includes one `node` exit + one `node` start (~50 ms idle, up to ~0.5 s
  under load 12) — errs toward failing. Qualified: verified-CORRECT finding, owner-approved (Q5), localized to the
  one step.
- **C1 — HEAD-moved wording → per-script attribution, not a reworded constant.** Finding: `(during npm test)`
  would be wrong if HEAD moved during `npm run test:release`. Chosen: the HEAD compare became
  `refuseIfHeadMoved(during)`; `runTests()` calls it after each green script with that script's name, and the
  old post-gate site calls it with `null` (covers `--no-test` and the gap after the last check). Result: the
  message names the script that moved HEAD, the next script never runs on another branch's tree, and 0300's
  regex `\(during npm test\)` stays green **unchanged** (no assertion added or edited). Rejected: `(during the
  test gate)` + a regex edit — less precise and touches the test. Qualified: owner-approved fix (Q5), inside
  `bin/release.mjs`'s gate, keeps the test green as the ruling preferred.
- **X2 — RELEASING's check-the-nightly line names all six prove-red files** (`claude/fkit-claude.sh`,
  `claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh`, `test/launcher-contract.test.js`,
  `test/skill-ownership-hook.test.js`, `test/prove-red.sh`). Qualified: owner-approved text (Q5).
- **C3 — 11 `bin/release.mjs:N` citations**, re-pointed with the three `:N` shorthands; each checked against
  its quoted fragment with `sed -n` (see L-checks). Qualified: owner-approved (Q5), mechanical.
- **C4 — both "`npm test`-only" lines in RELEASING rewritten** (§3 item 3 paragraph; §4 "Before the test gate
  starts"). Qualified: owner-approved (Q5), mechanical.
- **Obvious winner — recorded the already-existing post-cut runner timing (72 s, run 39406193972)** in the
  `test.yml` basis comment and CONTRIBUTING, with the other two marked PENDING step 7, instead of a bare
  placeholder. A measured fact the plan expected to read at step 7; keeps the owner's "clearly marked as pending"
  ruling.
- **Obvious winner — `test:release` stub written in `makeFixture()`'s initial commit**, so the `other` branch
  (cut from it) carries it — as the plan said; noted because 0300 now also runs `test:release` on `other`'s tree
  only if HEAD did not move (it did, so it stops after `npm test`).
- **Review round 1, R1 (nit) — test 0300's title and comment re-worded.** Finding: title said "refused after the
  gate" and comment "re-reads HEAD after the gate"; since C1 the refusal comes straight after `npm test`, before
  `npm run test:release`. Changed (test/release/release-summary.test.js, 0300 only): title → "refused straight after
  npm test, before test:release and any write"; comment → "re-reads HEAD after each gate script". No assertion
  touched. Qualified: verified-CORRECT, wording only (mechanical, one test), inside the approved plan (Q5 "Fold in
  small fixes"; the project rule: fix a comment your change makes wrong). Checked: `npm run test:release` 30/30,
  49.9 s. Not done: the reviewer's suggestions (not-ran assertion, X3, RELEASING §5 line) — not defects, and a new
  assertion needs the owner's OK (ADR-057 D2). No obvious-winner call this round.
- **Not done (outside the plan):** no `CHANGELOG.md` entry (CI and the release tool are maintainer-only, not
  user-facing; the plan names none); no `RELEASING.md` §5 bullet for "the release does not run prove-red" (§3 says
  it).

## L-checks (2026-10-20, busy Apple M4 Pro, 14 cores)

| # | Result |
|---|---|
| L1 | `ruby -ryaml` parses both workflows (test: push/pull_request/workflow_dispatch, `timeout-minutes` 10, `BUDGET_S` 120; prove-red: schedule/workflow_dispatch); awk-extracted `run:` block == YAML-parsed `run` (identical); `node --check` on `bin/release.mjs` and the test file: OK |
| L2 | Exact block, `bash --noprofile --norc -eo pipefail`, PATH-shim `npm`: budget 2 / sleep 3 → exit 1 + `::error … 3.494 s, over the 2 s budget`; sleep 0 → exit 0; shim exit 1 → exit 1, no budget line; **X1** sleep 2.05 → exit 1 (2.114 s); sleep 1.85 → exit 0 (1.900 s) |
| L3 | Real `npm test` through the block, `BUDGET_S=120`, 845/845 pass each: **76.216 s** (load1 7.00), **82.163 s** (11.46), **76.207 s** (11.17). Waited the full 180 s each time; load1 never < 4 → **BUSY, not idle-Mac figures** |
| L4 | `npm run test:release`: 30/30 pass, 46 s (load1 12.36) |
| L5 | `npm run release:dry`: exit 0, 164 s (load1 12.16) — `npm test` 845/845 (92.5 s), `test:release` 30/30 (69.9 s), plan printed, `git status --porcelain` before == after. `--help` shows the new gate paragraph. ⚠️ 164 s > the "about 2 min" text under this load |
| L6 | Scratch fixtures (not test files): test `true` / test:release `false` → exit 1 `npm run test:release failed (exit 1)`; test `false` → `npm test failed`, test:release never ran; HEAD switched during test:release → `(during npm run test:release)`; during npm test → `(during npm test)`, test:release never ran; both green → `✓ npm test and npm run test:release green`, dry run |
| L7 | `grep -rnE "12 min\|10\+ min\|6-minute\|5\+ minutes\|33 min\|timeout-minutes: 33\|until .0530"` over the repo minus `.git`, `.claude`, `ai-agents/tasks`, `ai-agents/sprints`, decisions, reports, wiki-vault → **no hits** (exit 1). Hits remain only in records: task briefs/plans (0515's brief line 93, this task's brief/plan, cancelled 0503) and the wiki (sync) |
| L8 | Skipped by owner ruling (Q4): the step-7 runner dispatch of `prove-red` replaces it |

## Hand-off

- **Step 7 — PENDING, the driver's** (owner commits + pushes 0530; 0529 is already on `origin/main`):
  - after the push: `gh run list --workflow test.yml --limit 1 --json databaseId,headSha,conclusion`
  - `gh workflow run test.yml --ref main` (×2), `gh workflow run prove-red.yml --ref main` (×1)
  - each: `gh run watch <id>`, then `gh run view <id> --json jobs --jq '.jobs[].steps[] | {name,startedAt,completedAt,conclusion}'`
    and the step log line `npm test took … s (budget 120 s)` via `gh run view <id> --log | grep 'npm test took'`
  - fill: `test.yml` basis comment (lines 30–32), `CONTRIBUTING.md` CI sentence, `prove-red.yml`'s
    `timeout-minutes` comment; if any budget-step time > 96 s (80% of 120) → stop and ask the owner.
- **Owner one-time check:** github.com/settings/notifications → Actions notifications on.
- **Architect dated notes (ADRs are append-only; not edited here):** ADR-057 §D3 "When it runs" note and its
  "The schedule is not in `0530`'s brief today" bullet; §D4's note ("`bin/release.mjs` still runs only
  `npm test`"); ADR-026 / ADR-028 "by hand until 0530" notes. No §D10 note (Q3 = 120 s).
- **Wiki sync → fkit-wiki:** `wiki/systems/testing-and-verification` and task pages still carry old times
  (`~12 min`, `33 min`, `~6-minute gate`).
- **Producer FYI:** `0515`'s brief line 93 says 0530 owns release-summary's `~6-minute gate` comment — done here.
