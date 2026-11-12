# ADR-063: Planner owns all native task planning and post-decision planning records

- **Status:** accepted — design; planner not implemented or active.
- **Date:** 2026-11-12
- **Deciders:** owner (Mark Dolbyrev), via primary OpenCode fkit-lead question channel; answers relayed verbatim to fkit-architect. Relay is trust, not verified human-signature evidence.
- **Task:** [0546](../../tasks/backlog/0546-design-fkit-planner-and-task-planning-ownership-transfer/brief.md).
- **Specification:** [Native planner design](../reports/2026-11-12-design-native-fkit-planner.md), especially §§5–12; its payloads, entry matrix, edge cases and acceptance criteria are the implementation contract.
- **Runtime/source boundary:** [ADR-062](adr-062-native-opencode-only-branch-and-native-source-authority.md).

## Context

Planning currently belongs to coder on native direct/ship-loop paths (`opencode/skills/fkit-plan-task/SKILL.md`, "Only fkit-coder executes this procedure"; sprint loop, "Spawn fkit-coder for a PLAN ONLY"). Record ownership differs between native/legacy procedures and historical decisions. Native setup grants no ordinary edit targets to lead (`opencode/setup.mjs`, role edit rules). This decision moves a specialization; it is NOT a workaround for denied record edits and authorizes none of those old edits.

Delegating an approved-plan copy has a known reconstruction risk: ADR-020's dated `0207` note explicitly rejected that route. The owner now chooses a specialist Record phase, paired with exact-content validation against the primary's original approval material. A hash still cannot establish consent.

### Owner rulings, verbatim

All **2026-11-12, primary OpenCode fkit-lead session, question channel**, relayed by fkit-lead:

- **"Focus on OpenCode only, we're not supporting Claude anymore in this branch. Claude will be able to be supported only via OpenCode"**.
- **"All planning paths (Recommended)"**.
- **"Planner after decision (Recommended)"**.
- Final revised-design gate: **"Accept design (Recommended)"**.

The presentation explicitly authorizes formal design records and preparation of build briefs, NOT source implementation, legacy-file deletion, runtime activation, model/provider changes, tests or resuming stopped checks. Full question wording/accepted mechanisms are in report §1 and §§4–12. No future implementation or role availability is asserted by acceptance.

## Decision

