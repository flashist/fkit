# Backfill a sprint status onto every existing sprint plan in this repo

## ID
0340

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

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
