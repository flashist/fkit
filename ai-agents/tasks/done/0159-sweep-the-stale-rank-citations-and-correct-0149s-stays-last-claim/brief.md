# Sweep the stale board-rank citations out of the briefs and the sprint board, and correct 0149's "it stays last" claim

## ID
0159

## Sprint
Sprint 2

## Priority
140

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-producer

## The two owner rulings this task rests on — both 2026-07-27

Recorded here so nobody re-litigates them.

**Ruling 1 — the work splits on the role seam.** Task 0157 was briefly widened to carry this sweep. The
owner ruled it **split**: 0157 keeps the **rule** (a `fkit-coder` edit to one skill file, rank **P127**,
confirmed unchanged); **this task takes the sweep** (a `fkit-producer` edit to task briefs and the sprint
board). A brief has one `## Owner` field and cannot express both. **Neither half blocks the other.**

**Ruling 2 — the frozen-history clause does NOT block this sweep.**
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md:38` says existing
`priority (folderID)` notations are *"frozen history … never mass-edited"*. The owner ruled that clause
covers **the board-cell form `124 (0150)` only** — **not** the prose form `0150 (124)` inside a brief's
reasoning. The owner's reasoning: *a board cell records what a row meant on the day it was written; prose
inside a brief is a live cross-reference that misdirects a reader today.* **The sweep proceeds.**

## Context

### The defect

Reasoning prose across the open backlog and the live sprint board cites other tasks by their **board
rank** — *"0154 (127)"*, *"below 0151 (P122)"*, *"task 0142 (priority 120)"*. Rank is mutable: the board
was re-ranked **twice on 2026-07-27 alone**, and every one of those citations silently became wrong. A
reader cannot tell a correct citation from a stale one without going to the board — which is exactly the
lookup the citation existed to save. Worse, a *wrong* number reads as authoritative, so the reader who
trusts it is misdirected without ever knowing to check.

**Task 0157 writes the rule that stops this recurring** (*cite the folder ID, not the rank*). **This task
repairs the damage that already exists.**

### Why this decays, and what that means for whoever implements it

The findings table below is a **snapshot of the board as of 2026-07-27**. Every re-rank re-stales it.
That is not a caveat about tidiness — it is the central operational fact of this task, and it has already
been demonstrated twice:

- The list the owner first ruled on named **11** stale citations.
- A verification pass the same day found **21** — it had missed **10**.
- A **second** verification pass, after 0153 closed and the split was ruled, found **two further sites
  neither list named** (`0158/brief.md` and one sprint-board row) and **re-classified several** the
  earlier pass had counted. See *What changed since the last count* below.

**⚠️ The implementer MUST re-derive every live rank at implementation time and rebuild the table.** Do
not trust the numbers below. They are a starting point and an argument, not an instruction.

### What changed since the last count — the decay, measured

| | Earlier pass (2026-07-27, pre-split) | This pass (2026-07-27, post-split) |
|---|---|---|
| Stale numbers | 24 | **21** |
| Sites | 18 | **19** |
| Files | 10 | **11** |

The count went **down** and the site count went **up** at the same time, for three reasons — all of them
evidence for the rule 0157 is writing:

1. **Two sites nobody had found.** `0158/brief.md`'s own append flag, and the `0151` row on the sprint
   board. Neither appeared on either earlier list.
2. **Several the earlier pass counted are re-classified here as carve-outs** — quotations inside `>`
   blocks and dated records of a completed action. They are listed below under *What this sweep must NOT
   rewrite*, not under findings.
3. **0157's own brief was narrowed** by ruling 1, which removed some of the sites the earlier table
   listed against it.

## What to build

Two parts. **Prose only throughout. No code, no test, and no rank changes.**

---

### Part A — fix the stale rank citations

Rewrite each site below to **name the folder ID and drop the rank**, or — where the *relative order* is
the actual point — to **say the order relatively** (*"directly below 0147"*), which survives a re-rank.
Do **not** simply update the number to today's value: that reproduces the defect with a fresher date.

**Live ranks re-derived mechanically from `ai-agents/sprints/sprint-2.md` on 2026-07-30** (all 145 rows
parsed off the link column, 0 unparsed). **The 2026-07-27 list this brief was filed with is superseded —
it was wrong for almost every entry by execution time:**
`0136` P114 · `0142` P121 · `0143` P124 · `0146` P135 · `0148` P132 (`✅ Done`) · `0149` P137 ·
`0150` P126 (`✅ Done`) · `0151` P123 (`✅ Done`) · `0152` P136 · `0154` P128 · `0155` P138 ·
`0156` P139 · `0157` P130 (`✅ Done`) · `0158` P122 · `0159` P140 · `0160` P141 · `0161` P131
(`✅ Done`) · `0162` P127 · `0163` P142 · `0164` P143 · `0165` P129 · `0166` P144 · `0167` P145.

**⚠️ Findings table rebuilt in place at implementation time, 2026-07-30 — this is what was actually
swept, and it replaces the table filed on 2026-07-27.** Between filing and execution the board was
re-ranked at least twice more and **seven new briefs were filed (0160, 0162–0167)**. The totals barely
moved but **the composition changed almost entirely**: filed as *21 stale numbers / 19 sites / 11 files*,
executed as **20 stale numbers / 19 sites / 12 files**. Seven of the original fifteen A1 sites **left
scope by closing**, four new A1 sites appeared, and A2 grew from 3 to 7. **Every `sprint-2.md:NNN`
pointer in the original table was wrong by execution time.** This decay is the finding, not a footnote.

#### A1. Cross-references to another task's rank — 12 sites, 13 stale numbers, 6 files

| # | Site | Cited as | Live | Note |
|---|---|---|---|---|
| 1 | `0142/brief.md:96` — *"task 0151** (priority 121"* | 121 | **123** | rank dropped, folder ID kept |
| 2 | `0152/brief.md:132-133` — *"Task **0154** (rank / 127"* | 127 | **128** | ⚠️ **NEW — found only by a wrap-aware scan.** The citation is **split across a line break**, so both of the plan's greps and every earlier pass missed it |
| 3 | `0152/brief.md:134` — *"0136 (P114), 0154 (127) and"* | 127 | **128** | **`0136 (P114)` is correct — left byte-identical** |
| 4 | `0152/brief.md:135` — *"this one (131)"* | 131 | **136** | self-reference → *"this task"* |
| 5 | `0154/brief.md:135` — *"this at 127, 0152 at 131, 0136 at P114"* | 127 / 131 | **128** / **136** | reworded relatively. **`0136 at P114` correct — left byte-identical** |
| 6 | `0154/brief.md:161` — *"see `0165` (P143)"* | 143 | **129** | ⚠️ **NEW** — 0165 was owner-promoted P143 → P129 on 2026-07-29 |
| 7 | `0155/brief.md:141-142` — *"immediately above 0146 / (currently P130)"* | 130 | **135** | also **line-wrapped**; *"immediately above 0146"* kept, rank dropped |
| 8 | `0155/brief.md:144` — *"below 0151 (P122)"* | 122 | **123** | |
| 9 | `0156/brief.md:58` — *"the same class as 0152 (P131)"* | 131 | **136** | |
| 10 | `0156/brief.md:155` — *"the same class as 0152 (P131)"* | 131 | **136** | a **second, separate** line — both fixed |
| 11 | `0166/brief.md:174` — *"Coordinates with `0160`** (P140,"* | 140 | **141** | ⚠️ **NEW** |
| 12 | `0166/brief.md:178` — *"Coordinates with `0165`** (P143)"* | 143 | **129** | ⚠️ **NEW** |

#### A2. Append flags citing a priority the brief no longer carries — 7 sites, 7 files

**Seven** briefs carry a `⚠️ Priority NNN is append rank` flag whose number no longer matches their own
`## Priority` field — four more than at filing, because every brief filed since inherited the same shape.

