# Build the converter's trial-run tree — the converted project built in a temporary folder

## ID
0437

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

**Phase 4 — the converter, trial runs only** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **Trial runs only — no project is changed in this phase** (ADR-052 D9 phase 4, D8). The converter's contract is D8, items 1–9; the reason it is paranoid is commit `331f298`, which wrote the wrong status into 3 of ~80 done briefs and went unnoticed for two months (decision document §6). ⛔ Never run anything from this phase with write access against a real project's tree.

D8 items 2 and 4: the trial run builds the **converted tree in a temporary folder** and writes **nothing** in the project. It changes no meaning:

- brief text kept **byte-for-byte**; only `## ID`, `## Sprint`, `## Priority`, `## Status`, `## Owner` move into front matter;

- each board row's text goes word-for-word into the task's `legacy-board-notes.md` with source board, line and hash (Q2); each board's non-table text becomes the sprint's body; old board files go unchanged into `ai-agents/legacy-boards/`, read by no tool (Q2);

- free-text `worklog.md` → `worklog-legacy.md`, word for word (Q5); prose "Depends on" stays text (Q6);

- **past closes keep what they said** — legacy `✅ Done` stays owner-verified, legacy agent-closed stays agent-closed, both with door = `legacy`;

- **default priority: proposed `medium`** for every converted task, existing order carried into `rank` — ⏸ **A3: not ruled**; it is a decision the report puts to the owner (`0438`), never applied silently.

## What to build

1. Build the converted tree from `0435`'s facts in a temporary folder, in the store's format from phase 3.
2. Two-step shape ready for apply (`0440`): folder moves first, then content (D8 item 6).

## Verification steps

1. Fixture tests for each rule above.
2. On fkit's tree: the temporary tree is produced and `git status` in the project is unchanged.

## Notes

- **Depends on:** [`0436`](../0436-make-the-converter-refuse-to-start-or-to-guess-preconditions-and-ambiguity-refusals/brief.md), and the phase-3 store format: [`0427`](../0427-add-the-close-record-and-the-stores-close-rules-producer-only-closes-reasons-owner-verified-only-from-the-page/brief.md) (close record), [`0429`](../0429-keep-sprint-membership-on-the-task-only-in-sprint-n-folders-with-the-sprints-task-list-shown-not-stored/brief.md) (sprint folders), [`0431`](../0431-add-ai-agents-board-json-settings-and-the-data-format-number-the-board-refuses-to-write-past/brief.md) (`board.json`). Hard.
- **Blocks:** [`0438`](../0438-write-the-converters-trial-run-report-the-page-the-owner-reads-before-anything-is-applied/brief.md), [`0439`](../0439-run-a-copy-of-fkits-corpus-on-the-fkit-ified-board-the-phase-3-gate/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 4):** The owner reads fkit's trial-run report; every refusal explained; the default-priority rule confirmed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
