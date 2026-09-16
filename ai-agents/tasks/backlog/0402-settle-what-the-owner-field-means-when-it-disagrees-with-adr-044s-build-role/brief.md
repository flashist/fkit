# Settle what `## Owner` means when it disagrees with ADR-044's build role

## ID
0402

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

⚠️ **Producer judgement, flagged — and knowingly recursive.** The deliverable is a ruling recorded via
`/fkit-record-decision`, which `claude/skills-for-role.sh` assigns to `architect`;
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
Decision 1 fixes the build role by the deliverable's skill owner, so this follows the rule directly.
⛔ **The producer notes without irony that this field is the very thing the row settles.** ⚠️ **If the
plan gate rules the deliverable is a convention-doc amendment and no ADR**, the build role becomes
`fkit-coder` under ADR-044's skill-less clause — raise it at the gate rather than proceeding on this
field.

## Context

### Provenance

**Owner ruling, 2026-09-16**, given live via `AskUserQuestion` in a `fkit lead` session (Sprint 9
wrap-up), multi-select, verbatim option label **"0392/0393 owner field"**. Source: the wiki
librarian's third sync pass of 2026-09-16, recorded in `ai-agents/wiki-vault/log.md`'s entry for that
date. Filed by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

### ⛔ THIS IS A DECISION TASK, AND ITS SUBJECT IS FUTURE ROWS.

`0392` and `0393` are **closed and frozen**. This row does not re-open them. It settles the standing
rule their flags asked for and never got.

### The open flag — re-read on disk 2026-09-16 at filing

Both closed briefs carry `## Owner: fkit-architect` under a block flagging it as unsettled. `0392`'s
opens *"**THE OWNER FIELD IS A PRODUCER JUDGEMENT AND IS FLAGGED FOR THE OWNER — the three originals
did not agree.**"* and closes *"⛔ **This is not settled.**"*. `0393`'s says the same over two
originals and adds *"**This row cuts both ways and the choice is genuinely arguable**"*.

The disagreement in the consolidated originals, as both briefs record it:

| Original | `## Owner` |
|---|---|
| `0251` | `fkit-coder` |
| `0376` | `fkit-coder` |
| `0366` | `fkit-architect` |
| `0286` | `fkit-coder` |
| `0323` | `fkit-architect` |

**Sprint 9 did not settle it.** In practice the owner ruled **per row** that the coder built both —
`0392`'s J2, verbatim option label *"Coder builds all (Rec)"*, 2026-09-14. ⛔ **A per-row ruling is
not a standing rule**, which is why the flag is still open and the next row of this shape will ask
again.

### The work shape in question

Prose repair to a knowledge-base coordination document — `architecture.md` and its kin — which
typically mixes:

- **mechanical, coder-shaped work** — re-deriving a count from `ls`, correcting a citation, applying a
  sweep; and
- **judgement, architect-shaped work** — deciding what a section *should say*, whether a referent is
  the intended one, whether a guard is feasible.

`0392`'s own flag names the split inside a single row: *"**Group A is the exception**: re-deriving a
suite count from `ls test/*.test.js` is mechanical and coder-shaped."*

⭐ **This is a live, recurring class, not a post-mortem.** `0397`, `0398`, `0399` and `0400` — all
open — carry the identical `fkit-coder` judgement over the identical work shape, each flagged on its
own brief. **Every one of them will re-raise this question at its plan gate until it is settled.**

### The two questions, and why they are one brief

**Q1 — Which role owns this work shape for future rows?** ADR-044 Decision 1 already fixes the
**Build** role: a deliverable naming no skill — *"source, tests, scaffold, prose under `claude/`,
coordination-doc repairs"* — *"is the coder's, as sole source-write authority, **whatever `## Owner`
says**."* ⛔ **Coordination-doc repairs are named explicitly, and the clause explicitly overrides
`## Owner`.** So the Build role is *already answered* — and the real question is what is left.

**Q2 — What does `## Owner` mean when ADR-044 has already overridden it?** Three readings, none
recorded anywhere:

1. **`## Owner` = accountability, Build = execution.** They are allowed to differ; `## Owner` names
   the seat answerable for the outcome, ADR-044 names the hands. *Consistent with
   `conventions/task-owner-vocabulary.md`'s* *"the role whose seat the work sits in"* *and* *"it does
   not change just because another role consulted on the task"*. **Then the flags on `0392`/`0393`
   were never a defect and the field needs no change — only a note saying so.**
2. **`## Owner` should match the Build role.** Then every coordination-doc-repair brief writes
   `fkit-coder` and the architect flag was simply wrong. Simplest to apply; loses the accountability
   distinction.
3. **`## Owner` is redundant for rows ADR-044 covers** and should be derived rather than authored.
   Largest change; touches `fkit-task-brief`, the vocabulary doc, and the dashboard's planned
   `brief-missing-owner` drift check.

