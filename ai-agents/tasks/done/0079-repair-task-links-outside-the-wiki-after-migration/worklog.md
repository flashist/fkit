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

---

## Execution (2026-07-21, after task 76 merged to `main` @ `331f298`)

**Approach:** unified repairer — for every broken relative `](…​.md)` link in `knowledge-base/`,
`tasks/` and `sprints/reviews/`, resolve the intended current target (depth-broken-to-existing-file →
recompute; task/review/plan/worklog slug → the in-folder artifact; sprint-keyed → `sprints/reviews/`)
and rewrite via `path.relative` from the containing file — fixing the relative **depth** the added
folder level broke. `wiki-vault/` never touched (task 78).

**The scope was wider than task-brief links alone.** A first narrow pass fixed 48 `tasks/<board>/<slug>.md`
links; a full sweep then exposed the rest the migration broke: links to **moved review ledgers**
(`reviews/<slug>.md` → `<folder>/review.md`), **moved plans/worklogs**, and — the big one — **110
depth-broken outbound links** from every brief/artifact that now sits one directory deeper.

**Result:** **179 link rewrites** across two passes — a first unified pass (156) plus a **corrected
second pass (+23)** after Round-1 review exposed two blind spots (see below).

> ### ⚠️ Round-1 review caught a verification failure — corrected here (findings R3/R1/R2)
> My first verification claimed *"335 links checked, 5 unresolved, 0 real breaks."* **That was false.**
> The checker (and the first repairer) filtered links to those starting `./`/`../` **and** ending
> `.md`, so it was blind to two forms: **bare same-directory sibling links** `](slug.md)` and
> **non-`.md` targets** (e.g. `](…/claude/fkit-claude.sh)`). It checked ~335 of the ~551 relative
> file-links actually in scope and missed **19 genuine breaks** (18 sibling links + 1 depth-broken
> `.sh`). Both reviewers (mine + Codex) converged on them. This is the same class of failure as the
> task-79 emit_block lesson: a measuring instrument blind to part of its domain reports a false pass.
> **Fix:** a corrected repairer/checker that handles every relative form and both `.md` and non-`.md`
> targets, checking against `ai-agents/` and the repo root.

**Verification (corrected, reproducible):**
- Comprehensive resolution across the three areas — **every relative file-link (bare, `./`, `../`, any
  extension), resolved against its own directory**: **551 links checked, 21 unresolved** — and **all 21
  are illustrative placeholders/quoted examples** (enumerated below); **0 real broken links remain**.
- All **16 pre-migration baseline** entries repaired; the 19 Round-1 misses (Appendix A + R2) repaired.
- The 2 sprint-keyed ledgers findable at `sprints/reviews/`; their inbound links resolve.
- `dashboard.sh sprint-2.md` → exit 0, **zero drift**; `node --test` → **449/449**.
- `wiki-vault/` unchanged (0 files); `sprints/*.md` (non-reviews) unchanged except 77's own status flip.

### Deliberately left alone — claims/examples, NOT live pointers (link-vs-claim rule)
All 21 unresolved links are illustrative — placeholder slugs, quoted convention text, or hypothetical
examples inside docs that *discuss* links. Repointing any would corrupt the documentation.
- **Design spec** `reports/2026-07-19-…id-scheme.md` — `](../0043-other/brief.md)`, `](../backlog/other.md)`,
  `](../../backlog/0043-other/brief.md)` (×4): hazard-illustration examples (placeholder slug `other`).
- **Scaffold-template quote** `tasks/done/0018-…/brief.md:44` (blockquote of scaffold-CLAUDE.md text)
  and **prose claim** `0076-…/brief.md:51` (a sentence quoting the path as a string) — the correct form
  is the **repo-root-relative** `](ai-agents/knowledge-base/architecture.md)`, as this repo's own root
  `CLAUDE.md` uses; NOT `../…`. (R5/R6/R7 — Round 2 caught my repairer wrongly rewriting these; restored.)
