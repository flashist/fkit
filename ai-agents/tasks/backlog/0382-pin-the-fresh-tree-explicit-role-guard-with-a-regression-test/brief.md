# Pin the fresh-tree × explicit-role guard with a regression test

## ID
0382

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### What is unpinned

The launcher's fresh-project cold start is gated on a **two-part** condition
(`claude/fkit-claude.sh:606`):

```sh
if [ "$fresh" = 1 ] && [ -z "$role" ]; then
```

The `[ -z "$role" ]` half is load-bearing on its own. It is what stops an owner who typed an
**explicit role** — `fkit coder` on a project that was never initiated — from being silently
hijacked into the producer→lead cold start instead of getting the coder session they asked for.

⭐ **Verified firsthand on 2026-09-07, not inherited from a summary.** The guard reads exactly as
quoted above at `claude/fkit-claude.sh:606`. In `test/launcher-contract.test.js` there are exactly
**four** `makeProject({ fresh: true })` projects — at lines `311`, `338`, `377`, `400` — and **all
four** invoke the launcher as `runFkit([])`, i.e. with **no role argument**. Nothing in the suite
exercises a fresh tree with an explicit role, so **deleting the `[ -z "$role" ]` conjunct reds
nothing.**

### Why this is filed now, and why it was NOT fixed in the task that found it

This gap was found by the round-1 review of task `0382`'s predecessor,
[`0379`](../../done/0379-start-the-lead-session-not-the-producer-after-a-fresh-projects-cold-start/brief.md),
as finding **R3**. ⛔ **It is a pre-existing gap, not a defect `0379` introduced** — the guard is
correct in the shipped launcher, and it was correct before `0379` touched the file.

What `0379` changed is the **cost** of a future regression, not the guard:

- **Before `0379`:** a broken guard dropped the owner into **one** session they did not ask for.
- **After `0379`:** the cold start is a two-phase producer→lead hand-off, so a broken guard drops the
  owner through **two** sessions they did not ask for.

⛔ **The owner ruled this out of `0379` and into its own row**, in a live `AskUserQuestion` on
2026-09-07, **verbatim option label: *"Split to a follow-up brief (Rec)"***. The reasoning recorded
against it was scope: closing the gap means new coverage for behaviour outside `0379`'s
owner-approved plan, which is a scope widening rather than a fix to what shipped.

⭐ **This brief IS the discharge of that ruling.** `0379`'s review ledger carries the gap under its
§ *Accepted residuals (shared, do-not-re-litigate)* section, as the bullet opening *"No fresh-tree ×
explicit-role regression test (R1 round 1 → owner-ruled to a follow-up brief, 2026-09-07)"*. That
residual's re-raise condition is stated there as *"the follow-up brief is dropped rather than
written, or the `-z "$role"` guard itself changes"* — so **writing this brief discharges the first
half of it**, and the residual should not be re-litigated on the strength of the gap still being
open. ⚠️ The second half stands: if the guard itself is ever changed, the residual re-raises
regardless of this brief.

⚠️ **The gap was discharged BY HAND once already, and that is exactly the problem.** `0379`'s plan
named this check as its Verification step 2, and the build worker ran it manually and recorded the
result in that task's `worklog.md`. A hand-run check protects the day it is run and nothing after
it. This brief converts it into a standing assertion.

### The seam already exists — this needs no new harness work

`test/harness.mjs` already provides everything the assertion needs: `makeProject({ fresh: true })`
builds an uninitiated project under `os.tmpdir()`, and the argv-recording `claude` stub makes both
the invocation **count** and each invocation's **full argv** assertable. `0379` extended that stub
to write one argv file per invocation, which is what makes "exactly one session was opened" a
checkable claim rather than an inference. ⭐ Nothing about this task requires touching the harness.

## What to build

**One regression assertion**, added to `test/launcher-contract.test.js` beside the existing
fresh-tree group:

- Build a fresh project — `makeProject({ fresh: true })`, matching how the four existing fresh-tree
  assertions build theirs.
- Invoke the launcher with an **explicit role**: `runFkit(['coder'])`.
- Assert **exactly one** invocation — the cold start's producer→lead hand-off must not have fired at
  all.
- Assert that one invocation's agent is **`fkit-coder`** — the owner got the session they asked for.
  Follow whatever argv/settings shape the neighbouring assertions already assert, rather than
  inventing a narrower or wider one.

**Optionally — and recommended — promote it to a standing gate:** add a `test/prove-red.sh` mutation
that deletes the `[ -z "$role" ]` conjunct from the guard and asserts the new assertion goes RED.
`0379` added mutation 31 for its own hand-off assertion, so the pattern to copy is immediately
adjacent.

⚠️ **Scope fence.** This task adds test coverage. ⛔ **The launcher's behaviour is correct and must
not change** — if the new assertion fails against the shipped launcher, that is a finding to surface
to the owner, not a licence to edit `claude/fkit-claude.sh`.

⛔ **`claude/fkit-claude.sh` is a shipped surface** — edit the canonical file under `claude/`, never
the gitignored `.claude/` mirror. This task should not need to touch it at all; if it does, stop and
surface that.

## Verification steps

1. **The new assertion passes against the shipped launcher.** Run the launcher-contract suite and
   record the pass count before and after — the count must rise by exactly the number of assertions
   added, with zero failures.
2. **Prove the hole is actually shut.** Build a launcher mutant that deletes the `[ -z "$role" ]`
   conjunct (leaving `[ "$fresh" = 1 ]` alone) and measure that the **new** assertion goes RED
   against it. ⭐ An assertion that stays green under this mutant has not pinned the guard and the
   task is not done.
3. **Prove the new assertion is narrow.** Under that same mutant, the four existing `fresh: true`
   assertions must be **unaffected** — they pass no role, so the deleted conjunct cannot change their
   outcome. Report which assertions redded; if any beyond the new one did, explain why.
4. **No collateral reds.** Run the full unit suite and `bash test/prove-red.sh`; record measured
   counts for both, and the gate's PASS/FAIL line verbatim. If a prove-red mutation was added, its
   own line must read red-as-expected.
5. **The launcher is byte-unchanged**, unless step 1 surfaced a real defect and the owner ruled on
   it. Show the diff surface.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing

- ⭐ **This row was filed onto the unranked Backlog board deliberately.** Sprint 7 is closing and
  this is follow-up work, not sprint scope. ⛔ Per
  [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
  nothing was re-ranked and no existing row was altered; the Backlog board is unranked by design, so
  this brief reads `## Priority` → `Unscheduled` and its board row's Priority cell reads `—`.
- ⚠️ **Filed by a spawned `fkit-producer` with no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  executing the mechanics of a relayed owner ruling and deciding nothing beyond them. **Whether this
  work is worth scheduling at all is the owner's call** — it is filed, not prioritised.
- ⚠️ **Severity is genuinely low, and the brief should not oversell itself.** The guard is correct in
  the shipped launcher today; this task buys protection against a *future* regression, and it buys
  it on a path that only a person walks (an owner typing `fkit coder` on an uninitiated project),
  never CI.
- **Citations here follow the durable-anchor convention:** references into coordination files under
  `ai-agents/` are anchored by heading and quoted fragment rather than `path:NNN`, because an open
  task's `.md` files are inside `test/coordination-citation-policy.test.js`'s scanned set. ⭐
  Source-file coordinates (`claude/fkit-claude.sh:606`, `test/launcher-contract.test.js:311`) are
  explicitly **not** flagged by that guard and are used deliberately.
