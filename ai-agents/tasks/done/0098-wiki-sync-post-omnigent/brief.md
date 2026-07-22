# Wiki sync after the Omnigent removal

## ID
0098

## Sprint
Sprint 2

## Priority
11 (Phase 5b — genuinely last)

## Status
✅ Done

## Owner
fkit-wiki

## Context

Per the Omnigent-removal plan
([`2026-07-11-plan-omnigent-removal.md`](../../../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md))
§Phase 5 and §F.

The wiki vault is stale with respect to the removal:

- **9 vault files reference Omnigent.**
- `wiki/systems/fkit.md:7` still opens *"fkit is a distributable Omnigent-based team"* — the
  headline sentence of the vault's page about the project itself is now false.
- Watermark is `f7b23f4`; HEAD was `2e63c2f` when the plan was written.

## ⚠️ This is genuinely last — do not pull it forward

**Syncing before Phase 4 just ingests the drift.** The wiki synthesizes from the docs; if the docs
still describe a dual-runtime, hat-skill, 6-agent Omnigent project, the sync faithfully records all of
that into the vault — and then the drift is in *two* places instead of one, with the vault carrying
the authority of "verified knowledge."

**Before starting, confirm `rewrite-docs-post-omnigent` and `knowledge-base-hygiene-post-omnigent` are
both Done.** If they are not, stop — this task is not ready and running it early makes things worse.

## What to build

- Run `/fkit-wiki-sync` — a delta-ingest of everything that changed since watermark `f7b23f4`.
- The sync should pick up: **ADR-009** and **ADR-010**, the rewritten root docs (`README.md`,
  `CLAUDE.md`, `AGENTS.md`, `PROJECT.md`, `architecture.md`, `claude/README.md`), and the removal of
  `omnigent/`.
- Pay particular attention to the **9 known Omnigent-referencing vault files** — a delta sync keyed on
  changed *sources* may not revisit a vault page whose source was **deleted** rather than modified.
  Deleted sources are the failure mode here. Check those 9 explicitly and correct them.
- `wiki/systems/fkit.md` needs its opening rewritten outright.
- **Sprint-file rename (2026-07-11).** Sprint plans were renamed `plan-sprint-N.md` → **`sprint-N.md`**
  (owner ruling; the `plan-` prefix and the doubled "sprint" were redundant under `sprints/`). The
  vault still carries the old paths in two places — `log.md` (4 ingest entries) and
  `wiki/tasks/sprint-1-ship-the-onboarding-sequence.md:3` (`**Source**:`). Both are **dangling source
  pointers**, and this sync is the only sanctioned way to fix them. Also note Sprint 1 now lives at
  `ai-agents/sprints/done/sprint-1.md`, not `sprints/`.
- Run a `/fkit-wiki-lint` afterward to catch anything left dangling.

## Verification steps

- `grep -rni "omnigent" ai-agents/wiki-vault/` — remaining hits should be **only** deliberate
  historical framing ("fkit formerly ran on Omnigent"), never a live present-tense claim.
- `wiki/systems/fkit.md` describes a Claude Code native + Codex team, with 7 roles.
- The watermark advances to the new HEAD.
- `/fkit-wiki-lint` passes clean.
- Spot-check with `/fkit-query`: ask *"what runtime does fkit use?"* and *"how many agents are there?"*
  — the answers should be right, from the vault.

## Notes

- Owner: **fkit-wiki** — and **only** fkit-wiki. It is the exclusive write gateway to
  `ai-agents/wiki-vault/`; no other agent or session writes there, ever.
- **Depends on:** `rewrite-docs-post-omnigent` (Phase 4) and `knowledge-base-hygiene-post-omnigent`
  (Phase 5a). **Hard dependency — see the warning above.**
- Risk: **low**, but only if the ordering holds.
