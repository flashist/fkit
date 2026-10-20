# Plan — 0528 Change the rules that make the test suite grow

## Goal
Change the written rules that push work toward more tests and more full runs (ADR-057 §D9, the `0528` rows, plus the sweep). Shipped prompts under `claude/` get project-neutral wording. fkit's own test rules go into `CONTRIBUTING.md`. No test file, prove-red case or test edit.

## Where the brief, the ADR and the files differ
- The ADR wins on two points: there is no numeric cap (D2.2, Q3), and there are **four** named exceptions, not three (D7's ⛔ note adds `test/structure-manifest.test.js`).
- §D9 quotes "a check that cannot fail" as a missing-test phrase. It is a wrong test, not a missing one, so it stays an ordinary finding and can still be a defect. Only the "no planned check covers" half becomes a suggestion.
- The sweep adds two coder-side growth rules that §D9 misses: `fkit-process-review` Step 5 ("Add or update tests for the changed behavior") and `fkit-process-stateful-review` Step 6 ("Add/update tests …"). It also adds the sprint-ship-loop row that paraphrases the second one.
- ADR-057 §D3 says the nightly schedule "is not in `0530`'s brief today". `0530` has since been re-briefed to build it (its *What to build* item 2). This plan follows the brief. The ADR line is a drift for the architect's dated-note routine; this task does not edit the ADR.

## Shared wording
- **Pointer (P):** "the project's own test rules and key list, wherever it writes them down (often its `CONTRIBUTING.md` or `ai-agents/knowledge-base/`)". It is the same "e.g. `CONTRIBUTING.md`" pointer the coder prompt already uses. In this repo it lands on CONTRIBUTING's new *Test rules* section. No new file or convention is added.
- **NK — the no-key-list clause.** Owner Q1 picks one; it is used at every grading site.
  - A: "No written key list → a suggestion."
  - **B (Rec):** in the two reviewer skills: "No written key list found → a suggestion; say once in the report: *no written key list found — missing tests graded as suggestions*." Everywhere else: "No written key list → a suggestion."
  - C: everywhere: "No written test rules found → judge a missing test as before; it may be a defect." `fkit-coder.md` also gets: "With no written rules, add or update tests for the behaviour you changed."
- **Reviewer rule (MT-R)** — goes in `fkit-review` Step 3 and `fkit-stateful-review` Step 3:
  > **A missing test is a suggestion, not a defect.** When the code behaves correctly and the only
  > finding is that no test covers it, list it under **Suggestions (not defects)** in your report — not
  > as a finding row and not counted in the verdict — unless the project's own key list (in its written
  > test rules, often `CONTRIBUTING.md`) names that behaviour; then it is a **Defect**. [NK] A test that
  > cannot fail is a wrong test, not a missing one — judge it like any other finding.
- **Stateful coder rule (MT-C)** — goes in `fkit-process-stateful-review` Step 3.5:
  > **A missing test is a suggestion, not a defect.** A finding that is only "no test covers this", on
  > code that behaves correctly, is not a defect unless the project's own key list (in its written test
  > rules, often `CONTRIBUTING.md`) names that behaviour. [NK] Write it in Step 2's closeout form:
  > Verdict `closeout`, Status `closeout (re-litigation)`, Action `none`, pointing at the project's
  > written test rules — or, where none are written, at this rule ("re-litigation" here means: it
  > re-raises what the project's test rules settle). No code change, no residual. A test that cannot
  > fail is a wrong test, not a missing one — judge it like any other finding.

  Why closeout and not frontier-move: a frontier-move is a ⛔ STOP in `fkit-task-ship-loop` step 6 and in the sprint row. The closeout form already exists, and both ship loops already carry on past it without stopping. So no gate is added or removed, no ADR-019 text changes, and the ledger columns and the six Status values stay as they are.
- **Ephemeral coder rule (MT-E)** — goes in `fkit-process-review` Step 2.5:
  > **A missing test is a suggestion, not a defect.** A finding that is only "no test covers this", on
  > code that behaves correctly, is not a defect unless the project's own key list (in its written test
  > rules, often `CONTRIBUTING.md`) names that behaviour. [NK] Mark it `Suggestion` in the *Defect /
  > Frontier-move* column and change no code unless I ask. A test that cannot fail is a wrong test, not a
  > missing one — judge it like any other finding.
- **Default command (DC):** "when unsure, run the project's default test command — nothing beyond it".

