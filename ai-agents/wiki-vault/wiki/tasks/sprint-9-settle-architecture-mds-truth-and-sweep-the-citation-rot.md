# Sprint 9 — Settle `architecture.md`'s truth, sweep the citation rot off it, and clear the debt Sprint 8 left behind

**Source**: `ai-agents/sprints/done/sprint-9.md`
**Status**: done
**Sprint/Tag**: Sprint 9 — ✅ **Done — 2026-09-16. Closed by `/fkit-sprint-done` (agent-closed — not owner-verified).**

> ⭐ **Ingested 2026-09-16** by the `b4a1a52` → `c59f4d7` sync. ⚠️ **The vault had NO Sprint 9 page at
> all until this pass.** The board opened 2026-09-14 and closed 2026-09-16 — **two days**, against a
> five-day window.

## Goal

⭐ **Make `architecture.md` say only things that are true, sweep the citation rot off it and out of the
repo, and clear the three pieces of doc-truth and coverage debt Sprint 8 shipped alongside its
lifecycle.**

⚠️ **A repair board, not a feature board, and deliberately so.** Nothing here ships new behaviour to a
consuming project except `0390`, which fixes a command an installed agent cannot run.

## Key Changes

### ⭐ THE FIRST SPRINT BOARD EVER CREATED UNDER THE ADR-047 LIFECYCLE

