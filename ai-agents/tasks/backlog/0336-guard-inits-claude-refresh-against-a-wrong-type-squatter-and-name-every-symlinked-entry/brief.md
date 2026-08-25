# Guard init's `.claude/` refresh against a wrong-type squatter, and name every symlinked entry in the skills refusal

## ID
0336

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

⭐ **TWO OWNER RULINGS, 2026-08-24**, both given live via `AskUserQuestion` in an `fkit lead` session
driving `/fkit-sprint-ship-loop`, and relayed to a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**The option labels are the verbatim text:**

- **On R6 — "File as its own task (Recommended)".** Description as presented, verbatim:
  > *"The reviewer's pick. Real, pre-existing, and outside 0327's scope — whose deliverable is
  > \"refuse the destructive refresh through a SYMLINK\". Nothing outside the project is touched and no
  > user path is destroyed; the loss is fkit's own gitignored payload, restored by moving the stray and
  > re-running."*
- **On R7 — "Fold into R6's task (Recommended)".** Description as presented, verbatim:
  > *"The reviewer's pick. Same file, same refusal path, both low — one task, one proof pass."*

**So: one task carrying both findings.** ⚠️ **One word in R7's description is imprecise and is corrected
here rather than carried:** R6 and R7 are the **same file and the same section** (§3 of
`claude/fkit-claude-init.sh`), but **not the same code path** — R6 lives in the branch where the guard
**passes** and the refresh proceeds, R7 in the branch where the guard **refuses**. The ruling still
holds and is not reopened: one file, one section, one proof pass. **Stated so the implementer does not
expect a single shared fix site.**

### Provenance

Both findings come from `0327`'s **Round-2 stateful review**, and **both were raised independently by
both reviewers** — Codex and the `fkit-reviewer`. Recorded in `0327`'s task-folder `review.md` as rows
**R6** and **R7** of the reviewer findings table. ⚠️ **`0327` will have moved to
`ai-agents/tasks/done/` by the time this task runs — resolve its folder by glob across all three
boards, never hard-code `backlog/`.** ⛔ **All `0327` files were READ ONLY while this brief was
written; nothing in that folder was edited** (a coder was writing there at the time).

⚠️ **Every citation below anchors on a QUOTED FRAGMENT, never a line number**
([durable-citation-anchors](../../../knowledge-base/conventions/durable-citation-anchors.md)) —
`claude/fkit-claude-init.sh` was being edited when this brief was written and the numbers will not
survive.

---

### R6 — a wrong-type squatter kills init, and the agents half deletes before it dies

`claude/fkit-claude-init.sh` runs under `set -euo pipefail`. §3 (`# 3. refresh the fkit-managed agents
+ skills`) now carries a containment guard, but **that guard tests `[ -L ]` and nothing else** — so a
**real** (non-symlink) directory or file squatting an fkit-managed name **passes it**, and the
unguarded `rm`/`cp` behind it then aborts the script.

**Two shapes, both measured — do NOT assume they want the same treatment:**

| Shape | Squatter | Abort site (quoted) | Measured result |
|---|---|---|---|
| **A — agents** | a real **directory** named `.claude/agents/fkit-x.md` | `rm -f "$dest/.claude/agents/fkit-"*.md` | `rm: …/fkit-x.md: is a directory`, **`rc=1`** |
| **B — skills** | a real **regular file** at `.claude/skills/<payload-skill-name>` | `cp -R "$here/skills/fkit-"* "$dest/.claude/skills/"` | `cp: …: Not a directory`, **`rc=1`** |

**Reproduced firsthand by the filing producer, 2026-08-24**, in throwaway trees under the session
scratchpad **outside the repo**; the repo working tree was **not** modified and the launcher was **not**
executed. Method: the four statements above, extracted verbatim, run under `set -euo pipefail` with a
sentinel `echo` after the `cp` to prove reachability.

**Shape A, measured, on an already-installed project — this is the damaging one:**

- The glob expands in name order, so `rm` deletes **`fkit-architect.md`, `fkit-coder.md`, … first** and
  **then** fails on the directory. Measured end state: **every `fkit-*.md` gone**, the squatter still
  there, sentinel **never printed**.
- ⭐ **The user's own non-`fkit-` agents survive** — a planted `my-own.md` was untouched. Measured, not
  assumed.
- Because `set -e` kills the script at that `rm`, **the skills half does not run either**, and **§4
  (intake), §5 (gitignore) and §6 (the orphan cleanup) never run**. ⚠️ **This is WORSE than the
  finding as relayed**, which named only §5/§6.

