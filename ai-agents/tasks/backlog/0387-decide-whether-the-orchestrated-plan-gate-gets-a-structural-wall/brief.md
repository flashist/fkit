# Decide whether the orchestrated plan gate gets a structural wall — and which mechanism, if any

## ID
0387

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Owner ruling 2026-09-12**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, **option label verbatim: "File as a backlog row (Rec)"**. The question put
to the owner was whether spawned coder sessions can do a proper plan→implement sequence; two possible
mechanisms had been described and no call was ever made on building either.

> ⛔ **The ruling is: file it, decide nothing.** This brief **frames** the problem and **frames the
> candidate mechanisms**. It deliberately does **NOT** choose between them. Choosing is the
> implementer's plan gate with the owner. **A plan that arrives having already picked has skipped that
> gate** — and picking is the entire deliverable of this task.

### The problem

On the `/fkit-sprint-ship-loop` orchestrated path, *"no code before the owner approves the plan"* is
**prose-enforced in the worker prompt, not a runtime write-wall.**

This is not a discovered defect — it is stated openly in the loop's own text and was **accepted by the
owner on 2026-07-22** (ADR-031 honesty clause / ADR-032 Decision 7). The statement lives at
`claude/skills/fkit-sprint-ship-loop/SKILL.md`, under the heading
**`## ⚠️ The plan-gate honesty clause — read before the loop, do not "fix" it away`** (`:56` on
2026-09-12; the heading text is the durable anchor, the line number is the aid —
[`conventions/durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
Its load-bearing sentence, verified verbatim this session:

> *"The 'write nothing yet' in step 1 is a **prompt instruction, not a wall** — a confused or injected
> worker could write before approval and nothing structural stops it."*

**So the exposure is real and named:** a confused or prompt-injected Build-before-Plan worker can write
source before the owner has approved anything, and nothing structural stops it.

⚠️ **This task must not "fix away" the honesty clause.** The clause's own instruction is that a later
reader *"must not rewrite this into a false structural guarantee."* Whatever this task decides, the
clause is either **discharged by a real wall** (and rewritten to describe that wall accurately) or
**left standing**. It is never edited to sound safer than the runtime is.

### Why plan mode cannot simply be used — two measured facts

1. **`ExitPlanMode` is excluded from the `Plan` and `Explore` agent types' tool sets.** Measured from
   the live agent-type roster this session: both are declared *"All tools except Agent, Artifact, …,
   **ExitPlanMode**, Edit, Write, NotebookEdit"*.
2. **`AskUserQuestion` is absent in every spawned subagent** — measured `TOOL_ABSENT` 3/3 against three
   `general-purpose` subagents with `tools: *`, recorded in
   [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md).

Together: a spawned worker can neither **exit** plan mode nor **reach the owner** to obtain the
approval that would justify exiting. **The gate cannot be satisfied inside a spawn.** That is why the
loop splits Plan and Build across two spawns with the driver holding the owner channel in between —
and why the split is prose, not a wall.

### ⭐ A measured extension of the framing this task arrived with — flagged, not silently applied

The hand-over framed mechanism A as *"a NEW write-less agent type"*. ⛔ **Measured this session, a
write-less spawnable type already exists:** the built-in **`Plan`** agent type is declared with
Edit/Write/NotebookEdit **already absent**. So the "no writes" half of mechanism A is available today
with no new role at all.

⚠️ **But it does not solve the problem, and the reason is the deciding constraint on mechanism A:**
the built-in `Plan` type is **not an fkit role**, so it does not appear in `skills_for_role()` and the
ADR-018 `PreToolUse` skill-ownership hook (`claude/skill-ownership-hook.sh`) would **deny its
`/fkit-plan-task` call**. `/fkit-plan-task` is **coder-owned** — verified in
`claude/skills-for-role.sh`, whose `coder)` line reads
`fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-plan-task fkit-process-review fkit-process-stateful-review fkit-task-ship-loop`.
**This is evidence for the implementer to weigh, not a decision.** It may argue for mechanism A (the
gap is exactly one role registration) or against it (a whole role to reach a built-in capability).

### Candidate mechanism A — a write-less typed planner role

A new fkit role whose agent frontmatter omits `Write` / `Edit`.

**The pattern already ships in this repo and is proven.** `claude/agents/fkit-adversarial-reviewer.md`
is exactly this shape — its frontmatter line reads `tools: Read, Grep, Glob, Bash, Skill`, and
[ADR-022](../../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)
relaxed the tool allowlist for **every** role *except* it. Verified 2026-09-12.

**What it buys:** a genuine **structural** wall on the Plan step — the worker cannot write source
because the tool is not there, at any spawn depth.

**Costs the implementer must cost out, not assume:**

- **A new role.** The team is **seven** today.
  [ADR-028](../../../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md)
  already authorises an **eighth** (a sandboxed e2e tester) that is **not yet built**. This would be a
  **ninth**. ⛔ **That interaction must be reasoned about explicitly, not waved past** — including
  whether an unbuilt authorised role should be built before a newly proposed one.
- **An ADR.** A new role is a role-boundary decision; it does not land on prose alone.
- **`skills_for_role()` in `claude/skills-for-role.sh`** — plus, per that file's own warning, **SIX
  hand-maintained mirrors that MUST move in the same commit**: `claude/skills/fkit-team/SKILL.md`,
  `claude/README.md`, `claude/scaffold/CLAUDE.md`,
  `ai-agents/knowledge-base/architecture.md`, `test/skill-ownership-hook.test.js` (owned, asserted
  against), and `claude/fkit-claude-init.sh`. That file records the mirror list being **incomplete
  twice** and shipping a false statement into every consuming project both times.
- **The ship-loop's Plan row rewired** — the row currently reads `@fkit-coder`.
- **`ai-agents/knowledge-base/conventions/task-owner-vocabulary.md`** would need the new role if the
  role can own tasks; today it lists exactly seven and explicitly bars assigning to an unbuilt role.

### Candidate mechanism B — a `PreToolUse` gate hook

**The pattern already ships here too:** `claude/carry-check-hook.mjs` (+ its `.sh` entry) and the
ADR-018 skill-ownership hook, both registered as `PreToolUse` entries by `claude/fkit-claude.sh`.

⛔ **State this limit plainly — it is the deciding fact about B:** a hook can verify **"a plan artifact
exists"**; it **cannot** verify **"the owner approved it"**. Approval leaves **no artifact** (ADR-021 —
`AskUserQuestion` is session-only, and its result is not persisted). **So mechanism B is a partial fix,
by construction, not by implementation quality.**

⚠️ **B has the same shape as an already-accepted residual, and that precedent should be read before
deciding.** The **`carried-not-approved`** class: *a hash pins which bytes were **carried**, not which
were **approved***. It is recorded as an accepted structural residual in `0162`'s review ledger
([`0162`'s `review.md`](../../done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/review.md),
§ *Accepted residuals*) and restated in the ship-loop skill itself (`:144`:
*"⛔ **What it does NOT close:** the **`carried-not-approved` class.**"*). **The precedent cuts both
ways** — the project has knowingly accepted a partial artifact-based control before, which is either a
reason to accept another or a reason not to add a second one.

### Candidate option C — accept the prose gate, improve the documented escape hatch

Named here so the implementer's plan gate is honest: **do nothing structural.** Keep the prose gate and
the honesty clause exactly as they are, and improve only the **documentation of the escape hatch** the
clause already names — `fkit coder` + `/fkit-task-ship-loop`, which **does** have plan mode's
structural wall because it runs in a session with the owner present. The clause already says owners who
want the wall *"ship it the old way"*; C is the option of making that route easier to find and to
choose, and nothing more.

⛔ **C is a real option, not a strawman.** A decision task whose options are two builds and no
do-nothing has pre-decided that something gets built.

### ⚠️ Conflict / overlap surfaced — flag, do NOT plan around it

**`0345` edits the same Plan row this task may rewire.** Open on this board:
[`0345-carry-adr-044s-build-and-plan-role-rule-into-the-ship-loop-and-agent-text`](../0345-carry-adr-044s-build-and-plan-role-rule-into-the-ship-loop-and-agent-text/brief.md).
It carries **ADR-044 Decision 2** into the ship-loop text — verbatim: *"The Plan row's role is the
Build role, **by hand where that role does not own `/fkit-plan-task`**."* ADR-044 itself flags that
clause as *"an owner-ruled scoped exception to
[ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)
§Decision, not an application of it."*

**Why this matters here, in both directions:**

- **Mechanism A collides head-on with it.** A dedicated planner role owning `/fkit-plan-task` changes
  what *"where that role does not own `/fkit-plan-task`"* even means, and re-opens the ADR-038 vs
  ADR-044 boundary that was settled by owner ruling on 2026-08-27.
- **ADR-044's "by hand" clause is itself evidence** that the project already tolerates a Plan step run
  by a role without the plan skill — which the implementer should weigh when costing A.

⛔ **This is recorded as a conflict, not a dependency edge** (see `## Notes`). Neither task blocks the
other; but whichever lands second must not silently overwrite the first's edit to that row.

## What to build

**A decision, recorded as an ADR** — not an implementation.

This is scoped **investigation-and-decision-first** deliberately: the shape of the work is unknown
until the mechanism is chosen, so no implementation brief can honestly be written yet. **The
implementation task(s) are filed by the producer *after* this ADR is accepted**, in the same pattern
ADR-044 §C2 used for `0345`.

1. **Verify the framing against the live repo before reasoning from it.** Every claim in `## Context`
   was measured on 2026-09-12 and is cited to its anchor; re-measure rather than trusting the dates.
   ⛔ Where measurement contradicts this brief, **say so loudly in the ADR** — do not silently correct.
2. **Take the reading list** (below) and cost each of the three options: **A** (typed write-less
   planner role), **B** (`PreToolUse` gate hook), **C** (accept the prose gate, document the escape
   hatch better). ⛔ **All three get a genuine costing.** An ADR that dismisses C in a sentence has not
   done the work.
3. **Put the choice to the owner at the plan gate.** ⛔ **This is the step this brief exists to
   protect.** The producer did not choose, and the implementer must not choose alone either — the
   options and their costs go to the owner, and the owner picks.
4. **Record the outcome with `/fkit-record-decision`** as a new ADR in
   `ai-agents/knowledge-base/decisions/`, including the options **rejected** and why.
5. **State explicitly what the chosen option does NOT close.** If B is chosen, the ADR must say in its
   own words that *"the owner approved it"* remains unverifiable and name the residual. If C is chosen,
   the ADR must say the prose gate stands and the honesty clause is unchanged. If A is chosen, it must
   say whether the ninth-role question was settled or merely deferred.
6. **Say what happens to the honesty clause**, in the ADR, in one of exactly two forms: *discharged and
   rewritten to describe the new wall accurately*, or *left standing, unedited*. ⛔ Never softened.

### Reading list — named by the ruling that authorised this task

| Source | Why |
|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `## ⚠️ The plan-gate honesty clause` | the problem statement, in the project's own words |
| [ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) | the honesty clause's authority |
| [ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) Decision 7 | the owner's acceptance, 2026-07-22 |
| [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) | why a spawn cannot reach the owner; why approval leaves no artifact |
| [ADR-022](../../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md) | the proven write-less-role precedent mechanism A would copy |
| [ADR-018](../../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) + `claude/skill-ownership-hook.sh` | how a `PreToolUse` gate actually behaves here |
| [ADR-028](../../../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md) | the authorised-but-unbuilt eighth role A must reason about |
| [ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md) + [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md) | the Plan-row role boundary A would re-open |
| `0162`'s `review.md`, § *Accepted residuals* | the `carried-not-approved` precedent B repeats |

### ⛔ Out of scope

- ⛔ **No implementation of any mechanism.** This task ends at an accepted ADR.
- ⛔ **No edit to the honesty clause** in this task — deciding its fate is in scope, editing it is the
  follow-on's.
- ⛔ **No edit to the ship-loop's Plan row** — that text is `0345`'s and the follow-on's.
- ⛔ **No new role registered, no `skills_for_role()` edit, no mirror touched.**
- ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005).
- ⛔ **No re-rank of any board** (ADR-035).
- ⛔ **No new devDependency** (ADR-014).

