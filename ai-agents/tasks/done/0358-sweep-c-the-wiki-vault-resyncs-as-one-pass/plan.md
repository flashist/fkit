# Implementation plan — 0358, Sweep C: the wiki-vault pass, SIX members

**Task:** `0358` (`0358-sweep-c-the-wiki-vault-resyncs-as-one-pass`)
**Author:** fkit-wiki, spawned plan worker under `fkit-sprint-ship-loop` (no owner channel — ADR-021)
**Planned against:** HEAD `cf289c2`. ⚠️ The tree is large and mostly not mine — see §1.2 for the
named baseline and the exclusion list.
**Status:** planning only. ⛔ No file was written, edited or moved to produce this plan, and nothing
under `ai-agents/wiki-vault/` was touched.

---

## 0. Read this first — what this pass is, and what "verified" cannot mean here

⛔ **Neither guard covers this row's output, and the close report must say so in the same breath as
the word "verified."** Measured against the two guard files themselves, this turn:

- `test/reference-integrity.test.js` — its `exempt()` returns true for anything under
  `ai-agents/wiki-vault/`, and its arm **L5** asserts positively that **no vault file ever entered
  the scanned set**. The exemption's stated reason: ADR-005 puts the vault out of every role's reach
  but `fkit-wiki`'s, so a guard reddening on it is *"a guard nobody may make green."*
- `test/coordination-citation-policy.test.js` — its `collectFiles()` walks
  `ai-agents/tasks/*/*/*.md` and top-level `ai-agents/sprints/*.md` only. The vault is **never
  walked**. Its own comment states this and adds the distinction that drives §2: `wiki-vault/log.md`
  appears in `TARGET` **as a CITED class, never as a citing one.**

⭐ **So for this row the guards are neither a coverage gate nor even a regression gate over its
deliverable.** They are a regression gate over **my own three records** — `plan.md`, `worklog.md`,
`review.md` — which sit in an open backlog folder and are scanned and **not exempt**.

**What actually verifies this pass:**

| Evidence | Proves |
|---|---|
| `/fkit-wiki-lint`, counts before and after | broken links, stale claims, missing back-links, template drift across the vault |
| `git diff ai-agents/wiki-vault/log.md` showing **zero deletions** | the append-only ruling honoured, per member, by command not by eye |
| Per-member re-verification recorded with quoted fragments | that each member's claim reproduced (or did not) **today**, not on its filing date |
| `git diff --stat` | the write surface is the vault and this task's own folder, nothing else |
| `npm test` + the two guards | **only** that this pass broke nothing outside the vault and wrote no banned coordinate into its own records |

⛔ **`npm test` green proves almost nothing about the vault.** Stating it as the verification would be
false, and the close report says so in the verdict, not in a footer.

---

## 1. Step 0 — the hard gate and the named baseline

### 1.1 The gate, re-measured not quoted

Run, and paste into `worklog.md` **dated, as its first entry**:

```
node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
```

Gate condition: both green, 0 fail, 0 skip. If either is red → ⛔ **STOP, return `BLOCKED`**, touch
no file.

⭐ **Measured this turn while planning: 41 tests, 41 pass, 0 fail, 0 skip.** ⛔ That is a plan-time
reading and the run re-measures it rather than inheriting it.

### 1.2 The baseline, named — because the tree is not mine

Record `git rev-parse --short HEAD` and `git status --porcelain` as the first worklog entry, so every
later "unchanged" proof has a named baseline. **Excluded from my diff by name, not by hand-waving:**

- Sweep B's 18 staged renames and its seven ADR correction notes (in `cf289c2`)
- `0357`'s and `0361`'s closed folders
- `ai-agents/knowledge-base/decisions/adr-046-…` (untracked, new this session)
- `0363` / `0376` amendments, `0377` / `0378` new briefs
- working-tree modifications to `adr-003` and `adr-037` — ⚠️ **these two ADRs changed twice**: once in
  `cf289c2` and again uncommitted. See Q5.

**My diff is exactly two things:** files under `ai-agents/wiki-vault/`, and this task's own folder.

---

## 2. ⭐ MANDATED SECTION — how this sweep avoids writing banned-form coordinates into open records

**Discharging the owner ruling relayed to me from `0237`'s review disposition, option label verbatim:
"Carry it into each sweep's plan gate (Rec)."**

### 2.1 ⚠️ How my case differs from Sweeps A and B — the vault is exempt from both guards

**Stated plainly, because it cuts three ways and only one of them is in my favour.**

