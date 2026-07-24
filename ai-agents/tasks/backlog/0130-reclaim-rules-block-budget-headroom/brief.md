# Reclaim universal-rules-block budget headroom — compression pass or a signed `RULES_MAX` bump

## ID
0130

## Sprint
Sprint 2

## Priority
113

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

The fkit-managed **rules block** — `claude/scaffold/universal-rules.md`, wrapped by
`claude/fkit-claude-init.sh:emit_block()` and re-injected into every consuming project's `CLAUDE.md`
and `AGENTS.md` on **every launch** — now sits at **91.1% of the `RULES_MAX=4096` byte cap: 3733 B
emitted, 363 B of headroom left** after task 0128 landed the ADR-030 prose half.

Two gates bind this budget:
- `claude/fkit-claude-init.sh` **aborts a launch** if the emitted block exceeds `RULES_MAX`.
- `test/rules-block-budget.test.js` trips a **warning gate at 92%** — the block is one edit from it.

So the **next** cross-cutting rule likely won't fit without action. This task hardens the standing
budget so that addition isn't blocked when it arrives.

**This is a producer catch of an owner directive during 0128's review**, not a defect in 0128 — the
review closed clean with the headroom flagged as a follow-up. The precedent it follows is
task 79 / 0022 (compress the Output style section), which reclaimed room *specifically* so 0128 could
land. The 0022 lesson is that this kind of budget work gets forgotten unless it is filed; hence this
brief.

**No hard dependency.** It is standing-budget hardening — not urgent until the next cross-cutting rule
needs the room, but it must not be lost.

**A `RULES_MAX` bump is not the coder's call to make alone.** The cap exists precisely because the
block lands in every agent's context on every turn — raising it trades that context cost for headroom.
That tradeoff is an **owner (and likely architect) decision**. The coder implements whichever option
the owner signs; the coder does not pick the cap-vs-verbosity path unilaterally.

## What to build

A budget-hardening change to the rules block, in **two phases** — a measure-and-propose step that gates
on an owner decision, then the implementation of whichever option the owner signs. Both phases are this
one task; the proposal is not a separately shippable artifact.

**Phase 1 — measure and propose (before touching anything):**
- **Re-measure the live emitted block** against `RULES_MAX` — do not trust the 3733 B / 363 B figures
  in this brief blindly; they were measured at 0128 close and the block may have changed since.
- Present the owner **one recommendation with its main tradeoff**, choosing between:
  - **(a) Compression pass** — reclaim bytes by tightening wording *without dropping any load-bearing
    content* (the 0022/R4 precedent: a cut that saves bytes by dropping a qualifier is a **regression**,
    not a compression). Identify candidate prose and the bytes each reclaims.
  - **(b) A deliberate, owner-signed `RULES_MAX` bump** — `claude/fkit-claude-init.sh` sets the cap
    (~line 318). Surface the per-turn context cost this trades away, and by how much the cap would rise.
- **Surface the cap-vs-verbosity tradeoff explicitly** so the owner can rule. If the choice turns on a
  technical judgment the coder can't make (e.g. the real per-turn context cost of a larger block),
  consult **fkit-architect** — but the option the owner signs is the owner's, not settled between agents.

**Phase 2 — implement the signed option:**
- If **(a):** apply the compression, preserving every load-bearing clause and qualifier verbatim in
  meaning (the ADR-030 clauses *never invent a next step* / *never assert unchecked repo state*, and
  every other hard-rule/output-style qualifier, must survive).
- If **(b):** change `RULES_MAX` to the owner-signed value, and update `test/rules-block-budget.test.js`
  so its cap and warning-gate percentage track the new value.

## Verification steps

1. **Re-measured figure reported:** the current emitted block size and remaining headroom are stated
   before any change (Phase 1), not assumed from this brief.
2. **Owner sign-off recorded:** the chosen option (compression vs cap bump) is the owner's, captured in
   the worklog's owner-decision log — a cap bump is not applied without it.
3. **Under cap with margin:** after the change, the emitted block is **under `RULES_MAX`** with restored
   headroom; a launch does not abort. Report the new block size and headroom, and the new percentage vs
   the 92% warning gate.
4. **No content lost (option a):** every load-bearing clause and qualifier present before the pass is
   present after — specifically the ADR-030 clauses *never invent a next step* and *never assert
   unchecked repo state*, plus every hard-rule qualifier. Diff the emitted block to confirm no
   qualifier silently dropped (the 0022/R4 regression test).
5. **Tests track the change (option b):** `test/rules-block-budget.test.js` cap and warning threshold
   match the new `RULES_MAX`; `node --test test/*.test.js` and `bash test/prove-red.sh` stay green.
6. **`emit_block()` runs clean** and re-injects the updated block into a consuming project's `CLAUDE.md`
   and `AGENTS.md`.
7. **Single-home re-check (0022 precedent — verify, don't trust):** `find . -name universal-rules.md`
   returns exactly one path under `claude/scaffold/`.

## Notes

- **Owner:** fkit-coder (implementation). **A `RULES_MAX` bump is an owner/architect call** — the coder
  presents the option and its tradeoff and implements the signed choice; it does not pick the cap path
  alone.
- **Depends on:** nothing — this is standing-budget hardening, unblocked today.
- **Blocks:** nothing hard today. In practice it should land **before the next cross-cutting rule** that
  needs rules-block room, or that addition trips the launch-abort / 92% gate.
- **Prompted by:** task 0128 (ADR-030 prose half), which brought the block to 91.1%. Not a 0128 defect —
  0128's review closed clean and flagged this as the follow-up.
- **Precedent:** task 79 / 0022 (compress the Output style section) — same kind of budget reclaim; its
  lesson is that this work gets forgotten unless filed. See also the R4/0022 rule: dropping a qualifier
  to save bytes is a regression, not a compression.
- A **review pass is warranted** — this edits the shared rules block (option a) or its enforcement cap
  (option b), both of which govern every agent's context on every turn.
- No commit — leave the change in the working tree.
