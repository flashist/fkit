# Trial plan review through the owner's own sprint-loop runs, then put default / optional / drop to him

## ID
0474

## Sprint
Sprint 12

## Priority
P10

## Status
✅ Done (agent-closed — not owner-verified)

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
   - *Correction, 2026-10-20 (spawned `fkit-producer`):* `test/reference-integrity.test.js` no longer
     exists in `test/`, so this step cannot run as written. Until a replacement is named, the links this
     task adds (the Trial log index, and the reports' own links) are checked by hand: each link
     target is opened from the brief's folder. Scope unchanged.

## Notes

- **Depends on:** 0473
- **Blocks:** nothing
- **Before the first trial run: relaunch `fkit lead`** (added 2026-10-06). After 0473 lands, start the
  trial from a fresh `fkit lead` launch (exit, then relaunch). Without it, the approvers run on their
  old agent instructions, and the trial data is not of the shipped feature. Why: 0473's build smoke
  test found that after the installed `.claude/` copies were refreshed, a hop-2 spawn still got its
  old agent prompt; skill text was live, agent prompts were not. So the approvers' new "asked to
  approve a plan" judging guidance, and the coder's new consult bullet for `fkit-adversarial-reviewer`,
  only reach a relaunched session. The APPROVE / CHANGES REQUESTED reply shape works either way,
  because the asking prompt carries it, so a stale session would not look broken. Suggested: the first
  trial log checks it, e.g. the plan-step record shows the approvers judging by the new guidance.
  Sources: 0473 `review.md`, finding R5 (*"so 0474's trial could start from a stale session and gather
  mixed-version evidence"*); 0473 `worklog.md`, "Live smoke test (hop 2, installed text)"
  (*"Agent system prompts: NOT live."* and *"0474's first run must start from a fresh launch."*).
- ⛔ **Do not start without the owner's specific word.**
- **Why a separate task from `0473`:** the build ships, and can be used opt-in, without the trial. The
  trial produces something different, evidence plus an owner ruling, over the lifetime of the owner's
  runs.
- **Owner choice:** `fkit-producer`. Keeping the log and putting the decision to the owner is planning
  work. The per-task measurements come from the run itself (the lead's driver, and the coder's worklog);
  the producer compiles them. The owner's "did it help?" answer needs him present.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`.
  - *Correction, 2026-10-20 (spawned `fkit-producer`):* out of date. The task now sits on
    [Sprint 12](../../../sprints/sprint-12.md) at `P10`, as this brief's `## Sprint` and `## Priority` say
    (carried over from Sprint 10 on 2026-10-15). Scope unchanged.
- **Filed 2026-10-01** by a spawned `fkit-producer` at `fkit-lead`'s direction, on owner rulings relayed
  from the lead session (no owner channel, ADR-021). **Re-scoped 2026-10-02** on the owner's answer
  quoted in *Context*, relayed by `fkit-lead`. ⛔ No commit.
- ⏱ **Started 2026-10-20 — the owner's go-ahead.** Via `AskUserQuestion`, 2026-10-20, `fkit lead`
  session, during a `/fkit-sprint-ship-loop --plan-review` run on Sprint 12 (started ~13:56 UTC);
  relayed verbatim to a spawned `fkit-producer`. Question: *"Sprint 12 has no coder tasks left for plan
  review to run on. What should this run do?"* Selected option text, verbatim: *"Start 0474 log, stop
  run (Recommended)"*. Description he saw: *"Your go-ahead for 0474: a producer sets up the trial log;
  data comes from your next --plan-review run on a sprint with coder tasks. Knock-on: none — Sprint 12
  already waits on 0474."* **This run produced no trial data:** `0474` was Sprint 12's only open row, so
  there was no coder task to plan-review. Status set `🔄 In progress` by `fkit-lead`. The relaunch note
  above still applies to every trial run: start each from a fresh `fkit lead` launch. Recorded by a
  spawned `fkit-producer` (no owner channel). ⛔ No commit.
- ⏱ **2026-10-20 — owner ruling: the 13 earlier plan-review runs count.** Via `AskUserQuestion`,
  2026-10-20, `fkit lead` session; relayed verbatim to a spawned `fkit-producer`. Question: *"Should the
  13 plan-review runs already done (2026-10-15 to 10-20) count as 0474 trial data?"* Selected option
  text, verbatim: *"Count all 13, log each (Recommended)"*. Description he saw: *"Producer back-fills
  one log per task from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown.
  Matches your 0504 precedent."* Done the same day: one back-filled log per task, listed under
  *Trial log* below. In each, "did it help?" reads "not asked (back-filled 2026-10-20)" and the fresh
  `fkit lead` launch reads "unknown". The trial continues. ⛔ No commit.
- ⏱ **2026-10-24 — owner ruling: the trial ends; summary written.** Via `AskUserQuestion`, 2026-10-24,
  `fkit lead` session; relayed verbatim to a spawned `fkit-producer`. Question: *"Have you seen enough
  plan review to end the 0474 trial?"* Selected option text, verbatim: *"Seen enough — summarise"*.
  Description he saw: *"Spawn a producer to write the summary over the 14 logs, then put Default /
  Optional / Drop to you. Knock-on: none — no open task waits on 0474."* Done the same day: the 14 logs
  were re-counted (14 logs, matching 14 `plan-review.md` records) and the summary was written,
  [`2026-10-24-plan-review-trial-summary.md`](../../../knowledge-base/reports/2026-10-24-plan-review-trial-summary.md).
  Its *Owner ruling* section reads "pending": the Default / Optional / Drop choice goes back to the lead
  to put to the owner (*What to build* §4). Status stays `🔄 In progress`; no follow-up brief filed yet.
  ⛔ No commit.
- ⏱ **2026-10-24 — owner ruling: Default, provisional (the lead's reading); follow-up `0541` filed.**
  Via `AskUserQuestion`, 2026-10-24, `fkit lead` session; relayed verbatim to a spawned `fkit-producer`.
  - Q1, *"Across the 14 tasks, did plan review help you?"* — typed by him (not an option); **also his
    "did it help?" answer** (*What to build* §1):
    *"I feel like it helped me, but it's really hard to tell, because all the things were happening
    "behind the scene" without my involvement. Overall, I feel good about it, but I would like still have
    a chance to switch it off, if needed. So my idea is to make this new process default, but not to
    delete the old one, and to keep the old one available via a parameter, until I test the new version
    of fkit in real projects for some time and make the final decision."*
  - Q2, *"Trial over — what should happen to plan review: Default, Optional, or Drop?"* (options he saw:
    *Optional (Recommended)* / *Default* / *Drop*) — typed by him: *"I think I answered the question in
    the 1st answer"*.
  - **The lead's reading** (fkit-lead's, not his words): **Default, provisional** — plan review on by
    default in every sprint-loop run; the no-plan-review path kept, selectable by a parameter (opt-out);
    the final decision deferred until he has used the new fkit on real projects for some time.
  - Q3, placement of the follow-up — selected option text, verbatim: *"Sprint 12 (Recommended)"*
    (description he saw: *"The only open sprint, so your next /fkit-sprint-ship-loop picks it up. No open
    task waits on it."*).

  Done the same day: the ruling recorded in the summary's §9
  ([`2026-10-24-plan-review-trial-summary.md`](../../../knowledge-base/reports/2026-10-24-plan-review-trial-summary.md));
  follow-up brief filed on Sprint 12,
  [`0541`](../../backlog/0541-make-plan-review-the-default-for-the-sprint-loop-with-an-opt-out-parameter/brief.md)
  (*What to build* §4, *Verification* step 5). This task changed no skill or prompt. Closed next by
  `/fkit-task-done`, agent-closed. ⛔ No commit.

### Trial log

One report per task planned with plan review on, written after that task's code review (*What to
build* §1), grouped by sprint-loop run. The producer adds each one here.

- **Sprint 10 run, `--plan-review`, started 2026-10-10T16:23:38Z** — `0504`:
  [`2026-10-11-plan-review-trial-0504.md`](../../../knowledge-base/reports/2026-10-11-plan-review-trial-0504.md).
  Logged as a trial run on the owner's ruling (`AskUserQuestion`, `fkit lead` session, 2026-10-10:
  *"Yes, log it as a trial run (Recommended)"*), before this task's start on 2026-10-20.
- **Sprint 12 run, `--plan-review`, started 2026-10-15T16:38:40Z** — back-filled 2026-10-20 on the
  owner's ruling (see the ⏱ 2026-10-20 note above):
  - `0284` — [`2026-10-20-plan-review-trial-0284.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0284.md)
  - `0385` — [`2026-10-20-plan-review-trial-0385.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0385.md)
  - `0516` — [`2026-10-20-plan-review-trial-0516.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0516.md)
  - `0334` — [`2026-10-20-plan-review-trial-0334.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0334.md)
  - `0507` — [`2026-10-20-plan-review-trial-0507.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0507.md)
  - `0510` — [`2026-10-20-plan-review-trial-0510.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0510.md)
  - `0508` — [`2026-10-20-plan-review-trial-0508.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0508.md)
  - `0503` — [`2026-10-20-plan-review-trial-0503.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0503.md) (cancelled before
    code review; its code-review fields read "not measured")
- **sprint-13 run, `--plan-review`, started 2026-10-19T11:18Z** — back-filled 2026-10-20, same ruling:
  - `0526` — [`2026-10-20-plan-review-trial-0526.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0526.md)
  - `0527` — [`2026-10-20-plan-review-trial-0527.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0527.md)
- **sprint-13 run, `--plan-review`, started 2026-10-19T18:11Z** — back-filled 2026-10-20, same ruling:
  - `0528` — [`2026-10-20-plan-review-trial-0528.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0528.md)
  - `0529` — [`2026-10-20-plan-review-trial-0529.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0529.md)
  - `0530` — [`2026-10-20-plan-review-trial-0530.md`](../../../knowledge-base/reports/2026-10-20-plan-review-trial-0530.md)
- **Sprint 12 run, `--plan-review`, started 2026-10-20 ~13:56 UTC** — no tasks planned; no data.
