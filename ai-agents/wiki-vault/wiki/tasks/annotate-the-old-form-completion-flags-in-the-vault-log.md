# Annotate the old-form completion flags in the vault `log.md` before their paths die

**Source**: `ai-agents/tasks/done/0211-annotate-the-three-old-form-completion-flags-in-the-vault-log/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Backlog board (unranked, `## Priority: Unscheduled`) · ID `0211` · owner `fkit-wiki`

## Goal

[[tasks/tighten-the-wiki-completion-flag-block]] (`0173`) fixed the completion-flag **generator** in all three wiki skills. **It could not reach what had already been emitted.** Three flag lines already frozen in `ai-agents/wiki-vault/log.md` use the pre-`0173` form, which hardcoded a `backlog/` path into the flag text — **three emissions naming two distinct tasks**, `0199` twice and `0206` once.

⚠️ **The timing is the whole point, and it is easy to get wrong.** Verified on disk 2026-08-03: both named tasks were still in `ai-agents/tasks/backlog/`, so **all three paths were live and correct that day. Nothing was broken.** They die the moment either task closes or is cancelled, and unevenly — closing one kills two of the three flags, closing the other kills the third.

This is the profile [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] (`0160`) singles out as **the worse of the two to detect**: the `partial` form says in so many words *"not ready to close"*, so the task genuinely **is** in `backlog/` when the flag is written and the path is **true at the time**. *"A reader who checks these paths today finds them correct and concludes there is nothing to record. That conclusion is right about today and wrong about next week."*

## Key Changes

**A single new dated entry appended to `ai-agents/wiki-vault/log.md`** — no page created or updated, `index.md` untouched, `.wiki-watermark` unchanged.

Each old-form emission is named by **task folder ID** plus a **durable, re-derivable anchor** — the dated entry it sits in, and which of that entry's run-ending flag lines it is. **No line numbers.** The status is written as dated (*"correct as of 2026-08-03; dies when the task closes"*) rather than as a fixed fact, so the correction does not itself become a stale claim.

### Two owner rulings, both given 2026-08-03 live via `AskUserQuestion`

1. **✅ `log.md` is append-only; in-place annotation is forbidden, always.** A correction lands as a **new dated entry** naming what it corrects by folder ID and durable anchor; the originals stay **byte-identical**. This settles a collision that had been **flagged twice and left unresolved both times** — `0199`'s instruction to clear *"still open"* framing *from `log.md`* conflicts with the log being append-only; the 2026-08-03 sync raised it for human review and did not resolve it, and the lint the same day hit it and did not settle it either. **Ruled once, for `0211` and `0199` together.** It matches the log's own header, `schema.md`'s *"Append-only chronological activity log"*, and the knowledge-base correction-note form established by [[tasks/append-a-dated-correction-note-to-adr-010]].
2. **✅ Run it now, as its own task** — not folded into either named task's close, and not deferred until one closes, *because the whole lesson of the "correct at emission, dead later" class is that nobody notices at close time.* ⚠️ **"Run now" is a scheduling intent, not a board move** — the task stayed on the unranked backlog board under the owner's standing 2026-08-02 ruling.

### "Describe, don't quote" — the doctrine this task established

**The three flags are described, not quoted.** Writing out the substituted path from any of them would make the correction entry **a fourth and fifth instance of the very defect it records** — a live-today, dead-later pointer, sitting in an append-only file, unrepairable by construction.

What is quoted instead is the **form**, with the ID and slug left as unsubstituted placeholders: a template resolves to nothing and points at nothing, so the literal `backlog` inside it is the defect being described, not a claim about where any task is.

**The cost is stated rather than glossed:** a reader of the correction alone cannot see the two exact slugs that were written. That is deliberate and it is the only thing given up — the anchor lands a reader on the original with certainty, and the originals are append-only, so they are always there to be read. *A correction entry needs to be a signpost, not a replacement for the text it points at.*

## Outcome

Done, **agent-closed — not owner-verified**. Append-only preserved: the file's entire pre-existing prefix byte-identical, the diff carrying **zero deletions**.

**Two accepted residuals, both owner-ruled:**

- **AR-1** — a board-location clause about a third task (`0045`) stays as written; accepted as a residual rather than fixed.
- **AR-2** — ⚠️ **"describe, don't quote" is recorded as the *standing* form for vault corrections**, not a one-off choice for this entry. Recorded so that [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]]'s successor work inherits it.

⚠️ **A note left for the next lint, and it matters.** A dead-path scan of `log.md` **will report the two old-form templates** the correction entry quotes. They are **specimens quoted to describe a defect, with nothing substituted into them** — the same category as an existing quoted specimen on the ADR-029 page that a previous lint already carries forward. **Do not "re-fix" them, and do not substitute real IDs into them.**

⚠️ **Its review ledger still reads `Status: in-review`** — the work shipped; the ledger's own status field was never flipped.

**Deliberately not done, and recorded so it is not re-litigated:**

- **`0148`'s closed review ledger is untouched.** It carries a `backlog/` path for a task now in `done/` — **correct content in a frozen ledger, not a defect.**
- **The further prose rank citations in `log.md` are untouched.** `0160`'s report lists them and records, in its own words, that it *"has not classified which are live claims and which are frozen history"*, flagging that as unverified. Different defect class — board-rank citations in prose, not the completion-flag path form — and an unverified inventory. ⚠️ Its own line-number citations in that list were taken against an earlier, shorter version of the log and **no longer resolve, which is the same class over again.** Named as a follow-up, not filed.
- **No task was moved and no mover was invoked.** Both named tasks staying open is a *precondition* of the correction, not an oversight.

⚠️ **The routing was the load-bearing call.** `/fkit-sprint-ship-loop`'s step table names the **coder** as the builder for a generic task. **That table did not apply**: the only write surface is `ai-agents/wiki-vault/`, which [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] makes the wiki role's **exclusive** surface — a universal hard rule that **outranks a skill's step table**. A driver spawning a coder here would be asking it to break a hard rule. The close still routed to the producer, as every close does.

## Related

- [[tasks/tighten-the-wiki-completion-flag-block]] — `0173`, which fixed the generator this cleans up after
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, whose Case 4 and §5.3 define this defect class and its unswept remainder
- [[tasks/append-a-dated-correction-note-to-adr-010]] — `0143`, the correction-note form this follows
- [[tasks/wiki-flag-carries-folder-id-and-brief-path]] — `0153`, whose path form produced these emissions
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the wiki role's exclusive write gateway
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why the close routes to the producer
- [[tasks/wiki-skills-flag-ready-to-close]] — `0125`, which landed the flag block whose emissions these are
- [[tasks/sprint-2-remove-omnigent]] — the sprint whose 2026-08-03 run closed this row *(this task's own board row is on the **Backlog** board, not Sprint 2)*
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — `0141`, whose *"banner above claim"* rule the owner replaced on 2026-08-03 with `0143`'s below-the-claim form **for ordinary vault pages**; this task's append-only ruling is the carve-out that rule does not reach
- [[systems/knowledge-base-structure]] — the vault and its append-only log
- [[tasks/wiki-ingest-of-the-structure-check-design-report-and-companion-adr]] — task `0249` (2026-08-07): the append-only ruling this task settled, **obeyed under pressure** — the ingest's own three false status claims were corrected by a **new dated entry**, never an in-place edit, leaving the entry above byte-identical
- [[tasks/the-2026-08-13-vault-resync-chain]] — the chain that re-applied this task's ruling: `log.md` is append-only with **no exceptions**, so every correction is a new dated entry
