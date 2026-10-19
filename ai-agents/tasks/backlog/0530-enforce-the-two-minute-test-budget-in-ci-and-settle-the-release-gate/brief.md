# Enforce the two-minute test budget in CI and settle the release gate

## ID
0530

## Sprint
Sprint 13

## Priority
P5

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**The last step of the test-suite reduction** (owner decision and rulings quoted in `0527`'s brief,
*Owner rulings*). Chain: `0526` + `0527` → `0528` / `0529` → `0530`.

**Owner ruling 2, `AskUserQuestion`, fkit-lead session, 2026-10-19 (⚠️ the lead's relay):** selected
*"≤ 2 min, CI-enforced (Recommended)"* — the default `npm test` takes ≤ 2 min locally on an idle Mac;
**CI fails the job if it goes over.**

Today `.github/workflows/test.yml` sets `timeout-minutes: 33`, and `bin/release.mjs` runs `npm test`
as its own gate (its help text says *"10+ min"*). `CONTRIBUTING.md` says *"~12 min"*. All of these go
stale after `0529`.

**Open question for the owner — the release gate.** After the cut, should `npm run release`:
- (a) **keep running the remaining checks itself** (≤ 2 min, so cheap now) — the release never ships
  an untested tree even if CI was skipped; or
- (b) **trust a green CI run** on the commit it releases — no local run, but the release depends on
  CI having run on exactly that commit.
The plan does not choose; the owner does, before build.

## What to build

1. **CI budget:** CI fails the job when the `npm test` step goes over the budget. CI runners are not
   an idle Mac, so the plan proposes the CI number (measured on the runner after `0529`, with the
   reasoning) for the owner to confirm. A clear failure message names the budget and the measured
   time.
2. **Release gate:** per the owner's answer above; update `bin/release.mjs`'s help and comment text
   to the new timings either way.
3. **Re-measure and publish** the new times in `CONTRIBUTING.md` (local idle Mac, and CI) — this is
   what `0503` was going to do.
4. If prove-red keeps a lane (`0527` / `0529`), say in CONTRIBUTING when it runs and how long it takes;
   it is **not** part of the 2-min budget.

## Verification steps

1. On a branch where a deliberate slow step pushes `npm test` over the budget, CI fails with the
   budget message; without it, CI passes. ⚠️ Pushing a branch needs the owner's explicit OK — or
   prove it with a local run of the same check, and say which was done.
2. `CONTRIBUTING.md` and `bin/release.mjs` show the measured times (three local runs, three CI runs,
   each listed); no stale *"~12 min"* / *"10+ min"* remains (`grep` output pasted).
3. The release-gate behaviour matches the owner's answer, shown with `npm run release:dry`.

## Notes

- **Depends on:** 0529
- **Blocks:** nothing
- Supersedes `0503` if the owner agrees (see `0529`'s knock-on table).
- ⛔ **Do not start without the owner's specific word.** Being pullable is not his word.
  - **2026-10-19 — the owner's specific word is given.** Via `AskUserQuestion`, `fkit lead` session,
    selected option text, verbatim: *"New Sprint 13, start now (Recommended)"* — description he saw:
    *"Sprint 13 holds only 0526–0530; starting it is your word for all five. Sprint 12 stays paused.
    Knock-on: none."* Relayed verbatim to a spawned `fkit-producer` (no owner channel, ADR-021). The
    line above is kept as the record; it is now satisfied.
