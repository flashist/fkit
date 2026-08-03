# Worklog — task 0210: specify and support the reverse move (sprint → Backlog board)

**Role:** `@fkit-coder`, spawned as the **Build worker** of a `/fkit-sprint-ship-loop` run.
**Authority:** the loop's declared-approval marker — the owner approved `plan.md` via a live
`AskUserQuestion` on 2026-08-03, before any source was written. The approved plan was both the
standing approval and the scope boundary. **Nothing outside it was built.**

**Plan pointer verified before any work:** `git hash-object plan.md` →
`84a7125e4aa2c3dc6b09fe26fbb6407ec485e50b`, 19965 bytes — matches the driver's stated pointer, so the
bytes built from are the bytes the owner approved (to the limit `plan.md`'s own provenance note
records: a hash pins what was *carried*, not what was *approved*).

## What was built

Four sites, exactly the set the plan names.

1. **`claude/skills/fkit-status/dashboard.sh`** — the one-line parser fix, under the comment that now
   reads *"the ➡️ Moved target: a sprint, or the Backlog board (the reverse move)"*. The extractor was
   changed from a `sed -n` BRE that only knew the word `Sprint` to a `sed -nE` ERE alternation that
   also accepts `Backlog`. A warning comment was added above it in this file's established house style
   (it already carries BSD-vs-GNU warnings, e.g. the *"REAL TAB, NOT `\t`"* block), recording that `-E`
   is required and that the naive BRE `\|` form breaks the **forward** parse too.
   - `marker_key()` was **not** touched — it already returns `moved` for any `➡️` cell.
   - The Next-step line `next="in ${moved_target:-Sprint ?}"` was **not** touched — owner ruling Q5.
   - Edited `claude/skills/…`, never `.claude/skills/…` (gitignored). A live `/fkit-status` session
     reads the `.claude/` copy and will not show the fix until `claude/fkit-claude-init.sh .` is re-run.
2. **`ai-agents/sprints/backlog.md`** — a new bullet, *"Back on, from a sprint (the reverse move)"*,
   placed beside the existing **On:** / **Off:** / **Closed here:** bullets. States **four** mandatory
   edits, the canonical marker, the href-is-relative-to-the-row's-file rule, and two blockquote
   warnings — the drift trap, and the explicit *"Edit 4 is UNENFORCED"* caveat.
3. **`claude/skills/fkit-task-brief/SKILL.md`** — the mirror bullet, *"De-scoping a task out of a
   sprint and back onto the Backlog board is also the producer's act, not this skill's"*, placed
   immediately after the existing *"Pulling a backlog task into a sprint is the producer's act, not
   this skill's"* bullet and its blockquote. Located **by quoted heading text, never by line number**,
   as instructed. Includes the third blockquote paragraph the owner required under Q4, explaining that
   the forward form's `## Priority` edit exists as a parenthetical in its step 3 — so four-here versus
   three-above reads as explained, not as an error.
4. **`ai-agents/knowledge-base/conventions/task-status-vocabulary.md`** — one new table row,
   **Moved (to backlog)**, beside the existing **Moved** row. **Live copy only**; the file is
   whole-file parity-exempt as `audience-adapted`, so no scaffold twin edit was needed (verified).
   **`status-report-format.md` was NOT touched**, per the owner's Q3 ruling.

**`test/dashboard-contract.test.js`** — extended, no new file. Six cases appended (`0210/A`–`0210/F`)
under a block comment explaining why the fix is `sed -nE` and why case E must not be deleted as
redundant.

## Owner rulings honoured

- **Q1 SURRENDER** — docs say the sprint row keeps its `P<n>` as frozen history; the backlog row takes
  `—`; the brief takes `## Priority: Unscheduled`. No parking anywhere.
- **Q2** — marker written exactly `➡️ Moved to [Backlog](backlog.md)`, no priority suffix, href
  relative to the row's file.
- **Q3** — vocabulary amended, live copy only; `status-report-format.md` untouched.
- **Q4** — **four** mandatory edits stated in both prose sites, with the parenthetical explanation.
- **Q5** — the Next-step cell was left alone.

## Scope discipline

