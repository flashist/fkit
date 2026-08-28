# Worklog — 0154: build `test/wiki-flag-convention.test.js`

**Build worker**, spawned by `/fkit-sprint-ship-loop` (fkit lead, live session, Sprint 6 — the sprint's
last row). Implemented the approved `plan.md` (blob `974bcee98767d227ec217fdb9a0f02615690316a`,
confirmed by `git hash-object` before any work). Owner approved the plan and rulings ND-1/ND-2/ND-3
via `AskUserQuestion` in the driver session, 2026-08-28; those rulings are `plan.md` §9.

**Not done, deliberately:** no commit, no push, no task file moved, no `plan.md` edit, no `SKILL.md`
edit, no `devDependency`, nothing under `ai-agents/wiki-vault/`.

---

## Step 0 — re-derive every constant from disk (never from the plan text)

The driver's instruction and the brief both require deriving the anchors from the live text rather
than copying them. Done with a throwaway probe (scratchpad, not committed). **Every figure the plan
records was reproduced exactly.**

| Measured on disk 2026-08-28 | ingest | sync | lint | plan §0.2/§0.3 says | match |
|---|---|---|---|---|---|
| block line range | 54–94 | 99–139 | 63–103 | 54–94 / 99–139 / 63–103 | ✅ |
| block length (lines) | 41 | 41 | 41 | 41 | ✅ |
| indents present | 3, 5 | 0, 2 | 3, 5 | 3,5 / 0,2 / 3,5 | ✅ |
| min indent | 3 | 0 | 3 | 3 / 0 / 3 | ✅ |
| block bytes | 2936 | 2834 | 2936 | 2936 / 2834 / 2936 | ✅ |
| `dedent(ingest) === dedent(sync)` | — | — | — | true | ✅ true |
| `dedent(ingest) === dedent(lint)` | — | — | — | true | ✅ true |

**One reconciliation worth recording.** My first probe reported 2902 / 2800 / 2902 — exactly 34 below
the plan's figures in all three files. That was a measurement artifact, not drift: JavaScript
`String.length` counts UTF-16 code units, and the block contains 34 bytes' worth of multi-byte
characters (`—`, `→`, `⛔`). Re-measured as bytes (`sed -n '<range>p' … | wc -c`, less the trailing
newline): **2936 / 2834 / 2936**, the plan's numbers exactly. `ingest` and `lint` byte-identical;
`sync` smaller by 102 = 3 × 34 non-blank lines, which is the plan's own "one uniform 3-space offset"
arithmetic. No `NEEDS-DECISION` was warranted.

**The §0.3 raw-vs-normalized hit table, reproduced exactly** (this is the measurement that makes the
two-match-mode design a correctness requirement rather than a preference):

| subject | raw hits (each of the 3 files) | normalized hits (each) |
|---|---|---|
| A1 complete-flag line | 1 | 1 |
| A2 partial-flag line | 1 | 1 |
| A3 hard-rule bullet | **0** | 1 |
| A4 R2 third branch | 1 | 1 |
| A5 R5 clause | **0** | 1 |

A single-line matcher would report A3 and A5 missing in all three files — six false negatives on live
text. Confirmed on today's text.

**Constants as built** — all identical to `plan.md` §1.2 after derivation:

- `FLAG_COMPLETE` = ``- complete → `Task <NNNN>'s vault work is complete — ready to close` `` (raw)
- `FLAG_PARTIAL` = ``- partial or uncertain → `Task <NNNN>: partial — not ready to close` `` (raw)
- `HARD_RULE` (flat), `R2_BRANCH` (flat), `R5_CLAUSE` = `do not spawn the producer to close it yourself.` (flat)
- `BLOCK_START` = `/\*\*The wiki closes nothing/`, `BLOCK_END` = `/stops the flag rotting when the folder moves boards\./`
- `MIN_BLOCK_LINES` = 30 (live is 41 — a gate, not a pin)

---

## Step 1 — write `test/wiki-flag-convention.test.js`

New file, 10 tests (T0–T9 per plan §2), matcher per §1.3, algorithm per §2.1, header per §3.
Env seam `FKIT_WIKI_FLAG_ROOT` with a stderr announcement on a non-default root (the
`FKIT_FRONTMATTER_ROOT` whole-tree pattern). Three named paths, no walk (ND-1). T0 included (ND-2).
No shared helper module, no generalized extractor — the reusable pattern is named in the header only
(ND-3).

## Step 2 — the new test alone

```
node --test test/wiki-flag-convention.test.js
✔ roster: claude/skills holds exactly the three fkit-wiki skills
✔ all three: the complete-flag line is byte-identical, exactly once
✔ all three: the partial-flag line is byte-identical, exactly once
✔ all three: the hard-rule bullet (ADR-033, wiki holds no movers) is present
✔ all three: the R2 third branch — unrelated → say nothing at all
✔ all three: the R5 clause — do not spawn the producer to close it yourself
✔ extraction fails closed: no anchor / reversed / short block all THROW
✔ uniformity: identical modulo ONE uniform offset
✔ uniformity rejects a NON-uniform offset (broken list-item indent)
✔ uniformity ACCEPTS a whole-block uniform shift
ℹ tests 10  ℹ pass 10  ℹ fail 0
```

