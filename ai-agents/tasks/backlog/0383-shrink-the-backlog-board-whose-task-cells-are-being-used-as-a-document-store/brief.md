# Shrink the Backlog board, whose Task cells are being used as a document store — decide where the filing text belongs, then move it

## ID
0383

## Sprint
Backlog

## Priority
—

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

> ## ⏱ 2026-10-16 — SCOPE NARROWED BY OWNER RULING: shape (c) only — a length cap plus a guard on NEW rows; nothing deleted.
>
> The owner chose *"Narrow to stopgap (Recommended)"* on 2026-10-16. Full record and the narrowed
> scope: the last section of this brief, *"2026-10-16 — SCOPE NARROWED TO SHAPE (c)"*. ⛔ **Everything
> below is left as written and is read subject to that section** — where it says the shape is
> undecided, the shape is now decided.

> ## ⭐⭐ THE HOLD IS LIFTED — OWNER RULING, 2026-09-18 (LATE). THIS TASK IS `🔲 Backlog` AND STARTABLE.
>
> ⛔ **The `HELD 2026-09-18` section immediately below is left BYTE-IDENTICAL as the record of the
> hold. It is NO LONGER IN FORCE. Do not act on it.** ⭐ **Its own stated lift condition was met and the
> owner lifted it.** Full record: the last section of this brief, *"THE HOLD IS LIFTED"*, and
> [Sprint 11](../../../sprints/done/sprint-11.md) under *"OWNER RULING 2026-09-18 (FOURTH)"*.

### ⛔⛔ HELD 2026-09-18 — READ THIS BEFORE PICKING THE TASK UP

⛔ **This task is `🚧 Blocked`. Do not start it.** Set 2026-09-18 by a spawned `fkit-producer` with no
owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
relaying the owner's standing ruling of that morning. ⭐ **Nothing below this section was rewritten;
it is left byte-identical and is read subject to this hold.**

**The reason:** the fkit↔aiboard convergence effort
([Sprint 11](../../../sprints/done/sprint-11.md)) has an external expert session,
`fkit-external-expert`, **reading the architect's evaluation report right now**. ⛔ **That evaluation
may delete this board's shape entirely** — if fkit's markdown boards are replaced or re-shaped, the
Task-cell bloat this task exists to fix stops being a problem in the form described here, and any
reshaping done in the meantime is thrown away.

⚠️ **The hold is on SEQUENCING, not on merit.** The defect this brief documents — 89% of a 752 KB
board being Task-cell text — is **real and unchanged**. Nothing here is withdrawn.

**When it lifts:** when `fkit-external-expert` reports **and** the owner says what happens to the
markdown boards. ⛔ **`🚧 Blocked` is free for any session to set and unset**
([`task-status-vocabulary.md`](../../../knowledge-base/conventions/task-status-vocabulary.md)) — but
unset it on evidence that the conflict is gone, not on impatience.

⚠️ **Related, and it is the SAME conflict from the other end:** Sprint 11 is under an **owner-ruled
migration freeze** of 2026-09-18 — migration-shaped work (re-keying ids, moving folders, **rewriting
boards**) is frozen while the aiboard Node port continues. ⛔ **"Rewriting boards" is literally this
task**, which is why the hold and the freeze are the same decision seen twice.

### Authority

⭐ **FILED BY OWNER RULING, 2026-09-10** — given live via `AskUserQuestion` in a `fkit lead` session
and relayed to a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**Option label, verbatim: "Close out 0358's review ledger (Rec), File the board-bloat row"** — the
second half of that selection is this task.

⚠️ **The producer raised a work-creation objection when proposing this row** — filing a row about the
board being too full is itself a row on the board. ⛔ **The owner ruled it in anyway, and the objection
is therefore answered.** It is recorded here rather than dropped, because it is the strongest argument
against this task and the implementer should weigh it at the plan gate.

### How it surfaced

