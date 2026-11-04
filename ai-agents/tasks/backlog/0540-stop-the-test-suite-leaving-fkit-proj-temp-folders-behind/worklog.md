# Task 0540 worklog

## Build authority and boundary — 2026-11-04

Fresh Build worker, caller fkit-lead / driver fkit-sprint-ship-loop; chain lead → coder, hop 1 of 2. Relayed owner approval through interactive `fkit_roles.fkit_ask_owner`, 2026-11-04 08:09:11 UTC:

> Approve plan (Recommended) — Reproduce first, then apply only the three-call cleanup fix and specified verification. An unrelated red may persist, but full acceptance and closure remain blocked until resolved or separately ruled.

Approval is trusted driver prose, not independently verified owner-channel evidence. Carried plan hash matches disk: `a7245d31f2c7c91d6efd1b6642a08c08db2e04f3`. No plan/review/status/wiki edits by this worker. Bounded work: baseline, focused attribution, reproduced three-call ownership fix, focused post-fix check. Full acceptance and deliberate-failure probes belong to a fresh Verify worker.

## Grounding and environment

Read brief, AGENTS.md, CONTRIBUTING.md, runtime README/handoff, comment/evidence conventions, test fixture/harness source. Applied read-only fkit-query. Wiki context: [[systems/testing-and-verification]], [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]], [[tasks/run-only-the-checks-a-change-needs-not-the-full-suite-every-time]]. Current CONTRIBUTING mapping requires npm test; no new permanent test/mutant. Wiki has no current leak attribution. Note: 11 commits touched ai-agents/ since wiki watermark `185ac5e07e918c089ed3afd23496587315342000`; current source takes precedence for changed facts. Later wiki ingest is librarian-only.

Initial HEAD `20813ecb23974af0f6feac7404b0b5a8a1f4608a`. Existing unrelated dirty task/sprint/wiki/report files preserved; exact status saved in each measurement JSON. Source test initially clean. Three direct makeProject results are absent from existing module trash ownership. No source edit yet.

`ps -axo pid,ppid,pcpu,comm` denied in sandbox (exit 127); scoped elevated retry succeeded (exit 0). This was process inspection only, no denied test run. Uptime load averages initially 7.33 / 8.06 / 8.18; idle condition not established. Measurement runner records command, UTC, Node/platform, canonical default temp root, load, sanitized process IDs/CPU, exact prefix directory-name sets, set differences, test summaries and source hashes. Raw test output stays in ignored scratch, never copied wholesale into task artifacts.

## Measurements

Durable records: `evidence/*.json`; scratch runner/logs: `.fkit/tmp/0540-build-20261104/`. Runner saves initial census before launching and checkpoints during execution. No prefix sweep or old-folder deletion performed.

### Unchanged full baseline

2026-11-04 08:12:53.113 UTC start; `npm test` (exact package expansion: `node --test test/*.test.js test/board/*.test.js`), scoped elevated runtime for process monitoring/local listener checks. Node v24.13.0, Darwin, 14 logical CPUs. Default canonical temp root `/private/var/folders/j8/6zcjvzwx1t5csm7rynmsjlr80000gn/T`; no TMPDIR override. Evidence: [baseline-full.json](evidence/baseline-full.json).

Exit 1; 971 tests, 40 suites, 969 pass, 1 fail, 0 cancelled, 1 skip, 0 todo. Runner duration 75845.322666 ms; process wall time 75.98764825 s. Default reporter was spec, not TAP; summary extracted from its `ℹ` lines after observing that format. Existing skip: `benchmark: snapshot against the per-member path on corpus-sized boards (FKIT_BOARD_BENCH=1)`.

The sole failed assertion: `test/dual-home-parity.test.js`, `live corpus: the enforced dual-homed set is non-empty and every file is present in BOTH homes`. Current mismatch count is FOUR, rather than inherited three: `.DS_Store`, `knowledge-base/.DS_Store`, `tasks/.DS_Store`, `wiki-vault/.DS_Store`, all live-only relative to ai-agents/. No metadata removed or parity assertion changed. No sandbox-denied test attempt and no PTY failure in this run. Passing-suite acceptance remains blocked.

