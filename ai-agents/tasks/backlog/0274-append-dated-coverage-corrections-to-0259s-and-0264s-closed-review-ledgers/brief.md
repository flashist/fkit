# Append dated coverage corrections to `0259`'s and `0264`'s closed review ledgers

## ID
0274

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-reviewer

## Context

### Authority — and ⚠️ THIS TASK IS NOT AUTHORIZED TO START YET

[**ADR-042**](../../../knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md)
Consequences names the defect and **explicitly declines to act on it**:

> *"`0259`'s 'Coverage is FULL' (`review.md:11-12`) and `0264`'s 'coverage is **not** partial'
> (`review.md:9-10`) were calibrated on the old binary vocabulary and **overstate what happened**;
> `0264` contradicts itself against its own `:326-327`. Under D1 both would read reasoning-only. …
> whether they are corrected is a follow-up for the producer to file (ADR-033) — **not filed by this
> ADR**, and this ADR does not decide it."*

**This brief is that filing. It is not that decision.**

⛔ **An owner ruling is required before this task starts** — two things need ruling: **(a)** that the
corrections are wanted at all, and **(b)** that the append-only form below is the right one.
`0255` is the standing precedent for a brief whose start is gated on a ruling that does not exist yet.
⚠️ **A `fkit-lead` ship-loop cannot supply that ruling** — its only owner gate is plan approval, spent
before Build. This runs in an **owner-present session**, or not at all.

### ✅ RULED 2026-08-11 — THE GATE ABOVE IS DISCHARGED. This task is authorized to start.

**The paragraph above is left byte-identical.** Its heading — *"NOT AUTHORIZED TO START YET"* — and its
`⛔` were true when written, on the same day, and are **now false**. The ruling it asked for exists.

**Owner ruling, given live via `AskUserQuestion` in a `fkit lead` session, 2026-08-11 — a selection
from the question's option list, so the option label is the verbatim text:**

> **"Yes — append the corrections"**

**What it settles — both halves the paragraph above asked for, ruled together:**

- **(a) The corrections ARE wanted.** *"Do nothing, ADR-042 is enough"* was available and was **not**
  chosen. ⛔ Do not re-open that question.
- **(b) The append-only form is AFFIRMED BY THE OWNER, not merely proposed by the producer.** Originals
  **byte-identical**, a dated correction **appended**, per the `0146` / `0149` / `0211` precedent set
  out below. ⛔ **This is no longer a producer's recommendation that an implementer may weigh — it is
  the ruled form.** Rewriting either existing claim is out of bounds under the ruling as well as under
  the reasoning.

⛔ **Do not re-litigate the permissibility question.** The producer's ruling in §2–§5 below stands as
the *reasoning*; the owner's ruling above is the *authority*. Read §2–§5 for **why** the form is what
it is — not as an open question.

**What the ruling does NOT change, and each still binds:**

- ⛔ **`0265/review.md:10-15` is accurate and stays untouched.** The ruling covers `0259` and `0264`.
- ⛔ **Neither task's `✅ Done (agent-closed — not owner-verified)` status changes**, on the brief or on
  the Sprint 5 board. This corrects a coverage claim, nothing else.
- The **soft ordering after `0272`** is unchanged and is still deliberately not a `Depends on`.

