# Sprint 10 — the `0472`–`0482` batch: steadier and faster checks, a correct `fkit update`, honest docs, opt-in plan review, and the owner-involvement record (Phase A only)

**Source**: `ai-agents/sprints/sprint-10.md`
**Status**: in-progress — line-3 banner `🔄 In progress — 2026-10-04` (read at `79a7dbf`, 2026-10-10)
**Sprint/Tag**: Sprint 10 · opened 2026-10-04 · driven by `/fkit-sprint-ship-loop` from `fkit-lead` sessions
> ✅ *Dated update 2026-10-14 (sync `79a7dbf`→`baf6a4e`), lines above left as written:* banner unchanged —
> still `🔄 In progress — 2026-10-04` at `baf6a4e`; the board now has **24 rows** (owner ruling R11, below).

## Goal
Ship the user-facing tasks filed 2026-09-30 → 2026-10-02 (`0472`–`0482`, minus `0478`, already closed):
checks that are steady and fast (`0477`, `0480`); a correct `fkit update` (`0481`); release and docs that tell
the truth (`0479`, `0476`, `0472`); how work gets approved (`0475`, `0473`, `0474`); and the owner-involvement
record, **Phase A only** (`0482`).

**Authority.** The board exists by owner rulings given **2026-10-04 live in a `fkit lead` session**, relayed to
a spawned producer with no owner channel (ADR-021). ⚠️ **The board records the wording as the lead's relay, not
text verified as the owner's verbatim words.**

| # | Ruling (as relayed) | What it settled |
|---|---|---|
| R1 | Sprint goal = the `0472`–`0482` batch; drive it with `/fkit-sprint-ship-loop` | the board, its ten rows, its banner |
| R2 | *"0482 Phase B is NOT approved"* | `0482` on the board for Phase A only |
| R3 | update six stale dependency lines (`0172`, `0394`, `0395`, `0396`, `0479`, `0481`) with a dated note | brief notes, not a board change |
| R4 | **renumber to `Sprint 10`**, given after the owner was told the number was reserved | the number (board first created as `sprint-12.md` the same day) |
| R5 | keep `P1`–`P10` unchanged | ranks owner-confirmed |
| R6 | 2026-10-05, *"I want that"* — pull `0395` in so a push does not fail CI on timeout | `0395` at `P11` (append rank) |
| R7 | 2026-10-05 — after the geoconflict incident: scope (a) board flags it, (b) warn when filing, (c) say the knock-on in questions; *"Let the producer split"*; *"Sprint 10, at the end"* | `0492`–`0495` at `P12`–`P15` |
| R8 | 2026-10-08 — the lead must not dig into code to explain an error; L1–L4 | `0498` at `P16` |
| R9 | 2026-10-09 — *"File it, add to Sprint 10 (Recommended)"* for the `board-root` timeout flake | `0502` at `P17` |
| R10 | 2026-10-10 — brief one task per owner-supplied report into the active sprint | `0504`–`0506` at `P18`–`P20` |
| R11 | 2026-10-14 — *"Pull 4 (Recommended)"*: `0501`, `0496`, `0484`, `0483` as `P21`–`P24`, run after `0506`; knock-on none | `P21`–`P24` pulled from the Backlog board — ranks are the owner's (the option named them); supersedes the 2026-10-10 *"No, finish 0504/0506 first"* hold |

## Key Changes
**State read at `79a7dbf` (2026-10-10): 20 rows — 16 `✅ Done (agent-closed — not owner-verified)`, 3
`🔲 Backlog` (`0474`, `0504`, `0506`), 1 `⛔ Cancelled` (`0505`).**