⛔ **The board became too large to render in a message.** That is the symptom that produced this row —
not a review finding, not a guard going red, and **not** a measurement anyone set out to take.

### ⚠️ EVERY FIGURE BELOW WAS RE-MEASURED BY THE FILING PRODUCER, 2026-09-10, AT HEAD `9943dcf`

⛔ **THE RELAYED FIGURE OF "51 ROWS" DID NOT REPRODUCE AND IS NOT CARRIED FORWARD.** The producer was
handed *"51 rows whose Task cell exceeds 5,000 characters"* and could not reproduce it under any of
three counting rules. ⭐ **The board is genuinely bloated — the defect is real. The count is smaller
than reported.** Stated here rather than left to be re-discovered, exactly as `0322`'s brief had to do
for its own relayed figures.

| What was counted | Measured 2026-09-10 |
|---|---|
| `ai-agents/sprints/backlog.md`, total size | **770,306 bytes = 752.3 KB** (at HEAD `9943dcf`, before the Sprint 8 pull; **770,607 bytes = 752.5 KB** after it) |
| Board rows in the `## Status` table | **210** |
| Of those, **open** (`🔲` / `🔄` / `🚧`) | **111** — cross-checked against `throughput.mjs`, which independently reports `open 111` |
| Rows whose Task cell exceeds **5,000 characters** | **46** |
| The same rows counted in **UTF-8 bytes** instead | **49** |
| The same rows counted **including the cell's two padding spaces** | **47** |
| Longest single Task cell | **17,187 characters** — the row for `0306` |
| Total Task-cell text across all 210 rows | **686,041 characters ≈ 89% of the whole file** |

⛔ **None of the three counting rules yields 51.** The method that produced each figure must be written
into whatever this task ships, so the next reader does not repeat this reconciliation.

### What the defect actually is

⭐ **A board row is a pointer plus a one-line description. These cells are documents.** A Task cell of
17,187 characters carries owner rulings with verbatim option labels, measured figures, dated correction
notes, exclusion lists and dependency prose — **all of which already exist in the brief the row links
to**. The cell is a second copy that drifts, and the drift is already on record: `0271`'s cell says
*"three"* behaviors while the task carries **five**, flagged inside the cell itself.

⚠️ **The bloat is not accidental and it is not anyone's mistake.** It is what the house discipline
produces: rulings are recorded verbatim, corrections are appended rather than overwriting, and figures
are carried with their provenance. ⛔ **Any fix that quietly deletes that content is worse than the
bloat**, and this task must not become one.

## What to build

⛔ **FRAME ONLY — THE ANSWER IS NOT DESIGNED HERE.** This brief states the problem, the measurement and
the constraints. **Which shape to take is the implementer's plan gate with the owner**, and a run that
arrives having already chosen has skipped it.

1. **Re-measure everything above at pickup.** ⛔ Do not trust a figure in this brief; the board grows
   weekly. Write down the counting rule used, in the artifact, beside each number.
2. **Put the shape to the owner.** Candidate shapes, none recommended here:
   > ⏱ **2026-10-16 — superseded by owner ruling: shape (c) was chosen.** The list below is kept as the
   > record of what was offered. See *"2026-10-16 — SCOPE NARROWED TO SHAPE (c)"* at the end.
   - **(a) Cells shrink to a pointer plus one line; the filing text moves into each brief** — into a
     dated `## Filing record` section, appended, never overwriting. Highest fidelity, most edits.
   - **(b) Cells shrink; the filing text moves to one companion document** under
     `ai-agents/sprints/` that the board links to per row. Fewer edits, one more file to keep honest.
   - **(c) A cell-length cap plus a guard**, applied to **new** rows only, with the existing 46
     grandfathered. Cheapest, stops the growth, fixes nothing already there.
   - **(d) Something else.**