## Steps
1. **`claude/agents/fkit-coder.md`.** The *Test your changes* bullet changes.
   - Today it says: "Follow the project's testing conventions; add or update tests for the behavior you changed. … Run the full suite before a release, when you change the tests or test tooling themselves, and whenever you are unsure which checks apply: when in doubt, run more. …"
   - It becomes:
   > - **Test your changes — the project's way.** Follow the project's own test rules and key list,
   >   wherever it writes them down (often its `CONTRIBUTING.md` or `ai-agents/knowledge-base/`). Update
   >   any test your change makes wrong; add a test where those rules call for one or the approved plan
   >   names it — a new test file needs the owner's OK where the rules say so. Then map the changed paths
   >   to the project's checks — use its own "what changed → what to run" table if it has one — and run
   >   those, plus the linter/build where applicable. Unsure which checks apply? Run the project's default
   >   test command — nothing beyond it. Report which checks ran and which you skipped, and why — a
   >   skipped check is not a passed one. If you can't run them, say so explicitly.
   - Under Q1-C it gets one more sentence (see NK).
   - The line "Ship code changes without tests or verification when the project expects them" stays as it is.
2. **`claude/skills/fkit-plan-task/SKILL.md`.** The testing bullet in §Planning Requirements becomes:
   > - testing and validation steps — the checks this change needs, by name: map the changed paths to the
   >   project's checks (its own "what changed → what to run" table if it has one, e.g. in
   >   `CONTRIBUTING.md`), following the project's own test rules; when unsure, plan the project's default
   >   test command — nothing beyond it. Name each new test file the plan adds, so the owner's approval
   >   covers it where the project's rules require one. The plan names which checks it will run and which
   >   it will skip, and why — a skipped check is not a passed one

   The `plan-review:begin/end` block is not touched.
3. **`claude/skills/fkit-task-ship-loop/SKILL.md`.** In step 5 *Verify*, "and run the full suite at release, when the tests or test tooling change, or when unsure" becomes "; when unsure, run the project's default test command — nothing beyond it". The step 6 STOP list is not touched. No gate is added or removed.
4. **`claude/skills/fkit-sprint-ship-loop/SKILL.md`.**
   - *Verify* row: the same replacement as step 3.
   - *Process review* row:
     - "add/update tests and run the relevant tests / linter / build" becomes "update any test the fix makes wrong, add one only where the project's own test rules call for it, and run the relevant checks / linter / build";
     - "naming the residual or ADR that settles it" becomes "naming the residual, ADR or project test rule that settles it".
   - Citations in that row:
     - `fkit-process-stateful-review/SKILL.md:208` is updated to the new line of the Step 6 heading;
     - the other three (`:96-97`, `:114-118`, `:132-133`) sit above every insertion, and are re-checked anyway.
   - The stop column is not touched.
5. **`claude/skills/fkit-review/SKILL.md`.**
   - Coverage step 2: "the full suite when unsure" becomes "the project's default test command when unsure".
   - Step 3: MT-R goes after the Defect/Frontier sentence.
   - Step 4's report list gets a new item after *Findings table*: "- **Suggestions (not defects)** — missing tests on correct code (Step 3), one line each; omit when none."
   - Not touched: the `test/prove-red.sh:82` example, which is 0529's.
   - Every insertion is below line 57, so `architecture.md`'s citations (`:12`, `:38`, `:57`) stay true.
6. **`claude/skills/fkit-stateful-review/SKILL.md`.**
   - Step 3: MT-R goes in.
   - Step 4: after "Disproven findings need not be recorded as rows …", add "A missing-test suggestion (Step 3) is not a row either — list it in the report."
   - Step 5's report gets the *Suggestions (not defects)* item.
   - Not touched: the `test/coordination-citation-policy.test.js` line, which is 0529's.
7. **`claude/skills/fkit-process-review/SKILL.md`.**
   - Step 2.5: MT-E goes in.
   - INCOMPLETE: "a related bug, an uncovered edge, a missing test, a broader pattern." becomes "a related bug, an uncovered edge, a broader pattern (a missing test on correct code is a suggestion — Step 2.5)."
   - Step 5: "Add or update tests for the changed behavior and run the relevant tests / linter / build." becomes "Update any test the fix makes wrong, add one only where the project's own test rules call for it, and run the relevant checks (when unsure, the project's default test command) / linter / build."
