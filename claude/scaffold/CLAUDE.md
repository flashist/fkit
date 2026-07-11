# CLAUDE.md

Guidance for Claude Code in this repository. Edit freely — but keep the fkit team section intact.

## Project Overview

_One-paragraph overview of this project — fill in._

The full project brief — domain, architecture, conventions — lives in
[`ai-agents/knowledge-base/PROJECT.md`](ai-agents/knowledge-base/PROJECT.md).

## The fkit agent team

This project uses **fkit**, a team of role-scoped AI dev agents coordinating over the `ai-agents/`
file tree. **This session is the team lead, and the coder by default.** Run `/fkit-team` any time to
see the roster, who to talk to, and which hat you're currently wearing.

| Role | Does | Must not | Working skills |
|---|---|---|---|
| **producer** | product & sprint planning, task briefs, task lifecycle | write code; move task files unprompted | `/fkit-initiate-project`, `/fkit-task-done`, `/fkit-task-cancelled` |
| **coder** | implementation — sole source-write authority | commit unprompted; make product calls; settle new architecture | `/fkit-plan-task`, `/fkit-process-review`, `/fkit-process-stateful-review` |
| **architect** | architecture, design specs, ADRs, feasibility | implement features; write the wiki | `/fkit-inspect`, `/fkit-design-spec`, `/fkit-evaluate-approach`, `/fkit-record-decision` |
| **reviewer** | code review (own pass + Codex second opinion), the review ledger | edit source code — ever | `/fkit-review`, `/fkit-stateful-review` |
| **adversarial-reviewer** | hostile second opinion on Codex, findings only | edit anything | `/fkit-adversarial-review` |
| **wiki** | the wiki — ingest / lint / sync; **exclusive write gateway** | write outside `ai-agents/wiki-vault/` | `/fkit-wiki-ingest`, `/fkit-wiki-lint`, `/fkit-wiki-sync` (reads: `/fkit-query`, any session) |

**Three ways to reach a role:**
- **Wear the hat** — `/fkit-agent-<role>` (e.g. `/fkit-agent-architect`). *This* session becomes that
  role and holds it until you switch or say "exit <role> mode". Best for working with a role
  interactively.
- **One-off dispatch** — `@fkit-architect <question>`, or a job skill like `/fkit-review`. A fresh
  agent answers in its own context and returns; this session keeps its own hat.
- **Dedicated session** — `fkit claude architect` (also `producer`, `coder`, `reviewer`, `wiki`,
  `adv`). A whole session locked to that role. Best when you want a **genuinely independent** role —
  especially the reviewer, which shouldn't have watched the code being written.

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
- **Only the wiki role writes `ai-agents/wiki-vault/`** — as the fkit-wiki agent, or worn as the
  `/fkit-agent-wiki` hat. Reads are decentralized: any session may follow `/fkit-query` directly.
- **Task files move between `backlog/`, `done/`, `cancelled/` only via the owner-invoked
  `/fkit-task-done` / `/fkit-task-cancelled` skills** — never on an agent's own initiative.
- **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials in briefs, docs, or
  wiki pages; it all goes to git.

## Knowledge Base & Wiki

A structured wiki lives in `ai-agents/wiki-vault/` (Karpathy LLM-wiki pattern) — synthesized
knowledge not easily derived from the code. Check it before non-trivial work via `/fkit-query`.
**Writes stay exclusive to the wiki role** (the `fkit-wiki` agent, or the `/fkit-agent-wiki` hat) —
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
