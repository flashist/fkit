# Decide what catches a task brief that has no board row — mechanism open, including "nothing changes"

**Source**: `ai-agents/tasks/done/0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-10-20 on its finding
**Sprint/Tag**: Backlog board · Unscheduled · task `0296` · owner `fkit-architect`

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`) — the brief moved from `backlog/` to `done/` in this window. First page of its own; earlier vault pages mention it only in passing.

## Goal
Close a stated gap: **nothing catches "a task brief exists on disk with no row on any board."** Such a task is invisible to `/fkit-status`, to `dashboard.sh` (a pure function of the plan and the briefs it links) and to a producer sweeping boards. The rule itself is already written — `/fkit-task-brief` step 8, *"Update the board — every brief gets a row, always"* — so the task is about **enforcement**, not the rule. Its candidate mechanisms were all left open, including *"nothing changes"*. Owner ruling 2026-08-14 opened it with the mechanism deliberately open.

## Key Changes
- **2026-09-18 — the decision** (measured, three specimens): *two failure modes, the live one has stopped* — zero new specimens in 108 filings by then. The chosen mechanism (candidate 2, a test-suite check) was filed as its own task, `0406`, owner `fkit-coder`. The owner ruled (b) the same day: **this task stays open until `0406` lands green**, because its Verification step 4 says that if a mechanism lands, its output is pasted into the close. The two specimens `0014` and `0004` were **deliberately left unrepaired** as `0406`'s only live test data.
- **2026-10-20 — closed on its finding; the gate re-ruled.** Owner ruling 3, `AskUserQuestion`, *"0406 (repo-content test, outside ADR-057): cancel?"* → *"Cancel; close 0296 as accepted (Recommended)"*. A repo-content check is outside [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]]'s fence with no exception, so `0406` was cancelled and this task's finding is **accepted with no mechanism** — in effect candidate 4 (*"nothing changes"*). Closed with `/fkit-task-done`, not `/fkit-task-cancelled`: the deliverable was a decision, and it was made.

## Outcome
- ⚠️ **Accepted cost:** nothing now catches a brief filed with no board row. `0014`'s and `0004`'s missing rows stay unrepaired, left to the owner's next call. The deferred which-board question stays deferred.
- ⛔ **Still unscoped:** the second-order lesson the brief recorded — an unverified change-surface report crossing an agent boundary.

## Related
- [[tasks/the-2026-10-20-adr-057-test-task-cancellations]] — `0406`'s cancellation, same ruling
- [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] — why the mechanism will not be built
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] — `0014`, one of the two row-less specimens
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board where such rows belong
