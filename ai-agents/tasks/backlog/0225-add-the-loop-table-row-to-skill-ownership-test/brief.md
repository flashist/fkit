# Add the loop-table row↔ownership test

## ID
0225

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-up 4 of `0200`'s report**, filed on a **named owner ruling** taken via `AskUserQuestion` in a
live `fkit lead` driver session on **2026-08-05**: *file items 1, 2, 3 and 4 from `0200`'s unfiled
follow-ups list*. Source:
[`2026-08-05-eval-process-review-step-role-ownership.md`](../../../knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md)
**§5 candidate (iii), S14, and §8 item 4**. **Cite the report by path; do not re-narrate it.**

**What is unguarded.** The sprint loop's step-2 spawn table pairs a **role** with a **skill** in each
row. Nothing checks that the paired role actually owns that skill in `skills_for_role()`
(`claude/skills-for-role.sh`). The two agree today, and a future edit to either side can silently
orphan a row from the ownership list — the loop would then instruct a driver to spawn a role that the
ADR-018 `PreToolUse` hook will deny.

Measured on disk 2026-08-05, `claude/skills/fkit-sprint-ship-loop/SKILL.md` step-2 table — the rows
that name a skill:

| Row | Role named | Skill named | Owned per `skills_for_role()` |
|---|---|---|---|
| Plan | `@fkit-coder` | `/fkit-plan-task` | yes (`skills-for-role.sh:52`) |
| Build | `@fkit-coder` | *(names none)* | n/a |
| Verify | `@fkit-coder` | *(names none — tests, per ADR-014)* | n/a |
| Review | `@fkit-reviewer` | `/fkit-stateful-review` | yes (`:55`) |
| Process review | `@fkit-coder` | `fkit-process-stateful-review` | yes (`:52`) |
| Close | `@fkit-producer` | `/fkit-task-done` | yes (`:51`) |

---

### ⚠️ MANDATORY HONESTY CLAUSE — carry this into the test's own header comment and the worklog

> **This test does NOT catch a driver departure.**
>
> The row and `skills_for_role()` **already agree today and agreed throughout** (report S7). The test
> therefore **passes today and would have passed on 2026-08-02** — it would have caught **none** of
> `0158`, `0143` or `0195`. The plan for `0200` claimed it *"would have caught this at authoring time,
> before task one"*; **that claim is wrong and is corrected in the report at S14.**
>
> **What it does catch is a different, real failure:** a future edit that orphans a loop-table row from
> `skills_for_role()`.
>
> ⛔ **A test, brief or worklog implying otherwise ships a false guarantee.** Detection of a driver
> departure is `0224`'s job — the paired denial log and worklog `**Role:**` line.

---

## What to build

A new test under `test/`, per **ADR-014** — `node --test`, **zero devDeps**.

For every row in `claude/skills/fkit-sprint-ship-loop/SKILL.md`'s step-2 spawn table that names both a
role and an fkit skill: assert that role owns that skill according to `skills_for_role()`.

**Design notes for the plan (not prescriptions):**

- **Two independent sources, deliberately.** Parse the **table** for the row side; read
  `skills_for_role()` for the **ownership** side. ⚠️ **Do not misapply the mirror precedent here.**
  `test/skill-ownership-hook.test.js` keeps *"a MIRROR of `skills_for_role()`, not derived from it — a
  test whose oracle is the implementation tests nothing"* because it is testing the **hook** against
  the function. This test's subject is the **table**, so `skills_for_role()` is the legitimate oracle
  and sourcing it is correct.
- Rows naming **no** skill (Build, Verify) must be skipped, not failed.
- A role token appears as `@fkit-<role>`; a skill appears with or without the `/` prefix (the
  Process-review row uses the bare form deliberately — see `0223`). **Handle both forms**, and do not
  "normalize" the bare form away.
- The parser must **fail loudly if it matches zero rows.** A table-shape change that silently makes the
  test vacuous is the exact failure mode this test exists to prevent.
- `test/skill-frontmatter.test.js` is the closest precedent for a live-corpus walk; follow its shape.

### Out of scope

- ⛔ Do not change `claude/skills-for-role.sh` or any loop-table row — this task adds a guard, it
  repairs nothing. Row content changes belong to `0223`.
- ⛔ Do not extend the test to other loops' tables in this task. If `fkit-task-ship-loop` warrants the
  same guard, that is a separate brief.
- ⛔ Do not add a devDependency. ADR-014 is `node --test`, zero devDeps.

## Verification steps

1. `node --test test/` passes, with **no new entry in `package.json`'s dependencies or
   devDependencies**. Prove the second by diffing `package.json` — it must be unchanged.
2. **The test fails red on a real break.** Temporarily edit a copy of the step-2 table so one row names
   a role that does not own the skill it names (e.g. `@fkit-architect` against
   `fkit-process-stateful-review`); the test **fails**. Restore. Record the red output in the worklog.
   **A guard never seen to fail proves nothing.**
3. **The test fails red on a vacuous parse.** Point it at a fixture with no matching rows; it fails
   rather than passing on zero assertions.
4. All four skill-naming rows are actually asserted — the test reports **4** row assertions, not fewer.
   Build and Verify are skipped, not silently dropped as unmatched.
5. The bare-form row (`fkit-process-stateful-review`, no `/`) **is** matched. A test that only handles
   the `/fkit-*` form silently skips the one row this whole thread is about.
6. **The honesty clause is present in the test file's own header comment**, in the words above: it does
   not catch a driver departure; it catches a future edit orphaning a row from `skills_for_role()`.
7. `git diff --stat` shows changes confined to `test/`.

## Notes

- **Depends on:** `0222` (records ADR-038 — the rule the table row encodes).
  - **⚠️ DATED CORRECTION 2026-08-06 — THIS DEPENDENCY IS RELAXED. The line above is left
    byte-identical and is no longer binding.** **Owner ruling, verbatim: *"Relax 0224 and 0225."***
    Given 2026-08-06 via `AskUserQuestion` in a live `fkit lead` session. **Current dependency:
    `Depends on: nothing`.**
    **Why.** This task is a *test*. It asserts that every skill named in the sprint-loop table is one
    `skills_for_role()` actually grants to the role that runs the step — a property that holds
    whichever way ADR-038 words the rule, so the test does not need ADR-038 to exist before it can be
    written. Of the three briefs that declared `Depends on: 0222`, only `0223`'s survived the owner's
    review, and only for its **reason clause** — see the `0222` row on
    [Sprint 3](../../../sprints/sprint-3.md).
    **What this does NOT change.** Scope, the merit position below (still the lowest-merit of the
    four — do not run it ahead of `0224`), and the **ordering note** immediately below, which was
    never a hard dependency and stays exactly as written.
- **Blocks:** nothing.
- **Owner:** fkit-coder — a test under `test/`.
- **Size: small.** One test file, existing patterns.
- **Merit position, for the owner:** **the lowest-merit of the four.** It guards a failure that has
  never occurred, where `0224` guards one that has occurred three times. Cheap, so worth doing — but
  not ahead of `0224`.
- ⚠️ **Ordering note, not a hard dependency:** `0223` edits the Process-review row. If `0223` lands
  first, this test must match the edited row. Either order works; the second to land re-verifies.
- ⚠️ **Filed on the Backlog board because the owner's ruling named no sprint.** A spawned producer has
  no owner channel and never invents a sprint placement. **Flagged for owner confirmation: Sprint 2
  may be the intended home**, alongside `0222`.
