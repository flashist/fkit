# Sprint 14 — "AI-Board phase 1": port aiboard to Node in `board/` (ADR-052 phase 2), gated by `0423`

**Source**: `ai-agents/sprints/done/sprint-14.md`
**Status**: done — `✅ Done — 2026-10-23. Closed by /fkit-sprint-done (agent-closed — not owner-verified).`
**Sprint/Tag**: Sprint 14 · created 2026-10-20 · started 2026-10-20 (owner ruling A3) · closed 2026-10-23 · driven by `/fkit-sprint-ship-loop` from `fkit lead` sessions

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). ⚠️ **The caller's note said this close was uncommitted. Checked this run:** `git status` was clean at the start, and `sprints/done/sprint-14.md` plus the eight task folders under `tasks/done/` are in HEAD `5ccf2c2` — so they **are** inside this sync window.

## Goal
**aiboard ported to Node in `board/`, faithful to aiboard's format, and proven equal to the Python reference** — ADR-052 D9 phase 2's gate. ⚠️ **Two numberings, same tasks:** the owner's rulings call `0417`–`0423` "AI-Board phase 1" (the first phase fkit builds); in ADR-052 they are **phase 2** (phase 1 is the external T-023 fix in Python aiboard). Success: all eight rows closed, `0423`'s harness reporting zero differences. A met gate means the next phase may be **put to** the owner — ⛔ not that it starts.

**Authority** — owner rulings 2026-10-20, `AskUserQuestion`, `fkit lead` session:

| # | Selected | What it settled |
|---|---|---|
| A1 | *"New sprint after 13 (Recommended)"* | this board, `0417`–`0423`, briefs checked against ADR-057 |
| A2 | *"Close it, then plan AI-Board sprint (Recommended)"* | Sprint 13 closed first; this board drafted after |
| A3 | *"Yes, all of it (Recommended)"* — *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."* | D1 phase 2 starts; D2 the board's tests count (ADR-057 D1); D3 up to **6** `test/board/` files pre-approved; D4 the interim read-only board (`0536`) added. ⛔ **Not his word for phases 3+.** |

## Key Changes
| Rank | Task | Page |
|---|---|---|
| P1 | `0536` ship the read-only reader as `fkit board` (added by A3; re-ranked `P8` → `P1` on A3's *"Now"*) | [[tasks/ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board]] |
| P2–P8 | `0417`–`0423` the Node port and its gate | [[tasks/port-aiboard-to-node-in-board-the-adr-052-phase-2-tasks-0417-0423]] |

- **The ADR-057 check, before any build:** every brief was written 2026-09-30, before ADR-057. The board flagged a real scope question — `board/` does not ship in this phase, so `test/board/` sat **outside the fence as written**. A3 ruled it; a later dated correction records that A3 also settled **how** the tests run (inside the default `npm test`, within the 2-minute budget).
- **External gate met 2026-10-20:** `fkit-lead` checked aiboard commit `a1592dc` (T-023 fixed); **port source and Python reference = `a1592dc`**.

## Outcome
- **All 8 rows ✅ Done (agent-closed — not owner-verified); closed 2026-10-23.** `0423`'s gate verdict: **PASS** (0 differences; one control met by an owner-ruled note).
- **Knock-on checked at placement:** `0424` (phase 3) and `0435` (phase 4) depend on `0423` and stay on the Backlog board — each still needs the owner's own word. `0405` is not a dependent.
- **Two sprints were open throughout** — this one and the paused Sprint 12 — legal under ADR-047; neither banner carries `⭐ ACTIVE BOARD`.
- **Follow-ups filed during the sprint** (open, not ingested): `0537` (the `0284/term-ignored` stall test under load), `0538` / `0539` (refuse foreign-Host reads in the shipped reader / the Node server).
  > ✅ *Dated note 2026-10-23 (sync `5ccf2c2`→`185ac5e`; line above left byte-identical):* `0538` closed 2026-10-23 on the **Backlog board**, not this one (agent-closed) → [[tasks/refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader]]. `0537` and `0539` still open.

## Related
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — the phases and gates
- [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] — the fence question and the pre-approval
- [[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]] — `0536`'s decision
- [[tasks/sprint-13-reset-fkits-tests-to-shipped-script-behaviour]] — the sprint closed just before
- [[tasks/sprint-12-set-a-nine-backlog-tasks-goal-not-set]] — paused alongside
- [[tasks/sprint-11-fkit-aiboard-convergence]] — the convergence sprint behind ADR-052
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`, closing one-way links):* [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]]
- *Added 2026-10-23 (sync `5ccf2c2`→`185ac5e`):* [[tasks/refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader]] — follow-up `0538` **done** 2026-10-23 on the Backlog board (agent-closed)
