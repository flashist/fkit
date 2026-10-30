# Implementation progress

**Current opt-in preview scope — 2026-10-30:** the owner requested a named preview through the regular
release procedure, without shipping to default users. Target: `v0.4.0-codex.1` on
`codex/codex-preview`; default install/update channel `main` must remain unchanged. The shared
installer is opt-in via `FKIT_REF`; publishing does not install globally or migrate consuming
projects. See the root README for branch versus exact-tag installation and retained tag-notice limits.

0543, 0544 and 0545 are now in `ai-agents/tasks/done/`, closed by actual producer movers as
**agent-closed — not owner-verified**. Sprint 12 has 14 done, one cancelled, no open task or drift;
its banner remains In progress. Latest 0545 suite: 961 total, 960 pass, zero fail, one optional
benchmark skip, 108.38142875 seconds. Independent primary/adversarial review found no confirmed
defects, with reasoning-only second-opinion coverage. 0544 also retained fresh hook-free
default/opt-out/reset/rejection/argument and full disposable task-lifecycle checks. Their durable
records supersede older pending-0544/0545 statements below.

Native human UI approval/rejection acceptance and live Claude/mixed compatibility remain separately
unverified. Codex planning/general writes remain instructional; both fkit hooks disabled. Same
configured-model passes do not prove serving identity or diversity. No stable cross-runtime
certification, sprint closure or wiki sync is implied. The release gate and remote publication
result must be checked independently; this scope note alone is not proof that the tag was pushed.

Earlier checkpoints below are historical, including statements that no real task was closed, no
release was authorized, or 0544 planning was still pending. The owner's named-preview request
authorizes the release commit/push on the preview branch only, not `main`, global installation or
changes in other projects.


## 0543 accepted and closed for Codex — 2026-10-30

**Current accepted/closed checkpoint — 2026-10-30:** 0543 is **✅ Done (agent-closed — not owner-verified)**
through the actual producer-owned `fkit-task-done`; the entire folder is now in `tasks/done/`,
and its brief/Sprint 12 markers match. The actual human desktop-chat `request_user_input_async`
answer, recorded at `2026-10-30T08:58:46.877838+00:00`, accepted the exact C1–C5 in the
[accepted proposal](../ai-agents/tasks/done/0543-turn-plan-review-on-by-default-in-fkit-coder-sessions-and-plain-fkit-plan-task/acceptance-proposal.md) and replaced the October 27 personal-live-check hold
for Codex completion only. The actual architect's dated additions to ADR-060 and the October 24
design report were verified before closure. This closure does not make deferred checks pass.

Complete Codex native human UI approval/rejection and the original Claude checks remain separately
unverified; see the proposal's retained checklist and `validation.md`. Synthetic replies remain
synthetic. Both passes used the same model. A different model is recommended for a broader second
opinion; independent serving identity/diversity remains unverified. Planning/general writes remain
instruction-only and both Codex hooks stay disabled. Existing bounded evidence is not a new full
post-follow-up task/sprint lifecycle or Claude/mixed certification. No workflow tests were rerun.

0544 planning is now permitted under the confirmed 0543 → 0544 → 0545 order; this closure run
starts no planning or implementation and changes no other task/sprint status, rank, dependency or
goal. Implementation still needs its own plan approval. No commit, push, release or wiki write.

## Historical Codex evidence and acceptance preparation — 2026-10-30 (before closure)

- Preserved the completed disposable automation under 0543's `verification/`: default review,
  synthetic approval/rejection and record persistence, both opt-outs/reset, and bounded worker
  behavior. A separately authorized example implementation/review passed 27 assertions. No model
  workflow was rerun merely to file evidence, and these are not 27 launcher tests.
- Recorded the four owner interview answers in `decisions.md`, the Sprint 12 goal/remaining order,
  and 0545's confirmed-evidence wording direction. No task status or dependency changed.
- Drafted 0543's `acceptance-proposal.md`: six original checks mapped, proposed Codex criteria C1–C5,
  a separate unverified native UI/Claude checklist, and an exact future acceptance/producer-closure
  decision. Direction to draft is not closure approval. Actual architect scope check completed exit 0:
  APPROVE FOR OWNER DECISION, no verified defect or prior prerequisite; full response retained in the
  task's acceptance-review.md. Actual owner acceptance remains pending.
- Both review passes were usable but same configured model; actual identity/diversity unverified.
  Generic async-question metadata remained visible to the worker; only fkit_ask_owner absence was
  established. Planning/general role writes remain instructional. Hooks stay disabled.
- Complete native human approval/rejection and original Claude planning mechanics remain unverified.
  Current bounded evidence is not a full post-follow-up task/sprint lifecycle certification. No
  source implementation, new permanent test file, wiki write, ADR amendment, mover, commit or push.

Goal status: active, resumed by the owner's “Continue” on 2026-10-29. Scope remains all of `plan.md`, including compatibility/packaging. The current implementation must still pass the full migration acceptance audit.

## Owner form blank-comment submission — 2026-10-29

- Owner could not submit the optional comment blank. Source schema correctly required only
  `answer`, and direct protocol checks accepted omitted/empty comments. Native CLI reproduction
  exposed both confusing cases: moving fields without confirming a highlighted choice left one
  required answer outstanding; after confirming a choice, blank-comment submission attempts still
  left the form open. Nonempty text eventually submitted. Do not dismiss this as owner error or
  claim a proven upstream cause beyond the observed behavior.
