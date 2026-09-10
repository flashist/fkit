# Review — `0360`

Task: `ai-agents/tasks/done/0360-cut-the-v0-3-0-release-and-hand-archive-sprint-7/brief.md`
File(s) under review: `ai-agents/sprints/done/sprint-7.md` (renamed from `ai-agents/sprints/sprint-7.md`),
`ai-agents/sprints/backlog.md`, 13 task `brief.md` files, this folder's `worklog.md`,
commit `b677fa0` and the local annotated tag `v0.3.0`.
Status: closed-out
<!-- Status history: `in-review` through rounds 1 and 2; set to `closed-out` on 2026-09-10 by the
     owner's disposition "Close out — no round 3 (Rec)", ruled live via AskUserQuestion in the
     /fkit-sprint-ship-loop driver session. See § "⭐ Round-2 closeout — 2026-09-10" below. -->
Coverage (**round 2**, refreshed — a later round does not repair an earlier one): **both reviewers
measured** (ADR-042 D1). Codex (`codex-cli 0.152.0`, model `gpt-5.6-sol`, exit 0) executed
`throughput.mjs` at both anchors, `git show`/`git log -S`/`git fsck`/`git cat-file`, and its own
whole-document link parser, and reported actual outputs. I executed `npm test` (**872/872**, 0 fail,
0 skipped, + `prove-red.sh` **31 mutations, hard gate PASSED**, exit 0), the three named guards,
`throughput.mjs` at both anchors, `dashboard.sh` (board + `select-active`), a link resolver built on
the repo's **own** exported `LINK` grammar (`test/reference-integrity.test.js:263`), and a repo-wide
before/after broken-set comparison over an unpacked `HEAD` tree vs the tracked working tree.
⚠️ **One sub-claim Codex could not measure** (no network in its sandbox): remote-tag absence — I
measured it myself, `git ls-remote --tags origin` → **zero** `v0.3.0` refs.

<!-- Round 1's coverage line, kept as the record of that round's state: "both reviewers measured
     (ADR-042 D1) — Codex executed throughput.mjs --at a9c2709 and reference-integrity; I executed
     npm test, the three named guards, throughput.mjs at both anchors, dashboard.sh, and a
     before/after repo-wide link resolver over an unpacked HEAD tree." -->


> ⛔ **Locations below are written as heading + quoted fragment, never as a path-plus-line
> coordinate**, wherever the target is a coordination document (`sprints/*.md`, a task folder's
> `brief.md` / `plan.md` / `worklog.md` / `review.md`). Source-file coordinates are written
> `file:line`. Backticks do not exempt a coordinate — `test/coordination-citation-policy.test.js`
> does not mask code spans.

## Reviewer findings

| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|
| R1 | 1 | high | `sprints/done/sprint-7.md` § "⛔ SUCCESS CRITERION — **MISSED.**", the bullet headed *"Which figure the script reproduces, and why it is the second row that compares like with like."* | The bullet answers its own question with **32.6%**, and calls **"32.6% → 17.9%"** the *"honest comparison against the ruled baseline"*. Measured: `node claude/skills/fkit-status/throughput.mjs --at a9c2709` prints `repair 46 / repair-pct 35.7 / repair-excluding-source-defects 43 / repair-excluding-source-defects-pct 33.3`. **The script reproduces neither 45/34.9% nor 42/32.6%.** `test/throughput-counter.test.js:457` pins this by name (*"46, NOT the 45 the brief records"*), and `0359`'s ledger records it as an owner-ruled accepted residual (*"The counter's 9-verb figures (Rec)"*). The banner therefore pairs a **hand-classified** 2026-08-29 baseline with a **script-classified** 2026-09-08 endpoint and labels the pair like-for-like. ⭐ **The MISSED verdict is unaffected** — the script's own like-for-like is `33.3% → 17.9%`, still far above the 10% target — but the trend figure is mis-derived in a permanent record. |
| R2 | 1 | medium | `tasks/done/0237-clean-the-coordination-citation-residual-set-that-blocks-0176/brief.md` § "The three mandatory edits of a pull, all applied in this act", item 2, quoting *"⛔ **Not deleted** — a deleted row loses the"* | The Z6 annotation block was inserted **mid-sentence**, between *"a deleted row loses the"* and *"pointer to where the work went."*, splitting the frozen record's own prose with seven lines of 2026-09-08 annotation. The identical annotation in the `0176` twin is placed correctly, **after** item 2's sentence ends at *"⛔ **Not deleted.**"*. Z6 authorized annotating beside the quote; it did not authorize breaking the sentence the quote sits in, and `/fkit-task-done`'s rule for a closed record is *"re-point the href, change nothing else"*. **Unique to this pass** — Codex checked both annotation sites and reported them clean. |
| R3 | 1 | medium | `sprints/done/sprint-7.md` § "The link repair this archival performed", the bullet *"**Inbound — 36 real link instances across 14 files** (7 in `backlog.md`, 29 inside closed and cancelled task folders)"* | **Measured 23, not 29.** Per-file counts of added `sprints/done/sprint-7.md)` targets: `backlog.md` 7 · `0360/brief.md` **6 (open, still in `ai-agents/tasks/backlog/`)** · `0355/brief.md` 2 (cancelled) · `done/` briefs 21. Total 36 ✓, but closed-plus-cancelled is 7 + 2 + 21 − 7 = **23**; six of the "29" are in `0360`'s own live backlog folder, which ruling Z2 deliberately leaves open. Raised by Codex; verified independently. |
| R4 | 1 | medium | `sprints/done/sprint-7.md` § "The link repair this archival performed", the clause *"⭐ **Href only — nothing else in a closed record was touched**, which is `/fkit-task-done`'s own rule for a closed plan."* | False as written. `git diff --numstat HEAD` shows `9 2` for both `tasks/done/0176-…/brief.md` and `tasks/done/0237-…/brief.md`: two href repairs each **plus a seven-line 2026-09-08 annotation block**. Ruling Z6 authorized those annotations, so the *act* is correct — the **categorical claim in the permanent banner is not**, and it contradicts this task's own worklog, which records the annotations. Raised by Codex; verified independently. |
| R5 | 1 | medium | `sprints/done/sprint-7.md` § "Open questions for the owner", the preface *"Questions 1 and 2 below are ANSWERED as of 2026-08-29 … Question 3 was never answered and stands."* | **This task made that sentence false and did not update it.** Question 3 now opens `~~⭐ STILL OPEN …~~` / `✅ **ANSWERED 2026-09-08 — NO.**`. The preface was TRUE at `HEAD` and is FALSE in the archived bytes, so the frozen board carries two mutually exclusive claims about the same question — the exact failure Z5's *"an archived board must not carry a live question nobody can act on"* was meant to prevent. Raised by Codex; verified independently against `HEAD`. |
| R6 | 1 | medium | `sprints/done/sprint-7.md` § "⭐ Addendum — the FOURTEENTH row, 2026-09-04: `0369`, appended at `P14`", the bullet *"**On `backlog.md`** the row now reads `➡️ Moved to [Sprint 7](sprint-7.md) — priority P14`"* | **A third frozen quote of a `backlog.md` row that this archival made stale, and the only one that got no annotation.** The live row now reads `➡️ Moved to [Sprint 7](done/sprint-7.md) — priority P14`, so *"the row now reads"* is false. The two sibling sites in `0176` and `0237` each received the Z6 annotation; this one did not, and the banner instead accounts for it under *"2 × `](sprint-7.md)` self-references deliberately left untouched"*, which describes it as a link rather than as a stale quotation. **Unique to this pass.** |
| R7 | 1 | low | `sprints/done/sprint-7.md` § "The link repair this archival performed", the clause *"**2 × `](sprint-7.md)` self-references deliberately left untouched** — both resolve to this file at its new path"* | Both instances are **inline-code literals** quoting `backlog.md` markers, not followable links: one inside a single-line code span, one inside a code span that wraps across two lines. The same section rules the opposite way on the same class inbound — *"5 further instances were deliberately NOT repaired: they sit inside **inline code spans**, so they are quoted literal text, not pointers a reader can follow."* So the outbound total of **96** counts 2 non-pointers while the inbound total of **36** excludes 5 of them, and the banner discloses only **1** code-span literal (a per-line masker cannot see the two-line one). Measured: a code-span-masking resolver finds **95** followable links in the archived file, all resolving. |
| R8 | 1 | low | annotated tag `v0.3.0`, message line 1: *"v0.3.0 — closes Sprint 7."* | The tagged tree still carries `\| 🔄 In progress \| P12` (`git show 'v0.3.0^{}:ai-agents/sprints/sprint-7.md'`), so the object the tag names does not close Sprint 7. The same message self-corrects three lines later (*"this tag sits one commit BEFORE Sprint 7's closing commit"*), which is why this is low and not medium. ⭐ **Timing matters more than severity here:** the tag is local and unpushed, so this is the only window in which it can be changed at zero cost. Raised by Codex; verified independently. |
| R9 | 1 | low | `sprints/done/sprint-7.md` § "⛔ SUCCESS CRITERION — **MISSED.**", the clause *"the repair share fell by roughly a third on both readings"* | Measured relative falls: `34.9 → 20.5` = **41.3%**; `32.6 → 17.9` = **45.1%**; `30.4 → 17.9` = **41.1%**. Every available reading is roughly two-fifths, not a third. The error understates the sprint's own improvement, so it is not spin — but it is wrong in a frozen record. Raised by Codex; verified independently. |

### Disproven — recorded so nobody chases them

- **Codex C7 — *"WAS NEVER PUSHED" is unbounded and becomes false when the owner pushes.*** **INCORRECT.**
  The banner is a dated archival record, and the same sentence reads *"the release is COMMITTED AND
  TAGGED LOCALLY AND WAS NEVER PUSHED — the push is the owner's"*, which explicitly frames the push as
  pending. No defect.
- **Codex S1 — could not confirm the remote tag is absent (sandbox had no network).** **Resolved by my
  pass:** `git ls-remote --tags origin` ran successfully here and returned **zero** `v0.3.0` refs;
  `git log origin/main..HEAD` is exactly `b677fa0`. Nothing was pushed.
- **Board drift on `0360`** (`plan="✅ Done"` / `brief="🔄 In progress"` / `location="backlog/"`).
  **Not a defect** — created deliberately by ruling Z2 and cleared only by the producer's
  `/fkit-task-done`. Verified that `dashboard.sh` **reports** it rather than hiding it:
  `drift disagreement 0360 …` appears in the `⟦FACTS⟧` block.

### What I verified clean (measured, not inherited)

- **Nothing pushed.** `origin/main` = `5ed0b91`; `HEAD` = `b677fa0`; `git ls-remote --tags origin`
  carries no `v0.3.0`. Tag object type is **`tag`** (annotated), message names Sprint 7 and the
  measurement-anchor purpose, **no secrets** (a repo-wide secret-pattern scan over the whole change
  returned 3 hits, all the word "token" in *"rank token"* / *"banner token"*).
