# fkit

**An agent team for software projects** — a producer, a coder, a reviewer (with an adversarial
second opinion from a *different model*), an architect, a wiki librarian, and a team room. Each is a
**role-locked session**: it sees only its own procedures and its own tools, so the coder *cannot*
review its own code, and the wiki has a single writer.

fkit runs on **Claude Code + Codex**, and operates on a shared `ai-agents/` working structure inside
your project — sprints, task briefs, review ledgers, a knowledge base, and a wiki.

## Install & run

```bash
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh   # once

cd /path/to/your/project
fkit            # pick a role from the menu
fkit coder      # …or go straight to one
```

**Requires:** [Claude Code](https://claude.com/claude-code) and
[Codex](https://github.com/openai/codex) (`npm install -g @openai/codex && codex login`). Codex is
what makes the reviewer's second opinion genuinely independent — without it, reviews still run but
are **loudly flagged as not model-diverse**. `fkit` warns at launch if either is missing.

`fkit` sets the project up if needed (scaffolds `ai-agents/`, drops `CLAUDE.md`/`AGENTS.md`, installs
the agents and skills into `.claude/`, runs a short terminal intake on a fresh project), then opens
the role you picked **in the same tab**. On a brand-new project it goes straight to the producer to
run `/fkit-initiate-project`. Want two roles at once? Open another terminal tab.

**Staying current:** a normal launch does a throttled check and **tells you** when a newer version is
out — it never updates itself behind your back. Run `fkit update` when you want it. (Silence it with
`FKIT_NO_UPDATE_CHECK=1`.) A checkout of this repo is never auto-checked — update it with `git`.

## The team

| Agent | Role |
|---|---|
| **fkit-producer** | product / sprint planning, task briefs, task lifecycle |
| **fkit-coder** | implementation — the **sole** source-write authority |
| **fkit-reviewer** | code review — its own pass **plus** a Codex second opinion |
| **fkit-adversarial-reviewer** | the hostile pass — runs on Codex, a *different* model, on purpose |
| **fkit-architect** | architecture, design specs, ADRs, feasibility |
| **fkit-wiki** | the project wiki — the **exclusive** gateway for writes (reads are direct, via `/fkit-query`) |
| **fkit-lead** | the team room — routing help and wiki questions; does no work itself |

**Sessions are role-locked.** `fkit <role>` pins the session to that role's system prompt, tool
allowlist, and **only its own `/fkit-*` skills** — every other fkit skill is turned off: invisible and
unrunnable, not merely discouraged. That is what makes reviewer independence a fact rather than a
promise.

Inside a session, `@fkit-<role> <question>` consults another role and brings the answer back (up to
two hops, never a cycle). Note that a **consult** inherits the calling session's skill settings, so
there the role boundary is advisory rather than enforced — see
[ADR-012](ai-agents/knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md).

Full topology and the skill-ownership table: [`claude/README.md`](./claude/README.md).

## Standing up a new project by hand

`fkit` does this for you. If you'd rather do it manually: the agents operate on an `ai-agents/`
working structure plus project-root `CLAUDE.md` / `AGENTS.md`. A starter for all of it ships in
[`claude/scaffold/`](./claude/scaffold/) — copy `claude/scaffold/ai-agents/` and the `CLAUDE.md` /
`AGENTS.md` into your project root, then fill in the placeholders. A project that already has an
`ai-agents/` tree + context files needs nothing from the scaffold.

## Layout

```
install.sh                       curl|sh entry point — installs the global `fkit` command
VERSION                          fkit's own version (bumped by `npm run release`)
claude/
  README.md                      the runtime, in detail (topology + skill lockdown)
  fkit-claude.sh                 the `fkit` command: role menu, role-locked launch, self-update
  fkit-claude-init.sh            idempotent per-project setup (scaffold + context files + agents/skills)
  agents/                        the seven roles as Claude Code subagent definitions (an 8th, a tester, is authorized — ADR-028 — but not yet built)
  skills/                        the /fkit-* procedures
  scaffold/                      starter ai-agents/ tree + CLAUDE.md / AGENTS.md
ai-agents/                       fkit's own working structure (it is run on itself)
```

## History

fkit originally shipped a second runtime on [Omnigent](https://omnigent.ai). It was removed in
Sprint 2 — see
[ADR-009](ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md) for
why, and
[ADR-010](ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) for
the role-locked model that replaced its team-session topology.

## License

[MIT](LICENSE) © 2026 Mark Dolbyrev
