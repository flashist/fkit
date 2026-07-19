# Design a laundering-safe consent model for spawned invocation of the task movers

**Source**: `ai-agents/tasks/done/design-spawned-invocation-consent-model-for-task-movers.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · priority 63 · owner fkit-architect (owner present) · design-first

## Goal
Let another agent drive `/fkit-task-done` and `/fkit-task-cancelled` by **spawning the producer sub-agent and asking it to run them** — e.g. the coder finishes a task, spawns `@fkit-producer`, and asks it to mark the task done.

**⚠️ This reverses a locked, load-bearing decision — not an incremental change.** Three artifacts made the movers owner-only *on purpose*: the **CLAUDE.md universal hard rule**; [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] (*"Done is owner-gated, anti-laundering"* — the loop was built to run unattended **yet still stop** at that gate); and `fkit-task-done/SKILL.md`'s own rationale, *"an agent that can mark its own work complete can quietly launder unfinished work into a green board."*

### The gating problem the brief refused to let the design dodge
ADR-019 records that a rev-1 attempt to relax a gate "for a spawned/loop context" was **killed by a Codex adversarial pass**: there is **no runtime-authenticated signal for "loop context"**, so the relaxation was either unenforceable or claimable by *any* standalone invocation. The brief named the trap and demanded the design **answer it rather than restate the wish**:

- A producer **spawned as a consult has no owner channel** — its `⛔ Owner:` banner is advisory ([[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]) and `AskUserQuestion` is session-only ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]). So *"coder asks producer to mark done"* is functionally **"the coder marks its own work done"** — the exact laundering path the gate existed to block.
- The gate is enforced by **skill text**, not by the `PreToolUse` hook — the hook gates *role*, and a spawned producer legitimately **is** the producer. **Relaxation could not lean on the hook.**

The brief also required the design to rule the **done/cancelled asymmetry** explicitly rather than assume symmetry: `done` turns the board green (the laundering target), while `cancelled` records a drop with a reason.

## Key Changes
No implementation — the deliverable is `knowledge-base/reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md` (fkit-architect, spawned consult, chain `coder → architect`). Task 64 builds it and is still **backlog**.

The brief pre-enumerated the write surface so task 64 stays bounded: both SKILL.md files, the `⛔ Owner:` banners, **the CLAUDE.md universal hard rule wording**, any scaffold copies (the task-48/49 dual-home lesson), and the ADR-019 amendment.

## Outcome
**Ruled 2026-07-19 → [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]].** The relaxation was granted.

- **The architect recommended keeping the gate. The owner ruled against that recommendation, knowingly.**
- ⚠️ **No fabrication-resistant signal was found, and the ADR says so rather than papering over it.** The replacement is a **labelling convention**: an agent-closed move carries an `(agent-closed — not owner-verified)` marker. But the marker is **prose written by the same agent that performs the move**, **no code path can enforce it**, and git carries no authenticated trace because agents cannot commit — the owner authors the commit. **Prevention is removed, not downgraded to detection.**
- The ADR's honesty clause is explicit that **an ADR claiming the guarantee was preserved would be the most damaging artifact this task could produce** — which is why the vault records it verbatim rather than softened.
- **[[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] Decision 5 is amended** by this ruling — and its own re-raise clause had pre-registered exactly that amendment.
- **Any prose still asserting "owner-invoked movers only" is now stale.** The vault's instances are corrected; **product source is task 64's scope and has not shipped.**

## Related
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the ruling this task produced
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — amended by it; also the source of the rev-1 precedent that killed the closest prior attempt
- [[decisions/adr-023-fkit-git-agent-is-not-built]] — the same week's **opposite** ruling; the owner's distinction is **blast radius**
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] · [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why a spawned producer has no owner channel
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook gates role, so it could not carry this gate
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the worklog evidence evaluated as a candidate precondition
- [[systems/role-locked-sessions]] — *"what the lock does NOT cover"*
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]] · [[tasks/implement-task-ship-loop-skill]]
