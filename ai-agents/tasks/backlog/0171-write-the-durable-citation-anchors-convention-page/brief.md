# Write the `durable-citation-anchors` convention page — dual-homed into the scaffold

## ID
0171

## Sprint
Sprint 2

## Priority
150

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### Where this comes from

Task `0160` ruled the durable citation form for mutable coordinates. Its deliverable is
[the 2026-08-01 durable-citation report](../../../knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md),
whose §8 names eight follow-ups for the producer to file. **This is follow-up 1.** The report rules;
it deliberately writes nothing. This task writes the standing rule.

Per `conventions/README.md`'s own root rule, a report is **never promoted** into `conventions/` — *"if
a report's conclusion hardens into a rule the project follows, the rule gets written as its **own**
convention document, and the report stays where it is as the evidence behind it."* That is exactly
this task's shape: a new page, not a moved one.

### The four bars a new convention must clear, checked against this one

`conventions/README.md`, section *"The bar for adding one"*, requires all four:

1. **Read on a normal run** — yes. Every architect writing a design doc, every reviewer writing a
   ledger row, every agent citing a sprint board hits this question.
2. **Prescriptive** — yes. §1's rule block is compliable and violable.
3. **Enforceable somewhere** — yes, partly. Task `0176` (follow-up 8) is the syntactic guard for the
   coordination-document half. The page must state honestly which halves are enforced and which are
   not; the report's §10 records what stays unenforced.
4. **Not already covered** — yes. `conventions/priority-is-rank-not-identity.md` covers board rank
   only (row 5 of the table below); nothing covers the rest.

### Owner ruling — the page is dual-homed

> **✅ Owner-ruled 2026-08-01 (report §11, open question 5): the page IS dual-homed** into
> `claude/scaffold/ai-agents/knowledge-base/conventions/`.
>
> Recorded reasoning: the rule is about how **any** project's agents cite anything, not about fkit's
> internals — a consuming project's agents cite line numbers into their own growing documents too.

**The two costs the owner accepted, recorded rather than buried:**

1. **Every future edit is bound to two byte-identical files.** Per `conventions/dual-home-parity.md`,
   a file existing in both trees must be edited in both. Once both copies exist that is not optional.
2. **The report can be cited from the page only BY NAME, never linked.**
   `claude/scaffold/ai-agents/knowledge-base/reports/` ships **empty** — verified 2026-08-01, it holds
   only `.gitkeep`. A relative link from the dual-homed page would resolve in this repo and dangle in
   every project that installs fkit — **the exact defect class this report is about.** Cite it as
   *"the 2026-08-01 durable-citation report (task `0160`)"*, with no href.

### A scoping fact this brief adds, found while filing it

**Dual-homing this page touches FOUR files, not two.** Both `conventions/README.md` copies carry a
*"What's here"* index table that a new convention must be added to, and the **scaffold** copy opens
that section with the sentence *"Six conventions ship with the scaffold"* — a count that becomes false
the moment this page lands. Verified 2026-08-01: the scaffold conventions folder holds 7 of the live
tree's 9 pages; `dependency-declaration-form.md` and `dual-home-parity.md` are fkit-only, and
`dual-home-parity.md`'s fkit-only status is stated in the live README's footnote.

## What to build

**One new convention page, written twice, byte-identical:**

- `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`
- `claude/scaffold/ai-agents/knowledge-base/conventions/durable-citation-anchors.md`

**Plus the two index updates:** a row in each `conventions/README.md`'s *"What's here"* table, and the
scaffold README's *"Six conventions ship with the scaffold"* count corrected.

### What the page must carry — six pieces, all named by report §8

The report's §8 row 1 lists these explicitly. Each is quoted or paraphrased from the report; read the
section, do not work from this list alone.

1. **§1's rule** — the block that opens the section:

   > *"A coordinate is safe to cite when the citer controls or freezes the target's revision. It is
   > unsafe when a third party edits the target after you write. Line numbers are for findings against
   > a revision. Names are for cross-references into living documents."*

2. **§1's five-row table** — the *"If the target is… / …then / Because"* table, in full. Its five rows
   rule on: a source/test/skill/agent file cited in a design doc or finding; a file under review cited
   in a review ledger; a **coordination document** others append to; a **task**; and a **board
   position**. Carry the `Because` cells — they are what makes the rows decidable.

