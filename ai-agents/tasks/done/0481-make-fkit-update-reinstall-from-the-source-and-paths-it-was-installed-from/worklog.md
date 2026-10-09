# Worklog — 0481 Make `fkit update` reinstall from the source and paths it was installed from

Build step, spawned `fkit-coder` under `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05.
Approved plan: `plan.md` in this folder (blob `caf9bc92f3ade0a524308e5162542542b5edde41`, 18362 bytes;
hash and size re-checked at the start of Build — they match). `plan.md` was not edited.

## Owner rulings on the plan's open questions (2026-10-05, `AskUserQuestion` in the lead session)

The plan is never edited; the rulings live here.

- **OQ1 — an old install with no `bin=`:** *"Default only if proven"* — design (b) as written. No PATH
  search was added.
- **OQ2 — a failed download (step 1b):** *"Yes, include it"* — step 1b and test case 10 are kept.

## Red before the fix (plan Step 3; brief verification 1)

The new suite was written first and run against the unedited launcher and installer
(`git diff --quiet -- claude/fkit-claude.sh install.sh` was clean). Result: **10 tests, 0 pass, 10 fail**.
Case 1, the defect itself:

```
✖ 0481/version-only: repo/ref from .version reach the installer, not the defaults
  AssertionError [ERR_ASSERTION]: the installer did not receive the recorded repo
  + actual - expected
  + '<unset>'
  - 'fkit-test/no-such-repo-0481'
```

The other nine went red for their own reasons: the installer got `<unset>` for share/bin
(`custom-paths`, `default`, `old-version-proven-default`); `now at v9.9.9` read the old share
(`env-wins`); no refusal, exit 0 (`old-version-unknown-bin`, `old-version-foreign-wrapper`); `.version`
had no `bin=` (`install-sh-records`); the hint ended `install.sh | sh` (`reinstall-hint`); a failed
download exited 0 and printed `now at v9.9.9` (`download-fails`).

## Green after the fix

`node --test test/update-reinstall.test.js` → **10 tests, 10 pass, 0 fail** (node v24.13.0, macOS,
`/bin/sh` = bash). Same suite with **dash** as the shell (a scratch copy of the test file with
`/bin/sh` → `/bin/dash` for every spawn, every stub shebang and the sealed `sh`): **10 / 10 pass**.
Limit of that dash run: in cases 8–9 the `fkit` wrapper and the launcher it execs start through their
own `#!/bin/sh` shebangs, so locally those two hops still ran under bash. CI's `/bin/sh` is dash.

## Prove-red (plan Step 4) — dry run only

Not run as part of `npm test` here (that is the Verify step). Dry-run in scratch, reproducing exactly
what step 0p and mutation 41 do (copy of `claude/` with a sibling `package.json`, the same `sed`):
- step 0p equivalent: unmutated copy → **green**.
- mutation 41 equivalent: the `sed` changed **exactly one line** (`    | FKIT_REPO=… sh` →
  `    | sh # mutation: installer variables stripped`); suite → **red**, and red **at
  `0481/version-only`**. (`env-wins`, the refusals, the hint and `download-fails` stay green under the
  mutant, as expected: exported variables still reach `sh`.)

## Manual check (brief verification 3)

Scratch HOME under the session scratchpad; sealed PATH (symlinked coreutils, no `git`); stub `curl`
serving a local tarball of `claude/` and a fake `install.sh` that prints what it receives. No network.
1. The real `install.sh`, piped to `sh` with `FKIT_REPO=me-test/fork-0481 FKIT_REF=dev FKIT_SHARE=<scratch>/custom/share FKIT_BIN=<scratch>/custom/bin`
   on the `sh` only. `.version` came out with `repo=me-test/fork-0481`, `ref=dev` and an absolute
   `bin=<scratch>/custom/bin`.
2. `env -i PATH=<sealed> HOME=<scratch home> <scratch>/custom/bin/fkit update` from a scratch cwd. Output:
   `updating from me-test/fork-0481@dev...`, then the fake installer reported
   `REPO=me-test/fork-0481 REF=dev SHARE=<scratch>/custom/share BIN=<scratch>/custom/bin`, then
   `now at v9.9.8 (unknown)`; exit 0. curl was asked for `…/me-test/fork-0481/dev/install.sh`.
