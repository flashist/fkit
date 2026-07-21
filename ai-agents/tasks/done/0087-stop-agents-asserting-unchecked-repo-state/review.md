# Review — stop-agents-asserting-unchecked-repo-state

Task: ai-agents/tasks/backlog/stop-agents-asserting-unchecked-repo-state.md
File(s) under review: claude/skills/fkit-task-done/SKILL.md, claude/skills/fkit-task-cancelled/SKILL.md,
claude/skills/fkit-task-plan/SKILL.md, claude/skills/fkit-process-stateful-review/SKILL.md,
claude/skills/fkit-status/SKILL.md, claude/skills/fkit-review/SKILL.md,
ai-agents/knowledge-base/conventions/evidence-before-assertion.md (new),
claude/scaffold/ai-agents/knowledge-base/conventions/evidence-before-assertion.md (new),
ai-agents/knowledge-base/conventions/README.md, claude/scaffold/ai-agents/knowledge-base/conventions/README.md,
ai-agents/knowledge-base/conventions/status-report-format.md,
claude/scaffold/ai-agents/knowledge-base/conventions/status-report-format.md
Status: closed-out

## Reviewer findings

| # | Round | Sev | file:line | Claim |
|---|-------|-----|-----------|-------|
| R1 | 1 | low | claude/skills/fkit-task-done/SKILL.md:134-135, fkit-task-cancelled/SKILL.md:161-162, fkit-task-plan/SKILL.md:145-146, fkit-process-stateful-review/SKILL.md:208-209 | The replacement text asserts "the edits are in the working tree" (a positive commit-state claim) one clause before instructing "do not claim... anything is or isn't committed" — reads as a residual self-contradiction, even though "the edits [this run made]" is self-knowable and not the forbidden global claim. |
| R2 | 1 | low | claude/scaffold/ai-agents/knowledge-base/conventions/evidence-before-assertion.md:28-32 | The scaffold doc's "Where this is enforced" list omits `/fkit-process-stateful-review`, even though `claude/skills/fkit-process-stateful-review/SKILL.md:208` was edited in this same diff to link this exact convention — the live doc's parallel list (line 36) does include it, so the two forms are incomplete relative to each other. |
| R3 | 1 | low | ai-agents/knowledge-base/conventions/README.md:29, :50-51 | Pre-existing staleness, not introduced by this diff (confirmed via `git log`/`git show HEAD`, predates this session, commit `a8cb0e7`): line 29 says status-report-format.md is "seven beats, then the board" while that doc's own heading says "six beats, then the board" (item 7 is "the dashboard," not a beat); lines 50-51 say "adding a fifth document... Two well-known conventions beat six" when the table above now lists three, so the next addition would be the fourth, not the fifth. Surfaced incidentally while reviewing the table row this diff added to the same file. |

## Coder response

| # | Verdict | Defect / Frontier | Action | Status |
|---|---------|-------------------|--------|--------|
| R1 | PARTIALLY CORRECT | Frontier-move | Owner-approved a micro-tightening. Applied across the 4 skills: `are in the working tree` → `it leaves … in the working tree`, scoping the clause to the skill's own behavior (self-knowable) rather than a bare repo-state assertion. Files: `fkit-task-done` L134, `fkit-task-cancelled` L161, `fkit-task-plan` L145, `fkit-process-stateful-review` L208. | ✅ done |
| R2 | INCORRECT | — | **Disproven vs current code.** Scaffold `evidence-before-assertion.md` L28–29 already lists `/fkit-task-done, /fkit-task-cancelled, /fkit-task-plan, /fkit-process-stateful-review` — it does **not** omit `/fkit-process-stateful-review`. Claim false against the file as it stands. No change. | disproven |
| R3 | CORRECT | Defect — **pre-existing, out-of-scope, KB-owned** | Live `conventions/README.md` is stale vs the doc it describes **and** vs its own scaffold twin: L29 "seven beats" should be "six beats" (`status-report-format.md` L16 + scaffold README L32 both say six); L51 "Two well-known conventions beat six" is a stale hardcoded count (scaffold L52 already reads "A few… beat many"); "fifth document" should be "fourth" (3 conventions now — stale in **both** copies). Pre-dates this task (commit `a8cb0e7`); fix is a KB write the **architect** owns per ADR-013 + task notes. **Owner-approved routing to `@fkit-architect`**, which applied it: live README L29 `seven beats`→`six beats`, L50–51 `fifth document / Two…beat six`→`fourth document / A few…beat many`; scaffold README `a fourth or fifth document`→`a fourth document`. Both READMEs now agree on the row + item 4. | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)
*(none yet)*
