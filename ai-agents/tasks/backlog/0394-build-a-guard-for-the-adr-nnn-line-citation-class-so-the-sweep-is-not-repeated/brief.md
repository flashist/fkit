# Build a guard for the `ADR-NNN:LINE` citation class, so the sweep is not repeated

## ID
0394

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

⚠️ **The owner field is a PRODUCER JUDGEMENT, flagged.** No ruling assigns it. The deliverable is a
guard under `test/`, and
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
Decision 1 fixes the role by the deliverable, staffing *source and tests* to the coder as sole
source-write authority. ⚠️ **The competing reading:** the sibling row
[`0393`](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)
carries `fkit-architect` and this row's plan gate is a design question. ⛔ **Raise it at the plan gate
rather than assuming; a design pass by the architect feeding a coder build is a legitimate shape.**

## Context

### Provenance

**Owner ruling, 2026-09-14**, given live via `AskUserQuestion` in a live `fkit lead` session with the
owner present — **the option label is the verbatim text**: **"Sweep now, file a guard row behind it
(Rec)"**.

⛔ **The ruling is TWO things in one act, and both halves matter:** the sweep
([`0393`](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md),
now `P7` of Sprint 9) runs **now**, and **a guard is filed behind it** so the sweep does not have to be
repeated. ⛔ **This row is the second half. It is NOT on Sprint 9.**

### ⛔ Why a guard at all — the class regenerates, and the two existing guards do not catch it

**The reasoning the owner accepted, in the producer's words:** *"Sweeping without a guard buys days,
not a fix."*

⛔ **Measured 2026-09-14 at `HEAD` `f209a8c`: `test/reference-integrity.test.js` is green (22 tests,
914 files scanned, 0 broken links, 7 named-exempt) and `test/coordination-citation-policy.test.js` is
green (21 tests) — while every occurrence of this class stands.** ⭐ **Both guards pass by design, not
by accident, and that is the point:**

- **`test/reference-integrity.test.js`** resolves **link targets**. An `ADR-NNN:LINE` citation is
  **prose, not a link**, so it never enters that guard's corpus.
- **`test/coordination-citation-policy.test.js`** flags **coordinates into coordination documents** —
  its match rule is a full `ai-agents/sprints/…` or `ai-agents/tasks/…` path followed by a line number.
  An `ADR-NNN:LINE` citation names an ADR **by number, not by path**, so it never matches.

⛔ **Neither guard is broken and neither should be blamed. The class simply falls between them, and
that gap is what this row exists to close.**

### ⛔⛔ THE CENSUS IS NOT REPRODUCIBLE — FIVE DATED MEASUREMENTS, AND THE LARGEST IS 3.6× THE SMALLEST

⭐ **This is the evidence for the row, and it is stronger as a reproducibility failure than as a growth
curve. Read it that way.**

| # | Date | Figure, as recorded | Scope, as recorded |
|---|---|---|---|
| 1 | at [`0323`](../../cancelled/0323-re-sweep-the-adr-line-citation-class-case-insensitively-and-repair-adr-013s-drifted-pointers/brief.md)'s filing | **66 occurrences** | ⛔ not recorded |
| 2 | 2026-09-13 | **110 occurrences / 27 files** | ⛔ not recorded; `claude/` measured at **0** |
| 3 | 2026-09-13, at the `0392`/`0393` split | **117 occurrences / 29 files** | ⛔ not recorded |
| 4 | 2026-09-14, relayed to the producer that filed this row | **125 occurrences / 34 files** | ⛔ not recorded |
| 5 | ⭐ **2026-09-14, measured by that producer** | **four scopes, four answers — below** | ⭐ **recorded** |

**Measurement 5 in full.** Pattern `adr-[0-9]{3}:[0-9]+` over tracked files, no fence or blockquote
masking applied:

| Scope | Occurrences | Files |
|---|---|---|
| **Case-SENSITIVE `ADR-` only, all tracked files** | **124** | **35** |
| ⭐ **Case-INSENSITIVE, all tracked files** | ⭐ **444** | ⭐ **67** |
| Case-insensitive, minus `ai-agents/wiki-vault/` | 416 | 62 |
| Case-insensitive, minus the vault and minus closed task folders (`tasks/done/`, `tasks/cancelled/`) | 106 | 26 |

⛔⛔ **THE FINDING: measurements 1–4 count only the UPPERCASE half of the class.** `124 / 35`
reproduces the relayed `125 / 34` to within one of each — near-certainly the same scope, taken a
moment apart with `HEAD` having moved. ⛔ **But `0323` — the cancelled row this class comes from —
exists specifically to sweep it *case-insensitively*.** The lowercase form is real and concentrated:
measured 2026-09-14, `adr-012` **107** occurrences, `adr-010` **53**, `adr-016` **37**, `adr-018`
**22**, `adr-008` **16**; sample literal text `adr-008:54`, `adr-001:22`.

⚠️⚠️ **THE "+8 IN ONE DAY" REGENERATION RATE IS NOT REPRODUCIBLE, AND SAYING SO IS PART OF THIS
BRIEF.** The argument put to the owner was `110/27 → 117/29 → 125/34` — **+8 occurrences and +5 files
in one day**. ⛔ **Under the closest scope the filing producer could name and reproduce, the count went
the OTHER WAY: 106 / 26 on 2026-09-14 against a recorded 110 / 27 on 2026-09-13.** ⛔ **None of
measurements 1–4 recorded its scope, so none can be checked against another.**

