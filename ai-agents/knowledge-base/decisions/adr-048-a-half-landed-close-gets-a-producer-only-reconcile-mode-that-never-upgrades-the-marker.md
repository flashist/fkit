# ADR-048: A half-landed close gets a producer-only reconcile mode — it copies only the agent-closed value, and never upgrades the marker

- **Status:** accepted — owner sign-off 2026-09-14, verbatim label ***"Approve all C1–C10 (Rec)"***,
  together with the owner's new loop rule ***"Add the rule to ADR-048 (Rec)"*** (§The three carve-out
  sites). Until then it was `proposed`, per the owner's review ruling ***"'proposed' until you sign
  (Rec)"***. Both sign-off rows are in §Owner sign-off.
- **Date:** 2026-09-14
- **Deciders:** **owner (Mark Dolbyrev)** — the decision (2026-09-13) and its five sub-rulings plus plan
  approval (2026-09-14), all via `AskUserQuestion` in live `fkit lead` sessions; verbatim labels in
  §Owner sign-off. **fkit-architect** — written as the Build step of `/fkit-sprint-ship-loop`
  (Sprint 9), spawned on a named owner Route ruling (ADR-037 §3), with **no owner channel**.
  **fkit-coder** — the Process-review step of the same loop, fixing review findings R1–R11 of `0134`'s
  review ledger under the standing plan approval and the owner's review rulings, also with no owner
  channel. Every point not covered by a ruling is marked *architect's call* where it is made; a call
  added at Process-review is tagged with its finding. **The owner signed off the final text** on
  2026-09-14 — all ten calls (C1–C10) approved, plus one new owner rule — via `AskUserQuestion` in a
  live `fkit lead` session; **fkit-architect** recorded that sign-off on a named owner Route ruling
  (ADR-037 §3), again with no owner channel.
- **Recorded under:** task `0134`
  ([brief](../../tasks/done/0134-decide-the-sanctioned-repair-path-for-a-half-landed-close/brief.md)).
  **Implemented by:** task `0135`
  ([brief](../../tasks/backlog/0135-add-producer-only-reconcile-mode-to-task-done/brief.md)).
- **Measured at:** commit **`d8ef596`**, 2026-09-14. The working tree was dirty. Of the files this ADR
  cites by line, only `claude/skills/fkit-sprint-ship-loop/SKILL.md` differs from that commit: a
  2-line swap of two dashboard paths near its top, which moves no line number cited here.
  `fkit-task-done`, `fkit-task-cancelled` and `fkit-task-ship-loop` `SKILL.md` are clean against it.
- **Citation form.** Skill files are cited by `path:NNN` plus a quoted fragment. Briefs, boards and
  other ADRs are cited by heading plus a quoted fragment, never by line
  ([`durable-citation-anchors.md`](../conventions/durable-citation-anchors.md)).
- **Amends nothing.** ADR-033 is cited, not changed, and gets no dated note (§Consequences).

> **In one line:** once a close has moved a task folder into `done/`, a **producer** — spawned or
> not — may copy a landed **`✅ Done (agent-closed — not owner-verified)`** onto the locations still
> reading open work. It does so only when a real disagreement exists, and it never writes plain
> `✅ Done`, never upgrades the marker, and never moves a folder.

## Context

### The gap

A **half-landed close** is a close that moved the task folder into `ai-agents/tasks/done/` but left
at least one status location reading open work. Measured at `d8ef596`:

- `/fkit-task-done` step 1 **stops** on a folder already in `done/`
  (`claude/skills/fkit-task-done/SKILL.md:81`, *"it is already in `ai-agents/tasks/done/` (nothing to
  do — say so)"*).
- **Exception 1**, the owner-verification upgrade (`:81-85`), is owner-only: *"An agent hitting this
  case still stops: only the owner can upgrade."*
- **Exception 2**, the contradicted-close repair shipped by task `0229` (`:86-110`), is owner-only:
  *"never fire for a non-owner identity — a producer **spawned** to close is an agent (ADR-033 §5)
  and stops here"*. It fires only when the brief reads open work **and** a row whose Brief cell links
  the folder reads **plain** `✅ Done`. It never moves a folder.
- `✅ Done` is skill-gated. It may never be hand-edited (`claude/skills/fkit-task-done/SKILL.md:446`,
  *"It may be set **only** by this skill — never by hand-editing a file"*).
- `🔄 In progress` and `🚧 Blocked` are free to set by hand
  ([`task-status-vocabulary.md`](../conventions/task-status-vocabulary.md), §"The authority split",
  *"`In progress` and `Blocked` are free"*). So the loops' `🚧 Blocked — hand-off incomplete` marker on
  an already-closed folder is lawful.
- When the brief reads plain `✅ Done` and a row is stale, **neither exception fires**. That blocks
  the owner too.

So every half-landed close after a **spawned** producer's close (always agent-closed, ADR-033 §5)
reaches a human, even when the landed value is already on disk.

### Where it came from

