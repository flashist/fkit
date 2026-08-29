# Clean the coordination-citation residual set — the cleanup `0176` needs and nobody owns

## ID
0237

## Sprint
Sprint 7

## Priority
P6

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Filed on a named owner ruling** taken via `AskUserQuestion` in a live `fkit lead` session on
**2026-08-06** — verbatim: **"File the cleanup as its own task."**

### The hole this closes

[`0176`](../0176-build-the-coordination-citation-policy-guard/brief.md) builds
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

⚠️ **This task still hard-blocks [`0176`](../0176-build-the-coordination-citation-policy-guard/brief.md)
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
