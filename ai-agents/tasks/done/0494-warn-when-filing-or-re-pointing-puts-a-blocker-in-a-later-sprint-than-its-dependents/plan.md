# Plan: 0494 — warn when filing or re-pointing puts a blocker in a later sprint than its dependents

**Approving this plan is the owner's "specific word" the brief asks for.** Nothing is built before that approval.

## 0. Goal
`/fkit-task-brief` and any producer edit that adds or re-points a `Depends on:` line run a check on the result. When an open task on a sprint board would wait on an open task that its sprint can't count on, the producer **warns, and never refuses**. The check reuses 0492's `drift depends-on-later-sprint` record. The warning offers three ways out, and each one carries its knock-on, because each is a placement question under 0495's convention. In a session it is an `AskUserQuestion`. A spawned producer returns it as a `NEEDS-DECISION`. The check never blocks filing and never moves anything by itself.

## 1. Facts gathered (checked this turn)
- **No test pins `/fkit-task-brief`'s step list.** I grepped `test/` for references to that skill and for any step 9 or 10. The only mentions are comments: "step 6" in task-id-uniqueness and "SKILL.md:70" in dashboard-contract. Both sit above the insertion point, so neither moves.
- **Nothing outside the skill cites its steps 9 or 10.** I grepped `claude/`, the knowledge base, `README.md` and `CONTRIBUTING.md`. Renumbering is safe.
- **No test pins 0495's wording.** I grepped for `knock-on` and `placement-questions` in `test/`: no matches.
- **The skill already runs `dashboard.sh` in board mode the same way other skills do.** `/fkit-sprint-done` and `/fkit-sprint-cancelled` call `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/<basename>` and read `⟦FACTS⟧`. The producer owns `fkit-status`.
- **`dashboard.sh` is fast enough.** Rendering both live boards here took about 10 s. A board whose identity is `Backlog` never gets the 0492 check, so it can be skipped. That decision goes through `dashboard.sh identity`, which is fast.
- **Fixture probe** (scratchpad, well-formed banners: Sprint 6 🔄, Sprint 7 🔄, Sprint 8 🔲). Task 0001 on Sprint 7 depends on 0010 on Sprint 8. Tasks 0002–0006 on Sprint 7 stand behind 0001. Task 0008 on Sprint 6 depends on 0001.
  - Sprint 7 gives `0001 blocker="0010" … reason="not-started"` plus 5 `via` records.
  - Sprint 6 gives `0008 blocker="0001" reason="later-sprint"`. It names 0001, not 0010, because 0492 does not follow chains across boards.
  - With 0010 set to `✅ Done`: 0 records.
- **Two convention files are hashed in `claude/structure-manifest.tsv`:** `dependency-declaration-form.md` and `placement-questions-state-the-knock-on.md`. Editing either means regenerating the manifest. **This plan edits neither.**
- **The working tree already holds uncommitted 0495 edits** to `fkit-task-brief/SKILL.md` and `fkit-producer.md`, and `CHANGELOG.md` is modified. Review therefore uses a snapshot diff, not `git diff`.
- **The wiki has nothing on cross-sprint dependencies.** 0492 recorded the same gap.

## 2. Design

### 2a. Who counts as "touched" (decides which records concern this edit)
- **The touched tasks** are:
  - every brief this run created;
  - every brief whose `Depends on:` line this edit added or re-pointed;
  - with Q1 = yes: for a move, every open task whose `Depends on:` names the moved task.
- **A record concerns this edit when its `<task>` is a touched task.** Records are grouped by `blocker`.
- **Why not also match on `blocker`/`via`, or on IDs a line merely names:** that would raise warnings about waits that existed before the edit and that the edit did not cause. Example: filing a brief on the Backlog board that names a sprint task which already has a record.
- **Tasks standing behind** (same board or another board) are counted with 0495's *How to find them* search, which the options need for their knock-ons anyway. Every `via` record for that blocker must be in that count. If one is missing, it is added and the gap is said aloud.

### 2b. Which boards are rendered
- **Every top-level `ai-agents/sprints/*.md`** except those whose `dashboard.sh identity` prints `Backlog`. Not just the board filed on: a re-pointed dependent can sit on any board. Archive folders are not live and are not read (0492's accepted residual).
- **This answers the brief's "dependent on a different board" case with no code addition.**

### 2c. What each outcome reports
- **No concerning record:** `placement check: none (checked: <boards>)`. Same-sprint and closed blockers never produce records (0492 §2 rows 1 and 2), which satisfies verification step 2.
- **The check could not run:** a render that exits non-zero, or prints no `⟦FACTS⟧…⟦END⟧`, is reported as `placement check not run: <board> — <why>`. A touched task with a `drift depends-unparseable` record is reported as `not fully checked: <task>'s Depends on: line is unreadable`. **A check that did not run is never reported as a pass.**
- **The warning, one per blocker:** it gives
  - the blocker and `blocker_sprint`;
  - `reason` in plain words: Backlog board / sprint not started / later sprint / sprint closed / sprint could not be resolved, which covers an archived closed sprint;
  - each direct dependent (a record with no `via`) and the identity of its board;
  - indirect dependents ("waits through <via>");
  - how many open tasks stand behind each one.
- **Three ways out, each a placement option carrying its knock-on per 0495's convention:**
  1. **Move the dependents to the blocker's sprint.** If the blocker is on the Backlog board, that means de-scoping them. The knock-on states which tasks behind them would then wait on which sprint.
  2. **Place the blocker earlier**, in the dependents' sprint or before it. The knock-on states the same-sprint wait (0495's "always" scope ruling).
  3. **Accept it and record why**: one line in each direct dependent's `## Notes` and in the board's dated addendum. The knock-on is that they keep waiting on Sprint M.
  - The step does not mark a recommendation for the asker. The asker marks one only if they have one.