No skip list, nothing grandfathered, no `todo`.

⚠️ **The transcript above is verbatim from that run and is deliberately NOT rewritten.** One test in it
has since been **renamed**: `extraction fails closed: no anchor / reversed / short block all THROW` is
now `extraction fails closed: missing / duplicated / reversed anchors and a sub-floor block all THROW`,
after round-1 review R1 added the two duplicate-anchor cases (owner-ruled 2026-08-28; see the
Process-review decision log below). Editing a captured run's output to match a later rename would make
the record say something the run did not print.

## Step 3 — prove it can fail **five times, one per assertion A1–A5**

Plan §5 step 3 / verification step 2. Each proof mutated the subject in **one** file only, inside a
`cp -R` copy of `claude/` reached through `FKIT_WIKI_FLAG_ROOT` — **the real tree was never edited at
any point in this step**, which is also how step 4 below stays clean. Each mutation was checked for
being a no-op (`cmp -s` against a kept `.orig`) before its result was believed. All five:

| # | subject | file mutated | mutation | result |
|---|---|---|---|---|
| A1 | complete-flag line | `fkit-wiki-ingest` | reworded to ``- complete → `Task <NNNN> is done` `` | ✅ RED at *"the complete-flag line is byte-identical"*, naming `fkit-wiki-ingest` |
| A2 | partial-flag line | `fkit-wiki-sync` | line deleted | ✅ RED at *"the partial-flag line is byte-identical"*, naming `fkit-wiki-sync` |
| A3 | hard-rule bullet | `fkit-wiki-lint` | *"does not hold the task movers (ADR-033)"* → *"may hold the task movers"* | ✅ RED at *"the hard-rule bullet"*, naming `fkit-wiki-lint` |
| A4 | R2 third branch | `fkit-wiki-ingest` | *"say nothing about it at all."* → *"flag it partial."* | ✅ RED at *"the R2 third branch"*, naming `fkit-wiki-ingest` |
| A5 | R5 clause | `fkit-wiki-sync` | *"spawn the producer to close it yourself."* → *"spawn anyone."* | ✅ RED at *"the R5 clause"*, naming `fkit-wiki-sync` |

**Five for five. No assertion is untested.** Each red named both the file and the assertion, so a red
run needs no grep. The A5 message, verbatim from the run:

```
AssertionError [ERR_ASSERTION]: T5: claude/skills/fkit-wiki-sync/SKILL.md — expected exactly 1
occurrence of the R5 clause (the fourth forbidden act) "do not spawn the producer to close it
yourself." (whitespace-normalized), found 0.
This is the fourth forbidden act, and it sits next to a ready-to-run `@fkit-producer` line on a path
the ADR-018 hook PERMITS — so prose is the only thing stopping it. ⛔ It pins CURRENT ADR-033 policy:
do not drop, weaken, or invert this assertion. It wraps across two source lines, so the match is
whitespace-normalized; raw finds it ZERO times.
⚠️ If this text was DELIBERATELY reworded, update R5_CLAUSE in this file as part of that same change.
Do NOT relax the assertion to turn a red run green.
```

That is plan §2's message template, exactly.

Noted, not a defect: the A5 mutant also reds T7 (uniformity), because deleting text from one copy
genuinely does break uniformity. Five assertions went red in that run; the check is that the **named**
one is among them, which it is.

**⚠️ CORRECTED 2026-08-28 (Round-1 Verify pass) — that line UNDERSTATED the side-effect by three
cases.** It is not A5 alone. **A1, A2 and A4 each red T7 as well**, for the same reason and with the
same innocence. **A3 is the only one that does not.** The rule is positional, and it is worth stating
because it is the actual invariant: **A1, A2, A4 and A5 all live INSIDE the flag block, so changing
one in one copy genuinely breaks uniformity; A3 lives OUTSIDE it, under `## Hard rules`, so it cannot
touch T7.** Measured today against `fkit-wiki-sync` (block at lines 99–139): A1 at 120 → reds T1 + T7;
A2 at 121 → reds T2 + T7; A4 at 115 → reds T4 + T7; A3 at **145**, outside → reds T3 **only**. The
per-assertion red-first proofs above are unaffected — each named assertion did go red — but a reader
should not infer that four of the five mutations are T7-silent.

## Step 4 — `git status`: no `SKILL.md` modified (verification step 8)

```
$ git status --porcelain claude/skills/fkit-wiki-ingest claude/skills/fkit-wiki-sync claude/skills/fkit-wiki-lint
(empty)
```

**The three wiki `SKILL.md` files are unmodified.** Every mutation above lived in a `mktemp -d` copy.