**Shape B, measured:** the `for d in "$dest/.claude/skills/fkit-"*/` deletion loop **cannot see** the
squatter (`fkit-*/` with its trailing slash does not match a regular file), so the file survives to the
`cp -R`, which fails on it. ⭐ **`cp` continues past the error**, so the *other* payload skills are
copied; the loss here is **not** data but the **abort** — `rc=1`, §4/§5/§6 never run. **State it that
way: shape B destroys nothing.**

#### ⚠️ THE SEVERITY REASONING IS LOAD-BEARING — carry it, do not re-derive it

Rated **low**, **lowered from Codex's medium**, on four grounds, each re-verified by the filing
producer:

1. **Nothing outside the project is touched.** No symlink is involved in either shape; every path stays
   inside `$dest`.
2. **No user-owned path is destroyed** — measured above (`my-own.md` survives).
3. **The only loss is fkit's own gitignored payload.** Confirmed against §5's own `add_ignore` calls:
   `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/` are both ignored. **Restored by moving the
   stray and re-running `fkit`.**
4. **`rc=1` routes to the launcher's `setup_ok` fail-safe rather than a silent success** — confirmed in
   `claude/fkit-claude.sh`: `setup_rc` non-zero and not `3` sets `setup_ok=0`, which prints
   *"⚠ fkit could not finish setting up this project."*

⛔ **Do not re-raise above `low` without new evidence** of a route that damages a user-owned path or
escapes the project.

#### ⛔ PRE-EXISTING AT `HEAD` — NOT A REGRESSION FROM `0327`

**Verified by the filing producer against `git show HEAD:claude/fkit-claude-init.sh`.** ⚠️ **One
correction to the wording used in the review and the relay:** the four statements are **not literally
byte-identical** — `0327` re-indented them by two spaces when it wrapped them in its new `else`
branches. **The commands themselves are unchanged**, and the reproduction above was run against
**HEAD's** unindented form, so **the defect predates `0327` and `0327` neither caused nor worsened
it.** ⭐ **Say this in the plan.** A reader who meets this task next to `0327` will otherwise read it
as a regression the reviewer let through.

⚠️ **It does, however, narrow a claim `0327` introduced.** `0327`'s §3 header comment says a squatter on
the fkit-managed patterns *"IS deleted, and is NOT put back"*. **For a wrong-type squatter that is
false: it is not deleted at all — init aborts on it.** Whether to correct that sentence is **in scope
here** (see *What to build*).

#### 🆕 A SECOND, ADJACENT MEASUREMENT — NOT IN SCOPE, FLAGGED FOR THE OWNER

Measured firsthand 2026-08-24 under both `/bin/sh` and `/bin/bash`, launcher **not** executed:
`claude/fkit-claude.sh`'s agents fail-safe — `if [ "$setup_ok" = 0 ] && ! ls "$proj"/.claude/agents/fkit-*.md …` —
**exits `0` when the only match is the squatting DIRECTORY** (control: genuinely empty → `rc=1`, guard
fires). ⭐ **So in shape A the guard does NOT refuse**, and the launcher starts
`claude --agent fkit-<role>` with **no agent file on disk** — landing the user on exactly the
*"confusing 'agent not found'"* the guard's own comment says it prevents.

⛔ **This is the launcher, not init, and it is NOT in this task's scope.** Its relationship to
[`0334`](../0334-fix-the-launchers-symlink-blind-agents-fail-safe/brief.md) is stated honestly:
**same root cause** — the guard tests **name existence**, not that a readable regular agent file exists
— but a **different trigger**, and `0334`'s stated scope is **symlink-shaped**, so a fix scoped to
symlinks would miss this. ⚠️ **Flagged for the owner as an open question, unowned today.** Whoever
implements `0334` should be told; do not silently widen it here.

> 🆕 **CORRECTION, 2026-08-24 — the two sentences above are now STALE and are left in place rather than
> rewritten** (append-only correction discipline). **The open question was put to the owner and
> answered**: verbatim label **"Fold into 0334, widen its scope (Recommended)"**, and `0334` was widened
> the same day to carry the wrong-type trigger explicitly. **So it is no longer unowned, and "whoever
> implements `0334` should be told" is discharged — `0334`'s own brief now states it.** ⛔ **The
> operative instruction is unchanged and still binding: do not widen `0334` from here, and do not fix
> the launcher in this task.**

