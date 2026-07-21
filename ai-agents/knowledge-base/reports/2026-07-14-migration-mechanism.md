# Investigation — a version-to-version migration mechanism

- **Date:** 2026-07-14 · **Revision 2** (supersedes rev 1 of the same date) · **Corrected 2026-07-14
  post-implementation — see §0.1**
- **Kind:** investigation / evaluation (feeds an owner decision; ADR only if the owner rules for one)
- **Author:** fkit-architect, at the request of the coder, per
  [`ai-agents/tasks/backlog/design-version-to-version-migration-mechanism.md`](../../tasks/done/0032-design-version-to-version-migration-mechanism/brief.md)
- **Rev 2 exists because** rev 1 went through an adversarial review on Codex and **did not survive
  intact.** Two factual claims were false. The substitute I proposed had not been held to the safety
  standard I applied to the idea I rejected. §0 lists every correction. The headline changed.
- ⚠️ **A rev-2 claim was subsequently FALSIFIED by implementation and review** — the `cp -R`
  "writes outside the project" claim in §8. It was wrong. **§0.1 is the correction**, and it is where
  a reader should go before trusting anything in §8's "refuse on weird state" row. The conclusion the
  claim supported survives; the claim does not.
- **Status:** open — awaiting the owner's review gate. **No implementation is authorized by this
  report.** Per the brief, an obvious build is a *finding*, not a licence.

---

## 0. Corrections to revision 1 — read this first

| # | Rev-1 claim | Status | Correction |
|---|---|---|---|
| C1 | "This repo — the only known consuming project — **is not drifted**." | **FALSE. Retracted.** | `diff ai-agents/README.md claude/scaffold/ai-agents/README.md` is **non-empty right now**. The counterexample was in my own working tree while I wrote the sentence. §3. |
| C2 | "The migration problem has a **known population of zero**… That asymmetry should decide this." | **Retracted as a load-bearing argument.** | It rested on C1, so it falls with it. The recommendation is **re-based entirely on the shape argument** (§6), which never needed it. |
| C3 | "Additive convergence converges a project from **any** prior version in a single pass." | **FALSE as written.** | It converges **paths**. It cannot converge **content**, and content has already drifted (§3). The sentence over-claimed by generalising a path-only proof to all migration need. |
| C4 | "Zero renames, zero deletions, ever" | **True — but only of paths.** | The evidence (`git log --name-status` across three scaffold eras) proves *directory existence never regressed*. Content drift is **invisible** to that evidence. The proof was sound; the generalisation drawn from it was not. |
| C5 | The `migration-current.md` rejection's **#1 "fatal" reason** ("no per-project cursor") | **Weak. Replaced.** | A cursor is *cheap* — `fkit-claude-init.sh:66` already writes durable per-project state. The genuinely fatal version is that **`.fkit/` is gitignored** (§6). Anyone who "fixed" my stated objection would wrongly conclude the rejection collapsed. |
| C6 | Safety table rated dry-run / rollback / refuse-on-dirty "not required" for my substitute | **Under-scrutinised. Rebuilt.** | I gave the thing I rejected a hostile read and the thing I proposed a friendly one. §8 is the honest table. Four properties I rated "not required" are **required**. |
| C7 | "The `.fkit/` cleanup is **safe by construction: fkit-owned and gitignored**." | **Asserted, not proven — and partly false.** | `.fkit/settings` is **live state of the current runtime** (`fkit-claude.sh:257-268`), not dead Omnigent residue. My own deletion list named it. §9. |

**What survived the adversarial pass unbroken:** the **rejection of `migration-current.md`**. Codex
could not break it. It stands, and §6 re-makes it on stronger ground than rev 1 used.

---

## 0.1 Correction to revision 2 — added 2026-07-14, *after* implementation

This report is a dated record of a moment. It made a claim that turned out to be **false**, and the
falsification came from the people who went and tried it. Recording that here rather than quietly
editing the sentence away.

| # | Rev-2 claim (§8, "refuse on weird state" row; Evidence index) | Status | Correction |
|---|---|---|---|
| C8 | "`ai-agents/` is a symlink — `[ -e ]`/`[ -d ]` **dereference** (verified), and `cp -R` then writes **through** the link, i.e. **outside the project** (verified)." | **The first half is TRUE. The second half is FALSE. Retracted.** | `cp -R` does **not** write outside the project, on any platform tested. The word "verified" was doing work it had not earned: I verified the `[ -e ]` dereference and then *inferred* the `cp -R` write-through from it without testing that step. **The inference was wrong, and I labelled it as tested.** That is the same failure mode as C1 — a claim that flattered the conclusion I wanted. |

**Who falsified it, and how:**

- **fkit-coder**, implementing task 26/27, could not reproduce the write-through on **macOS/BSD `cp`**:
  against a **dangling** symlink destination `cp -R` **refuses** — `cp: …/ai-agents: File exists`, rc=1
  — and writes **nothing** outside the project.
- **fkit-reviewer** settled the Linux question in a Debian container: **GNU coreutils 9.1 `cp -R`
  refuses too** (rc=1, the outside path is **not** created). **BusyBox refuses too.** Codex confirmed
  from the GNU manual that the historical write-through behavior occurs only under `POSIXLY_CORRECT`.

**So: no write-outside-the-project bug ever shipped.** There was never an exfiltration hazard in the
code as it stands. Any downstream document that repeats "fkit could write outside your project" is
repeating my error.

### The §8 conclusion — "refuse on weird state" — **survives, on true and partly stronger grounds**

