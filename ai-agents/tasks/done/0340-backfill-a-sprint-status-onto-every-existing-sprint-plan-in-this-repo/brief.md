# Backfill a sprint status onto every existing sprint plan in this repo

## ID
0340

## Sprint
Sprint 8

## Priority
P3

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-producer

## Context

`0337` gives sprints an explicit status; `0338` makes the selector require `In progress` to treat a
plan as active. **Until this repo's own plans carry a status, the selector finds nothing active here**
(`0338` verification step 3 records the expected `active none` + drift before this lands). This is the
data migration — this repo's records, not the product — so it is a producer act, separate from the
coder's `0338`.

Plans on disk, checked 2026-08-25:

- `ai-agents/sprints/sprint-6.md` — open, live, no status banner; line 3 is currently the first line
  of the *Authority* blockquote (`sprint-6.md:3`).
- `ai-agents/sprints/done/sprint-1.md` … `sprint-5.md` — each opens with `> ## 🔒 CLOSED — <date>.`
  at line 3 (four with `Superseded by [Sprint N+1]`; Sprint 5 without, by owner ruling recorded at
  `sprints/done/sprint-5.md:3-12`). If the `0337` ADR reads that banner as `Done`, these may need no
  edit — check the ADR's ruling, do not assume.
- `ai-agents/sprints/backlog.md` — identity `Backlog`, never a sprint; gets **no** sprint status.
- `claude/scaffold/ai-agents/sprints/` ships only an empty `done/` — nothing to backfill there
  (README wording is `0339`'s).

## What to build

1. Insert the **line-3 status banner** with `🔄 In progress` into `sprint-6.md` — SD-1 ruled
   2026-08-25, verbatim **"Line-3 banner (Recommended)"** — in the exact grammar the `0337` ADR fixes
   and `0338` parses (the same position the archived plans' `> ## 🔒 CLOSED — <date>.` occupies at
   `sprints/done/sprint-*.md:3`). Today line 3 of `sprint-6.md` is the opening of the authority
   blockquote; the banner goes above it as its own line-3 blockquote per the ADR's grammar, and the
   authority note moves down unchanged. Nothing else in the file changes.
2. For each plan under `sprints/done/`: the ADR reads the legacy `🔒 CLOSED` banner as `Done`
   (`0337` point 2) — leave each byte-identical and record that in the report. Only if the accepted
   ADR's grammar turns out **not** to admit the legacy form, rewrite line 3 to the new `Done` form
   with the banner's own date, touching no other line. `sprints/cancelled/` does not exist yet and
   is not created here (the mover `0341` creates it on first use).
3. Re-run the selector and the board renderer and paste their output verbatim into the task's
   `worklog.md`.

## Verification steps

1. `bash .claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` lists exactly
   `sprint-6.md` / `Sprint 6` as active and chosen, `backlog.md` as a `Backlog` candidate, and emits
   no `sprint-status-*` drift fact.
2. `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/done/sprint-5.md` renders and
   reports no sprint-level drift; same for `sprint-1..4.md`.
3. `git diff --stat` touches only `ai-agents/sprints/sprint-6.md` and, if the ADR requires it,
   `ai-agents/sprints/done/sprint-*.md`; `git diff` on each done plan is one added carrier and nothing
   else.
4. `/fkit-status` with an empty argument reports Sprint 6 and only Sprint 6.

## Notes

- **Owner: fkit-producer** — board/plan edits are the producer's; no code.
- **Depends on:** 0337 (the carrier grammar), 0338 (the reader that verifies it — step 1 cannot pass
  without it).
- **Blocks:** nothing — but until it lands, `/fkit-status` on this repo reports no active sprint.
- **Not in scope:** any consuming project's plans — a project that upgrades fkit has the same
  migration to do; `0339`'s README/convention text must say so (flagged to `0339` here).

### 🆕 2026-08-29 — CORRECTED, original words above kept byte-identical: Sprint 6 has been ARCHIVED

⚠️ **This brief was written 2026-08-25, when `sprint-6.md` was the open, live plan. It is not any
more.** On **2026-08-29** Sprint 6 was archived — **`21 done — of 21`, zero open rows** — by a spawned
`fkit-producer` following the `0294` procedure, and the file now lives at
[`ai-agents/sprints/done/sprint-6.md`](../../../sprints/done/sprint-6.md) carrying the legacy line-3
`> ## 🔒 CLOSED — 2026-08-29.` banner. ⛔ **That archival carried NO owner ruling** — it is recorded on
the plan's own banner as agent-performed and not owner-verified.

**What that changes here — re-derive all of it at pickup, do not trust the text above:**

1. **`## What to build` step 1 is SPENT as written.** It says *"Insert the line-3 status banner with
   `🔄 In progress` into `sprint-6.md`"*. There is **no open plan left to backfill** —
   `ai-agents/sprints/` now holds only `backlog.md` (identity `Backlog`, which the brief above already
   excludes from getting a sprint status) plus `done/` and `reviews/`. ⚠️ **Do not stamp `🔄 In progress`
   onto a 21-of-21 board** — that would assert a status the board does not have.
2. **Step 2 now covers SIX plans, not five** — `sprints/done/sprint-1.md` … `sprint-6.md`. Sprint 6's
   banner is in the same legacy `🔒 CLOSED` form as the other five, so the same ruling applies: if the
   `0337` ADR reads that form as `Done`, leave it byte-identical.
3. **All four `## Verification steps` are STALE.** Step 1 expects `select-active` to return
   `sprint-6.md` as active; step 3 expects the diff to touch `ai-agents/sprints/sprint-6.md`; step 4
   expects `/fkit-status` to report Sprint 6. **Measured 2026-08-29 after the archival,
   `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` returns `active none`
   with `backlog.md` as the only candidate (exit 3)** — the same no-active-sprint state that held
   between Sprint 5's archival and Sprint 6 opening. ⛔ **Rewrite these steps against whatever the board
   state actually is at pickup**; whether an active sprint exists then depends on the still-open
   question of opening Sprint 7.
4. **`## Notes` "Blocks: nothing"** — still true, but the reason has shifted: `/fkit-status` reports no
   active sprint *today*, before this task lands, because there is no open plan at all.

*Recorded by a spawned `fkit-producer`, 2026-08-29, as part of the Sprint 6 archival. No owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md));
nothing here rules on anything — it records measured state and flags what to re-derive.*

