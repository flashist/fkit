# Stop agents asserting repo state they never checked

**Source**: `ai-agents/tasks/done/stop-agents-asserting-unchecked-repo-state.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 24

## Goal
**On 2026-07-13 the producer made the same class of error three times in one session — and the source told it to make one of them.**

1. **Task 17** — checked `git diff --stat` (**uncommitted changes only**), found nothing, told the owner *"this task's work does not exist."* **It did exist — it was committed.** The producer then offered **three explanations** for the discrepancy, **none of which was *"my check was wrong."***
2. **Task 19** — same error, same session.
3. **Commit state** — told the owner **nine times** that a full day of work was uncommitted and called it *"the largest risk on the project."* **The tree was clean and had been all along.** The owner had been committing between turns.

**The root cause is one sentence, repeated: the producer asserted the state of the repository without reading the repository.**

## Key Changes

**The third one is a source defect, not a lapse.** Both task movers instructed: *"Remind that nothing was committed."* **That sentence is false as written.** The skill knows that **it** did not commit; **it cannot know that *nothing* was committed** — the owner commits between turns. **The skill instructs the agent to assert a fact about the world that the skill has no standing to know, and the agent complies, in good faith, every single run. This shipped to every project fkit scaffolds.**

- **Fixed the false instruction in both movers.** The distinction, not the phrasing, is the deliverable: *"I did not commit"* is **knowledge**; *"nothing was committed"* is **a claim about the world that requires a check.**
- **Added `conventions/evidence-before-assertion.md`**, filed per [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] (`conventions/` = standing rules read on a normal run and obeyed). Its rules: **the working tree is not the record — committed history is**; **a claim about repo state requires a check, in the same turn**; **"I don't know" is a valid and often correct answer** — *an unchecked claim stated confidently is worse than no claim, because it is acted on*; **when you are wrong, say the check was wrong** — *that possibility belongs first on the list, not last*; and **it applies to every role**.
- **Linked from the skills that make these claims** — *a convention nobody's procedure points at is a convention nobody reads.*
- **Widened `status-report-format.md` by one line** — the generalization it was missing, added at the place the lesson was first learned.

**The irony is exact, and explains why this earned a task rather than a resolution to try harder:** `status-report-format.md` exists *because* *"a status report was once improvised from memory and fabricated a number that looked precise and was false."* **It governs `/fkit-status`. It did not govern the moment an agent decides whether work exists** — and that is precisely where the same failure recurred. **The convention was right; its scope was too narrow.**

## Outcome
**Done.** The verification that mattered was **the replay test**: run `/fkit-task-done` against a task whose work is **committed but absent from the working tree**, and confirm the agent checks **committed history** and closes it. *"If it still gets this wrong, the rule is written but not operative, and the task is not done."*

**Provenance: diagnosed in-session by the producer after making the error three times**, and the owner asked for it to be **tasked rather than left as a promise to do better**. *"That is the right call — a behavioral resolution held by one agent in one session protects nobody. The source defect would have kept producing this failure in every project fkit ships to."*

**Not a hook, deliberately** — *the fix is a rule agents read and a false instruction removed, not enforcement machinery.*

⚠️ The brief's own `## Status` header still reads `🔲 Backlog` though it sits in `done/` — mover drift; the sprint board reads Done.

## Related
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] — where the convention is filed
- [[tasks/add-shared-instructions-layer-for-all-agents]] — this rule was *"the first real customer"* of whatever that built
- [[tasks/enforce-task-status-vocabulary]] · [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — the sibling mover fixes
- [[tasks/add-status-skill-to-producer]]
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] — surfaced by this task's review
- [[systems/knowledge-base-structure]]
- [[systems/fkit]]
- [[tasks/sprint-2-remove-omnigent]]
