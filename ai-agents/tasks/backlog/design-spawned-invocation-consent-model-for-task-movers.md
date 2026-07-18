# Design a laundering-safe consent model for spawned invocation of the task movers

## Sprint
Sprint 2

## Priority
63

## Status
🔲 Backlog

## Context

**The owner's ask (2026-07-18):** let another agent drive the producer's `/fkit-task-done` and
`/fkit-task-cancelled` movers by **spawning the producer sub-agent and asking it to run them** — e.g.
the coder finishes a task, spawns `@fkit-producer`, and asks it to mark the task done. Today both
movers are **owner-only**, so this is not permitted.

**⚠️ This reverses a locked, load-bearing decision — it is not an incremental change.** Three artifacts
make the movers owner-only *on purpose*:

1. **CLAUDE.md universal hard rule:** task files move to `done/`/`cancelled/` *"only via the
   owner-invoked `/fkit-task-done` / `/fkit-task-cancelled` — never on an agent's own initiative. Do
   not move one, do not tell anyone else to."*
2. **[ADR-019](../../knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md):**
   *"Done is owner-gated, anti-laundering."* The autonomous ship-loop was deliberately built to run
   unattended **yet still stop at the owner-only done-gate** and never move a task file.
3. **`fkit-task-done/SKILL.md`:** *"an agent that can mark its own work complete can quietly launder
   unfinished work into a green board."*

The owner has chosen (2026-07-18) to pursue the relaxation **deliberately, via a reversal ADR** —
hence this design-first task. Nothing is implemented here; the design settles the mechanism and the
owner rules, then task 64 builds it.

### ⚠️ The gating problem — the exact one that already sank a design

ADR-019 records that a rev-1 attempt to relax a gate "for a spawned/loop context" was **killed by a
Codex adversarial pass** because **there is no runtime-authenticated signal for "loop context"** — the
relaxation was either unenforceable or claimable by *any* standalone invocation, and a `CORRECT`
review verdict certifies a finding's accuracy, **not** that work is genuinely done. This design walks
straight back into that problem and **must answer it**, not restate the wish:

- A producer **spawned as a consult has no owner channel** (its `⛔ Owner:` banner is advisory, not a
  wall — [ADR-012](../../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md);
  `AskUserQuestion` is session-only, absent in consults —
  [ADR-021](../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  So "coder asks producer to mark done" is functionally **"the coder marks its own work done"** — the
  laundering path the gate exists to block.
- The owner-only gate today is enforced by **skill text**, not by the `PreToolUse` skill-ownership hook
  ([ADR-018](../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)) —
  the hook gates *role*, and the spawned sub-agent legitimately **is** the producer role. So relaxation
  cannot lean on the hook; it needs a **positive, checkable precondition** an agent cannot fabricate
  for its own work.

### ⚠️ done and cancelled are not equally dangerous — flag the asymmetry

`done` is the laundering target: it turns the board green. `cancelled` records a *drop* with a reason —
far less prone to laundering (no false "complete"). The design should rule whether the two movers get
the **same** relaxation or an **asymmetric** one (e.g. cancelled relaxes more freely than done), rather
than assuming symmetry.

## What to build

A dated design spec in `ai-agents/knowledge-base/reports/`, owner present for the rulings, that:

- **Answers the enforceability problem head-on:** what **authenticated, checkable precondition**
  replaces owner-presence as the anti-laundering guard — one an agent **cannot fabricate for its own
  work**. Candidates to evaluate against the actual project state, not assert: a **closed stateful
  review ledger** (`ai-agents/reviews/<task-id>.md`) with a passing verdict for the task; recorded
  worklog evidence ([ADR-020](../../knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md));
  a review-role sign-off. State precisely what the relaxed mover would check before moving a file.
- **If no such signal exists, says so plainly** (the task-39/59 honesty) — and then the honest outcome
  may be "keep it owner-only," which the owner rules on.
- **Rules the done/cancelled asymmetry** — same relaxation for both, or a weaker guard for cancelled —
  as an owner-approved line.
- **Rules who may invoke** — any spawned role, or only specific ones (e.g. a review-verified handoff),
  and via what phrasing/contract.
- **Names the full write surface the relaxation touches** so task 64 is bounded: the two SKILL.md
  files, the `⛔ Owner:` banners, the **CLAUDE.md universal hard rule wording** (this reverses it), any
  scaffold copies (the task-48/49 dual-home lesson), and the ADR-019 amendment.
- **Records the reversal/amending ADR** via `/fkit-record-decision` — it supersedes/amends the
  owner-only line in ADR-019 and the CLAUDE.md hard rule, documenting exactly what replaces the
  laundering protection.
- **Ends with the decisions the owner approves** and the downstream tasks the approval spawns.

**Recommended: an adversarial (Codex) pass before owner sign-off** — the 20/29/39 precedent, and
pointedly the ADR-019 rev-1 precedent: a Codex pass already killed the closest prior attempt at exactly
this relaxation. If the new guard cannot survive that pass, it is not ready.

## Verification steps

- A dated design spec exists in `ai-agents/knowledge-base/reports/`.
- The spec **specifies the authenticated precondition** the relaxed mover checks — or concludes no
  fabricable-proof-resistant signal exists and recommends staying owner-only. Either way it answers the
  "no runtime-authenticated context signal" problem by name, not by omission.
- The done/cancelled asymmetry is ruled explicitly.
- The full write surface for implementation is enumerated (skills, banners, CLAUDE.md hard rule,
  scaffold copies, ADR).
- The reversal/amending ADR is recorded (or scoped as a spawned task), stating what replaces the
  anti-laundering guarantee.
- The owner has approved the resulting contract.
- No implementation shipped: no change to `claude/skills/fkit-task-done/`,
  `claude/skills/fkit-task-cancelled/`, CLAUDE.md, or any source.

## Notes

- **Owner: fkit-architect**, owner present for the rulings (it reverses a universal hard rule and
  amends ADR-019). Consults fkit-coder for runtime/enforcement reality and fkit-reviewer for what a
  closed review ledger actually guarantees, if useful.
- **Depends on: nothing.** **Blocks: task 64 (implementation) — hard, including the owner's approval and
  the recorded ADR.**
- **Conflicts flagged, not resolved here:** the CLAUDE.md owner-invoked-mover hard rule, ADR-019's
  anti-laundering done-gate, and the "no runtime-authenticated signal" enforceability problem that
  killed the closest prior attempt. The owner rules; the producer surfaces.