| # | Site | Flag says | `## Priority` is | Note |
|---|---|---|---|---|
| 13 | `0155/brief.md:139` | 133 | **138** | superseded by later re-ranks |
| 14 | `0156/brief.md:152` | 134 | **139** | superseded by later re-ranks |
| 15 | `0158/brief.md:189` | 136 | **122** | **owner-ruled to 122 on 2026-07-27** — the flag still read *unresolved* |
| 16 | `0159/brief.md:301` | 137 | **140** | ⚠️ **this task's own brief** |
| 17 | `0160/brief.md:364` | 138 | **141** | ⚠️ `0160:347-348` already flagged this and deliberately left it — explicitly handed here |
| 18 | `0163/brief.md:156` | 141 | **142** | ⚠️ **NEW** |
| 19 | `0164/brief.md:166` | 142 | **143** | ⚠️ **NEW** |
| — | `0157/brief.md` | 135 | 127 | `✅ Done` — **already annotated as resolved, untouched.** This is the shape that was copied. |

**Site 15 was more than a stale number.** `0158`'s flag still read as an **open, unresolved** request for
owner confirmation — but **the owner already ruled it, to exactly 122, on 2026-07-27**, verified firsthand
at the sprint plan's *"Re-ranked 2026-07-27 (third re-rank of the day) **by owner ruling**"* addendum.