Task `0123`'s review found it: **R1**, with **R6** as its follow-on
([ledger](../../tasks/done/0123-route-sprint-ship-loop-close-to-producer/review.md)). Both ship-loops
now state the limit honestly. The half-landed branch marks only the stale location, leaves the landed
`✅ Done` alone, and escalates:

- sprint-loop §4 (`claude/skills/fkit-sprint-ship-loop/SKILL.md:294-309`), exit row `:337`, carve-out
  `:343-347`;
- task-loop (`claude/skills/fkit-task-ship-loop/SKILL.md:117-120`, `:188-201`, `:211-214`), exit row
  `:277`.

### The ruling and its stated reason

On **2026-09-13** the owner chose ***"Producer-only reconcile mode (Rec)"***. Its record is `0134`'s
brief, under *"DATED CORRECTION 2026-09-13 — OWNER RULING"*. The owner's reason, from that record:
*"The artifact of worth is the constraint list, not the feature."* **This ADR is written to that
reason.** The must-never list (Q4) and the detection rule (Q5) are the deliverable. The mode is what
they constrain.

## Decision

### Q1 — Does the mode exist at all?

**Yes.** Owner, 2026-09-13, verbatim: ***"Producer-only reconcile mode (Rec)"***. The option *keep it
owner-only* is rejected (§Options considered). `0135` is not cancelled.

### Q2 — Who may invoke it?

**Producer-only**, the same rule as ADR-033 §Decision 1. It needs no new grant, because
`/fkit-task-done` is already producer-only and hook-enforced. **A spawned producer qualifies.** That is
**the whole point**: the ship-loops' spawned producer can finish what it started without a human. It
is also **the whole risk**: the identity that left the close half-done is the one allowed to finish
it, with no owner in the loop. The Q4 list and the Q5 rule are what bound that risk.

### Q3 — What it MAY write

The mode writes **exactly one status value**: `✅ Done (agent-closed — not owner-verified)`. It
writes it **only when that is the landed value** (ruling D1, ***"Agent-closed value only (Rec)"***).

- ⭐ **It copies. It does not resolve.** The mode ignores the skill's *"Resolve the status value
  FIRST"* table (`claude/skills/fkit-task-done/SKILL.md:56-69`). An owner-present producer running
  the mode also writes the agent-closed value. Upgrading it stays exception 1's separate, explicit
  act. *(Architect's call, forced by ruling D1(a), "Agent-closed value only (Rec)", with D1(c)'s
  owner-present sub-path not chosen, and by must-never 3. Basis corrected at Process-review, R7:
  must-never 1 forbids upgrading an existing marker, and writing onto an open-work location is not
  that. §Consequences records what this means for the owner.)*

**When Q5 fires, it may write:**

1. **Status locations reading open work** (`🔲 …`, `🔄 …`, `🚧 …`, including the loops'
   `🚧 Blocked — hand-off incomplete: …`) are set to the landed value. That covers:
   - the brief's `## Status` (when the board side landed);
   - a status-table row's leading cell whose Brief cell links this folder (when the brief side landed);
   - an epic slice Status cell, and an in-body `**Status:**` line, each by Q5's attribution test.

   The rest of each such status line follows step 5's existing rules for that kind of line
   (`claude/skills/fkit-task-done/SKILL.md:171` onward): the table's existing done-row format, and
   trimming a now-stale fragment such as `*(blocked: …)*`.
2. **Pointers broken by this folder's move** are repaired, as a side effect. Each is one of step 5's
   pointer repairs, *"change nothing else on the line"*:
   - hrefs step 4's grep reaches that still name this folder under a board other than `done/` —
     normally `backlog/`, but step 3 allows other boards (`:131`) — including the href inside a
     `➡️ Moved …` row;
   - the moved folder's own outbound sibling links (`:206-214`);
   - the moved folder's own self-locators (`:216-227`).

   **A link is not a status** (ruling D2, ***"Links aren't statuses (Rec)"***):
   - A stale href **on its own** does not trigger the mode.
   - With every status agreeing, a stale href is an ordinary pointer repair. It is skill-less
     coordination-doc repair, the coder's under ADR-044 §Decision 1. The mode does not do it.
   - The loops' wording *"a status or href is stale → owner-only"* is wrong about hrefs. `0135`
     corrects it.

