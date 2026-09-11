# Add `deferred (→ NNNN)` to the stateful-review Status vocabulary — a seventh value carrying the successor task id

## ID
0386

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner ruling 2026-09-11**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, **option label verbatim: "File it as a Backlog row (Rec)"**.

**The problem.** The *Coder response* → `Status` cell in a stateful review ledger takes **one of
exactly six** prescribed values:

`pending approval` · `✅ done` · `won't fix (frontier)` · `disproven` · `closeout (re-litigation)` ·
`blocked`

**None of the six covers one real, recurring outcome:** *a finding verified `CORRECT`, deliberately
**not** fixed in this task, deferred to a **named successor task** by owner ruling, with **no local
artifact** produced.* Four of the six are affirmatively false for that state — the finding was not
disproven, it is not a frontier tradeoff, it is not awaiting approval, and it is not a re-litigation
closeout. `blocked` is the least-wrong of the six, but it **misreads as "this task is stuck"**, which
is the opposite of the truth: the task shipped, and the finding was consciously handed onward.

**The change.** Add a **seventh** value — **`deferred (→ NNNN)`** — carrying the successor task id
**inside the cell itself**.

**Why the id belongs in the value.** `blocked` today needs a prose paragraph beneath the table to
explain which task absorbs the finding. `deferred (→ 0341)` is **self-describing and greppable**: a
closed ledger becomes machine-checkable against whether its named successor actually shipped.

### ⚠️ The recurrence count is ONE, not three — measured 2026-09-11, and it corrects the framing this task arrived with

This brief was handed over citing **three** verified recurrences. ⛔ **Re-measured against the
ledgers, the count for the state described above is ONE.** The correction is recorded here rather
than silently applied, because it changes how strong the case is:

| Cited | What the ledger actually reads | Is it this gap? |
|---|---|---|
| `0338` **R7** | `Status` cell reads **`blocked`**. Deferred to `0341` by owner ruling **AC7** (*"Route to 0341 (Rec)"*). Coder's own cell records *"Routed, not dropped: the follow-up text is in my return to the driver"* and *"I did not edit `0341`'s brief"* — **no local artifact** | ⭐ **YES — the one clean instance** |
| `0337` **R27** | Deferred to `0341` by owner ruling **Y1** (*"Record as follow-ups on 0341 (Rec)"*) — but the cell reads **`✅ done`**, because the ruling's action *was* a local edit: the follow-up was written into ADR-047 §3.1 | ⛔ **No** — a deferral **with** an artifact; `✅ done` is honest |
| `0337` **R28** | Same shape as R27 — cell reads **`✅ done`**, ADR-047 §3.1 follow-up recorded | ⛔ **No** — same reason |
| `0337` **R2** | Names `0341` as the implementer, but is scope framing, not a deferred finding | ⛔ **No** (agrees with the hand-over's own read) |

⛔ **`0341` has NO `review.md`** — verified 2026-09-11, its folder holds `brief.md` only — so **no
recurrence count can be derived from `0341`'s ledger**, in either direction.

**The distinction that matters, and it is the whole design input:** a deferral that produces a
**local artifact** (an ADR follow-up entry, a residual, a filed brief) can honestly read `✅ done` —
the act *was* completed. A deferral that produces **nothing local** — the finding simply travels to
another task — has no honest value in the six. **Only the second shape needs the new word.** Scope
the value to that shape; do not let it become a softer synonym for `✅ done`.

### ⭐ Adjacent evidence the six-value set is already being strained

⚠️ Measured in the same sweep, **not** part of the count above and **not** scoped here: `0337`'s
ledger carries a `Status` cell reading **`✅ recorded as residual`** (finding **R30**, owner ruling
**Y3**). That is a **seventh value already invented in the wild** — an ad-hoc label, which the
process skills explicitly forbid. It is a *different* shape from `deferred`, so ⛔ **do not fold it
into this task**; it is recorded here as evidence, and as a candidate follow-up if the owner wants
the vocabulary audited more broadly.

### Known consumer, already pointed at this task

`0338`'s review ledger carries an **accepted residual** whose *Re-raise only if* clause already names
this work as its discharge — see that ledger's § *Accepted residuals (shared, do-not-re-litigate)*,
the entry recording *"the schema has no word for the state R7 is actually in"* and *"When it lands,
R7's cell moves to that value and this residual closes with it."* ⛔ That residual exists to stop a
future reviewer re-raising R7's `Status` cell; closing it is part of this task, not a separate one.

## What to build

### ⛔ Two edit sites that MUST move together

If only one lands, the ledger and the reviewer disagree about what is a legal value — the reviewer
would flag a legal cell as an ad-hoc label, which is exactly the failure the mirror exists to prevent.

1. **`claude/skills/fkit-process-stateful-review/SKILL.md`** — the **coder-side definition**, the one
   Steps 4 and 6 assign from. Anchor: the line labelled **`**Status vocabulary**`**, reading
   *"(the *Coder response* → Status cell)"*, immediately followed by the six values on the next line.
2. **`claude/skills/fkit-stateful-review/SKILL.md`** — the **reviewer-side mirror**, inside the bullet
   reading *"You **read** *Coder response* for context; you **never** write or edit it. Its Status
   vocabulary — … — is the coder's to set."* This mirror exists so the reviewer does not flag a legal
   value as ad-hoc.

### ⚠️ Third site — CHECK it, and it is NOT optional if the check confirms

3. **`claude/skills/fkit-sprint-ship-loop/SKILL.md`**, the **Process review** row of its step table.
   Verified present 2026-09-11: it enumerates the six inline and asserts
   *"one of exactly these six prescribed values"* … *"so **five of the six** apply here"* (the
   excluded one being `pending approval`, which this loop never uses).
   ⛔ **That arithmetic goes stale the moment a seventh value exists** — it becomes *six of the
   seven*. The coder who shipped `0338` read this line and did **not** edit it.

   ⚠️ **Also visible at that site, and worth deciding on while you are there:** the row cites the
   vocabulary as `fkit-process-stateful-review/SKILL.md:85`. **That coordinate is stale** — line 85
   reads *"by their stable id (`R1`, `R2`, …)"*; the vocabulary is ~11 lines below it. Repairing it is
   the implementer's call; ⛔ it is **not** licence to widen this task into a coordinate sweep.

### The known consumer

4. **`0338`'s `review.md`** — move R7's `Status` cell from `blocked` to `deferred (→ 0341)`, and
   **close the accepted residual** that records the gap (its *Re-raise only if* already points here).
   ⛔ The rest of that ledger is **frozen history** — change the one cell and the residual's closing
   state, nothing else.

### ⛔ Out of scope

- ⛔ **No change to the other six values**, their spellings, or their meanings.
- ⛔ **Do not touch `0337`'s ledger** — R27/R28 read `✅ done` correctly (see the table above), and
  R30's `✅ recorded as residual` is explicitly deferred out of this task.
- ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005).
- ⛔ **No re-rank of any board** (ADR-035).
- ⛔ **No new devDependency** (ADR-014).

