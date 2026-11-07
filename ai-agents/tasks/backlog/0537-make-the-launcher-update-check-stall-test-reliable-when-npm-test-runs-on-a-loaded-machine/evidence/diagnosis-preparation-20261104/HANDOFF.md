# 0537 prepared diagnosis interface — PREPARATION ONLY

No diagnostic invocation, CPU burner, passive observer, test suite or model test has run. Source repair: NONE. Static audit is not execution validation or a cleanup guarantee. Historical cause remains UNKNOWN.

Authority: exact diagnosis-only owner quote/date/channel is recorded in the task worklog and baseline. Relayed approval is trusted prose, not independently proved here. This preparation unit cannot run the commands below. No plan/plan-review/board/wiki/index/closed-record edits, installation, commit or push.

## Fixed interface for the driver's later bounded workers

Scratch root: `/Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/0537-diagnosis-20261104/`

For iteration i = 1, 2, 3, 4, 5, in order, once each:

```sh
/Users/mark.dolbyrev/.nvm/versions/node/v24.13.0/bin/node '/Users/mark.dolbyrev/Workspace/fkit/.fkit/tmp/0537-diagnosis-20261104/supervisor.mjs' --iteration i
```

The Node executable above is the exact recorded process.execPath; use the generated iteration commands in sealed `commands.json`. `i` is a placeholder, never an additional invocation. No retries. Prior iteration must have COMPLETE status and four recorded invocations before the next starts. Exclusive directory creation reserves each iteration; existing directories are never overwritten or removed by the supervisor. The preparation has reserved no iteration.

Each invocation remains exactly these node:test arguments, with absolute script paths:

1. `--test --test-name-pattern=^0284/term-ignored: safe-reference.mjs`
2. `--test --test-name-pattern=^0284/ safe-reference.mjs`
3. `--test --test-name-pattern=^0284/term-ignored: observed.mjs`
4. `--test --test-name-pattern=^0284/ observed.mjs`

The original no-stray test's internal <=20-launch loop stays unchanged; four invocations does not mean four launcher calls. No additional probe/mutant/full-file/full-suite invocation is built into this supervisor. Exactly five iteration slots, 20 test invocations maximum; incomplete/unknown evidence stops new invocations, not retries. Assertion reds remain recorded and do not erase earlier failures. COMPLETE means four invocations completed with observed settlement and IPC exit accounting, not a repaired test or proved cause.

## Load and preconditions

- Node v24.13.0; initial availableParallelism=14, fixed N=16 arithmetic-only Node child burners. Chunk=100000 integer operations, setImmediate yield. Same N for every later diagnostic invocation and any separately approved repair verification. Do not silently adapt N.
- Every burner must announce ready on its private inherited IPC channel before tests start; N must remain live. Stop uses IPC message or parent-channel disconnect, never a numeric PID or group signal. Exit and close events are recorded; uncertain startup/stop/exit accounting blocks continuation.
- Supervisor runs a passive observer module on its own event loop, independently of the test process's synchronous spawn. Requested ps interval=50 ms after each sample completes; actual sample duration/load and start/end bounds are recorded. ps rows are PID, parent PID, second-resolution lstart, state, command. Unrelated process commands are not persisted. No process-identity wrapper or stub/watchdog logging is inserted into primary scripts.
- Reconcile all anchor or sealed artifact drift before starting. Anchors include current test/launcher/policy/plan and original harness import bytes (hash in manifest). No inherited FKIT_BANNER_ROOT, FKIT_LAUNCHER, NODE_OPTIONS or NODE_TEST_CONTEXT override is accepted. No sandbox relaxation, automatic startup retry or limit increase.
- Existing external worker limit: codex/fkit.mjs has headless timeout 600000 ms; role MCP timeout is 660 s. These are unchanged. No aggregate diagnostic time limit or idle check is added. A worker killed at its limit is interrupted/unverified; retain fixtures and return cleanup pending/UNKNOWN. Splitting checkpoints does not guarantee completion within the existing limit.
- No numeric process-count cap was found in inspected codex/server.mjs, consult.mjs and fkit.mjs. This is a scoped source observation, not an OS capacity guarantee. Later workers need capacity for N burners, supervisor, node:test runner/worker, ps sampler and original fixture descendants. If an actual driver/process limit cannot accommodate that, return NEEDS-DECISION before load; do not change N or the limit.
- Runtime startup, private IPC delivery, local ps format/visibility, sampling coverage and full failure cleanup are UNVALIDATED. The first authorized iteration supplies the first actual execution evidence; no extra preliminary run is authorized by this interface.

## Variants and exact fidelity limits

`original-static.js` is the original test, retained only as a STATIC UNEXECUTED baseline; never run it. `safe-reference.mjs` is a safety-modified reference harness with unchanged launcher, not an unchanged baseline.

Both scratch copies only redirect the REPO import to the original absolute harness file, route temp() to FKIT_DIAG_FIXTURES under the invocation's private fixture directory, make the entire shared reap body inert, remove its false comment, and defer automatic after() fixture deletion. All four reap callers/rethrows remain. The original process.kill(pid,0) observation remains; it may misidentify reused PIDs. Original seal/tool/stub/sleep/install code, selection, assertions, time limits, Date.now()/r.secs and no-stray internal loops remain.

Observed-only differences: four in-memory monotonic boundaries (preparation start, after original spawn option evaluation immediately before spawnSync, sync return, after original log reads); original result/log/fixture references retained and serialized in after() after measurement. Spawn option evaluation order and pipes remain. Serialization after measurement avoids synchronous evidence writes within r.secs. The small in-memory observation overhead still affects r.secs and may alter reproduction. No wrapper, replacement spawnSync, file-redirection comparison, guessed subtraction, ceiling change or shipped edit.

Reference passing-assertion r.secs, at-assertion log/result and per-launch boundaries remain UNKNOWN when original output does not expose them. Raw original test output and passive snapshots are retained separately. Observed at-assertion evidence is explicitly the original launch log-read snapshot, not a new log read at each assert. No copied numeric cell from another run.

All fixtures are retained through test return. Observer identities carry ancestry and start identity across reparenting and distinguish disappeared/reused/zombie/live/unknown. Logged PIDs without observed start/ownership, ambiguous reuse, missed births, failed ps, absent trace or mismatched fixture inventory produce UNKNOWN; stop new runs and retain directories. Original signal-0 assertion and observer identity evidence stay separate. Short-lived unlogged descendants may be missed; passive evidence cannot guarantee full coverage, exact shell exit, exact KILL time, or machine-wide containment. Shell disappearance is a sampled bound, distinct from spawnSync pipe completion. No launcher stored-PID-signal logic is altered or certified.

The supervisor waits passively for positively tracked descendants to disappear/reuse; zombies stay pending until disappearance. It writes result/identity/log evidence before removing only exact recorded fixture directories, and only after observed identities settle with no missing/unknown provenance. Every removal is audited; no shared temp/metadata or recursive parent cleanup. Unknown/pending/interrupted fixtures are retained. The unchanged launcher's own mktemp/rm behavior is not intercepted; it can use its original default temporary location. No supervisor deletion targets it.

## Results, evidence gate and exit status

Task evidence root: `ai-agents/tasks/backlog/0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine/evidence/diagnosis-preparation-20261104/`.

For each iteration: `iteration-i/audit.jsonl`, `iteration-i/result.json` and four named invocation subdirectories containing `checkpoint.json`, raw `stdout.tap` (default Node reporter, not guaranteed TAP), `stderr.txt` when nonempty, `passive.jsonl`, `result.json`, observed-only `observed-trace.json`, and `retained-logs/` copies. Fixture paths live under scratch `iteration-i/<invocation>/fixtures/`.

Supervisor exit 0: COMPLETE checkpoint with four completed invocations and recorded IPC exits; inspect each assertionResult for reds. Exit 2: NEEDS-DECISION, incomplete batch/unknown cleanup; return existing evidence and stop. Preflight/reservation errors can exit nonzero before the iteration checkpoint exists; do not retry automatically. External interruption/unhandled failure is never a pass.

After five iterations, the driver returns the full per-launch table (including UNKNOWN cells), failures, source/scratch hashes, load and identity/settlement evidence at the mandatory evidence gate. Answer test measurement/scheduling, launcher delay/held pipe, mixed, or not proved, with limits. Do not infer attribution from no-woke or shell disappearance alone. Diagnosis approval permits no source repair; any proposed exact test/cleanup/launcher diff still needs separate live owner approval. No normal-tree test or full suite until its unsafe bare-PID reaper is separately resolved.

## Preparation evidence

`baseline.json`: Node/OS/shell/CPU/load, commands, source anchors, historical failure and initial scoped status/diff. `static-audit-attempt1.json`: first static checker failure (newline slicing in the checker, corrected without changing variant code). `static-audit.json`: 55 passing static checks, five syntax-only parses, zero runtime execution. Exact three unified diffs, snapshot/hash manifest, scripts and this interface are copied into task evidence. No independent implementation review has been requested; approved plan reviews were source-reasoning only, actual serving-model diversity unknown. A fresh implementation review belongs after a separately approved source repair.
