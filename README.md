# fkit

**An [Omnigent](https://omnigent.ai) agent team for software projects** — a producer, a coder, a
reviewer (with an adversarial second opinion), an architect, and a wiki librarian, each a
scoped-skill agent that operates on a shared `ai-agents/` working structure — plus a thin team root
that stands them all up as one durable, resumable workspace.

fkit is built for [Omnigent](https://omnigent.ai) (Databricks' open-source agent meta-harness): each
agent is an Omnigent **bundle** (`<agent>/config.yaml` + a per-agent `skills/` directory), and
Omnigent runs it on the harness/model it declares (`claude-sdk` or `codex`). Everything lives under
[`omnigent/`](./omnigent/) — see [`omnigent/README.md`](./omnigent/README.md) for the full write-up.

## Install & run

One line installs `fkit` as a global command (like `omnigent` itself):

```bash
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh   # once
cd /path/to/your/project && fkit                                                   # every project, every time
```

You'll also need [Omnigent](https://omnigent.ai) itself, installed separately — run `omnigent setup`
once to configure the providers the agents' harnesses need (Claude for the `claude-sdk` agents,
OpenAI/Codex for the `codex` agents).

Running `fkit` inside a project sets it up if needed (scaffolds `ai-agents/`, drops
`CLAUDE.md`/`AGENTS.md`, vendors the agent bundles into `.fkit/agents/`, runs a quick terminal intake
on a fresh project) and opens **one durable, resumable team session**: a `fkit-team` root agent that
stands up all six agents below as named, directly-chattable entries in the web UI's Subagents panel.
Come back tomorrow and `fkit` resumes the exact same workspace instead of piling up new sessions.

`fkit` also keeps itself current: a normal launch does a throttled check and auto-updates when a
newer version is published (toggle with `FKIT_NO_AUTO_UPDATE=1` / `FKIT_NO_UPDATE_CHECK=1`); run
`fkit update` to update on demand. A checkout of this repo itself is never auto-updated — update it
with `git`.

See [`omnigent/README.md`](./omnigent/README.md) for the full detail on all of the above.

## The team

| Agent | Harness | Role |
|---|---|---|
| **fkit-producer** | claude-sdk | product / sprint planning, task lifecycle |
| **fkit-coder** | claude-sdk | implementation (sole source-write authority) |
| **fkit-reviewer** | claude-sdk | code review (lead) |
| **fkit-adversarial-reviewer** | codex | adversarial second opinion — a *different* model, on purpose |
| **fkit-architect** | claude-sdk | architecture, design specs, ADRs |
| **fkit-wiki** | codex | the project wiki — sole gateway to `ai-agents/wiki-vault/` |

The `fkit-team` root session that `fkit` opens isn't a "doer" like the six above — it just stands the
team up, then gets out of the way; you talk to a teammate directly by clicking it in the Subagents
panel. Agents delegate to one another by spawning a sibling session and reading the reply from their
inbox (every agent reaches the wiki through fkit-wiki; the coder consults the architect; the reviewer
runs the adversarial pass). Skills are **scoped to their agent** — active in a session only while
that agent is. Full topology in [`omnigent/README.md`](./omnigent/README.md).

## Running one agent directly (without the team session)

```bash
# from the root of the project you want the agent to work on
.fkit/run producer
.fkit/run coder
.fkit/run reviewer
.fkit/run architect
.fkit/run wiki
.fkit/run adversarial-reviewer
```

`.fkit/agents/` is a per-project vendored copy of the bundles that `fkit` (or `fkit-init.sh`)
creates — it's also how consulting agents reach each other. Agents run with
`os_env: caller_process, cwd: .`, so launch them from the project root they should operate on.

## Standing up a new project by hand

`fkit` does this for you automatically. If you'd rather do it manually: the agents operate on an
`ai-agents/` working structure and project-root `CLAUDE.md` / `AGENTS.md`. A starter for all of it
ships in [`omnigent/scaffold/`](./omnigent/scaffold/) — copy `omnigent/scaffold/ai-agents/` and the
`CLAUDE.md` / `AGENTS.md` into your project root, then fill in the placeholders. A project that
already has an `ai-agents/` tree + context files needs nothing from the scaffold.

## Layout

```
install.sh                       curl|sh entry point — installs the global `fkit` command
VERSION                          fkit's own version (bumped by `npm run release`)
omnigent/
  README.md                      the agent team, in detail
  fkit.sh                        the installed `fkit` command's logic (self-update + team launch)
  fkit-init.sh                   idempotent per-project setup (scaffold + context files + vendor bundles)
  vendor-agents.sh               copies the bundles into <project>/.fkit/agents/
  validate-bundles.sh            pre-flight bundle validation
  fkit-team/                     root orchestrator — stands up the six agents as one durable session
  fkit-producer/                 each agent = config.yaml + a scoped skills/ dir
  fkit-coder/
  fkit-reviewer/
  fkit-adversarial-reviewer/
  fkit-architect/
  fkit-wiki/
  scaffold/                      starter ai-agents/ structure + CLAUDE.md / AGENTS.md / PROJECT.md
```

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
