# Worklog — 0153: the wiki completion flag carries the folder ID and the brief path

- **Date:** 2026-07-27
- **Agent:** fkit-coder, as the Build worker of `/fkit-sprint-ship-loop` (sprint 2), under the driver's
  declared-approval marker (the owner approved the plan live in the driver session; this coder spawn has
  no owner channel of its own — ADR-021).
- **Result:** implemented as planned. Three `SKILL.md` files changed, prose only. The flag block grew
  **33 → 38 lines** in each. Suite green at baseline **and** after: **523 pass / 0 fail**, `prove-red`
  hard gate PASSED both times.
- **No commit.** Everything left in the working tree.
- **One correction to my own approved plan**, found before the first edit and recorded in §4 — the
  plan's prose misdescribed the apostrophe's codepoint. The edits were unaffected.

---

## 1. What was wrong, in one paragraph

Task 0125 landed a completion-flag block in all three wiki SKILLs whose flag line named the task as
`Task N` — and **`N` was never defined**. Every task in this project carries two small integers in
adjacent columns of the same board table: the permanent **folder ID** (the `NNNN` prefix of the task
folder) and the mutable **sprint rank** (the `P<n>` Priority cell). The collision is live: task 0125 has
rank **P108**, and a *different* real task with folder ID **0108** exists — and it is the very
investigation 0125 implements. The line also carried **no path**, though the block's own scan step
already reads `ai-agents/tasks/backlog/*/brief.md` and therefore holds the folder name at flag time. The
consumer, `/fkit-task-done`, **takes a path**, so the producer had to resolve `N` by hand — and
resolving it wrong moves the wrong brief into `done/` and edits the sprint plan against the wrong row.

This is precisely the confusion
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` exists to prevent — *"A task's
identity is its task-folder name's `NNNN` prefix, and nothing else"* — reappearing in text written the
**same day** the convention was approved, on the other side of the repo.

Found by a spawned `fkit-producer` at 0125's close: the role that actually consumes the flag. Neither
the coder, the reviewer, nor the Codex adversarial pass caught it across five rounds.

## 2. The measured block facts — and the claim they refute

The driver's *plan-step* prompt asserted the three blocks are "byte-identical." **They are not**, and
an earlier driver prompt had already carried that error. Measured firsthand before planning, block
extracted between `**The wiki closes nothing` and `Run /fkit-task-done on`:

| File | Before | After |
|---|---|---|
| `fkit-wiki-ingest/SKILL.md` | 33 lines, **2296 B**, min-indent **3** | 38 lines, **2791 B**, min-indent **3** |
| `fkit-wiki-lint/SKILL.md` | 33 lines, **2296 B**, min-indent **3** | 38 lines, **2791 B**, min-indent **3** |
| `fkit-wiki-sync/SKILL.md` | 33 lines, **2215 B**, min-indent **0** | 38 lines, **2698 B**, min-indent **0** |

**Why the byte split exists.** `ingest` and `lint` really are byte-identical to each other. `sync` is
the *same text* with **three fewer leading spaces per line**, because in `sync` the block sits at top
level under `## Step 9` while in the other two it is nested inside a numbered step. Before:
2296 − 2215 = **81 B** = 27 non-blank lines × 3 spaces. After: 2791 − 2698 = **93 B** = 31 non-blank
lines × 3 spaces. The four added rule lines are all non-blank, so the delta grew by exactly 4 × 3 = 12.

**The real invariant, and the one this task preserves:** the backticked flag strings are byte-identical
in all three; the surrounding block is identical **modulo one uniform indentation offset**; relative
nesting is preserved; and `sync` was **not** re-indented to force raw byte-equality.

## 3. What changed

Three files, prose only:

- `claude/skills/fkit-wiki-ingest/SKILL.md` (block at lines 51–88 after the edit)
- `claude/skills/fkit-wiki-lint/SKILL.md` (60–97)
- `claude/skills/fkit-wiki-sync/SKILL.md` (95–132)

The two flag strings, now identical across all three:

```
Task <NNNN>'s vault work is complete — ready to close (producer runs /fkit-task-done on ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)
Task <NNNN>: partial — not ready to close (ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)
```

And the rule added beneath them (shown at `sync`'s 0-space offset; `ingest`/`lint` carry the same four
lines prefixed with 3 spaces):

