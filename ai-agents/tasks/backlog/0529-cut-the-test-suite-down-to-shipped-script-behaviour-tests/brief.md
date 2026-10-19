# Cut the test suite down to shipped-script behaviour tests

## ID
0529

## Sprint
Sprint 13

## Priority
P4

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**The cut itself** (owner decision and rulings quoted in `0527`'s brief, *Owner rulings*; option D as
put to the owner is quoted there too). Chain: `0526` + `0527` → `0528` / `0529` → `0530`.

**Target:** the default `npm test` takes **≤ 2 min locally on an idle Mac** (owner ruling 2). Option D
expects about 1–1.5 min (inferred, not measured — 2026-10-19 architect consult).

**Where the time goes today** (2026-10-19 lead-session consults: architect / coder / reviewer; slowest
CI run 38904713361, 1310 s): seven whole-suite passes 48% — the unit pass plus `test/prove-red.sh`'s
`run_suite` ×6 (steps 0a, 0b, 2, 15, 30, 31); `run_suite` globs all 42 test files though only 5 read
`FKIT_LAUNCHER`; step 0a exactly duplicates the unit pass. Update-banner group 32%; dashboard 12%;
release 6%.

## What to build

Do exactly what the signed-off `0527` ADR says. In outline:

1. **Keep** category 1 (launcher, init, hooks) and category 2 (shipped skill executables:
   `dashboard.sh`, `throughput.mjs`, heal `check.sh` / `repair.sh`) behaviour tests.
2. **Delete** category 3 (repo-only `bin/` tooling tests — e.g. `test/release-summary.test.js` and the
   four `test/board-*.test.js`), category 4 (the ~9 prompt-wording guard tests) and category 5 (the ~9
   `ai-agents/` content tests — e.g. `task-id-uniqueness`, `reference-integrity`,
   `coordination-citation-policy`, `adr-number-uniqueness`, `closed-rank-immutability`,
   `top-level-doc-links`, `dual-home-parity`) — **except what the owner keeps** under `0527`'s
   must-keep question. The plan lists every one of the 42 files with its category and keep/delete —
   the counts above are approximate.
3. **Prove-red:** per the owner's answer in `0527` — delete it, or move ≤ 5 crown-jewel cases into a
   lane outside the default `npm test`, running only the test files each case needs (never the whole
   glob).
4. **Banner tests:** per `0526`'s finding. Whatever stays must not sleep for real.
5. **Fix what points at deleted tests:** `package.json` scripts (`test`, `test:docs`,
   `test:prove-red`); `.github/workflows/test.yml` comments; `CONTRIBUTING.md`'s layout lines; and the
   four movers (`fkit-task-done`, `fkit-task-cancelled`, `fkit-sprint-done`, `fkit-sprint-cancelled`
   under `claude/skills/`), which tell agents to run `test/reference-integrity.test.js` — replace with
   what the ADR says (e.g. the producer's own resolve-every-link check). Also `test/harness.mjs` and
   fixtures used only by deleted tests.
6. **Do not touch** `bin/release.mjs`'s gate — that is `0530`.

## Verification steps

1. `worklog.md` holds the per-file table (file, category, kept/deleted, reason) and it matches the
   ADR.
2. Default `npm test` passes; state the test count and the **wall time on an idle Mac, three runs**.
   All three ≤ 2 min.
3. A `grep` over the repo (outside `done/`, `cancelled/` and the wiki) for each deleted test's filename
   returns no live instruction to run it — paste the output.
4. If prove-red is kept: it runs outside the default `npm test`, has ≤ 5 cases, each shown red against
   its mutant; state its own wall time.
5. `claude/fkit-claude-init.sh .` refreshes the dogfood copies without error.

## Notes

- **Depends on:** 0527, 0526
- **Blocks:** 0530
- ⚠️ `0526` gates only the banner-test part; the rest may proceed once `0527` is signed off — the
  plan may split it if that helps.
- ⛔ **Do not start without the owner's specific word.** Being pullable is not his word.
  - **2026-10-19 — the owner's specific word is given.** Via `AskUserQuestion`, `fkit lead` session,
    selected option text, verbatim: *"New Sprint 13, start now (Recommended)"* — description he saw:
    *"Sprint 13 holds only 0526–0530; starting it is your word for all five. Sprint 12 stays paused.
    Knock-on: none."* Relayed verbatim to a spawned `fkit-producer` (no owner channel, ADR-021). The
    line above is kept as the record; it is now satisfied.
    ⚠️ This is the word to start, not a waiver of the ADR gate: the work still waits for `0527`'s
    owner sign-off.

### Knock-on for other open briefs — a PROPOSAL for the owner, not decided

These exist mainly to add or maintain tests. Nothing is cancelled or changed until the owner rules;
the producer then uses `/fkit-task-cancelled` or a rescope edit.

> **2026-10-19 — owner ruling: this list is decided AFTER the ADR (`0527`) is signed; nothing is
> cancelled now.** Via `AskUserQuestion`, `fkit lead` session, selected option text, verbatim: *"After
> the ADR is signed (Recommended)"* — description he saw: *"The ADR (0527) fixes what stays, so the
> list is decided on facts. Nothing cancelled now."* Relayed verbatim to a spawned `fkit-producer` (no
> owner channel, ADR-021). Every row below stays where it is until then.

| Task | Today | Proposal |
|---|---|---|
| `0503` re-measure test time, show in CONTRIBUTING | Sprint 12, 🚧 Blocked (paused by the owner) | Cancel — superseded by `0530`, which re-measures after the cut |
| `0512` comment cleanup, repo-content guard tests | Backlog | Cancel — those files are deleted (category 5) |
| `0513` comment cleanup, board + dashboard tests | Backlog | Rescope to the surviving dashboard tests, after `0529` |
| `0514` comment cleanup, launcher + hook tests + prove-red | Backlog | Rescope to what survives, after `0529` |
| `0515` comment cleanup, structure / orphan / release tests | Backlog | Rescope to what survives, after `0529` |
| `0522` movers tell consumers to run fkit's link test | Backlog | Cancel — `0529` step 5 removes that instruction |
| `0037` extend prove-red to init | Backlog | Cancel (prove-red cut) |
| `0214` wire 0210 guards as prove-red mutations | Backlog | Cancel (prove-red cut) |
| `0152` guard test for SKILL.md H1 style | Backlog | Cancel (category 4) |
| `0219` assert the 400 B budget in a test | Backlog | Cancel (category 4) |
| `0156` required Priority field with a guard | Backlog | Rescope: drop the guard, or cancel |
| `0406` no-board-row check in the test suite | Backlog | Cancel or rescope (category 5) |
| `0407` mover-outcome verifier / acceptance test | Backlog | Note: re-read against the new fence before any start |
| `0144` CLI contract tests, team-room rejection | Backlog | Note: category 1, but a new test → needs the owner's OK under the cap |
| `0225` loop row in the skill-ownership test | Backlog | Note: role-lock matrix (must-keep area) → owner's OK under the cap |
| `0382` regression test, fresh-tree explicit-role guard | Backlog | Note: category 1 → owner's OK under the cap |
