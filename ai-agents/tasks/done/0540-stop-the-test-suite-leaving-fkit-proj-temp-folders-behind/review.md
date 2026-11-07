# Review — 0540

Task: ai-agents/tasks/done/0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind/brief.md
File(s) under review: test/orphan-cleanup.test.js; test/dual-home-parity.test.js; test/dual-home-parity-exceptions.mjs; ai-agents/knowledge-base/conventions/dual-home-parity.md
Status: closed-out
Coverage: both reviewers measured — primary node --test test/dual-home-parity.test.js exit 0 (9/9); fresh leaf node --input-type=module -e mechanism probes exit 0 (leaf-reported); full-suite evidence remains inherited.

## Reviewer findings

| # | Round | Sev | Location | Claim |
|---|-------|-----|----------|-------|

### Round 1 — implementation review, 2026-11-04

Scope: explicit task key 0540; original baseline 20813ecb23974af0f6feac7404b0b5a8a1f4608a to current named files, including committed orphan fix at HEAD 1767a47b9db50f3949789636c3e0b513950e7368. No prior implementation ledger exists. Plan reviews are not implementation passes.

Primary source pass: no confirmed source defect found. Verified all three allocations now enter existing module teardown before seed/assert/await, permission restoration unchanged; exact-basename metadata classification checks both counterparts before exceptions/descent, retains both when either is tracked, shares context between normal walks and prune collectors, preserves exception and promotion semantics. Acquisition is repository-wide/NUL-delimited with lexical absolute paths and fail-closed Git handling. Existing synthetic bodies cover both mixed-tracking directions, custom-root acquisition, near misses, type/error handling. Exception bytes from typedef onward unchanged.

Primary execution: node --test test/dual-home-parity.test.js exited 0, 9/9 pass, 0 fail/skip, 165.197792 ms (existing MODULE_TYPELESS_PACKAGE_JSON warning). Current SHA-256 values match every parity-verify-audit hashesAfter entry, including all four source paths, harness/notice, original plan/amendment, plan-review and index. git diff --check exited 0. No full-suite or intentional failure-probe rerun by this reviewer.

Inherited validation: parity-normal-full-20261104-verify.json records actual npm child exit 0, 971 tests/40 suites, 970 pass/0 fail/1 existing optional benchmark skip, 76.271373959 s runner/76.432489792 s wall. Four prefix sets 34/1/1/0 unchanged; all original 28 plus six diagnostic project survivors and initial stub/argv retained. Build/failure audits retain baseline +3/full and +3/focused attribution, fixed 23/23 and both detected/restored deliberate failures. These are inspected worker evidence, not reviewer execution.

Material acceptance limit: approved idle-Mac condition remains UNPROVED (load 17.20 to 24.99, peak 29.85). Busy-machine green under 120 s is not idle-Mac acceptance. No waiver, closure or merge authorization. No crash/SIGKILL/abrupt-exit guarantee; cleanup remains best effort. Non-atomic Git/type observations are an explicitly approved plan limit, not a security wall.

Approval grounding: plan-review.md § Attempt 1 quotes actual 08:09:11 UTC fixture-plan approval; § Attempt 4 quotes actual 09:28:16 UTC exact revision-3 parity amendment approval, both 2026-11-04 interactive fkit_roles.fkit_ask_owner in root lead. Historical PROPOSED bytes remain unchanged by design. Original NoParity scope is superseded only for that amendment. CONTRIBUTING/ADR-057 key list and growth stop checked; no new test file/prove-red case. Prior planner X1 issues resolved in actual code; not reused as source findings.

Final recommendation: ✅ Ready to merge (validation-gated) — no open confirmed source defects; idle-Mac acceptance remains pending. This recommends source readiness only and grants no merge, waiver or closure authority.

Fresh adversarial pass: fkit_adversarial returned exit 0, timed out false, truncated false; scope-grounded clean verdict. Leaf reports successful write-free node --input-type=module -e behavioral probes covering acquisition-through-comparison, four tracking controls, prune promotion/drift and nonregular rejection. No suite ran in that pass. Its initial registration-count probe failed by counting regex .test() calls; corrected anchored counting passed (23 orphan/9 parity), independently corroborated by the primary. A heredoc was sandbox-denied; a read-only replacement succeeded. Neither event is a source defect or an unavailable review.

