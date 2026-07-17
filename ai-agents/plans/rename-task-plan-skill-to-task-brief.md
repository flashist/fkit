# Plan — Task 50: rename the producer's `fkit-task-plan` skill → `fkit-task-brief`

_Approved by the owner via the task-ship-loop plan gate (2026-07-17), incl. the recommended
"genericize the historical `fkit-claude.sh:228` comment" disposition. Durable autonomy boundary (ADR-020)._

## Context
Atomic rename of the producer's brief-creation skill to break the `fkit-task-plan` / `fkit-plan-task`
(coder) name collision. Hook is data-driven (sources `skills-for-role.sh`); init `rm -rf`s+recopies
`.claude/skills/fkit-*/`. Rename, not an edit — content changes only where the skill names itself.

## Changes (each hit disambiguated, not batch-replaced)
1. `git mv claude/skills/fkit-task-plan/ → claude/skills/fkit-task-brief/`; SKILL.md line 2 `name:` and
   line 6 title `# Task Plan`→`# Task Brief` (single-line; line 70 unshifted).
2. SoT + mirrors: `skills-for-role.sh:21`, `skills/fkit-team/SKILL.md:52`, `README.md:45`.
3. Producer prompt: `agents/fkit-producer.md:36,:88`.
4. Cross-ref pointers: `skills/fkit-status/dashboard.sh:259` `(fkit-task-plan:70)`→`(fkit-task-brief:70)`;
   `test/dashboard-contract.test.js:648,:650` (2 comments + R19 test title).
5. Tests: `test/skill-ownership-hook.test.js:224` (UNIVERSE), `:231` (OWNED.producer).
6. Conventions dual-home: scaffold `task-status-vocabulary.md:52` & `evidence-before-assertion.md:28`
   + live twins `ai-agents/…/task-status-vocabulary.md:56` & `evidence-before-assertion.md:35`.
7. `skills/fkit-task-ship-loop/SKILL.md:22` — simplify `task-brief`/`task-plan` → `task-brief`.

## Deliberately LEFT
- `fkit-claude.sh:228` — genericize the task-14 example, dropping the stale skill name (owner-approved),
  keeping history true + grep clean.
- `fkit-task-ship-loop/SKILL.md:71` — ADR-020 filename `per-task-plan` (artifact, not skill).
- Coder's `fkit-plan-task/` (untouched); `ai-agents/` history & wiki (frozen / task 51).

## Verification
- `node --test` green (hook + dashboard-contract suites); direct hook invocation allows producer
  `fkit-task-brief`, denies coder.
- `grep -rn "fkit-task-plan" claude/ test/` → zero.
- `git diff --stat` shows no change under `claude/skills/fkit-plan-task/`.
- init into scratch → `.claude/skills/fkit-task-brief/` present, `fkit-task-plan/` absent.
- Caveat: interactive `fkit producer` session check is owner/producer-run (coder role lock).
