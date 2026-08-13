# Approved implementation plan — task 0257

**Approved by the owner 2026-08-13 via `AskUserQuestion`**, in a `fkit lead` session driving
`/fkit-sprint-ship-loop` against `ai-agents/sprints/sprint-5.md`. The plan body below is the coder
worker's returned text, copied verbatim.

## Owner rulings taken at the plan gate (2026-08-13)

1. **Banner copy — WITH THE SHA PARENTHETICAL.** Verbatim option label: "With the sha parenthetical
   (Recommended)". The approved strings, exactly:
   ```
     ↑ fkit v0.2.1 — newer content on main (1111111 → deadbee). Run:  fkit update

     # and when versions genuinely differ, unchanged:
     ↑ fkit v0.1.30 → v0.2.1 is available. Run:  fkit update
   ```
2. **Plan approved** — verbatim option label: "Approve (Recommended)".
3. **Test placement — NEW FILE, against the brief.** Verbatim option label: "New file, against the
   brief (Recommended)". `test/update-banner.test.js`, following `structure-notice.test.js`'s
   precedent. ⛔ Do not add a group to `launcher-contract.test.js`.
4. **Vault resync — FILE A NEW TASK.** Verbatim option label: "File a new resync task (Recommended)".
   ⛔ Do **not** widen `0258`. ⛔ The Build worker does **not** file it — the driver routes it to a
   producer after `0257` lands.

**Sequencing note (driver, not a separate ruling):** `0257` is being driven now, so it lands **before**
the imminent release cut. The test fixtures are release-proof either way (§5).

---

## 1. What I verified on disk (not carried from the brief)

| Claim | Measured 2026-08-13 | How |
|---|---|---|
| `VERSION` | `0.2.1` | `cat VERSION` |
| Last bump | `692b8e9 Release v0.2.1` (2026-08-08) | `git log -1 -- VERSION` |
| Commits since bump | **5** | `git rev-list --count 692b8e9..HEAD` |
| Commits ever touching `VERSION` | **33 of 241** → 86.3% don't | `git log --format=%h -- VERSION \| wc -l` |
| Launcher last modified | `0bc2b36`, 2026-08-07 — **unchanged** | `git log -1 -- claude/fkit-claude.sh` |
| Banner coverage in tests | **none** | `grep -rn "remote_version\|curver\|rver" test/` → empty |
| Suite baseline | 709 tests / 17 suites, green | `npm run test:unit` |

Verified line anchors in `/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude.sh`:
- `_fkit_remote_sha` — `:79-91` (git → curl fallback)
- `_fkit_remote_version` — `:92-98`, curl gate at `:93`
- Update-check block — `:126-146`; trigger `:136-138`; labels `:139`; `.latest` write `:140-141`; the printf `:142-143`

## 2. Reproduction — done, before proposing a fix (brief's requirement)

I built a fake install root (a copy of `claude/` with **no** `.git`, **no** `package.json`, so `_fkit_is_source_checkout` is false) plus a sealed `PATH` with stub `git`/`curl`, and drove it with a synthetic `$share/.version`. Under a fully sealed PATH (no network reachable):

```
A'. git ok + curl ok, version equal   →   ↑ fkit v0.2.1 → v0.2.1 is available. Run:  fkit update
C'. git ok + curl ABSENT              →   ↑ fkit v0.2.1 → v? is available. Run:  fkit update
B.  versions differ                   →   ↑ fkit v0.1.30 → v0.2.1 is available. Run:  fkit update
D'. sha EQUAL                         →   (silent)
E'. git fails + curl absent (offline) →   (silent)
E''.no git + no curl                  →   (silent)
F.  two runs in the throttle window   →   banner once, then silent
```

**Two of my first-pass runs silently used the real `/usr/bin/git` and `/usr/bin/curl` and hit the network.** I caught it and re-ran sealed. This is the single biggest trap in the test work and the plan below is shaped around it.

## 3. Findings that change the remedy

**(a) `_fkit_remote_version` cannot get a git fallback.** `git ls-remote` returns refs, not file content. The only git-native way to read one remote file is `git archive --remote`, and GitHub refuses it:

```
$ git archive --remote=https://github.com/flashist/fkit.git main VERSION
error: RPC failed; HTTP 422 curl 22 The requested URL returned error: 422
```