3. **§1's R22 scope note** — **mandatory, and the reason it is mandatory is this task.** The report
   states it plainly: *"the overclaim matters because follow-up 1 copies this section into a
   convention page."* The claim-versus-pointer question is a **first cut**, not the whole test: walked
   against the five rows it cleanly decides **one** (row 2), and *"a writer who applies it alone will
   get row 3 wrong in the unsafe direction."* Carry the note's own conclusion verbatim in substance —
   **both conditions must be read together**, the claim-versus-pointer question **and** whether the
   target is a document a third party edits under you. The second is what makes row 3 categorical.

4. **§1.1's rider** — *"Never cite a line number naked. Pair every `path:NNN` with a quoted fragment
   or the heading it sits under."* The report calls this *"the single highest-value recommendation in
   the report"*, applying to **all four cases at once**. It belongs near the top of the page, not in a
   footnote.

5. **§1.2's ledger-row practice note** — the review-ledger `file:line` cell **stands**; the ban does
   not touch it, because a finding is a claim about a frozen revision. But the rider reaches it. The
   ask on a reviewer is: **put the quoted fragment or heading in the `Claim` cell, always.** State
   plainly, as §1.2 does, that this is a **practice** recommendation and **not a schema change** — the
   findings row schema has no quote field, and changing it is explicitly out of scope here and out of
   scope for task `0168`.

6. **§4.2.1's link-label writer rule, in its narrowed R20 wording** — **this exact form, and NOT the
   withdrawn `never`:**

   > *"Do not use a mutable location as the visible label of a forwarding link into a living
   > document."*

   With its explanation: label a link with what the target **is** (`brief`), never with where it
   **lives**. The target carries location; the label carries meaning.

   > **⚠️ Do not restore the first wording.** The rule was first written *"a link's display text must
   > **never** be a mutable coordinate"* and was **narrowed in round 3 (R20)** because as written it
   > contradicted §1, which rules `path:NNN` **correct** for a source file cited in a design doc —
   > including when that citation is wrapped in a link. **The ban belongs to forwarding links into
   > living documents.** A label that is a claim about a revision the writer read is governed by §1,
   > not by this rule.

### What the page must NOT do

- **Do not link the report.** By name only — see the owner's accepted cost 2 above.
- **Do not restate case 1's rule.** `conventions/priority-is-rank-not-identity.md` is in force and
  owns it; reference it, do not duplicate it.
- **Do not carry the report's measurements.** Counts of dead paths and citation tallies are dated
  snapshots and belong in the report. A convention is prescriptive and current; the README's own
  lifecycle rule says it is maintained in place and carries no changelog.
- **Do not date the filename.** `conventions/README.md`'s naming rule: *"Never dated."*

## Verification steps

1. `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` exists and
   `claude/scaffold/ai-agents/knowledge-base/conventions/durable-citation-anchors.md` exists.
2. `diff` between the two returns **no output** — byte-identical, per `conventions/dual-home-parity.md`.
3. The page contains all six pieces listed above. Check each by name against the report's §1, §1.1,
   §1.2 and §4.2.1 — not against this brief.
4. The R20 rule appears in its **narrowed** wording. `grep -c` for the string
   `never be a mutable coordinate` in both copies returns **0**.
5. `grep` both copies for `reports/` and for `2026-08-01-durable-citation` inside a markdown link —
   **no hits.** The report is cited by name only.
6. Both `conventions/README.md` copies list the new page in their *"What's here"* table; the scaffold
   README no longer says *"Six conventions ship with the scaffold"* when seven now do.
7. `npm test` passes. If `test/dual-home-parity.test.js` exists by the time this lands (task `0133`),
   it must be green on the new pair; if it does not exist, say so rather than claiming it passed.
8. No file under `ai-agents/tasks/`, `ai-agents/sprints/` or `ai-agents/wiki-vault/` is modified.

## Notes

- **Depends on:** nothing. The ruling it carries is already made — `0160` is closed and the report is
  final.
- **Blocks:** 0172 (the architect `## Output format` bullet narrows to point at this page), 0176 (the
  coordination-citation guard is this page's enforcement point).
- **Owner is `fkit-architect`**, as named in report §8. A new convention is a rule imposed on every
  future run; per `conventions/README.md` it needs the **owner's** sign-off. The owner has ruled the
  page exists and is dual-homed — they have **not** signed off on its wording.
- **Pre-existing index gap, found while filing this brief and NOT fixed here:**
  `conventions/dependency-declaration-form.md` exists in the live tree but is **absent from the live
  `conventions/README.md` index table**. Out of this task's scope. Raised, not silently fixed.
- **Rank 150 is APPEND rank, not merit rank**, assigned under `/fkit-task-brief` step 5 by a spawned
  producer with no owner channel. **Flagged for owner confirmation.** No existing row was renumbered
  by this brief.
