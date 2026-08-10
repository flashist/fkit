# ADR-041: The active sprint is selected by resolved identity, not by a filename glob — and `sprint-backlog.md` is a backlog board

- **Status:** accepted
- **Date:** 2026-08-10
- **Deciders:** the owner — ruled 2026-08-10 via `AskUserQuestion` in a live session, option label
  verbatim **"Accept — selection by identity (Recommended)"**; recorded by the architect under task
  `0261`
  (`ai-agents/tasks/done/0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md`).
  Task `0261` flagged that *"tell projects how to name their files"* is a product posture needing
  owner sign-off; it has it. Full record in *§Authority*.
- **Posture this was designed under:** the owner's ruling of 2026-08-10 — **"fkit adapts to the
  project"**. A direction, not an approval of this mechanism; the mechanism was ruled separately.
- **Depends on:** ADR-040 (accepted 2026-08-10). This ADR's selector is a function of ADR-040's
  identity grammar and **cannot ship before it**.
## Context

`claude/skills/fkit-status/SKILL.md:26` resolves the **active sprint** by globbing `sprint-*.md` at
the top of `ai-agents/sprints/` — *"If there is more than one, take the highest N and flag the
ambiguity."* The reporter declined to make this call for us: *"whether the glob should widen, or
whether projects should be told to name plans `sprint-N.md`, is a product call we are not making for
you."* Source: report §8,
`ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`.

### ⚠️ On the reporter's repo this is not a separate, lower-stakes call — it compounds on one file

The report files this as §8, *"clearly a separate call"*. **That under-states it.** On their repo the
two findings land on the **same file**:

1. Their plans are named `plan-sprint-N.md`, so **the only file matching `sprint-*.md` is
   `sprint-backlog.md`** — a board of explicitly *unscheduled* work. A bare `/fkit-status` selects it
   as "the active sprint".
2. That same file's basename is `sprint-backlog`, **not** `backlog`, so `dashboard.sh:93`'s special
   case does not fire and its identity resolves **empty** too.

**Net: the wrong board is selected, and that board then silently loses the check the
`[ "$PLAN_SPRINT" = "Backlog" ]` arm exists to provide** — the "scheduled but still parked on the
unscheduled board" test at `dashboard.sh:796`, which the code's own comment at `dashboard.sh:773-779`
calls *"the single highest-value drift this board can surface"*. One naming convention costs them the
board selection **and** the check.

### The rule that was supposed to prevent this lives only in a template's prose

`ai-agents/sprints/backlog.md:7-11` warns in bold: *"The filename is deliberately `backlog.md`, NOT
`sprint-backlog.md` … that is the whole mechanism by which the default status run ignores the backlog
… Do not 'normalize' this name."* That text is not shipped scaffold — it is **generated per project**
by `claude/skills/fkit-task-brief/SKILL.md:308-312` when the first unsprinted brief is filed, and only
if the project ever files one. The reporter read it, which is how they noticed the defect — from the
other side. **A load-bearing naming rule living only in a generated header is a rule nobody
enforces**, and settling whether that is acceptable is part of this decision.

### A correction to the brief's stated cost of widening

Task `0261`'s brief says *"A wider glob that catches `sprint-backlog.md` also catches our own
`backlog.md` under most widenings."* **Measured: it does not.** `backlog.md` contains no substring
`sprint`, so any glob built around the literal `sprint` (`*sprint*.md`, `*sprint-*.md`) excludes it.
The real cost of widening is not that it catches *our* board — it is that it catches *their*
unscheduled board, which is the reported defect rather than a fix. The conclusion (reject the
widening) is unchanged; the reason is different, and the different reason matters, because it is what
rules out every "just widen the glob a bit more carefully" variant.

## Decision

**Whose problem is it?** *fkit's* — a project names its planning documents for its own readers, and
fkit's job is to identify them, not to require them.

**The active sprint is the plan whose resolved identity is the highest-ordered `Sprint <N><suffix>`
among the `.md` files at the top of `ai-agents/sprints/`. Selection stops being a filename glob and
becomes a function of ADR-040's identity grammar.**

### 1. The selection rule, in full

1. **Candidate set:** every `*.md` directly in `ai-agents/sprints/`. Not `done/` (those are closed —
   unchanged). No pattern on the stem.
2. **Resolve each candidate's identity** through ADR-040's ladder, extended by §2 below.
3. **Eligible** = identity is a `Sprint <N><suffix>` token. **`Backlog` is never eligible.
   Unresolved is never eligible.**
