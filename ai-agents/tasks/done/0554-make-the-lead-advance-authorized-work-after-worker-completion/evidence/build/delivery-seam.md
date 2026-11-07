# 0554 — Normal delivery seam (Build handoff, not a delivery test result)

Canonical sources:
- `claude/agents/fkit-lead.md` → initializer refresh → fixture `.claude/agents/fkit-lead.md`.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` → initializer refresh → fixture
  `.claude/skills/fkit-sprint-ship-loop/SKILL.md`.
- `codex/materialize.mjs` `setup(root)` invokes that initializer, then materializes canonical skill
  bodies through `skillText` → fixture `.agents/skills/fkit-sprint-ship-loop/SKILL.md`.
- `instructions(root, 'lead', session)` reads the canonical lead body and adds `bindings(root, role,
  runtime)` for configured Codex/Claude launches. Runtime branches were both edited canonically.

Existing selected transport fixture creates a disposable root with `configuredFixture()`, invokes
normal `f.run(['setup'])`, then uses `fixtureRoleServer()` with a local fake Codex executable and
local files. It validates transport payload/metadata/launch counts. It does not assert all four
instruction-delivery surfaces or prove that any model follows the delivered prose.

Fresh Verify should use disposable normal setup/configured-launch fixtures to check both canonical
`.claude/` copies, configured role instructions for both binding branches, and adapted `.agents/`
skill delivery. Keep native project settings and generated copies untouched. No delivery result,
live Claude compatibility, real model obedience or later-turn resumption is claimed by this map.
