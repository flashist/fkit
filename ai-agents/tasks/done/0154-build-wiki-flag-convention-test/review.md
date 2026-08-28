# Review — 0154

Task: 0154 — [brief](./brief.md)
File(s) under review: `test/wiki-flag-convention.test.js` (new, untracked), `test/prove-red.sh`
(task-0154 rows only: `run_wiki_flag_suite()`, step `0m`, mutations 27–28, header index count).
Plan: `plan.md` (approved, blob `974bcee98767d227ec217fdb9a0f02615690316a`) · Worklog: `worklog.md`
Status: closed-out — Round 1 processed and closed out 2026-08-28 (R1–R6 fixed and re-verified, R7
accepted as a residual on the owner's ruling); **Round 2 processed and closed out the same day** —
R8, R9 and R11 fixed and re-verified, R10 accepted as a residual on the owner's ruling. Nothing
blocks. Two owner-ruled follow-ups remain the producer's to file at close (the `0125` R3 discharge
note, gated on R1 — **its gate is now satisfied**; the pre-existing `0k`/`0l` wording).
Coverage: both reviewers measured — `codex-cli 0.145.0`, exit 0; Codex ran
`node --test test/wiki-flag-convention.test.js` (10/10 pass) **and** a `node -e` whole-line/CRLF probe
(`LF=1 CRLF=0`); this reviewer ran the suite plus seven redirected-corpus controls through
`FKIT_WIKI_FLAG_ROOT` — R1's duplicate-END + tail-drift tree against both the shipped extractor and a
replicated first-match one, R2's flag-line suffix against both the shipped matcher and a replicated
substring one, a uniform whole-block +4 shift, a genuine one-word reword, an extra END anchor below
the block, one above it, and a CRLF checkout — plus a T6(e) fixture replay and `npm test`
(792/792, then the gate at 28/28), all run AFTER the T6 rename landed.

**Round 1 verdict:** ⚠️ **Changes requested — 6 defects (none blocking).**

**Coverage (Round 1): both reviewers measured** (ADR-042 D1) — `codex-cli 0.145.0`, exit 0; Codex ran
`node --test test/wiki-flag-convention.test.js` (17.1 s, `ℹ pass 10`); the Round-1 reviewer ran the
suite plus eight redirected-corpus controls. *(Round 1's own evidence, kept inline — the `Coverage:`
header field above now carries Round 2's, per ADR-042's per-round rule.)*

**Round 2 verdict:** ⚠️ **Changes requested — 4 defects (none blocking).**

**Coverage (Round 2): both reviewers measured** (ADR-042 D1 — Codex executed, and so did this
reviewer). Evidence as in the `Coverage:` header field above.

