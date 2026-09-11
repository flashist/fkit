# Review — 0271

Task: `ai-agents/tasks/done/0271-pin-the-three-unpinned-behaviors-in-the-sprint-identity-grammar/brief.md`
File(s) under review: `test/dashboard-contract.test.js` (+140), `test/prove-red.sh` (+52), and this task
folder's `worklog.md` (new). ⛔ Nothing else in the working tree is in scope for this review.
Status: closed-out
Coverage (**round 2** — this field states THIS round's state; round 1's is preserved in the round-1
record below and is not amended): **reasoning-only second opinion** — the Codex pass ran to completion
(`codex exec --sandbox read-only`, exit 0, `gpt-5.6-sol`, 65,204 tokens) and returned a usable,
diff-grounded per-fix verification, but **every command it executed was a read or a static syntax
check** (`rg`, `grep`, `sed`, `node --check`, `sh -n`, `git diff --check`): it **ran no suite and
proved no mutation**. **All execution evidence in this round is the Claude reviewer's.** This is a
normal state, not a degradation — the verdict is unaffected and is NOT marked partial.

## Reviewer findings

| #  | Round | Sev | Location | Claim |
|----|-------|-----|----------|-------|
| R1 | 1 | medium | `test/dashboard-contract.test.js:2905` (`test('ADR-041 0271/5a: a plan under sprints/done/ is never a candidate'`) | The guard asserts only an **absence** and carries **no positive control**. Measured: with `plans: {}`, `select-active`'s stdout is **byte-identical** whether or not `done/sprint-9.md` exists — so deleting the `writeFileSync` on the next line leaves all three assertions green, and the test collapses into a duplicate of `0271/4`. It is load-bearing today only through the mutation; any drift in `sprintsFixture`'s `done/` layout or in the write path disarms it **silently**. This file's own discipline is the counter-example: `adr040Drift()` exists precisely so an absence-assertion first proves its fixture resolved. |
| R2 | 1 | medium | `test/prove-red.sh:20` (`# TWENTY-EIGHT mutations, each caught by a NAMED assertion. ⚠️ KEEP THIS LIST IN STEP WHEN YOU ADD ONE`) | **Mutation 32 was added without an index entry.** The header index runs `1.`–`31.` and stops; there is no `32.` line. The instruction violated is written in the file itself, three lines above the list, and it carries the precedent of exactly this miss (`task 0136 round-1 review R5`). **Inside this task's diff fence.** ⚠️ Separately and **pre-existing**: the same sentence's count word already read `TWENTY-EIGHT` against 31 listed entries before this task — that half is not 0271's, but unlike the other stale copies it sits **inside the fence**, so the owner can dispose of it here. |
| R3 | 1 | low | worklog § `6. Red-proofs — measured, not predicted` (row `5b` … `14/148, 134 fail`) | The recorded 5b red-proof **does not discriminate the behavior `0271/5b` names.** Under `[ $# -ge 1 ]` a one-argument call passes a *path* into `case "$1" in identity)`, which never matches, so **every** one-argument render dies — regardless of filename. The proof therefore demonstrates "one argument is a board", which 133 other tests already pin, not "a plan file named `identity.md` is not the mode word". ⭐ **The guard does have unique coverage — it simply was not shown.** Measured by this review: `[ $# -eq 2 ] \|\| [ "$(basename "$1" .md)" = identity ]` reds `0271/5b` **alone**, 147 pass / 1 fail. Record-quality, not a test defect. |
| R4 | 1 | low | worklog § `6. Red-proofs — measured, not predicted` (row `5a` … `138/148, 10 fail`) | A **narrower** 5a mutation exists and was measured by this review: `for _f in "$1"/*.md "$1"/*/*.md` reds `0271/5a` **alone**, 147 pass / 1 fail, versus the ruled mutation's 138/10. ⚠️ **This is adjacent to owner ruling U3 but is not re-litigation of it** — U3 chose between "widen the glob", "re-scope 5a" and "return it to the producer"; this variant was never on that menu, and it does not touch U3's substance (the exclusion is emergent from the depth-1 glob). Nothing ships from a red-proof, so this is a record improvement, not a change of mechanism. Owner's call. |
| R5 | 1 | low | worklog § `11. Flagged, NOT fixed — outside this task's diff fence` (`test/coordination-citation-policy.test.js:159 says "All 28 prove-red mutations."`) | The flag **under-counts the instances**. The identical stale sentence also sits at `test/reference-integrity.test.js:142` (`// All 28 prove-red mutations target an executable artifact reachable through an environment seam`). Both are outside the fence and correctly not fixed; the record should name both so the follow-up brief is scoped right. |
| R6 | 2 | low | worklog § `10.` gate table, row `test/prove-red.sh — the full hard gate, run to completion` — *"**32 of 32** mutations red at their **NAMED** assertion; **13** unmutated baselines green (`0a`–`0n`)"* | **The baseline count is wrong, and the row's own parenthetical disproves it: `0a`–`0n` enumerates FOURTEEN labels, not thirteen.** Measured by this round on a full `npm test` (exit 0): **14** baselines, `0a`…`0n`, **all green** — `0a` real launcher, `0b` unmutated full copy, `0c` hook-matrix, `0d` turn-completion-hook, `0e` marker-hook, `0f` ship-loop-marker-hook, `0g` skill-frontmatter, `0h` scaffold home, `0i` dashboard, `0j` update-banner, `0k` release.mjs, `0l` carry-check-hook, `0m` wiki-flag-convention, `0n` throughput. ⭐ **Everything else in that row is CORRECT and was independently re-measured**: `✓ hard gate PASSED`, exit 0, 32/32 red at their named assertion, no `✗` anywhere. **Record-quality only — same class as R2/R3/R4/R5.** Traced blast radius is **documentary**: a baseline count cannot change a result, disarm a mutation, or mis-select anything; the harm is a future maintainer reconciling the gate against a record that contradicts itself. ⛔ **Not blocking** — it does not affect the ship decision. |

