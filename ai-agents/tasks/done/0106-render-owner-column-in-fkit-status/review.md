# Review — 0106-render-owner-column-in-fkit-status

Task: ai-agents/tasks/done/0106-render-owner-column-in-fkit-status/brief.md
File(s) under review: claude/skills/fkit-status/dashboard.sh · claude/skills/fkit-status/SKILL.md · test/dashboard-contract.test.js
Status: closed-out

## Reviewer findings
| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1     | low | test/dashboard-contract.test.js:1065 | The new owner test asserts the `brief-missing-owner` FACT but not `mark_drift`'s fused effects (forced row render + roll-up drift clause). An edit dropping `mark_drift` (keeping `add_fact`) stays green while silently breaking the always-render-on-drift + roll-up contracts that dashboard.sh:470-476 explicitly guards. Both fixtures are open rows, so they render regardless — the render half is never actually pinned. (Codex) CONFIRMED, defect (test-robustness). |
| R2 | 1     | low | claude/skills/fkit-status/SKILL.md:276 | Nonconformance grammar line shows `kind="…" cell="…"`; `brief-missing-owner` (dashboard.sh:675) emits no `cell=`. PARTIALLY CORRECT — pre-existing precedent: `brief-missing-id` (dashboard.sh:610) already carries `folder=` and no `cell=`, so the grammar line is illustrative, not a strict per-kind schema. Non-blocking, not newly introduced by 0106. (Codex) |

## Coder response
| # | Verdict | Defect / Frontier | Action | Status |
|---|---------|-------------------|--------|--------|
| R1 | CORRECT — verified: the test pinned only the `add_fact` record; both fixtures were open rows, so `mark_drift`'s force-render + roll-up-clause effects were never exercised. A `mark_drift` regression would have stayed green. | Defect (test-robustness) | **Fixed** — reworked the missing-owner fixture to a **✅ Done** row (normally omitted from the open-work board): the test now asserts the row is **force-rendered** (present despite being Done) AND that the roll-up carries `drift on tasks 2`, pinning both fused `mark_drift` effects. Mechanical + in-plan (test scope) → applied autonomously. Re-verified: task-0106 test green, full suite 451/0. | resolved |
| R2 | PARTIALLY CORRECT — verified: `brief-missing-owner` emits no `cell=`, but `brief-missing-id` already deviates (`folder=`), so the grammar line was illustrative, not newly broken by 0106. | Frontier/doc (pre-existing imprecision) | **Fixed (doc accuracy)** — changed the grammar line to `kind="…" [kind-specific field]` and added a note that the field is kind-specific (most `cell="…"`, `brief-missing-id` → `folder=`, `brief-missing-owner` → none). Mechanical, in the drift-kind docs 0106 already edits → applied autonomously. | resolved |

**Coder note (ship-loop autonomy):** both fixes are mechanical, in-plan/in-artifact, verified-CORRECT — the
shape the loop applies without an owner stop. R2 corrects a *pre-existing* illustrative doc line (not a 0106
regression); no scope/behavior change. The reviewer's **Accepted residual** (owner-cell renders raw, matching
existing board free-text behavior) is confirmed — it documents pre-existing, already-owner-ruled behavior, not a
new tradeoff, so no owner sign-off is needed for it. Re-verified after both fixes: **451 pass / 0 fail**.
## Accepted residuals (shared, do-not-re-litigate)
- Owner-cell pipe/grammar escaping — What: the owner cell renders `${b_owner:-—}` raw (no `\|` escape). Why (structural): the board ALREADY renders brief-sourced free text unescaped in the `next`/derive sentinel (dashboard.sh:781); `## Owner` is a controlled role-name vocabulary; 0106 introduces no new escaping regression, it matches existing board behavior. Re-raise only if: the board gains a general brief-cell escaping pass (then owner must join it), or owner values become free text.
