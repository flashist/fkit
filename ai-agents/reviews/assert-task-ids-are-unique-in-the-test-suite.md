# Review — assert-task-ids-are-unique-in-the-test-suite

Task: `ai-agents/tasks/backlog/assert-task-ids-are-unique-in-the-test-suite.md` (ID `0101`)
File(s) under review: `test/task-id-uniqueness.test.js` (new — the whole review surface)
Non-substantive in scope: `ai-agents/tasks/backlog/assert-task-ids-are-unique-in-the-test-suite.md` (Status), `ai-agents/sprints/sprint-2.md` (sprint row), `ai-agents/plans/assert-task-ids-are-unique-in-the-test-suite.md` (new plan)
Status: **closed-out** (reviewer, round 5, 2026-07-20)

**✅ Closed out — 19 findings raised, all resolved; no open confirmed defects.** Rounds 1–5, two
model-diverse reviewers. Closing basis is recorded in *Round 5 — close-out* below, including what this
review can and cannot claim.

Reviewers run (round 1): fkit-reviewer (own pass) + Codex (`codex exec --sandbox read-only`, codex-cli 0.144.4). Both ran; coverage is not partial.
Reviewers run (round 2): fkit-reviewer (own pass, targeted at the round-1 fixes per the coder's request). **Codex was NOT re-run this round** — round 2 is a verification pass over six named fixes, not a fresh surface. Coverage of the *new* code is therefore single-reviewer; flagged rather than assumed.
Reviewers run (round 3): fkit-reviewer (own pass) **+ Codex re-run over the round-2 code it had never seen** (`codex exec --sandbox read-only`, gpt-5.6-sol). Coverage is **not** partial. ⚠️ One limit, recorded rather than assumed: Codex's sandbox blocked `mkdtempSync` (EPERM), so **all of its filesystem findings were static analysis only**. Each was re-verified here by execution — which is how R15 was caught as partially incorrect and R16 found to be worse than reported.

### Round 3 — reviewer dedupe

Raised **independently by both reviewers** (agreement, not corroboration — Codex saw neither my findings
nor the ledger): R11-E2 ≡ Codex X2 · R11-E1 ≡ Codex X4 · R12 ≡ Codex X6.

**Folded into R11** rather than recorded separately — Codex X1 (backtick in the info string) and X3
(4-space/tab-indented opener, which CommonMark reads as an indented code block, not a fence). Both are
real spec deviations and both are **further triggers of R11's positional-pairing fault**, so they are
one finding, not three. **Severity downgraded from Codex's "high" to a note on R11:** in isolation each
makes the parser *more* conservative — it strips something that was never a fence — which fails in the
**loud** direction (a false "missing ID"), not the silent one. They become dangerous only through R11's
pairing shift, which is already recorded at high.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `test/task-id-uniqueness.test.js:263-266` | The brief required two **independently derived** counts ("assert the discovered brief count is non-zero, and assert it equals the count of `## ID` fields found"). Both counts are derived from the same `discoverBriefs()` walk, so they cannot disagree by construction. `records.length > 0` catches **total** vacuity only; a scan that finds 3 of 101 briefs satisfies every live assertion and misses duplicates among the other 98. Raised by both reviewers (Codex X2). |
| R2 | 1     | medium | `test/task-id-uniqueness.test.js:69-73` | The `catch { continue }` around `readdirSync(boardDir)` swallows **every** error, not just ENOENT. An unreadable/renamed board (e.g. `done/`, which holds 76 of 101 briefs) contributes zero records silently; with R1 unfixed the live test then reports green over a quarter of the corpus. Same blast radius as R1, different fix. Raised by Codex (X1). |
| R3 | 1     | medium | `test/task-id-uniqueness.test.js:55` | `readId()` takes the **first** `.match()` and neither recognizes Markdown fences nor rejects multiple `## ID` fields. A brief carrying a fenced `## ID` example above its own field parses the example. Verified: `readId("# T\n\n\`\`\`\n## ID\n9999\n\`\`\`\n\n## ID\n0101\n")` → `"9999"`. `9999` passes the `^[0-9]{4}$` format check, so nothing downstream catches it — a wrong ID can mask a real duplicate or manufacture a phantom one. Raised by both reviewers (Codex X3). |
| R4 | 1     | low    | `test/task-id-uniqueness.test.js:55` | Two formatting variants yield a false "missing ID" rather than the real value: a separator line carrying whitespace (`## ID\n  \n0042`) and any trailing content on the value line (`## ID\n0042 trailing`). Both fail **loudly**, so this is a false-positive/diagnosis-quality issue, not a silent-skip one. Surfaced by Codex's probe transcript; confirmed independently. |
| R5 | 1     | low    | `test/task-id-uniqueness.test.js:76-88` | Symlinked briefs are silently skipped: with `withFileTypes`, a symlink reports `isFile() === false` **and** `isDirectory() === false`, so it falls through to `continue`. Verified empirically. No symlinks exist under `ai-agents/tasks/` today, but symlink hazards are live concerns elsewhere in this sprint (two open `gate-*-symlink-*` briefs). A silent skip is the exact failure class this file's header warns against. |
| R6 | 1     | low    | `test/task-id-uniqueness.test.js:76-77` | The pre-76 branch matches **any** `*.md` directly in a board dir. A non-brief file (e.g. a `README.md`) would be discovered with `id === null` and fail the live test with "briefs carry no `## ID` field" — a loud but misdiagnosing failure. Not live: the scaffold ships only `.gitkeep` in the three boards. Informational. |
| R7 | 2     | **high** | `test/task-id-uniqueness.test.js:61-67` | **⚠️ THE R3 FIX IS INCOMPLETE — the original silent-wrong is fully restored in two common cases.** `stripFences()` toggles on any line starting with ` ``` ` or `~~~`, ignoring both markdown fence rules: a fence closes only with the **same character** and a run **at least as long**. Verified: (A) a 4-backtick fence wrapping a 3-backtick example → `readId` returns **`"9999"`**, and `idFields` returns `["9999","0042"]`; (B) a `~~~` line inside a ` ``` ` fence → `readId` returns **`"9999"`**. `9999` passes the four-digit format check, so nothing downstream notices. **The remedy is weakest exactly where its justification is strongest**: the coder chose fence-stripping over "fail on >1" specifically so a brief could *document* the ID format — and a nested/4-backtick fence is the standard way to write a fenced example of a fence. |
| R8 | 2     | medium | `test/task-id-uniqueness.test.js:117-124, 155-165` | **⚠️ NEWLY INTRODUCED BY ROUND 2 — neither half existed before.** R5's fix made `kindOf()` use `statSync` (which **follows** symlinks, where the old dirent check skipped them), and R1's fix added **unbounded recursion**. Together, a symlink pointing at an ancestor directory makes `countIdBearingFiles()` descend the cycle. Verified: a one-brief fixture with `backlog/loop -> <root>` counts **16** instead of 1. It terminates only by exhausting `PATH_MAX` (ENAMETOOLONG → caught → `'other'`), not by design. `discoverBriefs()` is not recursive, so it still returns 1 → the R1 cross-check fires with "discoverBriefs() is missing briefs the corpus actually contains", pointing the reader at the **wrong repair**. No depth cap, no visited-inode set. |
| R9 | 2     | low    | `test/task-id-uniqueness.test.js:61-67` | An **unterminated** fence blanks every line after it, including a real `## ID` below — verified: ` ``` `/`example`/``/`## ID`/`0042` → `readId` returns `null`, a false "missing ID". The coder predicted this and asked; confirmed real. Low because it fails **loudly**, and because `## ID` sits at line 3-4 of every brief in the corpus (above any fence). |
| R11 | 3     | **high** | `test/task-id-uniqueness.test.js:73-90` | **⚠️ THIRD ITERATION OF THE SAME DEFECT — `stripFences()` still leaks, two ways.** Markers are paired **positionally** (1st with 2nd, 3rd with 4th…), so any stray or non-conforming marker inverts inside/outside for the rest of the file. Verified: (E1) an **unterminated** opener above the real field plus a later well-formed fenced example → `readId` returns **`"9999"`** — the real `0042` is blanked *and* the example leaks; R9's rule does not save it because the stray opener still consumes the next valid opener as its closer. (E2) a **closing fence with trailing content** (` ``` note ` — not a close in CommonMark) → `readId` returns **`"8888"`**, a value that is inside the fence in real markdown. Live exposure: **8 briefs in the corpus already use fences**; 0 currently have an odd marker count, so this is one stray backtick away, not theoretical. |
| R12 | 3     | medium | `test/task-id-uniqueness.test.js:194-213` vs `:149-169` | **⚠️ NEWLY INTRODUCED BY THE R8 FIX — the two walks are now structurally inconsistent.** `countIdBearingFiles()` dedups by `realpathSync`, but `discoverBriefs()` does not. A **legitimate (non-cycle)** symlinked task folder is therefore counted **twice by discovery and once by the cross-check**. Verified in the post-76 folder layout: discovery 2, independent 1 → the R1 assertion fires with *"discoverBriefs() is missing briefs the corpus actually contains"* when discovery in fact found **more**, not fewer. Worse, that symlink creates a **genuine duplicate ID** — exactly what this guard exists to catch — so the guard reports the wrong failure and hides the real one. |
| R13 | 3     | low    | `test/task-id-uniqueness.test.js:454-458` | The test *"a symlink to a sibling dir is not double-counted (R8)"* passes **only by accident of its fixture layout**. It uses the **flat** layout, where the mirrored directory contains `b.md` and no `brief.md`, so `discoverBriefs()` skips it and the two counts agree at 2. Re-point the same fixture at the **folder** layout — the layout this entire guard exists to survive — and the walks diverge (R12). The test asserts the right number for the wrong reason, and codifies the R12 inconsistency as intended behavior. |
| R14 | 3     | **high** | `test/task-id-uniqueness.test.js:111-114` | **A REAL DUPLICATE IS SILENTLY MISSED — and this has nothing to do with fences.** `readId()` returns `found[0]`, discarding every further `## ID` field even when they sit **outside** any fence. Verified: brief A carrying `## ID 0001` *and* `## ID 0042`, brief B carrying `## ID 0042` → `idFields(A)` correctly finds `["0001","0042"]`, but `readId(A)` reports only `0001`, so `findDuplicates()` reports **no collision** while `0042` genuinely appears in two briefs. Every format check passes. The R1 cross-check is blind too, because `countIdBearingFiles()` tests `.length > 0`, not the count. This is the guard's core purpose failing silently. Raised by Codex (X5); verified independently. |
| R16 | 3     | medium | `test/task-id-uniqueness.test.js:194-213` | **The independent walk has no containment boundary and reads outside the repo.** A symlink such as `tasks/backlog/vendor -> /external/docs` is followed and every external `*.md` carrying an ID is counted. Verified: a fixture with 1 real brief + a symlink to an external dir holding 3 ID-bearing files counts **4**; discovery counts 1 → false cross-check failure. Worse than the count: the walk **read files outside the repository entirely** — no read-only violation (nothing is written), but an unbounded traversal in the suite's first repo-reading test deserves an explicit boundary. Raised by Codex (X8); verified by execution — Codex's own sandbox could not run it. |
| R17 | 3     | low    | `test/task-id-uniqueness.test.js:434-437` | Test *"an indented fence is still a fence (R7)"* is **effectively tautological**: its decoy heading is itself indented (`  ## ID`), which `:101`'s `^##` anchor can never match regardless of fencing. Verified — the test still passes with `stripFences()` replaced by an identity function. It does not test indented-fence stripping at all. Raised by Codex (X9); verified independently. |
| R15 | 3     | low    | `test/task-id-uniqueness.test.js:144, :198` | **R2's lesson was not applied to the other two catch sites.** `kindOf()` (`catch { return 'other' }`) and `countIdBearingFiles()`'s `realpathSync` (`catch { return 0 }`) still swallow **every** errno, the exact class of defect R2 was raised about. **Partially correct as raised (Codex X7):** its specific repro does **not** reproduce — a `chmod 000` nested directory throws loudly through `readdirOrEmpty()`, so R2's fix does cover the common case. The narrow silent path is real but requires `realpathSync` itself to fail. Recorded at low severity with the correction attached. |
| R18 | 4     | medium | `test/task-id-uniqueness.test.js` — `discoverBriefs()` vs `countIdBearingFiles()` | **The R12 dedup was applied to only one walk's notion of file identity.** Discovery dedups **files** by realpath (`seenFiles`); the independent walk dedups **directories** but counts files with no dedup at all. Verified: one real brief plus a symlink to that same file → discovery **1**, independent **2**. This is R12's exact shape, moved from directories to files. Fails **loud** (a false cross-check red), not silent. |
| R19 | 4     | medium | `test/task-id-uniqueness.test.js` — `countIdBearingFiles()` root bound vs `discoverBriefs()` | **The R16 containment bound was applied to only one walk.** `countIdBearingFiles()` refuses anything resolving outside `root`; `discoverBriefs()` has no bound and deliberately follows off-tree symlinks (asserted by the R5 test *"a symlink to a brief outside the boards is still discovered"*). Verified: a symlinked task folder outside the tree containing `brief.md` → discovery **2**, independent **1**. The two walks now disagree on **where the corpus ends**. Fails **loud**. ⚠️ Note the tension: R5 requires discovery to follow off-tree symlinks; R16 requires the walk not to. That is a genuine design question, not a coding slip — the two rules were each right in isolation and were never reconciled. |
| R10 | 2    | info   | `test/task-id-uniqueness.test.js:155-165` | Scoping note, **not a defect**: `countIdBearingFiles()` shares `idFields()` and `kindOf()` with discovery, so the cross-check detects **traversal** divergence only — it is structurally blind to **parser** errors. Concretely, it cannot see R7: a fence-leaked brief still yields one record and one ID-bearing file, so `101 === 101` holds while the parsed ID is wrong. Recorded so the R1 fix is not over-trusted as covering R7. |

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

**Round 1 response — coder, 2026-07-20.** All six verified against the code before acting. **All six
CORRECT; five fixed, one dispositioned.** Every fix is red-proved by a named mutation against a green
unmutated control — a fix without a red proof is an assertion of good intent, not a tested change.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (spec deviation) | Added `countIdBearingFiles()` — a **structurally different** walk: recursive, depth-unlimited, layout-agnostic. Live test asserts it equals discovery's ID-bearing count. The two can now genuinely disagree. | **Fixed** |
| R2 | CORRECT | Defect (latent) | `readdirOrEmpty()` returns `[]` on **ENOENT only**; any other errno throws with the directory and code named. A missing board is nothing; an unreadable one is a failure. | **Fixed** |
| R3 | CORRECT | Defect (latent) | `stripFences()` blanks ``` and `~~~` regions before parsing. **Chose fence-awareness over the reviewer's suggested "fail on >1 `## ID`"** — see note below. | **Fixed** |
| R4 | CORRECT | Defect (low) | `readId()` rewritten line-based: whitespace-only separators skipped, trailing content on the value line returned as-is for the format assertion to judge. | **Fixed** |
| R5 | CORRECT | Defect (low) | `kindOf()` uses `statSync` (follows links) instead of the dirent flags. Symlinked briefs **and** symlinked post-76 task folders now discovered; dangling links skipped without throwing. | **Fixed** |
| R6 | CORRECT | Informational | Behavior unchanged — any `*.md` in a board dir is still treated as a brief. **Failure message now names the other likely cause** ("or the file is not a brief at all"). Underlying behavior put to the owner as a residual. | **Message fixed; residual pending owner** |

### On R3 — I did not take the reviewer's suggested remedy, and why

The reviewer offered "fail on more than one `## ID`". **Fence-stripping is strictly better** and I took
it instead:

- It fixes the defect **by construction** — a fenced example is not an ID field, so it never competes.
- "Fail on >1" would **punish a brief for legitimately documenting the format**, which briefs in this
  corpus plausibly will (this very ledger contains fenced markdown). It converts a documentation choice
  into a build break.
- It does not depend on the corpus convention holding. Task 75's ledger recorded "no brief contains a
  decoy `## ID` example" as a *verified fact*; this test would have silently promoted that observation
  into a load-bearing assumption. Fence-awareness removes the dependency rather than enforcing it.

**Red-proved:** disabling fence detection reds both R3 tests, and pre-fix the shadowed value was
`"9999"` — which passes the four-digit format check, confirming the reviewer's silent-wrong analysis
exactly.

### On the reviewer's three owner-questions

Answered by fixing rather than by dispositioning, which I judged in-plan and mechanical in each case:

1. **R1** — the brief *explicitly required* two independently derived counts. Not building it was a
   deviation from an approved spec, not a tradeoff open to acceptance. **Fixed.**
2. **R3** — **fixed**, by a route neither reviewer proposed (above).
3. **R5** — **fixed** (mechanical). **R6 remains open for the owner** — it is a genuine behavioral
   choice, not a defect, and the ship-loop requires an owner ruling before a residual is recorded.

### Verification after the fixes

- `npm test` — **413 pass / 0 fail** (was 402); `prove-red.sh` hard gate passed.
- Named-mutation red proofs, green control at 23/23: fence detection off → 2 R3 tests red · blanket
  catch restored → R2 test red · `lstatSync` (non-following) → 2 R5 tests red · recursion removed →
  2 R1 tests red.
- Live corpus, both independent walks: **101 = 101**, contiguous `0001`–`0101`, zero duplicates.
- `git status` shows only intended edits — no test-generated writes.

---

**Round 2 response — coder, 2026-07-20.** All four verified against the code before acting. **All four
CORRECT.** Two of them — **R7 and R8 — are regressions my own round-1 fixes introduced**, which is the
single most important fact in this round and belongs at the top of it, not in a footer.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R7 | CORRECT | **Defect (high) — regression I introduced** | `stripFences()` rewritten to track the opening fence's **character and run length**, closing only on the same character with a run at least as long. Both reported leaks (4-backtick nest; `~~~` inside ```` ``` ````) reproduce pre-fix as `"9999"` and are now correct. | **Fixed** |
| R8 | CORRECT | **Defect (medium) — regression I introduced** | `countIdBearingFiles()` carries a `seen` set of **`realpathSync`** paths. A directory already walked under another name is recognized and not re-descended. Chose real-path identity over a depth cap: a cap would mask the cycle rather than resolve it. | **Fixed** |
| R9 | CORRECT | Defect (low) | An **unterminated** fence is now deliberately **not** stripped — malformed markdown degrades to "this was never a fence" rather than blanking a real `## ID` below it. | **Fixed** |
| R10 | CORRECT | Informational (scoping) | No code change; the limitation is real and now **recorded in the source**. Comment added at `countIdBearingFiles()` stating the cross-check detects **traversal** divergence only and is structurally blind to **parser** errors, so it cannot catch an R7-class leak. | **Recorded** |

### The lesson I am taking from R7 — my tests, not my fix, were the failure

The reviewer's sharpest point was not that the fence fix was wrong. It was that **my round-1 tests
passed green the whole time**, asserting less than the fix claimed to deliver, while the header comment
and this ledger both read *"fixed by construction."* A confident claim backed by an under-specified
test is worse than no claim, because it stops anyone looking again.

Round 2 adds the adversarial cases rather than the happy ones: 4-backtick nesting, `~~~` inside
backticks, a shorter closing run, an indented fence, an unterminated fence, and two symlink-cycle
shapes. Each is red-proved by a named mutation.

### Round-2 verification

- `npm test` — **420 pass / 0 fail** (was 413); `prove-red.sh` hard gate passed.
- Named-mutation red proofs, green control at **30/30**: naive fence toggle restored → **4 tests red**
  (3× R7, 1× R9) · cycle guard removed → **2 R8 tests red**.
- Live corpus unchanged and still clean: **101 = 101**, contiguous `0001`–`0101`.

**⚠️ A correction to my own round-1 verification method.** Two probe commands in earlier rounds used
`timeout`, which **does not exist on macOS** — they exited 127 and produced no output, and I initially
read that silence as a pass. Re-run without it. No conclusion changed, but the earlier "124 would mean
it hung" check was never actually executing, and reporting it as a completed check would have been a
fabricated verification.

### Owner ruling on R6 (obtained between rounds)

**Accept as a residual — no code change.** The improved failure message stands. The owner declined both
hardening options; recorded in *Accepted residuals* below. Notably the "require `## ID` + `## Status`"
option was rejected on the grounds that it would convert a **malformed real brief** from a loud failure
into a **silent skip** — the exact failure class this file exists to prevent.

---

**Round 3 response — coder, 2026-07-20.** All seven verified against the code before acting. **All
seven CORRECT.** R14 is the most serious defect found in this review and it was not a fence bug at all
— it is the guard's core purpose failing silently, and it survived three rounds because every round,
mine included, was looking at fences.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R11 | CORRECT | **Defect (high) — third iteration of the same fault** | Found the rule I had missed all three times: **a closing fence may not carry an info string.** Both leaks (E1 stray-opener pairing, E2 trailing content) now resolve to loud failures. Backtick-in-info-string also enforced. | **Fixed** |
| R12 | CORRECT | **Defect (medium) — regression from my R8 fix** | `discoverBriefs()` now dedupes by `realpathSync` too, so both walks share one definition of identity. One physical brief reachable by two names is **one brief** — the old behavior manufactured a phantom duplicate out of a symlink. | **Fixed** |
| R13 | CORRECT | Defect (low) | Test re-pointed at the **folder** layout — the layout this guard exists to survive — and now asserts **both** walks, not just the count. | **Fixed** |
| R14 | CORRECT | **Defect (high) — the guard's core purpose failing silently** | **Complement rule** adopted (owner-ruled): fences stripped, then two or more remaining `## ID` fields is a hard failure naming the file and every value. | **Fixed** |
| R15 | CORRECT (with the reviewer's own correction) | Defect (low) | `kindOf()` and the new `realpathOrNull()` now distinguish genuinely-absent errnos from unreadable ones. **The reviewer's correction of Codex is right**: `readdirOrEmpty` already threw on EACCES; only these two sites lagged. | **Fixed** |
| R16 | CORRECT | Defect (medium) | Containment boundary added (owner-ruled): any realpath escaping `tasksRoot` is not part of this corpus. The walk no longer reads outside the repository. | **Fixed** |
| R17 | CORRECT | Defect (low) — **my test, not my code** | Test rewritten so the decoy heading is **unindented**; it now genuinely fails when `stripFences()` is replaced by an identity function. | **Fixed** |

### R14 and the complement rule — the reviewer's best call of this review

In round 1 the reviewer proposed *"fail on >1 `## ID`"* and I rejected it. **I was right to reject it as
a replacement for fence-stripping, and wrong to conclude there was nothing in it.** As a *complement*
it does something the replacement framing hid:

> **It converts every future fence-parser bug from silent-wrong into loud-failure.** A leaked example
> becomes a second visible field, which now fails instead of shadowing the real ID.

That is worth more than a fourth attempt at parser correctness. Three consecutive rounds produced a
fence defect (R3 → R7 → R11); betting on the fourth attempt being right is a bad bet, and this design
means I no longer have to make it. The parser is now allowed to be imperfect because the backstop is
loud. Recorded in the source at `readId()` with an explicit "do not simplify this back to `found[0]`".

### On R12 — a behavior change I made without asking, and why

Deduping **discovery** by real path changes what the guard reports: a symlinked brief is no longer a
duplicate. I judged this an obvious winner rather than an owner question, and record the reasoning so
it can be overturned:

- The two walks disagreeing is not a stylistic inconsistency — it made the R1 cross-check fire with
  *"discoverBriefs() is missing briefs"* when discovery had found **more**. Wrong repair, again.
- The alternative direction (drop dedup from the cross-check) reintroduces **R8**, the unbounded cycle.
- One physical file is one brief. Reporting a symlink as a duplicate ID is this guard **crying wolf
  about the precise thing it exists to report**, which corrodes trust in a real hit.
- **Two of my own earlier tests asserted the old behavior and were rewritten.** Flagged loudly: I
  changed tests to match new behavior, which is exactly the move that hides a regression. The
  justification is that those tests encoded R12 itself as intended behavior.

### Round-3 verification

- `npm test` — **430 pass / 0 fail** (was 420); `prove-red.sh` hard gate passed.
- Named-mutation red proofs, green control at **39/39**: closing-fence info-string rule removed → 2 R11
  tests red · discovery dedup removed → 2 R12/R13 tests red · complement rule reverted to first-match →
  4 R14 tests red · containment removed → R16 test red · `stripFences` → identity → the R17 test red
  (it did **not** go red before the rewrite, which was the finding) · bare catch restored in `kindOf` →
  R15 test red.
- Reviewer's R11 repros re-run directly: E1 `["9999"]` → `[]`, E2 `["9999"]` → `["9999","0042"]`.
- Live corpus unchanged: **101 = 101**, contiguous, no brief carries more than one `## ID`.

**One of my own tests was wrong and I corrected the test, not the code.** My first R11-E1 test asserted
a throw; tracing the actual behavior, the trailing ``` legitimately closes the stray fence, so
everything blanks and `readId` returns `null` — a loud false "missing ID". Safe direction, but not what
I predicted, and I had asserted my prediction rather than the behavior.

### R15 — recording the reviewer's correction of Codex

Codex claimed EACCES was silently swallowed at `readdirOrEmpty`. The reviewer **executed** it and found
that path already throws — my R2 fix covers it — narrowing the real finding to `kindOf()` and
`realpathSync`. Recorded because a review that corrects its own second reviewer by execution is doing
the thing that makes the second opinion worth having, and because the narrower finding was still real.

---

**Round 4 response — coder, 2026-07-20.** Both verified against the code before acting. **Both CORRECT,
both fixed.** They are the same fault in two halves: a round-3 fix applied to only one of the two walks.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R18 | CORRECT | Defect (medium) | `countIdBearingFiles()` now dedupes **files** by real path, not just directories, sharing one `seen` set across both kinds. One physical brief reachable by two names counts once — matching what R12 gave discovery. | **Fixed** |
| R19 | CORRECT | **Defect (medium) — a genuine design contradiction, not a slip** | **Owner-ruled 2026-07-20: the corpus ends at the tree.** Discovery now applies the same containment boundary as the walk. A brief reachable only through an off-tree symlink is not part of this repo's corpus. | **Fixed** |

### R19 — the reviewer was right that this was a decision, not a bug

Two rules I built, each defensible alone, that contradicted: **R5** made discovery follow symlinks
off-tree; **R16** made the cross-check refuse to leave. Neither was wrong in isolation and they were
never reconciled. Escalated rather than settled by me.

**Owner's ruling and its reasoning:** git stores the *link*, not the target, so a brief reachable only
through an off-tree symlink never had its ID allocated in this repo and cannot collide in it. The
corpus is what is in the tree.

**R5's actual content survives, and I proved it rather than asserting it.** The rewritten test asserts
that an **in-tree** symlink to a brief discovery would not otherwise reach is still found — and it goes
**red** when the `statSync` fix is reverted. The original silent-skip regression is still caught. I
checked this specifically because rewriting a test to match new behavior is the standard way a
regression gets buried, and I had already done exactly that once this review (R12).

### Round-4 verification

- `npm test` — **432 pass / 0 fail** (was 430); `prove-red.sh` hard gate passed.
- Named-mutation red proofs, green control at **42/42**: file dedup removed → R18 test red · discovery
  boundary removed → R19 test red · `statSync` → `lstatSync` → the rewritten R5 test **still** red.
- Live corpus: **101 = 101**, contiguous `0001`–`0101`, no brief carries more than one `## ID`.
- `git status`: only the intended files; the test writes nothing into the repo.

### On the trajectory, and what I am and am not claiming

The reviewer's sharpened read is the right one and I am adopting it rather than the count-based one I
offered:

| Round | Findings | High | Silent-wrong |
|---|---|---|---|
| 1 | 6 | 0 | R3 |
| 2 | 4 | 1 | R7 |
| 3 | 7 | 2 | R11, R14 |
| 4 | 2 | 0 | **none** |

6→4→7→2 is not convergence. The **class** converging is: every round-4 finding fails **loud** — a false
red with a confusing message, never a missed duplicate. For a guard whose entire purpose is refusing to
go silently green, that is the plateau that matters, and it has an identifiable mechanism rather than
being an absence of further ideas: **the complement rule turns any parser leak into a second visible
field, which throws.** Confirmed by the reviewer against a case that still mis-parses (backtick in a
backtick info string) and now fails loudly instead of returning a wrong ID.

**What I do not claim: that no silent-wrong remains.** Four rounds and two model-diverse reviewers with
zero silent findings in the last round is evidence, not proof. The honest basis for closing is that the
*mechanism* which produced every prior silent-wrong (R3, R7, R11, R14) has been structurally closed —
not that the search was exhaustive.

### On the reviewer's out-of-scope flag

Confirmed: `ai-agents/worklogs/assert-task-ids-are-unique-in-the-test-suite.md` is the ship-loop's
ADR-020 worklog artifact, written by me before the review ran. **Not a repo write by the test.** Good
catch to raise rather than assume — that is the right instinct for a read-only review.

## Re-litigates settled decisions (suppressed)

**Empty this round.** Neither reviewer raised lock files, reservation protocols, content-derived IDs, an
ID registry, a `9999` overflow rule, the `id-mismatch` drift assertion, or the malformed-folder
assertion. Codex was primed with the residual list and complied. Recorded so the absence is visible
rather than assumed.

## Verified-and-disproven (no action; recorded so they are not re-chased)

- **CRLF does not break `readId()`.** I predicted `[ \t]*$` would fail against `\r\n` and was wrong:
  JavaScript's multiline `$` matches before a CR as well as a LF. Verified empirically —
  `readId("# T\r\n\r\n## ID\r\n0101\r\n")` → `"0101"`. Codex's probe agrees. No finding.
- **Read-only-ness holds (brief verification step "No repo writes").** Every write call in the file
  (`mkdtempSync`/`mkdirSync`/`writeFileSync` at :126, :129, :133, :136-137, :223-224, :232-233) targets a
  root returned by `mkdtempSync(join(tmpdir(), 'fkit-taskid-'))`. `REPO` appears exactly once, at :252,
  as a **read** path. `cleanup`/`rmSync` is applied only to `MADE`, which holds only mkdtemp roots.
  Zero `/tmp/fkit-taskid-*` leaked after a full run.
- **The `ai-agents/worklogs/…` file that appears in `git status` is not a test write.** Its mtime
  (13:54:22) predates my `npm test` run; `grep -rn worklog test/` returns nothing. It is the ship-loop's
  ADR-020 worklog artifact. *Noted only because it was not in the declared review scope.*
- **The post-76 discovery branch targets the correct filename.** `brief.md` is fixed and reserved by the
  design spec ("`brief.md` is the reserved brief filename. Fixed, not `<slug>.md`") and ADR-029
  Decision 1. Task 76's brief writes `<brief-filename>` in one line of loose prose; that is not a second
  candidate name. The branch is correct.
- **Scope discipline is clean.** No `id-mismatch` assertion, no live malformed-folder corpus assertion,
  no `9999` overflow rule, no registry/lock/reservation. The test at :230 ("a folder without brief.md is
  not a brief") is a **unit test of discovery behavior**, not design spec §4's corpus assertion — inside
  the line.
- **`findDuplicates`' comparator never returning 0** (`:108`) is harmless: it sorts `Map` keys, which are
  unique by construction.
- **Every coder verification claim spot-checked and confirmed.** `npm test` 402 pass / 0 fail;
  `prove-red.sh` hard gate passed (0a/0b/0c green, both mutations red). Corpus re-derived independently:
  101 briefs, 101 IDs, 101 unique, 0 duplicates, contiguous `0001`–`0101`. `readId()`'s regex applied
  verbatim to all 101 real briefs parses **101/101** with zero malformed. No brief in the corpus carries
  more than one `^## ID` (so R3 is latent, not live). No CRLF, no subdirectories, no symlinks, and no
  ID-carrying brief outside the three boards.
- **The non-zero assertion is genuinely load-bearing** for *total* vacuity: discovery against a
  nonexistent root returns 0 records, which reds the assertion. Its insufficiency is scoped to *partial*
  vacuity — that is R1, not a contradiction of this.

### Round 2 — verified-and-confirmed (the fixes that hold)

- **R1's cross-check is genuinely independent on the axis that matters.** `countIdBearingFiles()` is a
  different traversal (recursive, depth-unlimited, layout-agnostic) and can genuinely disagree with
  `discoverBriefs()` — confirmed by the coder's own nested-brief test at :403-413, which I re-derived.
  It is **not** a disguised second copy of the same walk. It does share `idFields()`/`kindOf()`; that is
  correct scoping, recorded as R10 so the limit is explicit rather than assumed.
- **R2's fix is correct.** `readdirOrEmpty()` returns `[]` on ENOENT only; ENOTDIR and every other errno
  throw with the directory and code named. The :392-399 test exercises ENOTDIR for real.
- **R3's chosen route is the right call, and I withdraw my suggested remedy.** Fence-awareness beats
  "fail on >1 `## ID`" for exactly the reason given — it does not convert a documentation choice into a
  build break. The *route* is right; the *implementation* is incomplete (R7). Fixing R7 does not require
  revisiting the route.
- **R4's fix is correct.** Line-based parsing handles whitespace-only separators and returns trailing
  content for the format assertion to judge, rather than reporting a false "missing ID".
- **R5's fix is correct on its own terms.** `statSync` follows links, so symlinked briefs and symlinked
  post-76 task folders are discovered and dangling links are skipped without throwing. Its interaction
  with R1's new recursion is R8 — a fault of the combination, not of this fix alone.
- **R6's message fix lands.** The failure now names the not-a-brief cause. Behavior correctly left
  unchanged pending the owner.
- **Coder's round-2 verification claims spot-checked and confirmed.** `npm test` **413 pass / 0 fail**.
  Live corpus under the *new* parser: discovery ID-bearing **101**, independent recursive walk **101**,
  they agree; zero briefs leak more than one `idField`. Read-only-ness still holds — no new write path.
- **Post-76 artifact collision: disproven.** I checked whether `plan.md` / `worklog.md` / `review.md`
  (which ADR-029 §1 moves *into* the task folder) carry a `## ID` field and would inflate the recursive
  walk after task 76. **None of them do** — verified across every file in `ai-agents/plans/`,
  `ai-agents/worklogs/`, and `ai-agents/reviews/`. No finding.
- **R7 and R8 are latent, not live.** No brief in the corpus uses a 4-backtick or `~~~` fence; there are
  no symlinks anywhere under `ai-agents/tasks/`. The guard is correct over today's corpus.

### Round 3 — verified-and-confirmed, and the convergence signal

- **The R7 fix is a real improvement, but incomplete.** Both round-2 repros are genuinely fixed: the
  4-backtick nest and the `~~~`-inside-backticks case now return `0042`. Character-and-run-length
  tracking was the right direction. It is the **positional pairing** underneath that still fails (R11).
- **R9's fix is correct as specified** and its test at :441-444 is honest — but the rule interacts badly
  with a later well-formed fence, which is R11's E1. The rule is not wrong; the pairing model is.
- **R10 recorded in-code, correctly.** Good call moving that limitation out of the ledger and into the
  source; a constraint that lives only in a review document is a constraint that will be lost.
- **`realpathSync` answers the cycle question well.** Real-path identity over a depth cap was the right
  choice — a cap masks the cycle. The `seen` set is threaded correctly through recursion (shared via
  parameter, not per-branch), so sibling directories cannot re-walk each other. The problem is not the
  guard; it is that only one of the two walks has it (R12).
- **TOCTOU (`realpathSync` then `readdir`): not a finding.** Single-threaded test process, fixtures it
  created itself, repo read-only. Real in principle, unreachable here. Recorded so it is not re-chased.
- **Hardlinks: not a finding.** `realpath` does not collapse them, so a hardlinked brief is counted by
  **both** walks — consistent, no divergence.
- **Round-3 verification claims spot-checked.** `npm test` **420 pass / 0 fail**; prove-red hard gate
  passed. Live corpus: discovery 101, independent walk 101, zero briefs leaking more than one
  `idField`. Read-only-ness still intact — no new write path.
- **⚠️ THE CONVERGENCE SIGNAL, stated plainly.** This is the **third consecutive round** in which a fix
  introduced the next finding: R7/R8 came from the round-1 fixes, R11/R12 from the round-2 fixes. The
  fence parser specifically has now been wrong **three times** (naive toggle → char/run-length →
  positional pairing). That is no longer a bug to fix; it is evidence that **incrementally
  reimplementing CommonMark inside a test helper is the wrong shape for this problem**. Recommend the
  next round change the approach rather than patch the parser a fourth time — the guard does not need a
  markdown parser, it needs the `## ID` field, which sits at line 3 of every brief in the corpus. A rule
  like *"the first `## ID` occurring before any fence marker of any kind"* is total, needs no state
  machine, and has no third bug to find. **Putting this to the owner as a design question rather than
  ruling on it — the choice of approach is theirs.**

### Round 5 — close-out

**✅ Ready to merge. Both round-4 findings fixed and independently re-verified; no open defects.**

- **R18 fixed.** One `seen` set now covers files and directories in `countIdBearingFiles()`. Re-probed:
  two paths to the same file → discovery **1**, independent **1**.
- **R19 fixed, owner-ruled.** Discovery now applies the same containment boundary as the walk. Re-probed
  in both shapes — off-tree symlinked **folder** and off-tree symlinked **file** → 1 = 1 in each. The
  owner's reasoning is sound and worth preserving: git stores the link, not the target, so a brief
  reachable only through an off-tree symlink never had its ID allocated in this repo and cannot collide
  in it. The R5/R16 tension is now reconciled rather than left as two rules that both stood.
- **Fresh round-5 attacks on the new boundary, all clean:** in-tree symlinked folder (dedups to 1=1), a
  board symlinked into a sibling board creating a cycle (1=1), and — the control that matters — a
  **genuine duplicate is still reported** (`["0001"]`). The boundary work did not blunt the guard.
- **Regression-burial check, run independently rather than taken on trust.** Mutating `statSync` →
  `lstatSync` in a scratch copy reds **19 of 42** tests including the rewritten R5 test. The original
  silent-skip regression is still genuinely caught after two rounds of test rewrites.
- **`npm test` 432 pass / 0 fail; prove-red hard gate passed.** `git status` shows no test-generated
  writes; zero leftover fixtures under `os.tmpdir()`. Read-only-ness held for all five rounds.

**Convergence: called, with the basis stated.** Findings by round **6 → 4 → 7 → 2 → 0**, and — the
measure that actually matters for this guard — silent-wrong findings by round **1 → 1 → 2 → 0 → 0**.
Two consecutive rounds with zero silent-wrongs, the last of which found nothing at all.

**What this review claims, and what it does not.** It does **not** claim no silent-wrong remains; five
rounds and two model-diverse reviewers cannot prove that negative. It claims something narrower and
checkable: **the mechanism that produced every prior silent-wrong is structurally closed.** The
complement rule (R14) makes any fence-parser leak surface as a second visible `## ID` field, which
throws — so the parser is no longer required to be *correct* in order to be *safe*, which is the
property that ended the R3 → R7 → R11 recurrence. Residual risk now sits in walk-consistency, where the
failure mode is a loud false red, not a missed duplicate. For a guard whose stated purpose is *"must not
go silently green"* (ADR-029 Decision 3), that is the right place for the remaining risk to live.

**No further adversarial round is recommended.** Re-open only on the conditions in *Accepted residuals*
and ADR-029's *Re-raise only if* — in particular, **a duplicate ID actually occurring in practice**,
which ADR-029 names as the one thing that would justify revisiting prevention over detection.

### Round 4 — verified, and the trajectory answered

Reviewers run (round 4): fkit-reviewer own pass. Codex not re-run — round 3's Codex pass covered this
surface and round 4 changes are the seven named fixes to its own findings. Flagged, not assumed.

**The fence parser now survives everything I could throw at it.** All prior leaks resolve: E1 → `null`
(loud), E2 → `null` (loud), the 4-backtick nest and `~~~`-inside-backticks → `0042` (correct). Fourth-round
attacks — a tilde closer carrying an info string, `~~~` closed by a longer `~~~~`, CRLF, a fence marker
at EOF, a legitimate fenced documentation example — all correct. **The closing-fence-info-string rule was
the right root cause**; it is what made pairing positional, and it explains all three prior iterations.

**The belt-and-braces claim is verified, and it is the finding of this round.** Codex's X1 case (a
backtick opener with a backtick in its info string) *still* mis-parses — and now **throws loudly** with
`["9999","0042"]` instead of silently returning a wrong ID. That is the complement rule doing exactly
what it was adopted for: the parser is no longer required to be correct in order to be safe.

- **R12's fix is right, and the test rewrite is legitimate — I checked it specifically as asked.** The
  two rewritten tests did encode R12 itself as intended behavior; one physical file reachable by two
  names is one brief, and reporting it as a duplicate is the guard crying wolf about the exact thing it
  exists to detect. Crucially **R5's red-proof survives the rewrite**: the new test *"a symlink to a
  brief outside the boards is still discovered"* fails if the `statSync` fix is reverted, so the
  silent-skip regression is still caught. This was not regression-hiding.
- **Deduping discovery was the right direction, not the alternative.** Dropping dedup from the
  cross-check would reintroduce R8. Confirmed.
- **R17's fix is genuine** — the decoy heading is now unindented, and the test reds under an identity
  `stripFences()`. Verified directly.
- **R13, R15, R16 fixed as described.** The `chmod 000` test restores permissions in a `finally`, so it
  cannot wedge cleanup.
- **`npm test` 430 pass / 0 fail; prove-red hard gate passed.** Live corpus clean.
- **On the coder catching its own test asserting a prediction rather than the behavior** (the R11-E1
  throw-vs-null correction): that is the same error class as R17, caught unprompted, and correcting the
  test rather than bending the code was right.

**⚠️ THE TRAJECTORY QUESTION — I was asked to disagree if I disagree. I do not, and here is the sharpened
version.** Finding counts by round: **6 → 4 → 7 → 2**. The count alone does not show convergence. What
changed decisively is the **class**:

| Round | High-severity | Silent-wrong (guard goes green while wrong) |
|-------|---------------|---------------------------------------------|
| 1 | 0 | R3 (latent) |
| 2 | 1 (R7) | R7 |
| 3 | 2 (R11, R14) | R11, R14 |
| 4 | **0** | **none** |

Every round-4 finding fails **loud** — a false red with a confusing message, never a missed duplicate.
For a guard whose entire purpose is *"must not go silently green"* (file header, ADR-029 Decision 3),
that is the plateau that matters, and it is a real one rather than an artifact of my running out of
attacks. The mechanism is identifiable rather than lucky: the complement rule makes any parser leak
produce a second visible field, which throws. The residual risk has moved out of the parser and into
walk-consistency — and R18/R19 are both in that layer, both loud.

**What I cannot claim:** that no silent-wrong remains. Four rounds and two model-diverse reviewers with
zero silent findings in the last round is evidence, not proof. The honest basis for closing is that the
*mechanism* which produced every prior silent-wrong has been structurally closed, not that I searched
exhaustively.

### Round 3 — the synthesis worth taking (R11 + R14 have one shared fix)

In round 1 I proposed *"fail on more than one `## ID`"*; the coder rejected it and **was right to** — as a
*replacement* for fence-awareness it would punish a brief for documenting the ID format. But R14 shows
it is exactly right as a **complement**. Once fences are stripped, a brief with two `## ID` fields
**outside** any fence is unambiguously a corpus defect, and failing on it:

- closes R14 directly (the second field can no longer be silently discarded), and
- **converts every future fence-parser leak from silent-wrong into loud-failure** — a leaked example
  produces a second visible field, which now fails rather than shadowing the real one.

That second property is what matters most: it means the parser no longer has to be *correct* to be
*safe*. Given the fence parser has been wrong three times, a design where its next bug fails loudly is
worth more than a fourth attempt at getting it right. Neither reviewer proposed this in round 1 — it
only becomes available once fence-stripping exists. **Recommendation, not a ruling; the approach is the
owner's call.**

### Round 2 — answer to the coder's tautology question

Reviewed all 11 new tests for tests that cannot fail or that pass for a reason other than their name.
**No tautologies found.** Each new test's mutation is named in the coder's red-proof and each reds the
assertion its name claims. One caveat, which is the real answer to the question asked:

- **The two R3 fence tests (:325-349) are not tautological, but they under-specify.** They exercise only
  the simple ` ``` ` and `~~~` cases and pass at 413/413 while the nested-fence and mixed-marker cases
  (R7) return `"9999"`. A green suite is currently reporting a defect as fixed. That is not a test that
  passes for the wrong reason — it is a test whose name claims less than the fix needs to deliver, which
  is the more dangerous shape because the header comment and the ledger both read "fixed by
  construction".

## Accepted residuals (shared, do-not-re-litigate)

**R6 — "any `*.md` in a board directory is treated as a brief."** Owner-ruled 2026-07-20: **accepted,
do not re-litigate.** Board directories hold briefs by convention; a stray file fails **loudly**, and
the failure message now names the alternative cause ("or the file is not a brief at all"). Two
hardening routes were put to the owner and declined: a skip-list of known non-brief names (goes stale,
and could silently skip a real brief), and a "must have `## ID` **and** `## Status`" shape check —
declined because it would turn a **malformed real brief** from a loud failure into a **silent skip**,
which is the precise failure class this guard exists to prevent.

Inherited from `ai-agents/reviews/assign-global-task-ids-and-create-registry.md` and ADR-029 —
still binding here, not re-litigated: *Cross-branch ID race — detect, don't prevent*; *Four-digit ID
overflow at 10000*; *No registry file*.
