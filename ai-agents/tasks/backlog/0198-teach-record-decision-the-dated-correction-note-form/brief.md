# Teach `/fkit-record-decision` the dated-correction-note form that `0143` established

## ID
0198

## Sprint
Sprint 2

## Priority
176

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### The form exists, in exactly one place: a closed task

Task [`0143`](../../done/0143-append-a-dated-correction-note-to-adr-010/brief.md) was scoped to
**establish the form** for annotating a stale claim inside an `accepted` ADR without rewriting it. Its
own brief said so, and named the follow-up rather than doing it:

> *"**Establishes the form**, since this is the first one. … if `/fkit-record-decision` should learn the
> shape, say so as a follow-up rather than changing that skill under this brief."*

`0143` shipped the form and named the follow-up. **This is that follow-up. It has not been done.**

**`/fkit-record-decision` today has no notion of amending an ADR at all** — verified 2026-08-02: the
skill is 165 lines across four steps (establish, number, write, report), its ADR template offers
`**Status:** proposed | accepted | superseded by ADR-<NNN> | deprecated`, and the words *amend* and
*correct* appear nowhere. An architect who needs to record that an accepted ADR's prose went stale has
**no procedure to follow** and must re-derive `0143`'s form from a closed task folder.

This project **amends ADRs rather than superseding them** — `0143`'s brief says so, and ADR-032's
amendment plus the ADR-010 notes are the evidence. A form that only one closed task knows is a form the
next architect will reinvent differently.

### The form, as shipped and as ruled — five pieces

All five are owner-ruled or reviewer-ratified outcomes of `0143`, not proposals. Read `0143`'s
`worklog.md` and `review.md` for the reasoning; this list is an index, not a substitute.

1. **The three-part shape.** A **drift note** (⚠️), a **reversal notice** (⛔), and a **header metadata
   bullet** carrying the legend. `0143` shipped three note blocks plus one header bullet on ADR-010.
2. **The two-marker legend, and only two.** **⚠️ = a fact that drifted** (the decision is untouched);
   **⛔ = a decision that was overturned** (do not follow it). The distinction is the form's whole
   value: mismarking a drift as a reversal tells readers to stop following a decision that stands.
3. **The *"left byte-identical"* clause.** Every note states that the corrected text is left
   byte-identical, as the record of what was decided on its original date. The constraint behind it is
   **`+N / −0`** — proved by `git diff --numstat` and `git diff -U0 | grep '^-'`, **not by eye**.
4. **Below-the-claim placement, WITH its rationale.** ⚠️ **New from `0143`'s review round 1 (residual
   `R1-placement`).** The note goes **below** the claim it corrects. This **departs from the wiki
   vault's *"banner above claim"* convention**, and the departure was kept-as-shipped **with a recorded
   rationale**. **The rationale is not optional decoration** — without it the next writer reads the
   placement as an oversight and "fixes" it back, and the form forks. Carry the reason, not just the
   rule.
5. **The header bullet's form.** ⚠️ Residual `R5-header-form`, ratified: the `- **Corrections:**` bullet
   is **one metadata item that may wrap**, and it carries the ⚠️/⛔ legend plus the list of annotated
   sites. It is the one part of an `accepted` ADR that an append-only correction may extend, because it
   is metadata *about* the notes rather than body text — and that exception must be stated, or a later
   writer either breaches append-only unknowingly or leaves the ADR lying about its own annotations.

### ⚠️ Two more pieces — added 2026-08-02, from the form's SECOND application (`0195`)

**When this brief was written the form had exactly one application (`0143`). It now has two.** Task
[`0195`](../../done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/brief.md) landed
2026-08-02 (`+53 / −0`, two ⚠️ blocks on ADR-010) and produced two generalizations `0143` alone could not
support. **Both are verified first-hand against the live ADR-010 — re-verify, do not inherit.**

6. **Indentation follows the claim, and prose gets indent 0 — a case `0143` never hit.** `0143`'s three
   blocks all correct claims sitting inside **list items**, so every one of them is indented to match its
   parent bullet (2 and 3 spaces). `0195`'s §Context block corrects a **top-level prose paragraph** and
   therefore sits at **indent 0**. `0143` alone would have taught a reader that correction notes are
   indented, which is an accident of what `0143` happened to correct. **The rule is: the note's
   indentation matches the block it sits under — top-level prose means column 0.** Without this, the next
   writer either indents a prose note (and it renders as part of the wrong list) or reads the indent-0
   note as sloppy and "fixes" it.
7. **Cross-reference, do not restate — one site stays binding.** `0195` corrected two sites whose facts
   overlap. Its §Decision 5 note carries the full current fact; its §Context note deliberately does
   **not** repeat it and instead says so out loud — *"The binding statement is §Decision 5, which carries
   its own ⚠️ notice … deliberately **not** restated here, so there is one place to keep true rather than
   two."* **This is the multi-site rule the form was missing.** A form that only ever corrects one site
   never has to answer it; the moment two sites share a fact, restating it in both re-creates the exact
   two-places-to-keep-true defect these notes exist to repair. The skill must say: **one site carries the
   fact, every other site points at it, and the pointing note says that it is pointing on purpose.**

