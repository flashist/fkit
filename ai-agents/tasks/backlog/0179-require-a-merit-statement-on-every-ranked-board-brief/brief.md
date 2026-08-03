# Require a merit statement on every ranked-board brief, in the canonical form

## ID
0179

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**This is follow-up 2 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§8).

`/fkit-task-brief` **step 5 — "Determine priority"** today mandates a merit sentence **only for
appended rows**, and mandates it in a legacy shape:

> `**On merit this belongs directly below <NNNN>**, because <reason>.`

Report §3.1 ruled the practice right and its **form** wrong, and ruled the canonical grammar in:

```
- **On merit:** immediately above 0154 — <reason>
- **On merit:** as ranked
```

Two things change, and they are separable in principle but not in practice — a brief cannot carry a
required field in a shape the skill does not describe:

1. **Scope.** The statement becomes required on **every** brief filed onto a **ranked** board, not only
   on appended rows. The Backlog board is excluded by construction: it is unranked, so there is no rank
   for a merit statement to be relative to, and its briefs read `## Priority: Unscheduled`.
2. **Form.** The mandated sentence becomes the canonical grammar recorded by task `0178`, including the
   `as ranked` explicit no-op — which is the half that makes absence detectable and is the reason task
   `0180`'s guard can exist at all.

**Why this is not cosmetic.** Report §4.1 accepted, explicitly, that **16 of 29 open sprint-2 rows**
cannot be promoted to their merit positions and that the number grows as the board closes out. The
merit statement is the project's only record that the gap exists. A field that is optional on most
briefs records nothing reliable.

## What to build

A skill-text edit to `claude/skills/fkit-task-brief/SKILL.md`, **step 5** — and, per
[`conventions/dual-home-parity.md`](../../../knowledge-base/conventions/dual-home-parity.md), to any
`claude/scaffold/` counterpart that carries the same text. **Check for the counterpart; do not assume
either way.**

1. Restate the merit-statement requirement as applying to **every brief on a ranked board**.
2. Replace the legacy sentence shape with the canonical grammar, quoting both shapes verbatim.
3. Keep the existing append-rank flag sentence — it answers a different question (*is this rank the
   owner's?*) and is not superseded:
   `⚠️ Priority NNN is append rank, NOT a merit ranking — flagged for owner confirmation.`
4. Point at
   [`conventions/priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
   as the grammar's home rather than restating the full rationale in the skill.
5. State the Backlog-board exclusion explicitly so a reader does not have to infer it.

### Out of scope

- **⛔ Do not narrow step 5's owner-ruled re-rank exception.** That is task `0181`, a different edit to
  the same step. **They touch the same file — sequence them, do not merge them.**
- **⛔ Do not build the `brief-missing-merit` guard.** That is task `0180`.
- **⛔ Do not backfill existing briefs.** Task `0180` carries that decision.
- **⛔ Do not re-rank anything, and do not file any brief.**
- **⛔ Write no `:NNN` line-number citations.** Anchor the rule by its step heading and quoted text — a
  bullet ordinal is a line number wearing different clothes (ADR-035's citation note).
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. Step 5 of `claude/skills/fkit-task-brief/SKILL.md` states the requirement applies to every brief on
   a ranked board, and names the Backlog board as excluded.
2. Both canonical shapes appear verbatim in the skill text.
3. The skill points at the convention page task `0178` wrote, and the page it points at exists.
4. `npm test` passes, including `test/skill-frontmatter.test.js` — the edit must not break the
   frontmatter parse.
5. If a `claude/scaffold/` counterpart of the skill exists, `diff` against it is empty; if none exists,
   say so explicitly in the close report rather than leaving it unstated.
6. The `.claude/` fkit-managed copies are refreshed from `claude/` (`claude/fkit-claude-init.sh .`) so
   the running session's skill matches the source; confirm the refreshed copy carries the new text.
7. `grep` for `\.md:[0-9]` over the changed files returns nothing.

## Notes

- **Depends on:** `0178` — the skill points at the convention page, and pointing at a page that does not
  yet carry the grammar ships a dangling instruction.
- **Blocks:** `0180`.
- **⚠️ Priority 157 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** immediately below `0178` — it cites `0178`'s page and must land after it, so append rank
  and merit rank coincide **within this batch**. The batch as a whole belongs above `0132`; see `0178`.
- **⚠️ File collision with `0181`.** Both edit `/fkit-task-brief` step 5. They are independent in
  substance and must not be merged (different rulings, different owners of the decision), but whichever
  lands second must be rebased on the first. **Flagged for the owner and for whoever schedules them.**
- **Merit form used here** is the canonical `**On merit:**` shape from report §3.1 / ADR-035 — the shape
  this task is landing in the skill. Flagged so it is not read as drift.
- No existing row was renumbered by this brief.
