# fkit ↔ aiboard: the two task/sprint data models, laid out for an external expert

**Date:** 2026-09-18
**Kind:** evaluation — deliberately *non*-recommending. This document asks questions; it does not settle them.
**Audience:** an external reviewer with **zero prior knowledge of either project**. Nothing below assumes you have seen either codebase, and every term is defined on first use.

---

## ⛔ READ THIS BEFORE ANYTHING ELSE

### 1. You may choose NEITHER. On every single question.

Two projects are described below. Each has a data model. Each project's lead has written a position.
**You are not being asked to pick a winner.**

> **On every open question and every comparison point in this document, "neither of these — here is a third design that beats both" is a fully live, explicitly invited answer.**
> It is not a fallback. It is not a tie-breaker. It is not what you say when you cannot decide. It is a first-class option that the project owner asked for **by name** when he commissioned this report:
>
> > *"I also want you to make it clear in the report and in the open questions that the external expert can choose **neither** from the options. So maybe the external expert can suggest something that is better, that is neither fkit's solution nor aiboard's solution."*
> > — the owner of both projects, 2026-09-18, relayed verbatim

Every comparison point in §4 and every open question in §6 carries an explicit **NEITHER** row. If a point's binary framing is itself the mistake, say so — that is a useful answer, not a refusal to answer.

### 2. Everything is on the table

The owner was asked directly whether fkit's own layout was protected — its four-digit task ids, its folder structure. His answer, verbatim from the option he selected:

> *"Follows from what you asked for: an expert that can propose something neither of us built can't be fenced off from half the design. The one thing that stays fixed is your standing constraint — aiboard must remain usable by someone with no framework."*

So: **nothing about either data model is protected from redesign.** Not fkit's four-digit ids, not its folder layout, not its status vocabulary, not its markdown-table boards, not aiboard's `T-`/`S-` prefixes, not its folder-as-status rule, not its front-matter dialect.

**Exactly one constraint is fixed** (§5.1): **aiboard must remain useful to someone who has no fkit and no framework at all.** The owner has never withdrawn it.

### 3. Who wrote this, and why neither author is neutral

This report is **co-authored by the two invested parties**. **Neither is disinterested.** Each described its own system, so that neither mischaracterises the other — but each is also advocating.

| Section | Drafted by | Status |
|---|---|---|
| Header, §1, §2 | `fkit-architect` (fkit side) | fkit-side authorship |
| §3a — aiboard's data model | **`aiboard-lead`** (aiboard side) | ⭐ **VERBATIM — reproduced unedited** |
| §3b — fkit's data model | `fkit-architect` (fkit side) | fkit-side authorship, factual, no advocacy |
| §4 — each point's *"aiboard-lead's position"* block | **`aiboard-lead`** | ⭐ **VERBATIM — reproduced unedited** |
| §4 — each point's *"fkit's position"* block | `fkit-architect` | fkit-side authorship, advocacy |
| §5, §6 | `fkit-architect`, incorporating aiboard-lead proposals marked as such | mixed, attributed inline |
| §7a — aiboard's limitations | **`aiboard-lead`** | ⭐ **VERBATIM — reproduced unedited** |
| §7b — fkit's limitations | `fkit-architect` | fkit-side authorship |

⭐ **Every block marked VERBATIM is another project's lead describing its own system in its own words.** It has not been summarised, re-rendered, reworded, or stylistically corrected. Where the fkit side disagrees with something inside a verbatim block, the disagreement is written **around** it in a clearly-marked `⟦fkit-side note⟧`, never inside it.

### 4. The review chain you sit in

1. **Codex** reads this report first. Its findings are folded back into this file.
2. **Then you** — a session named `fkit-external-expert` — read the amended file and make the call.

Neither lead can overrule you, and neither lead has a channel to the owner during your read.

⏱ **STATUS, 2026-09-18: step 1 is complete.** Codex has read this report and its findings are folded in — see **§0.8** immediately below for the headline and a calibration result on Codex itself, and **§8** for its complete verbatim text. **You are step 2.**

### 5. ⚠️ One live scheduling consequence of "everything is on the table"

fkit has an open, unstarted task **`0383` — "Shrink the Backlog board, whose Task cells are being used as a document store"**. It proposes to restructure the very board whose size §2 measures.

⛔ **`0383` is conflicting work and must not run concurrently with this evaluation**, because your answer may delete that board's shape entirely — in which case shrinking it is wasted work, and worse, a partly-shrunk board would invalidate the measurements you are reading. It is flagged here so the owner can hold it.

### 6. Measurement provenance — read the legend, the figures are not all equal

| Tag | Meaning |
|---|---|
| **[M]** | **Measured by `fkit-architect`, 2026-09-18**, in the fkit repository. The exact command is given, in §2 or Appendix A. Re-runnable. |
| **[A]** | **Reported by `aiboard-lead`.** Not verified by the fkit side. Treat as that project's own claim about its own system. |
| **[A✓]** | Reported by `aiboard-lead` **and spot-checked by `fkit-architect`** against the aiboard repository (read-only access granted by owner ruling). |

### 7. ⛔ THE WORLD CHANGED WHILE THIS REPORT WAS BEING WRITTEN — read this before §4.1 and §5.5

⭐ **Between the drafting of §4.1 and the completion of this file on 2026-09-18, a parallel fkit session repaired two of the three drifted records under a one-time owner ruling.** This report follows fkit's house practice — **annotate, never rewrite** — so the affected sections are left as written and carry dated correction blocks. Summary, so you are not ambushed:

- **`0021` and `0041` now read `✅ Done`.** Their `## Status` was repaired on 2026-09-18 [M].
- **`0014` still reads `🔲 Backlog` and was deliberately left alone.** One drifted record remains.
- **The repair required an owner ruling that created a one-time bypass of fkit's own close gate**, recorded as an addendum to ADR-033. ⭐ **That event is itself evidence for §5.5 and for Q1, and it arrived after both were drafted.** See §4.1.3 and §5.5.1.
- **It independently confirms §4.1.1's born-wrong finding**, in the addendum's own words: *"They were born wrong, not drifted."*

⚠️ **Every figure in this report carries its counting rule.** This is not pedantry. During this very investigation a chars-vs-bytes confusion produced a false "discrepancy" between two measurements of the same object, and a separate relayed figure of *"51 rows"* could not be reproduced under **three** different counting rules and had to be withdrawn. Two figures that had been flagged as **unreconciled** are **reconciled in §2.4 of this report** — both turned out to be counting-rule differences, not disagreements about the world.

### 8. ⭐ STAGE ONE OF YOUR REVIEW CHAIN IS DONE — Codex has read this report, and it rejects the premise of the exercise

⏱ **Added 2026-09-18 by `fkit-architect`, after this report was drafted and after Codex read it. Nothing written earlier has been rewritten. This is a fold, not a revision.**

Per §0.4, **Codex** — a non-Claude model, independent of both leads and of the model family that wrote most of this file — read this report in full and answered **all ten comparison points and all twelve open questions**. Its findings are folded in as **§8**, reproduced **verbatim and unedited**, and a dated pointer under every point and every question takes you straight to its verdict on that point.

**Its headline, verbatim:**

> **Headline — the real problem is not the data model**
>
> Do **not** converge or migrate the two stores yet. The report combines three separate problems—fkit stores essays inside board cells, aiboard has an O(n²) snapshot implementation, and their write/governance paths differ—and treats them as one schema problem. They are not. Fix the renderer/index, introduce a read-only compatibility adapter, and test the UI against the existing 404-task tree first. A 404-task migration, full event sourcing, ID rewrites, and write-back are not justified by the evidence. The right target is not "one source of truth"; it is **one declared authority for each kind of fact**, with generated projections, a separate audit record, stable documents, and one transactional command path.

⭐ **It chose NEITHER on nine of the twenty-two items** — comparison points 1, 5 and 9, and questions Q1, Q3, Q5, Q9, Q11 and Q12. **That is the owner's "you may choose NEITHER" clause of §0.1 working exactly as he intended, in the hands of a reader who owed nothing to either lead and had never spoken to one.**

⛔ **Codex's bottom line, verbatim:** *"I would not approve the convergence migration."* It wants a **read-only adapter spike** against the real 404-task tree first, and says the final decision-maker should *"approve a read-only integration spike and reject any big-bang migration until that spike is benchmarked and used by the owner."*

⚠️ **Do not read §8 as a footnote to the two leads' positions.** It disagrees with **both**, on the record, under its own heading *"Where I think both authors are wrong."* The fkit side's response is quarantined in **§8.3**, placed deliberately *after* Codex's complete text so that it cannot blunt it on the way in.

#### ⭐ 0.8.1 — HOW MUCH TO TRUST CODEX: a calibration result, disclosed against our own interest

⛔ **Read this before you weight anything in §8.**

`aiboard-lead` proposed, and `fkit-lead` adopted, treating a **defect already known to be present in this file** as an unannounced calibration probe on Codex. The defect: **§1.3 said only that aiboard is an untested MVP, while §7a says its comments feature is *"implemented and unit-tested"*** — a two-statement internal contradiction held across two distant sections. **Both leads knew the answer before Codex read the file**, so whether Codex flagged it unprompted is a clean measurement of its claim-checking rather than a guess about it.

**Result: Codex did not flag it.** `fkit-lead` searched Codex's output for the finding. It is not there.

**What Codex did catch, and caught well:**

| Codex found | Where, in its text | Was it right? |
|---|---|---|
| The post-repair status totals were never propagated — the corpus is **270 done / 115 backlog / 19 cancelled**, not 268/117/19, and *"188 of 268"* is a stale denominator (188/270 = 69.6%) | its item **8** | ✅ **Yes. Independently re-measured and fixed in this pass** — see §3b.5's figure-correction block |
| Q12 repeats **3.75%** as though it were the migration-wide error rate: 3 of the 80 done-board briefs is 3.75%, 3 of all 101 briefs the migration touched is **2.97%** | its item **7** | ✅ **Yes. Independently re-measured and fixed in this pass** — see §4.1.1 and Q12 |
| Several unsupported causal inferences, including *"under a single-carrier model the wrong value could not have been written"* and *"a typed event would have exposed entry into `done/` on day one"* | its items **3**, **6** and its closing "claims I would not rely on" list | ✅ **Largely yes** — §8.3 concedes these and pushes back on exactly one |
| A long list of report claims that are hearsay or unverified | its closing section | ✅ **Yes**, and it overlaps heavily with what §7b had already declared against itself |

**Its nearest miss:** Codex wrote *"every behavioral claim about aiboard is effectively hearsay in this report."* That is **adjacent to** the §1.3 defect and is **not** the same finding — it is a blanket provenance warning about aiboard claims in general, not the detection of two statements inside this document contradicting each other.

⭐ **The fair reading, stated rather than editorialised around: Codex's arithmetic and its inference-checking are strong; it missed a two-statement internal contradiction held across distant sections.** Weight its numeric and logical objections accordingly — and **do not infer that a factual claim in this report is sound merely because Codex did not challenge it.**

⚠️ **A second calibration datum, found during this fold and also missed by Codex.** §3b.5's own breakdown never summed. It read *"the 268 `✅` briefs, 188 carry the … marker and 77 read plain `✅ Done`"* — and **188 + 77 = 265, not 268.** Three briefs read `✅ Done — <trailing prose>` and belonged to neither bucket. **Codex caught that the total was stale. It did not catch that the breakdown of that total did not add up.** Corrected in §3b.5.

#### ⛔ 0.8.2 — A disclosure you are owed: Codex read a defective copy of this report

**Codex read a version of this file that still contained the §1.3 defect.** §1.3 has since been corrected — see the dated block there: aiboard is untested **in the owner's hands**, while its **code** carries a passing 41-test suite.

⚠️ **That may have led Codex to under-weight §3a** — aiboard's own description of its own data model — and to state aiboard's maturity more harshly than the evidence supports. **You are reading a corrected §1.3. Codex was not.**

⭐ **This was `fkit-lead`'s deliberate decision, not an oversight.** It declined to edit the file while a reader was mid-analysis, on the reasoning that a document which changes under a reviewer produces findings that cannot be attributed to any version of it. **The cost of that decision is recorded here so that you can discount for it rather than discover it.**

---

## §1 — What both projects are

*(Written by `fkit-architect`. Assumes you know nothing about either.)*

### 1.1 The situation in three sentences

One person owns both projects and is the **only user of either**. He builds software with the help of AI agents. He has two pieces of machinery — one that organises the *agents*, one that shows a *human* what the agents are doing — and they have independently grown near-identical concepts of "task", "sprint" and "status", stored in incompatible ways.

He wants to know which representation to keep. Or whether to keep either.

### 1.2 fkit — a team of role-scoped AI agents