3. `<scratch home>/.local/share/fkit` and `<scratch home>/.local/bin` **do not exist**.
(A first attempt was run from the repo as its cwd and self-hosted into the checkout, which refused
with "source checkout". That is expected behaviour, not a finding; the rerun from a scratch cwd is the
result above.) Case 8 of the suite automates the same check.

## Step audits

- **Step 1f:** the `GIT_TERMINAL_PROMPT=0 GIT_HTTP_LOW_SPEED_* git ls-remote … | awk` prefix in
  `_fkit_remote_sha` is **correct as written** — the variables are meant for `git`, the first command
  of the pipe. No change.
- **Step 2e:** `curl … | sh` in `README.md`, `claude/README.md` and `install.sh`'s header are default
  installs — correct. `RELEASING.md`'s `| FKIT_REF=v0.2.1 sh` already sets it after the pipe — correct.
  No other prefixed pipe into `sh` in the launcher or installer.
- **Step 5:** `claude/README.md` has no stale line (only `fkit update  # update fkit itself`). No edit.
- **Step 8:** no `.claude/` refresh — nothing under `claude/agents/` or `claude/skills/` changed, and
  the launcher is not copied into `.claude/`.
- **Brief verification 5:** `grep -n -i "exported\|current environment" README.md claude/README.md install.sh`
  → no matches.
- **Brief question (c):** as the plan found — no reader of `.version` besides `_fkit_verfield`, which
  reads by key. Nothing else changed for it.

## Checks run (Build)

- `node --test test/update-reinstall.test.js test/update-banner.test.js test/launcher-contract.test.js`
  → **67 tests, 67 pass, 0 fail**.
- `sh -n` and `dash -n` on `claude/fkit-claude.sh` and `install.sh` → clean. `bash -n` and `dash -n`
  on `test/prove-red.sh` → clean.
- `npm run test:docs` (extra, cheap; `architecture.md` changed) → **372 / 372 pass**.
- Grep of every changed file for absolute machine paths → none (one comment names macOS's
  `/private/var` generically).
- **Not run here:** the full `npm test` (incl. prove-red step 0p and mutation 41) — it is the separate
  Verify step, per the driver's instruction.

## Decision log (calls made without asking — each one: finding/step, what changed, why it qualified)

No review findings were processed in this step; these are the Build step's own calls.

1. **`HOME` unset guard (step 1d).** Added `[ -n "${HOME:-}" ] &&` before the default-bin proof. Without
   it, `set -u` aborts with a shell error on an unset `HOME` instead of the plan's one-line refusal.
   Mechanical, localized, and the outcome is exactly design (b)'s refusal — inside the plan.
2. **More line citations re-derived than the plan listed (step 7).** The plan's rule is "re-derive each
   one my edits shift"; its list missed some. Also updated in `architecture.md`: the diagram's
   `:373-377`→`:405-409`, `:532-560`→`:564-592`, `:581-639`→`:613-671`, `:641-691`→`:673-723`,
   `:706`→`:738`; the second `install.sh:86-95` (at the "retired verbs" history bullet) →`:94-103`;
   and the self-update bullet's `:126-166`→`:158-198`. Each was checked by grep against the edited file.
   Mechanical (+32 shift after launcher line 99; +8 after `install.sh` line 64) — obvious winner within
   the plan's intent.
3. **Three citations re-pointed at their real target, not just shifted (step 7).** They were already
   off before this change: `update-banner.test.js` `:138`→`:171` (the `[ -n "$remote" ]` guard it
   names; `:138` was the line above it), `:511`→`:405-409` (the init call it names; `:511` was an awk
   line); `RELEASING.md` `claude/fkit-claude.sh:106`→`:124` (the `fkit_ref` default it names; `:106`
   was the `fkit_repo` line). The text around each says what it points at, so the right target is not
   in doubt — obvious winner.
4. **CHANGELOG wording (step 6).** The bullet also says a failed download now fails the update (step 1b,
   owner-approved), and the upgrade note carries the hand-reinstall command. Same facts the plan
   lists; wording only.
