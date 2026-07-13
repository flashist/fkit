# Extend `initiate-project` to fill the CLAUDE.md / AGENTS.md Project Overview

**Source**: `ai-agents/tasks/done/extend-initiate-project-fill-overview.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 13 (carried from Sprint 1)

## Goal
Close the placeholder gap **at its source** — the skill — instead of one-off fixing it again.

## Key Changes
[[tasks/fix-claude-agents-md-placeholder-text]] fixed, **as a one-off**, the fact that root `CLAUDE.md`/`AGENTS.md` still carried raw scaffold "fill in" placeholder text even though the project had been initiated and `PROJECT.md` was fully written.

**The root cause it identified was still live:** `initiate-project`'s Step 4 **writes `PROJECT.md` but never revisits `CLAUDE.md`/`AGENTS.md`** — so nothing ever fills their placeholders in.

> **Every new fkit project run through `initiate-project` would hit the exact same gap the moment initiation completed.**

This closes the Project-Overview half **in the skill itself**; the Architecture half is [[tasks/bake-architecture-pointer-into-scaffold-templates]].

## Outcome
Done. Initiation now writes the Project Overview into `CLAUDE.md`/`AGENTS.md` as well as `PROJECT.md`.

**The pattern is worth keeping:** the one-off fix was correct *and insufficient* — it repaired **this** repo's symptom while leaving **every future fkit project** to reproduce it. *The one-off named the root cause; this task paid it off.*

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/fix-claude-agents-md-placeholder-text]]
- [[tasks/bake-architecture-pointer-into-scaffold-templates]]
- [[systems/install-and-self-update]]
