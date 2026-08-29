# Repair the citation drift in `bin/release.mjs`'s fenced summary block and in ADR-042 — one pass, comments and pointers only

> ⚠️ **RETITLED AND WIDENED 2026-08-29 by owner ruling.** The original title was *"Refresh the stale
> `:NNN` line references and the moot R5 rationale inside `bin/release.mjs`'s fenced summary block —
> comments only"*, and the brief below is that task, kept intact. **It has absorbed `0349`** — see
> §*"🔗 ABSORBED 2026-08-29 — `0349`, ADR-042's two stale citations"* immediately below.
> ⛔ **The folder slug still reads `0344-refresh-the-stale-line-refs-…-release-mjss-fenced-summary-block`
> and was deliberately NOT renamed** (a rename is a move; the movers only move between `backlog/`,
> `done/`, `cancelled/`, and inbound citations point at the current path). **Cite this task by ID
> `0344`.**

## 🔗 ABSORBED 2026-08-29 — `0349`, ADR-042's two stale citations

**Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session — the option
label is the verbatim text: "One combined pass (Rec)".** It ruled that this task and `0349`
(*"Correct ADR-042's two stale `test/prove-red.sh:59` citations"*) are **one shippable unit**, not two.

**Shape chosen, and why — a spawned `fkit-producer`'s call, not the owner's.** The owner ruled *that*
they combine; the producer chose *how*. `0349` was folded **into this brief**, and `0349` itself is
**cancelled as superseded-and-absorbed**. The alternative — a third new brief with both cancelled —
was rejected because it would have required re-transcribing this brief's **fence rule**, its
2026-08-27 owner ruling, its eight-row measurement table and its nine verification steps, and the
fence is the single most load-bearing constraint here (held three times, owner-ruled twice). Folding
the small half into the large one preserves both authority trails and risks dropping neither.

**Why one unit is coherent.** Both halves are the same defect class — a `:NNN` citation that drifted
because the file it points into grew above it — and both are governed by
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md).
⭐ **They share one open question: anchor-or-number.** `0349`'s brief said so itself — *"Whichever form
is chosen here is a precedent the next ADR citation will copy. `0349` faces the same question."*
Shipping them separately invites two different answers to one question. **Answer it once, apply it to
both, and say so.**

**Role.** `0349` carried `## Owner: fkit-architect`. **Under
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
§Decision clause 1, the Build role for both halves is the coder** — a citation repair inside an ADR
runs no skill (it is expressly **not** an amendment, so not `/fkit-record-decision`), and *"a
deliverable that names no skill — source, tests, scaffold, prose under `claude/`, coordination-doc
repairs — is the coder's … whatever `## Owner` says."* **This task's `## Owner` stays `fkit-coder`,
and that is now correct for the whole of it.**

### ⛔⛔ THE TWO HALVES ARE SEPARATELY FENCED — read this before planning

**Widening this task does NOT relax the `bin/release.mjs` fence by one line.** The `0288` summary-block
fence, the 2026-08-27 comment-only ruling, and every ⛔ in §*"⛔ Out of scope"* below apply to
`bin/release.mjs` **exactly as they did before this merge**. ADR-042 is a knowledge-base document, is
inside **no** fence, and grants **no** additional latitude over the source file. ⛔ **Conversely, the
`prove-red.sh` mutation gate and the comment-only proof are `bin/release.mjs`'s alone** — do not apply
them to the ADR, and do not report the ADR half as covered by them.

### `0349`'s content, carried over — the drift, measured 2026-08-28

`0349` was filed 2026-08-28 by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md))
at the close of [`0272`](../../done/0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/brief.md),
on the owner's ruling that the producer file it. The drift was found and re-verified in `0272`'s
Round 2 stateful review (R12); `0272` corrected its **own** dated note and deliberately left the ADR
alone.

[`ADR-042`](../../../knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md)
cites `test/prove-red.sh:59` for the line `work="$(mktemp -d)"` at **two** sites:

| Site | Reads |
|---|---|
| `adr-042-…md:33` | *"`test/prove-red.sh:59` opens with `work="$(mktemp -d)"`, so fkit's own red-proof harness is among the things Codex cannot run."* — inside the §Context paragraph that establishes the whole ADR's premise |
| `adr-042-…md:313` | the §Evidence list: `· test/prove-red.sh:59` |

⚠️ **The real line is a moving target, and that is the point.** Measured 2026-08-28,
`work="$(mktemp -d)"` was at **`:80` at `HEAD`** and **`:82` in the working tree**.
**⛔ Do not write `:82`, `:80`, or any number measured today.** Re-measure and record what you find.

