# Narrow `/fkit-task-brief` step 5 — a mid-board insertion is not the owner-ruled re-rank exception

## ID
0181

## Sprint
Sprint 3

## Priority
1

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**This is follow-up 4 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§4.2 and §8), and it is the **decision-recorded** one: the ruling is already in
[**ADR-035**](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
(status **accepted**, owner-signed 2026-08-01). This task is the **skill edit only** — the decision is
not re-opened here.

### The hole, and the fact that it has already been used

`/fkit-task-brief` **step 5 — "Determine priority"** carries two rules that were read as compatible and
are not.

> *"**The one exception — an owner-ruled re-rank. A re-rank is the owner's call.**"*

> *"**`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — not even under an owner
> ruling.**"*

**They collide because of arithmetic, not interpretation.** Inserting a row renumbers **every row
below** it. On a board where closed and open rows **interleave**, the only insertion point with no
closed row beneath it lies inside the final run of open rows — which is appending. So:

> **On an interleaved board there is no mid-board insertion point that does not renumber a closed row.**

**⚠️ THIS IS THE ONE THAT CLOSES THE HOLE TASK `0174`'S OWN FILING WENT THROUGH — RANK IT
ACCORDINGLY.** Task `0174` was inserted mid-board on 2026-08-01 under an explicit owner ruling invoking
that exception. Verified against the filing commit's diff by the architect and **independently
re-derived, exactly, by the reviewer**, the insertion **renumbered eight closed rows**: `0151`, `0147`,
`0150`, `0157`, `0161`, `0148`, `0159`, `0160`. All eight read `✅ Done` at the time. The producer who
did it recorded its authority in full, checked its effect, and wrote a specific merit justification —
and still breached an absolute rule, because **the check was run in the wrong direction**: it verified
the ranks *above* the insertion point, and an insertion renumbers what is *below* it.

**A rule that survives only until someone reads it carefully is not a rule.** ADR-035 rejected
*"treat it as a one-off error"* on exactly that ground.

## What to build

A skill-text edit to `claude/skills/fkit-task-brief/SKILL.md`, **step 5**, and to any `claude/scaffold/`
counterpart carrying the same text (check; do not assume).

1. **Narrow the exception, in ADR-035's own words:**

   > The owner-ruled re-rank exception permits **moving an existing row within its own contiguous run of
   > open rows**. It does **not** permit **inserting a new row mid-board**, because on an interleaved
   > board an insertion renumbers every row beneath it, including closed ones — and the closed-row rule
   > admits no exception, *"not even under an owner ruling."*

2. **State the remedy in the same breath**, so the narrowing does not read as a bare prohibition: where
   a new row's merit position is out of reach, **it appends, and the ordering intent is recorded in the
   brief** as a canonical merit statement (task `0178`'s grammar).

3. **Record the corollary**, so it is not rediscovered as a defect: the append rule is a **forced
   consequence** of the closed-row rule, not an independent policy. It cannot be relaxed without first
   relaxing the closed-row rule. Anyone proposing to allow insertions must argue the **closed-row
   rule**.

4. **Forbid the specific act by name where a closed row sits below the insertion point** — the wording
   must be operable by a producer standing at the board, not only correct in the abstract.

5. Cite ADR-035 as the authority.

### Out of scope

- **⛔ Do not re-open the decision.** ADR-035 is accepted. It rejected *"leave step 5 as it is"*,
  *"relax the closed-row rule"*, *"formalize the re-rank act harder"*, and *"revert the `0174`
  insertion"* — each by name. A review finding proposing any of them is **closeout, not a new defect**.
- **⛔ Do not revert the `0174` insertion.** Reverting renumbers the same eight closed rows a **second**
  time. The record is corrected by task `0183`, not by restoring numbers.
- **⛔ Do not change the merit-statement requirement.** That is task `0179`, a different edit to the
  same step.
- **⛔ Do not build the immutability guard.** That is task `0182`.
- **⛔ Write no `:NNN` line-number citations, and no bullet ordinals.** ADR-035's citation note is
  explicit: *"a bullet ordinal is a line number wearing different clothes, and it rots the same way."*
  Anchor by step heading plus quoted text.
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. Step 5 of `claude/skills/fkit-task-brief/SKILL.md` states the narrowing, and states it as a limit on
   the **exception**, not as a new rule bolted on elsewhere.
2. Reading step 5 top to bottom, the re-rank exception and the closed-row rule no longer contradict each
   other. **Prove it concretely:** walk the `0174` filing scenario against the new text and show the
   text forbids it.
3. The remedy (append + record the merit statement) appears in the same step, not only in the ADR.
4. The corollary — the append rule is a forced consequence — appears in the step.
5. No `:NNN` citation and no bullet ordinal appears in the changed text (`grep` for `\.md:[0-9]`, and
   read for ordinals — a grep cannot catch *"four bullets later"*).
6. `npm test` passes, including `test/skill-frontmatter.test.js`.
7. If a `claude/scaffold/` counterpart exists, `diff` against it is empty; if none exists, say so
   explicitly rather than leaving it unstated.
8. The `.claude/` fkit-managed copies are refreshed from `claude/` and carry the new text.

## Notes

- **Depends on:** nothing hard. ADR-035 is accepted and this task implements it. Report §8 records it as
  *"independent — can land first"*.
- **Blocks:** `0182` — the guard asserts the rule this task writes down.
- **⚠️ Priority 159 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** immediately above `0178` — **the highest merit of this batch of eight.** It is
  independent of the `0178`→`0179`→`0180` chain, it closes a live hole in a rule every future brief
  filing passes through, and it is the only one of the eight whose absence has already caused a verified
  breach. Its append rank sits three rows below its merit position **within the batch**, and the batch
  as a whole sits at the bottom of the board — 27 open rows below where this row belongs.
- **⚠️ File collision with `0179`.** Both edit `/fkit-task-brief` step 5. Independent in substance;
  whichever lands second must be rebased on the first. **Flagged for whoever schedules them.**
- **Merit form used here** is the canonical `**On merit:**` shape from report §3.1 / ADR-035. Flagged so
  it is not read as drift.
- No existing row was renumbered by this brief.

- **⚠️ DATED CORRECTION 2026-08-06 — pulled onto Sprint 3 by the rollover.** The append-rank and
  merit-divergence notes above describe this brief's position on the board it came from and **no longer
  describe its position today**. Sprint 3 is a **fresh board with no closed rows**, so its `P1`–`P3` were
  assigned **on merit, freely** — ADR-035's closed-row wall does not apply there yet, and no append/merit
  divergence exists on that board. **The original notes are left byte-identical**; scope, dependencies and
  prohibitions are unaffected. Ranking rationale: `ai-agents/sprints/sprint-3.md`, §"How this board was
  ranked". Pulled by owner ruling, `AskUserQuestion`, live `fkit lead` session 2026-08-06.
- **Ranked `P1` on Sprint 3** — top of the board. It gates `0182` (hard), it is the only item of its
  batch whose absence has already caused a **verified** breach, and it governs `/fkit-task-brief` step 5,
  the path every future brief filing on the new board passes through.
