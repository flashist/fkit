# Wiki re-sync after the Sprint 2 archival — the vault still calls Sprint 2 the active board

## ID
0238

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-wiki

## Context

### ⚠️ Authority — this one is NOT an owner ruling, and that is stated deliberately

The other briefs filed in this batch each carry a named owner ruling. **This one does not.** It was
filed as the **obvious default by the `fkit-lead` session**, on the grounds that **the vault currently
states something false**. It is recorded here rather than buried so that a later reader does not
mistake it for owner-ruled work — and so the owner can drop it in one edit if they disagree.

### What is false today

The Sprint 2 → Sprint 3 rollover (task `0185`) completed on **2026-08-06**:

- `ai-agents/sprints/sprint-2.md` is now `ai-agents/sprints/done/sprint-2.md`, marked `🔒 CLOSED`;
- `ai-agents/sprints/sprint-3.md` is the **active** board, carrying three rows — `P1` `0181`,
  `P2` `0182`, `P3` `0222`.

`ai-agents/wiki-vault/` was **not** written during the rollover. The producer that ran it wrote nothing
there, correctly: **only `fkit-wiki` may write the vault (ADR-005).** So the vault still describes
Sprint 2 as the active board, and still carries the old path.

**Measured at filing, 2026-08-06: 5 files under `ai-agents/wiki-vault/` contain the literal string
`ai-agents/sprints/sprint-2.md`.** That is a floor on the work, not a scope — the stale *claim* that
Sprint 2 is active can be phrased without that string, and those sites will not show up in a path grep.

### Why this must be a task for `fkit-wiki` and nobody else

**No other role can do it.** ADR-005 makes vault reads decentralized and vault **writes** exclusive to
the `fkit-wiki` role. That is the whole reason this is filed rather than performed: the sessions that
noticed the staleness are structurally barred from fixing it.

## What to build

A vault re-sync that makes `ai-agents/wiki-vault/` describe the board reality as of the archival.

- Sprint 2 is **closed and archived** at `ai-agents/sprints/done/sprint-2.md`.
- Sprint 3 is the **active** board at `ai-agents/sprints/sprint-3.md`, with its three rows.
- Any vault claim that names Sprint 2 as current, or points at the pre-archival path, is corrected or
  carries a dated correction — **whichever the vault's own conventions prescribe.** The wiki role owns
  that choice; this brief does not prescribe the form.
- `log.md` records the sync, per the vault's own logging convention.

### Constraints

- **⛔ Do not edit anything outside `ai-agents/wiki-vault/`.** Not the boards, not a brief, not a
  knowledge-base document. The 101 stale prose paths **outside** the vault are `0236`'s, and only
  `0236`'s. This task's diff is vault-only.
- **⛔ Do not move any task file** — the movers are producer-only (ADR-033).
- **⛔ Do not re-rank anything on any board**, and do not correct a board row. If the sync surfaces a
  board defect, **report it to the producer**; it is not fixed here.
- **⛔ No commit.**

## Verification steps

1. **Before:** report the count of vault files asserting Sprint 2 is active, and the count containing
   the literal pre-archival path (**5 at filing** — re-measure, do not quote).
2. **After:** both counts are zero, or every remaining instance is inside a frozen entry that the
   vault's conventions say is corrected by an appended dated note rather than an edit — **and each such
   instance is named in the close report.** "Handled by convention" without a list is not verification.
3. The vault names `ai-agents/sprints/done/sprint-2.md` and `ai-agents/sprints/sprint-3.md` at their
   real paths, and every re-pointed link resolves on the filesystem.
4. `log.md` carries the sync entry.
5. **`git diff --stat` touches `ai-agents/wiki-vault/` and nothing else.**
6. `/fkit-wiki-lint` is clean, or every finding it raises is listed with a disposition.

## Notes

- **Depends on:** nothing. The archival has already landed; every claim this corrects is false on
  today's tree.
- **Blocks:** nothing.
- **Overlap with the three open wiki tasks — checked, and the answer is NO overlap.** Stated either
  way, as required:
  - `0199` — re-syncs **ADR-010's vault page** after `0143`/`0195`'s correction notes. Different
    subject, different source document. No overlap.
  - `0206` — ingests the **faithful-carry decision report** (`0162`'s) into the vault. A new-page
    ingest of an unrelated report. No overlap.
  - `0212` — appends a dated `log.md` entry correcting the **`"still open"` framing** on two frozen
    `0143` log entries. Touches `log.md`, as this task will, but at a different entry about a different
    fact. **Adjacent, not overlapping** — the only shared file is `log.md`, and both are appends.
  - **`0239`** — the ADR-012 vault-page re-sync filed alongside this one. See its Notes for why the two
    were kept separate.
  **All five are `fkit-wiki`-owned vault work and would batch efficiently in one session** — that is a
  scheduling observation for the producer, not a dependency, and none of them gates another.
- **⚠️ An archived board is MOVED, not FROZEN.** Sprint 1's archived board was edited three more times
  after archiving, so a vault claim that `sprints/done/` never changes would itself be false.
- **⚠️ This brief decays.** The counts were measured on **2026-08-06**. Re-measure at implementation
  time.
- **Priority is `—` (unscheduled).** Filed to the Backlog board; no sprint was named and no row was
  re-ranked (ADR-035, `/fkit-task-brief` step 5).
