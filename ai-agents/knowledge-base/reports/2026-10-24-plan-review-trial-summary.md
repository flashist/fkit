# Plan-review trial — summary across the 14 logs

**Date:** 2026-10-24
**Kind:** summary report for task `0474` (plan-review trial), *What to build* §4
**Task:** `0474` — folder
`ai-agents/tasks/done/0474-trial-plan-review-on-3-to-5-real-tasks-and-put-default-optional-or-drop-to-the-owner/`
(moves to `done/` when closed).
**Feature trialled:** opt-in plan review, `/fkit-sprint-ship-loop --plan-review`
([ADR-056](../decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md)): before the
owner sees a plan, the producer and/or the architect approve it (by the classification rule), then the
adversarial reviewer attacks it on Codex.
**Written by:** a spawned `fkit-producer` (no owner channel), from the 14 trial logs only. Nothing here
was asked of the owner. Counts are taken from the logs' own tables; where a log bundles several points
into one row, the count is by row.

---

## 0. How the trial ended

- **It ended on the owner's word.** Via `AskUserQuestion`, 2026-10-24, `fkit lead` session. Question:
  *"Have you seen enough plan review to end the 0474 trial?"* Selected option text, verbatim: *"Seen
  enough — summarise"*. Description he saw: *"Spawn a producer to write the summary over the 14 logs, then
  put Default / Optional / Drop to you. Knock-on: none — no open task waits on 0474."*
- **No task count was imposed and no tasks were picked for him.** The tasks are the ones his own
  `--plan-review` sprint-loop runs reached, per his 2026-10-02 answer in the brief's *Context*
  (*"I won't be choosing specific tasks"*). Thirteen of the 14 were counted on his 2026-10-20 ruling
  *"Count all 13, log each (Recommended)"*; `0504` on his 2026-10-10 ruling *"Yes, log it as a trial run
  (Recommended)"*.
- **Count checked: 14.** 14 `plan-review-trial-*` logs exist, and 14 `plan-review.md` records exist
  across `ai-agents/tasks/` (done and cancelled). They match one to one.

## 1. The logs, by run

| Run (all `--plan-review`) | Tasks | Logs |
|---|---|---|
| Sprint 10, started 2026-10-10T16:23:38Z | 1 | [0504](2026-10-11-plan-review-trial-0504.md) |
| Sprint 12, started 2026-10-15T16:38:40Z | 8 | [0516](2026-10-20-plan-review-trial-0516.md), [0385](2026-10-20-plan-review-trial-0385.md), [0284](2026-10-20-plan-review-trial-0284.md), [0334](2026-10-20-plan-review-trial-0334.md), [0507](2026-10-20-plan-review-trial-0507.md), [0510](2026-10-20-plan-review-trial-0510.md), [0508](2026-10-20-plan-review-trial-0508.md), [0503](2026-10-20-plan-review-trial-0503.md) (cancelled before code review) |
| sprint-13, started 2026-10-19T11:18Z | 2 | [0526](2026-10-20-plan-review-trial-0526.md), [0527](2026-10-20-plan-review-trial-0527.md) |
| sprint-13, started 2026-10-19T18:11Z | 3 | [0528](2026-10-20-plan-review-trial-0528.md), [0529](2026-10-20-plan-review-trial-0529.md), [0530](2026-10-20-plan-review-trial-0530.md) |
| Sprint 12, started 2026-10-20 ~13:56 UTC | 0 | no data (no coder task left) |

All 14 tasks are fkit's own work on itself: prompts, skills, shell scripts, docs, tests. None is
application code in a consuming project.

## 2. Time added ("plan ready" → "plan presented to the owner")

