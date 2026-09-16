# Backlog convergence and the `k` measurement — does the queue have an end?

**Layer**: shared
**Key files**: `ai-agents/knowledge-base/reports/2026-09-13-does-the-backlog-converge-measuring-k.md`, `claude/skills/fkit-status/throughput.mjs`, `ai-agents/knowledge-base/reports/2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md`

## Summary

⭐ **The owner asked a convergence question, not a rate question, and that reframing is the whole
report.** A created-per-closed ratio answers *"is the queue growing?"* The owner asked, verbatim:

> *"I just want to be sure backlog doesn't grow infinitely, meaning, that if we don't create new
> completely tasks deliberately, but keep working on the existing tasks, eventually we should be able
> to close ALL tasks."*

⛔ **That is a different question with a different arithmetic**, and the report says so before
answering it.

**The answer, as given:** *"Yes — on this evidence the backlog should eventually empty, but the margin
is thin and the measurement does not settle it."*

### ⚠️ Why this page exists at all — the source routed the decision here by name

⭐ **The report's own closing section declines to file itself:** *"It is **not** filed to the wiki.
Whether `ai-agents/wiki-vault/` should carry this is `fkit-wiki`'s call, not a producer's
([ADR-005](...))."* ⭐ **That is a producer correctly refusing to write the vault** — the same shape as
`0393`'s `E6` and `0356`'s report-don't-repair fence. **This page is that call, taken 2026-09-16 by the
`b4a1a52`→`a351cb6` sync.**

⛔ **It is deliberately NOT part of task `0380`'s scope**, and the report says so: `0380` covers the
closed-task delta-ingest Sweep C bounded out. **This is a separate ingest and does not discharge
`0380`.**

## Architecture

### The model — and the refinement that decides the answer

**`k` = new tasks DISCOVERED per task CLOSED**, counting only work discovered *by doing the work* and
excluding tasks the owner deliberately originates as new feature work.

- **k < 1** → the backlog **converges.** Stop deliberate new input, keep working, it reaches zero.
- **k ≥ 1** → it **never empties.** Working faster produces more backlog, not less.

⭐ **The refinement, drawn in this report for the first time**, is what carries the verdict — not every
discovered task behaves the same way:

| Kind | What it is | Behaviour |
|---|---|---|
| **Regenerative** (`k_regen`) | filed *because we changed something* — a review finding on our own fix, a record our own edit staled, scope a plan gate deferred | ⛔ **Replaces itself.** Doing the follow-up creates the conditions for the next one |
| **Latent** | a defect that already existed and that the work merely **revealed** | ⭐ **Finite pool.** The repo holds finitely many stale claims; each one found is one fewer left |

⭐ **Convergence depends on `k_regen`, not on total `k`.** A backlog with `k_regen < 1` empties however
large its latent pool, because the pool drains. One with `k_regen ≥ 1` does not, however small its pool.

### The measured cuts — 2026-09-13, window `1f33b95`→`3b96c7f` (15 days, Sprints 7 and 8)

| Cut | Total k | `k_regen` |
|---|---|---|
| **A — all 56 closes** | 29/56 = **0.52** | 23/56 = **0.41** |
| **B — 27 substantive closes** (all closes minus the 29 record-repair rows) | 29/27 = **1.07** | 23/27 = **0.85** |
| **C — Sprint 8 only, 8 closes** (the only consolidation-free sprint) | 9/8 = **1.13** | 5/8 = **0.63** |

- **Total `k` ∈ [0.52, 1.13]** — best consolidation-free estimate ≈ **1.1**
- **`k_regen` ∈ [0.41, 0.85]** — best consolidation-free estimate ≈ **0.7–0.85**

⭐ **Cuts B and C agree with each other independently** — two different denominators, built from
different rules, landing in the same place. ⛔ **The report names that as its strongest single piece of
evidence.**

⛔ **These are ranges, not a point estimate, and deliberately so** — *"A confident single k here would
be a fabricated precision."*

### The 30-row classification

Numerator = the 30 tasks created in the window, IDs `0362`–`0391`, no gaps:

**W (work-generated / regenerative) 23 · L (latent, explicit) 3 · L? (latent, judgement) 3 · O
(owner-originated) 1 = 30.**

