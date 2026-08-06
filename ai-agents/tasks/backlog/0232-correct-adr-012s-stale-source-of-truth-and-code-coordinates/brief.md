# Correct ADR-012's stale source-of-truth claim — and every other stale coordinate in the file

## ID
0232

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Filed on a named owner ruling** taken via `AskUserQuestion` in a live `fkit lead` session on
**2026-08-06**, verbatim: ***"File both now."***

[ADR-012](../../../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)
tells its readers where the **single source of truth** for role→skill ownership lives. It names
`claude/fkit-claude.sh`. **That is wrong today** — `skills_for_role()` lives in
`claude/skills-for-role.sh`, and has since the split. ADR-012's §Decision 1 sentence
*"`skills_for_role()` in … remains the **single source of truth**, and now the *only* place role→skill
ownership is expressed"* therefore points readers at a file that does not contain it.

### ⛔ THIS TASK IS NOT ABOUT ONE LINE. SCOPING IT TO ONE LINE IS THE FAILURE MODE IT EXISTS TO AVOID.

The source report that raised this named **one** coordinate — the §Decision 1 source-of-truth cite. A
producer measured ADR-012 first-hand on **2026-08-06** and found the file carries **far more than
one**. A repair scoped to the named line would leave every other wrong pointer standing, and the next
reader would land on a `curl` call inside an unrelated helper.

> ### ⚠️ RE-MEASURE EVERY ROW BELOW YOURSELF. DO NOT INHERIT THIS TABLE.
>
> This inventory was measured on **2026-08-06** against a tree with concurrent untracked work in it.
> **It is a dated measurement, not a specification.** Line numbers in `claude/` move constantly — the
> whole reason this task exists. If a row here no longer reproduces, **say so and correct the row**;
> do not write around it, and do not repair a coordinate you have not re-verified this run.
>
> A previous, narrower list of this same defect named **six** lines. The producer's own pass found
> **seven** lines in `claude/fkit-claude.sh` alone, plus three other classes it missed entirely.
> Assume this list is also incomplete and sweep the whole file.

### The measured inventory (2026-08-06 — re-verify)

Coordinates are given in the durable `path@YYYY-MM-DD:NNN` form settled by
[`0160`](../../done/0160-decide-the-durable-citation-form-for-mutable-coordinates/brief.md) — a line
number stamped with the day it was read. **Locate each site in ADR-012 by its heading and its quoted
phrase, never by a bare line number**, per `0160`/`0176`.

**Class 1 — cites `claude/fkit-claude.sh` for `skills_for_role()`. WRONG FILE, not merely a wrong
line.** `skills_for_role()` is at `claude/skills-for-role.sh@2026-08-06:48-59`. Three sites:

| Site (heading + quoted phrase) | Cited as | Measured 2026-08-06 |
|---|---|---|
| **§The live bug this exposes** — *"But `skills_for_role producer` … does not include that skill"* | `claude/fkit-claude.sh:95` | the `producer` case is `claude/skills-for-role.sh@2026-08-06:51`. `claude/fkit-claude.sh@2026-08-06:95` is a `curl` line inside `_fkit_remote_version()`. |
| **§The live bug this exposes** — *"Symmetrically, a `lead` session grants only `fkit-team fkit-query`"* | `claude/fkit-claude.sh:94` | the `lead` case is `claude/skills-for-role.sh@2026-08-06:50`. ⚠️ **See Class 4 — the claim itself is also false now.** |
| **§Decision 1** — *"remains the **single source of truth**, and now the *only* place role→skill ownership is expressed"* | `claude/fkit-claude.sh:92-103` | `claude/skills-for-role.sh@2026-08-06:48-59`. `claude/fkit-claude.sh@2026-08-06:92-103` is `_fkit_remote_version()` + `_fkit_reinstall()`. |
| **§Related** — *"Source of truth:"* bullet | `claude/fkit-claude.sh:92-103` | same as above. |
| **§Related** — *"The live bug:"* bullet, `(skills_for_role producer)` | `claude/fkit-claude.sh:95` | same as row 1. |

