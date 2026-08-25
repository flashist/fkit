# Correct TWO false mechanism claims in the records inside `0327`'s task folder — dated correction notes, append-only

⚠️ **The folder slug still reads `…-the-wrong-ls-dereferences-mechanism-in-four-0327-records`.** It
names **subject A only** and was fixed before subject B was found. ⛔ **Do not rename the folder** —
the live board row links to it by path. The slug is stale; this title is authoritative.

## ID
0335

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

### ⛔ This is a CORRECTION of a live technical claim, not a tidy-up

Records inside task `0327`'s folder explain real defects with **wrong mechanisms**. The defects are
real; the *explanations* are not. Those records are **used to plan fixes** — `0334` fixes the
launcher, `0336` carries the wrong-type-squatter defect — so a reader who takes the recorded
explanations at face value **will build the wrong fix**.

⚠️ **Do not treat this as cosmetic.** A plan reasoning from these records would ship an incomplete fix
and believe it was done.

### ⛔ TWO SUBJECTS — different claims, different sections, DIFFERENT NOTES

⛔ **A reader must never think one note covers both.** They are separate false claims about separate
things, and they sit in different sections of different files.

| | Subject | The false claim | Lives in |
|---|---|---|---|
| **A** | **Why the launcher's fail-safe is symlink-blind** | the escape happens because **`ls` dereferences** | `plan.md` ×2, `worklog.md`, `review.md` → `## Reviewer findings` |
| **B** | **What happens after a wrong-type squatter aborts init** | it *"trips the launcher's **hard** fail-safe … **exit 1**"* and *"There is **no silent success** in any shape"* | `review.md` → `## Coder response`, `review.md` → `## Accepted residuals`, `review.md` → `## Reviewer findings`, `worklog.md` |

⚠️ **They overlap in files but never in text.** Subject A is about **symlinks**; subject B is about a
**real directory squatter** and needs **no symlink at all**. ⛔ **Do not merge them into one note, and
do not let a note for one cite the other's evidence.** Each note names its own site by its own quoted
fragment.

### Subject A — the correct mechanism, stated positively

The guard in question is in `claude/fkit-claude.sh`, this line:

```sh
if [ "$setup_ok" = 0 ] && ! ls "$proj"/.claude/agents/fkit-*.md >/dev/null 2>&1; then
```

