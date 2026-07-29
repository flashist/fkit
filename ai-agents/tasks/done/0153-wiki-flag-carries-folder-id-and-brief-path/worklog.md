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

## 5. Verification — the runnable implementations, then every check with its observed output

> **Added in the review round (finding R1).** The first version of this section recorded **outputs
> only** — for every check and every negative control — while `plan.md` claimed "full runnable commands
> are reproduced in `worklog.md` §5" and §6 below pointed 0154's author at "CHECK3's
> normalize-by-own-min-indent approach and its four negative controls". Neither was true: an outcome is
> not an implementation, and **NC1's own false pass had the bug *inside a control*** (§4b). Recording
> outcomes without the code that produced them reproduces exactly that opacity — a reader cannot audit a
> control they cannot see. The implementations below are the ones actually executed. `plan.md:106` has
> been corrected in the same round.

### 5.0 The shared extractor — `norm()`

Every uniformity check and three of the five controls run through this. It reads a `SKILL.md` on
**stdin**, writes the block normalised by its **own** minimum indent to stdout, writes
`MININDENT=<n> LINES=<n>` to stderr, and **exits 3 on any gate failure**.

```sh
norm() {
  awk '
    !started && /\*\*The wiki closes nothing/ { started=1; inb=1 }
    inb { buf[++n]=$0 }
    inb && /Run \/fkit-task-done on/ { ended=1; inb=0 }
    END {
      if (!started) { print "GATE-FAIL: start anchor never matched" > "/dev/stderr"; exit 3 }
      if (!ended)   { print "GATE-FAIL: end anchor never matched"   > "/dev/stderr"; exit 3 }
      if (n < 36)   { print "GATE-FAIL: only " n " lines (< 36)"     > "/dev/stderr"; exit 3 }
      if (n > 45)   { print "GATE-FAIL: " n " lines (> 45)"          > "/dev/stderr"; exit 3 }
      m = 9999
      for (i=1;i<=n;i++) { if (length(buf[i])==0) continue; match(buf[i], /^ */); if (RLENGTH < m) m = RLENGTH }
      if (m == 9999) { print "GATE-FAIL: no non-blank lines" > "/dev/stderr"; exit 3 }
      print "MININDENT=" m " LINES=" n > "/dev/stderr"
      for (i=1;i<=n;i++) { if (length(buf[i])==0) print ""; else print substr(buf[i], m+1) }
    }'
}
```

**Four properties are load-bearing, and 0154 should carry all four:**

1. **Both anchors are gated, not just the start.** A start-only gate slurps the rest of the file.
2. **A line-count floor *and* ceiling** (36 / 45). The floor is what stops an empty extraction reading
   as a pass; the ceiling catches a runaway end anchor.
3. **Subtract each block's own minimum indent** — never `sed 's/^ *//'`. This is what preserves relative
   nesting (§4c).
4. **The anchor is a literal regex inside the program.** Passing it via `-v` silently breaks it (§4b).

### 5.1 The check bodies, as executed

```sh
# --- CHECK1: flag strings, counts, and `Task N` removal ---
C='Task <NNNN>'"'"'s vault work is complete — ready to close (producer runs /fkit-task-done on ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)'
P='Task <NNNN>: partial — not ready to close (ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)'
fail=0
for f in ingest lint sync; do
  p=claude/skills/fkit-wiki-$f/SKILL.md
  nc=$(grep -c -F -- "$C" "$p"); np=$(grep -c -F -- "$P" "$p")
  [ "$nc" = 1 ] || { echo "FAIL $f: complete-flag count=$nc (want 1)"; fail=1; }
  [ "$np" = 1 ] || { echo "FAIL $f: partial-flag  count=$np (want 1)"; fail=1; }
  if grep -qn 'Task N' "$p"; then echo "FAIL $f: literal 'Task N' still present"; fail=1; fi
done
tot=$(grep -c -F -- "$C" claude/skills/fkit-wiki-*/SKILL.md | awk -F: '{s+=$2} END{print s+0}')
[ "$tot" = 3 ] || { echo "FAIL: complete-flag total=$tot (want 3)"; fail=1; }
[ "$fail" = 0 ] && echo "CHECK1 PASS" || { echo "CHECK1 FAIL"; exit 1; }

# --- CHECK2: the identity rule and its explicit negative ---
fail=0
for f in ingest lint sync; do
  p=claude/skills/fkit-wiki-$f/SKILL.md
  grep -q -F -- 'task folder name'"'"'s four-digit prefix' "$p" || { echo "FAIL $f: no folder-ID definition"; fail=1; }
  grep -q -F -- 'never** the sprint'                        "$p" || { echo "FAIL $f: no explicit negative"; fail=1; }
  grep -q -F -- 'P<n>` Priority cell'                       "$p" || { echo "FAIL $f: P<n> Priority cell unnamed"; fail=1; }
  grep -q -F -- 'priority-is-rank-not-identity.md'          "$p" || { echo "FAIL $f: convention not cited"; fail=1; }
done
[ "$fail" = 0 ] && echo "CHECK2 PASS" || { echo "CHECK2 FAIL"; exit 1; }

