# Worklog — task 0265: ADR-041's `dashboard.sh` half

Built 2026-08-11 by `fkit-coder`, spawned as the **Build worker** of `/fkit-sprint-ship-loop` under
the loop's declared-approval marker (owner approved the plan live in the `fkit lead` session,
option "Approve as planned (Recommended)"). ⛔ No commit. ⛔ No task file moved.

---

## 0. Preconditions — re-measured before the first edit (plan §0)

| Gate (brief verification step 1) | Measured |
|---|---|
| ADR-041 reads `accepted` | ✅ `adr-041-…md:3` → `- **Status:** accepted` |
| `0264` is closed | ✅ `ai-agents/tasks/done/0264-implement-adr-040s-identity-grammar-…/` exists |
| Baseline `npm test` | ✅ **695 tests / 695 pass / 0 fail**, exit 0 |
| Baseline `bash test/prove-red.sh` | ✅ `✓ hard gate PASSED` — 9 baseline gates green, 15 mutations red |

---

## 1. What changed

Two files. Nothing else was touched.

### `claude/skills/fkit-status/dashboard.sh`

1. **Relocation (pure move).** `SPRINT_NUM_RE` / `SPRINT_ID_RE`, `plan_sprint_from_h1`,
   `plan_sprint_from_stem` and `fact_value()` moved above `die()` — they had sat *after* the
   `AGENTS` walk-up, which `die`s when there is no `tasks/` tree above the plan. The new modes must
   resolve an identity without one. Comments, regexes and behaviour byte-unchanged; the rule-1
   rationale comment stayed at the `PLAN_SPRINT=` site with a pointer to the new home.
2. **`resolve_identity()`** — ADR-040's three rungs extracted verbatim into one function (ADR-041 §5's
   one-implementation constraint). Board mode's inline ladder collapsed to a single call. **Rung 3's
   `backlog` basename special case and its whole comment block are preserved byte-for-byte.**
3. **ADR-041 §2 — the `Backlog` H1 token.** Added to rung 1's awk segment loop, normalized to
   `Backlog` **before** the distinct-count so `# Backlog — Sprint Backlog` resolves instead of
   refusing. Value is always `Backlog`, never `Sprint Backlog`.
4. **`identity <plan>`** — prints one identity, or nothing. Exit 0 / 3 / 1. No `⟦…⟧` markers: a value,
   not a rendering.
5. **`select-active <sprints-dir>`** — ADR-041 §1 in full: candidates (depth-1 `*.md`), eligibility,
   ordering, tie-break, `also=` collision record, `active none` + exit 3 on an empty eligible set.
6. **Ordering** is length-then-bytes on the zero-stripped digits, then a suffix `strcmp` — **not**
   `[ "$a" -gt "$b" ]`, which misbehaves on leading zeros and long `<N>`.
7. **Board-mode sibling-collision check** — emits `drift ambiguous-plan-identity` and sets
   `plan_level_drift`, so it reaches the roll-up's *"and on the plan itself"* clause.
8. **CONTRACT comment amended** (top of file) to name the new read and why.

### `test/dashboard-contract.test.js`

**Additive only — no existing test was edited.** 12 new tests: S1, S1b, S2, S3, S4, S5, S6, S7, S8,
§2-a, §2-b, compat. New helpers `runMode`, `sprintsFixture`, `selectLines`, `activeLine`,
`candidates`, `prosePlan`; `fixture()` left byte-unchanged.

Change surface: `dashboard.sh` +318 lines net region, `dashboard-contract.test.js` +676.

---

## 2. Owner rulings applied

| Ruling | Applied as |
|---|---|
| §7.1 **"Accept the widening"** | Board mode detects the sibling collision itself, and the CONTRACT comment was amended in the same change to name the new read (first line of sibling `.md` files) and why. |
| §7.2 **"Recorded A/B, no new mutation"** | No `test/prove-red.sh` mutation added. The ordering contract is red-proved by the measured A/B in §3 below. `prove-red.sh` untouched. |
| §7.3 **"`identity` / `select-active`, exit 3"** | Exactly those names and exit codes. `0266` can hard-code them. |

