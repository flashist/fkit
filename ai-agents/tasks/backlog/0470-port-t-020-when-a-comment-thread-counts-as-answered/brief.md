# Port T-020 — when a comment thread counts as answered

## ID
0470

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

**Phase 9 — after v1** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **After v1 — still ported, per R11** (*"we should port the ai board features into fkit"*). Q8 and Q9 placed these after the first release, not out of it (ADR-052 D3).

Q9: comments and review ledgers keep separate jobs; aiboard's **T-020** (planned there, never built) is ported after v1 (D3).

## What to build

1. Implement T-020 as specified in the aiboard repository's task record, adapted to fkit's authors.

## Verification steps

1. Tests for answered / needs-reply transitions.
2. Full suite green.

## Notes

- **Depends on:** [`0459`](../0459-pilot-run-real-sprints-on-the-converted-fkit-and-ask-the-owner-whether-it-works-the-phase-6-gate/brief.md) (phase 6 passed). Hard.
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 9):** Phase 6 passed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
