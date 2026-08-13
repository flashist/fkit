# Bound the update check's git path — `_fkit_remote_sha` has no deadline and hangs (measured 12 s)

## ID
0284

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner ruling 2026-08-13**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"New task + correct the false claims now (Recommended)"**.

The ruling has **two halves, and only the second is this task's.** The first half — *correct the
false claims* — **was executed inside [`0257`](../../done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md)
and is already on disk.** This row is the *"new task"* half: **fix the hang itself.**

**Second owner ruling 2026-08-13**, same session, same channel — **the option label is the verbatim
text**: **"Fold into 0284 (Recommended)."**

**`_fkit_reinstall` carries no `--max-time` either, and the owner ruled it IN SCOPE for this task** —
not a separate row, and not left out. The owner's reasoning: **same function family, same
missing-deadline defect, same fix shape** — splitting it means touching one file twice and reasoning
about timeouts twice. ⚠️ **This supersedes the out-of-scope exclusion this brief originally carried
on `_fkit_reinstall`.** The reasoning behind that exclusion was sound and **survives as a design
note** — see *"⚠️ Two call sites, possibly two answers"* below. ⛔ **It is a design note now, not a
fence: do not re-exclude the call site.**

### ⛔ THIS IS NOT A DOC FIX. THE DOCS ARE ALREADY CORRECT.

**Read this before scoping anything.** `0257` corrected every false "5 s hard ceiling" claim. Verified
on disk 2026-08-13, all four sites now state the truth:

| Site | What it says today |
|---|---|
| `claude/fkit-claude.sh:69` | *"a real deadline for curl (`--max-time`), but for git only a low-speed STALL bound, so `ls-remote` can outlive it"* |
| `claude/fkit-claude.sh:60-63` | *"throttled, PARTLY time-boxed … the timeout only partly — see `FKIT_NET_TIMEOUT` below, the git path is NOT deadlined"* |
| [`architecture.md`](../../../knowledge-base/architecture.md)`:54` | *"**Only the curl paths are time-boxed** (`--max-time 5`); the `git ls-remote` path sets only `GIT_HTTP_LOW_SPEED_*` … so it has no deadline and can outlive 5 s (measured: 12 s)"* |
| `architecture.md:388-389`, `:591-593` | the same, in the self-update section and the Network cross-cutting bullet |

⛔ **A change that only edits prose has done nothing this task asked for.** ⚠️ **A change that
rewrites those four sites back into a "5 s ceiling" claim without actually building the ceiling is
worse than doing nothing** — it restores the false claim `0257` spent a review round removing.

### The defect, measured

**The check runs in the startup path of every single `fkit` invocation**, before the role menu and
before `exec claude`. `claude/fkit-claude.sh:126-165`. It is supposed to cost nothing and print
nothing when the network is unavailable.

**`_fkit_remote_sha` (`claude/fkit-claude.sh:79-91`) tries git first and has no outer deadline.**
Verified line by line 2026-08-13:

- `:80` — `if command -v git >/dev/null 2>&1; then` — **git is the preferred path**, taken on any
  machine that has git, which is every machine fkit targets.
- `:81-82` — the only bounds set are `GIT_TERMINAL_PROMPT=0`, `GIT_HTTP_LOW_SPEED_LIMIT=1000` and
  `GIT_HTTP_LOW_SPEED_TIME="$FKIT_NET_TIMEOUT"`.
- `:83` — `git ls-remote "https://github.com/$fkit_repo.git" "$fkit_ref"`.
- `:85-88` — the `elif` **curl** branch, which *does* carry `--max-time "$FKIT_NET_TIMEOUT"`. It is
  only reached when git is **absent**.

**`GIT_HTTP_LOW_SPEED_*` aborts an already-running slow *transfer*. It does not bound DNS resolution,
TCP connect, or the TLS handshake** — the three places a captive portal, a black-holing firewall or a
dead proxy actually stall. There is no outer deadline of any kind on that branch.

**`--max-time 5` exists at exactly two lines in this file** — `:86` (`_fkit_remote_sha`'s curl
fallback) and `:94` (`_fkit_remote_version`). Confirmed by reading; **both are curl.**