---

## 3. The two measured A/Bs

### A/B 1 — the integer ordering proves itself red (brief verification step 4, plan §5 step 8)

Mutation: `identity_gt`'s length-then-bytes body replaced with `[ "$1" \> "$2" ]` (a plain text
compare). Reverted immediately after.

```
✖ ADR-041 S1: `Sprint 10` outranks `Sprint 9` — the ordering is a pinned contract, not prose
ℹ tests 2 · pass 1 · fail 1
    actual:   'active file="plan-sprint-9.md" identity="Sprint 9"'
    expected: 'active file="plan-sprint-10.md" identity="Sprint 10"'
```

After revert: `ℹ tests 2 · pass 2 · fail 0`.

**S1 goes red naming S1.** ⚠️ Stated at its accurate strength: this is a contract written down for the
first time, **not** a bug fixed. ADR-041 §1.4 withdraws the earlier "today's code text-sorts" claim —
there is no sort anywhere in the code. The mutation proves the *new* code carries the contract, not
that the old code broke it. No test name or comment restates the withdrawn claim.

### A/B 2 — the regained `:796` check (brief verification step 2)

Same S4 fixture, run against the **pre-0265** `dashboard.sh` and then the new one:

```
BEFORE (pre-0265):  ✖ ADR-041 S4 … — AssertionError: scheduled into Sprint 2 but still on the
                       unscheduled board — that is the check          [tests 1 · pass 0 · fail 1]
AFTER  (0265):      ✔ ADR-041 S4 …                                     [tests 1 · pass 1 · fail 0]
```

The check was **silent before and fires now** — both halves of ADR-041's compounded defect, measured
rather than asserted.

---

## 4. Verification against the brief's steps

| # | Step | Result |
|---|---|---|
| 1 | ADR-041 accepted, `0264` closed | ✅ §0 above |
| 2 | `sprint-backlog.md` resolves `Backlog`, regains the `:796` check | ✅ A/B 2 |
| 3 | Residual case still loud (`# Unscheduled work`) | ✅ S8 — identity empty + exit 3, ineligible, `unresolved-plan-sprint` + roll-up clause |
| 4 | Integer ordering proves itself red | ✅ A/B 1 |
| 5 | Ambiguity is loud, other claimant **named** | ✅ S6 asserts the exact `also="sprint-6.md"` record |
| 6 | `Backlog` never eligible | ✅ S5 — `active none`, exit 3 |
| 7 | This repo's boards unchanged | ✅ `select-active ai-agents/sprints` → `sprint-5.md`; `identity backlog.md` → `Backlog`; board renders of **both** `sprint-5.md` and `backlog.md` **byte-identical** to the pre-change run (`diff`, no output) |
| 8 | R7's `backlog.md` fixture + ADR-040 T5 green byte-unchanged | ✅ all 129 pre-existing dashboard tests green; none edited |
| 9 | Full `npm test` green incl. `prove-red.sh` | ✅ below |

### Final measurement

