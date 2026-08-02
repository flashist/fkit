# Build `test/dual-home-parity.test.js` — mechanical enforcement of live/scaffold parity

**Source**: `ai-agents/tasks/done/0133-build-dual-home-parity-test/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-02
**Sprint/Tag**: Sprint 2 · ID 0133 · owner fkit-coder

## Goal
Build the parity test [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] §Decision 2 called for: under ADR-014 (`node --test`, **zero devDeps**), assert every fkit-authored dual-homed file is byte-identical, reading task `0132`'s exception list rather than re-deriving it. **Iterate the union of both trees** — a naive *"for each scaffold file, compare to live"* loop would not have caught the missing-from-scaffold case that motivated the work.

⚠️ **The task's real weight was a phantom verification, not its size.** Two shipped briefs already claimed to verify against this test:

| Task | Its verification step | Reality |
|---|---|---|
| **`0112`** (agent-closed) | *"The ADR-027 dual-home parity test passes"* | **The test did not exist. The step was unrunnable.** |
| **`0124`** | Same wording | Same — **corrected in that brief** 2026-07-25 |

`0112` **shipped and closed with a verification step that could not have been run**, and being agent-closed, no human confirmed the claim either. The owner ruled 2026-07-25: **re-verify `0112` by hand once `0133` lands** — it stays closed, but is not left unchecked.

## Key Changes
The test ships with a **four-guard** structure, all proved red before green via `test/prove-red.sh`: missing-from-scaffold, missing-from-live, byte-drift, and a **tripwire** guarding the exception list itself.

**The tripwire is finding R1, handed over by `0132`:** its 10 **directory** exception entries match **bidirectionally**, so a real dual-homed file later added under one would silently escape enforcement. The added assertion: **no directory exception may cover a non-`.gitkeep` file present in both homes** — with the `.gitkeep` carve-out **required, not cosmetic** (9 such files sit in both homes today and would otherwise fire it immediately).

**Round 2 of review found the sharper defect, and it was reproduced before it was fixed.** R8: adding `if (promoted.has(p)) continue;` to the comparison loop left **all nine tests green** — so the tripwire message's promise that *"the two copies were compared above"* was pinning nothing, **the same species of defect R1 was**. The new pin was then **falsified rather than trusted**: with the byte-comparison voided the assertion reds (8 pass / 1 fail). *An unpinned promise was not replaced by an unpinned test.*

## Outcome
`node --test test/*.test.js` → **560 tests / 17 suites / 560 pass / 0 fail**. `prove-red.sh`: mutations 1–13 red at their named assertions, hard gate PASSED. **Disarm proof across six variants — all six shout `MUTATION WAS A NO-OP` and fail the gate.**

Ledger **CLOSED 2026-08-02**, final verdict **✅ approved**, with accepted residuals **R3 · R4 · R6 · R11**, each carrying a falsifiable *re-raise only if*. R11's entry records the **severity dissent** (Codex medium vs reviewer LOW; owner took LOW) so the residual does not hide the disagreement it was accepted over.

⚠️ **Two honest disclosures the run made against itself:**
- **Two disarm variants did not fire on the first attempt, and the cause was the harness, not the guards.** A `sed` pattern in a scratch harness silently matched nothing, so the disarm was never applied — which reads exactly like *"the guards are dead"*. Caught by **diffing the patched script against the original instead of trusting the exit code.**
- **One edit outside the three named findings.** R9's wrong example appeared twice; both were fixed, because leaving a known-false statement in the file most likely to be read next, in the round that corrected it elsewhere, repeats the defect.

⚠️ **The `0112` re-verification is NOT retired by this task, and can never be discharged this way.** `0112`'s write surface lives under `claude/`, so its **intersection with the parity surface is empty** — permanently, since that surface will never be dual-homed. **`0133` was right to refuse to report a pass**; reporting one would have laundered an unrunnable step into a runnable-looking green — *the same failure `0112`'s close already committed once*. A substitute check (`lead` ↔ `sprint-ship-loop` across the source of truth and its four mirrors) **passed 5/5**, but that is a signal, not a discharge. Filed as producer task `0187`, **open**.

**Scope honesty:** this test catches drift **at test time, after the edit**. Task `0131`'s scoping check is the earlier, cheaper catch, and ADR-027 wanted both.

## Related
- [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] — task `0132`, the hard dependency that had to land first, and the source of finding R1
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the ADR whose §Decision 2 this builds
- [[decisions/adr-014-how-fkit-tests-itself]] — `node --test`, zero devDeps, and the prove-red discipline this exercised hardest
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] — task `0112`, whose phantom verification step this task was told to settle **and proved undischargeable**
- [[tasks/revert-task-movers-to-producer-only]] — task `0124`, which carried the same phantom wording and corrected it
- [[tasks/disambiguate-the-frozen-history-clause]] — task `0161`, which had to check dual-home parity **by hand** because this test had not landed
- [[systems/testing-and-verification]] · [[systems/knowledge-base-structure]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