⚠️ **Six *other* `SKILL.md` files show as modified** (`fkit-adversarial-review`,
`fkit-process-stateful-review`, `fkit-review`, `fkit-stateful-review`, `fkit-task-done`,
`fkit-task-ship-loop`), along with `bin/release.mjs`, three `claude/agents/*.md`, and `test/prove-red.sh`
itself. **None of these is mine.** Their mtimes (16:08, 18:14, 18:55 …) all predate my first write
(19:38), and they are pre-existing uncommitted Sprint 6 work. The `gitStatus` snapshot in my spawn
context was stale — it listed far fewer modified files than the tree actually held. Recording this
because it matters for reading my change surface, and because I checked rather than assumed.

## Step 5 — mutations 27 and 28 in `test/prove-red.sh`

Added, with the header index updated in the same edit (plan §4's explicit warning):

- **`TWENTY-SIX` → `TWENTY-EIGHT`** in the header count.
  **⚠️ CORRECTED 2026-08-28 (Round-1 Verify pass).** The landed value `TWENTY-EIGHT` is right; the
  recorded *delta* was not. Against **HEAD** the diff reads **`TWENTY-FOUR` → `TWENTY-EIGHT`**
  (`git show HEAD:test/prove-red.sh` line 20 = `TWENTY-FOUR`). The tree already read `TWENTY-SIX` when
  I first saw it because task 0300's **uncommitted** mutations 25/26 had moved it — so `TWENTY-SIX` was
  a working-tree value, not the baseline. Recorded because it is exactly the kind of figure a later
  reader would take as the diff.
- Two index lines added for 27 and 28.
- `run_wiki_flag_suite()` added beside `run_frontmatter_suite()` (seam: `FKIT_WIKI_FLAG_ROOT`).
- **Step `0m`** added: an unmutated copy's wiki-flag suite must be green first.
- **Mutation 27** — delete the R5 clause in `fkit-wiki-sync` only → must red *"the R5 clause"*.
  Guards: `cmp -s` no-op guard, plus a survivor check (`grep -c` of the clause must be 0).
- **Mutation 28** — push `- **Fully** → complete.` two spaces out of step in `fkit-wiki-lint` only →
  must red *"uniformity: identical modulo ONE uniform offset"*. Guards: `cmp -s` no-op guard, plus a
  changed-line count that must be exactly 1 (a re-indent hitting more than one line proves the wrong
  thing).

Both anchors were verified unique in their target file before use (`- **Fully** → complete.` occurs
once in `fkit-wiki-lint`; the R5 fragment occurs once in `fkit-wiki-sync`).

Both were then exercised standalone before the full run:

```
27 mutation landed / 27 survivors: 0 / 27 red / 27 ✓ named assertion
28 mutation landed / 28 changed-line count: 1 / 28 red / 28 ✓ named assertion
```

**One repair worth recording.** My first attempt to insert the two index lines used `perl -i -pe` with
a `\x{2192}` literal; perl emitted a *"Wide character in print"* warning and **double-encoded the `→`
on the adjacent line 52** (`\xe2\x86\x92` → `\xc3\xa2\xc2\x86\xc2\x92`), corrupting a line belonging to
mutation 26 (task 0300). Caught immediately by a mojibake grep, repaired byte-exactly in Python, and
re-verified: the file decodes as clean UTF-8 and no `â` remains. **Damage was one line and it is
undone**; recorded because a silent encoding corruption in the red gate is exactly the class of thing
this repo's own conventions say to surface rather than quietly fix.

## Step 6 — `npm test`

`npm test` = `node --test test/*.test.js && bash test/prove-red.sh`. Run **after every source and test
edit was complete**; the only write that followed it is this worklog section.

**Unit suite — against the 782 baseline I measured before starting:**

```
ℹ tests 792   ℹ suites 24   ℹ pass 792   ℹ fail 0
ℹ cancelled 0 ℹ skipped 0   ℹ todo 0     ℹ duration_ms 91924.673625
```

**782 → 792, +10, all passing. The +10 is exactly this task's T0–T9.** Zero failures, zero skipped,
zero todo — no test was disabled or grandfathered to get here.

**Prove-red hard gate — the three lines this task added or must satisfy:**

```
0m. unmutated copy wiki-flag-convention suite should be green ... green
27. R5 clause deleted in ONE file — "the R5 clause" should go RED ... red
28. one list item re-indented — "uniformity: identical modulo ONE uniform offset" should go RED ... red

✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

No `✗` line anywhere in the gate output; **no mutation reported as a no-op**, including the 26 that
predate this task. `EXIT=0`.

## Step 7 — `git diff package.json` empty (verification step 5)

```
$ git diff package.json
(empty)
$ grep -n devDependencies package.json
(none)
```

ADR-014's zero-devDependencies policy holds: `package.json` has no `devDependencies` key and gained
none. Nothing was installed.

## Step 8 — no `.claude/` path, no `path:NNN` (verification steps 6 and 10)

- **No `.claude/` path is constructed or read.** The three paths are explicit
  `claude/skills/fkit-wiki-*/SKILL.md` joins off `ROOT`; there is no glob that could reach the mirror,
  and the suite depends on nothing `fkit-claude-init.sh` writes (it passes in a fresh clone).
  ⚠️ Stated precisely: the **string** `.claude/skills/` does appear **twice, in the header comment
  only**, where plan §3 explicitly requires the header to explain why the gitignored mirrors are *not*
  read. That is the approved plan's own wording, not a stray reference.
- **No `path:NNN` coordinates** — verified by grep for `<file>.<ext>:<digits>`: none.

---

## Decision log — things applied without asking, and why each qualified

Per ADR-019's audit obligation, carried to this spawn by ADR-032. Three entries.

1. **Removed two `path:NNN`-shaped coordinates I had just written into the test header.**
   *Which finding it answers:* my own step-8 self-check. The header I first wrote said the flag lines
   *"sat at ingest:72 / lint:81 / sync:116"*, and cited *"harness.mjs:9's rule"*.
   *What changed:* the three historical coordinates were replaced with prose making the same point
   (the block has already moved once since 0153, so coordinates pinned then would be wrong today);
   `harness.mjs:9` became `harness.mjs's rule ("nothing here writes into the repo")`, which is the form
   `conventions/durable-citation-anchors.md` requires and the form `test/skill-frontmatter.test.js`
   itself uses.
   *Why it qualified:* **not a frontier-move — a correction back into the approved plan.** Plan §0.2
   says those exact numbers *"appear in this plan only, never in the test"*; §7 E1 says *"No line
   numbers anywhere in the test"*; §3 says *"No `path:NNN` coordinates"*. My draft violated all three.
   Verified `CORRECT` against the plan text, mechanical, localized to two comment blocks, and the test
   re-ran 10/10 green after. Not asking would have been wrong only if it changed behaviour; it changes
   comments.

2. **Added step `0m` — an unmutated-copy green check — to `prove-red.sh`.**
   *Which finding it answers:* nothing in the review sense; it is the harness discipline plan §4
   invokes by name (*"Both follow the harness's existing discipline"*).
   *What changed:* eleven lines mirroring `0g`/`0j`/`0k`.
   *Why it qualified:* **obvious winner within the plan's intent.** Every other seam in this file has
   one (`0b` through `0l`), and each new seam's step carries the same stated reason: without it a red
   below could be red-because-the-copy-is-broken, and for a *new* env seam it is the only proof the
   seam is honoured at all — if `FKIT_WIKI_FLAG_ROOT` were ignored, mutations 27 and 28 would run
   against the real tree and both would come back green, reporting two disarmed mutations as two
   failures to catch. Additive, localized, cannot make an existing check weaker.
   ⚠️ **Flagged rather than buried:** this is the one item in this build that is an *addition* to the
   plan's literal §4 text rather than an execution of it. It is inside the plan's stated intent, but a
   reviewer should confirm that reading rather than take mine.

3. **Repaired the double-encoded `→` on `prove-red.sh` line 52** (see step 5).
   *Why it qualified:* restoring a byte I had corrupted seconds earlier, in a line I had no business
   touching. Verified byte-exact against the intended text; mechanical; localized to one character.

**No other change was applied without asking, and no judgment call was taken.** Nothing here is a
frontier-move, a behaviour-changing fix, a disputed severity, or outside the approved plan.

---

## What this test discharges, and what it does NOT

### It discharges `0125` `review.md` residual **R3** (owner-ruled SUBSUME, 2026-07-27)

R3's residual says, verbatim: *"What actually closes it: the already-named
`test/wiki-flag-convention.test.js` follow-up, for the producer to file."* That file now exists and
closes **both halves** of the defect R3 recorded:

- *"`sed 's/^ *//'` erases relative nesting, so a broken list-item indent is invisible to it"* →
  `dedent()` removes **one uniform minimum** computed per block, never a per-line strip. **T8** proves
  a broken list item is rejected **and** carries a control asserting that a blanket strip is blind to
  exactly that bug; **T9** proves a whole-block uniform shift still passes, so the fix does not
  over-pin. Kept exercised permanently by **prove-red mutation 28**.
- *"`diff && diff && echo UNIFORM` still prints `UNIFORM` on an empty extraction"* → `extractBlock()`
  **throws** on a missing START anchor, a missing END anchor, reversed anchors, and any extraction
  below a 30-line floor, always naming the file. **T6** pins all four, plus a control proving the
  unmutated fixture extracts cleanly.

**→ The producer should retire R3 rather than leave it standing.**

The sibling residual *"The convention is prose-only and unenforced"* named the same follow-up and its
re-raise condition (*"that follow-up is dropped rather than filed"*) was already satisfied by filing
0154. Its **substance** is now also largely answered for these three files — the block's five subjects
are enforced by a test. ⚠️ Stated precisely so it is not over-read: that residual is about SKILL
**bodies** being unread by anything in the repo, and this test reads **one block in three files**.
Every other skill body remains unenforced.

### ⚠️ What it does NOT detect — plan §3, repeated here because it is the important half

1. **It guards SOURCE TEXT, never EMITTED FORM.** All five strings were present and unchanged
   throughout the 2026-07-29 `0141` deviation, so **this test would have been GREEN for that
   deviation's entire duration**. It cannot see whether a run actually emitted the flag. **It does not
   cover the failure that produced its own promotion.** Where an emitted-form check can live is task
   **`0165`**, still open. Do not let a green run here read as coverage of `0141`'s failure mode.
2. **It reads `claude/skills/` only.** The `.claude/skills/` mirrors are never read, deliberately —
   asserting on them would make the suite depend on whether init has run.
3. **It asserts five subjects are PRESENT and the three copies are UNIFORM.** It does not verify the
   block is correct, complete, current, or followed at runtime by anybody.
4. `test/skill-frontmatter.test.js`'s standing limitation — *"A skill's BODY … remains untested by
   anything in this repo"* — is now **partly** false (this file and `test/structure-repair.test.js`
   each test one body) and **still true in general**.

