# Revert the task movers to producer-only — `skills-for-role.sh` + 4 mirrors + hook test + mover SKILL prose

## ID
0124

## Sprint
Sprint 2

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

The structural core of
[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
§1: **only `fkit-producer` may run `/fkit-task-done` and `/fkit-task-cancelled`.** Today
`claude/skills-for-role.sh:37-43` grants both movers to `lead, producer, coder, architect, reviewer,
wiki` (the ADR-025 "any role but the adversarial reviewer" grant). This reverts that to producer-only,
which makes the rule **hook-structural** (the ADR-018 `PreToolUse` hook then denies a mover call from
any non-producer identity at any spawn depth — `skill-ownership-hook.sh:119-136`), not the prose ADR-025
relied on.

This is one atomic unit: the ownership change, its four human mirrors, the test that guards it, and the
movers' own SKILL prose asserting "any role may close" all describe the same fact and must move together.
The `skills-for-role.sh:12-24` mirror checklist **has shipped false docs before** (task 0036) — the
mirrors land in the **same commit**.

**⚠️ Sequencing:** land this **after** 0122 and 0123. Removing the movers from `coder`/`lead` while the
ship-loops still invoke `/fkit-task-done` would hook-deny those loops. 0122/0123 reroute the loops to a
producer spawn first; this task then removes the now-unused grants.

## What to build

Per ADR-033 §1 and §Consequences:

1. **`claude/skills-for-role.sh`** — drop `fkit-task-done` and `fkit-task-cancelled` from `lead, coder,
   architect, reviewer, wiki`; `producer` keeps both. The adversarial reviewer never had them and still
   does not.
2. **The FOUR human mirrors, in the same commit** (the `skills-for-role.sh:12-24` checklist) — update
   every mirror that lists which roles own the movers so none is left asserting the ADR-025 grant:
   `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`, and
   `ai-agents/knowledge-base/architecture.md` (the skill-ownership listing rows for the movers only —
   coordinate with task 0115, which also touches architecture.md).
3. **`test/skill-ownership-hook.test.js`** — flip the deny/allow assertions for the five roles: the
   movers are now **allow for `producer`, deny for `lead, coder, architect, reviewer, wiki`** (and still
   deny for the adversarial reviewer). Pin the JSON deny shape, not just the exit code.
4. **The two movers' own SKILL prose** — `claude/skills/fkit-task-done/SKILL.md` and
   `claude/skills/fkit-task-cancelled/SKILL.md` (plus their scaffold copies if dual-homed): revert the
   "⛔ Owner: the producer — but **any agent may invoke it**" / ADR-025 "any role may close" banners and
   body prose to **producer-only** per ADR-033. Keep the agent-closed marker rule: a producer **spawned**
   by another agent still writes `✅ Done (agent-closed — not owner-verified)`; only an owner-present
   producer session yields a plain owner-verified close (ADR-033 §5).

## Verification steps

1. `skills-for-role.sh` grants both movers to `producer` only; no other role has either.
2. All four mirrors reflect producer-only movers; the `:12-24` checklist is satisfied (no mirror stale).
3. `skill-ownership-hook.test.js` asserts allow-for-producer / deny-for-all-others (incl. adversarial
   reviewer) with the JSON deny shape pinned; the full test suite is green.
4. The ADR-027 dual-home parity test passes (live vs scaffold).
5. Both movers' SKILLs read producer-only, retaining the agent-closed-marker rule for a spawned producer.
6. The ship-loops (0122/0123) already route closes to a producer spawn, so no loop invokes a now-denied
   mover.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** 0122 and 0123 (the ship-loops must route to the producer before the grants are removed).
- **Blocks:** 0126.
- **Recommend co-landing with 0125** (the wiki flag convention) — once this removes the movers from
  `wiki`, 0125's flag is the wiki's only completion signal.
- **⚠️ Coordinate with 0115 on architecture.md** — 0115 also edits architecture.md (lead prose + §5.2
  lock). This task touches only the mover-ownership mirror rows. Sequence so neither reverts the other.
- **ADR-033 is honest about the limit:** this restores separation of the closing *identity* (hook-
  enforced), **not** full prevention — a determined doer can still spawn a producer to close. Do not
  "harden" beyond the ADR; that residual is accepted and named (ADR-033 §The limit).
- No commit — leave the coordinated edit in the working tree (the mirror set must move together when the
  owner does commit).
