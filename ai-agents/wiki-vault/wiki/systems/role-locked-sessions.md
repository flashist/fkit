# Role-Locked Sessions & the Skill Lockdown

**Layer**: shared
**Key files**: `claude/skills-for-role.sh` (`skills_for_role()` — the single source of truth), `claude/fkit-claude.sh` (`build_settings()`), `claude/skill-ownership-hook.sh` (the `PreToolUse` skill-ownership gate), `claude/agents/fkit-*.md`, `.fkit/settings/<role>.json`

## Summary
Every fkit session is pinned to exactly one role. `fkit <role>` launches `claude --agent fkit-<role>` with generated `--settings`, so the session gets that role's system prompt, its **tool allowlist**, and **only its own `/fkit-*` skills** — every other fkit skill is turned off, invisible and unrunnable.

This is what makes *"the coder cannot run the reviewer's procedure"* a **fact rather than a request**. It replaced an earlier model where a single lead session "wore hats" — which was prompt-enforced, and therefore exactly as strong as the model's willingness to comply.

## Architecture

A session is locked **two ways**:

1. **`--agent fkit-<role>`** — the role's system prompt **and tool allowlist**. Harness-enforced.
2. **`--settings` carrying `skillOverrides`** — `build_settings()` writes `{"skillOverrides":{"<not-owned>":"off",…}}` to `.fkit/settings/<role>.json`. Every `fkit-*` skill the role does not own is hidden from the `/` menu **and unrunnable by name**. Non-fkit skills (the project's own, the user's own) are never touched.

### The scope of the lock — now structural at any depth (2026-07-16)

**There have been two eras.** The distinction matters because two ADRs and much of the older wiki describe the first.

**Era 1 — `skillOverrides`, session-scoped ([[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]).** The lock was a `skillOverrides` off-list carried by the *launching* session and inherited by every subagent:

```
skill availability = all installed skills − the skillOverrides of the SESSION THAT LAUNCHED THE PROCESS
```

So the lock was **structural in a role session** but **advisory in a spawned consult** — a subagent inherited the *caller's* overrides, not its own, and only the skill's `⛔ Owner:` banner stopped a confused consult from running someone else's procedure. `CONSULT_SKILLS` was a hand-maintained always-on list papering over the gap for the one known case (producer → architect → `fkit-survey-project`).

**Era 2 — the `PreToolUse` hook, structural at any depth ([[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]], implemented [[tasks/implement-pretooluse-skill-ownership-hook]]).** The `skillOverrides` off-list and `CONSULT_SKILLS` are **retired**. A `PreToolUse` hook on the `Skill` tool now reads the **real invoking agent's identity** (`agent_type`) from the hook payload — at any spawn depth — and **denies** any skill the caller's role doesn't own per `skills_for_role()`. Enforcement follows the actual caller, top-level session or a consult nested any number of hops.

- **The lock is now structural everywhere it was meant to be.** `fkit coder` cannot run `/fkit-review` in a session, **and a spawned consult cannot run a skill its real role doesn't own either.** The `⛔ Owner:` banner is now a **belt-and-braces backstop, not the sole enforcement** on the consult path.
- **Fail-closed is a hard requirement:** Claude Code hooks fail *open* by default, so any internal hook error must resolve to an explicit deny.
- **Accepted costs (ADR-018):** non-owned skills are now **visible** in the `/` menu though **denied on invocation**; and a **non-fkit subagent** (`general-purpose`, `codex:rescue`, …) carries no `fkit-` identity and is therefore denied **every** `fkit-*` skill, `fkit-query`/`fkit-team` included — the fkit role that spawned it must run the query itself.

> ⚠️ **Older ADR-010/012 language — "advisory in a consult" — is now history, not current truth.** Do **not** re-raise "role separation is only prompt-enforced in a consult" as a defect; that is what ADR-018 closed. A finding must point to a *specific* hook failure (a role reaching a skill it doesn't own, or a fail-open path).

### Consultation — the Agent tool, two hops, no cycles
Cross-role work is a **consult**, never a role switch. `@fkit-<role> <question>` spawns a fresh context that answers and returns; the asker keeps the decision that is theirs. The rules are carried in every agent prompt:

- an invocation from the owner's session is **hop 0**; every consult message states *"you are being consulted at hop N of 2"*;
- **at hop 2 you may not consult anyone** — answer from the code, or return an open question;
- **never consult your invoker**, or anyone already named in the chain (the chain is passed along);
- **genuinely new architecture decisions escalate to the owner** — never settled implicitly between agents.

**This topology is prompt-enforced, knowingly**: Claude Code ignores `Agent(type)` allowlists inside *subagent* definitions, so the hop budget cannot be made structural. It *is* structural in one place — `fkit-lead`'s own `Agent(...)` list.

## Gotchas / Known Issues
- **There is no `skills:` frontmatter.** It was dropped from all 7 agents: Claude Code treats it as a *preload hint*, not an allowlist, so it enforced nothing. Keeping it — even generated — would have preserved a field that *looks* like the invariant and isn't. **Do not re-add it.**
- **Ownership has exactly one source of truth**: `skills_for_role()` — extracted into `claude/skills-for-role.sh` so both the launcher and the `PreToolUse` hook read it directly (the hook must **not** source `fkit-claude.sh`, whose top-level side effects would fire). Two sources of truth for the flavor's central invariant is one too many.
- **The `PreToolUse` gate is no longer deferred — it is implemented** ([[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]). The old open question — *does the hook payload expose the calling subagent's identity?* — was **answered yes**, verified against the running Claude Code binary (`agent_type`/`agent_id`, at any depth). That is what made the hook available rather than merely priced.
- **`disableAllHooks` is a single point of failure** for the whole gate now that enforcement is entirely hook-based — accepted, because it needs the operator's own settings (the same actor the hook serves).

## Related
- [[systems/fkit]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[tasks/record-pretooluse-skill-gate-adr-amendment]]
- [[tasks/implement-pretooluse-skill-ownership-hook]]
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]]
- [[systems/review-and-model-diversity]]
- [[tasks/reconcile-skill-ownership-source-of-truth]]
- [[tasks/verify-onboarding-flow-end-to-end]]
- [[systems/install-and-self-update]]
- [[tasks/document-consult-chain-envelope]]
- [[tasks/restore-plan-mode-in-plan-task]]
- [[tasks/sprint-2-remove-omnigent]]
- [[systems/testing-and-verification]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[tasks/add-launcher-contract-smoke-script]]
- [[tasks/remove-fkit-resume-passthrough]]
- [[tasks/add-no-secrets-rule-to-fkit-lead]]
- [[tasks/add-full-board-switch-to-fkit-status]]
- [[tasks/add-shared-instructions-layer-for-all-agents]]
- [[tasks/wiki-sync-post-omnigent]]