Scope note: the working tree carries ~40 modified / ~20 untracked paths from other Sprint 6 work.
Task 0300's mutations 25/26 and its `bin/release.mjs` changes share this `prove-red.sh` diff and were
**not** reviewed. Nothing outside the files named above is reported on.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `test/wiki-flag-convention.test.js:199` | `extractBlock()` takes the **first** `BLOCK_END` match anywhere in the file, with no "matched exactly once" check. **Measured:** insert one identical duplicate of the closing sentence 32 lines into the block in all three files, then drift `lint`'s real tail (`The flag carries the ID only` → `…the ID and the BRIEF PATH`) — extraction truncates to 32 lines, clears the 30-line floor, and the whole suite is **10/10 green** over a genuine one-copy drift. This is the fifth fail-closed hole, and it silently defeats T7, the assertion that closes 0125's R3. The file's five subject assertions all use exactly-once; the two block anchors do not. |
| R2 | 1 | low | `test/wiki-flag-convention.test.js:127` (also `:128`, `:275`, `:288`) | A1/A2 are described and named as **"byte-identical"** but matched as a **substring count** (`countOccurrences(source, needle)`, `:163`), not whole-line equality. **Measured:** appending ` (deprecated — use the new form)` after the flag line's closing backtick, identically in all three files, leaves T1/T2/T7 green — 10/10 — although the two-line contract a caller "carries verbatim" visibly changed. Text *inside* the pinned span is genuinely protected; text before/after it on the same line is not. |
| R3 | 1 | low | `test/wiki-flag-convention.test.js:265` | T0's failure message asserts *"Everything below is trivially true over a thinned or empty set"*. **Measured false:** `SKILLS` is hard-coded and `readSkill()` throws on a missing file, so a thinned corpus reds T0 + T1–T5 + T7 (7 fail / 3 pass) and an empty corpus does the same. T0's real — and genuinely unique — protection is the **fourth-skill** case (measured: only T0 reds). The overstated half is inherited from `plan.md` §2's T0 row. |
| R4 | 1 | low | `test/wiki-flag-convention.test.js:195-213` | `extractBlock()`'s four throw messages are the only failure paths in the file with **no** "if this was a deliberate change, update `BLOCK_START` / `BLOCK_END` / `MIN_BLOCK_LINES` as part of it" instruction — every other message carries one. The floor message additionally asserts a single cause (*"the anchors are matching the wrong text"*) that is not the only one: a legitimate trim of the 41-line block below 30 lines lands there too. Contradicts the file's own claim at `:123` (*"Each failure message below says what to do instead"*). |
| R5 | 1 | low | `test/prove-red.sh:386` | Step `0m`'s stated justification — *"it is the only proof that `FKIT_WIKI_FLAG_ROOT` is honoured at all. If the env var were ignored, mutations 27 and 28 would run against the REAL claude/ tree and both would come back green"* — is **false for `0m` itself**: if the var were ignored, `0m` also runs the real tree and is green either way, so it cannot distinguish "honoured" from "ignored". What actually proves the seam is honoured is mutations 27/28 going red. `0m` proves the copied tree is not broken — which is the `0g` reasoning it also cites, and which is sound. **Raised by both reviewers.** ⚠️ The same wording pre-exists verbatim at `0k` (`:353`) and `0l` (`:376`) — pre-existing house text, **not** introduced by 0154; repairing those is out of this task's scope. |
| R6 | 1 | low | `test/prove-red.sh:1226` | Mutation 27 has no **exactly-one-site** guard. Mutations 25/26 assert their marker count `!= 1` and mutation 28 asserts a changed-line count `!= 1`, precisely to catch a `sed` that co-mutated a second copy (0288 R9's mode). Mutation 27's only extra guard is a survivor check (`grep -c '<clause>' == 0`), which is blind to that: a duplicated clause would be rewritten in both places and the check would still pass. The anchor is unique today (measured: exactly one line in `fkit-wiki-sync/SKILL.md`), so this is a guard-discipline gap, not a live failure. |
| R7 | 1 | low | `test/wiki-flag-convention.test.js:175` | **Frontier-move, not a defect — recorded so the disposition is on the record.** T1–T5 match anywhere in the **file**, not inside the extracted block. Moving A1/A2/A4/A5 out of the flag block into, say, a historical note — identically in all three files — keeps every assertion green, because T7 only compares the three copies to each other. The brief's assertions 1–5 specify file-level presence, A3 deliberately lives outside the block under `## Hard rules`, and the header pre-discloses the limit at `:40-41`. Scoping A1/A2/A4/A5 to the extracted block would be strictly stronger at low cost. Raised by Codex (X2). |
| R8 | 2 | low | `test/wiki-flag-convention.test.js:429-432` | **Fix-induced neighbour of R1.** T6(e)'s own comment claims a first-match extraction *"truncates here and **stays ABOVE the line floor**, so nothing else catches it"*. **Measured false of this fixture:** the duplicate END is spliced at index 20 of a 30-line `synthBlock(0)`, so a first-match extraction takes **21 lines** — below the 30-line floor, which would have thrown. The claim is true of the real-tree measurement the same comment cites (33 lines, re-measured this round), but not of the fixture it is attached to, so T6(e) does **not** isolate the R1 hole the way it says it does (planting the dup at index ≥ 29 would). ⚠️ The assertion itself is sound and was checked: reverting `extractBlock()` to first-match still reds T6(e), because the floor message does not match the expected `/END anchor matched 2 lines/` regex. Comment-only. Same class as R3/R4 — explanatory text asserting something measurably false. |
| R9 | 2 | low | `test/wiki-flag-convention.test.js:240-243` | **Fix-induced neighbour of R1 — the over-pin R4 corrected on the floor message, reintroduced on R1's new throw.** The duplicated-END throw asserts one specific consequence: *"the **first match would TRUNCATE the block**, and any drift below the truncation point would be invisible while the suite stayed green"*. That holds only when the duplicate sits **inside** the block. **Measured on the real tree, all three topologies:** a quoted closing sentence planted **below** the block → the first match *is* the real END, nothing truncates and nothing is hidden; planted **above** the block → the real fault is out-of-order anchors, not truncation; **inside** → the message is correct. The message states the inside case as if it were the only one. The START-side throw (`:235-237`) is correctly hedged (*"a wrong pick compares the wrong span"*) and is **not** affected. Message-only. **Raised by both reviewers** (Codex X1's second half). |
| R10 | 2 | low | `test/wiki-flag-convention.test.js:188` | **Behavioural regression introduced by R2.** `countWholeLines()` compares `source.split('\n')` lines to the needle, so on a **CRLF checkout** every line retains a trailing `\r` and both raw assertions find **0**. **Measured:** the three `SKILL.md` files CRLF-ized and otherwise byte-identical → **T1 and T2 red** (`found 0`); the pre-R2 substring matcher over that same tree → **count 1, green**. Raw mode therefore went from CRLF-tolerant to CRLF-intolerant. The repo has explicit CRLF discipline elsewhere (`test/structure-manifest.test.js:162` *"CRLF contract"*; `claude/fkit-claude-init.sh:421` *"`\r` is in the trim set on purpose: without it a CRLF file never matches its own markers"*), carries **no `.gitattributes`**, and this file's own header claims at `:39` *"It passes in a fresh clone."* ⚠️ **Severity capped at low, deliberately:** the failure is a false **RED**, never a false green — it can only over-report drift, never hide it — and the suite was **already** CRLF-red at T7 before Round 1 (measured against the unchanged `dedent()`), so R2 did not take a clean CRLF checkout to red. Raised by Codex (X2). **Disposition turns on an unstated project policy — see the NEEDS-DECISION below.** |
| R11 | 2 | low | `test/prove-red.sh:1229` | **Fix-induced neighbour of R6.** The new exactly-one-site guard counts **natural prose** — `grep -c 'spawn anyone\.' != 1` — where the three guards it was modelled on cannot collide with real content: mutations 25 and 26 count a **unique injected comment marker** (`mutation: --branch guard disarmed`), and 28 counts **changed diff lines**. If any future edit puts the string `spawn anyone.` into `fkit-wiki-sync/SKILL.md`, the guard false-fires and misdiagnoses it as a co-mutated second R5 clause. **Measured: 0 occurrences in the target file and 0 across all of `claude/` today**, so this is latent and fail-closed, not a live failure — the same *"guard-discipline gap, not a live failure"* standard R6 itself was accepted under. A replacement string that cannot occur naturally removes the collision. Raised by Codex (X3). |

