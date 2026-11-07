# Task 0520 — Stop the update check’s git ls-remote from prompting over SSH

## Authority

Build worker; caller fkit-lead / fkit-sprint-ship-loop Sprint 15. Owner approval relayed, not independently authenticated; trusted declared approval. 2026-11-05, interactive fkit_roles.fkit_ask_owner in root lead, observed 09:28:33 UTC:

> Approve plan + correction (Recommended) — Accept HTTPS-only automatic Git checks, skipped non-HTTPS notices and the one-call protocol-policy override. Approve the three named cases and exact positive skip filters. Proceed through implementation, verification, review and producer closure; no commit or push.

Frozen plan.md, verification-amendment.md and plan-review.md retain their bytes; historical draft wording does not reopen approval. Scope: three approved source paths, bounded fixture support and three named process cases. Fresh Verify owns the filtered default-equivalent suite and four prove-red cases; Build does not duplicate those lanes.

## Baseline / grounding

Read full brief, approved plan and amendment, review record, CONTRIBUTING.md, runtime README/current migration handoff, launcher and existing banner tests. Planned launcher/test/CONTRIBUTING/dispatcher SHA-256 values all match. Node v24.13.0; selected Git /usr/bin/git. Existing source and protected/unrelated fingerprints plus Git-index hash: evidence/build-baseline.json; three before-images and preexisting-source.diff preserve actual baseline, including unrelated CHANGELOG edits.

Wiki query: [[systems/install-and-self-update]], [[systems/testing-and-verification]]; silent optional notice and black-box process verification apply. Note: 12 commits touched ai-agents/ since watermark 185ac5e07e918c089ed3afd23496587315342000; current task/owner ruling and CONTRIBUTING take precedence over historical wiki text. No wiki writes.

## Checkpoints

- Baseline recorded before implementation. Reproduction pending; launcher remains unchanged. No functional pass yet.

## Decision log

- none — no implementation fix or obvious-winner choice applied at baseline.

## Coverage limits / handoff

No native HTTPS/TLS/proxy execution is planned: synthetic helper proves transport selection/configuration visibility only. No full unfiltered suite, excluded-case exercise, benchmarks, load runs, process-observer investigation, installation, native config/settings edits, commit, push or task closure. Preserve existing watchdog/installer/curl/throttle/rendering/runtime behavior. The three named banner exclusions and the exact mixed board exclusion retain the functional omissions disclosed in verification-amendment.md.

### Fixture preparation checkpoint

Initial reproduction attempt did not reach launcher assertions: real-Git HTTPS positive control failed its empty-stderr assertion because /usr/bin/git dispatched through Apple developer-tool discovery and emitted sandbox confstr/xcodebuild warnings. Launcher unchanged; this is fixture setup failure, not product reproduction or an expected red. Exact sanitized output: evidence/reproduction-fixture-failure.log. The shell wrapper also used zsh’s read-only `status` variable; corrected to a task-specific name. Resolving the actual developer-tool Git executable directly avoids the discovery shim; no personal config read or repair.

Second fixture preparation attempt reached real Git directly but its HTTPS control found the legacy stub-only REMOTE_SHA is 41 characters; Git’s real helper protocol expects a 40-character SHA-1. No launcher reproduction yet. Exact assertion output: evidence/reproduction-fixture-sha-failure.log. New real-Git fixtures use their own valid 40-character synthetic SHA, preserving existing stub cases unchanged.

### Unchanged-launcher reproduction — PASS

Command: `node ai-agents/tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/evidence/reproduce.mjs`; child exit 0. Actual direct Git: /Applications/Xcode.app/Contents/Developer/usr/bin/git. HTTPS helper control exit 0 with identity/path/protocol exchange verified; configured SSH sentinel control exit 128 with exactly one sentinel call. Unchanged launcher exit 0, exactly one SSH sentinel call, empty stderr, no banner or .latest, empty .update-check retained. Source hash still baseline 91fefe7a6c138b1e390f5986c3c6c62ba85272d09614edad409cfc88d1d4383a. Evidence: reproduction.log, reproduction-result.json, reproduce.mjs and fixture-fragment.txt. No real SSH, auth, keys or native network helper reachable. Proceed to approved three-case expected red.