The row stays **REQUIRED**. Its rationale is replaced wholesale by the three grounds below. Read these
in place of the row as originally written; the row itself is annotated in §8.

1. **Dangling symlink → the launcher is BRICKED.** `cp -R` refuses, rc=1, and under
   `set -euo pipefail` (`fkit-claude-init.sh:18`, called unguarded at `fkit-claude.sh:281,283`) init
   **dies and `fkit` never starts**. This is a **denial-of-service** bug, not an exfiltration bug —
   which is *less alarming and more real* than what I claimed. It is the row's strongest present-tense
   ground, and I missed it while chasing a scarier story. *(Now fixed by task 26 — non-fatal init.)*

2. **Live symlink → GNU `cp` genuinely DOES write through** (fkit-reviewer verified: rc=0, the scaffold
   lands outside the project). This is **unreachable today** — and only by accident: `[ -e ]`
   dereferences the live link, sees "exists", and short-circuits to *"left as-is"*, so the `cp` never
   runs. **The thing that arms it is my own proposal.** Additive convergence (§11.2) replaces that skip
   with **per-path writes**, and a per-path write into a symlinked `ai-agents/` is exactly the path
   `[ -e ]` currently never reaches. **The hazard is real, it is prospective, and convergence is what
   makes it reachable.** That is a sharper argument for the gate than the one I made: the gate is not
   cleaning up an existing bug, it is a **precondition of the change I am recommending.** It should be
   built *with* convergence, not after it.

3. **File where the directory belongs → real today.** Unchanged, and it was always the quiet one:
   create-if-absent sees "exists", skips, and the project stays broken **forever, silently, with no
   diagnostic.**

**Net effect on the recommendation: none — except to strengthen it.** Every REQUIRED row of §8 stays
REQUIRED, the invariant is untouched, and the rejection of `migration-current.md` (§6) never depended
on this claim. Ground 2 in particular means the gate is **not optional decoration on** the convergence
work; it is **part of it**. See ADR-015's Amendment for the same correction on the record there.

---

## Recommendation, up front — **revised**

Rev 1 said *"build nothing."* That is no longer the honest answer.

> **1. Reject `migration-current.md` + the semver walk.** Unchanged, and now argued on its strongest
> grounds (§6). Not a close call.
>
> **2. Build one small thing — but not the one I specified.** fkit already runs a convergence pass
> against every project on **every launch** (`fkit-claude.sh:280-284`); `ai-agents/` is simply carved
> out of it by an all-or-nothing guard (`fkit-claude-init.sh:27-32`). Un-carving it — **additively** —
> is the right fix. **But it is a mutation of a user's project, performed unattended, on every launch,
> in a code path that currently aborts the launcher on any error.** It needs a real safety design
> (§8): refuse-on-weird-state, non-fatal failure, an opt-out, and it must **announce what it did**.
> Rev 1 rated all four "not required." Rev 1 was wrong.
>
> **3. Accept that this does not solve content drift — which has already happened** (§3). My own
> invariant ("never write to a path that already exists") **forbids** fixing it. It is a real,
> occurred, unsolved case, and I am not proposing to solve it now. §3 says what it would take.
>
> **The main tradeoff:** we decline to build for ordered/destructive migrations, and we accept that a
> drifted *file* stays drifted. If a destructive migration ever arrives, it arrives with nothing in
> place. §10 costs that out honestly — the brief rates the risk **high**, and I am recommending we
> carry it deliberately rather than pretend it is small.

**The headline is not "build nothing." It is: *build something smaller and safer than the owner's
idea, and here is exactly how safe it has to be.***

---

## 1. The finding that reframes the brief — the hook already exists, and it is *launch*, not *update*

**(Stands from rev 1. Codex did not challenge it.)**

The brief reasons from "`fkit update` is the obvious hook." **`fkit update` is the wrong hook, and it
was never the hook.**

- `fkit update` re-runs `install.sh`, which refreshes **`~/.local/share/fkit`** — the install share. It
  **never writes to a consuming project.** (`fkit-claude.sh:106-120` → `install.sh:39-72`.)
- The thing that *does* write to a consuming project is `fkit-claude-init.sh` — and it runs on **every
  single launch**, quietly, on an already-set-up project (`fkit-claude.sh:280-284`).

So fkit **already runs a convergence loop against the project continuously** — better-scheduled than the
one the brief proposes. It re-copies all agents and skills by rm+cp (`fkit-claude-init.sh:49-60`),
re-creates `.fkit/interview`, and idempotently ensures `.gitignore` entries (`:125-139`).

`ai-agents/` is the one thing carved out:

```
claude/fkit-claude-init.sh:27-32
  if [ -e "$dest/ai-agents" ]; then
    echo "• ai-agents/ already present — left as-is"      # ← the entire scaffold copy is skipped
  else
    cp -R "$scaffold/ai-agents" "$dest/ai-agents"
  fi
```

`[ -e ]` on the **parent** gates the copy of **everything beneath it**. An existing project can never
gain a new scaffold path. The brief's premise is correct — but the conclusion it invites
(*"therefore build a migration mechanism"*) does not follow. What follows is: **the guard is at the
wrong granularity.** It is doing two jobs at once — *"don't clobber the user's content"* (right,
essential) and *"don't add anything new"* (wrong, not intended). Separating them is most of the fix.

---

## 2. What has actually needed migrating — corrected scope

