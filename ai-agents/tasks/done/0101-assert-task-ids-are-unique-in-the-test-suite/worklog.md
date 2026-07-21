# Worklog — Assert task IDs are unique in the test suite

**Task:** `ai-agents/tasks/backlog/assert-task-ids-are-unique-in-the-test-suite.md`
**Task ID:** 0101 · **Sprint 2**, priority 85 (append rank — runs BEFORE task 76)
**Plan:** `ai-agents/plans/assert-task-ids-are-unique-in-the-test-suite.md` (owner-approved 2026-07-20)
**Review ledger:** `ai-agents/reviews/assert-task-ids-are-unique-in-the-test-suite.md`

---

## Owner-decision log

The autonomy audit trail — every question put to the owner, and every "obvious winner" taken while
the owner was away.

| # | Kind | Decision |
|---|---|---|
| 1 | **Owner question — plan gate** | Plan for task 85 **approved**. The owner additionally blanket-approved the plans for tasks **81** and **79**, and ruled that tasks **76** and **77** still get a real plan gate (76 is "the point of no return"; 77 rides on it). |
| 2 | **Owner question — scope widening** | The brief invited a flag on whether a *fourth* test-scope category needs an ADR amendment. Owner ruled: **header note, not an ADR amendment** — ADR-029 Decision 3 already names this test, so no new decision is being made. Recorded in the file header per the `test/dashboard-contract.test.js:3-7` precedent. |
| 3 | **Obvious winner** | Named the extracted helpers `discoverBriefs` / `findDuplicates` / `readId` and kept them module-local rather than exporting them from `harness.mjs`. No other test needs them; exporting would widen the harness's public surface for one consumer. Within plan intent ("extract the check as a small function"). |
| 4 | **Obvious winner** | `findDuplicates` **skips** records whose ID is `null` rather than grouping them under a shared "missing" key. Grouping nulls would report every ID-less brief as a mutual duplicate — a misleading failure. Absent IDs get their own dedicated assertion instead. |
| 5 | **Obvious winner** | Added two tests beyond the plan's enumerated list: *two collisions are both reported*, and *a folder without `brief.md` is not a brief*. Both are cheap, sit strictly inside the approved design, and close obvious holes. No scope change. |
| 6 | **Obvious winner** | Discovery returns paths **relative to `tasksRoot`**, not absolute. Failure messages stay stable across machines and CI checkouts. |
| 7 | **Obvious winner — departed from the reviewer's remedy** | For review finding **R3** (a fenced `## ID` example shadowing the real field) the reviewer proposed *"fail on more than one `## ID`"*. I implemented **fence-stripping** instead: it fixes the defect by construction, and does not punish a brief for legitimately documenting the ID format. Recorded loudly because overriding a reviewer's stated remedy is exactly the kind of choice that should not be invisible. |
| 8 | **Owner question — R6 disposition** | Stray `*.md` in a board directory treated as a brief. Owner ruled: **accept as a residual**, no code change; the improved failure message stands. The two hardening options were declined — a name list goes stale, and a "require `## ID` + `## Status`" shape check would turn a malformed real brief from a loud failure into a **silent skip**, the exact failure mode this task exists to prevent. |
| 9 | **Owner question — task 81 Part D** (asked early, while this task was in review) | The installer's `Seven roles` line sits above a seven-item list; ADR-028's eighth role is decided-not-built. Owner ruled: **drop the count from the line entirely**. Accurate now and after the eighth role ships, and it dissolves the 81/82 cross-task inconsistency risk the brief flags. |

---

## What was built

