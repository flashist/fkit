# Decision report — the skill-ownership fact-inventory gap

- **Date:** 2026-08-02
- **Task:** [`0142-investigate-the-skill-ownership-fact-inventory-gap`](../../tasks/done/0142-investigate-the-skill-ownership-fact-inventory-gap/brief.md)
- **Author:** fkit-architect (spawned by `/fkit-sprint-ship-loop`; no owner channel — ADR-021). The
  owner signed the investigation, and all four scoping rulings below, via `AskUserQuestion` in the live
  lead session on 2026-08-02.
- **Revision:** **Round 2, 2026-08-02** — corrected after a stateful review returned 🛑 BLOCKED on 7
  confirmed defects (3 high) and the owner ruled a fix round. **Changed: the inventory (§0.1, §1 —
  short by 17 rows), the trigger set's binding (§4.1), the live-surface declaration (§1.1), a fifth
  live defect (D5), a false sequencing mechanism withdrawn (D4), and two count divergences resolved.**
  Nothing that the review verified as correct was rewritten. Ledger:
  `ai-agents/tasks/backlog/0142-…/review.md`.
- **Revision:** **Round 3, 2026-08-02** — a narrow, single-purpose round on one thing only: the owner
  ruled §1.6's open trigger-set hole. **Changed: §4.1 gains trigger (e), fully specified and with its
  false-positive cost measured across the declared live surface; §1.6, blind spot #2 and the Part 8
  hand-off are updated from "awaiting a ruling" to "ruled, specified, priced".** Nothing else was
  touched. **Still investigation only — nothing implemented, nothing repaired.**
- **Revision:** **Round 4, 2026-08-02** — corrected after review round 2 returned 🛑 BLOCKED on 6
  confirmed defects (2 high) and the owner ruled a fix round on all six plus two structural rulings.
  **Changed: a 39th inventory row (C32) — the round-3 sweep was STILL short by one, and the missed site
  is the exact shape both documents declared had no live instance (§0.1, §1.2, §1.6); the trigger
  spec's matching rules are pinned and (c) is re-scoped from a no-op to a working clause with its own
  measured price (§4.1); the D4 sequencing note now carries NO mechanism at all (§D4); §1.5's noise
  membership is corrected; the 88-file enumeration is withdrawn as unreproducible (§1.1, Part 1); and
  Part 1's Results line, which was arithmetically impossible, is fixed.** Trigger (e) itself was ruled
  **sound** by the review and is not reworked — only the false sentence beside it is gone.
- **Revision:** **Round 5, 2026-08-02 — a qualifier round, and the last one.** Review round 3 returned
  ⚠️ *Changes requested* on **one** confirmed defect (**R14**, medium, not blocking) and the owner ruled
  it applied. **Changed: nothing but scope labels.** Four sentences stated figures measured against
  **(c) as it USED to stand** without saying so — §4.1's shared block (twice), §1.5's sweep line, and
  §1.6's C32 row closing *"It trips none of (a)–(e)"*, the very sentence the (c) re-scope exists to
  falsify. Each now carries the same qualifier the report already applied correctly in three other
  places, with the current-basis figure beside it: **(a)–(d) is 76 bounded / 77 as substrings, not
  73 / 74**, and **(e)-only is 7, not 9**. **No substance change: every total closes on either
  basis** — 61 fact-site files, 22 declared non-fact hits, 83 of 89 triggered — and the registry, both
  trigger prices and the no-licence rule are untouched. **The review assigned R14 MEDIUM against
  Codex's HIGH, and the reviewer owns that severity** (see the ledger). **One accepted residual is
  recorded rather than fixed: the appendix's 282/49 possessive sweep does not reproduce (R15).**
- **Status:** complete. **Investigation only — nothing was implemented and nothing was repaired.**
- **Change surface of this task:** this file, the ADR it produces, and the task folder's `plan.md` /
  `worklog.md`. No skill, agent definition, test, script, board, convention page or vault file was
  written. No task moved.

---

## 0. How this report cites things — read this first, it is not boilerplate

Task `0160`'s ruling and **ADR-035** bind downstream work to **heading and quoted phrase**, and to
citing tasks by **folder ID**. This report obeys that — *and* it has a problem no other report has:

> **Its subject is citation drift, so it must quote line numbers as evidence.** An audit that says
> *"this citation is dead"* cannot make its case without naming the coordinate that died.

The rule adopted here, and used everywhere below:

- **Anchors are headings and quoted phrases.** Every claim is locatable without a line number.
- **Line numbers appear only where the line number IS the finding** — the Part 2 drift audit, and the
  inventory's anchor column. They are written as **dated measurements**, `measured 2026-08-02`, with
  the quoted phrase alongside. A measurement with a date on it is allowed to go stale; an anchor is
  not. The two are different objects and this report keeps them apart on purpose.
- **Every number here was measured on 2026-08-02 by the commands named beside it.** Where a figure
  already on record differs, the difference is stated, not smoothed.

