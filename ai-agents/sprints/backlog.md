# Backlog — the default home for unsprinted task briefs

**This is not a sprint.** It is the standing board for work that has been scoped into a brief but not
yet scheduled into one. A brief written with no sprint named lands here, and stays here until someone
pulls it into a sprint.

**⚠️ The filename is deliberately `backlog.md`, NOT `sprint-backlog.md`.** `/fkit-status` resolves the
active sprint by globbing `sprint-*.md` at the top of `ai-agents/sprints/`. This file does not match
that glob, and that is the whole mechanism by which the default status run ignores the backlog. Rename
it into the glob and every `/fkit-status` call starts reporting unscheduled work as if it were the
active sprint. **Do not "normalize" this name.**

## How work moves on and off this board

- **On:** `/fkit-task-brief` with no sprint named files the brief with `## Sprint: Backlog` and adds a
  row here (creating this file if it is absent).
- **Off:** when the **producer** pulls a task into a sprint, **three** edits, all mandatory: add the
  row to that sprint plan; flip the row here to `➡️ Moved to [Sprint N](sprint-N.md) — priority M`
  (the canonical marker — `M` is the priority the task gets in Sprint N, and the `— priority M`
  component is **not** optional here); **and update the brief's own `## Sprint` to `Sprint N`.**
  The row here is **not deleted** — a deleted row loses the pointer to where the work went.
  > **⚠️ Skip the brief-side update and the row never goes away.** Drift rule 2 compares the `Moved`
  > target against the brief's `## Sprint`; a mismatch is `drift disagreement`, and a drifted row
  > always renders. Every pulled task would leave a permanent drifted row on this board.
- **Closed here:** a backlog task can be completed or cancelled without ever joining a sprint.
  `/fkit-task-done` / `/fkit-task-cancelled` already sweep `ai-agents/sprints/` recursively, so they
  find and flip rows in this file unchanged.

## Priority

