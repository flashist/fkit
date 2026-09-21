# `0409` — `status-report-format.md` scored rule by rule, against the real BEFORE render

> **Provenance.** Re-measured during implementation on 2026-09-20 by the build worker (a spawned
> `fkit-coder` under `/fkit-sprint-ship-loop`, declared-approval marker complete). This is step 2 of
> [`plan.md`](plan.md) §8. It re-derives the plan's §2 table from the captures in `captures/` rather
> than copying it, so the numbers here are independently reproducible.

## Counting rules — stated so every number below can be re-derived

- **Render** = `bash claude/skills/fkit-status/dashboard.sh <plan>` at `add6a07` with the working
  tree as it stood on 2026-09-20. Exit code captured directly, never through a pipe.
- **Data row** = a line in the capture starting with `| `, EXCLUDING the header row
  `| Status | # | Task | Filename | Owner | Next step |` and the `|---|` separator.
- **Task cell** = everything between field 3 (the `#` column) and the **last three** fields
  (Filename, Owner, Next step), rejoined with `|`, with one leading and one trailing space stripped.
  Split only on pipes that are NOT GFM-escaped (`\|` is content — 9 such escapes exist in the live
  Backlog render). ⚠️ **The "last three fields" part is load-bearing**, and is how `dashboard.sh`'s own
  awk reassembles the cell: two live rows carry a **stray UNESCAPED pipe** inside their annotation, so
  a simpler "take field 4" rule silently truncates exactly the two worst cells. This was measured the
  simpler way first and it gave a wrong answer — recorded below rather than quietly corrected.
- **Bytes** = byte length under `LC_ALL=C`, so a multi-byte character counts as its bytes.

## ✔️ `plan.md` §1's Task-cell figure is CONFIRMED — and a first re-measurement here was wrong

An earlier draft of this file reported a divergence from `plan.md` (391,760 bytes against the plan's
395,537) and attributed it to the plan. **That was this file's error, not the plan's**, and the
correction is recorded rather than silently applied.

Re-measured with the robust rule above, the Backlog board's Task cells hold **395,533 bytes across
116 data rows**. The plan's **395,537 across "117 cells"** reconciles **exactly**:

```
395,533  (116 data rows)  +  4  (the header row's own Task cell, the literal word "Task")  =  395,537
```

- So the plan counted the header row as a 117th cell — a labelling difference of one row and four
  bytes, and nothing more. **Its measurement was right.**
- The first re-measurement here truncated the two stray-pipe rows at the stray pipe, losing ~3,773
  bytes. The lesson is the plan's own: state the counting rule, because two rules give two numbers —
  and here one of the two rules was simply wrong.
- Everything that decides the fix was identical under both rules anyway: max cell **15,375** bytes,
  **113** annotated cells, and `*(` as the cut point.

## BEFORE — measured

| Figure | Backlog board | Sprint 11 board |
|---|---|---|
| Whole render | **458,446 bytes**, 246 lines | **10,541 bytes**, 19 lines |
| Data rows | **116** | **4** |
| Task cells, total bytes | **395,533** (86.3% of the render) | **9,120** (86.5%) |
| Task cell mean / median / max | **3,410 / 2,583 / 15,375** | **2,280 / 2,052 / 3,264** |
| Cells over 200 bytes | **112 of 116** | **4 of 4** |
| Cells carrying a `*(` annotation | **113 of 116** | **4 of 4** |
| Rows emitting a **malformed** 7-cell markdown row | **2 of 116** | **0** |
| Roll-up | `50 done · 1 blocked · 115 backlog · 7 cancelled · 62 moved  —  of 235` — sums to 235 ✓ | `1 in progress · 3 backlog  —  of 4` — sums to 4 ✓ |
| `⟦FACTS⟧` | 19,449 bytes | — |
| `drift` records | **0** | **0** |

