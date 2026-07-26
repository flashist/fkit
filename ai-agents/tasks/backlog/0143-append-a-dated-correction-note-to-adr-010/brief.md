# Append a dated correction note to ADR-010 for the menu reorder

## ID
0143

## Sprint
Sprint 2

## Priority
122

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

[ADR-010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)`:26`
says:

> *"**A 7th agent, `fkit-lead`** — the 'team room' (menu option 7) — routes rather than does."*

Task 115 (`0139`) moves the lead to **menu option 1** and task 116 (`0140`) retires the label
**"team room"**. Once those land, that sentence states **two facts that are no longer true**.

It was **true when written.** ADR-010 is an accepted decision record, and the producer's position — put
to the owner and **ruled on 2026-07-25** — is that silently rewriting a decision record to match today
erases the history the record exists to hold. **The owner chose the dated correction note** over both
leaving it alone and editing the body in place.

**Why this is an architect task and not a coder edit.** Deciding how a decision record absorbs a later
change is a question about the shape of the project's own record-keeping, not a text substitution. It
also sets the precedent for the next time — and there will be a next time, since this project amends
ADRs rather than superseding them (see task 100 / `0118`, the ADR-032 amendment).

**Note the sentence carries a third claim that is also stale, and it is bigger than the menu number:**
*"routes rather than does"*. [ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
reversed exactly that when it made the lead an orchestrating conductor. Whether one note covers both is
the architect's call — but **it must be addressed or explicitly deferred, not passed over silently.**

## What to build

A **dated correction note** on ADR-010 that:

1. **Leaves the ADR's body as written.** The original sentence stays. This is an append, not an edit.
2. Records, with the date and the authorizing tasks (`0139`, `0140`), that the lead is now menu option
   **1** and that the "team room" label is retired.
3. Addresses — or explicitly and reasonedly defers — the *"routes rather than does"* claim reversed by
   ADR-031.
4. **Establishes the form**, since this is the first one. Where does a correction note go, how is it
   marked, how does a reader tell it from the original decision? A one-off that nobody can imitate is
   worth little; if `/fkit-record-decision` should learn the shape, say so as a follow-up rather than
   changing that skill under this brief.

**Do not** mark ADR-010 superseded or deprecated. The decision it records — role-locked sessions and
skill lockdown — **is still in force**. Only incidental facts in its prose went stale.

## Verification steps

1. ADR-010's original body text at `:26` is **unchanged** — verify by diff, not by eye.
2. A correction note is present, carries a date, and names `0139`/`0140` as its cause.
3. The note states the lead's current menu position and that "team room" is retired.
4. The *"routes rather than does"* claim is either corrected in the note or explicitly deferred with a
   stated reason. **Silence on it fails this check.**
5. The ADR's `**Status:**` field still reads `accepted` — not superseded, not deprecated.
6. The note's form is described well enough that the next person can reproduce it, and any follow-up to
   `/fkit-record-decision` is named rather than done here.

## Notes

- **Depends on:** 0139, 0140 — soft. The note asserts a menu position, so writing it before the reorder
  lands makes it true-in-advance. Either land them first, or word the note so it is dated to the change
  rather than to the writing.
- **Blocks:** nothing.
- **Owner:** fkit-architect, per the owner's ruling 2026-07-25 — record-keeping shape, not a text edit.
- **Not a wiki task.** ADR-010 lives in `ai-agents/knowledge-base/decisions/`, which any role may write.
  The wiki's own copy (`ai-agents/wiki-vault/wiki/decisions/`) is a separate surface and belongs to the
  wiki role; if a resync is needed it is a follow-up, not part of this brief.
- **`decisions/` is `⛔ never sync`** per
  [dual-home-parity](../../../knowledge-base/conventions/dual-home-parity.md) — no scaffold copy to
  keep in step. Checked at scoping time, per ADR-027 §Decision 1.
- No commit — leave the edit in the working tree.
