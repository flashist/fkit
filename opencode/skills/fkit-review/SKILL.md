---
name: fkit-review
description: Independent native two-pass review, verified findings and explicit model/coverage evidence.
---

Only fkit-reviewer executes this procedure. Never edit source. Default scope is the working tree;
otherwise use the caller's base/scope. For plans, attack the proposed behavior and implementation.

1. Read the diff/plan and surrounding context; independently produce grounded findings.
2. Launch fkit-adversarial-reviewer through the native subagent tool with the SAME scope, base ref,
   focus and relevant project constraints. Pass the complete diff or plan inline, plus changed-file
   paths: the hostile child cannot use shell to obtain git diff. For a large diff use a readable
   per-run diff artifact and pass its exact path. Do not pass only a branch name or task label. Require severity, file:line, evidence and a usable verdict.
   Never substitute another self-pass or a CLI call. Record the child's actual model identity when
   available. Capture the returned child sessionID. Run
   `node .opencode/skills/fkit-review/model-evidence.mjs <child-sessionID>` to inspect its and
   its parent's assistant-message model records. Only `distinct-runtime-models` supports diversity;
   same-model, unverified, errors or denied inspection require a partial review. Cite the returned
   session/message IDs and model IDs, never raw message contents. A provider alias alone does not
   establish a different upstream model. Use a fresh child per pass so identity belongs to this scope.
   No usable verdict: retry at most twice, then report a partial review.
3. Merge duplicate findings. Read the code to verify every claim; assign CORRECT, PARTIALLY CORRECT,
   INCORRECT (disproven), or INCOMPLETE and your own traced severity. Classify Defect vs Frontier-move.
   Treat review notes as fallible. A missing test on correct code is a suggestion unless written
   project rules require it. Never inflate severity or fabricate findings. Suppress settled residuals
   visibly with the ledger/ADR pointer; re-raise only with materially new evidence.
4. Report in this order:

   # Review — <scope>

   **Decision: <verdict>**

   Coverage: <state> — <actual evidence; skipped checks and why>

   <any degradation banner, before findings>

   Reviewers: <actual primary and child identities; unknown identities explicitly unverified>

   | # | Reviewer | Reviewer severity | Verified verdict | Defect/frontier | Finding |
   |---|---|---|---|---|---|

   Then suggestions (if any), suppressed-as-settled items, verification limits, and What's next?

Choose exactly one verdict: ✅ Ready to merge (append validation-gated if manual verification remains),
⚠️ Changes requested — N defects (none blocking), 🛑 Blocked — N confirmed defects (M high/critical),
or 🟡 Partial review — <reason>.

State exactly one coverage state: **reasoning-only second opinion** (usable child but either reviewer
has no behavioral measurement), **both reviewers measured** (actual behavior-bearing command and
result evidence from both), or **second opinion unavailable** (no usable child verdict).
The native hostile child cannot run shell commands, so normal coverage is reasoning-only.
Reads, greps, type/syntax checks and denied commands are not behavioral measurements.
Follow the consuming project's test-execution policy. Never execute tests merely to improve coverage.

If the child is unavailable, emit [NOT model-diverse — INCOMPLETE] before findings and force
🟡 Partial review — second opinion unavailable. If child/primary model identities are unknown,
inherited, or the same, emit the same banner and force 🟡 Partial review — model diversity unverified.
A configured model or fresh context alone does not prove model diversity; require actual runtime
identity evidence. A partial review never authorizes automatic task closure. Reasoning-only coverage
alone is normal and does not force a partial verdict when distinct models are evidenced.

For stateful review, also follow fkit-stateful-review's ledger format and convergence rules. A review
verdict is a recommendation, not permission to commit, merge, change scope or accept a residual.
