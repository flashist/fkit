# Tighten the wiki completion-flag block — the template manufactured a dead path on every emission

**Source**: `ai-agents/tasks/done/0173-tighten-the-wiki-completion-flag-block-in-all-three-wiki-skills/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0173` · owner `fkit-coder`

## Goal

[[tasks/wiki-flag-carries-folder-id-and-brief-path]] (`0153`) made the wiki completion flag carry the task's folder ID **and** a brief path. The path half was the defect: the mandated template hardcoded `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`, so **the generator manufactured a dead pointer on every emission**, and any review ledger quoting the flag verbatim froze it forever.

[[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] (`0160`) ruled this as its Case 4 and found the live delta was **exactly two things**:

1. **`:NNN` was not prohibited.** The block banned board rank / `P<n>` and said nothing at all about line numbers.
2. **The template hardcoded `backlog/`** — in **both** the `complete` and the `partial or uncertain` lines.

**The two forms died by different routes, and the distinction is the point.** A `complete` flag says *"ready to close"*, so the producer runs `/fkit-task-done` and the folder leaves `backlog/` in the same working session — dead almost immediately. A `partial` flag says *"not ready to close"*, so the task genuinely **is** in `backlog/` when written; it dies weeks later, or never. `0160` flags the second as **the worse of the two to detect**: *"a pointer that was demonstrably correct when written."*

⚠️ **The replacement form was not in `0160`'s report.** The report's open question 7 listed three candidates and ruled none — *"⏳ Awaits the owner"* — and the owner ruled **after** the report was finalised, then ruled the report ship as-is. The ruling therefore travelled in `0173`'s brief, not in the report. A reader who consults §11 alone finds this unruled and stops.

## Key Changes

**Owner-ruled 2026-08-01 (via `AskUserQuestion` in a live `/fkit-sprint-ship-loop` session): candidate (i), FOLDER ID ONLY — no path at all.** Applied to all three of `claude/skills/fkit-wiki-ingest/SKILL.md`, `claude/skills/fkit-wiki-lint/SKILL.md`, `claude/skills/fkit-wiki-sync/SKILL.md`:

1. **Both template lines lost the path**, becoming `Task <NNNN>'s vault work is complete — ready to close` and `Task <NNNN>: partial — not ready to close`. Candidates (ii) *a location-free prose reference* and (iii) *a wildcard path* were rejected — (iii) *"is not a path any tool can open, and it is a new notation to teach."*
2. **A `:NNN` prohibition** added beside the existing rank sentence, which was left unchanged.
3. **The closing routing line rewritten** — see the review finding below.

**The accepted cost, stated rather than glossed: the producer does one lookup.** With no path there is nothing left to rot; a task is anchored by its folder-name `NNNN` prefix, assigned once and never reused ([[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] Decision 3).

⚠️ **The three blocks were NOT byte-identical, and the instruction turned on that.** `ingest` and `lint` are byte-identical to each other; `sync`'s copy carries **0-space** leading indentation where the other two carry **3**, because sync's block sits at top level while the others nest inside a numbered step. The instruction was *"make the same TEXTUAL change in all three"* — explicitly **not** *"make the three byte-identical"*. An editor told the blocks were equivalent would normalize sync's indentation and produce a diff nobody asked for. The same care `0160` §8.1 demands for `0168`.

**The rank prohibition already existed and was not to be re-added.** `0160`'s brief proposed it as new; it was not. It was left unreworded, and a changed rank sentence was defined as a *failed* verification rather than a bonus.

## Outcome

Done, **agent-closed — not owner-verified**.

⚠️ **The review's one finding was that the fix created a fresh instance of the very class it removed.** Reviewer finding R1: with the path gone from the flag, the block's closing routing line still read *"`@fkit-producer Run /fkit-task-done on <brief path>`"* — **an unbound placeholder, the same dangling-reference class struck two paragraphs above, left standing in the same block.** Compounding it, `/fkit-task-done`'s own input contract accepts a brief path or a bare folder name / slug — **a bare four-digit ID is not in that list**, and its stop conditions include *"the file does not exist"*.

The fix kept the flag pathless and rewrote the routing line to name the ID and the lookup: the caller resolves `<NNNN>` to its folder by globbing `ai-agents/tasks/*/<NNNN>-*/`, which yields the mover's first accepted input. **The owner's folder-ID-only ruling was not re-opened**, and no change to `/fkit-task-done` was needed.

**Verified shipped 2026-08-03:** no flag template in any of the three files carries a `tasks/backlog/` path (the remaining `tasks/backlog/*/brief.md` hits are the scan step's glob, which is correct), and each file carries the `:NNN` prohibition.

⚠️ **`0173` fixed the generator; it could not reach what had already been emitted.** Three old-form flags were already frozen in the vault's `log.md`. That is [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] (`0211`).

⚠️ **Its review ledger still reads `Status: in-review`** — the same record defect recorded against `0158`. The work shipped; the ledger's own status field was never flipped.

**Ordering was the whole risk, and it was declared in the brief.** `0154` (the flag-convention guard) would assert the **old** strings verbatim; had it landed first it would have pinned the defective form in a test and *enforced* a form the owner had already ruled out. `0165` (where a check on the emitted form lives) likewise had to follow, because *"a check written before the content ruling would pin today's form, including the `backlog/` hardcode."* ⚠️ **The board's ranks contradicted both**: `0154` sat at P129 and `0165` at P130, above this task's append rank of P152 — so board reading order said do them first while the dependency links said the opposite. Per [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]], the `Depends on` / `Blocks` links are the binding record.

> ⚠️ **Dated correction 2026-08-03 (lint) — the two ranks cited in the paragraph above NO LONGER EXIST; the sentence is left byte-identical as the record of the board this task faced.** Later the same day, [[tasks/specify-and-support-the-reverse-move-sprint-to-backlog]] (`0210`) reverse-moved 45 rows off Sprint 2 onto the unranked Backlog board, and **`0154` and `0165` were both among them** — a reverse move **surrenders** the rank. Looking for `P129` or `P130` on Sprint 2 today finds nothing. The dependency links are unaffected, which is the paragraph's point: **the ranks were the perishable half of that contradiction and the links were not.** Anchor both tasks by folder ID and resolve them by glob — `ai-agents/tasks/*/0154-*/`, `ai-agents/tasks/*/0165-*/`.

## Related

- [[tasks/wiki-flag-carries-folder-id-and-brief-path]] — `0153`, whose path half this removes
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, whose Case 4 ruled this
- [[tasks/wiki-skills-flag-ready-to-close]] — `0125`, which landed the flag block originally
- [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] — `0211`, the already-emitted flags this could not reach
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — Decision 3, the permanent ID that replaces the path
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why the flag routes to the producer
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — why the ordering lives in the links, not the ranks
- [[tasks/specify-and-support-the-reverse-move-sprint-to-backlog]] — `0210`, the same-day move that surrendered `0154`'s and `0165`'s ranks
- [[tasks/sprint-2-remove-omnigent]] — the board this task closed on
- [[systems/knowledge-base-structure]] — where the wiki skills and the vault sit
