# Build `test/closed-rank-immutability.test.js` — no closed row's rank ever changes

## ID
0182

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**This is follow-up 5 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§5.3 and §8). Report §8 ranks it **LOW**.

**Why it exists.** Report §2 found a breach of an absolute rule that **no existing check caught**, and
that **both written records of the act claimed had not happened**. Task `0174`'s mid-board insertion
renumbered eight closed rows — `0151`, `0147`, `0150`, `0157`, `0161`, `0148`, `0159`, `0160` — and the
board addendum and the brief both asserted *"no closed row was renumbered by the insertion."* The
producer's own check ran in the wrong direction. **A rule this easy to breach while believing you have
not is a rule worth a mechanical guard.**

**The condition.** Across a commit range, for every `ai-agents/sprints/sprint-*.md`: no board row whose
status in the **earlier** revision starts with `✅ Done`, `⛔ Cancelled` or `➡️ Moved` appears with a
different `P<n>` rank in the **later** revision.

**⚠️ Rows are matched by FOLDER ID, never by rank.** Rank is the mutable coordinate this whole task
family is about; matching rows by rank would make the guard's own key the thing it is testing. The
folder-name `NNNN` prefix is identity and nothing else is
([`conventions/priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).

### ⚠️ Its ceiling — four limits, stated here rather than discovered later

1. **It is a diff check, not a state check.** No property of a single board file reveals that a closed
   row was renumbered. The invariant lives **between two revisions**.
2. **It therefore needs git history**, unlike every other test under `test/`. That is a new kind of
   dependency for this suite and a real cost: **it cannot run against a bare working tree or a
   single-commit / shallow clone.**
3. **It asserts a transition, not a state.** It cannot tell you the current board is correct — only that
   a particular change did not break the rule.
4. **It would be red on the commit that filed task `0174`.** The report confirmed this by replaying the
   condition across that commit: all eight rows flag. **That is the test working correctly, and it is
   the argument for building it** — but it means the task cannot land without a baseline decision.

### 🚧 The blocking decision — the baseline

**Report §9 open question 2. Not yet made.** Either:

- **Exempt history before a named commit** — the guard enforces forward only, and the named commit is
  recorded in the test so nobody later reads the exemption as an accident; or
- **Accept a permanently red run** on that range.

**Not choosing means the guard cannot land.**

## What to build

`test/closed-rank-immutability.test.js` — a hand-rolled `node --test` file picked up by `npm test`'s
existing `node --test test/*.test.js` glob. **No new devDependency** (ADR-014).

1. Resolve the commit range to compare. State how the range is chosen, and make it work in CI and
   locally, or state plainly which it does not work in.
2. For each `ai-agents/sprints/sprint-*.md` in both revisions, parse rows into `(folder ID, status,
   rank)` triples. **Status is field 1 of the pipe-split; closed means the cell *starts with* one of the
   three closed markers** — the same reading report §1.1 used, so results are comparable.
3. Join earlier-to-later **on folder ID**. For every row closed in the earlier revision, assert its
   `P<n>` is unchanged.
4. Implement the chosen baseline exemption **in the guard's definition**, not as a post-filter bolted
   on — the same lesson task `0176`'s closed-ledger exemption records.
5. **Fail loudly and usefully:** the failure message must name the folder IDs, their old rank and their
   new rank. A guard that says only *"a closed row moved"* leaves the reader doing the eight-row diff by
   hand, which is the work that was skipped in the first place.
6. **Skip cleanly with a stated reason when git history is unavailable** — a shallow clone must produce
   a clear skip, not a false pass and not a confusing crash.

### Out of scope

- **⛔ Do not repair the eight renumbered rows.** ADR-035 rejected reverting by name: it renumbers the
  same eight closed rows a second time. The record is corrected by task `0183`.
- **⛔ Do not add a devDependency.** ADR-014.
- **⛔ Do not edit any sprint board.**
- **⛔ Write no `:NNN` line-number citations.**
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. `test/closed-rank-immutability.test.js` exists and is picked up by `npm test` with **no** change to
   `package.json`.
2. The join is **on folder ID**. Prove it: a test case where a closed row's rank changed and another
   row took its old rank must still flag the closed row.
3. Replay the condition across the commit that filed task `0174` and confirm it flags **exactly** the
   eight rows named above — no more, no fewer. Report the list.
4. Under the chosen baseline, `npm test` is green. State which baseline was chosen and why.
5. In a repository without git history (simulate a shallow clone), the test **skips with a stated
   reason** — it does not pass silently and does not crash.
6. `npm test` passes including `test/prove-red.sh`'s hard gate; a mutation makes the new assertion fail.
   **Report the red run, not only the green one.**
7. **State all four ceiling limits in the close report.** A close report presenting this guard as a
   general check on board correctness has failed verification.
8. `grep` for `\.md:[0-9]` over the changed files returns nothing.

## Notes

- **Depends on:** `0181` — the guard enforces the rule `0181` writes down, and shipping the guard before
  the rule is narrowed enforces a rule the skill still contradicts. **And a baseline decision that is
  not yet made** — see above.
- **Blocks:** nothing.
- **Priority: LOW.** Report §8 ranks it LOW: it guards a rule that is breached rarely and loudly, and it
  costs more than the other guard.
- **⚠️ Priority 160 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** as ranked — it must land after `0181` and it is the lowest-urgency item of this batch,
  so append rank and merit position coincide.
- **Merit form used here** is the canonical `**On merit:**` shape from report §3.1 / ADR-035. Flagged so
  it is not read as drift.
- No existing row was renumbered by this brief.
