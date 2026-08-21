# Define the `- **Corrections:**` header-warning equivalent for task briefs and sprint-board rows

## ID
0315

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Owner-ruled filed 2026-08-21**, live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` — **verbatim option label: *"File it as a task (Recommended)"***. Filed by a
**spawned** `fkit-producer` with no owner channel.

### The gap, verified first-hand on disk 2026-08-21

The dated-correction-note form lives in
[`claude/skills/fkit-record-decision/SKILL.md`](../../../../claude/skills/fkit-record-decision/SKILL.md),
under the heading **"Correcting an accepted ADR — the dated correction note"**. Its
**"Piece by piece — the form has three parts"** list names part 3 as:

> *"A header **`- **Corrections:**`** metadata bullet, listing the annotated sites."*

That bullet is the device that warns a reader, **at the top of the document**, that annotations exist
below. The form's own **"Placement — below the claim, deliberately"** paragraph makes the dependency
explicit — it justifies below-placement precisely because *"the reader is already **warned** first by
the header `- **Corrections:**` bullet, so below-placement costs no warning."* **Remove the header
bullet and that justification collapses**: the note sits below the claim with nothing warning a reader
who never scrolls that far.

**The bullet is specified for an ADR header, and only an ADR has one.** Verified by reading the
structures:

| Document | Header shape | Does part 3 have somewhere to attach? |
|---|---|---|
| An ADR (e.g. `adr-035-…`) | H1, then a **metadata bullet list** — `- **Status:**`, `- **Date:**`, `- **Deciders:**`, `- **Scope:**` | **Yes** — `- **Corrections:**` joins that list |
| A **task brief** | H1, then `## ID` / `## Sprint` / `## Priority` / `## Status` / `## Owner` / `## Context` / `## What to build` / `## Verification steps` / `## Notes` — **heading-and-value sections, no metadata bullet list anywhere** | **No** |
| A **sprint-board / Backlog row** | one row of a four-column `Status \| Priority \| Task \| Brief` table | **No** |

The brief skeleton is the one `/fkit-task-brief` prescribes under **"Draft each brief"**, and it
carries no bullet list the part-3 bullet could join. A board row is a single table row; it has no
header at all. **So corrections written into briefs and board rows ship without the header warning the
form relies on** — the form is silently two-thirds applicable outside ADRs.

### Four workers hit this independently in one sprint run, and each improvised differently

Surfaced independently by **four** workers during the 2026-08-15/21 sprint-6 `/fkit-sprint-ship-loop`
run. **Each declared its deviation; none was wrong; there is no standard** — which is the actual
defect. The four substitutes:

1. **A dated ⚠️ blockquote at the claim site**, with no header pointer at all.
2. **A mirrored `## Notes` pointer bullet** that names where the real correction lives.
3. **An inline in-cell append on a board row** — the correction written into the row's own Task cell.
4. **Declaring the deviation in the close report and moving on** — nothing written into the document.

Substitutes 1 and 2 are both **live in one file right now**:
[`0180`](../0180-build-the-brief-missing-merit-guard/brief.md) carries dated ⚠️ blockquotes inside
`## Context` **and** a `## Notes` pointer bullet reading *"the re-measured corpus figures … live in the
dated correction under §'Two accepted costs' above — **deliberately not restated here, so there is one
place to keep true rather than two**."* Substitute 3 is live in
[`backlog.md`](../../../sprints/backlog.md), whose `0314` row carries an in-cell
*"⚠️ CORRECTION TO THE ROUTING NOTE THAT FILED THIS ROW"* clause. **Whatever this task decides, it is
choosing among practices already in the repo, not inventing from nothing.**

### ⚠️ The constraint any solution must respect — `dashboard.sh` parses both structures

Flagged by [`0198`](../../done/0198-teach-record-decision-the-dated-correction-note-form/brief.md)'s
own work and by a later worker, and **re-verified first-hand here** against
[`claude/skills/fkit-status/dashboard.sh`](../../../../claude/skills/fkit-status/dashboard.sh):

- **A new `## Corrections` section is not free.** The `field_value()` helper reads *"the first
  non-empty value under a `## <field>` heading"* and **terminates on the next line matching `^## `**.
  Every `## `-level heading is therefore a section boundary the parser already honours; adding one
  changes where existing sections end.
