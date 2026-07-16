# Wiki sync after the `/fkit-status` output-variant removal

## Sprint
Sprint 2

## Priority
45

## Status
🔲 Backlog

## Context

**Task 44 removes the `full` keyword and the delta default from `/fkit-status`.** Eight wiki pages
describe the behavior that task removes. Once 44 lands, the vault is wrong — and it is wrong *with the
authority of "verified knowledge"*, which is worse than a stale doc.

**Only the `fkit-wiki` agent may write `ai-agents/wiki-vault/`.** Neither the producer nor the coder can
do this as part of task 44, which is why it is its own task rather than a step in that one.

**Sequencing is the point** — the same lesson as task 11 (wiki sync post-Omnigent): *"syncing before the
docs are rewritten just ingests the drift into the vault — and then it's wrong in two places."*

## What to build

Run a **delta sync** of `ai-agents/wiki-vault/` against the post-task-44 reality. The eight pages
carrying `full` / full-board references (from a 2026-07-16 sweep — **re-derive rather than trust this
list**, it will have moved):

- `wiki-vault/index.md`
- `wiki-vault/wiki/tasks/add-full-board-switch-to-fkit-status.md`
- `wiki-vault/wiki/tasks/add-status-skill-to-producer.md`
- `wiki-vault/wiki/tasks/sprint-2-remove-omnigent.md`
- `wiki-vault/wiki/tasks/design-deterministic-dashboard-for-fkit-status.md`
- `wiki-vault/wiki/tasks/reconcile-skill-ownership-source-of-truth.md`
- `wiki-vault/wiki/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md`
- `wiki-vault/wiki/systems/role-locked-sessions.md`

**The judgment call this task exists to make — page by page, not in bulk:**

- **Pages describing `/fkit-status`'s *current* behavior** must be corrected: one output, full board
  every call, sprint-name argument only.
- **Pages that are a *record of a past task*** (e.g. the task-38 page) describe something that **was
  true and was then reverted**. Do not delete the history — **mark it reverted and point at task 44.**
  A wiki page that silently forgets a shipped-then-reverted feature is how the next person re-proposes
  it.
- **ADR-017's page** is about the exec bit, not the keyword — its `full` reference is likely incidental.
  **Check before touching**; an ADR record is not a behavior doc.

## Verification steps

- **Grep the vault for `full` / `all` / `board` as a `/fkit-status` keyword and for the delta default** —
  zero hits presenting either as current behavior.
- **The task-38 page still exists and is discoverable**, marked reverted with a pointer to task 44 — not
  deleted, not silently rewritten to pretend it never shipped.
- **`index.md` reflects any page whose summary line changed.**
- **A lint pass is clean** — no dangling links from the edits.

## Notes

- **Owner: fkit-wiki** — the exclusive write gateway for `ai-agents/wiki-vault/` (ADR-005).
- **Depends on: task 44 — hard.** Syncing first ingests the drift. **Do not start before 44 lands.**
- **Risk: low**, and contained to the vault. No product code.
- **Numbered 45 per append-don't-renumber.** Owner to confirm the ranking.
</content>
</invoke>
