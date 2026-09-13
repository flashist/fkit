# Does the backlog converge? Measuring **k**, new tasks discovered per task closed

**Read-only measurement, 2026-09-13.** Written by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)), on the
instruction of the live `fkit lead` session, under an owner ruling given the same day via
`AskUserQuestion` — option label verbatim: **"Yes — spawn a producer to write it (Rec)"**.

**This is the follow-up measurement the six-week retro asked for.** That report —
[`2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md`](2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md)
— set the baseline and said explicitly that a later count *"belongs in a **new** report that cites
this one."* This is that report. ⛔ **Nothing in the retro was edited.** Its figures stand as the
baseline; every figure here was measured fresh at `HEAD` and at the retro's own pinned revision.

**Window measured:** `1f33b95` (2026-08-29 14:48 +03:00) → `3b96c7f` (2026-09-13 20:15 +03:00) —
**15 days**, Sprints 7 and 8.

---

## ⛔ The question changed. This report answers the new one.

The owner was asked which ratio to track going forward. They declined both options and reframed it,
verbatim:

> *"Honestly, I don't know, I just want to be sure backlog doesn't grow infinitely, meaning, that if
> we don't create new completely tasks deliberately, but keep working on the existing tasks,
> eventually we should be able to close ALL tasks."*

**That is a convergence question, not a rate question.** A created-per-closed ratio answers *"is the
queue growing?"* The owner asked *"does the queue have an end?"* — a different question with a
different arithmetic.

**The model.** Define **k = new tasks DISCOVERED per task CLOSED**, counting only work discovered
*by doing the work* and excluding tasks the owner deliberately originates as new feature work.

- **k < 1** → the backlog **converges**. Stop deliberate new input, keep working, and it reaches zero.
- **k ≥ 1** → it **never empties**. Working faster produces more backlog, not less.

And one refinement that decides the answer, drawn here for the first time. Not every discovered task
behaves the same way:

- **Regenerative** — filed *because we changed something*. A review finding on our own fix, a record
  our own edit staled, scope a plan gate deferred, a follow-up a close forced. This kind **replaces
  itself**: doing the follow-up creates the conditions for the next one. Its rate is `k_regen`.
- **Latent** — a defect that already existed and that the work merely **revealed**. This kind comes
  from a **finite pool**: the repo contains finitely many stale claims, and each one found is one
  fewer left. It contributes a finite total, not an ongoing rate.

**Convergence depends on `k_regen`, not on total k.** A backlog with `k_regen < 1` empties, however
large its latent pool, because the pool drains. A backlog with `k_regen ≥ 1` does not, however small
its pool.

---

## The answer

> **Yes — on this evidence the backlog should eventually empty, but the margin is thin and the
> measurement does not settle it.**

**`k_regen` measures below 1 in every cut** — between **0.41 and 0.85** new self-regenerating tasks
per task closed. That is the number convergence turns on, and it is on the right side of the line.

**Total `k` sits at or just under 1** — between **0.52 and 1.13** — because the latent pool is still
actively supplying rows. So the queue is roughly break-even *today* and will only start visibly
draining once that pool runs down.

**Three things keep this from being a confident yes:**

1. **The upper bound on `k_regen` is 0.85.** That is below 1, but not comfortably. A modest worsening
   crosses the line.
2. **The regenerative/latent split is a reading of brief prose.** There is no schema field for it.
   Only **3 of the 30** new rows say "pre-existing" in words; the other three I placed in the latent
   class are my judgement. ⛔ **If all six are really regenerative, `k_regen` equals total k and its
   upper bound crosses 1** — the verdict flips. This single classification carries the whole answer.
3. **15 days and 56 closes is a short sample**, and half of those closes were a one-time event (next
   section).

---

## ⛔ The consolidation caveat — read this before any number below

**Sprint 7 closed 48 tasks against 21 created, a ratio of 0.44. That is not a rate. It is a
one-time event and it must not be read as a changed steady state.**

Sprints A/B/C — tasks `0356`, `0357`, `0358` — executed **the 2026-08-29 retro's own recommendation
#3, "batch the 37 into ~3 sweeps."** They discharged a standing pool of record-repair rows in one
pass. Measured:

- **29 of the 56 closes in this window (52%)** are record-repair rows by the throughput instrument's
  own leading-verb rule.
- **28 of the 56 closes landed on a single day, 2026-09-07.**
- In Sprint 7 alone, **27 of 48 closes (56%)** were record repairs.

