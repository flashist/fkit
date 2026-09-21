# ADR-051: One store for tasks — aiboard is the gated destination; the read-only reader is the interim

- **Status:** `accepted` — **the owner ruled the content on 2026-09-18 and authorised this record.**
  The ruling reached the repo earlier the same day on a sprint board and two task briefs; this ADR is
  the decision record it was owed.
  ⚠️ **One part was flagged as subject to his revision — and he revised it.** The trial's *4 weeks,
  calendar only, no work floor* **was superseded later the same day**, along with nine other
  refinements: see *§Amendments — 2026-09-18, TEN further rulings in three rounds*, and the annotations
  in *§The gate*, **Trial** and **P5**. ⛔ **Two of those refinements repaired gate bars that were
  UNSATISFIABLE** (*§Amendment 8*, *§Amendment 10*); **one is an accepted, deliberately un-timed-out
  risk** (*§Amendment 9*). ⭐ **The series is CLOSED** — see *§The amendment series is CLOSED*.
  ⛔ **Accepted is not a work order.** It authorises the *direction*, not the migration — see
  *§What this ruling unblocks, and what it does not*.
- **Date:** 2026-09-18
- **Deciders:** **the owner** (Mark Dolbyrev). Two things of his are recorded below and they are
  **kept apart deliberately**: the **option text he selected** (written by an agent, chosen by him)
  and **his own free prose** (typed by him). Drafted by `fkit-architect` at `fkit-lead`'s direction,
  under the owner's authorisation to file this ADR. ⛔ **No owner channel was available to the drafter**
  ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md)); open items are returned,
  not resolved.
- **Partially supersedes:** `fkit-external-expert`'s verdict
  ([`reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md`](../reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md))
  — **on its endpoint only.** Its path is adopted. ⛔ **Its file is not edited.** See *§Supersession*.
- **Touches:** [ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) (a task is a
  folder keyed by a permanent four-digit id — the identity T-023 destroys),
  [ADR-049](adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md)
  (what a close may claim; its read-only interim posture),
  [ADR-050](adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed.md) (how a close is
  executed — the command a board write would have to call),
  [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md) (producer-only movers),
  [ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md) (nothing here writes the vault).
- **Where the ruling previously lived, and why that was not enough:**
  [`sprints/sprint-11.md`](../../sprints/sprint-11.md) and the briefs for tasks `0404` and `0405`.
  Boards are archived when a sprint closes and briefs move when a task closes. ⭐ **A future agent looks
  in `decisions/` first, so the ruling lives here now.**

> **What this ADR decides, in one line:** that **if** fkit ever depends on aiboard, aiboard is the
> **single and only** store for tasks and sprints — and that fkit does **not** move there until a
> named, objectively checkable gate is passed and the owner says so.

---

## ⛔ Read first — the three things most likely to be misread

1. ⭐ **This decides fkit's direction and commits aiboard to NOTHING.** aiboard
   (`/Users/mark.dolbyrev/Workspace/aiboard`) is a separate project of the same owner, with its own
   lead and its own board. **`T-021`, `T-022`, `T-023` and the Python→Node port are aiboard's tasks,
   on aiboard's board.** ⛔ **No fkit task is filed for any of them, and none may be** — they are
   **external preconditions**, referenced, never owned. Nothing in this ADR schedules aiboard's work
   or obliges aiboard to do it.
2. ⭐ **"Gate passed" is not "migration authorised."** They are two separate acts, and the second one
   has its own precondition (a dry run the owner reads). See *§The gate*, **On a pass**.
3. ⭐⭐ **THIS ADR IS THE AUTHORITATIVE TEXT OF THE GATE.** `P1`–`P6`, `A1`–`A2`, the trial, `F1`–`F5`
   and their wording live **here**. Any copy on a sprint board or in a task brief — including
   [`sprints/sprint-11.md`](../../sprints/sprint-11.md) — is a **summary for planning**, not the gate.
   ⛔ **If a board and this ADR differ, this ADR wins**, and the board is the thing to correct.
   ⚠️ **Why this is spelled out:** on 2026-09-18 a spawned `fkit-producer` that had been scoped out of
   `decisions/` searched everywhere it was permitted, found `A2`, `F1`–`F5`, the no-reopen wording and
   the `P3`/`P4`/`P5` numbering **nowhere on disk**, and returned them as missing. ⭐ **Nothing was
   missing — it was all here, in a directory that agent could not read.** A reader looking for the gate
   looks here first.

---

## Authority — the owner's rulings, 2026-09-18

**How they were given:** live in an `fkit lead` session via `AskUserQuestion`, relayed onward to
spawned agents that have no owner channel (ADR-021).

### Ruling 1 — the direction. ⚠️ SELECTED OPTION TEXT — an agent wrote it, he chose it

⛔ **This is not his own prose.** It is the option he picked, and it must never be quoted as his words.

> *"**B, but only after aiboard proves itself** — Accept B as the destination, run A now as the
> interim. You get the board immediately, and commit to the migration only once the Node port lands,
> T-022 is fixed, and you've used it on real work for a while. Slower to the end state; nothing
> irreversible happens early."*

**What A and B are.** ⭐ **Both are ONE store. Neither duplicates.**

| | Shape | Who stores the tasks | Standing |
|---|---|---|---|
| **A** | fkit's `ai-agents/` tree stays the **single** store; aiboard reads it through a pluggable reader and renders the board. **No migration, no duplication.** ⭐ Demonstrated 2026-09-18 by a **129-line read-only spike** serving all **405** real tasks with a **37 ms** snapshot, preserved at [`0404`'s `assets/external-expert-spike/`](../../tasks/done/0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/assets/external-expert-spike/README.md). | fkit | ✅ **THE INTERIM — runs now** |
| **B** | **aiboard becomes the single and only store**; fkit reads **and writes** through it. Means moving every task into aiboard's shape and teaching fkit's movers, status tooling and skills to work through it. | aiboard | ⭐ **THE DESTINATION — GATED** |

### Ruling 2 — ⭐⭐ THE OWNER'S OWN PROSE. He typed this. It is NOT selected option text

⛔ **The distinction is load-bearing. Do not let this block acquire the caveat that correctly sits on
Ruling 1.** This may be quoted as his words.

> *"If we ever achieve the situation where F-Kit uses AI board, it only makes sense if we have one
> storage for the tasks and sprints. We never should duplicate them. If I understand you correctly,
> what you are right now suggesting is that we basically have the main tasks in F-Kit and kind of
> create duplication for AI board to be able to represent them. That's not what I want. If we ever use
> AI board as a dependency for fkit, it should be the single and the only storage for tasks. I want to
> avoid situations where the duplication is even possible, because if we do duplicate tasks it will
> lead to a bunch of bad stuff like desynchronization, what is the source of truth, remembering that
> many tasks should be changed at the same time, many files should be changed at the same time, etc."*

⭐ **That paragraph is the reason B is the destination.** The gate is about *when*; this is about *why*.

### ⚠️⚠️ The agent error that nearly decided this the other way — recorded, not softened

⛔ **`fkit-lead` recorded this against itself and asked that it not be softened. It is kept at full
strength here.**

The owner first understood *"adapter"* to mean **duplicating** fkit's tasks into a second store.
⛔ **It does not.** The spike reads fkit's files **live** and **writes nothing**. `fkit-lead` had used
the words *"adapter"* and *"seam"* for many turns **without ever explaining them**, and the
misunderstanding followed from that.

⭐ **Corrected, he held the principle anyway:** if aiboard is ever the dependency, it must be the only
store. ⛔ **So B is chosen on principle, not on the misunderstanding.** Anyone tempted to re-litigate B
as *"he only picked it because he was confused"* is wrong, and this paragraph is why.

⚠️ **The reusable lesson:** *"adapter"* and *"seam"* are agent vocabulary. Put to the owner they read
as *"a second copy."* Say **what reads what, and what writes what**, in plain words.

---

## ⭐⭐ Amendments — 2026-09-18, TEN further rulings in three rounds. ⛔ CLOSED. Status stays `accepted`

⛔ **These refine a decision he had already signed. Nothing below reverses D1–D8 or the direction.**
**Round 1** (Amendments 1–3) closes **OQ-1**, **OQ-2** and **OQ-3**, which the original text left open.
**Round 2** (Amendments 4–7) closes **OQ-4**, **OQ-5** and **OQ-6**, which `fkit-architect` raised
*after* round 1 because round 1's own answers turned out to be under-specified.
**Round 3** (Amendments 8–10) closes **OQ-8** and **OQ-9** — ⛔ **two real defects: a counting rule and
a sprint bar that were both UNSATISFIABLE** — and **OQ-7**, ⚠️ **which he ruled AGAINST the architect's
recommendation.** ⛔ **The series ends here** (*§The amendment series is CLOSED*).

