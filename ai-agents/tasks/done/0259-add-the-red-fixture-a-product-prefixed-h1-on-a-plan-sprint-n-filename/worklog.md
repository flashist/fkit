# Worklog — task `0259`: add the red fixture

**Date:** 2026-08-11 · **Agent:** fkit-coder (Build worker under `/fkit-sprint-ship-loop`)
**Plan:** `plan.md` in this folder (approved by the owner via `AskUserQuestion`, 2026-08-11)

---

## ⛔ THIS TASK SHIPS THE SUITE RED ON PURPOSE

`npm test` does **not** return green after this change, and is not meant to. The new fixture
reproduces a filed defect that **task `0264`** fixes. Two gates are red until `0264` lands — see
"The second red" below, which the plan did **not** predict.

---

## 1. What changed

**One product file: `test/dashboard-contract.test.js`** — one new `test(...)` block inserted after the
second R8 case and before the `// R14 —` block, exactly as plan §4 specified. No other source touched.
No change to `dashboard.sh`, `SKILL.md`, or `prove-red.sh`.

New case: `R8: a product-prefixed H1 on a \`plan-sprint-N.md\` filename must keep rule 1 alive`
(at `test/dashboard-contract.test.js:699`).

Plus this worklog. Nothing under `ai-agents/wiki-vault/`. Nothing under `claude/`.

## 2. Verification — plan §7, step by step

### Step 1 — the new case is RED, with its assertion message

`node --test test/dashboard-contract.test.js`:

```
✖ R8: a product-prefixed H1 on a `plan-sprint-N.md` filename must keep rule 1 alive (96.811542ms)
  AssertionError [ERR_ASSERTION]: rule 1 must still skip: the brief belongs to Sprint 9, not to this
  plan. Drift facts: ["drift disagreement 0001 plan=\"✅ Done\" brief=\"🔲 Backlog\"
  location=\"backlog/\"","drift unresolved-plan-sprint h1=\"# Geoconflict — Sprint 4 — In-App
  Monetization & Citizenship\""]

  1 !== 0
      at TestContext.<anonymous> (file://.../test/dashboard-contract.test.js:721:10)
```

Both required strings are present, as plan §7.1 demanded:

- ✅ `drift unresolved-plan-sprint h1="# Geoconflict — Sprint 4 — In-App Monetization & Citizenship"`
- ✅ `drift disagreement 0001 …`

### Step 2 — red for the stated reason

Confirmed by step 1's message content, per the design call in plan §6.1 (the drift facts ride the
failing assertion's message rather than a standalone `assert.ok`, so nothing inverts to red when
`0264` lands). No extra assertion added.

**The `&` risk in plan §9 did not materialise.** `Monetization & Citizenship` survives into the
`h1="…"` fact intact — no mangling, nothing dropped.

### Step 3 — every other test still passes

| run | tests | pass | fail | skipped | todo |
|---|---|---|---|---|---|
| `node --test test/dashboard-contract.test.js` | 117 | 116 | **1** | 0 | 0 |
| `npm run test:unit` (whole suite, 17 files) | 683 | 682 | **1** | 0 | 0 |

The single failure in each run is the new case. **Both existing R8 cases still pass**
(`:641` prose-H1 fallback, `:654` unresolvable-is-reported). No other test changed behaviour.

### Step 4 — `npm test` and the short-circuit

`npm test` = `node --test test/*.test.js && bash test/prove-red.sh`.

**The unit run fails, so `&&` short-circuits and `prove-red.sh` is never reached by `npm test`.** Run
separately via `npm run test:prove-red` — and it **FAILS**. This is the plan's falsified expectation;
see the next section.

### Step 5 — `git status --porcelain`

```
 M ai-agents/tasks/backlog/0259-…/brief.md      ← PRE-EXISTING, not mine (present before this build)
 M test/dashboard-contract.test.js              ← the one product-surface change
?? ai-agents/tasks/backlog/0259-…/plan.md       ← written by the driver at plan approval, not by me
?? ai-agents/tasks/backlog/0259-…/worklog.md    ← this file (plan §7 mandates it)
```

