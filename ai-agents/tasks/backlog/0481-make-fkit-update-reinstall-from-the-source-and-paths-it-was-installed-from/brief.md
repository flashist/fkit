# Make `fkit update` reinstall from the source and paths it was installed from

## ID
0481

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.

**Owner ruling** (2026-10-02, `fkit-lead` session, `AskUserQuestion`, selected option, relayed to a
spawned producer): *"README fix + bug task — README says keep them exported; producer files a task to
fix the launcher bug properly."* The README workaround landed with `0478`; this task is the proper fix.

**The bug** (reviewer finding R3, `0478` round 1, in that task's `review.md`; re-read at filing):
- `fkit update` calls `_fkit_reinstall` in `claude/fkit-claude.sh` (~:100-104). It writes
  `FKIT_REPO=… FKIT_REF=… curl -fsSL …/install.sh | sh`. A variable set in front of a command reaches
  **only that command** — here `curl`, not the `sh` on the other side of the pipe. So the downloaded
  `install.sh` runs with its own defaults (`install.sh` ~:18-21) and **silently reinstalls
  `flashist/fkit@main`**, even though the launcher printed *"updating from <your repo>@<your ref>"*.
  Reviewer measured the shell rule: `A=1 true | sh -c 'echo ${A:-unset}'` prints `unset`.
- The launcher already **reads** the right source: `fkit_repo` / `fkit_ref` come from the env if set,
  else from `repo=` / `ref=` in the installed `.version`, else the defaults (~:106-107). And
  `install.sh` already **records** `repo=` and `ref=` in `.version`. The value is known; it is just not
  handed to the installer.
- **Same problem for custom paths, and worse.** `install.sh` honours `FKIT_SHARE` (resources) and
  `FKIT_BIN` (the `fkit` command). `fkit update` passes neither, so an install made with custom paths
  is "updated" into the **default** locations (`~/.local/share/fkit`, `~/.local/bin`) — a second,
  separate install — while the one the user actually runs stays old.
  - The launcher **knows** its share root (`$share`, worked out from where the script lives).
  - It does **not** know the bin dir: `.version` has no `bin=` (or `share=`) field today, and the
    `fkit` wrapper `install.sh` writes into the bin dir does not pass it on.
- **The README workaround** (added by `0478`, § Configuration): *"`fkit update` re-runs the installer
  with your current environment, so keep custom paths exported."* That works: an **exported** variable
  reaches every command in the pipe, `sh` included. The bug bites users who set the variables only on
  the install command line — exactly what the README tells them to do (*"Installer variables go after
  the pipe"*) — and then do not keep them exported.

**Related, not dependencies:**
- `test/update-banner.test.js` already runs the launcher on a **sealed PATH** (only stub `git` /
  `curl`, the real ones provably unreachable). Reuse that approach; do not let any test touch the
  network.
- `test/launcher-contract.test.js` also covers the launcher.
- ADR-009 §3: `fkit-claude.sh` owns self-update; the wrapper does not intercept `update`.

## What to build

1. **Pass the source to the installer, not to `curl`.** `fkit update` must run the downloaded
   `install.sh` with `FKIT_REPO` / `FKIT_REF` set to the values the launcher already resolved (the
   ones it prints in *"updating from …"*). Keep today's order of precedence: a value set in the
   environment for this run wins (a deliberate one-off switch, e.g. moving to a tag), then
   `.version`, then the default.
2. **Pass the paths too.** `fkit update` must reinstall into the **same** share dir and bin dir the
   running install lives in, with no env vars needed.
   - Share: the launcher already knows it.
   - Bin: the plan picks how the launcher learns it — e.g. `install.sh` records `bin=` (and `share=`)
     in `.version`, or the wrapper passes it. Whatever is chosen must also be written by `install.sh`
     so the **next** update keeps it.
   - **Older installs** whose `.version` lacks the new field(s): the plan says what happens. Hard rule:
     never silently install to a different place than before. If the bin dir cannot be known, use the
     default only when that is provably where this install lives, otherwise say so to the user (one
     line) rather than guess.
   - An env value set for this run (`FKIT_SHARE=… fkit update`) still wins, matching step 1.
3. **Check the other pipe-to-`sh` and env-prefix spots** in the launcher and installer for the same
   mistake (e.g. the "install looks broken — Reinstall:" hint the wrapper prints, any `curl … | sh`
   in docs) and fix or note each.
4. **Tests** (`node --test`, zero dependencies, ADR-014), on a sealed PATH like
   `test/update-banner.test.js`. A stub `curl` returns a **fake `install.sh`** that writes the
   `FKIT_REPO`, `FKIT_REF`, `FKIT_SHARE`, `FKIT_BIN` it actually received to a capture file (and,
   ideally, a valid `.version` so the launcher's post-update line works). Cases, at least:
   - Custom repo/ref recorded only in `.version`, **nothing exported** → the fake installer receives
     those exact values (not `flashist/fkit` / `main`). This is the case that fails today; show it
     red before the fix.
   - Install at a custom share dir and custom bin dir, nothing exported → the installer receives
     those exact paths.
   - An env value given on the `fkit update` command line overrides `.version`.
   - Default install → defaults, unchanged behaviour.
   - Old `.version` without the new field(s) → the behaviour the plan chose in step 2.
   - The stub `curl` was asked for `install.sh` from the same repo/ref the installer then received.
5. **Then update the README.** Replace the sentence `0478` added (§ Configuration: *"`fkit update`
   re-runs the installer with your current environment, so keep custom paths exported."*) with the
   true behaviour: `fkit update` reuses the source and paths you installed with; set a variable on
   `fkit update` only to change them. Check `install.sh`'s header comment and `claude/README.md` for
   any line that says the same old thing. **Do not edit `README.md` while `0478` is still open** —
   another coder owns it until then.
6. Refresh the `.claude/` copies after editing anything under `claude/`.

## Verification steps

1. Before the fix, the new "nothing exported, custom repo/ref in `.version`" test fails (fake
   installer captured `flashist/fkit` / `main`); after it, it passes. Paste both results in the
   worklog.
2. All step-4 cases pass; the seal is proven (real `curl` / `git` unreachable) the same way
   `update-banner.test.js` proves it.
3. Manual check in a scratch dir (no network: stub `curl` on PATH): install with custom
   `FKIT_SHARE` / `FKIT_BIN` given only on the install command line, open a fresh shell with none of
   the `FKIT_*` vars set, run `fkit update` → the fake installer reports the custom repo, ref, share
   and bin; nothing new appears under the default `~/.local/share/fkit` or `~/.local/bin`.
4. `test/update-banner.test.js` and `test/launcher-contract.test.js` still pass.
5. `grep` finds no remaining "keep custom paths exported" (or equivalent) advice in README.md,
   `claude/README.md`, or `install.sh`.
6. Run the checks the change needs (launcher + installer + docs; per `0480`'s rule if it has landed,
   else the unit suite), and state which ran. No absolute machine path in any changed file.

## Notes
- **Depends on:** 0478 — for step 5 (the README sentence) only; steps 1-4 can be built before it closes.
- **Blocks:** nothing
- **Why one brief, not two:** the launcher fix and its tests are one unit; the README change only
  makes sense once the fix exists (shipping it first would describe behaviour that is not there yet),
  and it is a one-sentence edit. Share/bin handling is part of the same fix: the same function, the
  same tests, the same fake installer.
- **For the plan to settle, with the owner:** (a) how the bin dir is learned (step 2); (b) what an
  older install without the new `.version` field does; (c) whether `.version` gaining fields needs any
  change elsewhere (e.g. `/fkit-heal`'s structure-spec / manifest, the update banner's readers) — ask
  the architect if unsure.
- Line numbers above were read at filing (2026-10-02) and will drift.
- **Consulted:** none at filing.
- Filed 2026-10-02 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  ruling above; it decides nothing beyond that ruling.
