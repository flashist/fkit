# Build the converter's reader — every task's and sprint's facts from a markdown project, read with fkit's current tools

## ID
0435

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

D8: the converter reads old projects with fkit's **current** tools (tools from fkit, data from the project — the rule `bin/fkit-board.mjs` already follows), so it copes with `sprint-N.md`, `plan-sprint-N.md` (task `0415`), `sprint-backlog.md` (ADR-041) and old `🔒 CLOSED` banners. This unit is **only the read**: a per-task and per-sprint fact model — folder, status, sprint, order, owner, close marker, board row text with source board / line / hash. It writes nothing anywhere.

⭐ Ordering: phase 4 runs **alongside** phase 3 (D9) — this reader needs nothing from the new store.

## What to build

1. Read every task and sprint of a project's markdown tree into a fact model, using `dashboard.sh`'s resolution where it already exists (never a second parser for the same fact).
2. Handle every legacy board shape named above; fixtures for each.

## Verification steps

1. Fixture tests for each legacy board shape.
2. Run on fkit's own tree: the fact model's status / sprint / order / owner for every task equals what `dashboard.sh` reports (paste the comparison summary).
3. `git status` unchanged after a run on fkit's tree (writes nothing).

## Notes

- **Depends on:** [`0423`](../0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate/brief.md) (phase 4 runs alongside phase 3, which follows phase 2's gate). Hard.
- **Blocks:** [`0436`](../0436-make-the-converter-refuse-to-start-or-to-guess-preconditions-and-ambiguity-refusals/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 4):** The owner reads fkit's trial-run report; every refusal explained; the default-priority rule confirmed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
