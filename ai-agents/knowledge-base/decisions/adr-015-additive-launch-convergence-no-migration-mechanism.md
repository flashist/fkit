# ADR-015: fkit converges a project's `ai-agents/` tree additively on launch — it has no migration mechanism

- **Status:** accepted (**evidence amended 2026-07-14** — one supporting fact was falsified by
  implementation and review; **the decision is unchanged**. See "Amendment".)
- **Date:** 2026-07-14
- **Deciders:** owner (Mark Dolbyrev), ruling on
  [`ai-agents/knowledge-base/reports/2026-07-14-migration-mechanism.md`](../reports/2026-07-14-migration-mechanism.md)
  (rev 2); investigation and recording by fkit-architect, at the coder's request
- **Evidence:** the report above. It is **revision 2** — rev 1 went through an adversarial Codex pass
  and **did not survive intact** (two factual claims were false; the substitute had not been held to
  the safety standard applied to the idea it rejected). Every claim below is the post-adversarial
  version. `report:§0` lists the corrections — and `report:§0.1` lists a **further** correction, to
  rev 2 itself, made *after* this ADR was accepted. See "Amendment" below. **Nothing in the Decision
  section changed.**

> **What this ADR decides, in one line:** fkit **adds** what a project is missing, on every launch,
> and **never** moves, renames, overwrites, or deletes anything inside a consuming project's
> `ai-agents/`. There is no version walk, no cursor, no migration file, and no migration agent.

## Context

The trigger was a proposed design — `migration-current.md` plus per-version `migration-X.Y.Z.md`
files, walked in semver order on update, with natural-language items executed by a migration agent.
The brief explicitly invited **evaluation, not validation**, and permitted outright rejection. The
investigation found four facts that decide the question.

### 1. The hook is **launch**, not `fkit update` — and it already exists

`fkit update` re-runs `install.sh` and refreshes **`~/.local/share/fkit`**, the install share. It
**never writes to a consuming project** (`claude/fkit-claude.sh:106-120` → `install.sh:39-72`).

The thing that *does* write to a consuming project is `fkit-claude-init.sh`, and it runs on **every
single launch**, on an already-set-up project (`claude/fkit-claude.sh:280-284`). It already re-copies
all agents and skills by rm+cp (`claude/fkit-claude-init.sh:49-60`) and idempotently ensures
`.gitignore` entries (`:125-139`). **fkit already runs a convergence loop against the project
continuously** — better-scheduled than the one the proposal envisaged.

`ai-agents/` is the one thing carved out of it, by an all-or-nothing guard on the **parent**:

```
claude/fkit-claude-init.sh:27-32
  if [ -e "$dest/ai-agents" ]; then
    echo "• ai-agents/ already present — left as-is"      # ← the whole scaffold copy is skipped
  else
    cp -R "$scaffold/ai-agents" "$dest/ai-agents"
  fi
```

That guard is doing two jobs at once: *"don't clobber the user's content"* (right, essential) and
*"don't add anything new"* (wrong, never intended). **The guard is at the wrong granularity.**
Separating those two jobs is most of the fix — and it is not a migration mechanism.

### 2. The migration need has been **additive-only across fkit's entire history**

All three historical homes of the scaffold's tree were checked — `generic/ai-agents`@`871e5bf^`,
`omnigent/scaffold/ai-agents`@`6fd2d84^`, `claude/scaffold/ai-agents`@`HEAD`. The delta to a consuming
project's `ai-agents/` **path set** across all of fkit history is **three additions** (`PROJECT.md`,
`conventions/status-report-format.md`, `conventions/task-status-vocabulary.md` — all `A`, none `R`).
**Zero renames. Zero deletions. Zero moves — ever.**

**State precisely what that proves: paths, not bytes.** `git log --name-status` reports `A`/`R`/`D`;
a content change is an `M`. The **destructive-path** class of migration has a real-world incidence of
**zero**. The **content-drift** class does not — see Consequences. This ADR is careful not to
generalise the first into the second, which is the error rev 1 of the report made.

### 3. The fatal fact: **`.fkit/` is gitignored — the cursor cannot survive a `git clone`**

