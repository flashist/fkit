# Implementation plan — task 0265: ADR-041's `dashboard.sh` half

## 0. Preconditions — both verified during planning (2026-08-11), restate in `worklog.md`

| Gate (brief verification step 1) | Measured |
|---|---|
| ADR-041 reads `accepted` | ✅ `adr-041-…md:3` → `- **Status:** accepted` |
| `0264` is closed | ✅ `ai-agents/tasks/done/0264-implement-adr-040s-identity-grammar-…/` exists; `sprint-5.md:145` row reads `✅ Done (agent-closed — not owner-verified)` |

Baseline to re-measure before the first edit and after the last: `npm test` (695/695, exit 0) and `bash test/prove-red.sh` (`✓ hard gate PASSED`).

---

## 1. The decision the brief refused to make — answered, no escalation needed

**The brief's escalation trigger is: "if your plan leaves §1.4 (ordering) or §1.5 (ambiguity) in prose, escalate before building."** This plan leaves neither in prose, so it does not escalate.

**Why a one-file `identity <path>` surface is not sufficient, and what closes the gap.** Items 3, 4 and 5 of "What to build" (integer ordering, same-identity ambiguity, empty-eligible-set behavior) are all **selection-level** behaviors. `fkit-status/SKILL.md` is ⛔ off-limits (`0266`). So if `dashboard.sh` only answers "what is *this* file's identity?", the ordering, the tie-break and the empty-set report have nowhere to live except LLM-executed prose in a file this task may not touch — untestable, and exactly the gap §1.4 names.

**Therefore the interface is two modes, not one:**

- `identity <plan-path>` — the §5 resolve-identity primitive (one file in, one identity out).
- `select-active <sprints-dir>` — the whole §1 rule executed in shell: resolve every candidate, filter to eligible, order, tie-break, report ambiguity, report the empty set.

ADR-041 explicitly contemplates the second (§1.5: *"Whether the record originates in a `dashboard.sh` selection mode or is passed to it is the implementer's call"*). With it, **S1–S8 are all mechanically testable from `test/dashboard-contract.test.js`**, with no prose in the loop. `0266` then consumes `select-active` and restates no grammar.

---

## 2. Two flagged design calls the owner may veto at this plan gate

**(A) Board mode gains a sibling-collision check, which widens its documented read contract.**
ADR-041 §1.5 requires the same-identity collision to set `plan_level_drift` and reach **the roll-up's drift clause** by the same route `unresolved-plan-sprint` takes (`dashboard.sh:971-983`). That clause exists only in the **board** render, which is a different invocation from `select-active`. Two ways to get it there:

1. *(chosen)* board mode detects it itself — scan the first line of the sibling `.md` files in the plan's own directory and report any other file claiming the same `Sprint <N>` identity. Self-contained; the caller cannot forget it; testable in one invocation.
2. *(rejected)* the collision is **passed in** as an extra argument by the caller. But the only caller is `SKILL.md`, which this task may not edit — the flag would be droppable prose exactly where §1.5 says it must be structural.

**The cost of (1), stated plainly:** `dashboard.sh:24-27` says *"pure function of (sprint-plan path, the briefs it links) … Reads the plan and the briefs it links. Nothing else."* That comment becomes false and **will be amended in the same change** to name the new read (first line of sibling `.md` files in the plan's own directory) and why. This is the plan's most consequential call; it is inside ADR-041's stated latitude, but it is a contract widening and is flagged here rather than buried.

**(B) No new `test/prove-red.sh` mutation.** Verification step 4 ("integer ordering proves itself red") is satisfied by a **measured, recorded A/B during the build** — mutate the comparison to a text sort locally, capture the failing output into `worklog.md`, revert — not by adding a permanent mutation. Reason: ⛔ `0271` owns the missing prove-red mutation for this grammar family, and adding one here risks colliding with it. `prove-red.sh` is otherwise untouched and must stay green (gate 0i runs the dashboard suite on a repo copy).

---

## 3. A correction the plan carries forward — the "text sort" claim is withdrawn, and is not re-asserted

The brief (item 3) and the sprint row say *today's "highest N" runs on a glob's text sort, so `sprint-9` beats `sprint-10`*. **ADR-041 §1.4 explicitly withdraws that as an over-claim**: there is no sort anywhere in the code; `SKILL.md:26-28` is prose instructing a model, and a model asked for the highest N will most likely answer 10. The real defect is weaker and still sufficient: **the ordering is carried in prose and pinned by no test.**

Consequence for the build: S1 is *a contract being written for the first time*, not a bug being fixed. Its red/green A/B is run against **a mutation of the new code**, and no comment or test name may claim today's code text-sorts. (Same discipline as `0264`'s corrected T6 comment.)