5. **Left alone, on purpose (out of plan, flagged for the driver):** citations that were already stale
   before 0481 and that this change also moves — `claude/fkit-claude-init.sh:644`
   (`fkit-claude.sh:576`; the `[ -x … ]` interview probe it names is now at `:642`),
   `test/orphan-cleanup.test.js:288` (`fkit-claude.sh:311-312`; the settings write is now near
   `:379`), and `RELEASING.md`'s `:79-91` / `:92-98` (before the edit, one line off). Backlog briefs
   that cite launcher lines (e.g. 0284) were not touched — they are other tasks' briefs. Fixing them
   is a citation sweep (0394 / 0472 territory), not this task.
6. **Known limit noted, not fixed:** `install.sh` does not make a relative `FKIT_SHARE` absolute. It is
   not recorded in `.version` (the launcher uses its own `$share`), and a relative share already breaks
   the generated wrapper's `exec` line today. Pre-existing; outside the plan.

## Verify

Spawned `fkit-coder`, Verify step of `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05. Verify only: no
source, test or doc edits. `plan.md` blob re-checked: `caf9bc92…` (unchanged).

**Result: pass.** Every check in the plan's `## Checks` ran green.

- **Full `npm test`** — in a fresh `cp -R` of the working tree (incl. `.git`) under the session
  scratchpad, so no concurrent agent could race it. Exit 0, 16m27s wall.
  - Unit: **1027 tests, 1027 pass, 0 fail**, 0 cancelled, 0 skipped.
  - Prove-red: `0p. unmutated copy update-reinstall suite should be green ... green`;
    `41. installer variables stripped — "0481/version-only" should go RED ... red` (the named-assertion
    check passed: no "red for the wrong reason" line); final line
    `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
- **Targeted:** `node --test test/update-reinstall.test.js test/update-banner.test.js test/launcher-contract.test.js`
  → **67 / 67 pass** (second scratch copy).
- **Syntax:** `sh -n` and `dash -n` on `claude/fkit-claude.sh` and `install.sh` → clean;
  `bash -n test/prove-red.sh` → clean.
- **Dash run of the new suite (optional; run):** scratch copy of the test with every `/bin/sh` spawn,
  stub shebang and the sealed `sh` pointed at `/bin/dash` → **10 / 10 pass**. Same limit as Build's run:
  in cases 8–9 the generated wrapper and the launcher start via their own `#!/bin/sh`, so those two
  hops ran under bash locally.
- **Brief verification 5:** `grep -n -i "exported\|current environment" README.md claude/README.md install.sh`
  → no matches.
- **Machine paths:** none in any 0481 file. Only generic mentions of macOS `/private/var` (a test
  comment, the plan, this worklog).
- **Line citations (spot check):** the re-derived `claude/fkit-claude.sh` / `install.sh` citations in
  `architecture.md`, `RELEASING.md` and `update-banner.test.js` land on what they name. One note, not a
  defect of this change: `RELEASING.md`'s `:136-138` was shifted to `:168-170` (stamp/remote/installed),
  while the non-emptiness guard it describes is at `:171`. The old range was already one line short;
  Build re-pointed the same guard to `:171` in `update-banner.test.js` but not here.
- **Not run:** the brief's manual check 3 (Build did it, above; case 8 automates it and passed). The real
  `fkit update` / real `install.sh` against the real HOME — never run, by rule.

Fix calls made unattended in this step: **none** (verify only).

## Process review (round 1)

