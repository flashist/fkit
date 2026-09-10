# Sweep B — the single-site correction notes in ONE pass, absorbing and closing the individually-filed rows

**Source**: `ai-agents/tasks/done/0357-sweep-b-the-single-site-correction-notes/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P9` · task `0357` · owner `fkit-coder`

## Goal

⛔ **THIS ROW ABSORBS EXISTING ROWS. IT DOES NOT SIT BESIDE THEM.**

A **single-site correction note** row is one whose whole content is: *a record says something that is
no longer true; append a dated note at the named site saying so.* No source change, no behaviour
change, no board status change — **the note is the entire deliverable.**

⭐ **They are individually correct and collectively the problem.** Each one costs a task folder, a
brief, a plan, a worklog, a review ledger and a close — **six artifacts to append one paragraph.**
⛔ **That ratio is what drives the record-repair share Sprint 7 exists to cap.**

## Key Changes

⛔ **THE HARD GATE:** `0354`'s and `0176`'s guards both **green before the sweep touched a file.**

⛔ **Append-only, by design.** Six members land notes **inside closed task folders** — that is exactly
what a dated append is for ([[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]]),
⛔ **but existing text is never edited, reordered or reflowed.**

Four further constraints, each of which had already been got wrong somewhere:

- ⛔ **A sweep does not get to relax a member's scope.** Several members carry explicit scoping —
  `0346` is *"scoped to Build"*, `0335` names *"TWO false mechanism claims"* and no more, `0321` says
  *"one repaired in place, one annotated"*. Each was quoted in the worklog and honoured.
- ⛔ **Change no `## Status`, `## Sprint`, `## Priority`, `## ID` or `## Owner`** on any absorbed brief.
  The closes are the producer's act; this row does not touch those fields.
- ⚠️ **Nine candidates land notes on ADRs.** An ADR's correction note is a statement about a decision's
  **standing**. ⛔ **Do not restate the decision, narrow it, or mark it superseded** — the note says what
  is no longer true and nothing more.
- ⛔ **No `path:NNN` citations in the notes** — anchor on quoted text.

⚠️ **The absorbed rows carry FIVE different `## Owner` values** — `fkit-coder`, `fkit-producer`,
`fkit-architect`, `fkit-reviewer`, `fkit-wiki`. Where a member needed a judgement only the architect or
the reviewer could make, ⛔ **surface it rather than deciding it.**

### The members