- **Already ruled:** if the owner chose this exact placement, in this session, from a question whose option stated this knock-on (0495), the producer does not ask again. It reports the warning as accepted and records it as option 3. *(My design choice, to avoid asking twice. Strike it at approval if you want the warning asked regardless.)*
- **Carrying out the choice:** a move is a producer edit made after the skill, using step 8's board procedures (a pull is 3 edits, a de-scope 5). The skill's write surface does not grow. Recording an acceptance writes only a brief this run created and the board this run edited. A note on any other brief is a producer edit under the new fkit-producer rule.
- **Timing:** when a filing comes with a re-point (the incident shape), the re-point is a producer edit outside the skill. **The check runs after the re-point.** A check run before it finds nothing, because no brief names the new task yet.

### 2d. Limits stated in the step, inherited from 0492
- Only 4-digit IDs are read.
- An ID marked `— soft, not hard` is skipped. The step tells the producer that this marking is how to declare a soft dependency, as one sentence, so the convention file does not change (see Q2).
- An archived closed sprint reads `sprint-unresolved`.
- **Not flagged:** a chain across boards, e.g. touched T → V on an earlier board → W on a later sprint. 0492's `via` stays on one board. See Q3.

## 3. Files and edits (canonical `claude/` only, never `.claude/`)

### 1. `claude/skills/fkit-task-brief/SKILL.md`
- **Step 3's 0495 sentence**, "here, and at step 1 … and step 5 …": add "and step 9 (the placement warning)". This merges with 0495's text by hand; nothing is restated.
- **New `### 9. Check where the dependencies landed — warn, never refuse`**, inserted after step 8 and before "Never". Content, about 35–45 lines:
  - authority: owner ruling (b), 2026-10-05, *"Warn when filing"*, task 0494;
  - why it warns and never refuses (the owner rule "split build and verify");
  - the timing rule (after the re-point);
  - the render loop as runnable commands (§2b);
  - the touched filter (§2a);
  - none / not run / not fully checked (§2c);
  - what the warning contains;
  - the three options, each with a knock-on, linking `../../../ai-agents/knowledge-base/conventions/placement-questions-state-the-knock-on.md` and its *How to find them* section, not restating it;
  - session → `AskUserQuestion` (one question per blocker, batched); spawned → `NEEDS-DECISION` in the report (ADR-021), with nothing asked, moved or recorded;
  - the already-ruled clause;
  - how a choice is carried out;
  - the limits (§2d), including the soft-marking sentence.
- **Renumber:** `### 9. Never` → `### 10.`, `### 10. Report` → `### 11.`.
- **Report (now step 11):** a new bullet, **Placement check (step 9):** the warnings and the owner's answers; when spawned, the `NEEDS-DECISION` verbatim; otherwise `none (checked: <boards>)`, or the `not run` / `not fully checked` line with its reason.
- **Write-surface paragraph** (the one that says the skill "creates new Markdown briefs and edits exactly one board"): one added sentence. Step 9 renders boards read-only. Recording an acceptance stays inside the same surface. Anything else is a producer edit after the skill.

### 2. `claude/agents/fkit-producer.md`
- **New bullet in Behavioral rules**, directly after "Flag dependencies and conflicts proactively". It points to 0495's sentence and does not repeat it:
  > **Warn — never refuse — when an edit leaves a sprint task waiting on a later sprint.** Owner ruling (b), 2026-10-05 (task 0494). After any edit you make outside `/fkit-task-brief` that adds or re-points a `Depends on:` line [Q1: or moves a task to a later sprint or to the Backlog board], run that skill's step-9 check on the result. Run it after the edit, because a check before it finds nothing. Warn the same way: an `AskUserQuestion` in a session, a `NEEDS-DECISION` when spawned. Never block or undo the edit, and never move anything on your own.

### 3. `CHANGELOG.md` → `## Unreleased`
- One line. Filing a brief, or re-pointing a `Depends on:` line, now warns (never refuses) when a sprint task would wait on a task in a later or not-started sprint or on the Backlog board. The warning offers: move the dependents, place the blocker earlier, or accept and record why.

