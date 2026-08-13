# Implementation plan — Task 0254: fix the unrunnable verify command `bin/release.mjs` prints

## 0. Corrections to the brief's own facts (found while grounding; carry these forward)

Two of the brief's stated line numbers are stale, and one of its factual claims is overstated. None
changes what gets built, but the record should be right (`evidence-before-assertion.md`).

1. **The line is `bin/release.mjs:276`, not `:220`.** Verified this turn:
   `grep -n "npx github:flashist" bin/release.mjs` → single hit at **276**. The file is 277 lines.
   Line 220 today is `git ls-remote --tags origin tag` inside the tag-existence check — unrelated.
   The brief, `sprint-5.md:165`, and `backlog.md:181` all still say `:220`. I will **not** edit those
   (⛔ no task-file move / no brief rewrite under this brief); the plan carries the correction.
2. **The summary block is `:271-277`, not `:216-221`.** The `else` branch that prints the line is:
   ```js
   } else {
     console.log(`\n${"─".repeat(48)}\n✓ Released ${tag}`);
     console.log(`  Verify: npx github:flashist/fkit#${tag} --version`);
   }
   ```
3. **"No install path resolves a tag" is overstated.** `install.sh:19` is
   `REF="${FKIT_REF:-main}"` and `install.sh:32` fetches
   `https://codeload.github.com/$REPO/tar.gz/$REF` — so `FKIT_REF=v0.2.1 curl … | sh` *would*
   resolve a tag. What is true is the weaker claim: **the default and documented install path
   tracks `main`, and nothing in the release script points at a tag as an install target.**
   `claude/fkit-claude.sh:106` likewise defaults `fkit_ref` to `main`.
   This does not change the fix — it *strengthens* the option chosen below, because that option makes
   no claim about installability at all. It is worth knowing because the sibling task
   [`0252`](../0252-.../brief.md), which owns the "why a tag is not an install target" record, should
   not inherit the overstatement. **I am not touching 0252** — flagged as an open question.

## 1. The choice: `git ls-remote` against `origin`, not `curl … install.sh | sh`

The brief offers two candidates and asks for one, justified. **I pick the `git` command.** Reasons,
strongest first:

- **The install path has a real side effect on the maintainer's machine.** `install.sh` does
  `rm -rf "$SHARE/claude"` and re-copies into `$HOME/.local/share/fkit`, plus writes `$HOME/.local/bin`.
  Printing it as the routine post-release "did it land?" check tells the releaser to **reinstall their
  own toolchain** to answer a question about a tag. That is a disproportionate verify. It is also
  hostile to *this* task's own requirement — see the next point.
- **Brief verification step 2 requires me to actually run the command I print.** Running
  `curl … install.sh | sh` during Build would blow away and reinstall the owner's live
  `~/.local/share/fkit`. A `git ls-remote` is read-only and safe to run repeatedly. A verify line that
  cannot be safely verified is not a good replacement for a verify line that could not be run at all.
- **It verifies exactly what the script just did — no more, no less.** The release script's last act is
  `git push origin <tag>` (`:264`). The matching verification is "did that tag reach origin?" The
  install path verifies something else entirely: that `main` HEAD installs — which, as the brief itself
  notes, is **not the tag just cut**. Printing it would require a caveat sentence explaining that the
  command does not check the thing the line appears under, which is a worse line, not a better one.
- **It cannot imply a tag is installable** (brief requirement 2). It makes no statement about
  installation whatsoever, so the misstatement is removed by deletion rather than by an added
  disclaimer that would drift into 0252's scope.
- **It matches the surrounding code.** `bin/release.mjs:219-220` already uses
  `git ls-remote --tags origin <tag>` for its own remote-tag existence check. Printing the same shape
  is idiomatic here, not a new concept introduced into the file.

### The `--exit-code` detail — this is the part that matters

