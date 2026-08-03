# Give the next lint a procedural reason to read `log.md`'s correction notes

## ID
0213

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Task **`0211`** (closed 2026-08-03) appended a dated correction entry to `ai-agents/wiki-vault/log.md`
recording three completion flags that carry the pre-`0173` form. To describe that defect the entry had
to **quote two old-form flag templates verbatim, with nothing substituted into them**. Because a quoted
template looks exactly like a real dead path, the entry carries a protective note — the block headed
*"⚠️ Note for the next lint — a dead-path scan will report the two old-form templates above"* — telling
the next lint run that these are specimens and must not be "re-fixed".

**The gap: that note has no procedural readership.** `claude/skills/fkit-wiki-lint/SKILL.md` never
instructs a lint run to **read** `log.md`. Verified on disk 2026-08-03 — every mention of `log.md` in
that skill is one of:

| What the skill says about `log.md` | Direction |
|---|---|
| *"**Log it.** Append to `ai-agents/wiki-vault/log.md`, using today's real date"* | **write** |
| *"`log.md` is not a signal: no board … the completion signal is a **flag in this report**, and nothing else"* | explicitly **not** an input |
| *"Once it cries wolf on `log.md`, nobody reads it again"* | about not flagging the log, not about reading it |

There is **no read step**. So the note's protection rests on **practice** — a lint run happening to
open the file — **not on procedure**. `0211`'s reviewer raised this (finding **R4**); the wiki worker
recorded it as *"a real gap left open by design"* and said filing it was a producer call. This brief is
that call.

### Why it matters, stated without overstating it

Two things already reduce the risk, and neither closes it:

1. A lint that "fixed" a quoted template would be **editing a past `log.md` entry in place**, which the
   owner's ruling of 2026-08-03 forbids outright. But **that ruling lives in briefs and in the log
   entry itself — not in `fkit-wiki-lint/SKILL.md`**, so nothing tells a lint run about it either.
2. The skill already warns against crying wolf on `log.md`'s deliberate history — but as a *rationale
   for a different check*, not as an instruction to go read the corrections.

So the failure mode is real but narrow: a future lint run reports the two specimens as dead paths, and
whoever acts on that report has nothing in-procedure telling them not to.

### ✅ RULED — remedy **A**, give the lint a read step (owner, 2026-08-03)

**Owner ruling, live `AskUserQuestion`, 2026-08-03: remedy A.** Add a step to
`claude/skills/fkit-wiki-lint/SKILL.md` that reads `log.md`'s correction notes **before** flagging, so
a specimen exemption parked there is found **by procedure, not by practice**. Remedy **B** — move the
exemptions to a new home lint already reads — is **rejected**: it needs a home that does not exist and
creates a second place the same fact lives, which can drift from the log.

The two candidates as weighed, kept for the record:

| | **A — give lint a read step** ✅ **RULED** | **B — move the marker to where lint already looks** ⛔ rejected |
|---|---|---|
| Change | Add a step to `fkit-wiki-lint/SKILL.md`: before reporting dead paths, read `log.md`'s recent correction entries and honour their do-not-fix notes | Record the specimen exemptions somewhere the lint procedure already reads, and leave `log.md` as pure history |
| Cost | One skill edit | Needs a home for the exemption list that does not yet exist |
| Risk | Stands in tension with the skill's two deliberate statements about `log.md` — see below; must be reconciled in the text, not ignored | Adds a second place the same fact lives, which can drift from the log |

### ⚠️ A overturns a deliberate stance — engage with it, do not delete it

**Read this before writing a word of the edit.** The lint skill has **no read step for `log.md`** —
and that is not an oversight anyone forgot. The skill positions `log.md` twice, on purpose, as
something other than an input. A builder implementing **A** is adding a **third** relationship to a
file the skill has deliberately kept at arm's length. **State the reconciliation in the text; do not
quietly delete either existing statement.**

**Stance 1 — `fkit-wiki-lint/SKILL.md`, step 8 (*"Flag any completed tracked task — close nothing"*):**

> (`log.md` is not a signal: no board tool reads it. That is exactly why task 80's vault work sat
> `🔄 In progress` on the board for a week.)

