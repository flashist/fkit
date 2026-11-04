# Sprint 15 — Make fkit startup predictable and use native defaults

> ## 🔄 In progress — 2026-11-03.
>
> **Scheduling only.** No sprint or task start is approved by this board's creation.
>
> **Authority — owner ruling, 2026-10-30, interactive `fkit_roles.fkit_ask_owner` form, relayed by `fkit-lead`.** Selected option and approved scheduling decision, verbatim:
> *"Adopt hardening plan (Recommended) — Create Sprint 15 as Backlog with 0540, 0537, 0520 in that order. Start no work; no other open tasks gain a wait on Sprint 15."*
>
> Recorded by a spawned `fkit-producer` with no owner channel. This records the owner's scheduling decision; it is not producer precedent for re-ranking.

## Confirmed sprint plan — 2026-11-03

**Owner approval — 2026-11-03, interactive `fkit_roles.fkit_ask_owner` form in the root `fkit-lead` session, relayed to `fkit-producer` (chain `fkit-lead → fkit-producer`, hop 1 of 2), verbatim:**

> Confirm Sprint 15 and new name (Recommended) — Use “Make fkit startup predictable and use native defaults”; keep 0540 → 0537 → 0520 → 0548, ranks and Backlog statuses. Start nothing; no dependency changes.

The owner confirms this existing sprint as the next focus, with the scope and gates below.
The 2026-10-30 scheduling and priority approvals remain recorded; no task or sprint starts.
Assessment and historical evidence: [approved planning packet](../knowledge-base/reports/2026-11-03-current-state-and-next-sprint-proposal.md).

## Sprint start ruling — 2026-11-03

**Owner approval — 2026-11-03, interactive `fkit_roles.fkit_ask_owner` form in the root `fkit-lead` session, relayed to `fkit-producer` (chain `fkit-lead → fkit-producer`, hop 1 of 2), verbatim:**

> Start Sprint 15 and drive it (Recommended) — Mark the sprint In progress, then plan 0540 first; continue 0537, 0520, 0548 through their approval gates. No task placements or dependencies change.

This dated start ruling supersedes the historical scheduling-only “start nothing” and Backlog-state clauses retained on this board and in the briefs. Sprint 15 is now `🔄 In progress`; 0540 is claimed `🔄 In progress` before planning under ship-loop §2. Tasks 0537, 0520 and 0548 remain `🔲 Backlog`. This metadata start/claim grants no plan approval or source-write authority; all existing approval gates, scope, ranks, membership and dependencies remain unchanged.

## 🎯 The goal

**Complete the four already-scheduled improvements so local launches use native runtime model/effort defaults, update checks remain silent and bounded, and their tests demonstrate reliable cleanup and deadline behavior.**

“Predictable” means these bounded contracts; it promises neither fixed startup latency under arbitrary machine load nor cross-runtime certification.

**Success:** 0540 proves cleanup on passing and failing runs without removing old folders; 0537 records its diagnosis and, if the cause is in the test, proves reliability under load without weakening the deadline contract; 0520 proves the update check never prompts over SSH while retaining the watchdog. Each task keeps its brief's verification requirements and approval gates. A launcher defect found by 0537 requires a separate owner-approved task before a fix is scoped or folded into this sprint.

**Additional success, owner request 2026-10-30:** 0548 retains the initial Claude/Codex choice, removes fkit model/effort selection, and makes direct/delegated roles follow native runtime defaults. Existing fkit model/effort fields become inert without resetting user configuration; saved runtime routing remains functional. Intended for the next release; live configured Claude/mixed compatibility remains unverified.

## Acceptance and stop gates — confirmed 2026-11-03

