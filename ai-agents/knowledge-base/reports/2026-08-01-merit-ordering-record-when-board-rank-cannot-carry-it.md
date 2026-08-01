# Decision report — how an owner records a merit ordering that board rank can no longer carry

- **Task:** `0174` — *"Decide how an owner records a merit ordering that board rank can no longer
  carry"*. Follow-up 6 of task `0160`.
- **Date:** 2026-08-01
- **Author:** fkit-architect
- **Deciders:** owner (Mark Dolbyrev), ruling via `AskUserQuestion` in the live `fkit-lead`
  `/fkit-sprint-ship-loop` driver session, 2026-08-01. All four questions put to the owner were signed.
- **Status:** ruled. Follow-ups named, **not filed**. No implementation in this task.
- **Companion ADR:** [`adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md`](../decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)

---

## 0. Framing — what this rules, and what it does not

`0160`'s decision report ruled case 5 **out of class by name** and handed it back:

> *"a rule-consequence question, not a stale-coordinate question … no anchor form answers it"*

This report answers the handed-back question. It rules **how an ordering intent is recorded** when the
board's rank column can no longer express it. It does **not** exercise the power: nothing is re-ranked
here, no brief is filed here, and no skill, script or test is edited here.

**What it is not.** It is not a re-opening of case 1 (board rank cited in prose) — that belongs to
tasks `0157` and `0159`, both closed, and is **hard out of scope, referenced only**.

Two things in this report were **not** anticipated by the brief and are the reason it runs longer than
a survey: a **live measurement whose headline number improves for a reason that is not progress**
(§1.3), and a **verified breach of the standing closed-row rule committed by this very task's own
filing** (§2).

---

## 1. The live measurement

### 1.1 Method — stated, so it can be replayed

Identical to the method report `0160` §6.2 declared, so the two readings are comparable:

- **Population:** every row of `ai-agents/sprints/sprint-2.md` matching a `P<n>` rank cell.
- **Status:** read from **field 1 of the pipe-split only**. No other cell is consulted.
- **Closed:** the status cell **starts with** `✅ Done`, `⛔ Cancelled` or `➡️ Moved`. `✅ Done
  (agent-closed — not owner-verified)` therefore counts closed.
- **Segment:** a maximal run of consecutive **open** rows in board order.
- **Unreachable:** an open row **not in the final segment**. The final segment is the append zone — the
  only region a new row can enter, and therefore the only region inside which a row can be promoted
  without passing a closed row.

### 1.2 The figures — **as of 2026-08-01, 18:32 MSK**

| Measure | Prior reading (report `0160`, 2026-08-01) | **Live — 2026-08-01 18:32 MSK** |
|---|---|---|
| Board rows with a `P<n>` cell | 148 | **155** |
| Closed | 123 (83%) | **126 (81%)** |
| Open | 25 | **29** |
| Disjoint open segments | 6 | **5** |
| Open rows unreachable from the append zone | 17 of 25 (**68%**) | **16 of 29 (55%)** |
| Singletons (cannot move at all) | 1 | **1** |

The prior-reading column appears **only** as the reading being compared against. Every live figure was
derived at 18:32 MSK from the working tree.

**Live segments, by folder ID** (never by rank — rank is the coordinate this task exists about):

| Segment | Tasks | Size |
|---|---|---|
| 1 | `0174`, `0132`, `0133`, `0142`, `0158` | 5 |
| 2 | `0143` | **1 — the singleton** |
| 3 | `0162`, `0154`, `0165` | 3 |
| 4 | `0144`, `0145`, `0146`, `0152`, `0149`, `0155`, `0156` | 7 |
| 5 — **the append zone** | `0163`, `0164`, `0166`, `0167`, `0168`, `0169`, `0170`, `0171`, `0172`, `0173`, `0175`, `0176`, `0177` | 13 |

### 1.3 The diff decomposition — **and the part that is most load-bearing**

The unreachable **share** fell from **68% to 55%**. That looks like the mechanism easing. It is not.

**No open row moved from unreachable to reachable.** Not one. I checked every row in the prior
reading's unreachable set against the live board: the transition *unreachable → reachable while still
open* occurred **zero** times over the interval between the two readings. **That measured zero is the
finding, and it is what the ruling rests on.**

**It is a measurement, not an impossibility — corrected.** A first draft of this section generalized
the zero into a claim that the transition is *impossible*, and that a row leaves the unreachable set
only by closing or being cancelled. **That generalization is false**, and route 3 below is the
counter-example. The correction changes **no conclusion in this report**: every ruling here depends on
the measured trend, not on the impossibility claim.

The 17 → 16 change decomposes exactly:

- **Departures — 2, both by closing:** `0130` and `0136`. Both were closed **by this very sprint run**.
- **Arrivals — 1:** `0174`, this task, which entered the board already unreachable (§6).
- **Denominator:** open rows went 25 → 29 — **+7** new rows (**six appended**: `0171`, `0172`, `0173`,
  `0175`, `0176`, `0177`; **plus `0174`, which was inserted mid-board, not appended** — that is §2's
  whole finding), **−3** closes: `0160`, then `0130` and `0136`.

So the metric can improve by exactly three routes, and **not one of them is a row reaching its merit
position**:

1. **Attrition** — an unreachable row closes, and leaves the numerator.
2. **Dilution** — fresh rows append into the final segment, which is reachable by construction, and
   inflate the denominator.
