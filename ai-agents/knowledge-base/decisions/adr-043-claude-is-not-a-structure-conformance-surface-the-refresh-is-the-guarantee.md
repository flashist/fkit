# ADR-043: `.claude/` is not a structure-conformance surface — the unconditional refresh is the guarantee

- **Status:** accepted
- **Date:** 2026-08-13
- **Deciders:** fkit-architect (recommendation); **owner (Mark Dolbyrev) — signed off 2026-08-13 (see
  §Owner sign-off)**
- **Task:** `0255` — *Decide whether `.claude/` enters the structure-conformance surface*

## Context

**Nothing anywhere checks whether a project's `.claude/` matches the installed fkit version.** Task
`0255` raised this as a genuine, unanticipated architecture question and asked for a decision, not an
implementation. Everything below was re-derived from disk on **2026-08-13** rather than inherited
from the brief.

### The state of the surface today

- **The structure spec has zero `.claude` rows.** `grep -c '\.claude' claude/structure-spec.md` → **0**,
  across 48 inventory rows.
- **The spec inventory is the check's entire input.** `claude/skills/fkit-heal/check.sh:23` pins the
  contract verbatim — *"one line per spec-inventory row, in table order"*. The spec is resolved from
  the share at `:107`, parsed at `:139-155`, and `:155` dies outright if the pinned table headings are
  missing. **A path absent from the tables is a path the check cannot see.**
- **The manifest cannot cover it either.** `bin/generate-structure-manifest.mjs`'s `workingTreeFiles()`
  (**`:259-295`**) walks `claude/scaffold/` only, and refuses an unrecognized top-level entry loudly
  rather than guessing (`:266-276`). Agents and skills ship from `claude/agents/` and `claude/skills/`,
  which the walk never reaches.
- **Staleness is handled bluntly and silently.** `claude/fkit-claude-init.sh:479-490` does
  `rm -f "$dest/.claude/agents/fkit-"*.md` + `cp`, and `rm -rf` each `$dest/.claude/skills/fkit-*/` +
  `cp -R`. It prints one count line (`:490`) — no per-file verdict, no comparison, no report.
- **The paths are gitignored** — `claude/fkit-claude-init.sh:568-569`.

### The trap that makes it more than a coverage gap

A project whose owner ran `fkit update` but never re-launched `fkit` there keeps stale agents and
skills with no signal. The launch notice cannot fire, because **the launch is the same event that
refreshes them**. Pinned precisely: init runs at `claude/fkit-claude.sh:358/360`; `structure_notice`
is defined at `:453` and **called at `:507`** — 149 lines and one full refresh later. The notice can
only ever read clean.

### `.claude/` was never considered, and its semantics are the inverse of `ai-agents/`

`grep -c '\.claude'` returns **0** for
[ADR-039](adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md), **0** for
`reports/2026-08-06-design-post-update-structure-check.md`, and **0** for
[ADR-015](adr-015-additive-launch-convergence-no-migration-mechanism.md). There was no prior ruling to
be consistent with and no rejected alternative to reopen.

`ai-agents/` is governed by ADR-015's ratified invariant — *create-if-absent only; no overwrite, no
move, no delete, ever* — which is exactly why conformance there needs a spec, a historical manifest,
and consent-gated repair. `.claude/`'s fkit-managed paths are the **inverse**: init deletes and
overwrites them unconditionally, every launch, on a gitignored tree.

### What changed between the brief and this decision

- Task `0253` **shipped**. `README.md:35-40` now states the per-project re-launch step in prose,
  ending *"keeps its **old agents and skills, and nothing tells you**"*, plus the
  `FKIT_SETUP_ONLY=1 fkit` escape hatch. Option 4's premise is **shipped fact, not a pending
  dependency** — the brief wrote it as *"already being closed"*.
- `0253`'s **R2 residual** (`ai-agents/tasks/done/0253-state-the-per-project-relaunch-step-fkit-update-requires/review.md:158-167`,
  owner-ruled 2026-08-13 *"Accept both as residuals"*) deliberately declined to reconcile
  `README.md:54`, because the obvious fix would have pre-empted this decision. **That reconciliation is
  settled here** (§Consequences C6).