Provenance: primary fresh fkit-reviewer (Codex), configured/requested gpt-6.1-sol from current model settings; exact serving identity unavailable. Fresh leaf dispatcher labels Model and Model requested gpt-6.1-sol; leaf explicitly reports observed serving identity unknown. Both passes configured for the same model; actual serving-model diversity unknown. A different model is recommended for a broader second opinion.

Verification after leaf: primary independently checked raw Verify prefix sets and initial preservation, actual full-child exit/totals/duration, both restoration records, baseline-to-current orphan patch equality with approved-source-diff.patch, and parity patch equality with parity-build.diff. Anchored test registrations unchanged: orphan 23/23, parity 9/9. No open defect/frontier finding or missing-test suggestion. No prior accepted-residual rows to dedupe. No new residual accepted without owner disposition.

Re-litigates settled decisions (suppressed): none raised by either pass. The approved paired metadata policy, original fixture scope, non-atomic observation limit and normal-completion-only cleanup limits remain bounded approved decisions, not new defects. ADR-057 growth-stop/key-list and ADR-042/061 reporting conditions did not require a new finding.

Convergence: both implementation passes converge with zero confirmed source defects, not a residual loop. Recommend source-review handoff to Process-review while leaving acceptance/status in-review. An evidenced idle-Mac run or separate actual owner disposition remains necessary before full acceptance/closure; no waiver is inferred. No owner judgment on a novel finding is needed. Do not repeat completed probes/full suite without a new concern; any later idle measurement belongs to the driver's remaining acceptance gate. Old shared-temp folders remain untouched; only the owner may choose manual deletion when no tests run.

Checks skipped by primary: full npm test, deliberate failure probes and orphan focused suite (existing hash-matched evidence sufficient; no new concern); test:prove-red, test:release, duplicate test:docs, builds/lint/install/native/network (unmapped/out of scope). Source, approved records, Coder response, wiki, lifecycle and index were not edited.

### [adversarial] Verbatim fresh leaf return

> Role: fkit-adversarial-reviewer
> Runtime: codex
> Model: gpt-6.1-sol
> Model requested: gpt-6.1-sol
> Exit: 0
> Timed out: false
> Truncated: false
> Prompt: /Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/consult-adversarial-reviewer-c3af876e-93f3-4e7a-ae45-fe6fd65e9918.md
> 
> No significant implementation issues found across the four scoped paths against `20813ecb23974af0f6feac7404b0b5a8a1f4608a`, including the committed orphan fix.
> 
> Inherited Verify only: exit 0; 971 total, 970 pass, 0 fail, 1 skip; 76.27s. All four prefix sets preserved. **Idle-Mac acceptance remains UNPROVED**: load 17.20→24.99, peak 29.85.
> 
> Coverage self-assessment — fresh adversarial pass; configured/requested model `gpt-6.1-sol`, observed serving identity unknown. Inspected source, approvals and evidence. Executed write-free `node --input-type=module -e` probes: exit 0 for acquisition-through-comparison, four tracking controls, prune promotion/drift and nonregular rejection; hash/baseline checks passed. Initial registration-count probe failed because its regex counted `.test()` calls; corrected probe passed, confirming unchanged 23/9 registrations. Shell heredoc was sandbox-denied; read-only replacement succeeded. No suite execution, edits or delegation.
> 

## Coder response

| # | Verdict | Defect / Frontier | Action | Status |
|---|---------|-------------------|--------|--------|

### Process-review round 1 — 2026-11-04

**Acceptance pending: idle-Mac condition UNPROVED.** Source review converged with zero confirmed findings. This is not a waiver or task/producer close authorization. Header remains `Status: in-review`; reviewer-owned Coverage and Reviewer findings remain exact.

Method execution (all steps, no invented finding rows):

