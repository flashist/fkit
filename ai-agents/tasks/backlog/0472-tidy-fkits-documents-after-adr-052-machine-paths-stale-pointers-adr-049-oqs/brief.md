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

**Owner rulings added 2026-10-02** (`fkit-lead` session, `AskUserQuestion`, selected option text,
relayed to a spawned producer) — they add items 6 and 7:
- **R6 — records that blame the migration** (question: *"Correct fkit's records that blame the
  migration (2026-09-18 report, and anything citing it)?"*): *"Yes, add to task 0472 — 0472 already
  tidies documents after ADR-052; add a dated correction note (records stay word-for-word otherwise).
  Starts on your word."*
- **R7 — `0014`'s status:** *"Yes, status field only — The test data 0296/0406 rely on is the missing
  row, which stays; only the wrong status is corrected."* This overrides the ADR-033 addendum's
  2026-09-18 ruling *"Leave it, pending 0296"* **for `0014`'s `## Status` field only**. The field
  itself was already corrected to plain `✅ Done` on 2026-10-02 by a producer (see `0014`'s
  `## Status correction — 2026-10-02` section); item 7 only records it in ADR-033.

## What to build

Five items. Line numbers are as found on 2026-09-30 — locate by content, not by number. *(Items 6 and
7 added 2026-10-02 — see below; their line numbers are as found on 2026-10-02.)*

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

### Added 2026-10-02 — items 6 and 7 (owner rulings R6, R7)

6. **Correct the records that blame commit `331f298` for the wrong `🔲 Backlog` status in the done
   briefs `0014`, `0021`, `0041` (R6).**

   **What git shows** (verified by `fkit-lead` 2026-10-02; re-checked by the producer the same day):
   - In `331f298` (2026-07-21, the ADR-029 folder migration) all three files were **pure renames,
     content unchanged (`R100`)** — e.g. `tasks/done/build-fkit-reconnect-tooling.md` →
     `tasks/done/0021-…/brief.md`. The files just before the migration already read `## Status`
     `🔲 Backlog`.
   - `0021` and `0041`: the `## Status` field already existed while they sat in `backlog/`. The
     owner's close commits `f7b23f4` and `6daf3cc` (2026-07-10, *"Task done"*) moved each file
     unchanged (`R100`) and edited the sprint plan; `## Status` stayed `🔲 Backlog`.
   - `0014`: created directly in `done/` with `🔲 Backlog` at `cd19aef` (2026-07-16).

   **So these claims are wrong:**
   - the causation — "born wrong at / created by `331f298`", "the migration wrote (or defaulted) the
     wrong status";
   - *"at close time there was no `## Status` field"* (2026-09-18 report §4.1.1; ADR-033 addendum) —
     the field existed at close. The account the report labels *"wrong"* (a human close that changed
     the brief by zero lines) is the one git supports for `0021`/`0041`;
   - the **59 days** figure (counted from 2026-07-21). The real spans to 2026-09-18 are **70 days**
     (`0021`, `0041`) and **64 days** (`0014`). *"Two months"* as a length of time roughly holds; its
     link to the migration does not;
   - the **3.75% / 2.97%** "migration error rate" — the migration wrote none of the three.

   **What to do:** in each file below, add **one dated correction note** (2026-10-02, citing R6 and
   the commits above) at the first passage that makes the claim, and have it name every other line in
   that file that repeats it (a one-line pointer at a repeat is acceptable). ⛔ **Do not rewrite or
   delete any original sentence — including quoted text** (the expert's, Codex's or another role's
   verbatim words stay verbatim).
   - `knowledge-base/reports/2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md` —
     primary note at **§4.1.1** (~:645–685: the born-wrong story, the 3.75%/2.97% block, "59 days",
     the attribution paragraph). Repeats: ~:81, ~:693 (§4.1.2), ~:705 (§4.1.3), ~:1475–1485 (Q12),
     ~:1546, ~:2071 (method table). The same note should say that `0014`'s status was corrected to
     `✅ Done` on 2026-10-02 (R7), so the report's "one record still wrong" lines (~:79, ~:703,
     ~:709, ~:1196) are out of date.
   - `knowledge-base/reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md` —
     ~:51 (*"born wrong in one bulk migration"*), ~:162 (*"born-wrong records"*).
   - `knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md` — §6 ~:357–358,
     and ~:468 (risk table, *"the `331f298` precedent"*).
   - `knowledge-base/reports/2026-09-30-eval-aiboard-as-fkits-single-task-store.md` — ~:413–414,
     ~:559.
   - `knowledge-base/reports/2026-09-30-eval-task-ids-keep-0404-or-rekey.md` — ~:149.
   - **ADR-033**, the addendum's *"A correction to the record…"* paragraph (~:188–193). The note must
     name these sentences explicitly as wrong: *"At close time there was no `## Status` field at
     all"*, *"The field arrived with the folder migration, commit `331f298`"*, and *"which **created
     both briefs inside `done/` with `## Status` written as `🔲 Backlog`.** They were born wrong, not
     drifted."* — all three files were `R100` renames. The addendum's conclusion (plain `✅ Done`; the
     owner closed both) is unaffected.
   - **ADR-049** ~:247 — it quotes the expert's *"born wrong in one bulk migration"*. Note that the
     quoted claim is corrected; the quote stays.
   - **ADR-052** ~:151–152 (*"the reason the converter is paranoid"*) and ~:408 (risk 1, *"the
     `331f298` precedent"*).
   - Backlog briefs that repeat the sentence: `0407` (~:46) and `0435`, `0436`, `0437`, `0438`,
     `0440`, `0441`, `0442` (each ~:28, the *"Trial runs only"* paragraph).

   ⚠️ **The correction reopens no decision.** ADR-052's converter safeguards (D8: trial run,
   refuse-on-ambiguity, byte-level diff) stand; the notes correct the cited *precedent* only. A true
   precedent remains and a note may say so: a duplicated status field went wrong at close or creation
   and nothing caught it for 64–70 days. ⛔ If the architect judges that a decision's reasoning actually
   rested on the migration story, **stop and put it to the owner** — do not settle it in a note.

   **Leave alone** — these name `331f298` as a commit reference, not as the cause (checked
   2026-10-02): closed task files under `tasks/done/` (`0079`, `0118`, `0119`, `0132`, `0160`, `0359`),
   `conventions/dual-home-parity.md`, `reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md`,
   and the 2026-09-18 verdict's ~:216 (timestamp backfill advice).

   **Wiki — not this task's to edit (`fkit-wiki` only).** Pages that repeat the claim, for a
   `fkit-wiki` sync after this lands: `wiki/decisions/adr-033-…` ~:87–88; `wiki/decisions/adr-052-…`
   ~:43–44 and ~:185; `wiki/tasks/build-fkit-reconnect-tooling.md` ~:19–20;
   `wiki/tasks/fix-claude-agents-md-placeholder-text.md` ~:20. Also
   `wiki/tasks/align-conventions-readme-enforcement-item-live-vs-scaffold.md` (`0014`'s status is now
   `✅ Done`).