This is the argument that killed the semver walk, and it is the one that survived the adversarial
pass. It is **not** "fkit has nowhere to write per-project state" — that objection is weak and false,
and anyone who "fixed" it would wrongly conclude the rejection collapsed. fkit writes durable
per-project state today (`claude/fkit-claude-init.sh:66`). **A cursor is cheap to write. It is
impossible to keep correct.**

A version walk must know *"which version is this project at?"*, and that state must live **in the
project**. The only project-local place fkit owns is `.fkit/` — and init **gitignores it**:

```
claude/fkit-claude-init.sh:137
  add_ignore '.fkit/' 'fkit-managed local state (intake, tmp; re-created by fkit init)'
```

So the cursor is, by construction, **not committed and not shared**. Clone the project on a second
machine, a CI box, or a teammate's laptop, and you get a **fully-migrated tree with no cursor**. The
walk reads "no cursor" and does the only thing it can: **start from the beginning and replay every
migration.** For additive migrations that is merely wasteful. **For the destructive migrations the
mechanism exists to enable, it is the disaster scenario** — replaying *"move the loose files in
`knowledge-base/` into `reports/`"* against a tree where that already happened, on a fresh clone,
unattended. The fix would be to commit fkit's private bookkeeping into the user's tracked history and
make it a merge-conflict surface across branches. **The mechanism's central state has no safe home in
fkit's actual layout.**

### 4. The distribution model is **sha-keyed**, so a semver walk is not well-defined

Self-update compares the installed **sha** against `$repo@$ref`'s head
(`claude/fkit-claude.sh:77-88`; `install.sh:55-62`), and `fkit update` reinstalls at **`main` HEAD,
not at a tag**. An installation therefore sits at an arbitrary commit; its `VERSION` string is merely
the last bump that happened to precede it. **Two installations can report the same `VERSION` and hold
entirely different content.** Meanwhile `bin/release.mjs:8-10` bumps the patch by default on every
release: `VERSION` is `0.1.30`, there are **30 tags**, and there are **zero migration files**. A walk
from `0.1.0` to `0.1.30` would traverse 30 versions of empty loop — "no file for this version" is not
an edge case, it is ~100% of the walk.

## Decision

### 1. The invariant — RATIFIED by the owner

> **Convergence never writes to a path that already exists.** Create-if-absent only. **No overwrite,
> no move, no delete — ever — inside a consuming project's `ai-agents/`.** fkit **adds**; it does not
> mutate.

This is the load-bearing line of the whole decision. Every "not required" in the safety bar below is
**downstream of it**. Break it and all of them become "required", and launch-time convergence becomes
a different, far more dangerous piece of software.

### 2. Additive launch convergence — APPROVED

The all-or-nothing `[ -e "$dest/ai-agents" ]` guard (`claude/fkit-claude-init.sh:27-32`) is replaced
by a **per-path create-if-absent** pass, running where convergence already runs: **on launch**
(`claude/fkit-claude.sh:280-284`). This is what makes an existing project able to gain a new scaffold
path. **It is "the migration" — and it is not a migration mechanism.**

### 3. The safety bar — RATIFIED IN FULL

Convergence is *a mutation of the user's project directory, performed **unattended**, **on every
launch**, from a script running under `set -euo pipefail` whose failure **aborts the launcher before
Claude ever starts*** (`claude/fkit-claude-init.sh:18`; called unguarded at
`claude/fkit-claude.sh:281,283`). Every row below is **REQUIRED**. Dropping one is a decision that
returns to the owner, not a simplification.

