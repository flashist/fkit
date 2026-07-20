# Review & Model Diversity

**Layer**: shared
**Key files**: `claude/skills/fkit-review/SKILL.md`, `claude/skills/fkit-stateful-review/SKILL.md`, `claude/skills/fkit-adversarial-review/SKILL.md`, `claude/agents/fkit-reviewer.md`, `claude/agents/fkit-adversarial-reviewer.md`, `ai-agents/reviews/<task-id>.md`

## Summary
fkit's review is deliberately **two-model**. The lead reviewer (`fkit-reviewer`, Claude) runs its own pass, then delegates an adversarial second opinion to `fkit-adversarial-reviewer`, which runs on **Codex — a different model**.

The failure this exists to prevent is a same-model "second opinion": the model that wrote the code reviewing its own work, and the **unearned confidence** that produces. A review that *reads* complete but isn't is worse than no review — so degradation is **loud and mandatory**, never a footnote.

## Architecture

### The adversarial pass
The reviewer assembles a **findings-only prompt plus an inline diff** into `.fkit/tmp/adversarial-prompt.md` and pipes it to:

```
codex exec --sandbox read-only --cd "$PWD" -
```

`fkit-adversarial-reviewer` has **no Write or Edit tools at all** — it is structurally write-free, a leaf that returns findings and nothing else. That is enforced by its tool allowlist, not by instruction — and since [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] (2026-07-18) it is **the only structural tool wall left in fkit**: every other role's allowlist was relaxed, deliberately, because this is the one wall protecting a checkable invariant (the second opinion never had write authority over the code it judges). Its `tools:` line holds at any spawn depth and is not to be "tidied up" to match the others.

### Degradation is loud
With no Codex available, the review **leads with**:

```
⚠️ [NOT model-diverse — INCOMPLETE]
```

as **the first thing a reader sees**. Per the owner's Sprint 2 ruling, Codex's absence produces a **loudly-flagged partial, not a hard fail** — a Codex outage must not lock the owner out of their own team. The preflight **warns; it does not wall**. But the flag is load-bearing: *a partial review that reads like a complete one is precisely the failure this guards against.*

The older `[claude-fallback — NOT model-diverse]` path is no longer a supported mode.

### Reviewer independence rests on the session lock
The reviewer's independence is a property of a **fresh context**, not of a prompt. `fkit reviewer` *is* a fresh context, and a coder session **cannot execute `/fkit-review`** because the skill does not exist in it — see [[systems/role-locked-sessions]].

> **Deviation, flagged:** the lead reviewer *keeps* Write/Edit, because it must write the *Reviewer findings* section of the shared ledger. Its "documents under `ai-agents/reviews/` only" boundary stays **prompt-enforced**.

### The review ledger — loop prevention
`ai-agents/reviews/<task-id>.md` is a **two-party ledger** written by reviewer **and** coder: findings, dispositions, and **accepted residuals**. It carries decision state across review rounds so settled tradeoffs are **not re-litigated**. It is the memory that stops the review loop from cycling.

### Review notes are inputs, not instructions
A project-wide rule: review comments are **inputs to evaluate**, not instructions to apply blindly. Reviewers miss context and reason from outdated assumptions. The coder verifies each claim against the actual codebase — fixing the *real* problem rather than the literal wording, addressing the valid part of a partially-correct note, and **saying so with concrete evidence** when a note is simply wrong. Speculative fixes added only to satisfy a comment are not acceptable.

The coder's `/fkit-process-stateful-review` encodes this: verify each finding, classify **defect vs frontier-move**, and gate fixes on the owner.

## Gotchas / Known Issues
- **Codex is a required dependency, not a nice-to-have.** It is what makes the second opinion genuinely model-diverse — the adversarial reviewer's entire reason to exist.
- **`AGENTS.md` is read natively by Codex during the adversarial pass.** While it was stale, *every adversarial review was being run by a model that had been told the wrong thing about the project.* That made it the highest-leverage doc in the repo to fix and it is a standing reason to keep it accurate.
- The adversarial reviewer was formerly eager-spawned at session start under Omnigent's `fkit-team`, which cluttered the agents panel; that root agent is deleted — see [[tasks/remove-adversarial-reviewer-eager-spawn]].

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[systems/fkit]]
- [[systems/role-locked-sessions]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]]
- [[tasks/make-codex-a-checked-prerequisite]]
- [[tasks/remove-adversarial-reviewer-eager-spawn]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[tasks/rewrite-docs-post-omnigent]]
- [[tasks/verify-onboarding-flow-end-to-end]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[tasks/give-codex-the-universal-hard-rules]]
- [[tasks/wiki-sync-post-omnigent]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- [[tasks/relax-tool-allowlists-except-adversarial-reviewer]]
- [[tasks/design-task-ship-loop-skill]]
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the eighth role decided 2026-07-19; **decided, not built**
- [[tasks/design-task-folder-structure-and-id-scheme]] — the adversarial pass on task 74 produced **18 findings** and forced revision 2's three substantive changes