⭐ **Only ONE row in 30 is owner-originated** — `0379`, whose Context quotes the owner's own words and
names no prior task. ⭐ **Two mechanical rules and the human reading agree on exactly that point:**
rule R1 (*does the brief cite another four-digit task ID before `## What to build`?*) is **29 of 30**,
and the single exception is `0379`.

⭐ **The three `L` rows are the only ones with textual proof** — `0368`, `0389` and `0390` each say in
their own words that the defect pre-dates the task that found it.

## Gotchas / Known Issues

### ⛔ The consolidation caveat — it invalidates the headline number if ignored

**Sprint 7 closed 48 against 21 created, a ratio of 0.44. ⛔ That is NOT a rate. It is a one-time event
and must not be read as a changed steady state.** Sweeps A/B/C (`0356`, `0357`, `0358`) executed the
2026-08-29 retro's own recommendation #3 and discharged a standing pool in one pass:

- **29 of the 56 closes in the window (52%)** are record-repair rows.
- **28 of the 56 landed on a single day, 2026-09-07.**
- ⛔ **That pool cannot be drained twice.** It stood at 46 rows at the baseline and at 21 at `HEAD`.

### ⚠️ The verdict rests on one unschematised judgement, and the report says the verdict can flip

⛔ **The regenerative/latent split is a reading of brief prose. There is no schema field for a task's
causal origin.** Only 3 of the 30 rows say "pre-existing" in words; the other three latent placements
are the author's judgement. ⛔ ***"If all six are really regenerative, `k_regen` equals total k and its
upper bound crosses 1"*** — **the verdict flips.** ⚠️ **This single classification carries the whole
answer**, and it is recorded as such rather than smoothed over.

### ⭐ The Sprint 7 "under 10%" criterion — missed on the number, passed by ruling

⛔ **Both halves are true and neither cancels the other:**

- **Measured 33.1% at the baseline → 18.6% at `HEAD`** (46 of 139 → 21 of 113). ⛔ **The stated 10%
  threshold was NOT met. 18.6% is not under 10%, and is not close to it.**
- ✅ **The owner ruled, 2026-09-13, live via `AskUserQuestion`: *"Treat the trend as the pass."*** The
  criterion is recorded as **passed by owner ruling on the trend**, not by the number.

The trend is real and is the report's largest single movement: a **14.5 percentage-point fall, 25 rows
removed, in 15 days.** ⛔ **Recorded as ruled; the report does not re-litigate it, and neither does this
page.**

### ⚠️ Six named limits on the method — carried, not summarised away

1. ⚠️ ***"Created" means first COMMITTED, not first written.*** This repo commits in batches — 28 of 56
   closes on one day. **Weekly and sprint shapes are directionally sound; individual days are not.**
2. ⚠️ **Cancellations count as closes** — 14 lifetime, 2 in this window. Excluding them moves cut A
   from 0.54 to **0.56**.
3. ⚠️ **Sprint buckets are date windows, not board membership.**
4. ⚠️ **The record-repair rule is a leading-verb proxy, permanently** — it classifies on the first word
   of the folder slug. ⛔ **Known wrong on at least two rows**: task `0384` exists precisely because the
   rule scores `0337` and `0340` as repairs when they write a net-new record. **Both are inside this
   window's 29.**
5. ⚠️ **15 days, two sprints, 56 closes** — one a consolidation event, the other 5 days long.
6. ⚠️ **The convergence model assumes the latent pool is finite and does not refill.** It is finite in
   any snapshot, but every change adds new surface that can later go stale. ⛔ **The report does not
   measure the refill rate and cannot from a 15-day window.**

### ⭐ It corrects three claims in its own framing rather than quietly fixing them

| Claim as framed | Measured |
|---|---|
| **31** tasks created post-baseline | **30** (391 − 361) |
| **3** cancellations in the window | **2** (`0355`, `0372`) |
| **25 of 31** carry the ADR-021 marker | **30 of 30** — so the "floor" that framing offered is not a floor; the real discovery floor is R2's **27 of 30** |

### ⚠️ It also corrects the baseline retro — and the retro was wrong, not the script

