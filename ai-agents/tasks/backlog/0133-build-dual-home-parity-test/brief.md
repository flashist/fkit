# Build `test/dual-home-parity.test.js` — mechanical enforcement of live/scaffold parity

## ID
0133

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

[ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
§Decision 2: build **`test/dual-home-parity.test.js`** under
[ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md) (`node --test`, zero
devDeps) asserting **every fkit-authored dual-homed file is byte-identical, with an explicit exception
list.** Marked *"(Two producer-scoped briefs, owner: fkit-coder.)"* alongside the reconciliation.

**Neither brief was ever filed.** ADR-027 was accepted 2026-07-19. A sweep on 2026-07-25 confirmed
`test/dual-home-parity.test.js` **does not exist** — `test/` holds thirteen files and none is a parity
test; `grep -rn "parity" test/` returns nothing.

### ⚠️ Two shipped briefs already claim to verify against this test

This is the part that matters most, and it is why the task is worth more than its size suggests:

| Task | Its verification step | Reality |
|---|---|---|
| **0112** (`✅ Done (agent-closed — not owner-verified)`) | step 4: *"The ADR-027 dual-home parity test passes (live vs scaffold)."* | The test does not exist. The step was unrunnable. |
| **0124** (`🔲 Backlog`, priority 107) | step 4, same wording | Same. **Corrected in that brief on 2026-07-25.** |

**0112 shipped and closed with a verification step that could not have been run.** It was agent-closed
and never owner-verified, so no human confirmed the claim either. **This task does not fix 0112** — see
the flag in Notes; reopening it is the owner's call, not this brief's.

**The drift this was supposed to catch has already recurred.** ADR-027 recorded four prior instances;
task 0132 documents a fifth (`dependency-declaration-form.md` missing from the scaffold, undetected for
however long). Every one of those is a bug this test would have turned into a red suite.

## What to build

1. **`test/dual-home-parity.test.js`** — `node --test`, **zero devDeps** (ADR-014). For every
   fkit-authored file in the dual-homed surface, assert the live copy under `ai-agents/` and the scaffold
   copy under `claude/scaffold/ai-agents/` are **byte-identical**.
2. **Assert in both directions.** A file present in one home and absent from the other must fail —
   that is precisely the `dependency-declaration-form.md` case, and a naive "for each scaffold file,
   compare to live" loop **would not have caught it**. Iterate the union of both trees, not either one.
3. **Read the exception list produced by 0132** rather than re-deriving it. Each exception is a path
   **plus its reason**; a path with no reason should fail the test's own sanity check, so the list
   cannot silently grow into a hole. Known entries: `conventions/dual-home-parity.md`,
   `conventions/README.md`, `PROJECT.md`, `wiki-vault/index.md`, `wiki-vault/log.md`.
4. **Fail loudly and actionably** — the assertion message names the path, which home it is missing from
   or how the two differ, and points at `conventions/dual-home-parity.md`. A parity failure with a bare
   `assert.equal` diff of two long markdown files is a test people learn to skip.
5. **Wire it into the suite** the way ADR-014 wires the other twelve tests, so it runs by default.

## Verification steps

1. `test/dual-home-parity.test.js` exists and runs under `node --test` with no devDeps added.
2. **Prove it red before proving it green** (the `test/prove-red.sh` discipline): delete the scaffold copy
   of a known dual-homed file → suite fails naming that path; restore → suite passes.
3. **Prove the reverse direction red:** add a file to the scaffold with no live counterpart → suite
   fails.
4. **Prove byte-drift red:** change one character in one copy → suite fails.
5. Every path on 0132's exception list is skipped, and an exception entry with no stated reason fails the
   test's sanity check.
6. With 0132's reconciliation landed, the suite is **green on the real tree** — no leftover drift.
7. The full existing suite stays green.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** 0132. ADR-027 §Decision 3 makes this binding — reconciliation precedes the test, or the
  suite is red on day one and nobody can act on it.
- **Blocks:** nothing.
- **Filed 2026-07-25** from a producer sweep of ADR-027's follow-ups. Siblings: 0131 (scoping check),
  0132 (reconciliation).
- **✅ Owner ruled 2026-07-25 on task 0112 — and this task carries the ruling.** 0112 is `✅ Done
  (agent-closed — not owner-verified)` with a verification step (*"the ADR-027 dual-home parity test
  passes"*) that was unrunnable when claimed. **The owner chose: re-verify by hand once 0133 lands.**
  0112 stays closed for now; it is **not** reopened, and it is **not** left unchecked either.
  **Therefore this brief has one extra deliverable, and it is not optional:**
  - After the test is green on the real tree, **run it specifically against the files 0112 touched** —
    `skills-for-role.sh:37` and the four mirrors from its `:12-24` checklist — and **report the result to
    the owner explicitly**, pass or fail.
  - **If it passes:** say so plainly; 0112's substance was fine and only its verification wording was
    phantom. Nothing further.
  - **If it fails:** do **not** silently fix it under this task. Report it and let the producer scope the
    repair — a 0112 defect is its own task, not a rider on the test that found it.
  - ⚠️ **This step is easy to drop** because it happens after the satisfying part (green suite) is done.
    It is the reason the owner accepted leaving 0112 closed. Dropping it converts an accepted risk into
    an unexamined one.
- **This test does not make parity a guarantee at the point of writing** — it catches drift at test time,
  after the edit. 0131's scoping check is the earlier, cheaper catch. ADR-027 wanted both, and neither
  replaces the other.
- No commit — leave the new test in the working tree.