**Class 2 — cites `claude/fkit-claude.sh` for `build_settings()`. RIGHT file, WRONG lines.**
`build_settings()` is at `claude/fkit-claude.sh@2026-08-06:272`. **This class is the reason the scope
was widened**: it is stale even though the function never left the file, so a repair that only chases
"the function moved house" misses it.

| Site (heading + quoted phrase) | Cited as | Measured 2026-08-06 |
|---|---|---|
| **§The live bug this exposes** — *"so `build_settings()` … writes it **`"off"`** into `producer.json`"* | `claude/fkit-claude.sh:108-120` | `@2026-08-06:272`. `:108-120` today is the `fkit update` case block. |
| **§Decision 2**, first sub-bullet — *"is correctly generated and applied (…, verified)"* | `claude/fkit-claude.sh:108-120` | same. |
| **§Related** — *"The live bug:"* bullet, `(build_settings)` | `claude/fkit-claude.sh:108-120` | same. |

> That is **8 stale `claude/fkit-claude.sh` citations across 7 lines** of ADR-012 in Classes 1 and 2
> together. **Re-count it yourself — inherit no number.**

**Class 3 — stale coordinates into other `claude/` files.** Same defect, different targets. The
narrower list missed this class entirely.

| Site (heading + quoted phrase) | Cited as | Measured 2026-08-06 |
|---|---|---|
| **§The live bug this exposes**, opening sentence — *"has the **producer** spawn the architect and ask it to run `fkit-survey-project`"*; repeated in **§Related**'s *"The live bug:"* bullet | `claude/skills/fkit-initiate-project/SKILL.md:77-81` | drifted. `@2026-08-06:77-81` is the tail of Step 2 plus the `## Step 3` heading; the *"Invoke the **fkit-architect** agent"* sentence starts at `@2026-08-06:81`. **The claim is still true — only the pointer is off.** |
| **§Decision 2**, third sub-bullet — *"two docs currently overclaim and MUST be corrected"*; repeated in **§Consequences** and **§Related**'s *"Docs to correct:"* bullet | `claude/skills/fkit-team/SKILL.md:38` | `@2026-08-06:38` is a consult-hops bullet. ⚠️ **See Class 4 — the demanded correction has already landed.** |
| same three sites | `claude/scaffold/CLAUDE.md:33` | `@2026-08-06:33` is the producer-movers paragraph. ⚠️ **See Class 4 — `grep -n 'unrunnable\|invisible\|non-owned' claude/scaffold/CLAUDE.md` returned NOTHING on 2026-08-06. The cited text is not in the file at all.** |

**Class 4 — ⚠️ NOT coordinate drift. Three claims in ADR-012 appear to be FALSE ON THEIR FACTS
today.** These are a different kind of defect and need a different kind of note. **Verify each before
writing anything about it** — if a claim turns out still true, say so and leave it.

1. **§The live bug this exposes** — *"a `lead` session grants only `fkit-team fkit-query` … so every
   role consulted from the team room gets **zero procedures**."* Measured 2026-08-06, the `lead` case
   in `claude/skills-for-role.sh@2026-08-06:50` grants **five** skills, not two. The *"only
   `fkit-team fkit-query`"* clause is false as a present-tense statement.
2. **§Decision 2** — *"two docs currently overclaim and MUST be corrected … both say non-owned skills
   are `"invisible and unrunnable."`"* Measured 2026-08-06,
   `claude/skills/fkit-team/SKILL.md@2026-08-06:47-48` now reads *"remains **unrunnable** … Visible-but-
   blocked, not invisible-and-blocked"* — **the correction ADR-012 demanded has landed**, so the
   directive reads as outstanding when it is satisfied. And in `claude/scaffold/CLAUDE.md` the quoted
   wording is **absent entirely**. **Determine, and state, whether each demand is satisfied or the
   passage was removed** — those are different outcomes and the note must not blur them.