⚠️ **One consideration the ruling did not cover, surfaced rather than decided.** The *ruling* gate is
discharged, so the reason this brief said *"owner-present session or not at all"* no longer applies.
But a **role** consideration remains and is not this note's to settle: `## Owner` is **`fkit-reviewer`**
(the ledger is the reviewer's artifact — the `0146` precedent), while a `/fkit-sprint-ship-loop` Build
step spawns **`@fkit-coder`** regardless of `## Owner`
([ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)) —
the same shape as `0258`/`0269`, though **without** their ADR-005 breach, since a review ledger is not
the vault. **Whoever schedules this should decide the session it runs in deliberately** rather than
discovering it at Build. ⛔ Not a block, not a re-scope, and it changes nothing above.

*(Recorded 2026-08-11 by a spawned `fkit-producer` with no owner channel, on the ruling relayed to it.
It edited no ledger — that is this task's own work, not this act — and committed nothing.)*

### ⚠️ The producer's ruling on the underlying question: **is editing a closed task's ledger permissible at all?**

The architect was told **ADR-034** was the reason the ledgers were left unedited. **That is an
over-read, and the record should say so.** The full ruling, because it decides the shape of this task:

**1. ADR-034 is not authority against this.** ADR-034 decides **when a stateful review loop stops** —
its own scope line says it *"does not change what a review finds, only when the loop stops."* It rules
that an own-record defect does not drive **another review round**. That is a reason not to *reopen the
review*; it says nothing about whether a closed ledger may later carry a correction. Its nearest
relevant clause is a re-raise condition — *"the recorded own-record residuals are observed to mislead a
later reader"* — which is adjacent but not this case (a coverage line is not a residual). ⛔ **Do not
cite ADR-034 as forbidding this, and do not cite it as permitting it.**

**2. ⛔ Rewriting the existing lines is NOT permissible, under any ruling.** Two independent reasons:
- It rewrites history. The claim **was made**, on the old vocabulary, and a reader must be able to see
  that it was made and later found wrong.
- **It would destroy ADR-042's own evidence.** ADR-042 Finding 2 quotes those exact lines at those
  exact locations as the proof that the vocabulary was broken. Silently replacing them invalidates the
  ADR's citations — the record would then assert a defect whose evidence no longer exists.

**3. ✅ An appended dated correction, with the original left byte-identical, IS permissible** — and it
is this repo's dominant, well-established convention for exactly this situation. Precedent, all on
disk:
- **`0146`** — *"Correct the false 'menu-pick alias' claim in `0139`'s accepted residual"*, filed on an
  owner ruling of 2026-07-26, `## Owner: fkit-reviewer`, described in its own board row as
  *"docs-only, `review.md` is the reviewer's ledger."* **Direct precedent: a filed task that corrects a
  closed task's `review.md`.**
- **`0149`** — a filed task that edits a brief in `done/`, `## Owner: fkit-producer`, with the
  architect's ruling recorded as *"record the discharge, do not delete the line."*
- **`0211`** — the owner's 2026-08-03 ruling on the vault `log.md`: a correction is **a new dated
  entry**, originals **byte-identical**, **never** an in-place annotation. Scoped to `log.md`, but it
  is the clearest statement of the form this project uses.
- Sprint 5's own board applies the pattern at scale under owner rulings — *"the paragraph above is left
  byte-identical; it was true when written and is now false."*

**4. The ledger is the reviewer's artifact, so the reviewer writes the correction.** `## Owner` is
`fkit-reviewer`, matching `0146`. ⚠️ **Neither `fkit-stateful-review` nor
`fkit-process-stateful-review` has an "amend a closed ledger" step** — this is an act outside both
procedures, which is a second reason it needs the owner's say-so rather than a role's own judgement.

**5. The honest alternative, if the owner rules NO — and it is already partly in place.** **ADR-042
itself is a correction recorded elsewhere that points at them**: dated, durable, correctly located in
`knowledge-base/decisions/`, naming both ledgers, their line numbers, and exactly what they overstate.
So the minimum honest state **already exists**. What this task buys is **one thing only**: a reader who
opens `0259/review.md` or `0264/review.md` directly, without ADR-042 in hand, currently sees an
uncorrected false claim and has no pointer to the correction. That is the whole gap. ⚠️ **It is a real
gap but a small one — do not oversell it, and "do nothing, ADR-042 is enough" is a legitimate
outcome.**

## What to build

**Two appended correction notes. Nothing else.**

⚠️ **Line numbers are dated anchors of convenience (measured 2026-08-11). The durable anchors are the
quoted text.**

### 1. `ai-agents/tasks/done/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/review.md`

The claim, at `:11-12`: *"**Both ran. Coverage is FULL — no reviewer skipped, no degradation.**"*

Append a dated note directly beneath it recording that under ADR-042's vocabulary this reads
**reasoning-only**: Codex ran and reasoned, and its `read-only` sandbox meant it **measured nothing**,
so all execution evidence in that review is the Claude reviewer's. ⚠️ **The note must not imply the
review was bad or the findings unsound.** They were not — ADR-042 is explicit that static reasoning
finds real defects. **The claim was wrong; the review was not.**

### 2. `ai-agents/tasks/done/0264-implement-adr-040s-identity-grammar-in-dashboard-sh-both-rungs-and-the-moved-target-companion/review.md`

The claim, at `:9-10`: *"Both reviewers ran — Codex (`codex-cli 0.145.0`, `gpt-5.6-sol`) completed;
coverage is **not** partial."*

⚠️ **This one is different and the note must say why: the ledger already contradicts itself.** At
`:326-327` the *same file* records *"**Codex could not run the suite** (its read-only sandbox blocked
`mkdtemp` with `EPERM`). All execution evidence in this ledger is mine."* **That later statement is
accurate.** The correction note therefore does **not** introduce a new fact — it points the reader at
the ledger's own accurate statement and records which of the two the reader should believe.

### ⛔ `0265` is ACCURATE — leave it alone

`0265`'s review ledger
already states the reasoning-only reality loudly and correctly (*"COVERAGE IS PARTIAL AND THIS IS NOT
A FOOTNOTE"*, naming the `mkdtemp` `EPERM` block and *"Every piece of execution evidence in this review
is the reviewer's"*). ⛔ **Do not touch it, and do not "harmonize" its wording with the new vocabulary.**
A correct record is not a drift event.

### Constraints

- ⛔ **APPEND ONLY. Both existing claims stay byte-identical.** Verify with `git diff` that the original
  lines are unchanged. This is the single hardest constraint in the task.
- ⛔ **No in-place annotation** — no bracketed insert, no strikethrough, no edited word. A separate,
  dated, clearly-delimited note beneath.
- ⛔ **Nothing else in either ledger changes** — not the verdict line, not the findings table, not the
  residuals, not `Status:`. ⛔ **Do not reopen either review**, do not add a round, do not re-verify any
  finding.
- ⛔ **Do not touch either task's `brief.md`, `plan.md`, `worklog.md`, or its board row.** Both tasks
  stay `✅ Done (agent-closed — not owner-verified)` on Sprint 5 at `P1` and `P4`. ⛔ **No task-file
  move** (ADR-033) and no re-rank.
- ⛔ **Do not edit ADR-042.** Its citations must keep resolving to the text they quote — which is
  guaranteed only if the append-only rule holds.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). ⛔ No commit. ⛔ No source-code change of any kind.

## Verification steps

1. **The owner's ruling is recorded in the worklog before any edit** — the ruling itself, its date, and
   the channel it came through. ⛔ If no ruling exists, **stop and report**; do not proceed on this
   brief's reasoning alone.
2. **Both original claims are byte-identical.** Paste `git diff` on both ledgers and show that every
   `-` line is zero — the diffs must be **pure additions**.
3. **`0265`'s ledger is untouched.** `git diff` on it is empty.
4. **ADR-042's citations still resolve.** Open
   `adr-042-…md` Finding 2 and confirm each quoted line is still present, verbatim, at a locatable
   place in each ledger. ⚠️ If a line number shifted because of the appended note, that is expected —
   the **text** is the anchor. Say which line numbers moved.
5. **Each note names what it corrects by durable anchor, not by `:NNN` alone** — quote the corrected
   claim inside the note so it survives any later line shift. (The `0211` precedent: name it by folder
   ID and durable anchor.)
6. **The `0264` note points at `:326-327`** as the ledger's own accurate statement, and does not assert
   anything the ledger did not already contain.
7. **Full `npm test` green.** State the measured counts. ⚠️ Expect this to prove nothing about the
   content of the notes — say so rather than implying coverage. It exists to catch an accidental
   structural break in a `done/` task folder.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Soft ordering, deliberately NOT a `Depends on`:** best run **after**
  [`0272`](../../done/0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/brief.md),
  so both notes cite the **landed** three-state vocabulary rather than inventing a second wording for
  the same thing. This task is writable without it — the notes could name the reality in plain words —
  so no hard edge was declared. Inventing a `Depends on` to express a preference is what tasks `0184`
  and `0149` warn against.
- ⚠️ **The two ledgers are frozen history, and this task's value is bounded.** It buys a pointer for a
  reader who opens the ledger without ADR-042 in hand. It does **not** make either review better, and
  it does **not** change either task's `✅ Done (agent-closed — not owner-verified)` status.
- ⚠️ **`0264`'s self-contradiction is the stronger case of the two.** A ledger that says one thing at
  `:9` and the opposite at `:326` misleads whichever half a reader reaches first. `0259` is a single
  wrong claim with no internal contradiction. **If the owner wants only one correction, do `0264`.**
- **On merit:** the **Backlog**, and unranked is honest here. Nothing waits on this; it touches no
  shipped code; it is not on the release path; and it cannot start without an owner ruling that does
  not exist. ⛔ Putting it on Sprint 5 would append it at `P18`, below every open row — a scheduled-
  looking row that a rank-ordered pass reaches last, which is the trap Sprint 5's own board documents
  and had to fix by re-ranking on 2026-08-11.
- **Line-number citations are dated anchors of convenience** (measured 2026-08-11); the durable anchors
  are the quoted text.
- ⚠️ **Dated cross-reference appended 2026-08-28 — this task's scope is UNCHANGED.** Two further
  specimens of the same claim were found at
  [`0272`](../../done/0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/brief.md)'s
  close and filed **separately** as
  [`0348`](../0348-decide-and-if-ruled-correct-the-two-post-adr-042-coverage-full-review-ledgers/brief.md):
  `0327`'s ledger and `0188`'s ledger, both written **after** ADR-042 was accepted. ⛔ **They are NOT
  added here** — this task's `## What to build` reads *"Two appended correction notes. Nothing else."*,
  its per-ledger verification steps are written against those two, and the 2026-08-11 owner ruling that
  discharged its authority gate named those two. Widening it would stretch that ruling past what it
  said. `0348` carries its own equivalent gate. **Neither task depends on the other**; running them
  together is an ordering preference so all four notes share one wording.
- Filed 2026-08-11 by a spawned `fkit-producer` with no owner channel, on ADR-042's explicit hand-off
  of this follow-up to the producer. It asked nothing, ruled only on the permissibility question above
  — which it was directed to rule on — edited no ledger, and committed nothing.