**The boundary with the rest of steps 5 and 7.** *(Architect's call, R5.)* Items 1 and 2 are the
whole write set. In particular:
- **Not written:** the epic's *"next slice" / ordering* prose (`:180-181`). It is neither a status nor
  a pointer. Pointing it at "the genuinely-next" slice is a judgment a close makes, not a copy.
- **Still run:** `node --test test/reference-integrity.test.js`, unconditionally, as step 5 requires
  (`:343-344`), with step 5's rules for reading a red. Its one repair that belongs to the mover — a
  link the move broke — covers links broken by the move being reconciled. Must-never 9 still bars
  editing the guard.
- **Reported:** step 7's `Moved:` line (`:393-394`) gains a third value,
  `Moved: none — reconcile mode; folder already in done/`.

**Written against the brief's candidate set.** The brief listed three candidates under *"What it MAY
write"*:
- *"a sprint-row status cell that disagrees with a landed `✅ Done` in the brief"* is **in**, when the
  landed value is agent-closed.
- *"a stale href left pointing at `backlog/`"* is **in only as a side effect** (D2).
- *"the brief's own `## Status` when the board is the side that landed"* is **in**, when the landed
  value is agent-closed. When the landed value is plain, it stays exception 2's owner-only case
  (§`0229`'s exception).

### Q4 — What it MUST NEVER do

⛔ **The two conditions the owner approved the mode on**, quoted verbatim from `0134`'s brief under
*"The two constraints the owner accepted the option **on**"*. They are conditions of the approval,
not commentary:

> 1. **The mode MUST REFUSE when both locations already agree.** A run with no live disagreement
>    between the brief and the board is **not** a half-landed close and the mode must decline it. The
>    disagreement is the precondition, not merely the motive.
> 2. **The mode MUST NEVER upgrade the agent-closed marker.** `✅ Done (agent-closed — not
>    owner-verified)` must never become plain `✅ Done` through this mode. That upgrade is the owner's
>    single act of verification and stays owner-only.

**The must-never list.** `0135` carries it into the skill prose **verbatim**, as its brief requires
(*"carries the ADR's **must-never** list verbatim in its own prose"*). A paraphrase would
re-open the one part the owner said was worth having (*"The artifact of worth is the constraint
list"*):

1. ⛔ **Never upgrade `✅ Done (agent-closed — not owner-verified)` to plain `✅ Done`, anywhere, for
   any identity.** *(Owner constraint 2.)*
2. ⛔ **Never run when all status locations already agree.** Refuse and report what each reads.
   *(Owner constraint 1.)*
3. ⛔ **Never write plain `✅ Done`.** A plain landed value → refuse and route to the owner.
   *(Ruling D1.)*
4. ⛔ **Never create a `✅ Done` when no landed close exists.** That is a close. It starts from
   `backlog/` through the ordinary mover.
5. ⛔ **Never touch a folder that is not under `tasks/done/`, and never move a folder.**
6. ⛔ **Never downgrade an owner-closed plain `✅ Done`.** Any location reading plain `✅ Done` means
   refuse (item 3), so the mode never writes over one.
7. ⛔ **Never pick a winner when landed locations disagree with each other** (for example, one row
   plain and another agent-closed). Refuse and report both.
8. ⛔ **Never overwrite a `⛔ Cancelled …` or `➡️ Moved …` cell.** A Moved row gets pointer repair
   only.
9. ⛔ **Never write `ai-agents/wiki-vault/`** (ADR-005), and **never edit
   `test/reference-integrity.test.js`**. The existing step-5 rule, *"you may run this guard, you may
   not edit it"*, applies unchanged.
10. ⛔ **Never propagate without the provenance disclosure.** Every report where the mode fired
    carries **"landed close propagated; its provenance not checked"** (Q7).

### Q5 — The detection rule

**Locations:**
- the brief's `## Status`;
- every status-table row whose **Brief cell links this task's folder** (the discriminator exception
  2 already uses, `claude/skills/fkit-task-done/SKILL.md:90-92`: *"a prose mention, a quoted specimen
  row, or another task's row that merely cites this folder in its description is not a landed
  close"*);
- every epic slice Status cell for this task — **only** in the epic file the brief's
  `## Parent / Epic` names, and **only** on a slice row that links this task's folder;
- every in-body `**Status:**` line for this task — **only** inside a sprint-plan body section that
  links this task's folder and no other task's folder.

**Attribution is by link, never by nearness** — the same discriminator as the row bullet, applied to
all three board-side kinds. *(Architect's call, R2.)* An epic slice cell or `**Status:**` line that
sits near this folder's link but cannot be attributed to this task by that test (for example, a
`**Status:**` line in a section that links several tasks) is **not guessed at**: clause (f) refuses
and reports it, as step 6 already requires when *"anything is genuinely unclear"*. So a misattributed
line can neither satisfy (c) nor receive a write.

A `➡️ Moved …` row is a **pointer, not a location** (step 5: *"never flip a `➡️ Moved` row to
`✅ Done`"*). It never counts toward (b)–(f). *(Architect's call, disclosed at Process-review, R6. It
is mechanical from step 5's rule, ruling D2 and must-never 8, but no ruling names it.)*

**Classes of value:**
- **landed**: begins `✅ Done`;
- **open-work**: begins `🔲`, `🔄` or `🚧`;
- **other**: `⛔ Cancelled …`, or any unrecognised string. The brief's `## Status` also counts as
  **other** when the heading is **missing**, or when its value **spans more than one line** (step 5
  already refuses to guess at a multi-line value, `claude/skills/fkit-task-done/SKILL.md:294-295`).
  *(Architect's call, R4.)* The brief is always a location, so clause (e) refuses both.

**The mode fires only if ALL of these hold. Otherwise it refuses, stops, changes nothing, and reports
what every location reads.**

- **(a)** the folder is under `ai-agents/tasks/done/`;
- **(b)** at least one location is **landed**;
- **(c)** at least one location is **open-work**;
- **(d)** every landed location's value **begins with** the exact string
  `✅ Done (agent-closed — not owner-verified)`. *(Architect's call, R9.)* The test is on that
  **leading marker**, not the whole cell: text after the marker, such as an epic's ` (PR #NN)` that
  step 5 permits (`claude/skills/fkit-task-done/SKILL.md:178-180`), is not compared. A landed value
  that begins `✅ Done` **without** that exact qualifier straight after it is **plain**, and (d)
  refuses. So a mover-written suffixed cell does not block the mode, and nothing else passes for the
  agent-closed marker;
- **(e)** no location is **other**. *(Architect's call. The plan's clauses (a)–(d) did not say what
  happens to a location that is neither landed nor open. Refusing is the cheapest to reverse, and it
  matches exception 2's own rule for such values, `:108-110`: *"is not this branch's case: the plain
  stop above applies"*.)*
- **(f)** no epic slice row or sprint-plan body section that links this folder carries a Status cell
  or `**Status:**` line that fails the attribution test above (for example, a body section that also
  links another task's folder). Status-table rows need no such clause: a row whose Brief cell does not
  link this folder is another task's row and is ignored, exactly as exception 2 ignores it.
  *(Architect's call, R2.)*

**What each clause guards:**
- (c) is owner constraint 1. A request to re-touch a finished task fails (c) and is refused.
- (d) is owner constraint 2, ruling D1, and must-never 7.
- (a) is must-never 5. (b) is must-never 4.
- (e) is must-never 8. (f) keeps another task's line out of (c) and out of the write set.

**Edge cases, named:**
- **Old drift and a fresh half-landed close look the same on disk** (the `0021`/`0041` class). The
  rule treats them alike. Nothing on disk tells them apart, and this ADR does not pretend it can.
- **A hand-forged landed value is propagated.** Say a doer hand-edits a row to the agent-closed value
  and moves the folder by hand. The mode will copy that value (Q7).
- **A brief with no `## Status`, or a multi-line one** → refuse, through clause (e) (the brief reads
  **other**). A close record without a readable status of its own is not a two-sided disagreement,
  even when a row is agent-closed and an epic or in-body line is open.
- **An unsprinted task (no row, no epic, no in-body line)** → only one location exists, so (b) and
  (c) cannot both hold → refuse.

**Order among step 1's branches.** *(Architect's call; made precise at Process-review, R1.)* For a
folder already in `done/`, step 1 checks, for any identity, in this order:
1. exception 1, the owner-verification upgrade, as written today;
2. exception 2, the contradicted-close repair, as written today;
3. the reconcile mode, clauses (a)–(f) above;
4. only then the plain stop.

Exceptions 1 and 2 keep **who they fire for and what they write**: each stays owner-only, and neither
gains a case, loses a case, or writes a different value. What changes is **where their agent stop
leads**. Read literally, four sentences today end the run on the mode's own cases, in both
orientations, before a third branch is ever reached:
- `claude/skills/fkit-task-done/SKILL.md:85`, *"An agent hitting this case still stops"* (brief
  agent-closed, row open);
- `:100-101`, *"A row reading `✅ Done (agent-closed — not owner-verified)` beside an open-work brief
  is also not this branch's case: stop, and report what the row reads"* (brief open, row agent-closed);
- `:102-103`, *"never fire for a non-owner identity — a producer **spawned** to close is an agent … and
  stops here"*;
- `:108-110`, *"a value that already begins `✅ Done` — is not this branch's case: the plain stop above
  applies"*.

`0135` re-words each of the four to mean **"this exception does not fire — go on to the reconcile
mode's check"**, and the plain stop applies only when the mode also refuses. An owner-present producer
meeting exception 1's or 2's case is still governed by that exception (§Consequences states what that
means for the owner). The mode fills the case neither exception covers: an agent-closed landed value
beside open work.

### Q6 — Does `/fkit-task-cancelled` need the mirror mode?

**No. Out of scope, with the file checked** (ruling D3, ***"Out of scope (Rec)"***).

- **Checked:** `claude/skills/fkit-task-cancelled/SKILL.md:85-87` has no exception branch of any
  kind: *"it is already in `ai-agents/tasks/cancelled/` (nothing to do — say so)"*. A mirror would
  open a **first** door onto `cancelled/`, not widen an existing one.
- **No caller:** neither loop ever routes a cancel to a producer:
  - sprint-loop `claude/skills/fkit-sprint-ship-loop/SKILL.md:314-316`: *"A cancel always stops, and is
    never routed to a producer either"*;
  - task-loop `claude/skills/fkit-task-ship-loop/SKILL.md:206-209`: *"a producer spawn does not fix
    that"*.
- So no spawned producer ever leaves a half-landed cancel for the mode to finish.
- `cancelled/` is also the board nobody audits (ADR-025 §Consequences), which is the worst place to
  open a first agent door.
- **No follow-up brief is filed** (part of D3). Task `0342` covers a different asymmetry (the
  self-locator rule) and is unaffected.

### Q7 — What it does to ADR-033 §"The limit"

**It widens it. The widening is accepted and disclosed** (ruling D5, ***"Accept and disclose
(Rec)"***).

- **What does not widen:** the ways to close. The mode never creates a landed value (must-never 4).
  Every value it writes was already on disk.
- **What widens:** ADR-033 §"The limit" accepts that producer-only separates the closing identity,
  not the judgment: *"the win is structural role-separation at the mover, not a laundering-proof
  gate"*. Under this mode, an **out-of-procedure or forged** landed agent-closed value gets a
  mover-shaped record. The mode checks that the landed locations agree with each other. It does not
  check how the value got there (no git provenance check; that was option (b), not chosen).
- **Disclosure:** every report where the mode fired states, in these words, **"landed close
  propagated; its provenance not checked"** (must-never 10).
- **Why this is survivable:** the only value the mode can spread is the agent-closed marker (D1). So
  whatever it propagates still reads *"not owner-verified"*, and the owner's upgrade (exception 1)
  still sits between it and a plain `✅ Done`.

### `0229`'s exception — kept, owner-only

**Kept, unchanged** (D1). It is not subsumed and not replaced.

- The mode never writes plain `✅ Done`. Exception 2 stays the only door for a **plain** landed value
  beside an open-work brief, and it stays owner-only.
- The two branches cover complementary cases:
  - exception 2: plain landed value, open-work brief, owner only;
  - the mode: agent-closed landed value, any open-work location, any producer.

⚠️ **Named residual — the owner-side gap stays open.** When the brief reads **plain** `✅ Done` and a
row is stale, **no branch fires, for anyone**:
- exception 1 needs an agent-closed brief;
- exception 2 needs an open-work brief;
- the mode refuses plain values.

⚠️ **Named residual — a second no-door state** (owner ruling on `0134`'s review, R8, ***"Name as
residual (Rec)"***). When the brief reads **plain** `✅ Done` and a row reads
`✅ Done (agent-closed — not owner-verified)` — with or without other open work — **no branch fires,
for anyone**:
- exception 1 needs an agent-closed brief (`claude/skills/fkit-task-done/SKILL.md:82-83`);
- exception 2 needs an open-work brief (`:86-87`);
- `:108-110` sends a brief that begins `✅ Done` to the plain stop;
- the mode refuses under clause (d) and must-never 7 (the landed locations disagree).

The run escalates to an owner who has no door either.

Both states were true before this ADR and are unchanged by it. They are recorded as residuals, not
filed as follow-ups. Option (c), an owner-present sub-path that would close the first, was offered
and not chosen (§Options considered; §Re-raise only if).

### The three carve-out sites — amended, kept as the fallback

**Amend** (ruling D4, ***"Amend as fallback (Rec)"***). Each carve-out stays as the fallback **when
the reconcile spawn refuses or fails**:
- a plain landed value;
- landed values that conflict;
- an "other" location, or an unattributable one (clause (f));
- no landed value at all;
- or the spawn itself not landing.

The stated reason changes from *"no agent can lawfully reconcile them"* to **"the reconcile mode
refused (or its spawn failed)"**.

**A refusal because every status location already agrees is not a fallback case.** *(Architect's
call, R10.)* Nothing is half-landed, so there is no disagreement for the carve-out to sanction. If the locations agree on the
landed value and only an href is stale, that is ordinary pointer repair under D2 (skill-less
coordination-doc repair, ADR-044 §Decision 1), not a carve-out.

| # | Site (re-derived at `d8ef596`) | Text today | Becomes |
|---|---|---|---|
| 1 | `claude/skills/fkit-sprint-ship-loop/SKILL.md:343-347`, *"The one carve-out: a half-landed close"* | *"because no agent can lawfully reconcile them"* | the sanctioned disagreement **after the reconcile mode refused or its spawn failed** |
| 2 | `claude/skills/fkit-task-ship-loop/SKILL.md:117-120`, *"One carve-out — a half-landed close"* | *"only because no agent can lawfully reconcile it"* | same |
| 3 | `claude/skills/fkit-task-ship-loop/SKILL.md:211-214`, the *"Any early exit"* exception | *"only the stale location is marked and a landed `✅ Done` is left for the owner"* | same, on the fallback path only |

- **The exit rows follow.** Sprint-loop `:337` and task-loop `:277` read *"folder moved, a
  status/href stale → owner-only, do not re-spawn"*. They become: spawn the producer in reconcile
  mode, then fall back to the carve-out on refusal or failure. `0135` also drops "href" from those
  rows' triggers (D2).
- The §4 recovery branches (sprint `:300-307`, task `:193-199`) are `0135`'s to re-route the same way.
- **Order is load-bearing: the reconcile spawn comes first, and the loop writes its
  `🚧 Blocked — hand-off incomplete` marker only on the fallback path.** *(Architect's call, R3 —
  forced by D4(a), which makes the carve-out the fallback, and by must-never 8.)* The loop marks *"the
  location that is still stale"* and is barred only from writing over a landed `✅ Done`
  (`claude/skills/fkit-sprint-ship-loop/SKILL.md:305-306`, `:337`;
  `claude/skills/fkit-task-ship-loop/SKILL.md:197-198`, `:277`). A location reading `⛔ Cancelled …`
  or an unrecognised string is "stale" to the loop. If the marker were written first, it would turn
  that "other" location into open work: clause (e) would no longer see it, and the mode would overwrite
  it. For the same reason the loop spawns the reconcile mode **once**; once its fallback marker is on
  disk it does not spawn the mode again for that task (today's exit rows already say "do not
  re-spawn").
- ⛔ **The loop never writes `🚧 Blocked` over a location whose value reads "other"; it reports that
  location instead.** *(**Owner ruling**, 2026-09-14, ***"Add the rule to ADR-048 (Rec)"*** — not an
  architect's call. A new rule beyond D4.)* "Other" means Q5's class: `⛔ Cancelled …`, an unrecognised
  string, or a missing or multi-line brief `## Status`. Spawn-first (above) keeps the "other" value
  intact for the **first** reconcile run, but on the fallback path the loop would still mark that
  location as *"still stale"*. Its `🚧 Blocked — hand-off incomplete` marker would then erase the value
  clause (e) checks, and a **later** reconcile run would read open work there and overwrite it —
  defeating must-never 8. This rule closes that second-run gap: on the fallback path the loop may mark
  only locations that read **open work**; each "other" location is left byte-unchanged and named in the
  loop's report, with what it reads. It is the loop-side counterpart of must-never 8. The mode's own
  rules (Q4, Q5) are unchanged.

## Options considered

- **Producer-only reconcile mode that copies only the agent-closed value; `0229` kept owner-only
  (chosen — Q1 2026-09-13; D1(a) 2026-09-14).** Lets the loops finish their own half-landed closes
  without a human. The only value it can spread still says "not owner-verified". Cost: the Q7
  widening, and the owner-side gaps stay open.
- **Keep it owner-only (rejected by the owner, 2026-09-13).** The status quo: every half-landed close
  waits for a human, **even when the landed value is already on disk** and the only work left is
  copying it to the other locations. The gap is reported honestly today, but reporting it does not fix
  it. The owner chose to write the constraints down and let the producer act inside them.
- **Copy the landed value verbatim, plain included, for any producer; `0229` subsumed (D1(b), not
  chosen).** A spawned producer would write plain `✅ Done`, a value that means the owner was present
  and verifying. That turns a copy of the owner's verification into an agent act.
- **D1(a) plus an owner-present sub-path copying plain and covering "brief plain, row stale"; `0229`
  replaced (D1(c), not chosen).** It would close the owner-side gap. But it rewrites a shipped
  owner-only branch for a case not yet seen in practice. Left as the re-raise path.
- **Href staleness satisfies the precondition (D2(b)), or hrefs are out of scope entirely (D2(c)) —
  not chosen.** (b) lets a pointer fix pass as a status disagreement, which empties owner constraint 1.
  (c) would leave the mode unable to repair the hrefs of the very close it reconciles.
- **Mirror the mode into `/fkit-task-cancelled` now (D3(b)), or out of scope plus a follow-up brief
  (D3(c)) — not chosen.** (b) opens a first door onto the unaudited board for a case no loop can
  produce. (c) files work with no caller.
- **Remove the carve-outs (D4(b)) or keep them as written (D4(c)) — not chosen.** (b) leaves the loops
  no lawful end state when the mode refuses, which reopens `0123`'s R6 contradiction. (c) keeps a
  justification ("no agent can act") that this ADR makes false.
- **Add a git-provenance check (D5(b)), or narrow the mode until nothing widens (D5(c)) — not
  chosen.** (b) adds a mechanism the prose skills cannot run reliably. (c) conflicts with Q1: any mode
  that propagates a landed value widens §"The limit" somewhat.

## Consequences

- **Positive:**
  - A spawned producer's half-landed close no longer has to wait for the owner. The loops' most common
    stale case (a spawned close, so agent-closed) gets an agent-side remedy.
  - Both owner constraints, the must-never list, and a clause-by-clause detection rule are on record.
    This is the part the owner said was worth having.
  - The marker's meaning is preserved: nothing the mode writes claims owner verification.
- **Negative / costs:**
  - ADR-033 §"The limit" widens (Q7). A forged agent-closed landed value is propagated and only
    disclosed, not detected.
  - Two owner-side gaps remain, with no door for anyone: "brief plain, row stale", and "brief plain,
    row agent-closed" (§`0229`'s exception).
  - `/fkit-task-done` step 1 grows a third branch in the file where fkit's rule against passing off an
    agent's work as owner-verified lives. `0123` needed three review rounds on less.
  - **For an owner-present producer, the same disagreement ends differently depending on which side
    landed** (owner ruling on `0134`'s review, R7, ***"Record as consequence (Rec)"***). Basis: D1(a)
    plus must-never 3, under the branch order in §Q5.
    - Brief agent-closed, row open → exception 1 governs → plain `✅ Done` everywhere.
    - Brief open, row agent-closed → exception 2 does not fire (the row is not plain) → the mode
      governs → the agent-closed value on the brief.
    - The second outcome is not a dead end: the brief now reads agent-closed, so the owner can still
      upgrade afterwards with an owner-present `/fkit-task-done` (exception 1).
- **Handed to `0135`, not done here:**
  - the mode's prose in `claude/skills/fkit-task-done/SKILL.md`, carrying Q4 and Q5;
  - both loops' recovery branches, exit rows and three carve-out sites, per §The three carve-out sites;
  - the stale loop citations:
    - `fkit-task-done/SKILL.md:78-82` should be `:81-110`;
    - `:283-286` should be `:446`;
    - the phrase *"its one exception"* should say two, now three;
    - at sprint-loop `:302-303`, `:347` and task-loop `:120`, `:195-196`;
  - the D2 correction to the loops' "status or href" wording;
  - the owner's loop rule (§The three carve-out sites): on the fallback path, both loops never write
    `🚧 Blocked` over a location reading "other" and report it instead. Today the loops are barred
    only from writing over a landed `✅ Done` (sprint-loop `:305-306`, `:337`; task-loop `:197-198`,
    `:277`), so those bars widen to "other" too.
- **`0135` stays a four-surface change.** Its brief names four files: `fkit-task-done`,
  `fkit-task-cancelled` and both loops. Under Q6, `fkit-task-cancelled` is **explicitly out of scope
  and untouched**, and `0135`'s worklog says so. That is the brief's own item 2 ("only if ADR 0134 rules
  it in scope"). No brief edit is needed.
- **ADR-033 gets no dated note.** Nothing in it forbids repair. This ADR cites §Decision 1, §5 and
  §"The limit" and changes none of them.

## Re-raise only if

1. **A forged or out-of-procedure landed value is found to have been propagated** by the mode in
   practice. Reopen with D5(b), a provenance check, or D5(c).
2. **Either owner-side gap actually occurs** — brief plain `✅ Done` with a row stale, or brief plain
   `✅ Done` with a row agent-closed. Reopen D1 with option (c).
3. **A path is created that routes a cancel to a producer**, in either loop or anywhere else. Reopen
   Q6. The mirror mode then has a caller.
4. **ADR-033 is reopened toward session-only or owner-only closes** (its own first re-raise trigger).
   "A spawned producer qualifies" (Q2) must be re-ruled together with it.
5. **The status vocabulary gains another landed variant** beyond `✅ Done` and the agent-closed
   marker. Clause (d)'s leading-marker test must be revisited.

**Do not re-raise on:**
- *"keep it owner-only"* (the owner rejected it, 2026-09-13);
- *"the mode should normalise or upgrade the marker"* (owner constraint 2);
- *"the mode should fire on a stale href alone"* (D2);
- *"the carve-outs are now dead text"* (D4 keeps them as the fallback, on purpose).

## Owner sign-off

All rulings via **`AskUserQuestion`** in live **`fkit lead`** sessions. The option labels are the
verbatim text.

| # | Date | Question | Ruling (verbatim label) |
|---|---|---|---|
| Q1 | 2026-09-13 | does the mode exist; who invokes | ***"Producer-only reconcile mode (Rec)"*** — accepted **on** the two constraints quoted in Q4 |
| D0 | 2026-09-14 | plan-step role and Build Route | ***"Keep plan, architect builds (Rec)"*** — the coder-authored plan is the plan of record, a recorded departure from ADR-044 §Decision 2; named Route ruling (ADR-037 §3): `fkit-architect` builds via `/fkit-record-decision` |
| D1 | 2026-09-14 | value written; `0229` | ***"Agent-closed value only (Rec)"*** |
| D2 | 2026-09-14 | href-only staleness | ***"Links aren't statuses (Rec)"*** |
| D3 | 2026-09-14 | `/fkit-task-cancelled` mirror | ***"Out of scope (Rec)"*** |
| D4 | 2026-09-14 | the three carve-out sites | ***"Amend as fallback (Rec)"*** |
| D5 | 2026-09-14 | ADR-033 §"The limit" | ***"Accept and disclose (Rec)"*** |
| Plan | 2026-09-14 | plan approval | ***"Approve (Rec)"*** |
| R7 | 2026-09-14 | review: owner-present outcome differs by which side landed | ***"Record as consequence (Rec)"*** — §Consequences |
| R8 | 2026-09-14 | review: second no-door state | ***"Name as residual (Rec)"*** — §`0229`'s exception |
| Status | 2026-09-14 | review: ADR status | ***"'proposed' until you sign (Rec)"*** — header |
| R4, R5, R9, R10, R11 | 2026-09-14 | review: five wording fixes | ***"Fix all in this pass (Rec)"*** — the calls these fixes needed are C7–C10 below |
| Sign-off | 2026-09-14 | sign off the architect's calls C1–C10 | ***"Approve all C1–C10 (Rec)"*** — all ten calls below approved; header Status → `accepted` |
| Loop rule | 2026-09-14 | second-run gap: on the fallback path the loop can write `🚧 Blocked` over an "other" location | ***"Add the rule to ADR-048 (Rec)"*** — the loop never writes `🚧 Blocked` over a location reading "other"; it reports instead. §The three carve-out sites; handed to `0135` |

**What the rulings cover.** They cover the decision and every D-branch. The architect's calls
marked in the text were covered by no ruling when made; the owner **approved all ten** on 2026-09-14
(***"Approve all C1–C10 (Rec)"***), and they are now owner-approved, with the same standing as the
rulings above. The loop rule in §The three carve-out sites is an **owner ruling**, not a call, and is
not in this list. The complete list of approved calls:

| # | Call | Where | Made at |
|---|---|---|---|
| C1 | clause (e): an "other" location → refuse | §Q5 | Build |
| C2 | a `➡️ Moved …` row is a pointer, not a location | §Q5 | Build (disclosed at Process-review, R6) |
| C3 | "copies, does not resolve": an owner-present producer running the mode also writes the agent-closed value | §Q3 | Build (basis corrected, R7) |
| C4 | branch order: exception 1 → exception 2 → mode → plain stop; the four agent-stop sentences re-worded to hand on to the mode | §Q5 | Build (made precise, R1) |
| C5 | attribution by link for epic slice cells and in-body `**Status:**` lines; clause (f) | §Q5 | Process-review, R2 |
| C6 | reconcile spawn first, loop's Blocked marker only on the fallback path, one spawn | §The three carve-out sites | Process-review, R3 |
| C7 | a missing or multi-line brief `## Status` reads **other**, so (e) refuses | §Q5 | Process-review, R4 |
| C8 | the write set's boundary: pointer repairs include outbound sibling links and self-locators; epic "next slice" prose not written; the reference-integrity guard still runs; a third `Moved:` report value | §Q3 | Process-review, R5 |
| C9 | clause (d) compares the leading marker `✅ Done (agent-closed — not owner-verified)`, not the whole cell; anything else beginning `✅ Done` is plain | §Q5 | Process-review, R9 |
| C10 | the fallback list names "no landed value at all" and an unattributable location; an all-agree refusal is not a fallback case (href-only staleness is D2 pointer repair) | §The three carve-out sites | Process-review, R10 |

## Number allocation — the sweep, evidenced

Run 2026-09-14 before allocation, per `/fkit-record-decision` step 2:

1. **Step A** (malformed `adr-*` filenames) → printed **nothing**.
2. **Step B** (highest number on disk, numeric) → **47**. Next free: **48**.
3. `grep -rn -i 'adr-048\|ADR 048\|adr-0048' ai-agents/ claude/ test/ README.md CLAUDE.md` (vault
   included, read-only) → **0 hits**. No rival claim. (`0135`'s brief calls this record *"ADR 0134"*,
   by task number. That is a reference to this ADR, not a number claim.)

**048 is free and is allocated here.**

## Related

- [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md): §Decision 1 (producer-only),
  §5 (spawned producer = agent-closed), §"The limit" (widened, Q7). Not amended.
- [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md): §Consequences, `cancelled/`
  unaudited (Q6).
- [ADR-044](adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md):
  §Decision 1 (href repair is skill-less coordination-doc repair, D2; Build role follows the skill).
- [ADR-037](adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md):
  §3, the named Route ruling this Build ran on.
- [ADR-038](adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md): step role follows
  skill.
- [ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md): vault writes are fkit-wiki's
  (must-never 9).
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md): why a spawned producer is
  not owner-verified.
- [`task-status-vocabulary.md`](../conventions/task-status-vocabulary.md): §"The authority split".
- Task `0134` ([brief](../../tasks/done/0134-decide-the-sanctioned-repair-path-for-a-half-landed-close/brief.md)),
  task `0135` ([brief](../../tasks/backlog/0135-add-producer-only-reconcile-mode-to-task-done/brief.md)),
  task `0229` ([brief](../../tasks/done/0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close/brief.md)),
  task `0123` ([review ledger](../../tasks/done/0123-route-sprint-ship-loop-close-to-producer/review.md)).
- Code: `claude/skills/fkit-task-done/SKILL.md` (step 1 `:74-112`, step 5 `:171`, vocabulary `:437`),
  `claude/skills/fkit-task-cancelled/SKILL.md:82-87`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`
  §4 and exit table, `claude/skills/fkit-task-ship-loop/SKILL.md` step 9 and exit table.
- **Wiki:** **fkit-wiki** should ingest this ADR. An architect never writes the vault.