## Verification steps

1. **A new ADR exists** under `ai-agents/knowledge-base/decisions/` with `Status: accepted` and a date,
   naming the plan-gate wall question in its title.
2. **All three options appear in it by name** — the typed write-less planner role, the `PreToolUse`
   gate hook, and accept-the-prose-gate — each with a stated cost and, for the two rejected, a stated
   reason for rejection. ⛔ An ADR carrying fewer than three costed options is a **failed** run.
3. **The owner's choice is recorded with its channel and date**, in the ADR, in the form the project's
   other ADRs use (owner ruling, date, verbatim option label).
4. **The B-limit is written down explicitly**, in the ADR's own words: a hook can verify a plan
   artifact exists and **cannot** verify the owner approved it, because approval leaves no artifact
   (ADR-021). Present whether or not B is the chosen option — it is why the option ranks where it does.
5. **The `carried-not-approved` precedent is cited**, by name, as the prior accepted residual of the
   same shape.
6. **The ninth-role question is answered if A is chosen** — the ADR states how a ninth role sits with
   ADR-028's authorised-but-unbuilt eighth. ⛔ Silence here is a failed verification, not an omission.
7. **The honesty clause's fate is stated** in one of the two permitted forms (step 6 of *What to
   build*), and — grep `claude/skills/fkit-sprint-ship-loop/SKILL.md` — **the clause text itself is
   byte-unchanged by this task**.
