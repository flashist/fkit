# Plan-review trial log — task 0334

**Date:** 2026-10-20
**Kind:** trial log for task `0474` (plan-review trial), back-filled from existing files
**Run:** Sprint 12 run, `--plan-review`, started 2026-10-15T16:38:40Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0334` — fix the launcher's symlink-blind agents fail-safe.
Folder `ai-agents/tasks/done/0334-fix-the-launchers-symlink-blind-agents-fail-safe/`. Sources: its
`plan-review.md`, `plan.md`, `review.md`, `worklog.md` and `brief.md`.
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-20, selected option
verbatim: "Count all 13, log each (Recommended)" (description he saw: "Producer back-fills one log per
task from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown. Matches your 0504
precedent.").
**How this log was made:** written after the fact by a spawned `fkit-producer`, from the files above only.
No one was asked anything. Anything not in the files is marked as inference.

---

## 1. Time added

Measured from the timestamps in `plan-review.md` (UTC, 2026-10-16). Return times marked "≤" were stamped
when the coder noticed the reply.

| Stage | From → to | Elapsed |
|---|---|---|
| Plan drafted → approvers asked | 12:39:43 → 12:40:55 | 1m12s |
| Approver round 1 (architect + producer, in parallel) | 12:40:55 → ≤12:44:05 (producer ≤12:43:23) | ≤3m10s |
| Codex pass | ~12:44:30 (prompt file 12:44:55) → ≤12:51:23 | ~6m53s (start time approximate) |
| Record returned to the lead | 12:51:37 | — |
| Lead prepares and presents the gate | 12:51:37 → ≈12:54 | ≈2m (estimate; driver clock read 12:53:40 just before presenting) |

- **Total, "plan ready" → "plan presented to the owner": 12:39:43 → ≈12:54 = ≈14m (estimate; 13m57s to the
  driver's last clock reading).** Approvers: ≤3m10s. Codex: ~6m53s.
- **Rounds:** 1 approver round (both APPROVE). Five editorial changes were made after it and **not
  re-asked**. 1 Codex pass, completed.
- **Owner time at the gate: not measured.** The answers were received "before 2026-10-16T17:48:37Z",
  about 6 hours after the presentation, so the record gives no answering time.
- **Without plan review: not measured** (no baseline).

## 2. Classification

- **Coder's choice:** product change → producer + architect approve.
- **Reason given:** "it changes whether a session starts, and what the user is told, on a launch where
  setup failed."
- **Was it right?** Yes. The change is in the shipped launcher (`claude/fkit-claude.sh`) and changes what
  every user sees on a setup-failed launch, with a `CHANGELOG.md` bullet. No approver disputed it, and
  nothing in Build or code review contradicts it.

## 3. Findings that changed the plan

**Approvers.** Both APPROVE in round 1. No disagreement.

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | producer | Any-symlink strictness accepted, but must be recorded as deliberate | **Yes** → change (d), §7 deliberate-strictness record |
| A2 | architect | Close-out, worklog and CHANGELOG must say A/B/C are refused only on a setup-failed launch | **Yes** → change (d), §7 statement (carried into the worklog's "Statements the plan requires") |
| A3 | architect | Unreadable / unsearchable agents dir: decide and state | **Yes** → change (b), §9 accepted case |
| A4 | architect | Review-scope note about uncommitted 0284 hunks | Yes, bookkeeping → change (c), §8 |
| A5 | producer | Role-file residual belongs in the Q1 follow-up | Yes, minor → change (e) |
| A6 | producer + architect | "F+D" is two launcher runs, not "one run" | Yes, wording only → change (a) |
| A7 | architect | Each sed anchor must match exactly one line | Not in the round-1 change list. Build later added an anchor-matches-once guard (worklog, decision 2), so the point landed, but at Build |
| A8 | both | Design matches init's `path_contained` rule, no ADR; Q1 option 1 sound; shell semantics sound | **Noise** — confirmations, no plan change |

**Codex** (mode `[codex]`, completed, exit 0, no fallback banner). Rows marked "supplement" are the
adversarial reviewer's own Claude pass, labelled "NOT model-diverse".

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 (high) | The plan leaves symlinked `.claude`/`agents` live on a launch where setup succeeds | Confirmed as fact, disputed as a plan error: it was the plan's own measured Q1 residual | **No.** It stayed the owner's Q1: "Ship as scoped + follow-up brief (Recommended)" (follow-up `0521`) |
| X2 (medium) | Sed anchors for mutations 51–53 do not escape `[ … ]`, so they cannot prove anything | Confirmed (scratch probe) | **Yes, substantive** → PC1 (awk literal swaps), owner "Both (Recommended)" |
| X3 (medium, supplement) | `&` in sed replacements corrupts mutations 49/50; a broken file would count as a catch | Confirmed | **Yes, substantive** → PC1, plus a `0334/healthy` stays-green guard on every step |
| X4 (low, supplement) | macOS `/var` vs `/private/var` makes path assertions fail on a correct fix | Confirmed (probe) | **Yes** → PC2 (`realpathSync` every fixture) |
| X5 (low, supplement) | Any-symlink rule is stricter than the brief, but not put to the owner | Confirmed | **Yes, as an owner question** → PC3, owner "Refuse any symlink (Recommended)". The plan's design stayed; the narrowing became an owner ruling |

**Net:** 9 plan-changing points: A1–A6, plus X2–X5. A7 landed later, at Build. 1 Codex finding was no
change (X1), and the A8 confirmations were noise. Three of the four Codex rows that changed the plan
came from the Claude supplement, not from Codex itself (X3, X4, X5). Inference: the PC1 fix to the
mutation mechanics is the clearest catch, because as planned a broken mutation could have been reported
as a catch.

## 4. What the later code review still found

`review.md`: one round, 2 findings, both low, both verified correct and fixed.

| # | Finding | Should plan review have caught it? |
|---|---|---|
| R1 | No prove-red mutation covers the leaf `-L` test (cases C and E) or the ancestor not-a-directory branch; fixed with mutations 54 and 55 | **Yes, it could have.** Plan §6 listed mutations 49–53, and both approvers and Codex examined that section. They checked the mutation *mechanics* (X2, X3) but not whether every branch had one. |
| R2 | The CHANGELOG bullet omits a live symlinked agent file (case C), against the owner's PC3 ruling | **No, mostly.** The wording was written at Build, after the PC3 ruling. Plan §7 only said to add a bullet scoped to "when setup fails". |

## 5. Extra reading for the owner, and his answer

- **What he saw at the gate (`plan-review.md`, lead's lines):** 4 `AskUserQuestion` answers: PC1+PC2
  (one question), PC3, Q1 and the plan approval. **PC1+PC2 and PC3 exist only because of the Codex pass.**
  Q1 was the coder's own question and was in the plan before review. The record does not list the gate's
  other material (banners, findings table). **Word count: not measured.**
- **"Did plan review help?"** not asked (back-filled 2026-10-20).

## 6. Anything that broke or confused

1. **Plan review itself: nothing.** The record says "Problems: none (no spawn denied or failed, no hop
   limit hit, every reply well-formed)."
2. **The five round-1 changes were not re-asked.** The coder made them after both APPROVEs, labelled
   them "editorial; no code-scope change". That is allowed by the record's own wording. It means the
   approvers never saw the final §7 / §9 text.
3. **Run events, not plan-review problems:** a network failure (API `ENOTFOUND`) cut off the first Build
   worker, and the owner approved a re-spawn: "Re-spawn build to finish (Recommended)". A stray macOS
   `.DS_Store` failed one unit test, and the owner ruled "Delete it (Recommended)".
4. **Codex sandbox (code review, not plan review):** Codex could not run `node --test` (`mkdtemp`
   EPERM), so its code-review opinion was reasoning-only.
5. **None of these happened:** a hop limit reached, a refused skill, an escalation after round 2 (only
   one round), Codex unavailable.

## 7. Fresh-launch precondition

**Fresh `fkit lead` launch: unknown.** None of the task's files records whether the lead session for
the Sprint 12 run was freshly launched. What the installed `.claude/agents/` copies held at launch
cannot be checked now, because later `fkit-claude-init.sh` runs overwrote them (this task's own
worklog, "Dogfood refresh").

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review.
No rough comparison is offered for this task. The timings above are wall-clock time, not effort.