⛔ **Anchor on that quoted `if` line, not on a line number**
([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
It was at `:387` when this brief was written; the number is not durable.

**What actually happens — two shapes:**

1. ⛔ **The escape is the SHELL GLOB, not `ls`.** `"$proj"/.claude/agents/fkit-*.md` is **expanded by
   the shell before `ls` ever runs**, and **pathname expansion traverses symlinked directories**. So
   when `.claude` (or `.claude/agents`) is a symlink pointing outside the project, the glob resolves
   to the escaped copies at the link target, hands `ls` a real existing path, and the guard is skipped
   — the launcher proceeds and starts a session reading its agent definitions from **outside the
   project**, which is the exact state the guard exists to catch.

   ⚠️ **This is why an `ls`-only fix cannot close it:** `ls` is handed an already-resolved, genuinely
   existing path. It has nothing left to detect.

2. 🆕 **A second shape the records never mention at all: a DANGLING symlink also passes the guard.**
   An `.claude/agents/fkit-<role>.md` that is a symlink to a **non-existent** target still matches the
   glob (matching is by name, via directory read), and plain `ls` on a broken link exits **0** because
   it does not dereference the final component. ⭐ **So the guard is satisfied by mere *name*
   existence.** The session then dies on precisely the *"confusing 'agent not found'"* message the
   guard's own comment says it prevents.

   ⚠️ **This shape needs no buggy init to arise** — unlike shape 1, it is not historical residue.

**Measured firsthand by this brief's author, 2026-08-24**, in throwaway projects under `mktemp -d`
outside the repo; the launcher was **not executed** and the repo working tree was **not modified**:

| Case | Result |
|---|---|
| `.claude` → symlink to an outside dir holding `agents/fkit-coder.md` | ⛔ glob expanded through the link; guard **skipped**; `realpath` confirmed resolution outside the project |
| `.claude/agents/fkit-coder.md` a **dangling** symlink | ⛔ plain `ls` **rc=0** → guard **skipped**; `ls -L` **rc=1** |
| ⭐ **Disproof of the stale claim** — `ls -L` (a *dereferencing* `ls`) run on the shape-1 case | ⛔ **still rc=0** — guard **still skipped**. A dereferencing `ls` does not close shape 1. |

⭐ **That last row is the load-bearing one.** It is direct evidence that the recorded explanation is
not merely imprecise but **actively misleading about where the fix must go**.

### 🆕 Subject B — "it trips the hard fail-safe, exit 1, no silent success" is FALSE

⛔ **Added to this task by owner ruling, 2026-08-24, live via `AskUserQuestion` in an `fkit lead`
session driving `/fkit-sprint-ship-loop` — verbatim option label: "Widen 0335 to cover it
(Recommended)".** Verbatim description: *"The producer's pick. 0335 already owns append-only dated
corrections inside 0327's folder, already solves the reviewer/coder section-ownership problem with
your third-party `## Corrections` section, and hasn't started. One edit to its site table beats a new
row and avoids two tasks writing into one folder."*

**The false claim.** `0327`'s records say that when a **wrong-type squatter** (a real *directory* at
`.claude/agents/fkit-<x>.md`) aborts init on an already-installed project, the resulting
zero-agents state *"trips the launcher's **hard** fail-safe (`claude/fkit-claude.sh:387`, exit 1)"*
and that *"There is **no silent success** in any shape."*

⭐ **The record disproves itself internally.** One paragraph **above** the `## Coder response` site,
the coder's own measurement table records *"the squatter itself **survives** (`rm -f` failed on it)"*.
The survival of the squatter is exactly what defeats the guard. ⚠️ **Worth recording in the note:**
this is not a claim that needed outside evidence to falsify — the same section already carried it.

**The corrected mechanism, stated positively.** ⛔ **Write it this way, so the repaired record carries
the truth without a second hop:**

> The squatter **survives the failed `rm -f`** — `rm` refuses it with *"is a directory"* — while every
> real `fkit-*.md` agent file has already been deleted. The squatter's **name** still satisfies
> `"$proj"/.claude/agents/fkit-*.md`, so the glob expands to a real existing path and `ls` exits
> **0**. The guard's `! ls …` condition is therefore **false**: ⛔ **the `:387` fail-safe is SKIPPED,
> and there is no `exit 1`.** The launcher proceeds and the session **starts with zero readable fkit
> agent files** — then dies on Claude Code's own *"agent not found"*, which is precisely the message
> `:387`'s own comment says the guard prevents. **So there IS a silent-success shape.**

⛔ **Anchor on the quoted `if` line, never `:387`** — the number is not durable
([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)):

```sh
if [ "$setup_ok" = 0 ] && ! ls "$proj"/.claude/agents/fkit-*.md >/dev/null 2>&1; then
```

**Measured firsthand by this widening's author, 2026-08-24**, in throwaway projects under `mktemp -d`
outside the repo; the launcher was **not executed** (the guard expression was evaluated verbatim in
isolation) and the repo working tree was **not modified**:

| Case | Measured result |
|---|---|
| already-installed project (7 `fkit-*.md`) + real **directory** `fkit-squat.md`, then `rm -f …/fkit-*.md` | `rm: …/fkit-squat.md: is a directory`, **`rc=1`**; real agent files **7 → 0**; user's own `my-own.md` **survives**; ⛔ **squatter survives** |
| ⭐ **the guard, on that state**, `setup_ok=0` | ⛔ **`ls` glob → `rc=0`** → `! ls` false → **guard SKIPPED, no `exit 1`, session would START with zero readable agent files** |
| **control**, same pass — genuinely empty `.claude/agents/` | ✅ `ls` glob → **`rc≠0`** → **guard FIRES** correctly. The guard is not broken in general; the squatter defeats it. |

⚠️ **STATE THE SILENCE PRECISELY — do not over-correct.** The run is **not output-free**: init's
`rc=1` sets `setup_ok=0`, so the **generic** warning at the `if [ "$setup_ok" = 0 ]` block
(*"fkit could not finish setting up this project"*) **does** print. ⛔ **A note saying "the launcher
prints nothing" would replace one false claim with another.** What is silent is the **no-agents
condition specifically**: the one guard written to catch *"no fkit agent was ever written to disk"*
never fires. **Write it as:** *the no-agents fail-safe is silently skipped and the session starts with
zero readable agent files* — not *"the launcher is silent"*.

### ⛔ Subject B does NOT reopen `0327`'s R6 ruling — say so in the note

The R6 accepted residual carries a **re-raise condition**: *"or to fail **silently** (no `rc=1`, no
launcher warning)"*. ⛔ **That condition is NOT met.** Init **does** return `rc=1`, and the launcher
**does** print the generic setup warning. **The R6 residual stays settled and `0336` stays as filed.**

