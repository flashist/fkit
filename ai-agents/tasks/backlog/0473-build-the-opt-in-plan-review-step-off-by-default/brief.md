# Build the opt-in plan-review step (off by default)

## ID
0473

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.

**The owner's request, his own words** (2026-10-01, `fkit-lead` session):

> *"I think we should tell coder that they always need to get approval from other agents. If the
> feature is related to some product features or changes in the current product features. Then the
> coder should take approval from both producer and architect. If it's only the code feature, not
> feature but code changes maybe something related to architect then the coder should ask the
> architect. And in all cases, when the the plan is ready for the plan is done and approved by the
> dependent agents, the plan should be given to Codex for the final review. I'm a bit worried that
> this can make the whole process more complicated. So we need to test it first. I don't know how to
> do that, to be honest. I think Can you suggest me something? I want to build it, but I also want to
> keep the previous behaviour as-is right now, and I want to be able to switch "in time" (maybe by
> asking the fkit-lead about it) to use this new approach when the next task is planned, but the old
> approach should be our "by default" one."*

**Owner rulings** (2026-10-01, `fkit-lead` session, `AskUserQuestion`, selected option text):
- On the shape below: *"Yes, file the brief — Producer writes the brief; coder plans it; you approve the
  plan before anything is built, as usual."*
- When the coder cannot tell product change from code-only: *"Ask both — Producer + architect; safer,
  slightly slower."*

**Owner answers to the brief's open questions** (2026-10-02, `fkit-lead` session, **his own words,
typed by him**, relayed to the producer):
- **Q1 — product vs code-only:** *"The instructions shouldn't be fkit-specific. The product is what the
  project is delivering, youre right about the nature of fkit, but the instructions should be generic
  enough to make sure they work the same way in different projects, regardless of their nature."*
- **Q2 — how the trial runs:** *"I will run the tests via fkit-sprint-ship-loop loops, I won't be
  choosing specific tasks, I will run it as many times as needed to make sure I approve the new
  behaviour."* → the switch must work at the level of a **sprint-ship-loop run** (§2 below).

**Today's behaviour (the default, which must not change):** the coder plans with `/fkit-plan-task`, the
owner approves the plan, then the build starts. The plan gate is the one guaranteed human checkpoint
([ADR-019](../../../knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md),
[ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)).
This task adds an **optional** agent review of the plan **before** that gate. The owner still approves
**last**; nothing about his gate is removed or weakened.

**Overlap with ADR-052 phase 5 — flagged, not a hard dependency.**
[ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)'s
phase-5 tasks rewrite several of the same files: `0453` (both ship loops), `0450` (`/fkit-task-brief`),
`0451` (`dashboard.sh`), `0457` (rules and agent prompts). After conversion a brief is *"front matter +
text"* (ADR-052 D4). None of those tasks has started. Build this on the current tree; whichever lands
second carries the other's change forward. **Choose the switch's form so it survives the conversion**
(see *What to build* §2).

## What to build

### 1. The flow — runs ONLY when the switch is on

1. The coder writes the plan as today (`/fkit-plan-task`).
2. **The coder classifies the task and states its reason in one line.** ⛔ **The rule is generic** —
   written for **any** consuming project, never tied to fkit, with **no fkit-specific examples in the
   shipped instructions** (owner, Q1, 2026-10-02). *"Product"* means **what the project delivers to its
   users**:
   - **product change** — adds or changes what the project delivers (features, behaviour or output its
     users get) → the **producer AND the architect** approve;
   - **code-only** — internal; leaves what is delivered unchanged (refactors, tests, tooling,
     infrastructure) → the **architect** approves;
   - **unclear** → **both** (owner ruling, 2026-10-01).

   The plan gives the exact shipped wording of this rule for owner approval.
3. Each approver returns **approve** or **changes requested**, with reasons.
4. The coder revises and re-asks. **At most 2 revision rounds.** A disagreement still open after round 2
   goes to the **owner** to settle. There is no third round and no endless loop.
5. **Final Codex review of the agreed plan**, by the adversarial reviewer (`fkit-adversarial-reviewer`,
   on Codex). It returns **findings only** and changes nothing. If Codex is not available, its existing
   loud Claude-fallback flag must reach the owner, not be dropped.
