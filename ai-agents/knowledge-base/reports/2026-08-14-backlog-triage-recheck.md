# Backlog triage — targeted re-check of every ABSENCE claim

**Read-only re-verification, 2026-08-14.** Spawned by `/fkit-sprint-ship-loop` from a live `fkit lead`
session under the owner ruling — verbatim option label: ***"Targeted re-check of grep-evidenced
verdicts (Recommended)"***.

⛔ **This report SUPERSEDES BY ADDITION. The five triage reports were not edited** — they are the record
Sprint 6 rests on, and they stay byte-identical. Where a verdict below changes, **this file is the
correction**, not an edit to the original.

⛔ **No verdict was changed on any board. No brief was re-scoped. No task moved, nothing re-ranked, no
commit.** The owner rules; this reports.

---

## Why this pass exists — a confirmed, measured false negative

Triage part 1 judged `0154` `STALE-PREMISE` because the clause *"do not spawn the producer"* was
reported **gone** from the three wiki skills. **It is not gone.** The phrase **wraps across a line break
with an indented continuation**, so a single-line `grep` cannot see it:

```
claude/skills/fkit-wiki-ingest/SKILL.md:90-91
   **Then stop.** Do not invoke a mover, do not edit the brief, do not touch the sprint plan, and do not
   spawn the producer to close it yourself. Routing the close is the **caller's** next move, not yours:
```

Acting on that verdict would have rescoped `0154` to delete **a live rule from three files that ship
into every consuming project.**

---

## Method, and what it can and cannot see

Two failure modes were in scope, not one.

**1. Wrapped phrases.** Every claim was matched three ways against each file:

| matcher | transform | catches |
|---|---|---|
| `naive` | `grep -o -F` on the raw file | baseline — reproduces what the original triage saw |
| `norm` | `tr '\n\t' '  ' \| tr -s ' '` then `grep -o -F` | a phrase broken by a line break **plus** a continuation line's leading indent or tabs |
| `loose` | `norm`, then strip `*` `` ` `` `_`, then lowercase | the above **plus** markdown emphasis, code spans and case drift interrupting the phrase |

⚠️ **A bare `tr '\n' ' '` is not enough** and the driver's own normalised check missed the `0154` case in
two of three files with it — the continuation line is indented, so the join produces multiple spaces.
`tr -s ' '` (squeeze) is the part that matters. The harness above was **calibrated on the known false
negative first**: it returns `naive=0 norm=1 loose=1` on all three wiki skills, reproducing the driver's
measurement exactly before any new claim was judged.

**2. `grep -c` counts LINES, not occurrences.** Every count-bearing claim was re-derived with
`grep -o … | wc -l`. One claim (`0219`) rested on *"the file's only occurrence"* and was re-measured
this way; it holds at exactly 1.

### Scope — the vulnerable direction only

⭐ **Only verdicts whose evidence is an ABSENCE claim were re-checked** — *"returns 0"*, *"zero hits"*,
*"appears nowhere"*, *"no longer exists"*, *"that clause was removed"*, *"nothing matches"*.

⛔ **Presence claims were NOT re-checked.** A grep that found text cannot fail this way. That is the
"re-check all 108" option the owner **declined**.

⚠️ **Absence claims about FILES and PATHS were NOT re-checked** — *"`0160` is in `done/`"*, *"the page
does not exist"*, *"`test/skill-ownership-sites.mjs` is absent"*. Line-wrapping cannot hide a filename
from `ls`. Claims about **content within** a file were re-checked regardless of how they were phrased.

---

## ⭐ Verdicts that CHANGE

**One, and it is not in Sprint 6.**

| id | in Sprint 6? | original verdict | the absence claim | wrap-tolerant result | verdict |
|---|---|---|---|---|---|
| **`0154`** | ⛔ **NO** — not among the ranked 18 | `STALE-PREMISE` (part 1) | *"`grep -c "do not spawn the producer"` across all three wiki SKILLs returns **0** — 0173 rewrote the block"* | ⛔ **FALSE.** `naive=0 norm=1 loose=1` in **all three** files — `fkit-wiki-ingest`, `fkit-wiki-lint`, `fkit-wiki-sync`. The clause is **live**, wrapped across a line break. | ⭐ **CHANGES — the stale-premise finding does not hold on this evidence** |

### What actually changes for `0154`, stated narrowly

⛔ **Only the string-absence half of the verdict falls.** Part 1 gave `0154` **two** independent reasons,
and they must be separated:

1. ⛔ **"The five strings it would pin have moved / `grep` returns 0."** — **DISPROVEN.** At least the
   named clause is present in all three files.
2. ✅ **"Under ADR-033, pinning *'do not spawn the producer'* would pin the WRONG rule"** — **UNAFFECTED
   and NOT re-checked.** That is a reasoning claim about ADR-033, not a grep result. It stands on its
   own and is the owner's to weigh.

⚠️ **This does not make `0154` a clean `KEEP`.** It makes the **owner fork at synthesis §8.4 —
*"`0154` — rescope or drop?"* — rest on a different and much narrower basis than the record states.**
The synthesis §6 table's entry for `0154` (*"The five strings it would pin have moved"*) is the sentence
that is now wrong.

⛔ **The concrete danger this pass removed:** part 1's instruction to *"re-derive the assertion list
against the post-0173 block"* would, followed literally against a naive grep, have led a run to conclude
the clause is absent and **delete or rewrite a live rule in three shipping files**.

### ⭐ Sprint 6 is NOT scoped on a false premise

**All 18 ranked rows were checked first, and every absence claim among them holds.** Nothing in
`0306 0171 0218 0177 0178 0198 0280 0302 0250 0046 0223 0204 0168 0188 0229 0300 0270 0272` changed.
The sprint can run on its stated premises.

---

## The full re-check — 41 absence claims, per row

**Legend:** `n/o/l` = naive / wrap-normalised / loose occurrence counts. ⭐ = row is in Sprint 6.

### Part 1 — 16 absence claims

| id | ⭐ | the absence claim | wrap-tolerant result | verdict |
|---|---|---|---|---|
| `0013` | | no worked-example section; *"only four headings"* | `grep -c '^## '` = **4**, and they are the four named (`The rule`, `Where this must be enforced`, `Related`, `Provenance`) | **unchanged** |
| `0037` | | *"`FKIT_INIT` appears nowhere in the repo"* | Repo-wide: hits **only** in `0037`'s own brief and the triage report. No source hit. | **unchanged** |
| `0046` | ⭐ | *"no `[ -L ]` test"* guarding `cat > "$dest/.fkit/interview"` | 12 `[ -L ]` occurrences in `fkit-claude-init.sh` (`:105,106,167,283,382,467,679,735,801,810,816`) — **none in the `:496-497` region**. Hazard live and ungated. | **unchanged** |
| `0121` | | `SkillOpt` / `observer-agent` return nothing | Hits only in the triage report itself. No design, ADR or skill. | **unchanged** |
| `0131` | | `dual-home`, `both copies`, `scaffold` → zero in `fkit-task-brief/SKILL.md` | `0/0/0` on all three patterns. ⚠️ *"both copies"* is a two-word phrase and was the highest wrap risk in this batch. | **unchanged** |
| `0144` | | `team` → zero in `test/launcher-contract.test.js` | `0/0/0` | **unchanged** |
| `0145` | | no pty infrastructure in `test/` | Every hit is inside `test/fixtures/closed-rank-0174-{before,after}.md` — copies of board rows, not infrastructure. | **unchanged** |
| `0152` | | no `SKILL.md` H1 in `claude/skills/` uses the owner banner as its title | Walked all 26 H1s. Zero. | **unchanged** |
| **`0154`** | | *"`grep -c "do not spawn the producer"` → 0 in all three"* | ⛔ **`0/1/1` in all three — PRESENT** | ⭐ **CHANGES** |
| `0155` | | `## Priority` absent from `0122`,`0123`,`0124`,`0125`,`0126`,`0136` | `0/0` on all six. ⚠️ All six now sit in `done/`, not `backlog/` — matches the record. | **unchanged** |
| `0156` | | `missing-priority` → nothing in `claude/ bin/ test/*.js` | Hits only in `test/fixtures/closed-rank-0174-*.md` (board-row copies), exactly as recorded. | **unchanged** |
| `0163` | | *"not carried verbatim"* → nothing in `fkit-coder.md` + ship-loop `SKILL.md` | `0/0/0` in both. ⚠️ Three-word phrase, real wrap risk — clear. | **unchanged** |
| `0164` | | Build-worker bullet carries no logging duty; *"still no per-decision content requirement"* | Read-verified, not grep-decidable. `fkit-coder.md` Build bullet is *"implement only that approved plan… never widen scope"* — no logging. Ship-loop Build row asks *"write source + `worklog.md`"* but enumerates no per-decision content, unlike the Process-review row. | **unchanged** |
| `0165` | | nothing checks the flag's **emitted** form | Flag line present in all three wiki skills (2 occurrences each); **zero** hits for it across `test/*.js` `test/*.mjs`. | **unchanged** |
| `0169` | | `ADR-034` → nothing under `claude/` | `0` across every SKILL, agent, `.sh` and `.md` under `claude/`. | **unchanged** |
| `0170` | | ADR-032 carries no `- **Corrections:**` bullet | `Corrections:` `0/0/0`; `Amended by:` `1/1/1` — reproduces part 1's note exactly. | **unchanged** |

