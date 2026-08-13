# Implement ADR-040's identity grammar in `dashboard.sh` — both rungs and the `moved_target` companion

**Source**: `ai-agents/tasks/done/0264-implement-adr-040s-identity-grammar-in-dashboard-sh-both-rungs-and-the-moved-target-companion/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 5 P4 (append rank `P11`, promoted by the owner-ruled re-rank of 2026-08-11) · task `0264` · owner `fkit-coder`

## Goal

**The landed pattern Sprint 5's release gate tests.** Without it the board *decided* the downstream
defect and never *fixed* it — which is the scope hole the six implementation rows exist to close.

Rung 1 = the H1 **segment** rule; rung 2 = the closed `plan-` allowlist; rung 3 (`backlog` basename)
**UNCHANGED**.

## Key Changes

⚠️ **Plus the `moved_target` companion**, whose regex did not take the suffix. Without it,
`➡️ Moved to [Sprint 4c]` parses to `Sprint 4` and drift rule 2 fires **phantom drift on every moved
row**. It is **not** one of the three `PLAN_SPRINT` consumers but an independent parser of the same
vocabulary, and ADR-040 §6 binds it to **ship in the same change, not as a follow-up.**

**One implementation of the grammar, reused by every rung** — ADR-040's binding mitigation against the
two-grammars defect its own file documents.

Tests **T2–T9** (T1 is `0259`'s fixture — do not duplicate), with **T5 the binding
`unresolved-plan-sprint` regression guard: an implementation that drops T5 does not satisfy ADR-040.**

⛔ No `STATUS_HEADING_RE` change. ⛔ No change to the `backlog` basename special case. ⛔ No
`fkit-status/SKILL.md` edit. ⛔ **Do not add the downstream pre-release test to verification — it is
the release gate, cited not re-recorded.**

## Outcome

**Landed and verified on disk 2026-08-13.** `claude/skills/fkit-status/dashboard.sh` carries
`SPRINT_ID_RE` as the single grammar definition, `plan_sprint_from_h1()`, `plan_sprint_from_stem()`,
`resolve_identity()` — and the `moved_target` parser now built on **the same `SPRINT_ID_RE`**, with an
in-file comment naming ADR-040 §6 as binding. *The one-grammar mitigation is honored in the code, not
merely intended.*

⚠️ **A portability finding is recorded in the source itself:** the H1 splitter was implemented in
`awk` rather than `sed`, because a `sed` split **silently produces one un-split segment on a
consumer's Mac and works on Linux CI** — the failure mode that passes CI and breaks on the owner's
machine.

⚠️ **The review of this task overstated its own coverage.** Its ledger claimed *"coverage is not
partial"* while the same file recorded that Codex could not run the suite and that all execution
evidence was the Claude reviewer's — **self-contradictory in one file**. That is one of the three
cases that produced
[[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]]. Per ADR-034 the ledger
was **not edited**; whether it is corrected is an unfiled producer follow-up.

⚠️ Closed `(agent-closed — not owner-verified)`. Its `P11` append rank was **promoted to `P4` by the
owner-ruled re-rank of 2026-08-11** — every rank named inside its board cell is stale; **the Priority
column is the live rank.**

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — the decision implemented
- [[tasks/decide-the-plan-sprint-resolution-strategy]]
- [[tasks/add-the-red-fixture-a-product-prefixed-h1-on-a-plan-sprint-n-filename]] — the fixture this turned green (soft ordering, deliberately not a `Depends on`)
- [[tasks/implement-adr-041s-dashboard-half]] — the next link in the chain
- [[tasks/gloss-the-moved-to-sprint-n-row]] — the vocabulary gloss this change made necessary
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — its review ledger is one of the three cases
- [[systems/testing-and-verification]]
- [[systems/review-and-model-diversity]] — where its self-contradictory coverage claim is recorded as ADR-042 evidence