6. **The owner receives the plan with three things attached:** who approved and how they classified
   it, what changed during review (and why), and Codex's findings. **The owner still approves last, as
   today.**

### 2. The switch — per sprint-ship-loop run, default off

- **Primary switch: a sprint-ship-loop run** (owner, Q2, 2026-10-02). When the owner tells `fkit-lead`
  to run `/fkit-sprint-ship-loop` with plan review on, **every task planned in that run** uses it. A run
  started without it behaves **exactly as today**. Default off.
- The switch is set **for the run, at its start**, and every task's plan step in that run reads it. A
  task whose plan was approved before the switch changes is unaffected. The run's roll-up says whether
  plan review was on.
- **The per-task brief field (e.g. `## Plan review: on`) is now optional to build.** Keep it only if it
  still earns its place (e.g. for the `fkit coder` session path, `/fkit-task-ship-loop` or a plain
  `/fkit-plan-task`, which have no sprint run). **The plan decides, and the owner approves.** If it is
  kept, the plan says how it combines with the run switch.
- **Whatever form is kept must survive ADR-052's conversion.** A per-task field should be a section in
  the brief's **body text**, which the conversion carries without being taught about it. A new
  dashboard-parsed field probably would not survive it and would also clash with `0451`. Check against
  ADR-052 D4/D8. A run-level switch lives in the run, not the store.
- Making plan review the **default** later is a separate owner decision (see `0474`). Out of scope here.

### 3. What the coder's plan must address

- **Where it lives.** Likely touch points — confirm each, and add any missed:
  `claude/skills/fkit-plan-task/SKILL.md`; both ship loops (`claude/skills/fkit-task-ship-loop/SKILL.md`,
  `claude/skills/fkit-sprint-ship-loop/SKILL.md`); `claude/agents/fkit-coder.md`;
  `claude/agents/fkit-producer.md` and `claude/agents/fkit-architect.md` (how they answer a
  plan-approval consult: a clear approve / changes-requested shape, focused, no situation briefing);
  `claude/agents/fkit-lead.md` (accepting "run the sprint loop with plan review on"); the adversarial-review skill
  (`claude/skills/fkit-adversarial-review/SKILL.md` today takes a **diff**; it needs a way to take a
  **plan** as input); the brief template in `claude/skills/fkit-task-brief/SKILL.md` **only if** a per-task field is kept
  (it must be **optional** — a brief without it stays valid); and `dashboard.sh` **only if** a parsed
  field is chosen.
  Edit the canonical sources in `claude/`, never the `.claude/` copies.
- **Consult-hop limit — verify, do not assume.** Max two hops, never a cycle
  ([ADR-010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)).
  Lead-driven: lead (hop 0) → coder (hop 1) → architect / producer / adversarial reviewer (hop 2) looks
  within the limit, but approvers at hop 2 can consult no one. Session path: coder (hop 0) → approvers
  (hop 1). Alternatively the **driver** could run the approvals itself (each at hop 1). Pick one per path
  and say why.
- **Skill ownership hook**
  ([ADR-018](../../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)):
  each approver may run only its own role's skills. No approver runs a coder or reviewer skill.
- **Spawned agents return questions, never ask**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  In the lead path, an unresolved disagreement after round 2 comes back as `NEEDS-DECISION` and the
  driver asks the owner. In the session path the coder asks the owner directly.
- **Rules-block byte cap.** Keep all of this **out of** the shared rules block (`RULES_MAX` in
  `claude/fkit-claude-init.sh`, pinned by `test/rules-block-budget.test.js`).
- **The ship loops' existing plan gate.** The sprint loop's plan step is prose-enforced (its honesty
  clause) and the driver writes `<task-folder>/plan.md` verbatim at approval
  ([ADR-020](../../../knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md)). Say
  where the review record (classification, approvals, changes, Codex findings) is kept — e.g. a separate
  file in the task folder, or attached to `plan.md` — and **who writes it**, given that a spawned
  plan-step coder writes nothing. If a new file is added to the task folder, check whether the
  structure spec / heal needs to know it.
- **Known gap — note it, do not fix it unless this work needs it.** `fkit-coder.md`'s write carve-out
  recognises only `fkit-sprint-ship-loop` as a caller; spawned coders flagged the wording gap five times
  this week. The plan step writes no source, so this feature probably does not need the fix. Say whether
  it does.
