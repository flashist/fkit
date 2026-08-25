# Worklog — `0223` Enumerate the Process-review row's method steps, and give the row its reason

**Role:** `fkit-coder` (Build worker, spawned by `fkit-sprint-ship-loop`)
**Date:** 2026-08-24 · **Tree at:** HEAD `c45ec3d` (unchanged; nothing committed)
**Plan:** `plan.md` in this folder — verified against disk before any edit:
`git hash-object` = `3dba383353baa9131515930d12ade055ac0a1bc8`, `wc -c` = `29987`. Both matched the
declared-approval marker exactly.

---

## Change surface

**One file, one line, one physical line changed.**

```
$ git diff --numstat -- claude/skills/fkit-sprint-ship-loop/SKILL.md
1	1	claude/skills/fkit-sprint-ship-loop/SKILL.md
```

`claude/skills/fkit-sprint-ship-loop/SKILL.md:126` — the §2 step table's **Process review** row.
Two of its four cells changed:

- **Cell 2 (*Driver spawns*)** — the ADR-038 reason clause appended after `` `@fkit-coder` ``: the role is
  fixed by the skill the step runs, on both of ADR-038's grounds (the coder-owned *Coder response*
  section, and Step 6's source-write at `fkit-process-stateful-review/SKILL.md:195`).
- **Cell 3 (*Worker does*)** — the opening gloss (*"verify each finding, classify defect/frontier, write
  the Coder response"*) replaced by the enumerated method: the `0195` subset-warning plus all nine steps
  **0, 1, 2, 3, 3.5, 4, 5, 6, 7**, and the *"never edit the Reviewer findings section"* rule. The
  autonomy / worklog / `NEEDS-DECISION` clauses that follow are **byte-identical** except for OQ-1's
  bridge (below) — deliberately, so `0224`'s future diff on this line stays legible.

Cells 1 (*Step*) and 4 (*Owner gate*) unchanged. Row is now 3000 bytes, still 5 pipes / 4 cells.

## Owner rulings applied

| Q | Ruling | Applied as |
|---|---|---|
| Plan | Approved on OQ-1(A) + OQ-2(A) | as written |
| **OQ-1** | **(A) INCLUDE the `✅ done` bridge** | appended to the autonomy clause: *"— **under that standing approval an authorized fix lands at Status `✅ done` in the same round**"*, in the owner's verbatim wording |
| **OQ-2** | **(A) reason clause in cell 2, *Driver spawns*** | as written |

**Both accepted costs stand and were not "fixed":** OQ-1(A)'s one inch of scope beyond
enumerate-the-steps, and OQ-2(A)'s ragged cell-2 column relative to the other five rows (which hold a
bare `@fkit-coder`).

### Resolution of the `pending approval` grep ambiguity — OQ-1's loose end, now closed

Plan §4a step (3) left this open: *"expect 0 (or 1 iff OQ-1 resolves 'include the bridge with the
negation')"*. **It is 0.**

The owner's ruling quotes the bridge verbatim as *"under that standing approval an authorized fix lands
at Status `✅ done` in the same round"* — a **positive** construction. It never names the
`pending approval` status, so the negation form was not the one ruled and was not written. The row
therefore reproduces **none** of the skill's three gate sites (`:174` / `:191` / `:197`), which is also
what brief verification step 3 wants. Measured: `pending approval` on line 126 → **0**.

## Verification

### Coordinates, re-derived in the same turn as the edit

They had already moved once (`:124` → `:126`) between the brief and the plan. Re-checked immediately
before editing: file **414 lines**, row still at **`:126`**, and all eight of the plan §1b cites in
`claude/skills/fkit-process-stateful-review/SKILL.md` (239 lines) still exact — `:167`, `:170`, `:174`,
`:182`, `:191`, `:195`, `:197`, `:201`, `:203`, `:207`, plus the step inventory `:98 :113 :124 :135 :151
:167 :182 :195 :214` and the Status vocabulary at `:85`. **Nothing had moved.**

### Line-count / no-renumbering assertion