**What it is.** fkit is a framework that installs into a software project and gives it a *team* of AI agents with **separate, enforced authority** instead of one general-purpose coding assistant. Today there are **seven roles**: a **producer** (product and sprint planning; owns the task lifecycle), a **coder** (the only role allowed to write source code), a **reviewer** and an **adversarial reviewer** (the second one deliberately runs on a *different* AI model for genuine perspective diversity), an **architect** (designs, never implements), a **wiki librarian** (the only role that may write the project's knowledge vault), and a **lead** (the front door; spawns and drives the others).

**The core idea.** The same context that wrote the code must not be the context that approves it. fkit makes that a fact of the runtime rather than a request in a prompt: launching `fkit coder` opens a session **pinned** to the coder's role, and a background enforcement hook **denies** that session from running the reviewer's procedure — at any depth, even when one agent spawns another. *(ADR-010, "Role separation is enforced structurally, not by instruction"; ADR-018.)*

**Where the data lives.** Everything is **files in git** inside a directory called `ai-agents/` in the consuming project. There is no database, no server, no daemon. Coordination between agents happens by reading and writing markdown.

**Scale, measured. [M]** 290 commits; first commit 2026-07-03, so **77 days old**. 404 task folders. 11 sprint board files. 48 architecture decision records. It runs on itself — the repository you would be reading *is* a fkit project, and its own `ai-agents/` tree is the data described in §3b.

**Implementation.** Claude Code subagent definitions (markdown), `/fkit-*` skills (markdown procedures), and a handful of shell/Node scripts. Node is the runtime dependency.

### 1.3 aiboard — "Jira for AI agents"

**What it is.** aiboard is a **file-based issue tracker**. Tasks and sprints are directories; markdown files inside them are the only database. It has a command-line interface, an HTTP server with a **browser board you can drag cards around on**, and a machine-to-machine interface for AI agents.

**Why it exists — the owner's own words, relayed:**

> *"it's hard for humans to understand the status of the sprint and tasks, and it would be much easier if we had something like Jira or Trello for tasks that regular humans can open in the browser and check the cards, their statuses, maybe change something like change the status or like move something from one sprint to another."*

That is the whole motivation. fkit's agents can read fkit's boards perfectly well. **A human cannot** — §2.1 measures exactly how badly.

**Scale, measured. [A✓]** 2,221 lines of Python in the package (plus 720 lines of tests), standard library only, **zero third-party dependencies**, Python ≥ 3.9. Its own board holds **21 tasks** (3 backlog, 17 done, 1 cancelled) and 3 sprints. Its HEAD at the time of writing is `df554b9`.

**State.** MVP. The owner has said he has not tested it himself yet.

> #### ⏱ CORRECTION, 2026-09-18 — added after §1.3 was written, by `fkit-architect`, on a finding volunteered by `aiboard-lead` and on wording accepted by `fkit-lead`. The sentence above is left unchanged.
>
> ⚠️ **As written, that sentence was a mischaracterisation of aiboard by omission — and it made this report contradict itself.** §7a states that aiboard's comments feature is *"implemented and unit-tested"*; §1.3 left the reader with "untested MVP" and nothing else. **Both cannot be the reader's takeaway.**
>
> **The correct statement.** The **owner** has not exercised aiboard himself. The **code** carries a **passing 41-test suite** — `python3 -m unittest discover -s tests`, ~3.3 s, covering the store, the CLI, the HTTP server and the MCP protocol (`test_board.py` 460 lines, `test_mcp.py` 145, `test_server.py` 115), measured at HEAD `df554b9`. ⭐ **The untested thing is real-world use, not the code paths.**
>
> **Provenance, split precisely.** The suite's existence, composition and line counts are **[A✓]** — `fkit-architect` independently counted **41** `def test_` methods across those three files at `df554b9`, and the three line counts (460 / 145 / 115 = 720 total) match `aiboard-lead`'s figures exactly. ⚠️ **The fkit side did not execute the suite.** The *pass* and the *~3.3 s* remain **[A]** — `aiboard-lead`'s claim about its own system, unverified by fkit.
>
> ⛔ **§7a's real limitations are untouched by this and still stand in full:** 21 tasks on its largest real board, exactly one user, **never read by a non-agent human**, and **zero `comments.md` files** — so the comments channel is unit-tested and never exercised. A passing test suite is evidence about code paths. It is not evidence about use.

### 1.4 The relationship the owner wants

Three statements from him, in his own words, which together define the shape of any answer:

1. **fkit would consume aiboard as a dependency** — aiboard becomes fkit's human-readable view.
2. **aiboard must be usable without fkit** — *"it's like some module that we will attach to fkit, but other people can attach the same module to other projects even if they just don't have any framework or system, but it might still be useful for them."*
3. **But convergence is now two-way.** After the above, he added: *"right now, both fkit and aiboard are only used by me. So we are very flexible about what we are doing here. At this moment we can basically make sure they match each other, and we can adapt them to our needs to make sure they work together seamlessly."*

⚠️ **Statements 2 and 3 are in tension and the tension is not resolved.** Statement 2 points the adaptation one way (fkit bends, aiboard does not). Statement 3 invites movement on both sides. The working reconciliation the two leads have been operating under — **and it is the leads' construction, not the owner's ruling** — is:

> Convergence may change **shared, generic** board concepts (id format, folder layout, status names, where a sprint lives). It may **not** push fkit's **governance** concepts (its role model, its four "mover" procedures, its literal audit marker) into aiboard's core.

⛔ **If your recommendation cannot be placed cleanly on one side of that line, say so explicitly** — it is then an owner question, not something either lead may settle.

### 1.5 Work already sequenced (context, not constraint)

The owner ruled that aiboard will be **ported from Python to Node** so that both projects depend only on Node. That port is aiboard-side work, tracked on aiboard's own board, and is **independent of this report**. Your recommendation should be about the **data model**, not the language.

---

## §2 — The concrete problem: two measured facts

There are two independent, measured failures. One on each side. They are what make this more than a tidiness exercise.

### 2.1 Fact one — a human cannot read fkit's board

fkit's largest board is a **single markdown file containing one markdown table**. It is the default home for every task brief that has been written but not scheduled into a sprint.

**All figures below are [M] — measured by `fkit-architect` on 2026-09-18. Each carries its counting rule.**

| Figure | Value | Counting rule — exactly how it was obtained |
|---|---|---|
| File on disk, **working tree** | **858,948 bytes** | `wc -c ai-agents/sprints/backlog.md` |
| File on disk, **at git HEAD** | **857,403 bytes** | `git show HEAD:ai-agents/sprints/backlog.md \| wc -c`. The 1,545-byte difference is one uncommitted new row. |
| File in **Unicode code points** | **841,505** | UTF-8 decode, then `len()`. ⚠️ **This is the chars-vs-bytes trap**: the same file is "841,505 characters" and "858,948 bytes". Both are true. Neither is a discrepancy. |
| Total lines | **606** | `wc -l` |
| **Rendered board output** | **441,959 bytes, 239 lines** | `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md \| wc -c`. ⭐ **This reproduces the previously-relayed figure exactly.** "Rendered" means the stdout of fkit's own deterministic board renderer — not a markdown-to-HTML render. |
| Table **data rows** | **234** (working tree) / **233** (HEAD) | Lines beginning `\|`, minus 2 separator rows, minus **2** header rows. ⚠️ See the rule note below. |
| Longest single table cell, **raw file** | **17,577 bytes** / **17,189 code points** unstripped; **17,575 bytes** / **17,187 code points** after stripping the cell's surrounding spaces | 4th pipe-delimited field of each row. ⭐ **This is the cell for task `0306`** — independently the same row a separate fkit investigation found on 2026-09-10. |
| Longest **rendered** line | **15,650 bytes** | longest line of the `dashboard.sh` stdout above |
| Longest **rendered** cell | **15,377 bytes** / **15,000 code points** stripped | the row for task `0305` |
| Rows reading `🔲 Backlog` in the render | **115 lines contain the glyph** | `grep -c '🔲'` on the rendered output |

⚠️ **The data-row counting rule matters and the difference has been identified.** The file contains **two** tables: the task table (232 task rows in the working tree) and a small unrelated 2-row table further down. A previously-relayed count of **234** excluded only the *first* table's header line and therefore counted the second table's header as data. Under the stricter rule (exclude both headers) the count is **233 at HEAD / 234 in the working tree**. **The board is the same size either way.** This is recorded so the expert is not misled into thinking two people disagreed about the world.

**What the size actually means.** 829,859 of the 858,948 bytes — **96.6%** — are inside table data rows [M]. The Task column alone accounts for **688,283 bytes** of the 827,361 bytes of task rows at HEAD — **83%** [M]. In other words: **the board is not a board. It is a document store with a table wrapped around it.** Individual cells carry owner rulings with verbatim option labels, dated corrections, measured figures and multi-paragraph rationale, because a table cell was the only place that text could go without creating another file.

fkit already knows this. Task `0383` exists to fix it, and was filed after **the board became too large to render in a chat message** — a symptom, not a measurement anyone set out to take. ⛔ **`0383` is the task §0.5 says must not run concurrently with your review.**

### 2.2 Fact two — aiboard's snapshot is O(n²)

**⚠️ ATTRIBUTION: this was measured by `aiboard-lead`, not by the fkit side. [A]** fkit did not reproduce it and does not vouch for it.

aiboard's browser board polls a single endpoint every **3 seconds**. That endpoint calls `Board.snapshot()`. `aiboard-lead` measured it against a **synthetic board built from fkit's real task content**:

| Tasks on the board | `Board.snapshot()` wall time |
|---|---|
| 234 | **232 ms** |
| 405 | **611 ms** |
| 800 | **2,186 ms** |

One snapshot call invokes aiboard's directory scanner **28,543 times**. `aiboard-lead` filed the defect on its own board as `T-021` and describes the cause in that task's own title: *"sprint_progress re-scans the tree per task"*.

⚠️ **Read the benchmark's own caveats in §7a** — `aiboard-lead` volunteers that the synthetic board put every task in **one** sprint, which is the **worst case** for the quadratic path, that the page cache was warm, and that HTTP serialisation was excluded.

**Why it belongs in this report.** aiboard's board today holds 21 tasks. fkit's holds 404 and grows. The human-readable view that fkit wants to adopt **has not been run at fkit's scale**, and at fkit's scale on a 3-second poll it would spend a fifth of every poll interval inside one function. Whatever data model you recommend, it has to survive 400+ tasks and keep growing.

### 2.3 The third fact, which is the one that actually connects them

Both failures have the same shape: **a read that is O(everything) because the storage has no index and the renderer walks the whole corpus.** fkit's board is one file rewritten whole on every row change; aiboard's snapshot re-scans the whole tree per task. A data model that fixes one and not the other has fixed half the problem.

### 2.4 ⭐ Two previously-unreconciled figures, now reconciled

`aiboard-lead` closed its own limitations section with: *"One measurement remains unexplained. The 15,650-char figure from 2026-09-16 is not accounted for."* fkit's own task `0404` brief records the same figure as **not reconciling**.

**It is accounted for now. [M]**

- **15,650** is the **longest line, in bytes, of `dashboard.sh`'s rendered stdout**. It is not a raw-file measurement at all. fkit's renderer collapses every cell to a single line and truncates at the first *period-space* clause boundary, so a rendered cell is generally shorter than the raw cell it came from: raw longest cell **17,577 bytes**, rendered longest cell **15,377 bytes**, rendered longest *line* **15,650 bytes**.
- **17,187 vs 17,577** were always the same cell, measured three ways: **17,187** stripped code points, **17,189** unstripped code points, **17,575** stripped bytes, **17,577** unstripped bytes. All four are the task `0306` row.

⭐ **Neither figure was ever wrong. Both were measurements of different things under unstated rules.** This is the single strongest practical argument in this report for the discipline it asks of you: **state the counting rule with every number.**

---

## §3 — The two data models, side by side

Each side describes its own system. Neither describes the other's.

---

### §3a — AIBOARD'S DATA MODEL

> ⭐ **EVERYTHING BETWEEN THE DOUBLE RULES BELOW IS `aiboard-lead`'s OWN TEXT, REPRODUCED VERBATIM AND UNEDITED.**
> It is another project's lead describing its own system. Its words about its own system are better evidence than any paraphrase of them. fkit-side commentary appears only *after* the closing rule, clearly marked.

═══════════════════════════════════════
§3 — AIBOARD'S DATA MODEL (factual, no advocacy)
═══════════════════════════════════════

**What it is.** A file-based issue tracker. Tasks and sprints are directories; Markdown files inside them are the only database. 2,221 lines of Python, standard library only, Python ≥3.9, no third-party dependencies.

**The board root** is a directory holding `aiboard.json` plus `tasks/` and `sprints/`. The CLI finds it by walking up from the current directory the way git finds `.git`. An `aiboard.json` containing `{"board": "some/path"}` acts as a pointer, so a project can keep its board in a subfolder and still resolve it from anywhere in the tree.

**Layout.**
```
<root>/aiboard.json
<root>/tasks/{backlog,in-progress,done,cancelled}/T-001-some-slug/brief.md
                                                                 /worklog.md
                                                                 /comments.md
<root>/sprints/{backlog,in-progress,done,cancelled}/S-001-some-slug/sprint.md
```

**Status.** Four values — `backlog`, `in-progress`, `done`, `cancelled` — the same set for tasks and sprints. The parent directory is the only place status is recorded. No file contains a status field. A status change is a directory move.

**Task files.** `brief.md` is required and holds the task's metadata and description. `worklog.md` is created with the task. `comments.md` is created on first comment. Both logs are append-only sequences of `## <ISO-8601 Z timestamp> — <author>` sections. The worklog is the worker's record; aiboard appends to it automatically on status change, assignment and blocking. Comments are the discussion channel with humans.

**A real `brief.md`, verbatim:**
```
---
id: T-021
title: "Snapshot is O(n^2): sprint_progress re-scans the tree per task"
sprint: S-003
priority: high
assignee: 
labels: []
blocked_by: []
created: "2026-09-18T09:29:57Z"
updated: "2026-09-18T09:29:57Z"
---

# Snapshot is O(n^2): sprint_progress re-scans the tree per task

Measured 2026-09-18 against a synthetic board built from fkit's real task content...
```
Fields: `id`, `title`, `sprint` (a sprint id or empty), `priority` (`low`/`medium`/`high`), `assignee` (free text, unvalidated), `labels` (list), `blocked_by` (list of task ids), `created`, `updated`.

**The front-matter dialect is a hand-written subset of YAML**, not YAML: scalars, inline lists `[a, b]`, and block lists. No nesting, no anchors, no multi-line scalars. It exists so the tool can stay dependency-free. It has at least one ambiguity resolved by lookahead — a key with an empty value is either a null scalar or the start of a block list, decided by the next line.

**`sprint.md`** carries `id`, `title`, `goal`, `start`, `end`, `tasks` (a list of task ids), `created`, `updated`, plus a body whose `## Tasks` checklist the tool regenerates.

**Derived, never stored:** `blocked` (true while any blocker is not done/cancelled), `needs_reply` (latest comment's author differs from the assignee), `stale` (in-progress with no worklog entry or comment newer than `stale_after_hours`, default 24), and all sprint progress counts and percentages.

**Stored twice:** sprint membership. The task's `sprint:` field and the sprint's `tasks:` list both record it. `aiboard check` detects disagreement and `--fix` repairs the sprint side. *(Stated here as fact; I return to it in §7.)*

**Configuration** is `aiboard.json`. Exactly two keys are read anywhere in the codebase — `name` and `stale_after_hours` — plus the optional `board` pointer used only during discovery. The status vocabulary, the directory names, and the id pattern `^([A-Z])-(\d+)(?:-(.*))?$` are module constants, not configuration.

**Three access paths, all calling the same store methods:** a CLI (`init`, `task`, `sprint`, `board`, `info`, `check`, `agents-md`, `mcp`, `serve`, with `--json` everywhere); an HTTP server with a browser board (default `127.0.0.1:8484`, read-write, `--read-only` available); and an MCP stdio server exposing 19 tools on protocol 2025-06-18.

**Concurrency:** one advisory `fcntl` lock file at the board root, taken by every mutating method, reentrant within a process. Where `fcntl` is unavailable (Windows) the lock silently becomes a no-op.

**The browser UI** is 397 lines of vanilla JavaScript against the JSON API. It polls `/api/board` every 3 seconds. It supports drag-between-columns, which issues a status change.

**Consistency checking.** `aiboard check` reports: duplicate ids, missing `brief.md`/`worklog.md`, front-matter id disagreeing with the folder id, self-blocking, blockers pointing at missing tasks, dependency cycles, in-progress tasks that are blocked, stale in-progress tasks, task↔sprint membership disagreement, and sprint checklists that have gone stale.

═══════════════════════════════════════

> ⟦**fkit-side note on §3a** — added by `fkit-architect`, outside the verbatim block, changing nothing inside it.⟧
>
> **Spot-checks performed against the aiboard repository** (read-only, HEAD `df554b9`), all of which **hold** [A✓]: package source is **2,221 lines** of Python (tests a further 720); **zero** third-party dependencies; `requires-python = ">=3.9"`; the `tasks/` and `sprints/` trees have exactly the four status directories described; the board holds **3 backlog + 17 done + 1 cancelled = 21 tasks** and 3 sprints; and there are **zero `comments.md` files** anywhere on it, corroborating §7a's disclosure that the comments feature has never been exercised.
>
> **One fkit-side observation, offered as a question rather than a correction:** §3a says the id pattern and the status vocabulary are *"module constants, not configuration."* That is a **structural** statement, and it is the thing §4.2's and §4.3's "neither" proposals both want to change. An expert weighing "make it configurable" should know it is currently one regex and one tuple, not a subsystem.

---

### §3b — FKIT'S DATA MODEL

*(Written by `fkit-architect`. **Factual description, no advocacy** — fkit's arguments are in §4, separated on purpose. Every figure is [M].)*

#### 3b.1 The tree

Everything lives under one directory in the consuming project:

```
ai-agents/
├── README.md
├── tasks/
│   ├── README.md
│   ├── backlog/     114 task folders
│   ├── done/        271 task folders
│   └── cancelled/    19 task folders
├── sprints/
│   ├── backlog.md          the standing unsprinted board — 858,948 bytes
│   ├── sprint-11.md        the one live sprint board — 19,854 bytes
│   ├── done/               9 archived sprint boards — sprint-1.md … sprint-9.md
│   ├── cancelled/          1 archived board
│   └── reviews/            review ledgers not tied to one task
├── knowledge-base/
│   ├── PROJECT.md          the prose product brief
│   ├── architecture.md     the technical description
│   ├── decisions/          48 architecture decision records (ADRs)
│   ├── conventions/        11 standing rules
│   ├── reports/            dated artifacts of work performed (this file)
│   ├── incidents/ history/
└── wiki-vault/             a synthesized knowledge wiki, written by one role only
```

⚠️ **Note the asymmetry with aiboard immediately:** `tasks/` has **three** boards, not four. fkit has **no `in-progress/` directory**. A task that is being worked on stays in `backlog/`. Only the two *terminal* states have their own directory.

#### 3b.2 A task is a folder

```
ai-agents/tasks/<board>/<NNNN>-<slug>/
├── brief.md      REQUIRED — always present
├── plan.md       optional — the approved implementation plan
├── worklog.md    optional — the running work record
├── review.md     optional — the two-party review ledger
└── assets/       optional — fixtures, screenshots, reference material
```

Those five names are **reserved**. A folder without `brief.md` is malformed and is reported as drift.

**Adoption of the optional artifacts, measured across all 404 task folders [M]:**

| Artifact | Folders containing it | Share |
|---|---|---|
| `brief.md` | **404** | 100% |
| `review.md` | **156** | 38.6% |
| `worklog.md` | **137** | 33.9% |
| `plan.md` | **130** | 32.2% |
| anything else | **1** (`canary.sh`, a test fixture) | 0.2% |

*(These confirm the figures `aiboard-lead` reported. [M], independently.)*

#### 3b.3 The id: four digits, zero-padded, permanent, never reused

`0001` … `9999`. The next id is **1 + the highest id that has ever existed across all three boards** — never reused, never renumbered, never recycled from a cancelled task. Zero-padded so that lexical sort equals numeric sort.

The id is carried in **two** places: the **folder name's prefix**, which is authoritative, and the brief's `## ID` field, which is the redundant second carrier. A drift check named `id-mismatch` reconciles them.

*(ADR-029, §Decision 3: *"Next ID = 1 + the highest ID that has ever existed, across all three boards. Never reused, never renumbered, never recycled from a cancelled task."*)*

**Uniqueness is detection, not prevention.** Two git branches can each allocate `0095`, produce different folder names, and merge with no textual conflict. fkit accepted that rather than build a locking protocol, and mitigates with a duplicate-id assertion in its test suite. *(ADR-029, §Decision 3, "The cross-branch race is accepted, not eliminated".)*

#### 3b.4 `brief.md` — sections, not front matter

There is **no front matter**. A brief is plain markdown whose `## Section` headings are the fields. Measured across all 404 briefs [M]:

| `## Heading` | Present in | Character |
|---|---|---|
| `## ID` | **404** (100%) | a field |
| `## Sprint` | **404** (100%) | a field |
| `## Status` | **404** (100%) | a field |
| `## Owner` | **404** (100%) | a field |
| `## Context` | **404** (100%) | prose |
| `## Verification steps` | **404** (100%) | prose |
| `## Notes` | **404** (100%) | prose — **and it also carries the dependency fields** |
| `## What to build` | **400** (99.0%) | prose |
| `## Priority` | **398** (98.5%) | a field |
| 80 other distinct headings | ≤ 2 each | ad-hoc prose sections |

So: **five of the nine common headings are single-line scalar fields wearing heading clothes**; four are genuinely prose; and the corpus contains **89 distinct `##` headings** in total, of which 80 appear in at most 2 files.

A real brief's field block, verbatim from task `0404`:

```markdown
# Evaluate aiboard as fkit's human-readable board, and design the fkit↔aiboard integration seam

## ID
0404

## Sprint
Sprint 11

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context
...
```

#### 3b.5 `## Status` — a six-value vocabulary that is empirically a three-value field

fkit's documented task-status vocabulary has **nine written forms**, which collapse to about six statuses if you fold the two agent-closed variants and the two `Moved` forms together:

| Written form | Who may set it |
|---|---|
| `🔲 Backlog` | producer |
| `🔄 In progress` | **anyone, freely** |
| `🚧 Blocked — <reason>` (reason mandatory) | **anyone, freely** |
| `✅ Done` | producer only, **via a skill**, owner present |
| `✅ Done (agent-closed — not owner-verified)` | a **spawned** producer, via the same skill |
| `⛔ Cancelled (YYYY-MM-DD) — <reason>` | producer only, via a skill |
| `⛔ Cancelled (agent-closed — not owner-verified) (YYYY-MM-DD) — <reason>` | a **spawned** producer |
| `➡️ Moved to [Sprint N](…) — priority M` | producer |
| `➡️ Moved to [Backlog](backlog.md)` | producer |

*(`task-status-vocabulary.md`, §"The statuses": "**No other value is valid.** Not 'Not started', not 'WIP', not 'Todo', not 'Complete'.")*

**What the 404 briefs actually contain, measured [M]:**

| Glyph in `## Status` | Count |
|---|---|
| `✅` (Done, in all variants) | **270** ⏱ |
| `🔲 Backlog` | **115** ⏱ |
| `⛔` (Cancelled, in all variants) | **19** |
| `🔄 In progress` | **0** |
| `🚧 Blocked` | **0** |
| `➡️ Moved` | **0** |

> #### ⏱ FIGURE CORRECTION, 2026-09-18 — by `fkit-architect`, after the §4.1.3 repair and after Codex flagged the figures as stale (its item 8: *"The corrected status figures were not propagated"*).
>
> ⚠️ **The two rows marked ⏱ read `✅ 268` and `🔲 117` when this section was drafted. Those were correct then and are arithmetically false now**, because the §4.1.3 repair moved `0021` and `0041` from `🔲 Backlog` to `✅ Done`. Re-measured 2026-09-18 [M]: **270 done / 115 backlog / 19 cancelled**, total 404.
>
> ⛔ **This is the one and only kind of edit this fold makes in place.** This report's house rule is *annotate, never rewrite*; the sole exception is a number that is now arithmetically false, and each such number carries a note of what it was. **Nothing else in this file has been restated as though it had always read that way.**
>
> ⚠️ **Do not "correct" §3b.1's folder counts to match these.** They are a different measurement and they did **not** change: `backlog/` **114** folders, `done/` **271**, `cancelled/` **19** [M, re-measured 2026-09-18]. ⭐ **The one-each gap between the folder counts and the `## Status` counts *is* the surviving `0014` drift** (§4.1.3) — a brief reading `🔲 Backlog` inside `done/`. The gap is the defect, not a counting error.

⭐ **Three of the six statuses appear zero times in any brief's `## Status` field today.** A six-value vocabulary is, in the briefs, a three-value one.

⚠️ **But that statement must be qualified in three ways, or it misleads:**

1. **`➡️ Moved` is heavily used — on *boards*, not in briefs.** Across all 11 board files there are **539 task rows** for **404 tasks** [M], and **113** of those rows carry `➡️ Moved` as their status. `Moved` is a *row disposition* — a forwarding address left behind when a task is pulled from one board to another — and it exists **because** board rows live in per-sprint files. It is not a task state.
2. **`🔄 In progress` has been used historically.** At the folder-migration commit `331f298` (2026-07-21), task `0078`'s brief read `🔄 In progress` [M]. It is zero *today*, not zero *ever*.
3. **`🚧 Blocked` appears in prose in 44 task files** [M] as a decorative emphasis glyph, but in **zero** `## Status` fields. The glyph is in use; the status value is not.

**Of the 270 `✅` briefs, 188 carry the `(agent-closed — not owner-verified)` marker and 79 read exactly `✅ Done`** [M, re-measured 2026-09-18] — meaning **69.6% of fkit's completed tasks were closed by an agent on its own judgment, with no human verification, and say so.** §5.3 explains why that marker exists.

> #### ⏱ FIGURE CORRECTION AND A SELF-AUDIT FINDING, 2026-09-18 — `fkit-architect`. What the sentence above said when drafted, and what was wrong with it beyond the stale total.
>
> **It read:** *"Of the **268** `✅` briefs, 188 carry the … marker and **77** read plain `✅ Done`."*
>
> Two things were wrong, and Codex caught only the first.
>
> 1. ⏱ **Stale total.** 268 → **270**, and the derived share 70% → **69.6%** (188/270). This is Codex's item 8, which also names the stale denominator *"188 of 268"* directly. ✅ Verified and corrected.
> 2. ⚠️ **The breakdown never summed, at either total.** 188 + 77 = **265**, not 268. Re-measured: **188** carry the marker; **79** briefs read the exact string `✅ Done`; and **3** read `✅ Done — <trailing prose>` (two are *"verified complete in code by the 2026-07-11 doc-drift audit…"*, one is *"the owner ruled 2026-07-13 for the producer's recommendation…"*). 188 + 79 + 3 = **270**. ⛔ **Those three briefs fell out of both buckets because the original count matched the plain form exactly.** ⭐ **This is itself evidence for §4.1's argument in an unexpected direction: the `## Status` field's high-cardinality tail (§4.1, fkit's point 1) is real enough that fkit's own architect mis-bucketed it while measuring it.**
>
> ⚠️ **Codex did not catch (2).** It is recorded as the second calibration datum in §0.8.1.

#### 3b.6 `## Owner` is a role, not a person

Measured across all 404 briefs [M] — **five values, all of them fkit role names, no humans, no free text:**

| `## Owner` | Count |
|---|---|
| `fkit-coder` | **246** |
| `fkit-architect` | **92** |
| `fkit-wiki` | **36** |
| `fkit-producer` | **26** |
| `fkit-reviewer` | **4** |

*(Confirms `aiboard-lead`'s figures exactly. [M], independently.)*

#### 3b.7 Dependencies — a stored bidirectional edge, in prose

A brief records dependencies inside its `## Notes` section, as bullets:

```markdown
- **Depends on:** 0110 (evolved lead) and 0112 (wiring).
- **Blocks:** 0119.
```

Measured [M]: **362 of 404** briefs carry a canonical-form `Depends on:` line; **270** carry a `Blocks:` line.

Both directions are **stored**. Nothing derives `Blocks` from the `Depends on` edges.

The value is **free text**, not a list of ids — `nothing`, `0072 — soft, not hard`, and prose explanations are all valid. fkit's board renderer parses it with a text matcher, and fkit has a whole convention page devoted to the grammar because the parser has already silently mis-read it in production: a brief that wrote `- **⚠️ Depends on tasks 82, 83 …**` put a glyph between the bold marker and the label, the parser missed it, the board printed **"nothing blocks this"**, and a human hand-corrected the same row for **seven consecutive status runs** before anyone found the cause. *(`dependency-declaration-form.md`, §"The failure it prevents": "A dependency the record states but the tool cannot see is a dependency the board silently drops.")* There is now a loud `⟨derive: UNPARSEABLE — see brief⟩` guard, which the convention itself describes as *"not prose-proof in general."*

#### 3b.8 Sprints are markdown tables in files, with a status banner on line 3

A sprint is a **single markdown file** containing a header, prose, and one big table. Its own status is a blockquoted H2 on **exactly line 3**:

```markdown
# Sprint 11 — fkit ↔ aiboard convergence — port aiboard to Node, compare the two structures…

> ## 🔄 In progress — 2026-09-18. Opened on an owner ruling of 2026-09-18 — see "Authority" below.
>
> …
## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | — | Add two worked examples to `evidence-before-assertion.md` … | [`0013-…`](../tasks/backlog/0013-…/brief.md) |
```

A sprint has its **own four-value vocabulary**, separate from the task one and sharing its glyphs deliberately: `🔲 Backlog`, `🔄 In progress`, `✅ Done`, `⛔ Cancelled`. `🚧 Blocked` and `➡️ Moved` do **not** exist for a sprint.

⚠️ **The two vocabularies are told apart by POSITION, never by glyph.** `🔲 Backlog` on line 3 means the *sprint* is scoped but not started; the same glyph in a row's leading cell means that *task* is. *(`task-status-vocabulary.md`, §"A SPRINT has its own status": "⭐ **Tell them apart by POSITION, never by the glyph**".)*

**Measured across the 11 board files [M]:** 1 board reads `🔄 In progress`; 2 read `✅ Done`; **7 read a legacy `🔒 CLOSED`** which the grammar reads as `✅ Done` but which nothing may ever write again. The sprint vocabulary itself has historical drift inside it.

Board file sizes on disk [M]: `backlog.md` 858,948 · `sprint-2.md` 571,825 · `sprint-6.md` 151,584 · `sprint-7.md` 128,404 · `sprint-5.md` 106,473 · `sprint-9.md` 90,679 · `sprint-8.md` 65,919 · `sprint-3.md` 40,579 · `sprint-11.md` 19,854 · `sprint-4.md` 19,489 · `sprint-1.md` 14,064.

#### 3b.9 The Backlog board is not a queue

`backlog.md` is the default home for any brief written without a sprint. Measured [M]: **170 briefs** carry `## Sprint: Backlog` (plus 2 legacy `Backlog (unsprinted)`), and **170 briefs** carry `## Priority: Unscheduled`.

⚠️ **The board is unranked, by owner ruling.** Position on it is not a priority signal — it is an archive of known work, not a queue. Priority is a *sprint board* concept, written `P<n>`, and fkit has a standing convention page insisting that **rank is not identity**: *"A number that can change twice in a day cannot identify anything."*

#### 3b.10 ⭐ Status is recorded in up to THREE places, and the duplication is deliberate

This is the single most important structural fact about fkit's model.

| Carrier | Example |
|---|---|
| **The folder** the task sits in | `ai-agents/tasks/done/0021-build-fkit-reconnect-tooling/` |
| **The brief's `## Status` field** | `✅ Done (agent-closed — not owner-verified)` |
| **The board row's leading cell** — and a task can have rows on **more than one board** | `\| ✅ Done \| 9 \| Build `fkit reconnect` tooling … \|` |

**It is deliberate, and fkit's ADRs say why, twice, in as many words:**

> *"The board-as-directory **is** the task's status in the data model: `expected_dir()` and drift rule 3 cross-check the brief's `## Status` against its **location**, catching a brief edited without being moved. A flat layout deletes that cross-check and makes status single-sourced to a text field."*
> — ADR-029, §Decision 2, "The board stays in the path"

> *"Two carriers can drift, and fkit's established answer to that is not 'pick one' but **carry both and lint the disagreement** — exactly as `## Status` duplicates the board's status cell and drift rule 3 reconciles them."*
> — ADR-029, §Decision 5

> *"**The brief and the sprint plan must agree.** Both carry the status; both get updated together."*
> — `task-status-vocabulary.md`, §Rules

⛔ **fkit is not accidentally duplicating status. It chose redundancy-plus-reconciliation over single-sourcing, on the record, as a defect-detection strategy.** Whether that was the right call is §4.1 — and §4.1 carries the measured evidence about whether the detection actually works.

#### 3b.11 What derives, versus what is stored

| Derived at render time | Stored |
|---|---|
| A task's "next step" (`ready` / `after N`), by parsing `Depends on` out of the brief | status (×3), id (×2), sprint membership (×2: the brief's `## Sprint` and the board row), the `Blocks` edge |
| Sprint roll-up counts | |
| The active-sprint selection | |

#### 3b.12 History and auditability

**There is none as data.** fkit's history exists as: git commits; `worklog.md` in 34% of task folders, written as free prose; and dated annotation blocks inside briefs and boards (fkit's house style is *annotate, never rewrite* — a superseded paragraph is left byte-identical with a dated note beside it). **No file anywhere records "this task's status changed from X to Y at time T".** The question *"how long did this sit in review"* is answerable only by reading English or by git archaeology.

---

## §4 — The ten comparison points

Nine were agreed by the two leads. **A tenth — history and auditability — was proposed by `aiboard-lead` as an amendment and accepted by `fkit-lead`.**

Each point has the same shape:

- **Both models** — what each actually does
- **The evidence** — measured, tagged
- **⟦VERBATIM⟧ aiboard-lead's position** — its own words, including **a specific constructed third option** it offers for each of its nine
- **fkit's position** — written by `fkit-architect`, derived, not rubber-stamped, **including fkit-side third options where one is visible**
- **⭐ NEITHER** — the standing invitation, live on every point

---

### Point 1 — Where status lives

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> ⭐ **NEITHER.** A stable task folder plus a structured current-state record (`task.json`); every mutation routed through one transition library that takes the lock, checks a revision, records a recoverable transaction, and appends an audit event.
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 1 — Where status lives"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

**aiboard:** one place. The parent directory. No file contains a status field. A status change *is* a directory move.
**fkit:** up to three places — the folder, the brief's `## Status`, and one or more board rows (§3b.10). Duplication is deliberate, documented, and defended as a drift-detection mechanism.

**Evidence [M]:**
- fkit's `## Status` holds only 3 distinct glyphs across 404 briefs; the folder already encodes exactly that 3-way distinction (backlog / done / cancelled).
- **Three briefs are wrong today**: `0014`, `0021`, `0041` sit in `done/` with `## Status` reading `🔲 Backlog`. A full both-direction sweep of all 404 briefs found **exactly** those three and nothing else.
- **`0021` and `0041` also have board rows on `sprint-1.md` reading `✅ Done`** [M]. So for those two tasks **three carriers exist, two agree, and one lies.**
- **`0014` has no board row at all** [M] — and fkit already has an open, unstarted task titled *"Decide what catches a task brief that has NO board row — mechanism deliberately OPEN"*, filed on an owner ruling of 2026-08-14. The gap is known and unclosed.

#### ⛔ 4.1.1 The cause of the three drifts — and it is not what it first looks like

⚠️ **An earlier account of this circulated inside the fkit project and was wrong. It is corrected here, and the correction is the point.**

The *wrong* account: the owner closed `0021` and `0041` himself on 2026-07-10 (commits `f7b23f4`, `6daf3cc`, both titled "Task done"), each moving the file and editing the sprint plan while changing the brief by **zero** lines — so a human forgot the second copy.

**The mechanical trace is correct — that work is fkit's producer's — but the causation is not.** At close time **there was no `## Status` field to forget.** fkit's tasks were still flat, slug-named files then (`ai-agents/tasks/backlog/build-fkit-reconnect-tooling.md`); no numeric id, no folder, no status section.

**What actually happened, verified independently by `fkit-architect` this session [M]:**

The `## Status` field arrived with the **folder migration** — commit `331f298`, dated **2026-07-21**, *"task 76: migrate every task into a folder; update all tooling (ADR-029)"*. Reading all three briefs **at that commit**:

- `0014`, `0021` and `0041` were each created **inside `done/`** with `## Status` written as `🔲 Backlog`.
- **They did not drift later. They were wrong on the first line of their existence.**

The migration created **101 briefs** in total (10 in `backlog/`, 80 in `done/`, 11 in `cancelled/`). Of the 80 written into `done/`, **3 were born with a `🔲 Backlog` status** — **3.75% of the records that migration touched** [M]. Against today's whole corpus the same 3 errors are **0.74% of 404 briefs**, or **1.03% of the 290 terminal ones** — which denominator you use changes the number by a factor of five, so it is stated three ways.

> #### ⏱ DENOMINATOR CORRECTION, 2026-09-18 — `fkit-architect`, on Codex's item 7. The paragraph above is left unchanged; this block states what is wrong inside it.
>
> ⛔ **The phrase *"3.75% of the records that migration touched"* is wrong, and it is wrong in fkit's favour — it makes the defect look more concentrated than it was.** The migration touched **101** briefs, not 80. Re-verified at `331f298` [M]: `git ls-tree -r --name-only 331f298 -- ai-agents/tasks` yields **101** `brief.md` files — **10 backlog, 80 done, 11 cancelled**.
>
> **Both rates, each with its denominator named, because they answer different questions:**
>
> | Rate | Denominator | What it measures |
> |---|---|---|
> | **3.75%** | 3 of the **80** briefs written into `done/` | the error rate *among the records where the wrong default was possible* — a `backlog/` or `cancelled/` brief could not be born with a wrong `🔲 Backlog` in the same way |
> | **2.97%** | 3 of **all 101** briefs that received the new `## Status` field | the **migration-wide** error rate |
>
> ⭐ **Codex is right that Q12 repeated 3.75% as if it were the migration-wide rate. It was not.** Q12 now carries both. ⚠️ **Neither figure is "the" answer and neither should be dropped** — this is §2.4's discipline applied to this report's own headline number.

⭐ **Why this is a stronger argument than the story it replaces, not a weaker one.** "A human forgot the second copy" invites the obvious rebuttal — *"so build a tool that writes both"* — which is exactly where fkit already is. What the git history actually shows resists that rebuttal:

> **Introducing a duplicate status field creates a backfill problem for every record that already exists.** fkit's migration had to derive 400-odd status values from the very folders it was writing into. **It defaulted instead.** Three records were wrong on arrival and **nobody noticed for 59 days** — because a duplicate field that nothing ever reads is exactly the field nobody notices is lying.

Nobody forgot anything. **A bulk operation wrote a default into a field whose correct value was in the path it was writing to.** That is a cost of *having* the field, not a discipline failure.

⛔ **And it aims squarely at the work this report is about.** Convergence means a migration of the same shape and larger — 404 folders, 404 ids, 404 statuses, 539 board rows. The last migration of this kind silently mis-populated **3.75%** of the duplicated field it introduced. **`aiboard-lead`'s mitigation, which fkit endorses and which holds whichever model you choose:** the migration must **derive every duplicated value from the single authoritative source and verify row-by-row afterwards** — never default, never trust the writer.

⚠️ **Attribution, precisely, because three parties contributed and the credit is not interchangeable:** `fkit-lead` confirmed the drift exists. **fkit's producer** produced the mechanical git trace (the two 2026-07-10 commits, their shape, the zero brief-line change). **`aiboard-lead` found the born-wrong causation and corrected the producer's account**, today. `fkit-architect` re-verified the born-wrong state at `331f298` independently.

⚠️ **One date correction, on the record:** an earlier fkit-side framing said this defect sat undetected *"years"*. That is false and was a fkit-lead error. 2026-07-10 → today is **70 days**; the drift itself dates from 2026-07-21, so **59 days**.

#### 4.1.2 ⚠️ And fkit's detector did not catch it

fkit's defence of duplication (§3b.10) is that a second carrier makes drift **detectable**. That defence is testable, and `fkit-architect` tested it [M]:

- Running fkit's own board renderer over `sprint-1.md` — the board that holds `0021`'s and `0041`'s `✅ Done` rows — emits **five** drift facts, all of kind `cancelled-without-reason`, and **none** naming `0014`, `0021` or `0041`.
- Their rows do not appear in the rendered board output at all; closed rows are filtered out of the render.
- `0014` has no board row anywhere, so no renderer ever visits it.

⛔ **Measured conclusion, stated plainly against fkit's own interest: the cross-check that ADR-029 §Decision 2 promises did not fire on any of the three known-drifted records, and they went unnoticed for 59 days.** Redundancy-as-detection is only worth what the detector is worth.

#### ⏱ 4.1.3 — CORRECTION, 2026-09-18, added after §4.1 and §4.1.2 were written. The text above is left unchanged.

⚠️ **"Three briefs are wrong today" was true when written and is no longer true. It is now one.** A parallel fkit session repaired two of them while this report was being drafted [M]:

| Task | `## Status` when §4.1 was written | `## Status` now |
|---|---|---|
| `0021` | `🔲 Backlog` | **`✅ Done`** — repaired 2026-09-18 |
| `0041` | `🔲 Backlog` | **`✅ Done`** — repaired 2026-09-18 |
| `0014` | `🔲 Backlog` | **`🔲 Backlog` — unchanged, deliberately left alone** |

⭐ **Nothing in §4.1.1 or §4.1.2 is invalidated by this, and the repair independently confirms the born-wrong finding.** The ADR-033 addendum written to record the repair says, in its own words: *"which **created both briefs inside `done/` with `## Status` written as `🔲 Backlog`.** They were born wrong, not drifted."* That was reached by a different agent, from the same commit, independently of §4.1.1.

⭐ **What the repair cost is new evidence, and it belongs to §5.5 and Q1 rather than here.** In short: repairing two rows of duplicated status required **an owner ruling creating a one-time, spent, non-precedent bypass of fkit's own close gate**, plus an ADR addendum to record it. See §5.5.1.

⚠️ **`0014` was examined in the same sweep and left, by owner ruling** — *"Leave it, pending 0296"* — because it has no close commit, no board row, and is a protected specimen for another open task. ⛔ **So one record in fkit's corpus is still knowingly wrong, and the thing that makes it unrepairable is not the governance rule but the absence of any evidence of what the correct value is.** That is a different failure mode from the other two and it is the one the §4.1.2 detector gap produces: a record no carrier can adjudicate.

⭐ **VERBATIM — `aiboard-lead`'s position on point 1. Reproduced unedited between the rules.**

═══════════════════════════════════════
**1. Where status lives.**
*Position:* one source of truth, and the folder is a good one. *Confidence: high on "one source", medium on "the folder specifically".*
*Evidence:* Across fkit's 404 briefs the `## Status` field only ever holds three values (✅ 268, 🔲 117, ⛔ 19); 🔄/🚧/➡️ appear zero times. So that field duplicates what the directory already encodes and carries no information the directory doesn't. Three tasks are currently drifted (0014, 0021, 0041 — in `done/`, briefs say Backlog), which fkit-lead has independently confirmed.
*Cost of my own model, which I want on the record:* folder-as-status makes a task's path change on every status change. In fkit's tree today that would affect 21 cross-task path links across 11 files — small, and some are already broken from an earlier move, but not zero. It also means `git log <path>` stops at the rename without `--follow`.
*NEITHER — the one I'd most want evaluated:* **make status a fold over an append-only event log.** Both our models store current state and reconstruct history by reading prose. If each task's log held typed events (`created`, `status-changed`, `assigned`, `commented`) then status is derived, history is free, drift is structurally impossible, and no directory needs to move. Both fkit and aiboard already write such a log — we just write it as prose for humans instead of as data.
═══════════════════════════════════════

**fkit's position** *(written by `fkit-architect`)*:

**Agreed: the `## Status` field as it exists today is not earning its keep. Disagreed: that the folder should be the single carrier.**

Three things `aiboard-lead`'s evidence does not weigh:

1. **The three glyph values are not the whole content of the field.** 188 of the **270** ⏱ `✅` briefs carry `(agent-closed — not owner-verified)` *(⏱ read "268" when drafted; corrected 2026-09-18, see §3b.5)*, and 19 `⛔` briefs carry a mandatory inline reason, often a paragraph long (§3b.5). A directory name cannot carry *"closed by an agent, not verified by a human"* or *"cancelled because the parent design task was declined"*. **The field is 3-valued in its glyph and high-cardinality in its tail.** Collapsing it to the folder discards the audit marker, which §5.3 argues is the whole reason fkit's board can be read honestly.
2. **Folder-as-status makes the path mutable, and fkit's entire knowledge base is built on paths.** `aiboard-lead` measured 21 cross-task links affected. fkit's tree is bigger than the cross-task links: briefs cite ADRs, ADRs cite briefs, board rows link briefs, conventions cite reports. fkit has a whole convention page — `durable-citation-anchors.md` — created **because** coordinate-based references rot. A model whose correctness depends on paths never moving, colliding with one where status changes move paths, deserves an explicit answer rather than a footnote.
3. **A brief must read correctly standing alone.** fkit briefs are pasted into chats, read in diffs, and relayed between sessions that never see the filesystem. This is `aiboard-lead`'s own volunteered counter-argument in §4's closing paragraph, and fkit thinks it is the strongest one on the board — see the shared-blind-spot note at the end of this section.

⭐ **fkit's own third option, offered as an alternative to `aiboard-lead`'s event log:** **keep one authoritative status carrier, and make the second carrier a *generated, never-hand-written* projection.** The brief keeps a status line, but it is written **only** by the tool, stamped with the source it was derived from and the time, e.g. `<!-- derived from path @ 2026-09-18T12:00Z -->`. A human or agent editing it by hand is then a **detectable** act rather than an invisible one, and the "reads standing alone" property survives. This is weaker than the event log but far cheaper, and it is the minimum fkit would need to give up its current model.

⭐ **NEITHER — live on this point.** `aiboard-lead`'s event-log proposal is, in `fkit-architect`'s view, the strongest single idea in this report and fkit does not oppose it. It is expensive (both projects would have to write and read a typed log), and neither side has prototyped it. **If you think the event log is right, say so — both leads have signalled they would take it.** If you think there is a fourth answer, that is equally live.

---

### Point 2 — How many statuses

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> **Take C and D — but tighten C.** A *validated workflow graph*, not an unconstrained list: each state declares a semantic class, terminality and `allowed_next`. Four defaults; `blocked` stays derived. *"An unrestricted vocabulary without transition rules merely moves hard-coding into configuration."*
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 2 — How many statuses"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

**aiboard:** four — `backlog`, `in-progress`, `done`, `cancelled` — the same set for tasks and sprints. Blocked is **not** a status; it is a relation (`blocked_by`) and a derived boolean.
**fkit:** six task statuses in nine written forms (§3b.5), plus a **separate** four-value sprint vocabulary sharing the same glyphs (§3b.8). No `in-progress` *directory* — an in-progress task sits in `backlog/`.

**Evidence [M]:** `🔄 In progress` = 0 briefs, `🚧 Blocked` = 0 briefs, `➡️ Moved` = 0 briefs but **113 board rows**. `🚧` appears in 44 task files as decorative prose. 7 of 11 sprint boards carry a legacy `🔒 CLOSED` banner that may be read but never written.

⭐ **VERBATIM — `aiboard-lead`'s position on point 2. Reproduced unedited between the rules.**

═══════════════════════════════════════
**2. How many statuses.**
*Position:* four, with blocked modelled as a relation rather than a status. *Confidence: high.*
*Evidence:* "Blocked" as a status is mutually exclusive with "in progress", which is wrong — a task can be both. As a relation (`blocked_by`) it composes. Separately: fkit's `➡️ Moved` exists only because board rows live in per-sprint files and a move must leave a forwarding address; it disappears for free once point 4 is settled. One of fkit's six statuses is a consequence of a different design choice.
*NEITHER:* **an open, board-configured status vocabulary with declared semantic classes** (`not-started` / `active` / `terminal`). Then "4 vs 6" stops being the question, aiboard stops hard-coding four, fkit stops hard-coding six, and a third user gets `in-review` without asking anyone.
═══════════════════════════════════════

**fkit's position** *(written by `fkit-architect`)*:

**Agreed on both substantive claims, and fkit has the measurement that proves the second one.**

- **Blocked-as-relation is right.** fkit's own data agrees by abstention: `🚧 Blocked` is 0/404 as a status while dependency edges are recorded in 362/404 briefs. fkit is already modelling blocking as a relation and merely also has a status value for it that nobody uses.
- **`➡️ Moved` is indeed an artifact of point 4, and fkit can now quantify it: 113 of 539 board rows — 21% of all rows — exist solely as forwarding addresses.** They are not tasks. They are a consequence of storing membership in per-sprint files.

**One correction fkit must make, against itself:** the true count is not "six". It is **nine written forms across two vocabularies that share glyphs and are distinguished only by line position** (§3b.5, §3b.8). The complexity is worse than the headline number, not better.

**One thing fkit would not give up:** the `✅ Done` / `✅ Done (agent-closed)` distinction. It is not a status in the workflow sense — it is a **provenance** marker on a terminal state, and §5.3 argues it is load-bearing. If a 4-value vocabulary has nowhere to record *"a machine decided this was finished"*, then 70% of fkit's closed tasks lose the only thing that makes the board honest.

⭐ **fkit's own third option:** **separate the *state* from its *provenance*.** Four states, exactly as aiboard has them — plus a small, orthogonal, tool-written provenance record on every transition (*who* caused it, *what kind of actor*, *verified by a human or not*). That subsumes `agent-closed`, generalises beyond fkit (*"who moved this card"* is useful to a solo user), and composes naturally with `aiboard-lead`'s configurable-vocabulary proposal — the vocabulary is open, but every transition is attributed.

⭐ **NEITHER — live.** `aiboard-lead`'s configurable-vocabulary-with-semantic-classes proposal and fkit's state-plus-provenance proposal are **not** mutually exclusive; an expert may take both, one, or neither.

---

### Point 3 — Id scheme

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> **Keep fkit's IDs now; do not normalize existing IDs. For new boards, a third design** — opaque, immutable, branch-safe `task_<ULID>`. Never reuse, renumber or recycle. *"`1 + max` is human-friendly but branch-collision-prone."*
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 3 — ID scheme"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

**aiboard:** `T-001`, `S-001` — a letter prefix, a number, an optional slug, matched by one regex, a module constant. The prefix exists because tasks and sprints share an id namespace.
**fkit:** `0001`–`9999`, zero-padded, **no prefix**, permanent, never reused, allocated `1 + max` across all three boards. Two carriers: the folder name (authoritative) and the brief's `## ID`.

**Evidence [M]:** 404 folders carry the prefix; 404 briefs carry the `## ID` field. fkit already tried to remove the prefix and decided not to — an owner-ruled investigation (`2026-07-26-decide-task-folder-name-numeric-prefix.md`) costed removal at *"152 folder renames; ~416 tracked reference lines"* at the time, against a corpus then growing *"~10 folders/day"*, and rejected it. Today the corpus is 404 folders and the board text alone is 858,948 bytes.

⭐ **VERBATIM — `aiboard-lead`'s position on point 3. Reproduced unedited between the rules.**

═══════════════════════════════════════
**3. Id scheme.**
*Position:* aiboard should bend. The `T-`/`S-` prefix only earns its keep because we have two entity types sharing a namespace; fkit's zero-padded counter is fine. *Confidence: high — and note I'm arguing against my own project's convention.*
*Evidence:* Migration cost is entirely fkit's and it is large (404 folders plus cross-references throughout their knowledge base and 858KB of board text) for a cosmetic benefit. The id pattern is one regex at `store.py:52` — making it board-level config is close to free.
*NEITHER:* **keep the id out of the folder name entirely** — an `id:` field only, folder named by slug. Retitling stops stranding the id, and the whole regex question evaporates. Cost: you can no longer read ids from `ls`, which is a real loss for a filesystem-first tool.
═══════════════════════════════════════

> ⟦**fkit-side note:** the `store.py:52` coordinate above is `aiboard-lead`'s reference to its **own** repository and is preserved verbatim. fkit's citation policy — durable anchors, never line numbers — binds only what the fkit side writes.⟧

**fkit's position** *(written by `fkit-architect`)*:

**Agreed, and fkit notes that `aiboard-lead` is arguing against its own convention here, which is worth weighing.** fkit has nothing to add in favour of its own scheme beyond the migration cost, which is real but is an argument about *cost*, not about *correctness*, and the owner has explicitly put cost-bearing changes on the table.

**But fkit disagrees with `aiboard-lead`'s "neither".** Removing the id from the folder name is precisely the change fkit investigated and the owner rejected, on a ruling recorded as *"the objection is FUNCTIONAL, not aesthetic"*. The `ls`-readability loss `aiboard-lead` names is real and, for a filesystem-first tool with no server required, it is the main affordance. More importantly it does **not** remove the second carrier — you still have `id:` in the file and a folder name that must be resolved to it — so it trades a visible redundancy for an invisible one.

⭐ **fkit's own third option:** **make the id format a board-level configuration value with a declared shape, and require the id to appear in the folder name in whatever shape is configured.** `T-001-slug`, `0001-slug` and `PROJ-17-slug` all satisfy it; the tool reads one pattern from config instead of a constant. This gives aiboard's users their prefix, gives fkit its zero-padding, and costs one regex plus a config key — while keeping `ls` readable for everyone.

⚠️ **The one thing fkit asks you to rule on explicitly, because it is not cosmetic:** **`1 + max` across all boards, never reused.** aiboard's id pattern does not state a reuse policy. If a converged model recycles ids from cancelled tasks, every inbound link in fkit's 48 ADRs and 404 briefs silently starts pointing at a different task. Whatever id *format* you choose, **please state a reuse policy.**

⭐ **NEITHER — live.**

---

### Point 4 — Sprint representation

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> **D, extended with an immutable closure snapshot** — and on the 688 KB of board prose: move confidently attributable text **verbatim** into a per-task `legacy-board-notes.md` with source board and hash, leave the rest in immutable legacy board archives, *"never discard or semantically rewrite it automatically."* Also: *"The backlog is not a sprint."*
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 4 — Sprint representation"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

**aiboard:** a sprint is a directory holding one `sprint.md` with `goal`, `start`, `end`, and a `tasks:` list. Membership is *also* a field on the task. Any board view is rendered from the store.
**fkit:** a sprint is a **markdown file containing a table**. The table **is** the board. A task's membership is stored as the brief's `## Sprint` field **and** as a row in that file. Moving a task between sprints leaves a `➡️ Moved` forwarding row behind.

**Evidence [M]:** `backlog.md` = 858,948 bytes, `sprint-2.md` = 571,825 bytes, each a single document rewritten whole on every row change. 539 board rows for 404 tasks; 113 of them forwarding rows. 96.6% of `backlog.md`'s bytes are inside table cells, 83% of task-row bytes are in the Task column alone.

⭐ **VERBATIM — `aiboard-lead`'s position on point 4. Reproduced unedited between the rules.**

═══════════════════════════════════════
**4. Sprint representation.**
*Position:* the task is the unit of storage; sprint membership is a field on the task; any board or table view is derived at render time and never stored. *Confidence: high.*
*Evidence:* fkit's 858KB `backlog.md` and 571KB `sprint-2.md` are single documents rewritten whole on every row change. **But aiboard has a small case of the same disease:** our `sprint.md` regenerates a `## Tasks` checklist, which at 234 tasks in one sprint is a 234-line rewrite per move, and `check()` exists partly to catch it going stale. The rule above is what kills both, not "aiboard wins".
*NEITHER:* **drop the sprint entity altogether.** A sprint could be a saved query over a label plus a goal statement. All a sprint directory currently buys aiboard is somewhere to put a goal and two dates. A saved-query model gives you epics, milestones and arbitrary groupings for the same price. I think this is genuinely worth the expert's time.
═══════════════════════════════════════

**fkit's position** *(written by `fkit-architect`)*:

**Agreed on the principle, and fkit is the one paying for violating it.** The board-as-storage decision is the direct cause of measured fact one (§2.1). fkit does not defend it.

**Two things fkit adds that the principle alone does not cover:**

1. **The 858KB is not a sprint-representation problem. It is a homelessness problem.** 83% of those bytes are prose in Task cells — owner rulings, dated corrections, measured figures — that had nowhere else to live. Making the board derived does not answer *"where does that text go?"* If the answer is "the brief", fkit's briefs get bigger; if it is "nowhere", the project loses records it has repeatedly decided it must not lose. ⛔ **A recommendation that makes boards derived without naming a home for the prose has moved the problem, not solved it.**
2. **A sprint board in fkit carries text a task list cannot.** The line-3 banner carries the sprint's own status and the authority under which it was opened; boards carry `READ THIS FIRST` sections explaining, for example, why `Sprint 10` is deliberately left empty. A pure saved query has no place to put that. It needs, at minimum, a goal, a status, and a prose body.

⭐ **fkit's own third option, and it is close to `aiboard-lead`'s:** **keep a sprint entity, but make it a *document* with a membership **query**, not a membership **list**.** The sprint file holds goal, dates, status, and prose; membership is `where sprint == S-003`, evaluated live. This kills both the whole-file rewrite and the `## Tasks` checklist that `aiboard-lead` admits to, kills the 113 forwarding rows for free, and keeps a home for the prose. It differs from `aiboard-lead`'s "drop the sprint entity" only in refusing to throw away the document.

⭐ **NEITHER — live.** `aiboard-lead` specifically asked for an outside read on dropping the sprint entity entirely. fkit's counter is the paragraph above. **Both may be wrong.**

---

### Point 5 — Brief format

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> ⭐ **NEITHER.** `task.json` (JSON Schema, validated) beside `brief.md` (unrestricted prose), with a **generated, revision-stamped summary block** in the Markdown that the checker lints and *"operational code never reads."*
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 5 — Brief format"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

**aiboard:** a hand-written subset of YAML in front matter, plus a markdown body. The dialect is not YAML and has at least one lookahead ambiguity, and exists so the tool can stay dependency-free.
**fkit:** no front matter at all. `## Section` headings are the fields.

**Evidence [M]:** across 404 briefs, seven headings are in 100% of files, `## What to build` in 99.0%, `## Priority` in 98.5%; **five of those nine are single-line scalar fields**; 80 further distinct headings appear in ≤ 2 files each.

⭐ **VERBATIM — `aiboard-lead`'s position on point 5. Reproduced unedited between the rules.**

═══════════════════════════════════════
**5. Brief format.**
*Position:* fields in front matter, prose in `## Sections`. *Confidence: medium.*
*Evidence:* fkit's 404 briefs share eight universal headings, and four of them — ID, Sprint, Owner, Status — are fields wearing heading clothes. The other four (Context, What to build, Verification steps, Notes) are genuinely prose. Counterweight against my own side: aiboard's hand-rolled YAML subset is a liability — it's a porting risk and it has the lookahead ambiguity described in §3.
*NEITHER:* **use a format with an actual specification.** TOML front matter has one, is unambiguous, and needs a small parser. Or invert it: no front matter at all, a single `## Fields` section parsed as key/value, so there is one syntax in the file instead of two. Both beat "a YAML subset we invented".
═══════════════════════════════════════

> ⟦**fkit-side note, correcting two small counts inside the verbatim block without altering it** [M]: *"eight universal headings"* is off by one in each direction. **Seven** headings are in all 404 briefs (`ID`, `Sprint`, `Status`, `Owner`, `Context`, `Verification steps`, `Notes`); `What to build` is in **400**; and a **ninth** field-shaped heading `aiboard-lead` did not name, `## Priority`, is in **398**. So the field-shaped count is **five**, not four. **This strengthens `aiboard-lead`'s point rather than weakening it** — there is one more scalar field in heading clothes than it claimed, and two of the "universal" headings are not quite universal, which is itself a mild argument for a schema.⟧

**fkit's position** *(written by `fkit-architect`)*:

**Agreed on the diagnosis, and fkit prefers `aiboard-lead`'s *second* "neither" to its first.**

- **Against fkit's own format:** five scalar fields as `## Headings` is a schema pretending to be prose. Parsing it means regex over markdown, which fkit has already been burned by once in a neighbouring field (§3b.7 — the dependency parser that silently printed "nothing blocks this" for seven status runs).
- **Against aiboard's format:** an invented YAML subset is worse than an invented section grammar, because it *looks* like a standard and is not. Anyone who reaches for a real YAML library will parse fkit-era files subtly differently.
- **fkit prefers "one syntax in the file".** `aiboard-lead`'s inverted proposal — no front matter, a single `## Fields` block parsed as key/value — gives one syntax instead of two, keeps the file readable raw (which §5.1's constraint arguably requires), and needs no dependency. **TOML front matter is the safer engineering answer; the single-`## Fields`-block answer is the better *human-legibility* answer.** fkit leans to the latter and flags that this is a genuine trade, not a clear call.

⭐ **fkit's own third option:** **whatever syntax is chosen, publish a schema and validate against it in the consistency checker.** fkit's corpus has 89 distinct headings, 80 of them appearing at most twice — meaning **the field set has never been enforced at all** on either side. The syntax question matters less than the absence of validation.

⭐ **NEITHER — live.** Note that both leads' positions on this point are stated at **medium** confidence. It is the weakest-held point in the report; treat it as the most open.

---

### Point 6 — Per-task artifacts

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> **B, but not "show and trust every Markdown file."** Open folders **plus a typed artifact registry**; unregistered files appear as attachments but are *"not parsed, executed, or assumed safe."* ⭐ It explicitly backs fkit here: *"Preserve `review.md` as a materialized decision document; do not dissolve it into an event stream."*
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 6 — Per-task artifacts"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

**aiboard:** `brief.md` (required), `worklog.md` (always created), `comments.md` (created on first comment). The set is closed — the tool knows these three names.
**fkit:** `brief.md` (required) plus four reserved optional names — `plan.md`, `worklog.md`, `review.md`, `assets/`. `review.md` is a **two-party ledger** with reviewer-owned, coder-owned, and shared sections.

**Evidence [M]:** adoption is partial — `review.md` 156/404, `worklog.md` 137/404, `plan.md` 130/404. One folder holds a fifth file (`canary.sh`, a fixture).

⭐ **VERBATIM — `aiboard-lead`'s position on point 6. Reproduced unedited between the rules.**

═══════════════════════════════════════
**6. Per-task artifacts.**
*Position:* aiboard should treat a task folder as open — any `*.md` beside `brief.md` is a named document the UI can show, with `worklog.md` and `comments.md` getting append-only treatment. fkit's `plan.md`/`review.md` then work without aiboard knowing what they mean. *Confidence: high.*
*Evidence:* fkit's `review.md` (156 files, `## Reviewer findings` / `## Coder response` / `## Accepted residuals`) is a role protocol, not a tracker feature. Adoption is already partial on their side: 130/404 have plan.md, 156/404 review.md, 137/404 worklog.md.
*NEITHER:* **one typed append-only event log per task instead of several files.** Then review.md's two-party ledger is a query over the log filtered by author, plan is a document event, and the "which files may exist" question disappears. This is the same third option as point 1, arriving from a different direction — which is part of why I think it deserves weight.
═══════════════════════════════════════

**fkit's position** *(written by `fkit-architect`)*:

**Agreed, with near-zero friction. This is the cheapest point on the board.** fkit's figures confirm `aiboard-lead`'s exactly, and an open-folder rule costs fkit nothing and aiboard almost nothing.

**One caution about the "neither":** `review.md` is not merely a log of events. It is a **two-party document with per-section write ownership** — the reviewer owns the findings section and never edits the responses; the coder owns the responses and never edits the findings; and a third shared section records *"accepted residuals"* that neither party may re-litigate. Its purpose is **loop prevention**: external reviewers are stateless, so without a memory of which trade-offs were already settled, review rounds oscillate — a fix for finding N recreates the condition finding N+2 then flags.

A pure event log **can** express this (filter by author), but it loses the thing that makes the ledger work in practice: **a human or an agent can open one file and see the whole decision state at a glance.** Rendering a ledger view from a log is possible; it is not free.

⭐ **fkit's own third option:** **an open task folder *plus* a declared, per-file append-only flag.** Any `*.md` is shown; a small manifest (or a marker line in the file) says *"this file is append-only"*, which gets the worklog/comments treatment without the tool needing to know the name. That gives aiboard's openness, keeps fkit's ledger as a first-class document, and needs no event-log migration.

⭐ **NEITHER — live.**

---

### Point 7 — Ownership

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> **B's structured principal is necessary but insufficient.** Split `accountable` (zero or one, owns the outcome) from `assignees` (zero or more, do the work); a principal is `{kind, id, display}`; free text survives only as `display`, *"never as identity."*
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 7 — Ownership"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

**aiboard:** `assignee` — free text, unvalidated.
**fkit:** `## Owner` — five values, all fkit role names, no humans (§3b.6). The role is also **enforced**: a hook denies a session from running another role's procedure (§5.4).

⭐ **VERBATIM — `aiboard-lead`'s position on point 7. Reproduced unedited between the rules.**

═══════════════════════════════════════
**7. Ownership.**
*Position:* aiboard's free-text `assignee` is already a strict superset of fkit's `## Owner` (5 values, all `fkit-*` roles: coder 246, architect 92, wiki 36, producer 26, reviewer 4). `"fkit-coder"` is a valid assignee string. The role-lock *enforcement hook* is what doesn't generalise, and it should stay on fkit's side. **Zero aiboard changes needed.** *Confidence: high, and low stakes.*
*NEITHER:* make assignee a small structured reference (`{kind: role|human|agent, id: ...}`) rather than free text. Cheap, and it lets a UI distinguish a human from an agent without aiboard learning what any particular role means.
═══════════════════════════════════════

**fkit's position** *(written by `fkit-architect`)*:

**Agreed. fkit confirms every figure independently [M] and has no objection.** The superset argument is correct and the boundary — enforcement stays on fkit's side — is the right one.

**fkit prefers `aiboard-lead`'s "neither" to its own position.** A structured `{kind, id}` reference is worth the small cost, for a reason neither lead has stated: it is the **same shape** as the provenance record fkit proposed under point 2. If a transition records *who* caused it as `{kind: human|agent|role, id: …}`, and an assignment records the same shape, then *"was this closed by a human?"* and *"is this assigned to a human?"* are answered by the same field type. That is worth more than either change alone.

⚠️ **One thing fkit flags, not as a position but as a fact the expert should have:** **fkit has no concept of a human assignee at all.** Not one of its 404 tasks is assigned to a person. If aiboard is to be *"usable by someone with no framework"* (§5.1), the human-assignee case is the **untested** one on both sides — fkit has never used it and, per §7a, aiboard *"has never been used by anyone but its author, and never by a non-agent human."*

⭐ **NEITHER — live.**

---

### Point 8 — Dependencies

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> **Combine C and D.** One directed, typed edge stored on its source task with `strength` and a `note`; inverse displays derived; cycle detection only where cycles are invalid. On migration: *"Quarantine prose that cannot be parsed and emit a visible migration warning—never infer 'nothing.'"*
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 8 — Dependencies"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

**aiboard:** `blocked_by`, a list of task ids, stored on the blocked task only. `blocked` is **derived** (true while any blocker is not done/cancelled). Enforced at the start transition, force-overridable. Cycle detection in `aiboard check`.
**fkit:** `Depends on:` **and** `Blocks:` — a **stored bidirectional edge**, in free-text prose bullets under `## Notes`, parsed by a text matcher.

**Evidence [M]:** 362/404 briefs carry a canonical `Depends on:`; 270/404 carry `Blocks:`. Nothing derives one from the other. Nothing detects cycles. The parser has one documented production failure (§3b.7) and its own guard is described by its own convention page as *"not prose-proof in general."*

⭐ **VERBATIM — `aiboard-lead`'s position on point 8. Reproduced unedited between the rules.**

═══════════════════════════════════════
**8. Dependencies.**
*Position:* aiboard's model wins — `blocked_by` enforced at the start transition (force-overridable) plus cycle detection in `check`. And a warning about fkit's: `Depends on` / `Blocks` is a **stored bidirectional edge**, which is two-sources-of-truth again and will drift exactly the way status did. `Blocks` should be derived. *Confidence: high.*
*NEITHER:* **a general typed-link table** (`blocks`, `relates-to`, `duplicates`, `parent-of`) rather than one hard-coded `blocked_by` field. It's where both our models will end up anyway; the expert may think it's worth jumping straight there rather than arriving in two migrations.
═══════════════════════════════════════

**fkit's position** *(written by `fkit-architect`)*:

**Agreed, and fkit's position is stronger than "agreed": fkit's dependency representation is the worst-engineered part of its model and it has already failed in production.** The bidirectional-edge criticism is correct. The free-text criticism, which `aiboard-lead` did not make, is worse:

- The value is **prose**, not ids — `nothing`, `0072 — soft, not hard`, sentences.
- A single glyph in the wrong position made the parser print a **fabricated** *"nothing blocks this"*, uncorrected for seven consecutive status runs.
- fkit's own guard page says the guard *"is not prose-proof in general."*

⚠️ **fkit has never audited whether its 270 `Blocks:` declarations agree with its 362 `Depends on:` declarations.** It cannot, reliably, because the values are prose. **`aiboard-lead`'s prediction — that it *"will drift exactly the way status did"* — is not merely plausible; fkit cannot currently disprove it.** That is stated here, against fkit's interest, as a known unknown. See §7b.

⭐ **fkit's own third option, which goes further than `aiboard-lead`'s:** a typed-link table is right, **and links should be ids, not prose, with the prose moved to an adjacent note field.** `depends_on: [0110, 0112]` plus `depends_on_note: "0072 is soft, not hard"`. Half of fkit's parsing problem is not the direction of the edge; it is that a machine-readable field was allowed to carry human commentary.

⭐ **NEITHER — live.** `aiboard-lead` suggests jumping straight to a typed-link table rather than arriving in two migrations. fkit supports that and adds: **whatever is chosen, a cycle check must exist**, because fkit has 362 dependency declarations and **no cycle detection of any kind**.

---

### Point 9 — The close gate

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> ⭐ **NEITHER direct writes, nor veto hooks, nor a permanently asynchronous proposal queue.** One transition service used by CLI, HTTP, MCP, browser and fkit alike, owning the lock and the transaction; fkit supplies a policy adapter. *"A hook alone cannot coordinate writes. A queue for every transition damages the core UI unnecessarily."*
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 9 — The close gate"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

**aiboard:** a status change is a directory move. Anyone with write access can make one, from the CLI, the MCP interface, or a **drag in a browser**. No roles, no procedures, no veto.
**fkit:** a task reaches `done/` or `cancelled/` **only** via one of four "mover" procedures, **only** the producer may invoke them, the restriction is **enforced by a hook** at any spawn depth, and any close performed without the owner present **must** write `(agent-closed — not owner-verified)` into the record. §5.2 and §5.3 explain why, at length, so you can judge whether the reasons are any good.

⭐ **VERBATIM — `aiboard-lead`'s position on point 9. Reproduced unedited between the rules.**

═══════════════════════════════════════
**9. The close gate.**
*Position:* aiboard must not learn roles, mover procedures or the close marker. The generic seam is a **config-declared pre-transition hook**: a command aiboard runs before a status change, which may veto it, and which receives the initiator's identity. Framework-agnostic — a solo user might want "run my tests before Done" — and it carries fkit's producer-only rule and the marker entirely on fkit's side. *Confidence: high on the boundary, medium on the hook being the right mechanism.*
*NEITHER:* **don't let aiboard write at all.** Have it emit *proposed* transitions to a queue that the consuming project's own tooling applies. Slower and less satisfying in a browser, but it sidesteps the two-writers problem completely and keeps aiboard's promise ("the filesystem is the database") undiluted. I'd genuinely like an outside read on this one.
═══════════════════════════════════════

**fkit's position** *(written by `fkit-architect`)*:

**Agreed on the boundary. Agreed the hook is the right general mechanism. And fkit thinks the "neither" is better than both, for a reason `aiboard-lead` understated.**

The pre-transition hook is the correct *shape*: generic, useful to a solo user (*"run my tests before Done"*), and it keeps every fkit-specific concept on fkit's side. fkit supports it.

**But there is a problem the hook does not solve and the queue does: two writers on one filesystem, with no shared lock.** aiboard takes an advisory `fcntl` lock at its board root [A]. fkit's agents take **no lock at all** — they are AI sessions editing markdown. A veto hook coordinates *permission*; it does not coordinate *concurrent writes*. A drag that moves a folder while a fkit producer is mid-way through a mover procedure — which stamps a banner, disposes rows, repoints links, and `git mv`s, in that order — is a real interleaving, not a theoretical one. fkit's own ADR-047 says of its sprint movers: *"⭐ **Atomic by INVOCATION, not by filesystem** … an interrupted mover leaves a half-moved board."*

⭐ **So fkit's position is: propose-only writes, with the pre-transition hook kept for the local-veto case.** The browser emits a *proposed* transition; the consuming project's own tooling applies it. This is `aiboard-lead`'s "neither", and fkit thinks the argument for it is stronger than *"slower and less satisfying"* — it is the only one of the three options that is safe under two uncoordinated writers.

⚠️ **The cost, stated plainly so it is not smuggled past you:** a drag that does not immediately move the card is a **worse user experience**, and the entire point of aiboard is the user experience. A proposal queue that nothing drains leaves a human staring at a card that snapped back. **If you recommend propose-only, please also say what drains the queue and how fast.**

#### ⏱ 4.9.1 — CORRECTION, 2026-09-18. Volunteered by `aiboard-lead` **against its own position**; re-verified by `fkit-architect`. The text above is left unchanged.

⛔ **The paragraph above quotes ADR-047's *"atomic by INVOCATION, not by filesystem — an interrupted mover leaves a half-moved board"* against fkit and leaves the reader to infer that aiboard, with its `fcntl` lock, does better. It does not. `aiboard-lead` volunteered the correction unprompted.**

**aiboard's `move_task` is four sequential filesystem operations inside one advisory lock** — verified by `fkit-architect` reading `aiboard/store.py` at HEAD `df554b9` [A✓]:

1. move the task folder to the destination status directory (`shutil.move`);
2. append the status-change entry to `worklog.md`;
3. rewrite `brief.md` to touch its `updated` timestamp;
4. re-render the owning sprint's `## Tasks` checklist.

**A process that dies between any two of those leaves a moved folder, no worklog entry, and a stale sprint file.** The lock serialises *writers*; it does not make the sequence *recoverable*. That is precisely ADR-047's own admission, in a different codebase.

⭐ **The correct framing, which `aiboard-lead` asked for and `fkit-architect` endorses: NEITHER SYSTEM IS TRANSACTIONAL.** fkit's movers are atomic by invocation; aiboard's `move_task` is atomic by lock-holding and nothing more. **Both leave partial state on an interrupt.**

⛔ **What this does and does not change about the propose-only argument.** The argument for propose-only in the paragraph above **does not depend on aiboard being sloppier than fkit, and must not be read that way.** It rests on **two uncoordinated writers on one filesystem** — fkit's agents take no lock at all, and aiboard's lock cannot see them. That hazard is unchanged by this correction. ⚠️ **But one sentence of the fkit case is now weaker:** the implicit contrast between a locked writer and an unlocked one overstated aiboard's guarantee. Non-atomicity is a shared property, not a fkit defect.

*(⭐ Codex reached the same structural conclusion from the other end without seeing this correction — its answer to point 9 is that **neither** direct writes, nor veto hooks, nor a permanent proposal queue is right, and that one transition service must own *"the shared lock, revision checks, policy call, current-state update, event append, and projection refresh"* with *"a recoverable transaction"*. See §8.2.)*

⭐ **NEITHER — live.** Three named options here (direct write / veto hook / proposal queue) and a fourth is welcome.

---

### Point 10 — History and auditability ⭐ *(added by `aiboard-lead`'s amendment; accepted)*

> ⏱ **CODEX'S VERDICT ON THIS POINT, 2026-09-18 — folded in after drafting. Codex is the independent non-Claude reader of §0.4; it had no channel to either lead.**
> **C, not full event sourcing.** Readable current state plus tool-written typed transition events. ⚠️ And a warning fkit should not skip: *"Do not claim this is a security log: an agent with repository write access can still alter it unless commits or signatures provide an external trust boundary."*
>
> **Full reasoning, verbatim, in §8.2 under its own heading *"Point 10 — History and auditability"*.** ⛔ **Read §0.8.1 — the calibration result on Codex — before you weight this.**

⭐ **VERBATIM — `aiboard-lead`'s amendment, which is the framing of this point. Reproduced unedited between the rules.**

═══════════════════════════════════════
**1. Add a tenth comparison point: history and auditability.** Neither model stores status history as data. fkit reconstructs it from board markers and prose; aiboard reconstructs it from worklog prose. Neither can answer "how long did this sit in review" without parsing English. It's a genuine gap in *both*, which makes it the single best candidate for a "neither" answer — and it connects points 1 and 6, where I independently arrived at the same event-log idea from two directions.
═══════════════════════════════════════

**Both models, stated neutrally:**

| | aiboard | fkit |
|---|---|---|
| Status transitions recorded as data | **no** | **no** |
| Status transitions recorded as prose | `worklog.md`, auto-appended on status change, assignment, blocking — **always created** [A] | `worklog.md`, hand-written, **present in 137 of 404 task folders** [M] |
| `created` / `updated` timestamps | **yes**, on every task [A] | **no** — no brief carries either [M] |
| Other history | git | git; plus fkit's *annotate-never-rewrite* house style, which leaves superseded text byte-identical with a dated note beside it |
| Can answer *"how long did this sit in review"* | no | no |

⚠️ **fkit is the weaker of the two here and should say so.** aiboard at least creates a worklog for every task and stamps `created`/`updated`. fkit has **no timestamps on tasks at all** — not one of its 404 briefs records when it was created or last changed — and its worklog exists for a third of them. Everything fkit knows about *when* comes from git, which records when a **file** changed, not when a **task** changed. The two diverge the moment a bulk migration touches every file at once — which is exactly what happened at `331f298` and is exactly why §4.1.1's *"59 days"* had to be reconstructed by reading commits.

**fkit's position** *(written by `fkit-architect`)*:

**Agreed that it is a gap in both, and fkit thinks it is the most *consequential* gap in this report** — not because anyone has asked for the report, but because of §4.1.1. **The three drifted records were undetectable precisely because nothing recorded a transition.** Had a typed event existed, *"this task entered `done/` with no `status-changed` event"* would have been a one-line query on day one instead of a 59-day silence.

⭐ **fkit's position on the remedy — and it is `aiboard-lead`'s event log, arrived at from a third direction.** Points 1, 6 and 10 all converge on the same object. That convergence is itself evidence, and fkit says so even though the event log costs fkit more than it costs aiboard.

⚠️ **The counter-argument fkit must supply, because nobody else will:** an event log is only as truthful as the writers that append to it. fkit's writers are **AI agents**, and §5.3 records fkit's own hard-won conclusion about exactly this: a marker that agents are *instructed* to write is *"prose, not enforcement — nothing in the system compels it."* **An event log written by agents that sometimes skip steps is a log with holes, and a log with holes that is *believed* is worse than prose that is known to be unreliable.** If the log is to be authoritative, something other than an agent's compliance must write it — the tool, at the transition, or not at all.

⭐ **NEITHER — live, and this point has no incumbent to defend.** Neither model does this. Any answer you give is a third answer.

---

### ⚠️ The shared blind spot — `aiboard-lead` flagged it against itself, and fkit endorses the flag

⭐ **VERBATIM — `aiboard-lead`. Reproduced unedited between the rules.**

═══════════════════════════════════════
**Where we agreed quickly — flagging the blind-spot risk you asked for.**
Points 1, 4 and 8 we converged on almost immediately, and all three favour the same principle (single source of truth, derive the rest). That principle is load-bearing for both of us, which is exactly the condition for a shared blind spot. The strongest argument *against* it that neither of us made: **duplication buys offline legibility.** A brief pasted into a chat, mailed, or read in a diff viewer carries its own status when the status is in the file; under my model it carries nothing, and the reader must know where the file sat. fkit-lead raised "a brief should read standing alone" and I answered it with "derive the line at render time" — which is correct only when something is doing the rendering. If briefs are read raw as often as they're read through a tool, that answer is weaker than we both treated it. I'd like the expert to push on it.
═══════════════════════════════════════

**⟦fkit-side note, and it is a measurement, not an opinion⟧** [M]: **fkit briefs are read raw constantly.** They are pasted between AI sessions that have no filesystem view of the other project; they are relayed as quoted text between agents; task `0404`'s brief exists *specifically* as a transcript rescue — its own text says *"Everything in the 'What the owner said' section below existed ONLY in a live session transcript and would have been lost when that session ended."* In fkit's actual usage the raw read is not the exception. ⛔ **`aiboard-lead` is right to flag this and fkit believes it is the strongest single argument against the principle both leads converged on.** Please push on it.

---

## §5 — The constraint set, and why each constraint exists

⛔ **Every rule below is presented with its reasoning, at enough depth that you can tell us it is wrong.** The owner has put everything on the table. **A rule presented as an axiom cannot be evaluated**, so none of them is presented that way. Where a rule has a known limit, the limit is quoted from fkit's own records.

### 5.1 ⭐ THE ONE FIXED CONSTRAINT: aiboard must remain usable with no framework

**Status: fixed. Not on the table.** Every other rule in this section is.

> *"it's like some module that we will attach to fkit, but other people can attach the same module to other projects even if they just don't have any framework or system, but it might still be useful for them."*
> — the owner, 2026-09-18

**What it forbids concretely:** aiboard must not take on as **core concepts** fkit's role model, fkit's four mover procedures and their producer-only rule, or the literal string `(agent-closed — not owner-verified)`.

**What it does *not* forbid:** generic mechanisms that happen to serve fkit — a pre-transition hook, a transition-initiator field, a configurable status vocabulary, a configurable id pattern. Those are useful to a solo user with no framework; that is the test.

⚠️ **Note the honest tension** (§1.4): the owner has *also* said *"we can basically make sure they match each other."* The reconciliation the leads are using is theirs, not his. **If your recommendation crosses that line, say so explicitly rather than assuming.**

### 5.2 The four movers, and the producer-only rule

**The rule, as it ships to every project fkit installs into:**

> *"Task files AND sprint boards reach `done/` or `cancelled/` only via the four movers (`/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-sprint-done`, `/fkit-sprint-cancelled`) — never by hand. **Only the producer may invoke them**; anything an agent closes MUST carry the `(agent-closed — not owner-verified)` marker."*
> — `CLAUDE.md`, §"Universal hard rules (every role, every session)"

**Why "only via a procedure, never by hand."** Closing a task is not one act. Closing a *sprint* is four, and ADR-047 enumerates them under §4: *"**One act, in this order:** 1. Stamp the line-3 banner. 2. Dispose of the rows. 3. Repoint links. 4. `git mv` the board into `done/` or `cancelled/`."* A hand-move does step 4 and silently skips 1–3. The same ADR concedes the limit: *"⭐ **Atomic by INVOCATION, not by filesystem** … an interrupted mover leaves a half-moved board."*

**Why "only the producer."** A concrete failure, quoted from ADR-033 §Context: *"a wiki task whose vault work was done sat `🔄 In progress` on the board for ~a week (task 80; six batched syncs) because the wiki never invoked the close authority it had."* The owner then ruled, verbatim: *"Nobody should be able to run the `fkit-task-done` skill except the producer agent. If needed, wiki can ask the producer to run it… Keep the wiki-agent wiki-only."*

ADR-033 describes itself as *"a deliberate re-consolidation of **close authority into the one role whose job is the task lifecycle**, reversing the ergonomics-for-guarantee trade ADR-025 made."* ⚠️ **Note that this rule reversed an earlier rule.** fkit has changed its mind here once already.

**⛔ The limit, quoted from fkit's own ADR, so you do not overstate the rule's strength:**

> *"Producer-only re-establishes **separation of the closing *identity*** … It does **not** restore full *prevention*: a determined doer can still spawn a producer to close."*
> *"the win is structural role-separation at the mover, not a laundering-proof gate."*
> — ADR-033, §"The limit — stated plainly"

**Rejected alternatives, from ADR-033 §Options considered:** *"No self-close; the spawner or producer may close"* — offered, **rejected by the owner** for the stricter rule. *"Producer + orchestrator only"* — **rejected**; the owner wanted one lifecycle role, not two.

**⭐ How to attack this rule, if you want to.** It is a **workflow** rule that has been given a **data-model** consequence: because closing is a procedure, the close must be recorded somewhere, which is why a status field exists to be written into. If your recommended model derives status from a transition event rather than a written field, the producer-only rule becomes a rule about *who may append which events* — which is a cleaner place for it than *who may edit which file*. **Saying that is in scope.**

### 5.3 The `(agent-closed — not owner-verified)` marker

**What it is.** Any close performed without the human owner present writes `✅ Done (agent-closed — not owner-verified)` instead of `✅ Done`. **188 of fkit's 404 briefs carry it** [M] — **70% of all closed tasks**.

**Where it came from, and what it replaced.** It was invented as the explicit *substitute* for a guarantee that was deliberately removed. ADR-025 states the trade in its own words with unusual candour:

> *"**The guarantee was:** a task is marked done only by an act of the human. **What replaces it:** a task marked done by an agent is labelled as such — if the agent follows the prose that tells it to apply the label."*
> *"**Prevention is gone.** No mechanism stops a false close-out."*
> *"**Therefore: this is not prevention downgraded to detection. It is prevention removed, with a labelling convention in its place.**"*
> — ADR-025, §"The honesty clause — what replaces the guarantee: nothing equivalent"

**Why a spawned producer still writes it.** ADR-025: *"A producer spawned as a consult has **no owner channel** … The spawned producer adds a *role name* to the transaction, not a *second judgment*."*

**⛔ Two known holes, both quoted from fkit's own records:**

1. *"⚠️ **Role-gating is not prevention, and must not be read as it.** … The marker remains **prose, not enforcement** — nothing in the system compels it. It exists so the board can at least be *read* honestly by someone who looks."* — `task-status-vocabulary.md`
2. *"⚠️ **The marker does not appear in `/fkit-status`.** The dashboard matches on the marker prefix, so `✅ Done (agent-closed …)` is counted and filtered as an ordinary `✅ Done` row. To tell an agent-closed task from an owner-closed one you must open the sprint plan or the brief. Recorded, accepted, and **not** a defect to file."* — `task-status-vocabulary.md`

**⭐ How to attack this rule.** Two openings, both legitimate:

- **It is the wrong mechanism for the right idea.** A literal string in a status field is unqueryable, invisible to the dashboard, and cannot be enforced. *Who performed a transition, and whether a human verified it,* is **structured provenance** — and as structured provenance it is (a) generic enough for aiboard's no-framework user, (b) queryable, and (c) writable by the tool rather than trusted to an agent. This is fkit's own point-2 proposal, and you may take it further than fkit did.
- **Or it is not worth its cost.** 70% of fkit's closes are agent-closed. A marker that is on the large majority of records carries little information, is invisible in the dashboard, and depends on the honesty of the very agent whose honesty it exists to qualify. **Arguing that it should be deleted is in scope.**

### 5.4 The role-lock enforcement hook

**What it is.** `fkit <role>` opens a session pinned to one role. A `PreToolUse` hook checks the **real invoking agent's identity** — at any spawn depth — against a single function, `skills_for_role()`, and **denies** any procedure that role does not own.

**Why enforcement rather than instruction.** ADR-010 §Decision: *"**Role separation is enforced structurally, not by instruction** … 'The coder cannot run the reviewer's procedure' is a **fact of the runtime**, not a request in a prompt."* The rejected alternative is named: an earlier design where roles were "hats" a single session could wear — *"Rejected: role separation was prompt-only. The same context that wrote the code could wear the reviewer hat."*

**It was found to be half-true, and fixed.** ADR-012 discovered that a *consult* (one agent spawning another) inherited the **caller's** skill set, not the callee's. ADR-018 closed it, and states why prose was rejected: *"prose-only self-refusal with no hook backstop … is defeatable by prompt injection or a simply confused subagent."* It also names a subtle risk: Claude Code's hook exit-code semantics *"**fail open** by default"*, so the hook is written so any internal error resolves to an explicit **deny**.

**Single source of truth.** Role→skill ownership is expressed in exactly one place, `skills_for_role()`. The alternative — generating a declarative list in each agent's frontmatter — was **rejected**: *"Generating it would preserve a field that *looks* like an allowlist and enforces nothing — manufacturing the exact false invariant task 6 exists to kill."*

**Accepted cost.** A foreign role's procedure stays **visible** in the menu and fails on invocation. ADR-018 §Decision 5: *"a menu entry that fails on invocation is a discoverability nuisance, not a boundary violation."*

**⭐ Relevance to your decision.** Only one: **the hook is fkit's demonstration that it can enforce a rule rather than request one.** Wherever your recommended model needs a guarantee (who may write a transition, who may append to a log), fkit has a working mechanism to hang it on, and the mechanism runs on **fkit's** side of the boundary — it never needs to exist inside aiboard.

### 5.5 ⚠️ The measured cost of governance, and the honest counter

fkit's governance is not free and there is a **measured price on the table right now**: the three known-wrong briefs of §4.1.1.

**They cannot be lawfully repaired by any agent.** They sit in `done/`; correcting their `## Status` to `✅ Done` is a close-state edit, which only a mover may make, and a mover may only be invoked by the producer. A fkit producer **refused** to hand-edit them, correctly. So three records are **known wrong, publicly documented as wrong, and frozen**.

⛔ **The asymmetry must be stated both ways, and it is not a win for either side:**

- **fkit has a governance rule with a measured cost** — three known-wrong rows that no agent may fix.
- **aiboard has no repair problem here only because it has no governance at all.** No rules, therefore no cost — **and no protection**. Nothing in aiboard stops any writer from moving any card at any time for any reason.

**Neither of those is obviously right.** One project pays for a guarantee and can point at the bill. The other has no bill because it bought nothing. **Please do not read this section as "fkit's rules are bad" or "aiboard's freedom is bad."** It is one data point about what a close gate costs when it is real.

#### ⏱ 5.5.1 — CORRECTION AND NEW EVIDENCE, 2026-09-18, added after §5.5 was written. The text above is left unchanged.

⭐ **The bill came in while this report was being written, and you should see the invoice.** [M]

Two of the three records were repaired on 2026-09-18 (§4.1.3). **Here is what repairing two lines of text inside a governed system actually took:**

1. A producer found the repair was **unreachable**. fkit's `/fkit-task-done` skill has a purpose-built *contradicted-close repair* exception for exactly this shape. Every bar of it held on the evidence — **except one**: the bullet reading *"never fire for a non-owner identity — a producer **spawned** to close is an agent (ADR-033 §5) and stops here."*
2. The producer **stopped and escalated**, which is what the rule requires.
3. **The owner ruled, live**, authorising a one-time bypass — having been shown in the option text he chose that it *"is a real change to a rule that exists to stop agents forging closes"* and that *"it sets a precedent an agent can point at later."*
4. The repair wrote **plain `✅ Done`, with no agent-closed marker**, because git shows the owner himself closed both tasks on 2026-07-10 — so stamping *"not owner-verified"* would have been **false**, and ADR-048 bars downgrading an owner-closed task.
5. An **ADR addendum** was written to record the grant, scoped as *"a **scoped, spent grant**"* that *"cannot be re-used"*, with a section headed *"⛔ What a future agent may NOT take from this."*

⭐ **Read that sequence as an engineering datum, in both directions, exactly as §5.5 asks:**

- **For the governance model:** the gate **held**. An agent that could have quietly fixed two rows did not; it stopped, escalated, and a human decided. The marker rule bent only where applying it literally would have written a **falsehood** — and the reasoning for that was recorded, not assumed. ⭐ **Note what made the correct value knowable at all: git evidence of an owner-performed close.** Provenance data, not a status field, is what resolved it. That is a direct argument for Q2-D and Q10.
- **Against the governance model:** correcting two characters of a **duplicated** field — a field that nothing reads, whose authoritative value was already visible in the folder *and* the board row — consumed a producer spawn, an owner interruption, a live ruling, a bypass of a safety rule, and a permanent amendment to an architecture decision record. ⛔ **Under a single-carrier model (Q1-A) or a derived-status model (Q1-C), this repair would not have existed as a task at all, because the wrong value could not have been written.**

⚠️ **And one record is still wrong.** `0014` was left by owner ruling because nothing — not git, not a board row, not the folder — establishes what its correct value is. **The single-carrier models do not merely reduce this class of repair; for `0014` they dissolve the question**, because the folder would be the answer by definition.

---

## §6 — Open questions

**Each question below carries its options AND the standing "neither".** ⭐ **On every one of them, "neither of these — here is a better design" is a live, invited, first-class answer.** That sentence is repeated on every question deliberately; it is not boilerplate.

---

### Q1 — Where should status live? *(the core question; §4.1)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> ⭐ **NEITHER** — current-state metadata (`task.json`) **plus** an audit journal (`history.ndjson`) **plus** a generated portable summary in the brief, all written by one transition library inside a recoverable transaction. *"This removes writable peer carriers without pretending every useful representation must exist only once."*
>
> **Full text, verbatim, in §8.2 under its own heading *"Q1 — Where should status live?"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | aiboard's: one carrier, the folder. A status change is a directory move. |
| **B** | fkit's: multiple carriers, reconciled by a drift checker. |
| **C** | `aiboard-lead`'s: status is a **fold over a typed append-only event log**; nothing stores current state. |
| **D** | fkit's: one authoritative carrier plus a **tool-written, never-hand-edited projection** so a brief still reads standing alone. |
| ⭐ **NEITHER** | **Something none of us proposed.** Fully live. |

**Weigh in your answer:** the born-wrong migration defect and its backfill lesson (§4.1.1); that fkit's drift detector did **not** catch any of the three (§4.1.2); **what repairing two of them actually cost, which is now measured (§5.5.1)**; the offline-legibility counter-argument both leads under-weighted (end of §4); and, if you choose C, who or what writes the log truthfully (§4.10's counter).

---

### Q2 — How many statuses, and is the vocabulary open or closed? *(§4.2)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> **Take C and D — yes, both**, with a validated workflow graph. ⛔ And a direct hit on fkit's own D: *"Do not use a bare `human_verified: true` boolean. Record who initiated and who approved. Verification is an act by a principal, not a property inferred from a channel."*
>
> **Full text, verbatim, in §8.2 under its own heading *"Q2 — How many statuses, and open or closed?"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | aiboard's four, blocked-as-relation. |
| **B** | fkit's six (really nine forms across two vocabularies). |
| **C** | `aiboard-lead`'s: an **open, board-configured vocabulary with declared semantic classes** (`not-started` / `active` / `terminal`). |
| **D** | fkit's: **four states plus orthogonal, tool-written transition provenance** (who, what kind of actor, human-verified or not). |
| ⭐ **NEITHER** | Fully live. |

**Please also answer explicitly:** C and D are compatible. **Should both be taken?**

---

### Q3 — Id scheme, and the reuse policy *(§4.3)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> ⭐ **NEITHER** — accept the legacy `NNNN` ids unchanged and forever; default new boards to type-prefixed ULIDs; ids stay in folder names for discoverability but links resolve through an index. **Reuse policy, explicit: never reuse, renumber or recycle, including cancelled entities.**
>
> **Full text, verbatim, in §8.2 under its own heading *"Q3 — ID scheme and reuse"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | aiboard bends to fkit's `NNNN` (this is `aiboard-lead`'s own position, against its own convention). |
| **B** | fkit adopts `T-`/`S-` prefixes. |
| **C** | `aiboard-lead`'s: id out of the folder name entirely; slug-named folders, `id:` field only. |
| **D** | fkit's: **board-configurable id pattern**, but the id must appear in the folder name in whatever shape is configured. |
| ⭐ **NEITHER** | Fully live. |

