# Repair the five live ownership-fact defects found by `0142` (D1–D5)

## ID
0188

## Sprint
Sprint 6

## Priority
Sprint 6 P16

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Follow-up 1 of `0142`'s decision report**, Part 8 —
[`2026-08-02-skill-ownership-fact-inventory-gap.md`](../../../knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md),
Part 3 for the defects themselves. `0142` was **report-only by its own brief's verification step 5**, so
it found these and deliberately left every one of them live. They are all **wrong content at sites that
are, or should be, on the ownership-fact inventory**, and **none was previously recorded anywhere**.

**Why this ships BEFORE the registry build (`0189`).**

> **Owner ruling, carried verbatim: *"do not let the build quietly repair its own corpus."***

A build task that fixes its own inputs demonstrates nothing about the guard — the guard is green either
way, so only a clean corpus at guard time tells you the registry was built against reality rather than
against a tidy-up.

> ### ⚠️ There is NO mechanical sequencing constraint, and this brief carries no mechanism
>
> Do not re-derive one. Report §D4 records that **two successive mechanical justifications for this
> ordering were asserted, found false, and withdrawn** — *"out of order the guard ships red on its first
> run"* (round 1) and *"clause 2 deletes the `FOUR`, so the build resolves D4 itself"* (round 2). Both
> were plausible, both were asserted rather than measured, and both survived a careful author and a
> review round. **The sequencing rests on the owner's ruling above and on nothing else.**

**The report's own methodological finding, and it is why none of these five is a "just grep it" fix.**
`0142`'s first banner audit was `grep -q "⛔ Owner:"` over every `claude/skills/*/SKILL.md`. It reported
**exactly one** missing banner. It was wrong — `fkit-team/SKILL.md` also has none, but contains prose
*describing* the banner, and **prose about a marker satisfied the grep for the marker**. It was caught
by reading the file, not by refining the pattern. Expect the same of every repair below: **open the
file.**

## What to build

Five repairs. Each is a prose/doc correction — **no behaviour change, no source logic, no new test**
(the test is `0189`).

### D1 — `claude/scaffold/CLAUDE.md`: the producer's row omits `/fkit-task-brief`

The role table's producer row lists *"`/fkit-initiate-project`, `/fkit-status`, `/fkit-task-done`,
`/fkit-task-cancelled`"*. `skills_for_role(producer)` in `claude/skills-for-role.sh` **also includes
`fkit-task-brief`**.

> ⚠️ **Dated correction 2026-08-23 — D1 is DISCHARGED, and the repair instruction below it must NOT
> be executed.** The claim above, and the rest of this D1 section, are **left byte-identical** as the
> record of what `0142` found. Verified against live code 2026-08-23: the producer row in
> `claude/scaffold/CLAUDE.md` now reads
> `` `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal` ``
> — the omission is gone. It was closed on **2026-08-23** by task
> `0250` (`0250-fix-the-scaffold-producer-row-fkit-task-brief-omission`).
>
> **DO NOT "repair against `skills_for_role()`".** The two carriers order the list differently, and
> that is deliberate. The `producer)` branch of `skills_for_role()` in `claude/skills-for-role.sh`
> returns `/fkit-task-brief` **second** among the producer's role-specific skills. The scaffold row
> puts it **third, after `/fkit-status`** — `0250`'s reasoned choice, recorded in its `plan.md` §1d,
> made because **this brief's own positional instruction was self-inconsistent**, and chosen because it
> keeps the scaffold row **character-for-character identical in ordering** to its twin, the producer
> row in `claude/skills/fkit-team/SKILL.md`. That twin match was **re-verified 2026-08-23** and holds.
> **Reordering the scaffold row into `skills_for_role()` order would undo that deliberate choice and
> re-break the twin match — while reporting success.** That is the regression this note exists to
> prevent.
>
> **D1 is one of five, and discharging it does not discharge this task.** It stays `🔲 Backlog` at
> **P14** on Sprint 6 with **D2–D5 live** — and **D2 still edits `claude/scaffold/CLAUDE.md`**, so this
> remains a manifest-regen task.
>
> **Authority:** task `0324` (`0324-record-that-0250-discharged-0188s-d1-and-warn-off-the-reordering`),
> on the owner ruling of **2026-08-23**, verbatim option label *"Apply the correction now
> (Recommended)"*. Written by a spawned `fkit-producer` with no owner channel.

**Severity: highest of the five.** This is a **declared mirror** and it **ships into every consuming
project's root `CLAUDE.md`**. It is the same failure mode, in the same file, as the incident the
checklist's own warning block narrates: *"Task 70 followed the two-item list precisely and still shipped
a false statement into every consuming project."*

Repair against `skills_for_role()` as it reads at implementation time — that function is the single
source of truth (ADR-012 §1, unchanged by ADR-036 clause 1).

### D2 — `architecture.md` §4.2 says one skill lacks an owner banner; two do