| Sprint 2 change | What it touched | Migration needed in a consuming project |
|---|---|---|
| **Scaffold moved** (`generic/` → `omnigent/scaffold/` → `claude/scaffold/`) | fkit's **source layout** | **None.** The scaffold is the *source* of a project's tree, not part of it. |
| **`omnigent/` deleted** (ADR-009) | this repo + the **install share** | **None in `ai-agents/`.** Handled in one line: `install.sh:49`. **But it left orphans elsewhere in the project that nobody has cleaned — §9.** |
| **ADR-013 restructured the KB** | this repo's **own** knowledge base | **Path-additive.** A consuming project has nothing to move — it merely **lacks folders**. |

### The additive-only claim — what it actually proves, stated correctly this time

I checked all three historical homes of the scaffold's `ai-agents/` tree — `generic/ai-agents`@`871e5bf^`,
`omnigent/scaffold/ai-agents`@`6fd2d84^`, `claude/scaffold/ai-agents`@`HEAD`. Across fkit's **entire
history**, the delta to a consuming project's `ai-agents/` **path set** is three additions
(`PROJECT.md`, `conventions/status-report-format.md`, `conventions/task-status-vocabulary.md` — all
`A`, none `R`). **Zero renames. Zero deletions. Zero moves — ever.**

That claim is **true and it holds.** But note precisely what it is:

> **It is a statement about paths, not about bytes.** `git log --name-status` reports `A`/`R`/`D`.
> A file whose *contents* change is an `M` — and `M` was never in evidence, because I never looked for
> it. **Rev 1 proved directory existence never regressed, then silently generalised that to "no
> migration is ever needed."** That inference is invalid, and §3 is the counterexample.

The **destructive-path** class of migration (move/rename/delete inside `ai-agents/`) genuinely has a
real-world incidence of **zero**. That much survives. The **content-drift** class has an incidence of
**two, already** — and it is the one I missed.

---

## 3. Content drift — real, already occurred, **and my proposal does not fix it**

Two files inside a user's `ai-agents/` are **authored by fkit and shipped by the scaffold**:
`ai-agents/README.md` and `ai-agents/reviews/README.md`. They are copied in once at init and **never
touched again**. Their contents have changed in the scaffold across eras — `ai-agents/README.md` has had
**three distinct contents** (generic → omnigent → claude era), `reviews/README.md` one change.

**This is not theoretical. This repo is drifted, right now:**

```
$ diff ai-agents/README.md claude/scaffold/ai-agents/README.md     # → non-empty
```

Two concrete divergences, and **both are load-bearing, in opposite directions**:

| Divergence | This repo's copy | The scaffold's copy | Which is right? |
|---|---|---|---|
| **`## The standing conventions` section** — the block that points agents at `knowledge-base/conventions/` as standing law | **absent** | present | **The scaffold.** This repo's agents are never pointed at their own conventions by the README. |
| **Sprint filename** (`sprints/` row) | `sprint-N.md` | `plan-sprint-N.md` | **This repo.** The shipped skills write `sprint-N.md`, and the file on disk is `ai-agents/sprints/sprint-2.md`. **The scaffold's README is simply wrong**, and every new project gets it. |

And this file **is read by an agent at runtime** — `claude/agents/fkit-producer.md:88` cites
`ai-agents/README.md` as the documentation of the task-status vocabulary. It is not decoration.

### Why my proposal cannot fix this

My own hard invariant (§8) is:

> *Convergence never writes to a path that already exists.*

`ai-agents/README.md` **exists**. Convergence steps over it, forever. **Content drift is precisely the
case that additive convergence is defined to be blind to.** I am not going to pretend otherwise, and I
am **not proposing to solve it in this pass**.

### What it would take (not proposed — costed, so the owner can choose)

The naive fix — "overwrite the fkit-authored READMEs on every launch" — is **unacceptable**: it silently
destroys owner edits, and in this very repo the drift is *partly hand-authored improvement* (the repo's
`sprints/` row is the correct one). Overwriting would make fkit worse.

The design that actually works is **content-identity, not version-order**:

> On launch, hash the on-disk file. If it byte-matches **any version fkit has ever shipped** of that
> file (fkit knows them all — they are in its own git history, distillable to a small manifest shipped
> with the install), then **the user never touched it** → it is safe to replace with the current
> version. If it matches **nothing** fkit ever shipped, the user edited it → **never touch it**, and
> report the divergence once.

This is stateless, needs **no cursor**, survives a fresh clone, involves **no LLM**, and is a strictly
smaller mechanism than a semver walk. Its cost is a generated hash manifest and the discipline of
keeping it. **It is the right answer *if and when* content drift is judged worth solving.** Note it is
also further evidence against `migration-current.md`: the correct mechanism here keys on **what the
file is**, not **which version you came from**.

> **Owner decision (Q1, §12): is content drift in scope now, later, or never?** My recommendation:
> **later** — fix the scaffold's wrong `sprints/` row as a plain defect (§4), and revisit the manifest
> when a *third* fkit-authored file starts drifting. But this is a genuine scope call and it is not mine.

---

## 4. The scaffold defect — separate from migration entirely, and worse than rev 1 reported

`claude/scaffold/ai-agents/knowledge-base/` contains only `.gitkeep`, `PROJECT.md`, and
`conventions/{status-report-format,task-status-vocabulary}.md`. There is **no `reports/`, no
`incidents/`, no `history/`, no `decisions/`**, and no `conventions/README.md`.

Meanwhile `claude/scaffold/ai-agents/README.md:11` **already ships ADR-013's law**, naming all five
folders. **A project scaffolded fresh today ships with a README instructing its agents to file
documents into four folders that do not exist on its disk.** The scaffold contradicts itself on day one.

