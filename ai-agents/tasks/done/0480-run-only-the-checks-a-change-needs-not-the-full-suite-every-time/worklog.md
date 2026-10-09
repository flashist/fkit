# Worklog — 0480 Run only the checks a change needs, not the full suite every time

Build step, spawned `fkit-coder` under `fkit-sprint-ship-loop` (Sprint 10), 2026-10-04.
Approved plan: `plan.md` in this folder (blob `26f25fb3bf87147313170f4961a80db22f55cfcd`, 17749 bytes;
hash re-checked at the start of Build — it matches). `plan.md` was not edited.

## Owner rulings on the plan's open questions (2026-10-04, `AskUserQuestion` in the lead session)

The plan's §8 is left blank on purpose (approved bytes are never edited); the rulings live here.

- **OQ1 — CI path filters on docs-only pushes:** keep CI running everything. No path filters, no
  follow-up task. `.github/` not touched.
- **OQ2 — what `test:docs` contains:** every test file that reads the live `ai-agents/` tree — the 10
  files in plan Step 2 (~28 s).
- **OQ3 — a link check for the root docs:** file a follow-up. The driver has the producer file it after
  Build; this worker did not file it. In `CONTRIBUTING.md`'s table the README row stays "nothing".

## Owner rulings on review round 1 (2026-10-05, `AskUserQuestion` in the lead session)

`plan.md` is not edited; these rulings authorize table changes that differ from the plan's §2 table.

- **R1 → "Nothing, except schema.md":** `ai-agents/wiki-vault/` stays in the "nothing" row; only
  `ai-agents/wiki-vault/schema.md` moves to the `test:docs` row. The "Why" text must be literally true.
- **R2:** reword so a mixed change runs the heaviest applicable row (the lowest in the table).
- **R3 → "Add them to test:unit now":** `CLAUDE.md` and `AGENTS.md` join the `test:unit` row. No ruling
  on `install.sh` / `VERSION` / `nginx.conf`: left as they are (fall to "unsure → `npm test`").
- The stale cite `fkit-task-ship-loop/SKILL.md` → `fkit-coder.md:109-113` is out of 0480's scope; it is
  in task 0472's brief now. Not touched.
- Earlier rulings stand: OQ1 CI unchanged; OQ2 `test:docs` = the 10 live-tree files; OQ3 the root-docs
  link check is task 0484.

## Step 1 — Measurements

### From the Plan step (copied from plan §1)

Machine: Apple M4 Pro, 14 cores, 48 GB, macOS (Darwin 25.2.0), node v24.13.0. Scratch copy of the
working tree; machine **not idle** (load average 4–9 from other sessions).

| What | Runs | Wall time | Tests |
|---|---|---|---|
| `npm run test:unit` | 2 | 55 s, 56 s | 1017 / 1017 pass |
| `npm run test:prove-red` | 1 | 651 s (hard gate PASSED) | 55 steps |
| prove-red, from 0477's Build worklog (not quiet) | 2 | 705 s, 732 s | — |
| `npm test` total (derived) | — | ≈ 706 s ≈ 12 min | — |
| `test:docs` candidate, 10 files | 2 | 27.7 s, 27.8 s | 372 |
| same, without `dashboard-contract` (9 files) | 2 | 19.6 s, 19.5 s | 183 |
| only the 6 content guards | 2 | 1.7 s, 1.7 s | 147 |
| CI, ubuntu runner (`gh run list --workflow test.yml`) | 11 runs, 2026-10-02 | 7.4–10.9 min, all success | — |

### Re-read of `gh run list` (Build, 2026-10-04 ~18:25 local)

Last 20 runs of `test.yml` (2026-09-15 → 2026-10-02): **5.8–10.9 min, all `success`**. Longest:
10.9 min (2026-10-02 08:32Z). **No run is near the 20-min timeout — the brief's stop condition does not
fire.** Continued.

### Build-step runs (this change's smoke check)

