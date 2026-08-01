# Decision report — the durable citation form for mutable coordinates

- **Date:** 2026-08-01
- **Task:** [`0160-decide-the-durable-citation-form-for-mutable-coordinates`](../../tasks/done/0160-decide-the-durable-citation-form-for-mutable-coordinates/brief.md)
- **Author:** fkit-architect (spawned by `/fkit-sprint-ship-loop`; no owner channel — ADR-021)
- **Status:** **Rounds 1–5 of review processed, 2026-08-01.** Three reviewer passes produced **30
  findings — R1–R30** (R1–R15 in round 1, R16–R25 in round 2, R26–R30 in round 4), **all 30
  dispositioned**. Owner rulings settled case 3's remedy and case 5's disposition before this report was
  written, and after it: open questions 3, 5 and 6; every finding disposition; follow-up 8's
  grandfather exemption for closed ledgers; and follow-up 8's **literal-form** reading (§7.2 decision
  4) — all via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session. **One thing is
  still ⏳ Awaits the owner: open question 7** (§11), raised in round-1 review and unruled since.
- **Review corrections applied to this file**, each marked in place. **Round 1:** **R1** (Fact C was
  false — §4.2, §4.3, §8.2), **R4** (two of four mandated case-3 alternatives were never weighed — new
  §4.4.1), **R5**/**R6** (§1's one-question test did not discriminate; §1.2 overstated "untouched"),
  **R7** (a fourth open question, §11), **R8** (case 2's policy half *is* enforceable — §7, §7.2,
  follow-up 8), **R10**–**R15** (six low-severity corrections, marked at each site). **Round 2:**
  **R16** (Gap A's population), **R17** (a false historical claim, deleted), **R18** (§7.2's red set
  re-measured), **R19** (an optional element wrongly promoted to required), **R20** (the writer rule
  narrowed), **R21** (§4.4.1(b)'s "decisive" objection), **R22** (§1's overclaimed discriminator).
  **Round 4:** **R27** (§7.2 attributed its 10× cleanup swing to the wrong decision, and never listed
  the decision that causes it — §7.2 now states **four** decisions, the fourth owner-ruled), **R28**
  (this status block, which was three rounds stale).
- **Nine findings are ACCEPTED RESIDUALS by direct owner ruling — real defects, deliberately left
  standing rather than repaired,** so a reader is not misled about how strong those arguments are:
  **R2, R3, R9** (round 1 — recorded in place at §4.4 and §4.5), **R23** (round 2 — recorded in place at
  §4.2.1), **R24, R25** (round 2), **R26, R29, R30** (round 4). The last five are recorded in the task's
  `review.md` ledger under `## Coder response`, with the report text left as written per the ruling; each
  carries its own re-raise condition there. **⚠️ The justification is a direct owner ruling in every
  case — never ADR-034**, which covers a task's *own record* and does not reach this report, which is
  the task's *work product*.
- **Change surface of this task:** this file, plus the `## Coder response` section of the task's
  `review.md` ledger after each review round (the review's own artifact, not a change to the work
  product — see §12). Nothing else. No skill, agent, brief, board, ADR, convention page or vault file
  was written. No task moved. No rank changed.

---

## 0. Framing — what this report is, and what it is not

Five things were routed into this task under one name. They are **not one problem**, and this report
does not pretend they are.

Cases **1–4** share a shape: *someone wrote a coordinate down, the coordinate moved, the written
thing is now silently wrong.* The remedy space for all four is **what to write instead**.

Case **5** does not share that shape, and §6 rules it **out of class** and hands it back.

Each of cases 1–4 gets its **own** recommendation below. Where two recommendations coincide, they
coincide because the reasoning landed in the same place, not because one answer was stretched over
four problems.

**Every number in this report was measured on 2026-08-01, by me, with the method printed beside it.**
The brief's own figures are dated 2026-07-27 and 2026-07-30 and its `## Notes` say plainly that they
decay; they do, and several had. Where my figure differs from a figure already on record, the
difference is stated rather than smoothed over.

> **⚠️ A method defect of my own, reported because the rule that binds me requires it.** My first pass
> at the case-5 segmentation classified a board row as closed if `✅ Done` appeared **anywhere in the
> row**. That false-positived on `P138`, whose *description* contains the string `✅ Done` while its
> status cell reads `🔲 Backlog`. It produced 124 closed / 24 open / 7 segments / 2 singletons — all
> wrong. Re-keying the classifier to the **status cell alone** (field 1 of the pipe-split) produced
> the figures in §6, which reproduce the earlier measurement exactly.
> `conventions/evidence-before-assertion.md:23-25` says the broken-evidence theory belongs first on
> the list, not last. It was my evidence-gathering that was broken. The corrected method is the one
> printed in §6 and is the one a re-runner should use.

---

## 1. The rule — when durability beats precision

> **A coordinate is safe to cite when the citer controls or freezes the target's revision. It is
> unsafe when a third party edits the target after you write.**
>
> **Line numbers are for findings against a revision. Names are for cross-references into living
> documents.**

The **rule block above is the test.** A writer's fastest way into it is one question:

> *Am I claiming something about a revision I have read — or pointing a later reader at wherever the
> target will be when they get there?*

**A claim about a read revision is safe. A pointer for a later reader is not.**

> **⚠️ What that question does and does not settle (R22, round-3 correction).** The question was
> previously introduced as *"the whole test"* and *"the one that actually splits the rows"*. **It is
> neither, and the overclaim matters because follow-up 1 copies this section into a convention page.**
> Walked against the five rows of the table below, it **cleanly decides one**:
>
> | Row | Does the claim-vs-pointer question decide it? | What actually carries the row |
> |---|---|---|
> | 1 — source/test/skill/agent file | **No — the row bundles two uses that answer differently.** A *finding* is a claim → safe ✓; a *design-doc* citation is a pointer → the question says unsafe, the table says `path:NNN` is **correct** | the Because cell: edits arrive as a reviewed diff **to the thing you cited** |
> | 2 — file under review | **Yes** ✓ — and this is the row R6 was about; the replacement is a genuine improvement here | the question, plus the caveat below the table |
> | 3 — coordination document | **No — contradicted.** Citing `sprint-2.md:162` as a claim about a revision you read answers *"claim"* → *safe*; the table rules `path:NNN` **wrong**, categorically. This report does exactly that in §3.4 | the **second condition**: third parties append **above** your line, so the coordinate moves whatever your intent was |
> | 4 — a task | **No — does not parse.** Durable identity is not a claim/pointer question at all | ADR-029 Decision 3 |
> | 5 — a board position | **Partial.** Separating rank from identity does not come from the question | `conventions/priority-is-rank-not-identity.md` |
>
> **So the honest statement of scope:** the question is a good **first cut** and it is the right test for
> the review-ledger row it was written to fix. **It does not decide the table**, and a writer who applies
> it alone will get row 3 wrong in the unsafe direction. **Both conditions must be read together** — the
> claim-versus-pointer question **and** whether the target is a document a third party edits under you.
> The second is what makes row 3 categorical. **This is a scope correction, not a new rule:** every
> reason named in the table above is already in that row's own Because cell. **Follow-up 1 must carry
> this scope note with §1, not the bare question.**
>
> *This is a defect in the R6 replacement, not a re-raise of R6 — the previous question failed row 2,
> which this one fixes, and the reviewer confirms the replacement is still the better of the two.*

> **Round-1 review correction (R6).** The question this section first printed was *"after I publish
> this sentence, who else edits the thing I just pointed at?"* That question **does not discriminate**
> and the reviewer was right to say so: for a file under review the answer is *"the coder, immediately,
> in response to this very finding"* — which would rule a review finding **unsafe**, contradicting the
> table below. The claim-vs-pointer question above is the better of the two and is the right test for
> **that** row. **But see the R22 scope note above** — it decides one row of five cleanly, and must be
> read together with the *"does a third party edit this under you?"* condition, which is what carries
> row 3.

| If the target is… | …then | Because |
|---|---|---|
| A source file, test, skill or agent file, cited in a design doc or a finding | **`path:NNN` is correct** | edits arrive as a reviewed diff **to the thing you cited**, so a reader who finds it changed sees the change; they do not silently land on unrelated text that grew above it |
| A file **under review**, cited in a review ledger row | **`path:NNN` is correct — as a claim** | the finding is a claim about the revision the reviewer read. **See the caveat below the table** |
| A **coordination document** others append to — `ai-agents/sprints/*.md`, task briefs, `ai-agents/wiki-vault/log.md` | **`path:NNN` is wrong** | third parties append **above** your line for reasons unrelated to your sentence; the file grows under you and §3 measures how fast |
| A **task** | **the folder-name `NNNN` prefix**, always | ADR-029 Decision 3: assigned once, never reused |
| A **board position** | **`P<n>`, and only as rank** | `conventions/priority-is-rank-not-identity.md:3-4` — *"A sprint board's Priority cell is board rank, written `P<n>`. A task's identity is its task-folder name's `NNNN` prefix, and nothing else."* |

> **The caveat on the review-ledger row, stated rather than glossed (R6).** "Frozen by construction" is
> true of the reviewer's **assertion** and false of the **reader's resolution**. In this repo's
> multi-round stateful model a round-1 finding is re-read in round 2, *after* the coder has edited the
> cited file in response to it — so the number in the `file:line` cell may no longer land where the
> reviewer was looking. The row stays on the safe side because the finding is a claim, not a
> forwarding address; what makes it **re-resolvable** in round 2 is the §1.1 rider, not the number.

### 1.1 The rider that matters more than any ban

**Never cite a line number naked.** Pair every `path:NNN` with a quoted fragment or the heading it
sits under.

This is the single highest-value recommendation in the report, and it applies to **all four cases at
once**. A naked pointer that has drifted is indistinguishable from a correct one. A pointer carrying
`sprint-2.md:162 — "Wiki re-ingest the amended ADR-032"` is **self-correcting**: the reader who finds
different text at `:162` knows immediately that the number moved, and the quote tells them what to
search for. The cost to the writer is one clause.

### 1.2 Reconciling `claude/agents/fkit-architect.md`'s `## Output format`

The bullet, quoted verbatim from `claude/agents/fkit-architect.md:128-129`:

> - Architecture docs / specs: structured markdown with `path:line` citations and ASCII or mermaid
>   diagrams where they clarify structure.

**Verdict: it narrows. It does not stand unchanged, and it does not go.**

- It **stays** for code, tests, and files under `claude/` — the targets the reader diffs.
- It **narrows** to exclude citations into coordination documents (`ai-agents/sprints/*.md`, task
  briefs, `ai-agents/wiki-vault/log.md`).
- It **gains** the §1.1 rider: pair the number with a quote.

**Review-ledger practice: the `file:line` cell stands; the rider reaches it too.** A reviewer finding
at `plan.md:106` is a claim about a frozen revision, which is the safe side of the test — the **ban**
does not touch it. But §1.1 says the rider applies to **all four cases at once**, and a ledger row is
no exception, so the earlier draft's flat *"Review-ledger practice is untouched"* was wrong and the
reviewer was right to call the contradiction (R5).

Stated precisely:

- **The schema does not require a quote.** The findings row is
  `| # | Round | Sev | file:line | Claim |` (`fkit-stateful-review/SKILL.md:52`, byte-identical at
  `fkit-process-stateful-review/SKILL.md:57`). There is no quote or heading field.
- **Practice already supplies one, informally.** The `Claim` cell and the ledger's `### Evidence per
  finding` section are where the quoted fragment goes today, and good ledgers put it there — this
  task's own ledger does.
- **So the ask on a reviewer is: put the quoted fragment or heading in the `Claim` cell, always.**
  That is a *practice* recommendation carried by the convention page (follow-up 1). **It is not a
  schema change**, and it is deliberately not folded into follow-up 3 / `0168` item 2, whose scope is
  the `Task:` header line the owner ruled on.
- **It is unenforced.** Recorded in §10.

> **The sting, stated rather than avoided.** This report is itself an architecture doc under that
> bullet, so it follows its own narrowed rule. Where it points at `sprint-2.md` it names the row by
> **task folder ID**, and where a line number appears it is paired with a quote or a method.

**I did not edit `claude/agents/fkit-architect.md`.** The wording edit is named as follow-up 2 in §8.

---

## 2. Case 1 — board rank cited in prose. **Out of scope, hard. Referenced only.**

The brief's `## Notes` (`0160/brief.md:317-320`) put case 1 out of scope: the rule belongs to task
`0157`, the repair to `0159`, and touching either re-creates a two-owner collision that split just
resolved.

**This report edits nothing in case 1's surface.** It is cited here for one reason: it is the
**worked precedent** for what a durable-anchor rule looks like when it lands —
`conventions/priority-is-rank-not-identity.md` states the rule, `:38-44` states what is frozen and
what is not, and `:49-54` names two mechanical enforcement points. Cases 2–4 are measured against
that bar in §7.

One fact from case 1 is load-bearing for case 3 and is recorded here: task `0161`, which
disambiguated the frozen-history clause, is **closed** — it sits in
`ai-agents/tasks/done/0161-disambiguate-the-frozen-history-clause-in-priority-is-rank-not-identity/`
and its row on the board reads `✅ Done (agent-closed — not owner-verified)`. The brief's soft
ordering preference (`0160/brief.md:321-324`, *"prefer landing 0161 first"*) **was achieved**. The
disambiguated clause was read as live text, not as a clause needing a ruling.

---

## 3. Case 2 — `path:NNN` into a growing file

### 3.1 Measurement — 2026-08-01

**Method.** Regex `([A-Za-z0-9_./-]+\.(md|sh|js|json|ts|yaml|yml)):(\d+)` over all 35 open
`ai-agents/tasks/backlog/*/brief.md`. To rule out an undercount from citations split across a line
wrap, each file was counted twice — raw, and with `\s*\n\s*` collapsed to a single space — and the
two counts compared per file.

| Measure | 2026-07-27 (brief) | **2026-08-01 (this report)** |
|---|---|---|
| Open backlog briefs scanned | — | **35** |
| Total `path:NNN` citations | 113 | **111** |
| Citations into `sprint-2.md` | 12 | **6** |
| …of which are inside `0160`'s **own** brief | — | **3** |
| **Live external corpus** | — | **3** |
| Files whose count changed under wrap-normalization | — | **0** |

The zero in the last row is the check that the grep was not lying by omission. It was not, **for this
corpus** — `sprint-2.md`'s own rows are a different matter and were never grepped with a context
regex (see the operational note in §9).

The three live external citations into `sprint-2.md`:
`0013/brief.md → sprint-2.md:354`, `0149/brief.md → ai-agents/sprints/sprint-2.md:132`,
`0158/brief.md → ai-agents/sprints/sprint-2.md:245`.

### 3.2 Measurement — how fast the target actually moves

**Method.** `git show <sha>:ai-agents/sprints/sprint-2.md` over the 12 most recent commits touching
the file; total lines counted; the rows for tasks `0148` and `0157` located by **folder-slug
substring on a line-by-line scan** — deliberately *not* a context regex.

| Date | Lines | `0148` row at | `0157` row at |
|---|---|---|---|
| 2026-07-24 | 1,613 | — | — |
| 2026-07-26 | 2,044 | 157 | — |
| 2026-07-27 | 2,319 | 160 | 159 |
| 2026-07-29 | 2,917 | 164 | 162 |
| 2026-07-31 (HEAD) | 3,175 | 164 | 162 |
| **2026-08-01 (working tree)** | **3,175** | **164** | **162** |

*(Line counts are `wc -l` semantics.)*

**The file grew 97% in eight days. `0148`'s row moved seven lines.**

### 3.3 Ruling — **narrow, do not ban**

**⏳ Recommendation, awaiting no ruling — this one is mine to make and I make it.**

- **Keep `path:NNN`** for code, tests, files under `claude/`, and review findings.
- **Stop using it** for coordination documents whose growth is other people's edits:
  `ai-agents/sprints/*.md`, task briefs, `ai-agents/wiki-vault/log.md`.
- **Replacement anchor:** the row's **task folder ID** (*"the `0148` row"*), or a **quoted fragment**
  of the row.
- **Rider (§1.1):** never a naked number, anywhere.

### 3.4 Why the brief's diagnosis is directionally right and mechanically wrong

The brief calls these citations *"guaranteed to move again"*. True, but the framing implies the
danger is **fast** drift. The measurement says drift is **slow** — 97% file growth bought seven lines
of movement.

**Slow drift is worse, not better.** A pointer wrong by four lines does not land in whitespace and
announce itself. It lands on a **neighbouring board row of identical shape** — same pipe table, same
`P<n>` cell, same status emoji — and **still reads authoritative**.

That is not hypothetical. It is exactly the case-4 near-miss in §5: `ai-agents/wiki-vault/log.md:683`
and `:743` both assert `sprint-2.md:162` is task `0148`'s row. Today `:162` is task **`0157`**'s row
and `0148` is at `:164`. A reader following that pointer lands on a real, plausible, wrong row.

A fast-drift failure is loud. A slow-drift failure is silent, and silence is the failure mode worth
designing against. **This is the argument for the §1.1 rider rather than for the ban** — a ban stops
new bad pointers; only a paired quote makes an already-drifted one detectable.

---

## 4. Case 3 — the dead folder path in a review ledger

### 4.1 Measurement — 2026-08-01

**Method.** For every `ai-agents/tasks/done/*/review.md`, take the **first** line beginning `Task:`,
extract the path (backtick span → markdown href → bare text, then trimmed to the first `\S+\.md`
token so trailing prose like `(task 43)` does not corrupt it), and test `os.path.exists()`. This is a
**positive existence test per header**, not `grep -rl 'tasks/backlog/'` — that grep counts ledgers
citing *siblings* and is what produced the brief's disputed 35.

| Measure | Count |
|---|---|
| Task folders under `done/` | **124** |
| …carrying a `review.md` | **60** |
| Header path **resolves** on disk | **19** |
| Header path is **dead** | **40** |
| **No `Task:` header at all** | **1** — `0080-report-backlog-board-in-fkit-status-on-request-only` |
| Buckets sum to | **60** ✓ |

The 40 dead headers, by form:

| Form | Count |
|---|---|
| `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md` (current folder form) | **17** |
| `ai-agents/tasks/backlog/<slug>.md` (pre-migration flat) | **14** |
| `ai-agents/tasks/done/<slug>.md` (pre-migration flat) | **9** |
| **Total `backlog/`-form** | **31** |
| **Total flat (pre-migration)** | **23** |

**This reproduces the 2026-07-31 figures recorded by task `0168` exactly, independently derived.**
It also settles the brief's own count discrepancy (`0160/brief.md:327-336`, *"30, not 3"* vs *"the
31st specimen"* vs *"returns 35"*): **none of those three numbers was measuring the header.** The
header population is 40.

### 4.2 Three facts that decide this case

**Fact A — every header is redundant with the folder it sits in.**
For all **59** ledgers carrying a header (dead and live alike), the task named by the header is the
**same task as the folder the file is in**. **Zero** name a different task.
*Method: compare the header path's slug — or its parent directory name where the path ends in
`brief.md` — against the containing folder's own `NNNN-<slug>` name.*

**Fact B — every flat variant is recoverable, and none is ambiguous.**
All **23** flat headers resolve to exactly one folder ID via a slug→folder-ID map built over
`ai-agents/tasks/*/*/`. **0 of 23** resolve to a task other than the folder they sit in. One
(`0052`) needs the trailing-text trim described in §4.1.

**Fact C — 4 of the 59 headers are markdown links; the other 55 are not.**
*(Round-3 correction, R16: this read "4 of the 60 … the other 56". There are **59** headers across **60**
files — `0080` has none — so the non-href population is **55**, exactly as the table below has always
summed: 30 code spans + 25 bare.)*

> **⚠️ Corrected after round-1 review (finding R1). The first version of this Fact was false**, and it
> was relayed to `0168` in §8.2 in its false form. It read *"not one of the 60 headers is a markdown
> link … Zero markdown hrefs, in the entire corpus."* **Re-measured by me on 2026-08-01, from the same
> 60 headers: 4 are markdown hrefs.** The error came from a classifier that preferred the backtick span
> and never asked whether the span sat inside a `[…](…)` label, so href-with-code-label was silently
> bucketed as "code span". The corrected classifier tests for `[…](…)` **first**.

By notation, re-measured:

| | dead path text | live path text | total |
|---|---|---|---|
| Code span `` `path` `` | **26** | **4** | 30 |
| Bare text | **10** | **15** | 25 |
| **Markdown href `` [`path`](target) ``** | **4** | **0** | **4** |
| Total | 40 | 19 | **59** (+1 with no header) |

**The 4 hrefs, named, because they are load-bearing below:**
`0001-add-backlog-board-default-for-unsprinted-task-briefs`,
`0010-add-speak-in-simple-terms-output-style`,
`0022-compress-universal-rules-output-style-section`,
`0039-filter-fkit-status-board-to-open-tasks` — each reads ``Task: [`<dead path>`](./brief.md)``.

**Both halves of that sentence matter.** The **label** is a dead pre-migration flat path, which is why
all 4 sit in the dead-path column. The **href target** is `./brief.md`, which **resolves in all 4
cases** — verified by `os.path.exists` against each file's own directory. The dead-header count of 40
is unchanged; what changes is that 4 of the 40 have a **live link hiding behind dead display text**.

### 4.2.1 **Gap A and Gap B** — two different defects, ruled separately

**Added 2026-08-01 (round 2), at the owner's instruction.** Fact C above records the *facts*; it never
ruled on them, and `0168` executes against a ruling. This subsection is that ruling. **Nothing here
changes the §4.6 remedy** — it says which of the two failure modes that remedy is repairing in each
case.

**First, the measurement lesson that produced the gap.** **Notation** (how the header is written — code
span, bare, href) and **variant** (which path it names — folder-form, flat `backlog/`, flat `done/`) are
**independent axes.** The original measurement took only the second and inferred the first, which is how
"0 hrefs" survived into `0168`. Re-derived in round 2 over the same 60 files: **no count moves** — 40
dead / 19 resolve / 60 files, variants **17-14-9** — and all **4** hrefs sit inside variant 3's **nine**
`done/`-flat headers.

**The mover's rule is one sentence, and it splits the corpus in two.**
`claude/skills/fkit-task-done/SKILL.md:170-171`, for a hit in a sibling task folder's `review.md`:
*"re-point the href, change nothing else."*

- **Gap A — the 55 headers that rule never reaches, of which 36 are dead.** **55 of the 59 headers are
  not hrefs at all**: 30 code spans (26 dead + 4 live) + 25 bare (10 dead + 15 live) = 55. There is no
  href to re-point, so the mover's rule is a no-op on all 55 — but it is a **miss on the 36 that name a
  dead path** only. On the other **19** the header already resolves, so the rule has nothing to do and
  nothing is lost.
- **Gap B — the 4 the rule reaches and correctly declines to change.** The href target is `./brief.md` —
  **relative, and move-proof**: it resolves from the ledger's own folder no matter which board that
  folder sits on. Verified in round 2 against all four (`0001`, `0010`, `0022`, `0039`). So *"re-point
  the href"* has nothing to do, and *"change nothing else"* **actively forbids** touching the stale
  label. **For these four, `/fkit-task-done` doing nothing is correct behaviour, not a miss.**

> ### The split `0168` executes against — **40 dead = 36 Gap A + 4 Gap B**
>
> Re-derived in round 3 from the same 60 files: 124 folders under `done/`, **60** carrying a
> `review.md`, **59** with a `Task:` header, **1 without** (`0080`), **40 dead / 19 live**, notation
> **30 code / 25 bare / 4 href**. Dead by notation: **26 code + 10 bare = 36 non-href (Gap A)**, **4
> href (Gap B)**. **36 + 4 = 40.** ✓

> **⚠️ Round-2 arithmetic corrected here (R16, high).** This subsection first printed *"the 56 that
> rule never reaches"* and called the no-op on all of them *"a miss"*. **Both halves were wrong.** The
> non-href population is **55**, as this bullet's own parenthetical always said (30 + 25); **56** was
> `60 files − 4 hrefs`, which counts `0080` — the one ledger with **no `Task:` header at all**, neither
> href nor non-href, and routed separately as `0168` item 5 (§8.2). And only **36** of the 55 name a
> dead path, so *"a miss"* over-claimed by 19. The **40 = 36 + 4** split is the number `0168` actually
> executes against and it appeared nowhere in the round-2 draft; it is printed above and repeated in
> §8.2.

> **⚠️ A false historical claim removed here (R17, medium).** The Gap B bullet previously ended *"The
> defect was written at authoring time and no mover rule has ever governed it."* **That is false, and it
> contradicted this report's own §4.3.** Verified from git on `0001`'s ledger: at `331f298` the header
> read ``Task: [`ai-agents/tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md`](../tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md)``;
> at `185b321` the same line read ``…](./brief.md)`` — **the target was rewritten and the label left
> byte-identical.** A link-repair pass *did* touch these headers. **§4.3's account is the correct one**,
> and it is the *more damning* reading: re-pointing hrefs is not sufficient even where it is applied.
> Precision worth keeping: `185b321` is a post-ADR-029 sweep commit, so *"the mover"* names the actor
> loosely — what is established is that **something** repaired the target and left the label.

**The ruling — a stale label on a working link is a DIFFERENT defect from a dead pointer, and it is the
more dangerous of the two.**

> **⚠️ *"More dangerous"* is an accepted residual, and nothing below rests on it (R23, owner-ruled
> 2026-08-01).** The claim is **not established** as written: it survives only as *harder to notice per
> click*. Frequency, consequence and aggregate exposure are never weighed, and the populations run
> **36 : 4** the other way. The owner ruled it an accepted residual rather than a rewrite, so the
> sentence stands as written — but so that an accepted-as-weak claim does not keep doing load-bearing
> work: **the "DIFFERENT defect" half is the load-bearing half, and it alone carries everything
> below.** Checked in round 3 across the whole report — the writer rule, the sweeper's two repairs, the
> stated condition, §4.6's remedy and §8.2's relay each derive from the label-versus-target mechanism,
> and **not one of them cites the danger ranking**; the phrase is **asserted exactly once in the report,
> in the sentence above** — its only other appearance is inside this box, quoting it in order to flag it.
> Delete the ranking and nothing downstream moves. *(Round-5 precision fix: this line previously said
> "occurs exactly once", which is true of a case-sensitive `grep` and false of a case-insensitive one.
> Nothing turns on it; corrected because the report's whole subject is claims that read as durable and
> are not.)*

The reason is §1.1. That rider's whole value is that a citation should be **self-correcting**: a reader
who lands somewhere unexpected can *tell* the coordinate drifted, and the paired quote says what to
search for. Measured against that property the two gaps invert:

| | Gap A — dead pointer | Gap B — stale label, live target |
|---|---|---|
| What fails | **navigation** — the reader cannot get there | **display** — the reader gets there fine |
| How it fails | **loudly.** Following it fails; the defect announces itself | **silently.** Following it *works*; nothing ever announces anything |
| What the reader sees | a path that does not resolve | a path that reads as maintained and is not |
| §1.1 self-correction | preserved — drift is detectable | **inverted** — the rotted half is the visible half, the working half is invisible |

**So: not the same defect.** A dead pointer is a broken link and behaves like one. Gap B is a **false
claim wearing a working link's credibility** — the citation looks maintained *because* it is a link, and
the one part a reader can check by clicking is the part that was never broken. §4.4.1(b) already used
these four to make the neighbouring point — *"the working half is invisible; the broken half is what you
see"* — and this is that observation promoted to a ruling.

> **⚠️ Corrected in round 3 (R21, medium).** This paragraph previously called the four *"the disproof of
> read-time resolution"*. **They are not.** §4.4.1 defines (b) as *"mapping the header's **slug** to a
> folder at the moment of reading"*; `./brief.md` is a **static href authored into the file** — nothing
> consumes the slug and nothing resolves at read time. What the four actually establish — and it is
> enough for this ruling — is that **an independent durable pointer does not repair stale display
> text**. **(b)'s rejection is unaffected**; see §4.4.1(b), where the same leg is corrected and the
> verdict is carried by its other three objections.

**It is also the more contagious.** A reader who copies a displayed path carries the dead coordinate into
a new document, and nothing in the copy signals it was already dead. Stated as a mechanism, **not** as a
measured claim about how this corpus arose — I did not attempt to establish that causally. **And the
comparison itself — *more* contagious than a dead pointer — rests on the same unmeasured footing as the
danger ranking above, and nothing downstream cites it either.** *(Round-5 note, below finding threshold:
the reviewer recorded this as a second unestablished comparative already covered by R23. The sentence is
left standing, like the ranking; the comparative is now flagged where it is made.)*

**What a writer does — the rule this generalizes to:**

> **Do not use a mutable location as the visible label of a forwarding link into a living document.**
> Where a link exists to point a later reader at wherever the target will be when they get there, label
> it with what the target *is* (`brief`), never with where it *lives*
> (`ai-agents/tasks/done/<slug>.md`). The **target** carries location; the **label** carries meaning. A
> label that names a path is a second, unmaintained copy of the coordinate — and the copy the reader
> actually reads.

This is §1.1's rider applied to the label rather than the line number, and it is the same failure both
sections are about: a coordinate rendered as display text, with nothing to make its drift visible.

> **⚠️ Narrowed in round 3 (R20, medium).** This rule was first written *"a link's display text must
> **never** be a mutable coordinate"*, and as worded it **contradicted §1**, which expressly rules
> `path:NNN` **correct** for a source file, test, skill or agent file cited in a design doc or a
> finding — including when that citation is wrapped in a link. Live specimen in-repo:
> `0013/brief.md:28` writes ``[`sprint-2.md:354`](../../../sprints/sprint-2.md)``. **The ban belongs to
> forwarding links into living documents**, which is what the paragraph above it actually argues; a
> label that is a **claim about a revision the writer read** is governed by §1, not by this rule. The
> narrowed wording — not the `never` — is what §8's follow-up 1 carries into the convention page.

**What a sweeper does — one test, two repairs:**

> **Does the target resolve?**
> **Yes** → two acceptable repairs, both ruled by §4.6:
> **(i)** `Task: 0001` alone — the canonical ruled form. Dropping the link is **permitted**, because the
> ID is fully durable without it.
> **(ii)** `Task: 0001 — [brief](./brief.md)` — the ID with the working link kept beside it, label
> replaced. **Preferred here**, because the target already exists and already works.
> **The one repair that is wrong is unwrapping to a bare dead label** — keeping the broken half and
> discarding the working one, with no ID added. That, and *prepending* an ID while leaving the stale
> label standing, are the two failures.
> **No** → the pointer is dead; the §4.6 normalization applies as it does to the rest of the 40.

> **⚠️ Corrected in round 3 — §4.2.1 yields to §4.6 (R19, medium; owner-ruled 2026-08-01).** This test
> previously read *"**never** unwrap the link"* and called dropping it *"wrong"*. **That overreached and
> contradicted the ruled remedy.** §4.6 makes the live relative link **optional** — *"**Optionally** with
> a live relative link beside the ID, never in place of it"* — so **`Task: 0001` with no link at all is
> the complete, canonical, fully durable normalization**, not one of two mistakes. §4.6 is unchanged;
> this section is the one that moved. **The cost the owner accepted, stated rather than glossed:** for
> the 4 href headers, a sweeper who takes route (i) discards a working `./brief.md` target that already
> exists and cost nothing to keep. That is a real, accepted loss of convenience — it is not a loss of
> the durable reference, which is the ID.
>
> **Sub-note kept from the round-2 finding:** *resolving* is not the same as *move-proof*. A relative
> target such as `../../done/<slug>/brief.md` resolves today and dies on the next move, and a label-only
> repair would preserve it. **No such instance exists in this corpus** — all 4 targets are exactly
> `./brief.md`, re-verified in round 3 — but a sweeper applying this test elsewhere should ask
> *move-proof?*, not merely *resolves?*.

**Why this is not an §4.4.1(d) "append rather than rewrite" case.** (d) protects **verbatim
quotations**, where a rewrite would falsify a quote. A header label is not a quotation — per **Fact A**
it asserts nothing its own folder does not already assert. Repairing it is a pointer normalization,
identical in kind to the other 40, and R2's "a code span may be a claim about review day" argument does
not reach it for the same reason.

**Does the §4.6 folder-ID schema close both gaps? Yes — but for Gap B only under a condition that is
not currently stated anywhere, and Gap B survives the sweep if it is missed.**

Checked against the ruled form — §4.6's *"The new header form"* block, `Task: 0159`, and its rider
*"Optionally with a live relative link **beside** the ID, never in place of it"* — not assumed:

> **Round-3 self-consistency repair, raised by no finding.** This sentence previously cited
> **`§4.6:509-516`**. That line range was **already wrong before this round** — the ruled form sits at
> `:731-734` today — and it is the only `§N:LLL` self-citation in the report. It is exactly the defect
> §1's table rules on: a line number into a **growing** document, where the growth was **this report's
> own review rounds**. Replaced with the section name plus the quoted form, per this report's own
> ruling. Recorded rather than silently fixed.

- **Gap A — closed unconditionally.** The path leaves the header entirely; the ID is read off the folder
  the file is already in. Nothing mutable remains to die.
- **Gap B — closed only if the normalization *replaces* the label rather than sitting beside it.** The
  schema removes the *path*; the stale text in these four **is** the path, so replacing the header
  closes it. But a sweeper who reads "carry the folder ID" as *prepend an ID* — leaving the old
  `[`dead path`](./brief.md)` intact after it — satisfies the letter of the schema **and leaves all four
  defects exactly where they were.** That is a live failure mode, not a hypothetical: it is the cheapest
  way to implement the instruction as written.
- **The four are, uniquely in the corpus, already halfway to the ruled form.** §4.6 permits *"a live
  relative link **beside** the ID, never in place of it."* These four already carry precisely that link.
  They lack the ID and carry a stale label; they do **not** lack the durable reference.

**The condition, stated so it cannot be missed:** the normalization of these four must **replace the
stale label, never leave it standing.** The one mistake that preserves all four defects is *prepending*
an ID and leaving `[`dead path`](./brief.md)` after it — that satisfies the letter of the schema and
changes nothing. The recommended form is `Task: 0001 — [brief](./brief.md)` (ID added, label replaced
with a non-path word, target untouched); **`Task: 0001` alone is also correct and fully durable** —
§4.6 makes the link optional, and per **R19** this section does not add a requirement §4.6 declined to
make. What must not survive is the path *as the label*.

### 4.3 The frozen-ledger rule, engaged by name

The rule lives in `claude/skills/fkit-task-done/SKILL.md`. Quoted verbatim:

> **A link is not a claim; it is a pointer.** `➡️ Moved to Sprint 2 — priority 7` is *historically
> true and stays exactly as written* — the status cell, the priority, the prose, all byte-identical.
> Only the href moves, because a pointer to a file that is no longer there is not history, it is rot.
> — `fkit-task-done/SKILL.md:157-159`

> …**a historical record's *claims* are frozen; its *links* are not.**
> — `fkit-task-done/SKILL.md:164-165`

And, naming the exact file type at issue:

> **A hit in a sibling task folder's `plan.md`, `worklog.md` or `review.md`, or in
> `ai-agents/sprints/reviews/`** — same rule: re-point the href, change nothing else. […] **They
> record what happened, not where a file lives.**
> — `fkit-task-done/SKILL.md:170-174`

**The rule does not have to yield.** The `Task:` header falls on the **pointer** side of a line the
mover's own text already draws, and `:170-174` names `review.md` explicitly and already sanctions
re-pointing it. Re-pointing a header is the sanctioned act, not an exception to it.

The header escapes today on **two accidents**, neither of them a judgement that headers are frozen:

1. **A notation accident — for 55 of the 59 headers, and it costs something on 36 of them.** The
   mover's rule says *"re-point the href"*. Per the corrected **Fact C**, **55** headers are code spans
   or bare text (30 + 25), and a rule written in terms of hrefs does not visibly reach them. **Of those
   55, 36 name a dead path** and are the ones actually going unrepaired; the other **19** already
   resolve. *(Round-3 correction, R16: this read "56 of the 60", which counted `0080` — the one ledger
   with no `Task:` header at all. See §4.2.1.)*

   **The remaining 4 are the more damning case, not an exception.** Their href *was* reached: the
   target reads `./brief.md` and resolves. The mover re-pointed the **link** and left the **label** —
   a dead pre-migration path — sitting in the display text. So for these 4 the rule worked exactly as
   written and the reader still sees a dead path, because what a reader (and every agent doing a plain
   text scan) sees is the label. **This strengthens the case for repair rather than weakening it:** it
   shows that re-pointing hrefs is not sufficient even where it is applied, and that a location-free
   anchor is the only form with nothing left to rot.
2. **A scope accident.** `:170-174` is written for a hit in a **sibling** task folder's `review.md`.
   The dead header is in the folder's **own** `review.md`, pointing at its **own** brief — the one
   direction the clause was not written for.

### 4.4 The counter-argument, stated fairly

**An adopted recommendation does not excuse a one-sided section.** The case against repair:

- **A code span is arguably a claim, not a pointer.** ``Task: `…/backlog/0148-…/brief.md` `` can be
  read as *"on review day, this task's brief was in `backlog/`"* — which is **true**, and which the
  frozen-ledger rule protects. On that reading, rewriting it edits a historical claim.
- **ADR-034 covers it.** ADR-034 ruled that a review ledger closes on the **work product**, not the
  task's own record, and its closing line reads: *"Do **not** re-raise it merely because a closed
  ledger is found to contain a low-severity defect in its own brief, worklog or bookkeeping. **That
  is this decision working as ruled, not a defect.**"* A dead header in a task's own ledger is a
  textbook residual in the task's own record. **Doing nothing is a defensible answer**, and it was
  right that `0159`'s producer did not unilaterally fix its own.
- **Cost is not zero.** Any sweep touches 40 committed historical files.

**Why I rule for repair anyway.** Facts A and B remove the strongest practical objection: the header
carries **no information its own folder does not already carry**, so replacing it with a folder ID
loses nothing a reader could want — there is no claim to destroy because there was no independent
claim. And the drift is not benign: a dead path in an agent-read record is precisely the silent
failure §3.4 describes.

> **⚠️ Two recorded defects in the two paragraphs above, left standing by owner ruling.** The round-1
> reviewer found that (**R2**) this rebuttal *concedes* the strongest counter — that a code span may be
> a claim — and then *denies* it by assertion, because Fact A's method establishes **task identity**,
> not the absence of a claim about **where the brief sat on review day**; and that (**R3**) calling a
> dead path *"precisely the silent failure §3.4 describes"* inverts §3.4's own taxonomy, under which a
> path resolving to **nothing** is the **loud** category. **Both findings are correct.** The owner ruled
> on 2026-08-01, via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session, that they
> are **accepted residuals**: the case-3 remedy stands on the schema change, which no finding disputes,
> and only the quality of this argument is at issue. They are recorded here rather than silently
> repaired so that a later reader is not misled about how strong this paragraph is.

### 4.4.1 The four alternatives the brief mandates, weighed

The brief's `## What to build` item 3 requires weighing, *"at minimum: accept the dead paths; resolve
location at read time; write a location-free anchor going forward; append rather than rewrite."*
**The first draft of this report weighed only two of the four** (accept, and the location-free anchor)
— round-1 finding **R4**, correct, and this subsection is the repair. The owner's chosen remedy is
unchanged by it; what follows fixes the argument, not the conclusion.

