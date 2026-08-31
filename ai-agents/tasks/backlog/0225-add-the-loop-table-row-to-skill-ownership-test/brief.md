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
    [Sprint 3](../../../sprints/done/sprint-3.md).
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

### ⭐ 2026-08-29 — ADR-044: THE PARSER MUST ACCEPT A **RULE-CELL** IN Plan/Build. The assertion gets STRONGER.

**Source:** [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
§C3, §C6, §Decision 1 — `Status: accepted` 2026-08-27, the deliverable of
[`0270`](../../done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/brief.md).
Filed as follow-on (iii) of §C2 on **owner ruling ND6**, verbatim: *"File all three after the ADR is
accepted (Recommended)"*. Written by
[`0347`](../../done/0347-note-adr-044s-oracle-rule-onto-0224-and-0225/brief.md).

**A design-note widening, not a re-scope.** Scope, out-of-scope, and the honesty clause above all
stand unchanged.

⭐ **What widens.** ADR-044 §C3, verbatim: *"its parser must accept a **rule-cell** in Plan/Build (a
skill→owner expression, not a literal)"*. Today every `Role named` cell the parser meets is a literal
`@fkit-<role>` token. After ADR-044 lands in the loop text, the **Plan** and **Build** cells each
become a **rule** — in the same shape `0223` gave the Process-review cell. ⚠️ **But they are two
different rules, from two different decisions. Do not collapse them into one:**

- **Build — §Decision 1, verbatim:** *"The Build row's role is the owner, in `skills_for_role()`, of
  the skill the deliverable is produced by."*
- **Plan — §Decision 2, verbatim:** *"The Plan row's role is the Build role, by hand where that role
  does not own `/fkit-plan-task`."* ADR-044 records this as an **owner-ruled scoped exception to
  ADR-038** (ruling ND3, 2026-08-27), not an application of it.

⛔ **A COLLISION THIS NOTE RECORDS AND DELIBERATELY DOES NOT RESOLVE.** `/fkit-plan-task` is
**coder-exclusive** — `claude/skills-for-role.sh:55`, and no other role's list carries it (verified on
disk 2026-08-29). So once `0345` lands, the Plan row lawfully pairs a possibly-non-coder role-rule
with a skill that role does **not** own; §Decision 2's own *"by hand"* clause is the acknowledgement
of exactly that. **This test's core assertion — "the named role owns the named skill" — is therefore
deliberately false on a lawful Plan row.** ⛔ **Do not read this note as declaring the Plan row
exempt.** Whether the parser carves Plan out, asserts something different on it, or handles it another
way is **`0225`'s own plan-gate decision, not `0347`'s** — **owner ruling 2026-08-29, verbatim option
label: "Flag the collision only (Rec)"**. What `0347` owes the implementer is that the collision
exists, before an assertion is written that fails on correct text.

⭐ **THE ASSERTION BECOMES STRONGER, NOT WEAKER. A reader who takes "accept a rule-cell" as a loosening
has read it backwards.** ADR-044 §C3, verbatim: *"its assertion becomes **stronger**: every named Build
skill's owner must own it in `skills_for_role()`."* The parser stops asserting *"this literal role owns
this literal skill"* on a handful of rows and starts asserting the **ownership invariant across every
skill a rule-cell names**. ⛔ A parser that merely tolerates a rule-cell — matching zero rows on it and
passing — has implemented the opposite of this note.

⚠️ **AND THE EXISTING ZERO-ROW RULE DOES NOT CATCH THAT.** `## What to build`'s *"fail loudly if it
matches zero rows"* — and verification step 3 that proves it — guard **whole-table** vacuity only.
After `0345`, a parser that silently skips both rule-cells still matches Review, Process-review and
Close: three assertions, non-zero, **green**, with the widening unimplemented and nothing red. ⛔ **The
guard must become per-cell:** every row the table names must be either **asserted** or **explicitly
skipped for a named reason**, and a rule-cell that resolves to no skill at all must fail. ⚠️ This
**replaces** the row-count guard the next paragraph declares stale — it does not drop it.

