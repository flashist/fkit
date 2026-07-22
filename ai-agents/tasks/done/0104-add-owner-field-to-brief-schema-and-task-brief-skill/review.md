# Review — 0104-add-owner-field-to-brief-schema-and-task-brief-skill

Task: ai-agents/tasks/done/0104-add-owner-field-to-brief-schema-and-task-brief-skill/brief.md
File(s) under review:
- claude/skills/fkit-task-brief/SKILL.md
- ai-agents/knowledge-base/conventions/task-owner-vocabulary.md (new)
- claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md (new)
- ai-agents/knowledge-base/conventions/README.md + scaffold copy
Status: closed-out

## Reviewer findings
| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1     | low | claude/skills/fkit-task-brief/SKILL.md:86 | Step 4 still says "diff against an existing brief in `ai-agents/tasks/backlog/` to confirm" the skeleton, but no existing brief carries `## Owner` yet (backfill is task 0105). The verification method the skill prescribes now mismatches its own new skeleton for one mandatory field until 0105 lands. Raised by Codex; confirmed. Cheap in-scope mitigation: note that the inline skeleton block is authoritative and existing briefs predate the field (see 0105). Non-blocking — the skeleton block plus two reinforcing bullets (SKILL.md:107, :328) already name `## Owner` three times, so omission risk is low. |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT — verified: line 86 "diff against an existing brief to confirm" now mismatches the new `## Owner` skeleton line, since existing briefs lack the field until 0105. Introduced by this task's edit. | Defect (omission in the edit) | Fixed — added an authoritative-skeleton note after the skeleton block (`SKILL.md:103-107`): existing briefs predate `## Owner` (backfill 0105); a diff will show it as the one missing field; add it, don't drop it. Mechanical, in-plan, applied autonomously per ship-loop (mechanical + in-plan CORRECT-defect). | resolved |

**Coder note (ship-loop autonomy):** R1's fix was applied without an owner stop — it is a mechanical,
in-plan (`SKILL.md` step 4 is in the approved plan) CORRECT-defect fix, exactly the shape the loop
applies autonomously. Re-verified after the change (V1 skeleton ordering + V5 dashboard) — both green.
The **enum residual** below is settled by the owner's plan-gate ruling ("ENUM of the seven live roles"),
not a new frontier call — left as recorded; narrowing to doer-roles would be a new scope decision (owner's, via a follow-up).

## Accepted residuals (shared, do-not-re-litigate)
- Seven-role enum includes non-doer roles — What: the `## Owner` enum lists all seven live roles incl. `fkit-lead` ("does not itself do the work") and `fkit-adversarial-reviewer` (spawn-only, never sessioned), which are unlikely task owners in practice. Why (structural): owner ruled at the 0104 plan gate that the value is an ENUM of the seven live roles; the doc endorses all seven deliberately, matching the seven agent files in `claude/agents/`. Re-raise only if: a future decision narrows "owner" to doer-roles, or an owner value is rejected in practice.
