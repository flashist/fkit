# Worklog — 0395 Re-measure the CI test runtime on the ubuntu runner; correct the workflow timeout and its comment

Build step, spawned `fkit-coder` under `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05.
Approved plan: `plan.md` in this folder (blob `4a5da12a8036fbb00a4e3a4ee67b394b6ed14477`, 8333 bytes;
hash re-checked at the start of Build — it matches). `plan.md` was not edited.

## Owner rulings on the plan's open questions (2026-10-05, `AskUserQuestion` in the lead session)

`plan.md` is never edited; the rulings live here. Option labels quoted as relayed by the driver.

- **Earlier:** pull 0395 into Sprint 10 — *"I want that"* (typed directly); drive it right after 0479,
  keeping rank P11 — *"Drive it next, keep P11"*.
- **Q1 — measurement basis:** *"Use existing CI runs now"*. The basis is the existing post-0388 CI
  runs; the comment says this sprint's additions are not in them; the owner's next push confirms. The
  plan's Step 0 *"If Q1 = B"* branch does **not** apply.
- **Q2 — ratio:** *"3x → 33 min"*.
- **Q3 — adjacent stale figures:** *"Fix all of them"* — `RELEASING.md`, `bin/release.mjs` (the three
  "~6 min" texts only), `architecture.md`.
- **Q4 — close before the owner's push confirms on CI?** **Not yet ruled** — the driver asks at close
  time. **V5 is pending the owner's push either way** (see below).

## Step 0 — runner measurement (brief V1)

Read this session with `gh run list --workflow test.yml` and `gh run view <id> --json jobs` (job and
`Run npm test` step start/end), plus `gh run view <id> --log` for the split. The unit phase ends at
the `ℹ duration_ms` line; prove-red ends at `✓ hard gate PASSED`.

`0388`'s mutations landed in `81f1429` (2026-09-15, "Sprint push";
`git log -S'Name the wrong drift record' -- test/prove-red.sh`). Every `test` push run from there to
HEAD is post-0388: **20 runs, all `success`**.

The four slowest, with the split:

| run id | commit | date | whole job | `npm test` step | unit / prove-red |
|---|---|---|---|---|---|
| 36984588959 | 4346410 | 2026-10-02 | **652 s (10m52s)** — slowest job | 610 s | 66.6 s / 543.7 s |
| 37051231177 | 4a21997 | 2026-10-02 | 630 s | **624 s** — slowest step | 67.2 s / 555.9 s |
| 36999504888 | 1c334bb | 2026-10-02 | 618 s | 610 s | 66.3 s / 543.5 s |
| 36993061795 | 9a37d4f | 2026-10-02 | 617 s | 609 s | 66.5 s / 541.9 s |

All 20 (whole job / `npm test` step, seconds): 37051231177 630/624 · 37050105587 613/605 ·
37001241391 614/606 · 37000735890 602/596 · 36999504888 618/610 · 36998350232 538/532 ·
36993061795 617/609 · 36991929630 443/433 · 36984809059 503/496 · 36984588959 652/610 ·
36976957087 492/485 · 36389408420 597/593 · 36237528682 451/445 · 35598869071 532/526 ·
35502897871 416/407 · 35327985039 351/333 · 35070805186 344/334 · 35064058140 388/378 ·
35061888223 523/516 · 34954360697 518/504. Range 344–652 s; same-day (2026-10-02) spread 443–652 s
(7.4–10.9 min).

**Basis: the slowest whole job, 652 s, run 36984588959.** (~40 s of that job is setup before the
step.)

**What these runs do not contain.** At each of the four commits above, `test/prove-red.sh` has
**40 mutations (1–40) and 15 baselines (0a–0o)** — counted per commit with `git show <c>:test/prove-red.sh`.
This sprint's uncommitted additions — baseline `0p` and mutation `41` (0481), mutations `42`–`43`
(0479), the larger `release-summary.test.js` and the new `update-reinstall.test.js` — were **not** in
any measured run.

**Estimate (UNVERIFIED), from the plan's finding 3:** about **+1 min** on the runner for those
additions, so the slowest expected job is ~12–13 min, under both the old 20 and the new 33. It rests on
one local run per suite on a loaded machine and a CI/local ratio taken from one suite.

## Step 1 — recount from the file being shipped (brief V3)

`test/prove-red.sh`, working tree, counted by the `^printf 'N. ` / `^printf '0x. ` message lines and
cross-checked against the `^step` labels:

- **43 mutation entries** (1–43; `step 1` … `step 43`, then `step end`).
- **16 baselines** (0a–0p): **0a** runs against the real tree (*"real launcher should be green"*);
  **0b–0p (15)** run against unmutated copies.

At HEAD (`4a21997`) the same count gives 40 mutations and 15 baselines (0a–0o), so the Sprint 10 delta
is +3 mutations, +1 baseline. Every count in the new comment matches these.

## Step 2 — `.github/workflows/test.yml`

- `timeout-minutes: 20` → **`33`** = ceil(3 × 652 s / 60) = ceil(32.6).
- The comment above it rewritten: runner basis (run range 81f1429 → 4a21997, whole-job range, slowest
  job with run id/date/step/split, slowest step), runner spread, the measured runs' counts vs the
  current counts dated to task 0395, an explicit line that the Sprint 10 additions were not measured
  (with the unverified ~+1 min estimate), the ratio the new value gives (33 / 10.87 = ~3.0×), the
  six-hours purpose, and how to re-measure.
- Removed: "15 mutants", "~3x headroom over the slowest local run", and every local figure.
- Untouched: the header block, triggers, `fetch-depth: 0` and no-`npm ci` comments.

## Step 3 — adjacent stale figures (Q3)

- `RELEASING.md` §3: "roughly 6–8 minutes, machine-dependent" → "over ten minutes, machine-dependent
  (see `CONTRIBUTING.md`'s Tests table)"; "Failing eight minutes into" → "Failing ten minutes into"
  (decision log D1).
- `RELEASING.md` §4 CI paragraph: `timeout-minutes: 20` → `33`; citations re-derived against the
  edited file: `test.yml:38-42` → **`:47-51`** (the `fetch-depth` comment + key), `test.yml:33` →
  **`:42`**. `:3-11` and `:16-20` checked, still correct. This edit adds one line to `RELEASING.md`
  §3; no file cites `RELEASING.md` by line number, so nothing else moved.
- `bin/release.mjs`: the three "~6 min" texts → "10+ min" (help text, code comment, console line).
  In-place, no line moved, so `RELEASING.md`'s `bin/release.mjs:N` citations are unaffected. The
  asserted substring ``running `npm test` `` is unchanged.
- `ai-agents/knowledge-base/architecture.md`: "~6 min separate the gate from" → "10+ min separate the
  gate from". In-place.
- `CONTRIBUTING.md`'s "~12 min" untouched, as planned.

## Step 4 — static checks

- **YAML parses:** `ruby -ryaml` loads it; `jobs.test.timeout-minutes` = 33, 3 steps.
- **V2 arithmetic:** 652 s = 10.87 min; 33 / 10.87 = 3.037 → "~3.0x" as stated.
- **V3 recount:** comment's 1–40 / 0a–0o (measured) and 43 / 16 / 0a real / 0b–0p copies (current)
  match the file at the measured commits and the working tree.
- **V4 greps:** "15 mutants", "3x headroom over the slowest local", "~6 min", "6–8 min", "eight
  minutes", "timeout-minutes: 20" — no hits in the four edited files.
- **Diff scope (V6, Q3):** my edits isolated by reverse-applying them to scratch copies: only the
  texts listed above changed; 0479/0481's uncommitted edits in the same files are untouched. Files
  touched by this task: `test.yml`, `RELEASING.md`, `bin/release.mjs`, `architecture.md`, this
  worklog.
- **Extra targeted runs (not the full suite):** `npm run test:docs` 372/372 pass;
  `node --test test/release-summary.test.js` 30/30 pass; `node --check bin/release.mjs` ok. Load
  average 4.5 at the time.
- **Not run here:** the full `npm test` — it is the separate Verify step.
- **V5 (first CI run after the change finishes green inside 33 min): PENDING the owner's push.**
  Cannot be done without a push; Q4 (close before that confirms?) is unruled.

## Flags for later

- The wiki (`systems/testing-and-verification.md`, the gate-releases task page) still quotes
  `timeout-minutes: 20` — needs a `fkit-wiki` sync after this lands. Not edited here.
- The same sync must also replace the old local runtime figure *"roughly 6–8 minutes,
  machine-dependent"*, which Q3 replaced in `RELEASING.md` with *"over ten minutes,
  machine-dependent"*. The vault still presents the old figure as current in
  `wiki/tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases.md` (the bullet
  *"The standing authority is `RELEASING.md:128`"*: both the quote and that line number are stale),
  `wiki/systems/testing-and-verification.md` (*"Suite runtime: roughly 6–8 minutes"*),
  `wiki/tasks/gate-releases-so-an-untested-tree-cannot-ship.md` (*"Suite runtime: …"* and
  *"separate the gate from `git add -A`"*), and `wiki/systems/install-and-self-update.md`
  (correction item 2, which also says `release.mjs` and `test.yml` "still say `~6 min`" — no longer
  true). Pages that only record the 2026-08-13 ruling as history can stay. Which pages to rewrite
  is the librarian's call. Not edited here.
- `bin/release.mjs`'s *"5+ minutes of silence reads as a hang"* was left as is: a lower bound, still
  true, and outside Q3's "three ~6 min texts only".

## Decision log (calls made without asking)

- **D1 — "Failing eight minutes into a release run" → "ten minutes".** Answers: plan Step 3 /
  Q3 ("Fix all of them") for `RELEASING.md`'s "6–8 minutes". What changed: the same stale figure,
  restated in the next sentence of the same paragraph. Why it qualified: obvious winner within the
  plan's intent — leaving it would contradict the fixed figure two lines up; one word, localized.
- **D2 — wording "10+ min" in `bin/release.mjs` and `architecture.md`; "over ten minutes,
  machine-dependent (see `CONTRIBUTING.md`'s Tests table)" in `RELEASING.md`.** Answers: plan Step 3,
  whose wording was an *e.g.* What changed: the short form where line width is tight (help text, code
  comment, console line, a wrapped architecture bullet); the full form in the prose doc. Why it
  qualified: in-plan, mechanical; same meaning as the plan's example.
- **D3 — the comment names "a new update-reinstall suite" among the unmeasured additions,** beyond the
  plan Step 2 bullet's "(0p, 41–43, the larger release suite)". Answers: brief V4 / plan Step 2 "every
  figure true". Why it qualified: verified-correct (plan finding 2 lists it; `test/update-reinstall.test.js`
  is untracked), a comment-only accuracy fix inside the plan's intent.
- **D4 — prove-red figure 544 s, not the plan's 543 s,** for run 36984588959. Answers: plan Step 0
  re-read. Why: the log timestamps give 543.7 s; the plan rounded down. 66 + 544 = 610 matches the step.
- **D5 — comment reflowed** so no line exceeds the file's 100-column width (it moved the `timeout` and
  `fetch-depth` lines once more; `RELEASING.md` citations re-derived after the final edit). Mechanical.
- **D6 (Process-review, 2026-10-05) — fix for `review.md` R1.** Answers: R1 (and the Verify
  section's defect), *"Those runs carried prove-red.sh mutations 1-40"*. What changed: in
  `test.yml`'s comment, that sentence now reads *"All 20 carried prove-red.sh baselines 0a-0o and
  mutations 1-40 (incl. the basis run), except the 6 before 3027cc7 (2026-09-21), which had 1-39"*;
  the rest of that paragraph was reflowed to fit 100 columns, and *"a larger release-summary suite"*
  became *"a larger release suite"* to fit (`release-summary.test.js` is the only release suite
  under `test/`). Same 5 comment lines, so `timeout-minutes: 33` stays on line 42 and
  `RELEASING.md`'s `test.yml` citations do not move. Re-counted myself with
  `git show <sha>:test/prove-red.sh` for all 20 run commits: 14 have 1–40, the 6 from 81f1429 to
  add6a07 have 1–39, all 20 have 0a–0o. Why it qualified: verified `CORRECT`, comment-only,
  localized, inside plan Step 2 ("every figure true").
- **D7 (Process-review, 2026-10-05) — fix for `review.md` R2.** Answers: R2, the wiki-sync flag
  naming only *"still quotes `timeout-minutes: 20`"*. What changed: added a second flag under
  *Flags for later* for the stale *"roughly 6–8 minutes, machine-dependent"* figure. It names the
  page R2 cites, plus three more vault pages I found by grep that still present that figure (or the
  old `~6 min` disagreement) as current. Why it qualified: verified `CORRECT`, docs-only, inside the
  plan's *Out of scope / notes* ("flag it for a `fkit-wiki` sync; never edit it ourselves"). Naming the
  extra pages is an obvious winner inside that intent: a sync done from a partial list would leave
  them stale, which is what R2 is about. The wiki was not edited.

## Verify

Spawned `fkit-coder`, Verify step under `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05. Verify only:
no source edited; this section is the only write. Plan blob re-checked: `4a5da12…` (unchanged).

