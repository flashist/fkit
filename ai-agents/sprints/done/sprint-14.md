# Sprint 14 — AI-Board phase 1 of fkit's plan: port aiboard to Node in `board/` (ADR-052 phase 2), gated by `0423`

> ## ✅ Done — 2026-10-23. Closed by /fkit-sprint-done (agent-closed — not owner-verified).
>
> **Started 2026-10-20 on the owner's word (ruling A3 below).** The banner was flipped from
> `🔲 Backlog` by hand (ADR-047) by a spawned `fkit-producer` with no owner channel, on A3 as relayed
> verbatim by `fkit-lead`. A3 is the owner's word for **ADR-052 phase 2 (`0417`–`0423`) and the interim
> read-only board (`0536`) only** — ⛔ it is **not** his word for phases 3+ (`0424` onward), each of
> which still starts only on its own word. Until 2026-10-20 this paragraph read *"Not started"*.
>
> **Authority.** This board exists by **owner rulings given 2026-10-20 via `AskUserQuestion` in a live
> `fkit lead` session**, relayed verbatim into a spawned `fkit-producer` that has **no owner channel**
> ([ADR-021](../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
>
> | # | Owner's words | What it settled |
> |---|---|---|
> | A1 | Via `AskUserQuestion`, 2026-10-20, `fkit lead` session — on the AI-Board tasks. Selected option text, verbatim: *"New sprint after 13 (Recommended)"* (description he saw: *"When Sprint 13 ends, producer plans Sprint 14 with phase 1 (0417–0423), briefs checked vs ADR-057. Knock-on: producer checks dependents (e.g. 0405) when placing."*) | This board: number `14`, holding `0417`–`0423`, briefs checked against ADR-057 |
> | A2 | Via `AskUserQuestion`, 2026-10-20, same session — question as shown: *"Sprint 13 is all done. Close it now?"* Selected option text, verbatim: *"Close it, then plan AI-Board sprint (Recommended)"* (description he saw: *"Producer runs /fkit-sprint-done on Sprint 13, then drafts the next sprint with AI-Board phase 1 (0417–0423), briefs checked vs ADR-057. Knock-on: none (checked); Sprint 12 stays paused."*) | Sprint 13 closed first ([archived](sprint-13.md)); this board drafted after it. [Sprint 12](sprint-12.md) stays `🔄 In progress`, paused, untouched |
> | A3 | Via `AskUserQuestion`, 2026-10-20, same session — question as shown: *"Go ahead with this plan?"* Selected option text, verbatim: *"Yes, all of it (Recommended)"* (description he saw: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*). The plan, as `fkit-lead` put it in chat just before (quoted): *"1. Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board` command. This gets your "everyone has the board" goal in one task instead of 44. It needs Node, but only for this one command. 2. Sprint 14, 7 tasks: rebuild aiboard inside fkit in Node, copied exactly from the fixed Python version. 3. Later steps, about 37 tasks: teach the board fkit's task format and hook it into fkit's tools. After that, every user gets the board with editing. Each step still comes to you first, as a simple yes/no. Saying yes also allows two things behind the scenes: - The board's code gets automated tests. One test file per task, up to 6, pre-approved now, so you won't be asked about each file. - The architect and producer write down your OK. I send aiboard-lead 4 small cleanups: ... Knock-on: the new task in step 1 goes into Sprint 14 on its own, with nothing waiting on it. No other task changes its dependencies."* | **D1** ADR-052 D9 phase 2 starts (`0417`–`0423`). **D2** ADR-057 D1's fence: the board's tests count. **D3** ADR-057 D2.1: up to **6** test files under `test/board/` pre-approved — one each for `0417`–`0422`; `0423`'s Python-vs-Node check is a one-off script, not a kept test; any other new test file still goes to the owner. **D4** the interim read-only board for every fkit user (`0536`, this board). ⛔ Not his word for phases 3+ |
>
> ⚠️ **"Phase 1" in the owner's words = ADR-052's phase 2.** The owner's rulings call `0417`–`0423`
> "AI-Board phase 1" — the first phase fkit itself builds. In
> [ADR-052](../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)'s
> numbering they are **phase 2** (port to Node); ADR-052's phase 1 is the external T-023 fix in the
> Python aiboard (below). Same tasks, two numberings.
>
> ⚠️ **What nobody ruled** — the `P1`–`P7` ranks. They are the dependency order of the briefs
> (`0417` → `0418` → `0419` / `0420` → `0421` / `0422` → `0423`), tie-broken by task id, not an owner
> choice. `0536`'s `P8` (added 2026-10-20) is **append rank** — see *Notes*; A3 placed it in this
> sprint but ruled no rank.
>
> ✅ **Dated note 2026-10-20 — ranks now owner-ruled: `0536` is `P1`, `0417`–`0423` are `P2`–`P8`.**
> A3's plan put `0536` as step 1, *"Now"*, before step 2 (Sprint 14's seven tasks) — his ruling that
> it runs first (see *Notes*). The order of `0417`–`0423` among themselves is unchanged and is still
> dependency order, not an owner choice. The paragraph above is left byte-identical.
>
> ⚠️ **`🔲 Backlog` and `🔄 In progress` on line 3 are the producer's to set by hand. `✅ Done` and
> `⛔ Cancelled` are settable only by `/fkit-sprint-done` and `/fkit-sprint-cancelled`, producer-only**
> ([ADR-047](../../knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md);
> [`sprint-status-vocabulary.md`](../../knowledge-base/conventions/sprint-status-vocabulary.md)).

## 🎯 The goal

**aiboard ported to Node in `board/`, faithful to aiboard's format, and proven equal to the Python
reference.** ADR-052 D9 phase 2's gate: *"All ported tests green; output identical to the Python
reference on the corpus; T-021/T-022 tests pass."* — ⚠️ the *"ported tests"* half of that gate is in
question under ADR-057; see *Notes for the driver*.

- **Dated note 2026-10-20 — started, and one task added (owner ruling A3).** The owner chose
  *"Yes, all of it (Recommended)"* — *"Ship the view-only board to every fkit user now, and start the
  Node rebuild (Sprint 14)."* (full quote in the A3 row above). So: (1) the *"ported tests"* question
  above is **ruled** — board tests count (ADR-057 D1), and one test file under `test/board/` per task
  `0417`–`0422` is pre-approved (D2.1), at most 6; (2) the interim task
  [`0536`](../../tasks/done/0536-ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board/brief.md)
  joins this sprint: ship today's read-only board reader to every fkit user through `fkit board`. It
  is **not** part of ADR-052 phase 2's gate and nothing waits on it. **Success** now reads: all
  **eight** rows closed, with `0423`'s harness reporting zero differences.

**Success:** all seven rows below closed, with `0423`'s harness reporting zero differences. A gate met
means ADR-052's next phase may be **put to** the owner — ⛔ not that it starts.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done (agent-closed — not owner-verified) | P1 | **Ship the read-only board reader to every fkit user via `fkit board`** *(Added 2026-10-20 out of band by owner ruling A3 (D4). Depends on nothing; blocks nothing. Re-ranked `P8` → `P1` 2026-10-20 on owner ruling A3 (plan step 1, *"Now"*) — see *Notes*. Rests on [ADR-058](../../knowledge-base/decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge.md) (interim reader ships; briefed as pending, now in the tree). Not part of phase 2's gate. Owner `fkit-coder`)* | [`0536-ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board`](../../tasks/done/0536-ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P2 | **Port aiboard's model and front-matter layer to Node in `board/`, tests first** *(Pulled from the Backlog board 2026-10-20 by owner rulings A1/A2. ADR-052 phase 1's gate (external, T-023) met 2026-10-20 — port source aiboard `a1592dc`. ADR-057: one test file under `test/board/` pre-approved (A3) — see the brief's dated notes. Owner's start word given 2026-10-20 (A3). Owner `fkit-coder`)* | [`0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first`](../../tasks/done/0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P3 | **Port aiboard's task store to Node, with cross-process locking** *(Pulled 2026-10-20, A1/A2. Depends on `0417` (P2, this sprint). ADR-057: one test file under `test/board/` pre-approved (A3). Owner's start word given 2026-10-20 (A3). Owner `fkit-coder`)* | [`0418-port-aiboards-task-store-to-node-with-cross-process-locking`](../../tasks/done/0418-port-aiboards-task-store-to-node-with-cross-process-locking/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P4 | **Port aiboard's sprints to Node, faithful to aiboard's format** *(Pulled 2026-10-20, A1/A2. Depends on `0418` (P3, this sprint). ADR-057: one test file under `test/board/` pre-approved (A3). Owner's start word given 2026-10-20 (A3). Owner `fkit-coder`)* | [`0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format`](../../tasks/done/0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P5 | **Build T-021's index-once-per-read into the Node store, with its reproduction as a test** *(Pulled 2026-10-20, A1/A2. Depends on `0418` (P3, this sprint). ADR-057: one test file under `test/board/` pre-approved (A3); ~~the 2-min budget is still open~~ — corrected 2026-10-20: ruled (runs inside `npm test`, within the 2-min budget; ADR-057 §D1's ⛔ note) — see the brief. Owner's start word given 2026-10-20 (A3). Owner `fkit-coder`)* | [`0420-build-t-021s-index-once-per-read-into-the-node-store-with-its-reproduction-as-a-test`](../../tasks/done/0420-build-t-021s-index-once-per-read-into-the-node-store-with-its-reproduction-as-a-test/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P6 | **Port aiboard's command line to Node, including the terminal kanban view and `--json`** *(Pulled 2026-10-20, A1/A2. Depends on `0419` (P4, this sprint). ADR-057: one test file under `test/board/` pre-approved (A3). Owner's start word given 2026-10-20 (A3). Owner `fkit-coder`)* | [`0421-port-aiboards-command-line-to-node-including-the-terminal-kanban-view-and-json`](../../tasks/done/0421-port-aiboards-command-line-to-node-including-the-terminal-kanban-view-and-json/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P7 | **Port aiboard's web server and page to Node with T-022 closed and concurrent writes kept in order** *(Pulled 2026-10-20, A1/A2. Depends on `0419` (P4, this sprint). ADR-057: one test file under `test/board/` pre-approved (A3). ⛔ Q16: fixture trees only. Owner's start word given 2026-10-20 (A3). Owner `fkit-coder`)* | [`0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order`](../../tasks/done/0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P8 | **Prove the Node port matches the Python reference on fkit's corpus — the phase-2 gate** *(Pulled 2026-10-20, A1/A2. Depends on `0420`, `0421`, `0422` (P5–P7, this sprint) and ADR-052 phase 1's gate (external — met 2026-10-20; Python reference aiboard `a1592dc`). The gate of this sprint. ADR-057: its Python-vs-Node check is a one-off script, not a kept test (A3). Owner's start word given 2026-10-20 (A3). Owner `fkit-coder`)* | [`0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate`](../../tasks/done/0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate/brief.md) |

## ⚠️ Notes for the driver

- **Started 2026-10-20 (A3).** The owner's word covers phase 2 (`0417`–`0423`) and `0536` only. ⛔ Phases
  3+ (`0424` onward) still need his word, each. *(Until 2026-10-20 this bullet read "Not started".)*
- ⛔ **External gate before `0417` and `0423`: ADR-052 phase 1.** `aiboard-lead` fixes T-023 in the
  Python aiboard and runs fkit's real briefs through it (owner ruling Q11 — `aiboard-lead`'s last
  task; fkit files no task for it and never writes that repository). Its gate — *"Python round-trips
  the whole corpus unchanged"* — must be met, and phase 2 then put to the owner, before `0417` starts.
  **No fkit record found on 2026-10-20 says it is met** — confirm with the owner before starting.
  - **Update 2026-10-20 — met, and put to the owner.** `fkit-lead` checked aiboard commit `a1592dc`
    (T-023 fixed; parent `0108027` still has the bug); the owner then gave the start word (A3). **Port
    source and Python reference: aiboard `a1592dc`, not `0108027`** — each brief carries a dated note.
- ⚠️ **ADR-057 check, 2026-10-20 — one scope question for the owner before any build.** Every brief
  here was written 2026-09-30, before [ADR-057](../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
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
  - **Ruled 2026-10-20 (A3).** D1: the board's tests count. D2.1: **one** test file under
    `test/board/` per task, for `0417`–`0422` only (at most 6), pre-approved; `0423`'s Python-vs-Node
    check is a one-off script, not a kept test. **Any other new test file still goes to the owner** —
    including any for `0536`. ⚠️ **Still not ruled:** how `test/board/` is run (the `npm test` glob
    does not reach it) and how it fits the 2-min budget (D10) — each task's plan says, and puts it to
    the owner if it changes the suite.
  - ✅ **Correction 2026-10-20 — the "still not ruled" line above is wrong; it was ruled, inside A3.**
    The architect's dated ⛔ note below [ADR-057](../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
    §D1 records the terms (option A, D2) that A3's *"Yes"* approved: `test/board/` tests run **inside
    the default `npm test`** — `0417` adds `test/board/*.test.js` to `package.json`'s `"test"`
    script — **within the 2-minute budget** (D10, unchanged), and the coder names any slow board test
    in the task's plan, before building it. The line above is left byte-identical; each of
    `0417`–`0422` carries the same dated correction.
- **Every dependency is inside this sprint**, except ADR-052 phase 1 (external, no fkit task id; met
  2026-10-20). `0536` depends on nothing and nothing depends on it.
- **Knock-on of this placement (checked 2026-10-20):** `0424` (phase 3) and `0435` (phase 4) depend on
  `0423` and stay on the Backlog board — they now wait on Sprint 14. `0405` is **not** a dependent (it
  waits on `0433` / `0434`, phase 3, both on the Backlog board — unchanged). No sprint task waits on a
  later sprint.
- **Knock-on of adding `0536` (checked 2026-10-20):** none. It names no `Depends on:` task, and no
  open task names it. `0443`, `0444` and `0467` (Backlog board) gain a dated note that `0536` ships /
  routes the reader first; their `Depends on:` lines are unchanged, so nothing new waits on this sprint.
- **Two sprints are open** — this one and the paused [Sprint 12](sprint-12.md), both `🔄 In progress`
  since 2026-10-20. That is legal (ADR-047). ⚠️ Where one board must be chosen, `select-active` picks
  the lowest-ordered one (Sprint 12) unless a banner carries `⭐ ACTIVE BOARD`; neither does — not set
  here, nobody ruled it.

## Notes

- **2026-10-20 — board created, not started,** on A1/A2 by a spawned `fkit-producer` with no owner
  channel: `0417`–`0423` pulled from the [Backlog board](../backlog.md) as `P1`–`P7` (three edits each: row
  here, `➡️ Moved to [Sprint 14](sprint-14.md) — priority P<n>` there, the brief's `## Sprint` and
  `## Priority`), plus a dated *ADR-057 check* note in each brief. Statuses stay `🔲 Backlog`. Sprint 12
  not touched.
- **Addendum — owner ruling A3; sprint started; task `0536` added out of band (2026-10-20).** By a
  spawned `fkit-producer` with no owner channel, on A3 relayed verbatim by `fkit-lead`. Line-3 banner
  flipped `🔲 Backlog` → `🔄 In progress` by hand (ADR-047). Rows `P1`–`P7` updated for A3 (start word,
  test-file pre-approval, phase-1 gate met); a dated note added to each of `0417`–`0423` (port source /
  Python reference re-pointed to aiboard `a1592dc`; A3's D1–D3 for that task). `0536` filed via
  `/fkit-task-brief` as `P8`.
  - ⚠️ Priority P8 is append rank, NOT a merit ranking — flagged for owner confirmation.
    **On merit this belongs directly above `0417`**, because it delivers the owner's stated goal
    (*"anybody who is using F-Kit has this board delivered to them"*) in one small task, waits on
    nothing, and A3's plan calls it step 1, *"Now"*. Not inserted there: a spawned producer never
    re-ranks or inserts (ADR-035). Since every row on this board is open, an owner-ruled re-rank can
    move it to the top in one edit (`P1`–`P7` each move down one).
  - Dated notes also added to `0443`, `0444`, `0467` (Backlog board) — no dependency or placement
    change. Placement check after the edits: see the report; `0536` touches no `Depends on:` line.
- **Addendum 2026-10-20 — `0536` re-ranked `P8` → `P1`; `0417`–`0423` each move down one (`P2`–`P8`);
  test-run notes corrected.** By a spawned `fkit-producer` with no owner channel, on owner ruling A3 — 2026-10-20, `AskUserQuestion`, `fkit lead` session, question *"Go ahead with this plan?"*, selected *"Yes, all of it (Recommended)"* (description: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*); plan text: *"1. Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board` command. ... 2. Sprint 14, 7 tasks: rebuild aiboard inside fkit in Node ..."*. *"Now"*, and step 1 before step 2, is his ruling that `0536` runs first. That
  settles the *"flagged for owner confirmation"* above: the merit place recorded there (*"directly
  above `0417`"*) is applied. Edits: rows here reordered and renumbered (the `(P<n>, this sprint)`
  rank pointers inside rows updated to match); each brief's `## Priority` and a dated note in each of
  the eight briefs; the [Backlog board](../backlog.md)'s seven `➡️ Moved to Sprint 14 — priority P<n>`
  cells renumbered. **Knock-on: none** — no `Depends on:` line changed, no open task names `0536`, and
  nothing waits on rank (checked 2026-10-20). Separately, the *"still not ruled"* test-run lines are
  corrected by dated notes (driver notes above, and `0417`–`0422`), pointing at ADR-057 §D1's ⛔ note.
  Earlier lines left byte-identical.
