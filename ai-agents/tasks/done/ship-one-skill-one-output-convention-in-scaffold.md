# Ship the one-skill-one-output convention in the scaffold

## Sprint
Sprint 2

## Priority
48

## Status
✅ Done

## Context

**Task 47 recorded the "one skill, one output" convention — but only in this repo's live
knowledge-base.** The document exists at
[`conventions/one-skill-one-output.md`](../../knowledge-base/conventions/one-skill-one-output.md)
(this repo's dogfood `ai-agents/`), while the scaffold every consuming project receives —
`claude/scaffold/ai-agents/knowledge-base/conventions/` — ships only the three older entries
(`task-status-vocabulary.md`, `evidence-before-assertion.md`, `status-report-format.md`, plus the
`README.md` index). Task 47's write boundary was `ai-agents/knowledge-base/` only, correctly — the
scaffold is product source, which is why this is a separate coder task.

**Consequence today:** any project that installs fkit never receives the rule — its agents can write
a `full`-style output variant with no convention telling them not to.

**Delivery to existing projects is free once the scaffold has it:** the task-28 additive convergence
creates any scaffold path a project lacks, on every launch. A new file is a missing path — it arrives
on the next launch, no migration needed.

**Known limitation to state, not solve:** convergence cannot update the conventions `README.md`
*index* in **existing** projects — that file already exists there, and the invariant forbids touching
existing paths (the deliberately-accepted content-drift limitation, Sprint 2 addendum 25–28). Existing
projects get the convention file with an index that doesn't list it. Accepted; do not build around it.

**This is the fourth instance of the live-vs-scaffold gap** (after
`fix-scaffold-knowledge-base-folders`, `bake-architecture-pointer-into-scaffold-templates`,
`align-conventions-readme-enforcement-item-live-vs-scaffold`, all in `tasks/done/`). Task 49
investigates the recurring cause; **this task just closes this instance and does not wait for it.**

## What to build

- Copy `ai-agents/knowledge-base/conventions/one-skill-one-output.md` into
  `claude/scaffold/ai-agents/knowledge-base/conventions/one-skill-one-output.md`.
- Add its index row to `claude/scaffold/ai-agents/knowledge-base/conventions/README.md`, matching the
  live README's row for it (task 47 already added that row on the live side — mirror it, adjusting
  only if the scaffold README's format differs).
- **Check the copied document's relative links.** The live document links into `../../tasks/done/`,
  `../../tasks/backlog/`, and `../../sprints/` — paths that exist in this repo but whose *targets*
  (specific task briefs, sprint-2.md) do **not** exist in a consuming project. Follow whatever
  precedent the three already-shipped conventions set for repo-specific links (check how they handle
  it before deciding); if they set none, flag the question in the plan rather than inventing a policy.
- No other scaffold file changes.

## Verification steps

- `claude/scaffold/ai-agents/knowledge-base/conventions/` contains `one-skill-one-output.md` and the
  README indexes it.
- The scaffold copy's content matches the live copy (byte-identical, or with the link adjustments
  decided above — in which case the diff is exactly those links and nothing else).
- **Clean-init check:** run `claude/fkit-claude-init.sh` against a scratch directory; the resulting
  `ai-agents/knowledge-base/conventions/` contains all four entries and the README lists all four.
- **Convergence check:** run init against a scratch project that already has an `ai-agents/` tree
  *without* the new file; the file is created, the announcement names it, and the pre-existing
  `README.md` is untouched (the accepted limitation, observed rather than assumed).
- No file outside `claude/scaffold/` is modified.

## Notes

- **Owner: fkit-coder** — touches `claude/scaffold/` (product source).
- **Depends on: task 47 (met — the convention document exists in the live knowledge-base).**
- **Blocks: nothing. Not blocked by task 49** — the investigation addresses the recurring cause; this
  closes the current instance and should not wait.
- The wiki picks up the convention via a later sync (fkit-wiki's exclusive path) — out of scope here.
