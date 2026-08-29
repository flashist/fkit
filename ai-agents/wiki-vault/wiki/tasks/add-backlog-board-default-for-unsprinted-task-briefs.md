# Add a Backlog board — the default home for unsprinted task briefs

**Source**: `ai-agents/tasks/done/0001-add-backlog-board-default-for-unsprinted-task-briefs/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 67

## Goal
Give unsprinted work a **real board**. Before this, a brief written with no sprint named carried a board-less `## Sprint: Backlog (unsprinted)` field and had **no row anywhere** — it was invisible to every board-driven view. Five such briefs existed.

## Key Changes
- **`ai-agents/sprints/backlog.md`** — a persistent board using the same status-table format as the sprint plans (Status | Priority | Task | Brief), so `dashboard.sh` and the task movers parse it unchanged. **Five existing unsprinted briefs backfilled** as rows.
- **`claude/skills/fkit-task-brief/SKILL.md`** — the no-sprint path rewritten: file the brief with `## Sprint: Backlog`, add a row to `backlog.md` (create-if-absent), keep `## Priority: Unscheduled`.
- **The filename is load-bearing and deliberately outside the glob.** `/fkit-status` resolves the active sprint by globbing `sprint-*.md`; `backlog.md` does not match, and **that is the whole mechanism** by which the default status run ignores the backlog. The board file says so in a standing warning: *"Do not 'normalize' this name."* Naming it `sprint-backlog.md` would make every `/fkit-status` call report unscheduled work as the active sprint.
- **A designed exception to "never invent a sprint."** The task-brief skill's own rule gets an explicit, documented carve-out for the backlog board — stated in the skill text so it reads as design, not drift.
- **The board is unranked by design** — the Priority column reads `—`. A number here would be a commitment nobody made; needing a rank is the signal to pull the task into a sprint.

## Outcome
Done. Unsprinted work is now visible on a board for the first time. The **pull-into-a-sprint path is three mandatory edits**: add the row to the sprint plan, flip the backlog row to `➡️ Moved to [Sprint N] — priority M`, **and update the brief's own `## Sprint`**. The row is **not deleted** — a deleted row loses the pointer to where the work went. ⚠️ **Skipping the brief-side update leaves a permanent drifted row**: the drift rule compares the `Moved` target against the brief's `## Sprint`, and a drifted row always renders.

Mover compatibility was **verified, not assumed** — the movers already sweep `ai-agents/sprints/` recursively (task 22 lineage), so they find and flip `backlog.md` rows unchanged. A backlog task can therefore be completed or cancelled without ever joining a sprint.

✅ **A drift this page once recorded is now resolved** *(re-verified 2026-07-22)*: the `gate-read-side-symlink-hazard-in-init` brief (now `tasks/backlog/0045-gate-read-side-symlink-hazard-in-init/brief.md`) once had **no `## Status` section** and `dashboard.sh` flagged `brief-missing-status` against its row. The brief now carries a `## Status`, so the drift is gone — recorded here because the missing-field-shows-as-drift behaviour it illustrated is the real, durable point.

The read-side half — making `/fkit-status` report this board **only on request** — is [[tasks/report-backlog-board-in-fkit-status-on-request-only]] (task 68).

> ⚠️ **This board is now where Sprint 2's open work actually lives — 2026-08-06.** After `0210`'s 45-row reverse move and the 2026-08-04/05 ship-loop run, **Sprint 2 shows `1 backlog` while this board carries the overwhelming majority of open rows.** The **request-only** design that made this board invisible to a default `/fkit-status` call is unchanged and still correct — but its consequence has inverted: **a reader who runs only the default status call now sees almost none of the open work.** Recorded as a fact about the boards, not as a defect in either.
>
> **Fourteen rows were added in that run alone**, including both halves of the unfiled `0210` follow-ups (`0214`, `0215`), the `/fkit-wiki-update` sequencer pair (`0216`, `0217`), and **seven of the eight follow-ups [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] named** — deliberately **held for the owner and NOT filed** except the one he authorized. The rows arrive **unranked**, exactly as the board's design requires.