- **One brief citation was off by one at each end**: `workingTreeFiles()` is `:259-295`, not
  `:258-293` (`:258` is the closing JSDoc line, `:295` the closing brace). Non-material; corrected for
  the record.

---

## Decision

**`.claude/` is deliberately NOT a structure-conformance surface.** The unconditional refresh is the
guarantee. No spec row, no manifest row, no new class, no new check.

**`claude/structure-spec.md` keeps zero `.claude` rows by decision, not by omission.** This sentence
is the one that closes `0255`'s finding that the tree *"was never considered"*. A future reader — or
a future review — encountering the absence must read it as **ruled**, not as an oversight awaiting
correction.

### The strongest argument, stated as such: the refresh is *stronger* than conformance, on the one axis conformance cannot reach

This is not a concession that `.claude/` gets a weaker guarantee in exchange for less machinery. On
**deletion**, it gets a **strictly stronger** one:

- Under **ADR-015's invariant**, a file fkit stops shipping **lingers under `ai-agents/` forever**.
  Delete is forbidden. `/fkit-heal` can only ever **report** it — repair may replace content, never
  remove a path.
- Under `.claude/`'s refresh, `rm -f fkit-*.md` / `rm -rf fkit-*/` followed by `cp`
  (`claude/fkit-claude-init.sh:481-488`) means **a retired agent or skill is gone, automatically, on
  the next launch** — no report, no consent step, no owner action.

Bringing `.claude/` under the conformance surface would be describing a stronger guarantee in a weaker
vocabulary.

### The supported-entry argument

Every supported entry point refreshes first — `fkit`, `fkit <role>`, and `FKIT_SETUP_ONLY=1 fkit` all
run init at `claude/fkit-claude.sh:356-361` before anything else. There is no supported path into an
fkit session that does not pass through the refresh.

---

## Options considered

All four options `0255` named are weighed in full. The three rejected are rejected on their real
costs, not dismissed.

### Option 1 — extend the structure spec + manifest to `.claude/fkit-*` — **REJECTED**

**What it buys, and it is genuinely elegant:** a uniform surface that propagates for free. `check.sh`
reads the spec at runtime from the share (`:107`, `:139-155`), and the launch notice parses
`check.sh`'s pinned rows (`fkit-claude.sh:507`), so new spec rows reach **both** consumers with
**zero new code in either**.

**Why it is rejected — four costs, compounding:**

1. **The manifest is the wrong instrument, not merely an unfunded one.** It exists to separate
   `untouched-stale` from `owner-edited` — i.e. to answer *"may fkit overwrite this?"* On
   `.claude/fkit-*` the answer is unconditionally **yes**, every launch (`init:479-490`), on a
   **gitignored** tree (`:568-569`). **"Owner-edited" is not a state that survives a launch.** Option 1
   pays the manifest's entire price for the one distinction this tree cannot have.
2. **The scale is not incidental — measured 2026-08-13.** The payload is **36 files per release**
   (7 agents + 29 skill files). The **entire** manifest — every hash fkit has ever shipped, across all
   of its history — is **66 content rows**. One release of `.claude/` is over half of all of fkit's
   history, and every future release adds up to 36 more, permanently.
3. **It needs a seventh class.** None of the spec's six (§"The six classes") fits. The nearest,
   `fkit-authored reference file`, carries repair semantics that are the **exact inverse** of init's:
   *"replace **only** if untouched-stale …; touched → report with diff, never touch."*
4. **The build test blocks it concretely.** `test/structure-spec.test.js` asserts **bidirectional set
   equality** between Tables A/B and one ground-truth tree — `SCAFFOLD_AI` (`:49`), `groundFiles`
   (`:192`), assertions A and B (`:195-208`). `.claude/` rows fail in **both** directions until the
   test grows a second ground-truth root.

**And after all four costs are paid, it reports nothing:** the refresh precedes the notice, so every
`.claude/` row reads `conforming` on every launch.

