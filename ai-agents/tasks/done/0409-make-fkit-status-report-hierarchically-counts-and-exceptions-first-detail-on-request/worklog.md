# Worklog — `0409` Make `/fkit-status` report hierarchically

**Built 2026-09-20** by a spawned `fkit-coder` acting as the **Build worker** of the lead's
`/fkit-sprint-ship-loop`, under ADR-032's declared-approval carve-out. All three signals were present
in the spawn prompt: caller named as `fkit-sprint-ship-loop`, the approved plan carried verbatim, and
the owner's approval relayed from a live `AskUserQuestion` in the driver session.

⚠️ **The approval is trusted prose, not proof.** A spawn cannot verify the owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
That is the cost the owner accepted for this path, stated rather than papered over.

## Plan provenance — verified, not assumed

`plan.md` was pinned by the spawn at blob `a91e913c5c8905ed5dcffa77b9f39c0258ca1eb8`, 18,258 bytes.
Verified with `git hash-object` and `wc -c` **before any file was touched** — both matched, and the
prompt's verbatim paste matched the file on read. Built from the file.

⛔ **`plan.md` was deliberately left UNEDITED.** Its bytes are the approved artifact and its hash is
the pin; editing it would spend the pin and break any later verification. Everything recorded during
the build lives in this worklog and in `scoring-table.md` instead.

## Two plan bullets that were already superseded when the build started

1. **`prove-red.sh` "not run to completion in this spawn"** (§Bullet summary) — **superseded
   2026-09-20**, per the plan's own post-approval addendum item 1: a later measurement ran it to
   completion, exit 0, 15 baseline checks green, **39 mutations**. `node --test test/*.test.js` →
   **967 pass, exit 0**. Both baselines were therefore clean before this build, so every red seen
   during it is this change's own signal.
2. **Addendum item 5 — "built by the owner in a `fkit coder` session"** — stale, and flagged as such
   by the driver at spawn time. The owner subsequently ruled the sprint loop drives it. This build is
   that, under the ADR-032 carve-out. Nothing else in the addendum changed.

## Sequencing — §8, followed in order

| Step | Done | Note |
|---|---|---|
| 1. Capture "before" | ✔ | `captures/before-backlog.txt`, `captures/before-sprint-11.txt`; stderr empty on both, exit 0 on both |
| 2. Scoring table | ✔ | `scoring-table.md`, re-derived from the captures rather than copied from the plan |
| 3. Tests 1–7 first, watch them go red | ✔ (partly — see below) | **4 of 7 went red**, which is the correct result |
| 4. Implement `title_cell()` + call site | ✔ | `claude/skills/fkit-status/dashboard.sh` |
| 5. Extend R10 + two doc blocks | ✔ | R10, `dashboard.sh`'s `CONTRACT:` block, `fkit-status/SKILL.md` |
| 6. Capture "after" | ✔ | `captures/after-*.txt` |
| 7. Full suite + `prove-red.sh` to completion | ✔ | exit codes captured directly, never through a pipe |
| 8. `select-active` unchanged + surface check | ✔ | `select-active` output **byte-identical** before and after |

## ⚠️ Deviation from §8 step 3, stated plainly: only 4 of the 7 new tests could go red

Red before the change, green after — these four are the behaviour tests:

- `0409/elided`
- `0409/drift-survives`
- `0409/vocabulary`
- `0409/escaped-pipe`

**Green both before and after** — and that is their purpose, not a failure to write them properly:

- `0409/no-annotation` — asserts a cell **is unchanged**. A test of "nothing happens" cannot red
  against a renderer that does nothing.
- `0409/facts-identical` — the drift-safety proof. `⟦FACTS⟧` was already unaffected by Task-cell
  content; the test exists to keep it that way, so pre-change green is exactly right.
- `0409/opener-at-start` — the empty-cell guard. ⚠️ **Green before for the WRONG reason** (the old
  passthrough returned the raw cell by accident) and green after for the right one (the guard). It is
  therefore **not pinned by mutation 40**, which makes `title_cell` a passthrough and so keeps this
  test green. Named here rather than left for a reviewer to find.

## The structural guarantee (§5) — HELD, re-verified on the post-change file

`$task` / `${task}` now matches **exactly one executable line** in all 1,737 lines of `dashboard.sh`:

```
task_cell=$(title_cell "$task")
```

The only other match is the comment directly above it. No drift check, counter or fact emitter reads
it. The board row now interpolates `${task_cell}`, mirroring the existing `st`/`st_cell` split.

**Proved empirically too, twice over:**

- `0409/facts-identical` renders the same fixture plan with and without annotations and requires a
  byte-identical `⟦FACTS⟧`. It **passes by execution**, not by assertion of intent.
- On the **live corpus**, `diff` of the `⟦FACTS⟧` section before vs after is **empty on both boards**
  (exit 0), and both roll-ups are character-identical, drift clause included.

## What changed, measured — counting rules in `scoring-table.md`

| | Before | After | Change |
|---|---|---|---|
| Backlog render | 458,446 bytes, 246 lines | **74,980 bytes**, 246 lines | **−83.6%** |
| Backlog Task cells, total | 395,533 bytes | **12,067** | **−96.9%** |
| Task cell mean / median / max | 3,410 / 2,583 / 15,375 | **104 / 96 / 672** | — |
| Rows emitting a **malformed** 7-cell markdown row | 2 of 116 | **0** | see below |
| Cells over 200 bytes | 112 of 116 | **2 of 116** | the residual Q1 ruled ship-as-is |
| Sprint 11 render | 10,541 bytes | **1,812 bytes** | **−82.8%** |
| `⟦FACTS⟧`, both boards | — | **byte-identical** | — |
| Roll-up, both boards | — | **identical** | — |
| `select-active` | — | **byte-identical** | — |

**Line count did not change** (246 → 246): one row per task, before and after. The rows got shorter,
none were added or lost.

**The two residual cells are the ones the plan predicted** (672 and 262 bytes, against its predicted
668 and 258 — the small delta is the counting-rule difference recorded in `scoring-table.md`). Both
use an em-dash continuation rather than a `*(` parenthetical, so the cut point does not catch them.
**Q1 ruled: ship as-is.**

## ⭐ A pre-existing live defect this change happens to stop rendering — NOT something it fixed

Counting pipe-delimited fields per rendered row on the live Backlog board:

- **Before: 2 of 116 rows emitted NINE fields** — i.e. a **7-cell markdown row inside a 6-column
  table**. GFM drops the surplus cell, so those two rows were already **silently losing text** in the
  owner's report, and had been for as long as the cells carried the offending character.
- **After: all 116 rows emit eight fields** — six cells, well-formed, every row.

**Cause:** both rows carry a **stray UNESCAPED `|`** deep inside their `*( … )*` annotation (the
board file wrote a raw pipe where GFM requires `\|`). The trim elides the annotation, so the stray
pipe never reaches the rendered row.

⛔ **Say what this is and is not.** The *rendering* symptom is gone. The **defect is still in the
board file**, untouched — this change writes to no board. It is the same class of problem `0383`
("the Backlog board's Task cells are being used as a document store") exists for, and **Q3 ruled
`0383` stays as-is precisely because a renderer fix hides symptoms without slowing the cause.**
This is a live instance of that ruling being right. ⚠️ **It is a finding to report, not a win to
claim, and it is not in this task's scope to repair.**

⚠️ **It also invalidated a measurement.** A first pass here took "field 4" as the Task cell, which
truncates exactly those two rows and undercounted the before-total by ~3,773 bytes — producing a
bogus "divergence from the plan". Re-measured properly, `plan.md` §1's figure is confirmed exactly.
See `scoring-table.md`.

## A number that looks alarming and is not — checked, because a reviewer will ask

The string `agent-closed — not owner-verified` appears on **7 lines of the before render and 2 of the
after render**. That reads like the honesty marker being destroyed. It is not:

- **The Status column is BYTE-IDENTICAL before and after** — `diff` of every rendered Status cell,
  exit 0. Not one status value lost its marker.
- **`⟦FACTS⟧` is byte-identical**, so any record mentioning it survives.
- By column: before, **5 of the mentions sat in column 3 (Task-cell annotations)** and 1 in column 6
  (Next step); after, the column-6 one remains and the 5 are gone. What was elided was **filing prose
  *about* the marker**, not the marker doing its job.