**⚠️ Deviation from the approved plan's wording, on the record — corrected at review round 1.** The plan
prescribed appending *"✅ resolved: owner ruled to N"* to **all seven** flags. Only `0158` was genuinely
resolved by an owner ruling to a named rank. Writing *"owner ruled"* on the rest would have fabricated
rulings that never happened, which is the exact `evidence-before-assertion` failure this task exists to
fight — so the deviation itself was right, and the owner ratified it on 2026-07-30.

**The substituted wording was wrong twice over, and both were fixed in round 1:**

1. **It read *"✅ Resolved"*, which over-claimed.** Each flag's own text asks for *owner confirmation*;
   no owner confirmed these six. What the sweep reconciled is the **stale number**; the **request is
   untouched** and each brief still carries its unanswered merit argument. The six now say so plainly:
   *stale number reconciled, owner confirmation still outstanding, flag not discharged.*
2. **It re-introduced a live rank** — *"the live board rank is **P<N>**"* — present-tense prose that goes
   stale at the very next re-rank, inside the briefs just swept. The six now point at each brief's own
   `## Priority` field and board row instead, the durable form used throughout Part A.

**⚠️ `0160` is not a displacement-only case, and the earlier blanket claim that none of the six moved by
owner ruling was false for it.** The sprint plan's **fourth re-rank of 2026-07-27** expressly adjudicated
`0160`'s placement — ruling it **stays where it was appended** — and in the same breath **left its
append-confirmation flag standing, undischarged**. Its marker records that specifically.

**The plan's intent** (reconcile the stale number, keep the original text as the record) is honoured in
full; the false attribution, the over-claim and the fresh live rank are all gone.

**The shape used for all seven:** keep the original flag text (it records the reasoning), append a dated
**reconciliation** marker, and leave the merit argument as the record of what was reasoned on the day.
**Only `0158`'s marker records a genuine resolution** — an owner ruling to a named rank. The other six
record that the **stale number** was reconciled and that **owner confirmation is still outstanding**;
none of them discharges its flag.

#### A3. Sites that left scope by closing — the carve-out, per owner ruling Q1, 2026-07-30

**Seven of the original fifteen A1 sites and all three original board-row sites are `✅ Done` today and
were deliberately NOT swept:** `0147/brief.md:99` · `0150/brief.md:97, :101, :104` · `0157/brief.md`
`## Notes` and `## Context` · the `0151`, `0147` and `0150` board rows · `0161/brief.md:168`
(*"128, immediately below 0157 (127)"* — **both numbers stale**). The owner ruled on 2026-07-30 that the
brief's own carve-out — *"the historical prose inside `✅ Done` / `⛔ Cancelled` briefs and rows"* — wins
over its findings table wherever the two conflict. **Cost accepted knowingly: a reader of a closed brief
still meets a stale number.** The closed-artifact class was routed to `0160` rather than fixed here.

**Also left byte-identical, verified correct today** (checked by name, not spot-checked): every
*"0136 (P114)"* · `0154:90/122/124/157` · `0155:39-40/61/84-89/130` · `0156:30/135` · `0158:182/191` ·
`0160:35/87-88/106/170-186/345/354` · `0162:148-158` · `0163:67` · `0165:105/136-137/208-240` ·
`0166:153` · `0167:172/186`, and all **23 open board rows**, which carry **zero** stale rank citations.

**Deliberately not folded in, flagged only:**
- `0133:37` — *"0124 (`🔲 Backlog`, priority 107)"*: the **rank is correct** (0124 is P107), the **status
  is stale** (0124 is `✅ Done`). A different defect class; not filed.
- `sprint-2.md:1238` — *"**soft-follows 0143** (priority 121)"*, live rank **P124**. Sits inside a frozen
  re-rank table cell, which this task's scope bounds exclude.
