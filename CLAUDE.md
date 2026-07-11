# CLAUDE.md

Guidance for Claude Code in this repository. Edit freely.

## Project Overview

fkit is a team of AI agents for software development — a producer, a coder, a reviewer (with an
adversarial second opinion), an architect, and a wiki librarian — operating on a shared
`ai-agents/` working structure inside a consuming project. It ships in **two runtime flavors** on
the same file contracts (see
[`ADR-008`](ai-agents/knowledge-base/decisions/adr-008-claude-code-native-port-alongside-omnigent.md)):
the original [Omnigent](https://omnigent.ai) bundles under `omnigent/`, and a **Claude Code
native** port under `claude/` (subagents + `/fkit-*` skills; write-up in
[`claude/README.md`](claude/README.md)). Behavior changes must be mirrored in both flavors by hand.

The full project brief — domain, architecture, conventions — lives in
[`ai-agents/knowledge-base/PROJECT.md`](ai-agents/knowledge-base/PROJECT.md).

## The fkit team in this repo (dogfooded, Claude Code flavor)

This repo runs its own Claude Code flavor: `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/`
are fkit-managed copies refreshed from `claude/` by `claude/fkit-claude-init.sh .` — **edit the
canonical sources in `claude/`, never the copies** (they are gitignored). The interactive session
is the team lead and the coder; interactive role work runs via the `/fkit-*` skills; the reviewer,
adversarial reviewer, architect (surveys/consults), producer (consults), and wiki agents run as
subagents. Universal hard rules: never commit/push unprompted; wiki writes only via the fkit-wiki
agent; task files move only via the owner-invoked `/fkit-task-done` / `/fkit-task-cancelled`; no
secrets in any artifact.

## Knowledge Base & Wiki

A structured wiki lives in `ai-agents/wiki-vault/` (Karpathy LLM-wiki pattern) — synthesized
knowledge not easily derived from the code. Check it before non-trivial work. Per
[`ADR-005`](ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md),
**reads are decentralized**: in the Claude Code flavor any context follows the one `/fkit-query`
skill; in the Omnigent flavor every agent carries its own vendored `query` skill copy. **Writes
stay exclusive to the `fkit-wiki` agent** (ingest / lint / sync) — no other agent or session ever
writes to `ai-agents/wiki-vault/`.

## Review Notes

Review comments are **inputs to evaluate**, not instructions to apply blindly.

- Treat every review note as potentially fallible — reviewers miss context or reason from outdated assumptions.
- Verify the claim against the actual codebase before changing anything.
- If it is correct, fix the real problem, not the literal wording. If partially correct, address the valid part and explain the rest. If wrong, say so with concrete evidence.
- Do not add speculative fixes just to satisfy a review comment.

## Architecture

Full technical detail — component map, runtime topology, data model, build/run/test, and
cross-cutting concerns — lives in
[`ai-agents/knowledge-base/architecture.md`](ai-agents/knowledge-base/architecture.md). Don't
duplicate it here; read it for anything below product-brief altitude.