Spawned `fkit-coder`, Process-review step of `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05, under the
driver's declared-approval marker (approved plan blob `caf9bc92…`). `review.md` § Coder response holds
one row per finding R1–R4.

### Owner ruling recorded

- **R2 — launcher reached through a symlink or a copy:** *"Add a guard"* (2026-10-05, direct, via
  `AskUserQuestion` in the fkit-lead session): refuse the update unless the folder it worked out really
  holds an fkit install, and add a test. Implemented as below. R1, R3 and R4 were **not** owner-ruled;
  they were applied under the standing approval (decision log).

### Red before the fixes

New cases written first, run against the post-Build launcher/installer: 14 tests, 11 pass, 3 fail —
- `0481/relative-bin-cdpath`: `bin=` came out as `<cdpath-decoy>/bin`, expected `<cwd>/bin`.
- `0481/symlinked-launcher`: `expected exit 1, got 0` (the installer ran against the link's parent).
- `0481/copied-launcher`: `expected exit 1, got 0`.
- `0481/symlinked-launcher-env-share` passed before and after (it pins that an explicit `FKIT_SHARE`
  keeps working; it is not a red-first case).
After: 14 / 14. Scratch mutations of the guard: dropping the location half reds `copied-launcher`;
dropping the whole guard reds `symlinked-launcher` and `copied-launcher`.

### Decision log (calls made without asking — finding, what changed, why it qualified)

1. **R1** — `install.sh` `BIN="$(cd "$BIN" && pwd)"` → `BIN="$(CDPATH= cd -- "$BIN" && pwd)"`; the two
   comment lines above it reworded (same line count, so no `install.sh` citation moves). Test
   `0481/relative-bin-cdpath` added (`run()` gained an optional `cwd`). Qualified: verified CORRECT
   (reproduced under dash and /bin/sh), one-line mechanical fix, inside plan step 2a's intent.
   The comment avoids the word "exported" so brief verification 5's grep stays empty (first wording
   tripped it; caught and reworded).
2. **R2 guard shape** (owner-ruled; these are the shape calls inside it):
   - Marker = `[ -f "$share/.version" ] && _fkit_same_dir "$here" "$share/claude"` — the root has a
     `.version` AND this launcher is that root's own `claude/`. `.version` alone was rejected: a stray
     file at the derived root would pass it (test `copied-launcher`).
   - **Applied only when `FKIT_SHARE` is not given.** An explicit `FKIT_SHARE` is the user naming the
     target, the same contract `install.sh` has, and the plan's `0481/env-wins` installs into a share
     that does not exist yet as an install — guarding the env target would break the approved plan.
     The derived `$share` is not handed to the installer in that case, so the destructive path is
     closed either way. Judged an obvious winner within the ruling's intent, not a NEEDS-DECISION.
   - The refusal names both `FKIT_SHARE` and `FKIT_BIN`: through a symlink, `bin=` is also read from
     the wrong root, so `FKIT_SHARE` alone would hit the bin refusal next.
   - Placed after the source-checkout refusal and before bin resolution (plan step 1d's order).
   - CHANGELOG `## Unreleased` bullet and `architecture.md`'s `fkit update` bullet now mention the
     refusal (user-visible behaviour; docs-only).
3. **Citation re-derivation forced by R2** — the guard adds 6 launcher lines after line 136. Re-derived
   (+6, each checked by grep of the named construct): `architecture.md` codex preflight `:577-598`, the
   diagram's `:127-162` / `:164-204` / `:411-415` / `:570-598` / `:619-677` / `:679-729` / `:744`, the
   self-update bullets `:100-162` and `:164-204`; `RELEASING.md` `:194-200`; `test/update-banner.test.js`
   comments `:164-203`, `:206-234`, `:411-415`, `:234`, `:177`. Mechanical — obvious winner within plan
   step 7. Shifted as-is, not re-targeted: `update-banner.test.js`'s "exits … at :234" lands on the
   heredoc's `EOF`, one line above `exit 0 ;;` (`:235`) — it was the same off-by-one before (`:228`).
4. **R3** — both `RELEASING.md` "non-emptiness" / "compares the installed sha" citations →
   `claude/fkit-claude.sh:177` (the `[ -n "$remote" ]` guard, after the R2 shift). Verified CORRECT,
   mechanical, in plan step 7.
5. **R4** — dropped the vacuous `$HOME/.local` assertion in `0481/custom-paths`, with a comment pointing
   to `0481/install-sh-records`. Verified CORRECT (the fake installer writes only the capture and
   `$FKIT_SHARE/.version`; the update arm writes nothing under `$HOME`), mechanical, in plan step 3.

### Routed, not fixed (out of scope)

