# ADR-048: A half-landed close gets a producer-only reconcile mode that never upgrades the marker

**Date**: 2026-09-14
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md`

> ⭐ **Ingested 2026-09-16** (sync pass, Sprint 9 wrap-up). This ADR had **no vault page at all** until
> this pass. ⚠️ **It is UNCOMMITTED on disk at ingest time** — the bytes read were the working tree's,
> with `HEAD` at `81f1429`. If this work is amended or reverted before it commits, this page describes a
> revision that never landed.
>
> ⚠️ **The ADR is written but NOT implemented.** It decides the mode; **task `0135` builds it.** Nothing
> described below is behaviour `/fkit-task-done` has today. Read every "the mode does X" as "the mode,
> once `0135` ships it, must do X".

## Context

A **half-landed close** is a close that moved the task folder into `ai-agents/tasks/done/` but left at
least one status location still reading open work. Measured at commit `d8ef596`, 2026-09-14:

- `/fkit-task-done` step 1 **stops** on a folder already in `done/`.
- **Exception 1** (the owner-verification upgrade) is owner-only.
- **Exception 2** (the contradicted-close repair shipped by task `0229`) is owner-only, fires only when
  the brief reads open work **and** a row whose Brief cell links the folder reads **plain** `✅ Done`.
- `✅ Done` is skill-gated and may never be hand-edited; `🔄 In progress` and `🚧 Blocked` are free to
  set by hand, so the loops' `🚧 Blocked — hand-off incomplete` marker on an already-closed folder is
  lawful.

⛔ **When the brief reads plain `✅ Done` and a row is stale, neither exception fires — and that blocks
the owner too.** Since a spawned producer's close is always agent-closed (ADR-033 §5), every
half-landed close after one reached a human, even when the landed value was already on disk.

Found by task `0123`'s review (finding **R1**, follow-on **R6**).

## Decision

> **In one line:** once a close has moved a task folder into `done/`, a **producer** — spawned or not —
> may copy a landed **`✅ Done (agent-closed — not owner-verified)`** onto the locations still reading
> open work. Only when a real disagreement exists; never plain `✅ Done`; never an upgrade; never a
> folder move.

⭐ **The owner's stated reason is the shape of the whole ADR:** *"The artifact of worth is the
constraint list, not the feature."* The must-never list and the detection rule are the deliverable; the
mode is what they constrain.

### Who, and what it writes

- **Producer-only** — the same rule as ADR-033 §Decision 1, needing no new grant since `/fkit-task-done`
  is already producer-only and hook-enforced. **A spawned producer qualifies.** ⚠️ That is both the
  point (the loops finish their own half-landed closes without a human) and the risk (the identity that
  left the close half-done is the one allowed to finish it, with no owner in the loop).
- It writes **exactly one status value**: `✅ Done (agent-closed — not owner-verified)`, and only when
  that is the landed value.
- ⭐ **It copies. It does not resolve.** It ignores the skill's *"Resolve the status value FIRST"*
  table. An owner-present producer running the mode **also** writes the agent-closed value; upgrading
  stays exception 1's separate, explicit act.
- **A link is not a status.** A stale href on its own never triggers the mode. With every status
  agreeing, a stale href is ordinary pointer repair — the coder's, under ADR-044 §Decision 1.

### The must-never list — carried into `0135`'s skill prose verbatim

1. ⛔ Never upgrade `✅ Done (agent-closed — not owner-verified)` to plain `✅ Done`, anywhere, for any
   identity. *(Owner constraint 2.)*
2. ⛔ Never run when all status locations already agree — refuse and report what each reads.
   *(Owner constraint 1.)*
3. ⛔ Never write plain `✅ Done`. A plain landed value → refuse, route to the owner.
4. ⛔ Never create a `✅ Done` when no landed close exists. That is a close.
5. ⛔ Never touch a folder that is not under `tasks/done/`, and never move a folder.
6. ⛔ Never downgrade an owner-closed plain `✅ Done`.
7. ⛔ Never pick a winner when landed locations disagree with each other. Refuse and report both.
8. ⛔ Never overwrite a `⛔ Cancelled …` or `➡️ Moved …` cell.
9. ⛔ Never write `ai-agents/wiki-vault/` (ADR-005), and never edit `test/reference-integrity.test.js`.
10. ⛔ Never propagate without the provenance disclosure (below).

### The detection rule — fires only if ALL hold, else refuse and change nothing

- **(a)** the folder is under `ai-agents/tasks/done/`;
- **(b)** at least one location is **landed** (begins `✅ Done`);
- **(c)** at least one location is **open-work** (`🔲`, `🔄`, `🚧`);
- **(d)** every landed value **begins with** the exact string `✅ Done (agent-closed — not
  owner-verified)`. ⭐ The test is on that **leading marker**, not the whole cell — an epic's trailing
  ` (PR #NN)` does not block the mode;
- **(e)** no location is **other** (`⛔ Cancelled …`, an unrecognised string, or a brief `## Status`
  that is **missing** or **spans more than one line**);
- **(f)** no epic slice row or sprint-plan body section linking this folder fails the attribution test.

⭐ **Attribution is by link, never by nearness.** A line that sits near this folder's link but cannot be
attributed to this task is **not guessed at** — clause (f) refuses and reports it. A `➡️ Moved …` row is
a **pointer, not a location** and never counts.

**Branch order in step 1**, for a folder already in `done/`: exception 1 → exception 2 → the reconcile
mode → only then the plain stop. Exceptions 1 and 2 keep who they fire for and what they write; what
changes is **where their agent stop leads**.

### Out of scope, decided

- **`/fkit-task-cancelled` gets no mirror mode.** Checked: it has no exception branch at all, so a
  mirror would open a **first** door onto `cancelled/`, not widen an existing one. Neither loop ever
  routes a cancel to a producer, so no spawned producer leaves a half-landed cancel. `cancelled/` is
  also the board nobody audits (ADR-025). **No follow-up brief is filed.**
- **`0229`'s exception is kept, unchanged and owner-only.** The two branches are complementary:
  exception 2 covers a plain landed value beside an open-work brief; the mode covers an agent-closed
  landed value beside any open work.

## Consequences

- ⛔ **It widens ADR-033's stated limit, and the widening is accepted and disclosed.** The ways to close
  do not widen — the mode never creates a landed value. What widens: an **out-of-procedure or forged**
  landed agent-closed value gets a mover-shaped record. The mode checks that landed locations agree with
  each other; it does **not** check how the value got there (no git provenance check — that option was
  offered and not chosen).
- **Mandatory disclosure.** Every report where the mode fired states, in these words, **"landed close
  propagated; its provenance not checked"**.
- **Why that is survivable:** the only value the mode can spread still reads *"not owner-verified"*, and
  the owner's upgrade still sits between it and a plain `✅ Done`.
- ⚠️ **Named residual — the owner-side gap stays open.** Brief reads **plain** `✅ Done`, a row is
  stale: exception 1 needs an agent-closed brief, exception 2 needs an open-work brief, the mode refuses
  plain values. **No branch fires, for anyone.**
- ⚠️ **Named residual — a second no-door state.** Brief **plain** `✅ Done`, row
  `✅ Done (agent-closed — not owner-verified)`: again no branch fires, and **the run escalates to an
  owner who has no door either.** ⭐ Both states were true before this ADR and are unchanged by it —
  recorded as residuals, **not filed as follow-ups**.
- **The three loop carve-out sites are amended, not deleted** — each stays as the **fallback** when the
  reconcile spawn refuses or fails. The stated reason changes from *"no agent can lawfully reconcile
  them"* to *"the reconcile mode refused (or its spawn failed)"*.
- ⛔ **Order is load-bearing: the reconcile spawn comes first**, and the loop writes its
  `🚧 Blocked — hand-off incomplete` marker only on the fallback path. If the marker were written first
  it would turn an "other" location into open work, clause (e) would stop seeing it, and the mode would
  overwrite it.
- ⛔ **The loop never writes `🚧 Blocked` over a location reading "other" — it reports that location
  instead.** ⭐ This is an **owner ruling of 2026-09-14**, not an architect's call, added on top of D4 to
  close a **second-run** gap the spawn-first rule alone does not cover.

⛔ **Do not re-raise** whether the mode should exist, whether it may write plain `✅ Done`, or whether
`/fkit-task-cancelled` needs the mirror — each was considered and refused by name. The one left-open
re-raise path is the owner-present sub-path that would close the first residual.

## Related
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the producer-only rule this inherits, and the limit this ADR **widens by name**
- [[tasks/widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close]] — task `0229`, exception 2, **kept unchanged and owner-only**
- [[tasks/route-sprint-ship-loop-close-to-producer]] — task `0123`, whose review findings R1/R6 surfaced the gap
- [[tasks/route-coder-ship-loop-close-to-producer]] — the task-loop half of the same close routing
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — must-never 9's wiki-vault bar
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the reversed predecessor; its §Consequences is why `cancelled/` is the worst place to open a first agent door
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]] — the other Sprint 9 decision ingested in this pass
