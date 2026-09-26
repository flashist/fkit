# `0405` Stage 0 — the format probe: commands, date, exit codes, measurements

**Captured 2026-09-21** against the working tree at commit `3027cc7` (plus the uncommitted ADR-051
amendment and `plan.md`, neither of which a board render reads). These are the FULL renders,
untruncated, as [`plan.md`](../plan.md) §8 Stage 0 asks for.

⛔ **Stage 0 only.** No terminal UI was built. `plan.md` §8 Stage 1 is unauthorised.

---

## The commands, exactly as run

```sh
# BEFORE — today's output, dashboard.sh unchanged
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md   > before-backlog.txt
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-11.md > before-sprint-11.txt

# AFTER — the same render, through the filter
node bin/board-narrow.mjs --from ai-agents/sprints/backlog.md   --width 120 > after-backlog-120.txt
node bin/board-narrow.mjs --from ai-agents/sprints/backlog.md   --width 100 > after-backlog-100.txt
node bin/board-narrow.mjs --from ai-agents/sprints/sprint-11.md --width 120 > after-sprint-11-120.txt
node bin/board-narrow.mjs --calibrate                                      > calibration.txt
```

⚠️ Invoked as `bash <path>`, never `./<path>` (ADR-017 rule 2). The producer-owned `/fkit-status`
skill was **not** invoked; this is the script directly, then the filter over its bytes.

## Exit codes — captured directly, never through a pipe

Each `$?` was read on the line immediately after its command, with no intervening command and no
pipeline. ⚠️ This is also why the filter offers `--from`: a shell pipe would replace `dashboard.sh`'s
exit code with the filter's, and a board that failed to render would be indistinguishable from a
board with no rows.

| Capture | Exit | stderr |
|---|---|---|
| `before-backlog.txt` | **0** | empty (0 bytes) |
| `before-sprint-11.txt` | **0** | empty (0 bytes) |
| `after-backlog-120.txt` | **0** | empty (0 bytes) |
| `after-backlog-100.txt` | **0** | empty (0 bytes) |
| `after-sprint-11-120.txt` | **0** | empty (0 bytes) |
| `calibration.txt` | **0** | empty (0 bytes) |

---

## ⚠️ The counting rule, stated with every number

`plan.md` §3 records four separate occasions where two measurements of the same text disagreed, and
its own conclusion is *"state the counting rule with every number."* So:

- **display columns** — what a terminal actually allocates. The rule used everywhere below unless
  another is named. Computed by an implementation written against Python's `unicodedata`,
  **independent of the probe's own table**, so the probe is not marking its own homework.
- **code points** — Python `len()`. Differs from columns wherever an emoji is 2 columns wide.
- **UTF-8 bytes** — what `dashboard.sh` itself counts (it sets `LC_ALL=C`).

⛔ **A correction to `plan.md` §4, found by measuring.** That table's row reads *"Median line width
**279 columns** (p90 **749**, max **1,978**)"*. Those are **UTF-8 byte** figures, not column figures:
measured over the same 246 lines, bytes give median 280 / p90 749 / max 1,978 — matching — while
**display columns** give median **270** / p90 **726** / max **1,937**. The conclusion is unaffected
(143 of 246 lines exceed 120 columns on either rule, exactly as §4 says), so this is a precision
correction, not a change of direction. Noted because §3 asks for exactly this.

⚠️ `plan.md` §4 also says *"117 data rows"*; the render carries **116** (115 backlog + 1 blocked,
matching the roll-up line `115 backlog` + `1 blocked`). Off by one, and immaterial to the finding.

---

## What the filter does to the numbers

### `backlog.md` — 411 tasks, 116 board rows

| | BEFORE | AFTER (w=120) | AFTER (w=100) |
|---|---|---|---|
| Lines | 246 | 245 | 245 |
| Median line width | **270 cols** | **91** | **80** |
| p90 | **726 cols** | **120** | **100** |
| Max | **1,937 cols** | **120** | **100** |
| **Lines wider than the terminal** | **143 of 246** | **0 of 245** | **0 of 245** |
| Bytes | 74,980 | 20,386 (**−72.8%**) | 18,093 (**−75.9%**) |

⚠️ The one line fewer is the markdown separator row (`|---|---|…`), which the filter drops.

### `sprint-11.md` — the board actually read day to day

