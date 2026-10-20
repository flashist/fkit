# Plan-review trial log — task 0528

**Date:** 2026-10-20
**Kind:** trial log for task `0474`, back-filled from existing files
**Run:** sprint-13 run, `--plan-review`, started 2026-10-19T18:11Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0528` — change the rules that make the test suite grow.
Folder `ai-agents/tasks/done/0528-change-the-rules-that-make-the-test-suite-grow/`. Sources: its
`plan-review.md`, `plan.md`, `review.md`, `worklog.md`, `brief.md`. Nothing here was relayed by the lead.
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-20, selected option
verbatim: "Count all 13, log each (Recommended)" (description he saw: "Producer back-fills one log per
task from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown. Matches your 0504
precedent.").
**Written after the fact** by a spawned `fkit-producer`, from the files only. No one was asked anything.

---

## 1. Time added

From the timestamps in `plan-review.md` (UTC, 2026-10-19). Most are written as "~" in the record, so
each elapsed time below is an **estimate** to within about a minute.

| Stage | From → to | Elapsed |
|---|---|---|
| First architect ask, sent with a placeholder instead of the plan (see §6) | 18:16 → full-plan ask ~18:18:45 | ~2m45s (estimate), no verdict |
| Plan drafted | ~18:18 | — |
| Approver round 0 (architect, then producer) | ~18:18:45 → producer verdict ~18:21:50 | ~3m05s (estimate) |
| Revision 1 + round-1 re-ask (both) | ~18:21:50 → 18:22 → last verdict ~18:24:15 | ~2m25s (estimate) |
| Revision 2 + round-2 re-ask (both) | ~18:24:15 → ~18:24:25 → last verdict ~18:24:50 | ~35s (estimate) |
| Codex | start 18:25:40 → end ~18:33:15 | ~7m35s (estimate) |
| Record returned, then driver to the gate | ~18:33:15 → 18:34 → plan presented 18:35:22 | ~2m07s (estimate) |

- **Total, "plan ready" → "plan presented to the owner": ~18:18 → 18:35:22 = ~17m (estimate; the start
  time is written "~18:18Z").** Approvers about 6m from the full-plan ask; Codex about 7m35s; the
  placeholder slip added about 2m45s before that, partly overlapping the drafting.
- **Rounds:** 3 approver asks (round 0, then 2 revision rounds, both approvers APPROVE at round 2) and 1
  Codex review.
- **How long the plan would have taken to reach the owner without plan review: not measured** (no
  baseline).

## 2. Classification

- **Coder's choice:** product change → producer + architect approve.
- **Reason given:** "the edited prompts under claude/ install into every consuming project and change
  what its reviewer counts as a defect and what its coder does about tests (ADR-057 §D9)."
- **Was it right?** Yes. The build edited shipped role prompts and skills under `claude/` (review.md's
  file list). Neither approver disputed it, and nothing later contradicts it.

## 3. Findings that changed the plan

**Approvers.** One disagreement with a suggestion (A1: the coder chose closeout over the producer's
suggested form, and said why); no unresolved disagreement.

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | architect R0-1 + producer R0-1 | MT-C's "Frontier-move" puts an owner STOP and a residual in front of every missing-test finding, against ADR-019 | **Yes, substantive** → MT-C uses Step 2's closeout form (no stop, no residual); MT-E marks `Suggestion`. Coder chose closeout over the producer's own suggestion |
| A2 | architect R0-2 | Q1 options must apply the same way at every grading site | **Yes** → one NK slot with A/B/C at all five sites |
| A3 | architect R0-3 + producer R0-2 | CONTRIBUTING describes a nightly lane nothing builds; ⚠️ too narrow | Yes → ⚠️ widened. **Its premise was wrong** — corrected by A6 |
| A4 | architect R0-4 + producer R0-3 | An agent's plan-review APPROVE must not count as the owner's OK | **Yes** → became owner question Q2's recommended option |
| A5 | producer R0-3/5 | Plainer Q1/Q2, gloss "key list", hand-off names the D9 split with `0529` and the M-number note | Yes, minor (wording + hand-off) |
| A6 | producer R1-1 | Wrong fact: `0530` was re-briefed to build the nightly lane | **Yes** → ⚠️ corrected, follow-up dropped, ADR line routed to the architect's dated-note routine. The architect then withdrew A3's premise |
| A7 | architect R1 (non-blocking) | Gloss "(re-litigation)" inside MT-C; re-run the citation check after every edit | Yes, minor (gloss added) |
| A8 | producer R0-4/5 | "No creep; order fine" | **Noise** — confirmation only |

**Codex** (3 findings; the plan is not changed after Codex — findings go to the owner).

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 | MT-C edits `fkit-process-stateful-review`, which ADR-019 and three prompts call "byte-unchanged" | partly confirmed | **Yes, via the owner** → owner question Q3; owner: "Go ahead (Recommended)". Hand-off adds an optional ADR-019 dated-note follow-up |
| X2 | `closeout (re-litigation)` with no residual stretches Step 2's closeout meaning; a later identical finding has no valid basis | partly confirmed (label stretch real; "repeatedly re-opened" disputed) | No plan change. **But see §4 R1** — code review later found an ambiguity at the same seam |
| X3 | MT-E adds `Suggestion` to a column defined only for Defect / Frontier-move | disputed (MT-E defines the path; nothing parses the column) | **Noise** — no change |

**Net:** 7 approver points changed the plan (A1–A7), 1 was confirmation only (A8). One of the 7 (A3) was
built on a wrong premise and needed A6 to undo it. Codex: 1 of 3 led to an owner question (X1), 1 was
noise (X3), 1 was not adopted but pointed at the seam code review later hit (X2).

## 4. What the later code review still found

`review.md`: one round, 2 findings, both low, both verified correct and fixed. Coverage: reasoning-only
second opinion (Codex inspected source text only).

| # | Finding | Should plan review have caught it? |
|---|---|---|
| R1 | MT-C's "Step 2's closeout form" can read as the task loop's "loop-check fires" → non-convergence STOP — the very stop closeout was chosen to avoid | **Partly.** The closeout choice came from approver round 0 (A1), and Codex X2 flagged the closeout-form stretch at the same seam; the coder disputed the consequence. No one checked the task loop's non-convergence wording. |
| R2 | CONTRIBUTING's release row says "nothing beyond" `npm test`, contradicting the new *Test rules* once `0529` moves the release test out | **No.** The worklog says the plan's own text limited "nothing beyond it" to the unsure case; the slip was in the build's wording. |

## 5. Extra reading for the owner, and his answer

- **Extra reading at the gate:** no banners (driver note); the placeholder slip noted to him (not counted
  as a round); the plan; three questions in one batch. **Q3 exists only because of Codex X1.** Q2's
  recommended option ("agents' plan review never counts") came from approver point A4. Whether the Codex
  findings table itself was shown is not recorded. **Word count: not measured.**
- **"Did plan review help?"** not asked (back-filled 2026-10-20).
- Owner decision at the gate: "Approve (Recommended)", plus Q1 "Suggestion, and say so (Recommended)",
  Q2 "When my approved plan names it (Recommended)", Q3 "Go ahead (Recommended)" (`AskUserQuestion`,
  2026-10-19, `fkit lead` session).

## 6. Anything that broke or confused

1. **Send error: placeholder plan.** The first architect spawn carried the literal text
   `PLAN_PLACEHOLDER`. The coder could not stop it (TaskStop refused: not owner), sent a correction, got
   "NO VERDICT" plus a pre-read checklist, then sent the full plan. About 2m45s lost (estimate).
2. **Duplicate delivery.** The producer's round-1 hand-back arrived twice; counted once.
3. **An approver point built on a stale fact.** A3 (both approvers) assumed the nightly lane had no
   brief; the producer caught it a round later (A6).
4. **None of these happened:** a hop limit reached, a refused skill (no spawn denied), an escalation after
   round 2 (no disagreement), Codex unavailable (exit 0, no fallback banner).

## 7. Fresh-launch precondition

Fresh `fkit lead` launch: **unknown.** The records name the run's start time but say nothing about how
the lead session was launched, and what the installed agent copies held at that time cannot be checked now.

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review.
No rough comparison is given: the files name no similar past task without plan review.
