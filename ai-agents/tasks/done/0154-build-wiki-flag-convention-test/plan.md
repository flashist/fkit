# Plan — 0154: build `test/wiki-flag-convention.test.js`

> Approved by the owner via `AskUserQuestion` in a live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-28. Written by the driver at approval, before the Build spawn (ADR-020). Rulings ND-1, ND-2, ND-3 are appended at the end.

**Planned 2026-08-28 against HEAD `2a64727`. Every figure below was re-measured on disk today; the brief's own figures are dated and are corrected in §0.**

## 0. Re-measurement — what changed since the brief was written

The brief instructs: *"Derive the exact strings from the post-`0173` text on disk, not from any figure or quotation in this brief."* Done. Result:

### 0.1 Dependency status — the "soft-follows 0153" note is DISCHARGED

| Task | Status on disk today | Consequence for this test |
|---|---|---|
| `0153` | `ai-agents/tasks/done/` — `✅ Done (agent-closed — not owner-verified)` | closed; its wording landed |
| `0173` | `ai-agents/tasks/done/` | **rewrote the block AFTER 0153**; it is the source of the current wording |
| `0136` | `ai-agents/tasks/done/` | landed as `test/skill-frontmatter.test.js` |
| `0152` | `ai-agents/tasks/backlog/` — **still open** | the shared-walk question stays live (see §6) |
| `0165` | `ai-agents/tasks/backlog/` — **still open** | adjacency only, not a dependency |

**So the board's *"pinning the pre-0153 wording would guard text that is about to be replaced"* warning no longer applies.** The wording is settled by two closed tasks. Pin the disk text.

**⚠️ And the warning was right for a reason nobody predicted: `0173` REVERSED one of `0153`'s two deliverables.** `0153` required both flag lines to carry a brief path (`ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`). The live lines carry **no path**:

    - complete → `Task <NNNN>'s vault work is complete — ready to close`
    - partial or uncertain → `Task <NNNN>: partial — not ready to close`

`0173` moved the path resolution to the caller and says so in the block's own last sentence: *"The flag carries the ID only; that one lookup is the caller's, and it is what stops the flag rotting when the folder moves boards."* **A test written from `0153`'s brief description would have pinned a string that does not exist.** This is the single strongest argument for deriving every constant from disk, and it belongs in the test's header comment.

### 0.2 Corrected geometry — the brief's `33 lines; 2296 B, 2296 B, 2215 B` is stale

Block delimited by `**The wiki closes nothing` … `stops the flag rotting when the folder moves boards.`

| file | block lines | lines | bytes | indents present | min indent |
|---|---|---|---|---|---|
| `claude/skills/fkit-wiki-ingest/SKILL.md` | 54–94 | 41 | 2936 | 3, 5 | 3 |
| `claude/skills/fkit-wiki-sync/SKILL.md`   | 99–139 | 41 | 2834 | 0, 2 | 0 |
| `claude/skills/fkit-wiki-lint/SKILL.md`   | 63–103 | 41 | 2936 | 3, 5 | 3 |

`ingest` and `lint` are **byte-identical**. `sync` is the same text at a **uniform 3-space-smaller** offset (2936 − 3×34 non-blank lines = 2834). The brief's model — *"identical modulo one uniform offset"* — is confirmed on today's text.

