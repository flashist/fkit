# Grant the `AskUserQuestion` tool to the six Claude-side agents

**Source**: `ai-agents/tasks/done/0049-grant-askuserquestion-tool-to-six-claude-agents/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 54

## Goal
Implement ADR-021 Decision 4: add the built-in `AskUserQuestion` **tool** to the `tools:` frontmatter of the six Claude-side agents — producer, coder, architect, reviewer, wiki, lead — and **not** the adversarial reviewer (Codex-run, findings-only leaf; its file byte-untouched). A low-stakes ergonomic grant, not an architecture change: the tool is measured **session-only** on Claude Code 2.1.212, so the consult "return open questions" contract is untouched.

## Key Changes
- `AskUserQuestion` added to six `claude/agents/fkit-*.md` `tools:` lines, plus a one-line note each: *"In a session you may use `AskUserQuestion` for a structured choice; in a spawned consult the tool is absent — return open questions as before."* Nothing deleted.
- **A tool grant, not a skill** — no `skills-for-role.sh` change, no `fkit-team`/README mirror-table change (those track skills).

## Outcome
**Done** — then its **mechanism was superseded by task 57** ([[tasks/relax-tool-allowlists-except-adversarial-reviewer]], per [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]): the six agents' `tools:` lines were removed entirely, so the capability now arrives **by inheritance** instead of an explicit entry. The grant survives; only its expression changed. The prose session/consult notes stay (contract text, not a tool grant). Task 54 is not undone.

## Related
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the decision implemented
- [[tasks/investigate-askuserquestion-availability-for-agents]] — the investigation (task 39) that gated it
- [[tasks/relax-tool-allowlists-except-adversarial-reviewer]] — task 57, which superseded the mechanism while preserving the capability
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/restructure-coder-report-summary-then-interview]] — the coder's interview, built on this capability (now held by inheritance)
