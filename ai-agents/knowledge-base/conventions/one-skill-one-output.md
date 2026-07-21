# One skill, one output

> **For any given subject, a skill produces one output — the complete one.** Arguments select
> subjects and provide inputs; they never select output shapes, verbosity levels, or partial/full
> modes.
>
> Ruled by the owner on 2026-07-17 (Sprint 2 open question 8), generalizing the 2026-07-16 ruling
> that removed `/fkit-status full` (verbatim): *"there should be 1 version of the output if I run the
> skill, no additional arguments."* Task 44 applies that ruling to `/fkit-status`; this document is
> the standing rule for **every** fkit skill.

## The rule

Running a skill on a subject yields exactly one output, and it is the complete one. There is no
`full`, no `all`, no `board`, no verbosity flag, no summary/partial mode, and no conditional
variant ("delta unless much has changed" is the same defect wearing a different hat). If the
complete output feels too heavy to render every time, the fix is to make it cheaper to produce —
not to hide it behind an argument the owner has to know about.

## Operands are not variants — the litmus test

Many skills *require* arguments, and this rule does not touch them. The distinction:

- **Operands / subjects** — arguments that select **what the skill operates on** (a task file, a
  sprint, a review document, a diff scope) or provide **input content** (a cancellation reason, a
  question, a task description). ✅ Allowed — often mandatory.
- **Output variants** — arguments that select **which version of the output** the *same* subject
  yields (`full` / `all` / `board`, verbosity levels, summary or partial modes, conditional
  render-less-unless behavior). ⛔ Forbidden.

**Litmus test (one line):** does the argument change *what the skill works on*, or *what the same
work looks like when reported*? The first is a parameter; the second is a variant.

Applied to the owner's own examples, all on the allowed side:

| Invocation | Why it passes |
|---|---|
| `/fkit-task-done <path>` | The path selects **which task** — an operand, and a mandatory one. |
| `/fkit-task-cancelled <path> <reason>` | Path selects the task; the reason is **input content** the output must carry. |
| `/fkit-status <sprint name>` | A sprint name is a **different subject** — a different board — not a second rendering of the same one. It is also the only path to closed sprints in `sprints/done/`. (Per task 44's brief.) |
| Stateful review's document/scope arguments | Task-id, `--base`, `--scope` all select **what is reviewed**. Multiple operands are still operands. |

## History — recorded honestly

This rule is written from a single instance, and the instance was **not a mistake**. The
`/fkit-status full` keyword and its delta default (task 38,
[`add-full-board-switch-to-fkit-status.md`](../../tasks/done/0005-add-full-board-switch-to-fkit-status/brief.md)
— frozen history, `✅ Done`, because it *was* done) were **correct when written**: the board was
hand-built by the LLM, and re-rendering 43 rows meant re-deriving every marker and risking a
miscount. Deltaing served both terseness and accuracy.

Task 41 made the board a free, deterministic `bash dashboard.sh` call — and *that* retired the
variant's justification. What survived was terseness alone, and the owner ruled on it. The lesson
the convention encodes is not "variants are always wrong to propose"; it is that whether one is
ever worth its cost is **the owner's call, not a design default** — which is why the escape hatch
below exists.

## The escape hatch

A proposed output-variant argument is an **owner decision at proposal time**, never a silent design
choice. If you believe a skill genuinely needs one, take the proposal to the owner *before* the
variant is written — same shape as an ADR's re-raise trigger: it fires on the proposal, not after
the fact.

## Where this must be enforced

- **Every `claude/skills/*/SKILL.md` argument contract** — the argument section must describe
  subjects and inputs only. `claude/skills/fkit-status/SKILL.md` §"Argument" is the pattern: it
  states the contract and explicitly disclaims reserved words and modes.
- **`/fkit-plan-task` / task briefs** — a brief specifying a new skill (or a new argument on an
  existing one) must pass the litmus test, or route through the escape hatch.
- **Review** — a reviewer seeing a new output-shape argument in a skill diff flags it against this
  convention.
- `claude/scaffold/ai-agents/knowledge-base/conventions/` — the scaffold ships the conventions, so
  new projects inherit this rule; this file must be added there. *(Out of this document's task
  scope — flagged for a follow-up.)*

## Provenance

- Task 44 — the instance: [`remove-output-variants-from-fkit-status.md`](../../tasks/done/0074-remove-output-variants-from-fkit-status/brief.md)
- Task 38 — the honest history: [`add-full-board-switch-to-fkit-status.md`](../../tasks/done/0005-add-full-board-switch-to-fkit-status/brief.md)
- Sprint 2 plan — the OQ8 ruling and the tasks-44/45 and task-47 addenda: [`sprint-2.md`](../../sprints/sprint-2.md)
