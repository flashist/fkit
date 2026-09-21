# Plan — `0409` Make `/fkit-status` report hierarchically

> **Provenance.** Produced by a spawned `fkit-coder` on 2026-09-20 (plan-only spawn, no source written).
> **Approved by the owner on 2026-09-20** via `AskUserQuestion` in a live `fkit lead` session, together with
> rulings on all four open questions (recorded at the end of this file).
> Written to disk by `fkit-lead` at the moment of approval, copied from the coder's returned text.
> ⚠️ **Transcription risk, disclosed:** this is a copy of text returned through a session, not a copy of a
> file the coder wrote. It has not been diffed against a coder-authored original, because none exists.

## Bullet summary

- **Finding (1) — CONFORMANCE, not design.** The convention already forbids exactly what is happening. No convention edit, no split, coder owns the whole thing.
- **The volume is the Task cell, and nothing else.** On the Backlog board, Task cells are **395,537 of 458,446 output bytes (86%)**. Mean Task cell **3,380 bytes**; largest **15,375 bytes** — in a table cell.
- **Every other convention rule passes.** Open-rows-only works (235 → 117 rendered), roll-up is present and sums to M, dashboard is last, vocabulary renders verbatim.
- **The fix is one helper + one call site in `dashboard.sh`.** Truncate the Task cell at the italic annotation opener. Simulated: **458,446 → 74,867 bytes, 83.7% reduction**; mean cell 3,380 → 99.
- **Drift cannot be hidden by this change — structurally, not by care.** `$task` is referenced at exactly one site (the board row); no drift path reads it.
- **It IS a `dashboard.sh` contract change** — `⟦BOARD⟧` bytes change for 113 of 117 rows. Stating that loudly, as the brief demands.
- **It breaks zero existing tests** — no fixture contains an annotation. That is also the bad news: the behavior is currently untested, so I add the coverage.
- Baseline `node --test test/*.test.js`: **967 pass, exit 0**. `prove-red.sh`: green through all 15 baseline checks (incl. `0i. unmutated repo copy dashboard suite`), then into mutation steps — **not run to completion in this spawn**.
- **Scale figures are worse than the brief records**: `backlog.md` is now **873,397 bytes**, roughly double the 441,959 measured on 2026-09-18.

---

## 1. The measurement I actually took

Commands run against the real tree at `add6a07`, on 2026-09-20. `dashboard.sh` invoked directly via `bash` — I did not invoke the producer-owned skill.

| Figure | Value | Counting rule |
|---|---|---|
| Corpus tasks | **410** | task folders with a numeric prefix: `backlog` 120 + `done` 271 + `cancelled` 19 |
| `dashboard.sh` | **1,687 lines** | `wc -l` |
| `backlog.md` source | **873,397 bytes**, 609 lines, 239 pipe-rows | `wc -c` / `wc -l` / `grep -c '^| '` |
| Active sprints | **Sprint 11 only** | `select-active` → one `active` line, `board` line `reason="lowest-ordered"` |
| Sprint 11 render | **10,381 bytes**, 18 lines, **4 rows** | `wc -c` on `dashboard.sh <plan>` |
| Backlog render | **458,446 bytes**, 246 lines, **117 rows** | same |
| Backlog roll-up | `50 done · 1 blocked · 115 backlog · 7 cancelled · 62 moved — of 235` | sums to 235 ✓ |
| Drift records on either board | **0** | `grep -c '^drift'` in `⟦FACTS⟧` |

**Where the volume is.** Rendered Task cells, Backlog board: **395,537 bytes across 117 cells** — mean 3,380, median ~2,900, max **15,375**. Of the board's row bytes, **392,841 of 438,858 (89.5%)** sit inside `*( … )*` italic annotation spans. Sprint 11, only 4 rows, is **10,381 bytes** — ~2,600 bytes per row.

Note how closely 86% corroborates the ruling's own *"83% prose stuffed into table cells"*.

Not the source of volume: the seven prose beats (capped by the convention at a 30-second read), the roll-up (one line), or `⟦FACTS⟧` (19,449 bytes, but the skill *narrates* from it and never pastes it).

## 2. Conformance vs design — scored rule by rule

Every rule in `status-report-format.md`, including the ones it passes.

