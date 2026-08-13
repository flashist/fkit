# Decide the `PLAN_SPRINT` resolution strategy — under the letter-suffix constraint

**Source**: `ai-agents/tasks/done/0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 5 P2 · task `0260` · owner `fkit-architect`

## Goal

Decide what makes `0259`'s red fixture pass — **the decision the sprint's headline defect turns on,
and the one with a real trap in it.**

## Key Changes

The brief wrote the trap into the task rather than leaving it to be discovered:

> ⚠️ **THE HARD CONSTRAINT, non-negotiable and to be written into the ADR in these terms — a WRONG
> identity is strictly WORSE than NO identity.**

Because the downstream repo has `plan-sprint-4b.md` **and** `plan-sprint-4c.md` as real, distinct
identities alongside a separate `plan-sprint-4.md`, a naive numeric widening resolves `4c` → `Sprint
4`, which makes drift rule 1 **live and wrong** and **silently skips the status cross-check on that
whole board.** *Today's failure is loud; that one would be silent.*

And `hotfix-post-sprint2.md` is deliberately **not** Sprint 2, which disqualifies any *"find `Sprint
<N>` anywhere"* matcher — ***prose containment is not identity.***

Two further binding requirements: any landed pattern must **either handle the letter suffix or refuse
the file and report `unresolved-plan-sprint`**; and the ADR must bind a **regression guard** proving a
genuinely unidentifiable plan still reports it — ⛔ *the fix must not convert a loud failure into a
quiet one.* All twelve of the report's filenames had to be resolved and each outcome recorded,
**including the ones that must stay empty**.

⛔ **Decision output only** — no `dashboard.sh` edit, no test edit, and **do not file the
implementation brief** (the producer's act).

## Outcome

Delivered [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]],
accepted 2026-08-10. **Score: 12/12 as specified**, with rows 1 and 12 resolving empty **by design**
and row 6 deferred to the companion ADR **by name**.

Two points went to the owner and were ruled the same day — the **one-letter suffix bound** (verbatim
*"One letter (Recommended)"*) and the **closed `plan-` filename prefix** (verbatim *"Include `plan-`
(Recommended)"*). ⚠️ The second was accepted **knowing no observed file requires it** — recorded in
the ADR as a deliberate forward bet, on the ruling's own instruction. **Nothing else in the ADR was
owner-ruled**; the grammar's internals are the architect's, made under the ruled bounds.

The task also carries the sprint's **release gate**: owner ruling of 2026-08-10, verbatim *"Yes —
before the release cut"* — the landed pattern is tested against the downstream project's twelve real
filenames before a release is cut.

⚠️ Closed `(agent-closed — not owner-verified)`. Its rank froze on close, which is what made the
2026-08-11 re-rank a bounded question rather than a free one.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — this task's deliverable
- [[tasks/add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename]] — the fixture that sharpened the question
- [[tasks/decide-whether-the-active-sprint-glob-widens]] — the coordinating decision, deliberately not merged
- [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]] — the implementation the ADR would not file for itself
