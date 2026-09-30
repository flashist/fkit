# Convert the remaining fkit projects, one at a time

## ID
0463

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

**Phase 7 — other projects, one at a time** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **One project at a time, in the owner's order: geoconflict → pubquiz → the rest** (Q1, R5). Each is launch → offer → trial run the owner reads → convert → **the owner commits** (decision document §7). Until a project is converted it runs on the previous fkit (R9, Q13).

Q1: *"… → rest"*. The owner names the rest and their order; each follows the same path as `0461`. ⚠️ **Producer's split, stated:** one brief for "the rest" because the list is not known yet — once the owner names it, split into one task per project.

## What to build

1. Get the owner's list; convert each, one at a time, as in `0461`.

## Verification steps

1. Per project: trial run read, self-check passed, owner's commit recorded.
2. The list of projects is the owner's (recorded).

## Notes

- **Depends on:** [`0462`](../0462-convert-pubquiz/brief.md). Hard.
- **Blocks:** [`0464`](../0464-remove-the-previous-fkit-once-every-project-is-converted/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 7):** The owner reads each project's trial run. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
