# fkit

> The prose project brief for AI agents. Agents read this to understand what this project
> is, who it's for, and how it's built. Keep it current.

## Overview

fkit is an [Omnigent](https://omnigent.ai)-based **team of AI agents for software development** — a
producer, a coder, a reviewer (with an adversarial second opinion), an architect, and a wiki
librarian — each a scoped-skill Omnigent bundle that operates on a shared `ai-agents/` working
structure inside a consuming project. This repository *is* the framework: it dogfoods itself (its own
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
  [`ADR-005`](decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md), every other agent
  carries its own vendored copy of the `query` skill and reads the wiki directly, in-process — they
  only consult fkit-wiki for writes or deeper multi-step research.

Agents consult each other by spawning a sibling Omnigent session and reading the reply from their
inbox (Omnigent has no native cross-bundle sub-agent tool yet). Coordination state — sprint plans,
task briefs, review ledgers, the wiki — lives entirely as files under `ai-agents/`, versioned in git.

**Who it's for:** software developers, "vibe coders," and anyone using AI to build software who wants
a repeatable, role-separated workflow they can drop into any project.

## Architecture

Not a running application — no build step, no server, no database. The "codebase" is agent bundles
(`omnigent/fkit-*/config.yaml` + a scoped `skills/` directory each), POSIX shell scaffolding
(`install.sh`, `omnigent/fkit-init.sh`, `vendor-agents.sh`, `validate-bundles.sh`), and Markdown. The
external **Omnigent** CLI is the only runtime dependency; it loads a bundle and runs it on the harness
it declares — `claude-sdk` (Claude) for four agents, `codex` (OpenAI/Codex) for two (wiki,
adversarial-reviewer). A consuming project gets fkit via `install.sh` → scaffolds its `ai-agents/`
tree → vendors the six bundles to its own `.fkit/agents/` (required because Omnigent's
`sys_session_create` can't reference paths outside the caller's cwd) → the producer's
`initiate-project` skill (this run) turns the placeholder `PROJECT.md` into a real brief.

Full technical detail — component map, runtime topology, data model, build/run/test, cross-cutting
concerns, and identified risks — is in
[`ai-agents/knowledge-base/architecture.md`](./architecture.md) (written by fkit-architect's
`survey-project` skill). Don't duplicate it here; read it for anything below product-brief altitude.

## Conventions & constraints

- **Stage: Prototype.** Near-term goal is a user-friendly startup sequence and a first working set of
  agents with dedicated skills (six bundles already exist; hardening/polish is the current focus, not
  breadth).
- **Omnigent-only, for now.** Hard constraint for this stage: no other meta-harness/runtime is being
  targeted or supported. Don't design around portability to a different agent runtime yet.
- **Role boundaries are prompt-enforced, not sandboxed** (all agents run `sandbox: none`). "Never
  commit/push unprompted," "review-only," "wiki-writes-only" etc. are hard prompt rules backstopped
  only by a shared `blast_radius` guardrail against catastrophic ops. This is a known, accepted risk
  for the prototype stage — see architecture doc risks.
- **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials in task briefs, sprint
  plans, PROJECT.md, or the wiki, since all of it goes to git.
- **Task lifecycle discipline**: the producer writes/plans; only the owner (via the producer's
  `task-done`/`task-cancelled` skills) moves task files between `backlog/`, `done/`, `cancelled/`.
- **Consult-chain envelope (corrected during initiation)**: the onboarding/startup sequence is
  **interactive**, not headless — `-p` only seeds the first message, the session stays live for the
  owner to answer questions — and initiation only uses **one-hop** consults (producer→architect,
  producer→wiki), which are verified working. Deep **multi-hop** consultation under a fully headless
  `-p` run (relevant to CI/automation, not onboarding) remains unverified and is a separate, lower
  priority concern — not a blocker for the startup sequence.
- **`package.json` is metadata-only, deliberately** — no `bin`/`scripts`/`dependencies`; `npx fkit`
  does nothing today and installation is `curl | sh` → `fkit-init.sh` (no Node runtime in fkit). A
  future `npx fkit` installer (a `bin` wrapping `fkit-init.sh`) is a deliberate, deferred feature, not
  an oversight. Until that lands, stop bumping/publishing `version` — an empty, no-`bin` npm listing
  at a bumped version is a mild trap for anyone who runs `npx fkit` expecting an installer.
- **Historical pre-Omnigent design docs are archived**, not left at repo root — see
  [`ai-agents/knowledge-base/history/`](./history/README.md).

## Links

- Repo: https://github.com/flashist/fkit
- Architecture detail: [`ai-agents/knowledge-base/architecture.md`](./architecture.md)
- Agent team overview: [`omnigent/README.md`](../../omnigent/README.md)
- Historical pre-Omnigent design research (superseded, kept as record):
  [`ai-agents/knowledge-base/history/`](./history/README.md)
