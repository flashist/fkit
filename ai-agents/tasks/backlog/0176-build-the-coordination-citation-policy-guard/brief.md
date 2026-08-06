# Build the coordination-citation policy guard — literal reading, closed ledgers grandfathered

## ID
0176

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### What this guards

Task `0160`'s ruling —
[the 2026-08-01 durable-citation report](../../../knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md),
§1's table — rules `path:NNN` **wrong, categorically**, when the target is a **coordination document**
others append to: `ai-agents/sprints/*.md`, task briefs, `ai-agents/wiki-vault/log.md`. The reason is
mechanical, not stylistic — *"third parties append **above** your line for reasons unrelated to your
sentence; the file grows under you."*

**That rule is syntactic, and a syntactic rule is exactly what a test checks.** This is **follow-up 8**
of report §8, added after round-1 review found §7.2 had wrongly given case 2 away as unenforceable in
full.

Report §7.2 is precise about which half is which:

- **Unenforceable, and still true:** *"No check can verify that line N still says what the citer
  meant"* — the actual failure mode. For that half, **nothing can enforce this.**
- **Enforceable, and wrongly given away:** §3.3's recommendation is **syntactic** — *"stop using
  `path:NNN` for coordination documents"*. Same shape as case 1, already enforced by
  `test/dashboard-contract.test.js`. **A guard of this shape would have caught the original 11-pointer
  incident at the commit that introduced it.**

### The file and the condition

**File:** `test/coordination-citation-policy.test.js` — a new file picked up by `npm test`'s existing
`node --test test/*.test.js` glob. **No new devDependency**, consistent with ADR-014.

**Condition**, from §7.2:

> *No line in the scanned set contains a citation `<path>:<NNN>` whose `<path>` names a coordination
> document* — that is, matches `ai-agents/sprints/*.md`, `ai-agents/tasks/*/*/brief.md`, or
> `ai-agents/wiki-vault/log.md`.

### 🔒 OWNER RULING 1, 2026-08-01 — the guard ships on the LITERAL full-path reading

> **Decision 4 of §7.2's four is ruled: the guard's shipping condition is specified on the LITERAL
> full-path form.** Any extension to resolved shorthand (bare `sprint-2.md:354`, `0159/brief.md:13`)
> is **filed as its own explicitly named decision, with its own measured cost.** It is **not** folded
> into this guard and **not** folded into decision 2.
>
> **Why: literal is the only reproducible reading.** Run independently, the reviewer, Codex and the
> report's author all land on the same literal figures — **38 citations / 19 files**, **27 of them**
> inside closed `done/*/review.md`. The shorthand reading did **not** reproduce across those same
> runs: published **391 / 53**, Codex **399 / 53**, reviewer **296–318 / 46–48**. **A test's
> acceptance criterion must be reproducible**, and a figure that moves by ~30% depending on whose
> pattern resolves the shorthand cannot be one.

> ### ⚠️ The cost the owner accepted — say it plainly, and never let "literal" read as "complete"
>
> **The guard is knowingly incomplete on day one.** The literal condition **misses §7.2's own lead
> specimen** — `0013`'s brief writes ``[`sprint-2.md:354`](../../../sprints/done/sprint-2.md)``, where the
> visible label is bare shorthand that does not match `ai-agents/sprints/*.md` — and it misses
> `0160`'s own brief the same way, in **three** places. **Those violations are real and the shipped
> guard will not flag them.**
>
> That is the accepted trade: a guard that is **reproducible and green-able now**, over a guard that
> catches more and cannot be agreed on. **Anyone reporting on this guard must state its incompleteness
> alongside its pass.**

### 🔒 OWNER RULING 2 (R18), 2026-08-01 — the closed ledgers are grandfathered, BY NAME

> Cleaning the 27 citations inside closed `done/*/review.md` ledgers would mean editing **frozen
> historical ledgers** — colliding head-on with the frozen-ledger rule report §4.3 engages by name and
> with ADR-034. **The owner ruled: this policy applies going forward only. Citations already inside
> closed `done/*/review.md` ledgers are exempted by name.**
>
> **The exemption MUST be in the guard's definition from day one, or the guard is red on historical
> files the ruling has decided will never be cleaned. It is not an optimization to add later; it is
> part of the guard's definition.**
>
> **What the exemption does NOT cover, so it is not discovered late: it names `done/*/review.md` only.
> `done/*/brief.md` and `done/*/worklog.md` are NOT exempt.**

