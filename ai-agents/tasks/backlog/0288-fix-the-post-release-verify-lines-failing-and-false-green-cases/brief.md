# Fix the post-release verify line's failing and false-green cases in `bin/release.mjs`

## ID
0288

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority — two owner rulings, both 2026-08-13

Given live via `AskUserQuestion` in a `fkit lead` session and relayed through the
`/fkit-sprint-ship-loop` driver — **the option labels are the verbatim text**:

1. **"File a follow-up task, ship 0254 now"** — findings **R1** and **R2** of `0254`'s stateful review
   are real defects, but they must **not** be fixed under `0254`. They need a guard, and a guard is a
   second edit to `bin/release.mjs`, which `0254`'s brief forbids (⛔ *"Any other change to
   `bin/release.mjs`"*). **This task is that follow-up.**
2. **"Fold into the R1/R2 follow-up"** — finding **R5** joins this task too. The owner did **not**
   adopt the consistency argument drawn from the R4 ruling; the shared printed line won.

**A third ruling of the same date fenced this task's scope:** verbatim label **"Unactioned —
pre-existing"** — finding **R4** (unquoted `${tag}` interpolation) is **out**. See ⛔ *Out of scope*.

### The origin, and the evidence trail

Every fact below comes from
[`0254`](../../done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md)'s two-party
review ledger,
[`review.md`](../../done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/review.md) — the
reviewer's *Reviewer findings* section **and** the coder's *Coder response*, which independently
re-measured every finding and **corrected the reviewer in two places**. ⚠️ **This brief is written
against the corrected facts.** Where the ledger's findings table and its body disagree, the body and
the coder's re-measurement are right.

> ⚠️ **Path note, 2026-08-13.** `0254` was **mid-close** when this brief was filed — a separate
> producer spawn was running `/fkit-task-done` on it in parallel. The links above assume that close
> landed and point at `ai-agents/tasks/done/`. **If `0254` is still in `ai-agents/tasks/backlog/`,
> the path is `../0254-fix-the-unrunnable-verify-command-release-mjs-prints/`.** Stated rather than
> guessed; the durable anchor is the folder ID `0254`, not the directory it sits in.

### What `0254` changed, and what it did not fix

`0254` replaced one line — `bin/release.mjs:276`, verified on disk 2026-08-13:

```
  console.log(`  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}`);
```

That was a strict improvement: the old `npx github:flashist/fkit#<tag> --version` line could never
work at all. The new line **works on the default path** and is **wrong in three narrower ways**, all
of which fall out of the first execution of the branch.

### ✅ The default path is correct today. Do not regress it.

**Measured, both by the reviewer and by the coder independently:** a no-flag run creates the tag,
pushes it, and the printed command verifies it and **exits 0**. ⛔ **Any remedy that changes what the
default path prints, or makes it stop exiting 0, has failed** — that is the one case this line
already gets right, and it is the case a real release cut actually runs.

### The three defects — all verified by execution, not by reading

#### R1 (medium) — the line prints a check that exits 2 whenever the tag was skipped or not pushed

The summary block (`:271-277`) is guarded **only** by `dryRun`. `doTag` and `doPush` are read at
`:82-83` and never consulted again, so `:276` prints on every non-dry path — including the paths that
declined to create the tag it names.

Measured, in throwaway clones against a throwaway bare `origin`:

```
$ node bin/release.mjs --no-test --no-push
• create annotated tag v0.2.2
• skip tag push (--no-push)
✓ Released v0.2.2
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.2
$ git ls-remote --exit-code --tags origin v0.2.2   →  exit=2

$ node bin/release.mjs --no-test --no-tag --no-push
• skip tag (--no-tag)
✓ Released v0.2.3
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.3
$ git ls-remote --exit-code --tags origin v0.2.3   →  exit=2
```

⚠️ **The finding is broader than the reviewer's findings table states, and the difference matters for
scoping this task.** The reviewer measured only the two `--no-push` variants, both of which are
local-only releases that publish nothing. The coder measured **`--no-tag` alone** — a run that
**genuinely publishes commits to origin**:

```
$ node bin/release.mjs --no-test --no-tag
• push origin main            ← genuinely published
• skip tag (--no-tag)
✓ Released v0.2.4
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.4
$ git ls-remote --exit-code --tags origin v0.2.4   →  exit=2
```

⛔ **Do not scope this as "only affects runs that publish nothing."** It does not. Under `--no-tag`
the script publishes real commits and then tells the maintainer to verify a tag it announced, one
line earlier, that it would not create.

#### R2 (medium) — `--no-bump` over an existing origin tag prints a check that exits 0 while naming the wrong commit

The false green, and the worst of the three. Mechanism confirmed from source:

- `:150` — `if (has("--no-bump")) target = version;` — the target is the version already released.
- `:227-229` and `:258` — tag creation is skipped when `localTagExists || remoteTagExists`.
- `:250-252` — the **branch is pushed regardless**.

So the commit ships, the tag does not move, and `:276` prints a check that passes against a **stale**
tag. Reproduced against a local bare origin carrying the real tag history:

```
BEFORE
  tag v0.2.1 on origin : 18595e80…   (annotated; peels to 692b8e90…)
  origin/main          : 1c82cbf6…

$ node bin/release.mjs --no-test --no-bump
• tag v0.2.1 already exists locally + on origin — will skip tag creation
• push origin main
✓ Released v0.2.1
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.2.1

$ git ls-remote --exit-code --tags origin v0.2.1   →  exit=0   ← GREEN

AFTER
  origin/main          : e7cd2bca…    ← what this run actually published
  tag v0.2.1 peels to  : 692b8e90…    ← what the "verified" tag names
```

⚠️ **This is not a contrived flag combination.** `bin/release.mjs`'s own header (`:12-14`) documents
`--no-bump` as the way to finish a partially-failed release — i.e. exactly the situation in which a
maintainer most wants the verify line to tell the truth. Directly under `✓ Released v0.2.1`, a green
reads as confirming *this* release. It does not.

⚠️ **Note for whoever designs the fix — a human cannot eyeball this either.** `git ls-remote` prints
the **tag object** sha (`18595e80…`), **not** the peeled commit (`692b8e90…`), so comparing the
printed output to `HEAD` by eye does not work. A correct check compares the **peeled** tag
(`<tag>^{}`) against the pushed `HEAD`.

#### R5 (low) — the printed check fails **silently**

Re-measured across all three cases, capturing **stdout and stderr together**:

```
tag present     → exit 0    output: "18595e80…\trefs/tags/v0.2.1"
tag absent      → exit 2    output: ""            ← silent on BOTH streams
origin absent   → exit 128  output: "fatal: '…' does not appear to be a git repository"
```

A maintainer who pastes the line and does not inspect `$?` sees a sha on success and **nothing at
all** on the failure the check exists to catch.

> ⛔ **Do NOT carry the reviewer findings table's wording that non-zero "conflates 'tag absent' (2)
> with 'origin unreachable' (128)." The coder measured that claim FALSE.** The exit codes distinguish
> the two cases cleanly, and the unreachable case is **not** silent — it prints a `fatal:` line. A
> remedy written against *"the exit codes are ambiguous"* would be chasing a defect that does not
> exist. **The real residual is the silence alone.**

## What to build

**A post-release summary block in `bin/release.mjs` that never prints a check the run has already
made false, and never prints a check that can pass without being true.** The shape of the remedy is
the plan's call and is deliberately **not** pre-decided here — but it must answer all three findings
and it must leave the default path exactly as it is.

1. **Answer R1 — the line must not appear when the tag was not created or not pushed.** A guard on
   `doTag && doPush` is the obvious form; an alternative branch text naming what actually happened is
   equally acceptable. ✅ **The plan must state which it chose and why**, and must state what a
   `--no-tag` run (which *does* publish) prints instead.
2. **Answer R2 — the check must distinguish "a tag of that name exists" from "that tag names this
   release."** The peeled tag (`<tag>^{}`) versus the pushed `HEAD` is the comparison that carries the
   claim. ⚠️ **A longer printed command is acceptable; a printed command that is wrong is not.** If
   the plan concludes the honest answer is a *weaker label* rather than a stronger check, it must say
   so explicitly and argue it — silently narrowing the wording is not an answer to a false green.
3. **Answer R5 — the failing case must not be silent.** ⚠️ **Only the silence.** ⛔ Do not build
   anything that presumes the exit codes are ambiguous; they are not.
4. **State, in the plan, what the summary prints on each path** — default, `--no-tag`, `--no-push`,
   `--no-tag --no-push`, `--no-bump` over an existing tag, and `--dry-run`. ⛔ **A remedy that was
   reasoned about on only the default path is how R1 and R2 arrived.**

### ⛔ Out of scope

- ⛔ **R4 — the unquoted `${tag}` interpolation.** **Owner-ruled 2026-08-13, verbatim label
  *"Unactioned — pre-existing"*.** `;` is a legal git ref character and `--no-bump` reads `VERSION`
  unvalidated (`:150`), so the printed line can split into two commands — **but the replaced line
  carried the identical exposure**, and the threat model requires write access to `VERSION` and
  `package.json`, at which point `bin/release.mjs` itself is writable. ⛔ **Not deferred here — ruled
  unactioned.** Do not fix it, and do not record it as this task's residual.
