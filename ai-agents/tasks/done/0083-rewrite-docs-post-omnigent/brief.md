# Rewrite the docs against the post-removal reality

## ID
0083

## Sprint
Sprint 2

## Priority
8 (Phase 4)

## Status
✅ Done

## Owner
fkit-coder

## Context

Per the Omnigent-removal plan
([`2026-07-11-plan-omnigent-removal.md`](../../../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
§Phase 4), the [doc-drift audit](../../../knowledge-base/reports/2026-07-11-doc-drift-audit.md), and
ADR-[009](../../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)/[010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md).

**This task comes _after_ the deletion, deliberately.** The prize for sequencing the sprint correctly
is that the docs get written **once, against what actually exists** — instead of correcting drift in
files that are about to be `git rm`'d. Starting this early wastes the work.

**Derive everything from `claude/scaffold/CLAUDE.md`** — per the audit, the one doc in the repo that
is currently correct about the role-locked model.

## What to build

Rewrite each of these against the post-removal reality:

| File | What it needs |
|---|---|
| **`AGENTS.md`** (root) | **Do this one first — highest leverage.** Codex reads it *natively* during the adversarial pass, which means it is right now briefing the adversarial reviewer that fkit is Omnigent-only (`:7-24`). Every adversarial review is currently being run by a model that has been told the wrong thing about the project. Rewrite for Claude-native + ADR-009/010. |
| `CLAUDE.md` (root) | `:23-26` still describes "the interactive session is the team lead and the coder" — the superseded model that ADR-010 replaced. |
| `README.md` (root) | The flavor inversion (`:8,24-25,35-39`), the lead-session model (`:59-62`), the 6-agent table (**missing `fkit-lead`**), and the `omnigent/` layout block. |
| `claude/README.md` | **Largest single drift site.** Hat skills (`:24,41`), `fkit claude` (`:31,94-109`), the 6-agent table (`:58-65`) — and it **never documents the skill lockdown at all**, which is the flavor's central invariant. |
| `architecture.md` | **Substantial rewrite.** It is an Omnigent-shaped document with a stale Claude addendum bolted on (`:380-396`). Post-removal, the Claude flavor *is* the architecture — restructure accordingly, don't patch. |
| `PROJECT.md` | Team list (no `fkit-lead`), the dual-runtime constraint, `fkit claude`, "six bundles". |

Recurring themes to get right **everywhere**: it is **7 agents, not 6** (`fkit-lead` is missing from
every table); there is **one runtime, not two**; sessions are **role-locked with a skill lockdown**,
not a lead session wearing hats; **Codex is required**, not optional.

## Verification steps

- `grep -rni "omnigent" README.md CLAUDE.md AGENTS.md PROJECT.md architecture.md claude/README.md` —
  every remaining hit should be a deliberate historical reference (e.g. "fkit formerly ran on
  Omnigent; see ADR-009"), not a live claim.
- `grep -rn "six agents\|6 agents\|fkit claude\|fkit omnigent"` across the docs returns nothing live.
- Every agent table lists **7** roles including `fkit-lead`.
- The skill lockdown is documented in `claude/README.md`.
- Read each doc as a **new user** would, top to bottom: does it describe the tool that now exists?

## Notes

- Owner: **fkit-coder** (docs, not code — but it is a write task, and the coder is the write
  authority). The **architect** may be consulted for `architecture.md`'s structure.
- **Depends on:** Phase 2 (`delete-omnigent-directory`). Write once, against reality.
- **Blocks:** Phase 5 — the wiki sync must not run until these are correct, or it just ingests the
  drift.
- Risk: **low.**
