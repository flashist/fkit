## Workflow — native planning and approval

1. Declare planning-only. Read the brief, wiki, linked files, constraints and prior decisions.
   Write nothing, including plan artifacts, before owner approval. Use a real read-only/plan mode
   if the runtime provides one; otherwise state that the boundary is advisory.
2. Draft a concrete plan meeting the Planning Requirements below. Review is **on by default** in
   sessions and delegated planning. Only the owner's `--no-plan-review` switches it off for the
   current scope. No Claude launcher line or Claude tool is required to enable native plan review.
3. Classify the change: product change or unclear → producer and architect; code-only → architect.
   Ask the assigned native colleagues for APPROVE or CHANGES REQUESTED, the full plan and brief,
   focused reasons, hop count and call chain. A malformed reply is CHANGES REQUESTED.
4. Revise and re-ask every assigned approver, at most two revision rounds. An unresolved dispute
   then goes to the owner, with both sides and the draft. A delegated worker returns NEEDS-DECISION.
   Apply a real owner ruling without another approver loop; never invent consent.
5. Request the native adversarial reviewer last, in a fresh context on a verified different model
   family. Send the complete plan and brief, not only a summary. Preserve its findings verbatim;
   separately mark each confirmed or disputed with evidence. Do not revise after this pass before
   showing the owner. An unavailable colleague or unverified diversity makes plan review incomplete.
6. Present, in order: any incomplete banner, `Plan review: ON (default)` or the owner's opt-out,
   the plan, approver decisions, changes and reasons, adversarial findings with checks, and this record:

   ```
   ===PLAN-REVIEW RECORD BEGIN===
   Runtime: native Berd | native Buzz
   Times (UTC): drafted · asks and returns · adversarial start/end · presented
   Classification: product change | code-only | unclear — reason
   Round N: approver — APPROVE | CHANGES REQUESTED — reasons
   Changes, round N: what — why — request answered
   Disagreement: none | owner ruling quoted, date, channel
   Second model: actual provider/model, mode, findings verbatim
   Coder check: finding — confirmed | disputed — evidence
   Plan boundary: runtime wall verified | advisory
   Problems: none | unavailable role, missing diversity, malformed reply
   ===PLAN-REVIEW RECORD END===
   ```

7. Stop and wait for the owner's approval of the exact plan. Approver decisions never authorize
   a build. A worker returns the plan to its driver and waits for a new authorized Build request.
   After approval, persist plan.md and, when review ran, plan-review.md in the task folder, with
   the exact record and real owner decision/date/channel. No task folder → say not persisted.
   An owner-requested revision is labeled `revised after owner feedback — not re-reviewed` unless
   the owner asks for a new review. Never claim an ExitPlanMode exchange occurred when it did not.