- **The 45 queued moves were NOT run.** This ships the mechanism only.
- Nothing committed or pushed. Working tree only.
- No task folder moved; no mover invoked.
- `ai-agents/wiki-vault/` never written. (`wiki-vault/log.md` shows as modified in `git status`, but it
  was **already dirty at session start**, from other work — not this task's.)
- The three `claude/skills/fkit-wiki-*/SKILL.md` files were already dirty from task `0173` and were
  left alone.
- No re-ranking; no other task's row touched. The three extra rows in `backlog.md`'s status table are
  pre-existing working-tree changes from tasks `0211`/`0212`/`0213`, not mine; my change is a pure
  insertion in the prose section above the table and does not collide with them.

## Decision log — calls made without asking

Per ADR-019's audit obligation, carried onto this spawn path by ADR-032.

**Obvious-winner calls: three. All stayed inside the approved plan's intent.**

1. **Added a `>` blank line between the two blockquote paragraphs in `backlog.md`.** Without it,
   markdown's lazy continuation merges the drift warning and the *"Edit 4 is UNENFORCED"* warning into
   a single run-on paragraph. Qualifies: purely mechanical rendering fix, localized to text the plan
   told me to write, and the plan explicitly requires the unenforced caveat to be legible as its own
   warning. The mirror site in `fkit-task-brief/SKILL.md` was written with the separators from the
   start.
2. **Built the hand-run BSD gate fixture with a live FORWARD row sitting alongside the reverse row.**
   The plan's §5 step 4 only required a reverse-move fixture returning zero drift. I added a
   `➡️ Moved to [Sprint 12](sprint-12.md) — priority 3` row to the same plan because correction C1's
   whole claim is that the naive fix regresses the *forward* form — a fixture with no forward row
   cannot observe that, which is precisely the fixture blindness C1 says produced the brief's
   understatement. Qualifies: strengthens the plan's own gate at zero cost, changes no deliverable.
   It paid: the naive variant emitted `moved-without-target` on the forward row too, at file level.
3. **Test case D's fixture uses a brief whose `## Sprint` matches the plan's sprint.** The plan
   specifies case D only as *"`➡️ Moved` with no target → still `moved-without-target`"*. A brief
   naming a different sprint would have added a second, unrelated drift record and muddied the
   assertion. Qualifies: mechanical fixture detail inside a case the plan specified.

**Nothing was applied that required a judgment call, so nothing was returned as `NEEDS-DECISION`.**

### One thing done to the repo transiently, disclosed

To red-prove the six new tests, `dashboard.sh`'s parser line was swapped **in place** to each broken
variant (the original `Sprint`-only BRE, and the naive `\|` BRE), the tests were run, and the file was
restored from a pre-swap copy with a **sha256 equality check after every restore** (both printed
`restored: OK`). The final on-disk file is the shipped version. This was necessary because
`dashboard-contract.test.js` hardcodes the script path with no env override — the same fact that makes
the prove-red gap real (below). A cleaner seam is exactly what the follow-up brief would add.

## Verification

Every step of plan §5 was run; raw commands and output were returned to the driver. Summary:

- **§5.1** `node --test test/dashboard-contract.test.js` → **115 pass / 0 fail**, including all six new
  cases.
- **§5.2** `node --test test/*.test.js` → **566 pass / 0 fail / 17 suites**. Baseline was
  **560 / 0 / 17**; the delta is exactly the six new cases. `dual-home-parity.test.js` stayed green
  after the vocabulary edit, as predicted.
- **§5.3** `sh test/prove-red.sh` → exit **0**, all 13 mutations red at their named assertions.
- **§5.4 — the hand-run BSD portability gate.** Real on-disk fixture, `bash dashboard.sh <plan>`:
  **zero drift records**, `count moved 2`, exit 0. Both the reverse row and the live forward row
  parsed clean.
- **§5.5** Same fixture with the brief reading `## Sprint: Sprint 2` →
  `drift disagreement 0210 … brief_sprint="Sprint 2" moved_target="Backlog"`, row renders
  `waiting on owner`. Also confirmed the marker cell survives `one_line_cell()` untrimmed, as the plan
  predicted.
- **Archived form**, end-to-end from `sprints/done/` with `../backlog.md` → zero drift.
- **§5.6** All three doc sites re-read; the reverse move sits beside the forward form in each, the edit
  count is stated, and the `## Priority`-is-unenforced caveat is present in both prose sites. Both
  markdown link targets confirmed to exist, as does the cited `ADR-035`.
- **§5.7** The 45 queued moves were not run.

### Red proof — the tests are load-bearing

Hand-run, since the suite cannot reach `prove-red.sh` (below). Against the **original** parser:
A, B, C, F go red; D and E stay green (correctly — their behavior is unchanged by the fix). Against the
**naive `\|`** parser: A, B, C, F **and E** go red. E going red only against the naive form is the
forward-form regression guard doing its job, and is direct empirical confirmation of correction C1.

Case D is red against neither variant, and that is by design: it guards against a *future* fix that
matches too much, not against these two. Stated here so it is not mistaken for proven coverage.

## ⚠️ CORRECTION (round 1 review, finding R2) — the section below this one is WRONG

**Read this before the *"The plan's prove-red claim — independently verified, CONFIRMED"* section that
follows.** That section endorses `plan.md` §4's claim that this change cannot be prove-red covered
without a test-architecture change. **The claim is false and the endorsement is false.** It was refuted
by execution in the round-1 review and re-verified independently by this worker before any code moved.
The original text is left **byte-identical below** — it is a dated record of what was believed, and
rewriting it would destroy the evidence that a "verified, CONFIRMED" label was applied to a wrong
conclusion. `plan.md` itself is **not** edited: it is the immutable approved artifact.

**What is actually true.** `harness.mjs` derives `REPO` as the parent of its own directory, and
`dashboard-contract.test.js` joins `REPO` with `claude/skills/fkit-status/dashboard.sh`. So copying
`claude/` **and** `test/` into one throwaway root makes the copied test resolve the copied script by
construction — **no env override in either file**. The seam is the directory layout, not an env var.
The earlier reasoning searched the test file for a `process.env` seam, found none, and concluded that
no seam existed; that inference is the actual error, and it is the same shape as the fixture blindness
correction C1 identified.

**Measured before writing anything:** unmutated copy 115/115 green; parser reverted to the pre-0210
`Sprint`-only BRE → cases A, B, C, F red; naive BSD-hostile BRE `\|` → A, B, C, E, F red plus five
pre-existing forward-move tests. Mutation **14** is now wired into `test/prove-red.sh`.

## Decision log, round 1 review — fixes applied without asking

Per ADR-019's audit obligation, carried onto this spawn path by ADR-032. **Standing approval:** the
owner ruled on all five findings via a live `AskUserQuestion` relayed by the driver; those rulings plus
`plan.md` are the scope boundary. Every entry below states which finding it answers, what changed, and
why it qualified.

**Fixes applied: five, one per finding. Obvious-winner calls beyond them: three.** Nothing was returned
as `NEEDS-DECISION` — no judgment call arose that the rulings did not already settle.

1. **R1 — five mandatory edits, not four.** `ai-agents/sprints/backlog.md` and
   `claude/skills/fkit-task-brief/SKILL.md`: count `four` → `five`; `## Status` → `🔲 Backlog` inserted
   as edit 4; `## Priority` renumbered 4 → 5; a ⚠️ warning added for the new edit at both sites; the
   existing "edit 3" and "UNENFORCED" warnings re-pointed. **Qualified:** ruled explicitly by the owner
   (this deliberately exceeds `plan.md`'s four-edit scope, and the ruling says so), and verified
   `CORRECT` first — the four-edit procedure reproduces
   `drift disagreement … plan="🔲 Backlog" brief="🔄 In progress" … location="backlog/"` on a live
   fixture, and the fifth edit clears it.
2. **R2(a) — corrected the wrong justification** in `review.md`'s *Coder response* and in the section
   above, **not** in `plan.md`. **Qualified:** ruled; mechanical; and the ⛔ do-not-edit-`plan.md`
   constraint is honoured by placement.
3. **R2(b) — wired the dashboard mutation.** `test/prove-red.sh` gains `make_repo_copy()`,
   `run_dashboard_suite()`, step **0i** (unmutated-copy guard), and **mutation 14** (revert the
   extractor to the pre-0210 `Sprint`-only BRE → `0210/A` must red). Header index updated THIRTEEN →
   FOURTEEN with a note on why this mutation's seam is the one exception to the file's
   "pointed at via `FKIT_LAUNCHER`" phrasing. **Qualified:** ruled; purely additive — the existing 13
   mutations and all eight pre-existing 0-steps are untouched and still pass.
4. **R3 — case D made to guard its claim.** A second fixture row, `➡️ Moved to Narnia`, added to
   `0210/D`; the original bare-`➡️ Moved` assertion **kept**. **Qualified:** ruled, with the choice
   ("make D guard what it claims, or change what it claims") left to this worker — see the obvious-winner
   entry below for why the first was taken.
5. **R4 — case `0210/G`** added, pinning the legacy unlinked prose form
   `➡️ Moved to Sprint 2 — priority 7`. **Qualified:** ruled; a pure test addition.
6. **R5 — fixture hrefs corrected** to the documented rule: A/B/C `../backlog.md` → `backlog.md`;
   F `../../backlog.md` → `../backlog.md`. **Qualified:** ruled; mechanical; behavior-neutral (the
   parse is href-agnostic, which cases A–G still prove).

### Obvious-winner calls — three, all inside the rulings' intent

1. **Kept D's original bare-`➡️ Moved` assertion instead of swapping the fixture.** The reviewer
   suggested *"a one-line fixture change would make D real."* A grep of the whole suite shows `0210/D`
   is the **only** pin on `kind="moved-without-target"`, so swapping would have closed the over-wide
   hole by opening a target-less one. Two rows, two assertions, one test. **Qualified:** strictly
   stronger than either single option, inside the ruled scope, no new surface.
2. **Added the counts-asymmetry paragraph to `ai-agents/sprints/backlog.md` as well.** The plan's Q4
   ruling required a sentence explaining the forward form's `## Priority` parenthetical; the build put
   it only in `SKILL.md`. With the count now 5-vs-3 and the two bullets **directly adjacent** in
   `backlog.md`, an unexplained gap there is exactly the confusion Q4 exists to prevent. **Qualified:**
   the driver's instruction was to keep that explanation coherent now that the count changed; localized
   to text the rulings already required.
3. **Copied the repo's own `package.json` into `make_repo_copy()`'s root** rather than synthesizing
   `{}` or repairing `$work`'s empty marker. Node resolves a `.js` file's module type from the nearest
   parent `package.json`; `$work`'s marker is an **empty file**, so without this every test in the copy
   dies `ERR_INVALID_PACKAGE_CONFIG` at import and the gate reports success while proving nothing.
   Copying the real file makes the copy resolve modules identically to a real `npm test` run.
   **Qualified:** mechanical and localized to the new helper; repairing `$work`'s marker instead would
   have touched shared state the existing 13 mutations depend on, which the "must not weaken or
   destabilize the existing 13" constraint forbids. **Found by step 0i on its first run** — the guard
   worked as designed.

### Verification of this round — raw results

- `node --test test/dashboard-contract.test.js` → **116 pass / 0 fail** (115 + case G).
- `node --test test/*.test.js` → **567 pass / 0 fail / 17 suites**. Driver's post-build baseline was
  566; the delta is exactly case G. R3's and R5's changes add no test count.
- `sh test/prove-red.sh` → exit **0**. Steps 0a–0i green; mutations **1–14** all red at their named
  assertions. First run exited **1** at step 0i and again at mutation 14 (*"red but NOT at 0210/A"*) —
  the `package.json` fault above; both green after the fix.
- **Red-proof of the repaired guards, hand-run** (the copy-root seam, on copies; the repo was never
  mutated in place this round): over-wide parser → **D and only D** red (it left all 115 green before);
  mandatory-bracket `\[` → **G and only G** red (also all 115 green before).
- **BSD portability gate, by hand.** `sed --version` → `illegal option -- -` (BSD confirmed). Fixture
  built by following the **new five-edit** procedure, with a live forward row alongside the reverse row:
  sprint plan → `count moved 2`, **zero drift**; backlog board → **zero drift**, row renders clean.
  Archived form (plan under `sprints/done/`, href `../backlog.md`) → **zero drift**. Extractor matrix on
  BSD: legacy unlinked → `Sprint 2`; `[Backlog](backlog.md)` and `[Backlog](../backlog.md)` → `Backlog`;
  `[Sprint 12](../sprint-12.md) — priority 3` → `Sprint 12`; bare `➡️ Moved` → empty;
  `➡️ Moved to Narnia` → empty.
- **Doc sites re-read.** Both count-stating sites say **five**; numbering runs 1–5 at both; the
  warnings point at edits 3, 4 and 5 correctly; both carry the counts-asymmetry explanation.
  `task-status-vocabulary.md` states no count and needed none. No site still says four.
- **Not run, and not claimed:** the 45 queued moves. Nothing committed or pushed. No task folder moved.
  `ai-agents/wiki-vault/` never written.

## The plan's prove-red claim — independently verified, CONFIRMED

The plan (§4) says the six new cases cannot be prove-red covered without a test-architecture change.
I was asked to check this rather than inherit it. **It holds.**

- `test/prove-red.sh` contains **zero** references to `dashboard`.
- `test/dashboard-contract.test.js` resolves the script as a hardcoded join of the repo root with
  `claude/skills/fkit-status/dashboard.sh`, and contains **zero** `process.env` references — there is
  no override seam of any kind.
- Every existing prove-red mutation reaches its target through an **env-var seam** — `FKIT_LAUNCHER`,
  `FKIT_SKILL_OWNERSHIP_HOOK`, `FKIT_TURN_COMPLETION_HOOK`, and the parity suite's scaffold-dir
  redirect. `prove-red.sh`'s own header states as a thesis that it *"NEVER edits the real launcher —
  every mutation is a throwaway copy."*

So covering this would mean adding a new env seam to the test file **and** a matching runner plus
mutation to `prove-red.sh` — or else abandoning prove-red's stated never-touch-the-real-file
invariant. Both are test-architecture changes, outside the approved plan. **No in-scope route was
found, so this is reported as a follow-up, not raised as a `NEEDS-DECISION`.**

**Cost of not doing it, stated plainly:** the six new assertions are real and will fail if the parser
regresses — hand-proven above — but nothing proves the *suite* would catch a mutation automatically.
That gap already exists for all 13 existing dashboard behaviors, so this change inherits the posture
rather than worsening it. **Recommend the producer file a follow-up brief** for the owner to rank:
*give `dashboard.sh` a path-override seam and add a dashboard mutation to `prove-red.sh`.* The swap
harness used for the hand proof above is a working sketch of the mutation.
