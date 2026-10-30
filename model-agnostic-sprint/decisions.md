# Runtime decisions — working record

Status: implementation record and proposals for owner review, not an accepted ADR. This does not rewrite ADR-009, ADR-042 or ADR-054. Scope follows `plan.md`; compatibility/distribution remain part of the objective after local acceptance.

## Current 0543 acceptance and closure — 2026-10-30

**Current accepted/closed checkpoint — 2026-10-30:** 0543 is **✅ Done (agent-closed — not owner-verified)**
through the actual producer-owned `fkit-task-done`; the entire folder is now in `tasks/done/`,
and its brief/Sprint 12 markers match. The actual human desktop-chat `request_user_input_async`
answer, recorded at `2026-10-30T08:58:46.877838+00:00`, accepted the exact C1–C5 in the
[accepted proposal](../ai-agents/tasks/done/0543-turn-plan-review-on-by-default-in-fkit-coder-sessions-and-plain-fkit-plan-task/acceptance-proposal.md) and replaced the October 27 personal-live-check hold
for Codex completion only. The actual architect's dated additions to ADR-060 and the October 24
design report were verified before closure. This closure does not make deferred checks pass.

Complete Codex native human UI approval/rejection and the original Claude checks remain separately
unverified; see the proposal's retained checklist and `validation.md`. Synthetic replies remain
synthetic. Both passes used the same model. A different model is recommended for a broader second
opinion; independent serving identity/diversity remains unverified. Planning/general writes remain
instruction-only and both Codex hooks stay disabled. Existing bounded evidence is not a new full
post-follow-up task/sprint lifecycle or Claude/mixed certification. No workflow tests were rerun.

0544 planning is now permitted under the confirmed 0543 → 0544 → 0545 order; this closure run
starts no planning or implementation and changes no other task/sprint status, rank, dependency or
goal. Implementation still needs its own plan approval. No commit, push, release or wiki write.

## Owner interview and work direction — 2026-10-30

Exact selected responses in the desktop conversation:

1. "Codex acceptance proposal (Recommended) — propose accepting the Codex results, with Claude verification tracked separately."
2. "Use confirmed evidence (Recommended) — limit the wording to behavior already demonstrated."
3. "Finish the plan-review rollout and clarify planning limits (Recommended)."
4. "Keep the reported order (Recommended) — resolve 0543, then advance 0544 and 0545."

The first question explicitly selected a proposal direction, not task-closure approval. The owner
then clarified that the coordinator does the work and any tests it can perform, asks actual remaining
questions interactively, and requests an owner-performed test only when it cannot perform it itself.
No manual terminal relay is a prerequisite for this preparation. These answers authorize recording
the goal/order/evidence and drafting 0543's Codex acceptance, not fabricated human UI evidence or a
silent rewrite of its original criteria. The original Claude/native checks remain unverified; hooks
stay disabled; no commit/push/release or task closure is inferred.

The concrete proposal and retained evidence live in the 0543 task folder's
[acceptance-proposal.md](../ai-agents/tasks/done/0543-turn-plan-review-on-by-default-in-fkit-coder-sessions-and-plain-fkit-plan-task/acceptance-proposal.md).

## Owner ruling — disable both Codex hooks for the first version, 2026-10-29

Actual owner instruction in this chat: “I want to remove both hooks for now.” The owner requested
disabling the code that creates the hooks, retaining it for later, and evaluating fkit without hooks
before deciding whether any are needed. This supersedes the earlier optional-hook launch behavior.

Codex PreToolUse and Stop registrations are disabled for every direct/delegated and
interactive/headless role. `hook.mjs` and registration code remain dormant, with no user-facing
enable switch. Model/effort selection, native-spawn disable flags, dispatcher checks, owner forms,
and written role/question/footer instructions remain. Legacy Claude and unrelated user hooks are
outside this change. Restart existing sessions to stop using the earlier session registrations.
No commit, push or publication authorized.

## Owner decisions already recorded in HANDOFF.md

- Seven roles work through installed Codex CLI and existing login without Claude. Offline model weights are outside this stage.
- Project default and per-role model overrides; exact IDs and the CLI default remain valid choices. Credentials stay with the CLI.
- Separate adversarial role even with one model. Pass availability, actual diversity and executed checks are separate facts. A failed second pass stays partial; a usable same-model pass is supported with a visible recommendation for another model.
- First local operation, then Claude compatibility and distribution. Preserve old users, existing files, lifecycle procedures and wiki ownership. Direct APIs and other providers are later scope.
- No commits, pushes or release publication authorized.

## Owner ruling — desktop continuation, 2026-10-29

Question: “Accept the documented local Codex limits—general role writes/planning enforced by instructions, optional trusted extra hooks, and read-only adversarial review pending task 0273—so public Claude/Codex integration can proceed once the sprint passes?”

