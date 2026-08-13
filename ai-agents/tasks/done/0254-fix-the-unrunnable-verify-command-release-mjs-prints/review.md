# Review — 0254

Task: [`brief.md`](brief.md)
File(s) under review: `bin/release.mjs:276` (one line), `worklog.md` (new, untracked)
Status: in-review

**Round 1** — reviewer: `fkit-reviewer` (stateful review), 2026-08-13.

## ⚠️ Coverage statement (ADR-042 D1) — read before the findings

**Codex ran; Codex measured nothing.** The adversarial pass executed under
`codex exec --sandbox read-only`, which cannot write, run the suite, or execute a git command. Every
Codex claim in this ledger is **static reasoning**, and Codex labelled each of its own findings that
way without being asked. **All execution evidence below is mine**, produced in throwaway clones under
`/private/tmp/.../scratchpad/` — never against the real repo or the real `origin`.

Real-repo integrity re-checked after every execution: `HEAD 1c82cbf6…` unchanged, 32 local tags
unchanged, `VERSION 0.2.1` unchanged, `git status --porcelain` identical to the pre-review snapshot.
**Nothing was pushed to `flashist/fkit`.**

## ⚠️ Loud, up front — the changed line was never executed before this review

The worklog states (§4, §4g) that the edited branch cannot be exercised: *"What remains unverified:
the branch actually firing during a live release. … It cannot be, by construction."* **That is
false.** The branch is reachable in about ten seconds:

```
git clone <repo> /tmp/clone && cp bin/release.mjs /tmp/clone/bin/
cd /tmp/clone && node bin/release.mjs --no-test --no-push
```

I ran exactly that. The first execution of the changed line **in its whole life** happened during
this review, and it immediately surfaced R1 and R2 below. This matters beyond the record: the task
exists because someone printed a verify command without running it, and the fix was cleared on the
belief that its own branch was unrunnable. It was not.

---

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `bin/release.mjs:276` | Under `--no-tag` or `--no-push` the script prints `✓ Released <tag>` and then a verify command that exits 2 — under `--no-tag` it tells the maintainer to verify a tag it explicitly declined to create. **Measured.** |
| R2 | 1     | medium | `bin/release.mjs:276` | The command verifies only that *a tag of that name* exists on origin, not that it names this release — so a `--no-bump` re-run over an existing tag pushes a new commit and the verify still exits **0**. A false green. **Measured.** |
| R3 | 1     | medium | `worklog.md` §4, §4g | The worklog's *"cannot be verified, by construction"* claim is false; the branch is cheaply executable, and that false claim is what let R1/R2 ship unexamined. **Measured by counter-example.** |
| R4 | 1     | low    | `bin/release.mjs:276` | `${tag}` is interpolated unquoted into a copy-pasteable shell command, and the `--no-bump` path never validates `VERSION`; `;` is a legal git ref char, so the printed line can split into two commands. **Measured — but pre-existing, identical exposure in the old line.** |
| R5 | 1     | low    | `bin/release.mjs:276` | The printed check's failure mode is **silence** (exit 2, no output), and non-zero conflates "tag absent" (2) with "origin unreachable" (128). **Measured.** |

### R1 — flag-mode incoherence (raised by both reviewers)

Traced: `doTag`/`doPush` are set at `:82-83`; the summary block at `:272-277` is guarded **only** by
`dryRun`, so the verify line prints regardless of whether a tag was created or pushed.

Measured, in a throwaway clone whose `origin` was the real repo (read-only, no push):

```
$ node bin/release.mjs --no-test --no-push
• create annotated tag v0.2.2
• skip tag push (--no-push)
✓ Released v0.2.2
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.2
$ git ls-remote --exit-code --tags origin v0.2.2   →  exit=2   (tag exists locally)

$ node bin/release.mjs --no-test --no-tag --no-push
• skip tag (--no-tag)
✓ Released v0.2.3
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.3
$ git ls-remote --exit-code --tags origin v0.2.3   →  exit=2   (no such tag anywhere)
```

The `--no-tag` case is the worse of the two: the script prints a verification for an object it just
announced it would not make. **Not a regression** — the old `npx` line was unrunnable in all modes, so
it produced no signal at all. But the new line is *actionable and wrong* here, which is a new
failure, not merely an inherited one.

