# Check prove-red mutation 48 on one isolated Linux run before deciding the banner tests

## ID
0526

## Sprint
Sprint 13

## Priority
P1

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Step 1 of the test-suite reduction** (owner decision 2026-10-19 — the full decision and rulings are
quoted in `0527`'s brief, *Owner rulings*). The chain is `0526` + `0527` → `0528` / `0529` → `0530`.

**Owner ruling 4, `AskUserQuestion`, fkit-lead session, 2026-10-19 (⚠️ relayed by the lead to a spawned
`fkit-producer` with no owner channel, ADR-021):** selected *"Check first (Recommended)"* — *"One
isolated Linux run (CI branch/container) as the first step of the task; then decide the banner tests'
fate."*

**Why this check comes first.** Source: 2026-10-19 lead-session consults (architect / coder /
reviewer). On the slowest CI run seen (run 38904713361, 1310 s), the update-banner group took about
32% of the time. Mutation 48 of `test/prove-red.sh` (*"Leave the watchdog armed after git answers"*,
task `0284`) alone took 217.8 s. **The cause is not verified.** Two readings:

- **A test cost only** — the banner tests use real ~5 s sleeps (task `0284`'s timing tests), and
  `FKIT_NET_TIMEOUT=5` is hard-coded in `claude/fkit-claude.sh`, not overridable, so tests cannot
  shorten it.
- **A real Linux launcher behaviour** — on Linux, a launch may be held ~6 s when the watchdog is not
  disarmed. If so, that is a user-facing bug in the shipped launcher, and deleting the banner tests
  would hide it.

The owner chose to find out before any banner-test cut. `0529` waits on this answer for the banner
tests only.

## What to build

An **investigation only** — no change to shipped code, no test deleted.

1. Run the update-banner tests and mutation 48 in **one isolated Linux environment** — a local Linux
   container, or a throwaway CI branch. ⚠️ A CI branch needs a **push**, and the hard rule says
   *never push unless the owner explicitly asks*: prefer a local container; if a push is needed, ask
   the owner first.
2. Time each banner test and mutation 48. Find where the 217.8 s goes: is it the tests' own sleeps
   and timeouts, repeated whole-suite runs, or the launcher really waiting?
3. Answer one question plainly: **does a real user on Linux get a slow launch from this code path?**
   (yes / no / not proved — with the evidence).
4. Give a recommendation for the banner tests, in plain words: delete, keep a small fast subset, or
   keep and fix a real launcher bug (the fix would be its own brief, owner-approved).

## Verification steps

1. `worklog.md` in this folder records the environment (OS image, Node and bash versions — no
   secrets, no endpoints), the exact commands run, and the per-test and mutation-48 timings.
2. The yes / no / not-proved answer to step 3 is stated, with the evidence that supports it.
3. If a CI branch was used: the owner's go-ahead to push is quoted, and the branch is deleted after.
4. No file under `claude/`, `bin/` or `test/` is changed (`git diff --stat` on those paths is empty).

## Notes

- **Depends on:** nothing
- **Blocks:** 0529 (the banner-test part only)
- Can run in parallel with `0527` (the ADR).
- ⛔ **Do not start without the owner's specific word.** Being pullable is not his word. (The owner
  paused all other tasks on 2026-10-19 to do this work first; that pause is his call to lift.)
  - **2026-10-19 — the owner's specific word is given.** Via `AskUserQuestion`, `fkit lead` session,
    selected option text, verbatim: *"New Sprint 13, start now (Recommended)"* — description he saw:
    *"Sprint 13 holds only 0526–0530; starting it is your word for all five. Sprint 12 stays paused.
    Knock-on: none."* Relayed verbatim to a spawned `fkit-producer` (no owner channel, ADR-021). The
    line above is kept as the record; it is now satisfied.
