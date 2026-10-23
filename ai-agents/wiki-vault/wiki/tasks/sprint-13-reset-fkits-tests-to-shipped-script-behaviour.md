# Sprint 13 — default `npm test` ≤ 2 min, CI-enforced: reset fkit's tests to shipped-script behaviour (option D)

**Source**: `ai-agents/sprints/done/sprint-13.md`
**Status**: done — `✅ Done — 2026-10-20. Closed by /fkit-sprint-done (agent-closed — not owner-verified).`
**Sprint/Tag**: Sprint 13 · opened and started 2026-10-19 · closed 2026-10-20 · driven by `/fkit-sprint-ship-loop` from a `fkit lead` session

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`) — created, started, closed and archived inside this window.

## Goal
**Default `npm test` ≤ 2 min, CI-enforced — reset fkit's tests to shipped-script behaviour (option D).** Success: all five rows closed, with `0530`'s measured times in `CONTRIBUTING.md` showing the budget met.

**Authority** — owner rulings 2026-10-19, `AskUserQuestion`, `fkit lead` session, relayed to a spawned producer:

| # | Selected | What it settled |
|---|---|---|
| S1 | *"Yes, option D (Recommended)"* | the lead's reading of *"the option that is reducing the time most radically"* confirmed |
| S2 | *"New Sprint 13, start now (Recommended)"* | this board, only `0526`–`0530`, started — the owner's word for all five; Sprint 12 stays paused |
| S3 | *"Keep five (Recommended)"* | no merge of the five briefs |
| S4 | *"After the ADR is signed (Recommended)"* | nothing cancelled or rescoped until ADR-057 is signed |

⚠️ The `P1`–`P5` ranks were the dependency order the lead relayed, not an owner choice.

## Key Changes
All five rows ✅ — see [[tasks/the-test-scope-reset-tasks-0526-0530]]: `0526` (mutation 48 on Linux — *"No"*), `0527` (ADR-057, signed 2026-10-19), `0528` (the rules), `0529` (the cut), `0530` (the budget and release gate). Two gates held inside the sprint: `0528`/`0529` waited for the ADR's sign-off, and were re-scoped to it before any build.

## Outcome
- **Closed 2026-10-20** under the owner's *"Close it, then plan AI-Board sprint (Recommended)"*; no open row to relocate; no successor board existed at close (`successor` exit 3). Sprint 12 left `🔄 In progress`, untouched.
- **The success condition:** `CONTRIBUTING.md` carries the times. ⚠️ The local figures were taken on a **busy machine (load 7–20), not an idle Mac**; the CI runner's budget step measured 60.7–85.2 s against 120 s.
- **Knock-on (S4) ruled at `0529`'s plan gate:** [[tasks/the-2026-10-20-adr-057-test-task-cancellations]].

## Related
- [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] — the decision this sprint recorded and carried out
- [[tasks/the-test-scope-reset-tasks-0526-0530]] — the five tasks
- [[tasks/sprint-12-set-a-nine-backlog-tasks-goal-not-set]] — paused while this ran
- [[tasks/sprint-14-port-aiboard-to-node-adr-052-phase-2]] — the next board, drafted after this close
- [[systems/testing-and-verification]]
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`, closing one-way links):* [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] · [[tasks/build-the-opt-in-plan-review-step-off-by-default]]
