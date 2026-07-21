# Plan — Add the `/fkit-open-questions-interview` skill for the six Claude-side roles

**Task:** [`add-open-questions-interview-skill-for-six-roles.md`](./brief.md)
· **Sprint 2, priority 70** · **Approved by the owner: 2026-07-18**

## The change

1. **`claude/skills/fkit-open-questions-interview/SKILL.md`** — the procedure. Source is **the current
   session's history and nothing else**; dedup; if nothing is open say so and stop; otherwise interview
   via `AskUserQuestion` (batched, ≤4 per call, remainder announced not truncated). Consult degrade per
   ADR-021. **Zero write surface.**
2. **`claude/skills-for-role.sh`** — registered for the six Claude-side roles. **Not**
   `adversarial-reviewer` (Codex-run, restricted allowlist, no interactive channel — ADR-022).
3. **Tests** — the existing hook matrix in `test/skill-ownership-hook.test.js`: added to `UNIVERSE` and
   to the six `OWNED` lists, which generates 6 allow + 1 deny cases.

## Discovered during the run, not in the original plan

**`skills-for-role.sh`'s own header mandates two hand-maintained mirrors be updated in the same
commit**, *"or the docs lie about what a role can do"*:

- `claude/skills/fkit-team/SKILL.md` — the roster `/fkit-team` prints
- `claude/README.md` — the skill-ownership table

Both updated. **Both previously said the universal set was `/fkit-query` + `/fkit-team`, "which
everyone has"** — this skill is the first that is held by **six of seven** roles, so both mirrors also
needed the exclusion stated, not just a name added. Followed the file's own instruction rather than
treating this as scope creep: it is the registration step's documented other half.

## The three interview rulings (owner decisions, not reopened)

1. Source = the current session's history only. 2. Scope = the six Claude-side roles.
3. Interview only; records nothing to files.

## Verification

- `skills_for_role` returns the skill for all six roles and **not** for `adversarial-reviewer`
  (asserted by invoking the function per role, not by reading it).
- Hook matrix: **6 allow + 1 deny**, green.
- **Mutation-checked both directions**: granting it to the adversarial reviewer → red; revoking it from
  the coder → red.
- `npm test` green.
- Both mandated mirrors updated in the same change.

## Scope boundary

Skill text + registration + the two mirrors + tests. No launcher change, no scaffold copy (skills are
not dual-homed), no wiki write, no task-file move, no commit.

## Known limitation, disclosed

**The skill's *behavior* cannot be tested here.** The suite proves the **gate** (who may invoke it), not
that the sweep finds the right questions or refuses to invent them. The brief's verification asks for a
session spot-check — owner-run, and outstanding.
