# Name the board's command `fkit board` throughout its own surface

## ID
0434

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

Q10 (selected): *"board/ + `fkit board`"*. Inside `board/`, the command's usage text, help, errors, `--json` messages and the page name it `fkit board …`, including `fkit board sprint show`. ⚠️ **Producer's split, stated:** phase 3 lists "`fkit board`"; phase 5 lists the launcher's fast path. This unit is the board's own naming; routing the real `fkit` launcher to it is `0444`.

## What to build

1. Rename aiboard's command surface to `fkit board …` inside `board/`.
2. Keep a way to run the module directly for tests and development (the plan names it).

## Verification steps

1. No user-facing string in `board/` still says `aiboard` (grep, pasted).
2. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0432`](../0432-drop-aiboards-three-redundant-features-pip-packaging-board-discovery-and-its-pointer-file-agents-md-blocks/brief.md). Hard.
- **Blocks:** [`0439`](../0439-run-a-copy-of-fkits-corpus-on-the-fkit-ified-board-the-phase-3-gate/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
