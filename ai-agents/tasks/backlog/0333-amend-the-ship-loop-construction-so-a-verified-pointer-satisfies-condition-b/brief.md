# Amend the ship-loop construction so a verified pointer satisfies condition (b) of the declared-approval marker

## ID
0333

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ### ⭐ THIS ROW IS THE SKILL HALF OF A BRIEF SPLIT IN TWO ON 2026-08-24, BY OWNER RULING
>
> **Verbatim option label: "Split into two (Recommended)".** The chosen option's description, verbatim:
>
> > "The producer's pick. Different owners — ADR is fkit-architect, skill edit is fkit-coder — and
> > `task-owner-vocabulary.md` allows exactly one role per brief, \"not two roles\". Precedent splits
> > this way (0241's batch, 0325/0326). The ADR half becomes a hard gate on the skill half: the skill
> > file must not assert an unrecorded overturn of an owner ruling."
>
> The ADR half stayed on
> [`0331`](../0331-sanction-the-verified-pointer-form-as-a-faithful-plan-carry/brief.md), owned by
> `fkit-architect`. ⛔ **`0331` IS A HARD GATE ON THIS TASK — see §Notes. Do not start the edit before
> the ADR is merged and readable.**

### The underlying owner ruling, 2026-08-24

Given live via `AskUserQuestion` in an `fkit lead` session driving `/fkit-sprint-ship-loop` and relayed
to a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**The option label is the verbatim text:** **"Sanction the verified-pointer form (Recommended)"**. Its
description, verbatim:

> "Amend the construction so a pointer + hash + byte count, verified by the worker against disk before
> any edit, satisfies condition (b) — with the honest caveat the worker itself stated: this improves
> FIDELITY, not TRUST, since a doctored plan plus matching hash is as reachable as a doctored paste.
> Needs a task to amend the skill, and an ADR since it changes an owner-ruled construction."

**Full provenance — the question that prompted it, the reversal it performs, and the two measured
instances behind it — lives in
[`0331`](../0331-sanction-the-verified-pointer-form-as-a-faithful-plan-carry/brief.md) §Context.**
⚠️ **Read it before editing.** It is not duplicated here beyond the caveat below, because the ADR is
where that record belongs and `0331` is the gate on this task anyway.

### ⛔ THE CENTRAL CAVEAT. It is the point of this task, not a footnote.

> **This amendment improves FIDELITY, not TRUST.**
> **A doctored plan plus a matching hash is exactly as reachable as a doctored paste.**

⛔ **The amended text MUST NOT be written as a security guarantee, and a review that lets it read as one
has failed this task.** The construction's existing closing paragraph — *"The honest bound on 'true by
construction' — do not rewrite this into a guarantee"* — is the model and the tone to match. A driver
that wants to defeat this check can compute a hash over whatever bytes it likes; what the check buys is
that an **accidental** divergence between the plan on disk and the plan the worker acts on becomes
detectable. **That is the whole of the gain. Say so in the file.**

⚠️ This block is repeated verbatim in `0331`. That is deliberate, not redundancy: each half can be read
alone and **neither may lose it**.

## What to build

### 1. Amend the faithful-carry construction

In `claude/skills/fkit-sprint-ship-loop/SKILL.md` — the numbered steps under *"How to carry it — the
construction, not an exhortation"* — so the **verified-pointer** form satisfies condition (b).

⚠️ **Anchor by that heading and by the quoted step text, not by line number**
([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)): a
skill file others edit is a moving target, and two other rows are queued against this same file.

### 2. Spell out the worker-side verification as a step the worker performs

**This is the load-bearing new element.** It is not a property the driver asserts — it is an action the
worker takes:

- re-read the plan from the pointed-at path,
- recompute `git hash-object`,
- compare it to the carried hash,
- and **refuse before any edit if it differs.**

⚠️ **`wc -c` alone is not the check.** The construction already says so about the driver's side —
*"it measures the **file**, which reads identically whether or not your read stopped short"* — and the
same reasoning applies to the worker's.

### 3. Reconcile step 5 — split the sentence, do not delete it

Step 5 currently says a pointer-only spawn *"fails condition (b) as written, so the spawned coder
**must refuse it** — the refusal is mandatory, not discretionary"*.

⛔ **That sentence becomes false for the verified form and stays true for the unverified one. Do not
delete it — split it**, so both outcomes are stated and a reader can tell which is which.

### 4. Reconcile `fkit-coder.md`'s sprint-loop carve-out — a DIFFERENT file

It is what gates the write on all of (a)(b)(c). ⚠️ **Check whether it independently restates condition
(b) in terms of a paste; if it does, it must move in the same change or the two files disagree.**

### 5. ⚠️ Re-derive `0204`'s five-site enumeration — MANDATORY, and easy to miss

The construction **enumerates the sites** that task `0204` must delete when its carry-check hook lands.

**Re-derived firsthand 2026-08-24 by the splitting producer: the count is FIVE, and the list reads
1–5 in the ⛔ block inside step 4**, introduced by *"`0204` may never open this file, so its sites are
enumerated here rather than left to be discovered — there are FIVE, not the two most visible"*. The
five are: (1) the `unverified …` line inside the fenced pointer form; (2) the ⚠️ instruction directly
above it to emit that literal every time; (3) the *"nothing checks it until `0204`'s … hook lands"*
sentence; (4) the *"and until `0204`'s carry-check hook lands, nothing does"* clause inside the closing
*"honest bound"* paragraph — **that clause only**; (5) the list and its introducing sentence, removed
last.

⛔ **This amendment may add, move, split or delete such a site. The task MUST re-derive the enumeration
against the amended text and update the count and the list in the same change.** ⚠️ **`0204` may never
open this file** — that is the stated reason the list exists — **so a stale list means `0204` ships
leaving a false `unverified — no hook checks it` marker behind.** ⭐ **If the amendment adds a new site
carrying that marker, the list becomes SIX and must say six.**

⚠️ **The FIVE above is a measurement dated 2026-08-24, not a constant.** `0204` and `0223` are both on
Sprint 6 and both edit this file. **Re-derive; do not carry the number forward.**

### ⛔ Do not touch the plan-approval gate itself

Nothing here weakens the owner's `AskUserQuestion` approval of the plan, the plan/build split, or
`<task-folder>/plan.md` being written by the driver at approval.

## Verification steps

- ⛔ **The gate is discharged before any edit:** `0331`'s ADR exists under
  `ai-agents/knowledge-base/decisions/` and states the reversal. **Cite it by filename in the amended
  text.** If it does not exist, **stop** — this task is blocked, not merely early.
- **The amended construction is walked end to end by a reader who has not seen this brief**, and the
  two forms — verified pointer, and unverified pointer — are unambiguously distinguishable, with only
  the first satisfying condition (b).
- **Read the amended passage and confirm it does not read as a security guarantee anywhere.** ⚠️ A
  read-and-judge check, not a keyword search.
- ⛔ **The `0204` enumeration is re-derived against the amended file, and its count matches its list.**
  **State the number found.** ⚠️ **A run that repeats "FIVE" without re-deriving has reproduced the
  defect this step exists to catch.**
- **`fkit-coder.md` and the skill file agree** on what condition (b) requires. **Quote both.**
- **`npm test` green, with the count stated.**
- ⚠️ **Check whether any test asserts on the current carry wording before editing it** — if none does,
  **say so plainly** rather than letting the absence pass unremarked.
- **The dual-home rule is checked, not assumed:** confirm whether `claude/skills/fkit-sprint-ship-loop/`
  has a scaffold counterpart that must move with it
  ([`dual-home-parity.md`](../../../knowledge-base/conventions/dual-home-parity.md)).

## Notes

- **Owner: fkit-coder** — `claude/` is production source, and
  [`task-owner-vocabulary.md`](../../../knowledge-base/conventions/task-owner-vocabulary.md) allows
  **exactly one** role per brief (*"not two roles"*), which is why this row exists separately from
  `0331`.
- ⛔ **Depends on: [`0331`](../0331-sanction-the-verified-pointer-form-as-a-faithful-plan-carry/brief.md)
  — HARD. Not a soft-follow.** The owner stated the gate in these terms: *"the skill file must not
  assert an unrecorded overturn of an owner ruling."* Landing this task first would leave
  `claude/skills/fkit-sprint-ship-loop/SKILL.md` sanctioning a form that overturns the **owner ruling
  of 2026-08-02** (`0162` OQ-1, whose clause *"pure by-reference was rejected"* is still in the file
  today) **with nothing on record that the ruling was overturned** — the record-decay shape `0306`
  exists to repair, reintroduced by the very change meant to improve the file. ⚠️ **The gate is the ADR
  being merged and readable, not merely drafted:** this task must be able to cite it by filename.
- **Blocks: nothing.**
- ⚠️ **Three rows now target `claude/skills/fkit-sprint-ship-loop/SKILL.md`** — this one, `0204` and
  `0223`. ⭐ **The split changed which rows those are, not how many:** `0331` used to be the third and
  no longer touches the file at all. `0204` and `0223` are both on **Sprint 6**, and Sprint 6's own
  §*"Four real dependencies the order encodes"* already says they must be sequenced, not parallelised.
  ⛔ **Whichever of the three lands second and third must re-derive the `0204` enumeration rather than
  trusting the previous one's count.** **Owner-ruled 2026-08-24, verbatim label "Note both, decide when
  scheduled (Recommended)": noted here, decided when scheduled.**
- ⚠️ **`0270`'s open question does NOT bite this row** — it is `fkit-coder`-owned. It bites `0331`; see
  that brief's §Notes. Recorded so a scheduler does not double-count the exposure.
- ⛔ **This is not a licence to skip the paste when it fits.** The construction's own reasoning for a
  paste stands for a plan that can be carried whole. **The amendment is for the case where it cannot
  be** — and `0331`'s ADR draws that line. **Implement the line the ADR draws; do not invent one.**
- **Risk: moderate, and it is a documentation risk, not a runtime one.** Nothing executes this text; a
  bad amendment is a construction that reads as a guarantee, which is worse than the refusal it
  replaces because a reader would stop checking.
- ⚠️ **Residual this task cannot close:** nothing verifies the driver's hash at spawn time until
  `0204`'s hook lands. **The worker-side re-verification this task sanctions is self-reported by the
  worker in exactly the way the driver's hash is self-reported by the driver.** ⛔ **A worklog claiming
  this task "makes the carry checkable" has over-claimed** — it makes it checkable *by the worker*, and
  only against accident.
- **Evidence sources:** `claude/skills/fkit-sprint-ship-loop/SKILL.md`, the faithful-carry construction
  under *"How to carry it — the construction, not an exhortation"* (steps 1–6, the ⛔ five-site block in
  step 4, and the closing *"honest bound"* paragraph) — **all read firsthand 2026-08-24**, which is how
  the five-site count and the 2026-08-02 ruling's verbatim wording were confirmed.
- ⛔ **Out of scope:** the ADR (`0331` owns it), building the carry-check hook (`0204` owns it), the
  plan-approval gate itself, any `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  any re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  and any task-file move ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- ⛔ **Filed by a spawned `fkit-producer` with NO owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md))
  **on the relayed owner ruling to split: appended to the unranked Backlog board, `## Priority`
  `Unscheduled`. Nothing was re-ranked and no other task's `## Status` was changed.**