- Removed the always-present optional comment field. Normal choices now use one required enum
  field. `Write another answer` opens a second one-field text form; its selection alone does not
  resolve the question. Empty/cancelled custom replies grant no approval. Custom text is returned
  verbatim in `comment`; ordinary selections return `comment: ''`. No-options questions stay a
  single required text field. Updated the tool description and runtime docs.
- Added behavior coverage in the existing launcher test file: one-field schema, ordinary choice,
  pending custom stage, exact custom text, empty/cancel/interrupted second stage, late-answer
  rejection, no-options text and invalid choice. Focused configured/public checks **8/8 passed,
  10277.083166ms**, `/private/tmp/fkit-owner-single-field-regressions.log`; isolated owner-form
  check also passed. Syntax/whitespace checks passed. Full suite/reviews not repeated.
- Native interactive fixture verified one-field free text, then explicit enum choices. The latter
  displayed Field1/1, submitted the highlighted choice with Enter, and returned
  `answer: Explain fixture`, `comment: ''` without a comment panel. Model reported the exact result
  and no pending work. Requested/observed fixture model gpt-6-luna; hooks remain off. Native custom
  follow-up rendering was not separately exercised; its protocol paths passed above. Both owned
  CLI sessions were closed after testing. No real profile/task/wiki/board/global config changes.
- An already-open owner form belongs to its running old MCP process: the immediate workaround is
  `No additional comment.`; new behavior loads after restarting fkit. No real owner decision was
  answered or inferred by this test.

## Interactive role startup greeting — 2026-10-29

- Owner's lead session opened on a blank input. Cause verified: ordinary interactive launches passed
  no initial user message, and role materialization stripped YAML including the canonical
  `initialPrompt`. Instructions alone did not start a turn. This is independent of hook removal.
- Added canonical folded `initialPrompt` extraction for all seven roles and pass it as the initial
  interactive Codex message when no explicit prompt is supplied. Adapt startup skill paths to
  `.agents/skills/`; missing/malformed canonical startup text fails explicitly. Explicit onboarding
  and supplied task prompts are preserved; headless/delegated tasks get no greeting. Claude adapter
  is unchanged. Both Codex hook registrations remain disabled.
- Existing direct-launch contract extended across seven roles/both session modes: startup message
  present only for interactive default launch, explicit prompt retained, headless stdin retained,
  no hooks, and existing role/model/effort settings preserved. Focused configured/public tests
  **7/7 passed, 10468.684875ms**, `/private/tmp/fkit-startup-prompt-tests.log`. After the seed
  clarification below, final direct-launch regression **1/1 passed, 4229.06725ms**,
  `/private/tmp/fkit-startup-prompt-tests-final.log`. Syntax/whitespace checks passed; full suite
  and external reviews were not repeated for this bounded change.
- Actual interactive public menu → lead launch in a disposable project automatically greeted.
  First live run also attempted nonexistent skill `fkit-lead` and was denied; clarified in the seed
  that the role instructions are already loaded and role names are not skills. Second direct lead
  run greeted, called `fkit_ask_owner`, rendered the question form, accepted cancellation as no
  answer, and had no invalid-role skill request or tool error. Both sessions exited0 after Ctrl+C.
  Requested and observed model gpt-6-luna, fixture-only low effort; no real profile choices changed.
  Sanitized results `/private/tmp/fkit-startup-greeting-results.json`. No real task, commit, push,
  wiki write, Claude API call or global install/config change.

## Both Codex hooks disabled by owner — 2026-10-29

- Owner requested that the first Codex version have neither hook, with implementation retained for
  possible later evaluation after normal usage. Added a fixed-off `CODEX_HOOKS_ENABLED` gate around
  both registrations; `hook.mjs` remains dormant. No user-facing opt-in or global CLI edit.
- Updated generated runtime bindings and current docs/records to distinguish dormant implementation
  from historical hook probes. Written role, question-tool and “What's next?” instructions remain;
  model/effort selection, dispatcher checks, native-spawn flags and owner forms are unchanged.
- Extended the existing launcher contract: no hook args or script calls for any of seven roles in
  interactive/headless modes; actual direct and delegated CLI argv omit hooks while retaining
  model/effort settings. Focused configured/public-launch tests **7/7 passed, 10162.433ms**;
  `/private/tmp/fkit-disabled-hooks-tests.log`. Syntax and whitespace checks passed.
- No full-suite, live task/sprint or external-review rerun for this bounded change. Their earlier
  evidence predates disabling the hooks. No Claude API calls, global install/config edits, real
  task/sprint closures, wiki writes, commit or push. Existing sessions need a restart to drop the
  earlier session-scoped hook registrations. Await real usage feedback before reactivation.

## Effort-selector follow-up — 2026-10-29

- Multi-round role editing: role selection now returns after each batch. `0`, `done`, or blank
  finishes editing and leads to one shared summary/save confirmation. Previous edits remain in
  memory, and a role can be revisited. Existing interview test covers multiple rounds, two distinct
  roles, revisiting a role, batch selection, and all finish options; focused run passed (1/1),
  `/private/tmp/fkit-role-edit-loop-tests.log`. Full suite not rerun for this bounded UI change.
