# Worklog — task `0271`: pin the five unpinned behaviors in the sprint-identity grammar

**Baseline:** HEAD `9943dcf13633e576761f7b76dd4a4b30c754de00`.
**Approved plan:** `plan.md`, blob `732e0ead28384b4c08947273b286339e9bc06fa5` (verified by `git hash-object`
against the bytes pasted by the driver — they match). Owner rulings **U1/U2/U3** at its end bind this build.

**Not my baseline.** The working tree I inherited already carried Sprint 8's creation, the `0383`/`0384`
briefs, `0358`'s ledger closeout, two `ai-agents/wiki-vault/` writes, and `🔄 In progress` flips on
`0337`/`0271`. ⚠️ **Re-measured, the inherited tree is BROADER than that list** — it also carries
`adr-047` (new), edits to `adr-041`, and edits to the `0290`/`0337`/`0338`/`0339`/`0340`/`0341`/`0381`
briefs. ⛔ **None of it is mine.** My change surface is exactly three files:

| File | Change |
|---|---|
| `test/dashboard-contract.test.js` | +140 lines — five new guards |
| `test/prove-red.sh` | +52 lines — `# --- Mutation 32` |
| this `worklog.md` | new |

⛔ `claude/skills/fkit-status/dashboard.sh` **ends byte-identical** — `git diff` on it empty. This task
ships tests only (brief verification step 2).

---

## 1. What landed

Five guards, named so a mutation can grep them (`0271/1`, `0271/2`, `0271/4`, `0271/5a`, `0271/5b`):

| Item | Test | Pins |
|---|---|---|
| 1 | `ADR-040 0271/1: an H1 naming the SAME sprint twice resolves — the count is DISTINCT, not total` | the `seen` de-dup, `dashboard.sh:100` |
| 2 | `ADR-040 0271/2: the H1 is read from LINE 1 ONLY — a token on line 2 does not resolve` | `head -1 "$1"`, `dashboard.sh:85` |
| 3 | `test/prove-red.sh` `# --- Mutation 32` | makes item 1's red-proof mechanical |
| 4 | `ADR-041 0271/4: an empty sprints/ lists NO candidate — the glob no-match guard` | `[ -f "$_f" ] \|\| continue`, `dashboard.sh:242` |
| 5a | `ADR-041 0271/5a: a plan under sprints/done/ is never a candidate` | the depth-1 glob, `dashboard.sh:241` |
| 5b | `ADR-041 0271/5b: a plan file named identity.md still renders as a board, not a mode word` | the two-argument dispatch, `dashboard.sh:304` |

## 2. Assertion idiom — owner ruling U1, and the cost it accepts

All five assert **field-tolerantly**: prefix or regex on the fields under test
(`/^candidate file="sprint-9\.md"/`, `/^active none\b/`), **never** whole-line stdout equality.
⛔ The existing `S1`–`S8` exact-equality idiom was **deliberately not copied**.

**Why:** `0338` extends `select-active`'s output grammar on purpose — `candidate` lines gain a `status=`
field, `active` gains a separate `chosen file=` line. An exact-equality guard would red `0338` for doing
its job.

⚠️ **Accepted cost, named by the owner in the ruling:** a stray **extra** field on a line these tests read
would not be caught. That is a real hole, not a technicality; it is recorded here rather than
glossed.

## 3. Correction — item 5a's mechanism (owner ruling U3)

The brief's verification step says *"temporarily neutralize the `sprints/done/` exclusion"*.
⛔ **There is no exclusion code to neutralize.** The exclusion is **emergent from the depth-1 glob** at
`dashboard.sh:241` (`"$1"/*.md`), whose own inline comment says exactly that; `0338`'s brief says the
same of `cancelled/` (*"likewise never seen by construction"*).

**The behavior is real and probe-confirmed — only the brief's account of the mechanism is wrong.**
Per U3 the red-proof widens that glob to `"$1"/*/*.md`, which is faithful to what really implements it.
⛔ 5a was not re-scoped and not returned to the producer.

## 4. Correction — the brief's item-4 `head:` claim is STALE

