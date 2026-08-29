# ADR-041: The active sprint is selected by resolved identity, not by a filename glob — and `sprint-backlog.md` is a backlog board

**Date**: 2026-08-10
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md`
**Decided by**: **the owner**, ruled 2026-08-10 via `AskUserQuestion` in a live session — option label
verbatim **"Accept — selection by identity (Recommended)"**; recorded by the architect under task `0261`
**Depends on**: [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — **cannot ship before it**
**Implemented by**: tasks `0265` (dashboard half), `0266` (the selection site), `0267` (five prose sites)

## Context

`/fkit-status` resolved the **active sprint** by globbing `sprint-*.md` at the top of
`ai-agents/sprints/`. The downstream reporter declined to make this call for fkit — *"whether the
glob should widen, or whether projects should be told to name plans `sprint-N.md`, is a product call
we are not making for you."*

### ⚠️ On the reporter's repo this is not a separate, lower-stakes call — it compounds on one file

The report files this as a separate item. **That under-states it.** On their repo the two findings
land on the **same file**:

1. Their plans are `plan-sprint-N.md`, so **the only file matching `sprint-*.md` is
   `sprint-backlog.md`** — a board of explicitly *unscheduled* work. A bare `/fkit-status` selects it
   as "the active sprint".
2. That same file's basename is `sprint-backlog`, **not** `backlog`, so the basename special case does
   not fire and its identity resolves **empty** too.

**Net: the wrong board is selected, and that board then silently loses the check the `Backlog` arm
exists to provide** — the *"scheduled but still parked on the unscheduled board"* test the code's own
comment calls *"the single highest-value drift this board can surface."* One naming convention costs
them the board selection **and** the check.

### The rule that was supposed to prevent this lives only in a template's prose

`ai-agents/sprints/backlog.md`'s header warns in bold that the filename is deliberately `backlog.md`
and *"that is the whole mechanism"*. But that text is not shipped scaffold — it is **generated per
project** by `/fkit-task-brief`, and only if the project ever files an unsprinted brief. The reporter
read it, which is how they noticed the defect — **from the other side**. *A load-bearing naming rule
living only in a generated header is a rule nobody enforces.*

### A correction the ADR makes to its own task's brief

Task `0261`'s brief said a wider glob catching `sprint-backlog.md` *"also catches our own
`backlog.md`."* **Measured: it does not** — `backlog.md` contains no substring `sprint`. The
conclusion (reject the widening) is unchanged; **the reason is different, and the different reason is
what rules out every "just widen the glob a bit more carefully" variant.**

## Decision

**Whose problem is it?** *fkit's* — a project names its planning documents for its own readers, and
fkit's job is to identify them, not to require them.

**The active sprint is the plan whose resolved identity is the highest-ordered `Sprint <N><suffix>`
among the `.md` files at the top of `ai-agents/sprints/`. Selection stops being a filename glob and
becomes a function of ADR-040's identity grammar.**

### 1. The selection rule

1. **Candidates:** every `*.md` **directly** in `ai-agents/sprints/`. Not `done/`. **No pattern on the stem.**
2. Resolve each through ADR-040's ladder, extended by §2 below.
3. **Eligible** = a `Sprint <N><suffix>` token. **`Backlog` is never eligible. Unresolved is never eligible.**
4. **Order** by `<N>` as an **integer**; tie on `<N>`: absent suffix < `a` < `b` < … So `Sprint 4c` >
   `Sprint 4b` > `Sprint 4`, and `Sprint 10` > `Sprint 9`.

   > ⚠️ **A correction the ADR makes to its own draft, at its accurate strength.** The draft claimed
   > today's "highest N" is a *text sort* ranking `sprint-9` above `sprint-10`. **That was an
   > over-claim and is withdrawn** — there is no sort anywhere in the code; the old rule was **prose
   > instructing a model**, and a model asked for the highest N will most likely answer 10. **The
   > actual defect is weaker and still sufficient:** the ordering was carried in prose and pinned by
   > no test. This clause is **a contract being written down for the first time, not a bug fixed.**

5. **Same-identity tie-break, stated concretely** — *"deterministic" is not implementable as an
   adjective: **sort the colliding basenames by BYTE ORDER ascending under `LC_ALL=C`, take the
   first.** Not locale collation (**board selection must not depend on the reader's locale**); not
   mtime (git does not preserve it, so a fresh clone would select a different board). **The flag is
   structural, not prose discipline** — the collision must surface as a plan-level drift record naming
   **every** colliding file and must reach the roll-up. Two files claiming `Sprint 6` is a real defect
   *in the project*; the briefing's job is to name it, not to stop.
6. **Empty eligible set:** say so, list every candidate with its resolved identity or `unresolved`,
   and stop. **Never fall back to a `Backlog`-identity board. Do not guess.**

### 2. The `Backlog` identity token — the ruling on `sprint-backlog.md`, by name

A whole trimmed H1 segment that is exactly `Backlog` **or** exactly `Sprint Backlog` resolves to
`Backlog` — **normalized to `Backlog`, never `Sprint Backlog`**, because that exact string is what
every brief carries and what the drift arm compares against. The basename special case is
**untouched**; this is a rung *above* it.

| Half of the compounded defect | Before | After |
|---|---|---|
| Board selection | the only `sprint-*.md`, so a bare `/fkit-status` reports it as the active sprint | identity `Backlog` → **never eligible**; the active sprint becomes `plan-sprint-6.md` |
| Identity / drift | resolves EMPTY → the highest-value check unreachable | resolves `Backlog` → **regains the check** |

**Stated residual:** a project whose unscheduled board is `sprint-backlog.md` with an H1 carrying
*neither* token (`# Unscheduled work`) resolves EMPTY — safe as a selection (unresolved is never
eligible) but it **loses** the check and reports `unresolved-plan-sprint` on every run. Accepted: a
loud failure, which is exactly what ADR-040's guard exists to preserve.

