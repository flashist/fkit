# Worklog — 0208

**Task:** add an exit-table row for a Build/Verify/Review spawn that doesn't land, in the sprint loop.
**Role:** `fkit-sprint-ship-loop` Build worker (spawned `@fkit-coder`), under the declared-approval
marker. **Date:** 2026-08-05.

## How the plan was carried to me — both legs clean

Unlike `0203`, **both legs of the carry were faithful.** Pointer verified firsthand this turn before
acting: `git hash-object` → `595790f677e12c34aa9adfe11c87d6c44415c119`, `wc -c -l` → **12,303 bytes /
126 lines** — all three matching the pointer's claim exactly. I read the file with `Bash(/bin/cat …)`,
not the `Read` tool, per the spawn instruction, and implemented from **the file's bytes**.

The paste leg was a **condensed restatement** (section summaries, the "why each clause" bullets folded
into one line, §1's coordinate table flattened) — but the two **verbatim blocks that actually get
written to disk**, Edit 1's row and Edit 2's blockquote, are **byte-identical between paste and file**,
as is Edit 3's from/to pair. Nothing operative diverged, so there was nothing to report under
"the FILE wins". Recorded because the paste being shorter than the file is, on its own, the shape
`0203` flagged — here it did not touch the operative bytes.

## Coordinate re-verification — nothing inherited, and no drift

Plan §6 step 1 warned the file had moved four times in one session and to assume it moved again. It
**had not.** Every anchor in plan §1 re-derived from text this turn via `/usr/bin/grep` and confirmed
**exactly**, pre-edit:

| Anchor | Plan §1 claimed | Measured pre-edit | |
|---|---|---|---|
| whole file | 401 | **401** | holds |
| `## Stop conditions — the driver's exit table (§5.4)` | 335 | **335** | holds |
| nine data rows (header 337, separator 338) | 339–347 | **339–347**, `^\| ` count = 10 (header + 9) | holds |
| `\| **Blocked — hand-off didn't land** \|` | 346 | **346** | holds |
| `**Invariant — no path ends in silence.**` | 349 | **349** | holds |
| `> **The one carve-out: a half-landed close**` | 352–356 | **352–356** | holds |
| `## Progress reporting (§5.5)` | 358 | **358** | holds |
| `## Durable artifacts` | 72 | **72** | holds |

**R5 (`0203`/`0164` adjacency) re-verified at edit time:** `0203`'s +105 lines were already in the
working tree and sit in a different region (`:149`-ish, the honor-the-ADRs block); the exit table was
untouched by it. No collision.

## What changed

**One file — `claude/skills/fkit-sprint-ship-loop/SKILL.md`.** Delta **+12 / −1**, measured as the
difference between `git diff --numstat` for this file **before** my first edit (`105  0`, all `0203`'s)
and **after** (`117  1`). The single deleted line is the producer row, re-emitted with Edit 3's clause
appended; every other change is an insertion.

- **Edit 1 — the new row**, inserted directly above `| **Blocked — hand-off didn't land** |`, now at
  **`:346`**. Verbatim from the approved plan **at Build — then amended in the Verify round for D1/D2/D3
  (see below). This line no longer matches `plan.md`, by owner ruling.**
- **Edit 3 — the producer-row scoping clause**, appended inside the existing hand-off row's trigger
  cell, now at **`:347`**: `left the close partial (§4) — **close-step only; its single re-spawn is not
  a general worker-retry rule**`.
- **Edit 2 — the orphaned-`plan.md` blockquote**, inserted after the half-landed-close carve-out and
  before `## Progress reporting (§5.5)`, now at **`:359-367`**. Verbatim from the approved plan.

File is now **412** lines. `.claude/` was **not** regenerated — `fkit-claude-init.sh` was not run, per
plan §2; a running driver keeps the old text until its next launch.

## Verification — plan §7, all seven

| # | Check | Result |
|---|---|---|
| 1 | Row count 9 → **10**; table still 3 columns | **PASS** — `^\| ` over `:339-348` = **10** data rows (was 9). Every line `:337-348` has **exactly 4 pipes** = 3 columns, new row included |
| 2 | New row's trigger is a non-producer spawn, distinct from the producer row | **PASS** — read-back `:346-347`: `:346` names Plan/Build/Verify/Review/Process-review and says *"**not** the producer spawn, which is the row below"*; `:347` names the producer spawn |
| 3 | Status named in **both** locations, values from the vocabulary | **PASS** — both status branches say "in **both** locations". Values checked against `task-status-vocabulary.md`: `🔲 Backlog` (its `:14`), `🔄 In progress` (`:15`), `🚧 Blocked — <reason>` (`:16`). **Nothing minted** |
| 4 | `plan.md` disposition + resuming-driver rule present in `SKILL.md` alone | **PASS** — read-back `:359-367`; no other file touched |
| 5 | One file | **PASS** — see delta above; `git status --porcelain claude/` shows my edit plus two pre-existing modifications from earlier sprint tasks (`fkit-claude-init.sh`, `scaffold/universal-rules.md`) that I did not touch |
| 6 | Frontmatter guard green | **PASS** — `node --test test/skill-frontmatter.test.js` → **28/28 pass, 0 fail** |
| 7 | Suite green, counts recorded | **PASS** — `npm test` → **567 tests, 567 pass, 0 fail, 0 skipped**; prove-red hard gate **PASSED** (baselines 0a–0i green, all 14 mutations red their named assertion) |

### ⚠️ Checks 6 and 7 are REGRESSION CHECKS ONLY — they do not prove the row landed

Restating the plan's finding rather than letting a green suite imply coverage. **No test reads this
file's body.** `test/skill-frontmatter.test.js`'s `splitFrontmatter()` returns `lines.slice(1, i)` —
everything after the closing `---` is discarded; and `/usr/bin/grep -rln "Stop conditions\|exit
table\|hand-off didn't land" test/` exits 1 with no hits across all 16 test files. A green 567 means
**I broke nothing**, not that the row exists or is correct.

**The only evidence the row landed is the read-back above, plus the reviewer's pass.** Per plan §7, no
text-presence test is proposed.

## Divergences and deferred costs — carried forward, not resolved here

- **R4 — the change is wider than the brief's title.** The title says "a failed Build/Verify/Review
  spawn"; the shipped row covers **five** non-producer spawns (Plan, Build, Verify, Review,
  Process-review). **Owner-ruled at approval (OQ-2).** The literal three would have missed `0167`'s
  only disk-corroborated instance, which was a Process-review worker. Divergence noted here as plan §8
  R4 requires; **the brief's title was not edited.**
- **This knowingly DEFERS `0167` §5 — it does not satisfy it.** `0167` §5 ruled that the row and a
  `## Resume doctrine` section **must ship together** and explicitly **rejected row-alone**. The owner
  ruled A anyway and directed the doctrine half be filed as its own brief by a producer. **That brief
  is not filed** (out of scope for this spawn — no brief filed). Until it ships, **R2 and R3 stay
  open**: R2, the row carries `0167`'s decision *outputs* and its one disambiguating clause, not its
  full operational procedure; R3, `0167` §3's no-self-report rule has nowhere to live in a table cell
  and is **named, not smuggled in**.
- **`0167`'s follow-up 1 was never filed as a brief.** `0208` remains the only backlog task touching
  this hole.

## Verify round — three defects in the APPROVED PLAN's bytes, owner-ruled, applied

⚠️ **The shipped row now diverges from `plan.md`, deliberately and with owner approval.** Verify found
three defects that were **in the plan's own verbatim block** — not in my copy of it; `diff` confirmed
byte-identity at Build. They **survived the plan gate**. The owner ruled on all three via
`AskUserQuestion` in the live driver session, 2026-08-05. **`plan.md` was NOT re-authored** (blob still
`595790f677e12c34aa9adfe11c87d6c44415c119`). **A later reader must not "restore" the plan's text — the
plan is the defective version here.**

| # | Defect (in the approved plan) | Owner ruling, as applied |
|---|---|---|
| **D1** | The trailer *"Either way: report it — do not pause the sprint … next eligible task"* **contradicted branch 3**, which routes to `Owner decision pending` (*"**pause**, relay via `AskUserQuestion`"*). A driver hitting a torn unit could read the trailer and advance **without ever asking the owner** — on the exact branch `0167` says *"no agent may guess"* about. `Either way` was also a two-item word over three branches. | Trailer bound to the non-pausing branches only; **branch 3's pause left unqualified and un-removed** |
| **D2** | The nothing-landed branch dropped `0167` §2's *"Do not decide alone. Report and put the choice to the owner"* — it reset, skipped, reported and moved on, i.e. the driver deciding alone. (`0167` is internally in tension: §4 pairs the reset **with** the escalation.) | **Follow §4's pairing.** Branch 1 now does all three: reset → `🔲 Backlog` in both locations, add to the per-run skip set, **and put the choice to the owner**, because `0167` §10 follow-up 3 leaves *how many re-spawns are allowed* unruled — owner territory |
| **D3** | Branch 3 named **no status**, against `0167` §2 step 3 (*"Whichever branch it takes, write status in both locations"*). Defensible as a pause-not-exit, but silent — indistinguishable from an oversight | State it: **the task stays `🔄 In progress` while the owner is asked — a pause is not an exit, so no terminal status is written** |

### The D1/D2 interaction — worked out from the text, not applied mechanically

Verify flagged that D2 might break D1's scoping: **if branch 1 now escalates, should the trailer bind
branches 1+2, or branch 2 alone?** Resolved from this file's own text, **without** needing a decision:

**Conclusion: the trailer binds branches 1 and 2, as D1 proposed. Escalating is not, by itself, a
pause.** Three textual grounds, all in `§5.4`:

1. **`No Codex, degraded`** (`:348`) — *"proceed-and-flag that task **loudly**; … put its close to the
   owner"*. The table **already** has a row that puts something to the owner **and proceeds**. So
   "asks the owner" and "pauses the sprint" are independent in this table, and branch 1 is the former.
2. **The per-run skip set is a *continue* device.** `§5.4`'s eligible-set rule reads *"minus the
   per-run skip set (attempted / plan-rejected this run, §1)"*, and `Plan rejected` (`:341`) pairs the
   same reset + skip set with *"then move to the next eligible task"*. A branch that paused would
   never consume its own skip-set membership.
3. **The asymmetry is about whether an accurate status exists.** Branch 1 can write one — `🔲 Backlog`
   is exactly true when nothing landed, so the task is **safely parked** and the owner's answer changes
   only whether it is re-attempted. Branch 3 can write **none** — the state is torn — and the invariant
   demands accurate status at every exit, so it cannot exit and must wait. This is also why only
   branch 3 names `Owner decision pending` as its terminal state, and therefore only branch 3 inherits
   that row's `pause`.

Both halves of that reasoning are now **in the row**, so the next reader does not have to re-derive it.

### Verify-round checks

- **Read-back** of the whole row and whole `§5.4`: table at `:337-348`, my row at `:346`. **10 data
  rows** (unchanged — D1/D2/D3 rewrote one line in place, added none). Every table line `:337-348` has
  **exactly 4 pipes = 3 columns**.
- **Status values re-checked** against `task-status-vocabulary.md`: `🔄 In progress` ×2, `🔲 Backlog`
  ×2, `🚧 Blocked` ×1 — all from its `:14-16`. **Nothing minted.**
- **Retry-lexicon sweep** over `:346` for `retry|retries|attempt|N times|twice|backoff|limit|budget|max|up to|at most|once` → **one** hit, the word **`re-attempted`**, inside *"the answer changes only whether the task is re-attempted"*. That is a reference to the **owner's** pending decision, not a policy: **no count, no limit, no backoff, and no `once`** was written. The row explicitly says the question **"is unruled and the driver must not settle it."** The producer row's `once` (`:347`) remains untouched and, via Edit 3, explicitly not generalized.
- **`npm test`** → **567 tests, 567 pass, 0 fail, 0 skipped**; prove-red hard gate **PASSED**.
  ⚠️ **Regression check only** — no test reads this file's body (see above). It proves I broke nothing;
  it does not prove the corrected row is right.
- **`plan.md` blob unchanged**, verified after the edits.

### Delta, and how I separated my hunks from `0203`'s and `0191`'s

`git diff --numstat` on `SKILL.md` → **`117  1`**, *unchanged by this round* (the fix rewrote line 346
in place). `git diff -U0` gives four hunks; ownership by position, cross-checked against content:

| Hunk | Lines | Whose |
|---|---|---|
| `@@ -156,0 +157,92 @@` | +92 | **`0203`** — the faithful-carry construction in the honor-the-ADRs block |
| `@@ -254 +346,2 @@` | −1 / +2 | **mine** — the `Worker spawn didn't land` row + the producer row re-emitted with Edit 3's clause |
| `@@ -265,0 +359,10 @@` | +10 | **mine** — blank line + the 9-line orphaned-`plan.md` blockquote |
| `@@ -284,0 +388,13 @@` | +13 | **`0191`** — the ADR-037 driver-side clause (*"Never instruct into the territory of a rule in the skill a worker will run…"*) |

**My delta = +12 / −1.** Arithmetic closes both ways: 92 + 13 = **105** pre-existing additions, which is
exactly the `105  0` I measured on this file **before my first edit**; 105 + 12 = **117**. File is
**412** lines.

## Decision log (ADR-020)

**Build round — unattended fixes: `none`. Obvious-winner calls: `none`.** Every byte written came from
the approved plan verbatim (Edits 1 and 2) or from its explicit from/to pair (Edit 3). No finding was
answered, no judgment call was made, nothing was widened.

**Verify round — unattended fixes: `none` (all three were owner-ruled, not mine). Obvious-winner call:
one, recorded below.**

- **The D1/D2 interaction — resolved by me, not by the owner.** Verify handed this back explicitly:
  *"Work that out from the text and say what you concluded"*, with `NEEDS-DECISION` available *"if
  applying D2 makes D1's scoping incoherent and you cannot resolve it from the text."* **I did not
  escalate.** Which finding it answers: the D1/D2 interaction note. What changed: the trailer binds
  branches **1 and 2** (D1's original scoping), not branch 2 alone, plus one sentence in the row
  stating why. Why it qualified as an obvious winner **within the approved intent**: the file's own
  text settles it three ways over — `No Codex, degraded` is a standing in-file precedent for
  escalate-and-proceed; the per-run skip set is a continue device that a pausing branch could never
  consume; and only branch 3 names `Owner decision pending`, which is the row the `pause` actually
  comes from. Nothing was minted and no new rule was written — the alternative (branch 2 alone) would
  have contradicted all three. **If that reasoning is wrong, this is the entry to pull:** the load
  lands on ground 1, the `No Codex, degraded` precedent.
- **No retry policy was created in the process** — the escalation says the re-spawn question **"is
  unruled and the driver must not settle it"**, which declines the policy rather than writing one.

**One mechanical note, recorded for auditability rather than as a decision:** Edits 1 and 3 were applied
in a **single** `Edit` tool call, because the plan's Edit 3 modifies the very line that Edit 1 is
inserted above — one call was the only way to keep both anchored to unambiguous text. The resulting
bytes are exactly what the plan specifies for each edit separately; the plan's `Edit 1 → Edit 2 →
Edit 3` ordering was a sequencing instruction, not a content one, and the content is unchanged.

## Out of scope — confirmed untouched

`0203`'s Rules bullet and its faithful-carry construction; `0164`'s Build row; **any retry policy** (no
count, limit or backoff was written — the producer row's *"once"* is untouched and, via Edit 3, now
explicitly **not** generalized); any test. No brief filed, **no commit, no push**, nothing under
`ai-agents/wiki-vault/`. `plan.md` was **not** re-authored.

---

## Process-review round — 2026-08-05

**Role:** spawned `@fkit-coder` running `/fkit-process-stateful-review` as the **Process-review worker**
of `fkit-sprint-ship-loop` (live `fkit lead` driver session), under the loop's declared-approval marker.
**Standing approval:** the owner approved `plan.md` via `AskUserQuestion` on 2026-08-05 and ruled on all
eight findings plus Codex #5 in the same live session; those per-finding dispositions are both the
approval and the scope boundary for this round.

⚠️ **The declared-approval marker was DEGRADED on condition (b), and the driver said so.** The approved
plan was carried as a **pointer + `git hash-object` blob id**, not verbatim, because the driver falsely
certified such a paste on `0203` earlier the same day. I verified the blob myself
(`595790f677e12c34aa9adfe11c87d6c44415c119`, 12303 bytes — matches) and **proceeded on that basis**,
which is a judgement I made and am recording, not one the marker licensed. Reported to the driver.

### Change surface

`claude/skills/fkit-sprint-ship-loop/SKILL.md` — **only**. Six in-place edits, all inside `0208`'s own
already-added block: five on the `Worker spawn didn't land` row (`:346`) and the orphaned-`plan.md`
blockquote (`:359-368`), plus one rewrap of that blockquote to the file's line width.

**Round delta: net 0 lines.** `git diff --numstat` reads **117 / 1** both before and after this round —
every edit rewrote lines that were already counted as additions. File still **412** lines.

⛔ **The shipped row now DIVERGES from `plan.md` §3's row text, by owner ruling.** Three defects survived
the plan gate (R1's false precedent, R3's over-broad claim, R5's incomplete partial-branch) and were
fixed here. `plan.md` is left un-re-authored on purpose — it is the approved bytes. **Nobody may restore
the plan's version of this row.**

### Verification

Row count **10**, every §5.4 table line exactly **3** columns; all status values re-checked against
`conventions/task-status-vocabulary.md` (**nothing minted**); retry-lexicon sweep of this round's
additions **clean**; `0167` §2's three disk states each route to exactly one branch, with `complete` and
`partial` still **disjoint** after R2/R5 widened them; `plan.md` blob unchanged; `npm test` **green
(fail 0)** plus the mutation hard gate. ⚠️ **The suite is a regression check only — no test reads this
file's body**, so the read-back and the reviewer's next pass remain the only evidence the row is correct.

## Decision log (ADR-020) — Process-review round

**Unattended fixes applied under the standing approval: SIX. Obvious-winner calls: ONE.** Each is listed
below with the finding it answers, what changed, and why it qualified.

- **R1 (high) — deleted the `No Codex, degraded` precedent clause.** Answers R1. Changed: the branch-1
  trailer no longer cites that row; it now rests on *"`🔲 Backlog` is an accurate **terminal** status for
  it."* Qualified: verified `CORRECT` against `:344`/`:348`, mechanical, in-plan, and the disposition was
  explicit. ⛔ **This retracts the Build round's obvious-winner entry above.** That entry said *"if that
  reasoning is wrong, this is the entry to pull: the load lands on ground 1, the `No Codex, degraded`
  precedent."* **Ground 1 is now disproven and has been pulled.** The *conclusion* (escalate-and-continue
  on branch 1) survives on the owner's ruling and on grounds 2 and 3, which are untouched.
- **R2 — added `0167` §4's *"and the driver is not continuing this task in this run"* to the Trigger.**
  Answers R2. Qualified: verified `CORRECT` (the all-paths-discharged state genuinely had no branch),
  mechanical, and the disposition said *"Add that condition."* Deliberately phrased as a **negative**
  (when the row does not fire) so no resume procedure is smuggled in ahead of the deferred doctrine half.
- **R3 — narrowed branch 3's justification to *no **terminal** status*.** Answers R3. Behaviour unchanged
  (owner-ruled D3); only the false claim was removed. Qualified: verified `CORRECT`, localized, in-plan.
- **R4 — replaced the orphan note's predicate** with *"a `plan.md` it did not itself approve this run."*
  Answers R4. Qualified: verified `CORRECT` (the old predicate provably could not fire for branch 3),
  mechanical, in-plan.
- **R5 — widened branch 3 to *"a file is half-written, or the unit is torn across paths."*** Answers R5.
  Qualified: verified `CORRECT` against `0167` §2 and §10 constraint (4); disjointness re-checked and
  holds, so the widening is safe.
- **R6 — added `No Codex, degraded` to the orphan note's enumeration.** Answers R6. Qualified: verified
  `CORRECT`; re-derived exhaustiveness over all ten rows before choosing to fix the **enumeration** rather
  than weaken the **quantifier** (the owner allowed either).
- **OBVIOUS-WINNER CALL — R7's one added clause.** The owner ruled R7 *partially correct* and left the
  text change to my judgement (*"judge whether any text change is warranted and say so either way"*).
  **I judged one warranted and made it:** *"§1's skip memory is **this-run only**, so the answer lands on
  a later run."* Why it qualified as an obvious winner **within the plan's intent**: R1's fix already
  deleted the sentence carrying most of the over-promise, so this is the small remainder; the clause is a
  direct quotation of §1`:103` rather than a new rule; and it changes no behaviour. **If this is wrong,
  this is the entry to pull** — the cost of pulling it is that the row asks the owner a question without
  saying when the answer can take effect.

**Judgement calls I did NOT make alone — surfaced instead of settled:**

- **R1's and R3's dispositions contradict each other on the branch-3 half.** R1's wording (*"branch 3's
  [accurate status] does not [exist]"*) is the exact claim R3 rules **false**. I did **not** apply R1
  verbatim; I reconciled both over *terminal* status, which is true on both sides, and **flagged the
  conflict in `review.md`** rather than resolving it silently. Returned to the driver for the owner.
- **`0167` §4 is now stale** on the partial-case status, and nothing recorded it. Recorded as a new
  **accepted residual** in `review.md`. The dated correction note on `0167`'s report is **the producer's
  to file** — flagged, not written by me.

**Not done, deliberately:** `0167`'s follow-up 1 (the resume-doctrine brief) is being filed by a producer
under separate owner ruling — **this worker filed nothing**. R8 took no text change (folded into accepted
residual R2). Codex #5 was independently re-confirmed as disproven and **not chased**.

## Out of scope — confirmed untouched, Process-review round

`0203`'s Rules bullet and faithful-carry construction; `0164`'s Build row; any test; any retry policy.
**No commit, no push**, nothing under `ai-agents/wiki-vault/`, `fkit-claude-init.sh` **not** run
(`.claude/` knowingly stale), `plan.md` **not** re-authored, no brief filed.

---

## Process-review round 2 — 2026-08-05

**Role:** spawned `@fkit-coder` running `/fkit-process-stateful-review` as the **Process-review worker**
of `fkit-sprint-ship-loop`, under the same declared-approval marker and the owner's round-2 dispositions.

**Round 1's 🛑 Blocked lifted** — R1, R2, R3, R4, R6, R7 verified fixed by the reviewer against the
authority rather than my word; the R1/R3 *terminal*-status reconciliation confirmed to match the owner's
ruling. Codex coverage **FULL**.

### ⛔ I shipped a wrong claim in Round 1, and my own fix caused the defect

**R9: my Round 1 assertion *"2 ∩ 3 = ∅"* was FALSE, and the R5 fix is what broke it.** Round 1's branch 3
was whole-state (*"the unit is torn across paths"*); **the per-file clause I added for R5 made branch 3
existential while branch 2 was still existential at a different scope**, so both matched the state
*file A complete + file B half-written* — and a driver reading top-to-bottom would take **branch 2**
(Blocked, continue) where `0167` requires **branch 3** (stop, ask the owner). I re-ran the counter-example
before touching anything; it reproduces exactly. **My Round 1 disjointness test was unsound because I
tested branch 2 at whole-state scope while having just written branch 3 per-file.** Recorded plainly: this
is the second round in which a fix of mine created the next finding.

### Change surface

`claude/skills/fkit-sprint-ship-loop/SKILL.md` — **only**. **One** in-place edit, branch 2 of `:346`.
`git diff --numstat` **117 / 1**, unchanged again → **round-2 delta is net 0 lines**. File still **412**.

- from: `**something landed and stands on its own with the missing paths never arriving**`
- to: `**something landed and everything that landed stands on its own with the missing paths never arriving — nothing is half-written, and nothing on disk depends on a path that is missing**`

Branch 3 **untouched** — its per-file coverage is R5's owner-ruled fix and had to survive.

## Decision log (ADR-020) — round 2

**Unattended fixes applied under the standing approval: ONE (R9). Obvious-winner calls: ONE — a
substitution of directed wording, recorded below because it departs from the literal disposition.**

- **R9 — scoped branch 2 to the whole state.** Answers R9. Qualified: verified `CORRECT` by reproducing
  the counter-example against the file, localized to one branch condition, and explicitly owner-ruled.
- **⚠️ OBVIOUS-WINNER / DEPARTURE — the owner's directed clause alone does NOT fix it, so I used the
  sanctioned fallback.** The ruling said to use `0167` §2's R11 wording (*"nothing on disk depends on a
  path that is missing"*) *"**or** wording that provably carries the same whole-state test."* **I tested
  the directed clause first and it fails:** file B is half-written, i.e. a path that *was* written
  incompletely — **not a path that is missing** — and file A depends on nothing, so the clause reads TRUE
  and branch 2 still matches. It fails alone because in §2 it is one of **two** conjuncts on the
  `complete` row, sitting beside *"nothing is half-written"*; lifting one drops the other. **I therefore
  carried both conjuncts and changed the quantifier existential → universal.** Why it qualified: the
  fallback is expressly authorized by the ruling, and the substituted wording is `0167` §2's own text, so
  nothing was minted. **If this is wrong, this is the entry to pull** — the load lands on the claim that
  a half-written path is not a "missing" path.

**Tested, not asserted — the failure mode of Round 1.** *A complete + B half-written* now matches branch 2
**NO** (*"nothing is half-written"* false; *"everything that landed stands on its own"* false) and branch 3
**YES** → **routes to branch 3 alone**, which is what `0167`'s whole-state test requires. Branches 2 and 3
are now exact complements given something landed, so they are disjoint **by construction**, not by
inspection. All three of `0167` §2's disk states route to exactly one branch.

**Fixes deliberately NOT made (owner-ruled accept):** **R10** (*"both `Blocked` rows above"* is
under-specified — cosmetic; both reviewers parsed it correctly, and a cosmetic edit at closeout is exactly
how the fix-creates-the-next-finding pattern continues) and **R11** (`Owner decision pending` literally
covering branch 1 — resolves under ordinary specificity, and amending that row exceeds `0208`'s scope).
Both recorded as residuals with re-raise conditions.

### Verification — round 2

10 data rows; every §5.4 table line exactly 3 columns; status vocabulary re-checked, **nothing minted**
(R9's fix adds no status); retry sweep of round-2 text **clean** — no count, limit, backoff, or number of
any kind; `plan.md` blob unchanged `595790f677e12c34aa9adfe11c87d6c44415c119`; **`npm test` green — 567
tests, 567 pass, fail 0**, plus the mutation hard gate. ⚠️ **Regression check only — no test reads this
file's body**, so the suite is evidence of no regression elsewhere, **not** that R9's fix is correct; the
tested counter-example is that evidence.

### Recorded

- **`0228` filed** (*"Write the `## Resume doctrine` section into the sprint loop"*, Backlog) — verified
  on disk. Accepted residuals R2/R3 now point at a live task, not a closed report.
- **`0167` §4's dated correction note landed** — verified at `:588` / `:631+`, append-only. **The residual
  I filed in round 1 is discharged by its own stated condition.**
- ⚠️ **The owner accepted my proceeding past the failed carry condition (b) as a SECOND one-time
  acceptance. The standing rule is UNCHANGED — this is not a relaxation and must not be cited as
  precedent.** The owner noted that **a third would be evidence the rule does not survive contact with the
  driver.** Recorded in that form deliberately: the next occurrence is a signal about the rule itself.

**Ledger header set to `closed-out`** under the reviewer's convergence call.

## Out of scope — confirmed untouched, round 2

`0203`'s construction; `0164`'s Build row; any test; any retry policy; branch 3's condition. **No commit,
no push**, no brief filed, nothing under `ai-agents/wiki-vault/`, `fkit-claude-init.sh` **not** run
(`.claude/` knowingly stale), `plan.md` **not** re-authored.