| P | Task | Status | Page |
|---|---|---|---|
| P1 | `0477` prove-red step 0a goes red at random | ✅ | [[tasks/find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic]] |
| P2 | `0480` run only the checks a change needs | ✅ | [[tasks/run-only-the-checks-a-change-needs-not-the-full-suite-every-time]] |
| P3 | `0482` owner-involvement record — **Phase A only** | ✅ | [[tasks/record-every-owner-question-and-decision-and-count-autonomous-tasks]] |
| P4 | `0481` `fkit update` reinstalls from its source and paths | ✅ | [[tasks/make-fkit-update-reinstall-from-the-source-and-paths-it-was-installed-from]] |
| P5 | `0479` CHANGELOG kept current at release | ✅ | [[tasks/keep-changelog-md-up-to-date-at-every-release]] |
| P6 | `0476` Codex optional but recommended, everywhere | ✅ | [[tasks/make-every-document-say-codex-is-optional-but-recommended]] |
| P7 | `0472` tidy after ADR-052 | ✅ | [[tasks/tidy-fkits-documents-after-adr-052-machine-paths-stale-pointers-adr-049-oqs]] |
| P8 | `0475` a spawned coder writes under a lead-relayed approval | ✅ | [[tasks/let-a-spawned-coder-write-under-a-lead-relayed-owner-approval]] |
| P9 | `0473` opt-in plan review, off by default | ✅ | [[tasks/build-the-opt-in-plan-review-step-off-by-default]] |
| P10 | `0474` the owner's trial of plan review | 🔲 open — owner-paced | *(no page — open)* |
| P11 | `0395` CI runtime re-measured, timeout corrected | ✅ (V5 pending the owner's push) | [[tasks/re-measure-the-ci-test-runtime-on-the-ubuntu-runner-and-correct-the-workflow-timeout]] |
| P12–P15 | `0492`–`0495` make a later-sprint blocker visible | ✅ ×4 | [[tasks/make-a-later-sprint-blocker-visible-0492-0495]] |
| P16 | `0498` the lead hands a code-level "why" to a coder | ✅ | [[tasks/make-the-lead-hand-a-code-level-why-question-to-a-spawned-coder-instead-of-tracing-code-itself]] |
| P17 | `0502` `board-root` test reliable under load | ✅ | [[tasks/make-board-root-test-reliable-under-machine-load]] |
| P18 | `0504` answer a question typed into a question dialog in full | 🔲 open | *(no page — open)* |
| P19 | `0505` command-buttons mod | ⛔ cancelled 2026-10-10 | [[tasks/build-a-command-buttons-mod-that-offers-suggested-slash-commands-above-the-prompt]] |
| P20 | `0506` "comment WHY, not WHAT" rule | 🔲 open — gated on an owner question | *(no page — open)* |

> ✅ **Dated update 2026-10-14 (sync `79a7dbf`→`baf6a4e`) — the table above is left as read at `79a7dbf`.** State at
> `baf6a4e`: **24 rows — 17 ✅ `Done (agent-closed — not owner-verified)`, 6 🔲 `Backlog`, 1 ⛔ `Cancelled`.**
> - `P18` **`0504` ✅ closed 2026-10-14** (agent-closed) after the owner-run live check passed →
>   [[tasks/answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn]]. The
>   first task planned with `--plan-review` on; its trial log is the first for `0474`.
> - `P20` **`0506`'s gate is lifted** — owner ruling 2026-10-10, option (c): *"Code yes, prompt texts no (Rec)"*. Still
>   open. ⚠️ It inherits **~47 B** of rules-block headroom above the 400 B floor after `0504`.
> - **New rows (R11), all 🔲, owner `fkit-coder`, no pages (open):** `P21` `0501` (how `Depends on:` lines are read) ·
>   `P22` `0496` (nine stale line cites) · `P23` `0484` (links in top-level docs) · `P24` `0483` (board reader vs a
>   folder moved mid-read). Run order `0506` → `0501` → `0496` → `0484` → `0483`; ⚠️ **`0496` before `0484`** —
>   sequencing, not a dependency (`0496` edits `RELEASING.md`, which `0484`'s new check reads). All four
>   dependencies closed (checked by the board 2026-10-14). ⛔ **R11 is a placement ruling, not the owner's word
>   to start** — each brief still says *"Do not start without the owner's specific word."*
> - `P11` `0395`: V5 now **met** — see below.

- **Four decisions came out of it:** [[decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log]]
  (`proposed`), [[decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode]],
  [[decisions/adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver]],
  [[decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default]]; and one dated amendment (ADR-031,
  the lead never diagnoses, from `0498`).
- **`0482` ended on the APPROVE branch (2026-10-05):** the owner approved Phase B items 1–5; the producer filed
  `0485`–`0491` **on the Backlog board, not this sprint** (he named none); item 6 not approved; `0482` was then
  closed. ⛔ The board's own rule: never `✅ Done` on Phase A alone — it was closed only once the Phase-B briefs
  existed.
- **Every append rank (`P11`, `P16`–`P20`) is flagged on the board as "append rank, NOT a merit ranking —
  flagged for owner confirmation"** (ADR-035: a spawned producer never inserts or re-ranks). `P12`–`P15` are
  the owner's own placement (*"at the end"*).
- **Not on the board, recorded as candidates only:** `0301` (owner ruling 2026-09-16: *"Note it as a candidate
  when Sprint 10 is planned"* — honoured literally as a note, not a pull), `0189`, `0329`, `0332` (earlier
  "Sprint 10" mentions that were producer arguments, not rulings). ⚠️ Whether any should join is **open for the
  owner**.
  > ✅ *Dated note 2026-10-14:* answered **for now** on 2026-10-10 — *"No, finish 0504/0506 first (Rec)"*; then R11
  > (2026-10-14) pulled four **other** rows. **None of `0301`, `0189`, `0329`, `0332` was pulled.**

> ✅ **Dated update 2026-10-15 (sync `baf6a4e`→`96c7263`) — the table and the 2026-10-14 update above are left as written.**
> State at `96c7263`: **24 rows — 22 ✅ `Done (agent-closed — not owner-verified)`, 1 🔲 `Backlog` (`0474`, owner-paced),
> 1 ⛔ `Cancelled` (`0505`).** Line-3 banner still `🔄 In progress — 2026-10-04`.
> - Closed 2026-10-14, all agent-closed: `P20` `0506` → [[tasks/add-a-why-not-what-code-comment-rule-and-remove-the-rules-that-contradict-it]]
>   (⚠️ its live check — verification step 5 — is **pending, not passed**) · `P21` `0501` →
>   [[tasks/document-how-depends-on-lines-are-read-in-the-dependency-declaration-form-page]] · `P22` `0496` →
>   [[tasks/fix-nine-stale-line-cites-and-claims-found-during-sprint-10]] · `P23` `0484` →
>   [[tasks/check-the-links-in-fkits-top-level-docs-not-only-under-ai-agents]] · `P24` `0483` →
>   [[tasks/stop-the-board-reader-failing-when-a-task-folder-moves-between-its-check-and-its-read]].
> - Follow-ups filed **on the Backlog board, not this sprint**: `0507`–`0515` (comments-only cleanup of fkit's existing
>   code, from `0506`) and `0516` (the stale ADR-019 / `fkit-coder.md` cites `0496` found out of scope). Open, no pages.
> - ⛔ **The sprint is still not closed** — `0474` (the owner's plan-review trial) is the one open row.

## Outcome
- ⭐ **The number `10` was taken knowingly (R4).** [[tasks/sprint-11-fkit-aiboard-convergence]] had left `10`
  deliberately empty, reserved by earlier rulings for fkit's own backlog work; the owner set that reservation
  aside after being told what taking it would do. Sprint 11's closed board still says *"There is no
  `sprint-10.md`"* — true as of its date, not edited.
- **Still open at `79a7dbf`:** `0474` (the owner runs plan-review loops as often as he needs; it ends when he
  says so — not loop-shippable), `0504`, `0506` (gated on whether the rule applies to fkit's own
  heavily-commented tree). The banner reads `🔄 In progress`; ⛔ **the sprint is not closed.**
  > ✅ *Dated note 2026-10-14:* at `baf6a4e` the open rows are `0474`, `0506` (gate lifted) and R11's `0501`, `0496`,
  > `0484`, `0483`; `0504` closed. ⛔ **The sprint is still not closed.** `0474`'s first trial log
  > (`reports/2026-10-11-plan-review-trial-0504.md`) records the owner's view after one task: *"worth it, but I would
  > like to do a couple of other tasks with it too"* — the trial continues.
- ⚠️ **`0395`'s V5 is PENDING the owner's push** — the first CI run after it must finish green well under the
  new 33-min timeout. Not verified.
  > ✅ *Dated note 2026-10-14 (sync `79a7dbf`→`baf6a4e`):* **V5 met as written** — `0395`'s brief gained an evidence
  > note (2026-10-10, spawned producer at the lead's direction): the first CI run after the change finished green in
  > **12m17s** inside 33 min; later runs 9–12.5 min. ⚠️ Headroom is now **~2.65×**, below the ~3× ruled at the plan
  > gate — recorded as an observation, nothing filed. The task stays agent-closed, not owner-verified.
- **Board edits recorded:** each pulled row on the Backlog board now leads with `➡️ Moved to Sprint 10 —
  priority P<n>` (row kept), per the Backlog board's *"Off:"* rule.

## Related
- [[tasks/sprint-11-fkit-aiboard-convergence]] — the board that left `10` empty; Sprint 10 opened after it closed
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — where every row was pulled from, and where `0483`–`0491`, `0496`–`0503` were filed
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the loop that drove it
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]] — the line-3 banner
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — why new rows append
- [[tasks/overhaul-the-readme-for-first-time-visitors]] — `0478`, deliberately not on this board (already closed)
- [[decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log]] · [[decisions/adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode]] · [[decisions/adr-055-a-spawned-coder-writes-under-one-declared-approval-marker-from-either-driver]] · [[decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default]]
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`, closing a one-way link):* [[systems/fkit]] — fkit · [[systems/testing-and-verification]] — Testing & Verification
- *Added 2026-10-14 (sync `79a7dbf`→`baf6a4e`):* [[tasks/answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn]] — `0504`, `P18`
- *Added 2026-10-15 (sync `baf6a4e`→`96c7263`):* [[tasks/add-a-why-not-what-code-comment-rule-and-remove-the-rules-that-contradict-it]] — `0506`, `P20` · [[tasks/document-how-depends-on-lines-are-read-in-the-dependency-declaration-form-page]] — `0501`, `P21` · [[tasks/fix-nine-stale-line-cites-and-claims-found-during-sprint-10]] — `0496`, `P22` · [[tasks/check-the-links-in-fkits-top-level-docs-not-only-under-ai-agents]] — `0484`, `P23` · [[tasks/stop-the-board-reader-failing-when-a-task-folder-moves-between-its-check-and-its-read]] — `0483`, `P24`
