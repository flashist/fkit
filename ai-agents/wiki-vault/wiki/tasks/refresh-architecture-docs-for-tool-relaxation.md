# Refresh the docs for the tool-allowlist relaxation (ADR-022)

**Source**: `ai-agents/tasks/done/0068-refresh-architecture-docs-for-tool-relaxation/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · priority 58 · owner fkit-architect · documentation only

## Goal
[[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] relaxed the tool allowlist for every role except the adversarial reviewer, leaving standing doc claims describing a **superseded posture** — the docs still asserted the tool allowlist as a hard, per-role wall.

**A deliberate split of labour, named in ADR-022's own Consequences:** the implementing coder edits only the `tools:` lines (task 57); the **architect** owns the doc claims. **No agent-file or source edits in this task.**

Named targets: `architecture.md`'s *"the strongest boundary in the system"* line, its **per-role tool table** (§4.1), and the lead's structural `Agent(...)` note — plus `PROJECT.md` and `CLAUDE.md`, each to be **verified against the file before editing** (line numbers drift), with a grep rather than trusting ADR-022's references to be exhaustive.

## Key Changes
The brief was unusually specific about **framing the change accurately rather than overstating it** — three things that did **not** change had to stay legible:

- **The skill lockdown (ADR-018) is unchanged.** Tools opened; **skills did not**.
- **The prompt-level role contracts are unchanged** (ADR-022 Decision 5).
- **The adversarial reviewer's wall is now the *sole* structural tool restriction, and deliberately so** — its purpose (a model-diverse second opinion that never holds write authority) had to be made **legible rather than lost among blunt walls**.

**Verified in the tree 2026-07-19:** `grep` for *"strongest boundary"* / *"tool allowlist"* across `architecture.md`, `PROJECT.md` and `CLAUDE.md` returns **no remaining claim of the hard-wall-everywhere posture**; §4.1 shows the six roles carrying no `tools:` line; `architecture.md` cites ADR-022.

## Outcome
Done. The four staleness counts the vault had carried against `architecture.md` since 2026-07-13 are **largely closed**.

✅ **The "behind again" residue is now RESOLVED.** For several syncs this page flagged that `architecture.md` cited ADRs only up to 025 — so 026–030 (and the eighth-role reversal) were absent. **[[tasks/refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role]] (task 82) closed it**: verified 2026-07-22, `architecture.md` now cites ADRs to 030 and frames "seven built, an eighth authorized-not-built." The `PROJECT.md` half was [[tasks/amend-project-brief-for-the-eighth-role]] (task 83). **This task's own scope was ADR-022 and it discharged it in full** — the 026–030 residue was always a separate follow-up, now also done.

**The brief's own open question is now answered.** It asked whether the vault needed a sync for this and declined to pre-file a brief. It did: the wiki records agent tool allowlists, and the correction landed in the **2026-07-18 sync**, before this task closed.

## Related
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — the decision whose doc follow-up this is
- [[tasks/relax-tool-allowlists-except-adversarial-reviewer]] — task 57, the code half of the same ADR
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the skill lockdown that pointedly did **not** change
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — makes `architecture.md`'s seven-role claim false
- [[systems/fkit]] · [[systems/role-locked-sessions]] · [[systems/knowledge-base-structure]] · [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — related
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — related
