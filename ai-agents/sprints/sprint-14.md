# Sprint 14 — AI-Board phase 1 of fkit's plan: port aiboard to Node in `board/` (ADR-052 phase 2), gated by `0423`

> ## 🔲 Backlog — 2026-10-20.
>
> **Not started.** Starting this sprint — and each of its tasks — is the owner's word, and has **not**
> been given. Every brief carries ADR-052's ⛔ *"Do not start without the owner's specific word"*;
> being on this board is not that word.
>
> **Authority.** This board exists by **owner rulings given 2026-10-20 via `AskUserQuestion` in a live
> `fkit lead` session**, relayed verbatim into a spawned `fkit-producer` that has **no owner channel**
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
>
> | # | Owner's words | What it settled |
> |---|---|---|
> | A1 | Via `AskUserQuestion`, 2026-10-20, `fkit lead` session — on the AI-Board tasks. Selected option text, verbatim: *"New sprint after 13 (Recommended)"* (description he saw: *"When Sprint 13 ends, producer plans Sprint 14 with phase 1 (0417–0423), briefs checked vs ADR-057. Knock-on: producer checks dependents (e.g. 0405) when placing."*) | This board: number `14`, holding `0417`–`0423`, briefs checked against ADR-057 |
> | A2 | Via `AskUserQuestion`, 2026-10-20, same session — question as shown: *"Sprint 13 is all done. Close it now?"* Selected option text, verbatim: *"Close it, then plan AI-Board sprint (Recommended)"* (description he saw: *"Producer runs /fkit-sprint-done on Sprint 13, then drafts the next sprint with AI-Board phase 1 (0417–0423), briefs checked vs ADR-057. Knock-on: none (checked); Sprint 12 stays paused."*) | Sprint 13 closed first ([archived](done/sprint-13.md)); this board drafted after it. [Sprint 12](sprint-12.md) stays `🔄 In progress`, paused, untouched |
>
> ⚠️ **"Phase 1" in the owner's words = ADR-052's phase 2.** The owner's rulings call `0417`–`0423`
> "AI-Board phase 1" — the first phase fkit itself builds. In
> [ADR-052](../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)'s
> numbering they are **phase 2** (port to Node); ADR-052's phase 1 is the external T-023 fix in the
> Python aiboard (below). Same tasks, two numberings.
>
> ⚠️ **What nobody ruled** — the `P1`–`P7` ranks. They are the dependency order of the briefs
> (`0417` → `0418` → `0419` / `0420` → `0421` / `0422` → `0423`), tie-broken by task id, not an owner
> choice.
>
> ⚠️ **`🔲 Backlog` and `🔄 In progress` on line 3 are the producer's to set by hand. `✅ Done` and
> `⛔ Cancelled` are settable only by `/fkit-sprint-done` and `/fkit-sprint-cancelled`, producer-only**
> ([ADR-047](../knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md);
> [`sprint-status-vocabulary.md`](../knowledge-base/conventions/sprint-status-vocabulary.md)).

## 🎯 The goal

**aiboard ported to Node in `board/`, faithful to aiboard's format, and proven equal to the Python
reference.** ADR-052 D9 phase 2's gate: *"All ported tests green; output identical to the Python
reference on the corpus; T-021/T-022 tests pass."* — ⚠️ the *"ported tests"* half of that gate is in
question under ADR-057; see *Notes for the driver*.

