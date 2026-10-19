# Plan — 0526: check prove-red mutation 48 on one isolated Linux run

## Goal
Find out, on Linux, why prove-red mutation 48 took 217.8 s on CI, and whether a real Linux user gets a slow launch from the update check's git deadline (`_fkit_deadline` in `claude/fkit-claude.sh`). Investigation only: the one file written in the repo is this task's `worklog.md`.

## What is already known (read-only grounding, done while planning)
- CI run 38904713361 log (read-only `gh run view --log`), per-step line timestamps for the banner-suite mutations: 44 → 61.7 s, 45 → 21.6 s, 47 → 40.8 s, 48 → 217.8 s. Unit-pass per-test: 0284/git-deadline 6.09 s, 0284/term-ignored 6.08 s, 0284/no-stray 13.12 s, others < 0.1 s. One healthy banner-suite run ≈ 25 s; mutation 48 costs ≈ 190 s more than siblings running the same suite (≈ 9.5 s per try if all 20 no-stray tries ran — more than the 5 s nap + 1 s kill step alone explain, so more than one holder or delay is possible).
- Mutation 48 replaces `kill "$_fkit_dl_dog" || :` with `:` (watchdog stays armed after git answers). A test mutant, not shipped code.
- 0284/no-stray's normal path relaunches up to 20 times until a launch logs a watchdog sleep AND finishes in < 4 s. If launches under the mutant take ≥ 4 s, all 20 tries run and the test fails on "no fast launch logged a watchdog sleep in 20 tries" — red under the same test name, but via a different assertion than the one mutation 48 means to trip ("the watchdog stayed armed…"). Leading hypothesis; not verified. CI kept no output for step 48 (prove-red keeps output only for failing steps), so which assertion fired on CI is unknown.
- Open mechanism question: what holds the launch on Linux? Reading the code, the watchdog's stdout/stderr go to /dev/null, so it should hold no pipe. Ubuntu's /bin/sh is dash; macOS's is bash. The suite also replaces `sleep` with a sh wrapper (logs its pid, then execs the real sleep), so its process shape differs from a user's.
- Working tree: `claude/`, `bin/`, `test/` already carry uncommitted changes from other tasks (17 files). The launcher's diff vs HEAD is comment/blank-line only; the mutation-48 anchor line is unchanged. So the working-tree launcher behaves as HEAD's.

## Environment
- Primary: local Docker (Docker Desktop, server 28.5.1, linux/arm64), image `ubuntu:24.04` — same OS as CI's `ubuntu-latest` (dash as /bin/sh, procps `ps`). Node 24 from the nodejs.org Linux tarball, checked against its SHASUMS256. A fresh `docker run --rm` container per measured run. Repo mounted read-only and copied inside; nothing in the container can write the repo.
- No push. No CI run. Network only to pull the image, apt packages (procps, strace, git, xz-utils, ca-certificates, curl) and the node tarball. Tests run on the suite's own sealed PATH with a fake repo (proven by the suite's own assertions).
- Control: the same probe on the macOS host (/bin/sh = bash, and /bin/dash) — separates OS from shell.
- Known gaps: CI is x86_64, the container arm64 — absolute times differ; held-vs-not does not depend on CPU. If the container does NOT reproduce CI's slow mutation 48, rerun steps 3 and 5 under `--platform linux/amd64` (emulated, local, no push) before considering CI. No mode reproduces a real user's tty stdin/stdout — noted in the worklog as a gap.

