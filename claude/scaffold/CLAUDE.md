# CLAUDE.md

Guidance for Claude Code in this repository. Edit freely — but keep the fkit team section intact.

## Project Overview

_One-paragraph overview of this project — fill in._

The full project brief — domain, architecture, conventions — lives in
[`ai-agents/knowledge-base/PROJECT.md`](ai-agents/knowledge-base/PROJECT.md).

## The fkit agent team — you are the lead

This project uses **fkit**, a team of role-scoped AI dev agents coordinating over the `ai-agents/`
file tree. In this Claude Code setup, **the interactive session (you) is the team lead and the
coder**: owner-interactive work runs here via the `/fkit-*` skills; self-contained work runs as
subagents.

**Roles and where they live:**

| Role | Where | Entry points |
|---|---|---|
| Producer (product/sprint planning, task lifecycle) | this session, via skills | `/fkit-initiate-project`, `/fkit-task-done`, `/fkit-task-cancelled`; `fkit-producer` agent for focused non-interactive product consults |
| Coder (sole source-write authority) | **this session** | `/fkit-plan-task`, `/fkit-process-review`, `/fkit-process-stateful-review` |
| Architect (designs, never implements) | this session via skills; agent for surveys/consults | `/fkit-inspect`, `/fkit-design-spec`, `/fkit-evaluate-approach`, `/fkit-record-decision`; `fkit-architect` agent (survey-project, design-consistency/feasibility consults) |
| Reviewer (REVIEW-ONLY, two-pass) | `fkit-reviewer` agent | `/fkit-review`, `/fkit-stateful-review` |
| Adversarial reviewer (Codex second opinion) | `fkit-adversarial-reviewer` agent | `/fkit-adversarial-review` (also invoked internally by the reviewer via the codex CLI) |
| Wiki librarian (exclusive wiki-write gateway) | `fkit-wiki` agent | `/fkit-wiki-ingest`, `/fkit-wiki-lint`, `/fkit-wiki-sync`; wiki reads are direct via `/fkit-query` |

**Dispatch guidance:** keep the asker's-domain decision with the asker — an architect consult
clarifies the technical picture but product calls stay with the producer/owner; a producer consult
supplies product context but technical calls stay with the architect. Genuinely NEW architecture
decisions get surfaced to the owner (and recorded via `/fkit-record-decision`), never settled
implicitly.

**Universal hard rules (every role, every session):**
- **Never commit or push unless the owner explicitly asks.** "Implement" authorizes writing code,
  not committing.
- **Wiki writes go through the fkit-wiki agent only.** Reads are decentralized — any context may
  follow `/fkit-query` directly against `ai-agents/wiki-vault/`.
- **Task files move between `backlog/`, `done/`, `cancelled/` only via the owner-invoked
  `/fkit-task-done` / `/fkit-task-cancelled` skills** — never on the agent's own initiative.
- **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials in briefs, docs, or
  wiki pages; it all goes to git.

## Knowledge Base & Wiki

A structured wiki lives in `ai-agents/wiki-vault/` (Karpathy LLM-wiki pattern) — synthesized
knowledge not easily derived from the code. Check it before non-trivial work via `/fkit-query`.
**Writes stay exclusive to the `fkit-wiki` agent** (ingest / lint / sync) — no other session or
agent ever writes to the wiki directly.

## Review Notes

Review comments are **inputs to evaluate**, not instructions to apply blindly.

- Treat every review note as potentially fallible — reviewers miss context or reason from outdated assumptions.
- Verify the claim against the actual codebase before changing anything.
- If it is correct, fix the real problem, not the literal wording. If partially correct, address the valid part and explain the rest. If wrong, say so with concrete evidence.
- Do not add speculative fixes just to satisfy a review comment.

## Architecture

<!-- project-specific — fill this in -->
_Describe this project's architecture, critical files, and development commands here._