1. **Dedicated native planner, every task-planning route.** Transfer `fkit-plan-task` exclusively from coder to planner and add planner-owned `fkit-record-plan`. Lead conductor/sprint loop, coder primary/task loop/plain planning, planner dedicated session and inline requests all follow planner ownership. Non-source execution plans also belong to planner; actual architectural/product deliverables and decisions remain with their producing roles. No by-hand Plan=Build-role fallback remains in the new native contract.
2. **Ordinary capabilities, specialized authority.** Planner has normal research/named-role consultation and common skills, but writes no source/tests, briefs, worklogs, implementation ledgers, boards or vault. Wiki query/deep consult is read-only; maintenance needs a separate primary-authorized wiki assignment. Only producer invokes movers; agent closes retain `(agent-closed — not owner-verified)`. No commit/push permission follows from plan/design approval.
3. **Draft is read-only; primary holds the owner channel.** Draft payload identifies caller/session, task or inline request, intent, review policy/origin, real chain, scope and actual rulings. It authorizes no files/tests/lifecycle/maintenance and carries no coder source marker. Return full plan/review/limits or NEEDS-DECISION; only the live primary asks/waits. No silence, timer, agent verdict, typed question, "Explain more" or stale/unrelated approval counts as consent.
4. **Record is a separate artifact authorization after actual decision.** Payload includes live caller, unique attempt, decision, verbatim owner quote/date/channel, complete presented and approved text (approved absent on rejection), full review payload, exact authorized paths and expected prior state. Planner copies, never replans. Record permits only exact `plan.md` and append-only `plan-review.md`; it is not the coder marker and gives no source authority. Acceptance establishes the standing record policy; the primary explicitly issues Record after approval/rejection without a separate routine save dialog, unless owner forbids saving. A primary planner performs a separate bounded local phase, never self-spawns.
5. **Artifact ownership/location.** Task plans/review attempts live beside the brief; inline equivalents live in ignored machine-local `.fkit/planning/<request-id>/`, not invented task folders. `plan-review.md` exists for approved/rejected/opted-out attempts and preserves exact presented snapshots, review/dispositions/limits, real decision metadata and approved hash or no approved plan. Rejection appends but does not create/replace approved scope. Coder owns implementation `worklog.md`; reviewer/coder ledger ownership stays intact.
6. **Exact helper and primary validation before implementation.** Future `fkit-record-plan/record.mjs` writes exact UTF-8 from the full payload and offers read-only validation to any primary. Require explicit path/identity and expected-hash checks, symlink refusal, idempotent identical completed attempts, conflicting-attempt refusal and readback hashes/byte counts. Primary validates plan AND complete decision/review attempt against its OWN original presented/approved text and actual answer, not the worker's echo. Compute pointer from disk; carry full text and pointer to Build. Mismatch, stale/missing target, failed write or incomplete two-file update stops Build; torn state requires explicit recovery. No multi-file transaction, reconstructed-original-text or authenticated-consent claim.
7. **Source-writing marker remains separate and bounded.** Lead/sprint-loop Build and Process-review retain caller/full approved scope/real owner approval/worker-role fields; all new native carries use full plan, verbatim quote/date/channel, validated planning attempt and plan path/blob pointer. Planner is not a new source-driving caller. Primary coder implements directly only after its own owner gate and validation; plan-only intent never auto-builds. Existing Process-review fix discipline, task-folder requirement and implementation decision-log audit remain. Non-coder producing roles retain their own approval rules, not the coder source marker.
8. **Revision/resume/new-primary rules.** Complete revised scope returns to owner; material implementation-scope changes repeat Draft/gate/Record/validation. Post-review owner changes are disclosed as not re-reviewed unless owner requests another pass. Same primary may resume an explicitly evidenced approved workflow; records alone do not authorize a new primary. New lead/coder primary explicitly asks owner to adopt the exact plan, including packets from a dedicated planner session. Missing/ambiguous/local-store-lost evidence returns to gate. Unchanged review need not repeat solely due to primary change. Stateful Process-review is not invented for no-folder work; use applicable ephemeral review or return a producer/owner decision.
9. **Independent review, native depth 3, no cycles.** Review remains ON by default including inline, with explicit launch/run/one-plan opt-outs and origin/reporting preserved. Product/unclear -> producer+architect; code-only -> architect; dispute -> unclear. Approver two-revision-round cap/disagreement escalation remains. Independent reviewer obtains hostile native child; actual runtime identities and same/unknown/missing-model partial flags remain. Fresh context/config alone is not diversity evidence. Only primary asks owner. Primary(0)->planner(1)->reviewer(2)->hostile(3) fits existing depth. Approvers are read-only leaves for that assignment; wiki/hostile remain leaves. No ancestor/invoker consultation, generic helpers, CLI delegates or depth-four coder-loop nesting. Insufficient depth is explicitly incomplete and primary redispatches; never silently omit review. One writer per task/request; Record cannot overlap Build/ledger/lifecycle writes.
10. **No structural approval-wall claim.** Native static edit/skill/subagent permissions remain; shell is approval-controlled and can bypass ordinary edit restrictions. Draft/Record timing, owner attribution, cycles and source approval remain prompt contracts. Hashes establish bytes, not consent. Partial review and incomplete required verification do not authorize automatic closure. This chooses no mechanism for `0387` and revives no paused checks.
11. **Roster and bootstrap.** Seven roles remain callable/shipping until implementation; planner is future eighth shipped, tester remains authorized/unbuilt, nine authorized in total. Add planner to valid owners only when it ships. Existing coder plans/builds bootstrap under separate approval. Native authority/delivery precedes the all-path planner vertical slice; activation/verification needs separate consent. No lifecycle/status/dependency changes are made to 0546 or overlapping tasks.

## Scoped amendments and unchanged boundaries

The amendments below apply to the NEW native contract when implemented, not retrospectively to frozen records or unsupported legacy workflows. Historical ADR statuses/text remain intact with dated pointers.

