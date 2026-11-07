# Task 0537 — correction cycle 1: diagnosis-first plan (DRAFT, NOT APPROVED)

Brief: ai-agents/tasks/backlog/0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine/brief.md

Classification: code-only — intended deliverable changes an existing test, not shipped launcher behavior. Architect AND producer review because the caller requires both and diagnosis might expose a shipped defect.

## Authority, policy and scope

Planning only; the source-write gate is INSTRUCTION-ENFORCED, not a structural tool wall. This worker may write only durable ignored scratch `.fkit/tmp/0537-plan-20261104/revision-1/`. No source, test, diagnostic execution, stress, approved plan.md, task record, status, board, wiki, index, installation, commit or push. No Build marker or live plan pointer. The lead alone owns its append-only run record. Owner approval is still required for the full final plan, and separately for a concrete source fix after diagnosis.

Relayed actual owner authority (2026-11-04, root interactive `fkit_roles.fkit_ask_owner`):
- 12:39:20 UTC: "Authorize bounded planning revisions (Recommended) — Allow up to two correction/re-review cycles for confirmed mechanical defects in 0537’s scratch diagnostic cleanup, including final adversarial findings. No stress runs or tracked edits; new scope returns to you, and final plan approval remains yours. No dependency changes or new waits."
- 13:17:59 UTC: "Retry 0537 once (Recommended) — Start a fresh Sprint 15 loop attempt at 0537 using fkit_consult and unchanged saved settings. Plan-only correction/review; no stress runs or source edits. Final plan approval remains yours."

This uses correction CYCLE 1 of 2, not another startup retry. New policy/scope judgment returns NEEDS-DECISION. A confirmed mechanical finding in the final adversarial pass is checked but not silently corrected in this cycle; return the unaltered plan and full record for the root's separate CYCLE 2 unit.

Current CONTRIBUTING.md supersedes the brief's old D10 aggregate budget, idle-only and no-suite-slowdown clauses. Actual owner typed ruling, 2026-11-04 11:19:31 UTC, same root form channel: "Remove any time-restrictions or idle-only restrictions for running tests. We spend more time on those things than on work itself." No idle check, aggregate benchmark or elapsed-suite acceptance gate. Functional lower/upper deadlines, per-process harness limits, worker/consult/hop limits, at least five loaded diagnostic runs, and ten-of-ten loaded verification remain. Do not edit closed 0540/0552 records or policy. No placement/dependency changes: 0537 depends on nothing and blocks nothing; no other open task acquires a wait. 0520 later rebases the same test file.

## Grounded facts and uncertainty

`timedStall()` starts Date.now() after sealedBin()/install(), but before `launch()` allocates log/cwd/HOME fixtures, synchronously spawns `/bin/sh` with piped stdout/stderr, and reads logs. Thus r.secs includes launch preparation and post-return reading as well as actual execution/pipe completion. `assertStallCut()` then checks seal, stalling, no-woke, >=4.5 seconds, <10 seconds for git-deadline / <10.5 for term-ignored, exit 0, no update banner and empty stderr. Help text on stdout is expected; silence means no update notice and no stderr, not deleting expected help output.

The unchanged launcher hardcodes FKIT_NET_TIMEOUT=5. `_fkit_deadline` enumerates git's direct children, sends TERM, sleeps one second, then KILLs the stored PIDs. 0526's dash saved-stderr-pipe finding is a hypothesis here, not attribution of the historical 33.3-second/no-woke sample. Neither no-woke nor test duration proves when KILL happened. The historical cause remains UNKNOWN.

Confirmed original X1: `reap()` at test/update-banner.test.js:464–465 sends SIGKILL to bare logged PIDs. Both timing catches (:499/:509) invoke it before an outer supervisor can intervene; no-stray also invokes the same helper. No PID-reuse incident was reproduced. An unchanged-source loaded baseline cannot be assumed safe, and is NOT an executable step of this plan.

## 1. Establish a static baseline after actual plan approval

The diagnostic worker re-reads current brief/policy/target source, records Node/OS/shell identity, CPU count, load, commands, target hashes and scoped status/diff. Current anchors: test/update-banner.test.js `61667865fd6b1219723da60539c319c6c089cfbc`; claude/fkit-claude.sh `8991bf2560717c20bee13f9008214ada22ae7ef6`; CONTRIBUTING.md `91b4310424d33d7bf81f71068ea50e48ca78135e`. Preserve existing policy changes and neighboring work. Unexpected target-byte drift stops the batch for reconciliation, not automatic overwrite. Task worklog/evidence writes are permitted only if separately carried in the real approved diagnostic-worker scope; this planning worker writes none.

Keep the original test bytes/hash and original failed-run account as a STATIC, UNEXECUTED baseline. Do not run `node --test ... test/update-banner.test.js` during diagnosis. Do not describe a scratch run as an unchanged-test run. No permanent new test file, dependency or prove-red case.

## 2. Scratch-only execution and cleanup design (future diagnosis, not execution now)

### 2a. Prepare and inspect two labelled scratch variants

After actual owner approval, create a unique diagnostic run directory under ignored scratch and two `.mjs` copies of the test: `safe-reference.mjs` and `observed.mjs`. Use built-ins only. Keep a hash and exact unified diff for each against the static original; explicitly list plumbing differences. Point the REPO import at the original absolute `test/harness.mjs`; preserve its existing implementation and all launcher/claude bytes. Route each test copy's temp() fixtures under its own scratch run directory (not a shared temp pool).

In BOTH copies replace the entire `reap(pids)` body with an inert return: no process.kill, no subprocess kill, no PID/group signal, no filesystem writes, and no replacement cleanup action inside the assertion catch. All existing callers remain; original assertions/rethrows and test selection remain. Remove the now-false reaper comment. Replace the automatic `after()` fixture deletion with fixture retention: post-test deletion is deferred to the passive supervisor protocol below. Those are safety/lifecycle changes, not a repair to ship. Static inspection must confirm all legacy reap callers now reach the inert body, including both no-stray catches, and no diagnostic helper introduces another PID-signal path. If the copy does not match this narrowly listed diff, do not execute it.

`safe-reference` otherwise preserves Date.now()/r.secs calculation, original launch()/spawnSync(), synchronous pipes, stub bodies/logging, five/one/twenty-second real sleeps, seal tests, assertion thresholds and all 0284 tests. It does not emit extra per-launch timings on passing assertions: those cells remain UNKNOWN where original output does not expose them. Its result is "safety-modified reference harness; unchanged launcher", never "unchanged baseline". Deferring cleanup changes inter-run conditions; retain that limitation even if all assertions pass.

`observed` derives from safe-reference, with a separately reviewed diff limited to recording pre-launch preparation, immediately-before-spawn, synchronous return and post-log-read monotonic boundaries; recording each existing r.secs/result/log/fixture reference after measurement; and a separate passive observer. Preserve the reference r.secs and original assertions. Do not inject process identity wrappers or additional stub/watchdog logging into the primary stub bodies, replace spawnSync with spawn, redirect primary pipes, subtract guessed overhead, or amend any shipped file. Observation overhead and missed transitions are explicit limitations.

### 2b. Passive cleanup, without a PID check-then-kill race

The supervisor never sends TERM/KILL or any other signal to a numeric PID or process group from logs, ps, a previous run, or ChildProcess.pid. An identity check followed by kill still races PID reuse; this plan deliberately does not use that pattern. Original test `alive()` signal-0 probes remain observational only and may misidentify reused PIDs; label their original assertion result separately from observer identity evidence. The scratch reaper cannot issue a destructive signal, including when an assertion fails.

Use arithmetic-only Node child burners with an inherited private IPC channel per owned ChildProcess, record spawn/exit identity and N. Burners yield between bounded work chunks to receive an IPC stop request and exit on parent-channel disconnect; no signal-based fallback. Supervisor cleanup broadcasts stop on these private channels, waits for exit events and records completion. It never kills a saved burner PID. Do not use broad pkill, killall, negative-PID signaling, or add/install native tools. If IPC startup/stop/exit accounting is uncertain, stop launching runs and return that failure/unknown; do not claim cleanup success.

All fixture descendants are observed passively and allowed to finish naturally, including their original finite 20-second stall and watchdog sleeps. The supervisor retains fixtures/logs past test return, records post-return woke lines separately from the at-assertion snapshot, and waits for observed owned descendants to disappear/exit. Observe PID plus start identity, command, ancestry and run-specific fixture path when available; distinguish exited, zombie, reused and unknown. Capture a descendant while its provenance is visible, carry that identity across reparenting, and do not infer identity solely from a PID or absence of a log line. No start identity / missed birth / ambiguity => UNKNOWN, never permission to kill or to call the run clean. Passive observation cannot guarantee every short-lived process was seen; report that coverage limit.

Do not remove retained fixture directories while any tracked process is live or unknown. Once processes are positively settled and logs/evidence copied, remove only the exact recorded scratch fixture directories; preserve the report/diffs. If a worker/harness limit, interruption, failed observation or abnormal process prevents completion, stop new runs, close burner channels, retain fixtures, return evidence with cleanup pending/unknown and NEEDS-DECISION. No hidden timeout becomes a pass, no automatic signal escalation, and no new aggregate runtime/idle gate. No promise of guaranteed cleanup under parent crash or incomplete OS observation. An external termination is an interrupted/unverified run.

This change addresses the test-side X1 cleanup path only. It does not alter or certify the launcher's existing stored-PID TERM/KILL logic, and does not claim a machine-wide sandbox. A confirmed launcher defect or new safety problem is branch B below, not authority to modify shipped code.

### 2c. Fixed loaded diagnostic batch and evidence

Use fixed N = availableParallelism()+2 CPU burners, identical throughout diagnosis and later loaded verification. Record N, spawn/exit events and load samples. If this cannot fit existing driver process/worker limits, return NEEDS-DECISION before starting; do not silently change those limits or choose an idle window. Run invocations sequentially; do not overlap test invocations or full suites. Retain the same load during each invocation; separate passive settlement/cleanup from measured launch time and identify it in the evidence.

Five iterations, each consisting of safe-reference focused term-ignored, safe-reference whole 0284 group, observed focused term-ignored, observed whole 0284 group. Commands (paths expanded to the unique scratch directory; no commands are run now):

```
node --test --test-name-pattern='^0284/term-ignored:' <scratch>/safe-reference.mjs
node --test --test-name-pattern='^0284/' <scratch>/safe-reference.mjs
node --test --test-name-pattern='^0284/term-ignored:' <scratch>/observed.mjs
node --test --test-name-pattern='^0284/' <scratch>/observed.mjs
```

Twenty finite invocations total, within the original plan's ten primary plus ten supplementary invocation envelope; no automatic retries or extra batch. This supplies at least five loaded, instrumented term-ignored and group samples with per-launch held times, separately labelled from reference results. Record every failure; no retries erase a red. If an invocation cannot be completed safely, the batch is incomplete, not green.

Per launch: iteration/variant, source and scratch hashes/diffs, load, original r.secs when available, observed monotonic hold and preparation/log overhead, at-assertion stalling/woke, post-return woke separately, original assertion pass/fail, exit/signal/stdout/stderr/banner, PID identities/ancestry/state, survivors at observed launcher exit and test return, passive settlement and cleanup status. The minimal reference has UNKNOWN timing/log cells when not exposed, not borrowed numbers from another invocation. The observer runs independently of the test's blocked JS thread and reads retained logs/process state; sampled shell disappearance and delayed callbacks provide bounds, not exact OS exit or KILL timestamps. Distinguish shell completion from spawnSync's pipe-completion return. If observer resolution cannot separate them, mark UNKNOWN.

Primary runs keep synchronous pipes. No file-descriptor-to-file comparison is needed in the first batch; do not use one as an acceptance path or silently hide a pipe hold. If later evidence justifies such a diagnostic comparison, return its exact scope for owner decision rather than adding it here. Observation or passive lifecycle changes may alter reproduction; failed reference without attributable observed counterpart is unresolved, not a proved test defect.

## 3. Mandatory evidence gate — stop before a source repair

Return the full per-run table and answer "test measurement/scheduling", "launcher delay/held pipe", "mixed", or "not proved", with evidence and limits. Relate results to the safety-modified harness only; no new exact unmodified baseline has been measured. Cleanup overhead happens after the captured failure/result and is not subtracted from functional launcher timing. Test/helper preparation overhead may be separated only when directly measured. No guessed ceiling or scheduling allowance.

A. Demonstrated harness overhead, with actual launcher AND its pipe-completion interval inside the existing functional bound: propose the smallest exact diff in test/update-banner.test.js (likely timedStall/launch/assertStallCut measurement). Explain preserved functional lower/upper deadline and why real held pipes or late KILL still fail. Apply to git-deadline only if it shares the proved cause. The lead must present that concrete fix/diff for a SEPARATE live owner approval before Build. Diagnosis approval is not source-fix approval.

B. Actual shipped launcher/KILL/pipe completion is late, a shipped defect is supported, or a new launcher-side safety problem is confirmed: STOP, return evidence and NEEDS-DECISION. No test-only workaround, no launcher fix inside this task by assumption.

C. No failure, mismatched instrumentation, unknown survivor identity, conflicting evidence or insufficient attribution: STOP, return evidence and NEEDS-DECISION. Five green scratch baselines are not a repaired test. Offer a bounded follow-up or hold 0537; no automatic broad investigation.

## 4. Repair roadmap — requires the separate concrete approval

Expected source surface: test/update-banner.test.js only; task artifacts only as approved by lead. Preserve sealed PATH checks, actual 20-second stall, five-second deadline and one-second KILL escalation, no-woke, >=4.5-second lower bound, evidence-supported functional upper bound that includes pipe completion, no banner, empty stderr and exit 0. Keep expected help stdout. No ceiling increase is pre-approved. No weakening no-stray/git-env; do not fold in 0520.

The unsafe original reaper remains in tracked source during diagnosis. The concrete repair proposal must explicitly resolve how later normal-tree verification avoids it: either an owner-approved, localized tracked cleanup correction or a separately approved safe execution arrangement with honest modified-harness coverage. No bare-PID reaping is silently re-enabled for loaded verification, full-file regression or the deliberate KILL mutant. This is a gate for the future concrete plan, NOT authority now to ship a cleanup fix, and a normal-tree pass cannot be claimed using scratch copies.

Real-sleep removal, a test-only timeout override, shipped launcher change, new test file or new permanent prove-red case each require a named new owner decision. Changed comments state WHY in one or two lines; delete/fix comments made false by the actual approved edit.

## 5. Required acceptance after the concrete approved repair

Under the same N/load recipe, run each changed test ten times; require 10/10 actual passes with per-run held/woke/survivor/output/status evidence. Record all failures and interrupted runs. Run whole 0284 group and full test/update-banner.test.js regression on the actual repaired tree after its cleanup route is explicitly approved and safe; no substitution of scratch assertions as normal-tree acceptance.

Prove sensitivity using a temporary whole claude/ copy via existing FKIT_BANNER_ROOT, deliberately removing only KILL escalation. Keep tracked launcher bytes unchanged. Record exact mutation diff/hash, command, exit and expected existing term-ignored no-woke/stall-completion failure, not a seal/setup/cleanup failure. Mutant green or wrong red reason blocks acceptance. Return to default tree, unset override, check restored launcher hash/diff and rerun the same focused test green. Retain red evidence; follow the approved safe cleanup route for the mutant as well. No broken source left. This is the brief's one-off proof, not a new permanent prove-red case.

CONTRIBUTING.md maps changed test/ and task records to "Anything else": run npm test once on restored normal tree, coordinating with lead to avoid competing suites. No idle prerequisite, before/after benchmark, aggregate-duration limit or no-slowdown acceptance. Durations/load are observations only. Run npm run test:prove-red only if a later approved change touches its mapped sources/tests; skip for test/update-banner.test.js alone because the four cases do not exercise it. Skip test:release (no release tool), test:docs (redundant), manifest generation (no scaffold), installs, CI dispatch and release. Hosted Ubuntu remains unverified unless actually executed under separate authority.

Inspect scoped git status/diff and whitespace: no new test/ file, tracked launcher/policy/board/closed-record/0520 edits. Fresh independent stateful review and Process-review follow the driver's normal steps. This worker invokes no session ship loop, mover, raw review CLI or native review fork. Report executed/skipped checks and actual coverage faithfully.

## Approval requested by the root, not this headless worker

The final clean reviewed plan authorizes only phases 1–3 after actual owner approval. It never authorizes an unknown source fix. Neither proceeding nor holding changes dependencies/placement or adds another task's wait. Current planning authorization alone authorizes no diagnostic run.

Wiki context: [[tasks/bound-the-update-checks-git-path-which-has-no-deadline-and-hangs]], [[tasks/the-test-scope-reset-tasks-0526-0530]], [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]], [[systems/testing-and-verification]] and [[systems/install-and-self-update]]. Note: 12 commit(s) touched ai-agents/ since wiki sync `185ac5e07e918c089ed3afd23496587315342000`; current bounded policy follow-up is reflected in testing pages despite unchanged watermark. Current source/policy and named owner rulings govern; historical pipe findings remain hypotheses here.