---

## 4. File-by-file changes

### 4.1 `claude/skills/fkit-status/dashboard.sh`

**Step 1 — relocate the identity block above the argument handling (pure move, no behavior change).**
Today the ladder (`SPRINT_NUM_RE`, `SPRINT_ID_RE`, `plan_sprint_from_h1`, `plan_sprint_from_stem`, the inline rungs at `:139-163`) sits *after* `[ $# -eq 1 ] || die` (`:49`), `PLAN=`, and the `AGENTS` walk-up (`:57-65`). The new modes must resolve identity **without** requiring a `tasks/` tree above the plan, so the dispatch has to precede that walk.

- Move, **verbatim, comments and all**, the block `:88-163` (the `SPRINT_NUM_RE`/`SPRINT_ID_RE` constants and both `plan_sprint_*` functions) plus `fact_value()` (currently ~`:529`) to sit immediately after `die()` (`:47`).
- Leave the rule-1 rationale comment (`:78-86`) at the `PLAN_SPRINT=` assignment site with a one-line pointer to the relocated functions.
- ⛔ This is a **relocation**, not a rewrite. No comment reworded, no regex retouched, no ADR-040 behavior altered. `0271`'s three known-unpinned behaviors stay exactly as they are, and T6's corrected comment is not restated.

**Step 2 — add the `Backlog` token to rung 1 (ADR-041 §2).** Inside `plan_sprint_from_h1`'s awk segment loop, **normalize before the distinct-count**:

```awk
s = seg[i]
gsub(/^[[:space:]]+|[[:space:]]+$/, "", s)
# ADR-041 §2 — the SECOND token on this SAME rung. Normalize to `Backlog` BEFORE the distinct
# count: `# X — Backlog — Sprint Backlog` names ONE identity twice and must resolve, not refuse.
# ⚠️ The value is `Backlog`, never `Sprint Backlog` — that exact string is what briefs carry
# (`## Sprint: Backlog`) and what the rule-1 arm below compares against; see the divergence
# warning on the basename rung.
if (s == "Sprint Backlog") s = "Backlog"
if ((s ~ ("^" tok "$") || s == "Backlog") && !(s in seen)) { seen[s] = 1; cnt++; last = s }
```

Consequences that must hold and are tested: `# Sprint 5 — Backlog` yields two distinct tokens → **refuses** at rung 1 → falls to the filename rung → `sprint-5.md` → `Sprint 5` (ADR-041 §2, required). `Sprint Backlog` never matches `^Sprint [0-9]+[a-z]?$`, so the two token families cannot collide.

