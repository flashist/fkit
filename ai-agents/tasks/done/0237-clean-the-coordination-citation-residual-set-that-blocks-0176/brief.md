# Clean the coordination-citation residual set — the cleanup `0176` needs and nobody owns

## ID
0237

## Sprint
Sprint 7

## Priority
P6

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> # ⛔ READ FIRST — THE WORK LIST IS NO LONGER THIS BRIEF'S (2026-08-30)
>
> ⛔ **THE `19 / 15` FIGURE BELOW AND THE SETTLED `19 / 14` FIGURE ARE NOT THE SAME SET. THE MATCHING
> INSTANCE COUNT IS A COINCIDENCE — DO NOT READ IT AS CONFIRMATION.** The file counts differ (**15**
> versus **14**), which is the visible edge of two different conditions landing on the same total.
> ⛔ **Treat the match as suggestive at most, and never as evidence that this brief's list was right.**
>
> ⭐ **This task's work list is now the 19-instance table in §6.1 of
> [`2026-08-29-the-reference-integrity-condition.md`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md)** —
> `0353`'s deliverable — **not** `0176`'s frozen `11 across 8`, **not** the `12 across 9` that document
> itself reported on 2026-08-29, and **not** this brief's `19 across 15`. **Those 19 rows are the
> authority.**
>
> ⭐ **The job's shape changed materially: the whole list is OPEN briefs plus the live backlog board.
> ⛔ NO CLOSED RECORD NEEDS EDITING.** Re-measured 2026-08-30: **zero** of the 19 citing sites sit
> under `ai-agents/tasks/done/` or `cancelled/`. That is the direct consequence of the owner's
> 2026-08-29 widening of the exemption.
>
> **All original text is left byte-identical.** Falsified passages carry a `⚠️ DATED CORRECTION
> 2026-08-30` block at the end of their own section; the corrected work list is in
> §**"⭐ RE-SCOPED 2026-08-30 — THE WORK LIST"** at the foot of this brief. ⛔ **Read it before starting.**

**Filed on a named owner ruling** taken via `AskUserQuestion` in a live `fkit lead` session on
**2026-08-06** — verbatim: **"File the cleanup as its own task."**

### The hole this closes

[`0176`](../../backlog/0176-build-the-coordination-citation-policy-guard/brief.md) builds
`test/coordination-citation-policy.test.js`, the guard against `path:NNN` citations of coordination
documents. Its own brief states three things that, together, make it unshippable:

- the guard **is red today**;
- **"shipping it red is not an option"** — the residual set must be clean before it goes green;
- **"the cleanup is not owned by any task today"**, flagged for the owner as either a prerequisite task
  or in-scope work.

The owner has now ruled: **its own task.** That is this one. Until it lands, `0176` renders `ready` on
the Backlog board while being impossible to complete — a board telling the reader something false.

### The figure — re-measured 2026-08-06, and it does not reproduce

`0176`'s brief records **11 citations across 8 files**, itself a re-measurement taken 2026-08-01 that
reproduced the source report exactly. **Re-measured at filing on 2026-08-06 it does not reproduce**,
and the honest reading is that **the conditions differ**, not that one of them is wrong:

| Measure | `0176` brief (📅 2026-08-01) | **Re-measured at filing (📅 2026-08-06)** |
|---|---|---|
| Literal citations, total, over the scanned set | 38 | **74** |
| Files, total | 19 | **39** |
| Exempt — inside closed `done/*/review.md` | 27 across 11 files | **55 across 24 files** |
| **Residual red set** | **11 across 8 files** | **19 across 15 files** |

**Both readings are suspect and the implementer must settle it, not inherit it.** Known reasons the two
can differ:

- **The filing measurement's condition is broader than `0176`'s** — it counted `worklog.md` and
  `plan.md` as citable targets and accepted the citation both with and without the `ai-agents/` prefix.
  `0176`'s exact condition is not written down as a regex anywhere.