Matches plan §7.5's reading of brief steps 4 + 5: **exactly one changed file on the product surface**,
plus the task folder's own artifacts. Nothing under `ai-agents/wiki-vault/`. Nothing under `claude/`.
No commit, no push, no task-file move.

## 3. ⚠️ The second red — a consequence the approved plan did not predict

**Plan §7.4 instructed me to run `npm run test:prove-red` separately "to show `prove-red.sh` still
passes". It does not pass.** Recorded here rather than resolved, because every remedy lies outside the
approved plan.

**Mechanism** — `test/prove-red.sh:258-265`, gate `0i`:

```
0i. unmutated repo copy dashboard suite should be green ... red
   ✗ an UNMUTATED repo copy's dashboard suite is red — mutation 14 below would be false.
✗ hard gate FAILED — see above.
```

`0i` is a **sanity baseline**: it copies the repo and asserts the dashboard suite is green there, so
that mutation 14's red is known to be caused by the mutation and not by a broken copy. A deliberately
red dashboard suite makes that baseline false by construction.

**Confirmed as caused by this change, not pre-existing.** With `test/dashboard-contract.test.js`
stashed, `bash test/prove-red.sh` reports `0i … green` and `✓ hard gate PASSED`. Restored, it reports
`0i … red` and `✗ hard gate FAILED`.

**All 15 mutations still red their named assertions** — the mutation machinery itself is intact and
unbroken. What is lost for the `0259` → `0264` interval is `0i`'s *proof* that mutation 14's red is
trustworthy, and the overall `✓ hard gate PASSED` line.

**Not fixed here, deliberately.** Plan §8 and brief line 114 both forbid it outright: *"⛔ No
`prove-red.sh` mutation."* Returned to the owner as `NEEDS-DECISION` instead of being decided
unilaterally.

**Likely already accounted for downstream:** `0264`'s brief step 6 requires *"Full `npm test` green,
including `test/prove-red.sh`"* and explicitly notes `0259` shipped it RED on purpose — so the
intended end state is that `0264` restores both gates together.

## 4. Decision log

Fixes applied without asking, and obvious-winner calls, per ADR-019's audit obligation:

| # | what | why it qualified |
|---|---|---|
| 1 | Inserted the new `test(...)` block into `test/dashboard-contract.test.js` | Verified `CORRECT` (produces exactly the predicted red, both required facts present), mechanical/localized (one added block, no existing line edited), and **inside the approved plan** — plan §4 specified the code verbatim and I applied it verbatim. |
| 2 | Wrote this `worklog.md` | Mandated by plan §7. Not a code change. |

**No obvious-winner calls made.** **No judgment call resolved unilaterally** — the one that arose
(§3, `prove-red.sh`) was stopped on and returned as `NEEDS-DECISION`.

