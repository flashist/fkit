# Investigate making `AskUserQuestion` available to fkit agents

**Source**: `ai-agents/tasks/done/investigate-askuserquestion-availability-for-agents.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 39

## Goal
The owner asked to *"make the `AskUserQuestion` skill available for all agents."* First correction, load-bearing: it is a Claude Code **tool** (gated by `tools:` frontmatter), not a skill — and it appeared in **none** of the seven agents' allowlists. Deliberately scoped as an **investigation, not the grant** (the task-20/29 pattern): the session-vs-consult behavior was unmeasured (with the expensive `--append-system-prompt` precedent — looked inheritable, was 0/3 then 0/2), "all agents" may be structurally false for the Codex-run adversarial reviewer, and granting it collides with the **designed** consult contract ("return open questions in your reply rather than asking") — a consult-model change that is the owner's, not a tool toggle.

## Key Changes
Findings (`knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md`, Claude Code **2.1.212** pinned):
- **Consult: `TOOL_ABSENT`, 3/3** — even under `tools: *`, with control + anti-fabrication guard. Failure mode is **absence, not the feared hang** — the safest mode; a granted consult no-ops rather than blocks.
- **Session: works, 1/1.**
- So a consult **cannot** ask the owner regardless of any grant — the "return open questions" contract is now *load-bearing*, not decorative. The grant question de-risks to session-only ergonomics.
- Codex path: structurally impossible — "all agents" cannot include the second model.

## Outcome
**Done.** Spawned [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] (the tombstone recording the measured constraint + the owner-approved grant decision) and the separate implementation brief [[tasks/grant-askuserquestion-tool-to-six-claude-agents]] (task 54). The audit's discovery that capability tools were excluded by accident also fed [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]].

## Related
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the decision this investigation produced
- [[tasks/grant-askuserquestion-tool-to-six-claude-agents]] — the grant it gated
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — the wider tool-posture ruling its audit fed
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the same-seam precedent (`--append-system-prompt` session-only)
- [[systems/role-locked-sessions]]
- [[tasks/sprint-2-remove-omnigent]]