### Also recorded

- **If the block ever acquires a fourth home** — a new `fkit-wiki-*` skill, or a dual-homed copy —
  **this test must be taught it.** T0 goes red first. Checked at build time: the block lives in exactly
  three files and `claude/scaffold/` has no `skills/` tree, so `test/dual-home-parity.test.js` is not
  implicated and no parity obligation was created.
- **`0173` reversed one of `0153`'s deliverables** (it removed the brief path from both flag lines,
  moving the lookup to the caller). A test written from `0153`'s brief description would have pinned a
  string that does not exist. This is recorded in the test header as the standing reason to re-derive
  from disk rather than trust any quotation in a brief, a plan, or a comment.

---

## Process-review — Round 1 (2026-08-28)

Ran `/fkit-process-stateful-review` (steps 0–7) over the reviewer's Round-1 findings **R1–R7** in
`review.md`, spawned by `/fkit-sprint-ship-loop` as its **Process-review worker**. Verdicts and
evidence live in `review.md`'s *Coder response*; this is the working record.

**Step 0 — carry verified.** `plan.md` was carried **by reference only** (26.3 KB, declared degraded
carry). Re-read from disk and the hash confirmed: `git hash-object plan.md` =
`974bcee98767d227ec217fdb9a0f02615690316a`, matching the blob named in the spawn. Treated as the
approved text. `plan.md` itself was **not edited**.

