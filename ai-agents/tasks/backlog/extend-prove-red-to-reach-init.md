# Extend `prove-red.sh` to reach `fkit-claude-init.sh` (add the missing test seam)

## Sprint
Backlog

## Priority
Unscheduled — high-value (see Context: the un-red-proved fixes are exactly the ones that shipped broken)

## Status
🔲 Backlog

## Context

**`prove-red.sh` mechanizes "a test that has never failed has not been tested" — but it cannot run on
the init-driven tests at all.** The gate makes deliberately-wrong copies and confirms the suite goes
red **at a NAMED assertion**, not merely "some failure" (header, `test/prove-red.sh:4-8`). Its two
current mutations are **both against the launcher** (`:86-111`): a `skills_for_role()` entry and the
pre-task-18 `--resume` passthrough. Neither touches `fkit-claude-init.sh`.

**The gap is structural, not an oversight.** `prove-red.sh` reaches the suite by pointing it at a
mutated launcher through the `FKIT_LAUNCHER` env var (`:41`, honored in `test/harness.mjs`). But the
init-driven tests do **not** go through the launcher: `runInit()` spawns a **hardcoded** `INIT` const
(`test/harness.mjs:160`, used at `:164-167`) and there is **no `FKIT_INIT` override**. So prove-red
has no seam to reach init through. Adding that seam is the first step; extending the mutation list is
the second.

**Precedent for the exact shape already exists in the same file.** `skill-ownership-hook.test.js` is
mutated via its own `FKIT_SKILL_OWNERSHIP_HOOK` env var (`prove-red.sh:50-52`, `:91-93`) — separate
from `FKIT_LAUNCHER` precisely because it tests a **standalone script**, not the launcher (task 43 /
ADR-018). **Init is the same case.** This follows an established pattern; it does not invent one.

