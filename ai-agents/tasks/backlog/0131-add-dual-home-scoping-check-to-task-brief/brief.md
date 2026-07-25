# Add the dual-home scoping check to `/fkit-task-brief`

## ID
0131

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

[ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
§Decision 1 requires that **`/fkit-task-brief` gains a scoping check: a brief touching a dual-homed path
must name both copies**, and marks it *"(Producer-scoped brief, owner: fkit-coder.)"*

**That brief was never filed.** ADR-027 was accepted 2026-07-19; a sweep on 2026-07-25 found no task
for this anywhere in `backlog/`, `done/`, or `cancelled/`. This brief closes the gap.

**Why it matters, concretely.** The standing convention
([`dual-home-parity.md`](../../../knowledge-base/conventions/dual-home-parity.md)) says an fkit-authored
file living in both `ai-agents/` and `claude/scaffold/ai-agents/` is edited in **both, in the same
change**. Today nothing in the briefing procedure prompts that, so a brief naming only the live copy is
written, implemented, and reviewed without anyone noticing the scaffold half. ADR-027 records this drift
had **already recurred four times** before the ADR; task 0132 documents a fifth
(`dependency-declaration-form.md`, missing from the scaffold). The convention is advisory until something
asks the question at scoping time — this task is that something.

**⚠️ This is a `/fkit-task-brief` edit, and `/fkit-task-brief` is itself dual-homed.** The change must
land in both copies, per the very rule it adds. That is not irony to be smiled at — it is verification
step 4.

## What to build

1. **A scoping check in `claude/skills/fkit-task-brief/SKILL.md`**, in the drafting steps (natural home:
   step 3 *Decompose* or step 4 *Draft each brief* — the coder's call, but it must fire **before** the
   brief is written, not in the report at the end). It must:
   - State the litmus from `dual-home-parity.md`: **fkit-authored** files are dual-homed;
     **project-specific** files are not.
   - Name the never-sync exceptions explicitly so the check does not create the opposite bug —
     `PROJECT.md`, `wiki-vault/index.md`, `wiki-vault/log.md`, where the scaffold copy is a deliberate
     **placeholder**. Copying those ships fkit's own project data into a user's repo.
   - Require that a brief touching a dual-homed path **names both copies** in `## What to build`, not
     just the live one.
2. **The same edit in the scaffold copy** of the skill, if `/fkit-task-brief` is dual-homed (confirm
   first — do not assume; check `claude/scaffold/` for the skill tree).

**This adds an instruction to a procedure. It does not add an argument to a skill** — `/fkit-task-brief`
keeps its single output shape ([`one-skill-one-output.md`](../../../knowledge-base/conventions/one-skill-one-output.md)).

## Verification steps

1. `claude/skills/fkit-task-brief/SKILL.md` contains a dual-home scoping check that fires before the
   brief is drafted, carrying the fkit-authored/project-specific litmus.
2. The three never-sync placeholder paths (`PROJECT.md`, `wiki-vault/index.md`, `wiki-vault/log.md`) are
   named as exceptions in the check text.
3. A dry-run scoping of a **known dual-homed path** (e.g. `knowledge-base/conventions/status-report-format.md`)
   produces a brief naming **both** copies; a dry-run on a project-specific path does not.
4. If the skill is dual-homed, both copies carry the change and are byte-identical.
5. The existing test suite is green (this task adds no test of its own — 0133 is the mechanical
   enforcement).

## Notes

- **Owner:** fkit-coder.
- **Depends on:** nothing. Independent of 0132 and 0133 — it prevents *future* drift where those two fix
  and detect *existing* drift.
- **Blocks:** nothing.
- **Filed 2026-07-25** from a producer sweep of ADR-027's follow-ups; the ADR named three producer-scoped
  briefs and none had been filed. Siblings: 0132 (reconcile), 0133 (the parity test).
- **A procedural check is not a guarantee** — it prompts the person scoping, and a scoping step can be
  skipped exactly the way the convention already can. 0133's mechanical test is the enforcement; this is
  the cheap early catch, and ADR-027 deliberately wanted both.
- No commit — leave the edit in the working tree.