3. **Segment rollover** — when **every** row of the final segment closes, the segment above it
   **becomes** the final segment, and its open rows leave the unreachable set **without closing, being
   cancelled, or moving at all**. The rows do not change; the append zone moves onto them. Simulated
   against the live board's tail: closing all 13 rows of segment 5 makes segment 4's **seven** rows
   (`0144`, `0145`, `0146`, `0152`, `0149`, `0155`, `0156`) reachable in a single step.

**Route 3 is worth more than the correction that produced it.** It is the same mechanism candidate 6
(§3.6) proposes to trigger deliberately, arriving here by attrition instead. And it does not rescue the
metric either: it fires only once an entire segment has closed, so it too pays in work disappearing.

**The whole 68% → 55% movement is routes 1 and 2; route 3 did not fire over this interval.** This
run's own two closes (`0130`, `0136`) were
the entirety of segment 1 at the prior reading — closing them **erased a whole segment**, which is why
the segment count fell 6 → 5. That is the complete explanation for a headline number that looks like
progress and is not. A metric that only improves when work disappears or when unrelated work is added
is not measuring the defect getting better.

**Read the absolute count, not the share.** 17 → 16, against +7 new rows.

### 1.4 Method cross-validation — **the revision, named; the script, shipped**

Before trusting the live figures I checked the method reproduces the prior reading rather than merely
disagreeing with it. §1.1 promises a method that *"can be replayed"*, so this paragraph names the exact
revision and ships the exact script. A first draft did neither, and a reviewer had to sweep 25 board
revisions to check it — that cost is what this rewrite removes.

**The revision: commit `afe4fae`.** Replaying the script below against
`ai-agents/sprints/sprint-2.md` at that commit yields **148 rows / 123 closed (83.1%) / 25 open /
6 segments / 17 of 25 unreachable (68.0%) / 1 singleton** — the prior reading's figures **exactly,
every cell**. It also reproduces the six-segment decomposition, including that prior segment 1 was
exactly `{0130, 0136}` — the fact §1.3 rests on.

**Why that revision and not the obvious one — stated so nobody repeats the sweep.** The obvious
candidate is the commit that **added** report `0160` to the repository, `aa62e6d`, and it does **not**
reproduce the reading: it returns **148 / 124 / 24 open**. That commit carried board edits of its own,
so `0160` measured the board as it stood **before** it — which is `aa62e6d`'s parent, `afe4fae`. For
orientation: `0174`'s filing commit is `8540d03`, and `afe4fae` is three commits behind it.

**The script**, so the claim is checkable rather than asserted:

```bash
#!/usr/bin/env bash
# Board reachability measurement — the §1.1 method.
#   measure.sh <path>          # working tree
#   measure.sh <rev> <path>    # a git revision
set -euo pipefail
if [ $# -eq 2 ]; then SRC="$(git show "$1:$2")"; else SRC="$(cat "$1")"; fi
printf '%s\n' "$SRC" | awk -F'|' '
  { rank=$3; gsub(/^[ \t]+|[ \t]+$/,"",rank)
    if (rank !~ /^P[0-9]+$/) next                       # population: rows with a P<n> rank cell
    st=$2; gsub(/^[ \t]+|[ \t]+$/,"",st)                # status = field 1 of the pipe-split
    id=""; if (match($0,/\[`[0-9][0-9][0-9][0-9]-/)) id=substr($0,RSTART+2,4)
    n++; C[n]=(st ~ /^✅ Done/ || st ~ /^⛔ Cancelled/ || st ~ /^➡️ Moved/); ID[n]=id }
  END {
    seg=0; inseg=0
    for (i=1;i<=n;i++)                                  # segment = maximal run of consecutive open rows
      if (!C[i]) { if(!inseg){seg++;inseg=1} S[i]=seg; SZ[seg]++; M[seg]=M[seg]" "ID[i] } else inseg=0
    for (i=1;i<=n;i++) if (!C[i]) { open++; if (S[i]!=seg) un++ }   # unreachable = open, not in final segment
    for (s=1;s<=seg;s++) if (SZ[s]==1) { sing++; sl=sl M[s] }
    printf "rows=%d closed=%d (%.1f%%) open=%d segments=%d unreachable=%d of %d (%.1f%%) singletons=%d [%s]\n",
      n, n-open, 100*(n-open)/n, open, seg, un, open, 100*un/open, sing, sl
    for (s=1;s<=seg;s++) printf "  seg %d (size %d)%s%s\n", s, SZ[s], M[s], (s==seg?"  <- append zone":"") }'