8. **`claude/skills/fkit-process-stateful-review/SKILL.md`.**
   - Step 3.5: MT-C goes in.
   - Step 6: the same text as step 7's Step 5.
   - Not touched:
     - the per-round approval gate (the part ADR-019's "byte-unchanged" protects);
     - Steps 2 and 4;
     - the line-79 test name, which is 0529's.
9. **`claude/skills/fkit-adversarial-review/SKILL.md`**, the hunt list.
   - "**Missing tests** — behavior changed with no test covering it; the untested edge." gets this added: " On code that behaves correctly, label it a **suggestion**, separate from real defects, unless the project's own key list (its written test rules) names that behaviour. [NK]"
   - "**Missing or wrong tests** — a changed behavior no planned check covers, or a check that cannot fail." becomes "**Missing or wrong tests** — a changed behavior no planned check covers (a **suggestion** unless the project's own key list names it — label it so; [NK]), or a check that cannot fail."
   - Kept: the `missing-test` category, and "missing tests" in both descriptions. What gets hunted is the same; only how it is graded changes.
10. **`CONTRIBUTING.md`.**
   a. "Times are from a busy Apple M4 Pro (2026-10); yours will differ." becomes "Times are from a busy Apple M4 Pro (2026-10), to be re-measured by `0530`; yours will differ." No figure changes.
   b. A new `### Test rules` section goes in before `### What to run for a change`:
```
### Test rules

fkit's own rules for its test suite, set by
[ADR-057](ai-agents/knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md),
which holds the reasons. The shipped prompts tell agents to follow "the project's own test rules and
key list"; in this repo, these are they.

⚠️ Not all of this is true yet. `0529` cuts the suite and prove-red down to what is below; `0530`
makes CI enforce the budget and adds the nightly prove-red lane. Until each lands, `npm test` still
runs everything listed above, prove-red included.

- **What a test may cover.** Only how a shipped script behaves, seen from outside — inputs in; exit
  code, output and files written out; no sourcing or mocking of its internals:
  1. the launcher, init and hooks — `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, the hook
     scripts under `claude/`, and `claude/skills-for-role.sh`, which they source;
  2. shipped skill executables — `dashboard.sh`, `throughput.mjs`, the heal `check.sh` / `repair.sh`.

  Not repo-only tools under `bin/`, not the wording or shape of prompts and documents under `claude/`,
  not the content of `ai-agents/`. LLM behaviour stays out.
- **Named exceptions — these four, no others:** `test/dual-home-parity.test.js`,
  `test/task-id-uniqueness.test.js` and `test/structure-manifest.test.js` (in `npm test`), and
  `test/release-summary.test.js` (its own script, run before a release). No test may cite "the fourth
  category" as its licence.
- **Growth stop.** No new test file and no new prove-red case without the owner's OK — each one, every
  time, in any lane (the default suite, nightly prove-red, the release-test script). A plan the owner
  approves counts as that OK only for the files or cases it names; an agent's plan-review APPROVE is
  not the owner's OK. There is no numeric cap: growth is held back by that OK and the 2-minute budget.
- **A missing test is a suggestion, not a defect** — on code that behaves correctly — **except on the
  key list**, where it is still a defect:
  1. the argv the launcher hands to `claude`, including whether it `exec`s at all (`--resume`, cold
     start);
  2. the role-lock `skillOverrides` matrix;
  3. the skill-ownership hook's allow / deny decision;
  4. any code path that writes or deletes a file in a user's project (init's convergence and
     never-overwrite rule, orphan cleanup, heal `repair.sh`).
- **Prove-red's lane.** Four cases only (today's numbering): M1 (a `skills_for_role()` entry), M2 (the
  `--resume` passthrough), M30 (`exec` on the cold start) and M31 (the same, intake path only). Each
  runs only the test file it needs, nightly in CI, outside `npm test`; still runnable by hand with
  `npm run test:prove-red`. A fifth case needs the owner's OK.
- **The budget.** The default `npm test` takes ≤ 2 min locally on an idle Mac; CI fails the job if it
  goes over. Nightly prove-red and the release-test script are outside it.