- **`0176`'s scoping decision 2 — skip fenced blocks and blockquote lines — was not applied** in the
  filing measurement. `0176` records that this convention *"changes the count by zero"*; that claim is
  five days old and unverified against today's tree.
- **Five days of new briefs landed** between the two measurements, several of them about citations.
- **⚠️ The archival moved the scanned set out from under `0176`.** `0176`'s scanned set is
  `ai-agents/tasks/*/*/*.md` **+ `ai-agents/sprints/*.md`**. The Sprint 2 board is now at
  `ai-agents/sprints/done/sprint-2.md` — **outside that glob.** `0176`'s own residual list names
  `ai-agents/sprints/sprint-2.md` as one of its 8 files, and that file no longer exists at that path.
  **This is the same defect class the rollover already flagged against `0182`'s glob**, and it is
  flagged here so it is not re-discovered a third time.

> ## ⚠️ DATED CORRECTION 2026-08-30 — THE FIGURE TABLE ABOVE IS SUPERSEDED. ⛔ DO NOT WORK FROM IT.
>
> **All text above is left byte-identical as the record of what was measured on 2026-08-06.** The
> condition it was measured under has since been settled by `0353` and changed twice by the owner.
>
> ### ⛔ The `19 across 15` / `19 across 14` collision — say this out loud before anything else
>
> This brief's re-measurement of 2026-08-06 produced **19 across 15**. The settled condition produces
> **19 across 14**. ⛔ **They are DIFFERENT SETS that happen to share a total.** The 2026-08-06 figure
> came from a broader, undocumented condition (it accepted the citation with **and** without the
> `ai-agents/` prefix, and did not apply `0176` scoping decision 2); the settled figure comes from
> §4.2's byte-exact matcher under two later owner rulings. ⛔ **A reader who takes the matching 19 as
> "the old measurement reproduced" will work from the wrong 19 rows.** The differing file counts —
> 15 versus 14 — are the only visible signal, and this block is here so nobody has to spot it.
>
> ### Two owner rulings moved this half, in opposite directions
>
> **⏩ 2026-08-29, live `AskUserQuestion`, option label verbatim "Widen to the whole closed folder
> (Rec)".** The citation half's exemption is no longer `done/*/review.md` only: **`ai-agents/tasks/done/**`
> and `ai-agents/tasks/cancelled/**` are exempt IN WHOLE** — `brief.md`, `plan.md`, `worklog.md`,
> `review.md` alike. ⛔ **The 2026-08-01 sentence *"`done/*/brief.md` and `done/*/worklog.md` are NOT
> exempt"* NO LONGER HOLDS.** Measured effect: residual **42 across 22 → 12 across 9**. ⭐ **This is
> what removed every closed record from this task's work list.**
>
> **⏩ 2026-08-30, live `AskUserQuestion`, option label verbatim "Not a reopening — widen it (Rec)".**
> The *cited-target* class widened from `brief.md` alone to **`brief.md` · `plan.md` · `worklog.md` ·
> `review.md`**. Measured effect: residual **12 across 9 → 19 across 14**, and ⭐ **all 7 additions sit
> in open backlog briefs — none in a frozen record.** ⚠️ **Neither ruling reopens owner ruling 1 of
> 2026-08-01** (the **literal** full-path reading); that stands, and the resolved-shorthand extension
> is **still refused, by name**.
>
> ### The settled figures, re-measured 2026-08-30
>
> | | Settled |
> |---|---|
> | Scanned | **708 files** (`ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md` — `0176` decision 1, **unchanged**) |
> | Total citations | **182 across 79 files** |
> | Exempt | **163 across 65 files** |
> | ⭐ **Residual — this task's work list** | ⭐ **19 across 14 files** |
>
> **Alternate readings, for the record** ⚠️ *(not guaranteed reproducible — the scanned set contains
> this project's own live coordination documents, so it measures differently as they are written)*:
> the 2026-08-01 exemption shape gives **68 across 37**; no fence/quote skipping gives **26 across
> 15**; widening the scanned set to `sprints/done/` + `sprints/reviews/` gives **25 across 16**.
>
> ⛔ **And the one that must never be adopted by accident: skipping inline code spans collapses the
> total from 182 to 6 and the residual from 19 to 1 — a 30× lever that would gut the guard.** For
> **this** half backticks are **NOT** skipped: they are the house form for *writing* a coordinate here
> ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)), so
> they are formatting, not quoting. ⚠️ **The link half rules the OPPOSITE way**, deliberately — see
> the condition document §1.
>
> ### 📅 Provenance
>
> **Re-measured 2026-08-30 by a spawned `fkit-producer`**, by extracting §4.2's script **verbatim**
> from the condition document into a session scratchpad (never into the repo) and running it from the
> repo root against the working tree of that date. Reproduced exactly:
> `SCANNED: 708 / TOTAL: 182 across 79 / EXEMPT: 163 across 65 / RESIDUAL: 19 across 14`.
>
> ⚠️ **THESE FIGURES ARE AS-OF 2026-08-30 AND THEY DECAY.** The condition document was **still under
> review (round 2) when they were taken** and may change. ⛔ **Re-measure at this task's own plan gate
> by re-running §4.2's script, and work from the rows you get.**

