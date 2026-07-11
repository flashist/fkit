# CLAUDE.md

Guidance for Claude Code in this repository. Edit freely — but keep the fkit team section intact.

## Project Overview

_One-paragraph overview of this project — fill in._

The full project brief — domain, architecture, conventions — lives in
[`ai-agents/knowledge-base/PROJECT.md`](ai-agents/knowledge-base/PROJECT.md).

## The fkit agent team

This project uses **fkit**, a team of role-scoped AI dev agents coordinating over the `ai-agents/`
file tree. **Every fkit session is locked to exactly one role** (`claude --agent fkit-<role>`, with
every other role's skills turned off). Running **`fkit`** in a terminal shows a role menu; **`fkit
<role>`** goes straight there. To work in two roles at once, open another terminal tab and run `fkit`
again. Run `/fkit-team` any time for the roster and which role you're in.

| Role | Does | Must not | **Its own** skills |
|---|---|---|---|
| **producer** | product & sprint planning, task briefs, task lifecycle | write code; move task files unprompted | `/fkit-initiate-project`, `/fkit-task-done`, `/fkit-task-cancelled` |
| **coder** | implementation — sole source-write authority | commit unprompted; make product calls; settle new architecture; **review its own work** | `/fkit-plan-task`, `/fkit-process-review`, `/fkit-process-stateful-review` |
| **architect** | architecture, design specs, ADRs, feasibility | implement features; write the wiki | `/fkit-survey-project`, `/fkit-inspect`, `/fkit-design-spec`, `/fkit-evaluate-approach`, `/fkit-record-decision` |
| **reviewer** | code review (own pass + Codex second opinion), the review ledger | edit source code — ever | `/fkit-review`, `/fkit-stateful-review` |
| **adversarial-reviewer** | hostile second opinion on Codex, findings only | edit anything | `/fkit-adversarial-review` |
| **wiki** | the wiki — ingest / lint / sync; **exclusive write gateway** | write outside `ai-agents/wiki-vault/` | `/fkit-wiki-ingest`, `/fkit-wiki-lint`, `/fkit-wiki-sync` |

Every role also has `/fkit-query` (wiki reads) and `/fkit-team`. The **team room** (`fkit-lead`) has
only `/fkit-team` and `/fkit-query` — it routes, it doesn't do.

**Skills belong to roles, structurally.** A session sees *only* its own role's procedures; the rest
are turned **off** — invisible and unrunnable, not merely discouraged. So the coder **cannot** run
`/fkit-review`; it asks `@fkit-reviewer` for one, because reviewing code you just wrote isn't a
review.

**Two ways to engage a role:**
- **`fkit <role>`** *(in a terminal)* — a session locked to that role. Every role session is a fresh
  context, which is what makes the reviewer's independence structural rather than a promise.
- **`@fkit-<role> <question>`** *(inside any session)* — asks a role a one-off question and brings the
  answer back here. Use for a focused consult — and it's how **roles consult each other**.

**Agents consult each other directly** (Agent tool): architect ⇄ producer, coder → architect/producer,
reviewer → architect. Rules: **max two hops** (a consult message states "hop N of 2"; at hop 2 you may
not consult further — answer or return an open question), **never in a cycle** (never consult whoever
invoked you, or anyone already in the chain), and **the asker keeps the decision that's theirs** — an
architect consult clarifies the technical picture but product calls stay with the producer/owner, and
vice versa. The adversarial reviewer and wiki are leaves: they consult no one. Genuinely NEW
architecture decisions go to the **owner** (record via `/fkit-record-decision`), never settled
implicitly between agents.

**Universal hard rules (every role, every session):**
- **Never commit or push unless the owner explicitly asks.** "Implement" authorizes writing code,
  not committing.
- **Only the wiki role writes `ai-agents/wiki-vault/`** — as the fkit-wiki agent, or a `fkit wiki` session. Reads are decentralized: any session may follow `/fkit-query` directly.
- **Task files move between `backlog/`, `done/`, `cancelled/` only via the owner-invoked
  `/fkit-task-done` / `/fkit-task-cancelled` skills** — never on an agent's own initiative.
- **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials in briefs, docs, or
  wiki pages; it all goes to git.

## Knowledge Base & Wiki

A structured wiki lives in `ai-agents/wiki-vault/` (Karpathy LLM-wiki pattern) — synthesized
knowledge not easily derived from the code. Check it before non-trivial work via `/fkit-query`.
**Writes stay exclusive to the wiki role** (the `fkit-wiki` agent, or a `fkit wiki` session) —
via its ingest / lint / sync procedures. No other role writes to the wiki.

## Review Notes

Review comments are **inputs to evaluate**, not instructions to apply blindly.

- Treat every review note as potentially fallible — reviewers miss context or reason from outdated assumptions.
- Verify the claim against the actual codebase before changing anything.
- If it is correct, fix the real problem, not the literal wording. If partially correct, address the valid part and explain the rest. If wrong, say so with concrete evidence.
- Do not add speculative fixes just to satisfy a review comment.

## Architecture

<!-- project-specific — fill this in -->
_Describe this project's architecture, critical files, and development commands here._