**This one is narrower than it looks, and the brief must not let a builder over-read it.** It is scoped
to **task-completion signalling** — *"no **board tool** reads it"* — not to lint inputs in general. It
is not a prohibition on reading the file. The new step must say so explicitly, or the two will read as
a conflict to the next person.

**Stance 2 — `fkit-wiki-lint/SKILL.md`, *"⚠️ The three ways to ruin this check"*, item 2:**

> **Iterate over FILENAMES in `wiki/decisions/` — never grep prose for `adr-NNN-` tokens.** A text scan
> across the vault produces false positives that are all **deliberate history**: `log.md`'s account of
> the collision and its repair … **The vault documents the collision on purpose; flagging its own
> records is how this check loses trust.** Once it cries wolf on `log.md`, nobody reads it again.

**This is the stance that matters, and here is the non-obvious part: remedy A serves its reasoning
rather than reversing it.** Both are aimed at the same failure — a lint that cries wolf on `log.md`'s
deliberate history and is never trusted again. Item 2 reaches it by **refusing to scan** the log;
remedy A reaches it by **reading the log to suppress** a flag raised elsewhere. Same goal, opposite
direction. **Say that in the edit.** The builder's job is to show the new step is item 2's ally, not
its repeal.

**What item 2 is genuinely guarding, and what the new step must therefore not do:** `log.md` is
append-only and grows without bound, so any procedure that depends on its prose gets slower, vaguer,
and more brittle over time. Scope the read step so that guard survives:

- **Suppress only — never raise.** A `log.md` correction note may cause lint to **withhold** a flag it
  would otherwise raise. It may **never** be the reason lint raises one. No note in the log ever
  becomes a finding.
- **Bounded read.** Recent correction entries, not the whole file's history. State the bound in the
  step.
- **No writes back.** See the append-only rule below.
- **Item 2 stays exactly as it is.** Do not soften *"never grep prose for `adr-NNN-` tokens"* — the new
  step is a different operation on the same file, not a licence to scan it.

## What to build

1. **Add the read step** to `claude/skills/fkit-wiki-lint/SKILL.md`: before reporting dead paths, read
   `log.md`'s recent correction entries and honour their do-not-fix notes. Place it so a reader
   following the procedure top to bottom **reaches it before** the dead-path/stale-claim reporting it
   governs — a step that lands after the report is written is decoration.
2. **Reconcile it in the text with both stances above.** Explicitly: the step-8 line is about
   **completion signalling**, this is about **suppressing false positives**; and the ruin-item-2 stance
   and this step share one goal, stated in the two bullets there. Both existing passages stay.
3. **Record the append-only rule in the same edit** — **a lint run may never edit or annotate a past
   `log.md` entry in place** (owner ruling, 2026-08-03). **This is deliberately part of this task, not
   scope creep:** the rule currently lives only in task briefs and in the log entry itself — the same
   readership gap one level up — and the run that now *reads* past entries is exactly the run that
   might be tempted to *fix* one. It belongs beside the read step, not in a separate task.
