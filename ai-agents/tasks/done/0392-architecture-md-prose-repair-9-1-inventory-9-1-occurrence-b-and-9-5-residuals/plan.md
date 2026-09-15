# Plan — 0392: `architecture.md` prose repair (§9.1 inventory, §9.1 occurrence B, §9.5 residuals)

**Status:** plan only, not approved. No file written. Decision points are marked **[OD1] [OD2] [J1] [J2]**.

## 0. What was checked at pickup (2026-09-14)

The brief's line numbers and figures were not used. Everything below was measured on disk today; quotes are the anchors.

- **Target:** `ai-agents/knowledge-base/architecture.md`, 629 lines.
  - Last commits touching it: `abb1388`, `cf289c2`, `351bea3`, which matches the brief.
  - Already dirty in the tree before this row (belong to the driver's status flip, not to this row): `ai-agents/sprints/sprint-9.md` and this row's `brief.md` (Backlog → In progress).
- **Group A premises:**
  - `ls test/*.test.js | wc -l` = **29**.
  - §9.1 still reads *"eight `node --test` contract suites"*, split across two lines, and names 8. All 8 exist.
  - `test/prove-red.sh` header reads *"THIRTY-FOUR mutations"*. Its `--- Mutation N:` blocks run 1–34 with no gaps.
    - A naive grep count gives 35. The extra hit is the header comment that mentions `--- Mutation N:`, not a block.
  - Mutation references elsewhere in the file are accurate, so they stay byte-identical:
    - §7, *"prove-red mutations 16-17"* (update banner): mutations 16 and 17 are the update-banner ones.
    - §7, *"mutation 15 covers removing the notice"*: correct.
    - *"the five `test/structure-*.test.js` suites"*: there are 5.
  - **New A2 finding.** §9.1 says `prove-red.sh` *"proves each suite actually fails against a deliberately-broken copy"*. **13 of 29 suites are never named in `prove-red.sh`:**
    - adr-number-uniqueness, closed-rank-immutability, converge-contract, coordination-citation-policy
    - init-claude-refresh-guard, init-intake-guard, orphan-cleanup, reference-integrity
    - rules-block-budget, structure-check, structure-manifest, structure-repair, task-id-uniqueness
  - How far to trust that finding:
    - The name check is a heuristic. `prove-red.sh:99` runs every suite under a broken launcher, but each mutation checks a named assertion.
    - The claim was already false when there were 8 suites (orphan-cleanup, rules-block-budget and others have no mutation).
    - It is a false coverage claim inside §9.1, so it falls under A2.
- **Group B premises:**
  - All four false clauses are still present in the occurrence-B bullet (*"Neither has been observed green on a runner yet."* … *"a portability repair is a separate brief, not a reason to distrust the workflow."*).
  - Occurrence A (§1) still carries the cross-reference *"⛔ **it was not the dash divergence §9.1 predicted.**"*
  - `gh run list --workflow test.yml` is reachable today. It is only a feasibility probe; its figures will **not** be used. They get re-measured on build day.
- **Group C, my own count: 3 of 3 bullets false.** This matches the 2026-09-13 re-measure and `0366`'s three. It does **not** match `0356`'s two, which missed one.
  1. *"`claude/fkit-claude-init.sh:144` prints "Six roles" and omits `lead` … The count is a literal, not derived."* **False in both halves.**
     - The file contains no "Six roles".
     - The summary block prints no role count, deliberately. The comment reads *"⚠️ NO ROLE COUNT ON THIS LINE — deliberate, owner-ruled 2026-07-20 (`0036` Part D)."*
     - The 7-item list includes `lead`.
     - `n_agents` is derived (`ls "$here/agents/fkit-"*.md | wc -l`) and printed as *"refreshed $n_agents agents"*. It counts refreshed agent files, not roles.
     - `0366`'s own correction ("a derived count from `ls … | wc -l`") is half wrong, as the brief warned.
  2. *"`claude/fkit-claude-init.sh:17` still advertises `fkit claude` in its usage comment"*. **False.**
     - `grep -n 'fkit claude' claude/fkit-claude-init.sh` finds nothing. The usage comment reads *"Usage:  claude/fkit-claude-init.sh &lt;project-root&gt;"*.
     - The second half is true but no longer relevant: `install.sh`'s `omnigent|claude)` branch does exit 1.
  3. *"ADRs 003, 004, 006, 007 are still marked `accepted`"*. **False.** All four `- **Status:**` lines read `superseded`.
- **ADR-027 dual-home paragraph:** accurate, so it stays byte-identical.
- **Found out of scope (report only, not fixed):**
  - §1 *"`claude/skills/fkit-*/SKILL.md`, 26 dirs"*: there are 28 on disk. It is a count outside §9, so neither this row nor `0393` (D4) owns it.
  - Wiki pages that describe §9.1 and §9.5 as stale: `wiki/systems/testing-and-verification.md`, `wiki/systems/install-and-self-update.md`. Route to `fkit-wiki`.
  - ADR-028's "§9.1 — zero automated verification" related-link text. Not touched.
  - `0240`'s live backlog brief quotes §9.1's old "No CI" bullet.
  - ADR-026's "no `.github/workflows/`" claims stay fenced.

## 1. Order: B → A → C (and J1 alongside C)

Anchors are quoted text, never line numbers, so each group re-finds its target after the previous group's edit.

## 2. Group B — occurrence-B bullet (§9.1, "What runs it" list)

**B2 — re-measure on build day:**

- `gh run list --workflow test.yml --limit 1000 --json databaseId,conclusion,event,createdAt,status`
- Record the run total, green, red, and in-progress/cancelled counts; first and last dates; which events triggered runs; and the date measured.
- Nothing is copied from the brief or from occurrence A. Occurrence A's 2026-09-04 figures stay as they are: they are correct as of their date (`0301`). The file will then hold two sets of dated figures, which is correct, and the report will say so.

**B3 — check the first red run firsthand:**

- `gh run view &lt;earliest failure id&gt; --log-failed`.
- Confirm it failed in `test/orphan-cleanup.test.js` on a case-sensitivity difference, repaired by `0283`.
- Also check the other red runs' failure logs for any dash-related failure. If one exists, the wording in B4 changes and I stop and report.

**B1 — rewrite the bullet.** All four clauses go. The replacement:

- **States:** CI has been exercised, with dated figures. The first red run was a filesystem case-sensitivity difference (macOS is case-insensitive, the runner is not), repaired by task `0283`.
- **Past tense only for the dash risk:** it was recorded when CI was approved, and as of the date none of the red runs was a dash divergence.
- **Carries the caveat** "counts on a date, not a standing guarantee" (guards step 11 against overstating).
- **Makes no new, unverified claim about the release gate.** If it mentions the gate at all, it points to §1's existing record.
- **Removes:** "lands unpushed", "only ever run on darwin", and "a portability repair is a separate brief".

**B4 — shape: keep the dash prediction in B as recorded history** (the other shape would edit both sides of the reference):

- Why this shape: occurrence A needs no edit, so the one-sentence exception stays unused. A's dated figures and caveat stay byte-identical. The diff is smaller. The history is useful: it records what was feared and that it did not happen.
- Risk: the dash sentence must read as history, never as a live risk. The past tense plus the date prevents that.
- Fallback: if B3 finds a real dash failure, switch to rewriting both sides and edit only A's one sentence.

**B5:** the *"residual risk narrowed but did not close"* paragraph, the `install.sh` bullet, the `claude/fkit-claude.sh` bullet, the §9.1 heading, and the CI/gate bullets stay byte-identical.

## 3. Group A — the §9.1 opening paragraph

**A1, depends on [OD1]:**

- Re-run `ls test/*.test.js | wc -l` and `ls test/*.test.js` on build day.
- Replace *"eight `node --test` contract suites (…eight names…)"* with the form OD1 picks:
  - (a) all names;
  - (b) count plus command;
  - (c, Rec) dated count, command, and named groups, explicitly not a complete list;
  - (d) command only.
- Under (a) and (c), `skill-ownership-hook` and `dual-home-parity` must be named, so the §9.3 and §9.5 pointers into §9.1 still land. Under (b) and (d), re-read both pointers and keep them honest. That is prose inside §9 and in scope; no coordinate is touched.

**A2:**

- Re-read all of §9 for suite counts, mutation counts and coverage claims against `test/prove-red.sh` (its header plus the `--- Mutation N:` blocks).
- Only edit: *"proves each suite actually fails against a deliberately-broken copy"* becomes an accurate statement, roughly "proves, for the suites it covers, that each goes red at a named assertion against a deliberately-broken copy".
  - Re-verify the 13 uncovered suites on build day first.
  - Do not state a mutation count, because §9.1 has none today and adding a claim is not a repair.
- The trailing space on the ADR-026 line (*"by omission — "*) stays byte-identical unless that line is edited.

**A3:** the heading and the "coverage, not automation" thesis stay unchanged. No "No CI" wording anywhere.

**Layer table:** layer 2 binds, layer 1 is ignored, layer 3 is dead (its work is Group B). **B6: `0251`'s brief is not edited.**

## 4. Group C — §9.5, plus J1

**C1:** re-run the three checks from §0 on build day and record each verdict with its command (grep of `fkit-claude-init.sh` for a role count and `fkit claude`; each ADR's `- **Status:**` line).

**C2 — fix in place, the same way for all three bullets:**

- `architecture.md` is a living reference document. A dated note appended under a false bullet would keep false text in front of readers who cannot tell it is wrong.
- All three bullets fail the same way (the residual is discharged or was never true), so one treatment fits all three.

**C4, depends on [OD2]:**

- (c, Rec) Keep "### 9.5 Residual drift". Replace the three bullets with one dated sentence: previously listed residuals (the init summary's role count, the `fkit claude` usage comment, the Omnigent ADRs' status) were verified discharged or false on &lt;date&gt;. Quote fragments, no line numbers. Keep the ADR-027 paragraph byte-identical.
- (b) Same, but the section is retitled.
- (a) Delete the section and move the ADR-027 paragraph byte-identical into §9.4 or §10; then J1 is required, not optional.
- Invent no new residuals. The init script's own comment says its printed role list and `fkit-claude.sh`'s accepted names are not tested to agree. That is real, but adding it would be inventing a residual, so it is only mentioned in the report.

**C3:** no surviving citation in §9.5 is a bare line number. Where a source file is cited, it is `path` plus a quoted fragment.

**J1, if (a):**

- Rewrite only §8's sentence *"ADRs 003, 004, 006, and 007 describe Omnigent-only mechanics and are due to be marked superseded … they are still marked `accepted` today. See §9.5."* to say they are now marked superseded.
- Replace the dead backlog path with the `0059` folder ID, or drop it.
- Keep or drop "See §9.5" to match OD2.
- Nothing else in §8 changes.
- If J1 is (b) or (c): §8 is left false and reported, and "See §9.5" is kept only if OD2 keeps §9.5.

## 5. Checks (brief steps 1–19, with amendments)

1. **Scope (steps 1–3):**
   - `git diff --stat` lists only `architecture.md`, plus the named pre-existing dirt (`sprint-9.md`, `0392/brief.md`).
   - The task folder's `plan.md` and `worklog.md` show as untracked in `git status --porcelain` and are named, not waved at.
   - Zero changes under `test/fixtures/`, `tasks/done/`, `tasks/cancelled/`, `sprints/done/`, `wiki-vault/`.
   - Each fenced passage is shown byte-identical: `git diff` shows no hunks in the B5 paragraph and bullets, the ADR-027 paragraph, occurrence A (under the B4 "keep history" shape), or the §7 mutation references.
2. **Group A (steps 4–6):**
   - The count in §9.1 equals `ls test/*.test.js | wc -l`.
   - Names checked both ways under OD1 (a); names-exist check and **step 4 amended in writing** under (b), (c) or (d).
   - Any mutation count equals `prove-red.sh` (none is added).
   - `grep -n "eight"` shows no suite claim; the lines-4/5/18/138/144/612 eighth-role mentions are unchanged.
   - Plus a multi-line check, `tr '\n' ' ' &lt; architecture.md | grep -o 'eight `node --test`'`, empty, because the phrase wraps across a line break.
3. **Group B (steps 7–11):**
   - Before and after text quoted.
   - Every figure dated and taken from the build-day `gh` output, kept in `worklog.md`.
   - Case-sensitivity, not dash.
   - The cross-reference shape stated with its reason.
   - No "CI is green" without a date.
4. **Group C (steps 12–15):** three verdicts with commands; the count of 3 stated, and that it does **not** match `0356`'s 2; no bare line numbers; reasons for removal stated.
5. **Hand-off (steps 16–17):**
   - Record the line count before and after, plus each section heading's line before and after, only as evidence that the ground moved. It is **not** a shift map for `0393`, which must re-measure (its D5).
   - State the OD2 answer plainly.
6. **Suite (steps 18–19):**
   - `npm test` with measured pass/fail counts; `bash test/prove-red.sh`.
   - `node --test test/reference-integrity.test.js` shows 0 broken links; `node --test test/coordination-citation-policy.test.js` green. No `NAMED_EXEMPT` entry is added.
   - State plainly: no test checks the accuracy of this prose, so a green suite proves nothing about the change.

## 6. Edge cases and risks

- **The count keeps moving:** a suite lands between measuring and saving. Re-run `ls` right before the check, and state the date.
- **Figures in flux:** a CI run is in progress while measuring (one was, today). Count it separately; do not fold it into green or red.
- **Overstating the fix:** writing "CI is green" or "the gate works" as a lasting fact repeats the original defect. Date it and add the caveat.
- **Wrong cause for the red run:** calling it the dash failure is the named way this task can fail. B3 verifies it from logs.
- **Breaking cross-references:** OD1 (b)/(d) loosens the §9.3 and §9.5 "§9.1" pointers; OD2 (a) breaks §8's "See §9.5". Both are handled above.
- **Link breaks:** the heading text stays, so the `#91-…` and `#95-residual-drift` anchors stay. No live inbound link to either anchor was found (grep over `.md` outside the frozen trees), so an OD2 deletion would not break a checked link. That was not an exhaustive census; the census is `0393`'s job.
- **Out of scope stays out:** no citation sweep outside §9.5 (plus J1 if approved). §9.1's source coordinates (`install.sh:19`, `claude/fkit-claude.sh:36-43`, `install.sh:86-95`) are left for `0393`.
- **The "13 uncovered suites" finding** is heuristic (name matching). If re-verification shows a suite is covered without being named, narrow the list rather than drop the rewording.
- **Hazard in the ownership question:** if J2 = (b), the architect builds by hand (ADR-044 clause 2 governs Plan, not Build), and this plan still applies.

## 7. Report items for the close (not fixed here)

- §1 "26 dirs" is now 28.
- Two wiki pages are stale about §9.1 and §9.5 (route to `fkit-wiki`).
- ADR-028's related-link text.
- `0240` quotes §9.1's old "No CI" bullet.
- The untested agreement between the init script's printed role list and `fkit-claude.sh`'s accepted names.
- If J1 is (b) or (c): §8's false ADR-status sentence and its dead path.

## 8. Owner rulings on the open decisions (2026-09-14, via `AskUserQuestion` in the `fkit lead` session — verbatim option labels)

- **OD1:** "Count + named groups (Rec)" → option (c). Verification step 4 is amended in writing to: every named file exists, count equals disk, no completeness claim.
- **OD2:** "Keep, add dated note (Rec)" → option (c). §9.5 heading and number stay; three bullets become one dated sentence; ADR-027 paragraph byte-identical.
- **J1:** "Fix it here (Rec)" → option (a). §8's one ADR-status sentence and its dead path are fixed in this row; "See §9.5" is kept (OD2 keeps §9.5).
- **J2:** "Coder builds all (Rec)" → option (a). `fkit-coder` builds every group (ADR-044 Decision 1).
