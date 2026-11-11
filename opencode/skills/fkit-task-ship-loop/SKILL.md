---
name: fkit-task-ship-loop
description: Coder-owned approved task implementation, native review/fix cycle and producer close handoff.
---

Only fkit-coder runs this loop. Invocation permits bounded work after the plan gate; never commits.

1. Read the brief and relevant wiki/source. Resolve the task folder and acceptance criteria.
2. Run fkit-plan-task. Present the full plan and independent plan-review findings. Wait for actual
   owner approval via question (or NEEDS-DECISION returned to the parent). No source before approval.
3. Persist approved plan as <task-folder>/plan.md, record approval and decisions in worklog.md, mark
   In progress within the existing brief, and implement only the approved scope.
4. Verify against acceptance criteria. Follow project restrictions on tests. Record commands/results,
   skipped checks and manual gates honestly. Never call skipped verification passing.
5. Delegate fkit-stateful-review to fkit-reviewer, naming exact scope and task folder. The reviewer
   obtains its hostile pass using a native fkit-adversarial-reviewer child. Preserve the full report,
   ledger, coverage state, model identities and degradation banners.
6. Apply fkit-process-stateful-review: verify each note. Fix verified CORRECT, mechanical/localized,
   in-plan defects; record each decision and why it qualified in the worklog decision log (or none).
   Frontier moves, broad behavior changes, regressions, oscillation, disputed scope and anything
   outside the plan return to the owner via question/NEEDS-DECISION before changes.
7. Re-verify changed behavior and request another bounded review if defects changed. Do not loop on
   accepted residuals. Stop and surface an unresolved or repeated disagreement with concrete options.
8. Only with no unresolved defects, no partial review, and required verification complete: ask
   fkit-producer to invoke fkit-task-done for the task. Carry the final review and verification
   evidence. Only producer invokes movers; it uses (agent-closed — not owner-verified). If a review
   is partial, a required check is skipped/red, a manual gate remains or a residual is unresolved,
   report work ready for owner action and DO NOT route closure.
9. Report implementation, review/coverage, checks/skips, remaining decisions and whether producer
   actually closed the task. Never infer closure from a request. End with What's next?

OpenCode permissions gate skill ownership. Plan approval and shell write discipline remain prompt
rules, not a plan-mode sandbox. Workers cannot ask the owner directly; return decisions to the parent.