7. **Record R7 in ADR-033.** The addendum's *"What a future agent may NOT take from this"* bullet on
   `0014` (~:207–209) says it was *"deliberately left alone … must not be swept in later"*. Leave that
   text; add a dated note under it: on **2026-10-02** the owner overrode *"Leave it, pending 0296"*
   **for `0014`'s `## Status` field only** (R7). A producer wrote plain `✅ Done` — **no**
   `(agent-closed — not owner-verified)` marker — on the owner's confirmation that he closed it himself
   (*"Yes, I did — Plain '✅ Done' (you committed it along with the work on 2026-07-16)."*, recorded in
   [`0014`'s brief](../../done/0014-align-conventions-readme-enforcement-item-live-vs-scaffold/brief.md)).
   **The missing board row stays**, as the specimen for `0296` and `0406`. The note widens the
   2026-09-18 grant to nothing else.

**Out of scope:** any other file, any other stale pointer, any rewording. Do not touch
`ai-agents/wiki-vault/` (wiki writes are `fkit-wiki`'s only). *(2026-10-02: items 6 and 7 add exactly
the files they list; everything else stays out.)*

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

*Added 2026-10-02, for items 6 and 7:*

7. Step 5's file list grows by exactly the files item 6 lists, plus ADR-033 (already listed via item
   6). In each, `git diff` shows **added lines only** — zero removed lines.
8. Grep `ai-agents/` (excluding `wiki-vault/`) for `331f298`, `born wrong`, `born-wrong`, `59 days`,
   `two months`: every hit that claims the migration caused the wrong status sits in a file that now
   has a 2026-10-02 correction note naming it. Hits in item 6's "leave alone" list are untouched.
9. ADR-033: the `0014` bullet text is unchanged, with a dated note under it citing R7.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- ⛔ **Do not start without the owner's specific word** (standing rule, quoted in *Context*).
- **Owner choice:** `fkit-coder` — pure document edits, but it runs the tests. The ADR notes are
  mechanical transcriptions of owner ruling R2, not new decisions, so no architect pass is needed.
  *(2026-10-02: for items 6 and 7 the ADR notes — ADR-033, ADR-049, ADR-052 — go through an
  `fkit-architect` consult, per `fkit-lead`'s direction. They correct an ADR's own causal story and a
  decision's cited reason, so they are not purely mechanical.)*
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
- **Extended 2026-10-02** (items 6 and 7) by a spawned `fkit-producer` at `fkit-lead`'s direction, on
  owner rulings R6/R7 relayed from the lead session — no owner channel (ADR-021). ⛔ **The "do not
  start without the owner's word" rule still applies to the whole task, items 6 and 7 included** —
  R6's *"Starts on your word"* means the owner gives that word later; he has not given it yet. No status change; ⛔ no commit.
