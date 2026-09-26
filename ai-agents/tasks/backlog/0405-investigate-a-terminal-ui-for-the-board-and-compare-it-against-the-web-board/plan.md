# Plan — `0405` Investigate a terminal UI for the board, and compare it against the web board

> **Provenance.** Produced by a spawned `fkit-architect` on 2026-09-21 (plan-only spawn, no files written),
> driven by `/fkit-sprint-ship-loop` on Sprint 11. **Approved by the owner on 2026-09-21** via
> `AskUserQuestion` in a live `fkit lead` session, together with rulings on four questions (at the end).
> Written to disk by `fkit-lead` at the moment of approval, copied from the architect's returned text.
> ⚠️ **Transcription risk, disclosed:** a copy of text returned through a session, not a copy of a file the
> architect wrote. It has not been diffed against an architect-authored original, because none exists.
>
> ⭐ **Plan role note.** The architect planned this by hand, not via `/fkit-plan-task`. ADR-044 clause 1 puts
> the Build role on the owner of the skill the deliverable is produced by — a *written comparison* is the
> architect's, not the coder's — and clause 2 puts the Plan role on the Build role, *"by hand where that role
> does not own `/fkit-plan-task`"*. That clause is an owner-ruled scoped exception to ADR-038.

## Bottom line

**Run the comparison, but not as a readability study — it cannot honestly be one. Run it as a timed,
objectively-scored task battery, with three arms, and run a cheaper probe first that may end the task without
building anything.**

---

## 1. The premise question

| | Web board (`bin/fkit-board.mjs`, shipped by 0411) | Terminal UI |
|---|---|---|
| **Who reads it comfortably** | anyone — "regular humans can open it in the browser" | people who live in terminals |
| **What it costs to install** | Node **+ aiboard's repo checked out on disk + a browser** | Node + a terminal |

⭐ **The correction: it is not true that a TUI simply narrows the audience.** The web reader hard-depends on
aiboard's tree being present — `resolveAiboard({ flag, env, root })` in `bin/fkit-board.mjs` exists precisely
to locate it. So against the standing no-framework constraint (*"other people can attach the same module to
other projects even if they just don't have any framework or system"*), **the web path is the one with the
heavier install**, because it needs a second repo. A TUI needs nothing fkit does not already require.

**The honest shape: web narrows on install, terminal narrows on comfort.** Neither is strictly wider.

---

## 2. Feasibility — verified individually

| Claim (`aiboard-lead`, 2026-09-18) | Verdict |
|---|---|
| "`board` command renders a kanban in ~28 lines" | ⚠️ **PARTLY VERIFIED.** `cmd_board` in `aiboard/cli.py` is **27 lines** (21 for the render). ⛔ **But it does not render from the snapshot** — `snap = board.snapshot()` is used only for `--json`; the text kanban re-queries via `board.list_tasks(...)`. And `width = 28` is the hard-coded column width on the next line — the "28" may be a conflation of the two numbers. |
| "Honest Node cost 400–700 lines; narrow 250–400" | ⛔ **NOT VERIFIABLE, and the premise under it is false.** aiboard is **100% Python — no `package.json`, no `.js`/`.mjs`, zero dependencies.** There is **no terminal-interactive code at all**: no `termios`, `curses`, raw mode, ANSI escapes, or `get_terminal_size` anywhere. In aiboard the number would have to cover bootstrapping Node from nothing. |
| "Python has `curses`, so build it in Python — moot under the port ruling" | ⛔ **THE PORT HAS NOT STARTED.** aiboard's tree has no Node and no port task. ⚠️ Stated as measured, not as a judgment — it is aiboard's board, not fkit's. |
| "A TUI is a fourth door into the same store — no store work, no data-model work" | ✅ **VERIFIED, and stronger than claimed — in fkit.** `makeReader({root, dashboard})` in `bin/fkit-board.mjs` is **exported and tested** (`test/board-reader.test.js`) and returns `{ snapshot, problems, taskDetail, sprintDetail }` over the live tree. |

⭐ **The cost finding that changes the recommendation: the cheap experiment does not run in aiboard. It runs
in fkit, where the data layer already exists, in Node, tested, today.** A throwaway TUI there is a *pure
renderer* — no parsing, no store work. Realistically **150–250 lines**, not 400–700.

---

## 3. Character width — costed separately

**fkit has no width-alignment code today, and that is why this cost is new rather than inherited.** Every
`substr` in `dashboard.sh` is **delimiter-driven** — no `%-Ns` padding, no `cut -c`, no fixed-width columns.
`title_cell()` avoids the problem structurally: it counts `*` characters and refuses to cut on an odd count
rather than measuring anything.

⛔ **A TUI would be the first thing in this project that has to align columns. That is the whole cost.**

**Measured, on fkit's actual board render** (the 19 distinct non-ASCII characters in `0409`'s
`after-backlog.txt`):