⭐ **Every board before this one was born without a status.** The eight boards in `done/` got their
banners by backfill (`0340`) or carry the legacy `🔒 CLOSED` form. **This is the first written with a
line-3 status banner from its first byte**, in
[[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]'s
grammar.

⭐ **The proof is a transition, not an assertion:** before the board existed the selector returned
`active none`, exit 3; after it, the board is named both `active` and `chosen`, exit 0, zero drift.
⛔ **A banner that looks right and does not parse is MALFORMED, not missing**, and malformed resolves
`unresolved` and is never eligible.

### Seven rows, all closed

| Rank | Task | Page |
|---|---|---|
| P1 | `0392` — `architecture.md` prose repair: §9.1's inventory, §9.1's occurrence B, §9.5's residuals | [[tasks/architecture-md-prose-repair-9-1-inventory-occurrence-b-and-9-5]] |
| P2 | `0388` — durable `prove-red.sh` mutations for the sprint movers and `successor` mode | [[tasks/give-the-sprint-mover-pins-and-successor-mode-durable-prove-red-mutations]] |
| P3 | `0390` — sweep the repo-only `claude/` path form out of installed-facing prose | [[tasks/sweep-the-repo-only-claude-path-form-out-of-installed-facing-prose]] |
| P4 | `0389` — `dual-home-parity.md`'s missing `.fkit-accepted-drift` row and stale mirror count | [[tasks/add-dual-home-paritys-missing-accepted-drift-row-and-correct-its-count]] |
| P5 | `0134` — decide the sanctioned repair path for a half-landed close (→ ADR-048) | [[tasks/decide-the-sanctioned-repair-path-for-a-half-landed-close]] |
| P6 | `0221` — repair `0194`'s false *"`0190`'s clause does not exist"* premise | [[tasks/repair-0194s-false-0190-clause-does-not-exist-premise]] |
| P7 | `0393` — the two citation sweeps: `architecture.md` outbound/inbound and the repo-wide `ADR-NNN:LINE` class | [[tasks/the-two-citation-sweeps-architecture-md-and-the-repo-wide-adr-line-class]] |

⚠️ **Rank IS the recommended run order on this board — the opposite of Sprint 8's choice, and the
board says which it picked and why.** ⛔ **Neither is a convention.** The one hard edge is
`0392` → `0393`; everything else records `Depends on: nothing`.

⛔ **The one place rank and merit disagree, stated up front:** `0393` is ranked **`P7`, last**, and
that is **not** a merit judgement. ⭐ **On merit it sits second** — it is the largest row here. It is
ranked last because it **cannot start earlier**.

⚠️ **`0388`'s `Depends on:` line still reads `0341` — discharged, not live.** Its brief carries a dated
2026-09-13 correction in as many words: *"Current dependency: nothing."* ⛔ **A reader who parses only
the bullet will call `0388` blocked. It is not.**

### ⛔ The board's biggest declared risk did not materialise

`0392` carried **two unsettled decisions**, one of which gated `0393`:

| | The question | Standing at filing | How it ended |
|---|---|---|---|
| **OD1** | *"Should §9.1 stop enumerating suite names by hand at all?"* | ⛔ owner-deferred (*"Leave it for 0251's own run"*, 2026-08-13) | ✅ **Ruled 2026-09-14 — *"Count + named groups (Rec)"*** |
| **OD2** | *"What should §9.5 contain now — and should it exist at all?"* | ⚠️ **no owner ruling existed**; `0393` waited on it | ✅ **Ruled 2026-09-14 — *"Keep, add dated note (Rec)"*. §9.5 stays; no section deleted** |

⭐ **Both were ruled at `0392`'s plan gate, live via `AskUserQuestion`, and recorded on `0392`'s
`plan.md` — which is exactly what success criterion 5 demanded.**

## Outcome

### ✅ TEN SUCCESS CRITERIA — AND THE LIST WAS CORRECTED, NOT DEFENDED

⭐ **The owner explicitly endorsed criteria that can be missed.** ⛔ *"None of the ten is satisfied by
the sprint merely ending."*

⚠️ **The list started as SEVEN and three of the seven had drifted from the proposal the owner
approved.** ⭐ **A driver-side diff against that proposal found the drift — not the producer.** The
board's own provenance clause had promised *"the owner's reading wins and this section is corrected,
not defended"*; ⛔ **this is that clause being honoured.**

| Drift found | Owner ruling 2026-09-14 (verbatim) | Result |
|---|---|---|
| Two approved criteria **absent** — `0221` and `0134` gradable only by criterion 1 | *"Restore both, as you approved them (Rec)"* | **Criteria 8 and 9 restored** |
| The proposal's criterion 2 was a **concrete command**; the board had replaced it with a **process rule** | *"Keep both (Rec)"* | Command restored as **2**, the date rule kept as **3**. ⭐ *"A complete §9.1 built from stale numbers passes one and fails the other"* |
| `0393`'s sweep scope was left to its plan gate, and criterion 4 is scored against it | *"Whole class, case-insensitive (Rec)"* | ⛔ **Criterion 4's WORDING untouched** (owner-ruled under `T3`); what it is **scored against** is now fixed |

⚠️ **What no criterion but 1 scores: `P3` (`0390`).** ⛔ **Recorded, not invented around** — the owner
ruled ten and the producer did not add an eleventh unasked.

### ⭐ What landed — verified on disk 2026-09-16, not taken from the briefs

| Criterion | Evidence measured this sync |
|---|---|
| **2** — §9.1 names every suite, counts agree | `ls test/*.test.js \| wc -l` = **29**; §9.1 reads *"29 `node --test` suites, counted 2026-09-14"* and, under OD1's ruling, names suites **by group, explicitly "not as a complete list"** |
| **3** — every repaired claim carries a measurement date | §9.1's CI figures read *"Measured **2026-09-14** … 43 runs on `ubuntu-latest`, 39 green and 4 red"*, with ⚠️ *"those are counts on a date, not a standing guarantee"* |
| **6** — the two reference guards green, ≥2 durable `prove-red` mutations | `test/prove-red.sh` grew **34 → 39 mutations**; **35–39 all name task `0388`** |
| **8** — `0194`'s brief carries zero false premises | `0194` now reads *"three prerequisites, **one still open (`0189`)**"*, with `0190`'s and `0191`'s clause text quoted verbatim and a dated 2026-09-15 note by `0221` |
| **9** — the reconcile-mode ADR exists, is approved, and its must-never list names the marker | [[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]] |
| **10** — closed by `/fkit-sprint-done`, observably | Line 3: `> ## ✅ Done — 2026-09-16. Closed by /fkit-sprint-done (agent-closed — not owner-verified).` `select-active` returns `active none`, exit 3 |

⚠️ **This vault page does NOT assert the board passed all ten.** ⛔ **The board carries no grading
section**, and criteria **1**, **4**, **5** and **7** are scored on evidence that lives in the rows'
own worklogs and plans — which this sync's filter excludes. **The six rows above are what could be
re-measured from disk; the other four are unassessed here, not passed.**

### ⛔⛔ THE `ADR-NNN:LINE` CENSUS — SIX DATED MEASUREMENTS THAT DISAGREE, AND THE CAUSE IS **CASE**

| # | Date | Figure | Scope recorded? |
|---|---|---|---|
| 1 | at `0323`'s filing | 66 occurrences | ⛔ no |
| 2 | 2026-09-13 | 110 / 27 files | ⛔ no |
| 3 | 2026-09-13, at the split | 117 / 29 files | ⛔ no |
| 4 | 2026-09-14, relayed | 125 / 34 files | ⛔ no |
| 5–6 | 2026-09-14, by two producers | ⭐ four scopes, each with its command | ✅ **yes, every time** |

**The 6th measurement's four scopes:** case-**sensitive** all tracked **124 / 35** · case-**insensitive**
all tracked **446 / 67** · minus `wiki-vault/` **418 / 62** · minus vault and closed task folders
**108 / 26**. With `--untracked`: **472 / 71** case-insensitive.

⛔ **The owner's stated reason for ruling the whole class in: under the narrow scope, criterion 4 reads
as MET while roughly 320 occurrences still stand.**

⭐⭐ **A FOURTH TRIAGE CLASS WAS ADDED BY OWNER RULING — `mentioned`.** A coordinate the sentence is
**talking about** rather than **using**. ⛔ **Repairing one corrupts the record of the very class the
row is sweeping.** **The test, at every site:** *replace the line number with the correct one — does
the surrounding sentence become FALSE? YES → `mentioned`, leave it byte-identical.*

### ⛔⛔ TWO FIGURES THE BOARD BANS BY NAME

1. ⛔ **The *"+8 occurrences and +5 files in one day"* growth figure is NOT reproducible and must not be
   cited as measured fact — anywhere, by anyone.** ⚠️ **It was relayed to the owner as measured fact
   more than once, inside a question the owner then ruled on.** ⛔ **None of the four prior
   measurements recorded its scope, so none can be checked against another.** ⭐ The guard row `0394`
   stands on the better reason: *a class whose census cannot be reproduced across five measurements has
   no machine-checkable definition.*
2. ⚠️ **~1.4 board rows/day is not self-maintaining.** ⛔ **A closed board reads 100% done BY
   CONSTRUCTION** — `/fkit-sprint-done` relocates every still-open row **before** archiving. ⭐ It is
   usable for Sprints 6/7/8 only because all three were verified to carry **zero `➡️ Moved` rows**.
   ⛔ **Whoever next quotes it must re-run that count over whatever boards they average — including
   this one.**

### ⚠️ No successor clause

⛔ **This board names no successor.** ⭐ **Two rows have a recorded claim on Sprint 10 and neither is a
commitment:** `0332` and `0329` are *first in line* by the omissions table (owner-ruled out of Sprint 9,
*"Leave them out (Rec)"*, on **decay-first** reasoning — the `architecture.md` and citation rot
regenerates while it sits, the symlink cluster does not), and `0189` was deferred there by the
producer's own two-sprint-arc argument, ⛔ **flagged as a judgement, not a ruling**. `0383` gets its own
sprint later (*"Its own sprint, later (Rec)"*).

⭐ **Measured 2026-09-16: `select-active ai-agents/sprints` returns `active none`, exit 3, with
`backlog.md` the only candidate (identity `Backlog`, status `unresolved`).** ⚠️ **There is no active
sprint.**

### ⚠️ Still open on this board

- **`0392` and `0393` both carry `## Owner: fkit-architect` FLAGGED as an unsettled producer
  judgement**, and `0392`'s Group A is coder-shaped. ⛔ **The board did not settle it**; the
  recommendation was to settle it at each row's plan gate under
  [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]].
- **`0393`'s exemption list** (`wiki-vault/`, closed task folders) stayed its plan-gate call. ⛔ **Two
  owner rulings narrowed the declaration — case, then tracking — and neither touched the exemptions.**

## Related
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]]
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]]
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
- [[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]]
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]]
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]]
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]
- [[systems/testing-and-verification]]
- [[systems/knowledge-base-structure]]
- *Added 2026-09-16 (sync `b4a1a52`→`a351cb6`):* [[tasks/correct-the-false-ci-has-never-run-claims-in-architecture-md]] — task `0312`, the half-done predecessor whose declined scope extension left the §9.1 occurrence-B gap this board's `P1` finally closed
- *Added 2026-09-16 (sync `b4a1a52`→`a351cb6`):* [[systems/backlog-convergence-and-the-k-measurement]] — the convergence measurement filed three days before this board opened
- *Added 2026-09-16 (sync `b4a1a52`→`a351cb6`, closing a one-way link):* [[systems/fkit]] — the team page, which now also carries a count defect in **this board's own subject file** that no row on it was scoped to reach
