# Worklog — 0356, Sweep A: the citation-rot class in ONE verified pass

**Author:** fkit-coder, spawned Build worker under `fkit-sprint-ship-loop` (no owner channel — ADR-021).
**Approved plan:** this folder's `plan.md`, approved by the owner 2026-09-03, option label verbatim
**"Approve as written (Rec)"**, with dispositions H1 / H2 / H3 appended.

⛔ **Authoring rule in force throughout this file** (plan §2.3): no `token` + colon + digits form
anywhere — not for coordination documents, not for ADRs, not for source files, not inside backticks.
A rotted coordinate is recorded as **target file (bare path) · nearest heading · quoted fragment
found · what the member claimed**. Where a number is load-bearing it appears only as a command's
own output inside a fenced block.

---

## Step 0 — the hard gate, 2026-09-03

**Baseline recorded before the first edit.**

```
$ git rev-parse --short HEAD
6dcc33e

$ git status --porcelain
 M ai-agents/sprints/sprint-7.md
 M ai-agents/tasks/backlog/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md
?? ai-agents/tasks/backlog/0356-sweep-a-the-citation-rot-class-one-verified-pass/plan.md
```

⚠️ Those three entries are **pre-existing, not mine** — the driver's board work plus the plan it
wrote at the approval gate. Every later "byte-identical to HEAD" proof excludes them by name.

**The two guards, run together, before any edit:**

```
$ node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
...
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 456.101125
```

Per-file evidence inside that run:

- **`test/coordination-citation-policy.test.js`** — scanned 722 files; total 166 citations across 66
  files; exempt 166; **residual 0**. Its L7 disclosure re-printed all named blind spots.
- **`test/reference-integrity.test.js`** — scanned 834 files, resolved 3131 link targets, **0
  broken**, 6 named-exempt.

⭐ **GATE CONDITION MET: both green, 0 fail, 0 skip.** The sweep may touch files.

⚠️ **Recorded from the citation guard's own L7 disclosure, because it bears directly on this task:**
blind spot 11 reads *"an open review.md is scanned and NOT exempt — 0 today (all 133 review ledgers
are in done/), prospective cost UNMEASURED."* This folder's `plan.md`, this `worklog.md` and the
coming `review.md` are the **first open-folder records the guard has ever scanned in that shape**.
Residual was 0 with `plan.md` already on disk, so the approved plan is itself clean under the guard.

⛔ **What the gate does NOT prove** (plan §0): both guards are a **regression** gate, not a
**coverage** gate. Neither looks at `ai-agents/knowledge-base/`, `claude/`, `bin/` or `test/` for
citations, and the citation guard exempts closed task folders in whole. Most of this sweep's edit
surface is therefore uncovered by either guard, and per-repair re-resolution recorded below — not a
green run — is what proves each repair correct.

---

## Step 1 — the frozen membership, 2026-09-03

⛔ **Published before the first edit.** Nothing in the repair surface has been touched at the moment
this section is written; `git status --porcelain` still shows only the three baseline paths recorded
in Step 0 plus this worklog.

### 1.1 The decision rule, restated before the verdicts (plan §3.1)

A candidate is **IN** when all four hold:

1. Its deliverable is a **repair or re-anchoring of a recorded coordinate** that no longer resolves to
   what it claims. A row whose deliverable is a *guard*, a *decision*, or a *claim correction that is
   not a coordinate* is **OUT**.
2. Its edit surface is one this sweep may lawfully touch — never `ai-agents/wiki-vault/`, and inside
   `done/`/`cancelled/` only where the member's own brief carries an owner ruling naming that edit.
3. It is **not** a declared member of Sweep B's or Sweep C's frozen candidate list.
4. Absorbing it does not require re-deriving an **unbounded** scanned set. One named file is bounded;
   *"every occurrence of a form, repo-wide"* is not.

### 1.2 The frozen membership — 11 IN, 2 OUT

| ID | Verdict | Test | Reason, with the measurement that settles it |
|---|---|---|---|
| `0193` | ⭐ **IN** | all four | 7 named defects across 4 named files. Closed-brief edits proceed under H1 — the owner's ruling of 2026-08-02/03 extending its scope to `0162`, quoted in its own brief |
| `0197` | ⭐ **IN** | all four | 11 `path:NNN` coordinates + 3 `adr-008:NNN`, all inside one file. Bounded by enumeration |
| `0232` | ⭐ **IN** | all four | 16 code-coordinate occurrences across 12 lines of one file. ✅ Its recorded ordering constraint is **discharged**: `0171` is committed at `2a64727` |
| `0275` | ⭐ **IN** | all four | 3 citations in one parenthetical |
| `0286` | ⭐ **IN** | all four | ⚠️ **Ruled by the approved plan by name** — *"A sweep, but of one named file, both directions. Bounded → passes test 4."* See 1.4 for the cost that ruling carries |
| `0298` | ⛔ **OUT — stays open** | fails 1 | Its deliverable is a **tripwire test in `test/structure-spec.test.js`**, not a repair. Nothing is stale today. Same reason the brief already excluded `0307`. See 1.5 for its title coordinate |
| `0308` | ⭐ **IN** | all four | Re-measured: **48 occurrences across 12 files**, `claude/scaffold/` **0**, `task 43` **0** — the brief's figures reproduce exactly. Bounded to 12 named files |
| `0309` | ⭐ **IN** | all four | Both classes bounded by enumeration. ⚠️ Its live dependency-declaration site is **surfaced, not repaired** — owner ruling H2 |
| `0320` | ⭐ **IN** — Sweep A | all four | 2 sites. Sweep-assignment ruled in 1.3 |
| `0321` | ⭐ **IN** — Sweep A | all four | 2 sites. Sweep-assignment ruled in 1.3 |
| `0323` | ⛔ **OUT — stays open** | **fails 4** | ⚠️ **This is the one verdict that moved from the plan's prediction.** See 1.4 |
| `0343` | ⭐ **IN** | all four | 2 locators + a 5-item freeze list. Proceeds under H1 — its own owner ruling of 2026-08-26, verbatim label **"Header block only (Recommended)"** |
| `0344` | ⭐ **IN** | all four | 8 coordinate occurrences on 7 comment lines + 2 in ADR-042 |

**Total: 11 IN, 2 OUT.** ⛔ Not a target and not a quota — the owner's ruling authorizes the closes this
sweep justifies.

### 1.3 ⭐ The `0320` / `0321` sweep-assignment ruling

**Authority to rule both:** this task's step 1 is told to rule `0320`; Sweep B's brief independently
tells its own step 1 to rule `0320` **and** `0321`, settling the tie with *"whichever runs first
records its ruling for the other."* Sweep A runs first, so Sweep A rules both.

⭐ **Ruling: both `0320` and `0321` land in Sweep A.**

**Reason.** `0320`, `0321` and `0309`'s second class are **one defect family** — the stale `0171`-status
claims, split into three rows by an owner ruling of 2026-08-22 on *location* and *repair form*, not on
kind. Measured firsthand today, `0309`'s brief names `0320`'s two closed briefs and `0321`'s two board
rows as **its own out-of-scope residuals**, and instructs its implementer to name them as residuals.
Routing two thirds of that family to a different sweep re-creates the cross-row coordination cost these
sweeps exist to remove.

⚠️ **The counter-argument, stated rather than buried:** `0320` is append-only dated notes into closed
folders, which is Sweep B's declared shape almost word for word. That is a real cost of this ruling.
⛔ Both rows land in **exactly one** sweep either way, so the constraint the briefs impose is honoured.

### 1.4 ⛔⛔ `0323` — the one verdict that MOVED from the approved plan's prediction

The approved plan predicted `0323` **IN, architect-gated**, on the ground that its hard part is an
ADR-meaning judgement. It did **not** adjudicate it against test 4. Applying test 4 to a firsthand
measurement moves it.

**The measurement, taken today across `ai-agents/` and `claude/`, excluding `ai-agents/wiki-vault/`,
with the brief's own corrected `[0-9]+` pattern:**

```
$ grep -rnoiE 'adr-[0-9]{3}:[0-9]+(,[0-9-]+)*' ai-agents/ claude/ --exclude-dir=wiki-vault | wc -l
     402
$ grep -rnoE  'adr-[0-9]{3}:[0-9]+(,[0-9-]+)*' ai-agents/ claude/ --exclude-dir=wiki-vault | wc -l
     292
$ grep -rnoE 'ADR-[0-9]{3}:[0-9]+(,[0-9-]+)*' ai-agents/ claude/ --exclude-dir=wiki-vault | wc -l
     110
$ grep -rnolE 'ADR-[0-9]{3}:[0-9]+(,[0-9-]+)*' ai-agents/ claude/ --exclude-dir=wiki-vault | wc -l
      28
$ grep -rnoiE 'adr-[0-9]{3}:[0-9]+(,[0-9-]+)*' claude/ | wc -l
       0
```

⭐ **`claude/` is a positively measured ZERO**, stated as a result rather than as silence, as the brief
demands. ⚠️ **The brief's own figures do not reproduce and this brief was wrong** — it recorded
351 / 285 / 66 / 27; the true figures today are **402 / 292 / 110 / 28**. The class has grown.

**Why that fails test 4.** `0323`'s verification step 2 is a hard gate in its own words: *"The worklog's
triage table has one row per occurrence, and its row count equals the census count. ⛔ A shorter table
fails this step."* The census is the **402**. Each row must carry *"the coordinate, the line it lands on
today, and its class … with a reason"*, resolved *"by READING ITS CONTEXT — never by arithmetic, never
by pattern."* That is a 402-row hand-resolved triage over a set defined as *every occurrence of a form,
repo-wide* — the approved plan's own worked example of an unbounded scanned set.

⛔ **`0323` is therefore NOT absorbed and NOT closed. It stays open as its own row, unchanged.** Its own
brief's `## Notes` warn that *"absorbing a sweep into a sweep is the shape that has already failed here
three times"*; folding a 402-row census into an 11-member pass is that shape.

⚠️ **What this costs, said plainly rather than implied away:** the drifted coordinates `0323` names —
`ADR-013`'s five in one `## Consequences` sentence, `adr-022`'s three, and `architecture.md`'s one —
stay stale after this sweep. **That is a real, named residual, not a clean result.**

⚠️ **Consequential fence this sweep now honours:** because `0323` stays open, **`0286` does not touch
any `ADR-NNN:LINE` citation** in `architecture.md`. That class is `0323`'s. Recorded so a later reader
does not read the omission as a miss.

### 1.5 `0298` — OUT, but its own title coordinate is repaired

`0298`'s deliverable is a test, so it fails test 1 and **stays open**. But its `# H1` and four further
lines carry a line-numbered coordinate into the root `README.md`, which is a citation inside an open
brief and therefore falls to `0309`'s class. **Measured today:** the cited range opens on the sentence
*"A launch also tells you — one stderr line — when your project's `ai-agents/` tree, or its root
`CLAUDE.md` / `AGENTS.md`, diverges from what the installed version ships"* and the sentence ends
within the cited range. ✅ **The coordinate still resolves correctly.** ⛔ **Nothing to repair; the row
stays open.**
Recorded because the approved plan predicted a repair here and the measurement does not support one.

### 1.6 Sweep-boundary check (test 3)

Neither `0320` nor `0321` appears in Sweep B's frozen 20-row candidate table; they appear only in its
boundary note. No row absorbed here is a declared member of Sweep B or Sweep C.

---

## Step 2 — every member's claims re-verified firsthand, 2026-09-03

⛔ **Nothing inherited.** Every figure below was measured today against the working tree and, where
stated, against `HEAD` `6dcc33e`. ⛔ **No edit has been made to any repair surface at the time this
section is written.**

### 2.1 Members whose claims REPRODUCE as filed

| Member | Verdict | Evidence measured today |
|---|---|---|
| `0193` | **reproduces — all 7 defects** | D1 `0158`'s brief still carries the addendum pointer to `sprint-2.md`; the quoted *"⚠️ The placement below is producer judgment"* addendum now sits far below where the brief claims (it has drifted twice since filing). D2 the same pointer is live in the `0158` board row. D3 `## Priority` reads `122`, board row reads `P123`. D4 `claude/universal-rules.md` **does not exist**; `claude/scaffold/universal-rules.md` does. D5 `0142`, `0157`, `0160` are **all three** in `ai-agents/tasks/done/`. D6 the merit note still reads *"On merit this belongs at 122"* — a bare rank. D7 `0162`'s `## Priority` reads `127`, its board row reads `P128`, and `P127` is now held by `0150` |
| `0197` | **reproduces** | ADR-010 carries **11** `path:NNN` coordinates on 11 lines plus **3** `adr-008:NNN`. `claude/scaffold/CLAUDE.md` is **92 lines** and the brief's range opens on the heading `## The fkit agent team` — the brief's 2026-08-02 figures still hold |
| `0232` | **reproduces exactly** | **16** code-coordinate occurrences across **12** distinct lines, matching the brief's re-derived table row for row. Classes 4.3 and 5 remain **discharged** — `grep -oE 'adr-0[0-9]{2}:[0-9]'` over the whole file returns **0** |
| `0308` | **reproduces exactly** | 48 occurrences / 12 files / `scaffold` 0 / `task 43` 0, and the per-file tally matches the brief's table row for row |
| `0320` | **reproduces** | Both closed briefs exist; both carry the wrapped fragment *"is the open task for"* / *"the convention page."*; both claims still stale; neither already repaired. ✅ The brief's warning holds — a single-line grep for the full sentence returns nothing on either file |
| `0321` | **reproduces** | Site **C** is the board row linking `0307`, still carrying *"(in progress, Sprint 6 P2) does NOT gate this"*. Site **D** is the row linking `0310`, still carrying *"still `🔄 In progress`"* inside its dated 2026-08-15 reading. ✅ A grep for *"does NOT gate this"* returns **3** rows and only these **2** are sites — the `0308` row is correct as written |
| `0343` | **reproduces** | Both locators present and both still point into `tasks/backlog/`, which resolves to nothing |
| `0344` | **reproduces exactly** | Each of the four target fragments occurs **exactly once** (counted with `grep -o … \| wc -l`, not `grep -c`). 8 stale coordinate occurrences on 7 comment lines, all at or after the fence marker. ADR-042 carries a line-numbered citation into `test/prove-red.sh` at two sites — its §Context premise sentence and its §Evidence list — and the line it names is not the one holding `work="$(mktemp -d)"`, which sits well below it |

