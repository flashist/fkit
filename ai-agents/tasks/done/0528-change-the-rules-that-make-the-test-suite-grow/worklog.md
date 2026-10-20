# Worklog — 0528: change the rules that make the test suite grow

Builder: spawned `fkit-coder`, **Build worker**, under the declared-approval marker from
`fkit-sprint-ship-loop` (`fkit lead` session, Sprint 13). Approved plan: `plan.md`, blob
`bc07980e573856702c6e4346517fa51dee3330f7` — checked with `git hash-object` at build start, matches the
driver's pointer. No owner channel (ADR-021). No commit, no push, no wiki write, no CI run. `plan.md`
and `plan-review.md` not edited.

## Owner rulings carried (AskUserQuestion, 2026-10-19, live `fkit lead` session)
- Plan: *"Approve (Recommended)"*.
- Q1: *"Suggestion, and say so (Recommended)"* → NK = option B. The two reviewer skills get the
  "say once in the report" form; every other grading site gets "No written key list → a suggestion."
  The Q1-C extra sentence in `fkit-coder.md` is **not** added.
- Q2: *"When my approved plan names it (Recommended)"* → the CONTRIBUTING sentence "A plan the owner
  approves counts as that OK only for the files or cases it names …" is **kept**.
- Q3: *"Go ahead (Recommended)"* → `fkit-process-stateful-review` edited (Step 3.5 MT-C, Step 6); its
  per-round approval gate (Steps 4–5 wording) untouched.

## Changes — one before/after line per file
- `claude/agents/fkit-coder.md` — *Test your changes* bullet: "add or update tests for the behavior you
  changed … Run the full suite … when in doubt, run more" → "the project's way": follow the project's own
  test rules and key list (pointer P); update tests the change makes wrong; add one where the rules call
  for it or the approved plan names it; unsure → the default test command, nothing beyond it. The
  "Ship code changes without tests …" line left as it is.
- `claude/skills/fkit-plan-task/SKILL.md` — testing bullet: "plan the full suite at release … or when
  unsure" → follow the project's test rules; unsure → plan the default test command; name each new test
  file so the owner's approval covers it. `plan-review` block untouched.
- `claude/skills/fkit-task-ship-loop/SKILL.md` — step 5 *Verify*: "run the full suite at release, when
  the tests or test tooling change, or when unsure" → "when unsure, run the project's default test
  command — nothing beyond it". Step 6 STOP list untouched.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — *Verify* row: same replacement. *Process review*
  row: "add/update tests and run the relevant tests / linter / build" → "update any test the fix makes
  wrong, add one only where the project's own test rules call for it, and run the relevant checks /
  linter / build"; "naming the residual or ADR that settles it" → "naming the residual, ADR or project
  test rule that settles it"; Step 6 citation moved from line 208 to line 216 (re-checked after the
  last edit to that file). Stop column untouched.
