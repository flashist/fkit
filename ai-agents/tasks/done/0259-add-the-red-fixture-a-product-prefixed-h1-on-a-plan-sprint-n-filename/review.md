# Review — 0259

Task: 0259 — [brief](./brief.md)
File(s) under review: `test/dashboard-contract.test.js` (the new R8 block, `:673`–`:723`); the task
folder's `plan.md` and `worklog.md`
Status: closed-out
(Round 1: both findings verified CORRECT and fixed under explicit owner rulings; one residual
recorded. ⚠️ "closed-out" is the REVIEW's state — the task still ships the suite RED on purpose,
per the owner's "Accept both reds as-is" ruling. `0264` restores both gates.)

**Reviewers this round:** fkit-reviewer (own pass) + Codex `gpt-5.6-sol` via `codex exec
--sandbox read-only`. **Both ran. Coverage is FULL — no reviewer skipped, no degradation.**

> ⚠️ **Dated correction 2026-09-04 (`0274`, inside sweep `0357`) — the coverage claim above overstates
> what happened.** The sentence is **left byte-identical**: it is the record of what was claimed, and
> [ADR-042](../../../knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md)
> quotes it at this location as its own evidence.
>
> **What it corrects.** *"Coverage is FULL"* was written on the old **binary** coverage vocabulary
> (full / partial). Under ADR-042's three-state vocabulary — as landed by task `0272` — this pass reads
> **reasoning-only second opinion**: Codex ran and reasoned, but its `--sandbox read-only` flag blocks
> `mkdtemp`, so **it measured nothing**. ⭐ **All execution evidence in this review is the Claude
> reviewer's.**
>
> ⛔ **The note does NOT say the review was deficient or its findings unsound.** ADR-042 D1 §2 is
> explicit that reasoning-only is the **normal, expected** state under the current sandbox, not a
> degradation, and that static reasoning finds real defects. ⭐ **The claim was wrong; the review was
> not.**
>
> ⛔ **Nothing else in this ledger changes** — not the verdict, not the findings table, not the
> residuals, not `Status:`. This review is **not reopened**, no round is added, and `0259`'s task status
> is untouched.

**⛔ Owner-ruled context, not re-litigated here:** a RED suite is the accepted deliverable of `0259`
(owner ruling 2026-08-11, option label verbatim *"Accept both reds as-is"*), and the plan — including
§6.1's call that `drift unresolved-plan-sprint` rides the failing assertion's message rather than a
standalone `assert.ok` — was owner-approved. Neither reviewer reported the red suite or the
`prove-red.sh` hard-gate failure as a defect, and neither is recorded below.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | medium | `test/dashboard-contract.test.js:721` | The sole assertion is an **absence** check (`drift disagreement` count `== 0`) with no guard that the plan→brief link resolved, so the case flips **GREEN while the defect it pins is still present**. Empirically confirmed: with the brief link unresolved, `dashboard.sh` emits `drift missing-brief` instead of `drift disagreement`, `drift unresolved-plan-sprint` **still fires** (identity still unresolved), and the assertion passes. Any future regression in `foldBriefsAndPlan()`'s href fold, a rename of `brief.md`, or a change to the `../tasks/<board>/<slug>.md` → `<ID>-<slug>/brief.md` rewrite silently converts this red fixture into a passing test. Raised by **both reviewers**. A `missing-brief`-absence guard closes it and does **not** invert when `0264` lands (verified: no `missing-brief` fact in either the pre-fix or post-fix run), so it does not touch plan §6.1's owner-approved call. |
| R2 | 1     | low  | `test/dashboard-contract.test.js:679-680` | The comment asserts *"IT GOES GREEN WHEN `0264` LANDS ADR-040's identity grammar, and not before"* — an **exclusivity the assertion does not enforce**. Empirically confirmed: **any** non-`Sprint 9` identity turns it green (probed with a resolving `Sprint 77`), including ADR-040's **explicitly rejected option (c)** numeric-only widening, which resolves `plan-sprint-4.md` → `Sprint 4` correctly *by luck on this one file*. ⚠️ **The coverage gap itself is per-spec and is NOT a defect** — ADR-040 assigns that discrimination to **T2** (`plan-sprint-4c.md`), which is `0264`'s, and ADR-040's T1 row specifies exactly the assertion that shipped. Also **not closable inside `0259`**: `dashboard.sh` emits no observable fact carrying a *resolved* `PLAN_SPRINT` (verified — a successful run's facts are only `total`/`count`), so there is nothing to assert positively without a `dashboard.sh` change, which is out of scope. The only remedy available here is a one-line comment correction naming T2 as the discriminator. |

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (in the test) | Added a `missing-brief`-absence guard immediately before the existing assertion, at `test/dashboard-contract.test.js:726-735` | ✅ done |
| R2 | CORRECT | Defect (in the comment, not the code) | Amended the comment at `:678-685`: the "and not before" exclusivity is replaced by an explicit statement of what T1 does **not** prove, naming ADR-040's **T2** (`plan-sprint-4c.md`) as the discriminator and as `0264`'s work | ✅ done |

