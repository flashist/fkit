# Make launch converge `ai-agents/` additively — "the migration"

**Source**: `ai-agents/tasks/done/converge-ai-agents-additively-on-launch.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 28

## Goal
**This is "the migration" — and it is not a migration mechanism.** It lets an existing project gain scaffold paths it was created too early to have. fkit already converges every project on **every launch** (agents/skills rm+re-copied, `.gitignore` idempotently ensured); `ai-agents/` was the one thing carved out, by an all-or-nothing `[ -e "$dest/ai-agents" ]` guard on the *parent* that skips the entire scaffold copy. So a project scaffolded last month could **never gain a new scaffold path** (`reports/`, `incidents/`, …). The guard did two jobs at once — *don't clobber the user's content* (right) and *don't add anything new* (wrong). **Separating those two jobs was the whole task.** The implementation of [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]].

## Key Changes
Replaced the all-or-nothing guard with a **per-path create-if-absent top-up**:
- Walk the scaffold's `ai-agents/` tree; create any path (dir **and** file) absent from `$dest`; for any path that exists, **do nothing** (not a diff, not a compare). **Stateless** — the scaffold and the disk are the only inputs. No cursor, no manifest, no version *(a "which version is this project at" notion would be the rejected migration mechanism)*.
- **The `.gitkeep` rule:** a `.gitkeep` is created only when its directory is created by the same pass — never re-added to a directory that already existed (which would resurrect it on every launch and dirty `git status`).
- **Announce only when something was created** — the happy path stays completely silent. Mind the `>/dev/null` trap: convergence only fires on already-set-up projects, whose init call is silenced, so the announcement goes to stderr (or the call site changed) — never a naive `echo` to discarded stdout.
- **The opt-out: `ai-agents/.fkit-keep-out`** (owner-decided, resolving OQ4) — a **tracked** file listing paths convergence must never create. It survives a `git clone` (unlike anything under gitignored `.fkit/` — the same trap that killed the version cursor) and records *intent*, not *progress*.

## Outcome
**Done.** **The invariant — owner-ratified, non-negotiable:** *convergence NEVER writes to a path that already exists; create-if-absent only; no overwrite, move, or delete inside `ai-agents/`.* Every safety property is downstream of that one line — and so is its accepted limitation: it **cannot fix content drift** (a file whose *contents* changed already exists, so convergence steps over it, forever — deliberately accepted). A renamed folder gets you both (the old name recreated alongside) — an inherent limit of any stateless mechanism, disclosed in docs. **The highest-risk task of its group** — it changes what fkit does to a user's project on every unattended launch. Inherited hard preconditions: [[tasks/stop-init-failure-bricking-the-launcher]] (26, non-fatal) and [[tasks/refuse-init-on-weird-ai-agents-state]] (27, refuse-on-weird-state) — it must not land before them.

## Related
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the decision this implements
- [[systems/launch-convergence-and-init]] — the init seams this modifies
- [[tasks/design-version-to-version-migration-mechanism]] — the investigation that produced ADR-015
- [[tasks/fix-scaffold-knowledge-base-folders]] — task 25: fixes what *new* projects get; 28 carries it into *existing* ones
- [[tasks/stop-init-failure-bricking-the-launcher]] — task 26, a hard precondition
- [[tasks/refuse-init-on-weird-ai-agents-state]] — task 27, a hard precondition
- [[systems/fkit]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/remove-fkit-omnigent-orphan-residue]] — the destructive sibling deliberately kept out of this additive pass
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] — a new-file delivery this convergence carries to existing projects
