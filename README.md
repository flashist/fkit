# fkit

**An agent team for software projects** — a producer, a coder, a reviewer (with an adversarial
second opinion), an architect, and a wiki librarian, each a role-scoped agent that operates on a
shared `ai-agents/` working structure. It runs in two flavors on the same file contracts:

- **Claude Code native** ([`claude/`](./claude/)) — the team as Claude Code custom subagents +
  `/fkit-*` skills, with your interactive session as the team lead. Launch with `fkit claude`.
- **[Omnigent](https://omnigent.ai)** ([`omnigent/`](./omnigent/)) — the original flavor: each agent
  an Omnigent **bundle** (`config.yaml` + scoped `skills/`), stood up as one durable team session by
  a thin root. Launch with `fkit`.

See [`claude/README.md`](./claude/README.md) and [`omnigent/README.md`](./omnigent/README.md) for
the full write-ups, and ADR-008 for the dual-runtime decision.

## Install & run

One line installs `fkit` as a global command:

```bash
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh   # once

cd /path/to/your/project
fkit claude     # Claude Code flavor — needs Claude Code (claude.com/claude-code)
fkit            # Omnigent flavor    — needs Omnigent (omnigent.ai) + `omnigent setup`
```

`fkit claude` sets the project up if needed (scaffolds `ai-agents/`, drops `CLAUDE.md`/`AGENTS.md`,
copies the agents into `.claude/agents/` and the skills into `.claude/skills/`, runs a quick
terminal intake on a fresh project) and launches Claude Code as the team lead — on a fresh project,
seeded straight into `/fkit-initiate-project`. The adversarial reviewer additionally uses the
`codex` CLI when present, for a genuinely different-model second opinion (the review degrades
loudly to Claude-only without it).

Running plain `fkit` inside a project does the Omnigent equivalent (scaffolds `ai-agents/`, drops
context files, vendors the agent bundles into `.fkit/agents/`, runs the intake) and opens **one
durable, resumable team session**: a `fkit-team` root agent that stands up all six agents below as
named, directly-chattable entries in the web UI's Subagents panel. Come back tomorrow and `fkit`
resumes the exact same workspace instead of piling up new sessions.

`fkit` also keeps itself current: a normal launch does a throttled check and auto-updates when a
newer version is published (toggle with `FKIT_NO_AUTO_UPDATE=1` / `FKIT_NO_UPDATE_CHECK=1`); run
`fkit update` to update on demand. A checkout of this repo itself is never auto-updated — update it
with `git`.

See [`omnigent/README.md`](./omnigent/README.md) for the full detail on all of the above.

## The team

| Agent | Role |
|---|---|
| **fkit-producer** | product / sprint planning, task lifecycle |
| **fkit-coder** | implementation (sole source-write authority) |
| **fkit-reviewer** | code review (lead) |
| **fkit-adversarial-reviewer** | adversarial second opinion — a *different* model (Codex), on purpose |
| **fkit-architect** | architecture, design specs, ADRs |
| **fkit-wiki** | the project wiki — exclusive gateway for **writes**; reads are direct via the `query` skill (ADR-005) |

**Claude Code flavor:** your interactive session is the team lead *and* the coder — interactive
role work (planning, initiation, task lifecycle, design) runs there via `/fkit-*` skills, while
self-contained work (the review passes, the initiation codebase survey, all wiki writes) runs as
subagents from `.claude/agents/`. Full topology in [`claude/README.md`](./claude/README.md).

**Omnigent flavor:** the `fkit-team` root session stands the team up as directly-chattable
sessions; agents delegate to one another by spawning a sibling session and reading the reply from
their inbox. Skills are scoped to their agent. Full topology in
[`omnigent/README.md`](./omnigent/README.md).

## Running one agent directly (Omnigent flavor, without the team session)

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
install.sh                       curl|sh entry point — installs the global `fkit` command (both flavors)
VERSION                          fkit's own version (bumped by `npm run release`)
claude/
  README.md                      the Claude Code flavor, in detail
  fkit-claude.sh                 `fkit claude` — per-project setup + launch Claude Code as team lead
  fkit-claude-init.sh            idempotent per-project setup (scaffold + context files + agents/skills)
  agents/                        the team as Claude Code subagent definitions (.claude/agents/)
  skills/                        the /fkit-* skills (.claude/skills/)
  scaffold/CLAUDE.md             Claude-flavored root context file (team map + shared rules)
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
