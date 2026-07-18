# Build the deterministic dashboard script and wire it into `/fkit-status`

**Source**: `ai-agents/tasks/done/build-deterministic-dashboard-script-for-fkit-status.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 41

## Goal
Implement the "deterministic layer" the owner asked for on `/fkit-status`: a script that renders the step-4 dashboard deterministically, invoked by the skill so its output is shown when the skill runs, **replacing the prose dashboard-description** in `claude/skills/fkit-status/SKILL.md`. Beats 1–6 stay LLM-driven. Built against — did not decide — the shape settled by its hard dependency, [[tasks/design-deterministic-dashboard-for-fkit-status]] (task 40) and [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]].

## Key Changes
- **The dashboard script** (`claude/skills/fkit-status/dashboard.sh`) — the **first executable fkit ships to a consuming project** — placed under `claude/` so `install.sh` copies it and init carries it. It parses the active (or named) sprint plan's Status table and the referenced briefs and produces: one row per task (marker copied verbatim), the roll-up line (non-zero terms, `— of M` = row count), the computed **drift set** (brief in `done/` still `🔲 Backlog`; plan cell ≠ brief `## Status`; `## Sprint` disagreeing with a `➡️ Moved` target), and the four deterministic Next-step shapes.
- **Invoked `bash <path>`, never `./<path>`** — the exec-bit mitigation per ADR-017.
- **Output contract: one run, two delimited sections** — `BOARD` (verbatim) + `FACTS` (narrated from) — so the board and beats 2/6 cannot disagree. `ready`/`after N` **stays LLM-derived** with a sentinel for underived cells; the free-text `Depends on:` line is never guessed by the script.
- **Wired into `SKILL.md` step 4**, replacing the prose description; beats 1–6 and the step-5 delta/`full` behavior left intact. Canonical source `claude/skills/fkit-status/SKILL.md`; `.claude/` copy gitignored.
- **A `node --test` check** at repo root (fixture plan + briefs → expected board), per ADR-017's scope-widening of ADR-014.

## Outcome
**Done** (review rounds 1–6, residuals recorded). Turns the roll-up from a *"counts must sum to M"* instruction the LLM hand-counts — fkit's silent-wrong failure mode with a worked example attached — into a computed invariant. The script *reports* the mover drift (tasks 34/35's subject); it does not fix it. **Note:** task 44 later reverted the sibling `full` switch — see [[tasks/add-full-board-switch-to-fkit-status]] and the one-skill-one-output convention — but task 41's script itself stands.

## Related
- [[tasks/design-deterministic-dashboard-for-fkit-status]] — the design this built against
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] — the ADR governing the shipped executable
- [[tasks/add-full-board-switch-to-fkit-status]] — the sibling `/fkit-status` change (later reverted)
- [[tasks/task-done-flips-brief-own-status-header]] — the mover gap that produces the drift the script surfaces
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[systems/testing-and-verification]]
- [[tasks/record-one-skill-one-output-convention]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/remove-output-variants-from-fkit-status]] — the delta-default removal this script made cheap
