# Conventions — the project's standing law

Documents the project **reads on a normal run and defers to as law**. A convention is not advice and
not history: it is the rule that is in force *right now*, and an agent that contradicts it is wrong.

| | records | answers |
|---|---|---|
| **`conventions/`** (here) | **what the rule is** | "how must I do this?" |
| `../decisions/` (ADRs) | **why the rule is what it is** | "why was it done this way — and may I change it?" |
| `../reports/`, `../incidents/` | **what happened, once** | "what did we find / what broke, on that day?" |

The three are easy to confuse, and the distinction is the whole point of this folder:

- A convention is **prescriptive and current.** It tells you what to do. It is **maintained in place**
  — when it stops being true, you **edit it**, you don't append to it.
- An **ADR** is a *decision record*. It explains the reasoning and the rejected alternatives, and it is
  **immutable** once accepted. An ADR may *create* a convention; it never *is* one. If you have to read
  an ADR to know how to format a status report, the convention is missing.
- A **report** or an **incident** is a record of a moment and is **never promoted here.** If a report's
  conclusion hardens into a rule the project follows, the rule gets written as its **own** convention
  document, and the report stays where it is as the evidence behind it.

## What's here

Five conventions ship with the scaffold. They are **yours to amend** — but amend them *here*. A
convention has exactly one home; a second copy of a rule is how the two drift apart and the project
stops knowing which one is law.

| File | In force over |
|---|---|
| [`task-status-vocabulary.md`](task-status-vocabulary.md) | the valid task statuses, and who may set each |
| [`task-owner-vocabulary.md`](task-owner-vocabulary.md) | the seven valid task owners, and that every brief carries exactly one |
| [`status-report-format.md`](status-report-format.md) | the shape of a status briefing — six beats, then the board |
| [`evidence-before-assertion.md`](evidence-before-assertion.md) | a claim about repo/project state must come from a check made this turn |
| [`one-skill-one-output.md`](one-skill-one-output.md) | a skill yields one complete output per subject — arguments select subjects, never output variants |

## Naming

`<subject>.md` — a plain, current name. **Never dated.** A dated filename means "a record of a
moment", and a record of a moment is not a convention. If a document needs a date in its name to make
sense, it belongs in `../reports/` or `../incidents/`.

## The bar for adding one

A new document earns a place here only if **all four** hold:

1. **It is read on a normal run.** Some agent, skill, or session consults it as part of doing ordinary
   work — not once, and not only when something goes wrong. If nothing reads it, it is a report.
2. **It is prescriptive.** It says what *must* be done, in a form that can be complied with or
   violated. A description of how something currently works is `../architecture.md`, not a convention.
3. **It is enforceable somewhere.** A convention nobody can check is a preference. State where it is
   enforced — ideally in tooling or code where the check runs automatically, not left to memory.
4. **It is not already covered.** Prefer **amending an existing convention** to adding another
   document. A few well-known conventions beat many that nobody has read.

Anything that doesn't clear that bar is a report, an ADR, or a task brief.

**Who writes here.** Whoever owns the convention — it is not the architect's monopoly. But a *new*
convention is a rule imposed on every future run, so it needs the **owner's** sign-off.

## Lifecycle — maintained, not archived

A convention is **edited in place** to stay true, and it carries no changelog: git is the changelog.
When it is genuinely retired, **delete it** and record the retirement in the ADR that retires it — a
dead rule left lying here is worse than no rule, because it still reads as law.
