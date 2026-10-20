# Plan-review trial log — task 0526

**Date:** 2026-10-20
**Kind:** trial log for task `0474` (plan-review trial), back-filled from existing files
**Run:** sprint-13 run, `--plan-review`, started 2026-10-19T11:18Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0526` — check prove-red mutation 48 on one isolated Linux run before deciding the banner
tests (an investigation). Folder
`ai-agents/tasks/done/0526-check-prove-red-mutation-48-on-one-isolated-linux-run-before-deciding-the-banner-tests/`.
Sources: its `plan-review.md` (attempt 1, 2026-10-19), `plan.md`, `review.md`, `worklog.md`, `brief.md`.
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-20, selected option
verbatim: "Count all 13, log each (Recommended)" (description he saw: "Producer back-fills one log per task
from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown. Matches your 0504
precedent.").
**How written:** by a spawned `fkit-producer`, after the fact, from the files only. Nothing here was asked
of the owner or the run's agents.

---

## 1. Time added

Measured from the timestamps in `plan-review.md` (UTC, 2026-10-19).

| Stage | From → to | Elapsed |
|---|---|---|
| Waiting to ask | plan drafted 11:23:38 → round-1 ask 11:24:30 | 52s |
| Architect round 1 (CHANGES REQUESTED) | 11:24:30 → 11:26:28 | 1m58s |
| Revision 1 | 11:26:28 → 11:26:35 | 7s |
| Architect round 2 (APPROVE) | 11:26:35 → 11:27:37 | 1m02s |
| Codex | 11:27:37 → 11:31:21 | 3m44s |
| Coder check, record returned | 11:31:21 → 11:31:34 | 13s |
| Lead: gate prepared, plan presented | 11:31:34 → 11:33:03 | 1m29s |

- **Total, "plan ready" → "plan presented to the owner": 11:23:38 → 11:33:03 = 9m25s.** Architect:
  3m59s including the 7s revision. Codex: 3m44s.
- **Rounds:** 2 architect asks (1 revision round), 1 Codex pass.
- **How long the plan would have taken to reach the owner without plan review: not measured** (no
  baseline).

## 2. Classification

- **Coder's choice:** code-only → architect approves alone.
- **Reason given:** "an investigation; nothing fkit delivers changes (no file under claude/, bin/, test/);
  the only repo write is the task's worklog.md".
- **Was it right?** Yes. The architect agreed, and code review's scope was the worklog alone. Every finding
  was about worklog text, none about shipped code.

## 3. Findings that changed the plan

**Architect.** All adopted; no disagreement.

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | architect R1-1 | Probe fixture wrong: the suite wraps `sleep` in a sh script, not a symlink | **Yes, substantive** → C1 (wrapper / real-sleep dimension) |
| A2 | architect R1-2 | 10 launches can miss an occasional hold; set "Yes" = reproducible hold > 2 s, k of N | **Yes, substantive** → C2 (100 launches per shipped cell) |
| A3 | architect R1-3 | `spawnSync` mode must copy `launch()`'s options and env exactly | **Yes** → C3 |
| A4 | architect R1, non-blocking | pid reuse by a late watchdog kill; hash untracked files; maybe more than one holder | Yes, minor → C4–C6 |
| A5 | architect R2-4 | Worklog notes for 0529; an empty sleep log in real-sleep rows is expected | Yes, minor (worklog guidance) |
| A6 | architect R2-1/2/3 | C1–C3 fix the requests; decision rule holds; no ADR conflict | **Noise** — confirmation, no change |

**Codex** (owner: X1 "Add real-git cell (Recommended)", X2 + X3 "Adopt both (Recommended)").

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 | The probe never runs real `git`; a clean result cannot support "No" for real users (high) | confirmed | **Yes, substantive** — real-git cells added (file transport, 100 launches each) |
| X2 | Step 48's timestamp is its completion time | confirmed in part ("cannot isolate" disputed) | Yes, wording (state the method) |
| X3 | The "designed worst case" names paths the code does not take (6 s, not 5 s; no curl fall-through) | confirmed | **Yes** — worklog worst-case wording |
| X4 | The watchdog's stdin is not redirected; a stdin holder could be misread as an output-pipe holder | disputed, from libuv knowledge not a run; step 6's fd snapshot would show it anyway | **No** — noise as a plan change |

**Net:** 10 adopted changes (C1–C6 plus A5's notes from the architect; X1–X3 from Codex), 1
confirmation-only item (A6), 1 disputed finding with no change (X4). Both reviewers changed what the
investigation measures, not just its wording: A1, A2 and X1 widened the test matrix. The worklog's
"Scope of the No" rests on X1's real-git cell.

## 4. What the later code review still found

`review.md`: one round, 5 findings (1 medium, 4 low), all verified correct and fixed.

| # | Finding | Should plan review have caught it? |
|---|---|---|
| R1 | Worklog §0 counting slip ("13 files under `claude/`", really 12) | **No.** It was written at Build. |
| R2 | The recommendation credits the name-pattern option with a saving it does not give (medium; 0529 reads it) | **No.** The recommendation was a Build output, made from measurements that did not exist at plan time. |
| R3 | Recommendation item 2 contradicts itself (test-only vs shipped-code saving) | **No.** It was written at Build. |
| R4 | "Its cause exists only in the mutant" is too broad; the holder exists in the shipped launcher too | **No.** It comes from a finding made at Build. |
| R5 | Worklog cites working-tree line numbers without saying so | **Maybe.** A plan could have required naming the tree that cites point at. Nobody raised it. |

## 5. Extra reading for the owner, and his answer

- **What he saw at the gate (lead's lines):** the plan, then 4 questions: approval, CI push
  pre-approval, Codex X1, and Codex X2 + X3. **Two of the four (X1, X2 + X3) exist only because of
  plan review.** The CI-push question came from the plan itself. **Word count: not measured.**
- **"Did plan review help?"** not asked (back-filled 2026-10-20).

## 6. Anything that broke or confused

1. **Duplicate reply.** The architect replied twice in round 2 (by `SendMessage` and by
   `SubagentHandback`, both the same APPROVE). The coder counted it once. The record lists it under
   Problems as "none".
2. **Codex coverage, stated by the record:** read-only `rg` / `nl` only. No tests, Docker runs or
   mutations. Its findings come from reading and reasoning.
3. **X4 disputed on reasoning, not a run.** The coder says so plainly ("from my understanding of
   libuv's behaviour, not from a run made this turn").
4. **None of these happened:** a hop limit reached, a refused skill, an escalation after round 2 (no
   disagreement), Codex unavailable (mode `[codex]`).

## 7. Fresh-launch precondition

Fresh `fkit lead` launch: **unknown.** The files do not record when this lead session was launched
relative to its last `.claude/` refresh. The run's start (11:18Z) is five minutes before the plan was
drafted, which suggests a new run. It does not show a new launch (inference).

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review. No
similar past task without plan review is cited.
