# Wiki resync for the lead rename and menu reorder

## ID
0141

## Sprint
Sprint 2

## Priority
117

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

Tasks 0139 and 0140 retire the label **"team room"** in favor of **lead**, and move lead from menu
option 7 to option **1**. Two wiki-vault pages assert the old facts and become **false** once those
land:

| Page | What it says |
|---|---|
| `ai-agents/wiki-vault/wiki/systems/fkit.md:28` | *"`fkit-lead` \| The **team room** (menu 7). Routes; **does no work**…"* |
| `ai-agents/wiki-vault/wiki/systems/install-and-self-update.md:29` | *"deterministic role MENU (1-7 — an if/else; no LLM in the routing)"* |

**`ai-agents/wiki-vault/` is written by the `fkit-wiki` role and nobody else** — that is why this is a
separate task rather than a fourth bullet on 0140. Per
[ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md),
reads are decentralized, writes are exclusive.

**A second, larger claim on `fkit.md:28` needs judgment, not a find-and-replace.** The line also says the
lead *"does no work"* — a **router-only** description that
[ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
reversed when it made the lead an orchestrating conductor that drives whole sprints via
`/fkit-sprint-ship-loop`. That is a **stale claim of substance**, not a naming slip, and it is the kind
of thing the ingest is for. Whether the sync's scope stretches to it is the wiki role's call — but it
must be **noticed and reported either way**, not silently left standing.

**There is an existing wiki task with overlapping surface: task 99 (`0117`)**, which ingests ADRs
031/032 and the evolved lead role. If 0117 lands first it may already have corrected the *"does no
work"* claim. **Check 0117's state before starting** — this brief may shrink to the two menu-number
edits, or 0117 may make part of it redundant. Do not assume; look.

## What to build

Run the wiki role's normal procedure — `/fkit-wiki-sync` (or a targeted `/fkit-wiki-ingest`, the wiki
role's call) — over the delta from 0139 + 0140, so the vault stops asserting the retired facts:

1. `systems/fkit.md:28` — "team room (menu 7)" no longer describes the lead. Prefer wording that does not
   re-pin a menu number that can move again.
2. `systems/install-and-self-update.md:29` — confirm the `1-7` range statement. **The range is unchanged
   by 0139**, so this line may well still be correct; verify rather than editing reflexively.
3. Sweep the rest of the vault for the retired phrase and for any other menu-position claim — the two
   pages above came from a 2026-07-25 sweep, but **verify rather than trusting the inventory**.
4. Report the *"does no work"* staleness whether or not you fix it under this task.

## Verification steps

1. `grep -rn "team room\|team-room" ai-agents/wiki-vault/` returns nothing.
2. `grep -rn "menu 7\|menu option 7" ai-agents/wiki-vault/` returns nothing.
3. Every edited page still validates against `ai-agents/wiki-vault/schema.md`, and its back-links and
   index entries still resolve (the standard lint conditions).
4. `ai-agents/wiki-vault/log.md` records the sync, per the vault's own convention.
5. The report states explicitly whether the *"does no work"* claim on `systems/fkit.md:28` was corrected
   here, corrected earlier by 0117, or left standing — and if left standing, why.

## Verification steps that are NOT this task's

Do not re-verify 0139's menu behavior or 0140's doc sweep — those have their own briefs and their own
checks. This task's surface is the vault.

## Notes

- **Depends on:** 0139, 0140 — hard. Syncing the vault against text that has not settled produces a
  second round of drift, which is the exact failure ADR-027 recorded five recurrences of.
- **Blocks:** nothing.
- **Owner:** fkit-wiki — the exclusive write gateway for `ai-agents/wiki-vault/`. **No other role may
  execute this brief**, including a coder who has just finished 0139/0140.
- **Coordinate with task 99 (`0117`)** — overlapping surface on `systems/fkit.md`. Check its state first;
  if both are pending, landing 0117 first is likely cheaper and this task shrinks.
- **Per ADR-033 §2, the wiki role does not close its own task** — it ends by flagging *"task 0141 ready
  to close"* and the close is routed to the producer. (That flag-don't-close behavior is itself being
  built as task 108 / `0125`; until it lands, do the flagging by hand.)
- No commit — leave the edits in the working tree.
