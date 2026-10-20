# Enforce the two-minute test budget in CI and settle the release gate

## ID
0530

## Sprint
Sprint 13

## Priority
P5

## Status
🔄 In progress

## Owner
fkit-coder

## Context

**The last step of the test-suite reduction** (owner decision and rulings quoted in `0527`'s brief,
*Owner rulings*). Chain: `0526` + `0527` → `0528` / `0529` → `0530`.

**Owner ruling 2, `AskUserQuestion`, fkit-lead session, 2026-10-19 (⚠️ the lead's relay):** selected
*"≤ 2 min, CI-enforced (Recommended)"* — the default `npm test` takes ≤ 2 min locally on an idle Mac;
**CI fails the job if it goes over.**

> **2026-10-19 — re-scoped to [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) (accepted 2026-10-19).** By owner instruction,
> `fkit lead` session: via `AskUserQuestion`, selected option text, verbatim: *"Stop; re-brief first
> (Recommended)"* — description he saw: *"Run ends now. Next: producer updates 0528–0530 to ADR-057.
> Knock-on: 0528, 0529, 0530 stay Backlog in Sprint 13 until a new run."*; then typed, verbatim:
> *"Commit and then rewrite"*. Relayed verbatim by the lead to a spawned `fkit-producer` (no owner
> channel, ADR-021). The owner was told, when he chose prove-red's nightly lane (ADR-057 Q1 (c)), that
> this task waits on a re-brief adding the nightly schedule — this is that re-brief. *What to build*
> and *Verification steps* are rewritten to the ADR; every owner-ruling quote in this brief is kept as
> written. Main changes: the nightly CI schedule for prove-red's four cases (§D3); the release-test
> lane (§D4) joins the release-gate question; both non-default lanes stay outside the budget (§D10).

Today `.github/workflows/test.yml` sets `timeout-minutes: 33`, and `bin/release.mjs` runs `npm test`
as its own gate (its help text says *"10+ min"*). `CONTRIBUTING.md` says *"~12 min"*. All of these go
stale after `0529`.

**Open question for the owner — the release gate.** After the cut, should `npm run release`:
- (a) **keep running the remaining checks itself** (≤ 2 min, so cheap now) — the release never ships
  an untested tree even if CI was skipped; or
- (b) **trust a green CI run** on the commit it releases — no local run, but the release depends on
  CI having run on exactly that commit.
The plan does not choose; the owner does, before build.

**2026-10-19 — a second release-gate part, from ADR-057 §D4 (owner Q4a (c)):** `0529` moves
`test/release-summary.test.js` out of the default `npm test` into its own script, *"run before a
release"*. The owner's Q4a description says *"whether `npm run release` runs it is 0530's call"*. The
plan proposes, for the owner's pick at plan approval, whether `npm run release` runs that script
itself — alongside (a) / (b) above.

## What to build

The source of truth is [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
(accepted 2026-10-19) — read it whole, including its dated ⚠️ notes (§D3's *"Cost"* note puts the
nightly lane at roughly 136–165 s, arithmetic, not measured). Where this brief and the ADR disagree,
the ADR wins; say so in the plan.

1. **CI budget (ADR-057 §D10, ruling 2):** CI fails the job when the default `npm test` step goes over
   the budget. CI runners are not an idle Mac, so the plan proposes the CI number (measured on the
   runner after `0529`, with the reasoning) for the owner to confirm. A clear failure message names the
   budget and the measured time. Re-set `.github/workflows/test.yml`'s `timeout-minutes: 33` and its
   basis comment to the new suite.
2. **Nightly prove-red lane (ADR-057 §D3, owner Q1 (c), *"fine for now"*):** a CI schedule that runs
   `npm run test:prove-red` — the four cases `0529` leaves — **nightly**, **not** on every push and
   **not** inside the 2-minute budget. Keep it runnable by hand. The plan states, for the owner:
   - how a red nightly run reaches him (the ADR's re-raise condition is a nightly failure that *"stays
     unnoticed"*);
   - known limits of scheduled runs, checked against GitHub's docs at plan time (e.g. which branch a
     schedule runs on, and whether schedules pause on an inactive repo);
   - its measured wall time on the runner.
3. **Release gate:** per the owner's answers to both parts of the question in *Context* — (a) / (b),
   and whether `npm run release` runs the release-summary script. Update `bin/release.mjs`'s help and
   comment text to the new timings either way.
4. **Re-measure and publish** the new times in `CONTRIBUTING.md` (local idle Mac, and CI) — this is
   what `0503` was going to do. Also say there when the two non-default lanes run and how long each
   takes: nightly prove-red (§D3) and the release-summary script (§D4). **Neither is part of the
   2-minute budget** (§D10).

## Verification steps

1. On a branch where a deliberate slow step pushes `npm test` over the budget, CI fails with the
   budget message; without it, CI passes. ⚠️ Pushing a branch needs the owner's explicit OK — or
   prove it with a local run of the same check, and say which was done.
2. The nightly schedule is in the workflow; one run of it is shown — a manual dispatch of the same job
   on the runner, or a local run of the same command, and say which (a push needs the owner's OK, as
   above). Its wall time is stated.
3. `CONTRIBUTING.md` and `bin/release.mjs` show the measured times (three local runs, three CI runs,
   each listed, plus each non-default lane's time); no stale *"~12 min"* / *"10+ min"* remains (`grep`
   output pasted).
4. The release-gate behaviour matches the owner's answers, shown with `npm run release:dry`.

## Notes

- **Depends on:** 0529
- **Blocks:** nothing
- Supersedes `0503` if the owner agrees (see `0529`'s knock-on table).
- **2026-10-19:** also depends, in practice, on `0529` having cut prove-red to the four cases and moved
  the release-summary test — both are in `0529`'s scope, so the `Depends on:` line is unchanged.
- ⛔ **Do not start without the owner's specific word.** Being pullable is not his word.
  - **2026-10-19 — the owner's specific word is given.** Via `AskUserQuestion`, `fkit lead` session,
    selected option text, verbatim: *"New Sprint 13, start now (Recommended)"* — description he saw:
    *"Sprint 13 holds only 0526–0530; starting it is your word for all five. Sprint 12 stays paused.
    Knock-on: none."* Relayed verbatim to a spawned `fkit-producer` (no owner channel, ADR-021). The
    line above is kept as the record; it is now satisfied.