| Prefix | Before | After | Newly surviving | Initial paths removed |
|---|---:|---:|---:|---:|
| fkit-proj- | 28 | 31 | 3 | 0 |
| fkit-stub- | 1 | 1 | 0 | 0 |
| fkit-argv- | 1 | 1 | 0 | 0 |
| fkit-conv- | 0 | 0 | 0 | 0 |

New project names: `fkit-proj-JN925z`, `fkit-proj-SbcTIk`, `fkit-proj-nat4FV`. Exact initial and final name sets remain in JSON; all initial directories preserved. These diagnostic survivors must also remain untouched by subsequent checks.

Load start 8.28515625 / 8.51611328125 / 8.36279296875; sampled loads and final load in JSON. Busy-machine timing, not proof of idle-Mac budget. Process monitor includes its own runner PID 11392 because its argv contains npm test. Pre/post only that measurement runner matched; sampled test candidate PIDs trace through npm PID 11418 and test runner PID 11432 back to it. No competing test tree observed at sampled intervals; continuous absence of arbitrary outside file activity is not provable. Full-run growth is a leak candidate until focused attribution completes.

### Unchanged focused attribution

`node --test test/orphan-cleanup.test.js`, 08:14:26.766–08:14:38.125 UTC. Exit 0; 23 tests, 7 suites, 23 pass, 0 fail/cancelled/skipped/todo, runner duration 11153.737666 ms, process wall 11.177228833 s. Evidence: [baseline-orphan.json](evidence/baseline-orphan.json). Loads start 17.37158203125 / 11.931640625 / 9.7294921875; end 15.955078125 / 11.8984375 / 9.75634765625. Sampled processes belong to runner 85350 → node runner 85376 → file worker 85377; pre/post only measurement runner matched.

| Prefix | Before | After | Newly surviving | Initial paths removed |
|---|---:|---:|---:|---:|
| fkit-proj- | 31 | 34 | 3 | 0 |
| fkit-stub- | 1 | 1 | 0 | 0 |
| fkit-argv- | 1 | 1 | 0 | 0 |
| fkit-conv- | 0 | 0 | 0 | 0 |

New project names: `fkit-proj-Vt9BBK`, `fkit-proj-iG1010`, `fkit-proj-jUSbu6`. Its initial sets equal the full baseline's final sets exactly. Source has exactly three makeProject allocations, all direct test-body calls, with no trash registration. Other local temp allocations go through tracked tmp(). The unchanged focused file reproduces the same +3 project-only growth as the full suite, attributing the candidate to these three unowned calls. No source/instrumentation edit was needed for reproduction.

### Narrow fix and focused post-fix check

Added `project(options)` beside tmp(): calls makeProject(options), immediately pushes the returned path to trash, returns it. Changed exactly the three test-body calls to project(). Existing module after hook, cleanup()/cleanupStub(), chmod restoration, assertions, test names/counts, stubs and timeouts preserved. No harness/global cleanup change and no new code comments.

`node --test test/orphan-cleanup.test.js`, 08:15:07.533–08:15:18.071 UTC. Exit 0; 23 tests, 7 suites, 23 pass, 0 fail/cancelled/skipped/todo, runner duration 10346.555041 ms, process wall 10.368036375 s. Evidence: [fixed-orphan.json](evidence/fixed-orphan.json). Loads start 18.17724609375 / 12.75537109375 / 10.126953125; end 17.197265625 / 12.787109375 / 10.1826171875. Busy timing only. No outside matching test process observed in pre/post snapshots; ten-second sample is retained in JSON.

| Prefix | Before | After | Newly surviving | Initial paths removed |
|---|---:|---:|---:|---:|
| fkit-proj- | 34 | 34 | 0 | 0 |
| fkit-stub- | 1 | 1 | 0 | 0 |
| fkit-argv- | 1 | 1 | 0 | 0 |
| fkit-conv- | 0 | 0 | 0 | 0 |

