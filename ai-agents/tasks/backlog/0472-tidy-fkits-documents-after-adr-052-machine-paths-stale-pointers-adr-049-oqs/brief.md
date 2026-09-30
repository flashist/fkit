# Tidy fkit's documents after ADR-052 (machine paths, stale pointers, ADR-049 OQs)

## ID
0472

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule for this initiative, own
> words (2026-09-27): *"if we already have a brief for that task, the task shouldn't start, until I
> specifically approve it (because it might change the way fkit work in general)."* Being pullable on
> the board is not his word.

[ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)
(aiboard merges into fkit) left a handful of small loose ends in fkit's own documents. None changes a
decision; each is a pointer or a status word that is now wrong, or a machine-specific path that does
not belong in git. This task tidies them — **and nothing else**.

**The rule for every item: minimal and mostly additive.** Either a dated note added, or a single
token/phrase replaced. **Archived and decision text otherwise stays word for word** — no rewording,
no reflowing, no "while I'm here" edits.

**Owner rulings behind this task** (2026-09-30, `fkit-lead` session, `AskUserQuestion`, selected
option text, relayed to a spawned producer):
- **R1 — machine paths:** *"Small cleanup task — The producer files a tiny task to replace them with a
  plain description like 'the sibling aiboard repo'. Archived text otherwise stays word for word."*
- **R2 — ADR-049's open questions:** *"Close them, cite ADR-052 — The cleanup task adds a dated note on
  ADR-049 marking OQ-1/OQ-2 resolved by ADR-052; nothing else in it changes."*

**Owner rulings on the brief's open questions** (2026-09-30, `fkit-lead` session, `AskUserQuestion`,
selected option text, relayed to the producer):
- **R3 — E3 cell (item 2):** *"Keep word + add note — Respects the log's append-only rule; the
  correction is still visible."*
- **R4 — other machine-path hits:** *"No, just the two — They're historical working files on your own
  machine, not secrets; keep 0472 small."*
- **R5 — ADR-051 link text (item 4):** *"Include it — ADR-051 is being edited anyway; fix the visible
  text only."*

## What to build

Five items. Line numbers are as found on 2026-09-30 — locate by content, not by number.

