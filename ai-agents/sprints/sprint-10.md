# Sprint 10 — The 0472–0482 batch: steadier and faster checks, a correct `fkit update`, honest docs, opt-in plan review, and the owner-involvement record (Phase A only)

> ## 🔄 In progress — 2026-10-04. Opened on an owner ruling of 2026-10-04 relayed by `fkit-lead`; to be driven by `/fkit-sprint-ship-loop`. ⛔ `0482` is Phase A only — its Phase B is NOT approved.
>
> **Authority.** This board exists by **owner rulings given 2026-10-04 live in a `fkit lead` session**,
> relayed into a spawned `fkit-producer` that has **no owner channel**
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
> ⚠️ **The wording below is the lead's relay, not text verified as the owner's verbatim words.**
>
> | # | Ruling (as relayed by `fkit-lead`) | What it settled |
> |---|---|---|
> | R1 | *"Sprint goal = the recent batch 0472–0482 (the user-facing tasks filed on the Backlog board)"*; the owner wants the lead to drive it next with `/fkit-sprint-ship-loop` | This board, its ten rows, and its `🔄 In progress` banner |
> | R2 | *"0482 Phase B is NOT approved"* — its brief's rule (no implementation without the owner's explicit APPROVE) stands | `0482` is on this board for **Phase A only** — see *"⛔ `0482`"* below |
> | R3 | Update the six stale dependency lines (`0172`, `0394`, `0395`, `0396`, `0479`, `0481`) with a dated note | Not a board change — done on those briefs the same day |
> | R4 | **Renumber this sprint to `Sprint 10`** — given after the owner was told that `Sprint 10` was reserved by earlier rulings and what taking it would do | The number `10` (board first created as `sprint-12.md` the same day) — see *"⭐ The number `10` — chosen knowingly"* below |
> | R5 | Keep the existing `P1`–`P10` run order unchanged | The ranks below, now owner-confirmed |
| R6 | *"I want that"* — 2026-10-05, typed by the owner in the `fkit-lead` ship-loop session, in reply to the lead's suggestion to pull `0395` in so a push does not fail CI on timeout | `0395` added as row `P11` (append rank) — see *"➕ `0395`"* below |
> | R7 | Typed request, 2026-10-05, in the `fkit-lead` session: *"Ask geoconflict-lead agent about the situation … discuss … how to prevent this type of situations in the future, based on that create a task and add it to the current [sprint]."* Then via `AskUserQuestion`: scope = *"(a) Board flags it"*, *"(b) Warn when filing"*, *"(c) Say the knock-on in questions"*; shape = *"Let the producer split"*; placement = *"Sprint 10, at the end"* | `0492`–`0495` added as rows `P12`–`P15` — see *"➕ `0492`–`0495`"* below |
> | R8 | Typed request, 2026-10-08, in a `fkit lead` session: a lead that digs into code itself to explain an error is wrong; it should spawn a coder — *"brief a task about it and add it to the current sprint"*. Then via `AskUserQuestion`: lead limit = *"Quick triage, then hand off (Recommended)"*; hand-off = *"Tell owner it's delegated"* + *"No lead guess as fact"* + *"Relay read approvals"* | `0498` added as row `P16` — see *"➕ `0498`"* below |
> | R9 | Via `AskUserQuestion`, 2026-10-09, in the `fkit lead` session: *"test/board-root.test.js keeps timing out under machine load (its 20 s limit) and has turned 4 full test runs red this sprint, never because of the task being tested. File a task to fix it?"* — selected *"File it, add to Sprint 10 (Recommended)"* (option text: *"… ranked last in Sprint 10 (after 0474). Knock-on: none — no task depends on it."*) | `0502` added as row `P17` — see *"➕ `0502`"* below. ⚠️ The option said "after 0474"; the last row was `0498`, so "last" = `P17` |
> | R10 | Typed request, 2026-10-10, in a `fkit lead` session: *"/Users/mark.dolbyrev/Downloads/report-1-followup-questions-in-dialogs.md /Users/mark.dolbyrev/Downloads/report-2-command-buttons-mod.md /Users/mark.dolbyrev/Downloads/report-3-code-comments.md - read those 3 files and brief a task for each of them and add it to the currently active sprint (if there are no active sprints, start the next sprint and make it active)"* | `0504`–`0506` added as rows `P18`–`P20` — see *"➕ `0504`–`0506`"* below. Sprint 10 was the one active sprint, so no new sprint was started |
>
> ⚠️ **What this producer chose that nobody ruled** — the title, and (2026-10-05) `0395`'s append
> rank `P11`, forced by convention, not chosen on merit. The number (R4) and the ranks `P1`–`P10`
> (R5) are owner-ruled. See *"⚠️ What this producer decided that nobody ruled"* below.
>
> ⚠️ **`🔲 Backlog` and `🔄 In progress` on line 3 are the producer's to set by hand. `✅ Done` and
> `⛔ Cancelled` are settable only by `/fkit-sprint-done` and `/fkit-sprint-cancelled`, producer-only**
> ([ADR-047](../knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md);
> [`sprint-status-vocabulary.md`](../knowledge-base/conventions/sprint-status-vocabulary.md)).

