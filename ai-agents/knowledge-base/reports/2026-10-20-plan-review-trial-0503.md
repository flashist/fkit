# Plan-review trial log — task 0503

**Date:** 2026-10-20
**Kind:** trial log for task `0474` (plan-review trial), back-filled from existing files
**Run:** Sprint 12 run, `--plan-review`, started 2026-10-15T16:38:40Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0503` — re-measure the full test run time, locally and on CI, and show both in CONTRIBUTING.
Folder `ai-agents/tasks/cancelled/0503-re-measure-the-full-test-run-time-locally-and-on-ci-and-show-both-in-contributing/`.
Sources: its `plan-review.md` (attempt 1, 2026-10-19), `plan.md`, `worklog.md`, `brief.md`. There is no
`review.md`.
**Cancelled before code review.** Brief status: *"⛔ Cancelled (agent-closed — not owner-verified)
(2026-10-20) — superseded by ADR-057 (test-scope reset): `0530` re-measures the suite after `0529`'s
cut."* The owner's Q4 ruling came at `0529`'s plan gate, verbatim *"Producer's proposals
(Recommended)"*. Build had finished phase 1 of 2: the CI measurement, local preconditions and the CI
side of the dominance analysis. Phase 2 (the timed local run and the `CONTRIBUTING.md` edit) never
started.
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-20, selected option
verbatim: "Count all 13, log each (Recommended)" (description he saw: "Producer back-fills one log per task
from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown. Matches your 0504
precedent.").
**How written:** by a spawned `fkit-producer`, after the fact, from the files only. Nothing here was asked
of the owner or the run's agents.

---

## 1. Time added

Measured from the timestamps in `plan-review.md` (UTC, 2026-10-19). "Plan drafted" is stamped only to the
minute (08:46Z).

| Stage | From → to | Elapsed |
|---|---|---|
| Architect round 1 (APPROVE + 4 non-blocking notes) | plan drafted 08:46 → received 08:48:00 | ≈2m (estimate; start stamped to the minute) |
| Revision 1 (notes adopted anyway) | 08:48:00 → 08:48:31 | 31s |
| Architect round 2 (APPROVE) | ~08:48:35 → received 08:49:04 | ≈29s |
| Codex: spawn → findings received | ~08:49:15 → 08:59:01 | ≈9m46s (includes one failed `codex exec` attempt, "model at capacity", and one retry) |
| Coder check, record returned | 08:59:01 → 08:59:25 | 24s |
| Lead: plan shown in chat, then questions | 08:59:25 → ? | **not measured** |

- **Total, "plan ready" → record returned: 08:46 → 08:59:25 ≈ 13m (estimate, start stamped to the
  minute).**
- **"Plan presented to the owner": not measured.** The lead's lines say the full plan was shown in chat
  in the turn before the questions, and the questions were asked on his next message ("ok"). No
  timestamp is given for either. The only bound: his answers arrived before 09:16:39Z (when `plan.md` was
  written). So the whole span, plan ready → owner answered, was at most ≈30m39s (an upper bound, not a
  measurement).
- **Rounds:** 2 architect asks (a re-ask so the approval covered notes adopted without being required),
  1 Codex pass with 1 retry.

## 2. Classification

- **Coder's choice:** code-only → architect approves alone.
- **Reason given:** "it changes contributor docs (CONTRIBUTING.md) and the task worklog; what fkit
  delivers to its users is unchanged."
- **Was it right?** The architect agreed, and phase 1 of Build touched only the worklog, which is
  consistent with the classification. **Confirmation by code review: not measured — cancelled before
  code review.**

## 3. Findings that changed the plan

**Architect.** No disagreement. Both rounds were APPROVE; the non-blocking notes were adopted anyway.

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | architect R1-3 | "Load doubles" wording must follow the numbers; no ratio across suites of different size | **Yes** → load-wording rule. Later reversed in part by Codex X8 and the owner's ruling |
| A2 | architect R1-4 | No SHA in CONTRIBUTING; the tree is dirty | Yes, minor (SHA in the worklog only) |
| A3 | architect R1-5 | Figures in two places can drift | Yes, minor (what-to-run rows local only) |
| A4 | architect R1-6 | Say what the CI job figure includes beyond the `npm test` step | Yes, minor |
| A5 | architect R2-3 | Suite-size line should name the CI size where it differs | Yes, wording only (not re-asked) |
| A6 | architect R1-1/2/7, R2-1/2 | Classification, ground truth and the rest sound | **Noise** — confirmation, no change |

**Codex** (owner: "All, X8 as lower bound (Recommended)").

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 | A run at load 3–<8 could be published without saying why idle was not reached (high) | confirmed | **Yes** — non-idle run labelled, reason in the worklog |
| X2 | HEAD + a dirty-path count does not fingerprint the tested tree (high) | confirmed | **Yes** — before/after sha256 fingerprint; a mismatch discards the run |
| X3 | The load filter cannot sample "every 30 s"; output arrives only at step ends | confirmed | **Yes** — reworded "load at each step end" |
| X4 | Background local run has no timeout or process-group cleanup (high) | confirmed | **Yes** — perl `alarm` watchdog ~60 min, group kill |
| X5 | `gh run list` not filtered to `push` events | confirmed | **Yes** — explicit `event == push` filter |
| X6 | First prove-red step `0a` has no preceding result line | wording gap only; undercount disputed | Yes, wording only. Undercount half: **noise** |
| X7 | Stale-figure grep checks only `12 min` | confirmed | **Yes** — wider grep |
| X8 | Plan has no path to the brief's "roughly double" statement | confirmed in part | **Yes** — owner chose "lower bound" (it reverses A1's no-ratio rule) |

**Net:** 13 adopted changes (5 from the architect, 8 from Codex), 1 confirmation-only item (A6) and 1
half-noise item (X6). Codex found three high-severity gaps (X1, X2, X4) that the architect's two APPROVE
rounds did not raise. One Codex finding (X8) partly reversed a change the architect had asked for.

## 4. What the later code review still found

**Not measured — cancelled before code review.** No `review.md` exists.

## 5. Extra reading for the owner, and his answer

- **What he saw at the gate (lead's lines):** the full plan and attachments in chat, then 4 questions:
  idle machine, run count, Codex fixes, approval. The Codex-fixes question (8 findings) exists only
  because of plan review. The lead also disclosed that the plan step started before his specific word,
  which 0503's brief requires; approval was stated to count as that word. **Word count: not measured.**
- **"Did plan review help?"** not asked (back-filled 2026-10-20).

## 6. Anything that broke or confused

1. **Codex at capacity.** The first `codex exec` failed ("Selected model is at capacity", exit 1). One
   retry finished (exit 0). It was not a fallback: mode stayed `[codex]`.
2. **Codex coverage gap, stated by the record:** Codex ran only read commands and did not query live
   GitHub runs. So the plan's CI claims ("11 such green runs", one run ~22 min) were not checked by
   Codex.
3. **Unrequested side message.** The architect's round-2 hand-back said it also sent its verdict by
   `SendMessage` to another agent, which nobody asked for. It does not change the record.
4. **Start before the owner's word.** The plan step began before the owner's specific word, which the
   brief requires. This is a driver/run issue, not a plan-review one, and was disclosed at the gate.
5. **Plan-review work not used.** The task was cancelled the next day, superseded by ADR-057. The
   reviewed plan was only half built. This is not a plan-review failure, but its review time bought no
   shipped result.
6. **None of these happened:** a hop limit reached, a refused skill, an escalation after round 2 (no
   disagreement), Codex unavailable (one capacity failure, then success on retry).

## 7. Fresh-launch precondition

Fresh `fkit lead` launch: **unknown.** The files do not say when the Sprint 12 lead session started
relative to its last `.claude/` refresh, and the plan step ran four days into the run (2026-10-19).

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review. With no
code review, this log cannot say whether plan review reduced later findings. No similar past task without
plan review is cited.
