# Validation proposal

Implementation is now active. See `progress.md` for verification of the current code and suite results. Ad hoc CLI probes ran in disposable temporary projects; see `runtime-investigation.md`. No new repository test file has been added.

## Test policy

ADR-057 limits the default suite to two minutes and requires owner approval per new test file. Prefer extending relevant existing black-box contract tests when implementation changes their shipped behavior; propose any new file and its purpose in the implementation plan. Keep live model probes separate from deterministic `npm test`; they consume tokens and depend on account/network state. Do not create tests that merely assert prompt wording or implementation shape.

## Local milestone acceptance

| Scenario | Required evidence |
| --- | --- |
| No Claude dependency | Local launch with Claude unavailable on the tested PATH; setup, all seven roles and review still work. Record isolation method rather than uninstalling Claude. |
| Default and override | Runtime evidence of default selection and wiki/adversarial override in direct and delegated sessions. If only one model is account-accessible, distinguish routing verification from live alternate-model execution. |
| Root and child roles | Correct responsibilities and allowed skills in both contexts; fresh reviewer receives scope without coder conversation history. |
| Denials and failures | Cross-role invocation, mover access, missing identity, inactive/untrusted hooks and hook errors show the agreed enforced/refused/degraded result. |
| Product setup | Fresh project and existing-code project complete initiation; existing fkit project only adds model setup; interruption/skip/noninteractive behavior is explicit. |
| Owner gates | Actual decision pending leaves dependent work stopped; worker question reaches owner; answer is carried faithfully; unanswered question is never inferred approval. |
| Two-pass review | Primary and adversarial outputs engage the same scope; same-model note appears; unavailable second pass is partial; measurement evidence is not inferred. |
| Stateful review | Ledger key, section ownership, accepted residuals and per-round coverage remain consistent through a second round. |
| File safety | Owned managed files refresh; unrelated settings, user-edited root body, symlink targets, project seed content and wiki ownership remain protected as specified. |
| Workflow | One bounded task and small sprint execute role handoffs; producer alone invokes terminal movers with required marker. Use synthetic tasks, never close real tasks for a test. |
| Recovery | Invalid model/auth, CLI failure, interruption and failed setup return actionable state and preserve prior config/artifacts. |
| Isolation and rollback | Global `fkit` still resolves to the prior install; local experiment is opt-in; rollback removes only positively identified experiment-managed artifacts. |

## Stage-2 additional checks

Real Claude and Codex sessions, legacy projects/settings, runtime selection and any mixed-runtime role routing, public installer/update/self-host, resource resolution for board/heal, structure manifest historical classifications, release checks and docs. A stubbed Claude executable establishes argv behavior, not Claude runtime compatibility. Record any missing live verification before release.

### Claude-capable verifier handoff

The owner confirmed on 2026-10-29 that Claude's API also fails in normal Terminal and must not be
assumed available locally. Stop local Claude probes. The local Codex path remains usable with all
seven roles selecting Codex; broader Claude certification is deferred, with no external verifier
currently assigned. Do not call a Codex-only pass evidence that Claude works.

In a separate environment with a working, authenticated Claude CLI, use an owner-authorized
disposable project and this checklist:

1. Record CLI/Node versions and a successful plain Claude response. Keep credentials/provider
   configuration with the verifier; report only sanitized pass/fail/model evidence.
2. Configure Claude as the fixture default and run one direct fixed-role session through `bin/fkit`.
   Verify its owned procedure load, actual serving-model evidence where available, and preservation
   of the fixture's source/wiki/settings. Parser or stub success does not satisfy this step.
3. Configure a Codex-default fixture with a Claude role override and exercise an actual peer call;
   repeat with a Claude-default fixture and Codex peer. Check requested versus observed model,
   role identity, fresh context, owner-decision relay and visible failure without fallback.
4. Verify native Claude owner approval/planning, cancellation, legacy unconfigured startup, and
   configured onboarding/task workflow with the approved disposable scope. Inspect actual artifacts;
   only producer movers may close fixture tasks/boards, with the agent-closed marker.
5. Return an environment/version/scenario/result/evidence/limitations table. Keep unavailable cases
   pending and never promote deterministic routing checks to live compatibility certification.

This is a verification handoff, not authorization to contact another person, create a separate chat,
change accounts, publish or commit. No external validation has been performed or scheduled here.

### Separate retained 0543 checks after Codex acceptance — 2026-10-30

The owner accepted C1–C5 for Codex only; producer closure is **✅ Done (agent-closed — not owner-verified)**.
Retain the moved task's [separate unverified checklist](../ai-agents/tasks/done/0543-turn-plan-review-on-by-default-in-fkit-coder-sessions-and-plain-fkit-plan-task/acceptance-proposal.md#separate-unverified-checklist-retained-after-any-codex-acceptance)
as part of this handoff. It includes all original Claude default/opt-out plan-mode ordering,
already-on stop/exit and applicable Shift+Tab, menu-to-coder and no-driver worker checks, plus
**complete native human UI plan approval/rejection for Codex**. The existing Claude-capable
handoff above remains in force. Synthetic MCP decisions and owner-observed startup do not satisfy
complete native human UI acceptance. No deferred check is promoted to passed or new test required
by this pointer; no verifier has been assigned or contacted and no local Claude probe is requested.

## Evidence format

Record CLI/runtime version, relevant model selection, tested capability, sanitized command/config, expected/observed outcome, exit status and limitations. Do not record credentials, DSNs or service endpoints. Model-reported success alone is insufficient for a file-boundary or routing claim; inspect the resulting files or runtime evidence. No broad suite reruns merely because a previous probe was inconclusive.

## Separate retained 0544 checks — approved Codex scope, 2026-10-30

The human approved C544-1–5 and bounded build/verification/review/producer closure in [0544's plan](../ai-agents/tasks/done/0544-turn-plan-review-on-by-default-in-fkit-task-ship-loop/plan.md). [Approval provenance](../ai-agents/tasks/done/0544-turn-plan-review-on-by-default-in-fkit-task-ship-loop/plan-review.md) distinguishes the real desktop decision from synthetic fixture replies. Required Codex suite/L1–L4 verification passed and independent review is clean; producer closure remains pending at this checkpoint. Measured evidence: [Codex verification](../ai-agents/tasks/done/0544-turn-plan-review-on-by-default-in-fkit-task-ship-loop/assets/0544-codex-verification.md).

Still unverified: original live Claude task-loop default/opt-out native plan-mode ordering and already-on/Shift+Tab interaction; complete native human UI approval/rejection and task-loop lifecycle acceptance. Codex API fixtures establish automation behavior only. No Claude probe, verifier assignment, login repair or prior-result promotion is requested. Planning/general writes remain instructional, both Codex hooks disabled; actual per-pass provenance/execution remains separate from model diversity. This checklist supplements, and does not replace, 0543's retained checklist and the Claude-capable handoff above.
