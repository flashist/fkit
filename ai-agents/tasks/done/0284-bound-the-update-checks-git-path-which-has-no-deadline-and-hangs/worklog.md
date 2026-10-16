# Worklog — 0284: bound the update check's git path, and the `fkit update` installer-script download

Build worker, spawned by `fkit-sprint-ship-loop` (driver: fkit-lead), Sprint 12 run, under the
declared-approval marker (ADR-055). Approved plan: `plan.md` in this folder, git blob `46e4fb9`, with
PQ1–PQ6 adopted (owner, 2026-10-15, AskUserQuestion: "All six, PQ1–PQ6 (Recommended)"; OQ4 "Fixed
(Recommended)"; plan "Approve (Recommended)"). Measurements below were taken 2026-10-16 on macOS
(Darwin 25.2.0) unless stated.

## 1. Reproduction — the hang, on the UNCHANGED launcher (brief steps 1–2)

Fixture: a copy of `claude/` in a temp install root (no `.git`, no `package.json`, so not a source
checkout), synthetic `.version` (sha `1111…`, repo `fkit-test/no-such-repo-0284`), a sealed `PATH` of
symlinked coreutils plus a stub `git` that logs its argv, checks `command -v sleep`, logs `stalling`,
runs `sleep $STALL`, logs `woke`, then prints a sha. Driven with `env -i … /bin/sh fkit-claude.sh --help`.

The seal, printed in the same run:

```
== seal: git -> <tmp>/bin/git; sleep -> <tmp>/bin/sleep; curl -> UNREACHABLE
```

Results (literal, measured):

| stub stall | exit | elapsed | git log | stderr | banner |
|---|---|---|---|---|---|
| 12 s | 0 | **12 s** | `ls-remote …`, `stalling`, `woke` | 0 bytes | printed |
| 20 s | 0 | **20 s** | `ls-remote …`, `stalling`, `woke` | 0 bytes | printed |

The launcher waits exactly as long as git does: no deadline on the git path.

## 2. Red first

New tests written before the fix, run against the unchanged launcher:

- `0284/git-deadline`, `0284/term-ignored`: red ("the stall ran to completion — nothing cut it (20.5s)").
- `0284/no-stray`: red (the watchdog's sleeps never existed).
- `0284/reinstall-deadline`: red (no `--max-time 60` in the install.sh curl argv).
- `0284/git-env`: **green before the fix too.** The old prefix form on a real `git` command already
  delivered `GIT_TERMINAL_PROMPT=0`. The test guards the new `env(1)` route; it was never a red-first test.
- `0284/reinstall-timeout-not-run`: **green before the fix too.** 0481's download-then-run shape
  already refuses a failed download (curl exit 28). It pins that a `--max-time` cut cannot run a partial
  script; the deadline's own red is `0284/reinstall-deadline` and mutation 46.

## 3. After the fix — the same reproduction

| shell running the launcher | exit | elapsed | git log | stderr | banner |
|---|---|---|---|---|---|
| `/bin/sh` (bash 3.2, POSIX mode) | 0 | **5 s** | `ls-remote …`, `stalling` (no `woke`) | 0 bytes | none |
| `/bin/dash` | 0 | **5 s** | same | 0 bytes | none |
| `/bin/bash` | 0 | **5 s** | same | 0 bytes | none |

Ceiling compared against: `FKIT_NET_TIMEOUT` = 5 s (+1 s only for a git that ignores TERM).

Test timings, 5 back-to-back runs of the four banner 0284 tests: `0284/git-deadline` 5.35–5.37 s
(ceiling in the test then: < 7 s, now < 10 s per D10); `0284/term-ignored` 6.37–6.38 s (then < 7.5 s,
now < 10.5 s); all 5 runs green.

## 4. Real-tool measurements (plan §5.4)

### (a) Real launcher, real git, local listener that accepts and never answers

`git version 2.50.1 (Apple Git-155)`. A Python listener on 127.0.0.1 accepts connections and never
writes. A temp `HOME/.gitconfig` sets `url.https://127.0.0.1:<port>/.insteadOf https://github.com/`
(confirmed with `git config --global --get-regexp`), so git completes TCP and stalls in the TLS
handshake. Real `PATH` (real git, real curl), `GIT_CONFIG_NOSYSTEM=1`, fake repo name.

Processes during the stall (t = 3 s):

```
<A> <helper>  …/Developer/usr/bin/git ls-remote https://github.com/fkit-test/no-such-repo-0284.git main
<B> <A>       …/libexec/git-core/git remote-https https://github.com/… https://127.0.0.1:<port>/…
<C> <B>       …/libexec/git-core/git-remote-https https://github.com/… https://127.0.0.1:<port>/…
```

| shell | exit | elapsed | stderr | banner | git processes left at +0 s / +2 s |
|---|---|---|---|---|---|
| `/bin/sh` | 0 | **5.10 s** | 0 bytes | none | 0 / 0 |
| `/bin/sh` (repeat ×3) | 0 | 5.10–5.11 s | 0 bytes | none | 0 / 0 |
| `/bin/dash` (dash semantics on macOS) | 0 | **5.09 s** | 0 bytes | none | 0 / 0 |

⚠️ **The network process `git-remote-https` (C) is a GRANDCHILD of the git the watchdog started,
not a child.** The watchdog signals A and its direct child B only. C was still gone by the first
check after the launcher returned. The likely cause is git's own child cleanup when it is signalled.
That is git's behaviour, **not** the watchdog's, and it is measured on Apple git 2.50.1 only. See
the decision log, D1.

What this measures: a stall after TCP connect (the TLS handshake). **A TCP-connect stall (dropped SYN)
and a DNS stall are argued, not measured:** the watchdog signals the process whatever phase it is
stuck in, and curl's `--max-time` is a total-operation timer.

### (b) Real `fkit update`, real curl, the same kind of listener

`curl 8.7.1 (x86_64-apple-darwin25.0) … (SecureTransport)`. Temp `HOME/.curlrc`:
`connect-to = raw.githubusercontent.com:443:127.0.0.1:<port>`. Fake install root (temp dir, synthetic
`.version` with a temp `bin=`). The `.curlrc` route worked, so PQ5's curl-wrapper fallback was not needed.

```
== during (t=10s): curl -fsSL --max-time 60 https://raw.githubusercontent.com/fkit-test/no-such-repo-0284/main/install.sh
== exit=1 elapsed=60.09s
== stdout:
  fkit: updating from fkit-test/no-such-repo-0284@main...
== stderr:
curl: (28) Connection timed out after 60006 milliseconds
fkit: could not download install.sh from fkit-test/no-such-repo-0284@main
fkit: update failed.
```

Ceiling: `FKIT_INSTALLER_FETCH_TIMEOUT` = 60 s. **No real install was touched:** the real
`~/.local/share/fkit/.version` mtime was `Oct 10 10:20:19 2026` before and after. The fake root had
nothing written into it (`find <root> -newer <before-marker>` printed nothing).

⚠️ A first "install root listing unchanged" check printed `NO`. That was a fault in my check, not the
launcher: it diffed `ls -la`, whose `..` line changed because the script wrote its own output files
into the parent directory. Re-checked with `find -newer`: nothing written.

### (c) Success run of `fkit update`, and both banner renderings (brief steps 9 and 11)

Sealed `PATH`, stub git (remote sha `deadbee…`), stub curl serving `VERSION` and a fake installer:

```
## banner, differing versions
  ↑ fkit v9.9.8 → v9.9.9 is available. Run:  fkit update
## banner, equal versions
  ↑ fkit v9.9.9 — newer content on main (1111111 → deadbee). Run:  fkit update
## fkit update, success (stub curl serves a fake installer)
  fkit: updating from fkit-test/no-such-repo-0284@main...
  (fake installer ran for fkit-test/no-such-repo-0284@main)
  fkit: now at v9.9.10 (abcdef0)
  [exit 0]
## curl argv for install.sh:
curl -fsSL --max-time 60 https://raw.githubusercontent.com/fkit-test/no-such-repo-0284/main/install.sh
```

The failure run is (b) above. Both renderings match the pre-0284 forms, which the existing banner
tests also pin.

### (d) Is the `kill -9` reached?

The helper was copied out of the launcher with its `kill -9` line instrumented. It was run with a
TERM-honouring and a TERM-ignoring stub, under `/bin/sh` and `/bin/dash`:

```
/bin/sh honour: KILL line ran: no
/bin/sh ignore: KILL line ran: yes
/bin/dash honour: KILL line ran: no
/bin/dash ignore: KILL line ran: yes
```

When git honours TERM, the launcher TERMs the watchdog while it sits in `sleep 1`. The watchdog's trap
runs after that sleep and exits, so the KILL never fires.

## 5. prove-red mutations 44–47 (run standalone with the exact `sed` lines, before the full gate)

| # | mutation | changed lines | suite result |
|---|---|---|---|
| 44 | strip `_fkit_deadline "$FKIT_NET_TIMEOUT"` | 1 | red: `0284/git-deadline`, `0284/term-ignored`, `0284/no-stray` (each ~20 s) |
| 45 | `_fkit_dl_kids=""` (child walk dropped) | 1 | red: `0284/no-stray` only ("still running 2 s after a timed-out launch"); `0284/git-deadline` green |
| 46 | strip `--max-time "$FKIT_INSTALLER_FETCH_TIMEOUT"` | 1 | red: `0284/reinstall-deadline` only |
| 47 | drop the `kill -9` line | 1 | red: `0284/term-ignored` only; `0284/git-deadline` green |

After all four: no `sleep 20` left running. The tests SIGKILL any logged pid in a `finally`.

## Decision log

Everything below was done without asking, under the standing approval. Each entry gives what was
done and why it qualified.

- **D1 — PQ2's drafted wording corrected to what was measured (obvious winner, within PQ2's intent).**
  PQ2's drafted text says a deeper descendant is "not seen in normal git operation". §4(a) shows the
  opposite on Apple git 2.50.1: `git-remote-https` runs as a grandchild. PQ2's intent was to narrow
  the claim and not add a recursive walk. Both are kept: no recursive walk, no code change. The text
  now states what was measured. The watchdog kills git and its direct children. On the measured git,
  the grandchild that holds the connection was gone at once, by git's own cleanup and not the
  watchdog's. A descendant that outlives the launch holds no file descriptor of the launcher's, so it
  never delays the launch. **The driver should relay this: it changes an adopted text.**
- **D2 — PQ6's PID-reuse wording made exact for the KILL step (obvious winner, within PQ6's intent:
  honest wording).** PQ6 drafts the window as "from the `ps` snapshot to the `kill` — milliseconds".
  That holds for the TERM. PQ1's `kill -9` comes 1 s after the snapshot, so its window is about 1 s.
  §4(d) shows the KILL runs only when git itself ignored TERM. Exact statement: TERM window is
  milliseconds; KILL window is about 1 s, and only when git ignored TERM. Both are on the expiry path
  only, and a same-user process would have to take a freed PID inside that window. Negligible; the
  standard limit of signalling by PID in shell.
  - **Correction, 2026-10-16 (review round 2; owner ruling "Correct it (Recommended)", see D15):** the
    statement above omits one window — on every expiry with a TERM-honouring git, the watchdog's trap
    runs after its `sleep 1` (~1 s after the launcher returns) and TERMs the nap's pid, freed ~1 s
    earlier. Still expiry path only, still PQ6's class.
