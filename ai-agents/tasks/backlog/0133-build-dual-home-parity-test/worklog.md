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
