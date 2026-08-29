# Sprint 7 — Stop manufacturing record-repair rows: settle the reference-integrity condition, build the guards, sweep the class once

> ## ⭐ THE SECOND PASS HAS RUN. THIS BOARD IS NOW SCOPED IN FULL, RANKED `P1`–`P12`, BY OWNER RULING 2026-08-29.
>
> > ⭐ **AMENDED LATER THE SAME DAY — THE BOARD IS `P1`–`P13`.** An **eighth** owner ruling of
> > 2026-08-29, option label verbatim **"File it as a Sprint 7 row (Rec)"**, appended a thirteenth row:
> > [`0361`](../tasks/backlog/0361-settle-whether-a-sprint-board-may-be-committed-unranked/brief.md)
> > (`P13`), which settles whether a sprint board may be committed unranked. ⛔ **`P1`–`P12` are
> > unchanged and nothing was renumbered** — see `## Notes` §"⭐ Addendum — the THIRTEENTH row".
> > ⭐ **The one-row rule below is honoured: it demanded a thirteenth ruling, and this is it.**
>
> **Seven rulings, all given live via `AskUserQuestion` in a `fkit lead` session on 2026-08-29. Option
> labels are the verbatim text.** They are listed here first, in full, because every section below is
> downstream of one of them:
>
> | # | Ruling (verbatim option label) | What it settled |
> |---|---|---|
> | 1 | **"Approve all 12 as proposed (Rec)"** | The full `P1`–`P12` board below — **every row arrives by this ruling naming it** |
> | 2 | **"Narrow it — in-flight review fixes only (Rec)"** | `0352`'s shape. ⛔ **NO size floor**; `/fkit-task-brief`'s smallest-shippable rule is **NOT amended** |
> | 3 | **"Rank Sprint 7; declare backlog an archive (Rec)"** | This board is ranked; [`backlog.md`](backlog.md) is an **archive of known issues**, ranked at pull time |
> | 4 | **"Accept the 25 marked closes (Rec)"** | The sweeps (`0356`–`0358`) may close their absorbed rows, each `(agent-closed — not owner-verified)` |
> | 5 | **"Cap record repair, not process work (Rec)"** | The success criterion below. ⭐ **No cap on process work at all** |
> | 6 | **"Minor — v0.3.0 (Rec)"** | `0360` cuts **v0.3.0** with an annotated tag |
> | 7 | **"Hand-archive again, with the caveat (Rec)"** | `0360` hand-archives this board, carrying the not-owner-verified caveat. **`0341` stays `Unscheduled`** |
>
> ⛔ **THE ONE-ROW BANNER BELOW IS THIS BOARD'S OPENING RECORD, NOT ITS CURRENT SCOPE.** It is left
> **byte-identical** because it is the record of how the board opened and why. ⭐ **Read it as history.
> This block is the current state.** Nothing below it may be read as limiting this board to one row —
> the ruling it describes explicitly named a second pass, and **that pass is this one.**
>
> ⭐ **The one-row rule it states is HONOURED, not broken.** That banner says *"a row arrives here the
> way this one did: by an owner ruling that names it."* **Ruling 1 names all twelve.** Every row below
> arrived by it and by nothing else.
>
> ⛔ **What did NOT change: the fourteen other tasks in `0337`–`0351` are STILL `Unscheduled` by
> ruling**, and `0341` is named `Unscheduled` again by ruling 7. ⛔ None of them is on this board, and
> none may be added without a further ruling naming it.
>
> *Executed 2026-08-29 by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
> which asked nothing and decided nothing beyond the mechanics of the seven rulings above.*

