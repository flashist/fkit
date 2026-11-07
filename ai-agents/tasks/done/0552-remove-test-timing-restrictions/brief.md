# Remove test timing restrictions

## ID
0552

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Owner ruling — 2026-11-04, root interactive `fkit_roles.fkit_ask_owner` typed comment, recorded 11:19:31 UTC, relayed verbatim by `fkit-lead`:**

> Remove any time-restrictions or idle-only restrictions for running tests. We spend more time on those things than on work itself.

**Goal:** contributors and CI run the required checks without waiting for an idle machine or judging a completed passing check by aggregate elapsed time. Required assertions continue to determine success.

This is a product change: repository policy and CI acceptance behavior change together. Current `CONTRIBUTING.md` and ADR-057 D10 require an idle-Mac two-minute default suite; the test workflow rejects completed green runs over 120 seconds and imposes a 10-minute job cap; prove-red has a 15-minute job cap. The owner ruling supersedes these aggregate timing/idle restrictions. Preserve historical decisions and measurements while stating current-rule precedence explicitly.

The reviewed six-file plan already resolves scope and feasibility. Architect and producer approved its final scope; the fresh adversarial pass found no significant issue. These were source-inspection/reasoning reviews, not test or hosted-workflow execution. Reported tool model for all passes: `gpt-6.1-sol`; exact serving identity/diversity was not established. Both passes used the same model. A different model is recommended for a broader second opinion. No fresh review is required merely to file this unchanged brief.

This standalone owner-requested immediate policy cleanup is filed unranked on the Backlog board, outside Sprint 15. Filing satisfies the producer-brief prerequisite in CONTRIBUTING; it does not approve the concrete implementation plan, waive lifecycle requirements, or claim source implementation. Root lead must obtain actual owner plan approval before source writes. The no-source-write planning gate is instruction-enforced, not a claimed runtime wall.

## What to build

Deliver one coherent policy/enforcement/documentation change, limited to the six source files in the reviewed plan:

1. **`CONTRIBUTING.md`: remove aggregate timing and idle-only gates.** Remove budget annotations, 120-second CI rejection language, comparisons against the budget, and the growth-stop budget clause. Retain dated measured durations as observations, per-new-test/case owner approval, test scope/key list, mapped-check table and prove-red schedules. State that mapped checks run without waiting for an idle machine or quiet window; elapsed time and machine load alone cannot block, force reruns, or reject a completed passing check. Explicitly supersede ADR-057 D10's timing/idle rule and inherited aggregate suite-duration, idle-only and no-suite-slowdown acceptance clauses in existing task briefs, sprint instructions and historical migration inventories. Retain functional performance/termination assertions and all remaining requirements. Describe CI as directly running the suite on every push/PR.
2. **`.github/workflows/test.yml`: remove timing enforcement.** Replace the timed shell wrapper, budget environment/name and associated commentary with a direct `npm test` step; remove the repository-controlled 10-minute job cap. Preserve triggers, permissions, Node 24, full clone and nonzero assertion-failure propagation.
3. **`.github/workflows/prove-red.yml`: remove the repository-controlled 15-minute job cap, runtime-multiplier comment and two-minute-budget header clause.** Preserve nightly/manual triggers, command, checkout and permissions.
4. **`RELEASING.md`: describe direct test-result failure semantics instead of the 120-second budget/job-timeout account.** Replace stale line-range workflow citations with filename/step references. Preserve release sequencing and manual override behavior. Explain that service execution limits still apply; removing repository caps does not promise unlimited GitHub execution.
5. **`ai-agents/knowledge-base/architecture.md` §9.1:** replace the present-tense 120-second CI rule with assertion-result gating and a link to current CONTRIBUTING policy. This is live-only; no scaffold counterpart or unrelated inventory repair.
6. **`CHANGELOG.md` Unreleased:** add one concise entry covering removal of test runtime budgets, idle-machine gates and repository CI job caps, without claiming removal of host/OS limits.

**Acceptance:** policy and both workflows agree; a completed required check may pass above 120 seconds and under machine load if its assertions pass. A failed assertion still fails; a killed/incomplete check remains unverified. Machine load or elapsed time alone never requires rerunning a completed passing check. Keep real failure/race diagnosis available.

**Boundaries:** preserve functional deadlines, per-process harness timeouts and product termination contracts, including `FKIT_NET_TIMEOUT`, board CLI timeouts and deadline/kill assertions. Preserve consult/worker/model-configuration deadlines, no-progress/hop limits and external execution constraints. Change no test files and add no tests, performance assertions or prove-red cases. Do not rewrite ADRs, past approvals, measurements, initial contract inventories or existing briefs/boards to erase history; current-policy precedence addresses inherited obsolete clauses. No idle precheck, quiet-window wait, benchmark or repeated timing run.

## Verification steps

1. After actual owner approval and implementation, read back all six edited passages and both workflow commands. Check YAML nesting, failure propagation, retained triggers/permissions/Node/full-clone configuration, release behavior, current-rule precedence and resolved local links. Perform scoped residual searches and classify functional and historical timing references rather than replacing them blindly. Check whitespace.
2. Run `npm test` once under CONTRIBUTING's affected-path map: `.github/` and architecture fall under “Anything else.” Apply the explicit owner ruling: no idle prerequisite or elapsed-time acceptance gate. Record the actual assertion result and any skips/failures; do not count an interrupted run as passing. No full suite is needed for the pre-implementation plan/brief-filing step.
3. Do not substitute `test:docs` for the mapped full suite. Skip `test:release` because `bin/release.mjs` is unchanged and no release is being performed; skip prove-red because no source/test it mutates or executes changes; skip manifest generation because scaffold is unchanged. Report those reasons. Root prose alone has no automated content check.
4. Obtain independent implementation review through the reviewer route after authorized implementation. Report actual per-pass execution coverage/model limits. Local readback and `npm test` do not establish Ubuntu GitHub workflow execution; retain that unverified limit until a real hosted run is observed.
5. Confirm no Sprint 15 membership, ranks, statuses, order or dependency declarations changed; 0537 remains next after 0540. No open task gains a dependency or wait on this cleanup. Arrange current-policy/historical-D10 wiki followup through `fkit-wiki` after policy lands; no other role writes the vault.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- One shippable unit: policy, active CI enforcement and current documentation must agree. Splitting would leave contradictory runtime acceptance rules; wiki synchronization is a followup owned by the wiki role, not an additional implementation surface here.
- **Reviewed final plan:** [full plan and review record](/Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/test-timing-policy-20261104/final-plan-and-review.md). Full path: `/Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/test-timing-policy-20261104/final-plan-and-review.md`.
- **Review evidence:** [review-record-final.json](/Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/test-timing-policy-20261104/review-record-final.json). These are ignored scratch references, not a persisted owner-approved `plan.md`. Transfer the unchanged draft/review record to this task only after actual root owner approval under the driver procedure.
- **Authority limits:** the quoted ruling authorizes this requested policy cleanup/brief, not source writes or commit. No lifecycle waiver; no install, commit, push, publication or terminal move. Preserve 0540's current review/worklog and all other task records.
- **Placement:** Backlog, Unscheduled; no sprint rank or new dependency links. No open task gains a wait; Sprint 15 stays 0540 → 0537 → 0520 → 0548. This filing does not reorder the sprint or displace 0537 as next after 0540.
- **Grounding:** wiki `systems/testing-and-verification` and `decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only` still teach the old D10 rule. Current source inspection and the dated owner ruling govern this scoped supersession. Wiki followup remains necessary after implementation.
