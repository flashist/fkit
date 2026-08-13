# Review — 0257

Task: `ai-agents/tasks/done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md`
File(s) under review:
- `claude/fkit-claude.sh` (the banner block, `:142-162`)
- `test/update-banner.test.js` (NEW, 14 tests)
- `test/prove-red.sh` (`run_banner_suite()`, step `0j`, mutations 16/17, header FIFTEEN→SEVENTEEN)
- `ai-agents/knowledge-base/architecture.md` (citation repairs)

Status: closed-out

**Round 3 verdict: ✅ CLOSED — R8 discharged, all eight findings settled, work product clean.** The
three replacement texts were **measured, not read**: every rendering they quote reproduces
byte-for-byte on a fixture this reviewer built from scratch, and every empty-version path renders with
no `v?` at all. The test file, the launcher comment and `architecture.md` now say the same thing —
R8's actual complaint (two files contradicting each other about one line of code) is gone. `npm test`
**exit 0, 723 pass / 0 fail, 17/17 mutations red, `✓ hard gate PASSED`** — run here, unpiped. Shipped
behaviour is unchanged: the trigger at `claude/fkit-claude.sh:138` is byte-identical to HEAD and both
printf lines are byte-identical to the owner-approved `plan.md:91,93`. Closed under
[ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md):
the work product is clean; the only residue is stale line numbers in this ledger's **own bookkeeping**,
recorded below instead of driving a round 4.

⚠️ **Round 3 coverage — Claude-side only, and CI has still not run this change.** Codex was not run
(narrow post-fix check, scoped out by the driver), so there is **no model diversity in round 3**. The
sealed-PATH behaviour is proven on **macOS only** (`darwin 25.2.0`); `ubuntu-latest` is unverified.
**Do not read this close as "CI green" — CI has never seen it.**

**Round 2 verdict: ⚠️ Changes requested — NOT closed. One defect (low, one line, non-blocking for
behaviour).** R1's corrections, R2's softened comment, R3's partial fix, R4 and R5's four citation
repairs all verify by execution; the seal holds; shipped behaviour is byte-for-byte unchanged.
**But R2's remedy was applied to one of two copies** — the refuted claim survives verbatim at
`test/update-banner.test.js:11-12`, where it now directly contradicts the launcher comment three
files away. See **R8**.

**Round 2 coverage — say it plainly: Claude-side only.** Codex was not run this round (the driver
scoped it out as a narrow post-fix check), so there is **no model diversity in round 2** — round 1's
genuine reasoning-only Codex pass (ADR-042 D1) is not carried forward as coverage here. **CI has not
run this change**, and the sealed-PATH fixture was exercised on **macOS only** (`darwin 25.2.0`);
`ubuntu-latest` remains unverified.