- **ADR.** This changes the planning workflow, so it **likely needs an ADR**. The coder cannot run
  `/fkit-record-decision` (architect-owned); the plan includes an `@fkit-architect` consult to record it
  (classification rule, the switch, the default, the 2-round cap, owner-approves-last, the trial-then-
  decide path). The ADR should also state how this sits with ADR-019 / ADR-032's "the plan gate is the
  one human checkpoint" — still true, since the owner approves last.
- **Tests that pin skill text.** Grep `test/` for phrases from every file touched; update deliberately,
  never by loosening an assertion.
- **Off means unchanged — and tests prove it.** With the switch off (no run switch, and no per-task
  field if one is kept), the plan step, both ship loops and
  every consult behave exactly as today. The plan proposes how a test shows that (e.g. the default path's
  text is untouched and the new steps sit wholly inside one clearly gated block).

## Verification steps

1. **Default unchanged:** a sprint-ship-loop run started **without** plan review (and, if a per-task
   field is kept, a brief with it absent or `off`) runs the plan step exactly as today — no approver consult, no Codex plan review, the owner sees the same plan
   presentation. Shown by the test(s) the plan proposes, plus a dry walk-through recorded in the worklog.
2. **On, code-only:** in a run with plan review on, a code-only task → the coder states the
   classification and reason, only the architect is consulted, Codex reviews the agreed plan, and the
   owner's presentation carries approvals + changes + Codex findings.
3. **On, product change and unclear:** both the producer and the architect are consulted, in both cases.
4. **Round cap:** a forced disagreement stops after round 2 and goes to the owner (`NEEDS-DECISION` in
   the lead path, a direct question in the session path). No round 3.
5. **Paths:** steps 2–4 hold for **every task planned** in a lead-driven sprint-loop run with plan
   review on — and in a `fkit coder` session too **if** the plan keeps a per-task field. The hop count
   stays ≤ 2 and the skill-ownership hook denies nothing in the walk-through.
6. **Codex unavailable:** the adversarial reviewer's fallback flag reaches the owner's presentation.
7. **Switch via the lead:** telling `fkit-lead` to run `/fkit-sprint-ship-loop` with plan review on turns
   it on for that run only; the next run started without it behaves as today. The run's roll-up says
   whether it was on.
8. **ADR recorded** (via `@fkit-architect`), reference links resolve: `node --test test/reference-integrity.test.js`
   and `node --test test/adr-number-uniqueness.test.js` green.
9. `node --test test/rules-block-budget.test.js` green, and the rules block is byte-unchanged by this task.
10. Full suite green (`node --test`).

## Notes

- **Depends on:** nothing
- **Blocks:** 0474
- ⛔ **Do not start without the owner's specific word.**
- **One brief, not several, for the build.** The flow, the switch and the role-prompt edits only make
  sense together: a switch with no flow, or a flow with no switch, cannot be tested or used on its own.
  The ADR rides inside this task (recorded by the architect via consult) so the decision and the build
  land together. The **trial** is a separate unit — `0474`.
- **Overlap, not ordering:** `0453`, `0450`, `0451`, `0457` (ADR-052 phase 5) edit the same files. No
  hard dependency either way; the second to land carries the first forward.
- **Owner approves last** — this task must not add, remove or weaken an owner gate. Its only new owner
  touchpoint is settling a disagreement still open after round 2.
- **Generic, not fkit-specific** (owner, Q1, 2026-10-02): the classification rule and every shipped
  instruction must work the same way in any consuming project.
- **No new role.** The team stays seven; approvals are consults to existing roles.
- **After it lands:** `fkit-wiki` will likely need a re-sync for the new ADR and the changed skills.
- **Filed 2026-10-01** by a spawned `fkit-producer` at `fkit-lead`'s direction, on owner rulings relayed
  from the lead session — no owner channel (ADR-021). ⛔ No commit.
- **Updated 2026-10-02** by a spawned `fkit-producer`: recorded the owner's answers Q1 (the classification
  rule is generic) and Q2 (the switch works per sprint-ship-loop run; the per-task field is optional,
  for the plan to decide). Relayed by `fkit-lead`. ⛔ No commit.