### Verified and credited (checked, no finding)

1. **Non-vacuity holds, by construction.** `SKILLS` is a hard-coded list of three and `readSkill()`
   throws with the path on any read error, so T1–T5 cannot pass over an empty, thinned, or absent
   corpus — measured, both cases red. T0 adds the one case the hard-coded list cannot see: a
   **fourth** `fkit-wiki-*` skill (measured: only T0 reds). ND-2's ruling is vindicated on evidence.
2. **The plan §0.3 raw-hit measurement reproduces exactly.** Independently re-measured on today's
   text: A3 and A5 return **raw = 0, normalized = 1** in all three files; A1, A2, A4 return 1/1.
   Six false negatives a single-line matcher would produce — confirmed, not taken on the plan's word.
   The two-match-mode split is a correctness requirement, and it holds in both directions.
3. **`extractBlock()` fails closed on all four cases the plan names** — missing START, missing END,
   reversed anchors, sub-floor block — each throwing with the label. T6's control (the unmutated
   fixture extracts cleanly at exactly 30 lines) is present, so the four throws are not throwing for
   an unrelated reason. R1 is a **fifth** case, not a failure of these four.
4. **`dedent()` preserves relative nesting.** Re-run as this reviewer's own controls, on the **real**
   text rather than the synthetic fixture: one list item pushed +2 out of step in `fkit-wiki-lint`
   → T7 **red**; the whole `fkit-wiki-sync` block shifted by a uniform +7 → **10/10 green**, and
   T1/T2's raw match survives it because the pinned needles carry no leading whitespace. Not
   over-pinned on indent. T8's `blanketStrip` control correctly demonstrates that a per-line strip is
   blind to the bug.
5. **Mutations 27 and 28 are correctly anchored and red at their named assertions.** Anchors measured
   unique in their target files (`spawn the producer to close it yourself.` → one line in `sync`;
   `^   - \*\*Fully\*\* → complete\.$` → one line in `lint`, inside the block). Replicating both
   mutations and running the suite: 27 → red at *"the R5 clause"* (and at T7, which is honest — a
   deleted clause genuinely breaks uniformity, and the worklog records this); 28 → red at
   *"uniformity: identical modulo ONE uniform offset"* **only**. Both `grep -Eq` patterns match
   `node --test`'s actual `✖ <test name>` output. Both carry `cmp -s` no-op guards.
