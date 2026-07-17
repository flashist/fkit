# Rename the producer's `fkit-task-plan` skill to `fkit-task-brief`

## Sprint
Sprint 2

## Priority
50

## Status
🔲 Backlog

## Context

**The owner's ask (2026-07-17):** rename the producer's `/fkit-task-plan` skill to `/fkit-task-brief`,
*"to avoid mixing up this skill with the coder's skill of a similar name."*

**The confusion is real and maximal:** the producer's `/fkit-task-plan` (scope a description into
backlog briefs) and the coder's `/fkit-plan-task` (read a brief, produce an implementation plan) are
**the same two words swapped**, for two different roles doing two different things at opposite ends of
the task lifecycle. `fkit-task-brief` names what the producer's skill actually produces — briefs —
and breaks the symmetry.

**A skill rename is not one file.** The name is load-bearing in several places (reference sweep run
2026-07-17, `grep -rl "task-plan"`):

- `claude/skills/fkit-task-plan/` — the skill directory itself (SKILL.md self-references included).
- `claude/skills-for-role.sh` — **the skill-ownership source of truth** (ADR-010/ADR-012: declared in
  exactly one place); the PreToolUse hook (task 43) denies by it, so a half-done rename means the
  producer **loses the skill entirely** (old name gone, new name not on the allowlist).
- `claude/fkit-claude.sh` — launcher references.
- `claude/agents/fkit-producer.md` — the role's system prompt names its interactive skills.
- `claude/skills/fkit-team/SKILL.md`, `claude/README.md` — team/skill listings.
- `claude/skills/fkit-status/dashboard.sh` — check the hit; may be a comment.
- `claude/scaffold/ai-agents/knowledge-base/conventions/` (`evidence-before-assertion.md`,
  `task-status-vocabulary.md`) **and their live twins in `ai-agents/knowledge-base/conventions/`** —
  a dual-home pair; per the owner's 2026-07-17 parity ruling (tasks 48/49 addendum), **both homes are
  in scope or the omission is explicit.**
- `test/skill-ownership-hook.test.js`, `test/dashboard-contract.test.js` — check the hits; update
  where they assert the name.

**⚠️ Disambiguate every hit:** `task-plan` is a substring of both skill names' vocabulary — some hits
in the sweep are the **coder's `plan-task`**, which is **not being renamed**. Each match must be read,
not batch-replaced.

**History stays frozen** (standing precedent — tasks 44/45, task 21/22 rulings): closed sprint plans,
done/cancelled briefs, dated reports, ADRs, and review ledgers that say `/fkit-task-plan` were true
when written. **Do not rewrite them.** The active `sprint-2.md`'s frozen addenda likewise stay as
written.

## What to build

- Rename the skill directory `claude/skills/fkit-task-plan/` → `claude/skills/fkit-task-brief/`
  (`git mv`), and update its SKILL.md self-references (title, ask-instead banner examples, usage).
- Update the name in every **live, functional** reference: `skills-for-role.sh` (producer's list),
  `fkit-claude.sh`, `agents/fkit-producer.md`, `fkit-team/SKILL.md`, `claude/README.md`, and the
  conventions pair in **both** homes (scaffold + live `ai-agents/`).
- Update the ask-instead banners in other skills if any reference `/fkit-task-plan` (sweep for it).
- Update tests that assert the old name; the launcher-contract and hook suites must pass green.
- Decide nothing about behavior: **the skill's content changes only where it names itself.** This is
  a rename, not an edit.
- **Out of scope:** the coder's `fkit-plan-task` (not renamed); historical records (frozen);
  `ai-agents/wiki-vault/` (task 51, fkit-wiki's exclusive path).

## Verification steps

- `fkit producer` session: `/fkit-task-brief <description>` runs; `/fkit-task-plan` no longer exists.
- The PreToolUse skill gate still **allows** the producer to run `fkit-task-brief` and still **denies**
  it to another role (e.g. a coder session) — proving `skills-for-role.sh` and the hook agree on the
  new name.
- `node --test` at repo root: green, including the skill-ownership hook suite.
- `grep -r "fkit-task-plan" claude/ test/` returns **zero functional hits** (hits inside
  `ai-agents/` history and wiki are expected and out of scope).
- The coder's `claude/skills/fkit-plan-task/` is **byte-untouched** (`git diff --stat` shows no change
  under it).
- Init-regenerated copies: after `claude/fkit-claude-init.sh .`, `.claude/skills/` contains
  `fkit-task-brief/` and not `fkit-task-plan/`.

## Notes

- **Owner: fkit-coder** — product source: launcher, ownership source of truth, hook tests, scaffold.
- **Depends on: nothing. Blocks: task 51 (wiki sync) — hard.**
- **Atomic on purpose — not split further:** the directory, `skills-for-role.sh`, and the hook's
  allowlist must change together or the producer's session breaks mid-rename; there is no smaller
  independently shippable unit.
- **Dual-home discipline applies** (owner's 2026-07-17 ruling): the conventions files that name the
  skill exist in both the live tree and the scaffold — both are in scope here, explicitly.
- Consuming projects receive the rename via normal init regeneration of `.claude/` copies; no
  migration concern — but note convergence never deletes, so a stale `fkit-task-plan` reference
  inside an existing project's *own* `ai-agents/` files (if any) simply ages out; not this task's
  problem.
