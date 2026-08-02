# Worklog — 0142, investigate the skill-ownership fact-inventory gap

**Author:** fkit-architect (spawned by `/fkit-sprint-ship-loop`; no owner channel — ADR-021).
**Owner rulings:** all four signed via `AskUserQuestion` in the live lead session, 2026-08-02.

## What was produced

| Artifact | Path |
|---|---|
| Decision report | `ai-agents/knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md` |
| ADR-036 (accepted) | `ai-agents/knowledge-base/decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md` |
| Plan | this folder's `plan.md` |
| Worklog | this file |

**Nothing else was written.** No skill, agent definition, test, script, board, convention page or
vault file. No task moved. No commit, no push.

## Round 2 — the review fix round, 2026-08-02

**A stateful review returned 🛑 BLOCKED — 7 confirmed defects (3 high). The owner ruled a fix round.
All seven were verified first-hand and applied.** Response written into
`review.md` §*Response — round 1*; the *Reviewer findings* section was not touched.
**`/fkit-process-stateful-review` was NOT run** (coder's skill, denied to this role by the ADR-018
hook) — its method was applied by hand.

- **R1 (high) — the inventory was incomplete, which is the exact failure this report exists to name.**
  The stated method never opened `knowledge-base/conventions/`, `claude/scaffold/ai-agents/`, or
  `claude/*.sh` beyond three scripts — all three inside the boundary the report itself declared. **Sweep
  redone in full:** the 88-file live surface enumerated, all four triggers applied, **every hit opened
  and read**. **21 rows / 16 classes → 38 rows / 21 classes.** Worst single omission:
  `claude/fkit-claude-init.sh`'s hand-maintained printed roster, whose own comment says *"nothing tests
  that they agree"* — never mentioned, not even as an exclusion. Report **§0.1** says this plainly,
  before Part 1. **ADR-036 now hard-codes no count** — the registry is authoritative, a report count is
  a dated measurement.
- **R2 (high) — a false mechanism withdrawn.** *"The guard ships red on day one"* contradicted the
  report's own Part 6 row 6. The tripwire checks registration only and `skills-for-role.sh` is
  registered (A1), so a false `FOUR` inside it is invisible to it. Withdrawn in both documents;
  sequencing now rests on the owner's ruling — *"do not let the build quietly repair its own corpus."*
- **R3 (high) — a fifth live defect (D5)**, at a site already registered as C9 and quoted from 13 lines
  below: root `CLAUDE.md`'s *"invisible"*, contradicted by four live docs and ADR-018 §Decision 5.
  Score **0 of 4 → 0 of ≥5**; repair follow-up rescoped.
- **R4 / R5 (medium)** — `claude/README.md` moved **into** the declared live surface (it is one of the
  four mirrors the checklist names); trigger (b) rebound from `UNIVERSE` (24 of 25) to the skill
  directories on disk (25), **in identical wording in both documents**.
- **R6 / R7 (low)** — failure count unified on **three**, with the promotion of `0151` stated;
  bare-token corpus re-measured **101** (98 → 100 → 101 in one day, explained: the token spreads as
  documents about it are written, and **all three additions are dated records**, so the live-surface
  subset held at **10**).

**New, found by the corrected sweep and NOT settled here:** two genuine fact sites
(`ai-agents/README.md`, `claude/scaffold/AGENTS.md`) trip **none** of the four triggers, because they
name skills by bare suffix (`task-done`, `query`) and attribute them to a role name. Both fixes change
an owner-signed trigger set, so **neither was applied**. Recorded as report §1.6 / §4.1 blind spot #2
and as an **OPEN residual with no ruling yet** in ADR-036. **A-i's clause 4 is not complete.**

**Scope kept:** still no implementation, none of the five live defects repaired, no brief filed, no
task moved, no vault write, no commit.

## Brief verification steps — status