| Existing order / owner | Smallest shippable result | Required acceptance and stop gate |
|---|---|---|
| P1 · **0540** · `fkit-coder` | Temp-project lifecycle cleanup, scoped to folders owned by the current test run. | Rebaseline first: the architect found cleanup already present in the original suspect files; source inspection does not prove the leak gone. Measure current growth and identify its real owner before edits. Prove equal before/after project-folder counts for passing and deliberately failing runs; check the other three named prefixes; restore the temporary failure; preserve existing folders and test count. If unreproduced, report evidence and request disposition instead of speculative cleanup or claiming the brief satisfied. [Brief](../tasks/backlog/0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind/brief.md). |
| P2 · **0537** · `fkit-coder` | Diagnose the stall-test failure, then repair the test if the cause is in the test. | At least five loaded diagnostic runs with elapsed time, `woke` and surviving processes; if a launcher defect is found, stop/report for a separate owner-approved task. For a test repair: 10/10 runs at the same load, retain lower-bound/deadline/no-output/exit guarantees, detect a deliberately broken KILL step and restore it, compare full-suite idle duration before/after with no slowdown. Removing real sleeps is separate scope. An unreproduced failure is unresolved evidence, not a green reliability claim. [Brief](../tasks/backlog/0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine/brief.md). |
| P3 · **0520** · `fkit-coder` | An update-check Git call that does not prompt after an SSH rewrite, retaining silent failure and the watchdog. | Reproduce in isolated configuration first; stop/report if unreproduced. At plan approval, owner rules on exact custom-SSH/proxy/key/wrapper consequences. Show no prompt/stray output, successful continuation and measured time within the existing timeout; preserve normal checks and custom command behavior if supported. Existing-file regression must fail before/pass after the fix. No installer-download, curl-path or timeout redesign. [Brief](../tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/brief.md). |
| P4 · **0548** · `fkit-coder` | One complete behavioral slice: retire fkit model/effort selection and honor native defaults, with lossless handling of old overrides. | Keep initial Claude/Codex choice, saved runtime routing and fresh role launches. Remove selector UI/flags and invocation overrides together; accept runtime-valid settings with inert old model/effort values, preserve saved bytes and unrelated preferences. Prove direct interactive/headless, shell/MCP and adversarial routing across all seven roles and both adapters using isolated fixtures. Cover cancellation/failures, owned-agent refresh, help/provenance/docs, and the owning architect's dated ADR amendment during normal planning. Never edit native user config to force defaults. Fixture argv omission is not live provider inheritance; live Claude/mixed certification remains deferred. Existing brief is already investigated; do not reopen ignore-versus-reset. [Brief](../tasks/backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md). |

These are existing briefs, not new tasks or duplicate implementation prescriptions. The four results
ship independently. 0548 remains one slice because control removal, ignored saved data, validation,
invocation, documentation and provenance must agree; UI-only or engine-only delivery is incomplete.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔄 In progress | P1 | **Stop the test suite leaving `fkit-proj-*` temp folders behind** *(Owner-approved order, 2026-10-30. Depends on nothing; blocks nothing. No automatic deletion of old folders. Owner `fkit-coder`)* | [`0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind`](../tasks/backlog/0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind/brief.md) |
| 🔲 Backlog | P2 | **Make the launcher update-check stall test reliable when `npm test` runs on a loaded machine** *(Owner-approved order, 2026-10-30. Diagnose first; stop for separate owner approval if it is a launcher defect. Depends on nothing; blocks nothing. Owner `fkit-coder`)* | [`0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine`](../tasks/backlog/0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine/brief.md) |
| 🔲 Backlog | P3 | **Stop the update check's `git ls-remote` from prompting over ssh when git rewrites GitHub URLs** *(Owner-approved order, 2026-10-30. Depends on 0284, recorded `✅ Done (agent-closed — not owner-verified)` in Sprint 12. Custom-SSH trade-off goes to the owner at the plan gate. Blocks nothing. Owner `fkit-coder`)* | [`0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh`](../tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/brief.md) |
| 🔲 Backlog | P4 | **Use native runtime model and effort defaults and retire fkit selectors** *(Owner-requested Sprint 15 addition for next release, 2026-10-30. Ignore legacy model/effort fields; preserve runtime routing and user preferences. Depends on nothing; blocks nothing. Owner-confirmed P4 after 0520, 2026-10-30. Owner `fkit-coder`)* | [`0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors`](../tasks/backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md) |

