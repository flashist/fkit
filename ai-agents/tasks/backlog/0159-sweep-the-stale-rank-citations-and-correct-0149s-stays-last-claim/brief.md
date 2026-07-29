# Sweep the stale board-rank citations out of the briefs and the sprint board, and correct 0149's "it stays last" claim

## ID
0159

## Sprint
Sprint 2

## Priority
140

## Status
🔲 Backlog

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

**Live ranks read from `ai-agents/sprints/sprint-2.md` on 2026-07-27**, for reference only:
`0126` P109 · `0136` P114 · `0142` P121 · `0146` P132 · `0147` P125 · `0148` P128 · `0149` P134 ·
`0150` P126 · `0151` P123 · `0152` P133 · `0153` P117 (`✅ Done`) · `0154` P129 · `0155` P135 ·
`0156` P136 · `0157` P127 · `0158` P122.

#### A1. Cross-references to another task's rank

| # | Site | Cited as | Live | Note |
|---|---|---|---|---|
| 1 | `0142/brief.md:96` — *"task 0151 (priority 121)"* | 121 | **123** | |
| 2 | `0147/brief.md:99` — *"task 0150 (priority 124, directly below this one)"* | 124 | **126** | the *"directly below"* half is still true — keep it, drop the number |
| 3 | `0150/brief.md:97` — *"adjacent to 0147 (123)"* | 123 | **125** | see A3 for the *"128 → 124"* fragment on the same line |
| 4 | `0150/brief.md:104` — *"adjacent to 0147 (then priority 122, now **123**)"* | 123 | **125** | *"then priority 122"* is dated history; *"now 123"* is the live claim that is wrong |
| 5 | `0152/brief.md:134` — *"0136 (P114), 0154 (127) and"* | 127 | **129** | **0136 (P114) is correct — do not touch it** |
| 6 | `0152/brief.md:135` — *"this one (131)"* | 131 | **133** | self-reference |
| 7 | `0154/brief.md:135` — *"this at 127, 0152 at 131, 0136 at P114"* | 127 / 131 | **129** / **133** | **0136 at P114 is correct — do not touch it** |
| 8 | `0155/brief.md:142` — *"immediately above 0146 (currently P130)"* | 130 | **132** | *"currently"* makes it explicitly a live claim |
| 9 | `0155/brief.md:144` — *"below 0151 (P122)"* | 122 | **123** | |
| 10 | `0156/brief.md:58` — *"the same class as 0152 (P131)"* | 131 | **133** | |
| 11 | `0156/brief.md:155` — *"the same class as 0152 (P131)"* | 131 | **133** | a **second, separate** line — both must be fixed |
| 12 | `0157/brief.md` — *"0152 (P131) and 0154 (P127) are building the first two"* | 131 / 127 | **133** / **129** | in `## Notes`; survives 0157's narrowing |
| 13 | `sprint-2.md` — the **0151** board row: *"plausible live specimen for 0142 (120)"* | 120 | **121** | ⚠️ **not on any earlier list** |
| 14 | `sprint-2.md` — the **0147** board row: *"land with 0150 (124) in ONE `fkit-coder` session"* | 124 | **126** | the *"land together"* point is what matters — say it relatively |
| 15 | `sprint-2.md` — the **0150** board row: *"now adjacent to 0147 (123)"* | 123 | **125** | *"now"* makes it a live claim; the *"promoted 128 → 124"* fragment on the same line is dated history — see A3 |

#### A2. Append flags citing a priority the brief no longer carries

Four briefs carry a `⚠️ Priority NNN is append rank` flag whose number no longer matches their own
`## Priority` field, because the owner re-ranked them afterwards.

| # | Site | Flag says | `## Priority` is | Note |
|---|---|---|---|---|
| 16 | `0155/brief.md:139` | 133 | **135** | |
| 17 | `0156/brief.md:152` | 134 | **136** | |
| 18 | `0158/brief.md:141` | 136 | **122** | ⚠️ **not on any earlier list, and the worst of the four** — see below |
| — | `0157/brief.md` | 135 | 127 | **already annotated as resolved — do not touch.** This is the shape to copy. |

**Site 18 is more than a stale number.** `0158`'s flag still reads as an **open, unresolved** request for
owner confirmation (*"flagged for owner confirmation … On merit this belongs at 122"*) — but **the owner
already ruled it, to exactly 122, on 2026-07-27**. A reader today sees an outstanding decision that was
settled. Fix it the way `0157` was fixed: keep the flag as the record of why the number was questioned,
and annotate it resolved with the date and the authority.

**The shape for all four:** keep the original flag text (it records the reasoning), append the dated
resolution — *"✅ resolved: owner ruled to N, 2026-07-27"* — and remove any live rank citation inside the
flag's merit argument in favour of a relative form.

#### A3. Judgment calls — decide, then state the decision in the report

These three fragments sit on lines that also carry an A1 finding, so the implementer will meet them:

- `0150/brief.md:97` and the `0150` board row — *"promoted 128 → 124 by owner ruling 2026-07-26"*. This
  records **what the owner ruled on a stated date**, so it reads as dated history under ruling 2. **The
  recommendation is to leave it and fix only the live `(123)` half of the same line** — but say in the
  report which way you went, because it sits inside a live row rather than a dated addendum.
- `0157/brief.md` `## Context` — *"Producer A merit-ranked 0153/0154 into the middle of the board (P117
  and P127)"* and *"appended 0155/0156 at P133/P134"*. These narrate **what two producers did on a stated
  date**. Recommendation: **leave them**, they are the record of an action; if anything, add the folder
  IDs beside them. 0157's narrowed brief already cites those specimens by folder ID elsewhere.
- `0150/brief.md:101` — *"priority 128 was append rank"*. Same class: a dated record of the flag as filed.
  Recommendation: **leave it.**

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
6. **0149 did not move.** 0149 is `P134`, appears in the board's Status table exactly once, and
   `ai-agents/tasks/backlog/0149-.../brief.md` is **byte-identical** — it was never the site of the claim.
7. **No rank changed anywhere.** `grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md` returns the
   identical sequence before and after, and every open brief's `## Priority` field still equals its board
   cell. **Any difference is a failed task, not a fix.**
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
  `/fkit-task-brief` step 5 requires appending after the existing highest priority (0156 at P136) and
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
