# Plan — 0243: author `claude/structure-spec.md` + the scaffold-inventory drift test

> Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-07 — verbatim
> selected option: **"Approve (Recommended)"**, covering the plan and its four stated plan
> decisions. Plan authored by a spawned fkit-coder (`/fkit-plan-task`), presented by the fkit-lead
> driver, written to this file by the driver in the approval turn (fkit-sprint-ship-loop §Durable
> artifacts).

Task: `ai-agents/tasks/done/0243-author-the-structure-spec-md-and-its-scaffold-inventory-drift-test/brief.md`
Source of truth: report `ai-agents/knowledge-base/reports/2026-08-06-design-post-update-structure-check.md`
§4 (content/home/maintenance), §6 (ADR-005 routing note), §8 (root files); ADR-039 §5 (Q5 ruling,
verbatim "Yes (Recommended)"). Dep 0242 satisfied: ADR-039 exists
(`ai-agents/knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md`).

## Facts verified on disk this pass (not assumed)

- `claude/scaffold/ai-agents/` holds **27 files**: `README.md`; `knowledge-base/PROJECT.md`; 8 files
  under `knowledge-base/conventions/`; `tasks/README.md`; `wiki-vault/{index,log,schema}.md`; 13
  `.gitkeep` placeholders. Plus scaffold `CLAUDE.md`/`AGENTS.md` (root pair, in scope by ruling 4).
  The design's "27" holds today; the build re-derives it, never hard-codes it.
- `install.sh` §1 (lines 42–43) does `rm -rf "$SHARE/claude"` + `cp -R … claude` — wholesale. A file
  at `claude/structure-spec.md` ships in the share **with no installer change**. Self-host: the
  launcher resolves the share to the checkout's `claude/` dir, same result. Brief's out-of-scope
  guard on installer/launcher edits is satisfied by doing nothing to them.
