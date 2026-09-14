# Sprint 9 — Settle `architecture.md`'s truth, sweep the citation rot off it, and clear the doc-truth and coverage debt Sprint 8 left behind

> ## 🔄 In progress — 2026-09-14.
>
> **Authority, stated first and in full.** This board exists by an **OWNER RULING given 2026-09-14 via
> `AskUserQuestion` in a live `fkit lead` session** — a selection from the question's option list, and
> the option label is the verbatim text: **"Approve — write the board (Rec)"**.
>
> **Five further rulings, same day, same channel, option labels verbatim:**
>
> | # | Ruling (verbatim option label) | What it settled |
> |---|---|---|
> | T1 | **"Approve — write the board (Rec)"** | The seven rows `P1`–`P7` below, and this board's existence |
> | T2 | **"5 days, 7 rows — to 2026-09-19 (Rec)"** | The window: opens **2026-09-14**, closes **2026-09-19** |
> | T3 | **"Pre-existing only, as written (Rec)"** | Success criterion **4** keeps its *"pre-existing only"* phrasing — see that criterion for what it costs and what it demands in exchange |
> | T4 | **"Its own sprint, later (Rec)"** | `0383` gets **its own sprint later**. ⛔ Not this board |
> | T5 | **"Leave them out (Rec)"** | `0332` and `0329` are **OUT** of this board. Decay-first holds |
>
> *Executed 2026-09-14 by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
> which asked nothing and decided nothing beyond the mechanics of those five rulings and the flagged
> judgements named in §"⚠️ What this producer decided that nobody ruled".*

## ⭐ THIS IS THE FIRST SPRINT BOARD EVER CREATED UNDER THE ADR-047 LIFECYCLE

⭐ **Every board before this one was born without a status.** Sprint 8 shipped the lifecycle and `0339`
documented it; the eight boards in `done/` got their banners by **backfill** (`0340`) or carry the
legacy `🔒 CLOSED` form. **This board is the first that was written with a line-3 status banner from
its first byte**, in the grammar
[ADR-047](../knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md)
§2 fixes and
[`sprint-status-vocabulary.md`](../knowledge-base/conventions/sprint-status-vocabulary.md)
restates.

**Proof the banner is well-formed, measured 2026-09-14 immediately after writing it:**

```
bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
```

⭐ **Before this board existed the selector returned `active none`, exit 3.** ⛔ **That transition —
`active none` → this board named as both `active` and `board`, exit `0`, zero drift — is the only
proof that the banner above is grammatical.** A banner that looks right and does not parse is
**malformed, not missing** (ADR-047 §2), and malformed resolves `unresolved` and is never eligible.

⚠️ **`🔄 In progress` and `🔲 Backlog` are the two statuses a producer sets BY HAND** (ADR-047 §1).
⛔ **`✅ Done` and `⛔ Cancelled` on line 3 are settable only by `/fkit-sprint-done` and
`/fkit-sprint-cancelled`, producer-only** — see success criterion 10, which is what makes that true of
this board rather than merely stated.

## 🎯 The goal

⭐ **Make `architecture.md` say only things that are true, sweep the citation rot off it and out of the
repo, and clear the three pieces of doc-truth and coverage debt Sprint 8 shipped alongside its
lifecycle.**

Sprint 8 built the sprint lifecycle and closed itself with a mover. It also left a measured tail:
three doc-truth defects filed from its own review rounds (`0388`, `0389`, `0390`), and a five-row
`architecture.md` repair cluster that was consolidated and then split (`0392`, `0393`). Two older rows
join them — one ADR the owner has now partly settled (`0134`) and one single-file record repair
(`0221`).

⚠️ **This is a repair board, not a feature board, and that is deliberate.** Nothing here ships new
behaviour to a consuming project except `0390`, which fixes a command an installed agent cannot run.

## ⛔⛔ THE BOARD'S SINGLE BIGGEST RISK: `0392` CARRIES TWO UNSETTLED DECISIONS, AND ONE OF THEM GATES `0393`

⛔ **Stated here, at the top, and not left to a row cell — because if this is discovered late the
sprint loses days it does not have on a five-day window.**

[`0392`](../tasks/backlog/0392-architecture-md-prose-repair-9-1-inventory-9-1-occurrence-b-and-9-5-residuals/brief.md)
carries **two open decisions that need the owner at its plan gate**, recorded in its own brief under
the heading *"The open decisions this row carries — neither is settled here"*:

| | The question, as `0392`'s brief words it | Standing, as its brief records it |
|---|---|---|
| **OD1** | **"Should §9.1 stop enumerating suite names by hand at all?"** | ⛔ **OWNER-DEFERRED** — verbatim option label **"Leave it for 0251's own run"** (`AskUserQuestion`, 2026-08-13). The deferral's trigger is *this row's run*. ⚠️ Choosing *stop enumerating* means amending `0392`'s **own** enumeration verification step in the same change |
| **OD2** | **"What should §9.5 contain now — and should it exist at all?"** | ⚠️ **NO OWNER RULING EXISTS.** It is `0392`'s plan-gate question — ⛔ **and `0393` waits on its answer** |

⭐ **Why OD2 is the gate and not merely a question.** `0393`'s deliverable is **line arithmetic** over
the file `0392` rewrites. If OD2 deletes §9.5, every line coordinate below it moves and no shift map
derived beforehand survives. ⛔ **Running `0393` before `0392` lands does not save time — it guarantees
a second pass.** `0393`'s brief records the dependency as **hard, not a preference**, and this board
does not soften it.

**What this costs, stated rather than discovered:** `0393` is the largest row on this board and it
**cannot start on day 1**. If `0392`'s plan gate slips, `0393` slips with it, and the two together are
two of the seven rows. ⭐ **That is why `0392` is `P1` and why this section is above the goal's own
detail** — the owner is needed at that gate early, not at the end of the week.

## ⚠️ RANK IS THE RECOMMENDED RUN ORDER ON THIS BOARD — DELIBERATELY, AND THE ONE PLACE IT STRAINS

⭐ **Unlike Sprint 8, this board's `P1`–`P7` IS the recommended execution sequence.** Sprint 8's board
had to state loudly that rank was merit and not a schedule, because its dependency graph was three
deep and its ranks disagreed with it. **This board has exactly one hard edge**, so the two can be made
to agree, and making them agree removes a whole class of misreading.

**The dependency graph, as the seven briefs actually record it — re-derived from the briefs on
2026-09-14, not carried from a hand-over:**

| Lane | Chain | Depth |
|---|---|---|
| **The one hard chain** | `0392` → `0393` (`0392`'s brief: *"Blocks `0393` — hard"*; `0393`'s brief: *"Depends on `0392` — hard. Not a preference."*) | **2 deep** |
| **Parallel lane — start any of these on day 1** | `0388` · `0390` · `0389` · `0134` · `0221` — **every one records `Depends on: nothing`** | **1 deep** |

⚠️ **`0388`'s `Depends on:` line still reads `0341` — and it is DISCHARGED, not live.** Its brief
carries a dated correction of 2026-09-13 in as many words: *"THIS DEPENDENCY IS DISCHARGED. The line
above is left byte-identical and is no longer binding … Current dependency: nothing."* ⛔ **Verified on
disk 2026-09-14: `0341` is closed, under `ai-agents/tasks/done/`.** A reader who parses only the
`Depends on:` bullet will call `0388` blocked. It is not.

