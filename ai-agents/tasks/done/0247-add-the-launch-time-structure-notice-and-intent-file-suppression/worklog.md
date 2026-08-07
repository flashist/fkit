# Worklog — 0247: launch-time structure notice + per-path intent-file suppression

Build executed 2026-08-07 by a spawned fkit-coder under `/fkit-sprint-ship-loop`'s declared-approval
marker (plan approved by the owner via `AskUserQuestion` in the live lead session, 2026-08-07;
plan blob verified `a24d9234b7f7c7478e1ddf4895eeed3dbb78a27b` before any read of the plan was
acted on). Plan: `plan.md` in this folder (driver-written).

## What was built

| File | Change |
|---|---|
| `claude/fkit-claude.sh` | `structure_notice()` + one guarded call site (`structure_notice || :`), placed after the setup warning blocks and before the `FKIT_SETUP_ONLY` exit; full contract comment block (reuse-check.sh rationale, row keying, no-memory/no-kill-switch, intent-file semantics incl. the inverted failure direction) |
| `claude/skills/fkit-heal/SKILL.md` | new section "The launch-time notice and `ai-agents/.fkit-accepted-drift`" — notice shape, intent-file semantics, owned consequence, inverted failure direction, and that the on-demand check never suppresses |
| `test/structure-notice.test.js` | NEW — 12 cases: conforming silence; drifted one-line/stderr-only/zero-write sweep (the prove-red target, named `0247/drifted`); fixed-drift silence + no-state-file full-tree snapshot; per-path + subtree intent scope; symlinked `ai-agents/` (notice prints, intent NOT read through the link); share exit-2 → silence; fail-closed keep-out → silence (row keying proven); symlinked/directory/unreadable intent file → nothing suppressed; kept-out never notices; +N-more arithmetic |
| `test/prove-red.sh` | mutation 15 (remove the `structure_notice` call → `0247/drifted` reds by name); index line 14→15 ("FIFTEEN"); `make_claude_copy` restructured to a layout-faithful nest (see decision log D2) |
| `test/dual-home-parity-exceptions.mjs` | new `live-only` exception for `.fkit-accepted-drift` (see decision log D1) |
| `ai-agents/.fkit-accepted-drift` | NEW (Q3 ruling "Seed it") — seeded with this repo's live drift list, commented (see decision log D3) |

`check.sh`, `repair.sh`, `fkit-claude-init.sh`: **zero diff** (verified via `git diff | wc -l` = 0).

## Verification evidence (plan §5/§6)

- **Unit suite:** `npm run test:unit` — **680/680 pass** (12 of them the new notice suite), 2026-08-07.
- **Prove-red:** `bash test/prove-red.sh` — **hard gate PASSED** (exit 0), 2026-08-07: baseline and
  all nine unmutated-copy steps green (0b green proves the D2 nest carries the notice suite), all
  15 mutations red at their NAMED assertions — mutation 15 red at `0247/drifted`.
- **Byte-identical conforming launch:** HEAD launcher vs changed launcher, same conforming fixture,
  `FKIT_SETUP_ONLY=1 FKIT_NO_UPDATE_CHECK=1` — stdout and stderr **byte-identical** (`cmp` clean both).
- **Zero writes:** write-action grep over the launcher diff — no `>`/`>>` into `$proj`, no
  mkdir/cp/mv/rm/touch in the notice pass (only `/dev/null` redirects, an awk `getline` **read** of
  the intent file, and the stderr print). Zero-mutation full-tree snapshots also asserted in tests.
- **Seeded repo launches silent:** `FKIT_SETUP_ONLY=1` launch of this repo after seeding — rc 0,
  empty stderr, empty stdout.
- **Cost — OVER BUDGET, surfaced, not silently accepted:** marginal notice cost on this repo's
  fixture ≈ **330ms** (setup-only launch 0.36s → 0.69s; `check.sh` alone 0.34–0.40s across runs).
  Plan §0/§6 heuristic: ≤ ~250ms, "a blowout stops and surfaces rather than silently degrading."
  ~30% over → returned as NEEDS-DECISION to the owner via the driver. No optimization was attempted:
  the dominant cost is `check.sh`'s subprocess fan-out and check.sh is zero-edit by plan and by the
  spawn's hard rules.

