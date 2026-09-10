# Clean the in-scope broken-link red set — ⛔ CANCELLED, the red set was already 0

**Source**: `ai-agents/tasks/cancelled/0355-clean-the-in-scope-broken-link-red-set/brief.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 7 · `P5` · task `0355` · owner `fkit-coder`

## Goal

Clean the broken-link red set so `0354`'s guard could go green. The sprint was planned on a scope
figure of *"~68 broken links across ~24 files"*.

⛔ **The brief's own loudest instruction was to re-measure before touching anything** — the count is
**condition-dependent**, and the figures were two matchers' output on 2026-08-29 taken on a tree with
concurrent work in it.

## Key Changes

**None. Nothing was built, and no file was edited by this row.**

⭐ **Re-measured 2026-08-30 under `0353`'s settled condition:
`BROKEN: 0 instances across 0 files` / `NAMED-EXEMPT: 6` / `SCANNED: 819 files`.**

⛔ **The disposition already existed** — the six surviving instances are the named exemptions in the
condition document's `NAMED_EXEMPT` list and its reason table, already carried into `0354`'s guard.
⛔ **Every route to work inside this row's stated scope was checked and is empty.**

⛔ **Two of the brief's own assertions were falsified by the finding and are recorded as falsified
rather than deleted:** `Blocks: 0354 going green` (⭐ `0354`'s guard is green **on arrival, without
this task**), and verification step 8's claim that `ai-agents/sprints/backlog.md` carries 3 of the
residual citations.

## Outcome

⛔ **Cancelled (agent-closed — not owner-verified), 2026-08-30.** Reason, as recorded on the brief:
*"Red set is 0 under `0353`'s settled condition. All six surviving instances are named exemptions with
recorded reasons, already carried into `0354`'s guard. There is nothing to clean and nothing this row
blocks."*

- ⭐ **The owner ruled the cancellation itself** — live via `AskUserQuestion` in a `fkit lead` session,
  2026-08-30, option label verbatim **"Cancel it (Rec)"**. Two alternatives were put and rejected:
  keeping it as a thin verification row, and re-purposing it onto the one unowned thing the
  investigation surfaced.
- ⛔ **But the producer that executed the mover was SPAWNED**, so the close still carries
  `(agent-closed — not owner-verified)` — ⚠️ **an owner-ruled cancellation is still not an
  owner-verified one.**
- ⛔ **Do not implement the brief's `## What to build` as written** — its steps operate on a
  24-instance red set that does not exist.

⭐ **Sprint 7 left the `P5` rank gap deliberately** — the cancelled row's rank was not reassigned.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[tasks/settle-the-reference-integrity-condition-once-for-both-halves]] — `0353`, whose settled
  condition measured this row's red set at 0
- [[tasks/build-the-link-resolution-guard]] — `0354`, which this row was supposed to unblock and did not
  need to
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why a spawned producer ran the
  mover and why the marker is permanent