**Nothing was widened, and no matcher was touched.** Every plan §8 prohibition held: no
`dashboard.sh` change, no `SKILL.md` change, no edit to the two existing R8 tests, no regex widening,
no new devDependency, no `prove-red.sh` mutation, no wiki write, no commit/push/re-rank/task-move, and
no `T2`–`T11` fixtures (those are `0264`'s).

---

## 5. Round 1 review — process-review pass (2026-08-11)

**Agent:** fkit-coder (Process-review worker under `/fkit-sprint-ship-loop`). Ledger: `review.md` in
this folder. Both findings verified independently against the code before anything was applied.

### 5.1 What I verified myself (A/B probe, not inherited from the reviewer)

Four fixture variants run against `claude/skills/fkit-status/dashboard.sh`:

| variant | drift facts | `disagreement` | `missing-brief` | assertion (pre-fix) |
|---|---|---|---|---|
| A today, link resolves | `disagreement 0001` + `unresolved-plan-sprint` | 1 | 0 | **fails** ✅ correct red |
| B today, link unresolved | `missing-brief 0001` + `unresolved-plan-sprint` | **0** | 1 | **passes** ⛔ false green |
| C identity resolves (`0264` simulated), link resolves | *(none)* | 0 | 0 | passes ✅ intended green |
| D identity resolves, link unresolved | `missing-brief 0001` | 0 | 1 | passes |

- **R1 confirmed** by variant B — the defect fully intact, the sole assertion passing.
- **Guard does not invert on `0264`** — A and C both show `missing-brief` = 0, so plan §6.1's
  "nothing inverts later" property survives.
- **R2 confirmed** — a wrong-but-resolving identity (`# Sprint 77 — Whatever` on `plan-sprint-4.md`)
  yields **zero** `drift disagreement`. A fully-resolving run's entire FACTS block is
  `total 1` / `count done 1` / `⟦END⟧`: **no fact carries the resolved `PLAN_SPRINT`**, so a positive
  assertion is impossible without a `dashboard.sh` change (plan §8 forbids). ADR-040 `:251`/`:252`
  confirm T1 is this case and T2 (`plan-sprint-4c.md`) is the discriminator, owned by `0264`.

### 5.2 Decision log — round 1

| # | what | which finding | why it qualified |
|---|---|---|---|
| 3 | Added a `missing-brief`-absence guard at `test/dashboard-contract.test.js:726-735` | **R1** | Verified `CORRECT` by A/B probe (variant B reproduces the false green exactly); mechanical/localized (one added assertion inside the new block, no existing line edited); **outside plan §4's verbatim listing but explicitly authorized by the owner's ruling "Add the guard in 0259 now" (2026-08-11)**, which supersedes §4 on this point only. Verified not to invert post-`0264` (variants A + C). |
| 4 | Amended the comment at `:678-685` — replaced the "and not before" exclusivity with an explicit statement of what T1 does **not** prove, naming ADR-040's **T2** | **R2** | Verified `CORRECT` (the `Sprint 77` probe shows any non-`Sprint 9` identity turns it green); comment-only, no assertion behavior changed; **outside plan §4 but authorized by the owner's ruling "Amend to name T2" (2026-08-11)**, this point only. **Not** an implementation of T2 — that stays `0264`'s. |
| 5 | Recorded the T1-cannot-discriminate residual in `review.md` | **R2** | Obvious-winner within the ruling's intent: the owner chose "amend the comment" over "close the gap", which *is* a disposition accepting the gap as settled; recording it is the mechanism that stops a round-2 re-litigation. Docs-only, reversible. **Flagged to the driver rather than treated as invisible.** |
| 6 | Set the ledger header to `Status: closed-out` | — | Both findings dispositioned `✅ done`, nothing blocking. Annotated in place that this is the **review's** state, not the suite's — the task still ships RED by owner ruling. |

**No judgment call resolved unilaterally.** No frontier-move, no regression, no oscillation, no
severity dispute changing scope, nothing outside the approved plan + the two owner rulings.

### 5.3 Re-verification after the fixes

| run | tests | pass | fail | skipped | todo |
|---|---|---|---|---|---|
| `node --test test/dashboard-contract.test.js` | 117 | 116 | **1** | 0 | 0 |
| `node --test test/*.test.js` | 683 | 682 | **1** | 0 | 0 |

**Identical to the pre-review tallies — the guard added no second failure.** The single failure is
still the intended case, still failing on the *same* assertion (the `disagreement` one, not the new
guard), and its message still carries both required facts verbatim:

```
✖ R8: a product-prefixed H1 on a `plan-sprint-N.md` filename must keep rule 1 alive
  AssertionError: rule 1 must still skip: the brief belongs to Sprint 9, not to this plan.
  Drift facts: ["drift disagreement 0001 plan=\"✅ Done\" brief=\"🔲 Backlog\" location=\"backlog/\"",
  "drift unresolved-plan-sprint h1=\"# Geoconflict — Sprint 4 — In-App Monetization & Citizenship\""]
```

The guard passing today is exactly the intended behavior — it fires only if the fixture stops
reaching the case at all.

**`prove-red.sh` — still red, still one root cause.** Gates `0a`, `0b` and `0i` each call
`run_suite()`, which is `node --test "$repo"/test/*.test.js` (`test/prove-red.sh:205`). All three
therefore go red from the **single** intended failure — this is the same condition §3 above already
recorded, not a new one and not caused by the guard. §3's `NEEDS-DECISION` was answered by the owner
on 2026-08-11: **"Accept both reds as-is"** — `0259` ships with the unit suite and the `prove-red`
hard gate both red, and `0264` restores them together.