- ⚠️ Worth stating anyway: the live Backlog render shows only **two distinct status values** (`🔲
  Backlog` ×115, `🚧 Blocked` ×1), because the board renders open work only — so no `✅ Done` row was
  even on it to lose a marker. `0409/vocabulary` covers all six values, which the live corpus cannot.

## Something the plan did not predict, checked rather than assumed

The live Backlog render carried **9 GFM-escaped pipes (`\|`)** before the change and **0** after.
That looked like data loss, so it was investigated rather than waved through:

- All 9 sat in **column 3 (the Task cell)** — no other column ever held one.
- In all 9 the escape sat **deep inside the annotation** (earliest at byte 761; every annotation
  opener was at byte ≤130), so all 9 were elided **as annotation content**, correctly.
- The case that matters — an escaped pipe in the **title**, before the opener — is pinned by
  `0409/escaped-pipe`, which asserts the escape survives still-escaped and that no field shifts.

## Contract change — stated loudly, as the brief demands

⚠️ **This IS a change to `dashboard.sh`'s parsed stdout contract.** The `⟦BOARD⟧` Task cell changed
for **113 of 116** live rows. Recorded in the `CONTRACT:` block and in `fkit-status/SKILL.md`.

- `⟦FACTS⟧`, the roll-up, `select-active`, `identity`, `status` and `successor` — **unchanged**.
- **`v2` marker NOT bumped.** Envelope shape is identical; only cell content changed. ⚠️ Per the
  plan's Q4 this remains **an agent's call, not an owner ruling** — unchanged by this build.
- **No scaffold twin.** `find claude/scaffold -name dashboard.sh` returns nothing, confirming the
  plan's dual-home-parity claim. Nothing to keep in parity.

## Verification — both gates, exit codes captured DIRECTLY (never through a pipe)

```
node --test test/*.test.js      →  974 pass, 0 fail, 24 suites   exit 0
bash test/prove-red.sh          →  15 baselines green, 40 mutations red, 0 "✗"   exit 0
                                   "✓ hard gate PASSED"
```

- **974** = the 967 baseline + the **7** new `0409/*` tests. R10 was extended, not added.
- `prove-red.sh` ran **to completion** — all 40 mutations, roughly 40 full suite runs. It was
  backgrounded and the **captured exit code** was read from a file; success was **not** inferred from
  progress lines.
- **Mutation 40 reds at its named assertion:**
  `40. Task-cell trim disabled — "0409/elided" should go RED ... red`
- ⚠️ **The gate was restarted three times**, because each time a late edit (a redundant `sed`
  expression, two comment blocks, a corrected figure) changed a file the gate copies. A gate result
  obtained against bytes that are not the shipped bytes proves nothing. The reported run was made
  against a **frozen tree**, with the four source files' `git hash-object` values recorded before the
  run and re-checked after — **identical**.

## Decision log — everything decided without asking, and why it qualified

ADR-019's audit obligation travels with ADR-032's permission: each call made under the standing
approval is recorded so a wrong one is findable afterwards. As the **Build worker** the approved plan
was both the standing approval and the scope boundary. **No `NEEDS-DECISION` arose.**

| # | Call | Why it needed no ask |
|---|---|---|
| 1 | Elision rendered as exactly one space + `…`, normalising any trailing whitespace before it | The plan names the marker ` …`; normalising is the only way to emit it consistently. Obvious winner inside the plan's intent. |
| 2 | Implemented with `case` + parameter expansion + one `sed`, not `awk` | `awk -v` mangles escapes — the trap mutation 14's own comment records. In-plan ("one helper"); mechanical. |
| 3 | Added a `task_cell` variable instead of reassigning `$task` in place | Mirrors the existing `st`/`st_cell` split and keeps §5's guarantee legible at the call site. Mechanical, localized, in-plan. |
| 4 | Test labels prefixed `0409/…` | `prove-red.sh` greps a **named** assertion; an unnamed test cannot be the gate's target. Required by the plan's own §6. |
| 5 | Deleted a redundant second `sed` expression from the helper I had just written | A provable no-op inside my own new code. |
| 6 | Re-measured with a different counting rule after finding the stray pipes, and **corrected** the figures in `scoring-table.md`, `dashboard.sh` and `SKILL.md` | My first number was wrong and had been written into shipped files. Correcting a measurement error is not a scope change. |
| 7 | Killed and restarted `prove-red.sh` three times rather than report a gate result obtained against bytes that were not the shipped bytes | The gate's value is that it ran on what ships. Reporting otherwise would be the exact dishonesty this file's thesis is about. |

