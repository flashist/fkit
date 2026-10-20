# Worklog — 0529: cut the test suite down to shipped-script behaviour tests

Build worker: `fkit-coder`, spawned by `fkit-sprint-ship-loop` (Sprint 13) under the ADR-055 declared-approval
marker. Approved plan: `plan.md` in this folder (blob `9f9ab9a4692048aca2de64e76baf946a88879a1e`, matched by
`git hash-object` before the build). Owner rulings Q1–Q6 as relayed in the spawn (2026-10-20). Nothing staged,
committed or pushed by this task.

## Step 0 — pre-flight

- `uptime` (2026-10-20 08:34Z): `load averages: 11.33 11.03 10.45`; 14 cores.
- `git status --short`: only `ai-agents/sprints/backlog.md`, `ai-agents/sprints/sprint-13.md`, this folder's
  `brief.md` (modified), the `0528` folder renames (staged by the producer's close), and this folder's untracked
  `plan.md` / `plan-review.md`. **No other task's uncommitted edit under `test/`, `claude/` or `bin/`** → build
  went ahead.

## Per-file table (as approved, owner Q2)

Categories (ADR-057 §D1): 1 launcher / init / hooks; 2 shipped skill executables; 3 repo-only `bin/` tools;
4 wording / shape of prompts and documents under `claude/`; 5 this repo's own content.

| File | Cat | Fate | Reason |
|---|---|---|---|
| `adr-number-uniqueness.test.js` | 5 | deleted | ADR numbers in `ai-agents/`; `/fkit-record-decision` and `/fkit-wiki-lint` keep their own check |
| `adversarial-prompt-path.test.js` | 4 | deleted | wording of the three review skills |
| `asking-the-owner-rule.test.js` | 4 | deleted | wording of role prompts / skills |
| `askuserquestion-marker-hook.test.js` | 1 | kept | hook behaviour |
| `board-archived-id.test.js` | 3 | deleted | `bin/fkit-board.mjs` |
| `board-narrow.test.js` | 3 | deleted | `bin/board-narrow.mjs` |
| `board-reader.test.js` | 3 | deleted | `bin/fkit-board.mjs` |
| `board-root.test.js` | 3 | deleted | `bin/fkit-board.mjs` |
| `carry-check-hook.test.js` | 1 | kept | hook behaviour |
| `closed-rank-immutability.test.js` | 5 | deleted | sprint-board content |
| `code-comment-rule.test.js` | 4 | deleted | prompt wording |
| `converge-contract.test.js` | 1 | kept | init convergence (key list item 4) |
| `coordination-citation-policy.test.js` | 5 | deleted | ADR-057 §D6 |
| `dashboard-contract.test.js` | 2 | kept | `dashboard.sh` (assumption A1) |
| `dual-home-parity.test.js` | 5 | kept — named exception | ADR-057 §D7, owner Q4b; header reworded |
| `init-claude-refresh-guard.test.js` | 1 | kept | init |
| `init-intake-guard.test.js` | 1 | kept | init |
| `launcher-agents-guard.test.js` | 1 | kept | launcher |
| `launcher-contract.test.js` | 1 | kept | launcher argv (key list item 1); M2 / M30 / M31 |
| `mover-exemption-step.test.js` | 4 | deleted | movers' prose; that step removed in step 6 |
| `orphan-cleanup.test.js` | 1 | kept | key list item 4 |
| `plan-review-switch.test.js` | 4 | deleted | prompt wording |
| `reference-integrity.test.js` | 5 | deleted | ADR-057 §D6 |
| `release-summary.test.js` | 3 | **moved** → `test/release/release-summary.test.js`, `npm run test:release` | named exception, own script (§D4 / §D7, owner Q4a (c)) |
| `rules-block-budget.test.js` | 1 | kept | init's `RULES_MAX` guard |
| `shiploop-marker-hook.test.js` | 1 | kept | hook behaviour |
| `skill-frontmatter.test.js` | 4 | deleted | prompt shape |
| `skill-ownership-hook.test.js` | 1 | kept | key list items 2–3; M1 |
| `spawned-write-marker.test.js` | 4 | deleted | prompt wording |
| `sprint-loop-later-sprint-record.test.js` | 4 | deleted | prompt wording |
| `structure-check.test.js` | 2 | kept | heal `check.sh` |
| `structure-manifest.test.js` | 4 | kept — named exception | ADR-057 §D7 ⛔ R1 note; header reworded |
| `structure-notice.test.js` | 1 | kept | launcher |
| `structure-repair.test.js` | 2 | kept | heal `repair.sh` (key list item 4) |
| `structure-spec.test.js` | 4 | deleted | `structure-spec.md` vs scaffold |
| `task-id-uniqueness.test.js` | 5 | kept — named exception | ADR-057 §D7 / §D5, owner Q5 (b); header reworded |
| `throughput-counter.test.js` | 2 | kept | `throughput.mjs` |
| `top-level-doc-links.test.js` | 5 (repo docs) | deleted | not a shipped script, not a named exception |
| `turn-completion-hook.test.js` | 1 | kept | hook behaviour |
| `update-banner.test.js` | 1 | kept | launcher; ADR-057 §D8 / 0526 (A5) |
| `update-reinstall.test.js` | 1 | kept | launcher |
| `wiki-flag-convention.test.js` | 4 | deleted | prompt wording |
| `prove-red.sh` | — | kept, cut to 4 cases | ADR-057 §D3 |
| `harness.mjs` | helper | kept | `liveTaskFolders` export (and its now-unused `statSync` import) removed |
| `link-condition.mjs` | helper | deleted | only users were three deleted tests (grep-confirmed) |
| `dual-home-parity-exceptions.mjs` | helper | kept | used by `dual-home-parity` |
| `fixtures/closed-rank-0174-{before,after}.md` | fixture | deleted (and the empty `test/fixtures/`) | only user `closed-rank-immutability` (grep-confirmed) |

Counts: 19 deleted, 22 kept in `npm test`, 1 moved. Four named exceptions (ADR-057 §D7 + ⛔ R1 note): three in
`npm test`, `release-summary` in `npm run test:release`.

## What each prove-red step runs (verification 4)

Numbers kept (owner Q1): baselines 0b, 0c; mutations M1, M2, M30, M31.

- 0b, 2, 30, 31: `FKIT_LAUNCHER=<copy>/claude/fkit-claude.sh node --test test/launcher-contract.test.js`
  (`run_launcher_suite`)
- 0c, 1: `FKIT_SKILL_OWNERSHIP_HOOK=<copy>/claude/skill-ownership-hook.sh node --test test/skill-ownership-hook.test.js`
  (`run_hook_suite`)

Baseline 0a dropped (it duplicated `npm test`; 0b runs the same file on a copy of the same tree). 0d–0p,
mutations 3–29 and 32–55 and every helper only they used deleted. File: 2533 → 305 lines.

## Checks (step 8) — none ran the old full suite

| # | Check | Result |
|---|---|---|
| C1 | `sh -n test/prove-red.sh`; `bash -n claude/carry-check-hook.sh`; `node --check` on every kept/edited `.js` / `.mjs` | all clean |
| C2 | `npm test` × 3 (+ one re-run each, X5) | **845 tests, 845 pass, 0 fail, every run.** Times and load below. All ≤ 2 min. |
| C3 | `npm run test:release` | 30 tests, 30 pass; **real 46.84 s** (09:03Z, load1 13.59) |
| C4 | `npm run test:prove-red` | `✓ hard gate PASSED`; 0b green, 0c green, 1 / 2 / 30 / 31 each red at its named assertion (the script's own name and narrowness greps); **real 151.63 s** (09:04Z, load1 11.19) |
| C5 | greps | below |
| C6 | `npm run test:docs` | 51 tests, 51 pass; real 0.55 s |
| C7 | `claude/fkit-claude-init.sh .` | exit 0; no tracked file changed |

C2 detail (`/usr/bin/time -p`, `real`; load1 = 1-minute load average at start; 14 cores, so X5's threshold is 7):

| Run | Start (UTC) | load1 at start | real | Re-run (X5) start / load1 | Re-run real |
|---|---|---|---|---|---|
| 1 | 08:49:45 | 14.55 | 84.55 s | 08:52:58 / 16.18 | 88.17 s |
| 2 | 08:54:26 | 19.11 | 88.92 s | 08:57:26 / 10.66 | 87.77 s |
| 3 | 08:58:53 | 16.51 | 86.20 s | 09:01:50 / 10.52 | 77.25 s |

⚠️ **Not idle.** Load never dropped to 7 inside the 90 s wait (the base load before any test was ~11; the suite
itself lifts it). So these are "≤ 2 min under load 10–20", not the idle-Mac figure verification 2 asks for. Slower
than the planning run's 58.5 s (load ~11), same machine.

### C5 greps

Each deleted filename, `link-condition`, `closed-rank-0174`, `test/release-summary`, `test:unit`, `test:docs`, over
the repo minus `done/`, `cancelled/`, `wiki-vault/`, `.git` — files hit per name:

```
adr-number-uniqueness: 10   adversarial-prompt-path: 1   asking-the-owner-rule: 2   board-archived-id: 3
board-narrow.test: 4        board-reader: 12             board-root: 4              closed-rank-immutability: 18
code-comment-rule: 1        coordination-citation-policy: 35   mover-exemption-step: 9   plan-review-switch: 3
reference-integrity: 42     skill-frontmatter: 18        spawned-write-marker: 3    sprint-loop-later-sprint-record: 3
structure-spec.test: 8      top-level-doc-links: 7       wiki-flag-convention: 7    link-condition: 2
closed-rank-0174: 8         test/release-summary: 8      test:unit: 10              test:docs: 13
```

Every hit, by place:
- **Shipped files, docs and code** (`claude/`, `bin/`, `docs/`, `.github/`, `test/`, `README.md`, `RELEASING.md`,
  `CONTRIBUTING.md`, `CLAUDE.md`, `AGENTS.md`, `architecture.md`, `conventions/`, `PROJECT.md`): **no hit** for any
  deleted test, helper, fixture or the old release-test path. Only `test:unit` / `test:docs` remain — in
  `package.json` (the live scripts) and `CONTRIBUTING.md` (describing them). Verification 5 read as "no live
  instruction in shipped files, docs and code" (owner Q6, X3).
- `ai-agents/knowledge-base/decisions/` (11 ADRs) → step 10 list below.
- `ai-agents/knowledge-base/reports/` (13 dated reports) → history, not edited.
- `ai-agents/sprints/backlog.md` (board rows) and `ai-agents/sprints/done/*` → board history / producer's.
- **62 open task folders** (plus this one) → producer's sweep; full list in the hand-off.

`grep -il fourth test/*.test.js test/release/*.test.js` → `test/task-id-uniqueness.test.js` only, line 134: *"a
fourth attempt at correctness"* — unrelated, left as is. No file cites the fourth category as a licence.

`grep -n "release-summary\|prove-red" package.json` → only `"test:prove-red": "bash test/prove-red.sh"` (line 7).
`test` is `node --test test/*.test.js` (line 5) — the shell glob does not reach `test/release/`.

Skipped, with reason: the old full `npm test` (owner: never run it); a CI run (needs a push — owner's call);
`npm run generate:manifest` (no file under `claude/scaffold/` changed).

## Files changed

- **Deleted (22):** the 19 tests in the table, `test/link-condition.mjs`, `test/fixtures/closed-rank-0174-before.md`,
  `test/fixtures/closed-rank-0174-after.md` (and the empty `test/fixtures/`).
- **Moved (1):** `test/release-summary.test.js` → `test/release/release-summary.test.js` (import `../harness.mjs`;
  prove-red comments removed; stale-env warning names `npm run test:release`).
- **Edited — test/:** `prove-red.sh` (rewrite), `harness.mjs`, and comments/headers in `carry-check-hook`,
  `dashboard-contract`, `dual-home-parity`, `launcher-agents-guard`, `structure-check`, `structure-manifest`,
  `structure-notice`, `task-id-uniqueness`, `update-banner`, `update-reinstall`. **No assertion changed.**
- **Edited — claude/:** the four movers; `fkit-record-decision`; `fkit-wiki-lint`; `fkit-stateful-review`;
  `fkit-process-stateful-review`; `fkit-review`; `structure-spec.md`; `carry-check-hook.sh` / `.mjs` (comments).
- **Edited — repo:** `package.json`, `CONTRIBUTING.md`, `RELEASING.md`, `docs/board.md`,
  `.github/workflows/test.yml` (comment only), `bin/fkit-board.mjs`, `bin/generate-structure-manifest.mjs`,
  `bin/release.mjs` (comments only), `ai-agents/knowledge-base/architecture.md`,
  `ai-agents/knowledge-base/conventions/dual-home-parity.md`.

## Not edited (with reason)

- Open backlog briefs naming deleted tests → producer's sweep (owner Q4 / X3; list in hand-off).
- ADRs → step 10 (architect spawn).
- Dated reports, sprint boards, `ai-agents/sprints/done/` → history.
- `ai-agents/wiki-vault/` → fkit-wiki's (sync flagged).
- `bin/release.mjs`'s gate, its help text and its `(10+ min; includes prove-red.sh)` progress line (line 351), and
  the comment at line 334 (*"10+ min separate this gate from `git add -A`"*) → `0530`'s (gate-adjacent; S2 / X2).
  Same for `test/release/release-summary.test.js`'s *"~6-minute gate"* comment (a gate-time fact).
- `.github/workflows/test.yml`'s `timeout-minutes: 33` and nightly schedule → `0530`'s.
- `claude/skills/fkit-status/dashboard.sh`'s prove-red-thesis comment (still true) and `throughput.mjs`'s prove-red
  data row (history, §D9).
- Dead test seams (`FKIT_BANNER_ROOT`, `FKIT_REINSTALL_ROOT`, `FKIT_PARITY_SCAFFOLD_ROOT`, `FKIT_RELEASE_MJS`,
  `FKIT_CARRY_CHECK_HOOK`, the marker-hook seams, the dashboard copied-tree skip): code kept (A3); comments no
  longer name deleted cases.
- `architecture.md` line 61 cites `package.json:3-9` for the scripts block — already stale before this task (the
  block is now lines 4–17). Outside the plan's named fixes; flagged, not changed.

## Decision log (unattended choices, ADR-019 §Decision 4)

1. **`fkit-process-stateful-review` edit — cover.** ADR-019 calls that file byte-unchanged. The edit (dropping the
   `coordination-citation-policy` sentence and the "Backticks do not exempt it" clause from the *Location* note) is
   covered by the owner's ADR-057 sign-off: its §D9 row assigns this file to `0528` / `0529`. It touches only that
   note, not the per-round approval gate. (`0528`'s Q3 ruling named `0528` only, hence this record.)
2. **S1 — obvious winner.** Finding: `dashboard-contract` reads the live `ai-agents/sprints/done/` boards, so "only
   the two named exceptions read the live tree" would be false. Options: add `dashboard-contract` to `test:docs`, or
   drop the wording and route `ai-agents/` edits to `npm test`. Chose the second: `test:docs` stays the < 1 s fast
   path the 7 open briefs use (adding a 4,500-line suite would make it most of `npm test`); `CONTRIBUTING.md` now
   says `test:docs` runs only the two exceptions and is not a replacement for `npm test`, and its *What to run* row
   for `ai-agents/` says `npm test`. In-plan (owner Q6 named both options).
3. **"Heaviest row" bullet reworded — obvious winner.** The plan kept *"run the heaviest row it touches (the lowest
   in the table)"*. In the new table the two extra lanes (`test:release`, `test:prove-red`) are not nested, so "the
   lowest row" no longer covers the others. Reworded to *"run what every row it touches asks for"* — same intent.
4. **Re-pointed cites my edits made wrong** (code-comment rule / S2): `RELEASING.md`'s
   `test/structure-manifest.test.js:115` → `:112` (header shrank 3 lines); `.github/workflows/test.yml:47-51` →
   `:49-53` and `:42` → `:44` (comment grew 2 lines). `bin/generate-structure-manifest.mjs`'s edit kept its line
   count so `RELEASING.md`'s cites into it (`:259-296` etc.) stay right.
5. **S3:** `structure-check.test.js:52` named `skill-frontmatter.test.js` → *"(non-vacuity)"*.
6. **S4:** prove-red's closing line → *"✓ hard gate PASSED — unmutated copies green; each mutation reds its NAMED
   assertion."*
7. **X5:** every C2 run started above load 7, so each got one re-run after a ≤ 90 s wait; load never fell to 7.
   Both figures reported.
8. **`dashboard-contract.test.js:4233` label** `⚠️ PROVE-RED:` → `⚠️ RED-FIRST:` — it describes red-first on the
   old script, not `prove-red.sh`; left as "PROVE-RED" it reads as a deleted case.
9. **Staging slip, undone.** `git mv` staged the release-test move; `git restore --staged` on both paths unstaged
   it. This task stages nothing. (The `0528` renames in the index predate this build.)

No other fix or obvious-winner call was made.

### Review round 1 — Process-review worker, 2026-10-20 (`review.md` R1–R3)

Each fix below was applied without per-fix owner approval under the sprint loop's standing approval.

10. **R1** (`fkit-wiki-lint` *Case-insensitive* paragraph names `parseAdrFilename`, a function only in the deleted
    `test/adr-number-uniqueness.test.js`, and says "any of the four"). Changed: dropped *"and `parseAdrFilename`
    (`/…/i`)"*; *"any of the four"* → *"any of the three that remain (those two steps and this one)"*. The history
    sentences ("asserted the three agreed", "a fourth site") stay — they are past events. Qualified: verified
    `CORRECT` (grep: no other `parseAdrFilename` outside done/cancelled/wiki), mechanical wording, in plan step 6
    (drop the deleted test from `fkit-wiki-lint`). `.claude/` copy refreshed by `claude/fkit-claude-init.sh .`.
11. **R2** (`CONTRIBUTING.md` prove-red grep bullet disagreed with the table's prove-red row). Changed: the bullet now
    asks what prove-red *mutates or runs* (its `--- Mutation` blocks and `run_*_suite` helpers) = the table row; it
    says the raw grep also hits `fkit-claude-init.sh`, `structure-spec.md`, `check.sh` in comments only, and that
    `npm test` already runs those through the real launcher (`claude/fkit-claude.sh:295` runs init; `:365` runs
    heal's `check.sh`), so they stay in the "Anything else" row; plus one line: prove-red copies `claude/` alone,
    so a change making `claude/` read outside it can red baseline 0b. Qualified: verified `CORRECT` (the two
    disagreed); obvious winner within intent — plan step 7 approved the table row and said the bullet becomes "its
    short list today"; making the bullet match the approved table, rather than widening the table, stays in plan.
12. **R3** (ADR-057 §D3 dated note quoted the owner's Q1 short). Changed: question → *"Q1 — Prove-red case
    numbers?"*; description → *"Fewest edits; ADR-057 gets a dated note. Knock-on: none (checked)."* — both now
    match `plan-review.md` § Attempt 1. Qualified: verified `CORRECT`, mechanical quote fix to this task's own
    uncommitted note; the driver's spawn named this fix. The one ADR text I touched — a quote correction, not a new
    note (step 10's "I write no ADR" is about writing notes).

Checks after the round: `npm test` 845/845 pass, 73.9 s (`/usr/bin/time` real; 2026-10-20 09:43Z, load 10.09) —
an earlier run the same minute took 78.2 s, its summary lines not captured; `npm run test:docs` 51/51. Skipped:
`test:prove-red` and `test:release` (no file in their rows touched).

## ADR list for step 10 (architect spawn — I write no ADR)

§D11 sweep re-run 2026-10-20: strict = `test/<name>`, loose = the name without `test/`.

| ADR | Deleted test / case / move it names | Lines |
|---|---|---|
| ADR-014 | *"the three tests ADR-057 §D7 names"* — four since the ⛔ R1 note | 92 |
| ADR-026 | its dated note says `npm test` runs `bash test/prove-red.sh` (55 cases) — now out of `npm test`, 4 cases, by hand until `0530` | ~100–106 |
| ADR-027 | `dual-home-parity`'s mutations 10–13 deleted (ADR text names only "the shift ADR-026 Decision 4 makes for `prove-red.sh`") — architect's call whether a note is owed | 114 |
| ADR-028 | *"wiring `prove-red.sh` into an automated gate (ADR-026 Decision 4 — still …"* — no automated gate runs it until `0530` | 89–90 |
| ADR-035 | `closed-rank-immutability` (strict) | 160 |
| ADR-036 | `skill-frontmatter` (strict) | 217, 330 |
| ADR-042 | `closed-rank-0174` fixture (loose); `test/prove-red.sh` opening with `mktemp -d` (lines 33, 313) — still true | 377 |
| ADR-043 | `structure-spec.test.js` (strict) | 129, 224 |
| ADR-046 | `closed-rank-immutability` (strict); prove-red "gains no mutation" (311–313) — still true | 38, 101, 225, 295 |
| ADR-047 | `coordination-citation-policy` (strict) 496, 1302; `reference-integrity` (strict) 1274, 1301 | — |
| ADR-048 | `reference-integrity` (strict) 149, 199; (loose) 549 | — |
| ADR-050 | `mover-exemption-step` (strict) | 115, 255, 540, 684 |
| ADR-051 | `board-reader` (loose) | 815 |
| ADR-052 | `reference-integrity` (loose) | 280 |
| ADR-057 | `release-summary` now at `test/release/release-summary.test.js`, run by `npm run test:release` (strict 146, 292, 297, 352; loose 121); §D3 *"`0529` renumbers if it rewrites the file"* (251) — numbers kept, owner Q1; plus its many strict cites of the deleted tests (§D1 list 170–180, §D6, §D9, §D11) — architect decides which need a note | see col. 2 |

**Pending (X4):** after the architect returns, append "which ADRs got a note and which test each covers" here.
Not done in this build — the driver re-spawns a worker for it.

## Hand-off

- **`0530`:** the gap — CI and `npm run release` run only `npm test`, so until `0530` lands no automated gate runs
  prove-red or the release test (RELEASING.md §3 tells the releaser to run both by hand). `bin/release.mjs:351`'s
  `(10+ min; includes prove-red.sh)` line is **false from this build**, and its help text; the line-334 comment
  (*"10+ min separate this gate"*) and `release-summary`'s *"~6-minute gate"* comment; `test.yml`'s timeout and basis (comment now says it was measured with prove-red in);
  CONTRIBUTING's times and its last ⚠️ paragraph; RELEASING's by-hand block (drop both when `0530` lands).
  `0530`'s brief names the old release-test path `test/release-summary.test.js` → now `test/release/…`.
- **Producer:**
  - Owner Q4 ruling: "Producer's proposals (Recommended)" — act after `0529` closes (cancel `0503`, `0522`, `0037`,
    `0214`, `0152`, `0219`; rescope `0513`–`0515`; bring `0512`, `0156`, `0406` back to the owner).
  - **Open task folders naming a deleted test, `test:unit` or `test:docs` (62, plus `0529`)** — for a sweep:
    0152, 0165, 0166, 0179, 0192, 0209, 0224, 0225, 0228, 0240, 0273, 0290, 0298, 0311, 0322, 0326, 0345, 0370,
    0371, 0374, 0377, 0378, 0380, 0382, 0383, 0386, 0387, 0391, 0394, 0396, 0397, 0398, 0399, 0400, 0401, 0402,
    0403, 0405 (brief, plan, worklog, captures/), 0407, 0410, 0448, 0449, 0454, 0459, 0465, 0467, 0474, 0485,
    0487, 0491, 0503 (brief, plan, plan-review, worklog), 0509, 0511, 0512, 0513, 0514, 0515, 0517, 0518, 0522,
    0525, 0530. `test:docs` still exists (now two files), so briefs that only run `npm run test:docs` still work.
  - `ai-agents/sprints/backlog.md` rows name deleted tests (history rows; producer's call).
  - **Wiki sync** for the deleted tests, the moved release test and the new `npm test` (fkit-wiki).
- **Optional, not this task:** ADR-057 §D3's "not in `0530`'s brief today" drift (0528 hand-off).

## Step 10 — ADR drift notes (architect, 2026-10-20)

X4, done under owner Q6 *"Fold in small fixes (Recommended)"* (2026-10-20). The architect's report, copied as the
driver relayed it:

Architect's report — 13 ADRs, 37 insertions, all ⚠️, all append-only (numstat N 0; deletion filter empty; snapshot diff 0 `<` lines); links checked by hand; `npm run test:docs` 51/51.

| ADR | Note | Deleted test / case it covers | Line(s) |
|---|---|---|---|
| ADR-014 | ⚠️ + header extended | ⛔ §2 notice: "three tests ADR-057 §D7 names" → four (R1); "42 files… the cut is 0529's" → done, 22 left + `test/release/` | hdr L14; note L106 |
| ADR-026 | ⚠️ ×2 + header extended | prove-red: out of `npm test`, cut from 55 to M1/M2/M30/M31 + 0b/0c, no automated gate until 0530 (note under Decision 4); a pointer under the 2026-10-14 §Context note | hdr L23; L84 (pointer); L125 (fact) |
| ADR-027 | none (architect's call) | names no deleted case; L114 is a general comparison, and its parity test stays (§D7) | — |
| ADR-028 | ⚠️ + header extended | Decision 7: the CI piece has landed; prove-red is back to by-hand until 0530. Points to ADR-026 | hdr L15; L99 |
| ADR-035 | ⚠️ + new header | `closed-rank-immutability.test.js` (built 2026-08-06, now deleted) | hdr L11; L169 |
| ADR-036 | ⚠️ + new header | `skill-frontmatter.test.js` (both mentions, which are dated 2026-08-02 measurements) | hdr L47; L347 |
| ADR-042 | ⚠️ at end of file, no header bullet | the `closed-rank-0174` fixtures; the `mktemp -d` cites are still true | L419 |
| ADR-043 | ⚠️ + pointer + new header | `structure-spec.test.js`: cost 4 is gone; the rejection stands on costs 1–3 | hdr L8; L139; L244 |
| ADR-046 | ⚠️ fact + 2 pointers + 4th header pass | `closed-rank-immutability.test.js` + fixtures: the rule stands, nothing executes it | hdr L29; L209 (table pointer); L288 (fact); L324 (Site A pointer) |
| ADR-047 | ⚠️ ×2 + pointer + new header | `coordination-citation-policy` (FOLLOW-UP 1 was done; the guard is gone); `reference-integrity` (authoring constraint 1); §Related pointer | hdr L44; L511; L1298; L1328 |
| ADR-048 | ⚠️ + new header | `reference-integrity`: "Still run", must-never 9, C8 (the ADR is already obsolete under ADR-052) | hdr L31; L159 |
| ADR-050 | ⚠️ + pointer + new header | `mover-exemption-step` + `reference-integrity` `NAMED_EXEMPT` | hdr L23; L276; L559 |
| ADR-051 | none | L815's hit is a task-folder name, not the test | — |
| ADR-052 | ⚠️ ×2 + new header | D8 item 7, "reference-integrity test green": can't be met as written; D9 phase 8, "and their tests": the 4 board tests are gone | hdr L31; L288; L324 |
| ADR-057 | ⚠️ ×4 + pointer + header extended | §D3 numbers kept (owner Q1 quoted verbatim); §D3 "when it runs": no gate until 0530; §D4 release test moved to `test/release/…` via `npm run test:release`; §D7 pointer; §D11: the notes are written | hdr L55; L273; L287; L331; L415; L516 |

ADR-057 §D1, §D6, §D9: no notes (dated counts or worklists 0529 has now carried out). Note: 0529's own plan/plan-review cite "ADR-014:92", now at L97 — those are this step's used-up pointers; not edited.

- **Two open owner questions raised by the architect:** (1) ADR-052 D8 item 7 names the deleted
  `reference-integrity` test as an acceptance check, so it cannot be met as written; (2) ADR-028 Decision 7 —
  does prove-red being by-hand until `0530` change what the tester role waits behind?
- **ADR-042 placement departure:** its note sits at the end of the file with no header bullet, so the line cites
  in `0394` / `0278` into ADR-042 still land.
- **Hand-off — wiki:** these 13 ADRs (014, 026, 028, 035, 036, 042, 043, 046, 047, 048, 050, 052, 057) need a
  fkit-wiki re-ingest.