- `0162:155` — *"Ten open rows still sit above it (P109, P113, P114, P118–P124)"*. **Only seven open rows
  sit above P127 today** (P113, P114, P119, P120, P121, P122, P124); P109, P118 and P123 have since
  closed. A stale **count**, not a stale citation — out of this task's class, and worth its own decision.
- The `:NNN` line-number citation defect generally — that is `0160`'s.

---

### Part B — correct the "it stays last" claim about 0149

**⚠️ Two corrections to the premise this task was handed. Verify both before writing.**

1. **The claim is NOT in 0149's brief.** `ai-agents/tasks/backlog/0149-.../brief.md` was read in full on
   2026-07-27 and contains **no rank citation and no "stays last" claim**. The claim lives in the sprint
   board.
2. **It is at three sites, not one, and the dates are not what was stated.** Verified 2026-07-27:

| Site | Addendum it sits in | Date | Text |
|---|---|---|---|
| `sprint-2.md:667` | *Re-ranked … the three were appended, not ranked* (`:658`) | **2026-07-26** | *"**The append order was right here.** … keeping 0149 last preserves it."* — the **origin** of the claim |
| `sprint-2.md:536` | *Re-ranked 2026-07-26 (second re-rank of the day)* (`:509`) | **2026-07-26** | *"…reasoning from the earlier re-rank is **unchanged** — it stays last."* |
| `sprint-2.md:487` | *Re-ranked 2026-07-27 — two 0125 follow-ups filed and placed on merit* (`:444`) | **2026-07-27**, **not** 2026-07-26 | *"Its *"the append order was right here"* reasoning is **unchanged** — it stays last."* |

**⚠️ `:487` was described to this task — and in 0157's earlier brief — as "the 2026-07-26 addendum". It
is not; its heading at `:444` is dated 2026-07-27.** Get the date right in the correction, or the
correction becomes the next stale claim.

**When each became false.** Reconstructed from the plan's newest-first ordering: `:667` (2026-07-26) →
`:536` (2026-07-26) → `:487` (2026-07-27) → **0155/0156 appended below 0149** (`:382`, 2026-07-27) →
today's third re-rank (`:240`). So **all three were true when written**, and all three became false at
the same moment — when 0155 and 0156 were appended below 0149. Today's addendum at `:294` already flags
this and explicitly declines to fix it: *"it is not something a producer may fix without an owner
ruling."* **This task is that ruling.**

**What to write.** A **dated correction appended** at each site — **not a rewrite**. These are dated
historical records and fall squarely inside the carve-out, so the shape is the one 0143 and 0149 itself
both use: **keep the original claim visible**, append the correction beneath or beside it, and name the
date and the authority (*owner ruling, 2026-07-27*). One or two sentences: 0149 is no longer last; 0155
and 0156 sit below it; **its board position is unchanged and this correction does not move it.**

A single correction note placed once, with the other two sites pointing at it, is acceptable and probably
better than three copies — **but every one of the three sites must carry a visible marker**, or a reader
landing on `:536` still reads an uncorrected false claim.

**Out of scope:** moving 0149, re-judging its rank, editing 0149's own brief, or editing `:294` (today's
addendum, which is already correct).

---

### What this sweep must NOT rewrite

- **Verbatim quotations.** `0157/brief.md`'s blockquote of another producer's addendum contains *"0151 at
  121, 0152 at 129"*. It sits inside a `>` block, quoting what someone else wrote. **Changing it
  falsifies a quotation.** Annotate outside the quote if anything is needed; never inside it.
- **Dated re-rank before/after tables.** `sprint-2.md`'s re-rank tables record what each row was on a
  given day. That is their entire purpose. Leave every cell. Part B **appends** to one; it rewrites none.
- **Dated addendum headings** — e.g. `:444`'s *"(0153 at 117, 0154 at 127)"*. Same carve-out.
- **Closed sprint plans** under `ai-agents/sprints/done/`, and the historical prose inside `✅ Done` /
  `⛔ Cancelled` briefs and rows.
- **Verified-correct citations.** Confirmed correct against the live board on 2026-07-27 — **leave every
  one byte-identical:** every *"0136 (P114)"* (`0152:126`, `0152:134`, `0154:90`, `0154:124`, `0154:135`,
  `0155:40`, `0156:30`, and the 0152/0154 board rows) · `0154:122` *"0153 (rank 117)"* · `0158:134` and
  `0158:143` *"0142 (P121)"* · `0155:39` and `0156:30` *"0126 (P109)"* · `0133:37` and `0142:27` *"0124
  (priority 107)"* · `0155:61,84-89,130` and `0156:135` *"P105–P108"*.

