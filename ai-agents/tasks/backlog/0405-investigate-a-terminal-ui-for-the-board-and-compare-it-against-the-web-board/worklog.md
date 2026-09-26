# Worklog — `0405` Stage 0, the format probe

**2026-09-21.** Built by a spawned `fkit-coder` as the **Build worker** of `/fkit-sprint-ship-loop`
(Sprint 11, rank P4), under the loop's declared-approval marker.

⛔ **Stage 0 only.** No terminal UI was built, and `plan.md` §8 Stage 1 remains unauthorised. This
worklog records an artifact and its measurements; it contains **no comparison, no recommendation and
no verdict about which medium wins** — those are the architect's under ADR-044 clause 1.

---

## Plan provenance — verified, not assumed

The spawn carried the approved plan **by reference**, not pasted, and said so plainly. The carve-out
this agent runs under asks for *"a concrete approved plan verbatim"*, so the reference was checked
rather than taken on trust:

```
$ git hash-object ai-agents/tasks/backlog/0405-…/plan.md
f6d73fc1cd1162b84c1e9bcef95b2530f5542563     # matches the declared blob
$ wc -c …/plan.md
17200                                        # matches the declared size
```

Treated as satisfying the marker's clause (b). ⭐ A hash-pinned reference is **stronger** than a
paste, not weaker: a paste can drift in transcription — `plan.md`'s own provenance note discloses
exactly that risk about itself — while a blob hash cannot. Read with `Bash(cat …)` as instructed.

⚠️ Clauses (a) caller and (c) owner-approval are **trusted prose**, unverifiable from this context
(ADR-021: no owner channel in a spawn, no cross-context marker to check). Stated, not re-flagged as a
hole — it is the cost ADR-032 Decision 7 records the owner accepting.

---

## The hard constraint — held, and pinned as a fact rather than a promise

`dashboard.sh` was **not edited**. It is a machine contract with a live consumer (`bin/fkit-board.mjs`
shells out to `select-active`; `test/dashboard-contract.test.js` guards it). The probe is a filter
over its stdout.

⚠️ A comment saying so is not evidence. Assertion **F** in `test/board-narrow.test.js` hashes
`dashboard.sh` with `git hash-object` before and after a full probe run and asserts the two are
identical.

---

## Where the filter lives, and why

**`bin/board-narrow.mjs`** — repo-internal tooling, outside `claude/`, beside its sibling reader.

Justification, verified rather than assumed: `install.sh` copies **exactly one directory** to the
install share — `cp -R "$TMP/src/claude" "$SHARE/claude"`. Nothing under `bin/` ships to a consuming
project, which is what the spawn's constraint required. `bin/` already holds `fkit-board.mjs`, the
other reader over this same tree, and `package.json` already runs tooling from there.

`findRoot()` and `findDashboard()` are **imported** from `fkit-board.mjs`, never re-implemented — a
second copy of the root walk and the canonical-vs-`.claude` fallback would be a second thing to keep
true. That file guards its own `main()` on `argv[1]`, so importing it starts no server.

---

## What the probe does

Per `plan.md` §8: link syntax dropped, one row per line, cells clipped to terminal width,
non-wrapping. Aimed at §4's measured 51% — `Filename` 26.4% and `Next step` 24.7% of the render,
neither touched by `0409`.

| Cell | Transform |
|---|---|
| `Filename` | ``[`0013-add-two-worked-examples`](../tasks/backlog/0013-…/brief.md)`` → `0013` |
| `Next step` | `⟨derive: nothing.⟩` → `nothing.` |
| `Task` | `**bold**` and backticks stripped |
| `Status` | cut at the first ` — `; ⚠️ **the emoji is kept on purpose** |
| `Owner` | `fkit-coder` → `coder` |

⚠️ **The status emoji is retained deliberately.** Dropping every emoji would make the columns align
trivially and would dodge the exact hazard `plan.md` §3 says is the whole cost of this work.

⚠️ **Column order is `dashboard.sh`'s, unchanged.** Putting the bare id first would read better — and
would make the capture compare two variables at once. The probe changes the form, not the order.

---

## Character width — measured, and the plan corrected on one point

Enumerated over the live backlog render: **21 distinct non-ASCII characters** (`plan.md` §3 says 19).
The three groups §3 names are confirmed exactly — `⛔ ✅ ⭐` 66 live occurrences, `🔲 🔄 🚧` 136,
`U+FE0F` 34.

⭐ **The correction, and it is load-bearing.** §3's table lists `U+FE0F (VS16, bare)` as its own row
and **omits `U+26A0` entirely**. Measured: there is **no bare U+FE0F** — all 34 follow `U+26A0` and
nothing else — and **zero bare U+26A0**. Together they are `⚠️`, one grapheme, **2 columns** wherever
VS16 is honoured. A table built from §3 as written scores it `1 + 0 = 1` and drifts every `⚠️` row by
a column. Pinned by assertion **B**.

⛔ **The terminal calibration is NOT done, and could not be done from here.** This build had **no
tty**: `[ -t 1 ]` false, `process.stdout.isTTY` undefined, `tput cols` returning its 80 default.
Display width is a property of the terminal drawing the glyph, and there was no terminal. See
`captures/README.md` for the full statement and for the ruler that closes it.

---

## Verification — both gates, exit codes captured DIRECTLY (never through a pipe)

| Gate | Command | Exit |
|---|---|---|
| Unit suite | `node --test test/*.test.js` | **0** — 1002 tests, 1002 pass, 0 fail |
| Hard gate | `bash test/prove-red.sh` | **0** — *"real + unmutated copy green; each mutation reds its NAMED assertion"* |
| New file alone | `node --test test/board-narrow.test.js` | **0** — 11 assertions |

