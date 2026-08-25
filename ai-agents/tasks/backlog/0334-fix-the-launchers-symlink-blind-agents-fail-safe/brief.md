# Fix the launcher's name-existence agents fail-safe — a symlink escape, a dangling name, and a wrong-type squatter all satisfy it, and the session starts with no agent it can read

## ID
0334

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ⚠️ THIS BRIEF WAS WIDENED ON 2026-08-24 — READ THIS FIRST

**Owner ruling 2026-08-24**, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**The option label is the verbatim text: "Fold into 0334, widen its scope (Recommended)"**. Chosen-option
description as presented to the owner, verbatim:

> *"The producer's pick. Identical root cause — one fix closes symlink, dangling and wrong-type in one
> act. One edit to 0334 now, before anyone plans it. Cost: widens a filed brief and grows its
> verification table by two cases."*

The question the ruling answered, verbatim:

> *"I verified it: the launcher's agents fail-safe also passes on a WRONG-TYPE squatter — a directory
> named `fkit-x.md` gives rc=0, guard skipped, session starts with no agent. That's a third trigger on
> the same `if` (symlink escape, dangling name, wrong type), all one root cause: the guard tests NAME
> EXISTENCE, not that a readable regular agent file exists. 0334 fixes that `if` but its stated scope is
> symlink-shaped, so a fix written to it would miss this."*

#### ⛔ THE ROOT CAUSE — this one line is what makes a single fix sufficient

> **The guard tests NAME EXISTENCE, not that a readable regular agent file exists.**

⭐ **Three triggers, one root cause, one `if`.** Every row below is a distinct way to satisfy mere name
existence; none of them is a distinct bug:

| Trigger | Measured |
|---|---|
| **symlink escape** — `.claude` or `.claude/agents` is a link pointing outside the project | the shell glob expands **through** the link; guard **skipped**; the matched path resolves **outside the project** |
| **dangling name** — `.claude/agents/fkit-*.md` is a link whose target does not exist | plain `ls` **rc=0** → guard **skipped**; `ls -L` rc=1 |
| **wrong type** — a real **directory** named `fkit-x.md` | ⛔ **rc=0 → guard skipped**; genuinely-empty control **rc≠0**, guard fires correctly |

⚠️ **A fix written only to the symlink shape misses the wrong-type shape**, which is why this brief was
widened rather than a fourth row filed. ⛔ **The three triggers are ONE deliverable — do not split them,
and do not close this task having closed only some of them without saying which and why** (see
*What to build*).