⭐ **The honest conclusion, and it still argues for the guard.** A class whose census cannot be
reproduced across five measurements is a class with **no machine-checkable definition** — and supplying
one is exactly what a guard does. ⛔ **What is NOT established is the rate.** ⛔ **Do not cite "+8 in
one day" as measured fact anywhere; cite it as an unreproduced claim whose scope was never recorded.**

> ### ⛔⛔ DATED STRENGTHENING 2026-09-14 — THE FIGURE ALREADY REACHED THE OWNER AS MEASURED FACT. Every prior byte left identical.
>
> ⛔ **The paragraph above was written as a caution. It is now a correction of the record.** The "+8
> occurrences and +5 files in one day" figure was **relayed to the owner as measured fact more than
> once, including inside a question the owner then ruled on.** ⛔ **It must not appear as a measurement
> in any brief, board, report, worklog or question from here on** — this brief included.
>
> ⭐ **THIS ROW'S REASON IS UNCHANGED AND IS THE STRONGER ONE, RESTATED SO IT CANNOT BE MISREAD:**
> ⛔ **a class whose census cannot be reproduced across SIX dated measurements has no machine-checkable
> definition, and supplying one is exactly what this guard does.** ⛔ **The row does not stand on a
> growth rate and never needed to.**
>
> ⭐ **Sixth measurement, re-verified 2026-09-14** at `HEAD` `f209a8c` (working tree uncommitted;
> `git grep` reads the working tree): case-**sensitive** `ADR-` all tracked **124 / 35** — reproduces
> the 5th **exactly**; case-**insensitive** all tracked **446 / 67** (5th: 444 / 67); minus
> `wiki-vault/` **418 / 62** (5th: 416 / 62); minus vault and closed task folders **108 / 26** (5th:
> 106 / 26). ⚠️ **The +2 drift is measured against an uncommitted tree minutes apart — ⛔ it is NOT a
> growth rate either, and must not be cited as one.** Commands: `git grep -ohE 'ADR-[0-9]{3}:[0-9]+' -- .`
> and `git grep -oihE 'adr-[0-9]{3}:[0-9]+' -- .`, plus `':(exclude)…'` pathspecs for the narrower
> scopes; `-l` for file counts.
>
> ⭐ **Related, same day:** [`0393`](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)
> gained a dated owner ruling fixing its sweep to **the whole class, case-insensitively** (verbatim
> option label ***"Whole class, case-insensitive (Rec)"***). ⛔ **This row's `Depends on 0393` is
> unchanged**, and the ruling does not settle `0393`'s `OD3`, which this brief already flags itself as
> pre-empting.
>
> ⛔ **Recorded by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
> Nothing re-ranked, nothing renumbered; `## Sprint` and `## Priority` untouched.**

