# Fix the post-release verify line's failing and false-green cases in `bin/release.mjs`

## ID
0288

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

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
[`0254`](../0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md)'s two-party
review ledger,
[`review.md`](../0254-fix-the-unrunnable-verify-command-release-mjs-prints/review.md) — the
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
  [`0252`](../0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md)'s
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
  [`0254`](../0254-fix-the-unrunnable-verify-command-release-mjs-prints/brief.md)'s stateful
  review. **Evidence trail:**
  [`0254`'s `review.md`](../0254-fix-the-unrunnable-verify-command-release-mjs-prints/review.md)
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

> ✅ **ANSWERED 2026-08-13 — the owner chose (a). ⛔ The coder no longer raises this at the plan gate.**
> Owner ruling, `fkit lead` session, `AskUserQuestion`, verbatim option label **"(a) Add a test +
> extend prove-red.sh"** — *"add a test and extend `test/prove-red.sh` so it is red-provable"*.
> **This LIFTS the ⛔ *"no added test gate"* — for `0288` ONLY**, and the `## Out of scope` fence's
> own condition (*"except a test, and only if the owner answers the open question below in the
> affirmative"*) is now **met**. ⛔ The (b) branch of the bullet above does **not** apply. ⚠️ The
> widening is **bounded** and does **not** unfence tag/push logic. **Full ruling, its reasoning, and
> its consequences: see the dated block at the END of this file.** *(Inserted 2026-08-13 by a spawned
> `fkit-producer` with no owner channel, ADR-021 — an **addition only**; no existing byte altered, the
> question itself left standing verbatim because it is **answered, not deleted**.)*

### On the board and the rank

- **Filed to the [Backlog](../../../sprints/backlog.md) board — deliberately, and here is the
  reasoning.** The owner's rulings settled **what** this task contains; **none of them said when it
  ships.** `ai-agents/sprints/backlog.md` is unranked, so filing there assigns no merit rank and makes
  no claim the owner did not make. [Sprint 5](../../../sprints/done/sprint-5.md) **is** ranked — a row
  there would be a real merit statement, and with nine closed rows sitting below `P11` a new row could
  only **append** below the board's largest rank (ADR-035, `/fkit-task-brief` step 5), which is a
  position no one believes reflects its merit. **A rank nobody meant is worse than no rank.**
- **Precedent, same day, same loop:**
  [`0284`](../../backlog/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md) — also a
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

---

## ⚠️ Correction, 2026-08-13 — R1's stated mechanism is wrong. The defect is not.

**Owner-authorized**, `fkit lead` session, verbatim option label **"Correct it now"**. Appended by a
spawned `fkit-producer` with no owner channel (ADR-021). ⛔ **Nothing above this line was altered** —
the superseded sentence is left standing on purpose. It was written in good faith; it is
**superseded, not deleted**.

### What the brief says

Under **R1** (`:75-77` of this file, before this block was appended):

> The summary block (`:271-277`) is guarded **only** by `dryRun`. `doTag` and `doPush` are read at
> `:82-83` and never consulted again, so `:276` prints on every non-dry path — including the paths that
> declined to create the tag it names.

### Why the middle clause is false

**"`doTag` and `doPush` are … never consulted again" is false as a description of the file.**
Re-measured on disk 2026-08-13 — `grep -n 'doTag\|doPush' bin/release.mjs` returns **seven** sites:

```
82:const doTag = !has("--no-tag");
83:const doPush = !has("--no-push");
227:if (doTag && (localTagExists || remoteTagExists)) {
250:if (doPush) {
258:if (doTag && !localTagExists && !remoteTagExists) {
261:  if (doPush) {
267:} else if (!doTag) {
```

Both flags **are** consulted, five times after their declaration: the tag-exists check (`:227`), the
branch push (`:250`), the tag creation (`:258`), the tag push (`:261`), and the skip-tag branch
(`:267`). The flag plumbing in the **execute** section is correct and does what it says.

### The true, narrower mechanism

**It is the summary block that never consults `doTag`/`doPush` — not the file.** The block's only
guard is `if (dryRun)` at `:272`, running to `:277` (`:271` is the `// --- summary ---` comment). So
on any non-dry run it prints `✓ Released <tag>` and the tag-verify line **including on a run that just
declined to create that tag** — because the summary was written as if the default path were the only
path.

The first sentence of the quoted passage — *"The summary block (`:271-277`) is guarded **only** by
`dryRun`"* — **was and is correct.** Only the generalization from it to the whole file is wrong.

### ⛔ The finding is unchanged. The task did not shrink.

Only the **explanation** was wrong. **All three defects still stand exactly as written above**, and
none of the measured reproductions in this brief are affected — every one of them was produced by
**running** the script, not by reading it:

- **R1** — `--no-tag` / `--no-push` prints a verify that exits 2, **including `--no-tag` alone, which
  does publish commits to origin**. Still real, still reaching the publishing case.
- **R2** — `--no-bump` over an existing origin tag verifies **exit 0** against a stale tag: a false
  green. Still real, and still the worst of the three.
- **R5** — the tag-absent failure is **silent on both streams**. Still real, and the "conflates 2 with
  128" wording is still false (see the ⛔ note under R5).

⛔ **A planner must not read this correction as narrowing the remedy.** *What to build* is unchanged:
the guard still belongs on the summary block, and all four numbered requirements still hold.

### Where the gloss came from — and ⛔ do not go edit it

The `:82-83` citation and the "guarded only by `dryRun`" framing were inherited from
[`0254`'s `review.md`](../0254-fix-the-unrunnable-verify-command-release-mjs-prints/review.md)
(*Reviewer findings* R1 at `:51-52`, *Coder response* R1 at `:250-252`). ⚠️ **Read on disk
2026-08-13: that ledger does NOT contain the false clause.** Both of its passages say the flags are
*read at `:82-83`, **but the summary block** is guarded only by `dryRun`* — which is correct and
narrow. The overreaching *"and never consulted again"* was introduced **here, in this brief**, when
the ledger's wording was compressed. (The ledger cites the block as `:272-277`; this brief cites
`:271-277`, including the comment line. Both point at the same code.)

⛔ **Do not edit `0254`'s `review.md`.** `0254` is closed and its ledger is a frozen record of what
was reviewed — and in this instance it is also **not** the thing in error. Noted only so a reader
following the evidence trail knows what they will find there.

> ⚠️ **Same standing caution as the note above:** every `:NNN` here was read from disk on 2026-08-13
> against a 277-line `bin/release.mjs`. **The durable anchor is the quoted text, not the number** —
> and this task edits the very block it cites.
>
> ⛔ **Nothing else was touched:** no status, priority, board or owner change (still `🔲 Backlog`,
> unranked); no mover invoked; no other file edited; no `ai-agents/wiki-vault/` write; no commit.

---

## ⚠️ Amendment, 2026-08-13 — a FOURTH in-scope defect: `--no-bump` cannot finish a release when the tag is local-only

**Owner-authorized**, `fkit lead` session, verbatim option label **"Fold into 0288"**. Appended by a
spawned `fkit-producer` with no owner channel (ADR-021). ⛔ **Nothing above this line was altered** —
this block **adds** a defect; it does not re-scope, narrow, or replace the three already recorded.

### ⚠️ The count is now FOUR, not three

**R1, R2 and R5 all still stand exactly as written above.** Wherever this brief says *"the three
defects"*, read **four**:

- **R1** — `--no-tag` / `--no-push` prints a verify that exits 2, **including `--no-tag` alone, which
  does publish commits to origin**. Unchanged.
- **R2** — `--no-bump` over a tag **already on origin** verifies **exit 0** against a stale tag: a
  false green. Unchanged.
- **R5** — the tag-absent failure is **silent on both streams**. Unchanged.
- **N1 (new, below)** — `--no-bump` over a tag that exists **locally but not on origin** silently
  fails to finish the release.

**N1 is deliberately NOT numbered in `0254`'s R-series** — it did not come from that ledger, and a
reader must not go looking for it there. It was surfaced by an independent review of
[`0289`](../0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md)'s vault output and **confirmed against the source by the `fkit lead` session**,
then **re-derived from disk a third time by this producer before being written here**.

### N1 (high) — tag local-only: the tag push never runs, nothing says so, and the printed check fails

**Measured on disk 2026-08-13, `bin/release.mjs`, 277 lines.** Preconditions: `doTag` true (no
`--no-tag`), `doPush` true (no `--no-push`), `localTagExists` **true**, `remoteTagExists` **false**.
This is what `--no-bump` sees after a release that died between `git tag -a` and
`git push origin <tag>`.

| line | code | what happens in this state |
|---|---|---|
| `:227` | `if (doTag && (localTagExists \|\| remoteTagExists)) {` | **true** — prints `• tag <tag> already exists locally — will skip tag creation`. `step()` (`:103-105`) is `console.log` only — **informational, it does not exit or change control flow.** |
| `:250` | `if (doPush) {` | **true** — **the branch is pushed.** The commit is published. |
| `:258` | `if (doTag && !localTagExists && !remoteTagExists) {` | **FALSE**, because `localTagExists` is true. **The whole tag block is skipped — so `:261-263`'s `git push origin <tag>` never runs.** |
| `:267` | `} else if (!doTag) {` | **FALSE** too, because `doTag` is true. **So nothing whatsoever is printed about the tag not being pushed.** |
| `:276` | the verify line | prints — and the check **exits 2**, because the tag is not on origin. |

**The net effect: the run publishes the commit, never pushes the tag it was run to push, says nothing
about that, and prints a check that fails.**

### ⚠️ Why this is worse than a print bug — it breaks the script's own documented recovery

`bin/release.mjs:12-14`, quoted verbatim from disk:

```
// Re-run safety: a --no-bump run is idempotent (an existing tag or an already-
// committed tree is skipped). A default (bumping) run always cuts a NEW version,
// so after a partial failure re-run with --no-bump to finish the same one.
```

**A release that dies between `git tag -a` (`:260`) and `git push origin <tag>` (`:263`) leaves
exactly the local-tag-only state above.** The script's own header sends the maintainer to `--no-bump`
to finish it. **`--no-bump` then declines to push the tag, prints nothing about declining, and ends on
a failing check.** ⛔ **The documented recovery path cannot recover, and is silent while failing.**

⚠️ **"Idempotent" in that header is doing work it cannot support.** Skipping tag *creation* is
idempotent; skipping the tag *push* is not — it leaves the release unfinished. The remedy must not be
read as licence to rewrite the header comment instead of the behaviour (and ⛔ any change to tag or
push **logic** remains out of scope — see below).

### ⚠️ This is new ground drawn from lines the brief already cites — not something the brief missed

**Say it this way, and do not restate it as an oversight.** This brief already cites `:227` and
`:258` — at `:119`, under **R2**:

> - `:227-229` and `:258` — tag creation is skipped when `localTagExists || remoteTagExists`.

That sentence is **correct**. What was never drawn from it is the **consequence in the
local-only branch**: that with `localTagExists` true and `remoteTagExists` false, the `:258` block —
**which is also where the tag push lives** — is skipped whole, and `:267`'s `else if` does not cover
it. **The lines were cited; this consequence was not derived.** That is a genuinely new finding on
ground the brief already touches.

⛔ **This is NOT a defect in [`0289`](../0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md) and must not be recorded as one.** `0289`'s page
never claimed to enumerate this file's failure modes exhaustively, so it stated nothing false. It was
the review **of** that output that surfaced N1. Do not open a correction against `0289`.

### ⚠️ Evidence status: source-confirmed, NOT executed

**Neither the reviewer, nor Codex, nor the lead, nor this producer ran `bin/release.mjs` under these
flags.** N1 was established by reading the branch structure at `:227`, `:250`, `:258`, `:261`, `:267`
and `:276` — three times, independently — and reasoning over which branches are true in the
local-tag-only state. ✅ **Every line number and quote in this block was re-read from disk
2026-08-13 by the producer appending it.**

⛔ **Do not carry N1 into a close as "verified".** It is **source-confirmed, not executed** —
weaker evidence than R1/R2/R5, every one of which was produced by **running** the script. ✅ **The
first thing the implementer does is turn that into an execution**, per the verification requirement
below. ⚠️ **If the run does not reproduce it, say so out loud and do not quietly drop N1** — a
non-reproduction is itself a finding and belongs in the close.

### ⚠️ N1 and R2 are DIFFERENT bugs — do not merge them

Both fire under `--no-bump`, and that resemblance is a trap:

| | **R2** | **N1** |
|---|---|---|
| tag state | exists **on origin** (`remoteTagExists` true) | exists **locally only** (`remoteTagExists` false) |
| tag push | correctly not needed — it is already there | **needed, and silently skipped** |
| printed check | **exits 0** — a false **green** over a stale tag | **exits 2** — a **red** with no explanation |
| what is wrong | the check passes without being true | the release did not finish, and nothing says so |

⛔ **A single guard on `localTagExists || remoteTagExists` may fix one and leave the other.** Whoever
plans this must state, per state, what the run does and what it prints. ✅ **The plan must address
R2 and N1 separately, and say so explicitly** — even if one change happens to answer both.

## What to build — additional requirement (extends `## What to build` above; requirements 1–4 unchanged)

5. **Answer N1 — a `--no-bump` run whose tag exists locally but not on origin must either push that
   tag, or say plainly that it did not and that the release is unfinished.** ⚠️ **Which of the two is
   a real decision, and the plan must make it explicitly and argue it**, because pushing the tag is a
   change to tag/push behaviour rather than to the summary block. ⛔ **The `## Out of scope` fence
   above still stands** — *"any change to bump logic, tag logic, push logic"* is excluded. ✅ **If the
   plan concludes the honest fix requires touching the tag-push branch (`:258-266`), it must NOT do it
   under this fence — it must raise it as a scope question at the plan gate and get the owner's
   answer.** ⚠️ **The summary-block-only remedy — printing the truth about an unpushed tag — is
   inside the fence and needs no ruling.**

> ⚠️ **RULED 2026-08-13 — the scope question this requirement routes to the plan gate is CLOSED. ⛔ A
> coder planning `0288` must NOT re-raise it.** Owner ruling, `fkit lead` session, `AskUserQuestion`,
> verbatim option label **"Report truthfully only — stay inside the fence"**. Requirement 5's
> *"either push that tag, or say plainly that it did not"* collapses to the **second** branch.
> ⛔ **Do NOT lift the fence. Do NOT make `--no-bump` push the existing local tag under this task.**
> **The full ruling, its accepted residual, and what it does NOT solve: see the dated block at the END
> of this file.** *(Inserted 2026-08-13 by a later spawned `fkit-producer` with no owner channel,
> ADR-021 — an **addition only**; not one byte of the amendment this pointer sits inside was altered,
> and no requirement was renumbered.)*

## Verification steps — additional requirement (steps 1–11 above unchanged)

⚠️ **This also extends step 1's list of paths.** Step 1 requires `--no-bump` over a tag that already
exists **on origin**; N1 requires the **local-only** state as a separate, additional path.

12. **N1 is closed, and PROVEN by execution — not by reading.** ⛔ **A reasoned argument does not
    close N1; N1 was itself found by reasoning and that is exactly why it must be run.**
    1. Build the local-tag-only state: a throwaway clone with a **local bare** `origin`, an annotated
       tag present **locally** and **absent on origin** (`git tag --list <tag>` prints it;
       `git ls-remote --tags origin <tag>` prints nothing).
    2. **Show the failure first, on the code as it stands today** — run `--no-test --no-bump`, paste
       the full output verbatim, and show that no `push origin <tag>` step appears, that no line says
       the tag was not pushed, and that the printed verify command exits **2**.
    3. **Then show it fixed** — same setup, same command, on the changed code. Paste the output
       verbatim and show the new behaviour: either the tag is on origin afterwards
       (`git ls-remote --tags origin <tag>` non-empty, exit 0), or the summary states the release is
       unfinished and the tag unpushed. ⚠️ **Show the verify command's exit code either way.**
    4. **Show R2's state is still handled** — re-run the step-1 `--no-bump`-over-an-origin-tag case
       **after** the N1 fix and paste it, so a fix for one state is not silently a regression in the
       other.

**⚠️ The safety rule is the same one stated at the top of `## Verification steps`, and it is
non-negotiable here too:** reproduce **only** against a **throwaway clone whose `origin` is a local
bare repository** (`git init --bare`). ⛔ **Never push to `flashist/fkit`. Never create, push or
delete a tag on the real origin.** ✅ **Re-check the real repo's integrity afterwards and record it**
— `HEAD`, local tag count, `VERSION`, `git status --porcelain`. **This is the same ~10-second
technique that found R1 and R2** (`git clone` to a throwaway, `cp bin/release.mjs` in, run the flag
combination); it is established in this task family and there is no excuse for reasoning instead.

> ⚠️ **Same standing caution as the notes above:** every `:NNN` in this amendment was read from disk
> on 2026-08-13 against a 277-line `bin/release.mjs`. **The durable anchor is the quoted text, not the
> number** — and this task edits the very block it cites.
>
> ⛔ **Nothing else was touched:** no status, priority, board or owner change (still `🔲 Backlog`,
> unranked, owner `fkit-coder`); no mover invoked; no re-rank (ADR-035); no other file edited — not
> `bin/release.mjs`, not `0289`, not `0254`'s `review.md`, not `sprint-5.md`, not `backlog.md`; no
> `ai-agents/wiki-vault/` write; no commit, no push.

---

## ⚠️ Ruling, 2026-08-13 — N1's scope question is ANSWERED: stay inside the fence, report truthfully

**Owner ruling**, `fkit lead` session, `AskUserQuestion`, verbatim option label **"Report truthfully
only — stay inside the fence"**. Appended by a spawned `fkit-producer` with no owner channel
(ADR-021). ⛔ **Nothing above this line was altered**, with one stated exception: a **pointer-only
blockquote was inserted** directly after requirement 5's text, under the heading quoted verbatim
below, so this ruling is discoverable from where the question was routed. That insertion **added**
lines; it rewrote none, renumbered nothing, and altered no existing byte.

### The heading this ruling closes — quoted verbatim so a `grep` finds it from either direction

```
## What to build — additional requirement (extends `## What to build` above; requirements 1–4 unchanged)
```

…specifically its **requirement 5**, which read (and still reads) *"Answer N1 — a `--no-bump` run
whose tag exists locally but not on origin must either push that tag, or say plainly that it did not
and that the release is unfinished"*, and which **routed the choice between those two branches to the
plan gate**.

### The question that was routed

Under `--no-bump`, with the tag existing **locally but not on origin**, the run pushes the branch
(`:250`), **silently never pushes the tag** — `:258` is false, so the tag push at `:261-263` inside
that block never runs, and the `:267` `else if (!doTag)` does not fire either — and then prints a
verify that exits **2**. `bin/release.mjs:12-14` documents `--no-bump` as **the recovery path** for
exactly that partial failure. **Actually pushing the tag would touch tag/push logic — which this
task's own ⛔ fence excludes** (`## Out of scope`: *"Any change to bump logic, tag logic, push logic,
or the `--dry-run` branch"*).

### The ruling

**Stay inside the fence.** The remedy under `0288` is that **the summary block stops claiming a
release landed when the tag was not pushed, and says so.**

- ⛔ **Do NOT lift the fence.**
- ⛔ **Do NOT make `--no-bump` push the existing local tag under this task.**
- ✅ Requirement 5's two-branch choice is **decided**: the **summary-block-only** branch — the one
  requirement 5 itself already marks as *"inside the fence and needs no ruling"*.

### ⚠️ The accepted residual — record it honestly, it is the whole point of the ruling

**After `0288` ships, the documented recovery path still cannot recover.** It will simply **stop lying
about it**: the script will report the true state instead of announcing a release that did not fully
land. A maintainer whose release died between `git tag -a` and `git push origin <tag>` will still have
to push that tag by hand — `0288` tells them so instead of leaving them to discover it from a silent
red check.

⚠️ **That residual is ACCEPTED, not solved.** ⛔ **Do not record it as fixed, and do not let a close
report N1 as "recovery restored".** The close must state the residual out loud. If the owner later
wants the real fix, **it needs its own task** — ⛔ **no such task has been filed, and none was
authorized**; the owner did not ask for one.

### ⛔ This closes the plan gate on N1. Do not re-raise it.

A coder planning `0288` **must not** put this question to the owner again — it has been asked and
answered. The pointer inserted at requirement 5 says the same thing from the other direction.

### ⛔ What this ruling does NOT change

- **The defect count stays FOUR.** R1, R2, R5 and N1 all stand exactly as written above. ⛔ N1 is
  **not** weakened, deferred, or downgraded — only its *remedy* is now bounded.
- **N1's evidence status is unchanged:** still **source-confirmed, NOT executed**. ✅ Verification
  step 12 still stands in full, including 12.2 (show the failure on today's code) and 12.3 (show it
  fixed) — under this ruling 12.3's "fixed" is the **second** branch it already allows: *"the summary
  states the release is unfinished and the tag unpushed"*, with the verify command's exit code shown.
- **No requirement was renumbered and no verification step was removed.**

> ⚠️ **Line-citation check, run because this note inserted lines mid-file.** This brief contains
> exactly **two** citations to its **own** line numbers — `:75-77` (in the 2026-08-13 *Correction*
> block) and `:119` (in the 2026-08-13 *Amendment* block). **Both point ABOVE the insertion point**,
> so **neither shifted**; re-read on disk after the insert, `:75-77` still holds R1's superseded
> mechanism sentence and `:119` still holds the `` `:227-229` and `:258` `` bullet under R2. **Every
> other `:NNN` in this brief cites `bin/release.mjs`, not this file, and is untouched by a brief
> edit.** ⚠️ Those `bin/release.mjs` citations were re-read from disk 2026-08-13 against a **277-line**
> file: `:12-14`, `:250`, `:258`, `:261-263`, `:267` and `:271-277` all match their quoted text.
> **The durable anchor remains the quoted text, not the number.**
>
> ⛔ **Nothing else was touched:** no status, priority, board or owner change (still `🔲 Backlog`,
> unranked, owner `fkit-coder`); no mover invoked, nothing closed, nothing moved, nothing filed; no
> re-rank (ADR-035); no other file edited — not `bin/release.mjs`, not `sprint-5.md`, not
> `backlog.md`, not any other brief; no `ai-agents/wiki-vault/` write; no commit, no push.

---

## ⚠️ Ruling, 2026-08-13 — the test-coverage question is ANSWERED: (a) add a test AND extend `prove-red.sh`

**Owner ruling**, `fkit lead` session, `AskUserQuestion`, verbatim option label **"(a) Add a test +
extend prove-red.sh"**. Appended by a spawned `fkit-producer` with no owner channel (ADR-021).
⛔ **Nothing above this line was altered**, with one stated exception: a **pointer-only blockquote was
inserted** at the end of the question block named below, so this ruling is discoverable from where the
question was asked. That insertion **added** lines; it rewrote none and altered no existing byte.
⚠️ **The question itself is left standing verbatim — it is ANSWERED, not deleted.**

### The heading this ruling closes — quoted verbatim so a `grep` finds it from either direction

```
### ❓ Open question for the owner — does this task add test coverage?
```

Its three offered answers were **(a)** *"add a test and extend `test/prove-red.sh` so it is
red-provable"*, **(b)** add no test and record the gap as an accepted residual, **(c)** file coverage
as its own separate task. **The owner chose (a).**

### ⚠️ What this lifts — and how narrowly

**It lifts the ⛔ *"no added test gate"* — for `0288` ONLY.** That boundary was **`0254`'s**, and
`0254`'s reviewer suppressed a Codex finding on exactly that ground, recording *"Re-raise only if the
owner lifts it."* **The owner has now lifted it here.** ⛔ **Do not read or restate this as a general
lifting.** `0254` is closed; its boundary stands as **history**, and nothing about this ruling reaches
back into it.

### The owner's reasoning — recorded, because it is what makes the widening defensible

- **`0288` is the second attempt at the same printed line**, and it now carries **four** defects — R1,
  R2, R5 and N1 — **every one of which a single execution would have caught.** An untested line is how
  all four arrived.
- **The technique is already established and cheap:** a throwaway clone plus
  `node bin/release.mjs --no-test --no-push` executes that branch in roughly ten seconds, and it is how
  R1 and R2 were originally found.
- **`prove-red.sh` is this project's hard gate.** An assertion that cannot be proven red is not trusted
  here — which is why the ruling is *"test **and** red-provable"*, not merely *"test"*.

### What the owner weighed against it — recorded so a later reader sees a judgment, not an oversight

`bin/` sits outside `claude/structure-manifest.tsv`; the summary block is maintainer-facing output that
nothing parses; and this is **new ground — the suite has never touched `bin/release.mjs`.**

### Consequences — state these explicitly

- **`## Out of scope` widens, and its own condition is now met.** That fence already reads
  ⛔ *"Any file other than `bin/release.mjs`* — **except a test, and only if the owner answers the open
  question below in the affirmative**.*"* ✅ **The owner answered in the affirmative.** The task may now
  also touch **one new test file** and **an extension to `test/prove-red.sh`**. ⛔ **`## Out of scope`
  was NOT rewritten** — this dated note is the record, as with everything else in this brief.
- **Verification step 8 follows automatically.** It already admits *"a test file **only** if the owner
  answered the open question below in the affirmative"* — so `git diff --stat` may now legitimately
  show `bin/release.mjs`, the new test, and `test/prove-red.sh`, and **nothing else**. ⛔ Still no
  `package.json`, no `VERSION`, nothing under `ai-agents/wiki-vault/`.
- ⛔ **The coder no longer raises this at the plan gate.** The bullet at the end of the question block
  instructs exactly that; it is superseded by this ruling, and the inserted pointer says so from the
  other direction.
- ⛔ **The (b) branch does not apply.** The close does **not** record an accepted test-coverage
  residual — it reports the test that was written and the mutation(s) that proved it red.
- ⚠️ **Step 11 needs care, and is NOT cancelled.** Its measurement — *no test in this repo executes the
  summary block, verified 2026-08-13* — was true of the suite **as it stood** and remains the reason
  this ruling exists. ⛔ Its prohibition still holds for the **pre-existing** suite: a green `npm test`
  from the tests that already existed says **nothing** about this change. ✅ What the close reports
  instead is the **new** test's own measured result **and** its `prove-red.sh` mutation(s) going red at
  the named assertion. **Do not quietly delete step 11; satisfy it by naming what does and does not
  cover this line.**

### ⚠️ The widening is BOUNDED — and both of today's rulings hold at once

- ✅ It authorizes coverage **for `0288`'s four defects on the summary/tag path**.
- ⛔ **Not a general test suite for `bin/`.**
- ⛔ **Not a licence to touch tag or push logic** — the separate ruling above (*"Report truthfully only
  — stay inside the fence"*) keeps that fenced. **The two rulings do not conflict:** the test proves
  the summary block **reports truthfully**; it does not authorize changing what the tag logic **does**.
- ⛔ **The defect count stays FOUR.** R1, R2, R5, N1 all stand exactly as written above; none is
  weakened by this ruling.

### ⚠️ Mutation coverage — the plan's call, deliberately NOT decided here

`test/prove-red.sh` requires each mutation to red its **NAMED** assertion, not merely "some failure".
⛔ **How many mutations the four defects warrant is NOT decided in this brief** — ✅ **the plan must
decide it and argue it.**

**Two facts about that file the planner should have before deciding, read from disk 2026-08-13:**

- Its own header calls it *"the hard gate for the **launcher-contract** suite (task 23 / ADR-014)"*,
  and every one of its **seventeen** current mutations targets a copied **launcher** tree, pointed at
  via the `FKIT_LAUNCHER` env var. **A `bin/release.mjs` mutation is new ground in that script too** —
  ⚠️ it is not a one-line addition, and the plan should say how the mutant is built and pointed at.
- The header carries an explicit standing instruction: *"SEVENTEEN mutations, each caught by a NAMED
  assertion. ⚠️ **KEEP THIS LIST IN STEP WHEN YOU ADD ONE**"* — the index drifted once before (task
  `0136` round-1 review R5). ✅ **Any mutation added under `0288` must update that count and index.**
- `package.json`'s test script is `node --test test/*.test.js && bash test/prove-red.sh`, so a new
  `test/*.test.js` file is picked up by `npm test` automatically. ⛔ **This is context, not permission
  to edit `package.json`** — that remains out of scope.

> ⚠️ **Line-citation check, re-derived from scratch after this note inserted lines mid-file** (not
> reused from the previous check). Re-grepped on disk: this brief still contains exactly **two**
> citations to its **own** line numbers — `:75-77` and `:119`, both in earlier blocks, and the
> previous ruling block's check restates the same two. **Every target sits above BOTH of tonight's
> insertion points**, so **no target shifted**; re-read after the insert, `:75-77` still holds R1's
> superseded mechanism sentence and `:119` still holds the `` `:227-229` and `:258` `` bullet under R2.
> ⚠️ The **citing** sentences moved down by the inserted lines, but they cite targets, and the targets
> are unmoved. **Every other `:NNN` in this brief cites `bin/release.mjs`, not this file**, and no
> brief edit can shift those — that 277-line file was not touched.
>
> ⛔ **Nothing else was touched:** no status, priority, board or owner change (still `🔲 Backlog`,
> unranked, owner `fkit-coder`); no mover invoked, nothing closed, moved or filed; no re-rank
> (ADR-035); no other file edited — not `bin/release.mjs`, not `test/prove-red.sh`, not any test, not
> `sprint-5.md`, not `backlog.md`, not any other brief; no `ai-agents/wiki-vault/` write; no commit, no
> push.
