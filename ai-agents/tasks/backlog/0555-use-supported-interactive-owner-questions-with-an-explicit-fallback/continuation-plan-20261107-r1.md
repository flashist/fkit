- **0555 — Use supported interactive owner questions with an explicit fallback: continuation draft, not approved.**
- Existing implementation is substantial; original Build handoff and final Verify packet are missing. No source repair is established by this planning pass.
- Required behavior and automatic live-display acceptance remain **UNVERIFIED / UNMET**. This plan grants no acceptance waiver.

# Frozen continuation plan — 2026-11-07, r1

## 1. Authority, scope and retained history

Task folder (T): `ai-agents/tasks/backlog/0555-use-supported-interactive-owner-questions-with-an-explicit-fallback/`.
Goal: complete an honest handoff, static verification and independent source review of the existing supported-interface/fallback implementation, preserving its exact historical approval and later shared changes.

The historical `T/plan.md` remains 9,675 bytes, SHA-256 `8e9e1fe76cb3797116d534e2fd69633ff2311748a4c38a030ed383308d607ca6`. It equals the frozen owner-revised draft. Actual historical approval: "- Approve complete plan (Recommended)", 2026-11-06, user chat in root fkit-lead, observed 10:34:39 UTC, recorded after Attempt 1 in `T/plan-review.md`. Earlier pending/unapproved labels are preserved historical text. X1 was separately accepted and ADR-060 recorded before that approval; do not repeat or alter that ADR work.

The 2026-11-07 owner instruction "Continue 0555" is relayed by lead; it does not approve this unseen continuation or renew spent stages. The current worker has no declared Build/Process-review approval marker. Its planning gate is instruction-enforced; no native plan-mode transition or runtime write wall is claimed.

Decision `0555-additional-plan-draft-r1`: question "For 0555 — Use supported interactive owner questions with an explicit fallback, authorize one additional plan-only drafting launch?" Exact actual answer: "Authorize one additional plan-only draft launch (Recommended)". Date 2026-11-07; channel actual interactive fkit_roles.fkit_ask_owner response, action accept, answered true, comment empty, observed by live root lead and relayed to this worker. This launch consumes that separate allowance **1/1**, beyond original drafting **2/2**. It authorizes only this new draft and associated unique planning evidence. No further drafting, source edits, Build/Verify retry, test execution, acceptance waiver or placement/dependency change follows.

This continuation changes no intended product behavior. Supported interactive Codex roots use the exposed fkit owner tool only with negotiated form support; supported Claude roots use native AskUserQuestion. Delegated/headless/adversarial roles return decisions. Missing/unsupported/failed interfaces use explicit fallback and real-answer waiting. Capability, exposure, eligibility, request acceptance, queueing, actual presentation, actual answer and applicable approval remain distinct.

## 2. Established implementation and outstanding evidence

Original Build and both Verify transports each record exit 1 and a zero-byte final role return. Preserve those failures without diagnosing their cause. No 0555 independent source review or review ledger exists at this inspection.

The 17 original source beforeimages and 17 Verify snapshots each match their own recorded hash maps. Current source matches the old Verify map at only **5/17** paths; the old 17/17 claim describes its original observation, not today. Ten other current paths equal 0556 frozen Build afterimages. Nine of their 0556 beforeimages equal the 0555 Verify snapshot; CHANGELOG additionally gained the test-pause entry before 0556. The two remaining root files differ from the 0555 snapshots only by the project-local test-pause section outside their managed blocks. No 0556 afterimage exists for those root files.