**Severity, assigned by me (not inherited):** R1 **medium** — it does not affect shipped behavior
(`dashboard.sh` is untouched), but it degrades the fixture's only job. This fixture exists to stay red
until `0264`; a silent flip to green would mark the defect fixed when it is not, and `0264`'s brief
step 6 uses a green suite as its completion signal. R2 **low** — comment-only; no assertion behavior
changes either way.

**Verification I ran myself, independent of the reviewer** (A/B probe against
`claude/skills/fkit-status/dashboard.sh`, four fixture variants):

| variant | drift facts | `disagreement` | `missing-brief` | assertion (pre-fix) |
|---|---|---|---|---|
| A today, link resolves | `disagreement 0001` + `unresolved-plan-sprint` | 1 | 0 | **fails** ✅ correct red |
| B today, link unresolved | `missing-brief 0001` + `unresolved-plan-sprint` | **0** | 1 | **passes** ⛔ **false green — R1 confirmed** |
| C identity resolves (0264 simulated), link resolves | *(none)* | 0 | 0 | passes ✅ intended green |
| D identity resolves, link unresolved | `missing-brief 0001` | 0 | 1 | passes |

- **R1 CONFIRMED.** Variant B is the reviewer's claim, reproduced exactly: the defect is fully intact
  (`unresolved-plan-sprint` still fires — the identity still does not resolve) and the sole assertion
  still passes. **The guard does not invert when `0264` lands** — variants A and C both show
  `missing-brief` = 0, so it holds in the pre-fix and post-fix worlds alike, and plan §6.1's
  owner-approved "nothing inverts later" property is preserved. Confirmed empirically, not inferred.
- **R2 CONFIRMED, including its own limits.** Probed a wrong-but-resolving identity (H1
  `# Sprint 77 — Whatever` on `plan-sprint-4.md`): **zero** `drift disagreement` — the case goes green
  under an identity that is simply not `Sprint 9`, exactly as claimed. I also confirmed the reviewer's
  reason for **not** demanding a code fix: a fully-resolving run's entire FACTS block is
  `total 1` / `count done 1` / `⟦END⟧` — **no fact carries the resolved `PLAN_SPRINT`**, so there is
  nothing to assert positively without a `dashboard.sh` change, which plan §8 forbids. ADR-040:252
  confirms T2 (`plan-sprint-4c.md`) is the discriminator and ADR-040:246 assigns T1 to `0259`; the
  T2 row belongs to `0264`. The comment amendment is therefore the only remedy available in scope —
  and it is a **correction of an overstated claim**, not a coverage fix.

**No re-litigation, no oscillation.** Neither finding touches plan §6.1's owner-approved design (the
drift facts still ride the failing assertion's message; no standalone `assert.ok` was added), and
neither widens a matcher. Both fixes are additive to the new block only — no existing test was edited.

**⛔ Scope note:** both fixes go **beyond the approved plan §4 verbatim code listing**, and both were
applied **only** under the owner's explicit rulings of 2026-08-11 ("Add the guard in 0259 now",
"Amend to name T2"), which supersede §4 on these two points and no others.

## Accepted residuals (shared, do-not-re-litigate)

<!-- Added only on an owner disposition. -->

