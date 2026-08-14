# ADR-040: A plan's sprint identity is a whole H1 segment, never a substring — and a letter suffix is part of it

**Date**: 2026-08-10
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring.md`
**Decided by**: the architect, under task `0260`, on the owner's rulings of 2026-08-10
**Implemented by**: task `0264` — verified landed in `claude/skills/fkit-status/dashboard.sh`

## Context

**The first defect a real downstream project ever reported in shipped fkit code.** A game project,
~50 tasks, running fkit `0.2.1`, found that `PLAN_SPRINT` resolves **empty** for every sprint-plan
naming convention they use. Their report is copied into the repo verbatim at
`ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`.

Three resolution rungs existed, and only the third fired on their repo:

| Rung | Pattern (before) | Result on their names |
|---|---|---|
| H1 | must *start* `# Sprint N` | misses `# Geoconflict — Sprint 4 — …` |
| filename | basename exactly `sprint-<N>` | misses `plan-sprint-4` |
| `backlog` | basename exactly `backlog` | **works** — the only one that fired |

**The failure runs in both directions**, and the second is the worse one:

- **Numbered board → over-reporting.** An empty identity makes drift rule 1's skip guard false, so
  every legitimately-carried-elsewhere row falls through to the full cross-check and becomes a
  phantom `drift disagreement`.
- **Backlog-shaped board → under-reporting.** The *"scheduled but still parked on the unscheduled
  board"* check lives **only** inside the `PLAN_SPRINT = "Backlog"` arm. A backlog-shaped board whose
  identity does not resolve can never surface what the code's own comment calls *"the single
  highest-value drift this board can surface."*

### ⚠️ The hard constraint — a wrong identity is strictly worse than no identity

This is the sentence the whole decision turns on, and it is why this was an architect call rather
than a one-line regex widening.

- **Today (no identity):** rule 1 is inert, the board over-reports, and `drift
  unresolved-plan-sprint` tells the reader why. **A loud failure.**
- **With a *wrong* identity:** the reporter's repo has `plan-sprint-4b.md` and `plan-sprint-4c.md`
  as real, distinct sprint identities *alongside* a separate `plan-sprint-4.md`. A numeric-only
  widening resolves `plan-sprint-4c.md` → `Sprint 4`. Every Sprint 4c brief then disagrees, rule 1's
  guard becomes **true on every row**, the status cross-check is **skipped on the entire board**, and
  nothing is reported. **A silent failure — and no warning fires, because the identity did resolve.**

**A second shape disqualifies the other obvious widening.** `hotfix-post-sprint2.md`, H1
`# Geoconflict — Post-Sprint 2 Hotfix Tasks`, is a real plan deliberately **not** Sprint 2. Any
*"find `Sprint <N>` anywhere in the H1"* matcher claims it. ***Prose containment is not identity.***

### Why the suite did not catch it

Test R8 — *"a prose H1 falls back to the filename"* — used a fixture named `sprint-1.md`. It proved
the fallback works **when the filename already matches the fallback's own pattern**. The suite was
green for a fixture-shaped reason.

## Decision

**A plan's sprint identity is a complete, delimiter-bounded segment of its H1 title, or its filename
stem — never a substring of either. A letter suffix is part of the identity, not decoration. Anything
that is not exactly an identity token is refused and reported.**

### 1. The identity token — one grammar, used everywhere

```
SPRINT_ID  :=  "Sprint " DIGITS SUFFIX?
DIGITS     :=  [0-9]+
SUFFIX     :=  [a-z]      EXACTLY ONE lowercase ASCII letter, or absent
```

Case-sensitive, exactly one ASCII space. `PLAN_SPRINT`'s value is the token verbatim: `Sprint 4`,
`Sprint 4c`.

**Why one letter, not `[a-z]*`.** An unbounded suffix accepts `Sprint 4th` and `Sprint 4cabbage` as
identities — a *wrong* identity no brief will ever match, which is the silent whole-board skip above.
One letter is the tightest rule covering all observed data; everything wider refuses loudly.

### 2. Rung 1 — the H1 **segment** rule

Split the H1 title on em dash `—`, en dash `–`, colon `:`, or a hyphen **surrounded by spaces** ` - `.
⚠️ **A bare hyphen is NOT a delimiter** — that is precisely what keeps `Post-Sprint` a single word.
A segment **is** an identity only if the **whole trimmed segment** matches the token anchored at both
ends. Then: exactly one distinct value → that is the identity; zero → fall through; **two or more
distinct → refuse, do not guess** — fall through.

### 3. Rung 2 — the filename fallback, on a **closed** prefix allowlist

`^\(plan-\)\{0,1\}sprint-\([0-9][0-9]*[a-z]\{0,1\}\)$`. **The allowlist has exactly one entry,
`plan-`.** An open `.*sprint-<N>` rule would claim a hypothetical `hotfix-post-sprint-2.md` — the
filename analogue of the prose-containment trap. A closed allowlist is safe by construction rather
than by luck.

> ⚠️ **THIS RUNG IS UNEVIDENCED BY ANY OBSERVED FILE — a deliberate forward bet, recorded as such.**
> All twelve of the reporter's `plan-sprint-*.md` files carry a Sprint-bearing H1 and resolve at rung
> 1; rung 2 never fires on any of them. Removing the `plan-` prefix entirely would change **none** of
> the twelve outcomes. Owner-ruled in 2026-08-10, option label verbatim **"Include `plan-`
> (Recommended)"**, accepted as forward cover with no evidence row behind it. **A later reader should
> know this was a bet, not a requirement** — which is why tests T10/T11 are mandatory: an unevidenced
> rung that no test exercises can ship broken and stay broken.

