# Restore Claude Code plan mode in `/fkit-plan-task`

**Source**: `ai-agents/tasks/done/0081-restore-plan-mode-in-plan-task/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 17 (regression — independent; added out of band 2026-07-11)

## Goal
Make the coder's planning gate a **wall** again, not a promise.

## Key Changes
**`/fkit-plan-task` no longer entered Claude Code's plan mode. It used to. The Claude-native port silently dropped it.**

The gate had become **prose only**: the skill said *"Declare planning-only"* while the coder kept `Write`/`Edit` throughout the run. So *"no code will be written during planning"* was **a promise the agent keeps, not a wall the runtime enforces.**

**A regression, not a missing feature** — traced by fkit-coder: pre-Omnigent it worked and was **tool-enforced** (`EnterPlanMode` / `ExitPlanMode`). The Claude-native port copied the **Omnigent-era prose-only planning contract** — *a workaround for a harness that lacked the tools* — back into the Claude flavor, **which has them**.

**Both halves had to be fixed or neither works:** the skill *and* `claude/agents/fkit-coder.md`'s tool allowlist, which omitted `EnterPlanMode` / `ExitPlanMode`.

## Outcome
Done. The coder's allowlist now carries the plan-mode tools and the skill uses them, restoring an **owner approval gate** that the harness enforces.

**It was numbered 17 to avoid renumbering the owner's ranking, not because it is low** — it had no dependency on tasks 1–16 and was **recommended as the first thing picked up**, because *it repairs the planning gate that the rest of the sprint, including the high-risk `install.sh` rewrite, would be planned through.*

**Owner decisions already closed on it** (recorded in the brief, **not to be reopened**): no session-wide plan default, **no hooks** (ADR-010's deferral stands), **no ADR**, and the model-initiated nature of the gate is an **accepted residual**.

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[systems/role-locked-sessions]]
- [[systems/fkit]]
