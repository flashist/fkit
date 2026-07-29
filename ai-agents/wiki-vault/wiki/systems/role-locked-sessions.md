# Role-Locked Sessions & the Skill Lockdown

**Layer**: shared
**Key files**: `claude/skills-for-role.sh` (`skills_for_role()` — the single source of truth), `claude/fkit-claude.sh` (`build_settings()`), `claude/skill-ownership-hook.sh` (the `PreToolUse` skill-ownership gate), `claude/agents/fkit-*.md`, `.fkit/settings/<role>.json`

## Summary
Every fkit session is pinned to exactly one role. `fkit <role>` launches `claude --agent fkit-<role>` with generated `--settings`, so the session gets that role's system prompt and **only its own `/fkit-*` skills** — every other fkit skill is denied. *(Until 2026-07-18 the lock also carried a per-role **tool allowlist**; ADR-022 relaxed that half — see below.)*

This is what makes *"the coder cannot run the reviewer's procedure"* a **fact rather than a request**. It replaced an earlier model where a single lead session "wore hats" — which was prompt-enforced, and therefore exactly as strong as the model's willingness to comply.

## Architecture

A session is locked **two ways**:

1. **`--agent fkit-<role>`** — the role's system prompt (and, for the adversarial reviewer only, a tool allowlist). Harness-enforced.
2. **`--settings` wiring the hooks** — `build_settings()` writes a `hooks` block to `.fkit/settings/<role>.json` pointing at `claude/skill-ownership-hook.sh` (`PreToolUse` on the `Skill` tool). Every `fkit-*` skill the role does not own is **denied on invocation**, at any spawn depth. Non-fkit skills (the project's own, the user's own) are never touched. *(This **replaced** the older `skillOverrides` off-list — see the two eras below. The settings file now also wires the ADR-030 hooks: `turn-completion-hook.sh` (`Stop`), `askuserquestion-marker-hook.sh` (`PreToolUse`) and `shiploop-marker-hook.sh` (`UserPromptExpansion`) — **four hook scripts in total**, verified against the tree 2026-07-26.)*

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

**This topology is prompt-enforced, knowingly**: Claude Code ignores `Agent(type)` allowlists inside *subagent* definitions, so the hop budget cannot be made structural. *(It used to be structural in one place — `fkit-lead`'s own `Agent(...)` list — until ADR-022 removed the lead's `tools:` line; the topology is now prompt-enforced everywhere, taken knowingly.)*

### The tool half of the lock — relaxed (2026-07-18)

