# Prove the optional BUZZ owner-question and recovery flow in a disposable project

## ID
0550

## Sprint
Sprint 16

## Priority
P2

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Owner request — 2026-11-03, user chat, relayed by `fkit-lead`:** "Plan a sprint for this" —
optional BUZZ interface and remote control. This is a **feasibility investigation**, not a shipped
adapter implementation brief. The prior architect source inspection is not a live compatibility
test. [0549](../../done/0549-pin-the-optional-buzz-target-and-design-the-fkit-control-boundary/brief.md)
must supply the pinned experiment contract first. If it finds no viable seam, do not build around
that result; return the evidence to the owner through 0551.

Planning authorizes no execution, installation, message sending or account/configuration changes.
Before any experiment, the owner must approve the bounded coder plan, the disposable project/private
test conversation, any prerequisite setup and explicit external-message tests. Use existing local
credentials without copying them into artifacts. Missing authorization or prerequisites means stop
and return NEEDS-DECISION; no automatic installs or substitute identities. Initially filed on the
Backlog board under `/fkit-task-brief` steps 1 and 8; the owner-approved Sprint 16 placement is
recorded below.

Read [Codex runtime](../../../../codex/README.md) and
[current migration handoff](../../../../model-agnostic-sprint/HANDOFF.md) again at execution.
Use fkit's actual dispatcher/runtime resolution; [0548](../../backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md)
owns selector retirement. Both Codex hooks remain disabled; general planning/write boundaries are
instructional. Do not substitute BUZZ's native Codex/ACP permission defaults for fkit consent.

**Owner steering — 2026-11-03, user chat, relayed:** optional skill/command activation is desirable;
terminal/native Codex app work must remain possible without BUZZ. Prefer a command plus optional skill
wrapper, not a mandatory wrapper. Existing-session and native-app attachment/handoff are unproven.
The supplied fresh architect clarification adds proof requirements, not a claim that a seam exists.

## What to build

A bounded disposable experiment and sanitized evidence report. A throwaway local adapter/probe is
permitted only under the later approved investigation plan, outside shipped source and real project
state. One Mac, one pinned BUZZ target, one configured Codex-only fixture project, one private owner
conversation and one controlling fkit lead. No seven independent BUZZ bots.

1. **First stop gate:** show a real BUZZ message reaching a fresh fkit lead through the proposed seam,
   a fresh delegated role returning NEEDS-DECISION, the root presenting that pending question, and
   the actual human owner's answer returning to the correct waiter. Also exercise reject. Mocks,
   synthetic responses, `--exec` output and BUZZ's native harness alone do not pass this gate.
   If unsupported or blocked, stop here; publish the reason and unexecuted matrix for 0551 rather
   than expand the architecture or weaken approval. A source-only finding is a valid research result.
2. If the bridge works, exercise real status retrieval and a sanitized existing report/review result,
   a plan-only conversation, and capture of a work request that starts no implementation. Assert
   that role dispatch, fresh processes, effective runtime configuration, canonical local task files
   and report provenance remain with fkit. Report availability separately from verified completion.
3. Use a harmless fixture action such as creating one marker in the disposable directory. Require
   explicit human approve and reject for distinct pending requests. Bind owner/conversation,
   project, run, question and exact plan revision; retain answer/date/channel in sanitized evidence.
   Check wrong sender/conversation/project/run/revision, expired/replayed/duplicate/out-of-order
   delivery, competing answers, silence, edited/quoted messages, explanation-only response and
   rejection. Expected: no unauthorized action; at most one accepted resolution/action for an
   approved request. Label injected negatives as synthetic, separate from human UI evidence.
4. Exercise disconnect before answer, reconnect, app exit/reload, local child/adapter crash and
   restart, late answer, cancellation while waiting and cancellation after fixture action starts.
   Define and observe invalidation versus child termination; cancelling an owner form is not itself
   evidence that a child stopped. Reconcile disk state and controlling-run ownership before any
   resume; old approvals cannot revive, completed actions cannot run twice. Record process lifetime
   and residual/orphan behavior. No automatic always-on runner is added.
5. Compete with a terminal controller for the same fixture checkout, including a terminal session
   already running before the adapter starts. Demonstrate one controlling run and explicit busy or
   paused behavior; do not claim a store lock proves this. If terminal coordination cannot be
   demonstrated, block control support and report the limitation.
6. Follow the draft setup guide on the supported profile; test disabled/missing BUZZ, unavailable
   account/network, opt-out, identity revocation, teardown and return to normal terminal fkit.
   Normal terminal use must need no BUZZ account, installation, connection or adapter service.
   Local canonical project files and native runtime preferences survive. Report/review retrieval
   must omit secrets and identify stale results without upgrading approval or closure markers.
7. Exercise optional start/status/disable for the pinned route, and the skill wrapper only where
   supported. Record three distinct modes: new BUZZ-enabled root, existing-root attachment and separate
   context. Show project/root/run identity. To pass an attachment claim, prove the same conversation,
   exact pending decision and dispatcher continue; sharing project files or launching another process
   is insufficient. Record unsupported modes and unavailable skill support explicitly; a viable
   command route can still be considered at 0551 without claiming attachment or an approved compromise.
