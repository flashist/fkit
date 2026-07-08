# fkit

**An [Omnigent](https://omnigent.ai) agent team for software projects** — a producer, a coder, a
reviewer (with an adversarial second opinion), an architect, and a wiki librarian, each a
scoped-skill agent that operates on a shared `ai-agents/` working structure.

fkit is built for [Omnigent](https://omnigent.ai) (Databricks' open-source agent meta-harness): each
agent is an Omnigent **bundle** (`<agent>/config.yaml` + a per-agent `skills/` directory), and
Omnigent runs it on the harness/model it declares (`claude-sdk` or `codex`). Everything lives under
[`omnigent/`](./omnigent/) — see [`omnigent/README.md`](./omnigent/README.md) for the full write-up.

## The team

| Agent | Harness | Role |
|---|---|---|
| **fkit-producer** | claude-sdk | product / sprint planning, task lifecycle |
| **fkit-coder** | claude-sdk | implementation (sole source-write authority) |
| **fkit-reviewer** | claude-sdk | code review (lead) |
| **fkit-adversarial-reviewer** | codex | adversarial second opinion — a *different* model, on purpose |
| **fkit-architect** | claude-sdk | architecture, design specs, ADRs |
| **fkit-wiki** | codex | the project wiki — sole gateway to `ai-agents/wiki-vault/` |

Agents delegate to one another via Omnigent sub-agent tools (every agent reaches the wiki through
fkit-wiki; the coder consults the architect; the reviewer runs the adversarial pass). Skills are
**scoped to their agent** — active in a session only while that agent is. Full topology in
[`omnigent/README.md`](./omnigent/README.md).

## Requirements

[Omnigent](https://omnigent.ai), set up with the providers the agents' harnesses need — Claude for
the `claude-sdk` agents and OpenAI/Codex for the `codex` agents. Run `omnigent setup` once to
configure providers.

## Running an agent

```bash
# from the root of the project you want the agent to work on
omnigent run omnigent/fkit-producer
omnigent run omnigent/fkit-coder
omnigent run omnigent/fkit-reviewer
omnigent run omnigent/fkit-architect
omnigent run omnigent/fkit-wiki
omnigent run omnigent/fkit-adversarial-reviewer -p "adversarially review the current diff"
```

Agents run with `os_env: caller_process, cwd: .`, so launch them from the project root they should
operate on.

## Standing up a new project

The agents operate on an `ai-agents/` working structure and project-root `CLAUDE.md` / `AGENTS.md`.
A starter for all of it ships in [`omnigent/scaffold/`](./omnigent/scaffold/): copy
`omnigent/scaffold/ai-agents/` and the `CLAUDE.md` / `AGENTS.md` into your project root, then fill in
the placeholders. A project that already has an `ai-agents/` tree + context files needs nothing from
the scaffold.

## Layout

```
omnigent/
  README.md                     the agent team, in detail
  fkit-producer/                each agent = config.yaml + a scoped skills/ dir
  fkit-coder/
  fkit-reviewer/
  fkit-adversarial-reviewer/
  fkit-architect/
  fkit-wiki/
  scaffold/                     starter ai-agents/ structure + CLAUDE.md / AGENTS.md / PROJECT.md
```

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
