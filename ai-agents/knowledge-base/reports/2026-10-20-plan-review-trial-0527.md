# Plan-review trial log — task 0527

**Date:** 2026-10-20
**Kind:** trial log for task `0474` (plan-review trial), back-filled from existing files
**Run:** sprint-13 run, `--plan-review`, started 2026-10-19T11:18Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0527` — record the ADR that resets fkit's test scope to shipped script behaviour (ADR-057).
Folder `ai-agents/tasks/done/0527-record-the-adr-that-resets-fkits-test-scope-to-shipped-script-behaviour/`.
Sources: its `plan-review.md` (attempt 1, 2026-10-19), `plan.md`, `review.md`, `worklog.md`, `brief.md`.
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-20, selected option
verbatim: "Count all 13, log each (Recommended)" (description he saw: "Producer back-fills one log per task
from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown. Matches your 0504
precedent.").
**How written:** by a spawned `fkit-producer`, after the fact, from the files only. Nothing here was asked
of the owner or the run's agents.

---

## 1. Time added

Measured from the timestamps in `plan-review.md` (UTC, 2026-10-19). "Plan ready" is taken as 12:55:57,
when plan v1 was complete and the round-1 asks went out. Drafting started 12:55:24.

| Stage | From → to | Elapsed |
|---|---|---|
| Round 1 (v1), producer + architect in parallel | 12:55:57 → 12:59:47 (last reply) | 3m50s |
| Revision 1 | 12:59:47 → 13:00:02 | 15s |
| Round 2 (v2) | 13:00:02 → 13:03:04 | 3m02s |
| Revision 2 | 13:03:04 → ~13:03:10 | ~6s |
| Round 3 re-ask (v3), both APPROVE | ~13:03:10 → 13:05:03 | ~1m53s |
| v3.1 fold-in (not re-shown) | 13:05:03 → 13:05:10 | 7s |
| Codex | ~13:05:10 → ≤13:12:08 | ≤6m58s |
| Coder check, record returned | ≤13:12:08 → 13:12:20 | ≥12s |
| Lead: gate prepared, plan presented | 13:12:20 → 13:14:28 | 2m08s |

- **Total, "plan ready" → "plan presented to the owner": 12:55:57 → 13:14:28 = 18m31s** (19m04s from the
  start of drafting). Approvers: 9m06s. Codex: ≤6m58s. Lead to the gate: 2m08s.
- **Rounds:** 3 asks to each approver (2 revision rounds, then a final re-ask), plus 1 voided placeholder
  consult not counted as a round. 1 Codex pass.
- **How long the plan would have taken to reach the owner without plan review: not measured** (no
  baseline).

## 2. Classification

- **Coder's choice:** product change → producer + architect approve.
- **Reason given:** "the ADR sets the rules that 0528 writes into shipped prompts … which install into and
  govern every consuming project. It also resets fkit's own test scope (code-only)."
- **Was it right?** Yes. Both approvers agreed in every round. ADR-057 drives `0528`'s shipped-prompt
  edits, and code review raised nothing about the classification.

## 3. Findings that changed the plan

**Approvers.** All adopted; no disagreement was open after round 2.

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | architect R1-1 (blocking) | No `decisions/` sweep; many ADRs name tests that may be deleted | **Yes, substantive** → §0 sweep + D11 table (grep also found ADR-035/040) |
| A2 | architect R1-2 | ADR-017 needs a ⚠️ note | **Yes** → phase-3 note; corrected in R2-1 to extend the existing Corrections item |
| A3 | architect R1-3 | A list of NEEDS-DECISION objects departs from the single-item shape; options must be concrete | **Yes** → departure stated; Q2/Q3 options concrete |
| A4 | producer R1-4 | The stop rule would halt on options the plan itself lists | **Yes, substantive** → every listed option in-plan |
| A5 | producer R1-5/6/7, architect R1-4 | Q5(c) knock-on; worklog in phase 2's write list; name 0522; Corrections by analogy | Yes, minor |
| A6 | architect R2-1/2 | Extend ADR-017's existing Corrections item; the report's own header style; existing ⛔ is emphasis | Yes, minor |
| A7 | producer R2-5/6 | Split Q1 into three concrete options; batch Q4a/Q4b/Q5 | Yes, minor |
| A8 | producer round 3 | Q1(c) nightly lane is not in 0530's brief; do not say it is | **Yes** → Q1(c) reworded (v3.1) |
| A9 | architect round 3 (condition) | ADR-026 D4 marker must depend on Q1 (⛔ vs ⚠️); name the ⭐ blockquote | **Yes** → v3.1, **seen by neither approver** |

**Codex** (owner: X2–X6 "Apply fixes at build (Recommended)"; X1 "Accept, brief overrides
(Recommended)").

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 | Using `/fkit-record-decision` while six owner decisions are open breaks its Step-1 precondition (high) | confirmed in part; the brief asks for a Proposed ADR | **Yes** — Status line says it holds open owner questions; owner ruled the brief overrides |
| X2 | A list of six NEEDS-DECISION objects has no path in the driver contract (high) | confirmed | **Yes** — list return accepted, relayed ≤4 per dialog |
| X3 | No Q3 option sets a real cap on new tests (high) | confirmed | **Yes** — each Q3 option sets a bound |
| X4 | Q5(c) hides a second choice; 0529 could delete the sole mitigation (high) | confirmed | **Yes** — Q5(c) split |
| X5 | Q6(c) would contradict 0528's brief; nothing holds 0528 (medium) | confirmed | **Yes** — 0528 waits on a producer re-brief if Q6 = (c) |
| X6 | Q1(c) nightly lane is outside 0530's scope; nothing holds 0530 (medium) | confirmed | **Yes** — 0530 waits on a re-brief if Q1 = (c) |

**Net:** about 20 adopted changes across 9 approver rows and 6 Codex findings. Every Codex finding was
confirmed, at least in part, and adopted, and no item was pure noise. X2 hit the same list-return
departure that the architect called "workable if stated" (A3), and the owner then had to rule on it. X6
built on the producer's round-3 note (A8).

## 4. What the later code review still found

`review.md`: one round, 4 findings (1 medium, 3 low), all verified correct and fixed with dated ⚠️ notes.

| # | Finding | Should plan review have caught it? |
|---|---|---|
| R1 | ADR-057 names 5 test files as "fourth category"; 14 claim it on disk, including the only check on `structure-manifest.tsv` (medium, sign-off integrity) | **Maybe.** Approver A1 forced a `decisions/` sweep, but nobody asked for the same sweep over the test headers. It is a scope gap in the plan's sweep, though the count itself was made at Build. |
| R2 | D3 states M2/M30/M31 targets as today's fact; cost estimate understated | **No.** It is Build wording. |
| R3 | D9 omits two shipped files (`structure-spec.md`, `structure-manifest.tsv`) that name deleted tests | **Maybe.** It is the same shape as A1: the plan swept `decisions/`, not `claude/` docs that name tests. |
| R4 | ADR-057 says it "amends" ADR-026 D4; ADR-026 says D4 stands | **Partly.** The marker rule came from the architect's round-3 condition (A9), folded in as v3.1, which no approver saw. The wording mismatch was written at Build. |

## 5. Extra reading for the owner, and his answer

- **What he saw at the gate (lead's lines):** a `plan review incomplete:` banner (v3.1 edits seen by
  neither approver; the producer's final re-ask saw deltas only; one voided consult), a driver note that
  the option A and C text was not held (session cleared), the plan, and 3 questions: approval, Codex
  X2–X6, Codex X1. **Two of the three exist only because of plan review**, plus the banner. The plan's
  own six phase-1 owner questions (Q1–Q6) came from the brief, not from plan review. **Word count: not
  measured.**
- **"Did plan review help?"** not asked (back-filled 2026-10-20).

## 6. Anything that broke or confused

1. **Placeholder consult.** The first architect consult (~12:55:30Z) went out with the literal text
   `PLAN_PLACEHOLDER` instead of the plan (the coder's error). `TaskStop` was **refused** (ownership), so
   the coder sent a void message. The consult returned CHANGES REQUESTED ("No plan reached me"), then
   "VOID". It was not counted as a round.
2. **Procedure deviation.** The producer's round-3 re-ask carried 5 deltas against v2, not the full v3
   text the skill asks for. The producer accepted judging the deltas.
3. **Unreviewed post-round edits.** v3.1 holds edits neither approver saw (the architect's stated approval
   condition plus two small wording fixes). Codex did attack v3.1. The lead showed all three items in the
   gate banner.
4. **Driver contract gap.** The plan's list of six NEEDS-DECISION objects has no defined relay path (X2).
   The owner accepted a list return relayed ≤4 per dialog.
5. **Lead context loss.** The driver note says the option A and C text was not held by the lead session
   (session cleared).
6. **None of these happened:** a hop limit reached, a spawn denied by the carry-check hook, an escalation
   after round 2 (no disagreement), Codex unavailable (mode `[codex]`, exit 0). The one refusal was
   `TaskStop`, a tool, not a skill.

## 7. Fresh-launch precondition

Fresh `fkit lead` launch: **unknown.** The files do not record when this lead session was launched
relative to its last `.claude/` refresh. The driver note says the lead's session was "cleared", which
the files do not explain further.

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review. No
similar past ADR task without plan review is cited.