## What to build

**A new section in `claude/skills/fkit-record-decision/SKILL.md`** teaching the correction-note
procedure, carrying all five pieces above.

- **Placement inside the skill is the implementer's call**, but it must be reachable by someone who
  opened the skill to *correct* an ADR rather than write one — the current four steps all assume a new
  ADR, so an amendment procedure appended as a fifth step in that sequence would be easy to miss. State
  the choice and the reason.
- **The ADR template's `**Status:**` line must stay untouched in meaning:** a corrected ADR stays
  `accepted`. Say so explicitly — the single most likely wrong move is marking it `superseded`.
- **Say what a correction note is NOT for.** It does not replace an ADR that genuinely reverses another
  (that is a new ADR plus a ⛔ notice pointing at it), and it is not a licence to edit ADR prose.
- **Point at `0143` and ADR-010 as the worked example**, by name — the reader needs to see one.

### Constraints

- ⛔ **Do not change how the skill writes a new ADR.** Steps 1–4 and the template are out of scope
  except where the correction procedure must reference them.
- ⛔ **Do not invent a third marker.** ⚠️ and ⛔, per `0143`.
- ⛔ **Do not edit ADR-010, ADR-032, or any other ADR** under this task. The skill learns the form; it
  does not apply it.
- ⛔ **Do not touch `ai-agents/wiki-vault/`.**
- ⚠️ **`claude/skills/` is the canonical source; `.claude/skills/` is a gitignored refresh copy.** Edit
  `claude/skills/fkit-record-decision/SKILL.md` only.
- **Not dual-homed.** Verified 2026-08-02: `claude/scaffold/` ships `ai-agents/`, `CLAUDE.md`,
  `AGENTS.md` and `universal-rules.md` — **no skills directory**, so there is no scaffold copy of this
  skill to keep byte-identical. Checked at scoping time per ADR-027 §Decision 1. **Re-check at
  implementation time** rather than trusting this line.

## Verification steps

1. `claude/skills/fkit-record-decision/SKILL.md` contains a correction/amendment procedure that did not
   exist before.
2. All **seven** pieces are present and checkable by `grep`: the three-part shape; the two-marker legend with
   both glosses; the *"left byte-identical"* clause and the `+N / −0` proof commands; the
   below-the-claim placement rule **and its stated rationale**; the header-bullet form including its
   append-only exception.
3. The below-the-claim rule's rationale is present as prose, not as a bare rule — a reader who disagrees
   with the placement can find out why it was chosen without opening `0143`.
4. The section states that a corrected ADR's `**Status:**` stays `accepted`.
5. The section states what a correction note is not for, including the reversal case.
6. `0143` and ADR-010 are named as the worked example.
6a. **The indentation rule is stated, including the indent-0 prose case** (piece 6) — a reader correcting
   a top-level paragraph is told what column the note starts in.
6b. **The cross-reference rule is stated** (piece 7) — the skill says that when two sites share a fact,
   one site carries it and the others point at it **and say they are pointing on purpose**. Both are
   checkable against `0195`'s two shipped blocks in ADR-010.
7. Steps 1–4 and the ADR template are unchanged except for any cross-reference the new section needs —
   check by diff.
8. `npm test` passes. If a test asserts on this file's structure (e.g. the `SKILL.md` H1 house-style
   guard, task `0152`), it must be green; if no such test exists yet, **say so rather than claiming it
   passed**.
9. No file under `ai-agents/knowledge-base/decisions/` or `ai-agents/wiki-vault/` is modified.

## Notes

- **Depends on:** nothing. `0143` is closed and the form is settled; every ruling this task encodes has
  already been made.
- **Blocks:** nothing formally. **But it is the reason `0195`, `0196` and `0197` each have to re-read
  `0143`'s worklog** — until this lands, every ADR-010 follow-up rediscovers the form from a closed task
  folder. Landing it first would make those three cheaper; it is not a hard prerequisite for any of them.
- **Owner is `fkit-coder`, not the architect.** The form is already decided — this is encoding a settled
  ruling into a procedure file, which is implementation. If the implementer finds the five pieces
  underdetermined in a way that changes what gets written, **stop and route the question to the
  architect** rather than deciding the form's shape alone.
- **⚠️ Priority 176 is APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly above `0195`**, at the head of the ADR-010 follow-up run, because it
  is the only one of the five that makes the other work cheaper rather than more, and because every day
  it is not done is another chance for a second architect to invent a second form. It is not ranked
  higher than that only because `0195` repairs a live self-contradiction and this one repairs a gap.
  Filed by a spawned producer with no owner channel, which never re-ranks (ADR-035,
  `/fkit-task-brief` step 5). No existing row was renumbered.
- No commit — leave the edit in the working tree.