| Property | Status | Why |
|---|---|---|
| **Idempotency** | REQUIRED — free | "Ensure this path exists" is idempotent by construction. |
| **Non-fatal failure** | **REQUIRED — currently violated** | Under `set -euo pipefail` a permissions error or ENOSPC mid-convergence **bricks the launcher**. Convergence failure must **warn and continue into the session** — a user must always be able to reach their team. *(Pre-existing latent defect: any init failure already bricks the launcher today.)* |
| **Refuse on weird state** | **REQUIRED** ⚠️ *rationale corrected — see Amendment* | ~~**(a)** `ai-agents/` is a **symlink** — `[ -e ]`/`[ -d ]` dereference and `cp -R` writes **through** it, i.e. **outside the project** (both verified empirically);~~ **The `cp -R` write-through claim is FALSE and is retracted — see Amendment.** The row stands, on corrected grounds: **(a)** a **dangling** symlink → `cp` refuses (rc=1) → under `set -euo pipefail` **the launcher is bricked**; **(a′)** a **live** symlink → GNU `cp` *does* write through, unreachable today only because `[ -e ]` short-circuits — **and additive launch convergence (Decision §2) is exactly what arms it**; **(b)** a **file** sits where a directory is expected — create-if-absent sees "exists", skips, and the project stays broken **forever, silently**; **(c)** a directory is unreadable. Each must **refuse loudly**. |
| **Announce what you did** | **REQUIRED** | Silent mutation of a user's tree on every launch is what makes the other cases nasty. If fkit creates a path in the user's project it must **say so**, once, on the launch it happens. This is what makes a dry-run unnecessary. |
| **Opt-out** | **REQUIRED** | A user who **deliberately deleted** `wiki-vault/` must not get it silently resurrected on every launch forever with no way to stop it. **Deletion must be respectable.** |
| **Never re-add `.gitkeep` to a live directory** | **REQUIRED** | The scaffold carries **10 `.gitkeep` files**. Naive create-if-absent resurrects them into populated directories and **dirties `git status` on every launch**. Rule: a `.gitkeep` is written **only when its directory is created**. |
| **Dry-run** | not required | Only because **announce** replaces it. Create-if-absent is reversible by `rm`. |
| **Rollback** | not required | Die halfway through creating five folders and you have created three; the next launch creates the other two. **There is no torn state, because nothing is mutated — only added.** Holds **only** under the invariant, and **only** with non-fatal failure. |
| **Refuse on a dirty git tree** | not required | Nothing is moved or overwritten, so an uncommitted tree is not at risk. Contingent on the `.gitkeep` rule. |

### 4. `migration-current.md` + the semver walk — REJECTED

Rejected as **premature, not wrong** (see Rejected alternatives). No migration mechanism is being
built: **no `migration-current.md`, no `migration-X.Y.Z.md`, no semver walk, no per-project version
cursor, no migration agent.**

### 5. Content drift — DEFERRED, with eyes open

Not in scope. This is a **knowing acceptance of a real, already-occurred, unsolved case**, recorded in
full under Consequences. It is not an oversight.

### 6. The two live bugs are defects, not migration work

Approved to fix immediately and independently of everything above (the producer is scoping them):
the scaffold's missing `knowledge-base/` folders (`decisions/`, `incidents/`, `reports/`, `history/`,
`conventions/README.md` — which its own README at `claude/scaffold/ai-agents/README.md:11` already
promises), and the `set -euo pipefail` launcher-bricking path. Neither needs a mechanism.

## Consequences

### Positive

- **Existing projects gain new scaffold paths** for the first time. Today they cannot: the
  `[ -e ]` guard on the parent means an existing project can *never* acquire a new folder, which is
  the concrete bug the whole investigation started from.
- **Convergence is continuous, not version-boundary.** Because it fires on **every launch**, it also
  heals a project that was hand-broken *between* updates — which a cursor-based walk, by
  construction, never would.
- **The one unattended code path that touches a user's project is bounded by a one-line invariant** —
  auditable, testable, and cheap to state. "fkit never deletes your stuff" is a property, not a hope.
- We do not build a cursor that cannot survive a clone, 30 empty migration files, and an LLM guessing
  which of the user's files are "loose", for a case that has **never once occurred** in fkit's history.

### Negative — the cost, stated rather than buried