The brief says dropping the `[ -f ]` guard yields a phantom candidate *"plus a `head:` stderr line"*.
**The `head:` half can no longer happen.** `0265`'s R5 fix put `[ -r "$1" ] || return 0` at
`dashboard.sh:141`, which returns **before** `head` runs. Measured under the mutation: the phantom
candidate appears (`candidate file="*.md" identity="unresolved"`) and no `head:` line does.
The phantom-candidate half stands, and it is what `0271/4` pins.

## 5. ⚠️ Correction — the brief's "dropping `seen` leaves the whole suite green" is DATED

The brief and `plan.md` both carry `0264`'s measurement: dropping the `seen` de-dup left the suite green
at **129/129**. **Re-measured on today's suite, that is no longer true.** Dropping `seen` reds **two**
tests:

- my new `ADR-040 0271/1` (the ADR-040 §2.5 numbered-token case, `# Sprint 5 — Sprint 5`) — genuinely
  unpinned before this task; and
- the **pre-existing** `ADR-041 §2: both Backlog and Sprint Backlog resolve to the value Backlog`,
  landed by `0265`, whose `'b.md': prosePlan('# Backlog — Sprint Backlog')` fixture exercises the same
  de-dup through the **normalize-before-dedupe** path.

So the de-dup was **partially** pinned already, via the `Backlog` normalization path, and had been since
`0265`. **The numbered-token case that ADR-040 §2.5 actually specifies was still unpinned**, which is
what item 1 closes. The item was worth doing; the "whole suite green" framing was not re-measured when
`0265` landed. `# --- Mutation 32`'s header comment records this so the next reader is not surprised by
the second red.

## 6. Red-proofs — measured, not predicted

Each mutation applied to `claude/skills/fkit-status/dashboard.sh` one at a time, suite run, file restored
from a byte backup. **`git diff` on `dashboard.sh` empty afterwards.**

| # | Mutation | Suite | Assertion that redded (by its message) |
|---|---|---|---|
| 1 | `:100` drop `!(s in seen)` / `seen[s]=1` | 146/148, 2 fail | `0271/1` — *"one identity named twice must RESOLVE at rung 1, not refuse"* (expected 0 `unresolved-plan-sprint`, got 1) |
| 2 | `:85` `head -1 "$1"` → `cat "$1"` | 147/148, 1 fail | `0271/2` — *"a token on line 2 must not resolve the plan's identity"* (drift facts `[]`) |
| 4 | `:242` delete `[ -f "$_f" ] \|\| continue` | 147/148, 1 fail | `0271/4` — *"no plan at depth 1 means no candidate"* (got `candidate file="*.md" identity="unresolved"`) |
| 5a | `:241` `"$1"/*.md` → `"$1"/*/*.md` | 138/148, 10 fail | `0271/5a` — *"a closed sprint plan must never reach candidacy"* (got `candidate file="sprint-9.md" identity="Sprint 9"`) |
| 5b | `:304` `[ $# -eq 2 ]` → `[ $# -ge 1 ]` | 14/148, 134 fail | `0271/5b` — *"one argument is a board render, never a usage error"* (exit 1, expected 0) |

**Collateral, stated rather than hidden:**

- Mutation 1 also reds the pre-existing `ADR-041 §2` test — see §5. A second red, not a wrong one.
- Mutation 5a reds **10** tests. Widening the glob to depth 2 removes depth 1 entirely, so every
  `sprintsFixture` plan disappears from candidacy: `S1`, `S1b`, `S2`, `S3`, `S5`, `S6`, `S7`, `S8`, `R5`
  go with it. It is a **broad** mutation, and it is the one the owner ruled for (U3). `0271/5a` reds at
  its own named assertion, which is what the proof needs.
- Mutation 5b reds **134** tests — it breaks every one-argument board render in the file. Also broad,
  also the mutation the plan named. `0271/5b` reds at its own first assertion.

**Supplemental narrow red-proofs — round-1 review R3/R4, owner ruling "Append to the worklog".**

The ruled mutations above **stand** (U3 is not reopened, and nothing ships from a red-proof). These are
**record improvements**: each is a *narrower* mutation that reds its guard **alone**, which converts
"5a/5b are load-bearing" from a claim resting on a broad mutation into a **measured, discriminating**
one. Both were re-measured **by this round**, not carried from the ledger.