## Related
- [[tasks/report-backlog-board-in-fkit-status-on-request-only]] — task 68, the status read-side; depends on this board's format
- [[tasks/filter-fkit-status-board-to-open-tasks]] — task 65; its open-work filter applies to the backlog board too, with no special-casing
- [[tasks/rename-task-plan-skill-to-task-brief]] — the skill this task edits, under its current name
- [[tasks/add-task-plan-skill-to-producer]] — the skill's origin
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — task 22, the recursive `sprints/` sweep this board relies on
- [[tasks/record-one-skill-one-output-convention]] — the convention task 68's argument had to conform to
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[systems/knowledge-base-structure]]
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]]
- [[tasks/decide-whether-fkit-needs-a-tester-agent]] — a Backlog-board task whose ruling produced ADR-028; **its close does not move Sprint 2's count**
- [[tasks/wiki-sync-backlog-board-introduction]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/specify-and-support-the-reverse-move-sprint-to-backlog]] — `0210`, which specified the **reverse** move onto this board and made its unranked rule a mandatory edit
- [[tasks/sprint-2-remove-omnigent]] — the board whose open work now sits here: **`1 backlog` on Sprint 2 is not one task left**
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200`, whose eight named follow-ups were **held for the owner**; seven landed here unfiled-by-design, one (`0222`) took a Sprint 2 row
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — ⚠️ *Corrected 2026-08-14:* this read *"the active board since 2026-08-06"*. Sprint 3 was archived **2026-08-07**; `0181`/`0182` were pulled from here onto it by owner ruling, and the structure-check follow-ups (`0242`–`0249`) landed here. ⚠️ **There is no active board at all right now** — Sprint 5 was archived 2026-08-14 by task `0294`, and `dashboard.sh select-active ai-agents/sprints` returns `active none`, with **this** board (`Backlog`) the only candidate and never eligible
- [[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]] — task `0185`, the rollover: its own brief lived on this board unranked by design, and the 45 open Sprint 2 rows moved here
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — ⚠️ *Added 2026-08-13:* **this board's exclusion from the default status run changed MECHANISM, and got stronger.** It was *"the filename is outside the glob"*; it is now *"the identity is `Backlog`"* — so **renaming this file into any glob would no longer make it the active sprint.** ⛔ **Do not rename it anyway** — its href is written into every `➡️ Moved to [Backlog](backlog.md)` marker in the repo. ⚠️ **This board's own header prose was one of the seven sites ADR-041 falsified** (it called the glob *"the whole mechanism"*), corrected by [[tasks/correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism]] — ⚠️ **but the generator that writes that header into a fresh project has already emitted uncorrectable copies into every downstream repo that filed an unsprinted brief**
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board that carried seven of this board's release-hygiene rows away on 2026-08-10. ⚠️ **Their `➡️ Moved to [Sprint 5] — priority P<n>` rows here are deliberately NOT updated** — closed rows are never renumbered, so their destination ranks are **stale by design** and Sprint 5 is the live authority
- [[tasks/decide-whether-the-active-sprint-glob-widens]] — `0261`: the decision that ⛔ **ruled against renaming this board** and made its exclusion depend on **identity** rather than filename
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — ⚠️ *Added 2026-08-22:* the board 18 rows moved off this one onto. ⭐ It forced this board's forward-move rule to change: the `— priority M` suffix was **unconditional and therefore unsatisfiable** for an unranked destination, and gained an **unranked-forward clause** by owner ruling
- ⚠️ **SYNC 2026-08-29 — the board after Sprint 6 finished.** Re-measured from `ai-agents/sprints/backlog.md` this run: **130 rows read `🔲 Backlog`**, 43 carry a `➡️ Moved` marker, 17 read `✅ Done`. ⭐ **Sprint 6's 21 closes were not a net drawdown** — the run's own reviews filed **fifteen new briefs, `0337`–`0351`**, straight onto this board. They fall into four clusters, and ⭐ **every one of them is a follow-up somebody declined to absorb into the task that found it**:
  - **The init symlink family** — `0328`–`0330`, `0332`, `0334`–`0336`, from [[tasks/gate-symlink-escape-in-init-intake-write]]'s report-only audit and [[tasks/refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim]]'s round-2 findings. ⛔ **`0334` is the launcher fail-safe that DEREFERENCES**, which had no owning task at all until it was filed.
  - **The citation / self-locator chain** — `0326`, `0342`–`0344`, `0349`–`0351`, from [[tasks/repair-the-moved-folders-own-self-locators-in-task-done]] and [[tasks/remediate-the-dead-brief-paths-in-closed-review-ledger-headers]]. ⭐ `0326` is the **write-time** half neither of them could ship.
  - **The ADR-044 carry** — `0345`–`0348`, from [[tasks/decide-how-the-ship-loop-handles-a-non-coder-owned-task-row]]. ⭐ **`0347` exists to stop a future oracle grepping briefs for skill names** — the misroute shape ADR-044 measured at **8 of 13 producer-owned rows**.
  - **A new sprint-lifecycle arc** — `0337`–`0341`: explicit sprint statuses, *"current sprint(s)"* redefined as **every In-progress sprint**, a status rung in the selector, a status backfill onto every existing plan, and producer-only `/fkit-sprint-done` / `/fkit-sprint-cancelled` movers. ⚠️ **That arc is the direct answer to a condition this sync measured on disk: Sprint 6 is 21-of-21 closed and STILL returned as the active board**, because nothing archived it. **All five are open.**