⚠️ **The folder slug still reads `…-fix-the-launchers-symlink-blind-agents-fail-safe` and is now
narrower than the scope** — it says "symlink-blind", and two of the three triggers involve no symlink at
all. It was deliberately left unchanged: renaming the folder would break the board's Brief-cell href and
every inbound citation, and the durable identity of a task is its `NNNN` prefix, not its slug
([`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
**The `# H1` above is authoritative over the slug.** Whether the folder should be renamed is **returned
to the owner as an open question, not decided here.**

⚠️ **⛔ READ THIS FIRST — THE SECOND-HAND MECHANISM IN THIS FINDING'S THREE SOURCE RECORDS IS WRONG,
AND THE CORRECTION IS IN THIS BRIEF, NOT IN THEM.** Every prior record of this defect says the cause is
that **`ls` dereferences**. ⛔ **Measured firsthand 2026-08-24, that is not the mechanism**, and one of
the two shapes it misses is a defect the sources never noticed. **The DEFECT is real and confirmed by
execution; the EXPLANATION was wrong.** Details in *"What was actually measured"* below. ⚠️ **A plan
that arrives here reasoning from "`ls` dereferences" will pick the wrong fix** — in particular it will
reach for `ls -L`-style thinking, which does not address the primary shape at all.

### The defect

`claude/fkit-claude.sh` carries a fail-safe that decides whether there is anything to launch into. Its
comment reads, verbatim:

> `# The promise is "a setup failure never costs you a project that ALREADY has its agents" — not "fkit`
> `# can start a session out of nothing". If setup failed AND no fkit agent was ever written to disk,`
> `# there is nothing to launch into: `claude --agent fkit-<role>` cannot resolve an agent file that does`
> `# not exist, and it would die on its own confusing "agent not found". Say so plainly instead.`

and it tests with, verbatim:

```sh
if [ "$setup_ok" = 0 ] && ! ls "$proj"/.claude/agents/fkit-*.md >/dev/null 2>&1; then
```

⚠️ **This is at `:387` at `c45ec3d`, and `claude/fkit-claude.sh` is unmodified in the working tree
there — so the number is current in both.** ⛔ **Anchor on the quoted `if` line, not on `387`**
([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).

**On a project whose `.claude`, or `.claude/agents`, is a symlink pointing outside the project, this
test SUCCEEDS on the escaped agent copies at the link target.** The guard does not fire, and the
launcher proceeds to `claude --agent fkit-<role>` — **starting a session that reads its agent
definitions from outside the project**, which is precisely the state the fail-safe exists to catch.

### What was actually measured — and where it departs from the three source records

**Method, 2026-08-24:** five throwaway projects under a `mktemp -d` scratch root outside the repo; the
exact test expression from the launcher run against each; `rm -rf`'d after. ⛔ **The repo working tree
was not modified, and `claude/fkit-claude.sh` was not executed** — the expression was exercised in
isolation, under **both** `/bin/sh` and `/bin/bash` (the launcher's shebang is `#!/bin/sh`), with
identical results in both shells.

| Case | Shape | Result |
|---|---|---|
| **A** | `.claude` → a directory outside the project, holding `agents/fkit-coder.md` | ⛔ **rc=0 — guard SKIPPED, session starts** |
| **B** | `.claude/agents` → a directory outside the project | ⛔ **rc=0 — guard SKIPPED, session starts** |
| **C** | `.claude/agents/fkit-coder.md` is itself a symlink to an outside file | ⛔ **rc=0 — guard SKIPPED, session starts** |
| **D** | control: real `.claude/agents/`, genuinely empty | ✅ rc≠0 — guard FIRES and refuses |
| **E** | `.claude/agents/fkit-coder.md` is a **DANGLING** symlink (target does not exist) | ⛔ **rc=0 — guard SKIPPED, session starts** |
| **F** 🆕 | `.claude/agents/fkit-x.md` is a real **DIRECTORY** — no symlink anywhere | ⛔ **rc=0 — guard SKIPPED, session starts with NO agent file** |

⭐ **Case F was added by the 2026-08-24 widening and is a SEPARATE, LATER measurement — not one of the
original five.** Measured by the widening producer the same day, under `/bin/sh` (the launcher's
shebang) and again under the session shell, in `mktemp -d` scratch roots outside the repo; ⛔ **the repo
working tree was not modified and `claude/fkit-claude.sh` was not executed** — the `if`'s test
expression was exercised in isolation, exactly as cases A–E were. **Control re-run alongside it in the
same pass:** a real, genuinely-empty `.claude/agents/` gives **rc≠0** and the guard fires correctly, so
F is not an artefact of the harness.

⚠️ **Case F is the shape that arrives via [`0336`](../0336-guard-inits-claude-refresh-against-a-wrong-type-squatter-and-name-every-symlinked-entry/brief.md)'s
R6 shape A**, where init's `rm -f` deletes every real `fkit-*.md`, fails on the squatting directory, and
leaves that directory as the **only** thing the glob can still match. ⛔ **So F is not a curiosity — it
is the end state of a defect that already has an owning task**, and this guard waves it through.

**Case A, resolved:** the glob matched
`<proj>/.claude/agents/fkit-coder.md`, whose `pwd -P` resolution is
`<scratch>/outside/agents/fkit-coder.md` — **outside the project.** The escape is confirmed by
resolution, not inferred.

⭐ **Two corrections to the record, both load-bearing for the fix:**

1. ⛔ **The mechanism is the SHELL GLOB, not `ls`.** `"$proj"/.claude/agents/fkit-*.md` is expanded by
   the shell before `ls` ever runs, and **pathname expansion traverses symlinked directories** — that
   is what reaches the escaped copies in cases A and B. `ls` then merely stats paths that already
   exist. ⚠️ **So a fix that changes only how `ls` is called cannot close cases A and B**; the
   traversal has already happened.
2. 🆕 **The guard is WEAKER than "dereferences" — it passes on a DANGLING link (case E), which nothing
   in the source records anticipated.** Measured in isolation: plain `ls <dangling-link>` exits **0**
   (BSD `ls`, no `-L`); `ls -L <dangling-link>` exits **1**. ⛔ **So the check is satisfied by mere
   NAME existence.** ⚠️ **The consequence is exactly the failure the comment above says the guard
   exists to prevent:** a project whose agent files are broken links starts a session, and
   `claude --agent fkit-<role>` then **"die[s] on its own confusing 'agent not found'"** — the guard
   was standing right there and waved it through. ⛔ **This shape is NOT recorded in any of the three
   provenance sources; it is new here.**
3. 🆕 **NO SYMLINK IS NEEDED AT ALL (case F).** A real directory at an `fkit-*.md` name satisfies the
   check outright. ⛔ **This is the proof that the root cause is name existence and not link handling**:
   there is nothing to dereference, nothing to resolve, and the guard still passes. ⚠️ **It also means
   the word "symlink" cannot appear in the fix's acceptance criteria** — two of the three triggers are
   not symlinks.

#### ⛔⛔ THE `ls -L` TRAP — MEASURED, AND IT CATCHES EXACTLY ONE OF THE THREE

⚠️ **`-L` is the first thing a reader reaches for after correction 2, and on its own it is an
INCOMPLETE FIX that looks complete.** Re-measured 2026-08-24 during the widening, all three triggers in
one pass:

| Trigger | plain `ls` | `ls -L` |
|---|---|---|
| symlink escape (case A — the **primary** shape) | rc=0 | ⛔ **rc=0 — STILL SKIPPED** |
| dangling name (case E) | rc=0 | ✅ rc=1 — fires |
| wrong type (case F) | rc=0 | ⛔ **rc=0 — STILL SKIPPED** |

⛔ **`ls -L` closes the DANGLING shape and nothing else.** On the primary symlink shape the glob has
already traversed the link before `ls` runs, so there is a real file at the end of it and `-L` is
satisfied; on the wrong-type shape the directory genuinely exists, so `-L` is satisfied too.
⚠️ **Anyone "fixing" this with `-L` alone ships one third of the fix and a green test suite.**

### Why this is worth doing rather than moot — the state is historical, not extinct

⚠️ **State it plainly, because the obvious objection is "the init bugs are fixed, so nobody can get
here any more":**

- ✅ **A FRESH project can no longer reach this state.** [`0046`](../../done/0046-gate-symlink-escape-in-init-intake-write/brief.md)
  and [`0327`](../../done/0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim/brief.md)
  closed the init-side escapes that created it.
- ⛔ **ANY PROJECT THAT RAN A BUGGY INIT BEFORE THOSE LANDED STILL HAS THE ESCAPED COPIES ON DISK
  TODAY**, and **this fail-safe still mis-reads that project on every launch.** Closing the *source* of
  a bad state does not repair the machines already in it. **That is the whole reason this task exists.**
- ⛔ **And cases E and F are not historical at all** — a dangling agent symlink needs no buggy init to
  arise (a moved or deleted target is enough), and **case F needs no symlink and no buggy init either**:
  a real directory at an `fkit-*.md` name is reachable on a fully current install, and
  [`0336`](../0336-guard-inits-claude-refresh-against-a-wrong-type-squatter-and-name-every-symlinked-entry/brief.md)'s
  R6 shape A **produces exactly that state today**. ⭐ **So two of the three triggers survive every init
  fix that has landed, and the third survives on every machine that ran a buggy init.**

⚠️ **Do not restate the first bullet as though it settled the task.** It bounds the *blast radius*, not
the *validity*.

### Provenance — recorded three times, owned zero times

Surfaced during [`0327`](../../done/0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim/brief.md)'s
planning and carried forward without an owner ever since:

| Where | Quoted anchor (⚠️ **quote first, number second**) |
|---|---|
| `0327`'s `plan.md`, **§6 Q1** *("When `.claude/agents` is refused, should init still exit 0?")* | *"And note the launcher's fail-safe is **already** symlink-blind: its `ls "$proj"/.claude/agents/fkit-*.md` **dereferences**, so on a project that ran the buggy init once, it finds the escaped copies at the link target and starts a session reading agents from outside the project."* |
| `0327`'s `plan.md`, the **Q1(a) accepted-consequence note** | *"The launcher's symlink-blind fail-safe (§6 Q1's ⚠️ note) is **not** repaired by this task and remains a live, unowned observation."* |
| `0327`'s `worklog.md` | *"fail-safe (`fkit-claude.sh`'s `ls .claude/agents/fkit-*.md` dereferences) is **not** repaired here"* |
| `0327`'s **Round-1 review**, under *"Confirmed recorded, not re-litigated"* | *"It has **no owning task** — `0330` covers the launcher's `.fkit` **writes**, not this read."* |

⛔ **Those four records are the source of the finding and were READ ONLY** — a coder was actively
writing in `0327`'s folder while this brief was filed, and **nothing in it was edited.** ⚠️ **Their
"dereferences" wording is left byte-identical and is CORRECTED HERE, not there** — see the two
corrections above. **Whoever plans this task should not treat those four sentences as the technical
brief; treat this section as the technical brief.**

⚠️ **The Q1(a) ruling of 2026-08-24 is what left this unowned deliberately, not by oversight** — it
reads *"⛔ Do **not** add a new exit code; do **not** touch `claude/fkit-claude.sh`."* **This task is the
separate row that ruling anticipated.** ⛔ **It does not reopen Q1(a)** — init's exit status stays
exactly as `0327` shipped it; this task changes only the launcher's own read.

## What to build

- **Make the launcher's agents check require what it was always meant to require: at least one
  READABLE, REGULAR agent file INSIDE the project.** ⛔ **Stated positively on purpose** — an
  enumeration of the three bad shapes is not the deliverable, because the root cause is that the check
  asks the wrong question. **All three triggers, or state explicitly which is deferred and why:**
  - **symlink escape** — a match that resolves outside the project (cases A, B, C)
  - **dangling name** — a name with nothing behind it (case E)
  - 🆕 **wrong type** — a directory, or anything that is not a regular readable file, at an `fkit-*.md`
    name (case F)
  ⚠️ **A check phrased as "not a symlink" fails case F; a check phrased as "exists" fails all three.**
- ⭐ **DECIDE FIRST, AND STATE, HOW THE CHECK IS OBTAINED — this is the design question in the task, and
  ⛔ IT IS DELIBERATELY NOT PRE-DECIDED HERE.** Candidates, each with a real cost:
  - **(i) An `lstat`-based check** (`[ -L ]` per component, plus `[ -f ]` on the leaf so a dangling
    link fails). No new file; must be written so the glob's traversal is not what decides.
  - **(ii) `find "$proj/.claude/agents" -maxdepth 1 -type f -name 'fkit-*.md'`.** `find` does not
    follow symlinks by default and `-type f` excludes links outright — ⚠️ **but verify that firsthand
    for cases A and B, where the escape is in an ANCESTOR of the search root, not the leaf.** ⛔ **Do
    not assume `-type f` covers a symlinked `.claude`; measure it.** ⭐ **`-type f` does look like it
    covers case F for free** (a directory is not a regular file) — ⛔ **measure that too rather than
    assuming it, and note that "covers F" is not "covers A and B", which is where this candidate's real
    risk sits.**
  - **(iii) Reuse init's `path_contained`.** ⛔ **The launcher CANNOT call it as the code stands:**
    `path_contained()` is defined in `claude/fkit-claude-init.sh` and **the launcher never sources
    init** — it *executes* it as a subprocess (`"$here/fkit-claude-init.sh" "$proj"`). Reuse therefore
    needs a **new shared seam**, which is a design choice with its own cost.
    - ⭐ **Precedent that cuts both ways, and it must be weighed rather than cited:** the launcher
      **already** sources one shared file — `. "$here/skills-for-role.sh"` — so the seam shape exists
      and is not novel. ⚠️ **But that file was extracted for the PreToolUse hook under ADR-012, and
      adding another install-share file may owe a `claude/structure-manifest.tsv` regen** — check
      `RELEASING.md` and the manifest before choosing this, and note **`0188` is the open
      manifest-regen row that a stray regen would collide with.**
- ⛔ **Preserve the guard's existing promise exactly:** *"a setup failure never costs you a project that
  ALREADY has its agents."* ⚠️ **A fix that tightens the check into firing on a healthy project is
  strictly worse than the bug** — it refuses to launch a working install. **The ordinary case must stay
  byte-identical in behaviour.**
- ⛔ **Do not drop `--agent` on any path.** The comment above the guard records why, and it is an
  ADR-010 fail-open hazard: *"an unroled session carries no ADR-010 lockdown, so it would fail OPEN —
  every role's skills live at once. Refusing is the safe answer."*
- **Decide and state what the refusal MESSAGE says** when the cause is an escape, a dangling link, or a
  wrong-type squatter rather than a plain absence. ⚠️ **The current text — *"fkit has no agents installed
  here… check that $proj is writable"* — names writability, which is false for all three new shapes**
  and sends the user to the wrong thing. ⭐ **Case F is the one where the message matters most**: the
  user's project looks populated (there IS a `fkit-x.md`), so *"no agents installed"* reads as simply
  untrue and *"is $proj writable"* sends them somewhere with nothing wrong. **Naming the offending path
  is what makes this actionable** — the bar `0336`'s R7 is being held to in the sibling script. ⛔ **Keep the existing wording for the case it was written for**; the fix is to stop
  every cause inheriting it. ⚠️ **This is the SAME defect CLASS as `0330`'s `:336` misdiagnosis but a
  DIFFERENT SITE and a different message** — see the overlap note below.

## Verification steps

- **Each of cases A, B, C, E and F above is refused**, asserted separately, each with the launcher's own
  message checked — ⛔ **not merely a non-zero exit**, since the guard already exits non-zero for the
  unrelated empty-directory reason and a test asserting only rc would pass a fix that never ran.
- 🆕 **Case F asserted on its own row — a real DIRECTORY at `.claude/agents/fkit-x.md`, no symlink
  anywhere in the tree.** ⛔ **A symlink-shaped test cannot stand in for it**, and a fix that only
  handles links will pass every other row while failing this one.
- 🆕 **Case D, the genuinely-empty control, asserted in the SAME pass as F.** ⛔ **This pairing is the
  point, not bookkeeping:** D and F differ only in whether a name exists, both must refuse, and D is
  what proves a fix has not simply been switched off. ⚠️ **A control asserted in a different run, or
  inherited from the existing suite, does not discharge this** — the two must be measured against the
  same code in the same pass.
- **The ordinary healthy project still launches** — assert the launcher reaches the exec with `--agent`
  intact.
- ⭐ **A `fkit-*.md` that is a real regular file but UNREADABLE (mode `000`) — decide and state whether
  it refuses or launches, and assert whichever you chose.** ⚠️ **Named because *"a readable regular
  file"* is the criterion this task adopts and that phrase makes a claim about readability** — ⛔ do not
  leave it unasserted and do not let it become a fourth trigger discovered later.
- ⭐ **Assert the `setup_ok = 0` gate is unchanged.** The guard only runs when setup failed; ⛔ **a fix
  that accidentally makes it run unconditionally would refuse healthy projects on every launch.**
- ⚠️ **`test/harness.mjs`'s `manifest()` walks only the project and CANNOT see an escaped target** —
  a test that asserts only over the project tree will pass while the bug is live. **Assert on the
  launcher's observed behaviour (message / exec), not on a project-tree manifest.**
- **Run against a stubbed `claude` binary on `PATH`** so the exec is observed rather than performed.
- ⛔ **Every reproduction uses `mktemp -d`** — never a fixed path, never against the repo.
- **`npm test` green, with the count stated.**
- ⚠️ **Check whether `test/prove-red.sh` reaches `claude/fkit-claude.sh` before claiming mutation
  coverage; if it does not, say so plainly rather than letting it pass unremarked.** (`0037` is the
  open row for `prove-red.sh`'s reach — see Notes.)

## Notes

- **Owner: fkit-coder** — a production launcher (`claude/fkit-claude.sh`) change.
- **Depends on:** nothing.
- ⛔⛔ **NOT COVERED BY `0330`, AND NEITHER CLOSES THE OTHER — MEASURED, NOT ASSERTED.** The overlap was
  determined by reading `0330`'s brief and the launcher itself, 2026-08-24:

  | | This task (`0334`) | [`0330`](../0330-gate-the-launchers-fkit-lockdown-writes-against-a-symlinked-fkit/brief.md) |
  |---|---|---|
  | **Direction** | **READ** — a `ls`/glob test that decides whether to launch | **WRITE** — `mkdir -p` and `printf >` that create and overwrite |
  | **Path** | `$proj/.claude/agents/` | `$proj/.fkit/` |
  | **Sites** | the single `if` at `:387` | `:319`, `:331`, `:332` |
  | **Harm** | a session silently reads agents from OUTSIDE the project | user content OUTSIDE the project is created and **overwritten** |
  | **Failure mode** | guard fails **OPEN** — it approves a state it exists to refuse | silent **escape**, never an abort; the ADR-010 lockdown still applies inline, so it fails **SAFE** |

  ⭐ **The only genuine overlap is doctrinal, and it is worth naming because it is the argument for
  sequencing rather than for merging:** both rows want a containment check in the same script, and
  **both list "reuse init's `path_contained` via a new shared seam" among their candidate fixes** —
  `0330`'s brief spells out the same three options (extract / duplicate / source) for the same reason
  (*"the launcher does not source it"*). ⚠️ **So whichever lands SECOND should reuse the seam the first
  one built rather than inventing a second one**, and its plan should say which it found. ⛔ **That is a
  reuse note, not a dependency** — neither task blocks the other, and each is independently shippable
  with a local check if the other never lands. ⛔ **Do not merge them and do not close either on the
  other.**
- ⛔ **Related, and explicitly NOT closed by this task** — each checked against its own brief:
  - **`0328`** — init's two `mkdir -p` calls aborting. **Different file** (`fkit-claude-init.sh`), and
    an *abort* shape, not a read shape.
  - **`0329`** — init's `.gitignore`-is-a-symlink product decision. Different file, and a decision row.
  - **`0330`** — the launcher's `.fkit` **writes**. See the table above.
  - **`0332`** — init's `.fkit/interview` **hard link**. ⛔ **A different link class entirely** —
    hard-link membership is an inode property no per-component symlink test can ask about.
  - **`0037`** — extends `prove-red.sh` to reach `fkit-claude-init.sh`. ⚠️ **Adjacent but not
    sufficient: `0037`'s stated reach is INIT, and this task's code is the LAUNCHER** — so `0037`
    landing does not by itself give this change mutation coverage. **Say which is true at plan time
    rather than assuming either way.**
  - **`0045`** — the **read**-side symlink hazard under **`ai-agents/`**, in **init**. ⚠️ **Closest
    relative of the six — same direction (read), same hazard class — but a different script and a
    different tree.** ⛔ **Neither closes the other.**
  - 🆕 **[`0336`](../0336-guard-inits-claude-refresh-against-a-wrong-type-squatter-and-name-every-symlinked-entry/brief.md)**
    — init's wrong-type squatter (R6) and its skills-refusal message (R7). ⭐ **The CAUSE-AND-EFFECT
    pair for case F, and the relationship must be stated correctly or one will be closed on the other:**
    `0336`'s R6 shape A is how a project **arrives** at case F (init's `rm -f` wipes the real agents and
    leaves the squatting directory behind); **this task** is why the launcher then **fails to notice**.
    ⛔ **Neither closes the other, and each is independently shippable:** `0336` landing stops the state
    being *created* by init, and this task's guard would still be wrong for a squatter arriving any
    other way; this task landing makes the launcher refuse, and init would still wipe the agents.
    ⚠️ **Do not merge them — different scripts, different owners of the defect, different fixes.**
- ⚠️ **Residual this task cannot close:** the TOCTOU window between any check and the subsequent exec is
  not closable in POSIX shell — `claude/fkit-claude-init.sh` already records exactly this residual for
  its own guards. **This guard inherits it; it does not widen it.**
- **Risk: low-to-moderate.** The change is one `if` in a well-commented block, but it sits on the path
  that decides whether a session starts at all — ⭐ **review attention belongs on "does a healthy
  project still launch", not on the containment walk.**
- ⛔ **Out of scope:** `0327`'s init §3 fix and its **Q1(a) exit-status ruling** (⚠️ **do not reopen**),
  the launcher's `.fkit` writes (`0330`), init's `mkdir -p` fatality (`0328`), `.gitignore` (`0329`),
  the hard-link shape (`0332`), `prove-red.sh`'s reach (`0037`), init's `ai-agents/` reads (`0045`),
  regenerating `claude/structure-manifest.tsv` speculatively (**`0188` owns it**), any
  `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  any re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  and any task-file move ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- **Evidence sources:** the four `0327` records quoted under *Provenance* (⛔ **read-only; that folder
  was not edited**), `0330`'s brief (for the overlap table), and `claude/fkit-claude.sh` itself at
  `c45ec3d`. ⭐ **The five-case measurement table, the glob-versus-`ls` correction and the dangling-link
  finding are the filing producer's OWN firsthand measurements**, executed 2026-08-24 in `mktemp -d`
  scratch directories outside the repo; **the repo working tree was not modified by them and the
  launcher itself was not executed.**
- **Owner ruling 2026-08-24 — this row exists by an explicit owner decision**, given live via
  `AskUserQuestion` in an `fkit lead` session driving `/fkit-sprint-ship-loop` and relayed to a spawned
  `fkit-producer` with no owner channel
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **The option label is the verbatim text: "File it as its own task (Recommended)"**. Option
  description as presented to the owner, verbatim:
  > *It is a distinct defect in a distinct file with no owner. Recording it in two artifacts nobody
  > re-reads is how it gets lost — and it silently defeats the fail-safe that exists to catch exactly
  > this state.*
- ⛔ **Filed by a spawned `fkit-producer` with NO owner channel** (ADR-021): **appended, unranked;
  nothing was re-ranked by this filing and no `## Status` was changed anywhere.**
- 🆕 **WIDENED 2026-08-24 by a second spawned `fkit-producer`, on the owner ruling quoted verbatim at
  the top of `## Context`** (label **"Fold into 0334, widen its scope (Recommended)"**), relayed by an
  `fkit lead` session driving `/fkit-sprint-ship-loop`; the widening producer had **no owner channel**
  (ADR-021). **What the widening changed:** the `# H1`, the root-cause statement and three-trigger table,
  measurement case **F**, correction **3**, the `ls -L` trap table, the *What to build* criterion, two
  *Verification steps* rows (case F and the paired genuinely-empty control), and this note.
  ⛔ **What it did NOT change: `## Status` (`🔲 Backlog`), `## Priority` (`Unscheduled`), `## Sprint`
  (`Backlog`) and `## Owner` (`fkit-coder`) are byte-identical**, no board row's status or rank was
  touched, no re-rank was performed
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  **the folder was not renamed**, and the fix remains **deliberately not pre-decided**.
- ⚠️ **Open question returned to the owner by the widening, not decided here:** whether this folder's
  slug should be renamed now that it reads narrower than the scope. **The `# H1` is authoritative in the
  meantime.**
