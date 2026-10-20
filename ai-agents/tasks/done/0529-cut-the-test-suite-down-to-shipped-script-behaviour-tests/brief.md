# Cut the test suite down to shipped-script behaviour tests

## ID
0529

## Sprint
Sprint 13

## Priority
P4

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**The cut itself** (owner decision and rulings quoted in `0527`'s brief, *Owner rulings*; option D as
put to the owner is quoted there too). Chain: `0526` + `0527` → `0528` / `0529` → `0530`.

> **2026-10-19 — re-scoped to [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) (accepted 2026-10-19).** By owner instruction,
> `fkit lead` session: via `AskUserQuestion`, selected option text, verbatim: *"Stop; re-brief first
> (Recommended)"* — description he saw: *"Run ends now. Next: producer updates 0528–0530 to ADR-057.
> Knock-on: 0528, 0529, 0530 stay Backlog in Sprint 13 until a new run."*; then typed, verbatim:
> *"Commit and then rewrite"*. Relayed verbatim by the lead to a spawned `fkit-producer` (no owner
> channel, ADR-021). *What to build* and *Verification steps* are rewritten to the ADR; every
> owner-ruling quote in this brief is kept as written. Main changes: `dual-home-parity`,
> `task-id-uniqueness` and `structure-manifest` are **kept** (they were listed for deletion);
> `release-summary` is **moved** to its own script, not deleted; prove-red is cut to four named cases,
> each on one file; the movers' link-check wording per D6 (a); the ADR drift notes routed; the banner
> timing-test tension named for the planner; the knock-on table below brought up to date.

**Target:** the default `npm test` takes **≤ 2 min locally on an idle Mac** (owner ruling 2). Option D
expects about 1–1.5 min (inferred, not measured — 2026-10-19 architect consult).

**Where the time goes today** (2026-10-19 lead-session consults: architect / coder / reviewer; slowest
CI run 38904713361, 1310 s): seven whole-suite passes 48% — the unit pass plus `test/prove-red.sh`'s
`run_suite` ×6 (steps 0a, 0b, 2, 15, 30, 31); `run_suite` globs all 42 test files though only 5 read
`FKIT_LAUNCHER`; step 0a exactly duplicates the unit pass. Update-banner group 32%; dashboard 12%;
release 6%.

## What to build

The source of truth is [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) (accepted 2026-10-19) — read it whole, **including its dated
⚠️ / ⛔ notes**: they add a fourth named exception (below §D7), say the four prove-red cases do not yet
run one file each (below §D3), and add two shipped files to §D9. Where this brief and the ADR
disagree, the ADR wins; say so in the plan.

1. **The per-file table is this task's job (ADR-057 §D1).** The plan lists every `test/*.test.js`
   file, `test/prove-red.sh` and each `test/*.mjs` helper with its category (1–5), kept / moved /
   deleted, and the reason — the counts in the ADR are approximate and §D11's categories are the
   architect's reading, not a ruling.
2. **Keep** category 1 (launcher, init, hooks, `claude/skills-for-role.sh`) and category 2 (shipped
   skill executables: `dashboard.sh`, `throughput.mjs`, heal `check.sh` / `repair.sh`) behaviour tests.
3. **Keep the named exceptions in the default suite** (ADR-057 §D7 and its ⛔ R1 note):
   `test/dual-home-parity.test.js` (owner Q4b), `test/task-id-uniqueness.test.js` (owner Q5 (b)),
   `test/structure-manifest.test.js` (owner R1 ruling). **Reword each one's header** that cites "the
   fourth category" as its licence to cite ADR-057 §D7 instead. No other test may cite the fourth
   category; 14 files claim it today (§Context ⚠️ note) — the rest are deleted or, if category 1–2,
   lose that wording.
4. **Move, do not delete, `test/release-summary.test.js`** (owner Q4a (c), §D4): out of the default
   `npm test` glob into its own `package.json` script — move the file or narrow the glob, the
   planner's call. Whether `npm run release` runs it is `0530`'s, not this task's.
5. **Delete** the rest of categories 3–5 per D1: repo-only `bin/` tooling tests (e.g. the four
   `test/board-*.test.js`), the prompt-wording guard tests (category 4), and the `ai-agents/` content
   tests (category 5, e.g. `reference-integrity`, `coordination-citation-policy`,
   `adr-number-uniqueness`, `closed-rank-immutability`, `top-level-doc-links`) — plus helpers and
   fixtures used only by deleted tests.
