# Clean the coordination-citation residual set — the cleanup `0176` needs and nobody owned

**Source**: `ai-agents/tasks/done/0237-clean-the-coordination-citation-residual-set-that-blocks-0176/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P6` · task `0237` · owner `fkit-coder`

## Goal

`0176`'s policy guard could not ship green while stale `path:NNN` coordinates remained in the
coordination tree. Nobody owned that cleanup. This row is it, and ⛔ **it hard-blocked `0176`.**

⚠️ **The brief's original figure did not reproduce.** It was measured 2026-08-06 on a tree with
concurrent work, and ⛔ **the `19 / 15` figure it carries and the settled `19 / 14` figure are NOT the
same set — the matching is coincidental.** ⛔ **Treat the match as suggestive at most, and never as
evidence the brief's list was right.**

## Key Changes

⭐ **The work list is the 19-instance table in §6.1 of `0353`'s condition document** — ⛔ deliberately
**not copied into the brief**, so there is one source and no drift.

⭐ **The job's shape changed materially, and that is why it was pullable onto a sprint at all:
the whole list is OPEN briefs plus the live backlog board.** ⛔ **No closed record needed editing** —
re-measured 2026-08-30, **zero** of the 19 citing sites sit in a closed folder.

- ⚠️ **Two rows carry an elided coordinate** — ⛔ treat them as **citations**, not as paths. They are
  genuine citation *claims* against a record and belong in the list; that is the ruled reading.
- ⚠️ **A citation pointing INTO a closed folder is still repairable** — ⛔ **the exemption is about the
  CITING side, not the cited side.** Confusing the two prongs is the brief's named trap.
- ⭐ `ai-agents/sprints/backlog.md` carries **3** of the 19 and is **machine-parsed** — it got its own
  step.
- ⛔ **The one rule that must never be adopted by accident: skipping inline code spans** collapses this
  half's match rule. ⚠️ **The link half was ruled the other way, deliberately.**

⚠️ **`Depends on:` was CORRECTED IN PLACE, not annotated** — it read *"nothing"*, true from 2026-08-06
until `0353` was filed, and it is a machine-parsed field.

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`, unblocking `0176` and, through it, Sprint 7's
three sweeps.

⛔ **A green guard here is not a complete guard, and the close report says so.** Two accepted blind
spots stand: **source-file coordinates are caught by neither guard**, and the cost of that is *"two
orders of magnitude"* larger than what is covered.

⚠️ **This brief took a seven-line dated 2026-09-08 annotation during Sprint 7's archival** — by owner
ruling **"Annotate, don't rewrite (Rec)"** — because it freezes a quotation the href repair would
otherwise have silently rewritten. It is one of the two briefs in the fourteen that were not
href-only.

- **Depends on:** `0353` — hard.
- **Blocks:** `0176` — hard.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[tasks/build-the-coordination-citation-policy-guard]] — `0176`, which this unblocked
- [[tasks/settle-the-reference-integrity-condition-once-for-both-halves]] — `0353`, whose §6.1 table is
  this row's work list
- [[tasks/write-the-durable-citation-anchors-convention-page]] — the convention the repairs re-anchor to
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, where the citation form
  was settled
