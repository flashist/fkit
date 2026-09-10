# The throughput counter — created vs closed per ISO week, plus the record-repair share, AND the `/fkit-status` line that forbade the claim

**Source**: `ai-agents/tasks/done/0359-the-throughput-counter-created-vs-closed-per-iso-week-and-record-repair-share/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P11` · task `0359` · owner `fkit-coder`

## Goal

⭐ **This is the row that makes Sprint 7 falsifiable.** The sprint's success criterion — record-repair
rows **under 10% of open work**, ruled 2026-08-29 (*"Cap record repair, not process work (Rec)"*) —
⛔ **could not be computed by anything in the repo.** Without this counter the sprint ends with an
unfalsifiable claim about whether it worked.

⭐ **Note what the ruling did NOT say: there is no cap on process work at all.** ⛔ A counter that
reports process work as if it were over budget has misread the ruling.

## Key Changes

⚠️ **Two deliverables, one task, and that is deliberate** — the one exception to the smallest-shippable
rule here, because ⛔ **neither is correct without the other.**

### 1. The counter script

- **Created vs closed per ISO week, derived from git history** — not from a snapshot. Creation is when
  a task folder first appears; closure is when it moves into `done/` or `cancelled/`.
  ⚠️ **Task folders were introduced by a migration** ([[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]]),
  so history before that point has a different shape — ⛔ **a stated horizon is fine; silently wrong
  counts are not.**
- **The record-repair share of open work, by a rule WRITTEN INTO THE SCRIPT** — ⛔ not a heuristic
  applied by hand at report time. The script can list which rows it classified each way, **so a
  disputed row can be checked.**
- **Deterministic and dependency-free** — ⛔ no new devDependency
  ([[decisions/adr-014-how-fkit-tests-itself]]).
- ⚠️ **Where the file lives was a real decision, not a detail.** A file under `claude/` engages the
  install share's **structure-spec and hash manifest** — `test/structure-spec.test.js`,
  `test/structure-manifest.test.js` and `fkit-heal`'s checker all have to learn about it. A file under
  `bin/` does not.

### 2. ⛔ The half that gets forgotten — the skill FORBADE the claim the script makes

`fkit-status`'s Backlog-board headline row read: *"**Do not say whether the backlog is growing or
shrinking** — you are reading one snapshot, and the source set has no history to ground a trend in."*

⛔ **Correct on the day it was written, and wrong the moment this script exists** — its stated reason,
*"the source set has no history"*, is precisely what the counter supplies. ⛔ **Ship the script without
amending the line and the project has a tool it has forbidden itself to quote.**

⭐ **The amendment is narrow.** The prohibition lifts **only where a measurement backs the claim**;
reading a snapshot and asserting a trend **stays banned**. ⛔ **A rewrite that simply deletes the ban
has failed this task.**

⛔ **`dashboard.sh` was not touched** — it is a contract with `test/dashboard-contract.test.js` and both
task movers. ⭐ **The counter is a NEW producer of facts, not a change to the existing one.**

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`. `throughput.mjs` is what Sprint 7's closing banner
measured itself against.

⚠️ **The baseline the script reproduces is NOT the ruled baseline, and the gap is an owner-ruled
accepted residual** (*"The counter's 9-verb figures (Rec)"*). Re-measured 2026-09-08 at the release
commit, the script prints **repair 46 / 129 = 35.7%** and **repair-excluding-source-defects
43 / 129 = 33.3%**, while the criterion was ruled against the **hand** figure **42 / 129 = 32.6%**.
⛔ **Recorded, not reopened.**

⭐ **What it measured at the release commit: 23 of 112 = 20.5% all-in, 20 of 112 = 17.9% excluding
source-defect repairs — against a target of under 10%.** ⛔ **The sprint missed.** ⭐ **And it found the
first two weeks on record where closes exceed creations** — 2026-W36 (14/20) and 2026-W37 (7/28).

- **Depends on:** nothing. ⭐ **Independent of the whole `0353`→`0358` chain.**
- **Blocks:** `0360` in practice, not by rule.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board whose criterion this measures
- [[tasks/cut-the-v0-3-0-release-and-hand-archive-sprint-7]] — `0360`, which reports the number
- [[tasks/design-deterministic-dashboard-for-fkit-status]] · [[tasks/build-deterministic-dashboard-script-for-fkit-status]]
  — `dashboard.sh`, the existing producer of facts this deliberately did not change
- [[tasks/add-status-skill-to-producer]] · [[tasks/report-backlog-board-in-fkit-status-on-request-only]]
  — the `/fkit-status` skill whose prohibition this amended
- [[decisions/adr-014-how-fkit-tests-itself]] — the zero-devDependency constraint
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the migration that bounds
  the counter's history horizon
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the
  structure-spec / hash-manifest surface a `claude/` placement would have engaged