6. **Prove-red (ADR-057 §D3, owner Q1 (c)):** cut `test/prove-red.sh` to **M1, M2, M30, M31** (today's
   numbering; renumber if you rewrite the file) and delete the other 51. Narrow each kept case to run
   **only its own test file** — M1 → `test/skill-ownership-hook.test.js`; M2, M30, M31 →
   `test/launcher-contract.test.js` (today only M1 does; M2, M30, M31 run the whole glob via
   `run_suite`). Keep the green baselines those four need, narrowed the same way (which ones: the
   planner's call). Take prove-red **out of the default `npm test`**; `npm run test:prove-red` still
   runs it by hand. **The nightly CI schedule is `0530`'s**, not this task's.
7. **Banner tests (ADR-057 §D8, [`0526`'s worklog](../../done/0526-check-prove-red-mutation-48-on-one-isolated-linux-run-before-deciding-the-banner-tests/worklog.md), *Recommendation for the banner tests*):**
   keep them. Mutation 48 is among the 51 deleted cases, so its ~192 s excess goes with it.
   ⚠️ **A tension for the planner, not settled by the ADR:** `0526` recommends keeping the three `0284`
   timing tests, which **sleep for real** (~25 s per run, because `FKIT_NET_TIMEOUT` is hard-coded);
   this brief's earlier text said *"Whatever stays must not sleep for real"*. ADR-057 §D8's rule (*"a
   new timing test must not sleep for real"*) binds **new** tests only. Removing the sleep needs a
   test-only change or a shipped-code change (a timeout override) — each its own owner-approved brief,
   per `0526`. **The planner names this in the plan for the owner.** Producer's recommendation: keep
   the three as they are in this task; propose a speed-up brief only if the measured default suite
   misses the 2-minute budget.
8. **Fix what points at deleted or moved tests** (ADR-057 §D9 rows marked `0529`, plus its ⚠️ R3
   note):
   - `package.json` scripts — `test` (no prove-red, no release-summary), `test:unit`, `test:prove-red`,
     and `test:docs` (most of its files are deleted: redefine or drop it, and say what agents and
     `CONTRIBUTING.md` run instead);
   - `.github/workflows/test.yml` comments (the job's budget and timeout are `0530`'s);
   - `CONTRIBUTING.md`'s layout lines and the *What to run* rows naming deleted tests and prove-red;
   - **the four movers** (`fkit-task-done`, `fkit-task-cancelled`, `fkit-sprint-done`,
     `fkit-sprint-cancelled` under `claude/skills/`), per **D6 (a)**: stop telling the producer to run
     `node --test test/reference-integrity.test.js` and to act on its `NAMED_EXEMPT` keys (20
     references); the producer's own resolve-every-link hand check, which each mover already performs,
     becomes the stated check, and **the close report says plainly that no automated link check
     ran**;
   - `claude/skills/fkit-record-decision/SKILL.md` and `claude/skills/fkit-wiki-lint/SKILL.md` (they
     name `test/adr-number-uniqueness.test.js`); `fkit-stateful-review` / `fkit-process-stateful-review`
     (they name `test/coordination-citation-policy.test.js`); `fkit-review`'s `test/prove-red.sh`
     reference (match the rewrite); `fkit-task-brief` step 6 (stays true — reword only if it cites the
     test's licence);
   - `claude/structure-spec.md` (*"are parsed by `test/structure-spec.test.js`"* — a deleted
     category-4 test: drop or reword). `claude/structure-manifest.tsv`'s header names
     `test/structure-manifest.test.js`, which is **kept** — no change;
   - comments in `claude/carry-check-hook.sh` / `.mjs`, `dashboard.sh`, `throughput.mjs` that the
     prove-red cut makes wrong (code-comment rule); `throughput.mjs`'s prove-red data row is history —
     leave it.
9. **ADR drift notes, at deletion (ADR-057 §D11).** Each ADR that names a test this task deletes (or a
   prove-red case it deletes — ADR-026, -027, -028, -042, -046 per §D11's last row) gets a dated ⚠️ note
   **when the deletion actually lands**, not before; re-run §D11's looser sweep (name without `test/`)
   for each deleted file. **Routing (the producer's call, per §D11):** the notes are written inside this
   task, after the deletions and before its review, **by an `fkit-architect` spawn** in the ADR
   correction form — in a `/fkit-sprint-ship-loop` run the driver spawns it as a worker; in a
   `fkit coder` session the coder asks the owner to run it. The coder lists in `worklog.md` which ADRs
   got a note and which test each covers.
10. **Do not touch** `bin/release.mjs`'s gate, the CI budget or the nightly schedule — that is `0530`.

## Verification steps

1. `worklog.md` holds the per-file table (file, category, kept / moved / deleted, reason) and it
   matches ADR-057 (four named exceptions, three in the default suite and `release-summary` in its own
   script).
2. Default `npm test` passes; state the test count and the **wall time on an idle Mac, three runs**.
   All three ≤ 2 min. Its glob contains neither prove-red nor `test/release-summary.test.js`.
3. The release-summary script passes on its own; state its wall time.
4. Prove-red has exactly four cases; each runs only its own test file (show the command each runs)
   and each is shown red against its mutant; state the lane's own wall time.
5. A `grep` over the repo (outside `done/`, `cancelled/` and the wiki) for each deleted test's filename
   returns no live instruction to run it — paste the output. `grep -il fourth test/*.test.js` finds no
   header citing the fourth category as a licence.
6. Each ADR that names a deleted test or case carries its dated ⚠️ note (list them).
7. `claude/fkit-claude-init.sh .` refreshes the dogfood copies without error.

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
  - **2026-10-19 — the ADR gate is satisfied:** ADR-057 is `accepted` (owner sign-off Q7, quoted in
    its Status line). This brief was then re-scoped to it (see *Context*) before any build.

### Knock-on for other open briefs — a PROPOSAL for the owner, not decided

These exist mainly to add or maintain tests. Nothing is cancelled or changed until the owner rules;
the producer then uses `/fkit-task-cancelled` or a rescope edit.

> **2026-10-19 — owner ruling: this list is decided AFTER the ADR (`0527`) is signed; nothing is
> cancelled now.** Via `AskUserQuestion`, `fkit lead` session, selected option text, verbatim: *"After
> the ADR is signed (Recommended)"* — description he saw: *"The ADR (0527) fixes what stays, so the
> list is decided on facts. Nothing cancelled now."* Relayed verbatim to a spawned `fkit-producer` (no
> owner channel, ADR-021). Every row below stays where it is until then.

> **2026-10-19 — the condition is met: ADR-057 is accepted.** The list is now ready for the owner to
> rule; **nothing is cancelled or rescoped until he does.** Rows updated to the ADR (producer, not an
> owner ruling): `0512` (two of its files are kept), `0522` (superseded by D6 (a)), and the "under the
> cap" notes (no numeric cap, D2.2).

| Task | Today | Proposal |
|---|---|---|
| `0503` re-measure test time, show in CONTRIBUTING | Sprint 12, 🚧 Blocked (paused by the owner) | Cancel — superseded by `0530`, which re-measures after the cut |
| `0512` comment cleanup, repo-content guard tests | Backlog | ~~Cancel — those files are deleted (category 5)~~ **2026-10-19:** rescope to what survives, after `0529` — `dual-home-parity`, `task-id-uniqueness` (and `rules-block-budget`, category 1) are kept under ADR-057; or cancel |
| `0513` comment cleanup, board + dashboard tests | Backlog | Rescope to the surviving dashboard tests, after `0529` |
| `0514` comment cleanup, launcher + hook tests + prove-red | Backlog | Rescope to what survives, after `0529` |
| `0515` comment cleanup, structure / orphan / release tests | Backlog | Rescope to what survives, after `0529` |
| `0522` movers tell consumers to run fkit's link test | Backlog | Cancel — superseded by ADR-057 D6 (a); `0529` step 8 removes that instruction |
| `0037` extend prove-red to init | Backlog | Cancel (prove-red cut) |
| `0214` wire 0210 guards as prove-red mutations | Backlog | Cancel (prove-red cut) |
| `0152` guard test for SKILL.md H1 style | Backlog | Cancel (category 4) |
| `0219` assert the 400 B budget in a test | Backlog | Cancel (category 4) |
| `0156` required Priority field with a guard | Backlog | Rescope: drop the guard, or cancel |
| `0406` no-board-row check in the test suite | Backlog | Cancel or rescope (category 5) |
| `0407` mover-outcome verifier / acceptance test | Backlog | Note: re-read against the new fence before any start |
| `0144` CLI contract tests, team-room rejection | Backlog | Note: category 1, but a new test → needs the owner's OK (ADR-057 D2.1; no numeric cap) |
| `0225` loop row in the skill-ownership test | Backlog | Note: role-lock matrix (key-list item) → owner's OK (ADR-057 D2.1; no numeric cap) |
| `0382` regression test, fresh-tree explicit-role guard | Backlog | Note: category 1 → owner's OK (ADR-057 D2.1; no numeric cap) |
