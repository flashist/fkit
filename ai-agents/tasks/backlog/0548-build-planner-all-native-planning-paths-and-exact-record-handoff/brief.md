# Build planner ownership on all native paths and the exact planning-record handoff

## ID
0548

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Unit B of the accepted [0546 specification](../../../knowledge-base/reports/2026-11-12-design-native-fkit-planner.md),
especially §§5–12, implements
[ADR-063](../../../knowledge-base/decisions/adr-063-planner-owns-native-task-planning-and-post-decision-records.md)
after [0547](../0547-build-native-opencode-authority-and-delivery-boundary/brief.md)'s native authority/delivery
boundary. [ADR-062](../../../knowledge-base/decisions/adr-062-native-opencode-only-branch-and-native-source-authority.md)
excludes standalone Claude support; no parallel rollout or legacy-tree deletion belongs here.
The four exact owner answers and provenance are in
[0546](../0546-design-fkit-planner-and-task-planning-ownership-transfer/brief.md), *Context*.
Final acceptance was **"Accept design (Recommended)"**, 2026-11-12, primary OpenCode `fkit-lead`,
question channel, relayed by `fkit-lead`: formal records and brief preparation only.

**Execution gate:** existing `fkit-coder` plans this bootstrap; the unbuilt planner is not callable.
Each implementation plan needs separate actual live owner approval before source writes. Build the
new role, ownership, exact storage/validation and every dispatch together; never remove coder Plan
ownership while replacement routing is unavailable. Canonical implementation is not installed/live
activation; [0549](../0549-authorize-and-verify-native-planner-activation/brief.md) scopes the separately
consented activation/verification. Seven roles remain callable until an authorized activation is
actually established. Design/build approval alone authorizes no test run, refresh or stopped check.

## What to build

1. Add native `fkit-planner` to `0547`'s registry/prompts/runtime contract and selected native
   scaffold surfaces. It receives ordinary research/named consultation plus common `fkit-query`,
   `fkit-team`, `fkit-dumb-down`, `fkit-open-questions-interview`; exclusively owns `fkit-plan-task`
   and new `fkit-record-plan`. Coder keeps task ship-loop/process-review; lead keeps sprint-loop;
   other skills retain owners. Planner inherits normal team model/effort, never hostile defaults.
   New role registration/readiness must not falsely advertise activation or a callable child now.
2. Implement distinct full **Draft** and **Record** assignment contracts exactly as design §6.
   Draft identifies caller/session, task/inline identity, intent, review policy/origin, real chain,
   complete scope/rulings; draft and consultations write no files and carry no coder source marker.
   Return full plan/review/limits or `NEEDS-DECISION` with at most three options. Only live primary
   asks/waits; questions, "Explain more", silence, timeouts and agent verdicts are not consent.
3. Record follows an actual primary-owned approval/rejection and a separate bounded authorization:
   exact presented/approved text (approved absent on rejection), actual quote/date/channel, full
   review payload, unique attempt, explicit paths and expected prior state. Acceptance establishes
   the standing save policy, not a second routine owner-save dialog; owner "do not save" wins.
   Planner copies only, never replans. A planner primary performs a separate local Record phase,
   not a self-spawn. No source, brief, worklog, implementation-ledger, board, lifecycle or vault writes.
4. Build `opencode/skills/fkit-record-plan/record.mjs`: planner-only write operation and read-only
   validation usable by any primary without executing planner's write skill. Preserve exact UTF-8
   bytes without newline normalization, summaries or scope decorations. Check identity, explicit
   target paths, expected prior hashes, symlinks and unique attempts; completed identical retry is
   idempotent, conflicting reuse refuses. Return actual paths/attempt/hashes/byte counts/outcome.
   Nonzero failure and incomplete/torn two-file update stop Build; report explicit recovery needs,
   never claim a multi-file transaction. Keep one writer; no Record/Build/ledger/lifecycle overlap.
5. Save task `plan.md` on approval only; append `plan-review.md` on approval/rejection including
   explicit opt-outs. Inline equivalents live in ignored machine-local `.fkit/planning/<request-id>/`,
   without invented task IDs/briefs/lifecycle objects; preserve owner ignore rules. Each attempt
   retains exact presented snapshot/hash, originating primary/identity, review policy/origin,
   classification/approvers/reviewer/hostile evidence, dispositions/revisions/limits, actual answer
   quote/date/channel and approved hash or no approved plan. Rejection leaves older approved plan
   unchanged and identifies its older attempt; no stale scope becomes current approval.
6. Before Build, primary validates against its **original** presented/approved bytes, actual decision
   metadata and complete review payload, not planner echoes. Check approved attempt and expected
   state, compute plan pointer from disk, and carry full exact plan plus pointer/hash. Missing,
   stale, mismatched, reconstructed-original or incomplete records stop source writing. Hashes
   establish bytes, not authenticated human consent; no Claude carry-check hook runs in OpenCode.
7. Replace **every native planning route** coherently: lead conductor; each eligible sprint task
   with sibling Plan/Build workers; coder primary/session; primary-driven coder task ship-loop;
   plain `/fkit-plan-task` from another primary; dedicated planner primary; inline from any primary;
   non-source task execution plans. No retained coder/by-hand Plan fallback or depth-four nested
   child task loop. Plan-only intent does not auto-build. Dedicated planner returns a validated
   packet; a new lead/coder primary asks owner to adopt exact scope before implementation. Saved
   records alone are not live consent; unchanged review need not repeat solely for primary change.