- **0 — Open/settled decisions.** Explicit 0540 resolves uniquely to this existing task-folder ledger. Accepted residuals: empty. Loaded scope decisions ADR-019/032/055 (bounded standing approval, trust not proof), ADR-027 and current parity convention (authored parity, approved metadata amendment), ADR-034 (work-product close bar), ADR-042/061 (actual execution, model limits), ADR-057/CONTRIBUTING (growth stop, key list, mapped checks, idle-Mac budget). Honored each relevant Re-raise-only-if condition. Source/work-product timing evidence is still pending; ADR-034's own-record residual bar supplies no idle waiver.
- **1 — Novel IDs.** Reviewer table has zero rows; Coder table has zero rows; novel IDs `[]`, prior dispositioned IDs `[]`. Plan-review X1 labels are not implementation findings. Narrative timing/provenance limits stay visible and are not fabricated R IDs.
- **2 — Loop check.** Settled list: approved paired exact-name/regular/neither-tracked metadata policy; three-call fixture ownership scope; non-atomic Git/type observation limit; normal-completion-only/best-effort cleanup; declared-approval trust; ADR-057 growth/key-list rules; ADR-061 usable same-model review. None was re-raised; suppressed-as-settled IDs `[]`. No re-raise condition demonstrated, no closeout row needed.
- **3 — Verify/severity.** No novel claim needs a verdict or severity; severity derivation is not applicable, never inherited. Read original-baseline four-file patch and full classification/walker/collector/comparison flow, allocation/teardown and permission restoration. Current protected hashes match Verify, including source, harness/notice, approved plans, plan-review and index; approved orphan and parity patches match evidence exactly. Inspected raw measurements and independently recomputed exact set preservation and both probe restorations. This worker executed read/hash/patch/set/restoration checks and `git diff --check` (exit 0); it ran no test suite. No new defect discovered or claimed.
- **3.5 — Classification/regression.** Defect IDs `[]`; frontier IDs `[]`; missing-test suggestions `[]`; regression/oscillation IDs `[]`. No proposed fix can recreate a prior finding because none is proposed. ADR-057 missing-test/key-list and no-new-file rules checked; unchanged test registrations and existing evidence require no new test or prove-red case.
- **4 — Verdict rows.** Zero novel findings means zero CORRECT/PARTIALLY CORRECT/INCORRECT/INCOMPLETE rows; the prescribed response table remains empty. No synthetic `blocked` row for an acceptance criterion, and no made-up severity.
- **5 — Summary/convergence/gate.** Summary table empty; suppressed list none; required code changes none. Both implementation passes converge on no confirmed source defect, not re-litigation. Recommend end source-fix iterations; return the outstanding acceptance choice to the actual owner through the driver. ADR-055 standing approval would cover only verified CORRECT mechanical/localized in-plan fixes; none applies. Acceptance waiver/judgment is not covered.
- **6 — Apply/status.** Applied no source fix, no obvious-winner call, no accepted residual. No owner disposition permits treating idle acceptance as settled. `Status: in-review` retained because the explicitly approved work-product validation condition remains open; no closed-out/full-acceptance claim. Producer-only lifecycle gate remains future. No staging/commit/push or lifecycle action.
- **7 — Final record.** Coder method record only; no finding rows or residuals added. Reviewer header/Coverage/findings untouched. Full result and NEEDS-DECISION are returned to the caller, including model/execution limits and concrete owner options below.

Validation evidence inspected, not rerun: baseline full exit 1 (971/969 pass/1 parity failure/1 skip), +3 projects; baseline orphan exit 0 (23/23), +3; fixed orphan exit 0 (23/23), no growth. Structure hand probe exit 1 (971/968 pass/2 fail/1 skip: injected failure plus historical parity red); orphan hand probe exit 1 (23/22 pass/1 injected fail); both no growth and exact restoration. Latest Verify actual `npm test` exit 0: 971 total, 970 pass, 0 fail, 1 existing optional benchmark skip; 76.271373959 s runner / 76.432489792 s wall, 2026-11-04T09:39:38.404Z–09:40:54.995Z. Four default-temp exact sets unchanged: project 34, stub 1, argv 1, convergence 0; all 28 original plus six diagnostic projects and original stub/argv preserved. Default spec reporter, not TAP. Load 17.20→24.99, peak 29.85: busy-machine timing only; idle condition unproved. Historical parity failures are retained, not erased or silently counted green.

Coverage retained: primary fresh actual fkit-reviewer executed `node --test test/dual-home-parity.test.js`, exit 0, 9/9, 165.197792 ms (existing MODULE_TYPELESS_PACKAGE_JSON warning). Fresh independent fkit_adversarial leaf usable, exit 0, no timeout/truncation; leaf-reported write-free Node mechanism probes exit 0, no suite. Its initial count probe error was corrected; sandbox-denied heredoc recovered by read-only replacement. Both measured narrow mechanisms; neither reviewer executed full npm suite. Full-suite/probe evidence above is inherited Verify/Build execution, independently inspected here. Plan reviews are not implementation passes.

