# Trial plan review through the owner's own sprint-loop runs, then put default / optional / drop to him

## ID
0474

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.

The owner asked for plan review to be **tested before it becomes normal**. His own words (2026-10-01,
`fkit-lead` session): *"I'm a bit worried that this can make the whole process more complicated. So we
need to test it first. I don't know how to do that, to be honest. I think Can you suggest me
something?"* and *"the old approach should be our "by default" one."*

**How the trial runs — the owner's answer, his own words, typed by him** (2026-10-02, `fkit-lead`
session, relayed to the producer):

> *"I will run the tests via fkit-sprint-ship-loop loops, I won't be choosing specific tasks, I will run
> it as many times as needed to make sure I approve the new behaviour."*

So the trial is **the owner's own `/fkit-sprint-ship-loop` runs with plan review switched on**, run as
many times as he needs. **There is no fixed task count, and nobody picks tasks for him.** The producer's
job is to **keep the trial log**, and to put the default / optional / drop choice to the owner **when he
says he has seen enough**.

This task builds nothing. It needs `0473` (the opt-in plan-review step, switchable per sprint-loop run)
shipped first.

*(Re-scoped 2026-10-02 from the original "3–5 picked tasks" shape, per the owner's answer above. The
folder name still carries the old wording; the ID and folder were kept so the link stays stable.)*

## What to build

1. **A trial log for each task planned with plan review on.** One short knowledge-base report per task,
   `ai-agents/knowledge-base/reports/<YYYY-MM-DD>-plan-review-trial-<NNNN>.md`, written once that task's
   code review is done. It records:
   - **Time added** — from "plan ready" to "plan presented to the owner", with the number of review
     rounds. Measured from timestamps (worklog, session), not estimated. Mark any estimate as one.
   - **Classification** — what the coder chose, its reason, and whether that turned out right.
   - **Findings that changed the plan** — from each approver and from Codex. List each, and say which
     ones actually changed the plan and which were noise.
   - **What the later code review still found** — and for each, whether plan review should have caught
     it.
   - **Extra reading for the owner** — roughly how much more he had to read, and **his own answer** to
     "did it help?" (asked of him, not inferred). If it was not asked, say so.
   - Anything that broke or confused: a hop limit hit, a refused skill, a round-2 escalation, Codex
     unavailable.
   - Which sprint-loop run the task belonged to, so the logs can be grouped by run.
2. **Be honest about the comparison.** There is no controlled baseline, because the same task is not
   run twice. Say so in each log. A similar past task without plan review may be cited as a rough
   comparison, labelled as such.
3. **Keep going until the owner says stop.** No fixed number of runs or tasks. The producer does not
   choose tasks, start runs, or decide the trial is long enough.
4. **When the owner says he has seen enough:** write one short summary across the logs, then put the
   choice to him:
   - **Default** — plan review on by default (needs its own follow-up brief, and likely an ADR
     amendment; not done here);
   - **Optional** — keep today's opt-in switch;
   - **Drop** — remove it (needs its own follow-up brief).

   Record his ruling in the summary report, with the date and his selected option text or own words.

## Verification steps

1. Every task planned with plan review on during the trial has a trial log under
   `ai-agents/knowledge-base/reports/`, with every field in *What to build* §1 filled in (or marked "not
   measured", with the reason).
2. Each log says which sprint-loop run it came from.
3. The summary report exists and records the owner's ruling (default / optional / drop) with the date
   and his words. A producer recommendation does not stand in for it.
4. The trial ended on the owner's word, and the summary says so. No task count was imposed and no tasks
   were picked for him.
5. If the ruling is **default** or **drop**, a follow-up brief is filed for it. This task changes no skill
   or prompt itself.
6. `node --test test/reference-integrity.test.js` green.

## Notes

- **Depends on:** 0473
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word.**
- **Why a separate task from `0473`:** the build ships, and can be used opt-in, without the trial. The
  trial produces something different, evidence plus an owner ruling, over the lifetime of the owner's
  runs.
- **Owner choice:** `fkit-producer`. Keeping the log and putting the decision to the owner is planning
  work. The per-task measurements come from the run itself (the lead's driver, and the coder's worklog);
  the producer compiles them. The owner's "did it help?" answer needs him present.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`.
- **Filed 2026-10-01** by a spawned `fkit-producer` at `fkit-lead`'s direction, on owner rulings relayed
  from the lead session (no owner channel, ADR-021). **Re-scoped 2026-10-02** on the owner's answer
  quoted in *Context*, relayed by `fkit-lead`. ⛔ No commit.