### 2.2 ⛔ Members whose briefs are WRONG, or whose premises DO NOT reproduce

**These are the findings the re-verification step exists to produce. Each contradicts a member's own
brief and none of them was inherited.**

1. ⛔⛔ **`0275`'s central fence is REFUTED. Its "correct" citation is no longer correct.**
   `0275` is built around a fence it states in capitals — that the bare line-range citation its own
   brief quotes resolves to `claude/skills/fkit-review/SKILL.md` and *"IS CORRECT. DO NOT 'FIX' IT."* Measured
   today, that range is **not** the degradation-template block: it is the tail of a *"never invent a
   version"* bullet plus a **dated 2026-08-28 note** about Codex's sandbox. The degradation template
   carrying *"Decision: 🟡 Partial review — Codex unavailable"* and the `[NOT model-diverse —
   INCOMPLETE]` banner has moved far down the same file.
   ⭐ **So all three of the paragraph's citations are stale, not two.** `0273`'s brief carries the same
   refuted claim (*"which is CORRECT and must not be 'fixed'"*), so the error is recorded in two open
   briefs. ✅ The repair is unchanged in shape and gets **easier**: fully qualify and durably anchor all
   three, exactly as `0275`'s `## What to build` already directs.
   ⚠️ The other two reproduce: the fallback banner and the coverage self-assessment are both at
   coordinates other than the ones cited, in the same file, as the brief predicts.

2. ⛔⛔ **`0286`'s own fence CONTRADICTS its own target list, and they are the same line today.**
   `0286` fences one numbered `architecture.md` line as *"`0273`'s"* while separately listing a
   different numbered line of the same file as its own stale-citation target — the two numbers were
   measured two days apart. Re-derived **by content** rather than by number: `0273`'s site 6 is
   *"the dependency table's Codex CLI row"*, and today that row **is** the line whose citation `0286`
   claims as its own target. The two briefs measured the same line two days apart and the file grew
   between them.
   ⭐ **Resolution taken, and it is the cheapest-to-reverse branch: the fence wins.** That row is left
   untouched by this sweep. `0273` is still open, is instructed to rewrite that row, and is separately
   instructed to *"fix a stale citation only where it sits on a line this task is already rewriting"* —
   so the citation is already owned by a live task. ⚠️ **Recorded, not resolved silently.**

3. ⚠️ **`0286`'s "second half" premise no longer reproduces.** The brief is built on `0257`'s
   uncommitted `+14`/`+16` line shift and instructs a run to *"re-derive the shift map from disk
   (`git diff` against the commit that last contained the pre-`0257` file)."* Measured today,
   `architecture.md` is **623 lines at `HEAD` and 623 in the working tree, with no uncommitted
   change** — `0257` is closed and committed, so the shift is history and there is no pending map to
   derive. Inbound citations are simply resolved against today's file.

4. ⚠️ **`0323`'s census figures were wrong and the class has GROWN** — 402 / 292 / 110 / 28 measured
   against the brief's 351 / 285 / 66 / 27. Recorded in §1.4, which is why it leaves the sweep.

5. ⚠️ **`0309`'s class-1 population is 15, not the brief's 6, and it names a site the brief does not.**
   Measured with the brief's own mandated exclusions
   (`--exclude-dir='0308-*' --exclude-dir='0309-*'`), the raw count falls from **47** to **15**.
   ⭐ **The exclusion is doing even more work than the brief recorded** — it was 45 → 14 on 2026-08-15.
   Of the 15, **8** are `0306`'s protected disclosure text inside `0226` (correct by construction, ⛔
   must not be touched), leaving **7** real sites across **5** briefs: `0226` ×3, `0037` ×1, `0156` ×1,
   `0184` ×1, and ⭐ **`0315` ×1 — a brief the filing measurement never saw.** ⛔ **This brief was
   wrong**; the class is 7, not 6.

6. ⚠️ **`0298`'s own title coordinate does NOT need repair.** Its line-numbered citation into the root
   `README.md` still lands on the scope sentence it names. Recorded in §1.5 — the approved plan
   predicted a repair here and the measurement refuses it.

### 2.3 Non-reproductions — named expressly

⭐ **No member's claim set failed to reproduce in whole.** ⛔ **No member is closed `Cancelled` on
non-reproduction grounds.** The partial non-reproductions are items 1, 2, 3 and 6 above, each named
with what replaced it. `0232`'s two predicted non-reproductions (Classes 4.3 and 5) were **already
recorded as discharged in its own brief before this sweep**, and today's measurement confirms that
discharge is now durable — `0171` is committed at `2a64727`.

---

## Step 5 (early) — the architect consult, batched, hop 2 of 2

Fired before the repair pass because three members' repair *shape* depends on it. One call, batched,
stating the hop budget and the chain. ⛔ It surfaced no new architecture decision, so nothing is routed
to the owner from it.

### 5.1 What it ruled — `0197`

The test it applied: **a pointer earns a note when a reader following it today cannot recover the
claim**; a coordinate that still lands, or a citation whose *paired anchor phrase* still resolves,
needs nothing.

| # | Pointer | Ruling |
|---|---|---|
| P1 | §Context, menu bullet | **live — note.** Naked, fully drifted, and the claim it supports is still in force |
| P2 | §Context, lock bullet | **live — note naming BOTH halves.** One sub-range still lands; a blanket "stale" over a correct sub-range is itself a false claim |
| P3 | §Context, skillOverrides sub-bullet | **live — note.** Two targets in one pointer: one function moved file, the other stayed and moved line |
| P4 | §The two-lists passage | **live — note, RANGE half only.** Cite §Decision 5 as the binding site for the file fact; restate nothing |
| P5 | §Consequences, one-role-per-session | **live — drifted, NOT target-gone.** ✅ I measured what the architect said the verdict turned on: the AppleScript/Accessibility rationale **survives** in `claude/fkit-claude.sh`, in the file header comment block. So the note gives its new anchor rather than reporting a deletion |
| P6 | §Related `Code:` line | **live — note.** A `Code:` bibliography is a *pure forwarding pointer* with no paired phrase; record which sub-ranges still land |
| P7 | `claude/scaffold/CLAUDE.md` range | ⭐ **LANDS — earns NO correction note.** The range opens on `## The fkit agent team` and contains both the roster and the whole skill-lock passage. It clips a sentence at its end; that is cosmetic, not a coverage failure. ⛔ Annotating it would be a **false drift claim** |
| P8 | the `adr-008` cites | ⭐ **Live class, NOT frozen by construction** — an append-corrected ADR is a document a third party edits under you, so the convention's row 3 applies and `path:NNN` is the wrong form. **But all four are paired with a heading or a verbatim quote**, so drift is recoverable and none earns a note |

⭐ **P7 is the answer `0197` exists to get, and silence on it fails the task.** It is recorded here
with its durable anchor — `claude/scaffold/CLAUDE.md` §*"The fkit agent team"*, quoted fragment
*"cannot run `/fkit-review`"* — because a heading alone in a long document is, in the convention's own
words, *"durable and useless"*; the fragment does the locating.

✅ **P8 measured, as the architect said I still owed:** ADR-008 §*"Role access — three explicit paths"*
**still exists**, and the cited range still contains it. The verbatim quote ADR-010 pairs with its
second `adr-008` cite also still exists, though further down the file than the coordinate says; and
the third cite's coordinate has drifted while its paired description still resolves. ⭐ **So: the
section survives, the pairings all resolve, no note is earned — and the numeric drift is recorded here
rather than left silent.**

⚠️ **One reading I must declare rather than resolve silently.** `0197` step 3 says append *"a dated
⚠️ note — one"*, while `0143`'s settled `R1-placement` residual says a note sits **below the claim it
corrects**, and these pointers span §Context, §Consequences and §Related. **I take "one" to mean one
dated correction *event*, and the placement rule to govern where its text sits** — so one note per
§heading, all carrying the same date and cross-referencing. That is also the granularity `0232` step 3
independently prescribes.

### 5.2 What it ruled — `0232`

- **4.1 and 4.2 are both ⚠️, not ⛔.** ⛔ was used elsewhere in this corpus only where a *later ADR
  named the site and reversed it*; nothing reverses these. ADR-010 §Decision 5's own ⚠️ note settles
  the species verbatim — *"this decision was not overturned, it was HONORED."*
- **4.1's note must do three things** or a reader re-litigates it: say the count is false today; say
  this was the **aside**, not the load-bearing bug (which was initiation being unable to invoke its own
  survey); and **point at the header banner already in the file** for the mechanism's supersession —
  ⛔ not make a fresh claim about ADR-018, which is out of `0232`'s scope.
- **4.2 — "moot" is NOT honestly reportable as a drifted fact.** One half is **satisfied**; the other's
  **referent does not exist**, and a reader told "⚠️ drifted" will go hunting for a passage to fix.
  ⛔ **Do not mint a new marker** — that is a convention change and the owner's. The ⚠️ stays and the
  **prose** carries the three-way split.
- ✅ **The history question the architect said I owed, measured:**
  `git log -S'invisible and unrunnable' -- claude/scaffold/CLAUDE.md` returns **two commits**, so the
  passage **did exist and was later removed**. ⭐ The directive was **discharged by removal**, and the
  note can say so as established history rather than hedging. A whole-file grep for the three terms
  returns **zero matches, exit 1**, today.
- **The directive closes in full** — one half satisfied, the other's target removed. ⭐ Say so, or the
  next sweep reopens it.

⭐ **The architect explicitly recorded that nothing in either answer needs the owner** — every ruling
interprets something already on record. The one item it declined as owner territory is *a distinct
marker for "target gone" / "moot"*, and this sweep does not mint one.

---

## Decision log — what this worker did unattended (ADR-019 audit obligation, carried by ADR-032)

**Fixes applied to a repair surface without asking: `none`.** ⛔ **No file outside this task's own
folder has been edited by this worker.** The stop below sits *upstream* of the first repair, so no
fix-approval question ever arose. Recorded explicitly, because an empty log and a forgotten one are
otherwise indistinguishable.

**Obvious-winner calls made without asking: three. Each is a step the approved plan delegated to
step 1 or step 2 by name, and each is recorded with why it qualified.**

| # | Call | Which finding it answers | Why it qualified |
|---|---|---|---|
| D1 | `0323` ruled **OUT** of the membership | Plan step 1's mandate to freeze the real membership | ⭐ **In-plan, not a plan change.** The plan states its prediction table is *"a PREDICTION … not the frozen membership"* and that *"Verdicts here can move."* It supplies test 4 and never adjudicates `0323` against it. Applying a stated rule to a firsthand measurement is the step the plan delegated. It **narrows**, and the plan says a sweep closing fewer rows has obeyed the ruling |
| D2 | The `0286` / `0273` fence collision resolved **in the fence's favour** — that line left untouched | Step 2 finding 2 | ⭐ Cheapest-to-reverse branch, and the line is already owned by a live open task instructed to rewrite it. Leaving it creates no new defect; taking it would cross a fence two briefs assert. ⛔ Recorded rather than resolved silently |
| D3 | *"one dated ⚠️ note"* in `0197` read as **one correction event, one note per §heading** | The tension between `0197` step 3 and `0143`'s `R1-placement` residual | Both readings satisfy `0197`; only this one satisfies `0143`'s settled placement rule as well, and it matches the granularity `0232` independently prescribes. Declared in §5.1 rather than taken silently |