**Defect.** Scope caveat: fixing it means guarding the `console.log` on `doTag && doPush`, which is
more than the one line the brief allows — an owner scope call, not a coder call.

### R2 — a green verify for a release the tag does not describe (raised by both reviewers)

Codex reasoned this one and stated it in a **stronger** form than I first had (it does not need
`--no-push`). I measured Codex's form against a **bare throwaway origin**:

```
tag v0.2.1 on origin  → 18595e80…  (peels to 692b8e90…)
origin/main           → 1c82cbf6…

$ node bin/release.mjs --no-test --no-bump
• tag v0.2.1 already exists locally + on origin — will skip tag creation
• push origin main
✓ Released v0.2.1
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.1

$ git ls-remote --exit-code --tags origin v0.2.1   →  exit=0   ← GREEN

origin/main is now : 49b29630…      ← what this run actually published
tag v0.2.1 peels to: 692b8e90…      ← what the "verified" tag names
```

The verification passes while naming a different commit from the one just released. Directly under a
line reading `✓ Released v0.2.1`, a maintainer reasonably reads the green as confirming *this*
release. It does not.

This is the **same defect class the task exists to remove**, narrowed rather than eliminated: the old
line was a check that could never pass; the new line is a check that can pass without being true.
Worth saying plainly, since it is the one thing the task most wanted to avoid.

**Defect.** The label `Verify tag on origin:` is literally accurate in isolation — it does verify a
tag on origin — but adjacency to `✓ Released <tag>` makes it over-claim. Fixing properly means
comparing the remote tag against `HEAD`, well outside this brief.

### R3 — the record's central caveat is false

The worklog is unusually careful and mostly excellent: §4g flags honestly that `--dry-run` takes the
other branch. My objection is not the disclosure, it is the **conclusion drawn from it** — §4's *"It
cannot be, by construction"*. A throwaway clone plus `--no-test --no-push` executes the branch in
seconds, with zero risk to the real repo or remote. The technique was available and not attempted.

The consequence is concrete, not stylistic: R1 and R2 are both invisible to inspection-by-reading of
that single line and both fall out of the *first* execution. **Defect in the record.** No source
change is implied.

### R4 — unquoted interpolation (Codex-originated, verified and corrected)

Codex reasoned that `${tag}` is unquoted and `--no-bump` skips validation. **Both true**, and I
confirmed the mechanism — with a correction to Codex's reasoning:

- Codex's literal example `0.2.1;false` **works**, because `;` is a legal git ref character:
  ```
  VERSION = 0.9.9;false  →  • create annotated tag v0.9.9;false
    Verify tag on origin: git ls-remote --exit-code --tags origin v0.9.9;false
  ```
  Pasting that runs `git ls-remote …` and then `false`.
- A variant containing a **space** does *not* reach the print — `git tag -a` rejects it
  (`fatal: 'v0.9.9;echo INJECTED' is not a valid tag name`) and the script `fail()`s first. Codex did
  not distinguish these; the distinction is what decides how far the exposure reaches.
- `--version` **is** validated (`:138`, `^\d+\.\d+\.\d+([-+.][0-9A-Za-z-.]+)?$`); only the
  `--no-bump` path reads `VERSION` unchecked.

**Frontier-move, not a defect, and explicitly not introduced here:** the replaced line carried the
*identical* unquoted `${tag}`. The threat model is empty — an attacker must already have write access
to both `VERSION` and `package.json`, at which point they can edit `release.mjs` itself. Recorded for
completeness; I do **not** recommend acting on it under this brief.

### R5 — silent failure, ambiguous non-zero

Measured, all three: tag present → `0`; tag absent → `2` (**no output at all**); origin unreachable →
`128`. So the codes *do* distinguish the cases, but only for someone who inspects `$?`. Run bare in a
terminal, the failing case prints nothing — success prints a SHA, failure prints emptiness.

**Frontier-move.** A one-line print cannot carry a legend, and expanding it is out of scope.

---

## Checked and NOT findings — recorded so they are not re-chased

