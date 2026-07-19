# ADR-023: `fkit-git` is not built — commit/push stays a manual owner action

**Date**: 2026-07-18
**Status**: accepted

## Context
The owner asked (2026-07-17) for an eighth agent, `fkit-git`, with one skill — `commit-push` (commit and push all uncommitted working-tree changes with a caller-supplied message) — **invocable by other agents** (task 55). The design spec surfaced a head-on collision with the universal hard rule *"Never commit or push unless the owner explicitly asks"* (`CLAUDE.md:49`) and laid out three consent models: (a) owner-only, (b) explicit-relay, (c) rule amendment.

**In session on 2026-07-18 the owner first ruled (c) — fully unattended, any agent may commit and push with no human in the loop — then reversed within the same session.** His framing: an agent that commits and pushes whatever is uncommitted, unattended, is **the highest-risk possible surface for accidentally pushing sensitive or unintended information to a remote**, where it has escaped the local repo and is near-irreversible. The *"no secrets in any artifact — it all goes to git"* hard rule is exactly what an unattended `commit-push` would put at the mercy of an agent's judgment.

## Decision
1. **`fkit-git` will not be built** — no agent file, no skill dir, no `skills-for-role.sh` entry, no hook coverage, no launcher-menu change.
2. **The universal hard rule stands UNCHANGED and is reaffirmed, not amended.** Commit and push stay a manual action the owner performs (or explicitly instructs in-session). **No agent gains commit/push authority.**
3. **The team stays seven roles.** No count/roster ripple anywhere.
   > ⚠️ **No longer current — superseded on the count claim only, 2026-07-19.** [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] authorizes an eighth seat (a **tester**), so the roster ripple this ADR avoided **is now owed**. **ADR-023 is NOT superseded as a whole**: Decision 3 was a *consequence* of declining a git agent, not an independent constraint, and Decisions 1, 2, 4 and 5 — including the reaffirmed *"never commit or push unprompted"* hard rule — **stand unchanged**.
4. The design spec is retired as history — the record of what was weighed, not a live design.
5. Task 55 cancelled; task 56 (implementation) never created.

**Why the alternatives lost:** (a) owner-only reduces to *"the owner commits manually, with an extra agent in the way"* — the helper's entire value was agent-invocability. (b) explicit-relay is the relayed-consent shape task 52 already rejected, and still creates an agent-driven path to a remote. (c) was chosen then reversed on the secret-leak risk.

## Consequences
- The *"never commit/push unprompted"* guarantee is **intact and reaffirmed** — no hard rule weakened, no rewrite across agent files or the scaffold.
- **No new surface for leaking sensitive information to a remote.** The highest-risk path considered is closed by not building it.
- **Cost, accepted knowingly: git work stays manual.** No agent can offload commits.
- **Re-raise only if** a future need arrives with a consent model that *structurally* prevents pushing sensitive content without human review. Note the bar: owner-only reduces to manual commits, so a re-raise must show value **beyond** "the owner does it by hand" **and** a structural — not prose — guarantee. **Convenience alone is not a trigger.** Do **not** re-raise "an agent should commit so the ship-loop finishes hands-free" — the ship-loop already does not commit by design.

**Contrast with [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] (same week, opposite ruling):** commit/push stays owner-only; task moves were relaxed. The distinction the owner drew is **blast radius** — a bad push is public and hard to reverse; a bad task move is a file rename in a working tree.

## Related
- [[tasks/design-fkit-git-agent-and-consent-model]] — task 55, cancelled by this ADR
- [[tasks/implement-fkit-git-agent-and-commit-push]] — task 56, cancelled with its parent
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the deliberate divergence from this ADR's "prepare, never fire" precedent
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the ship-loop does not commit, which is why no git agent is needed to finish a loop
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — every agent holds the reaffirmed commit rule
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the eighth seat that *did* land, making this ADR's Decision 3 stale; its seven→eight ripple table is reused from task 55's design spec
- [[systems/role-locked-sessions]]
- [[tasks/give-codex-the-universal-hard-rules]]
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — task 63, the opposite ruling the same week; the distinction is blast radius
