# Refresh the docs for the tool-allowlist relaxation (ADR-022)

## ID
0068

## Sprint
Sprint 2

## Priority
58

## Status
✅ Done

## Context

[ADR-022](../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)
(accepted 2026-07-18) relaxes the tool allowlist for every role except the adversarial reviewer. It
leaves several **standing doc claims describing a superseded posture** — the docs still assert the
tool allowlist as a hard, per-role wall. ADR-022's own Consequences section names these explicitly as
an **architect follow-up, not the implementing coder's job** (the coder edits only the `tools:` lines
— task 57).

**This is a documentation task.** No agent-file or source edits — those are task 57.

## What to build

Update the claims ADR-022 supersedes. Per ADR-022 (Consequences + Related), the known targets:

- **`ai-agents/knowledge-base/architecture.md`:**
  - The line calling the tool allowlist *"the strongest boundary in the system"* (≈:101) — no longer
    true; the strongest **structural** boundary is now the skill-ownership hook (ADR-018) plus the one
    remaining tool wall (the adversarial reviewer's).
  - The **per-role tool table** (§4.1) — the six roles no longer carry an explicit allowlist; only the
    adversarial reviewer does (`Read, Grep, Glob, Bash, Skill`).
  - The **lead's structural `Agent(...)` note** (§5.3 / ≈:209) — the scoped `Agent(fkit-…)` list is
    gone; the two-hop consult topology is now prompt-enforced everywhere, not structurally enforced at
    the lead.
- **`PROJECT.md` and `CLAUDE.md`** — any tool-allowlist mentions that describe the hard-wall-everywhere
  posture. **Verify each against the file before editing** (line numbers drift); do not assume ADR-022's
  references are exhaustive — grep both for tool/allowlist language.

**Frame the change accurately, don't overstate it:**

- The skill lockdown (ADR-018) is **unchanged** — skills stay role-locked. Say tools opened, skills did
  not.
- The prompt-level role contracts are **unchanged** (ADR-022 Decision 5).
- The adversarial reviewer's wall is now the **sole** structural tool restriction, and deliberately so
  (its independence / model-diverse second opinion never having write authority) — make its purpose
  legible rather than lost among blunt walls.

## Verification steps

- `architecture.md` no longer calls the tool allowlist "the strongest boundary"; its per-role tool
  table reflects six unrestricted roles + the adversarial reviewer's kept line; the lead's structural
  `Agent(...)` claim is corrected or removed.
- `grep -rniE 'tool allowlist|tools:|strongest boundary' architecture.md PROJECT.md CLAUDE.md` surfaces
  no remaining claim of the hard-wall-everywhere posture.
- The docs still correctly describe the skill lockdown as intact and the adversarial reviewer's tool
  wall as the one deliberate structural restriction.
- ADR-022 is cross-referenced where the superseded claim was.

## Notes

- **Owner: fkit-architect** — a knowledge-base / root-doc edit; the architect owns `architecture.md`
  and these doc claims.
- **Depends on: [ADR-022](../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)**
  (exists). **Soft-depends on task 57** — the docs describe the reality task 57 lands. The architect
  can write against ADR-022 as the contract, but the docs are only *true* once 57 ships; sequence 58
  after 57 (or co-verify) so the docs don't describe a state not yet in the tree.
- **Out of scope:** the `ai-agents/wiki-vault/` — if any vault page enumerates per-agent tool
  allowlists, that is a **wiki-sync** concern (fkit-wiki's exclusive path), a candidate follow-up, not
  part of this task. Flagged as an open question below.

## Open question for the owner (not resolved here)

- **Does the wiki vault need a sync for this?** If any `ai-agents/wiki-vault/` page records per-agent
  `tools:` lines or the "strongest boundary" claim, a wiki-sync follow-up (owner: fkit-wiki) would be
  warranted. Left as a question rather than a pre-filed brief — worth a task only if the vault actually
  records agent tool allowlists. **Say the word and I'll file it.**