```
   - The sentence "A plan the owner approves … counts as that OK" depends on owner Q2; it is dropped if he picks B.
   - D8's timing-test rule is not added, because the brief's list is D1, D2, D3, D7 and D10.

   c. The last *What to run* row becomes "| A release, or **unsure** which row applies | `npm test` | The default command — nothing beyond it (see *Test rules*). |"
   d. Not touched:
      - the rows naming deleted tests and prove-red, the layout, and the `test:docs` bullet — all 0529's;
      - the "heaviest row" bullet, because it picks a row and does not say "run more".
11. **Worklog.** One before/after line per file touched. A hand-off section covers four things:
   - **The §D9 rows split with 0529:** the `fkit-review` prove-red reference goes to 0529; the two stateful skills' test name goes to 0529; in CONTRIBUTING the rows go to 0529 and the times to 0530.
   - **Renumbering:** 0529 updates the M-numbers if it renumbers.
   - **The ⚠️ paragraph:** whichever of 0529 and 0530 lands last drops it.
   - **The nightly lane:** it is 0530's (re-briefed 2026-10-19). ADR-057 §D3's "not in 0530's brief today" predates that re-brief, so it is a drift for the architect's dated-note routine.

## Sequencing with 0529 / 0530
- 0529 has not started.
- It edits other lines of `fkit-review`, both stateful skills and CONTRIBUTING.
- 0528 goes first and leaves those lines byte-identical; 0529 then edits on top.
- No retire rule: ADR-057 sets none, and the growth stop plus 0529's cut cover the need. Not raised.

## Guard tests
- No test is edited or added.
- Six tests read the files this plan edits: `plan-review-switch`, `code-comment-rule`, `spawned-write-marker`, `asking-the-owner-rule`, `adversarial-prompt-path` and `sprint-loop-later-sprint-record`. They assert other phrases: a `grep` of `test/` for every phrase changed here finds nothing.
- If `npm test` still goes red on a changed phrase: stop, leave the guard as it is, and report it for 0529.

## Verification
1. **Sweep.** Run `grep -rniE "when in doubt, run more|full suite|when unsure|missing test|add or update tests|add/update tests|run more" claude/ CONTRIBUTING.md | grep -v structure-manifest.tsv` and paste the output. Every hit must be new wording or one of the listed keeps.
2. **Neutrality.**
   - Run `grep -rnE "2[- ]min|two-minute|shipped[- ]script|argv the launcher|never-overwrite|ADR-057|fourth category|npm test" claude/agents claude/skills | grep -v structure-manifest.tsv`, with a baseline taken before editing. No new hit is allowed.
   - Run `grep -rn "key list" claude/`. Every hit must read "the project's own key list".
   - Paste both outputs.
3. **CONTRIBUTING content.** It states D1, D2, D3, D7 (four exceptions) and D10, and links ADR-057. Read it back, and run `node --test test/top-level-doc-links.test.js`.
4. **Citations.** `grep -n "Step 6 — Apply" claude/skills/fkit-process-stateful-review/SKILL.md` must equal the sprint-ship-loop citation. `sed -n` the other three ranges. Re-run this after every edit to that file, review fixes included.
5. **Refresh.** `claude/fkit-claude-init.sh .` runs with no error.
6. **Tests.** Run `npm test`, the default command. The CONTRIBUTING table puts `fkit-sprint-ship-loop/SKILL.md` in the `npm test` row, because `test/prove-red.sh` names it. State the pass count.
   - The working tree holds other tasks' uncommitted edits (`claude/*.sh`, tests). A red caused by those is reported, not fixed.
   - Skipped: the manifest regenerate, because no scaffold file is touched.

## Edge cases / risks
- Line shifts break `path:line` citations. Covered by step 4 and verification step 4.
- In a consuming project with no written rules, missing tests become suggestions (Q1). That changes behaviour for every consuming project; under B, each review says so.
- In a ship loop, a missing-test finding that reaches the coder is closed out: no stop, no residual. The `(re-litigation)` label is a stretch on a first-time finding; MT-C's own text glosses it.
- A reviewer might wrongly grade an untested key-list item as a suggestion. Only the key-list exception and the reviewer's own pass guard against that (D2.3, by design).

## Open questions for the owner (one batch)
- **Q1 — Projects with no written test rules.**
  - "Key list" means the short list of areas where a missing test still counts as a bug.
  - Today, a review in such a project can fail correct code just because it lacks a test.
  - A: it can't any more, and nothing is said.
  - **B (Rec):** it can't any more, and each review says once that it found no written key list.
  - C: today's behaviour stays there until the project writes its rules. This keeps the "add more tests" pressure in every such project.
- **Q2 — When does a new test file count as OK'd by you?**
  - **A (Rec):** when the plan you approve at the end names it. The agents' plan review before that never counts.
  - B: only when you are asked about that one file on its own.
- **Q3 — Codex X1: may this task edit `fkit-process-stateful-review` at all?** Three prompts and ADR-019 call that skill "byte-unchanged". The coder prompt even glosses it as "the skill file is unedited". The plan adds a rule to it and leaves its approval gate as it is.
  - **A (Rec):** go ahead. "Byte-unchanged" protects the approval gate, and the file has been edited 5 times since ADR-019 (2026-07-21, 08-01, 08-28, 09-04, 10-09) without anyone treating that as a breach. Optional follow-up: ask the architect for a dated note that makes this explicit.
  - B: leave that skill unedited. The missing-test rule then lives only in the reviewer skills and `fkit-process-review`. A missing-test row that reaches the stateful coder still goes through the old path, where it can be filed as a frontier-move and stop the loop.
  - C: get a dated note on ADR-019 from the architect first, then build. This delays 0528.
  - Knock-on for every option: none (checked). No sprint placement and no `Depends on:` changes.
