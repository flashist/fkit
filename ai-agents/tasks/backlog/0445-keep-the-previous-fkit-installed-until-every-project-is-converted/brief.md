# Keep the previous fkit installed until every project is converted

## ID
0445

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

**Phase 5 — wire fkit to the board** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **The largest phase** (decision document §5, §7). ⚠️ **fkit itself runs on today's rules until phase 6** (ADR-052 *Read first* item 2) — so this wiring must not break fkit's own dogfooded sessions before its conversion. How it stays safe (the previous fkit kept by `0445`, fixtures, working on a branch) is the plan's to say, and the plan must say it. Tests that touch the old layout are rewritten or retired **inside the unit that changes them**, not in a sweep at the end.

Q13 (selected): *"Until every project is converted"*. Today there is **one** fkit per machine and `fkit update` replaces it (`_fkit_reinstall()` in `claude/fkit-claude.sh`), so keeping the previous version and choosing it per project is real work (decision document §3.7). An unconverted project declined at launch opens on the previous fkit (R9).

## What to build

1. The installer / updater keeps the previous fkit beside the new one.
2. The launcher can open a session on the previous fkit for a given project.

## Verification steps

1. A fixture update leaves both versions installed; a session can be opened on either.
2. Full suite green.

## Notes

- **Depends on:** [`0443`](../0443-ship-board-in-the-installer-and-make-node-a-hard-requirement/brief.md). Hard.
- **Blocks:** [`0446`](../0446-check-each-projects-data-format-at-launch-and-offer-the-conversion-trial-run-first/brief.md), [`0464`](../0464-remove-the-previous-fkit-once-every-project-is-converted/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 5):** Full suite green on fixtures; rules block within its size budget. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