## ⭐ NOTE APPENDED 2026-09-10 — RE-RANKED `P6` → `P3`, AND THE SCOPE IS NOW ONE LINE IN ONE FILE

⛔ **Nothing above is rewritten.** This is a dated note appended beside the existing text, per the
house pattern. ⚠️ **Everything above this line was written 2026-08-25 and corrected once on
2026-08-29; both are now 16 days stale. Re-derive from HERE, not from the `## Context` above.**

### 1. ⭐ THIS TASK NOW RUNS BEFORE `0338` — OWNER RULING, 2026-09-10

**Authority: owner ruling of 2026-09-10**, given live via `AskUserQuestion` in the `fkit lead` session
driving `/fkit-sprint-ship-loop` — a selection from the question's option list, and **the option label
is the verbatim text: "Re-order — 0340 before 0338 (Rec)"**. Recorded as ruling `S6` on
[Sprint 8](../../../sprints/sprint-8.md), under its heading
*"⚠️ THE RE-ORDER OF 2026-09-10 — `0340` AND `0338` SWAPPED RANKS, AND WHY"*.

⛔ **The reason is a measured defect, not a preference.** `0338` makes `In progress` a rung of
eligibility; this task is what puts the banner on the Sprint 8 board; and the owner ruled that board
opens with **no** banner. ⛔ **So in the window where `0338` has shipped and this task has not, the
live Sprint 8 board resolves `unresolved` → ineligible → `select-active` returns `active none`,
exit 3 — and `/fkit-status` and the empty-argument ship-loop lose the board they are driven from.**
⭐ **Shipping this task first removes the window entirely.**

