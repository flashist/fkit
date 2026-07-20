# Stop agents asserting repo state they never checked

## ID
0087

## Sprint
Sprint 2

## Priority
24

## Status
✅ Done

## Context

**On 2026-07-13 the producer made the same class of error three times in one session, and the source
told it to make one of them.**

1. **Task 17** — the producer checked `git diff --stat` (which shows *uncommitted* changes only),
   found nothing, and told the owner *"this task's work does not exist."* **It did exist — it was
   committed.** The producer then offered the owner three explanations for the discrepancy, none of
   which was *"my check was wrong."*
2. **Task 19** — same error, same session.
3. **Commit state** — the producer told the owner, **nine times**, that a full day of work was
   uncommitted and called it *"the largest risk on the project."* The working tree was clean and had
   been all along. The owner had been committing between turns.

**The root cause is one sentence, repeated: the producer asserted the state of the repository without
reading the repository.**

**And the third one is a source defect, not a lapse.** `claude/skills/fkit-task-done/SKILL.md:134` and
`claude/skills/fkit-task-cancelled/SKILL.md:161` both instruct:

> *"Remind that nothing was committed — the move + edits are staged/working-tree only."*

**That sentence is false as written.** The skill knows that **it** did not commit. It cannot know that
**nothing** was committed — the owner commits between turns. The skill instructs the agent to assert a
fact about the world that the skill has no standing to know, and the agent complies, in good faith,
every single run. **This ships to every project fkit scaffolds.**

The irony is exact, and worth stating because it explains why this deserves a task rather than a
resolution to try harder:
[`status-report-format.md`](../../knowledge-base/conventions/status-report-format.md) exists *because*
*"a status report was once improvised from memory and fabricated a number that looked precise and was
false."* That doc governs `/fkit-status`. **It does not govern the moment an agent decides whether work
exists** — and that is precisely where the same failure recurred. The convention is right; its scope is
too narrow.

## What to build

### 1. Fix the false instruction in both movers *(source; ships to every project)*

| File:line | Change |
|---|---|
| `claude/skills/fkit-task-done/SKILL.md:134` | → *"Remind that **this skill** made no commit — the move + edits are in the working tree. **Do not claim the repository has uncommitted work, or that anything is or isn't committed — this skill has not checked, and the owner may have committed between turns.** If commit state matters to the report, run `git status` first."* |
| `claude/skills/fkit-task-cancelled/SKILL.md:161` | Same. |

Wording is illustrative — get the **distinction** right, not the phrasing: *"I did not commit"* is
knowledge; *"nothing was committed"* is a claim about the world that requires a check.

### 2. Add the standing rule where agents will actually read it

A new convention — **`ai-agents/knowledge-base/conventions/evidence-before-assertion.md`** — filed per
[ADR-013](../../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md)
(`conventions/` = standing rules read on a normal run and obeyed).

It must state, at minimum:

- **The working tree is not the record. Committed history is.** `git status` / `git diff` answer *"what
  has changed since the last commit?"* They **do not** answer *"does this work exist?"* — that needs
  `git log` / `git show` / reading the file on disk. **Using the first to answer the second is the bug
  that produced all three failures above.**
- **A claim about repository state requires a check, in the same turn.** Not from memory, not from an
  earlier turn, not from a skill's boilerplate. *If it is worth saying, it is worth checking.*
- **"I don't know" is a valid, and often correct, answer.** An agent that cannot check must say so
  rather than infer. **An unchecked claim stated confidently is worse than no claim** — it is acted on.
- **When you are wrong, say the check was wrong.** In the task-17 failure the producer offered the
  owner three theories for the discrepancy and omitted the true one — *my evidence-gathering was
  broken.* **That possibility belongs first on the list, not last.**
- **Applies to every role, not just the producer.** The reviewer asserting a test passed, the coder
  asserting a file exists, the architect asserting an ADR's status — same rule, same failure mode.

Then **link it from the skills that make these claims** — at minimum `fkit-task-done`,
`fkit-task-cancelled`, `fkit-status`, `fkit-review`. A convention nobody's procedure points at is a
convention nobody reads.

### 3. Widen `status-report-format.md` by one line

It already forbids fabricating numbers. Add the generalization it was missing:
**the working tree is not the record — committed history is.** One sentence, in the doc that already
exists, at the place the lesson was first learned.

## Verification steps

- `grep -rn "nothing was committed" claude/` returns **nothing**.
- `conventions/evidence-before-assertion.md` exists, and `conventions/README.md` lists it.
- Each of `fkit-task-done`, `fkit-task-cancelled`, `fkit-status`, `fkit-review` **links** the new
  convention.
- **The replay test — this is the one that matters.** Take the task-17 scenario: a task whose work is
  **committed but absent from the working tree**. Run `/fkit-task-done` against it. Confirm the agent
  checks **committed history**, finds the work, and closes the task — instead of reporting *"no
  evidence, this was never done."* If it still gets this wrong, the rule is written but not
  *operative*, and the task is not done.
- Scaffold a fresh project and confirm the convention ships with it.

## Notes

- **Owner: fkit-coder** for §1 (product source under `claude/`). §2's convention doc and §3's amendment
  are knowledge-base writes — **the architect owns the KB structure** (ADR-013) and should write or
  review them. Coordinate; do not let the two halves land separately, or the skills point at a doc that
  does not exist.
- **Depends on:** nothing. Independent of everything else in Sprint 2.
- **No ADR.** This is a defect fix and a convention, not an architecture decision. Do not open one.
- **Do not turn this into a hook or a tool restriction.** The fix is a rule agents read and a false
  instruction removed — not enforcement machinery. ADR-010's deferral of hook-based enforcement stands.
- Risk: **low.** Two wording fixes, one new doc, one added line.
- **Provenance:** diagnosed in-session by fkit-producer (2026-07-13) after making the error three
  times; the owner asked for it to be tasked rather than left as a promise to do better. **That is the
  right call — a behavioral resolution held by one agent in one session protects nobody. The source
  defect would have kept producing this failure in every project fkit ships to.**