**The Priority column reads `—` by design: this board is unranked.** Ranking is what a sprint is for.
A number here would be a commitment nobody made — and the briefs themselves record `## Priority:
Unscheduled` to match (some add a free-text qualifier after it, e.g.
`Unscheduled — high-value (…)`; that is the brief's own note and **never** becomes a number in this
column). If a task needs a rank, that is the signal to pull it into a sprint, not to number it here.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | — | Add two worked examples to `evidence-before-assertion.md` — task 36, and the ADR-029/030 vault repair | [`add-worked-example-to-evidence-before-assertion.md`](../tasks/backlog/0013-add-worked-example-to-evidence-before-assertion/brief.md) |
| ➡️ Moved to [Sprint 2](sprint-2.md) — priority 85 | — | Assert task IDs are unique in the test suite (the ADR-029 duplicate-ID guard) | [`assert-task-ids-are-unique-in-the-test-suite.md`](../tasks/done/0101-assert-task-ids-are-unique-in-the-test-suite/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | — | Decide whether fkit needs a dedicated e2e-tester agent *(ruling recorded — [ADR-028](../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md))* | [`decide-whether-fkit-needs-a-tester-agent.md`](../tasks/done/0024-decide-whether-fkit-needs-a-tester-agent/brief.md) |
| 🔲 Backlog | — | Extend `prove-red.sh` to reach `fkit-claude-init.sh` (add the missing test seam) | [`extend-prove-red-to-reach-init.md`](../tasks/backlog/0037-extend-prove-red-to-reach-init/brief.md) |
| 🔲 Backlog | — | Gate the read-side symlink hazard when init reads inside `ai-agents/` | [`gate-read-side-symlink-hazard-in-init.md`](../tasks/backlog/0045-gate-read-side-symlink-hazard-in-init/brief.md) |
| 🔲 Backlog | — | Gate the symlink escape when init writes the `.fkit/interview` intake | [`gate-symlink-escape-in-init-intake-write.md`](../tasks/backlog/0046-gate-symlink-escape-in-init-intake-write/brief.md) |
| ➡️ Moved to [Sprint 2](sprint-2.md) — priority 103 | — | Decide whether to drop the numeric prefix from task-folder names *(investigation — **weighs against ADR-029 Decision 5 + the just-executed task-76 migration**; blocks 0103; owner: fkit-architect)* | [`0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names`](../tasks/done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/brief.md) |
| ➡️ Moved to [Sprint 2](sprint-2.md) — priority 104 | — | Implement the task-folder-name scheme change from the approved design *(needs 0102 incl. approval + any ADR — hard; **RESCOPED 2026-07-26 — NOT a cancellation candidate**: 0102 ruled Option C, owner-approved; owner: fkit-coder)* | [`0103-implement-task-folder-name-scheme-change`](../tasks/backlog/0103-implement-task-folder-name-scheme-change/brief.md) |
| 🔲 Backlog | — | Design an observer-agent + notes-driven self-improvement (skill-tuning) system *(investigation/design — feasibility of Claude Code observer-agents + Microsoft SkillOpt; **auto-editing skills touches the behavioural contract — modification layer stays owner-gated**; design-first per owner; blocks the implementation tasks; owner: fkit-architect)* | [`0121-design-observer-agent-and-skill-tuning-system`](../tasks/backlog/0121-design-observer-agent-and-skill-tuning-system/brief.md) |
| 🔲 Backlog | — | Add the dual-home scoping check to `/fkit-task-brief` *(ADR-027 §1 follow-up, never filed; a brief touching a dual-homed path must name both copies; independent; owner: fkit-coder)* | [`0131-add-dual-home-scoping-check-to-task-brief`](../tasks/backlog/0131-add-dual-home-scoping-check-to-task-brief/brief.md) |
| ➡️ Moved to [Sprint 2](sprint-2.md) — priority 118 | — | Reconcile the dual-homed file drift — byte-align live `ai-agents/` vs `claude/scaffold/ai-agents/` *(ADR-027 §2 follow-up, never filed; `dependency-declaration-form.md` is missing from the scaffold; the exception list is the real deliverable; blocks 0133; owner: fkit-coder)* | [`0132-reconcile-dual-homed-file-drift-live-vs-scaffold`](../tasks/backlog/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/brief.md) |
| ➡️ Moved to [Sprint 2](sprint-2.md) — priority 119 | — | Build `test/dual-home-parity.test.js` *(ADR-027 §2 follow-up, never filed; **task 0112 shipped claiming this test passed — it does not exist**; needs 0132 — ADR-027 §3 makes the order binding; owner: fkit-coder)* | [`0133-build-dual-home-parity-test`](../tasks/backlog/0133-build-dual-home-parity-test/brief.md) |
| 🔲 Backlog | — | Decide the sanctioned repair path for a half-landed close — ADR *(0123 R1/R6; a close that moves the folder but leaves a status/href stale is repairable by **nobody but the owner**; **"do nothing" is a valid outcome** — it touches the anti-laundering boundary ADR-033 just set; blocks 0135; owner: fkit-architect)* | [`0134-decide-the-sanctioned-repair-path-for-a-half-landed-close`](../tasks/backlog/0134-decide-the-sanctioned-repair-path-for-a-half-landed-close/brief.md) |
| 🔲 Backlog | — | Add the sanctioned producer-only reconcile mode to `/fkit-task-done` — and mirror both ship-loops as one unit *(implements 0134's ADR; 4-file doctrine change; **must revisit the three ADR-033 carve-out sites** whose justification it invalidates; needs 0134 + 0124 — both hard; owner: fkit-coder)* | [`0135-add-producer-only-reconcile-mode-to-task-done`](../tasks/backlog/0135-add-producer-only-reconcile-mode-to-task-done/brief.md) |
| 🔲 Backlog | — | Record the "verify against the claim" convention — citation drift + incomplete inventories *(lifts two 0124 residuals into `conventions/`; thematic adjacency is the **expected signature** of citation drift; three blind-spot classes — path / phrasing / shorthand; new convention ⇒ **owner sign-off**; dual-homed; coordinates with 0138 + 0013; owner: fkit-coder)* | [`0137-record-verify-against-the-claim-convention`](../tasks/backlog/0137-record-verify-against-the-claim-convention/brief.md) |
| 🔲 Backlog | — | Record the "a disproof carries the higher bar" convention *(a disproof is a **STOP** instruction, so a wrong one is worse than a missed finding; **must carry the escalating-against-the-reviewer half** or it teaches the wrong lesson; new convention ⇒ **owner sign-off**; dual-homed; coordinates with 0137; owner: fkit-coder)* | [`0138-record-disproof-carries-the-higher-bar-convention`](../tasks/backlog/0138-record-disproof-carries-the-higher-bar-convention/brief.md) |

## Notes

- **Backfilled 2026-07-18** (task 67) from the five briefs then carrying `## Sprint: Backlog
  (unsprinted)`. Before this board existed, unsprinted work had a brief but **no row anywhere** — it
  was invisible to every board-driven view.
- **Known drift, reported not repaired:** `gate-read-side-symlink-hazard-in-init.md` has **no
  `## Status` section**, so `dashboard.sh` reports `brief-missing-status` against its row. The board is
  correct; the brief is incomplete. Fixing a brief's own fields is the producer's call.
