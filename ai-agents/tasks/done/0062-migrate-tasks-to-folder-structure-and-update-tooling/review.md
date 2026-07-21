# Review — 0062-migrate-tasks-to-folder-structure-and-update-tooling

Task: ai-agents/tasks/done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md
File(s) under review: working tree on branch `migration/task-folder-structure` vs tag `pre-task-folder-migration` (183 files; load-bearing: `claude/skills/fkit-status/dashboard.sh`, `test/dashboard-contract.test.js`, both movers, both stateful-review skills, `fkit-task-ship-loop`, sprint plans)
Status: closed-out (Round 2 — all findings resolved, dispositions recorded)

## Reviewer findings
| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | low    | ai-agents/sprints/sprint-2.md:73,75 | Two inline `[review](../reviews/…)` links (task 20 & 52 ledgers) point at the removed top-level `reviews/` dir; both targets now live at `../tasks/done/<NNNN>-<slug>/review.md` (both exist). Violates task 76 acceptance criterion (brief:128 "Every href in `ai-agents/sprints/*.md` … resolves to a real path"). Board unaffected (dashboard exit 0, zero drift — dashboard follows only the Filename-column href). Defect: incomplete execution of the task's own acceptance criterion. |
| R2 | 1     | medium | claude/skills/fkit-task-cancelled/SKILL.md:232,248,254 | The cancelled mover's **step-6 dependency/orphan sweep** still keys on `<file>.md` basename (`grep … "<file>.md\|<short task name>"`) and its triage still names removed `reviews/plans/worklogs/` dirs. The migration updated step-4's primary sweep to the folder name `<NNNN>-<slug>` but left step 6 on the flat-file idiom — under folders every basename is `brief.md`, so this sweep no longer reliably finds inbound dependency references. The section's own comment calls it "the SECOND sweep … the one most easily missed"; the migration missed it. Defect: an orphan-dependency sweep that silently under-recalls on every cancellation. |
| R3 | 1     | low    | claude/skills/fkit-task-done/SKILL.md:21-24,54 ; claude/skills/fkit-task-cancelled/SKILL.md:27 | Both movers' **bare-filename intake fallback** ("resolve `<slug>.md` under `ai-agents/tasks/backlog/`") points at a flat path that no longer exists post-migration; a bare old-style filename resolves to "file does not exist." The documented primary path (full `…/<NNNN>-<slug>/brief.md`) and the folder `git mv` step are correct. Defect: stale convenience-intake path; under folders the shorthand should be the folder name / ID. |
| R4 | 1     | low    | claude/skills/fkit-task-done/SKILL.md:220 ; claude/skills/fkit-task-cancelled/SKILL.md:274 | Both movers' **Report template** still states the destination as `ai-agents/tasks/<board>/<file>.md` — a path that cannot exist under ADR-029 (destination is the folder `…/<NNNN>-<slug>/`). The actual move step (git mv the folder) is correct; only the report line is stale. Defect: every close/cancel report hands the owner a non-existent path. |
| R5 | 1     | low    | claude/skills/fkit-task-ship-loop/SKILL.md:197 | Close-out evidence-packet heading still names the finalized artifact `worklogs/<task-id>.md` — the removed top-level location. Elsewhere the same skill uses the folder-local `worklog.md`. Defect: a resumed/compacted run could look for or recreate the removed `worklogs/` path, forking durable state. |
| R6 | 1     | low    | claude/skills/fkit-status/dashboard.sh:547-557 | The `malformed-folder` branch fires whenever the linked file is absent but its parent dir exists and is a board-child — it never checks that `brief.md` is actually absent from that dir. A board href pointing at a non-`brief.md` file inside a well-formed folder (e.g. `…/0062-slug/typo.md`) would be mislabeled `malformed-folder` instead of a broken link. Latent only: not reachable from live data (all board hrefs resolve to `brief.md`, proven). Codex's paired claim that this "manufactures ID/status drift" is **disproven** — those checks are gated on a non-empty `brief_path`, which is empty in this branch. Robustness gap, not a live defect. |

