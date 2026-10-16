# Plan — 0284: bound the update check's git path, and the `fkit update` installer-script download

## 0. Scope as it stands on disk (re-measured 2026-10-15)
- **Open defect A** — `_fkit_remote_sha()` in `claude/fkit-claude.sh`: the preferred `git ls-remote` branch has no outer deadline. It sets only `GIT_HTTP_LOW_SPEED_*`, which does not bound DNS, connect or TLS.
- **Open defect B** — `_fkit_reinstall()`: the `install.sh` download (`_fkit_script="$(curl -fsSL "https://raw.githubusercontent.com/…/install.sh")"`) has no `--max-time`.
- **Already done by 0481** (the brief's 2026-10-14 note, re-verified): item 2b / step 5b (the env vars reach the installer's `sh`), and the shape of the truncation answer (download into a variable; run only if curl succeeded and the result is non-empty). Not redone. The close quotes `test/update-reinstall.test.js` "0481/version-only" and prove-red mutation 41 green from this change's own `npm test` run. The brief text is not edited.
- **Uncommitted changes:**
  - None touch `claude/fkit-claude.sh`, `test/update-banner.test.js`, `test/update-reinstall.test.js`, `test/prove-red.sh` or `architecture.md`.
  - `CHANGELOG.md` carries 0385's uncommitted `## Unreleased` line; this task adds one line under the same heading.
  - 0334 (P4) edits a different block of `claude/fkit-claude.sh`, and 0508 rewrites its comments later. This task lands first; the only effect is line shifts.

## 1. Direction for the git path: a shell-native watchdog around `git ls-remote`; git stays preferred
Rejected options:
- **`timeout(1)` when present.** Absent on stock macOS, so the fallback would be the owner's primary path anyway.
- **curl-first, or drop git.** `install.sh`'s `resolve_sha()` (out of scope) records the installed sha with `git ls-remote … | awk 'NR==1{print $1}'` first. On a tag-pinned install, `ls-remote` gives the annotated tag OBJECT sha while the commits API gives the COMMIT sha, so flipping only the launcher would show the banner forever. It would also move every check onto the unauthenticated GitHub API (60 requests per hour per IP), and a git-only machine would still hang.
- **Bound the whole check block.** `_fkit_remote_version` and the curl fallback are already deadlined by curl's `--max-time`, which is a total-operation timer.

## 2. Mechanism — new helper `_fkit_deadline` in `claude/fkit-claude.sh` (sketch; final code may differ in naming only)
```sh
_fkit_deadline() (   # <secs> <cmd> [args…] → the command's stdout if it exits 0 within <secs>; else nothing. Always exits 0.
  exec 2>/dev/null
  _fkit_dl_secs="$1"; shift
  _fkit_dl_out="$(mktemp)" || exit 0
  "$@" >"$_fkit_dl_out" &
  _fkit_dl_pid=$!
  ( trap 'kill "${_fkit_dl_nap:-}"; exit 0' TERM
    sleep "$_fkit_dl_secs" & _fkit_dl_nap=$!
    wait "$_fkit_dl_nap" || :
    # git hands the network work to a git-remote-https child; kill that too, or it outlives us
    kill $(ps -A -o pid= -o ppid= | awk -v p="$_fkit_dl_pid" '$2 == p { print $1 }') "$_fkit_dl_pid"
  ) >/dev/null &
  _fkit_dl_dog=$!
  if wait "$_fkit_dl_pid"; then cat "$_fkit_dl_out" || :; fi
  kill "$_fkit_dl_dog" || :
  rm -f "$_fkit_dl_out" || :
  exit 0
)
```
Call site in `_fkit_remote_sha()`:
```sh
    _fkit_deadline "$FKIT_NET_TIMEOUT" env GIT_TERMINAL_PROMPT=0 \
      GIT_HTTP_LOW_SPEED_LIMIT=1000 GIT_HTTP_LOW_SPEED_TIME="$FKIT_NET_TIMEOUT" \
      git ls-remote "https://github.com/$fkit_repo.git" "$fkit_ref" 2>/dev/null \
      | awk 'NR==1{print $1}' || true
```
Design points:
1. **Output goes to a temp file, not a pipe.** A background process that inherits the `$(…)` pipe (a killed git's surviving child, or the watchdog's `sleep`) would hold the launcher open. With a file, the launcher waits only on the git process and the deadline. `install.sh` already requires `mktemp`. If `mktemp` fails, the check is skipped silently.
2. **Output is used only if git exited 0.** A killed git's partial output is thrown away, so a cut-off sha can never trigger the banner.
3. **Git's direct children are killed too.** They are listed with `ps -A -o pid= -o ppid=` before git dies; the stall itself lives in `git-remote-https`. This runs only when the deadline expires, so the normal path never calls `ps`. Without `ps`, or with a BusyBox `ps` that rejects `-A`/`-o`, the bound still holds; only the cleanup gets worse.
4. **The watchdog's own `sleep` is killed on the normal path** by its TERM trap. Leftover risk: a TERM that lands between the fork of `sleep` and the recording of its pid leaves a harmless `sleep` running for up to 5 s.
5. **It fails toward the bound.** If `sleep` is missing or fails, `wait … || :` falls straight through to the kill: git is cut at once and the check stays silent.
6. **Silence.** The helper's own `exec 2>/dev/null` lasts its whole life, including the moment a killed job is reaped (bash prints "Terminated" otherwise). The call site's `2>/dev/null` is a second layer. The test asserts that stderr is `''`.
7. **Exit 0 under `set -e`.** The launcher runs with `set -eu`. The call site (left of a pipe, left of `|| true`) already turns `-e` off, and the helper's guards are a second layer. The helper ends with `exit 0`.
8. **Env vars go through `env(1)`, not a prefix on a function call.** POSIX leaves the prefix form unspecified; it is the same class of bug as 0481's. So `GIT_TERMINAL_PROMPT=0` (the architecture §10 Secrets guard) reliably reaches git, and a test asserts it.
9. **Ctrl-C.** Background jobs of a non-interactive sh ignore SIGINT. If the user hits Ctrl-C, the watchdog still kills git within 5 s. The temp file is left in `$TMPDIR` in that case (accepted).
10. **PID reuse.** Possible only in the microseconds between git's exit and the parent killing the watchdog. Negligible.

