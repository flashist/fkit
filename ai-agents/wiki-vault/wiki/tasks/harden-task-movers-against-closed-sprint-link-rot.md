# Stop the task movers rotting links in closed sprint plans

**Source**: `ai-agents/tasks/done/0050-harden-task-movers-against-closed-sprint-link-rot/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 22 (added out of band 2026-07-13)

## Goal
Fix the **recurrence**, not the symptom: stop `/fkit-task-done` and `/fkit-task-cancelled` breaking one more link in an older sprint plan on every carried-over completion.

## Key Changes
`/fkit-task-done` and `/fkit-task-cancelled` move a brief `backlog/` → `done/`/`cancelled/` and update the **active** sprint plan. They do **not** re-point inbound links in a **closed** sprint plan under `sprints/done/`.

**So every future completion of a carried-over task silently breaks one more link in that older plan.** Sprint 1 had 5 such tasks and 6 such links; **the count only grows.**

**The gap is precise, and narrower than it looks:** `fkit-task-done`'s step 4 **already greps `ai-agents/sprints/` recursively and finds these rows**. Step 5 simply has **no instruction for them**, because a `➡️ Moved` row has no status to flip. **The skill sees the reference and drops it.**

**Split from the one-off cleanup on purpose**, per the owner's independent-shippability rule — the cleanup (task 21) is shippable today; this is the process fix. **Landing only the cleanup buys nothing durable: the links rot again on the next carried-over completion.**

## Outcome
Done. *(The one-off repair of Sprint 1's 6 existing broken links — [[tasks/repair-broken-links-in-closed-sprint-plans]] — has also since landed, at `ai-agents/tasks/done/0076-repair-broken-links-in-closed-sprint-plans/brief.md`.)*

⚠️ **It was `🚧 Blocked` on an owner ruling**, not on another task, and the sprint plan still lists that ruling among its open questions: *do the movers repair inbound links repo-wide, or are closed sprint plans **immutable historical records** that may point at where a task was?*

**Producer's recommendation — re-point the href, never the prose.** A closed plan's *claims* are history and must stay frozen. But **a link is not a claim, it is a pointer — and a pointer to a file that isn't there is rot, not history.** *The tradeoff:* the movers would then **write into `sprints/done/`**, a directory the project currently treats as never-touched. If "closed" means *byte-frozen*, the honest alternative is to accept the broken links by design — but that requires a **permanent, unbounded `sprints/done/**` exclusion in any future link check**, permanently blinding it over a directory that only grows.

## Related
- [[tasks/task-cancelled-flips-brief-own-status-header]]
- [[tasks/task-done-flips-brief-own-status-header]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/add-task-plan-skill-to-producer]]
- [[systems/fkit]]
- [[tasks/repair-broken-links-in-closed-sprint-plans]]
- [[tasks/stop-agents-asserting-unchecked-repo-state]]
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the recursive `sprints/` sweep this task established is what lets the movers find backlog-board rows unchanged
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the movers are no longer owner-only
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task 81, the mover KB-sweep fix + ADR-number guard
- [[tasks/repair-task-links-outside-the-wiki-after-migration]] — task 77, the post-migration doc-link repair