> ### ⭐ SEVENTH MEASUREMENT, 2026-09-14 — taken AFTER the use/mention amendment below was written
>
> ⛔⛔ **DO NOT READ THIS AS PROGRESS OR AS A GROWTH RATE. IT IS THE SELF-REFERENCE, MEASURED.** The
> amendment below **adds occurrences of the class to this brief** — that is unavoidable in a document
> that quotes the defect it is about, and it is exactly why the owner accepted criterion 4 as a
> **command plus a pinned ref** rather than a figure.
>
> **Ref: `HEAD` `f209a8c`, WORKING TREE (uncommitted), 2026-09-14.** Commands as recorded in the sixth
> measurement, plus `git grep --untracked …` for the last row.
>
> | Scope | 6th | ⭐ 7th (now) | Δ |
> |---|---|---|---|
> | Case-**sensitive** `ADR-`, tracked | 124 / 35 | **124 / 35** | **0** |
> | Case-**insensitive**, tracked | 446 / 67 | **446 / 67** | **0** |
> | Case-insensitive, tracked, minus `wiki-vault/` | 418 / 62 | **418 / 62** | **0** |
> | Case-insensitive, tracked, minus vault + closed task folders | 108 / 26 | **108 / 26** | **0** |
> | ⭐ Case-insensitive, **`--untracked`** (`0393`'s declared scope) | 472 / 71 *(as recorded on the Sprint 9 board)* | **474 / 71** | **+2** |
>
> ⭐ **Why every TRACKED scope is unchanged: this brief is UNTRACKED**, so an edit to it cannot move a
> tracked-only count. ⛔ **That is itself the finding of § *Candidate exemption regions* item 2 — a
> tracked-only guard exempts these documents BY ACCIDENT.**
>
> ⚠️⚠️ **AND ONE FIGURE THAT DOES NOT RECONCILE, STATED RATHER THAN SMOOTHED.** This brief went from
> **2 → 10** occurrences (**+8**) under this edit, yet the untracked-inclusive total moved only **+2**
> against the board's recorded **472**. ⛔ **The two cannot both be measurements of the same tree.** The
> board's 472 was taken at an unrecorded moment against an uncommitted tree that other spawns were also
> editing. ⛔ **Neither number is wrong; the pair is unreconcilable, and that is the SEVENTH consecutive
> census of this class that cannot be checked against its predecessor.** ⭐ **It is more evidence for
> the guard, and it is NOT a rate. Do not cite it as one.**

> ## ⭐⭐ THREE MORE DATED OWNER RULINGS 2026-09-14 — **AN EXEMPTION REGION MAY COVER A LIVE ADR, BUT REGION-SCOPED ONLY; THE ITEM-2 PREREQUISITE IS UPHELD; AND THE MISSING MOVER STEP IS NOT FILED YET.** Every prior byte of this brief left identical.
>
> **All three given live via `AskUserQuestion` in an `fkit lead` session with the owner present.
> ⛔ Recorded here by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
> under a scope fence covering this brief and `0393`'s only.** ⛔ **Nothing designed, nothing
> implemented, no row filed, nothing re-ranked
> ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
> no board touched.**
>
> ⭐⭐ **TWO OF THE THREE CONFIRM WHAT THIS BRIEF ALREADY SAYS. THEY ARE RECORDED ANYWAY** — a ruling
> that lives only in a conversation is lost, and a confirmed judgement that is not recorded reads
> later as an unexamined one.
>
> ---
>
> ### ⛔⛔ RULING A — A LIVE ADR MAY CARRY AN EXEMPTION REGION, **REGION-SCOPED, NEVER FILE-SCOPED**
>
> **Verbatim option label: *"Yes, but region-scoped not file-scoped (Rec)"*.**
>
> ⛔ **The two live-ADR candidates in § *Candidate exemption regions* below — `adr-042-…md:~379` (the
> specimen list) and `adr-013-…md:~167` (the work-list) — MAY be exempted. ⛔⛔ THE SPECIFIC BLOCK
> ONLY, NEVER THE WHOLE ADR. The rest of a living document stays policed.**
>
> #### ⭐ THE OWNER'S STATED EVIDENCE, RECORDED BECAUSE IT IS WHAT DECIDED IT
>
> ⛔⛔ **This brief's own `backlog.md` finding: 32 occurrences, only ~2 of them mentions.** A
> whole-file exemption there would **hide ~30 ordinary citations behind a couple of mentions.**
> ⭐ **That is the case that kills a file-scoped list, and it is why the ruling says *region*.**
> **Re-verified 2026-09-14 at `HEAD` `f209a8c`, working tree: `ai-agents/sprints/backlog.md` carries
> 32 case-insensitive occurrences across 10 lines** (`grep -oihE 'adr-[0-9]{3}:[0-9]+'`; `-c` gives
> the line count). ⛔ **Dated; re-measure.**
>
> #### ⚠️⚠️ THE "FIRST EXEMPTION TO COVER LIVING CANON" FRAMING IS **WRONG**, AND THIS PRODUCER IS CORRECTING IT RATHER THAN RECORDING IT
>
> ⛔ **The ruling was relayed with the note that this would be the FIRST exemption in the repo to
> cover living canon — every existing one covering closed folders, the vault, or test fixtures.**
> ⛔⛔ **THAT IS FALSIFIED ON DISK. `NAMED_EXEMPT`'S FIRST KEY IS A LIVE, ACCEPTED ADR:**
>
> ```
> // Synthetic illustrative board row inside ADR-040's own diagnosis of the old regex.
> 'ai-agents/knowledge-base/decisions/adr-040-…-never-a-substring.md::plan-sprint-4c.md',
> ```
>
> **That ADR's header reads `- **Status:** accepted`** — verified 2026-09-14. ⭐ **And its shape is
> the SAME shape as `adr-042:~379`: a SPECIMEN quoted inside a live ADR that is itself diagnosing the
> defect the guard polices.**
>
> ⭐⭐ **WHAT SURVIVES THE CORRECTION, AND IT IS THE STRONGER STATEMENT:** the novelty is **not** that
> an exemption touches living canon — that precedent exists and is one key old. ⛔ **The novelty is
> the GRANULARITY.** `NAMED_EXEMPT` reaches into a live ADR at **one named `(citing file, target)`
> pair**; ⛔ **this row must reach into one at a REGION, and per § *NOT REUSABLE* item 1 that key form
> does not transfer.** ⚠️ **So the plan gate has a precedent for *whether*, and none at all for
> *how*.**
>
> #### ⛔ THREE MEASURED FACTS THE PLAN GATE INHERITS — verified 2026-09-14 at `HEAD` `f209a8c`
>
> 1. ⛔⛔ **A CASE-SENSITIVE GUARD SEES ONE OF THE TWO SITES AND NOT THE OTHER.**
>    `adr-042-…md:379` carries **3 occurrences, all LOWERCASE** — `adr-008:49`, `adr-009:60`,
>    `adr-016:73`. `adr-013-…md:167` carries **3 pattern hits, all UPPERCASE** — `ADR-007:29,123`,
>    `ADR-009:22,131`, `ADR-010:130`. ⭐ **So *What to build* item 1's case question decides which of
>    these two regions is even NEEDED — it is an input to the region design, not a preliminary to it.**
> 2. ⚠️ **`adr-013:167`'s 3 pattern hits are FIVE coordinates** (`29`, `123`, `22`, `131`, `130`) —
>    the pattern stops at the comma. ⛔ **`0393`'s `E4` requires one triage row per coordinate, so a
>    census-hit count and a triage-row count DISAGREE at this site by construction.**
> 3. ⚠️ **`adr-042:379`'s enclosing block also holds a NON-`ADR-NNN:LINE` coordinate** —
>    `test/fixtures/closed-rank-0174-before.md:1981`. ⛔ **A region delimiter drawn around that block
>    blinds a SECOND citation class as well as this one** — exactly the kind of cost item 6 *(d)*
>    requires stated in the guard file itself.
>
> ---
>
> ### ⭐ RULING B — THE ITEM-2 PREREQUISITE DECLARATION IS **UPHELD**
>
> **Verbatim option label: *"Keep it — it follows from the measurement (Rec)"*.**
>
> ⛔ ***What to build* item 2 (the exemption surface) STAYS a PREREQUISITE of item 6 (the region
> mechanism), not a parallel question.** The wording in item 6 and in § *Candidate exemption regions*
> structural finding 1 is **unchanged and now owner-backed**.
>
> ⭐⭐ **RECORDED BECAUSE THE PROVENANCE MATTERS: THIS WAS A PRODUCER JUDGEMENT.** It was **flagged as
> unruled rather than buried**, and the owner upheld it **on the measurement** — `0171`'s folder
> **174** plus `0323` **28** = ⭐ **202 occurrences already sitting inside the closed-folder
> exemption.** ⛔ **Item 6 cannot be scoped until item 2 settles, because roughly half the candidate
> surface disappears the moment it does.**
>
> ---
>
> ### ⛔⛔ RULING C — THE MISSING MOVER STEP IS **NOT FILED YET**, AND THAT IS AN OBLIGATION ON THIS ROW'S PLAN GATE
>
> **Verbatim option label: *"Wait for 0394's plan gate (Rec)"*.**
>
> ⛔⛔ **DO NOT FILE A ROW FOR IT.** ⭐ **The gap and the ruling are recorded TOGETHER so the plan gate
> INHERITS it rather than rediscovering it.**
>
> **The gap, re-verified on disk 2026-09-14:**
> [`0381`](../../done/0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates/brief.md)'s
> landed step in both movers is a **guard-RUN** step naming **`test/reference-integrity.test.js` by
> path** — run it; green → record its `N named-exempt` figure; red → route the repair; ⛔ *"You may
> run this guard. You may not edit it."* ⛔⛔ **IT KNOWS ONE FILE BY PATH, NOT THE CONCEPT OF AN
> EXEMPTION LIST.** ⛔ **A second list therefore arrives with NO maintenance story at all.**
>
> #### ⛔ THE OWNER'S STATED REASON, RECORDED BECAUSE IT IS THE POINT
>
> ⛔⛔ **A PATH LIST, A MARKER COMMENT AND A REGION DELIMITER EACH NEED A *DIFFERENT* MAINTENANCE
> STORY.** A path list needs a mover step, because a move invalidates it. An in-document marker needs
> none, because it moves with the file. A region delimiter needs a rule about who may move the
> delimiters. ⛔ **Specifying one before the mechanism is chosen would be writing against an undecided
> design.**
>
> #### ⛔⛔ THIS IS AN OBLIGATION ON THE PLAN GATE, NOT A NOTE. IT MUST NOT BE LOST WHEN THE MECHANISM IS PICKED.
>
> ⛔ **Whichever mechanism item 6 *(a)* selects, THE SAME RUN MUST STATE, IN WRITING, EITHER:**
> - **the mover step this mechanism needs** — an extension of `0381`'s step, or a second step —
>   ⭐ **filed as its own row the way `0381` was**, ⛔ **never written into the movers by this row**
>   (they are producer-only,
>   [ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md));
>   **OR**
> - ⭐ **that this mechanism needs NO mover step, WITH THE REASON** — the honest answer for an
>   in-document marker, and a finding, not a shrug.
>
> ⛔ **A run that picks a mechanism and says nothing about its maintenance story HAS NOT MET item 6
> *(c)*.** ⚠️ **`NAMED_EXEMPT` cost two review rounds in one day for exactly this omission** — the
> lesson is already in § *THE IN-REPO PRECEDENT*, and this ruling makes acting on it **mandatory**.
>
> ---
>
> ### ⭐ EIGHTH MEASUREMENT, 2026-09-14 — taken AFTER the three rulings above were written
>
> ⛔⛔ **DO NOT READ THIS AS PROGRESS, AND IT IS NOT A RATE.** It is the self-reference again: recording
> a ruling *about* this class **adds occurrences of the class** to the documents that record it.
>
> **Ref: `HEAD` `f209a8c`, WORKING TREE (uncommitted), 2026-09-14.** Commands exactly as in the sixth
> and seventh measurements; `--untracked` for the last row.
>
> | Scope | 7th | ⭐ 8th (now) | Δ |
> |---|---|---|---|
> | Case-**sensitive** `ADR-`, tracked | 124 / 35 | **124 / 35** | **0** |
> | Case-**insensitive**, tracked | 446 / 67 | **446 / 67** | **0** |
> | Case-insensitive, tracked, minus `wiki-vault/` | 418 / 62 | **418 / 62** | **0** |
> | Case-insensitive, tracked, minus vault + closed task folders | 108 / 26 | **108 / 26** | **0** |
> | ⭐ Case-insensitive, **`--untracked`** (`0393`'s declared scope) | 474 / 71 | ⭐ **489 / 71** | ⚠️ **+15 / 0** |
>
> **The untracked citers behind the +15:** `0393`'s brief **20** *(was 13)*, this brief **18**
> *(was 10)*, `sprint-9.md` **4** *(unchanged)*. ⭐ **Every tracked scope is unchanged because both
> edited files are UNTRACKED** — the same finding § *Candidate exemption regions* item 2 already
> carries: ⛔ **a tracked-only guard exempts these documents BY ACCIDENT.**
>
> ⚠️ **AND THE HONEST CAVEAT ON THIS TABLE ITSELF: writing the table added occurrences that the table
> does not count.** ⛔ **It was measured immediately before it was inserted, and NOT re-measured
> after.** ⭐ **That is the EIGHTH consecutive census of this class that cannot be checked against its
> predecessor, and it is more evidence for the guard — ⛔ not a trend.**
>
> **Sibling guards re-measured the same turn, both GREEN:**
> `node --test test/reference-integrity.test.js` — **22/22 pass, 0 fail**, disclosure line
> `scanned 916 files, resolved 3681 link targets, 0 broken, 7 named-exempt`.
> `node --test test/coordination-citation-policy.test.js` — **21/21 pass, 0 fail**.
> ⭐ **Both stayed green across this edit, which is expected and is NOT evidence the guard is
> unnecessary** — § *Why a guard at all* explains why neither guard can see this class.

### ⚠️ This row substantially pre-empts `0393`'s open decision **OD3** — flagged, not hidden

[`0393`](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)
carries an open decision worded **"Should a guard test catch stale line citations mechanically?"**,
recorded there with *"recommendation required, **infeasible** legitimate"*.

⛔ **The owner's ruling of 2026-09-14 answers the "should" half in the affirmative by filing this
row.** ⚠️ **It does NOT answer the "can" half.** ⭐ **`OD3` is therefore narrowed, not discharged**, and
what remains of it is genuinely this row's plan-gate question:

- **Is a mechanical guard feasible at all** for this class? ⛔ ***Infeasible* remains a legitimate
  finding** — and if it is the finding, this row's honest deliverable is **that finding, written
  down**, not a guard forced into existence.
- **What exactly is the class?** See *What to build* item 1 — the census above shows this is the hard
  part, not a preliminary.

⛔ **Do not close `OD3` inside `0393` on the strength of this row existing**, and ⛔ **do not close this
row by pointing at `OD3`.**

### ⛔⛔ THE USE/MENTION PROBLEM — a first-class design constraint on this row, not a caveat

⭐ **OWNER RULING, 2026-09-14**, given live via `AskUserQuestion` in a live `fkit lead` session with
the owner present — **the option label is the verbatim text**: **"Amend 0394 with an exemption-region
list (Rec)"**. ⛔ **Recorded here by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
under a scope fence lifted for this edit only.**

⛔⛔ **A MECHANICAL GUARD CANNOT DISTINGUISH A *USE* OF A COORDINATE FROM A *MENTION* OF ONE.** They are
**lexically identical** — both are `` `ADR-013:167` `` in backticks. ⛔ **So this row, as framed above,
reds on the very documents that describe the defect.**

**The test that separates them, carried in from
[`0393`](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)'s
`E2`, in its own words:**

> **Replace the line number with the correct one. Does the surrounding sentence become FALSE?**
> **YES → mention, leave it. NO → live citation, repair it.**

⚠️⚠️ **AND ITS STATED LIMIT, WHICH IS THE WHOLE PROBLEM: the test is a READING JUDGEMENT, not a
mechanical one.** ⛔ **No regex, no pattern and no case rule separates a use from a mention.** A
mention is a sentence asserting something *about that exact string* — that it occurs in the repo, that
it has drifted, that it is a specimen of the class, that it is a row's target. **Repairing one corrupts
the record of the very class this guard exists to police**, and ⛔ **the corrupted text still looks
perfectly well-formed**, so the damage is not recoverable from the diff alone.

⭐ **THE CONCLUSION THE OWNER ACCEPTED, VERBATIM:** ***"The fix is a declared exemption-region list, not
a better pattern."***

⛔⛔ **THE MECHANISM IS FRAMED HERE AND NOT DESIGNED.** Whether an exemption region is a **path list**, a
**marker comment** in the document, a **region delimiter** (a start/end pair around a census block), or
something else entirely is ⛔ **this row's plan-gate decision** — see *What to build* item 6. **A run
that arrives having already chosen has skipped its plan gate.**

### ⭐ THE IN-REPO PRECEDENT — `NAMED_EXEMPT`, and what this row can and cannot take from it

`test/reference-integrity.test.js` exports **`NAMED_EXEMPT`**, a `Set` of keys that suppress a
known-and-accepted finding. ⭐ **It is already exactly this shape — a declared list of sites a guard
must not fire on** — and it was created by **owner ruling 2026-08-30, verbatim *"Exempt them by name
(Rec)"***. **Read it before the plan gate; it is 7 keys and its comment block is longer than its data.**

**⭐ REUSABLE — take these:**

- **The principle.** Exempt **by name, with the reason written beside each entry**, rather than
  widening the pattern until the false positives disappear. Widening the pattern is what loses the
  genuine findings.
- **Co-location.** The set lives **inside the guard file**, so nobody reads the rule without reading its
  exceptions.
- **The self-costing header.** `NAMED_EXEMPT`'s comment states the **cost of its own key form** — *"a
  FUTURE genuine rot with the same (file, target) pair is also suppressed"* — and that cost is carried
  again in the guard's numbered blind-spot list. ⛔ **Whatever region mechanism this row picks, it must
  state what it blinds, in the same place.**
- **The maintenance hook already exists.** [`0381`](../../done/0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates/brief.md)
  put a `NAMED_EXEMPT` step into both task movers. ⚠️ **Verified on disk 2026-09-14: `0381` is
  `✅ Done (agent-closed — not owner-verified)` and now lives in `ai-agents/tasks/done/`** — it was in
  `backlog/` earlier the same day.

**⛔ NOT REUSABLE — these do not transfer, and assuming they do is the failure mode:**

1. ⛔⛔ **THE KEY FORM DOES NOT TRANSFER.** `NAMED_EXEMPT` keys on **`(citing file, target path)`** —
   *"deliberately NOT on a line number, because a line number is the very claim form this document
   rules unsafe for a living file."* ⛔ **A mention of `ADR-013:167` has no target path.** Its only
   candidate keys are:
   - **(citing file, the literal string)** — ⛔ which also suppresses a *genuine* drifted use of that
     same string in that same file, and the census shows exactly that clustering: `adr-012:87` occurs
     **23** times, `adr-012:105` **22** times.
   - **(citing file, line number)** — ⛔ the form `durable-citation-anchors.md` rules unsafe, and the
     form this whole class is a symptom of. **Keying an anti-line-number guard on line numbers is the
     joke that writes itself.**

   ⭐ **So the key form is an OPEN DESIGN QUESTION this row must answer, not an inheritance.**
2. ⛔ **THE GRANULARITY DOES NOT TRANSFER.** `NAMED_EXEMPT` is **7 keys**. This class runs to hundreds of
   occurrences, and **one closed task folder carries 174 of them** (see the candidate table). ⚠️ **A
   per-occurrence named list does not scale to that.** ⭐ **That is precisely why the ruling says
   *region* and not *key*** — and a region is a different mechanism with a different failure mode, not
   a bigger `Set`.
3. ⛔ **THE EXEMPTION SURFACE DOES NOT TRANSFER.** `reference-integrity.test.js` excludes `wiki-vault/`,
   excludes `claude/` and `test/` from its scanned set entirely, and ⛔ **does NOT exempt closed task
   folders** (*"a link is a pointer, and a rotted pointer is repairable"*). ⛔ **This class is
   concentrated in closed task folders.** ⚠️ **That divergence is a live argument for *What to build*'s
   "a new test file" option** — weigh it at the plan gate, do not let it decide by default.

**⚠️ AND THE HARD-WON LESSON ATTACHED TO THE PRECEDENT — an exemption list is not free.**

⛔ **A MOVE CAN INVALIDATE AN EXEMPTION KEY, AND A HEALED LINK'S KEY IS DEAD WEIGHT TO *DELETE*, NOT
REPOINT.** `NAMED_EXEMPT`'s own Sweep-C comment records it costing two review rounds in one day: three
keys were added while the citing row sat in `backlog/`, then closing that row into `done/` made it a
**sibling** of the targets, `../<name>/brief.md` **resolved again**, and all three keys had to be
**deleted**. ⭐ **The lesson, verbatim from the source:** *"`../../done/X` survives, `../X` does not"* is
right about a **pointer** and ⛔ **INVERTS for an exemption KEY.**

⛔ **THE CONSEQUENCE THIS ROW MUST SETTLE — the mechanism choice IS a maintenance-cost choice:**

- **A path-keyed region list** inherits the whole problem: every task-folder move invalidates entries.
  ⛔⛔ **AND `0381`'s LANDED STEP DOES NOT COVER A SECOND LIST — verified on disk 2026-09-14.** The step
  in both movers is a **guard-RUN** step naming **`test/reference-integrity.test.js` by path** (run it;
  green → record its `N named-exempt` figure; red → route the repair, ⛔ *"You may run this guard. You
  may not edit it"*). ⛔ **It knows one file, not the concept of an exemption list.** ⭐ **So a
  path-keyed list in a NEW test file arrives with NO maintenance story at all**, and this row owes
  either an extension of that step or a second one — **filed as its own row, the way `0381` was.**
- **An in-document marker or region delimiter** moves with the file, so a move invalidates nothing and
  no mover step is needed — ⛔ **but the exemption then lives outside the guard, breaking the
  co-location property above.**

⛔⛔ **AND THIS ROW MUST NAME WHO MAINTAINS THE LIST.** `NAMED_EXEMPT`'s maintenance is split — the
**coder** edits the guard, the **producer** runs the movers (producer-only since
[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
and it took a whole separate task to connect them. ⛔ **A list with no named maintainer is the
"allowlist that silently grows" already named as the failure mode in *What to build* item 5.**

### ⭐ CANDIDATE EXEMPTION REGIONS — re-derived on this brief's own evidence, not inherited

⚠️ **Measured 2026-09-14 at `HEAD` `f209a8c`, WORKING TREE (uncommitted, and it includes untracked
files), pattern `adr-[0-9]{3}:[0-9]+` case-insensitive, no fence or blockquote masking.** ⛔ **This is a
candidate list for the plan gate to triage — it is NOT the exemption list, and nothing here is
approved.**

| Site | Occurrences | Why it is a candidate | ⚠️ What complicates it |
|---|---|---|---|
| [`0393`](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)'s brief | **13** | The sweep row itself; its own ruling makes **mention the default** inside it | ⛔ **untracked** — invisible to a tracked-only guard |
| **This brief** (`0394`) | 2 before this edit | Same class of document | ⛔ **untracked**; ⛔ **self-referential — see below** |
| `ai-agents/sprints/sprint-9.md`, census section | **4** | Its census section carries a literal specimen list | ⛔ **untracked**; ⛔ **only PART of the file is a mention region** |
| `ai-agents/sprints/backlog.md` | **32** | Carries the `0393` and `0394` rows, which are mentions | ⛔⛔ **ONLY ~2 OF THE 32 ARE MENTIONS.** A whole-file exemption here **hides ~30 ordinary citations** — this is the case that kills a naive path list |
| [`0323`](../../cancelled/0323-re-sweep-the-adr-line-citation-class-case-insensitively-and-repair-adr-013s-drifted-pointers/brief.md) | **28** | The cancelled row this class comes from | ⭐ already inside the **closed-folder** exemption both siblings carry |
| `ai-agents/tasks/done/0171-…/` (worklog **109**, review **39**, plan **20**, brief **6**) | ⭐ **174** | The task that wrote `durable-citation-anchors.md` — the class's own design record | ⭐ already inside the **closed-folder** exemption |
| `adr-042-…md` line ~379 — *"Historical ADRs — `adr-008:49`, `adr-009:60`, `adr-016:73`"* | **3** | A **specimen list** inside a LIVE ADR | ⛔⛔ **covered by NO existing exemption in either sibling guard** |
| `adr-013-…md` line ~167 — *"Inbound links must be repaired, notably **ADR-007:29,123**…"* | **3** | A **subject-of-work** list (`0393`'s kind (b)) in a LIVE ADR | ⛔ **covered by NO existing exemption**; ⚠️ arguably a work-list that SHOULD be repaired when the work lands |
| `test/fixtures/closed-rank-0174-before.md` / `-after.md` | **6 + 6** | Frozen test fixtures | ⭐ `test/` is out of `reference-integrity`'s scanned set already |
| `ai-agents/knowledge-base/reports/2026-07-11-doc-drift-audit.md` | **8** | A dated audit quoting claims **at** coordinates | ⚠️ **genuinely ambiguous under `E2`'s test** — record as `mention?`, do not guess |

⛔⛔ **ONE CANDIDATE PUT TO THIS PRODUCER IS FALSIFIED, AND SAYING SO IS PART OF THE AMENDMENT.**
**`ai-agents/knowledge-base/conventions/durable-citation-anchors.md` contains ZERO occurrences of the
class** — verified 2026-09-14 by direct count. ⭐ **It is the convention page that DEFINES this class and
it never writes a literal specimen.** ⛔ **The finding that follows is binding on the mechanism: "the
enclosing document is about citation rot" CANNOT be the exemption trigger** — a document can be entirely
about the class and contain none of it, and `backlog.md` is the mirror case, containing plenty of the
class while being about nothing in particular.

⭐ **TWO STRUCTURAL FINDINGS THE PLAN GATE SHOULD START FROM:**

1. ⭐ **The two largest concentrations — `0171`'s folder (174) and `0323` (28), 202 occurrences between
   them — are ALREADY inside the closed-task-folder exemption both sibling guards carry.** ⛔ **If this
   row adopts that exemption, the exemption-region problem shrinks by roughly half before the region
   mechanism is designed at all.** ⚠️ **That makes *What to build* item 2 a prerequisite of item 6, not
   a parallel question.**
2. ⛔ **Three of the strongest candidates are UNTRACKED files** (`0393`, this brief, `sprint-9.md`), and
   `0393`'s scope was owner-ruled on 2026-09-14 to **include untracked**. ⚠️ **A guard that reads only
   tracked files exempts them by accident rather than by declaration** — ⛔ **an accidental exemption is
   the thing this section exists to prevent.**

### ⭐ ACCEPTED — Sprint 9's criterion 4 is self-referential, and the owner has taken that cost

⭐ **OWNER RULING, 2026-09-14**, same channel, **verbatim option label: *"Accept it — command + pinned
HEAD (Rec)"***.

**The self-reference:** Sprint 9's **criterion 4** is scored against a declaration that is **a command,
not a number** — `git grep --untracked -oihE 'adr-[0-9]{3}:[0-9]+' -- .`. ⛔ **Every document that
records, argues about, or measures the class ADDS occurrences of it** — this very amendment does. **So
the count cannot be scored against a fixed figure.** ⭐ **The owner knows this and accepts the
command-plus-ref form.**

⛔⛔ **THE CONSEQUENCE, STATED PLAINLY BECAUSE IT IS NOW A STANDING RULE FOR THIS CLASS: NOBODY MAY QUOTE
"THE NUMBER" WITHOUT STATING THE REF IT WAS MEASURED AT.** A bare occurrence count for this class, in any
brief, board, report, worklog, review or question, is **not a fact** — it is a fact-shaped string.
⭐ **The evidence for the rule is already in this brief: SIX dated censuses that disagree, the largest
3.6× the smallest, and only the last two recording their scope.**

⛔ **This does NOT reopen criterion 4, whose wording is owner-ruled (T3) and untouched.** ⛔ **Nothing on
the Sprint 9 board was edited by this amendment.**

## What to build

⛔⛔ **FRAME ONLY — THIS BRIEF DOES NOT DESIGN THE GUARD, AND A RUN THAT ARRIVES HAVING ALREADY CHOSEN
HAS SKIPPED ITS PLAN GATE.**

⛔ **Which of the following is right is the implementer's plan-gate decision with the owner:**

- **Extend `test/reference-integrity.test.js`** — it already walks the whole markdown corpus and owns
  the `NAMED_EXEMPT` machinery a citation guard would need.
- **Extend `test/coordination-citation-policy.test.js`** — it already owns a *coordinate* match rule,
  fence and blockquote masking, and the closed-folder exemption. ⚠️ **But its own header states it
  TRANSCRIBES a settled specification document and warns *"Do not paraphrase these into a fresh
  regex"*** — so widening it may mean amending that specification first, which is a larger act than it
  looks.
- **A new test file** — the cleanest seam if the class's exemptions differ materially from both
  siblings'.
- ⛔ **Or the finding that no mechanical guard is sound** — see the `OD3` note above.

**Whatever the shape, the deliverable must settle these six, in writing:**

⚠️ **This list was FIVE until 2026-09-14.** Item 6 was added by the owner ruling **"Amend 0394 with an
exemption-region list (Rec)"**. ⛔ **Items 1–5 are byte-identical to their filed text; the only other
edits are the word "five" → "six" here and in verification step 1.**

1. ⛔⛔ **THE CLASS DEFINITION — this is the whole task, not a preliminary.** Case-sensitivity is
   **the** open question (444 vs 124). Also: does a citation inside a fenced block count? Inside a
   blockquote? Inside inline backticks? ⚠️ **The two sibling guards answer the backtick question
   OPPOSITE ways, deliberately and by owner ruling** — do not reason by analogy from one of them.
2. **The exemption surface.** Closed task folders (`ai-agents/tasks/done/`, `.../cancelled/`) are
   exempt in both siblings. ⛔ **`ai-agents/wiki-vault/` is never walked by either** and must not be by
   this one ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
3. **What "stale" means, mechanically.** ⚠️ **A line number cannot be validated by reading the citing
   file alone** — it has to be checked against the cited ADR's current line count, or the class has to
   be banned outright rather than validated. ⭐ **Those are different guards with different costs, and
   the choice is the plan gate's.**
4. **A `test/prove-red.sh` mutation, or a stated reason there is none**
   ([ADR-026](../../../knowledge-base/decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md)
   discipline — a guard nobody has shown can go red is not a guard).
5. ⛔ **What the guard does about the occurrences that survive `0393`'s sweep.** If the swept scope is
   narrower than the guard's scope, the guard goes red on landing. ⚠️ **Whether that is answered with a
   `NAMED_EXEMPT`-style allowlist, a narrowed guard, or more sweeping is a plan-gate question** — and
   an allowlist that silently grows is the failure mode to name up front.
6. ⛔⛔ **THE EXEMPTION-REGION MECHANISM — added by owner ruling 2026-09-14, see § *The use/mention
   problem* above.** A use and a mention of a coordinate are **lexically identical**, so ⛔ **a guard
   with no declared exemption regions reds on every document that describes the defect.** **Settle, in
   writing:** *(a)* **what a region IS** — a path list, a marker comment, a region delimiter, or
   something else; *(b)* **what it is keyed on**, given that `NAMED_EXEMPT`'s `(citing file, target
   path)` key ⛔ **does not transfer** — a mention has no target path, and the two available keys are
   either over-broad or the banned line-number form; *(c)* **who maintains it and how a task-folder move
   invalidates it** — ⛔ a healed entry is **dead weight to DELETE, not repoint**; *(d)* **what the
   region mechanism BLINDS**, stated in the guard file itself the way `NAMED_EXEMPT` states its own
   cost. ⚠️ **Item 2 (the exemption surface) is a PREREQUISITE of this item, not a parallel question** —
   the closed-folder exemption alone removes roughly half the candidate occurrences.

## Verification steps

1. **The plan gate happened and its six answers are recorded** before any test code was written. ⛔ A
   run that produced a guard without recording the class definition has not met this step.
2. **The chosen shape is stated with the two rejected alternatives and why** — not a bare
   implementation.
3. **The guard is green on the swept tree**, and the census it reports is printed with its scope
   stated alongside it. ⛔ **A count with no scope beside it is what created this row.**
4. **`test/prove-red.sh` demonstrates the guard red**, or the deliverable states why no mutation is
   possible.
5. **Both sibling guards still green:** `node --test test/reference-integrity.test.js` and
   `node --test test/coordination-citation-policy.test.js`. ⚠️ Re-measure their figures; do not copy
   this brief's.
6. ⛔ **`git status --porcelain` shows NO write under `ai-agents/wiki-vault/`**
   ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
7. ⛔ **No new devDependency**
   ([ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)).

## Notes

- **Depends on:** [`0393`](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)
  — ⛔ **hard.** A guard against re-rot is written **against the swept surface**. Written first it
  either lands red against hundreds of occurrences `0393` is about to remove, or ships with an
  allowlist that `0393` then invalidates. ⛔ **`0393` is `P7` of Sprint 9; this row is not on that
  board and must not be pulled onto it.**
- **Blocks:** nothing.

⭐ **On merit** this sits directly below `0393` — same class, same evidence, and it is the half that
makes the sweep durable. ⛔ **It is not ranked there:** this is the unranked Backlog board, which the
owner ruled on 2026-08-29 is an **archive of known issues** with ranking happening at pull time
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
forbids a mid-board insertion). The merit position is recorded here so it can be acted on in one edit.

### ⛔ Scope fences

- ⛔ **Do not sweep.** The sweep is `0393`'s. This row builds the thing that stops the sweep recurring.
- ⛔ **Do not design the guard in this brief** — see the framing warning above.
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **No re-rank** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ **No task-file move by hand** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md))
  — the close goes through `/fkit-task-done`, producer-only, carrying
  `(agent-closed — not owner-verified)` if the owner is absent.
- ⛔ **No commit, no push.**

### ⚠️ State of the tree at filing

Measured 2026-09-14 at filing time: `HEAD` is **`f209a8c "Sprint push"`**, and `git status --porcelain`
was **not clean** — the tree carried uncommitted work from Sprint 8's tail and from this same filing
session. ⛔ **Every figure in this brief is a WORKING-TREE measurement at that `HEAD`, not a committed
state. Re-measure at pickup.**
(`conventions/evidence-before-assertion.md` — asserted from checks made this turn.)

### Filing

Filed 2026-09-14 by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of the relayed ruling **"Sweep now, file a guard row behind it (Rec)"** and
deciding nothing beyond them and the flagged owner-field judgement above. **Appended LAST on the
Backlog board, UNRANKED**, renumbering and inserting nothing. Its id was verified free **both ways** on
2026-09-14 — **max task-folder id on disk `0393`**, and **max board-referenced id across every board
under `ai-agents/sprints/` including `done/` and `cancelled/` `0393`** — the two agreeing.