⛔ **THE ONE PLACE RANK AND MERIT DISAGREE — stated up front.** `0393` is ranked **`P7`, last**, and
`P7` is **not** a merit judgement. ⭐ **On merit `0393` sits second**, directly below `0392` — it is
the largest row here and its own brief records that merit position. **It is ranked last because it
cannot start earlier**, and this board chose to let rank carry the schedule. ⛔ **Do not read `P7` as
"least important"** and ⛔ **do not "fix" it by renumbering** — a re-rank needs an owner ruling
([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
and there is nothing here to fix.

## ✅ SUCCESS CRITERIA — TEN, AND EVERY ONE OF THEM CAN FAIL

⭐ **The owner explicitly endorsed criteria that can be missed.** Sprint 7's was missed and reported as
missed, and that was the right outcome — a criterion nobody can fail measures nothing. ⛔ **None of the
ten below is satisfied by the sprint merely ending.**

### ⛔⛔ CORRECTED 2026-09-14 — THIS LIST WAS SEVEN, AND THREE OF THE SEVEN HAD DRIFTED FROM THE PROPOSAL THE OWNER APPROVED

⭐ **The drift was found by a DRIVER-SIDE DIFF against the approved proposal, not by this producer.**
The board's own provenance clause promised *"if any of the six differs from what the owner read, the
owner's reading wins and this section is corrected, not defended."* ⛔ **This is that clause being
honoured.** Three drifts, three owner rulings, all given live via `AskUserQuestion` on **2026-09-14**,
option labels reproduced verbatim:

| Drift found | Owner ruling (verbatim option label) | What changed below |
|---|---|---|
| **Two approved criteria were ABSENT** — `0221` and `0134` were gradable only by criterion 1 (that *something* closed them) | **"Restore both, as you approved them (Rec)"** | **Criteria 8 and 9** are new, restored in the proposal's own substance |
| **The proposal's criterion 2 was a CONCRETE COMMAND; the board had replaced it with a PROCESS RULE** | **"Keep both (Rec)"** | The command form is restored as **criterion 2**; this producer's date rule is kept as its own **criterion 3**. ⭐ **They catch different failures** — *a complete §9.1 built from stale numbers passes one and fails the other* |
| **`0393`'s sweep scope was left to its plan gate, and criterion 4 is scored against it** | **"Whole class, case-insensitive (Rec)"** | ⛔ **Criterion 4's WORDING is untouched (it is owner-ruled under T3).** What it is *scored against* is now fixed — see criterion 4 and `0393`'s brief |

**Provenance, criterion by criterion — stated because it bears on how much to trust the wording:**

| # | Where its text comes from |
|---|---|
| **1** | ⭐ **This producer's addition.** Not in the proposal; the owner reviewed it and **kept** it |
| **2** | ⭐ **The owner's approved proposal text, RESTORED** after being dropped |
| **3** | This producer's re-derivation, **kept alongside 2** under *"Keep both (Rec)"* |
| **4** | ⛔⛔ **OWNER-RULED VERBATIM (T3, *"Pre-existing only, as written (Rec)"*) — reproduced unchanged. Do not reword it.** |
| **5** | ⭐ **This producer's addition** (the OD1/OD2 gate). Not in the proposal; the owner reviewed it and **kept** it |
| **6** | Re-derived by this producer from the proposal's shape; **the driver's diff found no disagreement** |
| **7** | Re-derived by this producer from the proposal's shape; **the driver's diff found no disagreement** |
| **8** | ⭐ **The owner's approved proposal text, RESTORED** |
| **9** | ⭐ **The owner's approved proposal text, RESTORED** |
| **10** | Re-derived by this producer from the proposal's shape; **the driver's diff found no disagreement** |

⚠️ **What is still NOT scored by any criterion but 1: `P3` (`0390`).** ⛔ **Recorded, not invented
around** — the owner ruled ten criteria and this producer is not adding an eleventh unasked.

---

**1 — Every one of the seven rows reaches a terminal status through a mover.**
`✅ Done` or `⛔ Cancelled` on all seven, set by `/fkit-task-done` or `/fkit-task-cancelled`,
**producer-invoked** ([ADR-033](../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
with the `(agent-closed — not owner-verified)` marker wherever the owner was absent.
⛔ **HOW IT FAILS:** any row still `🔲 Backlog`, `🔄 In progress` or `🚧 Blocked` at 2026-09-19; or any
row whose file moved without a mover.

**2 — `architecture.md` §9.1 names EVERY test suite on disk, and the two counts agree.**
⭐ **RESTORED 2026-09-14 — this is the owner's approved proposal text, in its concrete command form.**
**The check is a command, not a judgement:** `ls test/*.test.js | wc -l` equals the count of suite
names in §9.1.
⛔ **HOW IT FAILS:** the two counts differ at close.

> ### ⭐ TODAY'S GAP, RE-MEASURED BY THIS PRODUCER 2026-09-14 at `HEAD` `f209a8c` — ⛔ NOT copied from the proposal
>
> | Measurement | Command | Today |
> |---|---|---|
> | **Suites on disk** | `ls test/*.test.js \| wc -l` | ⭐ **29** |
> | **Suite names in §9.1** | the parenthetical after *"eight `node --test` contract suites"* — `launcher-contract`, `converge-contract`, `dashboard-contract`, `skill-ownership-hook`, `orphan-cleanup`, `rules-block-budget`, `adr-number-uniqueness`, `task-id-uniqueness` | ⛔ **8** |
> | **THE GAP** | | ⛔⛔ **21 suites on disk that §9.1 does not name** |
>
> ⛔ **§9.1 does not merely omit them — it asserts the wrong total in words:** *"`test/` now holds a
> real one: **eight `node --test` contract suites**"*. **The sentence is false, not just incomplete.**
>
> ⚠️ **THE PROPOSAL'S SECOND FIGURE DOES NOT REPRODUCE, AND THAT IS RECORDED RATHER THAN SMOOTHED
> OVER.** The proposal cited *"~7 `test/` references in the whole document"*. Measured today, the whole
> of `architecture.md` holds **5** `test/<name>` path-form occurrences (`update-banner.test.js`,
> `structure-spec.test.js`, `structure-` [truncated], `prove-red.sh`, `orphan-cleanup.test.js`), **4**
> distinct `.test.js` filenames, and **10** distinct suite names anywhere in the document. ⛔ **None of
> those three readings is 7.** ⭐ **The criterion above does not depend on that figure** — it is scored
> on **29 vs 8**, both of which reproduce. ⚠️ **Re-measure both at close; `HEAD` moves.**

**3 — Every claim repaired in `architecture.md` carries a measurement date, and the measurement was
taken during this sprint.**
⭐ **Kept as its own criterion under the owner's *"Keep both (Rec)"*** — it and criterion 2 catch
different failures, and ⛔ **a complete §9.1 built from stale numbers passes 2 and fails this one.**
`0392` repairs three prose areas whose premises **all predate the current file**. Its own brief says
so: *"EVERY PREMISE PREDATES THE CURRENT FILE AND MUST BE RE-DERIVED AT PICKUP."*
⛔ **HOW IT FAILS:** a repaired claim that states a number with no date beside it, or one whose date
predates 2026-09-14. ⭐ **A correct number carried forward from a stale brief fails this criterion** —
that is the point of it.

**4 — Zero PRE-EXISTING bad `ADR-NNN:LINE` citations remain inside the scope `0393` declares in its own
plan, measured case-insensitively at close.**
⭐ **The "pre-existing only" phrasing is OWNER-RULED (T3, verbatim "Pre-existing only, as written
(Rec)") and stands.** ⛔ **The ruling comes with a condition that is part of the criterion, not a
footnote to it: any bad citation NEWLY INTRODUCED during this sprint MUST be filed as a residual row,
and filing it is part of MEETING this criterion — never an excuse for missing it.**
⛔ **HOW IT FAILS, three ways:** a pre-existing occurrence left standing inside the declared scope; a
newly-introduced one left unfiled; or a scope declared so narrowly at plan time that the criterion
becomes trivial. ⚠️ **`0393`'s declared scope is itself reviewable** — see the census section below,
where three dated measurements disagree with each other and with a fourth taken today.

> ### ⛔⛔ THE SCOPE IS NO LONGER `0393`'s TO NARROW — OWNER RULING 2026-09-14
>
> ⭐ **Verbatim option label: *"Whole class, case-insensitive (Rec)"*,** given live via
> `AskUserQuestion`. **`0393` sweeps the WHOLE `ADR-NNN:LINE` class, CASE-INSENSITIVELY** — not the
> uppercase half. ⛔ **The criterion's wording above is untouched** (T3 governs it); what changed is the
> declaration it is scored against, which is now fixed rather than open.
>
> ⛔ **The owner's stated reason, recorded because it is the point:** under the narrow scope,
> **criterion 4 reads as MET while roughly 320 occurrences still stand.**
>
> ⚠️ **The exclusions inside the class (`wiki-vault/`, closed task folders) remain `0393`'s plan-gate
> call** — the ruling fixes **case**, not the exemption list. See the census section for four scopes
> re-measured today, each with its command.
>
> **The ruling is recorded on `0393`'s brief as a dated owner ruling** —
> [`0393`](../tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md).
>
> ### ⭐⭐ SECOND RULING, SAME DAY — **UNTRACKED FILES ARE IN THE DECLARED SCOPE**
>
> **Verbatim option label: *"Include untracked + a specimen class (Rec)"*,** given live via
> `AskUserQuestion`. ⛔ **Criterion 4's wording above is STILL untouched** (T3 governs it); what moved
> again is the **declaration it is scored against**.
>
> ⛔⛔ **THE DECLARATION IS A COMMAND, NOT A NUMBER:**
> `git grep --untracked -oihE 'adr-[0-9]{3}:[0-9]+' -- .` — plus whatever exemption pathspecs `0393`
> declares at its plan gate, **recorded as run**. ⭐ **Re-verified 2026-09-14: 472 occurrences / 71
> files**, against **446 / 67** tracked-only. ⛔ **`--untracked` is NO LONGER a plan-gate question.**
>
> ⚠️ **What is STILL `0393`'s plan-gate call: the exemption list alone** (`wiki-vault/`, closed task
> folders). ⛔ **Two rulings have now narrowed this declaration — case, then tracking — and neither
> touched the exemptions.**
>
> ⛔ **The ruling also added a FOURTH triage class (`mentioned`) to `0393`'s `E2`** — a coordinate the
> text is *talking about* rather than *using*. **Scoring criterion 4 against a sweep that "repaired" a
> mentioned coordinate is scoring a corruption as a pass.** See the census section.

**5 — OD1 and OD2 are put to the owner and answered BEFORE any `architecture.md` prose is written, and
both answers are recorded on `0392`'s brief.**
⛔ **HOW IT FAILS:** prose written first and the ruling sought afterwards — **even if the prose turns
out to be what the owner would have chosen.** ⚠️ A spawned worker has no owner channel
([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md));
the gate must be reached through a session that holds one.

**6 — The two reference guards are green at close, and `test/prove-red.sh` gains at least two durable
mutations that each PROVE RED.**
`node --test test/reference-integrity.test.js` and `node --test test/coordination-citation-policy.test.js`,
plus `0388`'s mutations over the sprint-mover prose pins and `dashboard.sh`'s `successor` mode.
⛔ **HOW IT FAILS:** either guard red; or a mutation added that does **not** demonstrate red when
applied ([ADR-026](../knowledge-base/decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md) discipline
— a guard nobody has shown can go red is not a guard).

**7 — `0389`'s numbers are RE-MEASURED at pickup and reconciled against the brief's own figures in
writing.**
Its brief records `26`→`28` and `16`→`18` measured 2026-09-12, and separately flags a third instance
(`"13 real files"`) whose two scope readings disagree (15/16 vs 18/19).
⛔ **HOW IT FAILS:** shipping the brief's numbers without a fresh measurement; or a fresh measurement
that disagrees with the brief and is silently reconciled rather than stated.

**8 — `0194`'s brief contains ZERO false premises at close, all three re-verified against disk.**
⭐ **RESTORED 2026-09-14 — the owner's approved proposal text, absent from the seven.** Scored on
**`P6` (`0221`)**.
⛔ **HOW IT FAILS:** any one of `0194`'s three premises is still false at close.

> ### ⛔⛔ WHY THIS CRITERION EXISTS, AND WHY ITS ABSENCE WAS THE WORST OF THE THREE DROPS
>
> **`0221` is not an open question — it is a FULLY-SPECIFIED, OWNER-RULED REPAIR that sat unexecuted
> for a month.** The ruling is on its brief: **2026-08-14, verbatim option label *"Widen to premise 3
> (Recommended)"***, which widened step 2 from *"correct premise 2 only"* to **correct premises 2 and
> 3 in one pass**.
>
> ⛔ **That is exactly why `0194` still carries false text today.** ⭐ **Closing `0221` without
> verifying the three premises would reproduce the precise failure the task exists to fix** — a premise
> list treated as permanent instead of as a snapshot. ⛔ **Criterion 1 alone cannot catch that:** a
> mover-set `✅ Done` says something closed the row, not that the premises are true.
>
> ⚠️ **Premise 1 was measured genuinely TRUE on 2026-08-14 — ⛔ repair only what is measured false**,
> and the brief's step 1 still governs: **re-derive all three on disk at pickup, do not copy the
> brief's table.**

**9 — The reconcile-mode ADR EXISTS, AND is owner-approved, AND its "must never" list NAMES the
agent-closed marker.**
⭐ **RESTORED 2026-09-14 — the owner's approved proposal text, absent from the seven.** Scored on
**`P5` (`0134`)**. ⛔ **All three conjuncts, or the criterion is missed.**
⛔ **HOW IT FAILS:** the ADR written but **unapproved**; or approved but **omitting the marker
constraint**.

> ### ⛔⛔ THIS RESTORATION MATTERS MOST OF THE THREE — IT MAKES AN OWNER CONDITION CHECKABLE AGAIN
>
> **The dropped criterion encoded the exact condition the owner attached when they ruled `0134`.** ⛔
> **Read both constraints from `0134`'s own brief — they are recorded there, not here** —
> [`0134`](../tasks/backlog/0134-decide-the-sanctioned-repair-path-for-a-half-landed-close/brief.md),
> under its Q5 detection-rule answer, verified present 2026-09-14:
>
> 1. **The mode MUST REFUSE when both locations already agree** — a run with no live disagreement is
>    not a reconciliation.
> 2. **The mode MUST NEVER upgrade the agent-closed marker** — `✅ Done (agent-closed — not
>    owner-verified)` must never become plain `✅ Done` through this mode.
>
> ⛔ **Without this criterion, an ADR that silently dropped either constraint would still score a clean
> board.** ⭐ **With it, the omission is a MISS.**

**10 — This board is closed by `/fkit-sprint-done`, and the close is observable.**
At close: `select-active` returns **`active none`, exit 3**, **and** `ai-agents/sprints/done/sprint-9.md`
carries a **`✅ Done` line-3 banner NAMING `/fkit-sprint-done`** as what archived it.
⛔ **HOW IT FAILS:** a hand archive. ⭐ **A hand archive reproduces the file location and nothing else**
— the mover-named banner is producible only by the mover actually running. This is Sprint 8's
criterion (b) reading 2, reused verbatim in shape because it is the one clause here that cannot be
faked.

## 📊 THROUGHPUT BASIS FOR THE FIVE-DAY WINDOW — AND ⚠️ WHY THE INSTRUMENT CAN LIE

**The window (T2: opens 2026-09-14, closes 2026-09-19, five days, seven rows) rests on a measured
figure: ~1.4 board rows per day across Sprints 6, 7 and 8.**

**How it was derived, re-measured on disk 2026-09-14:**

| Sprint | Rows on the board | Opened | Closed |
|---|---|---|---|
| **6** | **21** | 2026-08-15 (the plan file's first commit) | 2026-08-29 |
| **7** | **15** | 2026-08-14 (*"opened unranked on 2026-08-14"*, the board's own words) | 2026-09-08 |
| **8** | **7** | 2026-09-10 (ruling `S1`, the board's authority block) | 2026-09-13 |
| **Total** | **43** | **2026-08-14** (earliest open) | **2026-09-13** (latest close) |

**43 rows over a 31-day calendar span = 1.39 rows/day.** ⚠️ **The three windows OVERLAP** — Sprint 6
and Sprint 7 ran concurrently — so the figure is *rows closed per calendar day by the team*, **not**
per-sprint velocity. ⛔ **Summing the three windows separately (14 + 25 + 3 = 42 days) gives 1.02/day
instead, and that reading is also defensible.** Seven rows in five days needs **1.4/day** — the
optimistic reading exactly, with no margin.

### ⚠️⚠️ THE INSTRUMENT CAN LIE, AND THE NEXT READER MUST RE-CHECK IT

⛔ **A closed board reads 100% done BY CONSTRUCTION.** `/fkit-sprint-done` **relocates every still-open
row** off the board — to the next non-terminal sprint or to the Backlog board — **before** archiving
it (ADR-047 §4). ⛔ **So a board that shipped three of seven rows and relocated four archives showing
three rows, all Done.** Row counts taken off archived boards therefore measure *rows that finished*,
never *rows that were attempted*, and a velocity computed from them is biased **upward** by exactly
the amount of work that was descoped.

⭐ **Verified for these three specifically, 2026-09-14, and this is what makes the 1.4 usable:**
counting the leading status cell of every row in each board's `## Status` table —

- **Sprint 6** — 21 rows, **21** `✅ Done`, **zero** `➡️ Moved`.
- **Sprint 7** — 15 rows, **14** `✅ Done` + **1** `⛔ Cancelled` (*"red set is 0; nothing to clean"*),
  **zero** `➡️ Moved`.
- **Sprint 8** — 7 rows, **7** `✅ Done`, **zero** `➡️ Moved`.

⛔ **Zero relocation events across all three. The denominator is clean for these boards and only these
boards.** ⚠️ **This check is NOT self-maintaining.** ⛔ **Whoever next quotes ~1.4 rows/day must re-run
the `➡️ Moved` count over whatever boards they are averaging — including this one.** The moment a
sprint closes with a relocation, the figure silently inflates and nothing goes red.

## ⛔ WHAT THIS BOARD DELIBERATELY LEAVES OUT — AND WHY, ROW BY ROW

**Naming the omissions, so a later reader can tell a scoped board from a partial one.**

| Left out | Why |
|---|---|
| [`0383`](../tasks/backlog/0383-shrink-the-backlog-board-whose-task-cells-are-being-used-as-a-document-store/brief.md) | ⭐ **OWNER-RULED 2026-09-14, verbatim option label "Its own sprint, later (Rec)".** ⛔ **It gets its own sprint.** Not deferred by omission and not forgotten — **ruled**, and the ruling is recorded here and on the row |
| [`0332`](../tasks/backlog/0332-decide-and-implement-inits-behaviour-when-fkit-interview-is-a-hard-link/brief.md) and [`0329`](../tasks/backlog/0329-decide-and-implement-inits-behaviour-when-gitignore-is-a-symlink/brief.md) | ⭐ **OWNER-RULED 2026-09-14, verbatim option label "Leave them out (Rec)".** **Decay-first holds**: the `architecture.md` and citation rot on this board regenerates while it sits; the symlink cluster does not. ⛔ **Their rulings are recorded on their own briefs, so nothing perishes by leaving them off.** ⭐ **They are FIRST IN LINE FOR SPRINT 10** |
| [`0189`](../tasks/backlog/0189-build-the-skill-ownership-site-registry-and-completeness-tripwire/brief.md) | ⚠️ **DEFERRED TO SPRINT 10 on this producer's own two-sprint-arc argument, not on a ruling.** It is a registry-plus-tripwire build — a two-sprint arc that would open here and finish elsewhere, and a five-day window is the wrong place to start one. ⛔ **A producer judgement, flagged as such** |
| The rest of the symlink cluster — `0045`, `0330`, `0334`, `0336` | ⛔ **Sprint 8's own omissions table already recommended the cluster get its own board and its own criterion.** Splitting two members onto a repair board would be the thing that recommendation warns against. ⚠️ **Still a recommendation, not a ruling** |
| The Backlog board's remaining rows, as a class | ⛔ **That board is an ARCHIVE OF KNOWN ISSUES, owner-ruled 2026-08-29** (verbatim *"Rank Sprint 7; declare backlog an archive (Rec)"*), and ranking happens **at pull time**. A row not pulled here is not thereby deprioritised — it is unranked, which is what that board is |

## ⚠️ `0134`'s Q6 MEASUREMENT WAS TAKEN AGAINST AN UNCOMMITTED WORKING TREE — RE-MEASURE BEFORE WRITING

⛔ **Flagged here as well as on the row, because an ADR that records a state which does not survive the
next commit is worse than no ADR.**

[`0134`](../tasks/backlog/0134-decide-the-sanctioned-repair-path-for-a-half-landed-close/brief.md)'s
dated correction of 2026-09-13 carries a re-measurement for its **question 6** — the asymmetry between
the two task movers' repair exceptions (`/fkit-task-done` has two, both owner-only;
`/fkit-task-cancelled` has none at all). ⚠️ **Its own caveat, recorded in the brief:** both mover
`SKILL.md` files carried **uncommitted working-tree edits from task `0381`** at measuring time, so the
figures are *the on-disk state of 2026-09-13*, not a committed state.

⛔ **The ADR author MUST re-measure both files before writing question 6's answer**, and must state the
commit the measurement was taken at. ⭐ **Corroborated 2026-09-14: `0381` has since closed and its
edits are committed** — so the numbers may well now be stable, **and that is a reason to re-measure,
not a reason to skip it.** ⛔ **Do not copy the brief's figures.**

## ⚠️ WHAT THIS PRODUCER DECIDED THAT NOBODY RULED — FLAGGED, NOT BURIED

⛔ **Four judgements below are this spawned producer's, made under the five rulings and named so the
owner can overturn any of them in one edit.**

1. **The `P1`–`P7` ordering itself.** T1 approved the seven rows; ⛔ **it did not fix their ranks.**
   The order is this producer's, argued row by row in each cell's *"WHY `P<n>`"* clause. **Except
   `0392` at `P1`, which the owner's front-load instruction fixes.**
2. **Rank = run order on this board** (see that section). Sprint 8 ruled the opposite shape for itself;
   ⛔ **neither is a convention, and this board says which it chose and why.**
3. **`0189`'s deferral to Sprint 10** — an argument, not a ruling, and marked as one in the omissions
   table.
4. **The success criteria other than 4** — ⚠️ **PARTLY SUPERSEDED 2026-09-14.** The list is now **ten**, and criteria **2**, **8** and **9** are the owner's own approved proposal text, RESTORED after a driver-side diff found they had drifted or been dropped. ⭐ **What remains this producer's** is criteria **1** and **5** (additions the owner reviewed and kept) and **3**, **6**, **7**, **10** (re-derivations the diff did not disagree with). ⛔ **Criterion 4 is owner-ruled (T3) and unchanged.** See the per-criterion provenance table in that section.

⛔ **Nothing on the Backlog board was re-ranked, renumbered or re-statused by this pull** beyond the
seven `➡️ Moved` markers the **Off:** procedure requires, plus one new row appended last (`0394`).

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | P1 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-14** — *"Approve — write the board (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.**  **`architecture.md` prose repair — §9.1's inventory, §9.1's occurrence B, and §9.5's residuals** *(**owner ruling 2026-09-13**, live via `AskUserQuestion` in the `fkit lead` session, **verbatim option label: "Consolidate into one brief (Rec)"** — the alternatives *keep separate but co-scheduled* and *leave alone* were DECLINED; ⛔ **a re-scoping act authorised by that ruling and nothing else** — a previous producer surfaced it and correctly refused to do it unasked. ⭐ **Replaces five cancelled rows**, each traceable in the brief's provenance map: `0251` → Group A + OD1 · `0376` → Group B (its item 6 **discharged by construction**) · `0366` → Group C + OD2 · `0286` → Group D + OD3 · `0323` → Group E + OD4/OD5. ⚠️ **Three of the five targeted the SAME section** — ⛔ `0251` is §9.1, NOT §9 as the hand-over said. ⛔⛔ **EVERY PREMISE PREDATES THE CURRENT FILE AND MUST BE RE-DERIVED AT PICKUP** — measured 2026-09-13, **none** of the five was made a no-op by Sprint 8, whose only `architecture.md` commit (`+4 / −4`, from `0341`) touched §4.2 and §6 and **nothing in §9**; `0286` is **PARTIALLY** satisfied — by `0356` in **Sprint 7**, not Sprint 8 — with ≥7 outbound coordinates still stale and half B never run. ⚠️ **Internal order matters: `B → A → C → E → D`** — Group D's deliverable IS line arithmetic, so it runs last against a settled file. ⛔ **Five open decisions, none settled: OD1** (owner-deferred, verbatim *"Leave it for 0251's own run"* — ⚠️ the hand-over named only `0366` as decision-shaped and **missed this one**) **· OD2** (should §9.5 exist at all — ⭐ `0366`'s decision **survives intact** and needs the owner, but **not a row of its own**) **· OD3 · OD4 · OD5**. ⚠️ **Group E is REPO-WIDE**, not `architecture.md` — its census re-measured at **110 sites / 27 files** vs the original's 66; ⭐ **the natural split, if the owner wants one, is A–C from D–E, in one edit**. ⚠️ **Owner field is a producer judgement, FLAGGED** — the five disagreed (`0251`/`0376`/`0286` were `fkit-coder`; `0366`/`0323` `fkit-architect`); ADR-044 fixes role by deliverable and Group A is the coder-shaped exception. ⛔ No wiki-vault write (ADR-005), ⛔ no re-rank (ADR-035), ⛔ no commit. **⭐⭐ SPLIT 2026-09-13 BY OWNER RULING — THIS ROW WAS NARROWED.** Verbatim option label ***"Split A–C from D–E (Rec)"***, given live via `AskUserQuestion` in an `fkit lead` session with the owner present. **Groups D and E — the two citation sweeps, from `0286` and `0323` — moved out to `0393`.** This row keeps **Groups A, B and C** (the genuine `architecture.md` prose repair, from `0251`, `0376`, `0366`) plus **OD1** and **OD2**. ⛔ **Nothing was dropped** — both briefs carry a provenance map and every original's scope is traceable. ⛔ **The five cancelled originals are NOT resurrected**; both rows cite them as provenance only. ⛔⛔ **This row BLOCKS `0393` — hard, not a preference:** `0393`'s deliverable is line arithmetic over the file this row rewrites, and it waits on **OD2**'s answer (whether §9.5 survives at all). ⚠️ **Retitled and its folder slug renamed** to match the narrowed scope; the only inbound reference to the old slug was this href, repointed in the same edit. ⛔ Nothing renumbered, nothing re-ranked)* ⭐ **WHY `P1` — THE OWNER FRONT-LOADED THIS ROW, AND IT IS THE ONE RANK ON THIS BOARD THAT IS NOT THE PRODUCER'S CHOICE.** ⛔⛔ **IT CARRIES TWO UNSETTLED DECISIONS THAT NEED THE OWNER AT ITS PLAN GATE — `OD1` AND `OD2` — AND `OD2` GATES `P7` (`0393`).** See §"⛔⛔ THE BOARD'S SINGLE BIGGEST RISK" above, which is the full statement and is deliberately placed at the top of this board rather than in this cell. ⭐ **`OD1` is OWNER-DEFERRED with its trigger set to this row's run** (verbatim *"Leave it for 0251's own run"*, 2026-08-13) — ⛔ so reaching this row IS the trigger firing, and running it without asking discharges a deferral by ignoring it. ⚠️ **`OD2` has NO ruling at all.** ⛔⛔ **EVERY PREMISE IN THIS BRIEF PREDATES THE CURRENT FILE — its own words — SO RE-DERIVE ALL OF THEM AT PICKUP.** ⚠️ **Internal order matters and the brief fixes it: `B → A → C`** (Group D's line arithmetic, which used to run last, is now `0393`). ⚠️ **The `## Owner` field is `fkit-architect` and the brief FLAGS it as an unsettled producer judgement** — the three cancelled originals disagreed and Group A is coder-shaped; ⛔ **this board does not settle it, and a run that needs it settled should raise it at the plan gate rather than assume.** **Depends on: nothing. Blocks `0393` — hard.** ⛔ Success criteria **2**, **3** and **5** are all scored on this row. ⚠️ **RENUMBERED 2026-09-14** — these were criteria 2 and 3 before the criteria section was corrected; criterion **2** is now the restored `§9.1`-names-every-suite command (⛔ **29 on disk against 8 named, measured today**) and it is scored on this row too. | [`0392-architecture-md-prose-repair-9-1-inventory-9-1-occurrence-b-and-9-5-residuals`](../tasks/backlog/0392-architecture-md-prose-repair-9-1-inventory-9-1-occurrence-b-and-9-5-residuals/brief.md) |
| 🔲 Backlog | P2 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-14** — *"Approve — write the board (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.**  ⛔ **`0341`'s two new guarded surfaces have NO `prove-red.sh` mutation — a guard nobody has shown can still go red** *(**owner ruling 2026-09-12**, given live via `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`, option label verbatim **"File a follow-up task (Rec)"** — ⛔ the ruling is **file it, decide nothing**; ⭐ **the precedent is `0381`**, whose two byte-exact prose pins got **durable mutations 33 and 34** in `test/prove-red.sh` (33 inverts `fkit-task-done`'s delete rule → `T3` must red; 34 leaves `fkit-task-cancelled`'s board word un-swapped → `T11` must red) — and ⭐ **mutation 34's own comment already names this task's subject**, existing so the uniformity half is not *"permanently unexercised in this gate"* … *"before task 0341 pastes the clause a third and fourth time"*; ⛔ **`0341` pasted it a third and fourth time and added no mutation** — `test/prove-red.sh` verified **unmodified in the working tree** 2026-09-12; ⚠️ **TWO SEPARATE `S`-series, in two files, and the hand-over ran them together — corrected in the brief, not silently**: **(1)** `test/mover-exemption-step.test.js`'s SPRINT-mover roster **`S0`–`S6`** (seven tests: roster completeness, subjects present once, board-dependent sentences, post-`git mv` placement, uniformity modulo the board word, no task-mover sweep premise, disjoint rosters) — ⛔ grepped 2026-09-12, `\bS[0-9]\b` returns **exactly `S0`–`S6`, there is no `S7`** — pinning the same clause across **four** skill copies now; **(2)** `test/dashboard-contract.test.js`'s **`ADR-047 successor S1`–`S10`** — the ten tests whose names open `ADR-047 successor S<n>:`, under the comment *"ADR-047 §3.0.2 / FOLLOW-UP 2 — the `successor` mode (task 0341)."* — covering `mode_successor()` in `claude/skills/fkit-status/dashboard.sh` (defined at its `mode_successor() {` line, dispatched from the `successor)` case arm) — ⭐ **this is the series the hand-over's evidence actually cites**, and only it has an `S7`; ⛔ **neither series has a single `prove-red.sh` entry**; ⚠️ **the by-hand evidence is EVIDENCE, NOT A GATE** — `0341`'s builder mutated `mode_successor` **once, during the build**, on a scratch copy (negation-vs-swap trap → redded `successor S6`; dropping `🔲 Backlog` from the filter → `S3`+`S4`; non-strict ordering → `S4`+`S7`), and ⛔ nothing in the repo repeats it, so nothing notices when it stops holding; ⛔ **FRAME ONLY — count, targets and split are the plan gate's**: est. **~2–4 mutations, ~60–120 s** on an already **~9-minute** gate, a number **to measure, not to trust**; reuse the existing `run_mover_step_suite` / `run_dashboard_suite` helpers and mutations 33/34's discipline (injected marker only where the prose could occur naturally, four landing checks, red **at the named assertion**, anchors verified unique); ⛔ **no assertion in either test file is rewritten** — a pin that must be weakened to red a mutation is a finding, not a fix; ⛔ no edit to `dashboard.sh` or any mover `SKILL.md` (mutations run on copied trees), ⛔ no renumbering of mutations 1–34, ⛔ no `wiki-vault/` write (ADR-005), ⛔ no new devDependency (ADR-014), ⛔ no re-rank (ADR-035); **depends on `0341` — hard: neither surface exists until it lands**; blocks nothing; ⭐ **owner: `fkit-coder`** — `test/prove-red.sh` is a coder surface and [ADR-044](../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) Decision 1 fixes the role by the deliverable; ⭐ **on merit this belongs directly below `0341`**, worth most while the surface is fresh and least once the code has drifted from a one-off measurement — ⛔ unranked here by ADR-035, recorded for the owner; filed UNRANKED and **APPENDED LAST** by a spawned `fkit-producer` with no owner channel ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)), renumbering and inserting nothing ([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)), and touching no Sprint 8 row)* ⚠️ **DATED CORRECTION 2026-09-13 — the `depends on 0341 — hard` clause above is DISCHARGED; the cell text before this note is left byte-identical.** `0341` closed **2026-09-13** (`tasks/done/0341-build-the-producer-only-sprint-movers-fkit-sprint-done-and-fkit-sprint-cancelled/`), shipping BOTH sprint movers, so *'neither surface exists until it lands'* is now FALSE. **Current dependency: nothing — this row is RUNNABLE.** ⛔ Not `🔄 In progress`. ⚠️ Re-measure both `S`-series at pickup — the counts were taken 2026-09-12 while `0341` was in flight. Brief carries the same dated correction on its own declaration, which is untouched. ⭐ **WHY `P2`:** it is the cheapest row on this board and it hardens the thing **this board will itself be closed by**. `0341` shipped the two sprint movers in Sprint 8 and left both new guarded surfaces — the movers' prose pins and `dashboard.sh`'s `successor` mode — **with no `prove-red.sh` mutation at all**, so nobody has shown either guard can go red. ⛔ **Success criterion 10 closes this board with `/fkit-sprint-done`; running that mover unmutated is the wrong order.** *(was criterion 7 before the 2026-09-14 renumber.)* ⚠️⚠️ **ITS `Depends on:` BULLET STILL READS `0341` AND IS DISCHARGED, NOT LIVE** — the brief's dated correction of 2026-09-13 says so in as many words (*"THIS DEPENDENCY IS DISCHARGED … Current dependency: nothing"*), and `0341` is closed under `ai-agents/tasks/done/`, verified 2026-09-14. ⛔ **A reader who parses only the bullet will call this row blocked. It is not.** ⚠️ **Re-measure the `S`-series at pickup** — the brief records that a hand-over got the numbering wrong across two different test files. **Current dependency: nothing. Blocks: nothing.** ⛔ Success criterion **6** is scored partly on this row: ~2–4 durable mutations, **each proving red**. *(was criterion 5 before the 2026-09-14 renumber.)* | [`0388-give-the-sprint-mover-pins-and-the-successor-mode-durable-prove-red-mutations`](../tasks/backlog/0388-give-the-sprint-mover-pins-and-the-successor-mode-durable-prove-red-mutations/brief.md) |
| 🔲 Backlog | P3 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-14** — *"Approve — write the board (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.**  ⛔ **Skills and scaffold pages name the selector and the ownership hook by a repo-only `claude/…` path that a consuming project does not have** *(**owner ruling 2026-09-12**, given live via `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`, option label verbatim **"Residual + one sweep task (Rec)"** — the residual half is recorded in `0339`'s review ledger by a coder; ⛔ the ruling is **file it, do it later**; `0339` round-1 review **R5**; **measured on disk 2026-09-13 — re-derive at pickup, do not copy**: **13 certain sites in 6 files**, in two classes — **(A)** 8 runnable `bash claude/skills/fkit-status/dashboard.sh …` lines across `fkit-sprint-done` (4), `fkit-sprint-cancelled` (2) and `fkit-sprint-ship-loop` (2), and **(B)** 5 repo-only `claude/…` paths inside scaffold-shipped convention prose; ⛔ **one measured FALSE POSITIVE — `claude/skills/fkit-heal/SKILL.md` line 51 is CORRECT as written** (it deliberately contrasts *"in this repo's own checkout"* against the `.claude/` form three lines above) and any grep-built sweep must exclude it by name; ⚠️ **the `.claude/` form is already the majority (13 sites) and is what the script's own invocation banner declares**, so the three sprint skills contradict the documented form of the very script they call; ⭐ **`0339` added only 2 of the 13** (the ship-loop's new selector call and the new scaffold page's hook reference) **and replicated an existing pattern rather than inventing one** — R5's exact sentence has shipped in the sibling page `task-status-vocabulary.md` since 2026-07-19; ⛔ **why it was NOT partially fixed, and the reasoning the owner accepted: a partial fix leaves the ship-loop internally inconsistent, using both forms in the same file — it is a sweep or it is nothing**; ⚠️ **Codex rated one instance `high`; the reviewer REDUCED it to `low`** on traced blast radius (pre-existing, repo-wide, already shipping) — both the label and the reduction are recorded so a later reader does not re-inflate it; ⛔ **nothing is red** — no test pins the path form, the cost is an agent in a consuming project running a command that cannot resolve; ⛔ **class B is NOT a mechanical replace** — each install location must be verified against `claude/fkit-claude-init.sh` first; ⛔ **ADR and report citations of `claude/skills/…` with a line number are SOURCE COORDINATES into this repo and are OUT OF SCOPE** (ADR-047 alone holds ~20); ⚠️ two further sites naming `claude/scaffold/` itself need **triage, not silent rewriting**; ⛔ **depends on NOTHING**, blocks nothing — `0339` is causal context, not a dependency; ⭐ **owner: `fkit-coder`** — every surface is *scaffold* or *prose under `claude/`*, two of [ADR-044](../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) Decision 1's own named skill-less categories, and no producer skill writes `claude/`; filed UNRANKED and **APPENDED LAST** by a spawned `fkit-producer` with no owner channel ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)), renumbering and inserting nothing ([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)), and touching no Sprint 8 row)* ⭐ **WHY `P3` — IT IS THE ONLY ROW ON THIS BOARD A CONSUMING PROJECT CAN ACTUALLY FEEL.** Every other row repairs a record inside this repo; this one fixes **8 runnable command lines** that name a `claude/…` path an installed project does not have, so an agent in a consuming project runs a command that cannot resolve. ⭐ **Ranked above the two documentation-truth rows for exactly that reason.** ⛔ **It is a sweep or it is nothing** — the owner accepted that reasoning when ruling it filed (*"Residual + one sweep task (Rec)"*, 2026-09-12); a partial fix leaves the ship-loop using both path forms in one file. ⚠️ **Class B is NOT a mechanical replace** — each install location must be verified against `claude/fkit-claude-init.sh` first. ⛔ **One measured FALSE POSITIVE is fenced off BY NAME in the brief** (`fkit-heal`'s SKILL page, which deliberately contrasts the two forms); any grep-built sweep must exclude it. ⛔ **Re-measure the 13 sites at pickup** — the census is dated 2026-09-13. **Depends on: nothing. Blocks: nothing.** | [`0390-sweep-the-repo-only-claude-path-form-out-of-installed-facing-skill-and-scaffold-prose`](../tasks/backlog/0390-sweep-the-repo-only-claude-path-form-out-of-installed-facing-skill-and-scaffold-prose/brief.md) |
| 🔲 Backlog | P4 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-14** — *"Approve — write the board (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.**  ⛔ **`dual-home-parity.md`'s mirror claims 26 module entries — the module holds 28, and one entry has no row at all** *(**owner ruling 2026-09-12**, given live via `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`, option label verbatim **"File it as its own task (Rec)"** — the alternative offered was folding it into `0339`, and the owner chose to keep `0339` inside its approved boundary; ⛔ the ruling is **file it, do it later**; **the defect**: `ai-agents/knowledge-base/conventions/dual-home-parity.md` asserts *"The mirror is COMPLETE as of 2026-08-01: all 26 module entries appear above — 16 file entries and 10 directory entries"* and then instructs *"If you add an entry to the module, add its row here in the same change"* — ⛔ **measured on disk 2026-09-12 against the authoritative `test/dual-home-parity-exceptions.mjs`: 28 total, 18 file entries, 10 directory entries**, so the total and the file count are each **wrong by two** and only the directory count is right; ⭐ **the number alone cannot be made true** — cross-checking all 28 entries against the table, **exactly one has no mirror row anywhere**: **`.fkit-accepted-drift`** (`kind: 'live-only'`, the task-`0247` launch-notice intent file, added to the module by commit `fab400b` on 2026-08-07 and never mirrored; grepped 2026-09-12, the string `accepted-drift` does not occur in the page at all) — the table mirrors **17** file entries while claiming **16**, against a module holding **18**, so ⛔ **the fix is a row AND a number**; ⭐ **`0339` fully honoured the rule and did not cause this** — its own new entry `knowledge-base/conventions/sprint-status-vocabulary.md` **is** in the mirror (plan step 4 done); it moved the module 27→28 and the mirror 16→17 and left the stale numbers untouched, so ⛔ **the gap is pre-existing and independent**; ⚠️ **NOTHING IS RED AND NOTHING WILL GO RED** — no test pins the count (`test/dual-home-parity.test.js` asserts parity behaviour, never the page's prose; grepped 2026-09-12, no assertion in `test/` references the `26`, the `16`, or the mirror's completeness), so this is a **documentation-truth defect, not a build failure** — its whole cost is that a reader who cannot find a path in the table concludes it is byte-enforced when the module says it is not, which is the exact failure the page's own *"a partial mirror is worse than none"* warns about; **scope: TWO edits in ONE file** — add the `.fkit-accepted-drift` row in the table's existing one-clause-gloss style, and change `26`→`28` and `16 file entries`→`18 file entries`, ⛔ **leaving `10 directory entries` alone because it is correct**; ⛔ **re-measure at pickup, do not copy these numbers**; ⚠️ **the page is `fkit-repo-only`** — on its own exception list, shipping to no scaffold, so ⛔ there is no second copy to keep in step and adding one is a regression the module names by name; ⛔ **no change to `test/dual-home-parity-exceptions.mjs`** (it is correct, the page is stale), ⛔ **no change to any file under `test/`**, ⛔ **no new test pinning the count** (whether that guard is owed is a plan-gate question, not this task's to decide), ⛔ no `wiki-vault/` write (ADR-005), ⛔ no new devDependency (ADR-014), ⛔ no re-rank (ADR-035); ⚠️ **two adjacent stale comments recorded, NOT fixed** — `test/dual-home-parity.test.js`'s `REASON_FLOOR` calibration cites *"26 live entries … shortest 84 … longest 732"*; re-measured over 28, **shortest is still 84** (`wiki-vault/.fkit`) and **longest is now 749** (`sprint-status-vocabulary.md`), so ⭐ **the floor's conclusion holds and nothing is unsafe** — but the ruling covered the convention page, not `test/`; ⭐ **A THIRD INSTANCE of the same class was FOLDED IN on 2026-09-13** by a further owner ruling (option label verbatim **"Fold into 0389 (Rec)"**, `0339` review **R6**): `test/dual-home-parity-exceptions.mjs` line 199 claims the scaffold ships *"13 real files"* — re-measured 2026-09-13, `claude/scaffold/ai-agents/` (the module's own home root, per its header) holds **15** at `HEAD` and **16** in the working tree with `0339`'s uncommitted page, against **19** for the whole `claude/scaffold/` tree, so ⚠️ **the implementer must settle the scope before writing a number**; ⚠️ it was **already wrong the day it was written** (**14** real files at commit `7a444c5`, 2026-08-01); ⛔ **not test-pinned, nothing red**, and ⛔ **recorded in the brief, NOT fixed** — it is `test/` too, so the same plan-gate question; **est. one table row and two numbers, under a minute** — the verification costs more than the fix, which is normal for a truth-of-record defect and not a reason to skip it; ⛔ **depends on NOTHING**, blocks nothing; ⭐ **owner: `fkit-coder`** — the deliverable is a convention page that **names no producing skill** in `skills_for_role()` (`/fkit-record-decision` produces an ADR, `/fkit-task-brief` a brief, `/fkit-wiki-ingest` a vault page; none produces a convention page), and [ADR-044](../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) **Decision 1** fixes the role as the owner of the skill the deliverable is produced by, its skill-less clause staffing a deliverable that names none — *"source, tests, scaffold, prose under `claude/`, coordination-doc repairs"* — to the coder as sole source-write authority; the task's other named artifact, `test/dual-home-parity-exceptions.mjs`, is a test-adjacent module and coder territory too, though this task does not edit it; filed UNRANKED and **APPENDED LAST** by a spawned `fkit-producer` with no owner channel ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)), renumbering and inserting nothing ([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)), and touching no Sprint 8 row)* ⭐ **WHY `P4`:** the smallest true-record repair here — one table row and two numbers — and it sits directly below `0390` because both are documentation-truth defects Sprint 8's review rounds surfaced, and this one is internal where `0390` is installed-facing. ⚠️ **Nothing is red and nothing will go red** — no test pins the count — so this row's entire cost is that a reader trusts a mirror that is silently incomplete, which is the exact failure the page's own *"a partial mirror is worse than none"* warns about. ⛔⛔ **SUCCESS CRITERION 7 IS SCORED ON THIS ROW AND IT IS NOT SATISFIED BY SHIPPING THE BRIEF'S NUMBERS.** *(was criterion 6 before the 2026-09-14 renumber.)* The brief's `26`→`28` and `16`→`18` were measured **2026-09-12**; the folded-in third instance (`"13 real files"`) has **two scope readings that disagree** (15/16 vs 18/19) and the brief says the implementer must settle the scope before writing a number. ⛔ **Re-measure, and state any disagreement with the brief in writing rather than reconciling it silently.** **Depends on: nothing. Blocks: nothing.** | [`0389-add-dual-home-parity-md-s-missing-fkit-accepted-drift-row-and-correct-its-stale-mirror-count`](../tasks/backlog/0389-add-dual-home-parity-md-s-missing-fkit-accepted-drift-row-and-correct-its-stale-mirror-count/brief.md) |
| 🔲 Backlog | P5 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-14** — *"Approve — write the board (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.**  Decide the sanctioned repair path for a half-landed close — ADR *(0123 R1/R6; a close that moves the folder but leaves a status/href stale is repairable by **nobody but the owner**; **"do nothing" is a valid outcome** — it touches the anti-laundering boundary ADR-033 just set; blocks 0135; owner: fkit-architect; **⚠️ DATED NOTE 2026-08-06 — overlap with `0229`, recorded so neither task is surprised.** `0229` covers a **subset of this ADR's question 3** (*"the brief's own `## Status` when the board is the side that landed"*). Owner ruling, verbatim ***"Ship 0229 standalone."*** (`AskUserQuestion`, live `fkit lead` session, 2026-08-06) — **this ADR is deliberately NOT narrowed**; the *"narrow 0134"* option was rejected by name and question 3 stays as written. ⚠️ **By the time this ADR is written, a narrow owner-gated exception for that case may ALREADY be shipped in `claude/skills/fkit-task-done/SKILL.md` — read the file, and rule explicitly on whether the wider mode subsumes, keeps or replaces it.** An accepted scope overlap, not a defect. **⭐ OWNER RULING 2026-09-13 — question 1 is SETTLED: the mode exists.** Verbatim option label ***"Producer-only reconcile mode (Rec)"***, given live via `AskUserQuestion` in an `fkit lead` session with the owner present. A **spawned producer** may repair a half-landed close; the *"keep it owner-only"* alternative is rejected, so **`0135` is not cancelled**. ⛔ **Two constraints the owner accepted the option ON, binding on the ADR:** the mode **must REFUSE when both locations already agree**, and **must NEVER upgrade the agent-closed marker** to plain `✅ Done`. Owner's stated reason: the value is **not the mode** but that it **forces a written must-never list and a precise detection rule onto the record**. ⚠️ Question 6's asymmetry **re-measured on disk 2026-09-13**: `/fkit-task-done` has **two** repair exceptions, **both owner-only** (`SKILL.md:81-107`); `/fkit-task-cancelled` has **no repair exception at all** (`SKILL.md:85`) — so the mirror mode would open a **first** door there, not widen one. ⛔ Still `🔲 Backlog` — the ADR is now **writable, not written**.)* ⭐ **WHY `P5`:** it is the only row here that produces a **decision record** rather than a repair, and three of its seven questions were settled by the owner on 2026-09-13 (verbatim *"Producer-only reconcile mode (Rec)"*) — ⭐ **so it is writable now, which it was not before.** It also **blocks `0135`**, which is the only row on this board with a downstream row waiting on it. ⚠️ **It is ranked below the three repair rows because it is the one row whose value survives being late** — a decision record written on day 5 is worth what it is worth on day 1, and rot is not. ⛔⛔ **ITS QUESTION-6 MEASUREMENT WAS TAKEN AGAINST AN UNCOMMITTED WORKING TREE — RE-MEASURE BEFORE WRITING.** See §"⚠️ `0134`'s Q6 MEASUREMENT" above, which is the full statement. ⛔ **The ADR must state the commit its measurement was taken at.** ⚠️ **Two conditions of the owner's approval are binding on the ADR:** it must refuse when both locations already agree, and it must **never upgrade the agent-closed marker**. ⚠️ **`0135` stays blocked in practice** — the standing *"do not begin `0135` before this ADR is approved"* still applies; only its premise is unblocked. **Depends on: nothing. Blocks `0135`.** ⛔ Success criterion **9** is scored on this row: the reconcile-mode ADR **exists**, **is owner-approved**, **and** its *"must never"* list **names the agent-closed marker** — ⛔ **all three conjuncts, or the criterion is missed.** ⭐ **RESTORED 2026-09-14** — this criterion was ABSENT from the board's first seven, leaving this row gradable by criterion **1** alone; the pointer is recorded in the cell because this is the row whose criterion went missing once already. | [`0134-decide-the-sanctioned-repair-path-for-a-half-landed-close`](../tasks/backlog/0134-decide-the-sanctioned-repair-path-for-a-half-landed-close/brief.md) |
| 🔲 Backlog | P6 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-14** — *"Approve — write the board (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.**  Repair `0194`'s false *"`0190`'s clause does not exist"* premise *(`0194` is open and declares **three prerequisites, all open**; the clause **shipped 2026-08-04** — verified on disk 2026-08-05 as the final bullet of `## Universal hard rules` in `claude/scaffold/universal-rules.md`, with `0190` in `done/`. ⛔ **EXACTLY ONE of the three premises is false — do not "repair" the other two**: `test/skill-ownership-sites.mjs` is **still absent** (`0189` open) and `0191`'s driver-side clause is **still absent** from `claude/skills/fkit-sprint-ship-loop/SKILL.md` (`0191` open), both re-verified 2026-08-05. ⚠️ `brief.md:31` is a **mutable coordinate** — locate the premise by wording. ⛔ `0194`'s `- **Depends on:** 0189, 0190, 0191` line stays **byte-identical**; owner: fkit-producer)* ⭐ **WHY `P6`:** the smallest row on this board — a documentation repair to **exactly one file**, `0194`'s brief — and the last of the parallel lane because nothing waits on it and nothing decays while it waits. ⭐ **Its scope is already owner-settled and needs no gate:** the 2026-08-14 ruling (verbatim *"Widen to premise 3 (Recommended)"*) widened step 2 to premise 3 and spent the earlier narrow instruction. ⛔ **Re-verify all three of `0194`'s premises on disk before editing** — the brief's own correction records that the count went from one false premise to **two** when `0191` closed, which is precisely the kind of drift that keeps happening to this row. ⚠️ **A conflict inside the brief, recorded not resolved:** a `## Notes` bullet reads *"Priority: medium"* while its `## Priority` field read `Unscheduled` until this pull; ⛔ **the field is now `P6` and the prose bullet is stale** — the implementer should say so, not silently reconcile it. ⛔ **No source change.** **Depends on: nothing. Blocks: nothing.** ⛔ Success criterion **8** is scored on this row: `0194`'s brief contains **ZERO false premises at close, all three RE-VERIFIED against disk**. ⭐ **RESTORED 2026-09-14** — this criterion was ABSENT from the board's first seven, leaving this row gradable by criterion **1** alone; the pointer is recorded in the cell because this is the row whose criterion went missing once already. ⚠️ **Premise 1 measured genuinely TRUE on 2026-08-14 — ⛔ repair only what is measured false**, and re-derive all three on disk at pickup rather than copying the brief's table. | [`0221-repair-0194s-false-0190-clause-does-not-exist-premise`](../tasks/backlog/0221-repair-0194s-false-0190-clause-does-not-exist-premise/brief.md) |
| 🔲 Backlog | P7 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-14** — *"Approve — write the board (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.**  **The two citation sweeps — `architecture.md` outbound/inbound, and the repo-wide `ADR-NNN:LINE` class** *(**⭐⭐ CREATED BY THE OWNER-RULED SPLIT OF 2026-09-13**, verbatim option label ***"Split A–C from D–E (Rec)"***, given live via `AskUserQuestion` in an `fkit lead` session with the owner present. **Groups D and E, split out of `0392`** — from the cancelled `0286` (whole-file citation sweep) and `0323` (repo-wide `ADR-NNN:LINE` sweep) — plus open decisions **OD3** (should a guard test catch stale line citations? recommendation required, *infeasible* legitimate), **OD4** (`ADR-013:167` — live pointer or dated worklist?) and **OD5** (case-insensitivity rider on the convention page — raise, ⛔ do not write). ⛔⛔ **`0323` IS REPO-WIDE, NOT AN `architecture.md` TASK** — its sweep spans `ai-agents/` and `claude/`, and `architecture.md` contributes exactly ONE site to it; a reader who scopes it to that file scopes it to about one percent of its real size. ⭐ **Its census RE-MEASURED far larger than the original recorded:** `0323`'s brief carried **66**; a 2026-09-13 re-measure returned **110 occurrences across 27 files**; a re-measure at split time returned **117 across 29 files**, with `claude/` at **0**. ⛔ **All three are dated and they disagree — measure it yourself; E1 demands your own numbers.** ⚠️ **`0286` IS ALREADY PARTLY SATISFIED — by `0356` in SPRINT 7 (commit `351bea3`, 2026-09-04), NOT Sprint 8.** What remains: **≥ 7 outbound coordinates measured stale or wrong** (of ~28 `path:NNN` left in the file, including `claude/fkit-claude.sh:274-285`, which `0286` names BY NUMBER as unfixed), the per-citation census **evidenced nowhere** (`0356` ran a class sweep, not `0286`'s census), and **half B — the inbound half — NEVER RUN, untouched.** ⛔ `0286`'s own brief records neither its split nor its partial completion, so **D0 re-establishes what half A covered before anything else.** ⛔⛔ **Depends on `0392` — HARD, not a preference:** this row's deliverable is line arithmetic over a file `0392` rewrites, and `0392`'s **OD2** may delete §9.5 entirely; no shift map derived beforehand survives either. ⛔ **Running it first guarantees a second pass.** ⛔ **After the split this row has NO prose-repair exception — D4 binds everywhere**; §9.5's stale anchors are `0392`'s Group C alone, which repairs anchor and false claim together. ⛔ **Nothing was dropped by the split** and ⛔ **the five cancelled originals are NOT resurrected** — both briefs carry a provenance map and cite them as provenance only. ⚠️ **Appended last, UNRANKED; nothing renumbered, nothing re-ranked** ([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)). The id was verified free both ways — max task-folder id `0392` and max board-referenced id `0392`, agreeing. ⚠️ **Owner field is a producer judgement, flagged** — `0286` carried `fkit-coder`, `0323` carried `fkit-architect`, and the row cuts both ways; owner: fkit-architect. ⛔ no commit)* ⛔⛔ **WHY `P7`, AND `P7` IS A SCHEDULE, NOT A MERIT JUDGEMENT.** ⭐ **On merit this row sits SECOND, directly below `0392`** — it is the largest row on this board and its own brief records that merit position. **It is ranked last because it CANNOT START EARLIER.** ⛔ **`Depends on 0392` — HARD, and this board does not soften it:** this row's deliverable is line arithmetic over the file `0392` rewrites, and `0392`'s **`OD2`** may delete §9.5 entirely — so **no shift map derived beforehand survives**, and running it first guarantees a second pass. ⛔ **DO NOT RENUMBER TO "FIX" THIS** ([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)); there is nothing here to fix. ⛔⛔ **THE CENSUS IS NOT REPRODUCIBLE AND THAT IS THIS ROW'S FIRST PROBLEM, NOT A FOOTNOTE — see §"⛔⛔ THE `ADR-NNN:LINE` CENSUS" below, where FIVE dated measurements disagree, the largest is 3.6× the smallest, and the disagreement is caused by CASE.** ⛔ **Declare the scope in the plan, in writing, before measuring anything** — success criterion **4** is scored against **that declaration**, so a scope declared narrowly makes the criterion trivial and the board says so. ⚠️ **The `## Owner` field is `fkit-architect` and the brief FLAGS it as an unsettled producer judgement** (`0286` was coder, `0323` architect); ⛔ this board does not settle it. **Depends on `0392` — hard. Blocks: nothing.** | [`0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class`](../tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md) |

## ⛔⛔ THE `ADR-NNN:LINE` CENSUS — SIX DATED MEASUREMENTS THAT DISAGREE, AND THE CAUSE IS **CASE**

⛔ **This section is `0393`'s first problem and success criterion 4's whole difficulty. It is placed on
the board and not left in a brief because the number a reader picks changes what "swept" means.**

| # | Date | Figure | Scope, as recorded |
|---|---|---|---|
| 1 | at `0323`'s filing | **66 occurrences** | scope not recorded |
| 2 | 2026-09-13 | **110 occurrences / 27 files** | scope not recorded; `claude/` measured at **0** |
| 3 | 2026-09-13, at the split | **117 occurrences / 29 files** | scope not recorded |
| 4 | 2026-09-14, relayed to this producer | **125 occurrences / 34 files** | scope not recorded |
| 5 | ⭐ **2026-09-14, measured by THIS producer** | **see the four readings below** | ⭐ **scope recorded, every time** |

### ⭐ THIS PRODUCER'S OWN MEASUREMENT, 2026-09-14 — FOUR SCOPES, FOUR ANSWERS

Pattern `adr-[0-9]{3}:[0-9]+`, over tracked files, no fence or blockquote masking applied:

| Scope | Occurrences | Files |
|---|---|---|
| **Case-SENSITIVE `ADR-`, all tracked files** | **124** | **35** |
| **Case-INSENSITIVE, all tracked files** | ⭐ **444** | ⭐ **67** |
| Case-insensitive, minus `wiki-vault/` | 416 | 62 |
| Case-insensitive, minus `wiki-vault/` and minus closed task folders (`tasks/done/`, `tasks/cancelled/`) | 106 | 26 |

### ⭐ SIXTH MEASUREMENT — RE-VERIFIED 2026-09-14 BY A SECOND PRODUCER, SAME DAY, SAME COMMANDS

⛔ **The four rows above are left BYTE-IDENTICAL and are NOT overwritten** — reproducing a measurement
is the whole subject of this section, so a re-measure is recorded beside the original, never on top of
it. Re-run at `HEAD` `f209a8c` **with an uncommitted working tree** (`git grep` reads the working tree,
so uncommitted edits count):

| Scope | 5th (earlier today) | ⭐ 6th (re-verified) | Drift |
|---|---|---|---|
| **Case-SENSITIVE `ADR-`, all tracked** | **124 / 35** | **124 / 35** | ✅ **exact** |
| **Case-INSENSITIVE, all tracked** | **444 / 67** | ⭐ **446 / 67** | ⚠️ **+2 occurrences, same files** |
| Case-insensitive, minus `wiki-vault/` | 416 / 62 | **418 / 62** | ⚠️ +2 / 0 |
| Case-insensitive, minus vault and closed task folders | 106 / 26 | **108 / 26** | ⚠️ +2 / 0 |

**Commands, so the next reader can reproduce them exactly:**
`git grep -ohE 'ADR-[0-9]{3}:[0-9]+' -- .` (case-sensitive) ·
`git grep -oihE 'adr-[0-9]{3}:[0-9]+' -- .` (case-insensitive) ·
add `':(exclude)ai-agents/wiki-vault/*'`, `':(exclude)ai-agents/tasks/done/*'`,
`':(exclude)ai-agents/tasks/cancelled/*'` for the narrower scopes; `-l` instead of `-o` for file counts.

⭐ **Lowercase concentrations re-verified the same way** (`git grep -ohE 'adr-[0-9]{3}:[0-9]+'`, no
`-i`, so lowercase only): `adr-012` **107** · `adr-010` **53** · `adr-016` **37** · `adr-018` **22** ·
`adr-008` ⚠️ **17** (the 5th measurement recorded **16**) · `adr-031` **15** *(not previously listed)*.

### ⛔⛔ A SEVENTH SCOPE NOBODY HAD NAMED — **NOW RULED IN: `git grep` SEES ONLY TRACKED FILES, AND THIS SPRINT'S OWN ARTIFACTS ARE UNTRACKED**

> ### ⭐⭐ DATED OWNER RULING 2026-09-14 — **UNTRACKED FILES ARE INSIDE `0393`'s DECLARED SCOPE**
>
> Given live via `AskUserQuestion` in an `fkit lead` session with the owner present. **The option
> label is the verbatim text: *"Include untracked + a specimen class (Rec)"*.**
>
> ⛔ **The owner's stated reason, recorded because it is the point:** *a sweep that omits the sprint's
> own artifacts is the same scope-not-recorded failure the census section exists to prevent.*
>
> ⭐ **The ruling also added a FOURTH triage class to `0393`'s `E2` — see the subsection below.**

⛔ **Every measurement 1–6 above — including this producer's — used `git grep`, which scans TRACKED
files only.** ⚠️ **`ai-agents/sprints/sprint-9.md` and the briefs for `0392`, `0393` and `0394` were
all UNTRACKED at `HEAD` `f209a8c`** — ⭐ **re-verified still untracked 2026-09-14** — so none of the six
censuses counted them.

⛔⛔ **THE DECLARED SCOPE IS A COMMAND, NOT A NUMBER — that is the whole lesson of six disagreeing
censuses, five of which recorded a figure and no command:**

```
git grep --untracked -oihE 'adr-[0-9]{3}:[0-9]+' -- .      # occurrences
git grep --untracked -liE  'adr-[0-9]{3}:[0-9]+' -- .      # files
```

⚠️ **The exemption pathspecs remain `0393`'s plan-gate call** — ⛔ this ruling fixed `--untracked`, the
earlier one fixed **case**; ⛔ **neither settled the exemption list.**

**⭐ RE-VERIFIED 2026-09-14. ⛔ The earlier `--untracked` figures are ALREADY STALE and are shown
BESIDE the re-measure, never overwritten:**

| Scope | Tracked only | Earlier `--untracked` | ⭐ **Re-verified `--untracked`** | Drift |
|---|---|---|---|---|
| Case-SENSITIVE `ADR-`, whole repo | **124 / 35** — unchanged | 135 / 38 | ⭐ **141 / 38** | ⚠️ **+6 / 0** |
| Case-INSENSITIVE, whole repo | **446 / 67** — unchanged | 462 / 71 | ⭐⭐ **472 / 71** | ⚠️ **+10 / 0** |

⛔⛔ **THE TRACKED HALVES DID NOT MOVE AT ALL; THE UNTRACKED HALVES MOVED BY TEN.** The entire drift is
inside the four sprint artifacts, and the cause is plain: **writing this census adds occurrences to
the class the census measures.** ⭐ **This board is inside its own declared scope — the count is
self-referential and moves whenever anyone edits it.** ⛔ **Pin a `HEAD`, re-run the command, record
both.**

**The four untracked citers, re-counted:** `sprint-9.md` **9** *(was 4)* · `0393`'s brief **14** *(was
9)* · `0394`'s brief **2** · `0392`'s brief **1**. ⭐ **Total 26** *(this board recorded **16**)*.

