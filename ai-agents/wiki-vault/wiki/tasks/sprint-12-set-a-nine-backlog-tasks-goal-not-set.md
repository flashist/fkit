# Sprint 12 — goal not yet set: the nine "Set A" Backlog tasks plus the plan-review trial

**Source**: `ai-agents/sprints/sprint-12.md`
**Status**: in-progress — line-3 banner `🔄 In progress — 2026-10-15` (read at `5ccf2c2`, 2026-10-23); paused by the owner from 2026-10-19 while Sprints 13 and 14 ran
**Sprint/Tag**: Sprint 12 · opened 2026-10-15 · driven by `/fkit-sprint-ship-loop --plan-review` from `fkit lead` sessions

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). The board is still open, so this page describes it as read at `5ccf2c2`.

## Goal
**Not set** — the H1 is a producer placeholder. The board exists by owner rulings of 2026-10-15, relayed by `fkit-lead` to a spawned producer with no owner channel:

| # | Ruling | What it settled |
|---|---|---|
| R1 | Typed: *"1. Move the 0474 to the next Sprint 11. 2. Close Sprint 10. 3. Start planning Sprint 11 …"* | a next sprint, holding `0474`, in planning |
| R2 | *"Sprint 12 (Recommended)"* | the number — `11` was already the closed aiboard-convergence sprint |
| R3 | *"Set A, 9 tasks (Recommended)"* — `0516, 0385, 0284, 0334, 0507, 0510, 0508, 0503, 0500` | the nine rows, `P1`–`P9` in the relayed run order |
| R4 | *"Fix it (Recommended)"* | `0474`'s Backlog-board row points here, `P10` |
| R5 | *"Start Sprint 12 and drive it (Recommended)"*, asked by the `--plan-review` run | started; also the word to start `0516` |

⚠️ **Unruled, per the banner:** the placeholder title; `0474`'s first rank `P1`, and its re-rank to `P10` by the lead's instruction so the loop would not pick the owner-paced trial first.

## Key Changes
| Rank | Task | State at `5ccf2c2` |
|---|---|---|
| P1 | `0516` stale ADR-019 / `fkit-coder.md` cites | ✅ [[tasks/fix-the-stale-adr-019-and-fkit-coder-line-cites-found-during-0496]] |
| P2 | `0385` task-keyed Codex prompt path | ✅ [[tasks/give-the-codex-adversarial-prompt-a-task-keyed-path]] |
| P3 | `0284` bound the update check's git path | ✅ [[tasks/bound-the-update-checks-git-path-which-has-no-deadline-and-hangs]] |
| P4 | `0334` launcher agents fail-safe | ✅ [[tasks/fix-the-launchers-symlink-blind-agents-fail-safe]] |
| P5–P7 | `0507`, `0510`, `0508` code-comment cleanup | ✅ [[tasks/clean-up-existing-code-comments-pilot-launcher-init-heal-0507-0508-0510]] |
| P8 | `0503` re-measure the test run time | ⛔ cancelled 2026-10-20 — [[tasks/the-2026-10-20-adr-057-test-task-cancellations]] |
| P9 | `0500` sprint-retro research | ✅ [[tasks/research-and-decide-how-fkit-runs-a-sprint-retrospective]] |
| P10 | `0474` plan-review trial | 🔄 **In progress** on this board's row — owner-paced and open-ended |

All closes carry `(agent-closed — not owner-verified)`.

## Outcome
- **9 of 10 rows closed** (8 ✅, 1 ⛔); `0474` open. ⚠️ **Drift seen, not repaired:** the board's driver notes still say *"`0474` stays `🔲 Backlog` until the owner gives his specific word"*, while its row reads `🔄 In progress`. Which is current is the producer's to reconcile.
- **Paused, not closed:** the owner paused Sprint 12 on 2026-10-19 for the test reset (Sprint 13) and kept it paused through Sprint 14. Both later boards record it as `🔄 In progress`, untouched. With two sprints `🔄 In progress`, `select-active` picks the lowest-ordered (Sprint 12) unless a banner carries `⭐ ACTIVE BOARD` — none does (ADR-047).
- **Plan review:** eight of this board's tasks (`0284`, `0334`, `0385`, `0503`, `0507`, `0508`, `0510`, `0516`) have plan-review trial logs, back-filled 2026-10-20 for `0474` together with Sprint 13's five — see [[tasks/build-the-opt-in-plan-review-step-off-by-default]].

## Related
- [[tasks/sprint-10-the-0472-0482-batch]] — the board `0474` was carried from
- [[tasks/sprint-13-reset-fkits-tests-to-shipped-script-behaviour]] · [[tasks/sprint-14-port-aiboard-to-node-adr-052-phase-2]] — the two sprints run while this one was paused
- [[decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default]] — the `--plan-review` flag
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]] — two `🔄 In progress` sprints at once
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board the nine came from
