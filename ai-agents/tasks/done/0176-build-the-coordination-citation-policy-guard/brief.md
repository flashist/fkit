# Build the coordination-citation policy guard — literal reading, closed ledgers grandfathered

## ID
0176

## Sprint
Sprint 7

## Priority
P7

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> # ⚠️ DATED CORRECTION 2026-08-30 — THIS BRIEF IS FALSIFIED IN SEVEN PLACES. ⛔ DO NOT IMPLEMENT IT AS WRITTEN.
>
> ⛔ **VERIFICATION STEP 4 IS INVERTED AND WILL SHIP A GUARD THAT CONTRADICTS A SETTLED OWNER RULING.**
> It instructs you to assert that a citation planted in a `done/*/brief.md` or `done/*/worklog.md`
> **fails** the guard. Under the owner's ruling of **2026-08-29** those must **PASS**. Measured cost of
> building it as written: **49 real citations across 23 closed `done/` files go red**, and this brief's
> own rule is *"shipping it red is not an option"* — so the coder would be driven to edit 23 frozen
> closed records, the exact outcome the ruling exists to prevent. **The corrected assertion is written
> out in full in §"⭐ RE-SCOPED 2026-08-30" at the foot of this brief.**
>
> The other six, in the order they appear below:
>
> 1. ⛔ **OWNER RULING 2's closing paragraph is SUPERSEDED.** *"It names `done/*/review.md` only.
>    `done/*/brief.md` and `done/*/worklog.md` are NOT exempt"* **no longer holds.** Closed
>    `ai-agents/tasks/done/**` and `ai-agents/tasks/cancelled/**` are exempt **IN WHOLE** — `brief.md`,
>    `plan.md`, `worklog.md`, `review.md` alike. Owner ruling **2026-08-29**, option label verbatim
>    **"Widen to the whole closed folder (Rec)"**. ⭐ **Superseded by a LATER OWNER RULING, not reopened
>    by an agent.**
> 2. ⛔ **The `## Context` CONDITION blockquote's target list is too narrow.** It names
>    `ai-agents/tasks/*/*/brief.md`. The cited-document class now also includes **`plan.md`,
>    `worklog.md` and `review.md`**. Owner ruling **2026-08-30**, option label verbatim **"Not a
>    reopening — widen it (Rec)"**.
> 3. ⛔ **Every figure in §"The red set" is stale — `38 / 19`, `27 across 11`, and the headline
>    `11 across 8`** — and so is its list of 8 residual files. The settled figures are in
>    §"⭐ RE-SCOPED 2026-08-30".
> 4. ⛔ **Scoping decision 2's claim *"This convention changes the count by zero"* is FALSE.** Measured
>    2026-08-30: it moves the total by **8** (190 → 182). Small, but the brief states it twice as a
>    hard zero and tells you not to re-derive it.
> 5. ⛔ **The brief is SILENT on inline code spans, and that silence is a 30× trap.** Ruled: this half
>    does **NOT** skip them. Skipping them takes the total from **182 to 6** and the residual from
>    **19 to 1**.
> 6. ⛔ **Verification step 6's `git diff` check is too narrow** — it guards only
>    `ai-agents/tasks/done/*/review.md`. It must now guard all of `ai-agents/tasks/done/**` and
>    `ai-agents/tasks/cancelled/**`.
>
> ⛔ **All original text below is left byte-identical** as the record of what was written on 2026-08-01,
> 2026-08-06, 2026-08-15, 2026-08-24 and 2026-08-29. **Every falsified passage carries a
> `⚠️ DATED CORRECTION 2026-08-30` block at the end of its own section**, and the corrected build and
> verification instructions are in §"⭐ RE-SCOPED 2026-08-30" at the foot. ⛔ **Read that section before
> implementing.** ⭐ **No machine-parsed field was changed** — `## Sprint`, `## Priority`, `## Status`,
> `## Owner`, `Depends on:` and `Blocks:` were each re-checked on 2026-08-30 and are all still true.
>
> **Authority for this re-scope — four owner rulings, all live via `AskUserQuestion`:**
> **2026-08-29 "Accept — links in scope, citations exempt (Rec)"** (stated cost: *"contradicts three
> briefs"* — it turns out to be **four**, and this brief is the fourth, which escalation **E2** never
> named); **2026-08-29 "Widen to the whole closed folder (Rec)"**; **2026-08-30 "Not a reopening —
> widen it (Rec)"**; **2026-08-30 "Exempt them by name (Rec)"**. All four are recorded in full in
> [`the reference-integrity condition`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md),
> §3.1, §3.2, §5 and §8, which states these re-scopings *"are the producer's to make, not the
> architect's"*.

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

