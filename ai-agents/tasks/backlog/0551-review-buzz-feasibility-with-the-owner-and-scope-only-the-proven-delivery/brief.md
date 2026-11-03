# Review BUZZ feasibility with the owner and scope only the proven delivery

## ID
0551

## Sprint
Sprint 16

## Priority
P3

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

**Owner request — 2026-11-03, user chat in `fkit-lead`, relayed to producer:** "Plan a sprint for this".
BUZZ must be optional; fkit remains fully usable from the terminal without BUZZ installed, an account
or network. The initial recommendation is a small experiment, not a commitment to remote implementation.

**Owner steering — 2026-11-03, user chat, relayed:** a skill/command to activate BUZZ for an fkit
session is desirable, not mandatory; terminal/native Codex app work must remain usable without BUZZ.
Prefer a command plus optional skill wrapper subject to findings. Capture this requirement now;
do not treat it as proof of existing-session/native-app attachment or as sprint placement approval.

[0549](../0549-pin-the-optional-buzz-target-and-design-the-fkit-control-boundary/brief.md) specifies a
pinned target and boundary; [0550](../0550-prove-the-optional-buzz-owner-question-and-recovery-flow-in-a-disposable-project/brief.md)
tests the seam or stops with evidence. This task reviews those results with the owner before any
shipped adapter implementation is scoped. A documented negative/blocked investigation can reach
this decision gate; it must not be labelled successful integration to make dependencies appear done.
Only actual producer mover procedures can close investigation tasks, with the required marker.

Initially filed on the Backlog board under `/fkit-task-brief` steps 1 and 8; the owner-approved
Sprint 16 placement is recorded below.
No sprint start, investigation execution, product decision, implementation or release is authorized
by the current planning instruction.

## What to build

A concise owner decision packet and, **only after the actual owner ruling**, a decomposed delivery
plan. In a spawned run return NEEDS-DECISION; lead asks the owner and relays the actual response.
Do not infer an answer from silence, a recommendation, a source report or a completed fixture action.

1. Reconcile 0549/0550 evidence against every requirement: target/runtime support, root owner-question
   flow, authenticated sender/conversation/project, revision-bound approval, replay/duplicate handling,
   one controller including terminal sessions, recovery/cancellation, report privacy and no-BUZZ
   terminal use. Include failed and untested cases and effort spent. A source-only assessment or
   simulated approval is not live proof. Preserve the distinction between request submitted, work
   started, report available, reviewed and producer-closed.
2. Put one recommendation and its main trade-off to the owner: proceed with the proven small scope,
   restrict to read-only status/reports if that alone is proved, or stop/park the experiment. A failed
   first bridge gate blocks plan/control delivery. Failed sender, consent, replay, recovery or
   controller checks block remote actions; they cannot become untracked follow-ups after shipping.
   Missing read-side privacy/access checks also block report delivery. Record actual ruling text,
   date and channel; no synthetic approval or stronger enforcement claim.
3. If approved, scope the smallest independently shippable follow-ups using `/fkit-task-brief`, based
   on the evidence and owner-selected support profile. Candidate delivery seams, **not build briefs
   or approved scope today**: opt-in status/report adapter; plan/decision conversation after its
   stronger gate; setup/disable/recovery documentation and appropriate behavioral verification.
   Each needs real acceptance steps, permitted write surface and prerequisites. Refresh placement
   knock-ons and resolve any interaction with 0548 without duplicating selector retirement.
4. The delivery plan must retain one BUZZ entry → local adapter → dispatcher/lead → fresh roles,
   local canonical project files, effective runtime choices/defaults, independent review, explicit
   plan approval and producer-only lifecycle. Define what a BUZZ work submission does: capture and
   discuss only until a separately approved execution capability exists. No direct chat command
   edits real source, task/board/wiki state, closes work, commits or pushes in this experiment.
5. Include a user guide scope for opt-in setup, exact supported target, required local permissions,
   secure identity storage, limitations while the Mac/app is offline, revoke/disable/uninstall and
   recovery. BUZZ must never become a launcher/install prerequisite; opt-out preserves project files,
   terminal operation and native runtime preferences. Keep phone/always-on/multi-target promises out
   unless independently proved and separately approved. Route eventual wiki ingestion to fkit-wiki.