3. **Whatever ships, these are hard:**
   - ⛔ **No content is deleted.** Every verbatim owner ruling, dated correction and measured figure
     survives somewhere a reader can reach from the row.
   - ⛔ **`dashboard.sh`'s parsed contract does not change.** The board is machine-read
     (`claude/skills/fkit-status/dashboard.sh`), and a reshape that breaks the parser has traded one
     defect for a worse one.
   - ⛔ **No row is re-ranked, reordered, renumbered or deleted**
     ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
     The Backlog board's `Priority` column stays `—` throughout — it is an **archive of known issues,
     not a ranked queue** (owner ruling 2026-08-29).
   - ⛔ **A `➡️ Moved` row's marker and its `— priority M` suffix survive intact.** The board's own
     rules, under its heading *"How work moves on and off this board"*, make that marker the only
     pointer to where a pulled task went.
   - ⛔ **No `ai-agents/wiki-vault/` write**
     ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
   - ⛔ **No `path:NNN` citation into a coordination document** — anchor by heading plus quoted
     fragment. `test/coordination-citation-policy.test.js` scans this board and this brief, and
     backticks hide nothing from it.
4. **If a guard is the answer, prove it red** — the repo's convention for proving a guard actually
   guards (`test/prove-red.sh`, ADR-026).

## Verification steps

1. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` renders, and its row
   count, status counts and every `Moved` target are **identical before and after** the change. ⛔ A
   single differing count is a failed run, not a rounding difference.
2. `node --test test/*.test.js` passes, `bash test/prove-red.sh` passes.
3. `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` — both
   green, and `namedExemptCount` is **unchanged** unless the change is explained in the worklog.
4. Re-run the size and cell-length measurement and record the before/after in `worklog.md`, with the
   counting rule stated.
5. `git diff --stat` touches only what the chosen shape requires. ⛔ Nothing under
   `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/` is edited (ADR-034 freezes closed folders).

## Notes

- **Owner: `fkit-producer`** — the Backlog board and task briefs are producer surfaces and this ships
  no source. ⚠️ **If the chosen shape includes a guard, the guard half is `fkit-coder`'s** and the task
  must be split at the plan gate rather than the producer editing `test/`.
- **Depends on nothing.** ⛔ **But it grows every week** — 210 rows today, and the largest cell is
  17,187 characters.
- ⚠️ **Sequencing hazard with `0322`.**
  [`0322`](../0322-escape-the-stray-pipes-in-the-board-rows-and-guard-against-new-ones/brief.md) edits
  4 defective rows on this same board (plus 1 each on two archived boards). ⛔ **Both tasks rewrite
  board rows; they must not run concurrently.** Neither is on Sprint 8.
- ⚠️ **Sequencing hazard with `0340`.**
  [`0340`](../../done/0340-backfill-a-sprint-status-onto-every-existing-sprint-plan-in-this-repo/brief.md) is
  `P6` on Sprint 8 and requires every plan under `ai-agents/sprints/done/` to end **byte-identical**.
  ⛔ **If this task's shape reaches an archived board, the two conflict.** Scope it to
  `ai-agents/sprints/backlog.md` unless the owner rules otherwise.
- **Unranked**, per the Backlog board's archive-not-queue rule (owner ruling 2026-08-29, verbatim
  option label *"Rank Sprint 7; declare backlog an archive (Rec)"*): ranking happens **at pull time
  onto a sprint board**, so the `Priority` column reads `—`. ⛔ **Nothing was re-ranked by this
  filing**, and the row was **appended last**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⚠️ **This brief was written by a spawned `fkit-producer` with no owner channel** (ADR-021). The
  ruling to file it is the owner's; every framing choice below that ruling is the producer's and is
  open to correction.

---

## ⏱ 2026-09-18, LATE — THE HOLD'S CONDITIONS ARE MET. THE MERIT IS ANSWERED. THE LIFT IS ESCALATED.

⛔⛔ **THE TASK IS STILL `🚧 Blocked`. DO NOT PICK IT UP ON THE STRENGTH OF THIS SECTION.** ⭐ **What
changed is that the reason for holding it has narrowed to one thing, and that one thing is with the
owner.**

⛔ **Nothing above this section was changed by this append**, including the `## Status` field and the
`HELD 2026-09-18` section. Additive, per the house dated-note pattern.

### ⭐ WHAT HAPPENED — the hold's own stated lift condition

The `HELD 2026-09-18` section above says the hold *"Lifts when the expert reports **and** the owner says
what happens to the markdown boards."*

| Half | State |
|---|---|
| *"the expert reports"* | ✅ **SATISFIED.** [`fkit-external-expert`'s verdict](../../../knowledge-base/reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md) is on record. |
| *"the owner says what happens to the markdown boards"* | ⭐ **ARGUABLY SATISFIED.** He ruled **B as the destination, A as the interim, B gated**: the markdown boards **stay the store for now**, and under a gate they may **later stop being it**. |

⛔ **"Arguably" is doing real work in that cell and is not hedging** — he answered *what happens to the
boards* at the level of the store, **not** at the level of this task's four candidate shapes.

### ⭐⭐ THE MERIT QUESTION IS ANSWERED: THIS WORK SURVIVES THE MIGRATION

⛔ **The question put to the producer was: under "B later", does `0383` survive the eventual migration,
or is it thrown away by it?** ⭐ **Answer: it SURVIVES — and it is a PRECONDITION of doing B well.** The
reasoning, recorded so it is not re-derived:

1. **The output is a PER-TASK file, and per-task files migrate.** The re-scoped shape the expert
   recommends (its heading *"4. The twelve questions"*, **Q4**) moves board-cell prose into per-task
   `board-notes.md`, *"verbatim, hashed, mechanical (1 live row per task, measured)"*. ⛔ **Under B, the
   task FOLDER is what moves**, and a per-task artifact moves with it — aiboard already keeps a brief, a
   worklog and a comments file per task, so a fourth per-task file is a shape it already has.
   ⭐ **A per-task file is exactly the thing B carries. A board CELL is exactly the thing B does not.**
2. **The generated-boards half is the part B replaces — and that is the direction B goes anyway.**
   Generating boards instead of hand-writing them is the same move B makes. Doing it now is **early**,
   not wasted.
3. ⭐⭐ **The decisive argument: B is a migration he will only want to do ONCE.** Today **89%** of the
   Backlog board's bytes are prose stuffed into table cells, and ⛔ **aiboard has NO FIELD for it.**
   Migrate first and that prose is either **lost** or it **forces aiboard to invent a field for fkit's
   habits** — which the never-withdrawn no-framework constraint forbids. ⛔ **Migrating the corpus as it
   stands means migrating the defect.**
4. **It is worth doing even if the gate FAILS and B never happens.** The board-as-document-store defect
   is measured, real, and grows weekly. ⭐ **So this work is not a bet on B** — which is precisely the
   property that makes it safe to do *before* the gate rather than after.

⚠️ **The counter-argument, recorded rather than buried:** if B lands, the boards become generated and
this task's board-rewriting half is thrown away. ⛔ **It does not change the answer**, because (a) the
extraction half — which is the expensive, irreversible, judgement-heavy half — survives intact, and (b)
under B the prose has nowhere to go **unless** the extraction ran first.

### ⚠️ WHAT IS STILL OPEN — and it is the only thing holding this row

⛔ **Whether to LIFT the hold is an OWNER act, and the producer did not take it.** Returned to
`fkit-lead` as a `NEEDS-DECISION` with a recommendation to lift. It is carried as open decision **D5**
on [Sprint 11](../../../sprints/done/sprint-11.md). **Three reasons it was not lifted here:**

- The hold was set relaying **the owner's own standing ruling** of 2026-09-18. ⛔ **An agent does not
  reverse an owner's hold with no owner channel** (ADR-021).
- ⛔ **It narrows the migration freeze's own literal words.** The freeze covers *"re-keying ids, moving
  folders, **rewriting boards**"* — and rewriting boards **is** this task. ⚠️ **Narrowing an owner
  ruling is not a producer judgement.**
- ⛔ **The SHAPE stays undecided either way.** `## What to build` above reserves the choice among (a),
  (b), (c) and (d) for *"the implementer's plan gate with the owner"*, and ⭐ **that is unchanged.** The
  expert recommends **(a)**, and the argument above strengthens (a) — ⛔ **but neither the expert nor
  this producer may pick it.**

⭐ **Cheapest-to-reverse was chosen deliberately:** holding this row one more exchange costs a day;
lifting it wrongly starts a 688 KB rewrite on an authority nobody granted.

### ⛔ WHAT DOES NOT CHANGE

- ⛔ **`## Status` stays `🚧 Blocked`, in BOTH carriers** — this brief and the
  [Backlog board](../../../sprints/backlog.md) row.
- ⛔ **Every hard constraint in `## What to build` stands**, unchanged: no content deleted,
  `dashboard.sh`'s parsed contract unchanged, no row re-ranked, reordered, renumbered or deleted
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  every `➡️ Moved` marker and its `— priority M` suffix intact, no `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **The sequencing hazard with `0322` is unchanged** — still must not run concurrently.
- ⛔ **Every figure in this brief is still re-measured at pickup.** ⚠️ **They are now ~8 days older**,
  and one of them is already in dispute: the ruling of 2026-09-18 quotes `aiboard-lead`'s *"83% prose
  stuffed into table cells"* where this brief measured **89%** on 2026-09-10. ⛔ **Unreconciled, and
  left flagged rather than smoothed.**

⛔ **Written by a spawned `fkit-producer` with no owner channel** (ADR-021), which answered the merit
question it was delegated and escalated the lift it was not. ⛔ **No commit was made by this append**,
and nothing was written to `ai-agents/wiki-vault/`.

## ⭐⭐ 2026-09-18, LATE — **THE HOLD IS LIFTED BY OWNER RULING. THE TASK IS `🔲 Backlog`.**

⛔ **Nothing above this section was changed by this append EXCEPT the `## Status` field** (which had to
change — it is one of the two carriers the lift acts on) **and a superseding banner placed above the
`HELD 2026-09-18` section.** ⭐ **Both of those sections' own bodies are left byte-identical.**

### The ruling

**Authority.** The owner, **2026-09-18**, via `AskUserQuestion` in a live `fkit lead` session, relayed
into a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
⭐ **He took the producer's recommendation (a): lift now, with the shape still his at the plan gate.**

### The carrier states — before and after

| Carrier | Before this act | After this act |
|---|---|---|
| **This brief's `## Status`** | `🚧 Blocked — held 2026-09-18 as conflicting work: the external expert reading the fkit↔aiboard evaluation may delete this board's shape entirely, so reshaping it now risks doing the work twice` | ⭐ **`🔲 Backlog`** |
| **The [Backlog board](../../../sprints/backlog.md) row's Status cell** | `🚧 Blocked — held 2026-09-18 as conflicting work: the external expert reading the fkit↔aiboard evaluation may delete this board's shape entirely` | ⭐ **`🔲 Backlog`** |

⭐ **`🔲 Backlog` is the PRE-HOLD value, verified against git at `HEAD` in both carriers** — it was not
chosen by the producer applying the lift. Both carriers are updated, per
[`task-status-vocabulary.md`](../../../knowledge-base/conventions/task-status-vocabulary.md).

### Why it lifts

1. ⭐ **Both stated lift conditions are satisfied.** *"the expert reports"* — he reported. *"the owner
   says what happens to the markdown boards"* — he ruled **B as the destination, A as the interim, B
   behind a gate that is now itself defined**.
2. ⭐ **The merit finding, which the owner accepted: this work SURVIVES B EITHER WAY.** The extraction's
   output is a **per-task file**; per-task files **migrate with the task folder**; a board **cell** is
   exactly what aiboard has **no field for**. ⛔ **Migrating today's corpus would migrate the defect.**

### ⚠️⚠️ THE TENSION, RECORDED RATHER THAN BURIED

⛔ **This lift NARROWS the Sprint 11 migration freeze's literal words.** The freeze covers *"re-keying
ids, moving folders, **rewriting boards**"* — and ⛔ **rewriting boards is literally this task.**

⭐⭐ **The owner ruled the lift KNOWING THAT.** ⛔ **So nobody may later read the freeze's word
*"boards"*, see this task running, and conclude it is running in violation of the freeze.** The freeze
otherwise **stands unchanged**; the narrowing covers this task and nothing else.

### ⛔ WHAT THIS LIFT DOES NOT CHANGE

- ⛔ **The SHAPE is still undecided and is still the OWNER's**, at the implementer's plan gate — (a),
  (b), (c) or (d). The expert recommends **(a)** and the merit argument strengthens it; ⛔ **neither the
  expert nor any producer may pick it.**
- ⛔ **Every hard constraint in `## What to build` stands, unchanged.**
- ⛔ **The `0322` sequencing hazard stands** — still must not run concurrently.
- ⛔ **Every figure in this brief is still re-measured at pickup**, and the **89%** (2026-09-10) vs
  **83%** (relayed 2026-09-18) discrepancy is still **unreconciled and left flagged.**
- ⛔ **The bullet under *"WHAT DOES NOT CHANGE"* above that reads *"`## Status` stays `🚧 Blocked`, in
  BOTH carriers"* is SUPERSEDED by this section.** It is left byte-identical and is called out here so
  the contradiction is not discovered as drift.

⛔ **Written by a spawned `fkit-producer` with no owner channel, recording a ruling relayed to it. No
commit was made by this append. Nothing was written to `ai-agents/wiki-vault/`
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
and nothing in `ai-agents/knowledge-base/decisions/` was read or written.**

---

## ⏱ 2026-10-16 — SCOPE NARROWED TO SHAPE (c), BY OWNER RULING

### The ruling

**Authority.** The owner, **2026-10-16**, via `AskUserQuestion` in a `fkit-lead` session, relayed to a
spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- Question: *"0383 (shrink board text): leave it for ADR-052, or narrow it to a cheap stopgap?"* —
  chosen option, verbatim label: **"Narrow to stopgap (Recommended)"**, described as *"Length cap +
  check on NEW rows only; deletes nothing. Stays on Backlog. Knock-on: none."*
- It came with his ruling on *"Which retro items should become fkit work?"* — verbatim label
  **"Recommended set (Recommended)"**, described as *"New briefs A (closer test bug), B (status reset
  bug), C (sprint goal); fold retro into 0500 and 0383. Knock-on: none."*

### Why the scope changed — what ADR-052 overtook, and what it did not

- ⭐ **Overtaken: this brief's 2026-09-18 merit argument** (section *"THE MERIT QUESTION IS ANSWERED:
  THIS WORK SURVIVES THE MIGRATION"*, point 3: *"aiboard has NO FIELD for it"*). ADR-052, accepted
  2026-09-30, gives the converter that job: *"each board row's text goes word-for-word into the task's
  `legacy-board-notes.md` with source board, line and hash"* (its conversion list, item *"Changes no
  meaning"*). So extracting row text by hand before migrating is no longer needed for the migration.
- ⛔ **Not overtaken: today's growth.** No ADR-052 phase has started (0 of its 55 briefs, `0417`–`0471`,
  closed on 2026-10-16), and fkit runs on markdown boards until phase 6. The board keeps growing until
  then — hence a stopgap that stops new growth and touches nothing old.

### The narrowed scope — shape (c)

1. **A length cap on the Task cell of NEW rows** on [the Backlog board](../../../sprints/backlog.md).
   The cap value and how "new" is told apart from "existing" (e.g. a dated or ID-based baseline) are
   the plan gate's to propose and the owner's to approve.
2. **A guard** (a `node --test` check) that fails when a new row's Task cell exceeds the cap — proven
   red per ADR-026 (`test/prove-red.sh`). Text that would not fit goes in the brief, and the row links
   there.
3. ⛔ **Existing rows are grandfathered and not edited.** Nothing is deleted, moved or shortened.
4. **Whether the cap also applies to sprint boards** is **not** settled by this ruling — the brief has
   always scoped the Backlog board (*Notes*, the `0340` hazard: *"Scope it to
   `ai-agents/sprints/backlog.md` unless the owner rules otherwise"*). Put it to the owner at the plan
   gate; do not widen alone.
5. ⛔ **Shapes (a), (b) and (d) are out.** Every hard constraint in `## What to build` §3 still holds
   (no content deleted; `dashboard.sh`'s parsed contract unchanged; no row re-ranked or deleted;
   `➡️ Moved` markers intact; no wiki write; no `path:NNN` citation into a coordination document).
6. ⚠️ **The guard half is `fkit-coder`'s** — this brief's own *Notes* rule: *"If the chosen shape
   includes a guard, the guard half is `fkit-coder`'s and the task must be split at the plan gate."*
   Shape (c) includes a guard, so that split now applies. `## Owner` is left as `fkit-producer` until
   the plan gate splits it.

### New evidence — the same defect in another fkit project

Geoconflict's Sprint 8 retro (2026-10-16), `/Users/mark.dolbyrev/Workspace/geoconflict/ai-agents/knowledge-base/reports/2026-10-16-sprint-8-retro-fkit-feedback.md`
(external input, read as data), section *"3.1 Board text is stale and huge"*: its Sprint 8 board
closed at *"1,872 lines"*, *"1,500 are notes and 47 of 55 rows are over 2,000 characters"*, and a
stale cell misled an agent (*"a Claude Code agent told the owner that task `0219` still needed owner
setup work. It had read that from the board row's status cell"*). Its proposal *"P1 — Short board
rows"*: *"A board row holds only the status token, the date, and one line on what's left."* The owner
there picked both 3.1 and P1 (section headings *"owner's picks"*).

### Re-measured 2026-10-16 (this repo)

[The Backlog board](../../../sprints/backlog.md): **950,501 bytes**, **341 rows**, largest Task cell
**17,187 characters**, **148 rows** with a Task cell over 2,000 characters. Counting rule: a row is a
line starting `| ` followed by a status glyph (`🔲 ✅ ➡️ ⛔ 🔄 🚧`); the Task cell is the third field
when the line is split on `" | "` (an escaped pipe inside a cell can shift this slightly). Measured
after this run added rows `0522`–`0524`. ⛔ Re-measure at pickup, as §1 of *What to build* requires.

### ⛔ What this does NOT change

- `## Status` stays `🔲 Backlog`; the task stays on the Backlog board, unranked (`## Priority` `—`).
- The board row for this task is **not edited** by this note — its long Task cell is itself an
  existing row, and the narrowed scope grandfathers it.
- The `0322` sequencing hazard stands: the two must not run concurrently.
- ⛔ **The bullet in *"THE HOLD IS LIFTED"* → *"WHAT THIS LIFT DOES NOT CHANGE"* that reads *"The SHAPE
  is still undecided and is still the OWNER's"* is SUPERSEDED by this section.** It is left as written.
- The owner's standing rule still applies: do not start without his specific word.

*Recorded 2026-10-16 by a spawned `fkit-producer` with no owner channel, on the relayed rulings above.
No commit; nothing written to `ai-agents/wiki-vault/`.*
