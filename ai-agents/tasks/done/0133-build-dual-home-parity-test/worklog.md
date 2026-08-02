# 0133 — worklog

Built 2026-08-01 by `fkit-coder`, spawned as the **Build worker** of `/fkit-sprint-ship-loop` under
the loop's declared-approval marker (ADR-032 Decision 3). No commit; no task-file move.

## Step 0 — baseline, before any edit

Re-measured both halves. The previous turn had measured only `test:unit`; **"hard gate PASSED" was
0132's ledger claim, not my own measurement**, so it was re-run here before touching anything. A
pre-existing red must never be misattributed to this task.

| Half | Result |
|---|---|
| `npm run test:unit` | **551 pass / 0 fail / 17 suites** |
| `bash test/prove-red.sh` | **exit 0** — `✓ hard gate PASSED`; 0a–0g green, mutations 1–9 each red at their named assertion |

## The derived enforced set

Derived (not hard-coded) as the union walk minus the exception list — **exactly four files**, all four
present in both homes and **all four byte-identical**:

| Bytes | Path |
|---|---|
| 4389 | `knowledge-base/conventions/priority-is-rank-not-identity.md` |
| 3227 | `knowledge-base/conventions/task-owner-vocabulary.md` |
| 5611 | `tasks/README.md` |
| 3608 | `wiki-vault/schema.md` |

So **brief step 6 is genuinely met**: the suite is green on the real tree with no leftover drift, not
green because the walk found nothing. The non-vacuity assertion is what keeps that honest.

Prune points found: 11 in the live home, 9 in the scaffold. Two of them — `wiki-vault/.fkit` and
`tasks/backlog/.fkit` — are **exact** entries (no trailing slash) that name **directories on disk**.
That is the measured fact behind the §2.5 generalization: keying the tripwire on "entry ends in `/`"
would have missed both.

## Decisions taken during the build (beyond the four owner rulings)

1. **`assert.ok`, not `assert.deepEqual`, for every rendered-message assertion.** Found by reading the
   hand-broken failures: `deepEqual` appends its own actual/expected dump, re-printing the whole report
   a second time with newlines escaped and a third time in the `actual:` field. At one drifted file
   that is noise; at four it is precisely the unreadable blob brief step 4 exists to prevent.
   Mechanical, localized, inside the plan's intent.
2. **The two missing-file directions get different second lines.** The first draft printed *"this is
   the shape that hid `dependency-declaration-form.md` for weeks"* for **both** directions, which is
   simply **false** of the scaffold-only direction — that bug was a live file missing from the
   scaffold. Caught only by reading the rendered message, never by an assertion. A failure message that
   misstates the failure sends the reader to the wrong fix.
3. **Guard 12 strengthened after it failed its own disarm test.** `>>` *creates* a missing file, so a
   renamed target silently turned mutation 12 into a scaffold-only-file mutation: the suite still went
   red, but at the presence assertion, and the `cmp` no-op guard never fired. Added an existence check
   ahead of the append. Verified firing.
4. **A third now-false statement in the convention** was retired alongside the two the plan named:
   *"Until the test exists, this convention is enforced by reading it."* Same class, same section,
   false the moment this task landed. Flagged rather than done silently.
5. **The 30-character floor's cited measurement was corrected.** The plan's approval note cited
   *"shortest real reason ≈ 100 chars, so 30 has 3× headroom."* Measured over all 26 live entries the
   true shortest is **84** characters (`wiki-vault/.fkit`), longest 732 — so the headroom is **~2.8×**,
   not 3×. The floor stands as approved; the comment cites the real number and says it was corrected,
   rather than leaving a flattering round figure in a file about not going quietly green.

## Proving it red

`test/prove-red.sh` gained step `0h` (an unmutated copy of the scaffold home must be green — otherwise
a red below could be red-because-the-copy-is-broken) and mutations **10–13**. Header index updated
`NINE` → `THIRTEEN`.

| # | Mutation | Named assertion it must red | Result |
|---|---|---|---|
| 10 | delete `tasks/README.md` from the scaffold copy | `present in BOTH homes` | red ✓ |
| 11 | add a scaffold-only `ghost-parity-probe.md` | `present in BOTH homes` | red ✓ |
| 12 | **append one byte** to `task-owner-vocabulary.md` | `byte-identical` | red ✓ |
| 13 | copy live `knowledge-base/reports/README.md` into the scaffold, under a prune point | `no prune point hides a file` | red ✓ |

**Mutation 12 appends rather than `sed`s.** An anchored `sed` on prose is exactly how mutation 1
silently disarmed itself for a whole task — the wording changed, the pattern stopped matching, the
"mutant" became byte-identical to the original, and the gate reported success while proving nothing.
`>>` has no pattern and cannot stop matching.

**Mutation 13's probe is 0132's own named near-miss**, not a synthetic name.
`knowledge-base/reports/README.md` is a folder-purpose doc of the same species as `tasks/README.md`
(which *is* dual-homed and *is* enforced); it exists live today and not in the scaffold. Copying it in
makes exactly that future real, today.