Both passes used the same model. A different model is recommended for a broader second opinion. Configured/requested identity for each: `gpt-6.1-sol`; actual observed serving identities and serving-model diversity unknown. Usable second pass, no missing/unusable-pass partial flag; no claim of model diversity or full-suite reviewer coverage.

**NEEDS-DECISION — owner acceptance choice, not a source finding.** Recommend one bounded quiet-window measured normal `npm test` with default-temp exact sets, protected hashes, unchanged total/skip set and evidenced idle Mac; no repeat deliberate failures or repair authority. Do not start merely on elapsed time: inability to establish idle conditions returns pending. Alternative: owner explicitly accepts the existing busy-machine timing for Task 0540's timing criterion only, recording idle unproved, without changing the global budget, source policy or granting closure. Or leave acceptance pending and run nothing. No option changes placements/dependencies; checked brief and Sprint 15: 0540 depends on nothing/blocks nothing, order only; no new task waits on Sprint 15. Any later producer close remains a separate driver handoff after requirements are met.

Checks skipped: no repeat npm/focused/failure suite (hash-matched completed evidence, no new source concern); no test:prove-red (no mapped changed source/case), test:release (no release tool), extra test:docs (duplicate), build/lint/install/native/account/model/network checks (unmapped/out of scope). Skipped is not passed. No crash/SIGKILL/abrupt-exit guarantee. Old shared-temp folders untouched; only owner may choose manual deletion when no test run is active.


### Process-review final acceptance disposition — 2026-11-04

**DONE — source review and remaining 0540 acceptance satisfied under the new owner ruling; review Status: closed-out.** No source defect found, finding row invented, fix applied or residual accepted. Task/sprint closure remains a later producer-only action.

Actual new owner ruling, root interactive `fkit_roles.fkit_ask_owner` typed comment, 2026-11-04, recorded **11:19:31 UTC**, verbatim:

> Remove any time-restrictions or idle-only restrictions for running tests. We spend more time on those things than on work itself.

This is an actionable typed owner instruction relayed by fkit-lead, not an explanation request or unselected option. Relayed approval is trusted driver prose, not independently verified owner-channel proof (ADR-032/055). It supersedes the prior time/idle conditions, including the 09:59:34 UTC conditional quiet-window ruling, for remaining 0540 acceptance. Test timing and idle-only gating are removed; no new suite or quiet-window precheck is required. This records the policy change without rewriting historical plan/amendment bytes, global source policy, past measurements or prior pending decisions. It does not establish an idle Mac. Earlier references to pending timing/idle acceptance in this ledger remain historical and are superseded by this dated Coder response.

Method execution, all steps:

- **0 — Open/settled decisions.** Explicit task-id 0540 resolves to this existing ledger. Accepted residuals remain empty. Loaded prior responses, worklog, measurement/restoration/verification audits and latest quiet-window precheck. Grounded scope in ADR-019/032/055 standing approval and audit obligations, ADR-027/current paired metadata convention, ADR-034 work-product close bar, ADR-042/061 execution/model reporting, ADR-057/CONTRIBUTING growth stop/key list/check mapping. New owner ruling supersedes the prior timing/idle gate; other scope and safeguards remain.
- **1 — Novel findings.** Reviewer IDs `[]`; prior Coder IDs `[]`; novel IDs `[]`. No new finding was supplied or discovered. Prior planner X1 labels and the owner policy change are not source findings.
- **2 — Loop check.** Accepted residuals `[]`; suppressed-as-settled IDs `[]`. No paired-metadata-policy, ownership-scope, normal-completion, non-atomic-observation or declared-approval decision was re-raised; no relevant Re-raise-only-if condition demonstrated.
- **3 — Verification/severity.** No novel claim or severity to assign. Fresh read/hash/patch checks confirm current four-source-path bytes, notice/harness, index, approved plan/amendment and plan-review match the full-green Verify and latest precheck protected hashes. Approved orphan patch against original baseline and parity patch match evidence exactly. Independently recomputed raw full-run exact-set preservation, unchanged total/skip set and current exact restorations of both intentional probes. `git diff --check` exit 0. These are this worker's read-only checks, not fresh test execution.
- **3.5 — Classification/regression.** Defects `[]`; frontier moves `[]`; missing-test suggestions `[]`; regression/oscillation `[]`. Timing criterion removal is an explicit owner policy change, not a defect verdict, manufactured residual or inferred idle proof. No source fix proposed.
- **4 — Verdict rows.** Zero findings, zero verdict rows. Existing Coder table remains empty; no synthetic CORRECT or blocked row and no severity.
- **5 — Summary/convergence/gate.** Finding-summary table has zero rows; suppressed list none; code changes required none. Both implementation passes converge on zero confirmed source defects. Standing plan approval replaces the per-round fix gate only for verified CORRECT, mechanical/localized in-plan changes; none applies here and this unit authorizes no source writes. The explicit new owner ruling resolves the sole outstanding acceptance condition. Recommend closeout without another suite or review/consult.
- **6 — Apply/status.** Applied no fix; obvious-winner calls none; new residuals none. Set only header `Status: closed-out`, because no work-product blocker remains under the current owner instruction and reusable full-green evidence. Reviewer findings and Coverage preserved byte-for-byte; original approval/plan/amendment/plan-review and historical evidence unchanged. No staging/commit/push, lifecycle move or wiki/global-policy edit.
- **7 — Final record.** Appended this disposition and worklog decision log; added sanitized `evidence/process-review-final-disposition-20261104.json`. Return DONE to driver, recommending the separate producer handoff. Review closeout is not task/sprint closure, owner verification, merge or commit authority.

