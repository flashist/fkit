# Evolve `fkit-lead` into the orchestrating conductor (reverse the non-doer stance)

## ID
0110

## Sprint
Sprint 2

## Priority
92

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Follow-on implementation for the approved design
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
(§4.1, §4.2, §3.3) and the two ADRs it spawned — read them before starting:
[ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
(lead becomes the orchestrating front door — reverses ADR-010 §Decision 3) and
[ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md).

The owner ruled (2026-07-22) that `fkit-lead` becomes the single point of interaction: a
**conductor** that spawns and drives any role, holds the owner channel, and relays owner decisions
live. This task changes the **agent definition** only. The new skill (0111), the wiring (0112), the
launcher text (0113), and the docs (0114/0115) are separate briefs.

**This is a stance reversal.** ADR-010 §Decision 3 deliberately made lead "not a doer / no Write or
Edit tools." ADR-031 reverses that. Note also (design §4.2, C1) that `fkit-lead.md:22-24`'s "no
Write or Edit tools" is **already stale** — ADR-022 relaxed tools for all six Claude-side roles, so
lead already inherits Write/Edit. So this edit is a stance change (router → conductor) plus a prose
correction of a live drift.

## What to build

Edit `claude/agents/fkit-lead.md` (design §4.2 change surface, first row):

- **Remove** the "You are not a doer" / "no Write or Edit tools" framing (reversed by ADR-031, and
  already stale per ADR-022).
- **Add the conductor remit** (design §4.1): given a goal, lead spawns whatever typed `fkit-<role>`
  subagent it needs, assigns one bounded unit of work, awaits the return, relays any surfaced
  decision to the owner, and advances — spawn the next role, or report "done" to the owner.
- **Add the driver discipline**, carried as prose (design §3.3 residual, §9.2):
  - **Delegate, never substitute.** The conductor spawns each role's *actual work* into its own fresh
    typed subagent; it **never** writes source itself and **never** reviews. A conductor that reviews
    or designs "just this once" breaks the separation-of-authority thesis.
  - **Hold the owner channel.** Only the lead session has `AskUserQuestion` (ADR-021); spawned
    workers **return** questions, they do not ask. The driver does the asking.
  - **Spawn typed `fkit-<role>` subagents, never generic helpers** — a non-fkit subagent
    (`general-purpose`, `Explore`) carries no fkit identity and is denied every `fkit-*` skill
    (ADR-018 §Consequences, design §3.1).
- **Keep** the existing router remit (menu 7, "who do I need?", `/fkit-query`, one-off `@role`
  consults) — the design keeps both capabilities in one agent (design §4.1). The orchestrator drives
  only when asked to *do*, not to *point*.

Do **not** touch `skill-ownership-hook.sh`, `skills-for-role.sh`, or any other file in this task —
those are 0111/0112.

## Verification steps

1. `claude/agents/fkit-lead.md` no longer asserts "not a doer" / "no Write or Edit tools"; the
   router sections are intact.
2. The conductor remit and the three driver-discipline points (delegate-never-substitute, hold the
   owner channel, spawn typed subagents only) are present in the prompt.
3. No other source file changed by this task.
4. The change matches ADR-031's recorded decision (spot-check against the ADR).

## Notes

- **Owner:** fkit-coder (agent-definition edit).
- **Depends on:** T1 (record ADR-031/032) — **Done** (the ADRs are already written).
- **Blocks:** 0111 (skill build), 0113 (launcher text), 0114 + 0115 (docs), 0117 (wiki ingest) — all
  reference or depend on the evolved lead. (Design §11 dependency shape: `T2 → {T3 → T4, T5} → T6 →
  T8`.)
- **Source of truth:** the design report and ADR-031 — do not re-derive the stance; implement what
  they record.
- No commit — leave the edit in the working tree.
