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
Status: in-review

## Reviewer findings

| # | Round | Sev | file:line | Claim |
|---|-------|-----|-----------|-------|
| R1 | 1 | low | claude/skills/fkit-task-done/SKILL.md:134-135, fkit-task-cancelled/SKILL.md:161-162, fkit-task-plan/SKILL.md:145-146, fkit-process-stateful-review/SKILL.md:208-209 | The replacement text asserts "the edits are in the working tree" (a positive commit-state claim) one clause before instructing "do not claim... anything is or isn't committed" — reads as a residual self-contradiction, even though "the edits [this run made]" is self-knowable and not the forbidden global claim. |
| R2 | 1 | low | claude/scaffold/ai-agents/knowledge-base/conventions/evidence-before-assertion.md:28-32 | The scaffold doc's "Where this is enforced" list omits `/fkit-process-stateful-review`, even though `claude/skills/fkit-process-stateful-review/SKILL.md:208` was edited in this same diff to link this exact convention — the live doc's parallel list (line 36) does include it, so the two forms are incomplete relative to each other. |
| R3 | 1 | low | ai-agents/knowledge-base/conventions/README.md:29, :50-51 | Pre-existing staleness, not introduced by this diff (confirmed via `git log`/`git show HEAD`, predates this session, commit `a8cb0e7`): line 29 says status-report-format.md is "seven beats, then the board" while that doc's own heading says "six beats, then the board" (item 7 is "the dashboard," not a beat); lines 50-51 say "adding a fifth document... Two well-known conventions beat six" when the table above now lists three, so the next addition would be the fourth, not the fifth. Surfaced incidentally while reviewing the table row this diff added to the same file. |

## Coder response
*(coder-owned — not written here)*

## Accepted residuals (shared, do-not-re-litigate)
*(none yet)*