`wc -l` after the edit: **414** — unchanged. A markdown row is one physical line; it grew in **width**
(3000 bytes), not in count. `0204`'s five sites are therefore all where the plan said:

| Site | Verified today |
|---|---|
| 1. `unverified …` line in the fenced pointer form | `:194` ✅ |
| 2. ⚠️ emit-that-literal instruction | `:196-200` ✅ |
| 3. *"self-computed and self-reported … nothing checks it"* | `:198-200` ✅ |
| 4. *"and until `0204`'s carry-check hook lands, nothing does"* | `:248` ✅ |
| 5. the site list + its introducing sentence | `:204-214` ✅ (anchor at `:205`) |

`0333`'s pointer-only-refusal prose at `:225-229` re-read after the edit — **untouched**, and still
false-pending-`0333` on purpose.

### §4a grep battery — actual results

| Assertion | Expected | Measured |
|---|---|---|
| `` apply `fkit-process-stateful-review` **method** `` | 1 | **1** |
| `run /fkit-process-stateful-review` in file / under `claude/` | 0 / 0 | **0 / 0** |
| step tokens on `:126` | nine | **`**0** **1** **2** **3** **3.5** **4** **5** **6** **7**`** |
| `pending approval` on `:126` | 0 (resolved above) | **0** |
| wait-for-approval / once-I-approve | 0 | **0** |
| `Coder response` | ≥2 | **3** |
| `Accepted residuals` | ≥1 | **2** |
| `Status: closed-out` | ≥1 | **1** |
| `✅ done` | ≥1 | **2** |
| `adr-038` / `coder-owned` / `Step 6` | ≥1 each | **1 / 1 / 1** |
| `wc -l` | 414 | **414** |
| `there are FIVE, not the two most visible` | `:205` | **`:205`** |
| `until \`0204\`'s carry-check hook lands, nothing does` | `:248` | **`:248`** |

### §4b suites — against the plan's pre-edit baseline

```
$ node --test test/*.test.js
ℹ tests 747  ℹ suites 24  ℹ pass 747  ℹ fail 0  ℹ duration_ms 48957.8

$ bash test/prove-red.sh
… 22. ✓ Released headline unreachable — "0288/default-released" should go RED ... red
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

**Identical to the plan's stated baseline: 747/747 fail 0; prove-red 22/22, hard gate PASSED.**
Mutation **9** — which deliberately targets *this* file (on a copy tree, `cp -R "$repo/claude"`, mutating
the `description: >-` block scalar's second content line) — reported **`red`**, not the
`✗ MUTATION WAS A NO-OP` disarm message. The mutation is still armed.

## Deviation from the plan — §4a step (6)'s pass criterion was wrong

**Reported, not worked around.** The plan narrowed §4a(6) to *"`git diff --stat -- claude/` shows exactly
one file"*. Measured, it shows **three**:

```
 claude/fkit-claude-init.sh                   | 154 +++++++++++++++++++++++----
 claude/orphan-targets                        |   5 +-
 claude/skills/fkit-sprint-ship-loop/SKILL.md |   2 +-