Focused post-fix initial/final sets are identical, and the before set equals focused baseline's after set. All original 28 project, 1 stub, 1 argv directories, plus six reproduction project directories, survive. Nothing swept or manually deleted. These checks establish observed normal-completion cleanup only, not crash recovery or all failure paths.

Exact measurement commands, serial and scoped elevated:

```sh
node .fkit/tmp/0540-build-20261104/measure.mjs baseline-full npm test
node .fkit/tmp/0540-build-20261104/measure.mjs baseline-orphan node --test test/orphan-cleanup.test.js
node .fkit/tmp/0540-build-20261104/measure.mjs fixed-orphan node --test test/orphan-cleanup.test.js
```

No test command denied by sandbox. Process-inspection-only sandbox denial and successful retry are recorded above. The measuring wrapper exits normally after saving the child status; `exit` inside each JSON is the actual tested command's exit, not wrapper success.

### Build audit and handoff

[build-audit.json](evidence/build-audit.json) compares all cross-run name sets, source bytes, command results, times and loads. The permanent source bytes exactly equal HEAD plus the approved six-line helper and three call replacements. Fixed source SHA-256: `b2d4fe7d4ef42b7899fa92c11903393c23ec5a89ad808933d3fd7ffee65a987f`. Actual patch: [approved-source-diff.patch](evidence/approved-source-diff.patch). `git diff --check` passed. `git diff -- test/harness.mjs test/structure-notice.test.js` empty. No temporary source mutation was made in Build, so no restoration is claimed for the deferred probes.

This worker changed only test/orphan-cleanup.test.js, this worklog, task-local sanitized evidence and ignored measurement scratch. No task/sprint movement, owner metadata deletion, plan/review/wiki/native-config/binary edit, peer review, commit or push by this worker. Old shared-temp folders remain untouched; only the owner may choose manual cleanup while no tests run. No deletion requested by this task.

## Decision log

- Use the supplied approved plan unchanged; no replanning or peer consult needed.
- Use default-temp measurements and scoped runtime escalation for process inspection/local listener tests; no acceptance waiver. Each measurement is serial. Classify environment timing as measured under load, never idle-Mac proof.
- Continue bounded attribution/build despite reproduced independent parity red, under the quoted approval. Four rather than three live-only .DS_Store paths changes the recorded observation, not the authorized source scope. No metadata repair or acceptance waiver.
- After unchanged full +3 and focused +3 reproduction, apply exactly the approved local wrapper and three call replacements. This is the approved, localized ownership fix: the file already owns trash teardown; tracking occurs before seed/chmod/await/assertions. No frontier choice or scope expansion.
- Adapt scratch summary extraction to observed spec reporter glyphs; preserve the actual default reporter and command. Baseline JSON's runner PID and summary were annotated from captured process/output evidence; no result inferred from wrapper exit.
- No other autonomous source fix or obvious-winner call. No new permanent test/mutant; no deliberate-failure probe in this bounded Build unit.

## Remaining verification

Bounded Build DONE; task acceptance NOT complete. Fresh Verify worker must perform full post-fix normal npm test, full deliberate structure-notice failure probe, focused orphan failure probe, exact temporary-edit restoration and full acceptance comparison under the approved sequencing. Preserve the initial directory sets and all six baseline reproduction survivors; fixed-orphan final counts are 34 / 1 / 1 / 0. Independent reviewer/producer handoff remains driver-owned.

Passing-suite acceptance remains blocked by actual baseline exit 1. Do not claim full green or close on focused green. Any unrelated repair or acceptance waiver needs a separate owner decision; this Build does not request repeat approval merely for the already-authorized independent red. Prove-red/release/docs-as-an-additional-gate/build/lint/install/native-model/network checks skipped: no mapped source change requires them, per approved plan and CONTRIBUTING. No failure-path/same-full-total/idle-Mac acceptance claimed. No commit/push/install/release/closure authorized.

