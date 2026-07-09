# Sprint 1 — Ship the onboarding sequence

**Goal:** fkit's near-term goal (per intake) is *"a user-friendly startup sequence and a few agents
with dedicated skills."* The six agents already exist; this sprint closes the loop on the startup
sequence itself — verify it actually works end-to-end for a new user, lock in the reliability work
already touched, and scope (don't yet build) the next layer of hardening. Skill-set expansion is
explicitly deferred past this sprint (owner decision, 2026-07-09).

**Priority order this sprint** (owner-ranked): onboarding verification → consult-envelope doc →
CI tail task.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | 1 | Verify onboarding flow end-to-end | [`verify-onboarding-flow-end-to-end.md`](../tasks/backlog/verify-onboarding-flow-end-to-end.md) |
| 🔲 Backlog | 2 | Document the consult-chain envelope | [`document-consult-chain-envelope.md`](../tasks/backlog/document-consult-chain-envelope.md) |
| 🔲 Backlog | 3 | Add CI: run validate-bundles.sh | [`add-ci-validate-bundles.md`](../tasks/backlog/add-ci-validate-bundles.md) |
| 🔲 Backlog | 4 | Replace leftover placeholder text in CLAUDE.md / AGENTS.md | [`fix-claude-agents-md-placeholder-text.md`](../tasks/backlog/fix-claude-agents-md-placeholder-text.md) |

## Context

- This repo dogfoods fkit on itself; this producer session is the *first* run of
  `initiate-project`, which is now complete — `PROJECT.md` and `architecture.md` are written,
  three ADRs recorded (`ai-agents/knowledge-base/decisions/`).
- The owner flagged (2026-07-09) that several onboarding pieces have had recent fixes applied in a
  separate working session — a launch/tty fix, browser-open behavior, and the terminal intake
  script — but **none of it has been confirmed working end-to-end in a real terminal yet**. That
  confirmation is this sprint's top priority, not new feature work.
- Architecture survey flagged (and the owner then scoped down) a reliability question about deep
  multi-hop agent consultation under fully headless runs. Corrected framing: onboarding itself is
  interactive and only uses verified one-hop consults, so it is **not** blocked by this — but the
  envelope (what's verified vs. not) isn't written down anywhere yet, and should be before anyone
  builds a headless automation flow (e.g. CI-driven review chains) on top of it.
- `ai-agents/knowledge-base/decisions/adr-003-ci-runs-validate-bundles.md` decided CI is wanted;
  this sprint includes the implementation task.

## Not in this sprint (explicitly deferred)

- Expanding or polishing the six agents' skill sets (owner: after onboarding is solid).
- `sandbox.write_paths` / structural enforcement of agent role boundaries (named risk in
  `architecture.md`, no timeline set yet).
- A `bin`-based `npx fkit` installer (deferred per ADR-001).

## Notes

No task in this sprint has been assigned an owner-agent session yet — these are backlog briefs ready
to be picked up. Nothing in this sprint has been committed to git; all initiation artifacts
(`PROJECT.md`, `architecture.md`, ADRs, this plan, the task briefs) are working-tree only pending
owner review.