**How they were given:** live in an `fkit lead` session via `AskUserQuestion`, later the same day.
⚠️ **ALL SEVEN are SELECTED OPTION TEXT — an agent wrote the option, he chose it.** ⛔ **They are
not his own prose and must never be quoted as his words.** (Only *Ruling 2* above is his prose.)

⛔ **Nothing earlier in this ADR was deleted to make room for these.** The superseded state is left
standing and marked; a reader must be able to see the gate as it was, the hole it had, and how it
closed.

## Round 1 — the trial, P5's owner, the clock

### ⭐ Amendment 1 — THE WORK FLOOR IS RESTORED. This REVERSES his earlier choice. Closes OQ-1

> *"**Add the work floor back** — Both the producer and the architect independently landed here. The
> argument: F5 — 'you stopped using it and didn't notice' — is the ONLY guard against an idle four
> weeks, and it's a question asked once at the end, not a measurement. Adding 2 sprints closed + 40
> status transitions means the trial tests actual use rather than elapsed time."*

**Both states, kept legible:**

| | Earlier the same day | ⭐ Now, on reconsideration |
|---|---|---|
| **The trial** | 4 calendar weeks, **calendar only** | **4 calendar weeks AND the work floor** |
| **Work floor** | ⛔ **Proposed and DECLINED** — his deliberate choice | ✅ **Restored** — 2 sprints planned+closed through it **AND** ≥40 status transitions observed |
| **Consequence** | ⛔ *"FOUR QUIET WEEKS NOW SATISFY THE TRIAL"* | ⛔ **NO LONGER IN FORCE** — a quiet window now fails on the floor, not on F5 alone |

⭐ **Why he reversed:** two agents — a spawned `fkit-producer` and `fkit-architect` — **independently**
arrived at the same hole, and the argument that moved him is in the option text above: **F5 is a
question asked once at the end, not a measurement**, so it was the only thing standing between the gate
and four idle weeks.

⛔ **The trial is now, in full: 4 calendar weeks AND 2 sprints planned+closed through it AND ≥40 status
transitions observed. ALL THREE. Both floors, both required — neither substitutes for the other.**

⚠️ **The earlier decline is history, not error.** It was his call on the evidence he had at the time,
and it is recorded here at full strength so a future reader can see that this gate **once had that
hole** and how it was closed. ⛔ **Do not "tidy" the superseded text away.**

### Amendment 2 — P5's durability owner: THE OWNER TAKES IT PERSONALLY. Closes OQ-2

> *"**You own it personally** — Simplest and honest: you commit, you're the only user. Makes P5
> checkable — either there's a commit cadence or there isn't."*

⚠️⚠️ **The weakness was named in that same option and he accepted it with his eyes open. Recorded, not
dressed up:**

> *"it's the same guarantee that's currently produced a full day of uncommitted work."*

⛔ **State it plainly: P5 is now checkable, and it rests on one person's personal commitment — the same
commitment that, on the day it was chosen, had a full day of work sitting uncommitted.** That is not a
mechanism, a schedule, or an automation. It is a promise, and its only check is whether a commit
cadence exists when someone looks.

**What he declined**, both offered and both rejected in favour of the above:
- a **named role or automation** owning the commit cadence;
- an **aiboard-side undo / export** that would have made durability a property of the tool instead of
  a property of a person.

⭐ **EXTENDED by *§Amendment 4* the same day:** this amendment named the **owner**; it did **not** name
the **cadence**, which left *"either there's a commit cadence or there isn't"* with no threshold.
**He then ruled that assignment alone does NOT discharge P5, and supplied the cadence.** Read the two
together.

### Amendment 3 — the trial clock starts when the Node port lands. Closes OQ-3

> *"**When the Node port lands** — the trial is meant to prove the thing you'd actually migrate to, and
> today's reader is Python and provisional. Starting later means the trial tests the real candidate —
> at the cost of delaying the whole gate by however long the port takes."*

⛔ **So the trial — the 4 weeks AND the restored work floor alike — begins at P1, not on 2026-09-18.**

⚠️ **Reconciling this with the trial's own clause *"A stays the store throughout"*:** it still does, and
nothing about it changes. **A remains the store for the whole trial and nothing irreversible happens
during it.** What the ruling changes is **when the counting starts**, not what is running: the reader
available today may be used freely before the clock starts, but time spent on it **does not count
toward the 4 weeks or the work floor**.

⚠️ **The cost he accepted, in his chosen option's own words:** *"delaying the whole gate by however
long the port takes."* ⛔ **P1 is aiboard's work on aiboard's board (D7). fkit cannot schedule it, and
this ADR makes the whole gate wait on it.**

## Round 2 — making round 1 actually checkable

⭐ **Why there is a round 2.** Round 1 answered three questions and created three new ones: a work floor
with **no counting rule**, a trial with **no rule for how its three bars combine**, and a durability
owner with **no cadence**. `fkit-architect` returned all three as `NEEDS-DECISION`; `fkit-lead` put them
to the owner the same day. ⭐ **A bar nobody can count is not an objective bar** — that is the whole
point of *§The gate*, and round 2 is what keeps it true.

### ⭐⭐ Amendment 4 — P5's CADENCE: end of every working session. Closes OQ-4

⛔ **He first ruled that assigning an owner does NOT discharge P5** — the cadence had to be named.
Then he named it:

> *"**End of every working session** — Whenever you finish working in the repo, the tree is committed.
> Matches how you actually work — today would have been one commit at the end rather than 22 paths
> sitting uncommitted for hours. Easy to check: is the tree clean when you're not mid-task?"*

**P5 now reads, in full:**

| | |
|---|---|
| **Owner** | ⭐ **the owner, personally** (*§Amendment 2*) |
| **Cadence** | ⭐ **the tree is committed at the end of every working session** |
| **The check** | ⭐ ***"is the tree clean when he is not mid-task?"*** |
| **Status** | ⛔ **ASSIGNED and SPECIFIED — ⛔ NOT MET.** Only the owner may declare it met (D4). |

#### ⚠️⚠️ The first test of the promise, recorded beside the promise — ⛔ do not soften this

⛔⛔ **At the moment this commitment was made, it was already being broken.** The session that recorded
it held **a full day's work uncommitted — 22+ changed and untracked paths, nothing committed since the
`v0.3.1` release.** The cadence's own option text says it out loud: ***"today would have been one commit
at the end rather than 22 paths sitting uncommitted for hours."***

⭐ **Tie this to what he already accepted in *§Amendment 2*:** *"it's the same guarantee that's
currently produced a full day of uncommitted work."* **Same guarantee, same day, already failing.**

⛔ **This is written down deliberately, and it is the point:** a future reader asking *"was P5 ever
real?"* finds **the first test of the promise sitting next to the promise**, instead of a clean-looking
precondition. ⚠️ **A personal cadence with no mechanism behind it is the kind of thing that quietly
becomes an aspiration if nobody records that it was already failing when it was made.** ⛔ **Nobody may
tidy this paragraph away, and nobody may cite P5's specificity as evidence that it is being kept** —
specificity made it **checkable**, not kept. ⭐ **Check it; do not assume it.**

### Amendment 5 — the trial's three bars run CONCURRENTLY, not nested. Closes OQ-5

> *"**Trial ends when all three are met** — The 4 weeks and the work floors run together; whichever
> finishes last ends the trial. Matches the stated intent — test actual use, not elapsed time — without
> turning a slow month into a failure."*

⛔ **The rule: the trial ends at `max(4 calendar weeks, 2 sprints closed, 40 status transitions)`.**
All three start together at P1 (*§Amendment 3*) and run in parallel; **whichever is satisfied last ends
the trial.**

⭐ **What this means in practice: a slow month EXTENDS the trial. It does not fail it.** If the 4 weeks
elapse with only 1 sprint closed, the trial simply keeps running.

⛔ **He REJECTED the stricter reading** — *all three inside one 4-week window, or the trial fails.*
⚠️ **So no agent may report a trial as failed for missing a floor "in time."** Failure comes only from
**F1–F5**, never from slowness.

### Amendment 6 — what counts as a status transition, and who counts. Closes OQ-6

> *"**Any status change seen through the board, you tally** — Backlog→in-progress→done, any task,
> counted alongside the fallback tally you already agreed to keep. Keeps both counts in one place, and
> 40 is reachable within two sprints."*