**Rev 2 adds a third self-contradiction:** the same README tells a new project to name sprint plans
`plan-sprint-N.md`, while the shipped producer skills write `sprint-N.md` (§3). **The scaffold's own
README disagrees with the scaffold's own skills.**

**None of this is a migration problem.** It is a plain defect in fkit's *current output*, it needs no
mechanism, it is one commit, and it affects **100% of projects created from today onward**.

---

## 5. Population — **retracted as an argument**

Rev 1 argued that the migration problem "has a known population of zero," and called that "the single
strongest input to 'build nothing'." **That was false and I withdraw it.** This repo *is* a drifted
consuming project (§3). Worse, it was drifted while I wrote the sentence claiming it was not — which is
exactly the failure mode the brief warned against: **reasoning that flatters a preferred conclusion.**

I am **not** re-basing the recommendation on a smaller population estimate. I am **removing population
from the argument entirely.** The case against `migration-current.md` is a **shape** argument (§6) —
that the mechanism's core assumptions (ordered versions, a durable cursor, non-commutative operations)
are each false in fkit's actual distribution model. That argument is independent of how many projects
exist. It would hold at a population of ten thousand. It needed no crutch, and rev 1 leaned on one
anyway.

---

## 6. Verdict on the owner's `migration-current.md` idea — **rejected** (re-argued)

The brief is emphatic that this be evaluated, not validated, and that outright rejection is allowed.
**I reject it.** It is a well-formed design — the standard Rails/Django/Flyway pattern, correct for the
problem *it* solves. It is the wrong pattern for the problem fkit has. In descending order of how fatal:

**1. The cursor cannot survive a `git clone` — and a semver walk without a cursor replays destructive
migrations against an already-migrated tree.**
*(This replaces rev 1's #1, which was weak. See C5.)*
A version walk needs to know *"which version is this project at?"* That state has to live **in the
project**. The only project-local place fkit owns is **`.fkit/`** — and `fkit-claude-init.sh:137`
**gitignores it**:

```
add_ignore '.fkit/' 'fkit-managed local state (intake, tmp; re-created by fkit init)'
```

So the cursor is, by construction, **not committed and not shared.** Clone the project on a second
machine — or a CI box, or a teammate's laptop — and the tree is fully migrated while the cursor is
**absent**. The walk reads "no cursor" and does the only thing it can: **start from the beginning and
replay every migration.** For additive migrations that is merely wasteful. **For the destructive
migrations this mechanism exists to enable, it is the disaster scenario** — replaying "move the loose
files in `knowledge-base/` into `reports/`" against a tree where that already happened, on a fresh
clone, unattended.

The fix would be to commit the cursor — i.e. put fkit's private bookkeeping into the user's tracked
history and make it a merge-conflict surface across branches. **The mechanism's central state has no
safe home in fkit's actual layout.** *(A cursor per se is cheap — `fkit-claude-init.sh:66` already
writes durable per-project state. Cheap to write, impossible to keep correct. That distinction is the
whole point.)*

**2. The thing it would key on is not a version — it is a sha.**
Self-update compares the installed **sha** against `$repo@$ref`'s head (`fkit-claude.sh:77-88`;
`install.sh:55-62`), and `fkit update` reinstalls at **`main` HEAD, not at a tag.** An installation
therefore sits at an arbitrary commit, and its `VERSION` string is merely the last bump that happened to
precede it. **Two installations can report the same `VERSION` and hold entirely different content.**
A semver walk over a sha-keyed distribution is **not well-defined.** The brief's own constraint is that
whatever we choose "must not fight the existing self-update." A semver walk fights it directly.

**3. It builds ordering and replay — the two properties that make migrations dangerous — for operations
that need neither.**
Ordered, exactly-once replay exists to make **non-commutative, destructive** transformations safe (drop
this column, then rename that table). Every migration fkit has ever needed is **additive and
idempotent** — and additive-idempotent operations **commute**. Order is meaningless; re-running is free.
The idea imports the full cost model of a dangerous mechanism (cursor, ordering, replay, partial
failure, rollback) to perform operations with **none of the properties that cost model exists to
manage**. It is the most expensive available way to do `mkdir -p`.

**4. The walk does not survive 30 tags and zero migration files.**
`VERSION` = `0.1.30`; **30 tags**; `bin/release.mjs:8-10` bumps the patch **by default on every
release**. A walk from `0.1.0` to `0.1.30` traverses **30 versions with zero migration files** — "no file
for this version" is not an edge case, it is ~100% of the walk. A design whose dominant behavior is an
empty loop, and whose rare case has never occurred, is solving a problem it does not have.

**5. It converges only at version boundaries; the existing hook converges continuously.** A walk fires
on update. `fkit-claude-init.sh` fires on **every launch** (§1) — so it also heals a project that was
hand-broken *between* updates, which a cursor-based walk by construction never will.

**6. "Natural-language items executed by a migration agent" is the worst option on the table.**
An LLM handed *"move the loose files in `knowledge-base/` into `reports/`"* and pointed at a hand-edited
project must **decide which files are loose** — and it will be wrong sometimes, because the user's own
documents are indistinguishable from fkit's by inspection. Non-determinism is fine in an agent that
*proposes*. It is **not** fine in the one unattended code path in fkit that **moves the user's files**.
It cannot be tested (same input, different behavior), cannot be faithfully dry-run (the dry run is a
*different* LLM call from the real one), and cannot be rolled back (it does not know what it did).
**The one place fkit must be most deterministic is precisely where this idea is least deterministic.**
If a destructive migration is ever genuinely needed it must be an **executable, reviewed, tested
script** — rigidity is the *feature* — gated on explicit consent, never run unattended on launch.