### Round 2 — fix verification (reviewer, independently verified against code)
All six Round-1 findings resolved; verified against the working tree, not merely trusted:
- **R1** ✅ `sprint-2.md:73,75` repointed to `../tasks/done/0020-…/review.md` and `…/0052-…/review.md` (both targets exist). In-scope AC (brief:128 — `sprints/*.md`, `sprints/done/*.md`) satisfied. *Note, not a reopen:* the moved sprint-keyed ledgers under `sprints/reviews/*.md` still carry broken flat `../tasks/backlog/<slug>.md` links — those are **task-79 documentation scope**, outside task-76's AC (`backlog.md`'s `sprint-N.md` is a prose template placeholder, not a real link). So the coder's "0 broken" holds for the AC set; the `sprints/reviews/` residue is task 79's.
- **R2** ✅ cancelled step-6 dependency sweep now keys `<NNNN>-<slug>` (`SKILL.md:229,233`), warns "Never key on `brief.md`," and triage prose updated (dissolved-dir list → in-folder `review.md`/`plan.md`/`worklog.md`).
- **R3** ✅ both movers' step-1 now resolves a bare name/slug to the task **folder** (done:54-56, cancelled:60-61). (The intro example still shows `add-export-endpoint.md` with a trailing `.md` — cosmetic residue; the operative resolution step is correct.)
- **R4** ✅ Report "Moved" line → `ai-agents/tasks/<board>/<NNNN>-<slug>/` (done:222, cancelled:276).
- **R5** ✅ ship-loop:197 close-out heading → `<task-folder>/worklog.md`.
- **R6** ✅ HARDEN (owner-ruled) — both malformed sites now check `[ ! -f "$folder_dir/brief.md" ]` directly (linked-location `dashboard.sh:560`, recovery `:576`); a broken href to a non-`brief.md` file in a well-formed folder now correctly falls through to `missing-brief`, not `malformed-folder`. Self-contained, not branch-order-dependent. No regression.
- **Codex #4** ✅ ADD SYMMETRY (owner-ruled) — new `brief-missing-id` nonconformance drift kind (`dashboard.sh:609-611`), mutually exclusive with `id-mismatch` (if/elif), guarded on a resolved brief, symmetric with `brief-missing-status`; red-proved contract test added (`dashboard-contract.test.js:1775`).

**Gates re-run (reviewer, this tree):** `node --test test/*.test.js` → **449/449** (the +1 is the new red-proved `brief-missing-id` test); `bash test/prove-red.sh` → **gate PASSED**; `dashboard.sh sprint-2.md` → **exit 0, zero drift** across all 101 folders; `bash -n dashboard.sh` → clean.

**Disproven / not recorded as rows (noted so the coder need not chase them):**
- **Codex #3** — an unreferenced orphan folder (only `plan.md`, no `brief.md`, linked by no board row) is never flagged `malformed-folder`. INCORRECT as a defect: `dashboard.sh` is contractually a pure function of the plan + the briefs it links (dashboard.sh:24-27); scanning all folders is outside its contract. Not a task-76 regression. Optional future work: a whole-tree malformed-folder lint — owner's call, not blocking.
- **Codex #4** — deleting a brief's `## ID` suppresses the `id-mismatch` check (gated on `[ -n "$b_id" ]`). This is **consistent by design** with the script's settled ABSENT≠disagreement philosophy (marker_key ABSENT-vs-UNRECOGNIZED; the `brief-missing-status` handling). Frontier, not defect. A symmetric `brief-missing-id` drift kind would be a nicety, but ADR-029 Decision 5 makes the folder authoritative and does not mandate it. All 101 briefs carry `## ID` (verified).

