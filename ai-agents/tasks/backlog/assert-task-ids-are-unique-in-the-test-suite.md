# Assert task IDs are unique in the test suite (the ADR-029 duplicate-ID guard)

## ID
0101

## Sprint
Sprint 2

## Priority
85 — **but must land BEFORE task 76** (priority here is append rank, not run order; see Notes)

## Status
🔲 Backlog

## Context

**ADR-029 accepted a race and named exactly one mitigation. The mitigation was never built.**

ADR-029 Decision 3 rules that the cross-branch ID allocation race is *detected, not prevented*: two
branches can each read `max=0100`, each allocate `0101`, and merge **cleanly** — different folder or
file names, no textual conflict, and git will not catch it. The ADR's answer, verbatim: *"Mitigation is
**detection**: a duplicate-ID assertion in the `node --test` suite (ADR-014)."* The design spec says the
same at §3.3 (*"Detect, don't prevent — **Chosen.**"*) and lists it first under §10 *"New assertions to
add"*.

**It exists nowhere.** Task 75 (`ai-agents/tasks/done/assign-global-task-ids-and-create-registry.md`,
ID `0017`, now `✅ Done (agent-closed — not owner-verified)`) shipped `## ID` onto all 100 briefs then
in the corpus and documented the allocation procedure in `fkit-task-brief` step 6 — but added no test.
The stateful review of task 75 caught this as finding **R3** (medium):
`ai-agents/reviews/assign-global-task-ids-and-create-registry.md`, where R3 is recorded as **deferred
to this brief**. **101 IDs are live right now with no automated uniqueness guard.**

**R3 is not a re-raise of the accepted residual.** The ledger's *Accepted residuals* section records
"Cross-branch ID race — detect, don't prevent" as settled and do-not-re-litigate, and explicitly notes
*"(R3 is not a re-raise — it reports that the agreed mitigation is unbuilt.)"* This brief builds the
agreed mitigation. **It must not re-open** lock files, reservation protocols, content-derived IDs, or a
registry — all four were weighed and rejected on the record (ADR-029 Decision 3, Decision 8, §Options
considered, and the ADR's own *Re-raise only if*).

**Scoping provenance — owner-ruled 2026-07-20.** The owner ruled this gets **its own backlog task**
rather than being folded into task 75 (already shipped) or task 76 (the folder migration). **This is a
filing, not a go-ahead** — it is not scheduled or approved to start.

**Why it is independently shippable today, and the other two §10 assertions are not.** Spec §10 names
three new assertions. The other two — `id-mismatch` drift (brief `## ID` ≠ folder name, §3.5) and
*malformed folder without `brief.md`* (§4) — both assert against a structure that **does not exist until
task 76 creates it**; neither can be written, let alone red-proved, before the migration. Duplicate-ID
is different: its subject is the 100 IDs already in the tree. It ships now, on today's layout, with no
dependency on 76.

## What to build

A duplicate-ID assertion in the repo test suite (`npm test` → `node --test test/*.test.js`).

- **Structure it as a pure function plus one live-corpus assertion.** Extract the check as a small
  function over a list of `{ id, source }` records that returns the duplicates. Unit-test that function
  against **fixture** lists — the clean case, a two-way duplicate, a three-way duplicate, and an empty
  corpus. Then apply it once to the **real** `ai-agents/tasks/` tree and assert no duplicates.
  This split is what makes the guard red-provable (see Verification); a test that only ever reads a
  currently-clean live corpus has never failed and is therefore untested.
- **Scan all three boards** — `backlog/`, `done/`, `cancelled/`. Cancelled tasks keep their IDs forever
  (ADR-029 Decision 3); a scan of `backlog/` alone would miss the collision it exists to catch.
- **Make the corpus discovery survive task 76.** Today a brief is
  `ai-agents/tasks/<board>/<slug>.md`; after task 76 it is
  `ai-agents/tasks/<board>/<NNNN>-<slug>/brief.md`. Discover briefs by matching **both** shapes so this
  test does not go silently vacuous the day the migration lands — a glob that matches zero files still
  passes `uniq -d`-style logic and would report green over an unscanned corpus. **Assert the discovered
  brief count is non-zero**, and assert it equals the count of `## ID` fields found. Read the ID from
  the brief's `## ID` field in both eras (post-76 the folder name is the *authoritative* carrier, but
  reconciling the two carriers is the separate `id-mismatch` assertion, not this one — see Notes).
- **Fail with the offenders named.** The failure message must print each duplicated ID **and every
  brief path carrying it**. The remedy is "renumber the offender before anything links to it"
  (ADR-029), which requires knowing which brief is the newcomer. A bare `assert.equal(dupes.length, 0)`
  makes the failure useless at exactly the moment it fires.
- **Assert the ID format while you are there**, only if it costs nothing extra: every discovered ID
  matches `^[0-9]{4}$`. A malformed ID is a corpus defect this scan is already positioned to see.
  Do **not** add a `9999` overflow stop rule — the ledger records four-digit overflow as an accepted
  residual (spec §3.1); it is out of scope here.
- **Record the test-scope widening in the file header.** ADR-014 §2 fenced fkit's test scope at "exactly
  two things"; ADR-017 rule 4 widened it to a third (a shipped skill's stdout contract).
  `test/dashboard-contract.test.js:3-7` documents its own widening in a header comment — follow that
  precedent exactly. This assertion is a **fourth** category: an invariant over the repo's own
  `ai-agents/` content rather than over product behavior. It is pre-authorized by ADR-029 Decision 3
  naming it, but it must be **stated in the header**, not smuggled in. Flag to the owner if you judge it
  needs an ADR amendment rather than a header note.

