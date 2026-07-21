# Plan: implement spawned invocation for the task movers (task 64)

- **Task:** [`implement-spawned-invocation-for-task-movers.md`](./brief.md) (Sprint 2, #64)
- **Approved:** 2026-07-19, owner present, `/fkit-task-ship-loop`
- **Governing decision:** [ADR-025](../../../knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md)
- **Evidence:** [design spec §8](../../../knowledge-base/reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md)

> **This file is the boundary the loop's autonomy is measured against.** Anything outside it is a
> judgment call that stops for the owner.

## Preconditions satisfied

- ADR-025 Decision 6 required a **mandatory adversarial Codex pass before task 64 starts.** Run
  2026-07-19 via `fkit-adversarial-reviewer` on Codex CLI 0.144.4 — full coverage, model diversity
  intact. Findings X1–X7. Verified by the coder against the code before planning.

## Owner rulings folded in (2026-07-19)

| # | Question | Ruling |
|---|---|---|
| R1 | Ship-loop under ADR-025 | **The loop closes its own task.** Step 9 becomes an agent-driven close, not an owner gate. |
| R2 | Brief's "refusal test" gap | Document the gap; test the marker. **Superseded in part by R3** — a hook change makes a genuine refusal test buildable again. |
| R3 | X1 — ADR-025 Decision 2 vs Decision 5 contradiction | **Change the hook, allow any role.** Reverses Decision 5 ("prose-only, no hook change"). |
| R4 | X3 — marker invisible on `/fkit-status` | **Accept it, record it honestly** in ADR-025. Do not extend the dashboard. |
| R5 | Does `adversarial-reviewer` get the movers? | **No.** All other roles do. Record the exclusion in the ADR amendment so it is not read as an oversight. |

## Verified findings this plan is built on

- **X1 CONFIRMED.** `claude/skills-for-role.sh:26-38` lists both movers under `producer` only;
  `claude/skill-ownership-hook.sh:129-136` denies any role not listed. ADR-025 Decision 2's "any
  spawned role may invoke" is structurally false without a `skills-for-role.sh` change.
- **X3 CONFIRMED.** `claude/skills/fkit-status/dashboard.sh:229-238` (`marker_key()`) collapses
  `'✅'*` → `done` by prefix, discarding the suffix; `:737-739` drops `done` rows from the board
  unless drifted, and the roll-up counts them as ordinary done. The agent-closed marker is invisible
  on `/fkit-status`.

## Write surface

### A. Make the marker legal (do first — everything else depends on it)
1. `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` — the `Set by` cells for Done and
   Cancelled; the authority-split paragraph (`:29`); add the agent-closed marker variants.
2. `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md` — the scaffold
   twin (dual-home parity, tasks 48/49).
3. `ai-agents/knowledge-base/conventions/status-report-format.md` + its scaffold twin (X4).

### B. The hard rule — three homes (ADR-016)
4. `claude/scaffold/universal-rules.md` — the source of truth, injected by `fkit-claude-init.sh:322`.
   **Constraint: the emitted rules block sits at ~86% of `RULES_MAX`. New wording must be no longer
   than the old** (`test/rules-block-budget.test.js`).
5. `CLAUDE.md` — the dogfooded copy.
6. `AGENTS.md` — the third copy.

### C. The movers
7. `claude/skills/fkit-task-done/SKILL.md` — `⛔ Owner:` banner, why-this-exists, the gated-status
   rule, and the step that writes the status: emit
   `✅ Done (agent-closed — not owner-verified)` when agent-invoked.
8. `claude/skills/fkit-task-cancelled/SKILL.md` — the same four places, cancelled variant.

### D. The hook's data source (R3) — the highest-care area
9. `claude/skills-for-role.sh` — add both movers to `lead`, `producer`, `coder`, `architect`,
   `reviewer`, `wiki`. **Not `adversarial-reviewer`** (R5).
10. `test/skill-ownership-hook.test.js` — update the pinned exhaustive mapping (`:232-233`) **and**
    add cases: coder-invoked `fkit-task-done` allows; `adversarial-reviewer` denies; an unroled
    session and a non-`fkit-*` `agent_type` still deny (the fail-closed paths, ADR-018 §Decision 3).

### E. The ship-loop (R1)
11. `claude/skills/fkit-task-ship-loop/SKILL.md` — frontmatter description, the "does NOT move task
    files" banner, `:82`, step 9 / `:136`, `:217`.

### F. Prompts and docs
12. `claude/agents/fkit-producer.md` — description, skills paragraph, must-not list.
13. `claude/agents/fkit-coder.md` — the must-not "move task files" line.
14. `claude/scaffold/CLAUDE.md` — the role table's producer cell.
15. `claude/skills/fkit-task-brief/SKILL.md` (X6).
16. `claude/skills/fkit-status/SKILL.md` — `:123`, `:205`, `:321` (X5).
17. `ai-agents/knowledge-base/PROJECT.md` — the task-lifecycle bullet.
18. `ai-agents/knowledge-base/architecture.md` — the producer authority row and the closed-vocabulary
    invariant.

### G. The decision record
19. `ai-agents/knowledge-base/decisions/adr-025-…md` — amendment recording that Decision 5 is
    reversed (hook data source changed), the `adversarial-reviewer` exclusion (R5), and the
    honesty-clause addendum that the marker is **not visible on `/fkit-status`** (R4).
    **The owner approved building this; the amendment text is shown in the report.**

### Explicitly NOT changed
- `ai-agents/wiki-vault/` — fkit-wiki only, separate task.
- `claude/skill-ownership-hook.sh` itself — only its data source (`skills-for-role.sh`) changes.
- `claude/skills/fkit-process-stateful-review/` — ADR-019 §Decision 1 keeps it byte-unchanged.
- `claude/skills/fkit-status/dashboard.sh` — R4 accepts the marker's invisibility rather than fixing it.
- `claude/skills/fkit-team/SKILL.md:21` — "move task files **unprompted**" remains accurate (Codex agrees).

## Verification

`npm test` = `node --test test/*.test.js && bash test/prove-red.sh`. Watch:
- `rules-block-budget.test.js` — the ~86% ceiling on the emitted block.
- `skill-ownership-hook.test.js` — the pinned mapping plus the new allow/deny cases.
- `dashboard-contract.test.js` — a case pinning that an agent-closed brief classifies as `done`,
  documenting X3's accepted behavior rather than leaving it implicit.

Then `claude/fkit-claude-init.sh .` to refresh the gitignored `.claude/` copies.

Walk the brief's `## Verification steps` and tick each — noting the two that ADR-025 made
unbuildable (the authenticated precondition and its refusal test) as **forced deviations**.

## Known forced deviations from the brief

The brief was written before ADR-025 ruled. Two of its asks cannot be built:

| Brief asks | Reality |
|---|---|
| An **authenticated precondition check** in the movers | None exists. Design spec §3 found no fabrication-resistant signal; Codex X7 attacked that negative claim and **could not break it**. Nothing to build. |
| "A spawned invocation **lacking** the precondition refuses — proven, not asserted" | Untestable as written: there is no precondition. **Partially recovered** under R3 — the hook tests do prove that an unroled or non-`fkit-*` caller is refused. |
| ADR-019 amendment "if left to implementation" | Already recorded in ADR-025 itself. |