**That pool cannot be drained twice.** It stood at 46 rows at the baseline and stands at 21 today.
Any figure whose denominator includes those 29 closes is measuring a backlog being *consolidated*,
not a backlog being *worked*. Every table below states which denominator it used.

---

## k, derived

**Numerator — the 30 tasks created in the window** (IDs `0362`–`0391`, no gaps).

| Class | Count | Rule |
| --- | --- | --- |
| **O** — owner-originated | **1** | `0379` only. Its Context quotes the owner's own verbatim feature request and names **no prior task**. |
| **L** — latent, explicit | **3** | `0368`, `0389`, `0390`. Each brief states in words that the defect is pre-existing and independent of the task that found it. |
| **L?** — latent, judgement | **3** | `0362`, `0385`, `0387`. Pre-existing process or design gaps in my reading; ⚠️ **no explicit text says so**. |
| **W** — work-generated (regenerative) | **23** | Everything else. Each names a prior task's review, worklog, plan gate, or deferred scope as its authority. |

**Denominator — the 56 closes in the window**, split three ways:

| Denominator | Count | What it answers |
| --- | --- | --- |
| **All closes** | **56** | The true rate *for this window*, consolidation included. |
| **Substantive closes only** (all closes minus the 29 record-repair rows) | **27** | The forward rate, once cheap consolidation closes are no longer available. |
| **Sprint 8 only** (2026-09-09 → 2026-09-13) | **8** | The only consolidation-free sprint in the window. |

### The cuts

| Cut | Total k (all non-owner rows) | `k_regen` (W class only) |
| --- | --- | --- |
| **A — all 56 closes** | 29 / 56 = **0.52** | 23 / 56 = **0.41** |
| **B — 27 substantive closes** | 29 / 27 = **1.07** | 23 / 27 = **0.85** |
| **C — Sprint 8, 8 closes** | 9 / 8 = **1.13** | 5 / 8 = **0.63** |

**How to read the three.** Cut A is what actually happened over the 15 days. Cuts B and C estimate
what happens next, when there is no repair pool left to discharge cheaply — and **they agree with
each other**, independently: 1.07 and 1.13 for total k, 0.85 and 0.63 for `k_regen`. Two different
denominators, built from different rules, landing in the same place is the strongest single piece of
evidence in this report.

### The bounds, stated plainly

- **Total `k` ∈ [0.52, 1.13]** — best consolidation-free estimate ≈ **1.1**.
- **`k_regen` ∈ [0.41, 0.85]** — best consolidation-free estimate ≈ **0.7–0.85**.
- ⛔ **These are ranges, not a point estimate, and deliberately so.** The spread comes from two real
  disagreements the evidence does not settle: which denominator represents steady state, and whether
  the six latent rows are truly a finite pool. A confident single k here would be a fabricated
  precision.

### The arithmetic, stated as fact and not as advice

`k_regen ≈ 0.85` at its upper bound means: for every 100 tasks closed, roughly 85 new
self-regenerating tasks appear. A queue of *N* open rows worked to exhaustion at that rate takes
about `N / (1 − 0.85) ≈ 6.7 × N` closes to empty. At 113 open rows that is on the order of **750
closes**, against 278 closed in the project's lifetime to date. At the lower bound of 0.41 the same
queue needs about `1.7 × N` ≈ **190 closes**.

⛔ **That is a property of the arithmetic, not a recommendation.** This report was asked what is
true, not what to do, and it stops here.

---

## Before and after — the baseline against `HEAD`

Both columns measured today, by running the same instrument at both revisions. ⛔ **No figure in this
table is inherited from the retro.**

| Measure | Baseline `1f33b95` (2026-08-29) | `HEAD` `3b96c7f` (2026-09-13) | Change |
| --- | --- | --- | --- |
| Tasks ever created | 361 | **391** | +30 |
| Tasks ever closed (`done` + `cancelled`) | 222 | **278** | +56 |
| Open rows | 139 | **113** | **−26** |
| Record-repair rows open | 46 | **21** | −25 |
| Record-repair share of open work | 33.1% | **18.6%** | **−14.5 pts** |
| Record repair excluding named source-defect exceptions | 43 (30.9%) | 18 (15.9%) | −25 rows |
| Created per closed, in the window | — | **30 / 56 = 0.54** | vs the retro's lifetime **1.99** |

