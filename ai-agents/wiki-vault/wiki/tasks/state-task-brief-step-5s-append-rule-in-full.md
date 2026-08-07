# State `/fkit-task-brief` step 5's append rule in full

**Source**: `ai-agents/tasks/done/0157-state-task-brief-step-5s-append-rule-in-full/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0157` · owner `fkit-coder`

## Goal

Two spawned `fkit-producer` workers placed new briefs on the same board **oppositely, about an hour apart, on 2026-07-27**. Producer A merit-ranked two follow-ups into the middle of the board, renumbering 14 displaced rows. Producer B appended two tasks at the end and refused to insert. **The owner accepted both outcomes.** This task closes the gap that let it happen.

**The rule was not ambiguous — the *exception* was missing.** `/fkit-task-brief` step 5 says append after the highest priority and *"do not renumber or insert into the owner's ranking"*, reinforced twice more in the same file. Producer B read it correctly. Producer A knew the default and overrode it, on **an out-of-band instruction from the spawning lead session** and **a misread precedent**.

**The real hole:** step 5 describes the default and is silent on the sanctioned exception. The board records **two** legitimate merit re-ranks — but step 5 reads as an absolute ban with no path by which one could ever happen, which is what made a prior addendum *look* like producer precedent. It was not: that re-rank sat inside an **owner ruling**, and the same addendum states the principle the skill never did — *"A re-rank is the owner's call."*

> ⚠️ **The durable lesson: an addendum that does not name its authority becomes tomorrow's precedent for acting without one.** The producer's write-up recorded the *outcome* far more prominently than the *authority* behind it, and a later producer with no owner channel read the outcome as the precedent.

## Key Changes

Four prose edits, all inside step 5 of `claude/skills/fkit-task-brief/SKILL.md`. One file, no code, no test.

1. **The append default kept exactly as written** — not softened, no merit-ranking permission added.
2. **The sanctioned exception added:** a re-rank is the owner's call; a producer executes one only on an **explicit owner ruling given in that session**; a **spawned producer with no owner channel therefore never re-ranks.**
3. **The closed-row carve-out**, and the mandatory merit flag — *say where merit would have put it*. Both had been reached independently by both producers and were written **nowhere**, existing only in dated addendum prose, which is a record of a moment rather than an instruction.
4. **The citation clause:** cite the folder ID, not the board rank.

## Outcome

Done, **agent-closed — not owner-verified**.

**The scope was split on the role seam by owner ruling.** This half is the **rule** (a `fkit-coder` edit to one skill file); the **sweep** of existing stale rank citations went to [[tasks/sweep-the-stale-rank-citations]] (`0159`), a `fkit-producer` edit to task briefs and the sprint board. A brief has one `## Owner` field and cannot express two. Neither half blocked the other — and the widened brief had broken its own verification step (*"`git diff --stat` shows exactly one file"*), which is the mechanical sign a second unit was present.

**An inventory that found nothing, and that is the result:** `claude/agents/fkit-producer.md`, the universal rules block, the sprint-loop skill, `dashboard.sh`, the whole `test/` tree and the wiki vault were each read and each encode **no** board-placement rule. The convention `priority-is-rank-not-identity.md` is adjacent but never says **who** may re-rank. **Step 5 is the only site, and nothing enforces it.**

## Related

- [[tasks/sweep-the-stale-rank-citations]] — `0159`, the sweep half of the same work
- [[tasks/implement-task-folder-name-scheme-change]] — `0103`, which wrote the rank-vs-identity convention
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, the wider citation class
- [[tasks/rename-task-plan-skill-to-task-brief]] — the skill this edits
- [[tasks/add-task-plan-skill-to-producer]]
- [[tasks/disambiguate-the-frozen-history-clause]] — `0161`, which disambiguated the convention clause this arc rests on
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — **a mid-board insertion is NOT the owner-ruled re-rank exception** — forced by arithmetic, not policy
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174` — the merit-ordering ruling; **the task that became its own proof case**
- [[tasks/narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank]] — task `0181` (2026-08-06): the later narrowing of the same step 5 — the exception never permits a mid-board insertion
