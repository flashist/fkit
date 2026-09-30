# Build the converter's apply step — renames first, content second, tested on fixtures only

## ID
0440

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).**
> His standing rule, own words (2026-09-27): *"if we already have a brief for that task, the task
> shouldn't start, until I specifically approve it (because it might change the way fkit work in
> general)."*

**Phase 4 — the converter, trial runs only** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **Trial runs only — no project is changed in this phase** (ADR-052 D9 phase 4, D8). The converter's contract is D8, items 1–9; the reason it is paranoid is commit `331f298`, which wrote the wrong status into 3 of ~80 done briefs and went unnoticed for two months (decision document §6). ⛔ Never run anything from this phase with write access against a real project's tree.

The step that actually converts a project: D8 item 6 — **two steps so git keeps history**: folder moves first (seen as renames), then content — gated on the self-check (`0407`) passing. **The owner commits** (D8 item 8).

⚠️ **Producer's placement, stated:** ADR-052 does not name the phase that builds apply. It sits here because phase 6 needs it and phase 4 is the converter's phase — ⛔ **but phase 4 changes no project**, so this unit is built and tested **on fixtures only**. The first real apply is fkit's, in `0458`, on the owner's word.

## What to build

1. Apply = the trial-run tree landed in two steps, only after a passing self-check.
2. Re-run on a converted project does nothing and says so (D8 item 9).

## Verification steps

1. Fixture tests: after apply, `git diff --find-renames` shows the moves as renames; content changes land in the second step; a failing self-check blocks apply.
2. ⛔ No real project tree was touched (say how this was checked).

## Notes

- **Depends on:** [`0407`](../0407-build-the-mover-outcome-verifier-which-is-also-the-acceptance-test-for-the-mover-command/brief.md) (the self-check that gates apply) and [`0438`](../0438-write-the-converters-trial-run-report-the-page-the-owner-reads-before-anything-is-applied/brief.md). Hard.
- **Blocks:** [`0458`](../0458-pilot-convert-fkit-itself-trial-run-owner-reads-apply-owner-commits/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 4):** The owner reads fkit's trial-run report; every refusal explained; the default-priority rule confirmed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
