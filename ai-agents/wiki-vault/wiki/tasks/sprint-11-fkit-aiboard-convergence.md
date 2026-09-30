# Sprint 11 — fkit ↔ aiboard convergence

**Source**: `ai-agents/sprints/done/sprint-11.md`
**Status**: done — ✅ **Done 2026-09-30. Closed by `/fkit-sprint-done` (agent-closed — not owner-verified)**
**Sprint/Tag**: Sprint 11 (opened 2026-09-18) · ⚠️ **there is no Sprint 10** — see Gotchas

> ⭐ **Ingested 2026-09-30** (sync `a351cb6`→`3915417`). The board was archived from `sprints/sprint-11.md`
> to **`sprints/done/sprint-11.md`** in commit `3915417`; no vault page existed before this pass.

## Goal
*"Make fkit and aiboard fit each other well enough that the owner can decide, on evidence, whether fkit
adopts aiboard as its human-readable board."* aiboard is the owner's second project — *"Jira for AI
agents"*, a browser board for tasks and sprints, then in MVP. The pain it answered was fkit's own: **the
markdown boards are large and a human cannot read a sprint's state at a glance.** Authority: an owner
ruling of 2026-09-18 (his own words) — *"Yes, do its own sprint … whenever you discuss something with the
aiboard lead, and it's worth having a dedicated task for that, add it to that new sprint."*

## Key Changes
The board is a **1,413-line** record of one very long day (2026-09-18) plus follow-ups, carried as
**appended owner-ruling sections over byte-identical earlier text**. In order:
1. **The convergence decision ruled — "B, gated behind A"** (selected option text): aiboard as the
   single store is the destination, fkit's tree read by a read-only reader is the interim. The owner's own
   prose on why: one store, never duplicate. → recorded as
   [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]].
2. **Terminal UI:** *"fix the reporting first, then decide"* → `0409` (report shape) ahead of `0405`
   (terminal UI comparison), because a TUI scored against verbose reports is a **confounded** comparison.
3. **A migration freeze** (no id re-keyed, no folder moved, no board rewritten), re-founded on the
   convergence ruling.
4. **The gate defined (D4 closed)**, then **amended ten times in three rounds** the same day — see the
   ADR-051 page. ⛔ The board carried a **summary only**; the ADR was authoritative.
5. **The `0383` hold lifted (D5 closed)** — the Backlog-board-as-document-store task survives B and is a
   precondition of doing it well.
6. Rows added out of band: `0409`, `0410` (2026-09-18), `0405` (2026-09-18), `0411` (2026-09-20); the
   board ranked `P1`–`P4` by owner ruling on 2026-09-20, then `0411` re-ranked `P5`→`P3`.

**Final rows:**

| Row | Task | Outcome |
|---|---|---|
| P1 | `0409` report `/fkit-status` hierarchically | ✅ Done (agent-closed) — [[tasks/make-fkit-status-report-hierarchically-counts-and-exceptions-first-detail-on-request]] |
| P2 | `0404` evaluate aiboard, design the seam | ✅ Done (agent-closed) — [[tasks/evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam]] |
| P3 | `0411` make the read-only reader the board the owner reads | ✅ Done (agent-closed) — [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] |
| P4 | `0405` investigate a terminal UI | ➡️ Moved to the Backlog board, **`🚧 Blocked — waiting on 0433, 0434 (ADR-052 phase 3)`** |
| P5 | `0410` how agents report status in prose | ➡️ Moved to the Backlog board, `🔲 Backlog` |

## Outcome
- ⭐ **Closed 2026-09-30 because [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]]
  concluded the question it was opened for.** The owner's ruling (selected option text): *"Close it, carry
  leftovers — The producer closes it (agent-closed) with a note that ADR-052 concluded it; open rows (0405,
  0410) move to Backlog or the next sprint."* No successor sprint exists, so both went to the Backlog
  board. Closed by a **spawned** producer, hence the agent-closed marker.
- ⛔ **The gate this board spent most of its length defining never ran.** The trial clock never started
  (it waited on aiboard's Node port), and ADR-052 removed the trial. The board's gate sections are
  **history** now.
- The pre-close line-3 banner is preserved verbatim under the Done banner, with its `## ` stripped so it
  no longer reads as a status.

### Gotchas
- ⚠️ **"Sprint 10" was deliberately left empty.** It was already earmarked by earlier owner rulings for
  fkit's **own** backlog work (`0301`'s note, `0189`'s deferral on Sprint 9), so the producer took `11`
  rather than repoint owner-ruled text. **The gap is permanent if that sprint is never planned.**
- ⭐ **Recorded here because it recurs:** a producer **scoped out of `decisions/`** reported the gate's
  wording as *missing from disk* when it was in ADR-051 — *an agent barred from a directory cannot tell
  "absent" from "invisible."* The fix was read-only access to `decisions/`.
- ⭐ The *"adapter"/"seam"* lesson: the owner first read *adapter* as *a second copy of the tasks*. Say
  **what reads what and what writes what**.

## Related
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — the decision that concluded this sprint
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — the ruling this board first carried
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] · [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]] — the two same-day ADRs on what a close claims and how it executes
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]] — the line-3 banner lifecycle this board ran under
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]] — the previous board; it named no successor
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board that received `0405` and `0410`
- [[tasks/the-2026-09-30-adr-052-task-dispositions]] — the same-day task re-scopes and cancels
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[systems/fkit]] — the team page's note on the decided replacement of the markdown store
