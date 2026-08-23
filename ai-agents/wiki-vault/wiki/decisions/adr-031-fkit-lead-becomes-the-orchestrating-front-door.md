# ADR-031: `fkit-lead` becomes the orchestrating front door — the "not a doer" stance is reversed

**Date**: 2026-07-22
**Status**: accepted

> ⚠️ **This reverses [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] §Decision 3** — *"`fkit-lead` (the team room) is a router, not a doer."* ADR-010's Decisions 1, 2, 4 and 5 are **unaffected**. The reversal is deliberate and owner-ruled, not drift.

**Source**: `ai-agents/knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md`
**Evidence**: `ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`

## Context

The owner wanted **one agent per terminal** — a single point of interaction aware of the whole toolkit, that drives the other roles as needed, so they need not open a session per role until they genuinely need to. The ruling (2026-07-22): **grow the existing `fkit-lead`, keep the name**, into a conductor that can spawn *anybody* — producer, architect, coder, reviewer, wiki, and future roles — give them a task, wait for completion, then push the process further.

**Why this is a real reversal, not drift.** ADR-010 made lead a router *"with no Write or Edit tools, deliberately"* precisely because a long-lived session that *does everything* is the context-accumulation failure role-locking was built to kill.

**Three harness facts settled feasibility** — all corrected against live code, because `architecture.md` still described the retired `skillOverrides` mechanism at the time (fixed by task 0115):

1. **Skill ownership follows the real caller's `agent_type` at any spawn depth** ([[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]). A subagent spawned as `@fkit-coder` **may run coder-owned skills** — so the skill lockdown is *not* the blocker to orchestration. The corollary is binding: a **non-fkit** subagent (`general-purpose`, `Explore`) carries no fkit identity and is denied every `fkit-*` skill, so the conductor must spawn **typed `fkit-<role>`** workers, never generic helpers, for any step that runs an fkit procedure.
2. **The owner channel is session-only** ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]). A spawned worker **cannot ask the owner**; only the top-level session can.
3. **Consult topology is prompt-enforced.** The conductor's spawn discipline is carried by prompt, not runtime.

## Decision

1. **`fkit-lead` gains an orchestrator remit and keeps its router remit.** Given a goal it spawns whatever typed role it needs, assigns one bounded unit of work, awaits the return, relays any surfaced decision to the owner, and advances. Routing ("who do I need?", `/fkit-query`, one-off `@role` consults) survives and does **not** spin up an orchestration.
2. **The conductor is a conductor, not a performer.** It **never writes source and never reviews.** Every role's actual work runs in that role's **own fresh spawned context** — so reviewer independence is *preserved*: the review of code the coder wrote still happens in a different context than wrote it. Orchestration **sequences** separate contexts; it does not merge proposal, build and approval into one.
3. **The driver session holds the owner channel; workers return questions, never ask them.** A worker that hits a decision **returns** it as structured text (`NEEDS-DECISION { question, options, recommendation, context }`); the driver calls `AskUserQuestion` and **blocks on a real owner answer**, then spawns the next unit with the answer folded in. This is ADR-021's own *"return open questions"* contract applied at scale — built **on** the constraint, not against it.
4. **ADR-010's other decisions stand.** Sessions stay role-locked; role separation stays structural via the ADR-018 hook; cross-role work is still a consult, never a role switch; `skills_for_role()` stays the single source of truth. The conductor **spawns consults**; it does not role-switch.
5. **No new role.** Lead's *nature* changes, not the team count — the seven→eight question ([[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]]) is untouched.

## The plan-gate honesty clause — the one accepted cost

**On the orchestrated implementation path, "no code before the owner approves the plan" downgrades from a runtime write-wall to prose.** `fkit-task-ship-loop`'s plan gate is protected by Claude Code **plan mode** — a *session* write-wall and [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]'s one unremovable checkpoint. Plan mode is interactive and **cannot function in a spawned worker**. So under orchestration the driver enforces ordering by splitting it: spawn coder **for the plan only** (*"write no source, return the plan"*) → owner approves → spawn coder **to implement**.