**Standing approval, and its boundary.** The owner approved the plan via `AskUserQuestion` in the live
driver session (ND-1/ND-2/ND-3, `plan.md` §9). Under ADR-019's discipline, carried to this spawn by
ADR-032 Decision 3, fixes that are verified-`CORRECT`, mechanical/localized and inside that plan were
applied without asking. Nothing outside it was touched.

### Every finding re-verified before any fix — the measurements are mine, not relayed

| # | What I re-measured myself | Result |
|---|---|---|
| R1 | Spliced one identical copy of the closing sentence 32 lines into the block in all three files, then drifted the real tail (`The flag carries the ID only` → `…the ID and the BRIEF PATH`) | Block truncated 41 → 32 lines, cleared the 30-line floor, suite **10/10 GREEN** over a real drift. **Confirmed.** |
| R2 | Appended ` (deprecated — use the new form)` after the complete-flag line's closing backtick in all three files | **10/10 GREEN**. The "byte-identical" claim was a substring count. **Confirmed.** |
| R3 | Thinned corpus (lint removed); empty `skills/`; a fourth `fkit-wiki-*` skill | 7 fail/3 pass; 7 fail/3 pass; **T0 alone** red. The *"trivially true"* claim is false; the fourth-skill claim is true and unique. **Confirmed.** |
| R4 | Read all six `extractBlock()` exits against the file's own claim at `:123` | Four throws carried no "update the constant deliberately" instruction; the floor message named one cause of two. **Confirmed.** |
| R5 | Read `run_wiki_flag_suite()` (`prove-red.sh:166-172`) under both hypotheses | With the env var ignored, `0m` reads the real (green) tree — green either way, so it cannot distinguish honoured from ignored. **Confirmed false as written.** |
| R6 | Planted a second copy of the R5 clause in a `fkit-wiki-sync` fixture and ran mutation 27's own `sed` | Survivor check **passed blind** (0 survivors) while the mutation hit **2** sites. **Confirmed.** |
| R7 | Read the brief's assertions 1–5, A3's position, and the header's own disclosure at `:40-41` | Real limit, pre-disclosed, and scoping it is a **scope change**. **Frontier-move, not a defect.** |

### Red-first proofs of the NEW guards — a guard nobody has seen fail is not a guard

* **R1's guard.** The R1 tree above, re-run after the fix → **RED** at T7:
  *"END anchor matched 2 lines, expected exactly 1"*. Green before, red after, same tree.
* **R2's guard.** The R2 tree above, re-run after the fix → **RED** at T1, *"found 0"*, naming
  `fkit-wiki-ingest`. Green before, red after, same tree.
