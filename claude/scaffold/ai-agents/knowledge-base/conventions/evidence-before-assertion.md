# Evidence before assertion

> **The standing rule that a claim about repository or project state must come from a check made this
> turn — never from memory, an earlier turn, or a skill's boilerplate.**
>
> This is a **starting convention**, shipped with the project scaffold. It is yours to amend — but the
> rule it fixes is a real, recurring failure mode: an agent answering *"does this work exist?"* by
> checking *"what changed since the last commit?"*, which is the wrong question. The two do not agree
> whenever anything was committed outside the current turn.

## The rule

- **The working tree is not the record. Committed history is.** `git status` / `git diff` answer *"what
  has changed since the last commit?"* They do **not** answer *"does this work exist?"* — that needs
  `git log` / `git show` / reading the file on disk. Using the first to answer the second is the bug
  this convention exists to stop.
- **A claim about repository state requires a check, in the same turn.** Not from memory, not from an
  earlier turn, not from a skill's boilerplate. If it is worth saying, it is worth checking.
- **"I don't know" is a valid, and often correct, answer.** An agent that cannot check must say so
  rather than infer. An unchecked claim stated confidently is worse than no claim — it is acted on.
- **When you are wrong, say the check was wrong.** If a claim and reality diverge, "my
  evidence-gathering was broken" belongs first among the explanations offered, not last.
- **Applies to every role, not just one.** A producer asserting work exists, a reviewer asserting a
  test passed, a coder asserting a file exists — same rule, same failure mode.

## Where this is enforced

- `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-task-brief`, `/fkit-process-stateful-review` — none
  of them claim the whole repository's commit state; each only reports what it itself did.
- `/fkit-status` — never states a count, a status, or a "what's next" not just read out of a file this
  run.
- `/fkit-review` — verifies findings against the actual code before asserting them.

## Related

- [`status-report-format.md`](status-report-format.md) — carries the same generalization as one of its
  Rules: the working tree is not the record.
