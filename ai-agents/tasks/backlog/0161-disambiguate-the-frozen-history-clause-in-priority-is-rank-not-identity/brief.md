# Disambiguate the frozen-history clause in `priority-is-rank-not-identity.md`

## ID
0161

## Sprint
Sprint 2

## Priority
131

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### The defect: a page that shipped this morning already needed a ruling to read

`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` shipped **2026-07-27** as task
**0103**. Within the same day it **required an owner ruling to interpret**. That is the whole finding: a
convention page whose job is to stop two number-spaces being confused was itself ambiguous about which
notation it governs.

The clause is the second bullet of the `## What NOT to rewrite` section (`:38` as the file stands today —
the section heading is the durable pointer):

> - **Existing `priority (folderID)` notations are frozen history.** They record what a row meant on the
>   day it was written. The notation simply becomes unnecessary going forward — it is never mass-edited.

**It never says which notation form it means.** Two forms exist, one character apart in ordering:

| Form | Where it appears | What it is |
|---|---|---|
| **board-cell** `124 (0150)` | a sprint board's Priority cell | a record of what that row meant on the day it was written |
| **prose** `0150 (124)` | a brief's reasoning text | a **live cross-reference** that misdirects a reader today |

A reader applying the clause to the prose form concludes the whole backlog is frozen and no stale
cross-reference may ever be corrected. A reader applying it to the board-cell form concludes the
opposite. **Task 0159's entire sweep hung on which reading was right.**

### The owner ruling — already made, 2026-07-27

> **The clause covers the board-cell form `124 (0150)` ONLY.** It does **not** cover the prose form
> `0150 (124)` inside a brief's reasoning.
>
> The owner's reasoning: *a board cell records what a row meant on the day it was written; prose inside a
> brief is a live cross-reference that misdirects a reader today.*

That ruling unblocked **0159**. **This task's whole job is to make the clause say so in its own words, so
the next reader does not need the ruling repeated.** Nothing is being decided here — the decision exists
and is recorded. This is transcription of a settled ruling into the page that should have carried it.

0159's brief flagged this exact gap and **deliberately did not file it** ("*Raised for the owner; not
filed unasked*"). The owner approved filing it on 2026-07-27. This is that brief.

### Two hard constraints — both already written on the page being edited

**1. The page is dual-homed and must stay byte-identical.** Both copies —

- `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`
- `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`

— are verified identical as of 2026-07-27 (`sha256 340ab5cb…`). `dual-home-parity.md`'s parity table
marks `knowledge-base/conventions/*.md` **✅ must match**. **Any edit lands in both copies, byte for
byte.** An edit to one is drift, and task **0133** is building the test that will fail on it.

**2. Bare citations only — never a relative link — into `knowledge-base/{decisions,reports}/`.**
`dual-home-parity.md`'s same table marks those directories **⛔ never sync**; the scaffold ships them
`.gitkeep`-only. A relative link into either would be **dead in every project fkit sets up**.

> **⚠️ This constraint is already stated on the page, in its own closing callout**, which says ADR-029
> and the decision report *"are cited by name and NOT linked — deliberately. Do not 'fix' this."*
> **Do not let a helpful instinct add links back.** The callout also gives the test to apply before
> adding any link: the target must itself be dual-homed and present in both trees — which is why
> `task-status-vocabulary.md` **is** linked and the ADR is not.

## What to build

**A prose edit to the `## What NOT to rewrite` section's second bullet, applied identically to both
copies of the page. One logical change, two files. No code, no test, no other page.**

1. **State which form the clause covers.** The bullet must name the **board-cell** form and say the
   clause applies to it. Show the form so it cannot be confused — the two differ only in ordering.
2. **State which form it does not cover, and what to do instead.** Prose cross-references inside a
   brief's reasoning are **not** frozen by this clause; they are live cross-references and a stale one is
   corrected. Point at the existing practice — a **dated correction appended, never a silent rewrite** —
   rather than inventing a new procedure.
3. **Carry the reason, not just the rule.** Half a sentence of the owner's own reasoning: a board cell
   records what a row meant on the day it was written; brief prose misdirects a reader today. A rule
   without its reason is what produced the ambiguity in the first place.
4. **Date and attribute the ruling** in the page's established style — the page already carries
   *"Approved by the owner on 2026-07-27"* in its opening block and *"Owner ruling, 2026-07-27"* in its
   closing callout. Match that style; do not invent a new one.
5. **Keep it tight.** This is one bullet gaining clarity, not a new section. The page is dual-homed and
   ships to every project — every line costs twice.

