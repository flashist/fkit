# Plan — Add the `/fkit-dumb-down` skill for the six Claude-side roles

**Task:** [`add-dumb-down-skill-for-six-roles.md`](../tasks/done/add-dumb-down-skill-for-six-roles.md)
· **Sprint 2, priority 72** · **Approved by the owner: 2026-07-18**

## The change

1. **`claude/skills/fkit-dumb-down/SKILL.md`** — **NEW.** Re-explain the agent's own most recent
   substantive answer at lower altitude: short sentences, everyday words, an analogy where it earns its
   place, jargon glossed once. **Content-preserving** — see below. No previous answer ⇒ say so and stop.
   **Zero write surface; reads no files.**
2. **`claude/skills-for-role.sh`** — registered for the six Claude-side roles; **not**
   `adversarial-reviewer` (Codex-run, restricted allowlist — ADR-022).
3. **The two mandated mirrors** (`skills-for-role.sh`'s header requires them in the same commit):
   `claude/skills/fkit-team/SKILL.md` and `claude/README.md`.
4. **Tests** — `test/skill-ownership-hook.test.js`: added to `UNIVERSE` and the six `OWNED` lists →
   6 allow + 1 deny.

## The load-bearing part: content preservation

The skill's most likely failure is **softening while simplifying** — it *feels* like the job. So the
text names what must survive every re-explanation: a failure or regression, a caveat, an
**unverified-claim flag**, a partial-coverage/degradation flag, something not done, and a number whose
margin is the point. Plus: **precision is not jargon** — filenames, status markers, ADR ids and
verdicts stay, glossed once. And an escape valve: if a point cannot be simplified without becoming
false, say that plainly rather than emitting a smooth sentence that is subtly wrong.

This mirrors `CLAUDE.md`'s "concision is not omission" against a **different excuse** (simplicity
rather than brevity) — the same seam task 62's preference guards.

## Relationship to task 62 — both ship, neither folds into the other

Owner-ruled 2026-07-18. Task 62 makes simple language the **standing default**; this is the
**on-demand** counterpart — "explain that again, simpler" remains a distinct act even with the default
in force, because it asks for a further step down in altitude on one specific answer. Stated in the
skill so a later reader does not "consolidate" them.

## No ADR-021 seam here — deliberately

Unlike task 70's interview skill, this needs **no owner channel**: it rewrites the agent's own prior
output. It behaves identically in a session and in a spawned consult (there, the re-explanation simply
becomes the reply). The skill says so explicitly, so nobody adds a degradation path that has nothing to
degrade.

## Verification

- `skills_for_role` returns it for all six roles and **not** for `adversarial-reviewer` (asserted by
  invoking the function per role).
- Hook matrix: **6 allow + 1 deny**, no duplicate cases.
- **Mutation-checked both directions:** granting it to the adversarial reviewer → red; revoking it from
  `wiki` → red.
- `npm test` green.
- Both mandated mirrors updated in the same change.

## Scope boundary

Skill text + registration + two mirrors + tests. No launcher change, no scaffold copy (skills are not
dual-homed), no wiki write, no task-file move, no commit.

## Known limitation, disclosed

**The suite proves the gate, not the behavior.** Whether a re-explanation actually preserves every
caveat is not testable here; the brief asks for an owner spot-check (re-explain an answer containing a
caveat, confirm the caveat survives). Outstanding.