**(a) Accept the dead paths.** Change nothing; the 40 stay, and new ledgers keep writing brief paths.

- *For:* zero touches on 40 committed historical files. Squarely inside ADR-034's own-record bar. It is
  what `0159`'s producer correctly did.
- *Against:* the **generator keeps running** — every future close manufactures another dead header, so
  the population grows without bound. Fact A shows the header carries no information its folder does
  not, so the thing being preserved is a pointer nobody needs and nobody can follow.
- **Rejected**, on the generator, not on the 40.

**(b) Resolve location at read time.** Leave every header exactly as written; a reader — or a tool —
recovers the task's current location by mapping the header's slug to a folder at the moment of reading.

- *For:* **it is provably feasible here.** Fact B is exactly that resolver's correctness proof: all 23
  flat variants map to exactly one folder, 0 ambiguous. It touches **no historical file at all**, so it
  is the strongest option on the "don't rewrite history" axis after (d).
- *Against, and decisively:*
  1. **No resolver exists, and nothing in fkit is positioned to run one.** A reader is a human or an
     agent doing a text scan. Naming a resolution *procedure* nobody executes is prose about prose —
     §10's own charge against this report.
  2. **The dead text still displays as authoritative.** A reader who does not run the resolver is
     misled exactly as much as today. Option (b) fixes the *recoverability* of the coordinate and not
     its *readability*, and readability is the failure.
  3. **A durable pointer sitting beside dead display text does not fix the display text.** The 4 href
     headers show it: their `./brief.md` target resolves — a live, location-free reference sitting right
     there — while the dead label stays in the display text. The working half is invisible; the broken
     half is what you see. **Corrected in round 3 (R21):** this objection previously read *"the 4 href
     headers are read-time resolution already shipping … that is (b) in production."* **That was a false
     equivalence.** (b) is defined two paragraphs above as resolving the header's **slug** *at the moment
     of reading*; `./brief.md` is a **static href authored into the file**, and nothing about it resolves
     at read time. The four are evidence for objection 2, not a specimen of (b). **This objection is
     therefore no longer labelled "decisive" on its own.**
  4. **The generator keeps running**, exactly as in (a).
