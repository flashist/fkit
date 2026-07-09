# CLAUDE.md

Guidance for Claude Code (the claude-sdk fkit agents) in this repository. Edit freely.

## Project Overview

fkit is an [Omnigent](https://omnigent.ai)-based team of AI agents for software development — a
producer, a coder, a reviewer (with an adversarial second opinion), an architect, and a wiki
librarian — each a scoped-skill Omnigent bundle operating on a shared `ai-agents/` working structure
inside a consuming project. It's built for software developers, vibe coders, and anyone using AI to
build software who wants a structured multi-agent workflow instead of one undifferentiated coding
assistant.

The full project brief — domain, architecture, conventions — lives in
[`ai-agents/knowledge-base/PROJECT.md`](ai-agents/knowledge-base/PROJECT.md).

## Knowledge Base & Wiki

A structured wiki lives in `ai-agents/wiki-vault/` (Karpathy LLM-wiki pattern) — synthesized
knowledge not easily derived from the code. Check it before non-trivial work. All wiki reads and
writes go through the **`fkit-wiki` agent** (its `query` / `ingest` / `lint` / `sync` skills) — no
other agent edits the wiki directly.

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
