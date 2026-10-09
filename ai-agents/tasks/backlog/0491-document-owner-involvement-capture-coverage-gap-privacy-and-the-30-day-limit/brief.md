# Document owner-involvement capture: the coverage gap, privacy, and the 30-day limit

## ID
0491

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

> ⛔ **Do not start without the owner's specific word.**
>
> ⛔ **Blocked by [`0485`](../0485-owner-reads-and-accepts-adr-053-before-any-owner-involvement-capture-is-built/brief.md)
> (B0) until ADR-053 is `accepted`.** The 2026-10-05 APPROVE of Phase B is not acceptance of the ADR.

## Context

**Where this comes from.** Brief **B5** of the Phase-B split of the gated umbrella
[`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md)
(the documentation half of item 5, "privacy", and the coverage gap). Design:
[ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md).
**ADR-053 governs where it differs from `0482`'s `plan.md` § 3.** The "Carry into the Phase-B briefs →
B5" list in `0482`'s `worklog.md` is folded in below.

**Why last.** Docs describe what `0486`–`0490` actually shipped — wording, paths, script names and the
report's place — so they wait for all four.

## What to build

Update fkit's user-facing and architecture docs (README, `ai-agents/knowledge-base/architecture.md`,
and the mirrors the plan finds — `claude/README.md`, `CONTRIBUTING.md` where relevant) to say, in plain
words:

1. **What is captured, and what never is.** Counts, times, task ids and fixed labels only; **no text at
   all, even locally** (owner ruling OQ1). Where the local log lives (`.fkit/owner-log/`, gitignored).
2. **The coverage gap** (D13): only `fkit <role>` launcher sessions on this machine are captured; plain
   `claude` sessions, claude.ai, hand edits, git commits, other machines and teammates are not. Why
   wiring a committed `.claude/settings.json` was rejected (teammates' consent; ADR-010).
3. **The 30-day limit, on disk vs what readers see** (D4, owner ruling R9 "Accept, fix the wording"),
   using the B0 plain-words line: *"Each day's log becomes deletable 30 days after that day starts, so
   some entries go up to a day early. Old files are removed the next time fkit records something or
   writes a summary in that project — until then they stay on disk (typically hours to days; forever if
   the project is never used again). What fkit reads never goes back more than 30 days."*
4. **No off-switch** (Ruling 2): safety comes from the closed format, not a toggle.
5. **What the metric means and does not mean**: "autonomous after plan approval", captured channels
   only, unknown is never counted as autonomous, and **it is not owner verification** — it never
   upgrades `(agent-closed — not owner-verified)` (D12, ADR-049). Never "fully automatic".
6. **The named residual risks** (ADR-053 Consequences), in one short list.
7. The `task:` spawn line and `[task NNNN]` relay tag (`0487`), where the docs describe the ship-loops.

Nothing in the shared rules block. Do not edit `ai-agents/wiki-vault/` — wiki updates are `fkit-wiki`'s
(ask for an ingest after this lands).

## Verification steps

1. Each of items 1–7 is present in the docs; the D4 plain-words line appears as given (or with wording
   the owner approved at `0485`).
2. The docs name exactly what `0486`–`0490` shipped — paths, script and report names match the code
   (checked by grep, cited in the worklog).
3. No doc claims capture covers plain sessions, and none says "fully automatic" or "verified".
4. `npm run test:docs` and `node --test test/reference-integrity.test.js` pass; `0484`'s top-level-doc
   link check too, if it has landed.
5. Rules block size unchanged — `fkit-claude-init.sh`'s cap check passes with the same byte count.
6. No absolute machine path in any changed file; no change under `ai-agents/wiki-vault/`.

## Notes
- **Depends on:** 0485, 0486, 0487, 0488, 0489, 0490
- **Blocks:** nothing
- **Parent:** [`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md);
  design in [ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md).
- **Overlap with `0121` (observer):** document that `0121` reads this one log, sees at most 30 days of
  it (older files may still be on disk until the next prune, and must be ignored), and needs the owner
  to re-rule OQ4 for longer history — still no second log (ADR-053 D11, "Re-raise only if").
- **Not yet scheduled:** on the Backlog board; pulling it into a sprint is the owner's call.
- **Consulted:** none at filing.
- Filed 2026-10-05 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  APPROVE of `0482` Phase B items 1–5; it decides nothing beyond that APPROVE and ADR-053.