| # | Narrow mutation | Suite | What it adds over the ruled mutation |
|---|---|---|---|
| 5a | `:241` `for _f in "$1"/*.md` → `for _f in "$1"/*.md "$1"/*/*.md` (**add** depth 2, keep depth 1) | **147/148, 1 fail** | Reds `0271/5a` **alone**, vs the ruled mutation's 138/10. Depth 1 survives, so `S1`–`S8`/`R5` stay green and the *exclusion* is the only thing tested. |
| 5b | `:304` `[ $# -eq 2 ]` → `[ $# -eq 2 ] \|\| [ "$(basename "$1" .md)" = identity ]` | **147/148, 1 fail** | Reds `0271/5b` **alone**, vs the ruled mutation's 14/134. ⚠️ **This is the one that matters for the record:** under the ruled `[ $# -ge 1 ]`, *every* one-argument render dies regardless of filename, so it proved "one argument is a board" — which 133 other tests already pin — **not** "a plan named `identity.md` is not the mode word". The guard's unique coverage was always real; it simply had not been shown. |

⛔ **No re-run of the ruled mutations was needed to record these, but both ruled mutations WERE re-run
this round anyway** and are unchanged: 5a still **138/10**, still red at `0271/5a`'s named assertion.

⛔ **No guard redded against landed code.** The brief's absolute constraint never fired, and
`dashboard.sh` was never adjusted to suit a test.

### 6a. Item 5a's positive control and fixture check — round-1 review R1

R1 found `0271/5a` **vacuous with respect to its own fixture**: `select-active`'s stdout is
byte-identical whether or not `done/sprint-9.md` exists, so deleting the `writeFileSync` left the test
green and it collapsed into a duplicate of `0271/4`. **Re-measured this round, before any fix: deleting
that write left the suite at 148/148 GREEN.** The finding is correct.

| Probe | Before the fix | After the fix |
|---|---|---|
| Delete the `done/sprint-9.md` fixture write | **148/148 green** — the defect | **147/148, 1 fail** — `0271/5a` alone |
| Delete the new `control-depth-1.md` write | *(n/a — did not exist)* | **147/148, 1 fail** — `0271/5a` alone |
| The **ruled** 5a mutation (U3), re-run | 138/10, red at `0271/5a` | **138/10, red at `0271/5a`** — unchanged |

Two additions, and the split between them is the point:

- **The depth-1 control** (`control-depth-1.md`, owner ruling "Add a depth-1 sibling") is asserted
  **present** in the candidate list. It proves the glob, the fixture directory and the candidate printer
  are live, so `sprint-9.md`'s absence reads as *excluded* rather than *nothing ran*.
- **The `existsSync` fixture precondition** is what actually reds on the write being deleted. ⚠️ **The
  control alone could not do that, and no assertion on stdout can** — `done/` exclusion is invisible to
  stdout **by construction**, which is the very behaviour under test. That is a property of the
  behaviour, not a gap in the assertions, and the measurement above is what establishes it.

⚠️ **The control is on the CANDIDATE line, never the ACTIVE line** — the reviewer's caveat, honoured.
`mode_select_active` prints candidates for every record regardless of eligibility (`dashboard.sh:277`),
so an ineligible control is still a positive control. A control named `sprint-9.md` at depth 1 would
resolve via the filename rung, become **eligible**, and turn `active none` into `active file="sprint-9.md"`.
`/^active none\b/` is kept. Under `0338` a statusless `prosePlan` is ineligible for a *different* reason,
so the control stays ineligible in both worlds. Per **U1** it matches the `file="…"` field by prefix —
never whole-line equality — so `0338`'s added `status=` field cannot red it.

**⛔ Do not red-prove item 4 by removing the `set +f` wrapper.** That half is already pinned (7 tests)
and reds for the wrong reason — the brief's explicit instruction, honoured.

## 7. Prove-red — one new mutation, per owner ruling U2

**Exactly one** added: `# --- Mutation 32`, targeting item 1's `seen` de-dup, checked with
`grep -Eq '(✖|not ok|fail).*0271/1'`. ⛔ Item 2's `head -1` mutation was **not** added — the brief scoped
one and says a sixth is a new brief and a new owner ruling.