1. **For the files this pass WRITES — the vault — the exemption is total.** Nothing I write into
   `ai-agents/wiki-vault/` can red either guard. ⛔ **That is not permission.** The vault's own
   convention, `durable-citation-anchors` row 3, rules a line number into `log.md` **wrong
   categorically**, and both `0317`'s and `0319`'s briefs restate it as a hard constraint. So the
   vault pages obey the same rule the guards enforce elsewhere, enforced by **discipline and by
   `/fkit-wiki-lint`**, with **no test underneath it**. ⭐ **An exemption from a check is not an
   exemption from the rule, and this is the row where those two come apart.**
2. **For THIS TASK's own three records — `plan.md`, `worklog.md`, `review.md` — there is no
   exemption at all.** They are in an open backlog folder, inside the citation guard's scanned set.
   The guard records the owner ruling of 2026-09-02, option label verbatim **"A + file follow-up D
   (Rec)"**: ship with **no** exemption for review ledgers; option B — exempting an open `review.md` —
   was **refused by name** as a silent widening of "closed records are frozen" into "ledgers
   anywhere."
3. ⭐ **And the exemption makes my exposure WORSE than Sweep A's or Sweep B's, not better.**
   `ai-agents/wiki-vault/log.md` is one of the three literal target classes in the guard's `TARGET`
   regex. **My three log-append members' entire subject is positions inside that file.** So the one
   file the guard will never scan is a file it *will* fire on the moment I name a position in it from
   a record it does scan. ⛔ **Transcribing a log position into my worklog in full-path-plus-number
   form reds the guard**, and it would happen while doing exactly what steps 2 and 3 ask for.

⚠️ **Concrete and not hypothetical.** `0212` must disambiguate **two** 2026-07-26 `ingest (sync)`
entries that a date alone cannot separate; `0317` and `0319` must each name standing flag lines inside
frozen entries. Every one of those is a position in the single most banned-form-prone file in the
repo. §2.3 rule 2 is what stops it.

### 2.2 The approaches — Sweep A's answer is precedent; I adopt it

Sweeps A and B both weighed four approaches and both took **1 + 4**. **I adopt, and I do not depart.**