- **Prefix matching does not occur, and not by luck.** Both reviewers agree, and I measured it:
  `git ls-remote --exit-code --tags origin v0.1.1` returns only `refs/tags/v0.1.1`, exit 0, while
  `v0.1.10`–`v0.1.17` and `v0.1.19` all exist on origin. It holds **structurally**, not
  coincidentally: git matches a pattern against the ref-path tail after a `/`, not as a prefix, and
  the fnmatch branch needs a glob character, which `--version`'s regex forbids. The worklog's
  measurement was sound and its conclusion generalizes. The plan's `refs/tags/${tag}` contingency was
  correctly not taken.
- **Peeled-ref correction in the worklog is right** — `refs/tags/v0.2.1^{}` does not tail-match
  `v0.2.1`, so one line, not two. Reproduced.
- **Boundaries held**, re-measured independently: no `"bin"` in `package.json`; no
  `npx github:flashist` left in `bin/release.mjs`; `bin/` genuinely outside
  `claude/structure-manifest.tsv`; **no test anywhere asserts the summary line** (`grep` over `test/`
  → 0 hits), so the "no added test gate" boundary cost nothing in coverage terms.
- **Not re-run by me:** the 463 s `--dry-run` + 723-test suite + `prove-red.sh` gate. I verified the
  structural claims around it but took the suite result itself from the worklog. Stated so it is not
  mistaken for independent confirmation.

## Re-litigates settled decisions (suppressed)

- **Codex finding #4 — "no test covers the changed output path."** Suppressed: the brief's ⛔ *"no
  added test gate"* is an owner boundary, not an oversight. Re-raise only if the owner lifts it.
  (R3 above is **not** this finding — it asks for no test, only that the record stop asserting the
  branch is unverifiable.)
- **Adding a `bin` field to `package.json`** — ADR-011, and the brief's ⛔. Primed into the Codex
  prompt; **neither reviewer raised it.** Noted only to record that the boundary was tested and held.
- **A second printed line explaining installs track `main`** — owner-ruled *"No — leave it out"*,
  2026-08-13; belongs to task `0252`. Primed; **neither reviewer raised it.**

## Accepted residuals (shared, do-not-re-litigate)

- **fkit is not an npm-installable CLI** — What: `package.json` carries no `bin` field and the release
  makes no registry publish · Why (structural): ADR-011; distribution is `curl … install.sh | sh`
  against `main`, and a `bin` field would change the distribution model to fix a print line ·
  Re-raise only if: the owner reopens the distribution decision itself.
- **The summary prints no install-channel explanation** — What: one verify line only; no second line
  saying installs track `main` rather than the tag · Why (structural): owner ruling 2026-08-13,
  verbatim *"No — leave it out"*; the explanation is task `0252`'s deliverable · Re-raise only if:
  `0252` ships and the owner then wants the line cross-referenced here.

## Convergence call

**Round 1 — no re-litigation, and genuinely new defects.** Nothing in this round repeats a prior
finding (there is no prior round), and the two primed settled decisions were both left alone by both
reviewers. R1 and R2 are new, measured, and were not visible to either the plan or the build step.

**Recommend: act, not closeout** — but the action is an **owner scope decision**, not a coder fix.
R1 and R2 cannot be fixed inside the brief's ⛔ *"no other change to `bin/release.mjs`"*; both need a
guard or a stronger check. The three live options are laid out for the owner in the ship report.

**Not blocking.** On the default path — no flags — the tag is created, pushed, and the printed
command verifies it correctly and exits 0. The change is a strict improvement on an unrunnable line.
R1/R2 are wrong-signal defects confined to non-default flag combinations.

---

## Coder response

**Round 1** — coder: spawned `fkit-coder` Process-review worker under `/fkit-sprint-ship-loop`,
2026-08-13.

### ⚠️ Read first — no source fix was applied, and none was authorized

**`bin/release.mjs` is byte-unchanged by this step.** The owner ruled on R1–R4 before this worker was
spawned; every ruling either defers the fix or declines it. The write surface of this step is exactly
two files: this ledger's *Coder response* section, and `worklog.md`. That is the **expected** outcome
here, not a step skipped.

### How I verified — independently, and not on the reviewer's word

