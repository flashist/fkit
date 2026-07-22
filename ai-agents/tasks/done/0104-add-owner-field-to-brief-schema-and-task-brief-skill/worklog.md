# Worklog — 0104 add `## Owner` field to brief schema + task-brief skill

Ship-loop (`/fkit-task-ship-loop`). Plan approved 2026-07-22. `plan.md` is the autonomy boundary.

## Owner-decision log
- **Plan gate (2026-07-22):** owner confirmed the two reserved design sub-decisions —
  1. `## Owner` is **MANDATORY** (documented like `## Status`; dashboard enforcement deferred to 0106).
  2. Value is an **ENUM of the seven live roles** (authoritative list; ADR-028 tester excluded).
- **Obvious winner (owner away): value-list home = a new convention doc** `task-owner-vocabulary.md`,
  the direct sibling of `task-status-vocabulary.md` (authoritative list for a mandatory brief field).
  Indexed in `conventions/README.md`. Chosen over an inline list — idiomatic, reader/linter-findable.
- **Obvious winner (owner away): fold the populate step into task-brief step 4** rather than a new
  numbered step — avoids renumbering steps 6–10 and their cross-references. Same outcome, smaller diff.
- **Judgment call resolved in-plan: byte-identical dual-home copy, authored portably.**
  Discovered the existing scaffold conventions (`task-status-vocabulary.md` etc.) are *genericized* and
  diverge from their live copies — but `dual-home-parity.md` (convention **in force**) records those by
  name as **"Known drift" to fix**, and mandates fkit-authored conventions be **byte-identical**. So I
  did **not** imitate the drift; I authored the new doc portably (skill-name references, no repo-internal
  ADR/task/path coupling) so a byte-identical copy is genuinely correct in both homes.
  → **Open question flagged for owner** (below): whether scaffold convention copies *should* be
  genericized for consumers is a live tension in dual-home-parity's model — named, not acted on.

## Change surface (per approved plan)
1. NEW `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md`
2. NEW `claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` (byte-identical)
3. EDIT `ai-agents/knowledge-base/conventions/README.md` — index row
4. EDIT `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` — index row (mirror)
5. EDIT `claude/skills/fkit-task-brief/SKILL.md` — skeleton + populate guidance + rule

## Progress
- [x] Plan approved, persisted to plan.md
- [x] Status → 🔄 In progress (brief + sprint-2 row)
- [x] Implement change surface (all 5 files)
- [x] Verify — all green (see Verification evidence)
- [x] Review (fkit-reviewer / stateful) — closed-out, 1 low defect fixed, FULL model-diverse coverage
- [x] Re-verify after fix — green
- [x] Close — agent-closed

## Review ledger
- Path: `review.md` (this folder).
- **Verdict:** ⚠️ Changes requested — 1 defect (low, non-blocking). Now **closed-out**.
- **Codex coverage: FULL / model-diverse** — reviewer's own pass + Codex adversarial (`codex exec`) both ran; not partial.
- **R1** (low, `SKILL.md:86`): step-4 "diff against an existing brief to confirm" mismatched the new
  `## Owner` skeleton line (existing briefs lack the field until 0105). CORRECT, defect (omission in my
  edit). **Fixed** — added an authoritative-skeleton note (`SKILL.md:103-107`). Mechanical + in-plan →
  applied autonomously; re-verified green.
- **Accepted residual (owner-settled):** the seven-role enum includes non-doer roles (`fkit-lead`,
  `fkit-adversarial-reviewer`). Endorsed by the owner's plan-gate ruling ("ENUM of the seven live roles").
  Re-raise only if a future decision narrows "owner" to doer-roles.

## Brief `## Verification steps` — walked
1. ✅ `fkit-task-brief/SKILL.md` skeleton includes `## Owner`, positioned after `## Status` (lines 95/96).
2. ✅ The skill now mandates a populated `## Owner` with a valid role on every new brief (step-4 skeleton
   + populate bullet + Rules line). *(No executable test exists for a markdown skill — verified by
   inspection that the instructions are internally consistent and unambiguous; stated honestly.)*
3. ✅ Valid values are written down where a reader/linter can find them —
   `task-owner-vocabulary.md`, indexed in `conventions/README.md`; excludes the not-yet-built eighth role.