```
npm test  ->  exit 0
ℹ tests 707 · suites 17 · pass 707 · fail 0 · cancelled 0 · skipped 0 · todo 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

695 → **707** (+12 new tests, zero pre-existing tests moved).

### Edge probes beyond the test suite

| Probe | Result |
|---|---|
| `sprints/` with **no** `.md` (no-match glob) | `active none`, exit 3 — no phantom literal candidate |
| a **directory** named `weird.md`, plus `done/sprint-9.md` | both excluded; `Sprint 3` selected — depth-1 + `[ -f ]` both hold |
| `identity` / `select-active` on a missing path | exit 1 with the `die` message |
| one argument literally `identity` | treated as a plan path (board mode), **not** a subcommand |

---

## 5. Decision log — fixes applied without asking (ADR-019 / ADR-032)

**`none`.**

No fix was applied without asking and no obvious-winner call was made. Every design call in this
change was already ruled by the owner at the plan gate (§2 above) and implemented as the approved plan
§4–§5 describes. Nothing fell outside the approved plan, so nothing required a `NEEDS-DECISION`
return either.

---

## 6. Scope discipline — what was deliberately NOT touched

- ⛔ `claude/skills/fkit-status/SKILL.md` — `0266`'s, untouched. This task built the interface; `0266`
  consumes it.
- ⛔ `0271`'s three known-unpinned behaviors (ADR-040's distinct-count refusal, the first-line-only
  rule, the missing `prove-red` mutation) — left exactly as they are.
- ⛔ `0264`'s accepted residual — the `moved_target` token's missing right boundary
  (`➡️ Moved to Sprint 4th` → `Sprint 4t`) — unchanged by owner ruling. T6's corrected comment was not
  restated.
- ⛔ `STATUS_HEADING_RE`, the rung-3 `backlog` basename case, the row-admission class, the open-work
  filter, the roll-up construction, `VERSION_MARKER` — all unchanged.
- ⛔ `test/prove-red.sh` — unchanged (owner ruling §7.2).
- ⛔ No commit, no push, no task-file move. The uncommitted work already in the tree (producer
  re-rank, `0259`/`0264` closes, `0271`'s brief) was not altered or reverted.
- `.claude/` copies are gitignored refreshes of `claude/` and were not refreshed; tests run against
  `claude/` directly.

---

## 7. Residuals and honest limits

- **`select-active`'s collision reporting covers eligible (`Sprint <N>`) identities only.** Two files
  both resolving `Backlog` are not reported. Deliberate and stated in the plan: `Backlog` is never
  eligible, so such a pair cannot mis-select anything. Out of ADR-041's scope, not overlooked.
- **Filenames containing a newline** break the line-based candidate records. Accepted — consistent
  with every other line-based parser in this file.
- **"Highest N" remains a heuristic**, retained with option (d) named as its exit. This task pins the
  ordering; it does not settle whether highest-N is the right selector. That was ruled by the
  architect, not the owner, and is flagged as such in ADR-041's Consequences.
- **S7 pins locale independence by comparing two runs**, not by inspecting the collation. If it ever
  fails, the fix is an explicit byte-order sort of basenames — never relaxing the assertion.

---

# Round 2 — stateful review response (2026-08-11)

Run as the **Process-review worker** of `/fkit-sprint-ship-loop`, under the loop's standing approval
(owner dispositions relayed live from the `fkit lead` session). Ledger: `review.md`, Round 1, 7
defects, none blocking. ⛔ No commit. ⛔ No task-file move.

⚠️ **Codex coverage on this review was PARTIAL** — its sandbox blocked `mkdtemp`, so it executed
nothing. **Every Codex-originated finding (R3, R5, R6) was re-measured here** rather than accepted as
static reasoning. All 7 reproduced exactly as the reviewer described.

## Fixes applied — what, which finding, why it qualified

| Finding | What changed | Why it qualified for unattended application |
|---|---|---|
| **R1** | `test/dashboard-contract.test.js` — S7's fixture renamed to `Qlan-sprint-6.md` / `plan-sprint-6.md` so it genuinely discriminates; **plus** a new portable test asserting `dashboard.sh` contains `^LC_ALL=C$` and `^export LC_ALL$`. | Verified `CORRECT` by direct measurement (pin deleted → 141/141 green). Owner-ruled **"Fix it."** Test-only, localized, inside the approved plan's §4.2 additive-tests boundary. |
| **R2** | `dashboard.sh` — the tie-break comment's newline-safety claim **withdrawn** and replaced with the measured truth (newline *and* TAB). **Docs-only; no code changed**, per ruling. | Verified `CORRECT`. Comment-only, mechanical. |
| **R3** | `worklog.md` §7 residual completed to cover the TAB case and the true newline blast radius. **Docs-only.** | Verified `CORRECT`. Documentation of an already-accepted limit. |
| **R5** | `dashboard.sh` — `[ -r "$1" ] || return 0` added as a precondition on the **whole** `resolve_identity()` ladder, with a comment recording the measured breach. New test `ADR-041 R5`, red-proved. | Verified `CORRECT` and owner-ruled **"Fix R5."** One line plus a test; localized. It closes an ADR-040 **binding-rule** breach (a wrong identity, which ADR-040 ranks strictly worse than none). |

**Not fixed, by ruling:** R4 and R7 → residuals worded for a producer to fold into `0271`
(⛔ not filed here — filing is producer-only, ADR-033). R6 → accepted residual, fails safe.

## Obvious-winner calls made without asking

**`none`.** Every decision this round was either an explicit owner ruling relayed by the driver or a
direct consequence of one.

## One contradiction of the reviewer — reported, not escalated

The reviewer's R1 *rationale* said a fixture-based fix "will be vacuous here" because macOS
`en_US.UTF-8` collation "is byte order". **Measured: false.** bash glob expansion orders
`Qlan-sprint-6.md` / `plan-sprint-6.md` differently under C and `en_US.UTF-8`.

The reviewer **is** right that the filesystem is case-insensitive, so the ADR's own `Plan-`/`plan-`
pair collides and cannot be used — the error is generalising that to all fixtures.

This does **not** change the action (R1 was ruled "Fix it", and the owner's preferred portable
assertion was built regardless), so it is recorded rather than returned as `NEEDS-DECISION`. **Both**
guards ship: the portable source assertion is primary, the behavioral fixture is supplementary and
carries an explicit note that it silently stops discriminating where the `en_US.UTF-8` locale is
absent.

## Verification

```
npm test  ->  exit 0
ℹ tests 709 · suites 17 · pass 709 · fail 0 · cancelled 0 · skipped 0 · todo 0
14. move-target extractor reverted to Sprint-only — "0210/A" should go RED ... red
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