**All four no-op guards were proved to fire**, by disarming every probe in a trimmed scratch copy of
the script and confirming each shouts and fails the gate. Guard 12 did not fire on the first attempt —
see decision 3 above.

## §0112 — NOT APPLICABLE, and the substitute check

See the task report / review ledger for the full statement. In short: the intersection between 0112's
write surface and the enforced parity surface is **empty**, so the brief's asked-for check is neither
pass nor fail. **This does not retire the owner's accepted risk on 0112.** The substitute check —
`lead` ↔ `fkit-sprint-ship-loop` across the source of truth and its four mirrors — **PASSES 5/5**.

⚠️ My first run of the substitute check reported `architecture.md` as **FAIL**. That was **my grep
pattern's error, not a defect**: architecture.md's §4.2 table drops the `fkit-` prefix uniformly for
every role, so it records the mapping as `sprint-ship-loop`. Re-run prefix-agnostically it passes, and
each hit was confirmed to sit on a **lead** line. Recorded because a false failure reported as real
would have cost the producer a task.

## Left alone, deliberately

- **`test/dual-home-parity-exceptions.mjs`** — 0132's artifact, explicitly out of scope.
- **`architecture.md`'s "eight contract files" claim is stale** (14 today, 15 after this task).
  Pre-existing, out of scope, flagged for producer scoping — task `0115` owns that surface.
- **`reviews/README.md`** — gone from both homes; nothing asserts on it.

---

## Round-1 review, processed (2026-08-01)

`fkit-process-stateful-review` applied by `fkit-coder`, spawned as the **Process-review worker** of
`/fkit-sprint-ship-loop` under the loop's declared-approval marker. Owner rulings: fix **R1 · R2 · R5 ·
R7**, accept **R3 · R4 · R6** as residuals. All seven verified against the code first; all seven
reproduce. Verdicts, actions and residuals are in `review.md`.

**What changed**

| File | Change |
|---|---|
| `test/dual-home-parity.test.js` | R1 — `excusedBeneath()` (new, exported): a tripwire hit is excused by an exception entry **strictly beneath** the prune point, so the message's "give it its own exception entry" is now true. Un-excused hits are **added to the enforced set**, so a co-present file under a blanket reaches byte-parity without being physically moved. Message rewritten; header rule 2 updated; two synthetic tests added. |
| `test/prove-red.sh` | R2 — mutation 13 gained the post-condition guard the other nine carry (`cmp -s` repo file vs **mutant copy**). R5 — mutation 12's no-op guard now tests `.orig` existence before `cmp`. |
| `ai-agents/knowledge-base/conventions/dual-home-parity.md` | R7 — "Where this is enforced" now describes the tripwire on **prune points** (both spellings) and the enforced-set promotion, instead of the narrow "blanket directory exception" wording the test generalized away from. |

**Two regressions I introduced and caught inside the round, disclosed rather than quietly fixed:**

1. The first cut of the promotion tested presence against the **walk** sets, which by construction do
   not contain a pruned path — so mutation 13 reported a file sitting in **both** homes as *"MISSING
   from `ai-agents/`"* and reded two assertions. Found by **running** mutation 13, not by reading the
   change. This is the concrete argument for re-proving a mutation after touching the code it probes.
2. `excusedBeneath` first matched the prune point's **own** entry (`knowledge-base/reports/` starts
   with `knowledge-base/reports/`), disarming the tripwire completely. The two new fixtures went empty
   and failed — the tests caught it before the gate did.

**Re-verification after the fixes** (every liveness proof re-established, none assumed):

| Check | Result |
|---|---|
| `npm test` | **560 pass / 0 fail / 17 suites** (551 baseline + 9 parity tests), exit 0 |
| `bash test/prove-red.sh` | `✓ hard gate PASSED`, exit 0; 0a–0h green |
| Mutations 10 · 11 · 12 · 13 | each **red at its named assertion**; mutation 13 now reds the tripwire **only** |
| Disarm proof, all four guards | 10, 11, 12 (missing file), 12 (`.orig` copy + append both fail — R5's case), 13 (destination directory absent — R2's case), 13 (`cp` disarmed) → **all six shout `MUTATION WAS A NO-OP`** and fail the gate |
| Enforced set, re-derived independently | unchanged — the same **four** files at 4389 / 3227 / 5611 / 3608 bytes, all byte-identical; 11 prune points; `hidden` empty |

**Still true after the edits:** the grep fragment `byte-identical` is not introduced anywhere new (the
tripwire message says "byte-parity"), and `present in BOTH homes` appears in the tripwire message
exactly as it did before — mutation 13 reds only the tripwire, so no grep cross-matches.

**Not changed, deliberately:** `test/dual-home-parity-exceptions.mjs` (0132's artifact, out of scope —
the R1 fix needed no entry added to it). The mutation-13 false-accusation TEXT still prints after the
no-op line, exactly as mutation 10's does; suppressing it would mean restructuring control flow across
all thirteen mutations, which is broader than the approved fix. The true cause now prints **first**.

---

## 2026-08-02 — round-2 review processed; ledger closed

