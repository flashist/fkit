---
name: fkit-plan-task
description: Coder planning with native owner approval and an independent hostile plan review.
---

Only fkit-coder executes this procedure. Read the task brief, relevant wiki pages and source.
Resolve scope, dependencies, constraints and acceptance criteria before proposing implementation.
Write the plan in the task's worklog (or return an inline plan for an inline request): intended
behavior, files to change, ordered implementation steps, verification, risks and open questions.
Do not write source while planning.

Plan review is ON by default. If the shared launch rules say Plan review: OFF, or this request
explicitly carries --no-plan-review, record the opt-out and skip the independent plan-review step
only. Never skip the owner approval gate or implementation review. Otherwise ask fkit-reviewer for a plan review. It delegates the hostile pass to
fkit-adversarial-reviewer through OpenCode's native subagent tool. Evaluate every finding against
actual evidence; revise the plan or explain why a finding is wrong. Preserve any partial-review flag.

Present the complete plan, findings, accepted/rejected changes and verification limits to the owner.
In a primary session use question and WAIT for explicit approval. In a child return NEEDS-DECISION
with the plan and choices; the parent asks and relays the actual answer. No tool timeout, silence,
review verdict or earlier unrelated approval authorizes implementation. Record the actual approval
quote, date and channel in the worklog. On a delegated implementation use the existing declared
approval marker required by the coder prompt. If scope materially changes, seek approval again.

OpenCode has no Claude EnterPlanMode/ExitPlanMode. This procedure's write boundary is a prompt
rule; native edit permissions do not change when the owner approves. Do not claim a structural
plan-mode sandbox. Follow the consuming project's test-execution policy.

What's next? After approval, implement the approved plan through fkit-coder.
