# Review — 0265

Task: `ai-agents/tasks/done/0265-implement-adr-041s-dashboard-half-the-backlog-identity-token-and-the-resolve-identity-interface/brief.md`
File(s) under review: `claude/skills/fkit-status/dashboard.sh`, `test/dashboard-contract.test.js`
Spec: `ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md`
Status: coder-responded (Round 1)

**Round 1 verdict: ⚠️ Changes requested — 7 defects (none blocking).**

> 🟡 **COVERAGE IS PARTIAL AND THIS IS NOT A FOOTNOTE.** The Codex second opinion **ran and returned
> findings**, but its read-only sandbox blocked `mkdtemp` (`EPERM`), so it could execute **neither**
> `npm test`, `prove-red.sh`, scratch fixtures, **nor any mutation**. Codex's own words: *"No scoped
> finding confirmed … defect demonstrations that require filenames/permissions or mutations remain
> static reasoning only."* **Every piece of execution evidence in this review is the reviewer's.**
> This is the second consecutive task on which the Codex sandbox blocked execution.

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | med | `test/dashboard-contract.test.js:2654` | **S7 is a false guard.** Deleting `LC_ALL=C` + `export LC_ALL` from `dashboard.sh` leaves the dashboard suite **green (141/141, measured)**. S7's fixture (`sprint-6.md` / `plan-sprint-6.md`) orders `p` < `s` identically under C and en_US.UTF-8, so the assertion cannot fail. The locale pinning it claims to protect is unprotected. Raised by **both** reviewers. |
| R2 | 1 | low-med | `claude/skills/fkit-status/dashboard.sh:239-241` | **The `sort`-avoidance comment claims newline-safety the code does not have** — *"a `sort` would also mangle a filename containing a newline; the glob loop merely carries it."* Measured: candidate `sprint-9\nx.md` yields `active file="x.md"` — **a file that does not exist** — plus a phantom candidate and a bogus `drift ambiguous-active-sprint … also="sprint-9 x.md"`. `_recs` is newline-delimited; the glob loop does **not** carry it. |
| R3 | 1 | low | `dashboard.sh:224,236-237` | **A TAB in a basename silently drops a valid plan from eligibility, and is disclosed nowhere.** `_recs` is TAB-delimited. Measured: `a\tb.md` with H1 `# X — Sprint 9` → `candidate file="a" identity="b.md<TAB>Sprint 9"` → ineligible → `sprint-3.md` wins and the `Sprint 9` plan vanishes **silently**. `worklog.md:§7` discloses the **newline** limit only. |
| R4 | 1 | low | `dashboard.sh:229` | **`select-active`'s `[ -f ]` no-match guard is unpinned.** Removing it leaves the suite **green (141/141, measured)**. When it fires (empty `sprints/`): phantom `candidate file="*.md" identity="unresolved"` + a `head: … No such file` on stderr. Selection stays correct (`active none`, exit 3). ✅ The **more dangerous half — the `set +f`/`set -f` wrapper — IS pinned** (removing it reds **7** tests, measured). |
| R5 | 1 | low-med | `dashboard.sh:85` | **An unreadable candidate silently resolves to the WRONG identity.** `head -1` fails, awk exits 0 on empty input, the stem rung answers. Measured: `sprint-1.md` (mode `000`, real H1 `# X — Sprint 99`) → `identity` prints **`Sprint 1`, exit 0**. Violates ADR-040's *"a wrong identity is strictly worse than none"*. **Inherited from 0264's ladder — not a regression here — but 0265 widens the blast radius**: `select-active` and `sibling_claimants` now run the ladder over files the caller never named. |
| R6 | 1 | low | `dashboard.sh:85,138,190` | **A leading-`-` plan path leaks `head`/`basename` usage errors.** Measured: `identity -plan.md` → `head: invalid option -- p` + two `basename: illegal option -- p`, exit 3. **Fails safe** (unresolved, never wrong), but a valid file is unreadable-by-argument. `--` separators would close it. |
| R7 | 1 | low | `test/dashboard-contract.test.js:2714` · `dashboard.sh:277-280` | **Two claims made in comments are pinned by no test.** (a) ADR-041 §1.1's `sprints/done/` exclusion — no test places a `.md` there for a `select-active` run. (b) *"a plan file literally named `identity` still renders as a board"* — the compat test never uses that filename. Both are **correct as built** (probed), neither reds if undone. |

### Verified and NOT reported as defects

