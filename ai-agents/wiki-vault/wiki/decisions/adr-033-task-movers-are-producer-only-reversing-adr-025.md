# ADR-033: The task movers are producer-only again — ADR-025's "any role" grant is reversed

**Date**: 2026-07-23
**Status**: accepted

> ⚠️ **This reverses [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] Decisions 1–2.** Read the two together: ADR-025 gave the movers to every role but the adversarial reviewer and said plainly that prevention was gone; this takes them back. **A vault page that still says "any role may close" is stale.**

**Source**: `ai-agents/knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md`

> **In one line:** only **`fkit-producer`** may run the task movers; every other role — wiki, coder, reviewer, architect, and the evolved lead/orchestrator — **routes closes through the producer** and closes nothing itself.

## Context

ADR-025 (2026-07-18/19) removed the owner-only close gate and granted `/fkit-task-done` and `/fkit-task-cancelled` to every role but the adversarial reviewer, accepting knowingly that prevention was gone and only a prose marker remained.

**Task 0108 surfaced the cost from the wiki's side.** A wiki task whose vault work was finished sat `🔄 In progress` on the board for roughly a week (task 80; and the six batched syncs had the same shape) because the wiki never invoked the close authority it had — the completion signal lived only in `log.md`, which no board tool reads. The investigation recommended the **wiki self-close**. **The owner ruled the opposite, and more broadly than the wiki:**

> *"Nobody should be able to run the `fkit-task-done` skill except the producer agent. If needed, wiki can ask the producer to run it… Keep the wiki-agent wiki-only."* (owner, 2026-07-23)

Offered three readings — no-self-close / **producer-only strict** / producer+orchestrator — each with its ripple stated, the owner chose **producer-only strict**, including the explicit consequence that ADR-032's orchestrator-close and ADR-019's coder self-close both stop. The driver is a deliberate re-consolidation of close authority into the one role whose job is the task lifecycle, reversing the ergonomics-for-guarantee trade ADR-025 made.

## Decision

1. **Only `fkit-producer` owns the movers.** `skills-for-role.sh` drops both from `lead, coder, architect, reviewer, wiki`; `producer` keeps them. The [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] `PreToolUse` hook then **denies** a mover call from any non-producer identity **at any spawn depth** — which makes the rule **structural**, unlike ADR-025's prose. The adversarial reviewer never had them and still does not.
2. **The wiki stays wiki-only.** It **flags** completion (ends its report with an explicit *"task N ready to close"*) and the producer runs the mover. This is task 0108's resolution — the investigation's own recommendation is **revised** to match this ADR.
3. **The coder ship-loop no longer self-closes** (amends [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] §Decision 5). Step 9 becomes *route the close to the producer*. **ADR-019's plan gate is untouched**; only its terminal act changes.
4. **The orchestrator closes through the producer** (amends [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]]). `fkit-sprint-ship-loop` spawns `@fkit-producer` per shipped task; the evolved lead does not hold the movers.
5. **The agent-closed marker persists for agent-performed closes.** A producer **spawned** by another agent to close still writes `✅ Done (agent-closed — not owner-verified)`; only a producer **session with the owner present** yields an owner-verified close.

## The limit — this does not fully restore ADR-025's lost guarantee

ADR-025 established that *"the coder spawns the producer and asks it to mark done"* is functionally *"the coder marks its own work done with an extra hop"* — a spawned producer has no owner channel (ADR-021) and its `⛔ Owner:` banner is advisory. **That remains true here.**

Producer-only re-establishes **separation of the closing *identity*** — the doer role can no longer flip its own board green **under its own identity**, and that part is hook-enforced. It does **not** restore *prevention*: a determined doer can still spawn a producer to close. The win is structural role-separation at the mover, **not a laundering-proof gate**. Do not "harden" beyond the ADR — that residual is accepted and named.

## Options considered

Recorded because this page's re-raise clause points at *"the rejected 'producer + orchestrator' option"* without saying what it was.

- **Producer-only, strict — chosen.** Re-consolidates close authority in the lifecycle role and makes it hook-structural. Cost: unwinds the coder ship-loop's self-close and the orchestrator's direct close; both gain a producer-spawn hop. Does not fully prevent extra-hop laundering (see §The limit).
- **No self-close; the spawner or producer may close.** The doer never closes its own task, but the orchestrator may close work it delegated. Offered; **rejected by the owner** in favor of the stricter rule.
- **Producer + orchestrator only.** An explicit two-role allowlist. Offered; **rejected** — the owner wanted the single lifecycle role, not two. *This is the option the re-raise clause names as the fallback if the added spawn hop proves clunky enough to hurt.*
- **Keep ADR-025 (any role + marker).** The status quo. Rejected: the owner was re-consolidating close authority — the wiki's stuck marker (task 0108) was the trigger, the general preference the reason.

## Consequences

