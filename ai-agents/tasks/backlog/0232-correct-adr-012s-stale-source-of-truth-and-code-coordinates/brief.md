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

   - ✅ **DATED CORRECTION 2026-08-15 — CLASS 4 ITEM 3 IS ALREADY REPAIRED BY `0171`. The item above
     is left byte-identical and is no longer work.** The header banner no longer contains
     `adr-012:139-141`; `0171` replaced it with an anchor-phrase cite. Scope of that claim: a
     `grep -nE 'adr-0[0-9]{2}:[0-9]'` over the **whole** ADR-012 file in the **working tree** returns
     **no matches (exit 1)**. ⛔ **Do not write a note for this item.** Full measurement, and the
     caveat that `0171` is uncommitted, in the master correction at the end of `## Notes`.

**Class 5 — cross-document `adr-0NN:NNN` citations.** ADR-012 cites **ADR-010** by line in at least
six places — under §Context (*"supersedes §Decision 2"* / *"§Decision 5"*, and the *"must be
**generated from it or dropped**"* quote), §Honest note (*"materially change what is enforceable"*),
§Decision 2 (*"already-conceded prompt-enforced consult topology"*), §Decision 3's deferral bullet,
and §Related. **ADR-010 grew** when [`0143`](../../done/0143-append-a-dated-correction-note-to-adr-010/brief.md)
appended dated correction blocks to it, so every one of these is a candidate for shift. **Measure them;
do not assume they are all wrong and do not assume any is right.**

- ✅ **DATED CORRECTION 2026-08-15 — CLASS 5 IS ALREADY REPAIRED, IN FULL, BY `0171`. The paragraph
  above is left byte-identical and is no longer work.** Scope: measured over the **whole** ADR-012
  file in the **working tree**, `grep -nE 'adr-0[0-9]{2}:[0-9]'` returns **no matches (exit 1)** —
  every cross-document `adr-0NN:NNN` cite is gone. At `HEAD` (`9360177`) the same file carried **9
  `adr-010:NNN` occurrences on 7 distinct lines** (`:63-65` ×3, `:73-76` ×3, `:114-116`, `:107-110`,
  `:92-94`); `0171` replaced all of them with anchor-phrase cites. ⛔ **Do not write a note for this
  class.**
  ⚠️ **Two corrections to the paragraph's own facts, recorded for the record:** it says *"at least six
  places"* — the measured figure at `HEAD` is **9 occurrences across 7 lines** (10 across 8 lines once
  Class 4 item 3's self-cite is included). And it names *"§Decision 3's deferral bullet"* — the
  deferral bullet is **§Decision 4** (*"The `PreToolUse` hook stays deferred"*), `adr-012` `HEAD` line
  105. Neither correction creates work; both are now moot.
  ⚠️ **`0171` was in progress and uncommitted when this was measured** — see the master correction at
  the end of `## Notes`.

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
> [`0198`](../../done/0198-teach-record-decision-the-dated-correction-note-form/brief.md) — *"teach
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
- ⚠️ **DATED CORRECTION 2026-08-15 — MASTER. `0171` EDITED THIS TASK'S SUBJECT FILE MID-FLIGHT AND
  ALREADY DID PART OF THIS INVENTORY. Every line above is left byte-identical; scope, subject, owner,
  priority and status are unchanged — this row stays `🔲 Backlog` and open.**
  Filed on an owner ruling taken via `AskUserQuestion` on **2026-08-15** in a live `fkit lead` session
  driving `/fkit-sprint-ship-loop`, verbatim option label: ***"Producer records what `0171` did, and
  re-measures (Recommended)"***. Raised by a stateful review of `0171` as finding **R3** (silent
  overlap with this open task). Written by a spawned producer with **no owner channel** (ADR-021).
  **All figures below are this producer's own re-measurement on 2026-08-15 — nothing in them is copied
  from the inventory above or from R3.**

  - ⛔⛔ **READ FIRST — THESE FIGURES DO NOT REPRODUCE ON A CLEAN CHECKOUT.** `0171` was **in progress
    and uncommitted** when this was measured. `HEAD` was **`9360177`**, with ~61 uncommitted paths plus
    a staged rename in the tree, including `0171`'s unstaged edits to `adr-012`, `adr-016`, `adr-018`
    and `adr-031` and its untracked
    `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`. **A checkout of `9360177`
    still contains every `adr-0NN:NNN` cite this note reports as gone.** ⚠️ **Re-measure before
    starting** — the discharge below holds only while `0171`'s working-tree edits are present, and if
    `0171` is ever reverted or reworked, Classes 4.3 and 5 come back.

  - ✅ **What `0171` had already done inside this task's inventory** (measured in the working tree):
    - **Class 5 — all of it.** 9 `adr-010:NNN` occurrences across 7 distinct lines of `adr-012`,
      replaced with anchor-phrase cites.
    - **Class 4 item 3 — all of it.** The 1 self-cite `adr-012:139-141` in the header banner, likewise
      replaced.
    - Scope of the absence claim: measured over the **whole** `adr-012` file in the **working tree**,
      `grep -nE 'adr-0[0-9]{2}:[0-9]'` returns **no matches (exit 1)**. At `HEAD` the same command over
      the same whole file returns **10 occurrences on 8 lines**
      (`git show HEAD:<adr-012> | grep -oE 'adr-0[0-9]{2}:[0-9]+(-[0-9]+)?' | wc -l` → `10`).
    - ⛔ **`0171` touched NOTHING in Classes 1, 2, 3, 4.1 or 4.2.** Scope of that claim: every
      `(claude|test)/…:NNN` coordinate in `adr-012` is byte-identical between `HEAD` and the working
      tree — `grep -oE '(claude|test)/[A-Za-z0-9._/-]+\.(sh|md|json|js):[0-9]+(-[0-9]+)?' | sort | uniq -c`
      gives the **same seven-row tally** on both.

  - ⛔ **`0171` used REPLACEMENT-IN-PLACE, not this task's append-only form — and that breaks two of
    this task's verification steps.** `git diff --numstat -- <adr-012>` reads **`15	9`**: nine deleted
    lines on this task's subject file, none of them this task's. Consequences, reported not decided:
    - **Verification step 1 cannot be satisfied against `HEAD`** while `0171` is uncommitted.
      `git diff --numstat` will show `+N / −9`, and
      `git diff -U0 -- <adr-012> | grep '^-' | grep -v '^---'` will return `0171`'s nine deletions.
      **Re-baseline step 1 against the pre-existing working-tree state, or run this task after `0171`
      is committed** — do **not** "repair" `0171`'s deletions back in, and do **not** relax the
      append-only rule for this task's own writing, which stays `+N / −0`.
    - **Verification step 8 cannot be satisfied either** — `git status --porcelain` already shows ~61
      paths. Re-scope it to *"this task added no path outside `<adr-012>` and this task's folder"*.
    - ⚠️ **No `git stash`, no `git add`, no commit** was performed by this note, and none should be
      used to make the steps above pass.

  - 🔲 **The re-derived remainder — what this task still has to do at the measured working tree.**
    **16 code-coordinate occurrences across 12 distinct lines of `adr-012`**, none of them touched by
    `0171`. Scope: whole file, occurrence-counted with `grep -o … | wc -l`, not `grep -c`.

    | Class | Coordinate as cited | Occurrences | `adr-012` lines (working tree) |
    |---|---|---|---|
    | 1 | `claude/fkit-claude.sh:95` | 2 | 59, 178 |
    | 1 | `claude/fkit-claude.sh:94` | 1 | 62 |
    | 1 | `claude/fkit-claude.sh:92-103` | 2 | 77, 181 |
    | 2 | `claude/fkit-claude.sh:108-120` | 3 | 60, 83, 178 |
    | 3 | `claude/skills/fkit-initiate-project/SKILL.md:77-81` | 2 | 57, 177 |
    | 3 | `claude/skills/fkit-team/SKILL.md:38` | 3 | 92, 147, 180 |
    | 3 | `claude/scaffold/CLAUDE.md:33` | 3 | 92, 147, 180 |

    ✅ **The brief's "8 stale `claude/fkit-claude.sh` citations across 7 lines" figure reproduces
    exactly** — 8 occurrences, distinct lines `59 60 62 77 83 178 181`. Grouped by §heading for the
    note-writing step: **§The live bug this exposes** 4 (lines 57, 59, 60, 62) · **§Decision 1** 1
    (77) · **§Decision 2** 3 (83, 92×2) · **§Consequences** 2 (147×2) · **§Related** 6 (177, 178×2,
    180×2, 181). ⚠️ **§Consequences line 147 is a real site the inventory above only covers implicitly**
    (via *"repeated in §Consequences"*) — it needs a note like any other.
    **Plus the 2 surviving Class 4 factual claims — 4.1 and 4.2. Class 4.3 is discharged.**

  - ⚠️ **Where this producer's figures DISAGREE with the ones filed above.** Six disagreements; four
    of them change what a run must write.
    1. **`build_settings()` has MOVED.** Filed replacement coordinate: `claude/fkit-claude.sh@2026-08-06:272`.
       Measured: **`claude/fkit-claude.sh@2026-08-15:292`** (`grep -n 'build_settings' claude/fkit-claude.sh`
       → `292:build_settings() {`, plus call sites at `:582` and `:644`). ⛔ **Class 2's replacement
       pointer as filed is itself stale by 20 lines — writing `:272` into `adr-012` would file a fresh
       stale citation.** ⚠️ `claude/fkit-claude.sh` is uncommitted-modified; re-measure.
    2. **`claude/skills/fkit-team/SKILL.md:38` no longer characterises as filed.** Filed: *"`@2026-08-06:38`
       is a consult-hops bullet"*. Measured: **`@2026-08-15:38` is a blank line**; the consult-hops
       bullet is at **`@2026-08-15:36-37`**. The citation is still wrong — only the description of what
       it now points at changes. ⚠️ This file is uncommitted-modified.
    3. **`adr-012`'s own re-raise clause has moved.** Filed: `@2026-08-06:146-161`. Measured:
       **`@2026-08-15:151-166`** — the `- **Residual risks / "re-raise only if":**` bullet head at
       `:151` through its last sub-bullet at `:166`. Part of the shift is `0171`'s own net **+6** lines.
       This figure is now only of historical interest, since item 3 is discharged.
    4. **Class 4 item 3 — discharged**, see above.
    5. **Class 5 — discharged in full**, and its *"at least six places"* / *"§Decision 3's deferral
       bullet"* details were both slightly off. See the correction appended at Class 5.
    6. **Everything else reproduces.** Named individually, because absence and sameness claims are the
       expensive ones and each was checked directly:
       - `skills_for_role()` is at **`claude/skills-for-role.sh@2026-08-15:48-59`** — unchanged from
         filed. `producer` arm **`:51`**, `lead` arm **`:50`**.
       - `claude/fkit-claude.sh@2026-08-15:92-103` is still `_fkit_remote_version()` + `_fkit_reinstall()`;
         `:94` and `:95` are still `curl` lines inside `_fkit_remote_version()`.
       - `claude/fkit-claude.sh@2026-08-15:108-120` is still the `fkit update` case block.
       - `claude/skills/fkit-initiate-project/SKILL.md@2026-08-15:77-81` is still the tail of Step 2
         plus the `## Step 3` heading (`:79`); the *"Invoke the **fkit-architect** agent"* sentence
         still starts at **`:81`**. Row reproduces exactly.
       - `claude/scaffold/CLAUDE.md@2026-08-15:33` is still inside the producer-movers paragraph.
       - **Class 4.1 still holds:** the `lead` arm at `claude/skills-for-role.sh@2026-08-15:50` grants
         **five** skills (`fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down
         fkit-sprint-ship-loop`), not two. The *"only `fkit-team fkit-query`"* clause is still false.
       - **Class 4.2 still holds, and its two halves still resolve differently:**
         `claude/skills/fkit-team/SKILL.md@2026-08-15:47-48` still reads *"remains **unrunnable** …
         Visible-but-blocked, not invisible-and-blocked"* → for that file the demand is **satisfied**.
         For `claude/scaffold/CLAUDE.md` the wording is still **absent** → **moot**.
         ⚠️ **Absence claim, stated with its scope:** `grep -n 'unrunnable\|invisible\|non-owned'
         claude/scaffold/CLAUDE.md` over the **whole file** returns **zero matches, exit 1**. That file
         is **clean at `HEAD` `9360177`** (it is not in `git status --porcelain`), so unlike the rest of
         this note **this one figure does reproduce on a clean checkout**.

  - ⛔ **What this note did NOT do.** It changed no status, moved no file, re-ranked nothing, touched
    no `- **Depends on:**` line, and wrote no file other than this brief. It did not touch
    `ai-agents/sprints/backlog.md`, `0171`'s files, any `adr-*.md`, or
    `ai-agents/tasks/done/0306-…/`. No `ai-agents/wiki-vault/` write (ADR-005). No commit, no push,
    no `git add`, no `git stash`. ⚠️ **`0171` itself is still open and unclosed** — this note records
    an overlap, it does not close anything.