- Direct terminal check in a disposable project passed: wiki then coder edits, role menu after
  each, no settings file before final confirmation, `0` to finish, one save persisted both choices.
  Used a stub local catalog, no model API/Claude call. Results
  `/private/tmp/fkit-role-edit-loop-terminal.json`. Two preceding Python PTY harness attempts timed
  out: first expected a colon on a yes/no prompt; second timed out awaiting exit after synthetic
  Save input (cause not established). Neither wrote settings. Direct PTY interaction then passed;
  no product code change was needed for those probe failures.

- Per-role picker follow-up: the role model prompt accepted numbers but did not redisplay the
  catalog. It now shows the model list immediately before each Codex role's model question, then
  a vertical numbered effort list for that selected model. Prompts explicitly accept numbers or
  names/IDs. The existing interview test now checks the visible menus at those question boundaries;
  focused run passed (1/1), `/private/tmp/fkit-role-model-menus-tests.log`. No full-suite rerun for
  this prompt-only change; no model/API request or real project settings write.

- Role-menu follow-up: owner's next screenshot showed the old free-text role-selection prompt.
  Inspection found the checkout already contains the numbered seven-role list and number/name
  parsing, so preserved that implementation. Focused existing interview test passed, including
  multiple numbers, mixed number/name duplicates, blank and invalid selections. Log
  `/private/tmp/fkit-role-menu-tests.log`; full suite not rerun for this UI check. Already-running
  setup processes need a restart to load the current prompt.

- Owner's terminal screenshot exposed the missing effort prompt after model selection. Existing
  settings/launch transport already supported effort; added interactive default and per-role choices,
  effective settings display, and configure flags `--effort` / `--role-effort`.
- Supported levels come from local Codex catalog metadata, rather than assuming every model supports
  every level. Unknown models/metadata retain exact named levels with an explicit support-unknown
  notice. Runtime default and role inheritance remain distinct; existing profiles stay compatible.
- Existing launcher-contract test extended; full file **64/64 pass, 45664.588833ms**. Covers setup
  answers/blanks, supported choices, bad-input preservation, reset/inherit and direct/delegated
  effort arguments. Log `/private/tmp/fkit-effort-launcher-tests.log`. No permanent test file added.
- Actual public configure terminal flow passed using real local model metadata, with no model API
  or Claude calls: default gpt-6.1-sol/high, wiki gpt-6-luna/low. Luna's menu omitted ultra.
  Fixture `/private/tmp/fkit-effort-ui.zMgBjt`; real project settings were not selected or changed.
  A second terminal run changed the candidate effort to low, declined Save, and verified the saved
  default remained high with wiki low; exit0, settings unchanged.
- Previous full suites/reviewer passes remain historical evidence preceding this bounded change;
  they were not repeated or claimed as validation of the new selector. No commit/install/release.

## Owner-confirmed local availability — 2026-10-29

- Owner's actual normal-Terminal result: “The command runs, but it fails due to some problems with
  API, don't count on Claude to be available here locally”. Stop local Claude API troubleshooting
  and probes. Do not treat it as a Codex-app-only failure or keep asking the owner to fix Claude.
- Codex-only local readiness stands on the seven direct roles, model override, owner relay,
  task/sprint workflows, public routing and reviewed/checked implementation. All effective roles
  in a local profile must select Codex. Real source-project model settings and global launcher
  remain the owner's choices; they are not silently changed to a tested fixture model.
- MA-15 live Claude/mixed verification and broader cross-runtime certification remain deferred and
  explicitly unverified. Added a concrete handoff in `validation.md`; no external verifier has been
  assigned, contacted or scheduled. This changes local availability assumptions, not evidence.
- Additional no-Claude public-launch fixture returned exit0 and its expected marker, with all seven
  roles selecting Codex and `claude` absent from PATH. A stricter human-trace observer did not match
  the procedure call and made that harness exit1; not a runtime launch failure and not counted as
  fresh loader coverage. Corrected structured native event verification then passed: actual
  `item.completed` / `mcp_tool_call`, server `fkit_roles`, tool `fkit_skill`, status completed,
  no result error, final agent marker and exit0. All seven effective roles were Codex; Claude lookup
  returned ENOENT. Source model-settings and installed global-command hashes were unchanged.
  The fixture explicitly requested gpt-6-luna; JSON mode supplied no serving-model identity, so that
  run's observed identity remains unknown. Results: `/private/tmp/fkit-codex-only-acceptance-results.json`.

## Current integration checkpoint — 2026-10-29

- **Final code/check closeout:** adv/adversarial alias compatibility fix passed direct read-only-routing assertions and narrow primary/adversarial reasoning review (both observed gpt-6-luna), no confirmed defects. Optional consult-alias test coverage was a suggestion, not a project-key-list requirement; no speculative test added. Verbatim report relayed. Final required default suite: **958 total, 957 passed, one skipped, zero failed; duration_ms=94348.559959**, within120000ms. Release suite remains30/30. Broader MA-15/16 live Claude certification is deferred under the availability clarification above; local Codex use is not waiting on it.
- Final filesystem/process check: global wrapper SHA-256 still matches baseline, HEAD76c8507, source index empty, no changes under real tasks/sprints/wiki and no owned verification/review process observed. The one skipped test is the explicitly opt-in board benchmark (`FKIT_BOARD_BENCH=1`). Normal-Terminal Claude failure is now confirmed; no repeated local probes or completed workflows are needed.