## Verification steps

- **`npm test` passes** — `node --test test/*.test.js` green, `bash test/prove-red.sh` green.
- **The guard is red-proved, and this is the load-bearing check.** Feed the extracted function a
  fixture list containing a deliberate duplicate and assert it **reports** that duplicate. A guard that
  has only ever seen a clean corpus has not been tested — the doctrine `test/prove-red.sh:4-8` exists to
  enforce. *(No `prove-red.sh` change is expected: that script mutates product code via `FKIT_LAUNCHER`
  / `FKIT_SKILL_OWNERSHIP_HOOK`, and this invariant has no product-code seam to mutate. The fixture
  duplicate **is** the red proof. If you conclude `prove-red.sh` should also be extended, raise it
  rather than doing it silently — that is a separate scope.)*
- **The live corpus passes today.** Independently confirmed 2026-07-20 that
  `grep -rhA1 '^## ID' ai-agents/tasks/{backlog,done,cancelled}/ | grep -oE '^[0-9]{4}' | LC_ALL=C sort | uniq -d`
  returns empty over **101** IDs, contiguous `0001`–`0101`, against 101 briefs. The new test must
  agree — and must **derive** both counts rather than hardcoding them; every count written into a brief
  in this project so far has gone stale before the task ran.
- **The scan is not vacuous.** Temporarily point the discovery at an empty directory and confirm the
  test goes **red** on the non-zero-count assertion, not green. This is the failure mode that would let
  the guard survive task 76 while guarding nothing.
- **Both layouts discover the same corpus.** Against a fixture tree in the *post-76* shape
  (`<board>/<NNNN>-<slug>/brief.md`), the discovery finds the briefs. This is what stops task 76 from
  silently disabling the guard.
- **No repo writes.** `git status` is clean after the run. `test/harness.mjs:9` states the suite's
  standing rule: *"Nothing here writes into the repo: every project lives under os.tmpdir()."* This test
  **reads** the repo — a first — so it must be conspicuously read-only.

## Notes

- **Owner: fkit-coder** — a test-only change under `test/`; no product code, no skill edits, no brief
  edits.
- **🔒 Scope limit — deliberate. One assertion, not three.** Spec §10's other two new assertions
  (`id-mismatch` drift; malformed folder without `brief.md`) are **out of scope** and belong with task
  76, which creates the structure they assert against and implements the `id-mismatch` drift kind in
  `dashboard.sh` (ADR-029 Decision 5). *(Both had been dropped from every brief alongside this one;
  task 76's brief was amended to carry them on 2026-07-20, owner-approved. The gap is closed — do not
  scope them here.)*
- **This test guards allocation; it does not perform it.** The allocation procedure lives in
  `claude/skills/fkit-task-brief/SKILL.md` step 6. Do not duplicate its logic here — in particular, do
  not reimplement the `10#` base-10 forcing or the per-brief increment. This test answers one question:
  *are the IDs in the tree unique?*
- **⚠️ Sequencing — owner-ruled 2026-07-20: this lands BEFORE task 76.** The migration is the single
  largest merge in the project's history and exactly the long-lived branch the cross-branch race needs.
  Guarding 101 live IDs before that merge is cheap; renumbering after it is the **permanent,
  unrecoverable failure the whole ID scheme exists to prevent**. Ruled after the producer raised it as
  an open question; pulled from the Backlog board into Sprint 2 on the same ruling.
- **⚠️ Priority `85` is append rank, NOT run order — do not read the number as the schedule.** Added
  out of band after the sprint was ranked, so it took the next free number per `fkit-task-brief` step 5
  (*"append after the existing highest priority; do not renumber or insert into the owner's
  ranking"*). **The tail was deliberately not renumbered.** The board's own established convention
  carries real order: row 77 holds priority 77 while its note reads *"its baseline-capture step must
  run BEFORE 76"*; row 81 at priority 81 reads *"recommend landing before 76"*; row 80 was *"pulled
  forward out of task 78"*. Run order lives in the note and the dependency line — the Priority cell is
  rank only (ADR-029 Decision 6: identity is the ID, priority is board rank).
- **Blocks task 76 as a scheduling gate, not a technical one.** 76 would build, test and ship without
  this guard — nothing in the migration reads it. The gate exists because the guard's *value* is
  entirely pre-merge. Recorded on **both** sides (here and in 76's Notes) so it cannot quietly
  evaporate under schedule pressure, which is exactly what an unrecorded preference does.
- **Evidence sources:**
  `ai-agents/knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md`
  (Decision 3 — the race and the named mitigation; Decision 5 — `id-mismatch`; §Consequences — the
  residual; §Re-raise only if — what a real duplicate would justify reopening).
  `ai-agents/knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md`
  (§3.3 the race and the options table; §10 *New assertions to add*).
  `ai-agents/reviews/assign-global-task-ids-and-create-registry.md` (finding R3; the *Accepted
  residuals* entry that scopes it as unbuilt-not-re-raised).
  `test/dashboard-contract.test.js:3-7` (the test-scope-widening header precedent).
  `test/harness.mjs:9` (the no-repo-writes rule). `test/prove-red.sh:4-8` (the red-proof doctrine).
