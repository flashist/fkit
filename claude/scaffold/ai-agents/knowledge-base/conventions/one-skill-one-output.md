# One skill, one output

> **For any given subject, a skill produces one output — the complete one.** Arguments select
> subjects and provide inputs; they never select output shapes, verbosity levels, or partial/full
> modes.
>
> This is a **starting convention**, shipped with the project scaffold. It is yours to amend — but the
> rule it fixes is a real failure mode: a skill grows a `full` / `summary` / `verbose` variant, the
> same question starts yielding two different answers, and the reader has to know which argument
> returns the complete one. One subject, one output, spares them that.

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

Worked through a few examples, all on the allowed side:

| Invocation | Why it passes |
|---|---|
| `/fkit-task-done <path>` | The path selects **which task** — an operand, and a mandatory one. |
| `/fkit-task-cancelled <path> <reason>` | Path selects the task; the reason is **input content** the output must carry. |
| `/fkit-status <sprint name>` | A sprint name is a **different subject** — a different board — not a second rendering of the same one. It is also the only path to closed sprints in `sprints/done/`. |
| Stateful review's document/scope arguments | Task-id, `--base`, `--scope` all select **what is reviewed**. Multiple operands are still operands. |

## Why the escape hatch exists

A proposed output variant is not automatically a mistake. A skill whose complete output is genuinely
expensive to render can make a real case for a lighter default — right up until the output is made
cheap to produce (a deterministic generator, a cached artifact, a precomputed board), at which point
the variant's justification evaporates and only terseness is left. Whether terseness *alone* is worth
a second output shape is **the owner's call, not a design default** — which is why the escape hatch
below exists instead of a blanket ban.

## The escape hatch

A proposed output-variant argument is an **owner decision at proposal time**, never a silent design
choice. If you believe a skill genuinely needs one, take the proposal to the owner *before* the
variant is written — same shape as an ADR's re-raise trigger: it fires on the proposal, not after
the fact.

## Where this is enforced

- **Every skill's argument contract.** A skill's argument section must describe subjects and inputs
  only, never output modes. `/fkit-status`'s Argument section is the pattern: it states the contract
  and explicitly disclaims reserved words and modes.
- **`/fkit-plan-task` and task briefs.** A brief specifying a new skill, or a new argument on an
  existing one, must pass the litmus test above or route through the escape hatch.
- **Review.** A reviewer who sees a new output-shape argument in a skill diff flags it against this
  convention.
