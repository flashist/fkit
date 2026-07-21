# Worklog — Migrate every task into a folder, update the tooling (task 76)

**Task ID:** 0062 · **Sprint 2**, priority 76 · **Owner:** fkit-coder
**Plan:** `ai-agents/plans/migrate-tasks-to-folder-structure-and-update-tooling.md` (approved 2026-07-21)

## Owner-decision log
- **2026-07-21 — plan approved, atomic** (not split). The two new drift kinds ship with the migration.
- **2026-07-21 — rollback point authorized to coder.** Owner explicitly authorized me to make the clean
  baseline commit + `git tag pre-task-folder-migration` (overrides never-commit-unprompted for that one
  commit only). The migration itself stays in the working tree for review; owner makes the final commit.

## Progress

### Pre-flight — rollback point ✓
- Branch: `migration/task-folder-structure` (branched off `main`@`4c2219c` per project git convention).
- Baseline commit: `29c5b3c` — contains only pre-migration artifacts (77 baseline, 76 plan/worklog,
  In-progress flip). Tree clean at tag time.
- Tag: `pre-task-folder-migration`. Rollback = `git reset --hard pre-task-folder-migration` (+ `git
  clean` for untracked). Window closes when 77/78 land.

### Phase A — migration ✓ (working tree, uncommitted)
- Dry-run first: 101 briefs + 55 artifacts + 2 sprint-keyed + 3 special; **0 orphans, 0 anomalies,
  101 unique IDs (0001–0101)**. Reconciled counts (15 plans + 16 worklogs + 24 reviews = 55).
- Executed via `git mv`: **158 renames** (101 briefs→`<board>/<ID>-<slug>/brief.md`, 55
  artifacts→`plan.md`/`worklog.md`/`review.md`, 2 sprint-keyed→`sprints/reviews/`). git records all as
  renames. `plans/` + `worklogs/` dirs removed (empty). `reviews/` retains only README (held).
- Verify: 0 flat briefs remain, 101 folders, folder absorption correct. `git log --follow` is a
  POST-commit check (rename uncommitted) — the `R` status is the live proof of `git mv`.