## Build temporary failure-probe unit — 2026-11-04

Fresh actual fkit-coder, caller fkit-lead / driver fkit-sprint-ship-loop, Build role, hop 1 of 2. Same complete approved plan/quoted owner approval above; full plan read with cat this spawning turn, blob matches. Approval remains trusted relay prose, not independent owner-channel proof. This later bounded unit supersedes only the prior deferral of deliberate-failure probes; final normal full suite stays with a fresh Verify worker. No replanning, review or consult.

Read-only fkit-query grounding confirmed existing ADR-057/current CONTRIBUTING mapping: temporary hand probes only, no new permanent test file/case. Wiki watermark still has 11 later ai-agents commits; source takes precedence for changed facts. Wiki lacks current leak attribution; no wiki write.

Sandbox `ps -axo pid,ppid,pcpu,comm` returned exit 127 / operation not permitted before mutation. Scoped elevated inspection succeeded. Both test commands then ran scoped elevated for process monitoring/local listener checks; no test attempt was sandbox-denied and no failure waived. Source mutation wrappers use saved exact original bytes, pre-mutation hash/diff checks, signal forwarding and finally restoration; refuse to overwrite unexpected concurrent bytes. Raw logs and original-byte backups stay only in ignored scratch; durable evidence contains selected sanitized data, no raw config/log copy.

### failure-probe-structure

Command: `npm test`; wrapper: `node .fkit/tmp/0540-build-20261104/probe.mjs structure`. Measurement command and exact source checkpoints/hashes are in `evidence/failure-probe-structure-restoration.json`; all four prefix initial/final name sets, UTC/environment, samples and command status in `evidence/failure-probe-structure.json`.

2026-11-04T08:21:11.503Z–2026-11-04T08:22:37.608Z. Exit 1; 971 tests, 40 suites, 968 pass, 2 fail, 1 skip, 0 cancelled, 0 todo; runner 85802.188167 ms, wall 85.946295208 s. Default spec reporter.

Failed assertions: `live corpus: the enforced dual-homed set is non-empty and every file is present in BOTH homes`; `conforming fixture: complete silence — no notice on stderr, nothing on stdout`. Deliberate post-allocation error marker observed. Only the deliberate failure and unchanged baseline parity assertion failed. Same FOUR live-only parity paths: `.DS_Store`, `knowledge-base/.DS_Store`, `tasks/.DS_Store`, `wiki-vault/.DS_Store`. Same total and normalized skip set as baseline.

Skip set: `benchmark: snapshot against the per-member path on corpus-sized boards (FKIT_BOARD_BENCH=1)`. Load start 11.6064453125 / 13.845703125 / 11.8369140625; end 19.15771484375 / 16.234375 / 12.98583984375. Busy-machine timing, no idle-Mac proof. Sampled matching process parent chains all trace to the measurement runner; no competing test tree observed. Between-sample outside activity remains unproved.

| Prefix | Before | After | Newly surviving | Removed |
|---|---:|---:|---:|---:|
| fkit-proj- | 34 | 34 | 0 | 0 |
| fkit-stub- | 1 | 1 | 0 | 0 |
| fkit-argv- | 1 | 1 | 0 | 0 |
| fkit-conv- | 0 | 0 | 0 | 0 |

Exact pre-/post-probe bytes match SHA-256 `3498e40c37895bc1cbaff62895f259910d13e4bc260e5ef8105f70bb59eda6ee`; `finally` restoration succeeded without interruption or concurrent source change. Structure-notice diff empty; permanent orphan diff remains exactly the approved helper/three replacements. No permanent probe/test/mutant.

### failure-probe-orphan

Command: `node --test test/orphan-cleanup.test.js`; wrapper: `node .fkit/tmp/0540-build-20261104/probe.mjs orphan`. Measurement command and exact source checkpoints/hashes are in `evidence/failure-probe-orphan-restoration.json`; all four prefix initial/final name sets, UTC/environment, samples and command status in `evidence/failure-probe-orphan.json`.

