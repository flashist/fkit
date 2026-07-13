# Role-Locked Sessions & the Skill Lockdown

**Layer**: shared
**Key files**: `claude/fkit-claude.sh` (`skills_for_role()`, `build_settings()`, `CONSULT_SKILLS`), `claude/agents/fkit-*.md`, `.fkit/settings/<role>.json`

## Summary
Every fkit session is pinned to exactly one role. `fkit <role>` launches `claude --agent fkit-<role>` with generated `--settings`, so the session gets that role's system prompt, its **tool allowlist**, and **only its own `/fkit-*` skills** — every other fkit skill is turned off, invisible and unrunnable.

This is what makes *"the coder cannot run the reviewer's procedure"* a **fact rather than a request**. It replaced an earlier model where a single lead session "wore hats" — which was prompt-enforced, and therefore exactly as strong as the model's willingness to comply.

## Architecture

A session is locked **two ways**:

1. **`--agent fkit-<role>`** — the role's system prompt **and tool allowlist**. Harness-enforced.
2. **`--settings` carrying `skillOverrides`** — `build_settings()` writes `{"skillOverrides":{"<not-owned>":"off",…}}` to `.fkit/settings/<role>.json`. Every `fkit-*` skill the role does not own is hidden from the `/` menu **and unrunnable by name**. Non-fkit skills (the project's own, the user's own) are never touched.

### The scope of the lock is the load-bearing detail

```
skill availability in ANY context (session OR spawned consult)
  = all installed skills − the skillOverrides of the SESSION THAT LAUNCHED THE PROCESS
```

- **In a role SESSION the lock is structural.** `fkit coder` genuinely cannot run `/fkit-review`. **This is the property reviewer independence rests on, and it holds.**
- **In a spawned CONSULT it is advisory.** A subagent inherits the *caller's* overrides, **not its own** — confirmed empirically from live spawns. Only the agent's system prompt and the skill's `⛔ Owner:` banner stand between a confused subagent and someone else's procedure. **The banner is therefore load-bearing, not decorative — it may not be deleted as "redundant."**

> ⚠️ **Do not restate this as a blanket defect.** *"The skill lock is only prompt-enforced"* is **false of a session** and **true of a consult**. A finding must say **which path** it means.

### `CONSULT_SKILLS` — the escape valve that inheritance forces
`fkit-survey-project` and `fkit-query` stay **on for every role**, because `/fkit-initiate-project` has the **producer** spawn the architect to run the survey — with it off, initiation could not run its own architecture survey. The accepted cost: any role session can invoke `/fkit-survey-project` by name. **The set is deliberately minimal; adding to it is a decision, not a convenience.**

### Consultation — the Agent tool, two hops, no cycles
Cross-role work is a **consult**, never a role switch. `@fkit-<role> <question>` spawns a fresh context that answers and returns; the asker keeps the decision that is theirs. The rules are carried in every agent prompt:

- an invocation from the owner's session is **hop 0**; every consult message states *"you are being consulted at hop N of 2"*;
- **at hop 2 you may not consult anyone** — answer from the code, or return an open question;
- **never consult your invoker**, or anyone already named in the chain (the chain is passed along);
- **genuinely new architecture decisions escalate to the owner** — never settled implicitly between agents.

**This topology is prompt-enforced, knowingly**: Claude Code ignores `Agent(type)` allowlists inside *subagent* definitions, so the hop budget cannot be made structural. It *is* structural in one place — `fkit-lead`'s own `Agent(...)` list.

## Gotchas / Known Issues
- **There is no `skills:` frontmatter.** It was dropped from all 7 agents: Claude Code treats it as a *preload hint*, not an allowlist, so it enforced nothing. Keeping it — even generated — would have preserved a field that *looks* like the invariant and isn't. **Do not re-add it.**
- **Ownership has exactly one source of truth**: `skills_for_role()` in `claude/fkit-claude.sh`. Two sources of truth for the flavor's central invariant is one too many.
- **The only mechanism that could make per-role skill ownership real on the consult path is a `PreToolUse` gate on the `Skill` tool** — deferred, and now priced.
- **Open question that decides whether this is even fixable:** does the `PreToolUse` hook payload expose the **calling subagent's identity**? If it does not, the hook cannot discriminate by role and the option is not merely deferred but **unavailable**. This must be established before anyone plans the hook as the fix.
- `fkit --resume` bypasses the intended lock — see [[systems/fkit]].

## Related
- [[systems/fkit]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]]
- [[systems/review-and-model-diversity]]
- [[tasks/reconcile-skill-ownership-source-of-truth]]
- [[tasks/verify-onboarding-flow-end-to-end]]
- [[systems/install-and-self-update]]
- [[tasks/document-consult-chain-envelope]]
- [[tasks/restore-plan-mode-in-plan-task]]
- [[tasks/sprint-2-remove-omnigent]]