### 4. Rung 3 — the `backlog` basename special case — **UNCHANGED**

Basename exactly `backlog` → `Backlog`. The 2026-07-18 basename-not-full-path ruling is not reopened.
[[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] adds a
`Backlog` token at rung 1, which is *above* this one and does not alter it.

### 5. Refusal is enumerated, not inferred

`PLAN_SPRINT` is left empty (and therefore reported) when the first line is not an H1; no whole
segment matches; two or more distinct tokens appear; a `Sprint <N>` appears **inside** a segment
alongside other words (`Post-Sprint 2 Hotfix Tasks`, `Sprint Backlog`, `Sprint 4 carryover`); the
suffix is two-or-more letters or uppercase; the prefix is cased or separated differently; or the
filename stem carries any prefix other than `plan-`.

### 6. Binding companion — the `➡️ Moved` target matcher moves in step

The move-target parser had no suffix. Without the same change, `➡️ Moved to [Sprint 4c]` parses as
`Sprint 4` and fires **a phantom `drift disagreement` on every moved row**. Making `Sprint 4c` a
first-class plan identity without making it a first-class *move target* creates a new drift source
with the same fix. **One vocabulary, one grammar** — and ADR-040 binds it to ship in the same change,
not as a follow-up.

### 7. The regression guard — a binding clause, not an intention

> **A genuinely unidentifiable plan MUST still report `unresolved-plan-sprint`. The fix must not
> convert a loud failure into a quiet one.**

An implementation that drops this **does not satisfy the decision**, however well it resolves the
twelve rows. Required as test **T5**.

## Consequences

- **Validated 12/12** against every plan document in the reporting project. Rows 1 and 12
  (`plan-index.md`, `hotfix-post-sprint2.md`) resolve **empty by design** and each emits
  `unresolved-plan-sprint`. Row 6 (`sprint-backlog.md`) is deferred to ADR-041 **by name**.
- **No regression on this repo's own plans** — all resolve at rung 1 segment 1, `backlog.md` at rung 3.
- **The twelve-row table is a release gate, not a nice-to-have** — owner-ruled 2026-08-10, verbatim
  **"Yes — before the release cut"**.
- **Accepted cost:** the H1 matcher stops being a one-line `sed`. **Binding mitigation: exactly one
  implementation of this grammar, reused by every rung and by ADR-041's selector.**
- **Adaptation is bounded, and the boundary is stated.** The grammar adapts to *where* the identity
  sits, not to *how it is worded*. `# Sprint four`, `# The fourth sprint`, `# Q3 planning` are refused
  and stay refused. Where the owner wants adaptation beyond that, the answer is an explicit marker in
  the plan (option (e)), **not a looser regex**.
- **Ships alone.** ADR-040 is not constrained by ADR-041; ADR-041 cannot ship before it.

## Rejected, by name and on counter-examples rather than taste

- **(b) "find `Sprint <N>` anywhere in the H1"** — claims `hotfix-post-sprint2.md`, a plan
  deliberately not Sprint 2, and hands rule 1 a wrong identity.
- **(c) numeric-only widening, no suffix** — resolves `plan-sprint-4c.md` → `Sprint 4`, converting
  today's loud failure into a silent one on two real boards.
- **(d) refuse and report — tell projects to rename their plans.** Argued out rather than defaulted
  past, and it has a genuine advantage (zero new grammar). It loses on the owner's *"fkit adapts to
  the project"* posture **and, independently, because "loud failure" is a floor, not an acceptable
  steady state** — the project would read phantom drift on every run, forever.
- **(e) an explicit marker in the plan** — **rejected as primary, retained as the named escape hatch**
  if (a) proves insufficient.

⚠️ Anything re-arguing (b) or (c) *"because it would be simpler"* is closeout, not a new finding.

## Landed state — verified on disk 2026-08-13

`claude/skills/fkit-status/dashboard.sh` carries `SPRINT_ID_RE`, `plan_sprint_from_h1()` (the segment
rule), `plan_sprint_from_stem()`, `resolve_identity()`, and the `moved_target` parser now built on
the **same** `SPRINT_ID_RE` — the one-grammar mitigation honored, not merely intended. The H1 splitter
was implemented in `awk` rather than `sed`, on a recorded portability finding (a `sed` split silently
produces one un-split segment on macOS and works on Linux CI).

## Related
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — the companion; its selector is a function of this grammar
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — precedent for a stated prose-not-prevention residual
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board this shipped on
- [[systems/fkit]]
- **Its task chain:** [[tasks/decide-the-plan-sprint-resolution-strategy]] (`0260`, the decision) · [[tasks/add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename]] (`0259`, test T1 — ⚠️ **shipped `npm test` RED on purpose**) · [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]] (`0264`, both rungs **and** the binding `moved_target` companion) · [[tasks/implement-adr-041s-dashboard-half]] (`0265`, which extends this grammar with the `Backlog` token) · [[tasks/gloss-the-moved-to-sprint-n-row]] (`0268`, the vocabulary follow-up this ADR named as the producer's to file) · [[tasks/decide-whether-the-active-sprint-glob-widens]] (`0261`, the companion decision)
- [[tasks/the-2026-08-13-vault-resync-chain]] — task `0269`, the ingest that brought this ADR into the vault
