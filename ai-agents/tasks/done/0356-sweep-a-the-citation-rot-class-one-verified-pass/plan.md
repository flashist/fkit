# Implementation plan — 0356, Sweep A: the citation-rot class in ONE verified pass

**Task:** `0356` (`0356-sweep-a-the-citation-rot-class-one-verified-pass`)
**Author:** fkit-coder, spawned Build/plan worker under `fkit-sprint-ship-loop` (no owner channel — ADR-021)
**Planned against:** HEAD `6dcc33e`, working tree carrying two pre-existing modifications
(`ai-agents/sprints/sprint-7.md` and this task's own `brief.md` — the driver's board work).
**Status:** planning only. No file was written, edited or moved to produce this plan.

---

## 0. Read this first — what "one verified pass" does and does NOT mean

⛔ **The two guards do not cover most of what this sweep repairs, and the close report must say so
in the same breath as the word "verified."**

Measured against the settled condition (the 2026-08-29 reference-integrity condition report) and
against the two guard files themselves:

- The **citation guard** (`test/coordination-citation-policy.test.js`) scans
  `ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md`, exempts closed task folders in whole, and
  only fires when the **target** is a coordination document — a sprint board, a task folder's
  `brief` / `plan` / `worklog` / `review` markdown, or the wiki log. `ai-agents/knowledge-base/**`,
  `claude/`, `test/` and `bin/` are **out of its scanned set**, and ADRs, `architecture.md`,
  `README.md` and source files are **not in its target class at all**.
- The **link guard** (`test/reference-integrity.test.js`) scans `ai-agents/**/*.md` for markdown
  links that do not resolve. It says nothing about whether a coordinate points at the right line.

Predicted member edit surfaces, by guard coverage:

| Surface | Members landing there | Citation guard | Link guard |
|---|---|---|---|
| `ai-agents/tasks/backlog/*/brief.md` | `0309` | ✅ covers | ✅ covers |
| `ai-agents/sprints/backlog.md` | `0321` | ✅ covers | ✅ covers |
| `ai-agents/tasks/done/**` | `0193` `0320` `0343` | ⛔ exempt | ✅ covers |
| `ai-agents/sprints/done/sprint-2.md` | `0193` (partial) | ⛔ out of set | ✅ covers |
| `ai-agents/knowledge-base/decisions/` (ADRs) | `0197` `0232` `0323` `0344` | ⛔ out of set | links only |
| `ai-agents/knowledge-base/architecture.md` | `0275` `0286` | ⛔ out of set | links only |
| `claude/**` | `0308` | ⛔ out of set | ⛔ out of set |
| `bin/release.mjs` | `0344` | ⛔ out of set | ⛔ out of set |

⭐ **So the guards are a REGRESSION gate — "this sweep introduced no new coordination-document
citation and broke no link" — and not a COVERAGE gate.** Whether each repaired coordinate now names
the right thing is proved **per repair, by a re-resolution recorded in the worklog**, not by a green
test run. The close report states this in the verdict, not in a footer.

---

## 1. Step 0 — the hard gate, proved before the first edit

Run, from a clean-of-my-edits tree, and paste both runs into `worklog.md` **dated, as the worklog's
first entry**:

```
node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
```

