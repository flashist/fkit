# Make a later-sprint blocker visible — the board flags it, the loop says it, filing warns, questions name the knock-on (`0492`–`0495`)

**Source**: `ai-agents/tasks/done/0492-flag-a-sprint-task-that-hard-depends-on-an-open-later-sprint-task-as-a-dashboard-drift-record/brief.md`; also `done/0493-make-the-sprint-ship-loop-say-when-a-waiting-task-waits-on-a-later-sprint/brief.md`, `done/0494-warn-when-filing-or-re-pointing-puts-a-blocker-in-a-later-sprint-than-its-dependents/brief.md`, `done/0495-make-every-sprint-placement-question-state-which-tasks-would-then-wait-on-that-sprint/brief.md`
**Status**: done — all four `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P12`–`P15` (the owner's own placement, *"at the end"*) · owner `fkit-coder` for all four

## Goal
**The incident (2026-10-05, reported by a consuming project's lead — geoconflict):** a Sprint-7 task's hard
`Depends on:` was re-pointed at a new *verify* task filed into Sprint 8, on an owner ruling for an option the lead
had marked "(Recommended)" — and **the question never said** that the task and **5 tasks behind it** would then
wait on Sprint 8. Result: 6 of the sprint's 8 open rows depended on a later sprint. **No fkit tool flagged it:**
`dashboard.sh` emitted no `drift` record and the sprint loop's deadlock stop said only "waiting". The owner found
it by hand.

**The real defect — and what it is not.** Several sprints may be in progress at once (ADR-047) and open rows carry
forward, so it is not a hard lock. The defect is that **the board claims sprint-N work that cannot be done in
sprint N, and nothing says so.** That project also had an owner rule *split build and verify; put the verify task
at the top of the next sprint* — so ⛔ **the fix makes it visible and never forbids it.**

Owner rulings, 2026-10-05, in fkit's own `fkit-lead` session (⚠️ the lead's relay): scope **(a) "Board flags
it"**, **(b) "Warn when filing"**, **(c) "Say the knock-on in questions"** (two other options not chosen);
*"Let the producer split"*; *"Sprint 10, at the end"*. Later the same day the owner chose *"Keep it"* for `0493`,
which sat close to an option he had not chosen.

## Key Changes
- **`0492` — (a) the board flags it.** `dashboard.sh` emits a new record,
  `drift depends-on-later-sprint <task> blocker="…" blocker_sprint="…" reason="…" [via="…"]`, for an open row on a
  real sprint board whose hard dependency is open and sits on a later or not-started sprint or the Backlog board;
  it joins the roll-up's drift clause and `/fkit-status`'s drift grammar as an **owner decision in beat 6**. Plan
  rulings (as relayed): *"Planner's rule"* for what "later" means (sprint numbers are not chronological — Sprint 11
  closed before Sprint 10 opened; the plan differs from the producer's recommendation in one case — both sprints
  not started with a lower-numbered blocker is **not** flagged); *"Flag them all"* — indirect dependents on the
  same board too, each naming its next step in a `via=` field; every ID on
  the line is hard unless marked soft; an unreadable line stays a **loud** finding, never "no dependency".
  13 new contract tests.
- **`0493` — the sprint loop says it**, at run start and at the dependency-deadlock stop: which tasks wait on which
  task in which later sprint. It **reads the record, never re-derives it**.
- **`0494` — (b) warn, never refuse,** in `/fkit-task-brief` and for any producer hand edit of a `Depends on:` line
  (`fkit-producer.md`): names the dependents, the blocker, both sprints, and three ways out (move the dependents,
  place the new task earlier, or accept and record why). In a session an `AskUserQuestion`; spawned, a
  `NEEDS-DECISION`. Reuses `0492`'s record.
- **`0495` — (c) a new convention page,
  `conventions/placement-questions-state-the-knock-on.md`**, dual-homed and **byte-identical** to its scaffold
  copy: every option that places a task or re-points a dependency says *"`<task>` and N tasks behind it would then
  wait on Sprint M"* — in the option's own description, the "(Recommended)" option included. Scope ruled
  2026-10-08, *"Always (Recommended)"* — **including same-sprint waits**. A spawned worker writes
  `knock-on: none (checked)` so a relayer can tell a checked zero from a forgotten one. ⛔ **Prose only — nothing
  checks a question's text mechanically.** Pointers sit in the lead, producer and coder prompts and three skills.

## Outcome
- Follow-ups filed on owner rulings: **`0501`** (document how `Depends on:` lines are read, in
  `dependency-declaration-form.md` — from `0494`'s Q2, *"Not now; follow-up brief (Recommended)"*). Open.
- ⚠️ Their full test runs were repeatedly turned red by `board-root`'s 20 s timeout under load — never by their
  own change — which became [[tasks/make-board-root-test-reliable-under-machine-load]] (`0502`).
- ⚠️ **Overlap, not ordering:** ADR-052 phase-5 tasks `0450`, `0451`, `0453`, `0457` rewrite the same files.
- The wiki had nothing on cross-sprint dependencies before this (a `/fkit-query` read at filing); this page is
  that record.

## Related
- [[tasks/sprint-10-the-0472-0482-batch]] — `P12`–`P15`, owner ruling R7
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]] — why it is not a hard lock, and the banner "later" reads
- [[systems/knowledge-base-structure]] — the new convention, the eleventh
- [[tasks/make-the-lead-hand-a-code-level-why-question-to-a-spawned-coder-instead-of-tracing-code-itself]] — `0498`, built on `0495`'s edit to `fkit-lead.md`
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — where `0501` was filed
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`, closing a one-way link):* [[systems/fkit]] — fkit
- *Added 2026-10-14 (sync `79a7dbf`→`baf6a4e`):* [[tasks/answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn]] — `0504`'s `asking-the-owner.md`, which keeps a placement option's knock-on in its description; and the trial log's rough (not controlled) comparison with `0495`