### Part 2 — 10 absence claims

| id | ⭐ | the absence claim | wrap-tolerant result | verdict |
|---|---|---|---|---|
| `0178` | ⭐ | *"`grep "On merit" priority-is-rank-not-identity.md` → zero hits"* | `0/0/0`, and `0` case-insensitively. ⚠️ Two-word phrase in a Sprint 6 **foundation** row — checked first. | **unchanged** |
| `0183` | | neither record carries a correction note | `sprint-2.md:3311-3312` still carries *"no closed row was renumbered by the insertion"* with no note beneath; `0174`'s brief repeats it at `:175-176`. | **unchanged** |
| `0184` | | `advisory` / `binding` → zero in `dependency-declaration-form.md` | `0/0/0` in **both** homes (`ai-agents/` and `claude/scaffold/`). | **unchanged** |
| `0186` | | `audience-adapted` → zero in ADR-027 | `0/0/0`, and `0` hyphen-agnostically (*"audience adapted"*). | **unchanged** |
| `0188` D1 | ⭐ | scaffold `CLAUDE.md` — `grep "task-brief"` → zero; producer row omits it | `0/0/0` for the literal. ⚠️ A loose hyphen-agnostic probe returns 1, but it matches the **prose** *"task briefs"* on `:23`, not `/fkit-task-brief`. Producer row confirmed to list only `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal`. | **unchanged** |
| `0198` | ⭐ | `amend` → 0 and `correction note` → 0 in `fkit-record-decision/SKILL.md` | `0/0/0` for both, plus `0` for `dated correction` loose. The skill has no notion of amending an ADR. | **unchanged** |
| `0201` | | neither `0143`'s nor `0158`'s ledger carries a dated correction note | `Dated correction` = 0, `CORRECTION` = 0 in both. ⚠️ A lowercased probe returns 19 hits in `0143`'s ledger — **all of them discuss the ADR-010 correction note that is `0143`'s subject**; none is a correction note **in** the ledger. `Status: in-review` confirmed live at `0158/review.md:5`. | **unchanged** |
| `0204` | ⭐ | carry-check hook absent from `claude/*.sh`; no `hooks` key in settings | `carry-check` = **0** in all seven `claude/*.sh`. `.claude/settings.json` does not exist; `.claude/settings.local.json` has **no `"hooks"` key**. ⚠️ `PreToolUse` does appear in five of those files — those are the **existing** hooks, not `0204`'s. | **unchanged** |
| `0209` | | no *"out of scope by owner ruling"* value in either ledger schema | `out of scope` = `0/0/0` in **both** `fkit-stateful-review` and `fkit-process-stateful-review`. ⚠️ Longest phrase re-checked in this pass; highest wrap risk. Clear. | **unchanged** |
| `0213` | | no **read** step for `log.md` in `fkit-wiki-lint` | Read-verified. All four `log.md` mentions are a **write** (`:52`), an explicit **non**-input (`:66`), or crying-wolf rationale (`:204`, `:208`). No read step. | **unchanged** |

