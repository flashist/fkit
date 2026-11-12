# Native fkit-planner and task-planning ownership transfer

- **Date:** 2026-11-12
- **Status:** design accepted; implementation and runtime activation NOT authorized or performed.
- **Task:** [0546](../../tasks/backlog/0546-design-fkit-planner-and-task-planning-ownership-transfer/brief.md), design-and-decision only. No task/board status change is made by this report.
- **Decisions:** [ADR-062](../decisions/adr-062-native-opencode-only-branch-and-native-source-authority.md), [ADR-063](../decisions/adr-063-planner-owns-native-task-planning-and-post-decision-records.md).
- **Provenance:** consolidates this architect child's initial read-only survey and revised native-only specification. Owner acceptance reached the architect as a relay from fkit-lead, not a directly observed question exchange or a verified human signature.

## 1. Owner rulings and authority boundary

All four answers below: **2026-11-12, primary OpenCode fkit-lead session, question channel**, relayed verbatim by fkit-lead.

| Question / gate | Owner answer, verbatim |
|---|---|
| Which runtimes should receive fkit-planner and the planning transfer? | "Focus on OpenCode only, we're not supporting Claude anymore in this branch. Claude will be able to be supported only via OpenCode" |
| Transfer all task planning, or pilot only lead-driven work? | "All planning paths (Recommended)" |
| Who should save planning records after your actual decision? | "Planner after decision (Recommended)" |
| Final revised-design acceptance | "Accept design (Recommended)" |

The final presentation explicitly authorizes **formal design records and preparation of build briefs**, NOT source implementation, legacy-file deletion, runtime activation, model/provider changes, tests or resuming stopped checks. The full revised specification in the preceding architect reply is the accepted baseline formalized here. The first three answers are also recorded in `0546/brief.md`, §Context, "Owner scope rulings".

OpenCode-only is the branch's support policy, not a claim that the source cutover is implemented. Standalone Claude support is excluded, not staged for later. Claude-via-OpenCode does not select, require or ban any provider/model. Retained historical files are not supported runtime authority.

## 2. Verified current behavior, not future claims

Inspected during this design discovery on 2026-11-12:

| Evidence | Current behavior |
|---|---|
| `opencode/setup.mjs:17–24,78–87` | Seven native roles; ownership imported from `claude/skills-for-role.sh`; prompts derived from Claude agent bodies with native adaptations. |
| `opencode/setup.mjs:52–55,89–118` | Shared scaffold/procedure resources, native overrides, command generation from the Claude procedure directory. |
| `opencode/setup.mjs:61–77,125–126` | Native per-role skill/edit/delegation rules; wiki and hostile reviewer leaves; configured depth 3. Shell approval can bypass ordinary edit restrictions. |
| `opencode/skills/fkit-plan-task/SKILL.md:6–23` | Coder plans, draft goes in worklog, independent review defaults ON, owner gate and approval record follow. |
| `opencode/skills/fkit-sprint-ship-loop/SKILL.md:12–33` | Lead currently sends Plan to coder, relays approval and sends bounded source-authorized coder workers; incomplete verification/partial review withholds automatic closure. |
| `opencode/skills/fkit-task-ship-loop/SKILL.md:8–17` | Coder currently plans and persists plan/worklog, then implements and requests independent review. |
| `opencode/skills/fkit-review/SKILL.md:9–21,48–60` | Native reviewer obtains hostile child; runtime identity evidence is required; same/unknown/missing model is partial. Normal hostile coverage is reasoning-only. |
| `opencode/generate-manifest.mjs:11–34` | Native hashes retain history but current template input comes from Claude scaffold. |
| `install.sh:34–45,60–65,123–131,150–172` | Installer includes both trees, defaults to legacy launcher and advertises both runtimes. |
| `claude/fkit-claude.sh:90–161` | Existing updater preserves recorded install source/destination and refuses source-checkout self-update; behavior to preserve, not a command run here. |

These citations describe the inspected working tree, not a clean/committed baseline. Concurrent owner work already touched native setup, launcher, models, docs and native tests; build planning must re-read their current contents and preserve it. No test or live runtime probe was run for this design.

The wiki query used in the initial discovery lacks ADR-059–061/native-planner context; current source ADRs supply that context. At that query, seven commits touched non-vault `ai-agents/` since watermark `185ac5e07e918c089ed3afd23496587315342000`. That is a dated staleness observation, not a standing guarantee; wiki updates belong to fkit-wiki.

## 3. Goal, scope and non-goals