- Pre-existing stale citations, now a further +6 off where they point past launcher line 136:
  `claude/fkit-claude-init.sh:644` (`fkit-claude.sh:576`), `test/orphan-cleanup.test.js:288`
  (`fkit-claude.sh:311-312`), `RELEASING.md` `:79-91` / `:92-98` (before line 136; unchanged by this
  round), and backlog briefs citing launcher lines (e.g. 0284) → citation sweep, 0394 / 0472.
- CI runtime vs the 20-minute workflow timeout → 0395.
- Observation only: the launcher's own first line `here="$(cd "$(dirname "$0")" && pwd)"` has the same
  CDPATH exposure as R1 when `$0` is relative. Pre-existing, not in any finding; via the installed
  wrapper `$0` is absolute, so it is not reached in the normal path.

### Checks run (process review)

- **Full `npm test`** in a fresh `cp -R` of the working tree under the session scratchpad: exit 0,
  19m00s wall. Unit **1031 / 1031 pass** (1027 + the 4 new cases). Prove-red: `0p … green`,
  `41. installer variables stripped — "0481/version-only" should go RED ... red`, final
  `✓ hard gate PASSED`. Mutation 41's sed anchors on the `| FKIT_REPO=… sh` line, which the guard
  does not touch. One caveat: `install.sh`'s R1 comment was reworded (comment-only, no line-count
  change) and copied into the scratch tree after `npm test` had started.
- Targeted: `node --test test/update-reinstall.test.js test/update-banner.test.js test/launcher-contract.test.js`
  → **71 / 71** on the real tree, after the last edit.
- `test/update-reinstall.test.js` with **dash** as the shell (scratch copy: every `/bin/sh` spawn, stub
  shebang and the sealed `sh` → `/bin/dash`) → **14 / 14**. Same limit as before: the generated wrapper
  and launcher still start via their own `#!/bin/sh` in cases 8–9.
- `sh -n` / `dash -n` on `claude/fkit-claude.sh` and `install.sh`; `bash -n` / `dash -n` on
  `test/prove-red.sh` → clean.
- `npm run test:docs` on the real tree (after the `architecture.md`, `worklog.md` and `review.md` edits)
  → **372 / 372**; `coordination-citation-policy.test.js` → 21 / 21.
- Brief verification 5 grep → no matches. Machine-path grep of every file changed this round → none.
- **Not run:** the real `fkit update` or the real `install.sh` against the real HOME — never, by rule.

Fix calls made unattended in this step: R1, R3, R4 and the R2 shape calls — see the decision log above.

## Re-verify (post-review)

**Outcome: BLOCKED — the snapshot passed, but the real tree changed during the run, so the result does
not cover the current tree.** The copy was taken at 15:03 (Oct 5). At 15:22:55 `claude/fkit-claude.sh`
and at 15:23:39 `test/update-reinstall.test.js` were edited in the real tree (review.md also changed at
15:13). That looks like a round-2 fix in flight: `_fkit_verfield` takes an optional `<root>`, an explicit
`FKIT_SHARE` that holds an install now supplies its own repo/ref/bin (launcher +8 lines, now 752), and
two new tests (`0481/symlinked-launcher-hint-keeps-source`, `0481/env-share-record-precedence`).
None of that was verified here. Diagnose only — nothing fixed.

### Checked on the snapshot (launcher sha1 `3b9c2c5b…`, install.sh `f586842c…`)

