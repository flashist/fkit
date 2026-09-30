# Reword fkit's rules, conventions and agent prompts for the board, within the rules-block budget

## ID
0457

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

The rules move from prose into the store, so the prose must say so: closes only via the producer's skills; owner-verified only from the page (Q3). Files: `claude/scaffold/universal-rules.md` (size-capped, `RULES_MAX=4352`), five conventions and their scaffold copies (incl. `priority-is-rank-not-identity.md`, now four priority levels beside rank), the agent prompts, `CLAUDE.md`. Phase 5's gate includes *"rules block within its size budget"*.

## What to build

1. Reword each file; keep every hard rule's meaning except where ADR-052 changes it.
2. Keep the rules block within `RULES_MAX`.

## Verification steps

1. The rules-block budget test is green, with the remaining bytes stated.
2. A diff-read confirms no hard rule was dropped (listed per file).
3. Full suite green.

## Notes

- **Depends on:** [`0448`](../0448-rewire-fkit-task-done-and-fkit-task-cancelled-to-one-board-call-each/brief.md) and [`0449`](../0449-rewire-fkit-sprint-done-and-fkit-sprint-cancelled-to-sprint-close-carry-to/brief.md) (the doctrine they describe). Hard.
- **Blocks:** [`0458`](../0458-pilot-convert-fkit-itself-trial-run-owner-reads-apply-owner-commits/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 5):** Full suite green on fixtures; rules block within its size budget. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- ⛔ `ai-agents/wiki-vault/` is not touched here (ADR-005) — that is `0460`.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