4. **Order:** compare `<N>` as an **integer**. Tie on `<N>`: absent suffix < `a` < `b` < … So
   `Sprint 4c` > `Sprint 4b` > `Sprint 4`, and `Sprint 10` > `Sprint 9`.

   > ⚠️ **Correction to an earlier claim made while drafting this ADR, stated at its accurate
   > strength.** The draft said today's "highest N" is a **text sort** that ranks `sprint-9.md` above
   > `sprint-10.md`. **That was an over-claim and is withdrawn.** Checked: there is no sort anywhere
   > in the code. `claude/skills/fkit-status/SKILL.md:26-28` is **prose instructing a model** — *"If
   > there is more than one, take the highest N **and flag the ambiguity** in the report."* A model
   > asked for the highest N will most likely answer 10.
   >
   > **The actual defect is weaker and still sufficient:** the ordering is **carried in prose and
   > pinned by no test**, so nothing prevents it drifting and nothing would catch it if it did. That
   > alone justifies making integer ordering a **tested contract** — which is what this clause does.
   > It is a contract being written down for the first time, not a bug being fixed.

5. **Two candidates resolving to the *same* identity — the tie-break, stated concretely.**
   *"Deterministic" is not implementable as an adjective, so here is the rule:*

   > **Sort the colliding candidates' basenames (including the `.md` extension) by BYTE ORDER
   > ascending, under `LC_ALL=C`, and select the first.**

   - **Byte order, not locale collation.** Locale collation differs by environment — under
     `en_US.UTF-8` a `Plan-sprint-6.md` and a `plan-sprint-6.md` order differently than under `C`,
     so the same repo would select a different board on two machines. **Board selection must not
     depend on the reader's locale.** `LC_ALL=C` is the only setting that makes the rule a fact.
   - **Basename, not full path** — every candidate is directly in `ai-agents/sprints/` by §1.1, so
     the directory component is identical and contributes nothing.
   - **Not mtime.** git does not preserve modification times, so an mtime tie-break would select a
     different board in a fresh clone than in the working copy. Rejected for that reason.
   - **The flag is structural, not prose discipline.** The collision **must** surface as a
     plan-level drift record naming **every** colliding file — the chosen one and the others — and
     it must set `plan_level_drift` so it reaches the roll-up's drift clause by the same route
     `unresolved-plan-sprint` takes (`dashboard.sh:917`, `:922-923`). Suggested shape, wording is
     the implementer's:
     `drift ambiguous-active-sprint identity="Sprint 6" chosen="plan-sprint-6.md" also="sprint-6.md"`
     ⚠️ **A drift kind that does not reach the roll-up is invisible to beat 6** — the file's own
     comment at `dashboard.sh:911-913` says every drift record must reach that clause or *"every
     drift record is an owner decision"* is false for the ones that don't.
   - **Whether the record originates in a `dashboard.sh` selection mode or is passed to it is the
     implementer's call. That the selector cannot choose not to mention it is not.**
   - Two files claiming `Sprint 6` is a real defect **in the project**; the briefing's job is to name
     it, not to stop.

6. **Empty eligible set:** say so, list every `.md` at the top of `ai-agents/sprints/` **with its
   resolved identity or `unresolved`**, and stop. **Never fall back to a `Backlog`-identity board.**
   Do not guess.

### 2. The `Backlog` identity token — the ruling on `sprint-backlog.md`, by name

ADR-040 defines the H1 segment rung over one token, `Sprint <N><suffix>`. **This ADR adds a second
token to that same rung:** a whole trimmed H1 segment that is exactly `Backlog` **or** exactly
`Sprint Backlog` resolves the identity to `Backlog`.

- **The value is normalized to `Backlog`, never `Sprint Backlog`.** That exact string is what briefs
  carry (`## Sprint: Backlog`, normalized across every brief by task 67) and what
  `dashboard.sh:772`'s arm compares against. `dashboard.sh:104-107` warns that if the two ever
  diverge, *"every backlog row silently takes rule 1's skip and status drift on this board stops
  being reported."*
- **`dashboard.sh:93`'s basename special case is UNTOUCHED.** The new token is a rung *above* it. A
  `backlog.md` with a prose H1 still resolves there, and the owner's 2026-07-18 basename-not-full-path
  ruling (review R4) is not reopened.
- **ADR-040's "two or more distinct identity segments ⇒ refuse" rule earns its place here.** A sprint
  plan titled `# Sprint 5 — Backlog` yields two distinct tokens, refuses at the H1 rung, and falls
  through to the filename rung — which resolves `sprint-5.md` correctly.

