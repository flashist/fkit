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

Edit the canonical sources under `claude/` (never the `.claude/` copies) and `CONTRIBUTING.md`, to the
rules the signed-off `0527` ADR sets:

1. **Narrow the coder rule:** add a test only for behaviour on the ADR's allowed list (shipped-script
   behaviour); never a new test file or prove-red case without the owner's approval, under the cap.
2. **Reviewers:** *"missing test"* on correct code is a **suggestion, not a defect** — except for the
   ADR's short key list. Edit the adversarial hunt items to match, in `fkit-adversarial-review`,
   `fkit-review` and `fkit-stateful-review` (and the coder's `fkit-process-review` /
   `fkit-process-stateful-review` if they classify it).
3. **Scope "when unsure" to the fast suite:** the Verify wording in the ship-loops, `fkit-plan-task` and
   `fkit-review` says *run the default `npm test`* — no "full suite" beyond it, no "run more".
4. **CONTRIBUTING:** rewrite *What to run for a change* for the smaller suite (drop "when in doubt,
   run more"). The timing figures are `0530`'s job — mark them "to be re-measured by `0530`" here
   rather than inventing one.
5. **Add the retire rule** the ADR sets (how a test is removed when it no longer earns its keep), if
   the ADR sets one.
6. Sweep for other copies of the same wording (`grep` the canonical sources and the shared rules
   block) and fix or list each.

## Verification steps

1. Each wording above is changed; `worklog.md` shows a before / after line for every file touched.
2. A `grep` over `claude/` and `CONTRIBUTING.md` for *"when in doubt, run more"*, *"full suite"* and
   *"when unsure"* returns only lines that match the new rule — paste the output.
3. `claude/fkit-claude-init.sh .` refreshes the dogfood copies without error.
4. The default `npm test` passes (state the count). **No new test file and no new prove-red case is
   added by this task** — wording guards are exactly what option D removes.

## Notes

- **Depends on:** 0527
- **Blocks:** nothing
- Independent of `0529` — touches prompts and CONTRIBUTING, not tests — so they can ship in either
  order. If both are in flight, `CONTRIBUTING.md` is touched by `0528`, `0529` and `0530`: sequence the
  edits.
- ⛔ **Do not start without the owner's specific word.** Being pullable is not his word.
  - **2026-10-19 — the owner's specific word is given.** Via `AskUserQuestion`, `fkit lead` session,
    selected option text, verbatim: *"New Sprint 13, start now (Recommended)"* — description he saw:
    *"Sprint 13 holds only 0526–0530; starting it is your word for all five. Sprint 12 stays paused.
    Knock-on: none."* Relayed verbatim to a spawned `fkit-producer` (no owner channel, ADR-021). The
    line above is kept as the record; it is now satisfied.
    ⚠️ This is the word to start, not a waiver of the ADR gate: the work still waits for `0527`'s
    owner sign-off.
