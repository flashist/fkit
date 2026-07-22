# Worklog — 0105 backfill `## Owner` into all existing briefs

Ship-loop. Plan approved 2026-07-22. `plan.md` is the autonomy boundary.

## Owner-decision log
- **Plan gate (2026-07-22):** owner confirmed the plan and, for the 25 unrecoverable briefs, chose
  *"Accept my suggestions"* — the agent-suggested owner map, **owner-ratified** (the explicit sign-off
  the brief requires; not a silent default). Any later correction = a one-line edit.
- **Obvious winner (implicit in plan): leave the redundant `## Notes` `**Owner:**` line as-is** — it
  often carries extra context; the new `## Owner` field is the source of truth regardless. Applied uniformly.
- **Root-cause note (autonomous):** the first backfill script used a bash associative array; macOS
  `bash 3.2` mangles `declare -A` (keys arithmetic-evaluated as octal → `0018`/`0038` break). Rewrote
  the assignment map as a portable `case` statement. No files were written before the fix (dry-run aborted safe).

## Measured reality (re-derived at run time, 2026-07-22)
- 108 briefs total (backlog 10 · done 87 · cancelled 11); 0 had `## Owner` before this task.
- **83 recoverable** from `## Notes` (53 coder · 19 architect · 9 wiki · 2 producer) — all valid roles;
  agree with the sprint-2 board wherever both exist; **zero disagreements**.
- **25 owner-assigned** (below).

## The 25 owner-assignment list (dated 2026-07-22 · agent-suggested, OWNER-RATIFIED — none inferred silently)
| Brief | Owner | Conf at plan gate |
|---|---|---|
| cancelled/0002-add-ci-validate-bundles | fkit-coder | high |
| done/0011-add-status-skill-to-producer | fkit-coder | high |
| cancelled/0016-amend-subagent-disconnect-incident-doc | fkit-architect | LOW |
| done/0018-bake-architecture-pointer-into-scaffold-templates | fkit-coder | high |
| done/0019-build-claude-self-update | fkit-coder | high |
| done/0021-build-fkit-reconnect-tooling | fkit-coder | high |
| done/0024-decide-whether-fkit-needs-a-tester-agent | fkit-architect | med |
| done/0025-delete-omnigent-directory | fkit-coder | high |
| cancelled/0033-document-consult-chain-envelope | fkit-architect | med |
| done/0034-enforce-task-status-vocabulary | fkit-coder | high |
| done/0035-extend-initiate-project-fill-overview | fkit-coder | high |
| done/0038-extract-scaffold-into-claude | fkit-coder | high |
| cancelled/0040-fix-agent-count-doc-drift-and-fresh-detection-dup | fkit-coder | high |
| done/0041-fix-claude-agents-md-placeholder-text | fkit-coder | high |
| done/0044-formalize-knowledge-base-incidents-folder | fkit-architect | med |
| done/0048-give-every-agent-direct-wiki-query-access | fkit-coder | high |
| done/0059-knowledge-base-hygiene-post-omnigent | fkit-architect | LOW |
| done/0060-make-codex-a-checked-prerequisite | fkit-coder | high |
| done/0063-reconcile-skill-ownership-source-of-truth | fkit-coder | high |
| cancelled/0071-remove-adversarial-reviewer-eager-spawn | fkit-coder | high |
| done/0083-rewrite-docs-post-omnigent | fkit-coder | LOW |
| done/0084-rewrite-installer-single-flavor | fkit-coder | high |
| done/0085-rollout-adr-004-fixed-consult-titles | fkit-coder | high |
| done/0091-verify-onboarding-flow-end-to-end | fkit-coder | med |
| done/0098-wiki-sync-post-omnigent | fkit-wiki | high |

## Progress
- [x] Plan approved, persisted to plan.md; owner ratified the 25 map
- [x] Status → 🔄 In progress (brief + sprint-2 row)
- [x] Apply backfill (108 briefs: 83 Notes-derived + 25 owner-ratified)
- [x] Verify — all green
- [x] Review (fkit-reviewer / stateful) — closed-out; 2 low defects fixed; FULL model-diverse coverage
- [x] Re-verify after fixes — green
- [x] Close — agent-closed