| Existing source path | Current attribution; proposed source action |
| --- | --- |
| `codex/server.mjs` | Matches 0555 Verify; retain root eligibility, negotiated-support advertisement and direct-call guard |
| `codex/owner-question.mjs` | Matches 0555 Verify; retain capability validation and pending ordinary/custom/cancel/error paths |
| `codex/materialize.mjs` | Matches 0556 afterimage; preserve composed runtime instructions |
| `codex/README.md` | Matches 0556 afterimage; preserve capability/fallback and acceptance limits |
| `claude/agents/fkit-lead.md` | Matches 0556 afterimage; preserve root-only owner interaction and answer waiting |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | Matches 0556 afterimage; preserve approval relay and independent decisions |
| `claude/skills/fkit-open-questions-interview/SKILL.md` | Matches 0556 afterimage; preserve actual-answer and explanation semantics |
| `claude/skills/fkit-plan-task/SKILL.md` | Matches 0555 Verify; preserve accepted Codex X1 and regular Claude distinction |
| `claude/skills/fkit-task-ship-loop/SKILL.md` | Matches 0556 afterimage; preserve X1, session boundary and later decision rules |
| `claude/scaffold/universal-rules.md` | Matches 0555 Verify; preserve supported-interface/fallback pointer |
| `claude/scaffold/ai-agents/knowledge-base/conventions/asking-the-owner.md` | Matches 0556 afterimage; preserve full asking rules |
| `ai-agents/knowledge-base/conventions/asking-the-owner.md` | Matches 0556 afterimage; preserve byte equality with scaffold |
| `claude/structure-manifest.tsv` | Matches 0556 afterimage; inspect retained rows and current convention digest as data |
| `CLAUDE.md` | Preserve existing managed block and added owner pause outside it |
| `AGENTS.md` | Preserve existing managed block and added owner pause outside it |
| `CHANGELOG.md` | Matches 0556 afterimage; preserve both tasks' entries and intervening pause entry |
| `test/launcher-contract.test.js` | Matches 0555 Verify; preserve existing extended case and all test sources; do not execute |

No source, test-source, generated-copy, root-instruction, manifest or ADR modification is proposed by this continuation. Statically inspect `codex/fkit.mjs`, `codex/claude.mjs`, relevant materialization/initializer source and existing delivery captures as context; do not change or run them.

Historical evidence includes expected-red 1 test/0 pass/1 fail and three focused-green records of 2 tests/2 pass/0 fail; recorded syntax, manifest, initializer, delivery and whitespace successes; and the failed managed-block reserve audit (396 bytes free versus 400), later corrected in the retained images. These are dated records, not fresh execution or a complete Build preservation audit. Captured runtime instructions belong to the budget-corrected delivery run, not the complete-run snapshots; persisted initial delivery.json says exit 0, so do not invent an initial delivery failure.

Read retained logs beyond the stale checkpoint:
- Launcher: 75 tests, 73 pass, 2 fail; numeric child exit 1.
- Original filtered stdout: 954 tests, 924 pass, 29 fail, 1 cancelled, 0 skipped; final child exit/result JSON absent.
- Completion filtered stdout: 952 tests, 948 pass, 1 fail, 3 cancelled, 0 skipped; final child exit/result JSON absent.
- Prove-red stdout: baseline 0b red; 0c green; mutation 1 red; stops during mutation 2. No final gate/child result JSON.
Keep log summaries distinct from known final child status. Never infer overall success, complete mutation coverage or a source cause. Historical failures remain failures, even though all new execution is now prohibited.

## 3. Review and approval before continuation writes

Lead sequences fresh, bounded, no-write plan reviews: architect for feasibility/ADR consistency and producer for scope/acceptance, using the full frozen draft and both owner rulings below. Classification: **product change continuation**, because the underlying task changes delivered owner interaction. Then a fresh adversarial plan attack, then the remaining coder finding-check stage. Preserve the plan after the adversarial pass; relay findings verbatim with a separate coder confirmation/dispute and evidence.

This worker launches none of these roles. Its prompt contains no actual driver's plan-review switch line; a switch quoted in a historical checkpoint is not a new trigger. The root's continuing staged review requirement remains outstanding and must be carried by the live driver with applicable authority. Old R0 approvals and old X1 review do not review this continuation. If review requires another coder revision, stop for a separate drafting allowance; unused approver revision rounds alone grant no draft launch.

Before writing recovery artifacts, worklog or the approved continuation-plan file, root presents the full continuation and complete review record and obtains actual approval against this presented revision. After the actual owner decision, the driver appends its decision record to `T/plan-review.md` on approval or rejection; rejection authorizes none of those recovery, worklog or approved continuation-plan writes. Preserve historical `T/plan.md` and `T/plan-review.md`; append a new dated continuation attempt only after its proper driver gate. Record the new approved continuation separately as `T/continuation-plan-20261107-r1.md`, byte-identical to the approved frozen draft. Quote actual answer/date/channel/key in the existing driver/task record; do not copy the old approval as if it covered this new revision.