> ## ⚠️ DATED CORRECTION 2026-08-30 — `## Context` ABOVE IS FALSIFIED IN THREE PLACES.
>
> **Measured by the filing producer on 2026-08-30**, by extracting §4.2 of the condition document
> verbatim to a session scratchpad (never to the repo) and running it from the repo root against the
> live working tree. Condition document checksum at measurement: `fea9ce0a5b71acda7f3070e76d0f8ccc`.
>
> ### 1. ⛔ The CONDITION blockquote's target list is TOO NARROW
>
> §"The file and the condition" quotes §7.2's condition as matching
> *"`ai-agents/sprints/*.md`, `ai-agents/tasks/*/*/brief.md`, or `ai-agents/wiki-vault/log.md`"*.
> ⭐ **The cited-document class now also includes `plan.md`, `worklog.md` and `review.md`.**
>
> **Authority: the owner, 2026-08-30**, live `AskUserQuestion` in an `fkit lead` session on review
> round 1's finding R1. Option label verbatim: **"Not a reopening — widen it (Rec)"**.
>
> ⭐ **Why this is NOT a reopening of OWNER RULING 1, stated so nobody re-derives it backwards.** Ruling
> 1 settled **one axis only — literal full paths versus resolved shorthand** — and gave reproducibility
> as its reason. That reason is about *resolution*, not about *which filenames count*; the ruling never
> enumerated filenames. The added citations are **fully literal, fully `ai-agents/`-prefixed full paths
> followed by a colon and a line number** — squarely inside "literal full path". **OWNER RULING 1 is
> unchanged and is NOT reopened**, and the shorthand extension it refused is **still refused, by name.**
>
> ⚠️ **Why the gap existed:** this brief's condition was written before ADR-029 moved plans, worklogs
> and review ledgers inside the task folder, so the enumeration named the one file type that then lived
> there.
>
> ⛔ **Do not confuse the two prongs.** The **citing**-side scanned set was always `tasks/*/*/*.md` and
> already covered plans, worklogs and ledgers. What widened is the **cited (target)** side. Scoping
> decision 1 is **UNCHANGED**.
>
> ### 2. ⛔ OWNER RULING 2's closing paragraph is SUPERSEDED
>
> The paragraph reading *"What the exemption does NOT cover, so it is not discovered late: it names
> `done/*/review.md` only. `done/*/brief.md` and `done/*/worklog.md` are NOT exempt"* **no longer
> holds.**
>
> **Authority: the owner, 2026-08-29**, live `AskUserQuestion` in an `fkit lead` session at `0353`'s
> plan-approval gate. Option label verbatim: **"Widen to the whole closed folder (Rec)"**, presented as
> *"exempt closed `done/` and `cancelled/` folders entirely for the citation half … the ruling's intent
> was that closed records are frozen; naming only `review.md` was a 2026-08-01 approximation of that,
> made when the gap cost ~2 edits rather than 30."*
>
> ⭐ **A later OWNER ruling superseded an earlier one. No agent reopened anything.**
>
> **What is exempt now:** `ai-agents/tasks/done/**` and `ai-agents/tasks/cancelled/**`, **in whole** —
> `brief.md`, `plan.md`, `worklog.md`, `review.md` alike. `plan.md` is a file type the 2026-08-01
> ruling could not have contemplated, because ADR-029 had not yet moved plans inside task folders.
>
> ⭐ **What is UNCHANGED in OWNER RULING 2:** *"The exemption MUST be in the guard's definition from day
> one … it is part of the guard's definition."* Still binding. Only its **extent** widened.
>
> ⭐ **OWNER RULING 1 (the LITERAL full-path reading) is UNCHANGED and NOT reopened**, and so is its
> declared incompleteness: the guard still does not flag `0013`'s brief's bare shorthand, nor `0160`'s
> brief in three places. **Anyone reporting on this guard must still say so alongside its pass.**
>
> ### 3. ⛔ Every figure in §"The red set" is stale, and so is its list of 8 files
>
> | Measure | This brief (📅 2026-08-01) | ⭐ **Settled, re-measured 📅 2026-08-30** |
> |---|---|---|
> | Files scanned | *(not stated)* | **708** |
> | Citations, total | 38 across 19 files | **182 across 79 files** |
> | Exempt | 27 across 11 files | **163 across 65 files** |
> | **Residual red set** | **11 across 8 files** | ⭐ **19 across 14 files** |
>
> ⛔ **The 8-file residual list above is superseded in full.** The settled residual's **14** citing
> files are **13 open backlog briefs plus the live `ai-agents/sprints/backlog.md` board**. ⭐ **Not one
> residual citing site sits in a closed folder** — re-verified 2026-08-30, and that is the point of the
> 2026-08-29 ruling. The per-instance table is §6.1 of the condition document; ⛔ **it is `0237`'s work
> list, not this task's.**
>
> **Residual by the document each one cites:** 9 cite `ai-agents/tasks/done/**`, 5 cite
> `ai-agents/wiki-vault/log.md`, 3 cite `ai-agents/sprints/*.md`, 2 cite `ai-agents/tasks/backlog/**`.
>
> ⚠️ **The `## Notes` blockquote of 2026-08-06 says to take the figure from `0237`. That is now also
> out of date.** Take it from **§6.1 of the condition document** — not from this table, not from
> `0237`'s own `19 across 15`. ⭐ **The instance count coincides with `0237`'s 19; the FILE count does
> not (14 versus 15), so treat the match as suggestive, never as proof the two lists are identical.**
>
> ⛔ **These figures are a snapshot of a live tree, and the condition document was still under review
> (round 2) and actively changing when they were taken.** Re-run §4.2 yourself at this task's plan gate
> and report what you get; do not quote this table as current.

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

