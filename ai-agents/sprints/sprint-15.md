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

## Current driver ruling — timing work deferred, 2026-11-05

**Owner ruling — 2026-11-05, user chat in the root `fkit-lead` session, relayed verbatim to `fkit-producer`:**

> I'm repeating again. If we have any mentions of delays, of timeouts, or of benchmark, durations of tests, or whatever, we should ignore them for now. Let's just continue working on the implementation tasks.

- This latest ruling supersedes the earlier 0537 diagnostic approval and all timing-related
  acceptance/discussion gates below for now, including inherited D10, idle/no-slowdown gates and
  duration reporting. The older goal, acceptance table and driver notes remain historical records;
  they do not block continuing implementation. No further timing observations, process/permission
  investigation, load workers, benchmarks, duration comparisons or timeout diagnosis/repros.
- 0537 is `🔲 Backlog`, deferred for now, retaining Sprint 15/P2 and its current folder. Preserve
  its plan/review/worklog, evidence and retained scratch fixtures unchanged. Its earlier approved
  diagnostic plan is not authority to resume work. The recorded five-fixture process settlement
  remains unknown; no process inspection was performed to park it, and retained folders are untouched.
- Continue under the 2026-11-03 start approval above. 0520 is claimed `🔄 In progress` in both its
  brief and row for fresh planning: 0540 is agent-closed Done, 0537 is deferred, and 0520's only
  dependency, 0284, is agent-closed Done in its brief and Sprint 12. 0548 follows at existing P4.
  Plan review stays ON (default); actual owner plan approval is required before source writes.
  0520's custom SSH/proxy/key/wrapper trade-off belongs in that plan gate, not this status update.
- 0520's isolated functional prompt reproduction and no-prompt/silent-failure/continuation checks
  remain in scope. Do no timing measurements or timing-related repros/gates. Preserve existing
  product/watchdog behavior; no removal or redesign is authorized. New-test approval and other
  functional scope/approval rules remain in force.
- Dependency check, 2026-11-05: 184 open briefs checked; none depends on 0537. Its only other
  open-brief mention is 0548's explicit no-wait statement. No placement, rank or dependency changes,
  no new waits on any sprint, and no new placement decision. Shared test-file sequencing remains
  coordination only; 0537 is not a dependency. Existing 0540 and standalone Backlog 0552 brief/row
  statuses both remain `✅ Done (agent-closed — not owner-verified)`.
- Deterministic selector: only `sprint-15.md` is active; chosen board is Sprint 15,
  `reason="lowest-ordered"`. Full Sprint 15 reader before these edits showed no status/dependency
  drift; the old timing gates and historical start notes are superseded as stated here.

## Current continuation — final draft parked, 2026-11-06

**0548 — Use native runtime model and effort defaults and retire fkit selectors** is `🔲 Backlog`
in its brief and row. Both permitted final-revision launches returned no draft; the driver read
both empty returns and the absent optional checkpoint. The frozen R1 draft remains intact and
unapproved. No implementation plan was approved. The two-launch stage allowance is exhausted;
additional launches require an actual owner answer. Skip this task for this run. Earlier planning
claims are superseded; priorities, placement, dependencies and the accepted unknown-agent policy
are unchanged. Other task dispositions remain as recorded. See the task's append-only incomplete
planning record.

## Current continuation — verification block and next planning claim, 2026-11-05

**Owner ruling — 2026-11-05, interactive `fkit_roles.fkit_ask_owner` in the root `fkit-lead`
session, recorded at 10:00:21 UTC, relayed verbatim to `fkit-producer`:**

> Keep blocked; continue implementation (Recommended) — Leave this task open with failed verification recorded, then continue the next eligible sprint task. No closure exception.

- **0520 — Stop the update check's `git ls-remote` from prompting over ssh when git rewrites GitHub URLs**
  stays open as `🚧 Blocked — verification failed`. Approved Build is complete; source review
  converged on zero confirmed defects with both passes usable. Verify failed: filtered 970 total,
  946 pass, 23 fail, 1 skip (22 loopback-listen `EPERM` failures and the existing first-use
  assertion `9 !== 15`). Prove-red failed at unmutated launcher baseline 0b (74 pass, 1 fail).
  No scoped source defect is established. Retain the failed verification; skip this task this
  run. No terminal mover or closure exception.
- **0548 — Use native runtime model and effort defaults and retire fkit selectors** is next by
  existing priority and dependency order: 0540 is agent-closed Done; 0537 remains owner-deferred;
  0520 is blocked; 0548 has no dependencies or current session claim in its retained records.
  Claim `🔄 In progress` in its brief and row for root-owned plan-only work. `fkit-coder` remains
  the accountable role. No approved implementation plan exists; plan review stays ON and actual
  owner approval remains required before source writes. Preserve both failed planning-attempt
  records as historical; this status claim authorizes no extra worker launch or retry.