**[[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]** (implemented by [[tasks/relax-tool-allowlists-except-adversarial-reviewer]]) relaxed the **tool-allowlist** half of the role lock: the six Claude-side agents carry **no `tools:` line** and inherit every Claude Code tool. Rationale: the capability tools were excluded by accident; the wall was never a real sandbox (every agent holds `Bash`); and only one wall protects a checkable invariant. **The adversarial reviewer keeps `tools: Read, Grep, Glob, Bash, Skill` byte-identical** — an agent's own `tools:` line governs it at any spawn depth, so its independence survives even when spawned by an unrestricted reviewer. **The skill lockdown (the ADR-018 hook) is deliberately untouched** — capabilities are free, procedures stay role-locked. Related: [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — `AskUserQuestion` works in a session but is `TOOL_ABSENT` in any spawned consult regardless of the grant (measured, Claude Code 2.1.212), so the consult "return open questions" contract is the only option a consult has.

### The lock and the conductor — an orchestrating role, not a broken lock (2026-07-22)

**[[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] reversed [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] §Decision 3**: `fkit-lead` grew from a router into a **conductor** that spawns and drives typed peers. **The lock is what made this feasible, not what it broke.**

- **ADR-018's real-caller enforcement is the enabling fact.** Because the hook keys on the *spawned* subagent's own `agent_type`, a worker spawned as `@fkit-coder` **may run coder-owned skills**. Under Era 1's inheritance model it would have inherited the *lead's* off-list and been unable to run its own procedures at all.
- **The corollary is binding, and it is a real constraint on the conductor.** A **non-fkit** subagent carries no fkit identity and is denied **every** `fkit-*` skill — so the conductor must spawn **typed `fkit-<role>` workers, never generic helpers**, for any step that runs an fkit procedure.
- **ADR-010's other decisions still hold.** Sessions stay role-locked; the conductor **spawns consults**, it does not role-switch; `skills_for_role()` stays the single source of truth. Reviewer independence survives because each role's work runs in **its own fresh spawned context** — orchestration *sequences* separate contexts rather than merging them.
- **The one accepted cost is the plan gate.** Plan mode is a *session* write-wall and cannot function in a spawned worker, so on the orchestrated path *"write no source until the owner approves"* is **prose in the worker prompt, not a runtime wall** (ADR-031's honesty clause). Owners who want the structural wall ship the task the old way: `fkit coder` + `/fkit-task-ship-loop`. **Do not re-raise this as a defect** — it is stated knowingly; a finding must show it *failing in practice*.

Lead's one owned skill, `fkit-sprint-ship-loop`, was registered through `skills_for_role()` like any other ([[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]]) — the hook then allows lead and denies every other role.

### The task movers — reversed, then reversed back (2026-07-18 → 2026-07-23)

> ⚠️ **This section previously read "what the lock does NOT cover." That is no longer true — the lock covers it.**

**[[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] removed the owner-only gate** and [[tasks/implement-spawned-invocation-for-task-movers]] shipped it: any spawned agent could move task files, including the coder closing its own task. **[[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] reversed that on 2026-07-23** — `/fkit-task-done` and `/fkit-task-cancelled` are **`fkit-producer`-only**, and the ADR-018 hook now **denies** a mover call from any non-producer identity **at any spawn depth**.

**So the movers are now governed by exactly the mechanism this page describes**, and *"a role cannot close its own task under its own identity"* is a **fact of the runtime**, not prose. Landed by [[tasks/route-coder-ship-loop-close-to-producer]] → [[tasks/route-sprint-ship-loop-close-to-producer]] → [[tasks/revert-task-movers-to-producer-only]]; verified against the tree 2026-07-26.

⚠️ **What it does *not* do — read this before treating the board as trustworthy.** It restores separation of the closing **identity**, **not prevention**: a determined doer can still spawn a producer to close. The ADR-025 analysis below is **why**, and ADR-033 re-uses it rather than re-deriving it. The `(agent-closed — not owner-verified)` marker still carries the only signal, and it is still invisible in `/fkit-status`.

**The historical record of ADR-025's era, kept because ADR-033 depends on its reasoning:**

**The change landed in `skills_for_role()` itself** — the single source of truth this page describes. **As of 2026-07-19** `claude/skills-for-role.sh` listed both movers under `lead`, `producer`, `coder`, `architect`, `reviewer` and `wiki`, with `adversarial-reviewer` the one role without them — deliberately (findings-only contract, never edits, restricted Codex allowlist per [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]). ⚠️ **That listing no longer exists.** ADR-033 reverted it on 2026-07-23: `claude/skills-for-role.sh:27` now states the movers *"belong to `producer` and to NO other role"*, and line 51 is the **only** branch granting either one — so today `lead`, `coder`, `architect`, `reviewer` and `wiki` are denied alongside the adversarial reviewer. `test/skill-ownership-hook.test.js` pins **both** directions: allow-for-producer at `:224` and deny-for-each-of-the-five at `:233-239`, with the adversarial reviewer's own deny at `:241`. *(Verified against the tree 2026-07-29.)* ⚠️ **This is worth understanding precisely: the lock did not fail here, it was reconfigured.** The mandatory adversarial pass found ADR-025 unbuildable as written — its Decision 5 forbade touching the hook, but the hook's data source still said `producer` only, so **every non-producer mover call would have been denied before the relaxed prose was read.** The owner ruled to change the mapping. `skill-ownership-hook.sh` itself is unchanged.

Two facts about how this interacts with the lock:

- **The skill gate does not compensate.** The `PreToolUse` hook gates the `Skill` tool by the authenticated caller — it answers *"who is calling"*, never *"is this work complete"*. It will happily allow a mover call from a role that owns the skill.
- **A spawned producer is not a second judgment.** It has **no owner channel** — the `⛔ Owner:` banner is advisory (ADR-012) and `AskUserQuestion` is absent (ADR-021). So *"the coder spawns the producer and asks it to mark done"* is functionally *"the coder marks its own work done, with an extra hop in between."* The spawned role adds a **name**, not a judgment.

The ADR's own honesty clause is the thing to read: **prevention is gone, and the replacement — an `(agent-closed — not owner-verified)` marker — is prose written by the same agent that performs the move, with no code path able to enforce it.** Git does not backstop it either: agents cannot commit, so the commit landing an agent-closed move is authored by the **owner**, and history carries no authenticated trace.

**ADR-025 was the one place where a universal hard rule was reversed rather than reaffirmed** — contrast [[decisions/adr-023-fkit-git-agent-is-not-built]], which kept commit/push owner-only the same week; the owner's stated distinction was **blast radius**. **Five days later the owner reversed the reversal**, on evidence from the wiki's side: a finished wiki task sat unclosed on the board for about a week because the wiki never used the authority it had ([[tasks/investigate-making-wiki-task-completion-visible-to-the-board]]). Offered three readings, the owner chose the **strictest** — producer-only — knowing it would unwind the coder ship-loop's self-close and the orchestrator's direct close. **The commit/push ruling has never moved.**

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
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- [[tasks/relax-tool-allowlists-except-adversarial-reviewer]]
- [[tasks/investigate-askuserquestion-availability-for-agents]]
- [[tasks/rename-task-plan-skill-to-task-brief]]
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
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the owner-only mover gate removed; ⚠️ **Decisions 1–2 since reversed**
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64: the mover grant written into `skills_for_role()`, with the adversarial reviewer excluded
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — ⚠️ **the movers are producer-only again, and hook-enforced**; the current rule
- [[tasks/revert-task-movers-to-producer-only]] · [[tasks/route-coder-ship-loop-close-to-producer]] · [[tasks/route-sprint-ship-loop-close-to-producer]] — the landing sequence
- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — the evidence that triggered the reversal
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — lead becomes a conductor; the lock is the **enabling fact**, and the plan-gate downgrade is its accepted cost
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the lead-owned sprint loop
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] · [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] · [[tasks/build-fkit-sprint-ship-loop-skill]] · [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] — the conductor chain
- [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — the task that corrected `architecture.md`'s **stale `skillOverrides` description**, the same Era-1/Era-2 confusion this page warns about
- [[tasks/transcript-independent-ship-loop-skip-signal]] · [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] — the hook layer's third and fourth scripts
- [[tasks/add-adr-030-prose-half-to-universal-rules]] — the prose half of the turn-completion contract
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the loop whose terminal act the mover reversal changed
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — a **second** hook (`Stop`) decided 2026-07-19, extending this hook layer to end-of-turn behaviour. **Built 2026-07-23** (task 0127) — and it added **two** members to the layer: the `Stop` hook plus a `PreToolUse` `AskUserQuestion` **marker** hook that supplies check A's signal. Its consult skip is safety-critical because `AskUserQuestion` is absent in spawned consults — as built the skip is **structural** (`Stop`-only, never `SubagentStop`)
- [[tasks/build-adr-030-stop-hook]] — task 0127: the ADR-030 hooks built (the `Stop` + `PreToolUse` marker pair) and reviewed model-diverse; check A moved off the transcript onto the marker
- [[decisions/adr-023-fkit-git-agent-is-not-built]] — the same week's opposite ruling for commit/push
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — the owner gates left waiting rather than timed
- [[tasks/add-open-questions-interview-skill-for-six-roles]] · [[tasks/add-dumb-down-skill-for-six-roles]] — the two six-role skills registered through `skills_for_role()` and the hook
- [[tasks/wiki-sync-post-omnigent]]
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — task 63, the design behind *what the lock does NOT cover*
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — task 58: the doc refresh that corrected the superseded "tool allowlist is the strongest boundary" claim
- [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] — task 0120, the sprint-loop SKILL's owner-banner H1 fix (cosmetic; the advisory-banner half of the lock, not the structural half)
