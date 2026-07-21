# Worklog — Repair task links outside the wiki after the migration (task 77)

**Task:** `ai-agents/tasks/backlog/repair-task-links-outside-the-wiki-after-migration.md`
**Task ID:** 0079 · **Sprint 2**, priority 77 · **Owner:** fkit-coder

---

## ⚠️ PRE-MIGRATION BASELINE — captured 2026-07-21, BEFORE task 76 runs

> **Why this is here before 77's plan is approved.** Task 77's brief (lines 89-97) is explicit that the
> already-broken-link baseline is *"the one step of this task that cannot be done late"* — once task 76
> moves the files, a migration-broken link and a six-weeks-broken link are indistinguishable, and the
> evidence of which were *already* broken is gone forever. So this measurement was run now, ahead of
> 77's own plan gate, as the earliest safe moment. Nothing else in task 77 was started.

**Method (read-only):** swept every markdown link matching
`tasks/(backlog|done|cancelled)/[a-z0-9-]+\.md` in the four areas outside `sprints/` and `tasks/` —
`ai-agents/knowledge-base/`, `ai-agents/plans/`, `ai-agents/worklogs/`, `ai-agents/reviews/` — and
resolved each href **against its own containing file's directory** (not filename-only). Script:
`/tmp/baseline-77.mjs` (node, zero deps). Each "broken" target was then re-checked against all three
boards to confirm it is genuinely unresolvable at the linked path and to locate where it actually lives.

**Result:** **48** task-brief links found; **16 already broken** pre-migration (≈ one third), matching
the brief's indicative "16 of 47" snapshot.

### The 16 already-broken links (pre-existing rot, NOT migration-induced)

Every one points at `tasks/backlog/<slug>.md` while the target has since moved to `done/` or
`cancelled/`. Cause: the movers' reference sweep never covered `knowledge-base/` or `reviews/` (the gap
task 81 fixed). These must be repaired by task 77 **and** distinguished from any link 76 later breaks.

| # | Source (file:line) | Broken href | Target actually at |
|---|---|---|---|
| 1 | `knowledge-base/conventions/one-skill-one-output.md:80` | `…/tasks/backlog/remove-output-variants-from-fkit-status.md` | `tasks/done/` |
| 2 | `knowledge-base/decisions/adr-016-…shared-instructions-layer.md:26` | `…/tasks/backlog/add-shared-instructions-layer-for-all-agents.md` | `tasks/done/` |
| 3 | `knowledge-base/reports/2026-07-14-migration-mechanism.md:7` | `…/tasks/backlog/design-version-to-version-migration-mechanism.md` | `tasks/done/` |
| 4 | `knowledge-base/reports/2026-07-14-shared-instructions-layer.md:5` | `…/tasks/backlog/add-shared-instructions-layer-for-all-agents.md` | `tasks/done/` |
| 5 | `knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md:102` | `../tasks/done/extract-scaffold-into-claude.md` | `tasks/done/` (wrong `../` depth — one `../` short) |
| 6 | `knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md:103` | `../tasks/backlog/converge-ai-agents-additively-on-launch.md` | `tasks/done/` (wrong depth **and** wrong board) |
| 7 | `knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md:5` | `…/tasks/backlog/investigate-askuserquestion-availability-for-agents.md` | `tasks/done/` |
| 8 | `knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md:4` | `…/tasks/backlog/design-task-ship-loop-skill.md` | `tasks/done/` |
| 9 | `knowledge-base/reports/2026-07-18-design-fkit-git-agent-and-consent-model.md:5` | `…/tasks/backlog/design-fkit-git-agent-and-consent-model.md` | `tasks/cancelled/` |
| 10 | `knowledge-base/reports/2026-07-18-design-ship-loop-timeout-auto-proceed.md:5` | `…/tasks/backlog/design-ship-loop-timeout-auto-proceed.md` | `tasks/cancelled/` |
| 11 | `reviews/sprint2-scaffold-launcher-hardening.md:3` | `../tasks/backlog/fix-scaffold-knowledge-base-folders.md` | `tasks/done/` |
| 12 | `reviews/sprint2-scaffold-launcher-hardening.md:4` | `../tasks/backlog/stop-init-failure-bricking-the-launcher.md` | `tasks/done/` |
| 13 | `reviews/sprint2-scaffold-launcher-hardening.md:5` | `../tasks/backlog/refuse-init-on-weird-ai-agents-state.md` | `tasks/done/` |
| 14 | `reviews/sprint2-shared-instructions-delivery.md:3` | `../tasks/backlog/give-codex-the-universal-hard-rules.md` | `tasks/done/` |
| 15 | `reviews/sprint2-shared-instructions-delivery.md:4` | `../tasks/backlog/merge-fkit-rules-block-into-existing-root-context-files.md` | `tasks/done/` |
| 16 | `reviews/sprint2-shared-instructions-delivery.md:5` | `../tasks/backlog/add-no-secrets-rule-to-fkit-lead.md` | `tasks/done/` |

**Notes for the repair phase (do NOT act on these until 77 is plan-approved and 76 has landed):**
- Rows 5 and 6 are `../`-depth errors, not just board errors — evidence that depth correctness (brief
  line 87) is a real failure mode, not hypothetical.
- Rows 9 and 10 point at **cancelled** tasks. They are still *links* (pointers), so 77 re-points them
  to `cancelled/`. Whether any is instead a *historical prose claim* ("was live at the time") is a
  repair-time judgment per the brief's link-vs-claim rule — recorded here, not pre-decided.
- Rows 11–16 live in the **two sprint-keyed review ledgers**, which task 76 relocates to
  `ai-agents/sprints/reviews/` (design spec §5.2b). After 76, these six links' *containing file* also
  moves, so their correct post-migration `../` depth is computed from the ledger's **new** home, not
  its current `ai-agents/reviews/` home. Flagged so the repair does not use a stale base dir.

**The 32 links that resolved OK today** are recorded in the sweep output (`/tmp/baseline-77.mjs`); most
are the `plan.md`/`worklog.md`/`review.md` self-back-links written correctly at creation time. They are
the migration's job to keep resolving (their `../` depth changes when they move into task folders).

---

*(Task 77 implementation has not begun. This file currently holds only the pre-migration baseline,
which had to be captured before task 76. The rest of the worklog opens when 77's plan is approved.)*
