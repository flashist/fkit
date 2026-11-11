---
name: fkit-sprint-ship-loop
description: Lead-owned sprint orchestration using native bounded child sessions and live owner relay.
---

Only fkit-lead runs this loop. Read the board and its task briefs; confirm sprint scope and the
owner's requested autonomy. Plan review defaults ON; relay a launch/request --no-plan-review
opt-out to every Plan worker without changing the owner approval or implementation-review gates. Never implement, diagnose or review yourself. Never commit/push.

For each open task, in dependency order:

1. Spawn fkit-coder for a PLAN ONLY: no source writes, run fkit-plan-task and return full plan,
   independent review, limits and open decisions. Architectural/product decisions go to their role.
2. Present plan and all review banners to the owner. Use question and wait for the actual answer.
   Child questions return NEEDS-DECISION { question, options, recommendation, context }; relay each
   live with no timeout or assumed answer. Preserve named owner rulings exactly.
3. After approval, launch a bounded Build worker with the coder's declared approval marker: driver
   identity (fkit-lead), task identity, FULL approved plan inline, and verbatim owner approval quote
   with date/channel, and the worker role explicitly named Build or Process-review. The approval must plainly cover the entire plan; no reference-only plan,
   summary or unrelated approval. Require the worklog decision log. Never give that marker to a
   plan-only worker. Source writes remain a prompt-trust boundary; do not claim runtime proof.
4. Have the coder implement and verify within scope, following project test restrictions. Capture
   actual checks/results/skips and unresolved decisions; answer decisions through owner relay.
5. Spawn fkit-reviewer for fkit-stateful-review on the same task/scope. It obtains the hostile native
   child pass. Preserve ledger, identities, coverage and partial flags. Review has its own context.
6. Spawn fkit-coder to process findings with fkit-process-stateful-review, carrying the same complete
   approved-plan marker. Only verified, mechanical/localized, in-plan fixes may proceed unattended;
   record each in worklog.md. Other choices require owner relay. Re-verify and re-review changed
   defects; stop repeated disagreements or regressions for owner disposition.
7. Only a non-partial review with no unresolved defects and complete required verification can go
   to fkit-producer for fkit-task-done. Any missing/unknown/same second model, missing check, red check,
   manual gate or unresolved residual means report it and withhold automatic closure. Producer uses
   (agent-closed — not owner-verified). Verify its actual result; never infer success from spawning.

Do not run concurrent writers against one task/ledger/board. Use fresh bounded child contexts for
roles; carry relevant evidence and rulings explicitly. Subagent depth is configured to support lead
→ coder → reviewer → hostile reviewer. No cycles; leaf agents do not delegate.

After task work, ask producer to assess the board and invoke fkit-sprint-done only if all gates are
met. Never move boards by hand. Report each task's result, review/coverage, verification gaps,
actual closure marker, unresolved decisions and unattended changes. End with What's next?
