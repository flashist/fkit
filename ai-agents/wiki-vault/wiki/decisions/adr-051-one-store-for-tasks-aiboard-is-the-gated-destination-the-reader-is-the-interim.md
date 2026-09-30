# ADR-051: One store for tasks — aiboard is the gated destination; the read-only reader is the interim

**Date**: 2026-09-18
**Status**: accepted — ⛔ **partly superseded 2026-09-30 by [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]]**

**Source**: `ai-agents/knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md`

> ⛔⛔ **READ THIS FIRST — THE GATE AND THE TRIAL BELOW ARE NO LONGER CURRENT.** On 2026-09-30 ADR-052
> superseded **the trial, F1–F5, the work floor, the no-timeout guard, and D7 with every assumption that
> aiboard is a separate project.** aiboard now merges into fkit as its built-in board. **What survives:**
> **D1 — one store, never duplicate — reaffirmed**; P1–P6, A1–A2 and D5 **kept as ADR-052 phase gates**;
> D4 carries into *"each phase on his word"*; **P5 stands**. **D2** (the read-only reader) ends in each
> project when it is converted. The source ADR carries an inserted dated notice; nothing in it was deleted.
> This page records ADR-051 **as history**; for anything current, read ADR-052.
>
> ⭐ **Ingested 2026-09-30** (sync `a351cb6`→`3915417`) — this ADR had **no vault page** until this pass,
> which landed after it had already been partly superseded.

## Context
- fkit stores a task as a folder (ADR-029) with status in the brief **and** in markdown board tables.
  **aiboard** — the owner's second project, a file-based tracker with a browser board — stores status as
  **the folder**. The owner's stated problem: **a human cannot read fkit's board.**
- On 2026-09-18 a full evaluation ran (`reports/2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md`,
  reviewed by Codex) and `fkit-external-expert` returned a verdict
  (`reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md`) whose line 1 was *"Do not
  converge the two storage models. Not now, not staged, not as a goal."* — with its own self-caveat *"I
  have a bias toward not building, and this verdict is what that bias produces."*