- **D3 — residual found while checking D2.** When git honours TERM but a direct child of git ignores
  it, the KILL is skipped (§4(d)), so that child can outlive the launch. It holds no launcher file
  descriptor. Same class as D1's residual. Recorded, not fixed: fixing it means the KILL step firing
  even when git has already exited, which widens D2's PID-reuse window.
- **D4 — the comment on the watchdog's kill line** reads "git does its network work in child
  processes", not the plan sketch's "lives in its git-remote-https child". Reason: D1's measurement.
  The comment is otherwise unchanged.
- **D5 — the launcher header keeps the phrase "must cost nothing and print nothing" verbatim.** An
  intermediate edit had changed it, but `architecture.md` §10 and the wiki page
  `systems/install-and-self-update` quote it as an anchor. The rest of that header paragraph was
  rewritten from the landed code, as the plan says.
- **D6 — the banner suite's `sleep` is a logging wrapper in every case, not a symlink.** The plan says
  `NEEDED_TOOLS` gains `sleep` and names a logging wrapper. Writing the wrapper over a symlink would
  write through it to the real `/bin/sleep`. So `sealedBin` writes the wrapper in place of the link.
- **D7 — `|| :` guards on every `kill`, `sleep` and `ps` inside the helper, the trap's `kill`
  included.** Plan §2 point 7 ("the helper's guards are a second layer"). Without them, a partly failed
  `kill` under an inherited `set -e` could end the watchdog before its KILL step.