```

**On the 6 → 5 segment change — not an artefact, and not the renumbering.** A rank relabeling **cannot**
change a segment count: a segment is a maximal run of consecutive open rows in board order, which
depends only on the open/closed sequence, not on the labels. The +1 renumbering §2 describes therefore
had no effect on it whatever. The actual cause is in §1.3 — prior segment 1 was exactly
`{0130, 0136}`, and closing both erased it.

The method is sound and the two readings are genuinely comparable; the differences in §1.3 are real
changes in the board, not artefacts of measurement.

### 1.5 The expired proof case — **confirmed** — and the live singleton set

Report `0160` §6.3 warned that `0160`'s brief's headline proof — task `0161`, then a singleton
*"that can never move at all … the proof, generated by the close that found it"* — had already expired.

**Confirmed on the live board: `0161` is `✅ Done`.** It is not a singleton, not open, and not evidence
of anything except how fast this class of proof decays.

**The live singleton set is exactly one row: task `0143`** (*"Append a dated correction note to
ADR-010"*). It is the same task the prior reading named — but **not at the rank that reading printed**.
The prior reading placed it one rank higher; that figure was a **pre-insertion rank**, and this task's
own filing moved it down by one (§2). This is precisely the trap
[`conventions/priority-is-rank-not-identity.md`](../conventions/priority-is-rank-not-identity.md)
exists to prevent: *"A sprint board's Priority cell is board rank … A task's identity is its
task-folder name's `NNNN` prefix, and nothing else."* The row is `0143`. The number it wears is not its
name.

### 1.6 The stronger live specimen — **`0173`**

A singleton proves a row cannot move. It does not prove anyone **wanted** it to. `0173` proves both,
and it is the better specimen because the merit case is **stated, reasoned, and urgent**:

`0173`'s brief carries, in the form step 5 already mandates:

> **On merit this belongs immediately above `0154`.**

The board's own filing addendum agrees and escalates it:

> *"`0173` is the exception, and its flag is loud … it is **urgent** — until it lands, every wiki
> completion flag this project emits manufactures a dead path, and any ledger quoting one preserves it
> permanently … The board's reading order therefore contradicts the dependency links."*

**The board cannot express this at all.** `0173` sits in segment 5; `0154` sits in segment 3. Between
them lie **five closed rows** — `0157`, `0161`, `0148`, `0159`, `0160`. Promoting `0173` to its stated
merit position would renumber every one of them, which the standing rule forbids **absolutely**.

So the live board carries a merit ordering that is written down, reasoned, urgent, agreed by the
producer, flagged to the owner — and **unrepresentable in the column that is supposed to carry
ordering**. That is the defect, on a specimen that has not expired.

---

## 2. The finding the brief did not anticipate — **this task's own filing renumbered eight closed rows**

### 2.1 The eight rows

`/fkit-task-brief` step 5 states the rule without qualification:

> **`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — not even under an owner
> ruling.** Closed history is not re-ranked to make room for new work.

I verified the filing commit's diff row by row, comparing the board immediately before and immediately
after the insertion. **Eight closed rows changed rank:**

| Task | Status at the time | Moved |
|---|---|---|
| `0151` | `✅ Done (agent-closed — not owner-verified)` | down one |
| `0147` | `✅ Done (agent-closed — not owner-verified)` | down one |
| `0150` | `✅ Done (agent-closed — not owner-verified)` | down one |
| `0157` | `✅ Done (agent-closed — not owner-verified)` | down one |
| `0161` | `✅ Done (agent-closed — not owner-verified)` | down one |
| `0148` | `✅ Done (agent-closed — not owner-verified)` | down one |
| `0159` | `✅ Done (agent-closed — not owner-verified)` | down one |
| `0160` | `✅ Done (agent-closed — not owner-verified)` | down one |

**Twenty-two** open rows moved as well; those are unremarkable. The full movement is **30 rows —
8 closed plus 22 open** — and it is exactly the old `P119`–`P148` band the brief names, every one of
them shifted by exactly **+1**. The eight above are a breach of an absolute rule.

### 2.2 Two records assert the opposite, and **both are false**

The board addendum written at filing, under the heading *"⚠️ One row was inserted mid-board by owner
ruling, and it renumbered the board"*, states:

> *"It takes the head of the earliest reachable open segment, and **no closed row was renumbered by the
> insertion**."*

`0174`'s own brief repeats it verbatim in its `## Notes`:

> *"**P119 is the highest rank in the band that is not behind a closed row** — it takes the head of the
> earliest reachable open segment … and **no closed row was renumbered by the insertion**."*

**Both statements are false.** Eight closed rows were renumbered. The claim is not a rounding error or
a matter of interpretation; it is contradicted by the filing commit's own diff.

**The reasoning that produced the error is visible and worth naming**, because it will recur. The
producer checked the **band the owner named** — the four ranks immediately above the insertion point —
found them all closed, and correctly concluded that placing the row *below* them renumbered none of
**them**. That is true. It is also the wrong test: an insertion renumbers everything **below** it, not
above it, and below it lay eight closed rows scattered among the open ones. The check was run in the
wrong direction.

### 2.3 The generalization — the append rule is a **forced consequence**, not a policy choice

This is the finding that decides the rest of the report.

Inserting a row at any position renumbers **every row below that position**. On a board where closed and
open rows **interleave**, the only position with no closed row beneath it is a position inside the final
segment. Therefore:

> **On a board where closed and open rows interleave, there is no mid-board insertion point that does
> not renumber a closed row. The only insertion point that renumbers nothing closed is the append
> zone — which is to say, appending.**

Sprint 2 has 126 closed rows scattered through 155. Any insertion above the final segment renumbers at
least one of them, and usually dozens.

So `/fkit-task-brief` step 5's append rule is **not a policy the project could simply relax**. Given the
closed-row rule — which nobody has proposed dropping, and which protects the historical record — the
append rule follows as a **theorem**. Ruling that "the append rule should change" (candidate 5) does not
buy an insertion; it only buys the right to rewrite closed history, which is a different and much larger
decision that nobody has asked for.