2026-11-04T08:22:48.785Z–2026-11-04T08:22:59.430Z. Exit 1; 23 tests, 7 suites, 22 pass, 1 fail, 0 skip, 0 cancelled, 0 todo; runner 10476.651834 ms, wall 10.500472875 s. Default spec reporter.

Failed assertions: `.fkit/settings survives, and a launch still builds the role lockdown on top of it`. Deliberate post-allocation error marker observed. The enclosing B suite is also reported failed by node:test; it is not an additional failed assertion. No other failed test.

Skip set: none. Load start 16.8330078125 / 15.86328125 / 12.90966796875; end 16.62451171875 / 15.8505859375 / 12.939453125. Busy-machine timing, no idle-Mac proof. Sampled matching process parent chains all trace to the measurement runner; no competing test tree observed. Between-sample outside activity remains unproved.

| Prefix | Before | After | Newly surviving | Removed |
|---|---:|---:|---:|---:|
| fkit-proj- | 34 | 34 | 0 | 0 |
| fkit-stub- | 1 | 1 | 0 | 0 |
| fkit-argv- | 1 | 1 | 0 | 0 |
| fkit-conv- | 0 | 0 | 0 | 0 |

Exact pre-/post-probe bytes match SHA-256 `b2d4fe7d4ef42b7899fa92c11903393c23ec5a89ad808933d3fd7ffee65a987f`; `finally` restoration succeeded without interruption or concurrent source change. Structure-notice diff empty; permanent orphan diff remains exactly the approved helper/three replacements. No permanent probe/test/mutant.

### Probe restoration and preservation audit

[failure-probes-audit.json](evidence/failure-probes-audit.json) independently checks both expected failure sets/markers/totals, identical census sets, normalized full-suite skip set, source hashes/diffs and sampled process ownership. All original 28 project / 1 stub / 1 argv paths remain, plus all six reproduction project survivors. Final counts 34 / 1 / 1 / 0; no new surviving directory, no old directory removed in either run or between restoration checkpoints. No prefix sweep or manual deletion. `git diff --check` passed. Both wrapper processes exit 0 only after recording actual child exit 1 and verifying restoration; wrapper success is not test green.

### Decision log — bounded probe unit

- Execute precisely approved step 4 serially; choose the existing first fixed orphan caller (`.fkit/settings survives...`) for its explicitly authorized post-project throw. No source repair or scope expansion.
- Reuse checked measurement runner; add only ignored scratch mutation/finally wrapper and evidence validator. Keep source backups in ignored scratch, not permanent test files.
- Proceed with already-authorized probes despite unchanged parity red; record its four actual paths, never remove metadata or waive acceptance.
- No autonomous permanent fix or obvious-winner call: none. No competing task test launched.

### Remaining verification after probes

Bounded Build probes DONE, not overall Verify/0540 acceptance. Fresh Verify must run the restored normal measured `npm test` once, compare full baseline totals/skips and all four initial/final sets, preserve original/diagnostic directories and assess passing-run/timing requirements. Existing parity red still blocks passing acceptance and closure unless resolved by separately authorized work or owner ruling. No repeat decision sought merely for that already-authorized red. Independent reviewer/producer steps remain driver-owned. No final normal suite run here. Prove-red/release/docs-as-additional-gate/build/lint/install/native-model/network checks skipped under unchanged approved mapping. No plan/brief/board/wiki/config/binary/Git index edits, commit/push, install/release or closure by this unit. Crash/SIGKILL safety not claimed.

## Verify restored normal full suite — 2026-11-04

Fresh actual fkit-coder, caller fkit-lead / driver fkit-sprint-ship-loop, Verify-only worker, chain lead → coder hop 1 of 2. Same verbatim owner approval, date and interactive channel recorded above; trusted relay prose, not independent owner-channel proof. Read actual brief, complete plan, worklog, Build/probe audits, source diff and measurement runner; verified restoration against actual bytes before running. No source edits or repeated probes/focused runs by this worker.

