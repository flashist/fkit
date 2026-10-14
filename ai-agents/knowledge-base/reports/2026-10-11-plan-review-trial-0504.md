# Plan-review trial log — task 0504

**Date:** 2026-10-11
**Kind:** trial log for task `0474` (plan-review trial), one per task planned with plan review on
**Run:** Sprint 10 run, `--plan-review`, started 2026-10-10T16:23:38Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0504` — answer a question typed into a question dialog in full, and do not re-ask in the same turn.
Folder `ai-agents/tasks/backlog/0504-answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn/`
(moves to `done/` when closed). Sources: its `plan-review.md`, `plan.md`, `review.md`, `worklog.md`, plus
facts relayed by the lead (marked "lead").
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-10: "Yes, log it as a
trial run (Recommended)". `0474` itself stays `🔲 Backlog`.
**This is the first trial log.** No earlier `plan-review-trial-*` report exists in this folder.

---

## 1. Time added

Measured from the timestamps in `plan-review.md` (UTC, 2026-10-10). Approver return times are "≤": the
coder stamped them when it noticed the reply, not on delivery.

| Stage | From → to | Elapsed |
|---|---|---|
| Planning (no review yet) | 16:25:37 → plan drafted 16:30:36 | 4m59s |
| Approver round 1 (producer + architect, in parallel) | 16:30:36 → ≤16:33:48 | ≤3m12s |
| Revision 1 | ≤16:33:48 → 16:35:19 | ~1m31s |
| Approver round 2 | 16:35:19 → ≤16:37:25 | ≤2m06s |
| Revision 2 | ≤16:37:25 → 16:37:30 | ~5s |
| Approver round 3 (re-ask only; both APPROVE) | 16:37:30 → ≤16:38:18 | ≤48s |
| First Codex pass | spawned 16:38:23 → not returned when the coder handed back at 16:41:01 | 2m38s, no result |
| Lead re-spawns a continuation coder | 16:41:01 → 16:43:11 | 2m10s |
| Codex re-run (complete) | 16:43:11 → record returned 16:48:08 | 4m57s |
| Lead: late first Codex pass arrives, gate prepared, Q1–Q4 asked | 16:48:08 → plan presented 16:56:51 | 8m43s |

- **Total, "plan ready" → "plan presented to the owner": 16:30:36 → 16:56:51 = 26m15s.**
  Approvers alone: 7m42s. Codex (both passes plus the re-spawn gap): 16:38:23 → 16:48:08 = 9m45s.
  Lead handling to the gate: 8m43s. (Plus 5s between the last approver reply and the Codex spawn.)
- **Rounds:** 3 approver asks (2 revision rounds, then a final re-ask) and 1 Codex review, run twice
  (first pass late, second complete).
- **Caveats.** The 26m15s is wall-clock time, not extra effort. It overlaps with owner time: Q1–Q4 were
  asked "at 16:4x UTC while Codex re-ran" (lead; no exact timestamps), and Q1–Q3 would have been asked
  without plan review too. The owner's time to answer the gate is not recorded (approval is dated
  2026-10-10 only). **How long the plan would have taken to reach the owner without plan review: not
  measured** (no baseline; probably a few minutes after 16:30:36 — estimate).

## 2. Classification

- **Coder's choice:** product change → producer + architect approve.
- **Reason given:** "changes how every fkit agent asks questions of every fkit user (shipped rules block,
  role prompts, Stop-hook message, new scaffold convention)".
- **Was it right?** Yes. The shipped change touches the rules block every fkit install gets, all six role
  prompts and the Stop hook's message to the user. Neither approver disputed it, and nothing in Build or
  code review contradicts it.

## 3. Findings that changed the plan

**Approvers.** Every point was adopted; none was declined; no disagreement.

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | architect R1-1 | Stop hook's REASON_A pushes a new dialog on later turns — the bug itself | **Yes, substantive** → D7 (hook guidance reword) + hook test + owner question **Q4** |
| A2 | architect R1-2 | No rule that a non-answer is never consent | **Yes, substantive** → D8 across lead / coder / sprint loop / heal / interview + test pin |
| A3 | architect R1-3 | 3-option cap never reaches spawned workers | **Yes, substantive** → D3 (cap in spawn prompts, merge fallback) |
| A4 | architect R1-4 | Re-ask wording inconsistent; explain-first can be hidden too | **Yes, substantive** → D2 single re-ask sentence + D2b |
| A5 | architect, Q1 addendum + producer (b) | Live check overlaps the owner's personal rule | **Yes** → owner question **Q5** + live-check expectation restated |
| A6 | producer (a) | Widen the survey; check `fkit-task-brief` step 9's option count | Yes, minor (survey widened) |
| A7 | producer (c) | Q2 should name the plain-session trade-off | Yes, minor (question wording) |
| A8 | producer R2-5 | Close posture while the owner-run live check is pending | Yes, minor (task held from close until run or waived) |
| A9 | producer R2-6 | Worklog should say D7 is not the out-of-scope hook | Yes, bookkeeping only |
| A10 | architect R2-7 | Widen REASON_A to cover explain-then-ask-next-turn | Yes (wording later corrected by Codex X1) |
| A11 | architect R2-8 | Name the accepted residual | Yes, minor |
| A12 | both, round 3 | Cosmetic line wrap | **Noise** — no plan change |

**Codex** (presented to the owner as a 7-row table; owner: "Approve + adopt all 7 edits (Recommended)").

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 | "no line ending in `?`" contradicts the required "What's next?" heading | confirmed (wording) | **Yes** — wording used throughout Build. Note: it fixes wording added in approver round 2 (A10) |
| X2 | D7 is called a "carve-out" but only rewrites static text; test pins text only | partly — behaviour was by design | Rename only. Missing-test half: **noise** |
| X3 | Worker re-consult via `SendMessage` is an undefined, unsanctioned path | confirmed | **Yes** — `SendMessage` route dropped |
| X4 | `structure-spec.md` prose count would stay "eleven / ten" | confirmed | Yes, minor — prose updated |
| X5 | Test does not pin the ≤3-option cap or merge fallback | partly | **Yes** — test pins both in four files |
| L1 | Merge fallback can drop a per-option knock-on (late first pass) | none at the gate; Build verified it real | **Yes** — "keeping both knock-ons", pinned |
| L2 | Interview's D8 carve-out not tested (late first pass) | none at the gate; Build verified it real | **Yes** — test arm added |

The late first pass also raised two findings that duplicate X4 and X5 (lead's mapping).

**Net:** 18 adopted changes (11 from approvers, 7 from Codex), 1 pure-noise item (A12) and 1 half-noise
item (X2, adopted as a rename only). Several Codex findings
(X1, X2, X5, L1, L2) land on text that approver round 1–2 added (D3, D7, D8, D2b). So part of the Codex
work was checking changes the approvers caused.

## 4. What the later code review still found

`review.md`: one round, 2 findings, both low, both verified correct and fixed.

| # | Finding | Should plan review have caught it? |
|---|---|---|
| R1 | Two D8 sentences (lead, heal) say "answer it, re-ask" with no "on the owner's next message" | **No, mostly.** The words were written at Build. The plan already set one re-ask wording everywhere (D2); the slip was not following it. At most, the plan could have required D8 sentences to reuse D2's wording. |
| R2 | Test does not pin heal step 4's "not consent" clause | **Yes, it could have.** The approved plan was inconsistent: D8 lists heal step 4 and says "Pinned by the new test", but step 10 pins D8 only in lead, coder and sprint loop. Plan review caught the same gap for the interview (L2) and a near one (X5), but not heal. |

## 5. Extra reading for the owner, and his answer

- **Extra reading at the gate (lead):** banners, a plan summary, a 7-row Codex findings table, and 2
  questions (Q5 and the approval). Q1–Q4 were asked earlier, while Codex re-ran. **Q4 and Q5 exist only
  because of approver round 1** (A1, A5). So plan review added 2 of the 6 owner questions, plus the
  7-row table and the banners. **Word count: not measured.**
- **"Did plan review help?"** Asked by the lead after code review closed, 2026-10-11, `AskUserQuestion`,
  `fkit lead` session.
  - First reply, typed by the owner (a question, not a choice): "To be honest, I don't know. Were there any
    things that could've been shown to me or was it a pure "internal" review process between agents?"
  - The lead answered in chat (what he saw: the 7 adopted Codex edits, Q4 and Q5, the banners; what stayed
    internal: the approver rounds; he never saw the plan as it was before review) and re-asked on his next
    message.
  - **His answer, typed by him:** "Based on your explanation, I think it's worth it, but I would like to do
    a couple of other tasks with it too"

## 6. Anything that broke or confused

1. **Codex did not return in time.** The first pass (spawned 16:38:23Z) had not returned when the
   planning coder handed back at 16:41:01Z. The lead re-ran it with a continuation coder (16:43–16:48Z).
2. **A late pass arrived with new findings.** The first pass came back after the gate material was ready,
   with 2 new findings (L1, L2) that had no coder check. They went to the owner flagged "no coder check";
   Build checked both and both were real.
3. **Driver-prompt defect.** The lead's spawn prompt told the continuation coder to revise the plan after
   Codex. The coder refused, citing `fkit-plan-task` §5 (the plan is not changed after Codex; findings go
   to the owner). The refusal was correct; the defect is in the driver's prompt.
4. **Procedure deviation.** Approver rounds 2 and 3 got the revised plan by scratch-file path plus a change
   list, not pasted inline as `fkit-plan-task` §2–3 says.
5. **Shortened Codex input.** The first Codex prompt dropped the reviewer attributions and cut Q1–Q5 to one
   line each. The late findings came from that shortened version. The re-run had the full plan.
6. **Codex sandbox.** Codex could not run the hook test suite (`EPERM`). The tests did not fail; Codex
   just could not run them.
7. **None of these happened:** a hop limit reached, a refused skill, an escalation after round 2 (no
   approver disagreement).
8. **Run event, not a plan-review problem:** the first Process-review worker died on an API auth error
   ("Not logged in") on 2026-10-11. The owner approved one re-spawn, and that worker finished the job.

## 7. Was the fresh-launch precondition met? (first log; `0474` *Notes*)

`0474`'s *Notes* say the trial must start from a fresh `fkit lead` launch. Otherwise the approvers run on
old agent prompts (0473's smoke test: agent prompts are not live after the `.claude/` copies refresh).

- **What we know (lead):** this lead session was launched fresh on 2026-10-10 (its first turn was the
  launch greeting), and `0473` was already in `done/` by then. The "Asked to approve a plan" guidance has
  been in the canonical `claude/agents/fkit-{producer,architect}.md` since commit `acd23a9`
  (2026-10-09 16:44:37Z).
- **What the record shows:** the producer judged scope and requirements ("all brief items covered … no
  scope creep"). The architect judged design consistency and feasibility (hook behaviour, consent rule,
  carrying the cap to workers). Neither raised the classification. The approver prompt (`fkit-plan-task`
  §2) only asks for the APPROVE / CHANGES REQUESTED shape and focused reasons. It does not give these
  role-specific focuses. So the replies **fit** the new guidance.
- **What it does not show:**
  - Each role's general prompt already points the same way (producer: scope; architect: design), so these
    replies could have come from the old prompts too.
  - The record is the planning coder's summary, not the approvers' raw replies ("trust, not proof",
    ADR-056).
  - What the installed `.claude/agents/` copies held at launch cannot be checked now. 0504's Build re-ran
    init at 2026-10-10T19:20:38Z, after the plan review, and overwrote them.
  - The coder spawned `@fkit-adversarial-reviewer`, as 0473's new consult bullet says. But the live
    `fkit-plan-task` skill text says it too, so this does not tell old prompts from new.
- **Verdict:** the precondition was likely met, going by the lead's account. The record fits the new
  guidance but **does not prove** the approvers used it.

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review.

**Rough comparison only, not a control.** Task `0495` (Sprint 10, done, no plan review) had a similar
shape: a new convention in both homes, role-prompt and sprint-loop pointers, and a `structure-spec`
row. Its code review took **3 rounds and found 9 findings** (1 medium, 6 low, 2 nit), several in its
relay pointers. `0504`'s code review took **1 round and found 2 findings** (both low). Many things could
explain the gap besides plan review: a different task, a different size, different reviewer runs, and
`0504` coming later, after `0495`'s lessons were already in the files. **Do not read it as an effect
size.**