8. Explicitly check terminal and native Codex app use with BUZZ absent, disabled and unreachable,
   then during network loss, BUZZ shutdown/reload and reconnect. Show continuing local work or actual
   recovery and whether it retains the conversation or needs a new session. Native app arbitrary
   handoff/live attachment needs its own evidence; unsupported checks remain blocked/untested. Exercise
   local interactive-root MCP elicitation and remote resolution of its exact pending decision; serialize
   local/remote inputs and race valid local/remote answers in both orders. First valid answer consumes
   the request; reject all later answers without repeated action. Verify permission/approval limits
   survive the transport alongside role/model routing. BUZZ-managed subprocesses end on app exit/reload;
   recovery must not create duplicate roots, replay commands or repeat implementation. Stop for a
   concrete owner choice if persistent hosting, replacement of local interaction or weaker same-session
   behavior is necessary; do not silently broaden this experiment.

**Budget proposal:** at most one working day (8 hours) of active experiment time, excluding owner
waits. Include the cap in the future start-plan approval; stop sooner at the first gate failure.
No time extension, extra target/runtime, persistent runner or shipped adapter under this brief.

**Output:** task-local `findings.md`, per-case evidence and setup/disable/recovery instructions with
commands actually exercised. Use only sanitized summaries in git; no keys, connection endpoints,
credentials, actual identity material or raw account/config logs. Results are `executed/pass`,
`executed/fail`, `blocked`, or `untested` **evidence labels**, not task status values. Record exact
versions, commands, results, failure/recovery history and source-inspected versus live coverage.

## Verification steps

1. The later execution plan/approval identifies fixture scope, external-message authorization,
   harmless action and effort cap. No planning approval is presented as permission to execute.
2. First-gate evidence shows real owner approve/reject plus worker → root → waiting-request round
   trip, or a documented stop. Each later case has a result label and evidence; unrun cases remain
   untested/blocked. Human UI evidence is never inferred from a mocked response.
3. Approved fixture action occurs once; reject, no answer and all invalid decisions cause zero
   actions. Recovery/terminal competition prove no duplicate action or controller, or fail the gate.
4. Setup/opt-out/no-BUZZ checks preserve terminal usability and user configuration; lifecycle and
   cancellation observations match the design or list concrete failures for 0551.
5. Compare before/after manifests for real source, task/board and wiki state: unchanged by the
   experiment. No real task/sprint closure or lifecycle write, implementation, commit/push or release.
   Any fixture lifecycle test requires an actual producer mover and separate scope; none is needed here.
6. Apply [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md):
   disposable probes do not create a permanent test lane; no new repository test file/prove-red case
   without the owner's individual approval. Existing suites alone do not prove BUZZ compatibility.
7. The feasibility gate names the pinned version/route and shows transport, exact pending-decision
   elicitation, permission preservation and lifecycle recovery, alongside real request → role question
   → human owner decision → continuation and reject/concurrency/disconnect evidence. Activation and
   terminal/native app checks have per-case evidence or explicit limits. No same-session/handoff
   claim rests on a separate process; command viability is reported separately from skill availability.

## Notes
- **Depends on:** [0549](../../done/0549-pin-the-optional-buzz-target-and-design-the-fkit-control-boundary/brief.md)
- **Blocks:** [0551](../../done/0551-review-buzz-feasibility-with-the-owner-and-scope-only-the-proven-delivery/brief.md)
- **Owner-approved placement — 2026-11-03:** [Sprint 16](../../../sprints/done/sprint-16.md),
  P2, `🔲 Backlog`; scheduling only. Actual owner selection via interactive
  `fkit_roles.fkit_ask_owner` in `fkit-lead`, relayed to this fresh producer; exact quote,
  date and channel are recorded on the sprint board. 0550 waits on 0549; 0551 waits on 0550
  (and through it on 0549), all in Sprint 16. No other open task gains a wait.
  No start or implementation approval; this is not producer precedent for re-ranking.
- **Stop/return:** an unavailable bridge, failed identity/approval/replay/recovery/controller check,
  missing prerequisite or budget exhaustion leads to findings and owner decision, never silent scope
  expansion. Read-only-only support can be proposed at 0551; it is not accepted here.
- **Deferred:** shipped code, production write/control commands, real task/board/wiki edits or closures,
  remote implementation execution, phone certification, always-on operation, additional platforms,
  old/new BUZZ dual support and live Claude/mixed-runtime certification.
- Filed 2026-11-03 by fresh producer; no execution performed or start approved.
- **Steering reconciliation — 2026-11-03:** retained first-stop gate, identity/replay negatives,
  terminal contention, cancellation, opt-out and proposed cap; added optional activation, native app,
  attachment continuity, local/remote answer races and explicit permission/lifetime proof. Supplied
  architect guidance only; no new consult or live probe run. Dependencies and placement unchanged.