The architect ran this helper, both the round-0 form and the subshell form, verbatim under `set -eu` inside `$(…)`. Shells: macOS `/bin/sh` (bash-3.2 POSIX mode), `/bin/dash`, `/bin/bash`. Results in each:
- 200 runs each of a command that fails at once and one that succeeds at once: stderr empty, exit 0.
- A 20 s stall was cut at the 2 s test deadline.
- No `sleep` left running afterwards.

## 3. Ceilings, side by side (brief item 2 / step 8)
| | startup check (`_fkit_remote_sha` git + curl, `_fkit_remote_version`) | `fkit update`'s installer-script download (`_fkit_reinstall`) |
|---|---|---|
| Value | `FKIT_NET_TIMEOUT=5` s per call (existing, fixed) | new `FKIT_INSTALLER_FETCH_TIMEOUT=60` s (fixed in the launcher, not an env setting), as curl `--max-time` |
| Mechanism | git: the `_fkit_deadline` watchdog; curl: `--max-time` | curl `--max-time` (a total-operation timer, including DNS, connect and TLS per curl's docs) |
| On expiry | silent, exit 0, no banner; retried next throttle window | visible: the existing "fkit: could not download install.sh from …" plus "fkit: update failed.", exit 1 |
| Why | unasked and invisible, and it blocks a launch; a failure costs nothing | the user typed it, is watching "updating from…", and can press Ctrl-C. A false failure on a slow but working link is worse than waiting. The file is a few KB, so 60 s is generous yet still ends a black-holed stall with a message |

- **Worst case for the whole check:** at most two calls (the sha probe, then the version fetch only if a sha came back), so about 10 s plus overhead.
- **Two fixed values, because the two contracts differ.** Both are defined on adjacent lines where `FKIT_NET_TIMEOUT` lives today. The comment there becomes the single statement of the timeout contract for all three curl calls and the git branch. `FKIT_INSTALLER_FETCH_TIMEOUT`'s comment says it bounds only the installer-script download and that `install.sh`'s own downloads stay unbounded. It is not on the header's `Env:` list.
- **Truncation (step 7):** a `--max-time` cut-off makes curl exit 28, so the existing `&& [ -n … ] || { …; return 1; }` never runs a partial script. Leftover risk, which predates this task: a body cut short by a server that closes without a length, and that curl reports as success, would still run. raw.githubusercontent sends Content-Length, so a short body there gives exit 18.
- **Extent (step 6):** this bounds fetching `install.sh` only. `install.sh`'s tarball download and its `resolve_sha()` stay unbounded (out of scope). No wording will say `fkit update` has a deadline.

## 4. Files and changes
1. **`claude/fkit-claude.sh`**
   - Add `_fkit_deadline` and change the git call.
   - Add `--max-time "$FKIT_INSTALLER_FETCH_TIMEOUT"` to the install.sh download, and add the constant.
   - Rewrite the `FKIT_NET_TIMEOUT` comment and the header paragraph ("throttled, PARTLY time-boxed … the git path is NOT deadlined") from the landed code. Comments say WHY, in 1–2 lines.
2. **`test/update-banner.test.js`**
   - `NEEDED_TOOLS` gains `sleep`, `ps`, `mktemp`, `rm`, `env`.
   - A logging `sleep` wrapper: logs `$$`, then `exec`s the real sleep.
   - New test `0284/git-deadline`. The stub git checks `command -v sleep` (otherwise it logs NO-SLEEP and exits 99), logs "stalling", runs `sleep 20 &`, logs both pids, `wait`s, then logs "woke". Asserts:
     - the seal: git → stub, sleep → wrapper, curl unreachable;
     - "stalling" logged and "woke" not;
     - elapsed ≥ 4.5 s and < 12 s;
     - exit 0, no banner, stderr `''`.
   - New test `0284/no-stray`: after the stall run and a normal-path (`GIT_OK`) run, every logged pid is dead within 2 s (`process.kill(pid, 0)` → ESRCH).
   - New test `0284/git-env`: the stub records `GIT_TERMINAL_PROMPT`, asserted to be `0`.
   - The header's line cites that this change shifts (`:172-211`, `:214-242`, `:419-423`, `:242`, `:185`) become quoted anchors.
3. **`test/update-reinstall.test.js`**
   - `0284/reinstall-deadline`: the stub curl's argv for the install.sh fetch contains `--max-time 60`.
   - `0284/reinstall-timeout-not-run`: the stub prints a partial script that would write the capture file, then exits 28. Asserts exit 1, the "could not download install.sh" message, "fkit: update failed.", no "now at", and no capture file. Same seal discipline as the existing tests.
4. **`test/prove-red.sh`**
   - Mutation 44: strip `_fkit_deadline "$FKIT_NET_TIMEOUT"` → "0284/git-deadline" goes red.
   - Mutation 45: drop the child walk → "0284/no-stray" goes red while git-deadline stays green.
   - Mutation 46: strip `--max-time "$FKIT_INSTALLER_FETCH_TIMEOUT"` → "0284/reinstall-deadline" goes red.
   - Each gets a step line, a no-op check, a single-line-diff check and a landed-marker check (the mutation-41 pattern).
   - Header FORTY-THREE → FORTY-SIX, plus three index lines. If 0334 lands a mutation first, renumber.
5. **`ai-agents/knowledge-base/architecture.md`**: the four prose sites, re-derived last from the landed code: the §2 "GitHub, over the network" row; §7's automatic-check and `fkit update` bullets; and the §10 Network bullet. No "hard ceiling" unless it is true on every branch. Line-number cites are not swept; the ones this change shifts are reported.
6. **`CHANGELOG.md`**: one `## Unreleased` line, written last from the landed code. It gives the honest bound: about 5 s per call, about 10 s for the whole check at worst. If it mentions update at all, it says "the download of the installer script". This is a flagged departure from the brief's step-13 file list; CONTRIBUTING requires the line.

## 5. Sequencing
1. **Worklog first:** reproduce the hang on the unchanged launcher (a copied `claude/` in a temp install root, sealed PATH, sleeping stub), proving the seal in the same run. Record the literal elapsed seconds.
2. Write the tests; they go red against the current launcher.
3. Implement; the tests go green.
4. **Real-tool measurements, in the worklog:**
   - (a) The real launcher with real git against a local TCP listener that accepts connections and never answers (redirected with a temp `HOME/.gitconfig` `url.<local>.insteadOf`). Expect about 5 s elapsed, and `ps` showing no `git` or `git-remote-http` left. Also run it under `/bin/dash` on macOS; any claim stays "dash semantics on macOS".
   - (b) The real `fkit update`: temp HOME with a `.curlrc` `connect-to` pointing at the listener, a fake install root, nothing real touched. Expect about 60 s, the failure message and exit 1. If that route fails, the close says only that curl was measured with copied flags.
   - What this measures: the listener models a stall after the connection is made (TLS/response). Connect-phase stalls (dropped SYN) and DNS stalls are argued, not measured: the watchdog and `--max-time` stop the process whatever phase it is stuck in.
5. prove-red mutations 44–46, plus the header.
6. Prose (launcher comments, architecture.md), then the CHANGELOG line, last.
7. Run the checks.

## 6. Checks
- Non-`.md` files under `claude/` and anything under `test/` → `npm test` (unit suites + prove-red, about 13 min). Report the pass/fail counts.
- `node --test test/update-banner.test.js test/update-reinstall.test.js`, run repeatedly during the build.
- **Not covered**, to be stated in the close:
  - CI has never run a change to this file.
  - The fixtures are proven on macOS only; no Linux claim.
  - BusyBox/Alpine `ps` is untested.
  - Connect-phase and DNS stalls are argued, not measured.
  - `install.sh`'s own downloads stay unbounded.

## 7. Verification-step mapping
| Brief step | Covered by |
|---|---|
| 1–2 | §5.1 |
| 3 | §5.4a and `0284/git-deadline` |
| 4 | the existing "installed sha == remote sha" and "offline" tests, quoted |
| 5 and 7 | the reinstall tests, §5.4b and §3 |
| 5b | 0481, quoted green from this run |
| 6 | §3 Extent |
| 8 | the §3 table |
| 9 | quoted success and failure runs of `fkit update` |
| 10 | `0284/no-stray` and §5.4a |
| 11 | the banner tests that pin both renderings, quoted |
| 12 | `npm test` counts and mutations 44–46 |
| 13 | diff-stat: `claude/fkit-claude.sh`, three `test/` files, `architecture.md`, `CHANGELOG.md` (flagged) |
| 14 | §6 |

## 8. Open questions
- **Resolved by both approvers:**
  - The CHANGELOG line is added.
  - The stale line cites in `RELEASING.md` and `architecture.md` are reported for a producer follow-up.
  - The wiki page `systems/install-and-self-update` needs a further sync; this is reported to fkit-wiki, with no vault write.
- **OQ4 (owner, non-blocking):** keep the 60 s limit on downloading the installer script fixed (Rec), or make it settable through an environment variable?

## Owner rulings at the plan gate (2026-10-15, AskUserQuestion, fkit-lead session)

This section is the lead's; the plan above and the post-Codex questions below are copied from the
coder's return. Where they differ from the plan above, the rulings and the adopted fixes below govern.

- Post-Codex fixes: **"All six, PQ1–PQ6 (Recommended)"** — PQ1–PQ6 are adopted with their drafted text below. The owner's yes on PQ6 is the `CHANGELOG.md` exception to brief step 13.
- OQ4 (the 60 s installer-script download limit): **"Fixed (Recommended)"** — fixed in the launcher, not an env setting, as planned.
- Plan: **"Approve (Recommended)"**.

## Post-Codex questions (the owner decides; the plan text above is unchanged)

**PQ1 (X1) — escalate the kill.** Recommended option, drafted text, replacing the watchdog's kill line in §2:
> `_fkit_dl_kids="$(ps -A -o pid= -o ppid= | awk -v p="$_fkit_dl_pid" '$2 == p { print $1 }')"; kill $_fkit_dl_kids "$_fkit_dl_pid"; sleep 1; kill -9 $_fkit_dl_kids "$_fkit_dl_pid"`
>
> plus design point 3a: "If TERM is ignored, KILL follows 1 s later, so the ceiling is `FKIT_NET_TIMEOUT` + 1 s even for a TERM-ignoring git." Add a test `0284/term-ignored`: the stub does `trap '' TERM` and then stalls; assert elapsed < 7.5 s. Add mutation 47 (drop the `kill -9`) → that test goes red.

Alternative: keep TERM only and state that the bound assumes git honours TERM.

**PQ2 (X2) — narrow the no-stray claim, no recursive walk.** Recommended, drafted text for §2 design point 3 and the close:
> "Kills git and its direct children (where the network stall lives). A deeper descendant, not seen in normal git operation, could outlive the launcher. It holds no file descriptor of the launcher's, so it never delays the launch."

Alternative: a recursive walk (more code on the expiry path).

**PQ3 (X3) — make the no-stray test deterministic.** Recommended, drafted text for §4.2:
> "`0284/no-stray`: on the stall path, the stub's pids must be dead within 2 s. On the normal path, the watchdog's logged sleep pids must be dead within 6 s (longer than the ≤5 s nap, so the admitted race cannot flake it). The close states the ≤5 s residual."

**PQ4 (X4) — tighten the timing bound.** Recommended, drafted text for §4.2:
> "elapsed ≥ 4.5 s and < 7 s (FKIT_NET_TIMEOUT + 2 s slack; with PQ1, < 7.5 s for the TERM-ignored case)."

**PQ5 (X5) — no copied-flags fallback for the `fkit update` measurement.** Recommended, drafted text for §5.4b:
> "If the `.curlrc` `connect-to` route fails, use a test-only `curl` wrapper on PATH that rewrites only the URL to the local listener and `exec`s the real curl with every flag the launcher passed. That is still the real launcher, the real `fkit update` and the real curl `--max-time`. The close reports elapsed time against the 60 s ceiling."

**PQ6 (X6, X7) — wording and the step-13 exception.** Recommended, drafted text:
> §2 design point 10: "PID reuse: the window runs from the `ps` snapshot to the `kill` — milliseconds, on the expiry path only. A same-user process would have to take a freed PID in that window. Negligible; the standard limit of signalling by PID in shell."
>
> §7, step 13: "satisfied except `CHANGELOG.md` — an owner-approved exception (CONTRIBUTING requires the line)."

The owner's yes on PQ6 is the exception X7 asks for.