`fkit-process-stateful-review` on **round 2** (findings R8–R11), as the Process-review worker spawned by
`/fkit-sprint-ship-loop` under the loop's declared-approval marker. Owner rulings of 2026-08-02: fix
**R8 · R9 · R10**, accept **R11** as a residual, no round 3. All four verified against the code first;
all four reproduce. **Round 2 found no new defect in the mechanism** — the R1 tripwire rewrite was
judged SOUND, both disclosed regressions independently confirmed closed, and no third regression exists.

**What changed**

| File | Change |
|---|---|
| `test/dual-home-parity.test.js` | **R8** — the promotion's byte-comparison is now **pinned**, on the fixture that already had the right shape: `wiki-vault/.fkit/session-state` is a *promoted* path whose two copies genuinely differ, and the test now asserts it lands in `differing`, joins `enforced`, and fires neither presence direction (`:669-676`). **R9** — the header no longer offers `tasks/backlog/.fkit` as a second exact-entry prune point; it is not one, and the correction states the opposite role it actually plays (`:61-67`). **R10** — header rule 2 said *"`findException` resolves it"*; it now says *"the exception list CONTAINS"* and carries the array-order reasoning as the stated reason not to simplify `excusedBeneath` into a `findException` call (`:83-92`). |
| `ai-agents/knowledge-base/conventions/dual-home-parity.md` | **R9** — "Where this is enforced" no longer names `tasks/backlog/.fkit` as an exact-named prune point, and carries a measured correction note: `wiki-vault/.fkit` is the only exact-entry prune point in the tree, and `tasks/backlog/.fkit` is the entry *beneath* a prune point that *excuses*. |
| `test/prove-red.sh` | **unchanged** — R11 accepted as a residual. |

**R8 was the one with teeth, and it was reproduced before it was fixed.** Adding
`if (promoted.has(p)) continue;` to `compareHomes`'s comparison loop left **all nine tests green** — so
the tripwire message's *"the two copies were compared above"* was promising behavior nothing pinned:
the same species of defect R1 was. **And the new pin was falsified rather than trusted:** with the
byte-comparison voided the new assertion reds (`actual: []` vs `expected:
['wiki-vault/.fkit/session-state']`), 8 pass / 1 fail. An unpinned promise was not replaced by an
unpinned test.

**Disclosed: two disarm variants did not fire on the first attempt, and the cause was my harness.**
Variants 4 and 6 initially reported exit 0 with no `MUTATION WAS A NO-OP`, which reads as "the R5 and
R2 guards are dead". A `sed` pattern in the scratch harness silently matched nothing, so the disarm was
never applied. Caught by diffing the patched script against the original instead of trusting the exit
code. Re-run with the patch verified applied, **both guards fire and fail the gate.**

**Disclosed: one edit outside the three named findings.** R9's finding flags the same wrong example at
`dual-home-parity.test.js:57`, marks it adjacent/not-raised, and says *"fix both or neither"*. Both were
fixed — leaving a known-false statement in the file most likely to be read next, in the round that
corrected it elsewhere, would repeat the defect. Comment-only, no behavior change; noted in `review.md`
as the edit to revert if the owner wanted the header left alone.

**Re-verification** (R8 touches the parity suite's assertions, so the four gates were re-proved):

| Check | Result |
|---|---|
| R8's pin, with the promotion's byte-comparison removed | **8 pass / 1 fail** — the new assertion reds. Before the fix the identical mutilation was **9/9 green**. |
| `node --test test/*.test.js` | **560 tests / 17 suites / 560 pass / 0 fail** — unchanged count (assertions added to an existing test) |
| `bash test/prove-red.sh` | `0a`–`0h` green, mutations 1–13 red at their named assertions, `✓ hard gate PASSED`, **exit 0** |
| Disarm proof, mutations 10–13, six variants | all six shout `MUTATION WAS A NO-OP` and **fail the gate** — including V4 (R5's `.orig`-fails case) and V6 (R2's missing-destination case) |
| Grep-fragment cross-match matrix, re-measured | clean diagonal, **no cross-match**. A draft assertion message read *"present in both homes"* — one case-fold from mutation 10/11's fragment — and was reworded to *"co-present"* rather than left relying on case-sensitivity. |

**Ledger closed.** `review.md` status is **CLOSED — 2026-08-02**, final verdict **✅ approved**, with
accepted residuals **R3 · R4 · R6 · R11** each carrying a falsifiable *re-raise only if*. R11's entry
records the **severity dissent** (Codex medium vs reviewer LOW; owner took LOW; coder agrees) so the
residual does not hide the disagreement it was accepted over.

**Still open, and NOT retired by this task: the 0112 manual re-verification.** 0112's write surface
lives under `claude/`, so it will **never** intersect the parity surface — the owner's "re-verify by
hand once 0133 lands" ruling **cannot be discharged by this mechanism at all**, now or later. The
substitute check ran instead (`lead` ↔ `sprint-ship-loop` across the source of truth and its four
mirrors, **PASS 5/5**, independently confirmed). This is an open **producer** item, not a defect in 0133.
