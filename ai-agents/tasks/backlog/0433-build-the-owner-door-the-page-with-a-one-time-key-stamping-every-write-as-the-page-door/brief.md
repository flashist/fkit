# Build the owner door — the page with a one-time key, stamping every write as the page door

## ID
0433

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).**
> His standing rule, own words (2026-09-27): *"if we already have a brief for that task, the task
> shouldn't start, until I specifically approve it (because it might change the way fkit work in
> general)."*

**Phase 3 — make it fkit's board** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **This is where the board becomes fkit's** (ADR-052 D4, D5). It builds on the faithful port from phase 2 and changes behaviour on purpose; each change has its own tests. **Zero dependencies** (ADR-014). The module boundary holds: the rest of fkit will talk to the board only through `fkit board …` and its `--json` output (D1).

D6. The owner starts the page with `fkit board`; it carries a **one-time key**, and the server checks site, host and content type on every write (T-022, built in by `0422`). **Every page write is stamped door = page** — the only route to an owner-verified close (Q3, Q15). aiboard's free-text "you:" name box becomes a display name (D3). The page's sprint close asks where open tasks go (Q4).

⛔ **It cannot stop an agent running as the owner on his machine from using the page** — owner-verified is a **label, not proof** (R3). The git commit stays the real checkpoint (ADR-049 D2). That agents may not *start* the page is the identity hook's job (`0447`), not this unit's.

⛔ **Q16:** no writable serve on real project data until the pilot — fixtures only.

## What to build

1. One-time key on serve; writes without it refused.
2. Door = page stamped by the server on every write; page closes recorded owner-verified.
3. Display-name box replaces the free-text author box.
4. Page sprint close requires a carry-to destination (`0430`).

## Verification steps

1. Tests: a write without the key is refused; a page close records kind = owner-verified and door = page; no request field can change the door; a page sprint close without a destination is refused while tasks are open.
2. No test serves a real project tree writable (Q16).
3. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0427`](../0427-add-the-close-record-and-the-stores-close-rules-producer-only-closes-reasons-owner-verified-only-from-the-page/brief.md) and [`0430`](../0430-add-sprint-close-carry-to-a-whole-sprint-close-in-one-call/brief.md). Hard.
- **Blocks:** [`0439`](../0439-run-a-copy-of-fkits-corpus-on-the-fkit-ified-board-the-phase-3-gate/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
