# Sprint 8 — Give sprints the lifecycle tasks already have, and prove it by closing this board with a mover

> ## 🔄 In progress — 2026-09-10.
>
> **Authority, stated first and in full.** This board exists by an **OWNER RULING given 2026-09-10 via
> `AskUserQuestion` in a live `fkit lead` session** — a selection from the question's option list, and
> the option label is the verbatim text: **"Approve 7 rows, lift Unscheduled (Rec)"**.
>
> **Five further rulings the same day, same channel, option labels verbatim.** ⚠️ **`S6` was given
> LATER THE SAME DAY, after this board had been written and while it was being driven** — it is the
> one ruling here that changes a board that already existed:
>
> | # | Ruling (verbatim option label) | What it settled |
> |---|---|---|
> | S1 | **"Approve 7 rows, lift Unscheduled (Rec)"** | The `P1`–`P7` board below, its goal and its binary criterion — **every row arrives by this ruling naming it** — **and the `Unscheduled` lift recorded in the next section** |
> | S2 | **"Keep as reported metric + caveat (Rec)"** | Sprint 7's record-repair share is **reported every sprint with its denominator flaw stated alongside it**. ⛔ **It gates nothing.** ⛔ Neither the classifier repair nor the metric's retirement was ruled |
> | S3 | **"Open with no banner, 0340 adds it (Rec)"** | This board opens with **no line-3 status banner**. `0337` defines the grammar; `0340` backfills it here |
> | S4 | **"Close out 0358's review ledger (Rec), File the board-bloat row"** | The board-bloat row is **filed on the Backlog board** (unranked, appended last). ⛔ `0358`'s ledger closeout is a **coder's** job and is **not** on this board |
> | S5 | *(not re-asked — the producer's own recommendation, accepted)* | **No successor clause. Decided at close, not now.** See §"⚠️ NO SUCCESSOR CLAUSE" |
> | S6 | **"Re-order — 0340 before 0338 (Rec)"** | ⛔ **`0340` and `0338` SWAP RANKS** — `0340` becomes `P3`, `0338` becomes `P6`. **The only re-rank on this board, and the only one authorised.** See §"⚠️ THE RE-ORDER OF 2026-09-10" |
>
> *Rulings `S1`–`S5` executed 2026-09-10 by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
> which asked nothing and decided nothing beyond the mechanics of the five rulings above.*
>
> *Ruling `S6` executed 2026-09-10 by a second spawned `fkit-producer`, also with no owner channel,
> which likewise asked nothing — the ruling was relayed to it by the `fkit-lead` session holding the
> owner channel. ⭐ **It verified the finding behind `S6` against the board, the shipped selector and
> all seven briefs before moving anything, and re-derived the critical path from the briefs rather
> than from the relay.** What it changed is enumerated in §"⚠️ THE RE-ORDER OF 2026-09-10".*

## ⚠️ THE RE-ORDER OF 2026-09-10 — `0340` AND `0338` SWAPPED RANKS, AND WHY

⛔ **THIS BOARD HAS BEEN RE-RANKED ONCE. This section is that re-rank's entire record.**
[ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
sets the bar for a re-rank at an owner ruling. ⭐ **The bar is met here — and for this one change
only.**

**What changed, exactly:**

| | Before | After |
|---|---|---|
| `0340` — backfill the sprint status | `P6` | ⭐ **`P3`** |
| `0338` — flip `select-active` | `P3` | ⭐ **`P6`** |
| `0337` · `0271` · `0381` · `0341` · `0339` | `P1` · `P2` · `P4` · `P5` · `P7` | ⛔ **unchanged, all five** |

⛔ **Two rows swapped ranks. Nothing else moved, nothing was renumbered, and no row was added or
removed.** ⚠️ **The five untouched rows keep both their ranks and their relative order** — that is
what keeps this inside `S6` and out of the general re-rank ADR-035 forbids.

**On whose authority:** ⭐ **the owner, 2026-09-10, given live via `AskUserQuestion` in the `fkit lead`
session driving `/fkit-sprint-ship-loop`. The option label is the verbatim text:
"Re-order — 0340 before 0338 (Rec)".** Recorded as ruling `S6` in the authority block above.

### ⛔ THE REASON IS A MEASURED DEFECT, NOT A PREFERENCE — AND IT WAS VERIFIED HERE, NOT TAKEN ON TRUST

⭐ **The finding came from the architect's pass on `0337`, and this producer re-verified every step of
it against the shipped code and this board before moving a row.** ⛔ **It is recorded as the reason
because "the owner said so" is not a reason a later reader can check.**

**The breakage, in one line:** ⛔ **in the window where `0338` has shipped and `0340` has not, this
board disappears from its own selector.**

**The chain, each rung measured 2026-09-10:**

1. **`0338` makes `In progress` a rung of eligibility.** Its row on this board scopes exactly that —
   *"eligibility = identity **and** `In progress`"* — and adds *"no banner → unresolved + drift"*.
2. **`0340` is what puts the banner on this board.** Ruling `S3` — verbatim
   **"Open with no banner, 0340 adds it (Rec)"** — had this board **open with no line-3 banner**.
3. **This board therefore has no banner today.** ⭐ **Measured:** line 3 of this file is the opening
   line of the *Authority* blockquote — `> **Authority, stated first and in full.** …`. ⛔ **It is a
   blockquote, but it is not a status banner under any grammar `0337` could write.**
4. **So after `0338` and before `0340`, this file resolves `unresolved` → ineligible →
   `select-active` returns `active none`, exit 3.**

⭐ **AND THAT IS THE BOARD THE SHIP-LOOP IS BEING DRIVEN FROM.** The coupling is real and was traced,
not assumed: `/fkit-sprint-ship-loop` takes *"a sprint plan path … **empty = the active sprint, as
`/fkit-status` resolves it**"*, and `/fkit-status`'s empty-argument rule resolves it by running
`select-active` — and its own instruction on `active none` is **"Say so, list every `candidate` line
with its identity or `unresolved`, and stop."** ⛔ **The loop would lose its own board while closing
the sprint that fixes losing the board.**

⚠️ **ONE PRECISION, BECAUSE THE BREAKAGE IS NOT UNCONDITIONAL AND OVERSTATING IT WOULD BE WRONG.**
The ship-loop only resolves through `select-active` when invoked **with an empty argument**; a run
given an explicit plan path survives the window untouched. ⛔ **`/fkit-status` itself breaks either
way** — answering *"what's the status?"* on this repo is exactly the empty-argument path. **The
re-order removes the window for both.**

**Measured on the shipped script before the swap:** `select-active` returns
`active file="sprint-8.md" identity="Sprint 8"`, **exit 0** — because eligibility is identity-only
today and there is no status rung yet. ⭐ **The window opens the moment `0338` lands, not before.**

### ⭐ WHY THIS FIX AND NOT THE OTHER TWO — BOTH WERE PUT TO THE OWNER AND BOTH WERE DECLINED

- ⛔ **"Ship both as one change" — NOT TAKEN.** It would have merged a coder row and a producer row
  into one unit of work.
- ⛔ **"Transitional grace" — NOT TAKEN, and the architect's objection is the part worth keeping:**
  a grace period **re-introduces the exact silent-default that `0337`'s ADR exists to ban**. ⭐ A rule
  that quietly treats a missing banner as `In progress` is the behaviour the whole board is built to
  delete.
- ⭐ **The owner's own stated reason for the swap:** it is the **smallest fix**, and it leaves **no
  temporary rule that someone must remember to delete later**. ⭐ **And `0340` is a one-line insert**
  — see §"⚠️ THE `0340` SCOPE CORRECTION" — **so there is no real sequencing cost to pay for it.**

### ⚠️ WHAT THE SWAP COSTS — STATED, BECAUSE IT IS NOT FREE

⛔ **`0340` now ships before the reader that verifies it.** Its `## Verification steps` step 1 runs
`select-active` and expects the banner to be read back; ⛔ **that cannot pass at `P3`, because the
rung that reads it arrives at `P6`.**

⭐ **This does not block `0340` — it defers its proof.** `0340` writes a banner in `0337`'s grammar and
checks it **by inspection** against the accepted ADR; the machine-read proof lands when `0338` does.
⛔ **`0338`'s own verification step then becomes the place criterion (a) is actually demonstrated**,
and `0338`'s brief has been annotated to say so. ⚠️ **Neither brief's `Depends on` line was edited** —
the graph did not change, only the execution order.

## ⭐ THE `Unscheduled` RULING OF 2026-08-29 IS **LIFTED** FOR FIVE TASKS — IN AS MANY WORDS

**Stated explicitly, because the record must say so rather than leave it to be inferred from the rows
below.**

⭐ **The owner's approval of this board of 2026-09-10 — verbatim option label
"Approve 7 rows, lift Unscheduled (Rec)" — LIFTS the `Unscheduled` ruling of 2026-08-29 for these five
tasks, by name:**

- **`0337`**
- **`0338`**
- **`0339`**
- **`0340`**
- **`0341`**

⭐ **The lift includes ruling 7 of 2026-08-29 specifically.** That ruling — verbatim option label
**"Hand-archive again, with the caveat (Rec)"** — named **`0341` `Unscheduled` a second time**, in its
own words *"`0341` stays `Unscheduled` by the same ruling — do not pull it in"*. ⛔ **That specific
re-naming of `0341` is lifted too.** `0341` is `P5` on this board and is here legitimately.

⛔ **THE LIFT REACHES THESE FIVE AND NOBODY ELSE.** The rest of the `0337`–`0351` range **stays
`Unscheduled` exactly as ruled on 2026-08-29**, and none of it may be added to this board without a
further ruling naming it. Sprint 7's own record of that ruling — its section
*"⚠️ This board is SCOPED IN PART"*, under the bullet quoted verbatim here as
*"The fourteen other rows in `0337`–`0351` are `Unscheduled` BY RULING"* — is the text this lift
partially discharges. ⛔ **It is not withdrawn; it is narrowed by five names.**

⚠️ **`0271` and `0381` were never `Unscheduled` by that ruling** — neither is in the `0337`–`0351`
range. They arrive on this board by ruling S1 naming them, and nothing about them needed lifting.

## 🎯 The goal

⭐ **Give sprints the lifecycle tasks already have — an explicit status, a selector that reads it, and
producer-only movers — and prove it by making Sprint 8 the first board in this project's history that
is closed by a mover instead of by hand.**

Tasks have had this since the beginning: a `## Status` field, a canonical six-value vocabulary, folder
locations that match, and two producer-only mover skills that are the only sanctioned way a task's file
moves ([ADR-033](../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
**Sprints have none of it.** A sprint's status today lives in two places that no code reads together:
**where the file sits** and a **`> ## 🔒 CLOSED — <date>.` banner** that `select-active` never looks
at. Every sprint close in this project so far — Sprints 1 through 7 — was a **hand-scoped task**, and
the two most recent both carry the admission that they were **agent-performed and not owner-verified**.

## ✅ SUCCESS CRITERION — binary, and deliberately not obtainable by hand

⭐ **Two commands, two required outputs. Both, or the sprint missed.** ⛔ There is no percentage, no
threshold and no judgement call in this criterion — that is the point of it.

**(a) While Sprint 8 is live:**

```
bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
```

**Required output:** `sprint-8.md` is named as the **chosen** board **because its status reads
`🔄 In progress`** — the status rung `0338` adds to eligibility, in the banner grammar `0337`'s ADR
fixes, stamped onto this board by `0340`. Exit `0`.

**(b) At close:**

```
bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
```

**Required output — BOTH halves, and the wording is READING 2, ruled by the owner 2026-09-10:**

1. `select-active` returns **`active none`**, **exit 3**; **and**
2. **`ai-agents/sprints/done/sprint-8.md`** carries a **`✅ Done` status banner that NAMES
   `/fkit-sprint-done`** as what archived it.

⭐ **WHY READING 2 AND NOT READING 1 — the owner's ruling of 2026-09-10, verbatim option label
"Reading 2 — archived + mover-named (Rec)", taking the producer's own recommendation.** Two reasons,
and both are why this wording is better than the one it replaces:

- ⭐ **It survives whatever `0337` decides about mover atomicity.** Reading 1 required the mover to
  expose an observable intermediate state — status stamped, file not yet moved — which is a
  *constraint on `0337`'s ADR* smuggled into a success criterion. Reading 2 asks only for the
  **end state**, so `0337` stays free to rule the stamp-and-`git mv` a single atomic act.
- ⭐ **It stays un-fakeable by hand.** Measured 2026-09-10: every plan already under
  `ai-agents/sprints/done/` carries the **legacy `> ## 🔒 CLOSED — <date>.` banner** and names **no
  mover at all** — because none of them was moved by one. ⛔ **A hand archive reproduces the file
  location and nothing else; the `Done` banner in `0337`'s grammar naming `/fkit-sprint-done` is
  producible only by `0341`'s mover actually running.**

⛔ **Criterion (a) is UNCHANGED by this ruling** — its text above is the text the owner approved on
2026-09-10 under ruling S1, and nothing in it moved.

### ⛔ WHY THIS CRITERION AND NOT ANOTHER: NEITHER LINE IS OBTAINABLE BY HAND WORK

**Measured against the shipped code on 2026-09-10, not assumed:**

- **(a)'s *because* cannot be faked.** `select-active`'s eligibility test today
  (`claude/skills/fkit-status/dashboard.sh:173`) is **identity-only** — a plan is eligible because its
  H1 resolves to `Sprint <N>`, full stop. There is **no status rung**, so the script cannot print a
  status as its reason for choosing anything. Creating `sprint-8.md` by hand does make it `active`
  — by identity, today, already. ⛔ **The word `In progress` appearing as the reason is what only
  `0337` + `0338` + `0340` can produce.**
- **(b) is impossible today by construction.** The candidate list is a **depth-1 glob** over
  `ai-agents/sprints/*.md` (`claude/skills/fkit-status/dashboard.sh:241`), and every depth-1 plan with
  a `Sprint <N>` identity is eligible. ⭐ **So `active none` and a `sprint-8.md` candidate cannot
  coexist in the shipped script — at all.** The only hand move that produces `active none` is moving
  the file into `sprints/done/`, at which point it stops being a candidate and the required output is
  not met. ⛔ **Nothing but a status rung can satisfy this line.**

⚠️ **NOTE APPENDED 2026-09-10, AFTER THE OWNER RULED READING 2 — the bullet above is left
byte-identical and is NOT overwritten.** The second bullet argues (b)'s un-fakeability **through the
"candidate" clause**, and ⛔ **that clause is no longer in (b)**: reading 2 replaced it with the
archived-plus-mover-named end state. ⭐ **The bullet's measurement is still true and still worth
reading** — `active none` and a depth-1 `sprint-8.md` candidate genuinely cannot coexist in the
shipped script, which is exactly what made the old clause unobservable and drove the question to the
owner. ⛔ **But (b)'s live un-fakeability argument is now the one stated inside (b) itself** — the
legacy `🔒 CLOSED` banner names no mover — **not this bullet.** Read (b) first.

Verified 2026-09-10 at HEAD `9943dcf` on the current tree: `select-active ai-agents/sprints` prints
`active none`, one candidate (`backlog.md`, identity `Backlog`), exit `3` — the no-active-sprint state
that has held since Sprint 7 was archived.

⚠️ **CORRECTION APPENDED 2026-09-10 — THE PARAGRAPH ABOVE WAS TRUE WHEN WRITTEN AND IS FALSE NOW, AND
THIS BOARD'S OWN EXISTENCE IS WHAT FALSIFIED IT.** The original wording is left byte-identical and is
not overwritten, per the house pattern. **Re-measured today at HEAD `9943dcf` on the current tree,
with this file present:** `select-active ai-agents/sprints` prints
`active file="sprint-8.md" identity="Sprint 8"`, **two** candidates (`backlog.md` identity `Backlog`,
`sprint-8.md` identity `Sprint 8`), **exit `0`**. ⭐ **This is not a defect and it changes no criterion
— it is the second bullet above happening in front of us:** *"Creating `sprint-8.md` by hand does make
it `active` — by identity, today, already."* ⛔ **What is still absent is the REASON**: the script
chooses this board because its H1 resolves to `Sprint 8`, **not** because a status reads
`🔄 In progress` — so criterion (a) is **not** met by this output and remains `0337` + `0338` +
`0340`'s to satisfy.

### ⚠️ ONE UNSETTLED READING IN (b), FLAGGED RATHER THAN QUIETLY RESOLVED — OPEN QUESTION FOR THE OWNER

> ## ✅ RESOLVED 2026-09-10 — THE OWNER RULED **READING 2**. THIS SECTION IS KEPT, NOT DELETED.
>
> **Ruling given live via `AskUserQuestion` in a `fkit lead` session, 2026-09-10 — a selection from
> the question's option list, and the option label is the verbatim text:
> "Reading 2 — archived + mover-named (Rec)".** It took the producer's own recommendation, recorded
> below in this section's closing line.
>
> ⛔ **The heading above and every word under it are left BYTE-IDENTICAL and are NOT overwritten.**
> ⭐ **This section is why criterion (b)'s wording changed** — delete it and the board records a
> criterion that was silently rewritten instead of one that was flagged, put to the owner, and ruled.
> ⚠️ **Read it as history from here on, not as a live question.** The live wording of (b) is the one
> in §"✅ SUCCESS CRITERION" above, and it is **reading 2** as stated below.

⛔ **(b) requires `sprint-8.md` to be a *candidate* — which means still at depth 1 in
`ai-agents/sprints/` — while its status reads `Done`.** But `0341`'s mover, as its brief scopes it,
performs the banner stamp **and** a `git mv` into `sprints/done/` **in one act**. If `0337`'s ADR rules
that act atomic with no observable intermediate state, then after `/fkit-sprint-done` runs, `sprint-8.md`
is at `sprints/done/sprint-8.md`, the depth-1 glob never sees it, and ⛔ **the "candidate" clause of (b)
is unobservable.**

⚠️ **This is not a re-scope and the criterion is written above exactly as ruled.** It is a flag that
(b) may need one word settled before it can be measured. **The two readings:**

1. **As written** — (b) is checked at the point inside the mover's run where the status is stamped and
   the file has not yet moved. Requires `0337`'s ADR to make that state observable.
2. **The archived reading** — (b) becomes: `select-active` returns `active none` / exit 3, **and**
   `ai-agents/sprints/done/sprint-8.md` carries a `Done` status banner naming `/fkit-sprint-done`.

⭐ **Reading 2 loses nothing that made this criterion good** — it is still un-fakeable by hand, because
today's archived plans carry the legacy `🔒 CLOSED` banner and **no mover name at all**. ⛔ **The owner
picks; the producer does not settle it silently.**

## 📊 THE RECORD-REPAIR SHARE — REPORTED, WITH ITS FLAW, AND GATING NOTHING

**Owner ruling S2, 2026-09-10, verbatim option label "Keep as reported metric + caveat (Rec)".**

⭐ **Sprint 7's criterion becomes a reported metric on every board from here.** ⛔ **It gates nothing on
this board. It is not this board's success criterion. Nothing on this board is cancelled, deferred or
re-ranked because of it.**

**Measured 2026-09-10 at HEAD `9943dcf` with `node claude/skills/fkit-status/throughput.mjs`:**

| Reading | Value |
|---|---|
| Open work | **111** |
| Record repair | **23** = **20.7%** |
| Record repair excluding source defects (`0215`, `0234`, `0334`) | **20** = **18.0%** |

### ⛔ THE CAVEAT, WHICH TRAVELS WITH THE FIGURE AND IS NOT A FOOTNOTE

⛔ **THE METRIC PUNISHES THIS SPRINT FOR DOING EXACTLY THE RIGHT THING, AND HERE IS THE MEASUREMENT.**

**If Sprint 8 ships exactly these seven rows and creates nothing, the metric reads `21 / 104 = 20.2%`
— a fall of one half of one percentage point, which reads as near-total failure by that instrument.**

**How that number is derived — re-measured, not inherited:**

- `node claude/skills/fkit-status/throughput.mjs --list` classifies **2 of the 7 rows as record
  repair**: **`0337`** (leading verb `record`) and **`0340`** (leading verb `backfill`). The other five
  — `0271` `pin`, `0338` `flip`, `0339` `teach`, `0341` `build`, `0381` `give` — classify as `other`.
- Closing all seven: repair `23 − 2 = 21`; open `111 − 7 = 104`; **`21 / 104 = 20.2%`**.
- Excluding source defects: `20 − 2 = 18`; **`18 / 104 = 17.3%`**.

⛔ **BOTH "repairs" ARE MISCLASSIFICATIONS, AND THE DENOMINATOR IS THE REAL FLAW.**
`0337` writes a **new ADR designing a lifecycle that does not exist** — the classifier sees the verb
`record` and counts it as repairing a stale record. `0340` performs a **one-time data migration onto
this repo's own plans** — the classifier sees `backfill`. ⚠️ **Meanwhile the denominator falls by only
seven**, because a sprint that ships process work removes a handful of rows from a backlog of 111 while
the repair numerator barely moves. ⭐ **The instrument measures the ratio of a slow-moving numerator to
a slow-moving denominator, and calls a sprint that fixes the machinery a failure.**

⛔ **WHAT WAS NOT RULED, AND IS THEREFORE NOT DONE HERE.** The owner ruled the metric **reported with
its caveat**. ⛔ **The classifier is NOT repaired and the metric is NOT retired** — neither was ruled,
and repairing the classifier would be a **new row**, which this board does not have.

⚠️ **NOTE APPENDED 2026-09-10 — THE CLASSIFIER REPAIR IS NOW FILED, AND IT IS **NOT** ON THIS BOARD.**
The paragraph above is left byte-identical. **Owner ruling 2026-09-10, given live via
`AskUserQuestion` in a `fkit lead` session, option label verbatim "File it as a Backlog row (Rec)":**
the miscount is filed as
[`0384`](../tasks/backlog/0384-teach-the-record-repair-classifier-that-a-net-new-record-is-not-a-repair/brief.md),
**on the Backlog board, unranked, appended last** ([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
⛔ **Sprint 8's seven rows, its goal and its success criterion are unchanged by that filing** — no row
was added here, none was re-ranked, and the metric above still gates nothing (ruling S2). ⭐ **The
figures in this section stand as measured** and are what `0384` is filed to explain.

## ⛔ THIS BOARD OPENS WITH **NO** LINE-3 STATUS BANNER — DELIBERATELY, AND IT IS SCHEDULED

**Owner ruling S3, 2026-09-10, verbatim option label "Open with no banner, 0340 adds it (Rec)".**

⭐ **The omission is a decision, not an oversight, and a later reader should read it that way.** This
board opens in **today's format** — line 1 is the H1, line 3 is the first line of the authority
blockquote. There is **no `> ## 🔄 In progress` banner**, and there is no `## Sprint Status` field.

⛔ **NO BANNER GRAMMAR IS INVENTED HERE.** The grammar is `0337`'s deliverable (`P1`, ruled SD-1
2026-08-25, verbatim **"Line-3 banner (Recommended)"**) and it is `0340`'s job (`P3`) to backfill the
banner onto **this board** and onto the archived plans that need it. ⛔ **Stamping a banner here now
would pre-empt an unshipped design** — the same reasoning Sprint 7's board recorded for itself, and it
is unchanged.

⚠️ **Nothing reads a banner as data today anyway.** A board is active because of **where its file sits
and what identity it resolves to**
([ADR-041](../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)),
which is why this file lives at `ai-agents/sprints/sprint-8.md`. ⭐ **Changing that is `0338`'s whole
point** — and it is exactly why success criterion (a) is worded as it is.

## ⚠️ RANK IS **NOT** RUN ORDER ON THIS BOARD — THE BINDING ORDER IS `Depends on`

⛔ **`P1`–`P7` is a merit ranking. It is not an execution sequence, and reading it as one will start a
row before the thing it depends on exists.** Where ordering must bind, it lives in each row's
`Depends on` line, per
[ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md).

⭐ **Sprint 7 is the worked precedent, twice over.** On that board `P13` (`0361`) and `P15` (`0379`)
were both appends that ran **before** `P12` (`0360`), and that board's own banner records
*"rank order and execution order disagree for this one pair"*. ⛔ **The same thing is true here and is
stated up front rather than discovered.**

**The dependency graph, as the seven briefs actually record it:**

| Lane | Chain | Depth |
|---|---|---|
| **Dependency graph** (what the briefs' `Depends on` lines record, and nothing else) | `0337` → `0338` → { `0339`, `0341` } · and `0337` → `0340` | **3 deep** |
| **Critical path as it must actually be EXECUTED** (the graph **plus** the owner-ruled ordering gate of 2026-09-10) | `0337` → `0340` → `0338` → { `0339`, `0341` } | **4 deep** |
| **Parallel lane** | `0271` (depends on `0264`, `0265` — both closed) · `0381` (depends on nothing) | **1 deep, start immediately** |

⚠️ **THE TWO LINES DIFFER ON PURPOSE, AND THE DIFFERENCE IS THE WHOLE POINT OF THE RE-ORDER BELOW.**
No brief declares `0338` dependent on `0340` — ⛔ **and none should be edited to say so.** The
`0340` → `0338` rung is an **ordering gate imposed by the owner's ruling of 2026-09-10**, recorded in
§"⚠️ THE RE-ORDER OF 2026-09-10", not a dependency discovered in a brief. **It is a hard gate all the
same**: shipping `0338` first takes this live board out of `select-active`.

⭐ **`0340` SITS AT DEPTH 2, NOT DEPTH 3 — re-derived from its brief, not carried forward.** Its
`## Notes` records **"Depends on: 0337 (the carrier grammar), 0338 (the reader that verifies it — step
1 cannot pass without it)"**. ⛔ **Read the parenthesis: `0338` is named as the *verifier*, not as an
input to the work.** `0340`'s work — inserting a line-3 banner in `0337`'s grammar — needs the grammar
and nothing else. ⭐ **So `0340`'s dependency on `0338` is a DEFERRED VERIFICATION, not a work gate**,
and that is precisely why it can legally run first. See the re-order section for what that costs.

⚠️ **CORRECTION FROM THE BOARD'S FIRST DRAFT, KEPT RATHER THAN ERASED.** The critical path's third
rung was relayed to this producer as `{0339, 0340}` and this board corrected it to
`{0339, 0340, 0341}`. ⛔ **Both of those are now superseded by the table above**, on two counts:
`0341` is correctly at depth 3 (its brief records **"Depends on: 0337 …, 0338 …"** in as many words),
but **`0340` was never a depth-3 member** — the re-derivation above moves it to depth 2. **The
`{0339, 0340, 0341}` brace had the right count and the wrong membership.**

⛔ **A RANK/EXECUTION DISAGREEMENT THE SWAP CREATES — STATED UP FRONT RATHER THAN DISCOVERED IN A
DIFF.** After the swap, **`0341` is `P5` and `0338` is `P6`**, yet `0341` **hard-depends on `0338`**.
⭐ **`0341` therefore cannot start when its rank comes up; it waits for `P6`.** This is the same shape
Sprint 7 recorded for its `P13`/`P15`-before-`P12` pair, and it is recorded here for the same reason.
⚠️ **Rank is priority, not a schedule.** ⛔ **Do not "fix" it by renumbering** — ADR-035 permits the
owner-ruled swap of two rows, not a re-rank of the board.

⭐ **Two soft orderings that are merit, not hard gates — and they are the whole argument for `P2` and
`P4`. They are recorded here and in each row, and neither is written into a `Depends on` line, because
neither brief declares one:**

- **`0271` before `0338`.** Both touch `select-active`.
- **`0381` before `0341`.** `0341` copies the task movers' shape; `0381` fixes a hole in it.

## ⭐ WHY `0271` AND `0381` ARE ON THIS BOARD — THE TWO ROWS THE OWNER COULD HAVE CUT AND DID NOT

**Both are hardening rows on a lifecycle board, and both pay off *inside this sprint*. That is the
argument, and it is a sequencing argument in each case.**

### `0271` (`P2`) — pin `dashboard.sh`'s untested behaviors **BEFORE `0338` rewrites them**

`0271` covers **five** behaviors of `dashboard.sh`'s identity grammar and its `select-active` half that
are **correct today and have no test that goes red when they are undone**. Two were measured inside
`0264` and the measurement is the argument:

- **dropping the `seen` de-dup at `claude/skills/fkit-status/dashboard.sh:118` leaves the whole suite
  green (129/129)** — yet it is what implements ADR-040 §2.5's *distinct*-token refusal.
- **replacing `head -1` at `claude/skills/fkit-status/dashboard.sh:109` with `cat` leaves the whole
  suite green** — yet it is what implements ADR-040 §2.1's first-line-only narrowing.

⭐ **`0338` is a substantial rewrite of the same file's eligibility and selection logic.** A rewrite
over behaviors with no red-proof is a rewrite that can silently drop them and ship green. ⛔ **After
`0338` lands, the same coverage costs more and proves less** — the guard would be written against the
new code rather than pinning what survived the change. **This is the cheap moment, and it is now.**

⚠️ **`0271` is coverage work, not a grammar change.** `dashboard.sh` must end **byte-identical** from
`0271`'s own edits. ⛔ Do not "fix" the grammar and do not "fix" `select-active`.

### `0381` (`P4`) — fix the mover shape **BEFORE `0341` copies it**

`0381` closes a hole in the **task** movers: they reason carefully about links they must **repoint**,
and have **no step at all** for the `NAMED_EXEMPT` exemption keys a move **invalidates**. Measured on
disk 2026-09-07: the strings `NAMED_EXEMPT` and `reference-integrity` appear **zero** times in either
`claude/skills/fkit-task-done/SKILL.md` or `claude/skills/fkit-task-cancelled/SKILL.md`.

⭐ **`0341` builds the SPRINT movers by mirroring the task movers.** Its own brief says so — it names
`fkit-task-done/SKILL.md`'s status-first table, its `git mv` step and its link-surface step as the
model. ⛔ **Ship `0341` first and the hole is copied into two more skills, and the fix then costs four
files instead of two.**

⚠️ **And it is already a live tax.** `0381`'s filing records the gap firing **twice in one day**, both
times as a red suite found **after** a close had reported success. ⭐ **This board closes seven task
folders and then closes itself with a brand-new mover.** ⛔ **It is the wrong sprint to leave that hole
open on.**

## ⛔ WHAT THIS BOARD DELIBERATELY LEAVES OUT — AND WHY, ROW BY ROW

**Naming the omissions, so a later reader can tell a scoped board from a partial one.**

| Left out | Why — re-measured 2026-09-10 |
|---|---|
| [`0322`](../tasks/backlog/0322-escape-the-stray-pipes-in-the-board-rows-and-guard-against-new-ones/brief.md) — escape the stray board pipes | ⭐ **A CORRECTION TO A FIGURE RELAYED TO THIS PRODUCER: it is NOT 12 rows.** Re-measured escape-aware today, counting only pipes **not** preceded by a backslash: **`backlog.md` holds 4 defective rows, of which 2 are open** (`0169`, `0278`) and 2 are closed (`0318`, `0319`); `sprints/done/sprint-2.md` holds **1** and `sprints/done/sprint-5.md` holds **1**, both in scope by owner ruling Q1 of 2026-08-22. ⛔ **Six defective rows across three boards, four of them here, two of them open.** A rendered-markdown defect the dashboard parses fine. ⛔ **Not a lifecycle row, and it collides with `0340`** — see the sequencing note below |
| The **23 record-repair rows**, as a class | ⛔ **Sprint 7 already tried this and missed its criterion.** Ruling S2 makes the share a reported metric that **gates nothing**, so there is no criterion here for a repair sweep to serve. ⭐ **Attacking the class again this sprint would be doing the thing the caveat above says the instrument wrongly rewards** |
| The **symlink cluster** — [`0045`](../tasks/backlog/0045-gate-read-side-symlink-hazard-in-init/brief.md), [`0329`](../tasks/backlog/0329-decide-and-implement-inits-behaviour-when-gitignore-is-a-symlink/brief.md), [`0330`](../tasks/backlog/0330-gate-the-launchers-fkit-lockdown-writes-against-a-symlinked-fkit/brief.md), [`0332`](../tasks/backlog/0332-decide-and-implement-inits-behaviour-when-fkit-interview-is-a-hard-link/brief.md), [`0334`](../tasks/backlog/0334-fix-the-launchers-symlink-blind-agents-fail-safe/brief.md), [`0336`](../tasks/backlog/0336-guard-inits-claude-refresh-against-a-wrong-type-squatter-and-name-every-symlinked-entry/brief.md) | ⭐ **THE PRODUCER'S SPRINT 9 RECOMMENDATION, RECORDED HERE SO IT IS NOT RE-DISCOVERED.** Six open rows on one coherent theme — `fkit-claude-init.sh` and `fkit-claude.sh` against symlinked and hard-linked paths — with a shipped precedent already closed (`0327`). ⛔ **A cluster that coherent deserves its own board and its own criterion, not two rows bolted onto a lifecycle sprint.** ⚠️ **This is a recommendation, not a ruling** — the owner has decided nothing about Sprint 9 |
| [`0380`](../tasks/backlog/0380-delta-ingest-the-closed-task-backlog-bounded-out-of-sweep-c/brief.md) — the bounded delta-ingest out of Sweep C | ⛔ **A wiki-vault write, so it is `fkit-wiki`'s and nobody else's** ([ADR-005](../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)). Independent of every row here, and it can run any time without a rank |
| [`0194`](../tasks/backlog/0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md) — assess ADR-037's clause sites | ⛔ **An assessment with no dependency on this board and no deadline.** It touches neither the sprint lifecycle nor the movers |
| [`0329`](../tasks/backlog/0329-decide-and-implement-inits-behaviour-when-gitignore-is-a-symlink/brief.md), named on its own | ⛔ **Named separately because it is the cluster's decision row** — it settles a behaviour before implementing it. ⭐ **That is exactly why it should open Sprint 9 rather than ride along here**: an investigation row scoped mid-sprint gets implemented before its finding is reviewed |

## ⚠️ THE `0340` SEQUENCING NOTE — `sprints/done/sprint-2.md` AND `sprint-5.md` MUST END BYTE-IDENTICAL

⛔ **`0340` (`P3` — re-ranked 2026-09-10, see §"⚠️ THE RE-ORDER OF 2026-09-10") requires every plan
already under `sprints/done/` to end byte-identical**, unless `0337`'s accepted ADR turns out not to
admit the legacy `> ## 🔒 CLOSED — <date>.` form — in which case it rewrites **line 3 only** and touches
no other line. Its own brief says so, and its verification step asserts that each archived plan's diff
is **one added carrier and nothing else**.

⭐ **THE OWNER HAS SINCE SETTLED THE "UNLESS", AND IT RESOLVES TO BYTE-IDENTICAL.** Ruling of
2026-09-10, verbatim option label **"Keep — permanent compat rung (Rec)"**: ⛔ **the legacy
`> ## 🔒 CLOSED — <date>.` banner reads as `Done` permanently**, not as a migration to be undone. ⭐ **So
`0340` rewrites NONE of the archived plans** — the conditional branch above is now closed, and all
seven end byte-identical.

⚠️ **`0322` — the stray-pipe repair — edits `sprints/done/sprint-2.md` and `sprints/done/sprint-5.md`
in the body of the file.** ⭐ **The two are in direct conflict on those two files.** ⛔ **`0322` is
deliberately not on this board** (see the table above), so no conflict is live today — **but if it is
ever pulled while `0340` is open, the two rows must be ordered explicitly and must not run
concurrently.** Recorded here so the collision is found now rather than in a diff.

⚠️ **`0340`'s brief is dated and must be re-derived at pickup, not trusted.** It was written 2026-08-25
naming `sprint-6.md` as the open plan to backfill; it carries a 2026-08-29 correction for Sprint 6's
archival. ⛔ **Since that correction, Sprint 7 has ALSO been archived.** Re-measured 2026-09-10:
`ai-agents/sprints/` holds **`backlog.md` plus this board**, and `sprints/done/` holds **seven** plans,
`sprint-1.md` through `sprint-7.md`. ⭐ **The open plan `0340` backfills `🔄 In progress` onto is
THIS ONE.**

## ⚠️ THE `0340` SCOPE CORRECTION — ITS TITLE OVERSTATES IT, AND THE REAL WORK IS ONE LINE

⛔ **`0340`'s title says "onto EVERY existing sprint plan in this repo". That is no longer what the
task does.** The producer's call, recorded here because the architect flagged the discrepancy and
correctly left the product judgement to this role.

**Re-measured on disk 2026-09-10 — every figure in `0340`'s `## Context` is 16 days stale:**

| `0340`'s brief says | Measured today |
|---|---|
| *"Today the top holds only `sprint-6.md` and `backlog.md`"* | ⛔ **`backlog.md` + `sprint-8.md`.** `sprint-6.md` was archived 2026-08-29 |
| *"`sprints/done/sprint-1..5.md`"* — five plans | ⛔ **`sprint-1.md` … `sprint-7.md` — SEVEN**, every one carrying `> ## 🔒 CLOSED — <date>.` at line 3 |

⭐ **Combined with the "Keep — permanent compat rung (Rec)" ruling above, the seven archived plans are
now explicitly OUT of scope — not "check, don't assume", but settled and out.** ⛔ **`0340`'s entire
remaining deliverable is ONE LINE inserted at line 3 of ONE FILE — this board.** Plus its report.

### ⭐ THE CALL: CORRECT THE SCOPE IN THE BRIEF AND ON THIS BOARD — ⛔ DO NOT RENAME THE TASK

⭐ **The title is wrong and stays.** Two reasons, and the second is the decisive one:

- ⭐ **The brief is the live scope, and this board says so on every row.** A dated addendum on `0340`'s
  brief carries the correction with full force; the folder name is an identifier, not a specification.
- ⛔ **RENAMING THE FOLDER WOULD MOVE A TASK FOLDER — which is precisely the link-surface hazard
  `0381` exists to fix, and `0381` HAS NOT SHIPPED.** A rename re-points every inbound link and
  invalidates `NAMED_EXEMPT` keys that no mover has a step for. ⭐ **Paying that cost to fix a
  cosmetic title, on the one board that has the fix queued at `P4`, is the wrong trade** — and doing
  it mid-sprint on a live board is worse.

⚠️ **Re-titling `0340` after `0381` ships is cheap and defensible.** ⛔ **It is not scoped here and no
one should treat this note as authorising it** — it is a suggestion for a later board.

## ⚠️ NO SUCCESSOR CLAUSE — AND THE OMISSION ESTABLISHES NO CONVENTION

⛔ **This board names no successor sprint, and the decision is DEFERRED TO CLOSE, not taken now.**
Ruling S5 accepted the producer's own recommendation: whether Sprint 9 exists, and what it contains, is
decided when this board closes and on the facts that hold then. ⚠️ **The producer's Sprint 9
*recommendation* is recorded in the omissions table above — it is a recommendation and nothing more.**

⭐ **Sprint 7's precedent is that such an omission establishes no convention, and it applies here.**
Sprints 1–4 each named a successor; Sprints 5, 6 and 7 did not, each for its own recorded reason.
⛔ **Naming one now would ship a dangling link to a board that does not exist** — the shape `0294`
weighed and marked *"Not recommended without an explicit ruling."*

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done (agent-closed — not owner-verified) | P1 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Record the sprint lifecycle — explicit sprint statuses, and "current sprint(s)" = every sprint In progress** *(owner report 2026-08-25 + three owner rulings the same day, verbatim: OQ-1 **"Default lowest + marker override (Recommended)"**; OQ-3 **"Yes — banner makes it ineligible (Recommended)"**; and on OQ-2 the reframe — *"we need to add the statuses to the sprints, similarly to the way we work with tasks: backlog, in progress, done, cancelled … ALL the currently active sprints should be reported about"*. An ADR mirroring the task lifecycle (`## Status` field / board row / folder location / producer-only movers, `task-status-vocabulary.md:11-33`) onto sprints, which today carry status only by location (`README.md:9`) and the `🔒 CLOSED` banner (`sprints/done/sprint-1..5.md:3`) that the selector never reads (`dashboard.sh:241`). ⚠️ Supersedes ADR-041 §1.4 (highest-N) — ADR-041 `:330-332` names this report as its own re-raise. ⚠️ Design constraint: `## Status` in a plan IS the task table (`dashboard.sh:372,452`), so the sprint status needs another carrier. ✅ **All three design decisions RULED 2026-08-25, live via `AskUserQuestion`, verbatim:** SD-1 **"Line-3 banner (Recommended)"** (status = a line-3 header banner generalising `🔒 CLOSED`); SD-2 **"`sprints/cancelled/` (Recommended)"**; SD-3 **"Mover skills, producer-only (Recommended)"** (`/fkit-sprint-done` + `/fkit-sprint-cancelled`, built by `0341`). Nothing pending for the owner — the architect writes the ADR settled. Owner `fkit-architect`. **Blocks `0338`, `0339`, `0340`, `0341`.**)* ⭐ **WHY `P1`:** nothing else on this board exists without it — it is the ADR that fixes the sprint status vocabulary, the line-3 banner carrier (SD-1), `sprints/cancelled/` (SD-2) and producer-only movers (SD-3), and **four of the other six rows build to it**. ⭐ **`Unscheduled` LIFTED for this task by ruling S1 of 2026-09-10.** **Depends on: nothing** — all six owner rulings are on record, settled, and no owner decision is pending. **Blocks `0338`, `0339`, `0340`, `0341` — hard.** | [`0337-record-the-decision-that-the-current-sprint-is-the-lowest-numbered-open-sprint-not-the-highest`](../tasks/done/0337-record-the-decision-that-the-current-sprint-is-the-lowest-numbered-open-sprint-not-the-highest/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P2 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Pin the three unpinned behaviors in the sprint-identity grammar** — the distinct-count refusal, first-line-only, and a `prove-red` mutation *(**owner ruling 2026-08-11**, given live via `AskUserQuestion` in a `fkit lead` session, **the option label is the verbatim text**: **"File as one follow-up"** — bundles three review residuals from `0264` into one brief; source of truth for the wording is `0264`'s `review.md` residual **A2**; all three are the same shape — **a correct behavior with no test that reds when it is undone** — so ⛔ **this is coverage work, not a grammar change**, and `dashboard.sh` must end byte-identical; (1) the `seen` de-dup at `dashboard.sh:118` implements ADR-040 §2.5's *"two or more **distinct** tokens ⇒ refuse"* and **dropping it leaves the whole suite green (129/129)** — T6 does not exercise it, both its fixtures use two *different* tokens, and ⚠️ **T6's comment was already corrected in `0264`** (owner ruling 2026-08-11, verbatim **"Fix the comment now"**) so **do not restate the old claim** — the guard itself is what is outstanding; (2) ADR-040 §2.1's first-line-only narrowing at `dashboard.sh:109` — **replacing `head -1` with `cat` leaves the whole suite green**, and a whole-file scan can `print` twice and hand `PLAN_SPRINT` a **multi-line value** no consumer expects; (3) no `test/prove-red.sh` mutation covers the new grammar — `0264` added none because its verification step 7 fenced the diff to two files, and ADR-026 discipline wants one; **each guard must prove itself red** (ADR-026); ⚠️ **`gawk`/`mawk` are UNVERIFIED and carried as CONTEXT, not scope** (`0264` residual A3 — only BSD awk was exercised; constructs are POSIX and BSD is stricter, but it was not measured) — ⛔ do not scope installing another awk; ⛔ **`moved_target` not being right-bounded is OUT** — owner ruled **"Accept as residual"** 2026-08-11, it stays `0264`'s residual A1; ⛔ no `STATUS_HEADING_RE` change, ⛔ no change to the `backlog` basename special case, ⛔ no new devDependency (ADR-014), ⛔ no `wiki-vault/` write (ADR-005); **Depends on `0264`**; owner: fkit-coder)* ⚠️ **WIDENED 2026-08-11 BY OWNER RULING — THE COUNT "three" IN THIS CELL IS STALE. This task now carries FIVE items.** The cell text above is left byte-identical; the two added items and the exclusions ruled with them are in §"Addendum — the owner-ruled fold of 2026-08-11". **Placement is unchanged** (Backlog, unranked), and the **brief** is the live scope. ⭐ **WHY `P2`:** it pins five correct-but-untested `dashboard.sh` behaviors **BEFORE `0338` rewrites the same file** — two of them measured inside `0264` to survive deletion with the whole suite green (129/129). ⛔ **This is the cheap moment; after `0338` lands the same coverage costs more and proves less.** ⚠️ **Never `Unscheduled` by the 2026-08-29 ruling** — it is not in the `0337`–`0351` range, and it arrives by ruling S1 naming it. **Depends on `0264` and `0265` — both CLOSED, so nothing here is waiting. Blocks: nothing.** ⚠️ **Soft ordering, merit not gate: run before `0338`.** ⛔ `dashboard.sh` must end **byte-identical** from this row's own edits — coverage work, not a grammar change. | [`0271-pin-the-three-unpinned-behaviors-in-the-sprint-identity-grammar`](../tasks/done/0271-pin-the-three-unpinned-behaviors-in-the-sprint-identity-grammar/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P3 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Backfill a sprint status onto every existing sprint plan in this repo** *(the data migration `0337`/`0338` create: `sprint-6.md` has no status banner (SD-1 ruled: line-3 banner), so after `0338` the selector reports `active none` here until this lands — this task inserts the `🔄 In progress` banner at line 3; `sprints/done/sprint-1..5.md` carry the `🔒 CLOSED` banner and may need nothing if the ADR reads it as Done — check, don't assume; `backlog.md` gets no sprint status. This repo's records, not the product — producer act. Owner `fkit-producer`. **Depends on `0337`, `0338`.**)* ⭐ **WHY `P3`:** it stamps `🔄 In progress` onto **THIS board** — ⛔ **without it the selector reports `active none` here and success criterion (a) cannot pass**, however correct `0338`'s code is. It also backfills the banner onto the archived plans if `0337`'s ADR does not admit the legacy `🔒 CLOSED` form. ⭐ **`Unscheduled` LIFTED for this task by ruling S1 of 2026-09-10.** **Depends on `0337` and `0338` — both hard** (step 1 cannot pass without the reader). **Blocks: nothing.** ⭐⭐ **RE-RANKED `P6` → `P3` ON 2026-09-10 BY OWNER RULING `S6`, verbatim *"Re-order — 0340 before 0338 (Rec)"* — this row now runs BEFORE `0338`.** ⛔ **The "both hard" above is CORRECTED: only `0337` is a work dependency.** `0338` is named in the brief as *"the reader that verifies it"* — a **deferred verification**, not an input, so this row runs at `P3` and its step-1 proof lands when `0338` ships at `P6`. ⛔ **Reason for the swap: shipping `0338` first takes THIS BOARD out of `select-active` mid-sprint** — see §"⚠️ THE RE-ORDER OF 2026-09-10". ⚠️⚠️ **THE BRIEF IS DATED — RE-DERIVE AT PICKUP.** It names `sprint-6.md` as the open plan and carries a 2026-08-29 correction for Sprint 6's archival; ⛔ **Sprint 7 has ALSO been archived since.** Re-measured 2026-09-10: `ai-agents/sprints/` holds `backlog.md` plus this board, and `sprints/done/` holds **seven** plans. ⛔ **Archived plans end BYTE-IDENTICAL** unless the ADR forces a line-3 rewrite — see §"⚠️ THE `0340` SEQUENCING NOTE" for the collision with `0322`, which is not on this board. | [`0340-backfill-a-sprint-status-onto-every-existing-sprint-plan-in-this-repo`](../tasks/done/0340-backfill-a-sprint-status-onto-every-existing-sprint-plan-in-this-repo/brief.md) |
| 🔄 In progress | P4 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** ⛔ **The task movers have no step for the `NAMED_EXEMPT` keys a move invalidates — they repoint links, they never DELETE an exemption** *(**owner ruling 2026-09-07**, live `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`, option label verbatim **"File it as its own row (Rec)."**; ⭐ **the defect in the coder's own words** — *"`/fkit-task-done` reasons about links it must **repoint** but has no step for exemption keys it must **delete** — the keys are in a test file, outside the folders it inspects"*; measured on disk 2026-09-07: the strings `NAMED_EXEMPT` and `reference-integrity` appear **ZERO** times in **both** [`fkit-task-done`](../../claude/skills/fkit-task-done/SKILL.md) and [`fkit-task-cancelled`](../../claude/skills/fkit-task-cancelled/SKILL.md), so ⛔ **a fix landing only in `task-done` half-ships it**; ⚠️ **it fired TWICE in one day, both times as a red suite found AFTER a close had reported success** — closing Sweep C's five members left three keys on [`0358`](../tasks/done/0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md)'s `backlog/` path, and closing `0358` itself made those links **resolve**, so the exemptions became dead weight, `namedExemptCount` fell **9 → 6**, and **`L3` red on the FALL, not a rise** (a fourth link, `0290`, broke in the same move and needed a **new** exemption); ⭐ **THE DURABLE RULE TO RECORD** — *"`../../done/X` survives, `../X` does not"* is right about a **POINTER** and **INVERTS for an EXEMPTION KEY**: a sibling-relative link **heals** when its citer moves into `done/` beside a target already there, and its key is then **dead weight to DELETE, not repoint**; ⚠️ **it does not fire on every close** — `0359`'s close the same day grepped clean, zero keys naming it, which is exactly why the gap keeps surviving; ⛔ **FRAME ONLY — the answer is NOT designed in the brief**: whether the movers gain a step, whether the key format becomes move-invariant, or something else is the implementer's **plan gate with the owner**, and a run arriving having already chosen has skipped it; ⛔ **DISTINCT from [`0378`](../tasks/backlog/0378-decide-how-a-worker-tells-a-concurrent-close-s-transient-link-red-from-its-own/brief.md)** (concurrency/timing — someone else's in-flight move) **and [`0363`](../tasks/backlog/0363-design-the-sweep-completion-step-that-stops-a-fixed-class-recurring-one-file-over/brief.md)** (claim propagation across a class) — this is **one missing step in one skill** and it reds **DETERMINISTICALLY**, no race, no second actor; ⛔ **do not let anyone fold the three**; ⚠️ `test/reference-integrity.test.js` is a **coder** surface, so any option putting the fix inside a mover run must say what the producer does instead; **depends on nothing**, but is a **live tax on every close**; owner: `fkit-coder`; filed UNRANKED by a spawned `fkit-producer` with no owner channel ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)), appending and renumbering nothing ([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)))* ⭐ **WHY `P4`:** it fixes the hole in the **task** movers **BEFORE `0341` copies their shape** into two more skills — `0341`'s own brief names `fkit-task-done`'s status table, `git mv` step and link-surface step as its model, so shipping `0341` first makes the fix cost four files instead of two. ⛔ **And this board closes seven task folders and then closes itself with a brand-new mover — the wrong sprint to leave that hole open on.** ⚠️ **Never `Unscheduled` by the 2026-08-29 ruling** — outside the `0337`–`0351` range; it arrives by ruling S1. **Depends on nothing. Blocks: nothing.** ⚠️ **Soft ordering, merit not gate: run before `0341`.** | [`0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates`](../tasks/backlog/0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates/brief.md) |
| 🔲 Backlog | P5 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Build the producer-only sprint movers — `/fkit-sprint-done` and `/fkit-sprint-cancelled`** *(SD-3 ruled 2026-08-25, live via `AskUserQuestion`, verbatim **"Mover skills, producer-only (Recommended)"**. Mirrors the task movers (`fkit-task-done/SKILL.md:56-70` status-first table, `:98-104` `git mv`, `:109-230` link surface): in one act — line-3 banner (SD-1), `git mv` to `sprints/done/` or `sprints/cancelled/` (SD-2), every in-file and inbound link repointed with counts re-derived at run time (Sprint 5 measured 57 in-file / 53 files, 177 inbound), cancelled plans' open rows de-scoped to `backlog.md` with the five brief edits, agent-closed marker when spawned (ADR-033 §5). Ownership declared once in `claude/skills-for-role.sh:51`, hook-enforced (ADR-018), `test/skill-ownership-hook.test.js:307-315` `MOVERS` invariant grows to four; every enumeration of the task movers (`fkit-producer.md:6,38,77,118`, `fkit-team/SKILL.md:54,61`, `CLAUDE.md:58`, READMEs) names the pair. Owner `fkit-coder`. **Depends on `0337`, `0338`.**)* ⭐ **WHY `P5`:** it is **the mover** — and it is what makes this board *"the first sprint in this project's history closed by a mover instead of by hand."* ⛔ **Success criterion (b) is unreachable without it.** ⭐⭐ **`Unscheduled` LIFTED for this task by ruling S1 of 2026-09-10 — INCLUDING ruling 7 of 2026-08-29 ("Hand-archive again, with the caveat (Rec)"), which named `0341` `Unscheduled` a SECOND time in the words *"do not pull it in"*. That specific re-naming is lifted; this row is here legitimately.** **Depends on `0337` and `0338` — both hard.** **Blocks: nothing** — `0340` adds an `In progress` banner, which is not a close. | [`0341-build-the-producer-only-sprint-movers-fkit-sprint-done-and-fkit-sprint-cancelled`](../tasks/backlog/0341-build-the-producer-only-sprint-movers-fkit-sprint-done-and-fkit-sprint-cancelled/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P6 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Make `/fkit-status` report every In-progress sprint, and give the selector a status rung and a lowest-first single choice** *(builds the `0337` ADR: a **line-3 banner** reader in `dashboard.sh` (SD-1 ruled; one implementation, ADR-041 §5; legacy `🔒 CLOSED` reads as Done; no banner → unresolved + drift; `sprints/cancelled/` excluded like `done/`), eligibility = identity **and** `In progress`, `select-active` prints ALL active plans lowest-first plus one `chosen` (lowest-ordered, option-(d) marker override, OQ-1), sprint-level drift facts, `SKILL.md:26-52` rewritten for N sprints (beats 1-6 + board per sprint, one closing line — still one output), S1 flipped and new tests. Before `0340` lands this repo reports `active none` + drift — expected, recorded. Owner `fkit-coder`. **Depends on `0337`. Blocks `0339`.**)* ⭐ **WHY `P6`:** it is **the reader** — eligibility gains a status rung, and `select-active` reports every `In progress` sprint with one `chosen`. ⭐ **This is the row that makes success criterion (a) observable at all**; today the script has no status rung and cannot name a status as its reason for choosing anything. ⭐ **`Unscheduled` LIFTED for this task by ruling S1 of 2026-09-10.** **Depends on `0337` — hard** (accepted, with SD-1 ruled; the ADR's carrier is what this parses). **Blocks `0339`, `0340`, `0341`.** ⭐⭐ **RE-RANKED `P3` → `P6` ON 2026-09-10 BY OWNER RULING `S6`, verbatim *"Re-order — 0340 before 0338 (Rec)"* — this row now runs AFTER `0340`.** ⛔ **"Blocks `0340`" is CORRECTED: it does not.** `0340` needs only `0337`'s grammar to write the banner; this row is what *reads* it back. ⛔ **Shipping this row before `0340` takes THIS BOARD out of `select-active` and the ship-loop loses the board it is being driven from** — see §"⚠️ THE RE-ORDER OF 2026-09-10". ⚠️ **VERIFICATION STEP 3 IS STALE TWICE OVER — re-derive it at pickup.** It names `Sprint 6`/`sprint-6.md`, archived since 2026-08-29; and its *"**Before `0340`**: … `active none` plus the `sprint-status-unresolved` drift … expected pre-migration result"* clause **INVERTS under `S6`** — `0340` now lands FIRST, so the expected result here is `sprint-8.md` **active and chosen**. ⭐ **This row's verification is now where success criterion (a) is actually demonstrated.** | [`0338-flip-select-active-to-choose-the-lowest-ordered-open-sprint-and-repin-its-tests`](../tasks/done/0338-flip-select-active-to-choose-the-lowest-ordered-open-sprint-and-repin-its-tests/brief.md) |
| 🔲 Backlog | P7 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-09-10** — *"Approve 7 rows, lift Unscheduled (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL — the brief is the live scope.** **Teach the lead, producer, ship-loop and README the sprint lifecycle and what "current sprint(s)" means** *(`fkit-lead.md` has no definition and no `/fkit-status` (`skills-for-role.sh:50`); `fkit-producer.md:15,89` says *"find the active one"*; `fkit-sprint-ship-loop/SKILL.md:47-48,94` must name the selector's **chosen** board when several are active; `README.md:9` + scaffold copy define "completed" only. Adds `conventions/sprint-status-vocabulary.md` (markers, the line-3 banner carrier (SD-1), the movers as the only setters of Done/Cancelled (SD-3, `0341`), `sprints/done/` + `sprints/cancelled/` (SD-2), definition = every `In progress` sprint, single-board rule, the selector command as the one resolution path), a few lines in both agent files, ship-loop wording, one README sentence, a `fkit-task-brief` re-read. Owner `fkit-coder`. **Depends on `0337`, `0338`.**)* ⭐ **WHY `P7`:** it closes the loop with the roles and pages that actually **answer the owner** — the lead, the producer, the ship-loop and both READMEs — and it is the row that ends the confusion the owner reported on 2026-08-25 in the first place. ⛔ **Last because it documents what `0337` and `0338` decide**; written earlier it would document a design that had not settled. ⭐ **`Unscheduled` LIFTED for this task by ruling S1 of 2026-09-10.** **Depends on `0337` and `0338` — both hard. Blocks: nothing.** | [`0339-teach-the-lead-and-producer-what-current-sprint-means-and-how-to-resolve-it`](../tasks/backlog/0339-teach-the-lead-and-producer-what-current-sprint-means-and-how-to-resolve-it/brief.md) |

## Notes

### How the seven rows arrived, and the three Backlog-board edits this pull performed

⭐ **Every row below arrived by ruling S1 naming it, and by nothing else.** ⛔ Not by an agent's read of
the backlog, not by a ship-loop driver noticing spare capacity.

**Pulling a task onto a sprint is three mandatory edits, and the Backlog board specifies all three
under its heading "How work moves on and off this board", bullet "Off:". All three were performed for
each of the seven:**

1. **The row was added to this board**, ranked `P1`–`P7`.
2. **The Backlog board's row was flipped** to `➡️ Moved to [Sprint 8](sprint-8.md) — priority P<n>`.
   ⛔ **The row was NOT deleted** — a deleted row loses the pointer to where the work went. **This board
   is ranked, so the `— priority P<n>` suffix is required and was written.**
3. **Each brief's own `## Sprint` field was changed** from `Backlog` to `Sprint 8`.

⛔ **Skipping edit 3 would leave a permanent drifted row on the Backlog board** — the drift rule
compares the `Moved` target against the brief's `## Sprint`, and a mismatch renders forever.

⭐ **NOTE APPENDED 2026-09-10 — A FOURTH EDIT WAS PERFORMED, AND THE OWNER HAS CONFIRMED IT.** The
three numbered edits above are left byte-identical; this is the fourth, appended beside them:

4. **Each brief's own `## Priority` field was changed** from `Unscheduled` to its rank on this board
   (`P1`–`P7`).

**Owner ruling 2026-09-10, given live via `AskUserQuestion` in a `fkit lead` session, option label
verbatim "Confirm the edit (Rec)": the edit stands and is NOT reverted.** ⭐ **Measured today across
all seven briefs — `0271`, `0337`, `0338`, `0339`, `0340`, `0341`, `0381` — each carries exactly one
`## Priority` change from `Unscheduled` to a `P<n>`.** ⛔ **The Backlog board's own "Off:" rule
mandates only three edits and does not mention the brief's `## Priority` at all** — so the real
procedure is four and the written rule is **incomplete**. ⭐ **That gap is recorded on `backlog.md`
beside the rule itself, and on `0341`'s brief**, because `0341` mechanizes this procedure into
`/fkit-sprint-done` and would otherwise mechanize the incomplete shape.

⛔ **Nothing else on the Backlog board was touched.** No row was re-ranked, no row was reordered, no
row was deleted, and no row outside these seven was altered
([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
The Backlog board remains an **archive of known issues, not a ranked queue**, per the owner ruling of
2026-08-29 — its `Priority` column still reads `—` throughout.

### ⚠️ Each row's Task cell carries the Backlog board's filing text BYTE-IDENTICAL

**Precedent: Sprint 7 `P1` and Sprint 6 `P10` both did exactly this.** Each cell below is bracketed by
a **pull note** before it and a **why + `Depends on`** note after it, both clearly marked, and the
Backlog board's own filing text sits between them **unchanged**.

⚠️ **Where a carried cell's own text is stale, the staleness is carried too.** `0271`'s cell says
*"three"* behaviors and the task carries **five** — that divergence is flagged inside the cell itself
and the brief is the live scope. ⛔ **A carried cell is a record of how the row was filed, not a
restatement of its current scope. Read the brief.**

### ⛔ The four hard rules that govern every row on this board

- ⛔ **`Done` and `Cancelled` are set only by the mover skills, and only the producer may invoke them**
  ([ADR-033](../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
  A close performed with no owner present **must** carry the `(agent-closed — not owner-verified)`
  marker.
- ⛔ **No role but `fkit-wiki` writes `ai-agents/wiki-vault/`**
  ([ADR-005](../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **Never commit or push unless the owner explicitly asks.**
- ⛔ **No secrets in any artifact** — this board goes to git.

### Open questions for the owner

> ⭐ **STATUS OF THIS LIST, 2026-09-10: questions 1 and 3 are ANSWERED; question 2 is still open.**
> Both answers came live via `AskUserQuestion` in a `fkit lead` session the same day. ⛔ **The three
> questions below are left byte-identical** — a question is not deleted when it is answered, it is
> marked, so the board records what was asked as well as what was ruled.

1. ⛔ **Success criterion (b)'s "candidate" clause** — reading 1 or reading 2? See
   §"⚠️ ONE UNSETTLED READING IN (b)". ⭐ **The producer recommends reading 2**: it survives whatever
   `0337`'s ADR decides about mover atomicity, and it stays un-fakeable by hand.
   - ✅ **ANSWERED 2026-09-10 — option label verbatim "Reading 2 — archived + mover-named (Rec)".**
     Criterion (b) above now reads reading 2; the recommendation was taken.
2. ⚠️ **Sprint 9 and the symlink cluster** — the producer recommends the six symlink rows as Sprint 9's
   spine. ⛔ **Nothing is decided and no row was filed on that basis.**
   - ⚠️ **STILL OPEN as of 2026-09-10.** ⛔ Nothing has been decided, and per ruling S5 this board
     names no successor — the decision is taken **at close**, on the facts that hold then.
3. ⚠️ **The repair-share classifier** — it counts `0337` and `0340` as record repair and both are
   misclassifications. ⛔ **Repairing it was not ruled and is not on this board.** Should it be filed as
   a Backlog row?
   - ✅ **ANSWERED 2026-09-10 — option label verbatim "File it as a Backlog row (Rec)".** Filed as
     [`0384`](../tasks/backlog/0384-teach-the-record-repair-classifier-that-a-net-new-record-is-not-a-repair/brief.md),
     **Backlog board, unranked, appended last** (ADR-035). ⛔ **Not on this board, and this board's
     scope did not change.**
