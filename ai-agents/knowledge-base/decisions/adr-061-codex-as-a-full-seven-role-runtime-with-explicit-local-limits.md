# ADR-061: Codex is a full seven-role runtime with explicit local limits

- **Status:** accepted
- **Date:** 2026-10-29
- **Deciders:** owner (Mark Dolbyrev), by interactive ruling in the desktop migration chat; fkit-architect records the decision

## Context

The accepted runtime rule says **"Claude Code native is fkit's only runtime"** (ADR-009, §Decision). The settled migration adds Codex CLI operation for all seven roles, reusing the installed CLI login and local project/per-role model settings. The owner accepted this architecture and its measured limits on 2026-10-29.

The owner was asked: “Accept the documented local Codex limits—general role writes/planning enforced by instructions, optional trusted extra hooks, and read-only adversarial review pending task 0273—so public Claude/Codex integration can proceed once the sprint passes?” The actual selected response was **“Accept limits; continue migration (Recommended)”**. The preceding “Explain more, then ask again” was not approval. The ruling is recorded in `model-agnostic-sprint/decisions.md` under *“Owner ruling — desktop continuation, 2026-10-29”*.

The accepted boundary is concrete: `model-agnostic-sprint/decision-proposal.md` says *“General role writes, wiki ownership and the no-code-before-plan-approval rule remain instructions”* and *“Optional extra hooks require normal Codex trust.”* The separate adversarial role *“is a read-only leaf”*; the same proposal says a usable same-model pass is supported with a visible different-model recommendation, while unusable/missing passes remain partial. Its *“Headless producer uses automatic approval review with workspace-write”* clause preserves producer-only mover operation and a denial leaves closure pending.

Local acceptance establishes seven direct no-Claude role launches and the local workflows. The owner’s current handoff says the no-Claude task and sprint passed, the task and sprint were closed through producer movers with the `(agent-closed — not owner-verified)` marker, the ledger closed out, and the final clamp check passed; earlier timeout and model-quota failures remain history. After the default-model quota failures, remaining fixture lead/coder/producer runs explicitly selected `gpt-6-luna`, preserving the completed review; this was an explicit fixture choice, not silent fallback. `model-agnostic-sprint/progress.md` still contains earlier checkpoint text such as *“No sprint success yet”* and *“The sprint and pending modes have not yet passed”*; those lines are historical and are superseded by the owner’s current handoff for this decision. The same file records *“All seven direct no-Claude role smoke checks passed”* and the explicit `gpt-6-luna` fixture selection. `model-agnostic-sprint/local-acceptance.md` records the measured limits and says *“Claude compatibility remains unverified”*: two real legacy Claude launcher checks failed with a network/service-related error whose precise cause is unknown.

## Decision

1. **Codex CLI is an accepted full runtime for all seven fkit roles**, in addition to the existing Claude runtime. Each Codex role runs in a fresh CLI process, reusing the installed login. Local ignored settings hold a project default and per-role overrides; explicit `null` follows that runtime's default. Invalid settings or an unavailable selected model do not permit silent fallback. Stable Codex CLI `>=0.165.0` is the validated parser/feature baseline; only the observed Mac, Node 24.13.0 and CLI combination is tested. No shipped model ID, default choice, or cross-runtime model-family diversity is inferred from local fixture models.
2. **Preserve role duties and owner controls.** Keep wiki writes exclusive to fkit-wiki, task/sprint movers exclusive to the producer, owner approval gates, task/sprint state and coder dispositions. Headless producer mover work uses scoped automatic approval review; a denial leaves closure pending, with no manual mover substitute. No commit, push or release is authorized by this decision.
3. **Accept the measured Codex enforcement boundary.** General role writes and plan approval are instruction-enforced. Optional extra hooks act only when normally trusted. The required session-scoped dispatcher enforces owned procedure invocation and consult topology at its invocation boundary; manual shell reads/execution remain outside it. Existing carry checking proves plan fidelity, not owner approval. Do not describe these as universal filesystem controls or a Codex plan-mode write wall.
4. **Keep the adversarial role separate, fresh and read-only.** A usable same-model second pass is supported and must disclose the observed identity/diversity, recommend a different model visibly, and report execution evidence separately. A missing or unusable pass remains partial. Never infer measurement from the sandbox setting.
5. **Keep ADR-042 D2 and task 0273 unresolved.** This decision accepts the current read-only adversarial behavior; it neither reverses nor discharges the accepted workspace-write decision or its outstanding implementation task.
6. **Public Claude/Codex integration may proceed after the local sprint passed, but is not decided or complete here.** Preserve legacy Claude entry behavior as the proposal requires. Exact public runtime selector/default, mixed-runtime routing, migration/upgrade contract, and certified support range remain open implementation and compatibility work. The failed real Claude smoke means compatibility remains unverified. MA-01–16 remains the migration scope; this ADR does not certify MA-14–16 or authorize publication.

