# Retire the read-only board reader

## ID
0467

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

**Phase 8 — archive aiboard** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **After the fkit pilot** (Q12). The archive is **read-only, not deleted**; plain archive, no history import (ADR-052 D9 phase 8).

D9 phase 8: retire `bin/fkit-board.mjs` (733 lines), `bin/board-narrow.mjs` (458) and their tests (`test/board-reader.test.js` also pins `sprint-11.md` by name). ADR-051 D2 (the reader as interim) ends here.

⚠️ **Open point for pickup, not ruled:** the reader's `--root` flag (`0412`) serves **other** projects' trees; phase 8 may run while phase 7 is still converting them. Retiring it before the last conversion removes the owner's board view for unconverted projects. The owner decides whether to wait for `0463`.

## What to build

1. Delete the two scripts and their tests; remove every reference.

## Verification steps

1. No file references the retired scripts (grep, pasted); full suite green.

## Notes

- **Depends on:** [`0459`](../0459-pilot-run-real-sprints-on-the-converted-fkit-and-ask-the-owner-whether-it-works-the-phase-6-gate/brief.md) (phase 6 passed). Hard.
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 8):** Phase 6 passed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
