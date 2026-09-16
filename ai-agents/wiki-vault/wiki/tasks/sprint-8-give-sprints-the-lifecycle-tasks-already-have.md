# Sprint 8 — Give sprints the lifecycle tasks already have, and prove it by closing this board with a mover

**Source**: `ai-agents/sprints/done/sprint-8.md`
**Status**: done
**Sprint/Tag**: Sprint 8 — ✅ **Done — 2026-09-13. Closed by `/fkit-sprint-done`.**

> ⭐ **Ingested 2026-09-16** by the `b4a1a52` → `c59f4d7` sync. ⚠️ **The vault had NO Sprint 8 page at
> all until this pass** — the board opened and closed entirely inside a window no sync had read.

## Goal

⭐ **Give sprints the lifecycle tasks already have — an explicit status, a selector that reads it, and
producer-only movers — and prove it by making Sprint 8 the first board in this project's history
closed by a mover instead of by hand.**

Tasks had all of it from the beginning: a `## Status` field, a canonical vocabulary, folder locations
that match, and two producer-only movers that are the only sanctioned way a task file moves
([[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]). **Sprints had none of it.** A
sprint's status lived in two places nothing read together — **where the file sat** and a
`> ## 🔒 CLOSED — <date>.` banner the selector never looked at. Every close from Sprint 1 to Sprint 7
was a **hand-scoped task**, and the two most recent both admit they were agent-performed and not
owner-verified.

## Key Changes

**Seven rows, `P1`–`P7`, all closed.** Six `✅ Done (agent-closed — not owner-verified)`; ⭐ **`P7`
(`0339`) is the one row on this board that carries a plain `✅ Done`.**

| Rank | Task | Page |
|---|---|---|
| P1 | `0337` — record the sprint lifecycle (→ ADR-047) | [[tasks/record-the-sprint-lifecycle-adr-047]] |
| P2 | `0271` — pin the five unpinned behaviors in the sprint-identity grammar | [[tasks/pin-the-five-unpinned-behaviors-in-the-sprint-identity-grammar]] |
| P3 | `0340` — backfill a sprint status onto this repo's plans | [[tasks/backfill-a-sprint-status-onto-every-existing-sprint-plan]] |
| P4 | `0381` — give the task movers a step for the `NAMED_EXEMPT` keys a move invalidates | [[tasks/give-the-task-movers-a-step-for-the-named-exempt-keys]] |
| P5 | `0341` — build the producer-only sprint movers | [[tasks/build-the-producer-only-sprint-movers]] |
| P6 | `0338` — the selector's status rung and the lowest-first single choice | [[tasks/give-the-selector-a-status-rung-and-a-lowest-first-choice]] |
| P7 | `0339` — teach the lead, producer, ship-loop and README the sprint lifecycle | [[tasks/teach-the-roles-what-current-sprint-means]] |

### ⭐ The authority: six owner rulings, all 2026-09-10, all live via `AskUserQuestion`

| # | Ruling (verbatim option label) | What it settled |
|---|---|---|
| S1 | *"Approve 7 rows, lift Unscheduled (Rec)"* | The board, its goal, its criterion — **and the `Unscheduled` lift** |
| S2 | *"Keep as reported metric + caveat (Rec)"* | Sprint 7's record-repair share becomes a **reported metric with its flaw stated**. ⛔ **It gates nothing** |
| S3 | *"Open with no banner, 0340 adds it (Rec)"* | The board opens with **no line-3 banner**; `0340` backfills it |
| S4 | *"Close out 0358's review ledger (Rec), File the board-bloat row"* | `0383` filed on the Backlog board; `0358`'s ledger closeout is a coder's job, not this board's |
| S5 | *(producer's own recommendation, accepted)* | **No successor clause — decided at close, not now** |
| S6 | *"Re-order — 0340 before 0338 (Rec)"* | ⛔ **`0340` and `0338` SWAP RANKS.** The only re-rank on this board, and the only one authorised |

⚠️ **`S6` was given LATER THE SAME DAY, after the board had been written and while it was being
driven** — the one ruling here that changes a board that already existed.

### ⛔ The re-order of 2026-09-10 — a measured defect, not a preference

**The breakage in one line: in the window where `0338` had shipped and `0340` had not, this board
disappeared from its own selector.**

1. `0338` makes `In progress` a rung of eligibility, and "no banner → unresolved + drift".
2. Ruling `S3` had this board **open with no line-3 banner** — measured, line 3 was the opening line
   of the authority blockquote.
3. So after `0338` and before `0340`, the file resolves `unresolved` → ineligible → `select-active`
   returns `active none`, exit 3.
4. ⭐ **And that is the board `/fkit-sprint-ship-loop` was being driven from** — its empty-argument
   contract resolves through `select-active`. ⛔ **The loop would have lost its own board while
   closing the sprint that fixes losing the board.**

⚠️ **One precision the board itself insists on:** the ship-loop only resolves through `select-active`
on an **empty argument**; a run given an explicit plan path survives the window untouched.
⛔ **`/fkit-status` breaks either way.**

⚠️ **The swap costs something, and the board says so:** `0340` now ships **before the reader that
verifies it**. Its step-1 proof could not pass at `P3`, so it checked the banner **by inspection** and
the machine-read proof landed at `P6`. ⛔ **Neither brief's `Depends on` line was edited** — the graph
did not change, only the execution order.

### ⭐ Two rejected fixes, both put to the owner and both declined

- ⛔ **"Ship both as one change"** — it would have merged a coder row and a producer row into one unit.
- ⛔ **"Transitional grace"** — the architect's objection is the keeper: a grace period
  **re-introduces the exact silent default ADR-047 exists to ban**. ⭐ A rule that quietly treats a
  missing banner as `In progress` is the behaviour the whole board was built to delete.

## Outcome

### ✅ THE SUCCESS CRITERION WAS MET — BOTH HALVES, AND IT WAS DELIBERATELY UN-FAKEABLE

⭐ **Two commands, two required outputs, no percentage and no judgement call.**

**(a) While Sprint 8 was live** — `select-active` names `sprint-8.md` as chosen **because its status
reads `🔄 In progress`**, exit 0. That reason is producible only by `0337` + `0338` + `0340` together;
before them the script had no status rung and could not print a status as its reason for anything.

**(b) At close — reading 2, owner-ruled 2026-09-10** (*"Reading 2 — archived + mover-named (Rec)"*):
`select-active` returns `active none`, exit 3, **and** `sprints/done/sprint-8.md` carries a `✅ Done`
banner **naming `/fkit-sprint-done`**. ⭐ **Verified on disk 2026-09-16: line 3 reads
`> ## ✅ Done — 2026-09-13. Closed by /fkit-sprint-done.`**

⭐ **Why (b) cannot be faked by hand:** every plan already under `sprints/done/` carries the **legacy
`> ## 🔒 CLOSED — <date>.` banner and names no mover at all**, because none of them was moved by one.
A hand archive reproduces the file location and nothing else.

⚠️ **Reading 1 was flagged, not silently resolved.** The board's own section *"ONE UNSETTLED READING IN
(b)"* is kept byte-identical and marked answered — ⭐ **the record shows what was asked as well as what
was ruled.**

### 📊 The record-repair share — reported, with its flaw, gating nothing

**Measured 2026-09-10 at `9943dcf`: open work 111, record repair 23 = 20.7%; excluding source defects
20 = 18.0%.**

⛔ **THE METRIC PUNISHES THIS SPRINT FOR DOING THE RIGHT THING, and the board measured that rather
than asserting it.** Shipping exactly these seven rows and creating nothing reads `21 / 104 = 20.2%` —
a fall of half a percentage point. ⛔ **Both "repairs" are misclassifications:** `0337` writes a **new
ADR for a lifecycle that did not exist** (the classifier sees the verb `record`), and `0340` is a
**one-time data migration** (it sees `backfill`). ⚠️ **The denominator is the real flaw** — it falls by
only seven. ⭐ *"The instrument measures the ratio of a slow-moving numerator to a slow-moving
denominator, and calls a sprint that fixes the machinery a failure."*

⭐ **The classifier repair was filed, not done:** owner ruling *"File it as a Backlog row (Rec)"* →
`0384`, Backlog board, unranked, appended last. ⛔ **Sprint 8's scope did not change by that filing.**

### ⚠️ No successor clause — and the omission establishes no convention

⛔ **The board names no successor.** Ruling `S5` deferred the question to close. The producer's Sprint 9
recommendation — the six-row **symlink cluster** (`0045`, `0329`, `0330`, `0332`, `0334`, `0336`) — is
recorded in the omissions table as *a recommendation and nothing more*. ⚠️ **Sprint 9 went a different
way entirely**: it became the `architecture.md` repair board, and `0329`/`0332` were ruled **out** of
it — see [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]].

⭐ **Sprints 5, 6, 7 and 8 each named no successor, each for its own recorded reason, and that
established no convention either way.**

### ⭐ The fourth Backlog-board edit nobody had written down

Pulling a task onto a sprint was documented as **three** edits (board row added, Backlog row flipped to
`➡️ Moved`, the brief's `## Sprint` changed). ⚠️ **A fourth was performed and the owner confirmed it**
(*"Confirm the edit (Rec)"*): each brief's `## Priority` changed from `Unscheduled` to its rank.
⛔ **The written rule is incomplete** — recorded on `backlog.md` beside the rule and on `0341`'s brief,
because `0341` mechanizes this procedure and would otherwise mechanize the incomplete shape.

## Related
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]]
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]]
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]]
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]
- [[systems/role-locked-sessions]]
- [[systems/fkit]]
- *Added 2026-09-16 (sync `b4a1a52`→`a351cb6`):* [[systems/backlog-convergence-and-the-k-measurement]] — ⭐ **this board is the k-report's most informative data point**: the **only consolidation-free sprint** in the measured window, and its cut (8 closes) gives total `k` = **1.13** and `k_regen` = **0.63**. ⭐ **Its nine creations (`0383`–`0391`) contain ZERO owner-originated rows** — every one was discovered by doing the work
