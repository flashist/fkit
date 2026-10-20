# Port aiboard's sprints to Node, faithful to aiboard's format

## ID
0419

## Sprint
Sprint 14

## Priority
P3

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).**
> His standing rule, own words (2026-09-27): *"if we already have a brief for that task, the task
> shouldn't start, until I specifically approve it (because it might change the way fkit work in
> general)."*

**Phase 2 — port aiboard to Node, straight into `board/`** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **Faithful to aiboard's format at this step.** Ids stay `T-001`, sprint folders stay `S-011`, aiboard's rules stay aiboard's. fkit's rules are phase 3, not here — mixing the two is the "three big changes at once" risk the phases exist to prevent (ADR-052 *Risks* #2). **Tests first:** port the named aiboard tests to `node:test` under `test/board/`, see them red, then write the code. **Zero dependencies** (ADR-014). The source is the aiboard repository at HEAD `0108027`, read-only — ⛔ nothing is written there.

aiboard keeps sprints as folders with a goal, dates and a prose body, **plus** a stored `tasks:` list and a generated `## Tasks` checklist with `sprint refresh`. ⚠️ That stored list is exactly what fkit will **not** keep (A2, D2 — membership lives on the task only) — but that change is phase 3's (`0429`). This unit ports sprints **as aiboard has them**, so phase 2's corpus diff compares like with like.

## What to build

1. Port sprint create / move / membership / refresh and the stale-sprint-list `check`, faithful.
2. Port the matching aiboard tests first (indicative: `test_sprint_membership_stays_in_sync`, `test_move_sprint`, `test_check_detects_and_fixes_stale_sprint_list`).

## Verification steps

1. Each ported test seen red first, then green.
2. `node --test test/*.test.js` green; no dependency added.

## Notes

- **Depends on:** [`0418`](../0418-port-aiboards-task-store-to-node-with-cross-process-locking/brief.md) (sprints hold tasks). Hard.
- **Blocks:** [`0421`](../0421-port-aiboards-command-line-to-node-including-the-terminal-kanban-view-and-json/brief.md), [`0422`](../0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
- ⚠️ **Dated note 2026-10-20 — pulled into [Sprint 14](../../../sprints/sprint-14.md) as `P3`, and checked against [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md).** By a spawned `fkit-producer` (no owner channel), on owner rulings of 2026-10-20 via `AskUserQuestion` in a `fkit lead` session — selected option text, verbatim: *"New sprint after 13 (Recommended)"*, then *"Close it, then plan AI-Board sprint (Recommended)"* (quoted in full on the Sprint 14 board). `## Sprint` and `## Priority` above are updated; the *Board and priority* bullet above is now stale and left byte-identical. The sprint is **not started**; the ⛔ *do not start without the owner's specific word* stands. Scope is **not** changed by this note.
  - **ADR-057 D2.1 — growth stop.** This brief plans new test files: the ported sprint tests (*What to build* 2). Each new test file needs the **owner's OK**, file by file, in any lane; a plan he approves counts as that OK **only for the files it names**, and an agent's plan-review APPROVE is not his OK. So this task's plan must list every test file it adds, by path, for the owner to approve.
  - ⚠️ **ADR-057 D1 — the fence: an open owner question, not ruled.** D1 lets a test cover only a **shipped** script seen from outside (the launcher / init / hooks, or a shipped skill executable), plus four named exceptions, *"no others"*. `board/` does not ship in this phase and is in neither list, so tests under `test/board/` sit **outside the fence as written**. The default `npm test` glob (`test/*.test.js`) also does not reach `test/board/`, so where they run and the 2-min budget (D10) follow from the same ruling. ⛔ Do not build tests here until the owner rules; the question is on the Sprint 14 board's *Notes for the driver*.