8. Preserve actual producing-role Build ownership: source/tests only coder, architectural/product
   deliverables remain architect/producer; retain Verify/Review/Process-review/Close and vault-row
   exclusions. Source handoffs retain caller/full scope/actual quote/date/channel/Build or
   Process-review role, adding validated attempt and plan pointer. Planner is not a source-driving
   caller. Primary coder builds directly after its owner gate/validation, without a forged delegated
   marker. Stateful Process-review still requires a real task folder; inline uses applicable
   ephemeral review or returns a producer/owner decision. Preserve localized, verified-CORRECT,
   in-plan fix discipline and implementation decision log.
9. Keep native depth **3**: primary → planner → reviewer → hostile; approver consultations are
   read-only leaves for that assignment, wiki/hostile remain leaves. No ancestor/invoker consults,
   generic helpers or Claude/Codex CLI bridge. Coder primary supplies feasibility evidence rather
   than planner consulting it back; gaps return to primary. Too-deep review is explicitly incomplete
   and redispatched by primary, never silently skipped. Direct wiki query/deep lookup is read-only;
   maintenance requires a separate primary-authorized wiki assignment.
10. Keep review **ON by default on all paths, including inline**, explicit launch/run/one-plan opt-outs
    with origin/conflict/reporting rules, never carried unasked. Opt-out skips independent plan
    review only, not owner choices/gate or implementation review. Product/unclear → producer and
    architect; code-only → architect, disputed classification → unclear. Retain APPROVE/CHANGES
    REQUESTED shape, malformed-reply refusal, two-revision-round cap and owner escalation.
    Independent reviewer obtains native hostile evaluation; preserve actual model-identity evidence,
    same/unknown/missing/unusable-output partial flags and reasoning-only coverage truth. Planner
    cannot self-certify review. Present complete plan/reports/findings/dispositions/flags before gate.
11. Route owner revisions back to read-only Draft and full-plan approval; disclose changes after
    review as not re-reviewed unless another pass is requested. Material implementation-scope change
    repeats Draft/gate/Record/validation. Same primary resumes only an evidenced approved workflow;
    new primary adopts exact scope; missing/ambiguous/lost local evidence returns to gate.
12. Align native permissions/discovery/commands, team skill, loops, owner/artifact docs and active
    root/scaffold instructions with all contracts. Effective inventory must include native-only
    Record skill. Prepare correct future eight-role delivery; do not make planner a valid live owner
    before it ships. Nine roles authorized includes unbuilt tester, whose historical ordinal and
    authorization stay intact. Keep static-grant/prompt-trust/shell-bypass limits honest; no OS
    sandbox or structural approval-wall claim. Update affected script coverage only within owner
    test-authoring rules; execute no tests or activation without separate consent.

## Verification steps

1. Trace design §§6–9 payloads/entry matrix and §12 criteria to source/diff and independent review:
   every native path, inline and non-source included, reaches planner; ownership/grants/dispatch are
   one coherent replacement. No unsupported standalone-Claude feature work or legacy deletion.
2. Inspect exact writer boundaries: Draft/review read-only; Record plan/append-only planning records
   only; implementation worklog and reviewer/coder ledger ownership intact. Primary validation
   compares original plan, full review and actual decision, computes on-disk pointer and stops on
   mismatch/failure. Source approval marker is distinct from Record artifact authorization.
3. Enumerate future authorized checks for exact bytes, newline/Unicode fidelity, stale hashes,
   symlinks, identical/conflicting retries, rejection with older plan, interrupted two-file update,
   local-store loss, wrong primary, scope revision and plan-only/no-folder cases. Record unrun checks
   as unverified; do not call text inspection behavioral proof or hashes proof of consent.
4. Inspect depth/cycle/role/permission and review-policy paths against accepted design; preserve live
   owner relay, independent review/hostile evidence, explicit opt-outs/partial flags and no premature
   close with required verification missing. No planner source, self-approval, vault or mover grants.
5. Retained tests remain paused under the owner's 2026-11-11 ruling. New test files/cases require
   applicable owner approval; runs/live probes/registry refresh/installation/activation require
   separately explicit scope under `0549` (or a separately quoted owner authorization), never
   inferred from implementation approval. Report source-ready versus installed/verified honestly.

## Notes

- **Depends on:** 0547
- **Blocks:** 0549
- **Placement/knock-on:** Backlog, unranked. This task waits on `0547` on the Backlog board;
  `0549` waits on this task on that board. No existing sprint dependency changes (checked).
- **Split rationale:** role/procedures/helper/permissions/all-path dispatch/record validation are a
  single usable replacement. Splitting ownership removal from replacement routing would leave an
  unsafe gap; activation/evidence is independently scoped after the complete source slice.
- **Bootstrap:** current coder prepares a separately owner-approved implementation plan. Do not
  spawn or assign work to unbuilt planner or imply that design acceptance activates a role.
- **Overlap/keep-outs:** `0345` native Plan=Build-role limb is replaced by ADR-063's new contract;
  existing task records remain unchanged. `0387` mechanism stays open. `0543`–`0545`, stopped
  Claude checks, paused Sprint 12, prior rulings, denied edits and evidence gap are not resumed,
  repaired, waived, cancelled or closed. No wiki writes, commits or pushes.
- **Filed 2026-11-12** by spawned producer from accepted source design/ADRs, not an implementation
  or activation authorization. Historical wiki planning defaults do not override ADR-062/063.