707 → **709** (+2 guards; both red-proved by deleting the thing they protect, then restored).
Live repo re-checked: `select-active ai-agents/sprints` → `sprint-5.md`; `identity backlog.md` →
`Backlog`; `sprint-5.md` board render **byte-identical** to the pre-`0265` run.

## §7 residual — COMPLETED (answers R3, and corrects the R2 overclaim)

Replaces the round-1 bullet that disclosed the newline limit only, and that described the glob loop as
*carrying* such a filename. **It does not.** Measured:

- **Newline** — `sprint-9<LF>x.md` splits one candidate into two records, yielding
  `active file="x.md"` (**a file that does not exist**), a phantom `candidate file="sprint-9"`, and a
  bogus `drift ambiguous-active-sprint … also="sprint-9 x.md"`. The blast radius is a **wrong active
  selection**, not merely a mangled label.
- **TAB** — `_recs` is TAB-separated, so `a<TAB>b.md` parses as
  `candidate file="a" identity="b.md<TAB>Sprint 9"`. That identity is not eligible, so **a valid
  `Sprint 9` plan silently drops out of the running** and a lower-numbered sprint wins.

Both remain **accepted**, consistent with every other line-based parser in this file and requiring a
pathological filename. The change is that they are now **disclosed as limits** here and in
`dashboard.sh`'s own comment, instead of the code claiming a safety it does not have.

---

# Close note — producer, 2026-08-11 (agent-closed, not owner-verified)

Recorded at close so neither item is inferable only from a chat transcript.

## 1. Tooling failure during the round-2 response — self-disclosed, ledger verified intact

A broken heredoc truncated `review.md` at `## Coder response`, destroying the response template
mid-round. The coder disclosed it, verified that the reviewer's **7 finding rows and all four
reviewer sections survived**, and rewrote the response correctly. The ship-loop driver then
**independently confirmed ledger integrity** — three sections present, 7 reviewer rows plus 7 coder
verdicts. **Nothing of the reviewer's was lost.** The ledger is intact but **not untouched**, and it
should not be described as untouched.

## 2. Codex coverage was PARTIAL — second consecutive task

Already recorded at `review.md:10-15` and repeated here because it is a close-level fact: Codex ran
and returned findings, but its read-only sandbox blocked `mkdtemp`, so it executed **nothing** — no
suite, no fixtures, no mutations (*"remain static reasoning only"*). **All execution evidence in this
review is the reviewer's own.** `0264` hit the same blockage, so the model-diverse second opinion is
**reasoning-only across this sprint so far**. The owner was told and routed this close anyway.
