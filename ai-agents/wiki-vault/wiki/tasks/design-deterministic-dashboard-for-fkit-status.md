# Design the deterministic dashboard generator for `/fkit-status`

**Source**: `ai-agents/tasks/done/design-deterministic-dashboard-for-fkit-status.md`
**Status**: done
**Sprint/Tag**: Unsprinted — design-first

## Goal
The owner wants a **deterministic layer** for `/fkit-status`: a script that renders the step-4 dashboard, replacing the **prose dashboard-description** the producer LLM follows to hand-build a table plus a roll-up. Beats 1–6 stay LLM-driven.

**The skill's own text spends a whole block worrying that a human miscounts rows or fails to sum to `M` — the exact silent-wrong failure a script eliminates.**

## Key Changes

**A design-first task because the scope had real, owner-facing unknowns.** *"Do not write the script here — decide its shape."*

**The feasibility split the architect established:**
- **(a) Status / # / Task / Filename per row — fully deterministic.** A straight parse of the sprint plan's markdown table. *"Render the plan marker verbatim" **is** "copy the cell."*
- **(b) Roll-up counts — fully deterministic, and the strongest case for scripting.** **A script makes the "counts must sum to M" failure impossible.**
- **(c) Drift *facts* — deterministic; disposition stays LLM.** Plan cell, brief `## Status` marker, and brief location are all mechanical.
- **(d) Next step — four of six shapes are deterministic; `ready` vs `after N` is NOT.** It depends on the **free-text `Depends on:` line**, which names dependencies inconsistently — by number, phase name, filename slug, qualified `hard`/`soft`. **And it is the one column the skill already flags as "the easiest place to start making things up."**

**The structural consequence designed around:** (c) and the terminal (d) shapes feed **beat 6 and the roll-up clause**, not just the board — so **if the script computes drift and the LLM independently re-derives it, they can disagree.** The clean design is **the script as the single source of the mechanical facts** — *which is more than "replace the prose board paragraph."*

**Six decisions settled with the owner present:** output contract, the Next-step boundary, runtime, placement, ADR-or-not, and test approach.

## Outcome
**Done.** Produced `reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md` → **[[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]**, which generalizes the one-off into a rule for **every** future shipped skill executable.

**Runtime: bash** — *fkit's entire product surface is bash, the parse is line-oriented markdown (no JSON assertion, unlike the `skillOverrides` map that won node for the test suite), and bash adds **zero** new PATH assumption on a consumer machine.* **ADR-014's `node --test` precedent is for repo-root infra that cannot ship to consumers — the opposite calculus.**

**Scope boundary held: the `Depends on:` format was not touched.** Constraining it to be machine-parseable is a separate, larger convention change touching every brief, `/fkit-task-plan`, and both movers. **The recommendation was: not now.**

**Implementation is still backlog** — `build-deterministic-dashboard-script-for-fkit-status`. Verified 2026-07-16: `claude/skills/fkit-status/` contains **only `SKILL.md`**; `dashboard.sh` does not exist yet.

⚠️ The brief's own `## Status` header still reads `🔲 Backlog` though it sits in `done/` — mover drift.

## Related
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] — the decision it produced
- [[decisions/adr-014-how-fkit-tests-itself]] — the fence it widens, and the precedent that does **not** apply
- [[tasks/add-full-board-switch-to-fkit-status]] — the sibling `/fkit-status` change
- [[tasks/add-status-skill-to-producer]] — the skill being made deterministic
- [[systems/testing-and-verification]]
- [[systems/knowledge-base-structure]]
- [[tasks/sprint-2-remove-omnigent]]