| Task | Time | Measured or estimate | Approver asks | Codex part |
|---|---|---|---|---|
| 0504 | 26m15s | measured | 3 | ~9m45s (two passes) |
| 0284 | ~17m | estimate | 2 | ~6m |
| 0385 | ~16m | estimate | 3 (1 void) | ~8m |
| 0516 | ~12½m | estimate | 3 | ≤6m |
| 0334 | ≈14m | estimate | 1 | ~7m |
| 0507 | ≈17m | estimate | 2 | ~8m |
| 0510 | ≈18m | estimate | 2 | ~5m |
| 0508 | ≈20m | approximate end | 2 | ~7m |
| 0503 | not measured (≈13m to record returned; ≤≈31m to owner answered, an upper bound) | — | 2 | ~10m (one retry) |
| 0526 | 9m25s | measured | 2 | ~4m |
| 0527 | 18m31s | measured | 3 | ≤7m |
| 0528 | ~17m | estimate | 3 | ~7½m |
| 0529 | 31m19s | measured | 3 | ~11m |
| 0530 | 12m33s | measured | 2 | ~6m |

- **Typical: about 17 minutes** (median of the 13 tasks with a figure; range ~9½ to ~31 minutes).
  Only 5 are measured to the second; the rest are estimates, as each log marks.
- **Codex is the largest single part**, usually 4–11 minutes. Approver rounds are usually 2–9 minutes.
- **Wall-clock, not effort.** The lead's own gate preparation (1½–4 minutes) is inside these figures and
  would partly happen without plan review. **Time without plan review: not measured in any log.**
- **Revision rounds:** every task finished within the 2-round cap. No task needed the owner to settle a
  disagreement left after round 2.

## 3. Classification accuracy

- **7 product change** (producer + architect): 0504, 0284, 0385, 0334, 0527, 0528, 0529.
  **7 code-only** (architect alone): 0516, 0507, 0510, 0508, 0503, 0526, 0530.
- **No classification was disputed** by an approver, and nothing in Build or code review contradicted
  one. 12 of 14 logs say "right"; `0507` says "mostly" and `0516` adds an inference caveat (both edit text
  under `claude/`, but only comments or cites). `0503`'s could not be confirmed: cancelled before code
  review.

## 4. Findings that changed the plan — approvers and Codex separately

**Approvers** (producer and/or architect):
- **About 97 plan-changing rows across the 14 tasks** (4–11 per task). Most are wording, bookkeeping or
  tighter checks. Some are substantive, e.g. `0504` (the bug itself in the Stop hook; a non-answer is
  never consent), `0510` (an ADR-017 rule the plan would have deleted), `0526` (wrong probe fixture; too
  few launches), `0527` (no sweep of `decisions/`), `0529` (a hidden gap where nothing automatic runs
  prove-red; a deviation from ADR-057 not put to the owner), `0530` (an owner question with a wrong
  knock-on; a time budget stated as final that had to be provisional).
- **Noise was low:** usually one confirmation-only row per task (13 of 14 logs; `0527` had none).
- **Approver slips:** one point built on a stale fact (`0528` A3, undone a round later); one approver
  fixing a flaw in its own earlier suggestion (`0516` A4); one approver change later reversed by Codex
  (`0503` A1 vs X8). In `0529` one approver point only repaired a question the coder's revision had
  dropped.

**Codex** (the model-diverse second opinion):
- **57 findings, 46 changed the plan** (directly, or as an owner question at the gate). 11 did not: 3
  disputed or noise, 3 no change, 2 deferred to another task, 1 declined by the owner, 1 declined as a
  suggestion, 1 duplicate.
- **Codex found the high-severity gaps the approvers missed**, in at least 5 tasks: `0284` X1 (a
  TERM-only watchdog could hang startup forever; the architect had run the same sketch), `0385` X1 (two
  concurrent reviewers share a prompt path), `0503` X1/X2/X4 (no fingerprint of the tested tree; no
  timeout on a background run), `0526` X1 (the probe never ran real `git`), `0527` X1–X4.
- Codex found something adopted in **every one of the 14 tasks**.