> ## ⚠️ DATED CORRECTION 2026-08-30 — `## What to build` ABOVE IS FALSIFIED IN TWO PLACES, AND IS SILENT ON A THIRD THAT MATTERS MORE
>
> ### A. ⛔ Scoping decision 2's *"changes the count by zero"* claim is FALSE
>
> Decision 2 states, twice and emphatically, *"⚠️ This convention changes the count by zero (38 either
> way, verified in the report and again at filing)"*, and adds *"do not blame the red set size on it."*
>
> ⭐ **Re-measured 2026-08-30: it moves the total by 8.**
>
> | Reading | Command | Total |
> |---|---|---|
> | ⭐ **Settled** — fenced blocks and blockquote lines skipped | `node coordination-citation.js` | **182 across 79** |
> | Nothing skipped | `FENCES=0 QUOTES=0 node coordination-citation.js` | **190 across 80** |
>
> ⚠️ **Seven of those eight are `0353`'s own review ledger quoting a finding inside a fenced block** —
> the self-measurement effect the condition document's §6 warns about, caught in the act. Excluding
> that ledger the convention still moves the total by **1**.
>
> ⭐ **The decision itself is UNCHANGED — adopt the convention.** What is falsified is only the *reason
> given for adopting it being free.* It is not free; it is cheap. ⛔ **And the brief's follow-on
> instruction stands: do NOT blame the red set size on it.** Eight is not nineteen.
>
> ⛔ **The fence-CLOSE rule was also wrong everywhere it had been written, and is corrected.** Per
> CommonMark, a **closing** fence carries **no info string**. Both of the condition document's maskers
> closed a block on any same-character fence run, so one nested opener carrying an info string ended the
> block early and masked live prose from there on. Corrected 2026-08-30. **Transcribe the corrected
> form from §4.2; do not re-derive it.**
>
> ### B. ⛔ THE BRIEF IS SILENT ON INLINE CODE SPANS, AND THAT SILENCE IS A 30× TRAP
>
> ⭐ **This is the single most dangerous omission in the brief, because a reasonable implementer will
> get it exactly backwards.** Decision 2 says "skip fenced blocks and blockquote lines" and says nothing
> about backticks. The link-half guard (`0354`) **does** skip inline code spans. An implementer
> reasoning by analogy from the sibling guard will skip them here too.
>
> ⛔ **RULED: this half does NOT skip inline code spans.** New ruling, delegated to `0353` by its own
> brief. Measured 2026-08-30:
>
> | Reading | Total | Residual |
> |---|---|---|
> | ⭐ **Settled — spans NOT skipped** | **182 across 79** | ⭐ **19 across 14** |
> | ⛔ Spans also skipped | ⛔ **6 across 5** | ⛔ **1 across 1** |
>
> **The reason, and it is the opposite of the link half's:** every coordinate in this repo is written
> **inside backticks**, because `durable-citation-anchors` is the house style for writing one. For the
> **link** half a target in backticks is displayed text, not a pointer offered to a reader → skip. For
> **this** half backticks are formatting, not quoting → **do not skip.** The divergence is deliberate,
> owner-consistent and recorded in §1 of the condition document.
>
> ### C. The three scoping decisions that are UNCHANGED, confirmed rather than assumed
>
> - **Decision 1 — the scanned set** `ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md`, **not**
>   widened to `knowledge-base/reports/`. ⭐ **UNCHANGED**, and reconfirmed by name: a report cites a
>   coordination document **as the specimen it is diagnosing**.
> - **Decision 3 — it is red today, and shipping it red is not an option.** ⭐ **UNCHANGED in
>   principle**; only the figure moved (11 across 8 → **19 across 14**).
> - **Decision 4 — the reading is LITERAL.** ⭐ **UNCHANGED and NOT reopened.** The shorthand extension
>   is **still refused, by name** — not folded in, not a flag, not behind an option.
>
> ### D. The open scanned-set question this brief carried is now ANSWERED
>
> The 2026-08-06 blockquote in `## Notes` says *"do not implement this guard against the glob as written
> without reading `0237`'s answer"* about whether the scanned set reaches `sprints/done/` and
> `sprints/reviews/`. ⭐ **`0353` answered it for this half, with both costs measured:**
>
> | Surface | Ruling for THIS half | Measured cost of the other choice |
> |---|---|---|
> | `ai-agents/sprints/done/**` | ⛔ **OUT** — a closed board's claims are frozen | **+4 residual** |
> | `ai-agents/sprints/reviews/**` | ⛔ **OUT** — same reason | **0** |
>
> ⚠️ **The link half was ruled the OTHER way on both** (both IN scope), because a rotted pointer is
> repairable and `fkit-task-done` mandates the repair. ⛔ **Do not import `0354`'s answer here.**
>
> ⭐ **Consequence for the dead `ai-agents/sprints/sprint-2.md` string** the 2026-08-15 note preserves:
> the board now lives at `ai-agents/sprints/done/sprint-2.md`, which this half's scanned set **does not
> reach**. The 2026-08-15 note's *"this changes nothing about the scoping question"* was true when
> written; **the question is now settled, and settled as OUT.**

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