Read-only fkit-query: [[systems/testing-and-verification]] ADR-057 reset and [[tasks/run-only-the-checks-a-change-needs-not-the-full-suite-every-time]] support the current CONTRIBUTING command mapping. Note: 11 commit(s) touched ai-agents/ since the wiki was last synced (185ac5e07e918c089ed3afd23496587315342000) — wiki may not reflect latest changes; current CONTRIBUTING/source governs changed facts. Wiki lacks this task's runtime attribution; later ingest is wiki-only. Read codex/README.md and current migration validation; no native/Claude/mixed certification claimed.

### One restored normal full run

Exact command: `node .fkit/tmp/0540-build-20261104/measure.mjs restored-normal-full npm test`. Child command `npm test` expands to `node --test test/*.test.js test/board/*.test.js`. Measurement wrapper exit 0 means evidence was saved; actual npm child exit **1**. No suite rerun after this result.

2026-11-04T08:28:57.411Z–2026-11-04T08:30:12.673Z; Node v24.13.0, darwin 25.2.0, 14 logical CPUs. Default canonical temp root `/private/var/folders/j8/6zcjvzwx1t5csm7rynmsjlr80000gn/T`, no private TMPDIR override. Default spec reporter: 971 tests / 40 suites / 969 pass / 1 fail / 1 skip / 0 cancelled / 0 todo; runner 74978.727375 ms, process wall 75.12240554200001 s. Same 971 total and exact normalized skip set as unchanged baseline and full failure probe. Skip: `benchmark: snapshot against the per-member path on corpus-sized boards (FKIT_BOARD_BENCH=1)`.

Sole failure: `test/dual-home-parity.test.js:461`, `live corpus: the enforced dual-homed set is non-empty and every file is present in BOTH homes`. Assertion reports `4 dual-homed file(s) exist in one home only`: live-only `.DS_Store`, `knowledge-base/.DS_Store`, `tasks/.DS_Store`, `wiki-vault/.DS_Store` relative to ai-agents/. Same four paths as unchanged baseline and structure probe. No injected failure remains. No other failing test, no acceptance waiver.

| Prefix | Before | After | Newly surviving | Removed |
|---|---:|---:|---:|---:|
| fkit-proj- | 34 | 34 | 0 | 0 |
| fkit-stub- | 1 | 1 | 0 | 0 |
| fkit-argv- | 1 | 1 | 0 | 0 |
| fkit-conv- | 0 | 0 | 0 | 0 |

All exact before/after sets equal; preflight sets equal probe-final sets and normal-run initial sets; audit-time census equals run final sets. All original 28 project / 1 stub / 1 argv paths and six diagnostic project survivors remain. No old path removed and no new surviving path. No prefix sweep/manual deletion. Normal-completion zero growth observed despite unrelated red; this is **not** the required passing-run acceptance.

Load start 12.6689453125 / 15.8798828125 / 14.099609375; end 22.29052734375 / 19.142578125 / 15.556640625. Seven ten-second samples retained with process IDs/parents/CPU and load in evidence. Preflight found no test candidate; run pre/post only measurement runner 86618; every sampled candidate traces to that runner. No competing test tree observed at sampled times; arbitrary between-sample activity remains unproved. 74.979 s is measured busy-machine timing, not proof of the idle-Mac ≤120 s requirement.

### Restoration, scope and failure-probe comparison

