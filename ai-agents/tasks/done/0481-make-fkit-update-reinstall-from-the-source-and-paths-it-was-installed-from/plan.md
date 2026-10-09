# Plan — 0481: make `fkit update` reinstall from the source and paths it was installed from

Planned by a spawned fkit-coder (plan-only, no files written), against the working tree as it stood on 2026-10-05 (0477/0480/0482 changes uncommitted, including `test/prove-red.sh` and `CONTRIBUTING.md`).

## Summary
- **Bug confirmed by running it** (scratch install root, sealed PATH, stub `curl` that serves a fake `install.sh`): with `repo=me/fork`, `ref=dev` in `.version` and no `FKIT_*` exported, the launcher prints `updating from me/fork@dev` and the installer gets `FKIT_REPO`, `FKIT_REF`, `FKIT_SHARE` and `FKIT_BIN` all **unset**, so it falls back to its defaults.
- **A second bug in the same function, also measured:** if the download fails (stub `curl` exits 22), `fkit update` still prints `now at v<old>` and exits 0. A failed `curl` hands `sh` an empty script, and the pipe reports `sh`'s exit status, which is 0. Step 1b fixes this, **beyond the brief** (see Open questions).
- **Fix:** hand the four values to the `sh` that runs the installer, not to `curl`. Learn the bin dir from a new `bin=` line in `.version`, which `install.sh` now writes.
- **Prototype checked under both `/bin/sh` (bash) and `dash`** (scratch only, then deleted): `.version` with `bin=` passes all four values; an old `.version` with no `bin=` uses the default bin only when the default `fkit` wrapper provably runs this install, and otherwise refuses with one line.
- **Brief question (c) answered:** `.version` has no reader except the launcher's `_fkit_verfield` (it reads by key, so an extra line is harmless). `/fkit-heal`'s structure-spec and manifest, `bin/release.mjs` and the banner never parse it. The only change needed elsewhere is docs (step 7).

## Design decisions (the brief asked the plan to settle these; the owner confirms them by approving this plan)
**(a) How the launcher learns the bin dir:** `install.sh` writes `bin=<absolute bin dir>` into `.version`, and the launcher reads it with `_fkit_verfield bin`.
- Rejected: the `fkit` wrapper passing its own directory in an env var. That variable would leak into every claude session, would be missing when someone runs the launcher directly, and would put a second record next to the `.version` that already exists.
- No `share=` line is added. The launcher already knows its share (`$share`, from where the script lives), so a recorded share would be data nothing reads.

**(b) An install whose `.version` has no `bin=`:**
- Use `$HOME/.local/bin` only if `$HOME/.local/bin/fkit` exists **and** its `exec "<dir>/claude/fkit-claude.sh" "$@"` line points at this install. "Points at" is checked by comparing `cd <dir> && pwd -P` with `cd "$share" && pwd -P`.
- Otherwise print one line to stderr and exit 1 **before** any download: `fkit: cannot tell where your fkit command is installed; run:  FKIT_BIN=<its directory> fkit update`
- The installer never runs on a guess.

**Order of precedence (unchanged in spirit):**
- Repo and ref: env → `.version` → default. This is today's code at the `fkit_repo=` / `fkit_ref=` lines, left alone.
- Share: env `FKIT_SHARE` → the launcher's own `$share`.
- Bin: env `FKIT_BIN` → `.version` `bin=` → the proven default → refuse.
- An empty env value counts as unset (`${VAR:-…}`), the same as `install.sh` treats it.

**Honest limit (goes in the CHANGELOG, step 6):** the fix cannot reach an install through that install's own `fkit update`.
- The first update after this ships still runs the **old** launcher. That run passes nothing to the new `install.sh`, so a custom-path or fork install, with nothing exported, is "updated" one last time into the defaults: `flashist/fkit@main`, `~/.local/share/fkit`, `~/.local/bin`.
- Those users must reinstall once by hand, with the variables after the pipe. From then on `.version` remembers.
- Default installs are unaffected.

## Steps

### 1. Launcher — `claude/fkit-claude.sh`
**1a. Pass the values to the installer.**
- In `_fkit_reinstall`, drop the `FKIT_REPO=… FKIT_REF=… curl … | sh` form.
- Run the script as `… | FKIT_REPO="$fkit_repo" FKIT_REF="$fkit_ref" FKIT_SHARE="$fkit_share" FKIT_BIN="$fkit_bin" sh`.
- Comment in place: why the assignments go **after** the pipe, citing the measured rule (`A=1 true | sh -c 'echo ${A:-unset}'` prints `unset`).