---

### R7 — the skills refusal names only the first offender, and points at the wrong path

`skills_entries_contained()` walks `.claude/skills/fkit-*` and `return 1`s on the **first** `[ -L ]`
hit, so with two or more symlinked entries only one is ever named and the user discovers the rest **one
re-run at a time**. The refusal block then prints, on its own indented line, `$dest/.claude/skills` —
the **real parent** — a few lines above *"Replace the symlinked path with a real directory, then
re-run: fkit"*, so the only full path on screen is a directory that is **not** the problem.

**Reproduced firsthand by the filing producer, 2026-08-24**, by running the guard and the refusal block
verbatim against a tree with `fkit-alpha` and `fkit-zulu` both symlinked out of the project. Measured
output:

```
⚠ skipped the .claude/skills refresh: 'fkit-alpha' is a symlink — fkit will not refresh through one
    <dest>/.claude/skills
  …
  Replace the symlinked path with a real directory, then re-run: fkit
```

⭐ **Two precisions the implementer needs, neither of which softens the finding:**

- `fkit-zulu` is **never mentioned**.
- The offending entry **is** named — but only as a **bare segment in the reason clause**
  (`'fkit-alpha'`, produced by `path_contained`'s `echo "'$_seg' is a symlink — fkit will not $2
  through one"`), never as a path the user can copy. The **only** path printed is the parent.

⛔ **THIS IS NOT A RE-RAISE OF THE OWNER'S GRANULARITY RULING.** That ruling — **verbatim label: "Keep
whole-half refusal (Recommended)"** — **stands, and this task does not reopen it.** The whole skills
half is still refused as one unit; nothing here asks for a per-skill copy loop. **This is a gap against
the fix's OWN stated rationale**, written in §3's comment immediately above the guard:

> *"The message names the offending entry so the user knows which one to move."*

**With two or more offenders it names one of them, and the path it prints is not that entry.** That is
the whole of R7.

---

### 🆕 ⛔ REFINEMENTS PUBLISHED AFTER THIS BRIEF WAS FILED — READ `0327`'s ROUND-2 ***Coder response*** BEFORE PLANNING

⚠️ **This brief was written from `0327`'s REVIEWER-findings rows R6 and R7. The CODER's round-2
response was written afterwards and carries refinements this brief does not** — including one that
**prevents a naive R7 fix from introducing a bug**. ⛔ **Reading only the reviewer rows is not enough.**

**Where to read.** `0327`'s folder moves as it closes — ⛔ **never hard-code `backlog/`**:

```
ls -d ai-agents/tasks/{backlog,done,cancelled}/0327-refuse-the-destructive-claude-refresh-*/
```

Then open that folder's `review.md` and read the two sections under `## Coder response` anchored by
these headings (⚠️ **quoted fragments, never line numbers** —
[durable-citation-anchors](../../../knowledge-base/conventions/durable-citation-anchors.md)):

| Read this | Locate by this quoted fragment |
|---|---|
| the R6 response | *"Every measurement in the row reproduced, and the row is accurate as written"* |
| the R6 scope boundaries | *"Scope boundaries measured, so the follow-up task inherits them rather than re-deriving them"* |
| the R7 response | *"Reproduced, including the one-re-run-at-a-time discovery"* |
| ⭐ **the R7 naive-fix warning** | *"A refinement the follow-up task needs, or it will introduce a bug fixing R7"* |

**Two things it says that change how this task is planned:**

**(a) ⭐ A NAIVE R7 FIX WOULD INTRODUCE A BUG — the path line is CORRECT for the other trigger.**
The refusal message block serves **two** triggers, and the path it prints is right for one of them.
⛔ **A fix that merely re-points that line breaks the case that works today.** ⚠️ **Re-verified
firsthand 2026-08-24 by the producer adding this pointer, by running `path_contained` verbatim against
three trees in `mktemp -d` outside the repo — and it is THREE sub-cases, not the two the ledger names:**

| Trigger | Reason clause names | Path line prints | Correct? |
|---|---|---|---|
| `.claude/skills` **itself** is the symlink (`path_contained ".claude/skills" refresh`) | `'skills'` | `$dest/.claude/skills` | ✅ **CORRECT — this is the offending path** |
| 🆕 **`.claude` itself** is the symlink (same call, earlier component) | `'.claude'` | `$dest/.claude/skills` | ⛔ **wrong — and it resolves THROUGH the link to a real directory outside the project** |
| an **entry** is the symlink (`skills_entries_contained()`) — **R7's case** | `'fkit-alpha'` (bare segment) | `$dest/.claude/skills` | ⛔ **wrong — the parent, not the entry** |

⛔ **So the fix must DISTINGUISH the triggers, not rewrite the line** — and it must handle the middle
row, which neither R7's row nor the coder's refinement names.

**(b) ⚠️ R6's TWO HALVES FAIL DIFFERENTLY — and the ledger's own account of the agents half is WRONG.**
The coder's round-2 refinement states that the agents wipe *"trips the launcher's **hard** fail-safe …
**exit 1**"* and that *"There is **no silent success** in any shape."*

> ⛔⛔ **MEASURED FIRSTHAND 2026-08-24 AND DISPROVEN — do not carry that sentence into the plan.**
> The squatting directory **survives** the failed `rm -f` (the coder's own table one paragraph above
> says so: *"the squatter itself **survives**"*), so it still matches
> `ls "$proj"/.claude/agents/fkit-*.md`. **Measured: `rc=0` — the hard fail-safe is SKIPPED, not
> tripped, and the session starts with ZERO readable agent files.** Control in the same pass: a
> genuinely-empty `.claude/agents/` gives `rc≠0` and the guard fires correctly.

**The corrected asymmetry, which is what the implementer actually needs:**

| | **shape A — agents** | **shape B — skills** |
|---|---|---|
| init | `rc=1`, aborts at the `rm` | `rc=1`, aborts at the `cp` |
| launcher's `setup_ok=0` warning | ✅ printed | ✅ printed |
| launcher's **hard** fail-safe (`exit 1`) | ⛔ **SKIPPED — the squatter satisfies the glob** | ⛔ **SKIPPED — the agents are intact** |
| what the session gets | ⛔ **NO agent file at all** → `claude --agent` dies on *"agent not found"* | agents intact, **partial skill set** |

⭐ **So neither half reaches the hard refusal, and shape A's outcome is the worse of the two** — the
opposite of what the ledger's refinement claims. ⚠️ **This does NOT re-raise the severity:** the four
`low` grounds recorded above are untouched — nothing outside the project is touched, no user-owned path
is destroyed, the only loss is fkit's own gitignored payload, and `rc=1` still routes to the
`setup_ok` warning rather than a silent success. ⛔ **Only the "hard fail-safe / exit 1" sentence is
false; the verdict stands at `low`.**

⚠️ **The launcher half of this is [`0334`](../0334-fix-the-launchers-symlink-blind-agents-fail-safe/brief.md)'s,
not this task's** — `0334` was **widened on 2026-08-24 by owner ruling** (verbatim label
**"Fold into 0334, widen its scope (Recommended)"**) to cover exactly this wrong-type trigger, so the
open question this brief flagged under *"A SECOND, ADJACENT MEASUREMENT"* now **has an owner**. ⛔ **Do
not fix the launcher here.**

