# Give the Codex adversarial prompt a task-keyed path — two concurrent reviews silently shared one file

**Source**: `ai-agents/tasks/done/0385-give-the-codex-adversarial-prompt-a-task-keyed-path/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 12 · `P2` · task `0385` · owner `fkit-coder` · built 2026-10-15

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). `plan.md`, `worklog.md`, `review.md`, `plan-review.md` read as evidence; trial log `ai-agents/knowledge-base/reports/2026-10-20-plan-review-trial-0385.md`.

## Goal
Every review wrote its Codex prompt to one fixed file, `.fkit/tmp/adversarial-prompt.md`, so two reviews running at once could silently overwrite each other's prompt. Give each run its own path.

## Key Changes
*(from the worklog; plan approved with PQ1–PQ3 adopted, PQ4 = no change)*
- **Two path shapes, each with a run id:** the stateful review uses `<key>-r<N>-<run-id>` (PQ1); the one-shot review and the adversarial skill use a task label plus run id (`<NNNN>-plan` for a plan), with the label sanitised (PQ2). Each skill prints the path and tells the agent to use it verbatim.
- **Files:** `claude/skills/fkit-review/SKILL.md`, `fkit-stateful-review/SKILL.md`, `fkit-adversarial-review/SKILL.md`, `claude/agents/fkit-adversarial-reviewer.md` (*"a per-run prompt file under `.fkit/tmp/`"*), `claude/README.md`, `CHANGELOG.md`.
- **`test/adversarial-prompt-path.test.js`** — a new guard test on the skills' wording. ⚠️ **Deleted by `0529` five days later** (category 4, prompt wording, under [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]]).

## Outcome
- **Flagged, not edited by this task:** `architecture.md`'s review / Codex run descriptions, ADR-016 and ADR-042 (stale; owner = architect — open backlog `0518` covers the old path in those three); this vault's `systems/fkit` and `systems/review-and-model-diversity` (updated by this sync); open briefs `0273`, `0287`, `0138`, `0169` whose line cites moved (open `0517` re-anchors cites in four open briefs).

## Related
- [[systems/review-and-model-diversity]] — the adversarial pass whose prompt path this changes
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — still names the old path as a dated record
- [[tasks/sprint-12-set-a-nine-backlog-tasks-goal-not-set]] — the board
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`, closing one-way links):* [[systems/fkit]]
