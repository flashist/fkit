# Investigate making fkit-wiki task completion visible to the board

**Source**: `ai-agents/tasks/done/0108-investigate-making-wiki-task-completion-visible-to-the-board/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0108 · priority 90 · owner `fkit-architect`

## Goal

Find a mechanism that lets a *finished* wiki task stop looking unfinished on the board — without quietly stepping around the gate that makes `Done` mover-only.

## Key Changes

`fkit-wiki` does real, completable work but records completion only in `wiki-vault/log.md`, and **no board tool reads `log.md`** — not `dashboard.sh`, not the movers, not `/fkit-status`.

**The evidence was concrete and not brief.** Task 80 ([[tasks/repair-stale-adr-029-stop-hook-links-in-the-vault]]) had its vault work complete on 2026-07-19; `log.md` said so plainly on 2026-07-21; the board still showed `🔄 In progress` through **seven `/fkit-status` runs** — a stuck marker for roughly a week. The six batched wiki-syncs had the same shape: done in the vault, `🔲 Backlog` on the board for days, discoverable only by the producer reading `log.md` by hand.

The investigation was required to weigh whether the **signal moves** or a **reader learns to see it**, who flips the status, whether `log.md`-as-unread-status-source is a general problem shared with [[tasks/teach-dashboard-to-resolve-notes-dependencies]], and honestly whether a code change is warranted at all or a convention suffices. Its binding constraint: **do not propose auto-closing** without confronting the anti-laundering gate head-on.

## Outcome

**Done, agent-closed** — report filed at `knowledge-base/reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md`.

**Its recommendation was overruled, and that is the important outcome.** The report recommended the **wiki self-close**. The owner ruled the opposite, and far more broadly:

> *"Nobody should be able to run the `fkit-task-done` skill except the producer agent. If needed, wiki can ask the producer to run it… Keep the wiki-agent wiki-only."*

That ruling became [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — reversing ADR-025 for **every** role, not just the wiki. The wiki's operative fix is therefore the opposite of self-closing: it **flags** *"task N ready to close"* and the producer runs the mover. This task is the trigger for the largest authority reversal since ADR-025.

**Do not re-raise** *"the wiki should self-close its own tasks"* — it was investigated, recommended, and declined.

## Related
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the ruling this triggered; supersedes this investigation's recommendation
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the grant being reversed
- [[tasks/repair-stale-adr-029-stop-hook-links-in-the-vault]] — task 80, the week-long stuck marker
- [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — the sibling filed in the same interview ("file both")
- [[tasks/wiki-sync-backlog-board-introduction]] · [[tasks/wiki-sync-dumb-down-skill]] — among the six batched syncs with the same shape
- [[systems/fkit]] · [[systems/knowledge-base-structure]]
- [[systems/role-locked-sessions]] — Role-Locked Sessions & the Skill Lockdown
- [[tasks/wiki-resync-eighth-role-after-source-docs-land]] — Wiki resync for the eighth role — after the source docs land
- [[tasks/wiki-skills-flag-ready-to-close]] — `0125`, the operative fix this investigation produced
- [[tasks/wiki-flag-carries-folder-id-and-brief-path]] — `0153`; this task's folder ID `0108` collided with `0125`'s board rank P108 in the very flag it produced
- [[tasks/the-2026-08-15-done-in-fact-wiki-closes]] — ⚠️ *Added 2026-08-22:* tasks `0206` and `0238`, the same failure again — ⛔ **a vault completion flag that nothing re-evaluates**, closed from outside the wiki role by a triage that disagreed with it