| # | Approach | Sweep A | Sweep B | Sweep C |
|---|---|---|---|---|
| 1 | Anchor on heading + quoted fragment; never write the coordinate | ⭐ ADOPTED | ⭐ ADOPTED | ⭐ **ADOPTED — unchanged** |
| 2 | Split the coordinate across two table cells (`0237`'s dodge) | ⛔ rejected | ⛔ rejected | ⛔ **rejected — unchanged** |
| 3 | Put coordinates inside a fenced block or a blockquote line | ⛔ rejected by name | ⛔ rejected by name | ⛔ **rejected by name — unchanged** |
| 4 | Carry a genuinely load-bearing number as a **command's output** inside a fence | ⭐ ADOPTED | ⭐ ADOPTED | ⭐ **ADOPTED — unchanged** |

Their two reasons hold here without modification and I do not re-argue them: approach 2 is refused on
this repo's own `durable-citation-anchors` convention, whose verification section says a phrase split
across table cells has **no cheap remedy** and must be *"treat[ed] … as unverifiable by this
method"* — buying a green guard by making the record unverifiable by the repo's own prescribed check;
and approach 3 is refused because *"a sweep that satisfies its guard by hiding from it is the shape
this whole sprint exists to end."*

⭐ **One adaptation, and it is an extension of scope rather than a change of rule.** Sweeps A and B
bound their own task artifacts. **I bind the vault pages too.** No guard reaches them, so nothing but
this rule does — and the vault is the one place in the repo where a rotted coordinate has been written
by the very role that exists to prevent it. The rule is identical; the surface is wider.

⚠️ **Residual I keep from Sweep A, honestly.** `0369` has shipped, so the reviewer's ledger column now
reads `Location` and its own skill instructs heading-plus-fragment for coordination documents — the
spawn-prompt workaround is redundancy, not the mechanism. But the reviewer owns its section and I may
never edit it. If it writes a banned-form coordinate anyway: ⛔ **I do not fix it.** I re-invoke the
reviewer asking it to re-anchor its own rows, report the red guard rather than working around it, and
if it still stands it becomes an owner question (accepted residual vs. block the close) — ⛔ **not a
thing I resolve.**

### 2.3 The authoring rules this pass follows

Binding on `plan.md`, `worklog.md`, **every vault page and every `log.md` entry this pass writes**,
the close hand-off list, and every message I send:

1. ⛔ **No `token:digits` anywhere.** Not for the vault log, not for a board, not for a brief, not for
   an ADR, not for a source file, not inside backticks, not inside a fence.
2. **A position inside `log.md` is recorded as four fields, no number:** the entry's **dated heading**
   (e.g. the `2026-08-03 — sync` entry) · which occurrence within it, disambiguated by a **stable
   attribute of the entry itself** · the **quoted fragment** actually found there · what the member
   brief claimed was there. ⭐ **For `0212`'s two ambiguous entries the disambiguator is its own
   brief's: the page-count roll-up — one reads 161 pages, the other 166.** That is a durable property
   of the entry; a line number is not.
3. **An absorbed row is cited by its bare four-digit ID** — ⛔ never by a relative link into
   `ai-agents/tasks/backlog/…`. Those links break the instant the producer closes the row and would
   red the link guard. See §8.
4. **Where a number is genuinely load-bearing** — the `+N / −0` append-only proofs three members
   demand — it is carried as a **runnable command and its output** inside a fence. The fence is
   legitimate there because the number is a *command's output*, not a citation I authored.
5. Both guards are re-run over my own new records **before** the review round is requested, so a
   self-inflicted red is caught by me and not by the reviewer.

---

## 3. Step 1 — freeze the membership, in writing, before any write

Written into `worklog.md` as a **discrete dated step preceding every write.** A membership decided
after the writes is a rationalisation.

### 3.1 What this step may and may not decide

⛔ **`0212`'s membership is OWNER-RULED (2026-08-29) and is not this step's to re-take.** What it does
with `0212` is the same check every other member gets: still open, still needed, claim still
reproduces. ⛔ **`0317` and `0319` stay distinct — owner-ruled, option label verbatim "File its own
row (Recommended)", reason quoted: they "DIFFER IN KIND".** This step may not merge them, and §5 shows
how the ruling is honoured.

### 3.2 Membership, measured this turn

All six confirmed **`🔲 Backlog`, owner `fkit-wiki`, still open**, verified against each brief's own
`## Status` header:

| ID | Status | Board row lives on | Act |
|---|---|---|---|
| `0199` | 🔲 Backlog | `ai-agents/sprints/backlog.md` (unranked) | page resync — ADR-010's vault page + `index.md` |
| `0239` | 🔲 Backlog | `ai-agents/sprints/backlog.md` (unranked) | page resync — ADR-012's vault page |
| `0287` | 🔲 Backlog | `ai-agents/sprints/backlog.md` (unranked) | page resync — the Codex-sandbox pages |
| `0317` | 🔲 Backlog | `ai-agents/sprints/backlog.md` (unranked) | **append to `log.md`** — reconcile `0238`'s flag |
| `0319` | 🔲 Backlog | `ai-agents/sprints/backlog.md` (unranked) | **append to `log.md`** — discharge `0206`'s flag |
| `0212` | 🔲 Backlog | `ai-agents/sprints/backlog.md` (unranked) | **append to `log.md`** — the `"still open"` framing |

⭐ **Two facts the hand-off depends on, measured rather than assumed:** every one of the six rows sits
on the **Backlog board, unranked**, not on `sprint-7.md`. `sprint-7.md` mentions the six IDs only
inside `0358`'s own row text. The producer flips six rows on `backlog.md`.

### 3.3 ⚠️ A correction to the brief's own taxonomy, surfaced not silently absorbed

The brief describes this pass as **five page resyncs plus one `log.md` append**. **Measured against the
member briefs, that is wrong: THREE of the six are `log.md` appends.**

- `0317`'s `## What to build` step 2: *"Append ONE dated `log.md` entry that reaches a verdict"*, and
  its constraints say *"`log.md` is **append-only** — owner-ruled, task `0211`, no exceptions"*.
- `0319`'s `## What to build` step 3 is word-for-word the same instrument, with the same constraint.
- And the flags themselves are **in `log.md`**, not on a page: the standing
  `Task 0206: partial — not ready to close` and `Task 0238: partial — not ready to close` lines live
  in frozen dated entries. The page-side echoes are secondary.

⭐ **This does not change any ruling and it strengthens all of them.** The brief separated `0212` from
the rest *because* an append is a different act from a page rewrite — and on measurement, the
append/rewrite line runs **3 / 3**, not **1 / 5**. ⛔ **The consequence is operational: the append-only
proof (`zero deletions`) is a verification for three members, not one.** Recorded in the frozen
membership so no one reads the brief's split as the finding.

---

## 4. Step 2 — re-verify each member firsthand, and measure both upstreams

⛔ **Inherit nothing.** Per member, per claim, recorded in `worklog.md`: the site (heading + quoted
fragment, never a number), what is actually there today, and a verdict — **reproduces** /
**does not reproduce** / **partially reproduces** / **still blocked**. For absence claims, the
whitespace-normalised form the convention prescribes (`tr '\n\t' '  ' | tr -s ' '`, the squeeze
included) **with its stated limits named in the same breath as the result**. Where a count is
load-bearing, `grep -o … | wc -l` — ⛔ `grep -c` counts lines, not occurrences.

**A member whose claim does not reproduce is closed `⛔ Cancelled` with the non-reproduction
recorded** — ⛔ never silently dropped.

### 4.1 ⭐ The two upstream checks — measured this turn, and one of them fails

| Member | Upstream | Measured | Consequence |
|---|---|---|---|
| `0239` | `0232` | ✅ **LANDED.** In `ai-agents/tasks/done/`, `## Status` reads `✅ Done (agent-closed — not owner-verified)` | `0239` is **unblocked** |
| `0287` | `0273` | ⛔ **NOT LANDED.** `0273` is in `ai-agents/tasks/backlog/`, `## Status` `🔲 Backlog`. And the substance is unshipped: **every `--sandbox` occurrence under `claude/` still reads `read-only`** — six of them, in `claude/README.md`, `claude/agents/fkit-adversarial-reviewer.md`, `claude/skills/fkit-stateful-review/SKILL.md`, `claude/skills/fkit-adversarial-review/SKILL.md`, and twice in `claude/skills/fkit-review/SKILL.md` | ⛔ **`0287` is STILL BLOCKED → reported, NOT closed, stays open** |

⭐ **The vault already knows this** and it corroborates independently: the `2026-08-29 — ingest (sync)`
entry records *"every `--sandbox` occurrence under `claude/` still reads `read-only`"*. ⛔ Still
re-measured at run time rather than quoted.

⛔ **`0287`'s vault pages are therefore left ALONE.** Resyncing them now would write a page that is
wrong in a new way — the exact failure the brief's step 2 exists to prevent.

---

## 5. Step 3 — the three appends, done as three separately reasoned units

⛔ **Never a shared step, and never a shared verdict.** Honouring the owner's *"DIFFER IN KIND"*
ruling means the act, the reasoning, the verification and the report line are separate for each.

| Member | The act | What "done" is | What its own brief constrains |
|---|---|---|---|
| `0319` | **DISCHARGE** — the flag was correct when written; the condition it named has since been met | One dated entry reaching the word **`discharged`** or an explicit **`not discharged`** for `0206`; the 2026-08-03 / 2026-08-06 contradiction reconciled by naming both lines and saying which stands; ⭐ **an explicit sentence that this flag is STALE and not a contested close, distinguishing it from `0238`'s** — its brief calls that sentence *"the deliverable as much as the verdict is"* | Append-only; both standing `0206` flag lines byte-identical; the flag line names **`0319`**, never `0206`; ⛔ must not pre-decide `0290`'s general mechanism; ⛔ must not annotate `0206`'s brief — flag to the producer instead |
| `0317` | **RECONCILE** — the vault and the tree disagree about whether `0238`'s close landed, and the vault may be right | One dated entry reaching a **verdict** for `0238`; **every** remaining vault site carrying the literal pre-archival Sprint 2 path **named with its disposition** — a count without a list fails; both of `0238`'s unmeetable acceptance criteria **quoted verbatim** with the reason they cannot be met | Append-only; ⛔ do not reopen, move, re-status or edit `0238`; ⛔ do not "re-fix" the six named pre-archival-path instances the 2026-08-07 entry already warned about; the flag line names **`0317`**, never `0238` |
| `0212` | **CORRECT A FRAMING** — one new dated entry correcting a `"still open"` framing carried by two frozen entries | One dated entry correcting **only** the hits asserting `0143`'s fix is unshipped; the set **re-derived at run time** by `grep -rn "still open" ai-agents/wiki-vault/log.md` — ⭐ measured this turn at **23 hits**, and most are correct as written and left alone | Append-only under the standing owner ruling of 2026-08-03; the two target entries disambiguated by **page-count roll-up (161 vs 166)**, ⛔ never by line number; ⛔ **must not restate `0211`'s subject** — `0211` has shipped and its entry is already in the log, so that is a live constraint against an existing entry; ⛔ **must not absorb `0199`** |

### 5.1 ⭐ Three entries, not one — and why, given `0319`'s brief permits sharing

`0319`'s adjacency note permits `0317` and `0319` to *"share a single dated entry **only if** that
entry keeps the two verdicts separate and visibly different in kind"*, while `0317`'s brief says
*"Append ONE dated `log.md` entry"* and `0358` says *"never a shared step."*

⭐ **Ruling: three separate dated entries.** It is the only construction that satisfies all three
instructions simultaneously, it costs nothing (the log is append-only either way), and a reader
grepping the log for `0206`, `0238` or `0143` lands on an entry that answers **that** question rather
than one covering three. ⛔ The shared-entry option is permitted, not preferred, and it re-creates the
exact collapse risk the ruling exists to prevent.

### 5.2 The `0212` / `0199` split, stated so it cannot be collapsed

⛔ **Two members, two acts, two report lines.** `0212` is `log.md` **only**. `0199` keeps the
ordinary-vault-page half — `index.md` and the ADR-010 vault page. ⚠️ **Both being in one pass is
exactly the condition under which they get merged**, which is why the report states, per member, which
half of the old `0199` scope it carried.

⚠️ **A known live tension, surfaced not resolved by me.** The vault's own `2026-08-03` sync entry
already flags that `0199`'s verification step 5 instructs clearing `"still open"` framing from
`log.md`, which is **append-only** — and records that the conflict was *"not resolved"* by that run or
by the lint that followed. ⭐ **The 2026-08-29 ruling resolves it in practice**: the `log.md` half is
`0212`'s and is done by append; `0199` keeps the page half. **This pass writes that resolution down**,
so the flag stops recurring. → Q4.

---

## 6. Step 4 — scope: what fits in this row, and what must be bounded out

⭐ **The caller is right and the honest number is worse than the brief's.** Measured this turn against
the watermark `16754e3` (2026-08-28, set by the 2026-08-29 pass — the watermark is correct, not stale):

- **10 commits** since the watermark; under `ai-agents/`: **119** task files, **14** knowledge-base
  files, **8** sprint files changed.
- **61 closed-task folders** touched under `ai-agents/tasks/done/` since the watermark (committed plus
  working tree). ⛔ **45 of them have no vault task page** under a slug match. ⚠️ Slug matching is a
  floor, not a census — a page may exist under a different slug — but the order of magnitude is not in
  doubt.
- **11 ADRs** need vault work: **9 updates** (`003` `010` `012` `020` `032` `037` `038` `041` `042`)
  and **2 pages that do not exist at all** (`adr-045`, `adr-046` — the vault's `decisions/` directory
  stops at `adr-044`).

⭐ **The caller's "seven ADRs from Sweep B" is CONFIRMED exactly**: commit `cf289c2` changed precisely
`003` `010` `020` `032` `037` `038` `041`. Sweep A's commit added `010` `012` `042`; `adr-045` arrived
across two earlier commits; `adr-046` is untracked and new this session.

### 6.1 ⭐ The bounding argument — what I propose, and why

| Bucket | Size | In this row? |
|---|---|---|
| The six members | 6 | ⭐ **IN** — this row exists for them |
| The 7 Sweep-B ADR correction notes | 7 | ⭐ **IN** — owner-ruled 2026-09-04, label verbatim *"Fold into Sweep C (Rec)"* |
| ADR-046 (three dated corrections) | 1 | ⭐ **IN** — named by the caller; ⛔ **ingested from the CURRENT file**, see §6.2 |
| The other 3 changed ADRs + ADR-045 | 4 | ⭐ **IN — I argue for including them.** They are a strict superset of a set already ruled in, they are **enumerated and bounded**, and `0239`'s own member work rewrites the `adr-012` page anyway. Splitting four ADRs into a second row costs more coordination than it saves — the precise cost this sprint exists to remove |
| **The 45 uningested closed tasks** | **45** | ⛔ **OUT — bound it into a follow-up row.** See below. → Q2 |

⛔ **Why the 45 must not ride along.** The brief scopes this row as *"the five wiki-vault resyncs as
ONE pass"* and its verification steps are all member-shaped. 45 task pages is **7.5× the member count**
and would make the pass unauditable against its own verification list — nobody could tell whether a
member was verified or merely swept up. It is also **not the same act**: a resync reconciles a page
with a changed truth; a task ingest creates new synthesized knowledge and needs the source read in
full. ⭐ **Bounding it out is not deferring it — it is filing it where it can be verified.** The
recommendation is one follow-up row, owner `fkit-wiki`, scoped to *"delta-ingest the closed-task
backlog accumulated 2026-08-29 → present"*, with the measured count in its brief.

⚠️ **The `/fkit-wiki-sync` procedure will surface all 45 as delta whether I ingest them or not.** So
the run does not pretend they are absent: it **reports the count, names the bound, and hands the
producer the follow-up as a filing request** — the producer files it, not me.

### 6.2 ⛔ ADR-046 is read fresh, and its bytes are recorded

ADR-046 carries **three dated correction passes, all 2026-09-05** — verified this turn, including a
third pass correcting the site list of the second, which itself corrected the first. ⛔ **A copy read
earlier today is already stale.** The run re-reads the file immediately before ingest and records
`git hash-object` of the exact bytes ingested in the worklog, so a later reader knows which revision
the page describes. The same discipline applies to `adr-003` and `adr-037` → Q5.

---

## 7. Step 5 — run the pass

In order, each stage's effect reported separately:

1. **`/fkit-wiki-sync`** — detect the delta from the watermark. Report the delta size. ⛔ Do **not**
   let it ingest the 45 task pages; the bound from §6.1 governs and is recorded before the run.
2. **`/fkit-wiki-ingest`** — the 11 ADRs (9 updates, 2 new pages) and the three page-resync members'
   sites. ⛔ `0287`'s pages are **excluded by the blocked upstream**, not by oversight, and the
   exclusion is recorded.
3. **The three `log.md` appends** — three separate dated entries per §5, each proved append-only by
   `git diff` immediately after it is written.
4. **`/fkit-wiki-lint`** — counts **before and after**, every finding listed with a disposition.
5. **Advance `.wiki-watermark`** to the run's HEAD, and record in the same log entry that the
   closed-task delta was **bounded out by name** — ⛔ so a future sync does not read the advanced
   watermark as proof the 45 were ingested. ⚠️ **This is the single most dangerous side effect of
   bounding**, and it is the mitigation. → Q2.

⛔ **Schema conformance, non-negotiable:** every page written matches `schema.md`'s template for its
type, with **bold inline metadata** (`**Status**:`, `**Key files**:`, `**Date**:`, `**Source**:`) —
⛔ never YAML frontmatter. Obsidian wiki-links for pages, backticked paths for source files. Every new
link is made **bidirectional**; a one-way link found in passing is fixed.

---

## 8. Step 6 — the hand-off, and the two warnings it must carry

### 8.1 The close list — a hand-off, and nothing else

⛔ This task does **not** run `/fkit-task-done` or `/fkit-task-cancelled`, does **not** move a folder,
does **not** flip a board row, and does **not hold those skills** — the ADR-018 hook denies them to me
at any depth (ADR-033). The terminal act is handing `@fkit-producer` one line per row: **ID · outcome ·
reason**, bare IDs, no links.

**Predicted outcomes** — ⚠️ predictions from the plan-stage read, not the frozen verdicts:

| ID | Predicted | Reason |
|---|---|---|
| `0199` | `Done` | page half carried; the `log.md` half is `0212`'s |
| `0239` | `Done` | upstream `0232` measured landed |
| `0287` | ⛔ **STILL BLOCKED → stays open** | upstream `0273` measured **not** landed; all six `--sandbox` sites still `read-only` |
| `0317` | `Done` | verdict reached and appended |
| `0319` | `Done` | verdict reached and appended |
| `0212` | `Done` | framing corrected by append |

Plus **one filing request**: the bounded-out closed-task ingest row (§6.1).

### 8.2 ⚠️ Warning 1 — link churn, measured

**20 markdown links across `ai-agents/**` point into the six member folders while they sit in
`backlog/`** (35 total mentions across 12 files). ⭐ **Zero of the 20 are inside the vault** — so
**all 20 are link-guard-relevant** and every one breaks the instant its folder moves to `done/`.

| ID | md links | ID | md links | ID | md links |
|---|---|---|---|---|---|
| `0199` | 3 | `0287` | 3 | `0319` | 2 |
| `0239` | 2 | `0317` | 6 | `0212` | 4 |

⭐ **Two structural details the producer must know before it starts:**

- **Two are member-to-member**: `0239`'s brief links `0199`, and `0319`'s brief links `0317`. Both
  ends move in the same batch, so both sides need repointing in one act.
- **Several live in already-closed folders** (`0258`, `0289`, `0291`, `0318`). Those are exempt from
  the **citation** guard but ⛔ **not** from the **link** guard, which scans `tasks/done/`.

⛔ **This is the producer's act, after my hand-off — outside my diff and outside my verification.
Not flagging it would leave the next `npm test` red with nobody expecting it.**

### 8.3 ⚠️ Warning 2 — `0287` is not on the close list

The producer must not close five and assume the sixth. **`0287` stays open, `🔲 Backlog`, on the
Backlog board**, and the reason travels with the list.

---

## 9. Step 5 of the brief — the routed-in vault findings and the broken-link count

⭐ **Re-measured this turn under the convention-correct reading: the vault has ZERO genuine broken
links.**

| Matcher | Raw | Triage | Genuine |
|---|---|---|---|
| Markdown links `[..](..)` | **12** unresolved | **all 12 inside inline code spans** — quoted marker text, not links | **0** |
| Wiki-links `[[..]]` | **51** unresolved | 11 are `schema.md`'s own template placeholders; 24 are **elided** forms (`…`) inside log prose; 16 are meta-references to the notation itself (`[[wiki-links]]`, `[[link]]`) or `schema.md`'s quoted examples — every one of the 16 in `log.md` | **0** |

⚠️ **The brief says 13; I measure 12.** ⛔ **Not reconciled, and reported as a difference rather than
smoothed over** — it is a matcher difference or one site changed since 2026-08-29. Either way the
**convention-correct answer is unchanged at zero**, and ⛔ **no work is scoped against the 12.** The
run re-measures under `0353`'s settled condition and reports the number it finds, whatever it is.

⛔ Fixing is **not** in scope unless step 1 rules it in, and on this measurement there is nothing to
fix. Anything genuine found at run time is reported; it is out of every other role's reach and this is
the only row that may touch it.

---

## 10. Verification — mapped one-to-one onto the brief's nine steps

| # | Check | How |
|---|---|---|
| 1 | Diff only under the vault + this task's folder | `git diff --stat` against §1.2's named baseline, with the exclusion list quoted |
| 2 | Frozen membership precedes every write, **six** members, `0212` recorded as **owner-ruled in 2026-08-29** | §3's table as a discrete dated worklog step |
| 3 | Each of six re-verified firsthand; **for `0212`, `git diff ai-agents/wiki-vault/log.md` shows ZERO deletions** and a scan of the diff for a path-plus-number form returns nothing | §4's per-member record; the diff pasted as command output |
| 4 | Upstream check **shown** for `0239` and `0287`, with evidence | §4.1's table, re-measured at run time |
| 5 | `0317` and `0319` each with own reasoning, verification and report line; the *"DIFFER IN KIND"* ruling **quoted** and shown honoured. `0212` and `0199` likewise, each naming which half of the old `0199` scope it carried | §5 and §5.2. ⛔ A single shared "cleared both flags" line has failed this |
| 6 | `/fkit-wiki-lint` clean after; counts before **and** after | §7 stage 4; every finding listed with a disposition |
| 7 | The 13 vault-internal links reported with a **current** count | §9, including the 13 → 12 difference stated as unreconciled |
| 8 | `git status` shows no folder moved, no row flipped; the report **says** the list is a hand-off | §8.1 |
| 9 | `npm test` passes; counts reported | ⛔ Re-measure. ⚠️ **And state in the same breath that it verifies almost nothing here** (§0) — the driver measured 838/838 and 41/41 guards on 2026-09-04; ⛔ that is the driver's reading, not mine |

**Additional, not in the brief but required by §2:** both guards re-run over my own three records
before the review round is requested.

---

## 11. Edge cases and non-obvious failure modes

1. ⚠️ **The append-only proof must be taken per member, not once at the end.** Three members append to
   the same file. A single end-of-run `zero deletions` check cannot tell which append was clean. Take
   the diff after each of the three.
2. ⚠️ **`0212`'s two target entries are separated only by their page-count roll-up.** If the run
   cannot reproduce a **161** and a **166** roll-up on two distinct 2026-07-26 `ingest (sync)`
   entries, ⛔ **stop and report** — do not fall back on a line number, and do not guess which entry.
3. ⚠️ **`0317` requires a LIST, not a count.** Its verification says *"a count without a list does not
   satisfy this."* The re-measured figure must be reported **alongside** the 6 files measured
   2026-08-22, with a statement of whether it moved.
4. ⚠️ **`0317`'s six named pre-archival-path instances will show up in any dead-path scan.** The
   2026-08-07 entry already warns *"do not 're-fix' these named instances."* ⛔ A scan hit is not a
   defect here.
5. ⚠️ **`0319` must not pre-decide `0290`.** `0290` (architect-owned, open) is the general mechanism
   for "should anything notice when a close falsifies a vault claim." ⛔ This pass adds no check, no
   tooling and no convention — it is a single instance.
6. ⚠️ **`0319` may find `0206`'s brief carries a stale claim.** ⛔ It does **not** annotate it — this
   row's diff is vault-only. It flags it to the producer.
7. ⚠️ **Advancing the watermark while bounding out 45 pages is a trap** (§7 stage 5). The bound must
   be written **into the log entry**, not only into the worklog, or the next sync reads a clean
   watermark as a clean vault.
8. ⚠️ **`adr-045` and `adr-046` need new `index.md` catalog rows**, not just pages — and `index.md` is
   the file most often forgotten in an ingest. Bidirectional links from both new pages to the
   `systems/` pages they touch, and back.
9. ⚠️ **`/fkit-wiki-lint` may itself surface a repo-state condition the vault cannot fix** — it has
   before (the Sprint 6 archival flag). ⛔ Such a finding is **flagged for human review**, not worked
   around, and it does not block the close.
10. ⚠️ **A `0273` landing mid-run would change `0287`'s verdict.** ⛔ The measurement is taken once, at
    step 2, and the verdict is stamped with that reading. Re-measuring opportunistically to reach a
    closable answer is the failure mode.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-05

Given live via `AskUserQuestion` in this `fkit lead` session. Option labels recorded **verbatim**.
These bind the build and process-review workers.

| # | Question | Owner ruling (verbatim option label) | What it settles |
|---|---|---|---|
| **T0** | Approve this plan as written? | **"Approve as written (Rec)"** | The plan above is the approved plan. These bytes are what the build implements. |
| **T1** | Q1 — which ADRs get vault work? | **"All 11 (Rec)"** | ⭐ **All 11.** The 7 Sweep-B notes, ADR-046, plus `adr-012` `adr-042` `adr-045`. The owner's reasons: the four extra are **enumerated and bounded**, `0239`'s own member work rewrites the `adr-012` page regardless, and **`adr-045` / `adr-046` have no vault page at all** — leaving a shipped ADR uncatalogued is the defect class this pass exists to close. ⚠️ Accepted cost: this widens past the letter of the 2026-09-04 ruling, which named seven. |
| **T2** | Q2 — the 45 uningested closed tasks | **"Bound out + filing request (Rec)"** | ⛔ **OUT of this row.** 45 is 7.5× the member count and a **different act** — a resync reconciles a page with changed truth; a task ingest creates new synthesized knowledge. Folding them in makes the row **unauditable against its own verification steps**. ⭐ **The bound MUST be written into the `log.md` entry itself**, not only the worklog — §7 stage 5 and §11 item 7. Hand the producer a **filing request**; ⛔ do not file the row yourself. |
| **T3** | Q3 — `0287` on a blocked upstream | **"Stays open — confirm no exception (Rec)"** | ⛔ **`0287` stays open, `🔲 Backlog`, NOT on the close list.** The brief's step 2 prescribes exactly this: a member whose upstream has not landed is **reported, not closed**. Resyncing its pages now would write a page **wrong in a new way**. ⚠️ Five-of-six is the **correct** outcome, not a partial failure — say so in the report. |
| **T4** | Q4 — `0199`'s step 5 vs `log.md`'s append-only rule | **"Write the resolution into the log (Rec)"** | ⭐ Treat the 2026-08-29 routing ruling as the resolution — the `log.md` half is `0212`'s, done by append; `0199` keeps the page half — and **write that into the log entry** so the flag stops recurring. The owner's reason: the ruling already decided it in substance, and recording it retires a flag **three separate runs have now carried**. ⛔ Written as **this run's reconciliation, dated and attributed** — ⛔ **never as a quoted owner sentence**, per the plan's own §5.2 caveat. |
| **T5** | Q5 — which bytes to ingest for `adr-003`, `adr-037`, ADR-046 | **"Working-tree bytes + record the hash (Rec)"** | ⭐ **Ingest the working-tree bytes** and record `git hash-object` of exactly what was read. The owner's reasons: the vault documents the project **as it is**, and committed-only would **exclude ADR-046 entirely** (it is untracked). ⚠️ Accepted cost, stated: if that in-flight work is amended or reverted, the page describes a revision that never landed — **the recorded hash makes that detectable, it does not prevent it.** |

⚠️ **Transport note.** This plan text was returned to the driver through the spawn channel, which
HTML-escaped some angle brackets. The driver restored `&lt;`/`&gt;` to `<`/`>` when persisting these
bytes. No other character was altered. Recorded so a later reader does not read the restoration as
drift.
