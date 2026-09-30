# Re-sync the wiki after fkit's conversion

## ID
0460

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

> ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).**
> His standing rule, own words (2026-09-27): *"if we already have a brief for that task, the task
> shouldn't start, until I specifically approve it (because it might change the way fkit work in
> general)."*

**Phase 6 — pilot: convert fkit** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **The pilot — R2's own words: *"Though we can test it on fkit if needed."*** fkit is the first project converted (Q1). **The owner commits** the conversion; undo is reverting that commit, clean only until the first change made after it (D8 item 8).

Decision document §5: 368 task-path citations in the vault are unaffected by ids, but vault pages describing boards, movers and statuses go stale at conversion; `fkit-wiki` re-syncs after the pilot (ADR-005 — only the wiki role writes the vault).

## What to build

1. Run `/fkit-wiki-sync` (or a targeted ingest) over the converted tree and ADR-052.

## Verification steps

1. `/fkit-wiki-lint` reports no broken links introduced by the conversion.
2. Pages describing the old movers / banners say what changed and when.

## Notes

- **Depends on:** [`0458`](../0458-pilot-convert-fkit-itself-trial-run-owner-reads-apply-owner-commits/brief.md). Hard.
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 6):** The owner says it works. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
