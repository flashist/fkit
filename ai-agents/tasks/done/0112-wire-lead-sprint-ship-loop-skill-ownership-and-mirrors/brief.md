# Wire `fkit-sprint-ship-loop` into `skills_for_role()` + the four mirrors (same commit)

## ID
0112

## Sprint
Sprint 2

## Priority
94

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

Register the new skill (0111) as lead-owned so the ADR-018 skill-ownership hook allows lead to run it
and denies every other role. From the approved design
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
§4.2 (change surface), §6.1 (`skills_for_role()` is the single source of truth), and §9.5 (doc-drift
blast radius).

`skills_for_role()` in `claude/skills-for-role.sh` stays the **single source of truth** (ADR-012 §1)
— no second list. The hook then allows/denies with no further change
(`skill-ownership-hook.sh:132-136` untouched).

## What to build

1. **Add exactly one skill to `lead`** in `claude/skills-for-role.sh:37` (design §6.1):
   `lead` gains `fkit-sprint-ship-loop` and nothing else (spawns are Agent-tool calls, not skills).

2. **⚠️ Update the FOUR human mirrors IN THE SAME COMMIT** as `skills-for-role.sh` — the checklist
   lives at `skills-for-role.sh:12-24`, and **this exact mirror set has shipped false docs before**
   (task 0036). The four mirrors (design §4.2):
   - `claude/skills/fkit-team/SKILL.md`
   - `claude/README.md`
   - `claude/scaffold/CLAUDE.md`
   - `ai-agents/knowledge-base/architecture.md` — **the skill-ownership listing row for lead only.**
     ⚠️ architecture.md is *also* edited by 0115 (lead role-nature prose + §5.2 stale-lock fix). This
     task touches only the `skills_for_role` mirror row; 0115 handles the prose. Coordinate so the two
     edits do not clobber each other — 0114/0115 depend on this task and land after it.

3. **Add/extend the test** (design §13): assert `lead` **owns** `fkit-sprint-ship-loop` (allow) and
   **every other role is denied** it. Pin the JSON deny shape, not just an exit code
   (`skill-ownership-hook.sh` header caution). Run the ADR-027 dual-home parity test + the four-mirror
   checklist in the same change.

## Verification steps

1. `skills-for-role.sh:37` lists `fkit-sprint-ship-loop` for `lead` and no other role.
2. All four human mirrors reflect the new lead skill; the `skills-for-role.sh:12-24` checklist is
   satisfied (no mirror left stale).
3. The skill-ownership hook test asserts allow-for-lead / deny-for-all-others with the JSON deny shape
   pinned; the test suite is green.
4. The ADR-027 dual-home parity test passes (live vs scaffold).

## Notes

- **Owner:** fkit-coder.
- **Depends on:** 0111 (the skill must exist to register it). Design §11: `T4` depends on T3 (0111).
- **Blocks:** 0114 + 0115 (docs) — design §11 has `T6` depend on T4.
- **Single source of truth:** do not create a second skill list; `skills_for_role()` is authoritative
  (ADR-012 §1). The four mirrors are human copies that must match it.
- **Confirm the skill name with the owner first** (see 0111's open questions) — this task hard-wires
  the name in five places; renaming after this lands is a five-file change.
- No commit — the "same commit" requirement means the mirror set must move **together** when the owner
  does commit; leave the coordinated edit in the working tree.