- `claude/skills/fkit-review/SKILL.md` — coverage step 2: "the full suite when unsure" → "the
  project's default test command when unsure"; Step 3: MT-R added (NK-B form); Step 4 report list:
  new *Suggestions (not defects)* item after the findings table. The `test/prove-red.sh` example
  (0529's) untouched; every insertion sits below line 57, so `architecture.md`'s cites (12, 38, 57)
  still hold.
- `claude/skills/fkit-stateful-review/SKILL.md` — Step 3: MT-R added (NK-B form); Step 4: "A
  missing-test suggestion (Step 3) is not a row either — list it in the report."; Step 5 report: the
  *Suggestions (not defects)* item. The coordination-citation test name line (0529's) untouched.
- `claude/skills/fkit-process-review/SKILL.md` — Step 2.5: MT-E added (NK "everywhere else" form);
  INCOMPLETE: "a missing test" dropped from the list, replaced by the Step 2.5 pointer; Step 5: "Add or
  update tests for the changed behavior …" → "Update any test the fix makes wrong, add one only where
  the project's own test rules call for it, and run the relevant checks (when unsure, the project's
  default test command) / linter / build."
- `claude/skills/fkit-process-stateful-review/SKILL.md` — Step 3.5: MT-C added (NK "everywhere else"
  form); Step 6: the same text as `fkit-process-review` Step 5. Per-round approval gate, Steps 2 and
  4, and the test name in the *Location* note untouched.
- `claude/skills/fkit-adversarial-review/SKILL.md` — hunt list: *Missing tests* gets the
  suggestion-grading sentence; plan list *Missing or wrong tests* gets the parenthetical. The
  `missing-test` category and both descriptions kept.
- `CONTRIBUTING.md` — times line gains "to be re-measured by `0530`" (no figure changed); new
  `### Test rules` section before *What to run for a change* (D1, D2, D3, D7 with four exceptions,
  D10; links ADR-057); last *What to run* row → "A release, or **unsure** which row applies | `npm
  test` | The default command — nothing beyond it (see *Test rules*)." Rows naming deleted tests and
  prove-red, the layout, the `test:docs` bullet and the "heaviest row" bullet untouched.

## Decision log (autonomous and obvious-winner calls)
- **Obvious winner — placement of MT-R / MT-C / MT-E inside their steps.** The plan names the step, not
  the exact line. Put each as its own paragraph right after the step's Defect / Frontier-move text
  (`fkit-stateful-review` Step 3: after its regression-check sentence, which shares that paragraph).
  Why it qualified: within the plan's intent, no other placement reads sensibly.
- **Obvious winner — `fkit-stateful-review` Step 5 report.** That step lists the report items in one
  sentence, not a bulleted list, so the *Suggestions (not defects)* item went in as a clause of that
  sentence ("…, one line each, omitted when none;") rather than as a bullet. Same content as the
  `fkit-review` bullet. Why: matches the surrounding form; within the plan's intent.
- **Obvious winner — line wrap in `fkit-adversarial-review` hunt list.** Re-wrapped the *Missing tests*
  item so "the project's own key list" sits on one line, which lets verification step 2's
  `grep "key list"` show the full phrase. Wording unchanged. Why: mechanical, in-plan.
- **Noted, not changed — `grep "key list"` hits that read "No written key list".** These are the
  owner-approved NK wording (Q1-B), not fkit's own list; every hit refers to the project's key list.
- Review fixes applied unattended: **none** (Build worker; no review round run here).
- **Review round 1 — fix applied unattended, R1** (Process-review worker, 2026-10-20). Answers R1: MT-C's
  "Step 2's closeout form" could read as the task loop's "loop-check fires" → non-convergence STOP.
  Changed: one sentence added to MT-C in `fkit-process-stateful-review` § Step 3.5 (*"This is not the
  Step 2 loop-check firing and does not count as non-convergence."*); the sprint loop's *Process
  review* row now maps *"a Step-2 re-litigation, or a Step-3.5 missing-test closeout"* to
  `closeout (re-litigation)`; its Step 6 heading citation updated to the shifted line. Why it
  qualified: verified CORRECT; one clause each, mechanical; in-plan (plan § Shared wording says the
  closeout form adds no stop, and plan step 4 already edits that row's phrase). No stop line touched.
- **Review round 1 — fix applied unattended, R2** (Process-review worker, 2026-10-20). Answers R2: the
  last *What to run* row said a release runs `npm test` and "nothing beyond it", contradicting *Test
  rules* ("its own script, run before a release", ADR-057 §D4/D7) once `0529` moves the release test
  out. Changed: that row now reads *"The default command. When unsure, nothing beyond it. Before a
  release, also the release tool's own test once it leaves `npm test` (see *Test rules*)."* Why it
  qualified: verified CORRECT; one cell; obvious winner within the plan's intent (the plan's DC limits
  "nothing beyond it" to the unsure case, and the plan's own *Test rules* text states the release
  script); true both before and after `0529`.

## Verification (this build)
1. Sweep — every hit is new wording or a listed keep (the two "missing tests" descriptions in
   `fkit-adversarial-review` / `fkit-adversarial-reviewer.md`, and CONTRIBUTING's own rule).
2. Neutrality — baseline 1 hit (`fkit-wiki-lint` "`npm test` catches it too"), after: identical, no new
   hit. `key list` hits all name the project's key list (see the decision log note).
3. CONTRIBUTING — read back: D1, D2, D3, D7 (four named exceptions), D10, ADR-057 link.
   `node --test test/top-level-doc-links.test.js`: 9/9 pass.
4. Citations — `grep -n "Step 6 — Apply"` gives 216, equal to the sprint-ship-loop cite; the 96-97,
   114-118 and 132-133 ranges still show the Status vocabulary, Step 0's "create it" and Step 1's
   "If findings arrived as pasted text".
5. `claude/fkit-claude-init.sh .` — exit 0.
6. `npm test` — exit 0. Unit suites 1156/1156 pass (139 s); prove-red "✓ hard gate PASSED" — every
   unmutated copy green, mutations 1–55 each red their named assertion. Wall time about 2 h 37 min
   (22:03 → 00:40), under heavy machine load (load average 11–18); not a budget measurement. Run on a
   working tree that also holds other tasks' uncommitted edits (`claude/*.sh`, tests); no red came from
   them. Skipped: the manifest regenerate — no `claude/scaffold/` file touched.

## Hand-off (plan step 11)
- **§D9 rows split with 0529:** the `fkit-review` `test/prove-red.sh` example goes to 0529; the two
  stateful skills' `test/coordination-citation-policy.test.js` name goes to 0529; in CONTRIBUTING the
  rows naming deleted tests and prove-red go to 0529, the times go to 0530.
- **Renumbering:** CONTRIBUTING's *Prove-red's lane* names M1, M2, M30, M31 ("today's numbering"); 0529
  updates them if it renumbers.
- **The ⚠️ paragraph** under *Test rules*: whichever of 0529 and 0530 lands last drops it.
- **The nightly lane** is 0530's (re-briefed 2026-10-19). ADR-057 §D3's "not in 0530's brief today"
  predates that re-brief — a drift for the architect's dated-note routine. This task did not edit the
  ADR.
- **Release row (review R2):** once the release tool's test has its own script (`0529` moves it;
  whether `npm run release` runs it is `0530`'s call, ADR-057 §D4), name that script in CONTRIBUTING's
  last *What to run* row.
- **Optional follow-up for the producer (owner Q3):** ask the architect for a dated note on ADR-019
  making explicit that "byte-unchanged" protects `fkit-process-stateful-review`'s per-round approval
  gate, not the whole file. Not done here.