## Steps
0. Pre-flight (recorded in worklog): before-snapshot = `git status --porcelain -- claude bin test`, `git diff HEAD -- claude bin test | shasum -a 256`, and `git ls-files -o --exclude-standard -- claude bin test | xargs shasum -a 256` (none today). `npm run test:docs` once, to record any pre-existing red before the worklog exists. Confirm Docker daemon up.
1. Build the environment, record versions: /etc/os-release, `uname -m`, `node --version`, `bash --version | head -1`, `dpkg-query -W dash procps coreutils`, `readlink -f /bin/sh`, `ps --version`, image digest. Confirm `ps`, `sleep`, `mktemp` resolve (the suite builds its sealed PATH with `command -v`; a missing `ps` would silently change the launcher's child walk).
2. Baseline banner suite, 3 runs: `node --test --test-reporter=spec test/update-banner.test.js`, unmutated tree. Per-test ms and total wall time.
3. Mutation 48, replicated exactly, 3 runs: copy `claude/` to `/tmp/m48/claude`, apply prove-red's own sed `s/^  kill "\$_fkit_dl_dog" .*$/  : # mutation: watchdog left armed/`, apply prove-red's three guards (not a no-op, exactly one changed line, the kill is gone), then `FKIT_BANNER_ROOT=/tmp/m48/claude node --test --test-reporter=spec test/update-banner.test.js` (what `run_banner_suite` runs). Record per-test ms, total, and **the exact no-stray failure message** (which assertion fired).
4. Controls, 1 run each: mutations 45 and 47 replicated the same way (prove-red's own seds) — same suite, different mutant (21.6 s / 40.8 s on CI). If they stay fast while 48 is slow, the cost is specific to the armed watchdog.
5. Launch-time probe (core of the "real user" answer). A small probe (POSIX sh + a few lines of node for spawnSync mode) in the session scratchpad — not the repo; its full text goes into the worklog — builds the fixture exactly as the suite does: an install root holding a copy of `claude/` and a synthetic `.version` (version/sha/repo=the suite's fake repo/ref), no `package.json`; a sealed bin dir with symlinks for the suite's NEEDED_TOOLS except `sleep`, plus the suite's GIT_OK git stub and no curl. Times `fkit-claude.sh --help` with `FKIT_NO_SELF_HOST=1 FKIT_UPDATE_INTERVAL_MIN=0` and an otherwise empty env.
   - Dimensions: launcher {shipped, mutation-48} × shell {dash, bash} × output {to a file, to a pipe (`| cat`), node `spawnSync`} × sleep {suite wrapper (sh script logging its pid, then exec real sleep — as sealedBin builds it), real sleep (symlink)}.
   - spawnSync mode copies `launch()`'s options exactly: no `stdio` option (stdin, stdout, stderr all pipes), env built from nothing = PATH, HOME (temp), FKIT_NO_SELF_HOST=1, FKIT_TEST_GIT_LOG / _CURL_LOG / _SLEEP_LOG, plus FKIT_UPDATE_INTERVAL_MIN=0 (as no-stray's loop sets); no TERM.
   - N: shipped-launcher, real-sleep cells, {dash, bash} × {file, spawnSync}: **100 launches each** (each should be well under 1 s, so this is cheap — it is what catches an occasional hold such as the documented residual of a TERM landing before `_fkit_dl_nap` is recorded). Every other cell: 10 launches. Minimum: the mutation-48 launcher under dash in spawnSync and file modes with both sleep variants. Record min/median/max and the count of launches > 2 s (k of N).
   - Reading: file mode = the launcher's own wait (what a user would feel); pipe/spawnSync = also waiting until every holder of the output pipes exits (what the harness feels). **The real-user answer uses only the real-sleep rows**; the wrapper rows reproduce the suite (cross-checked against step 3).
6. If anything in step 5 is slow (> 2 s median, or any shipped-launcher launch > 2 s): find the holder(s) — expect possibly more than one. During one slow launch, snapshot `ps -o pid,ppid,etime,args` and `ls -l /proc/<pid>/fd` for every descendant (pipe-inode matching), and one `strace -f -tt -e trace=process,read,wait4` run. Also check whether the armed watchdog's late `kill $_fkit_dl_kids "$_fkit_dl_pid"` (≈ 5 s after git exited) hits a reused pid inside the container's pid namespace (a mutant-only mechanism). State the mechanism in one paragraph, naming the `_fkit_deadline` line(s) involved.
7. macOS control: step 5's probe on the host — shipped and m48 × /bin/sh and /bin/dash × file and spawnSync × both sleep variants, 10 launches each. Plus one m48 banner-suite run on macOS (contrast to step 3).
8. Fidelity run, once: full `bash test/prove-red.sh` in a fresh container, every output line timestamped (`while IFS= read -r l; do printf '%s %s\n' "$(date +%s.%N)" "$l"; done`). Gives step 48's time in its real context plus the other six banner-suite runs (0j, 16, 17, 44, 45, 47), so the "32% of the run" figure splits into: number of banner-suite runs × each run's built-in sleeps, vs mutation 48's excess. (Unrelated reds in other suites do not stop prove-red — it records and continues; noted, not chased.)
9. Write `worklog.md` in the task folder: environment; exact commands (probe text verbatim); tables — baseline and m48 per-test timings, controls, probe matrix (Linux + macOS) with k-of-N, prove-red per-step times; the mechanism (step 6) if any; the tty gap; **the answer: yes / no / not proved** with evidence; the banner-test recommendation (delete / keep a small fast subset / keep and fix a real bug — a fix is its own owner-approved brief); a short time breakdown answering brief step 2. No secrets, no host paths or usernames.
10. Post-check: re-take the step-0 snapshot (all three parts); it must match byte for byte (this task's form of the brief's verification step 4 — those paths are not empty today because of other tasks' uncommitted work). `npm run test:docs` again; any red not present at step 0 is mine and gets fixed. Delete the probe's temp dirs.

## Decision rule for the answer
- **Yes** — any reproducible file-mode hold of the *shipped* launcher over 2 s, real-sleep rows, Linux, git answering at once, under dash or bash — reported with its rate (k of N), shells, and length. A 5 s hold in 1 launch of 100 counts if it reproduces on a re-run of that cell.
- **No** — the shipped launcher, real-sleep rows, stays under 1 s in every launch of every cell (both shells, file and spawnSync); and mutation 48's slowness is explained by a mechanism (step 6) that exists only in the mutant, only with the suite's sleep wrapper, or only when a pipe is held (test-harness cost).
- **Not proved** — anything else (slow only on CI, not reproduced locally; mechanism not found; a hold that does not reproduce; mixed results). Say exactly what is missing.
- Independent of the answer, the worklog states the designed worst case that is *not* a bug: a stalled network costs up to 5 s (git deadline) + up to 5 s (curl `--max-time`) on any OS, once per throttle window (60 min).

## Recommendation shape (an output, not decided now)
One of: delete the banner tests; keep a small fast subset (which tests, and whether it needs a `FKIT_NET_TIMEOUT` override — a shipped-code change, so its own brief); or keep and fix a real launcher bug (own brief, owner-approved). Also says whether mutation 48, as written, catches what it claims on Linux (if the red comes from the 20-tries guard, not the armed-watchdog check, say so).

## What I will not do
- Change any file under `claude/`, `bin/`, `test/`, `.github/`. Delete no test.
- Push, open a CI branch, or trigger a CI run (`gh workflow run`) — each is owner-gated (open question 1).
- Write anything but `worklog.md` in the repo.

## Checks
- `npm run test:docs` before and after (worklog.md is under `ai-agents/` — CONTRIBUTING's row for that). Skipped: `npm test` / `test:unit` on macOS — no code, test or tooling file changes, so no row requires them; prove-red runs in the container as part of the investigation (step 8), not as a gate.

## Edge cases / failure modes
- Docker daemon down, or image/apt/node download fails → BLOCKED with the error; no CI fallback without the owner.
- `ps` missing in the image → install procps first; confirm before any run (else results are invalid).
- Timing tests flake under load → nothing else runs in the container; fresh container per run; 3 repeats for suite runs, 10–100 for probes.
- A failing no-stray run can leave a `sleep 20` behind → fresh container per run.
- Container doesn't reproduce CI's slow 48 → `--platform linux/amd64` rerun of steps 3 and 5 (local); still not reproduced → "not proved" for the CI behaviour; open question 1 decides whether a CI run is worth it.
- Probe fixture differs from the suite's → the probe copies the suite's own recipe including the sleep wrapper; step 3's suite run is the cross-check.

## Open questions for the owner
1. **CI push.** No push needed: everything runs in a local Linux container. A CI run is a fallback only if the container can't reproduce CI's slowness (run 38904713361). If so, stop and ask (a throwaway branch push then deletion; or `gh workflow run` on `main` — no push, ~20 min CI on the whole suite). Rec: do not pre-approve; ask only if needed.
