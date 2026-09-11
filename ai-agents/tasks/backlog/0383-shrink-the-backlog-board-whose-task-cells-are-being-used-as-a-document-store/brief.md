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
