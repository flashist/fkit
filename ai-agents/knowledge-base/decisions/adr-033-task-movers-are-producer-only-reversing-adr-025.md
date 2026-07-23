# ADR-033: The task movers are producer-only again — ADR-025's "any role" grant is reversed

- **Status:** accepted
- **Date:** 2026-07-23
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Reverses:** [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md) §Decision 1–2 (the grant
  of `/fkit-task-done` and `/fkit-task-cancelled` to *"any spawned role"* but the adversarial reviewer).
- **Amends:** [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) §Decision 5
  (the coder ship-loop's self-close) and [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
  §Decision 3/5 (the orchestrator closing sprint tasks directly).
- **Origin:** the owner's ruling during the task 0108 open-questions interview (2026-07-23), presented
  with the ship-loop/orchestrator ripple in the option text and chosen knowingly.

> **What this ADR decides, in one line:** only **`fkit-producer`** may run the task movers; every other
> role — wiki, coder, reviewer, architect, and the evolved lead/orchestrator — **routes closes through
> the producer** and closes nothing itself.

## Context

[ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md) (2026-07-18/19) removed the owner-only
close gate and granted the movers to every role but the adversarial reviewer, accepting — knowingly, in
its honesty clause — that prevention was gone and only a prose marker remained. `claude/skills-for-role.sh:37-43`
implements that today (movers on `lead, producer, coder, architect, reviewer, wiki`).

Task **0108** surfaced the cost from the wiki's side: a wiki task whose vault work was done sat
`🔄 In progress` on the board for ~a week (task 80; six batched syncs) because the wiki never invoked the
close authority it had. The investigation
([`reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md`](../reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md))
recommended the wiki self-close. **The owner ruled the opposite**, and more broadly than the wiki:

> *"Nobody should be able to run the `fkit-task-done` skill except the producer agent. If needed, wiki
> can ask the producer to run it… Keep the wiki-agent wiki-only."* (owner, 2026-07-23)

Offered three readings (no-self-close / **producer-only strict** / producer+orchestrator), each with its
ripple stated, the owner chose **producer-only strict** — including the explicit consequence that
*"ADR-032 orchestrator-close and ADR-019 coder self-close both stop; all closes funnel to producer."*
The driver is a deliberate re-consolidation of **close authority into the one role whose job is the task
lifecycle**, reversing the ergonomics-for-guarantee trade ADR-025 made.

## Decision

1. **Only `fkit-producer` owns the movers.** `claude/skills-for-role.sh` removes `fkit-task-done` and
   `fkit-task-cancelled` from `lead, coder, architect, reviewer, wiki`; `producer` keeps both. The
   ADR-018 `PreToolUse` hook then **denies** a mover call from any non-producer identity at any spawn
   depth (`skill-ownership-hook.sh:119-136`) — this makes the rule **structural**, unlike ADR-025's
   prose. The **adversarial reviewer** never had them and still does not.

2. **The wiki stays wiki-only.** It **flags** completion (ends its report with an explicit *"task N ready
   to close"*), and the producer runs the mover. The wiki writes only `wiki-vault/` (ADR-005) and closes
   nothing. This is task 0108's resolution — the `reports/2026-07-23-eval-…` recommendation is revised to
   match this ADR.

3. **The coder ship-loop no longer self-closes** (amends ADR-019 §Decision 5 / ADR-025's amendment of
   it). `fkit-task-ship-loop` step 9 changes from *invoke `/fkit-task-done`* to *route the close to the
   producer* (spawn `@fkit-producer` to close, or hand the close to the owner). ADR-019's plan gate is
   untouched; only its terminal act changes.

4. **The orchestrator closes through the producer** (amends ADR-032). `fkit-sprint-ship-loop` spawns
   `@fkit-producer` to close each shipped task; the evolved lead does not hold the movers. This is a
   per-task producer spawn added to the loop.

5. **The agent-closed marker persists for agent-performed closes.** A producer **spawned** by another
   agent to close still writes `✅ Done (agent-closed — not owner-verified)`; only a producer **session
   with the owner present** yields an owner-verified close. The marker's honesty role is unchanged; see
   the limit below.

## The limit — stated plainly (this does not fully restore ADR-025's lost guarantee)

ADR-025 §"Why a spawned producer is not a second judgment" established that *"the coder spawns the
producer and asks it to mark done"* is functionally *"the coder marks its own work done with an extra
hop"* — a spawned producer has no owner channel (ADR-021) and its `⛔ Owner:` banner is advisory. **That
remains true here.** Producer-only re-establishes **separation of the closing *identity*** (the doer role
can no longer flip its own board green under its own identity — hook-enforced), and it re-consolidates the
close into the producer's own procedure. It does **not** restore full *prevention*: a determined doer can
still spawn a producer to close. This ADR is honest about that, exactly as ADR-025 was about what it gave
up — the win is structural role-separation at the mover, not a laundering-proof gate.

## Options considered

- **Producer-only, strict (chosen).** Re-consolidates close authority in the lifecycle role and makes it
  hook-structural. Cost: unwinds the coder ship-loop's self-close and the orchestrator's direct close;
  both gain a producer-spawn hop. Does not fully prevent extra-hop laundering (above).
- **No self-close; the spawner or producer may close.** The doer never closes its own task, but the
  orchestrator may close work it delegated. Offered; **rejected by the owner** in favor of the stricter
  rule.
- **Producer + orchestrator only.** An explicit two-role allowlist. Offered; **rejected** — the owner
  wanted the single lifecycle role, not two.
- **Keep ADR-025 (any role + marker).** The status quo. Rejected: the owner is re-consolidating close
  authority; the wiki-stuck-marker (0108) was the trigger, the general preference the reason.

## Consequences

- **Positive:**
  - **Close authority is one role again, and it is hook-structural** (ADR-018), not the prose ADR-025
    relied on. "A role cannot close its own task under its own identity" becomes a fact of the runtime.
  - The wiki is cleanly wiki-only; 0108's stuck-marker gets a real owner: the producer.
  - The task lifecycle is coherent — the role that plans and files also closes.
- **Negative / costs — stated plainly:**
  - **The coder ship-loop's autonomy narrows** (ADR-019): its terminal act is no longer a self-close but
    a producer route. Autonomous shipping now ends at a producer hand-off, not a green board.
  - **The orchestrator gains a producer-spawn per task** (ADR-032) — more spawns, one more hop before a
    task leaves the board.
  - **Extra-hop laundering is not closed** (the limit above); the agent-closed marker still carries the
    only signal, and it is still invisible in `/fkit-status` (ADR-025 §A3, unchanged).
  - **Doc/skill ripple:** `skills-for-role.sh` + the four human mirrors; `fkit-task-ship-loop` step 9;
    `fkit-sprint-ship-loop` (0111, not yet built — must be designed to this); the movers' own SKILLs and
    any prose asserting "any role may close"; `test/skill-ownership-hook.test.js` (flip the deny/allow
    assertions for the five roles). ADR-025's own "any role" prose is now historical.
- **Residual risks / "re-raise only if":**
  - **Extra-hop laundering (a doer spawns a producer to close) proves to matter in practice** — then the
    next step is closes only in a producer **session** (owner-adjacent) or owner-only; reopen this ADR,
    do not patch the mover.
  - **The added producer-spawn hop makes the ship-loops clunky enough to hurt** — reconsider the
    "producer + orchestrator" option the owner rejected here, with the concrete friction as evidence.
  - Do **not** re-raise *"any role should be able to close for ergonomics"* — that is ADR-025, reversed
    here by the owner knowingly.
  - Do **not** re-raise *"the wiki should self-close its own tasks"* — 0108's investigation recommended
    it and the owner declined; wiki is wiki-only by this decision.

## Related

- [`reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md`](../reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md)
  — task 0108; its Approach-1 recommendation is superseded by this ADR (wiki flags, producer closes).
- [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md) — **reversed** (Decisions 1–2). Its
  forgeability analysis (§3) and the spawned-producer limit are re-used here, not re-derived.
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) — §Decision 5 **amended**
  (self-close → producer route); plan gate unchanged.
- [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) — **amended** (orchestrator
  spawns the producer to close).
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the hook
  that makes producer-only structural at any spawn depth.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — why a spawned producer is
  not an owner-verified close.
- Code: `claude/skills-for-role.sh:37-43`, `claude/skills/fkit-task-ship-loop/SKILL.md` (step 9),
  `claude/skills/fkit-task-done/SKILL.md`, `test/skill-ownership-hook.test.js`.
- **Follow-on (producer-scoped to file / coder to implement):** revert `skills-for-role.sh` to
  producer-only + the four mirrors; rewrite `fkit-task-ship-loop` step 9; carry this into the 0111
  `fkit-sprint-ship-loop` build and the 0110–0117 briefs already filed under ADR-032-as-first-written.
- **Wiki:** **fkit-wiki** should ingest this ADR and resync any vault page asserting the ADR-025 "any
  role may close" rule — an architect never writes the vault.