**(c) Two scope boundaries the coder measured that this brief does not carry** — inherit them rather
than re-deriving them (they bound the fix's target precisely):

- A real regular file at a **non-payload** name (e.g. `fkit-notapayloadname`) is **harmless** — `rc=0`,
  no error, survives untouched.
- A real **directory** squatter in **skills** **is** deleted and not put back — `rc=0`, gone. So §3's
  *"IS deleted, and is NOT put back"* wording **holds for that shape**.
- ⛔ **Therefore R6 fires ONLY on a wrong-type + payload-name collision** — a **directory** where a
  `*.md` **file** is expected in the agents half, or a **file** where a **directory** is expected in the
  skills half. ⚠️ **This narrows the claim-correction bullet in *What to build*: the sentence is not
  simply false, it is false for one shape and true for the other.**

⛔ **Nothing in `0327`'s folder was written by this pointer** — it was **read only**, and the
disproof above is recorded **here**, not there.

---

### ⛔ Distinguish from `0328` — measured, not assumed

[`0328`](../0328-make-inits-two-mkdir-p-calls-non-fatal-so-a-weird-fkit-or-claude-cannot-abort-setup/brief.md)
owns init's **two `mkdir -p` calls** being fatal. **The overlap was measured at filing and is
effectively nil:**

| | `0328` | **this task (R6)** |
|---|---|---|
| **Abort site** | `mkdir -p` (§3's, and §4's `.fkit` one) | `rm -f` (agents) and `cp -R` (skills) |
| **Trigger** | `.fkit` / `.claude` **themselves** the wrong type, unwritable parent, `ENOSPC` | an **entry inside** a healthy real `.claude/agents` or `.claude/skills` being the wrong **type** |
| **Damage** | init stops; nothing deleted | shape A **deletes the installed fkit agents first** |
| **Its fix's reach** | make `mkdir -p` non-fatal | ⛔ **does not touch `rm`/`cp` at all** |

⭐ **Neither closes the other, and this is stated in `0328`'s own terms:** `0328`'s row 3 is
`.claude` **itself** a regular file — the parent. R6 is **one level below** that, with the parent
perfectly healthy. **`0328` landing does not make this task go away, and this task landing does not
make `0328` go away.**

⚠️ **A shared consideration, not a dependency:** both tasks must decide what init's **exit status**
becomes when a section is skipped. `0328`'s brief argues that decision at length and calls it *"the
load-bearing decision in the task"*. **Read it before deciding here, and say whether you agree**;
whichever lands second must not silently contradict the first.

## What to build

⛔ **THE FIX IS NOT PRE-DECIDED, DELIBERATELY.** A type check alongside `[ -L ]` is the obvious
candidate and it is **not the only one**, and ⚠️ **the two shapes may not want the same treatment** —
shape A must stop deleting *before* it knows it will fail, shape B must stop a `cp -R` colliding with a
survivor the deletion loop could not see. **Argue the choice in the plan.**

- **R6 — close both shapes.** A wrong-type entry squatting an fkit-managed name must not (a) leave the
  project with **zero** fkit agents, nor (b) abort init so that §4, §5 and §6 never run. **Match §3's
  established shape:** warn on stderr, name the offending path, skip that half, carry on — the bar
  `0088` set and the one `0327` adopted for the symlink case.
- **Decide and STATE init's exit status** for the new skipped-half branch, reconciled with `0327`'s
  Q1(a) ruling (symlink refusals leave the status **unchanged**) and with `0328`'s pending decision.
  ⚠️ **`claude/fkit-claude.sh` reads init's status as a three-way signal (`0` / `3` / other) — do not
  change what it means without saying so.**
- **Correct §3's now-narrowed claim** that a squatter *"IS deleted, and is NOT put back"* — true for a
  same-type squatter, **false for a wrong-type one**. Either fix the behaviour so the sentence becomes
  true again, or amend the sentence. **Say which you did and why.**
- **R7 — name every symlinked entry, and print a path the user can act on.** The refusal must list
  **all** offending entries in one run, and the path it shows must be the **offending entry**, not its
  parent. ⛔ **Do not convert the whole-half refusal into a per-entry refusal** — the owner ruled
  `"Keep whole-half refusal (Recommended)"` and it stands.
- **Keep the doctrine intact.** `[ -L ]` still comes **first**, before any `-e`/`-d`/`-f` test — those
  dereference. A type check is **added after** `-L`, never in front of it.

## Verification steps

1. **Shape A asserted on an already-installed project:** a real directory at
   `.claude/agents/fkit-x.md`, with several `fkit-*.md` **and** a user-owned `my-own.md` already
   installed. Assert: init reaches its end, **the installed `fkit-*.md` files are still there**,
   `my-own.md` untouched, the squatter untouched, and §5's `.gitignore` and §6's cleanup **both ran**.
2. **Shape B asserted:** a real regular file at a payload skill's name under `.claude/skills/`. Assert
   init reaches its end, `.gitignore` is written, and the squatting file is untouched.
3. **The user is told, with the real cause and the real path named** — assert on the warning text, and
   assert the raw `rm:` / `cp:` shell error is **not** the only thing the user sees.
4. **The stated exit status is asserted**, and the `ai-agents/`-refused path still returns **`3`**, not
   folded into the new branch.
5. **R7: two symlinked skills entries in one run** — assert **both** are named in a single refusal, and
   that the path printed for each is the entry, not `.claude/skills`. ⚠️ **A one-offender test cannot
   catch this defect** — the shipped code already passes that.
6. **The whole-half refusal is unchanged** — assert the skills half is still skipped as a unit, and no
   per-skill copy loop was introduced.
7. **The symlink cases `0327` closed still pass**, unchanged — live, dangling, and symlink-to-file at a
   payload name.
8. **The ordinary case is untouched:** a normal project still gets agents, skills, intake, gitignore,
   cleanup and summary, and init still exits `0`.
9. **Red-first proof for each new branch**, plus `npm test` green **with the count stated**.
10. ⚠️ **Check whether `test/prove-red.sh` reaches `claude/fkit-claude-init.sh` before claiming mutation
    coverage.** `0046`'s plan records that its only reference to this file is a **comment**, so a new
    guard here is plausibly **unmutated**. ⛔ **If it is, say so plainly** —
    [`0037`](../0037-extend-prove-red-to-reach-init/brief.md) is the open task for that seam.

## Notes

- **Owner: fkit-coder** — a production change to `claude/fkit-claude-init.sh`.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Why one task and not two:** owner-ruled, **verbatim label "Fold into R6's task (Recommended)"**.
  ⚠️ **Recorded honestly against this skill's decompose-first rule:** on independent shippability R6
  and R7 could each ship alone. The owner's reason — *"Same file, same refusal path, both low — one
  task, one proof pass"* — is accepted; the one imprecision in it (they are the same **section**, not
  the same **path**) is corrected in `## Context` and changes nothing about the ruling.
