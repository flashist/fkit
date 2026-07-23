# Investigate making fkit-wiki task completion visible to the board

## ID
0108

## Sprint
Sprint 2

## Priority
90

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

`fkit-wiki` does real, completable work (ingests, syncs, lint, targeted repairs), but it **cannot move
task files** — the movers are producer/owner-invoked, and the wiki role records what it finished only in
`ai-agents/wiki-vault/log.md`. **No board tool reads `log.md`:** not `dashboard.sh`, not the movers, not
`/fkit-status`. So a wiki task whose work is *done* keeps showing `🔲 Backlog` or `🔄 In progress` on the
board until a human notices and closes it.

**Observed, and it was not brief:** task 80 (`0078-repair-stale-adr-029-stop-hook…`) had its vault work
**complete on 2026-07-19**. `log.md` said so plainly on 2026-07-21 (*"task 80 reads 🔄 In progress while
its vault repair has been complete since…"*). The board still showed `🔄 In progress` through **seven
`/fkit-status` runs** — a stuck marker for roughly a week — because the completion signal lived only
where no board-driven view could see it. The six batched wiki-syncs (45/51/66/69/71/73) had the same
shape: done in the vault, still `🔲 Backlog` on the board for days, discoverable only by the producer
reading `log.md` by hand.

**This is investigation-first, not a known fix.** The right mechanism touches a role boundary (only
fkit-wiki writes the vault; only the mover changes task status) and there are several candidate answers
with real trade-offs. **Owner-ruled worth pursuing, 2026-07-22.**

## What to build

An investigation with a recommendation. It must weigh at least:

- **Does the completion signal move, or does a reader learn to see it?** e.g. teach `dashboard.sh` to
  surface a "wiki reports this complete" hint from `log.md` (a *read*, which respects the write
  boundary), vs. having fkit-wiki emit a signal somewhere the board already reads.
- **Who flips the status?** The status change is owner/producer-gated by design (the anti-laundering
  reasoning). A wiki-completion signal that *auto-closes* would breach that gate; one that only
  *surfaces "ready to close"* would not. The investigation must not quietly propose auto-closing.
- **The `log.md`-is-an-unread-status-source problem generally.** `log.md` has twice carried accurate
  status the board contradicted. Is the answer wiki-specific, or the same one task 0107 needs (a
  general "where does cross-cutting task state live so the board reflects it")?
- **The cheap alternative — process, not code:** the producer runs a periodic sweep, or fkit-wiki's
  procedures end by explicitly telling the owner "close task N." State honestly whether a code change
  is warranted or whether a convention suffices.

## Verification steps

- A report exists under `ai-agents/knowledge-base/reports/`, linked from this brief's board row.
- It documents the concrete evidence (task 80's week-long stuck marker; the six syncs) and names the
  mechanism it recommends, with the rejected alternatives and why.
- It states explicitly whether the recommendation **respects the vault write-boundary and the
  owner-gated status change** — a recommendation that breaches either must say so and justify it, or be
  rejected.
- If the recommendation is to build something, it is concrete enough for a follow-up implementation
  brief; if it is a convention, it names which procedure/skill text changes.

## Notes

- **Owner: fkit-architect** — it turns on a role-boundary/design question, not a mechanical edit.
- **Depends on: nothing.**
- **Filed 2026-07-22** from the open-questions interview; owner ruled *"file both"* (this and task
  0107).
- **Relation to task 0107:** same class of bug — *the record holds state the board cannot see*. A
  unified answer may serve both; the investigation should check whether 0107's fix generalizes here
  before proposing a wiki-specific mechanism.
- **Do not propose auto-closing wiki tasks** without confronting the anti-laundering gate head-on — that
  gate is why `Done` is mover-only, and stepping around it silently is exactly the failure the gate
  exists to prevent.
