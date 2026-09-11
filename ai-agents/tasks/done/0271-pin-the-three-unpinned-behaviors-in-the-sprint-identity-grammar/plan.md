# Implementation plan — task `0271`: pin the five unpinned behaviors in the sprint-identity grammar

## ⛔ Corrections to the driver's framing — these lead, and they hold

**1. The brief is FIVE items, and the folder name says three.** Brief H1: *"Pin the five unpinned
behaviors in the sprint-identity grammar"*; folder is `0271-pin-the-three-unpinned-behaviors-…`. The
brief flags this itself: *"This brief was filed as three behaviors and grew to five on the owner's
ruling of 2026-08-11"* and ⛔ *"Do not rename it as a side effect of this task."* ⛔ **Do not rename.**

**2. The driver's design question — "which of the five must survive `0338`?" — was pointed at the
wrong five.** Measured: **none of the five pins the identity-only eligibility rule or the highest-`N`
selection rule.** Those live at `dashboard.sh:173` (`is_eligible`) and `:265` (keep-if-`identity_gt`)
— and **`0338`'s own brief fences them off from `0271` the other way round**, under *Notes*:
*"Do not touch: the identity ladder (`resolve_identity`, ADR-040), the candidate set, the `Backlog`
token, the §1.5 tie-break."* Every one of `0271`'s five items sits **inside that do-not-touch list**.
The existing `S1`/`S1b`/`S2` tests are what pin today's selection policy, and `0338`'s brief already
owns rewriting them.

⭐ **So: all five are BEHAVIOR. There is no policy item among them to leave unfrozen.** The `0338`
hazard is real but it is an **assertion-idiom** hazard, not a behavior-classification one.

**3. Dependencies verified true.** `0264` and `0265` are both under `ai-agents/tasks/done/`.

**4. The brief's item-4 claim is STALE.** It says dropping the `[ -f ]` guard yields a phantom
candidate *"plus a `head:` stderr line"*. The `head:` half can no longer happen — `0265`'s R5 fix put
`[ -r "$1" ] || return 0` at `dashboard.sh:141`, which returns **before** `head` runs. The
phantom-candidate half stands. Recorded in the worklog rather than inherited.

**5. `test/coordination-citation-policy.test.js:159` says "All 28 prove-red mutations" — there are 31.**
Pre-existing staleness, **outside this task's fence**. Flagged, not fixed.

## Why all five are durable

| Item | What it pins | Lives in | `0338` verdict |
|---|---|---|---|
| 1 | DISTINCT-vs-total refusal (`seen`, `:100`) | `plan_sprint_from_h1` — ADR-040 ladder | do-not-touch |
| 2 | first-line-only (`head -1`, `:85`) | `plan_sprint_from_h1` — ADR-040 ladder | do-not-touch |
| 3 | a prove-red mutation over items 1/2 | `test/prove-red.sh` | unaffected |
| 4 | `[ -f ]` no-match guard (`:242`) | the candidate set | do-not-touch; kept |
| 5a | `sprints/done/` excluded from candidacy | the candidate set (depth-1 glob) | **extended** — `0338` adds `cancelled/` |
| 5b | `identity.md` renders as a board | argv dispatch (`:304-310`) | untouched |

## ⭐ The hazard that IS real, and where it bites

`0338` changes `select-active`'s **output grammar**, not its candidate set: `candidate` lines gain a
`status=` field; `active` becomes plural with a separate `chosen file=…` line; `identity <plan>` grows
to print the status beside the identity.

The existing S-test helpers encode today's grammar as **exact string equality**:

```js
const activeLine = (out) => selectLines(out).find((l) => l.startsWith('active'));
assert.equal(activeLine(out), 'active file="plan-sprint-10.md" identity="Sprint 10"');
```

