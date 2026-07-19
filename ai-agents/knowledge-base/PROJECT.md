# fkit

> The prose project brief for AI agents. Agents read this to understand what this project
> is, who it's for, and how it's built. Keep it current.

## Overview

fkit is a **team of seven role-scoped AI agents for software development** — a producer, a coder, a
reviewer (with an adversarial second opinion), an architect, a wiki librarian, and a team-room lead —
operating on a shared `ai-agents/` working structure inside a consuming project. It runs on **one
runtime: Claude Code native + Codex** (see
[`ADR-009`](decisions/adr-009-claude-code-native-is-the-only-runtime.md)), as custom subagents and
`/fkit-*` skills under `claude/`. This repository *is* the framework: it dogfoods itself (its own
`ai-agents/` tree is the one you're reading right now). It's built for software developers, vibe
coders, and anyone using AI to build software, who want a structured multi-agent workflow instead of
one undifferentiated coding assistant.

## Domain & context

**Problem:** AI coding assistants tend to conflate product decisions, implementation, and review into
one undifferentiated chat loop, with no durable memory of prior decisions and no separation of
authority (the same agent proposes a design, writes the code, and approves it). fkit's answer is a
small **team** of role-scoped agents with distinct authority and skills, coordinating over files in
git rather than a shared runtime state:

- **fkit-producer** (this agent) — product/sprint planning, task lifecycle. No source-write authority.
- **fkit-coder** — sole source-write authority; implements from task briefs.
- **fkit-reviewer** — lead code review (review-only), delegates an adversarial second pass.
- **fkit-adversarial-reviewer** — independent second opinion, deliberately a *different* model
  (Codex, not Claude) for genuine perspective diversity.
- **fkit-architect** — architecture, design specs, ADRs, technical feasibility. No implementation.
- **fkit-wiki** — maintainer of `ai-agents/wiki-vault/`, the synthesized project-knowledge store
  (Karpathy LLM-wiki pattern), and the **exclusive gateway for wiki writes** (ingest/lint/sync). Per
  [`ADR-005`](decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md), every other role
  reads the wiki directly via the one read-only `/fkit-query` procedure — they consult fkit-wiki only
  for writes or deeper multi-step research.
- **fkit-lead** — the team room: routing help and wiki questions. It does no work itself.

**Sessions are role-locked** ([`ADR-010`](decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)):
`fkit <role>` pins a session to that role's prompt and only its own skills — every other `/fkit-*`
skill is turned off. (The per-role *tool* allowlist was relaxed for every role except the adversarial
reviewer — [`ADR-022`](decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md); the skill
lock is unchanged.) Roles consult each other with the Agent tool, synchronously, up
to two hops and never in a cycle. (In a *spawned consult* the skill boundary is advisory rather than
enforced — [`ADR-012`](decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md).)
Coordination state — sprint plans, task briefs, review ledgers, the wiki — lives entirely as files
under `ai-agents/`, versioned in git.

**Who it's for:** software developers, "vibe coders," and anyone using AI to build software who wants
a repeatable, role-separated workflow they can drop into any project.

## Architecture

Not a running application — no build step, no server, no database. The "codebase" is agent
definitions, skills, POSIX shell scaffolding, and Markdown. The team lives in `claude/`: subagent
definitions (`claude/agents/fkit-*.md`) + `/fkit-*` skills (`claude/skills/`), copied into a consuming
project's `.claude/` by `claude/fkit-claude-init.sh`. The launcher `claude/fkit-claude.sh` is the
`fkit` command — it scaffolds the project, generates the per-role `skillOverrides` settings that make
the lockdown real, and execs `claude --agent fkit-<role>`. Model diversity comes from the `codex` CLI:
the reviewer shells out to `codex exec` for an independent adversarial pass, and a Codex-less review is
emitted as a loudly-flagged partial. A consuming project gets fkit via `install.sh` → `fkit` → the
`initiate-project` onboarding turns the placeholder `PROJECT.md` into a real brief.

Full technical detail — component map, runtime topology, data model, build/run/test, cross-cutting
concerns, and identified risks — is in
[`ai-agents/knowledge-base/architecture.md`](./architecture.md) (written by fkit-architect's
`survey-project` skill). Don't duplicate it here; read it for anything below product-brief altitude.

## Conventions & constraints

- **Stage: Prototype.** Near-term goal is a user-friendly startup sequence and a solid working set of
  seven roles with dedicated skills; hardening/polish is the current focus, not breadth.
- **Single runtime: Claude Code native + Codex** (per
  [`ADR-009`](decisions/adr-009-claude-code-native-is-the-only-runtime.md), which **removed** the
  Omnigent flavor and supersedes ADR-008's dual-runtime decision). No second runtime is maintained and
  no third is targeted. **Codex is required**, not optional — it is what makes the reviewer's second
  opinion genuinely model-diverse.
- **Role boundaries: structural in a session, prompt-enforced in a consult.** Per
  [`ADR-010`](decisions/adr-010-role-locked-sessions-and-skill-lockdown.md), a `fkit <role>` session
  is locked by the harness — a `skillOverrides` lockdown that makes every non-owned `/fkit-*` skill
  unrunnable (plus, for the adversarial reviewer alone, a `tools:` wall — the per-role tool allowlist
  was otherwise relaxed,
  [`ADR-022`](decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)). But per
  [`ADR-012`](decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md), a *spawned
  consult* inherits the **caller's** skill settings, so there the boundary is advisory (the `⛔ Owner:`
  banner). Likewise "never commit/push unprompted" and the two-hop consult cap remain prompt rules.
  A known, accepted limit — not a claim to overstate.
- **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials in task briefs, sprint
  plans, PROJECT.md, or the wiki, since all of it goes to git.
- **Task lifecycle discipline**: the producer writes/plans; task files move between `backlog/`,
  `done/`, `cancelled/` only via the `task-done`/`task-cancelled` skills — which, since ADR-025, **any
  role may invoke**, marking an agent-performed close `(agent-closed — not owner-verified)`. That
  relaxation removed the anti-laundering guarantee knowingly; nothing structural replaced it.
- **Consult-chain envelope (corrected during initiation)**: the onboarding/startup sequence is
  **interactive**, not headless — `-p` only seeds the first message, the session stays live for the
  owner to answer questions — and initiation only uses **one-hop** consults (producer→architect,
  producer→wiki), which are verified working. Deep **multi-hop** consultation under a fully headless
  `-p` run (relevant to CI/automation, not onboarding) remains unverified and is a separate, lower
  priority concern — not a blocker for the startup sequence.
- **`package.json` stays, with its `scripts`** (per
  [`ADR-011`](decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md), superseding
  ADR-001). It provides the project's **versioning**, and `bin/release.mjs` is real release tooling —
  version bumping is load-bearing: `fkit`'s self-update compares the installed sha/version against the
  published one. There is still no `bin` field, so `npx fkit` is not an install surface; npm
  publication remains open under a **scoped name** (the bare `fkit` name is taken).
- **Historical pre-Omnigent design docs are archived**, not left at repo root — see
  [`ai-agents/knowledge-base/history/`](./history/README.md).

## Links

- Repo: https://github.com/flashist/fkit
- Architecture detail: [`ai-agents/knowledge-base/architecture.md`](./architecture.md)
- The runtime, in detail (topology + skill lockdown): [`claude/README.md`](../../claude/README.md)
- Historical design research (superseded, kept as record):
  [`ai-agents/knowledge-base/history/`](./history/README.md)