Separate task-plan authorship from implementation on **every native planning route**, with independent consultation/review and the live primary holding owner choices. Transfer planning, not product direction or authorship of architectural deliverables.

In scope for future implementation: native source authority, role/procedure registration, all-path dispatch, exact post-decision records, primary validation and native delivery/docs. This report and the accompanying ADRs implement none of them.

Out of scope: source implementation now; deleting/moving the legacy tree; wholesale migration of every retained helper; provider/model changes; runtime refresh/activation; tests; commits/pushes; lifecycle movement; vault writes; paused-task repairs or gate waivers. No structural approval wall is promised.

## 4. Native source authority and delivery boundary

| Accepted future canonical source | Contract |
|---|---|
| `opencode/roles.mjs` | Single native role/procedure registry, including common skills, leaf policy and artifact grants. No native ownership lookup in the legacy shell map. |
| `opencode/agents/fkit-*.md` | Eight native role prompts; no import/transformation of legacy agent bodies. |
| `opencode/runtime-contract.md` | Shared native approval, delegation and live owner-relay contract. |
| `opencode/skills/` | Native procedures override explicitly retained compatibility procedures. |
| `opencode/scaffold/` | Native overrides for active root instructions, task artifacts and owner vocabulary. |

Retain `claude/skills/`, scaffold templates, structure resources and selected helper scripts only as explicitly documented compatibility resources until separately migrated. Do not maintain a parallel standalone-Claude feature contract. The legacy role map and agent bodies cease to supply native authority after cutover; historical files remain.

Setup computes the **effective native-over-retained procedure union**. Commands and permissions derive from that inventory and the native registry. An unknown/unowned FKit procedure fails generation; it never receives a broad fallback grant. Initialization, heal snapshots and native manifest generation use **one effective template resolver**. Preserve prior manifest hashes, owner-edited configuration/knowledge and existing-project preservation behavior. The heal engine's internal `.opencode/fkit-resources/claude/...` layout may remain; renaming it is unnecessary scope.

Supported installed entry points become `fkit [role]` and alias `fkit opencode [role]`, both native. Explicit `FKIT_RUNTIME=claude` refuses with an actionable unsupported-runtime message. Preserve normal native flags, option values, literal `--`, model overrides and session-resume behavior. No legacy CLI fallback.

The supported runtime-neutral updater preserves recorded repository/ref/share/bin and source-checkout safeguards. Extract/reuse that behavior under native delivery without entering the legacy role launcher. Installer sanity-checks native entry files, packages native resources AND retained dependencies, and removes standalone-Claude prerequisite advertising. No automatic deletion of existing project `.claude/`, settings, knowledge or historical source files is authorized. Existing model choices remain; planner inherits the team model/effort, not hostile defaults.

## 5. Role and procedure ownership

| Role | Authority |
|---|---|
| Planner | Execution plans, planning consultations/revisions, exact approved plan and append-only planning records. |
| Lead | Owner-facing orchestration, complete plan presentation, live decisions, record validation and bounded implementation dispatch. |
| Coder | Read-only feasibility advice; exclusive source/test implementation; implementation worklog/decision log and coder review responses. |
| Architect | Design/ADR consistency advice and approval; its own architectural deliverables. |
| Producer | Requirements/classification advice and approval; briefs, placement, product/sprint planning and lifecycle. |
| Reviewer | Independent plan/code evaluation; hostile pass, runtime identity and coverage evidence. |
| Wiki | Deep read-only planning lookup; exclusive vault maintenance only as a separate authorized assignment. |

Transfer `fkit-plan-task` exclusively to planner; add planner-owned `fkit-record-plan`. Planner also receives `fkit-query`, `fkit-team`, `fkit-dumb-down`, `fkit-open-questions-interview`. Task ship-loop/process-review procedures stay coder-owned; sprint loop stays lead-owned. Other procedures retain their owners.

Planner has ordinary research and named-role consultation tools. Static edit grants cover only planning artifacts; no source, brief, worklog, implementation-review ledger, sprint-board or vault authority. Draft/Record timing is a prompt contract, not dynamic permission elevation. Approved shell access can bypass ordinary edit restrictions; this is not an OS sandbox.

For non-source tasks, **Plan is planner; Build is still the producing skill's owning role**. The architect's design or producer's product decision is not silently made by planner. Source Build remains coder-only. Verify/Review/Process-review/Close and vault-pipeline exclusions remain as governed by ADR-044 and later decisions. Non-coder writes retain their own role-specific approval requirements; never substitute the coder source marker for them.