- **The relocation (§4.1 step 1) is semantically clean.** The intermediate (post-0264) state was never
  committed, so it is **not diffable from git** — stated as a coverage limit. Compensating evidence:
  129 pre-existing dashboard tests green, **plus** direct probes of the two behaviors 0264's own
  ledger records as *unpinned* (residual A2 items 1–2), which the suite would not have caught:
  distinct-count de-dup (`# Sprint 5 — Sprint 5` → `Sprint 5` ✅) and the first-line-only narrowing
  (H1 on line 5 → unresolved, exit 3 ✅). `Post-Sprint 2` → unresolved ✅; two different tokens →
  refuse ✅.
- **The `Backlog` normalization before the distinct-count is right, and the two token families cannot
  collide.** Probed: `Backlog`→`Backlog`, `Sprint Backlog`→`Backlog`, `Backlog — Sprint Backlog`→
  `Backlog` (normalize-before-dedupe holds), `Sprint 5 — Backlog`→refuse, `Post-Sprint Backlog`→
  unresolved, `sprint backlog`→unresolved. `Sprint Backlog` can never match `^Sprint [0-9]+[a-z]?$`.
- **Ordering is correct on every edge case probed** — `10>9`, `08<9`, `007<8`, `4<4a<4b<4c`,
  `100>99>9`, `0<1`, `00<0a`, and a **30-digit** N (no overflow). Leading-zero strip is pinned (M3 reds).
- **The amended CONTRACT comment (`dashboard.sh:24-37`) is accurate.** It reads first lines only —
  verified — and is an upper bound: the sibling scan runs only when the plan's identity is *eligible*.
- **Mutation battery — the ADR's required contracts genuinely red** (measured, on a scratch copy):
  `set +f` wrapper → 7 fail · `is_eligible` filter → 5 fail · `Backlog` normalization → 3 fail ·
  normalize-after-count → 3 fail · tie-break keep-last → 2 fail · leading-zero strip → 1 fail ·
  `plan_level_drift` for ambiguity → 1 fail · `also=` first-only → 1 fail.
- **Test change is additive.** The 2 deleted lines are `fixture()`'s `planName` parameter — **0264's
  change, out of scope**, and `fixture()` is byte-unchanged relative to this task's baseline.
- **Live repo unaffected.** `select-active ai-agents/sprints` → `sprint-5.md` / `Sprint 5`;
  `identity backlog.md` → `Backlog`; board render of `sprint-5.md` emits **no** drift facts.
- **Independent re-measure:** `npm test` → **707 tests / 707 pass / 0 fail**, `✓ hard gate PASSED`.

### Re-litigates settled decisions (suppressed — not dropped)

| Raised | Settled by | Why suppressed |
|---|---|---|
| The contract widening (board mode reading sibling first lines) | Owner ruling 2026-08-11 §7.1 *"Accept the widening"* | Not raised as a surprise. The three conditions the ruling left open were **checked**: the amended comment is accurate, the read is first-line-only, and no unanticipated consequence was found **except R5's widened blast radius, which is recorded as a finding**. |
| No permanent `prove-red.sh` mutation for the ordering contract | Owner ruling 2026-08-11 §7.2 | Absence is ruled, not a finding. |
| CLI names `identity` / `select-active`, exit 3 | Owner ruling 2026-08-11 §7.3 | Not open for renaming. |
| `select-active` reports collisions for eligible identities only | ADR-041 §1.3 + plan §4.2 boundary | `Backlog` is never eligible, so such a pair cannot mis-select. Declared, not overlooked. |
| ADR-040 A2's three unpinned behaviors | `0264` review ledger, residual **A2**; filed as `0271` | All three **re-verified as still correct**; not re-raised. |
| `moved_target` right boundary (`Sprint 4th` → `Sprint 4t`) | `0264` review ledger, residual **A1** | Unchanged by this task. |

### Convergence call

**New defects, not re-litigation — act, do not close out.** Nothing in this round re-argues a settled
residual: R1 and R3–R7 are all **first-round findings on code this task introduced**. R1 is a *fourth*
instance of 0264 residual **A2**'s pattern (*a correct behavior with no test that reds when it is
undone*) — but A2 enumerates exactly three items and `0271` is scoped to those three, so R1 is **novel
and outside `0271`'s scope**, not covered by it.

**Nothing here blocks.** Every behavior ADR-041 requires is implemented correctly and — with the single
exception of S7's locale pinning — genuinely pinned. R2/R3/R5/R6 need pathological inputs (embedded
newline/tab, mode `000`, a leading `-`). The honest shape of this round is: **the code is right; two
comments overclaim, one residual is incomplete, and three guards are vacuous or absent.**


## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

**All 7 findings independently re-verified against the code before any action. Every one reproduced
exactly as claimed** — including R4's asymmetry (7 tests red without the `set +f` wrapper, 141/141
green without `[ -f ]`). No finding was applied on the reviewer's word alone; the Codex-originated
ones (R3/R5/R6) were re-measured here rather than trusted as static reasoning, since Codex executed
nothing.

⚠️ **One reviewer *rationale* is contradicted by measurement — the finding stands, the workaround
advice does not.** See the R1 note. It does not change the action, so it is reported, not escalated.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | ✅ CORRECT — reproduced: pin deleted → suite green **141/141** | Defect | **FIXED.** Two guards, both red-proved. | applied |
| R2 | ✅ CORRECT — reproduced: `sprint-9<LF>x.md` → `active file="x.md"`, a file that does not exist | Defect (comment overclaims) | **FIXED, docs-only.** Comment withdraws the false claim and states the real limit. Code unchanged, per ruling. | applied |
| R3 | ✅ CORRECT — reproduced: `a<TAB>b.md` → `identity="b.md<TAB>Sprint 9"`, plan silently ineligible | Defect (undisclosed limit) | **FIXED, docs-only.** `worklog.md` §7 completed; also folded into the R2 comment. | applied |
| R4 | ✅ CORRECT — both halves reproduced exactly | Defect (unpinned guard) | **Not fixed** — residual for `0271`, per ruling. | accepted residual |
| R5 | ✅ CORRECT — reproduced: mode-`000` `sprint-1.md`, real H1 `Sprint 99` → printed **`Sprint 1`, exit 0** | Defect (**wrong identity** — ADR-040's binding rule) | **FIXED + pinned.** `[ -r "$1" ]` precondition on the whole ladder; new test, red-proved. | applied |
| R6 | ✅ CORRECT — reproduced: `identity -plan.md` → `head`/`basename` usage errors, exit 3 | Defect (cosmetic; **fails safe**) | **Not fixed** — accepted residual, per ruling. | accepted residual |
| R7 | ✅ CORRECT — no test places a `.md` in `sprints/done/` for `select-active`; no test uses a plan named `identity` | Defect (unpinned claims) | **Not fixed** — residual for `0271`, per ruling. | accepted residual |

### R1 — what was built, and where the reviewer's rationale is wrong

The reviewer advised a fixture-based fix *"will be vacuous here"* because *"macOS en_US.UTF-8
collation **is** byte order"*. **Measured on this machine: that is false.** bash glob expansion does
honour the collation difference:

```
files: Qlan-sprint-6.md, plan-sprint-6.md
LC_ALL=C           -> Qlan-sprint-6.md  plan-sprint-6.md     ('Q' 0x51 < 'p' 0x70)
LC_ALL=en_US.UTF-8 -> plan-sprint-6.md  Qlan-sprint-6.md     (alphabetic, case-insensitive)
```

The reviewer **is** right that the filesystem is case-insensitive, so ADR-041 §1.5's own
`Plan-`/`plan-` illustration cannot be used — those two names collide and only one file survives. The
error is generalising that to *all* fixtures. `Qlan-`/`plan-` discriminates cleanly.

So **both** guards were built, and both red when the pin is deleted:

1. **The owner's preferred portable assertion** — reads `dashboard.sh` and asserts `^LC_ALL=C$` and
   `^export LC_ALL$`. No environmental hole; reds on every machine.
2. **S7 strengthened into a real behavioral test** — fixture renamed to `Qlan-sprint-6.md` /
   `plan-sprint-6.md`. Under the pin the selection is `Qlan-…`; without it, `plan-…`.

Guard 2 is kept **in addition to**, never instead of, guard 1: where `en_US.UTF-8` is not installed
(minimal CI images) the locale falls back to C, both runs agree trivially, and S7 stops discriminating
**without failing**. That hole is exactly R1's own defect class, which is why the portable assertion
is primary. Said in the test's comment so the next reader is not misled.

### Red-proof of both fixes (required by the ruling)

```
########## delete `LC_ALL=C` + `export LC_ALL` ##########
✖ ADR-041 S7: the selection is byte-identical under a non-C locale
    actual:   active file="plan-sprint-6.md" … chosen="plan-sprint-6.md" also="Qlan-sprint-6.md"
    expected: active file="Qlan-sprint-6.md" … chosen="Qlan-sprint-6.md" also="plan-sprint-6.md"
✖ ADR-041 R1: dashboard.sh pins and exports `LC_ALL=C` — locale independence is structural
    expected: /^LC_ALL=C$/m
ℹ tests 2 · pass 0 · fail 2          -> restored: pass 2 · fail 0

########## remove `[ -r "$1" ] || return 0` ##########
✖ ADR-041 R5: an unreadable candidate resolves to `unresolved`, never to a wrong identity
    AssertionError: the filename rung must not answer for a file it could not read
ℹ tests 1 · pass 0 · fail 1          -> restored: pass 1 · fail 0
```

### Final measurement

```
npm test  ->  exit 0
ℹ tests 709 · suites 17 · pass 709 · fail 0 · cancelled 0 · skipped 0 · todo 0
14. move-target extractor reverted to Sprint-only — "0210/A" should go RED ... red
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

707 → **709** (+2 guards). Live repo re-checked: `select-active ai-agents/sprints` → `sprint-5.md` /
`Sprint 5`; `identity backlog.md` → `Backlog`; `sprint-5.md` board render still **byte-identical** to
the pre-`0265` run.

⛔ Untouched, as ruled: `STATUS_HEADING_RE`, rung 3's behavior, the `moved_target` right-boundary
residual, `0264`'s three unpinned behaviors, T6's corrected comment, `fkit-status/SKILL.md`,
`prove-red.sh`, `wiki-vault/`. No new devDependency. No commit, no push, no task-file move.

## Accepted residuals (shared, do-not-re-litigate)

Recorded on the owner's dispositions of 2026-08-11 (live `AskUserQuestion`, `fkit lead` session).
**Do not re-raise these in a later round** — they are settled, not overlooked.

| # | Residual | Disposition | Why it is acceptable |
|---|---|---|---|
| **A1** | **`select-active`'s `[ -f ]` no-match guard is unpinned** — removing it leaves 141/141 green. When it fires (empty `sprints/`): a phantom `candidate file="*.md" identity="unresolved"` plus a `head:` stderr line. **Selection stays correct** (`active none`, exit 3). ⚠️ The *dangerous* half — the `set +f`/`set -f` wrapper — **IS** pinned: removing it reds **7** tests (re-measured here). | **Fold into `0271`** (Backlog board). ⛔ Not fixed here, ⛔ not filed here — filing is the producer's (ADR-033). | Cosmetic-only when it fires, and the half that could silently mis-select is already pinned. |
| **A2** | **Two comment claims are pinned by no test** (R7): (a) ADR-041 §1.1's `sprints/done/` exclusion — no test places a `.md` there for a `select-active` run; (b) *"a plan file literally named `identity` still renders as a board"* — no test uses that filename. Both **verified correct as built** by direct probe; neither reds if undone. | **Fold into `0271`.** ⛔ Not fixed here, ⛔ not filed here. | The behavior is correct today; the gap is coverage, not conduct. |
| **A3** | **A leading-`-` plan path leaks `head`/`basename` usage errors** (R6): `identity -plan.md` → `head: invalid option -- p` plus two `basename: illegal option -- p`, exit 3. `--` separators would close it. | **Accepted. ⛔ Do not fix.** | **Fails safe** — resolves unresolved, never to a wrong identity. Noisy, not incorrect. |
| **A4** | **A newline or TAB in a plan's basename corrupts the candidate records.** Newline: `sprint-9<LF>x.md` → `active file="x.md"` (**a file that does not exist**), a phantom `candidate file="sprint-9"`, and a bogus `also="sprint-9 x.md"`. TAB: `a<TAB>b.md` → `identity="b.md<TAB>Sprint 9"` → **ineligible, so a valid plan silently drops out of the running.** | **Accepted, and now fully disclosed** — `dashboard.sh`'s tie-break comment (R2) and `worklog.md` §7 (R3) both state it. ⛔ Code unchanged, per ruling. | Consistent with every other line-based parser in this file, and needs a pathological filename. **It is now disclosed as a limit rather than described as safety.** |

⚠️ **Scope note, carried from the reviewer's convergence call:** A1 and A2 are the *only* items folded
toward `0271`. R1 was **novel and outside `0271`'s current three-item scope** — it was fixed here
instead, so `0271` is **not** widened by it. Nothing in these residuals asks `0271` to grow beyond
R4 and R7.
