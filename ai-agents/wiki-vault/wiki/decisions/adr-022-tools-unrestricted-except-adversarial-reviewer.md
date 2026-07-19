# ADR-022: Tool allowlists relaxed for every role except the adversarial reviewer

**Date**: 2026-07-18
**Status**: accepted

## Context
Every fkit agent carried an explicit `tools:` allowlist — ADR-008's "structural role authority", which `architecture.md` called *"the strongest boundary in the system."* An audit (2026-07-17/18) reframed that posture with three facts:
1. **Useful capability tools (`WebSearch`, `WebFetch`, `LSP`, `NotebookEdit`, …) were excluded by accident, not decision** — never in any commit, zero recorded rationale; collateral of the moment an agent gets *any* `tools:` line (which flips "inherit all" to "only these").
2. **The `tools:` wall was never a real sandbox** — every agent holds `Bash` (the ADR-008:85 escape hatch), so "no Write/Edit" was always substantially prompt-enforced.
3. **Exactly one wall protects a genuine, checkable invariant: the adversarial reviewer's** — no Write/Edit/Agent is what makes *"the independent second opinion never touched the code it judges"* a structural fact. Every other wall is accidental or product-discipline (most notably the lead's router-not-doer guardrail) — philosophy, not safety.

**Amends (does not supersede) ADR-008 and ADR-010** — the tool-allowlist half of the role lock only. The skill lockdown is untouched.

## Decision
1. **The six Claude-side roles — producer, coder, architect, reviewer, wiki, lead — get unrestricted tools**, recommended mechanism: omit the `tools:` line entirely (inherit everything, nothing to rot). Subsumes the ADR-021/task-54 `AskUserQuestion` grant (retained by inheritance). Knowingly drops the lead's scoped `Agent(...)` list — the one structurally-enforced point of the consult topology, now prompt-enforced like everywhere else — and the lead's/wiki's authority exclusions.
2. **The adversarial reviewer keeps `tools: Read, Grep, Glob, Bash, Skill` byte-identical.** An agent's own `tools:` line governs it at any spawn depth, so the wall holds even when spawned by a now-unrestricted reviewer. **This is the only structural tool wall that remains, and it is deliberate** — not to be "tidied up" to match the others.
3. **The skill lockdown is unchanged** — the ADR-018 `PreToolUse` hook still role-locks `fkit-*` skills. Tools (generic capabilities) are freed; skills (named, role-owned procedures) stay locked — a deliberate posture.
4. **Prompt-level role contracts are unaffected** — relaxing tools does not relax contracts (the lead is still "not a doer", the reviewer "review-only", etc.).

## Consequences
- Working roles gain web research, LSP, notebooks, and any future built-in; less allowlist maintenance; the one wall that matters is now legible.
- **Role separation for the five now rests on prompts + the skill hook** — a real reduction in structural enforcement, accepted knowingly. The lead *can* now act as a generalist (prompt-only guardrail). Do not re-raise these as defects without a concrete harm.
- ~~Docs describe a superseded posture until the architect follow-up lands~~ **— resolved.** Sprint 2 task 58 ([[tasks/refresh-architecture-docs-for-tool-relaxation]]) is **Done**; verified 2026-07-19, the *"strongest boundary"* language is gone from `architecture.md`, `PROJECT.md` and `CLAUDE.md`, and §4.1 shows the six roles carrying no `tools:` line. *(`architecture.md` is behind again on a **different** axis — it cites no ADR past 022 — but that is outside this ADR's follow-up.)*
- Re-raise only if: an unrestricted role's tools cause a concrete problem (reopen for that role/tool, not the blanket); someone proposes touching the adversarial reviewer's line; or someone proposes relaxing the *skill* lockdown "to match" (a different decision — ADR-018's domain).

## Related
- [[tasks/relax-tool-allowlists-except-adversarial-reviewer]] — the implementation (task 57)
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — the grant this subsumes; its harness fact still holds
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]] — the original allowlist rationale amended here, and the Bash-escape-hatch caveat leaned on
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the role lock; tool half relaxed, skill half kept
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the skill hook, explicitly kept
- [[systems/role-locked-sessions]] · [[systems/review-and-model-diversity]] — the surviving wall's home
- [[tasks/investigate-askuserquestion-availability-for-agents]] — the audit that fed this decision
- [[tasks/grant-askuserquestion-tool-to-six-claude-agents]] — the explicit-grant mechanism this subsumed
- [[systems/fkit]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — unrestricted tools are why every candidate precondition artifact is agent-writable
- [[tasks/add-open-questions-interview-skill-for-six-roles]] · [[tasks/add-dumb-down-skill-for-six-roles]] — the adversarial reviewer excluded from both, on this ADR's restricted-allowlist fact
- [[tasks/restructure-coder-report-summary-then-interview]] — the coder holds `AskUserQuestion` in a session by inheritance
- [[decisions/adr-023-fkit-git-agent-is-not-built]] — declined a *git* eighth role; **its "the team stays seven" is no longer current**
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — ⚠️ **in direct tension with this ADR.** The tester's whole justification is a **deliberately unhardened, network- and write-enabled envelope**, while this ADR's one surviving structural wall exists precisely because unrestricted tools were judged unacceptable for a role. ADR-028 records the tension against itself rather than resolving it
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — task 58, this ADR's architect-owned doc follow-up (**Done**)