### Part 3 — 11 absence claims

| id | ⭐ | the absence claim | wrap-tolerant result | verdict |
|---|---|---|---|---|
| `0214` | | no `0210/D` and no `0210/G` mutation in `prove-red.sh` | `0210/A` = **5**, `0210/D` = **0**, `0210/G` = **0**, all matchers. | **unchanged** |
| `0217` | | `skills_for_role()`'s `lead` arm has no `fkit-wiki-update` | Read directly: `lead` gets five skills, none of them `fkit-wiki-update`. | **unchanged** |
| `0219` | | *"the file's **only** occurrence of `400`"*, no assertion | ⚠️ **Count re-derived with `grep -o`, not `grep -c`.** Exactly **1** occurrence, at `:21`, inside a comment. No assertion. | **unchanged** |
| `0224` | | `deny()` makes no log append; no test asserts a worklog `**Role:**` line | Read-verified. `deny()` prints to stderr, emits the deny JSON, exits — no append. `grep -rl '\*\*Role:\*\*' test/` returns nothing. | **unchanged** |
| `0225` | | nothing in `test/*.js` / `test/*.mjs` reads the ship-loop `SKILL.md` path | **Holds exactly as scoped.** ⚠️ **Nuance, verdict unaffected:** a wider sweep of `test/` finds `test/prove-red.sh:544` building that path (`m9_file="$m9_tree/skills/fkit-sprint-ship-loop/SKILL.md"`) — a **shell** mutation harness, outside the claim's stated `*.js`/`*.mjs` scope, and it mutates the file rather than parsing its step-2 table. | **unchanged** |
| `0227` | | no step re-derives a hash **over the pasted block** | Read-verified. `:190` cites `git hash-object <path>` — the **file**. `:198` and `:208` state outright *"self-computed and self-reported; nothing checks it until `0204`'s hook lands."* Provenance + presence, never fidelity. | **unchanged** |
| `0228` | | no `## Resume doctrine` heading in the ship-loop skill | `0/0/0`. `grep '^## '` returns eight headings: Overview · plan-gate honesty · Durable artifacts · The loop · Stop conditions · Progress reporting · Hard rules · Usage. | **unchanged** |
| `0231` | | no step derives the sync figures from a diff | Read-verified. `:94` **asks for** *"N source files changed, M pages created, K pages updated"*; no step derives or classifies them. | **unchanged** |
| `0232` | | `DATED CORRECTION` → 0 in ADR-012 | `0/0/0`, and `0` for lowercased `correction` anywhere in the file. Zero corrections appended. | **unchanged** |
| `0235` | | nothing compares a brief against its **own prose** | Read-verified. `dashboard.sh`'s only prose handling is table-parsing (`:417-430`) and `Depends on:` anchoring (`:512-513`). No brief-vs-prose comparison. | **unchanged** |
| `0250` | ⭐ | producer row in scaffold `CLAUDE.md` has no `/fkit-task-brief` | Same measurement as `0188` D1 — confirmed absent. | **unchanged** |

### Part 4 — 4 absence claims

