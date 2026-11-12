# Design `fkit-planner` and the transfer of task-planning responsibility

## ID
0546

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Owner request, 2026-11-12, typed in the primary `fkit-lead` chat**, relayed to a spawned
`fkit-producer`:

> Can you create a new role: fkit-planner, who will be responsible for the plan phase of working with tasks? The idea here is to dedicate a separate agent for this phase. This agent might spawn other agents for consulting about all the needed questions, the same way coder/producer/architector/reviewer can spawn subagents. The fkit-planner also should have regular access to the fkit-wiki agent in order to be able to get access to the knowledge base. Overall - the agent will have the same capabilities as other agents, but will have it's own specialization. When work on a task starts, and the plan phase of the work starts, the fkit-lead agent should spawn the fkit-planner agent, give it a task for doing a plan for a task, wait for it to complete it work and give the plan back to the user. We're basically "transfering" the plan role from whoever does it now, to the new role fkit-planner

**Owner's sequencing instruction, same date and channel, verbatim:**

> Brief a task for that first (don't stop architect though yet)

**Owner scope rulings — 2026-11-12, question channel in the primary OpenCode `fkit-lead`
session**, relayed by `fkit-lead`; answers quoted verbatim:

| Question | Owner's answer | Consequence |
|---|---|---|
| Which runtimes should receive fkit-planner and the planning transfer? | "Focus on OpenCode only, we're not supporting Claude anymore in this branch. Claude will be able to be supported only via OpenCode" | This branch supports native OpenCode only, not staged dual-runtime support or a standalone Claude runtime. Define the native source of truth and remove inappropriate runtime assumptions in the proposed design; retain compatibility artifacts only where explicitly scoped. This does not authorize deleting old Claude files, changing provider/model configuration, inventing provider requirements or banning supported models. |
| Transfer all task planning, or pilot only lead-driven work? | "All planning paths (Recommended)" | Transfer task-plan ownership on every native OpenCode planning entry path, including direct coder/task-loop/plain-plan and lead/sprint-loop paths; not a lead-only pilot. |
| Who should save planning records after your actual decision? | "Planner after decision (Recommended)" | Planner drafts and conducts review consultations read-only. After the primary obtains the actual owner decision, a separately authorized planner assignment saves the exact approved plan and appends plan-review/approval records, returning paths/hashes. The primary validates the handoff before coder Build. |
| Final revised-design acceptance | "Accept design (Recommended)" | Accept the final native-only design; authorize formal architecture records and build-brief preparation only. No source implementation, legacy-file deletion, activation, provider/model changes, tests or restarting stopped checks is authorized. |

**Accepted design, not permission to implement or activate.** All four answers above were given
2026-11-12 in the primary OpenCode `fkit-lead` session's question channel and relayed verbatim by
`fkit-lead`; this is recorded relay provenance, not independently verified human consent evidence.
The architect consolidated its first and revised native-only proposals into actual formal records:

- [Accepted specification](../../../knowledge-base/reports/2026-11-12-design-native-fkit-planner.md),
  including §11's accepted authority/delivery → planner vertical slice → separately authorized
  activation/verification split, exact payloads, entry matrix and verification limits.
- [ADR-062](../../../knowledge-base/decisions/adr-062-native-opencode-only-branch-and-native-source-authority.md)
  — native-only branch and native source/delivery authority.
- [ADR-063](../../../knowledge-base/decisions/adr-063-planner-owns-native-task-planning-and-post-decision-records.md)
  — all-path planner ownership, exact post-decision records and primary validation.

Historical ADR additions point to these new records. No additional design question is open in the
accepted specification; implementation details remain bounded by it, and materially new choices
return to the owner. No implementation or runtime behavior has been verified by this design work.
Seven roles remain callable; planner is unbuilt. Current coder bootstraps separately owner-approved
implementation plans. This brief stays `🔲 Backlog`, `Unscheduled`, owned by `fkit-architect`:
acceptance and follow-up filing do not invoke the producer mover or close/re-place this task.

**Dependencies and conflicts surfaced, not silently resolved:**

- [0387](../0387-decide-whether-the-orchestrated-plan-gate-gets-a-structural-wall/brief.md)
  already considers a write-less planner as one possible approval-wall mechanism. This request is
  for planning specialization with ordinary consultation capabilities, not approval of that
  mechanism or a structural write-wall. Keep its mechanism choice open; propose how the overlapping
  records should relate without editing, closing or cancelling that task.
- [0345](../0345-carry-adr-044s-build-and-plan-role-rule-into-the-ship-loop-and-agent-text/brief.md)
  and [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
  cover Plan/Build role selection. Accepted ADR-063 replaces the native Plan=Build-role/by-hand
  limb with Plan=planner; preserve Build, Process-review and vault boundaries. Existing `0345`
  records are not edited or closed by that design amendment or this filing.
- [ADR-055](../../../knowledge-base/decisions/adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver.md)
  governs delegated implementation approval and exact-plan carry.
  [ADR-020](../../../knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md)
  and [ADR-056](../../../knowledge-base/decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md)
  establish plan/review artifacts; reconcile their later amendments and actual runtime procedures.
- [ADR-061](../../../knowledge-base/decisions/adr-061-native-opencode-runtime.md)
  records the prior alongside-runtime arrangement and native OpenCode permissions/orchestration.
  The scope ruling above now requires OpenCode-only support on this branch, not preservation of
  standalone Claude support. Identify native sources of truth and any explicitly retained
  compatibility artifacts in the design; do not delete historical files or assume provider/model
  changes are approved. Do not claim Claude hooks or plan-mode tools run in OpenCode, or that tool
  restrictions prove an OS write sandbox.
- Sprint 12 remains paused by the relayed owner instruction. `0543` is implemented but open for
  required Claude live checks; `0544` depends on it. `0545` has the relayed "Qualified wording
  (Recommended)" choice and an interactive evidence gap. Those are context, not new dependency
  edges or permission to resume, waive gates, execute denied record edits, or close anything.

## What to build

**A design and owner-decision package only; no runtime implementation.**

1. **Consolidate the existing architect findings and revised OpenCode-only proposal** into a design
   report under `ai-agents/knowledge-base/reports/`, once available through the primary session.
   Separate verified current behavior, settled scope rulings, proposed changes and unanswered
   questions. Do not duplicate its detailed investigation. Until findings are reviewed with the
   owner, do not scope implementation briefs.
2. **Define the ownership transfer.** `fkit-planner` owns task-plan preparation; the lead delegates
   the plan phase, waits for its return, presents the complete plan to the owner, and implements
   nothing before actual approval. Distinguish task planning from the producer's product/sprint
   planning and task-brief/lifecycle duties. Use existing callable roles to bootstrap this work;
   `fkit-planner` does not exist yet and is not a valid task owner at filing.
3. **Apply the settled native OpenCode-only, all-path transfer:** lead conductor, sprint-loop,
   direct coder/task-loop/plain-plan entry paths, and inline versus task-folder requests. Inventory
   all native planning routes so none silently retains the old planner. Standalone Claude runtime
   support is excluded, not deferred to a later rollout. Define native sources of truth, eliminate
   inappropriate Claude-runtime assumptions in the proposed design, and identify any retained
   compatibility artifacts and why they are needed. No legacy-file deletion or provider/model
   configuration change is authorized by these scope choices.
4. **Specify consultation and wiki access.** Planner can consult appropriate existing roles,
   including `fkit-wiki`, with explicit scope, approved rulings, hop budget and no-cycle discipline.
   Direct wiki reads follow `/fkit-query`; only wiki writes the vault. Workers return
   `NEEDS-DECISION`; the primary alone owns live user choices, asks the owner and waits. Draft/review
   consultations are read-only. Accepted nesting stays at native depth 3: primary → planner →
   reviewer → hostile; approvers are assignment leaves, wiki/hostile remain leaves, no ancestor
   consultations. Any materially new depth/tool/permission choice returns to the owner. Ordinary
   tools do not transfer source-write or review authority.
5. **Detail the settled planner-after-decision persistence and handoff.** The primary obtains the
   actual owner decision, then separately authorizes a bounded planner assignment to copy the exact
   approved plan into `plan.md` and append `plan-review.md`/approval records. The planner returns
   paths/hashes; the primary validates them against the approved plan and decision before coder
   Build. Name native locations and timing (including relation to `worklog.md`) for each entry path,
   rejection, revision and resume; do not invent an approved plan on rejection. Keep review findings
   separate from approved scope, preserve append-only review history and existing ledgers, and
   retain single-writer discipline. Specify exact approved-plan carry, actual owner approval
   quote/date/channel, caller, Build/Process-review role and required plan pointer/hash. A hash pins
   bytes, not human consent. An agent verdict, timeout, silence or stale approval is never owner
   approval; material scope changes return to the owner. This post-decision artifact assignment is
   not permission for planner source implementation, self-approval, lifecycle moves or vault writes.
6. **Keep authorities and review independent.** Source implementation stays with `fkit-coder`;
   architect and producer retain their own deliverables. Review remains separate from plan author
   and implementer: retain independent reviewer and hostile review, default ON with existing explicit
   opt-outs, honest model-diversity/partial-coverage flags and the unchanged owner approval gate.
   Planner cannot self-approve its review. Only producer invokes lifecycle movers; agent closes retain
   `(agent-closed — not owner-verified)`. No commit/push permission comes from planning approval.
7. **Inventory native OpenCode's complete delivery surfaces.** Cover native role registration,
   role/skill ownership, artifact-specific permissions, subagent routing, model setup, launcher/help,
   install/update/scaffold delivery, owner vocabulary, team/count descriptions and documentation.
   Identify native canonical files, any explicitly scoped compatibility artifacts, intended mirror
   differences and concurrent changes; do not preserve standalone Claude runtime assumptions by default.
   Follow accepted ADR-062/063 rather than historical native/legacy authority assumptions. Seven
   roles are currently callable; planner is the future eighth shipping role, tester remains unbuilt,
   nine roles are authorized in total. Add planner to valid owners only when it ships. Source and
   activation remain separate from the accepted design; no current availability claim follows.
8. **Return open decisions to the primary**, with options, one recommendation and plain context;
   record actual owner answers verbatim with date/channel, never assumed approval. Once reviewed,
   record approved role-boundary decisions through the architect-owned procedure and propose the
   smallest independently shippable build briefs, owners, dependencies and verification needs for
   producer filing. Unanswered choices remain explicitly open.

## Verification steps

1. The design report traces each requirement in the owner's request to a proposed flow or an open
   owner decision, and identifies the existing architect findings it incorporates. Missing findings
   are marked pending, never invented or passed.
2. A coverage matrix applies the quoted native OpenCode-only, all-planning-path ruling: every native
   entry path above transfers ownership, standalone Claude support is excluded rather than staged,
   native sources of truth and retained compatibility artifacts are explicit. It neither authorizes
   legacy-file deletion nor invents provider requirements/model restrictions. Scope approval is not
   claimed as full design or implementation approval.
3. The documented lead flow shows a named planner child returning a complete plan, owner questions
   relayed by the primary, actual owner approval, then a separate bounded implementation handoff.
   Planner consultation/wiki routes and native OpenCode nesting fit are explicitly accounted for;
   draft/review consultations write nothing and only the primary asks the owner.
4. An artifact/handoff matrix implements planner-after-decision ownership: separate authorized
   planner assignment, exact-plan copy and appended review/approval records, returned paths/hashes,
   primary validation, then coder Build. It covers approval quote/date/channel, rejection/revision/
   resume and no concurrent writers. No review finding is accidentally included as approved scope;
   planner has no source, self-review-approval, lifecycle or vault-write authority.
5. The report provides checkable future-build acceptance criteria for role/permission registration,
   installed-role discovery, lead delegation, consultation including wiki, approval-before-source,
   coder-only implementation, independent reviewer plus hostile review (default ON, explicit
   opt-outs and partial-model flags retained), unchanged owner gate and lifecycle/vault boundaries.
   Registration, install/scaffold, help, owner vocabulary and docs agree on native OpenCode-only
   support and all native planning paths; standalone Claude is not advertised as supported.
6. `0387`/`0345`, affected ADRs and `0543`–`0545` are acknowledged without silently modifying their
   scope, evidence, dependencies, ranks, statuses or ledgers. This design supplies a proposed build
   split only after findings/owner review; no source/agent/config changes or runtime refresh occur.
7. Actual owner decisions are quoted with date/channel; proposed ADR changes are not labelled
   accepted without owner approval. Unanswered decisions and unverified behavior are listed plainly.
8. Verification is document/read-only inspection for this task. Repository tests remain retained
   but execution is paused by the owner's 2026-11-11 ruling; run no tests without an explicit request.
   Future live checks/test needs are proposed separately, and any unrun check stays unverified.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Split rationale:** one design-and-decision unit: rollout, delegation, artifact writers and
  authority boundaries must agree before implementation seams can be scoped honestly. The build
  split follows reviewed findings; this is not a monolithic implementation brief.
- **Placement:** Backlog, `Unscheduled`, because no sprint was named. No existing dependency is
  re-pointed; no existing open task names `0546` as a dependency at filing. Knock-on: none (checked).
  Overlap is coordination context, not an invented hard dependency.
- **Bootstrap owner:** `fkit-architect`, a live role; do not assign this brief to the unbuilt planner.
- **Earlier scope update 2026-11-12 (historical; pending-design statements superseded by the final
  acceptance above):** the three owner answers quoted in *Context* settle runtime coverage,
  all-path ownership transfer and planner-after-decision record ownership, not detailed design,
  ADR acceptance or implementation approval. Revised OpenCode-only design, exact persistence/
  validation mechanics, native registration/permission details, compatibility-artifact scope,
  overlap handling and the implementation split remain pending. This update changes only this
  brief; the existing Backlog-board row and its filing-time wording remain untouched as instructed.
  Sprint 12 and existing Claude checks do not resume; the test-execution pause remains in force.
- **Accepted-design follow-ups filed 2026-11-12:**
  [0547 — native authority/delivery](../0547-build-native-opencode-authority-and-delivery-boundary/brief.md),
  then [0548 — all-path planner vertical slice](../0548-build-planner-all-native-planning-paths-and-exact-record-handoff/brief.md),
  then [0549 — separately authorized activation/verification](../0549-authorize-and-verify-native-planner-activation/brief.md).
  All filed on Backlog as `Unscheduled`, `🔲 Backlog`, owned by current `fkit-coder`.
  `0548` depends on `0547`; `0549` depends on `0548`. Accepted formal records satisfy the design
  prerequisite; no dependency requires a new `0546` lifecycle close. Existing task/sprint dependencies
  remain unchanged. Source plans require separate live approval; activation/live actions/test runs
  require their separate execution consent. Preparation is not implementation or shipping evidence.
- **Wiki grounding:** read-only query of `[[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]`,
  `[[decisions/adr-020-per-task-plan-and-worklog-artifacts]]`,
  `[[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]`,
  `[[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]]`,
  `[[decisions/adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver]]`
  and `[[decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default]]`.
  The wiki lacks the current native-runtime/planner design context: read current source ADRs and
  runtime procedures rather than treating older defaults/topology as current. Seven commits touched
  `ai-agents/` outside the vault since watermark `185ac5e07e918c089ed3afd23496587315342000`;
  a future wiki ingest/sync belongs to `fkit-wiki`, not this task.
- **Filed 2026-11-12** by a spawned producer on the relayed owner request above. This filing writes
  only this new brief and its Backlog-board row; no source, tests, runtime refresh, wiki writes,
  lifecycle closure, denied record edits, commits or pushes are authorized or performed by filing.