# --- CHECK3: uniformity, fail-closed, relative nesting preserved ---
fail=0
for f in ingest lint sync; do
  printf '%-7s ' "$f"; norm < claude/skills/fkit-wiki-$f/SKILL.md > /dev/null || { echo "  (exit $?)"; fail=1; }
done
[ "$fail" = 0 ] || { echo "CHECK3 FAIL: a gate fired"; exit 1; }
a=$(norm < claude/skills/fkit-wiki-ingest/SKILL.md 2>/dev/null)
b=$(norm < claude/skills/fkit-wiki-lint/SKILL.md   2>/dev/null)
c=$(norm < claude/skills/fkit-wiki-sync/SKILL.md   2>/dev/null)
[ -n "$a" ] && [ "$a" = "$b" ] && [ "$b" = "$c" ] \
  && echo "CHECK3 PASS: uniform modulo one uniform offset" \
  || { echo "CHECK3 FAIL"; diff <(printf '%s\n' "$a") <(printf '%s\n' "$c"); exit 1; }
```

⚠️ **Read the stderr line, not just the verdict.** CHECK3's normalized diff is clean whether or not
`sync` was wrongly re-indented — only the `MININDENT` values (**3 / 3 / 0**) catch that.

### 5.2 The five negative controls, as executed

```sh
# NC1 — 0125's real near-miss anchor, hardcoded literally. MUST exit 3.
awk '
  !started && /The wiki \*\*closes nothing/ { started=1; inb=1 }
  inb { buf[++n]=$0 }
  inb && /Run \/fkit-task-done on/ { ended=1; inb=0 }
  END { if (!started) { print "GATE-FAIL: start anchor never matched" > "/dev/stderr"; exit 3 }
        if (!ended)   { print "GATE-FAIL: end anchor never matched"   > "/dev/stderr"; exit 3 }
        if (n < 36)   { print "GATE-FAIL: only " n " lines"           > "/dev/stderr"; exit 3 }
        print "REACHED — NC1 DID NOT FIRE (bug)" }' claude/skills/fkit-wiki-ingest/SKILL.md
echo "NC1 exit=$?"

# NC2 — empty input. MUST exit 3.
printf '' | norm > /dev/null; echo "NC2 exit=$?"

# NC3 — break ONE list item's relative indent (stream only, no file written). MUST differ.
x=$(sed 's|^   - \*\*Fully\*\* → complete\.|    - **Fully** → complete.|' claude/skills/fkit-wiki-ingest/SKILL.md | norm 2>/dev/null)
y=$(norm < claude/skills/fkit-wiki-lint/SKILL.md 2>/dev/null)
[ -n "$x" ] || echo "  (NC3 sanity: mutated extraction was EMPTY — control invalid)"
[ "$x" = "$y" ] && echo "NC3 MISS — check accepted a broken indent (bug)" || echo "NC3 FIRED"

# NC4 — shift the WHOLE sync block by a uniform +2. MUST stay identical (legitimate state).
S=$(grep -n '\*\*The wiki closes nothing' claude/skills/fkit-wiki-sync/SKILL.md | cut -d: -f1)
E=$(grep -n 'Run /fkit-task-done on'      claude/skills/fkit-wiki-sync/SKILL.md | cut -d: -f1)
z=$(awk -v s="$S" -v e="$E" 'NR>=s && NR<=e && length($0)>0 {print "  " $0; next} {print}' claude/skills/fkit-wiki-sync/SKILL.md | norm 2>/dev/null)
[ "$z" = "$y" ] && echo "NC4 GREEN" || echo "NC4 RED (bug: rejected a legal uniform offset)"

# NC5 — does the blanket-strip (0125's R3 defect) still MISS NC3's bug?
p=$(sed 's|^   - \*\*Fully\*\* → complete\.|    - **Fully** → complete.|' claude/skills/fkit-wiki-ingest/SKILL.md | sed -n '51,88p' | sed 's/^ *//')
q=$(sed -n '60,97p' claude/skills/fkit-wiki-lint/SKILL.md | sed 's/^ *//')
[ "$p" = "$q" ] && echo "NC5: blanket-strip says UNIFORM despite broken indent -> R3 fail-open reproduced" \
                || echo "NC5: blanket-strip caught it"