- `claude/structure-manifest.tsv` (0244, Done) covers **17 unique paths** — the owner-ruled
  **class-agnostic superset**: every content file ever shipped (incl. owner-seed `PROJECT.md`, the
  wiki-vault files, and the retired `ai-agents/reviews/README.md`), excluding `.gitkeep` and
  `universal-rules.md` (ruled in 0244's approved plan, open question 2: "Class-agnostic superset
  (Recommended)"). Division of labor per report §7: manifest = touched-or-not; **spec = what should
  exist + class semantics**.
- Test conventions: `npm test` = `node --test test/*.test.js && bash test/prove-red.sh`; a new
  `test/structure-spec.test.js` is picked up with no `package.json` change.

## Deliverable 1 — `claude/structure-spec.md` (new file, hand-authored prose)

Structure:

1. **Header prose**: what this file is (the "verbatim explaination" of what the installed version
   requires in a consuming project's structure — ruling 2), who reads it (agents post-update; the
   0245 check skill), where it lives and why (install share; a project-local copy is self-defeating
   under create-if-absent — report §4), and **why it carries no `version:` field** (the wholesale
   share refresh IS the staleness-proofing; the distribution is sha-keyed). A pinned "machine-read
   contract" note: the two inventory tables below are parsed by `test/structure-spec.test.js`;
   their format may not change without changing the test in the same commit.
2. **The six-class table** — report §4's table, carried faithfully: structural directory /
   fkit-authored reference file / owner-authored seed / wiki-authored living file / placeholder /
   root context file, each with its check + repair semantics as §4 states them.
3. **Inventory Table A — directories**: every directory in the scaffold tree under `ai-agents/`
   (derived by walk, incl. intermediate parents like `knowledge-base/`, `wiki-vault/wiki/`), class
   `structural directory`. Wrong-type is report-only; creation is launch convergence's job
   (ADR-015 Decision §2).
4. **Inventory Table B — files**: all 29 file rows (`27` scaffold paths incl. the 13 `.gitkeep`s,
   plus root `CLAUDE.md`, `AGENTS.md`), one class each:
   `.gitkeep` → placeholder; `knowledge-base/PROJECT.md` → owner-authored seed; the three
   `wiki-vault/*.md` → wiki-authored living file; root pair → root context file; the remaining 11
   → fkit-authored reference file.
5. **The ADR-005 routing note on every wiki-vault row** — in both tables, every row whose path is
   under `ai-agents/wiki-vault/` carries it verbatim-in-spirit: existence-only check; `schema.md`
   content-check is report-only; **any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s
   exclusively** (ADR-005) — so no future reader of the spec is instructed into a violation
   (report §6).
6. **Prose per path** — grouped by directory with a per-file line each (the report's own §4 example
   is directory-level prose naming the files): what each path is *for* and what "conforming" means.
   Owner-authored seeds: never content-checked, divergence is the point. Placeholders: defer to
   init's existing `.gitkeep` rule — documented, never re-implemented. Root context files per
   report §8: the marker-delimited fkit block is self-healing and out of repair scope; the
   owner-side body is the repair target; markers-malformed → refuse to classify, markers-absent →
   whole file hashes → owner-edited; both report-only.
7. **Companion-manifest section**: points at `structure-manifest.tsv` + its hashing contract
   (CRLF→LF, marker elision, sha256); states the split (spec = what/class, manifest =
   touched-or-not); notes the manifest also carries **historical-only paths** (e.g.
   `ai-agents/reviews/README.md`) that are *not* part of the current requirement and so are not
   inventory rows; notes `universal-rules.md` is install-side input to the rules block, never a
   project path (consistent with its 0244-ruled manifest exclusion).
8. **What this spec is NOT**: no mutation mechanism — check (0245), repair (0246), notice (0247)
   are separate, consent-gated per ADR-039; ADR-015's invariant unchanged and in force.

## Deliverable 2 — `test/structure-spec.test.js` (new file, the drift test)

Same fourth test-scope category as `structure-manifest.test.js` (invariant over repo content),
cited the same way. Built as small pure functions (spec-table parser; inventory comparator) plus
assertions, so red-provability is permanent via fixtures:

- **A — directory-set equality**: Table A's paths == directories found by walking
  `claude/scaffold/ai-agents/` (both directions; named failures: "spec missing dir X" / "spec lists
  dir X the scaffold does not ship").
- **B — file-set equality**: Table B's paths == scaffold file walk + {`CLAUDE.md`, `AGENTS.md`}
  (both directions, named failures). No duplicate rows.
- **C — class validity + mechanical class rules**: every row's class ∈ the six-class vocabulary,
  and matches the path-pattern mapping in Deliverable 1 item 4. *Plan decision, stated for
  approval:* this is slightly stricter than pure inventory-drift — a future scaffold file wanting a
  non-default class must update the test's rule table in the same commit. Deliberate: it makes the
  class column as drift-proof as the path column, which is what "class table consistent" needs.
- **D — ADR-005 routing note**: every wiki-vault row (both tables) carries the routing marker
  (assert the row references ADR-005 / fkit-wiki routing). Makes brief verification step 2
  permanent, not one-shot.
- **E — no `version:` field**: no line in the spec matches `/^\s*version\s*:/i` (verification
  step 3, made permanent).
- **F — manifest consistency (the 0244 tie-in)**: every Table B row **except placeholders** appears
  in `structure-manifest.tsv`'s path set (local 3-line TSV parse; no refactor of the manifest
  test's private helper — minimal diff). Placeholders and directories are excluded exactly as
  0244's ruled scope excludes them. This is the "class table consistent with what the manifest
  covers" guarantee, mechanical.
- **Negative fixtures (permanent red-proof)**: comparator unit cases on synthetic inventories —
  a missing row, an extra row, a wrong class, a wiki-vault row without the routing note — each
  asserted to produce its named failure.

## Sequencing

1. Re-derive the inventory from `claude/scaffold/` by walk (never trust the 27/29 counts).
2. Author `claude/structure-spec.md` per Deliverable 1.
3. Write `test/structure-spec.test.js` per Deliverable 2.
4. **Red first** (repo custom, brief step 4): transiently delete one Table B row from the real
   spec → `node --test test/structure-spec.test.js` → observe the *named* set-equality failure;
   restore; green. Record the red run in the task worklog. (The negative fixtures keep this
   provable forever; `prove-red.sh` is not extended — its scope is the launcher-contract suite.)
5. Full `npm test` green.
6. Evidence for verification steps 5–6: cite `install.sh` lines 42–43 (+ launcher self-host
   share resolution) for share placement; `git status --porcelain` shows only the two new files —
   nothing under `ai-agents/wiki-vault/`, no consuming-project path touched.

## Files changed

- **New:** `claude/structure-spec.md`, `test/structure-spec.test.js`. **Nothing else.**
  No `package.json`, `install.sh`, `fkit-claude.sh`, `fkit-claude-init.sh`, `prove-red.sh`,
  scaffold, or wiki-vault change. No commit, no task-file move.

## Edge cases & failure modes accounted for

- Intermediate directories with no `.gitkeep` of their own (`knowledge-base/`, `wiki-vault/wiki/`):
  covered by deriving Table A from a directory walk, not from `.gitkeep` locations.
- Retired manifest-only path (`ai-agents/reviews/README.md`): explicitly *not* an inventory row;
  assertion F is one-directional (spec ⊆ manifest) so it cannot force retired paths into the spec.
- Parser fragility: table parsing anchored to pinned section headings and a documented row format
  (declared in both files); unrelated markdown tables in the spec cannot leak into the inventory.
- CRLF/whitespace: spec authored LF; parser trims cell whitespace; no reliance on line numbers.
- Non-`.md` scaffold additions later: the walk takes every regular file, not just `.md`.
- Both drift directions fail with distinct, named messages (a spec row going stale AND a scaffold
  file landing without a spec row).

## Plan decisions taken (approved by the owner with the plan, 2026-08-07)

1. Two inventory tables (directories + files) rather than one — cleanest fit for "a class per
   path" when structural directories and placeholders are distinct classes.
2. Mechanical class-rule enforcement in assertion C (stricter than pure path-drift; rationale
   above).
3. Assertion F ties spec to manifest (the 0244 consistency requirement, made mechanical).
4. `universal-rules.md`: prose mention only, never an inventory row — follows 0244's owner-ruled
   exclusion precedent and report §4's "never copied into the project".