### What I salvage

- **The authoring instinct is right.** A change that alters the shape of what fkit puts on disk should
  be recorded **when it is made**, not reconstructed later by git archaeology (which is what this
  investigation had to do). But its home already exists: the **ADR's "Consequences" section**.
  `adr-013:160-183` already enumerates exactly what must change downstream. That is
  `migration-current.md` — minus the new file, minus the new convention, minus the mechanism.
- **It is rejected as *premature*, not as *wrong*.** The moment a genuinely destructive migration
  exists, "one file per released version" becomes a reasonable starting point again — **provided the
  cursor problem in #1 is solved first.** §11 records that trigger.

---

## 7. The `fkit update` / development-internal tension — resolved

**(Stands from rev 1.)** The brief calls this "the load-bearing ambiguity in the whole brief." It
resolves as a **false dilemma**:

> The tension was an artifact of assuming `fkit update` is the hook. **It isn't.** `fkit update`
> refreshes the install share and never touches a consuming project. The project-facing hook is
> **launch**, and it already exists.
>
> Bringing a project's `ai-agents/` layout up to date **is** an in-scope end-user concern — the tree is
> **the product's data model**, the contract between fkit's shipped skills and the project on disk
> (`/fkit-status` and `/fkit-task-plan` hard-read those paths). A drifted layout means **fkit's own
> agents malfunction in the user's project.** That is correctness, not tidiness. Reading (ii) — *"fkit
> doesn't care if a user's layout drifts"* — is not tenable.
>
> **But it requires no published, user-facing mechanism.** There is no `fkit migrate`, no version walk
> for a user to run or reason about. The user launches `fkit`; their tree converges. **The owner's "not
> published or shared with end users" ruling stands unamended and is satisfied literally** — there is
> nothing to publish, because there is no mechanism.

---

## 8. The safety table — now applied to **my own** substitute

Rev 1 wrote a safety table for the idea it *rejected* and gave the idea it *proposed* a friendly wave.
That was the review's sharpest hit and it landed. Here is the honest version.

**What the substitute actually is, stated at full strength, with nothing softened:** *a mutation of the
user's project directory, performed **unattended**, **on every launch**, **silently**, from a script
running under `set -euo pipefail` whose failure **aborts the launcher before Claude ever starts**
(`fkit-claude-init.sh:18`; called unguarded at `fkit-claude.sh:281,283`).* Rev 1 noted "a bug here hits
everyone, every time" and then rated rollback "not required" one paragraph later. Both those sentences
cannot be relaxed at once.