⚠️ **Whichever you pick, please state a reuse policy explicitly.** fkit's is *never reused, never renumbered, never recycled from a cancelled task*; aiboard's model does not state one; and fkit's entire cross-reference graph depends on the answer.

---

### Q4 — Sprint representation, and where the board prose lives *(§4.4)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> **D plus a final-membership snapshot** at sprint closure. On the prose: verbatim relocation to per-task `legacy-board-notes.md`, archived legacy boards for the ambiguous remainder, and *"Do not require complete semantic cleanup during migration."*
>
> **Full text, verbatim, in §8.2 under its own heading *"Q4 — Sprint representation and board prose"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | aiboard's: sprint entity, membership a field on the task, views derived. |
| **B** | fkit's: the board file **is** the storage. |
| **C** | `aiboard-lead`'s: **drop the sprint entity**; a sprint becomes a saved query plus a goal. |
| **D** | fkit's: keep a sprint **document**, but membership is a live **query** not a stored list. |
| ⭐ **NEITHER** | Fully live. |

⛔ **Any answer must say where the 688KB of prose currently living in board Task cells goes.** A model that makes boards derived without naming a home for that text has relocated the problem.

---

### Q5 — Brief format *(§4.5)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> ⭐ **NEITHER** — JSON Schema metadata beside Markdown narrative, with `schema_version` and explicit migrators. It rejects the premise that the zero-dependency preference forces the choice: *"JSON avoids an invented YAML dialect and requires no custom scalar grammar."*
>
> **Full text, verbatim, in §8.2 under its own heading *"Q5 — Brief format"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | aiboard's hand-written YAML subset. |
| **B** | fkit's `## Section`-as-field. |
| **C** | `aiboard-lead`'s: **TOML front matter** — a format with an actual specification. |
| **D** | `aiboard-lead`'s inverted variant: **no front matter, one `## Fields` block** — one syntax per file. fkit leans here. |
| ⭐ **NEITHER** | Fully live. |

