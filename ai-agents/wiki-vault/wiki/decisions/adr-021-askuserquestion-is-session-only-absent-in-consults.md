# ADR-021: `AskUserQuestion` is session-only — absent in spawned consults

**Date**: 2026-07-17
**Status**: accepted

## Context
The owner asked to *"make `AskUserQuestion` available for all agents."* It is a built-in Claude Code **tool** (gated by `tools:` frontmatter), not a skill — and it appeared in none of the seven agents' allowlists. The central worry (the investigation's Conflict 3) was that granting it would let a spawned consult **interrogate the owner mid-chain**, changing the two-hop consult model. The `--append-system-prompt` precedent established that harness behavior across the session/consult seam **must be measured, not reasoned**.

**It was measured** (`knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md`), **harness pinned: Claude Code 2.1.212**:
- **Consult (spawned subagent): `TOOL_ABSENT`, 3/3** — even at the broadest `tools: *` grant, with a live control and an anti-fabrication guard. The failure mode is **absence**, not the feared *hang* — the safest possible mode.
- **Session (top-level): works, 1/1.**

This ADR is a **tombstone**: it records the measured constraint so the consult model is not re-litigated.

## Decision
On Claude Code 2.1.212, `AskUserQuestion` functions in a top-level `fkit <role>` session and is `TOOL_ABSENT` in any spawned consult, at any depth, regardless of the `tools:` grant. Therefore:
1. **A consult cannot ask the owner.** The standing "return open questions in your reply" contract is not merely a chosen convention — **on this harness it is the only option a consult has.** Unchanged.
2. **Granting the tool cannot change the consult model** — any grant is session-only ergonomics. Conflict 3 is empirically void.
3. **"All agents" cannot include the second model** — the adversarial reviewer runs on Codex (no such tool) and is a findings-only leaf. Excluded from any grant.
4. **The owner-approved grant**: add the tool to the six Claude-side agents (producer, coder, architect, reviewer, wiki, lead) plus a one-line session/consult note each — implemented by [[tasks/grant-askuserquestion-tool-to-six-claude-agents]].

## Consequences
- The consult model is settled with evidence; the dangerous *hang* failure mode is measured as **not present**.
- **This is a version-scoped fact.** A harness that later exposes the tool to subagents invalidates Decisions 1–2 — re-measure with the same design (multiple trials, control, pinned version) before assuming the seam changed. Do **not** re-raise "why can't a consult ask the owner?" as a design gap, and do **not** re-raise granting it to the adversarial reviewer (structurally impossible).
- The grant mechanism (explicit `tools:` entries) was later **subsumed by** [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — the capability now arrives by inheritance; the harness fact recorded here still holds.

## Related
- [[tasks/investigate-askuserquestion-availability-for-agents]] — the investigation (task 39) that produced this
- [[tasks/grant-askuserquestion-tool-to-six-claude-agents]] — the grant implementation (task 54)
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — subsumes the grant mechanism; the fact here survives it
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the two-hop consult envelope this confirms
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the precedent tombstone (`--append-system-prompt` session-only), same seam, same measure-don't-reason discipline
- [[systems/role-locked-sessions]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — the AFK-timeout fact this ADR's per-call finding did not cover; the precedent it first violated
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — why a spawned producer has no owner channel
- [[tasks/add-open-questions-interview-skill-for-six-roles]] — a skill built around this seam's consult degrade
- [[tasks/restructure-coder-report-summary-then-interview]] — the coder's interview, degrading across this seam
- [[tasks/design-ship-loop-timeout-auto-proceed]]
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — this seam makes that hook's consult skip **safety-critical**: blocking a consult for a missing `AskUserQuestion` call would demand a tool that cannot be called
- [[tasks/build-adr-030-stop-hook]] — task 0127: the build closed that hazard **structurally** — the `Stop` hook registers on `Stop` only, never `SubagentStop`, so it never fires in a consult where `AskUserQuestion` is absent
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — task 63: no owner channel in a consult is why relayed consent is unverifiable
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — ADR-031: `fkit-lead` becomes the orchestrating front door — the "not a doer" stance is reversed
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — ADR-032: The `fkit-sprint-ship-loop` autonomy & consent model — the conductor at sprint scope
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — ADR-033: The task movers are producer-only again — ADR-025's "any role" grant is reversed
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — Evolve `fkit-lead` into the orchestrating conductor (reverse the non-doer stance)
- [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] — task 0118: the session-only channel this ADR measured is **why ADR-032's declared-approval marker has no verifiable token** (§A3)
- [[tasks/track-fkit-coder-declared-approval-carve-out]] — task 0119, the carve-out that exists because a spawned coder cannot reach the owner
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — why a spawned worker cannot verify the named-owner-ruling marker
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162` — why worker-side carry detection is **impossible**, and why the `carried-not-approved` residual is **structural** rather than provisional
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202` — approval leaves no artifact, which is why the driver's `plan.md` write narrows the hazard without closing it
- [[tasks/decide-what-the-sprint-driver-does-when-a-spawned-worker-dies]] — task `0167`, whose six open questions were **returned to the driver, not asked**
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200` — why `/fkit-evaluate-approach` Step 1's owner interview **could not be executed as written**. The driver pre-supplied a ruled priority ordering; **everything else Step 1 would have elicited was not obtained, and the report says so rather than assuming**
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — ⚠️ *Added 2026-08-22:* a live consequence — the spawned producer that opened Sprint 6 had no owner channel, so it could not rank the board and recorded the accepted order as prose instead
