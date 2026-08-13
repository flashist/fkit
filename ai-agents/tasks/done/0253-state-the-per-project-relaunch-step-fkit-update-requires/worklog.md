# Worklog — 0253: state the per-project re-launch step `fkit update` requires

**Agent:** `fkit-coder`, spawned as the **Build worker** of `/fkit-sprint-ship-loop`
**Date:** 2026-08-13
**Approved plan:** `plan.md` in this folder — blob `1c3ffd8fd1f658329b902c874e4b54df4de6bf7f`,
21616 bytes. **Verified from my side**: `git hash-object` and `wc -c` on disk both match the
driver's declared values exactly. (The driver noted nothing checks this yet — 0204's carry-check
hook is not landed. I checked it anyway; it agrees.)

**Change surface:**

1. `README.md` — new paragraph after `:33`, plus the two-line `:35-36` correction
   (Build step), plus R1's source-checkout clause (Round-1 process-review step)
2. this `worklog.md`
3. `review.md` — the *Coder response* and *Accepted residuals* sections only
   (Round-1 step; the *Reviewer findings* section is untouched)

No commit, no push, no task-file move, no re-rank. Nothing under `claude/`, `bin/`, `install.sh`,
`RELEASING.md`, or `ai-agents/wiki-vault/` was touched.

---

## Owner rulings, as honored

| Ruling | How it landed |
|---|---|
| 1. Placement: **following paragraph**, `:31-33` byte-identical | New paragraph inserted after `:33`. `diff` of `:31-33` against `HEAD` → **identical**. |
| 2. `:35-36` **yes, minimal fix** | `` `fkit update` and `` deleted; "they never rewrite" → "it never rewrites". **Exactly two lines changed.** The paragraph's real subject (`ai-agents/` is never rewritten) and its whole remaining body are untouched. |
| 3. `FKIT_SETUP_ONLY=1 fkit` **yes**, one sentence | Present, in §2's wording, as the paragraph's last sentence. |
| 4. **No `RELEASING.md` pointer** | None added. `grep -c RELEASING README.md` → 0. |

---

## Verification — plan §4, steps 0-7

⚠️ **The outputs below are from the BUILD step**, before Round 1's R1 clause landed. Steps 1, 2, 3,
5, 7 and `npm test` were **re-run after** that edit; the re-run outputs are in "Round 1 — re-verification"
near the end of this file. Line numbers quoted below are the Build-step ones and shifted by the
clause.

### Step 0 — baseline `npm test`, run BEFORE any edit

```
ℹ tests 723
ℹ suites 17
ℹ pass 723
ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
real 456.46
EXIT=0
```
**Measured runtime: 456.46 s** (`/usr/bin/time -p`, wall clock). Not an estimate.

### Step 1 — blast radius

```
$ git diff --stat -- README.md
 README.md | 11 +++++++++--
 1 file changed, 9 insertions(+), 2 deletions(-)
```
(7 added lines — the 6-line paragraph plus its blank separator — and the 2 rewritten `:35-36`
lines, which the stat counts as 2 deletions + 2 of the insertions.)