**This is why the ruling in §3 records ordering intent in the brief rather than in the rank column.** It
is not a preference for prose over numbers. It is that the number **cannot be made to carry it** without
giving up something more valuable.

---

## 3. The ruling — every candidate in or out, **by name**

### 3.1 Candidate 1 — **a merit field in the brief, distinct from board rank: RULED IN**

**This is the ruling.** An owner (or a producer acting on a ruling) records an ordering intent that rank
cannot carry as a **relative, non-numeric merit statement in the task's own brief**.

**Canonical form — two shapes, and only two:**

```
- **On merit:** immediately above 0154 — <reason>
- **On merit:** as ranked
```

**Its properties, each chosen against a specific failure:**

- **Relative, never absolute.** *"immediately above `0154`"*, never *"belongs at 122"*. A relative
  statement survives every re-rank; an absolute one is stale the moment anything above it moves. This is
  the same rule `conventions/priority-is-rank-not-identity.md` already states, applied to the one place
  it was not yet binding.
- **Folder ID only, never `P<n>`.** The neighbour is named `0154`. Writing `0154 (P129)` reintroduces
  exactly the defect tasks `0157` and `0159` were spent repairing.
- **Advisory. Rank still binds execution.** The merit statement is a **record of intent**, not an
  instruction to a reader picking up the next task. Nothing reads the board differently because of it.
  Two carriers with two jobs: rank says *what is next*, the merit statement says *what the owner
  thinks should have been next*. Collapsing them would make the board unreadable.
- **`as ranked` is required, not optional.** A brief with no merit line is indistinguishable from a
  brief whose author forgot. The explicit no-op is what makes absence detectable — and what makes §5.1's
  guard possible at all.

**Why this and not something more powerful.** It is the only candidate that costs one line, cannot go
stale, needs no new file format, no board surgery, and no new authority. It also **already exists** —
step 5 mandates a merit sentence for appended rows today, and 15 briefs carry one (§7). The ruling
**generalizes an existing practice and fixes its form**; it does not invent a mechanism.

### 3.2 Candidate 2 — **an explicit owner-only re-rank act with its own recorded authority: RULED OUT**

Out, on §2.3. The mechanism **already exists** — step 5's *"The one exception — an owner-ruled re-rank.
A re-rank is the owner's call"* — and it does not solve the problem, because the closed-row rule binds
the owner too (*"not even under an owner ruling"*). Formalizing the authority harder does not create a
legal insertion point where §2.3 proves none exists. Worse, this task's own filing is the demonstration:
it invoked precisely this mechanism, with impeccably recorded authority, and **still** breached the
closed-row rule eight times. **More ceremony around an act that cannot be performed legally is not a
remedy — it is a louder way to breach the rule.**

### 3.3 Candidate 3 — **a periodic renumbering pass: RULED OUT**

Out. A renumbering pass over the whole board is a **mass rewrite of closed history** — the single thing
the closed-row rule exists to forbid, performed at scale and on a schedule. It would invalidate every
rank citation in every closed brief, addendum, ledger and report in one commit, which is the failure
tasks `0157` and `0159` were spent repairing.

**Distinguish this from candidate 6.** A renumbering pass rewrites the ranks of rows that stay on the
board. A sprint rollover **moves open rows to a new board and leaves the old one frozen**. The first
rewrites history; the second does not touch it. They are not variants of one idea.

### 3.4 Candidate 4 — **a note-beside-the-row convention (an addendum on the board): RULED OUT**

Out, on three counts.

1. **Wrong home.** The note would live in `ai-agents/sprints/sprint-2.md` — a coordination document that
   every producer appends to. Report `0160` §1 rules that class of file the **least durable** place to
   put a pointer: *"third parties append above your line for reasons unrelated to your sentence."* The
   brief travels with the task; the board does not.
2. **Measured, not asserted.** The board already carries this convention, and it does not work. `0173`'s
   merit case **is** in a board addendum — loudly, urgently, correctly. It has changed nothing, because
   a note beside a row cannot move the row.
3. **It has already rotted once.** The addendum that carries `0174`'s placement asserts something false
   (§2.2) and has stood uncorrected. Board addenda are where claims go to stop being checked.

### 3.5 Candidate 5 — **rule that the append rule itself should change: RULED OUT**

Out, on §2.3 — and this is the load-bearing rejection.

The append rule is not an independent policy. Given the closed-row rule, it is a **forced consequence**:
there is no mid-board insertion point on an interleaved board that does not renumber a closed row.
Changing the append rule therefore does not deliver insertions; it delivers **permission to renumber
closed rows**, which is a strictly larger decision, nobody has proposed it, and it destroys the durable
record that `conventions/priority-is-rank-not-identity.md` and ADR-029 were written to protect.

**Stated plainly so it is not re-litigated: the append rule cannot be relaxed without first relaxing the
closed-row rule.** Anyone re-raising candidate 5 must argue the closed-row rule, not the append rule.

### 3.6 Candidate 6 — **sprint rollover: RULED IN as a mechanism. Its execution is NOT ruled.**

*This candidate is mine; the brief's list did not contain it.*

**Ruled IN as the only mechanism that can genuinely restore reachability.** Rolling the 29 open rows
onto a fresh board — sprint 3, or a compaction of sprint 2 — with sprint 2 frozen and closed, resets
every open row into one contiguous segment. Unreachability goes to **zero** in one act. It does this
**without renumbering a single closed row**, because the closed rows stay on the frozen board at the
ranks they already hold. It is the only candidate with that property, and it is the reason it is ruled
in where candidate 3 is ruled out.