## Verification steps

1. **Both vocabulary sites list seven values, and spell the seventh identically.** Grep both
   `claude/skills/fkit-process-stateful-review/SKILL.md` and
   `claude/skills/fkit-stateful-review/SKILL.md` for `deferred (→` — each returns **at least one**
   hit, and the literal value text matches byte-for-byte between the two files. ⛔ A run where only
   one file matches is a **failed** run, not a partial one.
2. **The placeholder is documented as a placeholder.** The definition site states that `NNNN` is
   replaced by the **actual successor task id** in a real cell (e.g. `deferred (→ 0341)`), so nobody
   writes the literal string `NNNN` into a ledger.
3. **The `deferred` / `✅ done` boundary is written down.** The definition site says, in whatever
   wording the implementer chooses, that `deferred` is for a deferral producing **no local artifact**
   — a deferral that *did* produce one (an ADR follow-up, a residual, a filed brief) stays `✅ done`.
   Without this, the new value silently absorbs cases that already have an honest answer.
4. **The ship-loop arithmetic is correct.** `claude/skills/fkit-sprint-ship-loop/SKILL.md`'s Process
   review row no longer asserts *"five of the six"* against a seven-value set. Read the row and
   confirm the count it states matches the count the vocabulary now defines.
5. **`0338`'s R7 cell reads `deferred (→ 0341)`** and its accepted residual records itself closed by
   this task. Grep `0338`'s ledger for `blocked` and confirm no occurrence remains that refers to
   R7's disposition.
6. **Suite green, and the two guards that touch these files specifically.** Run **`npm run
   test:unit`** and confirm the total is **≥ 895 passing, 0 failing** (895/895 measured at HEAD
   `9943dcf` on 2026-09-11 — re-derive the baseline at pickup, do not hardcode this number).
   ⚠️ **`npm test` CHAINS into `prove-red.sh` and takes ~9 minutes** — use `test:unit` for the
   iteration loop and run the full `npm test` once before hand-off.
7. **Reference integrity is unchanged.** `node --test test/reference-integrity.test.js` reports
   **0 broken** links and **7 named-exempt** instances across 6 keys. ⛔ **Do not add a
   `NAMED_EXEMPT` entry** — the pin is 7 suppressed instances across 6 keys, and growing it to make
   this task pass is a defect, not a fix.
8. **`test/skill-frontmatter.test.js` and `test/dual-home-parity.test.js` stay green** — all three
   edited files are fkit-managed skills with a `.claude/` copy, so a canonical-source edit that
   forgets the parity contract reds here.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing

- ⭐ **Filed as ONE brief, deliberately.** The two vocabulary sites are **not independently
  shippable** — shipping either alone leaves the reviewer and the coder disagreeing about what is a
  legal value, which is a worse state than today. The ship-loop arithmetic goes stale on the same
  edit, and `0338`'s R7 cell is the change's only real consumer and its proof. Splitting would
  produce pieces that cannot be verified on their own.

- ⚠️ **`0341` is named in the new value's worked example and in `0338`'s R7 cell, but this task does
  NOT depend on `0341`.** The value records *where a finding went*; it does not require the successor
  to have shipped. ⛔ Do not add a dependency edge to `0341`.

- ⚠️ **Placement: Backlog board, UNRANKED, appended last** — ADR-035. Filed by a **spawned
  `fkit-producer` with no owner channel** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  executing the mechanics of a relayed owner ruling and deciding nothing beyond them. Nothing was
  renumbered and nothing was inserted mid-board.

- ⚠️ **On merit this would sit directly below `0381`**, because `0381` is the other live tax on the
  close path and both are small process-skill repairs that pay off on every subsequent close. ⛔ It is
  **not** ranked there: this is the unranked Backlog board, and ADR-035 forbids a mid-board insertion.
  The merit position is recorded here so the owner can act on it in one edit if they pull it into a
  sprint.

- ⚠️ **The recurrence count in this brief is ONE, and it contradicts the three this task was handed
  over with.** The measurement is in § *Context* above with the per-finding evidence. ⛔ **Not
  silently corrected — flagged**, because "this has bitten us three times" and "this has bitten us
  once, and twice more in a related-but-honest shape" are different arguments for doing the work. The
  owner may reasonably weigh a single clean recurrence differently. **The design need is unchanged
  either way:** `0338`'s R7 has no honest value in the six, and its accepted residual is already
  waiting on this.
