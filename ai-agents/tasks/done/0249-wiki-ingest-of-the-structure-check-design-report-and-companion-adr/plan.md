# Plan — 0249: Wiki ingest of the structure-check design report and the companion ADR

> Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-07 — verbatim
> selected option: **"Approve (Recommended)"**, which per the question's wording also ratifies the
> cross-linked shape (the six verbatim rulings live on the ADR-039 page, cross-linked from the 0241
> design page — not duplicated). Plan authored by a spawned fkit-coder (`/fkit-plan-task`),
> presented by the fkit-lead driver, written to this file by the driver in the approval turn
> (fkit-sprint-ship-loop §Durable artifacts). Build worker: a spawned **fkit-wiki** (ADR-038: the
> step's role follows the skill; ADR-005: vault writes are fkit-wiki-exclusive).

**Task:** `ai-agents/tasks/done/0249-wiki-ingest-of-the-structure-check-design-report-and-companion-adr/brief.md`
(Sprint 4 P8, owner **fkit-wiki**). Build worker: a spawned `fkit-wiki` running `/fkit-wiki-ingest`
(ADR-038: the step's role follows the skill; ADR-005: vault writes are fkit-wiki-exclusive). This
plan specifies WHAT the ingest must cover; the wiki worker's own skill governs page shape, linking,
backlinks, and `log.md` convention (brief item 3 says exactly this).

## Verified ground truth (this pass, on disk)

- **Dependency 0242: satisfied.** The companion ADR exists — it landed as **ADR-039**
  (`ai-agents/knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md`,
  status accepted, filed 2026-08-07; all six rulings dated 2026-08-06). The brief calls it "the
  `0242` ADR" by task number — same artifact. `0248` is in `tasks/done/` (ordering preference met).
- **Item 1 (the report) is already largely discharged.** Vault `log.md` (entry ending "Task 0238",
  around line 1744) records a prior sync ingesting the report into
  `wiki/tasks/design-the-post-update-structure-check.md` — "this also discharges item 1 of task
  0249's scope (the report half)". That page exists and carries the design (hybrid, consent model,
  trigger, v1 scope, provenance of the rulings).
- **The vault now carries FALSE claims this ingest must fix** (they are this ingest's own subject):
  - `wiki/tasks/design-the-post-update-structure-check.md` §Outcome: "**The companion ADR is not
    yet recorded** — until `0242` lands, ADR-015 remains the last word on disk."
  - `wiki/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md` (banner ~L62):
    "the companion ADR is not yet recorded (task `0242`, Backlog)".
  - `index.md` L274 (0241 row): "⚠️ **the companion ADR (`0242`) is not yet recorded**".
- No `adr-039` page exists in `wiki/decisions/` (pages stop at adr-038). ADR-015's vault page
  exists, so brief verification step 2's conditional fires: it must point at ADR-039.

## Steps (all writes inside `ai-agents/wiki-vault/` only)

1. **Create the ADR-039 decisions page** (`wiki/decisions/adr-039-...`, name per vault convention).
   Must carry:
   - the one-line decision: unattended launch path keeps ADR-015's invariant unchanged; a separate
     in-session, owner-present, consent-gated repair is licensed; **v1 = replacement of
     untouched-stale fkit-authored files only — no move, no rename, no delete**;
   - the **six owner rulings with their verbatim wording**, dated 2026-08-06, channel named
     (`AskUserQuestion`, live `fkit lead` session): "Companion ADR (Recommended)", "Plan-level
     approval (Recommended)", "Yes + yes (Recommended)", "Yes, producer (Recommended)",
     "Yes (Recommended)", "Fold it in (Recommended)" — this is where the brief's "six rulings
     verbatim" requirement lands;
   - **the numbering trap, stated:** the ADR numbers rulings Q1–Q6 *as put to the owner*, mapping to
     report §10 items **1, 2, 4, 5, 6, 7** (report §10.3 — CLAUDE.md/AGENTS.md in scope — was ruled
     earlier and is recorded as settled scope, not one of the six). The page must not mis-map;
   - both re-raise triggers fired (trigger 2: seven drifting files ≥ 3, with the dogfood caveat);
   - the consent model (plan-level approval, diffs in view, apply-time freshness re-check, never
     announce-only, never stored); trigger (on-demand check + read-only stderr notice + per-path
     intent-file suppression, no cursor state); owning role (producer, with vault repairs routed to
     fkit-wiki per ADR-005); spec maintenance (hand-authored + mechanical drift test); manifest
     fold-in (determination layer);
   - the ADR's own "Re-raise only if" boundaries;
   - links: report by path, `[[decisions/adr-015-...]]`, `[[decisions/adr-005-...]]`,
     `[[tasks/design-the-post-update-structure-check]]`; backlinks per the wiki skill.
2. **Update ADR-015's vault page** — the brief's explicit instruction: "do not let the vault present
   ADR-015 as the last word on content drift." Replace/correct the "not yet recorded" banner claim
   with a dated note: ADR-039 recorded 2026-08-07; invariant unchanged for the unattended path;
   add the Related link to the new page.
3. **Update the 0241 task page** — dated correction to §Outcome's "companion ADR is not yet
   recorded" claim, pointing at [[the ADR-039 page]]; verify (not re-do) that the page still
   satisfies brief verification step 1 — report cited by path, rulings dated, channel named. The six
   §10 rulings' verbatim wording lives on the ADR-039 page; the cross-link joins the two.
4. **Update `index.md`** — add the ADR-039 row to the Decisions section; fix the L274 ⚠️ flag on the
   0241 row. Touch only these spots.
5. **Append the dated `log.md` ingest entry** per the wiki skill's own convention (brief item 3),
   recording created/updated pages and reasons.

## Scope ruling on the 4 stale-flagged vault spots — OUT of scope, with one hygiene rule

The Sprint-3 archival producer flagged: `index.md:64` (Sprint 3 as "the ACTIVE board"),
`log.md:1738` (same, in a sync entry), `wiki/tasks/sprint-3-close-the-rank-integrity-loop.md:3`
(Source cites `sprints/sprint-3.md`; now at `sprints/done/sprint-3.md`; Sprint 4 is active, opened
2026-08-07), `wiki/tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board.md:30`.

**Ruling: out of this task's scope.** The brief governs; its "What to build" is the report + ADR
pair, and its out-of-scope rationale ("those land via the normal post-ship syncs") applies squarely:
this staleness stems from the Sprint-3 → Sprint-4 rollover, a different source delta belonging to
the next `/fkit-wiki-sync` (or a lint). Past-sync `log.md` entries are historical record anyway —
the vault's convention is dated corrections, not rewriting history. **The one hygiene rule that IS
in scope:** nothing this ingest *writes* may repeat the stale claims — new/edited text must not
describe Sprint 3 as active and must cite `sprints/done/sprint-3.md` where a board path is needed.
(The vault also predates everything else Sprint 4 shipped — 0243–0247 outcomes are explicitly ⛔
out of scope per the brief; they land via post-ship sync, as do the 0242/0248 done-brief task pages.)

## Verification (brief's steps, made concrete)

1. 0241 design page + ADR-039 page jointly carry the design and the six rulings verbatim, dated,
   channel named; report cited by path.
2. `wiki/decisions/adr-039-*.md` exists; ADR-015's page points at it; no vault page still claims
   the companion ADR is unrecorded (`grep -rn "not yet recorded" wiki-vault/` — surviving hits only
   in historical `log.md` entries).
3. `log.md` carries the dated ingest entry.
4. `git status --porcelain` shows changes under `ai-agents/wiki-vault/` only. No commit, no re-rank,
   no task-file move.

## Risks / notes

- **Double-ingest risk:** the worker must verify-then-top-up the already-ingested report half, not
  create a duplicate page for it.
- **Q-numbering mismatch** (ADR Q1–Q6 vs report §10's 1,2,4,5,6,7) is the likeliest correctness
  slip on the new page — called out in step 1.
- Durable-citation convention: path + section names, never `:NNN` line numbers, in anything written.

## Open questions

- None blocking. One interpretation stated openly: brief verification step 1 ("the six rulings...
  with their verbatim wording") is satisfied by the ADR-039 page carrying the verbatim six,
  cross-linked from the 0241 design page — rather than duplicating all six onto the design page.
  **RATIFIED with the plan approval (see header): the cross-linked shape ships.**