- Full `npm test` in a fresh `cp -R` (with `.git`) under the session scratchpad, nothing else running
  in it: exit 0, **1160 s (19m20s) wall**. Unit **1031 / 1031 pass**, 0 fail. Prove-red:
  `0p. unmutated copy update-reinstall suite should be green ... green`;
  `41. installer variables stripped — "0481/version-only" should go RED ... red` (no "wrong reason"
  line); final `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
- `node --test test/update-reinstall.test.js test/update-banner.test.js test/launcher-contract.test.js`
  → **71 / 71**. `sh -n` / `dash -n` on `claude/fkit-claude.sh` and `install.sh` → clean.
- Brief verification 5 grep (`exported\|current environment\|keep.*export` over README.md,
  `claude/README.md`, `install.sh`) → no matches. Machine-path grep of 0481's changed files → none
  (only the generic macOS `/private/var` mentions in plan/worklog).
- Citation spot-check (snapshot launcher): every 0481-owned citation lands — architecture `:577-598`,
  `:127-162`, `:164-204`, `:411-415`, `:570-598`, `:619-677`, `:679-729`, `:744`, `:100-162`;
  RELEASING `:124`, `:177` (x2), `:194-200`, `install.sh:71`/`:73`; update-banner `:164-203`,
  `:206-234`, `:411-415`, `:177`, `:234` (`EOF`, the known one-off above `exit 0 ;;`). RELEASING
  `:79-91` / `:92-98` are one line early, but identical at HEAD — pre-existing, already routed.

### Failed

- **Step 3 (`cmp` at the end):** `install.sh` identical; **`claude/fkit-claude.sh` differs** (first at
  line 72) and `test/update-reinstall.test.js` differs.
- **New citation drift in the real tree:** the +8 launcher lines sit after the guard, so citations past
  ~line 143 no longer land: the update check is now `:172-212`, the guard `[ -n "$remote" ]` `:185`,
  `exit 0 ;;` `:243`, `exec claude` `:752`. Not re-derived here.

**Needed:** once the in-flight edit is done, re-derive the citations (+8) and re-run this re-verify on a
fresh copy.

## Process review (round 2)

Spawned `fkit-coder`, Process-review step of `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05, under the
driver's declared-approval marker (approved plan blob `caf9bc92…`). `review.md` § Coder response gained
row R5. This round's fix is the in-flight edit the post-review re-verify above saw; that re-verify's
"Needed" (re-derive +8, re-run on a fresh copy) is done below.

### Owner ruling recorded

- **R5 — the refusal's hint loses a fork's repo/ref:** *"Fix it"* (2026-10-05, direct, via
  `AskUserQuestion` in the fkit-lead session; description: "The update reads the source from the
  install folder you named (or the message also mentions FKIT_REPO/FKIT_REF). A small change plus one
  test."). Direction given: when `FKIT_SHARE` is given and `$FKIT_SHARE/.version` exists, read
  `repo=`/`ref=`/`bin=` from that file; env `FKIT_REPO`/`FKIT_REF`/`FKIT_BIN` still win; precedence
  otherwise unchanged; keep `0481/env-wins` intact.

### Red before the fix

The two new cases, run against a scratch copy of the launcher with only the R5 edit reversed
(`FKIT_REINSTALL_ROOT`): 16 tests, 14 pass, 2 fail —
- `0481/symlinked-launcher-hint-keeps-source`: installer got `REPO: 'flashist/fkit', REF: 'main'`,
  expected the install's `fkit-test/no-such-repo-0481` / `v1.2.3` (the review's measurement, reproduced).
- `0481/env-share-record-precedence`: `update failed` (exit 1) — with `FKIT_SHARE` alone, `bin=` was
  read from the derived root (no `.version`), so the bin refusal fired.
After: 16 / 16. Scratch mutations, one line each: reading `bin` from `$share` again, comparing the
default wrapper to `$share` again, and reading `repo` from `$share` again each red
`0481/env-share-record-precedence`; the `repo` one also reds `0481/symlinked-launcher-hint-keeps-source`.

### Decision log (calls made without asking — finding, what changed, why it qualified)

1. **R5 fix** (owner-ruled) — `claude/fkit-claude.sh`, update arm, after the R2 guard: `src="$share"`;
   if `FKIT_SHARE` is non-empty and `$FKIT_SHARE/.version` exists, `src="$FKIT_SHARE"` and
   `fkit_repo`/`fkit_ref` are re-resolved as env → `$src/.version` → default; `fkit_bin` reads
   `bin=` from `$src`. `_fkit_verfield` gained an optional `<root>` argument (default `$share`, so every
   other caller is unchanged; same line count). The top-level `fkit_repo=`/`fkit_ref=` lines, which the
   automatic check also uses, are untouched. Exactly the owner's preferred direction.
