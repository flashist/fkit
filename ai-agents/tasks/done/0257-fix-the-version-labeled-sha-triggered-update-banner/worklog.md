# Worklog — task 0257 (fix the version-labeled, sha-triggered update banner)

Build worker, spawned by `/fkit-sprint-ship-loop` (the lead's sprint driver) under the
declared-approval marker, 2026-08-13. Scope boundary: `plan.md` in this folder, owner-approved the
same day. Nothing here was committed or pushed.

## 1. Reproduction — done before the fix, by execution

The brief required reproducing the defect before proposing a remedy. The planning worker did so with
a hand-built fake install root; **this worker reproduced it again, differently and more usefully**:
the new suite was written first and run against the **unfixed** launcher, so the reproduction is a
recorded red bar rather than a transcript.

`node --test test/update-banner.test.js` at HEAD `3aa5c42`, launcher unmodified — **7 of 14 red**:

| Case | Rendered by the unfixed launcher |
|---|---|
| equal versions, differing sha | `↑ fkit v9.9.9 → v9.9.9 is available. Run:  fkit update` |
| curl present but failing | `↑ fkit v9.9.9 → v? is available. Run:  fkit update` |
| curl absent (sealed PATH) | `↑ fkit v9.9.9 → v? is available. Run:  fkit update` |
| `.version` with no `version=` line | `↑ fkit v? → v? is available. Run:  fkit update` |
| non-default ref | (ref never named at all) |
| real `fkit coder` launch | `↑ fkit v9.9.9 → v9.9.9 is available. Run:  fkit update` |

All three defects confirmed on the same line, including the third one the brief did not name (the
**installed** side rendering `v?` — plan §3(c)). The seven that were green stayed green: the
version→version sentence for genuinely differing versions, all four silences, the throttle, `.latest`.

**One of the seven reds was MY OWN test bug, not the launcher's** — `installed sha == remote sha:
complete silence` asserted `!stdout.includes('fkit update')`, but this suite drives the launcher
through `--help`, whose help text legitimately documents the `fkit update` verb. Corrected to assert
on the `↑` marker, which only the banner ever prints. Recorded because a red bar that is really a
test bug is exactly the kind of thing that gets quietly "fixed" by weakening the wrong side.

After the launcher fix: **14/14 green.**

## 2. What changed

| File | Change |
|---|---|
| `claude/fkit-claude.sh` | `:142-143` → `:142-158`. The banner splits in two: the original `vA → vB` sentence when there are two distinct **known** versions, otherwise a newer-content sentence carrying the abbreviated shas. Trigger untouched. |
| `test/update-banner.test.js` | **New**, 14 tests. Owner ruling 3 (new file, not a `launcher-contract.test.js` group). |
| `test/prove-red.sh` | New `run_banner_suite()` seam (`FKIT_BANNER_ROOT`), step `0j`, mutations **16** and **17**, header index FIFTEEN → SEVENTEEN. |
| `ai-agents/knowledge-base/architecture.md` | `:388-399` self-update bullet rewritten (both renderings, `:121-141` → `:125-161`); `:54` `:64,74-93` → `:69,79-98`; `:438` `:434` → `:449`. |

**Not touched**, per the plan and the spawn's stop-signs: `VERSION`, `install.sh`, `bin/release.mjs`,
`test/harness.mjs`, `test/launcher-contract.test.js`, `ai-agents/wiki-vault/`. The vault resync task
was **not** filed (owner ruling 4 routes it to a producer after 0257 lands).

## 3. Decision log — calls made without asking

Under ADR-019's discipline, carried to this spawn by ADR-032 Decision 3. Each entry: what, why it
qualified.

1. **Test driver is `--help`, not `FKIT_SETUP_ONLY=1`** — a deliberate deviation from plan §5.
   *Obvious winner within the plan's intent.* The plan's own §8 states the fixture "only needs enough
   tools to reach line 146", and the sealed PATH is what §8 calls the biggest trap. `FKIT_SETUP_ONLY`
   still runs the full init at `:339`, which needs a toolchain the seal deliberately withholds — the
   two halves of the plan are in tension and only one can hold. `--help` exits 0 at `:163-177`,
   immediately past the banner block, so the seal is achievable and nothing is written outside the
   fixture. **The gap this opens is closed by an added 14th test** that drives a real
   `fkit coder` setup-only launch and requires the same banner, so "the banner is an artifact of
   `--help`" is refuted by execution rather than by argument. **Surfaced to the driver** — it is a
   visible departure from an approved plan's text, even though it serves that plan's stated intent.
2. **Four tests beyond the plan's ten** — `.latest`'s `unknown` fallback, a non-default ref, the
   no-`version=` line case (plan §3(c)'s third defect, which had no assertion of its own), and the
   real-role-launch fidelity case. Mechanical, localized, all inside the approved change surface.
3. **`architecture.md:438` (`:434` → `:449`)** — not named in the plan. **My edit caused it**: adding
   15 lines at `:142` shifted every later launcher line, and this citation was one of the very few
   that was *accurate* before. Repairing damage I introduced, not widening scope.
4. **Fixed my own test bug** rather than the launcher, in the `--help`/`fkit update` case above.

**Not done, deliberately — surfaced instead of decided:** `architecture.md:333` (`:66-72`),
`:386` (`:104-118`) and `:395` (`_fkit_is_source_checkout`, `:72`) are **also stale**, but were
already stale at HEAD and sit **before** line 142, so my change did not move them. The plan named
only `:390` and `:54`. Repairing them is a one-token edit with near-zero risk, but it is outside the
approved plan and pre-existing, so it is reported to the driver rather than taken.

## 4. Verification

Exit codes captured with `echo "$?"` on the line after the command, never through a pipe.

| Check | Result |
|---|---|
| `node --test test/update-banner.test.js`, launcher UNFIXED | exit **1** — 7 red (the reproduction, §1) |
| `node --test test/update-banner.test.js`, launcher fixed | exit **0** — 14/14 |
| `node --test test/*.test.js` | exit **0** — **723 tests, 0 fail** (709 baseline + 14 new) |
| `sh -n` on both mutant launchers | both syntactically valid — a mutation that breaks the shell would red everything and prove nothing |
| `bash test/prove-red.sh` | exit **0** — all 10 baselines green (incl. new `0j`), **all 17 mutations red at their NAMED assertion**, no no-op warning |
| `npm test` (unit + prove-red, run literally) | exit **0** — 723 pass / 0 fail; hard gate PASSED. Unit half 57.8 s; whole run ≈ 6 min |

**The seal, which is the whole test** (plan §8: two planning runs silently hit the real network).
Every case in the new file runs on a PATH containing **only** symlinked coreutils plus the stubs that
case wants; the real `git` and `curl` are unreachable in all 13 sealed cases. The seal is **proven,
not assumed**, in both directions: `assertUnreachable()` re-derives `command -v curl` from the same
PATH string the launcher was handed, and every stub logs its argv so a test can assert *our* binary
answered. The 14th case (the real-role launch) needs a working toolchain, so it prepends the stub dir
to the inherited PATH instead — and asserts `git` and `curl` both resolve **into the stub dir** before
launching, plus that the git stub was actually called. Belt-and-braces: the fixture's repo is
`fkit-test/no-such-repo-0257`, which does not exist, so even a leak fetches nothing.

**Not tested, stated plainly** (plan §8, unchanged): the 5 s network ceiling. It is enforced by
`GIT_HTTP_LOW_SPEED_TIME` and `curl --max-time`, which a stub binary ignores by construction — a
stub-based timeout test would assert nothing.

**Accepted residual, unchanged from plan §8:** an install whose `.version` carries `sha=unknown`
(`install.sh:63`'s own fallback) renders `(unknown → deadbee)` and re-banners once per throttle
window until `fkit update` self-heals it. Honest output; no guard added.

**CI:** not run here. Every tool path in the fixture is resolved with `command -v` rather than
hard-coded under `/usr/bin`, which is the mitigation plan §8 asked for on `ubuntu-latest`, but that
is a mitigation, not a measurement — **the ubuntu behaviour of the sealed-PATH cases is unverified
until CI runs.**

---

# Verify worker — 2026-08-13

Spawned by `/fkit-sprint-ship-loop` under the declared-approval marker. Scope: apply one owner-ruled
fix, then verify the Build worker's output. Nothing committed or pushed. Plan blob confirmed as the
declared pointer before starting: `git hash-object plan.md` = `236b0a5f91569819b29c040eca3a90424bd7344c`,
12596 bytes — matches the spawn.

## 1. The owner-ruled fix — three stale citations in `architecture.md`

Owner ruling "Fix them now (Recommended)". Each target was **re-derived on disk, not taken from the
report** — the reported line numbers came from another worker and the file had been edited since. Two
of the three reported numbers were right about *which* citation was stale but I set the targets from
the current launcher, and one reported location had itself moved (`:395` → the citation now sits at
`:404`, because the Build worker rewrote `:388-399`).

| architecture.md | Citation | Was | Now | Verified target |
|---|---|---|---|---|
| `:333` | `.version` fields | `claude/fkit-claude.sh:66-72` | `:68-74` | `share=` (`:68`) through the close of `_fkit_verfield` (`:74`), which reads `version`/`sha`/`repo`/`ref` |
| `:386` | `fkit update` verb | `:104-118` | `:99-123` | `_fkit_reinstall` (`:99-103`, the install.sh re-run) + the `update` case arm incl. the source-checkout refusal (`:108-123`) |
| `:404` | `_fkit_is_source_checkout` | `:72` | `:77` | the function's definition line |

All three were **already stale at HEAD** and none was moved by 0257 — confirmed by diffing the
launcher's pre-142 region against `HEAD` (byte-identical) and against `0bc2b36`, the last commit to
touch the file: `share=` has been `:68`, `_fkit_is_source_checkout` `:77`, and the update arm
`:108-123` throughout. So this repairs pre-existing drift, not damage from this task.

⛔ The suite-inventory count was **not** touched (reserved for task `0251`) — it does not appear in
the diff. ⛔ Nothing reworded beyond the citation strings themselves.

## 2. Verification results

Every exit code captured with `echo "$?"` on its own line, **never through a pipe** (zsh
`PIPESTATUS` has misreported on this repo).

| # | Check | Result |
|---|---|---|
| 1 | `node --test test/update-banner.test.js` | **PASS** — exit **0**, 14 pass / 0 fail |
| 2 | `npm test` | **PASS** — exit **0**, **723 pass / 0 fail**, 17 suites, `✓ hard gate PASSED` |
| 3 | The seal | **PASS, proven independently** — see §3 |
| 4 | Banner strings byte-exact; no `v?` on any path | **PASS** — see §4 |
| 5 | Trigger semantics unchanged | **PASS** — `:126-141` byte-identical to HEAD; the diff hunk starts at `:139` and the trigger is `:138`. Still `[ -n "$remote" ] && [ -n "$installed" ] && [ "$remote" != "$installed" ]` |
| 6 | Preserved behaviours genuinely exercised | **PASS with one qualification** — see §5 |
| 7 | Mutations 16/17 red their NAMED assertion; header says SEVENTEEN | **PASS** — `16. banner version guard neutered — "0257/equal-versions" should go RED ... red`; `17. v? placeholder restored — "0257/no-curl" should go RED ... red`; `prove-red.sh:20` reads `SEVENTEEN mutations` |
| 8 | `git status --porcelain` | **PASS** — exactly the expected paths, no others |
| 9 | Forbidden paths untouched | **PASS** — `VERSION`, `install.sh`, `bin/release.mjs`, `test/harness.mjs`, `launcher-contract.test.js`, `wiki-vault/` all clean |

## 3. The seal — verified independently, not taken on the Build worker's word

Three separate lines of evidence, all by execution.

**(a) What the launcher actually receives.** I instrumented a copy of the suite to dump the PATH
string handed to every launch and list its contents. **14 of the 15 launches ran on a PATH of exactly
one directory**, whose entire contents are:
`awk,cat,curl,cut,dirname,expr,find,git,head,printf,sed,test,tr` — coreutils symlinks plus that
case's stubs. In every one, `command -v git` / `command -v curl` resolved **into that temp dir**,
never `/usr/bin`. The two cases whose premise is an absent curl had **no `curl` entry at all** and
`command -v curl` resolved to nothing. The 15th launch is the documented real-role case, which
prepends the stub dir to the inherited PATH — and there both `git` and `curl` still resolved into the
stub dir, so the shadowing holds.

**(b) The tests fail if the seal breaks.** I built a mutant of the suite that unseals only the
launcher's PATH (`const PATH = (path || bin) + ':' + process.env.PATH`), leaving the stub dir first.
Result: exit **1**, and **exactly the two tests whose premise is an absent tool went red**, with the
suite's own detection message:

```
AssertionError [ERR_ASSERTION]: curl IS reachable on the supposedly sealed PATH (/usr/bin/curl)
  — this test would pass for the wrong reason
✖ 0257/no-curl: curl unreachable — no "v?", and the seal is proven, not assumed
✖ offline (git fails, curl unreachable): complete silence, exit 0
```

The other 12 stayed green **correctly** — their stubs shadow the real binaries, so they never had a
route to the network to begin with.

**(c) A leak cannot turn a positive test green.** The fixture repo really does not exist:

```
$ git ls-remote https://github.com/fkit-test/no-such-repo-0257.git
remote: Repository not found.
REAL_LSREMOTE_EXITCODE=128        # stdout empty
```

So a leaked real `git` yields an empty `$remote`, the `[ -n "$remote" ]` guard at `:138` fails, and
the launcher goes silent — which **reds** every test that requires a banner. Stated precisely: this
belt-and-braces protects the *positive* cases. A leak could in principle let a *silence* case pass for
the wrong reason; what rules that out is (a) — the tool is simply not on the PATH — not an assertion.

## 4. Banner strings — byte-checked on my own fixture

Built independently of the suite (`env -i`, single-directory PATH, my own stubs) and compared with
`cmp` against files containing the owner-approved text:

```
EQUAL-VERSION RENDERING: BYTE-IDENTICAL to owner-approved
DIFFERING-VERSION RENDERING: BYTE-IDENTICAL to owner-approved
```

All six `v?`-capable paths enumerated by execution, using the owner's real version numbers:

| Case | Rendered |
|---|---|
| installed=0.2.1, remote=0.2.1 (EQUAL) | `↑ fkit v0.2.1 — newer content on main (1111111 → deadbee). Run:  fkit update` |
| installed=0.1.30, remote=0.2.1 (DIFFER) | `↑ fkit v0.1.30 → v0.2.1 is available. Run:  fkit update` |
| remote empty (curl returns nothing) | `↑ fkit v0.2.1 — newer content on main (1111111 → deadbee). Run:  fkit update` |
| curl ABSENT | `↑ fkit v0.2.1 — newer content on main (1111111 → deadbee). Run:  fkit update` |
| no `version=` line, remote known | `↑ fkit — newer content on main (1111111 → deadbee). Run:  fkit update` |
| no `version=` line, curl ABSENT | `↑ fkit — newer content on main (1111111 → deadbee). Run:  fkit update` |

**No `v?` on any path**, installed side included (plan §3(c)). `grep ':-?}' claude/fkit-claude.sh`
returns nothing; the only occurrences of the literal `v?` in the launcher are inside the new
explanatory comment.

## 5. Ruling 1 (`--help` driver) — the gap really is closed

Verified rather than accepted. The 14th test drives a genuine `fkit coder` launch with
`FKIT_SETUP_ONLY=1` and asserts the same newer-content banner, so "the banner is an artifact of
`--help`" is refuted by execution. It is also the one launch that does not run on a fully sealed PATH
— by necessity, since full init needs a real toolchain — and it guards that with `assertReachable`
on both `git` and `curl` before launching, which I confirmed holds in (a) above. **Ruling 1 stands;
not reverted.**

**Preserved behaviours — non-vacuity probed by flipping each premise.** Source-checkout exclusion
(`checkout: true` → `false`), `FKIT_NO_UPDATE_CHECK` (`'1'` → `'0'`), and the throttle
(second launch given `FKIT_UPDATE_INTERVAL_MIN=0`) — **all three went red**, so all three genuinely
exercise what they claim. The offline case is structurally guarded (it asserts the git stub was
called). `.latest` asserts on file contents.

## 6. Decision log — calls made unattended

1. **The three citation fixes** — the owner's fresh ruling; targets re-derived on disk rather than
   copied from the report, which is what caught that the third citation had moved to `:404`.
2. **One finding surfaced, NOT fixed — and a fix of mine that I applied and then reverted.** The
   `installed sha == remote sha: complete silence` test is **vacuity-capable**: swapping its
   `GIT_SAME` stub for `GIT_FAIL` leaves it **passing** (exit 0), because a current install and a
   failed probe are both totally silent — `.latest` is written only inside the trigger branch, so
   nothing observable distinguishes them. I judged a one-line `gitCalls` guard (copied from the
   sibling offline case) to be a mechanical in-plan fix and **applied it — then my own re-probe
   refuted it**: the stub wrapper logs its argv *before* running the body, so `gitCalls` is non-empty
   even when git exits 128. The guard would only catch "git never invoked". I **reverted it**, and
   verified `test/update-banner.test.js` is byte-identical to the Build worker's version. A real fix
   needs a differential assertion (same fixture, differing sha, must banner), which is a judgment call
   about scope — **surfaced to the driver, not taken.** Impact is test-strength only; no shipped
   behaviour is affected, and the sealed PATH means the test does what it says *today*.

---

# Process-review worker — 2026-08-13

Spawned by `/fkit-sprint-ship-loop` under the declared-approval marker. Scope: apply the
`fkit-process-stateful-review` method to `review.md`'s R1–R7, folding in four fresh owner rulings.
Plan blob confirmed before starting: `git hash-object plan.md` =
`236b0a5f91569819b29c040eca3a90424bd7344c`, 12596 bytes — matches the spawn pointer. Nothing committed
or pushed. Full verdicts and evidence live in `review.md`'s *Coder response*; this is the audit log.

## Decision log — calls made unattended

Under ADR-019's discipline, carried to this spawn by ADR-032 Decision 3. Each entry: which finding it
answers, what changed, why it qualified.

1. **R1 — corrected four false timeout claims (docs + comments).** `architecture.md:54`, `:388`,
   `:586` and `claude/fkit-claude.sh:69` + `:60-63`. *Qualified:* verified CORRECT **by execution**
   (12 s measured with a sleeping `ls-remote` stub on a sealed PATH), and it is the owner's explicit
   ruling 1, which named these exact targets. Localized: comment and prose text only, no logic.
   ⛔ `_fkit_remote_sha` untouched; ⛔ suite-inventory count untouched.
2. **R2 — softened the "No path renders `v?`" comment.** *Qualified:* verified CORRECT by execution
   (remote `VERSION` of `?` → `v?`; an HTML error page → `v<!DOCTYPEhtml>`, both reproduced here).
   Owner ruling 2 named the remedy exactly. Comment-only; ⛔ no validation added.
3. **R3 — added the `ls-remote` + `assertReachable` guard to the sha==sha test.** *Qualified:*
   mechanical, matches tests 4 and 8 verbatim, and is the owner's precise remedy under ruling 3.
   **Not taken on trust:** the previous verify worker's refutation was re-confirmed, and the guard was
   probed both ways — reds when the probe never ran, still green on a *failed* probe. The limitation
   is documented in the test itself rather than papered over.
4. **R4 — asserted the curl stub was actually asked for the remote `VERSION`.** *Qualified:*
   mechanical, copied from the sibling case, owner ruling 3. Proven: the exact mutation that was green
   before now reds at its named test.
5. **R5 — corrected the stale citations, and a FOURTH the reviewer did not report.** The three named
   (`:126-165`, `:168-196`, `:511`) plus `test/update-banner.test.js:73` (`:177`→`:196`). *Qualified as
   an obvious winner within the plan's intent:* it is the same defect, same class, same file, same
   diff, and ruling 3 says "re-derive each target on disk" — leaving one known-stale citation behind
   while fixing its three neighbours would be indefensible. All four re-derived on disk, not copied.
   Also replaced a verbatim plan quotation containing a now-meaningless "line 146" with a paraphrase,
   rather than silently editing a quote.
6. **`architecture.md:438` (`:449`→`:453`) — repairing damage I introduced.** My R2 comment edit added
   4 lines inside the banner block, shifting every later launcher line. This citation was *accurate*
   beforehand, so restoring it is repair, not scope. Same call the Build worker made at its item 3.

**Surfaced, NOT taken:** four other launcher citations in `architecture.md` (`:257-262,357`,
`:274-285`, `:288-294`, `:311-345`) land on nothing matching their prose at either the old or shifted
line — **already stale at HEAD**, pre-existing, outside this plan. Reported to the driver.

**No obvious-winner call beyond item 5, and no fix applied outside the four rulings.**

## Verification

`npm test` run literally, exit code captured with `echo "$?"`, **never through a pipe**: exit **0**,
**723 pass / 0 fail**, 17 suites, all **17 mutations red at their NAMED assertions**, `0j` green,
`✓ hard gate PASSED`. Seal re-proven by an unseal mutant (reds exactly the two absent-tool cases);
test file then restored byte-identical. Banner behaviour unchanged — every edit is a test assertion or
a comment. **Unverified:** CI on `ubuntu-latest` (not run here).

---

# Round 2, R8 comment-fix worker (2026-08-13)

Bounded, comment-only unit: finish owner ruling 2 ("soften the comment to what the code guarantees")
at the site it did not reach. No new decision — completing an existing ruling.

## Decision log — calls made unattended

1. **Fixed `test/update-banner.test.js:11-12` (the assigned unit).** Answers **R8**. What changed: the
   header's *"No `v?` is reachable on any path"* replaced by the measured guarantee — the launcher no
   longer **substitutes** a `?` for a version it lacks; a `VERSION` whose **content** is `?` still
   renders verbatim, with the three measurements quoted inline. Why it qualified: verified `CORRECT`
   by my own execution before writing (not taken from the report), comment-only and localized, and
   **inside the approved plan** as the explicit unit of work.

2. **Also fixed `test/update-banner.test.js:188` — found by me, not in R8.** What changed: the comment
   on `assertNoPlaceholder()` read *"No path may render a version placeholder"* — the identical
   overclaim, same one-clause class, three lines above the assertion it describes. Softened to "no
   EMPTY version may be papered over". Why it qualified: **obvious winner within the plan's intent** —
   leaving the same false sentence in the same file while fixing its neighbour would reproduce exactly
   the half-applied state R8 exists to close. Mechanical, comment-only.

3. **Softened `ai-agents/knowledge-base/architecture.md:399` rather than leaving it.** R8 flagged it as
   defensible on the narrow word "placeholder" and explicitly delegated the call to me. My verified
   judgement: technically true (`${rver:-?}`/`${curver:-?}` are gone) but it sits one clause after
   listing `v0.2.1 → v?` as a pre-0257 rendering, so a reader asking "can the banner still show `v?`"
   gets the wrong answer — and my cases A and D show it can. Why it qualified: doc/comment-only, no
   behaviour, and within the ruling's stated intent. Recorded as a judgement call because R8 left it
   open, not because it changed scope.

**Measured before writing — the reason this round did not repeat the family's failure.** This comment
family has had a corrected claim itself be wrong three times, so I re-derived everything on a sealed
single-entry `PATH` in the scratchpad (repo untouched) rather than trusting R8. Found **more** than
reported: `v?` reaches **both sides and both renderings**, including case D (`?` on both sides →
`↑ fkit v? — newer content on main …`), i.e. inside the *new* form the fix introduced. Also verified
`assertNoPlaceholder()`'s **five** callers (`:206`, `:237`, `:264`, `:279`, `:398`) before claiming
none contradicts the new text — `:237`/`:264`/`:279` feed an empty version, `:206`/`:398` feed equal
well-formed ones.

**Nothing else applied, and nothing outside the bounds.** No version validation (declined by the
owner); `_fkit_remote_sha` untouched; banner strings byte-exact; trigger untouched; the launcher not
edited at all; the suite-inventory count left for `0251`; the four stale launcher citations and the
reviewer's two left for the driver's separate routing; no commit, no push, no wiki write, `plan.md`
not re-authored, no task filed.

## Verification

**Comment-only, proven not asserted.** The test file is untracked, so there is no git baseline: I
reconstructed the pre-edit file by reversing both edits, then diffed the comment-stripped projections
(full-line `//` and blanks removed) — **empty diff across 247 executable lines**. No assertion,
fixture, stub, or `PATH` construction changed; the seal was never approached.

`npm test` run literally, exit code captured on the following line, **never through a pipe**: exit
**0**, **723 pass / 0 fail**, all **17 mutations red at their NAMED assertions**, `✓ hard gate
PASSED`. Mutations 16 and 17 still red — the comment edits did not break their anchors.

**Unverified:** CI has never run this change; the sealed-PATH fixture (and my probe) are proven on
**macOS only**.

**Residual I introduced:** the `architecture.md` edit turns 2 lines into 6, so that file's own line
numbers past `:399` shift by **+4**. Launcher citations unaffected (`fkit-claude.sh:453` still
resolves to `structure_notice() {`). `review.md`'s references to *architecture.md* line numbers above
`:399` are now off by four — left alone deliberately; renumbering is outside this unit and collides
with the separately-routed citation work.