8. **The `0345` overlap is acknowledged** in the ADR — one sentence naming that task and the Plan row
   both would touch, so whoever ships second does not silently overwrite the first.
9. **Suite green.** Run **`npm run test:unit`** and confirm **0 failing** against the baseline
   re-derived at pickup. ⛔ Do not hardcode a pass count from another brief — measure it at pickup.
   ⚠️ **`npm test` CHAINS into `prove-red.sh` and takes ~9 minutes** — use `test:unit` for iteration
   and run the full `npm test` once before hand-off.
10. **Reference integrity is unchanged** — `node --test test/reference-integrity.test.js` reports
    **0 broken** links. This brief and the ADR both carry many relative links. ⛔ **Do not add a
    `NAMED_EXEMPT` entry** to make it pass; a broken link is fixed, not suppressed.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing

- ⛔ **This brief deliberately does NOT choose a mechanism**, on the owner's explicit ruling of
  2026-09-12 (*"File as a backlog row (Rec)"* — the ruling being **file it, decide nothing**). The
  choice belongs to the implementer's plan gate **with the owner**. A plan that arrives pre-decided has
  skipped that gate.

- ⭐ **Owner role is `fkit-architect`, not `fkit-coder` — deliberate, and here is why.** The deliverable
  is an **ADR**, produced by **`/fkit-record-decision`**, which `claude/skills-for-role.sh` assigns to
  `architect`. **ADR-044 Decision 1** fixes the Build row's role as *"the owner, in
  `skills_for_role()`, of the skill the deliverable is produced by"* — which lands on the architect
  directly. The substance agrees with the mechanism: this is a **role-boundary and ADR-038/ADR-044
  question** before it is a build. ⚠️ **The implementation that follows the ADR is `fkit-coder`'s** —
  that is a separate brief, filed after acceptance, and its owner field should say so.