```

The narrowing assumed the pre-existing uncommitted `0046`/`0327` work lived entirely outside `claude/`.
It does not. **The two extras are provably not mine:**

- mtimes `Aug 24 12:57:56` and `12:58:01`; my file is `18:13:51`.
- `git diff -- claude/orphan-targets` self-identifies: its added prose cites **`0327`** by name.
- I issued exactly two `Edit` calls this session, both against
  `claude/skills/fkit-sprint-ship-loop/SKILL.md`.

The criterion's **intent** — *my change touched exactly one file* — is satisfied and independently
proven by `git diff --numstat` showing `1 1` on one path. I treated this as a factual error in a
verification step that evidence settles, not as a judgment call about the change, so I did not stop.
**Flagging it so it is not later rediscovered as a defect, and so `0204`/`0224`/`0333` inherit a
correct criterion:** the right assertion is *"no `claude/` path other than this SKILL.md has a
post-`c45ec3d` mtime"*, not a file count.

Nothing else deviated from the plan's predictions.

## The honest limit (brief verification step 8 / plan §4c) — binding

**There was no red-first available here and I did not manufacture one.**

- No test in this repo asserts the content of this row. Writing one is **`0225`'s** task (the
  loop-table row↔ownership test, filed as a separate follow-up in ADR-038 §Consequences). Building it
  here would be doing another task's work.
- **What the suites prove: NOT-BROKEN.** 747 unit assertions and 22 mutation gates still hold; the
  skill-frontmatter suite parsed the edited file and the 25-skill corpus scan is intact. That proves the
  edit did not malform the file. It does **not** prove the row is right.
- **What only reading proves: CORRECT.** That the nine enumerated steps match the skill, that the three
  gate clauses are absent, that the reason clause matches ADR-038, and that the markdown table is not
  broken (no literal `|` inside a cell — the frontmatter suite would not have caught that). I verified
  all of these by reading line 126 back in full after the edit. Greps prove **presence of tokens**, not
  **fidelity of meaning**.

**Residual, recorded as the brief requires:** an enumerated row still relies on the driver and the worker
**reading** it. This is a **prose control, not prevention** — exactly the tradeoff ADR-038 §*Accepted
tradeoff* accepts. It makes a partial application *visible* to a worker who reads the row; it makes
nothing *impossible*. **Detection is `0224`'s job, not this task's.**

**Second residual (plan §5 risk 4):** the row's fidelity is only as good as the skill it summarizes. If
`fkit-process-stateful-review/SKILL.md` ever changes, the enumeration silently drifts and nothing
detects it. ADR-032 keeps that file byte-unchanged, so the risk is low today. Noted, not fixed —
`0225`'s territory.

## Sequencing note carried forward

Plan §5 stands: **`0224` overlaps line 126 and must re-derive it in full after this lands.** `0204` and
`0333` are unaffected — zero of their sites moved.

## Decision log — fixes applied unattended / obvious-winner calls

**One entry.**

1. **Obvious-winner call — §4a(6)'s pass criterion.** *Which finding it answers:* none (no review has
   run); it answers the plan's own verification step (6). *What changed:* **nothing in the source** — I
   applied no fix and widened no scope. I judged the plan's file-count criterion factually wrong rather
   than my change wrong, proved it with mtimes plus the `0327` self-citation in the diff, and continued.
   *Why it qualified:* it stays strictly within the plan's intent (the criterion exists to prove *my*
   change touched one file, which `numstat 1 1` proves), it is fully reversible, and it is a question of
   fact that evidence settles — not a judgment call about the shape of the change. It is disclosed in
   full above rather than resolved silently.

No source fix was applied without asking; **no other unattended change of any kind was made.**

## Not done, deliberately (plan §5)

No commit. No push. No task-file move. `claude/structure-manifest.tsv` **not** regenerated (plan §2
proves `claude/skills/` is outside the generator's walk; `grep -c 'skills'` on it → 0).
`claude/skills/fkit-process-stateful-review/SKILL.md` untouched (ADR-032 byte-unchanged), as are
`skills-for-role.sh`, `skill-ownership-hook.sh`, `test/**`, and the gitignored `.claude/` copies.
`0333`'s stale pointer-only-refusal text at `:225-229` **not** corrected — plan §5 forbids it explicitly.

---

# Round 2 — processing the Round 1 stateful review

**Role:** `fkit-coder` (Process-review worker, spawned by `fkit-sprint-ship-loop`)
**Date:** 2026-08-24 · **Tree at:** HEAD `c45ec3d` (unchanged; nothing committed)
**Standing approval:** the sprint loop's declared-approval marker, verified against disk before any
edit — `plan.md` `git hash-object` = `3dba383353baa9131515930d12ade055ac0a1bc8`, `wc -c` = `29987`.
Both matched. **Owner rulings relayed with this spawn:** R1+R2 **"Fix now (Recommended)"**; R3+R4
**"Fold into the same pass (Recommended)"**; residuals **"Record both formally (Recommended)"**;
verification criterion **"Reviewer's git-native form (Recommended)"**.

## Verdicts — all four re-derived first-hand, not inherited

R1 **CORRECT** · R2 **CORRECT** · R3 **CORRECT** · R4 **CORRECT** — all defects, **all four severities
agreed** (medium / medium / low / low). Evidence per finding is in `review.md`'s *Coder response*.

Measured on `:126` **before** the fix: `pending approval` 0 · `✅ done` 2 · `won't fix (frontier)` 0 ·
`disproven` 0 · `closeout (re-litigation)` 0 · `blocked` 0. **One** of six values present verbatim.

**One correction to the reviewer, strengthening its finding rather than disputing it:** R2 counted "2 of
6" present pre-fix by counting the bare word `closeout`. That occurrence is Step 2's **Verdict** word
(*"makes one `closeout`"*), not the Status value `closeout (re-litigation)`. The true pre-fix count was
**1 of 6**. This does not change the severity or the scope, so it was not treated as a disputed severity.

## The fix — one pass, still one line

Two `Edit` calls plus one tightening edit, all inside `claude/skills/fkit-sprint-ship-loop/SKILL.md:126`,
cell 3 only. Cell 2 (OQ-2(A)'s reason clause) untouched this round.

- **Step 4 (R2)** — now states the vocabulary it orders: all six values from
  `fkit-process-stateful-review/SKILL.md:85`, plus the dropped mappings (INCORRECT → `disproven` /
  Action `none`; retained frontier-move → `won't fix (frontier)`; Step-2 re-litigation →
  `closeout (re-litigation)` naming the residual or ADR, and do not re-fix).
- **Step 6 (R1)** — *"by outcome, not uniformly"*: `✅ done` / `blocked` + reason /
  `won't fix (frontier)` + the residual entry, plus the guard **"Leave the `disproven` and
  `closeout (re-litigation)` rows exactly as Step 4 set them."**
- **Step 7 (R3)** — given its `:214-222` contents, including the evidence-before-assertion caution.
- **Never-edit clause (R4)** — carries the skill's single seeding exception (`:103-104`, `:119-120`),
  closed with "in this loop the **Review** step has already written that section".

**Owner-accepted costs kept, not "fixed":** OQ-1(A)'s bridge is byte-unchanged and OQ-2(A)'s ragged
cell-2 column stands.

## The R2 gate-tension decision — resolved deliberately, and this SUPERSEDES Round 1's resolution

**The tension:** R2 cannot be fixed without naming the full Status vocabulary, and one of the six values
is `pending approval` — the status produced by the very per-round owner gate this loop excises
(`fkit-process-stateful-review/SKILL.md:174` / `:191` / `:197`). Round 1 recorded this grep as **0** and
called OQ-1's ambiguity closed at 0.

**Decision: write `pending approval` exactly once, as a vocabulary value carrying an inline
disclaimer.** The row now reads:

> `pending approval` ⛔ *(the one value this loop never uses: the standing approval above has already
> replaced the per-round gate that produces it)* · `✅ done` · … — so **five of the six apply here**.

**Reasoning — why this does not re-impose the gate in substance:**

1. **Naming a value is not instructing a wait.** The gate at `:174` / `:191` / `:197` is three
   *imperatives* ("set Status = `pending approval`", "wait for my explicit approval", "Once I explicitly
   approve"). The row reproduces **none** of them. Measured on `:126` after the fix: `wait for` 0 ·
   `explicit approval` 0 · `Once I` 0 · `approve specific` 0 — unchanged from the reviewer's
   pre-fix measurement.
2. **The only occurrence is inside a listing, and is an explicit negation.** It is bracketed by `·`
   separators, introduced by "takes one of exactly these six prescribed values", and immediately
   disclaimed as *the one value this loop never uses*. It is unmistakably a vocabulary listing.
3. **It is strictly safer than omitting it.** Plan §5 risk 3 named the live hazard: an enumerated Step 4
   could lead a worker to park an in-plan `CORRECT` fix at `pending approval` and stall a loop whose
   premise is a standing approval. Listing the value *with* the disclaimer is the only form that both
   fixes R2 and forecloses that stall. A bare listing would fix R2 and leave the stall open; omitting
   the value leaves R2 unfixed and the stall open.

**Count resolved: `pending approval` on `:126` = 1**, which is inside the owner's stated envelope for
OQ-1 ("expects **0 or 1** … resolve which and state it"). ⚠️ **An intermediate draft measured 2** — the
listing plus a separate follow-on sentence naming it again. That was outside the stated envelope, so it
was tightened to a single occurrence by folding the disclaimer inline. Disclosed rather than quietly
corrected.

**Round 1's "It is 0" statement above is superseded by this round.** It was correct for that round's
bytes; it is no longer true of the file.

## The verification criterion — corrected, per the owner's ruling

The owner **adopted the reviewer's git-native form**, replacing the plan's file-count criterion (which
Round 1 had already reported as wrong) **and** replacing Round 1's own mtime-based proposal:

> **`git diff --numstat <base> -- <my path>` is the only non-zero row attributable to this task, and
> every other dirty `claude/` path is accounted for by name to another task.**

**Recorded here so `0204`, `0224` and `0333` inherit it.** It is better than the mtime form Round 1
proposed: mtimes are not versioned, do not survive a fresh checkout, and are perturbed by any tool that
rewrites a file in place. `numstat` is content-derived.

**Applied this round:**

```
$ git diff --numstat -- claude/
133	21	claude/fkit-claude-init.sh
4	1	claude/orphan-targets
1	1	claude/skills/fkit-sprint-ship-loop/SKILL.md
```

- **Mine:** `claude/skills/fkit-sprint-ship-loop/SKILL.md` → `1 1`. One line added, one removed —
  the single physical row. **This is the only row attributable to `0223`.**
- **Accounted for by name to another task:** `claude/fkit-claude-init.sh` and `claude/orphan-targets`
  belong to the in-flight **`0327` init/symlink family** — `0332` (hard-link behaviour), `0334`
  (launcher symlink-blind fail-safe) and `0336` (`.claude` refresh wrong-type squatter) all name these
  paths in their briefs, and `git diff -- claude/orphan-targets` cites **`0327`** by name in its own
  added prose. Neither was touched this session: exactly three `Edit` calls were issued, all three
  against `claude/skills/fkit-sprint-ship-loop/SKILL.md`.

## Verification — full battery re-run after the fix

| Assertion | Expected | Measured |
|---|---|---|
| `wc -l` | 414 | **414** |
| pipes on `:126` | 5 (4 cells) | **5**; rows `:120-127` all 5; no literal pipe inside a cell |
| step tokens on `:126` | nine | **`**0** **1** **2** **3** **3.5** **4** **5** **6** **7**`** |
| **all six Status values present (R2)** | 6/6 | **`pending approval` 1 · `✅ done` 3 · `won't fix (frontier)` 3 · `disproven` 4 · `closeout (re-litigation)` 3 · `blocked` 2** |
| **Step 6's three mappings distinct (R1)** | present | **`by outcome, not uniformly` 1; non-overwrite guard 1** |
| **Step 7 contents (R3)** | present | **1** |
| **seeding exception (R4)** | present | **1** |
| gate: `wait for` / `explicit approval` / `Once I` / `approve specific` | 0 each | **0 / 0 / 0 / 0** |
| `` apply `fkit-process-stateful-review` **method** `` | 1 | **1** |
| `run /fkit-process-stateful-review` in file / under `claude/` | 0 / 0 | **0 / 0** |
| `adr-038` / `coder-owned` / `Step 6` (cell 2 intact) | ≥1 each | **1 / 1 / 1** |
| `there are FIVE, not the two most visible` | `:205` | **`:205`** |
| `until \`0204\`'s carry-check hook lands, nothing does` | `:248` | **`:248`** |

```
$ node --test test/*.test.js
ℹ tests 747  ℹ suites 24  ℹ pass 747  ℹ fail 0  ℹ duration_ms 47628.8

$ bash test/prove-red.sh
9. de-indented continuation line — "live corpus: every skill SKILL" should go RED ... red
22. ✓ Released headline unreachable — "0288/default-released" should go RED ... red
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

**The reviewer's self-flagged evidence gap is closed.** Its targeted mutation-9 re-run was still in
flight, so it never observed that line individually. **Observed here individually: mutation 9 reports
`red`.** The `✗ MUTATION WAS A NO-OP — the awk no longer matches` disarm message (`test/prove-red.sh:560`)
is the *alternative* branch to that verdict, so printing `red` proves the mutation applied and reddened
its named assertion. Mutation 9 is still armed against this file.

## The honest limit — unchanged and still binding

**There is still no red-first here, and none was manufactured.** No test asserts this row's content;
writing one is **`0225`'s** task. **The suites prove NOT-BROKEN** (747 assertions, 22 mutation gates,
the frontmatter parse of the edited file). **Only reading proves CORRECT** — that the six values match
`:85`, that Step 6's three mappings match `:201-205`, that Step 7 matches `:214-222`, that R4's
exception matches `:103-104` / `:119-120`, and that the table is not broken (the frontmatter suite would
not catch a broken table). I read `:126` back in full after each edit. **Greps prove presence of tokens,
not fidelity of meaning.**

## Decision log — fixes applied unattended / obvious-winner calls

**Four fixes applied without a per-fix gate, plus one obvious-winner call.** All four sit under the
sprint loop's standing approval: each was verified **CORRECT** first-hand, each is mechanical and
localized to the one line the approved plan already opens, and each is **inside the approved plan** —
the plan's headline deliverable is enumeration fidelity of this row, which is exactly what R1–R4 found
unmet. None is a frontier-move, a regression, a disputed severity, or behaviour-changing beyond the row.

1. **R1 — Step 6's status mapping.** *Answers:* R1. *Changed:* replaced the unconditional
   *"set … Status to `✅ done`"* with three distinct outcome mappings + the non-overwrite guard for
   `disproven` / `closeout (re-litigation)` rows. *Why it qualified:* verified `CORRECT` against
   `fkit-process-stateful-review/SKILL.md:201-205`; one-clause rewording inside the approved line;
   owner-ruled **"Fix now (Recommended)"**.
2. **R2 — Step 4's vocabulary.** *Answers:* R2. *Changed:* named all six Status values and restored the
   `:175-176` / `:126-130` mappings. *Why it qualified:* verified `CORRECT` by counting occurrences
   (1 of 6 present); the approved plan's own §4a asserts the row obeys the skill's vocabulary; owner-ruled
   **"Fix now (Recommended)"**.
3. **R3 — Step 7's contents.** *Answers:* R3. *Changed:* enumerated `:214-222`'s report contents.
   *Why it qualified:* verified `CORRECT`; additive wording on the same line; owner-ruled
   **"Fold into the same pass (Recommended)"**.
4. **R4 — the never-edit clause.** *Answers:* R4. *Changed:* added the skill's single seeding exception
   with its cites. *Why it qualified:* verified `CORRECT` against `:103-104` / `:119-120`; one-clause
   addition; owner-ruled **"Fold into the same pass (Recommended)"**.

**Obvious-winner call — the `pending approval` occurrence count.** *Answers:* the constraint tension
inside R2. *Changed:* an intermediate draft named `pending approval` twice (listing + a follow-on
sentence); folded the disclaimer inline so it occurs **once**. *Why it qualified:* it stays strictly
within the plan's intent and the owner's stated **"0 or 1"** envelope for OQ-1, one option clearly
dominates (same clarity, fewer occurrences of the sensitive literal), and it is fully reversible. The
substantive half of the decision — *whether to write the literal at all* — is reasoned in full above
rather than resolved silently, because the spawn named it as requiring a deliberate choice.

**Deliberately NOT decided unattended, and left for the driver:** the ledger's header stays
`Status: in-review` rather than `closed-out`. The skill's Step 6 closes out when every novel finding is
`closeout` / `disproven` / **accepted**; these four are `✅ done` (**fixed**), which that condition does
not name, and the fixes have not themselves been reviewed. Closing out here would be the author
declaring the review of his own fixes finished.

## Not done, deliberately

No commit. No push. No task-file move. **`claude/skills/fkit-process-stateful-review/SKILL.md` not
touched** (ADR-032 byte-unchanged) — every one of its cites was read, none edited. `:151-249` untouched:
the faithful-carry block, the FIVE-site list, `0333`'s deliberately-still-false pointer-only-refusal
prose at `:225-229`, and the honest-bound paragraph all stand. No board, no `test/`, no
`claude/structure-manifest.tsv`, no `.claude/` copy refresh. **The *Reviewer findings* section was not
edited.**

---

# Round 3 — R5 (round-2 review): restore the three dropped qualifiers

**Spawned by** `fkit-sprint-ship-loop` (fkit-lead session) under the declared-approval marker, carried
in **verified-pointer form** (owner-sanctioned 2026-08-23, verbatim label **"Sanction the
verified-pointer form (Recommended)"**). Pointer verified **before any edit**, with `Bash` not `Read`:
`git hash-object plan.md` = `3dba383353baa9131515930d12ade055ac0a1bc8`, `wc -c` = **29987** — both match
the carried values exactly.

## Verdict — R5 re-derived, not inherited

The spawn flagged R5 as second-hand and asked for re-derivation. Done: the four source ranges were read
directly out of `claude/skills/fkit-process-stateful-review/SKILL.md` (`:137-138`, `:143-147`,
`:162-163`, `:198-200`) and compared against what `:126` actually said pre-edit.

**R5 = CORRECT, defect, severity `low` — agreed.** All three omissions confirmed:

- **Step 3.** Pre-edit: *"verify each against the actual code at `file:line`, deriving severity
  yourself, never inheriting the reviewer's label"*. `file:line` carries no scope qualifier, so the
  clause does read as licensing the cited-line-only verification `:137-138` forbids; and `:143-147`'s
  blast-radius tracing — the *method* behind "derive severity yourself" — was absent.
- **Step 3.5.** `:162-163`'s round-budget clause absent verbatim **and** in substance.
- **Step 6.** Pre-edit Step 6 opened at *"set each row's Action to what you actually did"* — the
  ledger-update half only. `:198-200`'s apply discipline (minimal fix / tests / run-or-say-so) appeared
  nowhere on the row.

**One point examined and rejected as a partial discharge:** Step 7 already said *"code changed (files,
how tested, result)"*. That instructs the worker to **report** testing; it never instructs testing. It
does not discharge Step 6's omission, so R5's Step 6 sub-finding stands in full.

**Severity `low` reached independently, not inherited:** the row already mandated reading real code;
the loop's **Verify** step (`:124`) and driver re-verification (`:256`) cover the test half; the gate
column bounds fix breadth; and the row is a summary that names its authoritative source skill. Not a
regression — the pre-change row was weaker on this same axis.

## The fix — one pass, still one physical line

Two `Edit` calls, both inside `:126`. `git diff --numstat` = `1 1`, single hunk `@@ -126 +126 @@`.
**`wc -l` = 414, unchanged** — the line grew in width, not in count.

Added ~70 words. The owner's chosen description estimated **"~40 words"**; that figure sits in the
ruling's *rationale*, not in its instruction ("Add all three dropped clauses to Steps 3, 3.5 and 6"),
so it was treated as an estimate, not a bound. Flagged here rather than silently absorbed.

## Verification — full battery re-run after the fix

Structural: `wc -l` **414** · row `:126` 5 pipes / 4 cells, no literal `|` added · `0204`'s anchors at
`:205` and `:248` both present and unmoved · `:151-249` untouched (outside the only hunk) · all nine
step tokens present exactly once · all six Status values present (`pending approval` 1 · `✅ done` 3 ·
`won't fix (frontier)` 3 · `disproven` 4 · `closeout (re-litigation)` 3 · `blocked` 2) · gate
imperatives `wait for` / `explicit approval` / `Once I` / `approve specific` all **0** · `pending
approval` exactly **1**, neither removed nor duplicated.

Neighbour check (the reviewer's round-2 lesson — a fix can break a neighbour): R1's by-outcome mapping
and non-overwrite guard, R2's six-value vocabulary, R3's Step 7 contents, R4's seeding exception,
cell 2's ADR-038 reason clause, OQ-1(A)'s bridge and OQ-2(A)'s doc-not-code clause — all re-asserted
present. Plus new assertions for each of R5's three restored clauses.

Suites: `node --test test/*.test.js` → **747 pass / 0 fail** (24 suites). `bash test/prove-red.sh` →
**22/22 mutations red, hard gate PASSED**; **mutation 9** (*"de-indented continuation line — live
corpus: every skill SKILL"*) observed **individually `red`** in the enumerated output.

Change surface, by the owner-adopted git-native criterion (verbatim label **"Reviewer's git-native form
(Recommended)"**): `git diff --numstat HEAD -- claude/skills/fkit-sprint-ship-loop/SKILL.md` = `1 1`,
the **only** non-zero row attributable to `0223`. The other dirty `claude/` paths —
`claude/fkit-claude-init.sh` and `claude/orphan-targets` — are accounted for **by name** to task
**`0327`** (*refuse the destructive claude refresh through a symlink and correct the only destructive
claim*, now in `done/`); both diffs cite `0327` in their own text, and their test companions
(`test/init-intake-guard.test.js`, `test/orphan-cleanup.test.js`) belong to that same task. Not a file
count, not mtimes.

## The honest limit — unchanged and still binding

**No red-first test, and none was manufactured.** No test asserts this row's content; writing one is
`0225`'s task (AR-2). The suites prove **not-broken**; the source-line re-reading above is the only
thing that proves **correct**.

## Decision log — fixes applied unattended / obvious-winner calls

**Fix applied unattended — R5, all three clauses.** *Answers:* R5 (round 2, low). *Changed:* one
physical line, `claude/skills/fkit-sprint-ship-loop/SKILL.md:126` — Step 3 gains the
surrounding-context / not-just-the-cited-line scope and the blast-radius method for severity; Step 3.5
gains the round-budget-is-a-proxy / nature-not-count clause; Step 6 gains the minimal-idiomatic-fix +
add/update-tests + run-them-or-say-so discipline. *Why it qualified:* verified **CORRECT** first-hand
against the four cited source ranges before editing; mechanical and localized (one line, three inserted
clauses, no behavior of any script changed); and **inside the approved plan** — the owner ruled
explicitly on this exact finding with the verbatim label **"Fix now, same line (Recommended)"**,
naming all three steps.

**Obvious-winner call — the ~70 vs ~40 word count.** *Answers:* the tension between the ruling's
instruction (all three clauses) and its rationale's "~40 words" estimate. *Changed:* kept all three
clauses at their faithful length rather than truncating to hit ~40. *Why it qualified:* one option
clearly dominates and stays within the plan's intent — the instruction names the clauses, and trimming
to a word target would have re-created the exact fidelity defect R5 raises. Fully reversible, and
surfaced above rather than absorbed silently.

**Nothing else applied unattended.** No third **Accepted residual** was written: R5 was a fidelity
defect in the copy, not a tradeoff, and the structural risks it touches are already fully held by
**AR-1** and **AR-2**. AR-1 and AR-2 were left byte-untouched — not duplicated, not re-worded.

**Deliberately NOT decided unattended, left for the driver:** the ledger header stays
`Status: in-review`, not `closed-out` — R5 is `✅ done` (**fixed**), which Step 6's closeout condition
does not name, and this fix has not itself been reviewed.

## Not done, deliberately

No commit. No push. No task-file move. **`claude/skills/fkit-process-stateful-review/SKILL.md` not
touched** (ADR-032 byte-unchanged) — all four cited ranges were read, none edited. `:151-249` untouched:
the faithful-carry block, the FIVE-site list, `0333`'s deliberately-still-false prose at `:225-229`, and
the honest-bound paragraph all stand. No board, no `test/`, no `claude/structure-manifest.tsv`, no
`.claude/` copy refresh. **The *Reviewer findings* section was not edited.**
