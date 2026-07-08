# Agent Instructions

Guidance for Codex (the codex fkit agents) in this repository. Edit freely.

## Project Overview

_One-paragraph overview of this project — fill in._

The full project brief — domain, architecture, conventions — lives in
[`ai-agents/knowledge-base/PROJECT.md`](ai-agents/knowledge-base/PROJECT.md).

## Knowledge Base & Wiki

A structured wiki lives in `ai-agents/wiki-vault/` (Karpathy LLM-wiki pattern). Before
implementing a task, check it for relevant context. All wiki reads and writes go through the
**`fkit-wiki` agent** — no other agent edits the wiki directly.

## Review Notes

Review comments are **inputs to evaluate**, not instructions to apply blindly.

- Treat every review note as potentially fallible — reviewers miss context or reason from outdated assumptions.
- Verify the claim against the actual codebase before changing anything.
- If it is correct, fix the real problem, not the literal wording. If partially correct, address the valid part and explain the rest. If wrong, say so with concrete evidence.
- Do not add speculative fixes just to satisfy a review comment.

## Architecture

<!-- project-specific — fill this in -->
_Describe this project's architecture and critical files here._
