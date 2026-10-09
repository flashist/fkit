# Worklog — 0493: make the sprint ship-loop say when a waiting task waits on a later sprint

**Build worker:** spawned `fkit-coder`, caller `fkit-sprint-ship-loop` (Sprint 10), 2026-10-09.
**Approval relayed:** owner, `AskUserQuestion` in the lead session, 2026-10-09 — "Approve (Recommended)";
Q1 "Just tell me, keep going (Recommended)" (2a as drafted, no go/stop question); Q2 "Yes, at its plan
gate (Recommended)" (§3 applies); Q3 "Yes, before the next spawn (Recommended)" (2e applies).
**Plan carried:** `plan.md` blob `b22ed4208e1331e34b841993c02336f850947ec7` (re-hashed at build start: match).

## Snapshot (build step 1)

Pre-edit copies of the 3 target files, with `SHA256SUMS`, in the session scratchpad folder `0493-snap/`
(outside the repo; session-scoped).

| File | Pre-edit sha256 |
|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | `eb4df943…a8944` (479 lines) |
| `claude/skills/fkit-task-ship-loop/SKILL.md` | `3bf30b7e…a4869` |
| `CHANGELOG.md` | `5906293c…da1` |

**Changes since plan time — expected, per the driver:** the sprint-loop file changed (0495's round-3 fix
restored "before it asks" in §3's relay step 1; line count unchanged at 479) and `CHANGELOG.md` changed
(0494 finished editing it). The snapshot is the current state after both. The task-loop file was last
modified the day before the plan was written, so it is unchanged since plan time. No other unexpected
change was seen. The diff for review is `diff -u <snapshot> <current>`, **not `git diff`** (all three
files were already dirty against HEAD from other tasks).

## What changed

- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — plan 2a (new step-1 bullet after the deterministic
  reader), 2b (appended to the Dependency deadlock bullet), 2c (stop-table "Driver does" cell; Trigger
  unchanged), 2d (one sentence on "Opening the run"), 2e (one sentence on step 5). Text as drafted in the
  plan. Eligibility, ordering and the skip memory bullets are byte-unchanged (the only removed lines in the
  snapshot diff are the deadlock table row, the "Opening the run" line it was appended to, and nothing in
  the eligibility/order/skip bullets).
- `claude/skills/fkit-task-ship-loop/SKILL.md` — plan §3: one sentence at step 3 (the plan gate), after
  "Present the plan (+ any open questions) and wait." Re-wrapped the two lines it sits in; no other change.
- `CHANGELOG.md` — plan §4, Q2 = A form, appended as the last bullet of `## Unreleased`.
- `test/sprint-loop-later-sprint-record.test.js` — new, plan §5 asserts 1–5 plus a control arm (the
  throwing extractor fails on a missing anchor).

## Prove-red (plan §5)

New test run in a scratch tree holding the test, `test/harness.mjs`, the current `fkit-status/SKILL.md`
and the two **snapshot** loop files:

```
✖ 0493: the sprint loop step 1 names the record at the run start AND the deadlock stop
✖ 0493: the stop table's Dependency deadlock row names the record
✖ 0493: step 1 words every `reason`, and never calls `sprint-unresolved` "later"
✔ 0493: fkit-status still lists the record kind the loops read
✖ 0493: the task loop names the record at its plan gate (step 3)
✔ 0493/control: a missing anchor throws, never yields an empty section
ℹ tests 6  pass 2  fail 4
```

Asserts 1, 2, 3, 5 red as required. Assert 4 green on the old text **by design** (it pins the other side
of a rename). Control arm green by design.

## Quick checks (plan §8)

`node --test test/plan-review-switch.test.js test/spawned-write-marker.test.js
test/sprint-loop-later-sprint-record.test.js test/reference-integrity.test.js
test/task-id-uniqueness.test.js` → **93 pass, 0 fail** (reference-integrity: 1129 files, 4695 targets,
0 broken).

## Dry read (plan §6; the brief's verification 2)

Fixture: built by a script in the session scratchpad, outside the repo — `sprint-1.md` (🔄) and
`sprint-2.md` (🔲); 0001 → 0002 (Sprint 2); 0003 and 0004 → 0001; 0005 → 0006 (Backlog);
0007 → 0008 (`## Sprint` = `Sprint 9`, no board); 0009 has no dependency. Two variants: 0009 open
(start of run) and 0009 `✅ Done` (dependency deadlock). Both rendered with the current
`dashboard.sh`, exit 0.

**`⟦FACTS⟧` records, verbatim (identical in both variants):**

```
drift depends-on-later-sprint 0001 blocker="0002" blocker_sprint="Sprint 2" reason="not-started"
drift depends-on-later-sprint 0005 blocker="0006" blocker_sprint="Backlog" reason="backlog-board"
drift depends-on-later-sprint 0007 blocker="0008" blocker_sprint="Sprint 9" reason="sprint-unresolved"
drift depends-on-later-sprint 0003 blocker="0002" blocker_sprint="Sprint 2" reason="not-started" via="0001"
drift depends-on-later-sprint 0004 blocker="0002" blocker_sprint="Sprint 2" reason="not-started" via="0001"
```

**Start-of-run wording** (variant 1, following the new step-1 bullet, said before the first spawn):

> Some rows on Sprint 1 wait on tasks this sprint cannot count on:
> - **0002** — on Sprint 2, not started yet. 3 of this sprint's open rows wait on it: 0001, and 0003 and
>   0004 through 0001.
> - **0006** — on the Backlog board. 1 open row waits on it: 0005.
> - **0008** — on `Sprint 9`, a sprint the board cannot place. 1 open row waits on it: 0007.
>
> This sprint cannot finish those 5 rows as planned. This is your decision — I move no task and re-point
> no link. Those rows are not eligible, so the run drives the rest of the eligible set: 0009.

**Dependency-deadlock wording** (variant 2: 0009 done, nothing eligible, backlog remains):

> Stopped — dependency deadlock. Blocking chain: 0003, 0004 → 0001 → 0002; 0005 → 0006; 0007 → 0008.
> - 0002 is on Sprint 2, not started yet — 3 of this sprint's open rows wait on it.
> - 0006 is on the Backlog board — 1 open row waits on it.
> - 0008 is on `Sprint 9`, a sprint the board cannot place — 1 open row waits on it.

Neither wording calls `Sprint 9` "later". Per-blocker counts are taken by counting records with that
`blocker=` (the 3 for 0002 includes the two `via="0001"` records).

**Live board:** `sprint-10.md` rendered → **0** `depends-on-later-sprint` records (no `drift` lines at
all), so the opening report adds nothing on a clean board.

## Checks not run here

- **Full `npm test`:** run once by this Build worker in a scratch copy of the repo (including `.git`)
  **after** this worklog was written — the driver's rule is that nothing in the real tree is edited once
  that run starts. Its result (counts, duration, load, and the `cmp` proof of the copy against the real
  tree) is in the Build worker's return to the driver, not here.
- No new `prove-red.sh` mutation (plan §8: not asked for; prove-red done by hand above).
- `CHANGELOG.md` is covered by no check; read by eye.
- `claude/fkit-claude-init.sh .` not run — the driver refreshes `.claude/`.

## Observed, not fixed

- 0492 added no CHANGELOG line for the `drift depends-on-later-sprint` record itself (plan §4) — out of
  this task's scope; flagged for the driver.

## Decision log

none — no fix applied without asking and no obvious-winner call. The text is the plan's drafts as
approved (Q1 = A, Q2 = A, Q3 = A). Formatting only: the task-loop sentence and the "Opening the run"
sentence were wrapped to the file's line width.

## Build full-suite result (recorded at review round 1)

The Build worker's one full `npm test`, run in a scratch copy of the whole repo including `.git`
(copy taken 11:54, 2026-10-09): **exit 0**. node --test **1094 tests, 1094 pass, 0 fail** (0 cancelled,
0 skipped); `prove-red.sh` "hard gate PASSED", **43/43 mutations red** (including mutation 9, the
de-indented skill-description line). Wall time **1724 s** (~28.7 min). Load averages 2.27 / 3.48 / 5.03
at start, 4.87 / 5.38 / 5.01 at end. Afterwards `cmp` of the copy against the real tree: identical for
both loop files, `CHANGELOG.md`, the new test, and `claude/agents/fkit-lead.md`.

## Review round 1 — Process-review (spawned `fkit-coder`, caller `fkit-sprint-ship-loop`, 2026-10-09)

Standing approval: the owner's plan approval relayed above (same plan blob, carried pasted + pointer
on the re-send; the first, pointer-only spawn was refused for marker field (b) and wrote nothing).
Pre-fix snapshot: session scratchpad folder `0493-r1snap/` with `SHA256SUMS` (both loop files, the
test, `CHANGELOG.md`, this worklog, `review.md`); re-checked at the re-send: unchanged.
`CHANGELOG.md` had changed since Build (0494's R7 line, expected per the driver).

**Prove-red of the new asserts** (scratch trees, the new test file):
- Against the pre-fix loop text: 3 red — step 1 (no `via` instruction), the `sprint-unresolved` case
  (no empty-value wording), task-loop step 3 (no `via` row, no "did not run"). The new step-5 /
  "Opening the run" case is green there **by design**: it pins sentences that already existed (R2 was a
  coverage gap, not missing text).
- Mutations on the fixed text: step-5 sentence deleted → that case red; "Opening the run" sentence
  deleted → red; "later" put into the `sprint-unresolved` wording → the `reason` case red.
- The **old** test on the pre-fix text with the same "later" mutation: all green — the blindness R2
  named, measured.

**Quick checks:** `plan-review-switch`, `spawned-write-marker`, the 0493 test, `reference-integrity`,
`task-id-uniqueness`, `coordination-citation-policy` → 117 pass, 0 fail. Full `npm test`: run after
this entry was written; its result is in the worker's return (no real-tree edit once it starts).

### Decision log — round 1

Every entry below was applied without asking the owner, under the standing approval. Each qualified as
**verified `CORRECT` + mechanical/localized + inside the approved plan** (wording of the plan's own
2a / §3 / §4 text, or its §5 pin test). No obvious-winner call was made.

- **R1** (indirect wait loses its `via` row) — sprint-loop step-1 bullet now tells the driver to name
  the row a `via=` record waits through, with an example; task-loop step 3 presents it too. Qualified:
  verified (neither text named the `via` row); a sentence added to 2a / §3; the plan's §1 already
  counts `via=` records, so naming them is inside its intent.
- **R2** (test misses the mid-run and opening sentences; "never later" assert was blind) — new test case
  for both sentences; the `sprint-unresolved` assert rewritten to check every quoted wording for
  "later"; a control arm added. Qualified: verified by mutation (old assert green with "later"
  inserted); test-only, inside §5.
- **R3** (CHANGELOG and bullet heading say only "later sprint") — heading widened to "a task this
  sprint cannot count on" plus one sentence listing the five cases; CHANGELOG line names the five cases
  and all three points it fires. Qualified: verified against `fkit-status/SKILL.md` (`not-started` =
  the sprint is still `🔲 Backlog`, whatever its number); wording of 2a / §4.
- **R4** (task loop: how to find the board; failed render looks like "no record") — step 3 now names
  the sprint plan that holds the task's row, and says a missing board, failed render or
  `drift unresolved-plan-sprint` means the check did not run, never "no record"; Backlog-board tasks
  have nothing to check. Qualified: verified (the old text named no board and no failure case);
  wording of §3, which already said the record never fires on the Backlog board.
- **R5** (empty `blocker_sprint` reads "on ``") — added the empty-value wording "with no sprint set".
  Qualified: verified (`dashboard.sh` emits `blocker_sprint=""` for a blocker with no brief, pinned by
  0492's contract test); one clause in the 2a wording table.

Ledger: five *Coder response* rows written, all `✅ done`. Header `Status:` left `in-review` — the
fixes are unreviewed, and the method's close-out list (closeout / disproven / accepted) does not
include a just-applied fix; round 2 is the reviewer's.

### Round-1 full-suite result (appended after the run and its `cmp`)

One full `npm test` in a fresh scratch copy including `.git` (copy 12:36, 2026-10-09; 1870 s; load
2.39 / 2.80 / 3.69 at start, 3.70 / 4.53 / 4.68 at end). **Exit 1 — RED.**
- node --test phase: **1096 tests, 1096 pass, 0 fail** (the 2 new 0493 cases included).
- `prove-red.sh`: **"hard gate FAILED — Failed step(s): 0a"**. All 43 mutations red as required;
  steps 0b–0m (unmutated copies) green.
- **Step 0a failed on one test outside this task:** `test/board-root.test.js` "R3: a bad --root exits 2,
  …" — case `--root <dir with only ai-agents/tasks>` returned exit `null` with empty stderr: the CLI
  call hit the test's 20 s `spawnSync` timeout (the case took 47 s). That test drives the board CLI
  (`bin/`), which 0493 does not touch (0493 changed two skill `.md` files, `CHANGELOG.md` and its own
  text-pin test). The same test passed in the node --test phase of the same run (51.8 s) and in the
  round-0 run, and a targeted re-run on the same scratch copy afterwards passed (9/9, R3 in 9.6 s).
  Attributed to load-related timeout flakiness, **not** to this change — but the full gate was red on
  this run, and the suite was **not** re-run in full.
- `cmp` of the copy against the real tree afterwards: identical for both loop files, `CHANGELOG.md`,
  the 0493 test, `claude/agents/fkit-lead.md`, `review.md` and this worklog (before this entry).

## Review round 2 — Process-review (spawned `fkit-coder`, caller `fkit-sprint-ship-loop`, 2026-10-09)

Standing approval: the same relayed plan approval (plan blob `b22ed420…`, pasted + pointer). Pre-fix
snapshot: session scratchpad folder `0493-r2snap/` with `SHA256SUMS` (task loop, the 0493 test, this
worklog, `review.md`); the task loop and test were unchanged since the round-1 full run's copy.

### Decision log — round 2

- **R6** (task-loop step 3 said "and wait" before the board check, so read in order the owner could
  approve before seeing the record) — reordered step 3: "First render the sprint plan …", then the
  record and did-not-run sentences, then "Then present the plan (+ any open questions) and wait."
  Qualified without asking: verified `CORRECT` (the order was as the finding says); a mechanical
  reorder of the plan's own §3 sentence, inside its intent ("present it with the plan" at the gate).
  No obvious-winner call. No test pin anchored on the moved words, so the 0493 test is unchanged.

**Checks (targeted, as instructed):** the 0493 test, `plan-review-switch`, `spawned-write-marker`,
`coordination-citation-policy`, `reference-integrity` → 75 pass, 0 fail. **No full `npm test` this
round** — the driver runs one joint clean re-verify for 0493 and 0494 afterwards.

Ledger: R6 row written `✅ done`; header `Status:` left `in-review` (fix not yet seen by the reviewer).

## Review round 3 — Process-review (spawned `fkit-coder`, caller `fkit-sprint-ship-loop`, 2026-10-09)

Standing approval: the same relayed plan approval (plan blob `b22ed420…`, pasted + pointer). Pre-fix
snapshot: session scratchpad folder `0493-r3snap/` with `SHA256SUMS` (task loop, the 0493 test, this
worklog, `review.md`); the test was unchanged since round 2's snapshot.

### Decision log — round 3

- **R7** (the R6 order had no test pin; the step-3 case checked only that phrases were present) — added
  one order check to the task-loop step-3 case: `dashboard.sh <plan>` and "say the check did not run"
  must both come before "and wait". Qualified without asking: verified `CORRECT` (the old case stayed
  green on the pre-R6 order); test-only, inside the plan's §5 pin test. No obvious-winner call.
  Prove-red: on the round-2 snapshot's (pre-R6) task loop the step-3 case reds ("`dashboard.sh <plan>`
  must come before `and wait`"); on the current text it is green.

**Checks (targeted, as instructed):** the 0493 test, `plan-review-switch`, `spawned-write-marker`,
`coordination-citation-policy`, `reference-integrity` → 75 pass, 0 fail. **No full `npm test` this
round** — the driver runs one joint clean re-verify for 0493 and 0494 next. Round 1's full gate is
still red on record (step 0a, the `board-root` R3 timeout, attributed to load) until that re-verify.

Ledger: R7 row written `✅ done`; header `Status:` set to **`closed-out`**. Basis: the round-3
reviewer's convergence call, relayed by the driver — close out after this round, no round 4 needed —
and every finding R1–R7 is `✅ done` with nothing blocking.
