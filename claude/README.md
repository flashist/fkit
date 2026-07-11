# fkit on Claude Code (native port)

This directory is the **Claude Code native** flavor of the fkit agent team — a peer of
[`omnigent/`](../omnigent/), which holds the original Omnigent runtime. Both flavors operate on the
same runtime-agnostic `ai-agents/` working structure (tasks, sprints, reviews, knowledge-base,
wiki-vault) — that shared file contract is the portability layer. See ADR-008 for the decision
record.

## Why this exists

Omnigent's orchestration proved unreliable in practice (sub-sub-agents failing to reply back,
dropped sessions, failed agent connections) and hides Claude Code's native statusbar (context,
limits). This port runs the same role-separated team on Claude Code's stable first-party
primitives: **custom subagents** (`.claude/agents/`) and **skills** (`.claude/skills/`), with the
interactive session as the team lead.

## The interaction model

**The interactive Claude Code session is the team lead — and the coder by default.** There is no
fkit-team root agent: Claude Code owns session lifecycle. Every role is reachable three ways, and
roles consult each other directly.

**Three ways to reach a role:**
- **Wear the hat** — `/fkit-agent-<role>`. *This* session becomes that role (reading its definition
  from `.claude/agents/`, so there's one source of truth) and holds it until you switch or say "exit
  <role> mode". Best for working with a role interactively — this is what replaces Omnigent's
  "click the teammate in the Subagents panel".
- **One-off dispatch** — `@fkit-architect <question>`, or a job skill (`/fkit-review`,
  `/fkit-wiki-sync`, …). A fresh agent answers in its own context and returns; your session keeps its
  own hat.
- **Dedicated session** — `fkit claude <role>` → `claude --agent fkit-<role>`. A whole session locked
  to the role, opening with its own briefing (via the `initialPrompt` frontmatter). Best when you want
  a **genuinely independent** role — especially the reviewer, which shouldn't have watched the code
  being written.

Agent definitions are **dual-mode**: spawned as a consult they never ask the owner (they answer and
return open questions); as a session role the owner is present, so they interview freely and run their
interactive init (the producer's situation briefing, the architect's "ask relentlessly").

```
Owner ⇄ LEAD SESSION (team lead; coder by default; any role via /fkit-agent-*)
          │ Agent tool (synchronous; replaces Omnigent's spawn+inbox)
          ├─→ fkit-architect   ⇄ consults fkit-producer   (product context behind a technical call)
          ├─→ fkit-producer    ⇄ consults fkit-architect  (feasibility behind a product call)
          ├─→ fkit-coder        → consults architect / producer
          ├─→ fkit-reviewer     → consults architect (design intent) ──Bash──→ codex exec
          ├─→ fkit-adversarial-reviewer ──Bash──→ codex exec          [leaf — consults no one]
          └─→ fkit-wiki         (ALL wiki writes; deep research)      [leaf — consults no one]

Consult rules: max TWO hops (messages carry "hop N of 2"; at hop 2 you answer or return an open
question), never a cycle (never consult your invoker or anyone already in the chain), and the asker
keeps the decision that's theirs. Genuinely new architecture decisions go to the OWNER.
Wiki READS: any context, directly, via /fkit-query (ADR-005 intent — one copy, no vendoring).
```

## The team

| Agent (`.claude/agents/`) | Tools | Role |
|---|---|---|
| fkit-producer | Read, Grep, Glob, Bash, Write, Edit, **Agent** | product & sprint planning, task briefs, lifecycle. Consults the architect. |
| fkit-coder | Read, Grep, Glob, Bash, Write, Edit, **Agent** | implementation — sole source-write authority. Consults architect/producer. Not for *background* delegation: its plan/fix approval gates need the owner present, so run it as the lead, a hat, or a session. |
| fkit-reviewer | Read, Grep, Glob, Bash, Write, Edit, **Agent** | two-pass review (own + Codex via CLI); writes only `ai-agents/reviews/` documents. Consults the architect on design intent. |
| fkit-adversarial-reviewer | Read, Grep, Glob, Bash | findings-only hostile pass on Codex (`codex exec --sandbox read-only`); flagged Claude fallback. **Structurally write-free; a leaf.** |
| fkit-architect | Read, Grep, Glob, Bash, Write, Edit, **Agent** | architecture, design specs, ADRs, surveys. Consults the producer for product context. |
| fkit-wiki | Read, Grep, Glob, Bash, Write, Edit | the wiki role — **exclusive write gateway** (ingest / lint / sync embedded). **A leaf.** |

Tool allowlists are a structural upgrade over Omnigent's prompt-only boundaries — but note two honest
limits: an agent with Bash can technically still write files, and Claude Code **ignores**
`Agent(type)` allowlists inside subagent definitions (they only work for a main-thread `--agent`), so
*which* peer an agent may consult, and the two-hop cap, are **prompt-enforced**. Path-level hook
enforcement is deferred hardening (see ADR-008).

## The Codex adversarial pass

Model diversity survives the port via the codex CLI (ADR-008): the reviewer (and the standalone
adversarial agent) assemble a findings-only prompt + inline diff into `.fkit/tmp/`, then run

```sh
codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/adversarial-prompt.md
```

Degradation is mandatory and loud: no codex → the review continues Claude-only with the verdict
forced to `🟡 Partial review — codex unavailable`; the standalone agent falls back to its own pass
labeled `[claude-fallback — NOT model-diverse]`. Codex reads the project's `AGENTS.md` natively —
which is why init still drops that file.

## Install & run in a project

```sh
# one-time global install (installs both flavors)
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh

# in any project directory:
fkit claude              # set up (idempotent) + launch Claude Code as the team lead
fkit claude architect    # ...or a session locked to one role
                         #    (producer | coder | architect | reviewer | wiki | adv)
fkit                     # ...or the original Omnigent team flow
```

`fkit claude` runs `fkit-claude-init.sh`, which idempotently:
1. copies the `ai-agents/` scaffold (from `claude/scaffold/` — single source of truth),
2. drops `CLAUDE.md` (Claude-flavored, with the team map) and `AGENTS.md` (codex reads it),
3. refreshes `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/` from `claude/`,
4. installs the `.fkit/interview` terminal intake (fresh projects → `.fkit/intake.md`),
5. gitignores the fkit-managed copies (`.fkit/`, `.claude/agents/fkit-*.md`,
   `.claude/skills/fkit-*/`).

On a fresh project it then launches `claude` seeded to run `/fkit-initiate-project`; otherwise it
just launches `claude`.

The `.claude/` copies are fkit-managed and refreshed on every init — edit the canonical sources
here in `claude/` (or in your fork), not the copies.

## What deliberately does not exist here

- **fkit-team / reconnect / restart machinery** — Claude Code owns its sessions
  (`claude --resume`); there is nothing to reconnect.
- **Vendored per-agent `query` copies + sync script + drift check** — one `/fkit-query` skill
  serves every context (ADR-004/005/006/007 are omnigent-path-only now).
- **Experimental agent-teams mode** — possible later opt-in; subagents-first is the v1 decision.