⚠️ **This task corrects the residual's stated EVIDENCE, not its RULING.** ⛔ **If your note reads like
a re-raise, it is wrong — rewrite it.**

### ⚠️ Do not mistake the refinement already present for this correction

Immediately below the `## Coder response` site sits a note beginning *"One disambiguation, offered as
a refinement rather than a correction"*, which says the **skills** shape does *not* reach the hard
exit. ⛔ **It does not correct the agents shape — it reaffirms it by contrast, so it compounds the
error.** Leave it **byte-identical** and correct it by reference from the `## Corrections` section.
The same applies to the `worklog.md` site, which sits under the heading *"Two refinements this round
adds"*.

### Where the corrected mechanism already lives

**Subject A** — `0334` (`0334-fix-the-launchers-symlink-blind-agents-fail-safe`) carries the correct
mechanism durably, including the five-case measurement table and the dangling-link shape.

**Subject B** — `0336`
(`0336-guard-inits-claude-refresh-against-a-wrong-type-squatter-and-name-every-symlinked-entry`)
carries the wrong-type-squatter defect (R6 + R7). `0334` now owns the **launcher-side fix for all
three triggers** (symlinked directory, dangling link, and the surviving squatter that satisfies the
glob by name).

⚠️ **Resolve `0334` and `0336` by glob across all three boards too** — they may have moved by the time
this task runs.

### ⭐ WHY this is worth doing — not tidy-up, a wrong signpost for two live planners

⛔ **`0334`'s and `0336`'s planners are exactly the readers who will hit the false sentence.** `0336`
inherits the R6 residual verbatim, and that residual is one of the two subject-B sites. A planner who
reads *"trips the hard fail-safe, exit 1, no silent success"* will price the defect as **loud and
self-announcing** and scope the fix accordingly — when the measured behaviour is a **session that
starts with zero agents**.

⭐ **This is the same failure `0327` itself existed to fix:** a wrong comment pointing the next reader
at the wrong thing. Leaving it live repeats it one level up, in the record *about* the fix.

⚠️ **Neither `0334` nor `0336` is blocked by this task, and this task blocks neither.** They fix code;
this repairs records. Any order.

### ⛔ Do not reopen or re-scope `0327`