- **Measured by `aiboard-lead` against fkit's real corpus (attributed, not re-run by fkit):**
  - ⛔ **`T-023` — silent corruption on exactly fkit's id format.** Any all-digit front-matter string is
    written back as an unpadded integer: `"0013"` → `13`, **which is a different fkit task.** No error.
  - ⭐ **408/408 briefs imported clean** into a scratch aiboard board — the strongest evidence B was
    feasible.
  - ⚠️ The snapshot is quadratic in **sprint membership**: 409 tasks, all sprinted → **729 ms** per
    snapshot (`T-021`).
  - ⚠️ Branch-race id allocation (a second copy of ADR-029's accepted hazard); **no undo**; and aiboard's
    own sprint-membership **duplication** (stored on the task and on the sprint).
- ⭐ `aiboard-lead`'s process note, which shaped the acceptance test: *"the acceptance test for 'aiboard
  can hold fkit' is a full import-and-diff of all 404, not a design review."*

## Decision
**Ruling 1 (selected option text, not his prose):** *"B, but only after aiboard proves itself — Accept B
as the destination, run A now as the interim."* **A** = fkit's tree stays the single store and aiboard
**reads** it (demonstrated by the expert's 129-line read-only spike: 405 tasks, 37 ms snapshot).
**B** = aiboard becomes the single store and fkit reads and writes through it. ⭐ **Both are one store;
neither duplicates.**

**Ruling 2 — the owner's OWN prose (may be quoted):** *"If we ever use AI board as a dependency for fkit,
it should be the single and the only storage for tasks. I want to avoid situations where the duplication
is even possible …"* ⭐ **This is the reason B was the destination, and it is the part ADR-052 keeps.**

- **D1** — if fkit ever depends on aiboard, aiboard is the **single and only** store. ✅ *Reaffirmed by ADR-052.*
- **D2** — B is the destination; A is the interim and runs now. ⚠️ *Ends per project at conversion.*
- **D3** — the move is gated: **P1–P6** (Node port with its tests ported first; `T-023` fixed with a
  `0013`/`0404` round-trip test; `T-021`; `T-022`; **P5 durability — the owner personally commits the tree
  at the end of every working session**; aiboard's membership duplication reduced to one source),
  **A1–A2** (a byte-level import-and-diff **on the Node port** plus a write round-trip), a **trial**, and
  **F1–F5**. ⛔ *Trial and F1–F5 superseded by ADR-052; P1–P6, A1–A2 kept as phase gates.*
- **D4** — only the owner declares the gate passed. *Carried into "each phase on his word".*
- **D5** — "gate passed" does not authorise migration; a dry run with a byte-hash diff the owner reads
  comes first. *Kept — ADR-052 phases 4, 6, 7.*
- **D6** — a failed gate does not reopen on a schedule. *Lapsed with the trial.*
- **D7** — none of this obliges aiboard; **no fkit task may be filed for `T-021`/`T-022`/`T-023`/the port.**
  ⛔ *Superseded — under ADR-052 the port is fkit's own work (phase briefs `0417`–`0423`).*
- **D8** — not decided here: whether a board may ever write. *Answered by the merge.*

### The ten amendments, all 2026-09-18 — ⛔ historical
Three rounds, all **selected option text**: the **work floor restored** (4 weeks **and** 2 sprints **and**
≥40 status changes, reversing his own earlier decline); **P5 owned by the owner personally** with the
cadence *"the tree is committed at the end of every working session"* — ⚠️ **recorded beside the promise:
the session that made it held 22+ uncommitted paths**; the **trial clock starts at P1**; the three bars
run **concurrently**; the counting rule; the board-is-a-summary housekeeping; ⛔ **two repairs of gate
bars that were UNSATISFIABLE** because they required a **read-only** board to *originate* transitions and
sprint closes; and **no timeout** (a 12-week check-in was offered and declined, with the objection inside
the option he chose). ⭐ **The principle the repairs produced — *"under A, the board observes; it never
originates"* — is the reusable lesson**: after specifying a bar, check it can be met in the world that
exists during its window.

### The one evidence entry — 2026-09-21
The owner ran `0411`'s read-only reader on the **live tree (411 tasks, 11 boards)** and chose *"Yes — I'd
use this"* (**selected option text**, not his prose). ⛔ **Not trial evidence** (the clock had not
started), not a pass, not a partial discharge. Canonical record: `0411`'s brief. A later **evidence log**
(`reports/2026-09-26-evidence-log-for-adr-051-aiboard-as-the-store.md`, entries E1–E3: per-entry
timestamps, a timed status history, and the reader in use on a sibling project) fed the 2026-09-30
decision; ADR-052 declares it **closed, not deleted**.

### Supersession of the external expert's verdict
**Adopted on its path, overridden on its endpoint.** The read-only view (A) was the expert's path; the
owner rejected *"no storage convergence, ever"*. The verdict's file is **not edited**.

## Consequences
- (Historical) the whole gate waited on another project's roadmap; the trial could stall without ever
  failing, and **F5 — "he stopped using it and did not notice" — could never be asked of a trial that never
  ended**. ⭐ **ADR-052 dissolved this by removing the trial**, not by adding a timeout.
- **Still true after ADR-052:** `T-023` is live until phase 1; P5 rests on a personal commitment, not a
  mechanism; fkit is not transactional.
- **Process note worth keeping:** four defects were caught before the gate closed; **three were the
  drafting agents' own** and were recorded rather than defended. The *"adapter"/"seam"* lesson: agent
  vocabulary put to the owner read as *"a second copy"* — **say what reads what and what writes what.**

## Related
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — ⛔ **supersedes the gate, the trial and D7; reaffirms D1**
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] — what a close may claim; its read-only interim posture
- [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]] — the deterministic command a board write would have called
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the four-digit identity `T-023` destroys
- [[tasks/sprint-11-fkit-aiboard-convergence]] — the board that first carried this ruling (as a summary)
- [[tasks/evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam]] — task `0404`, whose evaluation produced this ADR
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — task `0411`, Track 1 "A now"
- [[tasks/let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag]] — task `0412`, the reader on another project
- [[tasks/keep-a-closed-sprints-tasks-attached-when-its-board-is-named-plan-sprint-n]] — task `0415`
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[systems/fkit]] — the team page's data-model note