6. **The `prove-red.sh` header index agrees with the bodies.** 28 index lines, 28
   `# --- Mutation N:` blocks, numbering 1–28 contiguous, count word `TWENTY-EIGHT` correct.
7. **Both self-caught defects are genuinely gone.** No `path:NNN` coordinate anywhere in the test
   (grep for `<file>.<ext>:<digits>`: none). `test/prove-red.sh` decodes as clean UTF-8 end to end;
   line 52's `→` is a clean `\xe2\x86\x92` and no `\xc3\xa2` mojibake remains anywhere in the file.
8. **The header's limits are stated honestly, and every one of them checks out.** The `0141`
   green-throughout claim is stated first and unhedged; `claude/skills/` only (the string `.claude/`
   appears twice, in the comment that explains why the mirrors are *not* read — the worklog flags
   this precisely and it is not a constructed path); `skill-frontmatter.test.js`'s *"A skill's BODY …
   remains untested"* limitation exists verbatim at `:23-24` and is now correctly described as
   **partly** false — `structure-repair.test.js:287` does test one body, and the newly-untracked
   `init-claude-refresh-guard.test.js` writes only dummy `SKILL.md` fixtures, so the enumeration is
   still complete. The block lives in exactly the three canonical files and `claude/scaffold/` has no
   `skills/` tree, so `dual-home-parity.test.js` is genuinely not implicated.
9. **ADR-014 holds.** No `package.json` change, no `devDependencies` key, no parser or library.
   `npm test`'s `node --test test/*.test.js` picks the new file up; the stderr non-default-root
   announcement fires on every redirected run (observed in all eight controls).
10. **No `SKILL.md` under review was modified**, and nothing was committed.

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

**Round 1 — processed 2026-08-28** under `/fkit-sprint-ship-loop`'s standing approval (the owner
approved `plan.md` — blob `974bcee98767d227ec217fdb9a0f02615690316a`, hash re-verified on disk before
Step 1 — via `AskUserQuestion` in the live driver session; rulings ND-1/ND-2/ND-3 at `plan.md` §9).
Every finding was re-verified against the code by this coder before any fix; the reviewer's
measurements were reproduced independently, not taken on its word.

