# Sweep the stale board-rank citations out of the briefs and the sprint board

**Source**: `ai-agents/tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0159` · owner `fkit-producer`

## Goal

Repair the damage that already existed while [[tasks/state-task-brief-step-5s-append-rule-in-full]] (`0157`) wrote the rule that stops it recurring.

**The defect.** Reasoning prose across the open backlog and the live sprint board cited other tasks by **board rank** — *"0154 (127)"*, *"below 0151 (P122)"*. Rank is mutable; the board was re-ranked **twice on 2026-07-27 alone**, and every such citation silently became wrong. A reader cannot tell a correct citation from a stale one without going to the board — **which is exactly the lookup the citation existed to save.** Worse, a *wrong* number reads as authoritative, so the reader who trusts it is misdirected without ever knowing to check.

## The two owner rulings it rests on — both 2026-07-27

1. **The work splits on the role seam.** `0157` keeps the rule (a coder edit to one skill file); this task takes the sweep (a producer edit to briefs and the board).
2. **The frozen-history clause does NOT block this sweep.** `priority-is-rank-not-identity.md`'s *"frozen history … never mass-edited"* clause covers **the board-cell form `124 (0150)` only** — **not** the prose form `0150 (124)` inside a brief's reasoning. The owner's reasoning: *a board cell records what a row meant on the day it was written; prose inside a brief is a live cross-reference that misdirects a reader today.* Transcribing that ruling into the page itself became [[tasks/disambiguate-the-frozen-history-clause]] (`0161`).

## Key Changes

Prose only. **No code, no test, and no rank changes.**

- **Part A — 12 sites, 13 stale numbers, 6 files.** Each rewritten to **name the folder ID and drop the rank**, or — where the *relative order* is the actual point — to say the order relatively (*"directly below 0147"*), which survives a re-rank. **Simply updating the number to today's value was forbidden: that reproduces the defect with a fresher date.**
- **Part B — 7 append flags, 7 files**, each citing a priority its own brief no longer carried.

⚠️ **The decay is the finding, not a footnote.** The list the owner first ruled on named **11** stale citations; a verification pass the same day found **21**; a second pass found two more nobody had named and re-classified several. The brief was **filed** as *21 numbers / 19 sites / 11 files* and **executed** as *20 / 19 / 12* — but **the composition changed almost entirely**: seven original sites left scope by closing, four new ones appeared, and **every `sprint-2.md:NNN` pointer in the original table was wrong by execution time.** The brief told its own implementer in bold to **re-derive every live rank and rebuild the table**, and not to trust its numbers.

One site was found **only by a wrap-aware scan** — the citation was split across a line break, so both of the plan's greps and every earlier pass missed it.

## Outcome

Done, **agent-closed — not owner-verified**.

⚠️ **A deliberate deviation from the approved plan, and it was the right call.** The plan prescribed appending *"✅ resolved: owner ruled to N"* to **all seven** append flags. Only **one** was genuinely resolved by an owner ruling to a named rank. Writing *"owner ruled"* on the rest would have **fabricated rulings that never happened** — the exact `evidence-before-assertion` failure this task exists to fight. The owner ratified the deviation on 2026-07-30.

The substitute wording was then **wrong twice over**, and both were fixed in review round 1: it read *"✅ Resolved"*, which over-claimed (the flags ask for *owner confirmation*, and no owner confirmed six of them), and it **re-introduced a live rank** in present-tense prose — a fresh instance of the defect, inside the briefs just swept. The six now say plainly: *stale number reconciled, owner confirmation still outstanding, flag not discharged.*

**This task's ledger is the evidentiary base for [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]]**, and it closed with **two own-record residuals standing** — the accepted cost that ADR records.

## Related

- [[tasks/state-task-brief-step-5s-append-rule-in-full]] — `0157`, the rule half
- [[tasks/disambiguate-the-frozen-history-clause]] — `0161`, which writes ruling 2 into the convention page
- [[tasks/implement-task-folder-name-scheme-change]] — `0103`, which wrote the convention
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, the wider class this is Case 1 of
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — ruled on this task's ledger
- [[tasks/stop-agents-asserting-unchecked-repo-state]] — the `evidence-before-assertion` convention
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — whose vault page carried two of the stale-coordinate notes this class covers