## Review ledger
- Path: `review.md` (this folder). **Verdict:** ⚠️ Changes requested — 2 low, non-blocking. Now **closed-out**.
- **Codex coverage: FULL / model-diverse** — reviewer's own full re-derivation of all 108 briefs + Codex
  adversarial (`codex-cli 0.144.4`) both ran. **Crux confirmed: all 108 written values correct vs source, zero mis-scrapes.**
- **R1** (low, `0030/brief.md`): `## Owner` landed after an intervening `## Correction` block instead of
  right after `## Status`. Value correct. **Fixed** — repositioned; re-verified. Mechanical/in-plan → autonomous.
- **R2** (low, `plan.md:70`): stale prose tally (18·4·1 vs real 19·5·1). **Fixed** — corrected to 19·5·1.
- **Accepted residuals (owner-settled):** (1) redundant `## Notes` owner line kept (approved plan);
  (2) the 25 owner-assigned values (plan-gate ratified). Neither re-litigated.

## Brief `## Verification steps` — walked
1. ✅ Every brief under backlog/done/cancelled has `## Owner` — **108 `## Owner` == 108 `brief.md`**, exactly one each.
2. ✅ Every value is a valid role (72 coder · 24 architect · 10 wiki · 2 producer = 108); **none is the eighth/tester role**.
3. ✅ The residual-unknown list (25) is in `worklog.md`, dated 2026-07-22, and **every** entry was owner-ratified — none inferred.
4. ✅ No `## Notes`-vs-board owner disagreements existed (re-checked at run time: zero).
5. ✅ `dashboard.sh sprint-2` → no new drift (0 drift lines; no `id-mismatch`).

## Files touched / change surface
- **108 × `ai-agents/tasks/*/*/brief.md`** — each gained one `## Owner` line (0030 also repositioned per R1).
- Loop bookkeeping: `0105/brief.md` status, `sprint-2.md` 0105 row, `plan.md`, `worklog.md`, `review.md`.
- **No** source, board-content, wiki, or `## Status`/folder changes on any other brief.

## Problems encountered
- **macOS bash 3.2 mangles `declare -A`** (associative-array keys arithmetic-evaluated as octal → `0018`/`0038`
  break). First script aborted safe on a dry-run; rewrote the 25-map as a portable `case` statement.
- **One atypical brief (0030)** carries a `## Correction` section between `## Status` and `## Context`, so the
  generic "insert before `## Context`" rule mis-placed its `## Owner` (R1). Fixed individually.

## Lessons learned
- A schema-position rule keyed on "the next heading" (`## Context`) is fragile against briefs with extra
  sections between `## Status` and `## Context`. A future bulk edit should anchor on `## Status` itself.
- Never trust `declare -A` in a script that may run under system bash on macOS.

## Residuals / deferrals & recommended follow-ups (named only — not filed)
- **0106** (render the Owner column + optional `owner-missing`/invalid dashboard enforcement) is now unblocked —
  the data exists on every row. Already scoped.
- The 3 low-confidence assignments (0016, 0059, 0083) are owner-ratified; revisit only if an owner value is disputed.

## Commit state
- **Nothing committed** — the loop does not commit. All edits (108 briefs + loop artifacts) are in the working
  tree for the owner. The throwaway backfill script lives in `/tmp`, not the repo.

## Verification evidence (2026-07-22, after apply)
- **V1** brief.md count == `## Owner` count: **108 == 108**; exactly one `## Owner` per brief. ✅
- **V2** owner VALUE strings are exactly 4, all valid roles: 72 coder · 24 architect · 10 wiki · 2 producer (=108). No tester, no junk. ✅
- **V3** position: `## Owner` sits between `## Status` and `## Context` in every spot-checked brief (3 boards). ✅
- **V4** `dashboard.sh sprint-2` → **0 drift lines**; counts total 90 (done 81 · in-prog 1 · backlog 3 · cancelled 5). ✅
- **V5** git scope: 108 `brief.md` changed (the intended bulk edit) + `sprint-2.md` (0105 status row, loop bookkeeping). No source/board-content edits. ✅
- **Assigned-25 spot-check**: 0016/0024/0033/0044/0059→architect, 0098→wiki, 0083/0091→coder — all match the ratified map. ✅

## Tooling
- Backfill script: `/tmp/backfill_owner.sh` (throwaway, NOT shipped). Re-derives + validates at run time,
  fails loudly if the 83/25 split changed, asserts one valid `## Owner` per brief. Kept out of the repo.
