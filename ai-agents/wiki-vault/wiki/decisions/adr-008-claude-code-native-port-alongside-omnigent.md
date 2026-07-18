# ADR-008: Claude Code native port, alongside Omnigent

**Date**: 2026-07-11
**Status**: superseded

> ## ⚠️ Read as history, not as current design — but **do not delete it**.
> This is **the record of *why* fkit left Omnigent**, and that is why it is kept.
>
> Superseded by [[decisions/adr-009-claude-code-native-is-the-only-runtime]] (dual-runtime → Claude
> native only) and, for its role-access section, by
> [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] (hat skills → role-locked sessions).
>
> Its **context**, its **argument for tool-allowlist enforcement**, and its **`ai-agents/`
> portability-layer reasoning** all remain sound and load-bearing.

## Context
fkit's hard constraint since initiation was **Omnigent-only**. In practice Omnigent's orchestration proved unreliable for the owner: sub-sub-agents failing to reply back to their spawners, sessions failing, agent connections dropping — the exact failure classes the reconnect/restart tooling was built to patch around (see [[systems/subagent-runner-connectivity]]). Running through Omnigent also hid Claude Code's native statusbar.

Meanwhile Claude Code natively provided the primitives the team actually needs: custom subagents with **per-agent tool allowlists** and system prompts, skills, and a stable, resumable interactive session. Its experimental "agent teams" peer mode was evaluated and **rejected for v1** (experimental flag, teammate resume broken, no nesting, Claude-only teammates).

## Decision
Port the team to **Claude Code native**, living **alongside** Omnigent as a peer top-level directory `claude/`. *"No flavor is deleted until the native port proves itself."*

The shared, runtime-agnostic **`ai-agents/` file contracts are the portability layer** — both flavors operate on the same tree. Key shape decisions:

- **Subagents-first; no root agent.** Claude Code owns session lifecycle.
- **The reviewer runs as a subagent.** *Independence from the coder-tainted context is the point of the role.*
- **Model diversity survives via the `codex` CLI.** Degradation is mandatory and loud.
- **Tool allowlists add structural enforcement** on top of prompt rules — the adversarial reviewer gets no Write/Edit at all.
- **One `fkit-query` skill replaces the vendored copies.** Reads stay decentralized with zero distribution machinery.

## Consequences
- **Hand-mirroring across two flavors was accepted as the cost — and it did not happen.** The 2026-07-11 doc-drift audit found the Omnigent side pervasively stale. **The dual-flavor tax was real and was not being paid.** That is what ADR-009 acted on.
- **ADR-008 conceded its own central weakness**: reviewer independence *"is a property of a fresh context, not of the prompt."* Its "hat skills" model — a lead session adopting a role — was prompt-enforced, so the session that had just written the code could still run the reviewer's procedures. ADR-010 made that structural instead. **The mechanism simply wasn't known when ADR-008 was written**, so it settled for hats.
- The `ai-agents/` portability layer proved its worth: when Omnigent was deleted, **the coordination state survived untouched.**

## Related
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[systems/fkit]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[systems/role-locked-sessions]]
- [[systems/review-and-model-diversity]]
- [[systems/subagent-runner-connectivity]]
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — amends this ADR's tool-allowlist half
