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

**The interactive Claude Code session IS the team lead — and the coder.** There is no fkit-team
root agent: Claude Code owns session lifecycle, and the lead session dispatches directly.

- **Owner-interactive work runs in the lead session via `/fkit-*` skills** — subagents can't
  interview the owner, so anything with an interview or approval gate (project initiation, task
  lifecycle, planning, processing review feedback, architect design work) stays in the main
  session, which adopts the matching role per skill.
- **Self-contained work runs as subagents** — the review passes (independence from the
  coder-tainted lead context is the point), the initiation codebase survey, all wiki writes, and
  focused non-interactive consults.
- **The reviewer's owner-questions use a two-phase flow** through the shared ledger
  `ai-agents/reviews/<task-id>.md`: phase 1 reviews and returns questions; the lead relays them to
  the owner; phase 2 records the decisions. All state lives in the ledger, so statelessness across
  invocations is safe.

```
Owner ⇄ LEAD SESSION (team lead + coder; wears producer/architect hats via /fkit-* skills)
          │ Agent tool (synchronous; replaces Omnigent's spawn+inbox)
          ├─→ fkit-reviewer ──Bash──→ codex exec   (adversarial pass — not a nested agent)
          ├─→ fkit-adversarial-reviewer ──Bash──→ codex exec
          ├─→ fkit-wiki            (ALL wiki writes; deep research)
          ├─→ fkit-architect       (survey-project; focused consults)
          └─→ fkit-producer        (focused product consults)

Wiki READS: any context, directly, via /fkit-query (ADR-005 intent — one copy, no vendoring).
Nesting: one level. Subagents carry no Agent tool.
```

## The team

| Agent (`.claude/agents/`) | Tools | Role |
|---|---|---|
| fkit-producer | Read, Grep, Glob, Bash, Write, Edit | non-interactive product consults; interactive producer work is `/fkit-initiate-project`, `/fkit-task-done`, `/fkit-task-cancelled` in the lead |
| fkit-coder | Read, Grep, Glob | role charter only — the lead session is the coder (`/fkit-plan-task`, `/fkit-process-review`, `/fkit-process-stateful-review`) |
| fkit-reviewer | Read, Grep, Glob, Bash, Write, Edit | two-pass review (own + Codex via CLI); writes only `ai-agents/reviews/` documents |
| fkit-adversarial-reviewer | Read, Grep, Glob, Bash | findings-only hostile pass on Codex (`codex exec --sandbox read-only`); flagged Claude fallback; **structurally write-free** |
| fkit-architect | Read, Grep, Glob, Bash, Write, Edit | survey-project + focused consults; interactive design work is `/fkit-inspect`, `/fkit-design-spec`, `/fkit-evaluate-approach`, `/fkit-record-decision` in the lead |
| fkit-wiki | Read, Grep, Glob, Bash, Write, Edit | exclusive wiki-write gateway (ingest / lint / sync procedures embedded); deep wiki research |

Tool allowlists are a structural upgrade over Omnigent's prompt-only boundaries — but note an agent
with Bash can technically still write files; path-level hook enforcement is deferred hardening
(see ADR-008).

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
fkit claude      # set up (idempotent) + launch Claude Code as the team lead
fkit             # ...or the original Omnigent team flow
```

`fkit claude` runs `fkit-claude-init.sh`, which idempotently:
1. copies the shared `ai-agents/` scaffold (from `omnigent/scaffold/` — single source of truth),
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