- **D8 — mutation numbers 44–47; header FORTY-SEVEN (not the plan body's FORTY-SIX).** PQ1 adds
  mutation 47. 0334 had landed no mutation, so no renumbering was needed. The prove-red "1…43" read-a-red
  range, and the 0j/0p unmutated-copy messages, now name the new mutations too.
- **D9 — the stall tests start their clock after the install-root copy.** The plan sets the
  thresholds; this only keeps the fixture's `cp` out of the measured time.
- **D10 — the timing ceilings are now < 10 s (`0284/git-deadline`) and < 10.5 s (`0284/term-ignored`).
  Owner ruling, not a build call.** This amends PQ4's adopted "< 7 s / < 7.5 s". The owner's answer,
  verbatim: **"Widen to < 10 s (Recommended)"**. Date 2026-10-16; channel: AskUserQuestion in the
  fkit-lead session (`fkit-sprint-ship-loop --plan-review` run, Sprint 12), relayed to this Build worker by
  the driver. Why it came up: the first full `npm test` went red at prove-red step 0b, with
  `0284/git-deadline` at 7.086 s under load (see *Checks run*). Changed: the two `assertStallCut`
  ceilings and the slack comment in `test/update-banner.test.js`. Nothing else changed.
- **D11 — `0284/no-stray`'s normal path relaunches until the watchdog's sleep logs a pid (verify cycle
  1 fix; mechanical, test-only, inside the plan).**
  - **Finding it answers:** the independent Verify run (prove-red step 0a) failed with "the watchdog
    never started a sleep — is the deadline wired in?". When the stub git answers at once, the
    launcher can TERM the watchdog before the logging `sleep` wrapper has written its pid. Verify
    reproduced that 9 times in 160 launches under heavy load. The launcher behaved correctly.
  - **What changed:** the normal path reuses one install and one sealed bin. It relaunches with
    `FKIT_UPDATE_INTERVAL_MIN=0`, so the throttle cannot skip the check, up to 20 times, and stops at
    the first launch that logs a sleep. PQ3's assertion then runs unchanged: every logged sleep pid
    dead within 6 s. The "at least one sleep" guard was my own addition, not PQ3 text. It now fails
    only if 20 launches in a row log nothing ("no watchdog sleep in 20 launches"). The launcher was
    not touched.
  - **Why it qualified:** verified correct (the race reproduced, see *Checks run*), localized to one
    test block, and it keeps PQ3's owner-adopted assertion as written. Verify's option (a), the most
    deterministic one, was taken. Option (b), a timed pause in the stub, still depends on timing.
- **D12 — review round 1, R1: `0284/no-stray` now catches a watchdog left armed after git answers;
  prove-red mutation 48 added (Process-review worker, standing approval; fix verified-CORRECT,
  test-only, in-plan; the mutation is an obvious-winner call).**
  - **Finding it answers:** R1 — deleting `kill "$_fkit_dl_dog" || :` left the banner suite 18/18 green.
  - **What changed:** `launch()` also returns `readSleepPids()`. no-stray's normal path keeps only a
    launch that logged a sleep AND took < 4 s, then — after PQ3's unchanged 6 s survivors check — waits
    until 7 s after that launch returned, re-reads the sleep log, and requires no new pid (an armed dog
    wakes at 5 s and logs its KILL-step `sleep 1`). prove-red: mutation 48 (that line → `:`), header
    FORTY-EIGHT, index line, `1…48`, the 0j message, `step end` comment; the banner test's PROVE-RED
    header names 48.
  - **Why it qualified:** verified CORRECT (mutant reproduced: green before, red after); test-only;
    plan §4.2 already says "every logged pid" on the normal path is checked, and a pid logged after the
    launch is a logged pid. The < 4 s guard keeps it from flaking: on the real launcher the KILL step
    can only run if the 5 s nap expired, which needs a launch of ≥ 5 s. **Mutation 48 is an
    obvious-winner call within the plan's intent:** plan §4.4 pairs every 0284 guard with a named
    prove-red mutation (PQ1 added 47 the same way), and R1's whole point is that nothing proves this
    guard red. Cost: one more banner-suite run in prove-red (~1 min), and no-stray ~14 s instead of ~7 s.
  - **Not caught, by design:** deleting the trap's nap kill (the reviewer's second mutant). Within the
    6 s window it is indistinguishable from PQ3's owner-adopted ≤5 s residual.
