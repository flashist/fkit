# Make the converter refuse to start, or to guess — preconditions and ambiguity refusals

## ID
0436

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

D8 items 1 and 3. **Refuses to start** unless the git tree is clean, no ship loop is running and the project is not already converted. **Refuses anything ambiguous; never guesses** — e.g. `0014` (brief says Backlog, folder says done), `0004` (no board row), two live rows for one task, two boards claiming one sprint, a status outside the vocabulary. The owner fixes those in the old format first, then re-runs.

⛔ **This unit refuses; it never repairs** — `0014` and `0004` are reported, not fixed here.

> ⏱ **Note, 2026-10-02 (spawned `fkit-producer`, at `fkit-lead`'s direction; text above unchanged).**
> `0014`'s example has changed in part:
> - **The folder/status mismatch is gone.** On the owner's ruling of 2026-10-02 (*"Yes, status field
>   only — The test data 0296/0406 rely on is the missing row, which stays; only the wrong status is
>   corrected."*) its `## Status` now reads plain `✅ Done` — see the `## Status correction — 2026-10-02`
>   section of [`0014`'s brief](../../done/0014-align-conventions-readme-enforcement-item-live-vs-scaffold/brief.md).
> - **Its missing board row still exists, and stays on purpose** — it is the specimen for
>   [`0296`](../0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md) and
>   [`0406`](../0406-build-the-no-board-row-check-in-the-test-suite-with-a-dated-two-task-allowlist/brief.md).
>   So on fkit's tree `0014` now falls under the **no board row** class (like `0004`), not the
>   brief-vs-folder status class.

## What to build

1. Precondition checks with clear messages.
2. Each ambiguity class above as a named refusal, listed (not aborting on the first) so one run shows them all.

## Verification steps

1. Fixture tests: one per precondition and per ambiguity class.
2. On fkit's tree it names `0014` and `0004` among its refusals (or says why they no longer apply) — pasted, not described.

## Notes

- **Depends on:** [`0435`](../0435-build-the-converters-reader-every-tasks-and-sprints-facts-from-a-markdown-project-read-with-fkits-current-tools/brief.md). Hard.
- **Blocks:** [`0437`](../0437-build-the-converters-trial-run-tree-the-converted-project-built-in-a-temporary-folder/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 4):** The owner reads fkit's trial-run report; every refusal explained; the default-priority rule confirmed. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