- ⚠️ **Investigation-first, on purpose.** No implementation brief is written here because the shape of
  the work is unknown until the mechanism is chosen. Filing an implementation brief now would commit
  the project to an option the owner has not picked.

- ⚠️ **Filed as ONE brief.** The three options are not independently shippable — they are three answers
  to one question, and costing one without the others produces a decision that cannot be made. The
  split comes **after** the ADR, when the chosen mechanism has a known shape.

- ⚠️ **Conflict flagged, not planned around: `0345` edits the same ship-loop Plan row** (see
  § *Context*). ⛔ **No dependency edge is recorded** — neither task blocks the other, and the owner
  ruling authorising this filing set `Depends on: nothing`. Whichever lands second must reconcile that
  row rather than overwrite it.

- ⚠️ **A measured extension of the hand-over framing, flagged not silently applied:** a write-less
  spawnable type **already exists** (the built-in `Plan` agent type, Edit/Write/NotebookEdit absent),
  but it is not an fkit role, so the ADR-018 hook denies its `/fkit-plan-task` call. This narrows
  mechanism A's real cost to *role registration*, which is evidence for the decision and **not** a
  decision. Recorded because "build a write-less agent from scratch" and "register an existing
  write-less shape as a role" are different-sized asks.

- ⚠️ **Placement: Backlog board, UNRANKED, appended last** — ADR-035. Filed by a **spawned
  `fkit-producer` with no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  executing the mechanics of a relayed owner ruling and deciding nothing beyond them. Nothing was
  renumbered, nothing was inserted mid-board, and no Sprint 8 row was touched.

- ⚠️ **On merit this would sit directly below `0345`**, because `0345` rewrites the exact ship-loop
  Plan row this decision may rewire again — settling the wall question first, or immediately after,
  avoids editing one row twice under two different rules. ⛔ It is **not** ranked there: this is the
  unranked Backlog board, and ADR-035 forbids a mid-board insertion. The merit position is recorded
  here so the owner can act on it in one edit if they pull it into a sprint.
