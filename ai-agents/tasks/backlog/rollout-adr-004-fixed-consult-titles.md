# Roll out ADR-004: fixed, role-based titles for consult spawns

## Sprint
Sprint 1

## Priority
12

## Status
🔲 Backlog

## Context

[`ADR-004`](../../knowledge-base/decisions/adr-004-fixed-role-based-titles-for-consult-spawns.md)
(accepted, 2026-07-10) decided that every fkit agent spawning an ad hoc consult child should use a
**fixed, reusable, role-based title** (`<target-agent>-consult`) instead of a fresh topic-derived
title per question — this is what's currently flooding the Web UI's Agents panel with one-off
entries (e.g. `adversarial-reviewer auto-spawn mechanism`, `reconnect-tooling-conventions`) and
producing hard-to-parse names. The ADR itself doesn't make the change — it explicitly defers
implementation to a follow-up task, "producer's task-lifecycle responsibility." This is that task.

## What to build

Per ADR-004's own file list and naming table — apply exactly, no re-deriving:

1. `omnigent/fkit-producer/config.yaml` (line 83, shared instruction) — consult targets fkit-wiki
   and fkit-architect use titles `wiki-consult` and `architect-consult`.
2. `omnigent/fkit-coder/config.yaml` (line 83) — same two titles.
3. `omnigent/fkit-architect/config.yaml` (line 100) — targets fkit-wiki and fkit-producer use
   `wiki-consult` and `producer-consult`.
4. `omnigent/fkit-adversarial-reviewer/config.yaml` (line 86) — target fkit-wiki only,
   `wiki-consult`.
5. `omnigent/fkit-reviewer/config.yaml` (line 99, wiki) **plus**
   `omnigent/fkit-reviewer/skills/review/SKILL.md` and
   `omnigent/fkit-reviewer/skills/stateful-review/SKILL.md` Step 1B — the adversarial-reviewer call
   currently names no explicit title (silently falls back to generic `<short topic>`); set it
   explicitly to `title="adversarial-reviewer-consult"` in both skill files, since this spawn
   currently runs once per review and would otherwise keep creating a fresh child per diff.
6. Re-vendor after edits (`omnigent/vendor-agents.sh`), same canonical-source convention as
   `remove-adversarial-reviewer-eager-spawn.md`.
7. No change: `omnigent/fkit-wiki/config.yaml` (never spawns) and `omnigent/fkit-team/config.yaml`
   (already fixed-title, this is the precedent being extended).

## Verification steps

- `grep -rn "short topic" omnigent/` shows no remaining generic-topic-title instruction anywhere a
  fixed title now applies.
- Each spawner's consult prompt names the exact fixed title for each of its consult targets.
- Both reviewer skill files' Step 1B explicitly sets `title="adversarial-reviewer-consult"`.
- `vendor-agents.sh` re-run cleanly, `.fkit/agents/` reflects the updated bundles.
- Spot-check: two separate questions to the same target agent in one session produce **one** child
  session, not two (matches ADR-004's stated intent).

## Notes

- Natural owner: **fkit-coder** (config/prompt + skill-file edits + re-vendor is source-write).
- Pure prompt-text change, zero platform/server dependency — this is fully actionable now, unlike
  the sibling `give-every-agent-direct-wiki-query-access.md` task, which still has open technical
  due diligence.
- Small task — should not need its own sprint slot beyond this one.