**Why it matters.** `:33` is not a footnote — it is the sentence that establishes *why* a Codex pass
measures nothing, and ADR-042 D1's *"Re-raise only if"* conditions are load-bearing for every review
round from here on.

**What to build for this half.** Re-point both citations so they resolve **without a naked line
number**. Same form question as the `bin/release.mjs` half — **answer it once for both.** The
recommended default is to name the anchor and drop `:NNN` entirely (e.g. *"`test/prove-red.sh` opens
its work dir with `work="$(mktemp -d)"`"*); the quoted line is unique in the file and survives every
renumber. Freezing a revision by SHA is available but heavier, and the exact coordinate is not
load-bearing here.

**Constraints for this half:**

- ⛔ **ADR-042's Decision, Status, Date, Deciders, and every D1/D2 clause stay byte-identical.** This
  is a **pointer repair, not an amendment**: a historical record's claims are frozen, its links are
  not. If the surrounding sentence has become factually wrong beyond the coordinate, **STOP and
  report** rather than rewriting it here.
- ⛔ **Change no other citation in the ADR.** Its `claude/skills/…:NN` call-site list and its
  `tasks/done/…/review.md:NN` evidence list are **out of scope** — same durability problem, separate
  decision.
- ⛔ **Do not edit `test/prove-red.sh`.** Nothing is wrong with it; it moved. (Note this sits beside
  the other half's rule that `prove-red.sh` is *run* as a gate — running it is required, editing it is
  forbidden.)
- ⛔ **Do not edit `0272`'s corrected note** — it already cites the right anchor and is in a closed
  task folder.

**Verification for this half** (in addition to every step in §*"Verification steps"* below, which
remain `bin/release.mjs`'s):

- **A1.** `grep -n 'prove-red' ai-agents/knowledge-base/decisions/adr-042-*.md` returns **no `:59`**,
  and no naked `:NNN` for that file at all if the anchor form was chosen.
- **A2.** `grep -n 'mktemp -d' test/prove-red.sh` is run and its output pasted into the worklog at
  implementation time, so the record shows what the line actually was that day.
- **A3.** `git diff` on ADR-042 is confined to `:33` and `:313` — paste it; every other line unchanged.
- **A4.** Quote the whole rewritten `:33` sentence in the worklog. Its claim — that Codex cannot run
  the red-proof harness — must be **unchanged in meaning**.
- **A5.** State which form was chosen and why, against `durable-citation-anchors.md`, **and confirm
  the same form was used in `bin/release.mjs`** — or, if not, argue why the two targets justify
  different forms. ⚠️ Silently using two forms is a failure of this task's whole reason for existing.
- **A6.** `git diff --stat` shows ADR-042, `bin/release.mjs`, and this task folder only. ⛔ Step 8
  below is superseded by this one.

⚠️ **If Option B (durable anchors) is chosen for `bin/release.mjs`, `0349`'s open question stands and
is still not decided here:** whether `durable-citation-anchors.md` needs an addendum for **in-code
comments citing their own file**. Record it in the worklog as an open question for the owner;
⛔ **do not edit the convention** — it is dual-homed and owner-ruled.

---

## The original `0344` brief follows, unchanged

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
  > ✅ **DISCHARGED — re-measured 2026-08-29.** `0300` is closed: its folder sits at
  > `ai-agents/tasks/done/0300-release-mjs-with-branch-other-commits-and-tags-head-but-pushes-a-different-ref-and-reports-released/`
  > and its brief reads `## Status` `✅ Done (agent-closed — not owner-verified)`. **This task is
  > unblocked.** ⚠️ The dependency's *reason* survives as a warning, not a wait: the numbers in the
  > table above were measured 2026-08-27 against a then-moving file, so **verification step 1's
  > re-derivation is now the only thing standing between this task and a wrong number.**
- **Blocks:** nothing.
- **Absorbed `0349`** on owner ruling 2026-08-29 (*"One combined pass (Rec)"*) — see the
  §*"🔗 ABSORBED"* section at the top. `0349` is **cancelled as superseded**, not abandoned; its scope
  lives here in full. A reader following a `0349` citation lands in
  `ai-agents/tasks/cancelled/` on a brief that points here.
- ⚠️ **This task now has two deliverables in two files.** `## Owner` stays `fkit-coder` and is correct
  for both under ADR-044 §Decision clause 1. **A close that ships only one half is not a close** —
  say which halves landed.
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