⛔ **Q2 is the actual open question and Q1 is mostly already answered by ADR-044.** Say so in the
record rather than re-deciding Q1 from scratch.

### The sub-question — should `## Owner` be re-stated on closed briefs?

The ruling must also say whether it applies **backwards**. The producer's read, offered as input and
not as the answer: **it should not.** Closed history is frozen — the same principle by which a
`✅ Done` board row is never renumbered — and `0392`/`0393` carry an accurate, dated record of an
*unsettled* judgement, which is true and worth keeping.

⛔ **If the owner rules otherwise, editing the closed briefs is a SEPARATE follow-up brief, not this
row.** This row writes guidance; it does not touch `ai-agents/tasks/done/`.

### Dependencies and constraints

- ⚠️ **ADR-038** fixes a loop step's role by the skill the step runs; **ADR-044** Decision 2 is an
  owner-ruled scoped exception to it for the Plan step only. Read both before proposing anything —
  the scope boundary is explicit and must not be widened by accident.
- ⚠️ **`0345`** (open) carries ADR-044's Build-and-Plan role rule into the ship loop and the agent
  text. **If this ruling changes what `## Owner` means, `0345`'s carry may need to change with it.**
  Not a hard dependency; check it at the plan gate.
- ⚠️ **`0362`** (open) asks who runs process-review on an architect-owned task — **the same
  field-versus-loop-role tension, one step over.** Whichever runs second cites the first.
- `conventions/task-owner-vocabulary.md` is **dual-homed and must-match** (byte-identical across the
  live and scaffold homes at filing). Any edit to it edits both copies identically, or
  `test/dual-home-parity.test.js` goes red.

## What to build

1. **Re-read the two flags on disk** (`0392`'s and `0393`'s `## Owner` blocks) and quote them into the
   record, so the ruling is anchored to what was actually asked.
2. **Re-derive the live population** — every open brief whose `## Owner` carries a flagged
   coordination-doc-repair judgement. At filing: `0397`, `0398`, `0399`, `0400`. Record the command.
   ⭐ **The size of this population is the argument for settling it.**
3. **State plainly what ADR-044 already settles** (the Build role for coordination-doc repairs,
   `## Owner` notwithstanding) so the ruling does not re-decide it.
4. **Weigh the three readings of `## Owner`** against `task-owner-vocabulary.md`'s existing
   definition, the cost of amending it, and what the dashboard's planned owner drift check would then
   mean.
5. **Put the choice to the owner**, together with the backwards-application sub-question, with one
   recommendation and its main tradeoff. ⛔ **The owner rules; do not pick.**
6. **Record the ruling** and, if it changes the field's meaning, say exactly which of
   `conventions/task-owner-vocabulary.md`, `claude/skills/fkit-task-brief/SKILL.md` and ADR-044 must
   change — and whether that is this row or a follow-up.
7. ⛔ **Write nothing under `ai-agents/tasks/done/`.** Closed briefs are out of scope whatever the
   ruling says; a backwards edit is a separate brief.

## Verification steps

1. The record states, in one sentence a brief-writer can act on, **what value `## Owner` takes on a
   coordination-doc-repair brief** and whether it may differ from ADR-044's Build role.
2. The record answers the backwards question explicitly — closed briefs re-stated, or not — and, if
   yes, names the follow-up rather than performing it.
3. The record names the owner ruling verbatim (the option label), with its date and channel.
4. The record quotes `0392`'s and `0393`'s flags and names every open brief in the step-2 population.
5. The record states which downstream documents change as a consequence, or states that none do.
6. `git diff --stat` shows **nothing** under `ai-agents/tasks/done/`.
7. `node --test test/dual-home-parity.test.js test/reference-integrity.test.js
   test/coordination-citation-policy.test.js` — green; state the counts. ⭐ If
   `task-owner-vocabulary.md` was amended, both homes changed identically — that is what the first
   suite proves.
8. `git diff --stat` touches the new or amended record, this task folder, and (only if the ruling
   required it) the named downstream documents. ⛔ Nothing under `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing hard. ⚠️ It **unblocks a recurring plan-gate question** on `0397`, `0398`,
  `0399` and `0400`; each of those ships without it, re-raising the flag as they go.
- ⚠️ **One brief, not a split — producer judgement, flagged.** The role question and the
  re-state-on-closed-briefs question could be two rows. They are one because they are two halves of
  *"what does this field mean"*, one analysis answers both, and splitting would put the same question
  to the owner twice — the same reasoning `0396` records for its own single-brief call. If the owner
  wants the backwards question handled separately, splitting at the plan gate is reasonable.
- ⚠️ **Filed UNRANKED and APPENDED LAST** on the Backlog board by a spawned producer with no owner
  channel; renumbers and inserts nothing
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- Cite `ai-agents/…md` files by quoted text, not line coordinates.
- ⛔ No wiki write ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ No commit.
