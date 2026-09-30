# Check each project's data format at launch, and offer the conversion — trial run first

## ID
0446

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

R9 (selected): *"No, ask at launch — Launching an older-format project tells you and offers the conversion (trial run first); until then it stays on the previous fkit."* D7: same format → proceed; older or no `board.json` → say so, offer the conversion, **trial run first**; declined → the session opens on the previous fkit; newer than this fkit → refused: run `fkit update`.

## What to build

1. Launch-time check of `ai-agents/board.json`'s format number.
2. The offer runs the trial run (`0438`) and shows its report before any apply.

## Verification steps

1. Fixture launches for all four cases (same / older / missing / newer) behave as above.
2. A declined offer opens on the previous fkit (`0445`).
3. Full suite green.

## Notes

- **Depends on:** [`0444`](../0444-route-fkit-board-straight-from-the-launcher-to-the-board-module/brief.md), [`0445`](../0445-keep-the-previous-fkit-installed-until-every-project-is-converted/brief.md), [`0431`](../0431-add-ai-agents-board-json-settings-and-the-data-format-number-the-board-refuses-to-write-past/brief.md) and [`0438`](../0438-write-the-converters-trial-run-report-the-page-the-owner-reads-before-anything-is-applied/brief.md). Hard.
- **Blocks:** [`0458`](../0458-pilot-convert-fkit-itself-trial-run-owner-reads-apply-owner-commits/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 5):** Full suite green on fixtures; rules block within its size budget. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
