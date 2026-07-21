# Plan — Migrate every task into a folder, update the tooling (task 76)

**Task:** `ai-agents/tasks/done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md`
**Task ID:** 0062 · **Sprint 2**, priority 76 · **Owner:** fkit-coder
**Approved:** 2026-07-21 — owner approved the plan **atomic, as written**, and **authorized the coder to
create the rollback point** (commit clean tree + `git tag pre-task-folder-migration`).

This is **the point of no return** (design spec §7.1). Atomic by necessity: the moment briefs move,
every path-constructing tool looks at a path that no longer resolves, so files + tooling ship together.

## Sources (authoritative)
- Design spec rev 3: `ai-agents/knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md`
- ADR-029 (a task is a folder keyed by a permanent global ID)
- On any spec-vs-skill disagreement about ID **allocation**, `fkit-task-brief/SKILL.md` step 6 wins.

## Pre-flight — the rollback point (owner-authorized to coder)
1. Commit the clean tree (77 baseline worklog + this plan + 76 worklog + In-progress status flip).
2. `git tag pre-task-folder-migration`.
- **Window closes when 77/78 land** — after that the only rollback is destructive `reset --hard`. So 76
  must be reviewed sound before 77 starts.
- The migration itself is left in the **working tree** for review; the owner makes the final one-commit
  after review (the authorization covered the rollback commit + tag, not the migration commit).

## New layout (spec §4)
```
ai-agents/tasks/<board>/<NNNN>-<slug>/
├── brief.md      REQUIRED (reserved name — NOT <slug>.md)
├── plan.md       optional (ADR-020)
├── worklog.md    optional (ADR-020)
├── review.md     optional
└── assets/       optional
```
- ID = four digits, zero-padded, from the brief's own `## ID` field (task 75 wrote them). Folder =
  `<NNNN>-<slug>`. Board membership stays in the path (`backlog|done|cancelled`).

## Work

### A. Migration (all `git mv`, history-preserving; counts derived at run time)
- Every brief → `tasks/<board>/<ID>-<slug>/brief.md`. ID read from each brief's `## ID`; slug = current
  basename stem. Cross-check `## ID` prefix == intended folder before moving (mis-key = silent corruption).
- `ai-agents/plans/*.md`, `worklogs/*.md`, `reviews/*.md` (task-keyed) → `plan.md`/`worklog.md`/`review.md`
  inside the matching folder. The three top-level dirs then **cease to exist**.
- The **2 sprint-keyed ledgers** (`sprint2-scaffold-launcher-hardening.md`,
  `sprint2-shared-instructions-delivery.md`) → `ai-agents/sprints/reviews/` (§5.2b) — NOT a task folder.
- Any plan/worklog/review with **no matching task folder** → listed explicitly, never dropped.

### B. `dashboard.sh` (the real code — most load-bearing consumer)
- **Re-derive `found_dir` = the BOARD.** Post-migration `basename(dirname(brief))` = the folder
  (`0042-slug`), not the board. Board is now the grandparent. Every `expected_dir` cross-check depends
  on this — miss it and location-drift detection inverts silently.
- **Link-rot recovery keys on folder, not filename.** `fname` is now `brief.md` for every task; recovery
  must find the task by its `<NNNN>-<slug>` folder (ID prefix), not `$AGENTS/tasks/$cand/$fname`.
- **New `id-mismatch` drift kind** — sibling of drift rule 3: brief `## ID` ≠ folder-name prefix → drift
  record naming BOTH values; folder authoritative; NO auto-correct.
- **New malformed-folder drift kind** — a `tasks/<board>/` folder with no `brief.md` → drift.
  `plan.md`/`worklog.md`/`review.md`/`assets/` reserved, never drift.
- ⚠️ dashboard.sh deliberately never globs (lines 35-39). Folder discovery needs a glob — add with the
  same `-f`/sanitisation discipline; flag in review.

### C. Both movers (prose skills)
- `fkit-task-done`, `fkit-task-cancelled` — move a **folder**, not a file; keep href-repair.

### D. Path/parse updates across the measured `claude/` set (~21 files)
- agents (coder/producer/architect), plan-task, task-brief, status/SKILL, initiate-project, team,
  design-spec, stateful-review, process-stateful-review, wiki-ingest, wiki-sync, ship-loop, wiki-lint,
  fkit-claude-init.sh, scaffold README + wiki-vault schema.
- `wiki-ingest`: `all tasks` = `tasks/{backlog,done,cancelled}/*/brief.md` (briefs only).
- `wiki-sync`: task 78 runs a forced full re-ingest (rule lands here).

### E. Sprint-board hrefs
- `ai-agents/sprints/*.md` (~94, derived) → new folder paths. Executable refs. (The ~110 doc refs = 77.)

### F. README relocation
- `reviews/README.md` ledger-key rule → `ai-agents/tasks/README.md`, in BOTH homes (live + scaffold).

### G. Tests
- `dashboard-contract.test.js` — fixtures → folder shape; **+2 fixture cases**: id-mismatch (fires +
  red-proves: fix ID → record vanishes); malformed-folder (fires + red-proves: add brief.md → clears;
  brief.md+plan.md is NOT drift).
- Duplicate-ID guard (task 85, already shipped): confirm it still finds a non-zero brief count in the
  folder shape.
- `harness.mjs` / `prove-red.sh` — fixture construction updated.
- `converge-contract.test.js` — **unchanged** (keep-list derived from manifest; ADR-027 parity free).

### H. Scaffold `tasks/` — UNCHANGED (§4.1 / Dec 9)
- Three empty board dirs + `.gitkeep` stay byte-identical. `git status` shows nothing under
  `claude/scaffold/ai-agents/tasks/`.

## Verification (brief's steps)
- No flat `tasks/{backlog,done,cancelled}/*.md`; folder count == pre-migration brief count.
- `plans/`/`worklogs/`/`reviews/` gone; every file relocated (orphans listed).
- `dashboard.sh sprint-2.md`: exit 0, `⟦fkit-dashboard v1⟧`, SAME roll-up counts, **zero** new drift
  across all folders (migration's own correctness check — id-mismatch here = mis-keyed folder).
- Every `sprints/*.md` + `sprints/done/*.md` href resolves mechanically. `git log --follow` shows
  history. Both movers dry-run on a scratch task. Full `npm test` + `prove-red.sh` green.
- `sprints/reviews/` holds exactly the 2 sprint-keyed ledgers; `reviews/` gone.
- Scaffold `tasks/` byte-identical. `converge-contract.test.js` passes unmodified.

## Sequencing & decisions (recorded)
- **77 baseline captured** this session before any move (the one step that can't be done late). ✓
- **Atomic** (owner-approved). If planning-in-flight shows the commit genuinely unmanageable → STOP and
  propose the split; never quietly drop the two drift checks.
- **Rollback point: coder-created** (owner-authorized). Migration left in working tree for review.
- Full stateful review with Codex before close (largest structural change in project history).