2. **Shape call inside the ruling: the default-bin proof checks the named install.** With an old record
   (no `bin=`) and no `FKIT_BIN`, the `$HOME/.local/bin/fkit` wrapper is now compared with `$src`, not
   the derived `$share`. Why it qualified as an obvious winner within the ruling's intent: the proof's
   purpose (plan design (b)) is "the default wrapper runs the install being updated", and once `$src`'s
   record is what we read, `$src` is that install. The alternative only differs through a symlink/copy,
   where `$share` is the link's parent — it could never match, so it would always refuse; neither choice
   installs on a guess. Pinned by the third run of `0481/env-share-record-precedence`.
3. **Shape call: one record, no merging.** When `$FKIT_SHARE/.version` exists it is the only record read;
   a field missing there falls to the default (repo/ref) or the proof/refusal (bin), not to the derived
   root's `.version`. Why: "read from THAT file" in the ruling; mixing two installs' records would be a
   new precedence nobody asked for. When it does not exist, behaviour is exactly as before.
4. **Hint text left unchanged** (the ruling said "if cheap and clear"). After the fix, the hint's
   `FKIT_SHARE=<its install dir>` already brings the install's repo/ref, so adding `FKIT_REPO`/`FKIT_REF`
   would tell the user to retype values the record holds. `assertShareRefused` still pins both names
   it does carry.
5. **Test comment corrected** — `0481/symlinked-launcher-env-share` said repo/ref "fall back to the
   defaults"; now points to the new case. The new precedence case uses a fresh install per run (the
   fake installer rewrites the named share's `.version`; a first draft reused one and failed for that
   reason, not the code's).
6. **Citations re-derived (+8 after launcher line 143)**, each checked by `sed -n` on the named line:
   `architecture.md` `:577-598`→`:585-606`, diagram `:127-162`→`:127-170`, `:164-204`→`:172-212` (x2),
   `:411-415`→`:419-423`, `:570-598`→`:578-606`, `:619-677`→`:627-685`, `:679-729`→`:687-737`,
   `:744`→`:752`, self-update `:100-162`→`:100-170`; `RELEASING.md` `:177`→`:185` (x2),
   `:194-200`→`:202-208`; `test/update-banner.test.js` `:164-203`→`:172-211`, `:206-234`→`:214-242`,
   `:411-415`→`:419-423`, `:234`→`:242` (still the known `EOF` one-off), `:177`→`:185`. Mechanical —
   within plan step 7.
7. **Docs** — CHANGELOG `## Unreleased` bullet: the refusal's parenthesis adds "the repo and ref then
   come from that install's record". `architecture.md` self-update bullet: one sentence on an explicit
   `FKIT_SHARE` that holds an install. User-visible behaviour, docs-only.

### Routed, not fixed (out of scope)

- The pre-existing stale citations listed in round 1 (`claude/fkit-claude-init.sh:644`,
  `test/orphan-cleanup.test.js:288`, `RELEASING.md` `:79-91`/`:92-98`, backlog briefs) are now a
  further +8 off where they point past line 143 → citation sweep, 0394 / 0472.

### Checks run (process review, round 2)

- **Full `npm test`** in a fresh `cp -R` of the working tree (incl. `.git`) under the session
  scratchpad, copied after every code/doc edit of this round (and after the R5 row and the
  `Status: closed-out` header): exit 0, 18m41s wall. Unit **1033 / 1033 pass** (1031 + the 2 new cases),
  0 fail, 0 cancelled, 0 skipped. Prove-red: `0p. unmutated copy update-reinstall suite should be green
  ... green`; `41. installer variables stripped — "0481/version-only" should go RED ... red`; final
  `✓ hard gate PASSED`.
- **Nothing in the real tree changed during the run:** `cmp` of `claude/fkit-claude.sh`, `install.sh`,
  `test/update-reinstall.test.js`, `test/update-banner.test.js`, `test/prove-red.sh`, `RELEASING.md`,
  `CHANGELOG.md`, `architecture.md`, `review.md` and `worklog.md` against the copy → identical (and the
  `shasum` taken at copy time matches). This section was appended after the run; `npm run test:docs`
  was re-run on the real tree afterwards (below).
