# Plan — Report the Backlog board in `/fkit-status` on request only

**Task:** [`report-backlog-board-in-fkit-status-on-request-only.md`](./brief.md)
· **Sprint 2, priority 68** · **Approved by the owner: 2026-07-18** · **Depends on task 67 (met)**

## The change

### 1. `claude/skills/fkit-status/SKILL.md`
- Argument contract gains a **third target**: `Backlog` (case-insensitive) → `ai-agents/sprints/backlog.md`.
  Absent board ⇒ **say so and stop; never create it** (read-only contract).
- Record **why this conforms to one-skill-one-output**: it selects *which board*, exactly as `Sprint 1`
  does — not *which rendering of one board*. The default run still excludes it **by construction**
  (`backlog.md` is outside the `sprint-*.md` glob), not by a rule anyone must remember.
- Apply the closed-sprint "say it's moot, don't invent it" pattern to the beats that presuppose a
  sprint — but to the **unscheduled** set, not the *finished* set: beats 3 and 5 mostly moot, beat 4
  reframed from "the one thing to pick up" to "is anything ready to be pulled into a sprint", beats
  2/6/7 in full. No goal line, no phases, **no invented ranking**.
- Correct the `⟦FACTS⟧` grammar mirror: `<task>` is no longer always a number.

### 2. `claude/skills/fkit-status/dashboard.sh` — fix only what the backlog board breaks
- **`backlog.md` resolves to the `Backlog` plan identity.** Without it the board reports a permanent
  false `unresolved-plan-sprint` on every run — **and drift rule 1 is inert**, so this is correctness,
  not cosmetics.
- **FACTS id falls back to the brief's filename stem when the Priority cell has no number.** Owner-ruled
  2026-07-18. Every backlog record otherwise keys `?`, and the roll-up `uniq`s several distinct drifted
  rows into one unattributable entry. **Numbered plans keep numbering** — this is a fallback, not a
  replacement.

### 3. `test/dashboard-contract.test.js`
Backlog-board fixture helper + 6 cases: the identity fix; **rule 1 does not skip** (the one that guards
task 67's brief normalization); stem-keyed FACTS; **numbered plans still key by number**; `—` cells
render with a correct roll-up; a free-text `## Priority` qualifier leaks nowhere.

## Verification
- `npm test` green; both new behaviors mutation-checked (each must go red when removed).
- Live: `dashboard.sh` on `backlog.md` exits 0 with no `unresolved-plan-sprint`; on `sprint-2.md`
  unchanged and still keyed by number.
- `ls ai-agents/sprints/sprint-*.md` still resolves only real sprints.

## Scope boundary
No launcher, no `skills-for-role.sh`, no scaffold, no wiki, no task-file move. Task 65's filter applies
to the backlog board unchanged — no special-casing.
