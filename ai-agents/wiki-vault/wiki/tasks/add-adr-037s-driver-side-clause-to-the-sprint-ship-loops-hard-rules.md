# Add ADR-037's driver-side clause to the sprint-ship-loop's hard rules

**Source**: `ai-agents/tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-05
**Sprint/Tag**: Sprint 2 · ID `0191` · owner `fkit-coder`

## Goal
**Follow-up 2 of [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] §3/§4.** On the owner's **Q2 ruling of 2026-08-02, ADR-037 binds the driver as well as the worker** — the worker-side half alone leaves the driver **still free to issue the instruction that starts the collision**.

The live instance it governs: the 2026-07-27 merit-rank (ADR-037 **instance A**, adjudicated **FORBIDDEN as executed**) came from a driver instruction — *"rank on merit rather than append"* — relaying **no named owner ruling on placement**. It was **ad-hoc spawn-prompt text from a live lead session**, which is exactly what made it invisible to review. **This clause is the thing that would have stopped it at the driver rather than at the worker.**

## Key Changes
**One file, one hunk, additions only** — a new bullet in `claude/skills/fkit-sprint-ship-loop/SKILL.md`'s `## Hard rules`, using the plan's **Option A** block **verbatim** (owner-ruled at approval; Option B rejected, so **no wording judgment was exercised**). Five required elements, all present:

- **All three permitted forms, each as its own sub-bullet** — *name the ruling* · *get the ruling first* · *do not issue it*. Sub-bullets rather than run-in prose, because **a clause that gives only the first reads as a licence to relay**.
- **The defective-instruction sentence** — a bare directive into a rule's territory is a **defective instruction**, and the worker's conservative branch is **the correct response to it, not an obstruction**. Without this, a driver reads a worker's escalation as a failure to follow orders.
- **The no-parity honesty sentence, uncompressed.** The plan named trimming it as *"the single likeliest wording defect"*; **it was not trimmed.** This surface is **weaker** than the worker-side clause — it binds the driver only because the driver loads this file, and **it reaches no worker**.
- **`ADR-037` cited by name**, no `path:NNN` coordinate anywhere in the inserted lines.

**No budget constraint applied** — the rules-block byte ceiling that shaped `0190` does not reach a `SKILL.md`; this clause is priced only by the reader's attention.

## Outcome

### ⚠️ The clause is on disk and reaches NO driver — owner-ruled deferred
**`claude/fkit-claude-init.sh .` was NOT run.** The owner ruled at approval that the `.claude/` refresh is **not part of this build** and that the gap be **recorded rather than fixed**.

A live driver loads `.claude/skills/fkit-sprint-ship-loop/SKILL.md`, which is gitignored and refreshed only by that init script. **Until it is re-run the clause binds nobody — including the driver running at the time.** ADR-037 §4's justification for the asymmetry — *a `SKILL.md` the worker does not load **but which the driver itself does load*** — is therefore **not yet true in this repo**. Independently re-measured by [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] the next day: the runtime copy was **296 lines and did not contain the clause**.

**The same fact is what made the mid-run edit safe** — editing the canonical `claude/` copy cannot perturb an in-flight driver.

### The clause is usable, tested against instance A
Applied to the 2026-07-27 merit-rank: **form 1 was unavailable** — there was no owner ruling on placement to name, only approval to *file*. The clause leaves exactly two correct acts: **form 2, get the ruling first** (the lead held the owner channel and placement plainly mattered enough to instruct about) — the better fit — or **form 3, do not issue it**. **It decides the case cleanly, so it is usable rather than decorative.**

**Not hardened, by design.** ADR-037 §5 is explicit that this is unenforced prose and the named-ruling marker is forgeable; per the ADR's own *"trust, not proof — state it, do not harden it into a false guarantee"*, no enforcement was attempted.

### Verification, and what it does NOT prove
Additions-only across a single hunk — **direct proof the other nine bullets are byte-unchanged**. `npm test` green, **all 14 `prove-red.sh` mutations red at their named assertions**. ⚠️ **This is a REGRESSION CHECK ONLY.** The only test that opens this file reads its **frontmatter**, not its body, and the edit lands hundreds of lines below the frontmatter close — **no test in the suite can observe it either way.** The evidence the clause landed is the diff shape and the section re-read, never the green suite.

**Decision log: fixes applied without asking — `none`. Obvious-winner calls — `none`.** Recorded as `none` deliberately, **so an empty log is not mistaken for a forgotten one**: the wording was owner-ruled verbatim, the placement was specified, the `.claude/` question was owner-ruled deferred, and the anchor re-derivation found the file unshifted.

### Two accepted residuals
1. **The `§4` mis-attribution stays in the task record.** The shipped clause was corrected to `ADR-037 §3`, but **`brief.md`, `plan.md` and `worklog.md` keep the original `§4`**. `plan.md` is the **owner-approved artifact whose `git hash-object` the Build worker carried** — editing it would break the one pointer tying the build to the approval, and re-authoring it is forbidden outright. **Known consequence, stated rather than hidden:** the worklog's *"cited by name, twice (§3 and §4)"* is now **stale with respect to the shipped bytes**.
2. ***"Exactly one of three is permitted"* keeps its false exclusivity.** ADR-037 §3 says *"Concretely, one of three"* and does **not** make them exclusive — form 2 is genuinely non-terminal, since once the ruling exists the driver must still **name** it, which is form 1. The wording is **owner-ruled verbatim**, and rewording it post-hoc would substitute coder judgment for an owner ruling on the exact axis the owner ruled. **The harm points away from the failure the brief feared:** the over-strict reading cuts against **form 2**, so it cannot create a licence to relay.

## Related
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — §3, the driver-side ruling this lands, and §4's recorded asymmetry
- [[tasks/add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block]] — task `0190`, the worker-side half. **Shipping this does not discharge it**, and the ADR's asymmetry is the reason
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — task `0158` → ADR-037; instance A began at a driver instruction
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — instance A's other axis: the same act, forbidden on rank arithmetic
- [[tasks/build-fkit-sprint-ship-loop-skill]] — task `0111`, the skill this clause is added to
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the loop's consent model and the declared-approval marker
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200`, which **independently measured this clause's zero reach** and found its *"will run"* reading contested
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — task `0160`, the no-naked-`:NNN` policy this clause follows
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the decision-log obligation this task discharged with an explicit `none`
- [[systems/testing-and-verification]] — why a green suite proves nothing here: **no test reads a `SKILL.md` body**
- [[systems/role-locked-sessions]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[tasks/amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction]] — task `0203`, the second of three concurrent edits to the same `SKILL.md` in this run; its hunk sits in the honor-the-ADRs block, well clear of `## Hard rules`
- [[tasks/add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop]] — task `0208`, the third — which **separated all three deltas by hunk position cross-checked against content**, and closed the arithmetic both ways