- Latest closeout: executable-source reviewer/adversarial and documentation-delta passes completed and were relayed verbatim. Both observed model IDs were gpt-6-luna; reasoning-only coverage, no behavioral measurements attributed to them. X1 disproven; doc own-record R1/R2 verified and fixed, R3 completion-state refreshed. No runtime fix required from those reports.
- Shipped AGENTS/CLAUDE contexts now distinguish configured dispatcher controls from legacy native-tool examples. Canonical Claude README is scoped to the legacy path. Regenerated structure-manifest adds only two current template-body hashes; every historical row remains. Full suite after those changes:958 total/957 passed/1 skipped/0 failed, duration_ms=89517.423542.
- Final compatibility check found configured parsing rejected the canonical legacy adv/adversarial aliases. Both now normalize to adversarial-reviewer, including consult operands. Extended existing direct-runtime test verifies read-only routing for both aliases; targeted and final full tests passed, followed by the clean narrow review noted above.
- Owner first requested the exact Terminal diagnostic command; that was not a works/fails result. The subsequent actual response confirmed API failure and local Claude unavailability; see the current availability section. No success was inferred from the earlier request.

- Owner explicitly accepted the documented local limits after asking for an explanation and re-asking. Actual question/response recorded in `decisions.md`. Architect role (observed gpt-6-luna) recorded accepted ADR-061 and added +2/−0 pointers to ADR-009/010/042/054; deleted-line checks empty. No historical ADR body rewritten, no wiki ingestion.
- Full no-Claude task and sprint verification now passed. Task 0001 closed through producer; task 0002 plan review/actual synthetic approval/build/verification/independent two-pass code review/coder dispositions/producer task-and-sprint movers completed. Final driver exited 0 with clamp checks passed, done markers and archived links inspected. Both task/sprint markers are agent-closed, not owner-verified. Timeout and default-model usage-limit failures were preserved; final fixture lead/coder/producer explicitly used available gpt-6-luna without changing real project model settings.
- Public integration implemented: `bin/fkit`, shared configured launch path, Claude argv/result adapter, runtime/model settings inheritance, explicit root-session runtime override, common update/board, package/install/self-host resources and migration/rollback docs. Unconfigured projects keep legacy Claude without Node; configured paths require Node. Source canonical role/skill policy and scaffold inventory/manifest stay under claude/. No public installation, commit, push or release.
- Deterministic new behavior checks passed in existing test files: direct/peer CLI routing and observed/requested model separation; explicit default changes preserve role choices; invalid choices refuse before launch; old unconfigured launcher behavior; no framework Node invocation on legacy path; checkout self-hosting; quoted install paths, source/path retention on update, incomplete/unowned package refusal. No new permanent test file.
- Final default suite in isolation: **958 total, 957 passed, one skipped, zero failed, 89.987s**, within 120s budget. First run overlapped release suite: 957 total, 956 passed, one skipped, zero failed, 136.327s — assertions green but budget missed; not presented as the budget pass. Release suite **30/30**, zero failed, 88.999s. Later team-description wording change was syntax/whitespace checked, not a behavioral change requiring another whole-suite run.
- Real public Codex launch/procedure smoke passed, observed gpt-6-luna. Seven direct no-Claude roles, alternate wiki model, actual owner cancellation/relay and accepted task/sprint flows remain the measured local evidence. The installed global fkit wrapper hash is unchanged.
- **Live Claude blocker:** unchanged legacy launch, configured explicit sonnet launch, and a plain safe-mode/no-tools/no-project-context call all fail with an API error. Outside-sandbox `claude auth status` reports loggedIn true. Inside-sandbox auth status had reported false and is NOT the normal-login result. A bare-mode probe intentionally excluded OAuth and is NOT normal-login evidence. Precise API failure cause unestablished; no login/provider/settings changes or raw private diagnostics. MA-15 live compatibility and MA-16 release certification remain incomplete.
- **Independent final review pending permission:** source fkit-review procedure requires an independent reviewer rather than author self-review and verbatim relay. Prepared `/private/tmp/fkit-final-runtime-review.mjs` for actual reviewer + leaf in a disposable workspace, scoped to current changed tracked/untracked migration code/tests/docs/ADRs. Automatic approval review rejected execution for source transmission to the configured external Codex service without explicit user payload/destination authorization. Asked the owner interactively; no retry or workaround before the actual answer. Review not yet run; no independent final source-review claim.
- Owner then explicitly selected **“Authorize external Codex review (Recommended)”** through this chat's permission question, covering changed tracked/untracked migration code, tests, docs and ADRs, excluding credentials/user configuration, to the configured Codex service for reviewer and adversarial passes. Retried only the exact prepared review after that answer; outcome pending. This supersedes the pending-permission state above, not the recorded rejection.

## Desktop continuation — 2026-10-29