### Not edited, on purpose
- Both copies of `dependency-declaration-form.md` and of `placement-questions-state-the-knock-on.md`. Both are hashed in the manifest, and editing them would push a `/fkit-heal` change to every fkit user (Q2).
- `dashboard.sh` (Q3).
- `fkit-lead.md` (0498's file). The lead is a relayer and is already covered by 0495.
- `fkit-sprint-ship-loop` (0493's file).
- `.claude/` copies. Those refresh on the next `fkit` launch.

## 4. Sequencing
1. **Snapshot.** Copy `SKILL.md`, `fkit-producer.md` and `CHANGELOG.md` with their sha256 to `<scratchpad>/0494-snap/`. All three already carry other tasks' uncommitted edits. **The review diff is `diff -u snapshot current`, not `git diff`.** `CHANGELOG.md` is re-snapshotted right before its own edit, in case 0493 adds a line meanwhile, and only my hunk is diffed.
2. **Fixture script** at `<scratchpad>/0494-fx/` (not a repo file). It builds:
   - **F1 (verification 1):** Sprint 7 🔄 with T, 5 tasks behind T, and one more on Sprint 6 depending on T. A new brief V is filed into Sprint 8 🔲, then T is re-pointed at V.
   - **F2 (verification 2):** filing into the same sprint.
   - **F3 (verification 2):** a blocker that is `✅ Done`.
   - **F4:** the blocker on the Backlog board.
   - **F5 (the §2c timing check):** run before the re-point → none.
   It runs the step-9 commands verbatim and saves the `⟦FACTS⟧` output.
3. Edit `SKILL.md`, then `fkit-producer.md`, then `CHANGELOG.md`.
4. **Walk-through.** Follow step 9 by hand on F1–F5 and write out the warning text for F1: the dependents, the count behind (6, including the Sprint 6 task), the blocker, both sprints, and three options with knock-ons. Also write the spawned `NEEDS-DECISION` form. The text goes in `worklog.md` for the review (verification 1).
5. **Grep checks.** Confirm "warn, never refuse" and `NEEDS-DECISION` appear in step 9 (verification 3), and the rule appears in `fkit-producer.md` (verification 4).
6. Run the checks (§5).
7. **`worklog.md` decision log.** Record the touched filter, the all-boards render, the already-ruled clause, and Q1–Q3 as answered.

## 5. Checks (CONTRIBUTING "What to run for a change")
- **`npm run test:unit`** (about 1 min). Required: `.md` files under `claude/` that `test/prove-red.sh` does not name. I grepped prove-red for `fkit-task-brief` and `fkit-producer`: no match. This covers skill-frontmatter, skill-ownership and plan-review-switch, which reads `fkit-producer.md`.
- **`npm run test:docs`** (about 30 s). Required because the driver writes `plan.md` and `worklog.md` into the task folder under `ai-agents/`.
- **`node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js`**, run explicitly as verification step 5 asks. Both are also inside `test:docs`.
- **Where they run:** a scratch copy of the repo including `.git`, run one at a time and never in parallel with other runs, so other agents' writes don't land mid-run.
- **Skipped: full `npm test`.** Nothing changes under `claude/scaffold`, no non-`.md` file under `claude/` changes, nothing under `test/` changes, and prove-red names neither file. **Zero full runs are planned**, inside the "at most one" budget.
- **Skipped: a new automated test.** The step is prose an agent follows, so a wording pin would prove little and would move the change into the heavy `npm test` row. **Unverified until first real use:** that a real producer agent follows step 9 correctly. The walk-through is me following the prose by hand.
- **Not needed: manifest regeneration** (no hashed file touched). I will confirm the sha256 of `claude/structure-manifest.tsv` is unchanged before and after.
- **`CHANGELOG.md`:** no automated check covers it. I will check by eye that its links resolve.

## 6. Risks and edge cases
- **A check run before the re-point finds nothing.** The step and the producer rule both say "after"; F5 shows it.
- **Two live boards with one identity:** 0492's first-match rule applies, and the render's `ambiguous-plan-identity` drift is passed on.
- **A malformed banner on a blocker's board** reads `sprint-unresolved`, which is still loud.
- **A soft dependency written in a form the reader misses** (`soft: 0110`) is read as hard, so it over-warns, which is the safe direction. `(not soft)` reads as soft and is missed. Both are 0492's limits, stated.
- **More than 4 blockers in one edit:** `AskUserQuestion` takes up to 4 questions per call, so the step says to batch the questions in groups of four or fewer.
- **The owner's own rules** add an "Explain more, then ask again" option. 0495 already says that option carries no knock-on. Step 9 does not hard-code it.
- **Cost:** about 1–3 s per live sprint board, plus the identity probes. The Backlog board is skipped.
- **Overlaps:**
  - 0493 (planned in parallel) edits only `fkit-sprint-ship-loop`, with no shared file except `CHANGELOG.md`. Both map `reason` values to plain words, so I suggest the same words; those used here are listed in §2c.
  - 0450 and 0457 rewrite these two files; whichever lands second carries this change.
  - 0498 edits `fkit-lead.md`, which this plan doesn't touch.