| #  | Verdict | Class | Action | Evidence |
|----|---------|-------|--------|----------|
| R1 | **CORRECT** | defect | **FIXED** — `extractBlock()` now requires **exactly one** match for BOTH anchors (`linesMatching()` + two new throws), the way the five subject assertions are already gated. T6 gains cases (e) duplicated END and (f) duplicated START. | **Reproduced before the fix:** one identical copy of the closing sentence spliced 32 lines into the block in all three files + a real drift of the tail below it (`The flag carries the ID only` → `…the ID and the BRIEF PATH`) → block truncates to 32 lines, clears the 30-line floor, suite **10/10 GREEN**. **Same tree after the fix → RED** at T7: *"END anchor matched 2 lines, expected exactly 1"*. |
| R2 | **CORRECT** | defect | **FIXED** — raw mode is now **whole-line equality modulo leading indent** (`countWholeLines()`), not `indexOf` substring counting. Leading indent stays tolerated (sync sits 3 spaces shallower); trailing text and trailing whitespace do not. Header §"two match modes" and the A1/A2 constant comment updated to say whole-line. | **Reproduced before the fix:** appending ` (deprecated — use the new form)` after the complete-flag line's closing backtick in all three files → **10/10 GREEN**. **Same tree after the fix → RED** at T1, *"found 0"*, naming `fkit-wiki-ingest`. |
| R3 | **CORRECT** | defect (message) | **FIXED** — T0's message no longer claims the tests below are *"trivially true over a thinned or empty set"*. It now states what T0 uniquely owns (the fourth-skill case) and records the measured truth about a thinned/empty corpus. The section header above T0 was corrected the same way. **Test kept** — ND-2 stands. | **Re-measured myself:** thinned corpus (lint removed) → **7 fail / 3 pass**; empty `skills/` → **7 fail / 3 pass**; fourth `fkit-wiki-*` skill → **1 fail**, T0 alone. The overstated half is measurably false; the fourth-skill half is measurably T0's alone. |
| R4 | **CORRECT** | defect (message) | **FIXED** — a shared `ANCHOR_ADVICE` tail now carries the *"update `BLOCK_START` / `BLOCK_END` / `MIN_BLOCK_LINES` as part of that same change"* instruction on **all six** `extractBlock()` throws. The floor message no longer asserts a single cause: it names the legitimate-trim case alongside the wrong-anchor case. | The file's own claim at `:123` (*"Each failure message below says what to do instead"*) is now true of every failure path, not only the assertion ones. |
| R5 | **CORRECT** | defect (comment) | **FIXED, narrowly** — step `0m`'s second justification is replaced: it now says plainly that `0m` **cannot** distinguish "honoured" from "ignored" (it reads a green tree either way) and that mutations 27/28 going red are what prove the seam. `0m` itself **kept** — its `0g` reasoning is sound and the reviewer confirmed it in scope. **`0k`/`0l` NOT touched** — pre-existing house wording, owner ruled a follow-up. | Read of `run_wiki_flag_suite()` (`test/prove-red.sh:166-172`): with `FKIT_WIKI_FLAG_ROOT` ignored the suite reads the real `claude/`, which is green — so `0m` is green under both hypotheses. Claim confirmed false as written. |
| R6 | **CORRECT** | defect (guard gap) | **FIXED** — mutation 27 gains the exactly-one-site guard 25/26/28 each carry: the replacement text must land **exactly once** (`grep -c 'spawn anyone\.' != 1`), which the survivor check cannot see. | **Red-first, standalone:** planted a second copy of the clause in a `fkit-wiki-sync` fixture, ran the mutation's own `sed` → survivor check **PASSED BLIND** (0 survivors), new guard **CAUGHT** it (replacement landed 2×). Guard does not false-fire on the live path: full gate green, mutation 27 red at its named assertion. |
| R7 | **CORRECT as stated** | **frontier-move**, not a defect | **NOT FIXED — accepted as a residual** on the owner's live `AskUserQuestion` ruling of 2026-08-28, *"Accept as residual"*. Matchers deliberately **not** tightened. Recorded in *Accepted residuals* below. | The limit is real and pre-disclosed by the file's own header at `:40-41`; the brief specifies file-level presence for assertions 1–5 and A3 deliberately lives outside the block under `## Hard rules`. Scoping is a scope change, not a bug fix. |

**Verification after the fixes** (nothing was edited after this run):

* `node --test test/wiki-flag-convention.test.js` → **10 pass / 0 fail**.
* `npm test` → **792 tests / 792 pass / 0 fail**, then `bash test/prove-red.sh` → **✓ hard gate PASSED**,
  all **28** mutations red at their named assertions, `0a`–`0m` all green.
* **Red-first proofs for the new guards** (a guard nobody has seen fail is not a guard): R1's and R2's
  guards each re-run against the exact tree that was **green before the fix** and went **red at the
  named assertion** — evidence in the table above. R6's guard proven red standalone against a
  co-mutated fixture.
* The three wiki `SKILL.md` files are **blob-identical to HEAD** — re-confirmed after the run
  (`git hash-object` == `git rev-parse HEAD:<path>` for all three).
* `package.json` unchanged; no `devDependencies` key exists (ADR-014 holds). Nothing committed, nothing
  pushed, no task file moved, `plan.md` untouched, nothing written under `ai-agents/wiki-vault/`.

**Deliberately not done, and why:**

1. **R7's matchers** — owner-ruled residual (above).
2. **`0k` / `0l`'s identical false wording** (`test/prove-red.sh:353`, `:376`) — pre-existing text from
   tasks 0288/0204, owner ruled *"File a follow-up"*; the producer files it at close. Out of scope here.
3. **`0125`'s R3 ledger** — not edited by this coder. Owner ruled the discharge note is a **separate
   task, gated on R1**; the producer files it at close.
4. **T6's test name** was left plan-verbatim and flagged rather than renamed — then **ruled and done**.
   The owner ruled live via `AskUserQuestion` on 2026-08-28, **"Rename it now"**, so T6 is now
   `extraction fails closed: missing / duplicated / reversed anchors and a sub-floor block all THROW`,
   covering all six cases. Recorded in the worklog as an **owner-approved deviation from `plan.md` §2's
   verbatim test name**; `plan.md` itself is still untouched. No `prove-red.sh` mutation names this
   assertion (27 and 28 name T5 and T7) — verified by grep.

**Round 2 — processed 2026-08-28**, same standing approval (owner-approved `plan.md`, blob
`974bcee98767d227ec217fdb9a0f02615690316a`, re-verified unchanged on disk this round). Four findings,
all re-measured by this coder before any fix. **Three are text-only; one changed a fixture** (R8), and
that one carries its own red-first proof. **No assertion, no matcher and no gate changed behaviour.**