| Rule (durable anchor) | Obeyed | Evidence |
|---|---|---|
| *"Short by default… readable in under 30 seconds"* (Rules) | **NO** | beat 7 is 458,446 bytes |
| *"Detail is available on request — lead with the answer"* (Rules) | **NO** | all filing prose is in the default output; there is no "on request" tier |
| Six beats then the board; dashboard **last** (The structure) | YES | SKILL.md step 3 ordering |
| *"Prose and short bullets in beats 1–6. The only table is the dashboard"* | YES | skill structure |
| Status column *"exactly as the vocabulary writes it, marker and all"* | YES | `st_cell` renders the plan marker; clause trim is presentation-only (tested, "R21") |
| `#` rendered verbatim | YES | Priority cell emitted raw |
| Task column *"Short title — the same wording the sprint plan uses"* | **NO** | mean 3,380 bytes, max 15,375 |
| *"Keep it to one row per task, no wrapped prose in cells"* | **NO** | 113 of 117 cells carry a multi-sentence annotation |
| Filename = task-folder name, linked | YES | folder-name recovery ladder |
| Next step column | YES | four shapes emitted + `⟨derive:⟩` sentinels |
| *"Show open work only"* | YES | 235 counted, 117 rendered |
| *"A row with drift on it always shows, whatever its marker says"* | YES | `mark_drift()` fuses `DRIFT_TASKS` and `row_drift` |
| One-line roll-up, non-zero terms, always `— of M` | YES | sums to 235 ✓ |
| Roll-up uses the vocabulary's words | YES | `backlog`, not "not started" |

**The finding, in one sentence: this is finding (1) — a conformance failure — because exactly two rules fail, both of them about the Task cell, and the convention already forbids in plain words precisely what the output does.**

Therefore: **no convention edit, no owner ruling needed on shape, no split at the plan gate.** The task stays with the coder.

**The honest nuance, stated rather than buried.** The prose *originates* in the board file, written by producers — that is `0383` ("Shrink the Backlog board, whose Task cells are being used as a document store"), which exists and is startable. But the convention binds the **report**, and the report is produced by `dashboard.sh`. Fixing it in the renderer makes the report conform *whatever* the board writers do, touches no stored file, and is therefore freeze-safe. It does not make `0383` unnecessary — see open question 3.

## 3. The smallest correct change

**One helper, one call site.** Today the board row is assembled with the Task cell raw, while the Status cell already passes through a presentation-only trim:

```sh
BOARD_ROWS="${BOARD_ROWS}| ${st_cell} | ${pr} | ${task} | ${br_cell} | ${b_owner:-—} | ${next} |
```

Add `title_cell()` beside the existing `one_line_cell()` and apply it to `${task}` only:

- Truncate the Task cell at the **first occurrence of the annotation opener `` *(``**, append a visible elision marker ` …`.
- **No annotation opener → cell unchanged, byte for byte** (4 cells in the corpus).
- **Guard: never render empty.** If the opener is at position 1, fall back to the raw cell. (0 cells hit this today; the guard is for the future.)
- **Not a byte count.** This preserves the established, owner-accepted principle that the clause trim *"is not a byte count: long single clause survives whole"*.

I rejected the obvious alternative of reusing `one_line_cell` on the Task cell: measured, it recovers only **40%** (395,537 → 248,961, max still 15,601) because the annotations contain no early `". "` — and it would sever the `*(` span mid-emphasis, leaving unbalanced markdown that italicises the rest of the table.

**Measured effect of the proposed rule** (simulated over all 117 real cells):

| | Before | After |
|---|---|---|
| Whole board | 458,446 bytes | **74,867 bytes** (−83.7%) |
| Task cells total | 395,537 | **11,619** (−97.1%) |
| Mean / median / max cell | 3,380 / ~2,900 / 15,375 | **99 / 91 / 668** |
| Cells over 200 bytes | ~113 | **2** |

**Residual, not swept under the rug:** 2 cells use an em-dash continuation rather than a parenthetical and stay long (668 and 258 bytes). Option A does not catch them. See open question 1.

## 4. What it does to `dashboard.sh`'s contract — stated loudly

⚠️ **This IS a change to `dashboard.sh`'s parsed stdout contract.** The `⟦BOARD⟧` section's Task cell changes for **113 of 117 rows**. Under ADR-017 rule 4 that is in test scope, and the tests change in the same commit.

Scope of the blast radius, checked:
- `⟦FACTS⟧` — **unchanged**. Drift, counts, `total`, `derive` records read `st`, `pr`, the folder id and the brief. None reads `task`.
- The roll-up — **unchanged** (counts the record, not the cell).
- The `v2` version marker — **not bumped.** The envelope *shape* is identical; only cell content changes. I will raise this if the owner reads the marker's contract more strictly, but ADR-047 §9 bumped it for a shape change, not a content change.
- Other consumers — **none.** `throughput.mjs` mentions `⟦BOARD⟧` only in a comment; nothing else parses the board.
- Dual-home parity — **not engaged.** `dashboard.sh` lives in `claude/` and the gitignored `.claude/` copy only; it is **not** in `claude/scaffold/`, so there is no scaffold twin to keep in parity.

Documentation updated in the same commit: the `CONTRACT:` block in `dashboard.sh`, and `fkit-status/SKILL.md` under *"What to do with `⟦BOARD⟧`"* — recording that the Task cell is title-only, that the elision is marked, and that the filing prose remains in the board file and the brief (linked in the adjacent Filename column). The existing *"Paste it as beat 7 — verbatim"* instruction is untouched and stays true.

## 5. How I verify exceptions became MORE visible, not less

This is the named biggest risk, so it gets a structural answer and an empirical one.

**Structural (the strong guarantee).** `$task` is referenced at **exactly one site** in the whole 1,687-line script — the board row assembly. It is read by no drift check, no counter, no fact emitter. So this change *cannot* hide a drift finding; there is no path from the Task cell into any exception surface. That is a property of the code, not a promise.

**Empirical, as tests:**
1. **`⟦FACTS⟧` byte-identical.** Same fixture plan rendered with and without Task-cell annotations → the `⟦FACTS⟧` sections must match byte for byte. This is the proof that no finding was lost.
2. **Drift row with a 10 KB annotation** still renders, still carries `waiting on owner`, still reaches the roll-up's drift clause.
3. **Exception density, measured before/after** on a constructed fixture with drift at row 60 of 117: bytes the reader must scan to reach the first and the Nth exception. Expect roughly an 84% reduction in scan distance — exceptions do not merely survive, they get closer to the top.
4. **Vocabulary verbatim**, all six values, including a task carrying `(agent-closed — not owner-verified)` — grep the "after" capture and show the marker still present.

## 6. Tests I will add or change

In `test/dashboard-contract.test.js` (currently 967 tests green; **zero fixtures contain an annotation**, so none of this is covered today):

1. Annotation span elided, title survives, marker appended.
2. No annotation → Task cell byte-identical (regression guard).
3. **`⟦FACTS⟧` byte-identical with and without annotations** — the drift-safety proof.
4. Drifted row with a huge annotation: renders, `waiting on owner`, roll-up drift clause.
5. All six status values render verbatim, unaffected by the trim.
6. Annotation at position 1 → falls back to raw, never an empty cell (pairs with the existing "R7: empty Task cell holds its position").
7. A GFM-escaped pipe `\|` in the title survives the trim (pairs with `unesc`).
8. Extend **`R10: exact stdout — pinned byte for byte`** with an annotated row, so the new behavior is pinned in the byte-exact contract test. *(Today R10 would still pass unchanged — that is the gap.)*

In `test/prove-red.sh`: add one mutation that disables the trim and asserts test 1 goes RED, per the repo's prove-red discipline.

**Exit codes captured directly, never through a pipe** (the mistake made twice here).

## 7. Change surface

Only: `claude/skills/fkit-status/dashboard.sh`, `claude/skills/fkit-status/SKILL.md`, `test/dashboard-contract.test.js`, `test/prove-red.sh`, and this task's own folder (before/after captures + the scoring table). Then `claude/fkit-claude-init.sh .` to refresh the gitignored `.claude/` copies.

**Not touched:** any board file, any brief, any convention, `ai-agents/wiki-vault/`, anything under `tasks/done/` or `tasks/cancelled/`. No stored shape changes, so the Sprint 11 migration freeze is not engaged. **No commit.**

## 8. Sequencing

1. Capture "before" artefacts into the task folder (both boards, full length, dated, with the command).
2. Write the scoring table into the task folder.
3. Add tests 1–7 **first**, watch them go red.
4. Implement `title_cell()` + call site; tests green.
5. Update R10 and the two doc blocks.
6. Capture "after"; state before/after bytes and lines with the counting rule.
7. `node --test test/*.test.js` and `bash test/prove-red.sh` **to completion** (exit codes direct).
8. Confirm `select-active` resolves identically before and after; `git diff --stat` matches the allowed surface.

---

## Open questions — ALL FOUR RULED BY THE OWNER, 2026-09-20

Ruled live in a `fkit lead` session via `AskUserQuestion`. Each ruling below is **selected option text** — the
owner chose a pre-written option and typed no free text. It records *which option he picked*; it is **not** a
quotation of his own words.

**Q1 — the residual long tail. RULED: (a) ship Option A only.**
> "Ship as-is — leave the two. Takes 97.1% of the win and keeps an established principle intact: the existing
> trim 'is not a byte count — a long single clause survives whole.' Two cells stay slightly long out of 117."

**Q2 — does this touch the convention, and therefore split the task? RULED: (a) leave the convention untouched.**
> "Leave the convention alone. The coder's reading: 'Short title' already implies a prefix, and 'no wrapped
> prose in cells' already forbids the remainder. Nothing needs adding. Keeps the whole task with the coder."

⭐ **Consequence: the task is NOT split. The coder owns all of it. No producer surface is engaged.**

**Q3 — what happens to `0383` after this lands? RULED: (a) keep `0383` as-is.**
> "Keep 0383 as-is. The report gets readable; the file is still a document store and still growing fast. The
> renderer fix hides the symptom without slowing the cause — and at this rate the file doubles again by October."

**Q4 — the `v2` marker.** Not put to the owner as a separate question. `fkit-lead` took the coder's
recommendation — **do not bump** — on its stated reasoning (the envelope shape is unchanged; only cell content
changes; ADR-047 §9 bumped it for a shape change). ⚠️ Recorded as an agent's call, not an owner ruling, and
flagged to the owner as such so he could override. He did not.

## ⭐ POST-APPROVAL ADDENDUM — 2026-09-20, appended by `fkit-lead`. Read this before step 1.

**Append-only. Nothing above this line was altered.** ⚠️ This addendum changes the file's blob hash, which was
`9c6acbdd1e3d7a500f03889b10726bdd03eaa655` at 15,585 bytes when the build spawn verified it. That pin is
**spent** — it existed so a spawned worker could prove it held the approved bytes, and no further spawn will
use it. Re-pin it if you ever carry this plan into a spawn again.

**1. A superseded bullet.** The §Bullet summary says *"`prove-red.sh` … not run to completion in this spawn."*
That was true when written and is **superseded**: a later measurement on 2026-09-20 ran it to completion —
**exit 0**, 15 baseline checks green, **39 mutations** each reddening their named assertion. `node --test
test/*.test.js` → **967 pass, exit 0**. Both baselines are clean, so any red from here is yours and is signal.

**2. The consequence — the new mutation is #40, and a banner must change with it.** The mutation list runs to
39, so the prove-red mutation proposed in §6 becomes **#40**. ⛔ `test/prove-red.sh` line 20 reads
**`THIRTY-NINE mutations`** and must become **`FORTY`**. That line carries its own warning that this exact
failure has already happened once in this file — *"it read 'Two mutations' while seven more sat below it"* —
in, as it says, the one file whose entire thesis is that an unexercised gate hides drift.

**3. Independently confirmed before implementation, by a second coder, read-only:** §5's structural guarantee
**HOLDS**. `$task` / `${task}` matches **exactly one line** in all 1,687 lines of `dashboard.sh` — the
board-row assembly. The only other occurrence of the token is a comment describing the awk split. No drift
check, counter, or fact emitter reads it. **§5's strong claim is true as written**, so the drift-safety
argument does not need re-deriving.

**4. Q4 (`v2` marker) not voided.** That second coder found nothing suggesting the envelope shape changes.
It remains an agent's call, not an owner ruling.

**5. Why this plan was approved but not built here.** A spawned `fkit-coder` correctly **refused** to write
source: ADR-032's Build-worker carve-out requires **all three** declared-approval signals, and `fkit-lead`
honestly disclaimed signal (a) — it is not `fkit-sprint-ship-loop` and would not claim to be. Signals (b) and
(c) were satisfied. On the owner's ruling of 2026-09-20 the task is instead built by **the owner in a
`fkit coder` session**, which carries the owner channel and plan mode's structural write-wall. **No planning
work was lost; nothing above needs rework.**

---

## Approval

**Approved by the owner, 2026-09-20**, selected option text:
> "Approved — build it. One helper, one call site, 83.7% reduction, structural guarantee that exceptions can't
> be hidden, tests written first and a prove-red mutation added. It measured before proposing, scored every rule
> including the ones that pass, and rejected an easier fix on evidence. Change surface is dashboard.sh, its
> SKILL.md, two test files, and the task folder."