Quoted: *"Only `fkit-query` carries no banner — it is universal by design."*

Measured 2026-08-02: **`fkit-query/SKILL.md` and `fkit-team/SKILL.md` both lack a `⛔ Owner:` banner**
— 23 of 25 skills carry one. The design intent is plainly the same for both (they are the two universal
skills), but the doc names one and there are two.

**Two further sentences share the same error** and are in scope: `claude/skills/fkit-team/SKILL.md` and
`claude/scaffold/CLAUDE.md` each assert the banner sits *"at the top of every skill"* / *"on each
skill"*. Both are false for the same two files.

> **The choice between the two repairs is YOURS to make and to state — `0142` deliberately left it
> open.** Either add two banners (making the sentences true) or correct three sentences (making the docs
> true). Both are legitimate; pick one, apply it consistently across all three sentences, and say in the
> worklog which you chose and why. **Do not do half of each.**

### D3 — `architecture.md` §4.2 cites a dead line for the source of truth

Quoted: *"Ownership is declared in exactly one place: `skills_for_role()` at
`claude/skills-for-role.sh:35`."* Measured 2026-08-02: `skills_for_role()` is at line **48**; line 35 is
inside the ADR-033 comment block. **Re-measure at implementation time — this coordinate decays**, which
is the whole point of the defect.

### D4 — the mirror checklist says **FOUR**; there are five, and a sixth

`claude/skills-for-role.sh` says *"FOUR hand-maintained places MIRROR this list … If you add a fifth
mirror, add it HERE FIRST"*. `test/skill-ownership-hook.test.js` says of itself *"OWNED is a maintained
MIRROR of `skills_for_role()`"* — that is the fifth. `0142` found a sixth: `claude/fkit-claude-init.sh`.
**The count is not off by one; it is off by at least two.**

> ### ⚠️ D4's repair MUST touch TWO files, not one
>
> The 12-line FOUR-mirror block exists **twice, byte-identically** —
> `claude/skills-for-role.sh@2026-08-02:12-23` and `claude/fkit-claude.sh@2026-08-02:239-250`; `diff`
> over the two ranges returned **no output** on 2026-08-02. **Neither copy points at the other and
> nothing tests that they agree.** Repairing only the first leaves the false `FOUR` live in the second.
> Re-run the `diff` at implementation time before assuming they are still identical.

**A scoping note, explicitly NOT a sequencing argument:** ADR-036 clause 2 later demotes **both** copies
of this checklist to a pointer at the registry (`0189`). Whether that makes D4's correction short-lived
is an implementation observation and **must not be re-read as a reason to skip it or to reorder the two
tasks** — see the withdrawn-mechanism warning in `## Context`.

### D5 — root `CLAUDE.md` says foreign skills are *"invisible"*; they are visible-but-blocked

`CLAUDE.md` §*"The fkit team in this repo (dogfooded)"* — *"every other fkit skill is turned off,
**invisible** and unrunnable"*.

**Four live docs say the opposite, and an ADR records it as an accepted cost:**
`claude/skills/fkit-team/SKILL.md` (*"**Visible-but-blocked, not invisible-and-blocked**"*),
`claude/README.md`, `ai-agents/knowledge-base/architecture.md`, `claude/scaffold/CLAUDE.md` — and
**ADR-018 §Decision 5**, which records the visibility regression as a **knowingly accepted cost**
(*"non-owned skills become visible"*).

**Severity: on a par with D1.** It sits in the **repo-root `CLAUDE.md`**, which is in every session's
context on every turn. `0142` quoted this same file from prose thirteen lines below the false sentence
and did not notice.

### Also look at — no defect asserted, and do not manufacture one

- **`ai-agents/knowledge-base/PROJECT.md`** says *"every other `/fkit-*` skill is **turned off**"* —
  weaker than *"invisible"* and arguably only imprecise. `0142` explicitly **does not assert this is
  false**. Look at it; correct it only if you can show it is wrong.
- **`ai-agents/README.md`** and **`ai-agents/tasks/README.md`** state the mover rule **without** the
  producer-only clause (ADR-033). **Incomplete, not false.** Judge whether completing them is in scope
  and say either way.

## Verification steps

1. **D1** — the producer row in `claude/scaffold/CLAUDE.md` lists exactly the skills
   `skills_for_role(producer)` returns, compared **against the live function output**, not against
   memory. Show the comparison.

   > ⚠️ **Dated correction 2026-08-23 — D1 is discharged; this step now passes with no work done.**
   > The step above is **left byte-identical**. Verified against live code 2026-08-23: the producer row
   > in `claude/scaffold/CLAUDE.md` already lists `/fkit-task-brief`, closed by `0250` on 2026-08-23.
   > **DO NOT satisfy this step by reordering the row.** `skills_for_role()` returns
   > `/fkit-task-brief` **second**; the scaffold row deliberately puts it **third, after
   > `/fkit-status`** — `0250`'s reasoned choice (its `plan.md` §1d), made because D1's own positional
   > instruction was self-inconsistent, and it makes the scaffold row **character-for-character
   > identical in ordering** to its twin producer row in `claude/skills/fkit-team/SKILL.md` (re-verified
   > 2026-08-23). **Reordering would undo that choice and re-break the twin match.** The two orderings
   > are a known, accepted difference — not a defect to repair here. D1 is one of five; **D2–D5 stay
   > live**, and this task stays `🔲 Backlog`. Authority: task `0324`, owner ruling **2026-08-23**,
   > verbatim option label *"Apply the correction now (Recommended)"*. See the fuller note under the
   > `### D1` heading above.