### Phase B — dashboard.sh ✓ (VERIFIED zero-drift on real tree)
- Four coordinated fixes (canonical `claude/skills/fkit-status/dashboard.sh`):
  1. `found_dir` = the BOARD (brief.md's GRANDPARENT), not the folder — else all location cross-checks invert.
  2. link-rot recovery keys on the FOLDER name (brief.md is a shared basename, no identity).
  3. `tid` fallback = folder name, not `fname` (which is now `brief.md` for every task → would collapse
     all unnumbered rows to one id).
  4. NEW drift kinds: `id-mismatch` (brief `## ID` ≠ folder prefix; folder authoritative; no auto-correct)
     and `malformed-folder` (folder without `brief.md`).
- `bash -n` clean. **Ran `.claude/.../dashboard.sh sprint-2.md`: exit 0, `⟦fkit-dashboard v1⟧`, ZERO
  drift across all 101 folders, roll-up `73 done · 2 in progress · 5 backlog · 5 cancelled — of 85`**
  (the +1 in-progress is task 76's own flip). This is the migration's own correctness check — PASSED.
- ⚠️ Trap hit & resolved: first test ran the STALE `.claude/` copy (gitignored, regenerated from
  `claude/` by init) → false drift. Refreshed via `bash claude/fkit-claude-init.sh .` (7 agents + 24
  skills). Canonical code was correct throughout.

### Phase E — sprint hrefs ✓
- 107 hrefs repointed across `sprints/sprint-2.md` + 2 others; 0 unmatched, 0 stale-board.

### Architect consult — scaffold README conflict (RESOLVED)
- Spec §5.2b/§5.3 say `reviews/README.md` content → `tasks/README.md` **both homes**; brief step-H says
  scaffold `tasks/` byte-identical. Architect ruled **option (i)**: create
  `scaffold/.../tasks/README.md` byte-identical to live; step-H is over-broad vs its intent (board-dirs
  + `.gitkeep`s unchanged, which stays true). Three concordant authorities (ADR-027 dual-home parity,
  spec §5.2b/§5.3, brief line 90-91). Not an escalation.
- **OPEN Q (surface to owner, non-blocking):** (1) brief internal inconsistency line 90-91 vs 98/H —
  producer wording fix. (2) exact surviving text of `tasks/README.md` — I'll implement the folder-keyed
  ledger rule (spec §5.3 rules 1-4); owner may confirm.
- Architect also flagged: TOP-LEVEL READMEs (`scaffold/ai-agents/README.md` + live twin) need their
  `reviews/` row rewritten too — separate dual-home edit.

### Phase G — tests ✓ (FULL SUITE GREEN)
- `dashboard-contract.test.js`: shared `foldBriefsAndPlan()` helper folds briefs into
  `<board>/<ID>-<slug>/brief.md`, injects `## ID`, folder-izes plan hrefs (regex-escaped slugs). Used
  by both `fixture()` and `backlogFixture()`. Updated the exact-stdout / relocated / missing / task-68
  expectations to the folder shape and FACTS-id-fallback (now folder name, `\d{4}-<slug>` patterns).
- **2 NEW red-proved contract tests added** (spec §10): `id-mismatch` (brief `## ID` ≠ folder prefix →
  drift naming both; correcting the ID clears it) and `malformed-folder` (folder without `brief.md` →
  drift; adding `brief.md` clears; `brief.md`+`plan.md` is NOT drift). Both self-red-prove.
- `converge-contract.test.js` — **passes unmodified** (as required). `task-id-uniqueness` guard finds
  all **101** folder briefs (non-zero, asserted) and holds uniqueness. `harness.mjs`/`prove-red.sh`
  needed no change.
- **`node --test test/*.test.js` → 448/448 pass. `bash test/prove-red.sh` → hard gate PASSED.**
  (`npm test` runs both serially and exceeds the 2-min tool cap; ran the two halves separately.)

### Phase F — READMEs ✓
- `reviews/README.md` → `tasks/README.md` via `git mv` in **both** homes (live + scaffold),
  byte-identical; rewrote for the folder layout + **folder-keyed ledger rule** (spec §5.3 rules 1–4,
  branch reviews → `sprints/reviews/`). `reviews/` dir removed from both homes.
- Top-level `ai-agents/README.md` + `claude/scaffold/ai-agents/README.md`: `tasks/` row → folder
  structure; `reviews/` row dropped (folder gone; ledger docs now in `tasks/README.md`).

### Phase D — tooling prose ✓
- Executable-critical path/parse updates done: both movers (`task-done`/`task-cancelled` → move a
  FOLDER; sweep keys on folder name; dissolved-dir hit rule rewritten), both stateful-review skills +
  `fkit-reviewer.md` + `claude/README.md` (ledger → `<folder>/review.md`; folder-keyed key rule;
  reviewer write-scope = task-folder `review.md` / `sprints/reviews/`), `fkit-task-brief` (create
  folder + `## ID` carrier; board href), `fkit-wiki-ingest`/`sync` (enumerate `tasks/**/brief.md`,
  skip in-folder plan/worklog/review), `fkit-task-ship-loop` (durable artifacts now in-folder, move
  with the task), `fkit-coder.md`/`fkit-team` ledger refs, example arg paths → folder shape.
- Swept `claude/` for dissolved-dir refs (`reviews/`/`plans/`/`worklogs/`): **0 remain** (only
  `sprints/reviews/`).
- `.claude/` copies re-refreshed. Re-verified: dashboard exit 0 / 0 drift; **448/448 tests still pass**.

### Phase 6 — stateful review
**Round 1 — complete.** Reviewer ran own pass + **Codex full coverage** (`codex-cli 0.144.4`). Verdict:
changes requested, 5 low/med prose defects + 1 latent robustness; **migration data integrity clean**
(independently verified: 0 orphans, 0 mis-keys, 0 dup IDs, 0 id/folder mismatches). 6 findings:
- **R1–R5 (all CORRECT defects) fixed autonomously** (mechanical, in-plan): R1 repointed 2 `reviews/`
  links in sprint-2 (→ all 171 sprint links resolve, 0 broken); R2 the missed step-6 dependency grep in
  `fkit-task-cancelled` (one-of-N: step 4 fixed, step 6 wasn't); R3 mover bare-name intake; R4 mover
  report "Moved" path; R5 ship-loop close-out heading.
- **R6 + Codex #3/#4 → owner-dispositioned** (judgment calls, stopped for owner):
  - **R6** (malformed-folder guard) → **harden**: added `[ ! -f "$folder_dir/brief.md" ]` to both branches.
  - **Codex #4** (missing `## ID`) → **add symmetry**: new `brief-missing-id` drift kind + red-proved test.
  - **Codex #3** (whole-tree orphan lint) → **accept**, recorded as an accepted residual.
- **Re-verified:** 449/449 tests (+1 brief-missing-id), prove-red gate PASSED, dashboard 0 drift,
  `bash -n` clean, all 171 sprint links resolve.

**Round 2 — CONVERGED. Ledger closed-out; reviewer recommends merge.** All six round-1 findings
verified fixed against the code (not merely trusted), dispositions recorded, **no round-2 findings, no
regressions**, full Codex coverage (no degradation flag). Gates re-run by the reviewer on this tree:
449/449, prove-red PASSED, dashboard exit 0 / zero drift, `bash -n` clean.

---

## Close-out evidence packet

- **Task:** `ai-agents/tasks/done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md`.
- **Problems encountered:** (1) the "one-of-N" pattern recurred — I fixed `fkit-task-cancelled` step-4's
  grep but missed step-6's dependency sweep (reviewer R2, medium); the enumeration, not the file, was
  the unit. (2) I first tested `dashboard.sh` against the STALE `.claude/` copy and read a false-drift —
  canonical code was correct; refreshing via the init script was the fix. Recorded so the next migration
  remembers `.claude/` is regenerated, not edited.
- **Lessons:** verify against the CANONICAL `claude/` source, not the `.claude/` copy; a fix that spans N
  sweeps/artifacts must enumerate all N; a broken measuring instrument lies (dashboard-vs-stale-copy, and
  the earlier task-79 emit_block lesson).
- **Owner-decision log:** plan approved atomic; rollback point authorized to coder (branch + tag);
  scaffold-README conflict → architect consult → option (i); review dispositions R6=harden,
  Codex#4=add brief-missing-id, Codex#3=accept.
- **Review ledger:** `…/0062-…/review.md` — **closed-out**, verdict merge-recommended, **Codex FULL
  coverage** (not degraded). 6 findings all resolved; 1 accepted residual (Codex #3).
- **Verification (final tree):** `node --test test/*.test.js` → **449/449**; `bash test/prove-red.sh` →
  **gate PASSED**; `dashboard.sh sprint-2.md` → **exit 0, zero drift / correct roll-up**; all **171
  sprint md links resolve**; `git log`-recognized **160 renames** (history preserved).
- **Brief verification steps — walked:** no flat briefs remain ✓; 101 folders == pre-migration brief
  count ✓; plans/worklogs/reviews dirs gone, all files relocated (0 orphans) ✓; dashboard same roll-up
  + no new drift ✓; sprint hrefs resolve ✓; `sprints/reviews/` holds exactly the 2 sprint-keyed ledgers
  ✓; scaffold `tasks/` board dirs + `.gitkeep`s unchanged ✓; `converge-contract.test.js` passes
  unmodified ✓; id-mismatch + malformed-folder red-proved ✓; neither fires across the real corpus ✓.
- **Change surface:** ~186 files — 160 renames + `dashboard.sh` + `test/dashboard-contract.test.js`
  (+3 new drift tests) + both movers + both stateful-review skills + `fkit-reviewer.md` + `README`s (4)
  + `task-brief` + `wiki-ingest`/`sync` + `ship-loop` + `task-done`/`task-cancelled` + sprint hrefs.
- **Residuals / follow-ups (named only — not filed):**
  - **Task 79** owns the remaining doc-link repair, incl. the moved **`sprints/reviews/*.md`** ledgers,
    which still carry broken flat `../tasks/backlog/<slug>.md` links (reviewer's honesty note — outside
    task-76's AC). 77's pre-migration baseline is already captured in `…/0079-…/worklog.md`.
  - Accepted residual: whole-tree orphan-folder lint (Codex #3) — re-raise only if a real orphan appears.
- **Commit state:** the migration is **uncommitted working-tree** on branch
  `migration/task-folder-structure` (baseline `29c5b3c`, tag `pre-task-folder-migration`). **The owner
  makes the final commit/merge** — the loop never commits.

### OPEN QUESTIONS for the owner (non-blocking)
1. Brief internal inconsistency (line 90-91 vs 98/step-H on scaffold `tasks/`) — producer wording fix.
2. Exact surviving text of `tasks/README.md` — I implemented the folder-keyed ledger rule + layout;
   confirm the shape is what you want.

### Commit state
- Baseline `29c5b3c` committed + tagged. **Migration itself is UNCOMMITTED working-tree** (158 renames
  + dashboard.sh + hrefs + test WIP). Owner makes the final migration commit after review.
