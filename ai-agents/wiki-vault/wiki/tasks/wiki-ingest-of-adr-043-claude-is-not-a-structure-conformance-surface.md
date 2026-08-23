# Wiki ingest of ADR-043 — the row whose own constraint was breached by the run that served it

**Source**: `ai-agents/tasks/done/0293-wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface/brief.md`
**Status**: done — ✅ **Done (agent-closed — not owner-verified)**, closed 2026-08-14
**Sprint/Tag**: Backlog, unscheduled · Owner `fkit-wiki` · task `0293`

## Goal

Ingest ADR-043
([[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]];
source `ai-agents/knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md`)
into the vault — the decision that `.claude/` is **deliberately not** a structure-conformance surface,
and that the unconditional launch refresh **is** the guarantee. Scope was the ADR page, the link
hygiene that ingest requires, the `index.md` row and the `log.md` entry — ⛔ **explicitly not a general
vault sweep.**

**Filed rather than run, and the reason is the substance of the row.** Owner ruling 2026-08-13, given
live via `AskUserQuestion` in a `fkit lead` session, verbatim option label **"Batch it — file it, run
later"**. The stated reason was to avoid a **fourth vault write in a single day** to
`wiki/systems/install-and-self-update.md`, which three separate librarian runs had already rewritten
that day. ⛔ **The batching requirement was therefore mandatory, not advisory** — running the row alone
would have discarded the ruling's whole purpose.

## Key Changes

**The deliverable was already in the vault when the row closed.** The 2026-08-13 `/fkit-wiki-sync`
picked ADR-043 up in its commit-range delta and created
[[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]]
together with its `index.md` row and its reciprocal boundary back-links on the ADR-015 and ADR-039
pages. That sync ended by flagging *"Task 0293's vault work is complete — ready to close"*; a producer
acted on the flag and closed the row on **2026-08-14**. The close itself changed only the brief's
`## Status`, three relative links forced by the `backlog/` → `done/` folder move, and one board row in
`ai-agents/sprints/backlog.md`.

### ⛔ Its own hardest constraint was breached — by the run that discharged it

The brief carried a verbatim fence: **"⛔ Do not touch
`ai-agents/wiki-vault/wiki/systems/install-and-self-update.md`."** During the 2026-08-13 sync the
librarian's five new pages each linked to that page, creating **five one-way links**; link hygiene said
reciprocate, so it **appended five `## Related` bullets to the page** — then recognised the breach and
**reverted the edit**, restoring the file byte-identical at **195 lines**.

⚠️ **The judgement that failed, recorded so it is not repeated:** *additive and low-risk* was treated
as equivalent to *in scope*. It is not. The ruling was about **write frequency on one page**, and an
additive write is still a write. ***A constraint phrased as "do not touch" is not satisfied by touching
it carefully.*** The run recorded it as a **breach, not a near-miss** — the honest classification,
given the reverting run was also the run that committed it.

**The consequence was carried as an open residual rather than absorbed:** five one-way links still
point at that page with no back-link — from ADR-043's page and the `0253`, `0254`, `0255` and
resync-chain task pages. ⛔ **Deliberately left.** Reciprocating them would make the **lint itself** the
fourth write. They are folded into `0295`, which must edit that page anyway — **one write instead of
two.**

### The loop could never have driven this row

`## Owner` is `fkit-wiki`, and vault writes are that role's exclusively
([[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]). But **the sprint loop never reads
`## Owner`** — [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] fixes each
step's role to the skill that step runs, so its Build step spawns `@fkit-coder`, which may never write
the vault. Driven by `/fkit-sprint-ship-loop` the row would either stall on a refusal or breach
ADR-005. ⚠️ **That is an exclusion from the loop and from nothing else** — not a block, not a
deprioritisation, not a descope.

## Outcome

- **Closed agent-closed and unverified.** No human has checked it.
- **The finding it was told to report and not fix is now repaired.** The brief flagged that the
  Sprint 5 vault page's **"Still open:"** line listed `0255`, by then closed. Re-measured 2026-08-14:
  that line survives byte-identical at `:49` — as house form requires — under a dated correction block
  that empties it and records **17 of 17 rows closed**. ✅ Nothing left open here.
- ⚠️ **A closed row set is not a closed board.** `ai-agents/sprints/sprint-5.md:3` still reads
  `🟢 ACTIVE`. Archiving it is task `0294`, **unrun** (verified 2026-08-14).
  > ✅ **SUPERSEDED LATER THE SAME DAY, 2026-08-14 — `0294` HAS RUN.** The bullet above is left
  > **byte-identical**; it was true when this row's record was written earlier that day. **The plan is
  > now at `ai-agents/sprints/done/sprint-5.md`** (move committed in `ce6bf54`), its banner reads
  > `## 🔒 CLOSED — 2026-08-13.`, and `dashboard.sh select-active ai-agents/sprints` returns
  > **`active none`**. ⛔ **The general principle the bullet states — *a closed row set is not a closed
  > board* — is UNAFFECTED and still true**; only its measured instance is spent. See
  > [[tasks/sprint-5-fix-what-a-real-project-found]].
  >
  > > ⚠️ **Dated correction 2026-08-22 (lint) — the `active none` reading in the block above is a 2026-08-14 measurement, not a current one; the block is left byte-identical.**
  > > [[tasks/sprint-6-repair-the-record-the-board-rests-on]] opened the same day and is the active board. Everything else in the block still holds.
- **Its batching partner `0291` is still open** (`🔲 Backlog`, verified 2026-08-14), as is `0295`.
  The batch is now **`0291` + `0295`**, and the reason for batching is **stronger**, not weaker: both
  rows edit `install-and-self-update.md`, and running them together writes that page **once** more
  rather than twice.
  > ✅ **SUPERSEDED LATER THE SAME DAY, 2026-08-14.** Both rows have since **shipped and closed**
  > `✅ Done (agent-closed — not owner-verified)`, and they did run as one batch against
  > `install-and-self-update.md`, exactly as the ruling intended. ⛔ **The five one-way links this row
  > deliberately left unreciprocated are now reciprocated** — `0295` added all five back-links in that
  > single write. Recorded on [[tasks/the-2026-08-14-retroactive-review-corrections]].
- **Evidence, not an answer, for `0290`.** This row is a clean instance of a close elsewhere
  falsifying a vault claim — the pattern `0290` is investigating. ⛔ It answers none of `0290`'s
  question and was fenced from trying.

## Related
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — the decision this row ingested; its vault page is this row's entire deliverable
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why the ingest is a separately-filed row at all: writes stay exclusive to `fkit-wiki`
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — why `/fkit-sprint-ship-loop` could not drive it; the loop never reads `## Owner`
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — task `0255`, the decision row ADR-043 discharges and this row records
- [[tasks/the-2026-08-13-vault-resync-chain]] — the three-writes-in-one-day churn that produced the owner's batching ruling
- [[tasks/the-2026-08-14-retroactive-review-corrections]] — ⚠️ *Added 2026-08-14:* tasks `0291` and `0295`, this row's batching partners. They discharged the five one-way links this row's reversion left standing, **in one write to the page the batching ruling was protecting**
- [[tasks/sprint-5-fix-what-a-real-project-found]] — ⚠️ *Added 2026-08-14:* the board whose archival (`0294`) superseded this row's *"unrun"* measurement later the same day
