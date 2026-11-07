# 0554 — Make the lead advance authorized work after worker completion

## Build — 2026-11-06

Build complete; verification/review/closure remain with the root driver. No torn source state known.
This is a bounded Build return, not task completion or closure.

### Authority and scope

Caller `fkit-lead`, driver `fkit-sprint-ship-loop`, worker role Build. Declared owner approval relayed
verbatim from user chat in root `fkit-lead`, 2026-11-06, observed 08:43:13 UTC:

> I approve it

The caller identifies that answer as approval of the full reviewed R1 plan for this task.
This worker trusts the relay; it cannot independently authenticate the root owner channel.
`plan.md` was read fully and verified before source edits:

- Git blob: `ee775e41fd022408d0a90c294cc99dfb0ce9645b`.
- SHA256: `5cff100f56d5ca2dd5525eda6d82af4b8d0c5fcacfad1bee50620b740d7b1cc0`.
- Bytes: 8399. Historical DRAFT/pending wording retained exactly; no plan re-authoring.

Only the seven approved source paths, this worklog and task-local sanitized Build evidence were
written. No nested roles or owner forms. No install/release, commit/push, task/board/status move,
wiki, native settings or generated-copy edit. 0555 owner-dialog integration and 0556 independent
option assembly remain separate. No owner approval inferred from queued forms.

### Grounding

Used `fkit-query`; read wiki index, relevant ADR-031/ADR-061 and testing guidance, canonical lead and
sprint-driver sources, configured-runtime docs/materialization/transport, Claude adapter, migration
handoff, architecture/project brief and applicable contribution/comment rules. The wiki still lags:
12 commits touched `ai-agents/` since watermark `185ac5e07e918c089ed3afd23496587315342000`.
Current source and the relayed owner rulings govern the changed behavior. No wiki writes.

### Change surface

| Path | Result |
| --- | --- |
| `claude/agents/fkit-lead.md` | Consume every bounded return, verify artifacts, act within the live turn, preserve allowances and actual gates; honest host checkpoint/resume contract. |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | Shared checklist required in every worker prompt; explicit completion consumption, owner-wait idle boundary, allowance-limited producer retry, full-close cross-check before advancement, checkpoint/progress reporting. Existing recovery/status branches, envelopes and review rules retained. |
| `codex/server.mjs` | Post-adapter empty/whitespace output sets `isError` and missing-response message. Nonblank bounded payloads and existing provenance/error metadata preserved; no parser/relaunch. |
| `codex/materialize.mjs` | Both configured runtime bindings describe awaiting-live-turn return, shell status/text inspection, adapter sanitization and honest host limits. |
| `codex/README.md` | Document transport, continuation, checkpoints and verification limits. |
| `CHANGELOG.md` | Add 0554 entry while retaining both pre-existing Unreleased entries byte-for-byte. |
| `test/launcher-contract.test.js` | Extend only existing named transport case: blank/whitespace errors, boundary whitespace preservation, partial failure metadata/text, exact sequential child-launch counts. |

Before/after snapshots are data files with `.txt` suffixes under `evidence/build/`; no executable
test file was added. `baseline-source.diff` captures existing source deltas against HEAD (710 bytes,
CHANGELOG only). `task-source.diff` isolates this Build against its actual beforeimages.

### Executed verification

| Check | Actual result |
| --- | --- |
| `node --test --test-name-pattern='^lead worker transport:' test/launcher-contract.test.js`, updated test against unchanged server | **Expected target RED**: child exit 1; 1 selected, 0 pass, 1 fail, 0 skip. Assertion `exit 0, payload ""`: actual `false`, expected `true` for `isError`. Unrelated first-use case not selected. |
| Same command against fixed server | **GREEN**: child exit 0; 1 selected, 1 pass, 0 fail, 0 skip. 13 normal requests + 3 error payloads + 1 interrupted partial = 17 fixture child launches, with exact counts and no extra launch after topology/owner-channel denials. |
| `node --check` on server, materializer and launcher-contract test | All three exit 0. |
| Approved seven-path `git diff --check` | Exit 0. |
| Source case-declaration comparison with beforeimage | All 18 top-level `test(...)` call declarations unchanged; 0 new top-level cases, 0 new permanent test files, 0 new prove-red cases. This is not the full runtime test count. |

Raw selected-test output, child exits and scoped command results are preserved in
`evidence/build/target-{red,green}.{tap,json}` and `scoped-checks.json`.
Normal delivery seam and remaining delivery assertions are mapped in `delivery-seam.md`.

### Outstanding checks and inherited failures

Per the root's explicit Build/Verify split, this worker did **not** run the full launcher file,
filtered default-equivalent suite, four-case prove-red lane, or separate delivery checks. Root will
spawn a fresh Verify worker for those exact approved checks; nothing here waives a failed check.
No deferred timing/load/process-observer cases, benchmarks, native/provider/account probes or
configuration repairs were run. No unfiltered `npm test`.

Required fresh Verify commands remain:

```sh
node --test test/launcher-contract.test.js
node --test --test-skip-pattern='^0284/(git-deadline|term-ignored|no-stray|reinstall-deadline|reinstall-timeout-not-run):|^fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$|^benchmark:' test/*.test.js test/board/*.test.js
npm run test:prove-red
git diff --check -- claude/agents/fkit-lead.md claude/skills/fkit-sprint-ship-loop/SKILL.md codex/server.mjs codex/materialize.mjs codex/README.md CHANGELOG.md test/launcher-contract.test.js
```

Coverage is filtered: omit the three banner cases (including stalled termination/escalation and
watchdog cleanup), two reinstall cases (including download-failure/partial-script protection),
mixed board stale-break cleanup/lock recovery case, and optional benchmark snapshot/access-count
checks. Do not execute omitted groups to validate filtering.

Inherited, relayed by root and **not rerun, repaired or attributed to 0554**: 0520 verification
970 total / 946 pass / 23 fail / 1 skip (22 loopback EPERM failures plus first-use 9-vs-15 failure);
prove-red baseline 0b FAILED. Prior filing docs 51/51 is inherited evidence, not this Build's result.
The broader whitespace failure in frozen archived 0552 evidence remains; scoped source is clean.
Retained 0537 scratch was untouched. No broader suite success is claimed.

### Limits and workflow evidence

Fixture outputs prove bounded transport behavior only. No live model-obedience or host-resumption
check ran. Approval/partial-return/exhausted-cap/parking/unavailable-host workflow scenarios remain
unverified, as do actual root return→next-step and verified-close→next-task actions in this worker's
own observations. Root can separately record its genuine progression after this return. No fake
walkthrough/checkpoint or driver report was created. Claude blank/failure variants were not executed;
`codex/claude.mjs` is unchanged and retains decoded blank rejection and sanitized failures. Successful
Claude decoding/observed-model coverage belongs to the existing configured-delegation case, still
pending fresh Verify. Independent source review also remains pending.

### Decision log

- Autonomous review fixes / obvious-winner calls: **none**. No review findings were supplied for this
  Build. All edits implement the exact approved plan; no out-of-plan judgment was taken.
- Routine in-plan implementation: use `.trim()` only to classify a missing response, forwarding the
  original nonblank post-adapter bounded string. This preserves boundary whitespace and available
  partial failures rather than changing adapter sanitization or response text.
- Build verifies only the named transport case and scoped syntax/whitespace checks, per caller's
  explicit division of work. Full verification/delivery/review remains outstanding, not skipped as a
  success. No added retry permission or older-task retry was used.

### Preservation audit

`evidence/build/baseline.json` records hashes for 2103 pre-existing tracked/untracked nonignored
files, all seven beforeimages and the Git stage-entry digest. `audit.json` compares those hashes,
new paths and index entries after Build, including approved plan/review record, all task/board
statuses and inherited changes. Snapshot coverage excludes ignored local settings/generated trees;
this worker issued no writes there, and fixture setup ran only in disposable fixture roots.
`artifact-manifest.json` enumerates every final Build artifact and its content hash (excluding the
manifest itself); `task-source.diff` plus before/after data makes the 0554 change independently
reviewable. No task closure is claimed.

## Verify — 2026-11-06

Fresh VERIFY ONLY worker for 0554 — Make the lead advance authorized work after worker completion. Relayed owner user-chat approval 2026-11-06, observed 08:43:13 UTC: "I approve it"; trusted driver relay, not independently authenticated. Full plan read/hash matched; review record records actual approval after historical pending text. All 24 Build-manifest artifacts and seven current source snapshots matched. Verify writes only this worklog and sanitized evidence. No source, approved plan, review record, status, board, wiki, index, settings or generated-copy edits. No nested roles. Filtered suite, launcher, four existing prove-red cases, normal disposable delivery, scoped whitespace remain outstanding. No old-task retry allowance used. Root Build-return → fresh Verify-start is relayed actual handoff, not universal continuation proof.

### Verify decision log

- Autonomous review fixes / obvious-winner calls: none. Verification only.

- Durable lane start: `launcher`; command `node --test test/launcher-contract.test.js`. Checkpoint saved before child launch.

- Durable delivery lane checkpoint before execution: normal disposable `setup` and configured `launchArgs` for both runtimes; no model calls or native project changes. Preflight count correction: **25** Build artifacts matched (earlier prose said 24); authoritative JSON count is 25. Wiki query freshness: 12 commits since watermark; no new wiki entry for this task.

- Lane `launcher` child exit 1; counts {}; evidence `evidence/verify/launcher.{json,log}`. Wrapper completion is independent of child success.

- Delivery attempt 1 child exit 1: two canonical `.claude` copies matched; comparison of `.agents` driver omitted the pre-existing sprint-reporting replacement in `skillText`. Evidence-check error; no product failure inferred. Corrected comparison rerun authorized in same delivery lane; no source change.

- Durable lane start: `functional-sandbox`; command `node --test --test-skip-pattern='^0284/(git-deadline|term-ignored|no-stray|reinstall-deadline|reinstall-timeout-not-run):|^fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$|^benchmark:' test/*.test.js test/board/*.test.js`. Checkpoint saved before child launch.

- Launcher reporter uses spec output; evidence parser extended (no test rerun). Actual launcher **75 tests / 74 pass / 1 fail / 0 skip / 0 cancel**, child exit 1. Failure: existing first-use assertion `9 !== 15` at test/launcher-contract.test.js:669, matching inherited failure signature; no source attribution established and no waiver. Transport, configured delegation and synthetic owner-channel cases passed. Delivery corrected attempt child exit 0: both canonical `.claude` copies, complete adapted `.agents` driver, both runtime instruction argv and repeat setup passed; no live provider call.

- Durable lane start: `whitespace`; command `git diff --check -- claude/agents/fkit-lead.md claude/skills/fkit-sprint-ship-loop/SKILL.md codex/server.mjs codex/materialize.mjs codex/README.md CHANGELOG.md test/launcher-contract.test.js`. Checkpoint saved before child launch.

- Lane `whitespace` child exit 0; counts {}; evidence `evidence/verify/whitespace.{json,log}`. Wrapper completion is independent of child success.

- Lane `functional-sandbox` child exit 1; counts {}; evidence `evidence/verify/functional-sandbox.{json,log}`. Wrapper completion is independent of child success.

- Functional sandbox reporter parsed after completion (wrapper had started before parser correction): {"tests": 967, "suites": 40, "pass": 944, "fail": 23, "cancelled": 0, "skipped": 0, "todo": 0}; child exit 1. Loopback listen EPERM present; scoped exception required for the exact approved filtered functional command, not a source fix or waiver.

- Durable lane start: `functional-scoped`; command `node --test --test-skip-pattern='^0284/(git-deadline|term-ignored|no-stray|reinstall-deadline|reinstall-timeout-not-run):|^fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$|^benchmark:' test/*.test.js test/board/*.test.js`. Checkpoint saved before child launch.

- Lane `functional-scoped` child exit 0; counts {"tests": 967, "suites": 40, "pass": 967, "fail": 0, "cancelled": 0, "skipped": 0, "todo": 0}; evidence `evidence/verify/functional-scoped.{json,log}`. Wrapper completion is independent of child success.

- Scoped execution exception accepted for the exact approved filtered functional command. Actual rerun child exit **0**: **967 tests / 967 pass / 0 fail / 0 skip / 0 cancel**, 40 suites. Board loopback checks and first-use case passed in this changed permission context. This does not erase the launcher/sandbox failures or establish their cause. Excluded cases were not executed; omitted cases are not counted as skips by this Node reporter. No full-default-suite pass claimed. No further functional rerun needed.

- Durable lane start: `prove-red`; command `npm run test:prove-red`. Checkpoint saved before child launch.

- Lane `prove-red` child exit 1; counts {}; evidence `evidence/verify/prove-red.{json,log}`. Wrapper completion is independent of child success.


## Verify completion continuation — 2026-11-06

Bounded Verify-only continuation for **0554 — Make the lead advance authorized work after worker completion**. Trusts caller fkit-lead's verbatim owner approval relay (2026-11-06 root user chat, observed 08:43:13 UTC): “I approve it”, covering the complete frozen reviewed R1 plan. No source authority expansion or nested roles/forms.

- Original prove-red results arrived before continuation: child exit **1**, baseline **0b red** (75 tests / 74 pass / 1 fail; existing first-use `9 !== 15`), **0c green**, **M1/M2/M30/M31 red** at the script's named-assertion checks. Gate failed solely on 0b. Original wrapper did not expose numeric per-suite exits; no numbers inferred from red labels. No interrupted/unknown lane claim after discovering its completed result.
- Read saved worklog, all named lane JSON/log contents, delivery command, Build manifest/audit and source hashes. **24 immutable Build artifacts matched**; the 25th manifest path is this worklog, changed by expected Verify appends. Seven source afterimages and frozen approved plan match; plan-review matches saved Verify preflight.
- No rerun of completed functional, launcher, delivery, targeted transport, syntax or whitespace coverage. One scoped `npm run test:prove-red` run will finish the unresolved permission-context proof. Original artifacts stay unchanged under unique `continuation-01` paths. A test-command-only Bash function will preserve Node suite numeric child exits and sanitized existing per-step output; it forwards identical arguments/status, adds no test or mutation, and changes no source/config. No live provider/network probe.
- Wiki read procedure used: relevant current testing policy and sources read. 12 commits touched `ai-agents/` since watermark `185ac5e07e918c089ed3afd23496587315342000`; the wiki may lag. Owner deferral governs; no deferred investigations or gates.
- Autonomous review fixes / obvious-winner calls: **none**.

- Scoped execution exception **accepted** for `npm run test:prove-red`; no automatic-review rejection received. Script child exit **0**, hard gate **PASSED**. Baselines 0b **75/75, exit 0**; 0c **260/260, exit 0**. M1 **258 pass/2 fail, exit 1** (reviewer × fkit-review); M2 **73 pass/2 fail, exit 1** (`--resume`, also unknown first arg); M30 **73 pass/2 fail, exit 1** (12 and 12b, 12c/12d green); M31 **72 pass/3 fail, exit 1** (75 tests; required 12b red, 12/12c/12d green; two additional terminal-harness failures: “bare first use: saved mixed overrides skip configuration, refresh managed files and preserve owner bytes” and “bare first use: management, explicit routes and partial terminal fds preserve their contracts”). Every existing mutant's required named assertion matched; mutant red is expected proof, not a failed gate. Numeric children and per-step logs saved under `evidence/verify/continuation-01-step-*`; aggregate result `continuation-01-prove-red-result.json`.
- Original restricted gate **exit 1** and baseline 0b first-use failure remain immutable. Current scoped pass establishes this permission-context result only; no root cause established or failure waiver. No second scoped proof run launched. No completed green functional/delivery/target/syntax/whitespace lane rerun.


## Process-review — 2026-11-06

Bounded Process-review worker for **0554 — Make the lead advance authorized work after worker completion**;
caller `fkit-lead`, driver `fkit-sprint-ship-loop`. Standing approval is the declared live root user-chat
answer **“I approve it”**, 2026-11-06, observed 08:43:13 UTC, for the full carried R1 plan. Trusted relay,
not independently authenticated owner consent. Frozen plan bytes/blob/SHA256 and plan-review matched;
neither was edited. The declared-approval exception replaces only the per-round approval gate.

### Finding verification and convergence

- Steps 0–2: R1 alone is novel; no previous Coder response or task-local residual. Checked ADR-031
  honesty clause, ADR-032 A2/A3/A4, ADR-033 mover boundary, ADR-042 reporting and ADR-061 local limits.
  No settled decision covers R1: **suppressed as settled — none**. Accepted controls remain settled.
- Steps 3–3.5: **R1 CORRECT · Defect · low**, independently derived from the saved step-31 log, its
  JSON and aggregate JSON: 75 tests / 72 pass / 3 fail / 0 skip / 0 cancel, child exit 1. Blast radius
  is the worklog's evidence summary; no production behavior changes or source regression established.
  Read the full `test/prove-red.sh` flow: green baselines precede four mutants; M31 requires 12b red
  and 12/12c/12d green (`:288` and `:290`, “suite went red but NOT at assertion 12b” and
  “12 / 12c / 12d also went red”). Saved output satisfies those checks and script exit 0 remains
  valid for that narrower contract, **not an otherwise clean M31 suite**. No cause investigation or
  reproduction. No prior coder round to reverse; no regression or review oscillation from this fix.
- Steps 4–6: R1 = CORRECT / Defect / ✅ done. Corrected only the worklog count/explanation and wrote
  the Coder response, then set review Status to `closed-out`. Convergence: one new reporting defect
  resolved; zero source fixes required. No new accepted residual, owner judgment or NEEDS-DECISION.

### Decision log

- **R1 — autonomous correction:** replaced “74 pass/1 fail” with **72 pass/3 fail**, retained both
  additional failed names and explicitly limited the proof claim. Verified-CORRECT, mechanical/localized
  and inside the approved evidence-reporting scope; applied under the sprint driver's standing approval.
  No production, test or mutation change. Other autonomous fixes / obvious-winner calls: **none**.

### Checks and preservation

This worker executed Python evidence/hash/ownership checks. Pre-edit audit exit 0: 7/7 source afterimages,
24/24 immutable Build artifacts, 26/26 original Verify evidence hashes, frozen plan (8,399 bytes; blob
`ee775e41fd022408d0a90c294cc99dfb0ce9645b`), plan-review and index stage/bytes matched. Captured before
hashes: `evidence/process-review-r1-preflight.json`; final checks: `evidence/process-review-r1-result.json`.
These are **Process-review checks**, not a missing Verify final report/audit, which never landed.
An initial edit attempt failed a table-separator assertion before either write; hash readback confirmed
both documents unchanged, then the separator was corrected in the editing command.
No behavioral test rerun or new test: the caller limits this metadata correction to saved-evidence
checks. Any subsequent source fix would require appropriate fresh verification before closure.

Inherited, not rerun here: accepted filtered functional **967/967**, prove-red script **exit 0**, baselines
**75/75** and **260/260**, mutants **258/2**, **73/2**, **73/2**, **72/3** (each child exit 1). Restricted
launcher **74/75**, restricted functional **944/967**, original restricted proof **exit 1 / 0b red** remain;
later context results establish no cause and waive none. Delivery's initial comparison error and corrected
pass, Build target red→green 1/1 with 17 expected launches, syntax/scoped-whitespace pass and archived
0552 broad-whitespace failure remain unchanged. Approved positive filtering omits seven cases/groups;
omissions are not reporter skips. No unfiltered/default `npm test` pass or excluded-case execution claimed.

Coverage stays **reasoning-only second opinion**: neither reviewer ran behavioral checks. Configured
models match; primary serving identity uncaptured, so **actual diversity unknown**. A different model
is recommended for a broader second opinion. Reviewer-owned coverage/findings/verbatim leaf unchanged.
The reviewer's broader snapshot exception remains: root scratch checkpoint differs, previous bytes
unavailable, no writer attribution or field-preservation claim. This scoped audit is no whole-workspace
preservation claim. No fabricated Verify return or universal continuation proof.
Live model obedience, host resumption, verified-close→next-task and recovery/approval scenarios remain
unverified beyond the relayed Build→Verify handoff. Successful Claude decoding is inherited fixture
coverage; Claude blank/failure/live variants remain unexecuted. 0555 and 0556 remain independent/unfixed.
No source/status/board/wiki/index/configuration/generated-copy/install/mover action, commit or push by
this worker. Review `closed-out` is **not task closure**; root/producer assessment remains.

Wiki grounding: [[wiki/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]],
[[wiki/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]],
[[wiki/decisions/adr-061-codex-as-a-full-seven-role-runtime-with-explicit-local-limits]],
[[wiki/systems/testing-and-verification]]. Note: 12 commit(s) touched `ai-agents/` since the wiki was
last synced (`185ac5e07e918c089ed3afd23496587315342000`) — this answer may not reflect the latest changes.
Consider running /fkit-wiki-sync. Current source, approved plan and owner rulings control.