**Deliberately NOT done, each needing someone else's call:**

- ⛔ **Did not touch the board file** to escape the two stray `|` characters — `0383`'s territory, and
  Q3 ruled `0383` stays as-is. Reported, not repaired.
- ⛔ **Did not bump the `v2` marker** — plan Q4, still an agent's call, unchanged here.
- ⛔ **Did not edit `plan.md`** — its bytes are the approved artifact.

## Change surface — §7, and nothing beyond it

- `claude/skills/fkit-status/dashboard.sh` — `title_cell()`, the call site, the `CONTRACT:` block
- `claude/skills/fkit-status/SKILL.md` — the *"What to do with `⟦BOARD⟧`"* section
- `test/dashboard-contract.test.js` — 7 new tests + R10 extended with an annotated row
- `test/prove-red.sh` — mutation **40**, the index entry, and the `THIRTY-NINE` → `FORTY` banner
- this task folder — `worklog.md`, `scoring-table.md`, `captures/`

**No commit. No push.** No board file, no brief, no convention, no `ai-agents/wiki-vault/`, nothing
under `tasks/done/` or `tasks/cancelled/`. **No stored shape changed**, so Sprint 11's migration
freeze was never engaged.

---

# Round 2 — processing the stateful review

Run by a spawned `fkit-coder` as the **Process-review worker** under `/fkit-sprint-ship-loop`
(declared-approval marker complete; the owner's plan approval is the standing approval, the approved
plan the scope boundary). Findings `R1`–`R3` from the ledger's *Reviewer findings*, plus the owner's
three rulings of 2026-09-20 relayed into the spawn.

## R3 — recorded, and `plan.md` left alone

⛔ **`plan.md` is the frozen approved artifact and was NOT edited.** Owner-ruled: note it here.

The plan's **median Task-cell figure of `~2,900`** does not reconcile with the measured **2,583**, and
— unlike every other plan figure — **the header-row explanation does not cover it.** The
reconciliation recorded in [`scoring-table.md`](scoring-table.md) § *"`plan.md` §1's Task-cell figure
is CONFIRMED"* accounts for the byte total and the row count exactly (`395,533 + 4 = 395,537`, the
header row counted as a 117th cell), and every **shipped** figure is the corrected one.

⭐ **Re-measured independently here, from `captures/before-backlog.txt`, under the same counting
rule** — 116 data rows, 395,533 bytes, mean 3,409.8, max 15,375, **median 2,583**. Every figure
matches the scoring table exactly. And the header-row explanation does not merely fail to cover the
median — **it runs the wrong way**:

| Distribution | Median |
|---|---|
| 116 data rows | **2,583** |
| 117 incl. the header row's own 4-byte `Task` cell | **2,543** |
| `plan.md` says | **~2,900** |

Counting the header row as a 117th cell moves the median **down**, *away* from the plan's figure.
So the reconciliation that closes every other gap makes this one slightly worse. So:

- The median is the **one plan figure left unreconciled**. Its provenance is unknown — most likely an
  eyeballed or differently-bucketed value rather than a computed one.
- **Nothing depends on it.** The median appears in no shipped file, no test, no contract block, and no
  decision; the cut point was chosen on the annotation structure, never on a percentile.
- **Record-only, by ruling.** Stated here so it is findable, not corrected anywhere.

## The `v2` version marker — NOW AN OWNER RULING, no longer an agent's call

`plan.md` § *Open questions* Q4 recorded the decision not to bump `⟦fkit-dashboard v2⟧` as **an
agent's call, flagged to the owner so he could override**, and the round-1 ledger carried it forward
as *"an open disposition, not an open defect."*

⭐ **The owner ruled it on 2026-09-20: keep `v2`, do not bump.** That disposition is now closed. The
marker's only documented contract is envelope **shape** (`SKILL.md`: *"If the version marker is not
`⟦fkit-dashboard v2⟧`, say so rather than guessing at the shape"*); this change alters cell
**content** only, and no machine consumer parses the Task cell. **Nothing in the code changes** — the
ruling confirms what shipped; only its status changes, from agent's call to owner ruling.

