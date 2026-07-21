# Plan — Repair task links outside the wiki after the migration (task 77)

**Task ID:** 0079 · **Sprint 2**, priority 77 · **Owner:** fkit-coder
**Approved:** owner sequenced "merge 76 first, then 77"; 76 merged to `main` (`331f298`), so 77 runs now.
Grounded on the live post-migration tree: **48 broken task-brief links** in scope.

## Scope (the 48, by area)
- `knowledge-base/` (ADRs, reports, conventions) — 22 links to old flat `tasks/<board>/<slug>.md`.
- `tasks/` in-folder `plan.md`/`worklog.md`/`review.md` self-back-links — 20 (`Source task:` line-3),
  now stale on both depth and folder.
- `sprints/reviews/` (the 2 sprint-keyed ledgers) — 6 inbound links still flat.
- **Out of scope:** `ai-agents/wiki-vault/` (task 78, wiki role) — never touched.

## Method
- Repoint every broken **link** to its post-migration target by computing `path.relative` from the
  containing file to the current `tasks/<board>/<NNNN>-<slug>/brief.md` (a slug→folder map from the live
  tree). Resolving against the file's own directory fixes the relative-depth error the folder level adds.
- **Link vs claim:** only `](href)` markdown pointers are repointed. Prose/inline-code citations of a
  path (a review ledger naming `foo.md:58` as *where a finding was seen*) are historical claims — left
  alone and listed in the worklog.
- Reconcile against 77's pre-migration baseline (16 already-broken, in this folder's worklog): each is
  repaired or on the left-alone list.

## Verification (brief's steps)
- Mechanical sweep for `tasks/(backlog|done|cancelled)/…` across `knowledge-base/` + `tasks/` returns
  only the deliberately-left-alone claims.
- Every relative link in the swept files resolves (resolved against each file's dir).
- Baseline reconciled; the 2 sprint-keyed ledgers findable, inbound links resolve.
- `dashboard.sh sprint-2.md` emits no new drift; full test suite still green.
