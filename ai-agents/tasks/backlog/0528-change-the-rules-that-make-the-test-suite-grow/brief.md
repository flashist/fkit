# Change the rules that make the test suite grow

## ID
0528

## Sprint
Sprint 13

## Priority
P3

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Part of the test-suite reduction** (owner decision and rulings quoted in `0527`'s brief, *Owner
rulings*). Chain: `0526` + `0527` → `0528` / `0529` → `0530`.

> **2026-10-19 — re-scoped to [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
> (accepted 2026-10-19).** By owner instruction, `fkit lead` session: via `AskUserQuestion`, selected
> option text, verbatim: *"Stop; re-brief first (Recommended)"* — description he saw: *"Run ends now.
> Next: producer updates 0528–0530 to ADR-057. Knock-on: 0528, 0529, 0530 stay Backlog in Sprint 13
> until a new run."*; then typed, verbatim: *"Commit and then rewrite"*. Relayed verbatim by the lead
> to a spawned `fkit-producer` (no owner channel, ADR-021). *What to build* and *Verification steps*
> are rewritten to the ADR; every owner-ruling quote in this brief is kept as written. Main changes:
> no numeric cap (Q3 replaces ruling 3's *"under a cap"*); project-neutral shipped wording, fkit's own
> rules in `CONTRIBUTING.md` (Q6 (a)); no invented retire rule; the no-key-list default goes to the
> owner in the plan.

**Why this is its own task.** The 2026-10-19 reviewer consult warned: cutting tests without changing
the rules that add them lets the suite grow back. Today's rules push every task toward more tests and
more full runs, and no rule ever retires a test.

**Owner ruling 3, `AskUserQuestion`, fkit-lead session, 2026-10-19 (⚠️ the lead's relay):** selected
*"Owner-approved only (Recommended)"* — *"New prove-red case only with your OK, under a cap. 'Missing
test' on correct code = suggestion, not a defect (except a short key list). Coder rule narrowed."*

**The rules that drive the loop** (2026-10-19 reviewer consult, checked against the files):
- `claude/agents/fkit-coder.md`: *"add or update tests for the behavior you changed … when in doubt,
  run more"*.
- `claude/skills/fkit-adversarial-review/SKILL.md`: the *"Missing tests"* and *"a check that cannot
  fail"* hunt items.
- Verify wording *"full suite … when the tests or test tooling change, or when unsure"* in
  `fkit-task-ship-loop`, `fkit-sprint-ship-loop`, `fkit-plan-task`; `fkit-review/SKILL.md` *"the full
  suite when unsure"*.
- `CONTRIBUTING.md`'s *What to run for a change* table: anything under `test/` → full `npm test`;
  *"A release, or unsure → `npm test`. When in doubt, run more."*
- A habit, not a written rule: *"no test covers X"* on correct code filed as a **Defect** (`0334` R1,
  `0492` R2, `0493` R7, `0284` R1).

## What to build

The source of truth is [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
(accepted 2026-10-19) — read it whole, **including its dated ⚠️ / ⛔ notes**, which correct parts of
D3, D7, D9 and §Consequences. Where this brief and the ADR disagree, the ADR wins; say so in the plan.
This task's rows are the `0528` rows of ADR-057 §D9's table.

Edit the canonical sources under `claude/` (never the `.claude/` copies) and `CONTRIBUTING.md`:

1. **Two homes for the rules (ADR-057 §D9, owner Q6 (a)).**
   - **Shipped prompts** (everything under `claude/` that installs into a consuming project) get
     **project-neutral** wording — in substance: *follow the project's own test rules and key list; a
     missing test on correct code is a suggestion unless the project's key list names it; run the
     project's default test command.* They **never** state fkit's fence (D1), fkit's key list (D2.3)
     or fkit's 2-minute budget (D10).
   - **fkit's own rules** — the fence (D1), the growth stop and key list (D2), prove-red's lane (D3),
     the named exceptions (D7), the budget (D10) — go into `CONTRIBUTING.md` (and are already in the
     knowledge base as ADR-057). fkit's own agents read them there as "the project's own test rules"
     when they work in this repo, so the shipped wording must point an agent somewhere it will
     actually find them (e.g. the project's contributing / knowledge-base docs) — the planner picks
     the exact pointer.
2. **Growth stop, no numeric cap (D2.1–D2.2, owner Q3).** No new test file and no new prove-red case
   without the owner's OK — each one, every time, in any lane (default suite, nightly prove-red, the
   release-test script). **There is no numeric cap**: the owner's Q3 answer replaced ruling 3's
   *"under a cap"* wording (quoted in *Context*; kept there as the record). In shipped prompts this is
   neutral (*"a new test file needs the owner's OK where the project's rules say so"* — planner's
   wording); in `CONTRIBUTING.md` it is fkit's rule as stated.
3. **Missing test = suggestion, except the key list (D2.3, owner Q2).** fkit's key list, for
   `CONTRIBUTING.md`: (1) the argv the launcher hands to `claude`, including whether it `exec`s at all
   (`--resume`, cold start); (2) the role-lock `skillOverrides` matrix; (3) the skill-ownership hook's
   allow / deny decision; (4) any code path that writes or deletes a file in a user's project (init's
   convergence and never-overwrite rule, orphan cleanup, heal `repair.sh`). In shipped prompts:
   *"unless the project's own key list names it"*. Files (D9): `fkit-adversarial-review` (*"Missing
   tests"*, *"Missing or wrong tests … a check that cannot fail"*), `fkit-review`,
   `fkit-stateful-review`, `fkit-process-review` (*"a missing test, a broader pattern"*),
   `fkit-process-stateful-review` — wherever a missing test is classified.
4. **Scope "when unsure" to the default command (D9).** `claude/agents/fkit-coder.md` (*"add or update
   tests for the behavior you changed"*; *"Run the full suite before a release … when in doubt, run
   more"*), the Verify wording in `fkit-task-ship-loop` and `fkit-sprint-ship-loop`, `fkit-plan-task`
   (*"plan the full suite at release …"*) and `fkit-review` (*"the full suite when unsure"*) say *run
   the project's default test command* — no "full suite" beyond it, no "run more".
5. **`CONTRIBUTING.md`.** Add fkit's own test rules (point 1) with a link to ADR-057; rewrite *What to
   run for a change* for the rules (drop *"When in doubt, run more"*). **Not this task:** the rows
   naming deleted tests and prove-red (`0529`) and the timing figures (`0530`) — mark the figures *"to
   be re-measured by `0530`"* rather than inventing one.
6. **No retire rule is invented.** ADR-057 sets none (only the growth stop and its *re-raise only if*
   conditions). If the planner thinks one is needed, it is an owner question in the plan, not a build
   step.
7. **Sweep** (`grep` the canonical sources and the shared rules block for the phrases above, and for
   *"missing tests"* in agent / skill descriptions) and fix or list each hit.

**The plan must show the owner, before build (ADR-057 §D9, left to this task's planner):**
- the exact neutral wording for each shipped file; and
- **what a consuming project with no written test rules or key list gets by default.** Under the
  wording in point 1, every missing test there becomes a suggestion — a change in behaviour for every
  consuming project. The plan states that default plainly (and any alternative the planner thinks
  better) for the owner to approve.

**Overlaps with `0529`** (same files, different lines — sequence the edits if both are in flight):
`fkit-review` (its `test/prove-red.sh` reference is `0529`'s), `fkit-stateful-review` /
`fkit-process-stateful-review` (the named `test/coordination-citation-policy.test.js` is `0529`'s),
`CONTRIBUTING.md` (rules here; rows `0529`; times `0530`).

## Verification steps

1. Every ADR-057 §D9 row marked `0528` (or `0528` / `0529`, this task's half) is changed; `worklog.md`
   shows a before / after line for every file touched.
2. A `grep` over `claude/` and `CONTRIBUTING.md` for *"when in doubt, run more"*, *"full suite"*,
   *"when unsure"* and *"missing test"* returns only lines that match the new rules — paste the output.
3. No shipped file under `claude/` states fkit's fence, fkit's key list or the 2-minute budget —
   paste the `grep` used and its output.
4. `CONTRIBUTING.md` states D1, D2 (no numeric cap; the owner's OK per new test file / prove-red case;
   the four-item key list), D3's lane, D7's four named exceptions and D10, and links ADR-057.
5. `claude/fkit-claude-init.sh .` refreshes the dogfood copies without error.
6. The default `npm test` passes (state the count). **No new test file and no new prove-red case is
   added by this task** — wording guards are exactly what option D removes. If an existing guard test
   asserts a phrase this task changes, do **not** edit the guard to the new wording: say so in the plan
   and sequence with `0529`, which deletes those guards.

## Notes

- **Depends on:** 0527
- **Blocks:** nothing
- Independent of `0529` — touches prompts and CONTRIBUTING, not tests — so they can ship in either
  order. If both are in flight, `CONTRIBUTING.md` is touched by `0528`, `0529` and `0530`: sequence the
  edits.
  **2026-10-19:** the overlap is wider than `CONTRIBUTING.md` — `fkit-review` and the two stateful
  review skills are touched by both (see *What to build*). Order still free.
- ⛔ **Do not start without the owner's specific word.** Being pullable is not his word.
  - **2026-10-19 — the owner's specific word is given.** Via `AskUserQuestion`, `fkit lead` session,
    selected option text, verbatim: *"New Sprint 13, start now (Recommended)"* — description he saw:
    *"Sprint 13 holds only 0526–0530; starting it is your word for all five. Sprint 12 stays paused.
    Knock-on: none."* Relayed verbatim to a spawned `fkit-producer` (no owner channel, ADR-021). The
    line above is kept as the record; it is now satisfied.
    ⚠️ This is the word to start, not a waiver of the ADR gate: the work still waits for `0527`'s
    owner sign-off.
  - **2026-10-19 — the ADR gate is satisfied:** ADR-057 is `accepted` (owner sign-off Q7, quoted in
    its Status line). This brief was then re-scoped to it (see *Context*) before any build.