**Stated outcome for `sprint-backlog.md` (H1 `# Geoconflict — Sprint Backlog`) — both halves of the
compounded defect:**

| Half | Before | After |
|---|---|---|
| Board selection | the only `sprint-*.md`, so a bare `/fkit-status` reports it as the active sprint | identity `Backlog` → **never eligible**; the active sprint becomes `plan-sprint-6.md` (`Sprint 6`) |
| Identity / drift | resolves EMPTY → the `dashboard.sh:796` highest-value check unreachable | resolves `Backlog` → reaches `dashboard.sh:772`'s arm → **regains the `:796` check** |

**Stated outcome for the residual case:** a project whose unscheduled board is `sprint-backlog.md`
with an H1 carrying **neither** token (`# Unscheduled work`) resolves EMPTY. It is therefore **not
eligible** as the active sprint (safe — unresolved is never eligible), but it **loses** the `:796`
check and reports `unresolved-plan-sprint` on every run. Accepted: a loud failure, and exactly the
failure ADR-040's guard exists to preserve.

### 3. fkit's own `backlog.md` — name unchanged, exclusion strengthened

`ai-agents/sprints/backlog.md` **keeps its name and keeps its exclusion from the default status run.**
The *mechanism* changes: today the exclusion is "the filename is outside the glob"; after this ADR it
is "the identity is `Backlog`". That is **stronger, not weaker** — renaming it into any glob would no
longer make it the active sprint.

**Do not rename it anyway.** It is out of scope here, and its href is written into every
`➡️ Moved to [Backlog](backlog.md)` marker in the repo
(`ai-agents/knowledge-base/conventions/task-status-vocabulary.md:22`).

### 4. Enforcement point — there is none for filenames, and that is the point

**There is no filename rule left to enforce, so there is no filename enforcement site.** What replaces
it is a **runtime** enforcement point that already exists and stays:

- `drift unresolved-plan-sprint` (`dashboard.sh:905-906`) plus the roll-up's *"drift on the plan
  itself"* clause (`dashboard.sh:917`, `:922-923`) tell the reader, **on the run they just made**,
  that a plan's identity did not resolve — a feedback loop shorter than any document;
- rule 1's `:796` restoration means a mis-shaped backlog board now fails loudly instead of quietly.

**`claude/structure-spec.md` is explicitly NOT the site.** It governs fkit-authored files, and says of
this directory (`claude/structure-spec.md:174-177`) *"Structural directories only — no required files
beyond the placeholders."* A project's plan documents are project content it says nothing about, and
turning it into a content-checker for project files is a different decision with a different blast
radius.

**The residual, stated the way ADR-038 states its own:** the identity grammar is **documented and
detected, never prevented**. Nothing stops a project writing a plan fkit cannot identify; the tool
says so on every run and never guesses.

### 5. Binding implementation constraint — one grammar, one implementation

`dashboard.sh` resolves identity in shell. The active-sprint selection at
`claude/skills/fkit-status/SKILL.md:26` is **prose executed by an LLM**. If that prose re-states the
grammar, this component acquires **two grammars for one question** — the exact defect class its own
comment forbids at `dashboard.sh:111-125`, where three grammars for *"is this the `## Status`
heading?"* produced a false `multiple-status-tables` and a misleading `die`.

**Therefore, binding:** the selection step must obtain each candidate's identity **from
`dashboard.sh`** — e.g. a resolve-identity mode that takes a plan path, prints its identity (or
nothing) and exits — not by re-deriving the grammar in SKILL.md prose. **The exact CLI surface is the
implementer's call; re-implementing the grammar is not.**

This does **not** reopen `ai-agents/knowledge-base/conventions/one-skill-one-output.md` (task 44):
`dashboard.sh` is a helper program, not a skill, and an identity line is not a second rendering of the
briefing.

### 6. Prose sites this ADR falsifies — all seven must be corrected

Each states the glob as the mechanism. After this ADR each is **false as written**, not merely stale.
Producer's act to file; enumerated here so nothing is missed.

