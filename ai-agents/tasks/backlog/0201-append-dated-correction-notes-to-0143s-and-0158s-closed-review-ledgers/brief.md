# Append dated correction notes to `0143`'s and `0158`'s closed review ledgers

## ID
0201

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Three record-accuracy defects in two CLOSED review ledgers.** This task is the *cleanup* of a driver
routing error, not the fix for it — `0200` owns the routing question itself.

> ## ⛔ PRECONDITION — this task may not start without explicit owner authorization
>
> Both target folders are under `ai-agents/tasks/done/`. **A landed `✅ Done` belongs to the owner
> alone.** `/fkit-task-done` step 1 refuses a folder already in `done/` outright — *"it is already in
> `ai-agents/tasks/done/` (nothing to do — say so)"* — with **one** exception, the owner-verification
> upgrade, which is reserved to the owner in the same bullet (*"An agent hitting this case still stops:
> only the owner can upgrade"*). Both briefs today read `✅ Done (agent-closed — not owner-verified)`,
> so **neither has had the owner's verification pass yet.**
>
> **This is a precondition, not a footnote.** Do not open either folder for writing until the owner has
> said, in this session, that these two ledgers may be annotated. Absent that, the correct terminal
> state of this task is *waiting*, not *partially applied*.

### Why it exists

All three defects trace to **one** driver error: `fkit-sprint-ship-loop`'s Process-review step was
routed to `@fkit-architect` instead of `@fkit-coder` on three consecutive tasks (`0158`, `0143`,
`0195`). **`0200` (filed today) owns that question and must not be duplicated here.** This task repairs
what that error left in the written record.

**⚠️ Owner ruling of 2026-08-02** (`AskUserQuestion`, live lead driver session): file `0143`'s
correction **and** `0158`'s two ledger gaps as **one task**, not three. They share a cause, they touch
the same artifact class, and all three need the same owner authorization anyway. **This is why the
brief is not decomposed** — the split rule yields to a recorded owner ruling, and the ruling is named
here so a later reader does not read the single brief as a decomposition failure.

### The three defects — all re-verified first-hand 2026-08-02

#### Defect 1 — `0143`'s ledger claims an invocation the hook forbids

`ai-agents/tasks/done/0143-append-a-dated-correction-note-to-adr-010/review.md`, §**Coder response**,
opens:

> *"Written by the **fkit-architect** running `fkit-process-stateful-review` as a bounded worker of
> `fkit-sprint-ship-loop`, 2026-08-02."*

`/fkit-process-stateful-review` is **coder-owned**: it appears in the `coder)` arm of
`skills_for_role()` in `claude/skills-for-role.sh` and is **absent** from the `architect)` arm (both
re-verified 2026-08-02). The ADR-018 `PreToolUse` hook denies the skill to the architect identity **at
any spawn depth**. **A search of the whole `0143` folder for any denial record returns nothing.**

**⛔ The note this task writes MUST NOT assert which of the two happened.** A read-only audit by an
`fkit-coder` worker established that **the artifacts cannot distinguish them** — ledgers record
authorship and method, not tool calls. The two live readings are:

- the ledger **overstates what happened** — the role applied the *method* by hand from the spawn
  instruction and described it as running the skill (this is exactly what the `0195` worker disclosed
  doing, in the open); **or**
- **a denial occurred and went unrecorded.**

**Both are a record defect.** The correction note states both, states that the evidence cannot decide
between them, and stops. **Do not investigate further to break the tie** — the audit already
established it is not recoverable, and re-deriving that is not this task's work.

#### Defect 2 — `0158`'s ledger `Status:` never flipped

`ai-agents/tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/review.md`
header still reads:

> `Status: in-review`

while the task is **closed and sitting in `done/`**. `/fkit-process-stateful-review` **step 6** requires
the flip:

> *"If all novel findings are closeout / disproven / accepted and nothing blocking remains, set the
> document header **Status: closed-out**."*

**Nothing blocking remained.** That ledger's own *Coder response* table records all five findings
dispositioned — R1, R2, R3 **FIXED**; R4, R5 **ACCEPTED RESIDUAL** on owner disposition. The condition
for the flip was met and the flip did not happen.

**Graded substantive by the audit:** a future round, or any reviewer opening that ledger, reads
`in-review` as **live work**. Contrast `0143`, which did flip — its header reads `Status: closed-out`
and carries a dated close-out HTML comment recording the round-1 disposition. `0158` has neither.

#### Defect 3 — `0158`'s accepted residuals carry no testable re-raise trigger

`0158`'s §**Accepted residuals** records two entries (R4, R5) with a **What** and a structural **Why**,
but the only re-raise text is a **blanket preamble** covering both:

> *"Do not re-raise them in a later round; raise a NEW finding only if new evidence changes what they
> are."*

There is **no per-entry condition**. `/fkit-process-stateful-review` step 6 names the shape explicitly:

> *"add an entry to **Accepted residuals** with its full What / Why (structural) / **Re-raise-only-if**"*

**⚠️ Stronger than first reported:** the missing half is not a style preference — the skill's own step 6
names `Re-raise-only-if` as a required part of the entry. **Graded substantive (minor)** by the audit,
and that grading stands: the re-raise condition is the **operative** half of the loop-prevention memory.
A blanket *"unless new evidence"* is unfalsifiable — no reader can tell whether it has fired.

Compare `0143`'s residuals, every one of which ends in a **named, checkable event**:

> *"**Re-raise only if:** follow-up 2 … has not landed by the end of Sprint 2"*
> *"**Re-raise only if:** … the durable-citation-anchors work is cancelled"*

**Suggested shape, NOT binding** — the implementer proposes, the owner disposes: R4 re-raises if
follow-up 1 ships without drafting its own candidate wordings; R5 re-raises if the ADR's `"direct your
work"` subsection is ever cited as the reproduction of record rather than as a conclusion.

### ⚠️ A genuine tension this task must NAME and MUST NOT resolve

The owner ruled **today** that **review-ledger paths stay frozen, because re-pointing rewrites
evidence**. Appending a dated note is **not** re-pointing — but it is still **writing into a frozen
record**, and **`0192` is open to decide exactly where that line sits**.

> **This task may be blocked on `0192`, or it may be the concrete case that informs `0192`. It does not
> get to pick.** Whichever it turns out to be is the owner's call, or `0192`'s. **Do not pre-decide it,
> and do not cite this brief as evidence that the line has already been drawn.**

`0192` today records the collision in its own words: `/fkit-task-done` step 5 treats a ledger reference
like any other href — *"they record what happened, not where a file lives"* — which is the **opposite**
conclusion from the owner's instance-B ruling on the same class of file. **Two documents in this
repository currently point in opposite directions on the same act**, and this task writes into exactly
that class of file.

### The correction form is already established — follow it

`0143` itself established the dated-correction-note form, and the owner ratified it. **A ledger
correction follows the same discipline:**

- **Leave the false or stale text byte-identical.** Additions only, `+N / −0`.
- **Append a dated note beside it** — never an in-place rewrite.
- **Marker vocabulary is two markers and only two:** **⚠️** = a fact that drifted, decision untouched;
  **⛔** = a decision that was overturned, do not follow it. **All three defects here are ⚠️** — no
  decision in either ledger is overturned by any of them.
- **Placement is BELOW the claim it corrects** (`0143` residual `R1-placement`, with recorded
  rationale — **do not re-litigate it**).
- **No `:NNN` into a mutable file.** Anchor by **file + heading + quoted phrase**. This bites harder
  than usual here: *this very task* shifts line numbers inside both ledgers, so any `:NNN` written into
  or about them is stale on arrival.

**⚠️ One form question this brief does NOT answer, because `0143` did not settle it for ledgers:**
`0143`'s form includes a **header metadata bullet** announcing the corrections. A `review.md` header is
a different shape from an ADR header (it carries `Task:` / `File(s) under review:` / `Status:`). **Ask
the owner whether the ledgers get an equivalent header line, and do not invent one.**

### Defect 2 is a special case — read this before writing it

Defects 1 and 3 are pure appends. **Defect 2 is not obviously one.** Flipping `Status: in-review` →
`Status: closed-out` is an **edit to an existing line**, which the additions-only rule forbids, and it
is a change to a **closed record's own state field**. There are at least two shapes and this brief
does not choose between them:

- **(i)** append a dated ⚠️ note recording that the flip was required by step 6, was not performed, and
  that the header is therefore stale — leaving `in-review` byte-identical; or
- **(ii)** perform the flip and append a dated note recording who flipped it, when, and why.

**(ii) breaches additions-only; (i) leaves a header that actively misreads as live work.** **Put both
to the owner and let them choose.** Whichever is chosen, record the reasoning in the worklog — the next
person to correct a ledger will look for it.

### The audit's own conclusion — carry it honestly

**Nothing here warrants a reopen on its merits.** No obligation is unmet in a way that changes a
decision, misrepresents a finding, or leaves anything undispositioned. All five of `0158`'s findings
were dispositioned; all five of `0143`'s were. **These are record-accuracy defects.** State that in the
notes themselves, so a later reader does not mistake a correction note for a re-opened round.

## What to build

**Dated correction notes appended to two closed review ledgers, under owner authorization. Nothing
else.**

1. **Obtain the owner's explicit authorization to write into `ai-agents/tasks/done/0143-*/review.md`
   and `ai-agents/tasks/done/0158-*/review.md`.** If it is not given in this session, **stop and report
   — do not partially apply.**
2. **Resolve the `0192` question before writing**, by asking the owner: is this task blocked on `0192`,
   or does it proceed as the case that informs it? **Do not answer this yourself.**
3. **Re-verify all three defects first-hand** before writing anything — this brief decays, and three
   concurrent workers were editing this tree when it was written. Specifically re-check: `0143`'s
   §Coder response opening sentence; the `coder)` / `architect)` arms of `skills_for_role()`; that
   **no denial record exists anywhere in `0143`'s folder**; `0158`'s header `Status:` value; `0158`'s
   §Accepted residuals preamble and the absence of any per-entry `Re-raise only if:`. **Report anything
   that no longer holds and stop rather than writing a note about a defect that has moved.**
4. **Put the two open form questions to the owner in one batch** — the header-line question, and
   Defect 2's shape (i) vs (ii). **Batch them; do not ask one at a time.**
5. **Write the notes.** Three notes, each dated, each ⚠️, each placed **below** the text it corrects,
   each anchored by file + heading + quoted phrase with **no `:NNN`**:
   - **In `0143`'s §Coder response** — the invocation claim. **States both readings and that the
     evidence cannot distinguish them.** Names the cause (`0200`'s routing error) **by task ID, in one
     clause** — cross-reference, do not restate `0200`'s analysis.
   - **In `0158`'s header region** — the stale `Status:`, in whichever shape the owner chose at step 4.
   - **In `0158`'s §Accepted residuals** — the missing per-entry re-raise conditions, quoting step 6's
     `What / Why (structural) / Re-raise-only-if` requirement, and **proposing** a condition for R4 and
     R5 that the owner approves or replaces. **Do not write an owner-approved re-raise condition the
     owner did not approve.**
6. **Prove additions-only mechanically, not by eye:** `git diff --numstat` and
   `git diff -U0 -- <path> | grep '^-'` on each ledger. If the owner chose shape (ii) at step 4, the
   single deleted `Status:` line is the **one** permitted deletion and **must be named and justified in
   the worklog**; everything else is `−0`.

**⛔ Out of scope, by name:**

- **Reopening either task.** Neither status changes; neither folder moves; `/fkit-task-done` and
  `/fkit-task-cancelled` are not invoked under this task by anyone.
- **Editing any file in either folder other than `review.md`** — not `brief.md`, not `plan.md`, not
  `worklog.md` (the exception: this task's *own* worklog lives in **this** folder).
- **`ai-agents/tasks/done/0195-*/`** — closed 2026-08-02; not this task's subject.
- **Deciding `0192`'s question**, or citing this task as having decided it.
- **Duplicating `0200`** — the routing rule, the loop's prose, `skills_for_role()`, the hook. Untouched.
- **Repairing `0158`'s other known residuals** — its stale brief citations are an ADR-034 accepted
  residual carried as ADR-037 follow-up 4. **Not this task.**
- **Any `ai-agents/wiki-vault/` write** (`fkit-wiki` only, ADR-005).
- **Any commit or push.**
- **Any re-rank of the board.**

## Verification steps

1. The owner's authorization to write into both closed folders is **recorded in this task's worklog**,
   with the date and the channel it came through. Absent that record, the task is not started.
2. The owner's answer on the `0192` relationship (blocked vs proceeds-and-informs) is recorded in the
   worklog, **in the owner's terms, not the implementer's**.
3. `grep -c "Status: in-review" ai-agents/tasks/done/0158-*/review.md` and
   `grep -n "closed-out" ai-agents/tasks/done/0158-*/review.md` together show the state the owner chose
   at step 4 — and the worklog names which shape was chosen and why.
4. `git diff --numstat` shows `+N / −0` for `ai-agents/tasks/done/0143-*/review.md`. For
   `0158-*/review.md` it shows `+N / −0`, **or** `+N / −1` with the single line named and justified in
   the worklog as Defect 2 shape (ii). `git diff -U0 -- <each ledger> | grep '^-'` returns nothing
   beyond that one permitted line.
5. The `0143` note contains **both** readings of the invocation claim and an explicit statement that
   the artifacts cannot distinguish them. `grep -i "assert\|conclude\|therefore the skill was"` over the
   new text returns nothing that picks a side.
6. Each of the three notes carries a **date**, the **⚠️** marker, and sits **below** the text it
   corrects — checkable by reading each note's immediate context.
7. `grep -nE ':[0-9]+' ` over the **added lines only** (`git diff -U0 | grep '^+'`) returns no
   `path:NNN` citation into any mutable file. Anchors are file + heading + quoted phrase.
8. The `0158` residuals note proposes a re-raise condition for **both** R4 and R5, each naming a
   **checkable event**, and the worklog records the owner's approval or replacement of each.
9. Every note states that these are **record-accuracy** defects and that **none warrants a reopen** —
   readable in one sentence per note.
10. `git status --porcelain` shows changes confined to the two `review.md` files and this task's own
    folder. **Nothing under `ai-agents/tasks/done/0195-*/`, nothing under `claude/`, nothing under
    `ai-agents/wiki-vault/`, no commit.**

## Notes

- **Depends on:** `0192`
- **Blocks:** nothing

**⚠️ The `Depends on: 0192` above is declared in the SAFE direction, deliberately — it is not a ruling.**
The brief's own §Context says the relationship is genuinely open: this task may be blocked on `0192`, or
may be the case that informs it. Gating it on the board is the conservative reading, so the board never
shows it pullable while the question is live. **`0192` or the owner may release it, and that release is
not a re-rank.**

**Adjacency, not dependency.** `0200` owns the routing error that caused all three defects, and its own
brief already flags Defect 1 and routes it *"to the read-only `0158`/`0143` audit already in flight"* —
**this task is where that routing lands**. `0198` (teach `/fkit-record-decision` the dated-correction-note
form) touches the same form from the ADR side; if it lands first, **use whatever it wrote rather than
re-deriving `0143`'s form from `done/`**.

**Why `fkit-coder` owns this.** All three defects sit in coder-side territory of the stateful review:
§Coder response is marked `CODER-OWNED — the reviewer does not write here`; the header `Status:` flip is
`/fkit-process-stateful-review` step 6; and §Accepted residuals is written by the coder side with owner
approval. **⚠️ If `0200` rules option (b) — the architect gains the skill — revisit this owner field
before starting; it does not auto-follow.**

**⚠️ This brief decays.** Every coordinate was verified 2026-08-02 against a live tree with three
concurrent workers in it. **Re-verify at implementation time** (step 3 of *What to build* makes this
mandatory, not advisory).

**⚠️ Priority 179 is append rank, NOT a merit ranking — flagged for owner confirmation.**
**On merit this belongs directly below `0200`**, because append rank and merit **agree** here and no move
is needed: it is gated on `0192`, which already sits above it, and it is the lowest-urgency open row on
the board — pure record accuracy, with the audit's own conclusion being that **nothing here warrants a
reopen on its merits**. Every row above it repairs either a live control (`0200`) or a document a reader
is actively being misled by; this one repairs two records that are already closed and already correct in
substance. Filed by a spawned producer with **no owner channel**, which never re-ranks (ADR-035,
`/fkit-task-brief` step 5). **No existing row was renumbered, inserted past, or touched, and no
`✅ Done` / `⛔ Cancelled` / `➡️ Moved` row was altered.**

**Why one brief and not three.** By owner ruling of 2026-08-02 (`AskUserQuestion`, live lead driver
session): `0143`'s correction and `0158`'s two gaps share one cause, one artifact class, and one
authorization gate. **Splitting would put three separate owner-authorization requests in front of the
owner for the same act.** The decomposition default yields to the ruling; the ruling is named here so a
later reader does not read this as a decomposition failure.
