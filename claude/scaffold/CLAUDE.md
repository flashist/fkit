# CLAUDE.md

Guidance for Claude Code in this repository. Edit freely — but keep the fkit team section intact.

## Project Overview

_One-paragraph overview of this project — fill in._

The full project brief — domain, architecture, conventions — lives in
[`ai-agents/knowledge-base/PROJECT.md`](ai-agents/knowledge-base/PROJECT.md).

## The fkit agent team

This project uses **fkit**, a team of role-scoped AI dev agents coordinating over the `ai-agents/`
file tree. **Every fkit session is locked to exactly one role** (`claude --agent fkit-<role>`, with
every other role's skills denied on invocation by a `PreToolUse` hook — see below). Running
**`fkit`** in a terminal shows a role menu; **`fkit <role>`** goes straight there. To work in two
roles at once, open another terminal tab and run `fkit` again. Run `/fkit-team` any time for the
roster and which role you're in.

| Role | Does | Must not | **Its own** skills |
|---|---|---|---|
| **producer** | product & sprint planning, task briefs, task lifecycle | write code | `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-done`, `/fkit-task-cancelled` |
| **coder** | implementation — sole source-write authority | commit unprompted; make product calls; settle new architecture; **review its own work** | `/fkit-plan-task`, `/fkit-process-review`, `/fkit-process-stateful-review`, `/fkit-task-ship-loop` |
| **architect** | architecture, design specs, ADRs, feasibility | implement features; write the wiki | `/fkit-survey-project`, `/fkit-inspect`, `/fkit-design-spec`, `/fkit-evaluate-approach`, `/fkit-record-decision` |
| **reviewer** | code review (own pass + Codex second opinion), the review ledger | edit source code — ever | `/fkit-review`, `/fkit-stateful-review` |
| **adversarial-reviewer** | hostile second opinion on Codex, findings only | edit anything | `/fkit-adversarial-review` |
| **wiki** | the wiki — ingest / lint / sync; **exclusive write gateway** | write outside `ai-agents/wiki-vault/` | `/fkit-wiki-ingest`, `/fkit-wiki-lint`, `/fkit-wiki-sync` |

Every role also has `/fkit-query` (wiki reads) and `/fkit-team`. **Every role but
`adversarial-reviewer` also has the two task movers** `/fkit-task-done` and `/fkit-task-cancelled` —
they live in the producer's namespace but any role may invoke them, and an agent-performed close must
carry the `(agent-closed — not owner-verified)` marker. **The six Claude-side roles** — all
but `adversarial-reviewer`, which reviews on Codex under a restricted allowlist — also have
`/fkit-open-questions-interview` (ask the owner about questions this session left unanswered) and
`/fkit-dumb-down` (re-explain the last answer in simple terms). The **team room & conductor**
(`fkit-lead`) owns **`/fkit-sprint-ship-loop`** (drive a whole sprint's eligible tasks brief→closed by
spawning role workers and relaying decisions) beyond the shared skills — it routes, and drives the team
when you hand it a goal.

**Skills belong to roles.** This is structural — **in a role session and in a spawned consult
alike**: a `PreToolUse` hook checks the REAL invoking agent's identity (a session's own role, or a
spawned subagent's own role, at any consult depth) against role ownership on every skill call, and
denies it if that role doesn't own it. So a `fkit coder` session **cannot** run `/fkit-review`, and
neither can a subagent it spawns pretending to; it asks `@fkit-reviewer` for one, because reviewing
code you just wrote isn't a review.

One cost, stated plainly: a foreign skill is **visible** in the `/` menu but **not runnable** —
invoking it is denied regardless of who's asking. The `⛔ Owner:` banner on each skill is a courtesy
for a well-behaved agent to notice before trying, not the only thing stopping it.

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

<!-- fkit:begin-rules -->
<!-- fkit:end-rules -->

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

Full technical detail — component map, runtime topology, data model, build/run/test, and
cross-cutting concerns — lives in
[`ai-agents/knowledge-base/architecture.md`](ai-agents/knowledge-base/architecture.md). Don't
duplicate it here; read it for anything below product-brief altitude.
