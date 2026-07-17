# Review — rename-task-plan-skill-to-task-brief

Task: ai-agents/tasks/backlog/rename-task-plan-skill-to-task-brief.md
File(s) under review: working tree — `git mv` fkit-task-plan→fkit-task-brief + 15 edited files (skills-for-role.sh, hook test, roster mirrors, producer agent, launcher comment, dashboard.sh, dashboard-contract.test.js, dual-home conventions, ship-loop namespace note)
Status: in-review

## Reviewer findings
| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | low  | ai-agents/knowledge-base/architecture.md:297 | Living-canon task-flow description (present tense, ADR-013 "living canon") still names the producer skill `/fkit-task-plan`. Not frozen history, not wiki-vault (task 51 is wiki-only) — it is exactly the "live, functional reference" class the brief said to update (same class as the conventions live-twins that WERE updated). Missed. Doc-only, non-blocking; a producer following it would try a now-nonexistent skill. |
| R2 | 1     | low  | ai-agents/tasks/backlog/investigate-dual-home-parity-live-vs-scaffold.md:58,94 | Active backlog brief (task 49) scopes future work against `/fkit-task-plan` (`:58` "Spec the change to /fkit-task-plan"; `:94` "may spawn a /fkit-task-plan skill edit"). Stale name for work that hasn't started. Borderline: a planning brief, arguably inside the brief's frozen/"ages out" boundary — surfaced for an owner scope call, not asserted as in-scope. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Confirmed: `architecture.md:297` living-canon task-flow named the removed `/fkit-task-plan` — a genuine missed live functional reference (my sweep scoped `claude/ test/`; the brief's file list omitted architecture.md, but its "every live, functional reference" rule covers it). **Owner disposition: fix under this task.** Changed `/fkit-task-plan` → `/fkit-task-brief` at `:297`, leaving the coder's `/fkit-plan-task` on `:298` intact. Re-verified: zero functional `fkit-task-plan` hits across `claude/ test/ architecture.md`; coder ref preserved. | Fixed |
| R2 | PARTIALLY CORRECT → actioned | Frontier (settled-scope) | Confirmed: live backlog brief task 49 named `/fkit-task-plan` at `:58` (skill to spec) and `:94` (spawned follow-up). A live brief, so "frozen history" doesn't cleanly apply, but forward-looking planning prose. **Owner disposition: fix now** (over the reviewer's accept-as-residual lean). Changed both refs → `/fkit-task-brief` so the active brief points at the real skill. | Fixed |

**Convergence:** Round 1 closed-out. Core rename verified correct; two low doc-reference defects (R1 real, R2 borderline) both fixed under this task per owner disposition. No accepted residuals recorded (both actioned). Last verify green (`node --test` 346/0 pre-fix unaffected by doc-only R1/R2 edits; grep clean post-fix). Not a loop — first and only pass. Coder side complete — ready for the owner's done-gate.

## Accepted residuals (shared, do-not-re-litigate)
- (none yet)