Reusable inherited verification: actual `npm test` child exit **0**, 2026-11-04T09:39:38.404Z–09:40:54.995Z, **971 total / 970 pass / 0 fail / 1 existing optional benchmark skip**, unchanged baseline total/skip set. Default spec reporter, not TAP. Runner **76.271373959 s**, wall **76.432489792 s**; Node v24.13.0, Darwin 25.2.0, 14 logical CPUs, canonical default temp. Four exact before/after sets **34/1/1/0**, zero new survivors/removals; all original 28 projects, six diagnostic project survivors and original stub/argv preserved. Latest quiet-window precheck launched **zero tests** and did not prove idle. Historical full-run load 17.20→24.99, peak 29.85 remains busy-machine evidence; neither time nor idle gates acceptance following the quoted ruling.

Historical failures remain intact: baseline full 971/969 pass/1 parity fail/1 skip with +3 projects, baseline focused 23/23 with +3, fixed focused 23/23 with no growth; full structure hand probe 971/968 pass/2 fail/1 skip (injected plus historical parity failure), focused orphan probe 23/22 pass/1 injected fail, both no growth and exact restoration. Earlier restored normal parity-red attempt and all partial/sandbox/probe errors remain historical, not relabeled green. No old folder or metadata deleted.

Coverage unchanged: primary reviewer executed parity **9/9**, exit 0 (existing MODULE_TYPELESS_PACKAGE_JSON warning); usable fresh independent leaf reported successful write-free Node mechanism probes, exit 0, no timeout/truncation, no suite. Leaf's initial registration-count probe error was corrected; denied heredoc recovered through read-only replacement. Full-suite/failure-probe execution is inherited from Build/Verify; neither reviewer nor this worker ran the full suite.

Both passes used the same model. A different model is recommended for a broader second opinion. Both configured/requested `gpt-6.1-sol`; observed serving identities and serving-model diversity unknown. No missing/unusable-pass partial flag is warranted.

Limits retained: teardown covers observed normal runner completion, not SIGKILL/crash/abrupt exit or pre-return allocation failure; cleanup remains best effort. Git/type observations and sampled process evidence are non-atomic, not a security guarantee or continuous activity proof. Old shared-temp folders remain untouched; only owner may choose manual deletion when no tests run. No new architecture/scope/placement/dependency decision; no new wait introduced.

Skipped: repeat full/focused/failure suites (completed hash-matched evidence, no changed source/new concern); quiet-window precheck (gate explicitly removed); prove-red (no mapped path/case), release tests (no release tooling), extra docs (duplicate), build/lint/install/native/account/model/network (unmapped/out of scope). Skipped is not passed. Global policy inventory/edit is outside this unit.

Read-only wiki grounding: testing/verification and review/model-diversity systems, relevant-checks task, ADR-057/061. Note: 12 commits touched `ai-agents/` since wiki sync `185ac5e07e918c089ed3afd23496587315342000`; current source/runtime and new owner ruling govern changed facts. Wiki lacks current 0540 evidence; any ingest belongs to the wiki role.

## Accepted residuals (shared, do-not-re-litigate)