**Result: FAIL on one point (comment accuracy). Everything else passes.**

- **Defect — `test.yml:34` "Those runs carried prove-red.sh mutations 1-40".** "Those runs" reads as
  the 20 measured runs named at `:28-30`. Recounted per commit with `git show <sha>:test/prove-red.sh`:
  14 runs (3027cc7 … 4a21997, 2026-09-21 → 10-02) carry 1–40; **6 runs (81f1429, c59f4d7, a351cb6,
  ee186ee, e37bfd6, add6a07; 2026-09-15 → 09-20) carry 1–39** — mutation 40 landed in `3027cc7`.
  All 20 carry baselines 0a–0o. The basis run (36984588959 @ 4346410) and the four slowest carry
  1–40, so the timeout value is unaffected. Comment-only fix, e.g. *"The slowest runs carried
  mutations 1-40 (the six before 3027cc7 had 1-39) and baselines 0a-0o."* The Step-0 text above
  ("At each of the four commits above") is accurate; only the comment generalises it.

Checks run:

- **sha1, start (19:35) and end (20:03), unchanged:** `test.yml` 9275cab1…, `RELEASING.md`
  3ad460da…, `bin/release.mjs` a909e528…, `architecture.md` 86cdadb4….
- **Full `npm test`** in a fresh `cp -R` copy (incl. `.git`) in the scratchpad: **exit 0**. Unit
  **1048 tests / 24 suites, 1048 pass, 0 fail**, 0 skipped/todo (`duration_ms` 130595). prove-red: 16
  baselines green (0a–0p), 43/43 mutations red; final line `✓ hard gate PASSED — real + unmutated copy
  green; each mutation reds its NAMED assertion.` Wall **1638 s (27m18s)**, 19:36:09 → 20:03:27; load
  average 3.82/3.90/3.36 at start, 3.23/4.25/4.29 at end (5.83 mid-run).
