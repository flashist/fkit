# ADR-024: The ship-loop's owner-question timeout is feasible but NOT built — declined on cost, not feasibility

- **Status:** accepted
- **Date:** 2026-07-18
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Harness pinned:** the feasibility facts below are measured on **Claude Code 2.1.214**. The AFK-timeout behavior is a version-scoped harness fact (see "re-raise only if").

## Context

The owner asked (2026-07-18) that `fkit-task-ship-loop`'s owner-question stops stop **blocking forever**:
when the loop asks a mid-loop question, present options with one marked *recommended*, and if the owner
is silent for ~30s, proceed on the recommended option (task 59,
`design-ship-loop-timeout-auto-proceed.md`). He said *"if possible"* — feasibility was explicitly part
of the question.

The investigation ([`reports/2026-07-18-design-ship-loop-timeout-auto-proceed.md`](../reports/2026-07-18-design-ship-loop-timeout-auto-proceed.md))
went through **two feasibility verdicts, and the first was wrong** — recorded here so the mistake is not
repeated:

- **First verdict — "not runtime-expressible" — WRONG.** It reasoned from Claude Code's turn model +
  the `AskUserQuestion` per-call schema (which genuinely has **no `timeout` parameter**) and concluded a
  timed auto-proceed could not be built. This is the exact **"measure the binary, don't reason it"**
  trap the task brief warned of ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md)
  precedent), and it reproduced it.
- **Corrected verdict — it IS feasible.** Claude Code has a settings/env-level **AFK timeout**:
  `askUserQuestionTimeout` in **user** settings (`~/.claude/settings.json`) — **verified present on the
  installed binary 2.1.214** (value `"never"`, the wait-forever default) — plus env vars
  `CLAUDE_AFK_TIMEOUT_MS` / `CLAUDE_AFK_COUNTDOWN_MS`. On timeout the runtime shows a countdown banner
  and **auto-continues on whichever option is currently *pre-selected*** (there is no separate
  "recommended-on-timeout" field). So a ~30s countdown-then-proceed **can** be built.

**But the safe version carries real cost**, and four constraints shape it:

1. **The timeout is session-global, not per-question.** It fires on *every* `AskUserQuestion` in the
   session — including the two gates that must **never** auto-proceed: the **plan-approval gate**
   (ADR-019's one unremovable checkpoint) and the **done-gate** (routing around the owner-invoked
   `/fkit-task-done` mover — a universal hard rule task 52's D1 preserved).
2. **The setting is user-scope only** (project `.claude/settings.json` is deliberately ignored, so a repo
   cannot redirect a user's safety behavior). fkit cannot set it per-project; it would need a dedicated
   ship-loop **launch mode** that sets the env var for that one session, or the owner's own global config.
3. **On-timeout adopts the pre-selected option**, so "recommended" must be expressed as pre-selection.
4. **The mechanism's own guidance warns against exactly this shape** — the research note's "never
   short-timeout a flow that gates high-stakes/irreversible actions", and a reported case where a
   timed-out empty answer auto-processed 160 items. This independently confirms the gate exclusions.

The **safe design that survives all four**: a dedicated ship-loop launch that arms the AFK timer for
that session only; **mid-loop questions** use `AskUserQuestion` (timed, safe option pre-selected);
**plan-gate and done-gate** are expressed as **plain waits** (not `AskUserQuestion`), so the
session-global timer never fires on them. Feasible — but a new launch mode + gate re-expression + a
binary probe of the on-timeout behavior, for a convenience.

**The owner weighed the safe design and declined it:** the added launch-mode complexity and the reliance
on a session-global, user-scope timer are not worth the benefit. The ship-loop stays as-is.

## Decision

**The ship-loop owner-question timeout will not be built.**

1. **No change to `fkit-task-ship-loop`.** Owner-question stops continue to **wait for the owner** (the
   current behavior). No AFK timer is wired in, no dedicated launch mode is added, no gate is
   re-expressed.
2. **The decision is on *cost/complexity*, not feasibility.** It **is** buildable (the corrected verdict
   above). This ADR records that explicitly so neither error recurs: not *"it can't be done"* (it can),
   and not *"just add a 30s timeout, it's easy"* (the safe version is a launch mode + gate re-expression
   + a version-scoped, user-scope, session-global timer).
3. **The plan-gate and done-gate exclusions stand regardless** — they were never in scope for
   auto-proceed and the AFK mechanism's own guidance confirms why.
4. **Task 59 is cancelled; task 60 (implementation) is not created.** *(Moved via the owner-invoked
   `/fkit-task-cancelled` — the architect does not move task files.)* The design report is retained as
   the record of what was weighed.

## Options considered

- **Do not build it; the ship-loop keeps waiting for the owner (chosen).** Zero new machinery; the loop
  stalls if the owner is away, accepted as the cost. Simplest and safest.
- **(A) Real AFK timer scoped to a dedicated ship-loop launch, gates as plain waits.** Delivers the
  literal 30s countdown. Rejected by the owner: a new launch mode + gate re-expression + a
  session-global/user-scope timer is more machinery and more moving safety-parts than the convenience
  warrants.
- **(B) Up-front per-run grant** (owner grants at plan-gate: "proceed on the recommended default for
  class-X mid-loop questions, logged"). Precise per-class control, no timer, no user-scope setting.
  Not chosen — the owner declined the feature outright rather than pick a substitute.
- **(C) Hybrid** (real timer for mid-loop + engineered gate protection). Most work; declined with (A).

## Consequences

- **Positive:**
  - No new launch mode, no gate re-expression, no dependency on a version-scoped harness timer.
  - The two owner gates keep their guarantees trivially (they already wait).
  - The **corrected feasibility fact is on record** — the AFK timer is real (2.1.214) — so the "not
    buildable" mistake is not repeated, and so is the **cost** — so "just add a timeout" is not
    re-proposed as if free.
- **Negative / costs:**
  - **The ship-loop still blocks forever on an owner question if the owner is away.** That was the
    owner's original complaint, and it is **accepted, unmitigated.** If it later proves painful enough,
    see "re-raise only if".
- **Residual risks / "re-raise only if":**
  - **The cost equation changes** — e.g. a future Claude Code exposes a **per-question or per-skill**
    timeout scope (removing the session-global constraint that forces the launch-mode + gate-re-expression
    machinery), **or** project-scope configuration of `askUserQuestionTimeout` becomes possible. Re-check
    against the binary (the AFK facts are pinned to 2.1.214) before re-proposing.
  - **The ship-loop's unattended operation becomes a real, stated need** (not a convenience) that
    justifies the launch-mode machinery — then reconsider option (A)/(B) with the owner. **The stall
    being merely annoying is not the trigger; a concrete blocked workflow is.**
  - Do **not** re-raise "a timed auto-proceed can't be built" — it can (this ADR); or "just add a 30s
    timeout, it's easy" — the safe version is not (this ADR).
  - Do **not** apply any auto-proceed to the **done-gate or plan-gate** — excluded on their own merits
    (universal hard rule / ADR-019 core), independent of this decision.

## Related

- [`reports/2026-07-18-design-ship-loop-timeout-auto-proceed.md`](../reports/2026-07-18-design-ship-loop-timeout-auto-proceed.md)
  — the investigation, both verdicts, the safe design, and the on-record correction.
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) — the ship-loop's
  autonomy model and its owner gates; **unchanged** by this decision.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — `AskUserQuestion` is
  session-only and has no *per-call* timeout; the "measure the seam against the binary, don't reason it"
  precedent this investigation first violated, then honored.
- Task 52 / D1 — the owner-invoked `/fkit-task-done` mover the done-gate must not route around.
- Harness fact: `~/.claude/settings.json` → `askUserQuestionTimeout` (verified present, value `"never"`,
  on Claude Code 2.1.214); env vars `CLAUDE_AFK_TIMEOUT_MS`, `CLAUDE_AFK_COUNTDOWN_MS`.
- Task: `ai-agents/tasks/backlog/design-ship-loop-timeout-auto-proceed.md` (task 59 — cancelled via the
  owner-invoked `/fkit-task-cancelled`).