- **T1 cannot discriminate a correct identity grammar from a lucky one** — **What:** this fixture
  asserts only that `drift disagreement` is absent, so it goes green under **any** resolved identity
  that is not `Sprint 9`, including ADR-040's rejected numeric-only widening (which resolves
  `plan-sprint-4.md` → `Sprint 4` correctly by luck on this one filename). **Why (structural):** it is
  per-spec — ADR-040 (`:251`) defines T1 as exactly this assertion and assigns the discrimination to
  **T2** (`plan-sprint-4c.md`, ADR-040 `:252`), which is task `0264`'s. It is also **not closable
  inside `0259`**: a fully-resolving run emits no fact carrying the resolved `PLAN_SPRINT` (verified —
  the whole FACTS block is `total` / `count` / `⟦END⟧`), so a positive assertion would require a
  `dashboard.sh` change, which plan §8 forbids outright. Owner disposition 2026-08-11: *"Amend to name
  T2"* — correct the comment's overstated claim, do not chase the coverage here.
  **Re-raise only if:** `0264` ships without ADR-040's **T2**, or `dashboard.sh` gains an observable
  fact carrying the resolved plan identity (which would make a positive assertion possible in scope).

## Verified and dismissed — recorded so they are not re-chased

Checked against the code this round and found **correct**; no ledger row raised:

- **Red for the stated reason.** `PLAN_SPRINT` resolves empty (H1 rung `dashboard.sh:83` requires the
  line to *start* `# Sprint N`; filename rung `:87` requires stem `^sprint-[0-9]+$`; `plan-sprint-4`
  matches neither), rule 1's guard at `:802` is false, the row falls to rule 3, and the
  location mismatch (`✅ Done` → expected `done/`, brief found in `backlog/`) produces the single
  `drift disagreement`. Both required facts appear in the failure message, `&` and `—` intact.
- **Goes green under a resolving identity.** Verified by running the same fixture with an H1 that
  resolves under *today's* rung 1 — zero `drift disagreement`, no `unresolved-plan-sprint`. The
  mechanism the fixture pins is real. (Its inability to distinguish a *correct* identity from a
  merely non-`Sprint 9` one is R2, and is ADR-040 T2's job.)
- **Every cited fact in the comment.** `:641` does use `fixture()` → `sprint-1.md`; the second R8 case
  does use `hardening.md` and pin the reporting path; `STATUS_HEADING_RE` is
  `$'^## Status[ \t]*$'` and `dashboard.sh:206` `die`s without it, so the reporter's
  `## Sprint 4 Status` would indeed abort before drift logic — the documented deviation is justified;
  report §7 note 2 does say the heading is their own data defect and they are not asking us to change
  it; the filename `plan-sprint-4.md` and H1 `# Geoconflict — Sprint 4 — In-App Monetization &
  Citizenship` are **byte-verbatim** from §7 row 2.
  *(Nit, not raised: the second R8 case's `test(` line is `:655`, cited as `:654`. ADR-040 and the
  plan use the same `:654`; the citation is consistent across all three artifacts and lands the
  reader on the right case.)*
- **Test hygiene.** `MADE.push(root)` runs immediately after `mkdtempSync`, before anything can throw,
  and `after(() => MADE.forEach(cleanup))` `rmSync`s recursively — a full run leaves **zero**
  `fkit-dash-*` dirs behind (checked). Self-contained temp root, no cross-test leakage, no ordering
  dependence, no new import. Creating `tasks/done`, `tasks/cancelled` and `sprints/done` mirrors
  `fixture()` and does not perturb the result.
- **Worklog claims, re-measured independently.** Dashboard suite **117 / 116 pass / 1 fail / 0 skipped
  / 0 todo** ✅ exact. Full `npm run test:unit` **683 / 682 / 1 / 0 / 0** ✅ exact. Both existing R8
  cases still pass ✅. Exactly one product-surface file changed ✅. `npm test`'s `&&` short-circuit
  before `prove-red.sh` ✅ (`package.json:5`).

## Re-litigates settled decisions (suppressed)

**None this round.** Neither reviewer proposed the standalone `assert.ok(unresolved-plan-sprint)` that
plan §6.1 rules out, proposed widening a matcher, or re-argued ADR-040's rejected options (b)/(c).