```
**`<NNNN>` is the task folder name's four-digit prefix** (equivalently the brief's `## ID`) — the same
four digits that open the path you emit, and the task's only identity. It is **never** the sprint
board's rank / `P<n>` Priority cell, which is mutable and re-ranked; see
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`. Substitute real values.
```

The explicit negative is the load-bearing half — it is what a future editor reads before reintroducing
a bare number. The convention is cited as a **bare inline-code path, not a markdown link**: a relative
link from an installed `.claude/skills/fkit-wiki-*/SKILL.md` would not resolve, and bare citation
matches how these SKILLs already cite `ADR-033`, `ADR-018` and `schema.md`.

Nothing else moved. Verified still present and unchanged in all three: the hard-rule bullet, the
"Which tasks to consider" scan, the three-outcome rule including R2's *"say nothing about it at all"*,
R5's *"do not spawn the producer to close it yourself"*, the null line
`No tracked task completed by this run.`, the "carries them verbatim" paragraph, and the routing line
`@fkit-producer Run /fkit-task-done on <brief path>`.

## 4. Two errors of my own, both caught by re-verification, neither by a test

### 4a. My approved plan misdescribed the apostrophe's codepoint

Plan §5.2 (now §6.2, struck through in `plan.md`) said: *"the em dash and the **typographic
apostrophe** are load-bearing… `'` (U+2019, in `<NNNN>'s`)."* **That is wrong.** Codepoint dump of the
landed `ingest:72` before editing:

```
U+2192  '→'
U+2014  '—'
LEN 98
```

Only two non-ASCII characters, and the apostrophe is not among them. Confirmed both ways:
`grep -c "Task N's"` (ASCII U+0027) → **1**; `grep -c $'Task N’s'` (U+2019) → **0**.