## Decision log (ADR-019 audit obligation — fixes/calls made without asking)

- **D1 — `test/dual-home-parity-exceptions.mjs`: added a `live-only` exception for
  `.fkit-accepted-drift`.** Not in the plan's files-changed table. Qualifies: mechanical/localized,
  and in-plan by necessity — plan step 5 requires `npm test` green and step 7 requires the seeded
  intent file; without the exception the parity suite's "present in BOTH homes" assertion reds on
  the new live-only file. The alternative (shipping an intent file to the scaffold) would
  pre-suppress notices in every consuming project — the global mute Q3 forbade — so the exception
  is the only direction consistent with the ruling. Reason string in the entry says exactly this.
- **D2 — `test/prove-red.sh`: `make_claude_copy` restructured from `$work/$1` (flat) to
  `$work/$1/claude` (nested) with a per-copy `package.json` marker.** Beyond the plan's "one new
  launcher mutation + index line", recorded here for findability. Qualifies: obvious winner within
  the plan's intent — plan step 4 requires mutation 15 to red the named assertion, and under the
  flat layout every copied launcher's share (`$work`) lacks a `claude/` dir, so `check.sh` exits 2,
  the notice self-silences, and step 0b (unmutated copy green) would red on the drifted case —
  red-via-layout, proving nothing. `make_repo_copy` (mutation 14) already nests for the same
  reason. Verified: all `dirname`-based consumers (mutations 1,3–7; steps 0c–0g) resolve correctly
  under the nest; prove-red run green end-to-end (envelope evidence).
- **D3 — seed list: 9 paths from the live check.sh run, not the plan's "7 conventions files +
  CLAUDE.md/AGENTS.md" estimate.** The live run (2026-08-07, `--share . .`) reports 9 owner-edited
  rows: CLAUDE.md, AGENTS.md, ai-agents/README.md, and **6** conventions files plus the conventions
  README. Plan step 7's own wording makes the live run the authority ("as verified by a live
  check.sh run"), so this is compliance, not deviation — recorded because the counts differ.
  Not listed (they conform today): `priority-is-rank-not-identity.md`, `task-owner-vocabulary.md`.
- **D4 — cost over budget: NOT accepted unattended.** Surfaced as NEEDS-DECISION per plan §0/§6's
  explicit stop-and-surface instruction. No other fix was applied without asking beyond D1/D2;
  no other obvious-winner call was made.

## Review round 1 (2026-08-07, processed by a spawned fkit-coder under the same declared-approval marker)

Findings R1 (medium) + R2 (low) — both verified CORRECT, both fixed under the owner's explicit
ruling **"Fix both now"** (AskUserQuestion, live lead session, 2026-08-07), so neither was an
unattended fix. Changes: `claude/fkit-claude.sh` (awk filter under `LC_ALL=C` + stderr discarded;
filter failure retries with `have=0` — drops suppression, never the notice; `sub(/\r$/)` →
`gsub(/\r/)`; comment block updated to match both), `test/structure-notice.test.js` (+2 red-first
probes, R1/R2 by name). Evidence: notice suite 14/14; unit 682/682; prove-red hard gate PASSED
(re-run — the launcher is the mutation surface for mutations 14/15; mutation 15's target line is
byte-unchanged); write-action grep over the diff clean. Full detail in `review.md` Coder response.

- **D5 — prove-red re-run beyond the spawn's "not expected".** The spawn conditioned a prove-red
  re-run on touching the mutation surface; the launcher IS that surface (mutations 14/15 sed a copy
  of it), so the re-run was obligatory by the spawn's own condition, not extra scope. Recorded
  because the spawn's parenthetical predicted otherwise. Result green; no fix applied from it.
- **D6 — R1's failure-path shape: retry-unsuppressed then give up.** The ruling fixed the direction
  ("failure drops suppression, not the notice"); the mechanism (re-run the same awk program with
  `have=0`, `sn_line=""` only if that also fails) is the minimal in-plan realization — the program
  is stored once in `sn_prog`, no duplication. The double-failure branch is code-inspected, not
  test-forced (stubbing awk would break check.sh in the same fixture); stated in the ledger.
- No other fix applied without asking this round; no other obvious-winner call. **Otherwise: none.**
