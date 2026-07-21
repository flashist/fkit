# Plan — Assert task IDs are unique in the test suite

**Task:** `ai-agents/tasks/backlog/assert-task-ids-are-unique-in-the-test-suite.md`
**Task ID:** 0101 · **Sprint 2**, priority 85 (append rank — runs BEFORE task 76)
**Approved:** 2026-07-20 by the owner, via the ship-loop plan gate.

## Scope of the approved autonomy boundary

One new file: `test/task-id-uniqueness.test.js`. **No product code, no skill edits, no brief edits.**

## The build

### Header comment
Documents the test-scope widening as a **fourth** category — an invariant over the repo's own
`ai-agents/` content, as opposed to ADR-014 §2's two (the argv handed to `claude`; the skillOverrides
map) and ADR-017 rule 4's third (a shipped skill executable's stdout contract). Follows the
`test/dashboard-contract.test.js:3-7` precedent exactly. Cites **ADR-029 Decision 3** as the
pre-authorization: the ADR names this assertion as the sole mitigation for the accepted cross-branch
race.

**Owner ruling at the plan gate (2026-07-20): header note, NOT an ADR amendment.** ADR-029 Decision 3
already names the test, so no new decision is being made.

### Pure functions, unit-tested against fixtures
- `findDuplicates(records)` — over `{ id, source }[]`; returns `{ id, sources[] }[]`.
- `discoverBriefs(tasksRoot)` — walks `backlog/`, `done/`, `cancelled/`; matches **both** corpus
  shapes: today's `<board>/<slug>.md` **and** post-76's `<board>/<NNNN>-<slug>/brief.md`.
- `readId(text)` — extracts the `## ID` field value.

### Tests
**Unit (fixtures under `os.tmpdir()`):** clean corpus · two-way duplicate · three-way duplicate ·
empty list · discovery over a flat-shape tree · discovery over a post-76 folder-shape tree ·
discovery over an empty dir returns zero.

**Live corpus (`ai-agents/tasks/`):** brief count **non-zero** (derived, never hardcoded) · ID count
**equals** brief count · zero duplicates · every ID matches `^[0-9]{4}$`.

### Failure message
Names each duplicated ID **and every brief path carrying it**. A bare `assert.equal(dupes.length, 0)`
is explicitly rejected — the remedy ("renumber the offender") requires knowing which brief is the
newcomer.

### Red proof
The **fixture duplicate is the red proof**. **No `prove-red.sh` change** — that script mutates product
code via `FKIT_LAUNCHER` / `FKIT_SKILL_OWNERSHIP_HOOK`, and this invariant has no product-code seam to
mutate.

### Read-only
Reuses only `REPO` and `cleanup()` from `harness.mjs`. `git status` clean after the run.

## Explicitly out of scope (the brief's scope lock)
- The `id-mismatch` drift assertion and the malformed-folder-without-`brief.md` assertion — both
  belong to **task 76**, which creates the structure they assert against.
- A `9999` overflow stop rule — four-digit overflow is a recorded accepted residual (spec §3.1).
- Lock files, reservation protocols, content-derived IDs, a registry file — all four weighed and
  rejected on the record (ADR-029 Decision 3, Decision 8, §Options considered, §Re-raise only if).