**Reconciliation holds at both revisions.** The instrument refuses to print a report whose
`created − closed` does not equal the open-row count; it printed both. On disk: **113 backlog + 264
done + 14 cancelled = 391**, and IDs `0001`–`0391` have zero gaps.

⚠️ **The 0.54 is cut A**, and cut A's denominator is half consolidation. See the caveat above.

---

## Created against closed, by sprint

⛔ **Sprint 7's 0.44 is the one-time consolidation described above, not a changed rate.** It is
stated here again rather than footnoted, because the number is meaningless without it.

⚠️ **These are date windows, not board membership.** Each sprint's window runs from the day after the
previous sprint's archival banner date to its own. A task filed during Sprint 7's dates but ranked
onto the Backlog board counts in Sprint 7's row. All eight sprint plans are archived under
`../../sprints/done/` and every window boundary comes from the plan's own line-3 banner date.

| Sprint | Window | Created | Closed | Created per closed |
| --- | --- | --- | --- | --- |
| Sprint 1 | … → 2026-07-11 | 27 | 19 | 1.42 |
| Sprint 2 | 2026-07-12 → 2026-08-06 | 214 | 142 | 1.51 |
| Sprint 3 | 2026-08-07 (1 day) | 10 | 8 | 1.25 |
| Sprint 4 | 2026-08-08 → 2026-08-10 | 19 | 2 | **9.50** ⚠️ |
| Sprint 5 | 2026-08-11 → 2026-08-13 | 25 | 19 | 1.32 |
| Sprint 6 | 2026-08-14 → 2026-08-29 | 66 | 32 | **2.06** |
| Sprint 7 | 2026-08-30 → 2026-09-08 | 21 | 48 | **0.44** ⛔ one-time consolidation |
| Sprint 8 | 2026-09-09 → 2026-09-13 | 9 | 8 | **1.13** |
| **Total** | | **391** | **278** | |

⚠️ **Sprint 4's 9.50 is a 3-day artifact**, not a signal — 19 rows filed against 2 closed in a window
too short for anything filed in it to also close in it.

⭐ **Sprint 8 is the informative row.** It is the only sprint in the window with no consolidation
sweep in it, and it ran at **1.13 created per closed** — above 1, and above every ratio in the table
except Sprints 4 and 6. Its nine creations (`0383`–`0391`) contain **zero** owner-originated rows.

---

## The discovered-vs-planned split — all 30 rows

Two rules were applied, and they are reported separately because they give different floors.

**Rule R1 — names a prior task.** Does the brief's text before `## What to build` cite at least one
other four-digit task ID? **29 of 30.** The single exception is `0379`, which is exactly the
owner-originated row. The mechanical rule and the reading agree perfectly on this one point.

**Rule R2 — carries review-residual language.** Does that same text contain any of `review`,
`residual`, `worklog`, `finding`, `follow-up`, `raised in`, `round-N`? **27 of 30** (`0379`, `0384`
and `0389` do not).

**So the floor for "discovered by doing the work" is 27; the looser read is 29; the owner-originated
count is exactly 1.** Every one of the 30 briefs carries the ADR-021 spawned-producer marker.

