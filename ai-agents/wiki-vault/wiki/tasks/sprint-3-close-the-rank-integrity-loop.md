# Sprint 3 — Close the rank-integrity loop

**Source**: `ai-agents/sprints/done/sprint-3.md` *(was `ai-agents/sprints/sprint-3.md` until the archival of 2026-08-07)*
**Status**: done — 🔒 **CLOSED and ARCHIVED 2026-08-07 by owner ruling**; all four rows `✅ Done (agent-closed — not owner-verified)` as of 2026-08-06
**Sprint/Tag**: Sprint 3 · opened 2026-08-06 by owner ruling · **superseded by [[tasks/sprint-4-ship-the-use-ready-self-healing-update]]**

> ✅ **Dated correction 2026-08-13 (the `0263` resync). The `Source` and `Status` lines above are the CORRECTED ones — this page previously named the pre-archival path and did not record the close.** Sprint 3 was archived on **2026-08-07** by owner ruling, verbatim option label **"Follow Sprint 1/2 precedent (Recommended)"**: banner → `🔒 CLOSED`, file → `sprints/done/sprint-3.md`, links repointed. **Two boards have opened since** — Sprint 4 (opened 2026-08-07, archived 2026-08-10) and [[tasks/sprint-5-fix-what-a-real-project-found]] (🟢 the active board). ⚠️ **Sprint 3 has not been the active board since 2026-08-07; the vault said otherwise until this sync.**

## Goal

Sprint 2 ended having *proved* the board could not represent its own priorities — an owner-ruled
mid-board insertion renumbered eight closed rows, and both written records of the act claimed it had
not happened. Sprint 3 closes that loop: **narrow the rule that allowed it (`0181`), build the guard
that catches it (`0182`), and record the one ADR Sprint 2 left authorized but unwritten (`0222`)** —
plus one owner-ruled design added out of band (`0241`). A small, sharp board on purpose.

**Authority, stated first.** The board exists by owner ruling, 2026-08-06, via `AskUserQuestion` in a
live `fkit lead` session — verbatim **"Roll over to Sprint 3."**, **"Follow the Sprint 1 precedent"**
(archival shape), and **"Pull it into Sprint 3"** (naming `0182`, accepting its gate `0181`). Executed
by a spawned `fkit-producer` under task
[[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]] (`0185`).

## Key Changes

### The board — fresh ranks, and the cost stated
- **Ranks restart at `P1`** — the point of rolling: new work gets a real rank range instead of
  appending behind 188 closed Sprint 2 rows. **Cost, stated honestly:** a bare "P3" in the corpus is
  now ambiguous between two boards — **cite a rank with its board** (`Sprint 3 P3`, never bare `P3`).
- **ADR-035's closed-row wall did not apply at open** — no row was closed, so `P1`–`P4` are **merit
  ranks assigned on merit**. The moment a row closes, its rank freezes and the wall applies again.
- **Rollover record:** 1 open Sprint 2 row (`0222`, frozen `P189` there) carried; 188 closed rows not
  carried (they stay at their archived ranks — **not one `P<n>` renumbered, on any board**); `0181`
  and `0182` pulled in from the Backlog board by owner ruling.
- **One owner-ruled re-rank on the open board:** `0241` moved from append `P4` to merit `P3` (verbatim
  *"Move to merit P3 (Recommended)"*), `0222` to `P4` — the narrowed exception's permitted case, since
  no closed rows existed. `0222`'s recorded merit statement is **the one merit position this board did
  not honor**, then un-honored **by owner decision** (*"Leave it at P3."* — answering a promotion
  question; the later `0241` re-rank necessarily placed it `P4`).

### The four rows, all shipped 2026-08-06
1. **P1** [[tasks/narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank]] — `0181`, the ADR-035
   skill edit: the exception narrowed in `/fkit-task-brief` step 5.
2. **P2** [[tasks/build-the-closed-rank-immutability-guard]] — `0182`, the guard:
   `test/closed-rank-immutability.test.js`, baseline ruled by the architect on owner delegation.
3. **P3** [[tasks/design-the-post-update-structure-check]] — `0241`, the owner-ruled structure-check
   design — the sanctioned ADR-015 re-raise, added out of band on two named rulings.
4. **P4** [[tasks/record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — `0222` →
   [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]].

### Known follow-ups the rollover created — none silent, all recorded on the board
- **The prose-citation sweep is NOT done** — **107 files** outside the vault still carry the literal
  string `ai-agents/sprints/sprint-2.md` as prose (mostly closed task folders and frozen reports;
  deliberately left, per the Sprint 1 precedent). Filed as `0236`.
- **⚠️ Round-trip drift, ceiling 45 rows** — a task going **sprint → Backlog → sprint** breaks
  `dashboard.sh` drift rule 2's "moves at most once" assumption: `0181`/`0182` now emit two permanent
  drift records **with both rows and both briefs correct**. ⛔ Not repairable by rewriting markers.
  Filed as `0234`.
- **An archived board is MOVED, not FROZEN** — Sprint 1's was edited three more times after archiving;
  any guard reasoning about `sprints/done/` must assume it still changes.
- **The wiki re-sync** — owed at rollover, filed as `0238`, **performed by the 2026-08-07 sync that
  wrote this page**.
- The in-flight-row case (`🔄 In progress` at roll time) was **not exercised and remains
  unspecified** — a future rollover decision nobody has made yet.

## Outcome

**4 done · 0 open — of 4.** Every close carries `(agent-closed — not owner-verified)`. The sprint
delivered: the ADR-035 narrowing in the filing skill, the closed-rank guard, ADR-038 recorded, and the
structure-check design with its owner rulings — plus the eight structure-check follow-up briefs
(`0242`–`0249`) filed on the Backlog board.

## Related
- [[tasks/sprint-2-remove-omnigent]] — the predecessor board, archived at `ai-agents/sprints/done/sprint-2.md`
- [[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]] — task `0185`, the rollover decision and execution
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the rule this sprint's `0181`/`0182` implement and guard
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — the ADR this sprint recorded
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174`, whose follow-ups 4/5/8 became `0181`/`0182`/`0185`
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board, unranked by design, where unsprinted work continues to land
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]] — the successor board, which built the `0241` design's eight follow-ups and was itself archived unverified
- [[tasks/sprint-5-fix-what-a-real-project-found]] — 🟢 **the ACTIVE board** since 2026-08-10
- [[tasks/design-the-post-update-structure-check]] — `0241`, this board's out-of-band row, whose follow-ups became the whole of Sprint 4
- [[systems/fkit]]
