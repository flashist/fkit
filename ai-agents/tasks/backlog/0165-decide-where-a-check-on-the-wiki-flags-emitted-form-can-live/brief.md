# Decide where a real check on the wiki completion flag's **emitted form** can live — 0154 guards the text, nothing guards the act

## ID
0165

## Sprint
Sprint 2

## Priority
129

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Investigation and ruling, not implementation.** The fix shape is unknown — it may be a consumer-side
check, a test, a clause in the plan gate, or a finding that **no mechanical check is possible and prose
plus the existing correction path is proportionate**. Do not write an implementation brief for it until
this is answered.

### The convention, and the failure on its second live use

Tasks **0125** and **0153** landed a convention: the three wiki SKILLs end their report with a
**prescribed line, marked as carried verbatim**. On **2026-07-29** the run that closed `0141` emitted a
**non-conforming** form. Every required *fact* was present — folder ID, brief path, and the board rank
correctly absent. **The failure was the form, not the content.**

**Verified firsthand on disk, 2026-07-29:**

| Fact | Evidence |
|---|---|
| The prescribed line is present, identical, in all three wiki SKILLs | `claude/skills/fkit-wiki-ingest/SKILL.md:72`, `claude/skills/fkit-wiki-sync/SKILL.md:116`, `claude/skills/fkit-wiki-lint/SKILL.md:81` — the `complete →` form, plus the sibling `partial` form |
| The SKILL states the verbatim obligation on the **caller**, not the emitter | ingest `SKILL.md:83-84`: *"These lines are the **last** thing in the report. A caller who summarizes this report **carries them verbatim** — a dropped flag is the whole bug this exists to fix."* |
| The deviation happened, and the vault recorded it | `ai-agents/wiki-vault/log.md:623`: *"This run first emitted its close flag as 'task 0141 ready to close — folder ID `0141`, brief …'. **That is not the prescribed line.** … Re-emitted correctly on the driver's correction."* |
| Neither live outing left a plan on disk | `ai-agents/tasks/done/0141-wiki-resync-for-the-lead-rename-and-menu-reorder/` holds `brief.md` + `review.md`; `ai-agents/tasks/done/0126-wiki-resync-for-adr-033/` holds `brief.md` + `review.md`. **No `plan.md`, no `worklog.md` in either.** |

> ⚠️ **The plan-side account is NOT verifiable from disk — treat it as testimony, not as a checkable
> fact.** The claims that *`0141`'s plan specified the non-conforming terminal act*, that *the driver
> approved that plan without checking it against the live SKILL*, and that *`0126` conformed only
> because its plan happened to quote the SKILL correctly* all come from the live driver session. The
> table above shows why: neither task folder contains a plan. This is the same honesty flag `0162`'s
> board row carries about the driver's self-reported verbatim failures. **The investigation must not
> restate these as established facts.** What *is* on disk is `log.md:623` — the deviation itself.

### The decisive evidence — the consumer says it is not a control

A spawned `fkit-producer`, asked at `0141`'s close whether it would have caught the non-conforming
form, answered: **"No. I would have acted on it without noticing."** Its reasoning: it never opens the
wiki SKILL during a close, and it matches on **the facts it needs**, not on **string shape**. Its
conclusion, verbatim:

> ***"on this run 'carried verbatim' was decorative, not a control"***

and

> *"the party that caught the deviation is the party that specified it. That is self-correction, not
> independent verification."*

**This is the whole case for the task.** The one party positioned to enforce the form has stated on the
record that it does not, and explained why it structurally would not.

### Why this is not task 0154

**`0154` would have been green throughout this failure.** It asserts that the five required strings are
**present in the three `SKILL.md` files** — and they were, and are (row 1 above). The text was never the
problem. `0154` guards the **source**; nothing guards the **emission**. Both are needed; they are
different surfaces and different controls.

### Why this is not task 0158

`0158` asks **which wins** when a spawn-time instruction contradicts a rule in the skill the worker is
running. This asks **whether a deviation is detected at all**. Even if `0158` rules *skill rules always
win*, nothing in this instance would have changed: the worker did not perceive a conflict, and the
consumer does not check shape. **Precedence and detection are different questions.** Cross-reference,
do not merge.

### The one control that did work, and why it does not generalize

The deviation was caught by **the driver, which had specified the convention in the first place**. That
is self-correction. It required a party who both knew the exact prescribed text and was watching the
emission — a coincidence of one run, not a control that repeats.

---

### 🆕 NEW EVIDENCE — added 2026-07-29 · provenance: the spawned `fkit-producer` that closed task `0148`

> **This section was appended after the brief was written. It is not part of the original filing.** It
> is added as **evidence and a named candidate answer** — **it rules nothing.** The five questions in
> *What to build* are still open.

**The brief above records ONE live failure of the prescribed form. There are now THREE, and the third
is the strongest kind of evidence available here: consumer-side, captured at a close.**

The producer that closed `0148` had consumed **three** wiki completion flags across the
`0126` → `0141` → `0148` chain. Measured by it against `ai-agents/wiki-vault/log.md`:

| Task | Flag as emitted in `log.md` | Form | Content (folder ID + brief path) |
|---|---|---|---|
| `0126` (`log.md:376`) | *"tasks 0117, 0126 and 0141 are ready to close — the producer runs the mover"* | ✗ **three tasks on one line** | IDs yes, **no path** (pre-`0153`, expected) |
| `0141` (`log.md:623`) | *"task 0141 ready to close — folder ID `0141`, brief `…/0141-…/brief.md`"* | ✗ | ✓ both |
| `0148` (`log.md:447`) | *"Task `0148` (priority 125, `🔲 Backlog`, owner `fkit-wiki`) is ready to close"* | ✗ | ID yes, **no path**; carries a **stale `priority 125`** — the row is **`P132`** |

**Zero of three `log.md` flags matched the prescribed line.** The only verbatim copy of the prescribed
line anywhere was inside a task folder's own `review.md`.

**The decisive new fact: `0148`'s flag deviated and nothing caught it.** The consuming producer's own
words:

> ***"I am the consumer and I did not notice until I went looking to answer this question."***

That confirms the earlier producer's testimony **from its own conduct rather than its own prediction**
— it never opened a wiki `SKILL.md` during the close, and matched on the folder ID it was handed.
**Two independent producers, same verdict: the form requirement is "decorative, not a control."** The
**content** requirement that `0153` landed (folder ID + brief path) is the part that worked — twice.

**Named candidate answer — recorded as INPUT to the ruling, not as the ruling.** The closing producer
recommends demoting the form from *"verbatim"* to a **required-content checklist**: folder ID, brief
path, complete-vs-partial. Its argument: *a requirement that fails on every live use, that no consumer
checks, and whose only enforcement is the emitter grading itself, manufactures a defect per run and
buys nothing.* **The architect may adopt, narrow, or reject this. It is one candidate among the four
sites in question 1, not a pre-empted answer.**

> ⚠️ **Honesty caveats stated by the source — do not drop them when using the table above.**
> 1. **Sample size is three, all from one role** (`fkit-wiki`). It is not a corpus measurement.
> 2. **Only `0148`'s flag was consumed firsthand.** `0126`'s and `0141`'s were read out of `log.md`
>    after the fact.
> 3. **The account that *"`0141` needed a driver correction round"* is `log.md`'s SELF-REPORT** —
>    testimony, not disk-verifiable. Same honesty flag `0162` already carries. This is the same class
>    of claim as the ⚠️ plan-side flag earlier in this Context.
>
> **Verified firsthand on disk 2026-07-29 by the producer recording this section:** all five `log.md`
> line citations above resolve as quoted; `0148`'s board row is `P132` in the working tree, so the
> flag's `priority 125` is stale as stated.

## What to build

**A ruling, recorded.** An ADR under `ai-agents/knowledge-base/decisions/` if it changes the control
model; a convention page under `ai-agents/knowledge-base/conventions/` if it records what was already
implied; **a report under `ai-agents/knowledge-base/reports/` if the finding is "no check is
proportionate"**. The architect decides which — that choice is part of the finding.

It must answer, explicitly:

1. **Where a check can live.** Evaluate at least these four, and rule each in or out **by name**:
   - **consumer-side** — `/fkit-task-done`, or the producer's own close procedure, compares the
     received line against the SKILL's prescribed form. Note the consumer's own stated objection: it
     does not open the wiki SKILL during a close, so this requires giving it a reason and a way to.
   - **a source test** — i.e. extending `0154`. State plainly that `0154` as scoped cannot see an
     emission, and say whether it *should* be widened or left alone.
   - **the plan gate** — the driver, or the plan-approval step, checks a plan's stated terminal act
     against the live SKILL before approving it. Note that no plan survives on disk for either outing,
     so this control would also have to leave a record.
   - **no mechanical check** — prose plus the correction path is proportionate. **This is a legitimate
     outcome** and must be argued, not defaulted to.
2. **What the check compares.** The prescribed line contains substitution slots (`<NNNN>`, `<slug>`),
   so *"verbatim"* means *verbatim modulo the named substitutions*. Say what the comparable form is,
   because a check that cannot state it cannot be built.
3. **Whether the verbatim obligation is on the right party.** The SKILL states it on the **caller who
   summarizes** (`SKILL.md:83-84`). The `0141` failure was in the **emitter**. Say whether the
   obligation needs restating, and on whom.
4. **What the consumer does on a non-conforming line that carries the right facts.** Act on it, refuse
   it, or act-and-flag. `0141` shows this case is live and the facts were complete. **Silent
   acceptance and silent refusal must both be ruled in or out by name.**
5. **Whether `0154` is still the right scope after this ruling** — unchanged, widened, or superseded.
   Say so explicitly so the producer knows whether `0154`'s brief needs an amendment.

**No implementation.** If the ruling implies work, name it as a follow-up for the producer to file. Do
not write a check, a test, or a clause into any file under this task.

## Verification steps

1. **The artifact exists** in `knowledge-base/decisions/`, `conventions/`, or `reports/`, and the
   report says which and why.