**⛔ These line numbers appear in this plan only, never in the test.** The block has already moved once (`0153`'s brief recorded the flag lines at ingest:72 / lint:81 / sync:116; they are now at 75 / 84 / 120). `conventions/durable-citation-anchors.md`: *"Pair every `path:NNN` with a quoted fragment or the heading it sits under."* The test anchors on quoted text only.

### 0.3 Wrap-tolerance — measured, and BROADER than the brief states

The brief's 2026-08-14 correction flags the R5 clause as wrapping. **Measured today, TWO of the five subjects wrap, not one.** Naive raw-substring hits vs. whitespace-normalized hits, per file:

| # | subject | raw hits (each file) | normalized hits (each file) |
|---|---|---|---|
| A1 | complete-flag line | 1 | 1 |
| A2 | partial-flag line | 1 | 1 |
| A3 | hard-rule bullet (*"does not hold the task movers"*) | **0** | 1 |
| A4 | R2 branch (*"say nothing about it at all"*) | 1 | 1 |
| A5 | R5 clause (*"do not spawn the producer to close it yourself"*) | **0** | 1 |

**A single-line matcher would report A3 and A5 missing in all three files — six false negatives, on live text that is right there.** That is the exact failure the brief's correction records, reproduced. Wrap-tolerance is a correctness requirement of this deliverable, not a nicety.

## 1. What gets built

**One new file: `test/wiki-flag-convention.test.js`.** Nothing else is created. No `SKILL.md` is modified (verification step 8). `test/prove-red.sh` gains mutations (§4).

`test/` is outside the install share — `claude/structure-manifest.tsv` contains no `test/` row — so **no manifest regeneration and no `structure-*` test is affected**.

### 1.1 Shape — copied from the two live precedents, not invented

* **`test/structure-repair.test.js`, the test named `'SKILL.md pins the consent model: …'`** — the live proof that a body-prose test is buildable: it reads a `SKILL.md` and runs seven `assert.match(skill, /…/, '<why this pattern matters>')` calls. **This file uses that exact shape**, one assertion per subject, each carrying a message that names the rule it protects.
* **`test/skill-frontmatter.test.js`** — supplies three conventions this file adopts:
  1. **pure functions + synthetic fixtures + a separate live-corpus test**, so the fail-closed behavior is provable in-suite without touching real files;
  2. an **env-var tree seam** (`FKIT_FRONTMATTER_ROOT`) with a **stderr announcement** when it is non-default, so a stale inherited var cannot silently audit the wrong tree;
  3. **non-vacuity asserted first**, with a failure message that tells the next reader to update the pin *as a deliberate part of a legitimate change*, never to turn a red run green.

### 1.2 Constants — the exact anchors, all derived from disk today

    FLAG_COMPLETE = "- complete → `Task <NNNN>'s vault work is complete — ready to close`"
    FLAG_PARTIAL  = "- partial or uncertain → `Task <NNNN>: partial — not ready to close`"
    HARD_RULE     = "- **Close nothing.** The wiki does not hold the task movers (ADR-033) and never
                     invokes one, never moves a task file, and never edits a brief or the sprint
                     plan. It **flags**; the producer closes."
    R2_BRANCH     = "- **Unrelated to this run** → **say nothing about it at all.**"
    R5_CLAUSE     = "do not spawn the producer to close it yourself."
    BLOCK_START   = /\*\*The wiki closes nothing/
    BLOCK_END     = /stops the flag rotting when the folder moves boards\./
    MIN_BLOCK_LINES = 30            // live is 41; the gate, not a pin

`HARD_RULE` and `R5_CLAUSE` are written in the constant as they read when flattened; the matcher normalizes both sides, so how they are line-broken in the source is irrelevant.

### 1.3 The matcher — two match modes, deliberately, one per kind of text

```js
const flat = s => s.replace(/\s+/g, ' ');
const countFlat = (haystack, needle) => { /* non-overlapping indexOf count over flat() of both */ };
```

* **A1, A2 → BYTE-EXACT raw match, exactly once per file.** These two strings are the contract a caller *"carries verbatim"*; `0153` verification step 1 requires them byte-identical across the three files. They are single-line, ~66 chars at 3-space indent, and cannot legitimately wrap. Rewording them **should** go red — that is the whole point of the guard, and the failure message says so.
* **A3, A4, A5 → whitespace-normalized match, exactly once per file.** These are prose sentences that already wrap and will re-wrap on any nearby edit. Normalizing is what makes the guard survive legitimate rewording, and (per §0.3) what stops it reporting live rules as missing.

**Exactly-once, not at-least-once**, in both modes: a duplicated block is drift too, and a count gives a far better failure message than a boolean.

## 2. The assertions — each with what it proves

| # | Test name | Mode | Proves |
|---|---|---|---|
| T0 | `roster: claude/skills holds exactly the three fkit-wiki skills` | dir read | **Non-vacuity.** Everything below is trivially true over an empty or thinned set. Also catches a **fourth** wiki skill added without the flag block — otherwise silently uncovered. **(ND-2: included.)** |
| T1 | `all three: the complete-flag line is byte-identical, exactly once` | raw | The line `/fkit-task-done`'s caller reads. Deleting or rewording it in any one file goes red **naming that file**. |
| T2 | `all three: the partial-flag line is byte-identical, exactly once` | raw | Same, for the line that expresses *"never resolve doubt as complete"*. |
| T3 | `all three: the hard-rule bullet (ADR-033, wiki holds no movers) is present` | flat | The ADR-033 boundary as a standing hard rule, **outside** the flag block (it lives under each file's `## Hard rules`). Wrap-crossing — raw match returns 0. |
| T4 | `all three: the R2 third branch — unrelated → say nothing at all` | flat | Without it the block reverts to emitting a `partial` line for every `fkit-wiki`-owned backlog brief, on every run, forever. |
| T5 | `all three: the R5 clause — do not spawn the producer to close it yourself` | flat | The fourth forbidden act, sitting next to a ready-to-run `@fkit-producer` line on a path the ADR-018 hook **permits**. Wrap-crossing — raw match returns 0. **⛔ This assertion pins CURRENT policy under ADR-033; do not drop, weaken or invert it.** |
| T6 | `extraction fails closed: no anchor / reversed / short block all THROW` | pure fn, synthetic | The R3 defect, closed. `0125`'s check 4 printed `UNIFORM` over three empty files. |
| T7 | `uniformity: identical modulo ONE uniform offset` | pure fn, live | The three blocks are the same text; `sync`'s smaller indent is legitimate. |
| T8 | `uniformity rejects a NON-uniform offset (broken list-item indent)` | pure fn, synthetic | Blanket-stripping would accept exactly this bug. Relative nesting is preserved. |
| T9 | `uniformity ACCEPTS a whole-block uniform shift` | pure fn, synthetic | `sync`'s existing state, and any future re-nesting, stays green. Guards against over-pinning. |

**Failure messages** (verification step 9) all follow one template, so a red run never needs a grep:

    <assertion id>: claude/skills/fkit-wiki-sync/SKILL.md — expected exactly 1 occurrence of the
    R5 clause "do not spawn the producer to close it yourself." (whitespace-normalized), found 0.
    <why the rule exists, one sentence>
    ⚠️ If this text was DELIBERATELY reworded, update R5_CLAUSE in this file as part of that same
    change. Do NOT relax the assertion to turn a red run green.

### 2.1 The uniformity algorithm — prototyped, with all three controls observed

```
extractBlock(lines, label):
    s = index of first line matching BLOCK_START      -> THROW if none, naming label
    e = index of first line matching BLOCK_END        -> THROW if none, naming label
    THROW if e <= s                                   -> anchors out of order
    block = lines[s..e]
    THROW if block.length < MIN_BLOCK_LINES           -> naming label and both counts

dedent(block):
    min = min leading-space count over NON-BLANK lines
    return block.map(l => l.slice(min)).join('\n')    -> uniform slice, blanks included
```

Then assert `dedent(ingest) === dedent(sync)` and `dedent(ingest) === dedent(lint)`.

**Why this is the right model.** Reducing one line's indent below the block min shifts `min`, so every *other* line keeps surplus spaces and the texts differ → red. Increasing one line's indent leaves it with surplus spaces → red. Shifting the *whole* block leaves the dedented text identical → green. It is precisely *"identical modulo one uniform offset"*, and it never blanket-strips.

**Prototyped against the live files 2026-08-28; observed results:**

* baseline mins `ingest=3 sync=0 lint=3`; `ingest === sync` **true**, `ingest === lint` **true**;
* control (a) reword `sync`'s start anchor → **THREW** `"sync: START anchor matched NOTHING"`;
* control (b) re-indent one list item (`- **Fully** → complete.`) in `lint` by +2 → **mismatch (red)**;
* control (c) shift `sync`'s whole block by a uniform +7 → **still equal (green)**, min recomputed to 7.

That is verification step 3 (a), (b) and (c), all three, satisfied by construction — and T6/T8/T9 make them **permanent in-suite tests over synthetic fixtures**, not one-off manual checks.

## 3. Header comment (verification step 9)

Stated in the house style of the existing suites:

* **The rule** the file guards, in one paragraph.
* **SCOPE**: the *fourth* test-scope category — an invariant over the repo's own shipped content rather than product behavior — as established by `test/task-id-uniqueness.test.js`'s header and reused by `test/skill-frontmatter.test.js`. Cited, not re-argued. ADR-014 governs the mechanics.
* **Origin**: task **0125** landed the convention as prose; task **0153** and then task **0173** produced the current wording. **`0173` removed the brief path `0153` had added** — recorded explicitly, because it is the reason every constant here is derived from disk.
* **The near-miss this file exists to prevent**: `0125`'s check 4 anchored on `/The wiki \*\*closes nothing/` while the text reads `**The wiki closes nothing` — zero matches, three empty files compared, `UNIFORM` printed. Caught by chance at build time.
* **⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT** — four items, stated plainly:
  1. It guards **source text**, never **emitted form**. All five strings were present throughout the 2026-07-29 `0141` deviation, so **this test would have been green for its entire duration**. Where an emitted-form check can live is task **0165**, still open.
  2. It reads `claude/skills/` only. The `.claude/skills/` mirrors are gitignored copies refreshed by `claude/fkit-claude-init.sh`; asserting against them would make the suite depend on whether init has run.
  3. It asserts five subjects are **present** and the three copies are **uniform**. It does not verify the block is *correct*, complete, or followed.
  4. The standing limitation `test/skill-frontmatter.test.js` records — *"A skill's BODY … remains untested by anything in this repo"* — is now **partly** false: this file and `test/structure-repair.test.js` test two specific bodies. It is still true in general. **Do not read a green run here as coverage of skill behavior.**
* **The two match modes and why** (§1.3), so the next editor does not "simplify" A3/A5 to raw matches and reintroduce the false negative.
* **No `path:NNN` coordinates**, per `conventions/durable-citation-anchors.md`; tasks cited by `NNNN` prefix only.

## 4. `test/prove-red.sh` — the mutations (verification step 4)

**Seam.** The new test reads `FKIT_WIKI_FLAG_ROOT || join(REPO, 'claude')`, announcing a non-default root to stderr — the `FKIT_FRONTMATTER_ROOT` pattern exactly (a whole directory, not one script). `prove-red.sh` gains `run_wiki_flag_suite() { … }` beside `run_frontmatter_suite()`.

**Mutation 27 — delete the R5 clause in ONE file.**
Anchor: `sed`/`awk` on `$m27_tree/skills/fkit-wiki-sync/SKILL.md`, removing the wrapped `do not spawn the producer to close it yourself.` fragment.
Named assertion that must go red: `all three: the R5 clause — do not spawn the producer to close it yourself`.
**Why this one of the five:** it is the wrap-crossing clause, so a red here proves the **wrap-tolerant** matcher is genuinely load-bearing — the precise failure class the brief's 2026-08-14 correction was written about. A raw matcher would be red *always*, which is why the no-op guard below matters.

**Mutation 28 — break ONE list item's relative indent in one file.**
Anchor: add two leading spaces to `- **Fully** → complete.` in `$m28_tree/skills/fkit-wiki-lint/SKILL.md`.
Named assertion that must go red: `uniformity: identical modulo ONE uniform offset`.
**Why it earns its place:** this is the assertion that actually closes residual **R3**. Mutation 27 alone would leave the fail-closed *shape* — the whole reason this task exists — permanently unexercised in the red gate. It is ~15 lines in an existing harness shape, no new infrastructure.

Both follow the harness's existing discipline: `cp -R "$repo/claude"` into `$work`, keep an `.orig`, and **`cmp -s` the mutant against it — a no-op mutation prints `✗ MUTATION WAS A NO-OP` and sets `fail=1`** rather than reporting a hollow success. Then require red **at the named assertion** via the existing `grep -Eq '(✖|not ok|fail).*<name>'` check, not merely "some failure".

**⚠️ `prove-red.sh`'s header index says `TWENTY-SIX mutations` and carries its own warning — *"KEEP THIS LIST IN STEP WHEN YOU ADD ONE"* (it read "Two mutations" while seven sat below, task `0136` round-1 R5). Update the count to `TWENTY-EIGHT` and add both index lines in the same edit.** No test asserts that count, so nothing catches this but the editor.

## 5. Build and verification order

1. Write `test/wiki-flag-convention.test.js`.
2. `node --test test/wiki-flag-convention.test.js` — green (verification step 1: no skip list, nothing grandfathered).
3. **Prove it can fail five times, one per assertion** (verification step 2): for each of A1–A5, mutate it in **one** file, run, confirm red **naming that file and that assertion**, revert. Record all five in `worklog.md`. Four greens and one untested assertion is a hole.
4. `git status` — confirm the three `SKILL.md` files are unmodified (verification step 8).
5. Add mutations 27 and 28 to `test/prove-red.sh`, update its header index.
6. `npm test` — full suite plus `bash test/prove-red.sh`; observe 27 and 28 fire.
7. `git diff package.json` empty (verification step 5, ADR-014 zero devDeps — the repo has no `devDependencies` key at all today; adding none).
8. Confirm no `.claude/` path appears in the test (verification step 6), and that it depends on nothing init writes.

## 6. Does the shape generalize? — stated, because 0272 raised it

**Deliberately single-purpose. It is not a framework, and this task must not grow into one.**

Task `0272` landed a large prose contract across five reviewer files, and its coder said three times that a green `npm test` proves nothing about it, because nothing reads those bodies. This file does **not** fix that. It pins one block, in three named files, with hand-written constants.

**What IS reusable is the pattern, and it is worth naming in the header so the next task can copy it rather than re-derive it:**

1. **Two match modes.** Byte-exact for text that is a verbatim contract; whitespace-normalized for prose that will re-wrap. Choosing wrong in either direction is a real defect — raw matching gave six false negatives here (§0.3); normalizing the flag lines would let the contract drift.
2. **Extract-and-gate before comparing.** Anchors found, ordered, minimum line count — throw, never pass, on an empty extraction.
3. **Relative-dedent comparison** for the same text duplicated at different nesting depths.

**⛔ Not built here:** no shared prose-assertion helper module, no generalized block extractor, no second consumer. The brief asks for a guard over one block; building an instrument for `0272`'s five files is a different task with a different owner call. **ND-3 ruled: file nothing now.**

## 7. Edge cases and failure modes

| # | Failure mode | How the plan handles it |
|---|---|---|
| E1 | **The block moves within its file** | No line numbers anywhere in the test — anchors are quoted text. Already survived one move: the flag lines went 72/81/116 → 75/84/120. |
| E2 | **The block is reworded again** (a future `0173`) | A3/A4/A5 tolerate any re-wrap or re-indent. A1/A2 are byte-pinned **on purpose** and will go red — the failure message instructs the editor to update the constant *as part of that same change*, the `EXPECTED_SKILLS` discipline. **A silent reword of the contract line is the thing this test exists to stop.** |
| E3 | **The block is DELETED entirely — the vacuous-pass risk** | Not vacuous. T1–T5 are presence assertions over `readFileSync` and go red per file per subject; T6/T7 throw at extraction, naming the file. `0125`'s check 4 failed exactly here; this design cannot. |
| E4 | **A scaffold or dual-home copy exists** | **Checked: none.** `grep -rn "does not hold the task movers" claude/` returns exactly the three `SKILL.md` files; `claude/scaffold/` holds only `AGENTS.md`, `CLAUDE.md`, `ai-agents/`, `universal-rules.md` — no `skills/`. So `test/dual-home-parity.test.js` is not implicated and no parity obligation is created. **If a future task dual-homes the wiki skills, this test must be taught the second home** — noted in the header. |
| E5 | **The `.claude/skills/` mirror** | Exists in this repo (init has run) and is **never read**. The test uses explicit `claude/skills/fkit-wiki-*/SKILL.md` paths, so a repo-root glob can never reach the mirror. Passes in a fresh clone. |
| E6 | **A fourth `fkit-wiki-*` skill is added without the block** | T0's roster pin goes red. Without T0 the new skill is silently uncovered. **(ND-2: T0 included.)** |
| E7 | **A stale `FKIT_WIKI_FLAG_ROOT` in the environment** | Non-default root announced to stderr, per `harness.mjs`'s and `skill-frontmatter.test.js`'s stated reasoning: otherwise `npm test` silently audits some other tree and reports green. |
| E8 | **The anchor regexes drift out of the block** (`BLOCK_END` matching a line that later moves) | `BLOCK_END` is a full sentence fragment unique in each file; a reworded ending throws at extraction rather than silently truncating. T6's synthetic cases pin that behavior. |
| E9 | **Someone "simplifies" A3/A5 to raw matching** | Header §"two match modes and why" states the measured consequence (6 false negatives). Mutation 27 stays green under a raw matcher only if the clause is absent — a raw matcher makes T3/T5 red on the *unmutated* tree, so `npm test` catches the simplification immediately. |
| E10 | **A `SKILL.md` is unreadable rather than absent** | Read errors propagate with the path in the message (the R2 lesson `skill-frontmatter.test.js` records) — never swallowed into "not found". |
| E11 | **The block acquires a fourth home** (e.g. a new wiki skill legitimately carrying it) | T0 red first, with a message telling the editor to add the file to the list deliberately. |

## 8. How each brief caveat / ruling is honored

| Brief item | Honored by |
|---|---|
| Assertions 1–5 (five subjects, all three files) | T1–T5, one test each, per-file per-subject failure messages. |
| **⛔ "Do not drop, weaken or invert" assertion 5** (2026-08-14 dated confirmation) | T5 asserts the R5 clause as written, present in all three. It pins current ADR-033 policy — the *wiki* must not spawn a producer on its own initiative; the *driver* doing so is a different actor. Not inverted, not weakened. Re-verified present today. |
| **⛔ Wrap-tolerance — "add that to what fail closed means"** | §1.3's flat matcher for A3/A4/A5; §0.3 records the measurement (raw 0, normalized 1, in all three); mutation 27 keeps it exercised. |
| Item 6 — fail closed, gate on non-empty **and** minimum line count | `extractBlock` throws on missing/reversed anchors and on `< MIN_BLOCK_LINES`. T6 pins all three throws over synthetic input. |
| Item 6 — **preserve relative nesting; do not blanket-strip** | Uniform `slice(min)` computed per block, never `trimStart()`. T8 proves a broken relative indent is rejected; T9 proves a uniform shift is accepted. |
| Item 6 — model as *"identical modulo one uniform offset"* | §2.1, prototyped; the live `{3, 0, 3}` min-indent state is the green case, and the offsets themselves are **not pinned** (per verification 3(c)). |
| Item 7 — ADR-014, `node --test`, zero devDeps, hand-rolled | No parser, no library. `package.json` has no `devDependencies` key today and gains none. |
| Item 8 — earn a `prove-red.sh` mutation | Two: 27 (string, wrap-crossing) and 28 (uniformity). Both with no-op guards and named-assertion checks. |
| Item 9 — failure messages name file **and** assertion | §2's message template. |
| Item 10 — canonical tree only | Explicit `claude/skills/…` paths; `.claude/` never referenced. |
| **⚠️ "One `SKILL.md` walk, not three"** | **ND-1 = A:** this task adds **no walk** — three named constants. `0136`'s walk stays private and untouched; `0152` remains free to extract it. **T0 reads one directory filtered to `fkit-wiki-*`, ruled in scope by ND-2.** |
| Notes — **"Closes residual R3"**, say so explicitly in the hand-off | T6/T8/T9 are the fail-closed shape R3 asked for. The hand-off will state that `0125` `review.md` R3 (owner-ruled SUBSUME 2026-07-27) is **discharged by this test** and should be retired, not left standing. |
| Notes — **"does not cover the failure that produced its promotion — see 0165"** | Header §"does and does not detect", item 1, in the brief's own terms: green throughout the `0141` deviation. `0165` is still open. |
| Ranking / `P114` / `127` / `128` figures | Stale, and **nothing in this plan re-ranks anything** (ADR-035). The live row is Sprint 6 `P21`. |
| "No commit — leave the test in the working tree" | No commit. No push. |
| Nothing under `ai-agents/wiki-vault/` (ADR-005) | Nothing written there. |
| No task file moved (ADR-033) | None moved; the close routes to `@fkit-producer`. |

## 9. Owner rulings — `AskUserQuestion`, live `fkit lead` session, 2026-08-28 (verbatim option labels)
- **Plan gate:** "Approve".
- **ND-1 (the `SKILL.md` walk):** "A: 0154 adds no walk (Recommended)" — three named file paths; `0136`'s private walk untouched; `0152` does the extraction when it lands.
- **ND-2 (the T0 roster pin):** "Include T0 (Recommended)" — the non-vacuity gate and the only guard against a fourth wiki skill added without the flag block.
- **ND-3 (a general prose-pinning instrument):** "File nothing now (Recommended)" — `0154`'s header names the reusable pattern so the next task can copy it; revisit when a second concrete claimant exists. **Cost accepted and stated: `0272`'s prose contract stays unenforced.**