## What to build

The residual set clean, so `0176` can ship green.

### Steps

1. **Settle the condition first, in writing.** Produce the exact scanned set and the exact match rule
   the cleanup is working to, applying `0176`'s four scoping decisions — the defensible-core scanned
   set, the skip-fenced-blocks-and-blockquotes convention, literal reading, closed-ledger exemption.
   **Record it as a runnable command, not as prose.** `0176` will assert the same condition; if the two
   diverge, the guard ships red and this task's work was wasted.
2. **Re-measure with that condition** and report the residual set against **both** figures above. State
   which of the listed causes explain the difference and which do not.
3. **Decide the scanned-set glob question and say so.** Does the condition cover
   `ai-agents/sprints/done/*.md` and `ai-agents/sprints/reviews/*.md`, or only the top-level glob? Two
   defensible answers; **the wrong outcome is not choosing.** Whatever is chosen, `0176`'s brief must be
   told, so this task's close report names the decision explicitly for the next reader.
4. **Clean the residual citations** — convert each to the durable form the `0160` ruling and `0171`'s
   convention page prescribe. **Change the citation, not the sentence around it.**

### Constraints

- **⛔ Do not clean the exempt citations inside `done/*/review.md`.** The owner ruled those frozen ledgers
  will never be cleaned; editing them collides with ADR-034. This is `0176`'s scoping decision, inherited
  verbatim.
- **⛔ Do not write `ai-agents/wiki-vault/`.** Any citation cleanup inside the vault is `fkit-wiki`'s
  exclusively (ADR-005). Report what you find there; do not touch it.
- **⛔ Do not build the guard.** That is `0176`. This task ships a clean tree, not a test file.
- **⛔ Do not implement the shorthand extension.** `0176` records it as a separately-filed decision;
  do not fold it in, flag it, or put it behind an option.
- **⛔ No `:NNN` line-number citations in this task's own artifacts.**
- **⛔ Do not move any task file.** The movers are producer-only (ADR-033).