| ID | Subject, short | Named origin | Class |
| --- | --- | --- | --- |
| `0362` | who runs process-review on an architect-owned task | `0353`, `0224`, `0200` | L? |
| `0363` | sweep-completion step for a class that recurs one file over | `0356` | W |
| `0364` | plural `tasks NN` blind spot `0308`'s pattern could not see | `0356` R11 / `0308` | W |
| `0365` | refuted fence claim carried in `0273`'s open brief | `0356` worklog | W |
| `0366` | `architecture.md` §9.5 residual-drift bullets have drifted | `0356` worklog / `0286` | W |
| `0367` | colliding record ids inside `0356`'s own worklog | `0356` F5 | W |
| `0368` | ownerless source-file coordinate-rot class | `0356` — **"pre-existing at HEAD"** | **L** |
| `0369` | review-ledger `Location` column form | `0176` plan gate G1 | W |
| `0370` | three unpinned fence-opener branches in the citation guard | `0176` review R3 | W |
| `0371` | cost of widening the citation guard's target class | `0176` plan gate G3 | W |
| `0372` | apply `0307`'s ruling to `0172` *(cancelled — absorbed into `0307`)* | `0356` plan gate H2 | W |
| `0373` | addendum for in-code comments citing their own file | `0344` via `0356` worklog | W |
| `0374` | ledger-schema copies in `tasks/README.md` and its scaffold twin | `0369` plan gate J1 | W |
| `0375` | pipe-escaping note for the `Location` / `Claim` guidance | `0369` review K4 | W |
| `0376` | `architecture.md` §9.1 occurrence B, four falsified CI clauses | `0312` left them undone | W |
| `0377` | mandatory priority suffix vs the unranked-destination carve-out | `0361` P4 | W |
| `0378` | telling a concurrent close's transient link-guard RED from your own | `0358` / `0361` | W |
| `0379` | start the LEAD session, not the producer, on cold start | **none — owner's own words** | **O** |
| `0380` | delta-ingest the 45 closed tasks Sweep C bounded out | `0358` Sweep C | W |
| `0381` | mover step for the `NAMED_EXEMPT` keys a move invalidates | `0358`, `0359`, the movers | W |
| `0382` | pin the fresh-tree × explicit-role guard with a regression test | `0379` | W |
| `0383` | shrink the Backlog board being used as a document store | `0358` ledger close-out | W |
| `0384` | teach the record-repair classifier that a net-new record is not a repair | `0359` instrument, `0337` / `0340` | W |
| `0385` | task-keyed path for the Codex adversarial prompt | `0271` / `0337`, concurrent reviews | L? |
| `0386` | `deferred (→ NNNN)` in the stateful-review status vocabulary | `0337`, `0338`, `0341` | W |
| `0387` | structural wall for the orchestrated plan gate | `0162`, `0345` | L? |
| `0388` | durable `prove-red.sh` mutations for the sprint mover | `0341`, precedent `0381` | W |
| `0389` | `dual-home-parity.md` missing row + stale count | `0339` — **"pre-existing and independent"** | **L** |
| `0390` | repo-only `claude/` path form in installed-facing prose | `0339` R5 — **"pre-existing, repo-wide, already shipping"** | **L** |
| `0391` | root `README.md` sprint-selection passage after ADR-047 | `0339` review | W |

**Totals: W 23 · L 3 · L? 3 · O 1 = 30.**

⭐ **The three L rows are the only ones with textual proof.** `0368`, `0389` and `0390` each say in
their own words that the defect pre-dates the task that found it. Everything in L? is inference from
subject matter, and is why `k_regen`'s bound is a range.

⚠️ **Tasks are cited here by ID, not by relative link, deliberately.** Twenty-seven of these thirty
rows are open; each will move folder when it closes, and thirty links into `backlog/` would
manufacture thirty future repair rows of exactly the class this report measures.

---

## The Sprint 7 "record-repair under 10%" criterion — the owner's ruling, recorded

Sprint 7 carried a stated success criterion: **record repair under 10% of open work.**

**Measured: 33.1% at the baseline → 18.6% at `HEAD`** (46 rows of 139 → 21 rows of 113).

⛔ **Both halves of this, and neither cancels the other:**

- **The stated 10% threshold was NOT met.** 18.6% is not under 10%. It is not close to under 10%.
- **The owner ruled, 2026-09-13, live via `AskUserQuestion`: "Treat the trend as the pass."** The
  criterion is recorded as **passed by owner ruling on the trend**, not by the number.

The trend the ruling rests on is real and is the largest single movement in this report: a **14.5
percentage-point fall**, 25 rows removed, in 15 days. ⛔ **It is recorded here as ruled, and this
report does not re-litigate it.**

---

## Method, and every limit on it

**The instrument.** `claude/skills/fkit-status/throughput.mjs`, built by task `0359` for exactly this
purpose — to make the retro's baseline re-runnable rather than re-derivable by hand. It is a pure
function of `(repository, revision) → (stdout, exit code)`: it reads git history and one tree
listing, writes nothing, has no network and no dependency. `--at <rev>` reads that revision's tree,
never the worktree, so the figure is honest with a dirty tree by construction.

**Creation and closure dating.** A task is *created* at the first commit that adds its `brief.md`
anywhere under `ai-agents/tasks/`, and *closed* at the first commit that puts it under `done/` or
`cancelled/`. Renames carry task identity, so the task-folder migration is a shape change and not
278 closes; same-segment renames are excluded (100 of them). `--find-renames` is forced rather than
inherited, because under `diff.renames=false` the same revision silently reports `created 452 closed
312`.