**Why it was harmless.** The plan's *operative* text — the §3 `new_string` blocks and CHECK1's shell
variable — already used the ASCII apostrophe, because those were copied from the file rather than
retyped. Only the explanatory note was wrong. The very instruction the note attached to ("copy the
strings, do not retype them") is what kept the error out of the code. The driver's build prompt
restated my error back to me verbatim; I corrected it rather than executing it.

### 4b. The first NC1 negative control was a FALSE PASS, caused by `awk -v`

During planning, NC1 (the control proving a wrong start anchor is rejected) returned **`exit=0`** — a
pass where a failure was required. Cause: I passed the anchor into awk as a variable,
`awk -v SA='The wiki \*\*closes nothing' '… $0 ~ SA …'`. **awk processes escape sequences in `-v`
assignments**, so the backslashes were eaten and `SA` became the literal `The wiki **closes nothing`,
which the file matches. Demonstrated directly:

```
$ awk -v SA='The wiki \*\*closes nothing' 'BEGIN{ print "SA as awk sees it: [" SA "]" }'
SA as awk sees it: [The wiki **closes nothing]
```

Re-run with the anchor **hardcoded as a literal regex inside the program**, NC1 returns `exit=3` as
required. **The rule this leaves behind: the anchor must be a literal regex in the awk program, never
passed via `-v`.** A negative control that is itself broken is worse than no control — it certifies the
check.

This is why the plan required all four controls to be *observed* firing, and why a missed control
discards CHECK3's pass rather than merely footnoting it.

### 4c. The residual this reproduces — 0125's R3

0125's `plan.md` check 4 normalized with `sed 's/^ *//'`, which erases relative nesting. Reproduced
here, post-edit, as an extra control (NC5): with **one** list item's indent broken by a single space in
`ingest`, blanket-stripping still reports the block identical to `lint`'s.

```
NC5: blanket-strip says UNIFORM despite broken indent -> R3 fail-open reproduced
```

The check used in §5 subtracts each block's **own minimum indent** instead, which preserves relative
nesting — and NC3 confirms it catches exactly the mutation blanket-stripping waves through. **R3 itself
is not closed by this task**; it is closed by task **0154**, per the owner's SUBSUME ruling of
2026-07-27.

## 5. Verification — every check, with observed output

### CHECK1 — flag strings, counts, and `Task N` removal

```
ingest: complete=1 partial=1
lint: complete=1 partial=1
sync: complete=1 partial=1
totals: complete=3 partial=3 (want 3 / 3)
CHECK1 PASS
```

Literal `Task N` remaining across the three files: **0**. Fails closed — `grep -c -F` returns 0 on a
missing string and the equality tests reject 0, so a typo'd pattern reads as failure, not success.

### CHECK2 — the identity rule and its explicit negative

All three files carry the folder-ID definition, the `never** the sprint` negative, the
`P<n>` Priority cell mention, and the `priority-is-rank-not-identity.md` citation. → **CHECK2 PASS**

### CHECK3 — uniformity, fail-closed, relative nesting preserved

```
ingest  MININDENT=3 LINES=38
lint    MININDENT=3 LINES=38
sync    MININDENT=0 LINES=38
CHECK3 PASS: uniform modulo one uniform offset
```

Gated on: start anchor matched, end anchor matched, line count ≥ 36 **and** ≤ 45, at least one
non-blank line. Then each block's own min indent is subtracted and the three normalized blocks compared
byte-for-byte.

**The `MININDENT` line is the assertion that proves `sync` was not re-indented.** A `MININDENT=3` on
`sync` would be a FAIL even with a clean normalized diff — the diff alone cannot see it. Re-run after
the stash round-trip in §5 CHECK6: identical output.

### CHECK3N — four negative controls, all observed firing

```
NC1 (0125's real near-miss anchor, hardcoded literally)  exit=3   [required: 3]
NC2 (empty input)                                        exit=3   [required: 3]
NC3 (one list item's relative indent broken)             FIRED    [required: FIRED]
NC4 (whole sync block shifted a uniform +2)              GREEN    [required: GREEN]
```

NC3 carried a sanity guard that would have printed a warning had the mutated extraction come back
empty; it did not fire, so NC3's `FIRED` is a real difference and not an empty-vs-empty artifact.
NC4 is the control that proves the check does **not** over-fire: a legitimate uniform offset — exactly
`sync`'s real state — must stay green.

### CHECK4 — 0125's verification steps 2 and 3 still hold

Every `/fkit-task-done` occurrence in the three files is either descriptive prose inside the flag
string or the untouched routing line. None of the three **invokes** a mover or moves a task file; the
close still routes to the **producer** (ADR-033).

```
ingest  R2=1 R5=1 null=1 hardrule=1
lint    R2=1 R5=1 null=1 hardrule=1
sync    R2=1 R5=1 null=1 hardrule=1
@fkit-producer Run /fkit-task-done on <brief path>   → present 1× in each of the three
```

### CHECK5 — change surface: my plan's assertion was wrong, and here is what replaced it

The plan predicted `git status --porcelain -- claude/` would list **exactly the three files**. It
listed **nine**. Two things I under-observed at plan time, both recorded here rather than glossed:

1. **The dirty tree extends into `claude/`, not just `ai-agents/`.** At plan time I ran
   `git status --porcelain | head`, saw only `ai-agents/` paths in the first ten lines, and generalized.
   The other dirty `claude/` paths — `fkit-status/SKILL.md`, `fkit-status/dashboard.sh`,
   `fkit-task-brief/SKILL.md`, and two scaffold conventions — are **task 0103's** in-flight
   rank-vs-identity work, which is exactly the set named in `priority-is-rank-not-identity.md`'s "Where
   this is enforced". Their diffs contain **zero** occurrences of either new flag string; the only
   overlap is the unrelated pre-existing `<NNNN>-<slug>` folder-naming notation.
2. **Task 0125's own block is still uncommitted.** `git show HEAD:…/fkit-wiki-ingest/SKILL.md` contains
   **0** occurrences of the block anchor, and is 56 lines against the working copy's 98. So `git diff`
   shows 0125 and 0153 fused together and **cannot attribute my change on its own**.

**What replaces the diff-based check, since the diff cannot do the job:** three `Edit` calls, one per
file, each on a unique anchored old_string; the before/after block measurements in §2 (33 → 38 lines,
min-indent unchanged at 3/3/0); CHECK1's exact counts; and SHA-256 checksums taken before the CHECK6
stash and re-verified byte-for-byte after the pop:

```
7722273556f66b4ea577bb40778e39ec7b3d72489b3ee180fa9c9405cdb77663  fkit-wiki-ingest/SKILL.md
fa61197b5be4b7d2007d4dd5740f5d16697458bdb5119199cd12e29130778a84  fkit-wiki-lint/SKILL.md
b2947fc774934acdebe4c0a7971e80dd4069c6340aeb8d743e78cd2ce162a4c8  fkit-wiki-sync/SKILL.md
```

`git stash list` is empty afterwards — no stash left behind. `.claude/` mirrors untouched;
`claude/fkit-claude-init.sh` was **not** run, per plan §6.8. `ai-agents/wiki-vault/` was **not** written
by me — the vault modifications in `git status` are the wiki role's own in-flight work.

### CHECK6 — `npm test` before and after

```
BASELINE (three wiki SKILLs stashed to HEAD):  523 pass / 0 fail / 17 suites
                                               prove-red hard gate PASSED
AFTER    (edits restored):        exit=0       523 pass / 0 fail / 17 suites
                                               prove-red hard gate PASSED
```

Identical. That is the expected result, and it is also the point: **no test in the suite reads any
`SKILL.md` body**, so this change is inert to the suite. `package.json` untouched (`git diff --stat`
empty) — zero devDependencies, ADR-014 respected. Node v24.13.0.

## 6. Task 0154 has not landed — the brief's verification step 7 is vacuous, and is stated, not skipped

The brief's step 7 says *"if task 0154 has already landed, its assertions are updated in this same
change."* **It has not landed.** Verified two ways:

- `ls test/` — there is no `wiki-flag-convention.test.js`; the suite is 13 files, none of them this one.
- `ls -d ai-agents/tasks/*/0154*` → `ai-agents/tasks/backlog/0154-build-wiki-flag-convention-test`,
  still in `backlog/`.
- Repo-wide grep for the flag wording across `test/` → **no hits**. No test asserts the old strings, so
  none needed updating and none could have gone stale.

**So no test required updating.** Recording that explicitly rather than silently omitting the step:
a green suite here means "nothing guards this text", not "the guard agrees".

**This is the free ordering the brief hoped for.** 0154 asserts the flag lines verbatim; landing 0153
first means 0154 now pins the *final* wording, with no rewrite of a brand-new test and no red window in
between. **0154's author should assert the strings exactly as reproduced in §3** — and can reuse
CHECK3's normalize-by-own-min-indent approach and its four negative controls, all of which are recorded
above with their required outcomes.

## 7. The 0126 hazard — recorded, and discharged by an owner ruling

Three wiki-owned tasks will each emit this flag: **0126** (rank P109), **0141** and **0148**. 0141 and
0148 rank below 0153 and will emit the corrected flag. **0126 ranks above it** and cannot be displaced
without renumbering the `✅ Done` rows at P110–P112 — a renumbering the project refuses. If 0126 ran
before this landed, its flag would carry a bare `Task N` and the producer would have to resolve it by
hand against both number-spaces.

**The hazard did not materialize.** The owner ruled at the plan gate on 2026-07-27 that the driver runs
**0153 before the wiki chain**, so 0126 will emit the corrected flag. Recorded here as a standing
record of the hazard and its disposition, so a later reader does not mistake it for an open risk — but
also does not conclude the board expressed something it could not.

## 8. Residuals and what is deliberately left open

1. **The block is still prose enforced by nothing.** The ADR-018 hook never opens a `SKILL.md`
   (`grep -n 'SKILL.md' claude/skill-ownership-hook.sh` → no hits) and no test reads one. Deleting the
   entire block, in all three files, turns nothing red. **Closing that is task 0154's job, not this
   one's** — building a test here would have widened scope past the approved plan.
2. **0125's R3 residual is not closed by this task.** The fail-closed check in §5 was run by hand; it is
   not committed anywhere. Only 0154 discharges R3, per the owner's SUBSUME ruling.
3. **The convention file this text cites is itself uncommitted.** Both homes of
   `priority-is-rank-not-identity.md` — the live copy and the `claude/scaffold/` copy — are **untracked**
   in git right now (task 0103's work, in flight in this same sprint run). The citation resolves on disk
   today and will ship correctly once 0103 commits, but a reader checking out `HEAD` alone would not
   find it. Not a defect in this change; flagged so nobody re-derives it.
4. **Uniformity across the three files remains a human obligation.** The three blocks must be kept
   identical modulo the indentation offset; nothing mechanical holds that today.
