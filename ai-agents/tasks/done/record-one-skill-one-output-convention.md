# Record the "one skill, one output" convention

## ID
0064

## Sprint
Sprint 2

## Priority
47

## Status
✅ Done

## Context

**The owner ruled (2026-07-17) that the task-44 principle generalizes** — resolving Sprint 2 open
question 8. Background: the owner ran `/fkit-status`, was told to run `/fkit-status full` for the
complete board, and ruled (verbatim): *"there should be 1 version of the output if I run the skill, no
additional arguments."* Task 44 applies that to `/fkit-status`; this task records it as a **standing
convention for every fkit skill**, in `ai-agents/knowledge-base/conventions/` — the home of standing
rules about how the project's artifacts are written (`task-status-vocabulary.md`,
`evidence-before-assertion.md`).

**The owner's one qualification, raised while ruling, is the heart of the document:** many skills
*require* arguments — `/fkit-task-done <path>`, `/fkit-task-cancelled <path> <reason>`,
`/fkit-status Sprint 1`, stateful review's document/scope arguments. The convention must not forbid
those. The distinction it draws:

- **Operands / subjects** — arguments that select **what the skill operates on** (a task file, a
  sprint, a review doc, a scope) or provide **input content** (a cancellation reason). ✅ Allowed —
  often mandatory.
- **Output variants** — arguments that select **which version of the output** the same subject yields
  (`full` / `all` / `board`, verbosity flags, summary/partial modes, conditional "delta unless much
  changed" behavior). ⛔ Forbidden.

**Litmus test (one line):** does the argument change *what the skill works on*, or *what the same work
looks like when reported*? The first is a parameter; the second is a variant.

**Why a convention and not an ADR** (producer's recommendation, owner accepted by ruling OQ8 this
way): this repo's ADRs record mechanism and structure; this is a rule about how skills are written —
and a convention has more teeth: it stops the *next* `full` from being written, where a tombstone ADR
only explains why this one died. (Sprint 2 plan, "The tombstone-ADR call" section.)

## What to build

One document: `ai-agents/knowledge-base/conventions/one-skill-one-output.md`, matching the tone and
structure of the existing conventions entries. It must contain:

- **The rule:** for any given subject, a skill produces **one output — the complete one**. Arguments
  select subjects and provide inputs; they never select output shapes, verbosity levels, or
  partial/full modes.
- **The operand-vs-variant distinction and the litmus test** (above), with the owner's own examples on
  the allowed side: `/fkit-task-done <path>`, `/fkit-task-cancelled <path> <reason>`,
  `/fkit-status <sprint name>` (a different *subject*, not a variant — per task 44's brief), stateful
  review's document arguments (multiple operands are still operands).
- **The tombstone context, honestly stated:** `full` (task 38) was **correct when written** — the
  board was hand-built by the LLM and expensive to re-render — and became wrong only when task 41 made
  rendering a free `bash dashboard.sh` call. The convention is written from a single instance and says
  so.
- **The escape hatch:** a proposed output-variant argument is an **owner decision**, not a silent
  design choice — the proposal goes to the owner before the variant is written. (Same shape as the
  additive-convergence re-raise trigger: fires on the proposal.)
- **Provenance links:** task 44's brief, task 38's brief in `tasks/done/` (frozen history), and the
  Sprint 2 OQ8 entry.
- Update `ai-agents/knowledge-base/conventions/README.md` if it indexes the entries (check first —
  follow whatever the existing entries did).

## Verification steps

- The file exists at `ai-agents/knowledge-base/conventions/one-skill-one-output.md` and its structure
  matches the existing conventions entries (compare against `task-status-vocabulary.md`).
- The rule, litmus test, and **all four** owner-raised examples (task-done, task-cancelled,
  status-with-sprint-name, stateful-review docs) are present and classified as **allowed operands**.
- `full`/task 38 is recorded as **correct at the time**, not as a mistake — the document does not
  smooth over the history.
- The escape hatch (variant proposals go to the owner) is present.
- Every link in the document resolves (task 44 brief, task 38 brief in `tasks/done/`, sprint-2 plan).
- Applying the litmus test to the current skill set flags **no existing violation other than the one
  task 44 already removes** — if it flags another, that is a finding to surface, not to fix in this
  task.
- No file outside `ai-agents/knowledge-base/conventions/` is modified; nothing in
  `ai-agents/wiki-vault/` is touched.

## Notes

- **Owner: fkit-architect** — a knowledge-base document recording a standing rule; no code.
- **Depends on: nothing.** Task 44 (the `/fkit-status` variant removal) is the *instance*, this is the
  *rule* — they are independently shippable in either order. **Does not block task 44.**
- **Scope boundary:** this task **records** the convention; it does **not** audit-and-fix the skill
  set. If writing the document surfaces another live variant, flag it — a fix is a new brief.
- The wiki will pick this up in a later sync (fkit-wiki's exclusive write path) — **do not** ingest it
  into the vault as part of this task.