- The latest owner user-chat ruling quoted above continues to defer timing, delay, benchmark and
  test-duration work. No startup/configuration investigation resumes. The new dispositions
  supersede earlier current-state/claim statements; all other scope and approval gates remain.
  No task placement, priority or dependency changed; no new wait on any sprint. Task 0553 remains
  on the separate Backlog board, unranked and untouched. Placement decision: checked none.

## Current closure disposition — 2026-11-06

**0554 — Make the lead advance authorized work after worker completion** is `✅ Done (agent-closed — not owner-verified)`
in its brief and row, closed by the producer through `fkit-task-done`. This supersedes the earlier
plan-only claim; full-plan owner approval is recorded in the task's unchanged plan-review record.
At closure, the two other new briefs remained Backlog. The filing-state descriptions below are historical;
closure is not owner verification or a new claim on the next task.

## Addendum — owner-ruled top-priority additions, 2026-11-06, root user chat; not producer precedent for re-ranking

**Authority first:** the owner ruled this priority change on **2026-11-06**, in **user chat in the
root `fkit-lead` session**, relayed verbatim to a fresh spawned `fkit-producer`. This is **not
producer precedent for re-ranking**. Exact owner request:

> I've noticed that FKIT-LEAD is right now very passive and not proactive. It often waits for me to push it forward, which sucks. Also, when there are questions (like the question you've just asked me) - it often doesn't ask it via the interactive actions interface and if there are more than 1 question, it often combines them into 1 question and asks it as 1 big chunk of text expecting me to choose the option "write your answer" where I write the answer verbatim and not able to choose an answer from the options that the lead is supposed to give me. Let's fix it first. Brief as many tasks to the current sprint as needed to handle all of the things that I mentioned, those things should be our top priority things for the current sprint, we will work on them first.

This explicit owner ruling overrides the task-brief append-only/new-row insertion and
spawned-producer re-rank restrictions only to put this new work first among open Sprint 15 tasks.
No closed row is renumbered. Historical quoted approvals and dispositions remain records of their
time; all earlier current-priority, next-task and four-task-only scope/finish-line statements are
superseded only to the extent set out here. Sprint identity, name and line-3 In-progress banner
are unchanged. Filing grants no implementation-plan/source approval or additional worker retry.

**Current open order, first to last:**