It clones **mutation 14's landed seam exactly**: `make_repo_copy` → `awk`-swap of one line whose
replacement is read **from a heredoc file via `getline`** → `cmp -s` no-op guard → `run_dashboard_suite`.
⛔ **Not `awk -v`** — mutation 14's own comment explains why (awk processes escapes in a `-v` assignment,
the replacement arrives mangled, the script breaks outright, and every test reds while the
named-assertion check still passes: red for the wrong reason disguised as success).

⚠️ **The test-name token is the mutation's only handle.** If a future rename drops `0271/1` from the test
title, Mutation 32 disarms. The `cmp -s` no-op guard catches the *other* half (a reworded `!(s in seen)`
line) and says so loudly; the rename half is unguarded, exactly as it is for mutation 14.

## 8. Measured counts — re-measured on the final bytes, never carried

| Gate | Measured |
|---|---|
| `test/dashboard-contract.test.js` before | **143 pass / 0 fail** |
| `test/dashboard-contract.test.js` after | **148 pass / 0 fail** (+5) |
| `test/prove-red.sh` mutations before | **31** |
| `test/prove-red.sh` mutations after | **32** (+1) |

⚠️ **The plan predicted `143 → 149`. Measured is `148`.** 143 + 5 guards = 148; the plan's 149 was an
arithmetic slip. **The measured number is the number.**

Full-suite and hard-gate results are recorded in §10.

## 9. The awk-dialect coverage limit — stated, not closed

⚠️ **`gawk` / `mawk` / `busybox awk` are UNVERIFIED.** Only **BSD one-true-awk 20200816** was exercised,
here and in `0264`. Every construct used is POSIX, BSD is the stricter dialect, and `dashboard.sh`'s
forced `LC_ALL=C` makes the em/en-dash literals byte-matches — **so it is believed portable, but it was
not measured.** Carried as **context, not scope** (`0264` residual A3); ⛔ installing another awk was not
scoped into this task, and the limit is **not** silently dropped.

Mutation 32's own swap runs through the same awk, so it inherits the same unverified-dialect limit.

## 10. Gate results — measured on the final bytes

| Gate | Result |
|---|---|
| `npm test` | **877 pass / 0 fail** (877 tests, 0 skipped, 0 todo). Driver's last baseline was 872; +5 = 877. |
| `test/prove-red.sh` | **`✓ hard gate PASSED`** — real + unmutated copy green; **32** mutations, each red at its NAMED assertion. `32. DISTINCT-token de-dup dropped — "0271/1" should go RED ... red` |
| `git diff claude/skills/fkit-status/dashboard.sh` | **empty** — byte-identical, brief verification step 2 satisfied |
| `git diff --stat -- claude/` | **empty** — nothing under `claude/` was touched at all |

⚠️ **Timing note, so a re-runner is not surprised:** `test/prove-red.sh` runs 32 mutations, each a full
suite in a repo copy. It exceeded a 600s foreground budget on this machine and was completed in the
background. That is duration, not failure.

### 10a. Gates RE-MEASURED after the round-1 review fixes — on the final bytes, not carried

⚠️ **The round-1 reviewer did NOT verify the full prove-red hard gate** — it was still running when the
reviewer reported, and it verified Mutation 32 **in isolation** instead. **This round ran the whole gate
to completion.** Its real result:

| Gate | Result, re-measured this round |
|---|---|
| `test/dashboard-contract.test.js` | **148 pass / 0 fail** — unchanged. R1 added assertions to an existing test, not a new test, so the count does **not** move. |
| `npm test` | **877 pass / 0 fail**, 0 skipped, 0 todo, exit 0 — unchanged, for the same reason. |
| `test/prove-red.sh` — **the full hard gate, run to completion** | **`✓ hard gate PASSED`**, exit 0. **32 of 32** mutations red at their **NAMED** assertion; **14** unmutated baselines green (`0a`–`0n`). `32. DISTINCT-token de-dup dropped — "0271/1" should go RED ... red`. ⛔ **No `✗` line anywhere in the run.** |
| `test/coordination-citation-policy.test.js` | **21 pass / 0 fail** — re-run **after** the `review.md` and `worklog.md` edits of this round, because those edits landed after `npm test` had already started. |
| `test/reference-integrity.test.js` | **20 pass / 0 fail** — same reason, same re-run. |
| `git hash-object claude/skills/fkit-status/dashboard.sh` | **`7ca95612d2f082c19ae75b3dc48cb31113f7f07e`** — the reviewer's cited blob, re-verified **before and after** the gate. |
| `git diff --stat -- claude/` · `-- .claude/` | **both empty** — nothing under either was touched. |