| Property | Rev 1 said | **Rev 2 says** | Why |
|---|---|---|---|
| **Idempotency** | Required — and free | **Required — and free. STANDS.** | "Ensure this path exists" is idempotent by construction. Not implemented; inherited. |
| **Non-fatal failure** | *(not considered)* | **REQUIRED — and currently violated.** | Under `set -euo pipefail`, a permissions error or ENOSPC mid-convergence **aborts the launcher**: `fkit` does not start. Convergence failing must **warn and continue into the session** — a user must always be able to reach their team. *(This is a **pre-existing** latent defect: any init failure already bricks the launcher today. Worth flagging on its own.)* |
| **Refuse on weird state** | *(not considered)* | **REQUIRED.** ⚠️ **Rationale CORRECTED — see §0.1.** | ~~Three states break it silently: **(a) `ai-agents/` is a symlink** — `[ -e ]` and `[ -d ]` **dereference** (verified), and `cp -R` then writes **through** the link, i.e. **outside the project** (verified).~~ **The struck text is FALSE and was falsified by implementation + review: `cp -R` does NOT write outside the project — it refuses (rc=1) on GNU, BSD and BusyBox alike. §0.1.** The row **stands as REQUIRED** on the corrected grounds: **(a) a *dangling* symlink** → `cp` refuses → rc=1 → under `set -euo pipefail` init dies and **the launcher is bricked** (DoS, not exfiltration); **(a′) a *live* symlink** → GNU `cp` **does** write through, and while `[ -e ]`'s short-circuit makes that unreachable today, **additive convergence (§11.2) is precisely what arms it** by replacing the skip with per-path writes — so the gate is a **precondition of my own proposal**, not a cleanup; **(b) a *file* sits where a directory is expected** — create-if-absent sees "exists", skips, and the project stays broken **forever**, silently; **(c) a directory is unreadable.** Each must **refuse loudly**, not paper over. |
| **Announce what you did** | *(not considered)* | **REQUIRED.** | Silent mutation of a user's tree on every launch is what makes the cases below nasty. If fkit creates a path in the user's project, **it must say so** — once, on the launch it happens. This subsumes most of what a dry-run would buy. |
| **Opt-out** | *(not considered)* | **REQUIRED.** | A user who **deliberately deleted** `wiki-vault/` (they don't use the wiki) gets it **silently resurrected on every launch, forever, with no way to stop it.** fkit currently offers no "I meant that." Deletion must be respectable. |
| **Never re-add `.gitkeep` to a live directory** | *(not considered)* | **REQUIRED.** | The scaffold carries **10 `.gitkeep` files** (verified). A user whose `tasks/backlog/` has real content has probably deleted its `.gitkeep`. Naive create-if-absent **resurrects it** and **dirties `git status` on every launch.** Rule: `.gitkeep` is created **only when its directory is created**, never into a directory that already exists. |
| **Dry-run** | Not required | **Not required — but only because "announce" replaces it.** | Preview matters when an operation is *irreversible*. Create-if-absent is reversible by `rm`. Announcing is enough — **provided the invariant below holds.** |
| **Rollback** | Not required | **Not required. STANDS — and this one genuinely survives.** | Die halfway through creating five folders and you have created three; the next launch creates the other two. **There is no torn state, because nothing is mutated — only added.** This holds **only** under the invariant, and **only** if failure is non-fatal (row 2). |
| **Refuse on dirty git tree** | Not required | **Not required. STANDS.** | Nothing is moved or overwritten, so an uncommitted tree is not at risk. Requiring a clean tree would be a hostile no-op. *(Contingent on the `.gitkeep` rule above — without it, convergence dirties the tree itself.)* |
| **Renamed folder → you get both** | *(not considered)* | **ACCEPTED, unfixable, must be disclosed.** | A user who renamed `sprints/` to `iterations/` gets `sprints/` recreated alongside it. Convergence cannot know a rename happened — **and neither can any stateless mechanism.** This is an inherent limit, not a bug to fix. It must be **stated**, not discovered. |

### The invariant — the thing that must be ratified

> **Convergence never writes to a path that already exists.** Create-if-absent only. **No overwrite, no
> move, no delete — ever — inside `ai-agents/`.**

Every "not required" in the table above is **downstream of this one line.** Break it and *all* of them
become "required," and this becomes a different, far more dangerous piece of software. It is the thing
to protect, and the thing to ask the owner to ratify (§12, Q2).

**Note the invariant's price, paid openly:** it is exactly what makes **content drift (§3) unfixable by
this mechanism.** The safety and the limitation are the *same property*. That is the trade, stated
plainly rather than buried.

---

## 9. The one destructive act I actually propose — and it needs a gate

The old Omnigent init wrote into the **consuming project** — `$dest/.omnigent/config.yaml`
(`omnigent/fkit-init.sh:62-70` @ `6fd2d84^`), `$dest/.fkit/agents/` (`omnigent/vendor-agents.sh:20-26`),
`$dest/.fkit/run`. The current init cleans **none** of them, and **this repo has them on disk right
now**. Every launch of `fkit` here refreshes `.claude/skills/fkit-*/` while stepping straight over seven
orphaned agent bundles from a runtime deleted two ADRs ago.

**Rev 1 called this cleanup "safe by construction: fkit-owned and gitignored." That was an assertion,
not a proof — and I have now checked it, and it was partly wrong.** Grepping the *current* code for each
target on my own list:

| Target | Referenced in current code? | Verdict |
|---|---|---|
| `.fkit/agents/` | **no references** | genuinely dead (Omnigent bundles) |
| `.fkit/run` | **no references** | genuinely dead (Omnigent runner) |
| `.fkit/team-session` | **no references** | genuinely dead |
| **`.fkit/settings`** | **`fkit-claude.sh:257-268` — written on EVERY launch** | ⚠️ **NOT DEAD. This is live state of the current runtime** — the per-role `skillOverrides` files that implement ADR-010's session lockdown. **My own rev-1 list named it for deletion.** |
| `.omnigent/` | no references | genuinely dead |

The effect of deleting `.fkit/settings` would have been *survivable* (init runs at `fkit-claude.sh:281`,
`build_settings` at `:387`, so it would be `mkdir -p`'d back moments later) — **but the reasoning was
wrong, the label "dead Omnigent state" was false, and a reviewer trusting my table would have shipped a
delete of live state.** That is the review's point, proven on my own proposal.

Not on the list and **must never be**: **`.fkit/intake.md`** (the owner's hand-typed answers) and
`.fkit/interview` and `.fkit/tmp/` — all live. *(An adversarial finding claimed my cleanup endangered
`intake.md`. **It did not** — it was never a listed target. I reject that framing. The valid core is
everything above.)*

**What the cleanup needs, and rev 1 gave it none of:**

| | |
|---|---|
| **Corrected target list** | `.fkit/agents/`, `.fkit/run`, `.fkit/team-session`, `.omnigent/`. **`.fkit/settings` removed.** |
| **Proof, not assertion** | Each target verified to have **zero references in current code** (table above). This check is the gate, and it must be **re-run** if the list ever changes. |
| **Consent** | It is a **`rm -rf` in the user's project.** It should **announce what it is removing** and, if it cannot be made announce-only, **ask once**. It is not a silent-on-every-launch operation. |
| **Its own row in the safety table** | Rollback: **not available** (`rm -rf` is terminal). Which is *exactly* why the reference-check and the announcement are load-bearing. Dry-run: **worth having** here, unlike for the additive pass. |
| **Precedent it leans on** | `install.sh:49` (`rm -rf "$SHARE/omnigent"`) — one hand-written line, shipped, correct. **But that operates on the install share, which fkit wholly owns. A consuming project is not the install share.** The precedent is weaker than rev 1 implied. |

---

## 10. The cost of being wrong — the brief rates this risk **high**, so here it is plainly

I am recommending we **carry** the risk, not that the risk is small. State it honestly:

**If the first genuinely destructive migration arrives and nothing is in place, here is what happens.**
It will arrive *attached to a feature someone wants shipped* — not as a standalone "let's design
migrations" week. Under that pressure, the path of least resistance is a hand-written `mv`/`rm` dropped
into `fkit-claude-init.sh` — i.e. **into the unattended, every-launch, no-consent code path**, because
that is the only project-facing hook that exists. **That is precisely the disaster the brief is worried
about, and my recommendation makes that hook *more* capable and *more* normalised right before the
moment of temptation.** I should not pretend otherwise.

Concretely, what carrying the risk costs:

- **Rebuild cost, later, under pressure:** designing an ordered, consented, dry-runnable, tested
  destructive migration path — a week of careful work, done in the worst possible circumstances.
- **Blast radius if someone shortcuts it:** silent, unattended, irreversible mutation of a user's own
  documents, on launch, with no rollback. **This is the "destroy work" risk the brief rates high**, and
  it is realised *not* by building nothing but by building nothing **and then improvising**.
- **What we gain by waiting:** we do not build a cursor that cannot survive a clone (§6.1), 30 empty
  migration files, and an LLM that guesses which of the user's files are "loose" — for a case that has
  **never once occurred** in fkit's history.

**I judge the trade worth it — but only if it is *fenced*, not merely deferred.** The fence is the ADR's
re-raise trigger, and it has to be a **trigger that fires early enough to be acted on**:

> **Re-raise the moment someone proposes a change that would move, rename, or delete content inside a
> consuming project's `ai-agents/` — at the moment it is *proposed*, not when it is implemented.**
> That proposal is *itself* the trigger. It does **not** get implemented in `fkit-claude-init.sh` as a
> one-off. **It voids this decision and returns to the owner**, and at that point `migration-X.Y.Z`
> becomes the right starting point again — **provided §6.1's cursor problem is solved first.**
>
> **Not** a trigger: adding a folder / README / file to the scaffold (that is convergence; it works).
> **Not** a trigger: the number of released versions growing.

The trigger fires on **a proposal**, not on a shipped migration — because by the time a destructive
migration is *written*, the wrong hook has already been chosen.

---

## 11. Proposed follow-up work

**Scoping is the producer's job, *after* the owner's review gate — per the brief (`:105`, `:109-110`).
These are findings, not a plan of record. Nothing below is authorized by this report.**

1. **Fix the scaffold** *(plain defect; gated on nothing; independent of every other item)*
   Add `decisions/`, `incidents/`, `reports/`, `history/`, `conventions/README.md` to
   `claude/scaffold/ai-agents/knowledge-base/` so the scaffold delivers the structure **its own README
   already promises** — and **correct the README's `sprints/` row** (`plan-sprint-N.md` → `sprint-N.md`),
   which contradicts the shipped skills (§3, §4). Fixes **every new project**. One commit.

2. **Make launch converge additively** *(fixes existing projects — this is "the migration")*
   Replace the all-or-nothing `[ -e "$dest/ai-agents" ]` guard (`fkit-claude-init.sh:27-32`) with a
   per-path **create-if-absent** pass. **It must implement every REQUIRED row in §8** — non-fatal
   failure, refuse-on-weird-state (symlink / file-where-dir), announce-what-it-did, an opt-out, and the
   `.gitkeep` rule. **This is not a small script; it is a small script with a real safety contract.**
   It runs on every launch for every user — it is the unit that earns careful verification, including an
   explicit test that a user's existing `ai-agents/` content is **byte-for-byte untouched**.

3. **Clean the Omnigent orphans** *(the one destructive act — §9)*
   Corrected target list, reference-check as the gate, and an announcement. **`.fkit/settings` is NOT a
   target.**

4. **(Pre-existing, found in passing)** Init failure currently **aborts the launcher**
   (`fkit-claude.sh:281,283`, unguarded, under `set -eu`). A user with a permissions problem cannot
   start their team and gets a bare shell error. Worth fixing **regardless of anything in this report**.

5. **Content drift — NOT proposed now.** §3 costs the design (a shipped hash manifest keyed on content
   identity). It is a real unsolved case and it needs an owner scope call (§12, Q1) before anyone builds
   anything.

**Explicitly *not* proposed:** `migration-current.md`, `migration-X.Y.Z.md`, a semver walk, a
per-project version cursor, or a migration agent.

### The ADR — recommended, and the owner records it or declines

One ADR, and it is **not** "we built a migration mechanism":

> **"fkit converges a project's `ai-agents/` tree on launch — additively, non-fatally, and with an
> opt-out. It has no migration mechanism, and it does not converge file *contents*."**
>
> **Re-raise only if:** someone **proposes** a change that must move, rename, or delete content inside a
> consuming project's `ai-agents/` — see §10 for why the trigger fires on the *proposal*.
> **Also re-raise if** a third fkit-authored file inside `ai-agents/` starts drifting (§3).

Per the brief and my own boundary, **the owner records that ADR, or declines to. I have not written it.**

---

## 12. Open questions for the owner

1. **Is content drift in scope?** (§3.) It has **already occurred**, in this repo, in an agent-read
   file, in both directions. My proposal does **not** fix it and cannot. §3 costs the design that
   would. My recommendation is **defer** (fix the scaffold's wrong row as a defect; revisit on a third
   drifted file) — but this is a genuine scope call and it is **yours**, not mine.

2. **Ratify the invariant — the one that matters most.** *Launch-time convergence is **additive only**:
   fkit never moves, renames, overwrites, or deletes content inside a user's `ai-agents/` without
   explicit consent.* I assert it as the safe default and the producer concurs — but the brief rates the
   destroy-work risk **high**, and a rule governing **the one unattended code path that could destroy a
   user's work** deserves an owner's ruling, not an architect's assumption.

3. **Ratify the §8 safety bar.** The substitute needs an **opt-out**, must **announce** what it creates,
   must **refuse on weird state**, and must **never brick the launcher**. Rev 1 asked for none of these.
   If you want it simpler than §8, say so **explicitly** — each row is there because I found the failure,
   and dropping one is a decision, not a simplification.

4. **Is rejecting `migration-current.md` acceptable?** It was your idea; the brief invited its
   rejection and I have taken that at face value. It survived a hostile Codex pass **as a rejection** —
   §6 is stronger now, not weaker. But I want it **acknowledged**, not assumed. It is rejected as
   **premature**, not as wrong.

5. **May follow-up #1 (the scaffold fix) and #4 (the launcher-bricking bug) proceed immediately** as
   plain defect fixes, ahead of any decision on the rest? Both are gated on nothing and both ship
   today's bugs to today's users.

---

## Evidence index

| Claim | Source |
|---|---|
| Init runs on **every** launch, quietly | `claude/fkit-claude.sh:280-284` |
| Init runs under `set -euo pipefail`; called **unguarded** → failure aborts the launcher | `claude/fkit-claude-init.sh:18`; `claude/fkit-claude.sh:281,283` (`set -eu` @ `:28`) |
| The all-or-nothing `ai-agents/` guard | `claude/fkit-claude-init.sh:27-32` |
| Agents/skills already self-heal (rm + re-copy) | `claude/fkit-claude-init.sh:49-60` |
| `fkit update` only refreshes the install share | `claude/fkit-claude.sh:106-120`; `install.sh:39-72` |
| **`.fkit/` is gitignored** → a cursor cannot survive a clone | `claude/fkit-claude-init.sh:137` |
| fkit *can* write durable per-project state (so a cursor is cheap, just not *keepable*) | `claude/fkit-claude-init.sh:66` |
| Self-update compares **sha**, installs at `main` HEAD | `claude/fkit-claude.sh:77-88`; `install.sh:55-62` |
| Patch bumped by default every release; 30 tags; `VERSION`=`0.1.30` | `bin/release.mjs:8-10`; `git tag` (30); `VERSION` |
| Scaffold `ai-agents/` **path set**, all 3 eras — additive only, no renames/deletes ever | `generic/ai-agents`@`871e5bf^`; `omnigent/scaffold/ai-agents`@`6fd2d84^`; `claude/scaffold/ai-agents`@`HEAD` |
| **…but this proves paths, not contents** — content drift is invisible to `--name-status` | §2 |
| **This repo IS drifted** — `ai-agents/README.md` ≠ scaffold's, right now | `diff ai-agents/README.md claude/scaffold/ai-agents/README.md` → non-empty |
| The two drifts diverged in **separate hand-edits** | repo copy @ `a8cb0e7`; scaffold copy @ `c4c82dd` |
| The drifted README **is read by an agent at runtime** | `claude/agents/fkit-producer.md:88` |
| Scaffold README says `plan-sprint-N.md`; **shipped skills write `sprint-N.md`**; disk has `sprint-2.md` | `claude/scaffold/ai-agents/README.md:8`; `claude/skills/`; `ai-agents/sprints/sprint-2.md` |
| Scaffold lacks `decisions/`, `incidents/`, `reports/`, `history/`, `conventions/README.md` | `claude/scaffold/ai-agents/knowledge-base/` |
| …while its README **already promises all five** | `claude/scaffold/ai-agents/README.md:11` |
| Scaffold ships **10 `.gitkeep` files** → naive convergence resurrects them & dirties `git status` | `find claude/scaffold/ai-agents -name .gitkeep` (10) |
| `[ -e ]` / `[ -d ]` **dereference symlinks** | verified empirically — **stands** |
| ~~`cp -R` writes **through** a symlinked dir, outside the project~~ | ⚠️ **FALSE — RETRACTED (§0.1).** `cp -R` **refuses** a dangling-symlink destination (rc=1) on GNU coreutils 9.1, BSD/macOS and BusyBox; nothing is written outside the project. Falsified by fkit-coder (macOS) and fkit-reviewer (Debian container); GNU manual: write-through only under `POSIXLY_CORRECT`. |
| A **dangling** symlink at `ai-agents/` **bricks the launcher** (`cp` rc=1 under `set -euo pipefail`) | fkit-coder, macOS + fkit-reviewer, Debian; `fkit-claude-init.sh:18`; `fkit-claude.sh:281,283` |
| A **live** symlink at `ai-agents/` **does** write through on GNU `cp` — **unreachable today only because `[ -e ]` short-circuits; additive convergence arms it** | fkit-reviewer, Debian container (rc=0, scaffold landed outside the project); `fkit-claude-init.sh:27-32` |
| **`.fkit/settings` is LIVE current-runtime state**, not dead Omnigent residue | `claude/fkit-claude.sh:257-268` (written every launch); `:387` |
| `.fkit/{agents,run,team-session}` + `.omnigent/` — **zero references** in current code | grep over `claude/`, `install.sh`, `bin/` |
| `.fkit/intake.md`, `.fkit/interview`, `.fkit/tmp/` — **live**, never deletion targets | `fkit-claude-init.sh:63-121`; `claude/agents/fkit-adversarial-reviewer.md:27` |
| Omnigent init wrote `.omnigent/`, `.fkit/agents/`, `.fkit/run` **into the project** | `omnigent/fkit-init.sh:38-70`; `omnigent/vendor-agents.sh:20-26` @ `6fd2d84^` |
| The precedent: one hand-written cleanup, 1 line — **but on the install share, not a project** | `install.sh:49` |
| ADR-013's "Consequences" already does `migration-current.md`'s authoring job | `adr-013:160-183` |