Decision log checkpoint: direct Apple Git selection and a separate valid synthetic SHA are localized fixture-support choices within the approved isolation/real-Git plan; controls confirmed both. Existing stub SHA untouched. No product fix yet.

### Three approved cases — expected RED established

Command: `node --test --test-name-pattern='^0520/' test/update-banner.test.js`; child exit 1. Actual runner: 3 tests, 0 pass, 3 fail, 0 cancelled, 0 reported skipped. All three HTTPS positive controls passed (exit 0, exact valid ref and helper identity/path/exchange); both configured SSH positive controls passed their expected sentinel failure (exit 128, exactly one sentinel call). Both SSH launcher cases exit 0 and fail specifically `automatic update check must not invoke SSH`, with one sentinel call each. HTTPS/scoping case exits 0 but fails its expected-banner assertion: baseline inherited SSH-only policy prevents helper invocation. These are functional expected reds, not setup failures. Evidence: expected-red.log/json and expected-red-result.json; launcher hash remains unchanged.

### Decision log — approved implementation

- Verified defect: unchanged launcher invokes the configured SSH sentinel for SCP and ssh:// rewrites. Apply GIT_ALLOW_PROTOCOL=https only to the existing env-wrapped Git call: verified CORRECT, mechanical/localized and exactly inside approved plan. Owner accepted skipped non-HTTPS notices and override of inherited/configured protocol policy for this call.
- Fixture support choices: direct actual Git on macOS avoids its discovery shim; separate valid 40-character real-Git synthetic SHA preserves legacy stub behavior. Both qualified as mechanical, localized support for the approved positive controls; no extra test case/file or product behavior change.
- No other autonomous fix or obvious-winner decision.

### Targeted fixed run — GREEN

Same three-case command; child exit 0. Actual runner: 3 tests, 3 pass, 0 fail/cancelled/reported skipped. Both SSH cases retain passing positive controls, exit 0, unchanged help output/empty stderr/no banner/no .latest/empty attempt stamp and unchanged Git config bytes; SSH sentinel calls now 0. HTTPS case: helper invoked once, correct banner/.latest, synthetic proxy visible, helper observes https, curl observes original inherited ssh, config bytes unchanged. Evidence: targeted-green.log/json. Single-call restriction and Unreleased entry applied; no watchdog/curl/installer/throttle/rendering/runtime edit.

### Final Build checks / preservation checkpoint

- Focused command: `node --test --test-skip-pattern='^0284/(?:git-deadline|term-ignored|no-stray):' test/update-banner.test.js`; child exit 0. Actual runner: 18 tests/pass, 0 fail/cancelled/reported skipped. These are 15 existing plus 3 new; the three excluded bodies are omitted from reporting, not reported as skipped. Existing 18 declarations plus 3 new = 21 top-level cases. No excluded body ran.
- `sh -n claude/fkit-claude.sh`: exit 0; `node --check test/update-banner.test.js`: exit 0.
- `git diff --check`: exit 2 on preexisting Task 0552 — Remove test timing restrictions — evidence/build-source.diff whitespace and plan.md final blank line. Both files independently match baseline fingerprints. No out-of-scope fix. `git diff --check -- claude/fkit-claude.sh test/update-banner.test.js CHANGELOG.md`: exit 0. Exact diagnostics in whitespace.log/json.
- Node emits its existing MODULE_TYPELESS_PACKAGE_JSON warning; no package/config change made. Child launchers have empty stderr as asserted. Initial two fixture-setup failures remain explicitly recorded; neither counted as an expected red or product pass.
- All 67 baseline protected/unrelated files unchanged, including CONTRIBUTING, dispatcher, frozen plan trio, task brief, sprint/driver records and prior changes. Git index hash unchanged. No task moves, closure, commit or push. No partially written source or outstanding Build work.