⚠️ **`git diff --stat` unscoped shows 25 files, not 1.** The other 24 are **not mine.** The prompt's
`gitStatus` snapshot said the tree was clean; it was stale. Proof by mtime: every one of the 24 has
an mtime at or before `19:33:42` (wiki sync, brief/sprint edits from this loop's earlier steps),
while my session's first command ran at `19:35:03` and my only write to `README.md` landed at
`19:42:54`. `bin/release.mjs` — the one non-`ai-agents/` file in that set — is from `17:06:55`,
hours before this worker existed. **I wrote exactly the two files listed above.**

### Step 2 — preservation (strong form)

```
$ git diff -U0 README.md | grep '^-' | grep -v '^---'
-**One thing an update does not repair.** `fkit update` and a launch refresh replace the agents and
-skills under `.claude/` — they never rewrite your project's own content under `ai-agents/`. If your
```
**Exactly the two `:35-36` lines and nothing else.** Everything else is a pure addition.

```
$ diff <(git show HEAD:README.md | sed -n '31,33p') <(sed -n '31,33p' README.md)
(no output — IDENTICAL)
```
Plus the three preservation greps, all hit: `FKIT_NO_UPDATE_CHECK=1` (`:33`),
`update it with `git`` (`:33`), `a throttled check and **tells you**` (`:31`).

### Step 3 — new content present (plan's literal greps, all three hit)

```
36:stops there. Each project picks up the new agents and skills the **next time you launch
39:**old agents and skills, and nothing tells you**. Want the refresh without opening a session? Run
40:`FKIT_SETUP_ONLY=1 fkit` in the project.
```

### Step 4 — claim-support sweep (each sentence read next to its evidence)

| Sentence in the new paragraph | Evidence re-read from disk today | Supports? |
|---|---|---|
| "It refreshes the installed copy and stops there." | `fkit-claude.sh` update arm: `_fkit_reinstall` then `exit 0`, reached **before** the init call at `:358`. `install.sh` writes `SHARE` (`:20`), `BIN` (`:21`) and a `mktemp -d` scratch dir `TMP` (`:27`, `:31`, trap-cleaned at `:28`); **none of them is a consuming project**, which is the load-bearing part. | ⚠️ **corrected in R1 — see below** |
| "the **next time you launch `fkit` in that project** — that launch is what rewrites its `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/`" | `fkit-claude-init.sh:481-488` — `rm -f .claude/agents/fkit-*.md` + `cp`, then `rm -rf` each `.claude/skills/fkit-*/` + `cp -R`. Exactly the two globs the sentence names. | ✅ |
| "only on launch" (implied by the above) | Complete set of **programmatic** callers of `fkit-claude-init.sh`: `fkit-claude.sh:358` and `:360` (both launch-time), and `install.sh:44`, which only `chmod +x`s it. **Bounded claim, narrowed after review (R4):** this covers callers *inside the codebase* only. The script also supports **direct human invocation** — `fkit-claude-init.sh:19` documents `claude/fkit-claude-init.sh <project-root>`, and this repo's own `CLAUDE.md` instructs exactly that — so a refresh is reachable without a launch. A caller added later would also falsify it. **The shipped README is unaffected: it never says "only on launch".** | ✅ as narrowed |
| "keeps its **old agents and skills, and nothing tells you**" | `grep -c '^\.claude' claude/structure-manifest.tsv` → **0**. `grep -c '\.claude' claude/structure-spec.md` → **0**. `structure_notice \|\| :` at `:507` runs **after** the `:358` refresh, so it can only ever read clean. The refresh is `>/dev/null` on an already-set-up project (`:358`), so even its own `• refreshed N agents…` line is swallowed. | ✅ |
| "Run `FKIT_SETUP_ONLY=1 fkit` in the project." | `:511-515` exits after setup and **before** both the menu (`:596`) and the `exec claude` (`:645`). Public and help-documented at `:190`. **Extra check the plan did not make:** bare `fkit` with no args reaches setup — the usage-error guard at `:235` fires only when args remain after role parsing — so the command as written does refresh and exit with no interactive prompt. | ✅ |

### Step 5 — citation-token sweep

```
$ git diff -U0 README.md | grep '^+' | grep -oE '[A-Za-z0-9_./-]+\.(sh|md|mjs|js|tsv):[0-9]+(-[0-9]+)?'
(empty — exit 1)
```
**EMPTY, as required.** The added text carries **no `file:line` citation at all** — only stable path
globs (`.claude/agents/fkit-*.md`, `.claude/skills/fkit-*/`) and one public env var. This is the
direct defense against 0252's failure mode.

### Step 6 — `npm test` neutrality re-run

```
ℹ tests 723
ℹ pass 723
ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
real 460.49
EXIT=0
```
**Measured runtime: 460.49 s.** Counts `diff`-identical to the Step 0 baseline (723/723/0, same hard-gate line).

⚠️ **This is a NEUTRALITY check, not evidence the prose is right.** The root `README.md` is not in
`structure-manifest.tsv` (its only `README` rows are `ai-agents/README.md`,
`ai-agents/knowledge-base/conventions/README.md`, `ai-agents/reviews/README.md`,
`ai-agents/tasks/README.md`), not in `structure-spec.md`, and not dual-homed — the dual-home
exception list scopes its `README.md` entry to the two `ai-agents/` homes. So this edit **cannot**
move any test. **Steps 4-5 are the real verification.**

**Both runtimes measured, not estimated: 456.46 s and 460.49 s** — consistent with the owner's
"roughly 6-8 minutes, machine-dependent" range.

### Step 7 — width

13 lines over 100 now, 14 before. **Zero new over-100 lines** (`comm -13` of the pre- and post-edit
sorted sets → empty). The count *fell* by one because the `:35` minimal fix shortened a line that
was previously 101.

---

## Decision log — ADR-019 / ADR-032 autonomy record

Fixes applied without asking, and obvious-winner calls, each with why it qualified.

### 1. OBVIOUS-WINNER CALL — re-wrapped the new paragraph's soft line breaks

**Which point it answers:** plan §4 Step 7 (no new over-100 lines) vs plan §2's own displayed
paragraph block, which the owner's ruling 1 told me to use.

**What changed:** the new paragraph's **line breaks only**. Every word is identical to §2's block,
in the same order — verified programmatically (`" ".join(...)` equality). Markdown soft breaks
inside a paragraph render as spaces, so the **rendered output is unchanged**.

**Why it was needed:** §2's block as printed does not satisfy §4 Step 7. Its lines measure
99/103/99/101/83 **bytes** (99/101/99/101/83 characters), so shipping it verbatim added two
over-100 rows and went red on Step 7 — while §2's own closing note says "wrap at ≤100 characters".
**The plan contradicts itself**; only a re-wrap satisfies both halves.

**Why it qualified as an obvious winner within the plan's intent:** I evaluated three candidates,
and only one has no red step —

| Candidate | Step 3 (literal greps) | Step 7 (no new >100) |
|---|---|---|
| A — §2's block verbatim | ✅ | ❌ two new rows |
| B — naive greedy 100-byte wrap | ❌ split "…nothing tells / you**" across lines, so the plan's literal grep misses | ✅ |
| C — **shipped**: wrap computed under both constraints | ✅ | ✅ |

C was found by a DP over line breaks minimizing raggedness subject to (all lines ≤100 bytes) AND
(the phrase `old agents and skills, and nothing tells you` unbroken). It is word-identical and
render-identical. **Cost, stated plainly:** its lines run 86-88 characters rather than the ~99 of
the surrounding prose, and it is 6 lines rather than 5. Purely cosmetic; invisible once rendered.

**Ruling 1 read as satisfied:** it says "use that wording" — wording is the words, and the words are
byte-for-byte §2's. It also fixes the placement (after `:33`), which C honors.

⚠️ **Flagged for the reviewer as the one place the shipped bytes differ from the plan's printed
block.** I did not treat this as silent.

### 2. No other fix was applied without asking (Build step).

Nothing else in the Build step. No `NEEDS-DECISION` was raised — the only judgment call was item 1
above, which resolved to a single candidate with no failing check.

---

## Round 1 review — Process-review step (2026-08-13)

Ledger: `review.md`. **Verdict: ⚠️ Changes requested — 1 low defect, none blocking.** Owner ruled on
all five findings via `AskUserQuestion` in the driver session. My verdicts and evidence are in the
ledger's *Coder response* section; the shipped consequences are here.

### 3. R1 — DEFECT, CONFIRMED, FIXED (owner ruling: "Add a short clause")

**Which finding it answers:** R1 — *"It refreshes the installed copy and stops there"* is false in a
source checkout.

**Verified independently before fixing** (I did not take the reviewer on trust):
`_fkit_is_source_checkout` is `[ -d "$share/.git" ] || [ -f "$share/package.json" ]`
(`claude/fkit-claude.sh:77`), and `$share` is *"install root (~/.local/share/fkit), or the repo root
in a checkout"* (`:68`). The `update` arm tests it **first** (`:111`) and on a hit prints
*"fkit: this is a source checkout ($share) — update it with 'git pull'."* and **`exit 1`**
(`:112-113`). So in a checkout it refreshes nothing and stops with an error — the finding is right.
`README.md:33`'s existing carve-out genuinely does not cover this: it is about the **auto-check**
(`:126` gates the throttled check on the same predicate), not about the `update` verb failing.

**What changed:** one parenthetical clause after the affected sentence —
*"(In a checkout of this repo it refuses and points you at `git pull`.)"* — tone-matched to `:33`'s
existing `(Silence it with `FKIT_NO_UPDATE_CHECK=1`.)` carve-out. The paragraph was re-wrapped again
to absorb it; **words are otherwise unchanged.**

**Why it qualified for autonomous application:** verified `CORRECT` against disk, mechanical and
localized (one clause, one paragraph), and squarely inside the owner's ruling, which prescribed both
the fix and its shape.

**The three constraints the clause had to not break, all re-run and green:** Step 7 ≤100 on **both**
byte and character counts (paragraph now 99/95/97/95/97/71 bytes, 99/95/95/95/97/71 chars); Step 3's
three literal greps (`next time you launch`, `old agents and skills, and nothing tells you`,
`FKIT_SETUP_ONLY=1 fkit`) all still hit on a single line each; Step 5's citation sweep still
**empty** — the clause introduces no `file:line`. The wrap was again computed under all constraints
simultaneously rather than guessed.

### 4. R4 / R5 — worklog evidence corrections (owner ruling: "Correct 0253's worklog")

Both verified against disk **before** correcting, since a correction that is itself wrong is this
session's most repeated failure mode:

- **R5 — confirmed.** `install.sh:27` `TMP="$(mktemp -d)"` and `:31` `mkdir -p "$TMP/src"` are real
  writes, so my *"`SHARE` and `BIN` are its only write targets"* was **false as written**. Step 4's
  first row now names all three and keeps the conclusion that mattered — none is a consuming project.
  **No shipped-prose consequence:** the README never enumerates install targets.
- **R4 — confirmed.** `claude/fkit-claude-init.sh:19` reads
  `# Usage:  claude/fkit-claude-init.sh <project-root>`, and this repo's `CLAUDE.md` instructs that
  exact invocation. My *"complete caller set"* / *"only on launch"* was **overbroad** — true of
  programmatic callers, not of humans. Step 4's third row now says so. **No shipped-prose
  consequence:** the README never claims "only on launch", and it offers `FKIT_SETUP_ONLY=1 fkit`
  as an explicit non-session path.

### 5. R2 / R3 — accepted residuals, nothing changed

Owner ruling: "Accept both as residuals." ⛔ No edit made to `README.md:26-27` or `:47-54`; both
verified byte-identical to `HEAD` after my R1 edit. Reasoning recorded in the ledger's
*Accepted residuals* section — in short, R2's obvious remedy would **pre-empt task `0255`**, the open
architect decision on whether `.claude/` enters the conformance surface, which `plan.md:62`
deliberately avoided; and R3 is imprecision the plan already weighed and left.

---

## Corrections to the plan — facts that did not survive re-checking

The driver instructed me to re-derive the plan's line numbers and to **say so** where a fact is
wrong rather than write a claim I could not verify. **⛔ I did not edit `plan.md`** (forbidden);
these are recorded here instead.

1. **FALSE — plan §2, last bullet: "README's only >100-char lines are bare ADR URLs and table rows."**
   Of the 14 pre-existing over-100 lines, only **2** are ADR URLs (`:41`, `:74`), **2** are table
   rows (`:61`, `:63`), and **2** are inside the `Layout` code block (`:94`, `:95`). The other
   **8 are ordinary prose** — `:26`, `:31`, `:32`, `:36`, `:43`, `:44`, `:47`, `:67` — including
   `:31` and `:32`, which are the very "Staying current" paragraph this task extends. This false
   premise is what made §2's own paragraph exceed its own wrap rule.

2. **AMBIGUOUS, and it changes a verdict — plan §4 Step 7's `awk 'length>100'` counts BYTES, not
   characters, on this machine.** `LC_CTYPE=UTF-8`, but macOS `awk` measures bytes, and every em
   dash in this README is 3 bytes. Line `:32` reads as 102 by that check and is 100 characters. I
   held the shipped paragraph to **≤100 on both counts**, so the distinction cannot flatter it.

3. **Imprecise, harmless — plan §0/§5 cite the update arm as `:109-123`** (the driver's marker said
   `:109-124`). Measured: `case` opens at `:109`, `exit 0` is at `:121`, the arm ends `:123`, `esac`
   is `:124`. Every claim built on it holds; only the range label wobbles.

Everything else in the plan re-checked **correct**, including all of §0's table: `README.md:31-33`,
`fkit-claude-init.sh:479-490`, the caller set, the manifest/spec zero-counts, and `:507`/`:190`.

---

## Round 1 — re-verification after the R1 clause (real output, re-run)

```
$ git diff --stat -- README.md
 README.md | 11 +++++++++--
 1 file changed, 9 insertions(+), 2 deletions(-)

$ git diff -U0 README.md | grep '^-' | grep -v '^---'
-**One thing an update does not repair.** `fkit update` and a launch refresh replace the agents and
-skills under `.claude/` — they never rewrite your project's own content under `ai-agents/`. If your

$ diff <(git show HEAD:README.md | sed -n '31,33p') <(sed -n '31,33p' README.md)
(no output — IDENTICAL)

$ grep -n "next time you launch" README.md
37:new agents and skills the **next time you launch `fkit` in that project** — that launch is what
$ grep -n "old agents and skills, and nothing tells you" README.md
39:never re-launched in keeps its **old agents and skills, and nothing tells you**. Want the refresh
$ grep -n "FKIT_SETUP_ONLY=1 fkit" README.md
40:without opening a session? Run `FKIT_SETUP_ONLY=1 fkit` in the project.

$ git diff -U0 README.md | grep '^+' | grep -oE '…\.(sh|md|mjs|js|tsv):[0-9]+(-[0-9]+)?'
(empty — exit 1)

over-100 count: 13    NEW over-100 vs HEAD: (empty)
paragraph widths: 99/95/97/95/97/71 bytes · 99/95/95/95/97/71 chars
:26-27 vs HEAD: IDENTICAL     structure paragraph vs HEAD: IDENTICAL (shifted by 7 lines)
```

```
ℹ tests 723
ℹ suites 17
ℹ pass 723
ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
real 442.85
EXIT=0
```
**Measured runtime: 442.85 s.** Three measured runs now: **456.46 / 460.49 / 442.85 s** — consistent
with the owner's "roughly 6-8 minutes, machine-dependent". ⚠️ Still **my own** measurements; the
reviewer did not reproduce them, and the tree carries other tasks' changes. Still a **neutrality**
check only.

## Out of scope — reported, not fixed

- **`claude/fkit-claude.sh:101-102`** — `FKIT_REPO=… FKIT_REF=… curl … | sh`. In a POSIX pipeline
  the assignment prefix binds to **`curl`**, not to the `sh` after the pipe, so a non-default pin is
  lost. Re-confirmed on disk today. **Owned by task `0284` — not fixed here**, and deliberately
  **absent from the README wording**: the README describes intended default behavior, and the
  default case is unaffected because the defaults coincide (`flashist/fkit@main`).
- **`install.sh:110`** — prints the same "update fkit and you're done" gap in a code file.
  **Reported, not fixed** (out of the approved surface).