2. **All five questions above are answered explicitly** — each with a stated answer, not an
   implication. An artifact silent on any one has not closed the gap.
3. **The four candidate sites in question 1 are each ruled in or out by name.** A ruling that evaluates
   two and ignores two is not usable.
4. **The 2026-07-29 instance is adjudicated.** Apply the ruling to it and state, in one sentence, what
   would have happened differently under it — including *"nothing, and here is why that is acceptable"*
   if that is the honest answer.
5. **The producer's testimony is engaged, not just quoted.** The ruling must say whether the consumer
   *should* be made to check shape, given that it currently matches on facts by design.
6. **The un-verifiable plan-side claims are handled as testimony.** The artifact must not present the
   plan-text account as an on-disk fact; if it relies on it, it says so. Re-check the two task folders
   at implementation time — a `plan.md` may have appeared since.
7. **`0154`'s status is stated** — unchanged / widen / supersede — so the producer can act on it.
8. **No skill, agent definition, test, or source file was edited.** `git diff --stat` shows only the
   new knowledge-base file (plus this brief's own status if closed). This task rules; it does not
   implement.
9. **🆕 Added 2026-07-29 — all three instances are adjudicated, not just `0141`.** The ruling engages
   the three-flag table in the NEW EVIDENCE section and states whether *"zero of three matched"*
   changes the answer. **The named candidate answer (demote form → required-content checklist) is
   ruled in or out by name** — adopted, narrowed, or rejected with a reason. Silence on it fails this
   step. The three honesty caveats must survive into the artifact if it leans on the table.

## Notes

- **Owner:** fkit-architect — an authority/control-model investigation with an unknown fix shape,
  matching the `0158` / `0160` / `0162` precedent (report-only, decides but does not edit).
- **Depends on:** nothing.
- **Blocks:** nothing.
- **✅ Append-confirmation flag DISCHARGED — authority first: the owner, on 2026-07-29, via
  `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session.** This brief was filed by
  append under `/fkit-task-brief` step 5 at **P143**, flagged for owner confirmation with a merit
  argument that it belonged materially higher. **The owner confirmed and ruled it to P129** —
  immediately below `0154` (P128), adjacent to the `0162`/`0154` pair at the top of the open region.
  The owner's stated reasoning: **this is the only one of the three that addresses the emission rather
  than the source text, and therefore the only one that would have caught the `0141` flag failure** —
  `0154` would have been green throughout it. **The flag is closed; the rank is now an owner ruling,
  not an append.** Recorded in the sprint-2 addendum *"Promoted by OWNER RULING 2026-07-29 — 0165
  raised from P143 to P129"*.
- **Coordinates with `0154`** (`build-wiki-flag-convention-test`, promoted to P128 by owner ruling
  2026-07-29). **Adjacency, not a dependency, and explicitly not a merge.** `0154` proves the text is
  in the file; this decides whether anything proves the emitted act matches it. They can land in either
  order. **The producer judged them distinct** — the deciding argument is that `0154` would have been
  green for the entire duration of the `0141` failure.
- **Coordinates with `0158`** (P122, spawn-instruction precedence) — same run, adjacent surface,
  different question. See Context. **Do not fold them together.**
- **Coordinates with `0162`** (P127, verbatim-carry construction). Both concern a *"carry this
  verbatim"* requirement with no construction and no check behind it — `0162` for the driver→worker
  plan, this for the worker→caller flag. **If `0162` lands first, its answer on what satisfies
  "verbatim" may narrow this one; check its state before starting.**
- **Prior art on the same page:** `0126` conformed on the convention's first outing. Per the testimony
  above that was luck of drafting rather than a control — but see the ⚠️ flag in Context: **that
  specific claim is not verifiable from disk**, because `0126` left no plan.
- **Unenforced-prose class.** Same family as `0154`, `0157`, `0160`, `0163`, `0164`. No test in the
  repo reads any `SKILL.md`'s body today; `0136` (P114) is the first automated reader.
- **A one-paragraph ruling is a legitimate outcome.** The point is that the control gap gets a recorded
  answer from the role that owns the control model — not that the answer is necessarily large.
- **🆕 2026-07-29 — evidence added, scope and rank unchanged.** The `0148` close routed two findings
  here rather than opening a fourth claimant on the wiki-`SKILL.md` walk (owner ruling, 2026-07-29,
  via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session). **`## Owner`, sprint,
  and `P129` are untouched; no task was filed for this.** The closing producer had itself recommended
  a separate task; the owner ruled against it. See the NEW EVIDENCE section in Context.
- **🆕 The `0148` flag's stale-rank half went to `0160`, not here.** This brief owns *"is the form
  checked at all"*; `0160` (P141) owns *"what a citation may carry that moves"*. The same flag
  supplied evidence to both. **Read `0160`'s case 4 before ruling on question 2** — if `0160` rules
  that a flag may carry folder ID and brief path only, that narrows what *"verbatim modulo the slots"*
  has to compare.
- No commit — leave the new brief in the working tree.
