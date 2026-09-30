# Write the converter's trial-run report — the page the owner reads before anything is applied

## ID
0438

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

D8 item 2: a report **the owner reads** — per task: folder, facts, sprint, order, priority, close record; per sprint: folder and body; totals; every refusal; every **decision to confirm** (including A3's default priority). D8 item 9: a trial run on an unchanged tree gives the **same report byte-for-byte**; re-running on a converted project does nothing and says so.

⭐ Written for a human: counts and exceptions first, detail after (the owner's reporting ruling behind `0409`).

## What to build

1. Generate the report from `0437`'s tree and `0436`'s refusals.
2. Deterministic output; "already converted" message.

## Verification steps

1. Two runs on an unchanged fixture produce byte-identical reports (a test).
2. The report lists the default-priority decision as a decision to confirm, not as a fact.
3. The owner-facing summary fits on one screen before detail begins (show it).

## Notes

- **Depends on:** [`0437`](../0437-build-the-converters-trial-run-tree-the-converted-project-built-in-a-temporary-folder/brief.md). Hard.
- **Blocks:** [`0440`](../0440-build-the-converters-apply-step-renames-first-content-second-tested-on-fixtures-only/brief.md), [`0441`](../0441-run-the-converters-trial-run-on-fkit-and-put-its-report-to-the-owner-the-phase-4-gate/brief.md), [`0442`](../0442-run-the-converters-trial-runs-on-geoconflict-pubquiz-and-the-other-fkit-projects-changing-nothing/brief.md), [`0446`](../0446-check-each-projects-data-format-at-launch-and-offer-the-conversion-trial-run-first/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 4):** The owner reads fkit's trial-run report; every refusal explained; the default-priority rule confirmed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