| id | ⭐ | the absence claim | wrap-tolerant result | verdict |
|---|---|---|---|---|
| `0270` | ⭐ | the ship-loop *"never reads a brief's `## Owner`"* | `## Owner` = `0/0/0` in `fkit-sprint-ship-loop/SKILL.md`. (70 occurrences of *"owner"* overall — all about the **human** owner or the `⛔ Owner:` banner, none reading a brief's field.) | **unchanged** |
| `0272` | ⭐ | `reasoning-only` → **zero** across the five named files | `0/0/0` in all five (`fkit-review`, `fkit-stateful-review`, `fkit-adversarial-review` SKILLs; `fkit-adversarial-reviewer.md`, `fkit-reviewer.md`), and `0` hyphen-agnostically. **ADR-042 D1 has not landed.** | **unchanged** |
| `0284` | | `_fkit_reinstall`'s `curl … \| sh` has **no `--max-time`** | ⚠️ **A file-wide count is misleading here and the original claim was correctly scoped.** `--max-time` = **3** in `fkit-claude.sh` — at `:69` (comment), `:86`, `:94`. The `_fkit_reinstall` curl at `:102` has **none**. Hazard live. | **unchanged** |
| `0300` | ⭐ | no HEAD-vs-branch guard beside the `:107-111` preflight | Read-verified. `:214` resolves `branch` as a push target only. The `rev-parse HEAD` at `:329` is inside a `console.log` advisory string, not a guard. | **unchanged** |

---

## Bonus — the one load-bearing COUNT in the synthesis, re-derived

The driver flagged `grep -c` as a second failure mode. The synthesis's §4 decay table feeds **`0306`,
Sprint 6's rank-1 row**, so its dead-path figure was re-derived with `grep -o`:

| synthesis §4 claim | re-derived with `grep -o` | result |
|---|---|---|
| Dead `ai-agents/sprints/sprint-N.md` path — *"17 briefs, 28 occurrences"* | `sprint-[1-5].md` literals across `ai-agents/tasks/backlog/`: **17 briefs, 28 occurrences** | ✅ **reproduces exactly** |

⚠️ **A looser pattern reads 19 briefs / 34 occurrences** — the extra hits are `sprint-N.md`
placeholder/glob forms in `0240`, `0278` and `0306`'s own brief, which are **not** dead literal paths.
The synthesis figure is the right one. **Zero references to `ai-agents/sprints/sprint-6.md` exist in any
open brief**, so opening Sprint 6 did not create new dead paths.

---

## ⚠️ Method limits — what this pass could still miss

⛔ **This is not a clean sweep and must not be reported as one.** The normalisation above is strong
against the failure mode that produced the `0154` false negative and weaker against others:

1. ⚠️ **A phrase split across markdown TABLE CELLS is not caught.** `norm` joins lines, but a `|`
   between two halves of a phrase survives every transform here. Several triaged claims target skills
   and ADRs whose content is heavily tabular — including the ship-loop's step-2 table (`0223`, `0225`,
   `0227`) and the review-ledger schemas (`0209`).
2. ⚠️ **Punctuation and wording drift is not caught.** A rule reworded to *"never spawn a producer"*
   would read as absent under every matcher here. Only the **exact phrase each report chose** was
   re-tested; a re-check cannot find a rule that survived in different words.
3. ⚠️ **Content inside code fences is treated as prose.** No matcher distinguishes a live rule from an
   example of one quoted in a fence. A phrase found could be illustrative rather than binding.
4. ⚠️ **Line-length-driven hyphenation was not modelled.** No case was observed, but a token broken as
   `task-\nbrief` would be missed by `norm` (the join leaves `task- brief`).
5. ⛔ **Seven claims are SEMANTIC, not grep-decidable** — *"no step does X"*, *"nothing compares Y"*:
   `0164`, `0165`, `0213`, `0224` (log-append half), `0227`, `0231`, `0235`. **These were verified by
   reading the relevant sections, not by a decisive match.** A reader who disagrees with the reading
   would reach a different verdict, and no grep settles it.
6. ⚠️ **`0223`'s *"no enumeration of what the method contains"* was NOT mechanically re-verified.**
   It is a judgement about **completeness**, not presence — and the row's own brief shows the step-2
   row already carried *some* method text on 2026-08-05, with an explicit include/exclude table at
   `brief.md:91-99`. The `KEEP` verdict is unaffected either way, but the triage's phrasing is looser
   than the brief's actual defect. ⭐ **`0223` is in Sprint 6** — flagged so the implementer reads the
   brief's table, not the triage's paraphrase.
