---
name: survey-project
description: Non-interactive, evidence-first technical survey of the current codebase, run when the fkit-producer spawns the architect during project initiation. Read the code, write ai-agents/knowledge-base/architecture.md, and reply to the producer with a concise technical overview plus open questions. Does not interview the owner and makes no commits.
---

# Survey project (initiation codebase survey)

This skill runs when the **fkit-producer spawns you during project initiation** to get a technical
picture of a fresh project. It is the non-interactive sibling of `inspect`: same evidence-first rigor,
but you are running as a **spawned consult**, so you **do not interview the owner** — you read the code
and hand back what you found, turning every gap into an open question for the producer to relay.

> **Two things differ from `inspect`.** (1) **No owner interview** — you have no interactive channel to
> the human; capture unknowns as open questions instead of asking. (2) Your **final message is the reply
> to the producer** — it must stand on its own as a technical overview, not just say "done".

## Step 0 — Take the producer's context

The producer's message includes a short product summary (what the project is and who it's for). Use it to
frame the survey — e.g. which flows matter most — but stay evidence-first: the code is the source of truth.

## Step 1 — Survey the codebase (evidence first, cite `path:line`)

Read widely and ground every claim in a concrete reference. Cover, where applicable:
- **Entry points** and how the thing starts / is invoked.
- **Build, run, and test** — the actual commands (from manifests, scripts, Makefile, CI config).
- **Languages, frameworks, and key dependencies** — the real stack, from the manifests.
- **Directory / module structure** — how responsibilities are divided.
- **Runtime topology** — processes, services, clients/servers, workers, queues, data stores.
- **Core data models and where state lives.**
- **External integrations, APIs, protocols.**
- **Cross-cutting concerns** — configuration, auth, error handling, logging/telemetry, testing.
- **CI / build / deploy** pipeline, if present.
- **Notable patterns and conventions**, and any obvious risks or technical-debt signals.

Trace real call paths rather than guessing from names, and read tests as the behavior spec. Where the
code can't answer a question, **do not guess** — record it as an open question (Step 3).

## Step 2 — Write ai-agents/knowledge-base/architecture.md

Write an evidence-based architecture document. Adapt these sections to the project:
- Overview and purpose (grounded in the code, informed by the producer's product context)
- System context and external dependencies
- High-level architecture — components and responsibilities
- Runtime topology and deployment
- Data model and state
- Key flows — one per main use case
- Build / run / test — the concrete commands
- Cross-cutting concerns
- Notable conventions and deliberate decisions
- Risks, technical debt, and open questions
- Diagrams (ASCII or mermaid) wherever they clarify structure

Note near the top that this is an **initiation survey** — a first pass to be deepened later (via `inspect`).
Ground every claim in a `path:line` reference; mark anything unresolved as an open question rather than
guessing. Never write secrets into the doc.

## Step 3 — Reply to the producer

Your final message **is** the consult reply. Keep it concise and self-contained:
- **Technical overview** — stack, structure, how to build/run/test, runtime shape, in a few tight bullets.
- **Top risks / debt** — the two or three things worth flagging early.
- **Open questions** — everything the code couldn't answer, for the producer to relay to the owner.
- Confirm you wrote `ai-agents/knowledge-base/architecture.md`.

**Make no commits.** Do not touch the wiki (`ai-agents/wiki-vault/`) — if this should live in the wiki,
say so and let the producer route it through fkit-wiki.