| # | Site | What breaks |
|---|---|---|
| 1 | `claude/skills/fkit-status/SKILL.md:26` | the selection rule itself |
| 2 | `claude/skills/fkit-status/SKILL.md:48` | the *"`backlog.md` is deliberately outside that glob"* explanatory block — the **conclusion survives, the mechanism does not** |
| 3 | `claude/skills/fkit-task-brief/SKILL.md:308-312` | the header prose it tells a fresh project to **generate** into a new `backlog.md` — the generator of site 7 |
| 4 | `claude/skills/fkit-task-brief/SKILL.md:334-337` | *"Never file against `backlog.md` by writing a `sprint-backlog.md`"* — **the rule survives** (one board, one file) but its stated reason does not |
| 5 | `claude/skills/fkit-sprint-ship-loop/SKILL.md:47` | *"the active `sprint-*.md`"* |
| 6 | `claude/skills/fkit-sprint-ship-loop/SKILL.md:93` | *"the active `sprint-*.md`"* |
| 7 | `ai-agents/sprints/backlog.md:7-11` | this repo's own live board header, whose bold warning calls the glob *"the whole mechanism"*. ⚠️ Fix **both** the generator (site 3) and this copy — this file is not scaffold, so a `fkit-claude-init` refresh will not touch it |

`claude/skills/fkit-status/dashboard.sh:95` carries the same claim inside the backlog special case's
comment; it is part of ADR-040's patch, listed here for completeness.

## Required tests — the decision is not satisfied without these

These are additional to ADR-040's T1–T11, which this ADR inherits whole.

| ID | Fixture | Assertion |
|---|---|---|
| S1 | `sprints/` holding `plan-sprint-9.md` (`# P — Sprint 9 — a`) and `plan-sprint-10.md` (`# P — Sprint 10 — b`) | active sprint is **`Sprint 10`**. Pins §1.4's integer ordering — the contract that was previously carried in prose and pinned by nothing |
| S2 | `sprints/` holding `plan-sprint-4.md`, `plan-sprint-4b.md`, `plan-sprint-4c.md` | active sprint is **`Sprint 4c`**. Pins the suffix ordering (absent < `a` < `b` < …) |
| S3 | `sprints/` holding `sprint-backlog.md` (`# Geoconflict — Sprint Backlog`) **and** `plan-sprint-6.md` | active sprint is **`Sprint 6`**; `sprint-backlog.md` is **never** selected. The compounded-defect test, half 1 |
| S4 | `sprint-backlog.md` run **by name** | identity `Backlog`; a row whose brief reads `## Sprint: Sprint 2` produces a `drift disagreement` via `dashboard.sh:796`. **The compounded-defect test, half 2 — red today** |
| S5 | `sprints/` holding **only** `backlog.md` | eligible set empty → the run says so and lists candidates with identities; it does **not** select `backlog.md`. Pins §1.3 and §1.6 |
| **S6** | **`sprints/` holding `sprint-6.md` and `plan-sprint-6.md`, both resolving `Sprint 6`** | **`plan-sprint-6.md` is chosen (byte order, `LC_ALL=C`: `p` < `s`), AND a plan-level drift record names both files, AND the roll-up carries the drift clause. ⚠️ Assert all three — the tie-break ruling is worthless if the flag can be dropped** |
| S7 | S6's fixture re-run under a non-C locale (e.g. `LC_ALL=en_US.UTF-8`) | **same** selection. Pins §1.5's locale independence |
| S8 | `sprint-backlog.md` whose H1 is `# Unscheduled work` (neither `Backlog` token) | identity EMPTY, `unresolved-plan-sprint` emitted, **not** eligible as active sprint. Pins §2's stated residual case |

## Options considered

- **(a) Identity-driven selection (chosen — owner-ruled, see §Authority).** Selection and drift
  resolution answer the same question with the same code. It closes both halves of the compounded
  defect, strengthens `backlog.md`'s exclusion instead of relying on it, and turns the previously
  untested "highest N" ordering into a pinned contract on the way past.
- **(a′) Keep the glob as a fallback — identity first, glob when identity is unresolved — rejected by
  name.** This was the explicit alternative put to the owner alongside (a) and rejected on
  2026-08-10. It is superficially safe — nothing that works today would stop working — but it puts
  **two grammars behind one question**, which is the exact defect class
  `claude/skills/fkit-status/dashboard.sh:111-125` documents at length: three grammars for *"is this
  the `## Status` heading?"* produced a false `multiple-status-tables` and a misleading `die`, and
  that comment's closing instruction is not to reintroduce the second answer. A fallback also
  reinstates the reported defect precisely where it hurts — `sprint-backlog.md` with an
  identity-less H1 is exactly the "identity unresolved" case the fallback would catch, and the glob
  would then select it. **The fallback fires only in the situation it gets wrong.**
