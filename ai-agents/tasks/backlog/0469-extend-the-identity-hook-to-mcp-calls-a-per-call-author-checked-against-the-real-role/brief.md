# Extend the identity hook to MCP calls — a per-call author checked against the real role

## ID
0469

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

D5 layer 2, after v1: the same honesty check for MCP calls. The hook sees MCP calls as structured input, so this check is exact (decision document §3.4).

## What to build

1. Hook checks each MCP write's author against the calling agent's real role.

## Verification steps

1. Tests: honest author passes; mismatched author denied.
2. Full suite green.

## Notes

- **Depends on:** [`0468`](../0468-port-aiboards-mcp-server-under-the-boards-store-rules/brief.md) and [`0447`](../0447-add-the-identity-hook-a-fkit-board-writes-by-must-be-the-calling-agents-real-role/brief.md). Hard.
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 9):** Phase 6 passed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