- **Rejected** — and **the verdict does not depend on the corrected objection 3**: objections 1 (no
  resolver exists, and nothing in fkit is positioned to run one), 2 (readability is unfixed, which is
  the failure) and 4 (the generator keeps running) each stand on their own and none was disputed in
  round 2. It is the folder-ID answer with the durable part left out.

**(c) Write a location-free anchor going forward.** New ledgers carry `Task: <NNNN>`; the 40 existing
headers are left alone.

- *For:* stops the generator at the source. Costs the writer nothing (Fact A — the ID is the folder
  name they are already in). Makes the guard trivial and lookup-free (§7.1). Touches **no** historical
  file, so the R2 counter-argument — that a code span may be a claim about review day — is never
  engaged at all.
- *Against:* the 40 stay dead, and §4.6's scope note shows the corpus is wider than the header. A
  reader of a closed ledger is still misled; only new readers of new ledgers are helped.
- **Accepted as the forward half of the ruling.** On its own it is the *safest* option on the record and
  the *weakest* on the existing 40.

**(d) Append rather than rewrite.** Leave the original header byte-identical and add a dated correction
beneath it — e.g. `→ 2026-08-01: this task is 0148; its brief is in done/`.

- *For:* **this is the option that actually answers R2**, and it deserves more than the first draft gave
  it (which was nothing). If a code span is a claim about review day, appending destroys no claim while
  still telling the reader where to go. It has a **worked in-repo precedent this report already
  praises**: `ai-agents/wiki-vault/log.md:755`, `0159`'s appended correction, which §5.3 calls *"the
  §1.1 rider working — a reader can re-derive it."* Applying elsewhere the standard you praise here is
  the consistent position, and the first draft's failure to weigh (d) is what let that inconsistency
  stand.