4. ✅ No existing brief modified by this task — only the `0104` folder's own status/plan/worklog changed
   (loop bookkeeping); zero of the ~103 other briefs touched. *(Literal "no edits under `tasks/`" reading
   noted in Verification evidence — the loop must write its own task's status/artifacts; intent holds.)*
5. ✅ `dashboard.sh ai-agents/sprints/sprint-2.md` runs clean, **0 drift lines**. (Count shows `1 in
   progress` — the loop's own In-progress flip on 0104; no `id-mismatch`-style reconciliation fired.)

## Files touched / change surface
- `claude/skills/fkit-task-brief/SKILL.md` (skeleton + populate bullet + Rules line + R1 note)
- `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` (NEW)
- `claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` (NEW, byte-identical)
- `ai-agents/knowledge-base/conventions/README.md` (index row)
- `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` (index row + count fix)
- Loop bookkeeping: 0104 brief `## Status`, sprint-2 row, `plan.md`, `worklog.md`, `review.md`.

## Problems encountered
- The two homes' existing convention copies are **out of step** (scaffold copies genericized) — recorded
  as "Known drift" in `dual-home-parity.md`. I authored the new doc **portably** so its byte-identical
  copy is correct in both homes, without imitating the drift.

## Lessons learned
- Adding a field to the brief skeleton has a **transient-window** side effect: the step-4 "diff against
  an existing brief" instruction goes stale until backfill (0105) lands. Worth a note whenever the
  schema grows ahead of the data. (This was R1.)

## Residuals / deferrals & recommended follow-ups (named only — not filed)
- **dual-home-parity model tension:** whether scaffold convention copies *should* be genericized for
  consumers (vs the byte-identical rule) is unresolved and bigger than 0104. **Owner decided (2026-07-22):
  scope a follow-up task** — producer to reconcile the drift to byte-identical OR amend dual-home-parity
  to sanction genericized scaffold copies (likely an ADR revisit). Hand-off to the producer; the coder
  does not file briefs.
- **0105** (backfill ~103 briefs) and **0106** (render + dashboard `owner-missing`/invalid enforcement)
  remain the downstream work this task unblocks — already scoped.
- Enum-narrowing to doer-roles — only if the owner wants it (see residual).

## Open questions for the owner
- **Scaffold-copy genericization vs byte-identical** (see Owner-decision log). Not 0104's to settle; I
  authored portably to sidestep it. Flag for a dual-home-parity follow-up.

## Commit state
- **Nothing committed** — the loop does not commit. All edits (source, docs, plan/worklog/review) are
  left in the working tree for the owner. `git status` at close: 5 substantive files + loop artifacts,
  plus the pre-existing 0092/sprint-2 changes that were already in the tree at session start.

## Verification evidence (run after final code change, 2026-07-22)
- **V1** `grep -n '^## Status$|^## Owner$' SKILL.md` → lines 95/96 — `## Owner` immediately after `## Status`. ✅
- **V2** vocab doc `diff` live vs scaffold → IDENTICAL; index rows identical across both READMEs. ✅
- **V3** exactly 7 role rows (`grep -c '^| \`fkit-'` → 7); `tester` appears only in the excluded-eighth-role warning, never as a valid value. ✅
- **V4** `git status --porcelain ai-agents/tasks/` → only the `0104` folder changed (brief status + plan.md + worklog.md). The `0092` RM and part of `sprint-2.md` were **pre-existing** at session start (opening git status), not this task. **Zero other briefs touched** — V4's real intent (no backfill; that's 0105) holds. ✅ *(Literal-reading caveat: the loop necessarily writes 0104's own status/plan/worklog under `tasks/`; the check guards against touching the ~103 other briefs, which did not happen.)*
- **V5** `dashboard.sh ai-agents/sprints/sprint-2.md` → runs clean, **no drift lines**. Count now `1 in progress` (was 0) — the loop's own In-progress flip on 0104, expected, not drift. ✅

## Change surface (files touched)
- `claude/skills/fkit-task-brief/SKILL.md` — skeleton (`## Owner` after `## Status`) + populate bullet + Rules line
- `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` — NEW (authoritative enum)
- `claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` — NEW (byte-identical)
- `ai-agents/knowledge-base/conventions/README.md` — index row
- `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` — index row + "Four"→"Five" count fix
- (loop bookkeeping: 0104 brief status, sprint-2 row, plan.md, worklog.md)

## Open questions for the owner
- **Scaffold-copy genericization vs byte-identical.** dual-home-parity.md mandates byte-identical and
  labels the genericized scaffold conventions "drift". But a genericized copy is arguably *more correct*
  for a brand-new consuming project (no fkit-internal ADR/task refs). This is a dual-home-parity model
  question, not 0104's to settle — recommend a follow-up (producer-scoped). I authored portably to sidestep it.
