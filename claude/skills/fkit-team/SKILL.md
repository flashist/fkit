---
name: fkit-team
description: Show the fkit agent team — who's on it, what each role may and may not do, the three ways to reach a role (hat / one-off dispatch / dedicated session), and which hat this session is currently wearing. Use when you're not sure who to talk to or how.
---

# The fkit team

Report the roster and how to reach it. Keep it short and scannable — this is a signpost, not an essay.

## Steps

1. **State the current hat.** Which role is this session wearing right now? (The lead session is the
   **coder** by default; a `/fkit-agent-*` skill earlier in the conversation changes that; a session
   launched with `fkit claude <role>` / `--agent` is locked to that role.) Say it in one line.
2. **Print the roster**, adapted to what's actually installed (list `.claude/agents/fkit-*.md`):

   | Role | Does | Must not |
   |---|---|---|
   | **producer** | product & sprint planning, task briefs, task lifecycle | write code; move task files unprompted |
   | **coder** | implementation — sole source-write authority | commit unprompted; make product calls; settle new architecture |
   | **architect** | architecture, design specs, ADRs, feasibility | implement features; write the wiki |
   | **reviewer** | code review (own pass + Codex second opinion), the review ledger | edit source code — ever |
   | **adversarial-reviewer** | hostile second opinion on Codex, findings only | edit anything |
   | **wiki** | the wiki — ingest / lint / sync; **exclusive write gateway** | write outside `ai-agents/wiki-vault/` |

3. **Explain the three ways to reach a role:**
   - **Wear the hat** — `/fkit-agent-producer`, `/fkit-agent-architect`, `/fkit-agent-coder`,
     `/fkit-agent-reviewer`, `/fkit-agent-wiki`, `/fkit-agent-adversarial-reviewer`. *This* session
     becomes that role and holds it until you switch or say "exit <role> mode". Best for working
     **with** a role interactively.
   - **One-off dispatch** — `@fkit-architect <your question>` (or just `/fkit-review`,
     `/fkit-wiki-sync`, etc.). A fresh agent answers in its own context and returns; your session keeps
     its own hat. Best for a **focused consult** or a self-contained job.
   - **Dedicated session** — `fkit claude architect` (also `producer`, `coder`, `reviewer`, `wiki`,
     `adv`). A whole Claude Code session locked to that role, with its own context. Best when you want
     a **genuinely independent** role — especially the reviewer, which shouldn't have watched the code
     being written.

4. **Mention the working skills** briefly, grouped by role: producer → `/fkit-initiate-project`,
   `/fkit-task-done`, `/fkit-task-cancelled`; coder → `/fkit-plan-task`, `/fkit-process-review`,
   `/fkit-process-stateful-review`; architect → `/fkit-inspect`, `/fkit-design-spec`,
   `/fkit-evaluate-approach`, `/fkit-record-decision`; reviewer → `/fkit-review`,
   `/fkit-stateful-review`, `/fkit-adversarial-review`; wiki → `/fkit-query` (read, any session),
   `/fkit-wiki-ingest`, `/fkit-wiki-lint`, `/fkit-wiki-sync`.

5. **Note how agents talk to each other**: roles may consult each other directly (architect ⇄ producer,
   coder → architect/producer, reviewer → architect), up to **two hops**, never in a cycle. The
   adversarial reviewer and wiki are leaves — they consult no one.

6. If the owner asked "who should I talk to about X?", **answer that** concretely instead of dumping
   the whole roster.