- *Against:*
  1. **It saves none of the cost.** Appending to 40 files touches the same 40 committed historical
     files as rewriting them. The "cost is not zero" objection in §4.4 applies to (d) in full.
  2. **A naive append re-creates the class.** If the appended line names `done/0148-…/brief.md`, that
     path dies the next time the folder moves — to `cancelled/`, or under a future migration. (d) is
     only safe if the appended correction names the **folder ID**, at which point it is (c) plus a
     preserved dead line.
  3. **It weakens the guard.** §7.1's check becomes "parse two lines, decide which is authoritative"
     instead of "the ID equals the folder prefix". Two-line headers are a parsing surface; one-token
     headers are not.
  4. **The header is the weakest place to spend it.** Per Fact A the original line asserts nothing its
     folder does not already assert, so what (d) preserves here is a claim of near-zero content.
- **Rejected for the header — but explicitly recommended for the 16 body-level dead paths.** Where the
  dead path sits inside a **verbatim quotation** — the clearest specimen is
  `ai-agents/tasks/done/0148-…/review.md:79`, a word-for-word quote of the wiki completion flag —
  rewriting really would falsify a quote, and (d) is then the **right** answer: leave the quote intact,
  append the correction beside it. **This is a recommendation into §4.6's already-open scoping question
  for follow-ups 4 and 7. It is not a change to the ruled remedy**, which governs the 40 headers.

**The ruling is (c) plus a one-time application of (c) to the existing 40** — i.e. the forward half of
(c) with its retroactive half attached, rejecting (a) on the generator, (b) on readability, and (d) on
cost-without-benefit at the header while adopting (d) for verbatim quotations.

### 4.5 ADR-034's bearing, stated in both directions

The driver required this be stated, not ignored. **It bears two ways, in opposite directions.**

- **For accepting the dead paths:** ADR-034 makes `review.md` explicitly part of *"the task's own
  record"* and lets a residual there pass. This is the strongest argument in §4.4.
- **Against:** ADR-034's own re-raise conditions include *"A task's own record becomes **load-bearing
  for another consumer** — e.g. a guard, a report generator, or a downstream task that reads a
  worklog's numbers as input. Then that record is somebody's work product and this bar no longer
  covers it."* (`adr-034-…:148-150`). **A case-3 dead-path guard would itself be that consumer** — so
  recommending a guard partly self-triggers the escape hatch, which is circular and I will not lean
  on it.

**The ruling that avoids the circle:** ADR-034 governs the **individual instance**. **40 dead headers
across 60 ledgers is a corpus-level condition, not a per-task residual.** ADR-034 was right that
`0159`'s producer should not have fixed its own in isolation; it does not speak to the class.

**No re-raise of ADR-034 is proposed.** Nothing here asks the owner to reopen it.

> **⚠️ A recorded defect in this subsection, left standing by owner ruling.** Round-1 finding **R9**:
> ADR-034 is engaged **selectively** here. The re-raise condition that most directly applies —
> `adr-034-…:151-153`, *"The recorded own-record residuals are observed to **mislead a later reader or
> a later round**"* — is omitted, and an individual-vs-corpus distinction ADR-034 does not itself state
> is put in its place. **The finding is correct, and the omission cut against this report**: engaging
> `:151-153` would have supplied ADR-034's own sanctioned route to the same ruling and made the
> corpus-level argument unnecessary. The owner ruled on 2026-08-01, via `AskUserQuestion` in the live
> `/fkit-sprint-ship-loop` driver session, that this is an **accepted residual** — the ruling stands on
> the schema change, which no finding disputes. Recorded rather than repaired.

### 4.6 Ruling — **owner-ruled 2026-08-01: option (a)**

> **Change the ledger schema to carry the task folder ID going forward, AND perform a one-time
> normalization of the 40 existing headers.**
>
> Ruled by the owner on 2026-08-01 via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver
> session, on this report's recommendation.