**Provenance for both rulings:** the owner, 2026-08-01, via `AskUserQuestion` in the live
`/fkit-sprint-ship-loop` driver session.

### The red set — re-measured at filing, as §7.2 requires

Report §7.2 carries a **📅 as-of date that is load-bearing (R30)**, and instructs: *"Whoever files
follow-up 8 must re-measure at filing time rather than quoting this number"* — because the scanned set
contains task `0160`'s own then-growing ledger, and the elided and shorthand readings had already
drifted while the report was being written.

**Re-measured 2026-08-01 at filing, by running §7.2's own condition over §7.2's own defensible-core
scanned set (`ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md`):**

| Measure | Report (📅 2026-08-01) | **Re-measured at filing (📅 2026-08-01)** |
|---|---|---|
| Literal citations, total | 38 | **38** |
| Files, total | 19 | **19** |
| Exempt — inside closed `done/*/review.md` | 27 across 11 files | **27 across 11 files** |
| **Residual red set** | **11 across 8 files** | **11 across 8 files** |

**It reproduces exactly.** The 8 residual files, listed so the cleanup is not re-derived:

- `ai-agents/sprints/sprint-2.md`
- `ai-agents/tasks/backlog/0149-…/brief.md`, `0154-…/brief.md`, `0158-…/brief.md`,
  `0165-…/brief.md`, `0166-…/brief.md`
- `ai-agents/tasks/done/0092-…/brief.md`, `ai-agents/tasks/done/0160-…/brief.md`

**Note the drift source the report flagged has closed:** `0160`'s ledger has moved into
`done/*/review.md` and is now **inside the exemption**, so it can no longer move the total. `0160`'s
**brief** remains in the residual — it is a `done/` brief, and briefs are not exempt.

**These figures are still a snapshot. Re-measure again at implementation time.**

## What to build

A hand-rolled `node --test` guard, `test/coordination-citation-policy.test.js`, asserting the
condition above over the scanned set, **with the closed-ledger exemption built in from the start.**

### The four scoping decisions §7.2 names — all four must be made and stated

1. **The scanned set.** `ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md` is *"the defensible
   core"*. **⚠️ Do not widen to `ai-agents/knowledge-base/reports/`** — it would fail on `0160`'s own
   report, which cites a coordination document **as the specimen it is diagnosing**.
2. **A quotation is not a citation, and a regex cannot tell them apart.** The report's §5.3 quotes
   `log.md`'s defective lines verbatim *as evidence*; `0148`'s ledger quotes a wiki flag verbatim. The
   guard needs a **stated convention** — the workable one is **skip fenced blocks and blockquote
   lines** — *"or it punishes the reports that document the defect."*
   **⚠️ This convention changes the count by zero** (38 either way, verified in the report and again at
   filing). Adopt it for correctness of meaning, not to move the number, and **do not blame the red
   set size on it** — §7.2 corrected exactly that error twice (R27).
3. **It is red today**, and the size is set by decision 4, not decision 2. **Shipping it red is not an
   option** — the 11-citation residual above must be cleaned before it goes green.
4. **The reading.** **Ruled: literal.** See owner ruling 1.

### The separate decision this task must NOT absorb

**The shorthand extension is filed as its own explicitly named decision, with its own measured cost.**
Do not fold it in, do not add it as a flag, do not implement it "behind an option". If this task's
work makes the case for it, **name it as a follow-up** — the producer files it.

### Out of scope

- **⛔ Do not clean the 27 exempt citations.** They sit in frozen ledgers the owner has ruled will
  never be cleaned. Editing them collides with report §4.3 and ADR-034.
- **⛔ Do not clean `ai-agents/wiki-vault/`.** The condition tests the **target**, not the citing file,
  so vault scope is irrelevant to the guard — but any cleanup *inside* the vault is the `fkit-wiki`
  role's exclusively.
- **⛔ Do not add a new devDependency.** ADR-014.
- **⛔ Do not read or assert on `SKILL.md` content.** Different walk, different claimants.
- **⛔ Write no `:NNN` line-number citations** in this task's artifacts — a guard against the form must
  not ship carrying it.

## Verification steps