⚠️ **Baseline honesty.** The working tree at this round's start was **already** dirty with work that is
**not this task's**: Sprint 8's creation, `0383`/`0384`, `0358`'s closeout, two `wiki-vault/` writes, the
new ADR-047, ADR-041's append, `ai-agents/sprints/backlog.md`, and edits to several briefs — **including
this task's own `brief.md`**, which was modified before this round began and was ⛔ **not touched by it**.
This round's change surface is exactly **four files**: `test/dashboard-contract.test.js`,
`test/prove-red.sh`, this `worklog.md`, and this task's `review.md`.

## 11. Flagged, NOT fixed — outside this task's diff fence

- **TWO live copies of the stale sentence "All 28 prove-red mutations" — not one.** Round-1 review R5
  corrected this flag, which under-counted the instances; the follow-up brief must be scoped to **both**
  or it will fix half the drift and close:
  - `test/coordination-citation-policy.test.js:159` — *"identical artifact class. All 28 prove-red
    mutations target an executable artifact reachable"*
  - `test/reference-integrity.test.js:142` — *"All 28 prove-red mutations target an executable artifact
    reachable through an environment seam"*

  There are **32** after this task (**31** before it). Pre-existing staleness in both, ⛔ **both outside
  the fence** (`test/dashboard-contract.test.js` + `test/prove-red.sh` only). ⛔ **Neither touched.**
  Verified this round by an exhaustive `grep` over `test/`, `claude/`, `bin/` and `ai-agents/`: those two
  are the only **live** copies. ⚠️ A third occurrence sits in `ai-agents/tasks/done/0176-build-the-coordination-citation-policy-guard/plan.md`,
  quoting the same sentence — that is a **closed task's frozen record of what it wrote at the time**, and
  the follow-up brief should ⛔ **leave it alone** rather than "correct" history.
- **The task folder name says "three"; the brief's H1 says "five".** The brief flags this itself and
  says ⛔ *"Do not rename it as a side effect of this task."* **Not renamed.** A folder rename is a
  task-file move, which only the mover skills may perform, and since ADR-033 the coder holds none.

## 12. Out of scope, confirmed untouched

⛔ `STATUS_HEADING_RE`; ⛔ the `backlog` basename special case; ⛔ `0264` residual A1 (`moved_target`
right-bound); ⛔ `0265` residuals A3 (leading-dash noise) and A4 (newline/TAB in a basename);
⛔ no new devDependency (ADR-014); ⛔ no `ai-agents/wiki-vault/` write (ADR-005); ⛔ no commit, no push,
no folder moved, no board row flipped, no `.claude/` edit, no `ai-agents/sprints/` edit.

## 13. Decision log — actions taken under standing approval

Per ADR-019's audit obligation, carried to the sprint-ship-loop Build-worker path by ADR-032.

**Fixes applied without asking: `none`. Obvious-winner calls made: `none`.**
Every step executed is verbatim the approved `plan.md` steps 1–8 as narrowed by U1/U2/U3. The three
corrections in §3, §4 and §5 are **recorded findings**, not scope changes — none of them altered a file
outside the fence and none altered `dashboard.sh`.

### 13a. Round-1 review — Process-review worker, standing approval (ADR-032 Decision 3 + ADR-019)

Four changes applied **without a per-fix owner gate**, under the sprint-ship-loop's standing approval.
Each is listed with **the finding it answers, what changed, and why it qualified** — so a wrong fix is
findable afterwards.

