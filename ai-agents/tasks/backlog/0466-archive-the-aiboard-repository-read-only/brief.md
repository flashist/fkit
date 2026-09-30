# Archive the aiboard repository read-only

## ID
0466

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

**Phase 8 — archive aiboard** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **After the fkit pilot** (Q12). The archive is **read-only, not deleted**; plain archive, no history import (ADR-052 D9 phase 8).

Q12: *"After the fkit pilot"*. Read-only, **not deleted**; the `v0.1.0` tag kept; the README points to fkit; plain archive, no history import (D9 phase 8).

⚠️ **These acts happen in the aiboard repository, not in fkit.** Who performs them (the owner, `aiboard-lead`, or a named agent with his word) is the owner's call at pickup; this brief tracks that they happen. ⛔ Not authorised today — ADR-052 *What approval authorises*: no touching the aiboard repository, no archiving.

## What to build

1. Agree with the owner who performs the archive; confirm each act done.

## Verification steps

1. The repository is archived (read-only) and still exists; `v0.1.0` present; README points to fkit — each confirmed and recorded.

## Notes

- **Depends on:** [`0459`](../0459-pilot-run-real-sprints-on-the-converted-fkit-and-ask-the-owner-whether-it-works-the-phase-6-gate/brief.md) and [`0465`](../0465-write-the-one-distilled-aiboard-design-doc-into-fkits-knowledge-base/brief.md). Hard.
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 8):** Phase 6 passed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