**1b. (Beyond the brief — strike if the owner declines, Open question 2.)** Download first, then run:
- `_fkit_script="$(curl -fsSL "<raw …/install.sh URL>")" && [ -n "$_fkit_script" ] || { echo "fkit: could not download install.sh from $fkit_repo@$fkit_ref" >&2; return 1; }`
- then `printf '%s\n' "$_fkit_script" | FKIT_…=… sh`.
- Effects: a failed or empty download makes the existing `fkit: update failed.` path fire instead of a false `now at`, and a truncated download is never half-run.

**1c. Two small helpers next to `_fkit_reinstall`:**
- `_fkit_wrapper_share <bin-dir>`: if `<bin-dir>/fkit` exists, print the `<dir>` from its `exec "<dir>/claude/fkit-claude.sh" "$@"` line (sed, first match); otherwise print nothing.
- `_fkit_same_dir <a> <b>`: true if both are directories with the same `pwd -P`.

**1d. Resolve `fkit_share` and `fkit_bin` inside the `update|--update|…` arm, AFTER the source-checkout refusal** (a checkout must still say "update it with 'git pull'" first), and before the `updating from` printf. Logic as in design (b). Doing this only inside the arm means a normal launch pays nothing for it.

**1e. After a successful reinstall, set `share="$fkit_share"` before the `now at` printf and the `.latest` / `.update-check` cleanup.** If an env `FKIT_SHARE` moved the install, these must read and clean the copy that was just written.

**1f. Leave alone:** the `updating from %s@%s` text (the installer already prints both paths), the repo/ref resolution lines, and the automatic check.
- The `GIT_TERMINAL_PROMPT=0 GIT_HTTP_LOW_SPEED_* git ls-remote … | awk` prefix is **correct as written**: the variables are meant for `git`, the first command. Record that in the worklog's step-3 audit; no code change.

### 2. Installer — `install.sh`
**2a. Make BIN absolute.** Just before the `.version` block, add `mkdir -p "$BIN"` and `BIN="$(cd "$BIN" && pwd)"`, with a comment. A relative `FKIT_BIN` recorded as-is would make a later update install relative to wherever it is run from, which is exactly the "different place" the brief forbids.
- The later `mkdir -p "$BIN"` becomes a harmless no-op.
- Side effect, and an improvement: the PATH check and the `✓ Installed` line use the normalized path, so a trailing slash no longer gives a false "not on your PATH".

**2b.** In the `.version` block, add `printf 'bin=%s\n' "$BIN"` after the `ref=` line.

**2c. Fix the wrapper's "install looks broken — Reinstall:" hint.** It has the same bug, measured by reading the code: the URL uses `$REPO/$REF`, but `| sh` runs with the defaults and drops SHARE and BIN.
- New hint: `curl -fsSL https://raw.githubusercontent.com/$REPO/$REF/install.sh | FKIT_REPO=$REPO FKIT_REF=$REF FKIT_SHARE='$SHARE' FKIT_BIN='$BIN' sh`. The values are expanded when the wrapper is generated; the paths are single-quoted.
- Known limit, noted in a comment and not fixed: a path containing `'` would break the printed command. A path containing `"` or `$` already breaks the wrapper's own `exec` line today.

**2d. Header comment** (the "`fkit update` reinstalls now (re-running this script)" sentence): reword to say it re-runs with the source and paths recorded in `.version`. Keep the same number of lines so the header does not shift what follows.

**2e. Step-3 audit, all checked, no other changes needed:**
- `curl … | sh` in `README.md` (install line), `claude/README.md` (install line) and `install.sh`'s own header: default install, correct.
- `RELEASING.md`'s `| FKIT_REF=v0.2.1 sh`: already after the pipe, correct.
- No other pipe into `sh` with a prefix in the launcher or installer.

