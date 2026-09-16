# Teach the lead, producer, ship-loop and README the sprint lifecycle and what "current sprint(s)" means

**Source**: `ai-agents/tasks/done/0339-teach-the-lead-and-producer-what-current-sprint-means-and-how-to-resolve-it/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 8 · `P7` · `0339` · ✅ **Done** — ⭐ **the ONE row on Sprint 8 with no agent-closed marker**

## Goal

**Close the gap in the roles and pages that actually ANSWER the owner.** `0337` recorded the lifecycle
and `0338` made the script do it; ⛔ **the lead, the producer, the ship-loop and both READMEs still
carried no definition, or the old one.**

⭐ **This is the row that ends the confusion the owner reported on 2026-08-25 in the first place.**
⛔ **Last on the board because it documents what `0337` and `0338` decide** — written earlier it would
have documented a design that had not settled.

## Key Changes

**What carried the old definition, checked 2026-08-25:**

- `claude/agents/fkit-lead.md` — ⛔ **no "current sprint" / "active sprint" at all**, and the lead does
  not own `/fkit-status`.
- `claude/agents/fkit-producer.md` — *"read the active sprint plan"*, and *"if unclear, list
  `ai-agents/sprints/` and find the active one"* — ⭐ **the step that goes wrong.**
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — *"empty = the active sprint, as `/fkit-status`
  resolves it"*; after `0338` there may be **several**, and the loop drives **one**.
- `ai-agents/README.md` and the scaffold copy — *"Completed sprints move to `sprints/done/`"*, no
  statuses.
- `ai-agents/knowledge-base/conventions/` — ⛔ **no sprint equivalent of
  `task-status-vocabulary.md`, and no page mentioning either term.**

**What was built:**

1. ⭐ **A new convention page — `conventions/sprint-status-vocabulary.md`**, the sibling of the task
   one: the four statuses and their markers, who sets each (⭐ **`Backlog` and `In progress` by the
   producer freely; `Done` and `Cancelled` only via the movers, producer-only, agent-closed marker
   when no owner**), the line-3 banner carrier with its grammar quoted from the ADR, the two archive
   folders, the legacy `🔒 CLOSED` reading as `Done`, the definition in one sentence, the single-board
   rule, and ⭐ **the one resolution path — `bash .claude/skills/fkit-status/dashboard.sh select-active
   ai-agents/sprints`** — with the ADR-041 §5 rule that **no role re-derives it in prose**.
2. **The lead, the producer and the ship-loop** taught to resolve by the selector rather than by eye,
   and that the answer may be **plural**.
3. **Both READMEs** gained a sentence, including ⭐ **that a project upgrading fkit must add a banner to
   its own open plans** — the `0340` migration, flagged outward.

⛔ **Explicitly not in scope: giving the lead `/fkit-status` ownership** — a `skills-for-role.sh`
change and ADR-010 territory, to be raised separately if running the read-only script directly is
judged to breach the lock's intent.

## Outcome

⭐ **Verified on disk 2026-09-16: `ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md`
exists.** ⭐ **It is the one page on Sprint 8 that closed with a plain `✅ Done`** — no
`(agent-closed — not owner-verified)` marker, on the board and in the brief alike.

### ⚠️ It honoured the dual-home rule and still exposed a defect in the mirror

⭐ **`0339` fully honoured `dual-home-parity.md`'s rule**: its new module entry for the convention page
**is** in the page's mirror table, and it moved the module from 27 entries to 28. ⛔ **But the page's
completeness note still claimed 26/16** — a pre-existing gap dating to 2026-08-07, which `0339` only
made staler. That became [[tasks/add-dual-home-paritys-missing-accepted-drift-row-and-correct-its-count]]
(`0389`) in Sprint 9.

### ⚠️ Its review found two more defects, both filed rather than folded in

- **`R5`** — the repo-only `claude/…` path form in installed-facing prose. ⭐ **`0339` added 2 of 13
  sites and replicated an existing pattern rather than inventing one.** Filed as `0390` —
  [[tasks/sweep-the-repo-only-claude-path-form-out-of-installed-facing-prose]].
- **`R6`** — `test/dual-home-parity-exceptions.mjs`'s own `"13 real files"` comment, a **third
  instance** of the same drifted-count class. ⛔ **Recorded onto `0389`, not fixed** (owner ruling
  *"Fold into 0389 (Rec)"*).

⭐ **In both cases the owner chose to keep `0339` inside its approved boundary** rather than widen it.

## Related
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]]
- [[tasks/record-the-sprint-lifecycle-adr-047]]
- [[tasks/give-the-selector-a-status-rung-and-a-lowest-first-choice]]
- [[tasks/build-the-producer-only-sprint-movers]]
- [[tasks/add-dual-home-paritys-missing-accepted-drift-row-and-correct-its-count]]
- [[tasks/sweep-the-repo-only-claude-path-form-out-of-installed-facing-prose]]
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]
- [[systems/knowledge-base-structure]]
