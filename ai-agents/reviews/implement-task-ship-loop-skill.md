# Review — implement-task-ship-loop-skill

Task: ai-agents/tasks/backlog/implement-task-ship-loop-skill.md
File(s) under review: claude/skills/fkit-task-ship-loop/SKILL.md (new) · claude/skills-for-role.sh · test/skill-ownership-hook.test.js · claude/agents/fkit-coder.md · claude/skills/fkit-team/SKILL.md · claude/README.md · claude/scaffold/CLAUDE.md
Status: closed-out

Reviewers this round: fkit-reviewer (own pass) + Codex adversarial pass (codex-cli 0.144.4, ran — full model-diverse coverage). Verified against: design spec rev 3 §11, ADR-019, ADR-020.

## Reviewer findings
| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | claude/skills/fkit-task-ship-loop/SKILL.md:97-100 | Step 2 says "produce the plan in plan mode → write it to `ai-agents/plans/<task-id>.md`" *before* the step-3 approval gate. But plan mode's write wall refuses `Write`/`Edit` for the duration (`fkit-plan-task/SKILL.md:29-32, 47-49`), and both ADR-020 and this file's own durable-state table (SKILL.md:72) say the plan is written **"at plan approval."** As literally ordered the write is unexecutable (blocked by the wall) / internally inconsistent, and a plan file persisted pre-approval makes resume-time gate evidence ambiguous (§4.1 fail-safe keys off "was a gate passed"). Defect (fidelity/executability). Note: the write-then-approve ordering is inherited verbatim from the owner-approved §11 step 2 — so it is a tension in the approved spec faithfully carried over, not a coder-introduced deviation. |
| R2 | 1     | low    | claude/skills/fkit-task-ship-loop/SKILL.md:100 | Step 3 on plan rejection: "the worklog notes the rejection" — but the worklog is defined as **opened post-approval** (SKILL.md:73, step 4 line 103; ADR-020). On a step-3 rejection no worklog exists yet, so the failure table's "worklog notes it" (SKILL.md:187) either requires a pre-approval worklog (contra the stated lifecycle) or the rejection note has nowhere to land. Internal inconsistency; also present in the spec's §8 table vs §4. Defect (consistency). |
| R3 | 1     | low    | claude/skills/fkit-task-ship-loop/SKILL.md:12-15 | The non-coder handoff banner says `@fkit-coder Ship this task: <brief-path>`, but the skill is **session-only and refuses a spawned/headless invocation** (SKILL.md:61, hard rule 205), returning only a plan. So the advertised consult cannot actually ship the task. Correct routing is "open a `fkit coder` session and run it there," not a spawned consult. Defect (misleading handoff). |
| R4 | 1     | low    | claude/skills/fkit-task-ship-loop/SKILL.md:118 | Cross-ref `fkit-coder.md:90-94` (cited for "new architecture/scope decision → owner") is stale: current lines 90-94 are grounding steps ("Ground yourself in wiki knowledge" / "Locate the work"). The actual escalation rule is at fkit-coder.md:109-113 (hard rule 149-150). The coder's own +16-line additions above that point (the scoped Mode exception 38-49 + procedures entry 59-62) shifted the target without updating the citation. `:28-33` refs remain accurate. Also present in ADR-019:70 and the spec, but those are out of this task's edit scope. Raised by both reviewers. Defect (stale cross-ref). |
| R5 | 1     | low    | claude/agents/fkit-coder.md:61 | Procedures entry says "(see the Mode note **below**)" but the scoped Mode amendment is **above** at lines 38-49 (procedures follow the Mode section). Wrong directional pointer. Defect (doc nit). |

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Moved the `plans/<id>.md` write out of step 2 (plan mode's write wall forbids it) to step 4 **on approval**, matching ADR-020's "at plan approval" and the file's own durable-state table. Now the plan file's existence *evidences* approval, strengthening the §4.1 resume fail-safe rather than muddying it. **Recorded as a forced, justified deviation from the literal §11 step-2 ordering** (see coder report). | ✅ done |
| R2 | CORRECT | Defect | Step 3 rejection now "report the rejection to the owner (no worklog is opened before approval)"; failure table row changed from "worklog notes it" to "report the rejection (no pre-approval worklog)". Removes the reference to a worklog that does not exist pre-approval. | ✅ done |
| R3 | CORRECT | Defect | Replaced the non-coder handoff banner's `@fkit-coder Ship this task` consult (impossible — session-only, refuses spawns) with the correct route: open a `fkit coder` session and run `/fkit-task-ship-loop <brief-path>` there. | ✅ done |
| R4 | CORRECT | Defect | Updated stale cross-ref `fkit-coder.md:90-94` → `:109-113` (verified: the "new architecture decision → owner" rule is now at 109-113; 90-94 are grounding steps after this task's +16-line additions). The `:28-33` refs remain accurate and were left. | ✅ done |
| R5 | CORRECT | Defect | `fkit-coder.md:61` "(see the Mode note **below**)" → "**above**" (the Mode section precedes Your procedures). | ✅ done |

All five verified CORRECT against the code, all documentation/consistency defects, all fixed. No behavioral change to the loop; no gate softened. `node --test`: 345/345 green after the fixes. `.claude/` copies refreshed. Not committed — edits left in the working tree.

## Accepted residuals (shared, do-not-re-litigate)
- (none — all findings were defects fixed this round, none recorded as an intended tradeoff)
