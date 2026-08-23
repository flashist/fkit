# Re-sweep the `ADR-NNN:LINE` citation class case-insensitively, and repair `ADR-013`'s drifted naked pointers

## ID
0323

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### Authority

**Owner ruling 2026-08-22**, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned producer — **verbatim option label:
"File it — re-sweep case-insensitively (Recommended)"**.

The question it answered, verbatim:

> *"`ADR-013:167` carries a live, broken, naked `ADR-010:130` pointer — verified: it drifted onto
> unrelated text, and 0171's lowercase-only sweep could never see it. It's exactly the class 0171
> Deliverable B was owner-ruled to repair, escaping only through a case-sensitive pattern. Also
> found: `sprints/done/sprint-2.md:187` cites `ADR-010:26` (a closed sprint board — arguably a frozen
> record)."*

The chosen option's description, verbatim:

> *"The assessor's shape: repair ADR-013:167 by heading + fragment, but re-run the sweep
> case-insensitively across ai-agents/ and claude/ rather than fixing the one instance found — a
> pattern that missed one may have missed others. Owner fkit-architect (matches 0195/0196/0197),
> brief by fkit-producer. Decide sprint-2.md:187 separately in the brief."*

### ⭐ The sentence this task exists to prove — and it is the convention page's own

[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)
says it itself:

> *"A citation form is only as good as the pattern that finds violations of it."*

**This task is an instance of that sentence.** `0171` wrote the convention and swept for violations
with a **case-sensitive** pattern. The convention was right; the pattern was not. **Everything below
escaped through the pattern, not through the rule.**

### ⚠️⚠️ THE RULING'S PREMISE IS TRUE BUT SUBSTANTIALLY UNDERSTATED — RE-VERIFIED 2026-08-22

⚠️ **Dated observation** at `HEAD` = `6f3d9f3` against a **dirty working tree** with other workers'
uncommitted edits and a live `fkit-wiki` worker writing `ai-agents/wiki-vault/`. ⛔ **Re-derive every
figure below; do not quote this brief as evidence.**

**Reproducing the ruling's finding — both patterns, verbatim:**

```
grep -rno  'adr-010:[0-9,-]*' ai-agents/knowledge-base/decisions/   → 0 hits    (0171's pattern)
grep -rnoi 'adr-010:[0-9,-]*' ai-agents/knowledge-base/decisions/   → 2 hits
```
✅ **Confirmed.** The case-sensitive pattern is blind to the site.

**Three corrections to the premise, each material and none to be dropped:**

**(1) ⛔ The pattern used in the question is itself defective.** `[0-9,-]*` — a `*` quantifier —
matches **zero** digits, so it also matched `adr-010-…md:1`, which is the ADR's own `ADR-010:` title
line, not a citation at all. ⚠️ **The correct class pattern requires at least one digit:**
`adr-[0-9]{3}:[0-9]+(,[0-9-]+)*`. **A sweep run with the loose pattern will report false positives on
every ADR title in the corpus.**

**(2) ⛔⛔ `ADR-013:167` carries THREE naked pointers, not one — and the sweep found only the one it
was looking for.** The line, verbatim, under `## Consequences`:

> *"- **Inbound links must be repaired**, notably **ADR-007:29,123**, **ADR-009:22,131** and
> **ADR-010:130**, which cite the six as evidence."*

**Where each lands today, checked firsthand 2026-08-22:**

| Coordinate | The line it lands on today | Verdict |
|---|---|---|
| `ADR-007:29` | *"point, not a one-off fluke, and warranted revisiting the mechanism (not ADR-005's underlying decision,"* | ⛔ **drifted onto unrelated prose** |
| `ADR-007:123` | *"divergence) — fix the check, don't revert the mechanism over it."* | ⛔ **drifted onto unrelated prose** |
| `ADR-009:22` | `([2026-07-11-doc-drift-audit.md](../reports/…)) found the Omnigent-side` | ⚠️ **near, but a continuation line** — triage needed |
| `ADR-009:131` | `- Evidence: [2026-07-11-doc-drift-audit.md](../reports/…).` | ✅ **still lands on the Evidence line** |
| `ADR-010:130` | *"2. **Role separation is enforced structurally, not by instruction**, via both the `--agent` tool"* | ⛔ **drifted onto unrelated prose** — the site the ruling named |