> **Follow-up input, owner-ruled 2026-08-02:** this §0 citation form (`@YYYY-MM-DD:NNN`) was ruled
> **legitimate** — a genuine extension of task `0160`'s ruling and ADR-035, not a workaround. It is
> **not** folded into ADR-036. It is passed to task **`0171`** (`durable-citation-anchors` convention
> page, `0160`'s follow-up 1, open in the backlog) as an **input**. Writing that page is `0171`'s job,
> not this task's, and this report does not edit `0171`'s brief.

---

## 0.1 ⚠️ THIS REPORT HAS NOW SHIPPED AN INCOMPLETE INVENTORY **TWICE** — read before Part 1

> ### ⚠️ Say it plainly: this is the SECOND time this artifact reproduced the defect it investigates.
>
> **Round 1** shipped 21 sites, called it *"the true inventory"*, and was short by 17 rows and 5 whole
> classes. **Round 2** shipped 38 rows, called that sweep *"the completed sweep … every hit opened and
> read"*, and was **still short by one live-surface ownership-fact site**. Review round 2 found it —
> **both reviewers independently, again.**
>
> **And the miss was not random.** The site it missed
> (`claude/scaffold/ai-agents/knowledge-base/PROJECT.md`, now **C32**) is **the exact shape this report
> and ADR-036 both declared had no live instance** — attribution by possessive alone, the residual
> printed as *"no live-surface site has that shape on 2026-08-02"*. The report wrote the sentence that
> ruled the shape out and the sweep that would have disproved it, on the same day, and neither checked
> the other.
>
> **Three aggravations, each of which should independently have caught it, and none did:**
> 1. It **ships into every consuming project** — it is scaffold, not working tree.
> 2. It is the **scaffold twin of C16**, and this report splits every other twin into its own row
>    (C18, C20, C22, C24, C26, C29, C30). The round-2 sweep added C16 and did not add its twin, in the
>    very tree — `claude/scaffold/ai-agents/` — that round declared it had newly opened.
> 3. `test/dual-home-parity-exceptions.mjs`, which this report **registers as C31 and quotes from**,
>    **points straight at it**: the `reason` string the author read names `/fkit-initiate-project`.
>
> **Two passes by one author, both confident, both wrong; three independent pointers ignored.** Stated
> here, before Part 1, at this report's expense — because it is the argument for the recommendation and
> nothing else in this document makes it as well.

**Round 1 of this report shipped an inventory of 21 sites and called it "the true inventory". It was
short by 17 rows and 5 whole classes.** A stateful review of 2026-08-02 found it, both reviewers
independently, and the owner ruled a fix round. **The corrected sweep is below; the first pass's
number is superseded and is recorded here rather than quietly replaced.**

**How it happened, precisely.** The first pass's stated method was *"`grep -rn "skills_for_role" .`
over the whole repo, plus a read of every `claude/agents/fkit-*.md`, every `claude/skills/*/SKILL.md`,
both root instruction files, both scaffold instruction files, and `test/`."* Three parts of the live
surface **this report's own §1.1 declares** were never opened:

- `ai-agents/knowledge-base/conventions/` — named explicitly in the §1.1 live-surface cell.
- `claude/scaffold/ai-agents/` — the whole tree, which **ships into every consuming project**.
- `claude/*.sh` beyond the three scripts already known to be sites — including
  **`claude/fkit-claude-init.sh`, whose own comment says *"nothing tests that they agree"*** about the
  hand-maintained roster it prints. A self-declared, untested, hand-maintained mirror, absent from the
  first pass **even as an exclusion**. It is the single most embarrassing omission here and it is named
  as such.

**This is not a boundary disagreement. It is a sweep that did not cover the boundary it declared.**

**It is also the exact failure mode this task exists to name, reproduced by the artifact investigating
it** — a confidently-stated inventory, derived by a competent pass, wrong by a third. That
strengthens the thesis and invalidated the count. Both facts are stated; neither cancels the other.

### How the SECOND miss happened, precisely — and the enumeration that hid it

Round 2's stated method was *"the full declared live surface of §1.1 … enumerated to a file list
(**88 files**), each file tested against the trigger set, and **every file that tripped a trigger was
opened and read**."*

**The 88 does not reproduce, and it is withdrawn.** Re-enumerating clause 5 exactly, on 2026-08-02,
returns **102 paths · 89 non-empty · 13 empty `.gitkeep` placeholders** — the same figure round 3 used
to price trigger (e), one table row below round 2's 88, on the same declared boundary, on the same day.
**Two enumerations of one boundary differed by a file and neither pass reconciled them** — against this
report's own §0 rule that a differing figure is *stated, not smoothed*. **89 is the measurement; 88 is
withdrawn as unreproducible.** *(A mechanism was offered in review — 102 minus the 14 individually-named
clause-5 entries is exactly 88 — and is recorded as plausible but **unproven**; round 2 kept no file
list, so the cause cannot be settled from the record. Recorded as unknown rather than guessed.)*

**And the gap is material, not cosmetic:** the 88-file sweep is the one that produced the 38-row
inventory, and the file it missed is **C32**, a genuine ownership-fact site. Round 2's own quality bar —
*every hit opened and read* — was met; **the enumeration under it was not.** A complete read of an
incomplete list is still an incomplete sweep, and that is the second lesson this report has had to learn
about itself in one day.

**The lesson carried into the recommendation:** a count in a report is a **dated measurement of the
registry**, never the fact of record. Part 5 and ADR-036 are written that way — ADR-036 hard-codes no
site count.

---

## Part 1 — the true inventory

**Method — the sweep, re-run 2026-08-02 after review round 2.** The full declared live surface of §1.1
was enumerated to a file list — **102 paths, of which 89 are non-empty** (13 are empty `.gitkeep`
placeholders under `claude/scaffold/` and carry no prose) — each non-empty file was tested against the
Part 4 trigger set, and **every file that tripped a trigger was opened and read**. Rows are then
admitted by one stated test:

> **⚠️ The file count in this method line was `88` in round 2 and is now `89`. It changed because the
> earlier figure was wrong, not because the boundary moved** — see §0.1. Clause 5 enumerates to
> 102/89/13 on 2026-08-02 and did so when round 3 priced trigger (e) against the same boundary in the
> same appendix table. The difference of one file is exactly the miss: **C32**.

> **The inclusion test.** A file is an **ownership-fact site** if it *attributes* a named `/fkit-*`
> skill — or a skill-gated act — **to a role**: who holds it, who may invoke it, who is denied it, or
> who exclusively owns the act. A file that merely *names* a skill without attributing it to a role is
> **not** a fact site; it is **registry noise** (§1.5), which the tripwire still forces to be declared.

**Results, all measured 2026-08-02, and the arithmetic closes:**

| Quantity | Count |
|---|---|
| Live-surface files (non-empty; 102 paths, 13 empty) | **89** |
| **Trip at least one of (a)–(d)** | **73** |
| — of those, **ownership-fact-site files** | **58** |
| — of those, **registry noise** (trip a trigger, assert nothing — §1.5) | **15** |
| | *58 + 15 = 73* ✓ |
| **Fact sites tripping NONE of (a)–(d)** (§1.6) | **3** |
| **Total ownership-fact-site files** | *58 + 3 =* **61** |
| **Inventory rows** across **21 classes** (§1.2) | **39** |

> **⚠️ Round 2 printed this line as *"73 trip at least one trigger · 60 of those are fact-site files ·
> 15 are noise"*, which is arithmetically impossible** — 60 + 15 = 75 > 73. *"60 of those"* mislabelled
> its denominator: 60 was the total fact-site file count (58 triggered + 2 untriggered), not a subset of
> the 73. **Corrected above, and the untriggered half is now 3, not 2** (§1.6, C32). Stated rather than
> quietly re-typed, per §0.
>
> **Row counts and file counts are different objects, deliberately.** 39 rows sit across 61 files
> because several rows cover a class of files — C11 and C12 are 7 agent definitions each, C13 is 23
> `SKILL.md` files. Neither number is derivable from the other.

> **This sweep measured the original FOUR triggers, and (c) as it then stood was a no-op** (§4.1). The
> owner later ruled a fifth, **trigger (e)**, which catches **2 of §1.6's 3** and adds **7** more
> live-surface files that must be declared as non-fact hits; and, in round 4, **re-scoped (c)**, which
> catches **the third** and adds **no** non-fact hits at all. The numbers above are left as the dated
> four-trigger measurement they are; (c)'s and (e)'s own measurements are stated in §4.1.
>
> **On the CURRENT set — (a)–(d) with (c) re-scoped — the same 89 files give 73 → 76** (re-measured
> 2026-08-02, round 5): the re-scoped (c) pulls in `claude/scaffold/AGENTS.md` and
> `claude/scaffold/ai-agents/knowledge-base/PROJECT.md`, both already **fact sites** on this table, and
> `claude/scaffold/ai-agents/wiki-vault/schema.md`, already a **declared non-fact hit** via (e). **So
> every total in the table above is unchanged — 61 fact-site files, 39 rows, 21 classes, 22 declared
> non-fact hits, 83 of 89 tripping at least one of the five. Only which trigger pays for a file moves.**

**No row is here because the brief or the checklist said so; every row was opened and read.**

### 1.1 The declared live surface, and the dated records outside it

The bare token `skills_for_role` occurs in **101 files** (`grep -rln … | wc -l`, `.git` excluded),
**measured 2026-08-02 after the review round**. Only **10** of those are live surface.

> **The corpus moved three times in one day, and the movement is the point.** 98 when the first pass
> measured it; **100** when the reviewer re-ran it (this report and ADR-036 had since been written, and
> each contains the token); **101** now (the review ledger contains it too). Stated, not smoothed
> (§0). **The live-surface subset stayed at 10 throughout** — every new hit was a *dated record*.
> That is the live-surface boundary earning its keep in a single day.

The rest are **dated records** — and the distinction is a signed scoping call, not an inference:

| | In the live surface | Outside it — **dated records** |
|---|---|---|
| **What** | Runtime scripts (**all of `claude/*.sh`**), `test/`, `claude/agents/`, `claude/skills/`, **`claude/README.md`**, **the whole of `claude/scaffold/`** (instruction files, `universal-rules.md`, and the entire `scaffold/ai-agents/` tree), the repo-root `CLAUDE.md` / `AGENTS.md`, `ai-agents/README.md`, `ai-agents/tasks/README.md`, `ai-agents/knowledge-base/PROJECT.md`, `ai-agents/knowledge-base/architecture.md`, `ai-agents/knowledge-base/conventions/` | ADRs, task briefs, sprint plans, review ledgers, reports (this one included), and the whole of `ai-agents/wiki-vault/` |
| **Why** | These **govern behaviour now**. A false statement here is acted on. | These **record what was true on a date**. A superseded ADR is not a defect; correcting one would destroy the record. |

**Owner-signed, 2026-08-02:** the boundary is **declared**, not left inferable, and `test/` is
**inside** the live surface. That second call is what makes the fifth mirror catchable — see §1.4.

> **Amended after review, 2026-08-02.** The first pass wrote this cell as *"the four root/scaffold
> instruction files"*, which excluded **`claude/README.md`** — a mirror the checklist itself names, and
> one this report registers as **B2**. The appendix's live-surface count of 10 included it. **The
> report and the ADR disagreed about whether one of the four canonical mirrors was in scope.** They now
> agree, with `claude/README.md` **inside** the surface. Added in the same amendment, all of them
> genuine sites the first pass missed: `ai-agents/knowledge-base/PROJECT.md`, `ai-agents/README.md`,
> `ai-agents/tasks/README.md`, and the whole `claude/scaffold/ai-agents/` tree.

> **The wiki vault sits outside the live surface for the purposes of this rule** — and separately,
> **only `fkit-wiki` may write it.** Nothing in this report or its ADR licenses any other role to
> touch `ai-agents/wiki-vault/`.

### 1.2 The inventory

**Anchor column reads:** heading or quoted phrase = the durable anchor; any `@2026-08-02:NNN` = a
dated measurement, per §0.

| # | Site | Class | Anchor |
|---|---|---|---|
| **A1** | `claude/skills-for-role.sh` | **source of truth** | the `skills_for_role()` function (`@2026-08-02:48`) |
| **A2** | `claude/skill-ownership-hook.sh` | machine consumer | `# --- the actual ownership check: skills_for_role() is the ONLY source of truth` |
| **A3** | `claude/fkit-claude.sh` | machine consumer **AND a hand-maintained mirror — corrected round 4** | `. "$here/skills-for-role.sh"` for the fact itself; **and, found in review round 2, a byte-identical duplicate of the whole FOUR-mirror checklist** at `@2026-08-02:239-250` (`diff` against `claude/skills-for-role.sh@2026-08-02:12-23` → no output) |
| **B1** | `claude/skills/fkit-team/SKILL.md` | **declared mirror** — role-facing roster | step *"Print the roster"* → the `\| Role \| Its procedures \|` table |
| **B2** | `claude/README.md` | **declared mirror** — developer doc | §*"The skill lockdown — the central invariant"* → the `\| Role \| Its procedures … \|` table |
| **B3** | `claude/scaffold/CLAUDE.md` | **declared mirror** — ships into every consuming project | the `\| Role \| Does \| Must not \| **Its own** skills \|` table |
| **B4** | `ai-agents/knowledge-base/architecture.md` | **declared mirror** — architecture doc | §*"4.2 The 25 skills — where the procedures live"* → the `\| Owner \| Skills \|` table |
| **C1** | `test/skill-ownership-hook.test.js` | **hand-maintained test oracle — the FIFTH mirror** | *"OWNED is a maintained MIRROR of skills_for_role(), not derived from it"*; the `UNIVERSE` / `MOVERS` / `OWNED` constants |
| **C2** | `test/prove-red.sh` | mutation-proof script | *"broke skills_for_role(reviewer) — matrix \"reviewer × fkit-review\" should go RED"* |
| **C3** | `test/launcher-contract.test.js` | contract test | *"checks the REAL invoking agent's identity against skills_for_role()"* |
| **C4** | `claude/scaffold/universal-rules.md` | **rules-block source** — generates C5–C8 | *"Only the producer may invoke them"* |
| **C5** | `CLAUDE.md` (repo root) | generated rules block | between `<!-- fkit:begin-rules -->` / `<!-- fkit:end-rules -->` |
| **C6** | `AGENTS.md` (repo root) | generated rules block | same markers |
| **C7** | `claude/scaffold/CLAUDE.md` | generated rules block | same markers — **distinct site from B3, which is outside the block** |
| **C8** | `claude/scaffold/AGENTS.md` | generated rules block | same markers |
| **C9** | `CLAUDE.md` (repo root) | **unmanaged prose inside a managed file** — the `0151` class | *"Role→skill ownership is declared in exactly one place"* (before the `begin-rules` marker) |
| **C10** | `AGENTS.md` (repo root) | same class | §*"Knowledge Base & Wiki"* — *"any role follows the one read-only `/fkit-query` procedure"* |
| **C11** | `claude/agents/fkit-*.md` — **7 files** | agent frontmatter `description` | e.g. `fkit-producer.md` — *"Owns the task-file lifecycle via /fkit-task-done and /fkit-task-cancelled"* |
| **C12** | `claude/agents/fkit-*.md` — **7 files** | **agent system-prompt body** — `0124`'s class | §*"Your procedures"* and §*"What you must not do"* in each |
| **C13** | `claude/skills/*/SKILL.md` — **23 of 25** | skill owner banner | `> ## ⛔ Owner: the **<role>**` |
| **C14** | `claude/skills/*/SKILL.md` | skill body prose naming another role's skills | e.g. `fkit-sprint-ship-loop/SKILL.md` worker table — `@fkit-coder` → *"run `/fkit-plan-task`"* |
| **C15** | `claude/fkit-claude-init.sh` | **installer-printed roster — a hand-maintained mirror that says nothing tests it** | *"Role-locked sessions — inside each, only its own skills exist:"* + the seven printed role lines (`@2026-08-02:871-878`), under the comment *"The two must be kept in step by hand; neither derives from the other, and nothing tests that they agree."* |
| **C16** | `ai-agents/knowledge-base/PROJECT.md` | **project brief — the role roster and the ownership invariant** | *"`fkit <role>` pins a session to that role's prompt and only its own skills"*; *"the **exclusive gateway for wiki writes** (ingest/lint/sync)"*; *"**only the producer may invoke**"* |
| **C17** | `ai-agents/README.md` | working-tree README | *"moved between `backlog/`, `done/`, and `cancelled/` via the `task-done` / `task-cancelled` skills (never by hand)"*; *"Maintained by the **fkit-wiki agent** — no other agent edits it"* |
| **C18** | `claude/scaffold/ai-agents/README.md` | same class — **ships into every consuming project** | same two assertions, plus *"`/fkit-status` executes it"* |
| **C19** | `ai-agents/tasks/README.md` | working-tree README | *"`fkit-reviewer`'s `stateful-review` writes the findings; `fkit-coder`'s `process-stateful-review` writes the verdicts/actions"* — an explicit role↔skill mapping; plus *"only via `/fkit-task-done` and `/fkit-task-cancelled`, never by hand"* |
| **C20** | `claude/scaffold/ai-agents/tasks/README.md` | same class — **ships into every consuming project** | **byte-identical to C19** (`diff` → no output, 2026-08-02) |
| **C21** | `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` | **convention page** | *"**only the producer may invoke those skills**"*; the Set-by column — *"Owner, via `/fkit-task-done`"*, *"A **spawned producer**, via `/fkit-task-done`"* |
| **C22** | `claude/scaffold/…/conventions/task-status-vocabulary.md` | same class — **independently worded twin** | *"**only the producer may invoke those skills.**"* — same fact, different sentences, so it drifts independently |
| **C23** | `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` | convention page | the `fkit-<role>` roster table; *"**`fkit-task-brief`** — populates `## Owner`…"*; *"the exclusive write gateway for `wiki-vault/`"* |
| **C24** | `claude/scaffold/…/conventions/task-owner-vocabulary.md` | same class | **byte-identical to C23** (`diff` → no output, 2026-08-02) |
| **C25** | `ai-agents/knowledge-base/conventions/status-report-format.md` | convention page | *"How the producer answers "what's the status?""*; *"baked into `claude/agents/fkit-producer.md` … and a `/fkit-status` skill"* |
| **C26** | `claude/scaffold/…/conventions/status-report-format.md` | same class | *"`/fkit-status` reads it and executes it"* + the producer attribution |
| **C27** | `ai-agents/knowledge-base/conventions/evidence-before-assertion.md` | convention page | *"`claude/skills/fkit-review/SKILL.md` — **the reviewer's own version**"* — the only per-skill row in the list that names a role |
| **C28** | `ai-agents/knowledge-base/conventions/dual-home-parity.md` | convention page — **weakest row on this table, flagged** | *"At scoping — `/fkit-task-brief`. … *(Skill edit pending — **the producer scopes it**, owner: fkit-coder.)*"* — the attribution is parenthetical. Admitted because the test admits it; **flag it rather than quietly drop it.** |
| **C29** | `claude/scaffold/CLAUDE.md` | **unmanaged prose inside a managed file** — the C9/C10 class, applied to the scaffold twin | §*"Knowledge Base & Wiki"* — *"Check it before non-trivial work via `/fkit-query`. **Writes stay exclusive to the wiki role** … via its ingest / lint / sync procedures."* **Distinct site from B3 (the role table) and C7 (the generated block).** |
| **C30** | `claude/scaffold/AGENTS.md` | same class | §*"Knowledge Base & Wiki"* — *"**Writes stay exclusive to the `fkit-wiki` agent**"*; *"every agent carries its own vendored `query` skill"* |
| **C31** | `test/dual-home-parity-exceptions.mjs` | **test data-module `reason` prose** | *"only the `fkit-wiki` role may write `ai-agents/wiki-vault/`, so no reconciliation may touch the live copy at all"* — an ownership fact asserted inside a machine-read data file |
| **C32** | `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` | **same class as C16** — project brief, **scaffold twin, ships into every consuming project**. *Added round 4; see §0.1.* | *"The fkit **producer** replaces this file during project initiation (**its** initiate-project skill)"* (`@2026-08-02:1-2`) — attribution by **possessive alone**. The attribution is **TRUE**: `skills_for_role(producer)` holds `fkit-initiate-project` (`claude/skills-for-role.sh@2026-08-02:51`), so this is an unregistered **fact site**, not a sixth live defect |

> **⚠️ C32 is numbered out of sequence, and that is deliberate.** Every other scaffold twin sits
> adjacent to its working-tree original (C17/C18, C19/C20, C21/C22, C23/C24, C25/C26, and C29/C30).
> C32 belongs beside **C16**, the working-tree `PROJECT.md`. It is appended instead of inserted so that
> **no row on this table silently changes its identifier between revisions** — a report about citation
> drift does not renumber fifteen anchors to make a table look tidy. **The out-of-sequence number is the
> scar of the miss, and it stays.**

**Count, measured 2026-08-02 after review round 2: 39 site rows across 21 classes. The checklist
names 5 of them** — A1 (itself) and B1–B4. Everything in Tier C is live, load-bearing, and undeclared.
*(C32 is C16's class, so the class count is unmoved at 21; the row count moves 38 → 39.)*

> **⚠️ This number is a dated measurement, not a fact of record.** Under the recommendation (Part 5)
> **the registry module is authoritative for the inventory; a report only measures it on a day.**
> ADR-036 therefore hard-codes no site count, and neither should any future doc. Counting rule for the
> 21: distinct values of the Class column, with *declared mirror* kept split by audience (roster /
> developer doc / consuming-project / architecture doc) exactly as the first pass counted it — so the
> two figures are comparable.

> **The count's own history, stated per §0 and not smoothed.** Draft: ~19 sites / 15 classes. First
> written pass: **21 / 16** — no new site found, two rows split apart (`claude/scaffold/CLAUDE.md`'s
> hand-written table (B3) vs its *generated* block (C7), and the `AGENTS.md` half of the C9/C10 pair).
> Third pass: **38 / 21 — and that delta is not granularity. All 17 new rows and all 5 new classes are
> sites the earlier passes never opened** (§0.1). **Fourth pass: 39 / 21** — one more row, found not by
> me but by review round 2, at a site my own registered C31 pointed at. **Four numbers, one author, one
> day: ~19, 21, 38, 39.** Every one of them was stated with confidence at the time. **That is the
> argument for the recommendation, restated in the worst possible way: at my own expense, twice.**

### 1.3 What the tiers mean

- **Tier A (3)** — the fact, and the two scripts that consume it. **Their *consumption* of the fact
  cannot drift: they source the function.** ⚠️ **That is not the same as "Tier A cannot drift", which is
  what this line said until round 4 and which is FALSE for A3.** `claude/fkit-claude.sh` reads
  `skills_for_role()` **and** carries 12 lines of hand-maintained checklist prose — a byte-identical
  copy of `claude/skills-for-role.sh`'s FOUR-mirror block — which drifts exactly like any other prose,
  and is wrong today (§1.4, D4). **Tier membership is about where the fact comes from, not a guarantee
  that every sentence in the file is true.**
- **Tier B (4)** — the declared mirrors, i.e. the four the checklist names. Human-maintained prose.
  **Two of the four are wrong today** (Part 3).
- **Tier C (32)** — live, load-bearing, **undeclared**. This is the gap the task exists to name. Note
  what is in here: **the agent system prompts (C11, C12)** — which sit in an agent's context every
  turn and outrank a SKILL file in its own reasoning — **the universal rules block (C4–C8)** — in
  *every* agent's context every turn — **the test oracle that is supposed to catch this class of
  error (C1)** — **the installer's own printed roster (C15), which states in its own comment that
  nothing tests it** — **the project brief (C16) and its scaffold twin (C32)** — and **eight convention
  pages plus four READMEs (C17–C28), half of which ship into every consuming project.**
- **Tier D** — dated records. **Out of scope by declaration.** ADRs, briefs, sprint plans, ledgers,
  reports, the vault.

### 1.4 The fifth mirror — and a sixth roster that says nothing tests it

`claude/skills-for-role.sh` says, in its own words: *"FOUR hand-maintained places MIRROR this list."*

> **⚠️ Found in review round 2, and it changes the repair scope: that checklist exists TWICE.** The
> 12-line block is **byte-identical** in `claude/skills-for-role.sh@2026-08-02:12-23` and
> `claude/fkit-claude.sh@2026-08-02:239-250` — verified by `diff` over the two ranges on 2026-08-02,
> **no output**. Neither copy points at the other; nothing tests that they agree; and **§1.4's own
> mirror hunt, whose entire subject is undeclared hand-maintained copies, walked past a
> byte-for-byte duplicate of the very checklist it was auditing.** Consequence for the follow-up:
> **any repair or demotion of this checklist must touch both files** (Part 8), and ADR-036 clause 2 —
> which named only `claude/skills-for-role.sh` — is widened accordingly.

`test/skill-ownership-hook.test.js` says, in its own words: *"OWNED is a maintained MIRROR of
skills_for_role(), not derived from it. A test whose oracle is the implementation tests nothing."*

**That is a fifth hand-maintained mirror, declaring itself as one, in a file the checklist does not
name.** It is catchable only because `test/` was ruled inside the live surface. The checklist's own
closing instruction — *"If you add a fifth mirror, add it HERE FIRST"* — was not followed, by the task
that added it.

**And there is a sixth, missed by this report's first pass (§0.1): `claude/fkit-claude-init.sh` (C15).**
The installer prints a seven-role roster under the line *"Role-locked sessions — inside each, only its
own skills exist"*, and its own comment above it reads:

> *"This list is what the installer PRINTS. It is not the acceptance list — `fkit-claude.sh` decides
> which role names a session will accept. The two must be kept in step by hand; neither derives from
> the other, and **nothing tests that they agree**."*

**Be precise about what it mirrors:** the **role roster** and the ownership *invariant*, not
`skills_for_role()`'s per-role skill lists. It is still a hand-maintained mirror of a role fact that
declares, in writing, that no test guards it — **and the report whose job was to inventory exactly
that did not mention it, not even to exclude it.**

### 1.5 Registry noise — 15 live-surface files that trip a trigger and assert nothing

These name a skill without attributing it to a role, so by the §1 inclusion test they are **not**
ownership-fact sites. **They still trip the tripwire and so must be registered** — with a `reason`
saying they are declared non-fact hits. This is a real cost of the bare-token and skill-name triggers,
and it is stated rather than hidden:

`conventions/dependency-declaration-form.md` · `conventions/one-skill-one-output.md` ·
`conventions/priority-is-rank-not-identity.md` · the scaffold twins of those three ·
`claude/scaffold/…/conventions/evidence-before-assertion.md` · `claude/shiploop-marker-hook.sh` ·
`claude/turn-completion-hook.sh` · **`claude/skills/fkit-status/dashboard.sh`** ·
`test/adr-number-uniqueness.test.js` · `test/dashboard-contract.test.js` ·
`test/shiploop-marker-hook.test.js` · `test/task-id-uniqueness.test.js` ·
`test/turn-completion-hook.test.js`

> **⚠️ Membership corrected in round 4 — one file was wrongly IN and one wrongly OUT, and the two
> errors cancelled.** That is why the total stayed 15 and the 58 + 15 = 73 arithmetic kept closing, and
> why neither the author nor round 1 of the review caught it.
>
> - **Removed — `test/rules-block-budget.test.js`.** It trips **no** (a)–(d) trigger under the
>   token-boundary rule now pinned in §4.1. It matched only as a **substring**: role basename
>   `fkit-reviewer` *contains* skill name `fkit-review`. It is still registry noise — but it enters the
>   registry through **(e)**, not through (b), and so belongs in (e)'s cost, not here.
> - **Added — `claude/skills/fkit-status/dashboard.sh`.** The **only** non-`SKILL.md` file under
>   `claude/skills/` on 2026-08-02. It trips (b) on `/fkit-status`, attributes no skill to a role
>   (it is a board renderer), and is covered by **neither C13 nor C14** — both of which are
>   `SKILL.md`-only — **nor by this list until now**. An unregistered trigger hit hiding behind a
>   directory everyone assumes is uniform.
>
> **My bounded sweep of the ORIGINAL four triggers — (c) as it then stood — returns exactly 15 non-fact
> trippers with that membership, measured 2026-08-02.**
> **Knock-on, stated rather than absorbed: the registry's day-one noise half is 22 files, not 21** —
> these 15, plus the **7** that (e) adds (§4.1). The re-scoped (c) adds **none**.
>
> > **⚠️ Bucket basis — added round 5 (R14), re-measured 2026-08-02.** With **(c) re-scoped** as
> > specified in §4.1, `claude/scaffold/ai-agents/wiki-vault/schema.md` trips (c) as well, so **this
> > half is 16 and (e)'s half is 6**. **The declared-non-fact-hit total is 22 on either basis** —
> > 15 + 7 or 16 + 6 — and the re-scoped (c) still adds **no new file** to the registry. The 15 names
> > listed above are the four-trigger measurement and are left as the dated measurement they are, per
> > §0. Full statement of the bucket basis: §4.1, under (e)'s measured cost.

> **The test works, and here is it working.** `conventions/evidence-before-assertion.md` **is** a fact
> site (C27) — *"`claude/skills/fkit-review/SKILL.md` — **the reviewer's own version**"*. Its scaffold
> twin says only *"`/fkit-review` — verifies findings against the actual code"*. **The de-fkit-ified
> rewrite dropped the role attribution**, so the twin is noise and the live copy is a site. Two files
> that dual-home parity treats as one document, on opposite sides of the line.

### 1.6 ⚠️ THREE fact sites trip NO trigger at all — the hole in the trigger set

Running the original four-trigger set over the 89 live-surface files leaves **three fact sites
undetected**. **Round 2 and round 3 both said "two", and both were wrong** — the third is C32, and it is
the one that mattered most, because it is the shape both documents then declared had **no live
instance** (§0.1):

| Site | Why every trigger misses it |
|---|---|
| `ai-agents/README.md` (C17) | Says *"via the `task-done` / `task-cancelled` skills"* — the **bare** skill names, without the `fkit-` prefix, so trigger (b) misses. `fkit-wiki` is a **role**, not a member of the skill universe, so (b) and (c)-as-it-then-stood miss. No `skills_for_role` token, no `⛔ Owner:` banner. |
| `claude/scaffold/AGENTS.md` (C30) | Says *"every agent carries its own vendored **`query`** skill"* — the bare suffix again — and *"Writes stay exclusive to the **`fkit-wiki` agent**"*, a role. Same four misses. |
| **`claude/scaffold/ai-agents/knowledge-base/PROJECT.md` (C32)** — *added round 4* | *"The fkit **producer** replaces this file during project initiation (**its** initiate-project skill)"*. **No `skills_for_role` token** (a); `initiate-project` is a **bare suffix**, not a `claude/skills/*/` directory name, so **(b)** misses and so did **(c) as it then stood**; **no `⛔ Owner:` banner** (d); and — the load-bearing part — **the nearest ownership verb to *"producer"* is 839 characters away** (measured 2026-08-02, whitespace-collapsed), ten times outside **(e)**'s 80-character window. **It tripped none of the five triggers as they stood in round 3 — (a)–(e) with (c) as it then stood — which is exactly what the re-scope of (c) exists to falsify: on the trigger set specified in §4.1 today it DOES trip (c), at gap 51 between `producer` and `initiate-project` (re-measured 2026-08-02).** The attribution is by **possessive alone**. |

> **What closed the third.** (e) catches the first two. **The third is closed by the re-scoped
> (c)** — *a bare skill suffix within 80 characters of a role name* — which matches `initiate-project`
> at a gap of **51** from `producer` (measured 2026-08-02). Full spec, and (c)'s own measured price, in
> §4.1. **The residual that used to be printed here as "no live site has this shape" is withdrawn as
> false; what survives is stated in §4.1 and in ADR-036's residuals, and it is not a licence.**

**Impact, stated exactly.** Both files *are* on the registry, so the **inventory** covers them. What
fails is the **tripwire**: a future site written in the same style — bare skill name, or a role plus an
ownership verb and no skill name — could be added and the guard would stay green. **This is a second,
independent blind spot in A-i, alongside the one in §4.1, and it was not known when the owner signed
the four-trigger set on 2026-08-02.**

**Ruled, in two steps, both on 2026-08-02.** When this section was first written, neither candidate fix
was mine to fold in — both changed a trigger set the owner had signed.

1. **Trigger (e) — a role name beside an ownership verb.** Specified in full in §4.1 and in ADR-036
   clause 4, in byte-identical wording. **It catches the first two specimens** —
   `ai-agents/README.md` at *"Maintained by the **fkit-wiki agent**"* (gap **10**) and
   `claude/scaffold/AGENTS.md` at *"Writes stay exclusive to the `fkit-wiki` agent"* (gap **9**), both
   re-measured 2026-08-02. Broadening (b) to bare suffixes **on its own** was rejected: `review`,
   `status`, `query`, `team` and `inspect` are ordinary English words and every hit would need a
   written reason to silence.
2. **(c) re-scoped to a bare skill suffix near a role name** — ruled after review round 2 showed C32
   escapes (e) as well, and that (c) as written was a **no-op**. This is the same bare-suffix
   vocabulary rejected in step 1, made affordable by the thing step 1's rejection was missing: **a role
   name is required within the window.** Its measured day-one false-positive cost is **zero files**
   (§4.1). **It catches C32 at gap 51.**

**A hole still survives both**, is named in §4.1 and in ADR-036's residuals, and — unlike the version
that shipped in round 3 — **carries no claim that it has no live instance and no licence to treat
clause 4 as complete.**

---

## Part 2 — the citation-resolution audit

**Method:** each of the brief's five cited ranges opened in the working tree on 2026-08-02 and read.
The brief's `## Notes` make this mandatory: *"A citation that no longer resolves is itself a finding."*

**Three of the five are dead. One drifted. One holds — and its content was correctly removed.**

| Brief's citation | Verdict | What is actually there now |
|---|---|---|
| `fkit-coder.md:103` — *"closes the task itself"* | **DEAD** | `@2026-08-02:103` is the `fkit-plan-task` bullet. The live text is *"since ADR-033 it **closes nothing itself**"* (`@:114-115`) — and it is now the **corrected**, post-`0124` statement. |
| `fkit-coder.md:190-191` — *"you may invoke them yourself"* | **DEAD** | `@2026-08-02:190-191` is *"Test your changes."* The mover rule is now §*"What you must not do"* → *"since ADR-033 **you do not hold those skills**"* (`@:206-207`). |
| `fkit-producer.md:95-96` | **DEAD** | `@2026-08-02:95-96` is *"Write task briefs, not code."* The two mover assertions are now *"`Done` and `Cancelled` are set only by their mover skills"* (`@:103-104`) and §*"What you must not do"* → *"always via `/fkit-task-done` / `/fkit-task-cancelled`"* (`@:112-113`). |
| `fkit-producer.md:37-38` | **DRIFTED one line** | The assertion *"since ADR-033 **you are the only role that may invoke them**"* is at `@2026-08-02:38-39`. |
| `universal-rules.md:7` | **ANCHOR HOLDS; quoted phrase correctly gone** | `@2026-08-02:7` is still the mover rule, and it now reads *"**Only the producer may invoke them**"*. The brief's quoted *"Any role but the adversarial reviewer may invoke them"* is **absent because `0124` fixed it.** Working as intended. |

### 2.1 `0137`'s Lesson 1, demonstrating itself, unprompted

`0137`'s brief states the lesson: *"thematic adjacency at a shifted line range is the expected
SIGNATURE of citation drift, not evidence against it."*

`fkit-coder.md:103` **lands inside the skill-ownership section** — the heading immediately above it is
§*"Your procedures — your own skills"*. A reader following that citation arrives at a bullet about the
coder's skills, concludes *"yes, this is the skill-ownership prose"*, and never notices the claim it
was cited for is not there. **Thematically adjacent, entirely plausible, and wrong.**

This was not sought. It is the first citation I opened, and `0137`'s stated failure mode fired on it.
**That is the strongest available argument that `0137` is correct and that this task does not replace
it** — see §7.

### 2.2 `0151` has landed

The brief flags `CLAUDE.md:43` — *"`skills_for_role()` is declared in `claude/fkit-claude.sh`"* — as a
candidate third specimen, and notes *"If `0151` lands first the line will already be corrected."*

**It has.** `CLAUDE.md` now reads *"`skills_for_role()` in `claude/skills-for-role.sh`, sourced by both
`claude/fkit-claude.sh` and the `PreToolUse` skill-ownership hook"* (`@2026-08-02:43-45`), and
`0151-correct-claude-mds-stale-skills-for-role-location` is in `done/`. The class it exposed — **C9,
hand-written prose OUTSIDE the generated block in a file that is otherwise fkit-managed** — is real and
is now on the inventory. §6 says whether the recommendation would have caught it.

---

## Part 3 — five live defects, none previously recorded

Found while building Part 1. **All five are wrong content at sites that are, or should be, on the
inventory. None is repaired by this task** — see §8.

> **D5 was added after review, 2026-08-02.** The first pass found four. The fifth sits at a site this
> report had **already registered as C9** and had **already quoted from, thirteen lines below the false
> sentence** (§2.2). Recorded here rather than folded in silently, per §0.

> ### ⚠️ The methodological finding, stated first because it is the strongest single argument here
>
> My first pass at auditing the owner banners was:
>
> ```
> for f in claude/skills/*/SKILL.md; do grep -q "⛔ Owner:" "$f" || echo "MISSING: $f"; done
> ```
>
> It reported **exactly one** missing banner: `fkit-query`.
>
> **It was wrong.** `fkit-team/SKILL.md` also has no banner — but it contains the sentence *"The `⛔
> Owner:` banner at the top of every skill is now a courtesy for a well-behaved agent to notice before
> trying"*. **Prose describing the banner satisfied the grep for the banner.** The check answered
> "present" on a file where the thing is absent and only *discussed*.
>
> I caught it by **reading the file**, not by refining the pattern.
>
> **This is the whole case for why option B (§4.2) cannot work and why option A is scoped to a
> declared registry rather than a smart detector.** The assertions are free prose; free prose talks
> *about* its own markers; and a regex cannot tell an assertion from a description of one. This is
> evidence, gathered accidentally, from the exact detector the cheap option would depend on. **Do not
> bury it.**

### D1 — `claude/scaffold/CLAUDE.md` omits `/fkit-task-brief` from the producer's own skills

The role table's producer row lists *"`/fkit-initiate-project`, `/fkit-status`, `/fkit-task-done`,
`/fkit-task-cancelled`"*. `skills_for_role(producer)` includes **`fkit-task-brief`**.

**Severity: highest of the five.** This is a **declared mirror (B3)** and it **ships into every
consuming project's root `CLAUDE.md`**. It is the same failure mode, in the same file, as the incident
the checklist's own warning block narrates: *"Task 70 followed the two-item list precisely and still
shipped a false statement into every consuming project."*

### D2 — `architecture.md` §4.2 says only one skill lacks an owner banner; two do

Quoted: *"Only `fkit-query` carries no banner — it is universal by design."*

**Measured 2026-08-02:** `fkit-query/SKILL.md` and `fkit-team/SKILL.md` both lack a `⛔ Owner:` banner
(23 of 25 skills carry one). The design intent is plainly the same for both — they are the two
universal skills — but **the doc names one and there are two.** This is a **declared mirror (B4)**
stating a false count.

> `fkit-team/SKILL.md` and `claude/scaffold/CLAUDE.md` separately assert the banner is *"at the top of
> every skill"* / *"on each skill"*. Both are false for the same two files. Whether the fix is to add
> two banners or to correct three sentences is a **repair-task decision, not this task's.**

### D3 — `architecture.md` §4.2 cites a dead line number for the source of truth

Quoted: *"Ownership is declared in exactly one place: `skills_for_role()` at
`claude/skills-for-role.sh:35`."*

**Measured 2026-08-02:** `skills_for_role()` is at line **48**. Line 35 is inside the ADR-033 comment
block. The pointer at the single source of truth, in the architecture doc, is off by 13 lines —
**a citation-drift defect inside the report about citation drift.**

### D4 — the mirror checklist says FOUR; there are five, and the fifth says so about itself

`claude/skills-for-role.sh` — *"FOUR hand-maintained places MIRROR this list … If you add a fifth
mirror, add it HERE FIRST"* — versus `test/skill-ownership-hook.test.js` — *"OWNED is a maintained
MIRROR of skills_for_role()"*. See §1.4. **And, found this round, a sixth: `claude/fkit-claude-init.sh`
(C15).** The count is not off by one; it is off by at least two.

> **⚠️ CORRECTION, 2026-08-02 — the first pass's sequencing mechanism was FALSE and is withdrawn.**
>
> Round 1 of this report said here: *"the completeness tripwire reads a live site that contradicts the
> artifact it is guarding, and **the guard ships red on day one**."* **That cannot happen, and this
> report's own Part 6 row 6 says so.** The tripwire *"does **not** try to judge whether the prose is
> true"* — it answers only *is this site declared?* — and `claude/skills-for-role.sh` is **registered
> as A1**. A false `FOUR` inside a registered file is invisible to it. **A-i catches none of the five
> defects, D4 included.** The two statements contradicted each other and the false one is gone.
>
> **The sequencing is still repair-before-guard. Its reason is the owner's, and it is not mechanical:**
>
> > **Owner ruling, verbatim: *"do not let the build quietly repair its own corpus."*** A build task
> > that fixes its own inputs demonstrates nothing about the guard — the guard is green either way, so
> > only a clean corpus at guard time tells you the registry was built against reality rather than
> > against a tidy-up.
>
> **⚠️ SECOND CORRECTION, round 4 — the replacement mechanism was ALSO false, and this note now carries
> NO mechanism at all.**
>
> Round 2 replaced the withdrawn claim with what it called *"one true mechanical note"*: that clause 2's
> demotion **deletes** the `FOUR` enumeration, so *"the build resolves D4 itself"*. **That is false
> too.** The checklist exists **twice**, byte-identically — `claude/skills-for-role.sh@2026-08-02:12-23`
> and `claude/fkit-claude.sh@2026-08-02:239-250`, `diff` over the two 12-line ranges returns **no
> output** (measured 2026-08-02, §1.4). ADR-036 clause 2 demoted **only** the `skills-for-role.sh`
> comment, so **a fully clause-2-compliant build leaves the false `FOUR` live in `claude/fkit-claude.sh`.**
> D4 is *not* resolved by the build.
>
> **The pattern is the finding, and it is named here rather than fixed quietly.** This one note has now
> carried **two** untrue mechanisms in two consecutive revisions. Both were **asserted, not measured**;
> both were plausible; both survived a careful author and one review round. **The sequencing never
> needed a mechanism.**
>
> **So: no mechanism. The sequencing rests on the owner's verbatim ruling alone, quoted above, and
> nothing else.** What remains is a plain, measured scoping fact for the repair task, with no causal
> claim attached: **the `FOUR` count is wrong in two files, and both must be touched** — ADR-036
> clause 2 is widened to say so, and Part 8's follow-up 1 is widened to match.

### D5 — root `CLAUDE.md` says foreign skills are *"invisible"*; they are visible-but-blocked

`CLAUDE.md` §*"The fkit team in this repo (dogfooded)"* — *"every other fkit skill is turned off,
**invisible** and unrunnable"* (`@2026-08-02:32`).

**Measured 2026-08-02 — five live sources say the opposite, and an ADR records it as an accepted cost:**

| Source | What it says |
|---|---|
| `claude/skills/fkit-team/SKILL.md` (B1) | *"a foreign skill is **visible** in the `/` menu (the old off-list also hid it; this mechanism doesn't) but remains **unrunnable** … **Visible-but-blocked, not invisible-and-blocked.**"* |
| `claude/README.md` (B2) | *"A foreign skill stays **visible** in the `/` menu but is **not runnable**."* |
| `ai-agents/knowledge-base/architecture.md` (B4) | *"a non-owned skill stays **visible** in the `/` menu"* |
| `claude/scaffold/CLAUDE.md` (B3) | *"a foreign skill is **visible** in the `/` menu but **not runnable**"* |
| `ADR-018` §Decision 5 | records the visibility regression as a **knowingly accepted cost** — *"non-owned skills become visible"* |

**Severity: on a par with D1.** It is in the **repo-root `CLAUDE.md`**, which sits in every session's
context on every turn, and it is a **registered site (C9)** — the class `0151` exposed. **This report
quoted the same file for §2.2 from prose thirteen lines below the false sentence and did not notice.**

> **Not counted as a sixth defect, and the near-miss is stated rather than promoted.**
> `ai-agents/knowledge-base/PROJECT.md` (C16) says *"every other `/fkit-*` skill is **turned off**"* —
> weaker than *"invisible"* and arguably only imprecise. **The repair task should look at it; this
> report does not assert it is false.**

---

## Part 4 — the approaches, each with its blind spot

Brief verification step 2 is explicit: *"an approach with no stated blind spot has not been examined."*
Each of the three is examined against that bar.

### 4.1 Option A — a declared site registry, plus a completeness tripwire

Split, because the two halves have very different costs.

#### A-i — the registry and the tripwire *(tractable)*

A checked-in module, `test/skill-ownership-sites.mjs`, in the **exact shape** of the existing
`test/dual-home-parity-exceptions.mjs`: one flat array of `{ path, kind, reason }`, the module
**authoritative**, the human-readable checklist demoted to a mirror of it. A **≥30-character `reason`
floor**, enforced by the test, for the same reason ADR-027 §Decision 3 required one — *"an exception
with no stated reason is an unfalsifiable permanent hole."*

The **completeness tripwire**: a test that greps the live surface for the ownership-fact trigger set
and fails on any hit whose file is not registered. It does **not** try to judge whether the prose is
true. It answers exactly one question: *is this site declared?*

> **The registry must hold two kinds of entry, or the tripwire can never go green** — clarified after
> the corrected sweep. **Fact sites** (§1.2, **39 rows** across **61 files** on 2026-08-02) and
> **declared non-fact hits** (**22 files** on 2026-08-02 — the total is 22 on either trigger basis;
> the 15 + 7 split below is the four-trigger one and becomes 16 + 6 with (c) re-scoped, see §4.1's
> bucket-basis note: §1.5's 15 four-trigger hits plus the 7 that
> trigger (e) adds; the re-scoped (c) adds none). The second kind's `reason` says exactly that. `kind`
> is what separates them, and *"registered"* means *"present under either kind"*. **Both figures are
> dated measurements, not the record** — the module is (§5).

**The trigger set** — owner-signed, 2026-08-02. **Five triggers**; the list is numbered here and
lettered (a)–(e) in ADR-036 clause 4, item *n* = letter *n*:
1. `skills_for_role` — **the bare token.**
2. Any `fkit-<skill-name>` / `/fkit-<skill-name>` naming a skill in **the skill universe** — defined as
   **the skill directories on disk, `claude/skills/*/`, enumerated at test time** (25 of them on
   2026-08-02; the count is never written down, which is the point).
3. **A bare skill suffix within 80 characters of a role name** — **re-scoped 2026-08-02 by owner
   ruling**, from *"any role name adjacent to a skill name"*, which was a **no-op** (it was a strict
   subset of trigger 2). Specified in full immediately below.
4. `⛔ Owner:`.
5. **A role name within a proximity window of an ownership verb** — trigger **(e)**, added by owner
   ruling later on 2026-08-02 and specified in full immediately below.

**Triggers 2, 3 and 5 share one matching rule, one role-name source and one window definition**, all
pinned in the block below. **Trigger 3's re-scope loses nothing:** a full skill name beside a role name
is still caught by trigger 2.

> **⚠️ THE MATCHING RULES FOR (b), (c) AND (e). This blockquote is byte-identical in ADR-036 clause 4
> and report §4.1 — verified by `diff` on 2026-08-02. If the two ever differ, the ADR is the record and
> the report is stale.** Everything a builder needs to implement the trigger set deterministically is
> inside this block. **Round 4 pins (b)'s token boundary and re-scopes (c); trigger (e) is unchanged
> except for the withdrawal of one false sentence at the end.**
>
> ---
>
> **THE TOKEN-BOUNDARY RULE — it governs (b), (c) and (e) alike, and it is not a detail.**
>
> Every name matched by any trigger is matched **case-insensitively and bounded on both sides by a
> character outside `[A-Za-z0-9_-]`** — a **whole-token** match, never a substring.
>
> **Why this is stated rather than assumed.** Role basename `fkit-reviewer` *contains* skill name
> `fkit-review`; `fkit-adversarial-reviewer` contains it too. Left unstated, (b) is **not
> deterministically buildable — two competent builders get two different answers**. Measured across the
> declared live surface on 2026-08-02: a **bounded** (b) trips **72** of 89 files; a **substring** (b)
> trips **74**. **On the original four-trigger set — (c) as it then stood — the set tripping ≥1 of
> (a)–(d) was 73 bounded and 74 as substrings; with (c) re-scoped as specified below it is 76 and 77**
> (re-measured 2026-08-02). Either way the file
> that flips is exactly **`test/rules-block-budget.test.js`** — which is why §1.5's noise list carried
> it wrongly (R11) and why an earlier revision of this report misattributed a sweep disagreement to (c).
> **Bounded is the rule.**
>
> ---
>
> **(b) — any `fkit-<skill>` / `/fkit-<skill>` naming a skill in the skill universe**, defined as **the
> skill directories on disk, `claude/skills/*/`, enumerated at test time** (25 on 2026-08-02; the count
> is never written down, which is the point). **Full `fkit-` form only** — the bare suffix is (c)'s job,
> and the split is deliberate: a bare suffix is only affordable with a role name beside it.
>
> ---
>
> **(c) — a BARE skill suffix within a proximity window of a role name.** *Re-scoped 2026-08-02 by
> owner ruling. See "what (c) used to say" below — the previous form was a no-op.*
>
> - **Bare skill suffixes** are the `claude/skills/*/` directory names with the `fkit-` prefix
>   stripped — **disk-derived at test time, never a hand-maintained list**, exactly as (b) and (e) are.
>   25 on 2026-08-02: `adversarial-review`, `design-spec`, `dumb-down`, `evaluate-approach`,
>   `initiate-project`, `inspect`, `open-questions-interview`, `plan-task`, `process-review`,
>   `process-stateful-review`, `query`, `record-decision`, `review`, `sprint-ship-loop`,
>   `stateful-review`, `status`, `survey-project`, `task-brief`, `task-cancelled`, `task-done`,
>   `task-ship-loop`, `team`, `wiki-ingest`, `wiki-lint`, `wiki-sync`.
> - **Role names** are the **same** disk-derived set (e) uses — the basenames of
>   `claude/agents/fkit-*.md` **plus each one's bare form**. One definition, used by two clauses, so
>   they cannot drift apart.
> - **The proximity window is 80 characters of the file with every whitespace run collapsed to one
>   space**, measured as the character gap between the two matches, **in either order** — the same
>   window and the same measurement basis as (e), for the same hard-wrap reason given under (e).
> - **A role name is REQUIRED.** A bare suffix alone is unusable: `review`, `status`, `query`, `team`
>   and `inspect` are ordinary English words — which is exactly why broadening **(b)** to bare suffixes
>   was rejected. Requiring a role name inside the window is the whole difference between that rejected
>   option and this one.
>
> **(c)'s measured cost, swept across the declared live surface on 2026-08-02** — the same 89 non-empty
> files (e) was priced against. **52 of 89 trip (c). Exactly ONE file trips (c) and none of (a), (b),
> (d), (e) — and it is a genuine ownership-fact site, not a false positive:**
> `claude/scaffold/ai-agents/knowledge-base/PROJECT.md`, *"The fkit **producer** replaces this file
> during project initiation (**its** initiate-project skill)"*, gap **51** between `producer` and
> `initiate-project`. **(c)'s day-one false-positive cost is ZERO files, and it adds ZERO registry
> noise.**
>
> **The margin is wide in both directions, which is why 80 is safe rather than tuned.** The specimen sits
> **29** characters inside the window. The nearest file that would become a false positive is
> `test/skill-frontmatter.test.js` at a gap of **685** — **605 characters outside** it; the next is
> `test/harness.mjs` at **2607**. Every window from **51 to 684** gives the identical result. **(c) is
> the cheapest clause in the set: it closes a live hole at no measured cost.**
>
> **⚠️ What (c) used to say, and why it is specified this rigorously now.** (c) formerly read *"a role
> name adjacent to a skill name"*, with **no window and no boundary rule**. It required a **skill
> name** — and **(b) already fires on any skill name** — so **(c) ⊆ (b): it could never change an
> outcome.** Measured 2026-08-02 at same-line / 20 / 40 / 80 / 200 / unbounded windows, the set tripping
> ≥1 of (a)–(d) is **73 of 89 in every case**, and (c) adds **0** files beyond (b) at every one.
> **A clause specified less rigorously than its neighbour is how a trigger becomes a no-op that nobody
> notices** — (e) was given a window, a boundary rule and a measured price; (c) was given a sentence.
> That asymmetry is now removed. Nothing is lost by the re-scope: **full skill names beside role names
> are still caught, by (b).**
>
> ---
>
> **(e) — a role name within a proximity window of an ownership verb.**
>
> - **Role names are derived from disk at test time, never from a hand-maintained list** — the same
>   discipline clause 4(b) applies to skills. The source is the basenames of `claude/agents/fkit-*.md`:
>   `fkit-adversarial-reviewer`, `fkit-architect`, `fkit-coder`, `fkit-lead`, `fkit-producer`,
>   `fkit-reviewer`, `fkit-wiki` — **and each one's bare form**, the `fkit-` prefix stripped
>   (`adversarial-reviewer`, `architect`, `coder`, `lead`, `producer`, `reviewer`, `wiki`). Matched
>   under the token-boundary rule above.
> - **Ownership verbs are a closed 41-word list written into the test**, in five groups —
>   **holding:** `own owns owned owner owners ownership hold holds held carry carries carried maintain
>   maintains maintained`; **permission:** `may must can cannot allowed permitted denied forbidden
>   barred refuse refuses`; **exclusivity:** `only exclusive exclusively sole solely`; **invocation:**
>   `invoke invokes invoked invoking runs`; **routing:** `routes routed delegates delegated gateway`.
>   Same matching rule as the role names.
> - **The proximity window is 80 characters of the file with every whitespace run collapsed to one
>   space**, measured as the character gap between the two matches, in either order. **Collapsing
>   whitespace first is load-bearing, not tidiness:** in `claude/scaffold/AGENTS.md` the clause
>   *"Writes stay exclusive to the `fkit-wiki` agent"* is broken by a **hard wrap between `the` and
>   `fkit-wiki`** (`@2026-08-02:19-20`) — so a same-line predicate would miss the very specimen (e)
>   exists to catch.
>
> **Both known specimens are caught, by their load-bearing clause and not incidentally** (re-measured
> 2026-08-02): `ai-agents/README.md` — *"Maintained by the **fkit-wiki agent**"*, gap **10**; and
> `claude/scaffold/AGENTS.md` — *"Writes stay exclusive to the `fkit-wiki` agent"*, gap **9**. Both sit
> far inside the 80-character window.
>
> **The measured cost, swept across the whole declared live surface on 2026-08-02** — 89 non-empty
> files (the clause-5 surface enumerates to 102 paths; the 13 empty `.gitkeep` placeholders under
> `claude/scaffold/` carry no prose and are skipped): **70 of 89 trip (e); 9 trip (e) and none of the
> original four triggers (a)–(d) — (c) as it then stood.** Of those 9, **2 are the ownership-fact sites
> (e) was added for**, leaving **7 files needing
> a new declared-non-fact-hit entry on day one — and all 7 are false positives**, none attributing a
> skill to a role: `ai-agents/knowledge-base/conventions/README.md` and its scaffold twin (*"it is not
> the architect's monopoly"*), `claude/scaffold/ai-agents/wiki-vault/schema.md` (*"Wiki Schema … the
> LLM must follow this schema"* — `wiki` the artifact, not the role), and `test/converge-contract.test.js`,
> `test/dual-home-parity.test.js`, `test/orphan-cleanup.test.js`, `test/rules-block-budget.test.js`
> (role words inside fixture paths, `runFkit(['coder'])` calls and an `agentType` fixture).
> **The registry's declared-non-fact-hit half goes from 15 files to 22.** That is the accepted cost, and
> it is affordable.
>
> > **⚠️ THE BUCKET BASIS, stated per §0 rather than smoothed — added round 5 (R14), re-measured
> > 2026-08-02.** The **9** and the **7** above are measured against the **original four triggers**,
> > with (c) as it then stood. Against (a)–(d) **with (c) re-scoped as specified above**,
> > `claude/scaffold/AGENTS.md` (gap 14) and `claude/scaffold/ai-agents/wiki-vault/schema.md` (gap 9)
> > trip **(c)** as well, so **(e)-only is 7, of which 1 is a fact site (`ai-agents/README.md`) and 6
> > are false positives**. **Nothing moves but the bucket:** (a)–(d) goes **73 → 76**, §1.5's half goes
> > **15 → 16**, (e)'s half goes **7 → 6**, and **the declared-non-fact-hit total is 22 on either
> > basis** — 15 + 7 or 16 + 6. **(e)'s own sweep is untouched — 70 of 89 trip (e)** — and so are the
> > totals that matter: **61 fact-site files, 83 of 89 tripping at least one of the five.** The same
> > qualifier applies wherever the four-trigger figures appear (§1.5, §1.6's C32 row, blind spot #2).
>
> > **⚠️ This paragraph said "6 … 15 → 21" in round 3, and the change is a knock-on, not a re-pricing of
> > (e).** `test/rules-block-budget.test.js` was double-counted: round 3 discounted it as *"already §1.5
> > noise"*, but §1.5 had it wrongly — it trips no (a)–(d) trigger under the token-boundary rule above,
> > and enters the registry through **(e)**. (e)'s sweep result is unchanged and reproduces exactly;
> > only the accounting of which half pays for that one file has moved.
>
> **The owner accepted the fuzziness explicitly, and it is priced here rather than hidden.** *"Role name
> near an ownership verb"* is a **fuzzier predicate than a token match, so it produces false
> positives** — which the registry's excepted-with-a-reason mechanism (clause 2's second kind of entry)
> already exists to absorb. **5 of the 7 come from the bare forms** (`architect`, `wiki`, `coder`).
> Restricting (e) to the `fkit-<role>` forms alone would cost **2** new entries instead of 7
> (`test/converge-contract.test.js` and `test/rules-block-budget.test.js` survive it, both at gap 27)
> and would still catch both specimens — **and was not taken**, because a bare-form attribution is
> exactly the shape (e) exists to catch: `claude/scaffold/CLAUDE.md` already says *"Writes stay
> exclusive to the **wiki role**"*, and a future *"only the producer may invoke `task-done`"* would
> escape a full-form-only trigger.
>
> **Why (e) and not a broadened (b), in the owner's reasoning:** (e) **catches the shape rather than the
> vocabulary**, so it also catches a site naming a skill in some form nobody has thought of yet.
> Broadening (b) to bare skill suffixes **on its own** was rejected because `review`, `status`, `query`
> and `team` are extremely common English words, and on a prose corpus every one of the resulting hits
> would need a written reason to silence. **(c)'s re-scope is not that option**: it takes the same
> vocabulary and requires a **role name** inside the window, which is what takes its measured cost to
> zero.
>
> ---
>
> **⚠️ WHAT THE SET STILL DOES NOT CATCH — and read this as a measurement, NOT as a licence.**
>
> **An earlier revision printed here: *"No live-surface site has that shape on 2026-08-02."* That
> sentence was FALSE, and it is withdrawn.** It described verbless attribution — a skill attributed to a
> role by possessive or apposition alone. `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` had
> exactly that shape, in the live surface, on that date: *"its initiate-project skill"*, with its
> nearest ownership verb **839 characters** away. **The sentence ruling the shape out and the sweep that
> disproved it were written by the same author on the same day.** The hole is now closed **by a clause,
> not by a claim** — that is what the (c) re-scope is for.
>
> **What survives (a)–(e) is narrower, and is stated without a completeness claim of any kind:** an
> attribution carrying **no skill name in any form within 80 characters of a role name** *and* **no
> ownership verb within 80 characters of a role name** — for example a role paired with a *description*
> of a skill rather than its name.
>
> **The dated measurement, and its limits, stated together so neither can be read alone.** With all five
> triggers, **83 of the 89 live-surface files trip at least one**. The remaining **6** were opened and
> read on 2026-08-02 — `claude/askuserquestion-marker-hook.sh`,
> `claude/scaffold/ai-agents/wiki-vault/index.md`, `claude/scaffold/ai-agents/wiki-vault/log.md`,
> `test/askuserquestion-marker-hook.test.js`, `test/harness.mjs`, `test/skill-frontmatter.test.js` —
> and **none attributes a skill to a role.** **That is a measurement of one tree on one day by one
> author, and this report's own §0.1 records two occasions this month when exactly that kind of
> measurement was confidently wrong. It licenses nothing.** ADR-036's residual therefore states, with
> no exception clause beside it: **whoever builds A-i must NOT treat clause 4 as complete.**

> **⚠️ Corrected after review, 2026-08-02 — trigger (b) was bound to the wrong list, and the report and
> the ADR disagreed about which.** Round 1 of this report bound (b) to `UNIVERSE`, the constant in
> `test/skill-ownership-hook.test.js`; ADR-036 clause 4(b) said *"the skill universe"*. **`UNIVERSE`
> holds 24 of the 25 skills** — `fkit-sprint-ship-loop` is absent, and the file says so about itself:
> *"(`fkit-sprint-ship-loop` itself is absent from UNIVERSE below, so it is not mirrored here either —
> pre-existing gap)"* (`@2026-08-02:318`). A site naming only `fkit-sprint-ship-loop`, with no role
> adjacency, bare token or banner, **would have escaped all four triggers as they then stood.** Binding (b) to the
> directory listing instead covers all 25 and cannot go stale. **The report and ADR-036 now use the
> same wording.**

The bare token being in the set is the signed call that makes **`0151`'s class catchable**: that line
named no skill and no role, so triggers 2–5 (ADR-036's (b)–(e)) all miss it. It costs **~100 files** of raw hits repo-wide
(**101, measured 2026-08-02**; **10 of them live surface**), which is precisely why the live-surface
boundary (§1.1) must be **declared** rather than inferred.

**What A-i catches:** every *unregistered* site that trips a trigger. New agent definition, new skill,
new root doc, new test oracle, a fifth-then-sixth mirror, the `0151` class, the `0124` class. The list
stops being remembered.

> **⚠️ A-i's blind spot #1 — the honest limit, and it is large.** A-i makes the **inventory**
> mechanical. **It does not make the sweep mechanical.** A **registered** site whose prose quietly goes
> false **still ships false.** All **five** of Part 3's defects are wrong content at sites that are or
> should be registered — **A-i catches none of them.** It converts *"did I remember every place?"*
> (unanswerable, failed three times) into *"did I check every place on this list?"* (answerable,
> auditable, still manual). That is a real gain and it is not the whole problem.

> **⚠️ A-i's blind spot #2 — bare-suffix and verbless attribution. RULED, specified and priced in two
> steps, and the second step exists because the first was declared complete when it was not.**
>
> **Step 1 (round 3).** Two fact sites tripped **no trigger at all** (§1.6): `ai-agents/README.md` and
> `claude/scaffold/AGENTS.md`, both naming a skill by its **bare suffix** (`task-done`, `query`) and
> attributing it to a **role name**, which is not a skill. The owner ruled a fifth trigger — **(e), a
> role name beside an ownership verb** — over broadening (b) to bare suffixes. (e) is specified above,
> **it catches both specimens**, and its day-one cost was measured **before** the spec shipped:
> **7 false-positive files** needing a declared-non-fact-hit entry *(6 as first reported; the seventh is
> R11's accounting correction, not a re-pricing)*, registry noise **15 → 22**. **Those two figures are
> on the four-trigger basis; with (c) re-scoped the split is 16 + 6 and the total is 22 either way** —
> §4.1's bucket-basis note, re-measured 2026-08-02.
>
> **Step 2 (round 4), and it is the more important one.** Round 3 shipped (e) **alongside a sentence
> declaring the surviving hole had no live instance.** It had one — **C32**, unregistered, in the
> scaffold tree, 839 characters from the nearest ownership verb. **The blind spot was not that (e) was
> wrong; (e) is sound and every measurement behind it reproduces. The blind spot was declaring the
> remainder empty from a sweep that had already been wrong twice.** The owner ruled **(c) re-scoped to
> a bare skill suffix near a role name**, which catches C32 at gap **51** at a measured false-positive
> cost of **zero files**. **The sentence is gone; the hole is closed by a clause instead.**
>
> **What survives (a)–(e) is stated above with a dated measurement and NO completeness claim.** That is
> the whole of the change: this report no longer tells a builder any part of clause 4 is finished.

#### A-ii — per-site extractors that check the prose *(hard; deferred)*

Extend each registry entry with an extractor that pulls the asserted role→skill mapping out of that
site and diffs it against `skills_for_role()`.

**Cost, measured:** the five mirrors have **five different formats** — a pipe table keyed by role
(B1), a pipe table keyed by role with the shared skills in the *header cell* (B2), a four-column table
with skills in the fourth column and the lead only in prose (B3), a table keyed by *owner* including a
`the six Claude-side roles` pseudo-row (B4), and JavaScript object literals (C1). **Five bespoke
parsers.** Tier C's prose sites (C4, C9–C14) have no extractable structure at all.

> **⚠️ A-ii's blind spot:** it can only ever cover the *structured* sites. The sites that actually
> caused both historical failures — `0036`'s scaffold prose and `0124`'s **system prompts** — are the
> unstructured ones. **A-ii is the most expensive option and it does not reach the failure class that
> motivated the task.** Plus five parsers over hand-edited markdown are themselves five things that
> break on a reformat.

**Owner ruling 2026-08-02: A-ii deferred.**

#### Cost against ADR-014

`ADR-014` keeps devDependencies at zero, so this is hand-rolled `node:test` + `node:assert`, the same
as `test/dual-home-parity.test.js`. A-i is one data module and one test file. **No new dependency, no
budget interaction** — it adds no bytes to the rules block.

### 4.2 Option B — generate the ownership sentences from `skills_for_role()`

Emit the prose into the agent definitions and the rules block the way `universal-rules.md` already
generates the root `CLAUDE.md` / `AGENTS.md` blocks. One fact, one place, no mirrors.

> **⚠️ Option B's blind spot is fatal, and it is not the budget.**
>
> **The sites are arguments, not lists.** Specimen — `fkit-coder.md` §*"What you must not do"*:
>
> > *"**Move task files — at all.** Task files move only via `/fkit-task-done` /
> > `/fkit-task-cancelled`, never by hand, and since ADR-033 **you do not hold those skills**: they are
> > producer-only and the ADR-018 hook denies you at any spawn depth. Route a close by spawning
> > `@fkit-producer`, which writes the `(agent-closed — not owner-verified)` marker. **Cancelling your
> > own task still goes to the owner** — do not route a cancel to a producer spawn: `cancelled/` is
> > audited by nobody."*
>
> The membership fact — *the coder does not hold the movers* — is **one clause of six**. The rest is
> the ADR that reversed it, the enforcement mechanism, the routing instruction, the marker
> requirement, and a carve-out with its own justification. **You cannot generate that from a shell
> array.** Generating only the clause and hand-writing the rest reintroduces exactly the split this
> option was meant to remove, in the middle of a sentence.

**And the budget does bind, independently. Re-measured 2026-08-02** by piping
`fkit-claude-init.sh`'s own `emit_block()` through `wc -c`:

| | Value |
|---|---|
| Emitted rules block | **3570 B** |
| `RULES_MAX` (`claude/fkit-claude-init.sh`) | **4096 B** |
| Headroom | **526 B** |
| Utilisation | **87.2 %** |
| Owner's standing target (task `0130`) | **≥ 400 B free** |
| **Usable growth before the target is breached** | **126 bytes** |

**The brief's 91.1 % is stale** and it is the *less* alarming way to say this. The real constraint is
that a generated-prose option has **126 bytes** to work with. One sentence.

*(The test's early-warning threshold is 92 %; at 87.2 % all three budget tests pass today —
`node --test test/rules-block-budget.test.js`, run 2026-08-02, 3 pass.)*

**Rejected.**

### 4.3 Option C — a better checklist

Cheapest. Also the one that has already failed **three times** — `0036`, `0124`, `0151`.

> **Count corrected after review, 2026-08-02, and stated rather than smoothed (§0).** Round 1 of this
> report said *"twice"* in **three** places while ADR-036 said *"three times"* in three places, and
> neither flagged the divergence. *(The review ledger says the report said it in four places; `grep -c`
> on the round-1 file returns three. Recorded, not smoothed; it does not change the finding.)*
> **Three is right:** `0151` is a full failure of the same control — root
> `CLAUDE.md`'s hand-written prose named the wrong file for `skills_for_role()`, a class the checklist
> does not name at all. **Both documents now say three.**

**Its own file argues against it**, unprompted, in text written before this task existed:

> *"A checklist that is itself incomplete is worse than no checklist: it is followed, and it fails."*

A fourth revision fails for the reason the first three did: **nothing makes it go red when it is wrong.**
A list nobody can be wrong about out loud is not a control, it is a hope. And D4 proves the failure is
current, not historical — the checklist is incomplete *right now*, and the very instruction *"If you
add a fifth mirror, add it HERE FIRST"* was ignored by the task that added the fifth.

> **⚠️ Option C's blind spot:** total. It catches nothing mechanically. Its only value is as **prose
> attached to something enforced** — which is precisely what A-i turns it into.

**Rejected as a standalone. Retained as A-i's `reason` field.**

---

## Part 5 — the recommendation

> ## Build **A-i**: the declared site registry plus the completeness tripwire. Defer A-ii. Demote the checklist to a pointer at the registry.
>
> Concretely: `test/skill-ownership-sites.mjs`, `{ path, kind, reason }`, **≥30-character `reason`
> floor**, in `test/dual-home-parity-exceptions.mjs`'s shape and authoritative the way that module is;
> one test that fails on any live-surface hit for the trigger set whose file is unregistered; and
> `claude/skills-for-role.sh`'s checklist block rewritten to point at the registry instead of listing
> four places.

**The main tradeoff, unchanged from the draft and carried at the owner's instruction:**

> **It makes the *inventory* mechanical, not the *sweep*. A registered site whose prose quietly goes
> false still ships false.**

> **And one thing the registry must be, added after this report's own inventory was found short by 17
> rows (§0.1): AUTHORITATIVE.** Once `test/skill-ownership-sites.mjs` exists, **it** is the inventory.
> A count in a report — including every count in this one — is a **dated measurement of the registry on
> a day**, never the record. ADR-036 hard-codes no site count for exactly this reason. Round 1 of this
> report hard-coded 21 into the durable record; three passes by one author on one day produced ~19, 21
> and 38. **A number that unstable does not belong in an ADR.**

**Why this and not the others:** B is out on the argument-not-a-list blind spot, with a 126-byte budget
as the independent second reason. C is out because it has failed three times and is failing now. A-ii is
five bespoke parsers that still miss the unstructured system prompts where both real failures
happened. A-i is the only option that converts an unanswerable question into an auditable one at a
cost of one data module and one test.

### Is an ADR needed? **Yes** — brief verification step 3.

Not because the source of truth moves. **`skills_for_role()` remains the single source of truth,
ADR-012 §1, unchanged.** An ADR is needed because a **new artifact becomes authoritative for a
different fact** — the *inventory of sites*, which today is a comment block that no test reads. That
is a new fact of record with a new home, plus two scoping calls (the trigger set, and `test/` inside
the live surface) and a declared live-surface boundary that future work will need to be able to cite.

**Precedent, and it is close to exact: ADR-027** — convention + test + machine-readable exception list
with mandatory reasons. This is the same shape, applied to a different invariant.

**Recorded as `ADR-036`** — see §9.

---

## Part 6 — would it have caught them? *(per instance)*

Brief verification step 4 calls this *"the single most useful sentence in the report."* It is
therefore stated per instance, and **not softened**.

| # | Instance | Would A-i have caught it? |
|---|---|---|
| 1 | **`0036`** — checklist shipped false docs into `claude/scaffold/CLAUDE.md` | **NO.** `scaffold/CLAUDE.md` was **already a declared mirror**. The site was registered; the content went false. A-i checks registration, not content. **Only A-ii could have, and only because this site is a table.** |
| 2 | **`0124`** — `claude/scaffold/universal-rules.md` asserting the reversed ADR-025 grant | **YES.** Unregistered site, hit by triggers 1–4. The tripwire fails until it is declared, and declaring it puts it in front of the next person who changes an ownership fact. |
| 3 | **`0124`** — `claude/agents/fkit-producer.md`, three assertions | **YES.** Unregistered; agent definitions are not on the checklist at all. |
| 4 | **`0124`** — `claude/agents/fkit-coder.md`, including the one in the hard must-not-do list | **YES**, same reason. This is the instance that would have produced *"the ADR-018 hook denies the coder a mover while `fkit-coder.md` still instructs it to invoke one"* — a runtime arguing with itself. |
| 5 | **`0151`** — `CLAUDE.md`'s stale `skills_for_role()` location, in prose **outside** the generated block | **YES — but only because the bare token `skills_for_role` is in the trigger set.** That line names no skill and no role; triggers 2, 3 and 4 all miss it. This single instance is the entire justification for accepting ~90 raw hits and declaring a live-surface boundary. |
| 6 | **This report's Part 3 — all five defects** | **NO. None of the five.** D1 and D2/D3 are false content at **declared mirrors**; D4 is a false count in the checklist itself (**registered as A1**); D5 is false prose in root `CLAUDE.md` (**registered as C9**). All are wrong prose at registered sites — **`0137`'s territory, not A-i's.** |
| 7 | **This report's own incomplete first pass (§0.1)** | **NO, and it could not be.** A-i guards the tree, not the report. The 17 missed rows were sites nobody had opened; the tripwire fires only once a site is *in the tree and unregistered*, which each of them already was — **it would have gone red on all 17 the moment it ran**, which is the point of building it, but nothing in A-i makes a human's sweep complete. |
| 8 | **This report's own SECOND incomplete pass — the round-2 sweep that missed C32 (§0.1)** | **YES for the tree, NO for the report — and the split is the honest answer.** **YES:** C32 was in the tree and unregistered, and it trips the **re-scoped (c)** at gap 51 — the tripwire would have gone red on it. **NO:** nothing in A-i would have stopped the author writing *"no live-surface site has that shape"* next to it. **The guard would have caught the site; it would not have caught the sentence.** Row 8 is row 6's lesson pointed at this report instead of at the tree, and it is the sharpest statement of A-i's limit available. |

**Score: 4 of 6 historical classes, 0 of ≥5 current defects.** *(Rows 7 and 8 are this report's own
failures, not historical classes, and are excluded from the denominator — they are stated because
excluding them from the table would be the softening the brief forbids.)*

> **⚠️ Both halves of that score were corrected upward in review round 1, 2026-08-02.** Round 1 said
> *"0 of 4"*. The denominator is **≥5** because D5 exists (Part 3) — and it is written *≥* rather than
> *5* because this report has already been wrong about how complete its own census was. **Round 4 note:
> it has now been wrong about that twice** (§0.1), which is why the `≥` stays and why no revision of
> this report will replace it with an exact figure.
> Row 6's **NO** is unchanged and unsoftened; the correction makes the recommendation look **worse**,
> not better, and the repair follow-up's scope **larger**.

Stated plainly because that is what the brief asked for: **A-i would not have caught `0036`, and it
would not catch any defect live in the tree today.**

### 6.1 Why row 6 is the argument for keeping `0137` separate

Row 6 is not a weakness in the recommendation. It is the **boundary between two different controls**,
and it is why the owner's earlier call to keep `0137` separate was right:

> **`0137` teaches the reader to ask the right question of a citation; this hands them the complete
> list of citations to ask it about.**

They compose. Fold them together and you get one artifact that does neither job well: `0137`'s lesson
is a *convention* (it changes how a person reads), A-i is a *test* (it changes what CI rejects).
Neither substitutes for the other, and §2.1 is the proof — `0137`'s Lesson 1 fired, on this task, on
the first citation opened, at a site A-i would have marked green.

---

## Part 7 — an open discrepancy in the record of `0124`

**Not re-derived** — the brief forbids re-running `0124`'s sweep and the owner did not override that.
Recorded as found:

- **`ai-agents/wiki-vault/wiki/systems/fkit.md`** says the checklist *"missed **four system prompts**
  and the universal rules block"*.
- **`0142`'s own brief** and **`ai-agents/sprints/sprint-2.md`** both say **three** — *"`0124`'s three
  missed sites"*, and the brief's table lists exactly three rows.

**One of the two is wrong.** I did not determine which, because doing so requires the sweep the brief
rules out. **It does not change the recommendation** — Part 6 rows 2–4 are `0124`'s three named sites,
and a fourth system prompt would be the same class, answered the same way (**YES**, unregistered agent
definition).

**`0124`'s task folder holds only `brief.md` and `review.md` — there is no `worklog.md`**, so the
sweep's own working record does not exist to settle it from.

> **If the wiki page is the wrong record, only `fkit-wiki` may repair it.** Nothing here writes
> `ai-agents/wiki-vault/`, and nothing here authorises any other role to.

---

## Part 8 — follow-ups I would want filed *(named, not filed)*

**Not filed. The producer files these at close.** Listed in the order they must ship.

1. **Repair the FIVE live defects of Part 3 — FIRST, before the guard.** D1 (`scaffold/CLAUDE.md`
   producer row missing `/fkit-task-brief`), D2 (`architecture.md`'s *"Only `fkit-query` carries no
   banner"*, plus the two *"every skill"* sentences that share the error), D3
   (`architecture.md`'s dead `skills-for-role.sh:35`), D4 (the FOUR-vs-five-and-six mirror count),
   **D5 (root `CLAUDE.md`'s *"invisible"*, contradicted by four live docs and ADR-018 §Decision 5)**.
   **Owner ruling, verbatim: *"do not let the build quietly repair its own corpus."*** A build task
   that fixes its own inputs proves nothing about the guard.
   - **⚠️ D4's repair must touch TWO files, not one — widened round 4.** The FOUR-mirror checklist is
     **byte-identical** in `claude/skills-for-role.sh@2026-08-02:12-23` **and**
     `claude/fkit-claude.sh@2026-08-02:239-250` (§1.4, measured 2026-08-02). ADR-036 clause 2's
     demotion is widened to name both; **repairing or demoting only the first leaves the false `FOUR`
     live in the second.**
   - **Scope corrections carried from the review rounds, 2026-08-02:** the count is **five, not four**;
     and **two successive mechanical justifications for the sequencing were asserted, found false, and
     are both withdrawn** — *"out of order the guard ships red on its first run"* (round 1) and
     *"clause 2 deletes the `FOUR`, so the build resolves D4 itself"* (round 2). See the correction
     blocks under D4. **There is no mechanical sequencing constraint and this follow-up carries no
     mechanism; the sequencing rests on the owner's ruling alone.**
   - **Also look at, without a defect being asserted:** `PROJECT.md`'s *"turned off"* (§D5 note), and
     `ai-agents/README.md` / `ai-agents/tasks/README.md`, which state the mover rule **without** the
     producer-only clause — incomplete, not false.
2. **Build A-i** — `test/skill-ownership-sites.mjs` + the completeness tripwire + the checklist
   demotion, per ADR-036. Owner: fkit-coder. **Scope it from the registry it builds, not from a count
   in this report** (§5).

Not recommended for filing now, recorded so the reasoning is not lost: **A-ii** (deferred by ruling,
§4.1); and **a re-scope of the wiki/sprint-plan three-vs-four discrepancy** (§7) if the owner wants the
record settled — which needs the sweep this task was barred from running.

> **The trigger-set hole of §1.6 no longer belongs on that list.** It was ruled by the owner on
> 2026-08-02 in two steps — **trigger (e)**, and the **re-scope of (c)** — both specified in §4.1 with
> their costs measured. It needs no separate task — **it is part of A-i's scope above**: whoever builds
> the tripwire builds **five working triggers**, applies the **token-boundary rule** to (b), (c) and
> (e), and registers the **7** additional non-fact hits (e) surfaces *(the re-scoped (c) surfaces none)*
> — taking the registry's day-one noise half to **22** files. **What is left unclosed is stated in §4.1
> as a residual with a dated measurement and no completeness claim, and ADR-036 tells the builder
> explicitly not to treat clause 4 as complete.**

**Input to an already-open task, not a new one:** this report's **§0 citation form** (`@YYYY-MM-DD:NNN`)
goes to task **`0171`** (`durable-citation-anchors`), owner-ruled 2026-08-02. **Named here as an input;
`0171`'s brief is the producer's file and is not edited by this task.**

---

## Part 9 — the ADR

**`ADR-036` — the skill-ownership site inventory is a declared registry, not a checklist.**

**Collision check, run 2026-08-02:** highest ADR on disk is `adr-035`; `grep -rn "ADR-036\|ADR-037"`
across the whole repo excluding `.git` returns **no hits**, so nothing is in flight under either number
in any brief, sprint plan, ledger or report. `036` allocated.

File: [`adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md`](../decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md)

---

## Appendix — commands run, 2026-08-02

**Re-run in full after the review round.** Where a figure moved, both readings are shown.

| Purpose | Command |
|---|---|
| Bare-token corpus size | `grep -rln "skills_for_role" . \| grep -v "^./.git/" \| wc -l` → **101** *(first pass, earlier the same day: 98; reviewer, mid-day: 100. The token spreads as documents about it are written — this report, ADR-036, then the review ledger. All three additions are **dated records**, so none is live surface. See §1.1.)* |
| Live-surface subset | same, restricted to the §1.1 declared live surface → **10**, unmoved all day. **Includes `claude/README.md`** — which is why clause 5 now names it (§1.1). |
| **Live-surface file list** *(round 4 — authoritative)* | the §1.1 / clause-5 surface enumerated to a list → **102 paths · 89 non-empty · 13 empty `.gitkeep`**. ⚠️ **Round 2's *"88 files"* is WITHDRAWN** — it does not reproduce and matches neither figure; round 3 priced (e) against 89 in the row below, one row away, on the same boundary, on the same day, and neither pass reconciled them (§0.1, §Part 1). |
| **Trigger sweep** *(round 4 — the four triggers as they stood in round 2, re-run over the corrected 89-file list, with the token-boundary rule of §4.1 applied)* | **73 trip ≥1 of (a)–(d)** *(unchanged: bounded (b); a substring reading gives 74, and the flip file is `test/rules-block-budget.test.js`)* → **58 triggered fact-site files** + **15 noise** (§1.5, corrected membership) **= 73** ✓; plus **3 fact sites trip nothing** (§1.6) → **61 fact-site files, 39 inventory rows, 21 classes** |
| **Trigger sweep on the CURRENT basis** *(round 5 — (a)–(d) with (c) re-scoped, same 89-file list, same token-boundary rule)* | **76 trip ≥1 of (a)–(d)** bounded, **77** as substrings; the three files (c) adds over the four-trigger basis are `claude/scaffold/AGENTS.md` (gap **14**), `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` (gap **51**) and `claude/scaffold/ai-agents/wiki-vault/schema.md` (gap **9**). Two of the three are fact sites (C30, C32), one is a declared non-fact hit → **60 triggered fact-site files + 16 noise = 76** ✓; **1 fact site trips no (a)–(d)** (`ai-agents/README.md`, caught by (e)) → **61 fact-site files** ✓, **22 declared non-fact hits** ✓, **83 of 89 trip ≥1 of the five** ✓, **39 rows, 21 classes** ✓. **Every total closes on both bases; only the bucket moves** (§4.1, R14) |
| **Trigger (b) boundary measurement** *(round 4)* | (b) matched **bounded** by `[^A-Za-z0-9_-]` → **72 of 89**; matched as a **substring** → **74 of 89**; the difference is `fkit-reviewer` containing `fkit-review`. **Bounded is the pinned rule** (§4.1) |
| **Trigger (c) no-op proof** *(round 4)* | (c) as it stood — *"a role name adjacent to a skill name"* — evaluated at same-line / 20 / 40 / 80 / 200 / unbounded windows: the set tripping ≥1 of (a)–(d) is **73 of 89 in every case**, and (c) adds **0** files beyond (b) at every window. **(c) ⊆ (b)** |
| **Re-scoped (c) sweep** *(round 4)* | bare skill suffix (25 `claude/skills/*/` names, `fkit-` stripped) within **80 chars** of a role name, whitespace-collapsed, bounded matching → **52 of 89 trip (c)**; **1 trips (c) and none of (a), (b), (d), (e)** — `claude/scaffold/ai-agents/knowledge-base/PROJECT.md`, a **genuine fact site** → **0 false positives, 0 new registry noise** |
| **Re-scoped (c) margin** *(round 4)* | specimen gap **51** (`producer` ↔ `initiate-project`); nearest would-be false positive `test/skill-frontmatter.test.js` at **685**, then `test/harness.mjs` at **2607**. Identical result for every window from **51 to 684** |
| **Trigger (e) sweep** *(round 3, re-run round 4)* | the surface re-enumerated → **102 paths, 89 non-empty**; each tested for a role name (basenames of `claude/agents/fkit-*.md` + bare forms) within **80 chars** of an ownership verb, on the file whitespace-collapsed → **70 trip (e)**; **9 trip (e) and none of the ORIGINAL four triggers (a)–(d)**; of those, 2 are §1.6's fact sites → **7 new declared-non-fact-hit entries, all 7 false positives**. *(Round 3 said 6, discounting `test/rules-block-budget.test.js` as "already §1.5 noise"; §1.5 had it wrongly — see §1.5. (e)'s own numbers are unchanged.)* **Round 5, re-measured: against (a)–(d) with (c) re-scoped, (e)-only is 7 — 1 fact site, 6 false positives. 70 trip (e) is unchanged; the total non-fact-hit half is 22 on either basis (§4.1's bucket-basis note).** |
| **Trigger (e) full-form-only alternative** *(round 4 re-count)* | (e) restricted to `fkit-<role>` forms, dropping the bare forms → **5 of the 7 drop out**; cost **7 → 2** (`test/converge-contract.test.js` and `test/rules-block-budget.test.js`, both at gap **27**); both specimens still caught. **Rejected — reason unchanged** (§4.1) |
| **All five triggers together** *(round 4)* | **83 of 89 trip ≥1**. The **6** that trip nothing were opened and read: `claude/askuserquestion-marker-hook.sh`, `claude/scaffold/ai-agents/wiki-vault/index.md`, `claude/scaffold/ai-agents/wiki-vault/log.md`, `test/askuserquestion-marker-hook.test.js`, `test/harness.mjs`, `test/skill-frontmatter.test.js` — **none attributes a skill to a role.** A dated measurement, **not** a completeness claim (§4.1) |
| **Possessive / appositive re-sweep** *(round 4, R8's shape specifically)* | every role-name occurrence across all 89 files with a skill name (full **or** bare) within 100 chars and **no** ownership verb within 80 → **282 instances across 49 files**; every file cross-checked against §1.2 and §1.5. **All were already registered except one — C32.** *(3 of the 49 are registered non-fact hits and were re-read to confirm: `claude/scaffold/…/wiki-vault/schema.md` — `wiki` the path, not the role; `claude/scaffold/…/conventions/evidence-before-assertion.md` — an enforcement list, the twin's role attribution having been dropped in the de-fkit-ified rewrite; `test/turn-completion-hook.test.js` — an `agentType` fixture.)* **Nothing beyond R8 was found.** ⚠️ **ROUND 5 — this row's INSTANCE COUNT DOES NOT REPRODUCE, and it is recorded as an ACCEPTED RESIDUAL rather than re-typed (R15).** Two independently-written reimplementations of the stated method — the reviewer's and Codex's — **both returned 291 instances across 50 files**; the extra file is `claude/fkit-claude.sh`, five qualifying role occurrences, **already registered as A3**. **The CONCLUSION is confirmed twice over: all 50 files are registered, and nothing beyond C32 is unregistered.** The published 282/49 is left as the dated measurement it is, per §0 — **and this is exactly why §4.1 refuses to treat this sweep as proof of completeness** — *"a measurement of one tree on one day by one author … It licenses nothing"* — **a refusal R15 has now made load-bearing rather than rhetorical.** |
| **Trigger (e) specimen check** | the two §1.6 clauses matched directly: *"Maintained by the `fkit-wiki` agent"* → gap **10**; *"Writes stay exclusive to the `fkit-wiki` agent"* → gap **9** (the latter **crosses a hard wrap**, between `the` at the end of `claude/scaffold/AGENTS.md@2026-08-02:19` and `` `fkit-wiki` `` opening `:20` — which is why the window is measured on whitespace-collapsed text) |
| **D4 checklist duplication** *(round 4)* | `diff` of `claude/skills-for-role.sh@2026-08-02:12-23` against `claude/fkit-claude.sh@2026-08-02:239-250` → **no output**. The FOUR-mirror checklist exists **twice, byte-identically** (§1.4, §D4) |
| **Spec-block parity** *(round 4; re-run round 5 after the qualifier edit)* | the shared matching-rules blockquote extracted from report §4.1 and ADR-036 clause 4 and compared → round 4: **12 670 characters, identical**; **round 5: 13 869 characters / 14 020 UTF-8 bytes, `diff` → no output**. The block grew because the bucket-basis note was added to **both** files in the same edit. R5's failure mode still does not recur |
| Dual-home twins byte-identical | `diff ai-agents/tasks/README.md claude/scaffold/ai-agents/tasks/README.md` → no output; same for `task-owner-vocabulary.md`. `task-status-vocabulary.md` **differs** — an audience-adapted rewrite that asserts the same fact in different sentences (C21/C22). |
| Skill count | `ls -d claude/skills/*/ \| wc -l` → **25** |
| Banner audit *(the one that was wrong — §3)* | `for f in claude/skills/*/SKILL.md; do grep -q "⛔ Owner:" "$f" \|\| echo "$f"; done`, then **read every file** |
| Rules block size | `emit_block()` from `claude/fkit-claude-init.sh`, replayed verbatim, piped to `wc -c` → **3570** |
| Budget tests | `node --test test/rules-block-budget.test.js` → 3 pass |
| ADR collision | `grep -rn "ADR-036\|adr-036\|ADR-037\|adr-037" . \| grep -v "^./.git/"` → no hits |