- Targeted: `node --test test/update-reinstall.test.js test/update-banner.test.js test/launcher-contract.test.js`
  → **73 / 73** on the real tree.
- `test/update-reinstall.test.js` with **dash** as the shell (scratch copy: every `/bin/sh` → `/bin/dash`,
  sealed `sh` → dash) → **16 / 16**. Same limit as before: in cases 8–9 the generated wrapper and the
  launcher start via their own `#!/bin/sh` (bash locally).
- `sh -n` / `dash -n` on `claude/fkit-claude.sh` and `install.sh`; `bash -n` / `dash -n` on
  `test/prove-red.sh` → clean.
- Brief verification 5 grep → no matches. Machine-path grep of every file changed this round → none.
- **Not run:** the real `fkit update` or the real `install.sh` against the real HOME — never, by rule.

Fix calls made unattended in this step: the R5 shape calls 2–5 and the mechanical items 6–7 — see the
round-2 decision log above (the fix itself was owner-ruled).

## Re-verify (final)

Independent light pass (fkit-coder, spawned by `fkit-sprint-ship-loop`, verify-only), 2026-10-05
15:48–15:51. **Result: pass.**

- **Tree stable:** `shasum` of `claude/fkit-claude.sh` (`0cf76683…`), `install.sh` (`f586842c…`),
  `test/update-reinstall.test.js` (`c2847783…`), `test/update-banner.test.js` (`f67fe359…`),
  `test/prove-red.sh` (`9516ef70…`) identical at start and end; `cmp` scratch copy == real tree for all five.
- **Scratch copy** (`git ls-files -co --exclude-standard`, no `.git`): `node --test
  test/update-reinstall.test.js test/update-banner.test.js test/launcher-contract.test.js` → exit 0,
  **73 / 73**. `npm run test:docs` → exit 0, 370 pass, 0 fail, **2 skipped** (closed-rank live legs 1–2:
  the copy has no `.git` — expected, not a pass). `sh -n` / `dash -n` on launcher + `install.sh` → clean.
- **Prove-red 0p + 41 in isolation** (its own `make_claude_copy` + mutation-41 `sed`, verbatim):
  0p **green**; 41 mutation landed (exactly 1 line, `FKIT_REPO="$fkit_repo"` gone) → suite **red**,
  including `✖ 0481/version-only` (also reds custom-paths, default, env-share-record-precedence,
  install-sh-records, old-version-proven-default, symlinked-launcher-hint-keeps-source).
- **R5 read:** `_fkit_verfield <key> [<root>]` defaults to `$share`; `src` block (`:144-152`) reads
  repo/ref/bin from `$FKIT_SHARE/.version` only when FKIT_SHARE is set and that file exists, each
  field `${FKIT_X:-…}` → env wins field by field. With no FKIT_SHARE the R2 guard (`:139-142`, exit 1)
  runs before `_fkit_reinstall` (`:162`); refusal tests assert `curlCalls == []`. `0481/env-wins`
  (env share with no `.version` → `src=$share`, all four from env) green.
- **Citations (0481-owned, +8 re-derived):** RELEASING `:124`, `:185` ×2, `:202-208`; architecture
  `:100-170`, `:127-170`, `:172-212`, `:419-423`, `:578-606`, `:627-685`, `:687-737`, `:752`;
  update-banner `:172-211`, `:214-242`, `:242`, `:419-423`, `:185` — each lands on what it names (or on
  the same offset its pre-0481 HEAD form had: `:242` is the heredoc `EOF`, `exit 0` is `:243`, as HEAD
  `:196`; architecture `:172-212` vs banner `:172-211` differ by one as HEAD `:126-166`/`:126-165` did).
  install.sh `:71`, `:73`, `:55-77`, `:94-103`, `:109` land.
- **review.md:** `Status: closed-out`; R1–R5 each have a Coder response row (all ✅ done).
- **Not run:** full `npm test` (driver's call — round-2 full run was on byte-identical files); the real
  `fkit update` / real `install.sh` against the real HOME (never, by rule). Wrote nothing but this section.