A shallow clone would blow the 5 s budget and the "cost nothing" rule. So the brief's first option for defect 2 is off the table; **the fix must be the second — render a sentence with no `v?`.**

**(b) That collapses the two defects into one.** Equal-versions and unknown-remote-version are the same situation: *there is newer content, and we cannot name a distinct version for it.* One sentence covers both. Answering the driver's question directly: **one fix, two defects.**

**(c) Third defect, same line, not in the brief.** `:143` is `"${curver:-?}" "${rver:-?}"` — the **installed** side renders `v?` too when `.version` carries no `version=` line. Folded in for free by the same rewrite.

**(d) In-repo, the update check never runs.** `share` = `$here/..` = the repo root, which has `.git` and `package.json` → source checkout → `:126` skips the whole block. Any banner test **must** build a non-checkout install root. `prove-red.sh`'s `make_claude_copy` deliberately writes `: > "$dst/package.json"` to make copies read as checkouts, so its existing helpers **cannot** be reused here.

## 4. The banner — OWNER-APPROVED (ruling 1)

Layered: option 2 is the sentence (it carries the meaning), option 1 is the parenthetical (it carries
the evidence). **The owner approved the sha parenthetical.**

On *"is a sha-labelled banner even useful to a human?"* — **a sha must not be the message, but it earns a parenthetical.** The reader's action is `fkit update` either way, so the sentence must stand alone without the sha. But the sha is the only thing that actually differs, it is what makes "am I really current?" debuggable, and `fkit update`'s own success line at `:117-118` already prints `now at v%s (%s)` with `cut -c1-7` — so the idiom already exists in this file. Option 3 (commit count) rejected: it needs a second network call inside the 5 s ceiling, which the brief itself flags.

Replace `:142-143` with:

```sh
if [ -n "$rver" ] && [ -n "$curver" ] && [ "$rver" != "$curver" ]; then
  printf '\n  ↑ fkit v%s → v%s is available. Run:  fkit update\n\n' "$curver" "$rver"
else
  printf '\n  ↑ fkit %s— newer content on %s (%s → %s). Run:  fkit update\n\n' \
    "${curver:+v$curver }" "$fkit_ref" \
    "$(printf %s "$installed" | cut -c1-7)" "$(printf %s "$remote" | cut -c1-7)"
fi
```

Dry-run of that exact logic (executed):

```
differing versions      →   ↑ fkit v0.1.30 → v0.2.1 is available. Run:  fkit update   ← unchanged
EQUAL versions          →   ↑ fkit v0.2.1 — newer content on main (1111111 → deadbee). Run:  fkit update
rver empty (no curl)    →   ↑ fkit v0.2.1 — newer content on main (1111111 → deadbee). Run:  fkit update
both empty              →   ↑ fkit — newer content on main (1111111 → deadbee). Run:  fkit update
installed sha 'unknown' →   ↑ fkit v0.2.1 — newer content on main (unknown → deadbee). Run:  fkit update
```

Notes on it:
- `$fkit_ref`, not a hard-coded `main` — the ref is configurable via `FKIT_REF`/`.version`.
- `${curver:+v$curver }` is POSIX `sh`; it keeps this to two branches instead of three. A three-branch explicit version is available if you prefer plainness over the parameter expansion.
- **No `v?` is reachable on any path.**
- Widest realistic line (`v0.10.12`) is exactly **80 display columns**. Tight; flagging rather than hiding it.
- `.latest` (`:140-141`) is left alone — nothing reads it (`grep` confirms only writes and `rm`s), and it already has its own `unknown` fallback.
- **Trigger untouched.** Still `[ "$remote" != "$installed" ]` on shas, per ADR-015 §4.

## 5. Tests — OWNER RULING 3: NEW FILE

**New file `test/update-banner.test.js`, not a group inside `launcher-contract.test.js`.** This deviates from the brief, deliberately, and **the owner ruled for it**: `launcher-contract.test.js`'s header pins its scope to Group A (argv) + Group B (settings), and the precedent for the launcher's *other* emitted line — the structure notice — is its own file, `structure-notice.test.js`. Following that keeps both files' contracts honest.

Fixture, modelled on `structure-notice.test.js:203-221` (which already builds a fake share by `cpSync`-ing `claude/` and spawning the launcher directly):
- copy `claude/` into a temp install root with **no** `.git`, **no** `package.json`
- write a synthetic `$share/.version`
- prepend a per-test stub dir with `git` (fake `ls-remote`) and `curl` (serves a synthetic `VERSION`)
- run with `FKIT_SETUP_ONLY=1 FKIT_NO_SELF_HOST=1`, and **`FKIT_NO_UPDATE_CHECK` unset** (the shared harness forces it to `1`)

