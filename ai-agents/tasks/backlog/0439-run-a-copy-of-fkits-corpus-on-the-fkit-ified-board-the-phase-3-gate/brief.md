# Run a copy of fkit's corpus on the fkit-ified board — the phase-3 gate

## ID
0439

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

Phase 3's gate (D9): *"Tests green; a **copy** of fkit's corpus runs clean."* ⚠️ **Producer's reading, to confirm with `fkit-architect` at pickup:** the only faithful way to put fkit's markdown corpus into the new store's shape is the converter's trial-run tree (`0437`, which builds exactly such a copy in a temporary folder) — so this gate runs **after** that tree exists. Phase 4 runs alongside phase 3 (D9), so the ordering is legal.

## What to build

1. Take a trial-run tree of fkit's corpus and run the board over it: `check`, every read command with `--json`, a write round-trip.
2. Report every failure; fix the board, not the copy.

## Verification steps

1. `fkit board check` on the copy is clean — pasted.
2. Every read command succeeds on the copy; a write round-trip preserves `0013`-style ids.
3. `node --test test/*.test.js` green.
4. fkit's real tree untouched.

## Notes

- **Depends on:** [`0428`](../0428-make-check-flag-closed-tasks-with-no-close-record-or-a-record-that-does-not-fit-its-door/brief.md), [`0430`](../0430-add-sprint-close-carry-to-a-whole-sprint-close-in-one-call/brief.md), [`0433`](../0433-build-the-owner-door-the-page-with-a-one-time-key-stamping-every-write-as-the-page-door/brief.md), [`0434`](../0434-name-the-boards-command-fkit-board-throughout-its-own-surface/brief.md) (phase 3 complete) and [`0437`](../0437-build-the-converters-trial-run-tree-the-converted-project-built-in-a-temporary-folder/brief.md) (the corpus copy). Hard.
- **Blocks:** [`0443`](../0443-ship-board-in-the-installer-and-make-node-a-hard-requirement/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- Gate reached = phase 5 may be **put to** the owner. It does not start phase 5.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