Actual response through the interactive owner question in this chat: **“Accept limits; continue migration (Recommended)”**. This followed an explanation request and the owner's “ask again”; the explanation request itself granted no acceptance.

The local limits in `decision-proposal.md` are accepted for this implementation. Public integration remains conditional on passing the sprint; full migration scope remains MA-01–16. This records the actual ruling, not an accepted/numbered ADR or a completed local milestone. No commit, push or publication authorized.

## Owner availability clarification — 2026-10-29

Actual owner response after the normal-Terminal diagnostic: “The command runs, but it fails due to
some problems with API, don't count on Claude to be available here locally”. Local execution and
acceptance must use Codex for all seven roles. No further local Claude troubleshooting/probes are
required for this deliverable. Retain the legacy/optional Claude adapter and its existing contract
coverage, but defer actual Claude and mixed-runtime certification to a capable environment. This
does not authorize removing Claude support, claiming it works, or silently switching selected models.

## Local implementation choices and evidence

| Choice | Evidence / limit |
| --- | --- |
| Fresh CLI process for every role | Live lead → coder → adversarial and producer → architect/wiki checks. Native subagents disabled on this path; review never resumes coder context. |
| Session-scoped stdio MCP dispatcher | Starts child CLIs outside a parent's shell sandbox; required startup, fixed caller, canonical ownership registry and explicit lineage. No persistent service. |
| Skill ownership at dispatcher invocation | 196 actual MCP role/skill combinations checked. Manual shell reads remain outside this boundary. |
| Ordinary two-hop/cycle/leaf checks, separate reviewer second-pass route | Protocol checks and live nested roles. Separate second pass preserves the former external-CLI exception at the normal depth limit. |
| Interactive owner forms, headless decision returns | Live protocol acceptance/rejection and terminal rendering/cancellation. Unanswered/cancelled forms never grant approval. Synthetic fixture answers are not real project approvals. |
| Planning and general role writes remain instructions | No assumed EnterPlanMode/ExitPlanMode write wall. Coder session signal defaults on; worker signals come from their driver. |
| Codex hooks disabled for the first version | Current owner ruling above disables both registrations. Earlier trust/Stop-marker probes remain historical evidence only; dispatcher ownership is independent. |
| Keep live adversarial read-only behavior | ADR-042 D2 accepted workspace-write but implementation remains outstanding under existing task 0273. This migration has not resolved or duplicated it. Never infer measurement from the sandbox flag. |
| Validated CLI baseline 0.165.0, Node 24.13.0 on this Mac | Minimum stable CLI guard implemented and checked against old, prerelease, malformed and supported versions. Other versions/platforms not certified. |
| Headless producer sandbox exceptions use Codex automatic approval review | The task fixture exposed protected Git writes as a closure blocker. Producer-only `--approve-for-me` selects workspace-write and reviews requested exceptions; it must not be combined with `--sandbox`. Bounded task closure now passed through the producer mover with the agent-closed marker. No direct bypass, commit or push. |
| Keep canonical prompts/payloads under claude/ during this port | Generated Codex skills adapt runtime statements and helper paths. No second ownership map; historical decisions remain historical. |

## Decisions to finalize after local acceptance

The public command/default selection, migration of existing installs, any mixed-runtime role-routing contract, certified support range and accepted enforcement limits need a concrete implementation/compatibility report before owner sign-off. Do not label this file an accepted ADR or claim MA-03/MA-13 complete from implementation intent alone.

The public migration must update installer resources, update/self-host paths, board/heal discovery, release validation and current docs together. Existing Claude behavior must be tested with real sessions; stubs establish argument routing only. Publishing and committing remain separate owner actions.

## Owner acceptance — 2026-10-30

Actual desktop chat request_user_input_async question, verbatim:

> Accept the reviewed Codex-only criteria for 0543, leave the listed Claude/native human UI checks explicitly unverified and tracked separately, and replace your earlier personal-live-check hold so the producer can close 0543 as agent-closed—not owner-verified, then begin 0544 planning?

Actual selected answer, verbatim:

> Accept Codex criteria; close 0543 and plan 0544 (Recommended)

Recorded at 2026-10-30T08:58:46.877838+00:00; this is the human owner's response, not a synthetic fixture reply. It accepts the proposed Codex criteria C1–C5, retains the separate unverified native UI/Claude checklist, replaces the earlier personal-live-check hold for Codex completion only, and authorizes producer closure with the (agent-closed — not owner-verified) marker followed by 0544 planning. It does not verify deferred behavior, approve 0544 implementation, authorize a commit/push/release, reactivate hooks or grant wiki write ownership. Architect note and producer closure are the remaining execution steps; closure has not yet landed when this entry is filed.