- ⛔ **Not a regression from `0327`.** Pre-existing at `HEAD`, verified against
  `git show HEAD:claude/fkit-claude-init.sh`, with the *"byte-identical"* wording corrected to
  *"same commands, re-indented"*. `0327` stays closed with whatever status it landed with; **no
  `## Status` was changed anywhere by this filing.**
- **Does not duplicate `0328`** — the table in `## Context` measures the overlap; different abort site,
  different trigger, different damage, and `0328`'s fix does not reach `rm`/`cp`.
- **Related and NOT closed by it:** `0329` (§5's `.gitignore` question), `0330` (the launcher's `.fkit`
  writes), `0332` (the hard-link shape), `0334` (the launcher's read-side fail-safe — ⚠️ **updated
  2026-08-24: `0334` was WIDENED by owner ruling to cover the wrong-type trigger, so the adjacent
  measurement in `## Context` now HAS an owner; see the correction note there**), `0037`
  (`prove-red`'s reach into init).
- 🆕 **POINTER ADDED 2026-08-24 by a second spawned `fkit-producer`, no owner channel** (ADR-021).
  **What was added:** the `### 🆕 ⛔ REFINEMENTS PUBLISHED AFTER THIS BRIEF WAS FILED` section in
  `## Context` (directing the planner to `0327`'s round-2 ***Coder response*** by quoted anchor), the
  dated correction note on the *"A SECOND, ADJACENT MEASUREMENT"* section, and these two `## Notes`
  lines. ⛔ **What it did NOT change: `## Status` (`🔲 Backlog`), `## Priority` (`Unscheduled`),
  `## Sprint` (`Backlog`) and `## Owner` (`fkit-coder`) are byte-identical**; no board row was touched;
  no re-rank
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md));
  the fix stays **deliberately not pre-decided**; `0327`'s folder was **read only**.
  ⚠️ **One claim in `0327`'s round-2 ledger is DISPROVEN by that section** (*"trips the launcher's hard
  fail-safe … exit 1"* / *"no silent success in any shape"*). **The disproof is recorded HERE, not in
  `0327`** — a review ledger's findings are that role's to amend, and **correcting it there is returned
  to the owner as an open question.** ⛔ **It does not change R6's `low` verdict.**
- **Risk: low.** The change *removes* an abort and *stops* a delete. The real risk is the **exit-status
  decision**, shared with `0328` — that is where review attention belongs.
- ⛔ **Out of scope:** `claude/fkit-claude.sh` in any form (`0330`, `0334`); the whole-half-refusal
  granularity ruling; §4's `.fkit` writes; the two `mkdir -p` calls (`0328`); any
  `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md));
  any re-rank
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md));
  any task-file move
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- **Evidence sources:** `0327`'s task-folder `review.md`, reviewer-findings rows **R6** and **R7**
  (read only). Every measurement in this brief — both R6 shapes, the user-file survival, the
  `git show HEAD:` pre-existence check, the two-offender R7 run, and the launcher fail-safe probe — is
  the **filing producer's own**, executed 2026-08-24 in scratch directories outside the repo. **The repo
  working tree was not modified by them and the launcher was not executed.**
- ⛔ **Filed by a spawned `fkit-producer` with NO owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):
  **appended to the Backlog board, unranked; nothing was re-ranked by this filing.** The Backlog board
  is unranked by design, so there is no merit position to state — `## Priority` reads `Unscheduled` and
  the board's Priority cell reads `—`.