### Option 2 — report at launch, before the refresh — **REJECTED**

**What it buys:** the only observation point where the divergence is simultaneously real and visible.
init already holds both trees; the information is free at that instant and destroyed one statement
later. This is the sharpest of the three rejected options.

**Why it is rejected:**

- It adds comparison logic to `claude/fkit-claude-init.sh`, which runs `set -euo pipefail` (`:21`) and
  is the one script that must never brick a launch — the same script carrying fkit's only destructive
  operation (the Omnigent orphan cleanup, `:571+`). Every added step there is launch-path risk against
  modest information value.
- **It reports a fault fkit repairs in the next statement.** The notice's own stated contract is
  *"awareness only: nobody runs what nobody is told to run"* (`claude/fkit-claude.sh:394`) — but here
  there is nothing for the owner to run.
- The frequency is wrong: it fires on **every** launch after **every** update, in **every** project,
  with near-zero actionability.

**Its useful core is a receipt, not a check** — see §Consequences C7, where that core is preserved as
explicitly permitted.

### Option 3 — report out-of-band (`/fkit-heal` or a new check) — **REJECTED**

**What it buys:** in principle, exactly the property the brief wanted — *"is this project current?"*
answerable without the act of asking fixing it.

**Why it is rejected:**

- It cannot exist without Option 1's spec rows, **or** a second, non-inventory code path inside
  `check.sh` — a parallel comparison engine in a script whose entire design premise is one contract,
  one input (`:23`, `:139-155`).
- **It is not actually out-of-band.** Its only realistic invocation is `/fkit-heal` inside a session,
  and any session started by `fkit` was preceded by the refresh at `:358/360`. Out-of-band in name,
  in-band in fact.
- **It has no repair to offer.** `repair.sh`'s consent gate exists because `ai-agents/` files may carry
  owner edits. Here the repair is *"re-launch"* — which the owner already did to reach the session.

### Option 4 — not a conformance surface at all — **ACCEPTED**

**What it buys:**

- **It is already true.** Every supported entry refreshes first (`claude/fkit-claude.sh:356-361`).
- **The deletion argument** — the refresh is strictly stronger than conformance where ADR-015's
  invariant cannot reach (see §Decision).
- **The gap that was real is closed.** The owner not being told to re-launch: `README.md:35-40`,
  shipped under `0253`.
- **Zero cost.** No spec row, no manifest row, no seventh class, no test change, no init risk.

**What it concedes** — see §Residuals. Both are conceded openly rather than argued away.

### A fifth framing, noted for the record

All four options answer the question by **checking state**. The question an owner actually has —
*"did my `fkit update` reach this project?"* — is about an **event**, and is cheaper as **provenance
than as conformance**. That framing is preserved, not built, in §Consequences C7.

---

## Residuals — conceded, not argued away

**R1 — a project entered without `fkit` keeps stale agents and skills, unobserved.** Running plain
`claude` in an fkit project loads `.claude/agents/` and `.claude/skills/` with no refresh. This is
real. But **fkit has already declined that mode**: `claude/fkit-claude.sh:384-385` refuses to start an
unroled session, verbatim — *"it would fail OPEN … Refusing is the safe answer."* Staleness in a mode
fkit refuses to create is the known cost of entering outside the launcher, not a conformance gap.

**R2 — there is no retrospective signal.** The owner is never told that their last N sessions ran on
old agents; the refresh is silent about what it changed. Low value, and better answered by a receipt
than by a check (C7).

*(Checked and discarded as a third residual: a partially-failed refresh. `set -euo pipefail`
(`init:21`) aborts init mid-copy, and `claude/fkit-claude.sh:370-375` then prints a loud warning
naming exactly this — agents, skills, or the `ai-agents/` tree may be *"missing or stale"*. Already
covered; not an argument for conformance.)*

---

## Consequences

### C1 — Explicitly unaffected

Stated plainly, because verification step 4 of `0255` requires it and because a later reader must not
go looking for edits this decision did not make:

| Artifact | Effect |
|---|---|
| `claude/structure-spec.md`'s **pinned machine-read contract** | **unaffected** — unchanged, and zero `.claude` rows is now the ruled state |
| `test/structure-spec.test.js` | **unaffected** — its bidirectional equality against `claude/scaffold/` stands as-is |
| `claude/structure-manifest.tsv` and `bin/generate-structure-manifest.mjs` | **unaffected** — the scaffold-rooted walk stays scaffold-rooted |
| `claude/skills/fkit-heal/*` (`check.sh`, `repair.sh`) | **unaffected** |
| `claude/fkit-claude-init.sh`, `claude/fkit-claude.sh` | **unaffected** |

### C2 — ADR-015's invariant is **not touched and not amended**

It governs `ai-agents/`. It **neither extends to `.claude/` nor needs to**. `.claude/` is outside its
scope by construction — the invariant forbids overwrite and delete, and `.claude/`'s whole mechanism
*is* overwrite and delete. This ADR records that boundary explicitly; it does not move it.

### C3 — ADR-039 is **not touched and not amended**

The consent-gated repair capability it licensed is scoped to the spec inventory, which remains
`ai-agents/**` plus the two root context files. Nothing here widens or narrows it.

### C4 — The implementation thread **ends rather than defers**

`0255`'s Notes list it as blocking *"the (unwritten) implementation brief for `.claude/`
conformance."* **Under this decision that brief is never written.** The owner was told this in these
terms before signing off and signed off knowing it (see §Owner sign-off). This is the most
consequential consequence of the ruling: the thread is **closed**, not postponed.

### C5 — Absence is now evidence of a decision

Anyone finding zero `.claude` rows in `claude/structure-spec.md` must read this ADR before proposing
to add them. See §Re-raise only if.

### C6 — `README.md:54` must be scoped — a follow-on docs brief

**The problem is real.** `README.md:54` currently reads:

> *"A launch also tells you — one stderr line — when your project's fkit-managed structure diverges
> from what the installed version ships."*

"fkit-managed structure" is nowhere defined in the README, and **the repo's own vocabulary puts
`.claude/` inside that phrase**: `claude/fkit-claude-init.sh:568-569`'s gitignore comments read
literally `'fkit-managed agents'` and `'fkit-managed skills'`. So `:54` appears to promise coverage of
exactly what `README.md:39` says nothing tells you.

> ### ⚠️ The obvious remedy is itself wrong — do not apply it
>
> `0253`'s reviewer proposed **scoping `:54` to `ai-agents/`**. That fix would **under-describe the
> check**. The notice covers the **spec inventory**, and **Table B includes the two root context
> files** — `claude/structure-spec.md:89-90` lists `CLAUDE.md` and `AGENTS.md` — which are **not**
> under `ai-agents/`. A reader told the line covers `ai-agents/` would wrongly conclude a diverged
> root `CLAUDE.md` goes unreported.
>
> This is a second, independent reason it was correct to hold the edit for this decision rather than
> apply it under `0253`.