### Round 2 — verification pass. **All four fixes VERIFIED. One novel finding: R6 (low, record-only, NOT blocking).**

**Purpose of this round:** verify, on the final bytes, that round 1's four applied fixes did what they
claim. ⛔ Not to open a new front. Round 1's rows R1–R5 are unchanged and are **not** re-litigated.

**Verdict: ⚠️ Changes requested — 1 defect (none blocking).** All four fixes **VERIFIED** by independent
re-measurement; every figure in the *Coder response* section held exactly and **nothing in it was
refuted**. Nothing was carried — each number below was re-derived by this round in a scratch copy of
the repo. The single novel finding, **R6**, is a **wrong baseline count in the worklog's own gate
record** — documentary only, and it does not affect the ship decision.

| Fix | Claim | Re-measured by this round | Verdict |
|---|---|---|---|
| **R1** pre-fix defect | round-1 test shape + `done/sprint-9.md` write deleted → **148/148 green** | Reconstructed the round-1 shape (control write, `existsSync`, control assertion all removed) and deleted the write: **148/148 green** | **VERIFIED — R1 was a real defect** |
| **R1** fix (a) control | deleting the `control-depth-1.md` write reds `0271/5a` **alone** | **147 pass / 1 fail**, red at `0271/5a` only | **VERIFIED — the control is load-bearing, NOT decorative** |
| **R1** fix (b) precondition | deleting the `done/sprint-9.md` write reds `0271/5a` **alone** | **147 pass / 1 fail**, red at `0271/5a` only | **VERIFIED** |
| **R1** "stdout cannot express this" | `done/` exclusion is invisible to stdout **by construction**, so no assertion on `out` can red | Direct probe of the real `dashboard.sh`: two fixture dirs identical but for `done/sprint-9.md` → stdout **BYTE-IDENTICAL**, exit 3 both | **VERIFIED — the fix is NOT over-built; the departure was necessary** |
| **U3** ruled mutation | `:241` `"$1"/*.md` → `"$1"/*/*.md` still **138/10**, red at `0271/5a` | **138 pass / 10 fail**, `0271/5a` among the reds | **VERIFIED — unchanged** |
| **R2** index | `32.` line added; `TWENTY-EIGHT` → `THIRTY-TWO` | **32** `# --- Mutation` blocks; index enumerates **1–32** with no gap or duplicate; header word reads `THIRTY-TWO` | **VERIFIED — exact match** |
| **R3** narrow 5b | `[ $# -eq 2 ] \|\| [ "$(basename "$1" .md)" = identity ]` reds `0271/5b` alone | **147 pass / 1 fail**, red at `0271/5b` only | **VERIFIED** |
| **R4** narrow 5a | `for _f in "$1"/*.md "$1"/*/*.md` reds `0271/5a` alone | **147 pass / 1 fail**, red at `0271/5a` only | **VERIFIED** |
| **R5** enumeration | exactly **two** live copies of *"All 28 prove-red mutations"*, plus one frozen copy in closed task `0176` | Repo-wide `grep`: `test/reference-integrity.test.js:142` and `test/coordination-citation-policy.test.js:159` live; `0176`'s `plan.md` frozen. ⛔ Neither live copy touched | **VERIFIED — both named, neither fixed, correctly** |
| **U2** Mutation 32 | one new mutation, reds `0271/1` | Replicated the awk swap independently: **not a no-op**, `bash -n` clean, **146/2** — red at `0271/1` **and** at the documented second red `ADR-041 §2` | **VERIFIED — matches its own header comment and the residual** |

