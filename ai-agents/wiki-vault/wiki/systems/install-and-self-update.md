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
- **`install.sh` and `claude/fkit-claude.sh` have zero automated coverage.** Both are POSIX shell. `build_settings()` generates **the skill lockdown itself** — a silent regression there would degrade the one boundary that is genuinely structural, and nothing would catch it.
- **`fkit --resume` passes through to `claude` under the lead's lockdown** — see [[systems/fkit]].
- **`GIT_TERMINAL_PROMPT=0`** on the update check exists so a credential-prompting remote can never hang the launcher.
- **Idempotence**: both the installer and the per-project init are safe to re-run; init never clobbers an existing `ai-agents/`, `CLAUDE.md`, or `AGENTS.md`.
- **The agent count is still a hard-coded literal, not derived.** `fkit-claude-init.sh:144` prints `Seven roles` as a `printf` string, while the line that actually *counts* the copied agents (`n_agents`, `:54`) is separate. **The two can drift apart again silently** — they have before. *(Verified 2026-07-13: the string currently reads "Seven" and is correct, and the stale `fkit claude` usage comment is gone. `architecture.md` §9.6 still lists both as open drift — **the doc is behind the code**.)*

## Related
- [[systems/fkit]]
- [[systems/role-locked-sessions]]
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