7. ⚠️ **Presence claims were deliberately not re-checked** (the owner declined that scope), so any
   error in the *other* direction — a report claiming text is present when it is stale or has moved —
   is **outside this pass entirely** and remains unmeasured.
8. ⚠️ **File- and path-absence claims were exempted by instruction** and were not re-run, except where
   incidentally confirmed while checking a content claim (`0189`'s registry, `0190`/`0191` folder
   locations).

---

## Job 2 — the `0221` widening, recorded

**Owner ruling — verbatim option label: *"Widen to premise 3 (Recommended)"*.**

### ⭐ Premise 3 verified independently first, and it holds

⚠️ **Not taken on trust** — the finding came from the same triage that produced the `0154` false
negative, so it was re-measured from scratch with the wrap-tolerant harness:

| premise | measured 2026-08-14 |
|---|---|
| 1. `test/skill-ownership-sites.mjs` does not exist (`0189`) | ✅ **STILL TRUE** — `ls` → *No such file or directory*; `0189` in `ai-agents/tasks/backlog/` |
| 2. `0190`'s clause does not exist | ⛔ **FALSE** — clause present in `claude/scaffold/universal-rules.md` (`1/1/1`); `0190` in `done/` |
| 3. `0191`'s clause does not exist | ⛔ **FALSE — CONFIRMED** — the driver-side clause is in `claude/skills/fkit-sprint-ship-loop/SKILL.md` under `## Hard rules`, citing **ADR-037 §3 by name twice** (`:391`, `:400`) and recording *"This clause is weaker than its worker-side twin"* (`1/1/1`); `0191` in `ai-agents/tasks/done/` |

**The finding holds. The ruling was recorded.**

### What was written

**One file edited:**
`ai-agents/tasks/backlog/0221-repair-0194s-false-0190-clause-does-not-exist-premise/brief.md`.

A **second dated correction** appended below `## What to build` step 6, per the superseded-text
convention. ⛔ **Step 2 (*"Correct premise 2 only"*) was left byte-identical** — it was **not** rewritten
in place. The note records:

- the owner's ruling and its verbatim label, taking **branch (a)** of the fork the first correction raised;
- that step 2 now covers premises **2 and 3** in one pass;
- that the first correction's interim *"take the narrower branch (b)"* instruction is **spent**;
- the re-verified premise table above, flagged as a **dated reading** that step 1 must still re-derive;
- ADR-037 §3's clause **quoted verbatim**, so `0194`'s assessment has its subject in hand — located by
  wording, with the line coordinate marked mutable;
- ⛔ that premise 1 is **still true** and must not be touched, and that `0194` **remains blocked on
  `0189` alone** — *"two of three are now false"* is not *"`0194` is ready"*.

**Nothing else changed.** `0221`'s `## Status`, `## Priority`, `## Sprint` and `## Owner` are untouched;
`0194`'s brief was **not** edited (that is `0221`'s own deliverable); no board row, no re-rank, no mover.

---

## Provenance

Run 2026-08-14 by a **spawned `fkit-producer` with no owner channel**
([ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)), invoked from
`/fkit-sprint-ship-loop` in a live `fkit lead` session.

**Files written: this report, and the appended dated correction in `0221`'s brief.** No task file moved
([ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)), nothing re-ranked
([ADR-035](../decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
nothing written under `ai-agents/wiki-vault/`
([ADR-005](../decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)), nothing under
`claude/`, `test/` or `bin/` touched, no `git stash`, no commit.

**Board re-verified after the write:** `select-active` → `active file="sprint-6.md" identity="Sprint 6"`;
Sprint 6 `total 18` with ranks `P1`–`P18` intact; `count backlog 89`; anchored `^drift ` = 0; anchored
`⟨derive: UNPARSEABLE⟩` = 0.
