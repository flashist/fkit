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
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — relaxes tools; explicitly keeps this hook's skill lockdown
- [[tasks/relax-tool-allowlists-except-adversarial-reviewer]]
- [[tasks/implement-task-ship-loop-skill]] — a skill this hook gates
- [[tasks/rename-task-plan-skill-to-task-brief]] — a rename that had to flip atomically with this hook
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — knowingly chooses the prose-only posture §6 rejected here; its authenticated `agent_type` is the one unforgeable signal, and it cannot answer *is the work done*
- [[tasks/add-open-questions-interview-skill-for-six-roles]] · [[tasks/add-dumb-down-skill-for-six-roles]] — six-role skills registered through this gate
- [[decisions/adr-014-how-fkit-tests-itself]] — its 7×21 matrix (Decisions 3 & 5) was **retired here**; the hard-coded-oracle principle survives, relocated to the hook's own contract suite
- [[systems/testing-and-verification]] — where the per-role/per-skill matrix now lives (`test/skill-ownership-hook.test.js`)
- [[tasks/add-launcher-contract-smoke-script]] — the suite whose Group B this decision rewrote
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — the **second** hook, extending this one's wiring pattern to end-of-turn behaviour. ⚠️ **Materially larger blast radius**: this hook denies one tool call, that one can stop a turn completing
- [[tasks/build-adr-030-stop-hook]] — task 0127: the ADR-030 build reused this hook's `PreToolUse` mechanism a second time — an `AskUserQuestion` **marker** hook — after a transcript scan was proved a fail-open violation
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64, which had to change this hook's **data source** (`skills-for-role.sh`) to make ADR-025 workable; the hook script itself is unchanged
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — task 63: the hook gates *role*, so it could not carry the mover gate
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — task 58, which had to state plainly that **tools opened and skills did not** — this hook is the boundary that stayed
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — ADR-031: `fkit-lead` becomes the orchestrating front door — the "not a doer" stance is reversed
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — ADR-033: The task movers are producer-only again — ADR-025's "any role" grant is reversed
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — Evolve `fkit-lead` into the orchestrating conductor (reverse the non-doer stance)
- [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — Refresh architecture.md for the lead conductor + fix the stale §5.2 lock description
- [[tasks/revert-task-movers-to-producer-only]] — Revert the task movers to producer-only — ownership, mirrors, hook test, and mover prose
- [[tasks/transcript-independent-ship-loop-skip-signal]] — Give the ship-loops a transcript-independent skip signal for the ADR-030 Stop hook
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] — Wire `fkit-sprint-ship-loop` into `skills_for_role()` + the four mirrors (same commit)
- [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] — task 0120: a cosmetic banner fix that this hook is **unaffected by** — ownership keys off `skills_for_role()`, never banner text
- [[tasks/enforce-task-status-vocabulary]] — the status vocabulary whose `Done`/`Cancelled` gate this hook now enforces: producer-only, at any spawn depth
- [[systems/knowledge-base-structure]] — where that producer-only gate is documented as the current rule
- [[tasks/correct-claude-mds-stale-skills-for-role-location]] — `0151`; `CLAUDE.md` still named the pre-move home of `skills_for_role()`
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — **the skill-ownership site inventory is a declared registry**, not a remembered checklist
- [[tasks/investigate-the-skill-ownership-fact-inventory-gap]] — task `0142` — the skill-ownership site inventory, and the report that **shipped incomplete twice**
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the **content** axis; verified 2026-08-02 that this ADR decides only the **invocation** axis and says nothing about rule-content precedence
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — task `0158` — whose Process-review routing this hook **denied**, leaving two record defects in its ledger (`0200`, `0201`)
- [[tasks/append-a-dated-correction-note-to-adr-010]] — task `0143` — the same denial, and a ledger claim the artifacts cannot confirm or refute
- [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — task `0195` — the hook as `skills_for_role()`'s **second consumer**, recorded in ADR-010's §Decision 5 correction note
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200`, where **this hook performed correctly** and caught a genuine routing error three times. ⚠️ **It is also where the hook's honest limit is recorded:** it gates skill **invocation**, so a driver that spawns the wrong role and tells it to apply the method **by hand never reaches the gate** — and the denial it does raise **reaches the project record only if the denied worker chooses to disclose it**
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — ⚠️ *Added 2026-08-13:* **this hook was checked as a containment mechanism for Codex and found NOT APPLICABLE.** It is a Claude Code `PreToolUse` gate on the `Skill` tool; Codex's model-generated shell commands execute **inside the codex process** and never enter Claude Code's tool loop. **No Claude Code hook can see or deny them.** ⚠️ But ADR-042 also records the correction that widens the exit: **Codex ships its own hook system**, so a *Codex-side* `preToolUse` hook is a plausible future containment point — with **four things still unverified** before anyone relies on it
- [[tasks/build-the-producer-owned-structure-check-skill]] — `0245`: a new producer-owned skill wired into this hook's **test matrix** in the same act as `skills_for_role()` — *an unwired skill exists and the hook denies it to everyone*
- [[tasks/repair-the-three-decay-shapes-across-the-open-backlog-briefs]] — ⚠️ *Added 2026-08-22:* task `0306` — *"task 43"*, the numeral cited across several briefs, means **this ADR's hook**; today `0043` is an unrelated scaffold fix