⛔ **W30 disagrees: the instrument reports 52 created, the retro reported 152.** ⭐ **The gap is the
RETRO's method artifact, not the script's** — the retro's `git log` attributed the whole task-folder
migration to one week. The instrument excludes 100 same-segment renames as shape changes, which is
correct. ✅ **W31–W34 reproduce exactly** (37/20, 69/27, 48/30, 17/8). ⛔ **Nothing in the retro was
edited**; its figures stand as the baseline.

### ⚠️ Two of its tables are not reproducible by the two published commands

```
node claude/skills/fkit-status/throughput.mjs
node claude/skills/fkit-status/throughput.mjs --at 1f33b951e720ab97c14d496e8a4833632e8de43b
```

⛔ **Neither reproduces the per-sprint table nor the k derivation.** Both were built for this report
over the instrument's exported `readHistory` / `briefIdentity` by a throwaway script. ⚠️ **The
per-sprint bucketing is NOT a mode of the instrument.**

⛔ **Always `node`, never `bash` and never `./`** — the shebang is decorative; the installer `chmod
+x`'es a hardcoded list of two filenames and this file is not on it.

### ⭐ It makes no recommendation, deliberately

*"The owner asked what is true about convergence, not what to do about it. Where the arithmetic has an
implication it is stated as arithmetic and left there."* ⛔ **A reader looking for a plan here will not
find one, and that is the report's choice, not an omission.**

## Related
- [[tasks/the-throughput-counter-created-vs-closed-per-iso-week]] — `0359`, the instrument this report runs; built precisely to make the retro's baseline re-runnable rather than re-derivable by hand
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board whose *"record repair under 10%"* criterion this measures, and whose 48/21 is the consolidation event
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]] — cut C's window: the only consolidation-free sprint measured
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] · [[tasks/sweep-b-the-single-site-correction-notes]] — `0356` and `0357`, two of the three sweeps that produced the one-time 52%
- [[tasks/add-dual-home-paritys-missing-accepted-drift-row-and-correct-its-count]] · [[tasks/sweep-the-repo-only-claude-path-form-out-of-installed-facing-prose]] — `0389` and `0390`, two of the three **`L`** rows with textual proof that their defect pre-dated the task that found it
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why the report's author could not file it here, and routed the call to `fkit-wiki` instead
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the spawned-producer marker all 30 briefs carry
- [[systems/knowledge-base-structure]] — where a `reports/` record sits, and why it is never promoted into `conventions/`

---

## ⭐ Follow-on measurement — 2026-09-16, at `a351cb6` (sync `b4a1a52`→`a351cb6`)

⛔ **Measured fresh by running the instrument this run; NOT inherited from the report.** The report's
own figures are pinned to `3b96c7f` and are left untouched above.

| Measure | Report, at `3b96c7f` | **This run, at `a351cb6`** |
|---|---|---|
| Open rows | 113 | **109** |
| Record-repair rows | 21 | **24** |
| Repair share | 18.6% | **22.0%** |
| Repair excluding source-defect exceptions | 18 (15.9%) | **21 (19.3%)** |

⭐⭐ **A THIRD consecutive week where closes exceed creations** — 2026-W36 **14/20**, 2026-W37
**16/36**, 2026-W38 **8/12**. ⭐ **The longest such run in the project's recorded history**, and one
week longer than the report could see.

⛔ **The report's W37 figure (7/28) is NOT contradicted.** Same week, later revision, more commits
observed — ⚠️ **exactly the limit the report names as its own first one:** *"Created means first
COMMITTED, not first written… individual days are not"* directionally safe. **A week's figure is not
final until the week is.**

⚠️ **The repair share moved the WRONG way while the absolute count of open rows fell.** ⛔ **Both are
true and neither is hidden:** open rows **113 → 109**, repair-excluding-source-defects **15.9% →
19.3%**. The share can rise while the queue shrinks, because non-repair rows closed faster than repair
rows did.

⛔ **This is NOT asserted to reverse the owner's 2026-09-13 *"Treat the trend as the pass"* ruling, and
NOT asserted to confirm it.** That ruling rested on a **14.5-point fall over 15 days**; this is **one
later measurement three days on**, and one measurement is not a trend. ⭐ **It is recorded so the next
reader has it rather than re-deriving it** — which is the whole reason the instrument exists.