Evidence/build-audit.json holds exact source before/after SHA-256, protected-plan SHA-256/Git blob identities, index fingerprint, check commands/statuses and actual counts. Evidence/build-source.diff is the Build-only diff against saved preexisting source, excluding unrelated CHANGELOG changes; before/after snapshots preserve exact bytes. Evidence/run-build-check.py records child status rather than assuming its own wrapper status is the test result. Logs omit runner-rendered measurement fields; no timing thresholds or observations inform acceptance.

### Fresh-context handoff / unexecuted coverage

Fresh Verify (separate context) still owns the approved filtered default-equivalent suite and all four existing prove-red mutations. Build ran neither; no full-suite/prove-red pass claimed. Do not run the frozen negative-filter commands. The corrected default-equivalent command is in verification-amendment.md.

Excluded banner bodies: 0284/git-deadline, 0284/term-ignored, 0284/no-stray. The broader suite must also exclude exactly `fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile`; its task creation after abandoned break, lock-owner/break-file cleanup and waiter-backoff coverage remain deferred together. Existing opt-in skips remain; no benchmarks enabled. Native HTTPS/TLS/proxy operation, Linux execution and live authentication remain unexecuted. Synthetic helper evidence establishes transport selection/configuration visibility and call-local environment scoping only.

Fresh reviewer, any Process-review worker and producer closure are separate driver phases. Build conducted no peer review/self-review substitution. Ready for fresh Verify/Review; no source changes pending.

### Fresh Verify — preflight / functional lane checkpoint (2026-11-05)

Task0520 — Stop the update check’s git ls-remote from prompting over SSH. VERIFY ONLY under root lead’s relayed owner approval quoted above; trusted declaration, not independent authentication. No source approval inferred from historical draft labels. No nested role calls or owner form.

Read Build worklog/audit/diff, actual approved implementation diff, CONTRIBUTING, package scripts and existing prove-red script. fkit-query grounding: [[systems/testing-and-verification]] and [[systems/install-and-self-update]]; current CONTRIBUTING and latest owner ruling govern the exact filtered commands. Wiki staleness: 12 commits touched ai-agents/ since watermark 185ac5e07e918c089ed3afd23496587315342000; no wiki writes.

Preflight PASS: Build audit SHA-256 d3db24104949af01b8ca9d05b80438d06a198120db71f2653e73e69fc013ed20; Build-only patch SHA-256 019673d62862ede2e7653de2f7d2eed43d601fef56cd270bcb5092376f802b94. All three source after-hashes, 67 protected/unrelated fingerprints, frozen plan trio SHA-256/Git blobs and index match Build. Snapshot 2083 existing files for post-check preservation (worklog is the sole existing permitted write). Durable evidence: evidence/verify-preflight.json; evidence/run-verify.py is orchestration only, not a new test or mutation.

Single filtered default-equivalent run begins next. Command uses the amendment’s exact positive --test-skip-pattern and both default globs, expanded in sorted shell-equivalent order by the wrapper. Exactly four existing prove-red cases follow as a separate lane. Actual child exit is captured independently; no suite rerun, excluded-body exercise or benchmark enablement planned. Functional lane results pending.

#### Verify decision log

- none — no source fix or obvious-winner implementation choice. Only authorized evidence/worklog writes. Historical global whitespace failure on unchanged Task0552 — Remove test timing restrictions artifacts will not be repeated or repaired.

### Fresh Verify — filtered functional run FAILED / prove-red checkpoint

Exactly one amended filtered default-equivalent run completed; wrapper exit 1 and actual child exit 1. Actual runner totals: 970 tests, 40 suites, 946 pass, 23 fail, 0 cancelled, 1 reported skip, 0 todo. The skip is the existing opt-in board benchmark; no benchmark enabled. The four explicitly excluded bodies are omitted, not four reported skips. All three new process cases pass: 0520/scp-rewrite, 0520/ssh-url-rewrite and 0520/https-preserved-and-scoped.

