# ADR-047: A sprint has an explicit status, and "current" means EVERY `In progress` sprint

**Date**: 2026-09-10
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint.md`

> ⭐ **Ingested 2026-09-16** (sync pass, watermark `b4a1a52`→`81f1429`). This ADR had **no vault page at
> all** until this pass, despite having landed in the committed delta — it was missed by the previous
> sync's scope.
>
> ⚠️ **Amended TWICE after acceptance**, both on 2026-09-10 (owner ruling W1 at the round-1 review gate,
> then X1/X2/X3 at round 2). ⛔ **Every amendment is dated and attributed at its own site** in the
> source. **No earlier ruling was reversed and no owner ruling was reinterpreted.**
> ⛔ **The load-bearing second-round finding is R16: the FIRST amendment's own closure of R7 recreated
> the defect it closed** — it required five `select-active` drifts to *"reach the roll-up"* when
> **`select-active` has no roll-up**, which made five required tests unwritable and task `0338`
> unstartable. §7.2 is the clause that fixes it.

## Context

The owner, verbatim to the lead on 2026-08-25: leads *"are always getting confused by what I mean when I
am saying 'current sprint'"* — often reporting the not-completed sprint rather than the one being
worked.

- **Task** status is carried explicitly and has a vocabulary and movers. **Sprint** status had **two
  implicit carriers, no vocabulary, and no mover.**
- The concrete failure: **Sprint 5 stayed "active" while finished**, because folder location alone
  cannot express `Backlog` vs `In progress`.

## Decision

> **A sprint has an explicit status — `🔲 Backlog` / `🔄 In progress` / `✅ Done` / `⛔ Cancelled` —
> mirroring the task lifecycle. "Current sprint(s)" = "active sprint(s)" = every sprint whose status is
> `In progress`.** Asked for status with no sprint named, `/fkit-status` reports **ALL of them**. Where
> exactly one board must be chosen (the ship-loop drives one board), the default is the
> **lowest-ordered** `In progress` sprint, overridable by an explicit active-sprint marker. A sprint
> whose status is `Done` or `Cancelled` — by status **or** by the legacy `🔒 CLOSED` banner — is never
> reported as active.

### The vocabulary — four values

| Status | Line-3 banner | Lives in | Set by |
|---|---|---|---|
| `🔲 Backlog` | `> ## 🔲 Backlog — <date>.` | `ai-agents/sprints/` | producer, **by hand** |
| `🔄 In progress` | `> ## 🔄 In progress — <date>.` | `ai-agents/sprints/` | producer, **by hand** |
| `✅ Done` | `> ## ✅ Done — <date>. Closed by /fkit-sprint-done.` | `ai-agents/sprints/done/` | **mover only** |
| `⛔ Cancelled` | `> ## ⛔ Cancelled — <date>. Closed by /fkit-sprint-cancelled — <reason>.` | `ai-agents/sprints/cancelled/` | **mover only** |

- ⭐ **The markers are deliberately the task markers**, so one eye reads both boards.
- **`🚧 Blocked` does NOT exist for a sprint.** A sprint is not blocked — its **tasks** are. A board
  whose every row is blocked is still `In progress`.
- **`➡️ Moved` does not apply** — it is a row disposition, not a board state.
- **The agent-closed marker applies** on ADR-033 §5's rule unchanged.
- **A reason is mandatory on `⛔ Cancelled`.**

### The carrier — a line-3 banner

⛔ **Strictly line 3** (H1, blank, banner). Strict position was chosen over *"the first line of the
leading blockquote"* so that a `> ## ` deeper in a board can never be mistaken for a status.

⚠️ **The date is part of the recognizer, not just of the grammar** — corrected under ruling W1 (R4). The
originally-pinned recognizer admitted every dateless and malformed form; since §1 has the producer
writing two of the four statuses **by hand** — the exact path that drops a date — a loose recognizer
would silently accept a banner the grammar forbids. ⭐ *"A recognizer that does not enforce the grammar
it sits under is not a recognizer."*

⛔ **A malformed line 3 is MALFORMED, not absent** — status resolves to `unresolved`, the board is never
eligible, and `drift sprint-status-malformed` fires, **distinct from `sprint-status-missing`**, so
*"the producer typed it wrong"* never reads as *"nobody typed it"*.

**Active-board override:** the literal token **`⭐ ACTIVE BOARD`** in an `In progress` banner's trailing
prose. One carrier, one reader, one grammar — no second file, no second field.

**Rejected carriers, with reasons:** a `## Sprint status` field (a second `##` heading in a
positionally-parsed file); an H1 segment (ADR-040 owns the H1, and a status is not an identity);
folder-location only (cannot express `Backlog` vs `In progress` — precisely what failed for Sprint 5).