⚠️ Sprint 11 measures **10,541 bytes / 19 lines** here, against `plan.md`'s **10,381 / 18**. The
board file `ai-agents/sprints/sprint-11.md` is modified in the working tree relative to `add6a07`
(it carries one more row's worth of edits), so this is a moving input, not a renderer difference.
The Backlog board, whose bytes are identical, is the stable comparison.

## The score — every rule in `status-report-format.md`, including the ones that pass

| Rule (durable anchor) | Obeyed | Evidence from the BEFORE capture |
|---|---|---|
| *"Short by default… readable in under 30 seconds"* (Rules) | **NO** | beat 7 is 458,446 bytes |
| *"Detail is available on request — lead with the answer"* (Rules) | **NO** | all filing prose is in the default output; there is no "on request" tier |
| Six beats then the board; dashboard **last** (The structure) | YES | `fkit-status/SKILL.md` step ordering |
| *"Prose and short bullets in beats 1–6. The only table is the dashboard"* | YES | skill structure |
| Status column *"exactly as the vocabulary writes it, marker and all"* | YES | `st_cell` renders the plan marker; the clause trim is presentation-only |
| `#` rendered verbatim | YES | Priority cell emitted raw |
| Task column *"Short title — the same wording the sprint plan uses"* | **NO** | mean 3,410 bytes, max 15,375 |
| *"Keep it to one row per task, no wrapped prose in cells"* | **NO** | 113 of 116 cells carry a multi-sentence annotation |
| Filename = task-folder name, linked | YES | folder-name recovery ladder |
| Next step column | YES | four shapes emitted + `⟨derive:⟩` sentinels |
| *"Show open work only"* | YES | 235 counted, 116 rendered |
| *"A row with drift on it always shows, whatever its marker says"* | YES | `mark_drift()` fuses `DRIFT_TASKS` and `row_drift` |
| One-line roll-up, non-zero terms, always `— of M` | YES | sums to 235 ✓ |
| Roll-up uses the vocabulary's words | YES | `backlog`, not "not started" |

**Exactly two rules fail, both about the Task cell.** That is what makes this a conformance failure
(finding 1) rather than a design gap — the convention already forbids, in plain words, precisely what
the output does. Hence: no convention edit, no split, the whole task stays with the coder.

## AFTER — the same measurements, same rules, after `title_cell()`

| Figure | Backlog board | Sprint 11 board |
|---|---|---|
| Whole render | **74,980 bytes** (−83.6%), 246 lines | **1,812 bytes** (−82.8%), 19 lines |
| Data rows | **116** — unchanged | **4** — unchanged |
| Task cells, total bytes | **12,067** (−96.9%) | **391** (−95.7%) |
| Task cell mean / median / max | **104 / 96 / 672** | **98 / 101 / 103** |
| Cells over 200 bytes | **2 of 116** | **0 of 4** |
| Malformed 7-cell rows | **0** | **0** |
| Roll-up | **character-identical to BEFORE** | **character-identical to BEFORE** |
| `⟦FACTS⟧` | **byte-identical to BEFORE** (`diff` exit 0) | **byte-identical to BEFORE** (`diff` exit 0) |
| `select-active` | **byte-identical to BEFORE** (`diff` exit 0) | — |

**The two rules that failed now pass; the twelve that passed still pass.** Line count is unchanged
(246 → 246): one row per task before and after — the rows got shorter, none were added or lost.

**The two residual cells are the ones `plan.md` §3 predicted** — 672 and 262 bytes, against its
predicted 668 and 258. Both use an em-dash continuation instead of a `*(` parenthetical, so the cut
point does not reach them. **Q1 ruled: ship as-is.**

⚠️ **The realised numbers run slightly ABOVE the plan's simulation** — whole board 74,980 against a
predicted 74,867, Task cells 12,067 against 11,619, mean 104 against 99. The direction and the
magnitude of the win are as promised (−83.6% against a predicted −83.7%); the small gap is stated
rather than rounded away.

### ✔️ …and the cause is now known: the elision marker is 4 bytes, not 3

Recorded on the round-1 review's **R2** (owner-ruled 2026-09-20, docs-only). The gap is **fully
explicable, and nothing else moved.** The realised figures are exact and self-consistent:

```
458,446  −  395,533  +  12,067  =  74,980   ✓ exactly the measured whole board
```

The plan's two simulated figures were built with **two different elision-marker models**, which is
why neither matches and why they do not even match each other:

| Plan figure | Marker model it used | Reconciles as |
|---|---|---|
| Whole board **74,867** | a 3-byte `…`, no leading space | `458,446 − 395,537 + 11,619 + 113×3 = 74,867` ✓ |
| Task cells **11,619** | **no marker at all** | `12,067 − 113×4 + 4 = 11,619` ✓ |

The **shipped** marker is ` …` — one space plus a 3-byte `…` = **4 bytes**, applied to each of the
113 annotated cells. So the whole-board gap is `113 × 1 = 113` bytes (`74,980 − 74,867`), and the
Task-cell gap is `113 × 4 − 4 = 448` bytes (`12,067 − 11,619`). Both land exactly.

⛔ **No figure above changes, and `plan.md` is NOT edited** — it is the approved artifact. This
turns an open discrepancy into a closed one; it does not revise either side.
