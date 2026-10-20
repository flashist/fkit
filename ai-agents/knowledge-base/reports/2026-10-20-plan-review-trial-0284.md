# Plan-review trial log — task 0284

**Date:** 2026-10-20
**Kind:** trial log for task `0474` (plan-review trial), back-filled from existing files
**Run:** Sprint 12 run, `--plan-review`, started 2026-10-15T16:38:40Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0284` — bound the update check's git path, which has no deadline and hangs.
Folder `ai-agents/tasks/done/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/`.
Sources: its `plan-review.md`, `plan.md`, `review.md`, `worklog.md` and `brief.md`.
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-20, selected option
verbatim: "Count all 13, log each (Recommended)" (description he saw: "Producer back-fills one log per task
from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown. Matches your 0504
precedent.").
**How it was written:** after the fact by a spawned `fkit-producer`, from the files only. Nobody was asked
anything. Anything not in the files is marked as inference.

---

## 1. Time added

From the timestamps in `plan-review.md` (UTC). Return times marked "~" are the coder's own approximations.

| Stage | From → to | Elapsed |
|---|---|---|
| Approver round 0 (architect + producer, in parallel) | plan drafted 20:46:01 → ask 20:47:50 → last return ~20:52:29 | ~6m28s |
| Revision 1 | ~20:52:29 → re-ask 20:53:02 | ~33s |
| Approver round 1 (both APPROVE) | 20:53:02 → ~20:54:20 | ~1m18s |
| Codex | spawn 20:54:20 (full plan only by a follow-up at ~20:55:20) → end ~21:00:20 | ~6m00s |
| Coder check + record + lead's gate | ~21:00:20 → plan presented ≈21:03 | ~2m40s (estimate) |

- **Total, "plan ready" → "plan presented to the owner": 20:46:01 → ≈21:03 = ~17 minutes (estimate; the
  lead recorded "≈21:03Z", its clock read 21:02:56Z just before presenting).**
- **Rounds:** 2 approver asks (round 0, then one revision round), and 1 Codex pass.
- **Caveats.** Wall-clock, not effort. The record says it was "returned 2026-10-16T00:0x", which is later
  than the lead's ≈21:03Z presentation time. The two do not agree, and the files do not explain the gap.
  The owner's answer time is not measured: the files say only that his answers came before
  2026-10-16T06:43:38Z. **How long the plan would have taken to reach him without plan review: not
  measured** (no baseline).

## 2. Classification

- **Coder's choice:** product change → producer + architect approve.
- **Reason given:** "it changes the runtime behaviour of the shipped `fkit` launcher (startup update check)
  and of `fkit update`."
- **Was it right?** Yes. The change edits `claude/fkit-claude.sh`, which ships to every install, and adds a
  `CHANGELOG.md` line. Neither approver disputed it, and nothing in Build or code review contradicts it.

## 3. Findings that changed the plan

**Approvers.** Both returned APPROVE with points in round 0. The coder's changes C1–C9 answered them. Both
returned APPROVE again in round 1. No disagreement.

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | producer 4 + architect 9 | Rename the timeout constant; say it is fixed, not user-settable | **Yes** → C1 (`FKIT_INSTALLER_FETCH_TIMEOUT`, off the Env: list) |
| A2 | architect 3 | `set -e`-safe `rm -f … \|\| :` | Yes, minor → C2 |
| A3 | architect 7 | Helper body as a subshell with stderr to /dev/null | **Yes** → C3 |
| A4 | architect 8 | Measure under `/bin/dash` | Yes, minor → C4 (macOS only, no Linux claim) |
| A5 | architect 4 | BusyBox `ps` in not-covered | Yes, minor → C5 |
| A6 | producer 6 | Say exactly what was measured; run §5.4b through the real `fkit update` | **Yes** → C6 |
| A7 | producer 2, 3 | Cite 0481 / mutation 41 green from this run; flag the CHANGELOG deviation | Yes → C7, C8 |
| A8 | architect 9 | Owner question on whether the limit can be overridden | **Yes** → OQ4 (owner: "Fixed (Recommended)") |
| A9 | architect, round 1 | Write the mktemp guard as `\|\| exit 0` | Yes, editorial (adopted without a re-ask) |
| A10 | producer 1, 5, 7; architect 1, 2, 5, 6 | Scope, classification, sketch run under sh/dash/bash, curl-first rejection, ceilings | **Noise / confirmation only** — no plan change |

**Codex** (7 findings; the coder checked each; the owner adopted all six resulting fixes: "All six, PQ1–PQ6
(Recommended)").

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 (high) | Watchdog sends only TERM; a TERM-ignoring git hangs startup forever | confirmed in principle | **Yes** → PQ1 (escalate to KILL; new mutation 47) |
| X2 | Child walk kills only direct children; "no stray" overreaches | confirmed, severity disputed | **Yes** → PQ2 (claim narrowed, no recursive walk) |
| X3 | `no-stray` test's 2 s grace is shorter than the ≤5 s window: flaky | confirmed | **Yes** → PQ3 (deterministic test) |
| X4 | `< 12 s` bound does not test the 5 s ceiling | confirmed | **Yes** → PQ4 (`< 7 s` / `< 7.5 s`; later widened, see §6) |
| X5 | Reinstall check is argv-only; copied-flags fallback weakens step 5 | partly | **Yes** → PQ5 (fallback dropped) |
| X6 | PID-reuse window is wider than "microseconds" | confirmed (low) | Yes, wording → PQ6 |
| X7 | CHANGELOG line conflicts with brief step 13 | partly | **Yes** → PQ6 (the owner's yes is the step-13 exception) |

**Net:** 15 adopted changes (9 approver changes C1–C9, OQ4, the editorial mktemp guard, and 6 Codex PQs
covering 7 findings), plus the approvers' confirmations, which changed nothing. Codex found the one
high-severity design gap (X1). The approvers had read the same watchdog sketch, and the architect had run it,
but neither raised X1.

## 4. What the later code review still found

`review.md`: 2 rounds, 3 findings, all low, all verified correct and fixed. Round 2 found nothing new.

| # | Finding | Should plan review have caught it? |
|---|---|---|
| R1 | Nothing pins that the watchdog is **disarmed** when git answers; deleting the disarm line leaves the suite green | **Partly.** It is a gap in the plan's own `no-stray` test design, and Codex X3 examined that very test (timing), but nobody looked at the disarm. |
| R2 | Test `reap()` SIGKILLs pids already confirmed dead (PID-reuse risk) | **No, mostly.** `reap()` was a Build-time detail. Codex X6 had raised the same PID-reuse class, but for the launcher, not the test. |
| R3 | A slack comment the change wrote is wrong | **No.** Build-time wording. |

Round 2 also suppressed two settled items as accepted residuals, recorded on owner rulings (2026-10-16).

## 5. Extra reading for the owner, and his answer

- **Extra reading at the gate (from the lead's lines and `plan.md`):** the post-Codex questions PQ1–PQ6
  (drafted replacement text for each), OQ4, and the plan approval. PQ1–PQ6 come from Codex and OQ4 from the
  architect, so **2 of the 3 gate questions exist only because of plan review**. Only the approval would
  have been asked without it. **Word count: not measured.**
- **"Did plan review help?"** not asked (back-filled 2026-10-20).

## 6. Anything that broke or confused

1. **Codex prompt placeholder.** The coder's first Codex spawn carried a literal "[PLAN_TEXT]" in place of
   the plan. A follow-up `SendMessage` delivered the full final plan, and the adversarial reviewer confirmed
   it attacked that text.
2. **Sandbox denial.** The coder's own planning-time `sh -c` watchdog experiment was denied by the sandbox's
   removal-safety check. It was not retried. The architect's scratchpad runs supplied the evidence instead.
3. **A Codex-driven tightening later needed an owner re-ruling.** PQ4 (from X4) set `< 7 s`. The first full
   `npm test` went red with `0284/git-deadline` at 7.086 s under load. The owner widened it: "Widen to < 10 s
   (Recommended)" (2026-10-16). Verify also hit a race in the PQ3 `no-stray` test (9 in 160 launches under
   heavy load), fixed test-only (worklog D11). *Inference:* plan review made the tests stricter, and some
   of that strictness did not survive a loaded machine.
4. **Time records disagree.** The record says "returned 2026-10-16T00:0x"; the lead says it presented
   ≈21:03Z on 2026-10-15 (see §1).
5. **Build hold, not a plan-review problem:** Build was held while 0385's red re-verify went to the owner,
   because both touch `claude/`.
6. **None of these happened:** a hop limit reached, a refused skill, an escalation after round 2 (no
   disagreement), Codex unavailable (`codex exec` exited 0).

## 7. Fresh-launch precondition

**Fresh `fkit lead` launch: unknown.** The files do not record how the Sprint 12 run's lead session was
launched. What the installed `.claude/agents/` copies held at that time cannot be checked from the files.

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review. No similar
past task is cited here.