**Per-sprint bucketing** is **not** a mode of the instrument. It was derived for this report by a
throwaway script over the instrument's exported `readHistory` and `briefIdentity`, keeping commit
dates instead of ISO weeks and bucketing by sprint-plan banner dates. ⚠️ **That means the per-sprint
table is the one table here that the two reproduce-it commands below do not reproduce.**

**The classification** in the 30-row table above is a **reading of brief prose**. Rules R1 and R2 are
mechanical and re-runnable; the W / L / L? assignment is not. There is no schema field for a task's
causal origin.

### Limits, in full

1. ⚠️ **"Created" means first *committed*, not first *written*.** This repo commits in batches — 28
   of the 56 window closes landed on one day. A brief written on Tuesday and pushed on Friday is
   dated Friday. Weekly and sprint shapes are directionally sound; individual days are not.
2. ⚠️ **Cancellations are counted as closes.** 14 lifetime, **2** in this window (`0355`, `0372`).
   Excluding them from the close column moves cut A from 30/56 = 0.54 to **30/54 = 0.56**.
3. ⚠️ **Sprint buckets are date windows, not board membership.** A task filed during Sprint 7's dates
   and ranked onto the Backlog board still counts in Sprint 7's row.
4. ⚠️ **The record-repair rule is a leading-verb proxy, permanently.** It classifies on the first word
   of the folder slug. It is cheap, stable and auditable; it is not a category. It is also **known
   wrong on at least two rows** — task `0384` exists precisely because the rule scores `0337` and
   `0340` as repairs when they write a net-new record. Both are inside this window's 29.
5. ⚠️ **15 days, two sprints, 56 closes.** One of those two sprints is a consolidation event and the
   other is 5 days long. This is a short sample and the ranges reflect it.
6. ⚠️ **The convergence model assumes the latent pool is finite and does not refill.** It is finite in
   any snapshot of the repo, but every change adds new surface that can later go stale. This report
   does not measure the pool's refill rate, and cannot from a 15-day window.

### Verification performed

- The instrument reproduces the retro's weeks W31–W34 exactly (37/20, 69/27, 48/30, 17/8).
- ⚠️ **W30 disagrees with the retro: the script reports 52 created, the retro reported 152.** The gap
  is **the retro's** method artifact, not the script's — the retro's `git log` attributed the whole
  task-folder migration to one week. The script excludes 100 same-segment renames as shape changes,
  which is correct.
- IDs `0001`–`0391` have zero gaps; disk reconciles exactly (113 + 264 + 14 = 391); the instrument's
  own `created − closed = open` self-check passed at both revisions.

### Three claims in this measurement's own framing that it contradicts

Stated here rather than quietly corrected, because the framing was written from the previous turn's
working notes and a later reader will otherwise find two numbers.

| Claim as framed | Measured | Effect |
| --- | --- | --- |
| **31** tasks created post-baseline | **30** (`0362`–`0391`; 391 − 361 = 30) | Denominators in the split shift by one. |
| **3** cancellations in the window | **2** (`0355`, `0372`) | The cancellation-excluded ratio is **0.56**, not 0.57. |
| **25 of 31** carry the ADR-021 marker | **30 of 30**, testing for the literal ADR-021 link | The "floor" that framing offered is not a floor; the real discovery floor is R2's **27 of 30**. |

---

## Reproduce it — two commands

```
node claude/skills/fkit-status/throughput.mjs
node claude/skills/fkit-status/throughput.mjs --at 1f33b951e720ab97c14d496e8a4833632e8de43b
```

The first prints `HEAD`; the second prints the retro's pinned baseline. Both emit the per-week
counts, the reconciliation line, and the record-repair share. A third command,
`node claude/skills/fkit-status/throughput.mjs --list`, prints the repair verdict for every open row
so a disputed classification can be checked by hand.

⛔ **Always `node`, never `bash` and never `./`.** The shebang is decorative — the installer
`chmod +x`'es a hardcoded list of two filenames and this file is not on it.

⚠️ **Neither command reproduces the per-sprint table or the k derivation.** Both were built for this
report over the instrument's exported functions and are not part of its output.

---

## What this report does not say

It makes **no recommendation.** The owner asked what is true about convergence, not what to do about
it. Where the arithmetic has an implication it is stated as arithmetic and left there.

It is **not** filed to the wiki. Whether `ai-agents/wiki-vault/` should carry this is `fkit-wiki`'s
call, not a producer's ([ADR-005](../decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
Task `0380` already covers the closed-task delta-ingest that Sweep C bounded out; this report is not
part of that scope.
