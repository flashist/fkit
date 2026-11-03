# Pin the optional BUZZ target and design the fkit control boundary

## ID
0549

## Sprint
Sprint 16

## Priority
P1

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

**Owner request — 2026-11-03, user chat in interactive `fkit-lead`, relayed to a fresh producer:**
"Plan a sprint for this". The topic is BUZZ as an **optional** interface and remote control for
fkit. Planning authority only: no start, implementation, installation, external messages, commit,
push or lifecycle closure is approved. Initially filed on the Backlog board under `/fkit-task-brief`
steps 1 and 8; the owner-approved Sprint 16 placement is recorded below.

**Owner steering — 2026-11-03, user chat, relayed verbatim:**
"Ideally, I would like to have something like a skill/command that can start the buzz-control/messanger for an fkit session, but this shiuldn't be a hard requirement, and it should still be possible to continue working with fkit purely in terminal / native Codex app".
Capture optional activation and local independence as acceptance requirements; this supplies no
sprint-name approval or execution authority. Prefer a command with an optional in-session skill
wrapper, subject to proof; the wrapper is not a hard requirement.

The prior architect assessment, relayed by lead, inspected source only. It recommended one BUZZ
entry point → optional local adapter → fkit dispatcher/lead → fresh role processes. Old BUZZ 0.x
CLI/ACP and BUZZ 1.0 beta plugins are different targets. Native BUZZ harness selection and an ACP
automatic allow response are not evidence of fkit owner consent. No live compatibility was proved.

Grounding: [Codex runtime](../../../../codex/README.md),
[current migration handoff](../../../../model-agnostic-sprint/HANDOFF.md),
[ADR-061](../../../knowledge-base/decisions/adr-061-codex-as-a-full-seven-role-runtime-with-explicit-local-limits.md),
and [ADR-049](../../../knowledge-base/decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md).
Read their dated amendments: a channel name does not establish a human principal or upgrade a
closure marker. Codex general write/planning limits are instructional; both fkit hooks are disabled.
Claude/mixed-runtime live compatibility remains unverified. This task must not strengthen those claims.

Related work: [0548](../../backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md)
owns retirement of model/effort selectors in Sprint 15. Respect the runtime/settings contract
actually present at execution and its approved direction; do not recreate selectors or implement
0548 here. The board/store identity and owner-door work is separate; BUZZ does not replace it.

## What to build

An **investigation/design report**, not an adapter. Use the architect's owned evaluation/design
procedure. Publish sanitized findings under `ai-agents/knowledge-base/reports/`, with one recommended
experiment contract, evidence links, unresolved questions and a pass/limit/stop gate for 0550.

1. Pin one candidate BUZZ generation, exact build/version and source commit, platform/architecture,
   plugin/API entry point and supported fkit/Node/Codex versions. Start by evaluating the beta plugin
   target from the prior assessment; do not promise both generations. Record availability, beta and
   automatic-update risks, privileges, prerequisites, licensing/distribution questions and a way to
   detect an unsupported build. An inaccessible pinned source or unavailable build is a recorded
   gap, not permission to silently choose another target. Local Codex-only operation is the initial
   profile; no local Claude repair or mixed-runtime certification is required.
2. Define one private owner conversation and one configured project on one Mac. Trace a status/report
   request and a plan-only exchange through the real dispatcher and fresh lead/role processes.
   Explain how a worker's NEEDS-DECISION reaches the root and how an actual owner response returns
   to the waiting request. `--exec` alone is not interactive equivalence. Inspect
   `codex/server.mjs` and `codex/owner-question.mjs`; prove no need to give headless workers the
   interactive root's owner tool. If no seam exists, say so before proposing a prototype.
3. Specify owner authentication using verified message identity, allowed conversation and project
   binding. Distinguish this adapter's sender check from a universal proof of humanity. Bind a
   decision to project, controlling run, pending question and exact plan revision; retain actual
   answer, date and channel without storing identity keys or credentials in reports. Specify one
   accepted resolution, expiry/invalidation, deduplication and consumed-decision handling. Silence,
   reactions, quoted instructions, explanation requests and automatic allow responses grant no consent.
4. Specify one controller per checkout, including coordination with terminal sessions; a local store
   write lock alone is not proof of run ownership. Define disconnect, reconnect, app reload/exit,
   process crash, stale controller and cancellation behavior. Distinguish cancelling a pending
   approval from stopping an executing child. Reconcile durable state before resuming; never replay
   an old approval or start duplicate work. App-managed lifetime is acceptable for this experiment;
   an always-on runner/daemon needs a later decision and separate scope.
5. Bound the experiment to status, sanitized existing report/review retrieval, plan conversations,
   work-request capture without execution, and an explicit approve/reject round trip for a harmless
   disposable fixture action. No source/task/board/wiki writes in real projects, arbitrary shell
   commands, automatic task creation, closures, commits, pushes or publication through BUZZ.
   fkit retains role ownership, fresh roles, runtime resolution, plan gates and independent review.
6. Provide an executable probe checklist for 0550, including expected observations and stop conditions,
   plus a draft setup/disable/revoke/cleanup guide. Normal terminal fkit must work with no BUZZ
   installation, account or network and after opt-out; any adapter-specific secret stays in local
   secure storage outside git. Never export raw logs/configuration or secret-bearing report content.