**Claude supplement** (the adversarial reviewer's own extra pass, flagged *NOT model-diverse*), in 5
tasks (0385, 0334, 0507, 0529, 0530):
- **22 findings, 20 changed the plan.** In 2 tasks the most serious adopted catch came from this leg,
  not from Codex: `0385` C1 (shell injection through a branch name), `0507` C1/C2 (two false-pass holes in
  the comments-only proof). In `0334`, 3 of the 4 plan-changing second-opinion rows came from it.

## 5. What code review still found

13 tasks reached code review (`0503` did not). **39 findings in all: 5 medium, the rest low or nit, none
high.** Each finding is counted once below. `0516` had 0; `0507` had 9 (the pilot of a series; much of its review was of a method for later
tasks).

| Could plan review have caught it? | Count | Examples |
|---|---|---|
| Yes | 6 | `0504` R2, `0334` R1 (a branch with no prove-red mutation), `0507` R1/R3/R6/R7 |
| Partly or maybe | 13 | `0284` R1, `0385` R2/R3, `0507` R2/R4, `0508` R1, `0510` R1, `0526` R5, `0527` R1/R3/R4, `0528` R1, `0529` R1 |
| No — written at Build | 16 | most of `0526`, `0284` R2/R3, `0529` R2/R3 |
| **Introduced by plan review's own adopted text** | **4** | `0385` R1 (medium: a heredoc that could end early and run later lines as shell — from an approver point plus Codex fix text the owner adopted word for word), `0508` R2/R4, `0530` R1 |

- **A structural gap shows up:** fix text written *after* Codex goes straight to the owner, and nobody
  reviews it again before Build. All 4 plan-review-caused findings came from such post-Codex fix text. Two of them needed a fresh owner ruling after Build (`0385`,
  `0508`).

## 6. Extra reading for the owner

- **Word count: not measured in any log.**
- **Extra owner questions at the gate, caused by plan review: usually 1–3 per task**, plus banners and,
  in some runs, a findings table. Examples: `0504` 2 of 6 questions, `0284` 2 of 3, `0510` 3 of 4, `0529`
  3 of 6 plus 3 banners, `0530` 1 new and 3 reworded plus 3 banners, `0516` about one option description.
- **Later owner rulings caused by plan-review text:** `0385` (2 after Build), `0508` (R2 asked twice).
- **Every gate ruling quoted in the logs is the option marked "(Recommended)".** The logs do not say
  whether that means the recommendations were good or that the extra reading was skimmed.
- **"Did plan review help?"** asked **once**, for `0504` (2026-10-11). His answer, typed by him: *"Based on
  your explanation, I think it's worth it, but I would like to do a couple of other tasks with it too"*.
  Before that he had asked: *"Were there any things that could've been shown to me or was it a pure
  "internal" review process between agents?"* **Not asked for the other 13.**

## 7. What broke or confused

| Problem | Tasks | Count |
|---|---|---|
| Hop limit reached | — | **0** |
| Skill refused | — | **0** (a *tool*, `TaskStop`, was refused or failed in 0385, 0527, 0528) |
| Escalation after round 2 | — | **0** |
| Codex unavailable → Claude-only fallback | — | **0** full fallbacks. Late first pass, re-run needed: 0504. "Model at capacity", one retry: 0503 |
| Second opinion partly not model-diverse (Claude supplement, flagged) | 0385, 0334, 0507, 0529, 0530 | 5 |
| A placeholder sent instead of the plan (`[PLAN_TEXT]`, `PLAN_PLACEHOLDER`) | 0284, 0385, 0527, 0528 | 4 |
| Re-ask carried deltas, not the full revised plan | 0504, 0508, 0527 | 3 |
| Edits made after APPROVE without a re-ask | 0284, 0334, 0503, 0527, 0530 | 5 |
| Codex's input shortened | 0504, 0529 | 2 |
| Codex ran `npm test` by accident (quoting slip; no repo change) | 0529, 0530 | 2 |
| Codex could not run tests in its sandbox (`EPERM`); reasoning only | 0504, 0510 (and read-only in others) | 2+ |
| Duplicate replies, counted once | 0516, 0526, 0528 | 3 |
| Driver-prompt defect (continuation coder told to revise after Codex; correctly refused) | 0504 | 1 |

Most of these are send-and-procedure slips, not design failures. The four placeholder sends and the
post-APPROVE edits recur across runs.

## 8. Honesty caveats

- **No controlled baseline.** No task was run twice, with and without plan review. The one rough
  comparison (`0504` vs `0495`, 1 review round vs 3) is labelled in its log as not an effect size.
- **13 of the 14 logs are back-filled** (2026-10-20, from files only): "did it help?" was **not asked**,
  and whether the lead session was a **fresh launch** (so the approvers ran on the new agent prompts) is
  **unknown**. For `0504` it is "likely met", not proven.
- **Times are mostly estimates and are wall-clock, not effort.** The owner's own answering time is not
  measured in any log. Word counts of extra reading: not measured.
- **The records are the coder's and driver's summaries, not raw replies** — "trust, not proof"
  (ADR-056).
- **"Changed the plan" counts are uneven:** some log rows bundle several points. Read the totals as
  rough sizes, not exact figures.
- **Narrow sample:** one project (fkit on itself), one owner, 4 runs, 9 days; mostly prompt, doc and
  shell work. One task (`0503`) was cancelled, so it has no code-review data.

## 9. Owner ruling: Default, provisional (the lead's reading of his own words)

*Recorded 2026-10-24 by a spawned `fkit-producer` (no owner channel), from the owner's answers relayed
verbatim by `fkit-lead`. His words are quoted as typed; nothing here is paraphrased as his.*

- **Date and channel:** 2026-10-24, `fkit lead` session, via `AskUserQuestion`; relayed verbatim to a
  spawned `fkit-producer`.
- **Q1 — *"Across the 14 tasks, did plan review help you?"*** Typed by him, in his own words (not an
  option). **This is also his "did it help?" answer for the trial** (§6), asked across all 14 tasks:

  > *"I feel like it helped me, but it's really hard to tell, because all the things were happening
  > "behind the scene" without my involvement. Overall, I feel good about it, but I would like still have
  > a chance to switch it off, if needed. So my idea is to make this new process default, but not to
  > delete the old one, and to keep the old one available via a parameter, until I test the new version
  > of fkit in real projects for some time and make the final decision."*

- **Q2 — *"Trial over — what should happen to plan review: Default, Optional, or Drop?"*** Options he
  saw: *Optional (Recommended)* / *Default* / *Drop*. He picked none; typed by him: *"I think I answered
  the question in the 1st answer"*.
- **The lead's reading** (fkit-lead's, not the owner's words): ruling = **Default, provisional** — plan
  review on by default in every sprint-loop run; the no-plan-review path kept, selectable by a parameter
  (opt-out); the final decision deferred until he has used the new fkit on real projects for some time.
- **Ruling:** **Default, provisional**, on the reading above. Not the producer's recommendation (the
  option marked *Recommended* was *Optional*; he did not pick it).
- **Q3 — where the follow-up brief goes.** Selected option text, verbatim: *"Sprint 12 (Recommended)"*.
  Description he saw: *"The only open sprint, so your next /fkit-sprint-ship-loop picks it up. No open
  task waits on it."*
- **Follow-up brief (Default):** filed 2026-10-24 —
  [`0541`](../../tasks/backlog/0541-make-plan-review-the-default-for-the-sprint-loop-with-an-opt-out-parameter/brief.md),
  on [Sprint 12](../../sprints/sprint-12.md). Plan review on by default for `/fkit-sprint-ship-loop`;
  the no-plan-review path kept, selectable by a parameter; ADR-056 amended by its own Decision 9. The
  parameter's name and design are left to the architect and coder. The opt-out stays until the owner's
  final decision after real-project use.
