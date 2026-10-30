# Model-agnostic transformation — planning workspace

Status: implementation paused at the owner's request. **For a fresh session, start with [HANDOFF.md](HANDOFF.md).** This temporary folder contains the transformation plan and evidence. It is not an official sprint board. No existing ADR is silently rewritten by these notes; the owner's local Codex and single-model-review direction governs this experiment.

Goal: enable a project-wide default model and per-role overrides, starting with a useful Codex-based team and an extension path for other runtimes and models. Preserve the team workflow and state its guarantees honestly on each runtime.

## Owner direction

- The first milestone must run the full team without Claude installed. Codex is the initial focus.
- Keep a distinct adversarial reviewer role even when only one model is available. Run it with the available model; tell users that a second model is preferable. Exact report wording and the meaning of a complete review still need design.
- Start with locally installed CLIs and their existing authentication. Direct provider APIs are a future expansion, not a first-milestone requirement.
- Stage 1 targets Codex-only operation locally on the owner's machine; stage 2 restores or establishes compatibility for both Claude and Codex setups. Protect other users from disruption during the local stage. This does not authorize weakening existing published behavior silently.
- Investigate the strongest practical equivalents to Claude's role boundaries; bring material limitations and tradeoffs back to the owner instead of presuming prompt-only parity.

## Starting observations

- The launcher invokes Claude Code with a role-specific agent and generated hook settings (`claude/fkit-claude.sh`). Project initialization refreshes Claude-specific agents and skills (`claude/fkit-claude-init.sh`). The installer also assumes that layout (`install.sh`).
- Role ownership is enforced through Claude Code hooks, while some consultation constraints remain instructions. A different runtime needs its own capability and enforcement assessment, not just translated prompts. See `ai-agents/knowledge-base/architecture.md` and ADRs 010, 018 and 031.
- First-run product onboarding is a producer-led skill (`claude/skills/fkit-initiate-project/SKILL.md`); launcher setup precedes starting that session. Model selection may therefore need a bootstrap step before the existing interview.
- Review calls `codex exec` directly and flags an unusable second pass as incomplete (`claude/skills/fkit-review/SKILL.md`). A Codex-first team changes the assumptions behind model diversity and independence; an explicit owner decision is needed.
- ADR-009 describes the currently accepted runtime architecture; later decisions amended parts of it. Any replacement needs an explicit decision and careful migration, not silent edits to historical decisions.
- Wiki watermark: `185ac5e07e918c089ed3afd23496587315342000`; five subsequent commits touched non-wiki `ai-agents/` content at discovery time. Treat wiki descriptions as leads and verify source.

## Start here

- [Implementation progress](progress.md) — current code, verification and remaining work. Local entry point: `npm run codex -- --help`.

- [Proposed plan and 16 dependency-ordered tasks](plan.md) — recommended direction, task scope, acceptance criteria and local/compatibility stages.
- [Settings and onboarding proposal](settings-and-onboarding.md) — inheritance, first-run setup, reconfiguration and review labels.
- [Runtime evidence](runtime-investigation.md) — documented capabilities, successful CLI and hook-denial probes, and unverified limits.
- [Contract inventory](contract-inventory.md) and [skill port map](skill-port-map.md) — source pointers and all 28 procedures.
- [Validation proposal](validation.md) — milestone checks, evidence and test-policy constraints.
- [Design alternatives](design-options.md) — options considered. [Candidate stages](candidate-stages.md) is the earlier coarse breakdown; `plan.md` is the current task proposal.

## Research scope

The following areas informed the plan. Runtime and end-to-end validation are deliberately explicit feasibility tasks; this planning package does not claim the migration already works.

1. Inventory launcher, install/update, scaffolding, role definitions, skills, hooks, consultation and review; map runtime-specific assumptions and existing tests.
2. Define first-release user journeys and compatibility: fresh and existing projects, interactive and noninteractive use, upgrades, missing dependencies, and offline operation.
3. Research Codex capabilities and versions empirically and against current official documentation: role instruction delivery, interactive sessions, delegation, model selection, sandbox and approval controls. Record proof and gaps; do not assume parity with Claude.
4. Define runtime adapter and capability contract; distinguish provider, runtime, model and role. Specify how unsupported guarantees are surfaced or block a workflow.
5. Design project settings, default and per-role inheritance, validation, model discovery, secrets handling, override precedence, and changes after onboarding. Decide whether settings are tracked or local.
6. Design bootstrap and onboarding, including existing projects and safe defaults. Preserve user-owned files and current launch convergence rules.
7. Design role/skill delivery and orchestration for Codex, including owner questions, fresh contexts, tool boundaries and producer-only movers; identify which constraints are structural versus advisory.
8. Redesign adversarial review selection, isolation and honest degradation for each combination of primary and second-opinion runtime/model.
9. Define adapter conformance and end-to-end tests, including mocks versus live-provider checks, costs, and Claude testing limitations. Preserve existing supported behavior.
10. Plan incremental implementation, release, documentation, upgrade/rollback and explicit ADR changes. Produce small dependency-ordered tasks with acceptance criteria after the decisions above.

## Decisions to settle before implementation

- How should a single-model review's status and disclosure read? What counts as a different model for diversity?
- Which role guarantees are mandatory before a runtime can be called supported? Answer after the capability investigation; surface material tradeoffs to the owner.
- Confirm the proposed local entry point and ignored project model-settings file; stage 2 will decide shared defaults and public runtime selection.
- Accept the proposed review status change: usable same-model second pass is supported and disclosed; a failed second pass remains partial.
- Approve concrete new test files only when proposed under ADR-057. Minimum CLI version and any enforcement limitation follow feasibility evidence.

## Delivery boundary

The active goal now includes implementation. Detailed runtime probes, complete end-to-end validation, official ADR recording and formal task/board creation are tracked separately from the local code. Do not treat a planning artifact or a successful smoke check as completion of the migration.