```

**NC1 and NC3 are the two that matter most to a re-user.** NC1 is the control that was itself broken
the first time (§4b) — if it does not exit 3, nothing else in the suite can be trusted. NC3 is the only
control that distinguishes this check from the fail-open one it replaces; NC5 exists purely to show the
old approach still waves NC3's mutation through.

**⚠️ NC5's `sed -n '51,88p'` / `'60,97p'` line ranges are hardcoded to the post-0153 block positions.**
They will drift the moment either file changes above the block. 0154 should derive them from the anchors
instead — this is a known sharp edge in the one-shot form, not a pattern to copy verbatim.

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

> **Corrected 2026-07-27 (review finding R4).** **Those checksums prove stash round-trip integrity and
> nothing more.** They were taken *before* the CHECK6 stash and re-verified *after* the pop, so they
> establish that the stash did not corrupt the files — they say nothing about whether the edits are
> confined to the intended lines. Presenting them as "what replaces the diff-based check" overstated
> them. The reviewer supplied the method that actually does the job, below.

#### The attribution that actually works — reversal (reviewer's method, reproduced firsthand)

Reverse *exactly* the documented edit on the current block — swap the two flag lines back to their
`Task N` forms, then delete the four rule lines and the single blank that precedes them — and measure
what is left:

```sh
sed -n '51,88p' claude/skills/fkit-wiki-ingest/SKILL.md \
 | sed "s|Task <NNNN>'s vault work is complete — ready to close (producer runs /fkit-task-done on ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)|Task N's vault work is complete — ready to close (producer runs /fkit-task-done)|" \
 | sed "s|Task <NNNN>: partial — not ready to close (ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)|Task N: partial — not ready to close|" \
 | awk '
     /^   \*\*`<NNNN>` is the task folder/ { drop=4 }
     drop>0 { drop--; if(drop==0) eat_blank=1; next }
     eat_blank && $0=="" { eat_blank=0; next }
     { eat_blank=0; print }
   '
```

```
REVERSED: count=33  bytes=2296
TARGET  : count=33  bytes=2296   (brief.md:73, recorded before this task began)
0153 artifacts remaining in the reversed block (<NNNN> / <slug> / priority-is-rank): 0
original flag lines restored at relative lines 22 and 23
```

**Why this is stronger than the checksums.** It lands on a number recorded *independently and before the
task started* — `brief.md:73`'s "2296 bytes, 33 lines each". Reversing the documented edit and hitting
that pre-state exactly proves the in-block change surface is **exactly** the two flag lines plus the
rule paragraph, and nothing else. **I had both numbers in §2 and never closed the loop between them.**
Credit to the reviewer.

> **⚠️ The "0125 is uncommitted" reason above is now stale — and the replacement reason is *not* better.**
> Re-checked 2026-07-27 after the owner committed at **`994e3e3`**: the working tree is clean and the
> three SKILLs are identical to `HEAD`. But `git diff` **still cannot attribute this change**, for a new
> reason — `994e3e3` ("Tasks update") added **0125's block and 0153's change in a single commit**
> (`ingest +42`, `lint +42`, `sync +48/-1`), and its parent `b86e5eb` has **no block at all**
> (block-anchor count 0 → 1 across the pair). So the driver's statement that "`git diff` is now a usable
> attribution tool again" is **incorrect**: fusing the two tasks into one commit removed the last
> opportunity to separate them by diff. **The reversal method above remains the only working
> attribution**, and it is unaffected by any of this because it works off the file's current content,
> not its history.

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
between. **0154's author should assert the strings exactly as reproduced in §3** — and can lift
CHECK3's normalize-by-own-min-indent extractor and all five negative controls directly: the runnable
implementations are in **§5.0–§5.2**, each with its required outcome, plus the two sharp edges (the
`awk -v` trap, and NC5's hardcoded line ranges) called out in place.

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

## 7b. Why this task's status read `🔲 Backlog` for the whole build — a driver bookkeeping lapse

For the entire build **and** the whole review round, `0153`'s `## Status` field and its sprint-2 board
row both read **`🔲 Backlog`**. The driver should have moved both to `🔄 In progress` before driving the
task and did not; it corrected them at the start of the process-review round. Both now read
`🔄 In progress` (verified: `brief.md:13`, and the board row at `sprint-2.md:149`).

**Nothing produced here is affected** — no check, measurement, edit or verdict read the status field.
Recorded only so the record is accurate about *why* the status lagged reality, rather than leaving a
future reader to infer that the work started without the board knowing. The lapse is the driver's, not
the coder's, and the fix was the driver's too.

## 8. Residuals and what is deliberately left open

1. **The block is still prose enforced by nothing.** The ADR-018 hook never opens a `SKILL.md`
   (`grep -n 'SKILL.md' claude/skill-ownership-hook.sh` → no hits) and no test reads one. Deleting the
   entire block, in all three files, turns nothing red. **Closing that is task 0154's job, not this
   one's** — building a test here would have widened scope past the approved plan.
2. **0125's R3 residual is not closed by this task.** The fail-closed check in §5 was run by hand; it is
   not committed anywhere. Only 0154 discharges R3, per the owner's SUBSUME ruling.
3. ~~**The convention file this text cites is itself uncommitted.**~~ **RESOLVED 2026-07-27.** Both homes
   of `priority-is-rank-not-identity.md` — the live copy and the `claude/scaffold/` copy — are now
   **TRACKED**, verified by `git ls-files --error-unmatch` on both paths after the owner's commit
   `994e3e3`. The citation resolves from `HEAD` and ships to consuming projects. The residual is closed,
   not merely aged out; recorded rather than deleted so the earlier caveat is not left dangling.
4. **Uniformity across the three files remains a human obligation.** The three blocks must be kept
   identical modulo the indentation offset; nothing mechanical holds that today.
