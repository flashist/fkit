# Run the converter's trial run on fkit and put its report to the owner — the phase-4 gate

## ID
0441

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

Phase 4's gate (D9): *"The owner reads fkit's trial-run report; every refusal explained; the default-priority rule confirmed."* This is where **A3** — the default priority for converted tasks, proposed `medium` — is ruled (D8 item 5).

⛔ Trial run only: fkit's tree is not changed. The conversion itself is phase 6 (`0458`).

## What to build

1. Run the trial run on fkit's tree; take the report as produced.
2. Explain every refusal in plain words, with the old-format fix it needs.
3. Put the report and the A3 decision to the owner via `AskUserQuestion` in a session (a spawned producer returns it as an open question instead — ADR-021).

## Verification steps

1. The report is saved in this task's folder, unedited.
2. Every refusal has an explanation and a proposed old-format fix.
3. The owner's A3 ruling is recorded with its kind (own words vs selected option).
4. `git status` shows no change to fkit's tree outside this task's folder.

## Notes

- **Depends on:** [`0407`](../0407-build-the-mover-outcome-verifier-which-is-also-the-acceptance-test-for-the-mover-command/brief.md) and [`0438`](../0438-write-the-converters-trial-run-report-the-page-the-owner-reads-before-anything-is-applied/brief.md). Hard.
- **Blocks:** [`0458`](../0458-pilot-convert-fkit-itself-trial-run-owner-reads-apply-owner-commits/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 4):** The owner reads fkit's trial-run report; every refusal explained; the default-priority rule confirmed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- Gate reached = phase 5 may be **put to** the owner (phase 4 may continue alongside it).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