⛔⛔ **AND THE EDIT THAT RECORDED ALL OF THE ABOVE CHANGED THE NUMBER AGAIN — measured, not
predicted.** `472 / 71` was taken **immediately BEFORE** this ruling was written into this board and
`0393`'s brief. Re-run **immediately AFTER**, same commands, same `HEAD`: ⭐ **466 / 71**
case-insensitively *(**−6**)* and **137 / 38** case-sensitively *(**−4**)*, with the tracked-only
figure **446 / 67 exactly unchanged** — ⛔ **no tracked file was touched.** Untracked citers after:
`sprint-9.md` **4** · `0393` **13** · `0394` **2** · `0392` **1**, ⭐ **total 20**.

⚠️⚠️ **⛔ IT WENT DOWN AND THAT IS NOT PROGRESS.** Not one citation was repaired — **two long sample
lists were reworded into shorter ones.** ⭐⭐ **A census taken over the documents that DISCUSS the
defect measures the prose as much as the rot.** ⛔ **Do not cite the −6 as a trend**, exactly as the
"+8 in one day" figure below must not be cited as one.

### ⛔⛔ THE FOURTH TRIAGE CLASS — **A MENTIONED COORDINATE, LEFT BYTE-IDENTICAL**

⛔⛔ **A mechanical sweep that "repairs" one of these corrupts the record of the very class it is
sweeping.** ⭐ **`E2`'s three classes did not name this case; the ruling adds it as a fourth.**