Per `CLAUDE.md` §Review Notes, every finding was re-checked against the code before any disposition
was written. I re-measured R1, R2, R4 and R5 by execution and R3 by counter-example, in **throwaway
clones** under `scratchpad/r254/` whose `origin` was a **local bare clone** (`origin.git`), never
`flashist/fkit`. Nothing touched the network. Real-repo integrity re-checked afterwards: `HEAD
1c82cbf6…` unchanged, 32 local tags unchanged (no `v0.2.2`/`v0.2.3`/`v0.2.4`/`v0.9.9*` anywhere),
`VERSION 0.2.1` unchanged, `git status --porcelain` identical to the pre-step snapshot.

I did **not** re-run the 463 s `--dry-run` + suite. The reviewer did not either; both of us take that
result from the worklog. Stated so the ledger carries no false claim of double confirmation.

### Verdicts

| #  | Verdict | Class | Action under 0254 | Authority |
|----|---------|-------|-------------------|-----------|
| R1 | **CORRECT** — reproduced, and **wider than reported** | Defect | **None — deferred to a follow-up task** | Owner ruling 2026-08-13, verbatim option label *"File a follow-up task, ship 0254 now"* |
| R2 | **CORRECT** — reproduced exactly as measured | Defect | **None — deferred to the same follow-up task** | Owner ruling 2026-08-13, same label |
| R3 | **CORRECT** | Defect in the record | **Fixed** — `worklog.md` §4 claim corrected, §4g pointer updated | Owner ruling 2026-08-13, verbatim option label *"Yes — correct it before close"* |
| R4 | **CORRECT**, including the reviewer's correction to Codex | Frontier-move, pre-existing | **None** | Owner ruling 2026-08-13, verbatim option label *"Unactioned — pre-existing"* |
| R5 | **CORRECT in substance; the table's one-word claim "conflates" is overstated** | Frontier-move | **None under 0254 — folded into the R1/R2 follow-up task** | Coder disposition + escalation; **placement resolved by owner ruling 2026-08-13**, verbatim option label *"Fold into the R1/R2 follow-up"* |

---

### R1 — CORRECT, and it reaches one case the reviewer did not measure

Reproduced. The mechanism is as traced: `doTag`/`doPush` are read at `:82-83`, but the summary block
at `:272-277` is guarded **only** by `dryRun`, so `:276` prints on every non-dry path regardless of
whether a tag was created or pushed.

Measured, throwaway clone against a throwaway bare `origin`:

```
$ node bin/release.mjs --no-test --no-push
• create annotated tag v0.2.2
• skip tag push (--no-push)
✓ Released v0.2.2
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.2
$ git ls-remote --exit-code --tags origin v0.2.2   →  exit=2   (tag exists locally only)

$ node bin/release.mjs --no-test --no-tag --no-push
• skip tag (--no-tag)
✓ Released v0.2.3
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.3
$ git ls-remote --exit-code --tags origin v0.2.3   →  exit=2   (no such tag anywhere)
```

**⚠️ Correction — the finding is broader than the ledger states.** The reviewer measured only
`--no-push` and `--no-tag --no-push`, both of which are local-only releases. I measured **`--no-tag`
alone**, which is a *real, pushing* release:

```
$ node bin/release.mjs --no-test --no-tag
• push origin main            ← genuinely published
• skip tag (--no-tag)
✓ Released v0.2.4
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.4
$ git ls-remote --exit-code --tags origin v0.2.4   →  exit=2
```

This matters for the follow-up brief: the defect is **not** confined to dry/local flag combinations.
A `--no-tag` run pushes real commits to real origin and *then* prints a failing verify for a tag it
announced it would not make. The reviewer's convergence call — *"confined to non-default flag
combinations"* — stays true as written (a flag is still required), but *"not blocking"* should not be
read as *"only affects runs that publish nothing."*

> ✅ **The broadened R1 was put to the owner, and the ship ruling was RE-AFFIRMED UNCHANGED — owner
> ruling 2026-08-13, verbatim option label: *"No change — still ship 0254 now"*.**
>
> **Recorded explicitly for the audit trail, because the two rulings rest on different descriptions
> of R1.** The first ruling (*"File a follow-up task, ship 0254 now"*) was made on the **narrower**
> description in the findings table — the two `--no-push` variants, both local-only. The driver then
> put this broadening to the owner in terms: R1 also fires on **`--no-tag` alone, which does publish
> commits to `origin/main`**, so *"only affects runs that publish nothing"* would be false. The owner
> re-affirmed shipping 0254 as the one-line fix, with the guard carried by the follow-up.
>
> So the deferral of R1 is **not** an artifact of the owner having seen an understated version of it.
> It was confirmed on the corrected one.