**Explicitly not in scope:** the other two bullets of `## What NOT to rewrite`, the `## What to write`
table, the `## Where this is enforced` list, and any citation-form rule beyond this one clause. Anything
broader belongs to **0160**.

## Verification steps

1. **The clause answers the question standalone.** Read the edited bullet with no other context and
   answer: *"I am correcting a stale `0150 (124)` cross-reference inside a brief's reasoning — does this
   clause forbid me?"* The text must yield **no, and append a dated correction** — with no appeal to a
   ruling, a task brief, or this brief.
2. **The mirror question also lands.** *"I want to mass-edit the `124 (0150)` cells on a sprint board."*
   The text must yield **no — that is the frozen form.**
3. **Byte-identical parity holds.** After the edit:
   ```sh
   diff ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md \
        claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md
   ```
   produces **no output**, and the two `shasum -a 256` values match. A diff of any kind fails this task.
4. **No relative link was added into a never-sync directory.**
   `grep -nE '\]\(\.{0,2}/?(\.\./)*(decisions|reports)/' ` over **both** copies returns nothing. The
   existing bare citations to ADR-029 and the decision report are **still bare and still present**.
5. **The existing protections are intact.** Diff the page: the opening approval block, the other two
   `## What NOT to rewrite` bullets, the `## What to write` table, the `## Where this is enforced` list,
   and the closing do-not-link callout are all present and **no weaker than before**. A diff that removes
   or qualifies any of them has failed this task.
6. **The change surface is exactly two files.** `git diff --stat` shows the two copies of
   `priority-is-rank-not-identity.md` and **nothing else** — no task brief, no sprint plan, no skill file.
   **No task file moved** between `backlog/`, `done/` and `cancelled/`, and **no board rank changed**:
   `grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md` returns the identical sequence before and
   after.
7. **Nothing was written to `ai-agents/wiki-vault/`.** `git status` shows no change under that path.
8. **The suite is still green.** `node --test test/` passes. Nothing here should touch it — if something
   goes red, stop and report; do not adjust a test to fit a prose edit.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **⚠️ Must not contradict 0159.** `0159`'s brief records the owner's interpretation with its date, in its
  *Ruling 2*. The wording written here and 0159's recorded ruling **must say the same thing.** If the
  implementer finds they would say something different, **stop and raise it** — a divergence means one of
  the two is wrong, and this brief is not the place to settle it silently. 0159 needs no edit if the two
  agree.
- **No change-surface conflict with 0159.** Verified 2026-07-27: 0159 edits task briefs and the sprint
  plan; it does **not** edit this convention page. The two can run in either order or concurrently.
- **Sibling — 0160 (the citation-form class).** 0160 decides the durable-anchor form for line numbers and
  ledger paths. **Soft preference: land this one first**, so 0160's case-3 reasoning reads a
  frozen-history clause that already says what it means. **Neither blocks the other.**
- **⚠️ This brief cites `:38` because that is how the gap was reported.** The durable pointer is the
  **`## What NOT to rewrite` section, second bullet** — use that if the line has moved by implementation
  time. (That this brief has to say so is itself an instance of 0160's class.)
- **Dual-home is the one real trap here** — the edit is small and the parity requirement is easy to
  half-do. 0133 is building the test that would catch it; **it is not landed yet**, so parity must be
  checked by hand at verification (step 3).
- **Prose only, and unenforced.** Nothing today tests a convention page's wording for clarity. This fixes
  the instance; nothing stops the next ambiguous clause. State that honestly in the closing report.
- **✅ The append-confirmation flag is discharged — priority is now 128, an owner-ruled merit rank.**
  **Authority: the owner ruled it on 2026-07-27, via `AskUserQuestion` in the live
  `/fkit-sprint-ship-loop` driver session.** A spawned `fkit-producer` executed the move on that
  instruction and contributed no placement judgment of its own. **This is not producer precedent for
  re-ranking at filing time.**
  *History, kept because the flag's reasoning is the ruling's reasoning.* This brief was filed at
  append rank **139** by a spawned producer with no owner channel; per `/fkit-task-brief` step 5
  appending was the only sanctioned option, and it flagged that **on merit this belongs materially
  higher — immediately below 0157**, and above 0160. The owner accepted that argument: it is one of the
  cheapest items on the board (one bullet, two files, no design call, no infrastructure), the **decision
  it records is already made**, and its cost of waiting is a **recurring owner adjudication** — the
  ambiguity already cost one ruling on the day the page shipped, and it will cost another the next time
  anyone reads the clause. It now sits at **128, immediately below 0157 (127)**.