| Characters | Live count | Display columns | JS `.length` | Python `len()` |
|---|---|---|---|---|
| ⛔ ✅ ⭐ | 66 | **2** | **1 ✗** | **1 ✗** |
| 🔲 🔄 🚧 | 136 | **2** | 2 ✓ | **1 ✗** |
| U+FE0F (VS16, bare) | 34 | **0** | **1 ✗** | **1 ✗** |
| — … ⟨ ⟩ § · – ≥ ↔ × | ~430 | 1 | 1 ✓ | 1 ✓ |

⭐ **The trap in one line: there is no naive count that is right for both emoji groups.** `.length` is correct
for 🔲 and wrong for ⛔ — same board, same row, opposite errors. ⚠️ **And for ⛔ ✅ ⭐ terminals themselves
genuinely disagree**, so this is not "use the right table" — the same code misaligns differently in different
terminals. ⛔ Column figures are derived from Unicode properties, **not measured in his terminal** — the
design must measure them there.

**Cheap mitigation, honest about what it costs:** for *today's* content the fix is a **~20-entry lookup
table**, not a library. ⛔ But that is true only for the prototype on today's content — briefs are
hand-written, so the first new emoji misaligns silently. **That silent-failure property is the recurring
class, not the table.**

### ⚠️ The sightings — only one of three recoverable; four verified substitutes

⛔ **The brief's "three 2026-09-18 sightings" are not enumerated anywhere in fkit's tree.** Two lived in
`aiboard-lead`'s conversations and are not recoverable here. **Verification step 4 cannot be satisfied as
written.** Cited instead:

1. **2026-09-18** — the evaluation report: the same board is "841,505 characters" and "858,948 bytes"; one
   cell measured **four ways** (17,187 / 17,189 / 17,575 / 17,577). Its own conclusion: *"state the counting
   rule with every number."*
2. **2026-09-20** — `0409`'s `scoring-table.md`: two re-measurements of the same cells disagreed
   (395,533 vs 391,760) on a splitting rule.
3. **2026-09-20** — same file: a second gap (74,867 vs 74,980) traced to **an elision marker that is 4 bytes,
   not 3**.
4. **`dashboard.sh` sets `LC_ALL=C`** — fkit's own renderer counts **bytes**. A **fifth** regime beside
   Python's code points, JS's UTF-16 units, and a terminal's display columns.

---

## 4. ⚠️ The confound is reduced, not removed

`0409` did what it was scoped to do — its scoring table says *"Exactly two rules fail, both about the Task
cell."* Both now pass. **But the confound the brief named was "how much text this team emits," and in a
terminal that is about line width, not bytes.**

**Measured on `0409`'s `after-backlog.txt` (post-fix, 117 data rows, 74,980 bytes):**

| | |
|---|---|
| Median line width | **279 columns** (p90 **749**, max **1,978**) |
| Lines wider than 120 columns | **143 of 246** |
| **Filename** cell | mean 168, max 248 — **19,768 bytes, 26.4% of the render** |
| **Next step** cell | mean 158, **max 1,760** — **18,535 bytes, 24.7%** |
| **Task** cell (the one 0409 fixed) | mean 104 — 12,067 bytes, **16.1%** |

⭐ **After 0409, the cell it fixed is the third-largest contributor.** Filename and Next step together are
**51% of the render** and neither was touched. Simulating the terminal-native form (link syntax → bare id,
emphasis stripped) drops the median to 183 — but **116 of 117 rows still exceed 120 columns.**

⛔ **So a TUI scored against today's terminal output today would still be scored partly on line wrapping.**
Not a reason to block — it is why Arm M exists, and why Stage 0 comes first.