**Supersedes ADR-041 in part**, scoped in §8. ADR-041's candidate set, identity ladder, same-identity
tie-break, `Backlog` token and one-grammar-one-implementation constraint are **untouched and in force**.
**Depends on ADR-040 and ADR-041 and cannot ship before either.**

## Consequences

- **Positive.** *"Current sprint"* stops being a heuristic and becomes a **stated fact with a single
  reader**. A finished board is ineligible **the moment its banner is stamped**, not when someone
  remembers to move it. Two parallel sprints become a **supported arrangement** rather than an
  ambiguity.
- ⛔ **Negative — an ordering constraint, owner-ruled.** The selector change makes a banner-less board
  **ineligible**. Landing it before boards carry banners returns `active none` **mid-sprint**, and the
  ship-loop cannot find the board it is running on. ⭐ **The backfill task (`0340`) must precede the
  selector task (`0338`).**
- **Negative — a repin, not a tweak.** Eight named scenarios in `test/dashboard-contract.test.js` assert
  the active line by exact string equality and build every fixture without a banner.
- ⚠️ **Negative — one word, two meanings.** `Backlog` is now both an identity and a status. The
  by-position rule contains it; it does not erase it. ⭐ **The owner OVERRULED the architect here, and
  the objection is on the record** rather than softened away.
- ⛔ **Negative — a PROTOCOL break, not only a prose ripple.** The version marker goes to
  `⟦fkit-dashboard v2⟧`, touching the board render path too because one definition feeds both envelopes.
  ⭐ **The first draft named the prose ripple and missed the protocol entirely** — recorded so the
  omission is not repeated for the next shape change.
- ⚠️ **Negative — the sprint movers do NOT mirror the task movers' step order.** They repoint before
  `git mv`; the task movers do the reverse. `0341` is **inverting a precedent, deliberately**, and the
  ADR's original claim that it was *"the order the task movers already do it"* was **false and is
  withdrawn**.
- ⚠️ **Negative — this ADR was amended twice after acceptance, and the first amendment introduced
  defects of its own.** Round 2 found eleven findings, of which **five were created or left open by the
  round-1 amendment**. ⭐ **Recorded, not softened:** amending an accepted ADR under time pressure is how
  a design ruling acquires new gaps.

## Related
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] — **superseded in part** by this ADR; its other clauses stand
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — the identity grammar this depends on
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the identity separation the sprint movers inherit
- [[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]] — the other Sprint 9 decision ingested in this pass
- [[tasks/decide-whether-the-active-sprint-glob-widens]] — the lineage question this settles
- [[tasks/retire-the-sprint-glob-in-fkit-status-skill]] — the glob retirement that preceded it
- [[tasks/sprint-5-fix-what-a-real-project-found]] — Sprint 5, the board that stayed "active" while finished
- [[tasks/record-the-sprint-lifecycle-adr-047]] — task `0337`, the row that produced this ADR
- [[tasks/give-the-selector-a-status-rung-and-a-lowest-first-choice]] — task `0338`, the reader built to it
- [[tasks/backfill-a-sprint-status-onto-every-existing-sprint-plan]] — task `0340`, the data migration it required
- [[tasks/build-the-producer-only-sprint-movers]] — task `0341`, SD-3's `/fkit-sprint-done` + `/fkit-sprint-cancelled`
- [[tasks/teach-the-roles-what-current-sprint-means]] — task `0339`, the convention page and the roles that answer the owner
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]] — the board that shipped it, and the first ever closed by a mover
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]] — ⭐ the first board **created** under this lifecycle
- *Added 2026-09-16 (sync `b4a1a52`→`c59f4d7`):* [[tasks/give-the-sprint-mover-pins-and-successor-mode-durable-prove-red-mutations]] — task `0388`: ⭐ **this ADR's own *"re-raise on a third instance"* fence fired** — the emitter-map class had reached a fourth instance, and item A mechanised it as `prove-red` mutation 39
- *Added 2026-09-16 (sync `b4a1a52`→`c59f4d7`):* [[tasks/sweep-the-repo-only-claude-path-form-out-of-installed-facing-prose]] — task `0390`: ⭐ **this ADR's ~20 `claude/…:NNN` citations were fenced OUT of that sweep** — source coordinates into this repo are a different thing from an installed-facing instruction
- *Added 2026-09-16 (sync `b4a1a52`→`a351cb6`, closing a one-way link):* [[systems/fkit]] — the team page whose mover inventory this ADR grew from **two to four**, under one unchanged `skills_for_role()` rule
