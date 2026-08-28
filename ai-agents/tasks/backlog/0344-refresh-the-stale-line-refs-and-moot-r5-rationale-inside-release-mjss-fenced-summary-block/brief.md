# Refresh the stale `:NNN` line references and the moot R5 rationale inside `bin/release.mjs`'s fenced summary block — comments only

## ID
0344

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority — one owner ruling, 2026-08-27

Given live via `AskUserQuestion` in an `fkit lead` session driving `/fkit-sprint-ship-loop`, on
`0300`'s stateful-review finding **R4**, and relayed to a spawned `fkit-producer` with **no owner
channel** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**The option label is the verbatim text: "File a follow-up task (Recommended)".** The reviewer had
offered three dispositions — *open the fence for a comment-only refresh in 0300, file a follow-up, or
leave and accept as a residual* — and the owner chose the second. **This task is that follow-up.**

⚠️ **What the ruling opens, exactly.** It opens `0288`'s fence for **comment lines only, inside the
summary block, with no behaviour change** — the scope R4 named. It opens nothing else. See *The fence
rule* below.

### What went stale, and why

`0300` (`release-mjs-with-branch-other-commits-and-tags-head-but-pushes-a-different-ref-and-reports-released`)
inserted a 23-line `--branch` preflight guard **above** the summary block — today at `:115-136`, under
`// --- --branch must name the CHECKED-OUT branch (task 0300)`. Everything below it moved down by
exactly 23 lines. The fence marker `// --- summary ---` moved `:271` → `:294`. Seven `:NNN` references
**inside** the block's comments still carry the pre-0300 numbers, and one rationale inside the block
now describes a state the guard makes unreachable.

`0300`'s coder saw one of them (`:311`, the branch-push reference) and correctly left it: *"The
comment is at/after `// --- summary ---`, which this task may not touch. Noting it for the reviewer /
a follow-up rather than editing across the fence."* (`0300` `worklog.md`, *Stale `:NNN` reference
inside the summary block, left as is (fence)*). `0300`'s reviewer then measured all seven as R4 and
held the fence too: *"This diff may not fix any of it — the fence forbids it and the coder rightly
left it."*

### The fence rule — cite it, do not re-derive it

- **Origin:** `0288`
  ([brief](../../done/0288-fix-the-post-release-verify-lines-failing-and-false-green-cases/brief.md)),
  `### ⛔ Out of scope`: *"This task owns the **summary block** and whatever guard the fix needs,
  nothing else in the file."* The reciprocal — nobody else owns the block — is written into `0300`'s
  brief, `### ⛔⛔ THE `:271` FENCE — do not assume it is open`: *"`0288` is closed and its fence
  stands: `bin/release.mjs:271` and below is `0288`'s territory … the fence is NOT open, and you must
  STOP and report rather than editing."*
- **In the code itself:** `bin/release.mjs:317` *"0288 is fenced to this block"*, and
  `test/release-summary.test.js:5-6` *"⛔ nothing in this file may change tag, push or bump BEHAVIOUR —
  0288 is fenced to the summary block (owner-ruled 2026-08-13 …)"*.
- **Who may open it:** the owner, by ruling, and nobody else. The record shows it declined twice on
  2026-08-13 (`0288`: N1 *"Report truthfully only — stay inside the fence"*; `push.followTags` *"Leave
  it documented"* — the owner *"declined to lift the `:271` fence"*, per `0300`'s brief) and held
  by both `0300` parties. `0300`'s reviewer carries it forward as inherited: *"the `:271` (now `:294`)
  summary fence stays closed"*.
- **This task's opening is bounded to what the 2026-08-27 ruling names.** Comments, inside the block,
  no behaviour change. ⛔ A plan that finds it needs a non-comment edit must STOP and report — that is
  the fence rule applying to this task exactly as it applied to `0300`.

### ⚠️ This is the third time the fence has been held against a line-ref refresh

Recorded here because it bears on the plan choice below. The three occasions in the records:

1. `0300`'s coder — `worklog.md`, held on `:311`, left stale, flagged for follow-up.
2. `0300`'s reviewer — R4, measured all seven, held: *"the fence forbids it and the coder rightly
   left it"*.
3. The owner, 2026-08-27 — chose *"File a follow-up task"* over *"open the fence for a comment-only
   refresh in 0300"*.

Every insertion above `:294` will do this again. A refresh that writes new numbers buys a correct file
until the next guard lands above the fence; a refresh that replaces the numbers with anchors that
survive insertion buys it permanently. **Both are offered below. This brief does not choose.**

### The dated snapshot — measured 2026-08-27, against a 408-line `bin/release.mjs`

⚠️ **These numbers are a dated snapshot, not a specification.** `0300`'s Process-review round may
move them by a line or two before this task runs. **The coder MUST re-derive every number from disk
before editing** — verification step 1. The quoted fragment is the anchor; the number is what it
resolved to on the day.

| Comment line (today) | Reads | Names | Where that sits today |
|---|---|---|---|
| `:303` | *"measurements at :218-220"* | the `localTagExists` / `remoteTagExists` reads under `// --- tag existence checks ---` | `:241-243` |
| `:310` | *"the branch push at :250-252"* | `if (doPush) { step(…push origin…) … git(["push", "origin", branch])` under `// 2. push branch` | `:273-275` |
| `:313` | *"before the :258 block is skipped"* | `if (doTag && !localTagExists && !remoteTagExists) {` under `// 3. tag` | `:281` |
| `:313` | *"was read pre-run at :219"* | the `const remoteTagExists =` assignment | `:242` (the statement spans `:242-243`) |
| `:319` | *"the tag block at :258 ran"* | the same `// 3. tag` block | `:281` |
| `:329` | *"MEASURED STATE (:218-220)"* | as `:303` | `:241-243` |
| `:371` | *":252 pushed ${branch}"* | the `git(["push", "origin", branch])` call | `:275` |
| `:403` | *":252 pushed ${branch}"* | the same call | `:275` |

Every drift is exactly **+23** — the guard's own line count. Nothing below the fence moved relative to
anything else below it. These match `0300`'s reviewer's R4 measurement line for line.

**Not stale, leave alone:** `:317` *"0288 is fenced to this block"* (true); the task references at
`:295-296`, `:360-362`, `:375`, `:400` (`0288`, review R-numbers, dates — not line coordinates); the
`push.followTags` measurement's *content* at `:309-318` (owner-ruled *"Leave it documented"* — only its
two numbers are stale).