Gate condition: **both green, 0 fail, 0 skip**. If either is red, ⛔ **STOP** and return `BLOCKED` —
the sweep does not touch a file. (The driver measured 41 tests / 41 pass on 2026-09-03; ⛔ that is
the driver's measurement, not mine, and this step re-measures rather than inherits it.)

Also record, in the same entry, `git rev-parse --short HEAD` and `git status --porcelain`, so every
later "byte-identical to HEAD" proof has a named baseline and the two pre-existing modifications are
excluded from my diff by name rather than by hand-waving.

---

## 2. ⭐ MANDATED SECTION — how this sweep avoids writing banned-form coordinates into open records

**Discharging the owner ruling of `0237`'s review disposition, option label verbatim:
"Carry it into each sweep's plan gate (Rec)."**

### 2.1 The exposure, measured rather than assumed

This task's folder is an **open backlog folder**, so its `plan.md`, `worklog.md` and `review.md` are
inside the citation guard's scanned set and are **not exempt**. That is ruled behaviour, not an
oversight: the guard file records the owner ruling of 2026-09-02, option label verbatim
**"A + file follow-up D (Rec)"** — ship with **no** exemption for review ledgers, and option B
(exempting an open `review.md`) was **refused by name** as a silent widening of "closed records are
frozen" into "ledgers anywhere."

Measured now, in this tree: **there is no `plan.md`, `worklog.md` or `review.md` under any open
backlog task folder at all.** Every such file lives in `done/`. ⭐ **This sweep's own three records
will therefore be the first open-folder records this guard has ever scanned in that shape**, and the
guard's own note calls that cost "entirely PROSPECTIVE and its RATE IS UNMEASURED." We are the first
measurement.

**Exactly what reds it**, from the guard's target-class regex and its maskers:

- **Fires on:** a literal `ai-agents/`-prefixed path to a sprint board, a task folder's
  `brief`/`plan`/`worklog`/`review` markdown, or the wiki log, immediately followed by a colon and
  digits — **including inside inline code spans**, because the code-span masker is deliberately
  absent (owner ruling 2026-09-02, option label verbatim **"Omit, assert positively (Rec)"**).
- **Does not fire on:** a bare path with no line number; an ADR, `architecture.md`, `README.md`,
  `claude/`, `test/` or `bin/` path with or without a line number; anything inside a **fenced block**
  or on a **blockquote line**, both of which are masked.

⚠️ **This task's own brief is stricter than its guard.** The brief's constraint is
*"No `path:NNN` citations in this task's own artifacts"* — every path, not only coordination
documents. ⭐ **The stricter rule governs. I obey the brief, not the guard's narrower target class.**

### 2.2 The four available approaches, and the one this sweep takes

| # | Approach | Verdict |
|---|---|---|
| 1 | **Anchor on heading + quoted fragment; never write the coordinate** | ⭐ **ADOPTED** |
| 2 | Split the coordinate across two table cells (`0237`'s dodge) | ⛔ rejected |
| 3 | Put coordinates inside a fenced block or a blockquote line | ⛔ rejected by name |
| 4 | Carry the finding as (file, heading, quoted fragment) + a runnable command | ⭐ **ADOPTED, paired with 1** |

**Why 1 + 4, and not merely "we'll be careful":**

- ⭐ **It is the only approach of the four that is durable rather than evasive.** A heading plus a
  quoted fragment stays correct after the target file grows; a masked or split coordinate is exactly
  as rotted as an unmasked one, it is only harder to find. The sweep exists to stop scheduling its own
  successor; approaches 2 and 3 schedule one.
- ⭐ **It carries a measured precedent rather than inventing one.** `0176`'s reviewer anchored on
  section headings instead of line numbers and judged that **strictly better** than `0237`'s
  split-cell dodge. That is the first and only measurement of this cost, and it points one way.
- ⛔ **Approach 2 actively degrades checkability, on this repo's own rule.** The
  `durable-citation-anchors` convention's verification section names a phrase split across table
  cells as having **no cheap remedy** — it says to *"treat a phrase that may cross a cell boundary as
  unverifiable by this method, and say so."* The split-cell dodge therefore buys a green guard by
  making the record unverifiable by the repo's own prescribed check. It reads badly **and** it checks
  worse.
- ⛔ **Approach 3 is a guard-dodge, and it is refused by name.** Fences and blockquotes are masked, so
  it would go green — while violating the brief's own constraint outright. A sweep that satisfies its
  guard by hiding from it is the shape this whole sprint exists to end.
- ⭐ **1 + 4 satisfy the brief and the guard simultaneously, with no dependence on the guard's masking
  rules.** If the maskers change, our records are unaffected. That independence is the point.

### 2.3 The concrete authoring rules this sweep follows in its own records

Binding on `plan.md`, `worklog.md`, the close hand-off list, and every message I send:

1. ⛔ **No `token:digits` anywhere.** Not for coordination documents, not for ADRs, not for source
   files, not inside backticks, not inside a fence.
2. **A rotted coordinate is recorded as:** target file (bare path, no line number) · the nearest
   heading or sub-heading · the quoted fragment actually found there · what the member brief claimed
   was there. Four fields, no number.
3. **An absorbed row is cited by its bare four-digit ID**, per `durable-citation-anchors` row 4 — ⛔
   **never by a relative link into `ai-agents/tasks/backlog/…`.** See §8.3: those links break the
   moment the producer closes the row, and would red the link guard.
4. **Where a line number is genuinely load-bearing** (proving a frozen record is byte-identical), it
   is carried as a **runnable command and its output**, not as prose — `git diff -- <file>` returning
   empty, or `grep -n` inside a fenced block whose output is the evidence. The fence is legitimate
   here because the number is a *command's output*, not a citation I authored.
5. Both guards are re-run over my own new records before the review round is requested, so a
   self-inflicted red is caught by me and not by the reviewer.

### 2.4 The unfiled follow-up D — my exposure and my mitigation

Follow-up D (amend the reviewer skill's findings-table `file:line` column to read *"heading +
fragment where the target is a coordination document"*) is **owner-ruled and not yet filed**, and it
is the producer's to file. It does not block this task, but it lands squarely on me: this sweep's
subject **is** coordination documents, so the reviewer's default column shape pushes toward writing
exactly the banned form into a `review.md` that the guard scans and does not exempt.

**Mitigation, in order:**

1. The reviewer spawn prompt states the anchoring rule explicitly — findings on this task name
   **heading + quoted fragment**, never a coordinate — and says why (this ledger is inside the guard's
   scanned set and is not exempt).
2. `plan.md` (this document) is the standing reference the spawn prompt points at, so the rule is on
   disk and not only in a prompt.
3. ⛔ **If the reviewer writes a banned-form coordinate anyway, I do not fix it.** Editing the
   *Reviewer findings* section is forbidden to me. I re-invoke the reviewer asking it to re-anchor its
   own rows, and I report the red guard to the owner rather than silently working around it.
4. If it still stands after that, it becomes an owner question (accepted residual vs. block the close)
   — ⛔ **not a thing I resolve.**

⚠️ **Residual I cannot close from here:** the reviewer owns its section, so rule 1 is prose I ask it
to honour, not a wall. Stated rather than implied away.

---

## 3. Step 1 — freeze the membership, in writing, before any edit

Written into `worklog.md` as a **discrete, dated step that precedes every edit**. A membership decided
after the edits is a rationalisation.

### 3.1 The decision rule, stated before the verdicts

A candidate is **IN** when all four hold:

1. Its deliverable is a **repair or re-anchoring of a recorded coordinate** that no longer resolves to
   what it claims — the class definition. A row whose deliverable is a *guard*, a *decision*, or a
   *claim correction that is not a coordinate* is **OUT**.
2. Its edit surface is one this sweep may lawfully touch — not `ai-agents/wiki-vault/` (ADR-005, Sweep
   C's), and inside `ai-agents/tasks/done/` or `cancelled/` **only** where the member's own brief
   carries an owner ruling authorizing that specific edit.
3. It is **not** a declared member of Sweep B's or Sweep C's frozen candidate list.
4. Absorbing it does not require re-deriving an **unbounded** scanned set. A sweep over one named
   file is bounded; a sweep over "every occurrence of a form, repo-wide" is not.

Rows failing test 1 are **not absorbed and not closed** — they stay open as their own rows. Rows
passing tests 1–4 but whose defect **no longer reproduces** at step 2 are closed **`⛔ Cancelled`**.

### 3.2 Predicted verdicts

⚠️ **This table is a PREDICTION from the plan-stage read, not the frozen membership.** Step 1 re-runs
the rule against each brief on disk and publishes the real table. Verdicts here can move.

| ID | Predicted | Reason |
|---|---|---|
| `0193` | **IN** (see Q1) | Stale citations in two closed briefs + an archived board + one open brief. Closed-folder edits carry their own owner rulings of 2026-08-02 / 2026-08-03 |
| `0197` | **IN**, architect-gated | ADR-010's remaining stale code line-ranges, including one never checked. Which pointers are live vs. frozen is an ADR-meaning judgement — §7 |
| `0232` | **IN**, re-measure first | ADR-012's coordinates. ⚠️ Its own dated correction says two classes were already discharged by `0171`, which is **now closed** — so part of its claim set is expected **not to reproduce** |
| `0275` | **IN** | One parenthetical in `architecture.md`. ⛔ Must land with `0286` — it is a strict subset of that file |
| `0286` | **IN** | A sweep, but of **one named file**, both directions. Bounded → passes test 4 |
| `0298` | ⛔ **OUT — stays open** | Its deliverable is a **tripwire test**, not a repair; nothing is stale today. Fails test 1 — the identical reason the brief already excluded `0307`. ⭐ **But its own title's coordinate into `README.md`'s scope sentence is itself a citation in an open brief** and falls to `0309`'s class → repair the coordinate, leave the row open |
| `0308` | **IN** | Stale task-numeral seeds across twelve `claude/` files. ⛔ Outside both guards — see §0 and §9.4 |
| `0309` | **IN — highest risk** | Passes test 4 only because its two classes are **enumerated** in its brief. ⛔ Membership re-derived by measurement at step 2, not inherited. Its live dependency-declaration site is **surfaced, not repaired** — Q2 |
| `0320` | **IN** — Sweep A (ruling below) | §3.3 |
| `0321` | **IN** — Sweep A (ruling below) | §3.3 |
| `0323` | **IN**, architect-gated | ADR-013's drifted naked pointers. The "dated worklist vs. live pointer" call is ADR-meaning — §7 |
| `0343` | **IN** (see Q1) | Two stale self-locators in closed records; its own owner ruling of 2026-08-26, option label verbatim **"Header block only (Recommended)"**, authorizes exactly that edit |
| `0344` | **IN** | Comment coordinates in `bin/release.mjs` + two in ADR-042. ⛔ Step 5 **forces** its Option B (durable anchors, drop the numbers) over its Option A (renumber) |

**Predicted total: 12 in, 1 out.** ⛔ Not a target. The owner's ruling authorizes the closes the sweep
justifies, never a quota — and step 2 may move several of these to `Cancelled`.

### 3.3 ⭐ The `0320` / `0321` sweep-assignment ruling

**Authority to rule both, not just `0320`:** this task's step 1 is told to rule `0320`; Sweep B's brief
independently tells *its* step 1 to rule `0320` **and** `0321`, and settles the tie with *"whichever
runs first records its ruling for the other."* Sweep A runs first, so Sweep A rules both.

**Measured:** neither `0320` nor `0321` appears in Sweep B's frozen 20-row candidate table. They appear
there only in its boundary note. So neither is being taken from a declared Sweep B member.

⭐ **Ruling: both `0320` and `0321` land in Sweep A.**

**Reason — the family argument, which beats the repair-form argument.** `0320`, `0321` and `0309`'s
second class are **one defect family**: the stale `0171`-status claims, split into three rows by an
owner ruling of 2026-08-22 on *location* and *repair form*, not on kind. `0309`'s own brief names
`0320`'s two closed briefs and `0321`'s two board rows as **its own out-of-scope residuals**. Routing
two thirds of that family to a different sweep re-creates precisely the cross-row coordination cost
these sweeps exist to remove, and would leave whichever sweep ran second re-deriving the same set for
the fourth time.

**The counter-argument, stated rather than buried:** `0320` is append-only dated notes into closed
folders, which is Sweep B's declared shape almost word for word. That is a real cost of this ruling,
and it is why Q1 exists. ⛔ **Both rows land in exactly one sweep either way** — the constraint is
honoured under either answer.

---

## 4. Step 2 — re-verify every claim in every member, firsthand

⛔ **Inherit nothing.** Every member brief names coordinates measured between 2026-08-02 and
2026-08-29; several of those files have moved, closed or been repaired since.

Per member, per claimed defect, recorded in `worklog.md`:

1. Resolve the claimed coordinate against the file **at HEAD** (`git show HEAD:<path>`) and **in the
   working tree**. Record the text actually present, quoted, with its nearest heading.
2. Verdict: **reproduces** / **does not reproduce** / **partially reproduces** / **target moved**.
3. For absence claims over prose, use the whitespace-normalised form the `durable-citation-anchors`
   convention prescribes — `tr '\n\t' '  ' | tr -s ' '`, the squeeze included — and **state which of
   that page's named limits the check did not cover**, in the same breath as the result. Presence
   claims need no such form.
4. Where a **count** is load-bearing, derive it with `grep -o … | wc -l`; ⛔ `grep -c` counts lines,
   not occurrences.

**A member whose claims do not reproduce at all is closed `⛔ Cancelled`**, with the non-reproduction
recorded — ⛔ never silently dropped. Named expressly in the close report, per verification step 3.

**Predicted non-reproductions to test first** (predictions, not findings):

- `0232` — its own correction says `0171` discharged two of its five classes; `0171` is closed.
- `0309` Class 2 — several sites are conditionals whose antecedent has since settled, which its own
  brief already dispositions as *leave alone*.
- `0344` — its ADR-042 half cites a target in `test/prove-red.sh` that had already drifted twice when
  measured; expect a third position.
- Any member citing a folder still under `backlog/` on its measurement date that has since closed.

---

## 5. Steps 3 + 4 — the classification, published before any edit

`worklog.md` carries a table with **one row per coordinate**, published as a discrete step **before**
the first edit, with a **count per class**:

| Class | Test | Treatment |
|---|---|---|
| **Live pointer** | The coordinate exists to send a later reader wherever the target is *now* | **Re-anchor** — heading + quoted fragment, or symbol name |
| **Frozen record** | The coordinate is a claim about a revision the writer read, inside a dated observation, a closed record, or an archived board | ⛔ **Leave byte-identical.** Annotate beside it only where the member's own owner ruling authorizes an append |
| **Dead link href** | A markdown link target that no longer resolves | **Re-point the href, change nothing else on the line** |

⭐ **Two rules that decide the hard cases, stated so nobody re-derives them backwards:**

- **A historical record's *claims* are frozen; its *links* are not.** This is the settled condition's
  §1 principle, and it is the authority — ⛔ **not ADR-034**, which the condition report's correction
  C1 shows says nothing about post-close edits and grants no exemption to anything. An archived board
  and a closed brief are the same case: coordinate frozen, href repairable.
- **Expect refusals, and treat them as the correct outcome.** `0237`'s two close producers each
  **refused** to re-point a bare path in a code span inside a dated claim in the 2026-08-14 backlog
  triage part-2 report — because it is a frozen record, and its target has since closed, making it
  doubly rotted and doubly frozen. ⭐ **Members of this set will raise the same refusal. A refusal is
  a finding, recorded with its reason — it is not a failure and it does not block the close.**

---

## 6. Step 5 — repair once, re-anchor never re-cite

- Repairs use **durable anchors**: quoted text, a symbol or function name, a heading — ⛔ **never a new
  coordinate**, in any file, including source files.
- ⭐ **This tightens two members' own briefs, and tightening is permitted where relaxing is not.**
  `0344` offered "renumber and pair with a quoted fragment" as its Option A; `0286` and `0323` allow a
  repaired number. ⛔ **Step 5 forbids all of them.** Recorded per member so the tightening is visible.
- **Citing a task:** the bare four-digit ID. ⛔ Never `task-NN`, never `task NN` — the
  `durable-citation-anchors` convention names those as the same wrong class, spelled so no sweep finds
  it, which is `0309`'s entire subject.
- **Link labels:** where a repair touches a link whose visible label is a path into a living document,
  replace the label with what the target *is*. ⛔ Do not prepend a durable ID and leave the stale path
  standing after it — that satisfies every rule and changes nothing a reader sees.

---

## 7. Consults — one, batched, to the architect

Three members turn on **what an ADR means**, not on where its lines are, and the brief is explicit
that those are surfaced rather than decided:

- `0197` — which of ADR-010's remaining pointers are live pointers vs. frozen records, and the range
  into the scaffold CLAUDE template that was never checked at all.
- `0323` — whether ADR-013's five naked coordinates sit in a **dated worklist** (frozen) or a **live
  consequences list** (re-anchor). Its brief deliberately leaves this undecided.
- `0232` — its two surviving factual claims about a source of truth, as claims rather than coordinates.

**One consult, batched, stating:** *"You are being consulted at hop 2 of 2; chain: lead → coder →
architect. You may not consult anyone further."* ⛔ If the architect surfaces a **new** structural
decision rather than an interpretation, that goes to the **owner**, not into the sweep.

---

## 8. Step 6 — the hand-off, and what it must warn the producer about

### 8.1 The close list
One line per absorbed row: **ID · outcome (`Done` / `Cancelled`) · reason**, bare IDs, no links.

### 8.2 What this task does NOT do
⛔ Does not run `/fkit-task-done` or `/fkit-task-cancelled`. ⛔ Does not move a task folder. ⛔ Does not
flip a board row. ⛔ Does not hold those skills — the ADR-018 hook denies them to me at any depth. The
terminal act is spawning `@fkit-producer` with the close list, which writes the
**`(agent-closed — not owner-verified)`** marker (ADR-033 §5). The close report says the list is a
hand-off.

### 8.3 ⚠️ The link-churn warning the hand-off must carry — measured

Measured now across `ai-agents/**/*.md`: **69 markdown links, inside 92 total mentions**, point into
the thirteen candidate folders while they sit in `backlog/`.

| ID | links in | ID | links in | ID | links in |
|---|---|---|---|---|---|
| `0193` | 4 | `0286` | 10 | `0321` | 9 |
| `0197` | 5 | `0298` | 1 | `0323` | 1 |
| `0232` | 7 | `0308` | 7 | `0343` | 1 |
| `0275` | 4 | `0309` | 8 | `0344` | 5 |
| | | `0320` | 7 | | |

⭐ **Every one of those links breaks the instant its folder moves to `done/`, and the link guard
asserts zero broken links across `ai-agents/**` including closed folders.** Re-pointing them is
`/fkit-task-done`'s own mandated behaviour, and the producer must be told the volume before it starts.
⛔ **This is the producer's act, after my hand-off — it is outside my diff and outside my verification.
Not flagging it would leave the next `npm test` red with nobody expecting it.**

### 8.4 Cross-sweep edit collisions to warn about
- `architecture.md` — `0286`/`0275` here; Sweep B's `0312` corrects a claim in the same file.
- `ai-agents/sprints/done/sprint-2.md` — `0193` here; Sweep B's `0183` and `0299` also land there.
- `0158`'s closed folder — `0193` edits its `brief`; Sweep B's `0201` edits its **review ledger**.
  Different files, so disjoint — recorded so the producer does not read it as a conflict.

---

## 9. Verification — mapped one-to-one onto the brief's ten steps

| # | Check | How |
|---|---|---|
| 1 | Gate green **before** the diff | §1's two runs, dated, first entry in `worklog.md` |
| 2 | Frozen membership precedes the edits | §3's table as a discrete dated worklog step, `0320` **and** `0321` ruled |
| 3 | Every claim re-verified firsthand | §4's per-member record; non-reproducers **named** |
| 4 | Classification published first; frozen records byte-identical | §5's table with per-class counts; `git diff -- <file>` empty per frozen file, output pasted |
| 5 | No new coordinate introduced | `git diff -U0 \| grep '^+' \| grep -nE '[A-Za-z0-9_./-]+:[0-9]+'` — ⚠️ **run over ADDED lines only, and adjudicate every hit in the worklog.** That pattern also matches clock times, `ADR-NNN` references and unrelated tokens; it is a **screen, not a verdict**, and reporting its raw count as a pass would be false |
| 6 | Both guards green **after** | Re-run §1's command; paste |
| 7 | No vault writes; `done/`/`cancelled/` edits named with authority | `git diff --stat`; a table naming each closed-folder file touched and **quoting the member's own owner ruling** that authorizes it |
| 8 | Nothing moved, no row flipped | `git status`; close report states the list is a hand-off |
| 9 | Dashboard over **both** live boards, before and after | `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-7.md` and the same over `ai-agents/sprints/backlog.md`; report roll-ups and drift both times. **No board gains a drift record** |
| 10 | `npm test` including `test/prove-red.sh` | Report counts. ⚠️ Baseline was 833/833 at `0176`'s close — ⛔ re-measure, do not quote |

---

## 10. Edge cases and non-obvious failure modes

1. ⚠️ **`0308` edits twelve files under `claude/`, which is a shipped surface.** It engages
   `claude/structure-manifest.tsv` and the structure-spec / manifest tests, and those tests need full
   git history. **Stop-point:** if a comment repair forces regenerating a shipped manifest, that is a
   shipped-artifact change beyond "repair a comment" — ⛔ **stop and surface it**, do not regenerate on
   my own judgement.
2. ⚠️ **`0308`'s targets include the dashboard script and the role→skill ownership script.** The
   dashboard script is the tool verification step 9 runs, and the ownership script is the single source
   both the launcher and the ADR-018 hook read. Comment-only edits, re-run step 9 and the ownership
   tests after touching either, and ⛔ never alter the dashboard's parsed contract.
3. ⚠️ **`claude/` is mirrored to a gitignored `.claude/`.** Edits land in `claude/`; the mirror is
   stale until re-initialised. ⛔ Do not edit the mirror, and do not report a `claude/` repair as live
   in this session's own agents.
4. ⚠️ **`0309`'s live dependency-declaration site is a board-semantics change, not a citation repair.**
   Editing a `Depends on:` line changes what the dashboard derives and can flip a truthful `ready` row
   false. ⛔ Surfaced, not repaired — **Q2**.
5. ⚠️ **`0193` touches an archived board.** Under §5's rule its *coordinates* are frozen and its
   *hrefs* are repairable. Expect the coordinate half to end in a recorded refusal.
6. ⚠️ **`0286`'s inbound half names frozen test fixtures.** Report-only; ⛔ never edited — a fixture
   change silently rewrites what a test proves.
7. ⚠️ **Two files are already modified at plan time.** Every diff proof names its baseline and excludes
   them explicitly.
8. ⚠️ **A repair can create a new broken link.** Re-pointing an href or changing a link label can break
   resolution. The link guard catches this **only inside `ai-agents/`** — a link inside `claude/` or
   `bin/` is caught by nothing. Re-resolve those by hand.
9. ⚠️ **The link guard asserts its named-exemption set is exactly six.** ⛔ Do not add to it to make a
   repair go green — a rise is the failure it is built to catch.
10. ⚠️ **Sequencing inside `architecture.md`:** `0275` and `0286` must be executed as **one edit pass**
    over that file. Doing `0275` alone leaves the file half-swept and makes `0286`'s later diff
    unreadable.

---

## 11. Work order

1. Gate (§1) — ⛔ stop if red.
2. Freeze membership + rule `0320` / `0321` (§3). Publish.
3. Re-verify every member's claims (§4). Publish; name non-reproducers.
4. Classify every surviving coordinate (§5). Publish counts.
5. Architect consult, batched (§7). Block only the three members that need it.
6. Repair, grouped **by target file, not by member row**, so each file is opened once:
   `architecture.md` (`0275`+`0286`) → ADRs (`0197`, `0232`, `0323`, `0344`) → `bin/release.mjs`
   (`0344`) → open briefs (`0309`, `0298`'s own coordinate) → live board (`0321`) → `claude/`
   (`0308`) → closed records last and only under Q1's answer (`0193`, `0320`, `0343`).
7. Self-check: both guards, the added-lines screen, per-file frozen-record diffs, both dashboards.
8. `npm test`.
9. Request the stateful review — spawn prompt carries §2.4's anchoring rule.
10. Process the review; hand the producer the close list.

---

## 12. What this plan explicitly does not do

⛔ No commit, no push. ⛔ No write under `ai-agents/wiki-vault/` — vault findings are **reported** and
routed to Sweep C. ⛔ No mover invoked, no folder moved, no board row flipped. ⛔ No weakening or
re-opening of the settled condition. ⛔ No absorption of a declared Sweep B or Sweep C member. ⛔ No
new architecture decision settled by me or by the architect — those go to the owner.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-03

Given live via `AskUserQuestion` in this `fkit lead` session, by the owner, at `0356`'s plan gate.
Option labels are recorded **verbatim**. These rulings bind the Build and Process-review workers.

| # | Question | Owner ruling (verbatim option label) | What it settles |
|---|---|---|---|
| **H0** | Approve this plan as written? | **"Approve as written (Rec)"** | The plan above is the approved plan. These bytes are what the Build worker implements. |
| **H1** | Q1 — the three members that edit CLOSED task folders (`0193`, `0320`, `0343`): is `0353`'s guard-exemption clause either/or with the member's own owner ruling, or both-required? | **"Do them under their own rulings (Rec)"** | ⭐ All three are **IN**. Each proceeds under the specific owner ruling quoted in its own brief naming that exact edit. §9 verification step 7 still applies in full — the closed-folder table must quote each authorizing ruling. |
| **H2** | Q2 — `0309`'s live `Depends on:` site: repair it, or surface it? | **"Surface it, hand to producer (Rec)"** | ⛔ **Do NOT repair the live dependency-declaration line.** It is recorded as a named residual and handed to the producer with the close list. Board semantics are the producer's. §10 item 4 stands as written. |
| **H3** | Q3 — one review round or two? | **"One round over the whole sweep (Rec)"** | ⭐ **One** stateful review round over the whole sweep. The reviewer sees the classification table whole. The §0 guards-are-a-regression-gate-not-a-coverage-gate finding must be stated to the reviewer, since no second round backstops the uncovered surfaces. |

⚠️ **Transport note.** This plan text was returned to the driver through the spawn channel, which
HTML-escaped some angle brackets. The driver restored `&lt;`/`&gt;` to `<`/`>` when persisting these
bytes — in §4 item 1 (`git show HEAD:<path>`), §9 row 4 (`git diff -- <file>`) and §2.3 rule 4.
No other character was altered. Recorded so a later reader does not read the restoration as drift.
