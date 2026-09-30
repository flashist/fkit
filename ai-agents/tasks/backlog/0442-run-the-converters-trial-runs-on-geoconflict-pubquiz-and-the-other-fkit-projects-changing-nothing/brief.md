# Run the converter's trial runs on geoconflict, pubquiz and the other fkit projects, changing nothing

## ID
0442

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

> ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).**
> His standing rule, own words (2026-09-27): *"if we already have a brief for that task, the task
> shouldn't start, until I specifically approve it (because it might change the way fkit work in
> general)."*

**Phase 4 — the converter, trial runs only** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **Trial runs only — no project is changed in this phase** (ADR-052 D9 phase 4, D8). The converter's contract is D8, items 1–9; the reason it is paranoid is commit `331f298`, which wrote the wrong status into 3 of ~80 done briefs and went unnoticed for two months (decision document §6). ⛔ Never run anything from this phase with write access against a real project's tree.

D9 phase 4: trial runs "on fkit, geoconflict, pubquiz and the rest; **no project changed**." Running them early surfaces each project's refusals long before its own conversion (phase 7) — the old-format fixes can then happen at the owner's pace. One project at a time, no cross-project board (R5).

## What to build

1. Trial-run each project the owner names, in Q1 order; save each report.
2. Summarise refusals per project for the owner.

## Verification steps

1. One saved report per project; each project's `git status` unchanged (checked and stated per project).
2. The list of projects run is the owner's list, not a guess (recorded).

## Notes

- **Depends on:** [`0438`](../0438-write-the-converters-trial-run-report-the-page-the-owner-reads-before-anything-is-applied/brief.md) and [`0407`](../0407-build-the-mover-outcome-verifier-which-is-also-the-acceptance-test-for-the-mover-command/brief.md). Hard.
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 4):** The owner reads fkit's trial-run report; every refusal explained; the default-priority rule confirmed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