Plan approval and additional Verify permission are separate decisions. Approval does not renew Verify 2/2, and retry permission does not approve these document writes. No independent review result or unobserved form is owner consent.

## 4. Recover Build documentation, without fabricating a historical handoff

After continuation approval, lead may use the remaining original Build-stage launch, if its live spend audit confirms 1/2 used, for a bounded coder documentation-recovery worker. Carry the complete approved continuation and exact actual approval/date/channel, identify Build role, and explicitly forbid source/generated/index/lifecycle writes.

Create only these new task-owned files, under `T/evidence/continuation-20261107-r1/`:
- `recovered-build-report.md`: dated recovery report, provenance, missing original handoff, exact observed outcomes and all limitations.
- `artifact-manifest.json`: path, bytes, SHA-256, observed date and provenance for existing evidence and new recovery artifacts; keep mutable worklog/review separate from immutable evidence.
- `baseline.json`: current 17 source hashes, protected historical records/evidence hashes, selected frozen 0554/0556 records and existing index fingerprint; no settings/credential content or invented pre-Build index state.
- `0555-before-to-verify.diff`: reconstruct from all 17 real Build beforeimages to all 17 matching old Verify snapshots, labelled as recovered historical delta, not an original Build-generated final diff.
- `0555-verify-to-current.diff`: separate all current overlays, identifying 0556, root pause additions and pre-0556 CHANGELOG addition; never attribute all dirty HEAD changes to 0555.
- `current-source/`: freeze the 17 current named sources for later static Verify/review; no executable harness or generated-copy refresh.
- `preservation.json`: compare current recovery start/end protected fingerprints and every reported artifact change; state exact scope and any missing historical evidence.

Create `T/worklog.md` as a new dated continuation/recovery log. Clearly state original Build wrote no final worklog; recovered observations are made now. Include completed/remaining scope, inherited failures, skipped checks, approval provenance, stage spend and a decision log with `none` if no autonomous fix/obvious-winner call occurred. Do not populate the absent original `evidence/build/artifact-manifest.json`, `evidence/build/task-source.diff` or original Build report with backdated replacements. Retain old `evidence/build/`, `evidence/verify/`, beforeimages, partial logs and transport files unchanged.

Recovery yields a usable present-day review packet, not proof of the missing historical final Build audit or a successful historical worker return. If a required source snapshot cannot be established, record the gap and return; do not repair history by assumption.

## 5. Independent static Verify, requiring its own additional allowance

Original Verify is **2/2 exhausted**. Before launching any new static Verify worker, root must obtain separate permission for exactly one additional source-read-only Verify launch. The drafting allowance grants none. Until both continuation approval and this allowance exist, dependent Verify work stops.

The fresh coder Verify worker writes only `T/evidence/continuation-20261107-r1/verify/report.md`, `static.json`, `artifact-manifest.json` and `preservation.json` in that new Verify subdirectory. It independently checks the recovery report and both complete diffs, 17 captured source hashes, historical approval records, attributed overlays, evidence/status distinctions, convention equality, root managed blocks/owner text and manifest rows/digests as data.

Static checklist:
1. Trace server advertisement and direct invocation: supported eligible interactive root; unsupported/absent/malformed/URL-only capabilities; delegated/headless/adversarial denial.
2. Read handler paths for explicit-form and legacy empty-object support, ordinary answer without comment, separate custom text, exact custom return, cancellation/decline/interruption/invalid/empty/late results and pending cleanup. No preselection or accepted-but-unanswered response grants approval.
3. Inspect delivery/fallback instructions in both canonical homes, lead, loops, interview and materialization. Keep request/queue/display/answer/approval separate; do not invent a presentation receipt or repeatedly resubmit asynchronous requests.
4. Inspect X1 branches: actual direct Codex ON independent of owner-tool availability; regular Claude launcher plus native-tool condition; missing-line OFF, opt-outs, OFF precedence, file/quoted-signal ineffectiveness and worker-driver boundaries.
5. Preserve 0556's independent decision assembly, stable identity/scope, ordinary choices, partial/custom answers, explanation-turn stop and separate plan/retry gates. Inspect only interactions relevant to 0555; do not reopen 0556.
6. Read existing launcher-contract coverage, fixture-preservation intent and test guard placement without importing/discovering/running tests. No new test files, top-level cases or prove-red mutations.
7. Read initializer/materializer source and saved delivered captures; distinguish historically captured delivery from current canonical source. Generator/materializer equivalence and current installed-copy freshness remain unverified.
8. Run only scoped `git diff --check -- <17 named source paths and newly approved continuation documents>`; read recovered snapshot diffs too because an empty HEAD diff proves no historical change coverage. Parse JSON as data and compute hashes with standard-library file operations. No project module import or saved verification script.