## Options considered

- **Add Codex as a full runtime with the measured local limits (chosen).** Matches the owner-approved seven-role no-Claude operation and keeps the limits explicit while public compatibility work proceeds.
- **Keep Claude as the only full runtime and Codex only as an adversarial subprocess.** Rejected by the owner’s settled full seven-role Codex scope.
- **Claim full Codex parity, enforce every role boundary structurally, or make the adversarial process writable now.** Rejected because local Codex does not provide the assumed planning/write wall, extra hooks require trust, and ADR-042 D2/task 0273 remains unresolved. This would overstate measured guarantees or silently reverse a separate accepted decision.
- **Treat local acceptance as release certification and settle public selectors/defaults now.** Rejected: real Claude compatibility failed and the proposal explicitly leaves public command/default and mixed-runtime details to concrete stage-2 work.

## Consequences

- **Positive:** Codex can run the full seven-role team without Claude; model identity, pass availability, diversity and executed checks remain distinct facts; the accepted limitations are visible to future implementers.
- **Negative / costs:** General write and planning rules depend on instructions; optional hooks may be inactive; the adversarial role cannot write; same-model passes provide no model-family diversity; legacy Claude compatibility and public distribution are not certified.
- **Residual risks / “re-raise only if”:** reopen the local enforcement boundary if Codex gains or loses a measured control, if a hook is relied on without trust, if owner approval is inferred from carry fidelity, or if a usable same-model pass is represented as diverse. Revisit adversarial write access only through the outstanding ADR-042 D2/task 0273 decision. Do not re-raise accepted limits as defects. Public command/default/routing and compatibility remain open until their own implementation evidence and owner decision.

## Related

- `model-agnostic-sprint/decision-proposal.md` — cite mutable text by the quoted phrases in §Context; proposed public integration is not accepted in full here.
- `model-agnostic-sprint/decisions.md` — *“Owner ruling — desktop continuation, 2026-10-29”* and the actual selected response.
- `model-agnostic-sprint/local-acceptance.md` — *“Boundaries and guarantees”* and *“Claude compatibility remains unverified.”*
- `model-agnostic-sprint/progress.md` — *“All seven direct no-Claude role smoke checks passed”*; the owner's current handoff supersedes earlier pending/failed workflow checkpoint text for the final local outcome.
- [ADR-009](adr-009-claude-code-native-is-the-only-runtime.md), [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md), [ADR-042](adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md), [ADR-054](adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode.md), [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md), [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md), [ADR-030](adr-030-stop-hook-enforces-turn-completion-contract.md), [ADR-059](adr-059-plan-review-on-by-default-with-a-no-plan-review-opt-out-sprint-loop-runs-first-provisional.md), and [ADR-060](adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md).
- **Wiki:** fkit-wiki should ingest this ADR into the wiki decisions pages; architect does not write the vault.