- **Fenced dashboard-output specimen** `reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md:102-103`
  — a hand-authored ```⟦fkit-dashboard v1⟧``` board example (line 121: "pasted verbatim"). Its rows
  `](../tasks/done/extract-scaffold-into-claude.md)` and `](../tasks/backlog/converge-…-on-launch.md)`
  are documentation, not live pointers; :103 is a `🔲 Backlog` row that must keep pointing at `backlog/`
  or the example's own drift-illustration logic breaks. (R8/R9 — restored verbatim, owner-ruled.)
- **Review-ledger quoted examples** `0001-…/review.md:13` `[Sprint N](sprint-N.md)` / `[Sprint 2](sprint-2.md)`
  (convention text); `0036-…/review.md:180` `[ADR-031](adr-031-future.md)` (hypothetical); `0020-…/review.md:555`
  `[Sprint 10](../sprint-10.md)` (moved-row fixture; Sprint 10 never existed) (R5/Appendix B).
- **This task's own docs** `0079-…/brief.md` `](other-task.md)`, and `0079-…/review.md` + `0079-…/worklog.md`
  which *quote* the placeholder strings (`slug.md`, `sprint-N.md`, `…​.md`, the `0043-other` examples) while
  describing the repair.

## Round-2 over-reach — fixed (findings R6–R9)
My Round-2 "handles every relative form" repairer was **indiscriminate** — it rewrote links inside a
fenced dashboard specimen (R8/R9), a scaffold-template blockquote (R6), and a prose claim (R7): the exact
link-vs-claim violation this task exists to prevent, caused by my own fix, and it even reached into the
ledger/worklog. **All 4 restored verbatim** to their originals (owner-ruled restore). The verification
below is now **fence/quote-aware** — it flags *changed* links inside ```-fences, blockquotes and
backtick-quoted paths, not just unresolved ones (the resolve-only check missed R6–R9 because they all
*resolve*).

## Close-out evidence packet
- **Task:** `…/0079-…/brief.md`. **Problems:** two of my own instruments were blind in opposite
  directions on this same task — the Round-1 checker missed 19 real breaks (blind to bare-sibling +
  non-`.md` links); the Round-2 repairer over-reached, rewriting 4 documentation examples/templates/claims
  (R6–R9). Both caught by the review (own pass + Codex, Rounds 1–2). **Lesson:** a link-repair sweep
  must be context-aware from the outset (skip fenced specimens, template payloads, quoted-path prose),
  and verification must check *what changed inside protected contexts*, not only *what fails to resolve*.
- **Review ledger:** `…/0079-…/review.md` — **closed-out**, converged, merge-recommended. 9 findings
  (R1–R9), all defects, all fixed; **0 accepted residuals**. Codex full coverage Rounds 1–2.
- **Verification (final):** corrected comprehensive check — **551 relative file-links, 21 unresolved,
  all illustrative examples/claims, 0 real broken navigation links**; new **fence/quote-aware check → 0
  changed links inside ```-fences** beyond the restored 4. `dashboard.sh sprint-2.md` → exit 0, zero
  drift; `node --test` → **449/449**; `wiki-vault/` untouched (task 78's).
- **Brief `## Verification steps` walked:** mechanical sweep returns only left-alone claims ✓; every
  relative link resolves (except enumerated examples) ✓; baseline reconciled (16/16) ✓; 2 sprint-keyed
  ledgers findable + inbound links resolve ✓; dashboard no new drift ✓.
- **Change surface:** ~110 files across `knowledge-base/`, `tasks/` (briefs + in-folder
  plan/worklog/review), `sprints/reviews/`; docs-only.
- **Residuals / follow-ups:** none. `wiki-vault/` link repair is **task 78** (fkit-wiki).
- **Commit state:** branch `repair-task-links-post-migration` (off `main`@`331f298`), **uncommitted**;
  the loop never commits. **The owner merges** (like task 76).