## 🎯 The goal

Ship the batch of user-facing tasks filed 2026-09-30 → 2026-10-02 (`0472`–`0482`, minus `0478`, which
is already closed):

- **Checks that are steady and fast** — `0477` (prove-red step 0a goes red at random), `0480` (run only
  the checks a change needs).
- **A correct `fkit update`** — `0481` (reinstall from the source and paths it was installed from).
- **Release and docs that tell the truth** — `0479` (CHANGELOG kept current at release), `0476`
  (Codex optional but recommended, everywhere), `0472` (tidy after ADR-052).
- **How work gets approved** — `0475` (a spawned coder may write under a lead-relayed owner approval),
  `0473` (opt-in plan review, off by default), `0474` (the owner's trial of it).
- **The owner-involvement record — Phase A only** — `0482` (investigation, safety verdict, proposal;
  **no build**).

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done (agent-closed — not owner-verified) | P1 | **Find why prove-red step 0a sometimes goes red, and make it deterministic** *(Pulled from the Backlog board 2026-10-04 by owner ruling R1. Every later task's verify runs this step — fix it first. Owner `fkit-coder`)* | [`0477-find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic`](../tasks/done/0477-find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P2 | **Run only the checks a change needs, not the full suite every time** *(Pulled 2026-10-04, R1. Related to `0477` (same test runner); after it so its timing is not measured against a flaky step. Owner `fkit-coder`)* | [`0480-run-only-the-checks-a-change-needs-not-the-full-suite-every-time`](../tasks/done/0480-run-only-the-checks-a-change-needs-not-the-full-suite-every-time/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P3 | **Record every owner question and decision, and count the tasks done autonomously after plan approval — ⛔ PHASE A ONLY** *(Pulled 2026-10-04, R1. Phase A done (ran under owner ruling R2, 2026-10-04: Phase B not approved then). Phase B items 1–5 APPROVED by the owner 2026-10-05 and filed as `0485`–`0491` on the Backlog board; item 6 not approved. Closed once those briefs existed — see the `0482` section below. Owner `fkit-coder`)* | [`0482-record-every-owner-question-and-decision-and-count-autonomous-tasks`](../tasks/done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P4 | **Make `fkit update` reinstall from the source and paths it was installed from** *(Pulled 2026-10-04, R1. A real user-facing bug: custom installs are silently updated from the default source into the default dirs. Its `0478` dependency is closed. Owner `fkit-coder`)* | [`0481-make-fkit-update-reinstall-from-the-source-and-paths-it-was-installed-from`](../tasks/done/0481-make-fkit-update-reinstall-from-the-source-and-paths-it-was-installed-from/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P5 | **Keep CHANGELOG.md up to date at every release** *(Pulled 2026-10-04, R1. Its `0478` dependency is closed. Owner `fkit-coder`)* | [`0479-keep-changelog-md-up-to-date-at-every-release`](../tasks/done/0479-keep-changelog-md-up-to-date-at-every-release/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P6 | **Make every document say Codex is optional but recommended** *(Pulled 2026-10-04, R1. Needs an architect consult + ADR note first. Owner `fkit-coder`)* | [`0476-make-every-document-say-codex-is-optional-but-recommended`](../tasks/done/0476-make-every-document-say-codex-is-optional-but-recommended/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P7 | **Tidy fkit's documents after ADR-052 (machine paths, stale pointers, ADR-049 OQs)** *(Pulled 2026-10-04, R1. Touches some of the same docs as `0476` — run after it, never alongside. Owner `fkit-coder`)* | [`0472-tidy-fkits-documents-after-adr-052-machine-paths-stale-pointers-adr-049-oqs`](../tasks/done/0472-tidy-fkits-documents-after-adr-052-machine-paths-stale-pointers-adr-049-oqs/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P8 | **Let a spawned coder write under a lead-relayed owner approval (one approval marker for both drivers)** *(Pulled 2026-10-04, R1. ADR via architect consult. Owner `fkit-coder`)* | [`0475-let-a-spawned-coder-write-under-a-lead-relayed-owner-approval`](../tasks/done/0475-let-a-spawned-coder-write-under-a-lead-relayed-owner-approval/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P9 | **Build the opt-in plan-review step (off by default)** *(Pulled 2026-10-04, R1. Likely needs an ADR. Off = today exactly. Owner `fkit-coder`)* | [`0473-build-the-opt-in-plan-review-step-off-by-default`](../tasks/done/0473-build-the-opt-in-plan-review-step-off-by-default/brief.md) |
| 🔲 Backlog | P10 | **Trial plan review through the owner's own sprint-loop runs, then put default / optional / drop to him** *(Pulled 2026-10-04, R1. Waits on `0473`. ⚠️ Owner-paced and open-ended — see the `0474` note below. Owner `fkit-producer`)* | [`0474-trial-plan-review-on-3-to-5-real-tasks-and-put-default-optional-or-drop-to-the-owner`](../tasks/backlog/0474-trial-plan-review-on-3-to-5-real-tasks-and-put-default-optional-or-drop-to-the-owner/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P11 | **Re-measure the CI test runtime on the ubuntu runner, and correct the workflow timeout and its comment** *(Pulled mid-sprint 2026-10-05 by owner ruling R6 — see the `0395` section below. ⚠️ `P11` is append rank, NOT a merit ranking — flagged for owner confirmation; on merit it belongs directly below `0479`. Start after `0479` closes. Owner `fkit-coder`)* | [`0395-re-measure-the-ci-test-runtime-on-the-ubuntu-runner-and-correct-the-workflow-timeout-and-its-comment`](../tasks/done/0395-re-measure-the-ci-test-runtime-on-the-ubuntu-runner-and-correct-the-workflow-timeout-and-its-comment/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P12 | **Flag a sprint task that hard-depends on an open later-sprint task, as a dashboard drift record** *(Added 2026-10-05 by owner ruling R7, (a). First of four — `0493` and `0494` read the record it creates. Owner `fkit-coder`)* | [`0492-flag-a-sprint-task-that-hard-depends-on-an-open-later-sprint-task-as-a-dashboard-drift-record`](../tasks/done/0492-flag-a-sprint-task-that-hard-depends-on-an-open-later-sprint-task-as-a-dashboard-drift-record/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P13 | **Make the sprint ship-loop say when a waiting task waits on a later sprint** *(Added 2026-10-05, R7, (a). Waits on `0492`. Owner `fkit-coder`)* | [`0493-make-the-sprint-ship-loop-say-when-a-waiting-task-waits-on-a-later-sprint`](../tasks/done/0493-make-the-sprint-ship-loop-say-when-a-waiting-task-waits-on-a-later-sprint/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P14 | **Warn when filing or re-pointing puts a blocker in a later sprint than its dependents** *(Added 2026-10-05, R7, (b). Warn, never refuse. Waits on `0492`. Owner `fkit-coder`)* | [`0494-warn-when-filing-or-re-pointing-puts-a-blocker-in-a-later-sprint-than-its-dependents`](../tasks/done/0494-warn-when-filing-or-re-pointing-puts-a-blocker-in-a-later-sprint-than-its-dependents/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P15 | **Make every sprint-placement question state which tasks would then wait on that sprint** *(Added 2026-10-05, R7, (c). Prose only; no dependency. Owner `fkit-coder`)* | [`0495-make-every-sprint-placement-question-state-which-tasks-would-then-wait-on-that-sprint`](../tasks/done/0495-make-every-sprint-placement-question-state-which-tasks-would-then-wait-on-that-sprint/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P16 | **Make the lead hand a code-level "why" question to a spawned coder instead of tracing code itself** *(Added 2026-10-08 by owner ruling R8 — see the `0498` section below. ⚠️ `P16` is append rank, NOT a merit ranking — flagged for owner confirmation; on merit it belongs directly below `0495`, where it is. Prose only; build after `0495`'s edit to the same file lands. Owner `fkit-coder`)* | [`0498-make-the-lead-hand-a-code-level-why-question-to-a-spawned-coder-instead-of-tracing-code-itself`](../tasks/done/0498-make-the-lead-hand-a-code-level-why-question-to-a-spawned-coder-instead-of-tracing-code-itself/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P17 | **Make test/board-root.test.js reliable under machine load (its 20 s CLI time limit)** *(Added 2026-10-09 by owner ruling R9 — see the `0502` section below. ⚠️ `P17` is append rank, NOT a merit ranking — flagged for owner confirmation; on merit it belongs directly below `0477`, out of reach behind closed rows. No dependency; nothing waits on it. Owner `fkit-coder`)* | [`0502-make-board-root-test-reliable-under-machine-load`](../tasks/done/0502-make-board-root-test-reliable-under-machine-load/brief.md) |
| 🔄 In progress | P18 | **Answer a question typed into a question dialog in full, in chat, and do not re-ask in the same turn** *(Added 2026-10-10 by owner ruling R10 — see the `0504`–`0506` section below. ⚠️ `P18` is append rank, NOT a merit ranking — flagged for owner confirmation. Prose rules; shares `universal-rules.md` with `0506` — never alongside it. Owner `fkit-coder`)* | [`0504-answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn`](../tasks/backlog/0504-answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn/brief.md) |
| ⛔ Cancelled (agent-closed — not owner-verified) (2026-10-10) — Owner ruling 2026-10-10 (fkit-lead session, relayed by the lead): "Cancel 2-buttons. I agree with you that it's not the fkit core." — a UI convenience mod, not fkit's core; if built, it belongs outside fkit. | P19 | **Build a command-buttons mod that offers the slash-commands Claude suggested as buttons above the prompt** *(Added 2026-10-10, R10. Cancelled the same day — see the `0504`–`0506` section below. Owner `fkit-coder`)* | [`0505-build-a-command-buttons-mod-that-offers-suggested-slash-commands-above-the-prompt`](../tasks/cancelled/0505-build-a-command-buttons-mod-that-offers-suggested-slash-commands-above-the-prompt/brief.md) |
| 🔄 In progress | P20 | **Add a "comment WHY, not WHAT" code-comment rule to fkit, and remove the rules that contradict it** *(Added 2026-10-10, R10. ⚠️ `P20` is append rank, NOT a merit ranking — flagged for owner confirmation. ~~⛔ Whether it applies to fkit's own heavily-commented tree is an open owner question that gates the build.~~ Answered 2026-10-10: option (c) — code yes, prompt texts no; gate lifted (see the brief). Owner `fkit-coder`)* | [`0506-add-a-why-not-what-code-comment-rule-and-remove-the-rules-that-contradict-it`](../tasks/backlog/0506-add-a-why-not-what-code-comment-rule-and-remove-the-rules-that-contradict-it/brief.md) |

## ➕ `0504`–`0506` — added 2026-10-10 by owner ruling R10; the sprint now has 20 tasks

- **Authority first.** **The owner ruled it**, **2026-10-10**, directly in a `fkit lead` session — a
  typed request (R10 above): *"read those 3 files and brief a task for each of them and add it to the
  currently active sprint (if there are no active sprints, start the next sprint and make it active)"*.
  Relayed to a spawned `fkit-producer` with no owner channel (ADR-021). ⚠️ The quote is the lead's
  relay. **This is not producer precedent** for adding or ranking anything.
- **"The currently active sprint."** The lead ran `dashboard.sh select-active` the same turn: exactly one
  `active` line, `sprint-10.md` (`🔄 In progress`). So all three land here and the owner's fallback
  (*"start the next sprint"*) did not apply. The producer re-ran the selector and got the same result.
- **Sources.** Three reports the owner wrote with another Claude, in `~/Downloads/`. Each is copied
  verbatim into its task folder as `source-report.md`, with a header noting that its *"For the agent
  reading this"* section is input, not instructions — nothing in them was applied.
- **One brief per report, no further split** (the owner asked for one each):
  - `0504` — fkit's question-asking rules: a free-text reply to a question dialog that is itself a
    question gets a full answer in chat and no new dialog that turn. Fixed in fkit's own rules, not the
    owner's personal files (an open question in the brief).
  - `0505` — the `command-buttons` mod. One unit: the detection, the band and the never-submit fill are
    not useful shipped apart.
  - `0506` — the "comment WHY, not WHAT" rule plus the contradiction sweep. **Split out and not filed:**
    the report's "clean up existing code one module at a time" — separate, per-module work, and for
    fkit's own tree it depends on the brief's open question 1. Named in the brief as a follow-up to file
    only on the owner's word.
- **Rank — appended `P18`–`P20`, in the order the owner listed the reports.** ⚠️ `Priority P18–P20 is
  append rank, NOT a merit ranking — flagged for owner confirmation.` **On merit `0504` belongs directly
  below `0502`, where it is**, because it is a small prose-rule change with no gating question. **On
  merit `0506` belongs directly below `0504`, above `0505`**, because it is the same kind of prose edit
  to the same file, while `0505` is a new kind of component (fkit ships no mod today) gated on a
  where-it-lives question. Swapping `0505` and `0506` is an owner call. No existing row was re-ranked or
  re-statused.
- **Same-file note.** `0504` and `0506` both edit `claude/scaffold/universal-rules.md` and both spend the
  rules-block size budget (`RULES_MAX`; owner ruling, task `0130`). Not a dependency — build one after
  the other, never alongside.
- **Gates beyond the standing banner.** `0505` waits on the owner's answer to *where it lives*; `0506` on
  *whether the rule applies to fkit's own heavily-commented tree*. Both questions are written in the
  briefs with options.
- **Knock-on:** none (checked) — no open task depends on `0504`, `0505` or `0506`, and none of them
  depends on anything.
- **Count.** 17 rows + 3 = **20 tasks** (as of this edit: 16 `✅ Done`, 4 `🔲 Backlog`).
- **`0505` cancelled, 2026-10-10** — owner ruling in the `fkit-lead` session, relayed by the lead: *"Cancel 2-buttons. I agree with you that it's not the fkit core."* A UI convenience mod, not fkit's core; if built, it belongs outside fkit. Closed by a spawned producer via `/fkit-task-cancelled` (agent-closed — not owner-verified). Board now: 20 rows — 16 `✅ Done`, 3 `🔲 Backlog` (`0474`, `0504`, `0506`), 1 `⛔ Cancelled`. Ranks unchanged (no re-rank was ruled): `0506` stays `P20`; the `0505`-vs-`0506` swap question above is moot.
- Every new brief carries *"Do not start without the owner's specific word."*
- ⏱ **Owner rulings on `0504` and `0506`, 2026-10-10** (via `AskUserQuestion` in the `fkit-lead`
  session, relayed to a spawned producer; ⚠️ the quotes are the lead's relay). `0506` open question 1 →
  *"Code yes, prompt texts no (Rec)"* (option (c)) — its build gate is lifted. `0504` → *"Yes, ship it to
  all users"* (the "Explain more, then ask again" option is now in scope; overrides the producer's lean)
  and *"Remove my copy after 0504 (Rec)"* (personal-file edit is a post-ship step outside the repo).
  Recorded in each brief's *"Owner rulings"* section. ⚠️ Both tasks now press harder on the shared
  rules-block budget (~46 B above the 400 B floor, measured 2026-10-10 — see `0504`'s brief). No status,
  rank or placement changed.

## ➕ `0502` — added 2026-10-09 by owner ruling R9; the sprint now has 17 tasks

- **Authority first.** **The owner ruled it**, **2026-10-09**, via `AskUserQuestion` in the `fkit lead`
  session (R9 above). Relayed to a spawned `fkit-producer` with no owner channel (ADR-021). ⚠️ The quotes
  are the lead's relay. **This is not producer precedent** for adding or ranking anything.
- **Why.** `test/board-root.test.js` starts the real board CLI with a 20 s per-call limit; under machine
  load a call hits it and returns `status null`, turning 4 full runs (`0492`, `0495` ×2, `0493`) and one
  `0494` `test:docs` run red this sprint — never because of the task under test. `prove-red.sh` re-runs
  the suite many times, so one slow test multiplies the chance of a red gate. Detail in
  [`0502`](../tasks/done/0502-make-board-root-test-reliable-under-machine-load/brief.md)'s *Context*.
- **One brief, no split.** One test file, one failure mode; the options (longer limit, lighter cases,
  isolation, retry) are alternatives for the plan to weigh, not separately shippable parts.
- **Rank — appended `P17`.** ⚠️ `Priority P17 is append rank, NOT a merit ranking — flagged for owner
  confirmation.` **On merit this belongs directly below `0477`**, because it is the same class of fix (a
  test gate going red for reasons unrelated to the change) and every later task's verify runs this file;
  that position sits above closed rows and is out of reach (ADR-035). The ruling's option said *"after
  0474"*; the board's last row was `0498` (`P16`), so "ranked last" is `P17`. No existing row was
  re-ranked or re-statused.
- **Knock-on:** none — no open task depends on `0502`, and it depends on none.
- **Count.** 16 rows + 1 = **17 tasks** (as of this edit: 12 `✅ Done`, 2 `🔄 In progress`, 3
  `🔲 Backlog`).
- The brief carries *"Do not start without the owner's specific word."*

## ➕ `0498` — added 2026-10-08 by owner ruling R8; the sprint now has 16 tasks

- **Authority first.** **The owner ruled it**, **2026-10-08**, directly in a `fkit lead` session — a
  typed request (*"I want you to brief a task about it and add it to the current sprint"*), then
  `AskUserQuestion` answers (R8 above). Relayed to a spawned `fkit-producer` with no owner channel
  (ADR-021). ⚠️ The quotes are the lead's relay. **This is not producer precedent** for adding or
  ranking anything.
- **Why.** In a consuming project, the owner asked mid-test whether an error was OK; the lead traced
  server code and production logs itself (~14 reads), concluded an unverified cause, and passed it to
  the brief as a diagnosis — anchoring the coder. Generic incident and rulings L1–L4 in
  [`0498`](../tasks/done/0498-make-the-lead-hand-a-code-level-why-question-to-a-spawned-coder-instead-of-tracing-code-itself/brief.md)'s
  *Context*. The owner is **not** changing that project's session now; the fix ships in fkit.
- **One brief, no split.** It is one prose rule in `fkit-lead.md` (bound "orient", name diagnosis,
  tripwire, three hand-off requirements) plus matching role-description lines; none of those parts is
  useful shipped alone.
- **Rank — appended `P16`.** ⚠️ `Priority P16 is append rank, NOT a merit ranking — flagged for owner
  confirmation.` **On merit this belongs directly below `0495`, where it is**, because both are prose
  rules in `fkit-lead.md` and this one should build on `0495`'s landed edit. No existing row was
  re-ranked or re-statused.
- **Count.** 15 rows + 1 = **16 tasks** (as of this edit: 10 `✅ Done`, 2 `🔄 In progress`, 4
  `🔲 Backlog`).
- The brief carries *"Do not start without the owner's specific word."*

## ➕ `0492`–`0495` — added 2026-10-05 by owner ruling R7; the sprint now has 15 tasks

- **Authority first.** **The owner ruled it**, **2026-10-05**, directly in the `fkit-lead` session
  driving this sprint — a typed request, then `AskUserQuestion` answers (R7 above: scope (a)+(b)+(c),
  *"Let the producer split"*, *"Sprint 10, at the end"*). Relayed to a spawned `fkit-producer` with no
  owner channel (ADR-021). ⚠️ The quotes are the lead's relay. **This is not producer precedent** for
  adding or ranking anything.
- **Why.** A consuming project (geoconflict) reported that 6 of its current sprint's 8 open rows came to
  hard-depend on a task filed into its **next** sprint — through an owner ruling on a "(Recommended)"
  option that never said so — and no fkit tool flagged it. Full incident in
  [`0492`](../tasks/done/0492-flag-a-sprint-task-that-hard-depends-on-an-open-later-sprint-task-as-a-dashboard-drift-record/brief.md)'s
  *Context*. The fix makes it **visible**; it never forbids it (that project's owner rule puts verify
  tasks at the top of the next sprint on purpose).
- **The producer's split** (owner: *"Let the producer split"*): `0492` the `dashboard.sh` drift record +
  `/fkit-status` grammar; `0493` the sprint ship-loop reads and says it; `0494` warn (never refuse) when
  filing or re-pointing; `0495` say the knock-on in sprint-placement questions (prose). Links:
  `0493` and `0494` depend on `0492`; `0495` depends on nothing.
- **Rank — appended `P12`–`P15`, as the owner placed them ("at the end").** `Priority P12–P15 is append
  rank, NOT a merit ranking` — here append is also the owner's own placement ruling, so no further
  confirmation is needed. **On merit they belong directly below `0395`, where they are**, in dependency
  order. No existing row was re-ranked or re-statused.
- **Count.** 11 rows + 4 = **15 tasks** (as of this edit: 6 `✅ Done`, 1 `🔄 In progress`, 8 `🔲 Backlog`).
- Every new brief carries *"Do not start without the owner's specific word."*
- ⏱ **Owner ruling, 2026-10-05 — keep `0493`.** Asked via `AskUserQuestion` in the `fkit-lead`
  session (this sprint's ship-loop) whether to keep `0493`, since it sits close to option (d), which the
  owner did not choose under R7, the owner chose *"Keep it"*. `0493` stays on this board as filed;
  nothing else changed. Relayed to a spawned `fkit-producer` (ADR-021); ⚠️ the quote is the lead's relay.

## ⛔ `0482` — Phase A only; Phase B is gated on the owner's explicit APPROVE

- **Owner ruling R2, 2026-10-04 (relayed by `fkit-lead`): Phase B is NOT approved.** The brief's own
  gate stands unchanged: *"DO NOT IMPLEMENT until the owner gives a direct, explicit 'APPROVE' for
  implementation"*, and *"Being pullable on a board is not approval."* **Being on this board is not
  approval either.**
- **What may run in this sprint:** Phase A steps 1–5 — verify the hook mechanics, give the safety
  verdict, write `plan.md` (only if "safe"), draft the ADR as **Proposed**, then **stop** and put the
  verdict and proposal to the owner. Nothing outside the task folder and the ADR draft changes.
- **No split was needed.** The brief already defines itself as *"one gated umbrella"* whose Phase A
  output includes the proposed split into implementation briefs, filed by the producer **after**
  APPROVE. So no new brief is filed now.
- **How the row ends this sprint — never `✅ Done` on Phase A alone**, because closing the umbrella
  would silently drop Phase B. Once Phase A's verdict is with the owner:
  - **owner APPROVEs** → the producer files the Phase-B briefs from `plan.md`'s split (on a sprint the
    owner names); the umbrella is closed only when those exist;
  - **owner drops it** (e.g. a "not safe enough" verdict) → closed via `/fkit-task-cancelled`;
  - **no answer yet** → the honest status is `🚧 Blocked — waiting on owner APPROVE for Phase B`, in
    both the brief and this row.
- **Item 6** (historical count from transcripts) needs **its own** approval, separate from any
  APPROVE for items 1–5.
- ⏱ **Outcome, 2026-10-05 — the APPROVE branch above ran.** The owner APPROVED Phase B items 1–5
  (given directly via `AskUserQuestion` in the `fkit-lead` session, this sprint's ship-loop; relayed to
  a spawned producer). **Item 6 NOT approved** — no brief filed. The producer filed the Phase-B briefs
  from `plan.md` § 4 as amended by
  [ADR-053](../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md)
  (`proposed`): `0485` (B0 — the owner reads and accepts ADR-053; blocks all the rest), `0486` (B1),
  `0487` (B2), `0488` (B3), `0489` (B3b), `0490` (B4), `0491` (B5). ⚠️ **They are on the Backlog
  board, not on this sprint** — the bullet above says "on a sprint the owner names", and he has named
  none; this board's scope is R1's batch. Pulling them is his call. With the briefs in place, `0482`
  was closed `✅ Done (agent-closed — not owner-verified)` by that spawned producer.

## ➕ `0395` — pulled in mid-sprint by owner ruling R6 (2026-10-05); the sprint now has 11 tasks

- **Authority first.** **The owner ruled it**, **2026-10-05**, typing directly in the `fkit-lead`
  session driving this sprint's `/fkit-sprint-ship-loop`, in reply to the lead's suggestion to pull
  `0395` in so a push does not fail CI on timeout: *"I want that"*. Relayed to a spawned
  `fkit-producer` with no owner channel (ADR-021). ⚠️ The quote is the lead's relay. **This is not
  producer precedent** for pulling or ranking anything.
- **Why now (lead's relay).** Local full `npm test` grew to 19–27 min on a busy machine this sprint, as
  `0477`, `0480`, `0481` and `0479` added prove-red steps; `.github/workflows/test.yml` has
  `timeout-minutes: 20`; recent CI runs (2026-10-02, before those additions) were 5.8–10.9 min.
- **Rank — appended at `P11`, not inserted.** ⚠️ `Priority P11 is append rank, NOT a merit ranking —
  flagged for owner confirmation.` **On merit this belongs directly below `0479`**, because the owner's
  intent is to fix it before any push and `0479` is already in flight. A new row always appends
  (`/fkit-task-brief` step 5, *"insertion is never the exception's to grant"*;
  [ADR-035](../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  and a spawned producer never re-ranks. `P5`–`P11` are one contiguous run of open rows, so an
  owner-ruled re-rank moving `0395` up to sit directly below `0479` would renumber **no closed row** —
  but it needs the owner's explicit ruling on the rank itself. The merit statement is in the brief.
- **Count.** R1's ten rows plus `0395` = **11 tasks** (4 `✅ Done`, 1 `🔄 In progress`, 6 `🔲 Backlog`
  as of 2026-10-05). No status changed in this pull; `0395` enters as `🔲 Backlog`.
- **Backlog-board edits, per its *"Off:"* rule:** the `0395` row on [`backlog.md`](backlog.md) now
  leads with `➡️ Moved to [Sprint 10](sprint-10.md) — priority P11` (row kept); the brief's `## Sprint`
  reads `Sprint 10` and its `## Priority` reads `P11`.
- ⚠️ **For the plan gate:** the brief makes a runner measurement the first deliverable and forbids
  picking the timeout from local figures — but a runner run needs a push, which is the owner's act.
  "Before any push" and "measure on the runner first" cannot both hold; the owner rules which gives.

## ⚠️ Notes for the driver (`/fkit-sprint-ship-loop`)

- **Every brief here says *"Do not start without the owner's specific word."*** R1 pulls them onto a
  board the owner wants driven, but this producer does **not** read R1 as that word for each task. The
  ship-loop's per-task **plan approval by the owner, live**, is the clean point where the word is
  given — the plan step itself is read-only.
- **`0474` is owner-paced, not loop-shippable in the usual sense.** The owner runs the trial *"as often
  as he needs, with no task count"*; it ends when he says he has seen enough. Expect it to remain open
  (`🔲 Backlog` until `0473` closes, then `🔄 In progress` while the trial runs) when the rest of the
  board is done.
- **Order is the rank, then dependencies.** In-board dependencies: `0474` → `0473`; `0493` → `0492`; `0494` → `0492` (the last two added 2026-10-05, R7). (`0395` has no in-board dependency; its brief asks that it start after `0479` closes — they touch neighbouring release files.) `0479` and
  `0481` depended on `0478`, which is closed (`✅ Done (agent-closed — not owner-verified)`).

## ⛔ What is deliberately not on this board

| Task | Why |
|---|---|
| `0478` — Overhaul the README for first-time visitors | Already closed — `✅ Done (agent-closed — not owner-verified)`, brief in `tasks/done/`. Not open, so not pulled. |

## ⭐ The number `10` — chosen knowingly by the owner (2026-10-04)

- **Owner ruling R4, 2026-10-04 (relayed by `fkit-lead`): renumber this sprint to `Sprint 10`.** It was
  given **after** the owner was told that earlier rulings had reserved `Sprint 10` for fkit's own
  backlog work, and what taking the number would do. So the reservation is set aside by the owner's own
  choice — not by this producer.
- **History.** This board was first created the same day as `sprint-12.md` (`Sprint 12`), because a
  spawned producer would not take the reserved number without a ruling. R4 renamed it; every inbound
  marker and brief was repointed the same day. No `sprint-12.md` remains.
- **What the reservation was** — see [Sprint 11's board](done/sprint-11.md), section *"⚠️ READ THIS
  FIRST — the number `11` is deliberate, and `10` is deliberately left empty"*. That closed board says
  *"There is no `sprint-10.md`"*; that was true as of its date and is not edited.

## 📌 Candidates recorded because `Sprint 10` is now planned — ⛔ NOT on this board

⭐ **Owner ruling 2026-09-16** (recorded in
[`0301`'s brief](../tasks/backlog/0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md),
heading *"Next-sprint candidate — added 2026-09-16"*), verbatim:

> *"Note it as a candidate when Sprint 10 is planned. Briefs keep citing an unwritten rule until then,
> but nothing is blocked today."*

**Honoured here, literally — as a note, not a pull.** The ruling asks for a note only; it does not ask
for `0301` to be put on the sprint, and R1 fixed this board's scope to the `0472`–`0482` batch.

| Task | Why it is named here | Status |
|---|---|---|
| [`0301`](../tasks/backlog/0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md) — Record the "correct as of its date" convention | ⭐ **Candidate for this sprint, per the owner ruling above.** Not pulled; pulling it is an owner call | `🔲 Backlog`, on the Backlog board |
| [`0189`](../tasks/backlog/0189-build-the-skill-ownership-site-registry-and-completeness-tripwire/brief.md) — Skill-ownership site registry + completeness tripwire | [Sprint 9's board](done/sprint-9.md) deferred it "to Sprint 10" — ⚠️ **a producer's argument, not an owner ruling** | `🔲 Backlog`, on the Backlog board |
| [`0329`](../tasks/backlog/0329-decide-and-implement-inits-behaviour-when-gitignore-is-a-symlink/brief.md), [`0332`](../tasks/backlog/0332-decide-and-implement-inits-behaviour-when-fkit-interview-is-a-hard-link/brief.md) — init's `.gitignore`-symlink and `.fkit/interview`-hard-link behaviour | Sprint 9's board called them *"first in line for Sprint 10"* — ⚠️ **also not a ruling**; that board says *"the owner has ruled nothing about Sprint 10"* | `🔲 Backlog`, on the Backlog board |

⛔ **None of these is a row on this board, and none was re-statused, re-ranked or re-pointed.** Their
`## Sprint` stays `Backlog`. Adding any of them is the owner's call (see open question in *Notes*).

## ⚠️ What this producer decided that nobody ruled

1. **The title.** Open to correction.
2. ~~The number~~ — now owner-ruled (R4). ~~The ranks `P1`–`P10`~~ — now owner-ruled unchanged (R5).
   For the record, the reasoning behind the order: test-runner reliability and speed first (they
   affect every later task's verify), then `0482` Phase A early (its verdict is what the owner needs
   before any capture can start), then the user-facing bug, then docs, then the approval-flow work.
3. **`0395` at `P11` (2026-10-05)** — append rank by convention (`/fkit-task-brief` step 5, ADR-035),
   **not** a merit ranking; on merit it belongs directly below `0479`. Flagged for owner confirmation.
4. **The split of R7 into `0492`–`0495` (2026-10-05)** — the owner delegated it (*"Let the producer
   split"*); the four-way cut, their order, and the two questions left to `0492`'s plan step (what
   "later" means when sprint numbers are not chronological; hard vs soft dependencies) are this
   producer's. Ranks `P12`–`P15` are the owner's placement ("at the end").
5. **`0498` at `P16` (2026-10-08)** — append rank by convention, **not** a merit ranking (on merit:
   directly below `0495`, where it is); and the choice to file it as one brief, not a split. Flagged
   for owner confirmation.
6. **`0502` at `P17` (2026-10-09)** — append rank by convention, **not** a merit ranking (on merit:
   directly below `0477`, out of reach behind closed rows); reading the ruling's *"after 0474"* as
   "last" = below `0498`; and filing it as one brief, not a split. Flagged for owner confirmation.

## 📎 Backlog-board edits this pull performed (2026-10-04)

Per the Backlog board's *"Off:"* rule: each of the ten rows on
[`backlog.md`](backlog.md) now leads with `➡️ Moved to [Sprint 10](sprint-10.md) — priority P<n>`
(row kept, not deleted), and each brief's `## Sprint` reads `Sprint 10` and its `## Priority` reads
the `P<n>` above. (Written first as `Sprint 12` / `sprint-12.md`; repointed the same day under R4.)

## Notes

- Created 2026-10-04 by a spawned `fkit-producer` on `fkit-lead`'s instruction (no owner channel,
  ADR-021); renumbered `12` → `10` the same day by a second spawned producer under R4. Nothing was
  committed.
- ⚠️ **Open for the owner:** whether any of the candidates above (`0301` first) should join this sprint.
  Not asked by this producer — it has no owner channel.
- ⏱ **Owner ruling, 2026-10-10 — no more pulls for now.** Asked via `AskUserQuestion` in the
  `fkit-lead` session (relayed to a spawned producer; ⚠️ the quote is the lead's relay): *"Pull more
  backlog tasks into Sprint 10?"* — selected *"No, finish 0504/0506 first (Rec)"* (option text: *"Keep
  Sprint 10 small. Decide on more work after these ship."*). This answers the open question above **for
  now**: none of the candidates (`0301`, `0189`, `0329`, `0332`) joins this sprint; the question comes
  back after `0504` and `0506` ship. **Knock-on: none** — no placement changed, no `Depends on:` link
  moved.
