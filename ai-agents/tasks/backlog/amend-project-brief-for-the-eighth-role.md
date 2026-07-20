# Amend the product brief for the eighth role — `PROJECT.md:8` and `:72`

## ID
0015

## Sprint
Sprint 2

## Priority
83

## Status
🔲 Backlog

## Context

[**ADR-028**](../../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md)
adds an **eighth** role — a sandboxed e2e tester. `ai-agents/knowledge-base/PROJECT.md` still describes
a team of seven, in two places:

- **`PROJECT.md:8`** — *"fkit is a **team of seven role-scoped AI agents for software development** —
  a producer, a coder, a reviewer (with an adversarial second opinion), an architect, a wiki
  librarian, and a team-room lead…"*
- **`PROJECT.md:72`**, under *## Conventions & constraints* → *Stage: Prototype* — *"Near-term goal is
  a user-friendly startup sequence and a solid working set of **seven** roles with dedicated skills;
  hardening/polish is the current focus, **not breadth**."*

**Split out of [task 82](refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role.md) by owner
ruling, 2026-07-19**, which honors **ADR-028:154-157**: the `PROJECT.md` amendment is the *"owner's or
producer's call — **the brief is the product document, not the architect's**."* Task 82 corrects the
same count in the architect's documents and is separately owned.

### 🔴 `:72` is not a count fix. That is the whole reason this task exists.

**`:8` genuinely is a two-word factual correction.** Had it been the only site, folding it into task 82
would have been right, and that argument was made and nearly carried.

**`:72` is different in kind.** The *"not breadth"* clause is a **product constraint** — a statement
that the project is deliberately not adding roles right now. **ADR-028 is the owner knowingly reversing
that constraint**; the ADR's own framing says so. **Editing `:72` therefore restates the project's
product stance, and is a product judgment, not a typo fix.** That is exactly the case ADR-028:154
carves out for the owner or producer.

**Both sites are in this task**, not just `:72` — splitting one file across two tasks for two adjacent
lines would be worse than either alternative.

### ⚠️ ADR-028 is decided, but NOT built

**The eighth role does not exist.** No agent definition, no skills, no `skills_for_role()` entry —
ADR-028's own follow-up 3 lists those as briefs still to be written, sequenced *after* a CI smoke
script. **The product brief must not describe a team of eight as though a user could invoke the eighth
today.** This is the sharpest hazard in the task and the reason it is not a find-and-replace.

## What to build

- **`PROJECT.md:8` — correct the count and the roster.** The sentence enumerates the roles by name; a
  corrected number above an unchanged six-name list is worse than either error alone. **Name the
  tester, and mark it as decided-not-yet-built** in whatever form reads naturally in a one-sentence
  overview.
- **`PROJECT.md:72` — restate the stance, do not just change the number.** *"not breadth"* is no longer
  accurate as written, since ADR-028 is precisely a breadth decision. **Options for the author to judge
  and put to the owner** — the wording is a product call, not a mechanical one:
  - Keep the constraint and record the exception (*hardening remains the focus; the tester is the one
    deliberate exception, per ADR-028*).
  - Retire the constraint outright, if the owner considers it genuinely lifted.
  - Re-scope it (*not breadth beyond the tester*).
  **Do not silently pick one.** State which was chosen and why in the completion note.
- **Cite ADR-028** at whichever site carries the stance change, so the reversal is traceable to the
  decision that made it rather than looking like drift.

## Verification steps

- **No `seven` remains in `PROJECT.md`** referring to the role count — grep case-insensitively and
  check each surviving hit.
- **The roster at `:8` lists as many roles as the count claims.** Count them.
- **Neither line asserts the tester exists.** Read both as a first-time reader: could they conclude an
  eighth agent is installed and invokable? If yes, it fails. **This is the check most likely to be
  skipped and the one that matters most.**
- **`:72`'s "not breadth" clause is not left standing unchanged next to a corrected count** — that
  combination reads as the brief contradicting itself in one sentence.
- **The stance choice is stated to the owner**, not buried in a diff.
- **Nothing else in `PROJECT.md` was edited.** Diff it. Scope is these two lines.

## Notes

- **Owner: fkit-producer.** `PROJECT.md` is the product brief. **Authority: ADR-028:154-157.**
- **Depends on: nothing.** Independently shippable.
- **⚠️ Needs the owner's sign-off before it ships.** `:72` changes a stated product constraint. The
  producer drafts the wording; **the owner accepts or rejects the stance.** Do not treat producer
  ownership as authority to reverse a constraint the owner set — ownership here means *"drafts it and
  puts it to the owner"*, not *"decides it"*.
- **Sibling tasks, all correcting the same seven→eight claim in different places — enumerated by
  ADR-028:154-169, which says do not re-derive the list:**
  - [**Task 82**](refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role.md) —
    `architecture.md:4,:82`, `CLAUDE.md:7`, `AGENTS.md:7`, `README.md:76`, `claude/README.md:3`, plus
    the ADR-023 pointer. **fkit-architect.**
  - [**Task 81 Part D**](extend-mover-reference-sweep-to-the-knowledge-base.md) —
    `claude/fkit-claude-init.sh:847`, executable source. **fkit-coder.**
  - **`wiki-vault/index.md:11` and `wiki-vault/wiki/systems/fkit.md:7,:15`** — **fkit-wiki's resync,
    not any of these tasks.** No brief filed; flag it to the owner so one gets scheduled.
- **⚠️ The count is now corrected across three tasks by three roles, plus a wiki resync.** Whoever
  closes **last** should re-run a repo-wide `seven` sweep. **Partial completion is a real failure mode
  here:** if this lands and 82 does not, the product brief says eight while the architecture doc says
  seven — two canonical documents disagreeing, which is worse than today's uniform staleness.
- **Do not "fix" the historical hits.** The many `seven` occurrences in ADRs, reports, and closed
  sprint rows are **records of past state and must stay.** Changing them falsifies the record.
- **`claude/scaffold/CLAUDE.md` carries no role count — verified 2026-07-19.** No ADR-027 dual-home
  parity issue.
- **Risk: low mechanically, moderate editorially.** No runtime surface. The risk is writing a brief
  that promises a role which does not exist, or quietly dropping a constraint the owner still holds.
- **Evidence sources:** `ai-agents/knowledge-base/PROJECT.md:8,:72` (both read, not recalled);
  `adr-028-…md:150-172` (follow-ups 1-3); task 82 and task 81 Part D for the split.
