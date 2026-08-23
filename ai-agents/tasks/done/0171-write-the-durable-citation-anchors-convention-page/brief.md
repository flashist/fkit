# Write the `durable-citation-anchors` convention page — dual-homed into the scaffold

## ID
0171

## Sprint
Sprint 6

## Priority
Sprint 6 P2

## Status
✅ Done (agent-closed — not owner-verified)

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

### 🆕 Scope widened by owner ruling 2026-08-02 — this task also REPAIRS 12 displaced pointers

> **✅ Owner-ruled 2026-08-02** (`AskUserQuestion`, in the live `/fkit-sprint-ship-loop` driver session,
> at task `0143`'s close): the **12 displaced `adr-010:NNN` pointers** produced by `0143` are **folded
> into this task** — *"fold into the durable-citation-anchors work (`0171`) — do NOT file standalone."*

**What happened.** Task [`0143`](../../done/0143-append-a-dated-correction-note-to-adr-010/brief.md)
appended `+71 / −0` lines to
`ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md` on 2026-08-02.
Every line number below the insertion points moved. **12 `adr-010:NNN` citations across ADR-012,
ADR-018 and ADR-031 now point at different text than they did** — count re-derived at filing 2026-08-02
by `grep -rno "adr-010:[0-9,-]*" ai-agents/knowledge-base/decisions/`.

- **10 self-correct in practice**, because they are paired with a quoted phrase — a reader who follows
  the number and finds the wrong text can still recover the claim from the quote. That pairing is
  §1.1's rider, and this is it working.
- **2 are naked** — `adr-012:87` and `adr-012:105` — and **now land on unrelated text with nothing to
  recover the intent from.** These are the failure case the rider exists to prevent.
- **None was repaired by `0143`**, whose *"note, not a rewrite"* constraint kept it inside ADR-010.

**Why this belongs here rather than in its own brief.** The 12 pointers are this convention's first
real specimen: repairing them **using the form the page defines**, in the same change that defines it,
is what proves the form is applicable rather than merely stated. Split apart, the page ships with no
worked application and the repair ships with no settled form.

**Cost of the fold, stated rather than buried:** this task is no longer a single-act write. It now has
two deliverables that can fail independently, and the repair half touches three files the page half
never would. If the owner would rather have the page ship alone, that is a live option — but it is a
change to the 2026-08-02 ruling, not a producer call.

### 🆕 Scope widened by owner ruling 2026-08-14 — the page ALSO records how to CHECK a claim about text

> **✅ Owner-ruled 2026-08-14** (`AskUserQuestion`, given live in a `fkit lead` session driving
> `/fkit-sprint-ship-loop`) — **verbatim option label: *"Fold it into `0171` (Recommended)"***.
>
> ⚠️ **This is a scope widening, recorded as one.** ⛔ It does **not** change this task's rank, status,
> `## Sprint`, `## Owner`, or either existing deliverable. It adds one required section to
> Deliverable A's page.

**Why it belongs here rather than in its own brief.** This page's subject is *how to make a claim about
text durable and checkable*. The rule below is the **checking** half of that same subject: a citation
form is worth nothing if the reader's verification command lies to them.

**What happened, and it is this page's second real specimen.** The 2026-08-14 backlog triage judged
task `0154` `STALE-PREMISE` because a single-line `grep -c "do not spawn the producer"` returned **0**
across the three wiki skills. **The clause is live in all three.** It wraps across a line break with an
indented continuation, so a single-line `grep` cannot see it. Measured 2026-08-14, naive / normalised:
**`0/1` in `fkit-wiki-ingest`, `fkit-wiki-sync` and `fkit-wiki-lint`.** Acting on that verdict would
have deleted a live rule from three files that ship into every consuming project. The full targeted
re-check of all 41 absence claims is the 2026-08-14 backlog-triage re-check report — **cited by name,
not linked** (this page is dual-homed; see accepted cost 2 above).

## What to build

### Deliverable A — the convention page

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

### 🆕 Piece 7 — verifying a claim about text. Added 2026-08-14 by the owner ruling above; NOT from report §8

**A required section of the page.** It is prescriptive, it is short, and its five points are all
measured facts, not advice.

1. **A single-line `grep` cannot see a phrase that wraps.** An **absence** claim over prose therefore
   needs **whitespace-normalised** matching before it may be asserted.
2. **The squeeze is load-bearing.** The form is `tr '\n\t' '  ' | tr -s ' '`, then match.
   ⚠️ **A bare `tr '\n' ' '` still misses it** — the continuation line's indent survives the join and
   becomes internal whitespace. Measured on the `0154` specimen: bare-join reads **0** in
   `fkit-wiki-ingest` and `fkit-wiki-lint` and **1** in `fkit-wiki-sync`, whose continuation happens to
   be flush-left. **Two of three is a false negative, not a near miss.**
3. **`grep -c` counts matching LINES, not occurrences.** Where a **count** is load-bearing — *"the
   file's only occurrence"*, *"exactly three sites"* — derive it with `grep -o … | wc -l`.
4. ⭐ **Direction matters, and this is what keeps the rule cheap. A PRESENCE claim cannot fail this
   way** — if a `grep` found the text, the text is there. **Only ABSENCE claims need the expensive
   form.** State this explicitly; without it a reader will over-apply the rule to every match they run.
5. **Record the known limits honestly, as the re-check recorded its own.** The normalised form is
   strong against wrapping and weak against these, all of which read as absence:
   - a phrase split across **markdown table cells** — a `|` between the halves survives every transform
     here;
   - **wording drift** — a rule reworded survives in different words and no matcher finds it; only the
     exact phrase chosen is tested;
   - **code fences are treated as prose** — a phrase found may be an illustrative example rather than a
     binding rule;
   - **hyphenation across a line break is not modelled** — a token broken as `task-\nbrief` joins to
     `task- brief` and is still missed.

⚠️ **Do not carry the measurements as the rule.** The `0/1` figures and the three filenames are a dated
specimen and belong in the *Provenance* or an example block, exactly as this page's "no measurements"
constraint below requires — the **rule** is points 1–5.

### What the page must NOT do

- **Do not link the report.** By name only — see the owner's accepted cost 2 above.
- **Do not restate case 1's rule.** `conventions/priority-is-rank-not-identity.md` is in force and
  owns it; reference it, do not duplicate it.
- **Do not carry the report's measurements.** Counts of dead paths and citation tallies are dated
  snapshots and belong in the report. A convention is prescriptive and current; the README's own
  lifecycle rule says it is maintained in place and carries no changelog.
- **Do not date the filename.** `conventions/README.md`'s naming rule: *"Never dated."*

### Deliverable B — repair the 12 displaced `adr-010:NNN` pointers

**Three files, all under `ai-agents/knowledge-base/decisions/`:** `adr-012-…`, `adr-018-…`,
`adr-031-…`. Re-derive the inventory first-hand — do **not** inherit the count or the coordinates from
this brief.

For each of the 12 citations:

- **Re-anchor it in the form Deliverable A defines** — file plus quoted fragment or heading, per §1.1's
  rider. Where a quoted phrase is already present and still matches ADR-010's live text, the citation
  is already durable in substance; the ruling on whether to strip the now-wrong `:NNN` beside it is the
  architect's, and must be **stated once and applied consistently**, not decided per line.
- **The two naked ones — `adr-012:87` and `adr-012:105` — are the priority.** They carry no quote, so
  the original intent is only recoverable by reading what ADR-010 said at those lines **before**
  `0143`'s append. Recover it from git history, not by guessing at what the current lines say.

**Constraints on Deliverable B:**

- ⛔ **These are `accepted` ADRs. Repair the pointer; change nothing else on the line.** No prose, no
  status, no date, no decision text. This is the same rule `/fkit-task-done` applies to a
  knowledge-base back-link: *a historical record's claims are frozen; its pointers are not.*
- ⛔ **Do not touch ADR-010 itself.** Its outbound citations are task `0197`; its content corrections
  are `0195` and `0196`.
- ⛔ **Do not touch `ai-agents/wiki-vault/`.**
- ⚠️ **If `0195`, `0196` or `0197` land first, the line numbers shift again.** Re-derive at
  implementation time; that recurrence is itself the argument the convention page makes.

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

**Deliverable B:**

9. `grep -rno "adr-010:[0-9,-]*" ai-agents/knowledge-base/decisions/` is run **before and after**, and
   both results are recorded in the worklog with the date. A count asserted without both readings fails
   this step.
10. **No naked `adr-010:NNN` remains** — every surviving one is paired with a quoted fragment or a
    heading. Check each by opening the target, not by pattern alone.
11. `adr-012:87` and `adr-012:105` each carry a recovered statement of what they originally cited, and
    the worklog records **how it was recovered** (the git revision consulted).
12. ADR-012's, ADR-018's and ADR-031's prose, `**Status:**` lines, dates and decision text are
    **unchanged** — verify by `git diff`, and expect the diff to touch citation text only.
13. The repaired citations use the form Deliverable A's page defines. If they diverge, **the page is
    what is wrong** — say so rather than repairing the citations to match a page you did not follow.

**🆕 Piece 7 (added 2026-08-14):**

14. The page carries all five points of piece 7, including **point 4 — that presence claims are exempt.**
    A page that requires normalised matching for every claim has widened the rule beyond what the owner
    ruled and is wrong.
15. The **squeeze** appears in the prescribed form (`tr -s ' '`), and the page states that a bare
    `tr '\n' ' '` is insufficient. `grep -F "tr -s" ` on both copies returns **≥1**.
16. All four known limits are listed. ⛔ **A page that presents the normalised form as a clean sweep
    fails this step** — the honesty about what it still misses is the point, not a footnote.
17. Both copies remain byte-identical after this section is added (re-run step 2).

## Notes

- **Depends on:** nothing. The ruling it carries is already made — `0160` is closed and the report is
  final.
- **Blocks:** 0172 (the architect `## Output format` bullet narrows to point at this page), 0176 (the
  coordination-citation guard is this page's enforcement point).
- **⛔ SERIALIZATION — recorded 2026-08-02 at `0195`'s close, and it affects this task's *folded-in*
  half only.** The 12 displaced `adr-010:NNN` pointers in ADR-012 / ADR-018 / ADR-031 were owner-ruled
  into this task on 2026-08-02. **That half must run AFTER all three ADR-010 appends** —
  **`0195` (✅ landed 2026-08-02) → `0196` → `0197` → `0171` (this task) → `0199`.** Every append shifts
  ADR-010's line numbering, so re-anchoring the 12 pointers any earlier measures against a **moving
  baseline** and the new anchors re-rot on the next append. The **convention-page** half of this task
  has no such constraint and may be written at any time. **This is an ordering constraint on file
  writes, not a `Depends on:`** — nothing here waits on another task's *outcome*, and the `## Priority`
  ranks are append ranks that do not encode it (ADR-035).
- **Owner is `fkit-architect`**, as named in report §8. A new convention is a rule imposed on every
  future run; per `conventions/README.md` it needs the **owner's** sign-off. The owner has ruled the
  page exists and is dual-homed — they have **not** signed off on its wording.
- **Pre-existing index gap, found while filing this brief and NOT fixed here:**
  `conventions/dependency-declaration-form.md` exists in the live tree but is **absent from the live
  `conventions/README.md` index table**. Out of this task's scope. Raised, not silently fixed.
- **Rank 150 is APPEND rank, not merit rank**, assigned under `/fkit-task-brief` step 5 by a spawned
  producer with no owner channel. **Flagged for owner confirmation.** No existing row was renumbered
  by this brief.
- **🆕 Scope widened 2026-08-02 by owner ruling** — Deliverable B, the 12 displaced `adr-010:NNN`
  pointers from task `0143`. **The rank did not change** and no row was renumbered by the widening.
  ⚠️ **If the owner reconsiders the fold**, Deliverable B splits cleanly into its own brief; the ruling
  is what keeps it here.
- **🆕 Scope widened again 2026-08-14 by owner ruling** — verbatim option label
  ***"Fold it into `0171` (Recommended)"***, given live via `AskUserQuestion` in a `fkit lead` session
  driving `/fkit-sprint-ship-loop`, recorded by a spawned `fkit-producer` with no owner channel
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **Piece 7 — the wrap-tolerant verification rule — is now a required section of Deliverable A's page.**
  ⛔ **The rank did not change, no row was renumbered** (ADR-035), `## Status`, `## Sprint`, `## Priority`
  and `## Owner` are untouched, and **neither existing deliverable changed.** ⚠️ **Cost, stated rather
  than buried:** Deliverable A's page grows by one section and its dual-home parity obligation grows with
  it — the section must land in **both** copies, byte-identical, like everything else on the page.
  ⚠️ The widening's own specimen (task `0154`) is **not** in Sprint 6 and this task does not touch it.
- **Soft-relationship with `0197`.** `0197` repairs ADR-010's **outbound** `path:NNN` citations using
  this page's form; Deliverable B repairs the **inbound** `adr-010:NNN` citations. Different direction,
  same rule, two tasks. `0197` records this task as a soft dependency; this task is not blocked by it.

## Close note — 2026-08-22

### ⛔ Verification step 8 is SUPERSEDED, not met

**Read this before citing step 8.** Step 8 as written above says verbatim: *"No file under
`ai-agents/tasks/`, `ai-agents/sprints/` or `ai-agents/wiki-vault/` is modified."* Three facts, all
three of which a later reader must see together:

1. **Step 8 as written was NOT met literally.** This task's run modified `ai-agents/sprints/backlog.md`
   at five lines — `:139`, `:186`, `:220`, `:222`, `:225`. That is a real, disclosed deviation from the
   brief's own text. It is not being marked met.
2. **Those edits were citation-text-only and zero-net.** No `## Status` value, no rank, no row order and
   no row count changed — only citation text inside existing cells. The worklog and the review ledger
   both record them; ledger round **R9** in fact caught the worklog falsely claiming `backlog.md` was
   untouched and forced that correction. ⚠️ **The five `:NNN` above are mutable coordinates into a
   living board and will drift** — the durable anchors are this task's own
   [`worklog.md`](worklog.md) §8 *"Not done — held scope"* (*"`backlog.md` is NOT untouched — corrected
   by round-2 R9"*) and [`review.md`](review.md) row **R9**, whose disposition cell reads *"§8 now
   states `backlog.md` carries five citation-only, zero-net edits … under owner ruling, with no
   `## Status`, rank, row order, or row count change."*
3. **A later owner ruling superseded the earlier written step, and that ruling governs.** The edits were
   made under a live owner ruling relayed mid-run, verbatim option label ***"Repair the authorized
   surfaces only (the worker's recommendation)."*** The supersession itself was then ruled on
   **2026-08-22**, live via `AskUserQuestion` in a `fkit lead` session driving `/fkit-sprint-ship-loop`,
   verbatim option label ***"Ruling governs — record it (Recommended)"***, description verbatim:

   > *"Your later live ruling overrides the brief's earlier written step 8. The producer records this at
   > close: step 8 was superseded by owner ruling, edits were disclosed and zero-net. Task closes as
   > MEETS."*

⛔ **The five `backlog.md` edits stand — they are not to be reverted.** Step 8 stays written as it was;
it is superseded, not amended, and this note is the record of that.

### Close basis

- Re-verified this session by a spawned `fkit-coder`: **VERDICT: MEETS** — 17 criteria, 16 met (step 8
  superseded per above); `node --test` **732/732, 0 fail**; both dual-homed copies byte-identical
  (`sha256` `2ef1f155…`, 233 lines / 15825 bytes); `structure-manifest.tsv:64` hash matches the live file.
- Reviewed twice — round 1 `fkit-reviewer` **+ Codex `gpt-5.6-sol`, coverage FULL**, 7 findings resolved;
  round 2 convergence pass, 5 findings fixed, verdict verbatim: *"Called proactively: `0171` has
  converged. Recommend closeout after R12."*
- Closed by a **spawned** `fkit-producer` with **no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  so per [ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
  §5 this close is **not owner-verified** and carries that marker. The MEETS verdict, the two review
  rounds and the ruling above do **not** upgrade it.
- ⚠️ This close **recovered an interrupted one**: a previous spawned producer completed the folder move
  and died on an infrastructure error before sweeping references. The move was not redone; the remaining
  steps were completed here.