---

### ⚠️ A sibling defect discovered while writing this brief — flagged, NOT in scope

**`sprint-2.md` line numbers are as mutable as board ranks, and nothing warns anyone.** Filing this very
task appended one row and one addendum to the plan, shifting everything below by **+70 lines**. That
single append silently invalidated **eleven** `sprint-2.md:NNN` pointers at once:

| Where | Count | Status |
|---|---|---|
| Inside `sprint-2.md` itself — two dated addenda pointing at *"A re-rank is the owner's call."* as `:414` | 2 | **repaired** to `:628` when filed |
| `0157/brief.md` — `:302-305`, `:414`, `:170` | 3 | **repaired** to `:518`, `:628`, `:240` when filed |
| This brief's own Part B and verification steps | 6 | **repaired** before filing |

**This is the same defect shape as the rank citations** — a precise-looking pointer into a mutable
coordinate — but it is a **different coordinate system**, the owner has ruled on neither of them for line
numbers, and fixing it properly means a durable addressing scheme (heading anchors, or quoted anchor text
instead of a number). **Deliberately out of this task's scope. Raised for the owner; not filed unasked.**

⚠️ **Practical consequence for this task's implementer, which is in scope:** every `sprint-2.md:NNN`
number in this brief was correct at filing and will be wrong the moment anything is inserted above it.
**Locate the Part B sites by their quoted anchor text, not by line number**, and re-derive the numbers
before writing.

## Verification steps

1. **Every live rank was re-derived this session.** The implementer's report shows the live rank of every
   task named in A1/A2, read out of `sprint-2.md` **during the implementation session** — not copied from
   this brief. **Report the count you actually found against this brief's 21 / 19 / 11.** A different
   number is expected and is itself the finding.
2. **Zero stale rank citations remain in open prose.** For every site in A1 and A2, the prose either names
   the folder ID with no rank, or states the order relatively, or cites a rank equal to the live
   `sprint-2.md` Priority cell read in the same session.
3. **Nothing correct was "corrected".** Every citation in the *verified-correct* list above is
   byte-identical after the change. Check by name, not by spot-check.
4. **No quotation was altered.** `git diff` touches no line inside a `>` blockquote, and no cell of any
   dated re-rank before/after table — **except** the Part B appends, which add text beside the original
   and delete none of it.
5. **The three "it stays last" sites are all handled.** `sprint-2.md:487`, `:536` and `:667` each still
   contain their **original** claim text, and each carries a visible dated correction (or a visible
   pointer to one) naming *owner ruling, 2026-07-27*. **The correction states 2026-07-27 as the date of
   `:487`'s addendum, not 2026-07-26.**
6. **0149 did not move.** `0149`'s board rank is **unchanged across this task's diff**, proved by the
   **rank→ID→folder mapping being identical across all 145 board rows** before and after — *not* by the
   `| P<n> |` sequence alone, which two rows swapping IDs would leave identical, and not by naming a
   number. Step 7's *"every open brief that has a `## Priority` field equals its board cell"* clause is a
   second, independent proof, since `0149/brief.md` is **byte-identical**. `0149` appears in the board's
   Status table exactly once; it was never the site of the claim. ⚠️ *Corrected 2026-07-30 at review round 2: this step used to name a
   rank — `P134` as filed, refreshed to `P137` in round 1. **Both were wrong in kind.**
   `priority-is-rank-not-identity.md:42-44` requires a stale citation be rewritten to **name the folder
   ID and drop the rank**, because "updating it to today's number only reproduces the defect with a
   fresher date" — and this one sat inside an **operative verification criterion**, so every re-run
   would have had to re-check a decaying number. The rank was never load-bearing here.*
7. **No rank changed anywhere.** `grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md` returns the
   identical sequence before and after, and every open brief that **has** a `## Priority` field still has
   it equal to its board cell. **Any difference is a failed task, not a fix.** ⚠️ *Corrected 2026-07-30
   at review round 1: the original wording said "every open brief's `## Priority` field", which is not
   true and never was — `0136` is an open row (`P114`) carrying **no `## Priority` heading at all**.
   Backfilling it is `0155`'s deliverable, not this task's; the check is narrowed to what it can
   actually verify rather than left asserting something false.*