- **(b) Widen the glob — `*sprint*.md`, or a configured pattern — rejected by name.** It selects
  `sprint-backlog.md` as the active sprint. That **is** the reported defect. Every carefully-tuned
  variant hits the same wall: the discriminator the glob needs (is this board scheduled work?) is not
  in the filename, it is in the identity. ⚠️ Note it does **not** catch our own `backlog.md`, contrary
  to the brief's stated cost — see §Context. Rejected for the file it *does* catch.
- **(c) Name it a convention and enforce it — plans are `sprint-N.md`, the unscheduled board is
  `backlog.md`, stated in `structure-spec.md` / the scaffold / `PROJECT.md` / the launch notice —
  rejected by name.** Three reasons. It contradicts the owner's 2026-08-10 posture. `structure-spec.md`
  is the wrong instrument (it governs fkit-authored files; `claude/structure-spec.md:174-177`
  explicitly claims nothing about plan documents). And the enforcement it buys is **a document** —
  which is what already exists at `ai-agents/sprints/backlog.md:7-11`, and which the reporter read and
  still hit the defect from the other side. Documenting harder is not a new mechanism.
- **(d) Make it explicit rather than inferred — an index file, or a marker inside the plan, naming the
  active board — rejected as primary, retained as the named escape hatch.** Exact and unguessable, and
  it would also settle the "highest N is a heuristic" residual below. Rejected for the same reason as
  ADR-040's option (e): it requires a project to configure something fkit can already read, against
  this project's zero-config posture. Re-raise it if the residual bites.
- **(e) Do nothing — accept that a project naming its plans otherwise gets the wrong board — rejected
  by name.** Argued rather than defaulted past. It leaves a bare `/fkit-status` reporting an
  unscheduled board as the active sprint **with no signal that it did so** — selection emits no
  equivalent of `unresolved-plan-sprint`. Picking the wrong board silently is the same failure class
  ADR-040 refuses at the identity level; refusing it there and accepting it here would be incoherent.

## Consequences

- **Positive:** on the reporter's repo a bare `/fkit-status` selects `plan-sprint-6.md` (`Sprint 6`)
  instead of `sprint-backlog.md`; `sprint-backlog.md` regains the `dashboard.sh:796` highest-value
  drift check when asked for by name; `backlog.md`'s exclusion no longer depends on a naming rule a
  project might normalize away; and the "highest N" ordering — until now prose with no test behind it
  — becomes a written, tested contract (§1.4, test S1).
- **Negative / costs:** seven prose sites to correct (§6), one of which is a *generator* whose output
  already exists in every project that ever filed an unsprinted brief — those copies are project
  content and will **not** be repaired by a launch-convergence refresh. Selection costs one file read
  per candidate instead of a glob. And §5 forces a new interface between `SKILL.md` and
  `dashboard.sh` that did not exist before.
- **Residual — "highest N" is a RETAINED HEURISTIC WITH A NAMED EXIT, not an endorsement.** On the
  reporter's repo the eligible set is `Sprint 4`, `Sprint 4c`, `Sprint 5`, `Sprint 6`, so the active
  sprint resolves to `Sprint 6` — while `plan-sprint-4c.md` ("Production Stabilization", carrying a
  live `## Sprint 4c Status`) may well be what they are actually working. **This ADR does not fix
  that.** It makes the existing heuristic well-defined, applies it to the right candidate set, and
  pins it with test S1.

  **Ruled 2026-08-10 by the architect, not the owner, and flagged to the owner as such:** keep the
  heuristic; record **option (d)** — an explicit active-sprint marker — as a **documented future
  escape hatch**. Nothing currently demands the larger change: no project has reported being
  mis-selected *within* its eligible set, and the reported defect was the eligible set itself, which
  this ADR fixes. Recorded at that strength deliberately — a heuristic kept for want of a reason to
  replace it, with the replacement already named. See *Re-raise only if*.
- **Relationship to ADR-040:** constrained **by** it, does not constrain it. ADR-040 ships alone and
  is useful alone; ADR-041 cannot ship first. §2's `Backlog` token is placed here rather than in
  ADR-040 deliberately — task `0260`'s brief fences the backlog case out of its scope, and this is the
  decision that owns it.
- **Implementation follow-ups are the producer's to file, not this ADR's:** the selector change plus
  the resolve-identity interface (§1, §5), the `Backlog` H1 token (§2), the S1–S8 test set, and the
  seven prose repairs (§6).

## Authority — what was ruled, by whom, when