Map affected paths to CONTRIBUTING's historical default functional/prove-red and manifest requirements. Record every execution requirement below as **"skipped — owner disabled test execution"**:
- standalone and focused `test/launcher-contract.test.js`;
- the historical approved filtered functional command and mapped `npm test` / `npm run test:docs`;
- the existing four-case `npm run test:prove-red` lane;
- protocol fixtures, discovery, smoke/behavioral probes, live form rendering/submission/cancellation, Claude/mixed live checks;
- initializer/materializer/disposable delivery checks, manifest generation/equivalence and any other saved verification or release dry-run.

Release tests are outside this task's changed release-tool scope and are also prohibited; none runs. Do not execute even a disabled command to establish refusal. No syntax/CLI invocation or project-code execution is needed by this static-only continuation. Historical seven suite exclusions stay historical; the new pause skips all execution, without turning omitted or failed checks into passes.

The Verify conclusion may say static checks complete within its recorded snapshot coverage. It must not say behavioral acceptance or full Verify passed. Missing original preservation proof, incomplete command exits, generator equivalence and host presentation stay explicit gaps.

## 6. Independent source review, then coder dispositions

After recovery and the permitted static Verify packet land, lead requests fresh reviewer-owned `fkit-stateful-review` for Task 0555 on the full recovered original delta plus its current composition. Use `T/review.md`, with reviewer-owned findings and accepted residuals, coder-owned response. Include the full approved continuation, original approved plan, all evidence/failure limits and both verbatim owner rulings.

Reviewer runs its primary static pass and its supported fresh read-only adversarial leaf via `fkit_adversarial`; coder never performs or labels its own inspection an independent review. Source-review passes are separate from plan attacks and 0556's completed review. No tests or probes in either pass. Relay verdict, complete findings table, suppressed items, convergence, owner questions and per-pass coverage/model provenance verbatim. If actual identities establish the same model, say: "Both passes used the same model. A different model is recommended for a broader second opinion." Otherwise say diversity unknown. Missing/unusable pass is partial; usable static passes remain reasoning-only coverage, never measured behavior.

Then a fresh coder loads `fkit-process-stateful-review` and completes its applicable steps 0–7, verifying each finding against code and evidence, classifying defect/frontier and recording decisions only in its owned section/worklog. This continuation approves **no source repair**. Any proposed source repair must first be actually established and returned with exact files, changes, rationale and required static follow-up for separate applicable owner approval and any needed launch allowance. An existing historical approval or the extra Verify launch cannot silently widen this scope.

For purely documentary finding corrections within these approved new recovery files, follow the actual Process-review standing-approval marker and mechanical/in-plan rules; without a valid applicable marker, use its normal explicit fix gate. Record every unattended correction and why it qualified; record `none` when none. Never edit reviewer findings or erase failed evidence. Necessary re-Verify/re-review launches remain bounded by surviving allowances; no automatic retry.

## 7. Acceptance and lifecycle boundary

Still unmet: supported real-host automatically opened selectable choices before owner activation, ordinary submission and cancellation, plus missing/queued/uncertain comparisons. Static source, protocol history and the real drafting-allowance answer do not establish that acceptance checklist. Current behavioral, live-host and Claude/mixed compatibility remain unverified. The test pause prohibits executing those checks now.

No acceptance waiver is requested or presumed by this plan. After recovery, static Verify and review, retain an honest open task with unmet acceptance unless a future explicit owner decision changes that exact acceptance scope. A later acceptance decision is separate from this plan and any retry. No quiet closure from fallback alone or a clean source-review ledger.