**Round 1 verdict: ⚠️ Changes requested — 6 defects (none blocking).** The fix is correct for its
stated scope, the trigger semantics are unchanged, and **the seal holds** (verified by execution, not
by reading the verify worker's report). Every finding below is in the tests, the comments, or a
pre-existing launcher path — none is in the shipped banner logic.

**Reviewer coverage — state it precisely (ADR-042 D1):** two reviewers ran, but only one could
execute. Claude (this pass) ran the suite, the hard gate, a full revert of the fix, four fixture
mutations, a PATH-reachability probe, and a timing measurement. **Codex ran in the prescribed
`--sandbox read-only`, so it reasoned over the code and executed nothing** — its findings are
reading-derived. Execution evidence in this review is single-model; the model diversity is in the
reasoning only.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `ai-agents/knowledge-base/architecture.md:54,388,586`; `claude/fkit-claude.sh:69,80-88` | The documented "5 s hard ceiling" **does not exist on the git path** — measured 12 s with a sleeping `git ls-remote` stub. `GIT_HTTP_LOW_SPEED_LIMIT/TIME` bound throughput stalls, not DNS/connect, and there is no outer deadline. `architecture.md` (edited by this diff, and its `:54` citation repaired to point straight at `FKIT_NET_TIMEOUT=5` and `_fkit_remote_sha`) still asserts "All time-boxed to 5 s"; `fkit-claude.sh:69`'s own comment says "hard ceiling on **any** update-check network call". The launcher hang itself is **pre-existing and out of code scope** (`_fkit_remote_sha` is untouched by this diff) → separate task. |
| R2 | 1     | low    | `claude/fkit-claude.sh:152` | "No path renders `v?`" is false — version strings are gated on **non-emptiness only, never validated**. Three renders demonstrated by execution: remote `VERSION` containing `?` → `v9.9.9 → v?`; a 200-with-HTML interception (raw.githubusercontent blocked while github.com works) → `v9.9.9 → v<!DOCTYPEhtml>`; installed `version=9.9.9 ` (trailing space) vs clean remote → `v9.9.9  → v9.9.9`, **the exact defect 0257 removes**. `install.sh:63` normalizes with `tr -d '[:space:]'`, so the third needs a hand-edited `.version`. |
| R3 | 1     | low    | `test/update-banner.test.js:294-302` | `installed sha == remote sha: complete silence` is **vacuity-capable** — swapping `GIT_SAME`→`GIT_FAIL` leaves it green (measured); only a stub returning a *differing* sha reds it. A current install and a failed probe are both silent, and `.latest` is written only inside the trigger branch. Partly covered already: test 1 uses the same `install()` fixture with `GIT_OK`, so a dead harness reds there — the gap the pair does **not** cover is "the probe never ran at all". |
| R4 | 1     | low    | `test/update-banner.test.js:357-362` | `.latest keeps its own unknown fallback` never asserts its curl stub ran — stubbing `_fkit_remote_version` to `return 0` leaves it green (measured; three other tests red). Unlike the sibling at `:231-245`, which does assert it. |
| R5 | 1     | low    | `test/update-banner.test.js:33-35` | The new file's own header introduces **three stale line citations** into the file it tests: `:126-146` (actual `:126-161`), `:148-177` (actual `:164-192`), `:339` (actual `:507`). Same defect class this very task repairs in `architecture.md`, and the class `prove-red.sh`'s ⚠️ "KEEP THIS LIST IN STEP" header exists to prevent. |
| R6 | 1     | low    | `test/update-banner.test.js:334-344` | The throttle test pins "some positive throttle", never the **60-minute default** or expiry — a default of `1`, `600000`, or effectively-permanent all keep it green. `FKIT_UPDATE_INTERVAL_MIN` appears nowhere under `test/`. |
| R7 | 1     | low    | `claude/fkit-claude.sh:156` | Newline-bearing `FKIT_REF` (or `.version`'s `ref=`) splits the one-line notice into several and can **forge a second banner line** — demonstrated. Operator-controlled input, no privilege boundary crossed, but this diff **newly** puts `$fkit_ref` into banner text, so it is new surface rather than pre-existing. |
| R8 | 2     | low    | `test/update-banner.test.js:11-12` (and, weaker, `ai-agents/knowledge-base/architecture.md:399`) | **R2's fix is half-applied — the refuted claim still ships, in the file whose thesis it is.** The launcher comment was softened at `:152-155` ("a garbage remote VERSION still renders verbatim (`"?"` → `v?`)"), but the new test file's own header still asserts, unqualified: *"No `v?` is reachable on any path."* **Re-proven false by execution this round**, on a sealed single-entry PATH (`git`/`curl` both resolving into the stub dir): a remote `VERSION` of `?` with installed `9.9.9` renders `  ↑ fkit v9.9.9 → v? is available. Run:  fkit update`. The two files now say opposite things about the same line of code, and the test file is the one a future reader trusts. `architecture.md:399`'s *"No path renders a `v?` **placeholder**"* is defensible on the narrow word — `${rver:-?}`/`${curver:-?}` really are gone — but it sits one clause after listing `v0.2.1 → v?` as a pre-0257 rendering, so it reads as "that line can no longer appear", which is false. **Not a new dispute and not re-litigation: the owner already ruled "soften to what the code guarantees" — this is that ruling, applied to one of its two sites.** No shipped behaviour is involved; the fix is one sentence. |

### Round 2 — post-fix re-verification, by execution (reviewer, 2026-08-13)

The driver folded the coder's verify pass into this closeout. **That folding was legitimate here**, and
the reason is specific rather than general: every claim under check was one this reviewer could
independently *execute* — a test run, a launcher run on a fixture of its own building, or a line
number re-derived on disk. Nothing was accepted from the ledger's bookkeeping. Where folding would
NOT be legitimate is a claim only the coder's own session could reproduce; there were none here.

| Claim under check | How it was re-verified | Result |
|---|---|---|
| `npm test` green | run literally, exit code read from `$?` on the next line, **no pipe** (output redirected to a file) | **exit 0** — `tests 723 / pass 723 / fail 0`, 17 suites |
| 17/17 mutations red at their NAMED assertions; `0j` green | same run's `prove-red.sh` output | **`✓ hard gate PASSED`**; `0j ... green`; `16 ... red`, `17 ... red`, both naming `0257/equal-versions` and `0257/no-curl` |
| **R1** — `architecture.md:54` | new wording: only the curl paths are time-boxed; `GIT_HTTP_LOW_SPEED_*` bounds a stalled transfer, not DNS/connect. Cross-read against `:79-98` on disk | **TRUE.** `_fkit_remote_sha`'s git branch (`:81-84`) sets only `GIT_TERMINAL_PROMPT` + the two low-speed vars; the curl branches (`:86`, `:94`) carry `--max-time`. Citation `:69,79-98` lands correctly |
| **R1** — `fkit-claude.sh:69` comment | read on disk | **TRUE** — "a real deadline for curl (`--max-time`), but for git only a low-speed STALL bound" |
| **R1** — `:60-63` header comment | read on disk | **TRUE** — "PARTLY time-boxed… the git path is NOT deadlined" |
| **R1** — `architecture.md:388`, `:586` | read on disk | **TRUE** — both now say the time-boxing is not uniform and name the git path as the unbounded one |
| **R2** — softened `:152-155` comment | compared against measured behaviour | **MATCHES, neither weaker nor overclaiming** — "both sides are only tested for non-emptiness… a garbage remote VERSION still renders verbatim" is exactly what the code does. ⚠️ But see **R8**: the *un*softened copy still ships |
| **R3** — the fix closes "the probe never ran" | own fixture, sealed single-entry PATH, git **absent** | **CONFIRMED RED-CAPABLE** — banner silent, git log **empty**, so `gitCalls.some(startsWith('ls-remote'))` fails. (Mechanism note: with git absent the launcher falls through to the curl branch, which is asked for `api.github.com/.../commits/main`, gets a version string, and yields no sha — vacuous silence, now caught) |
| **R3** — it does **not** close "the probe ran and failed" | same fixture, `GIT_FAIL` (`exit 128`) | **CONFIRMED, exactly as the coder stated** — banner silent, git log contains `ls-remote https://github.com/…` (the stub logs argv *before* its body), so the guard passes and the test stays green |
| **R3** — the new guard does not silently repeat the earlier refuted `gitCalls` guard | read + the probe above | **IT DOES NOT.** The flaw is real and identical, but it is now **named in the test's own comment** rather than presented as coverage. That is the difference between a rationalisation and a documented boundary |
| **R3** — "test 1 covers the other half" | ran test 1's fixture with the probe forced to fail | **THE ARGUMENT HOLDS, not a rationalisation** — no banner is printed, so test 1's `assert.ok(line, 'no banner printed at all')` goes red. Any launcher-side regression that suppresses the probe result reds test 1; test 7's residual gap is a *fixture-authoring* gap, not an uncovered launcher regression |
| **R3** — the in-test comment's accuracy | each clause checked separately | **ACCURATE on all four clauses**: the `GIT_SAME`→`GIT_FAIL` claim (probed), the argv-logged-first mechanism (probed), "`.latest` is written only inside the trigger branch" (`:140-141`, inside the `:138` guard), and the test-1 coverage claim (probed). Its `:138` citation also lands correctly |
| **R4** | read on disk | **PRESENT** — `r.curlCalls.some(c => c.includes('…/main/VERSION'))`, the same shape as the sibling it was compared against |
| **R5** — four citations | **all four re-derived on disk**, not taken from the ledger | **ALL FOUR LAND.** `:126-165` = the update-check block exactly (`if [ … FKIT_NO_UPDATE_CHECK … ]` → its closing `fi`); `:168-196` = the `-h\|--help)` arm through `exit 0 ;;`; `:511` = `if [ "${FKIT_SETUP_ONLY:-0}" = 1 ]`; `:196` (the previously-unreported fourth, at the test file's `:73`) = `exit 0 ;;` |
| **The seal** | re-derived independently: own fixture built with `env -i`, PATH = one stub dir, `command -v` re-checked after the run | **HOLDS.** In every probe, `git`/`curl` resolved into the stub dir or were genuinely `ABSENT`; the stub logs show the launcher's real argv (`ls-remote https://github.com/fkit-test/no-such-repo-0257.git main`, `--max-time 5 …/VERSION`). The fixture repo does not exist on GitHub, so even a leak fetches nothing. Test 13 (the one prepending case) proves its own shadowing with `assertReachable` for **both** tools before launching |
| **Shipped behaviour unchanged** | proved by diff, not by assertion | **UNCHANGED.** The trigger `[ "$remote" != "$installed" ]` is at `:138` **at HEAD and on disk**, and appears in **no diff hunk** (the hunk starts at `:139`). Both printf lines (`:157`, `:159-161`) are **byte-identical** to the owner-approved `plan.md:91,93` — verified with `diff`, empty output |
| `33 of 241 commits have ever touched VERSION` (asserted in the new comment and test header) | `git log --oneline -- VERSION \| wc -l` vs `git rev-list --count HEAD` | **TRUE as of today** — 33 and 241 |

**Two observations, deliberately NOT raised as findings** (pre-existing at HEAD, unchanged by this
diff, same class as the four launcher citations the driver is routing elsewhere): `architecture.md`'s
Secrets bullet cites `claude/fkit-claude.sh:76` for `GIT_TERMINAL_PROMPT=0`, which is at `:81` — and
was at `:81` at HEAD too. The Network bullet's trailing `:56-58,64` points at the ADR-009 header and a
bare `#`; the sentence it supports is at `:60-61`. Both belong to the routed cleanup, not to `0257`.

**Not verified, and not claimable:** CI (`ubuntu-latest`) has not run this change. The sealed-PATH
fixture ran on **macOS only**. Codex did not run this round — round 2 coverage is **Claude-side
only**, with no model diversity.

### Round 3 — R8 closeout verification, by execution (reviewer, 2026-08-13)

**Method note.** This task has now had a corrected claim be itself wrong in three separate rounds, so
nothing below was accepted by reading. Every rendering was re-measured on a fixture built here from
scratch — `env -i`, a single-entry `PATH` holding only symlinked coreutils plus my own `git`/`curl`
stubs, `command -v` re-checked against the same `PATH` string the launcher got, a `.version` naming
`fkit-test/no-such-repo-0257` (a repo that does not exist), fixture in the scratchpad, repo untouched.

**Measured renderings — all seven cases.** The three the test header quotes reproduce byte-for-byte;
`v<!DOCTYPEhtml>` (the launcher comment's own example) reproduces; and the three empty-version paths
render **no `v?`**, which is the guarantee all three texts now claim:

| # | Installed | Remote `VERSION` | Measured banner | Claimed at |
|---|---|---|---|---|
| A | `9.9.9` | `?` | `  ↑ fkit v9.9.9 → v? is available. Run:  fkit update` | test header line 8 — **byte-exact** |
| B | `?` | `9.9.9` | `  ↑ fkit v? → v9.9.9 is available. Run:  fkit update` | test header line 9 — **byte-exact** |
| C | `9.9.9` | `<!DOCTYPE html>` | `  ↑ fkit v9.9.9 → v<!DOCTYPEhtml> is available…` | `fkit-claude.sh:153-154` — **byte-exact** |
| D | `?` | `?` | `  ↑ fkit v? — newer content on main (1111111 → deadbee). Run:  fkit update` | test header line 10 — **byte-exact**, shas included |
| F | `9.9.9` | *(empty)* | `  ↑ fkit v9.9.9 — newer content on main (1111111 → deadbee)…` | **no `v?`** |
| G | *(no `version=`)* | `9.9.9` | `  ↑ fkit — newer content on main (1111111 → deadbee)…` | **no `v?`**; matches `plan.md:105` |
| H | *(no `version=`)* | *(empty)* | `  ↑ fkit — newer content on main (1111111 → deadbee)…` | **no `v?`** |

F/G/H are the load-bearing half: they are what makes *"the launcher no longer SUBSTITUTES a `?` for a
version it does not have"* a **true** statement rather than the third wrong correction. It is true.

| Claim under check | How it was re-verified | Result |
|---|---|---|
| **Site 1** — `test/update-banner.test.js:11-23`, the replaced header | each clause measured separately (table above) | **TRUE on every clause.** The guarantee, its stated narrowness, all three quoted renderings, and "a literal `?` reaches BOTH sides and BOTH renderings" all hold |
| **Site 1** — its scope claim about `assertNoPlaceholder()` | **all five callers re-derived on disk** and each one's fixture read | **TRUE.** Callers at `:218`, `:249`, `:276`, `:291`, `:410`. `:249`/`:276`/`:291` supply an **empty** remote or installed version (`CURL_FAIL`, curl absent, `install({version:null})`); `:218`/`:410` supply **equal, well-formed** `9.9.9` on both sides. **None supplies a garbage version string**, so no existing assertion contradicts the new header |
| **Site 1** — `33 of 241 commits have ever touched VERSION` | `git log --oneline -- VERSION \| wc -l` vs `git rev-list --count HEAD` | **TRUE today** — 33 and 241 |
| **Site 2** — `test/update-banner.test.js:198-199`, the `assertNoPlaceholder()` comment | measured against A/B/D (literal `?` renders) and F/G/H (empty never papered over) | **TRUE.** "no EMPTY version may be papered over with a `?`… not a claim that `v?` is unreachable in general" is exactly what the five call sites can and cannot catch. **The coder found this site itself — it was not in R8** |
| **Site 3** — `architecture.md:399-404`, softened | read on disk, then measured against the same seven cases | **TRUE, and no longer misleading.** "No path **substitutes** a `?` for a version it does not have" + "This is narrower than '`v?` never reaches the reader'… still renders verbatim, on either side and in either rendering." The clause that made the old wording answer the reader's question wrongly is gone |
| **R8's actual complaint — do the three sites now AGREE?** | the three texts read side by side against the measured behaviour | **YES. The contradiction is gone.** All three state the same guarantee with the same stated limit. One asymmetry, deliberately **not** raised: the launcher comment names only *"a garbage **remote** VERSION"*, where the other two name both sides. That is **incomplete, not false** — it claims no exclusivity, and it sits at the site where curl fetches the remote `VERSION`. Case B is not a counter-example to it |
| **Comment-only** — shipped behaviour | proved directly against the launcher, not by diffing the test file | **UNCHANGED.** Trigger `[ -n "$remote" ] && [ -n "$installed" ] && [ "$remote" != "$installed" ]` is at `:138` **byte-identical at HEAD and on disk**. Both printf lines (`:157`, `:159-161`) are **byte-identical to `plan.md:91,93`** (`diff`, empty output, indentation normalised for nesting depth). The round-2 softened comment at `:151-154` is still present and unaltered |
| **Comment-only** — no executable line changed in the test file | 14 `test(` blocks; **247 executable lines** (non-comment, non-blank) — the coder's own stated count, re-derived here; suite total unchanged against **my own round-2 baseline of 723**; 17/17 mutations red **at their named assertions**, 16 and 17 still naming `0257/equal-versions` and `0257/no-curl`; `0j` green | **CONSISTENT on every independent handle.** ⚠️ **Stated honestly:** the file is **untracked**, so no baseline exists for me to diff against. I can prove the count, the discrimination and the green — I **cannot** prove byte-level executable invariance independently. The coder's reconstruct-and-diff stands as its evidence, corroborated but not reproduced |
| `npm test` | run literally, exit code read from `$?` on the next line, **no pipe** (output redirected to a file) | **exit 0** — `tests 723 / pass 723 / fail 0`; `✓ hard gate PASSED`; 17 `... red`; `0j ... green` |
| **The +4 shift the coder flagged** | `git diff -U0` hunk boundaries + the surrounding lines read on disk | **CONFIRMED, and exactly as stated.** The four added lines are `architecture.md:400-403`, all strictly **after** `:399`; `:399` itself still lands on the softened sentence. `:54` and `:388` sit below the boundary and **both still land** |

**Assessment of the driver's call to fold the shift into the citation task: SOUND — and the case is
stronger than the coder made it.** I traced which of this ledger's own `architecture.md` citations the
shift actually breaks. There are exactly two above `:399` — `:438` and `:586` — and **both were already
wrong before the shift**: `HEAD:586` is an ADR-023 tombstone line, never the Network bullet (that was
`HEAD:577`), so **my own round-1 `:586` citation never landed**; and `:438` was off by one at write
time (`structure_notice()`'s citation line is at `:443` today). **The +4 shift breaks nothing that was
not already broken.** Renumbering here would therefore fix two pre-existing citation defects under
`0257`'s name while the separately-routed citation work fixes the rest — precisely the split that work
exists to avoid. Fold it in. Recorded as an own-record residual below, per ADR-034.

**Not verified, and not claimable:** CI (`ubuntu-latest`) has never run this change. The sealed-PATH
fixture is proven on **macOS only** — my round-3 probes were macOS too, so they add no platform
coverage. Codex did not run this round: **round 3 coverage is Claude-side only, no model diversity.**

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

Round 1, 2026-08-13. Process-review worker, spawned by `/fkit-sprint-ship-loop` under the
declared-approval marker. Four owner rulings (2026-08-13, `AskUserQuestion`) were handed down with the
spawn and are folded in below, not re-asked. **Every finding was re-verified against the code by
execution before acting** — no verdict here is taken on the reviewer's word, and every line number was
re-derived on disk (they have been wrong twice on this task).

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** (confirmed by execution — 12 s) | Defect (docs/comment); the launcher hang itself is frontier + pre-existing | Corrected the three false `architecture.md` claims (`:54`, `:388`, `:586`) and the `:69`/`:60-63` launcher comments. ⛔ `_fkit_remote_sha` NOT touched — owner routed the real timeout fix to its own task. | **Fixed (docs only)** |
| R2 | **CORRECT** (both renders reproduced) | Defect (comment overclaims) | Softened the comment to what the code guarantees: it removes the *empty*-version `v?`, and is explicitly not validation. ⛔ No version validation added — owner declined. | **Fixed (comment only)** |
| R3 | **CORRECT** (vacuity reproduced: `GIT_SAME`→`GIT_FAIL` stayed 14/14 green) | Defect (test strength) | Applied the owner's precise remedy — assert the stub git was called with `ls-remote`, plus `assertReachable`, as tests 4 and 8 do. **Proved it discriminates**, and documented the half it does not. | **Fixed (partial by design — see note)** |
| R4 | **CORRECT** (vacuity reproduced: curl stub dropped, still green) | Defect (test strength) | Added the sibling assertion that curl was actually asked for the remote `VERSION`. | **Fixed** |
| R5 | **CORRECT** — and there were **four**, not three | Defect (stale citations) | All re-derived on disk and corrected: `:126-146`→`:126-165`, `:148-177`→`:168-196`, `:339`→`:511`, plus an unreported fourth at `:73` (`:177`→`:196`). | **Fixed** |
| R6 | **CORRECT** | Frontier (test strength, no shipped defect) | ⛔ Not fixed — owner accepted as residual. Recorded below. | **Accepted residual** |
| R7 | **CORRECT** | Frontier (operator-controlled input, no privilege boundary) | ⛔ Not fixed — owner accepted as residual. Recorded below. | **Accepted residual** |

### R1 — what was actually measured, and what was corrected

Reproduced independently with a `sleep 12` git stub on a sealed PATH: **elapsed 12 s, exit 0**, git
stub logged `ls-remote`. (First attempt read 1 s and was a **false negative** — `sleep` was not on the
sealed PATH, so the stub died instantly. Recorded because it nearly became a "refuted".)

The mechanism, stated precisely: `_fkit_remote_sha`'s git branch — which is the **first** choice, taken
whenever git exists — sets only `GIT_HTTP_LOW_SPEED_LIMIT/TIME`. Those abort a transfer *already
running* below the rate floor; they do not bound DNS, connect, or TLS handshake, and git has no
`--max-time` equivalent. The **curl** branches do carry a true `--max-time 5`. So "All time-boxed to
5 s" was false specifically because of the preferred branch.

⛔ **`_fkit_remote_sha` is unchanged** — the hang is pre-existing and out of `0257`'s code scope; the
owner routed it to a new task, filed by the driver, not here. ⛔ `architecture.md`'s suite-inventory
count was not touched (reserved for `0251`).

### R3 — the fix discriminates, and here is exactly what it does and does not catch

The earlier verify worker applied a `gitCalls` guard here and its own re-probe **refuted** it. That
refutation is correct and still holds: the stub wrapper logs argv *before* running the body, so
`gitCalls` is non-empty even when git exits 128. This round did not repeat that mistake — the guard was
applied **and then probed in both directions**:

| Probe | Before fix | After fix |
|---|---|---|
| git absent — *the probe never ran at all* | green (vacuous) | **RED** at the named test |
| `GIT_SAME`→`GIT_FAIL` — *the probe ran and failed* | green | **still green** |

That boundary is deliberate and matches the reviewer's own scoping of R3: the gap the remedy closes is
*"the probe never ran"*; the failed-probe half is, in the reviewer's words, "partly covered already"
by test 1, which shares the `install()` fixture with `GIT_OK` and reds if the harness is that dead.
A guard that discriminated a *failed* probe would need a differential case, which the owner explicitly
ruled out. **The limitation is written into the test as a comment rather than left for the next reader
to rediscover.**

### Verification for this round

Exit codes captured with `echo "$?"` on the following line, **never through a pipe**.

| Check | Result |
|---|---|
| `node --test test/update-banner.test.js` | exit **0** — 14/14 |
| `npm test` (run literally, unpiped) | exit **0** — **723 pass / 0 fail**, 17 suites, `✓ hard gate PASSED` |
| All 17 mutations red at their NAMED assertion | **17/17 red**; `0j` green; no no-op warning |
| Mutations 16/17 anchors still match after my comment edits | **verified** — `newer content on` occurs exactly **once** in the launcher; mutation 16's sed line untouched |
| `sh -n claude/fkit-claude.sh` | **valid** |
| **The seal, re-proven** | unseal mutant (`PATH + process.env.PATH`) → exit **1**, exactly the two absent-tool tests red with the suite's own message `curl IS reachable on the supposedly sealed PATH (/usr/bin/curl)`. Test file then restored **byte-identical**. |
| Forbidden paths | `VERSION`, `install.sh`, `bin/release.mjs`, `test/harness.mjs`, `launcher-contract.test.js`, `wiki-vault/` — **all clean** |
| Banner behaviour | **unchanged** — every edit this round is a test assertion or a comment. Both approved strings byte-exact; trigger line untouched. |

**Not verified:** CI on `ubuntu-latest` (unchanged from the Build worker's note — no CI run here).

### One thing surfaced, not decided

My R2 comment edit added 4 lines inside the banner block, shifting every launcher line past ~151. I
repaired the one citation my edit moved that was **accurate beforehand** (`architecture.md:438`,
`:449`→`:453`, `structure_notice()` re-verified on disk). Four other launcher citations in
`architecture.md` (`:257-262,357`, `:274-285`, `:288-294`, `:311-345`) do **not** land on what they
claim at either the old or the shifted line — they were **already stale at HEAD**, are pre-existing
drift outside this plan, and are **reported rather than taken**, consistent with the Build worker's
same call on `:333`/`:386`/`:404`.

### R8 — CONFIRMED, and broader than reported. Fixed (round 2, comment-only)

**Verdict: CONFIRMED — defect (stale/false comment), not a frontier-move.** Not re-litigation: this is
owner ruling 2 ("soften to what the code guarantees") reaching its second site.

**I re-measured it myself this turn rather than trusting the report** — a sealed single-entry `PATH`
(`git` and `curl` both resolving into the stub dir, verified with `command -v` against the same `PATH`
string the launcher got), fixture built in the scratchpad, repo untouched. The reviewer's case
reproduced, **and two more that were not reported**:

| Case | Installed | Remote `VERSION` | Rendered |
|---|---|---|---|
| A (reviewer's) | `9.9.9` | `?` | `  ↑ fkit v9.9.9 → v? is available. Run:  fkit update` |
| B (**new**) | `?` | `9.9.9` | `  ↑ fkit v? → v9.9.9 is available. Run:  fkit update` |
| C (**new**) | `9.9.9` | `<!DOCTYPE html>` | `  ↑ fkit v<!DOCTYPEhtml> is available…` |
| D (**new**) | `?` | `?` | `  ↑ fkit v? — newer content on main (1111111 → deadbee)…` |

So a literal `?` reaches **both sides and both renderings** — the header's *"No `v?` is reachable on
any path"* was false more broadly than R8 stated. **D is the sharpest**: `v?` appears in the *new*
newer-content form, the very rendering the fix introduced.

**Applied — comments only, three sites:**

| Site | Change |
|---|---|
| `test/update-banner.test.js:11-12` → `:11-23` | Replaced the false absolute with the measured guarantee: the launcher no longer **substitutes** a `?` for a version it does not have; a `VERSION` whose **content** is `?` still renders verbatim. All three measurements above quoted inline. |
| `test/update-banner.test.js:188` | Same one-clause class, **found by me, not in R8**: *"No path may render a version placeholder"* — the identical overclaim on `assertNoPlaceholder()` itself. Softened to "no EMPTY version may be papered over". |
| `ai-agents/knowledge-base/architecture.md:399` | **Softened, not left.** R8 called it defensible on the narrow word "placeholder" and left the call to me. My judgement: it is *technically* true (`${rver:-?}`/`${curver:-?}` are gone) but sits one clause after listing `v0.2.1 → v?` as a pre-0257 rendering, so a reader asking "can the banner still show `v?`" gets **the wrong answer** — and cases A/D show it can. Narrow-word-true is not good enough for the claim a reader actually takes away. |

**Scope claim I verified rather than asserted.** `assertNoPlaceholder()` has **five** callers
(`:206`, `:237`, `:264`, `:279`, and `:398` — the last one I nearly missed). I checked what each
feeds before writing that they do not contradict the new text: `:237`/`:264`/`:279` supply an **empty**
version; `:206`/`:398` supply **equal, well-formed** ones. None supplies a garbage version string, so
no existing assertion conflicts with the softened header.

**Comment-only, proven mechanically, not asserted.** `test/update-banner.test.js` is untracked, so
there is no git baseline: I reconstructed the pre-edit file by reversing my two edits, then diffed the
comment-stripped projections of before and after (full-line `//` and blank lines removed) —
**empty diff over 247 executable lines**. No assertion, fixture, stub, or `PATH` construction changed.
The seal was not approached. Both banner strings byte-exact; trigger untouched; no version validation
added; `_fkit_remote_sha` untouched; the launcher was **not edited at all** this turn.

### Verification for R8 (round 2, second pass)

| Check | Result |
|---|---|
| `npm test` run literally, exit code captured **on the next line, no pipe** | exit **0** |
| Suite total | **723 pass / 0 fail** — the expected baseline, unchanged |
| Mutations | **17/17 red** at their named assertions; `✓ hard gate PASSED`. 16 and 17 (`0257/equal-versions`, `0257/no-curl`) both still red — my comment edits did not break their anchors |
| Bounds honoured | suite-inventory count untouched (reserved for `0251`); the four stale launcher citations (`:257-262,357`, `:274-285`, `:288-294`, `:311-345`) and the reviewer's two (`:76`, `:56-58,64`) **not touched** — routed separately |
| No commit, no push, no wiki write, `plan.md` not re-authored, no task filed | **confirmed** |

**Not verified — unchanged and still open:** CI has never run this change; the sealed-PATH fixture is
proven on **macOS only**. My probe was macOS too, so it adds no platform coverage.

**New residual I introduced (flagging, not fixing):** my `architecture.md` edit turns 2 lines into 6,
so **`architecture.md`'s own line numbers past `:399` shift by +4**. Launcher citations are unaffected
(I did not touch the launcher — `fkit-claude.sh:453` still resolves to `structure_notice() {`), but
this ledger's own references to *architecture.md* line numbers above `:399` are now off by four. Left
alone deliberately: renumbering is outside this unit and collides with the separately-routed citation
work.

## Accepted residuals (shared, do-not-re-litigate)

- **`sha=unknown` re-banners** — What: an install whose `.version` carries `sha=unknown`
  (`install.sh:63`) renders `(unknown → deadbee)` and re-banners each throttle window until
  `fkit update` self-heals it. · Why (structural): the sha is the trigger; refusing to banner would
  hide a genuine update, and synthesising a sha is worse than naming the truth. · Re-raise only if:
  evidence of a *different* consequence than the cosmetic repeat. (Accepted at plan time; neither
  reviewer re-raised it this round.)

- **R6 — the throttle test never pins the 60-minute default or expiry** · What: `throttle: the first
  launch banners, a second inside the window is silent` proves only that *some* positive throttle
  exists. A default of `1`, of `600000`, or an effectively-permanent window all keep it green, and
  `FKIT_UPDATE_INTERVAL_MIN` appears nowhere under `test/`. · Why (owner ruling 2026-08-13, "Accept
  both as residuals"): the shipped behaviour is correct and unchanged by `0257`; this is test strength
  on a knob `0257` did not introduce, and pinning expiry means either a real clock wait or a new time
  seam — cost out of proportion to a cosmetic notice. · **Re-raise only if:** the throttle default or
  its expiry logic is itself changed, or a banner-frequency bug is actually observed in use.

- **R7 — a newline-bearing `FKIT_REF` can forge a second banner line** · What: `$fkit_ref` is
  interpolated into the notice, so a ref containing a newline (via `FKIT_REF` or `.version`'s `ref=`)
  splits the one-line notice and can append attacker-chosen text that looks like fkit output.
  Demonstrated by the reviewer. · Why (same owner ruling): the input is **operator-controlled** — a
  user who can set `FKIT_REF` or edit `.version` already has strictly more power than forging a line of
  their own terminal output, so no privilege boundary is crossed. Acknowledged as genuinely **new
  surface** (`0257` is what put `$fkit_ref` into banner text), which is why it is recorded here rather
  than dismissed. · **Re-raise only if:** `ref` becomes settable from a source the local user does not
  already control (a remote config, a shared install, a fetched manifest), or the banner text reaches
  anywhere other than the invoking user's own stdout.

- **Stale line numbers in this ledger's OWN bookkeeping — routed, not fixed here** (accepted round 3
  under [ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md);
  the driver's call, confirmed by the reviewer). · **What:** three groups of citations in this file no
  longer land. (1) `architecture.md:586` in R1's row — **the reviewer's own round-1 error**; `HEAD:586`
  is an ADR-023 tombstone line, the Network bullet was `HEAD:577` and is `:591` today. (2)
  `architecture.md:438` in the coder's *One thing surfaced* — off by one at write time; the
  `structure_notice()` citation line is `:443` today. (3) The coder's `assertNoPlaceholder()` caller
  list `:206, :237, :264, :279, :398` and the `:188` comment site — all stale by **+12**, the header's
  own growth; the count (**five callers**) is correct and the actual lines are `:218, :249, :276,
  `:291`, `:410`. · **Why:** the work product — the launcher, the suite, the three corrected texts — is
  clean and measured; every one of these sits in the **task's own record**, which ADR-034 puts outside
  the close bar. Renumbering here would repair two *pre-existing* citation defects under `0257`'s name
  and collide head-on with the separately-routed citation sweep, which is where the launcher's
  `:257-262,357`, `:274-285`, `:288-294`, `:311-345` and the reviewer's `:76` and `:56-58,64` already
  went. The `+4` shift the coder flagged **adds no new breakage** — verified. · **Re-raise only if:**
  the citation sweep is dropped rather than run, or one of these citations is used to justify a claim
  about shipped behaviour.

## Verified-good (recorded so round 2 does not re-derive it)

- **The seal holds — no test can pass by reaching the real network.** Measured, not read: an
  instrumented copy recorded the PATH handed to every launch. **14 of 15 launches ran on a
  single-entry PATH** (the stub dir); the 15th (`a real role launch`, which prepends) had 18 entries
  but **both `git` and `curl` resolved into the stub dir**. Two launches had `curl` genuinely absent.
  The launcher invokes only `git`/`curl`, both by bare name (no absolute paths — grepped), and
  `NEEDED_TOOLS` holds no network-capable tool. `launch()` builds `env` from `{}`, not `process.env`,
  except the one prepending case. Codex reached the same conclusion independently by reading.
- **Trigger semantics unchanged** (ADR-015 §4) — the `[ "$remote" != "$installed" ]` line does not
  appear in the diff at all.
- **`${curver:+v$curver }` is portable** — verified set / empty / unset under both `/bin/sh` (bash)
  and `/bin/dash`. No printf format-string injection: every value sits in an argument position
  under `%s`.
- **The suite genuinely binds the fix** — a full revert of the banner block to the pre-0257 line
  turns **6 of 14 tests red**; the 8 that stay green are the preserved-behaviour cases, correctly.
- **Mutations 16/17 red their named assertions**, `0j` guards the unmutated copy, and the hard gate
  passes with all 17 — run here, not taken on report. `npm test`: **723 pass / 0 fail**, exit 0.
- **Every repaired `architecture.md` citation verifies** — `:69`, `:79-98`, `:68-74`, `:77`,
  `:99-123`, `:125-161`, `:449` all land on what the prose claims.

## Re-litigates settled decisions (suppressed)

Nothing suppressed this round. Both reviewers were primed with the owner's rulings (sha parenthetical,
new test file, `--help` driver, architecture citations, the `sha=unknown` residual) and neither
re-raised them.

**One near-miss, deliberately NOT suppressed:** the "5 s ceiling is untested" residual carried a
re-raise condition — *"only if you can name a concrete testable seam."* Codex named one (a sleeping
git stub plus an elapsed-time assertion) and this pass **ran it**: it fails today. The condition is
met, so R1 stands.

**Round 2:** nothing suppressed, and nothing re-litigated. **R6 and R7 were re-read and confirmed
correctly recorded above** — each carries its What, its Why (the owner's 2026-08-13 ruling), and its
**Re-raise only if** condition, and neither condition is met today. **R8 is not a re-raise of R2**: R2
is settled and its ruling stands unchanged — R8 is that same ruling reaching only one of its two
sites.

## Convergence call (reviewer, round 2)

**Close after one one-sentence edit — do not open a round 3.** Seven of eight findings are discharged
and verified by execution; the eighth is a single stale sentence in a comment, with a settled ruling
already covering it and no behaviour attached. Round 2 surfaced **no new defect class** — R8 is
completion of round 1's work, not a new front. Once `test/update-banner.test.js:11-12` says what the
launcher comment says, this ledger should be closed on that evidence alone; a further adversarial pass
would be re-derivation, not review.

⚠️ **What closing will still not cover, whatever the ledger says:** CI has never run this change, and
the sealed-PATH fixture is proven on **macOS only**.

## Convergence call (reviewer, round 3) — HONOURED, ledger CLOSED

**Closed. No round 3 was opened for a finding, and no round 4 is warranted.** Round 2's call was
*"close after that one sentence lands"*; it landed, and it landed **broader than R8 reported** — the
coder proved `v?` reaches both sides and both renderings, found a third site (`:198-199`) that R8
missed, and softened the `architecture.md` clause R8 had left to its judgement. I re-measured all of it
rather than reading it: **every claim in all three replacement texts is true**, and the three sites now
agree instead of contradicting each other. That was R8's whole complaint, and it is discharged.

**Nothing new was raised, and that is a finding in itself.** The one asymmetry I did find — the
launcher naming only the *remote* side — is incomplete, not false, and R8's own bar for a further round
was *"nothing short of a false claim"*. The remaining residue is stale line numbers in this ledger's
own bookkeeping, **two of them pre-dating this round and one of them mine**, which ADR-034 puts outside
the close bar and which the driver has correctly folded into the citation sweep. A round 4 would buy
re-derivation of measurements already taken twice, on a surface of steadily decreasing consequence —
exactly the cost ADR-034 was written to stop paying.

⚠️ **Two things this close does NOT certify, and no downstream record may claim otherwise:** CI has
**never** run this change, and the sealed-PATH behaviour is proven on **macOS only** — `ubuntu-latest`
is unverified. Round 3 ran **Claude-side only**, with **no Codex pass and no model diversity**.
