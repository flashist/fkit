# Candidate stages and tasks

Earlier coarse breakdown, retained as context. `plan.md` is the current detailed proposal. This is not an approved sprint board. Work remains confined to this planning folder until implementation is explicitly initiated.

## Stage 0 — discovery and decision

1. **Contract inventory.** Map all seven roles, ownership, current workflows, hooks, onboarding, review states, scaffold/update and user-owned file boundaries. Include hard rules and current ADR amendments. Done when each runtime dependency has an owner, source and verification path.
2. **Codex feasibility probes.** Test interactive root role injection, custom subagent role/model inheritance, invocation and skill visibility, hook identity/trust/failure, nested delegation, review sandbox, owner question relay and session isolation. Run in a disposable project; log version and reproducible observations. Distinguish supported, advisory, missing and untested.
3. **Architecture and owner decisions.** Compare native role/subagent features, a controlled dispatcher and separate CLI sessions. Propose the least complex route meeting critical invariants; state loss of enforcement, failure behavior and review independence. Prepare new ADR proposals, without silently changing accepted ADRs.

## Stage 1 — isolated local Codex team

4. **Local entry point and adapter.** Create an opt-in, isolated local launch path that does not replace the published Claude launcher. Handle dependency checks, role selection, setup errors, and interactive/noninteractive invocation. No Claude executable required.
5. **Model configuration.** Define and implement default model plus overrides for all roles, inheritance, validation and a safe editing path. Make configuration location and precedence explicit; never store credentials. Prove configured role choices reach both root sessions and delegated roles.
6. **Role and skill delivery.** Port the seven role instructions and needed skills, preserving one ownership source where practical. Implement the stage-0 chosen controls and clearly disclose any limitations. Verify wiki write exclusivity and producer-only movers according to the accepted enforcement design.
7. **Onboarding.** Bootstrap runtime/model selection before the first producer session, then run project initiation and architect survey without Claude. Test fresh, existing, interrupted, noninteractive and invalid configuration cases; preserve user files.
8. **Review flow.** Start a fresh adversarial reviewer even for one model, distinguish a successful single-model review from missing/failed second pass, and disclose model diversity accurately. Preserve findings verification, ledger and sandbox/coverage reporting; decide precise verdict labels with owner.
9. **Workflow verification.** Exercise lead delegation, coder/producer handoff, review, wiki, and a bounded sprint flow locally. Include negative role/skill checks, hook trust and failures, sandbox and owner-gate checks. Report observed gaps, versions and live-test cost.
10. **Local readiness checkpoint.** Document installation, setup, changing models, limitations and recovery; demonstrate all seven roles and representative end-to-end workflows with Claude unavailable. Obtain owner review before broader rollout.

## Stage 2 — shared Claude and Codex support

11. **Multi-runtime interface.** Introduce shared configuration and adapter contract based on real stage-1 needs; maintain separate runtime-specific enforcement and expose capability differences. Avoid promising arbitrary provider support without an adapter.
12. **Claude compatibility and upgrades.** Restore or preserve existing launch/install/update semantics, safely introduce settings into existing projects, and verify fresh/old configurations. Validate with a real Claude setup when available; otherwise mark the release unverified and arrange external verification.
13. **Release and documentation.** Update live docs, scaffold, installation, tests, applicable decision records and release checks together. Verify no regression for existing users and retain review-diversity disclosure.

## Later

Provider APIs, additional CLI adapters and richer model discovery are future work. The stage-1 design should not hard-code Codex as the only possible backend, but should not build an unused generic provider framework.
