# ADR-023: `fkit-git` is not built — commit/push stays a manual owner action; the "never commit unprompted" hard rule stands unchanged

- **Status:** accepted
- **Date:** 2026-07-18
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect

## Context

The owner asked (2026-07-17) for a new agent, `fkit-git`, with one skill — `commit-push` (commit and
push all uncommitted working-tree changes with a caller-supplied title/message) — **invocable by other
agents** (task 55, `design-fkit-git-agent-and-consent-model.md`).

The design spec ([`reports/2026-07-18-design-fkit-git-agent-and-consent-model.md`](../reports/2026-07-18-design-fkit-git-agent-and-consent-model.md))
surfaced the head-on collision with the universal hard rule at `CLAUDE.md:49` — *"Never commit or push
unless the owner explicitly asks"* — and laid out three consent models: **(a) owner-only**, **(b)
explicit-relay**, **(c) rule amendment**.

In session on 2026-07-18 the owner first ruled **(c), fully unattended** — any agent may trigger a
commit **and push** with no human in the loop — then **reversed the decision within the same session.**
The reason, in the owner's own framing: **an agent that commits and pushes whatever is uncommitted,
unattended, is the highest-risk possible surface for accidentally committing and pushing sensitive or
unintended information to a remote** — where it is irreversible-ish and has escaped the local repo. That
risk outweighs the convenience of an agent-invocable git helper. The *"no secrets in any artifact — it
all goes to git"* hard rule is precisely what an unattended `commit-push` would put at the mercy of an
agent's judgment.

## Decision

**`fkit-git` will not be built.** Concretely:

1. **No `fkit-git` agent, no `commit-push` skill.** No `claude/agents/fkit-git.md`, no skill directory,
   no `skills-for-role.sh` entry, no ADR-018 hook coverage, no launcher-menu change.
2. **The universal hard rule stands UNCHANGED and is reaffirmed, not amended.** *"Never commit or push
   unless the owner explicitly asks"* (`CLAUDE.md:49` and the scaffold's) remains in force, verbatim, in
   every agent file and `claude/scaffold/CLAUDE.md`. **Commit and push stay a manual action the owner
   performs** (or explicitly instructs in-session). No agent gains commit/push authority.
3. **The team stays seven role-scoped agents.** No count/roster ripple; the "team of seven" assertions
   in `CLAUDE.md`, `PROJECT.md`, `architecture.md`, `README.md`, the wiki, the launcher menu, and
   `fkit-team` are all left as-is.
4. **The design spec is retired as history.** [`reports/2026-07-18-design-fkit-git-agent-and-consent-model.md`](../reports/2026-07-18-design-fkit-git-agent-and-consent-model.md)
   is marked superseded by this ADR — kept as the record of what was weighed, not a live design.
5. **Task 55 is cancelled; task 56 (implementation) is not created.** *(Moved via the owner-invoked
   `/fkit-task-cancelled` — the architect does not move task files.)*

## Options considered

- **Do not build it; commit/push stays a manual owner action (chosen).** Keeps the core safety
  guarantee intact and opens no new surface for leaking secrets to a remote. Cost: git work stays
  manual; no agent can offload commits.
- **(a) Owner-only `fkit-git`** — commits only on the owner's explicit in-session trigger. Rejected: it
  reduces to *"the owner commits manually,"* just with an extra agent in the way. The helper's entire
  value was agent-invocability; owner-only removes exactly that, so it is not worth a new agent.
- **(b) Explicit-relay** — an agent fires `commit-push` carrying the owner's recorded "yes". Rejected:
  it is the relayed-consent shape task 52's D1 already rejected for the task-mover, and it still creates
  an agent-driven path to a remote.
- **(c) Rule amendment, fully unattended** — any agent may commit+push headlessly. **Rejected by the
  owner after initially choosing it:** the accidental-secret-to-remote risk is unacceptable; it dissolves
  the one guarantee (`CLAUDE.md:49`) that keeps stray content out of git history and off the remote.

## Consequences

- **Positive:**
  - The universal *"never commit/push unprompted"* guarantee is **intact and reaffirmed** — nothing
    weakened, no ADR amending a hard rule, no rule rewrite across the agent files or the scaffold.
  - **No new surface for leaking sensitive information to a remote.** The highest-risk path considered
    is closed by not building it.
  - No seven→eight agent-count/roster ripple; less to build and maintain.
- **Negative / costs:**
  - **Git work stays manual.** No agent can offload commits/pushes; the owner (or an explicit in-session
    instruction to a role that already holds `Bash`) does it. Accepted knowingly — the safety of the
    remote is worth the manual step.
- **Residual risks / "re-raise only if":**
  - **A future need for an agent-driven git helper arrives with a consent model that *structurally*
    prevents committing or pushing sensitive/unintended content without human review.** Note the bar:
    the owner-only model (a) reduces to manual owner commits, so any re-raise must show genuine value
    **beyond** "the owner does it by hand" *and* a structural — not prose — guarantee against the
    accidental-secret-to-remote failure this ADR rejects. **Convenience alone is not a trigger.**
  - Do **not** re-raise "an agent should be able to commit so the ship-loop can finish hands-free" — the
    ship-loop already **does not commit** (it stops at the owner-invoked gates by design, ADR-019 / task
    52 D1); wanting it to commit unattended is the exact risk this ADR declined.

## Related

- `CLAUDE.md:49` — the universal hard rule this ADR **reaffirms** (rather than amends).
- Task 52 / D1 — the owner-invoked-mover precedent and the rejected relayed-consent shape (why option
  (b) was inconsistent).
- [ADR-016](adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) — every agent holds
  the universal hard rules, including the reaffirmed commit rule.
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) — the ship-loop's owner
  gates; it does not commit, which is why "let an agent commit" is not needed to finish a loop.
- Superseded design: [`reports/2026-07-18-design-fkit-git-agent-and-consent-model.md`](../reports/2026-07-18-design-fkit-git-agent-and-consent-model.md).
- Task: `ai-agents/tasks/backlog/design-fkit-git-agent-and-consent-model.md` (task 55 — to be cancelled
  by the owner-invoked `/fkit-task-cancelled`).