### 3. Tests — new `test/update-reinstall.test.js` (node:test, zero deps, ADR-014)
**Fixture.** The file owns its fixture, like `update-banner.test.js`, for the same forced reasons: it must not inherit `FKIT_NO_UPDATE_CHECK`, and its install root must not be a source checkout.
- It copies the sealed-PATH helpers (`sealedBin`, `stub`, `assertUnreachable`, `assertReachable`), with a pointer comment to the banner file. That file is not refactored.
- Tree seam: `FKIT_REINSTALL_ROOT` (the `FKIT_BANNER_ROOT` pattern), with a loud stderr note when it is non-default.
- Env is built from nothing: `process.env` is not spread, and no `FKIT_*` is set unless the case sets it.
- Sealed tools: `dirname sed head cut tr find awk cat printf rm sh`. The e2e case adds `tar gzip mktemp mkdir cp chmod` (GNU tar on CI's ubuntu runs `gzip` for `-z`).
- `git` is absent in every case, and that is proven with `assertUnreachable`.

**Stub `curl`:**
- Logs its argv (the positive half of the seal proof).
- For `…/install.sh` it serves a **fake installer**. The fake writes `REPO= REF= SHARE= BIN=` exactly as received (`${FKIT_X-<unset>}`) to `$FKIT_TEST_CAPTURE`, then writes a valid `.version` (`version=9.9.10`, a synthetic sha) into the `FKIT_SHARE` it got, if it got one.
- For the codeload tarball URL (e2e only) it serves a `tar.gz` that the test process built with the real `tar`, from `CLAUDE_TREE` plus a synthetic `VERSION`.
- Every other URL fails.

**Fixture values:** fake repo names only (e.g. `fkit-test/no-such-repo-0481`) and synthetic versions; never the repo's `VERSION`.

**Cases** (the names are prove-red anchors):
1. `0481/version-only`: `.version` has a fake repo, `ref=dev` and `bin=<temp dir>`; nothing exported. The installer gets exactly those repo/ref values, and curl was asked for `<fake-repo>/dev/install.sh`. **This is the case that fails before the fix; record its red in the worklog.**
2. `0481/custom-paths`: the install root is a temp dir **not** under HOME, and `bin=` points at another temp dir; nothing exported. The installer gets exactly that share and bin, and nothing is created under `$HOME/.local`.
3. `0481/env-wins`: `.version` holds one set of values; `FKIT_REPO`, `FKIT_REF`, `FKIT_SHARE` and `FKIT_BIN` given on the run hold another. The installer gets the env values, curl's URL uses the env repo/ref, and the `now at` line reads the `.version` in the **env** share (step 1e).
4. `0481/default`: the install root is `$HOME/.local/share/fkit`, `.version` has no repo/ref and has `bin=$HOME/.local/bin`. The installer gets `flashist/fkit`, `main` and the two default paths. Safe because of the seal; curl's log proves our stub answered.
5. `0481/old-version-proven-default`: no `bin=`; `$HOME/.local/bin/fkit` is a wrapper whose exec line points at this root (written with a trailing slash, to exercise `pwd -P`). Proceeds with the default bin.
6. `0481/old-version-unknown-bin`: no `bin=` and no default wrapper. Exit 1, exactly one stderr line containing `FKIT_BIN=`, **no** capture file, and curl **never called**.
7. `0481/old-version-foreign-wrapper`: no `bin=`; the default wrapper points at a different share. Same refusal as case 6.
8. `0481/install-sh-records` (automates the brief's verification 3):
   - Run the repo's real `install.sh` with `FKIT_REPO`, `FKIT_REF`, `FKIT_SHARE` and `FKIT_BIN` set **on its env only** (custom temp dirs), against the stub tarball.
   - Assert `.version` has the `repo=`, `ref=` and an absolute `bin=`, and the wrapper exists in the custom bin.
   - Then run `<custom bin>/fkit update` with **no** `FKIT_*` set. Assert the fake installer gets all four custom values and that `$HOME/.local/share/fkit` and `$HOME/.local/bin` do not exist.
9. `0481/reinstall-hint`: from the case-8 install, delete `<share>/claude/fkit-claude.sh` and run the wrapper. Its stderr hint contains `| FKIT_REPO=<repo> FKIT_REF=<ref> FKIT_SHARE='<share>' FKIT_BIN='<bin>' sh`.
10. `0481/download-fails` (only if 1b is kept): stub curl exits 22. Exit is not 0, stderr says `update failed`, there is no `now at` line, and no capture file.

**Red before the fix:** write the test first and run it against the unedited launcher. Paste the red for case 1 (installer got `<unset>`) into the worklog, then the green after.

### 4. Prove-red — `test/prove-red.sh` (repo convention: launcher fixes 0247, 0257 and 0379 each got a mutation)
- Add `run_reinstall_suite <claude-tree-root>`, modelled on `run_banner_suite`: `FKIT_REINSTALL_ROOT="$1" node --test "$repo/test/update-reinstall.test.js"`.
- Add **step 0p**: the unmutated copy's reinstall suite must be green (reusing `$clean_tree`).
- Add **mutation 41**, on a `make_claude_copy`:
  - Remove the `FKIT_REPO=… FKIT_SHARE=… FKIT_BIN=…` assignments before `sh`, so it reads `| sh`.
  - Guard against a no-op sed, and check that exactly one line changed.
  - It must go red **at `0481/version-only`**.
- Update the header ("FORTY mutations" becomes FORTY-ONE) and add index line 41.
- ⚠️ `test/prove-red.sh` has uncommitted 0477 edits; append to the current file and do not reformat them.

### 5. README and related docs (0478 is closed, so step 5 is unblocked)
- `README.md` § Configuration: replace "`fkit update` re-runs the installer with your current environment, so keep custom paths **and** `FKIT_REPO` / `FKIT_REF` exported." with: "`fkit update` reuses the source and paths you installed with; set a variable on `fkit update` only to change one." Keep the "Installer variables go **after** the pipe" sentence before it.
- `claude/README.md`: no stale line (checked: it has only `fkit update  # update fkit itself`). No edit.
- `install.sh` header: step 2d.

### 6. `CHANGELOG.md` → `## Unreleased`
- One bullet: `fkit update` now reinstalls from the repo, ref and paths you installed with.
- One **upgrade note**: if you installed with a custom `FKIT_SHARE`, `FKIT_BIN`, `FKIT_REPO` or `FKIT_REF` and did not keep them exported, re-run the installer once by hand with them after the pipe, and remove any copy an earlier `fkit update` left at the default paths. Your current fkit's own `fkit update` cannot do this for you.

### 7. Docs that state the changed facts, or cite lines that move
- `ai-agents/knowledge-base/architecture.md`:
  - `.version` field list (`version`/`sha`/`repo`/`ref`): add `bin`.
  - The "5 — Self-update" `fkit update` bullet: add "with the recorded source and paths".
- `RELEASING.md` §5, "`install.sh` itself is untested": narrow it to what is still true. Case 8 now exercises `install.sh`'s `.version` recording and wrapper generation under a stub curl; the real network fetch is still untested.
- **Line citations my edits shift**: re-derive each one with grep after the code is final, and update it.
  - `RELEASING.md`: `install.sh:67/:69`, `claude/fkit-claude.sh:106/:136-138/:156-162`.
  - `architecture.md`: `install.sh:55-72/:86-95/:101`, `claude/fkit-claude.sh:100-124/:126-166/:539-560`.
  - `test/update-banner.test.js` comments: `:126-165`, `:168-196`, `:138`, `:196`, `:511`.
  - Lines **before** the edits (e.g. `install.sh:19`, `:32`) do not move. ADRs, `knowledge-base/reports/` and closed tasks are historical records and are **not** touched.

### 8. `.claude/` refresh (brief step 6)
Not needed: nothing under `claude/agents/` or `claude/skills/` changes, and the launcher is not copied into `.claude/`. The worklog says so rather than running it.

## Checks (per CONTRIBUTING.md "What to run for a change": a change that spans rows runs the heaviest row)
- **`npm test`** (~12 min). Required: this touches a non-`.md` file under `claude/` (the launcher), adds files under `test/`, and edits `test/prove-red.sh`. It covers `test:unit`, `test:docs` (needed for the `architecture.md` edit) and prove-red, including the new 0p and mutation 41.
- Targeted runs while working: `node --test test/update-reinstall.test.js test/update-banner.test.js test/launcher-contract.test.js`.
- `sh -n` and `dash -n` on `claude/fkit-claude.sh` and `install.sh`. CI's `/bin/sh` is dash; the local `/bin/sh` is bash.
- **Run the new suite once with `/bin/sh` → dash** (a scratch PATH shim, or a `FKIT_TEST_SH` override if that is cheaper). This one is optional; if it is skipped, say so.
- Manual check (brief verification 3), in a throwaway HOME under the session scratchpad, with a stub curl and no network; paste the result into the worklog. Case 8 automates the same check.
- `grep -n -i "exported\|current environment" README.md claude/README.md install.sh` returns nothing (brief verification 5).
- Grep every changed file for absolute machine paths: there must be none.
- Docs-only files (README, CHANGELOG, RELEASING): no automated check covers them, so links are checked by eye.
- **Skipped:** nothing planned. Anything that does not run gets reported as skipped, with the reason.
- **Never run:** the real `fkit update`, the real `install.sh` against the real HOME, `~/.claude` or `~/.local`.

## Edge cases and failure modes considered
- macOS `/var` vs `/private/var` and trailing slashes: compare with `pwd -P`, not as strings (the prototype matched a wrapper written with a trailing slash).
- Empty env value (`FKIT_BIN=`): treated as unset.
- `.version` missing entirely: repo/ref fall back to the defaults; bin follows design (b).
- `FKIT_SHARE` env different from the running install: the env value wins (brief). The new copy is written there and the wrapper is re-pointed. The old copy is left in place and not deleted (this rule is never-delete).
- A source checkout: still refuses before any bin logic (the order in 1d). The harness's no-op curl stub only matters for non-checkout copies; with 1b those now fail cleanly with exit 1, still never the usage-error exit 2 that launcher-contract test 5 checks for.
- Paths with `'`, `"` or `$`: a known, pre-existing limit of the generated wrapper; noted, not widened.
- The bin dir has gone (user deleted it): the recorded `bin=` is trusted, and `install.sh` recreates the wrapper in the same place, which counts as "the same place as before".

## Follow-ups (noted, not in scope)
- `CONTRIBUTING.md`'s "What to run" table has no row for `install.sh` (a non-`.md` file at the repo root, so today it falls into "unsure → `npm test`"). Once case 8 exists, `test:unit` covers it. Worth a line in a later docs tidy; this task does not edit the table, which 0480 changed and has not committed.