8. **The change surface is exactly the 11 files named** — the briefs for `0142`, `0147`, `0150`, `0151`,
   `0152`, `0154`, `0155`, `0156`, `0157`, `0158`, plus `ai-agents/sprints/sprint-2.md`. Nothing else. In
   particular **no task file moved** between `backlog/`, `done/` and `cancelled/`, and
   `claude/skills/fkit-task-brief/SKILL.md` is **untouched** — that file is 0157's.
9. **The suite is still green.** `node --test test/` passes. Nothing here should touch it — if something
   goes red, stop and report; do not adjust a test to fit a prose edit.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Sibling — task 0157 (the rule).** 0157 writes the *cite the folder ID, not the rank* clause into
  `claude/skills/fkit-task-brief/SKILL.md` step 5. **Neither task blocks the other.** *Soft preference:*
  land **0157 first**, so this rewrite conforms to a rule already written down rather than to one still
  sitting in a brief. Either order ships, and the two touch **disjoint files** — 0157 edits one skill
  file, this task edits none.
- **⚠️ Run this late, and re-verify immediately before running it.** This is the one task on the board
  whose **own brief goes stale while it waits**. Every re-rank invalidates the A1/A2 tables. Do not batch
  it behind other board-changing work.
- **⚠️ Conflict risk on `sprint-2.md`.** This task edits the live sprint plan, which other workers hold
  open during a ship-loop run. Prefer a moment when no other worker is editing the board, and re-read the
  file immediately before writing.
- **Producer artifacts only — this task moves no task file.** It edits task briefs and the sprint plan in
  place. It **does not** call `/fkit-task-done` or `/fkit-task-cancelled`, and it changes no `## Status`.
- **⚠️ Flagged, deliberately NOT filed:** `priority-is-rank-not-identity.md:38`'s frozen-history clause
  does not say **which notation form** it means. Owner ruling 2 settled the reading for this task, but the
  clause itself is still ambiguous and the next reader will hit the same question. Making `:38` explicit
  would be **a separate task** — and a **dual-home** one, since that convention page must stay
  byte-identical with its `claude/scaffold/` copy (0131/0132/0133 territory). **Raised for the owner; not
  filed unasked.**
- **⚠️ An adjacent stale citation of a different class, found during verification and NOT folded in.**
  `0133/brief.md:37` describes task **0124** as `(🔲 Backlog, priority 107)`. The **rank is correct**
  (0124 is P107) but the **status is stale** — 0124 is `✅ Done (agent-closed — not owner-verified)`. That
  is a stale *status* citation, not a stale *rank* citation, and neither owner ruling covers it.
  **Deliberately out of scope. Flagged for the owner.**
- **Prose only, and unenforced.** Nothing tests brief or board prose. This sweep fixes today's instances;
  0157's rule is what stops new ones. Neither is enforced by anything, and **that should be stated
  honestly in the closing report** rather than left implied.

- **⚠️ Priority 137 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  *(as filed. **⚠️ Stale number reconciled 2026-07-30 by this task's own sweep — owner confirmation is
  still outstanding.** The append rank named above was superseded by displacement in later re-ranks;
  this brief's own `## Priority` field and its board row carry the live rank. **Nothing was re-ranked,
  and this flag is NOT discharged** — only its stale number was reconciled. The merit argument below,
  including its nine-slot merit/append gap, is still awaiting an owner ruling, and is kept as the
  record of what was reasoned on the day.)*
  `/fkit-task-brief` step 5 requires appending after the existing highest priority (0156, which was at
  P136 **on the filing date, 2026-07-27** — kept as the dated arithmetic that produced this task's
  append rank of 137, not as a live citation; for 0156's rank today, read its board row) and
  forbids renumbering or inserting into the owner's ranking. Filed by a spawned producer with no owner
  channel, so appending was the only sanctioned option.
  **On merit this belongs immediately below 0157** — the two are the halves of a single owner ruling and
  read as one decision, and this is the **only item on the board whose own brief decays while it waits**:
  every re-rank re-stales its findings tables, so nine slots of waiting means nine slots of drift to
  re-verify before it can start. **Not ranked higher, because no wrong action is in flight** — a stale
  rank citation misdirects a *reader*, who loses a board lookup; nothing schedules or moves anything
  wrongly as a result. It buys back reader attention, not correctness. On that axis it is the same class
  as the archival-correction cluster (0146, 0149), and the decay property is the only thing separating it
  from them. **The merit/append gap is nine slots.**