| # | Step | Status |
|---|---|---|
| 1 | Dated report in `reports/`, complete inventory, file **and anchor** per site | ✅ *(round 2)* Report Part 1 — **38 sites, 21 classes, measured 2026-08-02**; the checklist names **5**. Round 1's 21/16 was ⚠️ PARTIAL on review (R1) and is superseded; the shortfall is stated in §0.1 rather than quietly replaced |
| 2 | Each approach with what it catches **and what it still misses** | ✅ Part 4 — A-i, A-ii, B, C, each with a stated blind spot |
| 3 | One recommendation with its main tradeoff; is an ADR required | ✅ Part 5 — build A-i, defer A-ii; ADR required and written (036) |
| 4 | Validated against the known misses — would it have caught them | ✅ Part 6, **per instance**, including the NOs; **0 of ≥5** current defects after round 2 |
| 5 | **No implementation** | ✅ Nothing built; the **five** live defects deliberately **not** repaired |

## Decision log

- **Inventory count moved between the draft and the write-up** — ~19 sites / 15 classes → **21 / 16**.
  No new site was found; two rows were split apart (`claude/scaffold/CLAUDE.md`'s hand-written table
  vs. its *generated* rules block, and the `AGENTS.md` half of the unmanaged-prose pair). **Recorded in
  the report rather than silently corrected**, because the site count being unstable between two passes
  by the same author on the same day is itself evidence for the recommendation.
- **A method defect of my own, reported because `evidence-before-assertion` requires it.** My first
  owner-banner audit was `grep -q "⛔ Owner:"` per skill file. It reported one missing banner
  (`fkit-query`). **Wrong** — `fkit-team/SKILL.md` is also missing one, and the grep passed on it
  because the file contains *prose describing the banner*. Caught by reading the files, not by
  refining the pattern. Kept in the report Part 3 as its own call-out: it is first-hand evidence,
  gathered accidentally, that free-prose detection is hard — the load-bearing argument against
  option B and for scoping A-i to a declared registry rather than a smart detector.
- **Budget re-measured, not trusted.** The brief cites 91.1 %; replaying `fkit-claude-init.sh`'s own
  `emit_block()` through `wc -c` gives **3570 B / 4096 B = 87.2 %**, 526 B headroom, **126 bytes**
  usable against the owner's ≥400 B standing target. The brief's figure is stale and was the *less*
  alarming framing.
- **Five live defects found, none repaired** *(four in round 1, D5 added in round 2 — R3)*. Owner
  ruling, verbatim: *"do not let the build quietly repair its own corpus."* Named as follow-up 1 in
  report Part 8, sequenced **before** the guard. ⚠️ **Round 1's stated reason — *"out of order the
  tripwire ships red on D4"* — was FALSE and is withdrawn (R2).** There is no mechanical sequencing
  constraint; the sequencing rests on the owner's ruling alone.
- **`0124`'s three-vs-four discrepancy recorded, not resolved** (report Part 7). The vault says *"four
  system prompts"*; the brief and sprint plan say three. Settling it needs the sweep the brief bars.
  `0124`'s folder has only `brief.md` and `review.md` — no `worklog.md` to settle it from. **If the
  vault is the wrong record, only `fkit-wiki` may repair it.**
- **ADR number 036 allocated** after: the skill's Step A conformance check (printed nothing), Step B
  (highest on disk = 035), a prose sweep for in-flight `ADR-036`/`ADR-037` across the whole repo (no
  hits), and `git ls-tree` over all three non-`main` branches plus `origin/main` (highest = 035
  everywhere). `node --test test/adr-number-uniqueness.test.js` → 14 pass.
- **Citation form.** Anchors are headings and quoted phrases; tasks by folder ID (ADR-035, task
  `0160`). Line numbers appear only where the line number **is** the finding — the drift audit and the
  inventory's anchor column — rendered as dated measurements (`@2026-08-02:NNN`) with the quoted phrase
  beside them. The report opens with a section stating this, because a report about citation drift must
  not ship coordinates that rot silently.

## Round 3 — the trigger-(e) ruling round, 2026-08-02

**Narrow, single-purpose round on one thing: the owner ruled round 2's open residual.**

**The ruling** (`AskUserQuestion`, live `fkit-lead` session, 2026-08-02):

> **Add a fifth trigger — a role name beside an ownership verb.**

**Chosen over** broadening trigger (b) to bare skill suffixes. **The owner's ground:** (e) **catches
the shape rather than the vocabulary**, so it also catches a site naming a skill in a form nobody has
thought of yet. **Accepted cost, in the owner's framing:** *"role name near an ownership verb"* is a
**fuzzier predicate than a token match, so it will produce false positives** — which **the registry's
excepted-with-a-reason mechanism is already built to absorb.** Broadening (b) was rejected because
`review`, `status`, `query` and `team` are extremely common English words.