**Why it matters — this is not hypothetical.** In task 36
(`remove-fkit-omnigent-orphan-residue`), the coder shipped fixes where the **red-proved** ones (R1,
R2, R8) survived review and the **un-red-proved** ones (C2, and C7's own fix) were found broken by two
independent reviewers. The coder hand-rolled red-proofs by copying `claude/` and neutering fixes — a
worse reimplementation of what `prove-red.sh` already does — **because the connection did not exist**:
the gate that encodes this rule *could not have run on the tests that broke it* even if reached for.
Evidence: task 36 review ledger `ai-agents/reviews/remove-fkit-omnigent-orphan-residue.md`.

**Scoping provenance — owner-ruled 2026-07-17.** The owner ruled this should exist as **its own brief
rather than folded into task 46** (`investigate-mutation-testing-library-adoption`), on the reasoning
that extending the existing script is small and concrete and should not wait on task 46's open-ended
library investigation. The **broader "should this doctrine have a permanent enforcement point"
question is owner-parked** ("leave it for later — the answer's the same either way"). This brief is the
narrow, concrete piece and must not re-open that question. **This is a filing, not a go-ahead** — it
is not scheduled or approved to start.

## What to build

- **Add an `FKIT_INIT` override to `runInit()`** in `test/harness.mjs`, mirroring the existing
  `FKIT_LAUNCHER` / `FKIT_SKILL_OWNERSHIP_HOOK` precedent: honor an env-var-supplied init path,
  falling back to the hardcoded `INIT` const when unset. Ordinary runs (env unset) must behave exactly
  as before.
- **Add at least one init mutation to `prove-red.sh`** that reds a **NAMED assertion** in
  `test/orphan-cleanup.test.js` — following the `run_hook_suite()` shape (a separate runner keyed on
  the new env var), not `run_suite()`, since init is a standalone script like the ownership hook.
  A verified-good candidate: **neuter `orphan_contained()` to `return 0`** and require the
  parent-symlink escape test to go red. The coder ran exactly this by hand and confirmed it works.
- **Assert red *at the named assertion*, not merely "some failure"** — matching the existing mutations'
  `grep` check that the red isolates to the intended assertion (`prove-red.sh:98-99`, `:109-110`).
- **Add the corresponding unmutated-copy green check**, mirroring steps 0b/0c (`:73-84`): an unmutated
  full copy driven through `FKIT_INIT` must be green first, so a later red isolates to the mutation and
  not to broken setup. See the Risk note below — this guard is load-bearing here.

## Verification steps

- **With the fix in place, `test/prove-red.sh` exits 0** — real + unmutated copy green, and the new
  init mutation reds its NAMED `orphan-cleanup.test.js` assertion.
- **The new mutation genuinely bites:** temporarily reverting the *fix under test* (i.e. leaving
  `orphan_contained()` un-neutered / correct) keeps the assertion green; the neutered mutant reds it.
  A mutation that reds regardless of the code proves nothing.
- **Red for the RIGHT reason:** confirm the suite goes red **at the parent-symlink-escape assertion by
  name**, not at `before()`/setup. The `grep`-for-named-assertion guard must be present and passing.
- **The unmutated `FKIT_INIT` copy is green** (step-0b-equivalent) — proving the red isolates to the
  mutation, not to setup failing from an incomplete copy.
- **Ordinary suite runs are unchanged:** with `FKIT_INIT` unset, `runInit()` spawns the hardcoded
  `INIT` exactly as before; the full `node --test` suite still passes.
- **No regression to the two existing mutations:** the launcher `skills_for_role()` and `--resume`
  mutations still red their named assertions.

## Notes

- **Owner: fkit-coder** — a test-infrastructure change (`test/prove-red.sh`, `test/harness.mjs`); no
  production code.
- **Risk: the mutant must live inside a FULL copy of `claude/`.** `prove-red.sh`'s own header
  (`:10-15`) documents that a mutant launcher needs the whole `claude/` tree because setup runs
  `fkit-claude-init.sh` — a bare-file copy fails setup and the suite goes "red for the wrong reason,"
  proving nothing. An **init mutation has this hazard doubly**, since init *is* the thing under
  mutation: a malformed init copy could red at setup rather than at the target assertion. The
  unmutated-copy-must-be-green check (step 0b/0c equivalent) is exactly what guards this and **must be
  added alongside the mutation, not skipped.**
- **🔒 Scope limit — deliberate.** This brief adds the **seam** (`FKIT_INIT`) and **one** init
  mutation. It does **not** re-open the owner-parked "permanent enforcement point for the red-proof
  doctrine" question, and it does not attempt to red-prove every init-driven test — one named
  mutation, following the established pattern, is the shippable unit.
- **Cross-reference — do not duplicate: `investigate-mutation-testing-library-adoption.md`** (Sprint 2,
  priority 46) may replace `prove-red.sh` wholesale with a mutation-testing library. If it does, this
  brief's **seam work (`FKIT_INIT` in `runInit()`) likely survives** that change (a library still needs
  a way to point the suite at a mutated init), while the **hand-rolled mutation in `prove-red.sh` may
  not.** Sequencing is a soft consideration, not a hard dependency: neither task blocks the other, but
  whoever lands second should reconcile. Flagged so the two do not collide.
- **Evidence sources:** `test/prove-red.sh` (header `:4-8`, `:10-18`; the two current mutations
  `:86-111`; the `FKIT_SKILL_OWNERSHIP_HOOK` standalone-script precedent `:48-57`, `:91-93`; the
  unmutated-copy-green guards `:73-84`; named-assertion `grep` guards `:98-99`, `:109-110`).
  `test/harness.mjs` (hardcoded `INIT` const `:160`; `runInit()` spawning it with no override
  `:164-167`). Motivating incident: task 36 review ledger
  `ai-agents/reviews/remove-fkit-omnigent-orphan-residue.md` (red-proved R1/R2/R8 survived; un-red-proved
  C2 and C7's fix found broken).