Plain `git ls-remote --tags origin v0.2.1` **exits 0 whether or not the tag exists**; it just prints
nothing on failure. Shipping that would reproduce the exact defect class this task exists to fix: a
"verify" command that cannot fail. Confirmed from the local man page this turn (git 2.50.1):

> `--exit-code` — Exit with status "2" when no matching refs are found in the remote repository.
> Usually the command exits with status "0" … whether it found any matching refs.

So the printed command **must** carry `--exit-code`.

## 2. The change — one line, one file

**File:** `/Users/mark.dolbyrev/Workspace/fkit/bin/release.mjs`
**Line:** 276 (inside the non-dry-run summary `else` branch, `:271-277`)

Replace:
```js
  console.log(`  Verify: npx github:flashist/fkit#${tag} --version`);
```
with:
```js
  console.log(`  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}`);
```

Notes on the exact wording:
- **`Verify tag on origin:`** rather than bare `Verify:` — it names the *scope* of what is being
  verified. This is deliberate: the old line's second sin was over-claiming, and a label that says
  "tag on origin" cannot be read as "the release is installable and working".
- Two-space indent and backtick template preserved — matches the `✓ Released ${tag}` line above it.
- `${tag}` interpolation retained, so the printed command is copy-pasteable as-is.
- Nothing else in the file is touched. No bump logic, no tag logic, no test gate (⛔ brief).

**Explicitly NOT doing:** no `bin` field in `package.json` (⛔ ADR-011). I do **not** believe a `bin`
field is the right answer here, so there is nothing to escalate on that boundary — the `git` command
solves the problem fully without making fkit an npx-runnable CLI.

**Also explicitly NOT doing:** no second printed line explaining that installs track `main` rather
than the tag. Rationale: the misstatement lived in the `npx` command; deleting the command deletes the
implication. An added "note: installs track main" line is the *release-hygiene explanation*, which is
[`0252`](../0252-.../brief.md)'s job, and the brief says "this task only fixes the printed line."
Surfaced as an open question below in case the owner wants it here instead.

## 3. Verification — what I will run, in order, and where the output goes

All output recorded in
`ai-agents/tasks/backlog/0254-fix-the-unrunnable-verify-command-release-mjs-prints/worklog.md`
(see §4 on why that file does not violate the one-file rule).

1. **Run the replacement command, positive case** (brief step 2 — the load-bearing one):
   ```
   git ls-remote --exit-code --tags origin v0.2.1 ; echo "exit=$?"
   ```
   Expect a `<sha>\trefs/tags/v0.2.1` line (plus the `^{}` peeled ref, since release tags are
   annotated — `:260` uses `git tag -a`) and `exit=0`.
2. **Run the replacement command, negative case** — this is what would have caught the original
   defect, so I am running it too:
   ```
   git ls-remote --exit-code --tags origin v99.99.99 ; echo "exit=$?"
   ```
   Expect no output and `exit=2`. If this returns `exit=0`, `--exit-code` is not doing what the man
   page says on this git build and the plan is wrong — I stop and report rather than shipping it.
   **Network dependency:** both commands talk to `origin` over the network. If the Build environment
   has no network reach to GitHub, I will say so plainly and return `BLOCKED` on brief step 2 rather
   than assert the command works. I will not substitute a local-only proxy check and call it verified.
3. **Prove the rendered string**, since the changed line is unreachable in dry-run (see the honesty
   note below):
   ```
   node -e 'const tag="v0.2.1"; console.log(`  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}`)'
   ```
   and confirm the emitted text is byte-identical to what step 1 executed.
4. **Brief step 1 — `node bin/release.mjs --dry-run` runs clean.**
   `doTest` is independent of `dryRun` (`:81` vs `:84`), so this **runs the full `npm test` suite,
   ~6 min including `prove-red.sh`** — which also satisfies brief step 5 in the same run. If it is
   cleaner to separate them I will run `--dry-run --no-test` plus a standalone `npm test`; either way
   both are run and both results recorded, green or not.
5. **Brief step 1, second half:** `grep -n "npx github:flashist" bin/release.mjs` → expect **no hit**.
6. **Brief step 4:** `grep -n '"bin"' package.json` → expect **no hit** (out-of-scope boundary held).
7. **Brief step 3:** `git diff --stat` → expect exactly one file, `bin/release.mjs`.

### Honesty note that must survive into the ship report

**`--dry-run` does not exercise the changed line.** The summary block is
`if (dryRun) { …"Dry run — nothing was changed"… } else { …the Verify line… }` — so the branch I am
editing only executes on a **real, non-dry release**, which this task will not perform. Step 4 proves
the script still parses and runs; step 3 proves the exact string the branch will emit; step 1/2 prove
that string is a working command. What remains unproven end-to-end is the branch actually firing
during a live release. I will state that as unverified rather than let "dry-run clean + tests green"
be read as full coverage.

## 4. The one-file rule vs. the worklog — resolution, stated openly

Brief step 3 demands `git diff --stat` show **exactly one file changed: `bin/release.mjs`**. Brief
step 2 demands the command's output be **recorded in the task worklog**. Those look like they collide.

They do not, on the literal reading: the task folder currently contains **only `brief.md`** (checked
this turn — `git ls-files` on the folder returns just `brief.md`; there is no `worklog.md` yet). A
newly created `worklog.md` is **untracked**, and `git diff --stat` reports tracked changes only — so
step 3 still passes with exactly `bin/release.mjs`.

I am flagging this rather than relying on it silently, because a stricter reading ("`git status
--short` shows nothing but release.mjs") would fail. Open question below.

Separately: I am a spawned worker under `fkit-sprint-ship-loop`, so the ADR-019/ADR-032 audit
obligation applies to the Build step — every fix applied without asking, and every obvious-winner
call, gets a decision-log entry in that same `worklog.md`, or an explicit `none`. That file is going
to exist regardless of the verify-output question.

## 5. Edge cases and plausible failure modes considered

- **`--exit-code` silently absent / different on an older git.** Guarded by verification step 2 (the
  negative case). Contract confirmed against git 2.50.1 locally.
- **Annotated-tag peeled refs.** `git tag -a` (`:260`) means `ls-remote` prints two lines
  (`refs/tags/vX` and `refs/tags/vX^{}`). Cosmetic; exit code is unaffected. Noted so nobody reads the
  doubled line as a bug.
- **`origin` not configured / different remote name.** The script itself already hardcodes `origin`
  throughout (`:220`, `:250`, `:264`), so the printed command inherits exactly the same assumption the
  release just relied on. No new fragility introduced.
- **Prefix-matching.** `git ls-remote --tags origin v0.2.1` matches the ref by pattern; `v0.2.1` will
  not spuriously match `v0.2.10` (ls-remote patterns match against the full ref path tail, and the
  tags differ). If verification step 1 shows otherwise I will switch the printed pattern to the fully
  qualified `refs/tags/${tag}` and record why.
- **No test asserts on this string** (confirmed: `grep -rln "release" test/` hits only
  `update-banner.test.js`, `structure-manifest.test.js`, and two rank fixtures — none of which
  reference the summary line), so no test needs updating. Consistent with ⛔ "no added test gate".
- **`bin/release.mjs` is inside the install share / structure manifest.** Changing its content may
  change a hash in the structure manifest. I will check whether `npm test`'s
  `structure-manifest.test.js` goes red on the edit. **If it does, that is a scope question, not a
  silent second-file fix** — regenerating `structure-manifest` would touch a second file and break
  brief step 3. I would return `NEEDS-DECISION` at that point rather than widen scope. I have **not**
  verified whether the manifest covers `bin/` — that check belongs in Build.

## 6. Sequence

1. Edit `bin/release.mjs:276` (the one line above). No other edit.
2. Run verification 1 → 2 → 3 (the command itself, both cases, plus the rendered string).
3. Run verification 4 (`--dry-run`, full suite) and 5 → 6 → 7 (greps and diff).
4. Write `worklog.md` with all recorded output verbatim, green or red, plus the ADR-019 decision log.
5. Report: change surface, every command's real output, and the explicit unverified item from §3.

---

## Open questions for the owner (returned as text — `AskUserQuestion` is absent in a spawn, ADR-021)

1. **Worklog vs. the one-file rule.** Plan §4 resolves it by noting a new untracked `worklog.md` is
   invisible to `git diff --stat`, so brief step 3 still passes. Confirm that is the intended reading —
   or say the working tree must be clean of *everything* but `bin/release.mjs`, in which case tell me
   where the command output should go instead.
   *My recommendation: accept the literal reading; the worklog is required by brief step 2 and by
   ADR-019's audit duty anyway.*
2. **Should the printed line also say installs track `main`, not the tag?** Plan §2 says no — that
   explanation is [`0252`](../0252-.../brief.md)'s job and adding it here makes the "one-line change"
   a two-line one. *My recommendation: leave it out; the `git ls-remote` line makes no installability
   claim, so nothing needs disclaiming.*
3. **The brief's overstated fact (plan §0.3).** `FKIT_REF=v0.2.1` *does* resolve a tag, so
   "no install path resolves a tag" is not quite right — the true claim is "the default install path
   tracks `main`." This wording is repeated in 0252's framing. *My recommendation: no action under
   0254 (⛔ out of scope), but route the correction to 0252 before that task is planned, so it does
   not inherit the overstatement.*

---

<!-- ─────────────────────────────────────────────────────────────────────────
     DRIVER-APPENDED — NOT part of the approved plan text above.
     Written by fkit-sprint-ship-loop at the plan gate, 2026-08-13.
     ───────────────────────────────────────────────────────────────────────── -->

## Owner approval record (driver-appended)

The owner approved this plan via `AskUserQuestion` in the `fkit lead` session on **2026-08-13**, and
answered all three open questions above:

1. **Worklog vs. the one-file rule** — accepted the literal reading. The untracked `worklog.md` (and
   this `plan.md`) do not appear in `git diff --stat`, so brief verification step 3 still passes with
   exactly `bin/release.mjs`. Proceed as planned.
2. **Should the printed line also say installs track `main`?** — **No. Leave it out.** Owner selected
   the plan's own recommendation verbatim: *"No — leave it out"*. The change stays a one-line change;
   the release-hygiene explanation remains `0252`'s.
3. **The brief's overstated "no install path resolves a tag"** — **Route it to `0252`, no action
   now.** Owner selected *"Route it to 0252, no action now"*. ⛔ Nothing is to be edited under `0254`
   — not the brief, not `sprint-5.md`, not `backlog.md`. The driver holds the correction and folds it
   into `0252`'s plan prompt, which is the next task in this same loop run.

**Driver's independent check of the plan's §0 corrections, run before approval** (all measured this
turn, not asserted):

- `grep -n "npx github:flashist" bin/release.mjs` → single hit at **`276`**. The brief's `:220` is
  stale. Confirmed.
- The summary block sits at `:271-277`; the changed line is inside the `else` (non-dry-run) branch.
  Confirmed — so the dry-run honesty note in §3 is correct.
- `install.sh:19` = `REF="${FKIT_REF:-main}"`, `install.sh:32` fetches
  `https://codeload.github.com/$REPO/tar.gz/$REF`. §0.3's correction stands.
- `git ls-remote --exit-code --tags origin v99.99.99` → **`exit=2`**. The `--exit-code` contract in §1
  is measured on this machine, not read from a man page alone.
- `grep -n '"bin"' package.json` → no hit. The out-of-scope boundary is intact at the start.