2. **D2** — every skill lacking a `⛔ Owner:` banner is enumerated by **opening each
   `claude/skills/*/SKILL.md`**, not by grep alone (the grep is known to be wrong here). The chosen
   repair is applied to **all three** sentences (`architecture.md`, `fkit-team/SKILL.md`,
   `claude/scaffold/CLAUDE.md`) or, if banners were added instead, all three sentences are re-checked
   and now read true.
3. **D3** — the line number cited in `architecture.md` resolves to the `skills_for_role()` declaration
   in the tree as it stands at implementation time.
4. **D4** — the corrected mirror statement is present in **both** `claude/skills-for-role.sh` and
   `claude/fkit-claude.sh`, and a `diff` of the two blocks after the edit shows they still agree (or the
   worklog states plainly why they intentionally no longer do). Every mirror named in the corrected
   count is verified to exist on disk.
5. **D5** — root `CLAUDE.md` no longer asserts foreign skills are invisible, and its wording does not
   contradict any of the four live docs or ADR-018 §Decision 5. **`ADR-018` itself is NOT edited** — it
   is a dated record.
6. **Nothing in `ai-agents/wiki-vault/` is written** (ADR-005), and **no ADR prose is edited**.
7. The full test suite passes; **no new devDependency** (ADR-014).
8. The worklog states, for each of D1–D5, the coordinate as re-measured at implementation time — several
   of the coordinates above are **dated measurements from 2026-08-02** and are expected to move.

## Notes

- **📌 DATED NOTE 2026-08-15 (`0306`) — the quoted *"Task 70"* in `## Context` means `0008`, not
  `0070`, and the quotation is DELIBERATELY LEFT byte-identical.** `0306` swept stale pre-ADR-029 task
  numerals out of the open briefs. This site is a **verbatim quotation** of the warning block in
  `claude/skills-for-role.sh`, so it is never edited to make it accurate — the key goes beside it:
  - **`Task 70` = `ai-agents/tasks/done/0008-add-open-questions-interview-skill-for-six-roles/`**
    (pre-migration `task NN` is the brief's old `## Priority` value; `0008` carries Priority 70).
  - ⛔ **It is NOT `0070-relax-tool-allowlists-except-adversarial-reviewer`**, which the bare numeral
    lands on by coincidence. Evidence: the quoted incident is a **skill-mirror** failure —
    `scaffold/CLAUDE.md` asserting the lead had "only two skills" once that stopped being true — and
    `0008` is what added a skill to the lead. `0070`'s own brief rules the skill mirrors out of its
    scope in terms (*"No `skills-for-role.sh` diff and no `fkit-team` / `README.md` mirror-table
    diff"*), so it cannot be the task that followed the mirror checklist and shipped the false count.
  - ⚠️ **This overrides `0306`'s own brief**, which listed `task 70` as a verified-correct
    counter-example. Overridden by **owner ruling at `0306`'s plan gate, 2026-08-15**, on this
    evidence.
- **Depends on:** nothing.
- **Blocks:** 0189 — by owner ruling, not by any mechanism. See `## Context`.
- **Owner:** fkit-coder.
- **Source:** report Part 3 (the defects) and Part 8 follow-up 1 (the ordering and D4's two-file scope);
  ADR-036 clause 2 (the later demotion of both checklist copies).
- **`0142` scored A-i against these five and the answer was NO on all five** (report Part 6, row 6):
  every one is *wrong prose at a registered site*, which the tripwire does not look at. **Building
  `0189` would never have surfaced them, and will never surface the next five.** That is `0137`'s
  territory, not the registry's.
- ⚠️ **Priority 166 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below 0158**, at the top of the contiguous run of open rows, because
  five live falsehoods sit in documents agents read on every turn — root `CLAUDE.md` (D5),
  `claude/scaffold/CLAUDE.md` which ships into **every consuming project** (D1, and the D2 sentence), and
  `architecture.md` (D2, D3). Every day they stay, agents reason from them. **Append rank and merit
  diverge here by roughly 43 open rows, and the divergence is stated rather than acted on: this brief was
  filed by a spawned producer with no owner channel, which never re-ranks** (ADR-035, `/fkit-task-brief`
  step 5).
- **No commit** — the brief is left in the working tree.
