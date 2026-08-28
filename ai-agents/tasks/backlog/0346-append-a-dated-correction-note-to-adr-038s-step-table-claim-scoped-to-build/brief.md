# Append a dated correction note to ADR-038's "roles come from the enumerated step table" claim — scoped to Build

## ID
0346

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Follow-on (ii) of [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)**
— §C2, *"(ii) Dated correction note on ADR-038 (architect)"*, filed on owner ruling **ND6**, verbatim
*"File all three after the ADR is accepted (Recommended)"*. ADR-044 is `Status: accepted`
(2026-08-27), the deliverable of
[`0270`](../../done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/brief.md).

**The claim to annotate.** ADR-038 §Consequences, first bullet, reads (measured 2026-08-28 at
`ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md:90`
— the quoted fragment is the anchor, the line number a secondary aid):

> *"…their roles come from the loop's enumerated step table, not from this lookup"*

ADR-044 §Decision 1 makes the **Build** role come from the deliverable's producing skill instead. So
that sentence stops describing Build — ADR-044 §C4 states it directly: *"ADR-038's 'their roles come
from the loop's enumerated step table' stops describing Build once Decision 1 stands. That earns a
**dated correction note** (C2 ii) — a drift note, not an amendment."*

**⚠️ Two constraints that are the whole point of this task, both from ADR-044 §C2 (ii):**

1. **The ground is what CHANGED, not what was wrong.** *"Build and Verify run no skill"* **was and
   remains true of the steps** — the loop's Build cell names no skill. ⛔ **That is NOT the fragment
   to annotate.** The fragment is the one about where the **role** comes from.
2. ⛔ **Scope it to Build. Verify is untouched and stays table-fixed.** ⛔ **Do NOT widen the note to
   cover Plan.** ADR-044 §Decision 2 makes Plan follow the Build role, but that is an **owner-ruled
   scoped exception** recorded in ADR-044 itself (§C4) — deliberately **not** in this note's scope.
   ADR-044 says so twice, in §Decision 2 (*"the C2 (ii) correction note is **not** widened to cover
   Plan"*) and in §C4 (*"**not** widened to Plan, whose departure is recorded here instead"*).

## What to build

**A dated correction note appended to ADR-038**, below the claim it corrects. **Note, not a rewrite** —
the original sentence stays byte-unchanged.

**Form:** `0205`'s shape (the ADR-037 §5 note), and the procedure in `/fkit-record-decision`
§*"Correcting an accepted ADR — the dated correction note"*. Precedent for the form: `0143`'s dated
correction notes to ADR-010, as `0195` extended it.

The note must state **all five** of the following:

1. **A drift note (⚠️), not a reversal.** ADR-038's decision — *"A loop step's role is fixed by the
   skill the step runs"* — **stands**, and ADR-038 is **not amended and not superseded** (ADR-044
   §C4). ADR-044 is its **companion**.
2. **What changed, and only that:** ADR-044 §Decision 1 makes the **Build** role come from the owner,
   in `skills_for_role()`, of the skill that produces the deliverable — a deliverable naming no skill
   falling to the coder. So the annotated sentence no longer describes **Build**.
3. ⛔ **Verify is explicitly excluded** — it still takes its role from the loop's enumerated step
   table, exactly as ADR-038 says. The note must say this, not leave it to inference.
4. ⛔ **Plan is explicitly out of scope**, and the note says **where** it is recorded instead —
   ADR-044 §Decision 2 / §C4, as an owner-ruled scoped exception (ND3, 2026-08-27), bounded to the
   Plan step on non-coder rows in `/fkit-sprint-ship-loop`. **The note must not itself annotate,
   correct, or extend ADR-038 with respect to Plan.**
5. **The *"Build and Verify run no skill"* half is still TRUE and is not corrected** — state this
   explicitly so a later reader does not annotate it by mistake. The loop's Build cell names no
   skill; what moved is where Build's *role* comes from.

⛔ **Constraints:**

- **APPEND ONLY.** Prove `+N / −0` with `git diff --numstat` and `git diff -U0 | grep '^-'` — **not by
  eye.** The one sanctioned exception, if ADR-038's header carries or gains a `- **Corrections:**`
  metadata bullet, is that bullet (the `0195` precedent); justify it in the worklog.
- **ADR-038's `Status:` stays `accepted`.** Do not change it, its date, its deciders, or its decision
  text.
- The note sits **below** the claim it corrects (the `0143` `R1-placement` residual — recorded
  rationale, do not re-litigate).
- ⛔ Do **not** edit ADR-044. Do **not** touch `claude/`, `test/`, any sprint board, or any other task
  brief. ⛔ **Never** `ai-agents/wiki-vault/` (ADR-005) — ADR-044 and this note both need a wiki
  ingest, and that is `fkit-wiki`'s act, filed separately.

## Verification steps

1. `git diff --numstat` on ADR-038 shows **`+N / −0`** (or `+N / −1` with the sanctioned
   `- **Corrections:**` header bullet, justified in the worklog). `git diff -U0 | grep '^-'` returns
   nothing else.
2. ADR-038's original sentence *"their roles come from the loop's enumerated step table, not from this
   lookup"* is present and **byte-identical** to HEAD.
3. The note names **ADR-044** and the word **Build**, and states the role now comes from the
   deliverable's producing skill via `skills_for_role()`.
4. The note contains an explicit statement that **Verify is unchanged** and still table-fixed.
5. **Grep the note for any claim that this note corrects, amends, or covers the Plan step. Zero
   occurrences** other than the sentence that explicitly places Plan **out of scope** and points at
   ADR-044 §Decision 2 / §C4. Any wording that reads as annotating ADR-038 about Plan is a defect and
   fails this task.
6. The note contains an explicit statement that ***"Build and Verify run no skill"* remains true** and
   is not the corrected claim.
7. The note says **drift note, not a reversal / not an amendment / not superseded**, and that ADR-038's
   decision stands.
8. The note carries a **date** and sits **below** the corrected claim.
9. ADR-038's `- **Status:**` line still reads `accepted`.
10. `git status` shows exactly one modified file under `ai-agents/knowledge-base/decisions/` (plus this
    task's folder). `npm test` green — in particular `test/adr-number-uniqueness.test.js`.

## Notes

- **Depends on:** `0270` (`0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row` — closed;
  ADR-044 accepted).
- **Blocks:** nothing.
- ⚠️ **Priority is `Unscheduled` — the Backlog board is unranked by design.** No merit rank is asserted.
- **Not a dependency of `0345`, and `0345` is not a dependency of this.** The note records a change
  ADR-044 already made to the *decision record*; `0345` carries the same change into the *skill text*.
  Either may land first. ⚠️ If `0345` lands first, the note's tense should describe the rule as
  implemented rather than decided — re-read the loop skill before writing.
- ⚠️ **Re-measure the `:90` coordinate at implementation time.** ADR-038 is append-corrected, so the
  **quoted fragment** is the anchor and the line number is a secondary aid
  (`conventions/durable-citation-anchors.md`).
- **Source:** ADR-044 §C2 (ii), §C4, §Decision 1, §Decision 2; owner ruling ND6.