**What changed:**

1. **Trigger (e) specified concretely enough to build**, in **byte-identical wording** (5191 chars,
   diffed programmatically) in **ADR-036 clause 4** and **report §4.1**: role names = basenames of
   `claude/agents/fkit-*.md` **derived from disk at test time** plus their bare forms; ownership verbs
   = a **closed 41-word list**; window = **80 characters on the whitespace-collapsed file**.
2. **Cost measured before the spec shipped.** 89 non-empty live-surface files; **70 trip (e)**;
   **9 trip (e) and none of (a)–(d)**; 2 of those are §1.6's real fact sites, 1 is already §1.5 noise
   → **6 new entries, all 6 false positives.** Registry noise **15 → 21 files**. Affordable, so the
   spec shipped rather than returning `NEEDS-DECISION`.
3. **Both specimens re-checked and confirmed caught** by their load-bearing clause:
   `ai-agents/README.md` gap **10**, `claude/scaffold/AGENTS.md` gap **9**. The second **crosses a hard
   wrap**, which is exactly why the window is measured on whitespace-collapsed text rather than per
   line — a same-line predicate would have missed it.
4. **The residual rewritten** from OPEN-unruled to **ruled + specified + priced**, with a real
   *"re-raise only if"*.
5. **The "clause 4 is not complete" warning was narrowed, not removed** — because (e) does not fully
   close the hole. **Verbless attribution survives**: a role attributed a skill by **possessive or
   apposition alone**, with no verb from the list in the window. **No live-surface site has that shape
   on 2026-08-02**, but the form is constructible.

   > ⚠️ **SUPERSEDED — item 5's factual claim was FALSE and is withdrawn; see Round 4 below.**
   > `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` had exactly that shape, in the live surface,
   > on that date. The narrowing it justified — *"a builder may treat clause 4 as complete for
   > verb-carrying attribution"* — **is withdrawn from ADR-036 entirely**, not annotated. Left in place
   > as the round-3 record.

⛔ **Still investigation only.** No test created, no script/skill/agent edited, **none of the five live
defects repaired**, no brief filed, `0171` untouched, nothing written to `ai-agents/wiki-vault/`, no
commit, no push. The measurement ran from a read-only script in the session scratchpad, outside the
repo. Files changed: ADR-036, the report, `review.md` (*Response — round 2*), this worklog.

## Round 4 — review round 2's fix round (2026-08-02)