**The two failure modes the round was told to hunt — both cleared, with the trace:**

1. **Would any new assertion — including the new control — red `0338`?** ⛔ **No.** Every assertion in
   the new block is a prefix regex, a `startsWith`, an `includes`, or a count — **there is no
   whole-line equality anywhere in it**, so **U1 is obeyed**. The control's
   `/^candidate file="control-depth-1\.md"/` is literally U1's own worked-example form, unanchored at
   the end, so `0338`'s added `status=` field cannot red it. The control is **ineligible today**
   (`prosePlan()`'s H1 carries no identity token and the filename rung cannot answer, so it resolves
   `unresolved`) and **stays ineligible under `0338`** for a different reason (statusless), so
   `/^active none\b/` and exit 3 survive both worlds. `0338`'s brief additionally says *"Do not touch:
   … the candidate set"* and routes its new drift fact to `⟦FACTS⟧`, which `candidates()` and
   `activeLine()` never read — they slice `⟦SELECT⟧`…`⟦FACTS⟧` only.
2. **Is the new control decorative?** ⛔ **No** — deleting its fixture write reds `0271/5a` alone
   (147/1), and under the U3 mutation the control **disappears** while `sprint-9.md` **appears**, so it
   discriminates in both directions. The pairing "a depth-1 file IS listed / a depth-2 file is NOT" is
   what converts the absence-assertion from vacuous into load-bearing.

**Constraint checks:** `claude/skills/fkit-status/dashboard.sh` is **BYTE-IDENTICAL** at blob
`7ca95612d2f082c19ae75b3dc48cb31113f7f07e` and clean in `git status` — verified, not inherited.
`plan.md` is at blob `732e0ead28384b4c08947273b286339e9bc06fa5` as claimed. No source file was edited
by this review.

**Gates re-measured this round — the FULL gate, run to completion, nothing left pending:**

| Gate | Claimed | Re-measured this round |
|---|---|---|
| `dashboard-contract` | 148/148 | **148 pass / 0 fail** ✔ |
| `npm test` (node phase) | 877/877 | **877 pass / 0 fail**, 24 suites, 0 skipped, 0 todo ✔ |
| guards | 41/41 | **41 pass / 0 fail** — `coordination-citation-policy` + `reference-integrity`, re-run **after** this ledger was written, so the round-2 text itself is guard-clean ✔ |
| `test/prove-red.sh` | hard gate PASSED, 32/32, 13 baselines | **`✓ hard gate PASSED`, exit 0** · **32/32** red at their NAMED assertion, incl. `32. DISTINCT-token de-dup dropped — "0271/1" ... red` · **no `✗` anywhere** ✔ — ⚠️ **but 14 baselines, not 13 → R6** |