⚠️⚠️ **AND THIS BOARD'S EARLIER CLAIM THAT ALL OF THEM ARE "QUOTED EXAMPLES" IS WRONG — corrected
here rather than copied forward.** Re-read site by site, the 26 are **two** kinds: **(a) specimens**
(items in a sample list of the defect) and **(b) subject-of-work mentions** (the coordinate IS what
the sentence is about — a triage target, or a dated measurement result, as in `0393`'s `E4`). ⛔ **Kind
(b) is not a quoted example, and a triage hunting only for examples will miss it.** ⭐ **Both are
MENTIONS rather than USES — that is what makes them one class.**

⛔ **THE TEST A WORKER APPLIES, written into `0393`'s `E2`:** *replace the line number with the correct
one — **does the surrounding sentence become FALSE?*** **YES → `mentioned`, leave it byte-identical.
NO → live citation, repair it.** ⚠️ **It is a READING JUDGEMENT, ⛔ not a mechanical one** — a use and a
mention are lexically identical, so no pattern separates them; an ambiguous site is recorded
`mention?` and raised at the plan gate rather than guessed. ⭐ **Full statement, signals and limit
live on [`0393`](../tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md).**

⚠️ **Consequence for `0394`, FLAGGED AND NOT ACTED ON** (this producer was fenced from that brief): **a
guard that flags this class mechanically will fire on every fourth-class site.** ⭐ **The fix is a
declared exemption-region list, not a cleverer pattern — a design question `0394` must answer.**

⛔⛔ **THE HEADLINE SURVIVES RE-VERIFICATION AND THE DRIFT DOES NOT SOFTEN IT.** The case-sensitive
half reproduces **exactly**; the case-insensitive class is **3.6× larger** (446 against 124), and
**322 lowercase-form occurrences stand outside the uppercase scope.** ⚠️ **The +2 drift is measured
against an uncommitted tree over a few minutes — ⛔ it is NOT evidence of a growth rate, and it must
not be cited as one.** See the "+8 in one day" subsection below, which says the same thing about a
larger figure.

### ⛔⛔ THE FINDING THAT CHANGES THE ROW: THE RELAYED FIGURE COUNTS ONLY THE UPPERCASE HALF

⭐ **`124 / 35` reproduces the relayed `125 / 34` to within one of each** — near-certainly the same
scope, taken a moment apart, with `HEAD` having moved in between. ⛔ **But that scope is
CASE-SENSITIVE, and `0323` — the cancelled row `0393` inherits Group E from — exists specifically to
sweep this class *case-insensitively*.**

⛔ **The lowercase form is real, numerous and concentrated.** Measured 2026-09-14, the top citers by
lowercase target: `adr-012` **107** occurrences, `adr-010` **53**, `adr-016` **37**, `adr-018` **22**,
`adr-008` **16** *(re-verified as **17** later the same day — see the 6th measurement above)*. **A sample of the literal text: `adr-008:54`, `adr-008:106`, `adr-001:22`.**

⭐ **So the class `0393` is chartered to sweep is 444 occurrences across 67 files (⭐ **446 / 67** on
the same-day re-verification) — about 3.6× the figure the board was scoped against.** ⛔⛔ **AND SINCE
2026-09-14 THAT IS AN OWNER RULING, NOT A RECOMMENDATION** — verbatim option label ***"Whole class,
case-insensitive (Rec)"***. **`0393` sweeps the whole class.** ⛔ **Every figure in the table above is a whole-repo count with
no exemption applied; `0393`'s real scope will be smaller once closed task folders and the vault are
excluded (106 / 26 on that reading; **108 / 26** re-verified).** ⚠️ **Which exclusions apply is still `0393`'s
plan-gate call and this board does not make it** — ⛔ **the owner's ruling fixed CASE, not the
exemption list.**

### ⛔⛔ THE "+8 IN ONE DAY" GROWTH FIGURE IS NOT MEASURED FACT AND MUST NOT BE CITED AS ONE

⛔⛔ **STRENGTHENED 2026-09-14 AFTER RE-VERIFICATION, AND PLACED HERE RATHER THAN IN A FOOTER BECAUSE
IT WAS RELAYED TO THE OWNER AS MEASURED FACT MORE THAN ONCE — INCLUDING INSIDE A QUESTION THE OWNER
THEN RULED ON.** ⛔ **The correction is on the record; the figure is not to appear as a measurement in
any brief, board, report or question from here on.**

⛔ **The regeneration rate that justified filing a guard is NOT reproducible from this producer's own
measurement, and that is recorded rather than smoothed over.** The argument put to the owner was
*110/27 → 117/29 → 125/34*, i.e. **+8 occurrences and +5 files in one day**. ⚠️ **Under the closest
scope this producer can name and reproduce, the count went the other way: 106 / 26 today (108 / 26 on
the same-day 6th re-verification) against a recorded 110 / 27 yesterday.** ⛔⛔ **NEITHER FIGURE CAN BE
CHECKED AGAINST THE OTHER, BECAUSE NONE OF MEASUREMENTS 1–4 RECORDED ITS SCOPE.** ⭐ **That is the
whole defect: four numbers with no scopes cannot produce a rate, only the appearance of one.**

⭐ **The honest reading, and it still argues FOR the guard — for a different reason.** ⛔ **A class
whose census cannot be reproduced across six measurements is a class with no machine-checkable
definition, and that is precisely what a guard supplies.** ⭐ **This — not the growth rate — is the
reason `0394` stands, and `0394`'s own brief says so in as many words.** ⚠️ **What is NOT established is the
*rate*.** ⛔ **Do not cite "+8 in one day" as measured fact** — cite it as an unreproduced claim whose
scope was never recorded. **The two existing guards demonstrably do not catch this class**: both
`test/reference-integrity.test.js` and `test/coordination-citation-policy.test.js` are **green** at
`HEAD` `f209a8c` (22/22 and 21/21, **re-verified 2026-09-14**: 22/22 over **916 files, 0 broken, 7
named-exempt**, and 21/21) while all **446** occurrences stand.

⭐ **The guard row is filed:
[`0394`](../tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md),
on the Backlog board, unranked, `Depends on 0393`.** ⛔ **It is NOT on this sprint** — a guard against
re-rot is written against the swept surface, and the surface is swept by `P7`.

## ⛔ HOW THE SEVEN ROWS ARRIVED, AND THE BACKLOG-BOARD EDITS THIS PULL PERFORMED

**The Backlog board's **Off:** procedure requires three edits per pulled task, all mandatory.** This
pull performed all three for each of the seven, and nothing else:

1. **The row was added to this board**, ranked `P1`–`P7`.
2. **The Backlog row was flipped** to `➡️ Moved to [Sprint 9](sprint-9.md) — priority P<n>`. ⛔ **The
   row was NOT deleted** — a deleted row loses the pointer to where the work went. **The `— priority
   P<n>` suffix is mandatory here because this board is RANKED**; the unranked-forward clause that
   drops it does not apply.
3. **The brief's own `## Sprint` was set to `Sprint 9` and its `## Priority` to the real number.** ⚠️
   **Skipping this is what manufactures a permanent `drift disagreement` row on the Backlog board** —
   drift rule 2 compares the `Moved` target against the brief's `## Sprint`.

⭐ **No `Unscheduled` lift was needed for any of the seven.** The Backlog board's ruling of 2026-08-29
(verbatim *"Rank Sprint 7; declare backlog an archive (Rec)"*) already states that **ranking happens at
pull time, onto a sprint board** — ⛔ so a rank assigned here is the ruled mechanism, not an exception
to it.

⭐ **One further Backlog-board edit, and it is not part of the pull:** the guard row `0394` was
**appended last, UNRANKED**, with nothing renumbered and nothing re-ranked (ADR-035). Its id was
verified free **both ways** on 2026-09-14 — **max task-folder id on disk `0393`** and **max
board-referenced id across every board including `done/` and `cancelled/` `0393`** — the two agreeing,
so `0394` is the next free id.

## ⚠️ NO SUCCESSOR CLAUSE — AND THE OMISSION ESTABLISHES NO CONVENTION

⛔ **This board names no successor sprint.** Whether Sprint 10 exists, and what it contains, is decided
when this board closes and on the facts that hold then.

⭐ **Two rows already have a claim on it, and both are recorded rather than promised:** `0332` and
`0329` are **first in line for Sprint 10** by the omissions table above, and `0189` was deferred there
by this producer's argument. ⚠️ **Neither is a commitment** — the owner has ruled nothing about
Sprint 10.

⭐ **Sprints 5, 6, 7 and 8 each named no successor, each for its own recorded reason, and that
established no convention either way.** ⛔ **Naming one now would ship a dangling link to a board that
does not exist.**

## Notes

### ⚠️ Open questions for the owner

1. ✅ **ANSWERED 2026-09-14 — OWNER RULING, verbatim option label *"Whole class, case-insensitive
   (Rec)"*, given live via `AskUserQuestion`.** ⭐ **`0393` sweeps the WHOLE `ADR-NNN:LINE` class,
   case-insensitively** — not the uppercase half. ⛔ **The owner's stated reason: under the narrow
   scope, criterion 4 reads as MET while roughly 320 occurrences still stand.** The question was: the
   relayed `125 / 34` counts only uppercase `ADR-`, while the class `0323` was filed to sweep measures
   **446 / 67** case-insensitively (re-measured 2026-09-14 — see the census section, whose four scopes
   were re-measured the same day). ⛔ **Recorded as a dated owner ruling on
   [`0393`'s brief](../tasks/backlog/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md),
   and reflected in criterion 4's scope note.** ⚠️ **Still open and still `0393`'s plan-gate call: WHICH
   EXCLUSIONS apply inside the class** (`wiki-vault/`, closed task folders). The ruling fixes **case**,
   not the exemption list.
2. ⛔⛔ **THE "+8 OCCURRENCES AND +5 FILES IN ONE DAY" GROWTH FIGURE IS NOT REPRODUCIBLE AND MUST
   NOT BE CITED AS MEASURED FACT — ANYWHERE, BY ANYONE.** ⚠️ **It was relayed to the owner as measured
   fact more than once, including inside a question the owner then ruled on.** ⛔ **None of the four
   prior measurements recorded its scope, so none can be checked against another** — see the census
   section. ⭐ **The guard row
   [`0394`](../tasks/backlog/0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md)
   stands on the BETTER reason, and its own brief says so: a class whose census cannot be reproduced
   across five measurements has NO MACHINE-CHECKABLE DEFINITION, and supplying one is exactly what a
   guard does.** ⛔ **What is NOT established is the rate.**
3. **⚠️ `0392` and `0393` both carry `## Owner: fkit-architect` FLAGGED as an unsettled producer
   judgement**, and Group A of `0392` is coder-shaped. ⛔ **This board does not settle it.** ⭐
   **Recommendation: settle it at each row's plan gate, not now** — the deliverable decides the role
   (ADR-044) and neither row's final deliverable is fixed until its open decisions are answered.
4. ✅ **ANSWERED 2026-09-14 — THE DIFF WAS RUN AND THE SECTION WAS CORRECTED, NOT DEFENDED.** The
   question was that six of the seven criteria were re-derived, not copied from the approved proposal.
   ⭐ **A driver-side diff against that proposal found THREE drifts**, each settled by an owner ruling
   the same day (option labels verbatim): **"Restore both, as you approved them (Rec)"** — two dropped
   criteria restored as **8** (`0221`/`0194`'s three premises) and **9** (the reconcile-mode ADR's three
   conjuncts); **"Keep both (Rec)"** — the proposal's concrete `§9.1` command restored as **2**
   alongside this producer's date rule as **3**. ⛔ **The list is now TEN and carries a per-criterion
   provenance table.** ⛔ **Criterion 4 is untouched — owner-ruled under T3.**

### ⛔ The hard rules that govern every row on this board

- ⛔ **A task file moves ONLY via `/fkit-task-done` or `/fkit-task-cancelled`, producer-invoked**
  ([ADR-033](../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  and a close performed without the owner present carries
  `(agent-closed — not owner-verified)`.
- ⛔ **This board moves ONLY via `/fkit-sprint-done` or `/fkit-sprint-cancelled`** — success criterion
  **10** is exactly that rule made observable *(criterion 7 before the 2026-09-14 renumber)*.
- ⛔ **No `ai-agents/wiki-vault/` write by any role but `fkit-wiki`**
  ([ADR-005](../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **No re-rank**
  ([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  The `P1`–`P7` above changes only by an owner ruling naming the change.
- ⛔ **No commit, no push, unless the owner asks.**
- ⛔ **Never edit the gitignored `.claude/` mirror** — edit the canonical sources under `claude/`.
- ⛔ **`ai-agents/sprints/done/` is a historical record.** Eight archived boards. Nothing on this sprint
  edits one.
