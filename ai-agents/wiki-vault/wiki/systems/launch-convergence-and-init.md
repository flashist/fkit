# Launch Convergence & Init

**Layer**: shared
**Key files**: `claude/fkit-claude-init.sh`, `claude/fkit-claude.sh` (the call site), `claude/scaffold/ai-agents/**`, `claude/scaffold/CLAUDE.md`, `claude/scaffold/AGENTS.md`

## Summary

What fkit writes into a consuming project, and when. **Init runs on every single launch** — not on install, not on `fkit update`. `fkit update` refreshes the **install share** (`~/.local/share/fkit`) and **never writes to a consuming project**; `fkit-claude-init.sh` is the only thing that does.

**fkit therefore already runs a convergence loop against every project, continuously** — better-scheduled than any migration mechanism would be. It re-copies agents and skills by `rm`+`cp` and idempotently ensures `.gitignore` entries. **`ai-agents/` was the one thing carved out of it**, and un-carving it — *additively* — is the design recorded in [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]].

## Architecture

### The seams — and they are genuinely separate

Init has two distinct write surfaces, and confusing them has already killed one design:

| Seam | What it handles | Governed by |
|---|---|---|
| **The `ai-agents/` guard** | the scaffold tree — all-or-nothing on the parent directory | [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] |
| **Step 2 — project-root files** | `CLAUDE.md`, `AGENTS.md` | [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] |

**The rejected `AGENTS-COMMON.md` splice died partly because its stub shipped inside `ai-agents/`** — so it silently depended on the parked convergence work. The brownfield merge lives at the **root** seam and therefore ships independently. *"If anyone tells you otherwise, they are reading the `ai-agents/` guard instead of the root-file guard."*

### The invariant

> **Convergence never writes to a path that already exists.** Create-if-absent only. **No overwrite, no move, no delete — ever — inside a consuming project's `ai-agents/`.**

Owner-ratified. Every "not required" in the safety bar (dry-run, rollback, refuse-on-dirty-tree) is **downstream of it**. Break it and they all become required, and launch-time convergence becomes a **far more dangerous piece of software**.

### The all-or-nothing guard, and why it was wrong

`[ -e "$dest/ai-agents" ]` was doing **two jobs at once**: *"don't clobber the user's content"* (right, essential) and *"don't add anything new"* (wrong, never intended). **The guard was at the wrong granularity** — which is why an existing project could **never** acquire a new scaffold folder. Separating the two jobs is most of the fix, **and it is not a migration mechanism.**

### The symlink lesson — `[ -L ]` first, always

**This is the whole trick, and it has now bitten at two separate seams.** `[ -e ]` and `[ -d ]` **dereference symlinks**, so they will lie to you. `[ -L ]` is the one test that does not, and it must come **first**.

Three real states init handles wrongly without the gate ([[tasks/refuse-init-on-weird-ai-agents-state]]):

| State | Behavior |
|---|---|
| **Dangling symlink** | `[ -e ]` false → `cp -R` **refuses** (rc=1) → `set -euo pipefail` kills init → **bricked launcher**. A **denial-of-service** bug. |
| **Live symlink** | `[ -e ]` true → init skips, so **unreachable today**. But `cp -R` genuinely **does** write through — and **per-path convergence is exactly what arms it.** *Prospective.* |
| **A file where the directory belongs** | `[ -e ]` true → init skips **silently, forever**. The project is broken and fkit never says so. |

**The same lesson applies at the root-file seam** — a symlinked `CLAUDE.md` gets its own `[ -L ]` gate ([[tasks/merge-fkit-rules-block-into-existing-root-context-files]]).

### Setup is best-effort; the session is not

Init runs under `set -euo pipefail` and was called **unguarded** from a launcher itself under `set -eu` — so **any** init failure (a permissions problem, a read-only checkout, ENOSPC, one failed `cp`) **took the user's entire team offline** ([[tasks/stop-init-failure-bricking-the-launcher]]). The rule now: **warn loudly on stderr and continue into the session.** A user must always be able to reach their team, even when fkit cannot finish setting the project up.