⛔ **The counting rule:** **any task status change made or observed through the board** — backlog →
in-progress → done, any task — **tallied by the owner**, in the same place as the fallback tally he
already agreed to keep (*§The gate*, **Trial**).

⚠️⚠️ **Record the reasoning, because a bar this broad looks lax without it.** The alternative was to
count **only mover closes**. ⛔ **That was rejected as unreachable, on evidence:** `fkit-architect`
pointed out that **all of Sprint 9 produced 7 closes** — so a 40-close floor would be roughly six
sprints of work, which is not a trial, it is a re-litigation of the gate by arithmetic. ⭐ **40 *status
transitions* is reachable inside the two sprints the floor already requires; 40 *closes* is not.**
⛔ **Anyone who later reads "40" as lax should read this paragraph first: the number was set against a
measured baseline, not chosen for comfort.**

⛔⛔ **DEFECT — this amendment's wording was UNSATISFIABLE. ⭐ REPAIRED THE SAME DAY by *§Amendment 8*.**
~~*"made or observed **through** the board"*~~ required board-originated transitions, but **A is
read-only for the whole trial** (D2), so the count was **zero by construction** and the floor could
never be met. ⭐ **In force: any status change he SEES on the board counts, however it was made.**
⛔ **That is a REPAIR, not a loosening — read *§Amendment 8* before concluding the bar was weakened.**

### Amendment 7 — housekeeping: the board is a summary, and the producer may now cite this ADR directly

The producer mirroring these rulings onto [`sprints/sprint-11.md`](../../sprints/sprint-11.md) does so
**as a summary**, carrying across the rule in *§Read first*, item 3: **this ADR is authoritative, the
board is a summary, and if they differ the ADR wins.**

⭐ **It has been given READ-ONLY access to `decisions/`** — the scoping that caused the earlier
"the gate is not on disk" confusion is fixed at its root. **It can now quote this file rather than
reconstruct it.** ⛔ **Read-only: `decisions/` is still written by the architect alone, and nothing here
changes who writes what.**

## Round 3 — the defect round 2 created, the timeout he refused, and the same defect again

⭐ **Why there is a round 3, and why it is the last.** Round 2 made the gate countable and, in doing so,
**wrote a bar that could not be satisfied**. `fkit-architect` caught it before anyone relied on it
(OQ-8) and raised the trial's missing upper bound alongside it (OQ-7). ⛔ **Both are now ruled. Both are
SELECTED OPTION TEXT.**

### ⛔⛔ Amendment 8 — OQ-8: the counting rule was UNSATISFIABLE. This is a REPAIR, not a loosening

> *"**Any change you SEE on the board counts** — However it was actually made — by an agent, by a mover,
> by hand — if you saw it reflected on the board during the trial, it counts. The only reading
> consistent with what you said when you chose it ('40 is reachable within two sprints') and with the
> board being read-only throughout."*

⛔⛔ **State the defect plainly, because the fix looks like a loosening and is not one.**