**Its execution is a separate decision and is NOT ruled here.** It is **follow-up 8**, and it **awaits
the owner's sign-off** (§8, §9). Nothing in this report authorizes rolling the board.

**I consider it the highest-leverage item of the eight**, and say so as a recommendation rather than a
ruling: everything else in this report makes an unrepresentable ordering **recordable**. Candidate 6 is
the only one that makes it **representable again**.

### 3.7 Candidate 7 — **`Depends on` / `Blocks` as the binding half of ordering: RULED IN**

*This candidate is mine; the brief's list did not contain it.*

**Ruled IN.** Where execution order actually **matters** — where one task must land before another or
the second is wrong — the ordering belongs in the briefs' `Depends on` / `Blocks` declarations, **not**
in board rank, and the declaration is **binding** where board reading order contradicts it.

This is not new authority. The filing addendum already states it: *"The `Depends on` / `Blocks`
declarations in the briefs are the binding record."* This report **rules** it, so it stops being one
addendum's opinion.

**It also completes candidate 1 by dividing the work correctly:**

| Carrier | Carries | Binding? |
|---|---|---|
| Board rank `P<n>` | reading order — what to pick up next | yes, for picking work |
| `On merit` statement | the owner's preference the rank cannot express | **no — advisory** |
| `Depends on` / `Blocks` | correctness order — what must land first | **yes, and it outranks reading order** |

A merit case that is really a correctness constraint should be written as a dependency, where it binds,
rather than as a merit note, where it does not. See §6 for the live specimen this resolves.

---

## 4. `/fkit-task-brief` step 5 — **the wall clause STAYS**, with one required narrowing

### 4.1 It stays, and its consequence is accepted

The clause:

> **A closed row is a wall, not a step:** an open row sitting above one is out of reach however good the
> merit case, because reaching it would renumber the closed rows in between.

**It stays exactly as written.** The brief framed the question correctly — the clause is *"operable and
correctly reasoned"*, so the question is whether its **consequence** is acceptable, not whether it is
coherent.

**The consequence is accepted, explicitly and with its cost named:** 16 of 29 open rows cannot be
promoted to their merit positions, and that number will keep growing in absolute terms as the board
closes out. `0173` will not reach `0154` however urgent its case. The project pays that cost in exchange
for a closed record whose ranks never move — which is what makes every historical citation, addendum,
ledger and report resolvable years later. §2.3 shows the trade is not even available in the other
direction without giving up the closed record entirely.

Two things blunt the cost, and they are the reason this is acceptable rather than merely tolerated:
candidate 1 makes the intent **recorded** even when unrepresentable, and candidate 7 makes the ordering
that genuinely matters — correctness order — **binding through a carrier that has no wall at all**.

### 4.2 The required narrowing — **a mid-board insertion is not the owner-ruled re-rank exception**

Step 5 today reads:

> **The one exception — an owner-ruled re-rank. A re-rank is the owner's call.**

That sentence was read, at this task's own filing, as authorizing a **mid-board insertion**. It
renumbered eight closed rows (§2.1) — breaching a rule the **same step** states absolutely:

> **`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — not even under an owner
> ruling.**

Two rules in one step *"Determine priority"* contradict each other under that reading, and the reader
followed the permissive one.

*(An earlier draft located the second rule as "four bullets apart" from the first. That was both a
**positional coordinate into a mutable skill file** — the citation class this task descends from — and
miscounted. It is anchored by quoted text above instead, which is what §3.1 and `0160` require.)*

**The narrowing, ruled here:**

> The owner-ruled re-rank exception permits **moving an existing row within its own contiguous run of
> open rows**. It does **not** permit **inserting a new row mid-board**, because on an interleaved
> board an insertion renumbers every row beneath it, including closed ones — and the closed-row rule
> admits no exception, *"not even under an owner ruling"*.

**Where a new row's merit position is out of reach, it appends and records the merit statement under
candidate 1.** That is the whole remedy.

This is **follow-up 4**. It narrows a standing rule with a history and is recorded in
[**ADR-035**](../decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
not on this report alone.

---

## 5. Enforcement — **split**, and honestly

Report `0160` §7 required each proposed guard to name **the file it lives in and the condition it
asserts**, or to say *"nothing can enforce this"* in those words. Case 5's row there read *"nothing can
enforce this"*, on the reasoning that *"there is nothing to assert. The question is what an owner writes
down, not what a file contains."*

**That answer was right about half the question and wrong about the other half, and the ruling changes
it — in one direction only.** The answer is now **split**.

| Half | Enforceable? | File | Condition |
|---|---|---|---|
| **Presence and shape** of the merit statement | **Yes** | `claude/skills/fkit-status/dashboard.sh` + `test/dashboard-contract.test.js` | §5.1 |
| **Whether the merit statement is true, or honest, or the ordering the owner actually wants** | **No** | — | **nothing can enforce this** |

### 5.1 The enforceable half — file and condition

**File:** `claude/skills/fkit-status/dashboard.sh`, emitting a new drift nonconformance kind
`brief-missing-merit`, in the same family as the `brief-missing-status`, `brief-missing-owner` and
`brief-missing-id` kinds it already emits. **Asserted in:** `test/dashboard-contract.test.js`, which
already asserts each of those three kinds.

**Condition, in two parts:**

1. **Presence.** Every brief on a **ranked** board carries a line matching the canonical form —
   `**On merit:**` followed by either a relative statement naming a neighbour by folder ID, or the
   literal `as ranked`. A brief with neither is `brief-missing-merit` drift. (Unranked boards are
   excluded: the Backlog board has no rank for a merit statement to be relative to.)
2. **Shape.** The merit statement contains **no `P<n>` token**. A merit line reading
   `immediately above 0154 (P129)` is nonconformance.

### 5.2 The unenforceable half — in the required words

Whether the recorded ordering is the ordering the owner actually wants, whether the stated reason is a
real reason, and whether a merit statement written today still reflects the owner's judgement next week
— **nothing can enforce this.** These are claims about intent, and no file's contents make them true or
false. The guard in §5.1 checks that a sentence exists and is well-formed. It cannot check that it is
right, and no guard can.

### 5.3 A third invariant, proposed — `test/closed-rank-immutability.test.js`

§2 found a breach of an absolute rule that **no existing check caught**, and that both written records
of the act claimed had not happened. That is worth a guard of its own, and it is not the same guard as
§5.1.

**File:** `test/closed-rank-immutability.test.js` (new). **Condition:** across a commit range, no board
row whose status is `✅ Done`, `⛔ Cancelled` or `➡️ Moved` in the **earlier** revision appears with a
different `P<n>` rank in the **later** revision.

**Its ceiling, stated rather than discovered later — four limits:**

1. **It is a diff check, not a state check.** There is no property of a single board file that reveals a
   closed row was renumbered. The invariant lives **between two revisions**.
2. **It therefore needs git history**, unlike every other test under `test/`. That is a new kind of
   dependency for this suite and a real cost — it makes the test unrunnable against a bare working tree
   or a fresh checkout without history.
3. **It asserts a transition, not a state.** It cannot tell you the current board is correct; only that
   a particular change did not break the rule.
4. **It would be red on the commit that filed this very task.** I confirmed this: replaying the
   condition across the filing commit flags all eight rows of §2.1. That is the test working correctly,
   and it means the follow-up cannot land without a **baseline decision** — exempt history before a
   named commit, or accept a permanently red run.

**Ranked LOW.** It guards a rule that is breached rarely and loudly, and it costs more than the other
guard.

### 5.4 Two accepted costs, carried explicitly

**(a) The shape check reads `P<n>` tokens only — and a bare number slips through.** The condition in
§5.1 part 2 bans `P<n>`. It does **not** catch a merit statement that writes a bare rank with no `P`.
**This is not hypothetical: `0158`'s brief is the live specimen** (§7). Its merit statement writes
*"belongs at 122"* — an absolute board rank, exactly the defect. **Restated precisely, because cost (b)
changes the arithmetic:** `0158`'s line as written today is caught, but only by the **presence** half,
for being in the legacy shape rather than for containing a bare rank. Reshape it into the canonical
form and keep the bare number — `**On merit:** belongs at 122` — and **the guard as specified passes
it**. So a backfill done to clear cost (b) can extinguish the drift flag while leaving the actual
defect in the brief. Catching bare numbers means flagging every integer in a merit sentence, which is unreproducible
and noisy. **The literal `P<n>`-token reading ships; the gap is accepted and named here so it is not
later reported as a surprise.** Extending it is a separate decision with its own measured cost — not a
tweak to fold in.

**(b) The guard needs a grandfathering decision before it can go green — and it is red on the whole
board, not on part of it.** §5.1's condition requires the **canonical** form `**On merit:**`. Measured
live at 18:32 MSK against that condition, not against a looser one:

| Open sprint-2 briefs | Count | Why the guard is red |
|---|---|---|
| Carry **no** merit statement in any form | 18 | fails **presence** |
| Carry a merit statement in the **legacy** `**On merit this belongs …**` shape step 5 mandates today | 11 | fails **shape** — none matches `**On merit:**` |
| Match the canonical form | **0** | — |
| **Total open** | **29** | **the guard is red on 29 of 29** |

**On day one the guard is red on every open brief on the board.** An earlier draft sized this cost at
18 — the presence failures only — and understated it: the 11 briefs that already carry the practice
fail too, because the ruling in §3.1 fixes the practice's **form**, and no brief in the corpus has been
written in that form yet.

**Do not close this gap by loosening §5.1 to accept the legacy shape.** That would re-open exactly what
§3.1 ruled — *"the practice is right and its form is wrong"* — and defeat the **shape** half of the
guard, which is the half that stops the merit field becoming the next host for the bare-rank citation
problem this task descends from (§7, `0158`). The cost is real; the canonical form is not the thing to
trade away.

Whoever files follow-up 3 must carry the decision, now sized correctly: **backfill all 29** (write 18
new statements, reshape 11 existing ones), or **exempt briefs filed before a named date**, or **ship
the drift fact as advisory** and let the roll-up carry it. Not choosing means the guard cannot land.

---

## 6. My position on candidate 7 — the `0173` flag, and what should have been done

The board's filing addendum flags `0173` correctly and then asks the wrong question:

> *"the two tasks it blocks sit **above** it … The board's reading order therefore contradicts the
> dependency links … **the owner should decide whether to promote the row.**"*

**My position: promotion is the wrong remedy, and it is not available.** Promoting `0173` to its stated
merit position renumbers five closed rows (§1.6). The owner cannot authorize that — the closed-row rule
binds the owner too. Putting the question as *"whether to promote"* offers the owner a choice between
one option that is illegal and one that is unstated.

**The legal alternative that preserves the owner's intent exactly** was available at filing time and
costs one line in a brief:

> Declare **`0154` and `0165` depend on `0173`** in their own `Depends on` fields.

That renumbers nothing, touches no closed row, needs no owner ruling, and delivers the **exact**
outcome the flag wants: `0173` lands first. Under §3.7 the dependency **binds** and outranks reading
order, so a producer walking the board reaches `0154`, finds the declared dependency, and works
`0173` first. **The ordering intent is fully preserved; only the carrier changes.**

**The terminology collision, named because it will mislead the next reader.** The word *"reachable"*
appears in both records with **incompatible meanings**:

| Sense | Used in | Means |
|---|---|---|
| Addendum's sense | *"It takes the head of the earliest **reachable** open segment"* | the highest rank in the owner's band that is not itself occupied by a closed row |
| Measurement's sense | report `0160` §6.2 and §1.1 above | an open row is **reachable** only if it sits in the **final** segment — the append zone |

Under the measurement's sense — the one the whole finding is built on — the segment the addendum calls
*"the earliest reachable open segment"* is **not reachable at all**. It is segment 1 of 5.
**`0174` is itself one of the 16 unreachable rows** (§1.2). The task filed to fix unreachability sits,
today, in an unreachable slot, described in its own filing note as reachable.

**Only the measurement's sense should be used going forward.** The addendum's usage should be corrected
rather than kept as a second definition — that correction is part of follow-up 6.

---

## 7. The practice already exists in the corpus — and it already reproduces the defect

The ruling in §3.1 is not new behaviour. **Measured live, 2026-08-01 18:32 MSK:** the phrase `On merit`
appears in **15 brief files** — **11 of the 29 open sprint-2 briefs** (`0154`, `0155`, `0156`, `0158`,
`0163`, `0164`, `0168`, `0170`, `0172`, `0173`, `0176`) and **4 closed** (`0150`, `0157`, `0159`,
`0160`).

*(A recount at the same as-of instant reads **15**, one higher than the draft ruling's 14; the fourth
closed brief — `0160`'s own, which states a merit position **negatively** — was missed in the draft. The
open-brief figure of 11 is unchanged, and no conclusion moves.)*

**The form varies freely**, which is the argument for a canonical shape:

- *"On merit this belongs immediately above `0154`."* — `0173`
- *"On merit this belongs directly below 0160"* — `0168`, folder ID, no backticks
- *"On merit it belongs adjacent to `0175`, its pair"* — `0176`
- *"On merit this belongs below 0161 and above the 0157/0159 pair is **not** claimed"* — `0160`, a
  **negative** merit statement, which no reader or guard would parse

**And one of them reproduces case 1 inside the practice itself.** `0158`'s brief:

> *"**On merit this belongs at 122** — immediately below 0142 (P121), for the class"*

Two defects in one sentence. **`belongs at 122`** is an **absolute board rank**, already stale — this
task's own filing moved everything at and below it by one. **`0142 (P121)`** is a folder ID paired with
a board rank, which is the pairing tasks `0157` and `0159` were spent sweeping out of the corpus — and
it is stale too: `0142` no longer holds that rank.

**The practice is right and its form is wrong.** That is exactly what §3.1 rules and §5.1 guards — and
it is why the guard's two parts are presence **and** shape, not presence alone. It is also the cleanest
demonstration of cost (a): the guard catches `0142 (P121)` and **misses** `belongs at 122`, in the same
sentence.

---

## 8. Follow-ups — **named, not filed**

**The producer files these. Naming them is this task's deliverable.** None is written here, and no brief
is created by this task. **There are eight.**

| # | Follow-up | `## Owner` | Sequencing |
|---|---|---|---|
| 1 | **Record the canonical merit-statement form in the convention page** — add §3.1's two shapes and the folder-ID-only rule to `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`. **Dual-homed** — the page has a `claude/scaffold/` copy and both must move together, per `conventions/dual-home-parity.md` | `fkit-architect` to write; `fkit-producer` to file | first — follow-ups 2 and 3 cite it |
| 2 | **Amend `/fkit-task-brief` step 5 to require the merit statement on every brief on a ranked board**, in the canonical form, including the `as ranked` no-op. Today step 5 requires it only for **appended** rows | `fkit-producer` to file; `fkit-coder` to edit | after 1 |
| 3 | **Build the `brief-missing-merit` guard** — `dashboard.sh` drift kind plus the shape check, asserted in `test/dashboard-contract.test.js`. **MUST carry the grandfathering decision (§5.4b) and the accepted `P<n>`-token-only limit (§5.4a) from day one. ⚠️ The guard is red on 29 of 29 open briefs on day one, not 18** — the 11 briefs that already carry a merit statement fail the **shape** half | `fkit-coder` | after 2; blocked on the grandfathering decision |
| 4 | **Narrow `/fkit-task-brief` step 5's owner-ruled re-rank exception by name** — a mid-board **insertion** is not the exception (§4.2). **Recorded in ADR-035**; the follow-up is the skill edit | `fkit-producer` to file; `fkit-coder` to edit | independent — can land first |
| 5 | **Build `test/closed-rank-immutability.test.js`** — the third invariant (§5.3). **Its brief must carry the four ceiling limits, and the baseline decision: it is red on the filing commit of task `0174`** | `fkit-coder` | **LOW**; after 4; blocked on the baseline decision |
| 6 | **Append a dated correction note** to the sprint-2 filing addendum **and** to `0174`'s brief, recording that the insertion renumbered **eight** closed rows (§2.1) and that both records' *"no closed row was renumbered"* claim is **false**; and correcting the addendum's use of *"reachable"* to the measurement's sense (§6). **⚠️ CORRECT THE RECORD — DO NOT REVERT.** Reverting the insertion renumbers the eight closed rows **a second time** and contradicts the `0157`/`0159` precedent that a stale rank reference is repaired by **naming the folder ID**, not by restoring numbers | `fkit-producer` | soon — two live records assert a falsehood |
| 7 | **Record the `Depends on` / `Blocks` declaration as the binding execution order** where board reading order contradicts it, starting with the live specimen: declare `0154` and `0165` as depending on `0173` (§6). Discharges the addendum's standing *"should the owner promote the row"* flag **without a promotion** | `fkit-producer` | soon — `0173`'s flag is live and marked urgent |
| 8 | **A sprint rollover / board compaction** — move the 29 open rows to a fresh contiguous board and freeze sprint 2 (§3.6). **⚠️ NOT RULED. This report notes it as a follow-up and nothing more; the owner deferred the decision on 2026-08-01. Do not act on it, and do not read candidate 6's ruling as authorization.** Its scope must state what happens to in-flight tasks, to every existing citation into the sprint-2 board, and to the dashboard's board discovery | **the owner** must sign off first; then `fkit-producer` | **awaits the owner** |

