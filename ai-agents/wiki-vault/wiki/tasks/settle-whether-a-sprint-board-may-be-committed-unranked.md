# Settle whether a sprint board may be committed UNRANKED — decide which rule wins, then make the other conform

**Source**: `ai-agents/tasks/done/0361-settle-whether-a-sprint-board-may-be-committed-unranked/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P13` · task `0361` · owner `fkit-architect`

## Goal

⛔ **THE CONTRADICTION, MEASURED 2026-08-29 AND NOT INHERITED.** Three rules disagreed about whether a
sprint board may be committed with an unranked Priority cell (`—`). Two were written policy, one was a
shipped test, and **both sides were live**:

- **Site A — the test.** `test/closed-rank-immutability.test.js`'s `parseBoard` **refused the marker by
  design**, stated twice in the file and asserted by a unit test.
- **Site B — `ai-agents/sprints/backlog.md`**, whose *"Off:"* rule has an **unranked-forward clause**
  that presupposes the opposite, and names its own worked precedent (Sprint 6, 2026-08-14).
- **Site C — `ai-agents/sprints/sprint-7.md`** §*"⛔ This board is UNRANKED"*, superseded but kept
  byte-identical, whose deferral clause is the exact act the decision had to classify.

⛔ **`npm test` was RED on `main` and had been since Sprint 7's board was committed.**

⭐ **What made it a real decision rather than a bug report: the symptom had already cleared and the
conflict had not.** The owner ranked and committed the board, and the suite measured **34/34 green** at
`cf289c2`. ⛔ **But the next board opened unranked reproduces the failure exactly**, because sites B and
C both still instruct a producer to open one that way. ⭐ **A green suite was therefore not evidence the
rule was settled.**

⛔ **Nine of Sprint 7's other twelve rows verify with *"`npm test` passes"* or *"both guards still
green"*** — so a red suite on `main` is not a private problem.

## Key Changes

⛔ **TWO PHASES, IN ORDER. THE DECISION FIRST, AND NO CONFORMING EDIT BEFORE IT LANDS.**

**Phase 1** produced [[decisions/adr-046-a-sprint-board-may-be-committed-unranked-and-an-erased-rank-flags]]
on the owner's rulings **P1**, **P2** and **P3** of 2026-09-04, given live via `AskUserQuestion` at this
task's plan gate.

**Phase 2** made the other rule conform, under hard limits:

- ⛔ **Widening is not weakening.** `parseBoard` must **still throw** on a garbage Priority cell.
- ⛔ **Answer the question the widening creates, in the test's own comments** — an unranked row has no
  rank to compare.
- ⛔ **Do not touch the `0174` replay fixtures or the first-era bare-`<n>` widening** — frozen.
- ⛔ **No new devDependency and no `package.json` change**
  ([[decisions/adr-014-how-fkit-tests-itself]]).
- ⛔ **Do not re-rank, renumber, or insert a row anywhere**
  ([[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] not reopened).
- ⛔ **Do not rank the Backlog board** — *"an archive of known issues, not a ranked queue"* by owner
  ruling.
- ⛔ **Site C is a superseded section kept byte-identical on purpose** — annotate, never rewrite.
- ⛔ **Do not commit and do not push.**

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`.

⭐ **A finding surfaced by this task's own phase-2 coder became a dated correction on the ADR itself:
it declined to assert a case it had measured impossible.** `'— '` — an em-dash with a trailing space —
is **unreachable**, because `parseBoard` trims the cell **before** the rank check. ⭐ **That absence is
the point of the note; every other item on the must-throw list is reachable and is asserted.**

⚠️ **The ADR carries THREE dated correction passes, all 2026-09-05, and they nest** — the third
corrects a claim **inside the first note itself**. ⭐ *A correction may itself be corrected.*

⛔ **WHY `P13` AND NOT `P12` — the rank is an APPEND, and that was not a free choice.** On merit it
belongs immediately above `0360`; ⛔ inserting it there would have renumbered a row, which ADR-035
forbids. ⚠️ **Rank order and execution order therefore disagree for this pair**, and the board says so.

⛔ **This row is NOT a record-repair row and must not be counted as one by `0359`.**

- **Depends on:** nothing. ⭐ Independent of the whole `0353`→`0358` chain.
- **Blocks:** `0360` — ⛔ **hard.** ⭐ *"The release should not ship with two written rules
  contradicting a shipped test."*

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[decisions/adr-046-a-sprint-board-may-be-committed-unranked-and-an-erased-rank-flags]] — the
  deliverable
- [[tasks/cut-the-v0-3-0-release-and-hand-archive-sprint-7]] — `0360`, the row it hard-blocked
- [[tasks/build-the-closed-rank-immutability-guard]] — the guard whose `parseBoard` was widened
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board carrying site B's
  unranked-forward clause
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — not reopened,
  and the reason the rank is an append
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — `0174`, whose replay fixtures stay frozen
- [[decisions/adr-014-how-fkit-tests-itself]] — the test contract phase 2 had to stay inside