- Diagnosed the previous producer exit 2 with a bounded direct CLI invocation: `--approve-for-me` conflicts with `--sandbox`. It was an argument-parser failure, not an approval-review denial. Producer now passes only `--approve-for-me`, which selects workspace-write and automatic approval review itself. All other role/mode sandbox choices are preserved.
- Added `codex/diagnostics.mjs`: child launches with no usable stdout return only fixed, recognized startup error categories, withholding private raw stderr. Verified conflict recognition and withholding of synthetic private data; no claim that arbitrary stderr can be safely redacted.
- Disposable checks passed: 14 role/mode policies, all 7 actual headless CLI argument parsers, 7 diagnostic cases; module syntax and whitespace clean. No permanent test file added.
- Existing task fixture now passed through producer-only closure: driver exit 0, `add checks passed`, task folder under done, brief/board agent-closed markers and href inspected. The coder preserved existing build/review/dispositions instead of repeating them. Four intent-to-add entries remain in the disposable Git index; no content staged, commit, push or release. Historical preservation before recorded review lacks a committed baseline.
- Real worker → lead → owner relay/cancellation passed, driver exit 0. The synthetic form stayed pending for a measured interval with source unchanged; cancellation returned no approval and led to no source/task writes. This adds worker relay evidence to the earlier direct form checks.
- Actual MCP failure round-trip verified safe startup category, failed result and withheld synthetic private stderr. Model provenance now separates observed runtime header (`Model`, otherwise unknown) from saved requested model; configured selection alone is not an observed identity.
- Audited adversarial runtime instructions and removed stale claims of guaranteed different-model diversity, Claude fallback mode and scratch-file write permission. Findings-only structure and actual execution/model evidence remain. Targeted generation checks passed.
- No-Claude sprint started with default plan review; outcome pending. Full MA-03/13–16 remain pending. `local-acceptance.md` records the measured/advisory/unverified capability matrix. Claude CLI is present (`2.1.312`) for later real compatibility checks.
- All seven direct no-Claude role smoke checks passed, each loading the owned team procedure and returning the exact role marker, exit 0. Saved wiki override actually ran on `gpt-6-luna`; other runtime headers showed `gpt-6.1-sol`. Disposable driver `/private/tmp/fkit-direct-role-smoke.mjs`; sanitized results `/private/tmp/fkit-direct-role-results.json`.
- Actual sandbox file probes: read-only denied disposable source and protected Git writes with EPERM; workspace-write allowed the source write but denied Git write with EPERM. The first nested-sandbox probe could not initialize, then an outside probe failed argument parsing; corrected outside invocation using the fixture cwd/script passed. No runtime-boundary claim comes from those invalid probes. Sanitized results: `/private/tmp/fkit-sandbox-boundary-results.json`.
- `decision-proposal.md` now names concrete Codex limits and affected ADR sections for owner acceptance, preserving historical accepted decisions and the open ADR-042 D2/task 0273 implementation.
- Owner selected “Explain more, then ask again” on the local-limits acceptance question. Explained role-write/planning instructions, optional trusted hooks and read-only adversarial limits in chat. **No acceptance or permission for dependent public integration inferred; no new dialog this turn.** Re-ask on the owner's next message unless it supplies the answer or asks another question. Independent fixture verification remains authorized.
- No-Claude sprint attempt reached actual plan review (fresh architect/producer approvals and independent adversarial), actual synthetic plan approval, source fix and build worklog, then hit the harness's 12-minute timeout. **Not a passed sprint.** A scoped process check found no remaining fixture process; saved plan/worklog/source were intact, with no code review or task closure yet. Extended future sprint harness runs to a bounded 30 minutes and resumed from actual durable state. Follow the source's orphaned-plan rule: re-present saved plan for actual current-run synthetic reapproval; never treat historical approval as current-run approval or repeat completed build merely to restart.
- Resumed sprint received actual current-run synthetic reapproval of the exact saved plan and passed the fresh Verify worker step. No build or plan review repeated. Independent code review is now underway; closure still pending.
- Fixed explicit empty `--model` being ignored on non-configure commands. Eight empty/nonempty flag cases now reject before setup/model launch. All nine Codex modules and the shell entry point pass syntax checks; whitespace clean.
- Independent baseline check of the **unchanged** legacy Claude launcher in the separate disposable fixture returned exit 1 / runtime `is_error: true`, without the expected role marker. This is a failing compatibility smoke, not evidence of Claude compatibility; sanitized error classification is being investigated. No public runtime integration proceeded without the unresolved owner acceptance.
- Owner asked again and then selected **“Accept limits; continue migration (Recommended)”** through the interactive question in this chat on 2026-10-29. Exact question/answer recorded in `decisions.md`. Local limits accepted; public integration remains conditional on sprint success. The earlier explanation response remains non-approval.
- Resumed sprint passed Verify and both implementation review passes, leaving an in-review ledger with no findings and command/result evidence for both. The lead then failed on an explicit CLI **usage-limit** error before coder dispositions/producer closure. Its last interim message was not a completed workflow. The fixture driver had overlooked turn status; corrected it to classify failed turns before asserting closure. Scoped process check found no owned fixture/configure process remaining. No sprint success yet.
- Desktop usage status separately allowed ordinary use; do not infer a cause across surfaces. A bounded explicit `gpt-6-luna` access probe returned the exact marker, exit 0, observed model confirmed. Explicitly changed **only the disposable fixture's** lead/coder/producer overrides to that available model and resumed remaining steps, preserving completed build/review and real settings. This is a recorded fixture selection, not silent model fallback.
- Improved local setup to ask which roles to customize rather than requiring all seven model questions. Manual terminal wiki-only selection saved only wiki and preserved default. Corrected PTY harness passed cancellation, invalid role, blank role list and duplicate-role cases with whole-fixture file snapshots unchanged; first harness attempt timed out waiting for exit without correctly draining/settling the terminal. No owned process remained. No permanent test file added.
- Legacy Claude retry again failed, fixed category network/service-related, precise cause unestablished. Compatibility remains unverified; private raw diagnostics withheld.