### The moot R5 rationale — `:371-372` and `:403`

Both lines justify comparing the tag against `${branch}` rather than `HEAD` with *"under `--branch
<other>` HEAD is still on the current branch"* (`:371-372`) / *"under `--branch <other>` HEAD is not
it"* (`:403`). After `0300`, a `--branch` that is not HEAD's branch is refused at `:129-136` before the
bump — so on **every path that reaches the summary, `branch === headBranch`**. The state the
rationale describes is unreachable. `0300`'s reviewer: *"the R5 rationale is moot, though the code it
defends is still correct."*

⛔ **The code it defends stays.** `git rev-parse ${branch}` at `:373` and `:404` is still right —
`${branch}` is the ref step 2 pushed, and it now also equals HEAD's branch. **Only the reason text is
stale.** The reworded comment must (a) keep the `(review R5)` provenance, (b) say why `${branch}` is
the right ref today (it is what was pushed; since `0300` it is HEAD's branch too, so the old
distinction no longer arises), and (c) not invite a later reader to "simplify" it to `HEAD` — that is
exactly the kind of drift the comment was placed to stop.

### Conflicts and dependencies

- **Waits for `0300` to close** — its Process-review round may still shift the block; a refresh
  measured before that lands is a refresh against a moving file. The dependency also keeps this task's
  authority trail (R4 → ruling → this brief) complete before anyone reads it.
- ⛔ **`0288`'s and `0300`'s ledgers are frozen.** Nothing in either folder is edited by this task —
  not to "update" R4's numbers, not to note this task's existence.
- **No conflict with a locked decision.** The `push.followTags` "Leave it documented" ruling is not
  touched: the comment keeps its content, only its `:NNN`s change.

## What to build

**One outcome:** every `:NNN` inside the summary block (at/after `// --- summary ---`) either
resolves to the fragment it names, or is gone; and the two R5 rationales say something true. **Two
routes to it — the plan picks one and argues the choice against the *third time* section above. This
brief deliberately does not decide.**

### Option A — number refresh

1. Replace each stale number in the table with its re-derived value.
2. Where a number stands **naked** (no quoted fragment beside it — `:303`, `:319`, `:329`, `:371`,
   `:403` today), pair it with the fragment it names, per
   [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md),
   *Never cite a line number naked*: *"A pointer carrying … a quote is self-correcting."* This makes
   the **next** drift recoverable by a reader instead of invisible.
3. Reword the two R5 rationales as specified above.

Cheapest. Goes stale again at the next insertion above the fence — and that has now happened once
already since `0288` shipped.

### Option B — durable anchors

1. Replace each `:NNN` with the section marker or fragment it names — *"the `// 2. push branch`
   step"*, *"the `// --- tag existence checks ---` reads"*, *"the `// 3. tag` block"* — and drop the
   number.
2. Reword the two R5 rationales as specified above, anchored the same way.

⚠️ **The convention does not name this target, so the plan must apply its two-condition test and say
so.** Row 1 of the convention's table rules `path:NNN` **correct** for *"a source file … cited in a
design doc or a finding"*; these are **in-code comments pointing into the same living file**, which
grows above them under the fence for reasons unrelated to the sentence — the situation the
convention's *"Applying the two conditions to a target the table does not name"* section exists for.
Argue it there; do not assert it. Removes the recurring refresh; slightly less precise for a reader
with a line-numbered editor. **If chosen, the plan should also say whether the file's remaining
above-fence `:NNN`s (none found today — verification step 6) or the test file's references should
follow, and STOP there — those are outside this task.**

### Either option — the invariants

- **Comment lines only.** Every changed line, stripped of leading whitespace, begins with `//` or is a
  continuation within a `//` comment. **Non-comment content of the file is byte-identical** before and
  after — verification step 2 proves it mechanically.