**Step 3 — extract `resolve_identity()`, the single ladder used by every mode (§5's one-implementation constraint).**

```sh
resolve_identity() {   # <plan-file> -> the identity, or nothing.  ADR-040's ladder + ADR-041 §2.
  _id=$(plan_sprint_from_h1 "$1")
  [ -n "$_id" ] || _id=$(plan_sprint_from_stem "$1")
  # rung 3 — the `backlog` BASENAME special case, owner-ruled 2026-07-18 (R4). UNCHANGED by ADR-041:
  # the new `Backlog` H1 token is a rung ABOVE it, not a replacement. <existing comment block moves here verbatim>
  if [ -z "$_id" ] && [ "$(basename "$1" .md)" = "backlog" ]; then _id="Backlog"; fi
  printf '%s\n' "$_id"
}
```

Board mode's `:139-163` collapses to `PLAN_SPRINT=$(resolve_identity "$PLAN_FILE")`. ⛔ Rung 3's condition and its comments are preserved byte-for-byte inside the function.

**Step 4 — mode dispatch, immediately after `die()` and *before* `PLAN=`/the `AGENTS` walk.**

```sh
# Modes (ADR-041 §5). ONE argument = the historic board render, byte-identical — every existing call
# site passes exactly one path (SKILL.md:182, fkit-sprint-ship-loop/SKILL.md:96), so nothing changes
# for them. A subcommand is only recognised in the two-argument form, so a plan file literally named
# `identity` still renders as a board.
if [ $# -eq 2 ]; then
  case "$1" in
    identity|select-active) MODE=$1; shift ;;
    *) die "usage: bash dashboard.sh <plan> | identity <plan> | select-active <sprints-dir>" ;;
  esac
  ...run the mode and exit...
fi
[ $# -eq 1 ] || die "usage: bash dashboard.sh <plan> | identity <plan> | select-active <sprints-dir>"
```

**`identity <plan-path>`** — prints the resolved identity on one line, or nothing.
- exit **0** resolved · exit **3** file readable but unresolved · exit **1** usage / no such file (the existing `die`).
- No `⟦…⟧` markers: it emits a **value**, not a rendering — one line, nothing else, so `0266` can consume it with a single command substitution. (Not a second board rendering; `one-skill-one-output` is untouched, per ADR-041 §5's closing note.)

**`select-active <sprints-dir>`** — ADR-041 §1 in full. Marker-wrapped, reusing this file's existing conventions (`VERSION_MARKER`, `⟦FACTS⟧`/`⟦END⟧`, `key="value"` fields via the one `fact_value()`):

```
⟦fkit-dashboard v1⟧
⟦SELECT⟧
active file="plan-sprint-6.md" identity="Sprint 6"
candidate file="backlog.md" identity="Backlog"
candidate file="plan-sprint-6.md" identity="Sprint 6"
candidate file="sprint-6.md" identity="Sprint 6"
⟦FACTS⟧
drift ambiguous-active-sprint identity="Sprint 6" chosen="plan-sprint-6.md" also="sprint-6.md"
⟦END⟧
```

- **Candidates** = every `*.md` **directly** in the given directory (`sprints/done/` excluded by construction — depth 1 only; `[ -f ]` guards a directory named `*.md`). Unresolvable → `identity="unresolved"`. The full list is printed **always**, not only in the empty case: one code path, and it gives `0266` what §1.6 needs without a second mode.
- **Empty eligible set (§1.6)** → the line `active none`, the candidate list, exit **3**. **No fallback, ever** — `Backlog` and `unresolved` are not eligible.
- **`also="…"`** lists **every** other claimant, comma-space separated. Naming only the chosen file fails S6.
- Boundary, stated deliberately: collision reporting covers **eligible (`Sprint <N>`) identities only**. Two files both resolving `Backlog` cannot mis-select anything (Backlog is never eligible) and are out of ADR-041's scope; a board-mode run on such a file is where that would surface if it is ever wanted.

**Step 5 — ordering (§1.4), overflow-free and locale-free.** Compare two eligible identities:
1. strip leading zeros from `<N>` (so `sprint-08` < `sprint-9`);
2. **longer digit string wins** — this is what makes `Sprint 10 > Sprint 9` without shell arithmetic, and it cannot overflow on a 30-digit N (`test -gt` would);
3. equal length → byte compare the digits;
4. equal `<N>` → suffix compare, where **absent < `a` < `b` < …** falls out of `strcmp` because `""` sorts before any letter under `LC_ALL=C`.

⚠️ **Do not implement this with `[ "$a" -gt "$b" ]`** — leading zeros and long digit strings are exactly where it misbehaves.

**Step 6 — tie-break (§1.5), byte order under `LC_ALL=C`.** Iterate candidates in **glob order** and keep the **first** on an exact identity tie. `LC_ALL=C` is already set and exported at `:42-43`, and bash re-runs `setlocale` on assignment to `LC_ALL`, so glob expansion is byte-ordered regardless of the caller's locale — which is what S7 pins. No `sort` in the path (a `sort` would also break on a filename containing a newline, which the glob loop survives).

⚠️ **`set -f` is on (`:40`)** — pathname expansion is **disabled file-wide** as a correctness guard. The candidate glob must be wrapped `set +f` … `set -f` and must handle the no-match case (the pattern stays literal; guard with `[ -f "$f" ]`). Getting this wrong yields *zero candidates or one literal path*, silently.

**Step 7 — the board-mode collision check (design call A above).** After `PLAN_SPRINT` is resolved, when it matches `^Sprint <N><suffix>$` (not `Backlog`, not empty), resolve the identity of the plan's **siblings** in `PLAN_DIR` and, if any other file claims the same identity, emit

```
drift ambiguous-plan-identity identity="Sprint 6" plan="sprint-6.md" also="plan-sprint-6.md"
```

and set `plan_level_drift=1` alongside the two existing setters at `:976-977`, so the roll-up clause reads *"and on the plan itself"*. Field name is `plan=`, not `chosen=` — board mode renders whatever it was handed and must not imply it did the choosing. Amend the CONTRACT comment at `:24-27` in the same edit.

**⛔ Untouched:** `STATUS_HEADING_RE`, the rung-3 `backlog` basename case, the `moved_target` extractor (including its accepted right-boundary residual — `➡️ Moved to Sprint 4th` → `Sprint 4t` stays), the row-admission class, the open-work filter, the roll-up construction, `VERSION_MARKER`.

### 4.2 `test/dashboard-contract.test.js`

Additive only. ⛔ **No existing test edited** — R7/`task 68` and ADR-040 T2–T11 must stay green **byte-unchanged** (brief verification step 8).

New helpers, beside `fixture()` (which stays byte-unchanged so its callers are unaffected):
- `runMode(args, env)` — `spawnSync('bash', [SCRIPT, ...args], { encoding:'utf8', env: {...process.env, ...env} })`.
- `sprintsFixture({ plans, briefs })` — builds the same `ai-agents/` tree and writes several plans into `sprints/`; returns `{ sprintsDir, planPath(name) }`.
- `selectLines(out)` — the `⟦SELECT⟧`…`⟦FACTS⟧` block. `facts()` already works on the select output (it splits `⟦FACTS⟧`/`⟦END⟧`).

| ID | Fixture | Assertions |
|---|---|---|
| **S1** | `plan-sprint-9.md` (`# P — Sprint 9 — a`), `plan-sprint-10.md` (`# P — Sprint 10 — b`) | `active … identity="Sprint 10"`, file = `plan-sprint-10.md`, exit 0 |
| **S1b** | `sprint-08.md`, `sprint-9.md` | active = `Sprint 9` — pins the leading-zero normalization |
| **S2** | `plan-sprint-4.md`, `plan-sprint-4b.md`, `plan-sprint-4c.md` | active identity `Sprint 4c` |
| **S3** | `sprint-backlog.md` (`# Geoconflict — Sprint Backlog`) + `plan-sprint-6.md` | active = `plan-sprint-6.md`/`Sprint 6`; `sprint-backlog.md` appears as `candidate … identity="Backlog"` and is **never** the active file |
| **S4** | `sprint-backlog.md` run **by name** in board mode; row `🔲 Backlog`, brief in `backlog/` reading `## Status: 🔲 Backlog` + `## Sprint: Sprint 2` | **(a)** `drift disagreement` fires; **(b)** the A/B twin with `## Sprint: Backlog` fires **nothing**. ⚠️ The brief's status and location must **agree** with the plan cell — otherwise rule 3 fires for an unrelated reason and the test proves nothing (measured: under today's code this fixture is **silent**, which is the regained `:856` check) |
| **S5** | `sprints/` holding only `backlog.md` | `active none`, exit 3, candidate list carries `identity="Backlog"`, and `backlog.md` is not selected anywhere in the output |
| **S6** | `sprint-6.md` + `plan-sprint-6.md`, both `Sprint 6` | **three** assertions: chosen = `plan-sprint-6.md` (`p` < `s`); `drift ambiguous-active-sprint` names **both**; and a board run on the chosen plan emits `drift ambiguous-plan-identity` **and** a roll-up carrying *"on the plan itself"* |
| **S7** | S6's fixture under `LC_ALL=en_US.UTF-8`, `LANG=en_US.UTF-8` | **byte-identical stdout** to S6 |
| **S8** | `sprint-backlog.md` with H1 `# Unscheduled work` | `identity` mode → empty stdout, exit 3; `select-active` → `active none`; board mode → `drift unresolved-plan-sprint` **and** the roll-up clause |
| **§2-a** | `identity` on `backlog.md` (`# Backlog — …`) → `Backlog`; on `# X — Sprint Backlog` → `Backlog` (**never** `Sprint Backlog`); on `# Backlog — Sprint Backlog` → `Backlog` (normalize-before-dedupe) | one line, exit 0 each |
| **§2-b** | `sprint-5.md` with H1 `# Sprint 5 — Backlog` | `Sprint 5` — rung 1 refuses on two distinct tokens, the filename rung decides (ADR-041 §2, required) |
| **compat** | any existing plan path, one argument | board stdout unchanged; plus a bad-subcommand case → exit 1 with the usage message |

Each new drift-bearing case reuses the existing `adr040Drift()` guard (or an equivalent `missing-brief` pre-check) so a broken fixture link cannot make an assertion pass for the wrong reason.

### 4.3 The task folder's `worklog.md`
Records the §0 preconditions, the step-4 red→green A/B transcript, the full `npm test` and `prove-red.sh` output, and — per ADR-019/ADR-032 — a decision log entry for every fix applied without asking (or `none`).

---

## 5. Sequencing

1. Re-measure the baseline (`npm test`, `prove-red.sh`); record it.
2. Relocate the identity block + `fact_value()` (pure move) → `npm test` must still be **695/695**. *A red here means the move was not a move.*
3. Extract `resolve_identity()`, repoint board mode → `npm test` green again.
4. Add the `Backlog` H1 token + tests §2-a/§2-b/S4/S8 → green.
5. Add `identity` mode + its tests → green.
6. Add `select-active` (candidates → eligibility → ordering → tie-break → empty set) + S1/S1b/S2/S3/S5/S6-part-1/S7 → green.
7. Add the board-mode sibling collision check + CONTRACT comment amendment + S6-part-2 → green.
8. Run the step-4 ordering A/B (mutate the comparison to a plain string compare; S1 must go red **naming S1**; revert).
9. Verification step 7 — run against **this repo**: `select-active ai-agents/sprints` must choose `sprint-5.md`; `identity ai-agents/sprints/backlog.md` must print `Backlog`; and a board render of `sprint-5.md` must be **byte-identical** to the pre-change run (capture both, `diff`).
10. Full `npm test` + `bash test/prove-red.sh`. Report both verbatim, pass or fail.
11. Hand off to `@fkit-reviewer` (stateful, task-id `0265`). ⛔ No commit. ⛔ No task-file move.

---

## 6. Edge cases and non-obvious failure modes this plan already accounts for

- **`set -f` kills the candidate glob** — the single likeliest silent break (§4.1 step 6).
- **No-match glob** leaves the pattern literal → `[ -f ]` guard, else `select-active` reports a phantom candidate.
- **`test -gt` on leading zeros / very long `<N>`** → avoided entirely by the length-then-bytes comparison; S1b pins it.
- **Locale**: the script overrides `LC_ALL` after startup; S7 pins that this actually governs glob order. If S7 ever fails, the fix is an explicit byte-order sort of basenames, **not** relaxing the assertion.
- **`sprints/reviews/` and `sprints/done/`** are directories, excluded by the depth-1 `*.md` glob + `[ -f ]`.
- **Unreadable / symlinked sibling** → `head -1 … 2>/dev/null` → `unresolved`, never an error.
- **Filenames containing a newline** break the line-based candidate records — accepted, consistent with every other line-based parser in this file; not worth a guard.
- **Exact-stdout tests (R10)**: existing fixtures write exactly one plan into `sprints/`, so the new sibling check emits nothing for them. If any exact-stdout test moves, that is a real regression, not a fixture to update.
- **`structure-manifest.tsv`** carries no `dashboard.sh` entry (grepped) and is git-history-derived, so nothing to regenerate.
- **`.claude/` copies** are gitignored refreshes of `claude/`; tests run against `claude/` directly. Not refreshed as part of this change.

---

## 7. Open items for the owner at this plan gate

1. **Design call (A)** — board mode reading sibling plan first-lines, which widens the `:24-27` read contract. Chosen because ADR-041 §1.5 requires the collision to reach the **board's** roll-up clause and the pass-it-in alternative would need `SKILL.md`, which is ⛔ `0266`. Veto here if the contract line should stay as written; the fallback is to carry the collision only in `select-active`'s output and record the roll-up requirement as an unmet part of §1.5.
2. **Design call (B)** — no permanent `prove-red.sh` mutation for the ordering contract; a recorded red→green A/B instead, to stay clear of `0271`.
3. **CLI surface names** — `identity` / `select-active`, exit code **3** for "no answer". `0266` will hard-code these; renaming later costs two tasks instead of one.