**Measured twice, independently: 12 s elapsed, exit 0.** A `sleep 12` `git ls-remote` stub on a sealed
`PATH`. Recorded in
[`0257`'s `review.md`](../../done/0257-fix-the-version-labeled-sha-triggered-update-banner/review.md)
R1 (round-1 finding) and re-run in the same file's verification pass. The stub logged `ls-remote`, so
the launcher genuinely took the git branch. **12 s is the stub's sleep, not a ceiling — the real
number is "however long the network takes to give up," which can be minutes.**

### The second undeadlined call site — `_fkit_reinstall` (folded in by owner ruling)

**Re-measured on disk 2026-08-13 for this amendment, by reading the file, not by trusting a prior
citation.** ⚠️ **The number this brief and the driver's own instructions previously carried — `:99-104`
— was wrong by one line.** The function is **`claude/fkit-claude.sh:99-103`**:

| Line | What is there |
|---|---|
| `:99` | `_fkit_reinstall() {   # run the canonical installer for $repo@$ref (refreshes resources + .version)` |
| `:100` | `command -v curl >/dev/null 2>&1 || { echo "fkit: curl is required to update" >&2; return 1; }` |
| `:101-102` | `FKIT_REPO=… FKIT_REF=… curl -fsSL "https://raw.githubusercontent.com/$fkit_repo/$fkit_ref/install.sh" \| sh` — ⛔ **no `--max-time`** |
| `:103` | `}` |
| `:116` | its only call site, inside the `fkit update` verb's `case` arm (`:109-124`) |

**So the file has three `curl` invocations and only two carry a deadline.** `:86`
(`_fkit_remote_sha`'s fallback) and `:94` (`_fkit_remote_version`) carry `--max-time
"$FKIT_NET_TIMEOUT"`; **`:102` carries nothing.** ⚠️ **The statement above that "`--max-time 5` exists
at exactly two lines" is still literally true — that is the point.** It is the third curl that is the
defect.

#### ⚠️ Two call sites, possibly two answers — the design note that replaced the exclusion

**This insight is why `_fkit_reinstall` was originally excluded. The owner overruled the exclusion and
kept the reasoning. Do not lose it.**

**The two call sites do not have the same contract:**

- **`_fkit_remote_sha`** is the **silent startup check**. The user did not ask for it, is not told it
  is happening, and **a stall there blocks a launch** with no explanation. It must be short, silent,
  and invisible.
- **`_fkit_reinstall`** is the **explicit `fkit update` verb**. The user typed it deliberately, is
  **watching a progress line** (`:115` prints `fkit: updating from …`), and **can interrupt with
  `Ctrl-C`**. A download that legitimately takes longer than a startup probe is **normal** here, and a
  visible failure message is acceptable — `:100` already prints one.

⛔ **Collapsing both to one number without thinking is a mistake.** ⚠️ **The two sites may warrant
different deadline values, different failure behaviour, or both** — a tight silent bound on the
startup probe, a looser (or differently-shaped) one on the deliberate verb. ✅ **The plan must state
which it chose and why**, in those terms. It is a real decision, not a copy-paste of `$FKIT_NET_TIMEOUT`
into a third place.

#### ⚠️ A deadline on `:102` bounds LESS than it looks — say so, do not overclaim

Two measured reasons, both verified on disk 2026-08-13:

1. **`install.sh` does its own unbounded network work, and it is ⛔ out of scope.** `install.sh:32`
   (`curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$REF" | tar -xz …`) and `install.sh:59`
   (the GitHub API commit lookup) **carry no `--max-time`**. Bounding `:102` bounds **fetching the
   installer script**, not running it. ⛔ **Do not write, in code comments or prose, that `fkit update`
   is now deadlined.** The defensible claim is narrower and must be stated as such.
2. **`:102` is `curl … | sh` — a timeout mid-transfer feeds a TRUNCATED script to `sh`, which will
   execute it.** ⚠️ `-f` catches an HTTP error status; it does **not** un-execute bytes already piped.
   **A naive `--max-time` here can turn a slow network into a half-run installer**, which is worse
   than the hang it replaced. ✅ **If the plan bounds this line, it must say what stops a partial
   script from executing** (download-to-file-then-run, a completeness check, or a reasoned argument
   that the risk is acceptable). ⛔ **Do not add the flag and move on.**

### ⚠️ THE FIRST PROBE OF THIS WAS A FALSE NEGATIVE. DO NOT REPEAT IT.

**A first attempt read 1 s and nearly became a "refuted".** Recorded verbatim in `0257`'s `review.md`:
*"First attempt read 1 s and was a **false negative** — `sleep` was not on the sealed `PATH`, so the
stub died instantly."*

⛔ **Whoever implements this must seal the `PATH` deliberately AND verify the seal, not assume it.**
The suite already has the idiom and the failure message for exactly this class —
`test/update-banner.test.js` asserts on its own seal and reds with
`curl IS reachable on the supposedly sealed PATH (/usr/bin/curl)`. **A stub that needs `sleep` needs
`sleep` reachable; a seal that hides `sleep` silently converts your timing test into a no-op that
always passes.** Prove the seal in the same run that measures the elapsed time.

### The constraints any remedy must survive — none of them are negotiable

1. **POSIX `sh` only.** The launcher's shebang and its whole contract. No bashisms.
2. **⚠️ `timeout(1)` is NOT POSIX and is absent on stock macOS.** Verified 2026-08-13 on the owner's
   machine: `command -v timeout` → nothing; `command -v gtimeout` → nothing (exit 1). **This is the
   central design question of the task, and it is deliberately NOT pre-decided here.**
3. **Silent when offline, silent when current.** `architecture.md:591-593` and the launcher's own
   `:60-61`. A remedy that prints a timeout warning has broken the contract.
4. **Cheap.** This is startup-path code on every launch.
5. **Exit 0 on every failure path.** `_fkit_remote_sha` ends `return 0` (`:90`) and every branch is
   `|| true`. A watchdog that leaks a non-zero status breaks the surrounding `if`.
6. **⛔ Do not weaken any recorded design property**: never auto-updates, never re-execs, throttled,
   source checkouts excluded. `architecture.md` §5 and the vault's `systems/install-and-self-update`
   page record them.

⚠️ **Constraints 3 and 5 bind the SILENT STARTUP PATH. They are not the `fkit update` verb's
contract.** `_fkit_reinstall` already prints on failure (`:100`) and already **returns 1**
deliberately — its caller (`:116`) branches on that and prints `fkit: update failed.` ⛔ **Do not
"fix" the update verb into silence or into exit 0 in the name of these constraints.** Constraints
1, 2, 4 and 6 bind both call sites.

### What partly hides this today, and why it is not a fix

- **The throttle stamp is written up front** (`:135`, `: > "$stamp"`) — *before* the network call — so
  a hung check still burns the window. ⚠️ **A user hits the hang at most once per
  `FKIT_UPDATE_INTERVAL_MIN` (default 60), not on every launch.** That caps the frequency; it does
  nothing about the duration, and the first launch of the hour is exactly when someone is waiting.
- **`FKIT_NO_UPDATE_CHECK=1`** (`:126`) turns the check off entirely. An escape hatch a user must
  already know about is not a fix.

### Candidate directions — surfaced, NOT pre-decided. Weigh them; the plan gate decides.

⚠️ **This list is a starting point, not a menu to pick from without thinking.** Each has a real cost
and at least one of them changes user-visible behavior on some machines.

| Direction | The cost to weigh |
|---|---|
| **Use `timeout(1)` when present, fall back when absent** | Absent on stock macOS (verified) — so the fallback *is* the primary path for the owner's own platform, and a fallback that only the minority exercises is a fallback nobody tests. |
| **A shell-native watchdog** — background the `ls-remote`, poll, `kill` on expiry | POSIX-expressible, but adds job control, a killed-child exit status to swallow, and a stray background process to reason about on a path that must stay silent and cheap. |
| **Invert the preference: curl first, git as the fallback** | The cheapest change by far — curl already carries a real deadline. But it flips which tool is preferred, and a **git-only machine still hangs**. Does it fix the defect, or narrow it? |
| **Drop git from the sha probe entirely** | Simplest bound. A curl-less machine then gets **no update check at all** — silent, which is arguably contract-compliant, but it is a behavior removal and needs saying out loud. |
| **Bound the whole check block rather than the one helper** | `_fkit_remote_version` is already bounded; wrapping both is uniform but a bigger blast radius on startup-path code. |

⚠️ **If the plan cannot settle the POSIX question on its own evidence, consult `@fkit-architect`
before building.** This is a portability question with a shell-idiom answer, and it is exactly the
kind of call the architect exists for. **Do not guess between the rows above.**

## What to build

**A real, measured bound on the update check's git path — plus the test that proves it.**

1. **Bound `_fkit_remote_sha`'s git branch** (or the check that calls it — the plan's call, argued
   from the table above). After the change, a `git ls-remote` that never returns must not hold the
   launcher open past a stated, tested ceiling.
2. **Bound `_fkit_reinstall`'s curl too** (`:102`) — **owner ruling 2026-08-13, "Fold into 0284
   (Recommended)."** ⚠️ **Not by pasting the same number.** Decide, and state in the plan: the same
   deadline as the startup probe or a different one, the same silent failure or a visible one, per
   *"⚠️ Two call sites, possibly two answers"* above. ⛔ **And handle the `curl … | sh` truncation
   hazard** named above, or argue explicitly why it is acceptable.
3. **State the ceiling(s), each in one place.** `FKIT_NET_TIMEOUT=5` at `:69` is the existing knob and
   its comment currently documents the *absence* of the bound. If the new mechanism honours it, say
   so there; if either call site needs its own value, explain why two knobs are better than one.
   ⚠️ **The `:69` comment must end up describing what all three curl calls and the git branch actually
   do** — it is the file's single documented statement of the timeout contract.
4. **Correct the four now-outdated prose sites — LAST, from what actually landed.** The four sites in
   the table at the top of `## Context` describe the *unbounded* behavior truthfully today. Once the
   bound exists they become stale in the other direction. ⛔ **Re-derive the new wording from the
   landed code, not from this brief**, and ⛔ **do not restore the words "hard ceiling on any
   update-check network call"** unless the change genuinely delivers that on **every** branch.
5. **Add the coverage, and make it red-provable.**
   - A timing assertion driven by a **sleeping `git ls-remote` stub on a sealed `PATH`**. Codex named
     this seam during `0257`'s review and the reviewer **ran it — it fails today**, so the red is
     already demonstrated to exist.
   - **The seal must be asserted in the same test**, per the false-negative warning above.
   - The silent-when-offline and silent-when-current paths still print nothing and still exit 0.
   - **Extend `test/prove-red.sh`.** It documents **seventeen** mutations in its own header
     (`test/prove-red.sh:20`, `:24-43`; `16`/`17` were added by `0257`) and the header is
     hand-maintained. A new mutation is **#18**, and ⚠️ **the header list must move in the same
     change** — that file's own thesis is that an unexercised gate hides drift, and its header has
     already gone stale once (task `0136` R5).
   - ⛔ **No new devDependency** (ADR-014). Mutations are hand-rolled `sed` by decision (ADR-026).
   - ⚠️ **The `_fkit_reinstall` bound needs its own red too.** Whether that is a second `prove-red`
     mutation (**#19**) or an assertion inside the same one is the plan's call — ⛔ **but a bound
     nothing can turn red is not covered, and the close must not report it as covered.** ⚠️ **A test
     driving the `fkit update` verb must not actually reinstall anything** — it runs the canonical
     installer against the user's real `~/.local/share/fkit`. **Stub the network, and prove the stub
     held**, per the false-negative warning above.
6. **Home for the test:** `test/update-banner.test.js` already owns a self-built fixture for exactly
   this code path and **deliberately does not use `test/harness.mjs`** — the shared harness sets
   `FKIT_NO_UPDATE_CHECK=1` on every run, which turns this whole feature off (stated in that file's
   own header comment). ⚠️ **Whatever file the assertion lands in must not inherit that env var.**
   Whether it belongs in that file or a sibling is the plan's call.

### ⛔ Out of scope

- ⛔ **Any change to the banner's wording or its two renderings.** That is `0257`, landed. This task
  changes *how long the check may take*, never what it says.
- ⛔ **Any change to trigger semantics.** The sha comparison stays (ADR-015 §4).
- ⛔ **Auto-updating, re-execing, prompting, removing the throttle, or removing the source-checkout
  exclusion.**
- ✅ **`_fkit_reinstall` is IN SCOPE — this exclusion was overruled.** **Owner ruling 2026-08-13,
  verbatim label "Fold into 0284 (Recommended)."** It is the same function family, the same
  missing-deadline defect and the same fix shape; splitting it means touching one file twice and
  reasoning about timeouts twice. ⚠️ **The different-contract reasoning that justified the old
  exclusion is preserved as a design note**, not as a fence — see *"⚠️ Two call sites, possibly two
  answers"*. ⛔ **Do not re-exclude it.**
- ⛔ **`install.sh`** and the `.version` file format. ⚠️ **This fence is the reason the `fkit update`
  bound is partial** — `install.sh:32` and `:59` stay unbounded, and no wording may imply otherwise.
  **Report the gap; do not fix it here.**
- ⛔ **`architecture.md` citation numbers.** A citation sweep of that file is
  [`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md). ⚠️ **If this task edits
  `architecture.md` prose it may shift that file's own line numbers again** — see `## Notes`.
- ⛔ **Any `ai-agents/wiki-vault/` write** (ADR-005). The vault's `systems/install-and-self-update`
  page still asserts a 5 s box; correcting it is
  [`0285`](../0285-wiki-resync-of-the-install-and-self-update-page-after-0257/brief.md)'s, and it
  will need a **further** pass after this lands. **Report, do not write.**
- ⛔ No commit, no re-rank, no task-file move (ADR-033).

## Verification steps

1. **Reproduce the hang FIRST, in the worklog, before fixing.** A `sleep`-based `git ls-remote` stub
   on a sealed `PATH`; record the **literal measured elapsed seconds** the launcher takes today.
   ⛔ **Do not copy `12 s` from this brief — measure it.**
2. **Prove the seal in that same run.** Show that `git` resolves to the stub and that `sleep` is
   reachable. ⚠️ **A run that does not demonstrate the seal has not reproduced anything** — that is
   precisely how the first probe produced a false 1 s.
3. **After the fix, the same stub is bounded.** Show the measured elapsed time and the ceiling it is
   being compared against. State whether the bound holds on the **DNS/connect/TLS** stall too, or
   only on the transfer stall — ⚠️ **if it is only the latter, the defect is not fixed and the close
   must say so.**
4. **Silence survives.** A `.version` whose sha equals `main`'s head prints nothing; an offline run
   prints nothing and exits 0. Show both.
5. **`_fkit_reinstall` is bounded, and the bound is measured — not asserted.** A stalling stub for the
   `install.sh` fetch; show the elapsed seconds and the ceiling. ⚠️ **Prove the stub held** (the same
   sealed-`PATH` discipline as step 2) and ⛔ **prove no real install ran** — show
   `~/.local/share/fkit` untouched, or that the run never had a real install root at all.
6. **State the `fkit update` bound's REAL extent, in the close, in plain words.** ⚠️ **Bounding `:102`
   bounds fetching `install.sh`, not running it** — `install.sh:32` and `:59` remain unbounded and are
   ⛔ out of scope. ⛔ **The close may not say `fkit update` is deadlined.** Say which call it bounds.
7. **The `curl … | sh` truncation hazard is answered.** Show what stops a timed-out partial
   `install.sh` from being executed by `sh` — or state the reasoned decision to accept it, in the
   close, out loud. ⛔ **Silence on this point is a failed verification.**
8. **The two call sites' chosen deadlines/behaviours are stated side by side**, with the reason they
   are the same or different. ⛔ **"Both use `$FKIT_NET_TIMEOUT`" with no reasoning does not satisfy
   this step.**
9. **`fkit update`'s own contract is unbroken** — its progress line, its failure message and its
   **non-zero exit on failure** all still behave as before. Quote a run of both outcomes.
10. **No stray process is left behind** if the remedy backgrounds anything. Show it.
11. **Both banner renderings are byte-unchanged** — `0257`'s two forms still render exactly as before.
    Quote them from a run.
12. **`npm test` green; state the measured pass/fail counts.** `test/prove-red.sh` green, with the new
    mutation(s) proving the new assertions can go red, and its **header list updated to match**.
13. **`git diff --stat`** touches `claude/fkit-claude.sh`, `test/` and the four prose sites only —
    ⛔ no `install.sh`, no `VERSION`, no `bin/release.mjs`, ⛔ nothing under `ai-agents/wiki-vault/`.
14. **State plainly what is NOT covered.** ⚠️ **CI has never executed any change to this file**
    (`architecture.md:32-33`: *"the CI half has never actually run"*), and the sealed-`PATH` fixture is
    proven on **macOS only** — `0257`'s reviewer recorded exactly that limitation. ⛔ **Do not claim
    Linux coverage.** ⚠️ **Name the `install.sh` gap here too** (step 6).

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** surfaced as finding **R1** of
  [`0257`](../../done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md)'s stateful
  review (closed 2026-08-13). The reviewer classified the launcher hang itself as *"pre-existing and
  out of code scope"* for `0257` and routed it to its own task; the owner then ruled it a new task on
  **2026-08-13**, verbatim option label **"New task + correct the false claims now (Recommended)"**.
- **Amended 2026-08-13** on a **second owner ruling of the same date and session**, verbatim option
  label **"Fold into 0284 (Recommended)."** — `_fkit_reinstall`'s missing `--max-time` was moved
  **from `## Out of scope` into `## What to build`**, and the different-contract reasoning that had
  justified excluding it was **kept as a design note** rather than deleted. ⚠️ **The location cited
  for that function was also corrected: `:99-103`, not `:99-104`** — re-read from disk during the
  amendment. **That is the sixth recorded instance in this file's history of a cited line number
  being wrong**; the durable anchor is the quoted text.
- **⚠️ ORDERING against [`0285`](../0285-wiki-resync-of-the-install-and-self-update-page-after-0257/brief.md)
  — recorded as a dated note, deliberately NOT a `Depends on:` edge** (the convention this board uses
  for soft ordering). `0285` corrects the vault page to say the git path is **unbounded**, which is
  true today. **If this task lands first, `0285` should describe the bound instead of the gap** —
  otherwise the vault gains a correction that is stale on arrival. ✅ **Preferred order: this row,
  then `0285`.** ⚠️ **It is a preference, not a gate** — `0285` is runnable now and the cost of
  running it early is a second pass, not a wrong result. Say so to whoever schedules them.
- **⚠️ ORDERING against [`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md).** If
  this task edits `architecture.md` prose (`## What to build` step **4**), it **shifts that file's own
  line numbers again**,
  which is the exact hazard `0286` exists to clear. ✅ **Either run `0286` first, or land this one's
  prose edit and let `0286` sweep afterwards.** ⛔ **Running them concurrently against the same file
  is the one combination to avoid.**
- **On merit:** the **Backlog**, unranked, and that is honest. But this is the one row in this group
  with a **user-visible cost**: it sits in the startup path of every `fkit` launch, on the owner's own
  platform, and the failure mode is *the tool appears frozen*. Its claim to attention is higher than a
  docs row's.
- **Blast radius if never done:** on a captive portal, a black-holing corporate proxy, or a dead DNS
  resolver, `fkit` appears hung before it prints anything at all — once per throttle window, with no
  message explaining why. The documentation now describes this accurately, which means the gap is
  **known and recorded rather than closed**.
- **⚠️ Every `:NNN` in this brief is a dated anchor measured 2026-08-13; the durable anchor is the
  quoted text.** `0257`'s own history contains **four** separate cases of a corrected line number
  being wrong again, and this file was edited by that task; **the `:99-104` → `:99-103` correction in
  this amendment is a fifth in the same neighbourhood.** **Re-measure before you cite.**
- **⚠️ The task's title and folder name still say only *"the update check's git path"*.** The scope is
  now **two call sites**, per the second ruling. ⛔ **The file was deliberately not renamed** — a
  rename is a task-file move, which this amendment had no authority to make. **Read `## What to
  build`, not the title, for the scope.**
- Filed 2026-08-13 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of
  the same day. It asked nothing, wrote nothing under `ai-agents/wiki-vault/`, moved no task file,
  changed no existing task's status, priority or location, and committed nothing.
- **Amended 2026-08-13** by a spawned `fkit-producer` (again **no owner channel**), relaying the
  owner's second ruling of that date via the `/fkit-sprint-ship-loop` driver. The amendment re-read
  `claude/fkit-claude.sh` and `install.sh` from disk before writing. It **changed no status, priority,
  sprint field or location**, **moved no task file**, **invoked no mover**, **edited no source file
  and no sprint plan**, **wrote nothing under `ai-agents/wiki-vault/`**, and **committed nothing**.