> ## ⛔⛔ DATED CORRECTION 2026-08-30 — STEP 4 IS INVERTED. STEPS 2, 3, 6 AND 7 ARE FALSIFIED OR INCOMPLETE.
>
> # ⛔ STEP 4 IS INVERTED — READ THIS BEFORE YOU WRITE A LINE OF THE GUARD
>
> **Step 4 as written says:**
>
> > *"The exemption covers `done/*/review.md` **only**. Assert explicitly that a citation planted in a
> > `done/*/brief.md` or `done/*/worklog.md` **fails** the guard."*
>
> ⛔ **Both halves of that sentence are now FALSE, and building to it ships a guard that contradicts a
> settled owner ruling.** The exemption does **not** cover `review.md` only, and a citation planted in a
> `done/*/brief.md` or `done/*/worklog.md` must **PASS**, not fail.
>
> **Authority:** the owner, **2026-08-29**, live `AskUserQuestion`, option label verbatim
> **"Widen to the whole closed folder (Rec)"**. Recorded in full in the `## Context` correction block
> above and in §3.1 of the condition document.
>
> ### ⭐ THE CORRECTED ASSERTION — written out, to be transcribed, not paraphrased
>
> **Replace step 4 in its entirety with:**
>
> **4. The exemption covers `ai-agents/tasks/done/**` and `ai-agents/tasks/cancelled/**` IN WHOLE.**
> Assert explicitly, with a citation planted in a scratch file under each path, that **all** of the
> following **PASS** the guard (are exempt, not flagged):
>
> | Planted at | Must | Why |
> |---|---|---|
> | `ai-agents/tasks/done/<folder>/brief.md` | ⭐ **PASS** | Owner ruling 2026-08-29 — closed folder, exempt in whole |
> | `ai-agents/tasks/done/<folder>/worklog.md` | ⭐ **PASS** | Same |
> | `ai-agents/tasks/done/<folder>/plan.md` | ⭐ **PASS** | Same. ADR-029 moved plans into the task folder after the 2026-08-01 ruling |
> | `ai-agents/tasks/done/<folder>/review.md` | ⭐ **PASS** | Exempt under both the old and the new ruling |
> | `ai-agents/tasks/cancelled/<folder>/brief.md` | ⭐ **PASS** | Owner ruling 2026-08-29 names `cancelled/` alongside `done/` |
>
> **And assert that a citation planted in an OPEN file still FAILS** — that is what proves the
> exemption is an exemption and not a hole:
>
> | Planted at | Must | Why |
> |---|---|---|
> | `ai-agents/tasks/backlog/<folder>/brief.md` | ⛔ **FAIL** | Open board, not exempt |
> | `ai-agents/tasks/backlog/<folder>/worklog.md` | ⛔ **FAIL** | Open board; the citing-side scanned set was always `*.md` |
> | `ai-agents/sprints/<board>.md` | ⛔ **FAIL** | Live board, not exempt |
>
> ⭐ **Also assert the CITED (target) class**, which step 4 never tested and which widened on
> 2026-08-30: a citation **of** `ai-agents/tasks/<board>/<folder>/plan.md`, `worklog.md` or `review.md`
> — not only `brief.md` — written **from** an open file, must **FAIL**. Owner ruling 2026-08-30,
> **"Not a reopening — widen it (Rec)"**.
>
> ⛔ **Plant these in scratch fixtures, never by editing a real closed record.** Verification step 6,
> as corrected below, forbids the latter.
>
> ### ⛔ THE MEASURED COST OF BUILDING STEP 4 AS WRITTEN — why this is not a pedantic correction
>
> Measured 2026-08-30 by running §4.2 with `OLD_EXEMPT=1`, which reproduces exactly the 2026-08-01
> exemption shape step 4 mandates:
>
> | Exemption shape | Residual |
> |---|---|
> | ⭐ **Settled** — closed folders exempt in whole | ⭐ **19 across 14** |
> | ⛔ **Step 4's shape** — `done/*/review.md` only | ⛔ **68 across 37** |
>
> **The difference is 49 citations across 23 closed `done/` files** — **18 in `worklog.md`, 16 in
> `brief.md`, 15 in `plan.md`**, none in `cancelled/`. ⛔ **Every one of those 49 would go red**, and
> this brief's own scoping decision 3 says *"shipping it red is not an option."* **The coder would
> therefore be driven to edit 23 frozen closed records** — colliding with the frozen-ledger rule, and
> the exact outcome the 2026-08-29 ruling exists to prevent. ⭐ **That is why step 4 is loud rather than
> listed.**
>
> ---
>
> ### The other four steps
>
> **Step 2 — the baseline is wrong.** It says *"report it against the 11 / 8 above."* ⛔ **The baseline
> is `19 across 14`**, from §6.1 of the condition document, and that residual is **`0237`'s work list,
> not this task's**. The instruction to re-measure before starting is **UNCHANGED and still binding.**
>
> **Step 3 — the figure is wrong, the principle is right.** *"green on the 27 exempt citations"* → the
> exempt set is **163 citations across 65 files**. ⭐ **The requirement is UNCHANGED and is the more
> important half: the exemption must be in the guard's DEFINITION, not a post-filter bolted on**, and
> the guard must be green on all 163 **without any of them being edited.**
>
> **Step 6 — too narrow.** It checks `git diff --stat` shows no file under
> `ai-agents/tasks/done/*/review.md` modified. ⛔ **Widen it to: no file under `ai-agents/tasks/done/**`
> or `ai-agents/tasks/cancelled/**` modified.** The exemption widened; the do-not-touch guarantee must
> widen with it, or the check no longer covers what the ruling protects.
>
> **Step 7 — UNCHANGED and still mandatory, but no longer complete.** The named incompleteness (`0013`'s
> bare shorthand, `0160`'s brief in three places) stands exactly as written. ⭐ **Four further blind
> spots must now be disclosed alongside it** — see §"⭐ RE-SCOPED 2026-08-30" §4 at the foot.
>
> **Steps 1, 5 and 8 — UNCHANGED.** `test/prove-red.sh` was confirmed present on 2026-08-30.

## Notes

- **Depends on:** `0237` — hard. The residual citations must be clean before the guard goes green, and
  **shipping it red is not an option.**

  > **📅 DATED CORRECTION 2026-08-06 — the cleanup now has an owner.** This line previously read
  > *"nothing hard … the cleanup is not owned by any task today; flagged for the owner as either a
  > prerequisite task or in-scope work for this one."* **The owner ruled on 2026-08-06** via
  > `AskUserQuestion` in a live `fkit lead` session — verbatim **"File the cleanup as its own task."**
  > It is [`0237`](../../done/0237-clean-the-coordination-citation-residual-set-that-blocks-0176/brief.md), and
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
- **📌 DATED NOTE 2026-08-15 (`0306`) — the two `ai-agents/sprints/sprint-2.md` strings in this brief
  are DELIBERATELY LEFT DEAD.** `0306` swept dead board paths out of the open briefs and left both of
  this file's occurrences byte-identical, because each is a **frozen record of a measurement**, not a
  pointer for a reader to follow:
  - **§"The red set" residual list** — the 8 residual files as measured on **2026-08-01**, when the
    board genuinely was at that path. Re-pointing it would make the record say something the measurer
    did not measure. The blockquote above already flags it.
  - **The `0237` handback blockquote above** — a verbatim quotation, never edited to make it accurate.
  **Where the board actually is today: `ai-agents/sprints/done/sprint-2.md`.** Archived by the
  2026-08-06 Sprint 2 → Sprint 3 rollover; it still exists, at that path. ⚠️ **This changes nothing
  about the scoping question the blockquote raises** — whether this guard's scanned set should reach
  `sprints/done/` is still `0237`'s to settle, and is still unsettled.
- **📌 DATED NOTE 2026-08-24 — THREE KNOWN STALE `path:NNN` INSTANCES RECORDED HERE AS TEST CASES.**
  ⭐ **Owner-ruled**, live via `AskUserQuestion` in an `fkit lead` session driving
  `/fkit-sprint-ship-loop` and relayed to a spawned `fkit-producer` with no owner channel
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **The option label is the verbatim text: "Fold into 0176 (Recommended)"**, whose description reads
  *"0176 is the guard for exactly this citation-drift class and is already open. Adding three known
  instances to it costs nothing and gives its implementer real test cases."* Surfaced by `0327`'s
  Round-2 stateful review; **already wrong at `HEAD`, not broken by that diff.**

  ⛔ **RECORDED ONLY. This note re-scopes nothing** — `## What to build`, the two owner rulings, the
  four scoping decisions, `## Status`, `## Priority`, `## Sprint` and `## Owner` are all untouched.

  **All three re-verified firsthand by the filing producer, 2026-08-24** — each coordinate resolved
  against the file it points into, at `HEAD` and in the working tree. **All three are stale; none was
  found to be correct.**

  | Citing site (quoted, not `:NNN`) | What it claims | What is actually there |
  |---|---|---|
  | `test/structure-manifest.test.js`, header comment item **E** — *"marker recognition is `marker_lines`' contract (claude/fkit-claude-init.sh:374)"* | `fkit-claude-init.sh:374` defines/documents `marker_lines` | `:374` is inside the **rules-block budget** comment — at `HEAD`, *"marker/comment lines did not. So the wrapper costs cap budget…"*; in the working tree, a bare `#`. **Nothing to do with marker recognition.** |
  | `test/structure-manifest.test.js`, the prose-span assertion message — *"marker_lines exists to prevent (claude/fkit-claude-init.sh:366-372)"* | `:366-372` is the substring-match defect commentary | `:366-372` at `HEAD` is the **budget-target** comment (*"keep >= 400 B free…"*). **Wrong region.** |
  | `claude/skills/fkit-heal/check.sh`, hashing-pipeline step 2 — *"Marker recognition is marker_lines' contract (fkit-claude-init.sh:374)"* | same claim as row 1 | same as row 1. **Wrong region.** |

  ⭐ **The true target, for whoever repairs them — anchor on this, never on a number**
  ([durable-citation-anchors](../../../knowledge-base/conventions/durable-citation-anchors.md)): the
  `marker_lines()` definition (`awk -v m="$2" '{ l = $0; gsub(/^[ \t\r]+|[ \t\r]+$/, "", l); …`) and
  its comment block opening *"Line numbers where <marker> is the WHOLE line"* and containing *"This
  MUST NOT be a substring match."* At `HEAD` that sits near `:410-422` — ⚠️ **a dated coordinate,
  offered to locate the block once, not to be re-cited.**

  ⚠️⚠️ **A SCOPE MISMATCH THE IMPLEMENTER MUST NOT DISCOVER LATE — measured, and flagged rather than
  resolved.** These three are **citations INTO a source file** (`claude/fkit-claude-init.sh`), made
  **FROM** `test/` and `claude/skills/`. This guard's condition, as specified above, tests the
  **target** for being a **coordination document** (`ai-agents/sprints/*.md`, task briefs,
  `ai-agents/wiki-vault/log.md`), and its scanned set is `ai-agents/tasks/*/*/*.md` +
  `ai-agents/sprints/*.md`. ⛔ **On both counts — target class and citing-file scope — the guard as
  specified would NOT flag these three.** They are the **same drift class** (a `path:NNN` that no
  longer points at what it claims) but **not the same condition**. ⭐ **Take them as red-team fixtures
  and as evidence of reach, not as an instruction to widen the condition** — widening is a scoping
  decision this brief explicitly refuses to absorb, and `0237` already owns the open scanned-set
  question. **Put the widening question to the owner if one is present when this task runs.**
- **Blocks:** `0356`, `0357`, `0358` — hard. ⚠️ **Corrected in place 2026-08-29**; this line previously read `- **Blocks:** nothing.`, true from filing until Sprint 7 gated its three sweeps on this guard being green. ⛔ It is a machine-parsed field — `dashboard.sh` derives the board Next-step from it ([`dependency-declaration-form`](../../../knowledge-base/conventions/dependency-declaration-form.md)) — so a stale value is drift, not a record; the record of the change is in §"⭐ PULLED ONTO SPRINT 7 AS `P7`".
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

> ## ⚠️ DATED CORRECTION 2026-08-30 — TWO `## Notes` PASSAGES ARE OVERTAKEN. ⭐ NO MACHINE-PARSED FIELD CHANGED.
>
> ### 1. The 2026-08-06 blockquote's *"take the figure from `0237`"* is itself out of date
>
> That blockquote correctly retired §"The red set"'s `11 across 8` and pointed at `0237`. ⭐ **It is now
> one hop short.** The authority is **§6.1 of the condition document** — **19 across 14** — and
> explicitly **not** `0237`'s own `19 across 15`. ⚠️ **The instance count coincides; the FILE count does
> not (14 versus 15).** Treat the match as suggestive, never as proof the two lists are identical.
>
> The same blockquote's **second** item — the moved-scanned-set question — is **ANSWERED**; see
> §"⚠️ DATED CORRECTION 2026-08-30" item **D** at the end of `## What to build`. The 2026-08-15 note's
> *"still `0237`'s to settle, and still unsettled"* is **discharged**: `0353` settled it, and settled it
> as **OUT** for this half.
>
> ### 2. The 2026-08-24 three-stale-citations note is CONFIRMED — and its gap is far larger than it says
>
> ⭐ **That note's own conclusion holds and is reconfirmed:** the three known-stale citations cite a
> **source file** from **`test/` and `claude/skills/`, and this guard as specified would NOT flag them**
> — they fail the *target* prong (a source file is not a coordination document) and the citing-file
> prong alike. ⛔ **The refusal to widen is UNCHANGED.** They remain red-team fixtures, not an
> instruction to widen the condition.
>
> ⚠️ **What the note does NOT say, measured 2026-08-30 and stated here so it is not discovered late:**
> the note costs the gap at **three**. That is only one of **two** prongs.
>
> | Prong | What is invisible to this guard | Measured cost |
> |---|---|---|
> | **A** — citing sites outside the scanned set | The three known-stale citations in `test/` and `claude/skills/` | **3** |
> | ⭐ **B** — source-file **targets** cited from INSIDE the scanned set | Every `claude/…` or `test/…` coordinate written in a scanned, non-exempt file. The target prong admits only a coordination document, so all of them are invisible | ⭐ **250 instances across 46 files** |
>
> **Largest contributors to prong B:** `ai-agents/sprints/backlog.md` (44), `0232`'s brief (37),
> `0197`'s brief (13). ⚠️ **Two honest qualifications, carried rather than dropped:** (a) that counts
> source-file *coordinates*, **not verified stale ones** — an unknown fraction are still accurate;
> (b) the figure is matcher-dependent — review round 1 measured **216 across 42** for the same question
> with a different regex. **Both refute "three"; neither is a stale-citation count.**
>
> ⭐ **This changes nothing about scope.** It changes what verification step 7 must **disclose**. The
> note's *"put the widening question to the owner if one is present when this task runs"* is **still
> live, and now carries a real number to put to them.**
>
> ### 3. ⭐ Every machine-parsed field was re-checked on 2026-08-30 and NONE was changed
>
> | Field | Value | Verdict |
> |---|---|---|
> | `## Sprint` | `Sprint 7` | ✅ still true |
> | `## Priority` | `P7` | ✅ still true |
> | `## Status` | `🔲 Backlog` | ✅ still true — the task has not started |
> | `## Owner` | `fkit-coder` | ✅ still true |
> | `Depends on:` | `0237` — hard | ✅ still true. `0237` in turn depends on `0353` |
> | `Blocks:` | `0356`, `0357`, `0358` — hard | ✅ still true |
>
> ⛔ **This re-scope is pure append. It changed no status, no rank, no board membership, and moved no
> file.** The remaining `## Notes` bullets — the `0175` separation judgement, the two-rulings-and-four-
> decisions density note, and the superseded rank-154 flag — were read and are **unaffected**.

### ⭐ PULLED ONTO SPRINT 7 AS `P7` — OWNER RULING 2026-08-29

**Owner ruling, 2026-08-29, given live via `AskUserQuestion` in a `fkit lead` session. The option
label is the verbatim text: "Approve all 12 as proposed (Rec)"** — the full twelve-row Sprint 7
board, on which this task is **`P7`**. Ranking authority is the same day's companion ruling,
**"Rank Sprint 7; declare backlog an archive (Rec)"**.

**The three mandatory edits of a pull, all applied in this act:**

1. The row was added to [`sprint-7.md`](../../../sprints/sprint-7.md) with the rank token `P7`.
2. The [`backlog.md`](../../../sprints/backlog.md) row was flipped to
   `➡️ Moved to [Sprint 7](sprint-7.md) — priority P7`. ⛔ **Not deleted.**
3. This brief's **`## Sprint` is now `Sprint 7`** and **`## Priority` is now `P7`**.
   **`## Status` is unchanged at `🔲 Backlog`** — the task has not started.

⚠️ **THE `## Notes` BULLET BELOW READING *"Rank 154 is APPEND rank … Flagged for owner confirmation"*
IS SUPERSEDED AND ITS FLAG IS DISCHARGED.** That rank was an append position on the **Backlog board**,
assigned by a spawned producer with no owner channel, and it was correctly flagged for confirmation.
⭐ **`P7` is not that number and does not inherit its provenance:** it is a rank on **Sprint 7**, at a
position the **owner approved by name**. ⛔ The old bullet is left byte-identical as the record of the
filing decision; **it is not a live flag any more.**

⛔ **THE HARD DEPENDENCY IS UNCHANGED AND IS NOW ON THE CRITICAL PATH.** `0237` (`P6`) must land before
this guard can go green — *"shipping it red is not an option"* is this brief's own words and the
owner's ruling behind it stands. **`0237` in turn now depends on
[`0353`](../../done/0353-settle-the-reference-integrity-condition-once-for-both-halves/brief.md) (`P3`)**,
which settles the scanned set, the exemption set and the match rule **once**, for both the `path:NNN`
half and the markdown-link half.

⭐ **WHAT `0353` DISCHARGES FOR THIS BRIEF — read it before implementing.** The `0237` handback
blockquote in `## Notes` raises two open items and `0353` answers the second one by name:

- **The scanned-set question** — *"Whether the guard's scanned set should reach `sprints/done/` and
  `sprints/reviews/` is an open scoping decision `0237` is tasked with settling; do not implement this
  guard against the glob as written without reading `0237`'s answer."* ⭐ **That answer is now
  `0353`'s deliverable.** Read `0353`'s condition document, not this brief's glob.
- **The figure** — take it from the re-measurement, never from §"The red set"'s frozen 2026-08-01 table.

⛔ **WHAT `0353` DOES NOT TOUCH, stated so it is not assumed away:** this brief's **two owner rulings**
(the literal full-path reading; the closed-`done/*/review.md` exemption, both 2026-08-01) and its
**four scoping decisions** are **unchanged**. `0353` is instructed to **reconcile against them, never
to re-decide them**, and to publish a reconciliation table saying for each: unchanged / narrowed /
widened / answered. ⛔ **If `0353`'s document silently changes one of them, stop and surface it.**

⚠️ **THIS GUARD IS NOW A GATE ON THREE OTHER ROWS.** `0356`, `0357` and `0358` — Sprint 7's three
sweeps — may not start until **this guard AND `0354`'s `test/reference-integrity.test.js` are both
green.** That is the owner-agreed *"verified, not trusted"* constraint; see
[`sprint-7.md`](../../../sprints/sprint-7.md) §"⛔ THE FORCED SEQUENCING". ⭐ **The accepted
incompleteness this brief already declares is unchanged by that promotion** — the guard still does not
flag `0013`'s bare `sprint-2.md:354` nor `0160`'s brief in three places, and **anyone reporting on it
must still say so alongside its pass.** ⛔ Being a gate does not make it complete.

*Recorded 2026-08-29 by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of a relayed ruling and deciding nothing beyond them.*

---

## ⭐ RE-SCOPED 2026-08-30 — WHAT TO BUILD, CORRECTED

**Authority — four owner rulings, all given live via `AskUserQuestion` in an `fkit lead` session:**

| Date | Option label, verbatim | What it settled for this brief |
|---|---|---|
| **2026-08-29** | **"Accept — links in scope, citations exempt (Rec)"** | The ruling whose stated cost was *"contradicts three briefs"*. ⭐ **It is four. This brief is the fourth**, which escalation **E2** of the condition document never named |
| **2026-08-29** | **"Widen to the whole closed folder (Rec)"** | Closed `tasks/done/**` and `tasks/cancelled/**` exempt **in whole**. ⛔ **Supersedes OWNER RULING 2's `review.md`-only extent** |
| **2026-08-30** | **"Not a reopening — widen it (Rec)"** | The **cited** class gains `plan.md` / `worklog.md` / `review.md` |
| **2026-08-30** | **"Exempt them by name (Rec)"** | Applies to the **link** half (`0354`) only. Recorded here so it is not mistaken for a change to this half |

All four are recorded in full in
[`2026-08-29-the-reference-integrity-condition.md`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md),
§3.1, §3.2, §5 and §8, which states that these re-scopings *"are the producer's to make, not the
architect's."*

**This section governs where it disagrees with anything above it.**

### 1. ⛔ The condition is a SCRIPT to TRANSCRIBE, not prose to re-derive

Transcribe **§4.2** of the condition document into `test/coordination-citation-policy.test.js`. It is a
self-contained Node script — no dependencies beyond builtins, consistent with ADR-014 and with this
brief's own no-new-devDependency rule. §4.2's own header comment says it by name: *"`0176`'s implementer
should TRANSCRIBE this."*

⛔ **Do not paraphrase it into a fresh regex.** The measured reason: across **seven** independent
implementations of the same prose sentence, this repo's figures ranged wildly, and **`0176`
(11 across 8), `0237` (19 across 15) and `0353` (42 across 22) all disagreed about one sentence.**
**The script is the specification.**

⚠️ **The condition document was still under review (round 2) on 2026-08-30 and §4.2 may change.**
⛔ **Re-read §4.2 on the day you transcribe it, and say in the worklog which revision you took.**
Its checksum when this re-scope was written: `fea9ce0a5b71acda7f3070e76d0f8ccc`.

### 2. ⛔ The exemption model, corrected

| Surface | Ruling for THIS half | Authority |
|---|---|---|
| `ai-agents/tasks/done/**` | ⭐ **EXEMPT IN WHOLE** — `brief.md`, `plan.md`, `worklog.md`, `review.md` alike | Owner, 2026-08-29 |
| `ai-agents/tasks/cancelled/**` | ⭐ **EXEMPT IN WHOLE** | Owner, 2026-08-29 |
| `ai-agents/tasks/backlog/**` | **NOT exempt** | Open board |
| `ai-agents/sprints/*.md` | **NOT exempt** | Live boards |
| `ai-agents/sprints/done/**`, `ai-agents/sprints/reviews/**` | ⛔ **OUT of the scanned set entirely** — never walked | A closed board's claims are frozen. Measured cost of including them: **+4** and **0** |
| `ai-agents/knowledge-base/reports/**` | ⛔ **OUT of the scanned set** | Scoping decision 1, **UNCHANGED** — a report cites a coordination document **as the specimen it is diagnosing** |
| `claude/`, `test/` | ⛔ **OUT of the scanned set** | Scoping decision, **UNCHANGED**. See `## Notes`' correction on the two-prong gap this leaves |

⛔ **The exemption must be in the guard's DEFINITION, not a post-filter bolted on** — OWNER RULING 2's
requirement, unchanged, and verification step 3 proves it.

### 3. ⛔ The match rule, corrected — three prongs, one of which is new

1. **The reading is LITERAL** — a full `ai-agents/`-prefixed path followed immediately by a colon and
   digits. ⭐ **OWNER RULING 1, UNCHANGED and NOT reopened.** Resolved shorthand stays **refused, by
   name**: not folded in, not a flag, not behind an option.
2. ⭐ **The cited (target) class is WIDER than `## Context` says:** `ai-agents/sprints/<name>.md`;
   `ai-agents/tasks/<board>/<folder>/` **`brief.md` · `plan.md` · `worklog.md` · `review.md`**;
   `ai-agents/wiki-vault/log.md`. Owner, 2026-08-30.
3. ⭐ **A LEFT BOUNDARY is required**, so a suffix of a longer token is not a hit. Added 2026-08-30;
   measured cost **0**. §4.2 carries it — transcribe it.

**Masking:** skip fenced blocks and blockquote lines (scoping decision 2, unchanged), on **CommonMark's**
fence-close rule — a *closing* fence carries **no info string**. ⛔ **Do NOT skip inline code spans.**

### 4. What the guard must disclose alongside its pass — verification step 7, extended

Step 7's named incompleteness stands **exactly as written** and is still mandatory: the guard does not
flag `0013`'s brief's bare shorthand, nor `0160`'s brief in three places. ⛔ **A close report that
presents this guard as complete has failed verification. Being a gate on `0356`, `0357` and `0358` does
not make it complete.**

⭐ **Four further blind spots must now be disclosed with it, each with its measured cost:**

| # | Blind spot | Measured cost |
|---|---|---|
| 1 | **Citing sites outside the scanned set** — the three known-stale citations in `test/` and `claude/skills/` | **3** |
| 2 | ⭐ **Source-file *targets* cited from inside the scanned set** — invisible, because the target prong admits only a coordination document | ⭐ **250 across 46** *(matcher-dependent: 216 across 42 by a second regex; counts coordinates, not verified-stale ones)* |
| 3 | **No right-hand file-name closure; permissive folder-segment class** — a malformed coordinate in prose could match | **0 today** |
| 4 | ⭐ **No elision rule.** Half A skips a target containing `…`; this half has **none**, so an elided coordinate counts as a hit. ⛔ **Ruled: elided targets COUNT for this half** — the divergence from Half A is deliberate, not an accident of two scripts | **1, arguably 2** — both inside the 19 |

⛔ **Report the red run, not only the green one** (step 5, unchanged), and **re-measure the residual at
this task's plan gate** rather than quoting any figure in this brief.

### 5. ⭐ Does this guard overlap or conflict with `0354`'s? — ANSWERED: NO, on both counts

**This was a scoping question, not a design question, and the condition document already answers it by
name. It is answered here rather than escalated.**

⭐ **`0176` SHOULD transcribe §4.2 exactly the way `0354` transcribes §4.1.** §4 of the condition
document instructs both, in one sentence: *"`0354` transcribes Half A into
`test/reference-integrity.test.js`; `0176` transcribes Half B into
`test/coordination-citation-policy.test.js`."* ⭐ **This remains a separate, narrower guard, in its own
file.** It is not merged into `0354`, and `0354` does not subsume it.

**Why they cannot conflict — five axes, each ruled in opposite directions on purpose:**

| Axis | `0354` — link half | ⭐ **`0176` — citation half** |
|---|---|---|
| **What it matches** | a markdown inline link `[label](target)` whose target does not exist | a bare `path` + line-number string naming a coordination document |
| **Scanned set** | `ai-agents/**/*.md` — **819 files** | `ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md` — **708 files** |
| **Closed task folders** | ⭐ **IN scope** — a rotted pointer is repairable, and `fkit-task-done` mandates the repair | ⛔ **EXEMPT** — a closed record's claims are frozen |
| **Inline code spans** | **skipped** | ⛔ **NOT skipped** |
| **Red set on arrival** | **0 broken, 6 named-exempt** — green | ⛔ **19 across 14** — red until `0237` lands |

**Measured overlap: ZERO.** Re-verified 2026-08-30 two ways: (a) the two guards' finding sets are
disjoint — `0354`'s is empty; (b) the only construct that could be caught by **both** is a `path` +
line-number coordinate written **inside a markdown link target**, which the link half would fail to
resolve and this half would match. ⭐ **A scan of all of `ai-agents/` for that shape returns 0
instances.**

⚠️ **The one axis where the two guards genuinely touch, flagged rather than resolved.** §4.1 and §4.2
contain a **byte-identical 13-line `maskFencesAndQuotes` function**. Both scripts are specified
"self-contained, no dependencies", and both had the same fence-close bug and were corrected together —
⛔ **evidence that the duplication can drift, which is the exact failure mode §2 C2 diagnoses.**
⭐ **Recommendation: transcribe each guard self-contained as the document specifies, ship them, and
raise the shared-helper question as a follow-up** — not as a coupling between two Sprint 7 rows on the
critical path. **Whether to factor it out later is a code-organisation call for the coder and the
architect; it needs no owner ruling and it does not block this task.**

### 6. ⛔ What this re-scope did NOT do

- ⛔ **No original prose was edited.** Every byte written before 2026-08-30 is unchanged. This is a
  **pure append** — six dated blocks and this section.
- ⛔ **No machine-parsed field was corrected in place**, because on re-check **none was false**. See the
  `## Notes` correction block's table.
- ⛔ **No status, rank or board membership changed. No file was moved and no mover was run.**
- ⛔ **The condition document was read, never edited.** Neither were `0353`'s folder, `sprint-7.md`, or
  the `0354` / `0355` / `0237` briefs re-scoped earlier under the same authority.

*Recorded 2026-08-30 by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of four relayed owner rulings. ⭐ **Every figure above was measured firsthand by
this producer on 2026-08-30**, by extracting §4.2 verbatim to a session scratchpad and running it from
the repo root — none is inherited from a summary. **All are snapshots of a live tree and must be
re-measured at this task's plan gate.***