> ## ⚠️ DATED CORRECTION 2026-08-30 — STEPS 1–3 ARE DISCHARGED AND CONSTRAINT 1 IS TOO NARROW.
>
> **All text above is left byte-identical.** Steps and constraints are corrected here, not rewritten
> above.
>
> - **Step 1 (*"Settle the condition first, in writing"*) and step 3 (*"Decide the scanned-set glob
>   question"*) are DISCHARGED by `0353`.** ⛔ **Do not re-derive them.** Run them as a
>   **reconciliation**: name the condition document by filename, confirm §4.2 matches, and report any
>   divergence. ⛔ **If you and the document disagree, STOP and surface it — do not pick one.**
>   ⭐ **Step 3's answer, for the record:** `ai-agents/sprints/done/**` and `ai-agents/sprints/reviews/**`
>   are **OUT** for this half — a closed board's claims are frozen. Measured cost of including them:
>   **+4 residual** and **0** respectively. **Name that decision in the close report**, as step 3 asks.
> - **Step 2's target figures are superseded.** Report against the settled **19 across 14**, not the
>   `11 / 8` or `19 / 15` pair. See the §Context correction for why the matching 19 is a coincidence.
> - ⛔ **Constraint 1 is NOW TOO NARROW and following it literally would corrupt a frozen record.** It
>   reads *"Do not clean the exempt citations inside `done/*/review.md`"*. **The exemption is now the
>   WHOLE closed folder** — `ai-agents/tasks/done/**` **and** `ai-agents/tasks/cancelled/**`, every file
>   type, on the owner's 2026-08-29 ruling. ⛔ **Edit nothing under either.** ⭐ In practice this costs
>   nothing: **re-measured 2026-08-30, zero of the 19 citing sites are in a closed folder.**
> - ⭐ **A distinction worth drawing before someone stalls on it: five of the 19 residual citations
>   CITE `ai-agents/wiki-vault/log.md`. Repairing them is NOT a vault write.** The edit lands in the
>   **citing** open brief; `ai-agents/wiki-vault/` itself stays untouched, as constraint 2 requires.
> - **All other constraints stand**, including the refusal to fold in the resolved-shorthand extension.

## Verification steps

1. The condition from step 1 exists as a runnable command in the worklog, and re-running it after the
   cleanup returns **zero** residual hits.
2. The measurement from step 2 is reported against both the `11 / 8` and the `19 / 15` figures, with
   the divergence explained.
3. Step 3's glob decision is stated by name in the close report.
4. **The 55-ish exempt citations inside `done/*/review.md` are untouched** — `git diff --stat` shows no
   file matching `ai-agents/tasks/done/*/review.md` modified.
5. **Zero files under `ai-agents/wiki-vault/` modified.**
6. Each edited citation still points at the thing it pointed at — spot-check every one; a cleanup that
   silently re-targets a citation is worse than the citation.
7. `npm test` passes.
8. Run the dashboard over all four live boards; report roll-ups and drift before and after. **No board
   gains a drift record.**

> ## ⚠️ DATED CORRECTION 2026-08-30 — VERIFICATION STEPS 2 AND 4 ARE FALSIFIED. ⛔ DO NOT RUN THEM AS WRITTEN.
>
> **All text above is left byte-identical.** Steps 1, 3, 5, 6, 7 and 8 stand exactly as written —
> step 8 in particular stands **harder**, because `ai-agents/sprints/backlog.md` is on the work list
> and is a machine-parsed file.
>
> - **Step 2′.** Report the re-measurement against the settled **19 across 14**, and explain the
>   `19 / 15` collision explicitly (see the §Context correction). ⛔ **Do not report "the 2026-08-06
>   figure reproduced."** It did not; a different condition landed on the same total.
> - **Step 4′.** The step asserts *"the 55-ish exempt citations inside `done/*/review.md` are
>   untouched — `git diff --stat` shows no file matching `ai-agents/tasks/done/*/review.md`
>   modified."* ⛔ **Both the figure and the glob are wrong.** The exemption is now the **whole** closed
>   folder and the exempt set is **163 citations across 65 files** (re-measured 2026-08-30). **Assert
>   instead:** `git diff --stat` shows **zero** files modified under `ai-agents/tasks/done/` **or**
>   `ai-agents/tasks/cancelled/` — any file type, not just `review.md`.
> - ⭐ **Add a step 9.** `ai-agents/sprints/backlog.md` carries **3** of the 19 residual citations and
>   is read by `dashboard.sh` and by both task movers. ⛔ **Treat every edit there as touching a parser
>   contract**, and re-run the dashboard after the pass, not only at the end.

## Notes

- **Depends on:** `0353` — hard (`0353-settle-the-reference-integrity-condition-once-for-both-halves`). ⚠️ **Corrected in place 2026-08-29**; this line previously read `- **Depends on:** nothing.`, true from 2026-08-06 until `0353` was filed. ⛔ It is a machine-parsed field (`dashboard.sh` derives the board Next-step from it), so a stale value renders a false `ready` — it is corrected here rather than annotated, and the record of the change lives in §"⭐ PULLED ONTO SPRINT 7 AS `P6`".
- **Blocks:** `0176` — hard. `0176` cannot ship green until this lands. `0176`'s brief and its Backlog
  board row have been updated to declare `Depends on: 0237`, so the board stops advertising `0176` as
  pullable.
- **Related, not blocking:** `0236` (the stale `sprint-2.md` prose-path sweep) overlaps on the 16
  hits that are both stale *and* in the banned form. **Deliberately separate tasks**: a path can be
  stale-and-legal or fresh-and-banned independently. Whichever lands first says what it left for the
  other. Also `0193` (repairing stale citations in `0158`'s closed brief) and `0171` (the durable
  citation anchors convention page) — `0171` writes the target form this cleanup converts *to*, so if
  `0171` has not landed, **name the form you used and why**.
- **📌 DATED NOTE 2026-08-15 (`0306`) — the `ai-agents/sprints/sprint-2.md` string at §"What to
  build" is DELIBERATELY LEFT DEAD.** `0306` swept dead board paths out of the open briefs and left
  this one byte-identical. **The sentence is *about* that string being dead** — *"`0176`'s own
  residual list names `ai-agents/sprints/sprint-2.md` as one of its 8 files, and that file no longer
  exists at that path"* — so re-pointing it would make the sentence contradict itself.
  **Where the board actually is today: `ai-agents/sprints/done/sprint-2.md`.**
- **⚠️ This brief decays.** Every figure was measured on **2026-08-06** on a tree with concurrent
  untracked work. **The inventory is evidence the set is real, not a checklist to execute.**
- **Priority is `—` (unscheduled).** Filed to the Backlog board on the owner's ruling; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).

### ⭐ PULLED ONTO SPRINT 7 AS `P6` — OWNER RULING 2026-08-29

**Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session. The option
label is the verbatim text: "Approve all 12 as proposed (Rec)"** — the full twelve-row Sprint 7
board, on which this task is **`P6`**. Ranking authority is the same day's companion ruling,
**"Rank Sprint 7; declare backlog an archive (Rec)"**.

**The three mandatory edits of a pull, all applied in this act** (`/fkit-task-brief` step 8 / the
Backlog board's **Off:** rule):

1. The row was added to [`sprint-7.md`](../../../sprints/sprint-7.md) with the rank token `P6`.
2. The [`backlog.md`](../../../sprints/backlog.md) row was flipped to
   `➡️ Moved to [Sprint 7](sprint-7.md) — priority P6`. ⛔ **Not deleted** — a deleted row loses the
   pointer to where the work went.
3. This brief's **`## Sprint` is now `Sprint 7`** and **`## Priority` is now `P6`**.
   **`## Status` is unchanged at `🔲 Backlog`** — the task has not started.

⚠️ **The `## Notes` bullet below reading *"Priority is `—` (unscheduled). Filed to the Backlog board
on the owner's ruling; no sprint was named…"* is SUPERSEDED by this section.** It was true from
2026-08-06 until 2026-08-29 and is left byte-identical as the record of the filing decision. ⛔ Read
this section, not that bullet, for the current state.

⭐ **WHAT CHANGED ABOUT THIS TASK'S SHAPE, and it is the reason it was pullable at all.** This brief's
step 1 (*"Settle the condition first, in writing"*) and step 3 (*"Decide the scanned-set glob question
and say so"*) have been **lifted out into their own row**:
[`0353`](../0353-settle-the-reference-integrity-condition-once-for-both-halves/brief.md) (`P3`), which
settles the condition **once**, for both the `path:NNN` half and the markdown-link half, and
discharges this brief's open scanned-set question.

- ⭐ **`0353` is therefore a HARD dependency of this task**, and it is recorded as one in `## Notes`.
- ⛔ **Steps 1 and 3 are NOT deleted from this brief.** Run them as a **reconciliation** against
  `0353`'s document — confirm the condition, name it by filename, and report any divergence — rather
  than re-deriving it. ⛔ **If this task and `0353` disagree about the condition, stop and surface it;
  do not pick one.**
- **Everything else in this brief is unchanged** — `## What to build` steps 2 and 4, all five
  constraints, all eight verification steps, and the `0306` dead-path note.

⚠️ **This task still hard-blocks [`0176`](../../backlog/0176-build-the-coordination-citation-policy-guard/brief.md)
(`P7`), and both now gate Sprint 7's three sweeps** (`0356`, `0357`, `0358`). ⛔ **`0176`'s guard must
be green before any sweep starts** — the owner-agreed *"verified, not trusted"* constraint. This row
is on the critical path for five other rows; see [`sprint-7.md`](../../../sprints/sprint-7.md)
§"⛔ THE FORCED SEQUENCING".

⚠️ **The parsed `Depends on:` field in `## Notes` was CORRECTED IN PLACE, not annotated.** It read
`- **Depends on:** nothing.` — true from 2026-08-06 until `0353` was filed on 2026-08-29. ⛔ **It is a
machine-parsed field**, not prose: `dashboard.sh` derives this task's board Next-step from it, and a
stale value renders the row a false `ready`
([`dependency-declaration-form`](../../../knowledge-base/conventions/dependency-declaration-form.md)).
**The old text is preserved in this section and in the corrected line's own inline note** — that is
where the record lives, because the field itself has to be true.

*Recorded 2026-08-29 by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of a relayed ruling and deciding nothing beyond them.*

---

## ⭐ RE-SCOPED 2026-08-30 — THE WORK LIST

**Authority:** owner ruling **2026-08-29**, live `AskUserQuestion`, option label verbatim
**"Accept — links in scope, citations exempt (Rec)"**, whose stated cost was that it *"contradicts
three briefs"*; and its two sharpening rulings, **"Widen to the whole closed folder (Rec)"**
(2026-08-29) and **"Not a reopening — widen it (Rec)"** (2026-08-30). All three are recorded in full
in §3.1, §3.2 and §8 (escalation **E2**) of
[`2026-08-29-the-reference-integrity-condition.md`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md),
which states these re-scopings *"are the producer's to make, not the architect's."*

**This section governs where it disagrees with anything above it.**

### 1. ⛔ Where the work list lives — and why it is NOT copied here

⭐ **The work list is the 19-row table in §6.1 of the condition document.** ⛔ **It is deliberately
not duplicated into this brief, for two reasons, both binding:**

1. **This brief forbids `:NNN` line-number citations in its own artifacts.** The document renders each
   coordinate across **two columns** — citing file, then line — precisely so a document defining the
   ban does not ship carrying the form. Copying the rows in as prose would break this task's own rule.
2. **One place to keep true.** The figures decay; a copy would rot silently.

⛔ **Read §6.1, and re-run §4.2's script from the repo root before touching anything.** Work from the
rows the script prints on the day you run it.

### 2. The shape of the job, so it is visible before it starts

**Re-measured 2026-08-30** (provenance in the §Context correction):

| | |
|---|---|
| Residual (the work list) | **19 instances across 14 files** |
| Citing sites | **13 open backlog briefs + `ai-agents/sprints/backlog.md`** |
| ⭐ Citing sites in a **closed** folder | ⭐ **ZERO** |

**By what each citation points AT:**

| Count | Cited coordination document |
|---|---|
| 9 | a file under `ai-agents/tasks/done/**` |
| 5 | `ai-agents/wiki-vault/log.md` |
| 3 | `ai-agents/sprints/backlog.md` |
| 2 | a file under `ai-agents/tasks/backlog/**` |

**By cited filename** — `review.md` **5**, `log.md` **5**, `brief.md` **4**, `backlog.md` **3**,
`plan.md` **1**, `worklog.md` **1**. ⭐ **The 7 non-`brief.md` task-folder citations (5 + 1 + 1) are
exactly the additions from the 2026-08-30 target-class widening**, and all 7 sit in open briefs.

⚠️ **A citation pointing INTO a closed folder is still repairable — the exemption is about the CITING
site, not the cited one.** Nine of the 19 cite a file under `done/`; the edit lands in the open brief
that wrote the coordinate. Same for the five that cite `ai-agents/wiki-vault/log.md`: repairing them
is **not** a vault write.

### 3. ⚠️ Two rows carry an elided coordinate — treat them as citations, not as paths

Half B has **no elision rule**, so an elided coordinate like a `…`-abbreviated folder segment **counts
as a hit**. Two of the 19 are this shape: one citing a `done/` worklog, one citing a `backlog/` brief.
⛔ **They are genuine citation *claims* against a record and belong in this list** — that is the ruled
reading (condition document §7 item 10, measured cost 1, arguably 2). ⚠️ **The link half skips elided
targets; this half does not.** The divergence is deliberate. ⛔ **Do not "resolve" the elision into a
real path — repair the citation to the durable named form**, which is the whole point of the task.

### 4. What must be disclosed alongside the pass

⛔ **A green guard here is not a complete guard, and the close report must say so.** Both accepted
incompletenesses are named and must not be silently widened:

- **The resolved-shorthand extension is still refused, by name** (owner ruling 1, 2026-08-01, **not
  reopened**). A bare board name or a bare `NNNN/brief` followed by a line number is **not** matched.
  ⛔ **Say so alongside the pass. Being a gate on three other Sprint 7 rows does not make it complete.**
- **Source-file coordinates are caught by neither guard, and the cost is two orders of magnitude
  larger than previously stated.** Coordinates like `claude/…` or `test/…` plus a line number, written
  **inside** the scanned set, are invisible because the *target* prong admits only a coordination
  document. **Measured 2026-08-30: 250 instances across 46 files** (a second regex for the same
  question measured 216 across 42 — both refute the "three" this was once thought to be). ⚠️ **That
  counts coordinates, not verified *stale* coordinates.** ⛔ **The refusal to widen is unchanged and is
  not reopened — but the figure must be stated, not implied to be three.**

### 5. Unchanged, and still binding

- **`Depends on: 0353` — hard.** Its condition document is the input. Unchanged.
- **`Blocks: 0176` — hard**, and both gate Sprint 7's three sweeps (`0356`, `0357`, `0358`).
  ⚠️ **This row is now the expensive half of that gate.** The link guard (`0354`) is green on arrival;
  ⭐ **the sequencing gate rests almost entirely on `0176`, which rests on this task.**
- **The `📌 DATED NOTE 2026-08-15 (`0306`)` dead-path note stands** — that string stays byte-identical.
- **⛔ No status, rank, board membership, dependency field or file location was changed by this act.**

### 📅 Provenance and decay

**Re-measured 2026-08-30 by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
by extracting §4.2's script verbatim from the condition document into a session scratchpad (never into
the repo) and running it from the repo root against the working tree of that date.** Reproduced
exactly: `SCANNED: 708 / TOTAL: 182 across 79 / EXEMPT: 163 across 65 / RESIDUAL: 19 across 14`. The
per-target breakdowns in §2 above were derived from that same run.

⚠️ **THESE FIGURES ARE AS-OF 2026-08-30 AND THEY DECAY. The condition document was still under review
(round 2) when they were taken and may change.** Worse, this repo's own live coordination documents
are **inside the scanned set**, so the tree measures differently as they are written — the document
caught this happening to itself. ⛔ **Re-measure at this task's own plan gate. Work from what you
measure, not from what is written here.**

*Recorded 2026-08-30 by a spawned `fkit-producer` executing escalation **E2** of the condition
document under the owner's 2026-08-29 ruling. Every edit is an append; all prior text is
byte-identical.*