| # | Finding answered | What changed | Why it qualified |
|---|---|---|---|
| 1 | **R2** | `test/prove-red.sh` — added index line `32.`; header count word `TWENTY-EIGHT` → `THIRTY-TWO` | Verified `CORRECT` against the bytes (**32** mutation blocks vs **31** index entries). Mechanical, two comment lines, **inside the fence** and inside the owner's ruling *"Fix both here"*. |
| 2 | **R3 / R4** | `worklog.md` §6 — two supplemental narrow red-proofs appended to the red-proof table | Verified `CORRECT` by **independent re-measurement** (below). Record-only, no code, **inside the fence**, and inside the owner's ruling *"Append to the worklog"*. |
| 3 | **R5** | `worklog.md` §11 — follow-up note rewritten to name **both** stale copies | Verified `CORRECT` by exhaustive `grep`. Record-only; the two stale files themselves ⛔ **not touched**. |
| 4 | **R1** | `test/dashboard-contract.test.js` — depth-1 positive control + `existsSync` fixture precondition + `existsSync` added to the `node:fs` import | Verified `CORRECT` by re-measuring the defect first (148/148 green with the fixture write deleted). Localized to one test, **inside the fence**, inside the owner's ruling *"Add a depth-1 sibling"*. |

**⚠️ One judgment call inside fix 4, named rather than buried — the `existsSync` precondition goes
BEYOND the literal ruling.** The owner's ruling was *"Add a depth-1 sibling"*. A sibling control alone
**cannot** satisfy the driver's stated acceptance criterion (*"deleting the `sprint-9.md` fixture write
now REDS the test"*), and **no assertion on stdout can** — `done/` exclusion is invisible to stdout **by
construction**, which is measured in §6a and is the very behaviour under test. The precondition is the
only construct that meets the criterion. It was applied, not escalated, because the driver's mandate
states that criterion as a requirement of this round, it is two lines inside the fence, it changes no
behaviour, and it is the idiom this file already uses (`adr040Drift()` proves its fixture resolved
before an absence assertion). ⚠️ **Flagged for the owner as a departure from the ruling's literal
text**, not presented as covered by it.

**⛔ Independent re-measurement, not carried figures.** The driver stated the R3/R4 numbers were already
in the ledger and no re-run was needed. Both were re-run anyway — the reviewer is fallible and so is a
relay. **All four figures held exactly**: R4 narrow 5a **147/1**; R3 narrow 5b **147/1**; ruled 5a
**138/10**; and the R1 pre-fix probe **148/148 green**. Nothing in the ledger was refuted this round.

### 13b. Round-2 closeout — Process-review worker, standing approval (ADR-032 Decision 3 + ADR-019)

Owner ruling of 2026-09-10, `AskUserQuestion`, option label **"Close out and close the row (Rec)"**,
relayed by the driver with the reviewer's recommendation (a) — *fix the digit* — folded in.

| # | Finding answered | What changed | Why it qualified |
|---|---|---|---|
| 1 | **R6** | § `10a.` gate table, row *"the full hard gate, run to completion"* — baseline count **13 → 14** | Verified `CORRECT` by my **own** count of the script's baseline steps (**14**: `0a`…`0n`, no gap, no duplicate), not by carrying the relay. One character, record-only, **inside the fence**, and named explicitly in the owner's ruling. |
| 2 | — | `review.md` — `Status: in-review` → `closed-out`, plus an R6 row and a round-2 closeout section in the *Coder response* | The disposition the reviewer declined to make for itself; supplied by the owner's ruling. ⛔ The *Reviewer findings* section was **not** edited. |

**Obvious-winner calls made: `none`.** Both actions are verbatim the owner's ruling as relayed.

**⚠️ What was NOT re-measured, stated rather than glossed.** The full `test/prove-red.sh` hard gate was
⛔ **not re-run** — 4+ hours for a records-only change, and the driver's mandate forbade it. `✓ hard gate
PASSED`, exit 0, **32/32** red at their named assertion, no `✗`, and the **greenness** of all 14
baselines are **round 2's figures, carried**. Only the **count** is mine.

**⛔ Not done, deliberately:** no fix to either stale `28 prove-red` copy (outside the fence); no
`NAMED_EXEMPT` addition (the pin stays **7**); no second prove-red mutation (U2); no folder rename; no
edit to `dashboard.sh`, `claude/`, `.claude/`, `ai-agents/sprints/` or `ai-agents/knowledge-base/`; no
commit, no push, no mover, no board row flipped, no vault write.
