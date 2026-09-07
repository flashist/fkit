# Implementation plan — 0357, Sweep B: the single-site correction notes in ONE pass

**Task:** `0357` (`0357-sweep-b-the-single-site-correction-notes`)
**Author:** fkit-coder, spawned plan-step worker under `fkit-sprint-ship-loop` (no owner channel — ADR-021)
**Planned against:** HEAD `351bea3`.
**Status:** planning only. No file was written, edited or moved to produce this plan.

⚠️ **Correction to the driver's state note, first, because every diff proof depends on it.** The
driver reported *"working tree CLEAN — zero uncommitted paths"*. Measured this turn, the tree carries
**two** modified paths: `ai-agents/sprints/sprint-7.md` (this row's status cell flipped `🔲 Backlog` →
`🔄 In progress`) and this task's own `brief.md` (the same flip in its `## Status` field). Both are the
driver's own board work, both are one-line changes, and neither is mine. ⛔ **So the "real committed
baseline, no exclusion list needed" claim does not hold as stated** — every diff proof below names its
baseline and excludes those two paths **by name**, exactly as Sweep A had to.

---

## 0. Read this first — what "one pass" verifies, and what it does not

⛔ **The two guards prove almost nothing about this sweep's repairs, and the close report must say so
in the same breath as the word "verified."** Sweep A's guards-are-a-regression-gate-not-a-coverage-gate
finding applies here, and measured against this sweep's actual edit surfaces it applies **harder**.

Measured this turn, from the two guard files themselves:

- The **citation guard** (`test/coordination-citation-policy.test.js`) scans exactly
  `ai-agents/tasks/*/*/*.md` plus the **top level** of `ai-agents/sprints/`. It exempts
  `ai-agents/tasks/done/**` and `ai-agents/tasks/cancelled/**` **in whole**. Its target class is a
  sprint board, a task folder's `brief`/`plan`/`worklog`/`review` markdown, or the wiki log —
  full literal path, colon, digits. `ai-agents/knowledge-base/**`, `ai-agents/sprints/done/**`,
  `claude/`, `test/` and `bin/` are **outside its scanned set**, and ADRs, `architecture.md` and
  source files are **not in its target class at all**.
- The **link guard** (`test/reference-integrity.test.js`) scans every `.md` under `ai-agents/`
  (vault excepted) for markdown links that do not resolve. It says nothing about whether a
  coordinate or a claim is *true*.

Predicted member edit surfaces, by guard coverage:

| Surface | Members landing there | Citation guard | Link guard |
|---|---|---|---|
| `ai-agents/tasks/done/**` | `0146` `0183`(half) `0201`* `0274` `0318` `0335` `0348` `0350` + the NUL member | ⛔ exempt in whole | ✅ covers |
| `ai-agents/sprints/done/*.md` | `0183`(half) `0299` | ⛔ outside scanned set | ✅ covers |
| `ai-agents/knowledge-base/decisions/` (ADRs) | `0170`(half) `0196` `0205` `0207` `0276`(half) `0281` `0346` | ⛔ outside scanned set | links only |
| `ai-agents/knowledge-base/architecture.md` | `0312` | ⛔ outside scanned set | links only |
| `ai-agents/knowledge-base/conventions/` | `0279`(half) | ⛔ outside scanned set | links only |
| `claude/**` | `0170`(half) `0276`(half) `0279`(half, scaffold) | ⛔ outside both | ⛔ outside both |
| `test/prove-red.sh` | `0351` | ⛔ outside both | ⛔ outside both |

⭐ **The consequence, stated precisely because it is stronger than Sweep A's version: NOT ONE member
edit in this sweep lands in the citation guard's residual set.** Every closed-folder note is exempt;
every other surface is outside the scanned set. So the citation guard cannot go red on a member note,
and **a green run of it proves nothing at all about the notes.** Its only live exposure to this task is
**this task's own three records** — see §2.

⛔ **What actually proves a repair here is a per-member firsthand re-verification recorded in the
worklog**, plus, for the six members whose briefs demand it, a `+N / −0` diff proof run as a command.
Not a green test run. The close report states this in the verdict, not in a footer.

---

## 1. Step 0 — the hard gate, proved before the first edit

Run, and paste both runs into `worklog.md` **dated, as the worklog's first entry**:

```
node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
```

Gate condition: **both green, 0 fail, 0 skip**. If either is red, ⛔ **STOP** and return `BLOCKED` —
the sweep does not touch a file.

Recorded in the same entry: `git rev-parse --short HEAD` and `git status --porcelain`, so every later
"byte-identical" proof has a named baseline and the two pre-existing modifications are excluded **by
name**.

**Measured by me this turn, at HEAD `351bea3`** — ⛔ this is my plan-stage measurement, and step 0
re-measures rather than inherits it:

- guards: **41 tests, 41 pass, 0 fail, 0 skipped**
- `npm test`: **833 tests, 833 pass, 0 fail, 0 skipped**
- `test/prove-red.sh`: hard gate **PASSED** — real + unmutated copy green, all 28 mutations red their
  named assertion

---

## 2. ⭐ MANDATED SECTION — how this sweep avoids writing banned-form coordinates into open records

**Discharging the owner ruling relayed to me, option label verbatim: "Carry it into each sweep's plan
gate (Rec)."**

### 2.1 The exposure, measured rather than assumed

This task's folder sits under `ai-agents/tasks/backlog/`, so its `plan.md`, `worklog.md` and
`review.md` are inside the citation guard's scanned set and are **not exempt**. That is ruled
behaviour: the guard records the owner ruling of 2026-09-02, option label verbatim
**"A + file follow-up D (Rec)"** — ship with **no** exemption for review ledgers; exempting an open
`review.md` was **refused by name** as a silent widening of "closed records are frozen" into "ledgers
anywhere."

**Exactly what reds it**, from the guard's target regex and its maskers, re-read this turn:

- **Fires on:** a literal `ai-agents/`-prefixed path to a sprint board (top level only), a task
  folder's `brief`/`plan`/`worklog`/`review` markdown, or the wiki log, immediately followed by a
  colon and digits — **including inside inline code spans**, because the code-span masker is
  deliberately absent (owner ruling 2026-09-02, option label verbatim **"Omit, assert positively
  (Rec)"**).
- **Does not fire on:** a bare path with no line number; an ADR, `architecture.md`, a convention file,
  a `claude/`, `test/` or `bin/` path with or without a line number; anything inside a **fenced block**
  or on a **blockquote line**, both of which are masked.

⭐ **The concrete, measured hazard specific to Sweep B — and it is not hypothetical.** Several member
briefs cite their own sites as full-path coordinates into closed review ledgers: `0274` cites two
positions inside `0259`'s and `0264`'s ledgers, `0348` cites one inside `0188`'s, `0350` cites the
`## Accepted residuals` heading position inside `0125`'s, and `0335` tabulates four positions inside
`0327`'s. **Transcribing any of those into my `worklog.md` in full-path form reds the guard**, because
my worklog is scanned and not exempt while the target files are merely exempt as *citees*. This is the
single most likely way this task breaks its own guard, and it would happen while doing exactly what
step 2 asks for.

⚠️ **This task's brief is narrower than Sweep A's on paper.** Its constraint reads *"⛔ No `path:NNN`
citations in the notes — anchor on quoted text"* — binding **the notes**, where Sweep A's bound *every*
artifact. ⭐ **I adopt the stricter rule anyway**, across notes, plan, worklog and every message.
Tightening is permitted where relaxing is not, and the narrower reading would leave the worklog — the
one file that actually reds — ungoverned.

### 2.2 The approaches, and the one this sweep takes

**Sweep A's answer is precedent and I adopt it rather than re-deriving it.** Its plan weighed four
approaches and took **1 + 4**:

| # | Approach | Sweep A | Sweep B |
|---|---|---|---|
| 1 | Anchor on heading + quoted fragment; never write the coordinate | ⭐ ADOPTED | ⭐ **ADOPTED — unchanged** |
| 2 | Split the coordinate across two table cells (`0237`'s dodge) | ⛔ rejected | ⛔ **rejected — unchanged** |
| 3 | Put coordinates inside a fenced block or a blockquote line | ⛔ rejected by name | ⛔ **rejected by name — unchanged** |
| 4 | Carry a genuinely load-bearing number as a **command's output** inside a fence | ⭐ ADOPTED | ⭐ **ADOPTED — unchanged** |

**I adopt, and I do not depart.** Sweep A's two reasons hold here without modification and are not
re-argued: approach 2 is refused on this repo's own `durable-citation-anchors` convention, whose
verification section says a phrase split across table cells has **no cheap remedy** and must be
*"treat[ed] … as unverifiable by this method"* — so it buys a green guard by making the record
unverifiable by the repo's own prescribed check; and approach 3 is refused because *"a sweep that
satisfies its guard by hiding from it is the shape this whole sprint exists to end."*

⭐ **One adaptation, and it is a loosening of a mitigation rather than of the rule.** Sweep A carried a
§2.4 mitigation for the reviewer's findings-table column, which then defaulted to `file:line` and
pushed the reviewer toward writing the banned form into a scanned ledger. **`0369` has since shipped
and the `.claude/` mirror is refreshed** — verified this turn: the shipped
`claude/skills/fkit-stateful-review/SKILL.md` now names the column **`Location`** and carries the rule
block *"The `Location` cell — the form depends on the target, not on the ledger"*, instructing the
reviewer to put the heading in `Location` and the quoted fragment in `Claim`; the mirror carries the
same. **So the reviewer reads the rule from its own skill and no spawn-prompt workaround is required.**

⚠️ **I keep Sweep A's residual honestly, because the mirror refresh removes the *need* for the
workaround and not the *risk*.** The reviewer owns its section and I may never edit it. If it writes a
banned-form coordinate anyway: ⛔ I do not fix it — I re-invoke the reviewer asking it to re-anchor its
own rows, report the red guard rather than working around it, and if it still stands it becomes an
owner question (accepted residual vs. block the close), ⛔ **not a thing I resolve.** The spawn prompt
will restate the rule as belt-and-braces; that is now redundancy, not the mechanism.

### 2.3 The concrete authoring rules this sweep follows in its own records

Binding on `plan.md`, `worklog.md`, every correction note, the close hand-off list, and every message
I send:

1. ⛔ **No `token:digits` anywhere.** Not for coordination documents, not for ADRs, not for source
   files, not inside backticks, not inside a fence.
2. **A member's claimed site is recorded as four fields, no number:** target file (bare path) · the
   nearest heading or sub-heading · the quoted fragment actually found there · what the member brief
   claimed was there.
3. **An absorbed row is cited by its bare four-digit ID**, per `durable-citation-anchors` row 4 —
   ⛔ **never by a relative link into `ai-agents/tasks/backlog/…`.** Those links break the moment the
   producer closes the row and would red the link guard. See §8.3.
4. **Where a line number is genuinely load-bearing** — the `+N / −0` proofs six member briefs demand,
   and the NUL member's byte proof — it is carried as a **runnable command and its output** inside a
   fence. The fence is legitimate there because the number is a *command's output*, not a citation I
   authored.
5. Both guards are re-run over my own new records **before** the review round is requested, so a
   self-inflicted red is caught by me and not by the reviewer.

---

## 3. Step 1 — freeze the membership, in writing, before any edit

Written into `worklog.md` as a **discrete, dated step that precedes every edit**. A membership decided
after the edits is a rationalisation.

### 3.0 ⭐ What step 1 no longer decides — recorded, not re-taken

- **`0212` is owner-ruled into Sweep C (`0358`)**, 2026-08-29, because its site is
  `ai-agents/wiki-vault/log.md` and ADR-005 makes vault writes `fkit-wiki`'s exclusively — a wall, not
  a routing preference. ⛔ Step 1 **records** this ruling and does not re-take it. `0212` is **not** on
  this sweep's close list; its outcome is Sweep C's to report.
- **`0320` and `0321` were ruled into Sweep A on 2026-09-03** on the defect-family argument, and
  **both are now closed** — verified this turn, both under `ai-agents/tasks/done/` reading
  `✅ Done (agent-closed — not owner-verified)`. This brief's step 1 still instructs me to rule them;
  ⛔ **that instruction is discharged.** Step 1 records the settlement and rules neither.

### 3.1 The decision rule, stated before the verdicts

A candidate is **IN** when all four hold:

1. Its deliverable is a **dated correction note at a named site** — the class definition. A row whose
   deliverable is a guard, a decision, a behaviour change or an unbounded sweep is **OUT**.
2. Its edit surface is one this sweep may lawfully touch — ⛔ not `ai-agents/wiki-vault/` (ADR-005).
3. It is **not** a member of Sweep A's or Sweep C's membership.
4. **Every gate its own brief declares is satisfied** — a hard `Depends on:` whose upstream is still
   open, or an undischarged owner-authorization precondition, makes it **OUT and still open**, ⛔ not
   Cancelled.

Rows failing test 1, 2, 3 or 4 are **not absorbed and not closed** — they stay open as their own rows.
Rows passing all four but whose defect **no longer reproduces** at step 2 are closed **`⛔ Cancelled`**
with the non-reproduction as the recorded reason.

### 3.2 Predicted verdicts

⚠️ **This table is a PREDICTION from the plan-stage read, not the frozen membership.** Step 1 re-runs
the rule against each brief on disk and publishes the real table. Verdicts here can move.

| ID | Predicted | Reason |
|---|---|---|
| `0146` | **IN** | One note in `0139`'s closed ledger. ⭐ Claim **pre-verified by me this turn and it reproduces** — the launcher's own header comment says `team` / `team room` are *"NOT accepted — not here, and not at the menu either"* |
| `0170` | **IN** | One note covering four sites across two files. ⚠️ One file is `claude/skills/fkit-sprint-ship-loop/SKILL.md` — **the skill this driver session is running**. Q4 |
| `0183` | **IN** | Two sites: `sprint-2.md`'s archive and `0174`'s closed brief. ⛔ Shares `sprint-2.md` with `0299` — §11 item 6 |
| `0196` | **IN** | Two sites in ADR-010, plus the one sanctioned header-bullet exception to append-only |
| `0201` | ⛔ **OUT — stays open, and this is the plan's biggest single departure from the brief's candidate list** | Two independent gates, **both unmet**. Its own brief opens *"## ⛔ PRECONDITION — this task may not start without explicit owner authorization"*, undischarged; and it declares a **hard `Depends on: 0192`**, and `0192` is **still open** — verified this turn at `ai-agents/tasks/backlog/0192-decide-whether-task-done-step-5-needs-amending-on-ledger-freezing`. ⛔ Fails test 4. Q1 |
| `0205` | **IN** | One note on ADR-037's enforcement claim. ⛔ Its hardest constraint is a **narrowing**, not a reversal |
| `0207` | **IN** | One note on ADR-020 naming the driver a sanctioned `plan.md` writer |
| `0274` | **IN** | Two notes in `0259`'s and `0264`'s closed ledgers. Authorization **discharged** 2026-08-11 |
| `0276` | **IN, tightened** | ADR-041's enumerated sites + one `claude/` skill file. ⚠️ Its brief also asks a **repo-wide re-sweep** — bounded by §6's rule below |
| `0279` | **IN** | ⚠️ **Forces regenerating a shipped generated artifact.** Q3 |
| `0281` | **IN** | ADR-003's status line. ⛔ Its brief carries **three dated self-corrections** saying two of its own instructions *"must not be followed as written"* |
| `0299` | **IN** | Five sites across four archived sprint plans |
| `0312` | **IN, owner-narrowed** | ⛔ **Occurrence A only** — the owner ruled *"File architecture.md:33-35 (Recommended)"*. ⭐ Claim pre-verified this turn: the *"The CI half has never actually run"* sentence is present |
| `0318` | **IN** | One note in `0238`'s closed brief |
| `0335` | **IN** | ⚠️ **Two subjects, two notes, never merged**, in a new `## Corrections` section inside `0327`'s closed ledger. ⛔ **Collides head-on with `0348`'s fence — Q2** |
| `0346` | **IN** | ADR-038's step-table bullet, ⛔ **scoped to Build** |
| `0348` | **IN, owner-narrowed** | ⛔ **One note, in `0188`'s ledger only.** Retitled 2026-08-29; the folder slug still says "two" and was deliberately **not** renamed |
| `0350` | **IN** | `0125`'s R3 residual discharge note |
| `0351` | **IN, two sites** | ⛔ **The third site is NOT owner-ruled and its brief orders it surfaced at the plan gate — Q5** |
| *(no row)* | **the NUL member** | ⭐ Re-measured this turn and it **reproduces exactly**: `0246`'s closed ledger, **20966 bytes**, **1** NUL, **offset 12107**, **line 92**, inside the span reading `` `\x00` escapes in fixtures — good hygiene ``. A byte scan of every `.md` under `ai-agents/` this turn found **NUL in exactly one file** — this one. ⛔ **No second site; not the start of a NUL sweep** |

**Predicted: 18 IN, 1 OUT (`0201`), plus the row-less NUL member.**

⛔ **Not a target.** The owner's ruling authorizes the closes this sweep justifies, never a quota, and
step 2 may move several of these to `Cancelled`.

⭐ **The arithmetic, restated rather than silently changed.** The brief's in-scope candidate count of
**19** is unchanged — `0201` is *in scope* and *not absorbed*, which is a different thing. What moves
is the **close list**: **18 rows**, not 19, if Q1 answers as recommended. The NUL member absorbs no row
and closes none. The three-sweep total of ~38 is unaffected by any of this.

⚠️ **One knock-on the brief's own text will contradict.** The brief says *"Six members … land notes
inside closed task folders"* and names `0201` among them. With `0201` out, that becomes **five**
(`0146`, `0274`, `0318`, `0348`, `0350`), plus `0183`'s and `0335`'s closed-folder halves and the NUL
member's file — **eight closed-folder files touched across seven members.** Recorded so a reviewer
does not read the changed count as drift.

---

## 4. Step 2 — re-verify every claim, firsthand

⛔ **Inherit nothing.** Every member brief names sites measured between 2026-08-02 and 2026-09-02;
Sweep A found several member briefs whose own claims were **refuted on re-measurement**, and expects
the same here.

Per member, per claimed defect, recorded in `worklog.md`:

1. Resolve the claimed site against the file **at HEAD** (`git show HEAD:<path>`) **and** in the
   working tree. Record the text actually present, quoted, with its nearest heading.
2. Verdict: **reproduces** / **does not reproduce** / **partially reproduces** / **target moved**.
3. For **absence** claims over prose, use the whitespace-normalised form `durable-citation-anchors`
   prescribes — `tr '\n\t' '  ' | tr -s ' '`, **the squeeze included** — and **state which of that
   page's named limits the check did not cover**, in the same breath as the result. **Presence claims
   need no such form** and applying it to them is waste.
4. Where a **count** is load-bearing, derive it with `grep -o … | wc -l`. ⛔ `grep -c` counts matching
   *lines*, not occurrences.
5. ⭐ **`0335` resolves `0327`'s folder by glob across all three boards, every time** — its brief
   requires it verbatim, and the folder **moved into `done/` during this sprint**, which is exactly the
   move that rule exists to survive.

**A member whose claims do not reproduce at all is closed `⛔ Cancelled`** with the non-reproduction
recorded, and ⛔ **never silently dropped**, and ⛔ never "corrected" by writing a note about a claim
that is no longer there. Named expressly in the close report per verification step 3.

**Predicted partial or non-reproductions to test first** (predictions, not findings):

- `0351` — ⭐ **most likely.** Measured this turn, `test/prove-red.sh` **already carries a sentence
  correcting the very error** its brief describes, reading *"What proves the seam is honoured is
  mutations 27 and 28"*. Its brief's claim may therefore be **partially discharged in place**, and its
  own instruction *"If the numbers have moved, use what you measure, not what this brief says"* covers
  the rest.
- `0281` — its brief already self-corrected twice, and CI has since run; expect the correction to be
  narrower than filed.
- `0312` — the owner narrowed it to occurrence A; occurrence B may have moved or been repaired.
- `0348` and `0274` — coverage claims whose surrounding sentences may already tell the truth. `0348`'s
  own brief says exactly that of the specimen it excluded.
- Any member citing a folder still under `backlog/` on its measurement date that has since closed.

---

## 5. Step 3 — write each note at its own site

⛔ **Append-only.** Do not rewrite the sentence being corrected; the record of what was believed is the
point. **Existing text is never edited, reordered or reflowed.**

**Every note carries four things**, per the brief: **the date** · **what the record claims** (quoted) ·
**what is actually true** · **the authority**. Grep for the date in each, per verification step 5.

⭐ **Two rules that decide the hard cases, carried from Sweep A rather than re-derived:**

- **A historical record's *claims* are frozen; its *links* are not.** An archived board and a closed
  brief are the same case. ⛔ The authority for this is the settled reference-integrity condition, **not
  ADR-034** — ADR-034 says nothing about post-close edits and grants no exemption to anything.
- **Expect refusals, and treat them as the correct outcome.** ⭐ **A refusal is a finding, recorded with
  its reason. It is not a failure and it does not block the close.** Sweep A's hardest calls all landed
  here, including two sites it left untouched because an *open* task owned the block verbatim — a shape
  `0170` and `0276` can reproduce, since both edit files other open tasks reference.

---

## 6. Step 4 — preserve every absorbed member's own scope

⛔ **A sweep does not get to relax a member's scope.** Each constraint below is quoted **verbatim into
the worklog** and honoured; the close report shows each honoured. This table is the plan-stage
transcription — step 4 re-reads each brief on disk rather than trusting it.

| ID | Constraint, verbatim | How it is honoured |
|---|---|---|
| `0146` | *"**Explicitly not in scope:** any change to `claude/fkit-claude.sh`. The code is correct."* · *"**Leave the Why clause and the re-raise condition alone**"* | Note only, in the residual's title + What clause. ⛔ No launcher edit |
| `0170` | *"**One note, covering both sites.** … A note covering only Decision 1 **fails**. Two separate notes **fail**."* · *"**Which marker this task writes: ⚠️, not ⛔**"* · *"**⛔ Do not sweep ADR-032's third `byte-unchanged` hit.**"* · *"**Do not touch ADR-033** at all."* · *"**Write no new `:NNN` citation into any skill file**"* | Exactly one note; marker ⚠️; third hit left; ADR-033 untouched |
| `0183` | *"**⛔ Do not edit the original false sentences.**"* · *"**⛔ Do not re-rank anything, and do not change any row's status cell.**"* · *"**⛔ Write no `:NNN` line-number citations.**"* | Append-only; no status or rank cell touched |
| `0196` | ⛔ *"**APPEND ONLY — `+N / −0`.**"* · *"⚠️ **The header `- **Corrections:**` bullet is the one exception**"* · ⛔ *"**ADR-010's `**Status:**` stays `accepted`.**"* · *"**Two markers only** … This task writes **⚠️** at both sites."* | The one header-bullet exception taken and named; status untouched |
| `0205` | ⛔ *"**The note must NOT say condition (b) itself is machine-checkable.** This is the single most important constraint on the wording."* · *"**This is a NARROWING, not a reversal.**"* | Wording states a **proxy** is checkable, never (b) |
| `0207` | *"**One dated correction note appended to ADR-020. Nothing else.**"* · *"**`claude/skills/fkit-sprint-ship-loop/SKILL.md` keeps its ADR-020 citation byte-unchanged.**"* | One note; skill file untouched **by this member** |
| `0274` | *"**Two appended correction notes. Nothing else.**"* · ⛔ *"**APPEND ONLY. Both existing claims stay byte-identical.**"* · *"### ⛔ `0265` is ACCURATE — leave it alone"* · ⛔ *"**Do not edit ADR-042.**"* | Two notes; `0265` and ADR-042 untouched |
| `0276` | *"### ⛔ THE FENCE — several hits are CORRECT in their own context. Do not pattern-match."* · ⛔ *"**No `dashboard.sh` behavior change of any kind.**"* · ⛔ *"**Do not edit `ai-agents/sprints/done/sprint-5.md`**"* · ⛔ *"**Do not edit `0267`'s or any other closed task's** …"* · *"**⚖️ ONE ROW, NOT TWO** … **They land together.**"* | ⭐ **Tightened:** its "repo-wide re-sweep" is bounded to the enumerated sites plus one named-pattern search **whose every hit is adjudicated individually in the worklog**, and ⛔ **any NEW site found is REPORT-ONLY** — `0299`'s own rule, applied here as a tightening |
| `0279` | *"⚠️⚠️ **THE AUTOMATED PARITY CHECK IS OFF FOR THIS FILE — A ONE-HOME EDIT IS SILENT**"* · ⛔ *"**Do not touch the exception's `reason` string.**"* · ⛔ *"**Never restate the token grammar** …"* · ⛔ *"**No `test/dual-home-parity-exceptions.mjs` edit**"* · ✅ *"**"the pointer already discharges it — no edit warranted" is a SANCTIONED finding.**"* | ⭐ **Confirmed by me this turn:** the file **is** on the parity exception list as `audience-adapted`, and the two homes **already differ**. So each home is glossed **separately and adapted**, ⛔ never byte-copied. Q3 |
| `0281` | ⛔ *"**No status-value change.** ADR-003 stays **`superseded`**."* · ⛔ *"**Do not sweep other ADRs.** … **Report them; do not fix them.**"* · *"**A correction that overstates is a worse defect than the stale claim it replaces**"* · ⛔ *"**`## What to build` element 3 and `## Verification steps` step 3 must not be followed as written**"* | The two self-corrected instructions are **not** followed; other ADRs reported only |
| `0299` | *"**the count is history and stays byte-for-byte; the mechanism is the defect and gets corrected**"* · *"### 1b. ⛔ The two sweep findings that stay FROZEN"* · ⛔ *"**Any NEW site you find is REPORT-ONLY**"* · ⛔ *"**Do not rename or move the folder**"* | Counts frozen; the two named findings untouched |
| `0312` | ⛔ *"**One file only.** `git diff --stat` must list exactly `ai-agents/knowledge-base/architecture.md`."* · ⛔ *"**Do not edit `0281`'s, `0251`'s, or any other task's `brief.md`.**"* · ⛔ *"**Do not fix `:NNN` citations while in the file**"* · ⛔ *"**Do not describe it as the predicted dash failure.**"* | Occurrence **A only** per the owner ruling; one file |
| `0318` | ⛔ *"**`0238` IS NOT REOPENED, RE-STATUSED OR MOVED BY THIS TASK.**"* · ⛔ *"**APPEND-ONLY. Not one byte of `0238`'s existing text changes.**"* · ⛔ *"**DO NOT ADD A `- **Corrections:**` HEADER BULLET**"* · ⛔ *"**"Not investigated" is not an outcome.**"* · *"**Every note here is ⚠️**"* | ⚠️ **Note the asymmetry with `0196`, which *requires* that bullet.** Both honoured; ⛔ neither generalised to the other |
| `0335` | *"### ⛔ TWO SUBJECTS — different claims, different sections, DIFFERENT NOTES"* · ⛔ *"**Do not merge them into one note, and do not let a note for one cite the other's evidence.**"* · ⛔ *"**A subject-A note must not mention the squatter.**"* · ⛔ *"**B3 is a PARTIAL falsehood — narrow its note, do not overstate it.**"* · ⛔ *"**Do not write inside `## Reviewer findings`, `## Coder response`, or `## Accepted residuals`.**"* | ⭐ **TWO** notes, in a new `## Corrections (record repair — task 0335)` section, owner-ruled *"New third-party Corrections section (Recommended)"*. Q2 |
| `0346` | ⛔ *"**Scope it to Build. Verify is untouched and stays table-fixed.** ⛔ **Do NOT widen the note to cover Plan.**"* · ⛔ *"**APPEND ONLY.** Prove `+N / −0` … **not by eye.**"* · *"**ADR-038's `Status:` stays `accepted`.**"* · ⛔ *"Do **not** edit ADR-044."* | Build only; `+N / −0` proved by command |
| `0348` | ⛔⛔ *"**DO NOT TOUCH `0327`'s LEDGER**"* · *"**One note, in one file, and stop.**"* · *"**Cite this task by ID `0348`, not by slug.**"* · ⛔ *"**Do not touch `0259`'s or `0264`'s ledgers** — those are `0274`'s"* | One note in `0188`'s ledger. ⛔ **Its `0327` fence collides with `0335` — Q2** |
| `0350` | ⛔ *"**Do not "fix" check 4. Do not file a task to fix check 4.**"* · *"**(c) ⛔ THE LOAD-BEARING SENTENCE … A note that records the discharge but not this has failed this task**"* · *"**the second arm stays live**"* · *"**The marker is ⚠️, not ⛔.**"* · ⚠️ *"out of scope, do NOT fix here: `0125`'s … header reads `Status: in-review`"* | Load-bearing sentence written; second arm stated live; header left |
| `0351` | *"**Comments only. No assertion, no step, no mutation, no shell logic changes.**"* · *"**⚠️ Surface the third site at the plan gate** … ⛔ **Do not decide this alone and do not silently widen the ruling**"* · *"**`0i` is deliberately NOT in scope.**"* | Comments only; `0i` untouched. **Third site surfaced — Q5** |

---

## 7. ⭐ The NUL member — the one sanctioned exception, said before it is done

⛔ **This member is a different kind of act from every other one on this sweep.** The other members
append and never touch existing text. **This one edits existing bytes inside a closed record and
removes one.** It is the single sanctioned exception, and it **does not widen the append-only rule for
anything else.**

**What authorizes it — both halves, because either alone is not enough:** (1) the owner's ruling of
2026-09-02, option label verbatim **"Fold into an existing sweep (Rec)"**, which placed it here knowing
it is a fix and not a note; and (2) **the byte is a typo *in* the record, not part of it** — the
append-only rule and ADR-034's frozen-ledger rule protect what a record *says*; a NUL where the author
typed `\0` is a transcription fault in the medium, and repairing it changes no claim, no finding, no
disposition and no date.

**How it is done, so it stays a one-byte repair:**

- ⛔ **Re-measure before editing.** Done at plan time and it reproduces exactly — but step 2 measures
  again, because the working tree may move between now and then.
- Replace the single `0x00` with the two characters `\0`. ⛔ **Nothing else on that line, and nothing
  anywhere else in the file, changes.**
- **Prove it with bytes, not eyeballs:** NUL count **1 → 0**, and `git diff --numstat` on that file
  shows **1 line added, 1 removed**, and no other file touched by this member.
- ⚠️ **Verification step 4's `−0` append-only proof does not apply to this member.** It is the one
  member expected to show a removed line, and the report **says so** rather than appearing to fail the
  check.
- ⛔ **Append no correction note at the site.** There is no false claim to correct; a note would assert
  something about the ledger that is not true of it.
- **If the NUL is already gone**, the member is closed as **not-reproducing** and ⛔ no note is written
  about a defect that is no longer there.
- ⚠️ **If a SECOND NUL site has appeared**, ⛔ **surface it rather than absorbing it** — a second site
  is a new fact and the owner's to route.

⛔ **Arithmetic unchanged:** this member absorbs no row and closes none.

---

## 8. Step 5 — the hand-off, and what it must warn the producer about

### 8.1 The close list
One line per absorbed row: **ID · outcome (`Done` / `Cancelled`) · reason**. Bare four-digit IDs,
⛔ no links.

### 8.2 What this task does NOT do
⛔ Does not run `/fkit-task-done` or `/fkit-task-cancelled`. ⛔ Does not move a task folder. ⛔ Does not
flip a board row. ⛔ Does not hold those skills — the movers are producer-only (ADR-033) and the ADR-018
hook denies them to me at any depth. The terminal act is spawning `@fkit-producer` with the close list,
which writes the **`(agent-closed — not owner-verified)`** marker (ADR-033 §5). **The close report says
the list is a hand-off.**

### 8.3 ⚠️ The link-churn warning the hand-off must carry — measured this turn

Measured across `ai-agents/**/*.md` at HEAD `351bea3`: **71 markdown links** point into the nineteen
candidate folders while they sit in `backlog/`.

| ID | links | ID | links | ID | links | ID | links |
|---|---|---|---|---|---|---|---|
| `0146` | 4 | `0201` | 2 | `0276` | 9 | `0318` | 8 |
| `0170` | 2 | `0205` | 2 | `0279` | 2 | `0335` | 1 |
| `0183` | 2 | `0207` | 2 | `0281` | 11 | `0346` | 3 |
| `0196` | 4 | `0274` | 6 | `0299` | 2 | `0348` | 2 |
| | | | | `0312` | 7 | `0350` | 1 |
| | | | | | | `0351` | 1 |

⭐ **Every one of those links breaks the instant its folder moves to `done/`, and the link guard asserts
zero broken links across `ai-agents/**`, closed folders included.** Re-pointing them is
`/fkit-task-done`'s own mandated behaviour, and the producer must be told the volume **before** it
starts. ⛔ **This is the producer's act, after my hand-off — outside my diff and outside my
verification. Not flagging it would leave the next `npm test` red with nobody expecting it.**

### 8.4 Cross-sweep and intra-sweep edit collisions the hand-off records

- `ai-agents/knowledge-base/architecture.md` — `0312` here; Sweep A's `0275`/`0286` already landed and
  are closed, so this is a **re-measure**, not a live conflict.
- `ai-agents/sprints/done/sprint-2.md` — `0183` **and** `0299` here, plus Sweep A's landed `0193`.
  ⛔ **Intra-sweep: `0183` and `0299` execute as ONE edit pass over that file** — §11 item 6.
- `0158`'s closed folder — Sweep A's `0193` edited its **brief**; this sweep's `0201` would have edited
  its **review ledger**. Disjoint files, and moot if `0201` stays out.
- ⛔ **`0327`'s closed ledger — `0335` writes it, `0348` forbids touching it. Q2.**
- ADR-010 — `0196` here; Sweep A's `0197` already landed. Re-measure.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — `0170` writes it; `0207` requires its ADR-020
  citation stay byte-unchanged. Compatible, and recorded so it is not read as a conflict.

---

## 9. Consults

**One batched consult to the architect**, stating: *"You are being consulted at hop 2 of 2; chain: lead
→ coder → architect. You may not consult anyone further."* Scope: only where a member turns on **what
an ADR means**, not on where its lines are — candidates are `0205` (how far ADR-037's enforcement claim
narrows without reversing), `0276` (whether a hit is correct in its own context, at the fence its brief
draws), and `0346` (whether ADR-044's Decision 1 reaches Build only).

⛔ **If the architect surfaces a NEW structural decision rather than an interpretation, that goes to the
OWNER**, not into the sweep, and not settled by the architect unilaterally.

⭐ **The coverage verdicts (`0274`, `0348`) are NOT consults.** Both briefs already fix the defect —
a bare full-coverage claim on a reasoning-only Codex pass, established by ADR-042 — and both
authorizations are discharged by recorded owner rulings. Step 2 re-reads each ledger's own words; if
the ledger states the reality correctly in the same breath, that is a **sanctioned "no edit warranted"
finding**, which is `0348`'s own stated reason for excluding its other specimen. Only genuine ambiguity
is surfaced.

---

## 10. Verification — mapped one-to-one onto the brief's eleven steps

| # | Check | How |
|---|---|---|
| 1 | Gate green **before** the diff | §1's two runs, dated, first entry in `worklog.md` |
| 2 | Frozen membership precedes the edits | §3's table as a discrete dated worklog step. `0212` recorded as owner-routed to Sweep C; `0320`/`0321` recorded as **already settled and closed**; `0351`'s inclusion ruled |
| 3 | Every claim re-verified firsthand; non-reproducers **named** | §4's per-member record, with what the site actually says |
| 4 | **Append-only, proved:** `git diff -U0` shows `−0` on every edited record | Run as a command per file, output pasted. ⛔ Not eyeballed. ⚠️ **Two declared exceptions, stated up front so neither reads as a failure:** the **NUL member** (1 added / 1 removed, by design — §7) and **`0196`'s single header-bullet exception**, which its own brief names |
| 5 | Every note carries date, claim, correction, authority | Grep for the date in each; the four fields checked per note |
| 6 | Each member's scope quoted and honoured | §6's table, re-read from disk, with `0346`'s *"scoped to Build"*, `0335`'s *"TWO"* — and ⚠️ **`0321`'s *"one in place, one annotated"* reported as ALREADY DISCHARGED**, since `0321` closed under Sweep A |
| 7 | **Zero** files under `ai-agents/wiki-vault/` modified | `git diff --stat` |
| 8 | No task folder moved, no board row flipped | `git status`; the close report states the list is a hand-off |
| 9 | Both guards **still green after** | Re-run §1's command; paste. ⚠️ **Expect the citation guard's `total` and `exemptCount` to RISE** — §11 item 7 |
| 10 | Dashboard over **all** live boards, before and after | `bash claude/skills/fkit-status/dashboard.sh` over `ai-agents/sprints/sprint-7.md` **and** `ai-agents/sprints/backlog.md`; roll-ups and drift both times. **No board gains a drift record** |
| 11 | `npm test` incl. `test/prove-red.sh`; report counts | ⚠️ Baseline **833/833, prove-red 28/28 PASSED**, measured by me this turn — ⛔ **re-measure, do not quote** |

**Plus one check the brief does not list and this sweep needs:** `git diff -U0 | grep '^+' | grep -nE
'[A-Za-z0-9_./-]+:[0-9]+'` over **added lines only**, with every hit adjudicated in the worklog. ⚠️ That
pattern also matches clock times and unrelated tokens — it is a **screen, not a verdict**, and reporting
its raw count as a pass would be false.

---

## 11. Edge cases and non-obvious failure modes

1. ⛔ **`0348` and `0335` give contradictory instructions about the same file, inside this one sweep.**
   `0348`'s brief says *"DO NOT TOUCH `0327`'s LEDGER"* and requires `git diff` on it be **completely
   empty**; `0335` requires appending a `## Corrections` section to exactly that file under its own
   owner ruling. **Q2.** ⛔ Not resolved by me silently — that would be relaxing a member's scope.
2. ⚠️ **`0279` forces regenerating a shipped generated artifact.** Verified this turn: the scaffold
   copy is hashed into `claude/structure-manifest.tsv`, and `test/structure-manifest.test.js` asserts
   byte-equality with what the generator produces today — *"touch anything under `claude/scaffold/`
   without regenerating and this goes red."* The generator's own contract says the scaffold edit and
   its regenerated manifest land in the **same** commit. **Q3.**
3. ⚠️ **`0279`'s two homes are ALLOWED to differ and DO differ.** Verified this turn: the file is on
   the dual-home parity **exception** list as `audience-adapted`, and `diff` reports the two copies
   differ today. ⛔ So the gloss is written **separately and adapted per home**, never byte-copied —
   and, because the parity check is off for this file, **a one-home edit is silent**. Both homes are
   checked by hand.
4. ⚠️ **`0170` edits the skill this driver session is running**, and its `.claude/` mirror ⛔ must never
   be edited. The note is therefore **invisible to the running loop** until a re-init. It is an
   append-only dated note with no behaviour change, so nothing executable moves — but ⛔ **do not report
   a `claude/` repair as live in this session's own agents.** **Q4.**
5. ⚠️ **`0351` edits `test/prove-red.sh`, the file whose own 28/28 output is one of this task's
   verification metrics.** Comments only; ⛔ no assertion, step, mutation or shell logic changes; and
   `prove-red.sh` is re-run afterwards. Its brief also warns the file's working-tree diff **entangles
   two other tasks' rows**, so its `+N / −0` proof uses a **snapshot taken before my edit**, not a
   `HEAD` diff.
6. ⚠️ **`0183` and `0299` both edit `ai-agents/sprints/done/sprint-2.md`.** They execute as **one edit
   pass** over that file. Doing one alone leaves it half-swept and makes the other's diff unreadable —
   Sweep A's `architecture.md` lesson, applied.
7. ⚠️ **Appending inside `ai-agents/tasks/done/**` will RAISE the citation guard's `total` and
   `exemptCount`.** Those files are exempt, so the residual stays zero and the arithmetic arm still
   closes — the counts are asserted with a **floor**, not an equality. ⛔ Say this **before** the
   reviewer reads a changed number as drift.
8. ⚠️ **A note containing a markdown link into a still-open member folder becomes a broken link the
   moment the producer closes that row.** ⛔ Cite absorbed rows by **bare four-digit ID**, never by a
   relative link into `backlog/`.
9. ⚠️ **The link guard scans `ai-agents/` only.** A link written into `claude/skills/…` by `0170` or
   `0276`, or into `test/prove-red.sh` by `0351`, is checked by **nothing**. Re-resolve those by hand.
10. ⛔ **The link guard asserts its named-exemption set is exactly six.** Do not add to it to make a
    repair go green — a rise is the failure it exists to catch.
11. ⚠️ **`0196` requires a `- **Corrections:**` header bullet; `0318` forbids one.** Both are honoured
    as written, and ⛔ **neither is generalised to the other.** `0318`'s brief says so expressly: it
    *"must not pre-decide"* the open general-case question.
12. ⚠️ **`0276`'s "repo-wide re-sweep" is the only unbounded instruction in the set.** Bounded per §6;
    ⛔ any new site found is **report-only**.
13. ⚠️ **Sweep A refused two sites because an OPEN task owned the text verbatim.** `0170`, `0276` and
    `0279` all edit files that open tasks reference. Check ownership before editing; ⛔ a refusal is a
    recorded finding, not a failure.
14. ⚠️ **Several member briefs cite their own sites as full-path coordinates into closed ledgers.**
    Transcribing those verbatim into my worklog reds the citation guard — §2.1. They are recorded as
    heading + fragment.

---

## 12. Work order

1. Gate (§1) — ⛔ stop if red.
2. Freeze membership (§3); record `0212`'s routing and `0320`/`0321`'s settlement rather than re-ruling
   them. Publish.
3. Re-verify every member's claims firsthand (§4). Publish; **name every non-reproducer.**
4. Batched architect consult (§9). Block only the members that need it.
5. Repair, grouped **by target file, not by member row**, so each file is opened once:
   ADRs (`0170` half, `0196`, `0205`, `0207`, `0276` half, `0281`, `0346`) → `architecture.md`
   (`0312`, occurrence A) → conventions + scaffold (`0279`, both homes) → `claude/` skills (`0170`
   half, `0276` half) → `test/prove-red.sh` (`0351`) → archived boards as ONE pass (`0183` + `0299`) →
   closed folders last (`0146`, `0274`, `0318`, `0348`, then `0335`, then the NUL member).
6. Self-check: both guards, the added-lines screen, per-file `+N / −0` proofs, both dashboards.
7. `npm test` including `test/prove-red.sh`.
8. Request the stateful review — one round over the whole sweep (Q6), with §0's
   guards-prove-nothing-about-the-notes finding stated to the reviewer, since no second round backstops
   it.
9. Process the review.
10. Hand the producer the close list plus §8.3's link-churn volume and §8.4's collisions.

---

## 13. What this plan explicitly does not do

⛔ No commit, no push. ⛔ No write under `ai-agents/wiki-vault/` — vault findings are **reported** and
routed to Sweep C. ⛔ No mover invoked, no folder moved, no board row flipped. ⛔ Never edit the
`.claude/` mirror. ⛔ No absorption of a Sweep A or Sweep C member. ⛔ No `path:NNN` for a coordination
document in any record of mine. ⛔ No member's own scope relaxed. ⛔ No new architecture decision settled
by me or by the architect — those go to the owner.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-04

Given live via `AskUserQuestion` in this `fkit lead` session. Option labels recorded **verbatim**.
These bind the Build and Process-review workers.

| # | Question | Owner ruling (verbatim option label) | What it settles |
|---|---|---|---|
| **L0** | Approve this plan as written? | **"Approve as written (Rec)"** | The plan above is the approved plan. These bytes are what the Build worker implements. |
| **L1** | Q1 — `0201`, gated twice, both gates unmet | **"Leave 0201 OUT (Rec)"** | ⛔ **`0201` stays OPEN — not absorbed, not closed, NOT cancelled.** Close list is **18**. The owner's reason: it honours the brief's own *"a sweep does not relax a member's scope"*, and **`0192` decides whether a closed ledger may be amended at all** — the exact question `0201`'s notes turn on. ⭐ §3.2's knock-on stands: the brief's *"six members land notes inside closed task folders"* becomes **five**, plus `0183`'s and `0335`'s halves and the NUL member's file. |
| **L2** | Q2 — `0348` forbids touching `0327`'s ledger; `0335` requires appending to it | **"Sequence: 0348 first, then 0335 (Rec)"** | ⭐ **Read `0348`'s fence as binding `0348`'s own act.** Run `0348` first, **capture its empty-diff proof for `0327`'s ledger at that point**, then run `0335` under its own later owner ruling. ⛔ Both constraints honoured **literally**; the proof is a **per-member snapshot, not a whole-tree diff** — say so in the report so it is not read as a weakened check. |
| **L3** | Q3 — `0279` forces regenerating a shipped manifest | **"Edit both homes + regenerate the manifest (Rec)"** | ⭐ **Edit both homes and run `npm run generate:manifest` in the same change** — the generator's own documented contract. ⛔ The homes are **glossed separately and adapted**, never byte-copied: parity is **off** for this file (`audience-adapted` exception) and they already differ. ⚠️ **A one-home edit is silent** — check both by hand. ⚠️ This is the one place this sweep touches a generated shipped artifact; `claude/structure-manifest.tsv` **will** appear in the diff, and the report must say why. |
| **L4** | Q4 — `0170` edits the skill this driver session is running | **"Do it, report the staleness plainly (Rec)"** | Do it. It is an append-only dated note; nothing executable changes. ⛔ **Never edit the `.claude/` mirror**, and ⛔ **do not report the repair as live in this session's own agents** — it is not, until init is re-run, which this task does **not** do. |
| **L5** | Q5 — `0351`'s third site, not in the owner's ruling | **"Two ruled sites only; report the third (Rec)"** | ⛔ **Correct the two ruled sites only.** The third is recorded as a **named residual** and returned to the driver. The brief's own instruction — *"Do not decide this alone and do not silently widen the ruling"* — is honoured exactly. |
| **L6** | Q6 — one review round or two | **"One round over the whole sweep (Rec)"** | ⭐ **One** stateful review round over the whole sweep. ⛔ §0's finding — **neither guard can red on a member note, so a green run proves nothing about them** — **must be stated to the reviewer**, because nothing backstops the uncovered surfaces and there is no second round. |

⚠️ **Transport note.** This plan text was returned to the driver through the spawn channel, which
HTML-escaped some angle brackets. The driver restored `&lt;`/`&gt;` to `<`/`>` when persisting these
bytes — in §4 item 1 (`git show HEAD:<path>`). No other character was altered. Recorded so a later
reader does not read the restoration as drift.
