# Decide whether Sprint 2 rolls over to a fresh board

**Source**: `ai-agents/tasks/done/0185-decide-whether-sprint-2-rolls-over-to-a-fresh-board/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-06
**Sprint/Tag**: Backlog board (unranked) · ID `0185` · owner fkit-producer

## Goal

Follow-up 8 of task `0174`'s merit-ordering report — marked **not ruled, awaiting the owner** and
simultaneously **the highest-leverage of the eight**. Sprint 2 was 81% closed with its 29 open rows
fragmented into five disjoint segments, 16 of them unreachable by rank; a rollover is **the only
mechanism that restores reachability** — and it is **not** a renumbering pass (report §3.3 ruled that
out): a rollover moves open rows to a new board and leaves the old one frozen; a renumbering pass
rewrites closed history. The task was **owner-gated**: it scoped the decision, and nothing could be
rolled without a signed ruling. The owner deferred it 2026-08-01.

## Key Changes

**The owner signed on 2026-08-06** — three rulings via `AskUserQuestion` in a live `fkit lead`
session: **"Roll over to Sprint 3."**, **"Follow the Sprint 1 precedent"** (archival shape), and
**"Pull it into Sprint 3"** (naming `0182`, accepting gate `0181`). The brief's `⛔ do-not-roll`
prohibitions were conditional on the absence of a ruling — **spent, not violated**.

Executed by a spawned `fkit-producer` with no owner channel:

| Act | Result |
|---|---|
| Archive the board | `sprints/sprint-2.md` → `sprints/done/sprint-2.md` (`git mv`), `🔒 CLOSED` banner in the Sprint 1 shape |
| Re-point links | **341** internal links in the archived board + **12** inbound links in 5 other files |
| Create the fresh board | `ai-agents/sprints/sprint-3.md` — ranks **restart at `P1`** |
| Carry the one open row | `0222` → Sprint 3 `P3` (later `P4`); its Sprint 2 row keeps the frozen `P189` |
| Pull in the named work | `0181` → `P1`, `0182` → `P2`, from the Backlog board |
| Renumber a closed row | **None. Not one, on any board.** |

**The four scope questions the brief required, all answered:** (1) in-flight tasks — none existed;
the case is **unexercised and still unspecified**; (2) citations — they point at a **frozen board,
not at nothing**; every broken *link* re-pointed, 107 files of **prose** citations deliberately left
for a dedicated task (`0236`, the Sprint 1 `0076` precedent); (3) dashboard discovery — verified
**before** the roll: `/fkit-status` globs `sprint-*.md` at the top of `sprints/` and treats `done/`
as closed, so the archival is exactly what makes Sprint 3 active, no tooling change; (4) rank
numbering — **restarts at `P1`**, the resulting two-board `P<n>` ambiguity stated as an accepted cost.

## Outcome

⚠️ **The brief reconciled its own five-day status contradiction honestly:** its `## Status` read
`🔲 Backlog` while its own Notes said `🚧 Blocked on an owner ruling` — two different states,
undetected for the whole window because nothing cross-checks a status cell against prose in the same
file. Corrected **forward** (dated resolution, original byte-identical), and the gap named as worth
its own task — filed as `0235`.

**What the task deliberately did NOT do, none silent:** the 107-file prose-citation sweep (`0236`);
the wiki re-sync — ADR-005 bars a producer from the vault (`0238`, **since performed by the
2026-08-07 sync that wrote this page**); `0182`'s brief-glob repair (landed the same day as a dated
correction in that brief). Plus one defect the rollover **exposed**: the **round-trip drift**
(sprint → Backlog → sprint breaks drift rule 2's single-move assumption; ceiling 45 rows — `0234`).

## Related
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — the board this task created
- [[tasks/sprint-2-remove-omnigent]] — the board it archived
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174`, whose report ruled the mechanism in while withholding its execution
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — why a rollover is the *only* mechanism that restores reachability without renumbering closed history
- [[tasks/narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank]] · [[tasks/build-the-closed-rank-immutability-guard]] — the two rows the owner pulled onto the new board
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board this brief lived on, unranked by design
- [[systems/fkit]]