**As round 2 worded it**, a status transition had to be *"made or observed **through** the board."*
⛔ **But A is read-only for the entire trial (D2, and the Trial's own clause *"A stays the store
throughout"*). A read-only board originates NO transitions. The count was therefore ZERO BY
CONSTRUCTION, and the floor could never be reached.**

⚠️⚠️ **The circularity, which is the part worth remembering:** the gate for moving to **B** would have
required board-originated writes — **which only exist after B.** ⛔ **The gate would have been
unsatisfiable, the trial would never have ended, and the migration question would have sat open forever
with every bar looking reasonable on paper.**

⭐ **So the rule in force — *any change he SEES on the board counts, however it was made* — is the
REPAIR of a defect, not a relaxation of a bar.** ⛔ **A reader who treats it as a weakened threshold has
it exactly backwards: the previous wording was not stricter, it was BROKEN.** The floor's actual
difficulty is unchanged from what he agreed in *§Amendment 1* — **40 transitions he observed, reachable
inside the two sprints the floor already requires.**

⭐ **Where the defect came from:** round 2's own answers. ⚠️ **A gate made countable is not
automatically a gate that can be counted**, and that is the reusable lesson: after specifying a bar,
check it against the state of the world *during* the window in which it must be met.

### ⛔⛔ Amendment 9 — OQ-7: NO TIMEOUT. ⚠️ He was shown the objection and took the option anyway

> *"**No timeout — the gate just waits** — The literal effect of what you ruled: the trial ends when all
> three are met, whenever that is. Honest and simple. It also means a quiet quarter leaves the decision
> open indefinitely with nobody noticing — which is the 'later becomes never' failure the gate was built
> to prevent, arriving by a different door."*

⛔⛔ **Read that option text again: the objection is INSIDE the option he selected.** ⚠️ **He did not
overlook the risk. It was put in front of him, in the words he chose, and he took it anyway.**
⛔ **Nobody may later present this as an oversight, or as a thing "nobody considered."**

**What was offered and NOT taken — recorded with its reasoning intact:**

> `fkit-architect` recommended **a check-in, not a deadline**: if the floors were not met by roughly
> **12 weeks**, the question returns to him as ***"is A enough, permanently?"*** — the same branch as
> **On a fail**, reached by stall rather than by failure. ⭐ **Its argument was that it cost nothing,
> could not fail him for being slow (which he had explicitly rejected in *§Amendment 5*), and closed the
> only route by which this gate becomes permanent through inaction.**

⛔ **Offered, argued, and declined. The recommendation is preserved here in full so that a future reader
can see the trade was made with both sides on the table.**

#### ⚠️⚠️ The sharpest form of the risk — F5 and a trial that never ends

⛔⛔ **F5 — *"he stopped using it and did not notice"* — is ASKED DIRECTLY AT THE END OF THE TRIAL.
⛔ A trial that never ends never reaches F5.**

⚠️ **So the one FAIL condition designed to catch silent abandonment is itself disarmed by silent
abandonment.** If he quietly stops using the reader, the floors stop accruing, the trial never
completes, its end-of-trial question is never asked — **and the gate neither passes nor fails. It simply
goes quiet**, which is the exact outcome F5 exists to surface.

⭐ **Neither the architect nor the lead had stated this interaction before it was ruled; it is recorded
now because it is the honest shape of what he accepted, not an argument for reopening it.**

⛔⛔ **THE GUARD, and it is now load-bearing: NO AGENT MAY INVENT A TIMEOUT, A DEADLINE, A CHECK-IN, A
REMINDER, OR A REVIEW POINT FOR THIS TRIAL.** ⚠️ **The risk above is real, which is exactly why an agent
"helpfully" adding a deadline would be overriding an explicit owner ruling rather than filling a gap.**
⭐ **The gate waits. That is the decision. It returns to him only through him.**

### ⛔⛔ Amendment 10 — OQ-9: the SAME DEFECT in the clause Amendment 8 did not reach. ⭐ Also a REPAIR

> *"**Planned and closed in fkit, watched on the board** — The sprints run exactly as they do today — in
> fkit's tree, through the movers — and the bar is that you followed them on the board while they ran.
> Matches the repair you just made to the transitions half, and makes the floor reachable while keeping
> what it's actually testing: were you using the board for real work?"*

**The defect, stated before the fix — identical to *§Amendment 8*'s:**

⛔ **Round 1's other half read *"2 sprints planned and closed **through it**."*** *"Through it"* means
**through the board** — which is **read-only for the whole trial** (D2). ⛔ **A read-only board cannot
plan or close a sprint, so this bar was UNSATISFIABLE BY CONSTRUCTION**, and it carried the identical
circularity: **the bar for moving to B required something that only exists after B.**

**⭐ The work floor now reads, both halves, in force:**

| | In force |
|---|---|
| **Sprints** | ⭐ **2 sprints planned and closed IN FKIT'S TREE, through the movers — WATCHED on the board during the trial.** |
| **Transitions** | ⭐ **≥40 status changes SEEN on the board during the trial, however they were made** (*§Amendment 8*). |

⛔⛔ **THE FLOOR'S DIFFICULTY IS UNCHANGED BY EITHER REPAIR.** Both halves still demand **real work over a
real trial** — two whole sprints and forty observed transitions, exactly as agreed in *§Amendment 1*.
⛔ **What changed is that they can now be MET.** ⚠️ **A reader who treats either repair as a weakened
threshold has it backwards, twice: the earlier wordings were not stricter, they were BROKEN.**

#### ⭐⭐ The principle — recorded explicitly, because fixing the wording twice was not enough

⚠️ **Amendment 8 recorded the lesson as *"a gate made countable is not automatically a gate that can be
counted."* That was true and insufficient: the repair fixed WORDING, not the PRINCIPLE behind it, so the
same defect survived in the clause the repair did not reach.** ⭐ **Stated as a rule this time:**

> ⛔⛔ **UNDER A, THE BOARD OBSERVES; IT NEVER ORIGINATES.**
> **Any gate condition phrased as happening *"through the board"* is UNSATISFIABLE during the trial, and
> must be phrased as *observed on the board* instead.**

⛔ **This governs any future amendment to *§The gate* while A is the store.** ⚠️ **It is not a style
note — it is the difference between a bar that can be met and one that cannot.**

#### ⭐ The sweep — every gate condition checked against that principle, 2026-09-18

⛔ **Done because the defect recurred, not because one was suspected. Result: NO further conditions of
that shape.**

| | Checked | Verdict |
|---|---|---|
| **P1–P4, P6** | The Node port, `T-023`, `T-021`, `T-022`, aiboard's membership duplication | ✅ **Clear** — all are aiboard-side work items, none phrased through the board |
| **P5** | Durability: *"the tree is committed at the end of every working session"*; check *"is the tree clean when he is not mid-task?"* | ✅ **Clear** — about fkit's **git tree**, not the board |
| **A1** | Full import-and-diff, byte-level, on the Node port | ✅ **Clear** — an acceptance test run against aiboard, not trial activity |
| **A2** | Write round-trip | ✅ **Clear** — ⚠️ **worth one line for a reader:** A2's **write** is an acceptance test on a **scratch board**, exactly as the 408/408 run was (*§Context 3*). ⛔ **It is not a write to fkit's tree and does not disturb *"A stays the store throughout the trial."*** |
| **Trial** | *"Real work only, on fkit's unmodified tree at full scale"*; *"A stays the store throughout"*; the fallback tally | ✅ **Clear** — observation- and tree-shaped throughout |
| **Work floor** | Both halves | ⭐ **WAS the defect — repaired by *§Amendment 8* and this amendment.** |
| **F1–F5** | Fell back / showed something false / needed changing / performance / stopped using it | ✅ **Clear** — every one is phrased as something he **observes or experiences**, none as something originating on the board |

---

## ⛔ The amendment series is CLOSED

⭐ **Ten rulings in three rounds, all on 2026-09-18, all by the owner. `§The gate` is now complete and
every bar in it is reachable.** ⛔ **No further amendment rounds.** The gate changes only through him,
via *§Re-raise only if*.

### ⚠️ Accepted residuals — named, NOT fixed, and deliberately left alone

**1. `A1`'s corpus figure drifts.**
- **What:** A1 says *"all **404+** briefs"*; the corpus was 405 / 408 / 409 within one day (*§Context 2*)
  and keeps growing.
- **Why it is fine:** A1's substance is **a full byte-level import-and-diff of the corpus as it stands on
  the day the test is run**, not a count. The *"+"* carries that.
- **Re-raise only if:** someone proposes running A1 against a **fixed subset** — that would be a
  different, weaker test.

**2. Nobody is designated to notice when P1 lands and the clock starts.**
- **What:** the trial's clock starts when aiboard's Node port lands (*§Amendment 3*). No agent, hook or
  process watches for it.
- **Why it is fine, and why it must stay unfixed:** ⛔ **P1 is aiboard's work on aiboard's board (D7),
  and only the owner declares the gate passed (D4).** He is the only user of both projects. ⭐ **Anyone
  "helpfully" automating a watch would be inventing exactly the review point *§Amendment 9* forbids.**
- **Re-raise only if:** **he** asks for it.

### ⭐ Process note — how this gate was hardened, recorded plainly because it is part of the evidence

⚠️ **Four defects were caught between the original ruling and this close. ⛔ Three of the four were the
agents' own, and they are recorded here rather than quietly fixed:**

1. ⛔ **An agent's proposed option was unimplementable on the day it was proposed** — see
   *§Authority*, the agent-error section, and the *"adapter"/"seam"* lesson.
2. ⭐ **An external expert's central claim was tested against the real corpus rather than relayed** —
   which is what produced `T-023` (*§Context 3*) and the process note at *§Context 4*.
3. ⛔ **Round 2's own answers created a defect** — the counting rule was unsatisfiable (*§Amendment 8*).
4. ⛔ **The repair for that defect missed the same defect in the neighbouring clause** — this amendment.

⭐ **Each was stated plainly instead of defended, and each correction came back to the owner as a
question rather than being settled by an agent.** ⚠️ **That, and not the polish of this document, is why
the gate is worth anything** — a gate written by agents who defend their previous draft is a gate that
passes itself.

---

## Context

### 1. The two models, in four lines

- **fkit** stores a task as a **folder** under `ai-agents/tasks/`, keyed `<NNNN>-<slug>`
  (ADR-029). Status lives **in the brief** *and* in markdown board tables.
- **aiboard** is a file-based tracker with a browser board where **the folder IS the status**.
- The owner's stated problem all along was that **a human cannot read fkit's board**.
- A full evaluation ran on 2026-09-18
  ([`reports/2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md`](../reports/2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md)),
  reviewed by Codex and then by `fkit-external-expert`
  ([its verdict](../reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md)).
  ⭐ **Both are this ADR's primary sources and neither is edited by it.**

### 2. ⚠️ A counting note, so three different corpus sizes do not read as an error

fkit's corpus **grew during 2026-09-18**. The verdict counted **405** briefs; the import ran over
**408**; the snapshot benchmark ran over **409** tasks. ⭐ **Each figure is quoted at the count its own
measurer stated.** They are not inconsistent; they are hours apart.

### 3. The evidence — measured by `aiboard-lead` on 2026-09-18, against fkit's REAL corpus

⛔ **Attributed, not claimed.** These were measured by `aiboard-lead` in aiboard's own repo, through
aiboard's public API. ⛔ **`fkit-architect` did not run or verify any of them.**

⛔⛔ **Both halves below carry EQUAL WEIGHT. A summary that carries only one of them has misreported
this decision.**

**⛔ T-023 — silent data corruption on exactly fkit's id format.**

- Any **all-digit string** in aiboard front matter is coerced to an integer and written back
  **unpadded**: `"0404"` → `404`, `"0013"` → `13`, `"007"` → `7`.
- ⛔ **No error is raised. A second write does not restore it.**
- ⚠️⚠️ **`0013` becomes `13`, which is a different task of ours.**
- ⭐ **It is precisely the all-digits case — i.e. precisely us.** Emoji, quotes, brackets, backslashes
  and `true`/`false`/`null` all round-trip correctly.
- ⭐ **It is a direct hit on ADR-029:** a store that cannot hold `0013` cannot hold fkit's identity
  model.
- ⚠️ **As a viewer this never mattered. Under B it is corruption waiting for the first write to any
  field carrying an id** — an id field, a `blocked_by` entry, a label, a cross-reference.
- Filed as aiboard **`T-023`** (high) on aiboard's board.

**⭐ 408/408 briefs imported clean — the strongest evidence B is FEASIBLE.**

All **408** real fkit briefs imported into a scratch aiboard board and read back: **0 create errors,
0 titles corrupted, 0 bodies lost** — including emoji-dense, link-heavy, nested-code-fence and 57 KB
briefs. ⭐ **This is why B is a gated destination rather than a wish.**

**⚠️ The quadratic is worse under B, and it scales with SPRINT MEMBERSHIP, not task count.**

408 briefs imported **without** sprints snapshot in **75 ms** — ⭐ **`aiboard-lead` nearly filed that as
reassurance.** With every task sprinted, which is the corpus's shape under B:

> **409 real tasks, all sprinted — `snapshot()` 729 ms, payload 294 KB, browser polls every 3 seconds →
> 24% of every poll interval inside one function.**

⛔ **`T-021` is not a nice-to-have under B.**

**⚠️ Branch-race id allocation — a second copy of a hazard fkit already accepted once.**

aiboard's next id is `max(existing)+1` under a **per-machine lock that does nothing across git
branches**. Two branches allocate the same id, both commit, and they merge with **no textual conflict**
because they are different directories. ⛔ **Under B, fkit inherits a second copy of the hazard ADR-029
already documented and accepted.**

**⛔ There is no undo. Under B a mistake is a data-loss event.**

A status change is a file move. **No transaction log, no trash, no confirmation on destructive paths,
no export.** A mis-drag is reversible only by dragging back, and only if noticed. aiboard's entire
durability story is **the consuming project's version control** — which is not aiboard's, and which
**nobody has committed to running on a schedule.** ⭐ **`aiboard-lead` asked that this be an explicit
dependency before B, not an assumption.** It is **P5** below.

**⚠️ aiboard's own duplication, at 400× scale.** aiboard stores sprint membership **twice** — the
task's `sprint:` field and the sprint's `tasks:` list — reconciled by a checker. ⛔ **It named this
against itself, and it lands directly on the owner's own words:** *"I want to avoid situations where
the duplication is even possible."* It is **P6** below, and the owner kept it as a **blocker**.

### 4. ⭐⭐ The process note that shaped the gate — quoted, because it is why the acceptance test is an import-and-diff

> *"I'd been reasoning about that parser all day and describing it as 'a liability' without once
> feeding it a real corpus. The abstract worry was right and completely useless; ten minutes of your
> actual data produced the specific bug. Under B, the acceptance test for 'aiboard can hold fkit' is a
> full import-and-diff of all 404, not a design review."*
> — `aiboard-lead`, 2026-09-18

⚠️ **It generalises past this project.** The house rule
[`conventions/evidence-before-assertion.md`](../conventions/evidence-before-assertion.md) already says
a claim needs evidence; this adds that ***"I reviewed the design and it looks unsafe"* is not evidence
either.**

---

## Options considered

### Option A — fkit's tree stays the single store; aiboard reads it. ✅ **ADOPTED AS THE INTERIM.**

- **Cost:** near zero. Read-only, writes nothing, changes no stored shape, needs no migration. The
  129-line spike already does it at 37 ms over 405 tasks.
- **What it gives:** the owner's stated problem — *"a human cannot read fkit's board"* — solved now.
- ⛔ **What it does not give:** anything the owner asked for in Ruling 2. Under A, the tasks stay in
  fkit's shape; there is one store, but it is not aiboard's.

### Option B — aiboard becomes the single and only store. ⭐ **ADOPTED AS THE DESTINATION, GATED.**

- **What it gives:** the end state Ruling 2 describes — one store, duplication structurally impossible.
- **Cost:** a whole-corpus migration, fkit's movers/status tooling/skills rewritten to work through
  aiboard, plus everything in *§Context 3* — T-023, the quadratic, the branch race, and no undo.
- ⛔ **Not taken NOW.** Taken as the destination, behind the gate below.

### Option B-now — migrate immediately. ⛔ **Considered and NOT taken.**

Rejected on the evidence, not on taste: an all-digit id is silently destroyed on write **today**, and
that is fkit's entire identity format. ⭐ **Migrating into a store that cannot hold `0013` is the one
irreversible mistake available here**, and the ruling's own last clause — *"nothing irreversible
happens early"* — is exactly this.

### Option "never converge" — the external expert's verdict. ⛔ **Its endpoint OVERRIDDEN by the owner.**

See *§Supersession*. Its path was adopted whole.

---

## Decision

**D1 — If fkit ever depends on aiboard, aiboard is the SINGLE AND ONLY store for tasks and sprints.**
⛔ **Duplication is not a risk to be managed here; it is the thing being forbidden.** Ruling 2 is the
authority, in the owner's own words.

**D2 — B is the destination. A is the interim, and A runs now.** A is read-only, writes nothing, and
changes no stored shape.

**D3 — The move from A to B is GATED** by *§The gate* below: preconditions **P1–P6**, acceptance test
**A1–A2**, a trial, and pre-declared FAIL conditions **F1–F5**. ⛔ **All of it was ruled by the owner
on 2026-09-18**, and **ten further rulings amended it the same day, in three rounds** — the trial's work
floor, P5's owner, the clock start (round 1); P5's cadence, how the trial's three bars combine, the
counting rule, and the board-is-a-summary housekeeping (round 2); and **the repair of TWO unsatisfiable
gate bars** plus **no timeout on the trial** (round 3). ⛔ **The series is CLOSED.** See *§Amendments*. ⭐ **This ADR is the authoritative text of that
gate; a board's copy is a summary** (*§Read first*, item 3).

**D4 — Only the owner declares the gate passed. ⛔ No agent may.** Not by inference, not by tallying
preconditions, not by reporting that the trial window elapsed.

**D5 — "Gate passed" does not authorise the migration.** A **dry run with a byte-hash diff the owner
reads** stands between them. Named separately precisely so the two are never conflated.

**D6 — The gate does not reopen on a schedule if it fails.** See *§The gate*, **On a fail**.

**D7 — None of this obliges aiboard to anything.** The preconditions that live in aiboard's repo are
**external**, referenced and never owned. ⛔ **No fkit task may be filed for `T-021`, `T-022`, `T-023`
or the Node port.**

**D8 — What is NOT decided here** — and must not be read into D1–D7: whether a board may ever **write**
(the `D1` write-back question carried on Sprint 11 — still deferred, and **worse** under B because
there is no undo); the migration's mechanics; the shape of the reader under A; and every open item in
*§Open questions*.

---

## ⭐⭐ THE GATE — ruled by the owner on 2026-09-18, and the most important content in this ADR

⛔ **He chose the FULL gate: preconditions + acceptance test + trial with pre-declared failures.**
⛔ **A later reader must not take a subset of it.**

### Preconditions — all six, all objectively checkable

| | Precondition | Whose work |
|---|---|---|
| **P1** | **The Node port lands** — Node-only, with the **41 tests ported FIRST as the conformance spec** and green, and the **store-adapter seam present**. | aiboard |
| **P2** | **`T-023` closed**, with a **regression test round-tripping `0013` and `0404`**. | aiboard |
| **P3** | **`T-021` closed** (the quadratic snapshot). | aiboard |
| **P4** | **`T-022` closed** (the cross-origin write hole). | aiboard |
| **P5** | **Durability named as an explicit dependency, in writing.** Under B a mis-drag is a file move with **no undo, no trash, no export, no transaction log**, so **someone must own *"the tree is committed on a schedule."*** ⭐ **ASSIGNED AND SPECIFIED 2026-09-18 — see *§Amendment 2* and *§Amendment 4*.** ~~unassigned~~ **Cadence: the tree is committed at the END OF EVERY WORKING SESSION.** **Check: *"is the tree clean when he is not mid-task?"*** ⛔ **Specified ≠ met.** | ⭐ **the owner, personally.** ⚠️ **A personal commitment, not a mechanism — weakness and its live counter-example recorded in *§Amendment 4*.** |
| **P6** | **aiboard's own sprint-membership duplication reduced to ONE source BEFORE migration.** ⛔ **The owner explicitly kept this as a BLOCKER.** After the migration it is 400+ tasks too late. | aiboard |

### Acceptance test — both parts

- **A1 — a full import-and-diff of all 404+ briefs, BYTE-LEVEL, ⛔ ON THE NODE PORT.**
  ⚠️ **Today's clean 408/408 run was Python. It does not discharge A1.**
- **A2 — plus a WRITE round-trip.** ⭐ **T-023 was a write-side bug that a read-only import would never
  have found.** An import-only acceptance test would have passed the very defect that makes B unsafe
  today.

### Trial

⭐ **AMENDED 2026-09-18 — the work floor was restored. See *§Amendment 1*.** The amended text is the
one in force; the superseded text is kept below, marked, and must not be deleted.

**In force — ⛔ ALL THREE required, none substitutes for another:**

- **4 calendar weeks minimum**, ~~calendar only~~ — ⛔ **no longer sufficient on its own.**
- ⭐ **2 sprints planned and closed IN FKIT'S TREE, through the movers — WATCHED on the board during the
  trial.** ⛔⛔ **DEFECT / REPAIRED 2026-09-18 (*§Amendment 10*):** ~~2 sprints planned AND closed
  **through it**~~ required a **read-only** board to originate sprint lifecycle acts — **unsatisfiable by
  construction**, the identical circularity to the counting rule. ⚠️ **A repair, not a loosening: the
  bar is still two whole sprints.**
- ⭐ **≥40 status transitions observed.**

⭐ **How the three combine — AMENDED 2026-09-18, *§Amendment 5*: CONCURRENTLY.** They all start together
at P1 and run in parallel; **the trial ends at `max(4 weeks, 2 sprints closed, 40 transitions)` —
whichever finishes last.** ⛔ **A slow month EXTENDS the trial; it does not fail it.** Failure comes only
from **F1–F5**.

⭐ **What counts as a "status transition" — AMENDED 2026-09-18 (*§Amendment 6*), then REPAIRED the same
day (*§Amendment 8*):** **any task status change the owner SEES on the board during the trial — however
it was made: by an agent, by a mover, or by hand** — **tallied by him** alongside the fallback tally
below. ⛔ **Not restricted to mover closes** — rejected as unreachable (all of Sprint 9 produced 7
closes). ⛔ **And not restricted to board-originated changes** — ~~*"made or observed through the
board"*~~ was **unsatisfiable**, because A is read-only throughout the trial. ⚠️ **The repair restored a
reachable floor; it did not lower one. See *§Amendment 8*.**

⛔⛔ **No deadline. The trial has NO upper bound** (*§Amendment 9*) — it ends when the last of the three
bars is met, whenever that is. ⛔ **No agent may add a timeout, a check-in, a reminder or a review
point.**

And, unchanged from the original ruling:

- **Real work only**, on **fkit's unmodified tree at full scale**.
- ⛔ **A stays the store throughout the trial.** Nothing irreversible happens during it.
- The owner keeps a **fallback tally**: each time he went back to markdown or asked an agent instead —
  when, and why.

⭐ **When the clock starts — AMENDED 2026-09-18, see *§Amendment 3*: at P1, when the Node port lands.**
⛔ **Not on 2026-09-18.** Time on today's Python reader does not count toward the 4 weeks or the work
floor. *"A stays the store throughout"* is untouched — only the start of counting moved.

#### ⛔⛔ The work floor — DECLINED, then RESTORED. ⭐ Both states kept, deliberately

⛔⛔ **SUPERSEDED 2026-09-18 by *§Amendment 1*. Kept in full so the record shows the gate once had this
hole. Do not delete it, and do not quote the struck consequence as current.**

**The original state — true when written:**

A spawned `fkit-producer` proposed pairing the 4 weeks with a **work floor** (2 sprints closed +
40 status transitions), arguing ***"4 idle weeks prove nothing."*** ⛔ **The owner kept the 4 weeks and
did NOT keep the work floor.**

> ⛔⛔ ~~**The consequence, stated plainly and not softened: FOUR QUIET WEEKS NOW SATISFY THE TRIAL.**
> A calendar window with no work in it passes this gate as written.~~
>
> ⛔ **NO LONGER IN FORCE — superseded 2026-09-18.** It was correct for the hours between the two
> rulings. A quiet four weeks now fails the trial on the work floor itself, not on F5 alone.

~~⛔ **No agent may quietly reinstate the work floor**, add a volume threshold, or read one into F1–F5.~~
⚠️ **That prohibition has been discharged, not broken:** `fkit-lead` flagged the consequence to the
owner as **OQ-1** promised, and **he** — not an agent — put the floor back.

**⭐ The current state, 2026-09-18, on reconsideration:** the owner **restored the work floor** after
**two agents independently flagged the same hole** (a spawned `fkit-producer` and `fkit-architect`).
**The trial is now 4 calendar weeks AND 2 sprints planned+closed AND ≥40 status transitions.**
⛔ **The floor is now the owner's own, so no agent may weaken, waive or re-scope it either.** It returns
to being a question only through him.

### Pre-declared FAIL conditions — ⛔ any ONE of them fails the gate

| | Condition |
|---|---|
| **F1** | He **fell back** for **more than half** his status reads. |
| **F2** | The reader showed something **FALSE even once**, unfixed — wrong status, missing task, or a **silently skipped row**. ⚠️ **aiboard already silently skips unparseable ids; that is this exact class.** |
| **F3** | It needed **non-trivial changing each time fkit's shape changed**. |
| **F4** | **Performance made him avoid it.** |
| **F5** | **He stopped using it and did not notice.** ⛔ **No metric catches this, so it is ASKED DIRECTLY at the end.** |

### On a fail

⛔ **The gate does NOT reopen on a schedule.** **A becomes the standing answer**, and the question
returns to the owner as ***"is A enough, permanently?"*** ⚠️ That is a question for him, not a timer.

### On a pass

⛔ **Migration still does not start.** A **dry run with a byte-hash diff the owner reads** comes first.
⭐ **Named separately so *"gate passed"* is never read as *"migration authorised."***

### Who declares it

⛔⛔ **Only the owner. No agent.** (D4.)

---

## Supersession — `fkit-external-expert`'s verdict, on the ENDPOINT only

⚠️ **Precision matters here, because the verdict is not wrong.** Under its heading
*"0. The verdict in six lines"* it opens:

> *"Do not converge the two storage models. Not now, not staged, not as a goal."*

| | The verdict said | The owner ruled |
|---|---|---|
| **The path** | Adapter first, read-only; *"Converge the view contract instead"* | ⭐ **ADOPTED** — that is A, and A runs now |
| **The endpoint** | **No storage convergence, ever** | ⛔ **OVERRIDDEN** — B is the destination, gated |

⛔ **Record it that way and no other way: adopted on the path, overridden on the destination.**

⛔ **The verdict's file is NOT edited, and must not be.** A report is the record of what its author
concluded; editing it would make the record say something its author did not say.

⚠️ **Carry the verdict's own self-caveat forward with it**, from its heading *"6. Where I think each
party is wrong"*:

> *"I have a bias toward not building, and this verdict is what that bias produces."*

⭐ **The owner weighed exactly that and took the endpoint the other way.** That sentence is why the
override is a judgement rather than a dismissal, and a reader who sees the override without it is
missing half of what happened.

⚠️ **Its owner-decision #1 is therefore ANSWERED, and answered NO on its first clause** — it asked him
to *"Accept 'no storage convergence'"*, and he did not. ⭐ **Its other two clauses survive** and are
what Sprint 11 now is.

---

## ⛔ What this ruling unblocks, and what it does not

**What it DOES do:**
- Settles the **direction**: one store, and if aiboard is ever the dependency it is that store.
- Makes **A startable now** — it writes nothing and changes no stored shape.
- Replaces an **undefined** gate (carried as `D4` on Sprint 11) with a **defined** one.

**What it does NOT do:**
- ⛔ **It authorises no migration.** No id re-keyed, no task or sprint folder moved, no board rewritten.
- ⛔ **It authorises no write path.** A is read-only by definition; whether a board may ever write is
  still deferred (D8), and ADR-049's read-only interim posture is untouched.
- ⛔ **It writes nothing into aiboard's repo, and files no fkit task for aiboard's work** (D7).
- ⛔ **It does not declare any precondition met.** None of P1–P6 is declared satisfied as of
  2026-09-18. ⚠️ **Including P5:** *§Amendment 2* **assigns** its owner, which is what OQ-2 asked; it
  does **not** declare the precondition discharged. ⛔ **Only the owner declares any of them met (D4).**
- ⛔ **It does not start the trial clock, and the clock has not started.** ⭐ **OQ-3 is now answered
  (*§Amendment 3*): the clock starts at P1, when the Node port lands.** P1 is not met, so as of
  2026-09-18 **zero of the 4 weeks, zero of the 2 sprints and zero of the 40 transitions have accrued.**

---

## Consequences

**Positive**
- The largest ruling of 2026-09-18 is in the decision record, where a future agent looks first, instead
  of only on a board that gets archived and briefs that move.
- The gate is **objectively checkable** on five of its six preconditions and on both halves of the
  acceptance test. *"Later"* now has a definition.
- A delivers the owner's actual complaint — a readable board — **immediately**, at read-only risk.
- ⭐ **B is a real destination with real evidence behind it** (408/408 clean), not an aspiration.

**Negative / costs — stated plainly**
- ⛔ ~~**The trial is four calendar weeks with NO work floor, so four quiet weeks satisfy it.** That is
  the owner's deliberate choice, recorded as such; it is also a hole in the evidence the trial is
  supposed to produce, and F5 (*"stopped using it and did not notice"*) is the only thing pointing at
  it — and F5 is a question asked at the end, not a measurement.~~
  ⛔ **NO LONGER IN FORCE — superseded 2026-09-18 (*§Amendment 1*).** The owner restored the work floor;
  the trial now needs **2 sprints planned+closed and ≥40 status transitions** as well as the 4 weeks, so
  a quiet window no longer passes. ⭐ **Struck, not deleted: this cost was real between the two rulings,
  and a future reader should see the hole and its closure.**
- ⭐ **The cost that replaced it — the trial is now harder to satisfy, and starts later.** It needs real
  volume, and its clock does not start until aiboard's Node port lands (*§Amendment 3*), which fkit
  cannot schedule (D7). ⛔ **The whole gate is now waiting on another project's roadmap for its very
  first day.**
- ⚠️⚠️ **P5 has an owner and a cadence, but still no mechanism.** Durability rests on **the owner's
  personal commitment** to commit the tree **at the end of every working session**
  (*§Amendment 2*, *§Amendment 4*). ⛔ **P5 is now checkable — *"is the tree clean when he is not
  mid-task?"* — but it is a promise, not an automation, and under B a lost commit is lost data with no
  undo.** ⛔⛔ **And it was already being broken when it was made:** the session that recorded it held a
  full day's work uncommitted, 22+ paths, nothing since `v0.3.1` — the weakness he accepted in his own
  chosen words, *"the same guarantee that's currently produced a full day of uncommitted work."*
  ⭐ **Recorded next to the promise on purpose; see *§Amendment 4*.**
- ⛔⛔ **The trial has NO upper bound, and this is now RULED, not open** (*§Amendment 9*; ~~OQ-7~~).
  Its three bars run concurrently and it ends when the last one is met (*§Amendment 5*), so a quiet
  stretch does not fail the trial — **it postpones the gate indefinitely.** ⛔ **The gate can stall
  without ever failing, and nothing in this ADR times it out.** ⚠️⚠️ **Sharpest form: `F5` — *"he
  stopped using it and did not notice"* — is asked at the END of the trial, so a trial that never ends
  never reaches F5. The one condition built to catch silent abandonment is disarmed by silent
  abandonment.** ⭐ **He was shown this trade in the option text he selected — *"a quiet quarter leaves
  the decision open indefinitely with nobody noticing"* — and took it anyway.** A 12-week check-in was
  offered and declined (*§Amendment 9*). ⛔ **The risk stays on the record; the timeout does not get
  invented by an agent.**
- **The gate depends on another project's roadmap.** P1–P4 and P6 are aiboard's work on aiboard's
  board. fkit cannot schedule them and must not try.
- **Under B fkit inherits the branch-race id hazard a second time**, having already accepted it once
  (ADR-029).
- **Under B there is no undo**, which makes the still-deferred write-back question strictly worse: a
  forged close that is also irreversible is not a governance bug with a repair path, it is data loss
  with a governance bug on top.
- **Two ADRs now describe a system that does not exist yet** — this one and ADR-050. ⛔ Neither is a
  work order.

**Residual — named, not solved**
- ⛔ **T-023 is live today.** Until P2, aiboard cannot hold fkit's ids on a write.
- ⭐ ~~**Durability has no owner** (P5, OQ-2).~~ **RESOLVED 2026-09-18 — the owner owns it personally
  (*§Amendment 2*), committing at the end of every working session (*§Amendment 4*).** ⚠️ **The residual
  did not disappear, it changed shape:** durability now depends on one person keeping that cadence, with
  **no undo, no trash, no export and no transaction log** behind it — ⛔ **and the promise's first
  recorded test, the same day, was a failure** (*§Amendment 4*).
- **fkit is still not transactional** (ADR-050 §Consequences — Residual), and neither is aiboard.

---

## Re-raise only if

- **The trial fails on any of F1–F5** → that is not a re-raise, it is the **On a fail** branch: A
  becomes the standing answer and the owner is asked *"is A enough, permanently?"*
- **A precondition turns out to be unachievable** in aiboard (for example T-023 cannot be fixed without
  breaking aiboard's own format) → reopen B's feasibility, with that finding as the evidence.
- **The owner revises the trial** (OQ-1) → amend *§The gate*, **Trial**, in place; ⛔ **do not restate
  the gate anywhere else**, or there will be two of them. ⭐ **He did revise it on 2026-09-18** — the
  work floor is back (*§Amendment 1*), and that is exactly how a revision is recorded: annotated in
  place, both states legible.
- ⛔ **Do NOT re-raise** *"he only chose B because he misunderstood the adapter"*. That was corrected
  in the same session and **he held the principle anyway** — *§Authority*, the agent-error section.
- ⛔ **Do NOT re-raise** the external expert's *"no convergence, ever"* as though it were unweighed. It
  was read, adopted on its path, and overridden on its endpoint, with its own self-caveat in view.
- ⛔ **Do NOT re-raise** the work floor ~~as an agent proposal. It was put to the owner and he declined
  it. It returns only through him (OQ-1).~~ ⭐ **AMENDED 2026-09-18 — it came back through him and is
  now IN FORCE** (*§Amendment 1*). ⛔ **Do not re-raise it in the other direction either:** no agent may
  propose dropping, lowering or waiving the 2 sprints / 40 transitions. Both the decline and the
  restoration were his.
- ⛔ **Do NOT re-raise** P5's owner or its cadence as open slots. Both were put to him: he took the
  ownership personally (*§Amendment 2*) and named the cadence — **end of every working session**
  (*§Amendment 4*) — declining the named-role/automation and the aiboard-side undo/export alternatives.
  ⭐ **DO re-raise it on evidence**, and the bar for that evidence is low and specific: **the tree
  repeatedly not clean when he is not mid-task.** ⚠️ **That is not re-litigating his choice; it is the
  check he himself defined, and *§Amendment 4* records that its first test already failed.**
- ⛔ **Do NOT re-raise** the trial's combination rule or the counting rule. Both were put to him:
  concurrent, ending at the last bar met (*§Amendment 5*), and **any status change he sees on the board,
  however made**, tallied by him (*§Amendment 6* as repaired by *§Amendment 8*). ⛔ **No agent may narrow
  "status transition" to mover closes** (rejected as unreachable on measured evidence) **or back to
  board-originated changes** (that wording was unsatisfiable).
- ⛔⛔ **Do NOT re-raise the trial's missing deadline, and do NOT quietly supply one.** It was put to him
  with the objection inside the option he chose, a 12-week check-in was offered and declined, and he
  ruled **no timeout** (*§Amendment 9*). ⚠️ **Knowing the risk — including that a trial which never ends
  never reaches F5 — is not new evidence; it is what he already accepted.** ⭐ **The only thing that
  reopens this is him.**
- ⛔ **Do NOT re-raise** when the trial clock starts. Answered: **at P1** (*§Amendment 3*). Re-raise only
  if P1 itself becomes unachievable, which is the precondition branch above.

---

## Open questions — ⛔ for the owner, not for an agent to settle

⭐⭐ **ALL NINE OF OQ-1 … OQ-9 WERE ANSWERED BY THE OWNER ON 2026-09-18 — see *§Amendments*.**
⛔ **The amendment series is CLOSED; every bar in *§The gate* is now reachable.**
⛔ **The questions are kept, struck, so a reader sees what was open and what closed it.**
⚠️ **OQ-4, OQ-5 and OQ-6 did not exist in the original text:** `fkit-architect` raised them *after*
round 1, because round 1's answers were under-specified. ⭐ **Recorded so the sequence is legible — the
gate was made checkable in three passes, not one.** ⛔ **OQ-7 and OQ-8 were raised by round 2's own
answers and are now ruled too (round 3), as is OQ-9 — the same defect as OQ-8, in the clause the first
repair did not reach.** ⭐ **Nothing gate-breaking remains open.** Item 10 is carried, unrelated, and not
this ADR's; two accepted residuals are named at *§The amendment series is CLOSED*.

1. ✅ **OQ-1 — ANSWERED.** ~~**HIS. The trial: 4 calendar weeks with no work floor.** ⚠️ **Flagged to
   him by `fkit-lead`; he may revise.** As written, four quiet weeks pass the trial. The declined
   proposal was *2 sprints closed + 40 status transitions*.~~ ⭐ **He revised it: the work floor is
   BACK.** The trial is **4 weeks AND 2 sprints planned+closed AND ≥40 status transitions**
   (*§Amendment 1*).
2. ✅ **OQ-2 — ANSWERED.** ~~**HIS. Who owns P5's durability commitment?** The precondition says
   *"someone must own 'the tree is committed on a schedule'"* and **names no one**.~~ ⭐ **The owner
   owns it personally** (*§Amendment 2*). ⚠️ **P5 is now checkable — but on a personal commitment, with
   the accepted weakness that it is the same guarantee that produced a full day of uncommitted work.**
3. ✅ **OQ-3 — ANSWERED.** ~~**HIS. When does the trial clock start?**~~ ⭐ **At P1 — when the Node port
   lands** (*§Amendment 3*). *"A stays the store throughout"* is unchanged; only the start of counting
   moved. ⛔ **The gate now waits on aiboard's port before its first day can accrue.**
4. ✅ **OQ-4 — ANSWERED. Raised by `fkit-architect` after round 1: P5 had an owner but no cadence**, so
   *"either there's a commit cadence or there isn't"* had no threshold. ⭐ **He ruled that assignment
   alone does NOT discharge P5, and named the cadence: the tree is committed at the END OF EVERY WORKING
   SESSION**, checked as *"is the tree clean when he is not mid-task?"* (*§Amendment 4*).
   ⛔ **Specified is not met.**
5. ✅ **OQ-5 — ANSWERED. Raised by `fkit-architect`: must the 2 sprints and 40 transitions land INSIDE
   the 4 weeks, or does the trial end when all three are met?** ⭐ **Concurrent — the trial ends at
   `max(4 weeks, 2 sprints, 40 transitions)`** (*§Amendment 5*). ⛔ **A slow month extends the trial; it
   does not fail it.**
6. ✅ **OQ-6 — ANSWERED. Raised by `fkit-architect`: what counts as a "status transition", and who
   tallies?** ⭐ **Any task status change made or observed through the board, tallied by the owner**
   alongside the fallback tally (*§Amendment 6*). ⛔ **Mover closes only was rejected as unreachable —
   Sprint 9 produced 7 closes in total.**
7. ✅ **OQ-7 — ANSWERED, and answered AGAINST the architect's recommendation.** ~~The trial now has no
   upper bound … no branch for *"the trial never finished."*~~ ⭐ **Ruled: NO TIMEOUT — the gate just
   waits** (*§Amendment 9*). ⚠️ **The risk did not go away, it was accepted:** a quiet quarter leaves
   the decision open indefinitely, and **a trial that never ends never reaches F5**. The offered
   12-week check-in is recorded as declined. ⛔ **No agent may add a timeout, deadline, check-in,
   reminder or review point.**
8. ✅ **OQ-8 — ANSWERED, and it was a DEFECT, not an ambiguity.** ~~Does a change made in fkit's tree
   and merely SEEN on the board count toward the 40?~~ ⛔ **Round 2's wording required board-originated
   transitions while the board is read-only all trial — zero by construction, so the gate for B
   required something only possible after B.** ⭐ **Ruled: any change he SEES on the board counts,
   however it was made** (*§Amendment 8*). ⛔ **A repair, not a loosening.**
9. ✅ **OQ-9 — ANSWERED, and it was a DEFECT, not an ambiguity — the SAME one as OQ-8.** ~~The work
   floor's other half reads "2 sprints planned AND closed *through it*" … unsatisfiable exactly as the
   counting rule was.~~ ⭐ **Ruled: 2 sprints planned and closed IN FKIT'S TREE, through the movers,
   WATCHED on the board** (*§Amendment 10*). ⛔ **A repair, not a loosening — the bar is still two whole
   sprints.** ⭐ **The principle behind both repairs is now recorded as a rule, and the whole gate was
   swept against it: no further condition has that shape.**
10. 🔲 **Carried, not new — the Sprint 11 open decisions this ADR does not touch:** `D1` (write-back /
   forged close — still deferred, and worse under B), `D2` (is `Sprint 11` the right identity for that
   board), `D3` (cross-project read access), `D5` (whether `0383`'s hold is lifted).

⚠️ **Housekeeping, for the producer and not for the owner:** Sprint 11 still carries **`D4` as OPEN**
(*"WHAT ARE THE CONCRETE GATE CRITERIA FOR B?"*), and task `0404`'s brief still records *"An ADR
recording this ruling — it does not exist."* ⭐ **Both are now out of date: D4 is ruled here, and the
ADR exists.** ⛔ **This ADR did not update them** — `ai-agents/tasks/` and `ai-agents/sprints/` were
being written by another agent at the time, and reconciling them is the producer's act, not the
architect's. ⭐ **That producer now has READ-ONLY access to `decisions/`** (*§Amendment 7*), so it can
quote this file rather than reconstruct it — and its board copy is **a summary of an authoritative text
that lives here**.

---

## Related

- [`sprints/sprint-11.md`](../../sprints/sprint-11.md) — where the ruling was first recorded, its four
  tracks, and open decisions `D1`–`D5`. ⛔ **Its copy of the gate is a SUMMARY.** This ADR is the
  authoritative text — see *§Read first*, item 3. If they differ, the board is what gets corrected.
- [`tasks/backlog/0404-…/brief.md`](../../tasks/done/0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md)
  — the re-scoped evaluation task (A's reader is what it now is), and the preserved spike under its
  `assets/external-expert-spike/`.
- [`tasks/backlog/0405-…/brief.md`](../../tasks/backlog/0405-investigate-a-terminal-ui-for-the-board-and-compare-it-against-the-web-board/brief.md)
  — the terminal-UI question; the verdict's §5 puts it **after** the port, as a second thin consumer of
  the same snapshot contract.
- [`reports/2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md`](../reports/2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md)
  — the evaluation, with Codex's review folded in at its §8.
- [`reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md`](../reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md)
  — the verdict this ADR partially supersedes. ⛔ **Not edited.**
- [ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) — the permanent four-digit id
  T-023 destroys, and the branch-race hazard B would duplicate.
- [ADR-049](adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md)
  — what a close may claim; its read-only interim posture, untouched here.
- [ADR-050](adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed.md) — the deterministic
  command a board-originated write would have to call. ⛔ **Decided, not built.**
- [`conventions/evidence-before-assertion.md`](../conventions/evidence-before-assertion.md) — the house
  rule `aiboard-lead`'s process note extends.
- **Wiki:** **fkit-wiki** should ingest this ADR and resync any vault page asserting that fkit and
  aiboard will not converge, or that the gate is undefined. ⛔ **An architect never writes the vault**
  ([ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

---

## ⭐ For a reader a year from now — the one paragraph to keep

On 2026-09-18 the owner was asked whether fkit's tasks should stay in fkit's tree with aiboard merely
reading them, or move into aiboard entirely. An external expert had just spent a day arguing, with
measurements, that they should never converge — and had said of itself *"I have a bias toward not
building, and this verdict is what that bias produces."* The owner read it, adopted its path, and
rejected its endpoint, for one reason he typed himself: **two stores means asking "which one is right"
forever, and he would rather have one.** He did not, however, agree to move now. The same day, someone
finally ran fkit's real briefs through aiboard instead of reasoning about them — and found that
aiboard silently turns `0013` into `13`, which is a different task of ours, while every one of 408
briefs otherwise imported perfectly. **Both facts are the decision.** The destination is one store; the
gate is the list of things that must be true before a corpus of four hundred tasks is moved into a
program that, on the day it was chosen, could not hold their names.

⭐ **Later that same day he tightened his own gate three times** (*§Amendment*): he **put back a work
floor he had declined hours earlier** — because two agents, separately, told him a four-week window
with no work in it proves nothing; he **took durability on himself personally**, accepting out loud
that it is the same promise that had just left a full day of work uncommitted; and he **moved the
trial's start to the day aiboard's Node port lands**, so the trial would test the thing he would
actually migrate to. ⛔ **Each of the three made the gate harder or later. None of them made it easier.**

⭐ **Then he was asked three more questions, because the first three answers could not yet be counted** —
and he answered those too: the trial's bars **run together and it ends when the last one is met**; a
**status transition** is any status change he sees on the board, tallied by him; and durability means
**the tree is committed at the end of every working session.** ⚠️ **The last one is worth remembering
exactly as it happened: he made that commitment on a day when this repo had twenty-two paths of
uncommitted work sitting in it, and said so in the same breath.** ⛔ **That is recorded beside the
promise on purpose** — so that whoever next asks *"is P5 actually being kept?"* starts from evidence
rather than from the fact that it is written down.

⭐ **A third round found something worse and then something he refused to fix.** Making the gate
countable had accidentally made it **uncountable**: the counting rule required changes to originate on a
board that is read-only for the whole trial, so the gate for moving to aiboard required something that
only exists after moving to aiboard. **That was caught before anyone relied on it and repaired.** Then
he was asked whether a trial with no deadline should have one, was shown the objection in the option he
picked — *"a quiet quarter leaves the decision open indefinitely with nobody noticing"* — and chose
**no deadline anyway**, declining a check-in that would have cost nothing. ⛔ **So the last thing to know
about this gate is the honest one: `F5` asks at the end whether he stopped using the board without
noticing, and a trial that never ends never gets to ask.** ⚠️ **He knows. It is his call, and no agent
may quietly put a timer on it.**

⭐ **One last thing, and it is the reason to trust the rest.** The same defect that made the counting
rule unmeetable was still sitting in the sentence next to it, in a clause the repair had missed — **the
gate for leaving fkit's tree required two sprints to be closed through a board that cannot close
anything.** It was found, said out loud, and fixed, and then **the whole gate was swept for the same
shape.** ⚠️ **Three of the four defects caught here were made by the agents who wrote this document, not
by anyone else.** ⛔ **That is recorded on purpose:** a gate whose authors defend their previous draft is
a gate that passes itself.