- ⛔ **Adding a `bin` field to `package.json`** —
  [ADR-011](../../../knowledge-base/decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md);
  fkit makes no npm-registry publish. Settled under `0254` and **not reopened here**.
- ⛔ **A second printed line explaining that installs track `main` rather than the tag** —
  owner-ruled 2026-08-13, verbatim *"No — leave it out"*. That is
  [`0252`](../../done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md)'s
  deliverable. **Settled under `0254` and not reopened here.**
- ⛔ **Any change to bump logic, tag logic, push logic, or the `--dry-run` branch.** This task owns the
  **summary block** and whatever guard the fix needs, nothing else in the file.
- ⛔ **Any file other than `bin/release.mjs`** — except a test, **and only if the owner answers the
  open question below in the affirmative.** See `## Notes`.
- ⛔ **Any `ai-agents/wiki-vault/` write**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ No commit, no push, no re-rank, no task-file move (ADR-033).

## Verification steps

> ⚠️ **This branch IS runnable, and running it is not optional.** `0254` exists because someone
> printed a verify command without running it, and `0254`'s own worklog then claimed — falsely — that
> the changed branch *"cannot be verified, by construction"*. It can, in about ten seconds, and that
> is how R1 and R2 were found. ⛔ **A verification section built on reading the diff has repeated the
> exact defect this task descends from.**

**The technique, stated explicitly:**

```sh
git clone <this repo> /path/to/throwaway/clone
cp bin/release.mjs /path/to/throwaway/clone/bin/
cd /path/to/throwaway/clone && node bin/release.mjs --no-test --no-push
```

**⚠️ The safety rule that comes with it — non-negotiable:** reproduce **only** against a **throwaway
clone whose `origin` is a local bare repository** (`git init --bare`). ⛔ **Never push to
`flashist/fkit`. Never create or delete a tag on the real origin.** ✅ **Re-check the real repo's
integrity afterwards and record it** — `HEAD`, the local tag count, `VERSION`, and
`git status --porcelain` — exactly as both the reviewer and the coder did during `0254`'s review.

1. **Run every path, and paste the output verbatim.** For each of `--no-test` (default),
   `--no-test --no-tag`, `--no-test --no-push`, `--no-test --no-tag --no-push`,
   `--no-test --no-bump` over a tag that already exists on origin, and `--dry-run`: show what the
   summary block printed.
2. **R1 is closed, including the publishing case.** For `--no-tag` **alone** — the run that pushes
   commits — show that the output no longer directs the maintainer at a tag that was not created.
   ⛔ **Verifying only the two `--no-push` variants does not satisfy this step**; that is precisely the
   gap in the original review.
3. **R2 is closed.** Rebuild the false-green setup: a bare origin carrying an annotated tag whose
   peeled commit differs from `origin/main`, then `--no-bump`. Show the printed check's **exit code**
   and show that it no longer reads as confirming a release the tag does not name. ⚠️ **Show the
   peeled sha (`<tag>^{}`) and `HEAD` side by side** so the reader can see the two are different.
4. **R5 is closed.** With the tag absent, show the printed check's output on **both stdout and
   stderr**, and its exit code. ⛔ **Do not assert the codes were ambiguous** — show what they are.
5. **⛔ The default path is byte-unchanged in behaviour and still exits 0.** Quote the default run's
   summary output and the verify command's exit status. **If the default output changed at all, say
   so out loud and justify it.**