**The new header form:**

```
Task: 0159
```

Optionally with a live relative link **beside** the ID, never in place of it. The ID is what
survives; the link is a convenience that may rot without taking the identity with it.

**Why this costs the writer nothing** — per Fact A, the ID is already sitting in the folder name the
file is in. The writer reads it off the directory they are already in.

**The 40 existing headers are a one-time pointer normalization, not a rewrite of claims.** Per Fact
B, every one recovers its ID with no lookup ambiguity, and per Fact A none of them ever said anything
its folder did not already say.

> **⚠️ Scope note the sweep must not miss.** The header is **not the whole corpus**. A whole-file
> scan of every `ai-agents/tasks/*/*/review.md` for `ai-agents/tasks/…\.md` paths finds **42 ledgers
> carrying at least one dead path**, against 40 dead headers.
>
> **The count of distinct dead paths, re-measured and disambiguated after round-1 review (R10).** The
> first draft printed *"57 distinct dead paths"*, which was a **mislabel** — three different real
> numbers were sharing one word. Corrected:
>
> | Number | What it actually counts |
> |---|---|
> | **55** | dead paths **distinct across the whole corpus** — the figure the word "distinct" should mean |
> | **57** | the **sum of per-ledger distinct counts**; a path cited in two ledgers is counted twice |
> | **56** | this report's own `40 header + 16 body`, which double-counts the **one** path appearing both as a dead header and in another ledger's body — `ai-agents/tasks/backlog/assert-task-ids-are-unique-in-the-test-suite.md` |
>
> **40 + 16 − 1 = 55.** All three numbers reproduce on re-run; only the label was wrong.
> Measured separately rather than inferred by subtraction: **14 ledgers carry a dead path *outside*
> their `Task:` header, totalling 16 distinct body-level dead paths** (17 by the per-ledger sum).
> The most visible is the
> verbatim wiki completion flag quoted at
> `ai-agents/tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/review.md:79`
> — see §5.2(ii). **The header schema change does not touch those.** Whether the sweep and the guard
> cover headers only or whole files is a scoping decision for follow-ups 4 and 7, and it is stated
> here so it is not discovered late.

---

## 5. Case 4 — mutable coordinates in the wiki completion flag

### 5.1 The candidate rule the brief asks me to rule on

`0160/brief.md:300-301`: *"folder ID and brief path only; no board rank, no `P<n>`, no `:NNN`"*.

### 5.2 Ruling — **RULED IN, but corrected: half of it already shipped**

**The ruling on the candidate rule is mine and is: IN — but IN on its *folder-ID* half only.**

> **⚠️ Corrected after round-1 review (R7).** The candidate rule reads *"folder ID **and brief path**
> only"*. The first draft ruled the whole of it IN, and then (ii) below proves the **brief path** half
> defective — the two paragraphs contradicted each other and no replacement form was named. Corrected:
> the **folder-ID** half is ruled IN, the **rank prohibition** is confirmed already shipped, the
> **`:NNN` prohibition** is ruled IN, and the **brief-path half is NOT ruled** — what replaces it is
> **open question 7 (§11), and it awaits the owner.** Follow-up 5 can be filed but not implemented
> until it is ruled.

**The rank half already exists, in all three wiki skills.** Quoted from
`claude/skills/fkit-wiki-ingest/SKILL.md:75-78`:

> **`<NNNN>` is the task folder name's four-digit prefix** (equivalently the brief's `## ID`) — the
> same four digits that open the path you emit, and the task's only identity. It is **never** the
> sprint board's rank / `P<n>` Priority cell, which is mutable and re-ranked; see
> `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`. Substitute real values.

The same block sits at `claude/skills/fkit-wiki-lint/SKILL.md:84-87` and
`claude/skills/fkit-wiki-sync/SKILL.md:119-122`. **The brief proposes this as new. It is not.**

> **Corrected after round-1 review (R12).** The first draft called all three *"byte-equivalent"*. That
> is true of **ingest and lint** — I diffed them and they are byte-identical — and **false of sync**,
> whose copy carries **0-space** leading indentation where ingest's and lint's carry **3**. The text is
> identical once stripped; the bytes are not. The distinction matters because §8.1 insists on exactly
> this care for `0168`, and an editor told "these are byte-equivalent" may normalize the indentation
> and produce a diff nobody asked for. **Follow-up 5's instruction is therefore "make the same textual
> change in all three", not "make the three blocks byte-identical."**

**So the live delta is exactly two things:**

**(i) `:NNN` is not prohibited.** The blocks above ban rank. They say nothing about line numbers.

**(ii) The mandated flag template hardcodes `backlog/` — so the flag is itself a case-3 generator.**
The template, verbatim from `fkit-wiki-ingest/SKILL.md:72-73` (and identically at
`fkit-wiki-lint/SKILL.md:81-82`, `fkit-wiki-sync/SKILL.md:116-117`):

> - complete → `Task <NNNN>'s vault work is complete — ready to close (producer runs /fkit-task-done on ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)`
> - partial or uncertain → `Task <NNNN>: partial — not ready to close (ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)`

Every flag this template emits names a `backlog/` path. **The template manufactures a dead path, and
the ledger that quotes it verbatim preserves it forever** — but the two forms get there by different
routes, and the first draft's blanket *"every flag is emitted about a task that is about to close"* was
**false for half the template** (round-1 finding **R15**, correct). Corrected:

- **`complete` → dead almost immediately.** The flag says *"ready to close"*; the producer runs
  `/fkit-task-done`; the folder leaves `backlog/` within the same working session. The path is dead
  before anyone reads it.
- **`partial or uncertain` → correct at emission, dead later.** This form says in so many words *"not
  ready to close"*, so the task genuinely is in `backlog/` when the flag is written and the path is
  **true at the time**. It dies whenever the task eventually closes or is cancelled — which may be
  weeks later, or, for a task that sits in `backlog/` indefinitely, never.

**The by-construction conclusion survives for both**, because a `partial` flag quoted verbatim into a
ledger is frozen text while the folder it names is not. What differs is the delay, and that only makes
the `partial` form worse to detect: it is a pointer that was *demonstrably correct when written*, which
is the exact profile §3.4 identifies as the dangerous one.

The specimen is `ai-agents/tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/review.md:79`,
exactly as the brief names it — a verbatim quote of the flag, carrying a `backlog/` path for a task
now in `done/`. **Ruling case 4 without noticing (ii) would leave the generator running.**

### 5.3 The live specimens in `log.md`, confirmed today

Read read-only from `ai-agents/wiki-vault/log.md` (857 lines). **Nothing was written to the vault.**

| Line | What it carries | State today |
|---|---|---|
| `:447` | *"Task `0148` (priority 125, `🔲 Backlog`, owner `fkit-wiki`)"* | **still carries a board rank** |
| `:683` | *"`ai-agents/sprints/sprint-2.md:162` — task 0148's board row"* | **wrong today** — `:162` is `0157`'s row |
| `:743` | *"`ai-agents/sprints/sprint-2.md:162` still describes task 0148…"* | **wrong today**, same reason |
| `:755` | `0159`'s appended correction: *"It is `:164` (rank P132) […] `:162` is task `0157`'s row (P130)"* | **currently accurate** — verified against the live board |