- **Positive:** close authority is one role again **and hook-structural**, not prose — *"a role cannot close its own task under its own identity"* becomes a fact of the runtime; the wiki is cleanly wiki-only and 0108's stuck marker gets a real owner; the lifecycle is coherent (the role that plans and files also closes).
- **Negative, stated plainly:**
  - **The coder ship-loop's autonomy narrows.** Autonomous shipping now ends at a **producer hand-off, not a green board**.
  - **The orchestrator gains a producer-spawn per task** — more spawns, one more hop before a task leaves the board.
  - **Extra-hop laundering is not closed** (above); the marker still carries the only signal and it is **still invisible in `/fkit-status`** (unchanged from ADR-025).
  - **Doc/skill ripple:** `skills-for-role.sh` + four human mirrors; both ship-loops' close steps; the movers' own SKILLs; the hook test. **The mirror checklist proved not to be a complete inventory** — see the finding below.
- **Re-raise only if** extra-hop laundering proves to matter in practice (then: closes only in a producer *session*, or owner-only — reopen the ADR, do not patch the mover), or the added spawn hop makes the ship-loops clunky enough to hurt (then reconsider the rejected "producer + orchestrator" option with concrete friction as evidence). **Do not re-raise** *"any role should be able to close for ergonomics"* (that is ADR-025, reversed here knowingly) or *"the wiki should self-close its own tasks"* (0108 recommended it; the owner declined).

## The standing finding this shipped: a grep for one phrasing is not an inventory

The implementation ([[tasks/revert-task-movers-to-producer-only]]) had its scope **amended three times during the build**, each time because a live source asserting the ADR-025 grant was **outside** the `skills-for-role.sh:12-24` mirror checklist:

- **`claude/scaffold/universal-rules.md`** — the managed rules block that lands in **every agent's context on every turn**. Highest blast radius in the repo.
- **`claude/agents/fkit-producer.md`, `fkit-coder.md`, `fkit-lead.md`** — **system prompts**, which outrank a SKILL in an agent's own context. Left as-is, the runtime would have had the hook denying the coder a mover while the coder's own definition instructed it to invoke one.
- **A hard-rule contradiction nobody owned:** *"a consult is a focused question, not a hand-off"* (in both the coder's and producer's definitions) forbids exactly the producer-spawn-to-close this ADR makes the sanctioned terminal act. Resolved with a **carve-out**, not a deletion — the rule still holds for every other consult.

Two of these would have slipped the verification sweep entirely, because **the sweep matches phrasing, not meaning** (`fkit-lead.md` said *"closes each task itself"*, which no "any role may invoke" regex matches). The grep is **a smoke test, never an inventory** — recorded as an accepted residual, and the reason [[tasks/revert-task-movers-to-producer-only]] fed a follow-up investigation into the fact-inventory gap.

## Related
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — **reversed** (Decisions 1–2); its forgeability analysis and spawned-producer limit are re-used here, not re-derived
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — §Decision 5 **amended** (self-close → producer route); plan gate unchanged
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — **amended** (orchestrator spawns the producer to close)
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the conductor whose close step this constrains
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that makes producer-only structural at any spawn depth
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why a spawned producer is not an owner-verified close
- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — task 0108, the trigger; its recommendation was overruled
- [[tasks/route-coder-ship-loop-close-to-producer]] · [[tasks/route-sprint-ship-loop-close-to-producer]] · [[tasks/revert-task-movers-to-producer-only]] — the three-task landing sequence
- [[systems/fkit]] · [[systems/role-locked-sessions]]
- [[systems/knowledge-base-structure]] — the status-vocabulary page, which carries this producer-only rule as the current one
- [[tasks/amend-project-brief-for-lead-conductor]] — Amend PROJECT.md for the evolved `fkit-lead` conductor
- [[tasks/build-fkit-sprint-ship-loop-skill]] — Build the `fkit-sprint-ship-loop` skill (the lead's sprint-scope conductor loop)
- [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — Refresh architecture.md for the lead conductor + fix the stale §5.2 lock description
- [[tasks/sprint-2-remove-omnigent]] — Sprint 2 — Remove Omnigent, land Claude-native as the only runtime
- [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] — task 0117: the wiki flagged its own task *ready to close* under §2 rather than closing it
- [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] — task 0118: its §A3 contrasts the **unenforced** approval marker with this ADR's **hook-enforced** §Decision 1
- [[tasks/track-fkit-coder-declared-approval-carve-out]] — task 0119, closed through an **owner-present producer session** — the marker deliberately refused
- [[tasks/enforce-task-status-vocabulary]] — the status vocabulary whose `Done`/`Cancelled` gating rule this ADR narrows back to one role
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64, which **built** ADR-025's grant; this ADR reverses it while keeping its A2/A3 amendments and its forgeability analysis
- [[tasks/implement-task-ship-loop-skill]] — the coder loop whose self-close §3 removes, replacing it with a producer hand-off
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — earlier mover hardening; its "no longer owner-only" gloss is corrected by this ADR
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — **not amended by this ADR**; only an incidental "owner-only move rule" modifier in its body needed a dated correction