- **D13 — R2: `reap()` runs only on a failed assertion (verified-CORRECT, test-only, in-plan).**
  - **Finding it answers:** R2 — `reap()` in `finally` SIGKILLed pids the test had just proven dead.
  - **What changed:** in `0284/git-deadline`, `0284/term-ignored` and `0284/no-stray`, `finally` →
    `catch { reap(); throw }`; no-stray reaps only what its last poll still found alive. A green run
    signals nothing.
  - **Why it qualified:** verified CORRECT; localized to three test blocks; the reviewer's own
    direction. Accepted cost: under mutation 45 (git-deadline and term-ignored pass while git's child
    survives) their stub `sleep 20` lingers ≤ 20 s instead of being killed. Nothing gates on it; measured
    none left after the 44 → 45 → 47 standalone sequence.
- **D14 — R3: the slack comment corrected (verified-CORRECT, comment only).** It said "5.5 s with the
  1 s TERM→KILL step"; term-ignored's real slack is 4.5 s. Now: "The 10 s / 10.5 s ceilings leave 5 s of
  slack (4.5 s once the 1 s TERM→KILL step is spent)".
- **D15 — review round 2: two owner rulings applied (docs only; no code or test change).** Round 2
  found 0 new defects and confirmed R1–R3 fixed. Both rulings: 2026-10-16, AskUserQuestion in the
  fkit-lead session (`fkit-sprint-ship-loop --plan-review` run, Sprint 12), relayed by the driver.
  - **"Correct it (Recommended)"** (question: correct the PID-reuse sentence to include the ~1 s stale
    stop-signal on every timeout?) → a dated one-line correction under D2; D2's original text kept.
  - **"Record it (Recommended)"** (question: record "a git helper started at the last instant isn't
    stopped" as an accepted residual?) → `review.md` *Accepted residuals* gains "Late-forked git child
    not signalled" (Codex X1, round 2), same class as PQ2/D1/D3. Re-raise only if a descendant can
    delay the launcher.
  - Both suppressed items verified against the `_fkit_deadline` watchdog block before recording. Ledger
    `Status:` set to `closed-out`: no finding open.
- **D1–D3 were relayed to the owner.** They went in the driver's NEEDS-DECISION return of
  2026-10-16, which asked the driver to relay them. The driver's reply carried the D10 ruling and
  raised no objection to D1–D3. It did not quote an owner answer on them, so this log records them as
  relayed, not as owner-ruled.

## Not covered (plan §6, brief step 14)

- **CI has never run a change to this file.** Everything here was run on the owner's macOS machine only.
- **The fixtures are proven on macOS only.** No Linux claim.
- **BusyBox/Alpine `ps` is untested.** If `ps -A -o pid= -o ppid=` is rejected, the deadline still holds
  (git is still signalled); only the child cleanup is lost.
- **TCP-connect (dropped SYN) and DNS stalls are argued, not measured.** §4(a) measured a stall after
  TCP connect (in TLS).
- **`install.sh`'s own downloads stay unbounded** (its tarball fetch and `resolve_sha()`), so
  `fkit update` as a whole has no deadline. Only fetching `install.sh` is bounded (60 s).
- **Pre-existing truncation residual.** A body cut short by a server that closes without a
  Content-Length, and that curl reports as success, would still run. raw.githubusercontent sends
  Content-Length, so a short body there exits 18.
- **The ≤5 s watchdog-sleep residual.** A TERM that lands between the fork of the watchdog's `sleep`
  and the recording of its pid leaves that `sleep` to finish its ≤5 s alone. It is harmless, and it is
  why `0284/no-stray`'s normal-path window is 6 s.
- **Grandchildren (D1) and TERM-ignoring direct children of a TERM-honouring git (D3)** are not
  signalled by the watchdog. On the measured git they were gone at once anyway.
- **Ctrl-C during a stall** leaves the temp file in `$TMPDIR` (accepted in plan §2 point 9). Not tested.
- **Timing thresholds under heavy load.** `0284/git-deadline` once measured 7.086 s under load (the
  reason for D10). Against the widened 10 s ceiling, no run has failed yet. An even more overloaded
  machine could still push it over.

## Line cites this change shifts (reported, not swept — plan §4.5)

The launcher grew by 3 lines just above `_fkit_verfield` and by 26 lines from `_fkit_reinstall`
onward. Live cites now off by that much:
- `architecture.md`: the §5 runtime-topology diagram (`:127-170`, `:172-212`, `:419-423`, `:578-606`,
  `:627-685`, `:687-737`), the §2 Codex row (`claude/fkit-claude.sh:585-606`), §6
  (`claude/fkit-claude.sh:69-75`), and §7 (`claude/fkit-claude.sh:100-170`).
- `RELEASING.md` (already stale before this change): `fkit-claude.sh:124`, `:80-92`, `:185`, `:203-209`,
  `:93-99`.
- Accepted ADRs keep their historical cites (not touched).

The wiki page `systems/install-and-self-update` needs a further sync for the new bounds. This is
reported for fkit-wiki; nothing in the vault was written.

## Checks run

- `node --test test/update-banner.test.js test/update-reinstall.test.js`, run repeatedly during the
  build → 36 tests, 36 pass, 0 fail. The four banner 0284 tests passed 5 of 5 times back-to-back.
- **`npm test` (2026-10-16, load average 6.6 at start, 8.7 mid-run) → exit 1. RED.**
  - Unit step: 1146 tests, 1146 pass, 0 fail.
  - prove-red: **✗ hard gate FAILED, failed step 0b only.** In 0b (the unmutated full copy, whole unit
    suite in parallel), `0284/git-deadline` failed with *"the launcher was held 7.086s by a stalled git
    (ceiling 7s)"*: 1145 pass, 1 fail. That is the PQ4 timing ceiling being missed under load. It is
    not a bound failure (the stall was still cut; 20 s uncut), and not the known `board-narrow`
    test D timeout.
  - Every other baseline was green, 0j (the update-banner suite alone on an unmutated copy) included,
    and so was 0p. Every mutation 1–47 went red at its named assertion. For 45 and 47, no "git-deadline
    went red too" line was printed. No `sleep 20` was left running afterwards.
- **Resolved by owner ruling D10:** ceilings widened to < 10 s / < 10.5 s. After that change
  (2026-10-16, load average about 9–10):
  - `node --test test/update-banner.test.js test/update-reinstall.test.js` → 36 tests, 36 pass, 0 fail
    (`0284/git-deadline` 5.35 s, `0284/term-ignored` 6.45 s).
  - **Mutation 44 run on its own** with prove-red's exact `sed` line, against the widened test →
    1 line changed, suite exit 1, 15 pass / 3 fail: `0284/git-deadline` ("the stall ran to
    completion — nothing cut it (20.516s)"), `0284/no-stray` and `0284/term-ignored`. No
    `sleep 20` left behind.
  - The full `npm test` was **not** re-run here, per the driver: the loop's Verify step runs it next.
- **Verify cycle 1 (2026-10-16): red at prove-red step 0a, `0284/no-stray` normal path, a test race
  (D11).** After the D11 fix:
  - **Load proof, with 28 `yes` CPU burners on 14 cores:**
    - The raw race on the real launcher: 200 normal-path launches, 2 logged no sleep. So the race
      fires under this load.
    - The fixed test: `0284/no-stray` run 15 times in a row, **15 pass, 0 fail**. Load average reached
      168.
    - ⚠️ A shell word-splitting slip in my clean-up line left the burners running about 8 minutes
      after the measurement ended, briefly pushing load average past 200. They were then killed by pid
      and confirmed gone (0 `yes` processes). No file or repo state was touched.
  - `node --test test/update-banner.test.js test/update-reinstall.test.js` → 36 tests, 36 pass, 0 fail.
  - Mutation 44 on its own → 1 line changed; red at `0284/git-deadline`, `0284/no-stray` and
    `0284/term-ignored` (15 pass / 3 fail).
  - Mutation 45 on its own → 1 line changed; red at `0284/no-stray` only ("still running 2 s after a
    timed-out launch"), 17 pass / 1 fail.
  - No `sleep 20` left behind. Full `npm test` not re-run here, per the driver.
- **Review round 1 fixes, D12–D14 (2026-10-16, load average 6.7–8.1 throughout; no CPU burners):**
  - `node --test test/update-banner.test.js test/update-reinstall.test.js` → 36 tests, 36 pass, 0 fail
    (`0284/git-deadline` 5.34 s, `0284/term-ignored` 6.44 s, `0284/no-stray` 13.86 s). Run twice, green both.
  - Standalone mutants (prove-red's exact `sed` lines, copied tree via `FKIT_BANNER_ROOT`), 1 line each:
    - 48 → red at `0284/no-stray` only ("the watchdog stayed armed after git answered … (28891)"), 17/1;
      `0284/git-deadline` green.
    - 44 → red at git-deadline, term-ignored, no-stray (15/3). 45 → red at no-stray only ("still running
      2 s after a timed-out launch"), 17/1. 47 → red at term-ignored only, 17/1.
  - `bash -n test/prove-red.sh` → OK. No `sleep 20` left after the sequence.
  - Full `npm test` / prove-red **not** run here, per the driver (the lead re-verifies).
