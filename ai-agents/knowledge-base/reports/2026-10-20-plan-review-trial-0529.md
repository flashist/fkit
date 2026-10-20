# Plan-review trial log — task 0529

**Date:** 2026-10-20
**Kind:** trial log for task `0474`, back-filled from existing files
**Run:** sprint-13 run, `--plan-review`, started 2026-10-19T18:11Z (`fkit-sprint-ship-loop`, `fkit lead` session)
**Task:** `0529` — cut the test suite down to shipped-script behaviour tests.
Folder `ai-agents/tasks/done/0529-cut-the-test-suite-down-to-shipped-script-behaviour-tests/`. Sources: its
`plan-review.md`, `plan.md`, `review.md`, `worklog.md`, `brief.md`. Nothing here was relayed by the lead.
**Why this is a trial run:** owner, `AskUserQuestion`, `fkit lead` session, 2026-10-20, selected option
verbatim: "Count all 13, log each (Recommended)" (description he saw: "Producer back-fills one log per
task from existing files; 'did it help?' and 'fresh launch?' marked not asked/unknown. Matches your 0504
precedent.").
**Written after the fact** by a spawned `fkit-producer`, from the files only. No one was asked anything.

---

## 1. Time added

From the timestamps in `plan-review.md` (UTC, 2026-10-20). Return times marked "~" in the record are
**estimates** to within about a minute.

| Stage | From → to | Elapsed |
|---|---|---|
| Plan drafted → round-0 asks sent | 07:53:58 → 07:55:30 | 1m32s |
| Approver round 0 (architect + producer, in parallel) | 07:55:30 → last return ~08:02:50 | ~7m20s (estimate) |
| Revision 1 | ~08:02:50 → 08:03:03 | ~13s (estimate; likely drafted while waiting on the architect — inference) |
| Approver round 1 | 08:03:03 → ~08:06:45 | ~3m42s (estimate) |
| Revision 2 | ~08:06:45 → 08:06:50 | ~5s (estimate) |
| Approver round 2 (both APPROVE) | 08:06:50 → ~08:10:30 | ~3m40s (estimate) |
| Codex (adversarial-reviewer spawn, incl. a Claude extra pass) | 08:10:30 → end ~08:21:50 | ~11m20s (estimate) |
| Record returned, then driver to the gate | ~08:21:50 → 08:22:12 → plan presented 08:25:17 | ~3m27s (estimate) |

- **Total, "plan ready" → "plan presented to the owner": 07:53:58 → 08:25:17 = 31m19s.** Approvers about
  15m (estimate); Codex about 11m20s (estimate); driver to the gate 3m05s.
- **Rounds:** 3 approver asks (round 0, then 2 revision rounds) and 1 Codex review (plus a Claude extra
  pass, not model-diverse).
- **How long the plan would have taken to reach the owner without plan review: not measured** (no
  baseline).

## 2. Classification

- **Coder's choice:** product change → producer + architect approve.
- **Reason given:** besides tests and tooling, the plan edits shipped `claude/` prompts (the four movers,
  record-decision, wiki-lint, the two stateful-review skills, fkit-review, `structure-spec.md`), "and
  consuming projects receive those prompts."
- **Was it right?** Yes. Both approvers agreed, and the reviewed diff includes those shipped `claude/`
  files (review.md's file list).

## 3. Findings that changed the plan

**Approvers.** No unresolved disagreement.

| # | From | Finding (short) | Changed the plan? |
|---|---|---|---|
| A1 | architect R0-1 + producer R0-5 | Plan hid that between `0529` and `0530` nothing automatic runs prove-red or the release test (ADR-057 §D3's rejected option) | **Yes, substantive** → stated in Summary/Risks/Hand-off, RELEASING.md by-hand line, new owner **Q3** |
| A2 | architect R0-2 | C5's `grep -il fourth` will not come back clean | Yes → check redefined to brief verification 5 |
| A3 | architect R0-3 + producer R0-2 | Old Q3 (who writes ADR notes) is already settled by brief step 9 | Yes → question dropped |
| A4 | producer R0-1 | Keeping M1/M2/M30/M31 breaks ADR-057 §D3, yet the plan said "no disagreement" | **Yes, substantive** → deviation named, put to the owner as **Q1** |
| A5 | producer R0-3 | Q4's knock-on was wrong (0512 / 0513–0515); ~60 open briefs name deleted tests, not 16 | **Yes, substantive** → Q4 rewritten, full brief list in hand-off |
| A6 | producer R0-4 | Dropping `test:unit` / `test:docs` breaks commands in open briefs | Yes → `test:unit` kept as alias, `test:docs` redefined |
| A7 | architect R0 (non-blocking) | Log the `fkit-process-stateful-review` cover; ADR-014:92 says "three tests" | Yes, minor |
| A8 | producer R1-1 (blocking) | The banner timing-test question went missing | Yes → restored as A5 / owner **Q5**. **It undid the coder's own round-1 slip** (dropped while renumbering) |
| A9 | architect R1 + producer R1-2 | Step 3 says "9 briefs" but lists 7 | Yes, minor |
| A10 | producer R1-3 | update-banner comment list incomplete | Yes, minor ("the grep, not the list, is the scope") |
| A11 | architect R1 (non-blocking) | Step 10 should also cover a plain `fkit coder` session | Yes, minor |
| A12 | architect R2 (non-blocking) | Step 5's numbers are not line numbers | **Noise** — they were mutation numbers; no change |

**Codex** `[codex]` X1–X5, plus a **Claude extra pass, NOT model-diverse** (S1–S4). The plan is not
changed after Codex; the owner ruled on the confirmed findings as Q6: "Fold in small fixes
(Recommended)".

| # | Finding (short) | Coder check | Changed the plan? |
|---|---|---|---|
| X1 | Keeps M1/M2/M30/M31 without an owner ruling | partly disputed | **Noise / duplicate** — already Q1 (A4) |
| X2 | Release command still says "includes prove-red.sh" after `npm test` stops running it | confirmed | No — stays `0530`'s (Q6) |
| X3 | Open briefs still tell people to run deleted tests; C5 cannot pass strictly | confirmed | No build change — left to the producer's sweep (Q6) |
| X4 | Worklog ADR→test list written before the architect's notes; never updated | confirmed | **Yes** (Q6) → appended after the architect returned |
| X5 | `uptime` does not prove an idle Mac; no retry rule | confirmed | **Yes** (Q6) → re-run rule used at build (every C2 run got one re-run) |
| S1 | "Only the two named exceptions read the live tree" is false (`dashboard-contract`) | confirmed | **Yes** (Q6) |
| S2 | RELEASING.md / architecture.md / `bin/release.mjs` stale claims and cites | confirmed | **Yes** (Q6), release.mjs comment to `0530` |
| S3 | `structure-check.test.js:52` names a deleted test; step 5's grep misses it | confirmed | **Yes** (Q6) → grep widened to deleted filenames |
| S4 | prove-red's closing echo stays false once 0a is dropped | confirmed | **Yes** (mechanical, in step 4) |

**Net:** 11 approver points changed the plan (A1–A11), 1 noise (A12); one of the 11 (A8) only repaired
damage from the coder's own revision. Codex + extra pass: 6 adopted at build (X4, X5, S1–S4 — four of
them from the non-model-diverse Claude pass), 2 confirmed but deferred (X2, X3), 1 duplicate (X1).

## 4. What the later code review still found

`review.md`: one round, 3 findings, all low, all verified correct and fixed. Coverage: reasoning-only
second opinion.

| # | Finding | Should plan review have caught it? |
|---|---|---|
| R1 | `fkit-wiki-lint` still cites `parseAdrFilename`, defined only in a deleted test; "any of the four" still counts it | **Partly.** Review says the plan's "3 sites" sweep matched the filename, not the function name. S3 found the same class (the sweep grep too narrow) and widened it to filenames only, so function names defined in deleted tests stayed uncovered. |
| R2 | CONTRIBUTING's prove-red "Today" list omits grep hits (`fkit-claude-init.sh`, `structure-spec.md`, `check.sh`) | **No, mostly.** The fix kept the plan-approved table row and rewrote the build's bullet wording to match it. |
| R3 | ADR-057 dated note cuts the owner's quote without an ellipsis | **No.** The note was written at build; plan review could not see it. |

## 5. Extra reading for the owner, and his answer

- **Extra reading at the gate:** three driver banners (Codex's accidental old-suite run; `plan review
  incomplete:` Codex saw a shortened plan; S1–S4 NOT model-diverse), the plan, and **6 questions in two
  dialogs**. **Q1 and Q3 exist because of approver round 0 (A4, A1); Q6 exists because of Codex and the
  extra pass.** Q5 existed before review but was lost and restored during it (A8). So plan review added
  3 of the 6 owner questions, plus the banners. **Word count: not measured.**
- **"Did plan review help?"** not asked (back-filled 2026-10-20).
- Owner decision at the gate: "Approve (Recommended)", and the recommended option on Q1–Q6
  (`AskUserQuestion`, 2026-10-20, `fkit lead` session; verbatim texts in `plan-review.md`).

## 6. Anything that broke or confused

1. **Codex ran the old full `npm test` by accident.** A backtick-quoting slip in an `rg` command ran it
   in Codex's read-only sandbox for 72 s (1089 tests, 543 fail, mostly `EPERM mkdtemp`); Codex then said
   it executed nothing, which was wrong. No repo change (`git status` matched; re-checked 08:22Z).
   Against the driver's instruction to avoid the old suite.
2. **Shortened Codex input.** The adversarial reviewer cut parts of the plan (per-file reasons, Hand-off,
   most of Risks, the Q list) in its Codex prompt; the driver flagged `plan review incomplete:`.
3. **Second opinion partly not model-diverse.** S1–S4 came from a separate Claude extra pass, flagged.
4. **The coder's own revision dropped a question** (the banner question, while renumbering in round 1);
   the producer caught it in round 1 and it came back in round 2.
5. **None of these happened:** a hop limit reached, a refused skill, an escalation after round 2 (no
   disagreement), Codex unavailable (`[codex]` mode, no fallback banner).

## 7. Fresh-launch precondition

Fresh `fkit lead` launch: **unknown.** The records name the run's start time but say nothing about how
the lead session was launched, and what the installed agent copies held at that time cannot be checked now.

## 8. Comparison — honest limits

**There is no controlled baseline.** The same task was not run twice, once without plan review.
No rough comparison is given: the files name no similar past task without plan review.