- **Zero prose corruption.** Of 85 removed lines in the archived board, **83 are explained exactly by
  the four `](…)`-target repair rules** and nothing else; the 2 unexplained are the intended `0360`
  row flip and the intended Q3 answer. Every one of the 14 inbound files is **href-only**, with the
  two Z6 annotation blocks as pure additions.
- **Links.** 96 accounted for outbound (95 followable + 1 code-span literal by the banner's own count;
  see R7), **0 broken**. All 36 inbound repaired, 0 broken. Repo-wide before/after over an unpacked
  `HEAD` tree: **3611 → 3618 targets, broken 31 → 31, and the broken set is byte-identical** — zero
  introduced, zero removed. The 5 unrepaired inbound code-span literals are correct calls in all five
  cases (two are the Z6 frozen quotes; three quote the pattern or the brief's defective step-7 grep).
- **Guards, on the final bytes.** `reference-integrity` 20/20 (877 files, 3388 targets, 0 broken,
  named-exempt **7**) · `coordination-citation-policy` 21/21 · `closed-rank-immutability` 39/39 ·
  `npm test` **872/872, 0 fail** + `prove-red.sh` **`✓ hard gate PASSED`**, 31 mutations, exit 0.
- **Board facts.** 15 rows · 14 `✅ Done (agent-closed — not owner-verified)` · 1 `⛔ Cancelled` ·
  0 in progress · ranks `P1`–`P15`. `select-active` → `active none`, **exit 3**.
- **Throughput at the release commit.** `open 112 · repair 23 · 20.5% · excl-source-defects 20 ·
  17.9% · exceptions 0215/0234/0334`, and `W36 14/20`, `W37 7/28` with every prior week creating more
  than it closed. **Every one of these banner figures reproduces exactly.**
- **`sprint-6.md` byte-identical** (`git diff HEAD` empty). **`wiki-vault/` untouched** (empty diff).
- **Banner's mandatory disclosures all present and unhedged:** *"SUCCESS CRITERION — MISSED"* with the
  real numbers; the `0360` self-flip; the successor omission plus *"establishes no convention"*; the
  archive left UNCOMMITTED and the tag one commit early; and — separately stated, never conflated —
  *"the ruling exists"* / *"the verification does not"*, with Sprint 6's *"NO owner ruling"* sentence
  explicitly named as false here and not copied.

### ⭐ Round 2 — 2026-09-09: verification pass over the ten claimed fixes. ⛔ ZERO new rows.

⭐ **No `R10` exists and none was added: round 2 found no novel confirmed defect.** All ten claimed
fixes (`R1`–`R9` + `R5b`) were **independently re-measured on the final bytes on disk** — nothing was
inherited from the round-1 rows or from the *Coder response* section. Owner-ruled live 2026-09-09,
option label verbatim **"Yes — verify before commit (Rec)"**.

| Fix | Verified? | The measurement I ran (not the coder's) |
|---|---|---|
| **R1** | ✅ verified | `throughput.mjs --at a9c2709` → `repair 46 / 35.7` · `repair-excluding-source-defects 43 / 33.3`; `--at b677fa0` → `23 / 20.5` · `20 / 17.9`. Every table cell checks: `45/129=34.9` · `42/129=32.6` · `42/138=30.4` · `23/112=20.5` · `20/112=17.9`. Baseline column reads *HAND-classified*, measured column *script*. Verdict text present and unhedged. |
| **R2** | ✅ verified | `git diff HEAD` on `0237`'s brief: the frozen sentence *"a deleted row loses the pointer to where the work went."* is an **unchanged context line** — whole and contiguous — with the 7-line annotation following it. Placement now matches the `0176` twin. Quoted marker byte-identical. |
| **R3** | ✅ verified | Added inbound targets counted per file: `backlog.md` **7** · `0360`'s open brief **6** · cancelled `0355` **2** · eleven `done/` briefs **21** (2+2+3+1+1+2+1+1+2+1+5). **7+23+6 = 36 across 14 files**; closed+cancelled **21+2 = 23**. |
| **R4** | ✅ verified | `git diff --numstat`: `9 2` for **exactly** `0176` and `0237`; the other twelve are *n*-added = *n*-removed. Independently, `backlog.md`'s five changed lines are **identical after normalising every link target** — href-only confirmed, not merely asserted. |
| **R5** | ✅ verified | Preface § "Open questions for the owner" now records Q3 *"ANSWERED 2026-09-08"* quoting *"Leave Sprint 6 byte-identical (Rec)"*; question 3's own body agrees. No contradiction remains. `sprint-6.md` diff is **empty** — Z5 honoured, not one byte. |
| **R6** | ✅ verified | § "⭐ Addendum — the FOURTEENTH row" — annotation sits at the **bullet's end**, after *"`## Priority: P14`."*, splitting no sentence. Quoted marker byte-identical (unchanged context line). The annotation contributes **exactly 3** links, matching the banner's *"adds 3 more"*. |
| **R7** | ✅ verified | ⭐ **The claim Codex called wrong — and it is right.** Measured with the repo's **own** link grammar exported from `test/reference-integrity.test.js:263`: current file **99**, pre-move file **91**. Split: **97 followable + 2 inline-code literals**, **97 resolved, 0 broken**; guard-invisible **14 = 13 blockquote + 1 per-line literal**. Before: **91 = 89 + 2**, guard-invisible **9 = 8 + 1** — ⭐ **exactly the split the coder had to self-correct, and it lands.** Arithmetic closes: 91+5+3 = 99, 89+5+3 = 97. |
| **R8** | ✅ verified | `git cat-file -t v0.3.0` → **`tag`** (annotated); `v0.3.0^{commit}` → `b677fa0`; first message line *"v0.3.0 — anchors Sprint 7."*; body states it anchors but does **not** close, naming the in-progress row in the tagged tree (which does carry it — 3 hits). Secret-pattern scan over the whole change → **0**. `git ls-remote --tags origin` → **zero** `v0.3.0` refs. **Unpushed.** |
| **R9** | ✅ verified | `(35.7−20.5)/35.7 = 42.577%` → **42.6%**; `(33.3−17.9)/33.3 = 46.246%` → **46.2%**. Both exceed two-fifths; the sentence is arithmetically correct on the two figures it itself names. ⚠️ See the derivation note below — an observation, **not** a defect. |
| **R5b** | ✅ verified | ⭐ **Provenance claim holds.** `git show 0d8b08e` (2026-08-29) adds **both** the preface sentence *"Questions 4–6 are NEW and open"* **and** all three `✅ ANSWERED 2026-08-29` markers **in the same commit** — false in the commit that introduced it, so **pre-existing**, not created here. The original sentence is **byte-identical** (the diff changes only the Q3 half of that line); the correction is an appended dated note. All three questions do read `ANSWERED 2026-08-29`; 5 and 6 are struck, 4 is not — matching its *"the ROW is what was ruled"* qualification. |

⛔ **One limit stated rather than glossed:** R1's *"MISSED verdict byte-unchanged"* is verified **by
content** — the verdict reads `⛔ SUCCESS CRITERION — **MISSED.**` / *"THE SPRINT MISSED ITS CRITERION
BY ANY READING"* / *"Every pairing misses"*, unhedged. It **cannot** be verified byte-for-byte against
the intermediate round-1 bytes, because those were never committed and no blob survives. The
comparison available to me is against round-1's own quotation of the verdict in this ledger.

#### Disproven this round — recorded so nobody chases them

- **Codex R7 — *"NOT VERIFIED: the file carries 110 instances = 97 followable + 13 literals, not
  99 = 97 + 2; guard-invisible is 25, not 14."*** ⛔ **INCORRECT (disproven).** Codex counted with a
  bare `](target)` pattern, which matches **11 pattern fragments the banner itself writes** while
  describing its own repair rules (`](../…)`, `](backlog.md)`, `](done/sprint-6.md)` and so on). Those
  have **no `[label]`** and are not links under **the repo's own ruled definition** —
  `test/reference-integrity.test.js:263` defines a link as `[label](target)`, commented *"What counts
  as a link: a markdown inline link."* Run directly, that grammar returns **99** on the current file
  and **91** on the pre-move file: the banner's figures exactly. ⭐ **Codex's own before-count of 91
  agrees with mine** — the divergence appears only after the banner introduced the 11 fragments, which
  is why it looks like the self-modification trap and is not one. **No defect.**
- **Codex "new defect" — the worklog repeats the same false counts.** ⛔ **INCORRECT (disproven)**,
  falling with the above. Separately checked: the worklog's older *"96 links"* is **not stale** — it
  carries its own dated marker *"⚠️ Superseded by round 1 of the review"* and gives the corrected 99
  in the same bullet. A properly annotated chronological record, not a live false claim.
- **Codex R8 sub-claim it could not measure** — remote-tag absence, its sandbox had no network.
  **Resolved by my pass:** `git ls-remote --tags origin` → zero `v0.3.0` refs. Same shape as round 1's
  `S1`; not a defect either time.

#### ⚠️ Observation, NOT a defect — R9's derivation basis

The banner's **42.6%** / **46.2%** are computed from the **rounded** percentages the sentence itself
names. From the underlying counts they would read **42.4%** (`46/129 → 23/112`) and **46.4%**
(`43/129 → 20/112`) — a 0.2pp difference each way. ⭐ **No claim flips**: *"more than two-fifths"* is
true under both derivations, and the sentence is arithmetically correct on its own stated inputs.
⛔ **Recorded, and deliberately not raised as a finding** — raising it would be a wording preference,
not a defect, and would manufacture a third round over 0.2pp.

#### ⭐ Adjudicated — the repo-wide broken-link corpus discrepancy

Round 1 measured **30 → 30** (excl-vault) / **31 → 31** (incl-vault); the round-2 coder measured
**19 / 19**; ⭐ **my own resolver measures a THIRD figure — 22 → 22**, built on the repo's own `LINK`
and `SKIP_SCHEME` grammars with document-level code-span masking, over tracked `*.md` in an unpacked
`HEAD` tree vs the tracked working tree (`test/fixtures/` and elided targets excluded).
⛔ **None of the three is established as wrong** — the absolute number is a function of an
under-specified corpus rule, and all three workers declared theirs.
⭐ **The load-bearing claim is the MOVEMENT claim, and it holds under mine as it did under theirs:**
targets **3648 → 3658**, broken **22 → 22**, and the sorted broken set is **byte-identical**
(sha256 `219e139822018c5f` before and after). ⛔ **Zero introduced, zero removed. Not damage, not a
defect, and no banner claim depends on it** — the banner asserts 0 broken only for the archived file's
97 followable pointers and the 36 inbound repairs, both of which I verified directly.

#### ⛔ Coverage limit re-confirmed, not inherited

`coordination-citation-policy` is **21/21 green — and that green says nothing about the archived
board.** The guard prints its own exclusion: *"sprints/done and sprints/reviews not scanned — +6
residual across 2 files"*. ⛔ **It never looked at the file this task edited.** I therefore checked by
hand: the archived board carries **one** `path:NNN`-shaped string, `sprint-2.md:354`, which is
**byte-identical at `HEAD`** and is itself a quotation of `0176`'s long-disclosed accepted
incompleteness — **pre-existing, not created here.** The board's move into `sprints/done/` added **no**
new unscanned residual.

#### What I verified clean this round (measured on the final bytes)

- **All 8 remaining bare `sprint-7.md` references are inside inline code spans — zero followable.**
  Exactly the banner's accounting: **2** in the archived board itself + **5** inbound *"deliberately
  NOT repaired"* + 1 in this ledger's own round-1 quotation.
- **Guards.** `reference-integrity` **20/20** (878 files, 3391 targets, **0 broken**, named-exempt
  **7**) · `coordination-citation-policy` **21/21**, residual **0** · `closed-rank-immutability`
  **39/39** · `npm test` **872 tests / 872 pass / 0 fail / 0 skipped** + `prove-red.sh`
  **`✓ hard gate PASSED`**, 31 mutations, exit 0.
- **Board facts.** `dashboard.sh` on the archived board → **14 done · 1 cancelled — of 15**, with the
  `0360` drift row reported in `⟦FACTS⟧` (Z2-intended, out of scope) · `select-active` → **`active
  none`**, candidate `backlog.md`, **exit 3**.
- **`sprint-6.md` byte-identical** · **`wiki-vault/` untouched** (0 changed paths) · **no secrets** in
  the whole change or the tag object.

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

**Round 1 processed 2026-09-08** by a spawned `fkit-coder` (Process-review worker) under
`/fkit-sprint-ship-loop`'s declared-approval marker. ⛔ **No per-round owner gate was used and no row
carries `pending approval`** — R1, R6 and R8 were settled by live owner rulings relayed in the spawn
prompt; R2, R3, R4, R5, R7 and R9 were applied under the standing approval as verified-`CORRECT`,
mechanical, in-plan corrections of false claims in a record that becomes permanent on commit.

⭐ **Severity below is the coder's own, derived from the blast radius traced in verification — the
reviewer's labels were not inherited.** Two differ: **R7 low → medium** (a stated counting rule that
contradicts itself inside one section, and it made two banner sentences false, in a permanent record);
**R8 low → medium on irreversibility** (its content self-corrects three lines later, but the object
becomes unchangeable the moment the owner pushes).

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT (sev **high**) | Defect | ⭐ Owner ruling *"Report the script's own figures (Rec)"* applied to the banner § "⛔ SUCCESS CRITERION — **MISSED.**". Re-measured `throughput.mjs --at a9c2709` myself: **repair 46 / 35.7%**, **repair-excluding-source-defects 43 / 33.3%** — reproducing neither 45/34.9% nor 42/32.6%. The bullet now states the like-for-like pair as the script's own classification at both ends — **33.3% → 17.9%** excluding source-defect repairs, **35.7% → 20.5%** all-in — and keeps the ruled hand baseline **42 / 129 = 32.6%** beside it, labelled the hand classification it is; the table's baseline column is now headed *"HAND-classified"* and its measured column *"script"*. `0359`'s residual *"The counter's 9-verb figures (Rec)"* is cited as the reason for the 46-vs-45 gap, ⛔ **not reopened.** ⛔ **The MISSED verdict is byte-unchanged and nothing was rounded, softened or reframed.** | ✅ done |
| R2 | CORRECT (sev **medium**) | Defect | The seven-line Z6 annotation in `0237`'s brief § "The three mandatory edits of a pull, all applied in this act" was moved to **after** item 2's sentence ends, so the frozen prose *"a deleted row loses the pointer to where the work went."* is whole again. Placement now matches the correctly-placed `0176` twin. ⛔ Annotation text and the quoted `backlog.md` marker both byte-identical — this moved text, it did not rewrite any. | ✅ done |
| R3 | CORRECT (sev **medium**) | Defect | Measured the added inbound targets per file myself: `backlog.md` **7** · `0360`'s own **open** brief **6** · cancelled `0355` **2** · `ai-agents/tasks/done/` briefs **21** = **36**. The banner's *"29 inside closed and cancelled task folders"* is therefore wrong by six; it now reads **7 + 23 closed/cancelled (21 done, 2 cancelled) + 6 in `0360`'s own still-open folder**, with the old figure named as corrected. Total 36 unchanged. | ✅ done |
| R4 | CORRECT (sev **medium**) | Defect | `git diff --numstat` confirms `9 2` for `0176` and `0237` and *n*-added = *n*-removed for the other twelve. The categorical *"Href only — nothing else in a closed record was touched"* is replaced by **"href-only in TWELVE of the fourteen"**, naming `0176` and `0237` as the two that also took the Z6 annotation, and stating outright that the earlier categorical claim was false. ⭐ The Z6 annotations themselves are authorized and were not undone. | ✅ done |
| R5 | CORRECT (sev **medium**) | Defect | The § "Open questions for the owner" preface no longer says *"Question 3 was never answered and stands"*; it now records **ANSWERED 2026-09-08**, quotes the ruling *"Leave Sprint 6 byte-identical (Rec)"*, and says plainly that this archival is what made the old sentence false. ⚠️ The same preface's *"Questions 4–6 are NEW and open"* was already false at `HEAD` (4, 5 and 6 all read ANSWERED 2026-08-29) — ⛔ **pre-existing, not created by this task, and deliberately NOT touched**; flagged rather than silently fixed or silently ignored. | ✅ done |
| R6 | CORRECT (sev **medium**) | Defect | ⭐ Owner ruling *"Annotate it too (Rec)"* applied. Verified the live `backlog.md` row for `0369` now reads `➡️ Moved to [Sprint 7](done/sprint-7.md) — priority P14`, so the frozen quote is genuinely stale. The same dated 2026-09-08 annotation was added in § "⭐ Addendum — the FOURTEENTH row", **at the end of the bullet so no sentence is split** (R2's lesson applied pre-emptively), naming its two siblings. ⛔ **The quoted marker is byte-identical — annotated, never rewritten** (Z6). | ✅ done |
| R7 | CORRECT (sev **medium**, raised from low) | Defect | Confirmed both `](sprint-7.md)` instances are inline-code literals — one single-line, one wrapping two lines, which a per-line masker cannot see. The banner now declares **one counting rule for both directions** (a code-span instance is quoted literal text, not a pointer) and every count is re-measured on the final bytes: original **91 = 89 followable + 2 literals**; +5 banner links +3 from R6's annotation → **99 instances = 97 followable + the same 2 literals**, **97 resolved on disk, 0 broken**; the guard sees 85 and **cannot see 14**. The old *"both resolve to this file at its new path"* is gone, and the per-line-vs-document masker discrepancy (1 literal vs 2) is stated rather than left to look like an error. | ✅ done |
| R8 | CORRECT (sev **medium** on irreversibility, low on content) | Defect | ⭐ Owner ruling, option label verbatim — **Retag as "anchors Sprint 7" (Rec)** — applied. Confirmed first that `git show 'v0.3.0^{}:ai-agents/sprints/sprint-7.md'` carries `\| 🔄 In progress \| P12`. The **local** tag was deleted and recreated on the **same commit** `b677fa0`: first line now *"v0.3.0 — anchors Sprint 7."*, and the closing note says it anchors but does not close, naming the in-progress row in the tagged tree. ⛔ Still **annotated** (`objecttype` re-verified `tag`), still names the measurement-anchor purpose, **no secrets**, ⛔ **not pushed** — `git ls-remote --tags origin` re-run after the retag returns **zero** `v0.3.0` refs. | ✅ done |
| R9 | CORRECT (sev **low**) | Defect | *"fell by roughly a third"* replaced with the measured figure. ⚠️ **Not the reviewer's 41.3 / 45.1 / 41.1** — those were computed on the pre-R1 pairs, and R1's fix changed which pairs the sentence refers to. Re-derived on the script's own like-for-like pairs: **35.7% → 20.5% = a 42.6% relative fall**, **33.3% → 17.9% = 46.2%**. The banner now says *"more than two-fifths on both of the script's like-for-like readings"* and names the understatement it replaced. ⛔ Corrected **upward**, as the finding required. | ✅ done |
| R5b | CORRECT (sev **medium**) — ⭐ **owner-ruled follow-up to R5, NOT a new reviewer finding** | Defect, **pre-existing** | ⭐ Owner ruling 2026-09-09, option label verbatim: **"Fix it now (Rec)"**. R5's row flagged this and left it; the owner has now ruled it in. ⛔ **Re-verified at `HEAD` myself before writing anything, and the pre-existing claim HELD — and is stronger than R5 recorded it**: the preface sentence *"Questions 4–6 are NEW and open"* and all three `✅ ANSWERED 2026-08-29` markers landed in the **same** commit, `0d8b08e` of 2026-08-29, so it was false in the commit that introduced it — not merely false by `HEAD`. It stood unchanged at the pre-release commit `5ed0b91` and at the release commit `b677fa0`. ⛔ **Annotated, never rewritten** (ruling Z6): the original sentence is left **byte-identical** and a dated **CORRECTION 2026-09-09** note is appended beside it inside the same blockquote — the house pattern already used in the `P9` and `P13` rows, and the register of R5's own correction two lines above. The note states which ruling answered each question, quotes question 4's own *"the question itself is still open — the ROW is what was ruled, not the answer"* qualification, and ⛔ **separates the two dates**: the answers are 2026-08-29, only the correction is 2026-09-09. ⭐ **No link count moved** — the note contains **zero** link-syntax instances, and the by-hand resolver re-run on the final bytes reproduces the banner exactly, before and after: **99 instances = 97 followable + 2 literals, 97 resolved, 0 broken, 14 guard-invisible (13 blockquote + 1 per-line literal)**. | ✅ done |

### ⚠️ Why this ledger is NOT closed out after a 9-for-9 round

> ⚠️ **SUPERSEDED 2026-09-10 — kept as the record of what round 1 knew, not as a live claim.** The
> reason this section gives for staying open — *"Nothing I changed has been independently verified"* —
> **no longer holds**: round 2 re-measured all ten fixes on the final bytes. ⛔ **The text below is
> left byte-identical on purpose** (annotate, never rewrite — ruling Z6); read it as dated, and read
> § "⭐ Round-2 closeout — 2026-09-10" for the ledger's actual state.

⛔ **All nine findings were FIXED, not closed out, disproven or accepted** — and a fix is the one
disposition this skill's close-out condition does not cover. **Nothing I changed has been
independently verified**, and seven of the nine sit in text that becomes permanent when the owner
commits, with R8 in an object that becomes permanent when the owner pushes. **Status stays
`in-review`**; a round-2 reviewer pass over the final bytes is the honest next step, ⛔ not a
formality. ⭐ **No new accepted residual was recorded this round** — every finding was a defect, none
was a frontier move.

⚠️ **Two things measured differently from the reviewer's numbers, and my figures are the ones the
banner now carries.** (1) R9's relative falls: the reviewer's 41.3 / 45.1 / 41.1 are correct for the
pre-R1 pairs, but R1's fix changed which pairs the sentence names, so the banner carries 42.6% and
46.2% on the script's own pairs. (2) The repo-wide broken set: excluding `ai-agents/wiki-vault/` I
measure **30 → 30**, including it **31 → 31**; ⭐ **both sets are byte-identical before and after**, so
the reviewer's conclusion holds under either corpus and its **31** is the with-vault reading.

### ⭐ Addendum — round 1, 2026-09-09: one owner-ruled follow-up fix (`R5b`)

⭐ **Applied under the same declared-approval marker**, plus a specific owner ruling of 2026-09-09,
option label verbatim **"Fix it now (Rec)"**, relayed in the spawn prompt. ⛔ **Scope was one sentence**
— § "Open questions for the owner" in `ai-agents/sprints/done/sprint-7.md` — and ⛔ **R1–R9 were not
re-opened, re-fixed or re-verified**, so the bytes the round-2 reviewer pass is about to read are the
round-1 bytes plus this one annotation.

⛔ **Re-measured on the FINAL bytes, not quoted from the previous round:** `reference-integrity`
**20/20** (878 files, 3391 link targets, **0 broken**, 7 named-exempt) · `coordination-citation-policy`
**21/21** (764 files scanned, **residual 0**; ⚠️ `ai-agents/sprints/done/` is **not** in that guard's
scanned set, so it never looked at the file I edited) · `closed-rank-immutability` **39/39** ·
`npm test` **872 tests / 872 pass / 0 fail / 0 skipped** and `bash test/prove-red.sh`
**`✓ hard gate PASSED`**, 31 mutations, each redding its named assertion · `dashboard.sh` on the
archived board parses it and prints **14 done · 1 cancelled — of 15**, with the expected `0360` drift
row (its brief still reads `🔄 In progress` in `backlog/`, which the producer's close clears) ·
`select-active ai-agents/sprints` returns **`active none`**, candidate `backlog.md`.

⛔ **The by-hand resolver is reported SEPARATELY from the guard, which structurally cannot see
blockquote or code-span links.** Over the archived file: **99 link-syntax instances = 97 followable +
2 inline-code literals; 97 resolved against the filesystem, 0 broken; 14 guard-invisible = 13
blockquote links + 1 literal a per-line masker sees as code** (the second literal wraps two lines, so
the guard sees it and mis-reads it as a followable link — R7's disclosure, re-confirmed). ⭐ **Run on
the pre-edit bytes as well: every one of those figures is identical**, which is the proof that this
edit moved no count.

⚠️ **One number I could NOT reproduce, stated rather than smoothed over.** Round 1 recorded the
repo-wide broken set as **30 → 30** excluding `ai-agents/wiki-vault/` and **31 → 31** including it. My
own repo-wide resolver — tracked-plus-untracked `*.md`, fences and inline-code spans masked, elided and
scheme targets skipped, `test/fixtures/` excluded — measures **19 / 19**. ⛔ **I did not reconstruct
round 1's corpus definition, so this is a different corpus, NOT a contradiction of its figure and NOT
evidence that it was wrong.** ⭐ **The claim that carries over is the movement claim, and I re-measured
it directly**: before and after this edit the broken set is **byte-identical** (same count, same
sha256 over the sorted set).

### ⭐ Round-2 closeout — 2026-09-10

⭐ **Owner disposition, option label verbatim: "Close out — no round 3 (Rec)"**, ruled live via
`AskUserQuestion` in the `/fkit-sprint-ship-loop` driver session and relayed to me in the spawn
prompt. ⛔ **The reviewer did not leave this ledger open for want of evidence** — it left it
`in-review` because closeout is the owner's disposition to make, not the reviewer's. It now has it.
**Status: `closed-out`.**

**What round 2 established, and why no round 3 is owed:**

- ⭐ **Ten of ten fixes independently verified** — `R1`–`R9` plus `R5b` — **re-measured by the reviewer
  on the final bytes on disk**, nothing inherited from the round-1 rows or from this section.
- ⛔ **Zero novel defects. No `R10` exists and none was added.** The round-2 table adds verification,
  not findings.
- ⭐ **Both Codex findings disproven**; the third thing Codex raised was not a defect but a limit of
  its sandbox, resolved by the reviewer's own measurement.

**The two Codex findings, and the one sandbox limit:**

| Codex | What it claimed | Outcome |
|---|---|---|
| **C1** (the reviewer's list calls it *"Codex R7"*) | *"NOT VERIFIED: the file carries 110 instances = 97 followable + 13 literals, not 99 = 97 + 2; guard-invisible is 25, not 14."* | ⛔ **Disproven.** Reason recorded in full below. |
| **C2** (the reviewer's list calls it *"Codex 'new defect'"*) | The worklog repeats the same false counts. | ⛔ **Disproven** — it falls with C1, whose counts were the premise. Separately checked: the worklog's older *"96 links"* is **not** a live false claim; it carries its own dated *"⚠️ Superseded by round 1 of the review"* marker and gives the corrected 99 in the same bullet. |
| **C3** (the reviewer's list calls it *"Codex R8 sub-claim it could not measure"*) | Could not confirm the remote tag is absent — **no network in its sandbox**. | ⭐ **Not a finding at all — a coverage limit, resolved by the reviewer's OWN measurement:** `git ls-remote --tags origin` → **zero** `v0.3.0` refs. Same shape as round 1's `S1`; not a defect either time. |

#### ⭐ C1's disproof, recorded in full — this is the round's one real contest, and a future reader will hit it again

⭐ **Codex counted links with a bare `](target)` pattern.** That pattern sweeps up **11 pattern
fragments the banner writes while describing its own repair rules** — `](../…)`, `](backlog.md)`,
`](done/sprint-6.md)` and so on. ⛔ **Those fragments carry no `[label]`, and under the repo's own
ruled grammar they are not links.** The grammar is `test/reference-integrity.test.js`'s exported
`LINK` (`test/reference-integrity.test.js:263`), whose rule comment reads *"What counts as a link: a
markdown inline link."* Run directly, that grammar returns **99** on the current file and **91** on
the pre-move file — the banner's figures exactly.

⭐ **The tell, and it is decisive: Codex's own before-count of 91 agreed exactly.** The divergence
appears **only after** the banner introduced those 11 fragments. A counter that agrees on the bytes
without the fragments and disagrees on the bytes with them is measuring the fragments, not the links.
⚠️ **This is why it looks like the self-modification trap — a document whose own description of link
repair inflates its link count — and why it is not one.** ⛔ **No defect.**

#### ⛔ Two limits recorded as limits, not smoothed away

1. ⚠️ **`R1`'s *"MISSED verdict byte-unchanged"* is verified BY CONTENT, not byte-for-byte.** The
   verdict reads `⛔ SUCCESS CRITERION — **MISSED.**` / *"THE SPRINT MISSED ITS CRITERION BY ANY
   READING"* / *"Every pairing misses"*, unhedged — that is what was checked. ⛔ **A byte-for-byte
   diff is not available and never will be: the round-1 bytes were never committed, so no blob
   survives to diff against.** The only comparison that existed was against round 1's own quotation of
   the verdict in this ledger. ⭐ **Recorded as the content-level verification it is** — a stronger
   claim would be false.
2. ⚠️ **The repo-wide broken-set figure has three different values across three workers: round 1's
   30/31, the round-2 coder's 19, the reviewer's 22.** ⛔ **That is an under-specified corpus rule, not
   damage and not a regression** — the three workers scanned different file sets (tracked vs
   tracked-plus-untracked, vault included or excluded, differing masking) and **each declared its
   own**. ⛔ **No winner is picked here, because no banner claim depends on the absolute number.**
   ⭐ **All three agree on the load-bearing claim — the MOVEMENT claim: the broken set is
   byte-identical before and after**, zero introduced and zero removed; the reviewer pinned it with a
   sha256 of `219e13…` over the sorted set, identical at both anchors. ⭐ **Recorded here so a later
   reader does not mistake three numbers for a regression.**

⛔ **Nothing was changed in the repository for this closeout.** It is a records-only write: this
section, the ledger header, the residual below, and this task's `worklog.md`. The archived board
`ai-agents/sprints/done/sprint-7.md` is untouched and final; commit `b677fa0` and the local annotated
tag `v0.3.0` are untouched; nothing was committed, pushed, moved, re-ranked or re-run into the vault.

## Accepted residuals (shared, do-not-re-litigate)

<!-- Owner-approved settled tradeoffs only. Rulings Z0–Z7 (2026-09-08) and the 2026-09-07
     "Archive as agent-closed (Rec)" ruling are recorded in this task's plan.md and are out of
     scope for any round of this review. -->

### `R9`'s rounding basis — the banner's 42.6% / 46.2% are derived from rounded inputs

⭐ **Recorded 2026-09-10 by owner disposition, option label verbatim: "Record as accepted residual
(Rec)"**, ruled live via `AskUserQuestion` in the `/fkit-sprint-ship-loop` driver session.

**What.** The archived board `ai-agents/sprints/done/sprint-7.md`, § "⛔ SUCCESS CRITERION —
**MISSED.**", states the sprint's repair share fell by **42.6%** and **46.2%** relative on the
script's two like-for-like readings. Those two figures are computed from the **rounded** percentages
the same sentence names: `(35.7−20.5)/35.7 = 42.577…` → **42.6%**, and `(33.3−17.9)/33.3 = 46.246…` →
**46.2%**. Derived instead from the **raw counts** behind those percentages — `46/129 → 23/112` and
`43/129 → 20/112` — they would read **42.4%** and **46.4%**. ⚠️ **A 0.2pp difference each way**, and
the two bases move in opposite directions.

**Why (structural).** The sentence is **arithmetically correct on its own stated inputs**: it names
the rounded percentages and computes from exactly those, so a reader can reproduce it from the text in
front of them. Deriving from raw counts would be equally defensible and would make the sentence
irreproducible from its own words. ⛔ **Neither basis is wrong; the record simply has to pick one, and
it picked the one it shows its reader.** ⭐ **No claim flips: "more than two-fifths" is true under
both derivations**, and the `MISSED` verdict the sentence supports does not depend on the figure at
all. The board is **archived and final** — ⛔ **this entry records the basis, it does not change the
text.**

**Re-raise only if.** ⛔ **A future reviewer re-raising the 0.2pp on its own is settled by this entry
— do not re-litigate it.** ⭐ **Re-raise if, and only if, a CLAIM FLIPS on the basis chosen** — i.e. a
figure derived from the banner's stated inputs and the same figure derived from raw counts land on
opposite sides of a threshold the record asserts (a "more than two-fifths", a target, a pass/fail).
That would be a defect in the record, not a wording preference, and it is a different finding from
this one.
