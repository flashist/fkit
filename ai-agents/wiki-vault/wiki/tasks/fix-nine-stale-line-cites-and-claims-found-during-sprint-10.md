# Fix nine stale line cites and claims found during Sprint 10

**Source**: `ai-agents/tasks/done/0496-fix-nine-stale-line-cites-and-claims-found-during-sprint-10/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P22` (pulled by owner ruling R11, 2026-10-14) · task `0496` · owner `fkit-coder` (ADR notes via an `fkit-architect` consult)

## Goal
Owner ruling 2026-10-05 on `0472`'s plan OQ2, verbatim **"New small tidy task"** — `0472` kept its scope and the stale
items it and other Sprint 10 tasks found went into one small task: nine items (a)–(i). **Two kinds, handled
differently:**
- **Stale line cites** (a–f, h) — fix the **cite, never the prose** (the `0393` rule), preferring the durable form (a
  quoted fragment or a name beside or instead of the number), because the launcher moved several times in Sprint 10
  alone.
- **Stale claims in ADRs** (g, i, and the ADR side of h) — **a dated note; the original text stays byte-identical**
  (the `0197` / `0472` precedent), through an architect consult.

## Key Changes
**30 verdict lines** in the worklog — **fixed** / **already correct** / **frozen record, left as is** / **target gone**:
- **(a)** `fkit-sprint-ship-loop/SKILL.md`'s *Process review* row: **4** cites into `fkit-process-stateful-review/SKILL.md`
  fixed, each paired with a quoted heading (the brief named two; two more in the same row also missed).
- **(b), (c)** one code comment each — `claude/fkit-claude-init.sh` and `test/orphan-cleanup.test.js` — fixed **by name,
  no number** (*"fresh-project start"*, *"`build_settings()` in `claude/fkit-claude.sh`"*), per
  [[tasks/add-a-why-not-what-code-comment-rule-and-remove-the-rules-that-contradict-it]] rule 2. Owner OQ1 *"Pointer only
  (Rec)"* — the rest of each comment is left to cleanup tasks `0508` / `0515`.
- **(d)** `RELEASING.md`: 3 launcher cites fixed (each paired with the function or `if` it names), 2 already correct.
- **(e)** open briefs `0284`, `0328`, `0382`, `0403`: **14 full-form cites — 5 fixed** (live pointers), **9 frozen**
  (dated measurements stay as written). Owner OQ2 *"Full-form only (Rec)"*: short-form `:NNN` cites were **not** swept
  (~42 in `0284` alone).
- **(f)** the Backlog board's `CLAUDE.md:58` cite sits on a closed `➡️ Moved` row — **frozen, no edit**, as expected.
- **(g) ADR-026** — a dated ⚠️ note at the end of §Context's *"The real defect R2 exposed was not hand-rolling"* plus a
  `Corrections:` header bullet: `npm test` has run `prove-red.sh` since `0ad055a` (2026-07-18) — **a few hours before the
  ADR's own commit `f50a821` (2026-07-19)** — and `.github/workflows/test.yml` (since `df55b50`, 2026-08-12) runs it on
  every push to `main` and every PR. 16 lines added, 0 removed. → [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]
- **(h) ADR-019** — a dated note after §Decision item 4: the `fkit-coder.md:109-113` cite no longer points at the rule;
  find it **by quote** — *"But: a genuinely NEW architecture decision goes to the OWNER."* (§Consulting a teammate) and
  *"Make product or scope decisions that belong to the producer / owner — surface them instead."* (§What you must not
  do). Plus a 4-line continuation of the header's `Corrections:` bullet: the ADR now carries **two** dated notes. 12 lines
  added, 0 removed. → [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]
- **(i) ADR-052 D8 item 3** — a ⏱ correction sub-bullet: `0014` no longer fits *"brief says Backlog, folder says done"*
  (its status is `✅ Done` since `0472`'s ruling R7); with no board row, it now belongs to the **no board row** class,
  like `0004`. The converter's rule is unchanged. 4 lines added, 0 removed. Brief `0436` was already correct.
  → [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]]

## Outcome
- Architect ruling at plan time (hop 2 of 2): **changes requested, all adopted** — ADR-026's note widened to both *"not
  in `npm test`"* statements and *"awaiting its brief"*, with the `0ad055a`-before-`f50a821` correction; ADR-052 gets
  **no** `Corrections:` header index.
- Review: one finding, R1 (low, frontier) — `0284`'s undated present-tense `claude/fkit-claude.sh:126-165` cite was left
  frozen. Owner: *"Won't fix + 0284 note (Rec)"* — accepted residual; a producer added a one-line cite note to `0284`'s
  Notes (seen in this window's diff of that brief).
- Checks: full `npm test` exit 0, unit 1112/1112, prove-red 43 mutations red, hard gate passed; `test:docs` 389/389.
  ⚠️ The run covered the **whole working tree** (other tasks' uncommitted work was present), not this diff alone.
- ⭐ **Out-of-scope findings → owner OQ3 *"File a Backlog task (Rec)"* → `0516`** (open, no page): stale `ADR-019:NN`
  cites in the ship-loop row, `fkit-coder.md`, ADR-025/032/037, two reports — **this task's own ADR-019 inserts shifted
  its later lines by 4 and 12**, though every one of those cites was already stale — and the task ship-loop's
  `fkit-coder.md:165` cite (the rule is at `:212` today). Also recorded: `0284` looks partly obsolete (its "defect 2"
  appears fixed by `0481`). ✅ A producer re-check note in `0284` (2026-10-14) confirms it: defect 2 is fixed by `0481`;
  two defects stay open; re-scoping is left to `0284`'s plan gate.
- Related, not a dependency: Backlog task `0394` (a guard for the `ADR-NNN:LINE` class, so this hand sweep is not
  repeated). Open.

## Related
- [[tasks/tidy-fkits-documents-after-adr-052-machine-paths-stale-pointers-adr-049-oqs]] — `0472`, whose OQ2 created this task and whose item 8 fixed the same cite in the task ship-loop
- [[tasks/the-two-citation-sweeps-architecture-md-and-the-repo-wide-adr-line-class]] — `0393`, *"correct the citation, never the prose"*
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] · [[tasks/write-the-durable-citation-anchors-convention-page]] — the durable-citation rule applied here
- [[tasks/run-only-the-checks-a-change-needs-not-the-full-suite-every-time]] — `0480`, one source of the stale items
- [[tasks/check-the-links-in-fkits-top-level-docs-not-only-under-ai-agents]] — `0484`, sequenced after this task because it reads `RELEASING.md`
- [[tasks/sprint-10-the-0472-0482-batch]] · [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]]
- [[systems/knowledge-base-structure]] — the append-only, dated-note pattern this task followed in three ADRs
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`):* [[tasks/fix-the-stale-adr-019-and-fkit-coder-line-cites-found-during-0496]] — `0516`, the follow-up that re-pointed the ADR-019 cites this task's inserts pushed further off