**On follow-up 8, stated as a recommendation and not as a ruling: I consider it the highest-leverage
item of the eight.** Follow-ups 1–3 and 7 make an unrepresentable ordering **recordable and binding**.
Follow-up 8 is the only one that makes it **representable again**, and it is the only mechanism that
moves the absolute unreachable count down for a reason other than work disappearing (§1.3).

---

## 9. Open questions

1. **The grandfathering decision for follow-up 3** (§5.4b) — backfill **all 29** open briefs (18 have no
   merit statement, 11 carry the legacy shape), exempt by date, or ship the fact as advisory. **Blocks
   follow-up 3.** Producer judgement, or owner's if the backfill is chosen — **the backfill is a
   29-brief job, not an 18-brief one**, which may change who decides it.
2. **The baseline decision for follow-up 5** (§5.3, limit 4) — exempt history before a named commit, or
   accept a red run. **Blocks follow-up 5.**
3. **Sprint rollover (follow-up 8)** — **deferred by the owner on 2026-08-01, and not ruled here.**
   Awaits the owner.

---

## 10. Verification — this report's own compliance

Against `0174`'s stated verification steps:

| Step | Status |
|---|---|
| 1 — a report under `reports/` with a dated filename | ✅ this file |
| 2 — a freshly derived measurement with its own as-of date and stated method; prior figures only as comparison | ✅ §1.1–§1.2, as of 2026-08-01 18:32 MSK; prior reading appears only in the comparison column |
| 3 — states the `0161` proof case had expired and names the live singleton set | ✅ §1.5 — `0161` is `✅ Done`; live singleton set is exactly `0143` |
| 4 — rules each candidate **in or out by name** | ✅ §3.1–§3.7 — candidates 1, 6, 7 **IN**; 2, 3, 4, 5 **OUT**, each by name |
| 5 — enforcement answered with a file plus a condition, **or** the literal words *"nothing can enforce this"* | ✅ §5 — **split**: file plus condition in §5.1, and the literal words in §5.2 |
| 6 — names its follow-ups without filing them | ✅ §8 — eight named, none filed |
| 7 — `git diff --stat` shows no file under `ai-agents/tasks/`, `ai-agents/sprints/` or `ai-agents/wiki-vault/` changed by the ruling work | ⚠️ **PASS on scope, checked directly — because the named instrument cannot decide it.** The ruling's **products** are this report and ADR-035. It **also** wrote `plan.md`, `worklog.md` and `review.md` into the task folder under `ai-agents/tasks/` — workflow artifacts the task process mandates, not products of the ruling. **`git diff --stat` fails this step in both directions:** it **over-reports** (it lists `ai-agents/sprints/sprint-2.md` and `0174`'s `brief.md`, both one-line status flips made **before** this ruling began) and it **under-reports** (the task-folder files are untracked, so the command is structurally blind to them). The scope the step exists to protect was therefore verified by direct inspection instead: no brief filed, nothing re-ranked, no coordination document edited, nothing under `wiki-vault/` touched, nothing committed |
| 8 — no `:NNN` line-number citation into a coordination document | ✅ grep for `\.md:[0-9]` over this file and ADR-035 returns nothing. Every reference in this report anchors by **heading and quoted phrase**, and every task is cited by **folder ID**, never by rank |

**Scope compliance:** no file was re-ranked; no brief was filed; the board addendum and `0174`'s brief
were **named as false but not edited** (follow-up 6, the producer's); case 1 is referenced only; nothing
under `ai-agents/wiki-vault/` was touched; nothing was committed.

**This report should be ingested into the wiki by `fkit-wiki`** — it is not the architect's to write
there.
