# Pilot — convert fkit itself (trial run, owner reads, apply, owner commits)

## ID
0458

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

Phase 6 (D9): trial run → **the owner reads it** → apply → **he commits**. Mid-sprint conversion is allowed; recommended between tasks, with no ship loop running; restart open sessions after (D8). From here, **in fkit**, the page-only owner-verified rule, the end of the line-3 banner grammar and the end of the read-only reader take effect (ADR-052 *Read first* item 2).

## What to build

1. Fresh trial run on fkit's current tree; put the report to the owner.
2. On his word, apply (`0440`); the owner commits — ⛔ never an agent.
3. Restart open sessions; record the conversion commit id in the worklog.

## Verification steps

1. The self-check (`0407`) passes on the applied tree — pasted.
2. The owner's approval of the report and his commit are recorded (who, when, commit id).
3. `fkit board check` clean and `node --test test/*.test.js` green on the converted tree.

## Notes

- **Depends on:** [`0441`](../0441-run-the-converters-trial-run-on-fkit-and-put-its-report-to-the-owner-the-phase-4-gate/brief.md) (phase 4's gate), [`0440`](../0440-build-the-converters-apply-step-renames-first-content-second-tested-on-fixtures-only/brief.md), and phase 5 complete: [`0446`](../0446-check-each-projects-data-format-at-launch-and-offer-the-conversion-trial-run-first/brief.md), [`0447`](../0447-add-the-identity-hook-a-fkit-board-writes-by-must-be-the-calling-agents-real-role/brief.md), [`0449`](../0449-rewire-fkit-sprint-done-and-fkit-sprint-cancelled-to-sprint-close-carry-to/brief.md), [`0450`](../0450-rewire-fkit-task-brief-to-file-through-the-board/brief.md), [`0452`](../0452-rewrite-the-throughput-counter-over-the-board/brief.md), [`0453`](../0453-rewire-both-ship-loops-to-start-block-and-log-through-the-board/brief.md), [`0454`](../0454-move-the-sprint-keyed-review-ledgers-out-of-sprints/brief.md), [`0456`](../0456-give-new-projects-a-board-json-and-the-status-folders-at-setup/brief.md), [`0457`](../0457-reword-fkits-rules-conventions-and-agent-prompts-for-the-board-within-the-rules-block-budget/brief.md). Hard.
- **Blocks:** [`0459`](../0459-pilot-run-real-sprints-on-the-converted-fkit-and-ask-the-owner-whether-it-works-the-phase-6-gate/brief.md), [`0460`](../0460-re-sync-the-wiki-after-fkits-conversion/brief.md), [`0416`](../0416-revisit-whether-fkit-needs-a-tripwire-hook-against-hand-moved-task-folders/brief.md) (real use starts here)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 6):** The owner says it works. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
