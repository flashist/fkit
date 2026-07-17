# ADR-018: The `PreToolUse` skill-ownership hook replaces the `CONSULT_SKILLS` exception list

**Date**: 2026-07-16
**Status**: accepted

**Reopens**: [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] Decisions 3 and 4, together, per that ADR's own pre-registered re-raise trigger.
**Supersedes (in part)**: ADR-012 Decision 3 (the `CONSULT_SKILLS` list — **retired**) and the "advisory in a consult" half of Decision 2 (**superseded once the hook lands and is verified**).

## Context
ADR-012 established — empirically — that the fkit skill lockdown is **session-scoped**: a spawned consult inherits the *launching* session's `skillOverrides`, not its own role's. It patched the one known instance (producer → architect, `fkit-survey-project`) with a hand-maintained always-on list, `CONSULT_SKILLS`, and **priced rather than fixed** the bug class — deferring the real fix (a `PreToolUse` gate on the `Skill` tool) behind one open question: *does the hook payload even expose the calling subagent's identity?* It pre-registered its own re-raise condition verbatim.

**Both conditions are now met:**
- **A second live instance of the exact bug class**, found 2026-07-16: a coder session spawning `@fkit-reviewer` for a stateful review failed with `Skill fkit-stateful-review is disabled … in skillOverrides settings`. `skillOverrides` is one flat setting for the whole CLI process, applied identically at every spawn depth. Coder → reviewer is not on `CONSULT_SKILLS`; it would keep recurring for any role pair not hand-added — a **bug class**, not a one-off.
- **The open question is answered.** Verified against the running Claude Code binary (not docs): the `PreToolUse` payload **does** expose the real, live caller (`agent_type`/`agent_id`) at any spawn depth.

## Decision
**Adopt the "hook-flip":**
- **Drop the `skillOverrides` "off" list** that `build_settings()` writes; leave every `fkit-*` skill technically enabled everywhere.
- **Add a `PreToolUse` hook on the `Skill` tool** that **denies** a call whenever the invoking agent's role (parsed from `agent_type`, e.g. `fkit-reviewer` → `reviewer`, at any depth) does not own that skill per `skills_for_role()` in `claude/fkit-claude.sh` — the existing single source of truth, read directly, never duplicated.
- **Retire `CONSULT_SKILLS` entirely.** Enforcement follows the real caller, so no hand-maintained carve-out is needed; the `fkit-survey-project`-reachable-everywhere leak closes as a side effect.
- **Fail-closed is a hard requirement, not hardening.** Claude Code's hook exit-code semantics **fail open** by default. Any internal hook error — payload parse failure, unmappable role, exception, unexpected shape — MUST resolve to an **explicit deny**, in every path. A hook that silently fails open is *worse* than the leak it replaces.

**Net effect:** ADR-010's *"enforced structurally, not by instruction"* claim — which ADR-012 conceded held only for a plain top-level session — now **extends to a spawned consult at any depth**, once the hook is verified. The "structural in a session, advisory in a consult" split is no longer a permanent architectural fact; it holds only until the hook ships.

## Consequences
- **Positive:** role separation on the consult path becomes structural; the exception list stops growing by one entry per newly-found bug instance; `skills_for_role()` stays the sole source of truth, now enforced at the point of invocation.
- **Menu visibility regresses, accepted:** the off-list also hid non-owned skills from the `/` menu; retiring it makes them **visible** (a coder session lists `/fkit-review`) though **invoking is still denied**. A discoverability nuisance, strictly smaller than the leak it replaces. Re-raise only if the menu ever leaks more than a skill's existence.
- **Non-fkit subagents lose ALL fkit skills — including `fkit-query`/`fkit-team` — accepted (owner, fail-closed).** A `general-purpose`/`Explore`/`codex:rescue` subagent carries no `fkit-` identity, so the hook denies every `fkit-*` skill. A real regression against the retired off-list (where `fkit-query` was never off for anyone). The fkit role that spawned it should run the query itself or delegate to `fkit-wiki`. Re-raise only if a real workflow needs it and cannot restructure — the narrow fix is an explicit universal-skill allowance for identity-bearing non-fkit `agent_type`s, **never** a return to a blanket list.
- **`disableAllHooks` is a single point of failure** — one settings key turns off every hook process-wide. Because the lockdown is now entirely hook-based, that key defeats the whole gate. Accepted: it requires the operator's *own* settings, the same actor the hook already serves — not a hostile third party. Re-raise only if it becomes reachable by someone other than the operator.
- ADR-010 and ADR-012 now carry "advisory in a consult" language accurate as *history* but not *current truth* — readers follow this ADR's pointer. Neither file is edited or renumbered.
- **Re-raise only if:** the hook ships with a fail-open path (a defect against *this* ADR, not a reopen); a future Claude Code release removes `agent_type`/`agent_id` from the payload (reopen — the precondition is gone); or the menu-visibility cost is shown to leak more than a skill's existence.

## Related
- [[tasks/design-task-ship-loop-skill]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — the ADR this reopens and supersedes in part
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the structural-enforcement claim this extends to the consult path
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]] — the originally-deferred path-level hooks this gate is a sibling of
- [[systems/role-locked-sessions]]
- [[systems/fkit]]
- [[systems/review-and-model-diversity]]
- [[tasks/record-pretooluse-skill-gate-adr-amendment]] — the task that recorded this ADR
- [[tasks/implement-pretooluse-skill-ownership-hook]] — the implementation this unblocked
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — relies on this hook to make "only the coder can run the loop" structural
- [[tasks/sprint-2-remove-omnigent]]
