# Archive Sprint 5 — move the plan into `sprints/done/` and repoint every link

**Source**: `ai-agents/tasks/done/0294-archive-sprint-5-move-the-plan-into-sprints-done-and-repoint-every-link/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-14
**Sprint/Tag**: Backlog board, unscheduled and **unranked** (owner-ruled) · task `0294` · owner `fkit-producer`

## Goal

**A banner flip is cosmetic; only the move changes behaviour.** Sprint 5's rows were all closed, but
its plan still sat at `ai-agents/sprints/sprint-5.md` — so `/fkit-status` kept resolving a finished
board as **the active sprint**, a live daily wrong answer rather than a latent docs defect. Owner
ruling 2026-08-13, verbatim option label ***"Move it — as its own scoped task"***: the owner chose a
scoped task over an inline fix **because the change is far larger than a banner edit looks**.

## Key Changes

**The board is archived at `ai-agents/sprints/done/sprint-5.md`** and no `sprint-5.md` remains at the
top of `ai-agents/sprints/` (re-verified this sync, 2026-08-14).

- **The banner reads exactly `## 🔒 CLOSED — 2026-08-13.`** — the date and nothing more. ⛔ **No
  `Superseded by …` clause**, on the owner's verbatim ruling ***"Omit the successor clause"***.
  ⚠️ **There is no Sprint 6 and none was opened.** The four archived precedents all name a successor
  because each was archived **at rollover**; ⛔ **this no-successor case establishes NO convention and
  must not be written up as one** — the owner said so when ruling.
- **The link surface was the real work.** Measured at filing: **57 relative links inside the file**
  across three shapes (`](../…)` ×39 on 38 lines, `](done/sprint-4.md)` ×6, `](backlog.md)` ×4, plus 8
  self-references that stay unchanged), and **53 files / 177 occurrences inbound** across the repo.
  ⚠️ **The naive one-shape rewrite breaks 10 links in the opposite direction from the ones a reviewer
  would think to check.** ⛔ The brief's own instruction was to **re-derive the counts at pickup, not
  trust either measurement** — two prior figures disagreed.
- **Board placement ruled and closed:** verbatim label ***"Leave unranked for now"***. The owner heard
  the `/fkit-status` urgency argument **and still chose unranked** — `backlog.md` is a flat board by
  design, and the row can be pulled whenever a sprint is next scoped. ⛔ Do not re-open it.

Executed 2026-08-14 by a spawned `fkit-producer`.

## Outcome

**⛔ There is no active board at all right now.** `bash claude/skills/fkit-status/dashboard.sh
select-active ai-agents/sprints` returns **`active none`** (re-run 2026-08-14, this sync); the only
candidate is `backlog.md`, whose identity is `Backlog`, and `Backlog` is **never eligible** under
ADR-041.

**Link integrity, measured this sync (2026-08-14):** ✅ **zero markdown links to the old path remain**
anywhere under `ai-agents/` — `grep -rnE "\]\([^)]*sprints/sprint-5\.md"` returns **0**. ⚠️ **54
bare-path prose mentions of `ai-agents/sprints/sprint-5.md` do remain**, in task briefs, plans,
worklogs and review ledgers. They are **dated records of where the file was when they were written**,
not link rot, and repointing them would make a past record claim something it never saw — the same
reasoning that keeps this vault's `log.md` append-only. **Reported, not fixed.**

⚠️ **Archiving verifies nothing.** All 17 of Sprint 5's rows closed `(agent-closed — not
owner-verified)`; **no human has checked any of them**, and this row is itself agent-closed.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board this archived, and the page that carried the pre-archival claims
- Referenced without a wiki-link, deliberately, so this page adds no back-link debt to pages this sync had no other reason to open: **ADR-041** (why `Backlog` is never eligible, so archiving leaves `active none`), **ADR-035** (the rank rule under which this row stayed unranked), task `0293` (which recorded this board as still active and already carries its own superseding note), and the **Backlog board** page (the flat board this row sat on)