Machine as above. Each run in its own scratch copy of the working tree (nothing else writing to that
copy). Machine load: see each row.

| What | Wall time | Result | Load average at start |
|---|---|---|---|
| `npm run test:docs` (10 files) | 45 s (node's own `duration_ms` 41.2 s) | 372 / 372 pass | 6.54 — **prove-red was running in the other scratch copy at the same time**, so this is a loaded figure, not comparable to the 27.7 s above |
| `npm run test:unit` | 115 s | 1017 / 1017 pass | 4.38 — **overlapped `test:docs` above** for ~45 s, so loaded |
| `npm run test:prove-red` | 923 s | hard gate PASSED, 55 steps | 6.87 at start, 5.31 at end (other sessions) |

The `npm test` figure is the two halves above run back to back (the same commands `npm test` chains
with `&&`; unit passed, so the chain would have run prove-red too): ≈ 1038 s ≈ 17 min on a busier
machine than the Plan step's — slower than the plan's ≈ 12 min, which fits the "machine load makes each
run slower" point in the plan's summary. These are **not** quiet-machine figures. The Verify step's own full `npm test` run on a quiet copy is the second prove-red figure the
plan asks for; it is not recorded here.

## What was built (plan Steps 2–5)

- `package.json` — one line, `test:docs`, inserted after `test:prove-red`. `"test"` stays on line 5
  (the `RELEASING.md:130` cite still lands). `JSON.stringify(pkg, null, 2)` round-trips the file
  byte-for-byte, so a release bump makes no other diff.
- `CONTRIBUTING.md` "Tests" — `test:docs` added to the command block; `~6 min` corrected to the measured
  figures (`npm test` ~12 min, unit ~1 min, prove-red ~11 min, docs ~30 s) with a "machine-dependent"
  line; new `### What to run for a change` subsection (the table, the highest-row rule, the
  skipped-is-not-passed report rule, the `grep -F` check, the "new live-tree test joins `test:docs`"
  note). 0477's "On a red …" line kept.
- Shipped rule, standing on its own at each site:
  - `claude/agents/fkit-coder.md` — "Test your changes" bullet rewritten in place (full form).
  - `claude/skills/fkit-plan-task/SKILL.md` — "testing and validation steps" bullet (plan-adapted S).
  - `claude/skills/fkit-task-ship-loop/SKILL.md` — step 5 (S replaces the ADR-014 clause) and the
    evidence packet's "commands + pass/fail, and which checks were skipped and why".
  - `claude/skills/fkit-sprint-ship-loop/SKILL.md` — the Verify row only (S + "return pass/fail +
    which checks ran and which were skipped (why) + diagnosis"). Nothing else in that file changed.
  - `claude/skills/fkit-review/SKILL.md` — the "run the relevant check yourself" sentence extended.
- `.claude/` refreshed with `claude/fkit-claude-init.sh .` (exit 0); all five edited files `diff`-match
  their `.claude/` copies.

## Static checks run at Build

- `grep -n "a skipped check is not a passed one"` hits `fkit-coder.md`, `fkit-plan-task`,
  `fkit-task-ship-loop`, `fkit-sprint-ship-loop` and `CONTRIBUTING.md`; `grep -n "the checks the change
  needs"` hits `fkit-review/SKILL.md`.
- `git diff --quiet -- CLAUDE.md claude/scaffold/universal-rules.md` → exit 0.
- `git diff --stat -- .github bin` → empty.
- No absolute machine path in any changed file (the plan's Verification 5 `grep -nE` pattern finds
  nothing).
- Line cites from `claude/` into the edited files still land: `fkit-task-ship-loop/SKILL.md:90` →
  `fkit-coder.md:28-33`; the cite to `fkit-coder.md:109-113` (now at `fkit-task-ship-loop/SKILL.md:162`,
  was `:160` — the citing line moved down 2, its target did not); `fkit-sprint-ship-loop/SKILL.md:41`
  → `fkit-task-ship-loop/SKILL.md:8-18`.

## Noticed, not fixed (out of plan)

- Open brief `0169` cites `fkit-task-ship-loop/SKILL.md:160-161`, `:257`, `:261`. Those cites were
  **already stale at HEAD** (`:160-161` was the step-6 STOP block, not step 7's close bar), so the +2
  shift from step 5's edit breaks nothing that worked. 0169 must re-locate its sites by text, as its
  brief already says it re-confirms coordinates.
- Many line cites in `ai-agents/knowledge-base/reports/` and `ai-agents/sprints/backlog.md` point into
  the edited files below the edit points; they are historical prose, and the ones checked were already
  stale. Untouched, as the plan's Risks section scopes.

## Decision log (autonomous calls)

- **D1 — `test:docs` time in the `CONTRIBUTING.md` table written as "~30 s", not "~28 s".** Answers no
  review finding (Build). What changed: the table's `test:docs` row says ~30 s. Why it qualified
  (obvious winner within the plan's intent): the plan is internally inconsistent — §2's table says
  ~28 s, Step 3 says "docs ~30 s" for the command block. Using one figure in one file keeps
  `CONTRIBUTING.md` self-consistent; both are roundings of the same 27.7 s measurement.
- **D2 — fixed phrase kept on one line.** What changed: in `fkit-coder.md` and `fkit-plan-task`, the
  line wrap was moved so "a skipped check is not a passed one" sits on one physical line. Why it
  qualified (mechanical, in-plan): the plan's own Verification 2 greps for that phrase line-by-line, and
  Risks says the shared phrase exists so a grep finds every copy.
- **D3 — `CONTRIBUTING.md` command-block comments.** What changed: each script's comment carries its
  time (`~12 min`, `~1 min`, `~11 min`, `~30 s`), plus one line saying the times come from a busy Apple
  M4 Pro (2026-10) and will differ. Why it qualified (mechanical, in-plan): plan Step 3 asks for exactly
  these figures and "say the figures are machine-dependent"; the placement is wording only.
- No review-fix was applied (Build step; no review yet).
- **D4 — R1 fix (Process-review, round 1).** Answers R1. What changed: `CONTRIBUTING.md` table row 1
  now reads `ai-agents/wiki-vault/` (except `schema.md`), its Why "No test reads their contents.
  `reference-integrity` scans `ai-agents/` minus the wiki vault; in the vault, `dual-home-parity` only
  checks which files sit outside `wiki/`."; row 2 now starts with `ai-agents/wiki-vault/schema.md` and
  its Why notes `schema.md` is dual-homed and must match its scaffold copy byte for byte. Why it
  qualified: verified `CORRECT` (schema.md is the only vault file whose content `dual-home-parity`
  compares — `wiki/` is excepted, `index.md`/`log.md` are placeholders), mechanical/localized (one
  table, two cells), and inside the owner's 2026-10-05 R1 ruling. Exact Why wording was mine; it was
  checked against `test/dual-home-parity.test.js`'s compare loop so it is literally true (a new
  top-level vault file would be "only in live", hence "which files sit outside `wiki/`").
- **D5 — R2 fix.** Answers R2. What changed: "run the highest row it touches" → "run the heaviest row
  it touches (the lowest in the table)". Why it qualified: verified `CORRECT`, one-line wording, the
  owner's R2 ruling left the exact words to me.
- **D6 — R3 fix.** Answers R3. What changed: `CLAUDE.md`, `AGENTS.md` added to the `test:unit` row; its
  Why adds "`rules-block-budget` reads `CLAUDE.md` and `AGENTS.md`". Why it qualified: verified
  `CORRECT` (`test/rules-block-budget.test.js:130-131` is the only test reading the repo-root pair;
  `structure-check`/`structure-spec` only name them for fixtures; `test/prove-red.sh` names neither),
  mechanical, inside the owner's R3 ruling.
- **D7 — accepted residual recorded for `install.sh` / `VERSION` / `nginx.conf`.** What changed: one
  entry in `review.md`'s *Accepted residuals*. Why it qualified: the driver's spawn said to record it
  as a residual if appropriate and the owner gave no ruling to change the table for them; it is
  fail-safe (time cost only).

## Verify

Verify step, spawned `fkit-coder` under `fkit-sprint-ship-loop` (Sprint 10), 2026-10-04. Verify only:
no source, test or doc was edited; this section is the only write. `plan.md` blob re-checked:
`26f25fb3bf87147313170f4961a80db22f55cfcd` (unchanged). Plan §4 items 1–7, in order.

Machine: Apple M4 Pro, 14 cores, node v24.13.0. **Not idle**: load average 4.3–9.4 during these runs
(other sessions, plus an unrelated project's long-running `node --test` processes). Every test run used
a fresh `cp -R` of the current working tree (incl. `.git`) in the session scratchpad; nothing else
wrote to those copies. Static checks (items 2, 4, 6, 7) ran on the real tree.

**Result: pass.** All 7 items hold.

### Checks run / skipped

- Ran: `npm run test:docs` ×4 (2 timed, 1 deliberate red, 1 green after revert); `npm run test:unit`
  ×2 (timed); full `npm test` ×1 (unit + prove-red); the item 2/4/5/6/7 greps and diffs.
- Skipped: CI (`.github/workflows/test.yml` not run — this change does not touch it, and CI runs on
  push); `npm run release` (no release). `rules-block-budget` was not run on its own — it is part of the
  unit suite, and all 4 of its tests passed in both unit runs and in the full run.

### 1. Figures in the worklog

Present (§"Step 1 — Measurements": per part, per run, machine and load). The second prove-red figure
the plan asks for is item 5 below.

### 2. The rule at each site

- `grep -n "a skipped check is not a passed one"` hits: `claude/agents/fkit-coder.md:196`,
  `claude/skills/fkit-plan-task/SKILL.md:66`, `claude/skills/fkit-task-ship-loop/SKILL.md:150`,
  `claude/skills/fkit-sprint-ship-loop/SKILL.md:132`, `CONTRIBUTING.md:50`. All 5.
- `grep -n "the checks the change needs"` hits `claude/skills/fkit-review/SKILL.md:120`.
- `git diff --quiet -- CLAUDE.md claude/scaffold/universal-rules.md` → exit 0.
- `rules-block-budget`: 4/4 green inside the unit runs (see above).

### 3. `test:docs` timing and the red/green proof

Sequential, nothing overlapping (no prove-red running in any copy).

| What | Run | Wall time | Tests | Load average at start |
|---|---|---|---|---|
| `npm run test:docs` | 1 | 23.05 s | 372 / 372 pass | 4.61 |
| `npm run test:docs` | 2 | 22.97 s | 372 / 372 pass | 5.41 |
| `npm run test:unit` | 1 | 96.67 s | 1017 / 1017 pass | 5.59 |
| `npm run test:unit` | 2 | 94.63 s | 1017 / 1017 pass | 9.40 |

Unit is ~1.7× the plan's 55 s on this busier machine; `test:docs` is under the plan's 27.7 s. Both
still round to `CONTRIBUTING.md`'s "~30 s" / "~1 min" order of size, and that file already says the
figures are machine-dependent.

Red/green, in the scratch copy only: appended `See [the missing doc](./no-such-file-0480-verify.md).`
to `ai-agents/knowledge-base/architecture.md` (not a two-home file, so `dual-home-parity` is not in
play).
- Red: `npm run test:docs` exit 1, 371 pass / 1 fail — the one fail is
  `L2 live corpus: BROKEN is 0 under the settled condition`, naming line 634 and the target.
- Restored the file from a copy (`git diff --quiet` on it → clean), re-ran: exit 0, 372 / 372 pass.

### 4. CI, release and `package.json` untouched

- `git diff --stat -- .github/workflows/test.yml bin/release.mjs` → empty.
- `git diff package.json` → one added line, `test:docs`, after `test:prove-red`; `"test"` unchanged on
  line 5.

### 5. The new table applied to this change — full `npm test`

The change touches `claude/skills/fkit-sprint-ship-loop/SKILL.md` (prove-red names it:
`grep -F` → `test/prove-red.sh:763`, mutation 9's target) and `package.json`, so the table's highest
row is the full `npm test`. Run once, in its own scratch copy, nothing else in that copy:

| What | Wall time | Result | Load average |
|---|---|---|---|
| `npm test` (total) | 991.1 s ≈ 16.5 min | exit 0 | 6.43 at start, 4.32 at end |
| — unit half | 94.6 s (node `duration_ms`) | 1017 / 1017 pass | — |
| — prove-red half (derived: total − unit) | ≈ 896 s ≈ 15 min | hard gate PASSED; 55 steps; all 15 baselines green, all 40 mutations red | — |

**Not a quiet-machine figure** — the copy was quiet, the machine was not. It is the second prove-red
figure the plan asks for; with the plan's 651 s and Build's 923 s, prove-red on this machine spans
~11–15 min depending on load.

Machine paths: `grep -nE '/Users/|/private/tmp|/home/'` on `CONTRIBUTING.md`, `package.json` and the
five edited `claude/` files → no match (exit 1). The same grep on this task's `plan.md` hits only the
plan's own quotation of the pattern (`plan.md:142`); no real path.

### 6. Line cites

Each cited range compared with the same range at `HEAD` (byte-identical):
- `fkit-task-ship-loop/SKILL.md:90` → `fkit-coder.md:28-33`: lands (the "Do not accept a background
  delegation" Mode text). Target unchanged since HEAD.
- **`fkit-task-ship-loop/SKILL.md:162`** (was `:160` — the citing line moved down 2 with step 5's
  edit, as Build recorded; checked at `:162`, not `:160`) → `fkit-coder.md:109-113`: target lines
  unchanged since HEAD, so 0480 moved nothing under it. ⚠️ By eye, though, the cite was **already
  wrong at HEAD**: `:162` cites it for "a new architecture/scope decision → owner", but
  `fkit-coder.md:109-113` is the skill list; that rule sits at `fkit-coder.md:165`. Pre-existing, not
  caused by this change, out of plan — noted, not fixed.
- `fkit-sprint-ship-loop/SKILL.md:41` → `fkit-task-ship-loop/SKILL.md:8-18`: lands (the owner banner,
  "session-only and refuses a spawned/headless invocation"). Target unchanged since HEAD.

### 7. `.claude/` copies

All five edited `claude/` files `diff` clean against their `.claude/` copies; a sweep of every
`claude/agents/fkit-*.md` and `claude/skills/fkit-*/` against `.claude/` found no difference.

### Noticed, not fixed

- `fkit-task-ship-loop/SKILL.md:150` is 171 characters (the step-5 rewrap, per D2, joined the end of
  the sentence onto the next sentence's line). Cosmetic; the file already had 20 lines over 110.

## Process-review, round 1 (2026-10-05)

Spawned `fkit-coder` under `fkit-sprint-ship-loop`. R1, R2, R3 all verified `CORRECT` and fixed in
`CONTRIBUTING.md` only (decision log D4–D7). Ledger `review.md` set to closed-out.

Checks, in a scratch copy of the working tree (nothing else writing to it; load average 4.69 at start):

| What | Wall time | Result |
|---|---|---|
| `node --test test/dual-home-parity.test.js` | 0.08 s | 9 / 9 pass |
| `npm run test:docs` | 25.7 s | 372 / 372 pass, exit 0 |

- `grep -nE '/Users/|/private/tmp|/home/' CONTRIBUTING.md` → no match.
- Skipped: `npm run test:unit` and `npm test` — the round touched only `CONTRIBUTING.md`, which the
  table puts in the "nothing" row; the two checks above were run because the edited table drives
  verification. The Verify step's full `npm test` (above) covers the rest of the change, which this
  round did not touch.

