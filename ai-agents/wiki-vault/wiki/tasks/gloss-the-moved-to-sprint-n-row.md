# Gloss the `➡️ Moved to [Sprint N]` row so `N` reads as the sprint identity, not a number

**Source**: `ai-agents/tasks/done/0268-gloss-the-moved-to-sprint-n-row-so-n-reads-as-the-sprint-identity-not-a-number/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 5 P8 (append rank `P15`, promoted 2026-08-11) · task `0268` · owner `fkit-coder`

## Goal

`ai-agents/knowledge-base/conventions/task-status-vocabulary.md` leaves the `N` in `➡️ Moved to
[Sprint N]` undefined. **That is harmless while the parser only ever matches digits, and becomes wrong
the moment `0264` lands the letter suffix** — a move target is then an **identity** (`4`, or `4c`), not
a number.

Named in ADR-040's own Consequences as **the producer's to file, not the ADR's**.

## Key Changes

⛔ **Gloss only — do NOT change the marker syntax.** ⛔ No new status value. ⛔ Do not edit the
`**Moved (to backlog)**` row.

⚠️ **The file is DUAL-HOMED and the twin edit is UNENFORCED.** Both copies exist, the target line is
**byte-identical in both**, and the file is a **declared `audience-adapted` parity exception** in
`test/dual-home-parity-exceptions.mjs` — so the parity test **subtracts it from the check and nothing
will tell you if you edit one copy and not the other.** The scaffold twin's change also requires
regenerating the structure manifest, or `test/structure-manifest.test.js` goes red.

⛔ **Do not edit the parity exception's `reason` as a side effect — if you think it needs changing,
stop and say so.**

## Outcome

Closed `(agent-closed — not owner-verified)`.

⚠️ **This is the one row whose merit position the 2026-08-11 re-rank did not satisfy, and the board
records it rather than smoothing it over.** `0268` and `0265` **both** carry the merit statement
*"immediately below `0264`"*, and **only one row can hold `P5`.** The owner's ruling fixed the order
`0264`→`0269`, which gave `P5` to `0265` and put `0268` at `P8`, **three below its stated merit
position.** No dependency is violated — `0264` still lands before `0268` — **but the merit statement
is not honoured exactly, and its brief now says so.**

**The finding worth carrying:** an unenforced dual-home twin is a live hazard class — *the parity test
excludes precisely the files most likely to be edited on one side only.*

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]]
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — the suffix that makes `N` an identity, and the ADR that named this follow-up
- [[tasks/implement-adr-040s-identity-grammar-in-dashboard-sh]] — the dependency; the change that makes the gloss necessary
- [[tasks/enforce-task-status-vocabulary]] — the convention this glosses
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the parity regime
- [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] — where the `audience-adapted` exception list came from
- [[tasks/build-dual-home-parity-test]] — the test that subtracts this file from its own check
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]]