**The "write nothing yet" is a prose instruction in the worker prompt, not a runtime wall.** A confused or injected worker could write before approval and nothing structural stops it. Same shape as [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]]'s honesty clause. **The owner accepted it knowingly.** Owners who want the structural wall still ship the task the old way: `fkit coder` + `/fkit-task-ship-loop`.

## Consequences

- **Positive:** one agent per terminal that drives the whole team; reviewer independence and the coder's sole-source-write authority **preserved** (fresh spawned contexts, conductor writes no source); reuses the ADR-018 hook and existing launcher control flow — no launcher control-flow change, one new owned skill, a wider prompt.
- **Negative, stated plainly:**
  - **The plan-gate downgrade** (above) — the biggest change to fkit's guarantee surface; accepted, unmitigated on the orchestrated path.
  - **Orchestrator context accumulation.** A sprint-long driver accumulates every task's plan, diff and review. Mitigated because the *work* runs in fresh contexts; residual: a driver that starts *judging* instead of delegating becomes the ADR-010 anti-pattern. **Prose-enforced discipline** ("delegate, never substitute").
  - **Doc-drift blast radius:** the four `skills_for_role()` mirrors, launcher text, agent prompt, `PROJECT.md`, the wiki — plus the independent `architecture.md` §5.2 stale-lock fix.
- **Do not re-raise** *"lead is a router that does no work"* — that is what this ADR reverses. **Do not re-raise** *"the orchestrated plan gate is only prose"* — stated here knowingly; a finding must show it **failing in practice**, not restate its known limit.

## Related
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — §Decision 3 **reversed**; 1, 2, 4, 5 unaffected
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the flagship application of this conductor
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — later amends this conductor's close step
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the **enabling fact**
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the session-only owner channel this is built on
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — lead already inherited Write/Edit; corrects the stale "no tools" prose
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — the declined auto-proceed; live-relay is the opposite move
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the honesty-clause precedent
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the team-count question this does **not** touch
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — the design that produced this
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — the agent-definition build
- [[tasks/update-launcher-menu-help-for-conductor]] · [[tasks/amend-project-brief-for-lead-conductor]] · [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — the doc ripple
- [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] — lead becomes menu option **1**, "team room" retired
- [[systems/fkit]] · [[systems/role-locked-sessions]]
- [[systems/install-and-self-update]] — Install, Launcher & Self-Update
- [[tasks/build-fkit-sprint-ship-loop-skill]] — Build the `fkit-sprint-ship-loop` skill (the lead's sprint-scope conductor loop)
- [[tasks/retire-team-room-in-docs-and-agent-definitions]] — Retire "team room" in the docs and agent definitions, and fix the stale "menu 7" citations
- [[tasks/route-sprint-ship-loop-close-to-producer]] — Rewrite the `fkit-sprint-ship-loop` close step — driver self-close → spawn the producer
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] — Wire `fkit-sprint-ship-loop` into `skills_for_role()` + the four mirrors (same commit)
- [[tasks/add-no-secrets-rule-to-fkit-lead]] — making lead the conductor is the second reason that task's *"least able to leak a secret"* argument no longer holds; the no-secrets rule it added matters more, not less
- [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] — task 0117, the vault ingest of this conductor reversal (and of the design's declined **"split"** alternative, which would have kept plan mode's write-wall)
- [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] — task 0118: the ADR-032 amendment whose accepted cost is **this ADR's honesty clause applied one step later**
- [[tasks/track-fkit-coder-declared-approval-carve-out]] — task 0119, the `fkit-coder.md` guarantee-surface change that made the orchestrated Build step possible — **owner-verified, marker deliberately refused**
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — `0141`, which had to judge the vault's stale *"does no work"* claim
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the honesty clause, and the prose-enforced-consent posture ADR-037 inherits deliberately
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162` — the plan gate's carry construction, and the confirmed live failure of it
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202` — why the driver writing `plan.md` is **not** a breach of Decision 2's *delegate, never substitute*
- [[tasks/append-a-dated-correction-note-to-adr-010]] — task `0143` — the ⛔ reversal notice this ADR's §Decision 1 earned on ADR-010
- [[tasks/pressing-enter-at-the-role-menu-should-open-the-lead]] — ⚠️ *Added 2026-08-22:* task `0302` — the front door becomes the launcher's Enter default
