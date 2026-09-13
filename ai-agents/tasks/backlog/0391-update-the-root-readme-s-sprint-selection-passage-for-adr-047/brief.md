# Update the root `README.md`'s sprint-selection passage for ADR-047

## ID
0391

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner ruling 2026-09-12**, given live via `AskUserQuestion` in the `fkit lead` session driving
`/fkit-sprint-ship-loop` — **the option label is the verbatim text**: **"File a follow-up (Rec)"**.
Raised in task `0339`'s round-1 review. ⛔ The ruling is *file it*, **not** *do it*.

### ⛔ THE GRADE IS `PARTIALLY CORRECT` — this is an INCOMPLETENESS, NOT A FALSEHOOD

The reviewer graded the passage **PARTIALLY CORRECT**: *"not false about what it explains, but
incomplete after ADR-047."* ⛔ **State it that way and keep it that way.** Everything the paragraph
asserts is still true — the backlog **is** still excluded, its identity **is** still `Backlog`, and
identity **is** still part of selection. What changed is that identity is no longer the *whole* rule.
⚠️ **A fix written as if the sentence were wrong will over-correct and delete true content.**

### The wording that actually ships, `README.md:47-51` — quoted verbatim 2026-09-13

> Since
> [ADR-041](ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
> the active sprint is selected by each plan's resolved **identity**, and the backlog is excluded
> because its identity is `Backlog`, which is never eligible — a stronger rule, not a weaker one. Your
> board works correctly; only its header sentence is wrong. Correct it by hand if you want it accurate;
> nothing depends on it.

### What ADR-047 changed, and what the passage therefore under-describes

[ADR-047](../../../knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md)
— *"A sprint has an explicit status, and 'current' means EVERY `In progress` sprint — not the
highest-numbered one"* — moved the model in **two** ways the paragraph does not carry:

1. ⭐ **"The active sprint" is now PLURAL.** *Current* means **every** sprint whose board's line-3
   banner reads `🔄 In progress`, and several at once is legal. The README says *"the active
   sprint"*, singular, throughout.
2. ⭐ **Eligibility gained a STATUS RUNG.** Selection is no longer identity-only: a board with an
   eligible identity but **no** line-3 banner, or a **malformed** one, resolves to status
   `unresolved` and is **never eligible** (ADR-047 §7, which also fires `drift
   sprint-status-missing` / `drift sprint-status-malformed`). The README describes selection as
   turning on identity alone.

⚠️ **Verified 2026-09-13: the string `ADR-047` does not occur in `README.md` at all** (0 matches).
The front door describes the pre-Sprint-8 model.

### Why it matters more than its size

⛔ **This is the repo's front door.** It is the first and often only page a prospective adopter reads,
and it now under-describes the model Sprint 8 built. ⚠️ **Nothing is red** — no test asserts README
prose. The cost is a reader forming a singular, identity-only mental model of sprint selection and
then being surprised by a multi-sprint board set or by a banner-less board going ineligible.

## What to build

**Edits confined to `README.md`. Nothing else.**

1. **Make the plural true.** Correct *"the active sprint"* to the ADR-047 model: *current* is every
   `🔄 In progress` sprint, and more than one is legal.
2. **Add the status rung** to the one-line description of eligibility, so identity is presented as
   one of two conditions rather than the only one.
3. **Cite ADR-047** alongside the existing ADR-041 link. ⛔ **Do not remove the ADR-041 citation** —
   ADR-041's identity rule is not superseded, it is joined.
4. ⛔ **Keep every still-true clause**, in particular *"Your board works correctly; only its header
   sentence is wrong"* and *"nothing depends on it"*, both of which remain accurate.

⚠️ **Re-read the passage at pickup and re-quote it.** The block quoted above was measured 2026-09-13
and `README.md` is edited often. Match the surrounding register — the section is written for an
adopter, not for a maintainer, so a full recitation of ADR-047's rungs does not belong here. ⭐ **One
or two sentences plus the link is the right size.**

### ⛔ Out of scope

- ⛔ **No behaviour change.** No script, no skill, no test.
- ⛔ **No sweep of other README sections** for other post-Sprint-8 staleness. If you find some, ⚠️
  **record it in the worklog and raise it at the plan gate** — do not widen the task silently.
- ⛔ **No edit to ADR-041, ADR-047, or `sprint-status-vocabulary.md`.** They are the sources this
  paragraph must agree with; they are not what is stale.
- ⛔ **No re-rank of any board** (ADR-035). ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005).
  ⛔ **No new devDependency** (ADR-014).

## Verification steps

1. **The passage names the plural.** A reader of `README.md` alone can state that more than one sprint
   may be current at a time.
2. **The passage names the status rung.** Eligibility reads as identity **and** an `In progress`
   line-3 banner, not identity alone.
3. **Both ADRs are cited and both links resolve.**
4. **No true clause was lost.** Diff the paragraph against the quote in § *Context* and confirm each
   still-true assertion survives, in substance.
5. **Reference integrity unchanged.** `node --test test/reference-integrity.test.js` reports **0
   broken**. ⛔ **Do not add a `NAMED_EXEMPT` entry** to make anything pass.
6. **Citation policy unchanged.** `node --test test/coordination-citation-policy.test.js`.
7. **Nothing else changed.** `git diff --name-only` lists `README.md` and this task folder, and
   nothing else.

⛔ **Do not hardcode any pass/fail total from this brief. Re-derive the baseline at pickup.**

## Notes

- **Depends on:** nothing. ⚠️ **But note the causal link:** `0339` is what makes this passage stale,
  by teaching the lead and producer the ADR-047 plural model, and **`0339` is closing now**. ⛔ **That
  is context, not a dependency** — this task is correct to pick up whether or not `0339` closes,
  because ADR-047 is already accepted and is what the README must agree with.

- **Estimated size: one or two sentences and a link.** ⚠️ The verification costs more than the edit,
  which is normal for a truth-of-record defect and is not a reason to skip it.

- ⚠️ **Owner is `fkit-coder`.** The deliverable is the repo's root `README.md` — prose that **names no
  producing skill** in `skills_for_role()` (`/fkit-record-decision` produces an ADR, `/fkit-task-brief`
  a brief, `/fkit-wiki-ingest` a vault page; none produces a repo README).
  [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
  **Decision 1** fixes the Build role as the owner of the skill the deliverable is produced by, and its
  skill-less clause staffs a deliverable that names none — *"source, tests, scaffold, prose under
  `claude/`, coordination-doc repairs"* — **to the coder as sole source-write authority, whatever
  `## Owner` says.** A root-README repair is that same species: repo-level coordination prose with no
  owning skill. ⛔ **The producer cannot own it** — no producer skill writes the repo README.

- ⚠️ **Placement: Backlog board, UNRANKED, APPENDED LAST.** Filed 2026-09-13 by a **spawned
  `fkit-producer` with no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  executing the mechanics of the relayed owner ruling named in § *Context* and deciding nothing beyond
  them. Nothing was renumbered and nothing was inserted mid-board
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

- ⚠️ **`0383`** (*"shrink the backlog board whose task cells are being used as a document store"*) is
  open and targets the cell bloat a long Task cell adds to. This row's board cell was kept short and
  the detail left here; ⛔ it is **not** a dependency in either direction.