6. **`--dry-run` still prints its own branch and touches nothing.** Quote it.
7. **Every command printed by the new code was executed by the coder**, with its output in the
   worklog — run, not asserted
   ([`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)).
8. **`git diff --stat` shows `bin/release.mjs` only** — plus a test file **only** if the owner
   answered the open question below in the affirmative. ⛔ No `package.json`, no `VERSION`, nothing
   under `ai-agents/wiki-vault/`.
9. **`grep -n '"bin"' package.json` returns no hit**, and **`grep -n 'npx github:flashist'
   bin/release.mjs` returns no hit** — both `0254` boundaries still hold.
10. **`npm test` green; state the measured pass/fail counts.**
11. **State plainly what is NOT covered.** ⚠️ **No test in this repo executes the summary block** —
    verified 2026-08-13 by `grep -rn "release.mjs\|Verify tag on origin" test/`, whose only hits are a
    comment in `test/structure-manifest.test.js:14` and two `test/fixtures/` documents; `npm test`
    going green therefore says **nothing** about this change. **Say so in the close.** ⛔ **Do not
    report `npm test` as coverage of this line.**

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Origin:** findings **R1**, **R2** and **R5** of
  [`0254`](../../done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md)'s stateful
  review. **Evidence trail:**
  [`0254`'s `review.md`](../../done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/review.md)
  — read **both** the *Reviewer findings* and the *Coder response* sections; the latter carries the
  independent re-measurement, and it corrects the former in two places (R1's reach, R5's wording).
  Build evidence is in that folder's `worklog.md`. ⚠️ **See the path note in `## Context`** — `0254`
  was mid-close when this was filed.
- **⚠️ Two corrections this brief deliberately carries, so they are not re-lost:**
  1. **R1 reaches `--no-tag` alone**, a run that publishes commits — not just the local-only
     `--no-push` variants the reviewer measured.
  2. **R5's "conflates absent with unreachable" claim is false.** The codes are 2 and 128, distinct,
     and 128 is not silent. The real finding is that the **tag-absent** case produces no output on
     either stream.
- **⚠️ Every `:NNN` in this brief was read from disk on 2026-08-13** (`bin/release.mjs`, 277 lines:
  `:82-83`, `:150`, `:218-219`, `:227-229`, `:250-252`, `:258`, `:271-277`). **The durable anchor is
  the quoted text, not the number** — this repo has a long history of line citations going stale under
  the next edit, and this task edits the very block it cites.

### ❓ Open question for the owner — does this task add test coverage?

**Not decided here. This is a real scope question and it is the owner's.**

- **The facts:** no test in this repo executes `bin/release.mjs`'s summary block (measured — step 11
  above). `0254`'s brief carried an explicit ⛔ *"no added test gate"*, and `0254`'s reviewer
  **suppressed** a Codex finding on exactly this ground, recording *"Re-raise only if the owner lifts
  it."* **That boundary belonged to `0254` and does not automatically carry to this task** — but
  neither does lifting it, which is why it is being asked rather than assumed.
- **The tension:** this task is the second attempt at the same printed line, and the first one shipped
  two defects that a single execution would have caught. An untested line is how both arrived.
  Against that: `bin/` sits outside `claude/structure-manifest.tsv`, the summary block is
  maintainer-facing output that nothing parses, and a test here is new ground for a file the suite has
  never touched.
- **The three answers, so the question is answerable in one word:** **(a)** add a test and extend
  `test/prove-red.sh` so it is red-provable; **(b)** add no test and record the gap as an accepted
  residual in the close; **(c)** file coverage as its own separate task.
- ⛔ **Until the owner answers, `## Out of scope` stands: `bin/release.mjs` only.** ⚠️ **The coder must
  raise this at the plan gate rather than deciding it** — and if the answer is (b), the close must
  state the gap out loud, not omit it.

### On the board and the rank

- **Filed to the [Backlog](../../../sprints/backlog.md) board — deliberately, and here is the
  reasoning.** The owner's rulings settled **what** this task contains; **none of them said when it
  ships.** `ai-agents/sprints/backlog.md` is unranked, so filing there assigns no merit rank and makes
  no claim the owner did not make. [Sprint 5](../../../sprints/sprint-5.md) **is** ranked — a row
  there would be a real merit statement, and with nine closed rows sitting below `P11` a new row could
  only **append** below the board's largest rank (ADR-035, `/fkit-task-brief` step 5), which is a
  position no one believes reflects its merit. **A rank nobody meant is worse than no rank.**
- **Precedent, same day, same loop:**
  [`0284`](../0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md) — also a
  deferred review finding from a Sprint 5 task, also filed by a spawned producer on an owner ruling —
  went to the **Backlog** board on the same reasoning.
- **⚠️ On merit, flagged for the owner — there is a real argument for pulling this into Sprint 5.**
  The owner intends to **cut a release when Sprint 5 completes**, and this is the line the releaser
  reads at exactly that moment; that is the same reasoning that put `0254` on Sprint 5 in the first
  place. ⚠️ **But R1 and R2 only fire under `--no-tag`, `--no-push` or `--no-bump`** — a clean release
  cut runs none of them, and the default path is correct today. **So it does not block the cut.**
  ✅ **If the owner wants it before the cut, this row is the one to pull** — a pull is the producer's
  act in an owner-present session, not a spawned worker's.
- **⛔ No existing row was re-ranked, moved, or edited** (ADR-035). No task's status, priority, sprint
  field or location was changed.
- **Filed 2026-08-13 by a spawned `fkit-producer` with no owner channel** (ADR-021), on the owner's
  rulings of the same day relayed through the `/fkit-sprint-ship-loop` driver. It read
  `bin/release.mjs`, `0254`'s `brief.md`, `review.md` and `worklog.md`, and `test/` from disk before
  writing. It **closed, moved and re-statused nothing**, **invoked no mover**, **edited no source file
  and no other task's brief**, **wrote nothing under `ai-agents/wiki-vault/`**, and **committed
  nothing**.