* **R6's guard.** Proven standalone (above): old survivor check blind, new count guard catches.
* **The four pre-existing T6 throws** plus the new (e)/(f) duplicate-anchor cases all pass in-suite,
  with T6's control still extracting the unmutated fixture cleanly at exactly 30 lines.

### Final verification — Round 1's run

⚠️ **THIS HEADING USED TO READ *"nothing was edited after this run"*, AND THAT WAS WRONG.** Corrected
2026-08-28 in Round 2, on the reviewer's catch. The **T6 rename** modified
`test/wiki-flag-convention.test.js` at **20:52:58**, *after* the run recorded below — so at the moment
this section was written the claim was true, and the rename made it stale without anything correcting
it. I did re-run `npm test` after the rename (792/792, gate 28/28, exit 0, 21:07) and reported it to
the driver, but **I did not record that run here**, which is the actual defect in this record: a claim
that goes stale and a run that is not written down are the same failure twice. Both are fixed in the
Round 2 entry below, and Round 2 orders its edits so the final run genuinely has nothing after it.

* `node --test test/wiki-flag-convention.test.js` → **10 pass / 0 fail**.
* `npm test` → exit 0: **792 tests, 792 pass, 0 fail**, then `✓ hard gate PASSED` with all **28**
  mutations red at their named assertions and `0a`–`0m` green.
* Three wiki `SKILL.md` files **blob-identical to HEAD**, re-confirmed after the run.
* `package.json` unchanged, no `devDependencies` key (ADR-014). No commit, no push, no task file moved.
* ⚠️ At the time of writing, the only files edited after this run were **this worklog and `review.md`** — records, not code. **That stopped being true when the T6 rename landed at 20:52:58** (see the correction above and the post-rename run recorded in Round 2).
  Checked, not assumed: no test reads either file's **content** (the seven test files mentioning
  "worklog"/"review.md" do so in comments, except `dashboard-contract.test.js:2279`, which only names
  them as permitted companion filenames — and both files already existed before the run).

### Decision log — every fix applied WITHOUT asking, and why it qualified (ADR-019 `:96`)

| Finding | What changed | Why it qualified |
|---|---|---|
| **R1** | `test/wiki-flag-convention.test.js` — `extractBlock()` gains `linesMatching()` and two exactly-once anchor throws; T6 gains cases (e) and (f) | Verified `CORRECT` by my own measurement; **mechanical and localized** to one function plus one test; **inside the approved plan** — plan §2.1 and §8 require extraction to *fail closed* and to *"throw, never pass, on an empty extraction"*. This closes a fifth hole in that same gate rather than adding new behaviour. **Obvious winner within intent** on the shape: exactly-once is how the file's own five subject assertions are already gated, so the alternative (last-match) would have been inconsistent with the file's stated discipline. |
| **R2** | Same file — raw mode becomes `countWholeLines()` (whole-line equality modulo leading indent); header §"two match modes" and the A1/A2 comment updated | Verified `CORRECT`; **mechanical and localized** to one helper plus comments; **inside the approved plan** — plan §1.3 specifies *"A1, A2 → BYTE-EXACT raw match"* and cites 0153 verification step 1's *byte-identical* requirement, so this makes the code do what the plan already said. **Obvious winner:** the alternative (rename the assertion to "substring") would weaken the contract guard the plan calls the point of the pin. Leading indent is tolerated because sync legitimately sits 3 spaces shallower — verified on disk. |
| **R3** | Same file — T0's failure message and the section header above it corrected | Verified `CORRECT` by measurement; **message-only**, no assertion changed; **inside the plan** — the test itself is ND-2-ruled and was **kept**. Correcting a false sentence in a failure message is not a scope change. |
| **R4** | Same file — shared `ANCHOR_ADVICE` on all six `extractBlock()` throws; floor message names the legitimate-trim cause too | Verified `CORRECT`; **mechanical**, message-only; **inside the plan** — plan §2 mandates one message template and the file claims it at `:123`. |
| **R5** | `test/prove-red.sh` — step `0m`'s second justification replaced | Verified `CORRECT`; **comment-only**, four lines, confined to 0154's own row; **inside the plan** (§4 owns `0m`). `0m` itself **kept** — reviewer confirmed it in scope and its `0g` reasoning is sound. |
| **R6** | `test/prove-red.sh` — mutation 27 gains an exactly-one-site guard | Verified `CORRECT`; **mechanical**, four lines, byte-parallel to the guard mutations 25/26/28 already carry; **inside the plan** (§4 owns mutation 27 and its guards). |
| **R7** | **Nothing.** Recorded as an accepted residual | **Not an unattended call.** The owner ruled it live via `AskUserQuestion` on 2026-08-28 — *"Accept as residual (Recommended)"*. Folded in, not re-decided. |

**Obvious-winner calls made unattended: two** — the shape of R1's fix (exactly-once over last-match)
and the shape of R2's fix (tighten the matcher over relax the name). Both stayed inside the approved
plan's stated intent; both are recorded above with the reasoning that qualified them.

