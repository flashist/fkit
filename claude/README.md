# fkit on Claude Code — the runtime, in detail

This directory **is** fkit's runtime: the seven roles as Claude Code subagents (`agents/`), their
procedures as skills (`skills/`), the project scaffold (`scaffold/`), and the launcher
(`fkit-claude.sh`). They operate on the `ai-agents/` working structure — tasks, sprints, reviews,
knowledge-base, wiki-vault.

fkit once shipped a second runtime on [Omnigent](https://omnigent.ai). It was **removed** in Sprint 2:
its orchestration proved unreliable (sub-sub-agents failing to reply, dropped sessions, failed agent
connections) and it hid Claude Code's native statusbar. See
[ADR-009](../ai-agents/knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md).

## The interaction model — role-locked sessions

There is **no lead session wearing hats** and no team-root agent: Claude Code owns session lifecycle.
`fkit <role>` opens a session **locked to that role**
([ADR-010](../ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)):

```sh
fkit                # deterministic terminal menu (no LLM) → pick a role
fkit coder          # skip the menu
fkit producer | architect | reviewer | adv | wiki | lead
```

Each session is locked **two** ways:

1. **`--agent fkit-<role>`** — the role's system prompt and **tool allowlist** (harness-enforced).
2. **`--settings` wiring a `PreToolUse` skill-ownership hook** (task 43 / ADR-018) — every `Skill`
   call is checked against the REAL invoking agent's role, and denied if that role doesn't own it.
   A foreign skill stays **visible** in the `/` menu but is **not runnable**. This is what makes
   *"the coder cannot run the reviewer's procedure"* a fact rather than a request — see the "skill
   lockdown" section below for the full detail.

Want two roles at once? Open another terminal tab. (We deliberately don't automate that — spawning
terminals needs Accessibility permissions that fail worse than pressing Cmd-T.)

### The skill lockdown — the central invariant

**Role → skill ownership is declared in exactly one place:** `skills_for_role()` in
`skills-for-role.sh`, sourced by both `fkit-claude.sh` and the `PreToolUse` skill-ownership hook
below. That function is the single source of truth.

| Role | Its procedures (plus `/fkit-query` + `/fkit-team`, which everyone has; `/fkit-task-done` + `/fkit-task-cancelled`, which every role but `adversarial-reviewer` has (ADR-025); and `/fkit-open-questions-interview` + `/fkit-dumb-down`, which the six Claude-side roles have — all but `adversarial-reviewer`, which reviews on Codex under a restricted allowlist) |
|---|---|
| producer | `initiate-project` · `task-brief` · `task-done` · `task-cancelled` · `status` |
| coder | `plan-task` · `process-review` · `process-stateful-review` · `task-ship-loop` |
| architect | `survey-project` · `inspect` · `design-spec` · `evaluate-approach` · `record-decision` |
| reviewer | `review` · `stateful-review` |
| adversarial-reviewer | `adversarial-review` |
| wiki | `wiki-ingest` · `wiki-lint` · `wiki-sync` |
| lead | *(none of its own — it routes)* |

**The lock is a wall in a session AND in a consult** (task 43 /
[ADR-018](../ai-agents/knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md),
superseding [ADR-012](../ai-agents/knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)
§2's "advisory in a consult" half). A `PreToolUse` hook (`skill-ownership-hook.sh`) gates every
`Skill` call against the REAL invoking agent's identity, read straight from the hook payload — a
role session's own type, or a spawned subagent's own type, at any consult depth — not the launching
session's inherited settings. That's what fixed the bug ADR-012 could only price: a consulted role
used to see whatever the *caller* could see; now it's checked against what *it itself* owns,
wherever it sits in a consult chain. Agent-definition `skills:` frontmatter still enforces nothing
(a preload hint only) and stays dropped, not generated.

The old always-on exception list (`CONSULT_SKILLS`, plus the `skillOverrides` "off" list
`build_settings()` used to generate) is retired — enforcement no longer depends on a hand-maintained
list of skills that must stay reachable from every session; a role simply reaches what
`skills_for_role()` says it owns, checked at the point of each call.

## Consult topology

```
Owner ⇄ ROLE-LOCKED SESSION  (fkit <role> — one role, its skills, its tools)
          │ Agent tool (synchronous consult)
          ├─→ fkit-architect   ⇄ consults fkit-producer   (product context behind a technical call)
          ├─→ fkit-producer    ⇄ consults fkit-architect  (feasibility behind a product call)
          ├─→ fkit-coder        → consults architect / producer
          ├─→ fkit-reviewer     → consults architect (design intent) ──Bash──→ codex exec
          ├─→ fkit-adversarial-reviewer ──Bash──→ codex exec          [leaf — consults no one]
          └─→ fkit-wiki         (ALL wiki writes; deep research)      [leaf — consults no one]

Consult rules: max TWO hops (messages carry "hop N of 2"; at hop 2 you answer or return an open
question), never a cycle (never consult your invoker or anyone already in the chain), and the asker
keeps the decision that's theirs. Genuinely new architecture decisions go to the OWNER.
Wiki READS: any role, directly, via /fkit-query (ADR-005 — one skill, no vendoring).
```

Agent definitions are **dual-mode**: spawned as a consult they never ask the owner (they answer and
return open questions); as a session role the owner is present, so they interview freely and run their
interactive init.

## The team

| Agent (`agents/`) | Tools | Role |
|---|---|---|
| fkit-producer | Read, Grep, Glob, Bash, Write, Edit, **Agent**, AskUserQuestion | product & sprint planning, task briefs, lifecycle. Consults the architect. |
| fkit-coder | Read, Grep, Glob, Bash, Write, Edit, **Agent**, EnterPlanMode, ExitPlanMode, AskUserQuestion | implementation — sole source-write authority. Consults architect/producer. **Not for background delegation:** its plan/fix approval gates need the owner present, so run it as a session. |
| fkit-reviewer | Read, Grep, Glob, Bash, Write, Edit, **Agent**, AskUserQuestion | two-pass review (own + Codex via CLI); writes only `ai-agents/reviews/` documents. Consults the architect on design intent. |
| fkit-adversarial-reviewer | Read, Grep, Glob, Bash | findings-only hostile pass on Codex. **Structurally write-free; a leaf.** |
| fkit-architect | Read, Grep, Glob, Bash, Write, Edit, **Agent**, AskUserQuestion | architecture, design specs, ADRs, surveys. Consults the producer for product context. |
| fkit-wiki | Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion | the wiki role — **exclusive write gateway** (ingest / lint / sync). **A leaf.** |
| fkit-lead | Read, Grep, Glob, Bash, **Agent**, AskUserQuestion | the team room — routing help and wiki questions. Does no work itself. |

**Two honest limits** on the tool lock: an agent with Bash can technically still write files, and
Claude Code **ignores** `Agent(type)` allowlists inside subagent definitions (they only work for a
main-thread `--agent`), so *which* peer an agent may consult, and the two-hop cap, are
**prompt-enforced**. Path-level hook enforcement is deferred hardening (ADR-010 §Options).

## The Codex adversarial pass

Model diversity is the whole point of the second reviewer. The reviewer (and the standalone
adversarial agent) assemble a findings-only prompt + inline diff into `.fkit/tmp/`, then run:

```sh
codex exec --sandbox read-only --cd "$PWD" - < .fkit/tmp/adversarial-prompt.md
```

**Codex is required, not optional.** `fkit` preflights it at launch (installed? logged in?) and warns
loudly — but does not wall you out. If Codex is unreachable mid-session, the review still runs and is
emitted as a **flagged partial**: the reviewer's verdict is forced to `🟡 Partial review — Codex
unavailable`, and the output leads with `[NOT model-diverse — INCOMPLETE]` **above the findings**. A
one-model pass that reads like a full review carries unearned confidence — worse than no review.

Codex reads the project's `AGENTS.md` natively, which is why init drops that file.

## Install & run

```sh
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh   # once

cd /path/to/your/project
fkit                 # menu → pick a role
fkit architect       # ...or straight to one
fkit update          # update fkit itself (it notifies; it never auto-updates)
```

`fkit` runs `fkit-claude-init.sh`, which idempotently:
1. copies the `ai-agents/` scaffold (from `scaffold/` — single source of truth),
2. drops `CLAUDE.md` (team map) and `AGENTS.md` (codex reads it),
3. refreshes `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/` from here,
4. installs the `.fkit/interview` terminal intake (fresh projects → `.fkit/intake.md`),
5. gitignores the fkit-managed copies (`.fkit/`, `.claude/agents/fkit-*.md`, `.claude/skills/fkit-*/`).

On a fresh project it launches the producer seeded to run `/fkit-initiate-project`; otherwise it shows
the menu.

The `.claude/` copies are fkit-managed and refreshed on every init — **edit the canonical sources here
in `claude/`, never the copies.**

## What deliberately does not exist

- **A team-root agent / reconnect / restart machinery** — Claude Code owns its sessions; there is
  nothing to reconnect. Those verbs existed only to paper over Omnigent orchestration failures.
- **Vendored per-agent `query` copies + sync script + drift check** — one `/fkit-query` skill serves
  every role (ADR-005; ADR-004/006/007 died with the Omnigent path).
- **`skills:` frontmatter on agent definitions** — inert for enforcement; dropped (ADR-012).
- **A hand-maintained `CONSULT_SKILLS` always-on exception list** — superseded by the `PreToolUse`
  skill-ownership hook (task 43 / ADR-018), which no longer needs one: enforcement follows the real
  caller's identity instead of a list of skills nothing is allowed to turn off.
