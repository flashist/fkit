# Worklog — 0526: prove-red mutation 48 on one isolated Linux run

Build worker (fkit-coder), spawned by `fkit-sprint-ship-loop` under the ADR-055 declared-approval
marker, 2026-10-19. Plan: `plan.md` (blob `6ce73629f246b63b1936a645437ac79f6a894fe7`, checked with
`git hash-object` before starting). Repo HEAD `78b7464` plus other tasks' uncommitted work (see §0).
No push, no CI run, no `gh workflow run`. Only this file was written in the repo.

## The answer

**No — a real Linux user does not get a slow launch from this code path.**

- Shipped launcher, real `sleep`, git that answers at once: **every launch under 15 ms**, in every cell —
  dash and bash, output to a file and node `spawnSync`, 100 launches each (0 of 400 over 2 s; max
  13 ms). Same with **real `git ls-remote`** on a local bare repo (file transport, no network): 0 of 400
  over 2 s, max 13 ms.
- Mutation 48's 217 s **is reproduced locally** (217.1 / 217.2 / 217.1 s, three runs; 217.2 s inside a full
  prove-red run; CI: 217.8 s). The holder (dash's saved stderr on fd 10, kept by the watchdog subshell)
  exists in the shipped launcher too; what is **mutant-only** is a watchdog that **outlives a git that
  answered**. It is felt **only when the launcher's stderr is a pipe, under dash** — a test-harness cost
  (mechanism below).
- The decision rule's **No** needs both halves; both hold: the shipped launcher stays under 1 s in every
  launch of every cell, and mutation 48's slowness is explained by a mechanism felt only when a pipe is
  held (the rule's "only when a pipe is held" route; m48 file-mode medians: 0.007 s Linux, ≤ 0.036 s macOS).

**Scope of the No.** Git answering at once (stub) or a real git over file transport. Not covered: real
git over https (`git-remote-https`, credential helpers, proxies) — not run, because the plan allows no
network; and a real user's tty stdin/stdout — no mode here reproduces a tty (gap, see §Gaps).

**Side finding (not a "Yes" — git is not answering at once here):** when git **stalls**, the shipped
launcher under **dash** costs **6 s instead of 5 s if its stderr is a pipe** (same mechanism, 1 s
window). In a terminal (stderr a tty) or with stderr to a file it is 5.0 s. Bash: 5.0 s in every mode.
This is why the healthy suite's `0284/git-deadline` reads 6.03 s on Linux but 5.38 s on macOS (bash
`/bin/sh`). Candidate for its own small brief if anyone captures `fkit` stderr through a pipe; not a
user-at-a-terminal issue.

## Mechanism (step 6)

Line numbers below are the **working-tree** `claude/fkit-claude.sh` as of §0 (another task's uncommitted
comment cleanup); at HEAD `78b7464` add 40 (e.g. `:61` → `:101`, `:68-71` → `:108-111`).

Dash keeps a saved copy of the caller's stderr on **fd 10** (close-on-exec) when it applies the
`2>/dev/null` on the `_fkit_deadline …` call inside `_fkit_remote_sha`'s pipeline
(`claude/fkit-claude.sh:68-71`, the `… "$fkit_ref" 2>/dev/null \ | awk` line). Close-on-exec drops it
in every *exec'd* child (git, sleep), but the watchdog is a *forked subshell* —
`( trap …; sleep "$_fkit_dl_secs" & … ) >/dev/null &` (`:50-58`) — so it inherits fd 10 and holds the
launcher's original stderr for as long as it lives. Its own `>/dev/null` and the deadline's
`exec 2>/dev/null` (`:44`) replace fds 1 and 2 only.

- **Shipped launcher, git answers:** `kill "$_fkit_dl_dog"` (`:61`) ends the watchdog at once → nothing
  held → ~6 ms.
- **Mutation 48** (`:61` → `:`): the watchdog lives its full 5 s nap + `sleep 1` (`:51-57`) → anything
  waiting for EOF on the launcher's stderr waits **~6.0 s**. Node's `spawnSync` (the suite's `launch()`)
  and a `2>&1 | cat` pipe both do. A file or tty does not.
- **Shipped launcher, git stalls:** the watchdog is in its `sleep 1` (`:56`) when `:61`'s TERM arrives;
  the shell defers the trap until that `sleep` ends → fd 10 held to ~6 s.
- **Bash**: no hold in any cell (inferred from timing — bash's fds were not traced).

Evidence (container, dash, m48, spawnSync, one launch, 6.02 s):

```
--- snapshot at +1.5 s   (launcher already exited; pid 54 = orphaned watchdog, pid 55 its nap)
   54     1       00:01 /bin/dash /tmp/p-root-…/claude/fkit-claude.sh --help
   55    54       00:01 sleep 5
raw 54:  0 -> /dev/null   1 -> /dev/null   2 -> /dev/null   10 -> socket:[88377]
raw 55:  0 -> /dev/null   1 -> /dev/null   2 -> /dev/null
```

`socket:[…]` is node's stdio channel (libuv uses socketpairs). strace of a second run of the same cell
(fresh container; pid 53 = the pipeline element running `_fkit_deadline … 2>/dev/null`, pid 58 = the
watchdog):

```
53  fcntl(2, F_DUPFD, 10) = 10          # dash saves the caller's stderr …
53  fcntl(10, F_SETFD, FD_CLOEXEC) = 0  # … close-on-exec only
53  dup3(3, 2, 0) = 2                   # then 2 -> /dev/null
42  +++ exited with 0 +++               # launcher exits at +68 ms (strace-slowed)
58  kill(57, SIGTERM) = -1 ESRCH        # armed watchdog, +5 s: git's pid is gone, not reused
58  kill(57, SIGKILL) = -1 ESRCH        # +6 s
58  +++ exited with 0 +++               # spawnSync returns here
```

- **Stdin (Codex X4):** the watchdog's stdin is `/dev/null` (dash gives a background job `/dev/null` as
  stdin) — stdin is not the holder.
- **PID reuse (architect's check):** the armed watchdog's late `kill $_fkit_dl_kids "$_fkit_dl_pid"`
  returned `ESRCH` both times in the traced run — no reused pid hit. Container `pid_max` = 99999; pids
  are handed out in order, so a hit within 5 s needs a wrap. Not observed; a mutant-only risk anyway.
- **More than one holder?** No: one holder (the watchdog shell, fd 10). The "≈ 9.5 s per try" estimate in
  the plan was wrong — see the breakdown: it is ~6.0 s per try × 20 tries, plus 13 other tests at 6 s.

## Mutation 48 — which assertion fired

Linux (dash), all three runs:

```
✖ 0284/no-stray … (126490 ms)
  AssertionError: no fast launch logged a watchdog sleep in 20 tries — is the deadline wired in?
```

macOS (`/bin/sh` = bash 3.2), one run, 36 s total:

```
✖ 0284/no-stray … (13754 ms)
  AssertionError: the watchdog stayed armed after git answered: it woke and ran its KILL step (…)
```

**So on Linux, mutation 48 does not catch what it claims.** It goes red under the right test name, but
via the 20-tries guard: every mutant launch is held 6 s (> no-stray's 4 s "fast launch" bar), so no try
qualifies, and the designed armed-watchdog check never runs. prove-red's name-only check
(`grep '(✖|not ok|fail).*0284/no-stray'`) cannot tell the two apart. On macOS it trips the designed
assertion.

## Time breakdown (brief step 2)

**Where mutation 48's 217 s goes** (Linux, step 3 run 1; runs 2–3 within 0.1 s):

| part | time |
|---|---|
| 13 tests whose launch reaches git (all 0257 cases, throttle, `.latest` ×2, real-role launch, git-env, offline) — each launch held 6.0 s by the armed watchdog | 13 × ~6.03 s ≈ 78.4 s |
| `0284/git-deadline` + `0284/term-ignored` — their normal ~6 s each (stall path) | 12.1 s |
| `0284/no-stray` — stall half ~6 s, then **20 tries × 6.02 s** (none under 4 s) | 126.5 s |
| 2 tests that never reach git (source checkout, `FKIT_NO_UPDATE_CHECK=1`) | 0.03 s |
| **total** | **217.1 s** |

So: not the tests' designed sleeps, not the launcher's own wait. It is the harness waiting on a held
stderr pipe, ~36 times, plus the 20-tries loop that exists to retry a race.

**prove-red, full run in a fresh container (step 8): 668.2 s, rc 0, no ✗.** Banner-suite steps:

| step | local (gap between completion lines) | CI run 38904713361 |
|---|---|---|
| 0j clean copy | 25.6 s | — |
| 16 | 25.6 s | — |
| 17 | 25.6 s | — |
| 44 git deadline stripped | 60.6 s | 61.7 s |
| 45 child walk dropped | 20.7 s | 21.6 s |
| 47 KILL escalation dropped | 39.6 s | 40.8 s |
| 48 watchdog left armed | **217.2 s** | **217.8 s** |
| **7 banner-suite runs** | **414.9 s of 668.2 s (62%)** | — |

- A healthy banner-suite run is 25.6 s, of which 25.1 s is three 0284 timing tests (git-deadline 6.0 s,
  term-ignored 6.0 s, no-stray 13.1 s); the other 15 tests total ~0.45 s.
- Of the 414.9 s: 3 healthy runs = 76.8 s; mutants 44 + 45 + 47 = 120.9 s (their designed stalls);
  mutation 48 = 217.2 s, i.e. a healthy run's 25.6 s + **≈ 191.6 s excess** — the single biggest item,
  all harness cost.
- CI's 32% was of the whole 1310 s job (unit pass + prove-red); this run measures prove-red alone, so
  the shares are not comparable — the per-step times are, and they match within ~1 s.

## Recommendation for the banner tests (for 0529)

**Keep the banner tests; do not delete them. No launcher bug to fix.** In plain words:

1. **Keep all 15 fast tests** (the 0257 banner cases, git-env, etc.) — together ~0.45 s per run.
2. **The cost is the three 0284 timing tests (~25 s per run, × 7 runs in prove-red)** plus **mutation 48's
   ~192 s excess on Linux.** Each fix below is its own owner-approved brief:
   - **Test-only — mutation 48's excess.** Have `0284/no-stray` detect the 6 s hold directly instead of
     retrying 20 times: alone, saves ~110 s and makes the red come from the designed armed-watchdog
     check (the honest gate); with the mutant also run under `--test-name-pattern 0284/no-stray`,
     ~200 s. The name pattern **alone** still runs the 20-try loop (~126.5 s): saves only ~90 s and
     still reds through the 20-tries guard — not honest.
   - **Shipped code — the ~25 s per run.** A test override for `FKIT_NET_TIMEOUT` (hard-coded today)
     would cut the three timing tests, but it changes the launcher.
3. Optional, separate: the dash 6 s-vs-5 s stall cost when stderr is a pipe (side finding above) — a
   one-line launcher fix is possible; it changes shipped code, so own brief, owner-approved.

## Designed worst case (not a bug) — owner ruling X3 wording

Stalled git ≈ 5 s (6 s if git ignores TERM); no git → curl sha ≤ 5 s; up to ~5 s + ~5 s only when a slow
git still succeeds with a changed sha and curl is then slow. Once per throttle window (60 min).
Measured this run: stalled git, shipped launcher, file mode: 5.01–5.02 s (dash and bash); stderr on a
pipe: 6.02 s under dash (side finding), 5.02 s under bash. TERM-ignoring git measured only through the
suite (`0284/term-ignored`, spawnSync): 6.04 s on Linux.

## §0 Pre-flight (step 0)

- Docker Desktop daemon up: server 28.5.1, arm64.
- Before-snapshot (UTC 2026-10-19T11:39:58Z): `git status --porcelain -- claude bin test` = 17 `M`
  entries (other tasks' work: `bin/generate-structure-manifest.mjs`, 12 files under `claude/`,
  `test/prove-red.sh`, `test/structure-manifest.test.js`, `test/structure-notice.test.js`,
  `test/turn-completion-hook.test.js`); `git diff HEAD -- claude bin test | shasum -a 256` =
  `a2ac0a31bbe1ff5a93c6245a7b2afa3d17c67e1c0b90d25a627997e107d6463c`; untracked files under those paths:
  none.
- The launcher's working-tree diff vs HEAD is comment/blank lines only (no non-comment `+`/`-` line);
  `test/update-banner.test.js` unchanged vs HEAD; `test/prove-red.sh` differs by 1 line, not in the
  banner mutations (44–48 blocks read and match the plan's seds).
- `npm run test:docs` before: 410 pass, 0 fail.

## Environment (step 1)

**Linux (primary):** image built locally from `ubuntu:24.04`
(`ubuntu@sha256:68ee22004a9109b44973313b02ff7b1de250f1de0f5ecb628d73f579aaff33ac`), local tag
`fkit0526:arm64`, image id `sha256:4d37ef45d4610c2b9c6313f1f43fde397210822d0ab493a3d9f4aac037a93e07`.

| item | value |
|---|---|
| OS | Ubuntu 24.04.5 LTS, aarch64 (CI is x86_64) |
| node | v24.22.0 (nodejs.org linux-arm64 tarball, `sha256sum -c` against its SHASUMS256.txt under `set -e`) |
| bash | 5.2.21(1)-release |
| `/bin/sh` | `/usr/bin/dash` (dash 0.5.12-6ubuntu5) |
| procps / ps | 2:4.0.4-4ubuntu3.3 / procps-ng 4.0.4 |
| coreutils | 9.4-3ubuntu6.3 |
| git | 1:2.43.0-1ubuntu7.3 (real-git cell only) |
| `ps`, `sleep`, `mktemp`, `awk`, `sed`, `find`, `env` | all resolve under `/usr/bin` |
| CPUs | 14 |

Every measured run: a fresh `docker run --rm --network none -u ubuntu`, repo mounted read-only and copied
inside, probe scripts mounted read-only from the session scratchpad. Network only during the image build
(apt: procps strace git xz-utils ca-certificates curl; the node tarball).

**macOS (control, step 7):** macOS 26.2 arm64, node v24.13.0, `/bin/sh` = bash 3.2.57, `/bin/dash`
present.

## Step 2 — baseline banner suite (Linux, 3 runs)

Wall 25.646 / 25.602 / 25.633 s, all green. Per test (ms, run 1 / 2 / 3):

| test | run 1 | run 2 | run 3 |
|---|---|---|---|
| 14 banner / 0257 tests (excluding "a real role launch") | 12–23 each | similar | similar |
| a real role launch banners too | 177 | — | — |
| 0284/git-deadline | 6038.7 | 6033.6 | 6030.2 |
| 0284/term-ignored | 6036.4 | 6035.9 | 6040.0 |
| 0284/no-stray | 13061.1 | 13055.6 | 13066.0 |
| 0284/git-env | 21.0 | 21.6 | 26.7 |

## Step 3 — mutation 48 (Linux, 3 runs)

prove-red's own sed and three guards (not a no-op, one changed line, kill gone) — all passed. Wall
217.141 / 217.184 / 217.108 s. Per test: every test that reaches git 6026–6048 ms; no-stray 126490 /
126510 / 126467 ms; source-checkout and `FKIT_NO_UPDATE_CHECK=1` 13–18 ms. Failure message: quoted
above (the 20-tries guard), all three runs.

## Step 4 — controls (Linux, 1 run each)

| mutant | local wall | CI | red at |
|---|---|---|---|
| 45 child walk dropped | 20.7 s | 21.6 s | 0284/no-stray: "still running 2 s after a timed-out launch" |
| 47 KILL escalation dropped | 39.6 s | 40.8 s | 0284/term-ignored: "the stall ran to completion — nothing cut it (20.016s)" |

Both stay near their CI times and near a healthy run plus their designed stall; only 48 is slow → the
cost is specific to the armed watchdog.

## Step 5 — launch-time probe (Linux)

`git=ok` is the suite's GIT_OK stub; `realgit` = real git, file transport; `stall` = a GIT_STALL-shaped
stub (`sleep 20 &; wait`). Times in seconds. "over 2 s" = k of N.

| launcher | shell | output | sleep | git | N | min | median | max | over 2 s |
|---|---|---|---|---|---|---|---|---|---|
| shipped | dash | file | real | ok | 100 | 0.005 | 0.006 | 0.013 | 0/100 |
| shipped | dash | spawnSync | real | ok | 100 | 0.005 | 0.006 | 0.010 | 0/100 |
| shipped | bash | file | real | ok | 100 | 0.008 | 0.009 | 0.011 | 0/100 |
| shipped | bash | spawnSync | real | ok | 100 | 0.008 | 0.008 | 0.010 | 0/100 |
| shipped | dash | file | real | realgit | 100 | 0.006 | 0.007 | 0.013 | 0/100 |
| shipped | dash | spawnSync | real | realgit | 100 | 0.006 | 0.007 | 0.008 | 0/100 |
| shipped | bash | file | real | realgit | 100 | 0.008 | 0.009 | 0.011 | 0/100 |
| shipped | bash | spawnSync | real | realgit | 100 | 0.008 | 0.010 | 0.011 | 0/100 |
| shipped | dash | pipe | real | ok | 10 | 0.005 | 0.007 | 0.008 | 0/10 |
| shipped | bash | pipe | real | ok | 10 | 0.009 | 0.010 | 0.013 | 0/10 |
| shipped | dash | file / pipe / spawnSync | wrap | ok | 10 each | 0.005–0.006 | 0.006 | ≤ 0.007 | 0/10 each |
| shipped | bash | file / pipe / spawnSync | wrap | ok | 10 each | 0.008 | 0.008–0.009 | ≤ 0.010 | 0/10 each |
| m48 | dash | file | real | ok | 10 | 0.006 | 0.007 | 0.010 | 0/10 |
| m48 | dash | pipe | real | ok | 10 | 6.014 | 6.021 | 6.025 | **10/10** |
| m48 | dash | spawnSync | real | ok | 10 | 6.012 | 6.018 | 6.021 | **10/10** |
| m48 | dash | file | wrap | ok | 10 | 0.006 | 0.007 | 0.008 | 0/10 |
| m48 | dash | pipe | wrap | ok | 10 | 6.016 | 6.019 | 6.026 | **10/10** |
| m48 | dash | spawnSync | wrap | ok | 10 | 6.014 | 6.021 | 6.025 | **10/10** |
| m48 | bash | file / pipe / spawnSync | real | ok | 10 each | 0.007–0.008 | 0.008–0.009 | ≤ 0.011 | 0/10 each |
| m48 | bash | file / pipe / spawnSync | wrap | ok | 10 each | 0.007–0.008 | 0.008 | ≤ 0.009 | 0/10 each |
| shipped | dash | file | real | stall | 3 | 5.013 | 5.014 | 5.016 | (designed) |
| shipped | dash | pipe | real | stall | 3 | 6.017 | 6.018 | 6.018 | (designed +1 s) |
| shipped | dash | spawnSync | real | stall | 3 | 6.015 | 6.017 | 6.020 | (designed +1 s) |
| shipped | bash | file / pipe / spawnSync | real | stall | 3 each | 5.014–5.016 | 5.015–5.016 | ≤ 5.018 | (designed) |

Every `ok`/`realgit` launch printed the banner (k = N), so git really answered each time. Wrapper rows
logged a sleep pid every launch; real-sleep rows log none — expected, not a broken fixture (architect
note). The wrapper rows match the real-sleep rows: the suite's sleep wrapper is not a factor. Cross-check
with step 3: m48 under dash + spawnSync = 6.0 s per launch in both.

## Step 7 — macOS control (10 launches each, `ok` git)

| launcher | shell | output | sleep | median | max | over 2 s |
|---|---|---|---|---|---|---|
| shipped | /bin/sh (bash) | file / spawnSync | wrap / real | 0.041–0.044 | ≤ 0.657 | 0/10 each |
| shipped | /bin/dash | file / spawnSync | wrap / real | 0.033–0.039 | ≤ 0.438 | 0/10 each |
| m48 | /bin/sh (bash) | file / spawnSync | wrap / real | 0.038–0.047 | ≤ 0.449 | 0/10 each |
| m48 | /bin/dash | file | wrap / real | 0.030–0.036 | ≤ 0.427 | 0/10 each |
| m48 | /bin/dash | spawnSync | wrap | 6.072 | 6.256 | **10/10** |
| m48 | /bin/dash | spawnSync | real | 6.077 | 6.080 | **10/10** |

The hold follows **the shell, not the OS**: dash holds on macOS too; bash holds on neither. m48 banner
suite on macOS (bash `/bin/sh`): 36 s, red at no-stray via the designed armed-watchdog assertion;
git-deadline 5.38 s, term-ignored 6.36 s.

## Gaps

- **No tty.** No mode reproduces a real user's tty stdin/stdout/stderr. By the mechanism, a tty stderr
  is not waited on for EOF, so it should behave like file mode — reasoned, not measured.
- **No https git.** The real-git cell uses file transport (owner ruling X1); `git-remote-https` and
  credential/proxy helpers were not exercised (no network allowed).
- **arm64, not x86_64.** CI-matching absolute times (within ~1 s per step) suggest it does not matter;
  the `--platform linux/amd64` rerun was skipped because its trigger (no local reproduction) did not occur.
- **TERM-ignoring git in file mode** not probed directly (only through the suite, spawnSync).

## Post-check (step 10)

- After-snapshot (all three parts) **matches the before-snapshot byte for byte** (`cmp` of the two
  snapshot files: identical). No file under `claude/`, `bin/`, `test/` changed by this task.
- `npm run test:docs` after writing this file: 410 pass, 0 fail (same as before).
- Temp dirs: every container was `--rm`; the host probe removed its own temp dirs (none left in
  `$TMPDIR`); the macOS mutant tree in the scratchpad deleted.

## Commands (exact)

Host side: `<scratch>` = the session scratchpad, `<repo>` = this checkout.

```sh
# image (only network phase)
docker pull ubuntu:24.04
docker build -t fkit0526:arm64 <scratch>/img
# every measured container — <scratch>/run.sh:
docker run --rm --network none -u ubuntu -e HOME=/tmp -v <repo>:/repo:ro -v <scratch>/bin:/probe:ro fkit0526:arm64 "$@"
# step 2 / 3 / 4 (fresh container per run)
run.sh /probe/suite.sh none     # ×3
run.sh /probe/suite.sh 48       # ×3
run.sh /probe/suite.sh 45 ; run.sh /probe/suite.sh 47
# step 5 — five groups, one fresh container each (cells as in the table)
run.sh /probe/matrix.sh "shipped /bin/dash file real ok 100" "shipped /bin/dash spawn real ok 100" …
# step 6
run.sh /probe/diag.sh m48 /bin/dash real ok
docker run --rm --network none -u ubuntu -e HOME=/tmp --cap-add SYS_PTRACE --security-opt seccomp=unconfined \
  -v <repo>:/repo:ro -v <scratch>/bin:/probe:ro fkit0526:arm64 /probe/diag.sh m48 /bin/dash real ok strace
# step 7 (host): probe.mjs over shipped/m48 × /bin/sh,/bin/dash × file,spawn × wrap,real × 10, then
FKIT_BANNER_ROOT=<scratch>/mac/m48/claude node --test --test-reporter=spec test/update-banner.test.js
# step 8
run.sh /probe/provered.sh
```

Probe and helper scripts follow verbatim (host paths replaced by placeholders).

## Decision log

Every autonomous call and obvious-winner call made unattended in this Build. **No fix was applied** —
investigation only; nothing under `claude/`, `bin/`, `test/` was touched.

1. **Owner ruling X1 applied** — added the real-git cells: shipped launcher, real sleep, dash + bash ×
   file + spawnSync, 100 launches each, `git ls-remote` against a local bare repo reached by
   `url.<file://…>.insteadOf = https://github.com/` in the fixture's HOME. No network (`--network none`).
2. **Owner ruling X3 applied** — the worst-case sentence above is the ruled wording, verbatim; measured
   values added beside it.
3. **Owner ruling X2 applied** — step times = the gap between consecutive completion lines (each step's
   result line); it includes the step's own setup (copy + sed, well under 1 s), not the previous step.
4. **Obvious winner, within intent — probe mostly in node, not POSIX sh + a little node.** Same fixture
   recipe as `install()` / `sealedBin()` / `stub()` / `sleepWrapper()`; node gives one portable timer on
   Linux and macOS (BSD `date` has no `%N`). File mode = `spawnSync` with stdout/stderr on a file fd
   (returns at the launcher's exit); pipe mode = `sh -c '… 2>&1 </dev/null | cat'`; spawnSync mode =
   `launch()`'s options exactly.
5. **Obvious winner, within intent — containers run as the non-root `ubuntu` user** (CI's runner is
   non-root; root would change `kill`/`process.kill(pid, 0)` semantics) **and with `--network none`**
   (stricter than the plan's "network only for pulls").
6. **Obvious winner, within intent — image baked once** (apt packages + checksum-verified node in a local
   Dockerfile) instead of installing per container: one network phase, identical bits per run.
7. **Within intent — extra `stall` cells** (shipped launcher, 3 launches × 6) to check the X3 worst-case
   sentence against measurement. Measurement only.
8. **Within intent — step 6 run on the m48 slow case.** Step 6's trigger is "anything slow in step 5";
   only m48 (dash, pipe/spawnSync) and the designed stall cells were slow; no shipped `ok`/`realgit`
   launch was. The strace container needed `--cap-add SYS_PTRACE --security-opt seccomp=unconfined`.
9. **Plan condition not met → skipped** — the `--platform linux/amd64` rerun (trigger: container does not
   reproduce CI's slow 48; it did, 217.1 s vs 217.8 s). No CI run needed; none made.
10. **Correction to the plan's own grounding** — the plan's "≈ 9.5 s per try / more than one holder
    possible" is wrong: one holder, 6.0 s per try, and 13 other tests also cost 6 s each under the mutant.

### Process-review round 1 (fkit-coder, Process-review worker, `fkit-sprint-ship-loop`, 2026-10-19)

Fixes applied without per-fix owner approval under the loop's standing approval. Each: verified
`CORRECT`, mechanical/localized, in-plan (this file only). No obvious-winner calls.

11. **R1** — §0: "13 files under `claude/`" → "12". `git status --porcelain -- claude` lists 12; 1 + 12 + 4 = 17.
12. **R2** — Recommendation item 2: the ~190 s saving and the honest gate now credited to no-stray's
    direct detection (~110 s alone, ~200 s with the name pattern); the name pattern alone stated as
    ~90 s and still red via the 20-tries guard. Numbers from the time-breakdown table.
13. **R3** — Recommendation item 2: dropped "Both can shrink with *test-only* changes"; each sub-bullet
    now says test-only vs shipped code.
14. **R4** — The answer, bullets 2–3: the fd-10 holder is no longer called mutant-only (the shipped
    stall case shows it too); mutant-only = a watchdog outliving a git that answered; the No rests on
    the rule's "only when a pipe is held" route. Verdict unchanged.
15. **R5** — Mechanism: one line saying the cites are working-tree line numbers as of §0, HEAD = +40.
    Checked: `:44`→84, `:61`→101, `:70`→110 at `78b7464`.

## Appendix — probe and helper scripts (verbatim)

### `img/Dockerfile`

```dockerfile
FROM ubuntu:24.04
ARG NODE_ARCH=arm64
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends procps strace git xz-utils ca-certificates curl && rm -rf /var/lib/apt/lists/*
RUN set -e; cd /tmp; V=$(curl -fsSL https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt | sed -n "s/.*node-\(v24[^-]*\)-linux-${NODE_ARCH}\.tar\.xz$/\1/p"); \
  curl -fsSLO https://nodejs.org/dist/$V/node-$V-linux-${NODE_ARCH}.tar.xz; curl -fsSLO https://nodejs.org/dist/$V/SHASUMS256.txt; \
  grep " node-$V-linux-${NODE_ARCH}.tar.xz\$" SHASUMS256.txt | sha256sum -c -; \
  tar -xJf node-$V-linux-${NODE_ARCH}.tar.xz -C /usr/local --strip-components=1; rm -f node-* SHASUMS256.txt; node --version
```

### `run.sh`

```sh
#!/bin/sh
# fresh container per call; repo read-only, no network
exec docker run --rm --network none -u ubuntu -e HOME=/tmp ${PLAT:+--platform $PLAT} -v <repo>:/repo:ro -v <scratch>/bin:/probe:ro ${IMG:-fkit0526:arm64} "$@"
```

### `bin/suite.sh`

```sh
#!/bin/sh
# usage: suite.sh <none|45|47|48>   — runs the banner suite in a fresh copy, as prove-red's run_banner_suite does
set -u
mkdir -p /tmp/w && cp -R /repo/claude /repo/test /repo/package.json /tmp/w/
cd /tmp/w
root=""
case "$1" in
  none) ;;
  45) sedx='s/^    _fkit_dl_kids="\$(ps .*$/    _fkit_dl_kids="" # mutation: child walk dropped/'; guard='ps -A -o pid=' ;;
  47) sedx='s/^    kill -9 \$_fkit_dl_kids .*$/    : # mutation: KILL escalation dropped/'; guard='kill -9 ' ;;
  48) sedx='s/^  kill "\$_fkit_dl_dog" .*$/  : # mutation: watchdog left armed/'; guard='kill "\$_fkit_dl_dog"' ;;
esac
if [ "$1" != none ]; then
  m=/tmp/m$1; mkdir -p $m; cp -R /tmp/w/claude $m/claude; : > $m/package.json
  f=$m/claude/fkit-claude.sh; cp $f $f.orig
  sed -i.bak "$sedx" $f; rm -f $f.bak
  if cmp -s $f $f.orig; then echo "GUARD: no-op"; exit 3; fi
  [ "$(diff $f.orig $f | grep -c '^>')" = 1 ] || { echo "GUARD: wrong target"; exit 3; }
  if grep -q "$guard" $f; then echo "GUARD: did not land"; exit 3; fi
  echo "mutant $1 OK:"; diff $f.orig $f
  root=$m/claude
fi
t0=$(date +%s.%N)
if [ -n "$root" ]; then FKIT_BANNER_ROOT=$root node --test --test-reporter=spec test/update-banner.test.js; rc=$?
else node --test --test-reporter=spec test/update-banner.test.js; rc=$?; fi
t1=$(date +%s.%N)
echo "SUITE rc=$rc wall=$(echo "$t1 - $t0" | awk '{print $1-$3}')"
```

### `bin/probe.mjs`

```js
// Launch-time probe for task 0526. Builds the banner suite's fixture (install root + sealed PATH) and times
// `fkit-claude.sh --help` N times. Usage:
//   node probe.mjs <claude-tree> <shell> <file|pipe|spawn> <wrap|real> <ok|realgit|stall> <N>
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, chmodSync, symlinkSync, cpSync, openSync, closeSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [tree, shell, mode, sleepVar, gitVar, nStr] = process.argv.slice(2);
const N = Number(nStr);
const INSTALLED_SHA = '1111111111111111111111111111111111111111';
const REMOTE_SHA = 'deadbee1111111111111111111111111111111111';
const FAKE_REPO = 'fkit-test/no-such-repo-0257';
const NEEDED_TOOLS = ['dirname', 'sed', 'head', 'cut', 'tr', 'find', 'awk', 'cat', 'printf', 'test', 'expr',
  'sleep', 'ps', 'mktemp', 'rm', 'env'];
const MADE = [];
const temp = (p) => { const d = mkdtempSync(join(tmpdir(), p)); MADE.push(d); return d; };
const which = (t) => { const r = spawnSync('/bin/sh', ['-c', `command -v ${t}`], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim().split('\n')[0] : null; };

// Fixture, as test/update-banner.test.js builds it (install(), sealedBin(), stub(), sleepWrapper()).
const root = temp('p-root-');
cpSync(join(tree, 'claude'), join(root, 'claude'), { recursive: true });
writeFileSync(join(root, '.version'), `version=9.9.9\nsha=${INSTALLED_SHA}\nrepo=${FAKE_REPO}\nref=main\n`);
const bin = temp('p-bin-');
for (const t of NEEDED_TOOLS) {
  const p = which(t);
  if (!p) continue;
  if (t === 'sleep' && sleepVar === 'wrap') {
    writeFileSync(join(bin, 'sleep'), `#!/bin/sh\nprintf '%s\\n' "$$" >> "\${FKIT_TEST_SLEEP_LOG:-/dev/null}"\nexec '${p}' "$@"\n`);
    chmodSync(join(bin, 'sleep'), 0o755);
  } else { try { symlinkSync(p, join(bin, t)); } catch { /* builtin */ } }
}
const stub = (name, body) => { writeFileSync(join(bin, name), `#!/bin/sh\nprintf '%s\\n' "$*" >> "$FKIT_TEST_${name.toUpperCase()}_LOG"\n${body}\n`); chmodSync(join(bin, name), 0o755); };
const home = temp('p-home-');
if (gitVar === 'ok') stub('git', `case "$1" in\n  ls-remote) printf '%s\\tHEAD\\n' '${REMOTE_SHA}'; exit 0 ;;\nesac\nexit 1`);
if (gitVar === 'stall') stub('git', ['echo stalling >> "$FKIT_TEST_GIT_LOG"', 'sleep 20 &', 'wait', `printf '%s\\tHEAD\\n' '${REMOTE_SHA}'`].join('\n'));
if (gitVar === 'realgit') {
  // Real git, file transport, no network: https://github.com/<repo>.git is rewritten to a local bare repo.
  const realGit = which('git');
  symlinkSync(realGit, join(bin, 'git'));
  const store = temp('p-bare-');
  const bare = join(store, FAKE_REPO + '.git');
  const g = (args, cwd) => { const r = spawnSync(realGit, args, { cwd, encoding: 'utf8', env: { ...process.env, HOME: home, GIT_CONFIG_NOSYSTEM: '1' } });
    if (r.status !== 0) { console.error(r.stderr); process.exit(2); } return r.stdout; };
  g(['init', '-q', '--bare', '-b', 'main', bare]);
  const wt = temp('p-wt-');
  g(['init', '-q', '-b', 'main', wt]);
  writeFileSync(join(wt, 'VERSION'), '9.9.10\n');
  g(['-c', 'user.name=t', '-c', 'user.email=t@invalid', 'add', 'VERSION'], wt);
  g(['-c', 'user.name=t', '-c', 'user.email=t@invalid', 'commit', '-q', '-m', 'x'], wt);
  g(['push', '-q', bare, 'main'], wt);
  writeFileSync(join(home, '.gitconfig'), `[url "file://${store}/"]\n\tinsteadOf = https://github.com/\n`);
}

const launcher = join(root, 'claude', 'fkit-claude.sh');
const times = []; let banners = 0, sleepLogged = 0, gitCalled = 0;
for (let i = 0; i < N; i++) {
  const logs = temp('p-log-');
  const env = { PATH: bin, HOME: home, FKIT_NO_SELF_HOST: '1', FKIT_UPDATE_INTERVAL_MIN: '0',
    FKIT_TEST_GIT_LOG: join(logs, 'git'), FKIT_TEST_CURL_LOG: join(logs, 'curl'), FKIT_TEST_SLEEP_LOG: join(logs, 'sleep') };
  const cwd = temp('p-cwd-');
  const outF = join(logs, 'out');
  const t0 = process.hrtime.bigint();
  if (mode === 'spawn') {
    // launch()'s options exactly: no stdio option (all three are pipes), env from nothing.
    const r = spawnSync(shell, [launcher, '--help'], { cwd, env, encoding: 'utf8' });
    writeFileSync(outF, r.stdout || '');
  } else if (mode === 'file') {
    const fd = openSync(outF, 'w');
    spawnSync(shell, [launcher, '--help'], { cwd, env, stdio: ['ignore', fd, fd] });
    closeSync(fd);
  } else {
    const fd = openSync(outF, 'w');
    spawnSync('/bin/sh', ['-c', '"$0" "$1" --help 2>&1 </dev/null | cat', shell, launcher], { cwd, env, stdio: ['ignore', fd, 'ignore'] });
    closeSync(fd);
  }
  times.push(Number(process.hrtime.bigint() - t0) / 1e9);
  if (readFileSync(outF, 'utf8').includes('↑ fkit')) banners++;
  if (existsSync(env.FKIT_TEST_SLEEP_LOG)) sleepLogged++;
  if (existsSync(env.FKIT_TEST_GIT_LOG) || gitVar === 'realgit') gitCalled++;
}
const s = [...times].sort((a, b) => a - b);
const med = s[Math.floor(s.length / 2)];
const over2 = times.filter((t) => t > 2).length;
console.log(`CELL tree=${tree.split('/').pop()} shell=${shell} mode=${mode} sleep=${sleepVar} git=${gitVar} N=${N} ` +
  `min=${s[0].toFixed(3)} med=${med.toFixed(3)} max=${s[s.length - 1].toFixed(3)} over2s=${over2}/${N} banner=${banners}/${N} sleepLogged=${sleepLogged}/${N}`);
// Let an armed (mutant) watchdog finish before cleanup, so its late kill cannot land on the next cell.
if (tree.includes('m48')) spawnSync('sleep', ['7']);
MADE.forEach((d) => { try { rmSync(d, { recursive: true, force: true }); } catch {} });
```

### `bin/matrix.sh`

```sh
#!/bin/sh
# usage: matrix.sh <cells...>; each cell = "tree shell mode sleep git N" with tree in {shipped,m48}
set -u
mkdir -p /tmp/w && cp -R /repo/claude /tmp/w/ ; mkdir -p /tmp/shipped /tmp/m48
cp -R /tmp/w/claude /tmp/shipped/claude
cp -R /tmp/w/claude /tmp/m48/claude
f=/tmp/m48/claude/fkit-claude.sh; cp $f $f.orig
sed -i.bak 's/^  kill "\$_fkit_dl_dog" .*$/  : # mutation: watchdog left armed/' $f; rm -f $f.bak
[ "$(diff $f.orig $f | grep -c '^>')" = 1 ] && ! grep -q 'kill "\$_fkit_dl_dog"' $f || { echo GUARD-FAIL; exit 3; }
rm -f $f.orig
while [ $# -gt 0 ]; do
  set -- $1 "$@"; t=$1 sh_=$2 m=$3 sl=$4 g=$5 n=$6; shift 6; shift
  node /probe/probe.mjs /tmp/$t "$sh_" "$m" "$sl" "$g" "$n"
done
```

### `bin/diag.sh`

```sh
#!/bin/sh
# Step 6: who holds a slow spawnSync launch? usage: diag.sh <shipped|m48> <shell> <wrap|real> <ok|stall> [strace]
set -u
mkdir -p /tmp/shipped /tmp/m48
cp -R /repo/claude /tmp/shipped/claude; cp -R /repo/claude /tmp/m48/claude
sed -i 's/^  kill "\$_fkit_dl_dog" .*$/  : # mutation: watchdog left armed/' /tmp/m48/claude/fkit-claude.sh
grep -c 'mutation: watchdog left armed' /tmp/m48/claude/fkit-claude.sh
echo "pid_max=$(cat /proc/sys/kernel/pid_max)"
snap() {
  echo "--- snapshot at +$1 s"
  ps -eo pid,ppid,etime,args | grep -v -e ' ps -eo' -e grep
  for d in /proc/[0-9]*; do
    p=${d#/proc/}; [ "$p" = "$$" ] && continue
    case "$(tr '\0' ' ' < $d/cmdline 2>/dev/null)" in
      *fkit-claude*|sleep*) echo "raw $p:"; ls -l $d/fd 2>&1 | sed 's/^/    /' ;;
    esac
    l=$(ls -l $d/fd 2>/dev/null | awk '/pipe:/ {print $(NF-2)"->"$NF}' | tr '\n' ' ')
    [ -n "$l" ] && echo "fds pid=$p $(tr '\0' ' ' < $d/cmdline | cut -c1-60): $l"
  done
}
( sleep 1.5; snap 1.5; sleep 2; snap 3.5 ) &
if [ "${5:-}" = strace ]; then
  strace -f -tt -e trace=process,kill,wait4,read,dup2,dup3,fcntl,close -o /tmp/strace.txt \
    node /probe/probe.mjs /tmp/$1 "$2" spawn "$3" "$4" 1
  wait
  echo "--- strace (filtered)"
  grep -E 'fcntl\(.*F_DUPFD|dup2|clone|execve|kill\(|exit_group|\+\+\+ exited|wait4\(' /tmp/strace.txt | grep -v -E 'node|resumed>.*= -1 ECHILD' | sed -n '1,400p'
else
  node /probe/probe.mjs /tmp/$1 "$2" spawn "$3" "$4" 1
  wait
fi
```

### `bin/provered.sh`

```sh
#!/bin/bash
# Step 8: full prove-red in a fresh container; every output line stamped with its arrival time.
cp -a /repo /tmp/w && cd /tmp/w || exit 2
start=$(date +%s.%N); echo "$start START"
bash test/prove-red.sh 2>&1 | while IFS= read -r l; do printf '%s %s\n' "$(date +%s.%N)" "$l"; done
echo "$(date +%s.%N) END rc=${PIPESTATUS[0]}"
```

### `matrix-linux.sh`

```sh
#!/bin/sh
S="$(dirname "$0")"; R="$S/run.sh"; O="$S/out/${TAG:-linux}"
mkdir -p "$O"
$R /probe/matrix.sh "shipped /bin/dash file real ok 100" "shipped /bin/dash spawn real ok 100" "shipped /bin/bash file real ok 100" "shipped /bin/bash spawn real ok 100" > $O/g1.txt 2>&1
$R /probe/matrix.sh "shipped /bin/dash file real realgit 100" "shipped /bin/dash spawn real realgit 100" "shipped /bin/bash file real realgit 100" "shipped /bin/bash spawn real realgit 100" > $O/g2.txt 2>&1
$R /probe/matrix.sh "shipped /bin/dash pipe real ok 10" "shipped /bin/bash pipe real ok 10" \
  "shipped /bin/dash file wrap ok 10" "shipped /bin/dash pipe wrap ok 10" "shipped /bin/dash spawn wrap ok 10" \
  "shipped /bin/bash file wrap ok 10" "shipped /bin/bash pipe wrap ok 10" "shipped /bin/bash spawn wrap ok 10" > $O/g3.txt 2>&1
$R /probe/matrix.sh "m48 /bin/dash file real ok 10" "m48 /bin/dash pipe real ok 10" "m48 /bin/dash spawn real ok 10" \
  "m48 /bin/dash file wrap ok 10" "m48 /bin/dash pipe wrap ok 10" "m48 /bin/dash spawn wrap ok 10" \
  "m48 /bin/bash file real ok 10" "m48 /bin/bash pipe real ok 10" "m48 /bin/bash spawn real ok 10" \
  "m48 /bin/bash file wrap ok 10" "m48 /bin/bash pipe wrap ok 10" "m48 /bin/bash spawn wrap ok 10" > $O/g4.txt 2>&1
$R /probe/matrix.sh "shipped /bin/dash file real stall 3" "shipped /bin/dash pipe real stall 3" "shipped /bin/dash spawn real stall 3" \
  "shipped /bin/bash file real stall 3" "shipped /bin/bash pipe real stall 3" "shipped /bin/bash spawn real stall 3" > $O/g5.txt 2>&1
echo MATRIX-DONE
```

### `matrix-mac.sh`

```sh
#!/bin/sh
# macOS control (step 7): same probe on the host. Trees are built in the scratchpad, never in the repo.
set -u
S="$(cd "$(dirname "$0")" && pwd)"; W="$S/mac"; O="$S/out/mac"; mkdir -p "$O"
rm -rf "$W"; mkdir -p "$W/shipped" "$W/m48"
cp -R <repo>/claude "$W/shipped/claude"
cp -R <repo>/claude "$W/m48/claude"
f="$W/m48/claude/fkit-claude.sh"; cp "$f" "$f.orig"
sed -i '' 's/^  kill "\$_fkit_dl_dog" .*$/  : # mutation: watchdog left armed/' "$f"
[ "$(diff "$f.orig" "$f" | grep -c '^>')" = 1 ] && ! grep -q 'kill "\$_fkit_dl_dog"' "$f" || { echo GUARD-FAIL; exit 3; }
rm -f "$f.orig"
for t in shipped m48; do for sh_ in /bin/sh /bin/dash; do for m in file spawn; do for sl in wrap real; do
  node "$S/bin/probe.mjs" "$W/$t" "$sh_" "$m" "$sl" ok 10
done; done; done; done > "$O/probe.txt" 2>&1
echo MAC-DONE
```