Current count remains **seven callable/shipping roles** until implementation. Planner is the future eighth shipping native role. With planner authorized here and ADR-028's tester authorized but unbuilt, nine roles are authorized in total. Tester authorization remains intact; historical "eighth" wording is not rewritten. Planner becomes a valid task owner only when its role ships.

## 6. Contracts: Draft, Record and source authorization

### 6.1 Draft — no writes

```text
FKit planning assignment: v1
Phase: Draft
Caller: <primary role and session ID>
Identity: <task ID + brief path | inline request ID>
Intent: <plan-only | requested implementation workflow>
Review policy: <ON default | explicit owner opt-out + origin>
Chain / depth: <actual chain and native hop budget>
Scope: <complete request and constraints>
Owner rulings: <actual quotations, dates and channels, if any>
Restrictions: no files, source, tests, lifecycle or wiki maintenance
Return: full plan; review record; limits; NEEDS-DECISION if needed
```

Draft carries no coder source-write marker. Read brief/wiki/source; resolve dependencies, builder, acceptance criteria, realistic failure cases and proposed checks. Consultations and review write no files. Open choices return `NEEDS-DECISION {question, options, recommendation, context}` with at most three options; only the live primary asks the owner and waits. Workers end their bounded assignment and resume only with a new assignment carrying actual answers. Silence, timer expiry, a question typed into a dialog, "Explain more", agent verdicts and unrelated prior approvals are not consent.

### 6.2 Record — distinct artifact authority

```text
FKit planning-record authorization: v1
Phase: Record
Caller: <live primary role and session ID>
Identity / attempt: <task or inline identity; unique attempt ID>
Decision: <approved | rejected>
Owner decision: <verbatim answer; date; channel>
Presented plan: <complete exact text>
Approved plan: <complete exact text, approved decisions only;
                absent on rejection>
Review record: <complete returned reports, dispositions and limits>
Authorized paths: <explicit plan.md and plan-review.md paths>
Expected prior state: <absence or hashes of existing target files>
Restrictions: no replanning, source, worklog, lifecycle or vault writes
Return: actual paths, attempt ID, hashes, byte counts and write outcome
```

This marker is NOT the coder marker. Design acceptance establishes the future standing record policy: after actual approval/rejection the primary explicitly issues Record, normally without a second owner dialog merely to save the decision. An owner "do not save" instruction overrides it. A primary planner executes a separate bounded Record phase in its own session, not a self-spawn. Planner does not redesign during Record.

### 6.3 Coder Build / Process-review

```text
Caller: fkit-lead <or its fkit-sprint-ship-loop driver identity>
Worker role: Build | Process-review
Identity: <task ID or permitted inline request identity>
Approved plan: <complete exact text; never summary/reference-only>
Owner approval: <verbatim answer; date; original live channel>
Planning attempt: <validated approved attempt ID>
plan: <path>/plan.md  blob <git hash-object>
Record validation: <paths and hashes actually checked this turn>
Restrictions: approved scope only; no commit/push authorization
```

Retain the original declared-approval caller, full scope, real owner approval and worker-role requirements; native handoffs also carry the validated attempt and pointer. Planner is NOT a new source-driving caller. A primary coder implements directly after its own actual owner approval and successful Record validation; it fabricates no delegated marker. Plan-only requests never automatically start implementation. Process-review retains verified-CORRECT, mechanical/localized, in-plan fix discipline and the existing decision-log obligation; judgment calls stop.

## 7. Records and deterministic validation

| Artifact | Writer / timing |
|---|---|
| `<task-folder>/plan.md` | Planner Record, approval only; exact approved source boundary. |
| `<task-folder>/plan-review.md` | Planner Record; append-only after approval/rejection, including explicit review opt-outs. |
| `.fkit/planning/<request-id>/plan.md` | Planner Record, inline approval only. |
| `.fkit/planning/<request-id>/plan-review.md` | Planner Record, inline decision attempts. |
| `worklog.md` | Coder after implementation authorization; references approved attempt/hash. |
| `review.md` | Existing reviewer/coder sections; not a planner write target. |

Task planning records remain tracked task artifacts. Inline records are ignored machine-local state, not invented briefs/tasks/lifecycle objects. Ensure exclusion without overwriting owner ignore rules. A lost local store, including on another machine, supplies no recoverable approval evidence; return to the gate.