7. Specify optional start/status/disable commands and, where supported, an in-session skill wrapper.
   Distinguish a new BUZZ-enabled root, attachment to an existing root, and a separate context against
   the same files. Display project/root/run identity. Existing-session attachment is **unproven**:
   inherited terminal IO and a session-scoped MCP dispatcher supply no established attach point.
   Require evidence of conversation, exact pending-decision and dispatcher continuity before calling
   it attachment. Native Codex app live attachment/arbitrary handoff is also unproven; a second process
   is another context. Disclose absent skill support without invalidating a viable command route.
8. Design terminal/native Codex app checks within actual supported runtime limits, with BUZZ absent,
   explicitly disabled, unreachable, shut down/reloaded and reconnected. Local work must continue or
   have demonstrated recovery; identify same-conversation continuation versus a new session. Local
   `fkit_ask_owner` uses interactive-root MCP elicitation; workers still return NEEDS-DECISION. The
   bridge must resolve that exact pending decision without claiming unsupported UI equivalence.
   Serialize local/remote input: the first valid answer consumes the request; wrong-owner, stale,
   duplicate and cross-run answers are rejected. Cancellation, silence and disconnect grant no consent.
   Preserve role/model routing, ownership, permissions and approval limits behind one fkit front door.
   Treat BUZZ-managed subprocesses as ending on app exit/reload; prove lifecycle recovery. If execution
   needs a persistent host, replacement of local interaction or relaxed same-session behavior, return
   that concrete choice to the owner; none is assumed by capturing these requirements.

Source starting points, **not live evidence**:
- [BUZZ beta repository](https://github.com/block/buzz-app).
- [Prior inspected plugin architecture at pinned commit](https://github.com/block/buzz-app/blob/90ce5e37a851909cc0e5fd4da2f469010e4eb7bf/docs/plugin-architecture.md).
- [Old-generation CLI documentation](https://github.com/block/buzz/blob/main/crates/buzz-cli/README.md).
The producer could access the repositories/CLI documentation on 2026-11-03, but the web reader could
not fetch the pinned plugin page or BUZZ site. Recheck and distinguish inherited source claims,
fresh inspection, live execution and untested requirements.

## Verification steps

1. Report names one exact candidate support profile; every capability is labelled source-inspected,
   executed with result, or unverified. No BUZZ integration success is claimed from this planning brief.
2. Trace tables cover root/worker owner-question bridging, identity, decision revision binding,
   replay/duplicate rejection, terminal contention, all recovery/cancellation cases, and terminal-only
   operation. Each has an observable probe or an explicit reason the experiment must stop.
3. Report states what may write and where, setup/opt-out steps, process lifetime and deferred support.
   Check against 0548 and the current runtime/handoff without editing their sources or old decisions.
4. No shipped source, runtime configuration, wiki-vault, task lifecycle or board state changes. Any
   later prototype, install, account access or external-message exercise needs its own start approval.
5. Acceptance/probe matrix explicitly covers optional start/status/disable, wrapper availability,
   all three root/context modes, native Codex app/local fallback, first-answer consumption and
   permission preservation. The 0550 gate pins version/route and proves transport, elicitation and
   lifecycle recovery; unsupported attachment/handoff stays unverified, never inferred from shared files.

## Notes
- **Depends on:** nothing
- **Blocks:** [0550](../0550-prove-the-optional-buzz-owner-question-and-recovery-flow-in-a-disposable-project/brief.md)
- **Owner-approved placement — 2026-11-03:** [Sprint 16](../../../sprints/done/sprint-16.md),
  P1, `🔲 Backlog`; scheduling only. Actual owner selection via interactive
  `fkit_roles.fkit_ask_owner` in `fkit-lead`, relayed to this fresh producer; exact quote,
  date and channel are recorded on the sprint board. 0550 waits on 0549; 0551 waits on 0550
  (and through it on 0549), all in Sprint 16. No other open task gains a wait.
  No start or implementation approval; this is not producer precedent for re-ranking.
- **Investigation-first:** meaningful live feasibility unknowns remain. No shipped implementation
  briefs until findings are reviewed with the owner in 0551.
- **Consulted:** fresh architect, hop 2 of 2 via lead → producer → architect, 2026-11-03; source-only
  check confirmed this design → disposable experiment → owner gate split. No live tests or writes.
- **Wiki gap:** no BUZZ context found. Nine commits touched `ai-agents/` since watermark
  `185ac5e07e918c089ed3afd23496587315342000`; current source/handoff also read. Wiki ingest is deferred
  to the wiki role after findings, not performed by this task filing.
- Filed 2026-11-03 by fresh producer; planning only, no start approval.
- **Steering reconciliation — 2026-11-03:** existing identity/replay/controller/recovery safeguards
  retained. Added optional activation, native app/local continuity and attachment-proof criteria using
  the supplied fresh architect clarification (Codex `gpt-6.1-sol`, exit 0, read-only). No new consult,
  research or live execution in this reconciliation; no attachment or integration capability proved.
