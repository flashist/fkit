# Implement ADR-041's `dashboard.sh` half — the `Backlog` identity token and the resolve-identity interface

**Source**: `ai-agents/tasks/done/0265-implement-adr-041s-dashboard-half-the-backlog-identity-token-and-the-resolve-identity-interface/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 5 P5 (append rank `P12`, promoted 2026-08-11) · task `0265` · owner `fkit-coder`

## Goal

Build the selector side of ADR-041: the **`Backlog` H1 token**, the **resolve-identity interface** the
skill will call, and the two tests that turn previously-unpinned prose into contract.

## Key Changes

- **The `Backlog` token** — a whole trimmed segment that is exactly `Backlog` **or** exactly `Sprint
  Backlog` resolves to **`Backlog`**, ⚠️ **normalized to that string and never `Sprint Backlog`**,
  because that exact string is what every brief carries and what the drift arm compares against. The
  in-file comment states what divergence would cost: *every backlog row silently takes rule 1's skip
  and status drift on this board stops being reported.* A rung **above** the untouched basename case.
- **The resolve-identity interface** ADR-041 §5 requires — CLI surface the implementer's call, but the
  **grammar must not be re-derived in prose**.
- **The integer-ordering test** and the **same-identity ambiguity test** (owner-ruled *"Pick
  deterministically, flag loudly (Recommended)"* — lexicographically first **and every other claimant
  named**).

⚠️ **The brief surfaced one decision it deliberately did NOT make:** choose the CLI surface so the
ordering and ambiguity rules are **mechanically testable** — *if the plan leaves either in prose,
escalate before building.*

⛔ No `fkit-status/SKILL.md` edit. ⛔ No `backlog.md` rename. ⛔ **No glob reintroduced in any form.**

## Outcome

**Landed and verified on disk 2026-08-13.** `dashboard.sh` carries `resolve_identity()`,
`is_eligible()`, an `identity <plan>` primitive printing the identity on one line or nothing, and a
`select-active` mode emitting `active` / `candidate` / `drift ambiguous-active-sprint` / `active none`
records.

### ⚠️ The read-only Codex pass originated three findings here — including one that mattered

On this task the reasoning-only second opinion **originated** findings R3, R5 and R6, all
independently verified correct — **R5 being an ADR-040 breach where an unreadable file resolved to a
confidently *wrong* identity**, which is precisely the failure class ADR-040 exists to refuse. *Static
reasoning finds real defects.*

This task's ledger is also the **one of three in the sprint that reported its coverage correctly** —
loudly **PARTIAL** — while two siblings claimed FULL on identical capability. That three-way
inconsistency is the evidentiary base of
[[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]].

⚠️ Closed `(agent-closed — not owner-verified)`. ⚠️ Its merit statement was *"immediately below
`0264`"*, and it holds `P5` — **satisfied**, unlike its sibling `0268`.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — the decision implemented
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — the grammar extended
- [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]] — the dependency
- [[tasks/retire-the-sprint-glob-in-fkit-status-skill]] — the consumer of the interface built here
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — this ledger is its accurate case
- [[systems/review-and-model-diversity]]
- [[systems/testing-and-verification]]
- [[tasks/decide-whether-the-active-sprint-glob-widens]] — `0261`, the decision this implements