`0327` stays closed with whatever status it landed with. ⛔ **This task changes no `## Status`
anywhere**, reopens no ruling (in particular **not** `0327`'s Q1(a) exit-status ruling), and adds no
finding to `0327`'s review. It **annotates** stale claims and nothing else.

### ⚠️ `0327` HAS MOVED — do not assume a path, including `done/`

`0327` closed before this task runs. Its folder was under `ai-agents/tasks/done/` when this brief was
last edited (**2026-08-24**) — ⛔ **but that is a reading, not a guarantee, and `done/` is as
hard-coded as `backlog/` was.** ⛔ **Resolve it by glob across all three boards, every time.** See
**§0** of *What to build* for the command and the `zsh` caveat.

⛔ **The same applies to `0334` and `0336`** — every path reference in this brief resolves them by
glob, never by a fixed board.

### Precedent — the form, not the subject

`0309`, `0320` and `0321` are the same **defect class** (a stale claim repaired by append-only dated
correction notes) and establish the **form** this task follows. ⚠️ **They do not overlap this task's
subject or its sites**: all three repair stale **`0171` citation** claims, in briefs and on the live
boards. **None of them names `0327`, the launcher, the fail-safe, or the `ls` claim**, and none of
them touches a file inside `0327`'s folder. This task is additive to all three.

## What to build

⚠️ **No source code changes. This task edits records only.** It writes into `0327`'s folder and
nowhere else.

### 0. ⛔ Resolve `0327`'s folder by GLOB, never a hard-coded board

`0327` is under `ai-agents/tasks/done/` **today**, but that is a reading, not a guarantee. ⛔ **Every
path reference in this task resolves it by glob across all three boards:**

```sh
d=$(ls -d ai-agents/tasks/{backlog,done,cancelled}/0327-*/)
```

⚠️ **Under `zsh` an unmatched glob aborts the command** — run the locate/grep steps under `bash` (or
set `nullglob`) so a missing board does not look like a missing task.

### 1. Re-locate the sites by quoted fragment — EIGHT sites, TWO subjects

⛔ **Do not trust the line numbers below — re-locate every site yourself by its fragment**
([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
The line numbers are readings on 2026-08-24, recorded only as a sanity cross-check, and the files were
being actively edited around that moment.

**Subject A — the "`ls` dereferences" mechanism:**

| # | File (inside `0327`'s folder) | Locate by this fragment | Then ~line |
|---|---|---|---|
| **A1** | `plan.md` — §6 Q1 ⚠️ note | `And note the launcher's fail-safe is *already* symlink-blind` | 320 |
| **A2** | `plan.md` — Q1(a) accepted-consequence note | `The launcher's symlink-blind fail-safe (§6 Q1's ⚠️ note) is **not** repaired by this task` | 354 |
| **A3** | `worklog.md` — Owner-decision log | `fail-safe (`fkit-claude.sh`'s `ls .claude/agents/fkit-*.md` dereferences) is **not** repaired here` | 18 |
| **A4** | `review.md` — inside `## Reviewer findings` | `Confirmed recorded, not re-litigated:` … `**dereferences**, so a project that ran the buggy init once` | 34 |

⚠️ **Correction to the framing this task was filed under — measured, and it changes the method.** The
subject-A sites are **NOT byte-identical to one another**. A1, A3 and A4 each state the wrong
mechanism in **different wording**; A2 does **not** restate the mechanism at all — it inherits it **by
reference**, pointing at A1 (*"§6 Q1's ⚠️ note"*). ⛔ **So a search-and-annotate driven by one literal
string will miss sites, and A2 will look like a false positive if you expect a restated mechanism.**

**A2's note must therefore say something slightly different**: that the claim it points at has been
corrected, and where. It does not itself carry a wrong mechanism to correct.

**Subject B — the "hard fail-safe / exit 1 / no silent success" claim:**

| # | File — **section matters** | Locate by this fragment | Then ~line |
|---|---|---|---|
| **B1** | `review.md` — `## Coder response` → `### R6` **(round 2)** | `it trips the launcher's **hard** fail-safe` … `There is **no silent success** in any shape.` | 325–327 |
| **B2** | `review.md` — `## Accepted residuals (shared, do-not-re-litigate)` → the R6 residual | `the agents shape trips the **hard** fail-safe` … `exit 1), the skills shape the loud` | 455–456 |
| **B3** | `review.md` — `## Reviewer findings` → the R6 row | `routes to the launcher's own `setup_ok` fail-safe rather than a silent success` | 92 |
| **B4** | `worklog.md` — `## Two refinements this round adds` | `The **agents** shape trips the launcher's **hard** fail-safe` … `**No silent success in any shape**` | 359–363 |

⚠️ **B1 was the only site named when this widening was ruled. The other three were found by grepping
the whole folder** — record that, and ⛔ **grep the folder yourself before writing**, since a site
list is exactly the kind of thing that drifts.

✅ **ALL FOUR ARE OWNER-RULED IN SCOPE** — ratified **2026-08-24**, **verbatim option label: "Cover
all four (Recommended)"**. ⛔ **Do NOT trim B2, B3 or B4 on the theory that only B1 was ever
authorised.** See `## Notes` for the ruling in full.

⛔ **B3 is a PARTIAL falsehood — narrow its note, do not overstate it.** *"Routes to the launcher's
own `setup_ok` fail-safe"* is **TRUE**: the generic `setup_ok`-gated warning does fire. Only the
*"rather than a silent success"* half fails. ⚠️ **B3's note corrects that half and says the rest of
the row stands** — including its `low`-over-medium severity call, which this task does **not**
re-litigate.

⚠️ **B1, B2 and B3 are three different sections of ONE file.** ⛔ **Three separate notes in the
`## Corrections` section, each naming its own fragment and its own section.** A single note covering
`review.md` would leave two of the three unfindable.

### 2. ⛔ Sites explicitly OUT of scope — do not "fix" these

Do not touch these; they are **correct as written** and annotating them would inject a false
correction:

- `plan.md`, the lines reading `mkdir -p`, `rm -f`, `rm -rf`, and `cp`/`cp -R` **all dereference** —
  ⭐ **that is a true statement about those commands.** It is unrelated to the `ls` guard.
- `review.md`, the finding whose fragment is `the exit-status-unchanged ruling **Q1(a)**` — its claim
  about `setup_ok = 0` gating is correct.
- `brief.md` in `0327`'s folder — **no** occurrence of **either** stale claim was found there
  (re-grepped for subject B on 2026-08-24). ⚠️ **Re-check with your own grep before concluding this;
  if you find one, treat it as an extra site and say so**, rather than silently expanding or silently
  skipping.
- 🆕 `review.md`'s ⚠️ note beginning *"One disambiguation, offered as a refinement rather than a
  correction"*, and `worklog.md`'s *"R7's path line must not simply be re-pointed"* — ⛔ **do not
  annotate these as sites.** The first is discussed above (it compounds B1 by contrast but states no
  new false mechanism of its own); the second is about R7 and is unrelated.
- 🆕 The R6 residual's **re-raise condition** (*"no `rc=1`, no launcher warning"*) and its
  **`low` severity ruling** — ⛔ **both stand, both out of scope.** See *"Subject B does NOT reopen
  `0327`'s R6 ruling"* above.

### 3. Write the correction notes — `0198`'s form, exactly

Follow `claude/skills/fkit-record-decision/SKILL.md`, section
**`## Correcting an accepted ADR — the dated correction note`**. It is written for ADRs; it is the
project's general form for this act. Specifically:

- **Marker: ⚠️, not ⛔.** A **fact drifted**; no decision was overturned. ⛔ **Mismarking as ⛔ would
  tell readers to stop following `0327`'s rulings, which stand.** There is no third marker.
- **Placement: BELOW the claim it corrects**, with **indentation matching** the block it sits under
  (a claim inside a list item takes that item's continuation indent; a claim in top-level prose takes
  column 0).
- **The original text is left BYTE-IDENTICAL.** Append only. Never edit the recorded prose.
- **Every note states** that the corrected text is left byte-identical, carries the date, quotes the
  fragment it corrects, and states the correct mechanism **positively**:
  - **Subject A notes** — the glob expands before `ls`; pathname expansion traverses symlinked
    directories; the dangling-name shape; points at `0334`.
  - **Subject B notes** — the squatter survives the failed `rm -f` and still satisfies the glob by
    **name**, so the no-agents guard is **skipped** and the session **starts with zero readable agent
    files**; **there IS a silent-success shape**; the generic setup warning still prints; points at
    `0334` (launcher fix, all three triggers) and `0336` (the squatter defect).
  - ⛔ **A subject-B note must not cite subject A's `ls -L` disproof** — different claim, different
    evidence. ⛔ **A subject-A note must not mention the squatter.**
- **Add the `- **Corrections:**` header metadata bullet** to each annotated file, carrying the ⚠️/⛔
  legend and the list of annotated sites **grouped by subject**, so a reader can tell at the header
  which claim each note repairs. This is the stated append-only exception, and it is what warns the
  reader before they reach the body.

### 4. ⛔ `review.md` is a THREE-SECTION LEDGER — OWNER-RULED, settled

`review.md` has `## Reviewer findings` (the reviewer's), `## Coder response` (the coder's), and
`## Accepted residuals (shared, do-not-re-litigate)`. `fkit-process-stateful-review`'s rule is
explicit: *"read the reviewer's section, write only your own section."* **Sites A4, B1, B2 and B3 sit
inside those three sections** — and this task's owner is party to none of them.

⛔ **OWNER-RULED 2026-08-24**, live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` — **verbatim option label: "New third-party Corrections section
(Recommended)"**. ⭐ **Settled. This is no longer a residual open question, and it is not to be
re-put to the owner.** *(It was filed as a residual by a spawned producer with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md));
the ruling arrived afterwards, in the same session that ruled the subject-B widening.)*

⛔ **The ruling covers BOTH subjects.** It was given knowing subject B's sites sit in the **coder's**
and the **shared** sections, not only the reviewer's. ⚠️ **Every note for every site in `review.md`
goes in the one `## Corrections` section** — do not split by which party owns the section a site
happens to live in.

⛔ **Do not write inside `## Reviewer findings`, `## Coder response`, or `## Accepted residuals`.**

**The ruled mechanism, exactly:**

- Append a **new top-level section at the end of the file**, after `## Accepted residuals`, headed
  `## Corrections (record repair — task 0335)`.
- Inside it, place one dated ⚠️ note **per site**, each **naming the site it corrects by its quoted
  fragment and its section** so the link between note and claim survives any later edit.
- Add a `- **Corrections:**` bullet in the file's **header metadata block** (the
  `Task:` / `File(s) under review:` / `Status:` lines above the first `---`). That block is ledger
  metadata belonging to neither party, and the bullet is what warns a reader before they reach the
  stale claim.
- ⛔ **Leave all three party sections byte-identical.** Prove it (verification step 4).

⚠️ **This deliberately departs from the form's "below the claim" placement**, and the implementer
should know why rather than discover it: the ownership rule and the placement rule genuinely
conflict here, and ownership was judged the harder constraint — a role writing in another role's
ledger section corrupts the round-trip protocol, while below-the-claim placement is a readability
convention whose stated purpose (warning the reader) is served by the `- **Corrections:**` header
bullet, which the form itself names as the warning mechanism.

⚠️ Sites A1, A2, A3 and B4 (`plan.md`, `worklog.md`) have **no such conflict** — single-author
records. Use the form's normal below-the-claim placement there.

### 5. Do not disturb anything else

⛔ **Out of bounds:** `claude/`, `test/`, any source file, any `## Status` field anywhere, the sprint
boards' rankings, and every task folder other than `0327`'s.

## Verification steps

0. **⛔ Re-verify the premise before writing.** Both mechanisms are second-hand to whoever runs this.
   Reproduce them yourself — ⚠️ **only in `mktemp -d`, never a fixed path, never this repo**, and
   **never execute the launcher**; evaluate the guard expression in isolation. **If a premise does not
   hold, stop and report it** rather than writing the correction.
1. **Locate step** — show the command that found `0327`'s folder **by glob across all three boards**
   (⛔ not a hard-coded `done/`), and the grep output locating **each of the eight sites** by
   fragment. ⚠️ **If a fragment no longer matches, stop and report it** rather than annotating a
   guessed location. ⚠️ **Report the subject-A and subject-B site lists separately.**
2. **Append-only proof, per annotated file** — run the form's exact commands and paste the output:
   ```
   git diff --numstat -- <file>                        # expect "N  0  <file>"
   git diff -U0 -- <file> | grep '^-' | grep -v '^---' # expect NO output
   ```
   ⚠️ **Use that deletion filter exactly.** `grep '^-[^-]'` is **wrong** — a deleted markdown list
   line `- text` appears as `-- text`, so the pattern skips it, including the `- **Corrections:**`
   bullet this task extends.
3. **⚠️ Snapshot proof — REQUIRED here, not optional.** `0327`'s files may carry earlier uncommitted
   edits from its own ship loop, and a working-tree diff cannot isolate your change against them.
   **Copy each file before editing**, then also run:
   ```
   git diff --no-index --numstat <snapshot> <file>   # expect "N  0"
   diff <snapshot> <file> | grep '^<'                # expect no output
   ```
4. **Section-ownership proof for `review.md`** — show that **all three** party sections
   (`## Reviewer findings`, `## Coder response`, `## Accepted residuals`) are byte-identical to their
   pre-edit state (e.g. section-scoped `diff` against the snapshot). ⛔ **All three, not two** — a
   subject-B site sits in each.
5. **Marker check** — every note added uses ⚠️. Grep the added lines and confirm **no ⛔** was used as
   a correction marker.
6. **No status changed** — `git diff` shows no `## Status` line altered in any file.
6b. **⛔ Over-correction check — subject B.** Grep the added notes and confirm **none** claims the
   launcher prints nothing, that the run is silent, that init returns `rc=0`, or that the R6 residual's
   re-raise condition is met. ⚠️ **Each of those would be a NEW false claim.**
6c. **Distinguishability check.** Confirm no note mixes the two subjects: no subject-A note mentions
   the squatter, no subject-B note cites `ls -L` or the dangling-symlink shape, and every note names
   its own site's quoted fragment.
7. **Scope check** — `git status --porcelain` shows changes confined to `0327`'s folder (plus this
   brief's own board row if it is closed in the same pass). ⛔ Nothing under `claude/`, `test/`, or
   `ai-agents/wiki-vault/`.
8. **Board check** — run `claude/skills/fkit-status/dashboard.sh` on **both** boards: exit 0, drift 0,
   and no other task's cell changed.
9. **Read-back** — re-read each annotated site and confirm a reader who never opens `0334` **or**
   `0336` now gets both correct mechanisms in place: **subject A** — glob-before-`ls`, symlink
   traversal, dangling-name shape; **subject B** — the squatter survives, satisfies the glob by name,
   the no-agents guard is skipped, and the session starts with zero readable agent files.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- ⚠️ **Sequencing, not a dependency:** this task must run when `0327`'s folder is **quiet**. It was
  filed while a coder was actively writing `review.md`, `worklog.md` and source fixes in that folder.
  **Do not start until `0327` is closed.** This is a real ordering constraint but not a `Depends on:`
  link — nothing in `0327` produces an input this task consumes.
- ⚠️ **`0327` will be under `ai-agents/tasks/done/` by then.** Resolve its folder by glob across all
  three boards; never hard-code `backlog/`.
- **`0334` neither blocks nor is blocked by this task.** `0334` fixes the launcher; this repairs the
  records. Independent, either order.
- **Precedent for the form:** `0309`, `0320`, `0321` — same class (append-only dated correction
  notes), **different subject and zero shared sites** (they repair stale `0171` citation claims).
  Measured: none of the three mentions `0327`, the launcher, the fail-safe, or the `ls` claim.
- **`0336` neither blocks nor is blocked by this task.** `0336` fixes init's wrong-type-squatter
  handling; this repairs the records that describe it. Independent, either order.
- ⭐ **The two things this task must get right:**
  1. The subject-A sites are **not** byte-identical, and A2 inherits the wrong mechanism **by
     reference** rather than restating it. A single-string sweep will under-count.
  2. The **two subjects must stay distinguishable** — same files, different sections, different
     claims, different evidence. ⛔ **A reader must never think one note covers both.**
- 🆕 **Subject B added 2026-08-24 by owner ruling** — verbatim label **"Widen 0335 to cover it
  (Recommended)"** — relayed to a spawned `fkit-producer` with no owner channel
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  ⚠️ **The ruling that ADDED subject B named ONE site (`review.md`'s `## Coder response`); this brief
  lists FOUR.** The other three were found by grepping `0327`'s folder for the same claim, and were
  recorded as the widening author's own expansion on measured evidence so that nothing was silently
  expanded.
- ✅ **THAT EXPANSION IS NOW OWNER-RATIFIED — ALL FOUR SUBJECT-B SITES (B1, B2, B3, B4) ARE IN
  SCOPE.** Ruled live via `AskUserQuestion` on **2026-08-24** in an `fkit lead` session driving
  `/fkit-sprint-ship-loop`, relayed to a spawned `fkit-producer` with no owner channel
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md))
  — **verbatim option label: "Cover all four (Recommended)"**, whose description reads *"The
  producer's pick. B2 is the site 0336's planner actually reads — it inherits that residual verbatim
  — and leaving B3/B4 live re-creates the exact \"wrong signpost\" this task exists to remove. B3
  gets a narrowed note since only half of it is false."*
  ⛔ **B2, B3 and B4 are NO LONGER TRIMMABLE. Do NOT drop them on the theory that the earlier
  subject-B ruling should be read literally — they are authorised in their own right.** ⭐ **Settled;
  not to be re-put to the owner.** B2 is still the one that matters most: it is the residual `0336`
  inherits.
  ⛔ **B3 KEEPS ITS NARROWED NOTE** — the ratifying option says so in terms (*"B3 gets a narrowed
  note since only half of it is false"*). See §1's partial-falsehood note: *"routes to the launcher's
  own `setup_ok` fail-safe"* is **TRUE**, only *"rather than a silent success"* fails. ⛔ **A blanket
  note on B3 would replace one false claim with another.**
- ⚠️ **The subject-B premise was measured firsthand on 2026-08-24** by the producer that widened this
  brief — squatter survives, glob satisfied by name, guard skipped, control fires. ⛔ **Re-measure
  anyway before writing** (verification step 0). Evidence before assertion.
- ⛔ **Nothing was re-ranked by this widening** (ADR-035), no `## Status` / `## Priority` / `## Sprint`
  / `## Owner` field was changed, and `0327`'s folder was **read-only** throughout.
- **Owner rationale — `fkit-producer`:** no source code is written; the work is append-only
  annotation of project records, which is producer record-keeping. The two nearest precedents of
  exactly this form (`0320`, `0321`) are both producer-owned. ⭐ **Decisively:** `review.md`'s two
  named sections belong to the reviewer and the coder, so assigning either of those roles would put
  the writer inside a section it must not touch or force it to write in the other's. The producer is
  a **third party to both**, which is what makes the corrections-section approach clean.
- ⚠️ **Filed by a spawned `fkit-producer` with no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  Owner-ruled live via `AskUserQuestion` on **2026-08-24**, in an `fkit lead` session driving
  `/fkit-sprint-ship-loop`; **verbatim option label: "File a record-repair task (Recommended)"**.
  ⛔ **This is not producer precedent for re-ranking anything** — nothing was re-ranked, and this row
  appends to an unranked board.