**Success:** all seven rows below closed, with `0423`'s harness reporting zero differences. A gate met
means ADR-052's next phase may be **put to** the owner — ⛔ not that it starts.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | P1 | **Port aiboard's model and front-matter layer to Node in `board/`, tests first** *(Pulled from the Backlog board 2026-10-20 by owner rulings A1/A2. ⛔ Hard-blocked by ADR-052 phase 1's gate — external, `aiboard-lead`'s T-023 fix in the aiboard repository; no fkit record shows it met. ⚠️ ADR-057: planned tests need the owner's OK per file, and sit outside D1's fence as written — see the brief's dated note. ⛔ Do not start without the owner's specific word. Owner `fkit-coder`)* | [`0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first`](../tasks/backlog/0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first/brief.md) |
| 🔲 Backlog | P2 | **Port aiboard's task store to Node, with cross-process locking** *(Pulled 2026-10-20, A1/A2. Depends on `0417` (P1, this sprint). ⚠️ ADR-057 dated note in the brief. ⛔ Do not start without the owner's specific word. Owner `fkit-coder`)* | [`0418-port-aiboards-task-store-to-node-with-cross-process-locking`](../tasks/backlog/0418-port-aiboards-task-store-to-node-with-cross-process-locking/brief.md) |
| 🔲 Backlog | P3 | **Port aiboard's sprints to Node, faithful to aiboard's format** *(Pulled 2026-10-20, A1/A2. Depends on `0418` (P2, this sprint). ⚠️ ADR-057 dated note in the brief. ⛔ Do not start without the owner's specific word. Owner `fkit-coder`)* | [`0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format`](../tasks/backlog/0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format/brief.md) |
| 🔲 Backlog | P4 | **Build T-021's index-once-per-read into the Node store, with its reproduction as a test** *(Pulled 2026-10-20, A1/A2. Depends on `0418` (P2, this sprint). ⚠️ ADR-057 dated note in the brief (the test file and the 2-min budget). ⛔ Do not start without the owner's specific word. Owner `fkit-coder`)* | [`0420-build-t-021s-index-once-per-read-into-the-node-store-with-its-reproduction-as-a-test`](../tasks/backlog/0420-build-t-021s-index-once-per-read-into-the-node-store-with-its-reproduction-as-a-test/brief.md) |
| 🔲 Backlog | P5 | **Port aiboard's command line to Node, including the terminal kanban view and `--json`** *(Pulled 2026-10-20, A1/A2. Depends on `0419` (P3, this sprint). ⚠️ ADR-057 dated note in the brief. ⛔ Do not start without the owner's specific word. Owner `fkit-coder`)* | [`0421-port-aiboards-command-line-to-node-including-the-terminal-kanban-view-and-json`](../tasks/backlog/0421-port-aiboards-command-line-to-node-including-the-terminal-kanban-view-and-json/brief.md) |
| 🔲 Backlog | P6 | **Port aiboard's web server and page to Node with T-022 closed and concurrent writes kept in order** *(Pulled 2026-10-20, A1/A2. Depends on `0419` (P3, this sprint). ⚠️ ADR-057 dated note in the brief. ⛔ Q16: fixture trees only. ⛔ Do not start without the owner's specific word. Owner `fkit-coder`)* | [`0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order`](../tasks/backlog/0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order/brief.md) |
| 🔲 Backlog | P7 | **Prove the Node port matches the Python reference on fkit's corpus — the phase-2 gate** *(Pulled 2026-10-20, A1/A2. Depends on `0420`, `0421`, `0422` (P4–P6, this sprint) and ADR-052 phase 1's gate (external). The gate of this sprint. ⚠️ ADR-057 dated note in the brief. ⛔ Do not start without the owner's specific word. Owner `fkit-coder`)* | [`0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate`](../tasks/backlog/0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate/brief.md) |

## ⚠️ Notes for the driver

- **Not started.** The owner's word to start is needed for the sprint and for each task (ADR-052).
- ⛔ **External gate before `0417` and `0423`: ADR-052 phase 1.** `aiboard-lead` fixes T-023 in the
  Python aiboard and runs fkit's real briefs through it (owner ruling Q11 — `aiboard-lead`'s last
  task; fkit files no task for it and never writes that repository). Its gate — *"Python round-trips
  the whole corpus unchanged"* — must be met, and phase 2 then put to the owner, before `0417` starts.
  **No fkit record found on 2026-10-20 says it is met** — confirm with the owner before starting.
- ⚠️ **ADR-057 check, 2026-10-20 — one scope question for the owner before any build.** Every brief
  here was written 2026-09-30, before [ADR-057](../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
  (accepted 2026-10-19). Two things it changes:
  1. **Growth stop (D2.1).** Every new test file — the ~52 ported aiboard tests, the T-021 / T-022
     reproductions, the concurrency tests — needs the owner's OK, file by file. A plan he approves
     counts only for the files it names; an agent's plan-review APPROVE is not his OK. Each brief now
     carries a dated note saying so.
  2. **The fence (D1) — a real scope question, not settled here.** D1 lets a test cover only a
     **shipped** script: the launcher / init / hooks, or a shipped skill executable — *"these four
     [exceptions], no others"*. `board/` does not ship in this phase (`0417`: *"nothing ships yet
     (`install.sh` is phase 5)"*) and is in neither list. So the phase's *tests first* method and
     ADR-052's gate (*"all ported tests green"*) sit **outside the fence as written**. Also open: the
     default `npm test` glob (`test/*.test.js`) does not reach `test/board/`, so where these tests run,
     and the 2-min budget (D10), follow from the same ruling. Briefs are **not** rewritten; the
     question is listed for the owner. Do not build tests in `test/board/` until he rules.
- **Every dependency is inside this sprint**, except ADR-052 phase 1 (external, no fkit task id).
- **Knock-on of this placement (checked 2026-10-20):** `0424` (phase 3) and `0435` (phase 4) depend on
  `0423` and stay on the Backlog board — they now wait on Sprint 14. `0405` is **not** a dependent (it
  waits on `0433` / `0434`, phase 3, both on the Backlog board — unchanged). No sprint task waits on a
  later sprint.
- **Two sprints may be open** — this one (`🔲 Backlog`) and the paused [Sprint 12](sprint-12.md)
  (`🔄 In progress`). That is legal (ADR-047).

## Notes

- **2026-10-20 — board created, not started,** on A1/A2 by a spawned `fkit-producer` with no owner
  channel: `0417`–`0423` pulled from the [Backlog board](backlog.md) as `P1`–`P7` (three edits each: row
  here, `➡️ Moved to [Sprint 14](sprint-14.md) — priority P<n>` there, the brief's `## Sprint` and
  `## Priority`), plus a dated *ADR-057 check* note in each brief. Statuses stay `🔲 Backlog`. Sprint 12
  not touched.
