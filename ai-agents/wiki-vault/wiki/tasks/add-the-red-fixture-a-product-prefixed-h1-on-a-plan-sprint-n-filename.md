# Add the red fixture — a product-prefixed H1 on a `plan-sprint-N.md` filename

**Source**: `ai-agents/tasks/done/0259-add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 5 P1 · task `0259` · owner `fkit-coder`

## Goal

**Convert a third-party defect report into a failing test this project owns** — the cheapest thing on
the board and the one that makes everything else concrete. One new case in
`test/dashboard-contract.test.js`: plan file named `plan-sprint-4.md`, H1
`# <Product> — Sprint 4 — <theme>`, asserting drift rule 1 **still skips**.

The H1 shape was drawn **verbatim** from the downstream report's table of twelve real plan names.

## Key Changes

⚠️ **This task ships `npm test` RED on purpose, and that is the deliverable.** The close had to say so
loudly. Green does not return until the decision and its implementation land.

⛔ **No edit to `dashboard.sh`** — the fix shape was undecided (that is `0260`). ⛔ No edit to the
selection glob (`0261`). ⛔ **Do not "fix" the two existing R8 tests** — both are correct for what they
assert.

**Built by hand rather than through the shared `fixture()` helper**, because that helper names the
plan file and **the filename is the thing under test.**

## Outcome

### Why the suite missed this — the finding that outlives the fixture

The existing test *"R8: a prose H1 falls back to the filename, keeping rule 1 alive"* uses a fixture
named `sprint-1.md`. **It proves the fallback works when the filename already matches the pattern the
fallback expects.** The suite was ***green for a fixture-shaped reason***.

That observation is why the ADR that followed treats the filename rung as **unevidenced forward
cover** and mandates two tests specifically to exercise it — *an unevidenced rung that no test
exercises can ship broken and stay broken.*

Ordered before `0260` by owner ruling of 2026-08-10 — recorded as a **soft ordering, deliberately not
a `Depends on`**, since the architect can reach the decision from the report alone.

⚠️ Closed `(agent-closed — not owner-verified)`.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[tasks/decide-the-plan-sprint-resolution-strategy]] — the decision this fixture sharpens
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — this fixture is its test T1
- [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]] — the change that turned it green
- [[systems/testing-and-verification]]
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — ⚠️ this task's review ledger claimed *"Coverage is FULL — no reviewer skipped, no degradation"* while Codex **measured nothing**; one of ADR-042's three cases. Per ADR-034 it was **not edited**
- [[tasks/replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary]] — *added 2026-08-29:* `0272`; ⛔ **this task's ledger is one of the three inconsistent coverage claims that motivated ADR-042** — its *"Coverage is FULL"* line while Codex measured nothing
