# Refuse to run init against a weird `ai-agents/` — symlink, file-where-dir, unreadable

**Source**: `ai-agents/tasks/done/refuse-init-on-weird-ai-agents-state.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 27

## Goal
Add a preflight gate on `$dest/ai-agents` that **refuses loudly on any state init does not understand** — *before* additive convergence gives one of those states a way to write outside the project.

## Key Changes

**`[ -e ]` and `[ -d ]` dereference symlinks**, which gave init three states it handled wrongly:

| State | What happened |
|---|---|
| **Dangling symlink** | `[ -e ]` false → `cp -R` **refuses** (rc=1) → `set -euo pipefail` kills init → **bricked launcher**. A live **DoS** bug. |
| **Live symlink** | `[ -e ]` true → init skips, so **unreachable today**. But `cp -R` **does** write through — and **convergence is what arms it.** *Prospective.* |
| **File where the directory belongs** | `[ -e ]` true → init skips **silently, forever**. The project is broken and fkit never says so. **Live.** |

- **The gate:** `[ -L ]` **first** — the one test that does **not** dereference — then not-a-directory, then unreadable. **`[ -L ]` first is the whole trick:** *the bug exists precisely because the obvious tests dereference. Any fix that reaches for them before `-L` reintroduces it.*
- **On refusal:** name the path and the state, **skip the `ai-agents/` step**, and **carry on with the rest of init**. *A weird `ai-agents/` must not cost the user their agents — or their session.*
- **Refusal is not an error the user must fix to launch.** It is a loud, repeated, honest *"I did not touch this, and here is why"* — stated explicitly so a user with a deliberate symlink setup knows nothing is broken.
- **Shipped before convergence, not inside it** — *so the hazard and its mitigation don't ship in the same commit, where a reviewer cannot tell them apart.*

### ⚠️ The brief shipped on a wrong premise — corrected
It asserted **as established fact** that a *dangling* symlink makes `cp -R` write the scaffold **outside the project**. **False on every platform tested.** The coder could not reproduce it on macOS/BSD (refuses, rc=1); the reviewer settled Linux in a Debian container — **GNU coreutils 9.1 refuses too**, and **BusyBox refuses**; Codex confirmed from the GNU manual that the write-through occurs only under `POSIXLY_CORRECT`.

**No live write-outside-the-project bug ever shipped.** The claim entered via the migration report, was carried into this brief **without independent verification**, and was caught only at **implementation and review** — the second false claim from that report's lineage. **The lesson is the cheap one:** *a behavioral claim about a shell builtin or coreutil is a claim to run, not to reason about* — and *a brief that says "confirm the bug is real" before anyone has is a brief that has already assumed its answer.*

## Outcome
**Done. The task itself was unaffected and stood** — implemented, verified, correct; **only its stated rationale was wrong**, and the false one was **removed rather than quietly softened**.

The correction propagated to the sprint plan and to [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]], which **amended in place** — the ground actually got *stronger*: **the gate is not remediation of an existing bug, it is a precondition of the change the ADR approves.**

**Its lesson generalized to a second seam:** the brownfield merge gates a symlinked `CLAUDE.md` with `[ -L ]` for exactly this reason. **The read-side counterpart remains open and latent.**

## Related
- [[tasks/converge-ai-agents-additively-on-launch]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — records the unclosed read-side hazard
- [[tasks/stop-init-failure-bricking-the-launcher]] — the sibling precondition
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]] — the same `[ -L ]` lesson, second seam
- [[tasks/design-version-to-version-migration-mechanism]]
- [[systems/launch-convergence-and-init]]
- [[tasks/sprint-2-remove-omnigent]]