### 2. ⛔ `## Notes` "Depends on: 0337, 0338" — CORRECTED, AND THE LINE ITSELF IS UNCHANGED

⭐ **Only `0337` is a work dependency.** The existing line names `0338` as *"the reader that verifies
it — step 1 cannot pass without it"* — ⛔ **read the parenthesis: that is a VERIFIER, not an input.**
This task's work is inserting a line-3 banner in the grammar `0337`'s ADR fixes; it needs the grammar
and nothing else.

⚠️ **What that costs, stated plainly: `## Verification steps` step 1 CANNOT PASS AT `P3`.** It runs
`select-active` and expects the banner read back, and the rung that reads it arrives with `0338` at
`P6`. ⭐ **This does not block the task — it defers its proof.** Check the banner **by inspection**
against the accepted `0337` ADR, record in `worklog.md` that the machine-read proof is deferred, and
⛔ **do not report success criterion (a) as met.** `0338`'s verification is where (a) is demonstrated.

### 3. ⛔ THE SCOPE IS SMALLER THAN THE TITLE — ONE LINE, ONE FILE

**Re-measured on disk 2026-09-10:**

| The `## Context` above says | Measured today |
|---|---|
| the top holds `sprint-6.md` + `backlog.md` | ⛔ **`backlog.md` + `sprint-8.md`.** `sprint-6.md` was archived 2026-08-29 |
| `sprints/done/sprint-1..5.md` — five plans | ⛔ **`sprint-1.md` … `sprint-7.md` — SEVEN**, every one carrying `> ## 🔒 CLOSED — <date>.` at line 3 |

⭐ **`## What to build` step 2's conditional is now CLOSED by owner ruling.** That step says to rewrite
the archived plans *"only if the accepted ADR's grammar turns out not to admit the legacy form"*. The
owner ruled 2026-09-10, verbatim option label **"Keep — permanent compat rung (Rec)"**: ⛔ **the legacy
`> ## 🔒 CLOSED — <date>.` banner reads as `Done` PERMANENTLY.** ⛔ **So this task rewrites NONE of the
seven** — all seven end byte-identical, and the report records that.

⭐ **THE ENTIRE REMAINING DELIVERABLE:** insert the `🔄 In progress` line-3 banner into
`ai-agents/sprints/sprint-8.md` — **one line, one file** — then step 3's report. ⛔ **`## What to
build` step 1's "into `sprint-6.md`" is SPENT; the target is the Sprint 8 board.**

⚠️ **THE TITLE OF THIS TASK OVERSTATES IT AND IS NOT BEING CHANGED.** *"onto every existing sprint
plan"* is no longer what this does. ⛔ **The folder is deliberately NOT renamed**: a rename moves a
task folder, which is exactly the link-surface hazard `0381` exists to fix and `0381` has not shipped
— it would re-point every inbound link and invalidate `NAMED_EXEMPT` keys no mover has a step for.
⭐ **This brief is the live scope; the title is an identifier, not a specification.**

### 4. ⚠️ ALL FOUR `## Verification steps` REMAIN STALE — REWRITE THEM AT PICKUP

The 2026-08-29 note above already said so; it is still true and the target has changed again. Steps 1,
3 and 4 name `Sprint 6`/`sprint-6.md`, which is archived. ⛔ **Rewrite all four against `sprint-8.md`
and the seven-plan `done/` directory**, and honour item 2 above on step 1.

*Recorded by a spawned `fkit-producer`, 2026-09-10, with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
The re-rank and the legacy-banner ruling are the owner's, relayed by the `fkit-lead` session; every
figure above was re-measured on disk by this producer before being written. Nothing here rules on
anything the owner did not.*