| | BEFORE | AFTER (w=120) |
|---|---|---|
| Lines | 16 | 15 |
| Median line width | **19 cols** | **19 cols** |
| p90 | 343 | 92 |
| Max | **366 cols** | **120** |
| **Lines wider than the terminal** | **2 of 16** | **0 of 15** |
| Bytes | 1,030 | 856 (−16.9%) |

⭐ **These two tables do not tell the same story, and that is the most important thing in this
folder.** On the 411-task backlog the filter is transformative. On Sprint 11 — two open rows — only
**2 of 16 lines** were ever too wide, and the median line was already 19 columns. Whatever "hard to
read" means, on the small board it is not mostly about line width.

---

## The width calibration — ⛔ NOT DONE, AND IT CANNOT BE DONE FROM HERE

`plan.md` §3 is explicit that the column figures are *"derived from Unicode properties, not measured
in his terminal"* and that the design *"must measure them there"*.

⛔ **That measurement is still outstanding.** It was not skipped for time: this probe was built in an
environment with **no tty at all** (`[ -t 1 ]` is false, `process.stdout.isTTY` is `undefined`,
`tput cols` returns the 80-column default). Display width is a property of the terminal doing the
drawing, and there was no terminal. Nothing in this folder measures one.

**What was done instead**, honestly labelled:

1. `calibration.txt` is a **ruler to be run by a human in the real terminal** — `node
   bin/board-narrow.mjs --calibrate`. Five copies of each character against a 10-column ASCII
   reference; where the `|` lands gives the width directly.
2. Every width in the probe's table is **derived**, and cross-checked against **V8's own Unicode
   database** (`\p{Emoji_Presentation}`) by assertion I in `test/board-narrow.test.js`. That catches a
   typo in the table. ⛔ **It does not catch a terminal that disagrees with Unicode**, which
   `plan.md` §3 says is a real case for `⛔ ✅ ⭐`.
3. An automatic probe (ANSI DSR `ESC[6n`) was **considered and deliberately not shipped**: it needs
   raw mode on a real tty, could not be tested here for the same reason, and an untested raw-mode read
   can wedge a terminal. A ruler cannot.

⚠️ **Until the ruler is run, every "0 lines exceed the width" figure above carries one assumption:
that this terminal agrees with Unicode about the six emoji.** If it does not, the affected rows are
off by one column each.

### ⭐ One correction to `plan.md` §3's table, and it is load-bearing

§3 lists `U+FE0F (VS16, bare)` as its own row — *"34 live occurrences"* — and **does not list
`U+26A0` at all**. Measured on the live corpus:

- There is **no bare U+FE0F**. All **34** occurrences follow `U+26A0` and nothing else.
- There are **zero bare U+26A0**.
- Together they form `⚠️`, one grapheme, **2 display columns** wherever VS16 is honoured.

A width table built from §3 as written scores `⚠️` as `1 + 0 = 1` and drifts **every `⚠️` row on the
board by one column**. Pinned by assertion B in `test/board-narrow.test.js`.

---

## ⭐ The silent-failure property, demonstrated rather than described

`plan.md` §3: *"briefs are hand-written, so the first new emoji misaligns silently. That
silent-failure property is the recurring class, not the table."*

The probe was built so that failure is **loud**: any codepoint not in its table is width-guessed and
reported on stderr. Sweeping all **11** sprint boards on 2026-09-21:

```
ai-agents/sprints/done/sprint-2.md -> board-narrow: 1 codepoint(s) not in WIDTH_TABLE
  — width GUESSED, columns may drift: U+27A1
```

`➡️ Moved` — a status that exists only on archived boards. The table was built from the backlog board
and did not contain it. **This is the predicted failure, arriving within an hour of the table being
written, on real data.** It has since been added; the warning is what found it.

⛔ **The warning is not a fix.** The misalignment still happens; what changed is that somebody is told.
Do not report this as having solved the recurring class.

---

## Files

| File | What it is |
|---|---|
| `before-backlog.txt` | today's `dashboard.sh` output for the 411-task backlog, full length |
| `before-sprint-11.txt` | today's output for Sprint 11, full length |
| `after-backlog-120.txt` | the same backlog render through the filter at 120 columns |
| `after-backlog-100.txt` | the same, at 100 columns |
| `after-sprint-11-120.txt` | Sprint 11 through the filter at 120 columns |
| `side-by-side-excerpt.md` | the first six rows of the same render, before and after |
| `calibration.txt` | the width ruler — ⚠️ **run it yourself; the copy here is only the derived answer** |
