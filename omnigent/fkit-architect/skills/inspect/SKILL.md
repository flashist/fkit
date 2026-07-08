---
name: inspect
description: Deeply research the current project architecture and write the findings to ai-agents/knowledge-base/architecture.md, combining evidence-first code investigation with liberal questioning of the owner. Writes only to knowledge-base — never the wiki. Makes no commits.
---

# Inspect (architecture investigation)

Produce a rigorous, evidence-based picture of **how the current project is built** and save it to
`ai-agents/knowledge-base/architecture.md`. This skill is **interactive by design** and
**self-contained**: it researches the codebase and writes the document — nothing else.

> **Output goes to knowledge-base, never the wiki.** You write `architecture.md` under
> `ai-agents/knowledge-base/`. Synthesizing this into the wiki is a **separate step done by the
> fkit-wiki agent** — if the result should live in the wiki, recommend the owner run fkit-wiki's
> `ingest` on the file. Do not touch `ai-agents/wiki-vault/` yourself.

## Ask early, ask often — never guess

**Ask the owner as many questions as you need. DO NOT HESITATE TO ASK — there is no limit and no
penalty for asking.** Any time you are unsure about intent, scope, terminology, ownership, history, or
*why* something is the way it is, **stop and ask instead of assuming**. Batch related questions so they
can be answered efficiently, but keep going — read, ask, confirm, repeat — until you genuinely
understand the system. An unverified guess is a defect. When in doubt, ask.

## Step 0 — Scope and orient

- Confirm the target is the current working directory's project root.
- Read `ai-agents/knowledge-base/PROJECT.md` if it exists, and skim any existing architecture notes,
  so you *augment* what is already known instead of re-deriving it. (For any wiki context, **delegate a
  lookup to the fkit-wiki agent** — do not read `ai-agents/wiki-vault/` yourself.)
- If `ai-agents/knowledge-base/architecture.md` already exists, ask whether to **replace** or
  **extend** it before writing.
- Ask the owner what to focus on and how deep to go: the whole system, a specific subsystem, or a
  concern such as data flow, runtime topology, deployment, or security. Ask who the document is for.

## Step 1 — Investigate the codebase (evidence first)

Read widely and cite what you find (reference concrete files as `path:line`). Cover, where applicable:
- Entry points, build/run configuration, and dependency manifests.
- Directory and module structure — how responsibilities are divided.
- Runtime topology — processes, services, clients/servers, workers, queues, data stores.
- Core data models and where state lives.
- Control and data flow for the main use cases.
- External integrations, APIs, and protocols.
- Cross-cutting concerns — configuration, auth, error handling, logging/telemetry, testing.
- Build, release, and deployment pipeline.
- Notable patterns, conventions, and deliberate deviations from them.

Go past the surface: **trace the real call path** for each main flow rather than guessing from names,
**read the tests as the behavior spec**, and **check git history/blame for the *why*** behind
non-obvious decisions. Prefer reading the code over assuming; where the code cannot answer, note it
for Step 2.

For a large codebase, read broadly yourself. **If — and only if — your agent config declares read-only
research sub-agents** (`type: agent` tools), you may delegate per-subsystem evidence-gathering to them,
one per subsystem, each gathering evidence only and **never** asking the owner anything. This is an
optional accelerant, not a required step, and it is unavailable unless such a tool is actually declared
— do not assume it exists. Either way, keep every owner question in this main session and synthesize all
findings yourself.

## Step 2 — Interview the owner to fill every gap

For everything the code cannot tell you — intent, history, constraints, trade-offs, the *why* behind
decisions, future direction, known pain points, and ownership — **ask the owner**. Loop between reading
and asking. Again: **ask as many questions as you need and never hesitate.** Do not proceed with
unresolved assumptions; surface each one and ask.

## Step 3 — Write ai-agents/knowledge-base/architecture.md

Write a thorough, well-structured document. Adapt these sections to the project:
- Overview and purpose
- System context and external dependencies
- High-level architecture — components and their responsibilities
- Runtime topology and deployment
- Data model and state
- Key flows — one per main use case
- Cross-cutting concerns
- Conventions and deliberate decisions, each with its rationale
- Risks, technical debt, and open questions
- Diagrams (ASCII or mermaid) wherever they make the structure clearer

Ground every claim in either a code reference or an explicit owner answer, and mark anything still
unknown as an open question rather than guessing. If the system is large, let `architecture.md` act as
an **index** that links to focused `architecture-<area>.md` files in the same folder.

## Step 4 — Report and stop

Summarize what was produced (the sections written and the evidence gathered) and list the open
questions still outstanding. **Make no commits** — everything is working-tree only. If the document
belongs in the wiki, note that the **fkit-wiki** agent should ingest it (you do not).
