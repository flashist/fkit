# Pin the five unpinned behaviors in the sprint-identity grammar

**Source**: `ai-agents/tasks/done/0271-pin-the-three-unpinned-behaviors-in-the-sprint-identity-grammar/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 8 · `P2` · `0271` · ✅ Done (agent-closed — not owner-verified)

> ⚠️ **Title/folder mismatch, deliberate and flagged on the brief itself.** Filed as *three* behaviors,
> it grew to **five** by owner ruling. ⛔ **The folder is still
> `0271-pin-the-three-unpinned-behaviors-…` and the board row still links to it** — renaming is a
> task-file move that only a mover may perform, so the producer changed the in-file H1 only.
> ⭐ **The folder name is not wrong; it is dated.**

## Goal

**Coverage, not correction.** `0264` landed ADR-040's sprint-identity grammar and `0265` landed
ADR-041's `select-active` half on top of it, and ⭐ **both are correct.** Every item here is the same
defect **about the tests**:

> **a correct behavior with no test that goes red when it is undone.**

⚠️ **None of the five claims the shipped behavior is wrong.** ⛔ **`dashboard.sh` had to end
byte-identical from this task's own edits** — do not "fix" the grammar, do not "fix" `select-active`.

## Key Changes

### Two of the five were MEASURED to survive deletion with the whole suite green

- ⛔ **Dropping the `seen` de-dup leaves the suite green — 129/129** — yet it is what implements
  ADR-040 §2.5's *"two or more **distinct** tokens ⇒ refuse"*. ⭐ **`T6` does not exercise it: both its
  fixtures use two *different* tokens**, so it never separates *distinct* from *total*. A repeated
  identity (`# Sprint 5 — Sprint 5`) would wrongly refuse.
- ⛔ **Replacing `head -1` with `cat` leaves the suite green** — yet it is what implements ADR-040
  §2.1's first-line-only narrowing. ⚠️ **Two consequences went unguarded:** the owner-approved
  narrowing could be silently reverted, and a whole-file scan can `print` twice and hand `PLAN_SPRINT`
  a **multi-line value no consumer expects.**

**Item 3** adds a `test/prove-red.sh` mutation for the new grammar — `0264` added none because its own
verification step fenced the diff to two files, ⭐ **putting the mutation gate out of scope by the
brief's own rule.** ADR-026 discipline wants one.

### ⭐ Why it ran at `P2`, before `0338`

`0338` is a substantial rewrite of the same file's eligibility and selection logic. ⛔ **A rewrite over
behaviors with no red-proof is a rewrite that can silently drop them and ship green.** ⛔ **After
`0338` lands the same coverage costs more and proves less** — the guard would be written against the
new code rather than pinning what survived the change. ⭐ **This was the cheap moment.**

### ⛔ What the two folds deliberately did NOT bring over

Two owner rulings the same day (2026-08-11) built this brief: *"File as one follow-up"* (three
residuals from `0264`) then *"Fold into 0271"* (two more from `0265`). ⛔ **Exactly two were added, and
the brief names what stayed out:**

- ⛔ **`0264` residual `A1` — `moved_target` not right-bounded** (`➡️ Moved to Sprint 4th` → `Sprint 4t`).
  Owner ruled **"Accept as residual"**: pre-existing, reaching only drift rule 2, which fires a **loud**
  `drift disagreement` and never a silent skip.
- ⛔ **`0265` `R1`/`R5`** — fixed and red-proved inside `0265`.
- ⛔ **`0265` `A3`** — a leading-`-` plan path leaks usage errors. **Accept as-is: it fails safe**,
  resolving *unresolved* and never to a wrong identity. **Noisy, not incorrect.**
- ⛔ **`0265` `A4`** — a newline or TAB in a plan basename corrupts candidate records. **Accept as-is**,
  now **disclosed as a limit** in the tie-break comment. ⛔ **Do not re-describe it as safety.**

⭐ **"This brief grows by exactly two items. If planning wants a sixth, that is a new brief and a new
owner ruling."**

⚠️ **Item 1's comment half had ALREADY landed** inside `0264` (*"Fix the comment now"*): `T6`'s comment
no longer claims to cover the de-dup and points at this follow-up. ⛔ **Do not restate the old claim;
the guard itself was what was outstanding.**

## Outcome

Closed 2026-09-13 as part of Sprint 8. ⚠️ **This page does not state the final mutation numbers this
task contributed** — `test/prove-red.sh` stood at **34 mutations** when Sprint 8 closed, and
mutations **35–39** all carry `0388`'s name, so `0271`'s mutation sits somewhere in **1–34** and the
brief and worklog are the record. ⛔ **Not asserted here, because it was not measured here.**

## Related
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]]
- [[tasks/give-the-selector-a-status-rung-and-a-lowest-first-choice]]
- [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]]
- [[tasks/implement-adr-041s-dashboard-half]]
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]]
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]
- [[systems/testing-and-verification]]