## Decision log — round 2, everything applied without asking, and why it qualified

Under ADR-032's standing approval, with ADR-019's audit obligation travelling with it. Every entry is
verified-`CORRECT` **and** inside the approved plan's §3 guard territory **and** owner-ruled.

| # | Call | Which finding | Why it needed no ask |
|---|---|---|---|
| 1 | Hardened `title_cell()`'s guard: two arms added beside the existing empty guard — fall back to the raw cell when the head carries no non-asterisk/non-backtick character, or when its asterisk count is odd | **R1** | Owner-ruled verbatim ("harden the guard now", one extra `case` arm, plus a test), and squarely inside plan §3's *"Guard: never render empty"*. Reproduced the failure first, fixed it, re-measured. |
| 2 | Ordered the new arms **after** the `-n` guard, and wrote the punctuation-only arm as `?*` so it fires only on a **non-empty** head | **R1** | Not cosmetic and not test-gaming: a merged guard would make the `-n` line dead code that no test can red, silently un-pinning `0409/opener-at-start`. Verified by experiment — see below. Mechanical, and it protects a test the reviewer explicitly asked not to weaken. |
| 3 | Two new tests (`0409/emphasis-head` ×2) rather than one — the second asserts a **balanced** head before a real annotation is *still cut* | **R1** | Anti-vacuity, the discipline `0409/facts-identical` already follows in this file: without it a `title_cell()` that refused every cut would pass the new test and still be catastrophically wrong. |
| 4 | **No new prove-red mutation** | **R1** | Derived, not inherited — see *"Why no mutation 41"* below. |
| 5 | Extended the `CONTRACT:` block and `SKILL.md`'s `⟦BOARD⟧` section to describe the widened fallback | **R1** | Plan §4 requires the contract docs to change in step with the board's behaviour; both files are already in §7's surface. Mechanical. |
| 6 | Recorded R2's cause in `scoring-table.md` and R3's in this file | **R2**, **R3** | Docs-only, owner-ruled, both files inside §7's surface. No figure revised, `plan.md` untouched. |

**Deliberately NOT done, each needing someone else's call:**

- ⛔ **Did not widen the odd-count balancing to backticks** — see the flagged residual below. The
  owner's ruling named backticks only in the punctuation-only arm and specified odd-count balancing
  for **asterisks** alone; extending it would change the ruled shape. Flagged, not fixed.
- ⛔ **Did not touch `ai-agents/sprints/backlog.md`** — the two stray unescaped `|` are a pre-existing
  **board** defect, `0383`'s territory under the Q3 ruling and outside §7's surface. Relayed for a
  producer, not repaired here.
- ⛔ **Did not edit `plan.md`** — frozen approved artifact.
- ⛔ **Did not "fix" `0409/opener-at-start`** — the round-1 builder's *"green for the wrong reason"*
  self-flag was **disproven by the reviewer's experiment** and re-disproven by mine.

## ⚠️ FLAGGED RESIDUAL — an odd BACKTICK count is still not caught

The owner's ruled guard covers **two of the three** failures R1 measured. The third survives:

```
IN :  Document Bash `*(pattern)` extglob
OUT:  Document Bash ` …
```

The head (`` Document Bash ` ``) carries real words, so the punctuation-only arm does not fire, and it
holds **zero** asterisks — an even count — so the odd-asterisk arm does not fire either. The cell ships
with a dangling backtick.

**Why this is materially smaller than the two that were fixed, and why it was not fixed anyway:**

- **The title survives and the row stays identifiable** (`Document Bash` is right there). This is *not*
  the R7 failure — losing the row's only identifying text — which is what made R1 worth hardening.
- The harm is **cosmetic in-cell markup**, and it does not escape the cell: GFM parses each table cell
  as an independent inline context. ⚠️ **Stated as reasoning, not measured** — I ran no GFM renderer,
  so treat the "does not escape the cell" half as unverified.
- **Widening it would change the shape the owner ruled**, which names backticks only in the
  punctuation-only arm. That is a judgement call, so it stops here rather than being taken.