1. **Replace two absolute machine paths (R1).** Each is an absolute path to the owner's local aiboard
   checkout:
   - the closed Sprint 11 board, [`sprints/done/sprint-11.md`](../../../sprints/done/sprint-11.md),
     decision row **D3** (~line 955);
   - [ADR-051](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md),
     *§Decision* item 1 (~line 54), the parenthetical after "aiboard".

   Replace **only the path** with a plain description (R1's example: *the sibling aiboard repo*). Keep
   the surrounding formatting sensible (a description should not stay inside code backticks). Nothing
   else in either file changes.

2. **Mark the 2026-09-26 evidence log closed.**
   [`reports/2026-09-26-evidence-log-for-adr-051-aiboard-as-the-store.md`](../../../knowledge-base/reports/2026-09-26-evidence-log-for-adr-051-aiboard-as-the-store.md):
   - Add a dated note near the top: the log is **closed by ADR-052** (the decision it was gathering
     evidence for has been made) — **kept, not deleted**; no further entries.
   - Its **E3** table lists [task 0413](../../cancelled/0413-make-the-board-readers-snapshot-cache-notice-renames/brief.md)
     as **Open** while linking into `cancelled/`. ⚠️ **The log declares itself append-only**, so do
     **not** overwrite the word: keep **Open** as the 2026-09-26 reading and append a dated annotation
     in the same cell — *cancelled 2026-09-30 under ADR-052 (the reader it fixed retires)*. **Owner-ruled
     (R3, 2026-09-30).**

3. **Annotate 0415's stale "still Backlog".**
   [`0415`'s brief](../../done/0415-keep-a-closed-sprints-tasks-attached-when-its-board-is-named-plan-sprint-n/brief.md),
   `## Notes`, the "Same file as `0413`" bullet, says `0413` is *"still Backlog"*. Add a short dated
   note that `0413` was since **cancelled under ADR-052**. Do not rewrite the original sentence — it
   was true when written.

4. **Repoint the stale `0404` spike pointers.** The preserved external-expert spike now lives at
   [`tasks/done/0404-…/assets/external-expert-spike/`](../../done/0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/assets/external-expert-spike/README.md),
   but these still name `tasks/backlog/0404-…`:
   - [ADR-049](../../../knowledge-base/decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md),
     **two** plain-text mentions (~line 252, the "Reproduced, and the scripts are preserved" paragraph;
     ~line 776, the references bullet). **ADR-049 itself asks for this repoint when `0404` closes** —
     so replace `backlog` with `done` in the path and add a short dated "repointed" note so its
     "a future mover must repoint" warning reads as discharged.
   - The [2026-09-18 external-expert verdict](../../../knowledge-base/reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md)
     §8 (~line 281): the link **target already points into `done/`**; only the visible **link text**
     still says `tasks/backlog/0404-…`. Correct the link text only.
   - ADR-051's references (~line 1088) have the same stale link **text**
     (`tasks/backlog/0404-…/brief.md`, target already `done/`). Correct the visible text only.
     **In scope by owner ruling (R5, 2026-09-30).**

5. **Close ADR-049's OQ-1 and OQ-2 (R2).** In ADR-049's *§Open questions*, add a dated note marking
   **OQ-1** and **OQ-2** **resolved by ADR-052**, citing R2 (owner ruling 2026-09-30). Leave the
   questions' text, and everything else in ADR-049, unchanged. (Its `- **Status:**` line says the two
   items "remain his and unanswered" — a dated pointer there to the new note is acceptable; nothing
   more.)

**Out of scope:** any other file, any other stale pointer, any rewording. Do not touch
`ai-agents/wiki-vault/` (wiki writes are `fkit-wiki`'s only).

## Verification steps

1. `node --test test/reference-integrity.test.js` — green.
2. `node --test test/adr-number-uniqueness.test.js` — green.
3. Grep `ai-agents/` (excluding `wiki-vault/`) for the pattern `/User[s]/` (the bracket keeps this brief from matching itself): **no hits** in `sprints/done/sprint-11.md`
   or ADR-051, and **no new hits** in any file this task touched.
4. Grep ADR-049, ADR-051 and the 2026-09-18 verdict for `tasks/backlog/0404`: no hits.
5. `git diff --stat` touches exactly these files: `sprints/done/sprint-11.md`, ADR-049, ADR-051, the
   2026-09-26 evidence log, the 2026-09-18 verdict, `0415`'s `brief.md`. `git diff` shows only
   additions plus the named single-token/phrase replacements — no reworded lines.
6. Full suite green (`node --test`), since archived boards and ADRs are parsed by several tests.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word** (standing rule, quoted in *Context*).
- **Owner choice:** `fkit-coder` — pure document edits, but it runs the tests. The ADR notes are
  mechanical transcriptions of owner ruling R2, not new decisions, so no architect pass is needed.
- ✅ **Ruled 2026-09-30 (R3):** item 2's E3 cell. The lead's scoping said *correct the status word to
  Cancelled*; the evidence log declares itself **append-only**. The owner ruled: keep **Open**, append
  a dated annotation.
- ⛔ **Owner-excluded 2026-09-30 (R4) — do NOT sweep:** other hits for that pattern exist under
  `ai-agents/` — the three spike scripts under `0404`'s `assets/external-expert-spike/`, several closed
  tasks' `plan.md` / `worklog.md` / `review.md`, and one 2026-07-10 report. Only the two paths in item
  1 are in scope.
- **After it lands:** `fkit-wiki` will likely need a small re-sync (`/fkit-wiki-sync`) — the wiki has pages on
  ADR-049 and other ADRs this task touches (not checked page by page).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`.
- **Filed 2026-09-30** by a spawned `fkit-producer` at `fkit-lead`'s direction, on owner rulings R1/R2
  relayed from the lead session — no owner channel (ADR-021). Decides nothing beyond the scoping;
  ⛔ no commit.