## Latest pause checkpoint — 2026-10-29

- Actual CLI form **submission** passed: selected `Revise fixture`, entered `Synthetic rejection.`, submitted; the tool returned that exact answer/comment and the model reported no approval or dependent action. Terminal probe exited 0 after controlled shutdown.
- Normal hook trust was persisted through the terminal UI without a bypass flag. The separate live `hook` fixture proved current-run owner marker creation during the form and consumption by Stop after cancellation. This establishes hook activation and environment propagation for that run, not every interception path. The first hook harness assertion incorrectly counted stale markers; corrected it to check the exact run ID, then passed.
- Added stable CLI minimum-version guard (0.165.0), checked against 7 supported/old/prerelease/malformed cases. Added actionable Node-not-found error to `bin/fkit-codex`.
- Bounded task 0001 in the saved disposable fixture has an actual synthetic owner approval, implemented add fix, passing scoped verification, independent reviewer + adversarial checks, a shared ledger and coder closeout/dispositions. Both passes used `gpt-6.1-sol`; diversity was disclosed. No task closure has landed. Source `clamp` is still the seeded defect for task 0002.
- First task closure attempt exposed protected `.git` writes: workspace-write headless producer could not run the source mover's Git operations and could not request escalation. Added **producer-only** `--approve-for-me` and an explicit binding to request scoped exceptions through Codex automatic approval review, relay denials and never bypass them. Four argument-policy checks passed; this does NOT establish working launch or closure.
- **Current failure to investigate on resume:** after that flag change, both producer retries returned **exit 2 with no usable response**. No mover ran. The flag/config interaction is not diagnosed; do not claim an automatic approval denial. The dispatcher currently suppresses raw child diagnostics, so returned output did not identify the startup error. Inspect a bounded direct invocation or improve sanitized startup diagnostics before another full workflow run. The task driver ended exit 1 on its expected closure assertion; this remains a failing workflow check.
- Current disposable task status is Blocked, and its Backlog row/worklog reflect the failed producer launch. Existing plan, review and verification were preserved rather than repeated. Do not reset/recreate this fixture merely to hide the failure. No approved task or sprint completion claim.
- Consolidated driver `/private/tmp/fkit-codex-verification.mjs` now persists sanitized output in `/private/tmp/fkit-codex-verification-<mode>.log`. Pointer `/private/tmp/fkit-codex-workflow-current.json` names the current fixture. `task` resumes durable state; `sprint` will isolate PATH without Claude; `pending` tests worker decision relay/cancellation; `hook` passed. **Do not run `local` against this pointer without intending to create a replacement fixture.** The sprint and pending modes have not yet passed.
- Last tracked jobs terminal: task driver session 16330 exited 1; terminal probe session 76834 exited 0; hook driver session 64456 exited 0. No owned model job was knowingly left running. Recheck actual process state on resume.
- `model-agnostic-sprint/decisions.md` is a working decision/evidence record, not an accepted ADR. `codex/README.md` updated with measured form/hook evidence, plan-review flags, explicit heal share and producer approval policy. Last syntax/whitespace checks passed before these final prose updates; no new repository test file, commit, push, release, real task closure or real wiki write.
- Separately at the owner's explicit request, saved `sandbox_mode=workspace-write`, `approval_policy=on-request`, `approvals_reviewer=auto_review` in the user's global Codex config with a backup; preserved other settings. This is user setup, not a repository artifact or evidence that the current parent session reloaded its policy.

Next: diagnose producer exit 2; complete producer-only task closure, no-Claude one-task sprint, genuine pending worker decision/cancellation and remaining local acceptance. Then finish MA-03 decisions and MA-14–16 compatibility/distribution; keep the full `plan.md` objective intact.

## Resumed-session checkpoint — 2026-10-29

- Added the direct interactive coder plan-review signal and `--no-plan-review` / `--plan-review` session flags. Headless/delegated workers do not receive that session signal. Runtime bindings map the owner tool and planning gate explicitly, without claiming a Codex planning write wall.
- Generated task/sprint instructions now distinguish unavailable adversarial passes from usable same-model passes. Generated heal commands explicitly pass the checkout root as `--share`; installed helper references resolve under `.agents/skills/`. Canonical Claude payloads remain unchanged.
- 16 disposable local checks passed: signal/flag behavior, invalid flag combinations, heal share resolution with an absent global share, dashboard execution and both seeded arithmetic defects failing their existing checks. Syntax checks and `git diff --check` passed before the last prose binding clarification. No new repository test file.
- Actual terminal owner form rendered answer choices and optional comment. Escape returned `action: cancel, answered: false`; model explicitly reported no approval and no dependent action. A later terminal run used the normal **Trust all and continue** prompt for the two inspected fkit hook definitions, without the hook-trust bypass flag. Active-hook counts, Stop execution and environment propagation are still unverified; the session was interrupted before inspection completed.
- Real app-server coder task-loop rejection passed in a fresh disposable project. Client selected the displayed rejection option; inspected source hash stayed unchanged and no approved plan or worklog was created. Fixture baseline exposed the intended add defect. The subsequent approved task run was interrupted before an owner form or completion was observed; it is NOT a passed workflow test.
- At the desktop-handoff check, both old tool session handles were missing and a filtered process check found no remaining fixture driver or fkit dispatcher process. Do not restart a job solely from stale handles.
- Consolidated disposable driver: `/private/tmp/fkit-codex-verification.mjs`; fixture pointer: `/private/tmp/fkit-codex-workflow-current.json`. Modes: `local` creates a NEW fixture and runs local checks; `rejection`, `task`, `sprint`, `pending` use the saved fixture. Inspect current fixture state before replay. Command prefix for this scoped driver was approved. The standalone terminal probe is `/private/tmp/fkit-codex-tui-probe.mjs`.
- Remaining: complete task/sprint/owner-relay checks, actual trusted-hook execution, remaining policy/source audit, local acceptance, formal decision documentation, then MA-14–16 compatibility and distribution. No real task/board closure, wiki writes, commits or pushes.