⚠️ **THE RULE-CELL DOES NOT EXIST YET —
[`0345`](../0345-carry-adr-044s-build-and-plan-role-rule-into-the-ship-loop-and-agent-text/brief.md)
WRITES IT.** Verified on disk 2026-08-29: `claude/skills/fkit-sprint-ship-loop/SKILL.md:122-123` — the
**Plan** and **Build** cells still read the literal `` `@fkit-coder` ``; only the Process-review cell
(`:126`) is a reasoned rule today. `0345` is `🔲 Backlog` / `Unscheduled`. ⛔ **Do not write a parser
against text that is not in the file** — either build against the literals today and widen when `0345`
lands, or sequence this task after it. **This is an ordering note, not a hard block** (the same shape as
the `0223` ordering note above): whichever lands second re-verifies its coordinates.

⚠️ **Two things `0345` will make stale in `## Verification steps` above — flagged here, NOT edited
there.** Once the Build cell names skills: (a) step 4's *"the test reports **4** row assertions"* is no
longer the right count; (b) step 4's *"Build and Verify are skipped"* stops being true of **Build**
(Verify stays table-fixed and stays skipped — ADR-044 §Decision 3. ⚠️ **Not "Build alone":**
§Decision 2 moves **Plan** as well, and §C4 names that departure verbatim — *"One clause departs from
ADR-038, and it is named rather than absorbed: Decision 2 (Plan)"*). ⛔ The implementer must reconcile
both against the file as it actually reads, and say so in the worklog rather than asserting the stale
numbers.

⛔ **THE ANTI-PATTERN THIS PARSER MUST NOT IMPLEMENT: grepping a brief for `/fkit-*` skill names.**
ADR-044 §C6, verbatim: *"A future oracle (`0224`, `0225` — C3) **must read the deliverable's producing
skill, never grep the brief for skill names.**"* Measured, not stylistic:

- **ADR-044 §C6, measured 2026-08-28:** a grep-for-skill-names oracle would route **8 of the 13**
  `## Owner: fkit-producer` Backlog rows back to the producer — *"reproducing precisely the `## Owner`
  staffing Decision 1 replaces."*
- ⭐ **RE-MEASURED 2026-08-29 by `0347` — the figure has MOVED: it is now 9 of 14**, the new row `0360`
  adding one to each side. **~64% of producer-owned rows misrouted.**
- **Method** (`conventions/evidence-before-assertion.md`): population = briefs under
  `ai-agents/tasks/backlog/` whose **`## Status` is `🔲 Backlog`** — **138** on 2026-08-29 (123 on
  2026-08-28); `## Owner` matched **anchored** on `^## Owner$`; every `/fkit-[a-z0-9-]+` token per brief
  checked against `skills_for_role()` in `claude/skills-for-role.sh`. **Ten of the fourteen carry a real
  skill token; nine of those ten name a producer-*exclusive* skill** (`/fkit-status`,
  `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal`) — `0184`, `0187`,
  `0262`, `0318`, `0320`, `0321`, `0335`, `0340`, `0360`; only `0221` does not. ⛔ **Live figure —
  re-measure, do not copy forward.** Full measurement and its stated partial-verification limit:
  ADR-044 §C6 and `0224`'s companion note of the same date.
- ⚠️ **Why grep cannot work at all here:** ADR-044 §C6 checked every one of those citations and found
  *"a mention is not a producing skill … every one is a reference, not an invocation"*. The token in a
  brief is usually a citation of a skill's **prose as an authority for form**, not a call. **The
  producing skill is a property of the deliverable, not of the brief's word choice.**

⚠️ **This does not weaken the honesty clause above.** The test still catches a future edit orphaning a
row from `skills_for_role()`; it still catches **no** driver departure. Detection of a departure remains
[`0224`](../0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md)'s job.