1. `test/coordination-citation-policy.test.js` exists and is picked up by `npm test` with **no**
   change to `package.json`.
2. **Re-measure the literal red set before starting** and report it against the 11 / 8 above. If it
   has moved, say by how much and why — do not quote this brief's number as current.
3. The exemption is in the guard's **definition**, not a post-filter bolted on. Prove it: the guard
   must be green on the 27 exempt citations **without any of them being edited**.
4. The exemption covers `done/*/review.md` **only**. Assert explicitly that a citation planted in a
   `done/*/brief.md` or `done/*/worklog.md` **fails** the guard.
5. `npm test` passes, including `test/prove-red.sh`'s hard gate, and the guard's mutation makes it
   fail. Report the red run, not only the green one.
6. `git diff --stat` shows no file under `ai-agents/tasks/done/*/review.md` modified.
7. **State the guard's known incompleteness in the close report, by name:** it does not flag `0013`'s
   brief's bare `sprint-2.md:354`, nor `0160`'s brief in three places. **A close report that presents
   this guard as complete has failed verification.**
8. Confirm the shorthand extension was **named, not implemented.**

## Notes

- **Depends on:** `0237` — hard. The residual citations must be clean before the guard goes green, and
  **shipping it red is not an option.**

  > **📅 DATED CORRECTION 2026-08-06 — the cleanup now has an owner.** This line previously read
  > *"nothing hard … the cleanup is not owned by any task today; flagged for the owner as either a
  > prerequisite task or in-scope work for this one."* **The owner ruled on 2026-08-06** via
  > `AskUserQuestion` in a live `fkit lead` session — verbatim **"File the cleanup as its own task."**
  > It is [`0237`](../0237-clean-the-coordination-citation-residual-set-that-blocks-0176/brief.md), and
  > it is a **hard** dependency: until it lands, this task is unshippable and the board was advertising
  > it as pullable.
  >
  > **⚠️ Two things `0237` will hand back, both of which change this brief's numbers:**
  > 1. **The `11 across 8` figure did not reproduce on 2026-08-06.** A re-measurement at `0237`'s
  >    filing returned **19 across 15** under a broader condition. Neither reading is endorsed here —
  >    `0237` settles the exact condition and reports it. **Take the figure from `0237`, not from the
  >    §"The red set" table above**, which is left byte-identical as the record of what was measured
  >    on 2026-08-01.
  > 2. **⚠️ THE SCANNED SET MOVED.** This brief's scanned set is `ai-agents/tasks/*/*/*.md` **+
  >    `ai-agents/sprints/*.md`**, and its residual list names `ai-agents/sprints/sprint-2.md` — a path
  >    that **no longer exists.** The Sprint 2 → Sprint 3 rollover of 2026-08-06 archived that board to
  >    `ai-agents/sprints/done/sprint-2.md`, **outside the `sprints/*.md` glob.** Whether the guard's
  >    scanned set should reach `sprints/done/` and `sprints/reviews/` is an **open scoping decision**
  >    `0237` is tasked with settling; **do not implement this guard against the glob as written
  >    without reading `0237`'s answer.** This is the same defect class already flagged against
  >    `0182`'s glob by the same rollover.
  >
  > The task's decision, its two owner rulings and its four scoping decisions are otherwise unaffected.
- **Blocks:** nothing.
- **🔗 Kept SEPARATE from task `0175` (follow-up 7) — a producer judgement.** Report §8 left it open:
  *"Whoever files them should consider one task with two conditions rather than two tasks — noted as a
  producer judgement, not a ruling."* **Decision: two tasks.** The full reasoning is recorded in
  `0175`'s `## Notes`; in short — merging takes the **union** of two unrelated preconditions (`0175`
  waits on `0168`, this waits on a citation cleanup), the two carry **different owner rulings** and so
  cannot honestly share one priority, and they assert **different conditions over different scanned
  sets**. The accepted tradeoff is two test files instead of one.
- **This task carries TWO owner rulings and four scoping decisions.** That density is itself part of
  why it is not merged with `0175`, which carries one ruling and is filed LOW.
- **Rank 154 is APPEND rank**, assigned under `/fkit-task-brief` step 5 by a spawned producer with no
  owner channel. **Flagged for owner confirmation.** On merit it belongs adjacent to `0175`, its pair
  — **so merit and append positions coincide.** No existing row was renumbered by this brief.