- **Content drift is UNFIXABLE under this decision, and it has ALREADY OCCURRED.** The invariant
  (§Decision 1) is precisely what forbids fixing it: `ai-agents/README.md` **exists**, so convergence
  steps over it, forever. **The safety and the limitation are the same property.** This is the trade.
  - Two files inside a user's `ai-agents/` are fkit-authored and shipped by the scaffold —
    `ai-agents/README.md` and `ai-agents/reviews/README.md`. They are copied in once at init and
    **never touched again**, while their scaffold originals have changed across three eras.
  - **This repo is drifted right now:** `diff ai-agents/README.md claude/scaffold/ai-agents/README.md`
    is non-empty. Two divergences, **load-bearing in opposite directions**: this repo's copy is
    **missing** the `## The standing conventions` section (the scaffold's is right), and the
    scaffold's copy names sprint files `plan-sprint-N.md` while the shipped skills write
    `sprint-N.md` and the file on disk is `ai-agents/sprints/sprint-2.md` (this repo's is right —
    **the scaffold's README is simply wrong, and every new project gets it**).
  - And this file **is read by an agent at runtime**: `claude/agents/fkit-producer.md:88` cites
    `ai-agents/README.md` as the documentation of the task-status vocabulary. It is not decoration.
  - **The owner ruled on this with the cost in front of them.** The judgment: *a stale README is not
    worth giving fkit the power to overwrite files in a user's project.* Recorded here as an
    **accepted tradeoff, not a gap someone missed.**
  - *(The scaffold's wrong `sprints/` row is fixed as a plain defect in fkit's current output — that
    repairs every **new** project. It does not repair an existing one. That residue is accepted.)*
- **A renamed folder yields both.** A user who renamed `sprints/` to `iterations/` gets `sprints/`
  recreated alongside it. Convergence cannot know a rename happened — **and neither can any stateless
  mechanism.** An inherent limit, not a bug; it must be **stated**, not discovered.
- **If a genuinely destructive migration ever arrives, nothing is in place.** The report rates this
  risk **high** and the owner is carrying it deliberately. The honest failure mode: it will arrive
  *attached to a feature someone wants shipped*, and under that pressure the path of least resistance
  is a hand-written `mv`/`rm` dropped into `fkit-claude-init.sh` — i.e. into the unattended,
  every-launch, no-consent code path, because that is the only project-facing hook that exists. **This
  decision makes that hook more capable and more normalised right before the moment of temptation.**
  That is exactly what the "Re-raise only if" fence below exists to catch, and it is why the fence
  fires on the **proposal**.

### Neutral

- **The owner's "no published, user-facing mechanism" constraint is satisfied literally.** There is no
  `fkit migrate`, no version walk to run or reason about. The user launches `fkit`; their tree
  converges. There is nothing to publish because there is no mechanism.
- **The authoring instinct behind `migration-current.md` is right and already has a home.** A change
  that alters the shape of what fkit puts on disk should be recorded **when it is made**, not
  reconstructed by git archaeology later (which is what this investigation had to do). That home is
  the **ADR's own "Consequences" section** — [ADR-013](adr-013-knowledge-base-root-holds-the-living-canon.md)
  `:160-183` already enumerates exactly what must change downstream. That is `migration-current.md`,
  minus the new file, minus the new convention, minus the mechanism.

## Amendment — 2026-07-14: a supporting fact was falsified by implementation; **the decision stands**

**The correction.** The safety bar's "refuse on weird state" row asserted, as empirically verified,
that `cp -R` **writes through a symlinked `ai-agents/`, outside the project**. **That is false, and it
is retracted.** It was never tested; it was *inferred* from the (true) fact that `[ -e ]`/`[ -d ]`
dereference symlinks, and then written down as though it had been. **No write-outside-the-project bug
ever shipped.** Falsified twice, independently, while implementing this ADR:

- **fkit-coder**, macOS/BSD `cp`: a **dangling** symlink destination makes `cp -R` **refuse** —
  `cp: …/ai-agents: File exists`, rc=1 — writing nothing outside the project.
- **fkit-reviewer**, Debian container: **GNU coreutils 9.1 `cp -R` refuses too** (rc=1; the outside
  path is **not** created). **BusyBox refuses too.** Codex confirmed from the GNU manual that the
  historical write-through occurs only under `POSIXLY_CORRECT`.

**The three true grounds, which replace it** *(and which are what a reader should now use)*:

1. **Dangling symlink → the launcher is BRICKED.** `cp` refuses, rc=1, and under `set -euo pipefail`
   init dies before Claude starts. A **denial-of-service** bug, not an exfiltration bug — less
   alarming, and *actually real*, which the retracted claim was not.
2. **Live symlink → GNU `cp` genuinely DOES write through** (verified: rc=0, scaffold lands outside
   the project). It is **unreachable today only by accident**: `[ -e ]` dereferences the live link,
   sees "exists", and short-circuits to *"left as-is"*, so the `cp` never runs. **What arms it is this
   ADR's own Decision §2** — additive convergence replaces that skip with **per-path writes**. So the
   hazard is real and **prospective**, and **convergence is what makes it reachable**.
3. **File where the directory belongs** → silent skip, forever, no diagnostic. Real today, unchanged.

**Why this does not change the decision — and why it *strengthens* it.** Every REQUIRED row of the
safety bar stays REQUIRED; the invariant (Decision §1) is untouched; the rejection of the semver walk
(Decision §4) never depended on this claim. Ground 2 is a **sharper** argument for the gate than the
one originally made: the gate is not remediation of an existing bug — it is a **precondition of the
change this ADR approves.** Convergence must not ship without it. **The bar gets no easier; if
anything one row just got harder to drop.**

**Why amended in place rather than superseded.** Following the precedent of
[ADR-013](adr-013-knowledge-base-root-holds-the-living-canon.md)'s own amendment: what changed is
**evidence, not decision**. A superseding ADR exists to explain a *changed ruling*, and there is no
changed ruling here — nothing in Decision §§1–6 moves, and no work done under this ADR needs redoing.
The false sentence is **struck, not deleted**, so the record shows the claim was **falsified by
implementation and review** rather than quietly laundered. *(Task 27's brief and the Sprint 2 addendum
carry the same error; the fkit-producer is correcting those.)*

## Rejected alternatives

### `migration-current.md` + per-version `migration-X.Y.Z.md`, walked in semver order (the owner's original idea)

**Rejected as premature — not as wrong.** Stated at its strongest: it is the standard
Rails/Django/Flyway pattern, and it is **the right design for a product with non-commutative,
destructive migrations and a reliable per-project cursor.** If fkit ever becomes that product, "one
file per released version" is a reasonable starting point again — **provided the cursor problem is
solved first.** fkit is not that product **yet**, and every one of the pattern's load-bearing
assumptions is currently false:

1. **The cursor cannot survive a `git clone`** (Context §3) — and a walk without a cursor **replays
   every destructive migration against an already-migrated tree**. This is the fatal one, and it is
   the one that survived the adversarial pass.
2. **It would key on a version; fkit is keyed on a sha** (Context §4). A semver walk over a sha-keyed
   distribution installed at `main` HEAD is not well-defined. The brief's own constraint was that the
   choice "must not fight the existing self-update"; this fights it directly.
3. **It builds ordering and replay — the two properties that make migrations dangerous — for
   operations that need neither.** Every migration fkit has ever needed is additive and idempotent,
   and additive-idempotent operations **commute**: order is meaningless, re-running is free. It is the
   most expensive available way to do `mkdir -p`.
4. **It converges only at version boundaries**; the existing hook converges **continuously**.

### Natural-language migration items executed by a migration agent

**Rejected — the worst option on the table.** An LLM handed *"move the loose files in
`knowledge-base/` into `reports/`"* and pointed at a hand-edited project must **decide which files are
loose**, and it will sometimes be wrong, because the user's own documents are indistinguishable from
fkit's by inspection. Non-determinism is fine in an agent that *proposes*; it is **not** fine in the
one unattended code path that **moves the user's files**. It cannot be tested (same input, different
behavior), cannot be faithfully dry-run (the dry run is a *different* LLM call from the real one), and
cannot be rolled back (it does not know what it did). **If a destructive migration is ever genuinely
needed it must be an executable, reviewed, tested script — rigidity is the *feature* — gated on
explicit consent, never run unattended on launch.**

### Overwrite the fkit-authored READMEs on every launch (the naive content-drift fix)

**Rejected.** It silently destroys owner edits — and in **this very repo** the drift is *partly
hand-authored improvement* (the repo's `sprints/` row is the correct one, the scaffold's is wrong).
Overwriting would make fkit **worse**. It also breaks the invariant, which converts every "not
required" row of the safety bar into "required".

### A shipped content-identity hash manifest (the *correct* content-drift fix — deferred, not rejected)

Recorded so it is not re-derived from scratch: on launch, hash the on-disk file; if it byte-matches
**any version fkit has ever shipped** of that file (fkit knows them all — they are in its own git
history, distillable to a small manifest shipped with the install), the user never touched it → safe
to replace. If it matches **nothing** fkit ever shipped, the user edited it → **never touch it**, and
report the divergence once. Stateless, needs **no cursor**, survives a fresh clone, involves no LLM,
and is strictly smaller than a semver walk. **It is the right answer if and when content drift is
judged worth solving.** Note it is also further evidence against the semver walk: the correct
mechanism here keys on **what the file is**, not **which version you came from**.

**Deferred by the owner** (Decision §5). Its trigger is in the re-raise field below.

## Re-raise only if

> **1. Someone PROPOSES a change that would move, rename, or delete content inside a consuming
> project's `ai-agents/`.**
>
> **The trigger fires on the proposal, not on the implementation** — because by the time a destructive
> migration is *written*, the wrong hook has already been chosen. That proposal **is** the trigger. It
> **voids this decision and returns to the owner.** It does **not** get quietly implemented as a
> one-off inside `fkit-claude-init.sh`, which is the unattended, every-launch, no-consent code path
> and therefore the single worst place in fkit for it to land. At that point `migration-X.Y.Z` becomes
> a reasonable starting point again — **provided the gitignored-cursor problem (Context §3) is solved
> first.**
>
> **2. A THIRD fkit-authored file inside `ai-agents/` starts drifting.** Two have (Consequences). At
> three, the content-identity hash manifest stops being a deferred nicety and becomes a real scope
> call to put back to the owner.

**Not** a trigger: adding a folder, a README, or a file to the scaffold — **that is convergence, and
it works.** **Not** a trigger: the number of released versions growing.

## Related

- [`ai-agents/knowledge-base/reports/2026-07-14-migration-mechanism.md`](../reports/2026-07-14-migration-mechanism.md)
  — the full evidence, rev 2 (post-adversarial). §0 = corrections to rev 1; §6 = the rejection; §8 =
  the safety bar; §10 = why the re-raise trigger fires on the proposal.
- `claude/fkit-claude-init.sh:18` (`set -euo pipefail`), `:27-32` (the all-or-nothing guard this ADR
  replaces), `:49-60` (agents/skills already self-heal), `:66` (durable per-project state exists),
  `:125-139` / `:137` (**`.fkit/` is gitignored** — the load-bearing fact).
- `claude/fkit-claude.sh:77-88` (sha comparison), `:106-120` (`fkit update` → install share only),
  `:280-284` (init runs on **every** launch; `:281,283` unguarded → failure bricks the launcher).
- `install.sh:39-72`, `:55-62` (installs at `main` HEAD, not at a tag); `bin/release.mjs:8-10`
  (patch bump per release); `VERSION` (`0.1.30`, 30 tags, zero migration files).
- `claude/scaffold/ai-agents/README.md:11` (promises five `knowledge-base/` folders the scaffold does
  not ship); `claude/agents/fkit-producer.md:88` (an agent reads the drifted README at runtime).
- [ADR-013](adr-013-knowledge-base-root-holds-the-living-canon.md) `:160-183` — its "Consequences"
  section already performs `migration-current.md`'s authoring job.
- [ADR-009](adr-009-claude-code-native-is-the-only-runtime.md) — the Omnigent removal whose orphaned
  project-local state (`.fkit/agents/`, `.fkit/run`, `.fkit/team-session`, `.omnigent/`) is the one
  **destructive** act still on the table. It is **out of scope for this ADR**, needs its own consent
  gate, and **`.fkit/settings` is NOT a target** — it is live current-runtime state
  (`claude/fkit-claude.sh:257-268`).
