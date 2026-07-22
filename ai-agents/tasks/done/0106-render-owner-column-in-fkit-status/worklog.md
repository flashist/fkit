# Worklog — 0106 render the Owner column in /fkit-status

Ship-loop. Plan approved 2026-07-22. `plan.md` is the autonomy boundary.

## Owner-decision log
- **Plan gate (2026-07-22):** owner chose **add the `brief-missing-owner` drift kind** (mirror
  `brief-missing-status`) — a missing mandatory owner is drift, and renders `—`.
- **Obvious winner (per brief's "keep it minimal"): no per-task owner record in ⟦FACTS⟧** — the board
  column + the drift record cover it; adding owner facts is needless churn.
- **Obvious winner: auto-inject a default `## Owner` in the test fold helper** (mirrors its existing
  `## ID` injection) so existing fixtures don't spuriously emit the new drift — bounds test churn to the column.

## Change surface
- `claude/skills/fkit-status/dashboard.sh` — read `## Owner`; owner cell (`—` fallback); `brief-missing-owner` drift; header/separator/row emit gain the column.
- `claude/skills/fkit-status/SKILL.md` — five→six columns; drift-kind list.
- `test/dashboard-contract.test.js` — fold auto-injects owner; header + visible-row assertions; new owner-present + owner-missing test.
- (sync gitignored `.claude/skills/fkit-status/` copies for the live verification command.)

## Progress
- [x] Plan approved, persisted; owner chose the drift kind
- [x] Status → 🔄 In progress (brief + sprint-2 row)
- [x] Implement dashboard.sh + SKILL.md
- [x] Update tests (fold auto-inject + assertions + new Owner test)
- [x] Verify — all green
- [x] Review (fkit-reviewer / stateful) — closed-out; 2 low fixed; FULL model-diverse coverage
- [x] Re-verify after fixes — 451/0
- [x] Close — agent-closed

## Review ledger
- Path: `review.md`. **Verdict:** ⚠️ Changes requested — 2 low, non-blocking. Now **closed-out**.
- **Codex coverage: FULL / model-diverse** — reviewer's own pass + Codex adversarial (`codex exec`) both ran.
- **R1** (test-robustness): the owner test pinned only the drift *fact*, not `mark_drift`'s force-render +
  roll-up effects (both fixtures were open rows). **Fixed** — missing-owner fixture is now a ✅ Done row, so
  the test proves the drift force-renders the hidden row AND drives the roll-up `drift on tasks 2` clause.
- **R2** (doc): the nonconformance grammar line showed `cell="…"` universally; `brief-missing-owner` (and the
  pre-existing `brief-missing-id`) carry no `cell=`. **Fixed** — grammar line → `[kind-specific field]` + note.
- **Accepted residual (reviewer-recorded, pre-existing behavior):** the owner cell renders raw like the
  board's existing free-text sentinel; `## Owner` is controlled role vocabulary — no new escaping regression.

## Brief `## Verification steps` — walked
1. ✅ `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` header = `| Status | # | Task | Filename | Owner | Next step |`, Owner between Filename and Next step.
2. ✅ Rendered rows show each task's `## Owner` (spot: 0108→fkit-architect, 0107→fkit-coder).
3. ✅ A brief with no `## Owner` renders `—` (new test asserts it + force-render + drift).
4. ✅ `SKILL.md` and the script agree — zero lingering "five column"; SKILL says six columns.
5. ✅ `node --test` (dashboard-contract + launcher-contract + full suite): **451 pass / 0 fail**, incl. the new Owner fixture.
6. ✅ Roll-up/counts unchanged (total 90); no new spurious drift (0 `brief-missing-owner` live).

## Files touched / change surface
- `claude/skills/fkit-status/dashboard.sh` — read `## Owner`; owner cell (`—` fallback); `brief-missing-owner` drift; header/separator/row emit.
- `claude/skills/fkit-status/SKILL.md` — five→six columns (×2); drift-kind list + grammar-line note.
- `test/dashboard-contract.test.js` — fold auto-injects default owner; header/row/column-count assertions; new Owner test.
- `.claude/skills/fkit-status/{dashboard.sh,SKILL.md}` — synced (gitignored, not committed).
- Loop bookkeeping: 0106 brief status, sprint-2 row, plan.md, worklog.md, review.md.

## Problems encountered
- Adding the mandatory-owner drift kind made every existing test fixture (which lacked `## Owner`) spuriously
  drift. Solved by auto-injecting a default `## Owner` in the test fold helper, mirroring its `## ID` injection
  — bounding the churn to the board column only.

## Lessons learned
- When a change adds a new drift kind keyed on a field, existing fixtures that omit the field will all newly
  drift; inject a default at the fixture-fold layer (as done for `## ID`) rather than editing every fixture.
- Pin a `mark_drift` addition via its *observable fused effects* (force-render of an otherwise-hidden row +
  roll-up clause), not just the emitted fact — an open-row fixture can't distinguish them (review R1).

## Residuals / deferrals & recommended follow-ups (named only — not filed)
- None required. `## Owner` is now defined (0104), backfilled (0105), and rendered + enforced (0106) — the
  three-task arc the owner asked for is complete.
- The reviewer's owner-cell-escaping residual stands (re-raise only if the board gains general brief-cell escaping or owner becomes free text).

## Commit state
- **Nothing committed** — the loop does not commit. All edits are in the working tree for the owner.
  (`.claude/` copies are gitignored refresh copies, not part of the diff.)

## Verification evidence (2026-07-22)
- **V1** live `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` → header `| Status | # | Task | Filename | Owner | Next step |`; Owner between Filename and Next step. ✅
- **V2** rendered owners match briefs (spot: 0108→fkit-architect, 0107→fkit-coder). ✅
- **V3** missing `## Owner` → `—` (new test asserts it). ✅
- **V4** no lingering "five column" in the skill dir; SKILL says "six columns". ✅
- **V5** `node --test` full suite: **451 pass, 0 fail** (dashboard-contract 105 incl. new Owner test; launcher 26). ✅
- **V6** roll-up/counts unchanged (total 90); **0** `brief-missing-owner` drift on live tree (all briefs have owners). ✅
