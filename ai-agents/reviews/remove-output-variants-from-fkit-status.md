# Review — remove-output-variants-from-fkit-status

Task: `ai-agents/tasks/backlog/remove-output-variants-from-fkit-status.md`
File(s) under review: `claude/skills/fkit-status/SKILL.md`, `claude/skills/fkit-status/dashboard.sh` (`:25` comment only)
Status: **closed-out**

**Scope note.** The working tree also carries task 41 (`dashboard.sh` logic + `test/dashboard-contract.test.js`)
and a producer addendum to `ai-agents/sprints/sprint-2.md`. **Neither was reviewed here.** Task 41 is
closed out at `ai-agents/reviews/build-deterministic-dashboard-script-for-fkit-status.md`; its
residuals stand. This review covers only the task-44 site list.

**Verification coverage — read this before reading the verdict.** `npm test` (107/107 green) **proves
nothing about this change.** [ADR-017](../knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md)
rule 4 fences the suite to a shipped executable's *"(argv, project files) → (stdout, exit code)"*
contract. This change is skill **prose** — it has no stdout and is not an executable. The suite does
not cover it and **cannot**. The only real check is a live `fkit producer` session (owner's to run) —
**and see R2: it will produce a false failure until the deployed copy is refreshed.**

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | low  | `claude/skills/fkit-status/SKILL.md:278` | `**Short by default** — readable in under 30 seconds. Detail is available on request.` is the only surviving sentence in the file shaped like "terse default + a fuller thing on request" — the exact mental model task 44 removes — and it now sits ~18 lines from the new `:296` *"The skill has no switches and no modes."* **Pre-existing, unchanged by this diff, and does NOT gate the board** (disproven below). Doc-coherence residue only; disposition is the owner's. |
| R2 | 1     | med  | `.claude/skills/fkit-status/SKILL.md` (deployed copy) | **The live verification will falsely fail.** The gitignored, init-regenerated copy a real session actually reads is **stale**: it still carries `### 5. On a repeat status in the same session, report the delta` (`:264`) and the reserved-keyword bullet. The coder correctly edited only the canonical `claude/` source, so this is **not a defect in the change** — but the brief's headline check ("run `/fkit-status` twice; the second call renders the complete board") will show the OLD delta behavior until `claude/fkit-claude-init.sh .` re-runs (`fkit-claude-init.sh:227`). A precondition, not a code fix. |

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
|    |         |                   |        |        |

## Accepted residuals (shared, do-not-re-litigate)

<!-- Added only once the owner approves treating a finding as a settled tradeoff. -->

- **The sprint-name argument survives** — What: `/fkit-status <sprint name>` remains; only the
  `full`/`all`/`board` output variant was removed. Why (structural): a sprint name selects a *subject*,
  not a rendering of one; `ai-agents/sprints/done/` is reachable by no other path, so removing it is an
  unrecoverable capability loss — the same failure shape as removing `full` while keeping the delta.
  The owner glossed their own "no additional arguments" rule and named only `full`. Re-raise only if:
  the owner rules that closed sprints should be unreachable from the skill, or another path to
  `sprints/done/` ships.
- **The denial paragraph is deliberate** — What: `SKILL.md:29-34` names `full`/`all`/`board` in order
  to state they are ordinary text that correctly fails with *"no sprint named `full`"*. Why
  (structural): the brief's own record ("if a future reader finds step 5 gone and assumes an
  oversight, this brief is the answer") lives in a task file a SKILL.md reader will never open. The
  paragraph puts the answer at the point of confusion and converts a silent behavior into a documented
  intent — which is what stops a well-meaning re-add. Cost accepted: a `grep full` on the skill returns
  2 hits, both in the denial. Re-raise only if: a future reader is observed re-adding the keyword
  *because of* the paragraph, i.e. the cost it was accepted to prevent actually materialises.