- **Inside the fence only.** No hunk above the `// --- summary ---` line — step 3.
- **No behaviour change**, no test change, no `prove-red.sh` change. The mutation harness anchors on
  source-line text (mutations 18–22 and 25 use `sed`/`awk` on exact source lines with NO-OP and
  WRONG-TARGET guards), so a comment edit must not disturb it — step 5 proves that rather than
  assuming it.

### ⛔ Out of scope

- ⛔ **Any non-comment edit anywhere in `bin/release.mjs`.** If the plan concludes one is needed,
  STOP and report — the fence rule, applied to this task.
- ⛔ **Anything above `:294`** — the guard's own comments, the file header, the `push.followTags`
  alternative at the push. The 2026-08-27 ruling opened the block, not the file.
- ⛔ **Re-reading origin / `push.followTags` runtime mis-report** — owner-ruled *"Leave it
  documented"*. The comment's numbers are refreshed; its claim is not touched.
- ⛔ **The test-file comment bookkeeping** (`prove-red.sh:211`, `release-summary.test.js:38`, `:98`) —
  that is `0300`'s **R6**, disposed under `0300`, not here.
- ⛔ **Editing `durable-citation-anchors.md`** — dual-homed, byte-identical in both copies, changed by
  owner ruling only. If Option B suggests a convention addendum, it goes in the worklog as an open
  question for the owner (see `## Notes`).
- ⛔ **Any edit under `ai-agents/tasks/done/0288-*/` or `ai-agents/tasks/*/0300-*/`.** Frozen.
- ⛔ Any `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ No commit, no push, no re-rank, no task-file move (ADR-033).

## Verification steps

1. **Re-derive before editing.** For each table row, `grep -n` the *Names* fragment in
   `bin/release.mjs` and record *"brief said `:X`, disk says `:Y`"* in the worklog. Each of the four
   target fragments — `const localTagExists`, `const remoteTagExists`, `git(["push", "origin", branch])`,
   `if (doTag && !localTagExists && !remoteTagExists) {` — must be found **exactly once** (count with
   `grep -o … | wc -l`, not `grep -c`); if not, STOP and report.
2. **Comment-only, proven mechanically.** `sed -E 's://.*$::' bin/release.mjs | diff - <(git show
   HEAD:bin/release.mjs | sed -E 's://.*$::')` is **empty**. (That `sed` also strips `//` inside
   strings — both sides get the same treatment, so the comparison stays valid; say so in the worklog.)
   Additionally `git diff -U0 -- bin/release.mjs` shows every `+`/`-` line beginning, after
   whitespace, with `//`.
3. **Inside the fence only.** Every `@@` hunk start in `git diff -U0 -- bin/release.mjs` is at or
   after the `// --- summary ---` line (re-measure it; `:294` today).
4. `node --test test/release-summary.test.js` — all green (11 tests at spawn time; re-count and
   record).
5. `bash test/prove-red.sh` — **hard gate PASSED**; mutations 18–22 and 25 each red their **named**
   assertion; **no** `MUTATION WAS A NO-OP` and **no** `WRONG TARGET` line. Paste the six mutation
   result lines into the worklog.
6. **Stale-ref sweep.** `grep -n -E ':[0-9]{2,3}\b' bin/release.mjs | grep -v -E 'https?:'` — for
   every hit at/after the fence: Option A, the number resolves to the fragment beside it (list each
   with its resolution); Option B, there are none. Record the above-fence hits too (none today), so a
   later reader knows they were seen and left.
7. **R5 rationale.** Quote the new wording of both sites in the worklog; confirm the `git rev-parse
   ${branch}` source lines are unchanged (step 2 already proves it — cite the line numbers anyway).
8. `git diff --stat` shows `bin/release.mjs` and this task folder's own files, nothing else.
9. **The plan argued the A/B choice** against the *third time* section and, for B, applied the
   convention's two-condition test explicitly. A plan that picks without arguing is not approved.

## Notes

- **Depends on:** 0300 — its Process-review round must land before the numbers here are re-derived;
  measured earlier, this task refreshes against a file still moving.
- **Blocks:** nothing.
- **Snapshot provenance:** every `:NNN` in this brief was read from disk on **2026-08-27** by a
  spawned `fkit-producer` against a **408-line** `bin/release.mjs` (working tree at spawn time), and
  cross-checked against `0300`'s R4 row, which it matches. Treat as dated.
- **On the board and the rank:** filed to the [Backlog](../../../sprints/backlog.md) board,
  unranked, deliberately — the ruling settled *what*, not *when*. A comment-only refresh has no merit
  case for a sprint rank until someone pulls it.
- **Open question for the owner — surfaced, not decided:** if Option B is chosen and works, is an
  addendum to `durable-citation-anchors.md` for **in-code comments citing their own file** wanted? The
  convention is dual-homed and owner-ruled; the coder records the question in the worklog and does
  not edit the convention.
- ⛔ **Nothing else was touched by filing this:** no source edit, no ledger edit under `0288`/`0300`,
  no `ai-agents/wiki-vault/` write, no commit.
