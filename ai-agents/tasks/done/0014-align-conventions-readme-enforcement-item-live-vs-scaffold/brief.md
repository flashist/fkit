# Align conventions-README "enforceable somewhere" item: live vs scaffold

## ID
0014

## Sprint
Backlog (unsprinted)

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

The two copies of the conventions-index README diverge on item 3 of **"The bar for adding one"** (the
four-part test a doc must clear to earn a place in `conventions/`).

- **Live** — `ai-agents/knowledge-base/conventions/README.md` (lines 47–49):
  > **It is enforceable somewhere.** A convention nobody can check is a preference. State where it is
  > enforced — ideally in `claude/` source, so it ships to every project and not just this one.
  > (`task-status-vocabulary.md` §"Where this must be enforced" is the pattern.)

- **Scaffold** — `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` (line 50):
  > **It is enforceable somewhere.** A convention nobody can check is a preference. State where it is
  > enforced.

The scaffold drops the `claude/`-source guidance and the `task-status-vocabulary.md` cross-reference.

**Origin.** Flagged by the architect during the `stop-agents-asserting-unchecked-repo-state` review
as **pre-existing and out-of-scope** for that task. Verified in both files (producer, 2026-07-16).

**This is not automatically a defect.** The divergence may be **intentional**: the scaffold is a
generic starter shipped to fresh projects, and the dropped text is repo-specific — it names this
repo's `claude/` source layout and a specific convention file that a fresh project won't have. So the
task is **not** "make the two files identical" by default.

## What to build

This is a **decision-first** doc task. The architect (who owns KB structure per ADR-013) decides,
then aligns:

1. **Decide** which of these is right for the scaffold's item 3:
   - **(a) Generic form** — carry the *idea* "state where it is enforced, ideally in source so it
     ships to every project, not just this one" without the repo-specific `claude/` path or the
     `task-status-vocabulary.md` back-reference. Keeps the useful "enforce at source" teaching for
     fresh projects while staying portable.
   - **(b) Stay minimal** — the current short scaffold text is deliberate; the enforcement-at-source
     guidance is a mature-repo concern a fresh project doesn't need. Then the divergence is
     **intentional and correct**, and the fix is only to record that so it isn't re-flagged.
2. **Align accordingly:**
   - If (a): edit `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` item 3 to the
     chosen generic wording. Do **not** copy the live text verbatim — strip the repo-specific
     `claude/` path and the `task-status-vocabulary.md` reference (a fresh project has neither).
   - If (b): leave both files as-is; add a short note (a comment near the divergence, or a line in
     whatever tracks scaffold-vs-live intentional deltas, if such a place exists) recording that the
     shorter scaffold form is deliberate — so the next reviewer doesn't re-open this.

Only the scaffold copy is in question. The live README's fuller wording is correct for this repo and
should not be trimmed to match.

## Verification steps

- The chosen path (a or b) is applied and item 3 in the scaffold README is internally coherent — no
  half-edited sentence, no dangling reference.
- If (a): the scaffold item 3 contains **no** repo-specific artifact — no literal `claude/` source
  path presented as universal, no `task-status-vocabulary.md` cross-reference (that file is not part
  of a fresh scaffold).
- The other three items of "The bar for adding one" remain unchanged in both files.
- The live README (`ai-agents/knowledge-base/conventions/README.md`) is left unchanged.
- Whichever decision is made is recorded in the task's close-out so the divergence is not re-flagged
  by a future review.

## Notes

- **Owner: fkit-architect.** This is a knowledge-base write and the divergence is about
  convention-index structure — the architect owns KB structure per ADR-013.
- **Depends on: nothing.**
- **No ADR.** Doc-wording alignment; no decision large enough to warrant one. (If the architect
  decides the scaffold-vs-live delta needs a durable, general rule, that is a separate call to raise
  with the owner — do not fold it in here.)
- **Files:** `ai-agents/knowledge-base/conventions/README.md` (live, reference only) and
  `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` (scaffold, the one to change).
  Edit the scaffold source directly; it is checked into git, not a gitignored copy.
- **Risk: low** — documentation wording only, no runtime/product code.
- **Unsprinted / Unscheduled** (producer, 2026-07-16) — filed at the same tier as the other
  out-of-band review residue; ranking is the owner's to confirm.
