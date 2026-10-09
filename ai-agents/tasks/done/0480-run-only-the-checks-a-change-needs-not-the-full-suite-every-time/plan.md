# Plan — 0480 Run only the checks a change needs, not the full suite every time

Planned by a spawned `fkit-coder` (Plan step of `fkit-sprint-ship-loop`, Sprint 10), 2026-10-04. Read-only: no repo file was written. Measurements were taken in a scratch copy of the current working tree (0477's uncommitted changes included).

## Summary

- **No CI timeout problem.** The last 11 CI runs (2026-10-02) took 7.4–10.9 min each and all passed. None came near the 20-min limit, so brief step 1's stop condition did not fire.
- **Locally, `npm test` ≈ 12 min.** The unit suite is ~55 s; prove-red is 651 s, nearly all of it.
- **The owner's "20–30 min" (hypothesis, not measured):** one task runs `npm test` 2–3 times: verify, re-verify after each review-fix round, and the reviewer's own evidence run. 2–3 × 12 min = 24–36 min. Machine load from parallel agent sessions makes each run slower.
- **README-only changes: no test reads them at all.** `test/reference-integrity.test.js` scans only `ai-agents/` (`collectFiles`, `:190-191`, and its L7 test). Nothing reads `README.md`, `CONTRIBUTING.md`, `RELEASING.md`, `CHANGELOG.md`, `docs/`, `claude/README.md` or `ai-agents/wiki-vault/`. For the owner's example, the right answer is "run nothing, and say so".
- **What this plan adds:**
  - a "what changed → what to run" table in `CONTRIBUTING.md`;
  - a new `npm run test:docs` (~28 s, against ~55 s for unit and ~12 min for everything);
  - one generic rule in 5 shipped places (4 files).
- **What it does not change:** `npm test`, CI and `release.mjs`. prove-red stays in every gate (ADR-026 Decision 4).
- **Architect consulted (hop 2):** no ADR is needed for this change. CI path filters, if ever wanted, would need a new ADR amending ADR-026 Decision 4.

## 1. Measurements (brief item 1)

Machine:
- Apple M4 Pro, 14 cores, 48 GB, macOS (Darwin 25.2.0), node v24.13.0.
- Run in a scratch copy of the working tree with nothing else writing to that copy.
- The machine itself was **not idle**: load average 4–9 from other sessions. Treat the times as "busy dev machine" figures.

| What | Runs | Wall time | Tests |
|---|---|---|---|
| `npm run test:unit` (`node --test test/*.test.js`) | 2 | 55 s, 56 s | 1017 / 1017 pass |
| `npm run test:prove-red` | 1 | 651 s (✓ hard gate PASSED) | 55 steps |
| prove-red, from 0477's Build worklog (same repo, a writer running, so not quiet) | 2 | 705 s, 732 s | — |
| `npm test` total (unit + prove-red, derived) | — | ≈ 706 s ≈ 12 min | — |
| Candidate `test:docs`, all 10 files that read the live `ai-agents/` tree | 2 | 27.7 s, 27.8 s | 372 |
| Same, without `dashboard-contract` (9 files) | 2 | 19.6 s, 19.5 s | 183 |
| Only the 6 content guards (links, citations, task ids, ADR numbers, closed ranks, dual-home parity) | 2 | 1.7 s, 1.7 s | 147 |
| CI, ubuntu runner, whole job wall time (`gh run list --workflow test.yml`) | 11 runs, 2026-10-02 | 7.4–10.9 min, all success | — |

Per-file timings (serial, one run each):
- Slowest: `launcher-contract` 24.7 s · `dashboard-contract` 21.4 · `board-narrow` 16.9 · `structure-repair` 16.7 · `structure-notice` 14.1 · `release-summary` 11.6 · `orphan-cleanup` 9.3 · `structure-check` 8.6 · `skill-ownership-hook` 8.1 · `converge-contract` 7.2 · `update-banner` 6.4.
- Doc guards: `closed-rank-immutability` 1.6 · `reference-integrity` 0.5 · `task-id-uniqueness` 0.2 · `coordination-citation-policy` 0.2 · `adr-number-uniqueness` 0.1 · `dual-home-parity` 0.1.
- `board-reader` 3.1 and `board-root` 2.9.

Why prove-red dominates: `run_suite` re-runs the **whole** unit suite at steps 0a, 0b, 2, 15, 30 and 31 (≈ 6 × 55 s). The other ~49 steps each run one test file.

**Build step 1:** copy these figures into `worklog.md`. Add a second prove-red figure from the Verify step's full `npm test` run (step 6 below), on a quiet scratch copy, with the machine and load average noted. Re-read `gh run list` once and say whether any run is near 20 min. If one is, **stop and ask the owner** (brief item 1). Otherwise continue.

## 2. The table (for owner approval) — goes in `CONTRIBUTING.md` "Tests"

Rules that come with the table:
- `npm test` is what CI and `npm run release` always run. While working, run what the change needs.
- **A change that spans rows: run the highest row it touches.**
- **Always report which checks ran and which were skipped, and why. A skipped check is not a passed one.**

| What changed | Run | Why |
|---|---|---|
| Only `README.md`, `CONTRIBUTING.md`, `RELEASING.md`, `CHANGELOG.md`, `LICENSE`, `docs/`, `claude/README.md`, `ai-agents/wiki-vault/` | **nothing** — report "no automated check covers these files"; check any links you touched by eye | No test reads them. `reference-integrity` scans `ai-agents/` only, minus the wiki vault. |
| Anything else under `ai-agents/` (briefs, plans, worklogs, review ledgers, sprint boards, knowledge-base, ADRs, conventions) | `npm run test:docs` (~28 s) | Only these tests read the live `ai-agents/` tree: links, citations, task/ADR ids, closed ranks, dual-home parity, the board readers |
| `.md` files under `claude/` (skills, agents, specs) **not named in `test/prove-red.sh`**; `bin/` tools other than `release.mjs` | `npm run test:unit` (~1 min) | Frontmatter, ownership, contract and parity checks read these. No mutation edits them. |
| Any **non-`.md`** file under `claude/` (launcher, init, hooks, `skills-for-role.sh`, `dashboard.sh`, `throughput.mjs`, `structure-manifest.tsv`, `orphan-targets`); anything under `claude/scaffold/`; `bin/release.mjs`; anything under `test/`; `package.json`; `.github/`; **any file `test/prove-red.sh` names** | `npm test` (~12 min) | prove-red mutates these, or they are the test machinery itself |
| A release, or **unsure** | `npm test` | When in doubt, run more. |

How to check whether prove-red names a file:
- Run `grep -F '<path below claude/>' test/prove-red.sh`.
- Today that includes `skills/fkit-team/SKILL.md`, `skills/fkit-sprint-ship-loop/SKILL.md`, `skills/fkit-wiki-sync/SKILL.md`, `skills/fkit-wiki-lint/SKILL.md`, `skills/fkit-task-done/SKILL.md`, `skills/fkit-task-cancelled/SKILL.md`, `skills/fkit-sprint-done/SKILL.md`, `skills/fkit-sprint-cancelled/SKILL.md`, `structure-spec.md`, and the `claude/scaffold` tree.
- The grep is the rule. The list is only an example and will drift.

Two related notes:
- A `claude/scaffold/` change also needs `npm run generate:manifest`. That line already exists in `CONTRIBUTING.md`.
- A new test that reads the live `ai-agents/` tree must also be added to `test:docs`.

## 3. Steps

**Step 1 — Measure.** See §1 above.

**Step 2 — `package.json`: add `test:docs`.**
- Insert one line directly after `"test:prove-red"`:
  `"test:docs": "node --test test/adr-number-uniqueness.test.js test/board-narrow.test.js test/board-reader.test.js test/board-root.test.js test/closed-rank-immutability.test.js test/coordination-citation-policy.test.js test/dashboard-contract.test.js test/dual-home-parity.test.js test/reference-integrity.test.js test/task-id-uniqueness.test.js",`
- The rule for what goes in: every test file that reads the live `ai-agents/` tree. That is what OQ2 asks the owner to confirm.
- Keep the file's 2-space JSON layout. `bin/release.mjs:280` rewrites it with `JSON.stringify(pkg, null, 2)`, so a release bump must produce no other diff.
- Inserting after line 7 keeps `"test"` on line 5, so the `package.json:5` cite in `RELEASING.md:130` stays correct.
- `test`, `test:unit` and `test:prove-red` stay unchanged. Nothing in `claude/` changes (repo-local only).

**Step 3 — `CONTRIBUTING.md` "Tests":**
- Add `npm run test:docs` to the command block, with a one-line comment.
- Fix the stale `~6 min` to the measured figure: `npm test` ~12 min, unit ~1 min, prove-red ~11 min, docs ~30 s. Say the figures are machine-dependent.
- Add a `### What to run for a change` subsection with the §2 table, the mixed-change rule, the report rule and the `grep -F` check.
- Keep 0477's "On a red …" line.
- This is the repo-local home the shipped rule points to. Do not put it under `ai-agents/knowledge-base/conventions/`: that would make it a two-home file, tripping `dual-home-parity` or shipping fkit's paths to consuming projects (architect).

**Step 4 — The generic rule in shipped procedures.** Each site gets wording that **stands on its own**. A "see `fkit-coder.md`" pointer would not work: the reviewer never loads `fkit-coder.md` (architect 3b). Not in the shared rules block. Edit lines in place, below every line-number cite into these files (see Risks).

Full form, in `claude/agents/fkit-coder.md:190-192` (the "Test your changes" bullet, rewritten in place):
> - **Test your changes — run the checks the change needs.** Follow the project's testing conventions; add or update tests for the behavior you changed. Then map the changed paths to the project's checks — use the project's own "what changed → what to run" table if it has one (e.g. in its `CONTRIBUTING.md`) — and run those, plus the linter/build where applicable. Run the full suite before a release, when you change the tests or test tooling themselves, and whenever you are unsure which checks apply: when in doubt, run more. Report which checks ran and which you skipped, and why — a skipped check is not a passed one. If you can't run them, say so explicitly.

One-sentence form (S), used at the other sites:
> Run the checks this change needs: map the changed paths to the project's checks (its own "what changed → what to run" table if it has one, e.g. in `CONTRIBUTING.md`), and run the full suite at release, when the tests or test tooling change, or when unsure; name which checks ran and which were skipped, and why — a skipped check is not a passed one.

Where each form goes:
- `claude/skills/fkit-plan-task/SKILL.md:62`:
  - `- testing and validation steps` becomes `- testing and validation steps — the checks this change needs, by name:` followed by S, adapted to "the plan names which checks it will run and which it will skip, and why".
- `claude/skills/fkit-task-ship-loop/SKILL.md:147` (step 5):
  - `Test per project conventions (ADR-014: \`node --test\`, zero devDeps for this repo),` is replaced with S. The rest of the step stays: sub-agents, budget, STOP.
  - **`:257`** (evidence packet): `commands + pass/fail` becomes `commands + pass/fail, and which checks were skipped and why`.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md:132` (Verify row):
  - `run tests per [ADR-014](../../../ai-agents/…adr-014…) (\`node --test\`, zero devDeps); return pass/fail + diagnosis` becomes S, then `return pass/fail + which checks ran and which were skipped (why) + diagnosis`.
- `claude/skills/fkit-review/SKILL.md:119-120`:
  - After "**run the relevant check yourself**", add: "— the checks the change needs (map the diff's changed paths to the project's checks — its own table if it has one; the full suite when unsure), named in your evidence clause, skipped ones included".
  - A targeted check still counts as "executed something", so ADR-042's coverage states are unchanged (architect).

The ADR-014 removal at the two ship-loop sites is deliberate:
- Both lines cite ADR-014, which exists only in fkit. The Verify-row link is broken in every consuming project, because `claude/scaffold/` has no `decisions/`.
- fkit's own detail moves to `CONTRIBUTING.md`. ADR-014 itself is untouched.

Deliberately **not** edited:
- `fkit-stateful-review`: it defers to `fkit-review` §Coverage states (`fkit-stateful-review/SKILL.md:112`), so it gets the rule through that.
- `fkit-process-review:141` and `fkit-process-stateful-review:212`: these coder-owned skills only run under the `fkit-coder` agent, whose system prompt carries the full rule. Leaving `process-stateful-review` alone also keeps the word-for-word paraphrase of its Step 6 at `fkit-sprint-ship-loop/SKILL.md:134` accurate.
- `fkit-adversarial-review`: it gives no suite instruction.
- `fkit-lead`: it runs no tests.
- `CLAUDE.md` and `claude/scaffold/universal-rules.md` (the rules block).

**Step 5 — Refresh `.claude/`.** Run `claude/fkit-claude-init.sh .`. Then `diff` each edited `claude/…` file against its `.claude/…` copy; they should match.

**Step 6 — Verify.** See Verification.

**Step 7 — ADR: none.**
- The architect (hop 2) ruled that this change needs no ADR and no amendment to ADR-014 or ADR-026.
- `npm test`, CI and `release.mjs` are unchanged, and the rule is cheap to undo.
- Its record is this plan plus the `CONTRIBUTING.md` table.

## 4. Verification (brief's steps, mapped)

1. `worklog.md` has the §1 figures: per part, per run, machine and load noted.
2. The rule is present at each site:
   - `grep -n "a skipped check is not a passed one"` hits `claude/agents/fkit-coder.md`, `claude/skills/fkit-plan-task/SKILL.md`, `claude/skills/fkit-task-ship-loop/SKILL.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md` and `CONTRIBUTING.md`.
   - `grep -n "the checks the change needs"` hits `claude/skills/fkit-review/SKILL.md`.
   - `git diff --quiet -- CLAUDE.md claude/scaffold/universal-rules.md` exits 0, and `test/rules-block-budget.test.js` is green.
3. `test:docs`:
   - Time it 2× next to unit 2×, and state all four numbers.
   - In a **scratch copy**, add a link to a missing file in a doc under `ai-agents/knowledge-base/`. `npm run test:docs` must go red (`L2 live corpus: BROKEN is 0`). Revert it, and the run must be green again.
4. `git diff --stat -- .github/workflows/test.yml bin/release.mjs` is empty. `git diff package.json` shows only the added `test:docs` line; the `test` script is unchanged.
5. Apply the new table to this change itself:
   - It touches `claude/skills/fkit-sprint-ship-loop/SKILL.md`, which prove-red names (mutation 9's frontmatter target), and `package.json`. So the table says the **full `npm test`**, plus `npm run test:docs` timed as in 4.3.
   - Run in a scratch copy of the working tree (quiet tree, as in 0477's OQ3).
   - Changed files contain no absolute machine path: `grep -nE '/Users/|/private/tmp|/home/'` on them finds nothing.
6. Line cites still land on the same text, checked by grep and by eye:
   - `fkit-task-ship-loop/SKILL.md:90` → `fkit-coder.md:28-33`
   - `fkit-task-ship-loop/SKILL.md:160` → `fkit-coder.md:109-113`
   - `fkit-sprint-ship-loop/SKILL.md:41` → `fkit-task-ship-loop/SKILL.md:8-18`
7. The `.claude/` copies match their `claude/` sources (Step 5).

## 5. Risks and edge cases

- **Wrong row chosen → a skipped check misses a regression.**
  - CI and release still run `npm test`. But `main` is the release channel, so a regression can be live between the push and CI's red result.
  - Mitigations: the table is conservative (every non-`.md` under `claude/` → full); "when unsure → full"; and the report must state what was skipped.
  - Accepted residual.
- **`test:docs` list drift.** A future test that reads the live tree but is left out of `test:docs` is caught late (CI or release), not lost. `CONTRIBUTING.md` says to add it. There is no guard test, because a heuristic "reads the live tree" detector would be brittle. Accepted residual.
- **The rule exists in 5 shipped places, and no test checks that they match** (architect). Accepted drift risk. The wording shares one fixed phrase so a grep finds every copy.
- **`test:docs` reads the live tree**, so it shares 0477's R-a flake class and 0483's board-reader race when run while agents write. Run it on a quiet tree.
- **Line-number cites:**
  - All edits sit below every line cite into those files from `claude/`: `fkit-coder.md:28-33` and `:109-113` (edit at ~190); `fkit-task-ship-loop/SKILL.md:8-18` (edits at 147 and 257).
  - Cites inside ADRs into these files are historical and some are already stale. They are not touched.
- **Prove-red mutation 9** de-indents a frontmatter continuation line in `fkit-sprint-ship-loop/SKILL.md`. The edit is in the body (`:132`), so the mutation's anchor is untouched. The full `npm test` proves this.
  - ⚠️ The architect said that no mutation targets the edited files. **That is wrong for this one file**: `grep -F 'skills/fkit-sprint-ship-loop/SKILL.md' test/prove-red.sh` finds 1 hit (`$m9_tree`). It is right for the others.
- **Wording in a consuming project:** the shipped text says "if it has one" and "e.g. `CONTRIBUTING.md`". A project without a table falls back to "the full suite when unsure".

## 6. Out of scope — reported, not fixed

- `.github/workflows/test.yml`'s stale timeout comment ("15 mutants", "~3x headroom"): task **0395** owns it.
- Other stale "~6 min" / "6–8 minutes" claims: `bin/release.mjs:71,241` (release.mjs must not change, per the brief) and `RELEASING.md:127`. Candidates for 0472-style tidy-up or 0395.
- Found by the architect:
  - `fkit-sprint-ship-loop/SKILL.md:134` cites `fkit-process-stateful-review/SKILL.md:195` and `:85`; both are already stale.
  - ADR-026 still says "No `.github/workflows/` exists" (`:104-105`, `:131`).
  - Both are tidy-up items.
- No link check covers the root docs (OQ3).

## 7. Files touched (expected)

- `package.json` (+1 line)
- `CONTRIBUTING.md` (Tests section)
- `claude/agents/fkit-coder.md`
- `claude/skills/fkit-plan-task/SKILL.md`
- `claude/skills/fkit-task-ship-loop/SKILL.md` (2 spots)
- `claude/skills/fkit-sprint-ship-loop/SKILL.md`
- `claude/skills/fkit-review/SKILL.md`
- `.claude/` copies (gitignored, refreshed)
- `worklog.md`

Nothing under `test/`, `bin/`, `.github/`, `claude/scaffold/` or `ai-agents/wiki-vault/`. No commit.

## 8. Owner rulings (filled in at the plan gate)

- OQ1 — CI path filters on docs-only pushes:
- OQ2 — what `test:docs` contains:
- OQ3 — a link check for the root docs:
