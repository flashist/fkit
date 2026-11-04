# Current state and next sprint proposal — 2026-11-03

**Sprint goal/name approved 2026-11-03; not a start approval or an approved implementation plan.**
Written by an actual headless `fkit-producer`, chain `fkit-lead → fkit-producer`, hop 1 of 2,
under the owner's request to investigate recent iterations and plan the next sprint. The initial
assessment created only this decision packet. After the actual owner choice below, a fresh producer
persisted the confirmed name/goal/gates in the existing Sprint 15 board. Task titles, membership,
ranks, owners, statuses and dependencies remain unchanged. No new task brief is needed.

## Current state

- **No sprint is active; nothing is marked In progress in live boards or open task briefs.**
  The producer-owned status procedure's empty-target resolution returned:

  ```text
  active none
  candidate file="backlog.md" identity="Backlog" status="unresolved"
  candidate file="sprint-15.md" identity="Sprint 15" status="Backlog"
  ```

  `active none` is the expected exit-3 answer. Backlog is an ineligible identity, not an active
  sprint with a missing status to repair. No fallback board was selected as current.
- [Sprint 15](../../sprints/sprint-15.md) already schedules four tasks, all `🔲 Backlog`, with
  owner-confirmed order 0540 → 0537 → 0520 → 0548. Its deterministic dashboard reports four backlog
  of four and no drift records. Scheduling explicitly granted no task/sprint start approval.
- The [standing Backlog board](../../sprints/backlog.md) has 361 historical rows: 180 backlog,
  one blocked, 58 done, 18 cancelled and 104 moved. Its 181 open unscheduled briefs are separate
  from Sprint 15's four. Moved rows are pointers, not extra open tasks. No drift records were
  emitted by this render. The board is an unranked archive of known work; a whole-board ranking
  pass is not owed under the owner's 2026-08-29 ruling.
- The one explicitly blocked unscheduled brief is
  [0405](../../tasks/backlog/0405-investigate-a-terminal-ui-for-the-board-and-compare-it-against-the-web-board/brief.md),
  waiting on 0433/0434 in the later board work. A lack of a Blocked marker elsewhere does not
  prove that every backlog dependency or owner gate is satisfied.
- Seven roles are built; the eighth tester is authorized but unbuilt. The product remains a
  prototype. See [PROJECT](../PROJECT.md), [ADR-061](../decisions/adr-061-codex-as-a-full-seven-role-runtime-with-explicit-local-limits.md)
  and [configured runtime guidance](../../../codex/README.md).

## Recent iterations, identified from records

Dates below are the recorded completion dates, not a numerical sprint ordering assumption. These
sprints overlapped: Sprint 12 finished after Sprints 13 and 14. All listed sprint/task closes are
**agent-closed — not owner-verified**; evidence of execution is narrower than their Done markers.

| Iteration | Recorded result | Evidence and practical limit |
|---|---|---|
| Sprint 13, October 19–20 | Five done. Reset tests to shipped-script behavior, cut prove-red to four cases, enforce the default test budget. | [Board](../../sprints/done/sprint-13.md), [ADR-057](../decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md), [CONTRIBUTING](../../../CONTRIBUTING.md). Recorded local runs were on a busy Mac; CI measurements were 60.7–85.2 seconds against 120 seconds. No fresh execution claimed here. |
| Sprint 14, October 20–23 | Eight done. Shipped the read-only `fkit board` reader; ported aiboard to Node and passed 0423's phase-2 parity gate. | [Board](../../sprints/done/sprint-14.md). Gate recorded PASS with zero differences and an owner-ruled control note. This did not deliver the later board store, owner door, converter or corpus migration, or authorize them to start. |
| Sprint 12, October 15–30 | Fourteen done, one cancelled. Launcher hardening/comment work, retro research, plan-review trial/default rollout and corrected planning-limit wording. | [Board](../../sprints/done/sprint-12.md), [migration acceptance](../../../model-agnostic-sprint/local-acceptance.md). 0503 was cancelled as superseded by the test reset. Original Claude/native-human UI checks remain unverified; 0545's interactive Bash qualification remains untested. Older driver notes claiming this sprint is still active are superseded by its closure banner and rows. |
| Codex migration and preview follow-ups, October 28–30 | Accepted local seven-role Codex operation; first-use runtime configuration (0546); same-name lead delegation for status/wiki procedures (0547). | [Migration handoff](../../../model-agnostic-sprint/HANDOFF.md), [0546](../../tasks/done/0546-configure-first-use-from-bare-fkit-and-reuse-saved-project-settings/brief.md), [0547 worklog](../../tasks/done/0547-delegate-lead-status-and-wiki-skills-under-their-existing-names/worklog.md). Recorded 0546 suite: 968 total, 967 pass, zero fail, one skip, 70.815 seconds; 0547: 971 total, 970 pass, zero fail, one skip, 90.072 seconds. Four existing prove-red cases caught in each record. Failed earlier fixtures/runs remain failures; 0546's accidental host Node overwrite and verified recovery remain disclosed in its worklog. |
| Preview distribution and board startup follow-up | Local history/tags and changelog contain `v0.4.0-codex.1`, `.2`, `.3`; `.3` documents same-name delegation. Board port collision fallback/browser opening are already implemented/documented under Unreleased. | [CHANGELOG](../../../CHANGELOG.md), [board guide](../../../docs/board.md). Local branch checked: `codex/codex-preview`; local HEAD at inspection: `20813ec`. Local tags/commits are not proof of current remote publication, default-main contents, global installation or consuming-project upgrades; those were not checked. The temporary board verification record was unavailable to the architect, so its execution is not independently established here. |
| Sprint 16, November 3 | Three done, board closed. Optional BUZZ investigation produced a negative feasibility result, documented gate stop, then actual owner PARK decision. | [Closed board](../../sprints/done/sprint-16.md), [decision packet](../../tasks/done/0551-review-buzz-feasibility-with-the-owner-and-scope-only-the-proven-delivery/decision-packet.md), [0551 worklog](../../tasks/done/0551-review-buzz-feasibility-with-the-owner-and-scope-only-the-proven-delivery/worklog.md). 110 BUZZ cases: 55 blocked, 55 untested, none executed; zero experiment hours. No adapter or live integration was proved. Final 0551 Verify is recorded as 971 total, 970 pass, zero fail, one skip, 75.072 seconds; repository tests are not BUZZ evidence. Packet statements that Verify/closure were pending describe earlier checkpoints and are superseded by later records. |

Historical BUZZ review coverage was reasoning-only, even where reviewers ran document/integrity
checks. **Both passes used the same model. A different model is recommended for a broader second
opinion.** Other migration reviews sometimes retained unknown serving identity/diversity; they
must not be promoted to known model diversity or behavioral execution.

## What is unfinished, deferred or unverified

- **Unfinished commitment:** Sprint 15's four existing tasks. 0548's native-default behavior is
  requested and scoped, not implemented; today's settings documentation still describes selectors.
- **Deferred product work:** BUZZ delivery and experiments are parked, not queued for another
  feasibility run. ADR-052's later board/store/conversion phases and the retrospective delivery
  chain 0531–0535 remain unscheduled. They do not become sprint work because their earlier research
  or parity gate completed. Owner-involvement capture 0486–0491 still requires 0485's owner-only
  acceptance of ADR-053. No acceptance is inferred here.
- **Unverified support:** live configured Claude/mixed operation; broader Linux/native workflows;
  complete native-human UI acceptance; remote release/install state. The owner previously reported
  local Claude unavailable. Do not make repairing/probing that account a prerequisite for Codex use.
- **Current validation caveat:** neither inherited assessment suite run was green. The initial sandboxed
  run reported 25 failures; the existing escalated rerun completed its test summary with one
  failure, the dual-home parity check over three `.DS_Store` files. First-use PTY and
  `0284/no-stray` passed on that rerun, but their initial failures' causes remain unresolved.
  Exact evidence and exit-code limits are recorded under packet validation below. This does not
  add repair work to Sprint 15 or satisfy its diagnostic gates. The fresh approved-finalization
  run also failed on parity only; its captured exit and full result are recorded separately below.
- **Accepted local limits:** both fkit Codex hooks remain disabled. Planning and general role-write
  boundaries are instructional; dispatcher ownership/topology checks do not establish a universal
  filesystem or source-write wall. ADR-042 D2/task 0273 remains outstanding; do not duplicate it.
- **Evidence gaps:** wiki has recent partial updates, but its watermark
  `185ac5e07e918c089ed3afd23496587315342000` is eleven `ai-agents/` commits behind HEAD.
  The settings simplification and latest board-startup facts are not fully represented there.
  Current original records fill those gaps. Any ingest/sync is wiki-role work, separately routed.

## Approved sprint — recommendation confirmed 2026-11-03

**Reuse Sprint 15. Owner-confirmed goal-based name: “Make fkit startup predictable and use native defaults.”**

**Goal:** complete the four already-scheduled improvements so local launches use native model/effort
defaults, update checks remain silent and bounded, and their tests demonstrate reliable cleanup and
deadline behavior. “Predictable” means the bounded contracts below, not a fixed startup latency
under arbitrary machine load or a claim of cross-runtime certification.

This recommendation fulfills the existing next-release request without a duplicate Sprint 17,
replacement board or backlog reshuffle. Previous name: “Launcher defaults, update checks and test
reliability”. The owner approved the rename below; ranks and membership are preserved.

| Existing order / owner | Smallest shippable result | Required acceptance and stop gate |
|---|---|---|
| P1 · **0540** · `fkit-coder` | Temp-project lifecycle cleanup, scoped to folders owned by the current test run. | Rebaseline first: the architect found cleanup already present in the original suspect files; source inspection does not prove the leak gone. Measure current growth and identify its real owner before edits. Prove equal before/after project-folder counts for passing and deliberately failing runs; check the other three named prefixes; restore the temporary failure; preserve existing folders and test count. If unreproduced, report evidence and request disposition instead of speculative cleanup or claiming the brief satisfied. [Brief](../../tasks/backlog/0540-stop-the-test-suite-leaving-fkit-proj-temp-folders-behind/brief.md). |
| P2 · **0537** · `fkit-coder` | Diagnose the stall-test failure, then repair the test if the cause is in the test. | At least five loaded diagnostic runs with elapsed time, `woke` and surviving processes; if a launcher defect is found, stop/report for a separate owner-approved task. For a test repair: 10/10 runs at the same load, retain lower-bound/deadline/no-output/exit guarantees, detect a deliberately broken KILL step and restore it, compare full-suite idle duration before/after with no slowdown. Removing real sleeps is separate scope. An unreproduced failure is unresolved evidence, not a green reliability claim. [Brief](../../tasks/backlog/0537-make-the-launcher-update-check-stall-test-reliable-when-npm-test-runs-on-a-loaded-machine/brief.md). |
| P3 · **0520** · `fkit-coder` | An update-check Git call that does not prompt after an SSH rewrite, retaining silent failure and the watchdog. | Reproduce in isolated configuration first; stop/report if unreproduced. At plan approval, owner rules on exact custom-SSH/proxy/key/wrapper consequences. Show no prompt/stray output, successful continuation and measured time within the existing timeout; preserve normal checks and custom command behavior if supported. Existing-file regression must fail before/pass after the fix. No installer-download, curl-path or timeout redesign. [Brief](../../tasks/backlog/0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/brief.md). |
| P4 · **0548** · `fkit-coder` | One complete behavioral slice: retire fkit model/effort selection and honor native defaults, with lossless handling of old overrides. | Keep initial Claude/Codex choice, saved runtime routing and fresh role launches. Remove selector UI/flags and invocation overrides together; accept runtime-valid settings with inert old model/effort values, preserve saved bytes and unrelated preferences. Prove direct interactive/headless, shell/MCP and adversarial routing across all seven roles and both adapters using isolated fixtures. Cover cancellation/failures, owned-agent refresh, help/provenance/docs, and the owning architect's dated ADR amendment during normal planning. Never edit native user config to force defaults. Fixture argv omission is not live provider inheritance; live Claude/mixed certification remains deferred. Existing brief is already investigated; do not reopen ignore-versus-reset. [Brief](../../tasks/backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md). |

These are existing briefs, not new tasks or duplicate implementation prescriptions. The four results
ship independently. 0548 remains one slice because control removal, ignored saved data, validation,
invocation, documentation and provenance must agree; UI-only or engine-only delivery is incomplete.

## Sequence, dependencies and capacity

1. Owner confirmed Sprint 15 as the next focus/name on 2026-11-03, as recorded below. This does not
   start the sprint or any task.
2. Under a separately authorized start/implementation workflow, retain order
   **0540 → 0537 → 0520 → 0548** and obtain each required reviewed plan/actual owner approval.
3. Preserve the existing investigation gates. Findings outside scope return to the owner;
   they do not authorize implementation, cancellation or replacement work.
4. 0537 and 0520 share the update-banner tests; the later change incorporates the earlier delta.
   0548's README/CHANGELOG edits incorporate the completed board-startup changes. The Sprint 15
   historical note saying board startup was still being clarified is superseded by the dated
   correction in the finalized board; no board feature is added here.
5. Capture verification/review evidence per task. Any eventual closure uses only producer movers
   with `(agent-closed — not owner-verified)`; this proposal authorizes no closure or release.

**Hard dependencies:** only 0520 → 0284, already `✅ Done (agent-closed — not owner-verified)`.
The order above adds no `Depends on:` links. A fresh search of all open briefs' dependency lines
found no dependent naming 0540, 0537, 0520 or 0548; no open task gains a wait on Sprint 15.
No placement or dependency edit was made, so task-brief step 9's post-edit warning is not triggered.

**Capacity:** scope-based proposal, no calendar deadline or work-hour cap inferred. Architect's
confidence is moderate for the bounded scope; insufficient evidence for a completion date. 0548 is
the largest known slice; 0537 carries the greatest diagnostic uncertainty; 0540's stale hypothesis
also needs remeasurement. A failed diagnostic gate can leave the sprint goal unmet and require
owner replanning. Do not count a gate stop as the promised behavior fix or silently extend scope.

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

## Technical consultation and evidence method

Fresh actual `fkit-architect`, hop 2 of 2, no counter-consult. Dispatcher reported Codex,
model requested/reported `gpt-6.1-sol`, exit 0, no timeout/truncation. It read current sources and
records; no writes, behavioral suites or live probes. It found Sprint 15 coherent, identified the
0540/board-note stale assumptions, retained the diagnostic/SSH/native-default boundaries and found
no new product decision. This was technical planning input, not a full independent plan review or
an owner approval. Its temporary board verification artifact was unavailable.

Grounding: owned `fkit-query`, `fkit-status` and `fkit-task-brief` loaded through `fkit_skill`.
Wiki index/relevant sprint, system and ADR pages were consulted, then current original sources.
The status operation stopped at its no-active answer; separate planning reads examined the
existing Sprint 15 and Backlog dashboards. Bounded local Git history/tags were used only for
iteration/distribution context, not to override task statuses or certify remote release state.

Note: 11 commit(s) touched `ai-agents/` since the wiki was last synced
(`185ac5e07e918c089ed3afd23496587315342000`) — this answer may not reflect the latest changes.
Consider running /fkit-wiki-sync.

## Actual owner decision — 2026-11-03

**Owner approval — 2026-11-03, interactive `fkit_roles.fkit_ask_owner` form in the root `fkit-lead` session, relayed to `fkit-producer` (chain `fkit-lead → fkit-producer`, hop 1 of 2), verbatim:**

> Confirm Sprint 15 and new name (Recommended) — Use “Make fkit startup predictable and use native defaults”; keep 0540 → 0537 → 0520 → 0548, ranks and Backlog statuses. Start nothing; no dependency changes.

**Applied:** existing Sprint 15 renamed and its goal, success criteria and driver notes aligned
with this packet. Full scope, ranks, membership, owners, dependencies and all Backlog statuses
remain intact. Planning approval grants no start, release or closure authority.

### Historical decision request — resolved by the approval above

The following choices/context preserve the original proposal; they are no longer pending.

**Original request: NEEDS-DECISION (resolved)**

- **question:** Use the existing Sprint 15 as the next sprint and adopt this goal-based name?
- **options:**
  1. **Confirm Sprint 15 and new name (Recommended):** rename to “Make fkit startup predictable and
     use native defaults”; keep 0540/0537/0520/0548, their ranks and Backlog statuses; start nothing.
     Knock-on: none (checked); no open task gains a wait on Sprint 15, and no dependency changes.
  2. **Keep Sprint 15's current name:** accept the same four-task proposal under “Launcher defaults,
     update checks and test reliability”; leave the board title/statuses and starts unchanged.
     Knock-on: none (checked); no open task gains a wait on Sprint 15, and no dependency changes.
  3. **Choose another goal:** owner supplies the desired outcome and capacity, then producer replans;
     existing Sprint 15 and the Backlog remain as recorded, with no new sprint, move or dependency
     edit inferred. Knock-on: none for this deferral (checked); later placement needs a fresh check.
- **recommendation:** option 1. Finish the already-scheduled hardening/native-default commitment
  before expanding the product surface. Trade-off: the next sprint delivers reliability and setup
  simplification rather than new board-store or remote-control functionality.
- **context:** Owner goals/capacity were not interviewed in this headless consult. Final product
  direction/name belongs to the owner. The proposal is complete and reviewable; only this packet
  is persisted. `fkit-task-brief` step 1 forbids inventing a missing sprint; existing Sprint 15
  placement/start rulings remain binding. Do not treat planning consent as start consent. Ask for
  start separately only if the owner then wants execution; no release authority is implied.

## Validation of this planning packet — inherited assessment evidence

- Fresh deterministic selector and Sprint 15/Backlog renders completed; counts and absence of
  emitted drift records above are from those commands. Fresh open dependency search found none
  naming the four planned tasks. No task/board edits, new briefs, reranks or placement changes.
- Prior producer checked all 24 local packet links and packet whitespace: PASS. These checks
  were not repeated during bounded finalization.
- Required initial `npm test`, existing log
  `/private/tmp/fkit-next-sprint-planning-npm-test-20261103.log`: **exit 1**, as captured by the
  prior producer; 971 tests, 40 suites, 945 pass, 25 fail, zero cancelled, one skipped, zero todo;
  **74230.055208 ms (74.230 seconds)**. Failures include board local-listen `EPERM` under the
  sandbox, dual-home parity over three `.DS_Store` entries, first-use PTY scenario assertion
  `9 !== 15` at `test/launcher-contract.test.js:669`, and `0284/no-stray` finding a surviving
  process two seconds after launch. The PTY and surviving-process failures are observations,
  not established root causes.
- Already-launched scoped escalated `npm test`, existing log
  `/private/tmp/fkit-next-sprint-planning-npm-test-20261103-escalated.log`: **complete test-runner
  summary, failing suite; process exit code unavailable in the saved log and not inferred**.
  971 tests, 40 suites, 969 pass, one fail, zero cancelled, one skipped, zero todo;
  **75394.166583 ms (75.394 seconds)**. The sole reported failure is
  `test/dual-home-parity.test.js:448`: `.DS_Store`, `knowledge-base/.DS_Store` and
  `wiki-vault/.DS_Store` exist in the live tree but not its scaffold counterpart. No file was
  removed, copied or exempted. The board tests, failed first-use scenario and `0284/no-stray`
  passed on this run; a single rerun does not establish reliability or explain the initial
  PTY/no-stray failures. The parity issue remains unresolved.
- Both recorded durations are below 120 seconds; machine idleness was not established, so
  these are not idle-Mac budget certification. The prior interrupted consult did not return
  the escalated process result; the saved final test summary above is available evidence,
  not an assumed shell exit status. No new tests, reruns, prove-red cases, research or
  consultations were performed during that earlier bounded packet correction. That pass updated
  only this packet's caveat and validation sections; task, board, source and wiki files were not
  edited then. The separate approved planning finalization is recorded below.

## Approved planning finalization — 2026-11-03

Owner approval above is applied to the existing board and this packet only. No new investigation,
consultation or briefs; no source/wiki edits, task starts, moves, installs, releases or commits.
Fresh verification for these planning writes is recorded below separately from inherited results.

- Fresh `select-active ai-agents/sprints`: **exit 3, `active none`**; Sprint 15 resolves to
  Backlog, with no active sprint selected. Fresh deterministic Sprint 15 dashboard: **exit 0**,
  **4 backlog of 4**, no emitted drift records. P1/P2/P3/P4 remain 0540/0537/0520/0548,
  all owned by `fkit-coder`; only 0520 derives dependency 0284.
- Original four status/priority/task/owner/brief rows and line-3 Backlog banner compared with
  pre-edit snapshot: **byte-identical**. Actual owner choice appears verbatim once in each file.
  No placement or dependency edit; task-brief step 9's post-edit warning is not triggered.
- Fresh local-link/whitespace check: **11 board + 24 packet local link occurrences resolve**;
  both files have no trailing whitespace. Initial link check caught four acceptance links copied
  with the packet's relative base; corrected to the board's base and rerun PASS. `git diff --check`
  passed; the untracked packet was explicitly included in the separate whitespace check.
- Required fresh **scoped escalated `npm test`: exit 1**, captured from the completed process.
  **971 tests, 40 suites, 969 pass, one fail, zero cancelled, one skipped, zero todo;
  79401.346125 ms (79.401 seconds)**. Log:
  `/private/tmp/fkit-sprint15-approved-planning-npm-test-20261103.log`.
  Sole failure: `test/dual-home-parity.test.js:448`, because `.DS_Store`,
  `knowledge-base/.DS_Store` and `wiki-vault/.DS_Store` exist in the live tree only.
  No metadata was deleted, copied or exempted. First-use PTY and `0284/no-stray` passed;
  earlier failures' causes remain unresolved. This duration is below 120 seconds, but machine
  idleness was not established; no idle-Mac budget or cross-runtime certification is claimed.
- One required suite run only in this finalization; no extra tests, prove-red or release tests.
  CONTRIBUTING's affected-path table requires `npm test` for these two planning paths and does
  not require the other lanes. Historical initial/escalated results and the earlier missing
  process exit remain above; this fresh exit does not fill that historical evidence gap.
- Only the board and this packet were written by this producer. Pre-existing wiki work was left
  untouched; no task/source/wiki edit, start, terminal move, install, release, commit or push.
  No new investigation or consultation. Wiki context remains eleven `ai-agents/` commits behind
  its recorded watermark; the saved packet and existing board supply the current planning facts.

What's next? Planning is finalized; execution/start remains a separate owner decision.
