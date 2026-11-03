# Sprint 16 — Prove the optional BUZZ interface

> ## 🔲 Backlog — 2026-11-03.
>
> **Scheduling only.** No sprint/task start, implementation, installation, external messages, closure,
> commit or push is authorized by this placement.
>
> **Authority — owner ruling, 2026-11-03, channel `fkit_roles.fkit_ask_owner`, interactive MCP form in
> `fkit-lead`, relayed to a fresh `fkit-producer`.** Action `accept`, answered `true`; no alternative
> or comment. Exact selected answer:
>
> "Create Sprint 16 (Recommended) — Schedule 0549/0550/0551 as P1/P2/P3; start nothing. In Sprint 16, 0550 waits on 0549 and 0551 waits on 0550; no other open task gains a wait."
>
> This records the actual scheduling answer, not an approved source implementation plan or producer
> precedent for re-ranking. No existing sprint ranking changes.

## 🎯 The goal

**Determine whether one pinned BUZZ target can serve as an optional fkit interface, then obtain the
owner's evidence-based proceed/limit/stop decision.**

**Success:** 0549 supplies a bounded design and executable experiment contract; 0550 supplies honest
feasibility evidence, or stops with the failed/blocked gate and untested cases; 0551 reviews those
findings with the owner and records the actual decision. A documented negative result is useful
research. Sprint success does not require a shipped adapter or a claim of successful integration.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | P1 | **Pin the optional BUZZ target and design the fkit control boundary** *(Investigation/design only; pin one target, define optional activation, exact owner-question bridge and recovery gates. Depends on nothing; blocks 0550. Owner `fkit-architect`)* | [`0549-pin-the-optional-buzz-target-and-design-the-fkit-control-boundary`](../tasks/backlog/0549-pin-the-optional-buzz-target-and-design-the-fkit-control-boundary/brief.md) |
| 🔲 Backlog | P2 | **Prove the optional BUZZ owner-question and recovery flow in a disposable project** *(Disposable feasibility experiment; real pending owner-question round trip first or stop, then identity/revision, replay, local/remote serialization, fallback and recovery checks. Depends on 0549; blocks 0551. Proposed 8 active hours; later execution/setup/message approval required. Owner `fkit-coder`)* | [`0550-prove-the-optional-buzz-owner-question-and-recovery-flow-in-a-disposable-project`](../tasks/backlog/0550-prove-the-optional-buzz-owner-question-and-recovery-flow-in-a-disposable-project/brief.md) |
| 🔲 Backlog | P3 | **Review BUZZ feasibility with the owner and scope only the proven delivery** *(Review evidence with the owner; proceed with proven scope, limit, or stop. Delivery briefs only after findings and actual owner ruling. Depends on 0550. Owner `fkit-producer`)* | [`0551-review-buzz-feasibility-with-the-owner-and-scope-only-the-proven-delivery`](../tasks/backlog/0551-review-buzz-feasibility-with-the-owner-and-scope-only-the-proven-delivery/brief.md) |

## ⚠️ Notes for the driver

- **Start approval remains required.** All tasks and this board stay `🔲 Backlog`. Scheduling does
  not approve 0549 execution or 0550's later bounded coder plan, setup, disposable project/private
  conversation, installations or external-message exercises. In a headless run return NEEDS-DECISION
  for a genuinely new choice; never manufacture consent.
- **Dependency order:** 0549 → 0550 → 0551. 0550 waits on 0549 with one open task, 0551, behind it;
  0551 waits on 0550 with no open task behind it. These are same-sprint waits accepted in the quoted
  placement option. No other open task gains a wait on Sprint 16; no dependency is re-pointed.
- **Optional activation and local independence:** evaluate optional start/status/disable commands
  plus an optional skill wrapper. Missing skill support alone does not invalidate a viable command.
  Terminal/native Codex app use must remain available with BUZZ absent, disabled or unreachable;
  demonstrate continuation or recovery within actual runtime limits and distinguish a new session.
- **Three modes stay distinct:** new BUZZ-enabled root, existing-root attachment, and separate
  context against the same files. Show project/root/run identity. Attachment requires proof of
  conversation, exact pending-decision and dispatcher continuity. Native app live attachment or
  arbitrary handoff remains unproven; shared files or another process are not attachment evidence.
- **Real first gate:** BUZZ request → fresh fkit lead → delegated worker NEEDS-DECISION → root's
  exact pending owner question → actual human response → correct waiter, including reject. Source
  inspection, native harness selection, mocks and automatic allow responses do not pass this gate.
  If no viable seam exists, stop and take the evidence to 0551.
- **Consent and recovery:** bind owner/conversation, project, controlling run, pending question and
  exact plan revision. Serialize local/remote answers; the first valid answer consumes the request.
  Test invalid/stale/replayed answers, disconnect/reconnect, disable, reload/exit, crashes,
  cancellation and recovery without duplicate roots or actions. A store lock alone does not prove
  controller ownership. Preserve permission limits, fresh role/model routing and owner gates.
- **Bounded investigation:** one Mac, one pinned BUZZ target, one Codex-only fixture project, one
  private conversation and one controlling lead. 0550's proposed cap is 8 active hours, excluding
  owner waits, subject to its later start-plan approval; no calendar deadline is inferred. Stop
  sooner on a failed gate. No automatic extension or replacement target.
- **Separate work:** [0548](../tasks/backlog/0548-use-native-runtime-model-and-effort-defaults-and-retire-fkit-selectors/brief.md)
  owns runtime model/effort selector retirement in [Sprint 15](sprint-15.md). Respect the effective
  contract at execution without duplicating that task or adding a hard dependency. Board/store and
  owner-door work remain separate. Sprint 15's tasks, ordering and status are unchanged.
- **Deferred:** shipped adapter, real-project source/task/board/wiki writes, remote implementation
  execution, lifecycle operations, arbitrary shell, publication, phone certification, always-on
  host/daemon, additional platforms, dual-generation BUZZ support and live Claude/mixed-runtime
  certification. Persistent hosting, replacement of local interaction or weaker same-session
  behavior needs a concrete later owner choice. No live attachment/support claim without proof.
- **Evidence and privacy:** label inherited/source-inspected, executed/pass, executed/fail, blocked
  and untested evidence distinctly. No live BUZZ, human remote approval, attachment or recovery
  success was established by this planning. No secrets or raw account/configuration logs in artifacts.

## Notes

- Created 2026-11-03 by a fresh producer under the relayed owner placement ruling. Existing three
  briefs retained in `tasks/backlog/`; owners and dependency links unchanged. Backlog rows retain
  canonical moved pointers with destination priorities rather than duplicate open membership.
- Only placement metadata, current placement references and these planning boards are changed.
  This dated placement supersedes the briefs' earlier pending-placement statements, retaining the
  latest optional activation, native app, exact-question, identity/replay and recovery requirements.
- No new research or consult. Existing briefs remain authoritative for full acceptance criteria.
  Wiki has no BUZZ entry; its inherited context is nine `ai-agents/` commits behind watermark
  `185ac5e07e918c089ed3afd23496587315342000`. No wiki write or sync performed.

## Planned evidence artifacts

- 0549: sanitized investigation/design report under `ai-agents/knowledge-base/reports/`; exact
  report filename is chosen at execution, not invented here.
- 0550: task-local `findings.md`, per-case evidence and exercised setup/disable/recovery instructions,
  as required by its brief; no findings exist from this scheduling act.
- 0551: owner decision packet and, only after the actual proceed ruling, decomposed delivery briefs.
  No delivery approval or new implementation task is recorded here.
