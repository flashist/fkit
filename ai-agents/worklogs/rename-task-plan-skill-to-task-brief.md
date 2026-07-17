# Worklog — Task 50: rename `fkit-task-plan` → `fkit-task-brief`

Task file: `ai-agents/tasks/backlog/rename-task-plan-skill-to-task-brief.md`
Plan: `ai-agents/plans/rename-task-plan-skill-to-task-brief.md` (owner-approved at plan gate)

## Owner-decision log
- **Plan gate (owner-approved):** the full disambiguated rename set, incl. the recommended disposition
  for the historical `fkit-claude.sh:228` comment — **genericize** (drop the stale skill name from the
  task-14 example) rather than rename it (would falsify history) or leave it (stale name lingers).

## Worklog
- P4 build: git mv skill dir + self-refs; SoT/mirrors; producer prompt; cross-ref pointers; tests;
  dual-home conventions; ship-loop namespace mention; genericize the historical comment.
- P5 verify (evidence below).

## Files touched / change surface
- `git mv claude/skills/fkit-task-plan/ → claude/skills/fkit-task-brief/` (+ SKILL.md `name:` and title).
- SoT/mirrors: `claude/skills-for-role.sh`, `claude/skills/fkit-team/SKILL.md`, `claude/README.md`.
- `claude/agents/fkit-producer.md` (×2), `claude/fkit-claude.sh` (genericized historical comment).
- Cross-refs: `claude/skills/fkit-status/dashboard.sh`, `test/dashboard-contract.test.js` (comments + R19 title).
- Tests: `test/skill-ownership-hook.test.js` (UNIVERSE + OWNED.producer).
- Conventions (dual-home): scaffold + live `task-status-vocabulary.md` & `evidence-before-assertion.md`.
- `claude/skills/fkit-task-ship-loop/SKILL.md:22` (namespace mention simplified).
- Loop artifacts (not deliverable): plan, worklog, status flips.

## Verification evidence (after final code change)
- `grep -rn "fkit-task-plan" claude/ test/` → **zero**. Only residual `task-plan`: the ADR-020 filename `per-task-plan` (artifact, not skill) — correctly left.
- `node --test` → **346 pass / 0 fail**. The skill-ownership matrix drives the real `skill-ownership-hook.sh` + `skills-for-role.sh`: `producer × fkit-task-brief → allow`, every other role → `deny` — SoT and hook agree on the new name; `fkit-task-plan` no longer in the universe.
- `git diff --stat -- claude/skills/fkit-plan-task/` → empty (coder's skill byte-untouched).
- `claude/fkit-claude-init.sh <scratch>`: `.claude/skills/fkit-task-brief/` present, `fkit-task-plan/` absent, coder's `fkit-plan-task/` still regenerated.
- Line 70 of the renamed SKILL.md is still the `Depends on:` plain-form instruction (self-ref edits didn't shift it) → the `dashboard.sh`/R19 cross-refs stay valid.
- **Caveat (loud):** the interactive `fkit producer` session check (`/fkit-task-brief` runs, `/fkit-task-plan` gone) can't be run from this coder session (role lock). The hook suite + init regeneration cover the mechanism; the live-session smoke check is owner/producer-run.

## Brief verification steps — walked
- ⚠️ `fkit producer` session runs `/fkit-task-brief` / `/fkit-task-plan` gone — owner/producer-run (role lock); mechanism verified via hook suite.
- ✅ PreToolUse gate allows producer `fkit-task-brief`, denies other roles (hook matrix, 346/0).
- ✅ `node --test` green incl. hook suite.
- ✅ `grep -r "fkit-task-plan" claude/ test/` → zero.
- ✅ coder's `fkit-plan-task/` byte-untouched.
- ✅ init regeneration → `fkit-task-brief/` present, `fkit-task-plan/` absent.

## Review (round 1) — ledger `ai-agents/reviews/rename-task-plan-skill-to-task-brief.md`
- **Verdict:** ⚠️ Changes requested — 2 low, non-blocking doc-reference defects. **Codex coverage: FULL** — reviewer's own pass + Codex adversarial (`codex exec`, read-only) both ran; Codex independently flagged R1 and surfaced R2. Core rename verified correct (SoT+hook+mirrors+tests agree; coder skill untouched; genericized comment sound).
- **R1 (CORRECT, Fixed):** `architecture.md:297` living canon still named `/fkit-task-plan` — a genuine missed live functional reference (my sweep scoped `claude/ test/`). **Owner: fix under this task** → changed to `/fkit-task-brief`, coder's `:298` `/fkit-plan-task` left intact.
- **R2 (PARTIALLY CORRECT, Fixed):** live backlog brief task 49 (`:58`, `:94`) named `/fkit-task-plan` for future work. **Owner: fix now** (over the reviewer's accept-as-residual lean) → both refs → `/fkit-task-brief`.
- **Scope note:** R1 (architecture.md) and R2 (task 49 brief) are outside the plan's enumerated file list; both edits applied only after explicit owner disposition.
- No accepted residuals (both actioned). Ledger **closed-out**, last verify green.

## Owner-decision log (append)
- **R1 disposition:** fix under this task (architecture.md:297).
- **R2 disposition:** fix now (task 49 brief :58, :94) — chosen over reviewer's accept-as-residual lean.

## Post-fix verification
- `grep -rn "fkit-task-plan" claude/ test/ ai-agents/knowledge-base/architecture.md <task-49 brief>` → **zero** functional hits.
- `architecture.md:298` coder `/fkit-plan-task` reference intact (1 hit preserved).
- `node --test` unaffected by the doc-only R1/R2 edits (346/0 from the pre-fix run stands).

## Residuals / recommended follow-ups (named only)
- **Task 51** — wiki sync of the `task-plan`→`task-brief` rename (fkit-wiki's exclusive path; `wiki-vault/` untouched here).
- Consuming projects receive the rename via normal `.claude/` regeneration on next launch; convergence never deletes, so any stale `fkit-task-plan` string inside a consumer's own `ai-agents/` ages out — not this task's concern.

## Commit state
- **Not committed.** Working tree carries the `git mv` (rename staged) + edits to `claude/` source, tests, dual-home conventions, `architecture.md`, task 49 brief, and the loop artifacts (plan/worklog/ledger, status flips). The loop never commits — the owner commits.

## Status: 🔄 In progress — ready for the owner's done-gate
Complete and verified; `✅ Done` is owner-gated via `/fkit-task-done`.
