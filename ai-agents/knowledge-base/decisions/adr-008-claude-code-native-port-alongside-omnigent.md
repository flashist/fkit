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
- **Subagents-first; the interactive session is the team lead — and the coder.** There is no
  fkit-team root agent: Claude Code owns session lifecycle. Owner-interactive work (interviews,
  plan approvals, task lifecycle, architect design work) runs in the lead session via `/fkit-*`
  skills; self-contained work (review passes, survey-project, all wiki writes, focused consults)
  runs as subagents. Consult nesting is capped at one level; subagents carry no Agent tool.
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

## Related

- `claude/README.md` — the port write-up (topology, codex wrapper, init flow).
- `omnigent/README.md` — the Omnigent flavor.
- [adr-004](adr-004-fixed-role-based-titles-for-consult-spawns.md),
  [adr-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md),
  [adr-006](adr-006-symlink-vendored-query-skill-not-copy.md),
  [adr-007](adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill.md) —
  now scoped omnigent-path-only.
- `ai-agents/knowledge-base/PROJECT.md` — the constraint this ADR supersedes ("Omnigent-only").