⛔ **`0212` was ROUTED OUT to Sweep C by owner ruling of 2026-08-29** — its site is
`ai-agents/wiki-vault/log.md`, and [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
makes vault writes `fkit-wiki`'s exclusively. ⚠️ **That is the ADR-005 wall, not a scheduling
preference** — Sweep C is `fkit-wiki`-owned and this sweep is `fkit-coder`-owned. It is kept in the
candidate table, struck, *because deleting it would lose the record of where it went*. ⛔ The
three-sweep total is unchanged at ~38; it moved from `13 + 20 + 5` to `13 + 19 + 6`.
⛔ **`0320` was ruled into Sweep A**, settling the other boundary case.

| ID | Owner | The site the note landed on | Board today |
|---|---|---|---|
| `0146` | `fkit-reviewer` | `0139`'s accepted residual — the false *"menu-pick alias"* claim | done |
| `0170` | `fkit-coder` | `fkit-sprint-ship-loop` — the stale *"stays byte-unchanged"* claim, ⚠️ at **two** sites, not one | done |
| `0183` | `fkit-producer` | two live records — the *"no closed row was renumbered"* claim, plus a terminology collision | done |
| `0196` | `fkit-architect` | ADR-010's `skillOverrides` claims, retired by ADR-018 — ⭐ **a drift, not a reversal, and the note says so** | done |
| `0201` | `fkit-coder` | `0143`'s and `0158`'s closed review ledgers | ⚠️ **still `🔲 Backlog`** |
| `0205` | `fkit-architect` | ADR-037 §5's enforcement claim — *"none is possible"* is a **narrowing, not a reversal** | done |
| `0207` | `fkit-architect` | ADR-020 — naming the **driver** a sanctioned `plan.md` writer | done |
| ~~`0212`~~ | `fkit-wiki` | ⛔ **ROUTED OUT to Sweep C** — `ai-agents/wiki-vault/log.md` | done, via `0358` |
| `0274` | `fkit-reviewer` | `0259`'s and `0264`'s closed review ledgers | done |
| `0276` | `fkit-architect` | ADR-041's `unresolved-plan-sprint` drift-mechanism claim and its echoes | done |
| `0279` | `fkit-coder` | `status-report-format.md`'s undefined `N`, **in both homes** | done |
| `0281` | `fkit-architect` | ADR-003's *"the need it identified is still unmet"* claim | done |
| `0299` | `fkit-coder` | the archived Sprint 2–5 plans — five active-sprint-glob mechanism claims | done |
| `0312` | `fkit-coder` | `architecture.md`'s false *"the CI half has never actually run"* claims | done |
| `0318` | `fkit-producer` | `0238`'s closed brief — an acceptance naming a board state that is gone | done |
| `0335` | `fkit-producer` | the records inside `0327`'s folder — **two** false mechanism claims and no more | done |
| `0346` | `fkit-architect` | ADR-038's *"roles come from the enumerated step table"* claim, **scoped to Build** | done |
| `0348` | `fkit-reviewer` | `0188`'s closed review ledger — a coverage correction | done |
| `0350` | `fkit-reviewer` | `0125`'s closed review ledger — the R3 discharge note | done |
| `0351` | `fkit-coder` | `test/prove-red.sh`'s *"the only proof the seam is honoured"* wording at `0k`/`0l` — ⚠️ it **touches `test/`**, ruled in deliberately | done |

⭐ **One member is a different KIND of act, and the brief says so before doing it: the NUL byte in
`0246`'s closed review ledger.** Added by owner ruling of 2026-09-02, option label verbatim
**"Fold into an existing sweep (Rec)"**. A **literal NUL (`0x00`)** sat inside a backtick span that was
meant to hold the two-character text `\0`.

⛔ **What it broke is not cosmetic — it made a ledger invisible to the project's own tooling.** Plain
`grep` for `^Status:` returned **nothing, exit 1** (it treats the file as binary), while `grep -a`,
`sed`, `awk`, Python and Node all read `Status: closed-out` from it without complaint. ⭐ **That single
byte is why two reviewers computing the same corpus figure over the review ledgers got different
answers.** ⭐ *A record no tool can see is worse than a record that is wrong, because nothing flags it.*

⛔ **It is the sweep's one sanctioned exception to append-only** — it edits existing bytes and removes
one — authorized by **both** the owner's ruling **and** the fact that the byte is a **typo in the
record, not part of it**: repairing it changes no claim, no finding, no disposition and no date.
⛔ **It absorbs no task row and closes none** — there is no brief behind it, and the arithmetic is
unchanged.

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`.

⚠️ **`0201` is the one in-scope candidate still `🔲 Backlog`** — measured on disk 2026-09-10. ⛔ **This
page records that it did not close; it does not assert why**, and the reason is not stated in the
brief this page was ingested from.

- **Depends on:** `0353`, `0354`, `0176`, `0237` — ⛔ all hard.
- **Blocks:** nothing.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] · [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]]
  — the other two sweeps; ⛔ **three sweeps, disjoint membership**
- [[tasks/build-the-link-resolution-guard]] · [[tasks/build-the-coordination-citation-policy-guard]] —
  the two guards that had to be green first
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the wall that routed `0212` out
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — the
  append-only rule six members landed under
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why this row closed nothing
  itself
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]]
  · [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] ·
  [[decisions/adr-003-ci-runs-validate-bundles]] ·
  [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] ·
  [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]] ·
  [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the ADRs whose pages this sweep's
  notes changed