### 3. fkit's own `backlog.md` — name unchanged, exclusion **strengthened**

It keeps its name. The *mechanism* changes: the exclusion was *"the filename is outside the glob"*;
it is now *"the identity is `Backlog`"*. **That is stronger, not weaker — renaming it into any glob
would no longer make it the active sprint.** Do not rename it anyway: its href is written into every
`➡️ Moved to [Backlog](backlog.md)` marker in the repo.

### 4. Enforcement point — there is none for filenames, and that is the point

**There is no filename rule left to enforce, so there is no filename enforcement site.** What replaces
it is a **runtime** enforcement point that already existed: `drift unresolved-plan-sprint` plus the
roll-up's *"drift on the plan itself"* clause tell the reader, **on the run they just made** — a
feedback loop shorter than any document.

`claude/structure-spec.md` is explicitly **not** the site: it governs fkit-authored files and claims
nothing about a project's plan documents.

**The residual, stated the way ADR-038 states its own:** the identity grammar is **documented and
detected, never prevented**. Nothing stops a project writing a plan fkit cannot identify; the tool
says so on every run and never guesses.

### 5. Binding — one grammar, one implementation

`dashboard.sh` resolves identity in shell; the selection step is **prose executed by an LLM**. If that
prose re-states the grammar, the component acquires **two grammars for one question** — the exact
defect class `dashboard.sh`'s own comments document, where three grammars for *"is this the `## Status`
heading?"* produced a false `multiple-status-tables` and a misleading `die`. **Therefore the selection
step must obtain each candidate's identity FROM `dashboard.sh`.** The CLI surface is the
implementer's call; **re-implementing the grammar is not.**

### 6. Seven prose sites this ADR **falsifies** — each false as written, not merely stale

