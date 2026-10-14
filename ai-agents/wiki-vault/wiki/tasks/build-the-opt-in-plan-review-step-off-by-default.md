# Build the opt-in plan-review step (off by default)

**Source**: `ai-agents/tasks/done/0473-build-the-opt-in-plan-review-step-off-by-default/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P9` · task `0473` · owner `fkit-coder` · blocks `0474` (the trial, still open)

## Goal
The owner, 2026-10-01: have the plan approved by other agents (producer **and** architect for a product change,
architect for code-only), then *"given to Codex for the final review"* — but *"I'm a bit worried that this can
make the whole process more complicated. So we need to test it first … the old approach should be our "by
default" one."* Rulings: unclear → *"Ask both"* (2026-10-01); the rule must be **generic, not fkit-specific**
(Q1, 2026-10-02, his own words); the trial runs through his own sprint-loop runs, not picked tasks (Q2) — so the
switch works **per sprint-loop run**.

⛔ **Default unchanged, owner approves last:** the plan gate stays the one guaranteed human checkpoint (ADR-019,
ADR-032); nothing about it may be removed or weakened.

## Key Changes
- **Recorded first, via the architect, after plan approval and before Build:**
  [[decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default]]. Owner plan approval 2026-10-06:
  *"Approve, with §7 fix (Recommended)"*; Q1 *"Sprint-loop runs only (Recommended)"* (no per-task brief field);
  Q2 *"Plan unchanged + coder check (Recommended)"*; Q3 *"Only when it's on (Recommended)"*.
- **`/fkit-sprint-ship-loop … --plan-review`** (default off): one gated section in `fkit-plan-task`, a matching
  gated block in the sprint loop (`<!-- plan-review:begin -->`); the coder classifies, consults approvers at hop
  2, max 2 revision rounds, owner settles a leftover disagreement, then `@fkit-adversarial-reviewer` attacks the
  agreed plan (it now accepts a pasted plan, not only a diff). The lead passes the flag only when asked.
- **A new driver-written `<task-folder>/plan-review.md`**, added to the task-folder reserved names in
  `ai-agents/tasks/README.md` (and the `ai-agents/README.md` row).
- Role prompts: producer and architect answer a plan-approval consult in an `APPROVE` / `CHANGES REQUESTED`
  shape; `test/plan-review-switch.test.js` (8 arms + 6 controls) pins the text and that the off path is untouched.

## Outcome
- **Paper walk-through against the canonical text** (off; on + code-only; on + product / unclear; a forced
  round-2 disagreement; Codex unavailable; switch via the lead; hops / ADR-018) all ✔, plus a **live hop-2 smoke
  test**: a hop-1 coder spawned the architect and adversarial reviewer in parallel on a toy plan, no hook denial.
  ⚠️ A walk-through and one smoke test are not a run of the real loop — that is what `0474` is for.
- Review finding **R2** produced a dated correction on ADR-056 Decision 5 (a "rejected-plan re-plan" path the
  loop does not have) and a matching skill fix.
- ⚠️ **Overlap, not ordering:** ADR-052 phase-5 tasks `0450`, `0451`, `0453`, `0457` rewrite the same files —
  whichever lands second carries the gated blocks forward.
- **The trial `0474` is owner-paced and open** on Sprint 10; making plan review the default needs a new owner
  ruling.
  > ⭐ *Dated note 2026-10-14 (sync `79a7dbf`→`baf6a4e`):* the **first trial log** is
  > `reports/2026-10-11-plan-review-trial-0504.md` (task `0504`) — summarized on the ADR-056 page. `0474` is still open.

## Related
- [[decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default]] — the decision
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the plan gate, unchanged
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the per-task artifact set `plan-review.md` joins
- [[decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode]] — the Codex fallback flag that must reach the owner
- [[tasks/sprint-10-the-0472-0482-batch]] — `P9`; `0474` is `P10`
- [[systems/review-and-model-diversity]]
- *Added 2026-10-14 (sync `79a7dbf`→`baf6a4e`):* [[tasks/answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn]] — `0504`, the first real run of plan review