- **YAML:** `ruby -ryaml` parses; `jobs.test.timeout-minutes` = 33, `runs-on` ubuntu-latest, 3 steps.
- **Arithmetic:** `gh run view 36984588959 --json jobs` → job 08:32:19 → 08:43:11 = **652 s**; `Run npm
  test` 08:32:59 → 08:43:09 = 610 s. 33×60/652 = **3.04** (comment's "~3.0x", "33 / 10.87" true).
- **Other comment figures, re-derived from `gh`:** 20 `test` push runs 81f1429 → 4a21997, all success,
  each 1 job; whole-job range **344–652 s**; slowest step **624 s** (37051231177); 2026-10-02 spread
  443–652 s = 7.4–10.9 min; log split for 36984588959: unit ends 08:34:05.97 (`ℹ duration_ms`) = 66.6 s,
  prove-red ends 08:43:09.65 (`✓ hard gate PASSED`) = 543.7 s → "66 s + 544 s". All 20 per-run figures
  in Step 0 match. Working tree: 43 mutations (1–43), 16 baselines; `0a` real launcher, `0b`–`0p`
  "unmutated copy" — matches the comment.
- **Old-figure greps** over the four files ("15 mutants", "3x headroom", "slowest local", "~6 min",
  "6–8 min", "6-8 min", "timeout-minutes: 20", "eight minutes", "5m30s", "328 / 380"): **0 hits**.
- **`RELEASING.md` → `test.yml` citations land:** `:3-11` gate-vs-CI argument, `:16-20` triggers,
  `:42` `timeout-minutes: 33`, `:47-51` fetch-depth comment + key.
- **`bin/release.mjs`:** 0395's three edits are 1:1 in-place (reverse-substituted copy: same 584
  lines, diff = lines 79, 334, 351 only). All 11 `RELEASING.md` → `release.mjs:N` citations
  (458-459, 208-213, 317-359, 96, 321-326, 220-315, 390-468, 355-358, 298-304, 328-335, 89) land on
  what they name.
- **Diff scope:** 0395 touches `test.yml` (one hunk, comment + value only), `RELEASING.md` (§3 two
  sentences, §4 CI paragraph), `bin/release.mjs` (3 lines), `architecture.md` (1 line), and this
  folder's `plan.md`/`worklog.md` (+ reviewer's `review.md`, + producer's `brief.md` notes).
  Other uncommitted work in the tree belongs to earlier tasks (0477/0479/0480/0481/0482 and filings).

Checks skipped: **V5** (first CI run green inside 33 min) — needs the owner's push; not triggered.
