# Decide whether fkit needs a dedicated e2e-tester agent

**Source**: `ai-agents/tasks/done/0024-decide-whether-fkit-needs-a-tester-agent/brief.md`
**Status**: done — ⚠️ **`(agent-closed — not owner-verified)`**
**Sprint/Tag**: Backlog board · ID **0024** · priority Unscheduled · **owner: the OWNER**

## Goal
**A decision task whose deliverable is a ruling — not code, and not a tester agent.** The brief opens by saying so: *"If you are reading this as 'go build the tester,' stop."*

It carried three warnings forward rather than restating the analysis:
- **⚠️ No decision has been made.** The architect and producer both recommended **against** an eighth role. *"That is a recommendation. The owner has not ruled. A future session that treats 'no 8th role' as settled has misread both this brief and the source document."*
- **⚠️ It conflicts with a locked constraint — say so out loud.** `PROJECT.md`'s *"not breadth"*. **Whichever way it landed, the artifact had to name the constraint and say what happened to it.**
- **⚠️ The flip condition must survive** into whatever artifact the task produced — the **sandbox-authority divergence**, *"not a footnote… it is the re-raise clause."*

**The task was explicitly pickable cold** — the investigation *was* the 2026-07-13 evaluation report. What it needed was *"30 minutes of the owner's attention, which is precisely what was not available on 2026-07-13."*

## Key Changes
No code — by its own verification step, *"if a diff exists, this task was executed wrongly."*

All seven open questions were put to the owner and answered. **Q1 (seat vs capability) and Q6 (the breadth constraint) were the two named gates**, and both were answered on the record rather than inferred from the recommendation.

## Outcome
**Ruled 2026-07-19 → [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]]. The owner ruled against the recommendation, knowingly.** fkit gains an eighth **tester** seat on **sandbox authority**, and the *"seven roles, not breadth"* constraint is **explicitly reversed** rather than drifted past — exactly the disposition the brief demanded.

The brief's structure held up: the flip condition it insisted must survive is **the thing that carried the decision**, so the ruling reads as the architect's own criterion firing rather than an override of it.

⚠️ **Two open items this task's closure does not settle:**
- **It is agent-closed and not owner-verified** — for a task whose Notes say *"the ruling is the owner's and no agent's"*, the **ruling** was the owner's; only the **file move** was an agent's.
- **The follow-on briefs it deferred are now partly filed**: tasks 83 (`PROJECT.md:8,72`) and 84 (the wiki resync) exist. **B1, the bare-subagent investigation, is still not filed** — and ADR-028 follow-up 4 recommends running it **before** building the seat.

## Related
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the ruling this task produced
- [[tasks/verify-onboarding-flow-end-to-end]] — task 7, the release gate whose ad-hoc split surfaced the hole
- [[tasks/add-e2e-smoke-script-for-fkit-itself]] — the CI gap the brief insists is **explicitly independent** and must not be bundled or held hostage
- [[systems/testing-and-verification]] — where the static-review gap and the tester's own limits are recorded
- [[systems/fkit]] · [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — its home board
- Source: `ai-agents/knowledge-base/reports/2026-07-13-tester-agent-evaluation.md` — the evaluation the brief deliberately does not restate