- ⏱️ **DATED CORRECTION 2026-08-15 — ORDERING CONSTRAINT: THIS TASK RUNS ONLY AFTER `0171` IS
  COMMITTED. Every line above is left byte-identical; nothing below changes scope, status, priority,
  owner or rank.** Filed on an owner ruling taken via `AskUserQuestion` on **2026-08-15** in a live
  `fkit lead` session, verbatim option label: ***"Record the ordering constraint — `0232` runs after
  `0171` commits (Recommended)."***
  ⛔ **This is a prose note and must stay one.** It is deliberately **not** a `- **Depends on:**`
  bullet — that line is parsed by `dashboard.sh`, and a task-ordering note placed there would change
  the board's derived state. **No `- **Depends on:**` line was added or altered by this note**, and a
  later reader must not promote this into one.

  - **The rule.** Do not start `0232` until `0171`'s edits to `adr-012` are in a commit.

  - **The reason, so a later reader can tell whether it still applies.** `0171` repaired `adr-012` by
    **replacement-in-place**, not by appending: `git diff --numstat -- <adr-012>` reads **`15	9`** —
    **15 added, 9 deleted**. Those nine deletions are `0171`'s, not this task's. While they sit
    uncommitted in the working tree:
    - **Verification step 1 cannot pass.** It requires `+N / −0` on `adr-012` and an empty
      `git diff -U0 -- <adr-012> | grep '^-' | grep -v '^---'`. Both will surface `0171`'s nine
      deleted lines, **through no fault of this task's run**.
    - **Verification step 8 cannot pass.** It requires `git status --porcelain` to show only the ADR
      and this task's folder; the tree carried **~61 dirty paths plus a staged rename** when measured.
    - ⛔ **Neither step is wrong and neither is being rewritten.** The owner ruled the ordering, **not**
      a rewrite of the verification steps — **steps 1 and 8 stay byte-identical**. This note records
      *when* they become satisfiable, nothing more.
    - ✅ **Once `0171` is committed**, `HEAD` carries those nine deletions as its baseline, and this
      task's own append-only proof measures cleanly against it: `+N / −0` becomes achievable and the
      status check reduces to this task's own paths.

  - ⭐ **This is nearly automatic already, and is not a new scheduling decision.** `0232` is
    **unranked on the Backlog board**; `0171` is **Sprint 6 P2**. The ordering was going to happen by
    itself. **What the ruling changes is that the constraint is now written down instead of
    accidental** — so a run that reaches for `0232` early can see why to wait. **No sprint was named,
    no row was re-ranked, and no board file was touched** (ADR-035).

  - ⚠️ **Why the trigger is *committing*, not merely *finishing*.** `0171` **silently discharged
    Class 5 and Class 4 item 3** — see the two notes appended at those sections and the master note
    above. That discharge exists **only in the uncommitted working tree**. ⛔ **A revert, a rework, or
    a discarded working tree re-opens both classes in full** — 9 `adr-010:NNN` occurrences across 7
    lines plus the 1 `adr-012:139-141` self-cite come straight back, and this task's remainder grows
    from **16** code-coordinate occurrences to **26** citation occurrences. A commit is what makes the
    discharge durable enough to plan against; `0171` merely *finishing* is not.
    ⚠️ **`0171` is still open and unclosed** as of this note. **Re-measure at start regardless** — the
    ordering constraint reduces the risk, it does not replace step 1 of `## What to build`.