Board-reader and board-server failures report listen EPERM (operation not permitted) on loopback; this is an actual local listener sandbox boundary. Separate launcher failure: bare first use: each runtime saves once and continues fresh onboarding or existing-project menu, test/launcher-contract.test.js:669, actual 9 answered terminal prompts versus expected 15 steps (the six fresh-intake prompts are absent from the transcript). Its fixture transcript ends with launcher exit marker 0, so it must not be called a passing assertion. No timing, load, process-state or native configuration investigation. No rerun to erase the red; no source fix.

Durable actual command, selected case lines, output and counts: evidence/verify-filtered.json and evidence/verify-filtered.log. Initial per-lane checkpoint: evidence/verify-filtered-checkpoint.json. Exactly one requested full filtered run has executed. Existing prove-red lane starts next with its own durable checkpoint; it remains a required independent result regardless of this red.

Verify decision log: none — no source fixes or obvious-winner implementation choices.

### Fresh Verify — complete; required checks FAILED

Task0520 — Stop the update check’s git ls-remote from prompting over SSH. Verify unit DONE with failed checks; task/review/closure status unchanged. Code changed: NONE. No retries, new cases, new mutations or source fixes. No owner form or nested role calls.

Executed exactly once:

```sh
node --test --test-skip-pattern='^(?:0284/(?:git-deadline|term-ignored|no-stray):|fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$)' test/*.test.js test/board/*.test.js
npm run test:prove-red
```

The orchestration wrapper expands the two globs into the same sorted file arguments; exact child argv and numeric child exits are recorded separately from wrapper exit in verify-filtered.json and verify-prove-red.json. Both child and wrapper exit 1 in both lanes.

| Lane | Actual result |
|---|---|
| Filtered default-equivalent | 970 tests / 40 suites; 946 pass, 23 fail, 0 cancelled, 1 reported skip, 0 todo; child exit 1 |
| New approved process cases | 0520/scp-rewrite, 0520/ssh-url-rewrite, 0520/https-preserved-and-scoped all pass |
| Prove-red baseline 0b | RED; 75 tests / 4 suites; 74 pass, 1 fail, 0 cancelled/skipped/todo |
| Prove-red baseline 0c | GREEN (script exposes result, not nested counters) |
| M1 | RED at named matrix assertion; script accepts named check and hook baseline 0c is green |
| M2 | RED; script accepts named check; proof remains invalidated by failed launcher baseline 0b |
| M30 | RED; script accepts named/narrowness checks; proof remains invalidated by failed launcher baseline 0b |
| M31 | RED; script accepts named/narrowness checks; proof remains invalidated by failed launcher baseline 0b |
| Prove-red overall | FAILED, child exit 1; script reports failed step(s): 0b. Not a four-mutation passing gate |
| Scoped source whitespace | exit 0 |

Filtered failure diagnostics: 22 board tests report `listen EPERM: operation not permitted` on loopback. One launcher test fails `9 !== 15` at test/launcher-contract.test.js:669: nine answered prompts versus fifteen expected steps, with the six fresh-intake prompts absent. Its fixture launcher nevertheless emits terminal exit marker 0. Unmutated prove-red baseline 0b repeats that same existing first-use assertion failure, not an update-banner failure. Numeric nested-suite exit is not exposed by prove-red; only its red result and retained suite output are available. Evidence: verify-prove-red-0b.log/json. Original retained native output path is in those records; it has not been deleted.

No product defect in the approved three-path patch is established by these failures, and no exact source fix is justified by this evidence. Listener restriction is an observed sandbox boundary; the first-use cause remains unresolved. Diagnosis/repair of startup/native configuration is outside this unit. Driver disposition is needed before any new verification or Build scope. No scoped escalation requested or denied; no automatic-review rejection occurred. The single-run instruction was preserved rather than launching another full suite.

Coverage disclosures: three named banner bodies and the exact mixed board body are absent from runner output; they are not four reported skips. The sole reported skip is the retained opt-in benchmark. No unfiltered default pass claimed; no omitted body, benchmark, timing/load/process-observer lane or native configuration repair executed. The mixed board body's abandoned-break task creation, lock-owner/break cleanup and waiter-backoff coverage remains deferred together. Native HTTPS/TLS/proxy, live authentication and Linux remain UNVERIFIED. Synthetic helper success proves only isolated transport/configuration/environment behavior. Shell/JS syntax, focused 18-case banner checks, reproduction and expected red were not repeated because fingerprints matched and no new concern required them. Historical global whitespace exit 2 on unchanged archived Task0552 — Remove test timing restrictions artifacts was not repeated or repaired.