Each append-only attempt contains identity/unique attempt/originating primary; exact presented-plan snapshot and hash; policy/opt-out origin; classification, approver replies and independent reviewer/hostile reports with model evidence; adopted/disputed findings, revisions and limits; actual owner quote/date/channel; approved-plan hash or explicitly no approved plan. Keeping the presented text preserves rejection evidence and earlier versions when the latest approved `plan.md` is replaced. Review findings stay outside the approved plan carried to implementation.

Ship `opencode/skills/fkit-record-plan/record.mjs` with a planner-only write operation consuming the full Record payload and a read-only validation operation usable by any primary. Calling that read-only operation does not execute planner's owned write procedure. Requirements:

- Exact UTF-8 bytes; no summary, newline normalization or rendered additions to scope.
- Explicit target paths, task/request identity, expected prior hashes and symlink refusal.
- Unique attempts: an identical completed retry is idempotent; conflicting reuse refuses.
- Readback hashes/byte counts and nonzero failure outcome.
- Validation against the primary's ORIGINAL presented/approved bytes and actual decision metadata, not merely the planner's returned claims; validate review record payload and approved attempt too.
- Primary computes the plan pointer from disk after validation and carries full text AND pointer to Build.
- Mismatch, stale target, failed write or incomplete two-file update stops Build. Do not claim a transaction across two files. Torn state is reported for explicit recovery, not assumed safe.

Hashes establish byte identity, not human consent. Quotes/session IDs are fidelity/audit data, not an authenticated human principal. No Claude carry-check hook runs in native OpenCode. The primary must not replace missing original approval text with an LLM reconstruction and call it exact.

## 8. Entry coverage, decisions and resume

```text
lead/primary -> planner Draft -> independent consultations/review
            <- full plan, reports, limits, owner questions
primary -> owner: complete plan + actual approval/rejection
primary -> planner Record -> paths/hashes/outcome
primary: validate against original text + actual decision
primary -> appropriate producing role; source -> coder only
```

| Entry | Complete route |
|---|---|
| Lead conductor | Planner child; lead gate; planner Record child; lead validates; bounded coder/producing role. |
| Sprint loop | Same per eligible task; Plan and Build are siblings, not a nested coder loop. |
| Coder primary/session | Planner child; coder primary gate; planner Record child; primary validates; directly implements approved source scope. |
| Coder task ship loop | Same; loop remains coder-owned and primary-session driven. |
| Plain `/fkit-plan-task` from another primary | Command delegates to planner; current primary holds owner gate and dispatches Record; plan-only intent stays plan-only. |
| Planner dedicated primary | Draft plus independent consultation; owner gate; separate local Record phase, no self-spawn. |
| Inline request, any primary | Same planner ownership/gate with ignored local record paths; no invented task ID/folder. |

Dedicated planner returns a validated packet, not source-authorized coder work. Owner enters lead/coder primary and explicitly adopts/approves that exact plan there. Unchanged review need not rerun just because the primary changed. A primary change never turns saved records alone into live consent.

Inline lead Build may carry the full plan/local pointer. Stateful Process-review still requires a real task folder; do not manufacture one. Use the applicable ephemeral review path or return a producer/owner decision before entering a task-backed loop.

- **Rejected:** append attempt; no approved replacement. Leave any older `plan.md` unchanged and identify its older attempt; do not treat it as current approval.
- **Owner asks for changes:** planner resumes read-only Draft with the actual ruling; present the complete revised plan for approval. Disclose revisions after review as not re-reviewed unless the owner requests another pass.
- **Material scope changes in implementation:** stop; Draft -> owner gate -> Record -> validation before further writing.
- **Resume:** records restore context, not blanket consent. Same primary may resume an explicitly evidenced approved workflow; a new primary asks owner to adopt exact scope. Missing/ambiguous records return to gate.
- **Concurrency:** one writer per task/request. Record never overlaps Build, ledger updates or lifecycle moves.

## 9. Consultation, review and depth

```text
primary(0) -> planner(1)
              +-> coder / architect / producer / wiki(2)
              +-> reviewer(2) -> hostile reviewer(3)
```

Keep native depth **3**. Pass actual chains, scope and rulings. Never consult an invoker/ancestor, even in a fresh context. When coder is primary, planner cannot call coder back: primary supplies feasibility evidence, gaps return to owner. Architect/producer plan approvers remain read-only leaves for that assignment. Reviewer at hop 2 may launch the required hostile leaf at hop 3, not another consultation tree. Wiki and hostile reviewer remain leaves.