> **Authority, stated first and in full.** This board exists by an **OWNER RULING given 2026-08-29 via
> `AskUserQuestion` in a live `fkit lead` session** — a selection from the question's option list, and
> **the option label is the verbatim text**: **"One-row Sprint 7, then scope it (Rec)"**. The option was
> put to the owner with this description, quoted verbatim: *"Open Sprint 7 holding only 0347, honouring
> your ruling literally, then scope the rest properly in a second pass. The producer's own
> recommendation. Closes the 0224/0225 ordering window now — both are still 🔲 Backlog, so the misroute
> is still live."*
>
> ⛔ **WHAT THAT RULING AUTHORIZES IS EXACTLY ONE ROW.** An **earlier owner ruling of the same day**
> pulled **`0347` alone** into a sprint and left **everything else in the `0337`–`0351` range
> `Unscheduled`** — fifteen tasks, one exception, named by the owner. ⛔ **No agent may add a second row
> to this board on its own judgement, however obviously a companion belongs here.** A row arrives here
> the way this one did: by an owner ruling that names it.
>
> ⚠️ **THIS BOARD IS DELIBERATELY UNFINISHED, AND THAT IS THE RULING, NOT AN OVERSIGHT.** The owner's
> chosen option names a **second pass** that scopes the rest. One row is this board's **opening** state,
> **not** its intended final scope, and nothing here may be read as "Sprint 7 is a one-task sprint."
> See §"⚠️ This board is SCOPED IN PART".
>
> Executed by a spawned `fkit-producer` with **no owner channel**
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
> which asked nothing and decided nothing beyond the mechanics of the ruling — and the shape choices it
> had to make with no precedent, each declared in §"📐 Where this board's shape comes from" rather than
> made silently.
>
> ⚠️ **This board opens against a gap, not a rollover** — the same way [Sprint 6](done/sprint-6.md)
> did. Sprint 6 was archived **2026-08-29** (`21 done — of 21`) with **no successor clause**, and
> between that archival and this board `select-active` returned `active none` and the project had **no
> active sprint** (measured 2026-08-29: `bash claude/skills/fkit-status/dashboard.sh select-active
> ai-agents/sprints` → `active none`, exit 3, `backlog.md` the only candidate). ⛔ **Sprint 6's banner
> is left byte-identical and is NOT amended to point here.**
>
> ⚠️ **What this board inherits, stated plainly rather than implied.** Sprint 6's own archival banner
> records that **the archival itself carried no owner ruling** and is to be read as agent-performed and
> **not owner-verified**, and its rows closed
> **`✅ Done (agent-closed — not owner-verified)`** ([ADR-033 §5](../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
> **Those markers stay on them permanently.** Nothing on this board changes that, and no row here may
> be written up as if it does.

**Goal — five things, in the order the board runs them.** ⭐ Superseded and replaced the one-row goal
below on **2026-08-29** by ruling 1; the old text is kept beneath as the opening record.

1. **Close the ADR-044 oracle window** before `0224` and `0225` are pulled — `0347` (`P1`), the row
   this board opened on.
2. **Stop the two structural causes** of record-repair rows: `0352` (`P2`) routes a reviewer's own
   in-flight finding to the review ledger instead of a new task folder, and `0353` (`P3`) settles the
   reference-integrity condition **once** instead of once per task.
3. **Build the guards and make them green** — `0354` (`P4`) and `0355` (`P5`) for the markdown-link
   half; `0237` (`P6`) and `0176` (`P7`) for the `path:NNN` half.
4. **Sweep the existing class ONCE, behind those guards** — `0356`, `0357`, `0358` (`P8`–`P10`),
   absorbing and closing the individually-filed rows.
5. **Make the result measurable, then ship it** — `0359` (`P11`) builds the counter Sprint 7's own
   success criterion needs; `0360` (`P12`) cuts **v0.3.0** and hand-archives this board.
6. ⭐ **Added 2026-08-29 by an eighth ruling — settle the rank rule before the release goes out.**
   `0361` (`P13`) decides whether a sprint board may be committed **unranked**, then makes the losing
   rule conform. ⚠️ **It is `P13` by the append rule but runs BEFORE `P12`** — `0360` may not archive a
   board with an open row, and the binding order lives in the dependency fields, not the rank.

> ⭐ **The board's shape in one line: `P2`–`P3` stop the bleeding, `P4`–`P7` build the check,
> `P8`–`P10` clean up behind it, `P11`–`P12` prove it and ship.**

**Goal, as this board opened — superseded by the five above, kept as the record:** one row, for one
reason — **close the ordering window before it closes itself the wrong way.**

1. **`0347` writes the ADR-044 oracle note onto `0224` and `0225` before either is pulled.** Both are
   still unstarted (measured below), so a note is enough and no rework is implied. If either ships
   first, it is built against the **old** oracle and ships the **8-of-13 misroute** ADR-044 §C6
   measured — the exact `## Owner` staffing ADR-044 §Decision 1 replaces.

**Measured 2026-08-29, on disk, for this board.** `0224` and `0225` each read `## Sprint` **`Backlog`**,
`## Priority` **`Unscheduled`**, `## Status` **`🔲 Backlog`**, and both folders sit in
`ai-agents/tasks/backlog/`. ⚠️ **The window is therefore still open and still preventable** — that is
the whole reason this row was singled out. ⛔ **Re-measure before acting on this line**
([`evidence-before-assertion`](../knowledge-base/conventions/evidence-before-assertion.md)); it is a
claim about a live board and it will go stale.

## ⭐ THIS BOARD IS RANKED `P1`–`P12` — OWNER RULING 2026-08-29

**Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session; the option
label is the verbatim text: "Rank Sprint 7; declare backlog an archive (Rec)".** The row order itself
was approved in the same act by ruling 1, **"Approve all 12 as proposed (Rec)"** — the owner approved
**this order**, row by row, not merely the idea of ranking.

⭐ **THE AUTHORITY IS NAMED BEFORE THE OUTCOME, AND IT IS NOT PRODUCER PRECEDENT.** Four things, per
`/fkit-task-brief` step 5:

1. **The owner ruled it** — not the producer, and not an inference from an earlier addendum.
2. **The date: 2026-08-29.**
3. **The channel: `AskUserQuestion`, live, in a `fkit lead` session**, relayed to a spawned
   `fkit-producer` which has no owner channel of its own
   ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
4. ⛔ **THIS IS NOT PRECEDENT FOR A PRODUCER RANKING A BOARD.** `/fkit-task-brief` step 5 is
   unchanged: *"A spawned producer has no owner channel and therefore never re-ranks."* This rank
   exists **only** because the owner gave it. A later producer reading this section as licence to rank
   on its own judgement has misread it — which is exactly the failure that section was written after.

⭐ **NOTHING WAS INSERTED AND NOTHING WAS RENUMBERED** — and that is checkable, not asserted:

- At the moment of ranking this board held **exactly one row** (`0347`), reading `🔲 Backlog`. ⛔ **No
  `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row existed anywhere on it**, so
  [ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)'s
  closed-row wall was not approached, let alone crossed.
- `0347` took `P1` — **the top, and the only position an append could give it.**
- All eleven other rows **appended below it**, in `P2`…`P12`. ⛔ **No mid-board insertion. No row
  renumbered.** The check was run **downward** from each insertion point, as ADR-035 requires.

**Three carriers were updated in the one act, exactly as the deferral clause instructed:**

| Carrier | Before | After |
|---|---|---|
| This board's `Priority` cell | `—` on the single row | `P1`…`P12` |
| Each brief's `## Priority` | `Unscheduled` | its `P<n>` |
| [`backlog.md`](backlog.md)'s `➡️ Moved` marker | no suffix (unranked-forward clause) | `— priority P1` / `P6` / `P7` |

⛔ **The section below is the record of why this board opened unranked. It is left BYTE-IDENTICAL and
is now SUPERSEDED.** Its own closing sentence anticipated this exact act: *"if and when the owner
ranks this board, the Priority cell, the brief's `## Priority`, and `backlog.md`'s `— priority P<n>`
suffix are all added in that one act."* **They were.**

⚠️ **Still true and unchanged by the ranking:** `dashboard.sh` reads a brief's `Status`, `Sprint` and
`Owner`; it **never** reads `## Priority`, and its `moved_target` parser never reads the suffix. **Every
rank on this board is documentation truth maintained by hand, not a parser contract.**

⛔ **FROM THE FIRST CLOSE ONWARD, THIS ORDER IS FROZEN.** ADR-035's wall applies the moment any row
here reads `✅ Done` or `⛔ Cancelled`: no row may then be promoted past it, and a re-rank needs a
fresh owner ruling given in that session. **Ranking was free today; it will not be tomorrow.**

## 🎯 SUCCESS CRITERION — record-repair rows under 10% of open work

**Owner ruling, 2026-08-29, `AskUserQuestion`, live `fkit lead` session; option label, verbatim:
"Cap record repair, not process work (Rec)".**

| | Value |
|---|---|
| **Baseline, measured on disk 2026-08-29** | **42 of 129 open task folders = 32.6%** (reported to the owner as **33%**) |
| **Target** | **under 10% of open work** |
| **Measured by** | [`0359`](../tasks/backlog/0359-the-throughput-counter-created-vs-closed-per-iso-week-and-record-repair-share/brief.md) (`P11`) — the counter this sprint builds |
| **Reported in** | `0360`'s archival banner (`P12`), with the real number, met or missed |

⭐ **THE RULING CAPS RECORD REPAIR AND NOTHING ELSE. There is NO cap on process work at all** — not a
soft one, not an implied one. A report that treats process work as over budget has misread the ruling.

⚠️ **THE BASELINE'S RULE IS NOT YET WRITTEN DOWN, AND THAT IS HALF OF `0359`'s JOB.** Measured
2026-08-29 by leading-verb classification over the 129 open briefs: **45 rows (34.9%)** read as record
repair; **42 (32.6%)** once the three that repair genuine **source** defects (`0215`, `0234`, `0334`)
are excluded. ⛔ **Neither figure is authoritative until `0359`'s script defines the rule.** The
criterion is stated against **42 / 129 / 32.6%** because that is the reading the owner was given; the
close report must say which figure the script reproduces and why
([`evidence-before-assertion`](../knowledge-base/conventions/evidence-before-assertion.md)).

⚠️ **The criterion is checkable only if `0359` lands.** If it does not, `0360` records the share as
**unmeasured** — ⛔ it does **not** estimate one. An unmeasured claim in an archival banner is permanent.

> ### ⛔ CORRECTION 2026-08-29 — THE DENOMINATOR `129` IS ALREADY STALE. IT IS **138** ON DISK.
>
> **Measured 2026-08-29, after the second pass, by reading every `## Status` field under
> `ai-agents/tasks/backlog/`: 138 task folders, all `🔲 Backlog`, none `🔄 In progress`.**
>
> - ⭐ **The `129` above was measured BEFORE the nine new briefs of the second pass existed.**
>   `0352`–`0360` were filed in that same act, and `129 + 9 = 138`. ⛔ **It is a counting artefact of
>   the pass, not a change in the work.**
> - **The ratio moves with it:** if the numerator holds at 42, the share is **42 / 138 = 30.4%**, not
>   32.6%. ⛔ **Neither is authoritative — the paragraph above still governs: `0359`'s script defines the
>   rule, and the close report says which figure it reproduces.**
> - ⛔ **The TARGET is unchanged and is not up for revision** — *"under 10% of open work"*, ruled. Only
>   the baseline reading moved.
> - **Expected effect of the sweeps, restated on the corrected base:** ~38 absorbed rows take **138 →
>   ~100** open folders. ⚠️ **A "~129 → ~100" statement mixes a pre-pass numerator with a post-pass
>   result and should not be repeated.**
> - ⛔ **`0361` (`P13`) is NOT record repair** and must not be counted as such by `0359` — it settles a
>   live rule conflict. Ruling 5 caps record repair and there is **no cap on process work at all**.

## ⛔ THE FORCED SEQUENCING — `P4` AND `P7` GREEN **BEFORE** `P8`, `P9`, `P10` START

⛔ **THIS IS A HARD GATE, NOT AN ORDERING PREFERENCE, AND IT IS THE OWNER-AGREED "VERIFIED, NOT
TRUSTED" CONSTRAINT.**

```
0353 (P3)  settles the condition
   ├─→ 0354 (P4)  builds test/reference-integrity.test.js  ─┐
   ├─→ 0355 (P5)  cleans the red set → makes P4 GREEN       │
   └─→ 0237 (P6)  cleans the citation residual              │──→ BOTH GREEN ──→ 0356 (P8)
                     └─→ 0176 (P7)  builds the citation guard ┘                  0357 (P9)
                                                                                 0358 (P10)
```

**The rule, stated so it cannot be read past:**

- ⛔ **`0356`, `0357` and `0358` DO NOT TOUCH A FILE until `test/reference-integrity.test.js` (`0354`)
  AND `test/coordination-citation-policy.test.js` (`0176`) are BOTH GREEN.**
- ⛔ **Each sweep's close report must paste both passing runs, dated BEFORE its first edit.** A sweep
  that reports the guards green *afterwards* has not honoured the gate.
- **Why:** a sweep rewrites coordinates and appends notes across dozens of records at once. **Without
  a guard underneath it, "the sweep was careful" is the only evidence there is** — and that is exactly
  the act that produced this backlog. Three consecutive citation sweeps have already missed a form
  they were sweeping for; `0309`'s own title records it.
- ⚠️ **`0176` cannot be green until `0237` lands** (*"shipping it red is not an option"* — `0176`'s
  own words, on its own owner ruling). So the gate on `P8`–`P10` reaches back through `P7` → `P6` →
  `P3`. **`P3` is the critical path for five rows.**
- ⚠️ **The gate does not cover everything, and pretending otherwise is worse than no gate.** Both
  guards **exempt `ai-agents/wiki-vault/`** (ADR-005), so **neither verifies `0358`'s output.**
  `/fkit-wiki-lint` is what verifies Sweep C, and `0358`'s verification step 6 is not optional.

## ⛔ [`backlog.md`](backlog.md) IS AN ARCHIVE OF KNOWN ISSUES, NOT A RANKED QUEUE

**Owner ruling, 2026-08-29, `AskUserQuestion`, live `fkit lead` session; option label, verbatim:
"Rank Sprint 7; declare backlog an archive (Rec)"** — the same ruling that ranked this board did this
in the same act.

- ⛔ **The Backlog board is never ranked as a whole.** Not now, not at the release, not ever. Its 128
  rows are a **standing archive of known issues** — recorded so they are not lost or re-discovered.
- ⭐ **Ranking happens at PULL TIME, onto a sprint board** — the way `0237` and `0176` were ranked onto
  this one. A rank is a position on **one** board
  ([`priority-is-rank-not-identity`](../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- ⛔ **No backlog row was ranked, renumbered or re-statused by this ruling**, and none may be. Measured
  on disk 2026-08-29 immediately after: the `Priority` column reads `—` on **every** row of that
  board's `## Status` table.
- **⏱ This DISCHARGES the deferred whole-board ranking pass of 2026-08-10** (*"After Sprint 5 ships
  (Recommended)"*), which made a ranking pass *"owed"* once the release was cut. ⭐ **It is not owed;
  it is superseded.** The declaration is written into `backlog.md`'s own `## Priority` section and
  `## Notes`, which is where a reader of that board will find it.

## ⛔ This board is UNRANKED — and one row is not a rank *(SUPERSEDED 2026-08-29 — see §"⭐ THIS BOARD IS RANKED" above; left byte-identical as the record of why it opened unranked)*

**The Priority column is `—`, and `0347`'s brief keeps `## Priority: Unscheduled`.**

The owner ruled this row's **placement**, not its **rank**. With one row on the board a rank would be
arithmetically trivial and **substantively invented** — and it would pre-commit the second pass's
ordering, since board rank is append-only against closed history
([ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)):
once this row closes, nothing can ever be ranked above it. **Writing `P1` here would spend a decision
the owner has not made.**

**This is the ordinary path, not a deviation.** [`backlog.md`](backlog.md)'s **"Off:"** rule carries an
**unranked-forward clause** — when the destination board is unranked, the moved row's marker is written
`➡️ Moved to [Sprint 7](sprint-7.md)` with **no `— priority M` suffix**, and *"⛔ Never write
`— priority —`, and never invent a number."* Sprint 6 is the worked precedent that clause was written
from. ⚠️ **The omission is a deferral, not an exemption: if and when the owner ranks this board, the
Priority cell, the brief's `## Priority`, and `backlog.md`'s `— priority P<n>` suffix are all added in
that one act.**

⚠️ **Unenforced, so it is recorded here.** `dashboard.sh` reads a brief's `Status`, `Sprint` and
`Owner`; it **never** reads `## Priority`, and its `moved_target` parser never reads the suffix. Every
statement in this section is documentation truth maintained by hand, not a parser contract.

## ✅ THE SECOND PASS HAS RUN — this board is now SCOPED IN FULL *(the partial-scope record below is kept, as it instructed)*

**Ran 2026-08-29 on ruling 1, "Approve all 12 as proposed (Rec)".** The section below was written when
this board held one row and **explicitly asked to be kept** when the second pass ran: *"When the
second pass runs, this section stays — it is the record of why the board opened at one row, and a
later reader must be able to tell a partial scope from a finished one."* ⭐ **It is kept, byte-identical.
This block is the answer it was waiting for.**

**Each of its four bullets, discharged by name:**

| The bullet said | What happened |
|---|---|
| *"Adding rows later is the expected path, and it is an **append**"* | ⭐ **Honoured.** Eleven rows appended below `0347`; `0347` was **not** renumbered, re-ranked or re-worded — only its Priority cell was filled, which is the deferral clause's own instruction |
| *"A row arrives only by an owner ruling that names it"* | ⭐ **Honoured.** Ruling 1 names all twelve. ⛔ No row arrived by an agent's read of the backlog |
| *"The fourteen other rows in `0337`–`0351` are `Unscheduled` BY RULING"* | ⛔ **Unchanged. Still `Unscheduled`, still not here.** `0341` is named `Unscheduled` again by ruling 7 |
| *"`0345` is the closest such case and is deliberately absent"* | ⛔ **Still absent.** It remains a content dependency of `0347`'s note, not a gate on writing it. `0347` ships without it |

⛔ **THE ONE-ROW RULE IS NOW SPENT, NOT REPEALED.** *"A row arrives only by an owner ruling that names
it"* is still the rule. **A thirteenth row needs a thirteenth ruling.**

## ⚠️ This board is SCOPED IN PART — the second pass is owed *(SUPERSEDED 2026-08-29 by the section above; kept byte-identical at its own instruction)*

**A second pass will scope this board. Write for that, not around it.**

- ⭐ **Adding rows later is the expected path**, and it is an **append** — new rows go **below** this
  one, and this row is **not** renumbered, re-ranked or re-worded to accommodate them (ADR-035).
- ⛔ **A row arrives only by an owner ruling that names it.** Not by an agent's read of the backlog, not
  by "it obviously pairs with `0347`", not by a ship-loop driver noticing spare capacity.
- ⚠️ **The fourteen other rows in `0337`–`0351` are `Unscheduled` BY RULING**, not by omission. Their
  absence here is a decision that has already been taken once; do not re-take it silently.
- ⚠️ **`0345` is the closest such case and is deliberately absent.** `0347`'s own brief names `0345` as
  the task that writes the rule-cell `0225`'s parser will read. It is a **content dependency of the
  note's subject matter, not a gate on writing the note** — `0347` states the dependency in prose and
  ships without it. ⛔ It is **not** on this board.
- **When the second pass runs, this section stays** — it is the record of why the board opened at one
  row, and a later reader must be able to tell a partial scope from a finished one.

## 📐 Where this board's shape comes from — precedent vs invented

**Stated because the shape of an opening board is otherwise indistinguishable from an invented one.**

| Element | Source |
|---|---|
| `# Sprint N — <goal>` H1, identity in the first segment | **Precedent** — every plan, Sprints 1–6; the identity grammar is [ADR-040](../knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md) §2 |
| Authority blockquote first, carrying the verbatim option label | **Precedent** — Sprint 6 as opened, first block of the file |
| "opens against a gap, not a rollover" paragraph | **Precedent** — Sprint 6 as opened, same wording pattern |
| "what this board inherits" paragraph | **Precedent** — Sprint 6 as opened |
| `**Goal:**` + numbered list under the banner | **Precedent** — Sprint 6 as opened |
| Unranked board: Priority column `—`, briefs `Unscheduled`, no `— priority` suffix on the `backlog.md` marker | **Precedent** — Sprint 6 opened unranked on 2026-08-14 and is the case `backlog.md`'s unranked-forward clause was written from |
| `## Status` table, columns `Status \| Priority \| Task \| Brief` | **Precedent** — every plan; it is also `dashboard.sh`'s parsed contract (status = cell 1, priority = 2, brief = last) |
| Task cell carries the Backlog board's filing text **byte-identical**, with a dated note prefixed | **Precedent** — Sprint 6 `P10` did exactly this for the row it carried over |
| `## Notes`, then `## Open questions for the owner` | **Precedent** — Sprint 6 as opened |
| ⭐ §"⚠️ This board is SCOPED IN PART" — a partial-scope declaration and an append rule for the second pass | ⭐ **INVENTED.** No prior board opened partially scoped: Sprints 2–6 each opened with their full contents named in one owner ruling. There is no precedent to copy, and leaving it out would make a deliberately unfinished board read as a finished one |
| ⭐ This table itself | ⭐ **INVENTED.** Sprint 6 declared its **one deviation** in a section; declaring the whole provenance of the shape is a step past that, done because this board had to invent something |
| ⭐ The one-row `**Goal:**` list, and a title naming the window rather than a sprint theme | ⭐ **INVENTED** in the sense that no precedent covers a one-row board. Prior goals summarize a many-row theme; this one states the single hazard, so it will not read as a false theme when rows are appended |

⛔ **No `## Sprint Status` field, and no banner token.** [`0340`](../tasks/backlog/0340-backfill-a-sprint-status-onto-every-existing-sprint-plan-in-this-repo/brief.md)
would introduce one; it is `Unscheduled` and **not** on this board, so inventing the field here would
pre-empt an unshipped design. ⚠️ **Nothing reads a banner as data anyway** — a board is active because
of **where its file sits and what identity it resolves to**
([ADR-041](../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)),
which is why this file lives at `ai-agents/sprints/sprint-7.md`.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | P1 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-08-29** — *"One-row Sprint 7, then scope it (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session; the earlier ruling of the same day made this the **one** exception in `0337`–`0351`. ⚠️ **The cell text that follows is the Backlog board's own filing text, kept BYTE-IDENTICAL.** **Note ADR-044's oracle rule onto `0224` and `0225` — read the producing skill, never grep for skill names** — `0224`'s oracle for the worklog `**Role:**` line becomes ADR-044's rule, not the loop table's literal cell; `0225`'s parser must accept a rule-cell (a skill→owner expression) in the Plan/Build cells, which makes its assertion **stronger** *(**follow-on (iii) of [ADR-044](../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) §C2/§C3**, owner ruling **ND6** 2026-08-27; ⚠️ **measured warning both notes must carry (ADR-044 §C6, measured 2026-08-28)**: a grep-for-skill-names oracle would misroute **8 of the 13** producer-owned Backlog rows back to the producer — the exact `## Owner` staffing Decision 1 replaces; brief edits only, ⛔ no source, no board status change, neither folder moves; depends on `0270`)* | [`0347-note-adr-044s-oracle-rule-onto-0224-and-0225`](../tasks/backlog/0347-note-adr-044s-oracle-rule-onto-0224-and-0225/brief.md) |
| 🔲 Backlog | P2 | **ADR — the narrow in-flight review-fix lane** — a reviewer's finding on a diff already under review is recorded in the review ledger, not filed as a new task folder. Define the entry condition, the route, and four hard limits *(**owner ruling 2026-08-29**, option label verbatim **"Narrow it — in-flight review fixes only (Rec)"**; ⛔ **NO size floor** and `/fkit-task-brief`'s smallest-shippable rule is **NOT amended** — a prior size-floor proposal was rejected by name; ⛔ **the vault is out of reach** (ADR-005); one ADR file and nothing else; blocks only its own unfiled follow-ups)* | [`0352-adr-the-narrow-in-flight-review-fix-lane`](../tasks/backlog/0352-adr-the-narrow-in-flight-review-fix-lane/brief.md) |
| 🔲 Backlog | P3 | ⭐ **INVESTIGATION — settle the reference-integrity condition, ONCE** — the exact scanned set, exemption set and match rule, for **both** halves (markdown link **and** `path:NNN` citation), as runnable commands *(⛔ **investigation-first: `P4`, `P5` and `P6` may not start before this lands**; reconciles against `0176`'s four scoping decisions and answers `0237`'s step-3 scanned-set question, open since 2026-08-06; ⛔ **does NOT reopen `0176`'s two owner rulings of 2026-08-01**; measured 2026-08-29 with **two** matchers differing only in whether fenced blocks and inline code spans are skipped — **304 across 96** naive-unexempted, **60 across 26** convention-correct-unexempted, ⭐ **24 across 11** convention-correct with the ADR-034 and ADR-005 exemptions, **17** if `knowledge-base/reports/` is also exempt; ⭐ **the two variables together move the set from 304 to 17 — a factor of eighteen**, which is the whole justification; ⚠️ **`0176` decision 2 already rules fences and blockquotes but is SILENT on inline code spans** — the largest single lever, and unruled)* | [`0353-settle-the-reference-integrity-condition-once-for-both-halves`](../tasks/backlog/0353-settle-the-reference-integrity-condition-once-for-both-halves/brief.md) |
| 🔲 Backlog | P4 | **Build the link-resolution guard** — `test/reference-integrity.test.js`, with the exemptions **in the definition from day one** *(frozen closed task folders per **ADR-034** — **34 of the 60 convention-correct broken links live under `ai-agents/tasks/done/`** (219 of 304 naive); `wiki-vault/` per **ADR-005** — **13 more live there** and no role but `fkit-wiki` may fix them; ⛔ no new devDependency (ADR-014), no `package.json` change; ⛔ **fixes not one link** — that is `P5`; **depends `0353` — hard**; ⛔ **blocks `P8`, `P9`, `P10` — hard: they do not start until this is GREEN**)* | [`0354-build-the-link-resolution-guard`](../tasks/backlog/0354-build-the-link-resolution-guard/brief.md) |
| 🔲 Backlog | P5 | **Clean the in-scope broken-link red set** so `P4` goes green *(⛔ **re-measure under `0353`'s settled condition first** — ⛔ **the ~68-across-~24 scope figure this sprint was planned on matches the NAIVE reading**; the **convention-correct** reading that honours `0176` decision 2 returns ⭐ **24 across 11**, roughly a third of it — a **correction, not a re-scope**, since most of the difference is quoted marker text inside backticks; neither is authoritative until `0353` rules; ⛔ **two honest repairs, and picking wrong destroys a record** — a moved target is re-pointed, a **frozen record of a past measurement is left byte-identical and annotated**, per the `0306` precedent `0176` and `0237` both carry; ⚠️ **`backlog.md` holds 11 of them and is a machine-parsed file**; **depends `0353` — hard**)* | [`0355-clean-the-in-scope-broken-link-red-set`](../tasks/backlog/0355-clean-the-in-scope-broken-link-red-set/brief.md) |
| 🔲 Backlog | P6 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-08-29** — *"Approve all 12 as proposed (Rec)"*. Clean the coordination-citation residual set — **the cleanup `0176` needs and nobody owned** *(filed 2026-08-06 on the owner ruling **"File the cleanup as its own task."**; ⛔ **its steps 1 and 3 are now `0353`'s deliverable** — run them as a **reconciliation** against `0353`'s document, never a re-derivation, and **stop and surface any divergence**; ⛔ do not clean the exempt citations inside closed `done/*/review.md` (ADR-034), do not write the vault (ADR-005), do not build the guard; **depends `0353` — hard**; ⛔ **hard-blocks `P7`**)* | [`0237-clean-the-coordination-citation-residual-set-that-blocks-0176`](../tasks/backlog/0237-clean-the-coordination-citation-residual-set-that-blocks-0176/brief.md) |
| 🔲 Backlog | P7 | **⭐ PULLED ONTO THIS BOARD BY OWNER RULING 2026-08-29** — *"Approve all 12 as proposed (Rec)"*. Build the coordination-citation policy guard — literal reading, closed ledgers grandfathered *(**two owner rulings of 2026-08-01 and four scoping decisions, all unchanged**; ⛔ **hard-depends `P6`** — *"shipping it red is not an option"*, its own words; ⛔ **take the figure from `0237`, never from its frozen 2026-08-01 red-set table**; ⚠️ **its accepted incompleteness stands** — it does not flag `0013`'s bare `sprint-2.md:354` nor `0160`'s brief in three places, and **every report on it must say so alongside its pass**; ⛔ **blocks `P8`, `P9`, `P10` — hard: they do not start until this is GREEN**)* | [`0176-build-the-coordination-citation-policy-guard`](../tasks/backlog/0176-build-the-coordination-citation-policy-guard/brief.md) |
| 🔲 Backlog | P8 | ⛔ **Sweep A — the citation-rot class, ONE verified pass** *(⭐ **this row ABSORBS existing open rows and CLOSES them — it does not sit beside them**; **13 candidates** measured 2026-08-29 — `0193` `0197` `0232` `0275` `0286` `0298` `0308` `0309` `0320` `0321` `0323` `0343` `0344` — and **step 1 freezes the real membership before any edit**; closes authorized in advance by ruling **"Accept the 25 marked closes (Rec)"**, each carrying **`(agent-closed — not owner-verified)`** (ADR-033 §5); ⛔ **but the movers are producer-only — this row hands the producer a close list and moves nothing** (ADR-033); ⛔ **HARD-GATED: `P4` and `P7` both GREEN before it touches a file**; ⛔ re-anchor, never re-cite — no new `path:NNN`)* | [`0356-sweep-a-the-citation-rot-class-one-verified-pass`](../tasks/backlog/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md) |
| 🔲 Backlog | P9 | ⛔ **Sweep B — the single-site correction notes, ONE pass** *(⭐ **absorbs and closes, does not sit beside**; **20 candidates** measured 2026-08-29, step 1 freezes the membership; ⛔ **`0212` writes `ai-agents/wiki-vault/log.md` and CANNOT be done here — ⭐ ROUTED TO `P10` BY OWNER RULING 2026-08-29, so this sweep's in-scope count is 19 and step 1 no longer rules its routing** (ADR-005); ⛔ `0320` and `0321` sit on Sweep A's boundary and **must land in exactly one sweep**; ⛔ **append-only** — six members land notes inside closed folders and existing text is never edited, reordered or reflowed (ADR-034); ⛔ **a sweep does not relax a member's scope** — quote each and honour it; closes per ruling 4, each `(agent-closed — not owner-verified)`; ⛔ **movers are producer-only** (ADR-033); ⛔ **HARD-GATED on `P4` and `P7` GREEN**)* | [`0357-sweep-b-the-single-site-correction-notes`](../tasks/backlog/0357-sweep-b-the-single-site-correction-notes/brief.md) |
| 🔲 Backlog | P10 | ⛔ **Sweep C — the wiki-vault pass, SIX members** — `0199` `0239` `0287` `0317` `0319` **`0212`** *(⭐ **AMENDED 2026-08-29 — `0212` JOINED BY OWNER RULING**, given live via `AskUserQuestion` in a `fkit lead` session; `P9` routed it out as vault-owned and the owner named this row as its destination, so `P9` drops to 19 in-scope and the three-sweep total is unchanged at ~38 (`13 + 19 + 6`); ⚠️ **`0212` DIFFERS IN KIND from the five resyncs** — it is an **append-only new dated entry** in `ai-agents/wiki-vault/log.md`, not a page rewrite, under a standing owner ruling of 2026-08-03, and ⛔ **it must not be collapsed into `0199`**, which keeps the ordinary-vault-page half; ⛔ **the row title and folder name still say "five" and are left byte-identical** — read the brief's member table as the membership; ⭐ **`fkit-wiki`'s and nobody else's — ADR-005 is a wall, not a routing preference**; ⭐ **`0317` and `0319` STAY DISTINCT INSIDE THE PASS — OWNER-RULED**, option label verbatim **"File its own row (Recommended)"**, because they **"DIFFER IN KIND"**: `0319` **discharges a stale flag**, `0317` **reconciles a genuine disagreement** — ⛔ merging them performs the wrong act on at least one; ⛔ **check each member's upstream landed** — `0239` waits on `0232`, `0287` on `0273`; a member still blocked is **reported, not closed**; ⛔ **movers are producer-only** (ADR-033); ⛔ **HARD-GATED on `P4` and `P7` GREEN** — ⚠️ **but both guards exempt the vault, so `/fkit-wiki-lint` is what actually verifies this pass**)* | [`0358-sweep-c-the-wiki-vault-resyncs-as-one-pass`](../tasks/backlog/0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md) |
| 🔲 Backlog | P11 | ⭐ **The throughput counter** — created vs closed per ISO week from git, plus the record-repair share by **a rule written into the script** *(⭐ **this is the row that makes Sprint 7 falsifiable** — nothing in the repo can compute the success criterion today; ⛔ **AND it amends `claude/skills/fkit-status/SKILL.md`'s line "Do not say whether the backlog is growing or shrinking"** — that line's stated reason is *"the source set has no history"*, which this script supplies, so **shipping the script alone half-ships the task**; ⭐ the amendment is narrow — an **unmeasured** trend claim stays banned; ⛔ do not change `dashboard.sh`'s parsed contract; ⛔ no new devDependency; ⚠️ a file under `claude/` engages the structure-spec and hash manifest, a file under `bin/` does not — decide deliberately; **depends on nothing — independent of the whole `P3`→`P10` chain**)* | [`0359-the-throughput-counter-created-vs-closed-per-iso-week-and-record-repair-share`](../tasks/backlog/0359-the-throughput-counter-created-vs-closed-per-iso-week-and-record-repair-share/brief.md) |
| 🔲 Backlog | P12 | **Cut the release — `npm run release:minor` → v0.3.0 with an ANNOTATED tag as the measurement anchor — then hand-archive Sprint 7** *(**owner rulings 2026-08-29**, option labels verbatim **"Minor — v0.3.0 (Rec)"** and **"Hand-archive again, with the caveat (Rec)"**; verified 2026-08-29 — `package.json` reads `0.2.2` and the newest tag is `v0.2.2`, so minor lands on **v0.3.0**, ⛔ re-derive at run time; ⭐ **annotated, not lightweight** — a lightweight tag carries no date or message and cannot anchor `P11`'s measurement; ⛔ **NEVER `git push`** — the push is the owner's; ⛔ **fix every relative href when the file moves down one level**, or the archive manufactures a fresh broken-link set **in the sprint that built the guard against them** — run `P4`'s guard to prove it; ⛔ the archival banner carries the **not-owner-verified caveat** and the **measured** success-criterion outcome, met or missed; ⛔ **`0341` stays `Unscheduled` by the same ruling** — do not pull it in; **depends on every other row — hard**, ⭐ **`0361` included since 2026-08-29**)* | [`0360-cut-the-v0-3-0-release-and-hand-archive-sprint-7`](../tasks/backlog/0360-cut-the-v0-3-0-release-and-hand-archive-sprint-7/brief.md) |
| 🔲 Backlog | P13 | ⭐ **FILED ONTO THIS BOARD BY OWNER RULING 2026-08-29** — *"File it as a Sprint 7 row (Rec)"*, given live via `AskUserQuestion` in a `fkit lead` session. **Settle whether a sprint board may be committed UNRANKED — decide which rule wins, then make the other conform** *(⛔ **`npm test` is RED on `main` today**: `test/closed-rank-immutability.test.js`'s `live leg 1` fails at `HEAD` with *"sprint-7.md (earlier) row at line 126: Priority cell `—` is not a rank"* — 34 tests, 33 pass, 1 fail, measured 2026-08-29; ⛔ **PRE-EXISTING** — the failing side is `HEAD`, which no working-tree change reaches, and the working tree is already clean at 12 × `P<n>`; ⭐ **three rules disagree** — `parseBoard` refuses `—` by design, while `backlog.md`'s **unranked-forward clause** and this board's own §"⛔ This board is UNRANKED" both sanction opening one; ⭐ **the symptom clears at the owner's next commit, the CONFLICT does not** — the next board opened unranked reproduces it; **two phases — decide, then conform**, and ⛔ **phase 2 may not start before phase 1 lands**; ⛔ **widening is not weakening** — the garbage-cell throw stays; ⛔ **no rank changed by this row, ADR-035**; **depends on nothing** — ⛔ **but BLOCKS `P12`, hard: `0360` may not archive a board with an open row**; ⚠️ **rank `P13` is an APPEND, so rank order and execution order disagree for this one pair — the binding order lives in `Depends on`/`Blocks`, per ADR-035**)* | [`0361-settle-whether-a-sprint-board-may-be-committed-unranked`](../tasks/backlog/0361-settle-whether-a-sprint-board-may-be-committed-unranked/brief.md) |

## Notes

### ⭐ Addendum — the THIRTEENTH row, 2026-08-29: `0361`, appended at `P13`

**Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session; the option label
is the verbatim text: "File it as a Sprint 7 row (Rec)".** Relayed by a spawned `fkit-producer` with no
owner channel ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

⭐ **THE ONE-ROW RULE IS HONOURED.** This board's second-pass block says *"A thirteenth row needs a
thirteenth ruling."* **This is that ruling, and it names the row.** ⛔ No agent added it on its own read
of the backlog.

⛔ **NOTHING WAS INSERTED AND NOTHING WAS RENUMBERED — and it is checkable:**

- `0361` **appended** at `P13`. ⛔ **`P1`–`P12` are untouched**, in value and in text, apart from `P12`'s
  cell gaining the words *"`0361` included"* on its existing dependency clause.
- ⛔ **`P12` was NOT renumbered to make room, and that was the harder call.**
  [ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
  §Decision: *"It does not permit inserting a new row mid-board."* Merit put `0361` immediately above
  `0360`; the append rule put it below. ⚠️ **ADR-035's own *"re-raise only if"* would arguably have
  tolerated the insertion here** — it exempts a board *"whose closed rows are all contiguous at the
  top"*, and this board holds **zero** closed rows (measured 2026-08-29: all twelve read `🔲 Backlog`).
  ⛔ **It was still not taken**: the Decision is written flatly, the ADR says *"Do not re-raise"* the
  make-insertions-legal option, and the owner's ruling names a **row**, not a re-rank of the twelve they
  approved row by row.
- ⭐ **THE CONSEQUENCE, STATED RATHER THAN LEFT TO BE DISCOVERED: rank order and execution order now
  disagree for one pair.** `0360` (`P12`) sits above `0361` (`P13`) but **must run after it** — its own
  brief forbids archiving while any row is open. ⛔ **The binding order is in the dependency fields, not
  the rank** — ADR-035: *"Where ordering must actually bind, it belongs in `Depends on` / `Blocks`."*
  `0360`'s `Depends on` was updated in the same act, so `dashboard.sh`'s `derive` fact carries `0361`
  and the loop will not pick `0360` early.
- **Two carriers updated in the one act:** this board's `## Status` table (one appended row, `P12`'s
  dependency clause widened) and `0360`'s `## Notes` `- **Depends on:**` bullet. ⛔ **No `backlog.md`
  marker** — `0361` is a **new** brief filed straight onto this board, not a row moved off that one.

⚠️ **This row is NOT record repair and must not be counted as such by `0359`.** It settles a live rule
conflict and changes a shipped test or a standing convention. Ruling 5 caps record repair and
⭐ *"there is NO cap on process work at all."*

### ⭐ Addendum — the second pass, 2026-08-29: eleven rows added, board ranked `P1`–`P12`

**Authority before outcome.** Owner rulings of **2026-08-29**, all given live via `AskUserQuestion` in
a `fkit lead` session and relayed to a spawned `fkit-producer` with **no owner channel** (ADR-021).
The seven are tabulated in the banner at the top of this file. ⛔ **This is not producer precedent for
scoping or ranking a board** — `/fkit-task-brief` step 5 is unchanged, and a spawned producer never
re-ranks on its own judgement.

**What was written, in one act:**

| Rank | ID | New or pulled | Owner |
|---|---|---|---|
| `P1` | `0347` | already here — **rank added only**, row otherwise untouched | `fkit-producer` |
| `P2` | `0352` | **new brief** | `fkit-architect` |
| `P3` | `0353` | **new brief** | `fkit-architect` |
| `P4` | `0354` | **new brief** | `fkit-coder` |
| `P5` | `0355` | **new brief** | `fkit-coder` |
| `P6` | `0237` | **pulled** from [`backlog.md`](backlog.md) — three mandatory edits applied | `fkit-coder` |
| `P7` | `0176` | **pulled** from [`backlog.md`](backlog.md) — three mandatory edits applied | `fkit-coder` |
| `P8` | `0356` | **new brief** | `fkit-coder` |
| `P9` | `0357` | **new brief** | `fkit-coder` |
| `P10` | `0358` | **new brief** | `fkit-wiki` |
| `P11` | `0359` | **new brief** | `fkit-coder` |
| `P12` | `0360` | **new brief** | `fkit-producer` |

⭐ **The nine new IDs were allocated `0352`–`0360` in dependency order**, from a max of `0351` derived
across all three boards by both the folder-name and the `## ID`-field method (they agreed).

⛔ **RECONCILED AGAINST ALL 129 OPEN BRIEFS BEFORE FILING — and three rows changed shape because of it.**
Filing a duplicate would be a self-inflicted instance of the exact problem this sprint exists to fix.
The three sweeps' classes **already exist on the board as ~38 individually-filed open rows**, so
`0356`, `0357` and `0358` are written as rows that **ABSORB AND CLOSE** those rows — ⛔ **never as rows
that sit beside them.** That is the difference between consolidation and duplication, and each sweep's
brief states it in its first section.

⚠️ **THE "~25 CLOSES" FIGURE DOES NOT REPRODUCE, and it is flagged rather than quietly adopted.**
Ruling 4 was put to the owner as *"Accept the 25 marked closes"*. Measured on disk 2026-08-29 the
three sweeps' **candidate** lists total **~38 rows** (13 + 20 + 5). ⛔ **Neither number is
authoritative**: each sweep's step 1 freezes its own membership, and ruling 4 authorizes the closes the
sweeps actually perform — it does not fix their count
([`evidence-before-assertion`](../knowledge-base/conventions/evidence-before-assertion.md)).

⛔ **THE "~68 BROKEN LINKS / ~24 FILES" SCOPE FIGURE IS A NAIVE-MATCHER NUMBER, AND THE CORRECTED ONE
IS ROUGHLY A THIRD OF IT.** Re-measured 2026-08-29 with two matchers differing only in whether fenced
blocks and inline code spans are skipped: the naive reading returns **64 across 22** (close to the
planned ~68 / ~24); the reading that honours **`0176` scoping decision 2** — *"skip fenced blocks and
blockquote lines"* — returns ⭐ **24 across 11**. **Most of the difference is quoted marker text inside
backticks: documentation OF the link form, not links.**
⭐ **A correction, not a re-scope** — and ⛔ **not the work being done for you**, but the work being
correctly bounded. ⚠️ **Two consequences worth naming now:** the vault's *"13 broken links"* is
**zero** under the corrected reading (all 13 are code spans), and **`0176` decision 2 rules fences and
blockquotes but is SILENT on inline code spans** — the single largest lever on the number, and
unruled. Recorded in `0353` and `0355`; ⛔ **no figure here is authoritative until `0353` settles the
condition.**

### ✅ SETTLED 2026-08-29 — `0347`'s `## Owner` IS NOT A DISAGREEMENT, AND IT IS NOT A ROUTING DEFECT

> **Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session: act on it.**
> The owner ruled that the field be **addressed**; ⭐ **the form was left to the producer**, which chose
> to **leave the field and record why**. Relayed by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
>
> ⭐ **THE ANSWER, IN ONE LINE: `## Owner` and ADR-044 §Decision 1 ANSWER DIFFERENT QUESTIONS, so
> `fkit-producer` and `@fkit-coder` are both right at once.**
>
> - **`## Owner` answers *"which seat is accountable for delivery?"*** —
>   [`task-owner-vocabulary`](../knowledge-base/conventions/task-owner-vocabulary.md), verbatim: *"the
>   role accountable for the task's delivery"*, *"It records **which seat is accountable**"*. `0347`'s
>   own `## What to build` opens *"Brief edits only … **This is a producer act**"*. **`fkit-producer`
>   is the correct value.**
> - **ADR-044 §Decision 1 answers *"which role does the ship-loop spawn for Build?"*** — and settles it
>   in its own words: a no-skill deliverable is the coder's **"whatever `## Owner` says."** ⭐ **The rule
>   is written to be indifferent to the field.** A `## Owner` that differs from the Build role is the
>   rule working, not failing.
> - ⛔ **The field is still READ, for a third thing.** ADR-044 **§Decision 4** makes the dashboard's
>   Owner column the **step-1 vault-skip predicate** (*"the dashboard's Owner column … reads
>   `fkit-wiki`"*; a blank field is *"not-eligible-until-repaired, never treated as coder"*).
>   Overwriting it with a Build role would put the answer to one question in the field that answers
>   another.
>
> ⛔ **TWO CORRECTIONS TO THE SECTION BELOW, MEASURED ON DISK 2026-08-29, NOT INHERITED:**
>
> 1. ⛔ **Its reason 1 — *"`0347`'s own brief forbids it"* — IS WRONG.** The prohibition it quotes
>    names the two **target** briefs, not `0347`: it sits under the `0224`/`0225` sub-headings and reads
>    *"do not change **either brief's** …"*, and verification step 1 scopes the diff to *"exactly two
>    existing files — `0224`/`brief.md` and `0225`/`brief.md` — **plus this task's own folder**."*
>    ⭐ **`0347`'s own `## Sprint` and `## Priority` were in fact both edited on 2026-08-29** — proof the
>    bar was never there. The field is left as it is **on the merits above**, not on a rule that does not
>    exist.
> 2. ⚠️ **Its framing as a *"documentation-truth defect"* is also wrong** — that assumed two competing
>    answers to one question. There is one correct value per question and both are correct.
>
> ⭐ **The full reasoning now lives in `0347`'s own `## Notes`** (§"⭐ 2026-08-29 — WHY THIS BRIEF'S
> `## Owner` READS `fkit-producer`…"), which is where a reader who scans the board and clicks through
> will land. ⛔ **The section below is left byte-identical as the record of the earlier reading; read
> this block as the current one.**

### ⭐ RESOLVED — `0347`'s `## Owner` disagreement, and which value this board used *(SUPERSEDED 2026-08-29 by the block above; kept byte-identical, and ⛔ its reason 1 is measured WRONG)*

**The disagreement, stated plainly:** `0347`'s brief reads **`## Owner: fkit-producer`**, verified on
disk 2026-08-29. **ADR-044 §Decision 1 staffs it `@fkit-coder`** — the rule is *the owner, in
`skills_for_role()`, of the skill that produces the deliverable, with a no-skill deliverable falling to
the coder*, and `0347` produces **brief prose**, which is no skill's deliverable.

⭐ **WHICH ONE THIS BOARD USED: the brief's field, `fkit-producer` — because that is the only value
anything reads.** `dashboard.sh` reads the brief's `## Owner` and renders it in the Owner column; it
has no knowledge of ADR-044. The board above therefore shows `fkit-producer` for `P1`, and that is a
faithful report of the field, **not an endorsement of it over ADR-044.**

⛔ **The field was NOT changed to `fkit-coder`, and that is deliberate, three reasons deep:**

1. ⛔ **`0347`'s own brief forbids it.** Its constraints say *"do not change either brief's `## Status`,
   `## Sprint`, `## Priority`, `## ID` or `## Owner`"* — and its verification step 3 asserts those
   fields are byte-identical to `HEAD`. Editing `## Owner` would make its own verification fail.
2. ⛔ **No owner ruling covers it.** The seven rulings of 2026-08-29 do not mention it. ⭐ **A row's
   staffing being wrong is not a licence to change it silently** — it is an open question, and it is
   filed as one below.
3. ⚠️ **Nothing is actually mis-routed by it today.** `/fkit-sprint-ship-loop` **does not read a
   brief's `## Owner`**, so the field steers no worker. It is a documentation-truth defect.

⛔ **DO NOT "CORRECT" IT BY GREPPING THE BRIEF FOR SKILL NAMES.** That is precisely the **8-of-13
anti-pattern** `0347` exists to warn `0224` and `0225` about — measured in ADR-044 §C6, and re-flagged
here because this row is the one most likely to tempt it.

- **⛔ EXACTLY ONE ROW ON THIS BOARD WRITES `ai-agents/wiki-vault/`, AND IT IS `P10`.** ⭐ **Corrected
  2026-08-29** — this bullet previously read *"⛔ This board's row does NOT write
  `ai-agents/wiki-vault/`"*, true when the board held one row and **false since the second pass**.
  - **`P10` (`0358`) is the vault row**, owned by **`fkit-wiki`**, and its whole write surface is the
    vault ([ADR-005](../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  - ⛔ **Every other row on this board is barred from the vault**, `P1` (`0347`) included — it still
    edits two task briefs and nothing else. `P8` and `P9` **report** their vault findings and route
    them to `P10`; they touch nothing there.
  - ⭐ **The vault holds ZERO broken markdown links under the corrected reading, measured 2026-08-29**
    — a naive matcher reports 13 and **all 13 are inline code spans**. ⛔ **Do not scope work against
    the 13.** `P10` re-measures under `0353`'s condition and reports the real number; anything genuine
    is out of every other role's reach, and fixing is in scope only if `P10`'s own step 1 rules so.
- **⚠️ `0347`'s `## Owner` is `fkit-producer`, not `fkit-coder`** — verified on disk 2026-08-29 by
  reading the brief. It is a **brief-edit task**: no source, no tests, no board status change.
  ⚠️ **`/fkit-sprint-ship-loop` does not read a brief's `## Owner`**, and
  [ADR-044](../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
  §Decision 1 is the rule that staffs it: **the owner, in `skills_for_role()`, of the skill that
  produces the deliverable, with a no-skill deliverable falling to the coder.** ⭐ **`0347` produces
  brief prose, not a skill deliverable — so Decision 1 staffs it `@fkit-coder`**, and that is not a
  misroute. ⛔ **Do not "correct" it to the producer by grepping the brief for skill names** — that is
  precisely the 8-of-13 anti-pattern this very row exists to warn `0224` and `0225` about.
- **⚠️ `0347`'s figures are dated and MUST be re-measured before the notes are written.** The
  **8 of 13** count is ADR-044 §C6, measured **2026-08-28** over a live, changing board. The brief says
  so itself. If it has moved, write the new number and its date; do not copy this one forward
  ([`evidence-before-assertion`](../knowledge-base/conventions/evidence-before-assertion.md)).
- **⚠️ `0345` is a content dependency of the note, not a gate.** `0225`'s note must *name* `0345` as
  the task that creates the rule-cell, so an implementer does not parse against text that is not there.
  `0345` is `Unscheduled` and not on this board; `0347` ships without it.
- **⛔ `0224` and `0225` do not move.** `0347` appends to their `## Notes` and touches no other field of
  either brief; both stay in `ai-agents/tasks/backlog/`. **Pulling either of them onto a board is a
  separate owner decision** — and doing it *before* `0347` lands is the exact failure this board exists
  to prevent.
- **⛔ CURRENT STATE, re-measured 2026-08-29 after `0361` was appended — this SUPERSEDES the
  second-pass figures in the bullet below, which are kept as the record of that moment.**
  - This board reads **`total 13`**, **`count backlog 13`**, ⭐ **no `drift`** and no
    `⟨derive: UNPARSEABLE⟩` — all thirteen `- **Depends on:**` bullets parse into a `derive` fact, and
    `0360`'s now carries `0361`.
  - `select-active` returns `active file="sprint-7.md" identity="Sprint 7"`, **exit 0** — unchanged.
  - [`backlog.md`](backlog.md) is **untouched by this pass**: `total 190`, `count backlog 126`,
    `count done 17`, `count cancelled 1`, `count moved 46`. ⛔ **`0361` is a new brief filed straight
    onto this board, so there is no `➡️ Moved` marker for it and none is owed.**
  - **`ai-agents/tasks/backlog/` holds 138 task folders, every one `🔲 Backlog`** — 137 before `0361`.
  - ⛔ **`npm test`: 792 tests, 791 pass, 1 fail** — the pre-existing `live leg 1` failure described
    below and nothing else. ⭐ **This pass added no new red.**
- **⚠️ SECOND-PASS STATE, measured on disk 2026-08-29 immediately after the eleven rows landed.**
  This board reads **`total 12`, `count backlog 12`**, ⭐ **no `drift`** and **no
  `⟨derive: UNPARSEABLE⟩`** — all twelve `- **Depends on:**` bullets parse into a `derive` fact.
  `select-active` returns `active file="sprint-7.md" identity="Sprint 7"`, **exit 0** — unchanged by
  the H1 rewording, because identity is the **whole first H1 segment**
  ([ADR-040](../knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md)),
  and that segment is still `Sprint 7`. [`backlog.md`](backlog.md) reads `total 190`,
  **`count backlog 126`**, `count done 17`, `count cancelled 1`, **`count moved 46`** — two rows moved
  off it (`0237`, `0176`), `total` unchanged.
- **⛔ ONE TEST IS RED, IT WAS RED BEFORE THIS PASS, AND IT IS NOT CAUSED BY IT.**
  `test/closed-rank-immutability.test.js`'s **`live leg 1: working tree vs HEAD`** fails with
  *"sprint-7.md (earlier) row at line 126: Priority cell `—` is not a rank"*. **Verified by stashing
  every working-tree change and running the test on a clean `HEAD`: it fails there, identically.**
  - **The cause:** that test's `parseBoard` **refuses an unranked board by design** — its own unit test
    *"parseBoard: an unranked (—) or garbage Priority cell throws"* passes. Sprint 7 was **committed
    unranked**, so the `HEAD` side has been unparseable since that commit.
  - ⭐ **This pass fixes the working-tree side** (every cell now reads `P<n>`), and the `HEAD` side goes
    green **when the owner commits it**. ⛔ **Nothing else in `npm test` fails.**
  - ⚠️ **The underlying conflict is real and unresolved:** `backlog.md`'s unranked-forward clause and
    this board's own opening reasoning both sanction an unranked board, and this test forbids one from
    being committed. ~~**Filed as an open question below; ⛔ no thirteenth row was added for it, because a
    row arrives only by an owner ruling that names it.**~~
    ✅ **SUPERSEDED 2026-08-29 — the owner gave that ruling, and the thirteenth row IS filed:
    [`0361`](../tasks/backlog/0361-settle-whether-a-sprint-board-may-be-committed-unranked/brief.md)
    (`P13`)**, on the option label *"File it as a Sprint 7 row (Rec)"*. ⛔ **The conflict is still
    unresolved — a row to settle it is not a settlement.** The struck text is kept as the record of why
    nothing was filed for the hours before the ruling.
- **⚠️ Opening-time state, kept as the record of what moved.** At the moment this board opened,
  `backlog.md` read `total 190`, `count backlog 129`, `count done 17`, `count cancelled 1`,
  `count moved 43`; after the one-row move it reads `count backlog 128` and `count moved 44`, with
  `total 190` unchanged. This board reads `total 1`, `count backlog 1`, **no `drift`**, no
  `⟨derive: UNPARSEABLE⟩`. `select-active` returns `active file="sprint-7.md" identity="Sprint 7"`,
  exit 0 — it returned `active none`, exit 3, immediately before. All measured 2026-08-29.

## Open questions for the owner

> ⭐ **Questions 1 and 2 below are ANSWERED as of 2026-08-29 and are kept, struck, as the record.
> Questions 4–6 are NEW and open.** Question 3 was never answered and stands.

4. ✅ **ANSWERED 2026-08-29 — FILED AS `0361` (`P13`) by the owner ruling *"File it as a Sprint 7 row
   (Rec)"*.** ⛔ **The question itself is still open — the ROW is what was ruled, not the answer.**
   `0361` is a **decide-then-conform** task: it rules between the three options below and then makes the
   losing site conform. ⚠️ **The red leg stays red at `HEAD` until the owner commits the ranked board**,
   and that clears the symptom, ⛔ **not the conflict.** ⭐ **The thirteenth-ruling rule is honoured** —
   see `## Notes` §"⭐ Addendum — the THIRTEENTH row". The original text follows as the record:
   ⛔ **NEW, and it is a RED TEST on `main` right now — how should an unranked board be committed?**
   `test/closed-rank-immutability.test.js`'s `live leg 1` fails at clean `HEAD` with *"sprint-7.md
   (earlier) row at line 126: Priority cell `—` is not a rank"*. Its `parseBoard` **refuses an
   unranked board by design** (its own unit test asserts the throw), and Sprint 7 was **committed
   unranked** on this board's own reasoning — reasoning that [`backlog.md`](backlog.md)'s
   unranked-forward clause independently sanctions. **Two written rules and one test disagree.**
   ⭐ **This pass makes the working-tree side green and the `HEAD` side goes green when you commit it**,
   so the symptom clears — ⛔ **but the conflict does not.** The next board that opens unranked
   reproduces it exactly. ⛔ **No thirteenth row was filed for it**: a row arrives only by a ruling that
   names it. **Options: rule that boards are never committed unranked; widen the test to accept `—`; or
   accept the red leg as a known state.**
5. ~~⭐ **NEW — `0347`'s `## Owner` says `fkit-producer`, ADR-044 §Decision 1 says `@fkit-coder`. Which
   wins, and does the field get corrected?**~~ ✅ **ANSWERED 2026-08-29 — the owner ruled "act on it",
   and the producer chose the form: the field STAYS `fkit-producer` and a dated note now explains why.**
   ⭐ **Neither value is wrong — they answer different questions** (accountable seat vs the ship-loop's
   Build role, which ADR-044 §Decision 1 fixes *"whatever `## Owner` says"*). ⛔ **And the old reason for
   not touching it was itself wrong**: `0347`'s brief forbids editing `0224`'s and `0225`'s fields, not
   its own. See `## Notes` §"✅ SETTLED 2026-08-29" and `0347`'s own `## Notes`. The original text
   follows as the record: ⛔ **Not corrected in this pass** — `0347`'s own brief
   forbids touching the field and asserts it byte-identical to `HEAD`, and no ruling covers it.
   ⚠️ **Nothing is mis-routed today** (`/fkit-sprint-ship-loop` never reads `## Owner`), so it is a
   documentation-truth question, not a live defect. Full reasoning in `## Notes`
   §"⭐ RESOLVED — `0347`'s `## Owner` disagreement".
6. ~~⭐ **NEW — the "~25 closes" of ruling 4 does not reproduce; the candidate lists total ~38.**~~
   ✅ **ANSWERED 2026-08-29 by the owner ruling *"Proceed — 38 is fine (Rec)"*.** ⭐ **The earlier
   *"Accept the 25 marked closes (Rec)"* settled the MECHANISM, not a count — 25 was the estimate shown,
   never a ceiling.** ⛔ **There is no 25-row cap and nothing may be read as imposing one.** ~38 stands;
   each sweep's step 1 still freezes its own membership and the ruling authorizes the closes the sweeps
   actually justify, ⛔ **not a quota to hit.** Recorded in `0356`'s and `0357`'s briefs
   (§"✅ DISCHARGED 2026-08-29"). The original text follows as the record: Each
   sweep's step 1 freezes its own membership, so the sprint is executable either way. ⚠️ **But if you
   meant 25 as a cap rather than an estimate, say so** — the briefs currently read it as an estimate
   and authorize the closes the sweeps actually justify.


1. ~~**⭐ OPEN — what else goes on this board?**~~ ✅ **ANSWERED 2026-08-29 by ruling 1, *"Approve all 12 as proposed (Rec)"*** — eleven rows were added and the board is scoped in full. ⛔ **A thirteenth still needs a thirteenth ruling.** The original text follows as the record: The ruling that opened it names a **second pass** that
   scopes the rest, and nothing has been scoped yet. ⚠️ **Until that pass runs, this board is one row
   and `select-active` returns it as the active sprint** — a ship-loop driver pointed at it will find
   exactly one eligible row and then run out of board. **Not a defect; the ruled state.**
2. ~~**⭐ OPEN — should this board be ranked when it is scoped?**~~ ✅ **ANSWERED 2026-08-29 by ruling 3, *"Rank Sprint 7; declare backlog an archive (Rec)"*** — ranked `P1`–`P12`, and it was taken at exactly the moment this question recommended: **before anything shipped**, while no row was closed and ADR-035's wall was not yet up. The original text follows as the record: It is unranked today because one row is
   not a rank. ⚠️ **Ranking is free only while no row is closed**; from the first close onward ADR-035's
   wall applies and a re-rank needs an owner ruling given in that session. **If a rank is wanted, the
   cheapest moment is at the second pass, before anything ships.**
3. **⭐ STILL OPEN — does Sprint 6's banner gain a successor clause pointing here?** ⚠️ **Unchanged by the second pass; Sprint 6's banner is still byte-identical.** ⭐ **It gains urgency at `P12`**: `0360` must decide whether *Sprint 7's own* banner names a successor when it is archived, and answering this one settles both. It was archived with the
   clause deliberately omitted (there was no Sprint 7 then), and it has been left **byte-identical**.
   Sprints 1–4 each named a successor; Sprint 5 and Sprint 6 did not. ⛔ **Not a blocker for anything on
   this board** — a documentation-truth question only.