3. **The stale self-citation.** ADR-012's own header banner says ADR-018 reopens Decisions 3 and 4
   because *"their own pre-registered re-raise trigger, `adr-012:139-141`, is met"*. Measured
   2026-08-06, the re-raise clause is under **§Consequences**, *"Residual risks / `re-raise only if`"*,
   at `@2026-08-06:146-161`; `@2026-08-06:139-141` is a Consequences bullet about the consult path
   being advisory. **An ADR whose citation of itself is stale is the sharpest example of the defect**
   — do not skip it as trivial.

**Class 5 — cross-document `adr-0NN:NNN` citations.** ADR-012 cites **ADR-010** by line in at least
six places — under §Context (*"supersedes §Decision 2"* / *"§Decision 5"*, and the *"must be
**generated from it or dropped**"* quote), §Honest note (*"materially change what is enforceable"*),
§Decision 2 (*"already-conceded prompt-enforced consult topology"*), §Decision 3's deferral bullet,
and §Related. **ADR-010 grew** when [`0143`](../../done/0143-append-a-dated-correction-note-to-adr-010/brief.md)
appended dated correction blocks to it, so every one of these is a candidate for shift. **Measure them;
do not assume they are all wrong and do not assume any is right.**

> ⚠️ **Scope boundary against [`0197`](../0197-resolve-adr-010s-remaining-stale-code-line-ranges/brief.md).**
> `0197` resolves **ADR-010's own citations of code**. This task resolves **ADR-012's citations**,
> including its citations *into* ADR-010. **They do not overlap and neither waits for the other.** Do
> not edit ADR-010 from this task.

## What to build

**One appended, dated correction note per site-group in
`ai-agents/knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md`.
No code change. No test. No ADR rewrite.**

1. **Re-measure first, write second.** Reproduce every row of the inventory above against the tree you
   have. Produce your own table of what is stale and what is not, with today's date on it. **Report any
   row that no longer holds rather than repairing around it.**

2. **Follow the dated-correction-note form** established by
   [`0143`](../../done/0143-append-a-dated-correction-note-to-adr-010/brief.md) and extended by
   [`0195`](../../done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/brief.md). Its rules,
   as they apply here:
   - **The original wording stays byte-identical.** Nothing is deleted, nothing is silently rewritten.
     The cited coordinate is the record of what was cited when the ADR was written.
   - **Notes go BELOW the claim they correct**, never above it and never in a footer. This is `0143`'s
     recorded residual `R1-placement` — **settled, do not re-litigate**.
   - **`⚠️` for a drifted fact** (the decision is unaffected); **`⛔` for a reversal** (do not follow the
     text above). On the evidence measured so far this task is **all ⚠️ and no ⛔** — ADR-012's
     *decisions* are unaffected; it is the pointers and three factual asides that went stale. **If you
     find an actual reversal, mark it ⛔ and say why.**
   - **Each note carries its date, what is false, what is true instead, and the cause.**
   - **Status stays `accepted`.** Do not touch the header's `Status:` field.

3. **Group the notes; do not write sixteen of them.** One note per §heading is the right granularity —
   a reader arriving at §The live bug needs one block telling them all four of its coordinates moved,
   not four blocks. **Use judgment, and say what grouping you chose and why.**

4. **Class 4 gets its own treatment.** A pointer that moved and a claim that is false are different
   defects. Say plainly which is which. For the *"MUST be corrected"* directive, state whether the
   demand is **satisfied**, **moot** (the passage is gone), or **still outstanding** — one of those
   three, per file, with the evidence.

5. **Give the current coordinates in `path@YYYY-MM-DD:NNN` form**, so the replacement pointer carries
   the date it was true. That is `0160`'s durable form and the whole point of the exercise: a bare
   `:NNN` written today is the next stale citation.

6. **APPEND ONLY.** Prove it mechanically, not by eye: `git diff --numstat` must show `+N / −0` for the
   ADR, and `git diff -U0 -- <the ADR> | grep '^-'` must return nothing but the `---` file header.

> **Related open task, NOT a dependency:**
> [`0198`](../0198-teach-record-decision-the-dated-correction-note-form/brief.md) — *"teach
> `/fkit-record-decision` the dated-correction-note form"*. If `0198` has landed by the time this runs,
> **follow the form as the skill states it** and say so. If it has not, follow `0143`/`0195` as above.
> **Do not wait for it, and do not implement any part of it here.**

**⛔ Out of scope, by name:**
- Any edit to `claude/` — no code, no skill, no scaffold, no launcher. **This task repairs a document's
  pointers; it does not repair the things pointed at.** Class 4's findings about
  `claude/scaffold/CLAUDE.md` and `claude/skills/fkit-team/SKILL.md` are **recorded, not fixed**, here.
- Any edit to ADR-010 (`0197`'s and `0196`'s territory) or to any other ADR.
- Reopening ADR-012's decisions, or ADR-018 / ADR-036 / ADR-037.
- Any `ai-agents/wiki-vault/` write — **ADR-005: reads only, `fkit-wiki` is the sole writer.** ⚠️ ADR-012
  has a wiki page; **it will need a re-sync after this lands** — file that as a follow-up if it is not
  already covered, do **not** write the vault yourself.
- Any commit, any push, any re-rank, any task-file move.

## Verification steps

1. `git diff --numstat -- ai-agents/knowledge-base/decisions/adr-012-*.md` shows **`+N	0`** — zero
   deleted lines. `git diff -U0 -- ai-agents/knowledge-base/decisions/adr-012-*.md | grep '^-' | grep -v '^---'`
   returns **nothing**.
2. **Every stale coordinate your own re-measurement found now has a note below it.** Re-run your
   measurement against the edited file and show it comes back clean — a leftover uncorrected pointer
   **fails this step**, and "the source report only named one" is not a defence.
3. `grep -c "claude/skills-for-role.sh" ai-agents/knowledge-base/decisions/adr-012-*.md` returns a
   non-zero count, and the §Decision 1 source-of-truth claim has a note naming that file.
4. **The `build_settings()` sites are corrected too** — a note exists for them stating the function is
   still in `claude/fkit-claude.sh` and only the line range moved. Correcting only the moved-file class
   **fails this step**.
5. The three Class 4 factual claims each carry a note that says *false today* (or *still true,
   verified*), separately from the coordinate notes.
6. `grep -n "Status" ai-agents/knowledge-base/decisions/adr-012-*.md | head -1` still shows
   `accepted` — unchanged.
7. Every replacement coordinate in the new notes uses the `path@YYYY-MM-DD:NNN` form.
   `grep -nE '\((claude|test)/[^)]*:[0-9]+' <the new notes>` finds no undated bare coordinate.
8. `git status --porcelain` shows **only** the ADR file and this task's folder — **nothing** under
   `claude/`, `test/`, `ai-agents/tasks/done/`, or `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing. Every coordinate is measurable on today's tree.
- **Blocks:** nothing.
- **Related, not blocking:** `0198` (the note form as a skill step), `0197` and `0196` (the same repair
  on ADR-010), `0199` (the vault re-sync after ADR-010's notes — this task will want its own equivalent).
- **⚠️ NOT dependent on ADR-038 / `0222`.** Recorded explicitly because this task sits near `0222`'s
  follow-up cluster on the board and near `0222`'s own ⚠️ note about ADR-012's stale path. **It shares a
  subject with that note; it does not share a dependency.** This repair stands whether or not ADR-038 is
  ever written.
- **⚠️ This brief decays.** Every coordinate in it was read on **2026-08-06** from a tree with concurrent
  untracked work. **The inventory is evidence that the defect is wide, not a checklist to execute.**
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board on the owner's ruling; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
