# ADR-040: A plan's sprint identity is a whole H1 segment, never a substring — and a letter suffix is part of it

- **Status:** accepted
- **Date:** 2026-08-10
- **Deciders:** the architect, under task `0260`
  (`ai-agents/tasks/done/0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md`),
  on the owner's rulings of 2026-08-10 recorded in *§Authority* below.
- **Posture this was designed under:** the owner's ruling of 2026-08-10 — option label verbatim:
  **"fkit adapts to the project"** (*"Real projects name files how they want, and fkit's job is to
  work on them … §6's letter-suffix trap becomes fkit's problem to solve correctly."*). ⚠️ **That
  posture was a direction, not an approval of this grammar** — it pre-approved no pattern. The
  grammar itself was approved separately; see *§Authority*.

## Context

A downstream project (a game, ~50 tasks, fkit `0.2.1`) reported that `PLAN_SPRINT` resolves **empty**
for every sprint-plan naming convention they use. The full statement, both failure directions, and the
twelve real filenames are in
`ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`. This ADR
cites that report; it does not re-derive it.

⚠️ That report's filename is date-last and does not match `reports/README.md`'s `YYYY-MM-DD-<slug>.md`
convention. Kept byte-identical, name included, because it is a foreign artifact we did not author.

**Established evidence** (independently verified against our source 2026-08-10; our `dashboard.sh` is
945 lines / 56121 bytes, byte-identical to the downstream build, so line numbers are comparable):

| Rung | Site | Pattern | Result on real names |
|---|---|---|---|
| H1 | `claude/skills/fkit-status/dashboard.sh:83` | `sed -n 's/^# \(Sprint [0-9][0-9]*\).*/\1/p'` | misses `# Geoconflict — Sprint 4 — …` (must *start* `# Sprint N`) |
| filename | `dashboard.sh:87` | basename `^sprint-\([0-9][0-9]*\)$` | misses `plan-sprint-4` |
| `backlog` | `dashboard.sh:93` | basename exactly `backlog` | **works** — the only rung that fires on their repo |

### The failure is in both directions, and neither is the one the code comments anticipate everywhere

- **Numbered board → over-reporting.** Rule 1's skip at `dashboard.sh:802` is
  `elif [ -n "$PLAN_SPRINT" ] && … ;`. An empty identity makes the guard **false**, so the skip stops
  applying and every legitimately-carried-elsewhere row falls through to rule 3's full cross-check and
  becomes a phantom `drift disagreement`. This is exactly what the comment at `dashboard.sh:78-82`
  predicts.
- **Backlog-shaped board → under-reporting.** The "scheduled but still parked on the unscheduled
  board" check (`dashboard.sh:796`) lives **only** inside the `[ "$PLAN_SPRINT" = "Backlog" ]` arm at
  `dashboard.sh:772`. Rule 3's else branch has no equivalent. A backlog-shaped board whose identity
  does not resolve can never surface what the code's own comment at `dashboard.sh:773-779` calls *"the
  single highest-value drift this board can surface"*.

### ⚠️ The hard constraint — a wrong identity is strictly worse than no identity

State it in these terms; it is the reason this is an architect decision and not a one-line regex
widening.

- **Today (no identity):** rule 1 is inert, the board over-reports, and `drift unresolved-plan-sprint`
  (`dashboard.sh:905-906`) tells the reader why. **A loud failure.**
- **With a *wrong* identity:** rule 1 becomes **live and wrong**. The trace, in full — the reporter's
  repo has `plan-sprint-4b.md` and `plan-sprint-4c.md` as real, distinct sprint identities ("Sprint
  4b", "Sprint 4c"), each with its own plan and its own tasks, **alongside a separate
  `plan-sprint-4.md`**. A numeric-only widening resolves `plan-sprint-4c.md` → `Sprint 4`. Every
  Sprint 4c brief then reads `## Sprint: Sprint 4c` ≠ `Sprint 4`, so rule 1's guard at
  `dashboard.sh:802` is **true** on every row, the status cross-check is **skipped on the entire
  board**, and nothing is reported. **A silent failure — and no warning fires, because the identity
  did resolve.**

**The requirement this yields, non-negotiable:** whatever pattern lands must **either handle the
letter suffix or refuse the file and report `unresolved-plan-sprint`**. There is no third option in
which it guesses.

**A second shape disqualifies the other obvious widening.** `hotfix-post-sprint2.md`, H1
`# Geoconflict — Post-Sprint 2 Hotfix Tasks`, is a real plan deliberately **not** Sprint 2. Any *"find
`Sprint <N>` anywhere in the H1"* matcher claims it. **Prose containment is not identity.**

### The reporting path is intact and stays intact

`drift unresolved-plan-sprint` is emitted at `dashboard.sh:905-906`; `dashboard.sh:917` sets
`plan_level_drift` so it reaches the roll-up's drift clause (`dashboard.sh:922-923`);
`fkit-status/SKILL.md` instructs the reader to say *"any drift below may be phantom"*. **Nothing here
is broken and nothing here is redesigned by this ADR.**

### Why the suite did not catch this

`test/dashboard-contract.test.js:641` — *"R8: a prose H1 falls back to the filename"* — uses a fixture
named `sprint-1.md`. It proves the fallback works **when the filename already matches the fallback's
own pattern**. The suite is green for a fixture-shaped reason. Task `0259` turns the report into a
failing test; this ADR decides what makes it pass.

## Decision

**A plan's sprint identity is a complete, delimiter-bounded segment of its H1 title, or its filename
stem — never a substring of either. A letter suffix is part of the identity, not decoration. Anything
that is not exactly an identity token is refused and reported.**

### 1. The identity token — one grammar, used everywhere

```
SPRINT_ID  :=  "Sprint " DIGITS SUFFIX?
DIGITS     :=  [0-9]+          one or more decimal digits
SUFFIX     :=  [a-z]           EXACTLY ONE lowercase ASCII letter, or absent
```

Case-sensitive (`Sprint`, capital S). Exactly one ASCII space between `Sprint` and the digits — no
tab, no hyphen, no underscore, no double space. The **value** of `PLAN_SPRINT` is the token verbatim:
`Sprint 4`, `Sprint 4c`.

**Why the suffix is capped at one letter.** Real sprint suffixes observed in the field are single
letters (`4b`, `4c`). An unbounded `[a-z]*` would accept `Sprint 4th` and `Sprint 4cabbage` as
identities — resolving a *wrong* identity that no brief will ever match, which puts rule 1 into the
silent whole-board skip described above. One letter is the tightest rule that covers all observed
data; everything wider refuses loudly.

### 2. Rung 1 — the H1 **segment** rule (replaces `dashboard.sh:83`)

1. Read the plan's **first line**. It must begin with `# `. Strip that prefix; call the rest the
   **title**.
2. Split the title into **segments** on any of these delimiters:
   - em dash `—` (U+2014)
   - en dash `–` (U+2013)
   - colon `:`
   - hyphen-minus **surrounded by spaces**, ` - `
   ⚠️ **A bare hyphen with no surrounding space is NOT a delimiter.** That is precisely what keeps
   `Post-Sprint` a single word.
3. Trim leading and trailing whitespace from each segment.
4. A segment **is** an identity iff the **whole trimmed segment** matches the token anchored at both
   ends: `^Sprint [0-9][0-9]*[a-z]\{0,1\}$`.
5. Collect the **distinct** identity values found across all segments:
   - **exactly one** → that is `PLAN_SPRINT`;
   - **zero** → rung 1 yields nothing; fall through to rung 2;
   - **two or more distinct** → rung 1 yields nothing — **refuse, do not guess** — and fall through to
     rung 2.

### 3. Rung 2 — the filename fallback (replaces `dashboard.sh:87`)

Basename with `.md` stripped, matched **whole**:

```
^\(plan-\)\{0,1\}sprint-\([0-9][0-9]*[a-z]\{0,1\}\)$   →   "Sprint \2"
```

**The prefix allowlist is closed and has exactly one entry, `plan-`.** Any other prefix refuses. This
is deliberate: an open prefix rule (`.*sprint-<N>`) would claim a hypothetical
`hotfix-post-sprint-2.md` — the filename analogue of the prose-containment trap. The reporter's actual
file is `hotfix-post-sprint2.md` (no hyphen before the digit), so an open rule would have been safe by
luck; a closed allowlist is safe by construction.

> ### ⚠️ THIS RUNG IS UNEVIDENCED BY ANY OBSERVED FILE — a deliberate forward bet, recorded as such
>
> **No §7 row exercises it.** All twelve of the reporter's `plan-sprint-*.md` files carry a
> Sprint-bearing H1 and therefore resolve at **rung 1**; rung 2 never fires on any of them. Removing
> the `plan-` prefix entirely would change **none** of the twelve outcomes.
>
> It is here as forward cover for a `plan-sprint-4.md` whose H1 is *pure prose* — the exact shape
> rung 2 exists for, and the exact shape test R8's `sprint-1.md` fixture failed to cover
> (`test/dashboard-contract.test.js:641`).
>
> **Owner-ruled 2026-08-10, option label verbatim "Include `plan-` (Recommended)"** — accepted as
> forward cover with no §7 row behind it, on the grounds that the downstream repo demonstrably uses
> that filename convention and the closed allowlist bounds the risk. **A later reader should know
> this was a bet, not a requirement.**
>
> ⚠️ **Consequence the ruling implies and did not state: an unevidenced rung that no test exercises
> can ship broken and stay broken.** Tests **T10** and **T11** below are therefore mandatory — they
> are the only thing that makes this rung real.

### 4. Rung 3 — the `backlog` special case (`dashboard.sh:93`) — **UNCHANGED**

Basename exactly `backlog` → `Backlog`. Basename, **not** a full path (owner-ruled 2026-07-18, review
R4). The reasoning at `dashboard.sh:89-108` stands verbatim and is not touched by this ADR. ADR-041
adds a `Backlog` token to rung 1; that is a rung **above** this one and does not alter it.

### 5. Refusal conditions — enumerated, so an implementer need not infer them

`PLAN_SPRINT` is left **empty** (and therefore reported) when:

- the first line does not begin with `# `;
- no whole segment matches the token;
- **two or more distinct** identity tokens appear as segments, and rung 2 does not resolve either;
- a `Sprint <N>` appears **inside** a segment alongside other words — `Post-Sprint 2 Hotfix Tasks`,
  `Sprint Backlog`, `Sprint 4 carryover`, `Execution Plan Index`. **Prose containment is never
  identity**;
- the suffix is two or more letters (`Sprint 4th`), or uppercase (`Sprint 4C`);
- the prefix is cased differently (`sprint 4`, `SPRINT 4`) or separated differently (`Sprint-4`,
  `Sprint_4`);
- the filename stem carries any prefix other than `plan-`.

### 6. Binding companion — the `➡️ Moved` target matcher moves in step

`dashboard.sh:692` parses a move target with `(Sprint [0-9]+|Backlog)` and **has no suffix**. It must
take the same suffix: `\(Sprint [0-9][0-9]*[a-z]\{0,1\}\|Backlog\)`.

**Why this is binding and not a nicety.** Without it, `➡️ Moved to [Sprint 4c](plan-sprint-4c.md) —
priority 3` parses `moved_target="Sprint 4"`, and rule 2 at `dashboard.sh:767` compares it against a
brief reading `## Sprint: Sprint 4c` → **a phantom `drift disagreement` on every moved row**. Making
`Sprint 4c` a first-class plan identity without making it a first-class *move target* creates a new
drift source with the same fix. **One vocabulary, one grammar.**

`moved_target` is **not** a `PLAN_SPRINT` consumer — it is an independent parser of the same sprint
vocabulary. It is listed here because the decision binds it, not because it is a fourth consumer.

### 7. The regression guard — a binding clause of this decision

> **A genuinely unidentifiable plan MUST still report `unresolved-plan-sprint`. The fix must not
> convert a loud failure into a quiet one.**

An implementation that drops this guard **does not satisfy this decision**, regardless of how well it
resolves the twelve rows. It is required as a **test**, named below, not as an intention.

## Effect on all three `PLAN_SPRINT` consumers

The three consumers are pinned by test R7 (`test/dashboard-contract.test.js:1713`), which asserts each
one by name.

| # | Consumer | Site | Effect of this decision |
|---|---|---|---|
| 1 | drift rule 1 — the skip guard, **and** the `= "Backlog"` arm above it | `dashboard.sh:802` (skip); `dashboard.sh:772` (Backlog arm) | Goes **live** on plans that previously resolved empty. On a numbered board, phantom `drift disagreement` on legitimately-carried-elsewhere rows **stops**. `Sprint 4c` compares as its own string, so a `Sprint 4` brief sitting on the 4c board correctly takes the skip and a `Sprint 4c` brief correctly gets the full rule-3 cross-check. The `= "Backlog"` arm is **untouched by this ADR** — no new file reaches it, because the only rung producing `Backlog` is `dashboard.sh:93`, unchanged. |
| 2 | the `drift unresolved-plan-sprint` fact | `dashboard.sh:905-906` | Fires on strictly **fewer** files. Its wording, its `h1="…"` payload and its position are unchanged. **It must still fire on every refusal in §5** — that is the §7 guard. |
| 3 | the roll-up's plan-level drift clause | `dashboard.sh:917` (`[ -z "$PLAN_SPRINT" ] && plan_level_drift=1`), rendered at `dashboard.sh:922-923` | Follows consumer 2 exactly, by construction — same reduction, same guard. A refusal must still produce *"drift on the plan itself"* in the roll-up. |
| — | *(not a consumer; same vocabulary)* `moved_target` | `dashboard.sh:692`, consumed by rule 2 at `dashboard.sh:767` | Must take the suffix in step — §6. Binding. |

## Validation against all twelve §7 rows

Every plan document in the reporting project, verbatim, resolved under the grammar above.

| # | Filename | H1 | This rule resolves | Correct? |
|---|---|---|---|---|
| 1 | `plan-index.md` | `# Geoconflict — Execution Plan Index` | **EMPTY** → `unresolved-plan-sprint` | ✅ required empty — no segment is an identity token |
| 2 | `plan-sprint-4.md` | `# Geoconflict — Sprint 4 — In-App Monetization & Citizenship` | `Sprint 4` (rung 1, segment 2) | ✅ |
| 3 | `plan-sprint-4c.md` | `# Geoconflict — Sprint 4c — Production Stabilization` | `Sprint 4c` (rung 1) — **distinct from `Sprint 4`** | ✅ the §6 trap, handled |
| 4 | `plan-sprint-5.md` | `# Geoconflict — Sprint 5 — Full F2P Loop & Social Features` | `Sprint 5` (rung 1) | ✅ |
| 5 | `plan-sprint-6.md` | `# Geoconflict — Sprint 6 — More Content` | `Sprint 6` (rung 1) | ✅ |
| 6 | `sprint-backlog.md` | `# Geoconflict — Sprint Backlog` | **EMPTY** under ADR-040 — `Sprint Backlog` is not a `Sprint <N>` token; stem `sprint-backlog` fails rung 2; basename ≠ `backlog` | ⚠️ correct *for this ADR*, and **wrong as an end state** — **ADR-041 rules on this file** and resolves it to `Backlog` |
| 7 | `backlog.md` | `# Backlog — the default home for unsprinted task briefs` | `Backlog` (rung 3, unchanged) | ✅ unchanged |
| 8 | `done/plan-sprint-1.md` | `# Geoconflict — Sprint 1 — Stop the Bleeding` | `Sprint 1` (rung 1) | ✅ |
| 9 | `done/plan-sprint-2.md` | `# Geoconflict — Sprint 2 — Fix Onboarding` | `Sprint 2` (rung 1) | ✅ |
| 10 | `done/plan-sprint-3.md` | `# Geoconflict — Sprint 3 — Deepen Retention (Data-Driven)` | `Sprint 3` (rung 1) | ✅ |
| 11 | `done/plan-sprint-4b.md` | `# Geoconflict — Sprint 4b — Interim Game Variety Update` | `Sprint 4b` (rung 1) — distinct from `Sprint 4` **and** from `Sprint 4c` | ✅ |
| 12 | `done/hotfix-post-sprint2.md` | `# Geoconflict — Post-Sprint 2 Hotfix Tasks` | **EMPTY** → `unresolved-plan-sprint`. Segments are `Geoconflict` and `Post-Sprint 2 Hotfix Tasks`; the second is not *exactly* `Sprint 2`. Stem `hotfix-post-sprint2` carries a disallowed prefix **and** lacks the hyphen before the digit | ✅ required empty — prose containment refused |

**Score: 12/12 as specified.** Rows 1 and 12 resolve empty **by design** and each emits
`unresolved-plan-sprint` — the loud failure preserved. Row 6 is deferred to ADR-041 by name.

**Sanity check against this repo's own plans** (measured 2026-08-10): `# Sprint 5 — Fix what a real
project found…`, `# Sprint 1 — Ship the onboarding sequence`, `# Sprint 2 — …`, `# Sprint 3 — …`,
`# Sprint 4 — …` all resolve at rung 1 segment 1; `# Backlog — the default home…` resolves at rung 3.
**No regression on our own repo.**

## Required tests — the decision is not satisfied without these

`T5` is the §7 regression guard. `T1` is task `0259`'s red fixture. `T10`/`T11` are what make §3's
unevidenced rung real.

| ID | Fixture | Assertion |
|---|---|---|
| T1 | `plan-sprint-4.md`, H1 `# Geoconflict — Sprint 4 — In-App Monetization & Citizenship`, brief `## Sprint: Sprint 9` | identity `Sprint 4`; rule 1 skips → **zero** `drift disagreement` |
| T2 | `plan-sprint-4c.md`, H1 `# … — Sprint 4c — …` | identity is `Sprint 4c`, **not** `Sprint 4`; a brief reading `Sprint 4` takes rule 1's skip; a brief reading `Sprint 4c` gets the full rule-3 cross-check and its real status drift **is** reported |
| T3 | `hotfix-post-sprint2.md`, H1 `# Geoconflict — Post-Sprint 2 Hotfix Tasks` | identity EMPTY **and** `unresolved-plan-sprint` emitted **and** the roll-up reads *"on the plan itself"* — assert **all three consumers**, per R7's precedent |
| T4 | `plan-index.md`, H1 `# Geoconflict — Execution Plan Index` | identity EMPTY + reported |
| **T5** | **the existing `hardening.md` fixture (`test/dashboard-contract.test.js:654`, and the task-68 twin)** | **`unresolved-plan-sprint` still emitted; roll-up still reads *"on the plan itself"*. ⚠️ THE §7 REGRESSION GUARD — an implementation that loses this does not satisfy ADR-040.** |
| T6 | H1 `# Sprint 5 — Sprint 6` on file `sprint-5.md`; then the same H1 on file `hardening.md` | ambiguity refuses at rung 1 → first case resolves `Sprint 5` from the filename; second case EMPTY + reported |
| T7 | H1 `# Foo — Sprint 4th — bar` on file `hardening.md` | EMPTY + reported — the one-letter suffix bound |
| T8 | `backlog.md`, existing R7 fixture at `test/dashboard-contract.test.js:1713` | **stays green byte-unchanged**: identity `Backlog`, no `unresolved-plan-sprint`, no drift clause |
| T9 | a plan row `➡️ Moved to [Sprint 4c](plan-sprint-4c.md) — priority 3` whose brief reads `## Sprint: Sprint 4c` | **no** `drift disagreement`. Red before §6's companion change |
| **T10** | **`plan-sprint-7.md` with a genuinely prose H1 (`# Hardening push`)** | **identity `Sprint 7` — the ONLY test that exercises rung 2's `plan-` prefix at all (§3 is unevidenced by any §7 row). Without it the rung ships untested.** |
| **T11** | **`hotfix-post-sprint-2.md` — note the hyphen before the digit — with a prose H1** | **identity EMPTY + reported. Pins the closed allowlist: an open `.*sprint-<N>` rule would claim this file, and the reporter's real `hotfix-post-sprint2.md` (no hyphen) would have hidden that by luck** |

## Options considered

- **(a) Segment-exact H1 + closed-prefix filename + one-letter suffix (chosen).** It is the only
  candidate that resolves rows 2–5 and 8–11 **and** refuses rows 1 and 12 **and** keeps `4b`/`4c`
  distinct from `4`. It buys the "fkit adapts" posture without buying the guessing the posture's own
  cost line warns about.
- **(b) Widen the H1 rung to "find `Sprint <N>` anywhere in the line" — rejected.** It claims
  `hotfix-post-sprint2.md` (row 12), a plan deliberately not Sprint 2, and hands rule 1 a **wrong**
  identity — the silent whole-board skip. Prose containment is not identity. Rejected by name, on the
  reporter's own counter-example.
- **(c) Numeric-only widening (`[0-9][0-9]*`, no suffix) on both rungs — rejected.** It resolves
  `plan-sprint-4c.md` → `Sprint 4`. This is report §6's trap exactly: it converts today's loud failure
  into a silent one on the 4b and 4c boards, which are real boards with real tasks. Rejected by name.
- **(d) Refuse and report — leave the matchers narrow, document that plans must be `sprint-N.md` or
  open their H1 with `# Sprint N` — rejected.** Argued out rather than defaulted past: it is a
  *legitimate* outcome, and it has one genuine advantage — zero new grammar, zero new failure mode.
  It loses on two counts. First, it contradicts the owner's 2026-08-10 posture. Second, and
  independently of posture, **"loud failure" is a floor, not an acceptable steady state**: a numbered
  board that never resolves leaves rule 1 permanently inert, so the project reads phantom
  `drift disagreement` on carried-elsewhere rows **on every run, forever**, with a warning that
  explains the noise but does not remove it. Had it been chosen, the downstream expectation would have
  been: rename plans to `sprint-<N>.md` and the unscheduled board to `backlog.md`, and ADR-041 would
  have become the load-bearing decision rather than the adjacent one.
- **(e) An explicit marker in the plan** (an HTML comment, or a `## Sprint` field in the plan document
  itself) — **rejected as the primary mechanism, retained as the named escape hatch.** It is exact and
  unguessable, but it requires a project to annotate a document fkit can already read, which is a
  configuration step this project's zero-config posture does not take by default. It is the right
  answer *if* (a) proves insufficient — see *Re-raise only if*.
- **(f) Any combination** — e.g. widen the H1 rung and leave the filename rung alone. Considered and
  **partially adopted**: the H1 rung does all the work on the reporter's twelve rows, and the filename
  widening (§3) is explicitly forward cover, flagged as such rather than justified by evidence it does
  not have.

## Accepted tradeoff — adaptation is bounded, and the boundary is stated

This grammar adapts to **where the identity sits** (any title segment, any of two filename prefixes),
not to **how it is worded**. `# Sprint four`, `# The fourth sprint`, `# Q3 planning`, and
`# Post-Sprint 2 Hotfix Tasks` are refused and stay refused. Two of the twelve rows must stay refused
for correctness; a third (`sprint-backlog.md`) is ADR-041's.

**Where the evidence pushes back on the owner's posture.** "fkit adapts to the project" is satisfiable
for naming, not for paraphrase — there is no safe rule that reads intent out of a prose title, and the
report's own `hotfix-post-sprint2.md` proves it by counter-example. So the posture holds, **bounded**:
fkit adapts to any plan that names its sprint identity as a whole title segment or as its filename
stem, and refuses — loudly — everything else. If the owner wants adaptation beyond that boundary, the
answer is option (e), not a looser regex.

## Consequences

- **Positive:** rule 1 becomes live and correct on the eight §7 rows that carry a real numbered
  identity; phantom `drift disagreement` on those boards stops; `Sprint 4b` and `Sprint 4c` become
  first-class identities rather than aliases of `Sprint 4`.
- **The twelve-row table is a release gate, not a nice-to-have.** The owner ruled 2026-08-10 — option
  label verbatim **"Yes — before the release cut"** — that the landed pattern is tested against the
  downstream project's twelve real filenames, `plan-sprint-4b.md`, `plan-sprint-4c.md`,
  `hotfix-post-sprint2.md` and `sprint-backlog.md` named specifically, **before the cut**. That
  ruling predates this ADR and is recorded on the Sprint 5 board
  (`ai-agents/sprints/sprint-5.md:156`, `:193-199`) and in `0260`'s brief; it is **cited here, not
  re-decided**. The table above is the pass/fail sheet for it.
- **Negative / costs:** the H1 matcher stops being a one-line `sed` — segment splitting on four
  delimiters plus a distinct-match count is more code in a file whose comments (`dashboard.sh:111-125`)
  document what happens when one question acquires two grammars. **Mitigation, binding: exactly one
  implementation of this grammar in `dashboard.sh`, reused by every rung and by ADR-041's selector.**
- **Negative / costs:** three test fixtures (`plan-sprint-4c`, `hotfix-post-sprint2`, `plan-index`)
  and one existing test (R8 at `test/dashboard-contract.test.js:641`) now encode a foreign project's
  naming. That is intended — it is the only real-world naming sample fkit has.
- **Interaction with ADR-041:** ADR-040 **is not constrained by** ADR-041 and can ship alone. ADR-041
  **is constrained by** ADR-040 and cannot ship before it — its selector is a function of this grammar.
  Row 6 of the twelve is deferred to ADR-041 by name.
- **Implementation follow-ups are the producer's to file, not this ADR's:** the `dashboard.sh` patch
  (rungs 1–2, §6's `moved_target` companion), the T1–T11 test set beyond `0259`'s fixture, and a gloss
  in `ai-agents/knowledge-base/conventions/task-status-vocabulary.md:21` where the `➡️ Moved to
  [Sprint N]` row's `N` must be read as *the sprint identity* (`4`, or `4c`), not *a number*.

## Authority — what was ruled, by whom, when

This ADR is **accepted**. Both open points were put to the owner and ruled on **2026-08-10**, via
`AskUserQuestion` in a live session; option labels below are **verbatim**.

| # | Question | Ruling (verbatim label) | Effect on this ADR |
|---|---|---|---|
| 1 | The suffix bound (§1) — one letter, or wider? | **"One letter (Recommended)"** | §1 stands as written. Owner-visible reasoning as presented: widening later is cheap, narrowing after downstream projects rely on it is not; an unbounded `[a-z]*` accepts `Sprint 4th`, a **wrong** identity, which silently skips the whole board. |
| 2 | The closed `plan-` filename prefix (§3) — include it, or ship no filename widening? | **"Include `plan-` (Recommended)"** | §3 stands, **and is now marked in the ADR as unevidenced by any observed file** — a deliberate forward bet, per the ruling's own instruction. T10/T11 added as its guard. |

The **posture** these were decided under — *"fkit adapts to the project"* — was ruled the same day
and is recorded in the header. It set the direction; it approved no pattern. The **release gate**
(*"Yes — before the release cut"*) was ruled 2026-08-10 **before** this ADR was written and is cited
in §Consequences, not re-decided here.

**Nothing else in this ADR was owner-ruled.** The grammar's internals — the four H1 delimiters, the
whole-segment rule, the two-or-more-distinct refusal, §6's `moved_target` companion, and the T1–T11
set — are the architect's, made under the ruled posture and the ruled bounds.

## Re-raise only if

- a real project is found using a sprint identity with a **two-or-more-letter** suffix, a different
  case (`SPRINT 4`, `Sprint 4C`), or a different separator (`Sprint-4`, `Sprint_4`) — the token
  grammar would need widening and option **(e)** becomes the cheaper answer than another regex round;
- a real project is found whose H1 separator is none of `—`, `–`, `:`, ` - ` (e.g. `# Product | Sprint
  4 | theme`);
- the `➡️ Moved` marker vocabulary changes such that a move target is no longer a sprint-identity
  string, breaking §6's "one vocabulary, one grammar" premise;
- `PLAN_SPRINT` gains a **fourth** consumer whose semantics are not "compare against a brief's
  `## Sprint`" — the three-consumer analysis above would no longer be complete;
- the owner reverses the 2026-08-10 "fkit adapts to the project" posture, which would put option (d)
  back in play.

Anything that re-argues **(b)** or **(c)** from "it would be simpler" is closeout, not a new finding —
both are rejected on a named counter-example, not on taste.

## Number allocation — the four-way sweep, evidenced

Run 2026-08-10 before allocation (ADR-029 precedent — a number was once claimed everywhere *except*
`decisions/`):

1. Malformed-filename check (`/fkit-record-decision` step 2A) → **printed nothing**; highest number on
   disk by the numeric extraction = **39**.
2. `grep -rn "ADR-040\|adr-040\|ADR-041\|adr-041" ai-agents/knowledge-base/reports/` → **no hits**.
3. Same grep over `ai-agents/sprints/` (incl. `done/`, `backlog.md`) → **no hits**.
4. Same grep over `ai-agents/wiki-vault/` (read-only, ADR-005) → **no hits**.

**Classification: zero claimants of any kind. 040 is free and is allocated here; 041 is allocated to
the companion ADR in the same act.**

## Related

- Source report: `ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`
  (§3 failure directions, §5 the fixture-shaped green suite, §6 the letter-suffix trap, §7 the twelve
  rows)
- Task: `ai-agents/tasks/done/0260-decide-the-plan-sprint-resolution-strategy-under-the-letter-suffix-constraint/brief.md`
- Companion decision: `adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md`
- Red fixture task: `ai-agents/tasks/backlog/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/brief.md`
- Resolution ladder: `claude/skills/fkit-status/dashboard.sh:78-109`
- Drift rules: `claude/skills/fkit-status/dashboard.sh:772` (Backlog arm), `:796` (the highest-value
  backlog check), `:802` (rule 1 skip), `:805-814` (rule 3)
- Reporting path (unchanged): `claude/skills/fkit-status/dashboard.sh:905-906`, `:917`, `:922-923`
- Move-target parser (binding companion): `claude/skills/fkit-status/dashboard.sh:692`, consumed at
  `:767`
- Tests: `test/dashboard-contract.test.js:641` (R8, fixture-shaped), `:654` (the regression guard),
  `:1713` (R7, the three consumers), `:1802` (rule 1 on a numbered board)
- Vocabulary: `ai-agents/knowledge-base/conventions/task-status-vocabulary.md:21-22`
- Precedent for a stated prose-not-prevention residual: ADR-038