A too-deep planner returns `plan review incomplete — hop budget`; primary redispatches at supported depth. A child coder task-loop request returns routing to primary instead of creating depth 4. Named FKit agents only; no generic helpers or Claude/Codex CLI orchestration bridge.

Read simple wiki context through `fkit-query`; deep wiki consult is expressly read-only. It authorizes no ingest/lint/sync. Necessary maintenance becomes a separate primary-authorized wiki assignment.

Review remains ON by default on ALL native planning paths, including inline. Retain explicit launch/run/one-plan opt-outs, conflict handling, reporting and origin capture; never add/carry an opt-out unasked. Opt-out skips independent plan review only, not required scope decisions, owner approval or implementation review. A quoted switch inside a read document is not an owner request.

When review runs, retain classification: product/unclear -> producer AND architect approvals; code-only -> architect; dispute of code-only -> unclear. Approvals use APPROVE/CHANGES REQUESTED plus focused reasons; malformed replies are not approval. Keep the two-revision-round approver cap; unresolved disagreements return to owner. Reviewer independently evaluates the identified plan and obtains native hostile evaluation; planner never self-certifies that review. Preserve actual runtime identity evidence and partial flags for same/unknown/missing models or unusable output. Fresh context/configuration is not evidence of model diversity. Reasoning-only hostile coverage remains normal, not execution evidence.

Post-review edits identify the reviewed version and disclose changed coverage. Owner-requested changes are not silently called reviewed. Complete plan, classifications, reports, findings/dispositions and degradation flags reach owner before the gate. Partial review/required missing verification never authorizes automatic task closure.

## 10. ADR relationships and stopped work

ADR-062 amends ADR-061's alongside-runtime/native-source clauses for this branch. ADR-063 replaces the native planning/artifact clauses of ADR-019/020/032/055/056/059/060 and ADR-044 Decision 2, without rewriting their historical text. ADR-028's tester authorization is not revoked or renumbered. ADR-038's principle of skill ownership remains; the native Plan procedure now belongs to planner. Other Build/Process-review/lifecycle boundaries remain.

- `0345`: its Plan=Build-role/by-hand limb conflicts with the new native rule; Build/Process-review/vault boundaries remain relevant. Producer reconciles its scope separately; no edits or closure here.
- `0387`: no mechanism selected. Planner specialization plus bounded post-decision artifact grants is NOT a structural approval wall. That decision stays open.
- `0543`–`0545`: unchanged. Preserve paused Sprint 12, cancelled Claude checks, prior record-only/qualified-wording rulings and interactive evidence gap. No new dependency, waiver, denied-record workaround or close.

## 11. Delivery surface and bootstrap proposals

Future implementation touches new native registry/prompts/runtime-contract, Record skill/helper and native scaffold overrides; native setup/adaptation/union routing; all three planning/ship-loop procedures and team skill; native launcher and runtime-neutral updater; installer; effective scaffold resolver/native manifest; live/native task artifact and owner vocabulary documentation; active root instructions/PROJECT/architecture/README/CONTRIBUTING/package description/changelog; retained affected script tests.

Generated `.opencode/` profiles/procedures/commands/config/resources are outputs, not canonical edits. Registration must include the new native-only Record skill even though no legacy directory supplies it. Test actual permission matching for nested task and inline planning paths. Keep non-wiki vault denial and hostile leaf restrictions; no general source grant for planner.

Recommended producer brief split, **proposals only, no placement or existing dependency edits**:

| Unit | Proposed owner / prerequisite | Independently shippable outcome |
|---|---|---|
| A. Native authority/delivery boundary | Coder; after accepted 0546 records, separately approved implementation plan | Native registry and seven existing prompts, effective procedures/scaffold, native-default launcher/install/updater and truthful docs. Existing planning remains functional until B. |
| B. Planner all-path vertical slice | Coder; depends on A | Eighth role, both procedures/helper, Draft/Record/validation, every dispatch and coder handoff together. Never remove coder ownership before replacement routing works. |
| C. Authorized activation/verification | Producer to scope owner/assignment and consent; after B | Separately authorized registry/installed/live-path verification; truthful gaps, no assumed shipping result. |

Existing coder plans/builds bootstrap after explicit implementation approval; planner is not callable now. Build/Process-review authorship does not shift merely because this task is architect-owned. Preparation of briefs is authorized, but producer owns actual filing, dependencies, placement and movers. No existing task is newly blocked by this report.

## 12. Acceptance, risks and verification limits

