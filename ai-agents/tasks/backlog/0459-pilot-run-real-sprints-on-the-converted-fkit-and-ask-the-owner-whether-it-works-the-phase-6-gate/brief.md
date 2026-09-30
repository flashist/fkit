# Pilot — run real sprints on the converted fkit and ask the owner whether it works — the phase-6 gate

## ID
0459

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

**Phase 6 — pilot: convert fkit** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **The pilot — R2's own words: *"Though we can test it on fkit if needed."*** fkit is the first project converted (Q1). **The owner commits** the conversion; undo is reverting that commit, clean only until the first change made after it (D8 item 8).

Phase 6's gate (D9): *"The owner says it works."* ⛔ **No trial, timeout, check-in or review point may be re-introduced in its place** (ADR-052 *Do NOT re-raise*: the trial, R2). How long the pilot runs is the owner's call. *Re-raise only if* the owner finds the board worse to work with than the markdown.

## What to build

1. Work real sprints on the converted fkit; keep a short log of friction and `check` findings.
2. When the owner asks, put "does it work?" to him with that log.

## Verification steps

1. The owner's answer is recorded verbatim with its kind (own words vs selected option).
2. The friction log exists and cites sources (worklogs, `check` output).

## Notes

- **Depends on:** [`0458`](../0458-pilot-convert-fkit-itself-trial-run-owner-reads-apply-owner-commits/brief.md). Hard.
- **Blocks:** [`0461`](../0461-convert-geoconflict/brief.md), [`0465`](../0465-write-the-one-distilled-aiboard-design-doc-into-fkits-knowledge-base/brief.md), [`0466`](../0466-archive-the-aiboard-repository-read-only/brief.md), [`0467`](../0467-retire-the-read-only-board-reader/brief.md), [`0468`](../0468-port-aiboards-mcp-server-under-the-boards-store-rules/brief.md), [`0470`](../0470-port-t-020-when-a-comment-thread-counts-as-answered/brief.md), [`0471`](../0471-port-t-007-live-reload-in-place-of-polling/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 6):** The owner says it works. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
