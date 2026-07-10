# fkit

**Layer**: shared
**Key files**: `ai-agents/knowledge-base/PROJECT.md`, `ai-agents/knowledge-base/architecture.md`, `install.sh`, `omnigent/fkit-init.sh`, `omnigent/vendor-agents.sh`, `omnigent/validate-bundles.sh`

## Summary
fkit is a distributable Omnigent-based team of AI agents for software development. This repository is the framework itself, not a running application: it ships agent bundles, install/orchestration scripts, and the wiki-backed project state that describes how the team should behave.

## Architecture
The core runtime unit is an agent bundle: `config.yaml` plus a scoped `skills/` directory. Omnigent launches each bundle on a declared harness/model, and fkit splits its shipped roles across producer, coder, reviewer, adversarial reviewer, architect, wiki librarian, and the root `fkit-team` orchestrator.

Startup is file-driven. `install.sh` installs the global launcher, `fkit` bootstraps or resumes the durable team session, and `omnigent/fkit-init.sh` scaffolds the `ai-agents/` tree, writes the root context files, vendors the canonical bundles into `.fkit/agents/`, and prepares the per-project launch scripts.

The normal runtime path now centers on `fkit-team`: it resumes or creates one durable root session, then spawns the other six agents as named standby children. A secondary direct path still exists for launching a single agent without the team root, but it is no longer the primary entry point.

Collaboration between agents uses spawn plus inbox reads. The producer consults the architect and wiki during initiation, and all non-wiki roles reach wiki knowledge only through `fkit-wiki`. Project state is file-based, with `ai-agents/knowledge-base/PROJECT.md` holding the prose brief, `ai-agents/knowledge-base/architecture.md` holding the detailed system survey, `ai-agents/knowledge-base/decisions/` holding ADRs, and `ai-agents/tasks/`, `ai-agents/sprints/`, and `ai-agents/reviews/` holding the task workflow.

## Gotchas / Known Issues
- Role boundaries are prompt-enforced, not sandboxed.
- `fkit` performs a throttled self-update check against GitHub unless disabled.
- `package.json` is intentionally metadata-only for now, so `npx fkit` is not a working installer yet.
- The startup consult chain is verified for the interactive one-hop and two-hop paths, but deeper fully headless multi-hop chains remain an open runtime caveat.
- Ad hoc consult spawns now use fixed role-based titles via [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]; the old per-topic pattern is still documented in the sprint material for context.
- Disconnected subagent runners have a stopgap recovery path in [[systems/subagent-runner-connectivity]]; the underlying child-visibility and non-TTY crash bugs remain upstream.
- There is no application build step or broad automated test suite; the main pre-flight check is `omnigent/validate-bundles.sh`.
- The historical pre-Omnigent design documents are archived under `ai-agents/knowledge-base/history/` and should not be read as current architecture.

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/fix-claude-agents-md-placeholder-text]]
- [[tasks/build-fkit-reconnect-tooling]]
- [[decisions/adr-001-package-json-stays-metadata-only]]
- [[decisions/adr-002-archive-pre-omnigent-design-docs]]
- [[decisions/adr-003-ci-runs-validate-bundles]]
- [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]
- [[systems/subagent-runner-connectivity]]
