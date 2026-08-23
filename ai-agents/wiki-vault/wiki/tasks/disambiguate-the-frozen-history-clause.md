# Disambiguate the frozen-history clause in `priority-is-rank-not-identity.md`

**Source**: `ai-agents/tasks/done/0161-disambiguate-the-frozen-history-clause-in-priority-is-rank-not-identity/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0161` · owner `fkit-coder`

## Goal

**The finding is the whole task: a convention page whose job is to stop two number-spaces being confused was itself ambiguous about which notation it governs — and it needed an owner ruling to read on the same day it shipped.**

The clause — the second bullet of `## What NOT to rewrite` in `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` — said *"Existing `priority (folderID)` notations are frozen history … never mass-edited."* **It never said which notation form it meant**, and two exist, one character apart in ordering:

| Form | Where | What it is |
|---|---|---|
| **board-cell** `124 (0150)` | a sprint board's Priority cell | a record of what that row meant on the day it was written |
| **prose** `0150 (124)` | a brief's reasoning text | a **live cross-reference that misdirects a reader today** |

A reader applying it to the prose form concludes the whole backlog is frozen and no stale cross-reference may ever be corrected. A reader applying it to the board-cell form concludes the opposite. **[[tasks/sweep-the-stale-rank-citations]] (`0159`)'s entire sweep hung on which reading was right.**

## Key Changes

**Nothing was decided here.** The owner ruled on 2026-07-27: **the clause covers the board-cell form only**; the prose form inside a brief's reasoning is not covered. This task's whole job was to make the clause say so in its own words, **so the next reader does not need the ruling repeated.**

One bullet, applied identically to **two files** — the page is dual-homed into `claude/scaffold/`. The edit states which form the clause covers, which it does not, what to do instead (**a dated correction appended, never a silent rewrite**), and carries **the owner's reasoning, not just the rule** — *a rule without its reason is what produced the ambiguity in the first place.*

**Two hard constraints, both already written on the page being edited:**

1. **Byte-identical dual-home parity.** Any edit lands in both copies; an edit to one is drift. The parity test that would catch it (`0133`) was **not landed**, so parity had to be checked by hand.
   > ✅ **Dated correction 2026-08-02 — `0133` has landed**, so this file's parity is now machine-checked rather than hand-checked: [[tasks/build-dual-home-parity-test]]. The sentence above is left byte-identical as the record of what was true at ship date. ⚠️ **But "byte-identical" is no longer the blanket rule it reads as here** — [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] (task `0132`) established a **third kind**, *audience-adapted*, by owner ruling 2026-08-01. It applies to files rewritten for a consuming project's reader; **this page's own convention pair is genuinely byte-identical in both homes** and is unaffected.
2. **Bare citations only — never a relative link — into `knowledge-base/{decisions,reports}/`.** Those directories are **never synced** into the scaffold and ship empty, so a relative link would be **dead in every project fkit sets up**. ⚠️ The page's own closing callout already says so and says *"Do not 'fix' this"* — the trap is a helpful instinct adding links back.

## Outcome

Done, **agent-closed — not owner-verified**.

`0159`'s brief had flagged this exact gap and **deliberately did not file it** — *"Raised for the owner; not filed unasked."* The owner approved filing on 2026-07-27.

**Prose only, and unenforced.** Nothing today tests a convention page's wording for clarity. This fixed the instance; **nothing stops the next ambiguous clause.**

⚠️ **The brief cited the clause by line number and then said not to trust it** — *"the durable pointer is the `## What NOT to rewrite` section, second bullet"*. That a brief has to say so is itself an instance of [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] (`0160`)'s class, and the brief says exactly that.

## Related

- [[tasks/implement-task-folder-name-scheme-change]] — `0103`, which wrote the page
- [[tasks/sweep-the-stale-rank-citations]] — `0159`, which the ambiguity blocked
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, the sibling class
- [[tasks/state-task-brief-step-5s-append-rule-in-full]] — `0157`, the rule half of the same arc
- [[systems/knowledge-base-structure]] — the conventions folder and its dual-home rule
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174` — the merit-ordering ruling; **the task that became its own proof case**
- [[tasks/append-a-dated-correction-note-to-adr-010]] — task `0143` — the knowledge-base correction-note form (⚠️ drift / ⛔ reversal, below the claim, left byte-identical) that sits under this convention
- [[tasks/record-the-canonical-merit-statement-form-in-the-convention-page]] — ⚠️ *Added 2026-08-22:* task `0178`, the same convention page's next extension