## ⚠️ Notes for the driver

- **Start approval is still required.** The original ruling schedules three tasks; the dated addition below schedules 0548 as well. The 2026-11-03 confirmation adopts the goal/name and preserves all four as `🔲 Backlog`; start no work from these planning approvals.
- **Order only:** 0540 → 0537 → 0520 → 0548. No new `Depends on:` links. The only existing hard dependency is 0520 → [0284](../tasks/done/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md), already agent-closed Done. No open task named any of these four as a dependency in the 2026-11-03 planning assessment; no other open task gains a wait on Sprint 15.
- **0537 is investigation-first.** Preserve its stop-and-report gate for a launcher defect. A shipped-code fix needs separate owner approval; the test-only reliability task does not authorize it. Removing the real sleep from the existing timing tests is outside this scope.
- **0520's plan gate remains.** State which custom `core.sshCommand` / `GIT_SSH_COMMAND`, proxy, key or wrapper setups would change, and obtain the owner's ruling. Scheduling does not decide that trade-off.
- **ADR-057 remains binding:** [D2.1, D8 and D10](../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md). No new test file or prove-red case without the owner's individual approval, in any lane. Use existing test files; the old 0520 phrase “or a sibling” is not approval for a new file. New timing tests must not sleep for real. Default `npm test` stays within 2 minutes on an idle Mac, CI-enforced; 0537 must not make it slower.
- **0540 requires a fresh baseline and preserves existing folders.** The planning architect found cleanup already present in the original suspect files; source inspection does not prove the leak gone. Measure growth and identify its real owner before edits. If unreproduced, report evidence and request disposition; do not add speculative cleanup or claim acceptance. Clean only folders owned by the run; do not sweep old shared-temp folders.
- **Shared test file:** 0537 and 0520 both touch `test/update-banner.test.js`; the second task incorporates the first task's changes. This is an ordering consideration, not a new hard dependency.
- **Board-startup context — corrected 2026-11-03:** the earlier note that a separate startup request was still being clarified is superseded. Port collision fallback/browser opening are already implemented and documented under Unreleased, per the planning assessment; its temporary verification artifact was unavailable, so independent execution is not established. No board feature is added to this four-task scope. Later 0548 documentation edits incorporate the completed delta.

## Sprint validation and finish line

- Each task meets its existing brief, with exact commands, counts, durations, skips and failed
  attempts in its worklog; no unchecked historical figure is reused as a fresh baseline.
- Use existing test files. ADR-057 requires individual owner approval for every new permanent test
  file or prove-red case. No new real-sleep timing tests. Default `npm test` remains within 120 seconds
  on an idle Mac; 0537 must not make it slower. Existing four prove-red cases run where the changed
  paths/brief require them, outside that budget. Follow CONTRIBUTING's affected-path table.
- Preserve owner gates, permissions, hook state, role ownership, fresh contexts and runtime routing.
  Plan/review evidence distinguishes execution, source inspection, synthetic decisions, unavailable
  checks and actual human approval. Report actual per-pass model/coverage; same-model is supported
  with its required disclosure, missing/unusable passes remain partial.
- All four results need verification and independent review with dispositions. Readiness for a
  later release decision does not publish a release or certify Claude/mixed support. If a gate
  stops a task, report the unmet goal explicitly and put the concrete replan to the owner.

**Exclusions:** BUZZ; later board-store/owner-door/conversion phases; tester role; retro delivery;
owner-capture implementation; reviewer sandbox change; hook reactivation; sweeping historical temp
folders; new permanent tests/mutants without approval; global installation, consuming-project
migration, account repair, commit, push or publication. No new closure/owner-verification claim.

**Capacity:** scope-based; no calendar deadline or work-hour cap approved. A diagnostic gate stop may leave the sprint goal unmet and requires an owner replan; it is not a completed behavior fix.

## Notes

