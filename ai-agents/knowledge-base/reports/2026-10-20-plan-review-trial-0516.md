# Plan-review trial log — task 0516

**Date:** 2026-10-20
**Kind:** trial log for task `0474` (plan-review trial), back-filled from existing files
**Run:** Sprint 12 run, `--plan-review`, started 2026-10-15T16:38:40Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0516` — fix the stale ADR-019 and `fkit-coder` line cites found during 0496.
Folder `ai-agents/tasks/done/0516-fix-the-stale-adr-019-and-fkit-coder-line-cites-found-during-0496/`.
Sources: its `plan-review.md`, `plan.md`, `review.md`, `worklog.md` and `brief.md`.
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-20, selected option
verbatim: "Count all 13, log each (Recommended)" (description he saw: "Producer back-fills one log per task
from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown. Matches your 0504
precedent.").
**How it was written:** after the fact by a spawned `fkit-producer`, from the files only. Nobody was asked
anything. Anything not in the files is marked as inference.

---

## 1. Time added

From the timestamps in `plan-review.md` (UTC, 2026-10-15). "≈" and "≤" times are the coder's own
approximations.

| Stage | From → to | Elapsed |
|---|---|---|
| Approver round 0 (architect) | plan drafted 16:44:25 → ask 16:45:19 → return ≈16:46:30 | ~2m05s |
| Revision 1 | ≈16:46:30 → ask 16:46:53 | ~23s |
| Approver round 1 (CHANGES REQUESTED) | 16:46:53 → ≈16:47:16 | ~23s |
| Revision 2 + approver round 2 (APPROVE) | ≈16:47:16 → ≤16:47:38 | ≤22s |
| Codex | 16:47:38 → ≤16:53:49 | ≤6m11s |
| Coder check + record + lead's gate | ≤16:53:49 → plan presented ≈16:57 | ~3m (estimate) |

- **Total, "plan ready" → "plan presented to the owner": 16:44:25 → ≈16:57 = ~12½ minutes (estimate; the
  lead recorded ≈16:57Z, and its clock read 16:56:43Z just before presenting).** Approver rounds: ~3m13s.
  Codex: ≤6m11s.
- **Rounds:** 3 architect asks (APPROVE with notes, CHANGES REQUESTED, APPROVE) and 1 Codex pass.
- **Caveats.** Wall-clock, not effort. The owner's answer time is not measured: `plan.md` was written at
  17:02:52Z, so he answered within ~6 minutes of presentation (estimate). **How long the plan would have
  taken to reach him without plan review: not measured** (no baseline).

## 2. Classification

- **Coder's choice:** code-only → architect approves alone.
- **Reason given:** "only cites change and ADRs get append-only notes; no fkit behaviour, rule or output
  changes (architect concurred every round)".
- **Was it right?** Yes, on the files. The diff touches shipped `claude/` files, but only their citations
  (line numbers become heading-and-quote anchors), plus append-only ADR notes. Code review confirmed that
  "every new heading+quote anchor lands on the sentence the old number meant" and found nothing else.
  *Inference:* someone could argue that editing text under `claude/` makes it a product change. The brief
  and the reviewers did not raise that.

## 3. Findings that changed the plan

**Approver** (architect only).

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | architect r0 (a) | "Clean tree" claim is false (sprint-12.md and the 0516 brief are modified) | Yes, wording → change 1 |
| A2 | architect r0 (b) | Add a prose-unchanged check for Step 2's re-wrap | **Yes** → change 2 (Steps 2–3 and Verify) |
| A3 | architect r0 (c) | Record ADR-037's one-note-two-sites choice in the worklog | Yes, bookkeeping → change 3 |
| A4 | architect r1 | The A2 check's normaliser strips a moved `**` and reports a false change (reproduced) | **Yes** → round-2 fix (indent-only strip). *It fixes a flaw in the check A2 itself added.* |
| A5 | architect r0, r2 | Classification right; cite form matches conventions; counts right | **Noise / confirmation**: no plan change |

**Codex** (2 findings; both confirmed; owner: "Approve with X1+X2 fixes (Recommended)").

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 (medium) | ADR-025's Related entry still holds stale ADR-019 cites `:97` and `:143`; the plan's "no other cite" claim is false | confirmed (the plan-time regex missed this form) | **Yes**: the ADR-025 note covers both |
| X2 (low) | The design report holds a second `:138` cite with no verdict line | confirmed | **Yes**: +1 worklog verdict line (13 in all) |

**Net:** 6 adopted changes (4 from the architect, 2 from Codex), plus confirmations that changed nothing.
Codex found the only scope gap: two stale cites the plan would have missed, which is the task's own goal.
The approver rounds mostly refined the plan's checks and wording.

## 4. What the later code review still found

`review.md`: 1 round, **0 findings** from either reviewer (Codex: "no significant issues found"). Process
review: none.

| # | Finding | Should plan review have caught it? |
|---|---|---|
| — | none | n/a |

## 5. Extra reading for the owner, and his answer

- **Extra reading at the gate (from the lead's lines):** one question, the approval, with an option that
  folded in the Codex fixes: "Plan plus Codex fixes: ADR-025 note also covers its 2 other stale refs; +1
  worklog line for the report. 13 verdict lines." *Inference:* without plan review he would have seen a
  plain approve question. The extra reading was about one option description. **Word count: not
  measured.**
- **"Did plan review help?"** not asked (back-filled 2026-10-20).

## 6. Anything that broke or confused

1. **Re-ask sent twice.** The architect's round-2 re-ask queued while the agent was finishing, so it was
   resent. Both copies got the same APPROVE, counted once.
2. **Approver fixed its own suggestion.** The round-1 CHANGES REQUESTED was about a flaw in the
   prose-unchanged check the architect had asked for in round 0. That was caught before the gate.
3. **None of these happened:** a hop limit reached, a refused skill, an escalation after round 2 (no
   disagreement), Codex unavailable (`codex exec` exited 0).
4. **Shared prompt file (noted in 0385's record):** this task's Codex review wrote the shared
   `.fkit/tmp/adversarial-prompt.md` at 17:38:14Z. 0385, planned next, fixes exactly that shared path. No
   collision was recorded.

## 7. Fresh-launch precondition

**Fresh `fkit lead` launch: unknown.** The files do not record how the Sprint 12 run's lead session was
launched. This was the run's first planned task (drafted 16:44Z, six minutes after the run started), but
the files do not say whether the session was relaunched after `0473`.

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review. No similar
past task is cited here.
