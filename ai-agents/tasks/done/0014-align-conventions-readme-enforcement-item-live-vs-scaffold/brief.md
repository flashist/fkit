# Align conventions-README "enforceable somewhere" item: live vs scaffold

## ID
0014

## Sprint
Backlog (unsprinted)

## Priority
Unscheduled

## Status
✅ Done

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

## Status correction — 2026-10-02 (producer, under owner ruling)

`## Status` changed from `🔲 Backlog` to plain `✅ Done`. **Folder not moved** (already in `done/`).
**No board row added.**

- **Owner rulings (2026-10-02, `fkit lead` session, `AskUserQuestion`; selected option text,
  verbatim):**
  - On lifting the 2026-09-18 *"Leave it, pending 0296"* ruling (ADR-033 addendum) for this field
    only: *"Yes, status field only — The test data 0296/0406 rely on is the missing row, which stays;
    only the wrong status is corrected."*
  - On who closed it: *"Yes, I did — Plain '✅ Done' (you committed it along with the work on
    2026-07-16)."* The owner closed and verified this task, so there is **no**
    `(agent-closed — not owner-verified)` marker
    ([ADR-048](../../../knowledge-base/decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md):
    never put that marker on an owner-closed task).
- **Git evidence:**
  - Commit `cd19aef` (2026-07-16, *"Tasks update"*) **created this brief directly in `done/`** with
    `## Status` already reading `🔲 Backlog`. The brief was never in `backlog/`, and no commit ever
    moved it. That same commit also holds the work: it changed item 3 of the scaffold
    `conventions/README.md` to the generic form (option **(a)**), *"ideally in tooling or code where
    the check runs automatically, not left to memory."*
  - Commit `331f298` (2026-07-21, the folder migration, ADR-029) **only renamed** the file into this
    folder, unchanged (R100). The wrong status came before the migration; the migration did not
    cause it.
- **The missing board row stays missing, by ruling.** It is the live specimen for
  [`0296`](../../backlog/0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md) and
  [`0406`](../../backlog/0406-build-the-no-board-row-check-in-the-test-suite-with-a-dated-two-task-allowlist/brief.md).
  ⛔ Do not add one.
