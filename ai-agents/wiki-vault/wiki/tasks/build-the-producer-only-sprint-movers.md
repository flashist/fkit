# Build the producer-only sprint movers — `/fkit-sprint-done` and `/fkit-sprint-cancelled`

**Source**: `ai-agents/tasks/done/0341-build-the-producer-only-sprint-movers-fkit-sprint-done-and-fkit-sprint-cancelled/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 8 · `P5` · `0341` · ✅ Done (agent-closed — not owner-verified)

## Goal

**Owner ruling SD-3, 2026-08-25, verbatim *"Mover skills, producer-only (Recommended)"*.** Two new
skills that do banner + move + link repointing + row disposal **in one act** — producer-only under
[[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]'s reasoning, with the
`(agent-closed — not owner-verified)` marker when no owner is present.

⭐ **This is the row that makes Sprint 8 *"the first sprint in this project's history closed by a mover
instead of by hand."*** ⛔ **Sprint 8's success criterion (b) is unreachable without it.**

## Key Changes

### Why a mover at all

Every sprint close so far was a hand-scoped task — banner, then `git mv`, then links. ⛔ **Nothing tied
the three edits together**, so a finished Sprint 5 sat at the top of `sprints/` and was reported as
active until `0294` moved it. **Sprint 5's link surface, measured at `0294`'s filing: 57 relative links
inside the file across three shapes, and 53 files / 177 occurrences inbound** — with a naive
one-shape rewrite breaking ten links in the opposite direction. ⭐ **That is procedural, repeatable
work — the same shape the task movers already do.**

### What each mover does, in order

1. **Validate** — resolve identity through `dashboard.sh identity` (ADR-041 §5, never re-derive);
   refuse a `Backlog` identity, an unresolved one, an already-archived plan, and — for `sprint-done` —
   a plan with any row still open. ⛔ **A spawned producer has no channel, so it refuses and reports
   the open rows; it never moves them itself.**
2. **Resolve the status value FIRST** — the ADR-033 §5 table, same wording as the task movers.
3. **Write the line-3 banner** in the SD-1 grammar. ⛔ **Replace in place; never add a second.**
4. **Cancelled only — dispose of open rows:** each flips to `➡️ Moved to [Backlog](../backlog.md)`, a
   matching row is added to `backlog.md`, and each brief gets the five-edit de-scope. ⛔ **Closed rows
   are frozen history.**
5. **`git mv`** to `sprints/done/` or `sprints/cancelled/` — ⭐ **`cancelled/` is created on first use,
   the one designed create.**
6. **Repoint every link** — in-file, then repo-wide, ⛔ **but never `ai-agents/wiki-vault/`**
   ([[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the wiki role's sync repoints
   those). ⭐ **Counts re-derived at run time; never trust a recorded count.**
7. **Report** in the task movers' shape, ending *"this skill made no commit"*.

### ⭐ Ownership is declared in exactly one place

Both names were added to the producer's list in `claude/skills-for-role.sh` **and nowhere else** —
sourced by both the launcher's session lock (ADR-010) and the `PreToolUse` skill-ownership hook
(ADR-018), which is generic over the mapping. ⭐ **`test/skill-ownership-hook.test.js`'s `MOVERS`
invariant — *"now appears on EXACTLY ONE role"* — grew from two movers to four.**

## Outcome

⭐ **Verified on disk 2026-09-16: `claude/skills/fkit-sprint-done/` and
`claude/skills/fkit-sprint-cancelled/` both exist**, and `claude/skills-for-role.sh`'s own header
records that the pair *"were producer-only from their first line — they were never granted to anyone
else."*

⭐ **Both boards since have been closed by it.** Sprint 8's line 3 reads
`> ## ✅ Done — 2026-09-13. Closed by /fkit-sprint-done.`; Sprint 9's reads
`> ## ✅ Done — 2026-09-16. Closed by /fkit-sprint-done (agent-closed — not owner-verified).`

### ⚠️ What it shipped WITHOUT, and what that cost

⛔ **`0341` added two new guarded surfaces and no `prove-red.sh` mutation for either** — the sprint-mover
roster (`S0`–`S6` in `test/mover-exemption-step.test.js`) and `mode_successor()`'s `S1`–`S10` series.
⭐ **Mutation 34's own comment had already named this task by name**, existing so the uniformity half
would not be left unexercised *"before task 0341 pastes the clause a third and fourth time."*
⛔ **It pasted it a third and fourth time and added no mutation.** The gap became
[[tasks/give-the-sprint-mover-pins-and-successor-mode-durable-prove-red-mutations]] (`0388`) in
Sprint 9.

⚠️ **An emitter-map defect class fired FOUR times on this task alone.** ADR-047 fences it — *"§7's
emitter assignment sends a drift to a mode that cannot produce it — again"* — with the instruction
*"Re-raise on a third instance without further argument."* ⛔ **Round-1 finding `R6` was the third
instance and `R6`'s own fix was the fourth.** In the round-2 coder's own words: *"That is the likeliest
source of an instance five — and I just wrote another instance of that prose."*

⚠️ **It also became the first task whose `review.md` sat in `backlog/` while the citation gate ran** —
blind spot 11's first live cost, redding `L2` at an unmutated baseline and costing a full ~9-minute
gate run to discover.

## Related
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]]
- [[tasks/record-the-sprint-lifecycle-adr-047]]
- [[tasks/give-the-selector-a-status-rung-and-a-lowest-first-choice]]
- [[tasks/give-the-sprint-mover-pins-and-successor-mode-durable-prove-red-mutations]]
- [[tasks/give-the-task-movers-a-step-for-the-named-exempt-keys]]
- [[tasks/archive-sprint-5-move-the-plan-into-sprints-done]]
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
- [[systems/role-locked-sessions]]
- *Added 2026-09-16 (sync `b4a1a52`→`a351cb6`, closing a one-way link):* [[systems/fkit]] — the team page recording the result: ⭐ **skill count 25 → 28, and four movers rather than two**
