# Producer handoff — scope the "/fkit-status filtered board" task

**Purpose of this file:** resume an in-flight producer task in a *fresh* `fkit producer` session that
has the `AskUserQuestion` tool available. Paste/share this at session start, then run the interview
below and write the briefs.

**Date started:** 2026-07-18 · **Sprint:** Sprint 2 (active) · **Skill in play:** `/fkit-task-brief`

---

## The owner's request (verbatim intent)

> Change `/fkit-status` so the dashboard shows **only tasks that are not complete yet** — i.e. hide
> `✅ Done` and `⛔ Cancelled` rows.

## What's already established (don't re-derive)

**Grounding done this session** — read `.claude/skills/fkit-status/SKILL.md`,
`.claude/skills/fkit-status/dashboard.sh`, and
`ai-agents/knowledge-base/conventions/one-skill-one-output.md`.

**⚠️ Conflict flagged — this reverses an explicit design principle.** The skill deliberately shows
every row: *"show the dead rows — a board that hides cancelled and moved tasks lies about scope."* The
`dashboard.sh` roll-up *"sums to M by construction."* The request is a conscious reversal — legitimate
(owner's skill), but do not plan around the principle silently. Recommended mitigation: hide the
done/cancelled **rows** but **keep the roll-up totals line** so scope isn't hidden.

**Locked constraint — one-skill-one-output** (owner-ruled 2026-07-17; task 44 removed a `/fkit-status
full` switch). The filtered board must **replace** the single output, **not** add a toggle. A toggle
requires a reversal ADR first.

**Technical scope (producer's read, no architect consult needed):** the board is "computed, not
recited / paste verbatim," so **filtering belongs in `dashboard.sh`'s `⟦BOARD⟧` rendering** — not in
prose telling the producer to drop rows. No feasibility unknown (the script already parses all states)
→ this is a straight implementation task, not an investigation.

## Open questions — run these as the interview (recommendations noted)

1. **Roll-up line.** Keep the totals (`50 done · 12 backlog · 2 cancelled — of 64`) while dropping the
   done/cancelled rows? → **REC: keep the roll-up.** (Alt: drop it too — scope becomes invisible.)
2. **`➡️ Moved` rows.** Hide them too (a third inert state), or keep them? Sprint 2 has none, but the
   skill is generic. → **REC: owner's call; hiding is consistent with the ask, keeping preserves the
   pointer to where work went.**
3. **Drifted rows (safety).** A row marked done/cancelled but flagged by *drift* as really unknown
   (`waiting on owner`) — keep visible, or hide by raw marker? → **REC: always keep drifted rows
   visible; filter on reconciled state, not the raw marker. Hiding a drift buries a finding — the
   correctness reason the board shows everything today.**
4. **Replace vs switch.** Filtered board replaces the one output, or add a `full` toggle? → **REC:
   replace.** A switch reverses the locked one-skill-one-output ruling → would need a reversal ADR
   first.
5. **(confirm) "Incomplete" = `🔲 Backlog` + `🔄 In progress` + `🚧 Blocked`** (everything except
   done/cancelled, and Moved per Q2). Assume yes unless told otherwise.

## Planned output once answered (do NOT write until interview is done)

Two briefs, **Sprint 2**, appended **after priority 64** (do not renumber), contiguous, dependency
order:

- **Brief A — Implement the filtered `/fkit-status` board.** Change in `dashboard.sh`'s `⟦BOARD⟧`
  rendering per the answers (hide done/cancelled[/moved]; keep roll-up per Q1; keep drifted rows per
  Q3); update the SKILL.md text describing the board so skill and script agree; tests per ADR-014
  (`node --test`, zero devDeps) — at minimum that a done/cancelled row is absent AND a drifted
  done-row is still present. Owner: fkit-coder. One shippable unit.
- **Brief B — Wiki sync after the filtered-board change.** Precedent: tasks 45/51 (skill-behavior
  change → vault update). Owner: fkit-wiki. **Depends on: Brief A — hard.**

Then: add one status-table row per brief to `ai-agents/sprints/sprint-2.md`, plus a dated
"Addendum — tasks 65 and 66 added out of band (YYYY-MM-DD)" note (follow the existing addendum
precedent at the end of the plan). Numbers 65/66 assumed — confirm the highest existing priority is
still 64 at write time.

## Producer role reminders (hard rules)

- Producer writes **briefs, not code**. Files created: new briefs under `ai-agents/tasks/backlog/` +
  one sprint-plan edit. Nothing else.
- **Do not commit.** **Do not move task files.** **Do not write the wiki.**
- Every new brief `## Status` is `🔲 Backlog`.

## Loose end noted this session (not part of this task)

Tasks **59 and 60** were cancelled today (per ADR-024). Their sprint-plan Status **cells** read bare
`⛔ Cancelled` with the date in the description column → `dashboard.sh` flags both as
`nonconformance / cancelled-without-date`. The owner has an open choice to correct the two cells to
`⛔ Cancelled (2026-07-18)` (a deliberate format edit, not a status change). Surface if relevant;
otherwise leave for the owner.