This ADR is **accepted**. All three open points were resolved on **2026-08-10**; the owner's two were
put via `AskUserQuestion` in a live session, and the option labels below are **verbatim**.

| # | Question | Ruled by | Ruling | Effect on this ADR |
|---|---|---|---|---|
| 1 | The posture applied to **board selection** — a bigger surface than naming, since a mis-selection changes which board the briefing is *about* | **the owner** | **"Accept — selection by identity (Recommended)"** | The whole of §1. The glob is **retired**, not demoted. The explicitly-rejected alternative — *keep the glob as a fallback* — is recorded as option **(a′)**, rejected for two grammars behind one question |
| 2 | The same-identity tie-break (§1.5) — deterministic-and-loud, or refuse to pick? | **the owner** | **"Pick deterministically, flag loudly (Recommended)"** | §1.5, **now stated as a concrete rule** (byte order, `LC_ALL=C`, first) rather than as the adjective "deterministic", and pinned by tests **S6** and **S7** per the ruling's instruction |
| 3 | The "highest N" residual | **the architect**, flagged to the owner as the architect's call | keep the heuristic; record the explicit marker as a documented future escape hatch | §Consequences residual, restated at that strength — retained, not endorsed; pinned by **S1**; exit named in *Re-raise only if* |

The **posture** — *"fkit adapts to the project"* — was ruled the same day and set the direction only.

**Nothing else in this ADR was ruled elsewhere.** The candidate set, the eligibility rule, the
`Backlog` token and its normalization, §4's "no enforcement point", §5's one-grammar constraint,
§6's seven prose sites and the S1–S8 set are the architect's, made under the rulings above.

## Re-raise only if

- a project legitimately runs **two live plans with the same sprint identity** as a standing
  arrangement — §1.5's byte-order pick would then be a design choice, not a defect to report;
- a project legitimately works **two sprints in parallel**, or reports being mis-selected **within**
  its eligible set (the "highest N" residual actually biting) — **this is the named exit: option (d),
  an explicit active-sprint marker.** It is already argued out below in §Options; re-raising it needs
  the triggering case, not a fresh argument;
- `dashboard.sh` stops being the single implementation of the identity grammar, breaking §5;
- ADR-040 is re-raised on its own terms — this ADR's selector inherits every one of its conditions;
- the owner reverses the 2026-08-10 "fkit adapts to the project" posture, which puts option (c) back
  in play.

Anything that re-argues **(b)** from a cleverer glob is closeout: the discriminator is not in the
filename. Anything that re-argues **(a′)** — the glob kept as a fallback — is closeout twice over: it
was put to the owner on 2026-08-10 and rejected, and the fallback fires only in the situation it gets
wrong.

## Number allocation — the four-way sweep, evidenced

Run 2026-08-10, in the same act as ADR-040 (whose §Number allocation records the run in full):
malformed-filename check printed nothing, highest on disk = **39**, and
`grep -rn "ADR-040\|adr-040\|ADR-041\|adr-041"` over `ai-agents/knowledge-base/reports/`,
`ai-agents/sprints/` (incl. `done/` and `backlog.md`), and `ai-agents/wiki-vault/` (read-only,
ADR-005) returned **zero hits in all three**. **Zero claimants; 041 is free and is allocated here.**

## Related

- Source report §8: `ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`
- Task: `ai-agents/tasks/done/0261-decide-whether-the-active-sprint-glob-widens-or-projects-are-told-to-name-plans-sprint-n/brief.md`
- Depends on: `adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md`
- Selection site: `claude/skills/fkit-status/SKILL.md:26`, explanatory block at `:48`
- Backlog identity and its warnings: `claude/skills/fkit-status/dashboard.sh:89-108`, arm at `:772`,
  the highest-value check at `:796`
- Generated header (site 3/7): `claude/skills/fkit-task-brief/SKILL.md:308-312`, `:334-337`
- This repo's live copy (site 7): `ai-agents/sprints/backlog.md:7-11`
- Loop consumers: `claude/skills/fkit-sprint-ship-loop/SKILL.md:47`, `:93`
- Two-grammars precedent: `claude/skills/fkit-status/dashboard.sh:111-125` (`STATUS_HEADING_RE`)
- Not the enforcement site: `claude/structure-spec.md:174-177`
- Cited, not reopened: ADR-005 (wiki writes), ADR-038 (the prose-not-prevention residual shape),
  `conventions/one-skill-one-output.md` (task 44), the 2026-07-18 basename ruling (review R4)