Two in `fkit-status/SKILL.md` (the selection rule and its explanatory block), two in
`fkit-task-brief/SKILL.md` (including **the generator** of a project's `backlog.md` header), two in
`fkit-sprint-ship-loop/SKILL.md`, and **this repo's own live `ai-agents/sprints/backlog.md` header**.
⚠️ Two of them are not ordinary doc edits: **site 3 is a generator** whose output already exists as
project content in every downstream repo that filed an unsprinted brief — **those copies will not be
repaired by a launch-convergence refresh** — and **site 7 is a live board, not scaffold**, so it needs
the same correction by hand as a **separate act**. Two sites' *rules survive while their stated
reasons do not*, so the instruction is **rewrite the reason, keep the rule**.

## Consequences

- **Positive:** the reporter's bare `/fkit-status` selects a real sprint plan; `sprint-backlog.md`
  regains its highest-value drift check; `backlog.md`'s exclusion no longer depends on a naming rule a
  project might normalize away; and the "highest N" ordering — until now prose with no test behind it
  — becomes a **written, tested contract**.
- **Negative:** seven prose sites, one of them a generator whose existing output is unreachable.
  Selection costs one file read per candidate instead of a glob. And §5 forces a **new interface**
  between the skill and `dashboard.sh` that did not exist before.
- ⚠️ **Residual — "highest N" is a RETAINED HEURISTIC WITH A NAMED EXIT, not an endorsement.** On the
  reporter's repo the eligible set resolves the active sprint to `Sprint 6` — while `plan-sprint-4c.md`
  ("Production Stabilization", carrying a live status table) may well be what they are actually
  working. **This ADR does not fix that.** It makes the existing heuristic well-defined, applies it to
  the right candidate set, and pins it with a test. **Ruled by the architect, not the owner, and
  flagged to the owner as such**; the replacement (an explicit active-sprint marker) is already named
  as the exit. *Recorded at that strength deliberately — a heuristic kept for want of a reason to
  replace it.*

## Rejected, by name

- **(a′) Keep the glob as a fallback — identity first, glob when unresolved.** Put to the owner
  alongside the chosen option and **rejected on 2026-08-10**. Superficially safe, but it puts **two
  grammars behind one question**, and — decisively — **the fallback fires only in the situation it
  gets wrong**: `sprint-backlog.md` with an identity-less H1 is exactly the "unresolved" case the
  fallback would catch, and the glob would then select it.
- **(b) Widen the glob.** It selects `sprint-backlog.md` as the active sprint. **That *is* the
  reported defect.** The discriminator the glob needs — *is this board scheduled work?* — **is not in
  the filename, it is in the identity.**
- **(c) Name it a convention and enforce it.** Contradicts the owner's posture; `structure-spec.md` is
  the wrong instrument; and the enforcement it buys is **a document** — which already exists, and
  which the reporter read and still hit the defect from the other side. *Documenting harder is not a
  new mechanism.*
- **(d) An explicit active-sprint marker** — **rejected as primary, retained as the named escape hatch**
  against this project's zero-config posture. Re-raise it if the "highest N" residual actually bites.
- **(e) Do nothing.** Argued rather than defaulted past: it leaves a bare `/fkit-status` reporting an
  unscheduled board as the active sprint **with no signal that it did so** — selection emits no
  equivalent of `unresolved-plan-sprint`. **Refusing silent wrongness at the identity level and
  accepting it at the selection level would be incoherent.**

## Landed state — verified on disk 2026-08-13

`dashboard.sh` carries `resolve_identity()`, `is_eligible()`, a `select-active` mode emitting
`active` / `candidate` / `drift ambiguous-active-sprint` / `active none` records, and an `identity
<plan>` primitive. `fkit-status/SKILL.md` now instructs the model to **run
`dashboard.sh select-active`** and explicitly says *"Do not re-derive any of that here"*, citing §5 —
the one-grammar constraint honored at the site it was written for.

## Related
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — the grammar this selector is a function of
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — the prose-not-prevention residual shape reused here
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — preserved under every branch
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the `backlog.md` board whose exclusion this strengthens
- [[systems/fkit]]
- **Its task chain:** [[tasks/decide-whether-the-active-sprint-glob-widens]] (`0261`, the decision) · [[tasks/implement-adr-041s-dashboard-half]] (`0265`, the `Backlog` token + the resolve-identity interface §5 requires) · [[tasks/retire-the-sprint-glob-in-fkit-status-skill]] (`0266`, §6 sites 1–2) · [[tasks/correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism]] (`0267`, §6 sites 3–7 — ⚠️ **including a generator whose emitted copies in downstream repos are unreachable by anything fkit ships**)
- [[tasks/the-2026-08-13-vault-resync-chain]] — task `0269`, the ingest that brought this ADR into the vault
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — ⚠️ *Added 2026-08-22:* the board `select-active` now resolves to, after a real `active none` interval in which `backlog.md` was the only candidate and was correctly refused
  > ⚠️ **Dated correction 2026-08-29 — *"the board `select-active` now resolves to"* is no longer true; the line is left byte-identical.** Sprint 6 was **archived** that day to `ai-agents/sprints/done/sprint-6.md`, and `select-active` **no longer returns it** — re-measured this run. ⭐ **The mechanism this ADR decided is what made the archival take effect**: selection reads **resolved identity over the eligible set**, so moving the file out of `ai-agents/sprints/` removed it from that set — a banner alone would not have. ⛔ **What `select-active` resolves to now is deliberately NOT recorded here** — it was changing as this note was written, and pinning a live selection result onto an ADR page is the exact staleness this note is repairing.