**Judgment calls STOPPED on rather than decided: one — and then RULED.** T6's test name still read
*"no anchor / reversed / short block all THROW"* although its case list had grown from four cases to
six. `plan.md` §2 names that test verbatim, so renaming it was **outside the approved plan**; I flagged
it to the driver instead of deciding it.

**⚖️ OWNER-RULED DEVIATION FROM `plan.md` §2's VERBATIM TEST NAME.** The owner ruled live via
`AskUserQuestion` on 2026-08-28: **"Rename it now (Recommended)"** — the name should describe what it
tests, it is one string, and no `prove-red.sh` mutation targets that assertion (27 and 28 name **T5**
and **T7**), so nothing breaks. Renamed to:

    extraction fails closed: missing / duplicated / reversed anchors and a sub-floor block all THROW

covering all six cases (missing START, missing END, duplicated START, duplicated END, reversed
anchors, sub-floor block), in the file's existing `<prefix>: <description>` naming style. **This is a
recorded, owner-approved divergence from the approved plan — `plan.md` itself was NOT edited** (it
stays the approved artefact, and `plan.md:109` still carries the original name by design). Every other
reference was checked in the same edit: the section comment above T6 now states the six cases; the
verbatim run transcript in Step 2 is annotated rather than rewritten (falsifying a captured run's
output to match a later rename would be worse than a stale quotation); `prove-red.sh` carries **no**
reference to this test's name — verified by grep, not assumed.

### For the producer, at close

1. **`0125`'s R3 discharge is GATED ON R1 and is a separate task.** Owner ruled 2026-08-28: *"File a
   task to append a dated discharge note, gated on R1."* R1 is now **fixed and re-verified**, so the
   gate is satisfied and the note can be written without an exception clause. **This coder did not edit
   `0125`'s ledger** — the follow-up task is the producer's to file.
2. **`0k` / `0l` carry the same false "only proof the env var is honoured" wording** that R5 corrected
   at `0m` (`test/prove-red.sh:353` and `:376`, pre-existing house text from tasks 0288 and 0204).
   Owner ruled *"File a follow-up"*. **Deliberately not touched here.**
3. **⚠️ `test/prove-red.sh`'s diff against HEAD entangles TWO tasks.** 0300's rows (mutations 25/26,
   the `run_release_suite` comment rewrite, the `0k` five→seven edits) sit in the same file as 0154's
   (`run_wiki_flag_suite()`, step `0m`, mutations 27/28, the header count and its two index lines).
   One file, two tasks — **the owner may want the commit split**, and nobody can split it from the
   diff alone without this note.

---

## Process-review — Round 2 (2026-08-28) — final round on 0154

Round 2 reopened the ledger with **four low findings, R8–R11**, three of them **fix-induced
neighbours** of Round 1's own fixes — R8 and R9 sit on R1's new gate, R11 on R6's new guard. Worth
naming plainly: **the Round-1 fixes were correct, and they each shipped a smaller mistake alongside.**
Verdicts and evidence are in `review.md`'s *Coder response*; this is the working record.

**Carry re-verified.** `plan.md` still hashes to `974bcee98767d227ec217fdb9a0f02615690316a` — the
approved blob, untouched by both rounds.

### The post-rename run Round 1 failed to record

`npm test` after the T6 rename, **2026-08-28 21:07** — **792/792**, `✓ hard gate PASSED`, **28/28**
mutations red at their named assertions, exit 0. It was run and reported to the driver; it was not
written down here. Recorded now, and the Round-1 heading above is corrected.

### Every Round 2 finding re-measured by me before any fix

| # | What I re-measured myself | Result |
|---|---|---|
| R8 | Extracted T6(e)'s fixture geometry: `synthBlock(0)` is 30 lines, the duplicate END was spliced at index 20 | First-match extraction takes **21 lines** — **below** the 30-line floor, so the FLOOR would catch it, not the exactly-once gate. The comment's *"stays ABOVE the line floor"* is **false of the fixture**. **Confirmed.** |
| R9 | Planted a duplicate closing sentence **below**, **above** and **inside** the real block in `fkit-wiki-sync` | below → first END **is** the real end (nothing truncated, nothing hidden); above → first END at 94 precedes START at 100, so **out-of-order** is the real fault; inside → truncation. The message named 1 case in 3. **Confirmed.** |
| R10 | Accepted on the reviewer's measurement and its own severity cap; **not** re-run by me | False **RED** only — over-reports drift, cannot hide it; T7 was already CRLF-red beforehand. **Owner-ruled a residual.** |
| R11 | `grep -c 'spawn anyone\.'` in the target file and across `claude/` | **0** and **0**. Latent, fail-closed — and the reason to fix it now is precisely that it is 0 *today*. **Confirmed.** |

### R8's fix is a FIXTURE change, so it carries a red-first proof — in both directions

The duplicate END now sits at the **last body line**, so a first-match extraction takes **exactly 30
lines**: at the floor, therefore above it, so the exactly-once gate is the only gate that can fire.
Proved by disabling that gate and replaying T6:

* **New fixture, gate disabled** → `AssertionError: Missing expected exception` — **no throw at all**.
  That is the R1 hole, isolated.
* **Old fixture, gate disabled** → `Error: fixture-e: extracted only 21 lines, below the 30-line
  floor` — red, but at the **floor**, i.e. re-proving case (d) while claiming to prove (e).

Both directions measured. This is what "prove it still reds for the right reason" means here: red is
not enough, the *reason* is the thing under test.

### Final verification — and this time the ordering makes the claim true

`npm test` was run **twice** this round, deliberately:

* **Run A**, after the code fixes → **792/792**, `✓ hard gate PASSED`, **28/28**, exit 0, **zero**
  `✗`/`✖` in the whole log. `node --test test/wiki-flag-convention.test.js` → **10/10**. Mutation 27
  still reds at its named assertion under the reshaped marker guard.
* **Run B**, the final one, executed **after every edit of this round had landed — code, `review.md`
  and this worklog** — so that literally nothing follows it. Its result is reported in the hand-off.
  Had it differed from run A, this entry would have been corrected and re-run rather than shipped.

**Checked, not assumed, that the ordering was even needed:**
`grep -rnE "readFileSync\([^)]*(worklog|review)" test/` returns **nothing** — no test reads either
file's content. The seven test files that mention "worklog"/"review.md" do so in **comments**, except
`dashboard-contract.test.js:2279`, which names them only as **permitted companion filenames** in a
task folder — a set that did not change. The run-last ordering is belt-and-braces, and it is cheap.

Also re-confirmed: three wiki `SKILL.md` files **blob-identical to HEAD**; `package.json` unchanged
with **no `devDependencies` key**; nothing committed, nothing pushed, no task file moved, nothing
written under `ai-agents/wiki-vault/`.

### Decision log — Round 2 (ADR-019 `:96`)

| Finding | What changed | Why it qualified |
|---|---|---|
| **R8** | `test/wiki-flag-convention.test.js` — T6(e)'s splice index moved to the last body line; comment and assertion message rewritten | Verified `CORRECT` by my own measurement; **localized** to one fixture in one test; **inside the approved plan** — plan §2's T6 row and §2.1 require the fail-closed cases to be pinned *in-suite*, and a fixture that does not isolate its case does not pin it. **Chose the fixture over the comment-only fix** (the driver sanctioned either) because fixing only the comment would have left T6(e) permanently proving case (d) under a different name; the proof obligation that came with that choice is discharged above, in both directions. |
| **R9** | Same file — the duplicated-END throw reworded to cover all three topologies | Verified `CORRECT`; **message-only**, no assertion or gate touched; **inside the plan** — it is R4's own correction (*"do not assert a single cause"*) applied to the throw R1 added. |
| **R10** | **Nothing in the matcher.** Header `:39` corrected to say an **LF** checkout, with the CRLF behaviour and re-raise pointer stated inline | **Not an unattended call.** Owner ruled live via `AskUserQuestion` 2026-08-28: *"Not supported — accept as residual."* Folded in, not re-decided. The header correction is the ruling's own second half, not an extension of it. |
| **R11** | `test/prove-red.sh` — mutation 27's replacement carries an injected marker; the exactly-one-site guard counts the marker, and a "marker absent" arm was added | Verified `CORRECT`; **mechanical**, and it makes mutation 27 **byte-parallel to 25/26** rather than inventing anything; **inside the plan** (§4 owns mutation 27 and its guards). |

**Obvious-winner calls made unattended: one** — R8's fixture-over-comment choice, above, explicitly
permitted by the driver and discharged with the proof it required. **Fixes applied without asking:
three** (R8, R9, R11), all verified `CORRECT`, all inside the approved plan.

**Judgment calls stopped on rather than decided: none this round.** R10 was ruled before it reached me;
the anchor-quotation frontier-move was classified by the reviewer with no row and no action, and I did
not reopen it.

### For the producer, at close — unchanged from Round 1

1. **`0125`'s R3 discharge is GATED ON R1, and the gate is SATISFIED** — R1 is fixed and re-verified
   across two rounds, so the dated discharge note needs no exception clause. Owner ruled it a
   **separate task**; **this coder did not edit `0125`'s ledger**.
2. **`0k` / `0l` carry the same false "only proof the env var is honoured" wording** R5 corrected at
   `0m` (`test/prove-red.sh`, pre-existing text from tasks 0288 and 0204). Owner ruled *"File a
   follow-up"*. **Deliberately not touched.**
3. **⚠️ `test/prove-red.sh`'s diff against HEAD entangles TWO tasks** — 0300's rows (mutations 25/26,
   the `run_release_suite` comment rewrite, the `0k` five→seven edits) and 0154's
   (`run_wiki_flag_suite()`, step `0m`, mutations 27/28, the header count and its two index lines).
   One file, two tasks — **the owner may want the commit split**, and nobody can reconstruct that split
   from the diff alone without this note.
