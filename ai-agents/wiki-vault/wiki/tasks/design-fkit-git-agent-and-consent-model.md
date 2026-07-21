# Design the `fkit-git` agent + commit/push consent model

**Source**: `ai-agents/tasks/cancelled/0027-design-fkit-git-agent-and-consent-model/brief.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 2 — priority 55. Cancelled 2026-07-19 — not pursuing git automation.

## Goal
Design an eighth agent, `fkit-git`, with one skill — `commit-push` (commit and push all uncommitted working-tree changes with a caller-supplied message) — **invocable by other agents**, so roles could offload git work.

## Key Changes
The design was produced and is retained as history. It surfaced the head-on collision with the universal hard rule *"Never commit or push unless the owner explicitly asks"* and laid out three consent models: **(a) owner-only**, **(b) explicit-relay**, **(c) rule amendment**.

## Outcome
**Cancelled — settled, not deferred.** The owner ruled in session on 2026-07-18: first **(c), fully unattended**, then **reversed within the same session**. His reasoning: an agent that commits and pushes whatever is uncommitted, unattended, is **the highest-risk possible surface for accidentally pushing sensitive or unintended information to a remote**, where it has escaped the local repo. That risk outweighs the convenience.

**The hard rule stands unchanged and reaffirmed. fkit will not gain a commit/push agent, and the team stays seven roles.** Recorded as [[decisions/adr-023-fkit-git-agent-is-not-built]]; the design spec is marked superseded by it — the record of what was weighed, not a live design. Its implementation sibling, [[tasks/implement-fkit-git-agent-and-commit-push]] (task 56), was cancelled with it.

**Do not re-raise on convenience.** The ADR sets an explicit bar: a re-raise must show value beyond *"the owner does it by hand"* **and** a structural — not prose — guarantee against pushing sensitive content without human review.

## Related
- [[decisions/adr-023-fkit-git-agent-is-not-built]] — the ruling that cancelled this task
- [[tasks/implement-fkit-git-agent-and-commit-push]] — task 56, cancelled with this parent
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the same week's opposite ruling for the task movers; the distinction is blast radius
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the ship-loop does not commit, so no git agent is needed to finish a loop
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the *other* eighth-role proposal; declined, where this one was accepted
