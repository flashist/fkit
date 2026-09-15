# Plan — 0388: durable `prove-red.sh` mutations for the sprint-mover pins and `dashboard.sh`'s `successor` mode (+ Items A, B)

**Decision points are marked ⟨Q1⟩–⟨Q4⟩. Written for the recommended answers; the alternatives change only the steps marked.**

## 0. Scope

- **Deliverable:** new mutations appended to `test/prove-red.sh`.
  - ⟨Q3⟩ plus Item A's new tests in `test/dashboard-contract.test.js` and their own mutation.
- **Not touched:**
  - any existing assertion in `mover-exemption-step.test.js` or `dashboard-contract.test.js`;
  - `dashboard.sh` or any `SKILL.md` (mutations only edit copies under `$work`);
  - mutations 1–34 (no renumbering);
  - `wiki-vault/`, devDependencies, board ranks.
- **Item B rule, applied to this task's own records (⟨Q4⟩ = B1):** `plan.md`, `worklog.md` and `review.md` sit in `backlog/` and are scanned. None of them carries an `ai-agents/sprints/*.md:N` or `ai-agents/tasks/*/*/{brief,plan,worklog,review}.md:N` coordinate. Quote text instead.

## 1. Baselines (before any edit)

1. `git status --porcelain` snapshot. Record the files already dirty from 0392 and the driver, so step 7.4 compares against this snapshot rather than a clean tree.
2. `npm run test:unit`: record pass/fail/skip totals. Do not take a number from the brief.
3. `time bash test/prove-red.sh`: record wall time and exit code. It must exit 0. If it does not, stop: a red baseline is a finding, not something to build on.

## 2. Measure every candidate mutation by hand first

For each mutation in step 4, on a `mktemp` copy (`make_repo_copy` layout for dashboard; a `cp -R claude` tree for movers):
- apply the edit;
- run the one suite;
- record which tests red.

Expected results:

| # | Suite | Expected red |
|---|---|---|
| 35 | mover | `S2` (and `S4`) |
| 36 | dashboard | `successor S6` only |
| 37 | dashboard | `successor S3` (and `S4`) |
| 38 | dashboard | `successor S4` (and `S7`) |

- **If a result differs, stop and report it.** In particular, if a mutation stays green, the pin does not tell right from wrong. That is a finding, and the assertion is not weakened (brief § Out of scope).
- Record extra reds in each mutation's comment and in the worklog.
- **Do not assert that no other test went red.** Mutation 32's own comment shows extra reds move over time; a strict "only this one" check would make the gate brittle.

## 3. Check anchor uniqueness and write the result into each comment

Use `grep -cF` on the unmutated file:
- `'Backlog'|'In progress') ;;` = 1
- `identity_gt "$_i" "$2" || continue` = 1
- `mode_successor() {` = 1
- `|| identity_gt "$_best_id" "$_i"; then` = **2** (successor + select-active)
- `../../cancelled/X` = 1 and `../../done/X` = 0 in `fkit-sprint-cancelled/SKILL.md`

## 4. Append the mutations after mutation 34 ⟨Q1: set A shown⟩

Each block keeps the 33/34 discipline:
- **Four checks:** the edit is not a no-op (`cmp`); no unmutated copy survives; the mutation landed; it landed exactly once.
- **Named-test check:** if the run is not `red`, the gate fails. If it is red but not at the named test, the gate fails with *"red for the wrong reason."*
- **Quoting:** where `$` or single quotes would break a `sed` script, the replacement line comes from a heredoc read with awk `getline`, as mutations 14 and 32 do.