Assertions:

| # | Case | Assert |
|---|---|---|
| 1 | equal versions, differing sha | matches `newer content on`; **not** `v9.9.9 → v9.9.9`; no `v?` |
| 2 | differing versions | exactly the familiar `↑ fkit vA → vB is available. Run:  fkit update` |
| 3 | curl present but **failing** | no `v?`; renders the newer-content form |
| 4 | curl **absent from PATH** (sealed) | no `v?` — the brief's step 3, proven by execution |
| 5 | installed sha == remote sha | complete silence |
| 6 | offline (git fails, curl fails) | complete silence, exit 0 |
| 7 | throttle | run 1 prints, run 2 within the window silent |
| 8 | share is a source checkout | complete silence |
| 9 | `FKIT_NO_UPDATE_CHECK=1` | complete silence |
| 10 | `.latest` still written | `version=` and `sha=` present |

**Fixtures use synthetic versions (`9.9.9`), never the repo's `VERSION`.** This is the direct answer to "a release is imminent": the test controls both sides of the comparison, so the bump can never turn the suite red or silently stop exercising the equal-version case.

`prove-red.sh` — two mutations (ADR-026; hand-rolled, no library):
- **16.** neuter the branch condition (`if : ; then`) → assertion 1 must go red
- **17.** restore `${rver:-?}` → assertion 3/4 must go red

Each with the file's standard `cmp -s` no-op guard, plus a `run_banner_suite()` seam (`FKIT_BANNER_ROOT`, mirroring the existing `FKIT_FRONTMATTER_ROOT` whole-tree seam) that runs **only** the banner file — so `fkit update`'s network path is never involved. **The header index comment says "FIFTEEN mutations" and must be updated to seventeen** — that file's own warning is explicit about keeping the list in step.

## 6. Docs

- `ai-agents/knowledge-base/architecture.md:390` quotes `↑ fkit vX → vY is available. Run: fkit update` and cites a **stale** `:121-141` (actual `:136-143`). Knowledge-base is coder-writable → **in scope**, update both. `:54` also cites stale `:64,74-93`.
- ⛔ `ai-agents/wiki-vault/wiki/systems/install-and-self-update.md:50` quotes the same string. **Not touched** (ADR-005). Owner ruling 4: a **new** resync task will be filed by a producer; ⛔ not by the Build worker, and ⛔ `0258` is not widened.

## 7. Files

**Touched:** `claude/fkit-claude.sh` · `test/update-banner.test.js` (new) · `test/prove-red.sh` · `ai-agents/knowledge-base/architecture.md` · the task folder's `worklog.md` (reproduction record).
**Not touched:** `VERSION`, `install.sh`, `bin/release.mjs`, `ai-agents/wiki-vault/`. `test/harness.mjs` left alone on purpose — the fixture stays local to the new file so none of the 709 existing tests can be disturbed.

## 8. Risks

- **CI.** The new tests run on `ubuntu-latest`. The sealed-PATH absent-curl case (assertion 4) is the most likely to behave differently there; mitigation is to resolve every tool path dynamically via `command -v` rather than hard-coding `/usr/bin`. Helpfully, the banner prints at `:126-146`, *before* init at `:338`, so the fixture only needs enough tools to reach line 146. Two extra single-file prove-red mutations add seconds; the 20-minute CI timeout is not threatened.
- **My own near-miss.** Two experiment runs leaked to the real network because system `git`/`curl` were still on `PATH`. If the tests are written carelessly they will pass for the wrong reason. Assertion 4 must verify the seal, not assume it.
- **Not testable, stated plainly:** the 5 s ceiling. It is enforced by `GIT_HTTP_LOW_SPEED_TIME` and `curl --max-time`, which a stub binary ignores by construction. No test is proposed for it — a stub-based "timeout test" would assert nothing.
- **Accepted residual:** an install whose `.version` has `sha=unknown` (install.sh's own fallback at `install.sh:63`) renders `(unknown → deadbee)` and re-banners every window until the user runs `fkit update`, which self-heals it. Honest, and I'd leave it rather than add a guard — but it is a real behaviour worth the owner's eyes.
