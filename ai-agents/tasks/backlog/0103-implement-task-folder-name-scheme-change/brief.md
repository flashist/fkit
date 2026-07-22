# Implement the task-folder-name scheme change from the approved design

## ID
0103

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

The implementation half of the owner's 2026-07-21 observation that a task carries two mismatched
numbers (sprint priority `78` vs folder-ID prefix `0099`). Task
[0102](../0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/brief.md) decides
**what** to change and records the ADR; this task executes it.

**This brief is deliberately thin, because its scope is not yet known.** Task 0102 might land on any of
several outcomes — remove the folder prefix, surface the ID in the sprint board instead, drop the
priority number, or a documentation-only fix — and each has a completely different implementation. **Do
not plan or start this task until 0102 is approved and (if it changes the scheme) its ADR is recorded.**
Reading the shape in before the design exists is exactly the investigation-first failure the process
guards against.

**What is already known, whatever 0102 decides:** if the outcome is *"remove the numeric prefix from
folder names,"* the implementation is a **second mass folder rename** touching the same surfaces the
task-76 migration built —
[`dashboard.sh`](../../../../claude/skills/fkit-status/dashboard.sh) (the `<NNNN>-<slug>` identity and
recovery key), **both task movers** (the folder-name grep token), and the `## ID` field becoming the
sole ID carrier. It is task 76 in reverse, and it inherits task 76's *"atomic — the tools and the
rename cannot ship separately"* property: the moment the folders lose their prefix, every tool that
resolves `<NNNN>-<slug>/brief.md` is looking at a path that no longer exists.

## What to build

**Defined by task 0102's approved design and ADR — implement exactly that, no more.** The brief will be
fleshed out from the design once it lands. The likely shape, *if* 0102 rules "remove the prefix":

- The task folders renamed to their prefix-free form (`git mv`, history preserved), across all three
  boards.
- `dashboard.sh` and both movers reworked to the new identity/recovery mechanism the ADR specifies.
- Every inbound link to `tasks/<board>/<NNNN>-<slug>/brief.md` re-pointed — the same link-repair
  surface tasks 77/78 handled, including the wiki vault (which, per the write-authority boundary, is a
  **separate fkit-wiki task** the design should call for, not this one).
- Whatever the ADR says becomes the ID's carrier once the folder name no longer holds it.

## Verification steps

**Provisional — the real acceptance criteria come from task 0102's design.** At minimum:

- The change matches task 0102's approved design and ADR exactly — no scope the design did not sanction.
- `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` exits 0, emits
  `⟦fkit-dashboard v1⟧`, and reports **no new drift** — in particular no `id-mismatch`,
  `missing-brief`, or `relocated` records introduced by the rename.
- Both movers move a task end-to-end under the new scheme on a scratch task.
- Every relative task link under `ai-agents/` (excluding `wiki-vault/`) resolves — checked
  mechanically, not by eye.
- `git log --follow` on a renamed brief still shows its pre-change history (`git mv`, not
  delete-and-create).
- The launcher-contract and dashboard-contract test suites pass.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 0102 — hard**, including the owner's approval of its recommendation and, if the
  scheme changes, the recorded amending/superseding ADR.
- **⚠️ This task may never run.** If 0102 recommends *keeping* the number (points 1–3 of its Context
  argue the prefix is more coupled than it looks), or a documentation-only fix, there is nothing here
  to implement and this brief should be **cancelled** by the owner. That is an expected outcome, not a
  failure.
- **If it does run and the outcome is a rename:** a review is strongly recommended — it is a second
  mass rename over the same tooling task 76 just churned, and task 76 itself is still unverified.
- **A wiki-vault link repair, if needed, is a separate fkit-coder-cannot-do-it task** — the coder may
  not write `ai-agents/wiki-vault/`. Task 0102's design should call for it explicitly, the way task 78
  followed task 76.