⚠️ Both leads hold this at **medium** confidence — the weakest-held point in the report. fkit adds: **whichever syntax wins, publish a schema and validate it**; 80 of fkit's 89 distinct headings appear in ≤ 2 files, so the field set has never been enforced on either side.

---

### Q6 — Per-task artifacts *(§4.6)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> **Open folders with a typed artifact registry** — and it answers this question's explicit ask about the review ledger in fkit's favour: *"Preserve the two-party review ledger as a first-class document with section ownership; events record its lifecycle, not its entire content."*
>
> **Full text, verbatim, in §8.2 under its own heading *"Q6 — Per-task artifacts"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | Closed set of known filenames (both projects today). |
| **B** | `aiboard-lead`'s: **open folder** — any `*.md` is a named document the UI shows. Low friction; both leads agree. |
| **C** | `aiboard-lead`'s: **one typed event log replaces the several files**. |
| **D** | fkit's: **open folder plus a declared per-file append-only flag**. |
| ⭐ **NEITHER** | Fully live. |

**If you choose C**, please address what happens to fkit's two-party review ledger, whose value is that one file shows the whole decision state at a glance (§4.6).

---

### Q7 — Ownership *(§4.7)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> **Structured principals, separated into accountability and assignment.** ⭐ It also answers this question's untested-human-assignee warning directly: *"Test the human case explicitly before release: creation, reassignment, deletion/renaming of principals, display names, unassigned work, and mixed human/agent assignment."*
>
> **Full text, verbatim, in §8.2 under its own heading *"Q7 — Ownership"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | Free-text `assignee` (aiboard today). Both leads agree this already suffices. |
| **B** | `aiboard-lead`'s: **structured `{kind: role\|human\|agent, id}`**. fkit prefers this to its own position. |
| ⭐ **NEITHER** | Fully live. |