**Deferred, not fixed.** The fix is a guard on the `console.log` — `doTag && doPush`, or an
alternative branch text for the skipped-tag paths. That is a second edit to `bin/release.mjs`, which
the brief's ⛔ *"no other change to `bin/release.mjs`"* and the approved plan both forbid. Owner ruled
follow-up.

**For the follow-up brief, the reproduction in full:** `--no-push` → exit 2; `--no-tag --no-push` →
exit 2; **`--no-tag` alone → exit 2 on a pushing release**. Expected in all three: either no verify
line, or a line naming what actually happened. Default run (no flags) is correct and exits 0 —
confirmed, and the follow-up must not regress it.

### R2 — CORRECT, reproduced exactly; the subtlest finding and it holds

I re-measured this one most carefully, since it is the one that would be worst to record wrongly.
Confirmed, against a throwaway bare `origin` carrying the real tag history:

```
BEFORE
  tag v0.2.1 on origin : 18595e80…   (annotated; peels to 692b8e90…)
  origin/main          : 1c82cbf6…

$ node bin/release.mjs --no-test --no-bump
• release current version 0.2.1 (no bump)
• tag v0.2.1 already exists locally + on origin — will skip tag creation
• commit: "Release v0.2.1"
• push origin main                     ← a new commit really is published
✓ Released v0.2.1
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.1

$ git ls-remote --exit-code --tags origin v0.2.1   →  exit=0   ← GREEN

AFTER
  origin/main          : e7cd2bca…    ← what this run actually published
  tag v0.2.1 peels to  : 692b8e90…    ← what the "verified" tag names
```

Mechanism confirmed from source: `:150` sets `target = version` under `--no-bump`; `:227-229` and
`:258` skip tag creation when `localTagExists || remoteTagExists`; `:250-252` pushes the branch
regardless. So the commit ships, the tag does not move, and `:276` prints a check that passes on the
**stale** tag. **Codex's stronger form is right — no `--no-push` is needed.** This is a fully
default-flagged path apart from `--no-bump`, which the file's own header (`:12-14`) documents as the
recommended way to finish a partially-failed release. That is the realistic trigger, not a contrived
one.

**Deferred, not fixed.** A correct check compares the remote tag's peeled sha against the pushed
`HEAD` — a materially bigger command and more than one line. Outside the brief and the plan. Owner
ruled follow-up.

**For the follow-up brief:** `--no-bump` when the tag already exists on origin → verify exits **0**
while `origin/main ≠ tag^{}`. Expected: a check that fails, or a line that does not read as
confirming *this* release. Note the display subtlety — `git ls-remote` prints the **tag object** sha
(`18595e80…`), not the peeled commit, so even a human reading the output cannot compare it to `HEAD`
by eye.

### R3 — CORRECT. Fixed, and the caveat it lived in was preserved

Verified by counter-example, and the counter-example is every run above: a `git clone` to a throwaway
plus `node bin/release.mjs --no-test --no-push` executes the edited branch in seconds. The worklog's
§4 conclusion — *"It cannot be, by construction"* — was **false**. The technique was available and
was not attempted, and R1/R2 both fall out of the first execution.

**Corrected in `worklog.md` §4** per the owner ruling. What changed and what deliberately did not:

- **Removed:** the false claim that the branch cannot be verified by construction.
- **Replaced with what is true:** the branch **was not** exercised during Build or Verify, and it
  **can** be — by a throwaway-clone run, which the reviewer performed, which is what surfaced R1/R2.
- **Preserved, deliberately:** the genuine limitation. `--dry-run` takes the `if (dryRun)` branch, so
  the repo's own suite never executes `:276`, and *"dry-run clean + tests green"* still must not be
  read as end-to-end coverage. Replacing a false claim with a weaker true one was the job; deleting
  the caveat was not.