One new file: **`test/task-id-uniqueness.test.js`**. No product code, no skill edits, no brief edits
(beyond this task's own `## Status` bookkeeping).

Three module-local pure functions plus one live-corpus assertion:

- **`readId(text)`** — extracts the `## ID` field; returns `null` when absent, so "no ID" is
  distinguishable from "some ID" rather than silently skipped.
- **`discoverBriefs(tasksRoot)`** — walks `backlog/`, `done/`, `cancelled/`, matching **both** corpus
  shapes: today's `<board>/<slug>.md` **and** post-76's `<board>/<NNNN>-<slug>/brief.md`. A directory
  without a `brief.md` is not a brief. A board that does not exist contributes nothing rather than
  throwing.
- **`findDuplicates(records)`** — groups by ID, keeps only IDs carried by more than one brief, and
  returns **the source paths**, not a count.

The failure message names each duplicated ID and every brief path carrying it, because the remedy
("renumber the newcomer before anything links to it", ADR-029) is impossible without knowing which
brief collided.

**Test-scope widening** is recorded in the file header as a *fourth* category — an invariant over the
repo's own `ai-agents/` content, alongside ADR-014 §2's two and ADR-017 rule 4's third — following
the `test/dashboard-contract.test.js:3-7` precedent, and citing ADR-029 Decision 3 as the
pre-authorization.

---

## Problems encountered

**A false red during verification, caught and corrected.** The first mutation run copied the test to
`os.tmpdir()` and reported `fail 1 / pass 0`. That was not the guard going red — the mutant could not
resolve its relative `./harness.mjs` import, so the whole file failed to *load*. This is exactly the
red-via-setup-failure that `test/prove-red.sh` step 0b exists to rule out, and taking it as a
successful red proof would have been a fabricated verification.

Corrected by mutating in-place under `test/` (so imports resolve) and adding an **unmutated control**
run first. The control passed 12/12 before any mutation was applied, which is what makes the
subsequent reds meaningful.

---

## Verification evidence

All from the run **after** the final code change (round 4's R18/R19 fixes).

**`npm test`** — `node --test test/*.test.js && bash test/prove-red.sh`:
```
ℹ tests 432   ℹ pass 432   ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```
(Suite grew 402 → 432 across the review; this file contributes 42 tests, control-verified.)

### Every fix red-proved by a NAMED mutation, against a green control

| Mutation | Named tests that go red |
|---|---|
| `findDuplicates` filter neutered | 4 (two-way, three-way, two-collisions, cross-layout) |
| post-76 folder branch disabled | 2 — the task-76-survival tests |
| live corpus → nonexistent dir | 1 — the non-vacuity assertion |
| naive fence toggle restored | 4 — 3× R7, 1× R9 |
| cycle guard removed | 2 — R8 |
| closing-fence info-string rule removed | 2 — R11-E1, R11-E2 |
| discovery realpath dedup removed | 2 — R12/R13 |
| complement rule → first-match | 4 — R14 |
| containment boundary removed | 1 — R16 |
| `stripFences` → identity | 1 — R17 *(did **not** red before the rewrite — that was the finding)* |
| bare `catch` restored in `kindOf` | 1 — R15 *(had **no** test until I noticed the mutation passed 39/39)* |
| file dedup removed | 1 — R18 |
| discovery boundary removed | 1 — R19 |
| `statSync` → `lstatSync` | 19 of 42, incl. the **rewritten** R5 test — the regression-burial check |

**The regression-burial check matters most.** I rewrote my own tests twice during this review (R12,
R19) — the standard way a regression gets buried. Reverting the original `statSync` fix still reds the
rewritten R5 test, so the silent-skip regression is genuinely still caught. The reviewer re-ran this
independently rather than taking my word for it.

**Live corpus, derived independently of the test** (the brief's own command plus a separate script):
```
duplicates: (none)
count: 101 IDs · 101 briefs · 101 unique · contiguous 0001 -> 0101
```
Both counts are **derived at runtime, never hardcoded** — per the brief, every count written into a
brief in this project so far has gone stale before the task ran.

**Red proof by mutation, with a green control:**

| Run | Mutation | Result |
|---|---|---|
| control (0b) | none | **12 pass / 0 fail** — rules out red-via-setup-failure |
| 1 | `findDuplicates` filter neutered to `() => false` | **4 named tests RED** (both/three-way/two-collisions/cross-layout) |
| 2 | post-76 folder branch disabled | **2 named tests RED** — the task-76-survival tests |
| 3 | live corpus pointed at a nonexistent directory | **1 named test RED** — the non-zero (vacuity) assertion |

The fixture duplicate **is** the red proof, as the brief anticipated. **No `prove-red.sh` change** —
that script mutates product code via `FKIT_LAUNCHER` / `FKIT_SKILL_OWNERSHIP_HOOK`, and this
invariant has no product-code seam to mutate.

---

## The brief's `## Verification steps`, walked

| # | Criterion | Result |
|---|---|---|
| 1 | `npm test` passes — `node --test` green, `prove-red.sh` green | ✅ 402/402, hard gate passed |
| 2 | The guard is red-proved (fixture duplicate reports the duplicate) | ✅ mutation 1, with green control |
| 3 | The live corpus passes today; counts **derived**, not hardcoded | ✅ 101/101/101, `0001`–`0101` |
| 4 | The scan is not vacuous — empty discovery goes **red**, not green | ✅ mutation 3 |
| 5 | Both layouts discover the same corpus (post-76 fixture tree) | ✅ dedicated test + mutation 2 |
| 6 | No repo writes — `git status` clean after the run | ✅ only the intended edits appear |

---

## Files touched / change surface

| File | Change |
|---|---|
| `test/task-id-uniqueness.test.js` | **new** — the entire substantive change |
| `ai-agents/tasks/backlog/assert-task-ids-are-unique-in-the-test-suite.md` | `## Status` → In progress → Done |
| `ai-agents/sprints/sprint-2.md` | task-85 row status |
| `ai-agents/plans/assert-task-ids-are-unique-in-the-test-suite.md` | **new** — approved plan (ship-loop artifact) |
| `ai-agents/worklogs/assert-task-ids-are-unique-in-the-test-suite.md` | **new** — this file |
| `ai-agents/reviews/assert-task-ids-are-unique-in-the-test-suite.md` | **new** — review ledger |

---

## Review ledger

**Path:** `ai-agents/reviews/assert-task-ids-are-unique-in-the-test-suite.md` — **`Status: closed-out`**

**Verdict line:** ✅ Closed out — **19 findings raised across 5 rounds, all resolved. No open confirmed
defects. Ready to merge.**

**Codex coverage: FULL, not partial.** Codex ran in round 1 and was **re-run in round 3 over round-2
code it had never seen** (`codex exec --sandbox read-only`). Round 2 was single-reviewer and the
reviewer flagged that itself rather than passing it off as complete — which is why I asked for the
round-3 re-run. **One recorded limit:** Codex's sandbox blocked `mkdtempSync`, so all its filesystem
findings were static analysis; the reviewer re-verified each by execution, which is how R15 was caught
as *partially incorrect* and R16 found to be *worse than reported*.

### Findings by round — the shape that matters

| Round | Findings | High | **Silent-wrong** |
|---|---|---|---|
| 1 | 6 | 0 | 1 (R3) |
| 2 | 4 | 1 | 1 (R7) |
| 3 | 7 | 2 | 2 (R11, R14) |
| 4 | 2 | 0 | **0** |
| 5 | **0** | 0 | **0** |

**6 → 4 → 7 → 2 → 0 is not, by itself, convergence.** The *class* converging is: by round 4 every
finding failed **loud** — a false red with a confusing message, never a missed duplicate. For a guard
whose entire purpose is refusing to go silently green, that is the plateau that counts.

**All 19 resolved:** R1–R5, R7–R19 fixed; **R6** accepted as an owner-ruled residual.

### The finding that justified the whole review

**R14 (high)** — `readId()` returned only the *first* `## ID` and discarded the rest, so a brief
carrying two IDs **silently hid a real collision**. It has nothing to do with fences. It survived three
rounds because every round — reviewer's, Codex's and mine — was looking at fences. **Found by Codex on
a re-run I requested, over code it had never seen.** That is the case for model diversity in a single
finding.

### The design decision that ended the recurrence

Three consecutive rounds produced a fence-parser defect (**R3 → R7 → R11**). The fix that stopped it was
not a fourth parser attempt but the **complement rule**: strip fences, *then* fail on more than one
remaining `## ID`. It converts every future parser leak from **silent-wrong into loud-failure** — a
leaked example becomes a second visible field, which throws. **The parser is no longer required to be
correct in order to be safe.** Confirmed by the reviewer against a case that *still* mis-parses
(backtick inside a backtick info string) and now fails loudly instead of returning a wrong ID.

### What this review claims — and what it does not

It does **not** claim no silent-wrong remains. Five rounds and two model-diverse reviewers cannot prove
that negative, and both the reviewer and I recorded that rather than letting the close-out imply
otherwise. It claims something narrower and checkable: **the mechanism behind every prior silent-wrong
is structurally closed.** Residual risk now lives in walk-consistency, where failure is a loud false red
rather than a missed duplicate.

**Re-open condition:** ADR-029's own trigger — **a duplicate ID actually occurring in practice**, which
the ADR names as the one thing justifying revisiting prevention over detection.

---

## Lessons learned

- **A red that comes from a module failing to load is not a red.** `prove-red.sh`'s step-0b control
  is not ceremony; reproducing it by hand immediately caught a false positive that would otherwise
  have been written up as a successful red proof.
- **A discovery-based invariant needs a non-vacuity assertion or it is decorative.** The dangerous
  state for this guard is not "wrong", it is "green over nothing" — and that state arrives silently,
  on the day an unrelated migration lands.
- **When the same defect recurs three times, stop fixing it and change its failure mode.** R3 → R7 →
  R11 were three attempts at correct fence parsing, each shipped confidently, each wrong. The complement
  rule ended it not by being a better parser but by making *any* parser leak fail loudly. **After a
  third iteration, a design where the next bug is loud beats a fourth attempt at correctness.**
- **My tests were a worse problem than my code.** R17 was a tautological test (passed with the function
  replaced by identity). My first R15 fix had **no test at all** — the mutation passed 39/39 before I
  checked. And once I asserted my *prediction* of behavior rather than the behavior, and had to correct
  the test rather than the code. None of these show up in a passing suite.
- **Rewriting a test to match new behavior is how a regression gets buried** — and I did it twice. Both
  times the honest move was to flag it to the reviewer and prove the original regression is still
  caught, rather than let a green suite speak for itself.
- **Silence from a probe is not a pass.** Two verification commands used `timeout`, which does not
  exist on macOS; they exited 127 with no output and I initially read that as success.
- **The model-diverse second opinion earned itself here.** R14 — the single most serious finding, the
  guard's core purpose failing silently — came from Codex on a re-run over code it had never seen,
  after three rounds in which both the reviewer and I were fixated on fences.

---

## Residuals / deferrals

- **R6 — "any `*.md` in a board directory is treated as a brief."** Owner-ruled **accepted**, no code
  change; failure message improved to name the alternative cause. Both hardening routes declined —
  notably the "require `## ID` **and** `## Status`" shape check, because it would convert a *malformed
  real brief* from a loud failure into a **silent skip**, the exact class this guard exists to prevent.
- **R19's boundary is now a stated rule, not an accident:** the corpus ends at the task tree. A brief
  reachable only through an off-tree symlink is outside it — git stores the link, not the target, so
  that brief's ID was never allocated in this repo and cannot collide in it.

- **Four-digit ID overflow (`9999`)** stays an accepted residual (design spec §3.1) — deliberately
  not guarded here.
- **The two sibling assertions** — `id-mismatch` drift (spec §3.5) and malformed-folder-without-
  `brief.md` (spec §4) — remain with **task 76**, which creates the structure they assert against.
  Confirmed still carried in 76's brief; not silently dropped.
- **The cross-branch allocation race itself** remains *accepted and detected, not prevented*
  (ADR-029 Decision 3). This task builds the detection; it does not reopen the decision.

## Recommended follow-up tasks

*Named only — the loop does not file briefs (producer's job) and does not write the wiki
(fkit-wiki's job).*

- **None required by this change.** The guard is self-contained and task 76 already carries the two
  sibling assertions.
- *Possible, low value:* when task 76 lands, the pre-76 flat-layout branch of `discoverBriefs()`
  becomes dead weight. Worth removing only once the migration is settled and irreversible — keeping
  it costs nothing and removing it early re-opens the vacuity risk.

---

## Commit state

**Nothing committed. Nothing pushed.** All edits are left in the working tree for the owner.