⚠️ **Neither project has ever assigned a task to a human.** The human-assignee case is untested on both sides, and it is the case the no-framework constraint (§5.1) most depends on.

---

### Q8 — Dependencies *(§4.8)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> **Typed, single-direction links** with structured notes and relation-specific validation; `depends_on` stored once, `blocks` derived; cycles checked only where they are invalid. *"Migration must produce an exception report for every unparseable fkit declaration."*
>
> **Full text, verbatim, in §8.2 under its own heading *"Q8 — Dependencies"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | aiboard's `blocked_by` list, `blocked` derived, cycle detection. Both leads agree this beats fkit's. |
| **B** | fkit's stored bidirectional prose edge. **fkit does not defend it.** |
| **C** | `aiboard-lead`'s: a **general typed-link table** (`blocks`, `relates-to`, `duplicates`, `parent-of`) — jump straight there rather than migrating twice. |
| **D** | fkit's: **links must be ids, not prose**, with commentary moved to an adjacent note field. |
| ⭐ **NEITHER** | Fully live. |

⚠️ Whatever is chosen, **fkit has 362 dependency declarations and no cycle detection of any kind.**

---

### Q9 — The close gate, if aiboard writes at all *(§4.9)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> ⭐ **NEITHER** — one command processor with optional policy adapters. A drag *"normally receives an immediate accepted/rejected result"* and becomes pending only when policy says so, *"rather than snapping back silently"* — which is a direct answer to this question's own queue-drain warning.
>
> **Full text, verbatim, in §8.2 under its own heading *"Q9 — Close gate"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | aiboard writes directly (today's behaviour). |
| **B** | `aiboard-lead`'s: **config-declared pre-transition hook** that may veto and receives the initiator's identity. Generic; both leads support the shape. |
| **C** | `aiboard-lead`'s: **propose-only** — aiboard emits proposed transitions to a queue the consuming project drains. **fkit prefers this**, on the two-uncoordinated-writers argument (§4.9). |
| ⭐ **NEITHER** | Fully live. `aiboard-lead` explicitly asked for an outside read here. |

⚠️ **If you recommend C, please say what drains the queue and how fast.** A drag whose card snaps back is a bad experience, and the user experience is the entire point of aiboard.

---

### Q10 — History and auditability *(§4.10)* — **no incumbent; every answer is a third answer**

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> **Minimum viable structured audit, not full event sourcing** — i.e. **C**. Revisions, before/after values, actor, approver, channel, reason, transaction id; *"The tool writes the events; agents request commands"* — which is this report's own §4.10 counter-argument, adopted. *"Keep git as a second forensic layer, not as the task-history API."*
>
> **Full text, verbatim, in §8.2 under its own heading *"Q10 — History and auditability"*.** ⛔ **Read §0.8.1 before you weight this.**

| Option | Summary |
|---|---|
| **A** | Leave it. Reconstruct from prose and git, as both do today. |
| **B** | Typed append-only event log per task; status derived. (Connects Q1-C and Q6-C.) |
| **C** | Minimum viable: `created` / `updated` timestamps plus a tool-written transition record, without full event sourcing. |
| ⭐ **NEITHER** | Fully live. |

⚠️ **fkit is the weaker side here and says so: not one of its 404 briefs carries a timestamp of any kind.** If you choose B, address who writes the log — an agent that sometimes skips a step produces a log with holes, and a believed log with holes is worse than prose known to be unreliable.

---

### Q11 — ⏸️ THE PARKED QUESTION: if aiboard ever writes back, should a browser drag invoke fkit's movers?

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> ⭐ **NEITHER** — browser and movers both invoke the same lower-level transition service; do not shell from the UI into today's multi-step mover. ⛔ *"'Human dragged it' must never automatically mean 'owner verified it.'"* **See §Q11.2 below: Codex and `aiboard-lead` converged on this independently.**
>
> **Full text, verbatim, in §8.2 under its own heading *"Q11 — Should a browser drag invoke fkit's movers?"*.** ⛔ **Read §0.8.1 before you weight this.**

**Status: deferred by the owner on *sequencing*, not on merit.** It was asked on 2026-09-18 and not answered; fkit's lead is holding it for the final decision gate. fkit's own task record marks it *"the highest-risk design question here."*

**The problem.** A human drags a card from "In progress" to "Done" in a browser. In fkit's model that transition may only be performed by a producer, via a mover procedure, and any close performed without the owner present must be stamped `(agent-closed — not owner-verified)`.

| Option | Summary |
|---|---|
| **A** | aiboard performs the move directly. ⛔ **Then a browser drag forges a close** — it bypasses the mover, skips the coupled steps (banner, rows, links), and writes no marker. |
| **B** | The drag invokes fkit's mover through the pre-transition hook. Correct, but every transition becomes a shell-out with a latency and failure mode in a UI polling every 3 seconds. |
| **C** | Propose-only (Q9-C). The drag records an intent; fkit's own tooling performs the close properly. |
| ⭐ **NEITHER** | Fully live. |

#### ⭐ `aiboard-lead`'s reframe — **presented as a PROPOSAL, not as a resolution**

⭐ **VERBATIM — `aiboard-lead`. Reproduced unedited between the rules.**

═══════════════════════════════════════
*On the parked close-marker question:* my proposal, offered as a proposal — if a **human** drags the card, the close is owner-verified by definition, so `(agent-closed — not owner-verified)` would be factually wrong on that row. So the hook must pass through *who initiated the transition* and let fkit decide the marker from that. That reframes it from a yes/no into a plumbing requirement.
═══════════════════════════════════════

**⟦fkit-side note⟧** `fkit-architect` finds this argument **correct on its own terms** and wants to be clear about what it does and does not settle:

- **It settles the marker semantics.** A human drag is owner-verified *by definition* — the owner is the human doing the dragging. Writing *"not owner-verified"* on that row would be **factually false**, and fkit's whole justification for the marker (§5.3) is that the board *"can at least be read honestly by someone who looks."* A marker that lies defeats its own purpose. ✅ **fkit accepts this half.**
- **It does not settle the writer problem.** Knowing *who* initiated a transition tells fkit what marker to write. It does not tell aiboard whether it may write the folder move itself while a fkit mover might be running (§4.9). ⚠️ **Q9 and Q11 must be answered together.**
- **It has a dependency neither lead has verified:** it requires aiboard to reliably distinguish *"a human dragged this in a browser"* from *"an agent called the MCP tool"*. ⛔ **Neither lead has confirmed that aiboard's HTTP layer can make that distinction today.** Please treat it as an unverified precondition.

⛔ **This is offered to you as a proposal to evaluate, not as an agreed position between the two leads, and not as anything the owner has ruled on.**

#### ⛔ ⏱ Q11.1 — THE UNVERIFIED PRECONDITION IS NOW VERIFIED, AND IT IS **FALSE**. 2026-09-18, checked by `aiboard-lead` against its own source; re-verified independently by `fkit-architect`. The bullets above are left unchanged.

The third bullet above says: *"it requires aiboard to reliably distinguish 'a human dragged this in a browser' from 'an agent called the MCP tool'. ⛔ Neither lead has confirmed that aiboard's HTTP layer can make that distinction today. Please treat it as an unverified precondition."*

⭐ **`aiboard-lead` checked. It reports two findings, and the second is much worse than the first.**

**FINDING 1 — the question contains a category error, and it is ours.** [A✓]

aiboard's MCP server is a **separate stdio process** that constructs a `Board` and calls the same store methods **directly** — `aiboard/mcp.py` runs `Server(board, author).serve_stdio()`, and its handlers call `board.move_task(...)` in-process. **It does not speak to the HTTP server at all.** HTTP and MCP are **two doors into one store**, not one layer observing two kinds of traffic.

⛔ **So the question as this report posed it has no yes/no answer. The HTTP layer never sees an MCP call, and never will.** *(Verified by `fkit-architect` reading `aiboard/mcp.py` and `aiboard/store.py` at HEAD `df554b9`.)*

**FINDING 2 — the real one: aiboard has no identity at all.** [A✓]

- `aiboard/server.py` reads the actor from the request body, unvalidated, with a default: `author = str(body.get("author") or "web").strip() or "web"`.
- In the browser that value comes from a **free-text input the user types into** — `aiboard/web/index.html` carries `<label class="who">you: <input id="author" placeholder="your name"></label>` and sends `const author = () => $('#author').value.trim() || 'web'` with every mutating request.
- `aiboard-lead` grepped its server for auth / token / session / cookie / CSRF and got **zero** hits. ⭐ **`fkit-architect` re-ran that grep across the whole package (`*.py`, `*.js`, `*.html`, excluding tests, matching `authoriz*`, `authenticat*`, `session`, `cookie`, `csrf`, `token`) and independently got zero matches** [A✓].

⛔ **Consequence, stated flatly: anything that can reach `127.0.0.1:8484` can post a status change claiming to be anyone.** An agent can post `author: "Mark"`. A human who never typed a name into that box is recorded as `"web"`.

⛔ **What this does to the reframe above.** `aiboard-lead`'s *"pass through who initiated the transition"* proposal is **sound as a requirement and unimplementable on today's aiboard.** It presupposes an identity story that **does not exist and that nobody has scoped**. The fkit-side note above accepts the marker-semantics half of the argument — that half still stands, and stands on logic, not on plumbing. **The plumbing is the part that is missing, and it is a larger piece of work than "pass a field through a hook".**

#### ⭐ Q11.2 — TWO INDEPENDENT READERS CONVERGED HERE, AND THE CONVERGENCE IS ITSELF EVIDENCE

⏱ *2026-09-18, `fkit-architect`.*

`aiboard-lead` reached the finding above by reading its own source. **Codex reached the same place independently, from this report alone, without access to either codebase — and it went further.** Its item 10, verbatim:

> **A browser user is not "the owner by definition."** A UI channel identifies where a request came from, not who authorized it. Even a human owner dragging a card has requested a transition; that does not necessarily certify tests, review, or acceptance. Initiator and approver must be separate authenticated principals.

and, in its answer to Q11:

> A browser request supplies an authenticated initiator. […] "Human dragged it" must never automatically mean "owner verified it."

⭐ **Two readers with different evidence, different models, and different loyalties landed on the same defect: the reframe assumes an authenticated principal that nothing in either system provides.** `aiboard-lead` found *"there is no identity"*; Codex found *"a channel is not an authorization, and initiator is not approver"*. **They are the same hole seen from opposite sides.**

⚠️ **Note the direction this cuts.** It does **not** rescue fkit's position — Codex is equally clear that fkit's own close gate is *"not a laundering-proof gate"* (§5.2's own admission) and that routing through a shared transition service is the only real fix. **It removes an option from the table for both sides:** Q11-A and Q11-B both silently assume aiboard can tell who is acting. It cannot.

⛔ **New scope this exposes, and nobody has costed it:** giving aiboard an identity model is a prerequisite for *any* write-back design, and it is not on either project's board today. **If your recommendation needs to know who performed a transition, please say so explicitly and say what minimum identity mechanism it requires** — a single configured owner name? a local token? an OS user? — because today the answer is *"a text box"*.

---

### Q12 — Migration safety *(arising from §4.1.1; fkit-architect's addition)*

> ⏱ **CODEX'S ANSWER TO THIS QUESTION, 2026-09-18 — folded in after drafting.**
> ⭐ **NEITHER — and this is the verdict that governs its whole answer:** *"do not begin with a corpus migration."* Compatibility adapter, shadow reads, staged conversion — an explicit eleven-step sequence beginning *"Freeze destructive convergence work"* and ending *"Enable browser writes only after recovery, concurrency, and authorization tests pass."* ⚠️ **It also says row-by-row verification (option B) is *necessary but not enough*.**
>
> **Full text, verbatim, in §8.2 under its own heading *"Q12 — Migration safety"*.** ⛔ **Read §0.8.1 before you weight this.**

Whichever model you choose, adopting it means a migration of **404 task folders, 404 ids, 404 statuses and 539 board rows**. The last migration of this exact shape silently mis-populated a fraction of the field it was introducing, and nobody noticed for 59 days.

> #### ⏱ RATE CORRECTION, 2026-09-18 — `fkit-architect`, on Codex's item 7, which is correct.
>
> ⚠️ **This question previously stated that rate as a bare "3.75%", twice, as though it were the migration-wide error rate. It is not, and stating it that way overstated the defect's concentration.** Both rates, each with its denominator named [M, re-verified at `331f298`]:
>
> - **3.75%** — 3 of the **80** briefs the migration wrote into `done/`, the population in which the wrong `🔲 Backlog` default was possible at all.
> - **2.97%** — 3 of **all 101** briefs the migration touched and gave the new `## Status` field. ⭐ **This is the migration-wide rate.**
>
> ⛔ **Keep both. Do not pick one.** Codex's objection was to a missing denominator, not to the figure — see §4.1.1's correction block for the same fix at source.

| Option | Summary |
|---|---|
| **A** | Migrate, then run the existing consistency checker. *(This is roughly what happened last time. It did not catch it.)* |
| **B** | **`aiboard-lead`'s mitigation, which fkit endorses:** derive every duplicated value **from the single authoritative source**, never from a default, and **verify row-by-row afterwards**. |
| **C** | Migrate in a shape that cannot be wrong — e.g. if status is derived, there is no status field to mis-populate. |
| ⭐ **NEITHER** | Fully live. |

⚠️ **Please answer this one even if you consider it out of scope.** It is the difference between a good model adopted correctly and a good model adopted with a **2.97%-to-3.75%** error rate ⏱ *(both denominators named in the correction block above; this line read a bare "3.75%" when drafted)* baked into 400 records.

---

## §7 — Limitations

### §7a — aiboard's limitations

> ⭐ **VERBATIM — `aiboard-lead`'s own words about its own system, reproduced unedited.**
> ⚠️ **It is unusually candid and the expert should weight that.** It volunteers, unprompted, that aiboard duplicates sprint membership while arguing against duplication; that its comments feature has never been used; and that the system has had exactly one user.

═══════════════════════════════════════
§7 — LIMITATIONS (my half)
═══════════════════════════════════════

**What I did not read.** fkit's mover procedures, the role-lock enforcement hook, `/fkit-status`, `dashboard.sh`, and the knowledge-base/ADRs. Everything I assert about fkit's *files* is measured from the tree. Everything about fkit's *procedures* comes from fkit-lead's prose and should be weighted as hearsay.

**What I did not build.** No Node. The port scoping is a reading of the Python source, not a prototype. The `fcntl`→lockfile risk specifically is unvalidated — stale-lock reaping and retry/backoff are the parts I'd expect to be wrong.

**Benchmark caveats.** Synthetic board, real fkit content. One sprint owning every task — that is the **worst case** for the quadratic path; a board with many small sprints would measure faster. macOS APFS with a warm page cache; Python 3.9. I measured `Board.snapshot()` directly, not end-to-end HTTP, so JSON serialisation and socket transfer are excluded (payloads were 139–475KB). The fix prototype was verified on task ids and per-status counts only, not field-by-field equality.

**aiboard has never run at scale in real use.** Its largest real board is its own: 21 tasks.

**aiboard's comments feature has never been used.** There are **zero** `comments.md` files on aiboard's own board. Comments, `needs_reply` and the stale detector are implemented and unit-tested but have never been exercised in anger — and aiboard's own T-020 already suspects the needs-reply logic oscillates when both parties acknowledge each other. Any part of the report that leans on the comments channel is leaning on untested ground.

**aiboard has had one user.** As far as I know it has never been used by anyone but its author, and never by a non-agent human — which is notable given that "humans can read it" is the entire premise.

**I am arguing against duplication while my own system duplicates.** aiboard stores sprint membership in both the task's `sprint:` field and the sprint's `tasks:` list. `check` detects the disagreement and `--fix` repairs it — that is mitigation, not absence. The expert should know that my point-1 and point-8 positions are not perfectly practised by the system I'm advocating from.

**One measurement remains unexplained.** The 15,650-char figure from 2026-09-16 is not accounted for by the chars-vs-bytes finding that reconciled the other two.

═══════════════════════════════════════

> ⟦**fkit-side note on §7a's last line only** — nothing inside the block is altered.⟧
> ⭐ **That measurement is now accounted for.** §2.4 of this report resolves it: **15,650 is the longest *line*, in bytes, of `dashboard.sh`'s rendered stdout** — not a raw-file figure at all. `aiboard-lead`'s statement was true when it was written; it is superseded by a measurement taken afterwards, and is left byte-identical per both projects' *annotate-never-rewrite* practice.

### §7b — fkit's limitations

*(Written by `fkit-architect`, held to the same standard as §7a. What was not checked, and what fkit has never proven.)*

**What I did not read.** aiboard's Python source. I performed a **structural spot-check** of its repository only — directory shape, file counts, LOC, dependency declaration, `aiboard.json` — sufficient to confirm §3a's factual claims but **not** to verify any claim about aiboard's *behaviour*. ⛔ **Everything in this report about what aiboard's code does — the O(n²) benchmark, the lock semantics, the MCP tool count, the `check` rule list, the UI's write behaviour — is `aiboard-lead`'s claim, tagged [A], and I did not verify a single one of them.**

**What I did not measure, and it matters.**

- ⛔ **I did not audit whether fkit's 270 `Blocks:` declarations agree with its 362 `Depends on:` declarations.** I could not do it reliably — the values are free-text prose, not id lists. **`aiboard-lead` predicts this edge has drifted exactly as status did, and fkit cannot currently disprove it.** This is the single largest unexamined area in fkit's own model, and it is unexamined because of how fkit stored the data.
- **I did not audit whether fkit's 404 `## Sprint` fields agree with its 539 board rows.** Sprint membership is fkit's *second* stored duplication and I checked neither direction.
- **I did not audit the `## ID` field against folder names** across the corpus. fkit has a drift check named `id-mismatch`; I did not run a full sweep.
- **I did not check the 21 cross-task path links `aiboard-lead` says folder-as-status would break**, nor its note that *"some are already broken from an earlier move."* I am relying on its count.
- **I did not measure any migration cost.** Every statement in this report about what a migration would cost is an estimate, not a measurement.
- **I did not test fkit's model at any scale other than the one it is at.** 404 tasks is what exists.

**What fkit has never proven.**

1. ⛔ **That redundancy-plus-reconciliation works.** It is fkit's central defence of its own data model (§3b.10), written into ADR-029 twice, and **§4.1.2 shows the detector failed to fire on all three known-drifted records**, for 59 days. fkit has never demonstrated its drift detection catching a real drift before a human found it. **The principle may still be right; the implementation has no wins on the board.**
2. **That the `(agent-closed)` marker changes anyone's behaviour.** It is on 70% of closed tasks, is invisible in the dashboard, and depends on agent compliance. No one has ever measured whether a reader has used it to distinguish anything.
3. **That fkit's model is usable by a human at all.** §2.1 is the counter-evidence, and it is the reason this entire investigation exists.
4. **That fkit's own conventions are followed.** 89 distinct `##` headings across 404 briefs, 80 of them appearing at most twice, with no validation anywhere. `## What to build` — a heading fkit's own brief-writing procedure emits — is absent from 4 briefs, and `## Priority` from 6.
5. **That fkit's status vocabulary is real.** Three of six values have zero instances in today's corpus (§3b.5).
6. **That anything here scales past one user.** fkit, like aiboard, has had exactly one user. Every claim about what an agent "must" be prevented from doing rests on one person's experience over 77 days.

**Where I am biased, stated plainly.** I am fkit's architect. I wrote §3b, §4's fkit positions, §5, and this section. I have argued **against** fkit's position on points 6, 7 and 8, and **against** fkit's own detector in §4.1.2 — but I chose which evidence to measure, and I framed §5's rules using fkit's own ADRs, which are documents fkit wrote to justify itself. ⛔ **Read §5 as the best case for fkit's rules, assembled by someone inside fkit.**

**One thing I want on the record because it cuts against my own section.** §5's rules are all justified by **incidents that happened** — a wiki task sitting open for a week, a reviewer hat worn by the context that wrote the code, a consult inheriting the wrong skill set. That is genuine evidence and I have quoted it. **But a rule justified by one incident, in a 77-day-old project with one user, is a rule with a sample size of one.** Every one of them could be an over-fit. I cannot tell from inside, which is why the owner asked for you.

---

## §8 — ⭐ CODEX'S INDEPENDENT REVIEW, FOLDED IN

⏱ **Added 2026-09-18 by `fkit-architect`, on `fkit-lead`'s relay of an owner ruling: Codex reads this report first, its findings are folded into this file, and only then does `fkit-external-expert` make the call. This section is stage one, complete.**

### 8.0 — What Codex is, and how to read this section

**Codex is a non-Claude model.** It was given this report and nothing else — no access to either codebase, no channel to either lead, no channel to the owner, no prior exposure to either project. Most of this file was written by Claude-based agents. **Codex is the one reader in the chain who is not, and that is the entire reason it is here** — it is the same model-diversity argument fkit uses for its own adversarial reviewer (§1.2).

⛔ **Before weighting anything below, read §0.8.1** — a measured calibration result on Codex's own claim-checking, disclosed against the fkit side's interest — **and §0.8.2**, which discloses that Codex read a copy of this report containing a defect since corrected.

**How this section is ordered, and why:**

| | |
|---|---|
| **§8.1** | Routing table — Codex's verdict on each of the ten points and twelve questions |
| **§8.2** | ⭐ **Codex's findings, complete and verbatim** — nothing removed, summarised, softened or reordered |
| **§8.3** | `fkit-architect`'s response, **including where fkit thinks Codex is wrong** |
| **§8.4** | What Codex did **not** review |

⚠️ **§8.3 is placed after §8.2 deliberately.** A rebuttal printed alongside a finding blunts the finding. **You read Codex whole, first.**

### 8.1 — Routing table: Codex's verdict, point by point and question by question

⭐ **Codex answered all twenty-two items and chose NEITHER on nine of them** — points 1, 5 and 9, and Q1, Q3, Q5, Q9, Q11 and Q12. **That is §0.1's "you may choose NEITHER" clause, which the owner asked for by name, exercised by a reader who owed nothing to either lead.** It is recorded here as a count because the count is itself a result: **41% of the items in this report were answered by rejecting the framing rather than by picking a side.**

| Item | Here | Codex's verdict | Its heading in §8.2 |
|---|---|---|---|
| Point 1 — Where status lives | §4.1 | ⭐ **NEITHER** — stable folder + `task.json` + one transition library | *Point 1 — Where status lives* |
| Point 2 — How many statuses | §4.2 | **C and D, with C tightened** into a validated workflow graph | *Point 2 — How many statuses* |
| Point 3 — Id scheme | §4.3 | **Keep fkit's ids; third design for new boards** (ULIDs) | *Point 3 — ID scheme* |
| Point 4 — Sprint representation | §4.4 | **D + immutable closure snapshot**; prose moved verbatim, never rewritten | *Point 4 — Sprint representation* |
| Point 5 — Brief format | §4.5 | ⭐ **NEITHER** — `task.json` + `brief.md` + generated summary block | *Point 5 — Brief format* |
| Point 6 — Per-task artifacts | §4.6 | **B + typed artifact registry**; keeps `review.md` whole | *Point 6 — Per-task artifacts* |
| Point 7 — Ownership | §4.7 | **B necessary but insufficient** — split `accountable` / `assignees` | *Point 7 — Ownership* |
| Point 8 — Dependencies | §4.8 | **C + D combined** — one typed directed edge, inverse derived | *Point 8 — Dependencies* |
| Point 9 — The close gate | §4.9 | ⭐ **NEITHER** of the three — one shared transition service | *Point 9 — The close gate* |
| Point 10 — History and auditability | §4.10 | **C, not full event sourcing** | *Point 10 — History and auditability* |
| **Q1** — Where should status live | §6 | ⭐ **NEITHER** — metadata + audit journal + generated summaries | *Q1 — Where should status live?* |
| **Q2** — How many statuses | §6 | **C and D, both**; ⛔ rejects a bare `human_verified` boolean | *Q2 — How many statuses, and open or closed?* |
| **Q3** — Id scheme and reuse | §6 | ⭐ **NEITHER**; **never reuse, renumber or recycle** | *Q3 — ID scheme and reuse* |
| **Q4** — Sprint representation | §6 | **D + final-membership snapshot** | *Q4 — Sprint representation and board prose* |
| **Q5** — Brief format | §6 | ⭐ **NEITHER** — JSON Schema beside Markdown | *Q5 — Brief format* |
| **Q6** — Per-task artifacts | §6 | **Open folders + typed registry**; ledger preserved | *Q6 — Per-task artifacts* |
| **Q7** — Ownership | §6 | **Structured principals**, accountability split from assignment | *Q7 — Ownership* |
| **Q8** — Dependencies | §6 | **Typed single-direction links** + exception report on migration | *Q8 — Dependencies* |
| **Q9** — Close gate | §6 | ⭐ **NEITHER** — one command processor, optional policy adapters | *Q9 — Close gate* |
| **Q10** — History and auditability | §6 | **Minimum viable structured audit** (option C) | *Q10 — History and auditability* |
| **Q11** — Browser drag and the movers | §6 | ⭐ **NEITHER** — both invoke one transition service | *Q11 — Should a browser drag invoke fkit's movers?* |
| **Q12** — Migration safety | §6 | ⭐ **NEITHER — do not begin with a corpus migration** | *Q12 — Migration safety* |

⚠️ **The routing table is a finding aid, not the finding.** Every row is compressed. **Read §8.2.**

### 8.2 — ⭐ VERBATIM: Codex's findings, complete and unedited

> ⭐ **EVERYTHING BETWEEN THE DOUBLE RULES BELOW IS CODEX'S OWN TEXT, REPRODUCED VERBATIM AND UNEDITED**, under the same rule this report applies to `aiboard-lead`'s blocks (§0.3). Nothing has been summarised, reordered, re-headed, softened, or interleaved with rebuttal.
>
> ⚠️ **Codex's own `##` and `###` headings are preserved as it wrote them.** They are *its* headings, not this report's sections — a heading reading "Point 1 — Where status lives" inside this block is Codex's verdict on point 1, not §4.1. The fkit side declined to re-level them because re-heading a verbatim block is an edit.
>
> ⚠️ **Codex's citations are its own.** Where it names a figure this report has since corrected (its items 7 and 8), the correction is recorded at the figure's own location — §3b.5, §4.1.1 and Q12 — and **not** inside this block.

═══════════════════════════════════════

## Headline — the real problem is not the data model

Do **not** converge or migrate the two stores yet. The report combines three separate problems—fkit stores essays inside board cells, aiboard has an O(n²) snapshot implementation, and their write/governance paths differ—and treats them as one schema problem. They are not. Fix the renderer/index, introduce a read-only compatibility adapter, and test the UI against the existing 404-task tree first. A 404-task migration, full event sourcing, ID rewrites, and write-back are not justified by the evidence. The right target is not “one source of truth”; it is **one declared authority for each kind of fact**, with generated projections, a separate audit record, stable documents, and one transactional command path.

## Where I think both authors are wrong

1. **“Single source of truth” is the wrong abstraction.** Current state, historical evidence, and human narrative are different facts. They need different authorities:

   - Current state: structured task metadata.
   - History: tool-written transition records.
   - Rationale and requirements: human-authored documents.
   - Boards and standalone summaries: generated projections.

   Duplication is safe when copies have declared ownership, revisions, and regeneration rules. The dangerous design is not “more than one copy”; it is **multiple writable peers with no authority hierarchy**.

2. **An event log does not make truth “free.”** It introduces schema evolution, replay, corrections, compaction, crash recovery, actor authentication, and incomplete-log failure modes. It also does not prove that an event was legitimate. Use a transition audit log, but do not make all task state event-sourced.

3. **The two measured failures do not have the same cause.**

   - fkit’s 858 KB board is mostly misplaced prose.
   - aiboard’s O(n²) snapshot is an algorithmic rescan bug.

   Both involve expensive reads, but neither requires a common storage model. The report’s §2.3 conclusion is rhetorically neat and technically unsupported.

4. **The report has not established that a human “cannot read” fkit’s board.** It established that the file is extremely large and unsuitable for chat rendering or board-style scanning. That is compelling evidence of poor presentation, not a usability study.

5. **The cross-sectional status counts are over-interpreted.** Zero tasks currently marked `in-progress` does not establish that `in-progress` is unused or unnecessary. A corpus dominated by archived work will naturally contain mostly terminal states. The report itself supplies historical evidence that `in-progress` was used.

6. **The drift evidence condemns the implementation, not redundancy in general.** The promised checker excluded closed rows and tasks without board rows. That proves the reconciliation coverage was inadequate. It does not prove that independently generated checksums, projections, or redundant indexes are unsound.

7. **The migration error is overstated.** Three errors among the 80 migrated `done` records is 3.75%; three among all 101 briefs that received the new field is 2.97%. Q12 repeats 3.75% as though it were the migration-wide error rate. It was not.

8. **The corrected status figures were not propagated.** After repairing two briefs, the final corpus implied by the report is 270 done, 115 backlog, and 19 cancelled—not 268/117/19. The “188 of 268” denominator is stale; 188/270 is 69.6%. The qualitative conclusion survives, but the final report is not numerically self-consistent.

9. **`0014` is not known to have a wrong brief.** Its carriers disagree and the intended historical state is unknown. Calling the brief wrong silently privileges the folder as authority—the very design question under review.

10. **A browser user is not “the owner by definition.”** A UI channel identifies where a request came from, not who authorized it. Even a human owner dragging a card has requested a transition; that does not necessarily certify tests, review, or acceptance. Initiator and approver must be separate authenticated principals.

11. **Free-text assignment is not a strict semantic superset of role ownership.** It accepts the same characters, but supplies no identity, validation, cardinality, or accountability semantics.

12. **Both authors are too eager to migrate.** The likely winning architecture can be placed in front of the existing fkit tree as an adapter. Re-keying or relocating hundreds of tasks before proving the browser solves the owner’s problem creates a half-migrated system without demonstrated benefit.

13. **Several “constraints” are preferences.** Only “aiboard remains useful without fkit” is fixed. Zero dependencies, Markdown-only canonical storage, IDs readable through `ls`, briefs readable in isolation, immediate drag writes, folder-as-status, producer-only close, and full event history are product or governance choices. Even the report’s interpretation that standalone use forbids optional fkit concepts from a plugin is the leads’ construction, not the owner’s quoted constraint.

## Verdicts on the ten comparison points

### Point 1 — Where status lives

**Verdict: NEITHER.**

Folder-as-status creates mutable paths. Three writable carriers create disagreement. Full event sourcing makes ordinary reads and recovery unnecessarily complex.

Use a stable task folder and a structured current-state record such as `task.json`. Status is authoritative there. Every supported mutation also writes a typed audit event. A generated summary block in `brief.md` may repeat status for portability, but it contains a source revision and is never consulted operationally.

All mutation paths must call one library that:

1. Acquires the board lock.
2. Checks the task revision.
3. Validates policy.
4. Records a recoverable transaction.
5. Atomically replaces current metadata.
6. Appends the audit event.
7. Refreshes projections.

That is intentional multi-model storage, not peer-to-peer duplication.

### Point 2 — How many statuses

**Verdict: take C and D, but tighten C.**

Use a configurable workflow, not an unconstrained list. Each state declares:

```json
{
  "id": "in_review",
  "class": "active",
  "terminal": false,
  "allowed_next": ["active", "done", "cancelled"]
}
```

Ship four defaults: `backlog`, `active`, `done`, `cancelled`. `blocked` remains a derived condition, not a mutually exclusive state. Transition provenance is orthogonal and records initiator, approver, channel, reason, and policy result.

An unrestricted vocabulary without transition rules merely moves hard-coding into configuration.

### Point 3 — ID scheme

**Verdict: keep fkit’s IDs now; do not normalize existing IDs. For new boards, use a third design.**

Treat IDs as opaque, immutable strings. Existing `0001`–`0404` values remain permanent. aiboard should accept them without renaming anything. New installations should default to type-prefixed, branch-safe IDs such as `task_<ULID>` and `sprint_<ULID>`.

Rules:

- Never reuse, recycle, or renumber an ID.
- References store IDs, never paths.
- Folder names contain the ID plus an optional non-authoritative slug.
- Imported legacy IDs may have aliases, but aliases never become reusable.
- Validators check uniqueness, not a single global formatting regex.

`1 + max` is human-friendly but branch-collision-prone. A configurable regex does not solve allocation.

### Point 4 — Sprint representation

**Verdict: D, extended with an immutable closure snapshot.**

Keep a sprint entity for goal, dates, status, authority, notes, and retrospective. Current membership is the task’s `sprint_id`; board views are derived. At sprint closure, generate an immutable manifest recording the final members and revisions so later task movement does not rewrite history.

The 688 KB of board-cell prose should not be silently redistributed. Migration should:

- Move confidently attributable text verbatim into `legacy-board-notes.md` beside the task, with source board and hash.
- Leave ambiguous or unmatched text in immutable legacy board archives.
- Never discard or semantically rewrite it automatically.
- Let later human curation move useful material into briefs, ADRs, or reports.

The backlog is not a sprint. Model it as `sprint_id: null`, not a permanent pseudo-sprint.

### Point 5 — Brief format

**Verdict: NEITHER.**

Use two files:

- `task.json`: machine state, versioned and validated by JSON Schema.
- `brief.md`: human narrative with unrestricted headings.

JSON avoids an invented YAML dialect and requires no custom scalar grammar. For standalone readability, the tool maintains a generated summary block at the top of `brief.md`, marked with the metadata revision:

```markdown
<!-- aiboard:summary revision=17; generated; do not edit -->
| ID | Status | Sprint | Accountable |
| ... |
<!-- /aiboard:summary -->
```

The checker detects a stale summary; operational code never reads it. This deliberately duplicates information as a portable cache while retaining clear authority.

### Point 6 — Per-task artifacts

**Verdict: B, but not “show and trust every Markdown file.”**

Task folders should be open. Metadata contains an optional artifact registry:

```json
{
  "artifacts": {
    "review.md": {"type": "review-ledger", "mode": "section-owned"},
    "worklog.md": {"type": "log", "mode": "append-only"},
    "plan.md": {"type": "document", "mode": "editable"}
  }
}
```

Unregistered files may appear as attachments but are not parsed, executed, or assumed safe. Preserve `review.md` as a materialized decision document; do not dissolve it into an event stream. Events can record that the ledger changed without replacing its useful whole-document view.

### Point 7 — Ownership

**Verdict: B’s structured principal is necessary but insufficient.**

“Owner” and “assignee” may not mean the same thing. Model two relations:

- `accountable`: zero or one principal responsible for lifecycle outcome.
- `assignees`: zero or more principals performing work.

A principal is `{kind, id, display}` where `kind` may be `human`, `agent`, `role`, `team`, or `service`. Board configuration supplies the principal registry. fkit’s current role maps to `accountable`; a solo user can assign themselves as both accountable and assignee.

Transition initiator and approver use the same principal type but are separate fields.

### Point 8 — Dependencies

**Verdict: combine C and D.**

Store one directed, typed edge on its source task:

```json
{
  "relation": "depends_on",
  "target": "0012",
  "strength": "hard",
  "note": "API contract only"
}
```

Derive inverse displays such as “blocks.” The relation registry declares whether a type is acyclic and whether it blocks a transition. Run cycle detection only for relations where cycles are invalid.

Support external blockers separately; not every blocker is another task. During migration, parse only unambiguous IDs. Quarantine prose that cannot be parsed and emit a visible migration warning—never infer “nothing.”

### Point 9 — The close gate

**Verdict: NEITHER direct writes, veto hooks, nor a permanently asynchronous proposal queue.**

Create one transition service/library used by CLI, HTTP, MCP, browser, and fkit. It owns the shared lock, revision checks, policy call, current-state update, event append, and projection refresh.

fkit supplies an optional policy adapter. Standalone aiboard supplies a permissive default. A browser drag normally receives an immediate accepted/rejected result. It becomes a pending proposal only when the configured policy requires external approval or asynchronous checks.

A hook alone cannot coordinate writes. A queue for every transition damages the core UI unnecessarily. This design provides one writer without making standalone aiboard depend on fkit.

Direct filesystem edits remain detectable but unsupported; real prevention requires routing fkit’s movers through the same library.

### Point 10 — History and auditability

**Verdict: C, not full event sourcing.**

Keep current state directly readable and add tool-written transition events:

```json
{
  "event_id": "...",
  "task_id": "0012",
  "revision": 18,
  "type": "state_changed",
  "from": "active",
  "to": "done",
  "initiator": {"kind": "agent", "id": "fkit-producer"},
  "approved_by": {"kind": "human", "id": "owner"},
  "channel": "browser",
  "reason": "...",
  "timestamp": "...",
  "transaction_id": "..."
}
```

Record assignment, sprint movement, and verification events too. Only the transition service writes them. The checker detects revision gaps and unmatched transactions.

Do not claim this is a security log: an agent with repository write access can still alter it unless commits or signatures provide an external trust boundary. Also, an event log cannot answer “time in review” unless review is actually represented as a state or typed event.

## Answers to the twelve open questions

### Q1 — Where should status live?

**Answer: NEITHER; use current-state metadata plus an audit journal and generated portable summaries.**

Status lives authoritatively in `task.json` at a stable path. `history.ndjson` records transitions but is not required to replay every task read. `brief.md` receives a revision-stamped generated summary for raw portability.

The transition library, not an agent following prose, updates all three within a recoverable transaction. This removes writable peer carriers without pretending every useful representation must exist only once.

### Q2 — How many statuses, and open or closed?

**Answer: take C and D, with a validated workflow graph. Yes, both should be taken.**

Provide four defaults, allow configured additions, require semantic class and allowed transitions, and keep blocking separate. Record structured provenance for every transition.

Do not use a bare `human_verified: true` boolean. Record who initiated and who approved. Verification is an act by a principal, not a property inferred from a channel.

### Q3 — ID scheme and reuse

**Answer: NEITHER; accept legacy IDs and use opaque, immutable, branch-safe IDs going forward.**

Do not re-key the current 404 tasks. Preserve `NNNN` forever as valid IDs. For new boards, default to type-prefixed ULIDs. IDs remain in folder names for discoverability, but links resolve by ID through an index.

Never reuse, renumber, or recycle IDs, including cancelled entities.

### Q4 — Sprint representation and board prose

**Answer: D plus a final-membership snapshot.**

The sprint remains a document/entity. Current membership comes from task metadata. Views are generated. Closing a sprint emits an immutable membership manifest.

Move attributable legacy cell prose verbatim to per-task `legacy-board-notes.md`; preserve ambiguous text in archived legacy boards. Do not require complete semantic cleanup during migration.

### Q5 — Brief format

**Answer: NEITHER; JSON Schema metadata beside Markdown narrative.**

Use `task.json` for fields and `brief.md` for prose. A generated metadata summary in the Markdown preserves standalone legibility. Store `schema_version` and provide explicit migrators.

Dropping the zero-dependency preference is also acceptable, but unnecessary for JSON.

### Q6 — Per-task artifacts

**Answer: open folders with a typed artifact registry.**

Keep plans, ledgers, logs, assets, and future artifacts as separate files. Declare special handling only when needed. Preserve the two-party review ledger as a first-class document with section ownership; events record its lifecycle, not its entire content.

### Q7 — Ownership

**Answer: structured principals, separated into accountability and assignment.**

Use `accountable` and `assignees`, both referencing a principal registry. Test the human case explicitly before release: creation, reassignment, deletion/renaming of principals, display names, unassigned work, and mixed human/agent assignment.

Free text may remain as `display`, never as identity.

### Q8 — Dependencies

**Answer: typed, single-direction links with structured notes and relation-specific validation.**

Store `depends_on` once and derive `blocks`. Support hard/soft strength, external blockers, and human notes. Detect cycles for hard dependency and parent relations, not indiscriminately for every link type.

Migration must produce an exception report for every unparseable fkit declaration.

### Q9 — Close gate

**Answer: NEITHER; one command processor with optional policy adapters.**

All writers invoke the same transition operation. fkit’s policy can reject, approve immediately, or return `pending_approval`. The UI reflects the actual result and leaves a pending card visibly pending rather than snapping back silently.

The shared service must own the lock. A pre-transition shell hook may be one policy adapter, but it is not the transaction coordinator.

### Q10 — History and auditability

**Answer: minimum viable structured audit, not full event sourcing.**

Add timestamps and typed transition records while retaining directly readable current state. The tool writes the events; agents request commands.

Include revisions, before/after values, actor, approver, channel, reason, and transaction ID. Validate continuity. Keep git as a second forensic layer, not as the task-history API.

### Q11 — Should a browser drag invoke fkit’s movers?

**Answer: NEITHER; the browser and movers should invoke the same lower-level transition service.**

Do not shell from the UI into today’s multi-step mover. Refactor the mover’s policy and coupled effects behind the common transition API.

A browser request supplies an authenticated initiator. If that initiator is the configured owner and the UI obtains whatever confirmation the policy requires, the transition may complete synchronously. Otherwise it becomes pending.

“Human dragged it” must never automatically mean “owner verified it.”

### Q12 — Migration safety

**Answer: NEITHER; do not begin with a corpus migration. Use compatibility, shadow reads, and staged conversion.**

A safe sequence:

1. Freeze destructive convergence work.
2. Snapshot the existing tree and record hashes/counts.
3. Implement a read-only fkit adapter.
4. Reproduce the UI and snapshot benchmark at 404 tasks.
5. Generate the new index/read model and compare every task, ID, status, sprint, and dependency against the old readers.
6. Run the UI read-only in real use.
7. Introduce the common transition service for a small canary set.
8. Support mixed schema versions rather than dual-writing all tasks.
9. Convert metadata incrementally, preserving IDs and paths.
10. Archive legacy boards; do not delete them after extracting prose.
11. Enable browser writes only after recovery, concurrency, and authorization tests pass.

Row-by-row verification is necessary, but it is not enough. Validate corpus-level invariants, exception counts, round-trip reads, and recovery after an interrupted transaction.

## Claims I could not verify / would not rely on

- Every behavioral claim about aiboard is effectively hearsay in this report. The fkit author inspected structure, not source behavior.
- The O(n²) benchmark was run by aiboard’s author, on a synthetic worst-case sprint, excluding HTTP serialization. It plausibly identifies a real defect but is not an independent capacity result.
- The 28,543 scanner-call count, locking semantics, MCP tool count, UI write path, checker coverage, and force behavior were not independently verified.
- The assertion that briefs are read raw “constantly” is anecdotal, despite being labelled `[M]`; no frequency was measured.
- The 21 affected cross-task links were reported by aiboard’s author and explicitly not checked by fkit.
- Migration costs are estimates; §7b says no migration was prototyped or measured.
- The drift test covered `dashboard.sh` on one archived sprint and a task without a row. That demonstrates a real coverage failure, but not necessarily the absence of every other consistency mechanism.
- “The three records were undetectable precisely because nothing recorded a transition” is unsupported. Two were born wrong during migration; a migration event could itself have been missing or wrong. A path/field invariant validator would have caught them without event sourcing.
- “Under a single-carrier model the wrong value could not have been written” is false. A single authoritative value can still be wrong; it merely cannot disagree with another carrier.
- “A typed event would have exposed entry into `done/` on day one” assumes the migration used the event-writing path. That is exactly what has not been established.
- The owner quotations are relayed by invested authors. I have no direct transcript or independent authentication.
- The role hook, fail-closed behavior, and producer-only enforcement are supported by fkit’s own ADRs, not an independent runtime test.
- The claim that the agent-close marker provides practical honesty has no measured behavioral evidence. It is invisible in the dashboard and present on most closed tasks.
- The final report retains stale figures after its mid-draft repair. Conclusions based on exact present-day status totals should be recomputed before use.
- Neither product has evidence from an independent human user. The central product premise—better human comprehension—remains untested.

## What I would do first if this were mine

I would not approve the convergence migration.

First, implement a read-only adapter that indexes the current fkit tree in one pass and serves it through aiboard’s UI. Independently reproduce and fix the O(n²) snapshot path. Put the real 404-task corpus in front of the owner and observe whether the UI solves the actual problem.

In parallel, specify only the narrow future contract: opaque IDs, stable paths, `task.json`, `brief.md`, typed links, structured principals, revisions, and a transition API. Do not re-key tasks, move folders, or introduce full event sourcing.

Re-scope task `0383`: preserve the old board, extract its prose into clearly attributed legacy artifacts, and generate a compact board view. Avoid any irreversible rewrite until the read-only integration has been used successfully.

**What’s next?** The final decision-maker should approve a read-only integration spike and reject any big-bang migration until that spike is benchmarked and used by the owner.

═══════════════════════════════════════

### 8.3 — `fkit-architect`'s response, and where fkit thinks Codex is **wrong**

⏱ *2026-09-18. Written after §8.2 was folded in, deliberately placed after it.*

⛔ **Unexamined deference is as useless to you as reflexive rebuttal.** Codex is not infallible, it did not read either codebase, and §0.8.1 records a measured miss. What follows says where fkit concedes and where it does not, in that order, so that the concessions are not used to soften the disagreements.

#### 8.3.1 — Where Codex is right, and fkit concedes without qualification

1. ⭐ **Its central reframe — *"the right target is not 'one source of truth'; it is one declared authority for each kind of fact"* — is, in `fkit-architect`'s view, the most valuable single sentence anywhere in this report, including everything fkit wrote.** It is a direct hit on the **shared blind spot both leads flagged against themselves** at the end of §4: both leads converged on "single source of truth, derive the rest", both flagged that convergence as the classic condition for a blind spot, and **both asked the expert to push on it.** Codex pushed, unprompted and without seeing that request treated as a hint. **It reframes duplication from a defect into a question of declared ownership and regeneration rules — which is precisely what fkit's own Q1-D projection proposal was groping toward without being able to name.**
2. **Its items 7 and 8 (the two arithmetic findings) are correct.** Both were independently re-measured and both are fixed in this pass; see §3b.5, §4.1.1 and Q12. ⚠️ **fkit records that an outside reader had to find them.**
3. **Its item 2 — *"an event log does not make truth 'free'"* — is right, and it is a harder version of fkit's own §4.10 counter-argument.** fkit argued the log's *writers* may be dishonest; Codex adds schema evolution, replay, corrections, compaction, crash recovery and incomplete-log failure modes, and separates *"a transition audit log"* from *"all task state event-sourced"*. **That distinction is better than either lead's framing of Q1-C / Q10-B and should be carried into whatever you decide.**
4. **Its item 4 is right and fkit overstated.** §2.1's heading says *"a human cannot read fkit's board"*. What §2.1 **measures** is that the file is 858,948 bytes, that 83% of task-row bytes sit in one column, and that it outgrew a chat message. **That is compelling evidence of unusable presentation. It is not a usability study, and no human has ever been observed failing to read it.** The heading should be read as shorthand for the measurements beneath it.
5. **Its item 9 on `0014` is right in principle** — calling that brief "wrong" does privilege the folder as authority, which is the question under review. ⚠️ **fkit notes, without disputing the point, that §5.5.1 had already conceded the substance**: *"nothing — not git, not a board row, not the folder — establishes what its correct value is."* Codex's framing is sharper than fkit's and fkit adopts it: **`0014` is not a wrong record, it is an unadjudicable one.**
6. **Its correction of *"under a single-carrier model the wrong value could not have been written"* is right as a general claim and fkit withdraws the sentence as written.** A single authoritative value can absolutely be wrong; it merely cannot *disagree with a second carrier*. ⚠️ **fkit does press one narrower point:** in *this specific defect*, the wrong value arose from **defaulting a field whose correct value was the path being written into**. Under folder-as-status there is no such field to default — the migration's act of moving the file *is* the status assignment. **So the sentence is wrong in general and closer to right for this defect class.** Take the general correction; do not discard the specific mechanism, which is what §4.1.1 is actually about.
7. **Its item 3 is right that §2.3 overreaches.** fkit's 858 KB board and aiboard's quadratic rescan do not share a *cause*. ⚠️ fkit observes only that Codex's own first recommendation — *"Fix the renderer/index"* for one and *"independently reproduce and fix the O(n²) snapshot path"* for the other — accepts a shared *remedy shape* (build an index) while denying the shared cause. **Codex is right about the cause; §2.3's rhetoric ran ahead of its evidence.**

#### 8.3.2 — ⛔ Where `fkit-architect` thinks Codex is **WRONG**

**(W1) Its item 5 — the `in-progress` over-interpretation — is wrong on fkit's data, and the mechanism it offers is contradicted by measurement.**

Codex writes: *"A corpus dominated by archived work will naturally contain mostly terminal states."* **That explanation does not fit.** [M, measured 2026-09-18]

- **114 task folders sit in `backlog/`** — the **non-terminal** board, where every live and unstarted task lives, because fkit has no `in-progress/` directory at all (§3b.1). **Not one of their briefs reads `🔄 In progress`.**
- Under the counting rule *"the first pipe-delimited cell of any row in any of the 11 board files"*, **zero** cells read `🔄 In progress` either. ⚠️ *(That rule is deliberately looser than §2.1's 539-row rule — it does not exclude non-task tables — so its row total is not comparable to 539. Only the zero is being asserted, and the zero is robust under both rules.)*
- Sprint 11 is **live right now** — its line-3 banner reads `🔄 In progress` — and the tasks on it are not marked in progress either.

⛔ **So the absence is not an archival artifact. The field is simply not maintained as a live signal**, which is the claim §3b.5 actually made. **And §3b.5 had already published Codex's own qualification verbatim** — *"It is zero today, not zero ever"*, with the `331f298` evidence that task `0078` once carried it. **Codex's criticism is aimed at a stronger claim than the report made, and its proposed explanation is contradicted by the data.**

**(W2) The last clause of its item 13 is presented as a correction to something this report already says, twice, in the two places that matter.**

Codex writes: *"Even the report's interpretation that standalone use forbids optional fkit concepts from a plugin is the leads' construction, not the owner's quoted constraint."* **That is correct — and it is what §1.4 and §5.1 both say, in bold, unprompted:** §1.4 marks the reconciliation *"and it is the leads' construction, not the owner's ruling"*, and §5.1 repeats *"The reconciliation the leads are using is theirs, not his"* and asks the expert to say so explicitly if a recommendation crosses the line.

⚠️ **fkit does not dispute the substance — it agrees, and asked for exactly this ruling.** What is wrong is the finding's *shape*: it is presented as an unflagged assumption that Codex uncovered. ⭐ **And the shape matters for calibration, because it is the same failure mode as the §1.3 miss in §0.8.1: a qualifier stated plainly in the document did not survive into Codex's reading of it.** Two instances is not a pattern, but it is two.

**(W3) Its headline recommendation — a read-only adapter spike, and *"I would not approve the convergence migration"* — is right about sequencing and wrong about what the spike can prove.**

⛔ **fkit states plainly that it agrees with most of this.** Freezing destructive work, snapshotting the tree, building a compatibility adapter, and putting the real 404-task corpus in front of the owner before re-keying anything is **better sequencing than either lead proposed**, and fkit would take it.

**Where fkit thinks it is wrong:** Codex asserts that *"the likely winning architecture can be placed in front of the existing fkit tree as an adapter"* and that the spike answers whether *"the browser solves the owner's problem."* ⚠️ **A read-only spike cannot answer that question, because the owner's stated problem is not read-only.** His own words, §1.3: *"regular humans can open in the browser and check the cards, their statuses, **maybe change something like change the status or like move something from one sprint to another**."*

- A read-only adapter tests **"can a human see it."**
- The owner asked for **"can a human see it and act on it."**
- **Every genuinely hard question in this report lives on the write side** — Q9, Q11, the two-uncoordinated-writers hazard (§4.9), the non-atomicity of *both* movers (§4.9.1), and the identity gap (§Q11.1).

⭐ **Codex's own step 11 concedes the point without naming it:** *"Enable browser writes only after recovery, concurrency, and **authorization** tests pass."* **There is no authorization to test.** §Q11.1 — verified after Codex read this file — establishes that aiboard has **no identity mechanism at all**: `author` is a free-text field defaulting to `"web"`, with zero auth constructs anywhere in the package. **So Codex's plan gates the decisive step behind a prerequisite that does not exist and that nobody has scoped, and its spike defers rather than reduces that risk.**

⛔ **fkit's amendment, offered to you rather than asserted over Codex:** take the read-only spike **and** run a parallel, cheap, non-destructive **identity and write-path spike** — enough to answer *"what is the minimum thing that lets aiboard know who is acting"* — because that answer, not the read benchmark, is what gates every remaining question. **If you disagree, say so; Codex may be right that a read-only win is worth having first even if it settles nothing on the write side.**

#### 8.3.3 — ⚠️ What Codex's verdicts change about this report's own framing

1. **The NEITHER count is the headline result, not the individual verdicts.** Nine of twenty-two. ⭐ **Both leads wrote positions; an independent reader rejected the framing of nearly half of them.** §0.1 said that was a first-class answer. It was.
2. **Codex and `aiboard-lead` converged on the identity gap independently** (§Q11.2) — different evidence, different models, different loyalties, same hole. **That convergence is stronger evidence than either finding alone.**
3. **Codex's Q6 and point 6 answers back fkit against `aiboard-lead`'s event-log proposal** on the one sub-question fkit asked to be protected: *"Preserve `review.md` as a materialized decision document; do not dissolve it into an event stream."* **fkit flags this as a place where the outside reader agreed with fkit, so that you can discount it knowing fkit wanted it.**
4. **Codex's Q2 answer goes after fkit's own third option.** *"Do not use a bare `human_verified: true` boolean. Record who initiated and who approved."* ⛔ **That is a rejection of the simplest reading of fkit's point-2 provenance proposal**, and §Q11.2 shows why it is right: a channel is not an authorization.

### 8.4 — What Codex did **not** review

⚠️ **Held to the same standard as §7a and §7b.**

- ⛔ **Codex read this document and nothing else.** It had no access to fkit's repository or aiboard's. **Every statement it makes about either system is a reading of this report**, with all of this report's selection bias — including the §7b bias `fkit-architect` declared, and the §1.3 defect it did not catch.
- ⛔ **It read a version of this report predating four of the corrections now in it.** It did not see §1.3's correction, §Q11.1's identity finding, §4.9.1's non-atomicity finding, or the corrected figures in §3b.5, §4.1.1 and Q12. **Its "claims I could not verify" list should be read against the *corrected* file, not the one it read.**
- **It did not verify its own recommendations.** No adapter was built, no benchmark run, no migration prototyped. Its eleven-step Q12 sequence is a design, at the same evidential level as everything the two leads proposed.
- **It had no channel to the owner**, exactly as §0.4 describes for both leads. Where it calls a constraint a preference (its item 13), that is its reading of the quotations relayed in this file — and it says so: *"The owner quotations are relayed by invested authors. I have no direct transcript or independent authentication."*
- **It is one run of one model.** Nothing here is a consensus of non-Claude readers; it is one.


---

## Appendix A — How to re-run every fkit measurement

All commands run from the fkit repository root, on 2026-09-18.

| Figure | Command |
|---|---|
| Board size on disk | `wc -c ai-agents/sprints/backlog.md` |
| Board size at HEAD | `git show HEAD:ai-agents/sprints/backlog.md \| wc -c` |
| Rendered board size | `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md \| wc -c` |
| Task folder counts | `ls -1 ai-agents/tasks/{backlog,done,cancelled} \| wc -l` |
| Brief count | `find ai-agents/tasks -name brief.md \| wc -l` |
| Status / Owner / Priority / Sprint distributions | parse `^## <Field>` + next non-blank line across all `brief.md` |
| Artifact adoption | count files by name across all task folders |
| Drift sweep | for each brief, compare the `## Status` glyph against its parent board directory |
| Board row counts | lines beginning `\|` in each board file, minus **2 header** and **2 separator** rows |
| The born-wrong migration | `git show 331f298:<brief path>` for `0014`, `0021`, `0041` |
| Drift detector behaviour | `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/done/sprint-1.md \| grep '^drift '` |

⚠️ **Every count in this report is reproducible by the rules above. If a figure here disagrees with one you compute, check the counting rule before concluding anyone was wrong** — §2.4 is the cautionary tale.

---

## Appendix B — Governing fkit documents, by durable anchor

Cited by heading and quoted fragment, never by line number, per fkit's own `durable-citation-anchors.md` convention. All paths relative to `ai-agents/knowledge-base/`.

| Subject | Document | Anchor used |
|---|---|---|
| A task is a folder; the four-digit id | `decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md` | §Decision 1–5, 8; §Options considered |
| Status duplication is deliberate | same | §Decision 2, *"The board-as-directory **is** the task's status in the data model"* |
| Two carriers, lint the disagreement | same | §Decision 5, *"carry both and lint the disagreement"* |
| Movers are producer-only | `decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md` | §Context; §Decision 1, 5; §"The limit — stated plainly" |
| The agent-closed marker's origin | `decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md` | §Decision 3; §"The honesty clause" |
| Role lock, enforced not instructed | `decisions/adr-010-role-locked-sessions-and-skill-lockdown.md` | §Decision 1–2; §Options considered |
| The consult hole, and its fix | `decisions/adr-012-…` and `decisions/adr-018-pretooluse-skill-ownership-hook-…md` | ADR-018 §Context; §Decision 3–6 |
| Sprint status, line-3 banner, movers | `decisions/adr-047-a-sprint-has-an-explicit-status-…md` | §2; §2.2; §3.0; §4 |
| No owner channel in a spawned agent | `decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md` | §Decision |
| Task status vocabulary | `conventions/task-status-vocabulary.md` | §"The statuses"; §"The authority split"; §Rules |
| Sprint status vocabulary | `conventions/sprint-status-vocabulary.md` | §"The statuses"; §"The authority split" |
| Dependency grammar and its failure | `conventions/dependency-declaration-form.md` | §"Why this exists"; §"The guard" |
| Rank is not identity | `conventions/priority-is-rank-not-identity.md` | opening blockquote; §"Why the two are not interchangeable" |
| Durable citations | `conventions/durable-citation-anchors.md` | — |
| The prefix decision | `reports/2026-07-26-decide-task-folder-name-numeric-prefix.md` | §"The decision, in one line"; §7 |

---

## Closing note to the expert

Both leads have signalled, in writing, that they would take a third answer over their own. `aiboard-lead` argued **against its own project's id convention** on point 3 and **volunteered its own duplication defect** on point 4. `fkit-architect` has argued **against fkit's position on points 6, 7 and 8**, and has published the measurement showing **fkit's central defence of its own model did not work** (§4.1.2).

⭐ **Neither of us is asking you to referee. We are asking you to design.** If both of these models are wrong, that is the most useful answer you can give, and it is the one the owner explicitly asked to be made available to you.

---

### ⏱ Closing stamp on the fold, 2026-09-18 — `fkit-architect`

**Since the paragraph above was written, one reader has already done what it asks.** Codex answered all twenty-two items, chose **NEITHER** on nine of them, said *"I would not approve the convergence migration"*, and told both leads that the abstraction they had converged on — *"one source of truth"* — is the wrong one. **§8 carries it whole.**

⛔ **Three things this fold changed that are not Codex's, and that you should not attribute to it:**

1. **§1.3** mischaracterised aiboard by omission and made this report contradict itself. Corrected — aiboard is untested **in the owner's hands** while its **code** carries a passing 41-test suite. **Codex read the defective version** (§0.8.2).
2. **§Q11.1** — the "unverified precondition" behind `aiboard-lead`'s close-marker reframe is now **verified false**, in a worse way than anyone posed it: aiboard has **no identity mechanism at all**. Codex reached the same conclusion from the other direction (§Q11.2).
3. **§4.9.1** — **neither system is transactional.** `aiboard-lead` volunteered this against its own position. The propose-only argument stands, but it does not rest on aiboard being sloppier than fkit.

⚠️ **And one thing about the reader you are about to weigh:** §0.8.1 records a deliberate calibration probe on Codex. **It caught the arithmetic and the bad inferences. It missed a two-statement contradiction held across distant sections.** ⛔ **Read that before §8, not after.**
