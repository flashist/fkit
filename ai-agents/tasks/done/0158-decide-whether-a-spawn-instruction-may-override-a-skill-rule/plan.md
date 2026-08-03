# Plan — 0158, decide whether a spawn-time instruction may override a skill rule

- **Task:** `0158` (folder ID; board rank is P123 on 2026-08-02, the brief's `## Priority` says 122 — drift, producer's to fix)
- **Owner role:** fkit-architect
- **Date:** 2026-08-02
- **Approval:** the plan below was returned by a planning worker and **approved by the owner via
  `AskUserQuestion` in the live `fkit-lead` `/fkit-sprint-ship-loop` driver session on 2026-08-02**
  ("Approve as planned"), together with two additional owner rulings settling its open questions.

## What this task produces

**A ruling, recorded as an ADR.** No implementation. No skill, agent definition or source file edited.

**ADR over convention page, and the reason is the test the brief sets:** a convention page records what
was already implied; an ADR records a change to the authority model. This ruling **generalizes ADR-032's
declared-approval marker from one skill and one role to every spawned worker**, and adds a tier to the
precedence ladder in `claude/scaffold/universal-rules.md`. That is a change, not a restatement.

## The question being decided

> When a spawn-time instruction from the launching agent contradicts a rule in the skill the spawned
> worker is executing, **which binds**, and **what does the worker do** at the moment it notices?

**Checkable:** any candidate ruling must produce a verdict on both recorded instances — 2026-07-27
merit-rank, 2026-07-29 ledger-freeze — without breaking either.

**Scope guard:** the *content* axis (does a rule inside an invoked skill bind against a contrary
instruction). Not the *invocation* axis (which skill a role may run) — ADR-010/012/018.

## The two owner rulings folded in

Both `AskUserQuestion`, live driver session, 2026-08-02, recorded with provenance in the ADR:

- **Q1 — does the exception apply to every skill rule, or should some be undisplaceable?** →
  **"Every skill rule, uniformly."** No new undisplaceable-skill-rule tier. Universal hard rules stay
  undisplaceable exactly as they already are.
- **Q2 — bind only the worker, or also the driver?** → **"Bind both."** With the honest asymmetry
  recorded: the worker-side clause reaches every spawn via the rules block; the driver-side clause lives
  in `fkit-sprint-ship-loop/SKILL.md`, which the driver *does* load — the one place a SKILL.md rule
  genuinely reaches its reader.

## Steps

1. Read the brief; re-verify every citation in it first-hand (the plan measured on 2026-08-02, but a
   plan is not evidence).
2. Re-verify the plan's own claims where cheap — the addendum location, the rules-block path, the
   `direct your work` grep, the `fkit-coder.md` declared-approval marker, the ship-loop hard rules, the
   three ADRs (034/035/036) said to touch the axis, and the byte budget.
3. Allocate the ADR number per `/fkit-record-decision` step 2 — file-derived, plus the manual
   in-flight-claim check the skill mandates.
4. Write the ADR: five brief questions answered explicitly, both instances adjudicated by name, the
   one-sentence counterfactual, the `direct your work` tension faced.
5. Write `plan.md` and `worklog.md` (ADR-020).
6. Run `node --test test/adr-number-uniqueness.test.js` and the full `npm test`.

## Constraints binding this task

- **No implementation.** Follow-ups are named, never written. `git diff --stat` must show only the new
  knowledge-base file plus this task folder's own artifacts.
- **No commit, no push.** No writes to `ai-agents/wiki-vault/`.
- **The task folder is not moved and no board status is touched** — the close is the producer's.
- **ADR-014:** zero devDeps; `test/adr-number-uniqueness.test.js` stays green.
- **Citation form (`0160`'s ruling as ADR-035 applies it):** skill and agent rules anchored by step
  heading plus quoted text; coordination documents by heading and quote, never `:NNN`; tasks by folder
  `NNNN` prefix, never board rank.

## The answers the plan committed to, and which the ADR carries

1. **Which wins:** the skill rule binds, unless the instruction **relays a named owner ruling** — the
   declared-approval marker generalized. Universal hard rules never displaceable.
2. **On collision:** comply-and-flag where a named owner ruling is carried; surface the collision and
   take the conservative branch where it is not. **Silent compliance and silent refusal ruled OUT by
   name.**
3. **What the driver may not instruct:** no instruction into a skill rule's territory without naming
   the owner ruling it relays.
4. **Where it lives:** the rules block — the only surface reaching every spawned worker every turn, and
   the only site that escapes the ADR-012 trap.
5. **Enforcement:** prose is proportionate; the marker is unverifiable from a worker's context, so any
   enforcement would check a forgeable string. Match ADR-032's *"trust, not proof"*, plus an audit
   obligation.

## Out of scope — follow-ups to name, not do

1. The rules-block clause edit.
2. The `fkit-sprint-ship-loop` driver-side clause.
3. Whether `/fkit-task-done` step 5 needs amending on instance B's reasoning.
4. The brief's own stale citations (producer's; ADR-034 makes them an accepted residual).
5. Wiki ingest of the ADR (`fkit-wiki` only).
6. The ADR-036 registry check.

## Risks

- **Inheriting the plan's measurements unverified.** Mitigated by step 2 — and it caught a real error
  (see `worklog.md`, decision log D4).
- **Doing ADR-035's work by accident** on instance A. Mitigated by stating the two grounds separately
  and saying which one this ADR claims.
- **Over-reading instance B** into a general ledger rule the owner explicitly did not make. Mitigated
  by a named "what this does NOT do" block in the ADR.
