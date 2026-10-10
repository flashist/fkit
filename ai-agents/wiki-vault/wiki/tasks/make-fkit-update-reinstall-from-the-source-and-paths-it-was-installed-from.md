# Make `fkit update` reinstall from the source and paths it was installed from

**Source**: `ai-agents/tasks/done/0481-make-fkit-update-reinstall-from-the-source-and-paths-it-was-installed-from/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P4` · task `0481` · owner `fkit-coder`

## Goal
Owner ruling 2026-10-02 (selected option): *"README fix + bug task — README says keep them exported; producer
files a task to fix the launcher bug properly."* The README workaround landed with `0478`; this is the proper fix.

**The bug** (reviewer finding R3 on `0478`): `_fkit_reinstall` in `claude/fkit-claude.sh` wrote
`FKIT_REPO=… FKIT_REF=… curl -fsSL …/install.sh | sh`. ⛔ **A variable set in front of a command reaches only
that command** — `curl`, not the `sh` across the pipe (reviewer measured: `A=1 true | sh -c 'echo ${A:-unset}'`
prints `unset`). So the downloaded installer ran with its defaults and **silently reinstalled
`flashist/fkit@main`**, while the launcher printed *"updating from <your repo>@<your ref>"*. **Worse for custom
paths:** `FKIT_SHARE` / `FKIT_BIN` were not passed at all, so a custom-path install was "updated" into the
**default** dirs — a second install — while the one the user runs stayed old. The launcher already knew its
repo/ref and share root; it did **not** know the bin dir (`.version` had no `bin=`).

## Key Changes
- `fkit update` now runs the installer **with** the recorded source and paths; precedence unchanged — an env
  value for this run wins, then `.version`, then the default.
- **`install.sh` records `bin=` in `.version`** (`version`/`sha`/`repo`/`ref`/`bin`), so the next update keeps it.
- **Hard rule from the brief — never silently install to a different place than before.** Per
  `architecture.md` as updated: the update refuses in a source checkout (unchanged) and, with no `FKIT_SHARE`
  given, when the launcher's own root is not an install (reached through a symlink or a copy); an explicit
  `FKIT_SHARE` that already holds an install supplies **that** install's recorded repo/ref/bin; env values still
  win field by field.
- Tests on a **sealed PATH** (stub `curl` returning a fake `install.sh` that captures what it received; no
  network): `test/update-reinstall.test.js`, plus a prove-red mutation that removes the `FKIT_REPO` hand-off.
- README sentence from `0478` (*"keep custom paths exported"*) replaced with the true behaviour.

## Outcome
- Final independent re-verify (2026-10-05, verify-only): `update-reinstall` + `update-banner` +
  `launcher-contract` **73/73**; `test:docs` 370 pass, 2 skipped (no `.git` in the copy — expected, not a pass);
  the mutation reds the named cases; every re-derived citation lands. ⚠️ The real `fkit update` against the real
  HOME was **never** run, by rule. Full `npm test` not re-run at re-verify (the driver's call; an earlier full run
  was on byte-identical files).
- `CHANGELOG.md`'s `## Unreleased` carries a `fkit update` entry and an upgrade note.

## Related
- [[tasks/sprint-10-the-0472-0482-batch]] — `P4`, "a real user-facing bug"
- [[tasks/overhaul-the-readme-for-first-time-visitors]] — `0478`, whose review found it and whose README sentence this replaced
- [[systems/install-and-self-update]] — the self-update split this corrects
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — §3: the launcher owns self-update
- [[tasks/build-claude-self-update]] — where the self-update path was built
- [[tasks/keep-changelog-md-up-to-date-at-every-release]] — `0479`, the changelog its entry lives in
