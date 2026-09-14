# The two citation sweeps — `architecture.md` outbound/inbound, and the repo-wide `ADR-NNN:LINE` class

## ID
0393

## Sprint
Sprint 9

## Priority
P7

## Status
🔲 Backlog

## Owner
fkit-architect

> ⚠️ **THE OWNER FIELD IS A PRODUCER JUDGEMENT AND IS FLAGGED FOR THE OWNER — the two originals did
> not agree.** `0286` was `fkit-coder`; `0323` was `fkit-architect`.
> [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
> Decision 1 fixes the build role **by the deliverable**. ⚠️ **This row cuts both ways and the choice is
> genuinely arguable:** the census and triage work is **mechanical and coder-shaped**, while the
> per-site *"is this the intended referent?"* judgement, `ADR-013:167`'s live-pointer-versus-worklist
> call, and the OD3 guard-feasibility recommendation are **architect-shaped**. ⛔ **This is not
> settled.** ⚠️ **The owner has already split this work once (2026-09-13); a further split by role is
> available if wanted, and would be a split of this row, not a re-scoping of it.**

## Context

> ## ⭐⭐ DATED OWNER RULING 2026-09-14 — **THE SWEEP SCOPE IS SETTLED: THE WHOLE `ADR-NNN:LINE` CLASS, CASE-INSENSITIVELY.** Every prior byte of this brief left identical.
>
> **Owner ruling, given live via `AskUserQuestion` in an `fkit lead` session with the owner present.
> The option label is the verbatim text: *"Whole class, case-insensitive (Rec)"*.**
>
> ⛔⛔ **This row sweeps the WHOLE `ADR-NNN:LINE` class, CASE-INSENSITIVELY — not the uppercase half.**
> The scope was previously left to this row's plan gate; **it is no longer open.** ⭐ **Group E's `E1`
> already specifies a case-insensitive pattern, so this ruling CONFIRMS `E1` rather than changing it —
> what it removes is the freedom to declare a narrower scope at plan time.**
>
> ### ⛔ THE OWNER'S STATED REASON, RECORDED BECAUSE IT IS THE POINT
>
> ⛔⛔ **Under the narrow (uppercase-only) scope, Sprint 9's success criterion 4 reads as MET while
> roughly 320 occurrences still stand.** A criterion that passes over the majority of its own subject
> measures nothing — and criterion 4 is scored against **this row's declared scope**, which is why the
> declaration had to be settled by the owner rather than by the run.
>
> ### ⭐ THE EVIDENCE — MEASURED, RE-VERIFIED, AND WITH ITS COMMANDS
>
> Re-verified **2026-09-14** at `HEAD` `f209a8c`, working tree uncommitted (`git grep` reads the
> working tree, so uncommitted edits count). ⛔ **These are dated; re-measure at pickup — this brief's
> own rule.**
>
> | Scope | Occurrences | Files | Command |
> |---|---|---|---|
> | **Case-SENSITIVE `ADR-`, all tracked** | **124** | **35** | `git grep -ohE 'ADR-[0-9]{3}:[0-9]+' -- .` |
> | ⭐ **Case-INSENSITIVE, all tracked — THE RULED SCOPE** | ⭐ **446** | ⭐ **67** | `git grep -oihE 'adr-[0-9]{3}:[0-9]+' -- .` |
> | Case-insensitive, minus `wiki-vault/` | **418** | **62** | add `':(exclude)ai-agents/wiki-vault/*'` |
> | Case-insensitive, minus vault and closed task folders | **108** | **26** | also add `':(exclude)ai-agents/tasks/done/*' ':(exclude)ai-agents/tasks/cancelled/*'` |
>
> *(`-l` instead of `-o` gives the file counts.)*
>
> ⭐ **Lowercase concentrations** (`git grep -ohE 'adr-[0-9]{3}:[0-9]+'`, no `-i`, so lowercase only):
> `adr-012` **107** · `adr-010` **53** · `adr-016` **37** · `adr-018` **22** · `adr-008` **17** ·
> `adr-031` **15**.
>
> ⛔⛔ **The ruled class is 3.6× the scope the board was sized against, and 322 lowercase-form
> occurrences lie outside the uppercase half.**
>
> ### ⛔⛔ SECOND DATED OWNER RULING 2026-09-14 — **UNTRACKED FILES ARE INSIDE THE DECLARED SCOPE**
>
> **Owner ruling, given live via `AskUserQuestion` in an `fkit lead` session with the owner present.
> The option label is the verbatim text: *"Include untracked + a specimen class (Rec)"*.**
>
> ⛔ **Every measurement 1–6 above — including this producer's — used `git grep`, which scans TRACKED
> files only.** ⚠️ **`ai-agents/sprints/sprint-9.md` and the briefs for `0392`, `0393` and `0394` were
> all UNTRACKED at `HEAD` `f209a8c`** — ⭐ **re-verified still untracked 2026-09-14** — so **none of the
> six censuses counted them.**
>
> ⛔ **The owner's stated reason, recorded because it is the point:** *a sweep that omits the sprint's
> own artifacts is the same scope-not-recorded failure the census section exists to prevent.*
>
> ### ⛔⛔ THE DECLARED SCOPE IS **THIS COMMAND**, NOT THIS NUMBER
>
> ⭐⭐ **Six censuses disagreed because five of them recorded a FIGURE and not a COMMAND. That is the
> whole lesson of this section.** This row declares the command; the number is whatever it returns on
> the day it is run.
>
> ```
> git grep --untracked -oihE 'adr-[0-9]{3}:[0-9]+' -- .      # occurrences
> git grep --untracked -liE  'adr-[0-9]{3}:[0-9]+' -- .      # files
> ```
>
> ⚠️ **The exemption pathspecs (`':(exclude)…'`) are STILL this row's plan-gate call** — see
> § *WHAT THIS RULING DOES NOT SETTLE* below; ⛔ **this ruling fixed `--untracked`, not the exemption
> list.** ⛔ **Whatever you choose, append it to the command above and record the command you ACTUALLY
> RAN, not merely its output.**
>
> **⭐ RE-VERIFIED 2026-09-14 at `HEAD` `f209a8c`, working tree uncommitted. ⛔ The earlier
> `--untracked` figures are ALREADY STALE; they are shown BESIDE the re-measure, never overwritten:**
>
> | Scope | Tracked only | Earlier `--untracked` | ⭐ **Re-verified `--untracked`** | Drift |
> |---|---|---|---|---|
> | Case-SENSITIVE `ADR-`, whole repo | **124 / 35** — unchanged | 135 / 38 | ⭐ **141 / 38** | ⚠️ **+6 / 0** |
> | Case-INSENSITIVE, whole repo — **THE RULED SCOPE** | **446 / 67** — unchanged | 462 / 71 | ⭐⭐ **472 / 71** | ⚠️ **+10 / 0** |
>
> ⛔⛔ **THE TRACKED HALVES DID NOT MOVE AT ALL; THE UNTRACKED HALVES MOVED BY TEN.** The entire drift
> sits inside the four sprint artifacts, and its cause is plain: **writing this census adds
> occurrences to the class the census measures.**
>
> **The four untracked citers, re-counted case-insensitively:** `sprint-9.md` **9** *(was 4)* ·
> `0393`'s brief **14** *(was 9)* · `0394`'s brief **2** *(unchanged)* · `0392`'s brief **1**
> *(unchanged)*. ⭐ **Total 26** *(the board recorded **16**)*.
>
> ⛔⛔ **THIS BRIEF IS INSIDE ITS OWN DECLARED SCOPE. The count is SELF-REFERENTIAL — it moves every
> time anyone edits this file or the board.** ⭐ **That is precisely why the scope is declared as a
> command pinned to a commit. Re-run it at pickup, at a stated `HEAD`, and record both.**
>
> #### ⛔⛔ AND THE EDIT THAT RECORDED ALL OF THE ABOVE CHANGED THE NUMBER AGAIN — MEASURED, NOT PREDICTED
>
> ⭐⭐ **This is the point demonstrating itself, so it is recorded rather than smoothed over.** The
> `472 / 71` above was measured **immediately BEFORE** this ruling was written into this brief and the
> board. Re-run **immediately AFTER**, same commands, same `HEAD` `f209a8c`:
>
> | Scope | Before this edit | ⭐ **After this edit** | Drift |
> |---|---|---|---|
> | Case-INSENSITIVE, `--untracked` | **472 / 71** | ⭐ **466 / 71** | ⚠️ **−6 / 0** |
> | Case-SENSITIVE, `--untracked` | **141 / 38** | **137 / 38** | ⚠️ **−4 / 0** |
> | Tracked-only, case-insensitive | **446 / 67** | **446 / 67** | ✅ **exact — no tracked file was touched** |
>
> **Untracked citers after the edit:** `sprint-9.md` **4** · `0393`'s brief **13** · `0394`'s brief
> **2** · `0392`'s brief **1** — ⭐ **total 20**, against **26** before.
>
> ⛔ **It went DOWN, and the direction matters:** the edit **replaced** two long sample lists with
> shorter ones. ⚠️⚠️ **⛔ THIS IS NOT PROGRESS AND MUST NOT BE READ AS ANY** — not one citation was
> repaired; **prose about the defect was reworded.** ⭐⭐ **A census over documents that discuss the
> defect measures the prose as much as the rot** — which is the strongest argument on this page for
> **declaring the scope as a command and pinning a commit**, and, for
> [`0394`](../0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md),
> for an **exemption-region list**. ⛔ **Do not cite the −6 as a trend, exactly as the "+8 in one day"
> figure below must not be cited as one.**
>
> ### ⛔⛔ AND A FOURTH TRIAGE CLASS — **A MENTIONED COORDINATE, LEFT BYTE-IDENTICAL**
>
> **Ruled the same day, same channel, same verbatim label — *"Include untracked + a specimen class
> (Rec)"*.** ⭐ **It is written into `E2` below as that group's fourth class.**
>
> ⛔⛔ **A mechanical sweep that "repairs" one of these corrupts the record of the very class it is
> sweeping.**
>
> ⚠️⚠️ **THE EARLIER CLAIM THAT ALL OF THEM ARE "QUOTED EXAMPLES" IS WRONG, AND THIS PRODUCER IS
> CORRECTING IT RATHER THAN COPYING IT FORWARD.** Re-read site by site 2026-09-14, the 26 fall into
> **two** kinds, not one:
>
> | Kind | What the sentence is doing | Measured examples |
> |---|---|---|
> | **(a) Specimen** | The coordinate is an **item in a list of samples** of the defect | the `adr-008:54` / `adr-001:22` sample list; `0394`'s brief, its census bullet |
> | **(b) Subject-of-work** | The coordinate **is the thing the sentence is about** — a triage target, or a dated measurement result | `E4`'s *"triage its FIVE coordinates"*; `E4`'s *"has drifted a second time"*; `X5`'s `architecture.md` site |
>
> ⛔ **Kind (b) is NOT a quoted example, and a triage hunting only for examples WILL MISS IT.**
> **Repairing a kind-(b) site rewrites this row's own scope statement, or falsifies a dated
> measurement.** ⭐ **What unifies the two kinds into one class: both are MENTIONS of the coordinate
> rather than USES of it.**
>
> ### ⭐⭐ HOW A WORKER TELLS A LIVE CITATION FROM A MENTION — **THE TEST, NOT JUST THE WARNING**
>
> ⛔⛔ **THE TEST. Apply it at every site, and write its answer into that site's worklog row:**
>
> > **Replace the line number with the correct one. Does the surrounding sentence become FALSE?**
>
> - **NO — the sentence stays true and merely points more accurately** → **LIVE CITATION.** The
>   coordinate exists to send a reader to content. ⭐ **Repair it** (`E3`).
> - **YES — the sentence becomes false** → **MENTION**, the fourth class. The sentence asserts
>   something *about that exact string*: that it occurs in the repo, that it has drifted, that it is a
>   sample of the class, that it is this row's target. ⛔ **Leave it byte-identical.**
>
> ⭐ **Two fast corroborating signals — either alone is sufficient, neither is necessary. ⛔ The test
> above decides; these only speed it up:**
>
> 1. **Grammatical role.** The coordinate is the **subject** of its sentence (*"`ADR-010:130` has
>    drifted"*), or an item after *sample / specimen / example / e.g. / such as / and the like* →
>    **mention**. It follows *see / per / at / cited at / →* → **citation**.
> 2. **What the enclosing document is ABOUT.** Inside a document *about citation rot* — this brief,
>    `0394`'s brief, Sprint 9's census section,
>    [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md),
>    the reference-integrity report — **mention is the DEFAULT**, and a live citation is the exception
>    that must be argued for in the worklog row.
>
> ### ⚠️⚠️ THE LIMIT OF THE TEST, STATED PLAINLY RATHER THAN GLOSSED OVER
>
> ⛔ **The test is a READING JUDGEMENT, not a mechanical one.** A use and a mention are lexically
> identical — both are `` `ADR-013:167` `` in backticks — so ⛔ **no regex, no pattern and no case rule
> separates them.** Three consequences, all binding on this row:
>
> - ⛔ **A fourth-class site STILL NEEDS ITS OWN WORKLOG ROW**, under `E2`'s existing rule (*"a site
>   with no worklog row is an unfinished triage, not an implicit leave-it"*). ⭐ **`mentioned` is a
>   verdict you RECORD, not a step you SKIP.**
> - ⚠️ **Where the test is genuinely ambiguous at a site, ⛔ DO NOT GUESS** — record it as `mention?`
>   and raise it at the plan gate. **A wrong "repair" here is unrecoverable from the diff alone,
>   because the corrupted text still looks perfectly well-formed.**
> - ⛔⛔ **THIS BEARS DIRECTLY ON THE GUARD ROW
>   [`0394`](../0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md)
>   — ⚠️ FLAGGED HERE, ⛔ NOT WRITTEN INTO THAT BRIEF, which this producer was fenced from touching.**
>   A guard that flags this class mechanically **will fire on every fourth-class site**. ⭐ **The fix is
>   a DECLARED EXEMPTION-REGION LIST, not a cleverer pattern** — and that is a design question `0394`
>   must ANSWER, not inherit.
>
> ### ⚠️ WHAT THIS RULING DOES **NOT** SETTLE
>
> ⛔ **The EXEMPTION LIST is still this row's plan-gate call.** The ruling fixes **case**; it does not
> decide whether `ai-agents/wiki-vault/` (⛔ routed to `fkit-wiki` regardless — `E6`,
> [ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
> or closed task folders (`tasks/done/`, `tasks/cancelled/`) are in or out. **The table above prices
> every combination.** ⚠️ **Declare the exemptions in the plan, in writing, before measuring.**
>
> ⛔ **`OD3`, `OD4` and `OD5` are untouched** and stay open.
>
> ### ⛔⛔ AND ONE FIGURE THAT MUST NOT BE CITED AS MEASURED FACT
>
> ⛔ **The "+8 occurrences and +5 files in one day" growth figure is NOT REPRODUCIBLE.** ⚠️ **It was
> relayed to the owner as measured fact more than once, including inside a question the owner then
> ruled on.** **None of the four prior measurements recorded its scope, so none can be checked against
> another** — and under the closest reproducible scope the count moved the other way. ⛔ **Do not cite
> it as a measurement in any plan, worklog, report or question produced by this row.** ⭐ **The guard
> row [`0394`](../0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md)
> stands on the better reason: a class whose census cannot be reproduced across six measurements has
> no machine-checkable definition.**
>
> ⛔ **Recorded by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
> which asked nothing and decided nothing beyond transcribing this ruling and re-verifying its
> numbers. Nothing re-ranked, nothing renumbered, no `## Sprint` or `## Priority` field touched.**

> ## ⭐⭐ THIRD DATED OWNER RULING 2026-09-14 — **`adr-013:~167` IS NOT PRE-RULED. IT STAYS THIS ROW'S TRIAGE CALL.** Every prior byte of this brief left identical.
>
> **Owner ruling, given live via `AskUserQuestion` in an `fkit lead` session with the owner present.
> The option label is the verbatim text: *"Leave to 0393's triage (Rec)"*.**
>
> ⛔ **The question put to the owner was whether `adr-013-…md` line ~167 should be named up front as
> an exemption region in the guard row
> [`0394`](../0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md).
> The owner DECLINED to pre-rule it and returned it here.**
>
> ### ⛔ THE OWNER'S STATED REASON, RECORDED BECAUSE IT IS THE POINT
>
> ⛔⛔ **Deciding it now would settle it from LESS CONTEXT than the person doing the sweep will have.**
> The site's disposition is a per-site reading judgement, and `E2`'s test is applied by the worker at
> the site, not by a producer reading a table.
>
> ### ⚠️⚠️ THE OBSERVATION IS CARRIED INTACT, AND IT IS A TENSION, NOT A DECISION
>
> **The site reads, verbatim at `HEAD` `f209a8c`:**
>
> > *"- **Inbound links must be repaired**, notably **ADR-007:29,123**, **ADR-009:22,131** and
> > **ADR-010:130**, which cite the six as evidence."*
>
> - ⭐ **It is a WORK-LIST, so under `E2` as written TODAY it is kind (b) — subject-of-work — and
>   therefore `mentioned`, left byte-identical.**
> - ⚠️ **BUT if that work ever lands, the sentence should arguably be REPAIRED rather than exempted
>   forever.** ⛔ **That tension is the triage note. It is NOT a verdict, and this brief does not
>   settle it.**
>
> ### ⛔ TWO MEASURED FACTS THE TRIAGE NEEDS, VERIFIED 2026-09-14 AT `HEAD` `f209a8c`
>
> 1. ⛔⛔ **THE SITE IS THREE PATTERN MATCHES BUT FIVE COORDINATES, AND `E4` IS RIGHT.** Under the
>    declared command's pattern `adr-[0-9]{3}:[0-9]+` the line yields **3** hits
>    (`ADR-007:29,123` · `ADR-009:22,131` · `ADR-010:130`) because the pattern stops at the comma.
>    Read as coordinates it is **5** (`29`, `123`, `22`, `131`, `130`) — which is exactly what **`E4`**
>    demands one row each for. ⚠️ **A triage that counts census hits will produce THREE rows and fail
>    verification step 15.** ⭐ **`E1`'s fuller pattern `adr-[0-9]{3}:[0-9]+(,[0-9-]+)*` catches the
>    comma tail; neither pattern splits it into five.**
> 2. ⚠️ **The line is UPPERCASE**, so it is inside the narrow uppercase half as well as the ruled
>    case-insensitive class. ⛔ **Its sibling candidate `adr-042-…md:~379` is LOWERCASE** — a
>    case-sensitive guard would see one and not the other. **Dated; re-measure.**
>
> ⭐ **Cross-noted on [`0394`](../0394-build-a-guard-for-the-adr-nnn-line-citation-class-so-the-sweep-is-not-repeated/brief.md)**,
> which already names this site in its candidate-exemption table.
>
> ⛔ **`OD3`, `OD4` and `OD5` remain OPEN and are NOT discharged by this ruling.** ⚠️ **`OD4` —
> *"is `ADR-013:167`'s bullet a live pointer or a dated worklist?"* — is the SAME question in a
> different guise, and the owner has now confirmed it belongs here.** ⛔ **Do not read this ruling as
> answering it.**
>
> ⛔ **Recorded by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
> which decided nothing beyond transcribing this ruling and verifying the two facts above. Nothing
> re-ranked, nothing renumbered, no `## Sprint`, `## Priority` or `## Status` field touched, no row
> filed.**

### ⭐⭐ THIS ROW WAS CREATED BY A SPLIT ON 2026-09-13. READ THIS FIRST.

**Owner ruling 2026-09-13, given live via `AskUserQuestion` in an `fkit lead` session with the owner
present — the option label is the verbatim text: "Split A–C from D–E (Rec)".**

⭐ **This row is Groups D and E, split out of
[`0392`](../0392-architecture-md-prose-repair-9-1-inventory-9-1-occurrence-b-and-9-5-residuals/brief.md),
which had consolidated five cancelled originals into one five-group row.** `0392` keeps the genuine
`architecture.md` prose repair — Groups A–C, from `0251`, `0376` and `0366` — plus open decisions
**OD1** and **OD2**. This row takes the **two citation sweeps**, from `0286` and `0323`, plus **OD3**,
**OD4** and **OD5**.

⛔ **Nothing was dropped by the split.** Every original's scope is traceable across the two rows; see
the provenance map in `## Notes` here and its mirror on `0392`.

⛔ **The five cancelled originals are NOT resurrected.** `0251`, `0376`, `0366`, `0286` and `0323`
remain properly cancelled and frozen. Both rows cite them as **provenance only**.

⚠️ **The split was authorised, not invented.** `0392`'s own `## Notes` had already flagged this exact
boundary — *"The natural split, if one is wanted, is Groups A–C (one file, prose) from Groups D–E
(citations, repo-wide) — one edit, no renumbering. Flagged, not decided."* The owner decided it.

### ⛔⛔ THIS ROW RUNS AFTER `0392`. THAT IS A HARD DEPENDENCY, NOT A PREFERENCE.

⚠️ **This is the split's load-bearing consequence and the easiest thing to lose.** The consolidated
row's safe internal order was **`B → A → C → E → D`**, because **Group D's deliverable IS line
arithmetic** and every prose group moves the coordinates it depends on.

⭐ **That ordering is now a dependency between two rows.** ⛔ **Running this row before `0392` lands
guarantees a second pass** — every coordinate derived before `0392`'s Groups A and B resize §9.1 is
dead on arrival, and **`0392`'s OD2 may delete §9.5 entirely** (see X4), which no shift map computed
beforehand can survive.

### ⛔⛔ THE TWO HALVES OF THIS ROW ARE NOT THE SAME SIZE, AND ONE OF THEM IS NOT AN `architecture.md` TASK

⛔⛔ **GROUP E (`0323`) IS REPO-WIDE, NOT AN `architecture.md` TASK.** Its scope is a **case-insensitive
`ADR-NNN:LINE` sweep across `ai-agents/` and `claude/`**; `architecture.md` is **one target among
many** and contributes exactly **one** site to it. ⚠️ **Stated this prominently because the row's title
and its sibling both say `architecture.md`, and a reader who scopes Group E to that file will scope it
to roughly one percent of its real size.**

⭐ **The census RE-MEASURED far larger than the original recorded.** `0323`'s brief carried **66**
uppercase-class occurrences. **Re-measured 2026-09-13: 110 occurrences across 27 files.** ⚠️ **A
further re-measure taken when this split was filed returned 117 occurrences across 29 files** with
`grep -rIoE 'ADR-[0-9]{3}:[0-9]+' ai-agents/ claude/ --exclude-dir=wiki-vault`, and **`claude/`
measured 0**. ⛔ **All three figures are dated observations, and they disagree with each other — which
is the point.** The class grows as the repo does. ⛔ **Measure it yourself; E1 requires your own
numbers and requires you to say the earlier ones were wrong if they differ.**

⚠️ **Group E alone is larger than everything else in this row and its sibling combined.** ⭐ **Its work
is separable in one edit** — if the size is still not what the owner intended, splitting Group E out
again is a one-edit change. **Flagged, not decided.**

### ⛔ `0286` IS ALREADY PARTLY SATISFIED — by `0356` in SPRINT 7, NOT Sprint 8

⚠️ **Two things are commonly got wrong here and both matter at pickup.**

**First: which sprint.** The work that discharged most of `0286`'s half A was
[`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md), commit `351bea3`,
**2026-09-04 — Sprint 7-era.** ⛔ **Not Sprint 8.** Sprint 8 touched `architecture.md` exactly once
(`abb1388`, `+4 / −4`, from `0341`, all four lines in §4.2 and §6) and its board carried no
`architecture.md` row at all.

**Second: `0286`'s own brief records neither its split nor its partial completion.** `0366`'s brief
states that `0286` was split by owner ruling *"Split — half A now, half B stays open (Rec)"*, half A
shipping as `0356` and half B left open. ⛔ **`0286`'s own brief carries no note of this** — it still
reads as though both halves are outstanding. ⚠️ **D0 therefore begins by re-establishing what half A
actually covered**, rather than trusting either brief.

**What remains, measured 2026-09-13 — an existence proof that half A is INCOMPLETE, not a work list:**

| | |
|---|---|
| **Half A, outbound — partly done** | `0356` replaced **six of the seven** coordinates `0286` named individually, and the durable heading-plus-fragment form is now the file's dominant style — **A3 largely landed** |
| **Half A, the census — evidenced nowhere** | ⛔ `0356` ran a **class** sweep, not `0286`'s per-citation census. **A1/A2 are not satisfied** |
| **Still stale** | ⚠️ **At least SEVEN outbound coordinates measured wrong or drifted**, out of roughly twenty-eight `path:NNN` coordinates remaining in the file — including `claude/fkit-claude.sh:274-285` for the Codex preflight, which **`0286` names BY NUMBER as an unfixed hit** |
| **Half B, inbound — never run** | ⛔ **Untouched. No part of it has been done by anything.** |

⛔ **Re-derive all of it. These figures are dated 2026-09-13 and are an existence proof, not a target
list.**

### ⛔⛔ EVERY PREMISE IN THIS BRIEF PREDATES THE CURRENT REPO. RE-DERIVE AT PICKUP.

**The two originals were measured between 2026-08-07 and 2026-09-04, and `0392` will edit
`architecture.md` before this row runs.** Every line number, every count, every quoted fragment and
every "on disk today" claim carried into this brief is **evidence of a defect's existence, never a
coordinate to work from**.

⛔ **Do not copy a single figure out of this brief into any file.** Each group below restates its
original's own re-derivation instruction, because each original already carried one — that
instruction is the fix, and it stands.

## What to build

**Group D targets `ai-agents/knowledge-base/architecture.md`. ⛔ Group E is REPO-WIDE.** Every item
below names the original it came from. ⛔ **Nothing here may be dropped without saying so and why.**
---

### Group D — the `architecture.md` citation sweep · from [`0286`](../../cancelled/0286-mechanical-citation-sweep-of-architecture-md/brief.md)

⚠️ **Half A shipped as [`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md).
Half B — the inbound coordinates — was never run.** ⛔ **`0286`'s own brief records neither fact.**

**D0. Re-establish what half A actually covered before doing anything else.** Read `0356`'s worklog
and measure the current file. ⛔ **Do not assume the outbound half is complete because a brief
elsewhere says a split happened.**

> ⭐ **What a 2026-09-13 re-measure found — evidence that half A is INCOMPLETE, not a work list.**
> `0356` replaced six of the seven coordinates `0286` named individually, and the durable
> heading-plus-fragment form is now the file's dominant style — **A3 largely landed**. ⛔ **But the
> per-citation census A1/A2 demand is evidenced nowhere**: `0356` ran a *class* sweep, not `0286`'s
> census. **Roughly twenty-eight outbound `path:NNN` coordinates remain in the file, and at least
> seven were measured wrong or drifted — including `claude/fkit-claude.sh:274-285` for the Codex
> preflight, which `0286` names BY NUMBER as an unfixed hit.**
> ⛔ **Re-derive all of it. These figures are dated 2026-09-13 and are an existence proof, not a
> target list.**

**D1. Outbound — enumerate every citation written inside `architecture.md`, mechanically.** ⛔ **A
spot-check does not satisfy this** — spot-checking is exactly what produced the nine misses that
created `0286`. ⛔ **Re-derive the list; do not work from any count in this brief.**

**D2. Resolve every one against disk with a verdict per citation** — *correct* / *corrected, was `X`
now `Y`* / *fenced, owned by task NNNN* / *unresolvable, reported*.

**D3. Correct in the durable form.** *"The durable anchors are the quoted text, not the numbers."*
Where a citation can carry the quoted text or a function name alongside the number, **give it one**,
per
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md).
⛔ **This task applies whatever convention is on disk; it does not invent one.**

**D4. ⛔ Correct the citation, never the prose.** If a **claim** looks wrong, **report it — do not fix
it.** ⭐ *"Repairing a coordinate that supports a false sentence would make the sentence look
verified."* ⛔⛔ **AFTER THE 2026-09-13 SPLIT THIS ROW HAS NO PROSE-REPAIR EXCEPTION AT ALL.**
⚠️ **The consolidated row's exceptions were Groups A–C, and they are
[`0392`](../0392-architecture-md-prose-repair-9-1-inventory-9-1-occurrence-b-and-9-5-residuals/brief.md)'s
now.** ⭐ **D4 therefore binds EVERYWHERE in this row, without exception — the split made this
instruction stronger, not weaker.** ⛔ In particular, §9.5's stale anchors are **`0392`'s Group C
alone** (see X3): it repairs the anchor and the false claim it supports **together**, which is the only
safe treatment. ⛔ **Do not touch them here, in either direction.**

**D5. Inbound — re-derive the shift map from disk**, not from any table. ⛔ **Do not use an inherited
map**; `0286`'s own table was a correction of a recorded `+4` that was wrong.

**D6. Sweep for inbound citations pointing at `architecture.md`, using more than one pattern**, and
resolve each: **correct the live ones, fence the frozen ones, report the ambiguous ones.**

**D7. Where a shifted line falls inside a rewritten range, arithmetic does not apply** — the content
changed. **Re-derive by reading what the citing text claims and finding it.**

**D8. OPEN — the guard-test question. ⛔ Not required, ⛔ not pre-decided.** Could a guard test catch
stale line citations mechanically? ⚠️ **Genuinely open:** the weak form catches almost nothing, the
strong form needs a quotable anchor the corpus mostly lacks, and a noisy guard people learn to ignore
is worse than none. **Reach a recommendation with reasoning; "infeasible" is a legitimate answer —
say why.** ⛔ **Do not build it without approval at the plan gate**, and if built it needs a
`prove-red.sh` mutation like everything else. ⚠️ **Check
[`0371`](../0371-cost-widening-the-citation-guards-target-class-to-source-file-coordinates/brief.md)
and [`0368`](../0368-give-the-ownerless-source-file-coordinate-rot-class-an-owner-and-measure-it/brief.md)
first — both are open and may already own part of this question.**

---

### Group E — the repo-wide `ADR-NNN:LINE` re-sweep · from [`0323`](../../cancelled/0323-re-sweep-the-adr-line-citation-class-case-insensitively-and-repair-adr-013s-drifted-pointers/brief.md)

⛔ **REPO-WIDE, not `architecture.md`-only.** See the scope warning in § *Context*.

⭐ **The sentence this group exists to prove is the convention page's own:** *"A citation form is only
as good as the pattern that finds violations of it."*

**E1. Re-run the sweep with the corrected pattern** — case-insensitive, **digits required**:
`adr-[0-9]{3}:[0-9]+(,[0-9-]+)*`, across `ai-agents/` and `claude/`, ⛔ **excluding
`ai-agents/wiki-vault/`**. **Record the command and its raw output.**
- ⛔⛔ **CASE-INSENSITIVITY IS NOW AN OWNER RULING, NOT A PATTERN CHOICE** — 2026-09-14, verbatim option
  label ***"Whole class, case-insensitive (Rec)"***; see the dated ruling at the top of `## Context`,
  which carries four re-verified scopes with their commands. ⛔ **A narrower declared scope is no longer
  available to this run.** ⚠️ **The exemption list — vault, closed task folders — remains this row's
  plan-gate call.**
- ⛔ **Do not carry `0323`'s `351 / 285 / 66 / 27` forward unverified.** State your own numbers, and
  **say the original was wrong** if they differ. ⭐ **It already is:** a 2026-09-13 re-measure of the
  uppercase class alone returned **110 occurrences across 27 files** against the original's **66**, so
  `0323`'s own *"re-derive, don't quote"* instruction pays off immediately. `claude/` still measured
  **0**. ⛔ **These are dated too — measure again.**
- ✅ **Report `claude/`'s count positively, including if it is `0`.** ⛔ Absence claims are the
  expensive ones — a stated zero with its command beats silence.
- ⚠️ **Also report the loose-pattern false-positive count** (`[0-9,-]*` vs `[0-9]+`), so the next
  reader knows why the pattern matters.

**E2. Triage EVERY occurrence into one of FOUR classes, one worklog row per occurrence:**
**correct** (⛔ leave it — do not "repair" it) · **drifted, live** (→ repair) · **drifted, frozen**
(→ annotate or leave, per E4's decision shape) · ⭐ **mentioned** (→ ⛔ **leave BYTE-IDENTICAL**).
⛔ **A site with no worklog row is an unfinished triage, not an implicit "leave it."** ⛔ **Resolve
each site's intended referent by READING ITS CONTEXT — never by arithmetic, never by pattern.**
- ⭐⭐ **THE FOURTH CLASS — `mentioned` — WAS ADDED BY OWNER RULING 2026-09-14**, given live via
  `AskUserQuestion`, verbatim option label ***"Include untracked + a specimen class (Rec)"***.
  **A `mentioned` coordinate is one the sentence is TALKING ABOUT rather than USING to point a reader
  somewhere** — a sample of the defect, a triage target, or a dated measurement result. ⛔⛔ **Repairing
  one CORRUPTS THE RECORD OF THE VERY CLASS THIS ROW IS SWEEPING.**
- ⛔ **THE TEST, and it is the same one at every site:** *replace the line number with the correct one
  — **does the surrounding sentence become FALSE?*** **YES → `mentioned`, leave it. NO → live
  citation, repair it.** ⭐ **The full statement — its two corroborating signals (grammatical role;
  what the enclosing document is about) and its stated limit — is in § *Context* above.**
- ⚠️ **The test is a READING JUDGEMENT, ⛔ not a mechanical one** — a use and a mention are lexically
  identical, so no pattern separates them. **Genuinely ambiguous site → record it as `mention?` and
  raise it at the plan gate. ⛔ Do not guess** — a wrong "repair" here is unrecoverable from the diff
  alone, because the corrupted text still looks well-formed.
- ⛔ **`mentioned` is a VERDICT YOU RECORD, not a step you SKIP** — the worklog row is required exactly
  as it is for the other three classes.
- ⚠️ **Expect these to cluster, not scatter.** Measured 2026-09-14, **26 of them sit in just four
  files** — this brief, `0394`'s, `0392`'s and the Sprint 9 board — because those are the documents
  *about* the defect. ⛔ **Dated; re-derive.**

**E3. Repair the live-drifted sites to heading plus quoted fragment.** ⛔ **A bare `path:NNN`
replacement is not a repair** — the fragment does the locating; the heading only gives a region.

**E4. `ADR-013:167` specifically — triage its FIVE coordinates individually and say so.**
- ⛔ **Do not apply one treatment to the sentence.** At least three had drifted, at least one had not.
  ⚠️ **Re-measured 2026-09-13, and one moved AGAIN:** `ADR-009:131` **still lands correctly** on its
  `- Evidence:` line — ⭐ **that is the don't-repair-what-works check, and E-verification step 25 is
  its guard** — while `ADR-010:130` has **drifted a second time**, onto different text than `0323`
  recorded. ⛔ Dated figures; re-derive every one.
- ⚠️ **Decide, in writing and with a reason, whether the bullet is a live pointer or a dated
  worklist.** ⛔ Not pre-decided. **If the call is genuinely contested, return it to the owner as a
  residual rather than settling it.**
- ⛔ **`ADR-013`'s `- **Status:** accepted` does NOT change.** A drifted fact never makes an ADR
  `superseded`.
- If the treatment is an appended note, ⚠️ **use `0198`'s form** —
  `claude/skills/fkit-record-decision/SKILL.md`, `## Correcting an accepted ADR — the dated correction
  note` — ⚠️ **marker only**, original left **byte-identical**, proved by `git diff --numstat` reading
  `N  0` plus the form's exact deletion-filter grep. ⛔ **Consume the form; do not edit the skill.**

**E5. Record the finding as an instance of the convention's own sentence** — the worklog must state,
in its own words, that the class survived because the **pattern** was case-sensitive, not because the
**rule** was wrong. ⚠️ **Whether the convention page should gain a case-insensitive-sweeping rider is
a question for the owner — raise it, ⛔ do not write it.**

**E6. Route, do not write, the vault sites.** Report `ai-agents/wiki-vault/`'s count and paths for
routing to `fkit-wiki`. ⛔ **No write to the vault, ever**
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

**E7. Prove nothing else moved.** Run `bash claude/skills/fkit-status/dashboard.sh
ai-agents/sprints/backlog.md` against a **before-edit capture**. ⚠️ **A pass is not "exit 0"; it is
"byte-identical to the before capture"** unless a board row was itself a repaired site, in which case
the difference must be **only** that row's coordinate.


## ⛔ THE COLLISIONS — one internal, four inherited from the split

⚠️ **Read this before planning.** The split removed the concurrency hazard between this row and
`0392`'s prose groups by **ordering** them; it did not remove the constraints themselves.

**The safe internal order in this row is `E → D`.** ⭐ **Group D's deliverable IS line arithmetic, so
it runs last, against a settled file** — settled by `0392` first, then by Group E's own repairs.

| # | Collision | Sides | How it resolves |
|---|---|---|---|
| **X1** | **§9.1's length changes twice** — `0392`'s Group A enumeration rewrite (8 names → ~29, or the list dropped under its OD1) and its Group B bullet rewrite both resize §9.1, shifting every line below it | **`0392`** ↔ this row | ⭐ **Order, now cross-row.** ⛔ **No coordinate this row measures before `0392` lands survives it.** Derive nothing until `0392` has landed |
| **X3** | ⛔⛔ **THE SHARPEST ONE — §9.5's two bare coordinates are stale AND the claims they support are false** | **`0392`** ↔ D | ⛔ **ONLY `0392`'s Group C may touch them, and it must fix the claim and the anchor TOGETHER.** **D4** forbids repairing a coordinate attached to a false claim — *"repairing a coordinate that supports a false sentence would make the sentence look verified."* ⚠️ **This is exactly why `0356` reported instead of repairing, and why `0366` existed at all.** ⭐ **The split makes this SAFER:** the two treatments now sit in different rows and cannot be confused inside one run |
| **X4** | **If `0392`'s OD2 deletes §9.5**, the removal takes the accurate `ADR-027` dual-home paragraph with it and shifts everything below | **`0392`'s OD2** ↔ D | ⚠️⚠️ **SETTLE OD2 — on `0392`, at its plan gate — BEFORE DERIVING ANY SHIFT MAP HERE.** ⛔ A whole-section deletion is a case `0286`'s fences never anticipated. ⭐ `0392`'s verification step 17 requires its run to state OD2's answer plainly, for exactly this reason |
| **X5** | **`architecture.md`'s one `ADR-NNN:LINE` site** (`ADR-008:85`) sits in **both** Group D's *"every citation inside the file"* and Group E's class | D ↔ E | ⭐ **INTERNAL to this row, and disambiguated here: it belongs to Group E's census, classed *correct*, and is ⛔ NOT a repair target in either group.** Measured 2026-09-13 as landing exactly on the claim it supports. It is the file's proof that correct members of this class exist |
| **X6** | **§9's suite and mutation counts** were fenced OUT of `0286` (*report, don't fix*) and INTO `0251` | **`0392`'s Group A** ↔ D | ⭐ **The fence survives the split.** **`0392`'s Group A owns those counts**; ⛔ **Group D still may not touch a count — D4 binds** |

⚠️ **X2 (the occurrence-B bullet's three layers of instruction) went entirely to `0392`** — both its
sides are there. It is recorded on that row, not here.

## ⭐ The open decisions this row carries — ⛔ none is settled here

⚠️ **Three of the five open questions that arrived with the originals came to this row. A run that
arrives having already chosen has failed them.** Each belongs at this task's **plan gate, with the
owner present**.

| # | Question | Origin | Standing |
|---|---|---|---|
| **OD3** | **Should a guard test catch stale line citations mechanically?** | `0286` C8 | ⛔ Open. **Recommendation required; *"infeasible"* is legitimate — say why.** ⚠️ **Check [`0371`](../0371-cost-widening-the-citation-guards-target-class-to-source-file-coordinates/brief.md) and [`0368`](../0368-give-the-ownerless-source-file-coordinate-rot-class-an-owner-and-measure-it/brief.md) FIRST** — both are open and may already own part of this question. ⛔ **Do not build it without approval at the plan gate**, and if built it needs a `prove-red.sh` mutation like everything else |
| **OD4** | **Is `ADR-013:167`'s bullet a live pointer or a dated worklist?** | `0323` 4 | ⛔ Open. **Decide in writing with a reason; ⛔ return it to the owner if genuinely contested** |
| **OD5** | **Should the citation convention page gain a case-insensitivity rider?** | `0323` 5 | ⛔ Open. **Raise it; ⛔ do not write it** |

⚠️ **OD1 and OD2 stayed with [`0392`](../0392-architecture-md-prose-repair-9-1-inventory-9-1-occurrence-b-and-9-5-residuals/brief.md).** ⛔ **Do not answer them here** — but ⚠️ **OD2's answer is an input to this row** (X4).

## ⛔ Out of scope

- ⛔ **THE PROSE REPAIR.** Groups A, B and C — §9.1's test-suite inventory, §9.1's occurrence-B
  clauses, and §9.5's residual bullets — are
  [`0392`](../0392-architecture-md-prose-repair-9-1-inventory-9-1-occurrence-b-and-9-5-residuals/brief.md)'s,
  by the 2026-09-13 split ruling. ⛔ **This row has NO prose-repair exception (D4).**
- ⛔ **Any `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)). **Report the vault's count and paths for routing to `fkit-wiki`** (E6).
- ⛔ **Any behaviour change.** Documentation and citations only. ⚠️ Group E may repair **comment text**
  under `claude/`; ⛔ changing any behaviour there is not in scope.
- ⛔ **Any `## Status` value, any ADR's `- **Status:**` line, any task status, any rank, any row order
  or row count on any board** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ **No task file moved, renamed or reopened** — movers are producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- ⛔ **`test/fixtures/closed-rank-0174-before.md` and `-after.md`.** ⚠️ **Their byte content IS the
  assertion** — `test/closed-rank-immutability.test.js` reads them. ⛔ **Never touched by a citation
  sweep.**
- ⛔ **`ai-agents/sprints/done/` and everything under `ai-agents/tasks/done/` or `cancelled/`** —
  frozen history. A closed record that is now false is corrected by an **appended dated note**, never
  an edit. ⛔ **This row does not append those notes either — report what needs one.** ⚠️ **`0323`'s
  four `sprints/done/sprint-2.md` sites are COUNTED AND NAMED, ⛔ never rewritten.**
- ⛔ **`claude/skills/`, `dashboard.sh`, and every agent file** as *behaviour*. This row **consumes**
  the correction-note form and the convention page; it changes neither.
- ⛔ **Writing a new convention, rider, guard, check or tooling change** — see OD3 and OD5. Raise, do
  not build.
- ⛔ **Widening into the non-`ADR-NNN:LINE` citation classes** — the hyphenated `task NN` class was
  `0308`'s and `0309`'s, both closed.
- ⛔ **No new devDependency** ([ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)). ⛔ **No commit, no push.** ⛔ **No secrets in any artifact.**

## Verification steps

**Scope and fences**

1. **`git diff --stat` lists only this row's intended paths** — `ai-agents/knowledge-base/architecture.md`
   for Group D, plus Group E's repaired sites. ⚠️ **Other workers' pre-existing dirty paths must be
   listed and excluded by name, not waved at.**
2. **Every fence held.** Name each fenced item and show it is byte-identical. ⛔ **`git diff --stat`
   must show zero changes under `test/fixtures/`, `ai-agents/tasks/done/`,
   `ai-agents/tasks/cancelled/` and `ai-agents/sprints/done/`.**
3. **`git status --porcelain` shows nothing under `ai-agents/wiki-vault/`.**
4. ⭐ **The run states that `0392` had landed before any coordinate was derived**, and names the
   commit or working-tree state it measured against. ⛔ **A run that cannot state this has not
   satisfied its dependency**, whatever its diff looks like.
5. ⭐ **The run states `0392`'s OD2 answer** and shows the shift map was derived after it (X4).
6. ⛔ **No prose sentence changed anywhere.** Every hunk in this row is a citation string or a
   comment-text coordinate. **D4 binds without exception here.**

**Group D**

7. **The enumeration is complete and machine-derived.** Paste the command and its full output, for
   **both** directions. ⚠️ **A hand-written list does not satisfy this step.**
8. **Every citation has exactly one recorded verdict. ⛔ One line per citation.** A batch verdict such
   as *"the rest were correct"* does not satisfy this step.
9. **Every corrected citation resolves.** Show the new coordinate **and the line content found
   there**. ⛔ **Do not assert "verified" without showing what you read.**
10. **The shift map was re-derived, not inherited.** Show the diff or commit it came from.
11. **D0 is evidenced** — the run states what `0356`'s half A actually covered, from `0356`'s worklog
    and its own measurement of the current file. ⛔ **Not from a claim in this brief or in `0366`'s.**
12. **OD3 has a recommendation with reasoning** — built, or declined with the reason stated. ⛔ Not
    silently dropped. ⚠️ **The run states what it found in `0371` and `0368`** before recommending.

**Group E**

13. **The census is reproduced firsthand** with the corrected `[0-9]+` pattern; the worklog states its
    **own** totals for case-insensitive / lowercase / uppercase and file count, plus a ✅ **positively
    stated count for `claude/`, including a zero.** ⛔ **And it says plainly whether its numbers agree
    with `0323`'s 66, the 110/27 of 2026-09-13, or the 117/29 measured at split time** — ⚠️ **those
    three already disagree; a fourth figure is expected, not alarming.**
14. **The triage table has one row per occurrence, and its row count equals the census count.**
    ⛔ **A shorter table fails this step.**
15. **`ADR-013:167`'s five coordinates each have their own row and their own verdict**, and the
    worklog states in writing whether the bullet is a live pointer or a dated worklist, **with its
    reason** (OD4). ⛔ **One verdict for the whole sentence fails this step.**
16. **`ADR-009:131` was NOT altered** — the worklog shows it still lands on the `- Evidence:` line.
    ⭐ This is the *"don't repair what works"* check.
17. **Every repaired site carries a quoted fragment or a heading**, not a bare `path:NNN`:
    `git diff -U0 | grep '^+' | grep -E '[a-z0-9-]+\.md:[0-9]+'` — every hit must sit beside a quoted
    fragment or heading in the same added line.
18. **No ADR's `- **Status:**` line changed:** `git diff -U0 | grep -E '^[-+].*\*\*Status:\*\*'` is
    empty. **No `## Status` line changed anywhere** either.
19. **If any append-only note was used**, its file shows `N  0` on `git diff --numstat` and the form's
    exact deletion filter returns empty. ⚠️ **Against a before-edit snapshot as well.**
20. **`sprints/done/sprint-2.md` is unchanged**, and its four sites are **named in the worklog** with
    the frozen-record reasoning restated.
21. **`ai-agents/wiki-vault/` is unchanged**, and its site count and paths are reported for routing.
22. **`ADR-008:85` is classed *correct* and left alone** (X5), and the worklog says so — ⛔ it must not
    be repaired by either group.
23. **The dashboard render behaves as E7 requires** — byte-identical to a before-edit capture unless a
    board row was itself a repaired site, in which case the difference is **only** that row's
    coordinate.

**Suite**

24. **`npm test` green; state the measured pass/fail counts.** `bash test/prove-red.sh` green.
    ⚠️ **State plainly that no existing test reads a docs citation** — the suite passing proves
    nothing about this change. ⛔ **Do not imply coverage.**
25. **`node --test test/reference-integrity.test.js` reports 0 broken links**, and
    `node --test test/coordination-citation-policy.test.js` is green. ⛔ **Do not add a `NAMED_EXEMPT`
    entry to make anything pass.**

## Notes

- **Depends on:** [`0392`](../0392-architecture-md-prose-repair-9-1-inventory-9-1-occurrence-b-and-9-5-residuals/brief.md) — **hard.** ⭐ **Not a preference.** This row's deliverable is line arithmetic over a file `0392` rewrites (X1), and it cannot derive a shift map until `0392`'s **OD2** rules on whether §9.5 survives (X4).
- **Blocks:** nothing.

- ⭐ **Provenance map — where each cancelled original's scope landed. ⛔ Nothing was dropped.**

  | Original | Its scope | Landed as | Owner it carried |
  |---|---|---|---|
  | `0286` | whole-file citation sweep | **this row, Group D** (its A1–A4, B5–B7) · **D0** (new: re-establish half A) · **OD3** (its C8) | `fkit-coder` |
  | `0323` | repo-wide `ADR-NNN:LINE` sweep | **this row, Group E** (items 1–7) · **OD4**, **OD5** | `fkit-architect` |
  | `0251` | §9.1 test-suite inventory (⚠️ **§9.1, not §9**) | ➡️ **`0392`, Group A** · **OD1** | `fkit-coder` |
  | `0376` | §9.1 occurrence B — four falsified CI clauses | ➡️ **`0392`, Group B** · **B6** discharged by construction | `fkit-coder` |
  | `0366` | §9.5 residual-drift bullets | ➡️ **`0392`, Group C** · **OD2** | `fkit-architect` |

- ⛔ **The five originals stay CANCELLED.** `0251`, `0376`, `0366`, `0286` and `0323` are frozen
  records cited here as provenance. ⛔ **Neither this row nor `0392` resurrects, reopens or edits any
  of them.**

- ⚠️ **`0392`'s two carried-forward flags are recorded on `0392`, not here** — `0366`'s own correction
  being half wrong about the init script's role count, and `0366`'s Backlog board row having seven
  cells instead of six from a stray unescaped pipe (⛔ **left alone**; the escape is
  [`0322`](../0322-escape-the-stray-pipes-in-the-board-rows-and-guard-against-new-ones/brief.md)'s
  scope). ⚠️ **The pipe matters to this row too:** a board row with an extra cell is the kind of thing
  a mechanical sweep trips over. ⛔ **Do not repair it here either.**

- ⚠️ **Placement: Backlog board, UNRANKED, APPENDED LAST.** ⛔ **The split renumbered nothing and
  re-ranked nothing**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  `0392` keeps its id and board position; this row was appended.
  ⭐ **On merit** it sits with the other citation-rot rows and **below `0392`**, which it depends on.
  ⛔ **It is not ranked there** — the merit position is recorded so the owner can act on it in one edit.

- ⚠️ **The id `0393` was verified free when this row was filed, both ways** — the maximum id across all
  task folders under `ai-agents/tasks/` was `0392`, and the maximum id referenced on every board under
  `ai-agents/sprints/` (including `done/`) was `0392`. **The two agree.**

- ⚠️ **Cite tasks by folder ID, never by board rank** —
  [`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md).

- ⚠️ **Every coordinate in this brief is a dated anchor and the durable anchor is the quoted text.**
  ⛔ **Re-measure every one.** This brief is about stale coordinates; its own will rot the moment
  anything edits the files it names — and `0392` is scheduled to do exactly that before this row runs.