| #  | Verdict | Class | Action | Evidence |
|----|---------|-------|--------|----------|
| R8 | **CORRECT** | defect (comment + weak fixture) | **FIXED — fixture, not just the comment.** The duplicate END is now planted at the LAST body line (`splice(len-1, …)`), so a first-match extraction takes exactly 30 lines — at the floor, therefore above it — and the exactly-once gate is the only thing that can catch it. Comment and assertion message rewritten to say why the splice position is load-bearing. | **Re-measured:** shipped fixture spliced at index 20 of a 30-line block → first-match extraction **21 lines**, below the 30-line floor. **Proved it now reds for the right reason:** with the exactly-once gate disabled, the NEW fixture fails with *"Missing expected exception"* — no throw at all. The OLD fixture failed with *"extracted only 21 lines, below the 30-line floor"* — the floor, i.e. the wrong gate. R8's claim reproduced exactly, in both directions. |
| R9 | **CORRECT** | defect (message) | **FIXED** — the duplicated-END throw no longer states truncation as the only consequence. It now names all three topologies: **inside** → truncation hides drift below the cut; **above** → anchors read as out of order; **below** → the block extracts correctly but the closing sentence is quoted where it should not be. Closes with *"The gate refuses to guess between them."* The START-side throw was already hedged and is untouched. | **Re-measured all three on the real tree** (`fkit-wiki-sync`, block 99–139): dup below → first END **is** the real end, nothing truncated and nothing hidden; dup above → first END at 94 precedes START at 100, out-of-order is the real fault; dup inside → truncation. The message was true of one case in three. |
| R10 | **CORRECT** | **behavioural regression**, owner-ruled | **NOT FIXED — accepted as a residual** on the owner's live `AskUserQuestion` ruling of 2026-08-28, *"Not supported — accept as residual"*. **The matcher is deliberately unchanged.** The header's `:39` claim *"It passes in a fresh clone"* **is corrected** to name an **LF** checkout, with the CRLF behaviour, its fail-closed direction and the re-raise pointer stated inline. Recorded in *Accepted residuals* below. | Accepted on the reviewer's own measurement and its severity cap, which I did not re-run: the failure is a false **RED** and never a false green — this guard can only over-report drift, never hide it — and T7 was **already** CRLF-red before this task, so R2 broke no clean state. fkit states no CRLF policy and ships no `.gitattributes`. |
| R11 | **CORRECT** | defect (guard discipline) | **FIXED** — mutation 27's replacement now carries an **injected marker** (`spawn anyone (mutation: R5 clause deleted).`) and the exactly-one-site guard counts **that marker**, not natural prose — the shape mutations 25/26 already use. A "marker absent" arm was added alongside, matching 25/26 arm for arm. | **Re-measured:** `spawn anyone.` occurs **0** times in the target file and **0** times across all of `claude/` today — latent, exactly as the reviewer said, and exactly why it is worth removing before it is not. `mutation: R5 clause deleted` cannot occur naturally in a `SKILL.md`. Gate re-run: mutation 27 still red at its named assertion, 28/28. |

**Settled, not reopened:** R1's new gate rejecting an anchor sentence quoted once elsewhere in the file
is a **frontier-move, not a defect** — deliberate, fails closed, carries actionable advice, and both
anchors measure exactly 1 today. The reviewer filed no row for it; only its *message* was the defect,
and that is R9, fixed above.

**Verification after the Round 2 fixes:**

* `node --test test/wiki-flag-convention.test.js` → **10 pass / 0 fail**.
* `npm test` → exit 0, **792 tests / 792 pass / 0 fail**, then **✓ hard gate PASSED**, all **28**
  mutations red at their named assertions, `0a`–`0m` green, **zero** `✗`/`✖` in the whole log.
* **A second, final `npm test` was run AFTER every edit of this round had landed — code, this ledger
  and the worklog — so that nothing at all follows it.** Round 1's version of this claim was **wrong**
  and is corrected in the worklog: the T6 rename touched the test file after Round 1's recorded run.
* Checked, not assumed, that the ordering is even necessary: `grep -rnE "readFileSync\([^)]*(worklog|review)" test/`
  returns **nothing** — no test reads either file's content.
