# Evidence before assertion

> On 2026-07-13 the producer made the same class of error three times in one session: it told the owner
> a task's work "did not exist" after checking only `git diff --stat` (uncommitted changes only) — the
> work was committed, and the check answered the wrong question. It repeated the error on a second task
> in the same session, then told the owner **nine times** that a full day of work was uncommitted and
> called it the project's largest risk — the tree had been clean the whole time; the owner had been
> committing between turns. One of the three was a **source defect**, not a lapse:
> `fkit-task-done`/`fkit-task-cancelled` instructed the agent to say *"nothing was committed"* — a claim
> the skill has no standing to make, since it only knows **it** didn't commit. This doc generalizes the
> lesson so it stops recurring in a new shape every few sessions.

## The rule

- **The working tree is not the record. Committed history is.** `git status` / `git diff` answer *"what
  has changed since the last commit?"* They do **not** answer *"does this work exist?"* — that needs
  `git log` / `git show` / reading the file on disk. Using the first to answer the second is the bug
  that produced all three 2026-07-13 failures.
- **A claim about repository state requires a check, in the same turn.** Not from memory, not from an
  earlier turn, not from a skill's boilerplate. If it is worth saying, it is worth checking.
- **"I don't know" is a valid, and often correct, answer.** An agent that cannot check must say so
  rather than infer. An unchecked claim stated confidently is worse than no claim — it is acted on.
- **When you are wrong, say the check was wrong.** In the task-17 failure the producer offered the owner
  three theories for the discrepancy and never named the true one — *my evidence-gathering was broken.*
  That possibility belongs first on the list, not last.
- **Applies to every role, not just the producer.** The reviewer asserting a test passed, the coder
  asserting a file exists, the architect asserting an ADR's status — same rule, same failure mode.

## Where this must be enforced

This is read on a normal run, not just when something goes wrong — every skill below links here:

- `claude/skills/fkit-task-done/SKILL.md` — no longer claims "nothing was committed"
- `claude/skills/fkit-task-cancelled/SKILL.md` — same fix
- `claude/skills/fkit-task-plan/SKILL.md` — same fix
- `claude/skills/fkit-process-stateful-review/SKILL.md` — same fix, in its final-report step
- `claude/skills/fkit-status/SKILL.md` — the skill this rule was first written to generalize (see its
  step 1, "never state a count you did not just read out of a file")
- `claude/skills/fkit-review/SKILL.md` — the reviewer's own version: verify before asserting a finding
  or a passing test

## Related

- [`status-report-format.md`](status-report-format.md) — carries the same generalization as one of its
  Rules: the working tree is not the record.

## Provenance

Diagnosed in-session by fkit-producer (2026-07-13) after making the error three times; tracked as
`ai-agents/tasks/backlog/stop-agents-asserting-unchecked-repo-state.md` (Sprint 2, priority 24) — read
that task for the full incident account.