- Created 2026-10-30 after checking that Sprint 15 was unused and no sprint was active. This board remains `🔲 Backlog`.
- Existing briefs retained in `tasks/backlog/`; only board membership and priorities are changed. Backlog rows retain moved pointers with destination priorities. Historical brief placement notes are superseded by their dated placement updates.
- No implementation, source or wiki writes, commit, push, starts, or terminal closures are authorized by this scheduling record.

## Addendum — task 0548 added out of band (2026-10-30)

- **Authority:** owner user-chat request, 2026-10-30, relayed by `fkit-lead`: keep the initial Claude/Codex choice, remove fkit project/per-agent model and effort selection, use native user defaults, and make existing fkit overrides ineffective. The owner explicitly requested the just-planned Sprint 15 and next release. Full verbatim request is in 0548's Context. Placement needs no repeated approval; this grants no start or release authority.
- **Scope:** one behavioral task, confirmed by a fresh read-only architect consult. UI-only removal would leave old settings active; engine-only removal would leave ineffective controls. Prefer ignoring legacy model/effort data over destructive reset. Preserve runtime choices and unrelated user preferences. The current ADR-061/0546 settings contract needs an owning architect's dated amendment during normal planning; historical records remain intact here.
- **Owner-confirmed priority — 2026-10-30, `fkit_roles.fkit_ask_owner`, interactive root session, relayed verbatim by `fkit-lead`:**
  > Keep P4 after 0520 (Recommended) — Preserve the approved three-task order, then simplify runtime settings. No dependency links or waits on other sprints change.
  This confirms the existing P4 placement; no re-ranking or producer precedent for re-ranking.
- **On merit this belongs directly below 0520**, because it is the next-release settings change after the already-approved launcher hardening order. Existing ranks are unchanged; this is not producer precedent for re-ranking.
- **Dependencies/knock-on:** 0548 depends on nothing and blocks nothing. No existing dependency is re-pointed, and no other open task gains a wait on Sprint 15. Shared launcher/tests may require sequencing; this adds no hard dependency.
- **Historical concurrent work boundary (2026-10-30; superseded by completed startup delta per 2026-11-03 assessment):** the separate board-startup coder owns `bin/fkit-board.mjs`, `docs/board.md`, `README.md` and `CHANGELOG.md` now. This filing touches none of them; later settings documentation/release-note edits must incorporate its completed delta. Board implementation remains outside 0548.
- **State and limits:** Sprint 15 stays `🔲 Backlog`, with no active sprint found at filing. No implementation, native-config edits, wiki writes, commits/pushes, starts or terminal moves. Live configured Claude/mixed compatibility remains unverified; 0548 defines contract checks and deferred native checks explicitly.

## Ship-loop planning attempt — 2026-11-03

- Plan review: ON (default). The 0540 plan-only worker timed out (SIGTERM), with no usable plan or review record returned. The launcher reported a configuration-load failure; its private diagnostics were withheld, so the precise cause is unverified.
- The driver checked the named task artifacts: only brief.md exists; no plan.md, plan-review.md, worklog.md or review.md landed. No Build was launched.
- Under the ship-loop “Worker spawn did not land” exit, 0540 is reset to `🔲 Backlog` in the brief and row and excluded from this run’s eligible set. The owner decides retry/continuation; no retry allowance is inferred. The sprint remains `🔄 In progress`; the other three tasks remain Backlog.

## Plan-worker retry — 2026-11-04

- Owner user-chat instruction, verbatim: “Retry again”. This follows the actual root owner-form choice: “Retry 0540 once (Recommended) — Begin a fresh attempt through the supported direct-launch fallback; plan review stays ON and no build starts before plan approval.”
- 0540 is claimed `🔄 In progress` in its brief and this row for one fresh direct-launch planning attempt. Plan review remains ON (default); no implementation plan is approved. The other tasks remain Backlog.
- Read-only diagnosis matched the prior exact worker transcript: startup, procedure loading and architect/adversarial consultations succeeded. The wrapper terminated the attempt at its 600000 ms deadline without a final plan. Its broad stderr classifier does not establish a configuration startup failure; the underlying stall and exact stderr trigger remain unknown. The direct fallback has the same deadline.
