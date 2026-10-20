# Plan-review trial log — task 0385

**Date:** 2026-10-20
**Kind:** trial log for task `0474` (plan-review trial), back-filled from existing files
**Run:** Sprint 12 run, `--plan-review`, started 2026-10-15T16:38:40Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0385` — give the Codex adversarial prompt a task-keyed path.
Folder `ai-agents/tasks/done/0385-give-the-codex-adversarial-prompt-a-task-keyed-path/`.
Sources: its `plan-review.md`, `plan.md`, `review.md`, `worklog.md` and `brief.md`.
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-20, selected option
verbatim: "Count all 13, log each (Recommended)" (description he saw: "Producer back-fills one log per task
from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown. Matches your 0504
precedent.").
**How it was written:** after the fact by a spawned `fkit-producer`, from the files only. Nobody was asked
anything. Anything not in the files is marked as inference.

---

## 1. Time added

From the timestamps in `plan-review.md` (UTC, 2026-10-15). "By" and "~" times are the coder's own
approximations.

| Stage | From → to | Elapsed |
|---|---|---|
| Planning (no review yet) | 17:43:23 → plan drafted 17:48:41 | 5m18s |
| Round 0 (void: architect sent a placeholder) | ~17:49 → by 17:50:17 | ~1m |
| Approver round 1 (architect + producer) | ~17:49–17:50 → by 17:51:28 | ~2m |
| Revision 1 | by 17:51:28 → round-2 asks 17:52:50 | ~1m22s |
| Approver round 2 (both APPROVE) | 17:52:50 → by 17:53:14 | ~24s |
| Codex (plus a Claude supplemental leg) | spawn 17:54:13 → reply by 18:02:22 | ~8m09s |
| Coder check + record + lead's gate | 18:02:22 → plan presented ≈18:05 | ~2m40s (estimate) |

- **Total, "plan ready" → "plan presented to the owner": 17:48:41 → ≈18:05 = ~16 minutes (estimate; the
  lead did not read the clock at presentation. The record came back at 18:02:45Z, and the owner's answers
  arrived before 18:12:53Z).**
- **Rounds:** 3 approver asks (1 void, 1 with notes, 1 final APPROVE). 1 Codex pass, which also carried
  3 Claude supplemental findings.
- **Caveats.** Wall-clock, not effort. The owner's answer time is not measured beyond "before 18:12:53Z".
  **How long the plan would have taken to reach him without plan review: not measured** (no baseline).

## 2. Classification

- **Coder's choice:** product change → producer + architect approve.
- **Reason given:** "it changes the shipped review procedures (fkit-review, fkit-adversarial-review,
  fkit-stateful-review): which file the reviewer agents write, and whether two concurrent reviews are
  safe."
- **Was it right?** Yes. The change edits three shipped skills, the shipped adversarial-reviewer agent and
  `claude/README.md`, and adds a CHANGELOG line. Both approvers agreed, and nothing later contradicts it.

## 3. Findings that changed the plan

**Approvers.** Both returned APPROVE in round 1, with non-blocking notes. All the notes were folded in
(changes 1–9), and both returned APPROVE in round 2. The void round 0 also raised points, which were folded
into rounds 1–2. No disagreement.

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | architect R1-2 | Stateful key comes from the key already resolved, never re-resolved | Yes → change 1 |
| A2 | architect R1-4 | Override must name both the assemble step and the run line | Yes → change 2 |
| A3 | architect R1-3 + producer R1-3 | Never call the label "the ledger key"; shapes A and B cannot collide | Yes → changes 3, 9 |
| A4 | architect R1-4 + producer R1-4 | Guard that the run-id command is byte-identical in both copies | **Yes** → change 4 (test) |
| A5 | architect R1-4 | The adversarial reviewer has no Write tool, so it writes through a heredoc | **Yes** → change 5. *See §4: the heredoc text this led to was the code review's medium finding.* |
| A6 | architect R1-5 | Two more stale mentions, as historical | Yes, minor → change 6 |
| A7 | producer R1-2 | CHANGELOG and guard test are stated additions, not an owner question | Yes → change 7 (old OQ3 dropped) |
| A8 | producer R1-5, R1-6 | OQ1 relay-ready; correct the mktemp reason; OQ2 changes the round-1 habit | Yes → change 8 |
| A9 | architect R0 (void) | Always add a per-run token; path as literal text; single source | Yes, folded into rounds 1–2 |
| A10 | both, round 2 | Confirmations; relay OQ1/OQ2 before Step 1 | **Noise / confirmation**: no plan change |

**Codex** (3 findings from Codex, plus 3 from a Claude supplemental leg marked "NOT model-diverse"). Owner:
"PQ1–3 yes, PQ4 no change (Recommended)".

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 (high) | Two concurrent stateful reviewers compute the same round N, so they share a prompt path | confirmed | **Yes** → PQ1 (run id on the stateful shape too) |
| X2 | Rules 1–2 truncate the key to `<NNNN>`, not the full folder name | disputed (IDs unique; the architect approved) | **No**: noise |
| X3 (high) | Guard checks phrases only; a different fixed path would pass | confirmed | **Yes** → PQ3 |
| C1 (Claude) | Branch slug only maps `/`; `feat$(id)` can run code in the reviewer's shell | confirmed (ran `git check-ref-format`) | **Yes** → PQ2 (shell-safe label, quoted paths) |
| C2 (Claude) | A clean round repeats N, so keyed files are reused | confirmed | **Yes** → covered by PQ1 |
| C3 (Claude) | PID reuse within one second | confirmed as reasoning, low | **No** → PQ4 "no change" |

**Net:** about 13 adopted changes (9 approver changes, the round-0 points, PQ1–PQ3), plus 2 items not
adopted (X2 disputed, PQ4 no change) and the approvers' round-2 confirmations. One high-severity Codex
finding (X1) hit a race the plan had listed as an accepted edge case. The shell-injection finding (C1) came
from the Claude supplemental leg, not from Codex.

## 4. What the later code review still found

`review.md`: 2 rounds, 3 findings (1 medium, 2 low), all verified correct and fixed. R1 and R3 were fixed on
owner rulings.

| # | Finding | Should plan review have caught it? |
|---|---|---|
| R1 (medium) | The prescribed `<<'EOF'` heredoc ends early on a bare `EOF` line in inlined untracked files or plan text: the prompt is silently cut, and later lines run as shell | **Yes, and plan review introduced it.** The heredoc came from approver point A5, and the exact `<<'EOF'` wording from PQ2's drafted text, which the owner adopted word for word. Neither the approvers nor Codex checked the delimiter against inlined content. The fix needed an owner ruling, because it changed text he had adopted: "Unique marker per run (Recommended)". |
| R2 | The guard does not pin the PQ2 branch-label rule | **Partly.** PQ3 strengthened the guard for paths but not for the PQ2 label rule adopted at the same gate. |
| R3 | `fkit-review` item 2 names no way to write the prompt (inherited by `fkit-stateful-review`) | **Partly.** The gap was already there before this change (at HEAD). A5 raised the write method for the adversarial reviewer only. Owner: "Fix it now in 0385 (Recommended)", which widened the plan. |

## 5. Extra reading for the owner, and his answer

- **Extra reading at the gate (from the lead's lines and `plan.md`):** OQ1 (naming), OQ2 (round tag), the
  post-Codex questions PQ1–PQ4 (drafted text for each), and the plan approval. OQ1 and OQ2 were already in
  the plan before review; the producer asked to make OQ1 "relay-ready". **PQ1–PQ4 exist only because of
  plan review.** After Build, plan review's own wording (R1, R3) caused two more owner rulings. **Word
  count: not measured.**
- **"Did plan review help?"** not asked (back-filled 2026-10-20).

## 6. Anything that broke or confused

1. **Malformed approver consult.** The round-0 architect ask carried a placeholder instead of the plan, the
   coder's error. `TaskStop` could not cancel it. It was treated as void, and a proper round 1 was run.
2. **The plan pass used the very file under repair.** The Codex plan pass wrote the skill's shared
   `.fkit/tmp/adversarial-prompt.md`, because the skill still prescribed it and no owner ruling allowed
   anything else. No collision was observed: `ps` showed no concurrent `codex exec`, and the prompt header
   names 0385. 0516's review had written the same shared file at 17:38:14Z, before this planning began.
3. **Mixed second opinion.** Codex ran (exit 0), but the record also carries 3 findings marked
   "[claude — supplemental, NOT model-diverse]". The most serious design gap adopted (C1, shell injection)
   came from that Claude leg.
4. **Post-approval edit to `plan.md`.** A line-number cite to an append-only wiki log turned the citation
   test red before Build. It was fixed by the lead on an owner ruling, "Fix the citation (Recommended)"
   (2026-10-15). This is a plan-text problem, not a plan-review one.
5. **None of these happened:** a hop limit reached, a refused skill, an escalation after round 2 (no
   disagreement), Codex unavailable (`codex exec` exited 0).

## 7. Fresh-launch precondition

**Fresh `fkit lead` launch: unknown.** The files do not record how the Sprint 12 run's lead session was
launched. What the installed `.claude/agents/` copies held at that time cannot be checked from the files.

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review. No similar
past task is cited here.
