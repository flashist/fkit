---
name: fkit-team
description: Explain the native OpenCode FKit team and route work to its owner.
---

FKit has seven native OpenCode agents:

| Agent | Owns |
|---|---|
| fkit-lead | orchestration, owner decisions, sprint ship loop |
| fkit-producer | briefs, onboarding, task/sprint movers, status, heal |
| fkit-coder | source implementation, planning, processing review, task ship loop |
| fkit-reviewer | independent review and review ledgers |
| fkit-adversarial-reviewer | read-only hostile second opinion, no children |
| fkit-architect | surveys, design specs, ADRs, technical evaluation |
| fkit-wiki | wiki ingest/lint/sync, sole vault writer, no children |

Use the subagent tool to delegate bounded work to a named role. Each child uses its own native
permissions and fresh context. Use skill to load a procedure, or /fkit-* commands to route to its
owner. An owned command runs in the current session; a cross-role command delegates through
the native subagent tool without switching the current role. The primary handles questions; children return NEEDS-DECISION and wait for a new bounded
assignment carrying the answer. Preserve the declared approval marker before implementing.
Skill ownership comes from claude/skills-for-role.sh and is rendered into native permissions.
Shell commands require OpenCode approval; edit permissions alone are not an OS sandbox.
Model diversity requires an explicitly selected, actually distinct second model. An inherited or
unknown hostile model yields a prominently flagged partial review and cannot auto-close work.
Never commit or push without an explicit owner request. End with What's next?
