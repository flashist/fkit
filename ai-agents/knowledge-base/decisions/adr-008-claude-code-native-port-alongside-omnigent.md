# ADR-008: Claude Code native port, alongside Omnigent

- **Status:** accepted
- **Date:** 2026-07-11
- **Deciders:** owner (with Claude Code)

## Context

fkit's hard constraint since initiation was **Omnigent-only** (PROJECT.md "Conventions &
constraints"). In practice Omnigent's orchestration proved unreliable for the owner: sub-sub-agents
failing to reply back to their spawners, sessions failing, agent connections dropping — the exact
failure classes the reconnect/restart tooling (`omnigent/fkit-reconnect.sh`,
`omnigent/fkit-team-restart.sh`) was built to patch around. Running through Omnigent also hides
Claude Code's native statusbar (context usage, limits). Meanwhile Claude Code natively provides the
primitives the team actually needs: custom subagents (`.claude/agents/*.md` with per-agent tool
allowlists and system prompts), skills (`.claude/skills/*/SKILL.md`, `$ARGUMENTS`-compatible), and
a stable, resumable interactive session. Its experimental "agent teams" peer mode was evaluated and
rejected for v1 (experimental flag, teammate resume broken, no nesting, Claude-only teammates).

## Decision

Port the fkit team to **Claude Code native**, living **alongside** the Omnigent implementation as a
peer top-level directory `claude/` (agents, skills, scaffold CLAUDE.md, init + launcher scripts,
installed by `install.sh`, dispatched by `fkit claude`). The shared, runtime-agnostic `ai-agents/`
file contracts (task briefs, sprint plans, the review ledger, knowledge-base, wiki-vault) are the
portability layer — both flavors operate on the same tree, and the scaffold stays single-sourced in
`omnigent/scaffold/`.