Recorded in `title_cell()`'s own comment as a known residual, so nobody reads it as an oversight.

## Why no mutation 41 — derived, not inherited

The reviewer said "no new mutation." I reached the same answer from the evidence rather than on its
say-so:

1. **The adjacent, same-class guard has no mutation either.** The `[ -n "$_title_head" ]` empty guard
   shipped in round 1 is pinned by `0409/opener-at-start` and by **no** prove-red mutation — mutation
   40 disables a different line. The reviewer verified that test is nonetheless tight and valid. The
   new arm is the same class of guard, so a mutation for one and not the other would be inconsistent
   with the precedent this task already set and round 1 endorsed.
2. **The assurance a mutation would encode, I measured directly.** Deleting **both** new arms from the
   real file and re-running the dashboard suite gives **188 pass / 1 fail — exactly and only
   `0409/emphasis-head`**. The test is load-bearing; that is demonstrated, not assumed.
3. **Mutation 40 already pins `title_cell` as a whole**, and its anchor `^title_cell() {$` is still
   **unique (1 occurrence)** after this edit — re-checked. Adding #41 would force the `FORTY` banner
   and the index to change again, adding surface in the one file whose own warning is that its index
   drifts out of step, for assurance a unit test already holds.

## Round-2 verification — the two experiments that mattered

Both run against the **real** file, mutated then restored; `git diff --stat` re-checked after.

| Experiment | Result | What it proves |
|---|---|---|
| Delete **both new arms** | **188 pass, 1 fail** — only `0409/emphasis-head` | The new test is load-bearing and isolates to the new guard. |
| Delete **only** the `[ -n "$_title_head" ]` line | **188 pass, 1 fail** — only `0409/opener-at-start` | ⭐ The new arms did **not** un-pin the old guard test. This was the explicit risk the reviewer flagged; it is disproven by measurement, not argued. |
| Re-render the **live** Backlog board with the hardened function | **74,980 bytes, `diff` exit 0** against `captures/after-backlog.txt` | ⭐ **"Latent, not live" is now measured, not asserted.** The hardening changes the live render by **zero bytes**, so R1 really was a future-proofing fix — and the round-1 captures stay accurate, needing no re-capture. |

**Portability of the new `case` pattern**, checked because the bracket carries a class and a quoted
backtick: identical output under **bash**, **`/bin/sh`** and **dash**. (`dashboard.sh` is
`#!/usr/bin/env bash`, so bash is the only one that must work; the other two are headroom.)

**R1's failure reproduced before fixing**, on the shipped function, matching the reviewer's measured
outputs byte for byte: `**Title**(note about filing)` → `**Title* …`; `**(P0)** Ship the thing` →
`* …`; `` Document Bash `*(pattern)` extglob `` → `` Document Bash ` …``. After the fix the first two
return the raw cell unchanged; the third is the flagged residual above.

## Round-2 change surface — still §7, and nothing beyond it

- `claude/skills/fkit-status/dashboard.sh` — `title_cell()`'s two new guard arms + comment, and the
  `CONTRACT:` block's fallback wording
- `claude/skills/fkit-status/SKILL.md` — one bullet in *"What to do with `⟦BOARD⟧`"*
- `test/dashboard-contract.test.js` — 2 new tests (`0409/emphasis-head` ×2)
- this task folder — `review.md` (*Coder response* + *Accepted residuals* + header `Status:` only),
  `worklog.md`, `scoring-table.md`
- `claude/fkit-claude-init.sh .` re-run; `claude/` and `.claude/` verified byte-identical for both
  changed files

⛔ **`test/prove-red.sh` NOT touched this round** (no mutation 41 — see above). ⛔ **`plan.md` not
touched.** ⛔ **No board file** — the two stray `|` in `ai-agents/sprints/backlog.md` are a
pre-existing board defect outside this surface, relayed for a producer.

⚠️ **The gate was restarted once**, for the round-1 reason recorded above: `prove-red.sh` runs
`node --test "$repo"/test/*.test.js`, which includes `coordination-citation-policy.test.js`, which
scans **open task folders — this one included**. Doc edits made while the gate was running would have
been read mid-run, so the first run was killed and re-run against a frozen tree, with the source
**and doc** hashes recorded before the run and re-checked after.

**No commit. No push.**
