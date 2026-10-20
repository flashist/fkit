# Sprint 13 — Default `npm test` ≤ 2 min, CI-enforced — reset fkit's tests to shipped-script behaviour (option D)

> ## 🔄 In progress — 2026-10-19.
>
> **Authority.** This board exists by **owner rulings given 2026-10-19 via `AskUserQuestion` in a
> `fkit lead` session**, relayed verbatim into a spawned `fkit-producer` that has **no owner channel**
> ([ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
> The decision behind the whole sprint (the owner's typed *"RADICALLY reduce the tests"*) and rulings
> 1–4 on the reduction itself are quoted in `0527`'s brief, *Owner rulings*.
>
> | # | Owner's words | What it settled |
> |---|---|---|
> | S1 | Via `AskUserQuestion`, 2026-10-19, `fkit lead` session — question: did *"the option that is reducing the time most radically"* mean option D (keep only shipped-script tests; prove-red off or ≤ 5 key cases outside `npm test`; delete tooling / doc / wording tests)? Selected option text, verbatim: *"Yes, option D (Recommended)"* (description he saw: *"All five briefs stand as written."*) | The lead's reading of ruling 1 is **confirmed** — option D. `0526`–`0530` stand as written |
> | S2 | Via `AskUserQuestion`, 2026-10-19, `fkit lead` session — selected option text, verbatim: *"New Sprint 13, start now (Recommended)"* (description he saw: *"Sprint 13 holds only 0526–0530; starting it is your word for all five. Sprint 12 stays paused. Knock-on: none."*) | This board: number `13`, **only** `0526`–`0530`, started now. **Starting it is the owner's specific word for all five tasks** (each brief's ⛔ *"Do not start without the owner's specific word"* is satisfied). [Sprint 12](sprint-12.md) stays `🔄 In progress`, paused by the owner, rows untouched |
> | S3 | Via `AskUserQuestion`, 2026-10-19, `fkit lead` session — selected option text, verbatim: *"Keep five (Recommended)"* (description he saw: *"Your ADR sign-off and the Linux check stay separate, unskippable steps."*) | The five-brief split stands — no merge |
> | S4 | Via `AskUserQuestion`, 2026-10-19, `fkit lead` session — question about cancelling / rescoping the old test tasks (`0503`, `0512`–`0515`, `0522` and the backlog test briefs in `0529`'s knock-on table). Selected option text, verbatim: *"After the ADR is signed (Recommended)"* (description he saw: *"The ADR (0527) fixes what stays, so the list is decided on facts. Nothing cancelled now."*) | **Nothing is cancelled or rescoped now.** The knock-on list in `0529`'s brief is decided after `0527`'s ADR is signed |
>
> ⚠️ **What nobody ruled** — the `P1`–`P5` ranks. They are the dependency order `fkit-lead` relayed
> with the instruction (`0526` and `0527` first, no deps; then `0528`, `0529`, `0530`), not an owner
> choice. The `0526`-before-`0527` tie-break is the order the lead listed them in; the two can run in
> parallel.
>
> ⚠️ **`🔲 Backlog` and `🔄 In progress` on line 3 are the producer's to set by hand. `✅ Done` and
> `⛔ Cancelled` are settable only by `/fkit-sprint-done` and `/fkit-sprint-cancelled`, producer-only**
> ([ADR-047](../knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md);
> [`sprint-status-vocabulary.md`](../knowledge-base/conventions/sprint-status-vocabulary.md)).

## 🎯 The goal

**Default `npm test` ≤ 2 min, CI-enforced — reset fkit's tests to shipped-script behaviour
(option D).** The default `npm test` takes ≤ 2 min locally on an idle Mac, and CI fails the job if it
goes over (owner ruling 2, quoted in `0527`'s brief). Only shipped-script behaviour tests stay; the
rules that grew the suite are changed so it does not grow back.

**Success:** all five rows below closed, with `0530`'s measured times in `CONTRIBUTING.md` showing the
budget met.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done (agent-closed — not owner-verified) | P1 | **Check prove-red mutation 48 on one isolated Linux run before deciding the banner tests** *(Pulled from the Backlog board 2026-10-19 by owner ruling S2. Investigation only. Depends on nothing. Blocks `0529` (banner-test part only). ⚠️ A CI branch needs a push — ask the owner first. Owner `fkit-coder`)* | [`0526-check-prove-red-mutation-48-on-one-isolated-linux-run-before-deciding-the-banner-tests`](../tasks/done/0526-check-prove-red-mutation-48-on-one-isolated-linux-run-before-deciding-the-banner-tests/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P2 | **Record the ADR that resets fkit's test scope to shipped-script behaviour** *(Pulled from the Backlog board 2026-10-19 by owner ruling S2. Depends on nothing. ⛔ The gate: the owner signs the ADR off before `0528` / `0529` start. Prove-red delete-vs-keep-≤5 and the must-keep list are owner questions inside it. Owner `fkit-architect`)* | [`0527-record-the-adr-that-resets-fkits-test-scope-to-shipped-script-behaviour`](../tasks/done/0527-record-the-adr-that-resets-fkits-test-scope-to-shipped-script-behaviour/brief.md) |
| 🔄 In progress | P3 | **Change the rules that make the test suite grow** *(Pulled from the Backlog board 2026-10-19 by owner ruling S2. Depends on `0527` (P2, this sprint) — its owner sign-off, not only its file. Re-scoped 2026-10-19 to [ADR-057](../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md): no numeric cap, project-neutral shipped wording. Owner `fkit-coder`)* | [`0528-change-the-rules-that-make-the-test-suite-grow`](../tasks/backlog/0528-change-the-rules-that-make-the-test-suite-grow/brief.md) |
| 🔲 Backlog | P4 | **Cut the test suite down to shipped-script behaviour tests** *(Pulled from the Backlog board 2026-10-19 by owner ruling S2. Depends on `0527` (P2, its sign-off) and `0526` (P1, banner-test part only) — both this sprint. Carries the knock-on table for old test tasks, decided after the ADR per S4. Re-scoped 2026-10-19 to ADR-057: four named exceptions kept, release-summary moved to its own script, prove-red cut to four cases. Owner `fkit-coder`)* | [`0529-cut-the-test-suite-down-to-shipped-script-behaviour-tests`](../tasks/backlog/0529-cut-the-test-suite-down-to-shipped-script-behaviour-tests/brief.md) |
| 🔲 Backlog | P5 | **Enforce the two-minute test budget in CI and settle the release gate** *(Pulled from the Backlog board 2026-10-19 by owner ruling S2. Depends on `0529` (P4, this sprint). Release-gate question (a) / (b) open for the owner before build. Re-scoped 2026-10-19 to ADR-057: adds the nightly prove-red schedule, and whether `npm run release` runs the moved release-summary test. Owner `fkit-coder`)* | [`0530-enforce-the-two-minute-test-budget-in-ci-and-settle-the-release-gate`](../tasks/backlog/0530-enforce-the-two-minute-test-budget-in-ci-and-settle-the-release-gate/brief.md) |

## ⚠️ Notes for the driver

- **The owner's word to start is given for all five (S2) — but two gates remain.** `0528` and `0529`
  do not start until `0527`'s ADR carries the owner's recorded sign-off (its status is *Proposed*
  until then). `0526` decides the banner tests only; the rest of `0529` may proceed once the ADR is
  signed. Being started is not a waiver of either gate.
  - **2026-10-19 — the ADR gate is satisfied:** [ADR-057](../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) is `accepted` (owner sign-off Q7).
    `0526` and `0527` are closed. `0528`–`0530` were re-scoped to the ADR before any build (see the
    dated note in each brief).
- **Every dependency is inside this sprint** — no row waits on a later sprint.
- **`CONTRIBUTING.md` is touched by `0528`, `0529` and `0530`** — sequence the edits if two are in
  flight.
- **`0526` and `0530` may each want a pushed CI branch** — the hard rule needs the owner's explicit OK
  for any push; both briefs offer a local alternative.
- **Old test tasks are not touched now (S4).** `0503` stays `🚧 Blocked` on [Sprint 12](sprint-12.md);
  `0512`–`0515`, `0522` and the backlog briefs in `0529`'s knock-on table stay where they are until
  the ADR is signed and the owner rules the list.
  - **2026-10-19:** the ADR is signed, so the list is ready for the owner to rule — still nothing
    cancelled or rescoped until he does. `0522` is superseded by ADR-057 D6 (a); cancelling it needs
    his explicit word.
- **Two sprints are `🔄 In progress`** — this one and the paused Sprint 12. That is legal (ADR-047);
  `select-active` reports both.

## Notes

- **2026-10-19 — board created and started** on S1–S4 by a spawned `fkit-producer` with no owner
  channel: `0526`–`0530` pulled from the [Backlog board](backlog.md) as `P1`–`P5` (four edits each: row
  here, `➡️ Moved to [Sprint 13](sprint-13.md) — priority P<n>` there, the brief's `## Sprint` and
  `## Priority`), plus a dated *owner's word to start* note in each brief and S4's note in `0529`'s
  knock-on section; S1's confirmation noted in `0527`'s *Owner rulings*. Sprint 12 not touched.
- **2026-10-19 — `0528`, `0529`, `0530` re-scoped to ADR-057** by a spawned `fkit-producer` (no owner
  channel), on the owner's instruction in the `fkit lead` session (`AskUserQuestion`, *"Stop; re-brief
  first (Recommended)"*; then typed, *"Commit and then rewrite"* — quoted in full in each brief). Each
  brief's *What to build* and *Verification steps* rewritten; owner-ruling quotes kept; rows here
  updated. All three stay `🔲 Backlog` in this sprint; no dependency changed.