Preservation: all 2083 preflight existing-file fingerprints, including the 67 Build protected/unrelated records, approved plan trio, Build audit/patch and three source hashes remain unchanged. Git index SHA-256 remains 464773f2e72a7be7284f8b9f62be585d6aa87f5d758efc5e515c40a61b078799. Only this worklog and Verify evidence were written. Retained Task0537 — Make the launcher update-check stall test reliable when npm test runs on a loaded machine scratch and Task0553 — Include task titles alongside IDs in owner-facing communication records preserved; no process inspection, cleanup or task/board/wiki/config/index changes. Final fingerprints: evidence/verify-final-protected.json; overall result: evidence/verify-final-audit.json. Fresh independent review, any complete Process-review and producer-only closure remain root-driver phases, not performed here.

#### Verify final decision log

- none — no source fixes or obvious-winner implementation choices; recorded actual failures without rerunning or widening scope.

### Process-review — steps 0–7 complete; verification remains Blocked (2026-11-05)

Task **0520 — Stop the update check's git ls-remote from prompting over ssh when git rewrites GitHub URLs**. Fresh fkit-coder Process-review worker, caller fkit-lead / fkit-sprint-ship-loop. Loaded owned `fkit-process-stateful-review` through `fkit_skill`; used ADR-019/032/055 method under the carried full approved plan/amendment and quoted standing approval. Approval relay is trusted prose, not independently authenticated. No owner form or additional consult.

Root's actual owner failed-gate disposition, **2026-11-05**, **interactive fkit_roles.fkit_ask_owner in root lead**, root-recorded **10:00:21 UTC**, verbatim:

> Keep blocked; continue implementation (Recommended) — Leave this task open with failed verification recorded, then continue the next eligible sprint task. No closure exception.

The latest root-chat owner ruling remains controlling:

> I'm repeating again. If we have any mentions of delays, of timeouts, or of benchmark, durations of tests, or whatever, we should ignore them for now. Let's just continue working on the implementation tasks.

No deferred lane, startup/configuration diagnosis, unrelated first-use assertion repair, broad rerun or archived formatting fix was undertaken. No waiver, task closure or close-ready claim.

#### Process-review method record

| Step | Completed result |
|---|---|
| 0 — open and ground | ID 0520 resolves to existing ledger; read full brief/review/worklog, all three accepted residuals and re-raise conditions, CONTRIBUTING, runtime README/current migration handoff. Skimmed ADRs 009/015/019/032/034/055/057/061; ADR-042 coverage limits interpreted under ADR-061. Read-only fkit-query grounding recorded in Coder response. |
| 1 — novel set | Zero reviewer finding rows, zero previous coder rows; **0 novel findings**. Verification failures were not converted into invented findings. |
| 2 — loop check | No residual/ADR reopening condition established. HTTPS-only notices/custom SSH consequences, child-local protocol policy and exact approved exclusions stay settled; none waives failed required checks. |
| 3 — evidence and severity | Read actual Git-call/automatic-continuation flow, new fixture/assertions and Build patch/CHANGELOG. Compared source/patch/frozen plans/index fingerprints; all match. No novel claim or severity to assign. Existing first-use cause and patch attribution remain unestablished. |
| 3.5 — classification/oscillation | Zero novel Defect/Frontier-move rows. No proposed fix or prior coder disposition to oscillate against. No new defect confirmed. |
| 4 — verdict/status rows | Zero rows; empty prescribed table preserved. No synthetic blocked finding or placeholder ID. |
| 5 — report/gate | Summary, suppressed-as-settled pointers and convergence call recorded in Coder response. No code change required; source evaluation converged. Owner already resolved the failed-gate question: keep blocked and continue implementation elsewhere. Standing approval exercised for no fix. |
| 6 — apply/status | **NONE** applied. Existing residuals/header/Coverage/reviewer findings unchanged; no new residual. Ledger stays `in-review` because verification is red and owner declined a closure exception. |
| 7 — report/handoff | Full coder record in review.md; this worklog record and preservation audit. Return completed Process-review unit with task/closure still blocked. No commit, push, staging or mover. |

