---
name: fkit-survey-project
description: The architect's initiation codebase survey — a non-interactive, evidence-first pass over the code that writes ai-agents/knowledge-base/architecture.md and returns a technical overview plus open questions. Run when the producer's project initiation asks for it. Does not interview the owner and makes no commits.
---

# Survey Project (initiation codebase survey) — the architect's procedure

> ## ⛔ Owner: the **architect**
> This is the fkit-architect's own procedure. Execute it **only** if you are the architect — running as the `fkit-architect` agent or in a `fkit architect` session.
>
> **Any other role (including `/fkit-initiate-project`): do not execute this.** Ask the architect:
> ```
> @fkit-architect Run your fkit-survey-project procedure. Product context: <2–4 sentences>.
> Do a non-interactive, evidence-first survey — do NOT interview the owner; return open questions
> to me. Write ai-agents/knowledge-base/architecture.md, then reply with a concise technical
> overview and your open questions.
> ```

The non-interactive sibling of `fkit-inspect`: same evidence-first rigor, but you are running as a
**consult**, so you **do not interview the owner** — you read the code and hand back what you found,
turning every gap into an open question for the invoker to relay.

**Argument:** `$ARGUMENTS` — the product context from the invoker (what the project is, who it's for).

> **Two things differ from `fkit-inspect`.** (1) **No owner interview** — capture unknowns as open
> questions instead of asking. (2) Your **final message is the reply to the invoker** — it must stand
> on its own as a technical overview, not just say "done".

## Step 0 — Take the invoker's context

The invoker's message includes a short product summary. Use it to frame the survey — e.g. which flows
matter most — but stay **evidence-first**: the code is the source of truth.

## Step 1 — Survey the codebase (cite `path:line` for every claim)

Read widely and ground every claim in a concrete reference. Cover, where applicable:
- **Entry points** and how the thing starts / is invoked.
- **Build, run, and test** — the actual commands (manifests, scripts, Makefile, CI config).
- **Languages, frameworks, key dependencies** — the real stack, from the manifests.
- **Directory / module structure** — how responsibilities are divided.
- **Runtime topology** — processes, services, clients/servers, workers, queues, data stores.
- **Core data models** and where state lives.
- **External integrations**, APIs, protocols.
- **Cross-cutting concerns** — configuration, auth, error handling, logging/telemetry, testing.
- **CI / build / deploy** pipeline, if present.
- **Notable patterns and conventions**, and any obvious risks or technical-debt signals.

Trace real call paths rather than guessing from names, and read tests as the behavior spec. Where the
code can't answer a question, **do not guess** — record it as an open question (Step 3).

## Step 2 — Write `ai-agents/knowledge-base/architecture.md`

An evidence-based architecture document. Adapt these sections to the project: overview and purpose
(grounded in the code, informed by the product context); system context and external dependencies;
high-level architecture — components and responsibilities; runtime topology and deployment; data model
and state; key flows (one per main use case); build / run / test — the concrete commands; cross-cutting
concerns; notable conventions and deliberate decisions; risks, technical debt, and open questions;
diagrams (ASCII or mermaid) wherever they clarify structure.

Note near the top that this is an **initiation survey** — a first pass, to be deepened later via
`fkit-inspect`. Ground every claim in a `path:line` reference; mark anything unresolved as an open
question rather than guessing. **Never write secrets into the doc.**

## Step 3 — Reply to the invoker

Your final message **is** the reply. Keep it concise and self-contained:
- **Technical overview** — stack, structure, how to build/run/test, runtime shape, in a few tight
  bullets.
- **Top risks / debt** — the two or three things worth flagging early.
- **Open questions** — everything the code couldn't answer, for the owner.
- Confirm you wrote `ai-agents/knowledge-base/architecture.md`.

## Hard rules

- **Make no commits.**
- **Never touch the wiki** (`ai-agents/wiki-vault/`) — if this belongs there, say so and let the
  invoker route it through the wiki role.
- **Design, don't implement** — this procedure writes one document and nothing else.