| Prior decision | Native change / unchanged part |
|---|---|
| ADR-019 / ADR-020 | Planner, not coder/driver, authors/persists task plans; post-decision validation precedes implementation. Worklog/coder fix audit and separate artifacts remain. ADR-020's `0207` worker-copy prohibition is deliberately replaced for this native flow, not silently ignored. |
| ADR-032 | Lead remains conductor/owner channel; Plan -> planner; Record -> planner then primary validation before Build. No child task-loop wrapper. |
| ADR-044 Decision 2 | Replace native Plan=Build-role/by-hand exception with Plan=planner. Producing-skill Build ownership, Verify/Review/Process-review/Close and vault-row exclusions remain. ADR-038's skill-owner principle remains. |
| ADR-055 | Retain declared source caller/approval/scope/worker-role; new native handoffs require full plan, quote/date/channel, validated planning identity and pointer. No planner source-driving grant or hash-as-consent. |
| ADR-056 / ADR-059 / ADR-060 | Planner owns native Draft/Record; native reviewer->hostile identities/depth and all-path default/opt-outs replace legacy coder/switch/CLI/plan-mode/record-writer assumptions. Classification approvals, round cap, owner gate, honest limits and provisional default/opt-out policy remain. No final keep/drop ruling is invented. |
| ADR-061 | ADR-062 governs runtime/source cutover; this ADR adds planner and changes native chain, procedure and record ownership. Native permissions, leaf and review honesty boundaries remain. |
| ADR-028 | Tester authorization unchanged; its historical ordinal is not the shipping count. |

## Options considered

- **Specialist on all paths; post-decision Record with exact primary validation (chosen).** Implements the owner's separation and persistence choices with one handoff contract.
- **Lead-only pilot or retained coder inline plans.** Not the owner's all-path choice; leaves ambiguous planning ownership.
- **Keep driver/session-coder record writers.** Earlier contract; owner chose planner after decision. Replaced deliberately with additional fidelity checks.
- **Planner implements/drives source under its Record marker.** Not accepted: collapses authority and bypasses the declared source-writing contract.
- **Chat-only inline records.** Not chosen in the accepted revised design; ignored local records supply paths/hashes without creating tasks. They are deliberately not tracked task records.
- **Write-less structural planner or new approval hook.** Not this decision; `0387` remains open and no structural wall is claimed.

## Consequences

- **Positive:** coherent task-plan specialization on every native route; implementation and independent review remain distinct; rejected/revised decisions and exact scope survive handoff/compaction.
- **Negative / costs:** additional agent boundary and persistence helper; copied text and presented snapshots increase storage/context cost; Record can tear across two files and must stop; local inline records do not travel across machines; a new primary adds an adoption gate. Exact comparison narrows reconstruction risk but cannot authenticate consent. Native authority/delivery work is a prerequisite, not just a new profile file.
- **Residual risks / Re-raise only if:** a planner writes outside Record/scope, source begins before validated real approval, helper accepts different bytes/decision or a partial write, an entry retains non-planner planning, depth/cycles prevent independent review, new-primary/local-loss behavior is insufficient, a role/model/permission policy changes, or the owner re-rules review default/retention. Do not re-raise accepted prompt trust or compatibility/local-record costs merely as defects; bring changed evidence or a new owner ruling.

## Related

- [Accepted specification, exact payloads and acceptance checks](../reports/2026-11-12-design-native-fkit-planner.md).
- [ADR-062](adr-062-native-opencode-only-branch-and-native-source-authority.md).
- [ADR-020](adr-020-per-task-plan-and-worklog-artifacts.md), §Decision and `0207` note; [ADR-055](adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver.md), §Decision — fidelity precedents.
- [ADR-044](adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md), Decisions 1–4; [ADR-061](adr-061-native-opencode-runtime.md), native permissions/model evidence.
- `opencode/skills/fkit-review/SKILL.md`, Step 2 (`distinct-runtime-models` requirement); native ship loop, "Only a non-partial review" — preserved honesty/gating contracts.
- Tasks `0345`, `0387`, `0543`–`0545` remain unchanged; report §10 records overlap without new dependencies or closures.
- fkit-wiki should ingest this ADR/report and re-ingest annotated historical ADRs separately; no wiki mutation here.