#### Process-review decision log

- **NONE** — no unattended source fix and no obvious-winner implementation choice. No finding required a change. Keeping verification blocked follows the quoted owner disposition, not a new residual or verification waiver.

#### Actual execution versus inherited results

This worker executed read-only source/document inspection and SHA-256/Git-blob/index comparisons, followed by document/preservation validation. It ran **no behavioral tests, suite, prove-red, syntax or whitespace rerun**. Current scoped source and approved artifacts match retained evidence; no post-review source edit triggers new root reverify. Required checks remain failed regardless.

Primary review actually executed the three approved process cases **3/3 pass**, shell/JS syntax and scoped source whitespace, all exit 0. The independent leaf performed static inspection/hash comparison only; usable, no behavioral execution. **Both passes used the same model. A different model is recommended for a broader second opinion.** Configured/requested `gpt-6.1-sol`; exact serving identity and diversity unknown. Reviewer-owned evidence/report remain verbatim in review.md.

Inherited Build: SSH attempt reproduced on unchanged source; three expected reds followed by targeted **3/3** and corrected focused **18/18** passes; syntax/scoped whitespace pass. Broad whitespace exit 2 on byte-preserved archived Task 0552 — Remove test timing restrictions artifacts remains recorded, unrepaired and not repeated.

Inherited Verify: amended filtered suite **exit 1; 970 tests, 40 suites, 946 pass, 23 fail, 1 reported skip, 0 cancelled**. Twenty-two loopback-listen EPERM failures and one existing first-use **9 versus 15** assertion; cause/patch attribution unresolved. Three approved new cases pass. Prove-red **exit 1, hard gate FAILED**: launcher baseline 0b **74/75 pass**, hook 0c green, four mutants red. M1 has its green hook baseline; M2/M30/M31 launcher proofs remain invalidated by 0b. No passing full-suite/prove-red gate or waiver claimed.

Approved exclusions remain exactly the three named banner bodies and mixed board body in the amendment; four omitted bodies are not reported skips. Existing opt-in coverage remains disabled. The mixed body's task creation, abandoned-break handling, lock-owner/break-file cleanup and waiter-backoff coverage remain deferred together. No unfiltered default run, native HTTPS/TLS/proxy, live authentication or Linux certification. Synthetic helper success covers isolated transport/configuration/environment behavior only.

#### Process-review preservation and return

Before docs writes, fingerprinted 3,133 existing files (excluding .git internals/node_modules; index checked separately). Three current source hashes, Build patch, all three frozen plan hashes/Git blobs and index match Build/Verify. This worker writes only Coder response, this append and new necessary evidence `evidence/process-review-audit.json`. Initial whole-workspace preservation assertion FAILED: besides these two permitted existing-file changes, fingerprints changed concurrently for `ai-agents/sprints/sprint-15.md`, this task's `brief.md`, and Task 0548 — Use native runtime/model and effort defaults and retire fkit selectors — `brief.md`. This worker did not edit those paths; actor attribution is unverified. No rollback or repair. Whole-workspace byte preservation cannot be claimed. Final audit records all observed deltas separately and verifies reviewer prefix/header/Coverage/findings, accepted residual suffix, original worklog prefix, source/approved artifacts/index independently. No scratch cleanup, other-task/board/wiki/config/install edit by this worker, task move, commit or push.

Root handoff: Process-review method complete, **0 novel findings/dispositions; source changes NONE; new residuals NONE; ledger `in-review`; failed verification still blocks closure**. Owner decision is resolved; no NEEDS-DECISION or new owner form. Root records accurate Blocked status and continues its next eligible sprint implementation task under the existing ruling.