* Three wiki `SKILL.md` files **blob-identical to HEAD**. `plan.md` unchanged
  (`974bcee98767d227ec217fdb9a0f02615690316a`). `package.json` unchanged, no `devDependencies` key.
  No commit, no push, no task file moved, nothing written under `ai-agents/wiki-vault/`.

**Deliberately not done this round:**

1. **R10's matcher** — owner-ruled residual. CRLF tolerance was **not** added.
2. **R7's matchers** — Round 1's residual, re-checked by the reviewer this round: re-raise condition
   unmet, shape well-formed. Untouched.
3. **`0k` / `0l`'s pre-existing false wording** and **`0125`'s R3 discharge note** — both owner-ruled
   follow-ups for the producer to file at close. Unchanged from Round 1.

## Accepted residuals (shared, do-not-re-litigate)

### R1-residual — T1–T5 match anywhere in the FILE, not inside the extracted block

*Recorded 2026-08-28 on the owner's live `AskUserQuestion` ruling in the `/fkit-sprint-ship-loop`
driver session: **"Accept as residual (Recommended)"**. Source: Round 1 finding **R7**
(`test/wiki-flag-convention.test.js:175`), raised by Codex as X2.*

**What.** T1–T5 assert their five subjects are present **somewhere in the file**. They do not assert
the subjects sit **inside** the block `extractBlock()` extracts. Moving A1/A2/A4/A5 out of the flag
block — into, say, a historical note — *identically in all three files* keeps every assertion green,
because T7 only compares the three copies to each other. The file states this limit itself, at
`:40-41`: *"It asserts five subjects are PRESENT and the three copies are UNIFORM. It does not verify
the block is correct, complete, current, or followed by anything at runtime."*

**Why (structural).** The brief's assertions 1–5 specify **file-level presence**, and A3 deliberately
lives **outside** the block, under each file's `## Hard rules` heading — so a block-scoped matcher
could not express A3 at all without a second mechanism. Scoping A1/A2/A4/A5 to the extracted block
would be strictly stronger, but it is a **change to the ruled scope of the deliverable**, not a repair
of it. The owner ruled the shipped scope is the intended one.

**Re-raise only if** a subject is found to have **migrated out of the block** — in any of the three
files, in any form. That is the condition; short of it, do not re-litigate the file-level matchers.

**Not covered by this acceptance:** the two anchor holes R1 and R2 named. Both were **fixed**, not
accepted — duplicate-anchor truncation and substring-vs-whole-line matching are defects and are closed.

### R10-residual — a CRLF checkout reds the two raw assertions

*Recorded 2026-08-28 on the owner's live `AskUserQuestion` ruling in the `/fkit-sprint-ship-loop`
driver session: **"Not supported — accept as residual (Recommended)"**. Source: Round 2 finding **R10**
(`test/wiki-flag-convention.test.js:188`), raised by Codex as X2.*

**What.** `countWholeLines()` — the whole-line matcher Round 1's R2 fix introduced — compares
`source.split('\n')` lines against the needle. On a **CRLF checkout** every line keeps a trailing
`\r`, so **T1 and T2 find 0** and go red over files that are otherwise byte-identical to HEAD.
Measured by the reviewer: CRLF-ized tree → T1/T2 red (`found 0`); the pre-R2 substring matcher over
that same tree → count 1, green. Raw mode went from CRLF-tolerant to CRLF-intolerant.

**Why (structural).** A CRLF checkout is **not a supported state** of this repo: fkit states no CRLF
policy and ships **no `.gitattributes`**. Three things cap the cost, and all three were measured, not
assumed:

1. **The failure is a false RED, never a false green.** The guard can only **over-report** drift — it
   cannot hide any. Fail-closed is the direction this whole file was built to fail in.
2. **A CRLF checkout was already red before this task pinned anything** — T7 reds on the unchanged
   `dedent()`. R2 did not take a clean CRLF state to red; there was no clean CRLF state.
3. **Loosening the matcher costs the guarantee R2 exists to provide.** Stripping `\r` before comparing
   re-opens the door to tolerating what is meant to be a byte-exact contract line.

The header at `:39` now names the qualification — *an LF checkout* — rather than claiming the file
"passes in a fresh clone" unconditionally. **The matcher is deliberately unchanged.**

**Re-raise only if** fkit adopts a **stated CRLF policy**, or ships a **`.gitattributes`**. Either
makes a CRLF checkout a supported state, and at that point this is a defect rather than a residual.
Short of one of those two, do not re-litigate the matcher.