**Fix at the boundary, not by making init sloppy** — init failing fast internally is correct; the bug was that its failure was *fatal to the caller*.

### The fkit-managed block — writing into a file the user already owned

```
<!-- fkit:begin-rules -->
… fkit-managed content …
<!-- fkit:end-rules -->
```

- **Everything outside the markers is the owner's, and is never touched. Ever.** *That is what earns the right to write into a file the user already had.*
- **Everything inside is fkit's**, replaced wholesale on every launch — and **the block's first line says so, in the file, to the human reading it.**
- **⚠️ Idempotency is load-bearing:** init runs on **every launch**, so a merge that appended would grow the user's `CLAUDE.md` **without bound, one block per launch**. Replace **in place**, not delete-and-append — *a merge that relocates the block to EOF on every run is also a mutation of the user's file, just a slower one.*
- **Malformed states refuse, they do not guess.** An unmatched begin marker is **unknowable** at its end, and the wrong guess deletes the user's prose.
- **Silence when nothing changed.** A "rewrote CLAUDE.md" line on every launch **trains the user to ignore init's output — which is the output a real refusal has to get through.**

## Gotchas / Known Issues

- **Content drift is unfixable by design, and has already occurred.** The invariant is precisely what forbids fixing it: `ai-agents/README.md` **exists**, so convergence steps over it forever. **The safety and the limitation are the same property.** *(The correct fix — a shipped content-identity hash manifest, keyed on **what the file is**, not which version you came from — is recorded as deferred, not rejected. Its trigger: **a third** fkit-authored file starts drifting. Two have.)*
- **A renamed folder gets you both.** Rename `sprints/` → `iterations/` and convergence recreates `sprints/` alongside it. **No stateless mechanism can know a rename happened** — an inherent limit that must be **disclosed in the docs, not discovered by a user.**
- **`.fkit/` is gitignored — so nothing durable can be stored there.** This killed the version cursor (*it cannot survive a `git clone`*), and it is why the convergence opt-out is a **tracked** `ai-agents/.fkit-keep-out` instead. **A cursor is cheap to write and impossible to keep correct.**
- **`.gitkeep` accounting matters.** The scaffold carries **10**; naive create-if-absent resurrects them into populated directories and **dirties `git status` on every launch**. A `.gitkeep` is written **only when its directory is created**.
- **The read-side symlink hazard is open and latent.** Writes through a symlinked `ai-agents/` are gated; **reads are not.** Nothing reads through it today — the one design that would have (the rejected splice) is dead. Tracked unsprinted.
- **`exit 3` ("I refused `ai-agents/`, but setup succeeded") is treated as success by the launcher** — correct for today's init, **a trap for any future step that assumes `ai-agents/` was readable.**
- **The `.claude/` copies are gitignored and regenerated every launch** — **edit `claude/`, never `.claude/`.**
- ⚠️ **The scaffold's `ai-agents/README.md` names sprint plans `plan-sprint-N.md`; the shipped skills write `sprint-N.md`.** The **scaffold is wrong and every new project got it**; fixed in the scaffold by [[tasks/fix-scaffold-knowledge-base-folders]], but **existing projects keep the wrong copy** — the accepted residual above.

## Related
- [[tasks/converge-ai-agents-additively-on-launch]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[tasks/design-version-to-version-migration-mechanism]]
- [[tasks/fix-scaffold-knowledge-base-folders]]
- [[tasks/stop-init-failure-bricking-the-launcher]]
- [[tasks/refuse-init-on-weird-ai-agents-state]]
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]]
- [[tasks/give-codex-the-universal-hard-rules]]
- [[tasks/fix-headless-menu-guard-crash]]
- [[systems/install-and-self-update]]
- [[systems/knowledge-base-structure]]
- [[systems/fkit]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-shared-instructions-layer-for-all-agents]]
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]]