## Pause checkpoint

- Owner requested pause on 2026-10-29. The running second-round review was polled to completion (exit 0); no further goal work was started.
- Real Codex app-server owner-form round-trip succeeded: one form was emitted, the synthetic client selected `Revise fixture`, and the model explicitly reported no approval and took no dependent action. This verifies the native protocol path, not terminal widget rendering. The first probe-client attempt failed on message routing; the failed process was confirmed absent before the corrected retry.
- Second live stateful-review round completed. R1 remained open, no duplicate row was added, current coverage was refreshed, and coder/residual sections, source and task status remained unchanged according to the completed check. The synthetic defect is intentionally unrepaired.
- Resume with actual CLI form/trust UX and bounded task/sprint execution. The proposed sprint fixture/driver has not been created or run. Keep the full Codex migration goal active upon resume; do not treat the existing bounded checks as full completion.

## Implemented local path

- `codex/fkit.mjs` and `bin/fkit-codex`: opt-in role launcher, configuration interview/flags, settings view, setup, preview and headless execution. `npm run codex -- ...` is a checkout entry point.
- `codex/settings.mjs`: schema validation, default/per-role inheritance, atomic local writes and containment/symlink checks. Explicit model IDs are passed to Codex; `null` means follow its default. No account secrets are stored.
- `codex/materialize.mjs`: reads the existing ownership registry and role/skill sources, installs 28 managed skills, preserves unowned skill targets, and supplies Codex-specific tool/consult/review bindings. Reuses existing project initialization rather than duplicating its convergence grammar.
- `codex/hook.mjs`: role-bound Skill allow/deny and native-spawn routing guard, dependent on Codex trusting the supplied hook. Role-specific skill configuration works independently of this hook.
- `codex/server.mjs` and `codex/consult.mjs`: session-scoped stdio MCP dispatcher, plus shell fallback. Separate fresh CLI process per role with resolved settings; native subagents disabled. Two-hop/cycle/leaf checks and existing approved-plan fidelity checker on the normal consult route. Adversarial process uses read-only; other roles workspace-write. MCP process creation avoids the parent shell sandbox initialization issue; the authorized three-role smoke test succeeded.
- Product onboarding path: first-run model setup, intake, producer initiation, and conditional lead handoff; seven-role menu for an initiated project. Interactive workflow still needs live verification.
- `codex/models.mjs`: local Codex catalog discovery, numbered/exact-ID/default selection, and fallback when discovery fails. No access/pricing claims are inferred from catalog membership.
- `codex/owner-question.mjs`: MCP form question/answer bridge for interactive root sessions; cancellation and interruption never imply approval. Headless workers cannot invoke it. Optional trusted Stop hook checks footer/question-tool use, once per turn; client form support is detected.
- Reviewer-only `fkit_adversarial` route preserves the former external second opinion outside ordinary consult depth; its role remains read-only and a leaf. This fixes the second opinion for a reviewer reached at depth two.
- Every role now has a dispatcher-checked `fkit_skill` invocation route. Ownership comes from the existing registry; foreign skills are denied without relying on hook trust. The adversarial dispatcher exposes only this read-only loader; direct consultation and owner questions remain denied. Manual procedure reads/execution are outside the invocation boundary, matching the limit of the old Skill hook.

## Verification observed