| Priority | Task | Independently shippable outcome |
|---|---|---|
| P3 | [0555 — Use supported interactive owner questions with an explicit fallback](../tasks/backlog/0555-use-supported-interactive-owner-questions-with-an-explicit-fallback/brief.md) | Automatically open actual selectable choices on supported hosts without extra activation; separate queued acceptance from display/consent, with explicit unavailable-interface fallback and actual-answer waiting. |
| P4 | [0556 — Give each independent owner decision its own selectable options](../tasks/done/0556-give-each-independent-owner-decision-its-own-selectable-options/brief.md) | Each independent decision has its own concise question, selectable options and stable approval binding. |
| P5 (was P2) | [0537 — Make the launcher update-check stall test reliable when `npm test` runs on a loaded machine](../tasks/backlog/0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine/brief.md) | Still owner-deferred, Backlog; no timing work resumes. |
| P6 (was P3) | [0520 — Stop the update check's `git ls-remote` from prompting over ssh when git rewrites GitHub URLs](../tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/brief.md) | Still Blocked — verification failed; skip this run, no closure exception. |
| P7 (was P4) | [0548 — Use native runtime model and effort defaults and retire fkit selectors](../tasks/backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md) | Still Backlog/parked; R1 unapproved, final-draft launch allowance exhausted. Additional launch needs an actual owner answer. |

The completed **0540 — Stop the test suite leaving `fkit-proj-*` temp folders behind** stays P1,
`✅ Done (agent-closed — not owner-verified)`. Existing open work keeps its relative order.
**On merit:** the three new tasks belong before the previous open work because the owner explicitly
wants these lead/decision improvements first. Their internal sequence is continuation, delivery,
then decision assembly; each is independently shippable and can use today's other interfaces.
**Filing state:** all three new briefs/rows were `🔲 Backlog`, owner `fkit-coder`.

**Dated scope/finish-line addition:** the sprint also delivers proactive lead continuation and
usable independent owner decisions. Acceptance covers completed-worker continuation, genuinely
required approvals, exhausted retries, missing question interface and two or more decisions with
separate selectable alternatives. Preserve explicit retry caps, actual plan/source approval,
review independence, producer-only movers, no commit/push and honest checkpoints when a host
cannot resume. Distinguish static/prompt inspection, protocol fixtures and actual interactive host
execution; unperformed checks remain unverified. No scheduler, self-restart/self-clear, universal
host promise, fake demo, hook reactivation or persistent native-settings repair.

**Checked dependencies/placement:** all three new briefs depend on nothing and block nothing.
No existing dependency is added or re-pointed; no open task gains a hard wait on these tasks or any
sprint. Shared instruction/runtime/test files need coordination, not artificial dependencies.
The existing closed dependency stays unchanged. The separate
[0553 — Include task titles alongside IDs in owner-facing communication](../tasks/backlog/0553-include-task-titles-alongside-ids-in-owner-facing-communication/brief.md)
stays unranked on the Backlog board. Related reporting/capture/clear-helper briefs remain separate;
the new briefs link their boundaries. Backlog moved-pointer destination ranks for the affected
open tasks are reconciled; their `➡️ Moved` status/target and unranked cells remain unchanged.

**Standing limits:** the owner's 2026-11-05 timing-work deferral remains binding: no timing,
delay, timeout, benchmark, duration or process-observation investigations or performance gates.
Use meaningful existing-file coverage and `CONTRIBUTING.md`'s affected-path checks; each new
permanent test file or prove-red case needs individual owner approval at the implementation-plan
gate. No account/model/configuration probes or repair. Reported symptoms and root tool absence
are observations, not proved causes. Codex hooks remain disabled; planning/write limits remain
instructional; live configured Claude/mixed compatibility remains unverified.

**Wiki caveat:** 12 commits touched `ai-agents/` since watermark
`185ac5e07e918c089ed3afd23496587315342000`; relevant wiki decisions may lag. Current procedures,
runtime sources and owner rulings were read; no wiki write or fresh interactive execution occurred.

## 🎯 The goal

**Complete the four already-scheduled improvements so local launches use native runtime model/effort defaults, update checks remain silent and bounded, and their tests demonstrate reliable cleanup and deadline behavior.**

“Predictable” means these bounded contracts; it promises neither fixed startup latency under arbitrary machine load nor cross-runtime certification.

**Success:** 0540 proves cleanup on passing and failing runs without removing old folders; 0537 records its diagnosis and, if the cause is in the test, proves reliability under load without weakening the deadline contract; 0520 proves the update check never prompts over SSH while retaining the watchdog. Each task keeps its brief's verification requirements and approval gates. A launcher defect found by 0537 requires a separate owner-approved task before a fix is scoped or folded into this sprint.

**Additional success, owner request 2026-10-30:** 0548 retains the initial Claude/Codex choice, removes fkit model/effort selection, and makes direct/delegated roles follow native runtime defaults. Existing fkit model/effort fields become inert without resetting user configuration; saved runtime routing remains functional. Intended for the next release; live configured Claude/mixed compatibility remains unverified.

## Acceptance and stop gates — confirmed 2026-11-03

| Existing order / owner | Smallest shippable result | Required acceptance and stop gate |
|---|---|---|
| P1 · **0540** · `fkit-coder` | Temp-project lifecycle cleanup, scoped to folders owned by the current test run. | Rebaseline first: the architect found cleanup already present in the original suspect files; source inspection does not prove the leak gone. Measure current growth and identify its real owner before edits. Prove equal before/after project-folder counts for passing and deliberately failing runs; check the other three named prefixes; restore the temporary failure; preserve existing folders and test count. If unreproduced, report evidence and request disposition instead of speculative cleanup or claiming the brief satisfied. [Brief](../tasks/done/0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind/brief.md). |
| P5 · **0537** · `fkit-coder` | Diagnose the stall-test failure, then repair the test if the cause is in the test. | At least five loaded diagnostic runs with elapsed time, `woke` and surviving processes; if a launcher defect is found, stop/report for a separate owner-approved task. For a test repair: 10/10 runs at the same load, retain lower-bound/deadline/no-output/exit guarantees, detect a deliberately broken KILL step and restore it, compare full-suite idle duration before/after with no slowdown. Removing real sleeps is separate scope. An unreproduced failure is unresolved evidence, not a green reliability claim. [Brief](../tasks/backlog/0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine/brief.md). |
| P6 · **0520** · `fkit-coder` | An update-check Git call that does not prompt after an SSH rewrite, retaining silent failure and the watchdog. | Reproduce in isolated configuration first; stop/report if unreproduced. At plan approval, owner rules on exact custom-SSH/proxy/key/wrapper consequences. Show no prompt/stray output, successful continuation and measured time within the existing timeout; preserve normal checks and custom command behavior if supported. Existing-file regression must fail before/pass after the fix. No installer-download, curl-path or timeout redesign. [Brief](../tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/brief.md). |
| P7 · **0548** · `fkit-coder` | One complete behavioral slice: retire fkit model/effort selection and honor native defaults, with lossless handling of old overrides. | Keep initial Claude/Codex choice, saved runtime routing and fresh role launches. Remove selector UI/flags and invocation overrides together; accept runtime-valid settings with inert old model/effort values, preserve saved bytes and unrelated preferences. Prove direct interactive/headless, shell/MCP and adversarial routing across all seven roles and both adapters using isolated fixtures. Cover cancellation/failures, owned-agent refresh, help/provenance/docs, and the owning architect's dated ADR amendment during normal planning. Never edit native user config to force defaults. Fixture argv omission is not live provider inheritance; live Claude/mixed certification remains deferred. Existing brief is already investigated; do not reopen ignore-versus-reset. [Brief](../tasks/backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md). |

These are existing briefs, not new tasks or duplicate implementation prescriptions. The four results
ship independently. 0548 remains one slice because control removal, ignored saved data, validation,
invocation, documentation and provenance must agree; UI-only or engine-only delivery is incomplete.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done (agent-closed — not owner-verified) | P1 | **Stop the test suite leaving `fkit-proj-*` temp folders behind** *(Owner-approved order, 2026-10-30. Depends on nothing; blocks nothing. No automatic deletion of old folders. Owner `fkit-coder`)* | [`0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind`](../tasks/done/0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P2 | **0554 — Make the lead advance authorized work after worker completion** *(Owner-priority ruling, 2026-11-06. Depends on nothing; blocks nothing. Filing is not plan/source approval. Owner `fkit-coder`)* | [0554 — Make the lead advance authorized work after worker completion](../tasks/done/0554-make-the-lead-advance-authorized-work-after-worker-completion/brief.md) |
| 🔄 In progress | P3 | **0555 — Use supported interactive owner questions with an explicit fallback** *(Owner-priority ruling, 2026-11-06. Depends on nothing; blocks nothing. Filing is not plan/source approval. Owner `fkit-coder`)* | [0555 — Use supported interactive owner questions with an explicit fallback](../tasks/backlog/0555-use-supported-interactive-owner-questions-with-an-explicit-fallback/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P4 | **0556 — Give each independent owner decision its own selectable options** *(Depends on nothing; blocks nothing. Owner `fkit-coder`)* | [0556 — Give each independent owner decision its own selectable options](../tasks/done/0556-give-each-independent-owner-decision-its-own-selectable-options/brief.md) |
| 🔲 Backlog | P5 | **Make the launcher update-check stall test reliable when `npm test` runs on a loaded machine** *(Deferred for now by owner user-chat ruling, 2026-11-05; see current driver ruling above. Owner-approved order, 2026-10-30. Depends on nothing; blocks nothing. Owner `fkit-coder`)* | [`0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine`](../tasks/backlog/0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine/brief.md) |
| 🚧 Blocked — verification failed | P6 | **Stop the update check's `git ls-remote` from prompting over ssh when git rewrites GitHub URLs** *(Owner ruling 2026-11-05, 10:00:21 UTC: keep open; skip this run; no closure exception. Build complete; source review converged; Verify and prove-red failed. See current continuation above. Depends on 0284, recorded `✅ Done (agent-closed — not owner-verified)` in Sprint 12. Blocks nothing. Owner `fkit-coder`)* | [`0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh`](../tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/brief.md) |
| 🔲 Backlog | P7 | **Use native runtime model and effort defaults and retire fkit selectors** *(Parked 2026-11-06: both permitted final-draft launches returned no draft; R1 preserved unapproved. Extra attempt requires owner decision. Depends on nothing; blocks nothing. Owner `fkit-coder`)* | [`0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors`](../tasks/backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md) |

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

## Current plan-only claim — 2026-11-06, after closure cross-check

0555 — Use supported interactive owner questions with an explicit fallback is `🔄 In progress` for planning only, P3 with no dependencies. 0554 — Make the lead advance authorized work after worker completion closure was fully cross-checked (79 moved files, five changed docs, seven unchanged source hashes, 220 frozen historical references and 42 relative hrefs). Plan review remains ON (default); no source approval for this new task. 0556 — Give each independent owner decision its own selectable options remains Backlog P4. Older deferrals, block and retry limits remain.
