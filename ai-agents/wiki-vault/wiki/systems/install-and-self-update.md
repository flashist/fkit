# Install, Launcher & Self-Update

**Layer**: shared
**Key files**: `install.sh`, `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, `bin/release.mjs`, `VERSION`, `package.json`

## Summary
How fkit gets onto a machine and stays current. `curl … install.sh | sh` installs **only `claude/`** into `~/.local/share/fkit/` plus a thin `~/.local/bin/fkit` launcher. Running `fkit` in any project scaffolds that project, runs preflight, and execs a role-locked Claude Code session.

**fkit opens no ports, exposes no API, and stores no data outside the project's own files.** Every network call is optional, time-boxed to 5 s, and silent on failure — offline `fkit` must cost nothing and print nothing.

## Architecture

### Install
Fetch the tarball → **sanity-gate the fetch** on `claude/fkit-claude.sh`, the one file the installer cannot work without → copy **only `claude/`** into `~/.local/share/fkit/` → `rm -rf "$SHARE/omnigent"`, which is what makes an upgrade from an older fkit clean rather than leaving a dead runtime on disk → write `.version` → generate `~/.local/bin/fkit`.

That generated launcher is a **direct `exec`** of `$SHARE/claude/fkit-claude.sh` — there is no flavor dispatch, and `update` is **not** intercepted; it falls through to the launcher, which owns self-update.

**Four retired verbs fail loudly** rather than being passed through to `claude` as a stray argument: `omnigent`, `claude`, `reconnect`, `restart-team`. They were all real commands once; `reconnect` / `restart-team` existed *only* to paper over Omnigent orchestration failures.

### The launcher (`fkit`)
```
fkit                                  (run in any project directory)
   ├─ self-host re-exec into ./claude/fkit-claude.sh if this IS an fkit checkout
   ├─ `fkit update` → re-run install.sh
   ├─ else: throttled update CHECK → prints "run fkit update" (never auto-execs)
   ├─ fkit-claude-init.sh <proj>  (idempotent: scaffold, .claude/ refresh, intake)
   ├─ preflight:  claude REQUIRED (exit 127)  ·  codex required-but-WARNED
   ├─ fresh project? → skip the menu, seed the PRODUCER into /fkit-initiate-project
   ├─ deterministic role MENU (1-7 — an if/else; no LLM in the routing)
   └─ exec claude --agent fkit-<role> --settings .fkit/settings/<role>.json