0556 — Give each independent owner decision its own selectable options remains separate and agent-closed — not owner-verified under its own source-only exception. That exception applies only to 0556. Preserve its evidence and newer shared source; no rollback, second closure, dependent wait or inherited waiver.

No placement, rank, dependency, brief/board status or lifecycle change is part of this continuation. Only producer can later change lifecycle through owned procedures with applicable authority; coder never moves tasks. No wiki, index, model/account/native configuration, hook reactivation, installation, scheduler, process/infrastructure investigation, activation shortcut, agent-selected approval, commit or push.

## 8. Stage allowances and next action

These are task-specific observed spends, not new allowances. Root must reconcile its live ledger before each launch; absence of a listed extra session cap does not authorize unlimited work.

| Stage | Existing spend / limit and continuation consequence |
| --- | --- |
| Original draft | 2/2; exhausted |
| Additional draft, decision 0555-additional-plan-draft-r1 | This launch 1/1; exhausted, no further draft/revision launch |
| Architect plan approver | One historical R0 launch observed; original maximum 2 per stage, one potentially remains |
| Producer plan approver | One historical R0 launch observed; original maximum 2 per stage, one potentially remains |
| Approver revision rounds | 0/2 recorded for 0555; no reset or independent draft permission |
| Plan adversarial | One historical launch observed; original maximum 2 per stage, one potentially remains |
| Final coder finding check | Historical 1/2; one potentially remains, not a drafting allowance |
| Architect X1 ADR recording | One historical bounded recording completed; settled, no further ADR write proposed |
| Build | One failed/empty launch observed; original maximum 2, at most one documentation-recovery launch after approval and live spend confirmation |
| Verify | Two failed/empty launches; 2/2 exhausted; separately authorize exactly one extra static-only launch |
| 0555 source Review / Process-review / Close | None observed; original stage cap remains; Close not authorized and acceptance unmet |
| Other tasks/session | Surviving limits unchanged; do not use 0548's exhausted allowance or 0556's exception |

Next authorized action: **lead consumes this full frozen draft/evidence and sequences fresh architect/producer plan reviews under confirmed remaining staged allowances, then the independent plan attack and final coder check**. No nested consults by this worker, no source/task-document edits, and no Verify relaunch now. If a relevant remaining allowance cannot be confirmed or is exhausted, return that exact independent decision instead of launching.

Pending later independent decisions:
- `0555-continuation-plan-r1`: approve this exact reviewed continuation for bounded documentation recovery/static review, or reject it. Not yet approved; present only after the required review record exists.
- `0555-additional-static-verify-r1`: authorize exactly one additional static-only Verify launch beyond 2/2, or keep Verify stopped. Not granted; no test permission or plan approval bundled.
No acceptance exception is presumed necessary to make the authorized static progress above.

## 9. Standing owner rulings — carry verbatim to every worker and review

2026-11-05, root user chat:
"I'm repeating again. If we have any mentions of delays, of timeouts, or of benchmark, durations of tests, or whatever, we should ignore them for now. Let's just continue working on the implementation tasks."

## Project-only test execution pause — owner ruling, 2026-11-06

> "Disable ALL tests not only in this session, but in general in this project. No need to remove them completely, but they should not be run"

This standing instruction applies indefinitely to this fkit checkout, overriding generic test and
verification requirements, including those in inherited briefs, plans, skills and reviews. Do not
execute any tests: individual tests, mutation tests, discovery, fixtures, smoke tests, benchmarks,
behavioral probes, saved verification scripts, or delegated runs. Preserve test sources. Use static
inspection only; record required tests as **"skipped — owner disabled test execution"**, never passed.
Behavioral acceptance remains unverified. Do not execute disabled commands to prove they refuse,
and do not run release dry-runs as verification.

Carry this ruling verbatim into every subsequent worker, source-only review and adversarial pass.
Existing sessions need the ruling explicitly; these file edits do not update instructions they
already loaded. Re-enabling requires an explicit owner decision and a separate change; there is
no automatic expiry or environment-variable bypass. This is project-only: do not propagate the pause
into shipped instructions for consuming projects. See [CONTRIBUTING.md](CONTRIBUTING.md#tests).