⚠️ **A self-inflicted defect, found by my own check and fixed before the review round.** My first draft
of this worklog wrote **six** line-numbered coordinates into an open-folder record — the exact form
this task's brief forbids in its own artifacts, and a stricter rule than the citation guard enforces
(the guard's target class does not cover a root `README.md` or a `test/` path). ⭐ **Caught by me, not
by the reviewer**, per plan §2.3 rule 5, and re-anchored on heading + quoted fragment. The approved
`plan.md` was measured at **zero** occurrences of the form and needed no change.

---

## Step 1 addendum — OWNER RULINGS H4 / H5 / H6, 2026-09-03

Given live via `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`, relayed
by the driver. Option labels verbatim. ⛔ **Appended beside the frozen table of §1.2, which is left
byte-identical** — the membership I froze before the edits stays visible as I froze it.

| # | Question | Ruling (verbatim option label) | What it settles |
|---|---|---|---|
| **H4** | `0286`'s inbound half is not bounded; the plan ruled `0286` bounded by name. How is it scoped? | **"Split — half A now, half B stays open (Rec)"** | ⭐ **Half A (43 outbound citations inside `architecture.md`) is IN** and is repaired in one edit pass with `0275`, per plan §10 item 10. ⛔ **Half B (inbound, ~230 occurrences across ~60 files) is OUT — not attempted.** ⛔ **`0286` does NOT close**; it stays open carrying half B only, and its brief's own §C guard-test question stays unanswered as a named residual |
| **H5** | Ratify or overturn my step-1 call putting `0323` out? | **"Ratify OUT (Rec)"** | ⭐ The obvious-winner call of §1.4 now stands **as an owner ruling**, not as my judgement. `0323` is OUT, stays open, is **not** on the close list. The owner **declined to re-file its brief** with the corrected census, so the figures recorded in §1.4 of this worklog are **the only place the true numbers survive** |
| **H6** | `0273`'s brief carries the same refuted *"IS CORRECT"* claim as `0275`. Repair it? | **"Report it, file a follow-up (Rec)"** | ⛔ **`0273`'s brief is NOT edited** — it is not a member of the frozen membership, and correcting a non-member mid-sweep is the scope creep the freeze exists to stop. The refutation is **reported** and returned to the driver as a **producer follow-up to be filed**. ⛔ I do not file it |

### Named costs these rulings carry into the close report

- ⛔ **`architecture.md`'s inbound citers stay stale** (H4), and a row the approved plan expected to
  close — `0286` — remains open.
- ⛔ **`0323`'s drifted coordinates stay stale** (H5): `ADR-013`'s five in one `## Consequences`
  sentence, `adr-022`'s three, and `architecture.md`'s one.
- ⚠️ **`0273`'s brief keeps a measurably false fence claim** until the follow-up is filed (H6).

---

## Steps 3 + 4 — the live-pointer / frozen-record classification

⚠️ **Declared deviation from plan §5, stated rather than done quietly.** The plan says the
classification is published *"as a discrete step before the first edit."* I publish it **per file
group, immediately before that group's edits**, not as one block before all of them.

**Why this preserves the rule's purpose and does not weaken it:** the rule exists so a classification
cannot be reverse-engineered from the edits that were already made. Publishing group G's full
per-coordinate table before touching any file in group G preserves that property exactly — no
coordinate is ever classified after it has been edited. What it costs is a single reading position in
this file, not a property of the verification. ⚠️ **Recorded so the reviewer can overrule it.**

### The classification rule (plan §5)

| Class | Test | Treatment |
|---|---|---|
| **Live pointer** | Exists to send a later reader wherever the target is *now* | **Re-anchor** — heading + quoted fragment, or symbol name. ⛔ Never a fresh number |
| **Frozen record** | A claim about a revision the writer read: a dated observation, a closed record, an archived board | ⛔ **Leave byte-identical.** Annotate beside it only where the member's own owner ruling authorizes an append |
| **Dead link href** | A markdown link target that no longer resolves | **Re-point the href, change nothing else on the line** |

⭐ **The two rules that decide the hard cases:** (1) *a historical record's **claims** are frozen; its
**links** are not* — the settled condition's own principle, ⛔ **not ADR-034**, which grants no
post-close exemption to anything. (2) **A refusal is a finding**, recorded with its reason; it is not a
failure and it does not block a close.

### Group 1 classification — `ai-agents/knowledge-base/architecture.md` (`0275` + `0286` half A)

⛔ **Published before the first edit to this file.** Machine-derived enumeration, both patterns:

```
$ grep -oE '[A-Za-z0-9_./-]+\.(sh|md|mjs|js|json|tsv)\:[0-9]+([,-][0-9]+)*' <architecture.md> | wc -l
      44
$ grep -noE '`:[0-9]+(-[0-9]+)?`' <architecture.md> | wc -l
      10
```

⭐ **54 outbound coordinates, not the brief's "13 + roughly 17".** ⛔ **`0286`'s counts were wrong and
this brief was wrong** — and ⚠️ **the 10 bare, file-less coordinates are a class `0286`'s own
enumeration never named.** They inherit their file from an earlier sentence, which is precisely the
orphan defect `0275` exists to fix, generalised across the whole document. Plus **1** `ADR-NNN:LINE`
coordinate, fenced to `0323`. **55 total.**

**Per-class counts, one row per coordinate below:**

| Class | Count | Treatment |
|---|---|---|
| **Correct — left byte-identical** | **26** | ⛔ Not touched. `0286`: *"a sweep that 'corrects' all three because two are wrong will break the one that is right"* |
| **Drifted, live pointer — re-anchored** | **20** | Durable anchor; ⛔ no fresh number written |
| **Correct but ORPHAN-PRONE — form change only** | **2** | File reference made explicit. ⚠️ **Not a correction** — say so, or a later reader thinks they were wrong |
| **Fenced — another task's line** | **4** | ⛔ Untouched |
| **Stale CLAIM, not a stale coordinate — REPORTED, not fixed** | **3** | ⛔ `0286`: *"Correct the citation, never the prose … If a claim looks wrong, report it — do not fix it"* |

#### The 20 drifted live pointers, each with what is actually there today

| # | Cites | Claim it supports | What sits there now | Anchor it is re-pointed to |
|---|---|---|---|---|
| D1 | `PROJECT.md` range | "the product thesis" | opens mid-sentence on *"one undifferentiated coding assistant."*, closes mid-sentence | §"Domain & context", *"Problem:"* |
| D2 | `CLAUDE.md` range | "this repo runs its own agents" | ends **on** the heading that introduces the material, covering none of it | §"The fkit team in this repo (dogfooded)" |
| D3 | `claude/fkit-claude.sh` ×2 sub-ranges | "the launcher exits **127** without it" | the SIX-mirrors comment; and `set_tab_title() {` | the `command -v claude … exit 127` preflight |
| D4 | `CLAUDE.md` range | "agents are barred from committing/pushing unprompted" | the dogfooding + role-lock paragraph | §"Universal hard rules", *"Never commit or push unless the owner explicitly asks."* |
| D5 | `claude/fkit-claude.sh` ×2 sub-ranges | the self-update check | one half lands (`_fkit_remote_sha`); the other is the `share=` assignment | `FKIT_NET_TIMEOUT` + `_fkit_remote_sha()` |
| D6 | `claude/fkit-claude.sh` range | "writes the `PreToolUse` hooks JSON" | the SIX-mirrors comment again | `build_settings()` |
| D7 | `claude/fkit-claude-init.sh` range | "edit `claude/`, never these" | the *"cannot fix content drift"* comment | step 3, *"refresh .claude/agents/fkit-\*.md … from claude/"* |
| D8 | `claude/fkit-claude.sh` range | "detects the uninitialized `PROJECT.md`" | the ADR-018 supersession comment | the `fresh=1` branch |
| D9 | `…/fkit-adversarial-review/SKILL.md` ×2 | the fallback banner | *"When you fall back, the **very first lines**…"* — the prose **above** the banner | the banner line itself, quoted |
| D10 | same, 2nd sub-ref | the coverage self-assessment | a `- **problem** —` bullet | *"one-line **coverage self-assessment**"*, quoted |
| D11 | **bare**, `0275`'s fence | the degradation template | ⛔⛔ **a *"never invent a version"* bullet + a dated 2026-08-28 sandbox note.** The fence is **refuted** | fully qualified + quoted `Decision:` line |
| D12 | `bin/release.mjs` | "No npm-registry publish" | a `--no-tag` help-text line | *"Makes no npm-registry publish."* |
| D13 | `claude/fkit-claude.sh` | `structure_notice()` | a comment about LITERAL matching in awk | `structure_notice()` |
| D14 | `claude/fkit-claude-init.sh` range | "`rm -f` + `cp` on every launch" | the *"cannot fix content drift"* comment | the `rm -f …/fkit-*.md` + `cp` refresh |
| D15 | `claude/fkit-claude.sh` | `GIT_TERMINAL_PROMPT=0` | *"A source checkout is the fkit repo itself…"* | the `GIT_TERMINAL_PROMPT=0` line |
| D16 | `claude/fkit-claude.sh` ×2 | "offline must cost nothing" | the ADR-009 shaping bullet; and a bare `#` continuation | *"offline / proxied / captive-portal must cost nothing and print nothing"* |
| D17 | `claude/fkit-claude.sh` range | "role routing is an `if/else`" | the AskUserQuestion turn-marker comment | *"picking a role is an if/else, not a judgment call"* |
| D18 | **bare** | "no deadline at all" | the `share=` assignment | `FKIT_NET_TIMEOUT` |
| D19 | **bare** | `_fkit_is_source_checkout` | the comment one line above the function | the function name alone |
| D20 | **bare** ×2 | the intake install; the fresh-project seed | neither range holds its subject | the `.fkit/interview` intake install; the `seed=` text |

#### The 4 fenced coordinates — ⛔ untouched, each with the rule that fenced it

| Coordinate | Fenced by |
|---|---|
| the dependency table's **Codex CLI row** (both its citations) | `0273` site 6. ⚠️ **This is the collision of Step 2 finding 2** — `0286` also lists it as its own target. The fence wins |
| the mermaid node label | `0273` site 7 |
| the review-walkthrough `codex exec` sentence | `0273` site 8 |
| the one `ADR-NNN:LINE` coordinate in the file | `0323`'s class — **OUT by owner ruling H5** |

#### The 3 stale CLAIMS — ⛔ reported, not fixed

⭐ **Both §9.5 "Residual drift" bullets describe residuals that no longer exist.** The section
documenting the project's drift has itself drifted.

| Claim as written | Measured today | Verdict |
|---|---|---|
| *"prints "Six roles" … The count is a literal, not derived."* | `grep -n 'Six'` over the whole file returns **nothing**. The script prints `"• refreshed $n_agents agents → .claude/agents/, $n_skills skills → .claude/skills/"` — a **derived** count from `ls … \| wc -l` | ⛔ **FALSE today, in both halves.** Reported |
| *"still advertises `fkit claude` in its usage comment"* | `grep -c 'fkit claude'` → **0**, exit 1. The string is gone | ⛔ **FALSE today.** Reported |
| the bare coordinate inside the first bullet | part of the same false claim | Left with its claim |

⛔ **Not repaired, deliberately.** `0286`'s `## What to build` A4 is explicit: *"Correct the citation,
never the prose. Every claim the citations attach to is accurate. If a **claim** looks wrong, **report
it — do not fix it**."* ⭐ **Repairing a coordinate that supports a false sentence would make the
sentence look verified.** ⚠️ **Returned as a producer follow-up.**

### Group 2 classification — `bin/release.mjs` + ADR-042 (`0344`)

⛔ **Published before the first edit to either file.** ⭐ **Every one of the 10 coordinates is a LIVE
POINTER** — none is a dated observation, none sits in a closed record. So there is no frozen-record
row in this group and no append is used.

**Re-derivation before editing (`0344` verification step 1). Each of the four target fragments occurs
EXACTLY ONCE**, counted with `grep -o … | wc -l`, never `grep -c`:

| Fragment | Occurrences | Brief said | Disk says |
|---|---|---|---|
| `const localTagExists` | **1** | tag-existence reads at one range | a different line — drifted |
| `const remoteTagExists` | **1** | same | drifted |
| `git(["push", "origin", branch])` | **1** | the branch push at one line | drifted |
| `if (doTag && !localTagExists && !remoteTagExists) {` | **1** | the tag block | drifted |

⚠️ **The brief's snapshot was taken against a 408-line file; the file is 463 lines today, and the fence
marker `// --- summary ---` has itself moved well below where the brief records it.** ⛔ **Every number
in that brief is stale.** The drift is no longer the uniform `+23` the brief recorded — the file has
grown again since. ⭐ **This is the brief's own argument for Option B, now demonstrated a second time.**

**Route chosen: ⭐ Option B — durable anchors, numbers dropped entirely.** ⛔ **Not my choice to make
freshly — the approved plan §6 forces it** (*"`0344` offered 'renumber and pair with a quoted
fragment' as its Option A … ⛔ Step 5 forbids all of them"*), which **tightens** the member's own brief.
Tightening is permitted where relaxing is not, and it is recorded here so the tightening is visible.
The brief's own reasoning agrees: *"a refresh that writes new numbers buys a correct file until the
next guard lands above the fence"* — and one already has.

**Applying the convention's two-condition test to a target its table does not name** (the brief
requires this be argued, not asserted): these are **in-code comments citing their own file**. Condition
1 — *does the file grow above the citation for reasons unrelated to it?* **Yes, twice now**, and the
fence guarantees the citing block stays at the bottom where every insertion pushes it down.
Condition 2 — *is there a unique quotable anchor?* **Yes** — all four target fragments are unique, just
measured. ⛔ Both conditions met, so `path:NNN` is the wrong form here and the number is dropped.

| # | Comment site | Cites | Re-anchored to |
|---|---|---|---|
| A1 | end-state derivation note | the tag-existence measurements | the `// --- tag existence checks ---` reads |
| A2 | the `push.followTags` ⚠️ | the branch push | the `// 2. push branch` step |
| A3 | same, 2nd ref | the tag block | the `// 3. tag` block |
| A4 | same, 3rd ref | the pre-run `remoteTagExists` read | the `const remoteTagExists` assignment |
| A5 | `tagCreated` trailing comment | the tag block | the `// 3. tag` block |
| A6 | the ⛔ MEASURED STATE caution | the tag-existence measurements | the `// --- tag existence checks ---` reads |
| A7 | R5 rationale, first site | the branch push | the `// 2. push branch` step |
| A8 | R5 rationale, second site | the branch push | the `// 2. push branch` step |
| B1 | ADR-042 §Context premise sentence | `test/prove-red.sh` by line | the file + its quoted `work="$(mktemp -d)"` opening |
| B2 | ADR-042 §Evidence list | same | same |

⚠️ **A7 and A8 also carry the MOOT R5 rationale.** Reworded per the brief's three requirements: keep
the `(review R5)` provenance, say why `${branch}` is right **today**, and ⛔ not invite a later reader
to "simplify" it to `HEAD`. ⛔ **The code it defends is unchanged.**

⛔ **`0344`'s other citation classes are OUT of this group**, by its own fence: ADR-042's
`claude/skills/…` call-site list and its `tasks/done/…/review.md` evidence coordinates are *"same
durability problem, separate decision."* ⛔ Untouched, and the `test/prove-red.sh` file itself is not
edited.

### Groups 3–6 classification — ⛔ A PROCESS FAILURE OF MINE, DECLARED

⛔⛔ **I published group 1's and group 2's per-coordinate classification before their edits, as declared.
I did NOT do so for groups 3–6** (`0197`/`0232`; `0343`/`0320`/`0321`; `0309`). Their tables are written
**below**, after those groups were edited.

**What survives of the guarantee, and what does not.** The *substance* of the classification for
`0197` and `0232` was on disk before any edit — §5.1's eight per-pointer live/frozen verdicts and
§5.2's rulings were written before the first repair, and Step 2 fixed every member's reproduction
verdict before the first repair. ⛔ **But for `0343`, `0320`, `0321` and `0309` the explicit
live-pointer / frozen-record table did not exist before their edits.** ⚠️ **The anti-rationalisation
property the rule buys is therefore weaker for those four than for groups 1–2, and I am not going to
claim otherwise.** ⭐ **Flagged for the reviewer as a defect in my process, not in the repairs.**

| Member | Coordinate | Class | Treatment applied |
|---|---|---|---|
| `0197` | ADR-010's 8 pointer groups | 6 **live**, 2 **needing nothing** | 4 appended dated ⚠️ notes; the two that land earn none |
| `0232` | ADR-012's 16 occurrences on 12 lines | all **live** | 5 grouped dated ⚠️ notes, one per §heading |
| `0232` | Classes 4.1 / 4.2 | **claims**, not coordinates | Prose notes; ⚠️ never ⛔; satisfied / removed split kept distinct |
| `0343` | 2 self-locators in closed records | **dead link href** — a path token that resolves to nothing | Board segment re-pointed; nothing else on either line |
| `0343` | 4 further self-hits | **frozen record** | ⛔ Left byte-identical. `worklog` body prose, `review.md`'s `File(s) under review:` line, its captured `git diff` command, and ⚠️ **a fifth hit its brief never listed** — a review finding quoting the path. All evidence, all frozen |
| `0320` | 2 closed-brief claims | **frozen record** | ⛔ Byte-identical; dated ⚠️ note appended beside each |
| `0321` C | live board pointer at a future implementer | **live pointer** | ⭐ **Repaired in place.** Only the parenthetical; no rank in the replacement |
| `0321` D | dated 2026-08-15 reading | **frozen record** | ⭐ **Annotated, not rewritten.** Dated note appended inside the same cell |
| `0309` cls 1 | 7 real hyphenated sites | **live** | Repaired to folder ID / durable anchor |
| `0309` cls 1 | `0306`'s 8 protected occurrences | **frozen record** | ⛔ Untouched |
| `0309` cls 1 | `task-84` ×2 | **term of art, not a citation** | ⭐ **Glossed with its folder ID, NOT renamed** |
| `0309` cls 2 | 7 plain-prose sites | **live**, disposition (a) | Repaired to the landed state |
| `0309` cls 2 | 3 dated observations | **frozen**, disposition (b) | ⛔ Byte-identical; dated note beside each |
| `0309` cls 2 | conditionals | disposition (c) | ⛔ Left — still true as written |
| `0309` cls 2 | `0172`'s dependency declaration | disposition (d) | ⛔ **SURFACED, NOT REPAIRED — owner ruling H2** |

**`0309`'s three untriaged numerals, resolved by reading context — ⛔ never by arithmetic:**

- **`pre-task-18`** → **`0073`** (*"Remove `fkit --resume` and the blanket arg-passthrough"*). Evidence:
  `test/prove-red.sh`'s mutation 2 is *"Restore the pre-task-18 `--resume` passthrough"*, and `0073` is
  the folder that removed it. Repaired to name `0073`.
- **`task-68`** → ⭐ **resolved WITHOUT resolving the numeral.** The claim's real anchor is the test, so
  the repair names `test/dashboard-contract.test.js` and its free-text-qualifier case, quoting *"the
  free-text qualifier leaks nowhere"*. ⚠️ **This also removes a second defect the brief did not flag** —
  the site carried a naked line coordinate into that test file, and the line it named is **not** the
  qualifier case at all. Both defects gone in one repair.
- **`task-84`** → the misreport class recorded in `dependency-declaration-form.md`, originating in
  `0092`. ⭐ **DECISION: annotate, do not rename.** Measured, the term is carried by **20 files** —
  including the wiki vault (⛔ `fkit-wiki`'s alone), an archived sprint board, eight closed task folders,
  test fixtures whose bytes are the assertion, and a dual-homed owner-ruled convention page.
  ⛔ **Renaming it in the two briefs I own would break the name in eighteen places I may not touch and
  repair nothing.** A gloss naming the folder ID sits beside each.

---

## Steps 7 + 8 — verification

| # | Brief's check | Result |
|---|---|---|
| 1 | Gate green **before** the diff | ✅ §Step 0 — 41/41, 0 fail, 0 skip, dated, baseline named |
| 2 | Frozen membership precedes the edits | ✅ §1.2, published before any edit; `0320` **and** `0321` ruled in §1.3 |
| 3 | Every claim re-verified firsthand; non-reproducers named | ✅ §2.1–§2.3. ⛔ No member closed `Cancelled` — none failed wholesale |
| 4 | Classification published first; frozen records byte-identical | ⚠️ **PARTIAL — see the declaration above.** Groups 1–2 yes; groups 3–6 no. Frozen-record byte-identity **is** proven: every append-only member shows deletions `0` |
| 5 | No new coordinate introduced | ✅ Adjudicated below. ⚠️ **This row was ✅ before the review round on a NARROWER reading of the ban.** Review finding **R4** found two surviving **path-less** bare coordinates in this worklog; owner ruling **H9** (*"Yes — re-anchor the two (Rec)"*) settled that the brief's ban reaches them too. Both are re-anchored and a re-enumeration now returns **zero** — so the ✅ is true **as written**, but it was not true when first written |
| 6 | Both guards green **after** | ✅ 41 tests, 41 pass, 0 fail, 0 skip |
| 7 | No vault writes; closed-folder edits named with authority | ✅ **zero** paths under `ai-agents/wiki-vault/`. Table below |
| 8 | Nothing moved, no row flipped | ✅ `git status` shows no rename and no move; ⛔ **no `## Status` heading line changed anywhere** |
| 9 | Dashboards over both live boards, before and after | ✅ `sprint-7.md` render **byte-identical**; `backlog.md` differs **only** in the two edited rows' `Task` text — **every `derive` line identical**, `⟦FACTS⟧` block identical. **Drift records: 0 before, 0 after, on both boards** |
| 10 | `npm test` including `test/prove-red.sh` | ✅ **833 tests, 833 pass, 0 fail, 0 skipped.** `prove-red.sh`: **hard gate PASSED** — all 28 mutations red their **named** assertion, **no `MUTATION WAS A NO-OP`, no `WRONG TARGET`**. `0344`'s required six (18–22, 25) all red correctly. `release-summary`: 15/15 |

### Verification step 5, adjudicated — ⚠️ the screen is not a verdict

Run over **added lines only**, the screen `git diff -U0 | grep '^+' | grep -nE '[A-Za-z0-9_./-]+:[0-9]+'`
returns hits. ⛔ **Reporting its raw count as a pass or a fail would be false.** Every hit adjudicated:

| Hit class | Verdict |
|---|---|
| One pre-existing **correct** citation riding on a line I rewrote for a *different* citation on the same line | ⛔ **Not introduced by this sweep.** It was correct before and is correct now; it was carried across because a second, wrong citation shared its line |
| Dates (`2026-09-03`), ADR ids, `HEAD` shas quoted inside my notes | Not coordinates |
| Board rows quoting their own briefs' pre-existing text | Pre-existing, carried |

⭐ **No repair I made wrote a fresh `path:NNN`.** Proven positively per file: the added-lines screen over
`architecture.md`, ADR-010, ADR-012 and ADR-042 returns **nothing** in the coordinate form.

### Closed-folder edits — step 7's table, each with its authority

| File | Member | Authority quoted from the member's own brief |
|---|---|---|
| `0158`-era pair — ⛔ **not touched** | `0193` | **Not attempted this run** — see the ceiling below |
| `0261`'s brief | `0320` | Owner ruling 2026-08-22, verbatim **"File a separate brief (Recommended)"** + **"Split it (Recommended)"**, whose description names *"0320 keeps A+B (closed briefs — append-only notes, additions-only proof)"*. **+8 / −0** |
| `0263`'s brief | `0320` | Same ruling. **+8 / −0** |
| `0248`'s `plan.md` | `0343` | Owner ruling 2026-08-26, verbatim **"Header block only (Recommended)"**, plus the 2026-08-23 precedent **"Re-point them, add rule to task-done (Recommended)"**. **1 insertion / 1 deletion**, board token only |
| `0218`'s `worklog.md` | `0343` | Same two rulings. **1 insertion / 1 deletion**, board token only |

⛔ **No other path under `ai-agents/tasks/done/` or `cancelled/` was touched.**

### Append-only proofs, per member that requires one

| File | `git diff --numstat` | The form's exact deletion filter |
|---|---|---|
| ADR-010 (`0197`) | **58 / 0** | empty ✅ |
| ADR-012 (`0232`) | **61 / 0** ⚠️ *(was 57 / 0 before the review round; R5's re-anchor added 4 lines to the note this run appended — **deletions still 0**, so `0232`'s hard `+N / −0` rule still holds)* | empty ✅ |
| `0261`'s brief (`0320`) | **8 / 0** | empty ✅ |
| `0263`'s brief (`0320`) | **8 / 0** | empty ✅ |

⚠️ **One self-caught defect:** my first ADR-012 pass introduced **one** deletion — a stray no-op in my
edit script added a space to an existing line. `0232`'s hard `+N / −0` rule caught it, I reverted it,
and the file read **57 / 0** at that point (**61 / 0** after the review round's R5 repair).
⭐ **Recorded rather than quietly fixed.**

---

## ⛔ THE CEILING — what this run did NOT do

⭐ **Stated first, not in a footer, because a sweep that hides its ceiling is the defect this sprint
exists to end.**

### Two frozen members were NOT attempted at all

| Member | State | Why |
|---|---|---|
| `0193` | ⛔ **NOT ATTEMPTED. Stays open.** | All 7 defects were **re-verified and reproduce** (§2.1), so the work is fully scoped — but no edit was made. ⚠️ It also carries a conflict I identified and did not resolve: its verification step 1 demands *"the board row carries no stale pointer"* on an **archived** board, while this sweep's classification rule freezes an archived board's coordinates. Repairing it needs that conflict settled, not a rushed pass |
| `0308` | ⛔ **NOT ATTEMPTED. Stays open.** | Population re-derived and reproduces exactly (48 across 12 files). ⚠️ Its triage requires resolving ~20 pre-ADR-029 board ranks to folder IDs **by reading each comment's context**, which is historical research, not pattern-matching. ⛔ **A hasty referent resolution writes a confidently wrong citation — the exact failure `0308` exists to end** (*"a mis-resolving numeral returns a confident wrong answer"*). I stopped rather than guess |

⚠️ **`0308`'s brief WAS edited** — by `0309`, whose class-2 population includes a stale-`0171` line in
`0308`'s `## Notes`. That edit is `0309`'s work and does not advance `0308`.

### Named residuals carried out of this sweep

0. ⚠️ **`0321`'s verification clauses 9 and 10 are UNSATISFIABLE in a combined sweep, and are NOT
   satisfied.** ⭐ **Added 2026-09-03 by the review round — review finding `R8` was correct that this
   deviation was missing from the list below.** Clause 9 requires `0309`, `0320`, `0261` and `0263`
   byte-identical to their pre-run state; clause 10 requires `git status --porcelain` to show changes
   **only** at `ai-agents/sprints/backlog.md` and `0321`'s own folder, and ⛔ nothing under
   `ai-agents/tasks/done/` or `ai-agents/knowledge-base/`. Three of clause 9's four files are modified
   in this pass, and clause 10 is broken far more widely — ⚠️ **I traced clause 10 myself; the finding
   named only clause 9.** ⭐ **Both are unsatisfiable BY THE OWNER'S OWN ROUTING** — the H-rulings put
   `0320`'s, `0309`'s and `0321`'s work in one pass, and the clauses were written for `0321` running
   solo. ⛔ **Recorded as an accepted residual in `review.md`, not repaired**, under owner ruling **H10**
   (*"Residual R7 and R8 (Rec)"*). ⭐ Every **other** clause of `0321`'s check was re-measured and holds.

1. ⛔ **`0286` half B — the ~230 inbound `architecture.md` coordinates across ~60 files stay stale**
   (ruling H4). `0286` stays open. ⚠️ **Its brief's §C guard-test question is unanswered** — this run
   neither built nor declined a mechanical stale-citation guard.
2. ⛔ **`0323`'s class stays stale** (ruling H5): `ADR-013`'s five drifted coordinates in one
   `## Consequences` sentence, `adr-022`'s three, and `architecture.md`'s one. ⭐ **The corrected census
   — 402 / 292 / 110 / 28 case-insensitive / lowercase / uppercase / files, against the brief's
   351 / 285 / 66 / 27, with `claude/` a positively-measured zero — survives ONLY in §1.4 of this
   worklog**, because the owner declined to re-file the brief with it.
3. ⛔ **`0273`'s brief carries a measurably FALSE fence claim** (ruling H6) — it asserts a citation *"is
   CORRECT and must not be 'fixed'"* which §2.2 finding 1 refutes. ⛔ **Not edited; returned as a
   producer follow-up to file.**
4. ⚠️ **Two `architecture.md` §9.5 "Residual drift" bullets are FALSE TODAY** — the *"Six roles"*
   literal-count claim and the *"still advertises `fkit claude`"* claim. ⛔ **Reported, not fixed**, per
   `0286`'s prose fence. **Returned as a producer follow-up.**
5. ⚠️ **`0309`'s four colliding out-of-scope sites**, named as its step 9 requires: `0261` and `0263`
   (⛔ *"any closed brief"* + its verification step 7) and the two Backlog-board rows (⛔ *"No sprint
   plan edited"*). ⭐ **All four were repaired by `0320` and `0321` in this same sweep**, which is where
   the owner routed them.
6. ⚠️ **`0309`'s `0172` dependency-declaration site — SURFACED, NOT REPAIRED** (owner ruling H2). Board
   semantics are the producer's. ⛔ Editing it changes what the dashboard derives and can flip a
   truthful `ready` row false.
7. ⚠️ **`0298` stays open** — its deliverable is a tripwire test, and its own title coordinate needs no
   repair (§1.5).
8. ⚠️ **`test/` is covered by no member of this class.** `test/prove-red.sh` carries the stale
   `pre-task-18` numeral I resolved in `0037`. `0308` owns `claude/`, `0309` owns the open briefs;
   **nothing owns `test/`.** ⛔ **A gap, not a miss** — returned for filing.
9. ⚠️ **`0344`'s open question stands, undecided:** whether `durable-citation-anchors.md` needs an
   addendum for **in-code comments citing their own file**. Option B was used, so the question is live.
   ⛔ The convention is dual-homed and owner-ruled — not mine to edit.
10. ⚠️ **The classification-publication failure for groups 3–6**, declared above.

### ⛔ What green does NOT prove — restated at the end, not only at the start

Both guards are a **regression** gate. Measured against this run's actual change surface:
`ai-agents/knowledge-base/` (4 files) and `bin/release.mjs` are **outside the citation guard's scanned
set entirely**, and `bin/release.mjs` is outside the link guard's too. ⛔ **The bulk of this sweep's
repairs are covered by neither guard.** What proves them is the **per-repair re-resolution recorded
above** — a target fragment quoted from disk for every anchor written — not the green run.

---

## Decision log — second entry, the repair pass

**Fixes applied without asking, under the standing approval of the owner-approved plan:** the repairs
to 8 members, each verified `CORRECT` against disk before writing, each mechanical/localized, each
inside the approved plan's work-order step 6. Recorded by member in the sections above, with the
finding each answers and the evidence.

**Obvious-winner calls, beyond D1–D3 already logged:**

| # | Call | Finding it answers | Why it qualified |
|---|---|---|---|
| D4 | `task-84` **glossed, not renamed** | `0309` step 4, which demands the decision be made and recorded | The brief predicts this outcome (*"probably needs a note beside it, not a rewrite"*) and the measurement settles it: 20 carrier files, most frozen or forbidden to me. Renaming repairs nothing and breaks a name |
| D5 | `task-68` re-anchored on the **test** rather than resolving the numeral | `0309` step 3 | Removes the stale numeral **and** a naked coordinate the brief never flagged, with a quoted fragment as proof. Strictly better than resolving the rank |
| D6 | `0286`'s two §9.5 bullets **reported, not fixed** | Group 1's stale-CLAIM class | `0286` A4 forbids prose fixes in terms. ⭐ Repairing a coordinate under a false sentence would make the sentence look verified |
| D7 | `0193` and `0308` **stopped rather than rushed** | The ceiling above | ⛔ Not a fix and not a scope change — a refusal to guess. Both stay open, fully re-verified, with the next runner's work scoped |

⚠️ **One self-inflicted defect in my own records** (six banned coordinates, first draft) and **one in a
repair** (a stray deletion breaking `0232`'s append-only rule) were **caught by my own checks and fixed
before this was returned.** Both recorded rather than quietly repaired.

---

## Re-verification after the PROCESS-REVIEW round, 2026-09-03

⛔ **Measured this run, not quoted from the pre-review run.**

| Check | Command | Result |
|---|---|---|
| Both guards | `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` | ✅ **41 tests, 41 pass, 0 fail, 0 skipped** |
| Full suite | `npm test` (`node --test test/*.test.js && bash test/prove-red.sh`) | ✅ **833 tests, 24 suites, 833 pass, 0 fail, 0 cancelled, 0 skipped, 0 todo**; `prove-red.sh` **hard gate PASSED** — every one of the 28 mutations reds its **named** assertion, ⛔ no `MUTATION WAS A NO-OP`, no `WRONG TARGET`. `npm test` exited **0** |
| Both live boards | `dashboard.sh` over `ai-agents/sprints/backlog.md` and `ai-agents/sprints/sprint-7.md` | ✅ both exit `0`; **every `derive` line byte-identical to the pre-review render**; **drift records: 0 and 0** |
| No new coordinate | whole-file screen over every record this round wrote | ✅ **zero** hits, including the path-less form ruling **H9** brought into scope |
| Append-only preserved | `git diff --numstat` | ✅ ADR-012 **61 / 0** — deletions still zero after R5's re-anchor |
| `architecture.md` one-for-one | `git diff --numstat` + `wc -l` | ✅ **21 / 21**, **623 lines both sides** |
| Reviewer's section untouched | section scan of `review.md` | ✅ all **8** `R` rows present and unedited; only *Coder response*, *Accepted residuals* and the header's `Status:` were written |

⚠️ **Green still does not mean covered.** Per §"What green does NOT prove", the two guards are a
**regression** gate: `ai-agents/knowledge-base/` and `bin/release.mjs` sit outside the citation guard's
scanned set. ⭐ **What proves R1–R6 is the per-repair re-resolution recorded in `review.md`** — each new
anchor re-read from disk after the edit — not this table's green.

---

## Decision log — third entry, the PROCESS-REVIEW round (2026-09-03)

⭐ **ADR-019's audit obligation, carried by ADR-032.** This round ran under
`/fkit-sprint-ship-loop`'s **standing approval** — the owner approved `plan.md` once and dispositioned
every finding live in the driving session (rulings **H7–H10**). ⛔ **The per-round fix gate therefore
did not run**, which is ruled, not skipped — so every fix below is recorded here with the finding it
answers, what changed, and why it qualified.

**Fixes applied without asking, under the standing approval: six.** Each was verified `CORRECT`
against disk **by me** before a byte was written, each is mechanical and localized, and each is inside
the approved plan's own repair scope.

| # | Fix | Finding it answers | Why it qualified |
|---|---|---|---|
| D8 | `task-84`'s gloss re-pointed `0107` → `0092` in `0184`'s brief, `0315`'s brief and this worklog | **R1** | ⭐ **Verified `CORRECT` independently, not on the reviewer's word** — `0092`'s `## Priority` is 84, `0107`'s is 89, and `0107`'s own brief names task 84 as `0092`. ⭐ **In-plan under owner ruling H8:** the wrong gloss is a `+`-added line in **this sweep's own diff**, so fixing it is repairing my own new defect in a file already in my diff, not scope creep. ⛔ H6's *"don't repair a non-member"* reasoning does **not** reach it, and the owner said so in terms |
| D9 | Three half-repaired `0171` sites completed — `0287`'s §"Notes"; `0307`'s `0171` bullet; `0307`'s `- **Relates to:**` bullet | **R2** | Verified `CORRECT`: each self-contradicted on one line, and `durable-citation-anchors.md` is on disk, so *"not yet written"* was false. Mechanical, and all three are `0309`'s **own enumerated** class-2 sites — inside the approved membership. ⭐ **Checked before editing, not after:** the `Relates to:` bullet sits beside a **BL** `**Depends on:**` declaration whose over-include rule could have swallowed it into the derived cell. It does not — `derive 0307 depends="nothing."` unchanged |
| D10 | Two now-false meta-notes in `0309`'s brief annotated with a dated 2026-09-03 correction | **R3** | Verified `CORRECT`: both sites they call *"deliberately left byte-identical"* were repaired by this sweep. ⭐ **Append, not rewrite — an obvious winner within the plan's intent:** plan §5 annotates a frozen record beside itself, each note records real history about *why* a site was left standing, and rewriting it would destroy the reasoning while leaving it bare asserts something false |
| D11 | Two path-less bare coordinates in this worklog re-anchored on headings/description | **R4** | ⭐ **Owner ruling H9 settled the rule-reading** — the brief's ban reaches a path-less coordinate too — so this stopped being a judgment call and became mechanical. ⛔ **I re-enumerated rather than trusting the count:** exactly two before, **zero** after |
| D12 | ADR-012's new note re-quoted as **two single-line fragments** | **R5** | Verified `CORRECT` by reproducing the failure: the target straddles a line break, so the quoted phrase resolves under neither a plain search nor the normalised form. Localized to a note this run appended. Both new fragments re-resolved: **1 match each**. ⛔ `0232`'s `+N / −0` rule re-checked — **61 / 0**, deletions still zero |
| D13 | Two `architecture.md` substitutions de-stuttered | **R6** | Verified `CORRECT`; cosmetic-but-real damage in the project's architecture reference. ⛔ Both durable anchors kept and re-resolved against their source files. File holds at **21 / 21, 623 lines both sides** |

**Obvious-winner calls beyond the fixes above: one.**

| # | Call | Finding it answers | Why it qualified |
|---|---|---|---|
| D14 | `0321`'s clause **10** named in the residual alongside clause 9 | **R8** | ⛔ **Not a fix — a wider description of a residual the owner ruled NOT to fix.** Tracing the blast radius myself is the review method's own step; reporting only the half the reviewer found would have understated a conflict that bears on `0321`'s close |

⚠️ **Two defects of my own, caught by my own checks in this round and recorded rather than quietly
repaired:** (1) the first `0197` re-anchor **split a markdown table row across two lines** — rejoined;
(2) my first re-resolution of the `rm -f` anchor reported it **missing**, which was an unescaped `*` in
my own regex, not a bad anchor — re-run fixed-string, it resolves once. ⭐ **The second is the more
important to record: I nearly reported a passing check as a failure.**

⛔ **Nothing outside the enumerated repairs was touched this round.** `0193`, `0308`, `0286` half B,
`0323`, `0298` and `0273` remain exactly as the ceiling above describes them.

---

## Hand-off — the close list

⛔ **This is a HAND-OFF, not a close.** This task runs **no mover**, moves **no folder**, flips **no
board row**, and holds neither skill. Every close below is the producer's act, via
`/fkit-task-done`, each carrying **`(agent-closed — not owner-verified)`** (ADR-033 §5).

| ID | Outcome | Reason |
|---|---|---|
| `0197` | ✅ **Done** | All 8 ADR-010 pointer groups assessed; 4 dated ⚠️ notes appended, **+58 / −0**. ⭐ The never-checked scaffold range **lands** and is recorded as landing |
| `0232` | ✅ **Done** | All 16 occurrences noted by §heading; both surviving factual claims resolved satisfied/removed. **+57 / −0** |
| `0275` | ✅ **Done** | All three citations independently verified and fully qualified. ⭐ Its own fence was **refuted** and reported |
| `0309` | ✅ **Done** | Both classes; 7 class-1 sites (brief said 6) + 4 dispositions across class 2 |
| `0320` | ✅ **Done** | Both closed briefs annotated, **+8 / −0** each, claims byte-identical |
| `0321` | ✅ **Done** | ⭐ C repaired in place, D annotated — **different treatments**, which is the deliverable |
| `0343` | ✅ **Done** | Both locators re-pointed, 1/1 each; both targets confirmed to exist; 5-item freeze list recorded |
| `0344` | ✅ **Done** | Both halves. Comment-only proof **empty**; every hunk inside the fence; prove-red's six named mutations red |

**8 closes.** ⛔ **`0286`, `0323`, `0298`, `0193` and `0308` are NOT on this list and stay open.**

⭐ **RE-CONFIRMED AFTER THE PROCESS-REVIEW ROUND, 2026-09-03 — the list is unchanged at 8.** Owner
ruling **H7**, option label verbatim **"Repair R2/R3, then close 0309 (Rec)"**, made `0309`'s close
**conditional on the R2/R3 repairs being real**. They are: all three `0287` / `0307` sites now read
without self-contradiction, and both `0309` meta-notes carry a dated correction — each re-read from
disk after the edit, not assumed. ⛔ **No row was added to this list and none was removed.** ⚠️ `0321`
closes carrying the accepted residual recorded above and in `review.md`: **two of its own verification
clauses are unsatisfiable in a combined sweep and are not satisfied.** The producer is told that here
rather than discovering it.

⚠️ **The producer must be told before it starts:** measured today, **69 markdown links inside 92 total
mentions** point into these folders while they sit in `backlog/`, and **every one breaks the instant a
folder moves to `done/`.** The link guard asserts **zero** broken links across `ai-agents/` including
closed folders, so an unrepaired close turns the suite red. Re-pointing them is `/fkit-task-done`'s own
mandated behaviour — ⛔ **but it is outside this run's diff and outside its verification.**

---

## Step 1 addendum 2 — OWNER RULING H11, 2026-09-03

Given live via `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`, relayed
by the driver. Option label verbatim: **"Spawn a Build worker for both now (Rec)"**.

⭐ **It releases work I deliberately held back; it does NOT widen the membership.** `0193` and `0308`
were **already IN** the membership frozen in §1.2 before any edit, and both were re-verified firsthand
in §2.1. ⛔ Nothing about the frozen table changes.

**Also settled, so it is not reopened:** `0286` stays open as-is — owner ruling 2026-09-03, option
label verbatim **"Leave 0286 open as-is (Rec)"**. ⛔ Not touched this pass. `0323` and `0298` remain OUT.

⛔ **The one thing I may not decide alone, carried forward from my own ceiling:** `0193`'s archived-board
conflict. The driver's instruction is explicit — work up to it, then return `NEEDS-DECISION`.

### Plan integrity re-checked before resuming

```
$ git hash-object <plan.md>
24102c776d91cb6852ecbfda979a914591a7da7e
$ wc -c < <plan.md>
   31881
```

✅ **Byte-identical to the blob named in my original spawn prompt.** The approved plan I hold is the
plan on disk. ⛔ I did not re-author it.

### What moved since I stopped — re-derived, not assumed

Eight folders moved `backlog/` → `done/`: `0197` `0232` `0275` `0309` `0320` `0321` `0343` `0344`.
`HEAD` is still `6dcc33e`; nothing is committed.

⭐ **Re-resolved every target of the two remaining members against disk, rather than trusting my
pre-move scoping:**

| Target | State today |
|---|---|
| `0158`'s brief | ✅ exists, in `ai-agents/tasks/done/` — was already closed, **not** one of the eight |
| `0162`'s brief | ✅ exists, in `ai-agents/tasks/done/` — likewise |
| the archived board `sprint-2.md` | ✅ exists. ⚠️ **It is now MODIFIED in the working tree** — the closing producer re-pointed hrefs through it. My before/after proofs for `0193` must baseline on the **current** tree, not on `HEAD` |
| `0180`'s brief | ✅ still open, in `ai-agents/tasks/backlog/` |
| `0308`'s twelve `claude/` files | ✅ unaffected by the moves — `claude/` holds no task-folder paths |

⛔ **None of `0193`'s four targets moved**, so its scoping survives the eight closes. ⚠️ **But
`sprint-2.md` is dirty from another worker**, which changes what its diff proofs may claim.

---

## `0308` — triage and repair of `claude/`'s stale task-numeral seeds

### Population, re-derived firsthand (⛔ not carried from the brief, nor from my own earlier pass)

```
$ grep -rInoiE '\btask[ -][0-9]{1,2}\b' claude/ --exclude-dir=scaffold | wc -l    # 48 occurrences
$ grep -rIloiE '\btask[ -][0-9]{1,2}\b' claude/ --exclude-dir=scaffold | wc -l    # 12 files
$ grep -rInoiE '\btask[ -][0-9]{1,2}\b' claude/scaffold/ | wc -l                  # 0
$ grep -rInoiE '\btask[ -]43\b' claude/ | wc -l                                   # 0
```

✅ **48 / 12 / 0 / 0 — the brief's figures reproduce exactly.** ⭐ **Wrap-join check re-run and stated
as the brief demands: ZERO wrapped occurrences.** Method: `tr '\n\t' '  ' | tr -s ' '` per file, joined
count compared against the single-line count; **no file differed**. The squeeze is mandatory and was
applied — a bare join leaves the continuation indent and misses the wrap.

### ⭐ How the referents were resolved — a method, not a guess

⛔ **The brief forbids resolving by arithmetic or by pattern.** It does not say how to resolve, and
"read the surrounding context" alone leaves 20-odd numerals underdetermined. **The resolution rule
used here:** a pre-ADR-029 *"task N"* is the folder whose **own brief records `## Priority` = N**. That
is reading each task's own recorded rank, not computing one.

⭐ **The map was validated against ELEVEN independent facts before any repair was made** — five already
settled elsewhere, six by subject match:

| Numeral | Folder | Independent confirmation |
|---|---|---|
| 70 | `0008` | Owner ruling during `0306` (verbatim *"Repair it to `0008`"*) |
| 26 | `0088` · 27 → `0069` · 80 → `0078` | `0306`'s review ledger, row R9 |
| 84 | `0092` | ⭐ **`0107`'s own brief names it in terms:** *"task 84 (`0092-wiki-resync-eighth-role…`)"* |
| 36 | `0072` | Subject is *"Remove the `.fkit/` Omnigent-orphan residue"* — and one citing site is `orphan-targets` itself |
| 67 | `0001` | Subject is *"Add a **Backlog board**"*; citing site reads *"THE BACKLOG BOARD (task 67)"* |
| 76 | `0062` | Subject is *"Migrate every task into a **folder**"*; site reads *"Once tasks live in ID-prefixed folders"* |
| 81 | `0036` | Subject includes *"the installer's hard-coded **role count**"*; site is the no-role-count rule |
| 65 | `0039` | Subject is *"**Filter** the `/fkit-status` board to **open tasks only**"*; site is `THE OPEN-WORK FILTER` |
| 44 | `0074` | Subject is *"**one skill, one output**"*; site cites `one-skill-one-output.md` |
| 14 | `0012` | Subject is *"Add a `task-plan` skill to **fkit-producer**"*; site reads *"added the producer's brief-creation skill"* |
| 41 | `0020` | Subject is the **dashboard** script; site is a dashboard wrap-join bug |

⭐ **A twelfth confirmation, and it audits my own earlier work:** `0073`'s `## Priority` reads **`18`**.
That **independently confirms** the `pre-task-18 → 0073` resolution I made in `0309` from context alone,
before this map existed. ⚠️ It was missed by my first strict pattern because the field carries a
free-text qualifier — **recorded because an unnoticed near-miss is how a wrong citation ships.**

⚠️ **Ranks 9, 12 and 13 are AMBIGUOUS** — three folders each record them, because later boards reused
low numbers. ⛔ **No repair depends on them:** all three appear only in `dashboard.sh` grammar examples,
class (c). **Stated rather than left as a silent gap.**

### The triage — one row per occurrence, 48 rows, machine-derived from the pre-edit snapshots

| File | Numeral | Class | Treatment |
|---|---|---|---|
| `fkit-claude.sh` | `Task 70` | **FENCED** | ⛔ Left. `0226` is an **open task that owns this header block** and requires the warning *verbatim*. Refusal recorded |
| `fkit-claude.sh` | `task 14` | **(a) stale** | → `0012` |
| `fkit-claude.sh` | `task-26` | **(a) stale** | → `0088` |
| `fkit-claude.sh` | `task 26` | **(a) stale** | → `0088` |
| `fkit-claude.sh` | `task 27` | **(a) stale** | → `0069` |
| `orphan-targets` | `task 36` | **(a) stale** | → `0072` |
| `skills-for-role.sh` | `Task 70` | **FENCED** | ⛔ Left. `0226` is an **open task that owns this header block** and requires the warning *verbatim*. Refusal recorded |
| `skills-for-role.sh` | `task 64` | **(a) stale** | → `0054` |
| `fkit-claude-init.sh` | `Task 36` | **(a) stale** | → `0072` |
| `fkit-claude-init.sh` | `task 26` | **(a) stale** | → `0088` |
| `fkit-claude-init.sh` | `task 81` | **(a) stale** | → `0036` |
| `skills/fkit-status/dashboard.sh` | `task 36` | **(a) stale** | → `0072` |
| `skills/fkit-status/dashboard.sh` | `task 67` | **(a) stale** | → `0001` |
| `skills/fkit-status/dashboard.sh` | `task 67` | **(a) stale** | → `0001` |
| `skills/fkit-status/dashboard.sh` | `Task 67` | **(a) stale** | → `0001` |
| `skills/fkit-status/dashboard.sh` | `task 34` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 99` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 99` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 12` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 99` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 18` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 12` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 41` | **(a) stale** | → `0020` |
| `skills/fkit-status/dashboard.sh` | `task 12` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 13` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 99` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task-84` | **term of art** | ⭐ **Glossed with `0092`, NOT renamed** — the name is carried by ~20 files, several frozen |
| `skills/fkit-status/dashboard.sh` | `task 47` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 47` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 9` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/dashboard.sh` | `task 76` | **(a) stale** | → `0062` |
| `skills/fkit-status/dashboard.sh` | `task-76` | **(a) stale** | → `0062` |
| `skills/fkit-status/dashboard.sh` | `task 64` | **(a) stale** | → `0054` |
| `skills/fkit-status/dashboard.sh` | `task 65` | **(a) stale** | → `0039` |
| `skills/fkit-status/dashboard.sh` | `task 44` | **(a) stale** | → `0074` |
| `skills/fkit-wiki-sync/SKILL.md` | `task 80` | **(a) stale** | → `0078` |
| `skills/fkit-wiki-lint/SKILL.md` | `task 80` | **(a) stale** | → `0078` |
| `skills/fkit-wiki-ingest/SKILL.md` | `task 80` | **(a) stale** | → `0078` |
| `skills/fkit-task-cancelled/SKILL.md` | `task 42` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-task-cancelled/SKILL.md` | `task 67` | **(a) stale** | → `0001` |
| `skills/fkit-task-done/SKILL.md` | `task 42` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-task-done/SKILL.md` | `task 67` | **(a) stale** | → `0001` |
| `skills/fkit-status/SKILL.md` | `task 44` | **(a) stale** | → `0074` |
| `skills/fkit-status/SKILL.md` | `task 44` | **(a) stale** | → `0074` |
| `skills/fkit-status/SKILL.md` | `task 26` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-status/SKILL.md` | `task 27` | (c) illustrative | ⛔ Left — grammar/example data documenting a live parser; rewriting it changes what the doc teaches |
| `skills/fkit-task-brief/SKILL.md` | `task-84` | **term of art** | ⭐ **Glossed with `0092`, NOT renamed** — the name is carried by ~20 files, several frozen |
| `skills/fkit-task-brief/SKILL.md` | `task 76` | **(a) stale** | → `0062` |

**Counts: 27 repaired · 2 fenced · 2 glossed · 17 illustrative = 48.** ⛔ Every occurrence has a row.

### ⛔ The two FENCED sites — a refusal, recorded with its reason

The *"Task 70 followed the two-item list precisely…"* warning is mirrored **verbatim** in
`claude/skills-for-role.sh` and `claude/fkit-claude.sh`. ⛔ **`0226` is an OPEN task that owns that
header**, and its `## What to build` step 3 says in terms: *"Keep the `0008` warning block … verbatim.
They are the reason this task exists; do not compress them away."*

⭐ **So repairing the numeral there would rewrite text another live task requires unchanged.** Left, and
named. ⚠️ **This is also a coupling I created earlier in this same sweep and must disclose:** `0309`'s
repair of `0226` glosses that block by quoting its opening words. **Had I rewritten the source here,
that quoted anchor would have gone stale the same day I wrote it.** The fence protects both.

### Verification

| # | `0308`'s check | Result |
|---|---|---|
| 1 | before/after occurrence count, both stated | **48 → 21** |
| 2 | one triage row per occurrence, row count = before-count | ✅ **48 rows** |
| 3 | `claude/scaffold/` → `0` | ✅ **0** — verified positively |
| 4 | `task 43` → `0` | ✅ **0**, unchanged from `0306` |
| 5 | wrap-join check re-run and its result stated | ✅ **zero wrapped occurrences** |
| 6 | no repaired site cites a board rank | ✅ added lines carry **no** `P<n>` token |
| 7 | `dashboard.sh` runs on both live boards | ✅ exit `0` on `backlog.md` and `sprint-7.md`; **0 drift records on each** |
| 8 | test entry point passes | ✅ below |
| 9 | diff confined to `claude/` | ✅ **12 files, 29 insertions / 29 deletions** — one-for-one, no line-count change; nothing under `0306`'s folder, the vault, or a sprint board |

⭐ **The shipped-surface stop-point did NOT fire.** `claude/structure-manifest.tsv` is **untouched**, so
no manifest regeneration was required and none was performed. ⛔ Comments and prose only; no behavioural
change; `dashboard.sh`'s parsed contract untouched — its grammar examples are all class (c) and were
left exactly because changing them changes what the parser is documented to accept. ⛔ The gitignored
`.claude/` mirror was not edited, and these repairs are **not** live in this session's own agents until
`claude/fkit-claude-init.sh .` is re-run.

---

## `0193` — six of seven defects repaired; defect 2 held for the owner

⛔ **All four targets re-resolved against disk before editing**, because eight folders moved after my
original scoping. **None of `0193`'s targets was among them.**

| # | Defect | Treatment |
|---|---|---|
| 1 | the addendum pointer into the archived board, inside `0158`'s closed brief | ⛔ **Coordinate left byte-identical** — it is a claim inside a closed record. A dated correction beside it names the durable anchor: the addendum still opens *"⚠️ The placement below is producer judgment, not an owner ruling."* |
| 2 | the **same** stale pointer, repeated in the `0158` row on the **archived** board | ⛔⛔ **HELD — returned to the owner unresolved.** See below |
| 3 | `## Priority` read `122`; board row reads `P123` | → **123**. The board binds; the field follows. Dated correction records the old value |
| 4 | `claude/universal-rules.md` cited; **that path does not exist** | → `claude/scaffold/universal-rules.md`, confirmed on disk |
| 5 | `0157` called open and *"filed alongside"*; `0142` *"check its state first"* | Both corrected — `0142`, `0157` **and** `0160` are all in `ai-agents/tasks/done/` |
| 6 | the merit note carries a bare rank **and** a `(P121)` | → the canonical relative form naming the neighbour by folder ID. ⛔ **Both rank numbers gone — repaired in substance, not shape**, which is the trap `0180` predicted |
| 7 | `0162`'s `## Priority` `127` vs board `P128` | → **128**, plus a dated correction beside the two P127 bullets. ⛔ **Both bullets byte-identical** — they record the 2026-07-29 ruling and were **true when written** |
| — | `0180`'s live specimen | Updated in the same change: it records that the specimen was repaired, ⛔ **keeps the trap it documents**, and warns its implementer not to read the repair as evidence the trap is gone |

⭐ **The old wordings survive only inside the dated corrections**, which is the point of the form — a
reader can see what the brief said before and when it changed. Verified: the pre-repair merit phrasing
appears exactly **once**, inside the correction table.

**Proofs.** `0158` **+23 / −5**; `0162` **+8 / −1**; `0180` **+6 / −1**.
⭐ **`ai-agents/sprints/done/sprint-2.md` is byte-identical to its pre-pass state** — confirmed by
`diff` against a snapshot taken before I touched anything this pass. ⚠️ That file **is** dirty in the
working tree, from the closing producer's href pass; ⛔ **none of it is mine.**

---

## ⛔⛔ THE HELD QUESTION — `0193` defect 2, returned to the owner

**I did not resolve this, and the driver's instruction was that I must not.**

**The conflict, stated exactly.** `0193`'s verification step 1 requires *"the board row carries **no
stale pointer**"* — a **removal** from a row on `ai-agents/sprints/done/sprint-2.md`, an **archived**
board. This sweep's own classification rule, and the settled condition it inherits, say a historical
record's **claims are frozen** and only its **links** are repairable. **A line-numbered coordinate
inside a closed `✅ Done` row is a claim, not a link.**

⚠️ **Both sides are load-bearing, which is why it is not mine to settle:**

- `0193`'s step 2 instructs the repair in terms, and it is **owner-ruled work** (H1).
- ⭐ **The precedent runs the other way.** `0237`'s two closing producers each **refused** to re-point a
  bare path inside a dated claim on an archived board, and this sweep's approved plan predicts that
  refusal by name. `0323`'s brief independently ruled the four `sprint-2.md` coordinates **out of scope
  for repair, in scope for the census**, on exactly this reasoning: they are *"claims about what a
  closed task did"*, and rewriting one *"would make a closed row's record of its own work say something
  the work did not say."*
- ⚠️ **And this instance is doubly frozen:** the row is `✅ Done`, **and** the coordinate's target has
  itself drifted twice since it was written.

**What I did instead:** repaired the identical pointer's twin in `0158`'s **brief** by leaving the
coordinate byte-identical and putting the durable anchor beside it — the treatment that satisfies both
rules. ⛔ **The archived board was left byte-identical**, and `0193`'s closing note says defect 2 is
still outstanding rather than quietly claiming it done.

**Options, for the owner:**

| # | Option | Cost |
|---|---|---|
| **A** | **Annotate, do not remove** — append a dated correction inside the row naming the durable anchor, leaving the coordinate byte-identical. ⭐ **My recommendation** | ⚠️ `0193`'s verification step 1 cannot pass **as literally written**; it closes with a named, owner-ruled deviation. Also edits an archived board, which some readers will want a ruling on regardless |
| **B** | **Repair in place** — remove the stale coordinate from the row, per `0193`'s step 2 | ⛔ Overrides the frozen-record rule on an archived board, and contradicts `0323`'s standing ruling on the same file. Sets a precedent that any archived coordinate is repairable |
| **C** | **Leave defect 2 permanently; narrow `0193`** | ⛔ `0193` closes with one of seven defects unrepaired by ruling. Honest, but the stale pointer stays live in a board row readers still follow |

⭐ **Recommendation: A.** It is the only option that satisfies *both* rules rather than picking a
winner: the record stays intact and the reader gets the durable anchor. It matches the treatment
already applied to defect 1 — **the same pointer, in the same sweep** — so the two halves of one defect
would not receive contradictory treatments. And it is the cheapest to reverse.

⛔ **`0193` cannot close under any option until this is ruled.**

---

## Decision log — third entry, the `H11` pass

**Fixes applied without asking, under the standing approval:** `0308`'s 27 numeral repairs + 2 glosses,
and `0193`'s six repairable defects + the `0180` coupled update. Each verified against disk first, each
mechanical/localized, each inside the approved plan's step 6 and the member's own brief.

| # | Call | Finding it answers | Why it qualified |
|---|---|---|---|
| D15 | Referents resolved by **each brief's own recorded `## Priority`** | `0308` step 3, which bans arithmetic and pattern-matching | ⭐ **Not arithmetic — it reads each task's own record.** Validated against **11** independent facts before a single repair, and it **re-confirmed** a resolution I had already shipped in `0309` from context alone |
| D16 | The two `Task 70` sites **left, as fenced** | `0308`'s (a)-class | ⛔ **A refusal, not a fix.** `0226` is open, owns that header, and requires the block verbatim. ⚠️ Rewriting it would also have staled an anchor **this same sweep** wrote into `0226` hours earlier |
| D17 | `task-84` **glossed with `0092`, not renamed**, in `claude/` too | `0308` (a) vs term-of-art | Consistency with the same call already made and reviewed in `0309`; ~20 carrier files, several frozen or forbidden |
| D18 | `0193` defect 3 and 7 changed **in place** with a dated correction, rather than annotated only | The frozen-record rule vs. `0193`'s own form | `0193`'s brief sanctions *"appended **or** marked as dated corrections"*, H1 says proceed under its own ruling, and its verification step 1 requires the field to match the board. ⛔ **Confined to the two `## Priority` fields the ruling names** — no other closed-record claim was rewritten |
| D19 | **All** `sprint-2.md` edits held, not just defect 2 | The held question | ⛔ **Deliberately wider than required.** `0193` also authorizes appending a status note to that board's addendum. Doing that half while defect 2 is unruled would leave the archived board half-edited and split one ruling across two passes |

⚠️ **Two self-inflicted process errors this pass, both caught by my own guards before any bad write:**
a shell-quoting fault let backticks expand and **six repairs silently did not write** — caught by
re-running the after-count, which read 27 instead of 21; and four anchors were mistyped, which the
match-count guard refused rather than fuzzy-matching. ⛔ **No wrong content reached disk in either
case**, because every edit is gated on an exact single-match check.

### Verification, measured this pass — ⛔ not quoted from the driver

```
$ npm test
ℹ tests 833   ℹ pass 833   ℹ fail 0   ℹ cancelled 0   ℹ skipped 0   ℹ todo 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.

$ node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
ℹ tests 41    ℹ pass 41    ℹ fail 0    ℹ skipped 0
```

Dashboards: `backlog.md` exit `0`, **0 drift**; `sprint-7.md` exit `0`, **0 drift**.
`ai-agents/wiki-vault/`: **0 paths**. Folders moved by me: **none** — the 8 renames in `git status` are
the closing producer's, from the previous pass.

---

## ⚠️ Continuity note — the gap between H11 and H12

**The pass that was to apply H12 terminated on a server-side API 500 with nothing written.** ⛔ **No
partial write reached disk**, and this file was not truncated — it ended cleanly on the H11 pass's
verification block, which is why H12 appears after H11 with a gap in the numbering rather than in the
middle of a half-finished section.

⭐ **Re-derived firsthand on resuming rather than trusting the hand-off summary** — the same rule that
has governed this whole sweep applies to a driver's measurement too:

| Checked | Result |
|---|---|
| `plan.md` blob + size | `24102c776d91cb6852ecbfda979a914591a7da7e` / **31881** — ⭐ unchanged, still the approved plan |
| the archived board's diff | **2 insertions / 2 deletions**, and both are the **closing producer's** href re-points (`0197`'s row, `0232`'s Brief cell) — ⛔ **none of it mine**; the H12 edits were never written |
| this worklog | H11 present, **H12 and H13 absent**, file ends cleanly — no truncation |
| both guards | 41 tests, 41 pass, 0 fail, 0 skip |

---

## Step 1 addendum 3 — OWNER RULINGS H12 and H13, 2026-09-03

Given live via `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`, relayed
by the driver. Option labels verbatim.

### H12 — `0193` defect 2. Ruling: **"A — annotate, don't remove (Rec)"**

⭐ **The owner's reasoning, recorded beside the ruling because it is what makes this a RULE rather than
a one-off:**

- ⭐ **A is the only option that satisfies both rules instead of picking a winner** — the record stays
  intact *and* the reader gets a durable anchor.
- ⭐ **It matches the treatment already applied to defect 1 — the same pointer, in the same sweep.**
- It is the cheapest to reverse.

**Why the other two were refused, recorded so they are not re-proposed:**

- ⛔ **B (repair in place)** — would override the frozen-record rule, contradict `0323`'s standing
  ruling on **this same file**, and overturn **two prior producers' refusals** of the identical act.
  It would set a precedent that **any archived coordinate is repairable**.
- ⛔ **C (leave it permanently)** — would give **two halves of one pointer contradictory treatments**.

### H13 — a second review round, on the new edits only. Ruling: **"Second review round on the new edits only (Rec)"**

`0193` + `0308` added roughly **60 edits after** the single round H3 authorized, so no reviewer has seen
them. ⭐ **The fact the owner weighed:** these land largely in `claude/`, which **neither guard scans for
citations** — so the automated surface covers almost none of them, and this worker's **two silent
no-writes** in the H11 pass are exactly the class an independent pass exists to catch.

⛔ **I do not run that round and I do not request it.** The driver spawns the reviewer after I return.

---

## H12 applied — one pass over the archived board

⛔ **Both edits released together**, so the archived board is never left half-edited — the annotation
and the status-note append `0193` authorizes, in a single pass.

**1 — Defect 2: annotated inside the `0158` row's Task cell.**
⛔ **The stale coordinate itself is untouched.** Proven, not asserted:

| Check | Result |
|---|---|
| occurrences of the stale coordinate string, before vs after | **2 → 2** — unchanged |
| the row's text **before** my insertion point | **byte-identical** |
| the row's Brief-cell suffix | **byte-identical** |
| unescaped pipes in that row | **5 before, 5 after** — the four-column delimiters; ⛔ no stray pipe introduced |

⚠️ **The row LINE is necessarily rewritten, and I am not going to call that an append.** A markdown
table row is a single line, so text appended *inside* a cell rewrites that line. ⭐ **What is preserved
is the coordinate and every character before the insertion point** — the same shape `0321`'s site D
used and the reviewer accepted. **The board's diff reads `10 / 3`: of the three deletions, two are the
producer's href re-points and one is this row line. The addendum edit below is a pure append.**

**The annotation's content:** it says the pointer is stale and deliberately left; that a historical
record's **claims are frozen** while only its **links** are repairable; and it gives the durable anchor
— the addendum it names still opens *"⚠️ The placement below is producer judgment, not an owner
ruling."*, with the instruction to **search that phrase, not the number**, which has drifted twice.
It also records that the identical pointer in `0158`'s own brief received this same treatment in this
same sweep, so the two halves are not treated contradictorily.

**2 — The status flag: appended, never rewritten.** The 2026-08-03 addendum bullet ends *"The
discrepancy itself is still unrepaired — this records who owns the repair, not that it happened."*
⛔ **That text is byte-identical.** A new dated sub-bullet beneath it records that **defect 7 is now
repaired** (`0162`'s field reads `128`, matching the board; the two P127 bullets **byte-unchanged**, as
the 2026-08-03 ruling constrained), that **nothing was re-ranked and no board row was touched by that
repair**, and — kept distinct — that **defect 2 was NOT removed** but annotated under H12.

### ⭐ NAMED, OWNER-RULED DEVIATION — a check that does NOT pass, and must not be reported as passing

**`0193`'s verification step 1, quoted:** *"All six defects are repaired, each verifiable by re-running
its check: … **the board row carries no stale pointer**; …"*

**The owner's ruling, quoted verbatim:** **"A — annotate, don't remove (Rec)"**.

⛔ **That step demands a REMOVAL. Under A the coordinate stays. So the check does NOT pass as literally
written, and it never can under this ruling.** ⛔ **I did not reword the step to make it pass, and I do
not report it as passing.** ⭐ **The owner ruled that outcome deliberately**, on the reasoning recorded
above: removing it would override the frozen-record rule, contradict `0323`'s standing ruling on this
same file, and overturn two prior producers' refusals of the identical act.

⚠️ **This is the one check in `0193` that fails, and it fails by design. Every other defect's check
passes.**

### Verification, measured this pass — ⛔ none of it quoted from the driver

```
$ node --test test/*.test.js
ℹ tests 833   ℹ pass 833   ℹ fail 0   ℹ cancelled 0   ℹ skipped 0   ℹ todo 0

$ npm test    (node --test … && bash test/prove-red.sh)
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.

$ node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
ℹ tests 41    ℹ pass 41    ℹ fail 0    ℹ skipped 0
```

Dashboards: `backlog.md` exit `0`; `sprint-7.md` exit `0`. `ai-agents/wiki-vault/`: **0 paths**.
⛔ No mover invoked, no folder moved by me, no board row's Status / Priority / Brief cell changed,
no commit.

---

## Decision log — fourth entry, the H12 pass

| # | Call | Finding it answers | Why it qualified |
|---|---|---|---|
| D20 | Both `sprint-2.md` edits released **together**, as H12 directs | The held question | ⛔ Not my judgement this time — the owner ruled it. Recorded because I had *chosen* to hold both in the previous pass, and that call is now ratified rather than merely tolerated |
| D21 | The row line rewritten, and **declared as a rewrite** rather than called an append | H12's *"annotate, don't remove"* | ⭐ A single-line table cell cannot be appended to without rewriting its line. **Stating that plainly beats claiming an additions-only proof I cannot honestly produce** — what I *can* prove, and did, is that the coordinate and the entire prefix are byte-identical |
| D22 | `0193`'s verification step 1 recorded as a **failing, owner-ruled deviation** | The named deviation above | ⛔ Not a fix and not a workaround. The alternatives were to reword the step or report it green; both are forbidden and both would hide a real gap from the reviewer |

⚠️ **Fixes applied without asking this pass:** the two H12 edits only, both named in an owner ruling
carried verbatim. ⛔ **No other file was touched.**

### Verification step 5's screen, adjudicated — ⚠️ again, the screen is not a verdict

The added-lines screen over the archived board returns **five** coordinate-shaped hits. ⛔ **Reporting
that as "five new coordinates introduced" would be false.** Adjudicated one by one:

| Hit | Verdict |
|---|---|
| the stale pointer this whole ruling is about | ⛔ **Pre-existing.** Count **2 before, 2 after** — untouched. It rides a `+` line only because appending inside a single-line table cell rewrites that line |
| four coordinates in the `0197` row and the `0232` Brief cell | ⛔ **The closing PRODUCER's href re-points**, not mine. Each has an identical before/after count |

⭐ **The decisive test, done rather than argued:** the text I inserted is **1151 characters** and
contains **ZERO** coordinates — extracted by slicing the row between the unchanged prefix and the
unchanged suffix and matching the coordinate pattern against it alone.

### ⭐ `0193` verification step 5 — the gap I found in my own work, and closed

**Step 5 requires:** *"`0180`'s brief still documents the bare-integer trap **and names a specimen that
exists on disk**."*

⚠️ **My first write-up failed it.** I recorded that the specimen had been repaired and that *"a
replacement live specimen has not been identified"* — which documents the trap but names **no**
specimen. ⭐ **Caught by walking `0193`'s verification steps against my own diff, not by a reviewer.**

**Resolved by measurement:** a sweep of every open brief's `**On merit` statement on 2026-09-03 found
**no** remaining bare-rank merit statement — ⭐ **the class is extinct in live briefs**, every one now
naming its neighbour by folder ID. ⛔ So no *live* replacement exists to name, and inventing one would
be a fabrication. ⭐ **But the specimen still EXISTS ON DISK**: `0158`'s dated correction preserves the
original wording **verbatim** in its before/after table — greppable, readable, and exactly what the
guard must be measured against. `0180` now names that, and ⛔ its trap is unchanged.

**So step 5 passes** — on a specimen preserved as history rather than as a live defect, which is stated
plainly rather than glossed.

---

## Decision log — the ROUND 2 PROCESS-REVIEW pass (2026-09-04)

⭐ **ADR-019 audit obligation, same standing approval.** Owner rulings **H14–H19** dispositioned every
round-2 finding live before I wrote a byte.

**Fixes applied without asking: five.** Each verified `CORRECT` by me against disk first, each
mechanical/localized, each inside the approved plan's repair scope.

| # | Fix | Finding | Why it qualified |
|---|---|---|---|
| PR2-1 | Dated 2026-09-04 correction **appended** beside `0158`'s *"still outstanding"* note | **R9** | ⭐ **H15 chose append over rewrite**, matching round 1's D10 precedent. Verified the note contradicted both the archived board's H12 annotation **and its own table row 1**. My append: **11 lines, 0 deletions** |
| PR2-2 | `0180`'s false *"every one names its neighbour by folder ID, which is the canonical form"* clause corrected with dated, re-runnable figures | **R10** | ⭐ **H14.** ⚠️ **I re-measured and DEPARTED from the finding's number:** it says 24 name no folder ID; I measure **14** of **35** at file granularity and could not reproduce 24, so I wrote 14. The **16** legacy-shape briefs I confirm |
| PR2-3 | `0180`'s stale *"for being in the legacy shape"* sentence re-pointed at the preserved specimen | **R12** | ⭐ **H14.** Verified it was a diff **context** line whose referent the sweep changed. ⭐ Traced the second reading myself: the preserved specimen sits in a **closed** brief, outside the guard's in-scope set — stated explicitly, because the finding was right that it would mis-size the backfill |
| PR2-4 | Apostrophe-free hazard note added beside the `awk`-embedded gloss in `dashboard.sh` | **R14** | ⭐ **H18.** ⛔ **Comment-only, and I re-proved the behaviour rather than quoting the reviewer:** 14 streams byte-identical `HEAD` vs working tree, measured **before** my edit and **again after**. `bash -n` clean. ⚠️ The note contains **zero** apostrophes, asserted programmatically before writing |
| PR2-5 | `0180`'s duplicated clause and on-disk contradiction removed | **R15** | ⭐ **H14.** Measured 2× → 1× (whitespace-normalised) and contradiction pair 2 → 0. ⭐ The contradiction was **verbal, not factual** — the repair says *"no longer a live defect"* and *"preserved as history"* in those words |

**Obvious-winner calls: none.** Every judgment call in this round was already settled by an owner
ruling (H14–H19), so nothing qualified as mine to take.

⚠️ **A pre-existing defect in THIS worklog, found while writing the table above and NOT repaired by
me:** the record has **colliding identifiers in two dimensions**. (1) The `D<n>` decision-log ids —
round 1 ran `D1`–`D14` and the H11 pass **restarted at `D1`**, so `D1`–`D20` each name **two different
decisions** in one file. (2) Two sections are both titled *"Decision log — third entry"*. ⭐ **My five
entries above therefore use a distinct `PR2-<n>` prefix and a unique section title** rather than
extending a broken sequence. ⛔ **I did NOT renumber or retitle the other logs** — they are other
workers' records of their own unattended decisions, and silently rewriting an audit trail is worse
than a collided one. ⛔ Returned as a producer follow-up.

⭐ **Two things I found BEYOND the findings, both recorded rather than absorbed:**

1. **A 6th plural-form occurrence, in `claude/scaffold/`** — R11 measured 5 in `claude/` excluding
   `scaffold/`; I measured a 6th **inside** `scaffold/`, which is the one place `0308`'s brief pins a
   hard *"must stay 0"*. ⭐ **`0308` is NOT wrong:** its pinned **singular** check over `scaffold/`
   returns **0** and passes, and the 6th is **pre-existing at `HEAD`** in a file this sweep never
   modified. ⛔ Carried into the H16 follow-up, not repaired.
2. ⚠️ **A rotted bare line-number pointer inside `dashboard.sh`'s loud-guard comment** — the
   `NB: no apostrophes` note ends with a parenthetical naming a line by number, and that line today
   holds the sprint-comparison warning, not the `awk` program it claims. ⛔ **Pre-existing
   at `HEAD` and NOT repaired:** it is a source-file line coordinate, a different class from `0308`'s
   task-numeral population, and **nothing owns it** — the same gap round 1's residual 8 recorded for
   `test/`. Returned as a producer follow-up.

⚠️ **THE OSCILLATION SIGNAL — raised proactively, not on request.** Three round-2 findings are round-1
classes recurring one file over (R9←R3, R13←R5, R15←R6), and all three round-1 rows read `✅ done`.
⛔ **Not re-litigation** — each is a different site in a file that did not exist in round 1's surface.
⭐ **What recurred is the class**, because round 1 fixed each instance per-site and nothing generalised.
⛔ **I did not design a remedy** — owner ruling **H19** routes it to the architect as a producer
follow-up.

---

---

## Re-verification after ROUND 2, 2026-09-04

⛔ **Measured this run.** Not quoted from round 1, not quoted from the reviewer.

| Check | Result |
|---|---|
| Both guards | ✅ **41 tests, 41 pass, 0 fail, 0 skipped** |
| Full `npm test` | ✅ **833 tests, 24 suites, 833 pass, 0 fail, 0 cancelled, 0 skipped, 0 todo**; exit **0** |
| `test/prove-red.sh` | ✅ **hard gate PASSED** — **28** mutations, every one redding its **named** assertion; ⛔ no `MUTATION WAS A NO-OP`, no `WRONG TARGET` |
| ⭐ **H18 behaviour proof, re-established BY ME** | ✅ `dashboard.sh` at `HEAD` vs the working tree: **all 14 streams byte-identical** — stdout **and** stderr, 3 boards × render/`identity`, plus `select-active`. Measured **before** my edit and **again after**. `bash -n` **clean** |
| Both live boards | ✅ **drift records: 0 and 0** |
| No new coordinate | ✅ whole-file screen over `worklog.md` and `review.md`: **0** hits, including the path-less form (H9) and a bare `line <n>` in prose. ⚠️ **Two of my own slips caught here and fixed** — I twice quoted a bare line numeral while *describing* a rotted pointer |
| Reviewer sections untouched | ✅ round 1's **8** rows and round 2's **7** rows all present and unedited |

⚠️ **Green still does not mean covered** — unchanged from round 1. `claude/` is outside **both** guards
entirely, so `0308`'s twelve files are proved by the per-repair evidence and the H18 byte-identity
proof, ⛔ **not** by this table.

---

## ⭐ THE FINAL CLOSE LIST — after round 2 (2026-09-04)

⛔ **A HAND-OFF, not a close.** This task runs no mover, moves no folder, flips no board row and holds
neither skill. Every close below is the producer's act via `/fkit-task-done`, each carrying
**`(agent-closed — not owner-verified)`** (ADR-033 §5).

⭐ **The 8 rows of round 1's list were closed and verified by a spawned producer before round 2 ran**,
and are **not** repeated here. ⚠️ **This list is the DELTA — the two members built under ruling H11.**

| ID | Outcome | Reason |
|---|---|---|
| `0193` | ✅ **Done** | **Six of seven** defects repaired in the closed `0158` records. ⚠️ **Defect 2 is settled, NOT repaired:** owner ruling **H12** (*"A — annotate, don't remove (Rec)"*) keeps the archived board's stale coordinate **byte-identical** and annotates it with a durable anchor instead. ⛔ **So `0193`'s verification step 1 (*"the board row carries no stale pointer"*) does NOT pass as literally written** — an owner-ruled deviation, recorded, not an oversight. ⚠️ Carries residual **R13**: quoting the anchor took its match count **1× → 2×** in both files — accepted under **H17**, not repaired |
| `0308` | ✅ **Done** | Full triage and repair of `claude/`'s stale task-numeral seeds against its own pinned population (**48 / 12 files**). ⚠️ Carries residual **R11**: the pinned pattern is **singular-only**, so **6** plural `tasks NN` occurrences were never triaged — **5** in `dashboard.sh` and **1** in `claude/scaffold/`. ⭐ **`0308`'s own pinned check still passes** (singular over `scaffold/` = **0**) and the 6th is **pre-existing at `HEAD`** in a file this sweep never touched, so it is a **blind spot, not a regression**. Owner ruling **H16** closes `0308` and files the gap as a follow-up |

**2 closes this round; 10 across the task.**

⛔ **STILL OPEN and NOT on any close list:** `0286` (half B only — H4), `0323` (H5), `0298`.

### ⭐ Producer follow-ups to FILE — five, none of them filed by me

⛔ **I file none of these** — filing is the producer's act, and one of them is routed onward to the
architect by owner ruling.

| # | Follow-up | Authority | What it must carry |
|---|---|---|---|
| F1 | **The `tasks NN` plural blind spot** in `claude/` | Owner ruling **H16** | **6** occurrences: **5** in `claude/skills/fkit-status/dashboard.sh`, **1** in `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`. ⚠️ **The scaffold one is load-bearing** — `0308`'s brief pins that directory at *"must stay 0"*, and under the plural form it is **not** zero. ⭐ At least one is a genuine provenance citation, not decoration |
| F2 | ⭐ **THE RECURRING-CLASS SIGNAL — routed to the ARCHITECT, not to a coder** | Owner ruling **H19** | Round-1 classes recurred one file over in round 2: **R9←R3** (stale self-description), **R13←R5** (anchor checkability), **R15←R6** (self-inflicted prose defect). All three round-1 rows read `✅ done`. ⛔ **The reviewer's suggested shape — a sweep-completion step, *"re-read every note that describes a state you changed"* — is EVIDENCE, not a decision.** A convention/procedure change with repo-wide reach is the architect's to design |
| F3 | **`0273`'s brief carries a measurably FALSE fence claim** | Owner ruling **H6** | It asserts a citation *"is CORRECT and must not be 'fixed'"* which this run refuted. ⛔ Not a member; not edited |
| F4 | **Two `architecture.md` §9.5 residual-drift bullets are FALSE TODAY** | `0286`'s prose fence | The *"Six roles"* literal-count claim and the *"still advertises `fkit claude`"* claim. ⛔ Reported, not fixed |
| F5 | **Two record-hygiene defects found this round, both left alone deliberately** | This round's decision log | (a) A rotted bare line-number pointer inside `dashboard.sh`'s loud-guard comment — the `NB: no apostrophes` note names a line that today holds the sprint-comparison warning, not the `awk` program it claims — **pre-existing**, a source-file line-coordinate class that **nothing owns**, the same gap round 1's residual 8 recorded for `test/`. (b) This worklog's **colliding `D<n>` ids and duplicate section titles** across three workers' decision logs. ⛔ **I renumbered nobody else's audit trail** |

⚠️ **Unchanged and still owed to the producer before it closes anything:** measured today, **69 markdown
links inside 92 total mentions** point into these folders while they sit in `backlog/`, and **every one
breaks the instant a folder moves to `done/`.** The link guard asserts **zero** broken links across
`ai-agents/` including closed folders, so an unrepaired close turns the suite red.
