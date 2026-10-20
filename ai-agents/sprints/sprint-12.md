# Sprint 12 — goal not yet set

> ## 🔄 In progress — 2026-10-15.
>
> **Authority.** This board exists by **owner instructions and a ruling given 2026-10-15 in a
> `fkit lead` session**, relayed into a spawned `fkit-producer` that has **no owner channel**
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
>
> | # | Owner's words | What it settled |
> |---|---|---|
> | R1 | Typed by the owner, 2026-10-15, relayed verbatim by `fkit-lead`: *"Ok, got you. I suggest doing the next things: 1. Move the 0474 to the next Sprint 11. 2. Close Sprint 10. 3. Start planning Sprint 11 - the producer should review tasks in the backlog and suggest which one should be moved to Sprint 11."* | A next sprint exists, holds `0474`, and is **in planning** — hence `🔲 Backlog` on line 3, not `🔄 In progress` (*"start planning"*, not *"start the sprint"*) |
> | R2 | Via `AskUserQuestion`, 2026-10-15, `fkit lead` session — selected option text, verbatim: *"Sprint 12 (Recommended)"* (description he saw: *"Next free number. Producer creates sprint-12.md (not started), closes Sprint 10, and 0474 moves to Sprint 12. Knock-on: none."*) | The number `12`. `Sprint 11` was already taken — the aiboard-convergence sprint, closed 2026-09-30, archived at [`done/sprint-11.md`](done/sprint-11.md) — so the owner's *"Sprint 11"* in R1 reads as *"the next sprint"*, and this is it |
> | R3 | Via `AskUserQuestion`, 2026-10-15, `fkit lead` session — selected option text, verbatim: *"Set A, 9 tasks (Recommended)"* (description he saw: *"0516, 0385, 0284, 0334, 0507, 0510, 0508, 0503, 0500. Knock-on: 0509, 0511–0515 (Backlog) wait on 0507."*) | The nine tasks pulled from the [Backlog board](backlog.md), ranked `P1`–`P9` in the run order the lead relayed with the set. All stay `🔲 Backlog` — placing a task is not the owner's word to start it |
> | R4 | Via `AskUserQuestion`, 2026-10-15, `fkit lead` session — selected option text, verbatim: *"Fix it (Recommended)"* (description he saw: *"A producer changes that one line to \"➡️ Moved to Sprint 12, priority P10\". The Sprint 10 history stays on the closed board. Knock-on: none."*) | `0474`'s row on the [Backlog board](backlog.md) now points here, `— priority P10` |
> | R5 | Via `AskUserQuestion`, 2026-10-15, `fkit lead` session running `/fkit-sprint-ship-loop --plan-review`, relayed verbatim to a spawned `fkit-producer` — question: *"No sprint is marked started. How should this --plan-review run proceed?"*; selected option text, verbatim: *"Start Sprint 12 and drive it (Recommended)"* (description he saw: *"A producer marks Sprint 12 🔄 In progress (goal still unset), then I drive 0516 first with plan review on."*) | The sprint is **started** — line 3 now reads `🔄 In progress` (R1's `🔲 Backlog` reading is superseded). The goal stays **not set**. It is also the owner's word to start `0516` (its brief's *"do not start without the owner's specific word"*), now `🔄 In progress`. Every other row stays as it was — starting the sprint is not his word to start `0474` |
>
> ⚠️ **What this producer chose that nobody ruled** — the title (a placeholder until the owner sets a
> goal) and `0474`'s rank `P1` (it is the only row; it arrived by append when `/fkit-sprint-done`
> closed Sprint 10).
>
> ⚠️ **Also unruled, 2026-10-15:** `0474` re-ranked `P1` → `P10` (last) by `fkit-lead`'s instruction
> when R3's nine rows came in. Its reason: the sprint loop takes eligible tasks in priority order, so at
> `P1` every run would pick the owner-paced `0474` first and stop to ask. The `P1` it replaced was
> unruled too. The `P1`–`P9` run order of R3's rows was relayed with the set, not chosen here.
>
> ⚠️ **`🔲 Backlog` and `🔄 In progress` on line 3 are the producer's to set by hand. `✅ Done` and
> `⛔ Cancelled` are settable only by `/fkit-sprint-done` and `/fkit-sprint-cancelled`, producer-only**
> ([ADR-047](../knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md);
> [`sprint-status-vocabulary.md`](../knowledge-base/conventions/sprint-status-vocabulary.md)).

## 🎯 The goal

**Not set yet.** R1's item 3 asks the producer to review the Backlog board and suggest which tasks to
pull in; that proposal goes to the owner, and **nothing is pulled until he picks**. Until then this
board holds only the row carried over from Sprint 10.

*2026-10-15, later: the owner picked R3's nine tasks; they are on the board below. The goal is still
not set.*

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done (agent-closed — not owner-verified) | P1 | **Fix the stale ADR-019 and `fkit-coder.md` line cites found during `0496`** *(Pulled from the Backlog board 2026-10-15 by owner ruling R3. Depends on nothing. Owner `fkit-coder`)* | [`0516-fix-the-stale-adr-019-and-fkit-coder-line-cites-found-during-0496`](../tasks/done/0516-fix-the-stale-adr-019-and-fkit-coder-line-cites-found-during-0496/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P2 | **Give the Codex adversarial prompt a task-keyed path — two concurrent reviews silently share one file today** *(Pulled from the Backlog board 2026-10-15 by owner ruling R3. Depends on nothing. Owner `fkit-coder`)* | [`0385-give-the-codex-adversarial-prompt-a-task-keyed-path`](../tasks/done/0385-give-the-codex-adversarial-prompt-a-task-keyed-path/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P3 | **Bound the update check's git path — `_fkit_remote_sha` has no deadline and hangs** *(Pulled from the Backlog board 2026-10-15 by owner ruling R3. Depends on nothing. Edits `claude/fkit-claude.sh` — run before `0508`. Owner `fkit-coder`)* | [`0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs`](../tasks/done/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P4 | **Fix the launcher's symlink-blind agents fail-safe** *(Pulled from the Backlog board 2026-10-15 by owner ruling R3. Depends on nothing. Edits `claude/fkit-claude.sh` — run before `0508`. Owner `fkit-coder`)* | [`0334-fix-the-launchers-symlink-blind-agents-fail-safe`](../tasks/done/0334-fix-the-launchers-symlink-blind-agents-fail-safe/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P5 | **Pilot: clean up code comments in the hook scripts and `skills-for-role.sh`, and set the method for the series** *(Pulled from the Backlog board 2026-10-15 by owner ruling R3. Its `0506` dependency is done. Owner `fkit-coder`)* | [`0507-pilot-clean-up-code-comments-in-the-hook-scripts-and-skills-for-role`](../tasks/done/0507-pilot-clean-up-code-comments-in-the-hook-scripts-and-skills-for-role/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P6 | **Clean up code comments in the `/fkit-heal` scripts and the throughput counter** *(Pulled from the Backlog board 2026-10-15 by owner ruling R3. Owner `fkit-coder`)* | [`0510-clean-up-code-comments-in-the-heal-scripts-and-the-throughput-counter`](../tasks/done/0510-clean-up-code-comments-in-the-heal-scripts-and-the-throughput-counter/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P7 | **Clean up code comments in the launcher and init scripts** *(Pulled from the Backlog board 2026-10-15 by owner ruling R3. Run after `0284` and `0334` — all three edit `claude/fkit-claude.sh`. Owner `fkit-coder`)* | [`0508-clean-up-code-comments-in-the-launcher-and-init-scripts`](../tasks/done/0508-clean-up-code-comments-in-the-launcher-and-init-scripts/brief.md) |
| ⛔ Cancelled (agent-closed — not owner-verified) (2026-10-20) — superseded by ADR-057 (test-scope reset): `0530` re-measures the suite after `0529`'s cut. Owner Q4 ruling 2026-10-20 at `0529`'s plan gate, verbatim *"Producer's proposals (Recommended)"* | P8 | **Re-measure the full test run time, locally and on CI, and show both in CONTRIBUTING** *(Pulled from the Backlog board 2026-10-15 by owner ruling R3. Depends on nothing. Near the end so it measures the grown suite. Owner `fkit-coder`)* | [`0503-re-measure-the-full-test-run-time-locally-and-on-ci-and-show-both-in-contributing`](../tasks/cancelled/0503-re-measure-the-full-test-run-time-locally-and-on-ci-and-show-both-in-contributing/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P9 | **Research and decide how fkit runs a sprint retrospective, and how the lead suggests one** *(Pulled from the Backlog board 2026-10-15 by owner ruling R3. Depends on nothing. Research-and-decide; ends in an owner decision. Owner `fkit-producer`)* | [`0500-research-and-decide-how-fkit-runs-a-sprint-retrospective`](../tasks/done/0500-research-and-decide-how-fkit-runs-a-sprint-retrospective/brief.md) |
| 🔲 Backlog | P10 | **Trial plan review through the owner's own sprint-loop runs, then put default / optional / drop to him** *(Carried over 2026-10-15 from [Sprint 10](done/sprint-10.md), where it was `P10`, by `/fkit-sprint-done` on owner ruling R1; arrived as `P1`, re-ranked `P10` the same day — unruled, see the banner. Its dependency `0473` is done. ⚠️ Owner-paced and open-ended — see the note below. Owner `fkit-producer`)* | [`0474-trial-plan-review-on-3-to-5-real-tasks-and-put-default-optional-or-drop-to-the-owner`](../tasks/backlog/0474-trial-plan-review-on-3-to-5-real-tasks-and-put-default-optional-or-drop-to-the-owner/brief.md) |

## ⚠️ Notes for the driver

- **Run order inside R3's rows — ordering choices, not dependencies** (from the producer that proposed
  the set; no `Depends on:` line records them):
  - `0284` and `0334` both edit `claude/fkit-claude.sh`, and `0508` rewrites that file's comments —
    **run `0508` after both**, never alongside either.
  - **Run `0503` near the end**, so it measures the suite as this sprint grows it.
  - `0510` and `0508` **do** depend on `0507` (`Depends on:` in their briefs) — `0507` is in this
    sprint at `P5`, so neither waits on a later sprint.

- **`0474` stays `🔲 Backlog` until the owner gives his specific word to start the trial.** Its brief
  says *"Do not start without the owner's specific word. Being pullable on the board is not his
  word."* Moving it to this board is not that word either.
- **`0474` is owner-paced, not loop-shippable in the usual sense.** The owner runs the trial through
  his own `/fkit-sprint-ship-loop` runs, *"as often as he needs, with no task count"*; it ends when he
  says he has seen enough. Expect it to stay open while other rows close.
- **This board is `🔄 In progress` since 2026-10-15 (R5)**, so `/fkit-status` and `select-active`
  report it as active. Before R5 it was `🔲 Backlog` and was not.

## Notes

- **2026-10-15 — board created** by a spawned `fkit-producer` on R1 + R2, empty except for the row
  `/fkit-sprint-done` then relocated from Sprint 10 the same day (agent-closed — not owner-verified).
- **2026-10-15 — nine tasks pulled** from the [Backlog board](backlog.md) on R3 as `P1`–`P9` (four
  edits each: row here, `➡️ Moved to [Sprint 12](sprint-12.md) — priority P<n>` there, the brief's
  `## Sprint` and `## Priority`); `0474` re-ranked `P1` → `P10` (unruled, see the banner); `0474`'s
  Backlog-board marker repointed here on R4. By a spawned `fkit-producer` with no owner channel.
- **2026-10-15 — sprint started** on R5: line 3 `🔲 Backlog` → `🔄 In progress`, goal still not set;
  H1 placeholder `in planning (goal not yet set)` → `goal not yet set` (unruled wording, so the title
  stops saying *"in planning"*). `0516` marked `🔄 In progress` here and in its brief — the sprint
  loop's *mark in progress before driving* step. No other row touched. By a spawned `fkit-producer`
  with no owner channel.