Orphan source SHA-256 remains `b2d4fe7d4ef42b7899fa92c11903393c23ec5a89ad808933d3fd7ffee65a987f`, notice SHA-256 remains `3498e40c37895bc1cbaff62895f259910d13e4bc260e5ef8105f70bb59eda6ee`. Exact approved six-line helper/three-call patch remains the sole source diff. Notice/harness diff empty. All ten protected hashes unchanged (source, approved plan/review, brief, Sprint 15, CONTRIBUTING, package); plan Git blob `a7245d31f2c7c91d6efd1b6642a08c08db2e04f3` matches carried approval. HEAD `20813ecb23974af0f6feac7404b0b5a8a1f4608a`, repository short status and tracked source diff unchanged from preflight. `git diff --check` passed. Existing unrelated dirt preserved; no concurrent drift detected in these checked surfaces.

Prior Build/probe evidence re-read, not re-executed: unchanged full baseline 971/969 pass/1 fail/1 skip, +3 projects; unchanged focused 23 pass, +3; fixed focused 23 pass, zero growth. Full structure failure probe 971/968 pass/2 fail/1 skip (injected + parity), focused orphan probe 23/22 pass/1 injected failure, both zero growth; both exact-byte restorations remain verified. Restored full run now returns to baseline failure/skip set with zero growth. Failure behavior coverage is ordinary runner teardown, not SIGKILL/crash/abrupt-exit recovery or setup errors before makeProject returns.

### Runtime attempts and durable evidence

Initial shell ps inspection succeeded. Node child ps inspection in scratch preflight was denied EPERM; first preflight had an unchecked-stdout TypeError before saving or starting any test. Corrected scratch-only handling/diagnostic identified EPERM. Scoped elevated preflight succeeded; one scoped elevated full suite succeeded in executing and returned actual test exit 1. No denied test attempt, no automatic-approval rejection, no test failure waived. No competing task tests launched. Prior worker sandbox failures remain historical, not fresh tested failures.

Durable [restored-normal-full.json](evidence/restored-normal-full.json) contains exact four-prefix sets/counts/deltas, child status, UTC/environment, summary/skip/failure names, source hashes, process/load samples. [verify-audit.json](evidence/verify-audit.json) contains restoration/protected hashes, baseline/probe comparisons, original/six-survivor preservation, sanitized four-file metadata type/tracking inspection and concrete owner options. Raw logs/preflight/script stay in ignored scratch; no raw log, metadata contents or private configuration copied to artifacts.

### Decision log — bounded Verify unit

- Reuse inspected existing measurement runner for exactly one restored normal full run; use scoped escalation after concrete Node ps EPERM and known listener requirement. No repeated suite/probe merely for the known parity red.
- Treat actual parity red as blocking full acceptance under the approved plan; do not undo the authorized localized Build or silently waive acceptance.
- Inspect only existence, lstat regular/symlink type and git tracking for the four reported metadata paths: all exist, regular files, untracked; no contents read. No cleanup performed.
- Autonomous permanent fix or obvious-winner call: **none**. Only worklog/evidence and ignored scratch written by this worker.

### Required owner decision and remaining limits

**NEEDS-DECISION — full acceptance/closure remain blocked.** Concrete reviewable option: authorize exact removal of the three outside-vault regular untracked metadata paths by a fresh authorized Build coder, and route `ai-agents/wiki-vault/.DS_Store` to fkit-wiki exclusively. Each rechecks type/tracking first; stop on drift. No prefix sweep, contents/private-config read, parity assertion/exception change, source/config/index edit or ignored-temp deletion. Then fresh Verify performs one measured normal npm test with preserved initial/diagnostic sets, same totals/skips, and load evidence; any new failure returns to owner. Alternative: leave metadata and acceptance blocked, retain this failed evidence, no waiver or closure. These are proposed options, **not approval**. Driver holds owner channel and must relay the decision; this worker asks nobody and performs no repair.

No placement/dependency changes in either option. Current 0540 brief and Sprint 15 checked: depends on nothing, blocks nothing; no new wait introduced. Sprint 15's 0540 passing/failing cleanup success remains unmet while passing acceptance is blocked.

Independent source Review, Process-review and producer-only closure remain later driver steps. No task/sprint status/move, plan/review/wiki/native-config/binary/index write, commit/push, install/release or self-closure by Verify. Old shared-temp folders remain untouched; only the owner may choose separate manual cleanup when no tests run.

Skipped: no repeat focused/probe check (completed evidence/restoration verified, no new concern); test:prove-red (no mapped changed path/cross-tree dependency); test:release (no release-tool change); test:docs as extra gate (named exceptions already in npm test); build/lint/install/release/native-model/network checks (outside approved scope/mapping). Skipped is not passed. Idle-Mac condition, full green acceptance and crash recovery remain unproved.


## Bounded outside-vault metadata cleanup — 2026-11-04

Fresh Build coder; caller fkit-lead / driver fkit-sprint-ship-loop, chain lead → coder hop 1 of 2. Exact additional owner approval relayed from interactive `fkit_roles.fkit_ask_owner`, 2026-11-04 08:36:36 UTC (trusted driver prose, not independently verified):

> Authorize exact cleanup + verification (Recommended) — Remove only the four listed .DS_Store files: fresh Build coder handles the three outside the vault; fkit-wiki alone handles the vault file. Recheck type/tracking, then rerun one measured normal suite. No sweep, parity-test change or acceptance waiver.

Removed only `ai-agents/.DS_Store`, `ai-agents/knowledge-base/.DS_Store`, `ai-agents/tasks/.DS_Store`. Each passed lstat regular-file/nonsymlink, directory-ancestor and exact Git-untracked (ignored, `!!`) checks; repeated guards immediately before unlink; no contents read. All three absent afterwards. Per-path guards/removal UTC and protected hashes: [metadata-cleanup-outside-vault.json](evidence/metadata-cleanup-outside-vault.json).

Approved orphan patch SHA-256 remains `b2d4fe7d4ef42b7899fa92c11903393c23ec5a89ad808933d3fd7ffee65a987f`; all 11 protected file hashes, test diff and Git index hash unchanged across removal. No source/config/index/wiki edits, sweeps, shared-temp deletion, tests, consults, commits/push, install/release or lifecycle action in this unit. Only this worklog and task-local sanitized audit written beyond the three exact removals. Vault cleanup belongs exclusively to separate fkit-wiki worker; not inspected and not claimed complete.

Read-only fkit-query grounding confirmed ADR-057/mapped-check context; no fresh runtime research/tests. Note: 11 commit(s) touched `ai-agents/` since wiki watermark `185ac5e07e918c089ed3afd23496587315342000`; wiki may lag source and lacks this cleanup evidence. Owner's exact additional ruling supersedes original no-metadata-removal boundary only for listed paths.

### Decision log — bounded metadata cleanup

- Execute exact separately approved three-path environmental cleanup after passing all guards; no added scope or acceptance waiver. Autonomous permanent fix or obvious-winner call: **none**.
- No tests here: approved sequence requires both removers to finish, then fresh Verify runs one measured normal `npm test` with preserved prefix sets/counts, totals/skips and load evidence. Full acceptance, idle-Mac proof, independent review and producer closure remain pending; prior failed suite is not replaced by this cleanup audit.


### Cleanup read-back drift — NEEDS-DECISION

All three unlinks initially succeeded and all three paths were absent at their immediate post-unlink checks. Subsequent audit read-back assertion FAILED: `ai-agents/tasks/.DS_Store` reappeared. Follow-up lstat/Git checks: regular nonsymlink, Git-untracked/ignored; no contents read. The other two paths remain absent at the read-back observation. Actor/cause unestablished. All 11 protected hashes still match and worklog append verified. Audit updated with observed drift; prior immediate-removal observations remain historical, not current absence claims.

Stopped on drift as instructed: no repeat deletion, tests or expanded scope. Bounded unit returns NEEDS-DECISION, superseding any immediate DONE result printed by the removal script. Driver must obtain a disposition for the reappeared exact path; vault completion remains unchecked. No acceptance waiver/closure. Decision log addition: stop rather than silently repeat a deletion after observed drift; no autonomous source fix/obvious-winner call.