**Not covered by this acceptance:** the whole-line matcher itself. R2 was a **defect and was fixed**;
what is accepted here is only its behaviour on an unsupported line-ending state.

## Re-litigates settled decisions (suppressed)

None. No finding from either reviewer matched an accepted residual or an ADR "Re-raise only if"
condition whose condition was unmet. Explicitly checked against the owner's 2026-08-28 rulings
**ND-1** ("A: 0154 adds no walk"), **ND-2** ("Include T0"), **ND-3** ("File nothing now"), and against
ADR-014 (zero devDependencies, hand-rolled), ADR-005, ADR-018, ADR-033 and ADR-042. Neither reviewer
proposed a shared `SKILL.md` walk, a helper module, a general prose-pinning framework, or a
markdown/YAML dependency.

### Round 2 — suppressed and classified

**Suppressed as settled: none.** Neither reviewer re-raised **R1-residual** (Round 1's R7), and its
re-raise condition is **unmet on measurement, not on assumption**: A1, A2, A4 and A5 are all still
**inside** the extracted block in all three files, and A3 is outside it under `## Hard rules`, exactly
as the residual's *Why* describes. The residual's **What / Why (structural) / Re-raise only if**
structure is well-formed, and the text it quotes from the file header is **verbatim-identical** to
`test/wiki-flag-convention.test.js:40-41`. Its *"Not covered by this acceptance"* clause correctly
records R1 and R2 as fixed rather than accepted. Also re-checked, nothing matched: **ND-1**, **ND-2**,
**ND-3**, the T6 rename, keeping `0m`, leaving `0k`/`0l`, not editing `0125`'s ledger, and ADR-014.

**Classified as a frontier-move — no row, no action recommended.** `extractBlock()` counts both
anchors across the **whole file**, so a legitimate one-off quotation of either anchor elsewhere in a
`SKILL.md` (a fenced example, a changelog line) is now **rejected** where the pre-R1 first-match code
accepted it (`:223-224`; measured — an extra END anchor planted below the block throws). This is a
**deliberate tightening, not a defect**: exactly-once is the discipline the file's five subject
assertions already use, R1 adopted it knowingly, it fails **closed** and loudly, and `ANCHOR_ADVICE`
tells the editor exactly what to change. Both anchors measure **exactly 1 occurrence in each of the
three files today**. Raised by Codex as X1's first half; **X1's second half is a genuine defect and is
recorded as R9.**

### Round 2 — verification re-run, and one gap in the Round-1 record

Re-run by this reviewer on the **shipped** tree, all of it **after** the T6 rename landed:

* `npm run test:unit` → **792 tests / 792 pass / 0 fail / 0 skipped / 0 todo**.
* `npm test` (`node --test test/*.test.js && bash test/prove-red.sh`) → **exit 0**, `✓ hard gate
  PASSED`, all **28** mutations red at their named assertions, `0a`–`0m` green.
* The three wiki `SKILL.md` files are **blob-identical to `HEAD`** (`git hash-object` ==
  `git rev-parse HEAD:<path>` for ingest, sync and lint).
* `plan.md` is **untouched** — `git hash-object` = `974bcee98767d227ec217fdb9a0f02615690316a`, the
  approved blob exactly.
* `package.json` unchanged, **no `devDependencies` key** (ADR-014 holds). No `SKILL.md` under review
  modified, nothing under `ai-agents/wiki-vault/` touched, nothing committed or pushed.
* `prove-red.sh` index integrity re-checked: **28** index lines, **28** `# --- Mutation N:` blocks,
  count word `TWENTY-EIGHT`. `ANCHOR_ADVICE` appears **7×** (one definition + six throws), so R4's fix
  covers every `extractBlock()` failure path.
* **The T6 rename is clean.** Index lines `:53-54` name **T5** and **T7**, not T6, and both
  `grep -Eq` patterns still match `node --test`'s live output — no `prove-red.sh` grep depends on the
  renamed string. The worklog's Step-2 transcript is **annotated rather than falsified**, and
  `plan.md:109` keeps the old name **by design**. No stale reference was left behind.

⚠️ **One gap, reported not as a finding but so the record is straight** (`worklog.md`, which is not a
file under review): the worklog's verification block states *"The only files edited after the final
run are **this worklog and `review.md`** — records, not code."* That is **one edit stale** — the T6
rename modified `test/wiki-flag-convention.test.js` at **20:52:58**, after that run, and no full
post-rename `npm test` / gate run is recorded. **The substance is discharged by the runs above**,
which this reviewer started after the rename; only the record needs a line corrected.