4. **Note the interaction with the "describe, don't quote" doctrine** (owner ruling 2026-08-03,
   recorded in `0211`'s `review.md` as **AR-2**, inherited by `0212`): a correction entry quotes the
   defective **form** with placeholders left unsubstituted and does **not** reproduce the substituted
   live path. That doctrine is what keeps the exemption load small and shrinking — future corrections
   quote templates, not live paths, so there is less for a dead-path scan to false-positive on. The
   read step is the **backstop** for the specimens that doctrine still permits (`0211`'s two old-form
   templates are exactly those), not a replacement for it. Do not restate the doctrine as a rule in the
   lint skill — it governs the *writing* of corrections, which is `/fkit-wiki-ingest`'s and the log
   author's business, not lint's.

### Out of scope

- ⛔ **Do NOT edit `ai-agents/wiki-vault/`.** The vault is the wiki role's exclusive write surface
  (ADR-005). This task's write surface is `claude/skills/fkit-wiki-lint/SKILL.md`. The `0211`
  correction entry, including its note block, stays **byte-identical**.
- ⛔ **Do NOT "correct" `0211`'s entry or any other dated log entry.** They are dated records, not
  stale claims.
- ⛔ **Do NOT broaden this into a general lint-input redesign.** The scope is the specimen-exemption
  readership gap and the append-only rule, nothing else.
- ⛔ **No `:NNN` line-number citations** in the edit or the hand-off — same defect class this whole
  thread exists to record.

## Verification steps

1. ✅ **Already satisfied** — the owner's ruling (remedy **A**, 2026-08-03) is recorded above, before
   any edit was made. Nothing further to check here.
2. `git diff` shows `ai-agents/wiki-vault/` **untouched** — zero changed files under that path.
3. The read step is present in `claude/skills/fkit-wiki-lint/SKILL.md`, and a reader following the lint
   procedure top to bottom **reaches it before** the reporting it governs — state which step number it
   lands at and which step reports dead paths, not just that the text exists.
4. The new read step and the existing step-8 *"`log.md` is not a signal"* line are reconciled in the
   text — quote both and show the completion-signal / false-positive distinction is stated.
5. **Both pre-existing stances survive verbatim.** `git diff` shows the step-8 parenthetical and
   *"three ways to ruin this check"* item 2 (*"never grep prose for `adr-NNN-` tokens"* …
   *"Once it cries wolf on `log.md`, nobody reads it again"*) **unchanged** — the read step is added
   alongside them, not in place of either.
6. The read step is written **suppress-only** — quote the wording showing a `log.md` note can withhold
   a flag but never raise one — and states a bound on how much of the log is read.
7. The append-only rule for past `log.md` entries appears in the lint procedure.
8. `grep` for `\.md:[0-9]` over the diff returns nothing.
9. Nothing committed, nothing staged.

## Notes

- **Owner:** fkit-coder — the write surface is `claude/skills/fkit-wiki-lint/SKILL.md`, a source file,
  not the vault. Prior art: task `0173` edited all three `fkit-wiki-*/SKILL.md` files under
  `fkit-coder`. ADR-005 governs `ai-agents/wiki-vault/` only.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Relates to `0211`** — this is `0211`'s reviewer finding **R4**, which `0211` left open by design.
- **✅ RULED — remedy A. No open questions remain on this brief.** Filed 2026-08-03 with the A/B choice
  deliberately unanswered, by a spawned producer with no owner channel. The owner answered the same day
  in a live `AskUserQuestion` during the sprint ship-loop: **remedy A — give the lint a read step.**
  Recorded into the brief by a producer spawned by the ship-loop driver, which relayed the answer.
  Converted in place — the A/B weighing above is kept as the reasoning behind the ruling, not as a live
  question. **A builder may now proceed.**
- **⚠️ The builder is overturning a documented position, not filling a forgotten gap.** See
  *"A overturns a deliberate stance"* above. The absence of a `log.md` read step is intentional; two
  passages in the lint skill place the log outside the input path on purpose. Both stay; the edit must
  reconcile with them in the text. Deleting either to make room is a failed implementation.
- **Relates to `0212`** via the *"describe, don't quote"* doctrine (owner ruling 2026-08-03, recorded as
  **AR-2** in `0211`'s `review.md`, inherited by `0212`) — it bounds how many quoted specimens future
  corrections can produce, which is what keeps this read step's job small. Not a dependency: `0212` does
  not block this and this does not block `0212`.
- **Why the Backlog board and not Sprint 2:** the owner's standing ruling of 2026-08-02 — a brief not
  required to ship in the current sprint alongside the other tasks goes to `backlog.md`. Nothing in
  Sprint 2 waits on this.
- **No `On merit` statement, by design:** the Backlog board is unranked (`## Priority: Unscheduled`,
  board cell `—`); there is no rank for a merit position to diverge from.
- **Source:** raised as finding **R4** in `0211`'s round-1 stateful review (2026-08-03, Codex coverage
  FULL); the wiki worker recorded it as a producer call; filed by the producer spawned to close `0211`.
- No commit — leave the new file and the board row in the working tree.