`:755` is the case in miniature: a correction that is **accurate today** and whose accuracy depends
entirely on nobody inserting a row above line 162. It carries a paired identification (*"task
`0157`'s row"*), which is the §1.1 rider working — a reader can re-derive it. That is the difference
between a repairable pointer and a silent lie.

Further prose rank citations found in the same read-only scan, recorded for the sweep's scoping:
`:116`, `:270`, `:283`, `:448`, `:449`, `:453`, `:689`, `:803`, `:809`. Most are historical entries;
**I have not classified which are live claims and which are frozen history, and I flag that as
unverified** — it is follow-up 5's scoping question, not this report's ruling.

### 5.4 Must case 4 agree with `0165`?

**Not *agree* — but case 4 must land first.**

`0165` decides **where a check lives**. Case 4 decides **what the flag may contain**. A check written
before the content ruling would pin today's form, including the `backlog/` hardcode that (ii) shows
is defective. Content first, then the check.

**Both changes land in `claude/skills/fkit-wiki-*/SKILL.md`, so this joins the `SKILL.md`-walk
claimant queue** alongside `0136`, `0152` and `0154`. Said out loud, as the brief demands. It is
named as a **producer follow-up** (§8, item 5) and **is not performed here**.

---

## 6. Case 5 — **RULED OUT OF CLASS, by name, and handed back**

**This is verification step 10, option (b), and the owner ruled it on 2026-08-01** — reversing their
own 2026-07-30 routing decision to do so.

### 6.1 The ruling, in this report's own words

> **Case 5 is a rule-consequence question, not a stale-coordinate question.** It does not belong to
> `0160`'s class and no anchor form answers it.

Three reasons:

1. **Nothing in it is stale.** No citation in case 5 is wrong. The wall clause in
   `/fkit-task-brief` step 5 is, in the brief's own words, *"operable and correctly reasoned"*.
2. **No citation is misdirected.** There is no coordinate to repair.
3. **The remedy spaces do not overlap.** Cases 1–4 ask *"what should I write instead?"*. Case 5 asks
   *"how does the owner express an ordering intent that rank can no longer carry?"* — which shares
   **no candidate answers** with headings, folder IDs, quoted snippets or relative ordering.

**This agrees with the recording producer's on-record dissent** (`0160/brief.md:360-367`), which
judged case 5 out of class on class grounds while defending its routing on surface-collision grounds.
The dissent was right on the merits.

**Under verification step 10, case 5 is NOT counted in the "four cases" of steps 1 and 5.**

### 6.2 The re-measurement — published so the successor task starts live

I publish this **even though I am ruling case 5 out**, because the successor should not inherit
expired numbers, and because the re-measurement **strengthens** the handback.

**Method, 2026-08-01.** Every line in `ai-agents/sprints/sprint-2.md` matching `\|\s*P\d+\s*\|`.
Status taken from **field 1 of the pipe-split only** — see the §0 warning about why the whole-row
form is wrong. Closed = the status cell **starts with** `✅ Done`, `⛔ Cancelled` or `➡️ Moved`.
Open rows segmented between consecutive closed rows.

| Measure | 2026-07-30 (brief) | **2026-08-01 (this report)** |
|---|---|---|
| Board rows with a `P<n>` cell | 145 | **148** |
| Closed | 121 (83%) | **123 (83%)** |
| Open | 24 | **25** |
| Disjoint open segments | 6 | **6** |
| Open rows unreachable from the append zone | **11 of 24** | **17 of 25** |
| Singletons (can never move at all) | 2 | **1** |

Today's six segments — an owner-ruled re-rank can move a row **only within its own segment**:

`P113 P114` · `P119–P122` · **`P124`** · `P127–P129` · `P133–P139` · `P141–P148`

New work appends at the bottom, landing in the **8-row** bottom segment `P141–P148`. The only open
status values on the board are `🔲 Backlog` (24) and `🔄 In progress` (1) — the classifier is not
silently dropping a status it did not recognize.

### 6.3 Why the re-measurement strengthens the handback

- **Unreachable open rows went 11 → 17 in two days.** The mechanism is confirmed and **worsening**,
  faster than the brief's framing suggests.
- **The brief's own named specimen has expired.** `0160/brief.md:174-175` names `P131` (`0161`) as a
  *"singleton that can never move at all"* and `:177-182` calls it *"the proof, generated by the
  close that found it"*. **`0161` closed.** `P131` is now `✅ Done` at `sprint-2.md:163`, and the only
  singleton today is **`P124`** (task `0143`, *"Append a dated correction note to ADR-010"*).

A finding whose headline proof case expires in two days while its underlying mechanism gets worse is
a finding that needs its **own** task with its **own** live measurement — not a citation-shaped answer
bolted onto a report about anchors.

**Named as follow-up 6 in §8, for the producer to file. It is not filed here.**

---

## 7. Enforcement — the honest ceiling

Verification step 4 requires each proposed guard name **the file it lives in and the condition it
asserts**, or say *"nothing can enforce this"* in those words.

| Case | Can it be enforced? | File | Condition |
|---|---|---|---|
| 1 | **Already is** | `test/dashboard-contract.test.js` | shipped; see `conventions/priority-is-rank-not-identity.md:49-54` |
| 2 | **The policy: yes. The meaning: no** | `test/coordination-citation-policy.test.js` (new) | policy half: **no `:NNN` citation targets a coordination document** — full condition in §7.2. Meaning half: **nothing can enforce this** |
| 3 | **Yes** | a new file under `test/` | see §7.1 |
| 4 | **No, today** | — | **nothing can enforce this** — and whether a check is ever written is `0165`'s question, not mine |
| 5 | **No** | — | **nothing can enforce this** |

> **Two corrections after round-1 review.** The case-2 row read *"No — nothing can enforce this"*
> (finding **R8**) and the case-4 row read *"`0165`'s question, not mine"* (finding **R14**). Both were
> defects and both are corrected above. R8: a guard cannot verify a **cited line still means what the
> citer meant**, but it can check the **policy** — the same shape as case 1's already-shipped
> enforcement — and the first draft collapsed those two into one "no". R14: the brief's verification
> step 4 requires a file and a condition **or** the literal words *"nothing can enforce this"*; a third
> answer is not one of the options, however defensible the deferral to `0165` is. Case 4 is unenforced
> today, that is what the row now says, and the `0165` deferral is recorded beside it rather than in
> place of it.

### 7.1 Case 3 — the only genuinely mechanical check

**File:** a new test under `test/`, run by `npm test`'s existing `node --test test/*.test.js` glob.
No new devDependency, consistent with ADR-014.

**Condition:** *for every `review.md` under `ai-agents/tasks/`, the path named by its first `Task:`
line resolves on disk.* Under the §4.6 folder-ID schema the condition becomes stronger and simpler:
*the ID on the `Task:` line equals the `NNNN` prefix of the folder the file is in* — a check with no
filesystem lookup and no ambiguity.

**Its ceiling:** it checks the **header**. Per the §4.6 scope note it does **not** reach the **16**
dead paths sitting in ledger **bodies** across 14 ledgers, unless deliberately widened to whole-file
scanning — which raises its false-positive surface, because a ledger may legitimately quote a
historical path inside a verbatim block (`0148/review.md:79` is exactly that).

**Owner-ruled 2026-08-01 (open question 6, §11): this guard IS named** — as follow-up 7, **filed LOW
and sequenced after follow-ups 3 and 4**, because its value is regression cover for the sweep.

### 7.2 Case 2 — the policy is checkable; the meaning is not

**Corrected after round-1 review (R8).** The first draft answered case 2 with a flat *"nothing can
enforce this"*, having considered only one candidate — a line-count assertion — and generalized from
its failure. That conflated two different things, and only one of them is unenforceable.

**The half that is unenforceable, unchanged and still true.** A line-count assertion (*"`sprint-2.md`
has at least N lines"*) is writable and worthless: it catches **deletion only**. **No check can verify
that line N still says what the citer meant** — the actual failure mode, demonstrated at
`log.md:683`/`:743`, where the file grew, the line survived, and the claim became false. For that half:
**nothing can enforce this.** The §1.1 paired-quote rider makes a drifted pointer *detectable by a
reader*; it is not a check, and no check reaches it.

**The half that is enforceable, and was wrongly given away.** §3.3's recommendation is **syntactic** —
*"stop using `path:NNN` for coordination documents"* — and a syntactic rule is exactly what a test
checks. This is the same shape as case 1, which §7 records as **already enforced** by
`test/dashboard-contract.test.js` (file confirmed present). A guard of this shape would have caught the
original 11-pointer incident at the commit that introduced it.

**File:** `test/coordination-citation-policy.test.js`, a new file picked up by `npm test`'s existing
`node --test test/*.test.js` glob. No new devDependency, consistent with ADR-014.

**Condition:** *no line in the scanned set contains a citation `<path>:<NNN>` whose `<path>` names a
coordination document* — that is, matches `ai-agents/sprints/*.md`, `ai-agents/tasks/*/*/brief.md`, or
`ai-agents/wiki-vault/log.md`.

**Four things whoever writes it must decide, stated now so they are not discovered late. Decision 4 is
the biggest of them and was missing from this list until round 4 (R27); it is now owner-ruled.**

1. **The scanned set is a real decision, not a detail.** Scanning `ai-agents/tasks/*/*/*.md` and
   `ai-agents/sprints/*.md` is the defensible core. Widening it to
   `ai-agents/knowledge-base/reports/` would fail on **this report**, which cites `sprint-2.md:162` in
   §3.4 as the specimen it is diagnosing.
2. **A quotation is not a citation, and a regex cannot tell them apart.** §5.3 quotes `log.md`'s
   defective lines verbatim *as evidence*; `0148/review.md:79` quotes a wiki flag verbatim. The guard
   needs a stated convention — the workable one is to skip fenced blocks and blockquote lines — or it
   punishes the reports that document the defect.
3. **It is red today, far redder than the round-2 draft said, and the size depends entirely on
   decision 4 below — not on decision 2.** *(Corrected in round 5, R27: this sentence and the one that
   closed this item both blamed decision 2, which the table's own footnote says changes nothing.)*
   **Re-measured in round 3 (R18)** by running §7.2's **own** condition over §7.2's
   **own** *"defensible core"* scanned set (`ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md`),
   skipping fenced blocks and blockquote lines per decision 2:

   | Reading of *"names a coordination document"* | Citations | Files | …of which in closed `done/*/review.md` |
   |---|---|---|---|
   | **Literal full path only** — `ai-agents/sprints/*.md:NNN` etc. | **38** | **19** | **27** across 11 files |
   | Literal, **plus elided prose paths** like `ai-agents/tasks/done/0119-…/brief.md:26` | **39** | **20** | **28** across 12 files |
   | **Resolved shorthand too** — bare `sprint-2.md:354`, `0159/brief.md:13` | **391** | **53** | **264** across 28 files |

   Skipping fenced blocks and blockquotes changes **nothing** under either literal reading (38 either
   way). **The round-2 draft's figure — "the three external citations in §3.1 plus the three inside
   `0160`'s own brief", six in total — understated the literal reading by ~6.3× and the shorthand
   reading by ~65×.**

   **Two consequences the round-2 draft got wrong and this replaces:**

   - **The vault-scope framing was a category error.** `log.md:683`/`:743` are cited **from**
     `ai-agents/tasks/done/0148-…/review.md:17-18`, squarely inside the stated scanned set. **The
     condition tests the target, not the citing file**, so whether the vault is scanned is irrelevant to
     those two. *(The separate, still-true point: any cleanup **inside** `ai-agents/wiki-vault/` must be
     done by the `fkit-wiki` role, its exclusive writer.)*
   - **The condition misses the specimen §7.2 lists first.** `0013/brief.md:28` writes
     ``[`sprint-2.md:354`](../../../sprints/sprint-2.md)``; the bare `sprint-2.md:354` does **not** match
     `ai-agents/sprints/*.md`, so the guard as specified would not flag the very first violation this
     section names. **Verified in round 3 by running both patterns against that line.** `0160`'s own
     brief cites the same way at `:40`, `:89`, `:113`. **What that turns on is decision 4 below — the
     reading of *"names a coordination document"* — which is the difference between a 38-citation
     cleanup and a several-hundred-citation one, and between a guard that catches those four specimens
     and one that does not.** *(Round-5 correction, R27: this sentence previously said "decision 2",
     which is the fence/blockquote convention and, per the table footnote fifteen lines above, changes
     nothing — 38 either way.)*

4. **Which reading of *"names a coordination document"* the guard's condition uses — literal full path,
   or resolved shorthand too. This is the decision that swings everything**, and until round 4 it was
   discussed in this section but never listed here as a decision (R27). It sets the size of the cleanup
   (38 vs several hundred), and it decides whether the guard catches the specimens this section names
   first. **It is now owner-ruled — see the box directly below.**

> ### 🔒 OWNER RULING, 2026-08-01 — follow-up 8 ships on the LITERAL reading, and the shorthand
> extension is a separate named decision
>
> **Decision 4 above is ruled: the guard's shipping condition is specified on the LITERAL full-path
> form.** Any extension to resolved shorthand (bare `sprint-2.md:354`, `0159/brief.md:13`) is **filed as
> its own explicitly named decision, with its own measured cost** — it is not folded into this guard and
> not folded into decision 2.
>
> **Why: literal is the only reproducible reading.** Run independently, the reviewer, Codex and I all
> land on the same literal figures — **38 citations / 19 files**, **27 of them** inside closed
> `done/*/review.md`. The shorthand reading did **not** reproduce across those same three runs:
> published **391 / 53**, Codex **399 / 53**, reviewer **296–318 / 46–48**. **A test's acceptance
> criterion must be reproducible**, and a figure that moves by ~30% depending on whose pattern resolves
> the shorthand cannot be one.
>
> **⚠️ The cost the owner accepted, stated plainly so "literal" is not read as "complete": the guard is
> knowingly incomplete on day one.** The literal condition **misses this section's own lead specimen** —
> `0013/brief.md:28`'s ``[`sprint-2.md:354`](../../../sprints/sprint-2.md)``, where the visible label is
> bare shorthand — and it misses `0160`'s brief at `:40`, `:89`, `:113` the same way. **Those violations
> are real and the shipped guard will not flag them.** That is the accepted trade: a guard that is
> reproducible and green-able now, over a guard that catches more and cannot be agreed on.

> ### 🔒 OWNER RULING, 2026-08-01 — the closed ledgers are grandfathered, by name
>
> Cleaning the 27 citations that sit inside closed `done/*/review.md` ledgers would mean editing
> **frozen historical ledgers** — colliding head-on with the frozen-ledger rule §4.3 engages by name and
> with ADR-034. The owner ruled, via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver
> session: **follow-up 8's policy applies going forward only. Citations already inside closed
> `done/*/review.md` ledgers are exempted by name.** This is consistent with the frozen-ledger rule this
> report's own case-3 argument relies on.
>
> **The cost the owner accepted, stated rather than glossed: the guard must carry the exemption from day
> one, or it is red on historical files the ruling has decided will never be cleaned.** It is not an
> optimization to add later; it is part of the guard's definition.
>
> **What the exemption does *not* cover, so it is not discovered late:** it names `done/*/review.md`
> only. `done/*/brief.md` and `done/*/worklog.md` are **not** exempt. **After the exemption the red set
> is 11 citations across 8 files** on the ruled literal reading — 6 in `backlog/` briefs, 3 in
> `ai-agents/sprints/`, 2 in non-`review.md` files under `done/`.
>
> **📅 As of 2026-08-01, and that date is load-bearing (R30).** Re-measured in round 3, and re-derived
> independently in round 5 by running §7.2's own condition over §7.2's own scanned set — **38 / 19
> total, 27 / 11 exempt, 11 / 8 residual**, unchanged. But **the scanned set
> (`ai-agents/tasks/*/*/*.md`) contains this task's own still-growing ledger**, so every figure here is a
> snapshot, not a durable fact: the *elided* reading has already drifted from 39 / 20 to 42 / 21 as this
> ledger grew, and the shorthand reading drifted from 127 / 25 to 130–135 / 25 across reviewers.
> **Whoever files follow-up 8 must re-measure at filing time rather than quoting this number.** The
> literal figures are the stable ones — unmoved across **four** independent runs (round-3 author,
> round-4 reviewer, round-4 Codex, round-5 re-derivation) — which is part of why the literal reading was
> ruled.

**Whether the guard "lands after a cleanup" or ships with the exemption is now settled: it ships with
the exemption, and the remaining red set above is what must be cleaned before it goes green.** Shipping
it red is still not an option.

**Named as follow-up 8 in §8.**

### 7.3 Case 5 — **nothing can enforce this**

There is nothing to assert. The question is what an owner writes down, not what a file contains.

---

## 8. Follow-ups — named, not written

**The producer files these. Naming them is this task's deliverable** (`0160/brief.md:269-271`,
`:339-340`). None is written here.

**There are eight.** The first draft named seven; **follow-up 8 was added after round-1 review**
(finding **R8** — §7.2 had wrongly given case 2 away as unenforceable in full).

| # | Follow-up | `## Owner` | Priority / depends on |
|---|---|---|---|
| 1 | **A citation convention page** — `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`, carrying §1's rule, the §1 table, **§1's R22 scope note on what the claim-vs-pointer question does and does not settle**, the §1.1 rider, §1.2's ledger-row practice note, **and §4.2.1's link-label writer rule in its narrowed R20 wording — *"do not use a mutable location as the visible label of a forwarding link into a living document"*, NOT the withdrawn `never`**. **Dual-homed** — owner-ruled; see §11 | `fkit-architect` | this ruling |
| 2 | **Narrow the architect's `## Output format` bullet** — `claude/agents/fkit-architect.md:128-129`, per §1.2 | `fkit-producer` to file; coder to edit | follow-up 1 |
| 3 | **Change the review-ledger schema line to a folder-ID anchor** — both stateful-review skills; the `Task:` line only, per §8.1. **This is `0168` item 2** | `fkit-coder` | §4.6 (owner-ruled) |
| 4 | **One-time normalization of the 40 dead headers**. **This is `0168` item 1**. Its scope must state whether it reaches the 16 body-level paths — where §4.4.1(d) recommends **appending** a correction, not rewriting a verbatim quote | `fkit-coder` | follow-up 3 |
| 5 | **Tighten the wiki flag block** — add the `:NNN` prohibition and **replace the hardcoded `backlog/` path in the template**, all three wiki skills (same textual change, **not** byte-identical blocks — §5.2 / R12). Joins the `SKILL.md`-walk queue (`0136`, `0152`, `0154`) | `fkit-producer` to file | §5.2; **⏳ open question 7** — the replacement form is unruled; lands **before** `0165` |
| 6 | **Case 5, handed back as its own task** — *"decide how an owner records a merit ordering that board rank can no longer carry"*. **The owner ranks it explicitly at filing** — owner-ruled; see §11 | `fkit-producer` to file; likely `fkit-architect` to rule | §6 (owner-ruled) |
| 7 | **A dead-ledger-path guard** — file and condition in §7.1. **Named, filed LOW, and sequenced after follow-ups 3 and 4** — owner-ruled; see §11 | `fkit-coder` | **LOW**; after follow-ups 3 and 4 |
| 8 | **A coordination-citation policy guard** — `test/coordination-citation-policy.test.js`; file, condition and its **four** scoping decisions in §7.2. **🔒 Two owner rulings of 2026-08-01 that it MUST carry from day one.** (a) **The exemption:** the policy applies going forward, and citations already inside closed `done/*/review.md` ledgers are exempt by name — without it the guard is red on 27 citations in frozen historical ledgers the owner has ruled will not be cleaned; the exemption covers `review.md` only, `done/` briefs and worklogs are **not** exempt. (b) **The reading:** the condition ships on the **literal full-path** form (decision 4) — the only reproducible one. **⚠️ It is therefore knowingly incomplete: it will not flag `0013/brief.md:28`'s bare `sprint-2.md:354`, the specimen §7.2 names first.** Extending it to resolved shorthand is **a separate named decision with its own measured cost** — file it as such, do not fold it in | `fkit-coder` | after cleaning the residual §7.2 measures: **11 citations across 8 files as of 2026-08-01** — 6 `backlog/` briefs, 3 in `ai-agents/sprints/`, 2 non-`review.md` under `done/`. **Re-measure at filing time; the scanned set contains `0160`'s own growing ledger** |

**Follow-ups 7 and 8 are a pair.** Both are syntactic policy guards under `test/`, both were named late,
and both are worth more after the corpus they guard has been cleaned than before. Whoever files them
should consider one task with two conditions rather than two tasks — noted as a producer judgement,
not a ruling.

### 8.1 A parity warning for follow-up 3

`0168` records the two stateful-review skills' ledger schema as *"declared shared and must stay
byte-identical"*. **I verified this myself rather than taking it, and it is not literally true today.**

Diffing `fkit-stateful-review/SKILL.md:44-63` against
`fkit-process-stateful-review/SKILL.md:49-68` (the fenced schema blocks) gives **exactly two
differing lines**, both role-relative point-of-view annotations:

```
- ## Reviewer findings        ← YOUR section. You write/append rows here.
+ ## Reviewer findings        ← REVIEWER-owned. You READ this; never edit its rows.
- ## Coder response           ← CODER-owned. You READ this for context; never write it.
+ ## Coder response           ← CODER-owned (yours). You write one row per finding.
```

**Everything else inside both fences is byte-identical, including the `Task: <path to task file>`
line** at `fkit-stateful-review/SKILL.md:47` and `fkit-process-stateful-review/SKILL.md:52`. The
surrounding prose differs more substantially and **is deliberately role-specific**.

**So follow-up 3's instruction must be "change the `Task:` line identically in both", not "make the
blocks byte-identical"** — the latter would flatten two intentional annotations. Flagged so a coder
acting on `0168` does not over-apply it.

### 8.2 What `0168` receives — and how its scope changes

`0168` is **kept** (owner-ruled, 2026-08-01) as the pre-filed execution arm of this ruling. Its scope
is derivable from §4 without editing its brief, which I have not done.

**It receives:**

- The case-3 ruling: **folder-ID schema going forward + one-time normalization of the existing 40**.
- The three-variant treatment (§4.1): 17 current folder-form, 14 pre-migration flat `backlog/`, 9
  pre-migration flat `done/`.
- The confirmed population: **40 dead / 31 `backlog`-form / 9 `done`-form / 1 no-header, of 60
  ledgers in 124 folders** — matching its own figures, independently derived.
- **Fact A**: all **59** headers name their own folder; **0** name a different task.
- **Fact B**: all **23** flat variants recover a folder ID; **0** are ambiguous.
- **Fact C — CORRECTED after round-1 review; `0168` received the false version and must not act on
  it.** The relayed figure was *"0 of 60 headers are markdown hrefs"*. **It is 4 of 59 headers** (60
  files, one of which — `0080` — has no `Task:` header at all). The other **55** are code spans and bare
  text, which is why the mover's href rule never reached them; the 4 hrefs carry a **live** `./brief.md`
  target behind a **dead** label, which is why re-pointing hrefs is not sufficient even where it
  happens. See §4.2 and §4.3.
- **⭐ The split `0168` executes against: `40 dead = 36 Gap A + 4 Gap B`.** 36 dead non-href headers
  (26 code span + 10 bare) the mover's rule cannot reach, and 4 dead-labelled hrefs it reaches and
  correctly declines to change. *(Round-3 correction, R16: this bullet previously said "the other 56 are
  code spans and bare text" — wrong by one because it counted `0080`, which is neither, and it never
  printed the 36/4 split at all.)*
- **The §4.2.1 Gap A / Gap B ruling — added in round 2, and the thing `0168` must execute against for
  the 4.** Without it `0168` reaches `0001`, `0010`, `0022`, `0039` with no ruling and has to stop.
  **Read §4.2.1 as amended in round 3**: `Task: 0001` alone is a correct normalization (R19), and the
  binding condition is that the **stale label must be replaced, never left standing** beside a new ID.

**What `0168` does with the 4 — confirming its brief's current instruction, with one addition.**

`0168`'s brief (not edited by me — the producer owns it) says: *treat as text-only, do not re-point, do
not unwrap, break no working link.* **All four clauses are correct under §4.2.1**, and each for a
reason worth stating:

- *do not re-point* — **right.** The target `./brief.md` is already correct and move-proof. Re-pointing
  is a no-op at best; anything that replaces it with an absolute or board-qualified path makes a
  currently-immortal link mortal.
- *do not unwrap* — **right, and it is the clause most likely to be violated by a well-meaning sweeper.**
  Unwrapping to a bare path discards the working half and keeps the dead half.
- *break no working link* — **right, and it is the binding constraint.** These four are the only headers
  in the corpus with anything working to break.
- *treat as text-only* — **right in substance, and under-specified in one way that matters.** "Text-only"
  correctly says the repair touches the label and not the target. It does **not** say the label must be
  **replaced** rather than left standing beside a new ID — and per §4.2.1 that is exactly the reading
  under which all four defects survive a fully "successful" sweep.

**The addition `0168` needs, therefore:** for these four, the normalized header is
`Task: 0001 — [brief](./brief.md)` — **ID added, label replaced with a non-path word, target untouched.**
The label must stop *being* a path; that is what stops it rotting again.

**One correction to that recommendation, round 3 (R19, owner-ruled).** This previously added *"dropping
the link to satisfy the schema is also wrong."* **It is not wrong.** §4.6 makes the link **optional**, so
`Task: 0001` on its own is the canonical ruled form and is fully durable. The form above is
**recommended** because the working target already exists; it is **not required**, and `0168` must not be
told otherwise. **The binding constraint is narrower and unchanged: the stale path label must be
replaced, never left standing beside a new ID.**

**Recommended, not imposed:** this is a reading of the ruled remedy for a subcase the remedy did not
name, not a new remedy. **I did not edit `0168`'s brief.**

**Does the ruling change `0168`'s scope? Yes, materially, and in its favour.**

- **Its item 1 (the sweep) gets simpler.** With a folder-ID anchor, flat variants 2 and 3 stop being
  *"no live path to re-point to"* — the ID is read off the folder the file is already in. **No slug
  lookup is needed at all.** Fact B's map was needed to *prove* recoverability; the repair does not
  need it.
- **Its item 2 (the schema) becomes the load-bearing half**, exactly as its own brief predicts (*"a
  sweep alone fixes nothing durably"*). See §8.1 before touching both files.
- **Its item 3 (the movers) gets an answer: the movers gain no new duty.** The schema change removes
  the path, so there is nothing left to re-point. `fkit-task-done/SKILL.md:170-174` needs no
  amendment for the header.
- **Its item 4 (`cancelled/`)**: the rule covers it, and **there is nothing to sweep** — checked
  positively, not inferred: `ai-agents/tasks/cancelled/` holds **11 task folders and 0 `review.md`
  files**. A cancelled task never reached review, so the class cannot arise there today. If one ever
  does, the folder-ID schema covers it with no extra rule.
- **Its item 5 (`0080`'s missing header)**: **in scope but trivial** under a folder-ID schema — the
  ID is `0080` and is read off the folder name.
- **Its `## Notes` "Blocks: nothing" line** — `0160/brief.md:316` — **is now false**; `0168`
  hard-depends on this ruling. **Not edited by me.**
- **The §4.6 scope note applies to `0168`**: 42 ledgers carry ≥1 dead path and **55** globally distinct
  dead paths exist (not the 57 the first draft printed — see §4.6's corrected table), against 40 dead
  headers. If `0168` is header-scoped, **16** distinct body-level paths remain across 14 ledgers, and
  that should be a stated residual rather than an unnoticed gap. §4.4.1(d) recommends **appending** a
  correction rather than rewriting wherever such a path sits inside a verbatim quotation.

---

## 9. Defects found in the brief — recorded, not repaired

**I edited nothing in `0160/brief.md`.** Every item below is reported for the producer.

1. **Verification step 8 names the wrong test command.** `0160/brief.md:296` says `node --test
   test/`. That omits `test/prove-red.sh` and does not match the project's own script. Per
   `package.json:5`: `"test": "node --test test/*.test.js && bash test/prove-red.sh"`. **I ran
   `npm test`** and flag the defect rather than silently substituting.
2. **Every case-3 count in the brief is wrong or wrongly-measured** — 30 (`:327-328`), *"the 31st
   specimen"* (`:333`), 35 (`:334-335`). The 35 came from `grep -rl 'tasks/backlog/'`, which counts
   ledgers citing **siblings**. The header population is **40** (§4.1). The brief's own instruction
   (*"Neither number is authoritative […] re-measure and state the method"*) was followed.
3. **`## Notes` "Blocks: nothing" (`:316`) is now false** — `0168` hard-depends on this task.
4. **Case 5's figures are stale and its named specimen has expired** — 145/121/24/11/2 →
   **148/123/25/17/1** (§6.2). `0161`, the brief's proof case at `P131`, **closed**. Today's only
   singleton is `P124` (`0143`).
5. **Case 4's premise is half-stale** (§5.2) — the *"no board rank / `P<n>`"* prohibition **already
   exists** in all three wiki skills. The brief proposes it as new.
6. **Verification step 1 self-contradicts steps 9 and 10.** Step 1 (`:276-277`) still says *"all
   three cases"*; steps 9 (`:302`) and 10 (`:310`) amend it to four. A literal reader of step 1 alone
   would fail a compliant report.
7. **Case 2's "12 pointers into `sprint-2.md`" is now 6**, and **3 of those 6 are inside `0160`'s own
   brief** — the live external corpus is **3** (§3.1).
8. **The soft-ordering note (`:321-324`) is satisfied, not a defect** — `0161` closed; no workaround
   was needed. Recorded because the ordering was a stated preference.
9. **Verification step 6 is unmeetable on its literal wording by any worker inside a driver session.**
   It requires `git diff --stat` to show no file under `ai-agents/tasks/` or `ai-agents/sprints/`,
   but `/fkit-sprint-ship-loop` edits the board and the in-flight brief as a normal part of running.
   The step should be scoped to *files changed by this task* rather than to the whole working tree —
   e.g. by diffing against the run's starting revision. See §12 for how it was handled here.

**Operational note on method, recorded for anyone re-running this.** Context regexes of the form
`.{0,80}(…)` against `sprint-2.md` backtrack catastrophically on its multi-thousand-character rows.
Every measurement here used line-oriented scanning or `git show` piped to a per-line scan instead.
Separately, a `grep` returning nothing was never treated as proof: the case-2 corpus was
wrap-normalized and re-counted (§3.1), and the case-3 corpus was classified by **positive existence
test** (§4.1) rather than by absence of a match.

---

## 10. What stays unenforced after all of it

Stated plainly, as `0160/brief.md:341-342` requires.

- **Case 2 is unenforced today, and half of it is unenforceable in principle.** Corrected after
  round-1 review (R8), because the first draft claimed the whole of it was unenforceable:
  - **The meaning: nothing can enforce this.** No test can tell that a line number still means what
    its writer meant. The paired-quote rider (§1.1) makes drift *visible to a reader*; it does not
    make it *detectable by a machine*.
  - **The policy: enforceable, named, unwritten.** Follow-up 8 / §7.2 gives it a file and a condition.
    It does not exist, and it would fail red today until the cleanup §7.2 names has happened.
- **§1.2's ledger-row practice note is unenforced.** The ledger schema's `file:line` column has no
  paired-quote requirement and follow-up 3 deliberately does not add one. Putting the quoted fragment
  in the `Claim` cell stays a convention a reviewer follows or does not.
- **Case 5 is unenforced. Nothing can enforce this**, and it has been handed back besides.
- **Case 4 is unenforced today.** The rank half exists as **prose in three skills**; nothing checks
  it. The `:NNN` half and the `backlog/` template fix are not written at all. Whether any of it gets
  a check is `0165`'s question.
- **Case 3 has the strongest mechanical answer**, and that guard is now **named** (owner-ruled, open
  question 6) but **unwritten**, and deliberately filed LOW behind the sweep.
- **§1.2's narrowing of `claude/agents/fkit-architect.md:128-129` is unenforced**, and the file is
  **unedited** — the change surface here is report-only.
- **The convention page in follow-up 1 does not exist.** Until the producer files it and a coder
  writes it, this rule lives in a **dated report**, which
  `knowledge-base/reports/README.md` is explicit is a record of a moment, not the living canon.

> **This is prose about prose, and it is unenforced.** A recommendation existing is not a thing
> checking it. Nothing in this report changes what any agent will do tomorrow. What changes behaviour
> is follow-ups 1–8, and **not one of the eight is implemented.**
>
> **Corrected after round-1 review (R11).** The first draft said *"not one of them is written"*, which
> was false in the sense a producer would read it: **follow-ups 3 and 4 are already filed** — they are
> `ai-agents/tasks/backlog/0168-remediate-the-dead-brief-paths-in-closed-review-ledger-headers/`, which
> §8 itself labels *"this is `0168` item 2 / item 1"*. **Filing them again would duplicate `0168`.**
> Precisely: **two of the eight are filed and unimplemented (3 and 4, as `0168`); six need filing
> (1, 2, 5, 6, 7, 8); none of the eight is implemented.**

---

## 11. Open questions — three ruled by the owner, one newly raised and open

**The first draft carried three open questions. The owner ruled all three on 2026-08-01, via
`AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session. Round-1 review raised a fourth
(finding R7), which is open.** I decided none of them silently.

**Open question 3 — is the case-5 successor task filed ranked-high now, or left in the append zone?**
Filing it in the append zone lands it at roughly `P149`, inside the bottom segment — where, per §6.2,
it can never be promoted past the closed row at `P140` however good its merit case. That is the very
mechanism the task exists to fix, and filing it that way is an instance of the defect. Filing it
ranked-high requires an owner re-rank, which only the owner may do.
My recommendation was: the owner ranks it explicitly at filing time.
> **✅ Owner-ruled 2026-08-01: the owner ranks it explicitly at filing.** Not appended. The stated
> reason is the one above and it is worth repeating in the follow-up itself: appending lands the task
> inside the bottom segment where it can never be promoted past the closed `P140` row, **making it an
> instance of the very defect it exists to fix.** Recorded in follow-up 6, §8.

**Open question 5 — is the new convention page dual-homed, or fkit-only?**
`conventions/dual-home-parity.md:19-24` requires a file existing in both trees to be edited in both.
Today `claude/scaffold/ai-agents/knowledge-base/conventions/` holds **7** of the live tree's **9**
pages; `dependency-declaration-form.md` and `dual-home-parity.md` are fkit-only.
My recommendation was: dual-home it — the rule is about how any project's agents cite anything, not
about fkit's internals; a consuming project's agents cite line numbers into their own growing
documents too.
> **✅ Owner-ruled 2026-08-01: the page IS dual-homed** into `claude/scaffold/`. **The costs the owner
> accepted, recorded rather than buried:**
> 1. **Every future edit is bound to two byte-identical files** — the live
>    `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` and its scaffold twin. Per
>    `dual-home-parity.md:19-24` that is not optional once both exist.
> 2. **This report can be cited from it only by name, never linked.** `reports/` ships **empty** to
>    consuming projects, so a relative link from the dual-homed page would resolve in this repo and
>    dangle in every project that installs fkit — the exact defect class this report is about. Cite it
>    as *"the 2026-08-01 durable-citation report (task `0160`)"*, with no href.

**Open question 6 — is the dead-path guard named at all?**
§7.1 gives it a file and a condition, so it is buildable. Two reasons to hesitate: (a) per §4.5 a
guard is exactly the *"load-bearing for another consumer"* condition in `adr-034:148-150`, so
building one changes what ADR-034 covers; (b) under the §4.6 folder-ID schema the class of defect
mostly stops being generated, and a guard against a defect that can no longer be written is
maintenance with little yield.
My recommendation was: name it, but file it low and after follow-ups 3 and 4.
> **✅ Owner-ruled 2026-08-01: it is named, filed LOW, sequenced after follow-ups 3 and 4.** Its value
> is **regression cover for the sweep** — worth little before the sweep exists, more after. Recorded as
> follow-up 7, §8. **It now pairs with follow-up 8**, the case-2 policy guard added in this round
> (§7.2); both are syntactic policy checks under `test/` and both are worth more post-cleanup.

**Open question 7 — what replaces the brief path in the wiki completion flag? ⏳ NEW, and open.**
Raised by round-1 review finding **R7**, and correct: §5.2 rules the candidate rule **IN**, and that
rule reads *"folder ID **and brief path** only"* (`0160/brief.md:300-301`) — while §5.2(ii) of this
same report proves that the mandated `backlog/<NNNN>-<slug>/brief.md` in the template **manufactures a
dead path by construction.** The first draft ruled the rule in on a path form its own next paragraph
disproves, and named no replacement. Follow-up 5 said only *"fix the hardcoded `backlog/` path"*, which
is not a form a coder can implement.

The candidates, unweighted, because **this is not mine to decide**:
- **(i) Folder ID only** — `Task 0148's vault work is complete — ready to close`. Nothing left to rot;
  the producer resolves the folder themselves. Costs the producer one lookup.
- **(ii) Folder ID plus a location-free reference** — the ID, and a pointer that does not name a board
  folder, e.g. *"its brief, wherever the folder now sits"*. Prose, not a path.
- **(iii) Folder ID plus a wildcard path** — `ai-agents/tasks/*/<NNNN>-<slug>/brief.md`. Survives the
  move, but is not a path any tool can open, and it is a new notation to teach.

**My recommendation: none — I am naming the question, not answering it.** What I will say is that
whichever form is chosen must satisfy §1's test, and (i) plainly does. **⏳ Awaits the owner.** Until
it is ruled, **follow-up 5 cannot be implemented**, only filed.

---

## 12. Verification — this report's own compliance

Recorded against `0160/brief.md:274-311` item by item in the return to the driver rather than
duplicated here. Three checks belong in the artifact itself.

- **`npm test` passed** — 523 tests, 17 suites, 0 failures, and `test/prove-red.sh`'s hard gate
  green. This is the correct command per `package.json:5`, **not** the brief's step 8 (§9, item 1).
  **Re-run after every review round, most recently round 5** — same result each time. The review
  rounds are documentation-only and touch no source, so the run is confirmation, not a risk check.
- **Nothing was written to `ai-agents/wiki-vault/`.** `git status --porcelain` shows no entry under
  that path. `log.md` was read only.
- **This report's change surface is this one new file** — plus, after each review round, the
  `## Coder response` section of `0160`'s `review.md` ledger, which is the review's own artifact and
  not a change to the work product. No task file moved. The rank sequence
  `grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md` is **byte-identical** between `HEAD` and
  the working tree — 148 ranks, zero diff, **re-verified again after the round-3 edits**.

> **⚠️ Verification step 6 cannot be satisfied on its literal wording, and this is stated rather than
> quietly passed.** Step 6 (`0160/brief.md:289-294`) requires that `git diff --stat` show **no** file
> under `ai-agents/tasks/` or `ai-agents/sprints/`. At the time this report was first written it showed
> three: `ai-agents/sprints/sprint-2.md`, `0160/brief.md`, and `0170/brief.md`. **By the end of round-1
> review it shows four** — `0168/brief.md` joined them, edited by a **producer** correcting the false
> Fact C this report had relayed to it (finding R1). **None of the four was written by this task.** The
> first three carried uncommitted edits from earlier steps of the same
> `/fkit-sprint-ship-loop` run before this report's author took any action — captured by the first
> command of that session, before any file was written — and the author was explicitly instructed
> not to revert, stage or clean them. The **substantive** requirement of step 6 — a report-only
> change surface, no task moved, no rank changed — **is met and is independently provable** from the
> rank-sequence diff above. The literal requirement is unmeetable by any worker running inside a
> driver session that has already edited the board, which is a defect in the step's wording rather
> than in this work. Recorded for the producer alongside the other step defects in §9.