```

**Claude Code is a hard requirement** — the launcher exits **127** without it. **Codex is required but warned, never walled** (owner ruling): a Codex outage must not lock the owner out of their own team.

### Fresh-project onboarding
Init scaffolds `ai-agents/` + `CLAUDE.md` + `AGENTS.md`, **never clobbering** an existing one → `.fkit/interview` asks 6 questions **on the terminal, before any LLM starts**, writing `.fkit/intake.md` (tty-safe; skips cleanly when headless) → the launcher detects the uninitialized `PROJECT.md`, **skips the menu**, and seeds the producer straight into `/fkit-initiate-project` → the producer interviews the owner, **spawns the architect to run `fkit-survey-project`**, and writes `PROJECT.md`.

### Self-update — two paths, and the split is the design
- **`fkit update`** — an **explicit verb**. Re-runs the canonical `install.sh` for `$repo@$ref`. Refuses to run in a source checkout ("update it with `git pull`").
- **the automatic check** — throttled (60 min default), **time-boxed to 5 s**, silent when current and silent when offline, and it **only ever prints**: `↑ fkit vX → vY is available. Run: fkit update`.

**It never auto-updates and never re-execs itself** — deliberately unlike the Omnigent launcher it replaces, which had no timeout and no `GIT_TERMINAL_PROMPT` guard (a credential-prompting repo would hang the launcher indefinitely). Source checkouts are excluded entirely.

### Release
`npm run release` → `bin/release.mjs`: bump `VERSION` + `package.json` (patch by default), `git add -A`, commit, push, annotated tag `v<version>`, push the tag. **No npm-registry publish.**

**Version bumping is load-bearing** — self-update compares the installed sha against the remote head and reports the version from `VERSION`. This is precisely why [[decisions/adr-001-package-json-stays-metadata-only]]'s "stop bumping the version" instruction had to be superseded: following it would have broken self-update.

## Gotchas / Known Issues
- **`install.sh` is the blast radius of the whole product.** A bad landing breaks installation *including the self-update path that would ship the fix*. It **cannot be verified by reading a diff** — it must be installed from a ref into a clean `$HOME`.
- **`install.sh` still has zero automated coverage** — and it is the `curl | sh` entry point. `claude/fkit-claude.sh` **is now covered** (argv contract + the `skillOverrides` matrix) by the launcher-contract suite — see [[systems/testing-and-verification]]. *(Updated 2026-07-16: the risk is **reduced, not closed**. `architecture.md` §9.1 still says both files have "no coverage of any kind" — **the doc is behind the code**.)*
- **`fkit --resume` is gone** — the blanket unrecognized-arg passthrough that silently resumed *any* session under the **lead's** lockdown was removed by [[tasks/remove-fkit-resume-passthrough]], and the removal is now **pinned by a test**. A stray arg with no named role is a **usage error**; the *no-args, no-tty → lead* default survives.
- **`GIT_TERMINAL_PROMPT=0`** on the update check exists so a credential-prompting remote can never hang the launcher.
- **Idempotence**: both the installer and the per-project init are safe to re-run. ⚠️ **"Init never clobbers an existing `CLAUDE.md`/`AGENTS.md`" is no longer the whole story** — it now **merges an fkit-managed, marker-delimited block** into them (everything outside the markers is untouched forever), which is what finally gave **brownfield** projects the universal hard rules. `ai-agents/` is still left as-is: **per-path additive convergence is designed and approved but NOT yet shipped** (Sprint 2 task 28, backlog). See [[systems/launch-convergence-and-init]].
- **An init failure no longer bricks the launcher.** It used to: init runs under `set -euo pipefail` and was called unguarded, so any failure took the user's whole team offline. **Setup is best-effort; the session is not** ([[tasks/stop-init-failure-bricking-the-launcher]]).
- **The agent count is still a hard-coded literal, not derived.** `fkit-claude-init.sh` prints `Seven roles` as a `printf` string, while the line that actually *counts* the copied agents (`n_agents`) is separate. **The two can drift apart again silently** — they have before. *(Re-verified 2026-07-16: the string reads "Seven" and is correct, and the stale `fkit claude` usage comment is gone. `architecture.md` §9.5 still lists both as open drift — **the doc is behind the code**.)*
- **The exec bit does not survive install for anything but two hardcoded filenames.** Any *other* shipped script rides a tarball + `cp -R` chain that does not guarantee the bit — an **umask-dependent break that reproduces on nobody's dev machine**. Hence [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]: shipped skill executables are invoked `bash <path>`, **never `./<path>`**, and the installer is not touched.

## Related
- [[systems/fkit]]
- [[systems/role-locked-sessions]]
- [[systems/launch-convergence-and-init]]
- [[systems/testing-and-verification]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[tasks/remove-fkit-resume-passthrough]]
- [[tasks/stop-init-failure-bricking-the-launcher]]
- [[tasks/fix-headless-menu-guard-crash]]
- [[tasks/design-version-to-version-migration-mechanism]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]]
- [[decisions/adr-001-package-json-stays-metadata-only]]
- [[tasks/build-claude-self-update]]
- [[tasks/rewrite-installer-single-flavor]]
- [[tasks/extract-scaffold-into-claude]]
- [[tasks/verify-onboarding-flow-end-to-end]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/extend-initiate-project-fill-overview]]
- [[tasks/fix-agent-count-doc-drift-and-fresh-detection-dup]]
- [[tasks/make-codex-a-checked-prerequisite]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/wiki-sync-post-omnigent]]
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]]