Every capture command's `$?` was read on the line immediately after it, with no intervening command
and no pipeline. ⚠️ This is also why the probe offers `--from`: a pipe replaces `dashboard.sh`'s exit
code with the filter's.

### ⭐ Prove-red on the two assertions that carry the finding

A passing test proves nothing until it is shown it can fail. Two mutations, applied and reverted:

| Mutation | Result |
|---|---|
| `⛔` scored **1** (the `.length` answer) instead of 2 | **A** and **I** go red |
| VS16 no longer upgrades its base (the `⚠️` case) | **B** goes red |

⚠️ **What the first mutation also exposed, and it is a real limit worth stating.** On the first run —
before assertion **I** existed — the `⛔` mutation left **D, D2 and F GREEN**. Those three measure the
probe's output with the probe's **own** `displayWidth()`, so a wrong table agrees with itself while
the real terminal misaligns. Assertion **I** was added in response: it checks every table entry
against **V8's own Unicode database** (`\p{Emoji_Presentation}`), an oracle of different provenance.

⛔ **Even so, I catches a typo, not a disagreement.** Unicode says `⛔` is emoji-presentation; a
terminal may still draw it in one column, and `plan.md` §3 says some do. Only the ruler settles that,
and only a human can read it.

---

## Decision log — everything decided without asking, and why it qualified

Per ADR-019's audit obligation, which transfers with its permission.

| # | Decision | Why it qualified |
|---|---|---|
| 1 | Accepted the plan **by hash-verified reference** rather than demanding a re-spawn with a paste | Verified `CORRECT` — the blob hash and byte count both matched the declaration, which is a stronger guarantee than a paste. Answers the spawn's explicit "say so and stop" branch: the branch did not trigger. |
| 2 | Filter placed at **`bin/board-narrow.mjs`** | In-plan; the spawn delegated the location ("your call, justify it"). Verified against `install.sh` that `bin/` does not ship. |
| 3 | Added **`test/board-narrow.test.js`** (11 assertions), not named in the spawn's deliverables | In-plan intent + a standing hard rule (ADR-014, `node --test`, zero devDeps). The width logic is the one thing the plan says fails silently; shipping it untested would contradict the finding. Mechanical and localized — one new file, no existing test touched. |
| 4 | **Loud** unknown-codepoint warning on stderr | ⭐ Obvious winner within the plan's intent. §3 names silent failure as *"the recurring class"*; making it observable costs ~10 lines and changes no behaviour. ⛔ Recorded as a *detector*, never as a fix. |
| 5 | **Did not** ship the ANSI DSR auto-calibration probe | Judgment call taken on the **narrower, safer** side. It needs raw mode on a tty that does not exist here, so it could not be tested; an untested raw-mode read can wedge a terminal, and a printed ruler cannot. Disclosed in `captures/README.md` rather than quietly omitted. |
| 6 | Status column **11 → 14 columns** | Defect in my own first output, found by reading it: `🔄 In progress` rendered as `🔄 In prog…`, clipping the primary scan column — worse than the wide board it replaces. Width re-derived from every status the live boards carry (max 14). Mechanical, in-plan, pinned by assertion **J**. |
| 7 | Added **`U+27A1`** (`➡️ Moved`) to the table | Found by decision 4's own warning while sweeping all 11 sprint boards. Verified `CORRECT` against the render; mechanical one-line addition, in-plan. |
| 8 | Memoised the live board render in the test; timeout 30 s → 120 s | Defect **I introduced**: three separate 7.5 s renders timed out under `node --test test/*.test.js`, where files run concurrently, reddening the suite for load rather than a defect. Mechanical, confined to the new test file. |
| 9 | `unknownSeen` made a **Set**, not a counter | Verified `CORRECT`: `displayWidth()` runs several times over the same string, so any tally would be a multiple of the truth. Reporting a confidently wrong number is the exact failure §3 catalogues four times. Distinct codepoints are claimed; frequencies are not. |
| 10 | `clip()` taught the same variation-selector rule as `displayWidth()` | Defect in my own first draft, caught before any capture was taken: `clip` scored `⚠️`'s base at 1 while `displayWidth` scored it 2, so every clipped cell containing a `⚠️` over-ran its column and shifted the rest of the row. ⭐ The probe's own alignment was wrong in the one way it exists to measure. Pinned by assertion **C**. |
| 11 | Kept `dashboard.sh`'s **column order** | A deliberate non-change. Reordering would improve reading and confound the capture; it is Stage 1's to argue for. |

**No obvious-winner call was made outside this table, and nothing was applied that falls outside
`plan.md` §8 Stage 0.**

---

## Change surface — Stage 0, and nothing beyond it

| File | Status |
|---|---|
| `bin/board-narrow.mjs` | **new** — the filter |
| `test/board-narrow.test.js` | **new** — 11 assertions |
| `ai-agents/tasks/backlog/0405-…/captures/` | **new** — 7 files: before/after renders, excerpt, ruler, README |
| `ai-agents/tasks/backlog/0405-…/worklog.md` | **new** — this file |

⛔ **Not touched:** `claude/skills/fkit-status/dashboard.sh`, `bin/fkit-board.mjs`, `plan.md`, any
brief, any sprint board, anything under `tasks/done/`, anything under `ai-agents/wiki-vault/`.
Nothing was committed or pushed. Sprint 11's migration freeze is unaffected — the probe is a reader
and touches no stored shape.