## Coder response
Round 1 verified against the code. R1–R5 confirmed CORRECT and **fixed autonomously** (mechanical,
in-plan `CORRECT` defects, all within task 76's own tooling scope). R6 and the two suppressed items
(Codex #3, #4) are judgment calls → **stopped for the owner** (dispositions pending).

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Repointed both `../reviews/…` links in `sprint-2.md:73,75` to `../tasks/done/<NNNN>-<slug>/review.md`; both targets exist. Verified: **all 171 sprint md links resolve, 0 broken** — the brief's `sprints/*.md` acceptance criterion is now met. | ✅ done |
| R2 | CORRECT | Defect | `fkit-task-cancelled` step-6 dependency sweep now keys `<NNNN>-<slug>` (not `<file>.md` = `brief.md` for all); triage prose fixed (folder-name hits first; dissolved-dir list → in-folder `review.md`/`plan.md`/`worklog.md`). The one-of-N miss — step 4 was fixed, step 6 was not. | ✅ done |
| R3 | CORRECT | Defect | Both movers' bare-name intake now resolves a task **folder** (brief path, or folder name / slug looked up under `backlog/` then the other boards). | ✅ done |
| R4 | CORRECT | Defect | Both movers' Report "Moved" line → `ai-agents/tasks/<board>/<NNNN>-<slug>/` (a real folder path). | ✅ done |
| R5 | CORRECT | Defect | `fkit-task-ship-loop:197` close-out heading → `<task-folder>/worklog.md` (was removed `worklogs/<task-id>.md`). | ✅ done |
| R6 | CORRECT (latent) | Robustness | **Owner ruled: harden.** Added the explicit `[ ! -f "$folder_dir/brief.md" ]` guard to **both** malformed-folder branches (linked-location + recovery), so the check is self-contained rather than relying on branch order; a well-formed folder whose href points at some other missing file now correctly reports `missing-brief`, not `malformed-folder`. | ✅ done |
| Codex #4 | CORRECT | Defect | **Owner ruled: add symmetry.** Added a `brief-missing-id` drift kind (nonconformance), symmetric with `brief-missing-status`: a brief with no `## ID` is now flagged rather than silently skipping the `id-mismatch` reconciliation. Red-proved contract test added (missing → fires; adding `## ID` → clears). | ✅ done |
| Codex #3 | ACKNOWLEDGED | Frontier | **Owner ruled: accept, no follow-up.** The plan-scoped contract (`dashboard.sh:24-27`) is deliberate and the migration's 0-orphan state is independently verified. Recorded as an accepted residual below. | closeout |

**Re-verification after R1–R5:** `.claude/` refreshed; `dashboard.sh sprint-2.md` exit 0, **zero
drift**; `node --test test/*.test.js` **448/448**; all 171 sprint links resolve.

**Suppressed items relayed to the owner (not fixed — dispositions pending):**
- **Codex #3** (whole-tree orphan-folder lint) — I agree it's outside `dashboard.sh`'s plan-scoped
  contract (`dashboard.sh:24-27`); a follow-up task is the owner's call.
- **Codex #4** (missing `## ID` suppresses `id-mismatch`) — consistent with the settled
  ABSENT≠disagreement design; a `brief-missing-id` drift kind would be symmetry, not a fix.

## Accepted residuals (shared, do-not-re-litigate)
- **Orphan-folder detection is out of `dashboard.sh`'s scope (Codex #3, owner-ruled 2026-07-21)** —
  What: `dashboard.sh` flags `malformed-folder`/`id-mismatch` only for task folders a sprint plan
  actually links; a task folder referenced by no plan row is not scanned. · Why (structural):
  `dashboard.sh` is contractually a pure function of (plan + the briefs it links) (`dashboard.sh:24-27`);
  a whole-tree scan is a different tool. The task-76 migration's 0-orphan / 0-mis-key state was
  independently verified at migration time (101 folders = 101 briefs, dry-run + reviewer). ·
  Re-raise only if: a mis-keyed or brief-less orphan task folder is found in practice (then a
  whole-tree malformed-folder lint becomes a real follow-up task — producer's call).