Future-build acceptance:

1. Native authority no longer reads legacy agent bodies/ownership; effective procedure/template union is used consistently and unowned procedures fail closed.
2. Supported entries, install/update/package dependencies, generated discovery, docs/owner vocabulary agree on native-only support; user config/model preferences survive.
3. Every entry in §8 reaches planner, including inline and non-source plans; no coder/by-hand fallback hides retained planning ownership.
4. Draft/review writes nothing; Record requires its distinct full payload and targets only plan/append-only planning records.
5. Primary validation checks original text, actual decision metadata, complete review payload, expected state and approved attempt before any source-authorized handoff.
6. Exact bytes round-trip; stale writes, symlinks, conflicting retries, rejection and interrupted two-file writes fail safely. No transaction/consent-from-hash claim.
7. New-primary adoption, revision/resume/inline/no-folder cases follow §8; task-only Process-review constraint remains visible.
8. Depth-three delegation fits; ancestor cycles, generic helpers and concurrent writers do not appear. Wiki lookup causes no maintenance.
9. Default review, explicit opt-outs, independent approvals/reviewer/hostile identity and partial flags survive; required verification is not silently waived.
10. Source stays coder-only; producing roles own their deliverables; producer-only movers, agent-closed marker, vault exclusivity and no unrequested commits remain.

Main accepted tradeoff: a specialist owns the whole planning phase, but the extra cross-context Record handoff reintroduces copy risk previously avoided by driver writes. Deterministic comparison narrows that risk; it does not authenticate consent. Other accepted costs: a wider native-source/delivery change, retained compatibility dependencies, duplicate presented-plan snapshots, machine-local inline retention and a new-primary adoption gate. Review/tool discipline remains partly prompt-trusted.

**No additional owner design choice is open in this record.** Implementation details must stay within these contracts; a materially new decision returns NEEDS-DECISION rather than being settled by a worker.

**Not verified:** new role discovery/permissions, installed packaging/update, record helper, byte round trips, live delegation/question relay, model evidence for new plan runs, or any new behavior. No source was implemented. Tests are retained but execution remains paused by the 2026-11-11 owner ruling; design/build acceptance is not a test request. Future checks include registry/routing/model/config preservation, exact-record failure cases and installation behavior. New test files need owner approval where project rules require it; runs/live probes require separate authorization.

No runtime refresh, Claude/Codex launch, wiki write, task/board edit, lifecycle movement, commit or push belongs to this documentation unit. fkit-wiki should separately ingest this report and new/amended ADRs; it has not done so here.

## 13. Documentation recording evidence — 2026-11-12

ADR allocation inspected filenames on disk: no malformed names; highest existing number 061. Manual search for 062/063 claims under `ai-agents/` returned none before allocation. New records are ADR-062 and ADR-063; neither implements its decision.

Historical ADRs were clean at this unit's initial status inspection. Final `git diff --numstat` and `git diff -U0 | grep '^-' | grep -v '^---'` prove additions only against HEAD:

| Historical ADR | Added lines | Deleted lines | Annotated site |
|---|---:|---:|---|
| 019 | 11 | 0 | Decision 2, native planning/record flow pointer |
| 020 | 12 | 0 | After `0207`, explicit native writer/copy-prohibition replacement |
| 028 | 11 | 0 | One-line decision, ordinal/roster pointer; tester authorization stands |
| 032 | 11 | 0 | Decision 3, native Plan/Record/handoff pointer |
| 044 | 11 | 0 | Decision 2, native Plan-role replacement |
| 055 | 13 | 0 | Decision 3, native full-plan/quoted-approval/pointer handoff |
| 056 | 11 | 0 | Decision 6, native planning/review/record pointer |
| 059 | 12 | 0 | One-line decision, native replacement; provisional default retained |
| 060 | 12 | 0 | One-line decision, native replacement; old evidence/gates untouched |
| 061 | 20 | 0 | Runtime and role/source paragraphs, ADR-062/063 pointers |
| **Total** | **124** | **0** | Header metadata additions accompany the notes |

The deletion filter printed nothing. Four unintended whitespace changes were caught during the first diff inspection and restored before this final append-only proof. `git diff --check -- ai-agents/knowledge-base` printed no whitespace errors. A read-only inspection of the three new documents found **19 local Markdown links, zero missing targets** (file existence only, not heading-anchor validation). These are documentation inspections, not repository tests, behavioral verification or owner-consent verification. No permission denial occurred. No task/board/status edit or stub was made.
