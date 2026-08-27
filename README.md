# fkit

**An agent team for software projects** — a producer, a coder, a reviewer (with an adversarial
second opinion from a *different model*), an architect, a wiki librarian, and a lead. Each is a
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

**`fkit update` updates fkit, not your projects.** It refreshes the installed copy and stops there.
(In a checkout of this repo it refuses and points you at `git pull`.) Each project picks up the
new agents and skills the **next time you launch `fkit` in that project** — that launch is what
rewrites its `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/`. A project you updated but
never re-launched in keeps its **old agents and skills, and nothing tells you**. Want the refresh
without opening a session? Run `FKIT_SETUP_ONLY=1 fkit` in the project.

**One thing an update does not repair.** A launch refresh replaces the agents and
skills under `.claude/` — it never rewrites your project's own content under `ai-agents/`. If your
project filed an unsprinted brief before this correction shipped, the header `/fkit-task-brief`
generated into `ai-agents/sprints/backlog.md` says the backlog is excluded from `/fkit-status`
because its filename sits outside a `sprint-*.md` glob. **That sentence is stale prose, not broken
behaviour.** Since
[ADR-041](ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
the active sprint is selected by each plan's resolved **identity**, and the backlog is excluded
because its identity is `Backlog`, which is never eligible — a stronger rule, not a weaker one. Your
board works correctly; only its header sentence is wrong. Correct it by hand if you want it accurate;
nothing depends on it.

A launch also tells you — one stderr line — when your project's `ai-agents/` tree, or its root
`CLAUDE.md` / `AGENTS.md`, diverges from what the installed version ships. (The fkit agents and
skills under `.claude/` are not part of that check: a launch rewrites them outright, so there is
nothing to diverge.) To see the per-file verdicts and repair, run `/fkit-heal` in a
producer session: repair is **in-session, consent-gated, diffs in view, and applies only the exact
list you approve — never silent**, and it never moves, renames, or deletes anything. Divergence
that's deliberate? List the path in `ai-agents/.fkit-accepted-drift` and the launch line goes quiet
(`/fkit-heal` still reports it in full).

## The team

| Agent | Role |
|---|---|
| **fkit-producer** | product / sprint planning, task briefs, task lifecycle |
| **fkit-coder** | implementation — the **sole** source-write authority |
| **fkit-reviewer** | code review — its own pass **plus** a Codex second opinion |
| **fkit-adversarial-reviewer** | the hostile pass — runs on Codex, a *different* model, on purpose |
| **fkit-architect** | architecture, design specs, ADRs, feasibility |
| **fkit-wiki** | the project wiki — the **exclusive** gateway for writes (reads are direct, via `/fkit-query`) |
| **fkit-lead** | routing help and wiki questions; drives the work when you hand it a goal |

**Sessions are role-locked.** `fkit <role>` pins the session to that role's system prompt and **only its
own `/fkit-*` skills** (a `tools:` allowlist too, for the adversarial reviewer alone —
[ADR-022](ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)) — every other fkit skill is denied on invocation:
still visible in the `/` menu, but unrunnable, not merely discouraged (ADR-018 §Decision 5, an
accepted cost). That is what makes reviewer independence a fact rather than a promise.

Inside a session, `@fkit-<role> <question>` consults another role and brings the answer back (up to
two hops, never a cycle). A **consult** is gated the same way: a `PreToolUse` hook checks the spawned
agent's own role on every skill call, at any depth, so the boundary is enforced there too — see
[ADR-018](ai-agents/knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md),
which superseded the "advisory in a consult" half of
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