- Codex CLI `0.165.0`: direct architect launch through the new implementation returned the fixed architect role and expected procedures; exit 0. It used the configured runtime default (runtime reported `gpt-6.1-sol`). This is a smoke check, not all-role/end-to-end validation.
- Codex `debug prompt-input` using the generated architect configuration: catalog found, architect design-spec visible, coder process-review absent. Inspection printed only the booleans; no account/config contents were saved.
- Disposable local checks: settings roundtrip/inheritance and invalid-role/runtime rejection; all seven launch argument sets; 28 generated skills; repeat setup; owner AGENTS text preserved; symlink and unowned-skill targets refused; adversarial procedure contains no recursive CLI wrapper.
- 196 role/skill combinations passed through the hook's JSON interface, plus malformed payload and native spawning rejection. This checks policy behavior, not whether every tool route triggers the hook.
- Shell quoting checked with spaces, quote and command-substitution-shaped literal input; no interpolation.
- Live adversarial launch read its generated skill and a disposable source file, found the seeded arithmetic defect at the correct line, executed a write-free Node check proving the result, and reported actual evidence. Runtime reported read-only; the source fixture was not edited. This establishes a direct adversarial pass, not the complete primary-plus-adversarial workflow.
- Review and stateful-review generation now replace the source's direct Codex wrapper and old diversity-based availability logic with a dedicated fresh-role pass and separate availability/diversity/measurement reporting. The remaining merge and ledger procedures are retained.
- Module/shell syntax and `git diff --check` passed.
- MCP JSON-RPC initialization, tool schema, self-cycle rejection before model launch, two-hop and leaf checks passed locally. No child models were invoked by those protocol checks.
- Live Codex MCP call reached the dispatcher and was rejected for a self-cycle, exit 0 for the overall smoke check. The first live attempt was blocked by MCP approval policy; the launcher now scopes autonomous approval to its own local fkit_consult tool, and marks that server required. This proves wiring and rejection, not successful nested role execution.
- Authorized live chain succeeded: lead → coder → adversarial-reviewer. Both nested consults reported exit 0, no timeout or truncation; both worker sessions reported model `gpt-6.1-sol`. Coder and adversarial independently ran write-free checks exposing the seeded subtraction defect; lead relayed the adversarial result and same-model disclosure. The seeded file remained byte-identical. This establishes bounded collaboration, not a full task/sprint workflow.
- After changing headless transport to stdin, fake-CLI integration checks passed for both direct and MCP launches with a 300 KB task, exact task preservation, role override and explicit lineage, plus returned model metadata. This avoids OS argument limits for larger review diffs. The complete live chain has not been repeated after that transport change.
- Existing `npm test` first run failed under the sandbox: local server tests reported `listen EPERM`, and a deadline process-cleanup assertion failed. The permitted outside-sandbox rerun passed: 951 tests, 950 passed, one skipped, zero failed, about 83 seconds. This verifies existing regression coverage; the new runtime is additionally checked by the disposable checks above, not by a newly added repository test suite.
- Owner question protocol/unit checks: a request stays pending until the client responds; accepted answers, cancellation, interruption, unsupported form capability, headless rejection and late-response rejection behaved as specified. MCP round-trip and Stop block-once/marker-consumption checks passed. Live CLI form rendering/trust still needs verification.
- Terminal checks with a fake CLI verified default and wiki override setup, cancellation preserving settings, the seven-role menu and successful producer-to-lead routing. The terminal harness could not access `/dev/tty` under the sandbox and therefore did not see intake questions; separately, the existing intake script ran with a permitted controlling terminal, captured all six supplied values, and the file was inspected. No claim of a full interactive model session follows from those checks.
- Live stateful review succeeded with reviewer plus reviewer-only adversarial pass. Inspected the generated synthetic ledger: R1 was deduplicated, primary/adversarial behavioral failures were recorded, coder response remained empty, source and task status were unchanged. Both runtime headers reported `gpt-6.1-sol`; the primary model conservatively reported diversity unknown because it could not see its own header.
- Live producer onboarding succeeded on a PATH with Node/Codex and standard tools but no Claude executable. Producer wrote the brief/root overviews, architect wrote architecture.md, and only wiki performed fixture wiki ingestion. Inspected generated docs and unchanged source hash. No Git commits, dependencies, source edits, tasks or sprint closures were created.
- Local Codex catalog schema was verified through its CLI; parsing checks covered current/legacy IDs, hidden/duplicate entries and selection errors. A live wiki query used the saved `gpt-6-luna` override successfully (runtime header confirmed the alternate model); other roles retained the runtime default.
- First-run model setup cancellation now exits 0 without settings, scaffold or model launch; verified with a fresh pseudo-terminal fixture. Invalid saved settings identify the file requiring correction.
- A second 196-case matrix passed through the actual MCP skill loader, covering every role and skill. Tool catalogs also confirmed headless owner exclusion, reviewer-only second-opinion route, and adversarial leaf exposure. Live wiki loading through fkit_skill succeeded on `gpt-6-luna`, followed by a read-only query.
- Stop hook commands are stable across sessions; per-run marker identity is carried through the launch environment instead of changing the hook definition/hash every launch. Hook activation/trust remains a live verification item.
- Dispatcher shutdown was checked against a fake worker deliberately ignoring SIGTERM: escalation terminated it, the server exited, and a PID existence check confirmed no orphan remained. MCP cancellation targets the affected operation; owner questions reject late answers after cancellation.

## Remaining acceptance work

Verify normal hook trust and actual CLI owner-form rendering; verify a complete interactive owner relay and interrupted/rejected plan behavior; exercise bounded task and sprint flows and multi-round ledger behavior; assess remaining source prompts for runtime-binding conflicts. All seven roles, dispatcher skill loading and an alternate wiki model have participated in bounded live checks, but that is not all-workflow coverage. General write/approval boundaries remain advisory; dispatcher ownership, optional trusted Stop checks, consult topology and existing carry-check fidelity have their stated limits. Review sandbox must be reconciled with accepted but unshipped ADR-042 D2. No full-equivalence or release-ready claim yet.

Claude compatibility and public packaging remain the following stage. The published global launcher and installer were not replaced. No wiki files, task/sprint lifecycle state, commits or releases were changed by this implementation work.