⛔ **A new test written in that idiom reds on `0338` for a deliberate change.** It bites items **4**
and **5a** (both read `candidate` lines) and items **1**/**2** if routed through `identity <plan>` with
whole-stdout equality. It does **not** bite the `T2–T11` idiom, which asserts on board-mode drift facts
through `adr040Drift()` and filters by prefix.

## Measured baselines (HEAD `9943dcf`)

- `node --test test/dashboard-contract.test.js` → **143 pass / 0 fail**.
- `test/prove-red.sh` → **31 mutations** (grep-counted; suite not re-run — plan-only).
- Full `npm test` **not** re-run by the planner; the driver's 872/872 is unverified by it.

**All five behaviors confirmed present as built**, by read-only probe in a temp dir:

| Probe | Result |
|---|---|
| empty `sprints/` | `active none`, exit 3, **zero** candidates — item 4's guard works |
| only `sprints/done/sprint-9.md` | `active none`, exit 3, **zero** candidates — item 5a works |
| `# Sprint 5 — Sprint 5` | resolves `Sprint 5`, exit 0 — item 1's de-dup works |
| `# Sprint 5 — Sprint 6` | exit 3, refusal — the contrast case |
| token on **line 2** only | exit 3, refused — item 2's `head -1` works |

## The plan

⛔ **Diff fence: `test/dashboard-contract.test.js` + `test/prove-red.sh` ONLY.** `dashboard.sh` ends
byte-identical (`git diff` on it empty) — the brief's verification step 2.

### Step 1 — item 1: the distinct-count guard
Add after `T6`: `ADR-040 0271/1: an H1 naming the SAME sprint twice resolves — the count is DISTINCT, not total`
- `planName: 'hardening.md'` (rung 2 cannot answer), H1 `# Sprint 5 — Sprint 5`.
- Assert via `adr040Drift()`: **no** `drift unresolved-plan-sprint`.
- Discriminating half: brief `## Sprint: Sprint 5` with a matching status → assert **zero** `drift disagreement`.

Mutant: drop `seen` → `cnt=2` → refuse → rungs 2/3 fail → identity empty → `drift unresolved-plan-sprint` fires → red.

### Step 2 — item 2: the first-line-only guard
`ADR-040 0271/2: the H1 is read from LINE 1 ONLY — a token on line 2 does not resolve`
- `planName: 'hardening.md'`; line 1 `# Hardening plan` (no token), line 2 `# Foo — Sprint 7 — bar`.
- Assert `drift unresolved-plan-sprint` **is present** today, plus a `T6b`-style rollup check.

Mutant: `head -1` → `cat` → awk matches line 2 → the fact vanishes → red.

### Step 3 — item 4: the `[ -f ]` no-match guard
`ADR-041 0271/4: an empty sprints/ lists NO candidate — the glob's no-match guard`
- `sprintsFixture({ plans: {} })`. Assert exit **3**, `active none`, `candidates(out).length === 0`,
  plus `assert.ok(!candidates(out).some((l) => l.includes('*.md')))` naming the phantom.
- ⭐ Comment must carry the brief's asymmetry warning: the `set +f` half **is** already pinned (7 tests);
  only the `[ -f ]` half is unpinned; blast radius is cosmetic, **not** mis-selection. ⛔ Do not let a
  future reader call this "globbing is untested".

Mutant: delete `[ -f "$_f" ] || continue` at `:242` → literal `<dir>/*.md` becomes a record → red.

### Step 4 — item 5a: the `sprints/done/` exclusion
`ADR-041 0271/5a: a plan under sprints/done/ is never a candidate`
- Write `sprint-9.md` under the fixture's `sprints/done/`, nothing at top level.
- Assert exit **3**, `active none`, and `assert.ok(!candidates(out).some((l) => l.startsWith('candidate file="sprint-9.md"')))`.

⚠️ **Wrinkle the brief did not anticipate.** The brief says *"temporarily neutralize the `sprints/done/`
exclusion"* — ⛔ **there is no exclusion to neutralize.** It is emergent from the depth-1 glob at `:241`;
`0338`'s brief says the same of `cancelled/` (*"likewise never seen by construction"*). Settled by
ruling **U3** below.

### Step 5 — item 5b: `identity.md` renders as a board
`ADR-041 0271/5b: a plan file named identity.md still renders as a board`
- Full `fixture({ planName: 'identity.md', … })` — the board render needs a real `tasks/` tree above it,
  so `sprintsFixture` will not do. One argument. Assert exit **0** and a board (`⟦FACTS⟧` present), not
  a usage error and not an identity value.

Mutant: `:304` `[ $# -eq 2 ]` → `[ $# -ge 1 ]` → one-arg `identity.md` hits the dispatch and dies on `$USAGE`.

### Step 6 — item 3: the prove-red mutation
Add **one** mutation, `# --- Mutation 32`, cloning mutation 14's landed seam exactly: `make_repo_copy`
→ `awk`-swap one line from a heredoc file (⛔ **not** `awk -v` — mutation 14's own comment explains why:
escape processing mangles the replacement and reds everything for the wrong reason) → no-op guard
(`cmp -s`) → `run_dashboard_suite` → assert `red` **and** `grep -Eq '(✖|not ok|fail).*0271/1'`.

**Target: item 1's `seen` de-dup** — the rule whose in-code comment already points at this task.
Count moves **31 → 32**. Nothing asserts `31` mechanically (verified).

### Step 7 — verification

| # | Mutation | Assertion that must red |
|---|---|---|
| 1 | drop `seen` de-dup, `dashboard.sh:100` | `0271/1` — no `unresolved-plan-sprint` |
| 2 | `head -1 "$1"` → `cat "$1"`, `:85` | `0271/2` — `unresolved-plan-sprint` present |
| 3 | run `test/prove-red.sh` | new **Mutation 32** red at `0271/1`, all 31 others unchanged |
| 4 | delete `[ -f "$_f" ] \|\| continue`, `:242` | `0271/4` — `candidates(out).length === 0` |
| 5a | glob `:241` → `"$1"/*/*.md` | `0271/5a` — `sprint-9.md` absent from candidates |
| 5b | `:304` `[ $# -eq 2 ]` → `[ $# -ge 1 ]` | `0271/5b` — exit 0 / board rendered |

⛔ Item 4 is **not** red-proved by removing `set +f` — that half reds 7 tests for the wrong reason
(the brief's explicit instruction).

Then: restore each; `git diff claude/skills/fkit-status/dashboard.sh` **must be empty**; full `npm test`;
`test/prove-red.sh` to `✓ hard gate PASSED`. ⛔ **Counts re-measured, never carried** — expected
`143 → 149` and `31 → 32`, but state what is measured, not what was predicted.

### Step 8 — worklog
Record: the awk-dialect limit (BSD one-true-awk 20200816 only; `gawk`/`mawk`/`busybox awk`
**unverified, carried as context not scope**); the stale `head:` claim correction; the 5a
"no exclusion code exists" finding; the `0338` assertion-idiom rule and why.

### Close
⛔ No mover held by the coder (ADR-033). Driver spawns `@fkit-producer` for `/fkit-task-done`.

## Edge cases and failure modes

- **A guard that reds against landed code** → the guard is wrong. Brief's constraint: ⛔ **stop and
  report**, never adjust `dashboard.sh`. Absolute.
- **Item 2's mutant printing twice.** With `cat`, awk prints once per matching line; the fixture gives
  one token-bearing line, so the mutant value is single-line — deliberate, so the red is legible.
- **`foldBriefsAndPlan` restarts its ID sequence per plan.** The `sprintsFixture` passes no briefs.
- **`sprintsFixture` pre-creates `sprints/done/`** — item 4's "empty directory" is only empty of `.md`
  at depth 1. That is the right seam: the glob is depth-1.
- **Test-name tokens are the mutation's only handle.** If a future rename drops `0271/1`, Mutation 32
  disarms silently. Mutation 14's `cmp -s` no-op guard is the precedent; add the same and say so.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-10

Given live via `AskUserQuestion`. Option labels **verbatim**. These bind the Build and Process-review workers.

| # | Question | Owner ruling | What it settles |
|---|---|---|---|
| **U0** | Approve this plan? | Approved via U1–U3 | ⛔ Every step above stands as written except where narrowed below. |
| **U1** | Which assertion idiom, given `0338` extends the output grammar? | **"Field-tolerant (Rec)"** | ⭐ **Prefix/regex match on the fields under test; ⛔ NEVER whole-line equality** — e.g. `/^candidate file="sprint-9\.md"/`, not `includes('candidate file="sprint-9.md" identity="Sprint 9"')`. ⭐ Guards stay load-bearing today **and** stay silent through `0338`'s deliberate grammar change. ⚠️ **Accepted cost, named: a stray extra field would not be caught.** ⛔ Do not match the existing S1–S8 exact-equality idiom. |
| **U2** | How many prove-red mutations for item 3? | **"One — item 1's `seen` drop (Rec)"** | ⭐ **Exactly ONE new mutation** (`# --- Mutation 32`), targeting item 1's `seen` de-dup, redding `0271/1`. Count **31 → 32**. ⛔ Do not add item 2's `head -1` mutation — the brief scoped one and says *"if planning wants a sixth, that is a new brief and a new owner ruling."* |
| **U3** | Item 5a's red-proof cannot be run as the brief words it — there is no exclusion code to neutralize. | **"Widen the glob to depth 2 (Rec)"** | ⭐ **Red-prove item 5a by mutating the glob at `dashboard.sh:241`: `"$1"/*.md` → `"$1"/*/*.md`.** ⭐ Faithful to the actual behavior and honest about what really implements the exclusion. ⛔ **Do not re-scope 5a or return it to the producer** — the behavior it pins is real and probe-confirmed; only the brief's description of the mechanism is wrong. ⭐ **Record the correction in the worklog.** |