**35 — board word left un-swapped in a SPRINT mover.** Must red `S2`.
- Tree: `cp -R "$repo/claude" "$work/claude-mutant-sprint-mover-board"`. Target: `skills/fkit-sprint-cancelled/SKILL.md`.
- Edit: `sed -i.bak 's|\.\./\.\./cancelled/X|../../done/X|'`.
- **No injected marker:** the wrong board word *is* the marker (mutation 34's reason).
- Checks:
  - no-op (`cmp`);
  - `diff .orig mutant | grep -c '^&gt;'` = 1;
  - `grep -c '\.\./\.\./done/X'` = 1.
- Run `run_mover_step_suite`. Named check: `grep -Eq '(✖|not ok|fail).*S2 both sprint movers: the substituted sentences'`. The pattern leaves out the title's apostrophe on purpose.
- The comment names mutation 34 as the precedent and closes its *"before task 0341 pastes the clause a third and fourth time"* loop.

**36 — negation instead of argument swap in `mode_successor`.** Must red `successor S6`.
- Copy: `make_repo_copy repo-mutant-successor-negation`.
- **Edit is scoped to the function:** awk sets `in_fn` on `/^mode_successor\(\) \{/` and clears it on the first `/^}/`. Inside, it replaces the first `|| identity_gt "$_best_id" "$_i"; then` line with `    if [ -z "$_best_id" ] || ! identity_gt "$_i" "$_best_id"; then # mutation: successor tie-break negated`.
- Checks:
  1. no-op (`cmp`);
  2. inside the function body (extracted by the same awk range), `|| identity_gt "$_best_id" "$_i"; then` count = 0;
  3. **select-active was not also mutated:** the same text across the whole file = 1;
  4. marker `mutation: successor tie-break negated` count = 1.
  - A text count of `! identity_gt "$_i" "$_best_id"` is not used: it matches two comments.
- Run `run_dashboard_suite`. Named check: `grep -Eq '(✖|not ok|fail).*ADR-047 successor S6:'`. The trailing colon matters: without it, a check on S1 would also match S10.

**37 — `🔲 Backlog` dropped from the successor filter.** Must red `successor S3`.
- Copy: `make_repo_copy repo-mutant-successor-backlog`.
- Edit: replace the line `      'Backlog'|'In progress') ;;` with `      'In progress') ;; # mutation: Backlog dropped from the successor filter` (heredoc + awk).
- Checks:
  - no-op;
  - `'Backlog'|'In progress'` count = 0;
  - marker count = 1.
- Named check: `ADR-047 successor S3:`. The comment records the measured extra red on `S4`: that fixture's successor is a Backlog board.

**38 — ordering made non-strict.** Must red `successor S4`.
- Copy: `make_repo_copy repo-mutant-successor-nonstrict`.
- Edit: replace `    identity_gt "$_i" "$2" || continue` (the comment tail is matched, not anchored on) with `    { identity_gt "$_i" "$2" || [ "$_i" = "$2" ]; } || continue # mutation: successor ordering non-strict`.
- Checks:
  - no-op;
  - the original line's count = 0;
  - marker count = 1.
- Named check: `ADR-047 successor S4:`. The comment records the extra red on `S7`: its fixture holds the closing board itself, `In progress`.

**⟨Q1 = B⟩:** only 35 and 36. **⟨Q1 = C⟩:** add one of:
- **39′ — task-mover word pasted in.** `where the board file just moved` → `where the folder just moved` in `fkit-sprint-done`. No marker. Named check on `S2`, plus a grep of the output for `ATTRIBUTION_RULE`, so it cannot be confused with 35.
- **39″ — multi-line guard removed.** Delete the `[ "$2" = "$(printf '%s' "$2" | head -1)" ] ||` / `die … multi-line value …` pair. Named check `successor S9:`.

**⟨Q1 = D⟩:** drop 38.

## 5. Item A ⟨Q3 = keep, A2⟩

Append to the end of `test/dashboard-contract.test.js`. No existing assertion is edited. The block reuses `sprintsFixture`, `runMode`, `run`, `BANNER`, `prosePlan` and `boardPlan`.

**Tests:** one test per claim. Each does two things:
- **(i)** flat-matches (whitespace-normalized, exactly once) the claim's sentence in each named `claude/skills/&lt;skill&gt;/SKILL.md`, read from `REPO`. That works inside a copy too, which is what lets mutation 39 reach it.
- **(ii)** runs the behaviour the sentence claims.

The claims:
- **E1 — `select-active` stays silent.** Prose: both sprint movers, *"⛔ **Not `select-active`.** It filters to `In progress` before its own `ambiguous-active-sprint`"*. Behaviour: two `🔲 Backlog` boards claiming one identity, run through `select-active`, produce no `ambiguous-*` fact.
- **E2 — the render reports the collision.** Prose: both sprint movers, *"read its `⟦FACTS⟧` for `drift ambiguous-plan-identity`"*. Behaviour: rendering either board of the same fixture emits `drift ambiguous-plan-identity`, whatever the status.
- **E3 — the value modes carry no drift.** Prose: both sprint movers, *"step 1 calls `identity` and step 2 calls `successor`, and both answer with a value and no drift"*. Behaviour: on that fixture, `identity` and `successor` output contains no `drift` line.
- **E4 — `fkit-status` lists each record under the mode that emits it.** Prose: `fkit-status/SKILL.md`'s `select-active` list entry `drift ambiguous-active-sprint identity="…" chosen="…" also="…"` and its render entry `drift ambiguous-plan-identity identity="…" plan="…" also="…"`. Behaviour: two `In progress` boards → `select-active` emits `ambiguous-active-sprint`; the render emits `ambiguous-plan-identity`.

**Failure messages:**
- Each message says which half broke.
- If behaviour broke, update the prose in all named sites together.
- If prose broke, re-read the behaviour and do not edit the constant to go green.
- Messages carry no coordinates, per `conventions/durable-citation-anchors.md`.

**Comments in `dashboard.sh`:** not pinned. They sit beside the code they describe; the `SKILL.md` text is what an operator follows.

**Mutation 39** (a new guard is owed a mutation by this task's own reasoning):
- Copy: `make_repo_copy repo-mutant-emitter-prose`.
- Edit: in `claude/skills/fkit-sprint-done/SKILL.md`, change `for \`drift ambiguous-plan-identity\`, which names` to `for \`drift ambiguous-active-sprint\`, which names`. This is the documented defect class.
- No marker: the wrong record name is the marker.
- Four checks, as 35. Named check on E2's title.
- About 25 s extra.

**⟨Q3 = A1⟩:** new `test/emitter-map-prose.test.js`; mutation 39 then uses `make_claude_copy` plus a new env-var seam.
**⟨Q3 = A3⟩:** only the (ii) halves; no prose pin and no mutation 39.
**⟨Q3 = split⟩:** skip step 5; the producer files a new brief.

## 6. Keep the index in step (same file)

- Header line `THIRTY-FOUR mutations` → the new total. Add one index line per new mutation in the existing `N. … → "named assertion" (task 0388)` format.
- Update 0i's and 0o's *"would be false"* lists to name the new mutations.

## 7. Verification

1. `sh -n test/prove-red.sh` and `bash -n test/prove-red.sh`.
2. `time bash test/prove-red.sh`:
   - exits 0;
   - every new entry prints `red`;
   - no *"red for the wrong reason"*, *"MUTATION WAS A NO-OP"*, *"MUTATION DID NOT LAND"*, *"WRONG TARGET"* line;
   - no older mutation regressed.
   - Record before/after wall time. If the added time falls far outside 60–120 s (or, with mutation 39, about 85–145 s), raise it with the owner.
3. **Does each new check actually fail when it should?** On a scratch copy of `prove-red.sh` only (never the real file):
   - break one new anchor and confirm the NO-OP branch fires;
   - point one named check at a wrong title and confirm *"red for the wrong reason"* fires.
   - Record both in the worklog.
4. **Changed files:** diff `git diff --name-only` and `git status --porcelain` against the step-1 snapshot.
   - Allowed new changes: `test/prove-red.sh`, ⟨Q3⟩ `test/dashboard-contract.test.js`, and the task-folder records.
   - Anything else is a failure.
5. `npm run test:unit`: totals equal the baseline, ⟨Q3⟩ plus exactly the new E-tests, all passing.
6. `node --test test/reference-integrity.test.js`: 0 broken, no new `NAMED_EXEMPT` entry. Also `node --test test/coordination-citation-policy.test.js`: L2 green, which proves Item B's rule held for this task's own records.

## 8. Review

Ask `@fkit-reviewer` for `fkit-stateful-review` on the working tree, task-id `0388`, and relay its report verbatim. Its `review.md` sits in `backlog/`, so the Item B rule from step 0 applies to both the reviewer's and the coder's sections.

## 9. Risks / edge cases

- **The 25 s suite time is from one in-place run.** Under the gate's load it may be slower; step 7.2 measures the real number.
- **BSD `sed -i.bak` and BSD awk on macOS.** Both are already used by mutations 32–34; nothing GNU-only is introduced.
- **Only function-scoped checks are safe for 36.** A file-wide survivor check would falsely report *"WRONG TARGET"* because `select-active` legitimately carries the same line. A first-match `sed` would silently hit `select-active` if the functions were ever reordered.
- **Named-test greps need a trailing colon** (`successor S1` would also match `S10`). Titles with apostrophes or backticks are matched on a prefix that avoids them.
- **The by-hand results came from 0341's build-time code.** `mode_successor` gained the multi-line guard in review afterwards. The predictions above were re-derived from the current code, and step 2 measures them.
- **E3's fixture may not be the one 0341 used.** If `successor` on a colliding identity behaves in a way the prose does not claim, that is a finding: report it and do not bend the test.

## 10. Owner rulings on the open decisions (2026-09-14, via `AskUserQuestion` in the `fkit lead` session — verbatim option labels)

- **Q1:** "4 mutations: 35–38 (Rec)" → set A: mutations 35, 36, 37, 38.
- **Q2:** "One task (Rec)" → both surfaces stay in 0388.
- **Q3:** "Keep; test docs + behaviour (Rec)" → Item A stays in 0388 as design A2: tests E1–E4 appended to `test/dashboard-contract.test.js`, plus mutation 39. The brief's verification step 4 is re-worded to allow `test/dashboard-contract.test.js` alongside `test/prove-red.sh` and the task-folder records.
- **Q4:** "Follow it, change nothing (Rec)" → Item B = B1: applied to this task's own records only; no file changes for Item B.
- **Driver note on §8 (orchestrated path):** under `fkit-sprint-ship-loop` the builder does not request the review itself — the driver's separate Review step spawns `fkit-reviewer` (`fkit-stateful-review`, task-id `0388`), and a separate Process-review step answers it. Build ends at §7.
