# Give the board fkit's four-digit task ids, with forgiving lookups and a `0013` round-trip

## ID
0424

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

**Phase 3 — make it fkit's board** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **This is where the board becomes fkit's** (ADR-052 D4, D5). It builds on the faithful port from phase 2 and changes behaviour on purpose; each change has its own tests. **Zero dependencies** (ADR-014). The module boundary holds: the rest of fkit will talk to the board only through `fkit board …` and its `--json` output (D1).

R5 (selected): *"Keep 0404"*. Ids are **four digits, no letter** — a form change from aiboard's `T-001`, not a drop (D3). Next id = highest ever + 1, **cancelled included** (ADR-029's rule, unchanged). aiboard's forgiving lookups are ported: `404`, `0404` and `0404-slug` all find the task.

Priorities (all four levels, Q7) and rank already came across in phase 2; this unit re-proves them under the new ids rather than re-building them.

## What to build

1. Replace `T-NNN` with fkit's `NNNN` ids in the store, CLI and page.
2. Allocation = 1 + the highest id across **every** status folder, including cancelled.
3. Forgiving lookups for `404`, `0404`, `0404-slug`.
4. A write round-trip test proving `0013` and `0404` survive (the T-023 class, in Node).

## Verification steps

1. Tests: allocation skips a cancelled task's id; the three lookup forms resolve; `0013` survives a write.
2. Priority and rank tests from phase 2 still pass under the new ids.
3. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0423`](../0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate/brief.md) (phase 2's gate). Hard.
- **Blocks:** [`0425`](../0425-give-the-board-fkits-status-folders-and-a-free-text-blocked-reason/brief.md), [`0431`](../0431-add-ai-agents-board-json-settings-and-the-data-format-number-the-board-refuses-to-write-past/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