⭐ **So the ruling's single site is one of at least three drifted coordinates in one sentence, and one
of the five has NOT drifted.** ⛔ **A run that repairs the named one and leaves the sentence is a
partial fix.** ⚠️ **And a run that "repairs" `ADR-009:131` has broken something that works** — triage
every coordinate individually.

**(3) ⚠️⚠️ CALLING THE SITE A "LIVE POINTER" IS A JUDGEMENT THE TEXT DOES NOT CLEARLY SUPPORT, AND
THIS TASK MUST NOT PRE-DECIDE IT.**

Read the sentence in full. It is a `## Consequences` bullet **naming coordinates in OTHER files that
needed repairing** — a **worklist**, dated to the ADR's writing — and its own continuation says the
work partly happened: *"The two conventions' inbound links have been repaired already, with one class
of exception (below)."* `ADR-013`'s `- **Status:** accepted`.

So the site sits **exactly on the boundary** this project has been litigating all week:

- **If it is a live pointer** → `durable-citation-anchors.md` rules: *"A coordinate already known to
  be wrong is repaired, not annotated."*
- **If it is a dated worklist entry** → the governing rule is *a historical record's claims are
  frozen; its links are not*, and it takes an **appended dated ⚠️ note**, not a rewrite.

⛔ **This brief does NOT decide which.** ⚠️ **The implementer must triage it explicitly, in writing,
with its reason** — and the answer may differ per coordinate. ⛔ **A run that silently picks one
treatment and applies it has skipped the actual work.**

### ⭐ THE REAL SIZE OF THE CLASS — this is why the ruling said "re-sweep", not "fix it"

Measured 2026-08-22 with the corrected pattern, across `ai-agents/` and `claude/`,
**excluding `ai-agents/wiki-vault/`**:

| Measure | Count |
|---|---|
| `adr-NNN:LINE` occurrences, **case-insensitive** | **351** |
| …**lowercase** (what `0171`'s pattern could see) | **285** |
| …⛔ **UPPERCASE — INVISIBLE TO `0171`'s SWEEP** | **66**, across **27 files** |

⛔ **The ruling described one escapee. There are 66.**

**Where the 66 sit, by area:**

| Area | Files | Note |
|---|---|---|
| `ai-agents/tasks/done/` | 19 | closed task records — **frozen-record question applies** |
| `ai-agents/knowledge-base/decisions/` | 2 | `adr-013` (3 sites), `adr-022` (3 sites: `ADR-008:52`, `ADR-008:85` ×2) |
| `ai-agents/knowledge-base/architecture.md` | 1 | 1 site: `ADR-008:85` |
| `ai-agents/sprints/backlog.md` | 1 | 5 sites |
| `ai-agents/sprints/sprint-6.md` | 1 | 3 sites |
| `ai-agents/sprints/done/sprint-2.md` | 1 | **4 sites**, not 1 — see below |
| `ai-agents/sprints/reviews/` | 1 | 1 site |
| `ai-agents/tasks/backlog/` | 1 | `0281`, 4 sites |
| ✅ **`claude/`** | **0** | ⭐ **a positively measured ZERO — state it as a result, not as silence** |

⚠️ **`ai-agents/wiki-vault/` carries 4 uppercase occurrences.** ⛔ **They are NOT repaired here.**
Route them to `fkit-wiki`
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

⛔⛔ **THE 66 ARE NOT ALL DEFECTS, AND THE TRIAGE IS THE REAL WORK.** A coordinate that still lands on
the line it meant is **correct** and ⛔ **must not be "repaired"**. `ADR-009:131` above is a live proof
that correct ones exist inside this class.

### ⚠️ `sprints/done/sprint-2.md` — the ruling named ONE site; there are FOUR

Checked firsthand 2026-08-22: lines `144` (`ADR-028:154`), `145` (`ADR-028:154`), `146`
(`ADR-028:165`) and `187` (`ADR-010:26`).

⭐ **All four sit inside CLOSED board rows** — rows whose Status reads `✅ Done`. Read in context,
`:187`'s row is the record of a **closed task**: *"Append a dated correction note to ADR-010 for the
menu reorder … ADR-010:26's 'menu option 7' + 'team room' …"*. The coordinate is **what that task
worked on**, recorded at the time. `:145`'s is a provenance citation (*"split from 82 per
ADR-028:154"*).

**This is decided explicitly, as the ruling required — and the decision is: OUT OF SCOPE for repair,
IN SCOPE for the sweep's census.**

**The reason, not an assertion:** the governing rule applied elsewhere in this project is *a
historical record's claims are frozen; its links are not*. These coordinates are **neither**. They are
**claims about what a closed task did** — *"the coordinate this task corrected was ADR-010:26"*.
Rewriting one would make a closed row's record of its own work say something the work did not say.
⛔ **Do not repair them.** ✅ **Do count them, name them, and record this reasoning in the worklog** —
a census that silently omits them is not a census.

⚠️ **The same reasoning likely applies to the 19 files under `ai-agents/tasks/done/`, but this brief
does NOT extend the ruling to them.** ⛔ **Triage them individually and, where the frozen-record call
is genuinely contested, name it as a residual and return it to the owner rather than deciding it.**

## What to build

**A recommendation-and-repair task. The census and the triage come first; the repair follows from
them.**

1. **Re-run the sweep with the corrected pattern.** Case-insensitive, digits required:
   `adr-[0-9]{3}:[0-9]+(,[0-9-]+)*`, across `ai-agents/` and `claude/`, ⛔ **excluding
   `ai-agents/wiki-vault/`**. Record the command and its raw output.
   - ⛔ **Do not carry this brief's `351 / 285 / 66 / 27` forward unverified.** State your own numbers,
     and **say this brief was wrong** if they differ.
   - ✅ **Report `claude/`'s count positively, including if it is `0`.** ⛔ Absence claims are the
     expensive ones — a stated zero with its command beats silence.
   - ⚠️ **Also report the loose-pattern false-positive count** (`[0-9,-]*` vs `[0-9]+`) so the next
     reader knows why the pattern matters.

2. **Triage EVERY occurrence into one of three classes, one worklog row per occurrence.**
   - **Correct** — the coordinate still lands on the line it meant. ⛔ **Leave it. Do not "repair" it.**
   - **Drifted, live** — a pointer a reader is meant to follow now. → **repair** it.
   - **Drifted, frozen** — a dated record of what something once was or what a closed task did.
     → **annotate or leave**, per the decision in step 3.

   ⛔ **A site with no worklog row is an unfinished triage, not an implicit "leave it."** ⛔ **Resolve
   each site's intended referent by READING ITS CONTEXT — never by arithmetic, never by pattern.**

3. **Repair the live-drifted sites to heading + quoted fragment**, per
   [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md).
   ⛔ **A bare `path:NNN` replacement is not a repair** — the page's rider is *"Pair every `path:NNN`
   with a quoted fragment or the heading it sits under"*, and **the fragment does the locating** while
   the heading only gives a region.

4. **`ADR-013:167` specifically — triage its FIVE coordinates individually and say so.**
   - ⛔ **Do not apply one treatment to the sentence.** At least three have drifted, at least one has
     not.
   - ⚠️ **Decide, in writing and with a reason, whether the bullet is a live pointer or a dated
     worklist** (see the ⚠️⚠️ block above). ⛔ **The brief deliberately does not pre-decide it.** If
     the call is genuinely contested, **return it to the owner as a residual rather than settling it.**
   - ⛔ **`ADR-013`'s `- **Status:** accepted` does NOT change.** A drifted fact never makes an ADR
     `superseded`.
   - If the treatment is an appended note, ⚠️ **use `0198`'s form** —
     `claude/skills/fkit-record-decision/SKILL.md`, `## Correcting an accepted ADR — the dated
     correction note` — ⚠️ **marker only, ⛔ never ⛔**, original left **byte-identical**, proved by
     `git diff --numstat` reading `N  0` plus the form's exact deletion-filter grep.
     ⛔ **Consume the form; do not edit the skill.**

5. **Record the finding as an instance of the convention's own sentence.** The worklog must state, in
   its own words, that the class survived because the **pattern** was case-sensitive, not because the
   **rule** was wrong — quoting *"A citation form is only as good as the pattern that finds violations
   of it."* ⚠️ **Whether the convention page should gain a rider about case-insensitive sweeping is a
   question for the owner — raise it, ⛔ do not write it.**

6. **Route, do not write, the vault sites.** Report `ai-agents/wiki-vault/`'s count and paths to the
   producer for routing to `fkit-wiki`. ⛔ **No write to the vault, ever**
   ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

7. **Prove nothing else moved.** `bash claude/skills/fkit-status/dashboard.sh
   ai-agents/sprints/backlog.md` and `… ai-agents/sprints/sprint-6.md` against **before-edit
   captures**. ⚠️ **A pass is not "exit 0"; it is "byte-identical to the before capture"** unless a
   board row was itself a repaired site, in which case the difference must be **only** that row's
   coordinate.

### ⛔ Out of scope

- ⛔ **`ai-agents/wiki-vault/`** — `fkit-wiki`'s exclusively. Route, never write.
- ⛔ **The four `sprints/done/sprint-2.md` sites, for REPAIR.** Decided above: counted and named, not
  rewritten.
- ⛔ **Any `## Status` value, any ADR's `- **Status:**` line, any task status, any rank, any row order
  or row count on any board**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ **No task file moved, renamed or reopened** — movers are producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- ⛔ **`claude/skills/`, `dashboard.sh`, and every agent file.** This task **consumes** the
  correction-note form and the convention page; it changes neither. ⚠️ If the sweep finds a site under
  `claude/`, repairing that **comment text** is in scope; ⛔ **changing any behaviour is not.**
- ⛔ **Writing a new convention, rider, guard, check or tooling change.** This task is a census, a
  triage and a set of repairs. ⚠️ **Whether the convention page needs a case-insensitivity rider, and
  whether a guard should exist, are questions for the owner** — raise them, do not build them.
- ⛔ **Widening into the non-`ADR-NNN:LINE` citation classes** — the hyphenated `task NN` class is
  [`0309`](../0309-repair-the-hyphenated-task-nn-citation-class-in-four-open-briefs/brief.md)'s and
  [`0308`](../0308-triage-and-repair-claudes-surviving-stale-task-numeral-seeds/brief.md)'s.
- ⛔ **No commit, no push.** No secrets in any artifact.

## Verification steps

1. **The census is reproduced firsthand**, with the corrected `[0-9]+` pattern, and the worklog states
   its own totals for case-insensitive / lowercase / uppercase and file count — ⛔ **not this brief's**
   — plus a ✅ **positively stated count for `claude/`, including a zero.**
2. **The worklog's triage table has one row per occurrence**, and its **row count equals the census
   count**. ⛔ **A shorter table fails this step.** Each row carries the coordinate, the line it lands
   on today, and its class (correct / drifted-live / drifted-frozen) with a reason.
3. **`ADR-013:167`'s five coordinates each have their own row and their own verdict**, and the worklog
   states in writing whether the bullet was judged a live pointer or a dated worklist, **with its
   reason**. ⛔ One verdict for the whole sentence fails this step.
4. **`ADR-009:131` was NOT altered** — the worklog shows it still lands on the `- Evidence:` line, and
   the diff does not touch it. ⭐ This is the "don't repair what works" check.
5. **Every repaired site carries a quoted fragment or a heading**, not a bare `path:NNN`:
   `git diff -U0 | grep '^+' | grep -E '[a-z0-9-]+\.md:[0-9]+'` — every hit must sit beside a quoted
   fragment or heading in the same added line.
6. **No ADR's `- **Status:**` line changed:** `git diff -U0 | grep -E '^[-+].*\*\*Status:\*\*'` is
   empty. **No `## Status` line changed anywhere** either.
7. **If any append-only note was used**, its file shows `N  0` on `git diff --numstat` and the form's
   exact deletion filter returns empty. ⚠️ **Against a before-edit snapshot as well**, since other
   workers hold uncommitted edits.
8. **`sprints/done/sprint-2.md` is unchanged by this run**, and its four sites are **named in the
   worklog** with the frozen-record reasoning restated.
9. **`ai-agents/wiki-vault/` is unchanged**, and its site count and paths are reported for routing to
   `fkit-wiki`.
10. **Both dashboard renders behave as `## What to build` step 7 requires.**
11. **`git status --porcelain` lists only this run's paths.** ⚠️ Other workers' pre-existing dirty
    paths must be **listed and excluded by name**, not waved at.

## Notes

- **Depends on:** nothing.

- ⛔⛔ **`0196` AND `0197` DO NOT GATE THIS TASK, AND THIS TASK DOES NOT GATE THEM. Stated explicitly so
  nobody invents a dependency.**
  [`0196`](../0196-correct-adr-010s-skilloverrides-claims-retired-by-adr-018/brief.md)
  and [`0197`](../0197-resolve-adr-010s-remaining-stale-code-line-ranges/brief.md) (both `🔲 Backlog`,
  verified 2026-08-22) are **hard append-only (`+N / −0`)** and were measured this session to pose
  **no** text-change risk to any existing anchor — an append cannot move a line above it. ⚠️ **They may
  run in any order relative to this task, or concurrently.**
- ⚠️ **Relates to
  [`0171`](../../done/0171-write-the-durable-citation-anchors-convention-page/brief.md)** (closed
  2026-08-22), whose Deliverable B sweep is the one that missed this class. ⛔ **This task does not
  reopen, amend or re-close `0171`.** It is the follow-on the miss earned.
- ⚠️ **Relates to
  [`0176`](../0176-build-the-coordination-citation-policy-guard/brief.md)** — the coordination-citation
  guard. ⭐ **Whether that guard's pattern is case-insensitive is worth checking and reporting**, since
  the same blind spot would live there. ⛔ **Do not edit `0176`'s brief or build its guard here** —
  report the finding.
- ⚠️ **Relates to, without ordering:**
  [`0309`](../0309-repair-the-hyphenated-task-nn-citation-class-in-four-open-briefs/brief.md),
  [`0308`](../0308-triage-and-repair-claudes-surviving-stale-task-numeral-seeds/brief.md),
  [`0320`](../0320-repair-the-four-stale-0171-claims-that-fall-outside-0309s-scope/brief.md) and
  [`0321`](../0321-repair-the-two-stale-0171-claims-on-the-live-backlog-board/brief.md) — all
  `0171`-descended repairs on **different citation classes**. ⛔ **No shared file is guaranteed; both
  this task and `0321` may touch `ai-agents/sprints/backlog.md`, so re-measure rather than trusting a
  captured line number.**
- ⚠️ **`## Owner` is `fkit-architect`, and that is a scope fact, not a preference.** The write surface
  is accepted ADRs and the knowledge base — the architect's ground — and the shape matches
  [`0195`](../../done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/brief.md),
  `0196` and `0197`, all append/pointer corrections on an `accepted` ADR. ⚠️ **This task writes no
  source.**
- ⚠️ **This brief decays.** Every figure, coordinate, fragment and landing line above was measured
  **2026-08-22** at `HEAD` = `6f3d9f3` against a **dirty tree** with other workers' uncommitted edits
  and a live `fkit-wiki` worker. ⛔ **Re-measure at implementation time; do not quote this brief as
  evidence.**
- Filed 2026-08-22 by a spawned `fkit-producer` with no owner channel
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  on the owner's ruling of the same day recorded under `### Authority`. Filed **UNRANKED** to the
  Backlog board; this row **appends** and renumbers nothing
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  **No commit was made.**
