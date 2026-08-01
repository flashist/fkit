# Plan — task 0174

**Shape:** investigation + ruling. Report-only. No implementation, no briefs filed, no re-ranking.

## Steps

1. **Re-derive the board measurement live**, using report `0160` §6.2's stated method (rows matching a
   `P<n>` cell; status from field 1 of the pipe-split only; closed = starts with `✅ Done` /
   `⛔ Cancelled` / `➡️ Moved`). Print with its own as-of date. Do **not** inherit the brief's figures.
2. **Cross-validate the method** by replaying the identical script against the board revision the prior
   report read, and check it reproduces that report's figures cell for cell.
3. **Decompose the diff** between the two readings — specifically, whether any open row moved from
   unreachable to reachable, or whether the metric only moves by attrition and dilution.
4. **Confirm or refute the expired proof case** (`0161`) and name the live singleton set.
5. **Find a specimen whose merit case is stated and unrepresentable**, not merely a row that cannot
   move.
6. **Audit this task's own filing as a data point**, as the brief requires — including what the
   insertion actually did to closed rows, verified against the filing commit's diff rather than taken
   from the addendum.
7. **Rule every candidate in or out by name** (a survey without a ruling is a failed verification),
   plus any candidate the brief's list missed.
8. **Rule on `/fkit-task-brief` step 5's wall clause** — whether its consequence is acceptable.
9. **Answer enforcement** with a file plus a condition, or the literal words *"nothing can enforce
   this"*.
10. **Name the follow-ups without filing them.**
11. **Record the ruling as an ADR** where it narrows a standing rule.
12. **Self-verify** against the brief's eight verification steps, including the `.md`-plus-line-number
    grep over own output and the `git diff --stat` scope check.

## Constraints carried through

- ⛔ No implementation — no edit to `/fkit-task-brief`, `dashboard.sh`, any test, or any skill.
- ⛔ File no briefs.
- ⛔ Re-rank nothing; do not correct the board addendum or the brief (producer follow-up).
- ⛔ No `:NNN` line-number citations; anchor by heading and quoted phrase; cite tasks by folder ID.
- ⛔ Case 1 (board rank cited in prose) hard out of scope.
- ⛔ Never write `ai-agents/wiki-vault/`. No commits.

## Owner gates

Four questions were put to the owner and all four were signed on 2026-08-01 via `AskUserQuestion` in
the live `/fkit-sprint-ship-loop` driver session: the ruling itself, the closed-row breach remedy
(correct the record, do not revert), whether to write an ADR (yes), and sprint rollover (noted as a
follow-up, decided later — **not** ruled).
