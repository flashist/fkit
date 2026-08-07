# Refresh architecture.md §9.1's test-suite inventory — count and enumeration to match disk

## ID
0251

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Docs drift, surfaced during `0248`'s planning and verification (2026-08-07)** — see
[`0248`](../../done/0248-update-the-docs-for-the-structure-check-capability/brief.md)'s `plan.md`
§Explicitly-not-touched and its review. Filed as its own task on the owner ruling relayed at `0248`'s
plan gate (`AskUserQuestion`, 2026-08-07, verbatim **"File separate task (Recommended)"** on `0248`'s
open question 2).

The claim at
[`architecture.md`](../../../knowledge-base/architecture.md) §9.1 (line ~478 today) reads **"eight
`node --test` contract suites"** and enumerates eight by name. Verified against disk 2026-08-07:
`ls test/*.test.js` returns **19 files**.

**⚠️ The drift is larger than a sprint-4 ripple — re-derive from disk, do not patch.** The stale
eight plus the five sprint-4 structure suites (`structure-manifest` / `structure-spec` /
`structure-check` / `structure-repair` / `structure-notice`) is 13, not 19 — six further suites
(`askuserquestion-marker-hook`, `closed-rank-immutability`, `dual-home-parity`,
`shiploop-marker-hook`, `skill-frontmatter`, `turn-completion-hook`) accumulated across earlier
sprints without §9.1 moving. The enumeration must be rebuilt from `ls test/*.test.js`, not extended
by five.

Adjacent facts, verified 2026-08-07: `test/prove-red.sh`'s own header states **FIFTEEN mutations**
(line ~20), and `architecture.md` line ~440 (flow written by `0248`) already says "mutation 15" —
§9.1's prose states no mutation count today, so a count only enters §9 if the sweep finds one drifted.
The governing records stand unchanged:
[ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md) (how fkit tests itself)
and
[ADR-026](../../../knowledge-base/decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md)
(prove-red stays hand-rolled) — this task changes no claim either ADR makes.

## What to build

Docs-only refresh of `ai-agents/knowledge-base/architecture.md` §9 — nothing outside that file:

1. **§9.1's suite count and enumeration** — replace "eight `node --test` contract suites" and the
   eight-name list with the count and enumeration derived from `ls test/*.test.js` on the day the
   change is made (19 as of 2026-08-07; re-derive, don't copy this brief).
2. **Sweep the surrounding §9 prose for other drifted counts** — anything numbering suites, mutations
   (prove-red's list, 15 per the script's own header), or coverage that moved with the sprint-4
   additions. Update what is provably stale; leave accurate claims byte-identical.
3. **Keep §9.1's thesis intact** — the section's point is "a suite exists, no CI runs it". The
   inventory refresh must not soften or restate that risk framing.

### ⛔ Out of scope

- ⛔ Any file other than `ai-agents/knowledge-base/architecture.md` — no README, no scaffold, no
  test changes.
- ⛔ Any `ai-agents/wiki-vault/` write (ADR-005 — if a vault page mirrors the stale count, that is
  `fkit-wiki`'s repair; none was found in a 2026-08-07 grep, but the vault was not exhaustively swept).
- ⛔ Any behavior change anywhere — docs only.
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. `ls test/*.test.js | wc -l` equals the count §9.1 states, and every filename in §9.1's enumeration
   exists on disk (and vice versa — no suite on disk is missing from the enumeration).
2. Any mutation count written in §9 equals the mutation list in `test/prove-red.sh` (the script's own
   header and its `--- Mutation N:` blocks are the ground truth).
3. `grep -n "eight" ai-agents/knowledge-base/architecture.md` returns no hit claiming eight test
   suites (the eighth-*role* mentions are unrelated and must survive untouched).
4. `git diff --stat` shows exactly one file changed: `ai-agents/knowledge-base/architecture.md`.
5. `git status --porcelain` shows nothing under `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- Provenance: `0248` open question 2, owner-ruled 2026-08-07 ("File separate task (Recommended)",
  `AskUserQuestion` via the live `fkit lead` driver session).
- Filed to the **Backlog** board — no sprint named; no re-rank (ADR-035).
