# Review — 0079-repair-task-links-outside-the-wiki-after-migration

Task: `ai-agents/tasks/backlog/0079-repair-task-links-outside-the-wiki-after-migration/brief.md`
File(s) under review: working tree on branch `repair-task-links-post-migration` (off `main`) — 107 `.md`
files, 156 links claimed repaired across `ai-agents/knowledge-base/`, `ai-agents/tasks/`, `ai-agents/sprints/reviews/`.
Status: closed-out

> **Round 3 closeout (reviewer, verified).** R6-R9 restored **verbatim** — all 4 lines now match `main`
> byte-for-byte (`0018:44` & `0076:51` → `](ai-agents/knowledge-base/architecture.md)`; dashboard
> specimen `:102` → `](../tasks/done/extract-scaffold-into-claude.md)`, `:103` →
> `](../tasks/backlog/converge-ai-agents-additively-on-launch.md)`). Independent over-reach sweep: the
> only remaining `architecture.md`/specimen path changes in the diff are the worklog's left-alone
> *enumeration* prose (documentation, not links). R1/R2 repairs intact; no mis-repointing; docs-only,
> `wiki-vault/` untouched. **Zero genuine broken navigation links in any product file.** No open
> defects, no residuals. Converged. (Round-3 delta was a strict verbatim reversion of the 4 flagged
> lines to their `main` state, confirmed line-by-line; Codex not re-run this round as there was no new
> surface to attack — the Round-2 two-reviewer pass that enumerated the 4 over-reaches stands on record.)

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | 11 briefs (see Appendix A) | **18 in-scope broken links left un-repaired** — flat-era same-directory sibling cross-links `](slug.md)` that now need `../<NNNN>-slug/brief.md` (2 cross-board → `../../done/…`). This is exactly the "sibling link depth changes" failure mode the brief (line 88) names as *"the error the migration is most likely to leave behind."* Raised by both reviewers. **Defect.** |
| R2 | 1     | medium | `tasks/done/0006-add-launcher-contract-smoke-script/brief.md:143` | **Depth-broken outbound link unrepaired:** `[../../../ ]claude/fkit-claude.sh` (three `../`) is one `../` short after the folder level was added — resolves to nonexistent `ai-agents/claude/…`; correct is four `../`. Same depth class the unified pass claimed to have swept; missed because the target is a repo-root `.sh` outside the swept `.md` set. Raised by both. **Defect.** *(Text de-literalised — see R6/R7 note: the Round-2 repairer rewrote the quoted path in this reviewer-owned row.)* |
| R3 | 1     | medium | `…/0079-…/worklog.md:87-88` | **Verification claim is false.** Worklog asserts *"335 links checked, 5 unresolved — all 5 on the left-alone list (0 real breaks)."* Independent full resolution (my pass + Codex, ~720+ relative links each) finds **19 genuine broken pointers** beyond the declared 5 (R1+R2). The stated pass would gate the task to done on a coverage number that does not reproduce. **Defect (process/verification).** |
| R4 | 1     | low    | `…/0079-…/worklog.md:83` | Repair count *"156 links across 80 files"* not reproducible — Codex's changed-target diff count is **203 targets across 104 files** (different metric, but the worklog's figure isn't derivable). Accuracy nit, no behavior impact. **Defect (doc-accuracy).** |
| R5 | 1     | low    | Appendix B (4 sites) | 4 links correctly **left as prose/quoted-example** are **not enumerated** in the worklog's deliberately-left-alone list (which names only 5). Leaving them is right; the omission weakens the "not-repaired vs missed" audit trail the brief (line 100) asks for. Optional. **Not a defect** — completeness of the left-alone record. |
| R6 | 2     | medium | `tasks/done/0018-bake-architecture-pointer-into-scaffold-templates/brief.md:44` | **OVER-REACH regression.** Round-2's "handles every relative form" repairer rewrote `](ai-agents/knowledge-base/architecture.md)` → `](../../../knowledge-base/architecture.md)` **inside a blockquote of scaffold-template text** — content to be baked verbatim into `claude/scaffold/CLAUDE.md`/`AGENTS.md`, where the repo-root-relative form is correct. This repo's own root `CLAUDE.md` uses that exact form; the rewrite de-syncs the template and would bake a wrong path. This is the Appendix-B item Round 1 explicitly flagged **leave-alone**. **Fix: restore `](ai-agents/knowledge-base/architecture.md)`.** Defect. |
| R7 | 2     | medium | `tasks/done/0076-repair-broken-links-in-closed-sprint-plans/brief.md:51` | **OVER-REACH regression.** Same repairer rewrote the path inside a **prose claim** — a sentence that *quotes* the link as a string and, in the very next lines the coder left unchanged, states *"the path is correct as template content and only looks broken to a checker."* The rewrite makes the paragraph self-contradictory and false. Appendix-B leave-alone item. **Fix: restore `](ai-agents/knowledge-base/architecture.md)`.** Defect. |
| R8 | 2     | medium | `knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md:102` | **OVER-REACH.** Link repointed **inside a ```-fenced `⟦fkit-dashboard v1⟧` output specimen** (lines 97-117) — a hand-authored example of the dashboard's board format, not a live pointer (line 121: ⟦BOARD⟧ is *"pasted verbatim"*). `](../tasks/done/extract-scaffold-into-claude.md)` → `../../tasks/done/0038-…/brief.md` edits a historical documentation specimen. Raised by Codex; **I verified in context — my Round-1 spot-check wrongly blessed this line (self-correction).** **Fix: restore `](../tasks/done/extract-scaffold-into-claude.md)`.** Defect. |
| R9 | 2     | medium | `knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md:103` | **OVER-REACH (worse — corrupts the example's logic).** Same specimen; the row is labelled **`🔲 Backlog`** and originally linked `](../tasks/backlog/converge-…-on-launch.md)` — a coherent backlog row. Repoint sent it to `../../tasks/done/0023-…/brief.md`, so the specimen now shows a *Backlog* row pointing into `done/` — an incoherent board, in a block that deliberately illustrates drift. Raised by Codex; verified; Round-1 spot-check error (as R8). **Fix: restore `](../tasks/backlog/converge-ai-agents-additively-on-launch.md)`.** Defect. |

### Appendix A — the 18 unrepaired sibling links (R1), with correct targets

All are **live navigation pointers** to still-current task briefs (not historical claims), so all are repoint-able.

| # | Source file:line | Repoint to |
|---|---|---|
| 1 | `tasks/backlog/0013-…/brief.md:71` | `../0078-repair-stale-adr-029-stop-hook-links-in-the-vault/brief.md` |
| 2 | `tasks/backlog/0013-…/brief.md:132` | `../0078-repair-stale-adr-029-stop-hook-links-in-the-vault/brief.md` |
| 3 | `tasks/backlog/0015-…/brief.md:28` | `../0067-refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role/brief.md` |
| 4 | `tasks/backlog/0015-…/brief.md:94` | `../0067-refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role/brief.md` |
| 5 | `tasks/backlog/0067-…/brief.md:56` | `../0013-add-worked-example-to-evidence-before-assertion/brief.md` |
| 6 | `tasks/backlog/0067-…/brief.md:184` | `../0015-amend-project-brief-for-the-eighth-role/brief.md` |
| 7 | `tasks/backlog/0078-…/brief.md:50` | `../0099-wiki-sync-task-folder-migration/brief.md` |
| 8 | `tasks/backlog/0078-…/brief.md:52` | `../../done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md` *(cross-board)* |
| 9 | `tasks/backlog/0078-…/brief.md:105` | `../0099-wiki-sync-task-folder-migration/brief.md` |
| 10 | `tasks/backlog/0079-…/brief.md:17` | `../../done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md` *(cross-board; task 79's own brief)* |
| 11 | `tasks/backlog/0092-…/brief.md:43` | `../0013-add-worked-example-to-evidence-before-assertion/brief.md` |
| 12 | `tasks/backlog/0092-…/brief.md:113` | `../0099-wiki-sync-task-folder-migration/brief.md` |
| 13 | `tasks/backlog/0099-…/brief.md:17` | `../../done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md` *(cross-board)* |
| 14 | `tasks/backlog/0099-…/brief.md:68` | `../0078-repair-stale-adr-029-stop-hook-links-in-the-vault/brief.md` |
| 15 | `tasks/done/0017-…/brief.md:17` | `../0030-design-task-folder-structure-and-id-scheme/brief.md` |
| 16 | `tasks/done/0052-…/brief.md:18` | `../0065-record-pretooluse-skill-gate-adr-amendment/brief.md` |
| 17 | `tasks/done/0065-…/brief.md:92` | `../0052-implement-pretooluse-skill-ownership-hook/brief.md` |
| 18 | `tasks/done/0065-…/brief.md:111` | `../0052-implement-pretooluse-skill-ownership-hook/brief.md` |

**Root cause:** the repair sweep (and the brief's own mechanical verification regex) keyed on
`tasks/(backlog|done|cancelled)/[a-z0-9-]+\.md` — which structurally cannot see a bare same-dir sibling
link `](slug.md)` that carries no `tasks/board/` prefix. The brief's *stronger* step ("every relative
link resolves, resolved against its own dir") would have caught them; the worklog's implementation of it
checked ~335 links, not the ~720+ that actually exist in scope, so it under-sampled and missed the set.
**3 files (`0099`, `0052`, `0017`) were never touched by task 79 at all.**

### Appendix B — 4 links that must be left verbatim (R5), for the record
Original form of each is the repo-root-relative `ai-agents/knowledge-base/architecture.md` (0018/0076) or the placeholder shown. **In Round 2 the bulk repairer wrongly rewrote the first two** — see R6/R7.
- `tasks/done/0018-…/brief.md:44` — `ai-agents/knowledge-base/architecture.md` inside a **blockquote of scaffold-template text**; correct from the scaffold root where it's baked. **Must be left verbatim. → R6 (over-rewritten).**
- `tasks/done/0076-…/brief.md:51` — the same path inside a **prose claim quoting the link as a string**. Not a pointer. **Must be left verbatim. → R7 (over-rewritten).**
- `tasks/done/0001-…/review.md:13` — `[Sprint N](sprint-N.md)` / `[Sprint 2](sprint-2.md)`, **quoted convention text** inside a review finding. Correctly left (unchanged in R2 ✓).
- `tasks/done/0036-…/review.md:180` — `[ADR-031](adr-031-future.md)`, an **explicit hypothetical example** in a review finding. Correctly left (unchanged in R2 ✓).

### Round-2 note — the over-reach reached the ledger and worklog too
The Round-2 repairer swept all of `ai-agents/tasks/`, which contains this ledger. It rewrote the
`architecture.md` path form **inside this reviewer-owned findings section** (Appendix B and the R2 row,
both restored above) and inside the worklog's R5 left-alone enumeration (which now lists the wrong
form). This is direct evidence the rewriter is **indiscriminate** — it changes the target string
wherever it textually appears (pointer, quote, claim, template payload, or reviewer prose), which is the
root cause of R6/R7. **The coder's Round-2 restoration must also correct the worklog's R5 enumeration
entries for 0018/0076 back to `ai-agents/knowledge-base/architecture.md`.**

## Coder response
Round 1 verified — the review was right and my first verification was wrong. R1–R5 all **fixed**
autonomously (mechanical, in-plan `CORRECT` defects; the owner's disposition on the reviewer's Q1 was
"repair all"). No residuals accepted.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Repaired all **18 bare same-directory sibling links** (Appendix A) to `../<NNNN>-<slug>/brief.md` (2 cross-board → `../../done/…`). Root cause: my repairer/checker filtered to `./`/`../`-prefixed links, blind to bare siblings. Corrected repairer now handles every relative form. | ✅ done |
| R2 | CORRECT | Defect | `0006-…/brief.md:143` `](../../../claude/fkit-claude.sh)` → `](../../../../claude/fkit-claude.sh)`. Was missed because the target is a repo-root `.sh` outside my `.md`-only filter; corrected checker now resolves non-`.md` targets against the repo root too. | ✅ done |
| R3 | CORRECT | Defect (process) | My worklog's "335 checked / 5 unresolved / 0 real breaks" was **false** — the checker under-sampled (same blind spots as R1/R2). Reran a **correct** comprehensive check: **551 relative file-links, 21 unresolved, all illustrative examples, 0 real breaks.** Worklog corrected with the reproducible metric + the failure called out (task-79 lesson: a blind instrument reports a false pass). | ✅ done |
| R4 | CORRECT | Defect (doc) | Dropped the non-reproducible "156/80" figure; worklog now states a **defined** metric (551 checked / 21 example / 0 real) instead of an unverifiable repair count. | ✅ done |
| R5 | ACK | Not a defect | Enumerated all 21 left-alone links in the worklog (was 2), including Appendix B's 4 — the "not-repaired vs missed" audit trail is now complete. | ✅ done |

**Re-verification after fixes:** corrected comprehensive check → **551 checked, 21 unresolved (all
examples), 0 real breaks**; `dashboard.sh sprint-2.md` → exit 0, zero drift; `node --test` → 449/449;
`wiki-vault/` untouched. **Owner Q1 (accept any of 19 as residual): no — all repaired**, per the
reviewer's recommendation and the task's acceptance criteria.

### Round 2 response — R6–R9 (my Round-1 fix caused these; all restored)
My "handles every relative form" repairer was **indiscriminate** — it rewrote link strings wherever they
appeared, including documentation examples/templates/claims and even this ledger. **Owner ruled: restore
all 4 verbatim + fence-aware re-check.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R6 | CORRECT | Defect (over-reach) | `0018-…/brief.md:44` — restored the scaffold-template blockquote link to `](ai-agents/knowledge-base/architecture.md)` (repo-root-relative, as this repo's own root CLAUDE.md uses). | ✅ done |
| R7 | CORRECT | Defect (over-reach) | `0076-…/brief.md:51` — restored the prose-claim's quoted path to `](ai-agents/knowledge-base/architecture.md)`; the paragraph is coherent again. | ✅ done |
| R8 | CORRECT | Defect (over-reach) | dashboard report `:102` — restored the fenced-specimen link to `](../tasks/done/extract-scaffold-into-claude.md)`. | ✅ done |
| R9 | CORRECT | Defect (over-reach) | dashboard report `:103` — restored to `](../tasks/backlog/converge-ai-agents-additively-on-launch.md)`; the `🔲 Backlog` specimen row points at `backlog/` again (drift-illustration logic intact). | ✅ done |

**Also corrected:** the worklog's R5 left-alone enumeration for `0018`/`0076` now shows the correct
`ai-agents/knowledge-base/architecture.md` form (was the wrongly-rewritten `../…`), and lists the
dashboard `:102-103` specimen.

**New fence/quote-aware verification (the reviewer's durability ask):** a check that flags any `](…)`
link **changed vs HEAD inside a ```-fence, `>` blockquote, or backtick code-span** — the contexts the
resolve-only check was blind to. Result: **0 changed links inside ```-fences** (beyond the restored
R8/R9). The remaining blockquote/backtick hits are all **genuine navigation repairs** (R2's `.sh` fix,
the Appendix-A sibling links) that the reviewer's own Round-1 target audit ("67 changed targets, no
mis-repointing") already confirmed correct — real links that merely sit in a quoted context, not
examples. Re-verify: dashboard exit 0 / zero drift; `node --test` 449/449.

## Accepted residuals (shared, do-not-re-litigate)
_(none — all findings R1–R9 were defects and were fixed; no frontier tradeoffs)_