**Recommended replacement wording** (⛔ **not applied here** — `0255`'s no-implementation fence
forbids touching `README.md`; a producer files the docs brief separately, owner-ruled *"Its own
follow-on brief"*):

> A launch also tells you — one stderr line — when your project's `ai-agents/` tree, or its root
> `CLAUDE.md` / `AGENTS.md`, diverges from what the installed version ships. (The fkit agents and
> skills under `.claude/` are not part of that check: a launch rewrites them outright, so there is
> nothing to diverge.)

The parenthetical is what turns `README.md:39` and `:54` from an apparent contradiction into one
coherent story: **`.claude/` gets no divergence line because it gets an unconditional rewrite** — and
the thing you must do to get that rewrite is the re-launch `:39` now tells you about.

### C7 — A refresh receipt is **permitted, not required**

This decision rules out `.claude/` as a **conformance surface**. It does **not** forbid a *receipt* —
init recording or reporting what it refreshed *from*, as provenance rather than classification. That
would need no spec row, no manifest row, and no verdict vocabulary.

**Nothing is being built, and nothing is filed.** This clause exists solely so a future reader cannot
misread *"not a conformance surface"* as *"no signal, ever."* Anyone wanting it must weigh it on its
own merits — chiefly the launch-path risk in `init` noted under Option 2 — in its own brief.

---

## Re-raise only if

This decision rests on four properties of the code as it stands on 2026-08-13. **Any one of them
becoming false flips the answer toward Option 1 or Option 3, and the question should be reopened.
None is true today.**

1. **`.claude/fkit-*` stops being unconditionally overwritten** — e.g. fkit starts *merging* into an
   agent file the way `merge_rules` merges the managed block into `CLAUDE.md`
   (`claude/fkit-claude-init.sh:476`), or starts honoring an owner edit under `.claude/`. Then
   `owner-edited` becomes a real state and the manifest earns its price.
2. **`.claude/fkit-*` stops being gitignored** (`claude/fkit-claude-init.sh:568-569`) — a tracked tree
   carries diffable owner intent worth protecting.
3. **A supported entry path appears that does not run init first.** Today every one does
   (`claude/fkit-claude.sh:356-361`); residual R1's plain-`claude` path is explicitly *unsupported*
   (`:384-385`).
4. **The refresh becomes non-atomic in a way `claude/fkit-claude.sh:370-375` does not cover** — i.e. a
   partial `.claude/` can survive a launch without the loud setup-failure warning firing.

**Do not re-raise on:** the absence of `.claude` rows in the spec, the absence of `.claude` rows in
the manifest, or the observation that the launch notice never reports `.claude/`. All three are this
decision, working as ruled.

---

## Owner sign-off

Recorded per `0255` verification step 3 — the ruling, its date, and the channel.

- **Ruling:** **Option 4 — `.claude/` is deliberately NOT a structure-conformance surface.**
- **Owner:** the fkit owner (Mark Dolbyrev), in person.
- **Date:** **2026-08-13**.
- **Channel:** `AskUserQuestion` in a live `fkit lead` session — **verbatim option label:
  "Sign off — Option 4"**.
- **Informed consent on what sign-off closes, recorded because it is the most consequential
  consequence:** the owner was told explicitly that `0255`'s Notes list it as blocking *"the
  (unwritten) implementation brief for `.claude/` conformance"*, and that **under Option 4 that brief
  is never written — the thread ends rather than defers**. They signed off knowing that.

Two subsidiary questions were ruled in the same session, both by `AskUserQuestion`, both verbatim:

| Question | Ruling (verbatim label) | Recorded at |
|---|---|---|
| How to handle the `README.md:54` reconciliation | **"Its own follow-on brief"** | C6 |
| Whether to record the refresh receipt | **"Record it in the ADR as permitted, not required"** | C7 |

The owner's stated reason for the second matched the architect's: it stops a future reader misreading
*"not a conformance surface"* as *"no signal, ever."*

---

## Related

- [ADR-015](adr-015-additive-launch-convergence-no-migration-mechanism.md) — the `ai-agents/`
  create-if-absent invariant. **Not touched, not amended** (C2); this ADR records where its scope ends.
- [ADR-039](adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md) — licensed
  consent-gated structure repair. **Not touched, not amended** (C3). Contains zero `.claude` matches —
  the tree was never considered there.
- [ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md) — wiki writes stay exclusive to
  `fkit-wiki`; this ADR's vault ingest is filed separately.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the role lock that makes an unroled
  session unsafe, which is why residual R1's entry path is unsupported rather than merely undesirable.
- `reports/2026-08-06-design-post-update-structure-check.md` — the design behind the conformance
  surface. Zero `.claude` matches.
- Task `0253` — shipped the `README.md:35-40` re-launch prose that is this decision's premise, and
  deferred the `:54` reconciliation to it as an accepted residual
  (`ai-agents/tasks/done/0253-state-the-per-project-relaunch-step-fkit-update-requires/review.md:158-167`).
- Task `0255` — the decision task this ADR discharges.