⭐ The full `npm test` (node suite **plus** the complete prove-red gate) was run to completion by this
round and **exited 0**. ⛔ Round 1's gap — *"the reviewer did not verify the full hard gate"* — is now
**closed by measurement, not by inference**.

⚠️ **No red anywhere was attributable to the parallel architect's ADR-041 / ADR-047 amendments or to
the new `sprint-8.md`** — the whole tree is green, so no attribution question arises.

⛔ **Suppressed as settled — raised by neither reviewer, listed for the record:** U1 and its named cost,
U2, U3 (⛔ and R4's narrower variant does **not** replace it), the folder-name "three vs five", the
driver's `143→149` slip, the awk-dialect limit, Mutation 32's rename-disarm, and both out-of-fence
stale *"28 mutations"* copies. **None was re-raised.**

**Convergence call: CLOSE OUT — R6 disposed of at closeout, NOT as a round 3.** Round 2 re-litigated
nothing: every settled item stayed settled, and the four fixes verified. The one novel finding **R6** is
a **single wrong digit in a worklog record** — it changes no code, no test, no result, and no ship
decision. ⛔ **It is not a basis for another review round.** Two clean dispositions exist, both the
owner's call: fix the digit at closeout, or record it as an accepted residual. ⚠️ **Raised rather than
swallowed** because it is a genuine measured error inside the fence, of the same class the owner already
accepted as legitimate in R2/R3/R4/R5 — but it is reported at its true weight, which is low.

⛔ **`Status:` is deliberately left `in-review`** — flipping it to `closed-out` is the **owner's**
disposition, not the reviewer's, and this round carried no owner decisions to record.

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

**Round 1. Severity in this section is the coder's own, derived from a traced blast radius — the
reviewer's label is never inherited. Two differ from the reviewer's and say so below.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (sev **medium**, = reviewer) | Re-measured the defect first: deleting the `done/sprint-9.md` fixture write left the suite **148/148 GREEN**. Fixed in `test/dashboard-contract.test.js` with **(a)** a depth-1 positive control `control-depth-1.md`, asserted **present** on the **candidate** line (per U1, `file="…"` field-prefix only), and **(b)** an `existsSync` fixture precondition. After: deleting either write reds `0271/5a` **alone** (147/1). `/^active none\b/` and exit 3 kept — the control is deliberately **ineligible**, so `0338` cannot red it. | ✅ done |
| R2 | CORRECT | Defect (sev **low**, ↓ from reviewer's medium) | Both halves fixed in `test/prove-red.sh`, both inside the fence: added the missing index line `32. Drop the DISTINCT-token de-dup from the H1 rung → "0271/1"`, and corrected the header count word `TWENTY-EIGHT` → `THIRTY-TWO`. Verified before the fix: **32** `# --- Mutation` blocks vs **31** index entries. | ✅ done |
| R3 | CORRECT | Defect (record, sev **low**, = reviewer) | Re-measured the reviewer's figure **independently** rather than carrying it: `[ $# -eq 2 ] \|\| [ "$(basename "$1" .md)" = identity ]` reds `0271/5b` **alone**, **147 pass / 1 fail** — confirmed. Appended to the worklog's red-proof table as a **supplement**. ⛔ The ruled 5b mutation stands; no re-scope, no code change. | ✅ done |
| R4 | CORRECT | Defect (record, sev **low**, = reviewer) | Re-measured independently: `for _f in "$1"/*.md "$1"/*/*.md` reds `0271/5a` **alone**, **147 pass / 1 fail** — confirmed. Appended as a supplement. ⛔ **U3 is NOT reopened** — the ruled mutation was re-run this round and is **unchanged at 138/10**, still red at `0271/5a`'s named assertion. | ✅ done |
| R5 | CORRECT | Defect (record, sev **low**, = reviewer) | Confirmed by exhaustive `grep` over `test/`, `claude/`, `bin/`, `ai-agents/`: the stale *"All 28 prove-red mutations"* sentence has exactly **two live copies** — `test/coordination-citation-policy.test.js:159` **and** `test/reference-integrity.test.js:142`. Worklog §11 rewritten to name **both** so the follow-up brief is scoped right. ⛔ **Neither fixed — both outside the fence.** Also noted: a third, frozen copy in closed task `0176`'s `plan.md`, which the follow-up must leave alone. | ✅ done |

**Severity departures from the reviewer, with the traced reason:**

- **R2: medium → low.** The miss is real and has a recorded precedent (`0136` round-1 R5), but the
  blast radius traced end-to-end is **documentary only**: the index is a comment block. It cannot
  change a test result, cannot disarm a mutation, and cannot mis-select anything — the executable gate
  (`run_dashboard_suite` plus the named-assertion `grep`) is untouched by it. Harm is a wrong map for
  the next maintainer. Real, fixed here, **not medium**.
- **R1 stays medium on my own trace, not by deference.** Not *high*: the pinned behaviour is correct
  and was genuinely load-bearing today **through the ruled mutation** (138/10). Not *low*: the guard
  would have disarmed **silently** on fixture drift, in the one file whose entire thesis is that an
  unexercised guard hides drift.

**Loop check (Step 2) — stated loudly, not silently.** R3 and R4 land directly on the accepted residual
*"Mutations 5a and 5b are broad by design"*, whose re-raise condition reads *"Re-raise only if: a
narrower mutation is **named and measured**"*. That condition is **met** — R3/R4 name and measure exactly
that — so these are **genuinely novel, not re-litigation**, and the residual's own text anticipated them.
⛔ R4 is **adjacent to U3 but does not reopen it**: U3 chose among "widen the glob", "re-scope 5a" and
"return it to the producer", and this variant was never on that menu. **No re-fix of any settled item
was performed.** Nothing in this round oscillates against a prior finding.

**Regression check.** None of the four applied changes touches `dashboard.sh` or any behaviour: three
add assertions or comments to test files, one edits a comment index. `git diff --stat -- claude/` is
**empty** and `dashboard.sh` remains at blob `7ca95612d2f082c19ae75b3dc48cb31113f7f07e` — the
reviewer's cited hash, re-verified this round. ⛔ **No guard redded against landed code at any point.**

**⚠️ Status stays `in-review`, deliberately — round 1 is fully dispositioned but NOT closed out.** The
method sets `closed-out` when every novel finding is closeout / disproven / accepted-as-residual and
nothing blocking remains. That is **not** this round: **four of the five were FIXED**, and three of those
fixes put **new bytes inside the review fence** (a positive control, a fixture precondition and an
`existsSync` import in `test/dashboard-contract.test.js`; an index line and a count word in
`test/prove-red.sh`) that **no reviewer has yet seen**. Marking this closed-out would foreclose
verification of code written in response to the review. ⛔ **No new accepted residual was recorded this
round** — the existing residual *"Mutations 5a and 5b are broad by design"* already anticipated R3/R4 in
its own re-raise clause and needs no amendment.

**Gates re-measured on the final bytes of this round** — see the worklog §10 for the full table.

---

**Round 2 — closeout. Severity below is again the coder's own, derived from a traced blast radius.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R6 | CORRECT | Defect (record, sev **low**, = reviewer) | ⛔ **Verified by my own count, not carried from the relay.** Counted the baseline steps in `test/prove-red.sh` directly (`grep -cE "^printf '0[a-z]\."`): **14**, labelled `0a 0b 0c 0d 0e 0f 0g 0h 0i 0j 0k 0l 0m 0n` — no gap, no duplicate. The row contradicted its own parenthetical, exactly as claimed. Fixed the digit **13 → 14** in the worklog § `10a.` gate table, row *"the full hard gate, run to completion"* — ⛔ **one character; nothing else in that row touched.** | ✅ done |

**What round 2 proved, recorded because it is worth keeping.** Round 2 was a verification pass, and all
four round-1 fixes **held under independent re-measurement**. Three results in particular are worth more
than their row in the table:

- It **reconstructed the original R1 defect** rather than trusting the record — restored the round-1 test
  shape (control write, `existsSync`, control assertion all removed), deleted the `done/sprint-9.md`
  fixture write, and got **148/148 green**. R1 was a real defect, not a theory.
- It confirmed **both halves of the fix are load-bearing, independently**: deleting either the
  `control-depth-1.md` write or the `done/sprint-9.md` write reds `0271/5a` **alone** — **147 pass / 1
  fail** each. Neither half is decorative.
- It **independently checked that the `existsSync` precondition was not over-built** — the one judgment
  call the build flagged as going beyond the owner's literal ruling. Probing the real `dashboard.sh` with
  two fixture dirs differing only by `done/sprint-9.md` gave **byte-identical stdout, exit 3 both**. The
  `done/` exclusion is invisible to stdout **by construction**, so no assertion on `out` could ever have
  met the acceptance criterion. ⭐ **The departure was necessary, and is now measured rather than
  argued.**

**Zero novel findings beyond R6.** Nothing in the *Coder response* section was refuted; every figure in
it held exactly. Both reviewers independently reached *"verified, nothing new"*, and the Codex pass —
though **reasoning-only this round** (it ran reads and static syntax checks, no suite, no mutation; all
execution evidence is the Claude reviewer's) — raised nothing further. The reviewer's own convergence
call was **CLOSE OUT**, with R6 explicitly **not** a basis for a round 3.

**⚠️ What I did NOT measure this round, and why.** The full `test/prove-red.sh` hard gate takes **4+
hours** (32 mutations × the full suite) and I was instructed not to re-run it for a records-only change.
So `✓ hard gate PASSED`, exit 0, **32/32 red at their named assertion, no `✗`**, and *"all 14 baselines
**green**"* are **round 2's measurements, carried — not mine.** ⭐ What is mine is the **count**: 14
baseline steps exist in the script, counted statically this round. The digit I wrote is measured; the
greenness beside it is inherited and flagged as such.

**Loop check.** R6 is genuinely novel — round 2 raised it against bytes round 1 wrote, and it lands on no
accepted residual. ⛔ **No settled item was reopened, and no prior finding was re-fixed.** R6 needs **no
new residual**: it is fixed, not accepted.

**Regression check.** This round's change surface is **records only** — this `review.md` and the
worklog's single digit. ⛔ No source file, no test, no `claude/`, no `.claude/`, no
`ai-agents/knowledge-base/`, no vault write, no board row, no folder moved, no `NAMED_EXEMPT` addition
(the pin stays **7**). `claude/skills/fkit-status/dashboard.sh` re-verified this round at blob
**`7ca95612d2f082c19ae75b3dc48cb31113f7f07e`** and absent from `git status` — checked, not inherited.

**✅ Status set to `closed-out`.** Every finding across both rounds is dispositioned: R1–R5 fixed in
round 1, R6 fixed here. Nothing blocking remains, no finding is outstanding, and the owner's ruling of
2026-09-10 (*"Close out and close the row"*) supplies the disposition the reviewer correctly declined to
make for itself. ⛔ **Closing the ledger is not closing the task row** — the folder move and board flip
are the producer's, not mine.

## Accepted residuals (shared, do-not-re-litigate)

- **U1 field-tolerant assertion idiom** — What: the five new guards match fields by prefix/regex, never
  whole-line stdout equality, so `0338`'s deliberate grammar extension (`candidate` gains `status=`,
  `active` goes plural, a `chosen file=` line appears) does not red them. · Why (structural): owner
  ruling of 2026-09-10, option label "Field-tolerant (Rec)"; the alternative — copying the existing
  `S1`–`S8` exact-equality idiom — would red `0338` for doing its job. **Named accepted cost: a stray
  EXTRA field on a line these tests read would not be caught.** · Re-raise only if: a guard is found
  that is weaker than that named cost, or `0338` lands and a guard reds anyway.
- **U2 exactly one new prove-red mutation** — What: `# --- Mutation 32` only, targeting item 1's `seen`
  de-dup; count 31 → 32. · Why (structural): owner ruling of 2026-09-10, option label "One — item 1's
  `seen` drop (Rec)"; the brief scoped one and says a sixth is a new brief and a new owner ruling. ·
  Re-raise only if: the brief is re-scoped, or Mutation 32 is shown not to red at `0271/1`.
- **U3 item 5a's red-proof widens the glob to depth 2** — What: 5a is red-proved by mutating
  `dashboard.sh:241` from `"$1"/*.md` to `"$1"/*/*.md`; there is **no exclusion code** to neutralize —
  the exclusion is emergent from the depth-1 glob. · Why (structural): owner ruling of 2026-09-10,
  option label "Widen the glob to depth 2 (Rec)"; the behavior is real and probe-confirmed, only the
  brief's account of the mechanism was wrong, and it is recorded. · Re-raise only if: the depth-1 glob
  itself is replaced (which `0338` explicitly does not do). ⛔ "There is no exclusion code" is the
  point, not a finding.
- **The task folder name says "three" while the brief's H1 says "five"** — What: the folder is not
  renamed. · Why (structural): the brief forbids it explicitly ("Do not rename it as a side effect of
  this task"), and a folder rename is a task-file move only the producer's mover skills may perform
  (ADR-033). · Re-raise only if: the producer schedules the rename as its own task.
- **Mutations 5a and 5b are broad by design** — What: 5a reds 10 tests, 5b reds 134; both are the
  mutations the approved plan and rulings named, and each reds at its **own** named assertion, verified
  by message text. · Why (structural): breadth is stated in the worklog, not hidden, and the named-
  assertion check is what the proof needs. · Re-raise only if: a narrower mutation is **named and
  measured** — which R3/R4 now do, for the record only.
- **The plan's `143 → 149` prediction** — What: measured is **148** (143 + 5). · Why (structural): an
  arithmetic slip in the driver's plan, corrected by the build; the measured number is the number. ·
  Re-raise only if: the measured count changes.
- **`0271/1`'s mutation reds a second, pre-existing test** — What: dropping `seen` also reds
  `ADR-041 §2: both Backlog and Sprint Backlog resolve to the value Backlog`, because that fixture hits
  the same de-dup through the normalize-before-dedupe path; so the de-dup was **partly** pinned already
  and the brief's "129/129 green" framing was stale. · Why (structural): re-measured and verified by
  this review — under the mutant, both `# Sprint 5 — Sprint 5` and `# Backlog — Sprint Backlog` stop
  resolving. The ADR-040 §2.5 numbered-token case was genuinely unpinned, so item 1 still earns its
  slot. It is a second red, not a red for the wrong reason, and Mutation 32's header comment says so. ·
  Re-raise only if: the `ADR-041 §2` test changes such that the second red disappears.
- **The awk-dialect limit** — What: only BSD one-true-awk 20200816 was exercised; `gawk`, `mawk` and
  `busybox awk` are **unverified**, for the guards and for Mutation 32's own swap. · Why (structural):
  carried from `0264` residual A3 as context, not scope; every construct is POSIX and `LC_ALL=C` makes
  the dash literals byte-matches, so it is believed portable but was not measured. · Re-raise only if:
  fkit is run on a host whose default awk is not BSD awk, or a dialect failure is actually observed.
- **Mutation 32 disarms silently on a test rename** — What: the `0271/1` token in the test title is the
  mutation's only handle; the `cmp -s` no-op guard catches a reworded `!(s in seen)` line, but not a
  renamed test. · Why (structural): identical to mutation 14's landed precedent, and stated in the
  worklog rather than glossed. · Re-raise only if: a general test-name-token guard is built for the
  whole prove-red gate.