- **A decorated bullet placed next to `- **Depends on:**` is worse.** The dependency parser is a closed
  grammar with four forms (`S` section, `BL` bold-label, `BI` bold-inline, `P` plain), and its own
  documented **rule 3** is: *"BI is the ONLY form with an unambiguous in-band terminator. For BL/P/S,
  **OVER-INCLUDE** trailing prose rather than guess where the dependency ends."* A `- **Corrections:**`
  bullet written adjacent to a `- **Depends on:**` declaration can therefore be **swallowed into the
  dependency text and rendered into the board's Task cell**. This is the same family as the task-84
  misreport recorded in
  [`dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md).
- The brief-side drift kinds `brief-missing-status`, `brief-missing-owner` and `brief-missing-id` all
  key off this same section grammar, so **a structural change here is a dashboard change, not a
  documentation change**.

### ⚠️ Relationship to `0311` — stated, deliberately NOT resolved

[`0311`](../0311-specify-the-corrections-bullet-own-date-and-metadata-position/brief.md) —
*"Specify the `- **Corrections:**` header item's own date and its position among ADR metadata"* —
already covers the bullet's own date and its metadata position **for ADRs**. **This task is the
*briefs and board rows* case**: whether that device gets an equivalent at all outside an ADR.

**They are adjacent and could reasonably be collapsed into one.** ⛔ **The filing producer did not fold
them, and must not.** The owner **considered folding them and chose a separate task** — that is the
2026-08-21 ruling recorded above. If the owner later prefers one task, collapsing them is a single
edit; the fold is theirs to make, not a worker's.

## What to build

**This is a decision task. It frames the decision; it does not arrive having taken it.** ⛔ Do not
ship a form change without the decision being ruled.

1. **Establish the two candidate answers and their costs**, without pre-picking one:
   - **(A) Define a header-warning equivalent** for briefs and for board rows — some device at the top
     of a brief, and something in a board row, that tells a reader annotations exist below. Must clear
     the `dashboard.sh` constraint above.
   - **(B) Record deliberately that briefs and board rows get no header warning**, and **standardise
     the substitute instead** — pick one of the four improvised practices, write it into the form, and
     state plainly what is lost by having no top-of-document warning.
2. **Cost out the placement options for (A)** against the parser: a new `## Corrections` section, an
   extension of an existing section, a bullet inside `## Notes`, a fixed position relative to
   `- **Depends on:**`, or a non-`## ` device. **Say which of these the parser tolerates and which it
   does not** — evidence from `dashboard.sh`, not from reading the brief.
3. **Handle board rows separately from briefs.** A row has no header and one usable cell; the answer
   for a brief may not transfer. **Deciding briefs and leaving rows unanswered is a half-answer** —
   substitute 3 exists precisely because rows were unaddressed.
4. **Put the decision to the owner** and record it. If the outcome changes the correction form itself,
   the edit lands in `claude/skills/fkit-record-decision/SKILL.md` — and if it needs a rule with
   reasons, record it as an ADR via `/fkit-record-decision`.
5. **State the `0311` relationship in whatever is produced**, so a later reader sees the ADR half and
   the brief/row half are two halves of one question that the owner chose to keep apart.

### Out of scope

- **⛔ Do not fold `0311` into this task, or this task into `0311`.** Owner ruling, 2026-08-21.
- **⛔ Do not re-open the two-marker legend** (⚠️ drift / ⛔ reversal). There is no third marker.
- **⛔ Do not re-open below-the-claim placement** for the note itself — only the *warning* device is
  in question.
- **⛔ Do not touch `claude/skills/fkit-status/dashboard.sh` or `test/dashboard-contract.test.js`** as
  part of the decision. If the ruling needs a parser change, that is its own brief.
- **⛔ Do not retro-fit corrections already written** into existing briefs or rows. Whatever is decided
  applies forward; existing notes are history.
- **⛔ Do not edit the gitignored `.claude/` copies** — the canonical source is `claude/`.
- **⛔ Do not add a devDependency** — ADR-014, zero devDeps.
- **⛔ Do not re-rank anything.**
- **⛔ Write no `:NNN` line-number citations** — these are living documents; cite by file and quoted
  phrase.
- **⛔ Do not touch `ai-agents/wiki-vault/`** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. Both options (A) and (B) are written up with their costs, and **neither is presented as already
   chosen** before the owner rules.
2. The `dashboard.sh` constraint is **re-verified first-hand at implementation time** — quote the
   `field_value()` termination behaviour and the dependency grammar's over-include rule from the file,
   and say whether they still read as described here. **Report any divergence rather than assuming
   this brief is current.**
3. Each candidate placement is marked **parser-safe** or **parser-unsafe**, with the evidence that
   settled it.
4. **Board rows are answered explicitly**, in their own paragraph — not folded into the brief answer.
5. The owner's ruling is recorded verbatim (option label and date), in whatever artifact the decision
   lands in.
6. If `claude/skills/fkit-record-decision/SKILL.md` is edited, the change is **append-consistent with
   the existing form**: the three-part list still reads as three parts, or the edit says explicitly
   that part 3 is now conditional on document type.
7. The `0311` relationship is stated in the produced artifact, including that the owner **chose not to
   fold them**.
8. `npm test` passes if any file under `claude/` or `test/` changed.
9. `grep` for `\.md:[0-9]` over the changed files returns nothing.

## Notes

- **Depends on:** nothing. It is decidable today; `0311` is adjacent, not a prerequisite.
- **Blocks:** nothing.
- **⚠️ Adjacent, deliberately not folded:**
  [`0311`](../0311-specify-the-corrections-bullet-own-date-and-metadata-position/brief.md) covers the
  `- **Corrections:**` bullet's own date and metadata position **for ADRs**; this task covers **briefs
  and board rows**. The owner considered folding them on 2026-08-21 and **chose a separate task**.
  Whichever runs second should re-read the other rather than applying its brief verbatim — both may
  touch `claude/skills/fkit-record-decision/SKILL.md`.
- **⚠️⚠️ The closest neighbour is `0307`, and it is NOT `0311`. Found by the filing producer while
  verifying the parser constraint, not carried in from the ruling.**
  [`0307`](../0307-decide-how-the-derive-cell-reaches-a-corrected-dependency-line/brief.md) —
  *"Decide how a corrected dependency line reaches the dashboard's derive cell — `0046` and `0168`
  still print the stale text"* — is the **same collision, one field over**: a dated correction written
  into a **task brief**, annotating a `- **Depends on:**` declaration, which `dashboard.sh` cannot see
  because the note sits **outside the `**…**` span** its `depends_raw()` grammar reads. `0307` frames
  an **unruled** conflict between *"the superseded line stays byte-identical, corrected by a dated
  note beside it"* and *"the board must not print a wrong answer"*.
  **Where they differ:** `0307` asks *does a correction reach one derived cell*; this task asks *does a
  reader get warned a correction exists at all*. **Where they touch:** both are the dated-correction
  form meeting the brief/board structure, and **both are constrained by the same parser**. ⚠️ **Whoever
  runs second must read the other's ruling first** — an answer here that adds a device near
  `- **Depends on:**` could pre-decide `0307`, and `0307`'s Option A (teach the parser to read
  correction sub-bullets) could pre-decide the placement question here. ⛔ **Do not fold them either**;
  the owner has ruled on only one fold (`0311`), and this adjacency was **not** in front of them.
  - ⚠️ **DATED CORRECTION 2026-08-21 — THE FINAL CLAUSE OF THE BULLET ABOVE IS SUPERSEDED: THE `0307`
    ADJACENCY HAS SINCE BEEN PUT TO THE OWNER, AND RULED ON. The bullet above is left byte-identical,
    and the rest of it — including its ⛔ do-not-fold instruction — still stands.** Verified first-hand
    against both briefs on disk 2026-08-21. **The owner was shown this adjacency and ruled on
    SEQUENCING, not on folding**, live via `AskUserQuestion` in an `fkit lead` session driving
    `/fkit-sprint-ship-loop` — **verbatim option label: *"Sequence them, 0307 first (Recommended)"***.
    **`0307` is ruled to run FIRST**, because its parser ruling constrains where this task's warning
    device can go, and not the reverse. **NEITHER TASK IS FOLDED INTO THE OTHER.** **THIS IS A
    SEQUENCING PREFERENCE, NOT A DEPENDENCY** — no dependency or blocking declaration was added to or
    altered in either brief, and this brief's own declarations are unchanged. The bullet's standing
    instruction that *"whoever runs second must read the other's ruling first"* is unaffected; it now
    has a definite order. Recorded by a **spawned** `fkit-producer` with no owner channel, relaying the
    ruling above.
- **⚠️ Same-file neighbours in the same skill:**
  [`0313`](../0313-decide-the-append-only-proof-standard-for-untracked-task-folder-ledgers/brief.md)
  and [`0314`](../0314-fix-the-deletion-filter-blind-spot-in-fkit-record-decision/brief.md) both edit
  `claude/skills/fkit-record-decision/SKILL.md` — a different block (the append-proof block), but the
  same file. Coordinate ordering; do not clobber their work.
- **Provenance:** surfaced **independently by four workers** during the 2026-08-15/21 sprint-6
  `/fkit-sprint-ship-loop` run, each improvising a different substitute and each declaring the
  deviation. **Owner-ruled filed 2026-08-21**, live via `AskUserQuestion`, verbatim option label
  ***"File it as a task (Recommended)"***.
- **⚠️ Filed UNRANKED by a SPAWNED producer with no owner channel.** This row **appends** to the
  Backlog board, renumbers nothing, and was **deliberately NOT added to Sprint 6**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- **No merit statement.** The Backlog board is unranked, so there is no rank for a merit statement to
  be relative to, and `## Priority` reads `Unscheduled` with the board cell `—`. Flagged so its absence
  is not read as drift.
- No existing row was renumbered by this brief.
