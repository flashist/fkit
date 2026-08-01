# The wiki flag-don't-close convention — the three wiki SKILLs end by flagging "ready to close"

**Source**: `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0125` · owner `fkit-coder`

## Goal

Give the wiki role a **completion signal** now that it no longer holds the task movers.

This is the **operative fix** for [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] (`0108`) — the investigation that found a finished wiki task sat `🔄 In progress` on the board for **about a week**, because the wiki never surfaced completion anywhere a board-driven view could see it. [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] §2 ruled the wiki closes nothing; so the wiki must **flag**, and the producer closes.

## Key Changes

Prose edits to three files — `claude/skills/fkit-wiki-ingest/SKILL.md`, `claude/skills/fkit-wiki-lint/SKILL.md`, `claude/skills/fkit-wiki-sync/SKILL.md`:

- Each procedure ends its report with a uniform **"Task N's vault work is complete — ready to close"** line for every tracked task it completed.
- The wiki **invokes no mover and moves no task file.** It does not hold one any more.
- The ambiguous case has its own rule: when the vault work is only *part* of a larger task, or completeness is uncertain, flag **partial — not ready to close**, never close.

**Ownership note, which is the interesting part.** These are the *wiki's own* SKILL sources under `claude/skills/`, and a **coder** edits them. Per the task `0081` Part C ruling, *"the wiki's exclusivity is over the vault, not over its own skill source"*. The wiki role cannot edit its own procedures.

## Outcome

Done, **agent-closed — not owner-verified**. Landed alongside `0124`, which removed the movers from the wiki role — deliberately together, so the `0108` gap was not re-opened in the interval.

⚠️ **It shipped with a real defect, found by the role that consumes it.** The flag named its task as `Task N`, and **`N` was never defined anywhere in the block** — while every task in this project carries *two* small integers in adjacent columns of the same table. A spawned `fkit-producer` found it during this very task's close. Neither the coder, the reviewer, nor the Codex adversarial pass caught it across **five rounds of findings**. Fixed by [[tasks/wiki-flag-carries-folder-id-and-brief-path]] (`0153`).

⚠️ **A second defect outlived `0153`.** The corrected template hardcodes `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md` — so the flag **manufactures a dead path by construction**, since a `complete` flag says *ready to close* and the folder leaves `backlog/` almost immediately. Ruled in [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] (`0160`) §5.2.

## Related

- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — `0108`, the investigation this implements
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the ruling that made a flag necessary
- [[tasks/wiki-flag-carries-folder-id-and-brief-path]] — `0153`, the `Task N` fix
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, the hardcoded-`backlog/` finding
- [[tasks/revert-task-movers-to-producer-only]] — `0124`, landed with this
- [[systems/role-locked-sessions]]