- **§4g** kept its honesty note verbatim; only its stale cross-reference (*"see §4, which stands
  unchanged"*) was updated, since §4 no longer stands unchanged.

### R4 — CORRECT, including the reviewer's correction to Codex. Unactioned, pre-existing

Both halves reproduced:

```
VERSION = package.json version = 0.9.9;false ,  --no-bump  (no validation on this path)
  • create annotated tag v0.9.9;false
  ✓ Released v0.9.9;false
    Verify tag on origin: git ls-remote --exit-code --tags origin v0.9.9;false   ← pastes as two commands

VERSION = 0.9.9 echo INJECTED  (space variant)
  • create annotated tag v0.9.9 echo INJECTED
  ✗ git tag -a … exited 128 — fatal: 'v0.9.9 echo INJECTED' is not a valid tag name.
```

The reviewer's correction to Codex is **confirmed**: the space variant never reaches the print — the
script `fail()`s at `git tag -a` first. `;` does reach it. And `--version` **is** validated at `:138`
(`/^\d+\.\d+\.\d+([-+.][0-9A-Za-z-.]+)?$/`); only the `--no-bump` path reads `VERSION` unchecked
(`:150`).

**Pre-existing confirmed by direct comparison.** The committed line at `HEAD` is
`` console.log(`  Verify: npx github:flashist/fkit#${tag} --version`); `` — the **identical** unquoted
`${tag}`. This change neither introduced nor widened the exposure.

**Frontier-move. Not fixed under 0254, and — per the owner ruling — not folded into the R1/R2
follow-up either.** Recorded here only so it is not re-raised as new.

### R5 — CORRECT in substance, with one wording correction. Placement escalated

Re-measured, all three cases, capturing **stdout and stderr together** (the reviewer's table does not
say which stream it observed, so I checked both):

```
tag present     → exit 0    output: "18595e80…\trefs/tags/v0.2.1"
tag absent      → exit 2    output: ""            ← genuinely silent on BOTH streams
origin absent   → exit 128  output: "fatal: '…' does not appear to be a git repository"
```

**The substance is correct: the failure that matters is silent.** A maintainer who pastes the line
and does not inspect `$?` sees a sha on success and *nothing at all* on the failure the check exists
to catch. That is a real weakness in a line printed for humans.

**⚠️ Correction to the findings table's wording.** The table says non-zero *"conflates 'tag absent'
(2) with 'origin unreachable' (128)."* It does not — the codes are distinct (2 vs 128), and the
unreachable case is **not** silent; it prints a `fatal:` line. The reviewer's own R5 body says this
correctly (*"the codes do distinguish the cases"*); only the one-line table claim overstates it.
Recorded so the follow-up brief is not written against "the exit codes are ambiguous," which is false.
The true residual is narrower: **the tag-absent case produces no output on either stream.**

**Frontier-move, not fixed under 0254.** A one-line print cannot carry a legend, and expanding it
exceeds the brief.

**Placement was not mine to settle — escalated as `NEEDS-DECISION`, and now ruled.** R5 touches the
*same printed line* the R1/R2 follow-up will rewrite, so folding it in is plausibly free; equally, it
is a different change class (output/UX) from R1/R2 (correctness of the signal), and the owner had
ruled R4 — the other frontier-move — explicitly **out** of that follow-up. Reading that ruling as
covering R5 would have been me deciding scope. Surfaced to the owner via the driver; **not silently
folded in and not silently dropped.**

> ✅ **RESOLVED — owner ruling 2026-08-13, verbatim option label: *"Fold into the R1/R2 follow-up"*.**
> **R5 joins the R1/R2 follow-up task.** The owner did **not** adopt the consistency argument drawn
> from the R4 ruling — the shared printed line won. R5 is therefore **no longer open**; it is
> **deferred into the follow-up**, not unactioned.
>
> **What carries into that follow-up is the corrected finding, not the table's wording.** The
> substantive residual is: **the tag-absent case fails silently — exit 2 with empty stdout *and*
> empty stderr**, while success prints a sha. The table's claim that non-zero *"conflates"* absent
> with unreachable is **false and must not be carried**: the codes distinguish cleanly (2 vs 128) and
> the unreachable case prints a `fatal:` line. A follow-up written against "the exit codes are
> ambiguous" would be chasing a defect that does not exist.

---

### Follow-up task scope — settled, on the face of this ledger

All owner-ruled 2026-08-13. **The producer files this task; not this worker, and not the driver.**

| Finding | In the follow-up? | Authority |
|---|---|---|
| **R1** — verify line prints when the tag was skipped or unpushed, **incl. `--no-tag` alone, which publishes commits** | ✅ **IN** | *"File a follow-up task, ship 0254 now"*, re-affirmed on the broadened R1 by *"No change — still ship 0254 now"* |
| **R2** — `--no-bump` over an existing origin tag verifies **green** against a stale tag | ✅ **IN** | *"File a follow-up task, ship 0254 now"* |
| **R5** — tag-absent failure is **silent on both stdout and stderr** | ✅ **IN** | *"Fold into the R1/R2 follow-up"* |
| **R4** — unquoted `${tag}`; `;` is a legal ref char | ⛔ **OUT — explicitly** | *"Unactioned — pre-existing"*; the replaced line carried the identical exposure |
| **R3** — the worklog's false *"cannot be verified, by construction"* | ⛔ **OUT — already fixed under 0254** | *"Yes — correct it before close"* |

⚠️ **R4's exclusion is a ruling, not an oversight.** It is the one finding that touches the same line
as R1/R2/R5 and is still deliberately outside the follow-up. Do not let "it's the same line" pull it
back in — that reasoning is exactly what carried R5 in, and the owner applied it to R5 and not to R4.

### Accepted residuals — coder's additions to the shared list

- **R1 — the verify line prints under `--no-tag` / `--no-push`** · What: `:276` is guarded only by
  `dryRun`, so it prints a check that exits 2 whenever the tag was not created or not pushed —
  **including `--no-tag` alone, which does publish commits** · Why open: the fix is a guard, i.e. a
  second edit to `bin/release.mjs`, barred by the brief's ⛔ and the approved plan · Re-raise: **yes —
  in the owner-ruled follow-up task**, not against 0254.
- **R2 — `--no-bump` over an existing origin tag verifies green** · What: commit pushed, tag skipped,
  `git ls-remote --exit-code` exits 0 against a tag naming a different commit · Why open: a correct
  check compares the peeled tag sha to the pushed `HEAD` — outside the brief · Re-raise: **yes — same
  follow-up task.**
- **R4 — unquoted `${tag}` in the printed command** · What: `;` is a legal ref char and `--no-bump`
  reads `VERSION` unvalidated, so the printed line can split · Why (structural): **pre-existing,
  identical exposure in the replaced line**; the threat model requires write access to `VERSION` and
  `package.json`, at which point `release.mjs` itself is writable · Re-raise only if: the owner
  reopens it. **Owner-ruled "Unactioned — pre-existing" 2026-08-13; explicitly NOT in the follow-up.**
- **R5 — the tag-absent failure is silent** · What: exit 2 with empty stdout *and* stderr; success
  prints a sha, failure prints nothing · Why open: a one-line print cannot carry a legend ·
  Re-raise: **yes — in the same follow-up as R1/R2**, owner ruling 2026-08-13, verbatim *"Fold into
  the R1/R2 follow-up"*. ⚠️ Carry the **corrected** form: the exit codes 2 and 128 do **not**
  conflate, and the unreachable case is not silent.

### Coder's convergence call

**Round 1 closed from the coder side, and NOTHING IS LEFT OPEN.** All five findings verified CORRECT,
all five disposed of by owner ruling. Nothing disputed on substance; two corrections to the ledger —
one wording (R5's table claim *"conflates"* is false) and one scope broadening (R1 also fires on
`--no-tag` alone, which publishes commits). **Both corrections were surfaced to the owner before the
rulings were finalised**, and the ship ruling was re-affirmed on the corrected R1.

**No source change was applied and none was authorized** — `bin/release.mjs` is byte-unchanged by the
Process-review step; the diff is still the single Build line. One record defect (R3) fixed under 0254.
Three findings (R1, R2, R5) deferred to a follow-up task the **producer** files — not this worker, not
the driver. One frontier-move (R4) owner-ruled unactioned and explicitly outside that follow-up.

**No re-litigation from my side**, and I did not re-open either suppressed item or either shared
accepted residual.

⚠️ **One thing this ledger does NOT establish, stated so nobody infers it:** the changed line has
still never executed in the real repository. Every execution recorded here — mine and the reviewer's —
ran in throwaway clones against a throwaway `origin`. That is sufficient evidence for the line's
behavior and it is what surfaced R1/R2, but the first real-repo firing will be the next live release.