6. Reconcile optional start/status/disable and skill availability separately. Compare a new
   BUZZ-enabled root, existing-root attachment and a separate context; require project/root/run identity
   plus conversation, pending-decision and dispatcher continuity for any attachment claim. Report native
   app live-attachment/handoff limits explicitly. Verify no-BUZZ terminal/native app operation, network
   loss, shutdown/reload/reconnect, local/remote first-valid-answer consumption, permission preservation
   and no duplicate roots/replays. Identify local continuation versus recovery into a new session.
   A missing skill wrapper alone does not invalidate a proved command. A required persistent host,
   replacement of local interaction or relaxation of same-session behavior needs a concrete owner
   choice before execution depends on it; do not silently accept it between agents. BUZZ-managed
   subprocesses end on app exit/reload; no always-on lifetime is promised.

**Owner-approved sprint placement — 2026-11-03:** [Sprint 16 — Prove the optional BUZZ interface](../../../sprints/sprint-16.md).
Goal: determine whether one pinned BUZZ target can safely carry fkit status/reports and plan
conversations, then obtain an evidence-based owner decision on delivery scope. Approved order:
0549 → 0550 → 0551. Budget: 0550 capped at a proposed 8 active hours, subject to its later start
approval. No calendar deadline is inferred. Sprint success is a reviewed proceed/limit/stop decision
with honest evidence; it does not require claiming a shipped integration after a failed probe.
Sprint 15's four planned tasks and ordering stay separate; no start or priority change is proposed there.
Optional activation and terminal/native Codex app independence are explicit acceptance requirements.
Existing-root attachment and native-app handoff remain feasibility questions, not sprint promises.

## Verification steps

1. Packet links the actual reports and records each gate's evidence/result, including negative,
   blocked and untested outcomes. Support claims match the pinned versions and actual runtime checks.
2. Owner ruling is quoted verbatim with date/channel, or the report returns a pending NEEDS-DECISION
   and writes no approved delivery decision. Headless workers do not ask the owner themselves.
3. For a proceed ruling, new briefs exist only after findings review and actual approval; each has
   an owner, canonical dependency links, board row, setup/opt-out requirements and checkable tests.
   Check every live non-Backlog board under task-brief step 9 after any filing/re-point/pull.
   For limit/stop, scope reflects that ruling with no invented implementation commitment.
4. Decision packet and follow-up plan explicitly preserve terminal independence, runtime/role/review
   and owner-consent boundaries. No real code/wiki writes, start, closure, publication, commit or push
   occurs through this planning task; lifecycle requests are separate producer mover operations.
5. Packet separates command viability, optional skill support, new-root use and verified attachment;
   exposes all unsupported native app/runtime cases and same-conversation versus new-session recovery.
   Any persistent-host/local-interaction/same-session trade-off is put to the owner before dependent
   execution; no current steering capture is misreported as acceptance of that trade-off.

## Notes
- **Depends on:** [0550](../0550-prove-the-optional-buzz-owner-question-and-recovery-flow-in-a-disposable-project/brief.md)
- **Blocks:** nothing
- **Owner-approved placement — 2026-11-03:** [Sprint 16](../../../sprints/sprint-16.md),
  P3, `🔲 Backlog`; scheduling only. Actual owner selection via interactive
  `fkit_roles.fkit_ask_owner` in `fkit-lead`, relayed to this fresh producer; exact quote,
  date and channel are recorded on the sprint board. 0550 waits on 0549; 0551 waits on 0550
  (and through it on 0549), all in Sprint 16. No other open task gains a wait.
  No start or implementation approval; this is not producer precedent for re-ranking.
- **Research seams:** target/design can be reviewed without a prototype; the disposable experiment
  produces useful pass/fail evidence independently of shipping; the owner decision is a distinct
  product deliverable. Shipped adapter/docs work is deliberately not briefed before the gate.
- **Current planning limits:** source-only prior assessment plus one fresh bounded architect consult;
  no BUZZ live integration, human remote approval, phone or recovery test has run in this filing.
- **Wiki:** no BUZZ entry found; ingest findings through the wiki role after the investigation, not now.
- Filed 2026-11-03 by fresh producer; no scope ruling or start approval invented.
- **Steering reconciliation — 2026-11-03:** existing evidence/owner gate and deferred delivery retained;
  added optional activation and native app/attachment/continuity acceptance review from supplied fresh
  architect clarification. No new consult or product decision; placement was still pending at reconciliation
  and is superseded by the owner-approved placement recorded above.
