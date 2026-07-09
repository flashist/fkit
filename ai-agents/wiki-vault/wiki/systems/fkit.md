# fkit

**Layer**: shared
**Key files**: `ai-agents/knowledge-base/PROJECT.md`, `ai-agents/knowledge-base/architecture.md`, `install.sh`, `omnigent/fkit-init.sh`, `omnigent/vendor-agents.sh`, `omnigent/validate-bundles.sh`

## Summary
fkit is a distributable Omnigent-based team of AI agents for software development. This repository is the framework itself, not a running application: its durable state lives in `ai-agents/` files and git history, and the project dogfoods that structure in its own workspace.

## Architecture
The core unit is an agent bundle: `config.yaml` plus a scoped `skills/` directory. Each bundle is launched by the external Omnigent CLI on a declared harness and model provider, with the six shipped roles split across producer, coder, reviewer, adversarial reviewer, architect, and wiki librarian.

Startup is file-driven. `install.sh` fetches the repo and hands off to `omnigent/fkit-init.sh`, which scaffolds the `ai-agents/` tree, writes the root context files, vendors the canonical bundles into `.fkit/agents/`, and creates the launch script used for the interactive startup flow.

During normal operation, agents coordinate by spawning sibling sessions and reading replies from their inboxes. The producer consults the architect and the wiki during initiation, while every non-wiki agent reaches wiki knowledge only by consulting `fkit-wiki`.

Project state is also file-based:
- `ai-agents/knowledge-base/PROJECT.md` holds the prose project brief.
- `ai-agents/knowledge-base/architecture.md` holds the detailed system survey.
- `ai-agents/knowledge-base/decisions/` records ADRs.
- `ai-agents/tasks/`, `ai-agents/sprints/`, and `ai-agents/reviews/` hold the task and review workflow.
- `ai-agents/wiki-vault/` stores synthesized knowledge for future lookups.

## Gotchas / Known Issues
- Role boundaries are prompt-enforced, not sandboxed; the current safety model depends on shared guardrails and agent discipline.
- `package.json` is intentionally metadata-only for now, so `npx fkit` does not provide a working installer yet.
- The startup consult chain is verified for the interactive one-hop path used during initiation, but deeper fully headless multi-hop chains remain an open runtime caveat.
- The historical pre-Omnigent design documents are archived under `ai-agents/knowledge-base/history/` and should not be read as current architecture.
- There is no application build step or broad automated test suite; the main pre-flight check is `omnigent/validate-bundles.sh`.

## Related
- [[decisions/adr-001-package-json-stays-metadata-only]]
- [[decisions/adr-002-archive-pre-omnigent-design-docs]]
- [[decisions/adr-003-ci-runs-validate-bundles]]