---

## 5. The comparison design

### Why it is not a readability study

One subject; unblindable; the subject authored both systems; he proposed the TUI himself and said *"maybe it
will help and make the web-HTML board not needed."* ⛔ **A preference question asked of that person cannot
produce a usability finding, and no design fixes that.**

⭐ **What survives: he cannot fool a stopwatch or a wrong answer.** His bias moves his *preference*; it does
not move his *error rate*. So — **a timed, scored task battery.** Preference is recorded separately and
weighted lower.

**The bound, carried verbatim from ADR-051's evidence log: a strong signal about one user's workflow. NOT a
usability finding.**

### Three arms

| Arm | What it is |
|---|---|
| **W** | The web board — `bin/fkit-board.mjs` in a browser |
| **T** | The throwaway terminal prototype |
| **M** | **Today's `/fkit-status` markdown render in the terminal** |

⛔ **Arm M is not optional.** Without it you cannot tell "the terminal UI is good" from "anything beats a
279-column markdown table" — and §4 says that is a live risk.

### What board, which tasks

**The live tree at full scale — 411 tasks across 11 boards, uncurated.** ⛔ No demo subset. Questions drawn
from across all 11 boards.

### What he is asked — 5 classes × 3 questions = 15 per arm

| Class | Example | What it tests |
|---|---|---|
| **1. Overview** | "How many tasks are in progress right now, across all boards?" | breadth at a glance |
| **2. Locate** | "Find 0383. Status and owner?" | navigation |
| **3. Drill-down** | "What does 0135 say it is blocked on?" | detail on demand |
| **4. Cross-reference** | "Which open tasks name 0409 as a dependency?" | the thing neither tool is built for — both may fail, and **that is a finding** |
| **5. Absence** | "Is there any open task about the wiki linter?" | ⭐ where silent-skip bugs surface — **double-serves ADR-051's F2** |

⭐ **Class 4 is deliberately the test of `fkit-lead`'s "overview plus drill-down" hypothesis, not an
assumption of it.**

**Different question sets per arm**, matched by class and difficulty, randomly assigned to arm.

### How an answer is recorded

- One plain-text sheet per arm: question number, answer, stopwatch start/stop. ~15–20 min per arm.
- ⛔ **Ground truth is computed by script from the tree BEFORE he runs, and sealed.** He does not see it; it
  is not adjusted afterwards. **This is the guard against rationalising the result.**
- Arm order **drawn, not chosen**. Arms on **different days**.
- Preference recorded **only after all three arms are scored**.

### ⚠️ The limitation that cannot be designed away

Counterbalancing needs more than one subject. **The learning effect is real and unremovable.** The mitigation
is to set the bar high enough that a modest learning advantage cannot manufacture it.

---

## 6. Pre-declared conditions — stated before it is run

**WEB WINS (W)** — median time-to-correct-answer on W ≤ **60%** of T's, **AND** W's error count ≤ T's.

**TERMINAL WINS (T)** — median time-to-correct on T ≤ **60%** of W's, **AND** T's errors ≤ W's, **AND** he
answers yes to the durable-use question.

**INCONCLUSIVE** — the two medians are within **±40%**, **OR** error counts differ by ≤2, **OR** he consulted
another arm mid-question, **OR** fewer than 12 of 15 questions completed in any arm.

⚠️ **40% is not a significance threshold and is not offered as one.** With n=1 nothing here reaches
significance. It is the smallest gap that would change daily use.

**Kill conditions — any one ends the task honestly, without a winner:**

| | |
|---|---|
| **K1** | The prototype exceeds **250 lines or one working session.** The cheap-artifact premise has failed. |
| **K2** | ⭐ **Arm M beats or ties Arm T.** Then the medium is not the variable — **the board format is.** |
| **K3** | He cannot complete a battery without looking things up elsewhere. The questions are wrong. |
| **K4** | He states a preference before finishing all three arms. The preference datum is void; timings survive. |
| **K5** | ⚠️ **ADR-051's P1 has landed**, starting the trial. See §7. |

**Durable-use window:** after the batteries, **5 working days** with all three available and nothing asked of
him. Both W and T append **one timestamp line per start** (no content). Then one question: which did you open?

---