Review round 2 returned 🛑 **BLOCKED — 6 defects, 2 high**. The owner ruled a fix round on all six plus
two structural rulings. Response written into `review.md` as **Response — round 3**; *Reviewer findings*
untouched. `/fkit-process-stateful-review` **not run** (coder's skill, ADR-018 hook); method applied by
hand. **Every number below was re-measured this round, 2026-08-02.**

**What was found, and it is the headline: the round-2 "completed" sweep was ALSO incomplete.** It missed
`claude/scaffold/ai-agents/knowledge-base/PROJECT.md`, which attributes `fkit-initiate-project` to the
producer **by possessive alone** — **the exact shape both documents declared had no live instance.**
**This is the second time this artifact reproduced the defect it investigates**, and §0.1 now says so
first and plainly. Registered as **C32**; inventory **38 → 39 rows**, 21 classes, 61 fact-site files.

**Measurements taken this round (all 2026-08-02, read-only script in the session scratchpad):**

| What | Result |
|---|---|
| Clause-5 live surface | **102 paths · 89 non-empty · 13 empty `.gitkeep`**. **Round 2's "88 files" does NOT reproduce and is withdrawn** (R12). Codex's mechanism for it is recorded as **plausible but unproven** — round 2 kept no file list. |
| Trip ≥1 of (a)–(d), bounded (b) | **73 of 89** → **58 fact-site files + 15 noise = 73** ✓ (R13's arithmetic now closes) |
| (b) boundary | bounded **72**, substring **74**; flip file `test/rules-block-budget.test.js`. **Bounded pinned in both documents, byte-identically.** |
| (c) as it stood | **0 files beyond (b) at every window** (same-line → unbounded); **(c) ⊆ (b), a no-op** |
| **(c) re-scoped** — bare skill suffix within 80 chars of a role name | **52 of 89 trip; exactly 1 trips (c) and none of (a),(b),(d),(e)** — and it is **C32**, a genuine fact site. **ZERO false positives, ZERO new noise.** Specimen gap **51**; nearest would-be FP **685**; identical result for every window **51–684** |
| (e) | **70 trip; 9 (e)-only**; specimen gaps **10** and **9** — all unchanged and reproducing. Cost re-states **6 → 7** files, noise **15 → 22**, an accounting knock-on of R11, **not** a re-pricing |
| All five triggers | **83 of 89**; the **6** untripped were opened and read — **none attributes a skill to a role** |
| Possessive/appositive re-sweep | **282 instances across 49 files**; all already registered **except C32**. **Nothing beyond R8.** |
| D4 checklist duplication | `diff claude/skills-for-role.sh@:12-23` vs `claude/fkit-claude.sh@:239-250` → **no output. Byte-identical.** |
| Shared spec block parity | report §4.1 vs ADR-036 clause 4 → **12 670 chars, identical** |
| Bare token | **101**; live-surface subset **10** — both unmoved (R7 holds) |

**Structural rulings applied.** (1) **(c) re-scoped** with its own vocabulary, window and measured price,
in the same shape (e) got — and **verified to catch C32**. (2) **ADR-036's licence sentence re-opened,
not annotated**: *"a builder may treat clause 4 as complete for verb-carrying attribution"* is
**withdrawn entirely**, along with the false *"No live-surface site has that shape"* it rested on. The
ADR now says, with **no exception clause**, *whoever builds A-i must NOT treat clause 4 as complete*.

**The D4 sequencing note now carries NO mechanism.** Two were asserted in two revisions and both were
false. Both are quoted and withdrawn; the sequencing rests on the owner's verbatim ruling alone. Repair
scope widened to **`claude/fkit-claude.sh`**; §1.2's A3 row and §1.3's Tier-A *"cannot drift"* claim
corrected.

⛔ **Still investigation only.** No test created; **no edit to `claude/skills-for-role.sh`,
`claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, any skill or agent definition**; **no live defect
repaired**; no brief filed; `0171` untouched; nothing written to `ai-agents/wiki-vault/`; no commit, no
push. Files changed: the report, ADR-036, `review.md` (*Response — round 3*), `plan.md`, this worklog.

## Follow-ups NAMED (not filed — the producer files at close)

1. **Repair the FIVE live defects** (report Part 3: D1 `scaffold/CLAUDE.md` producer row missing
   `/fkit-task-brief`; D2 `architecture.md`'s *"Only `fkit-query` carries no banner"*; D3
   `architecture.md`'s dead `skills-for-role.sh:35`; D4 the FOUR-vs-five-and-six mirror count;
   **D5 root `CLAUDE.md`'s *"invisible"***). **Sequenced first, on the owner's ruling, and on NO
   mechanism — two mechanical justifications were asserted and both proved false.** **⚠️ D4's repair
   must touch TWO files:** the checklist is byte-identical in `claude/skills-for-role.sh` **and**
   `claude/fkit-claude.sh`, and ADR-036 clause 2's demotion is widened to name both.
2. **Build A-i** per ADR-036 — `test/skill-ownership-sites.mjs` + the completeness tripwire + the
   checklist demotion **in both files**. Owner: fkit-coder. **Scope from the registry it builds, not
   from a count in the report.** **Build FIVE working triggers**, apply the **token-boundary rule** to
   (b), (c) and (e), and register the **7** additional non-fact hits (e) surfaces — day-one noise **22**
   files; the re-scoped (c) surfaces none. **⚠️ Clause 4 is NOT complete, for any shape — the ADR
   grants no completeness licence and the earlier one is withdrawn.**

Recorded but not recommended for filing now: **A-ii** (deferred by ruling); and a re-scope to settle
the three-vs-four record if the owner wants it. **The bare-suffix trigger hole is no longer on this
list — it was ruled on 2026-08-02 and folded into A-i's scope as trigger (e).**

**Input to an already-open task:** the report's **§0** citation form goes to task **`0171`**
(`durable-citation-anchors`) as an input — owner-ruled 2026-08-02. **Named only; `0171`'s brief is the
producer's file and was not edited.**

## Recommendation to the wiki role

ADR-036 and the report belong in the vault once the follow-ups are on the board. **fkit-wiki should
ingest them** — I do not write `ai-agents/wiki-vault/`.

## Round 5 — review round 3's fix round, and the close (2026-08-02)

Review round 3 returned ⚠️ *Changes requested* on **one** confirmed defect (**R14**, medium, not
blocking) plus **R15** (low). **The round CONVERGED** — the reviewer's words: *"Round 3 found none — the
first round the inventory survived the attack that broke it twice."* **No fourth review round; the
reviewer said so explicitly.** Owner ruling relayed by the driver: **apply R14, accept R15 as a
residual and do not fix it.**

**R14 applied — four sentences, no substance change.** Three figures in normative text were measured
against **(c) as it used to stand** and carried no qualifier. Re-measured this round, 2026-08-02, from a
read-only script in the session scratchpad (five triggers reimplemented from the pinned spec block;
clause-5 surface enumerated from scratch → **102 paths · 89 non-empty · 13 empty `.gitkeep`**):

- **(a)–(d) bounded = 76, not 73**; **substring = 77, not 74**.
- **(e)-only = 7, not 9.**
- The three files the re-scoped (c) pulls in: `claude/scaffold/AGENTS.md` (gap **14**),
  `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` (gap **51**),
  `claude/scaffold/ai-agents/wiki-vault/schema.md` (gap **9**). **Every R14 figure reproduced exactly.**

The four sentences: §4.1's shared block (the 73/74 sentence; the *"9 trip (e) and none of (a)–(d)"*
sentence), §1.5's sweep line, and **§1.6's C32 row closing *"It trips none of (a)–(e)"*** — the sharpest
of the four, because the (c) re-scope exists to falsify exactly that sentence and a reader hitting it
learned the opposite of the fix. Each reuses the qualifier the report **already applied correctly in
three other places** rather than inventing a form. **Applied identically in ADR-036**; the shared block
re-verified **byte-identical** — `diff` → no output, **13 869 characters / 14 020 UTF-8 bytes**.

**Every total closes on both bases and nothing a builder acts on moved:** 61 fact-site files, 22
declared non-fact hits (15 + 7 on the old basis, 16 + 6 on the current one), 83 of 89 triggered, 39 rows
across 21 classes.

**Severity dissent recorded, not just the verdict.** Codex assigned R14 **HIGH**; the reviewer assigned
**MEDIUM and owns that severity** — the registry, both trigger prices and the no-licence rule are all
correct and all reproduce, and only bucket-attribution between (c) and (e) shifts. My own re-measurement
agrees with every figure behind that call.

**R15 accepted as a residual, not fixed.** The appendix's *"282 instances across 49 files"* does not
reproduce — the reviewer's and Codex's separately-written implementations **both** returned **291 across
50**, the extra file being `claude/fkit-claude.sh`, **already registered as A3**. The conclusion is
confirmed twice over. The figure is left as the dated measurement it is and the non-reproduction is
**disclosed in place** in the appendix. It is low **precisely because the report already refuses to lean
on that sweep** — and R15 has made that refusal **load-bearing rather than rhetorical**, which is now
said in the report.

**The ledger is closed out.** Terminal status **`closed-out`**, final verdict **✅ ACCEPTED**, five
accepted residuals recorded with falsifiable *"re-raise only if"* conditions (R15; R12's cause as
**UNKNOWN**, Codex's mechanism plausible-but-unproven and deliberately not adopted; residual 2's
proxy-measurement stance; C32's out-of-sequence numbering; and the five live defects unrepaired by
design, with **D4's repair now requiring TWO files**). **Codex coverage was FULL on all three review
rounds.**

⛔ **Still investigation only.** No test created; **no edit to `claude/skills-for-role.sh`,
`claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, any skill or agent definition**; **no live defect
repaired**; no brief filed; `0171` untouched; nothing written to `ai-agents/wiki-vault/`; no commit, no
push. Files changed: the report, ADR-036, `review.md` (*Response — round 4*, *Closeout*, *Accepted
residuals*), `plan.md`, this worklog.