Key shape decisions:
- **Subagents-first; the interactive session is the team lead — and the coder by default.** There is
  no fkit-team root agent: Claude Code owns session lifecycle. Self-contained work (review passes,
  survey-project, all wiki writes, focused consults) runs as subagents.
  *(**Amended 2026-07-11**, before release — see "Amendment: peer consults and role access" below.
  The original decision also said "consult nesting is capped at one level; subagents carry no Agent
  tool" and routed all owner-interactive work through the lead session. Both are superseded.)*
- **The reviewer runs as a subagent, two-phase.** Independence from the coder-tainted lead context
  is the point of the role. Its owner-questions return in its final message; the lead relays them
  and re-invokes with the decisions; the stateful ledger carries all state between phases.
- **Model diversity survives via the codex CLI.** The adversarial pass runs
  `codex exec --sandbox read-only --cd "$PWD" -` with a findings-only prompt + inline diff
  (assembled in `.fkit/tmp/`). Degradation is mandatory and loud (`🟡 Partial review — codex
  unavailable`; standalone fallback labeled `[claude-fallback — NOT model-diverse]`).
- **Tool allowlists add structural enforcement** on top of the prompt rules: the adversarial
  reviewer gets no Write/Edit at all; every agent gets an explicit allowlist. **Deviation, flagged:**
  the lead reviewer *keeps* Write/Edit — it must write the *Reviewer findings* section of the shared
  ledger (`ai-agents/reviews/<task-id>.md`), a core contract; its "documents under `ai-agents/reviews/`
  only" boundary stays prompt-enforced.
- **One `fkit-query` skill replaces the vendored copies.** Reads stay decentralized (ADR-005's
  intent) with zero distribution machinery.

## Options considered

- **Port alongside Omnigent (chosen)** — keeps the working Omnigent path as fallback while the
  native port proves itself; consuming projects migrate per-project via `fkit claude` vs `fkit`.
- **Full replacement** — cleaner end state, but burns the fallback while known native gaps exist
  (e.g. no per-subagent token/limit dashboards either).
- **Agent-teams-first (experimental peer mode)** — closest to the Omnigent topology, rejected:
  experimental, teammate resume broken, no nesting, teammates Claude-only (breaks the Codex
  adversarial design), higher token cost.

## Consequences

- **Positive:** first-party reliability (the Omnigent failure classes — lost replies, dead
  runners — have no equivalent; there is nothing to reconnect); full native statusbar; structural
  tool restrictions; drastically less machinery (no vendoring, no sync/drift scripts, no
  session-cache/reconnect/restart tooling on this path).
- **Negative / costs:** dual-runtime maintenance — behavior changes must be mirrored in both
  `omnigent/fkit-*` bundles and `claude/` agents/skills by hand (no shared source); the
  reviewer's owner-dialogue is a two-phase relay rather than direct; the lead session wears
  multiple hats (producer/architect/coder), relying on skills for role discipline rather than
  separate sessions.
- **Scope of prior ADRs narrowed:** ADR-004 (fixed consult titles) and ADR-005/006/007 (vendored
  query distribution mechanics) are **omnigent-path-only** from now on. ADR-005's *principle*
  (reads decentralized, writes exclusive to the wiki agent) applies to both paths.
- **Residual risks / "re-raise only if":**
  - *Bash escape hatch:* a tool allowlist without Write/Edit does not stop `Bash` from writing
    files; boundaries remain substantially prompt-enforced. Re-raise if hooks-based path-level
    write enforcement (e.g. PreToolUse deny outside `ai-agents/reviews/` for the reviewer) lands —
    then tighten the allowlists to match.
  - *Two-phase reviewer interactivity:* re-raise if Claude Code subagents gain a native
    owner-dialogue channel — collapse to single-phase then.
  - *No claude-path self-update logic:* `fkit update` refreshes the whole share (both flavors);
    re-raise only if the claude path needs independent versioning.
  - *Agent-teams mode:* re-raise as an opt-in launch mode once teams exit experimental status and
    support resume + non-Claude teammates.

## Amendment: peer consults and role access (2026-07-11, pre-release)

The first cut of this ADR gave subagents **no** `Agent` tool (nesting capped at one level) and made
every role reachable only as a side effect of invoking a skill. Both were wrong for the owner's actual
goal — *a team that mimics a real software team and can talk to itself*. Amended in place because
nothing had shipped.

**Peer consults — two hops, cycle-guarded.** `fkit-architect`, `fkit-producer`, `fkit-coder`, and
`fkit-reviewer` now carry the `Agent` tool and consult each other directly (architect ⇄ producer,
coder → architect/producer, reviewer → architect on design intent). `fkit-adversarial-reviewer` and
`fkit-wiki` stay **leaves** — they consult no one. The guard rails, since they cannot be structural
(see below): a **hop budget** (the lead's invocation is hop 0; every consult message states "hop N of
2"; at hop 2 an agent must answer or return an open question — capping the tree at depth 3 against
Claude Code's fixed native limit of 5), **no cycles** (never consult your invoker, or anyone already
named in the chain, which each message carries), **the asker keeps their own decision**, and
**genuinely new architecture decisions escalate to the owner** rather than being settled between
agents. This is deliberately *not* Omnigent's unbounded spawn-and-inbox chain: consults are
synchronous, first-party, depth-capped, and cycle-free.

**Role access — three explicit paths.** (1) **Hat skills** `/fkit-agent-<role>` for all six roles: the
session reads `.claude/agents/fkit-<role>.md` (single source of truth) and holds that role until
switched. (2) **`@fkit-<role>`** one-off dispatch (native, free). (3) **`fkit claude <role>`** → `claude
--agent fkit-<role>`, a session locked to the role, opening with its own briefing via the
`initialPrompt` frontmatter. Agent bodies are now **dual-mode**: as a spawned consult they never ask
the owner (answer + return open questions); as a session role they interview freely.

**Consequences of "hats for all six" (owner's call), and the guards that keep the invariants:**
- *Reviewer independence* is a property of a **fresh context**, not of the prompt. `/fkit-agent-reviewer`
  therefore runs an independence check first: if the session already edited code this run, it warns
  loudly and offers `/fkit-review` (fresh subagent) or `fkit claude reviewer` (fresh session), and if
  the owner proceeds anyway, the non-independence is carried into the verdict line.
- *The wiki write-gateway* invariant is restated precisely: **only the wiki role writes
  `ai-agents/wiki-vault/`** — as the agent, or worn as the `/fkit-agent-wiki` hat (which means holding
  the librarian's rules). It was never "only a subagent may write"; this wording is now used everywhere.
- **fkit-coder is promoted from a thin charter to a real agent** (full tools + the real coder prompt).
  Its plan/fix approval gates need the owner present, so it remains unsuitable for *background*
  delegation — but as the lead, a hat, or a `--agent` session, the owner *is* present and it works.

**New residual risk / "re-raise only if":** Claude Code **ignores `Agent(type)` allowlists inside
subagent definitions** (they apply only to a main-thread `--agent`), so *which* peer an agent may
consult — and the two-hop cap — are **prompt-enforced, not structural**. A confused or adversarial
agent could consult outside the intended graph. Re-raise if Claude Code gains per-subagent spawn
allowlists, or if `permissions.deny` proves usable to block specific agent types per role — then make
the graph structural.

## Related

- `claude/README.md` — the port write-up (topology, codex wrapper, init flow).
- `omnigent/README.md` — the Omnigent flavor.
- [adr-004](adr-004-fixed-role-based-titles-for-consult-spawns.md),
  [adr-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md),
  [adr-006](adr-006-symlink-vendored-query-skill-not-copy.md),
  [adr-007](adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill.md) —
  now scoped omnigent-path-only.
- `ai-agents/knowledge-base/PROJECT.md` — the constraint this ADR supersedes ("Omnigent-only").