## 7. ⚠️ A sequencing window that is open now and will close

**ADR-051's trial clock starts at P1.** Verified: **the port has not started.** So the trial has not begun.

⛔ **Once it does, running a competing reader pollutes ADR-051's F1 fallback tally** (*"he fell back for more
than half his status reads"*) — a TUI read is neither "used the board" nor "went back to markdown", and F1 has
no third category.

⭐ **So this task is cheaper and safer to run NOW than later.** ⛔ Not a re-rank request.

---

## 8. The staged plan

**Stage 0 — the format probe. Hours, no TUI, may end the task.**
Pipe `dashboard.sh`'s stdout through a **separate filter script** into a fixed-width, non-wrapping form: link
syntax dropped, one row per line, cells clipped to terminal width. Show it beside today's output. ⭐ **0409
fixed the volume; §4 says the width still dominates.** If this alone fixes *"hard to read,"* the TUI question
is answered for near-zero cost and the task ends there.
⛔ **Hard constraint: do not edit `dashboard.sh`.** Its stdout is a machine contract with a live consumer —
`bin/fkit-board.mjs` shells out to `dashboard.sh select-active`, and `test/dashboard-contract.test.js` guards
it. The probe is a filter, never an edit.

**Stage 1 — the throwaway prototype. One session, ~150–250 lines.** Only if Stage 0 does not settle it. A pure
renderer over `makeReader()`: kanban columns, cursor, scroll, `taskDetail(id)` in a pager, quit. Emoji width
via the ~20-entry table, **measured in his terminal first.** K1 caps it.

**Stage 2 — the three-arm battery**, per §5–§6.

⛔ **Nothing in any stage touches a stored shape.** Every arm is a reader.

---

## 9. The identity-gap refutation — recorded so it is not revived

⛔ **A terminal UI does not address the identity gap, and must not be proposed or scored as a mitigation for
it.** `fkit-lead` argued a terminal tells a human from an agent; `aiboard-lead` refuted it the same day:
**(1)** the human and the agents **share one uid**; **(2)** **agents can drive a PTY**; **(3)** **aiboard's
CLI already has exactly this weak story.** ⛔ This task writes, numbers and references no identity ADR.

---

## Open questions — ALL RULED BY THE OWNER, 2026-09-21

Ruled live in a `fkit lead` session via `AskUserQuestion`. Each is **selected option text** — the owner chose
a pre-written option and typed no free text. It records *which option he picked*; it is **not** a quotation of
his own words.

**Q1 — the branch. RULED: Stage 0 first. This ruling is also the PLAN APPROVAL.**
> "Stage 0 first — the format probe. A few hours, no terminal UI. Pipe dashboard.sh's output through a
> separate filter into a fixed-width, non-wrapping form — links dropped, one row per line, cells clipped to
> your terminal width — and show it beside today's output. Since 116 of 117 rows still exceed 120 columns,
> this may fix 'hard to read' outright. If it does, the terminal-UI question is answered for near-zero cost
> and the task ends there."

**Q2 — the premise question. RULED: the terminal-resident owner.**
> "You — the terminal-resident owner. Optimise for how you actually work. The terminal path needs nothing
> fkit doesn't already require, so it's also the lighter install. Against it: your original motivation was
> literally 'regular humans can open it in the browser'."

⭐ **Consequence: this reverses the premise the project had been working from.** The board is optimised for
this owner, not for the hypothetical browser user. ⚠️ The no-framework constraint is **not withdrawn** — he
ruled which audience the **board** serves, not that the constraint is gone.

**Q3 — the durable-use window. RULED: consent given.**
> "Yes — log it. One line per launch, no content, 5 days. It's the only part that measures behaviour rather
> than opinion — and it's the direct counterpart to ADR-051's 'he stopped using it and did not notice'
> failure condition, which is otherwise unmeasurable."

**Q4 — record-keeping. RULED: both.**
> "Accept the four substitute sightings" — the brief's three 2026-09-18 sightings were never recorded and two
> are unrecoverable; §3's four verified substitutes stand in.
> "Correct the stale figures on the brief and board" — `0405`'s brief and Sprint 11 still carry the
> unverified 400–700 and ~28-line figures. Dated correction notes. ⛔ **A producer act, not the architect's.**
