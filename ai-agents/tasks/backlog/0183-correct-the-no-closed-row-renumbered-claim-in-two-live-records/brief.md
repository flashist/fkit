# Correct the "no closed row was renumbered" claim in two live records

## ID
0183

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

**This is follow-up 6 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§2.2, §6 and §8). Report §8 ranks it **soon — two live records assert a falsehood.**

### The falsehood, and where it lives

The sprint-2 board addendum written when task `0174` was filed, under the heading *"⚠️ One row was
inserted mid-board by owner ruling, and it renumbered the board"*, states:

> *"It takes the head of the earliest reachable open segment, and **no closed row was renumbered by the
> insertion**."*

`0174`'s own brief repeats it verbatim in its `## Notes`:

> *"**P119 is the highest rank in the band that is not behind a closed row** … and **no closed row was
> renumbered by the insertion**."*

**Both statements are false.** The insertion renumbered **eight closed rows** — `0151`, `0147`, `0150`,
`0157`, `0161`, `0148`, `0159`, `0160`, every one reading `✅ Done` at the time, each moved down exactly
one. Verified against the filing commit's own diff by the architect and **independently re-derived,
exactly, by the reviewer**. This is not a rounding error or a matter of interpretation.

**The reasoning that produced it is worth recording, because it will recur.** The producer checked the
**band the owner named** — the four ranks immediately above the insertion point — found them all closed,
and correctly concluded that placing the row *below* them renumbered none of **them**. That is true and
it is the wrong test: an insertion renumbers everything **below** it, and below it lay eight closed rows
scattered among the open ones. **The check was run in the wrong direction.**

### The second correction — a terminology collision

The word *"reachable"* appears in the addendum and in the measurement with **incompatible meanings**:

| Sense | Where | Means |
|---|---|---|
| Addendum's | *"the head of the earliest **reachable** open segment"* | the highest rank in the owner's band not itself occupied by a closed row |
| Measurement's | report §1.1, and report `0160` §6.2 | an open row is reachable **only** if it sits in the **final** segment — the append zone |

Under the measurement's sense — the one the entire finding is built on — the segment the addendum calls
*"the earliest reachable open segment"* **was not reachable at all**; it was segment 1 of 5. `0174` was
itself one of the 16 unreachable rows. **The task filed to fix unreachability sat in an unreachable
slot, described in its own filing note as reachable.**

**Only the measurement's sense is used going forward.** The addendum's usage is corrected, not kept as a
second definition.

### ⚠️ CORRECT THE RECORD — DO NOT REVERT

**Owner-ruled, and recorded in
[ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
under *Options considered*.** Reverting the insertion to restore the eight ranks **renumbers the same
eight closed rows a second time** — committing the breach again in the name of repairing it — and it
contradicts the `0157`/`0159` precedent that a stale rank reference is repaired by **naming the folder
ID**, not by restoring numbers.

## What to build

Two dated correction notes. **Documentation only. Nothing is re-ranked, reverted or deleted.**

1. **On the sprint-2 filing addendum** (`ai-agents/sprints/done/sprint-2.md`, the addendum under the heading
   *"⚠️ One row was inserted mid-board by owner ruling, and it renumbered the board"*): append a dated
   correction note that
   - names the claim being corrected, quoted;
   - states that **eight closed rows were renumbered**, and lists all eight by folder ID;
   - names the verification route (the filing commit's diff, confirmed by two independent parties);
   - names the wrong-direction reasoning that produced the error;
   - corrects *"reachable"* to the measurement's sense and states that the segment was **not** reachable
     under it;
   - states **correct the record, do not revert**, and points at ADR-035 for why.
2. **On `0174`'s brief** — now at
   `ai-agents/tasks/done/0174-decide-how-an-owner-records-a-merit-ordering-board-rank-cannot-carry/brief.md`,
   the task having closed on 2026-08-01 — the same correction note, appended to its `## Notes`.

**Follow the existing dated-correction precedent** already used in this repo's coordination documents
(the same shape task `0143` applies to ADR-010): a dated heading, the quoted claim, the correction, the
evidence, and no edit to the original sentence.

### Out of scope

- **⛔ Do not revert the insertion or restore any rank.** Owner-ruled; ADR-035 rejected it by name.
- **⛔ Do not edit the original false sentences.** Append a correction beside them. Deleting the claim
  destroys the evidence that the error was made and how.
- **⛔ Do not re-rank anything, and do not change any row's status cell.**
- **⛔ Do not edit ADR-035 or the report** — both already record the finding correctly.
- **⛔ Write no `:NNN` line-number citations.** Anchor by heading and quoted phrase; name tasks by
  folder ID.
- **⛔ Do not touch `ai-agents/wiki-vault/`.** If the falsehood has been ingested into the vault, that is
  `fkit-wiki`'s repair — name it, do not reach in.

## Verification steps

1. A dated correction note exists on the sprint-2 addendum and lists all eight folder IDs.
2. A dated correction note exists in `0174`'s brief `## Notes`, at its path under `tasks/done/`, and
   carries the same eight IDs and the same correction.
3. Both notes correct the *"reachable"* terminology to the measurement's sense, explicitly.
4. Both notes state **correct the record, do not revert**, and cite ADR-035.
5. The original false sentences are still present, unedited — `git diff` shows additions beside them,
   not replacements.
6. `git diff` shows **no `P<n>` cell changed** anywhere in `ai-agents/sprints/`.
7. `grep` for `\.md:[0-9]` over the changed files returns nothing.
8. Say in the close report whether the false claim appears to have reached `ai-agents/wiki-vault/`, and
   name it as `fkit-wiki`'s repair if so. **Do not assert whether vault pages actually rotted unless you
   looked**; say which you did.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **⚠️ Priority 161 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** immediately above `0132` — report §8 ranks it *"soon"* because **two live records assert
  a falsehood right now**, and every reader who reaches them between filing and repair is misinformed
  about a rule breach. Its append rank sits 25 open rows below its merit position.
- **⚠️ `0174` closed on 2026-08-01**, so its brief is under `tasks/done/`, not `tasks/backlog/`. Editing
  a closed task's brief is in scope here **only** for appending this correction note — it is not a
  licence to edit closed briefs generally, and the frozen-ledger rule (ADR-034) still bars editing any
  `done/*/review.md`.
- **Merit form used here** is the canonical `**On merit:**` shape from report §3.1 / ADR-035. Flagged so
  it is not read as drift.
- No existing row was renumbered by this brief.
