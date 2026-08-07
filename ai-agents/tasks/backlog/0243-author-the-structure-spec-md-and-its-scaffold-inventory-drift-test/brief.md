# Author the structure-spec `.md` (install share) and its scaffold-inventory drift test

## ID
0243

## Sprint
Sprint 4

## Priority
Sprint 4 P3

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Implementation unit 2 of the `0241` design** — report
[`2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
§4 and §11. All six of the design's open questions were ruled by the owner via `AskUserQuestion`,
live `fkit lead` session, **2026-08-06**; this unit implements two of them directly:

- **Q5 — spec maintenance, verbatim: "Yes (Recommended)"** — a **hand-authored prose spec in the
  install share, guarded by a mechanical scaffold-inventory drift test**. Hand-maintained mirrors rot
  (the task-70 incident, cited in report §4); the drift test is what makes this spec not-a-mirror: a
  scaffold change cannot land without the spec moving in the same commit.
- **Q4 — owning role, verbatim: "Yes, producer (Recommended)"** with wiki-vault repairs **always
  routed to `fkit-wiki`**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
  — the spec file itself must carry that routing note on its wiki-vault rows, *"so no future reader of
  the spec is instructed into a violation"* (report §6).

This is the element the owner's original ruling names directly: *"a verbatim explaination of what is
needed in the structure as an .md file that the agents will read"*.

### Why the install share, not the project

Report §4, decided there: a project-local copy is **self-defeating** — create-if-absent steps over it
forever and the spec would describe a stale version, the exact trap it exists to fix. The install
share is refreshed wholesale (`install.sh` does `rm -rf` + `cp -R`), so the spec is by construction
*the installed sha's* spec and needs **no version field at all**.

## What to build

1. **`claude/structure-spec.md`** (repo home; lands in the install share alongside the scaffold) —
   per report §4:
   - **The full path inventory** the installed version requires: the scaffold's files under
     `ai-agents/` (27 at design time — re-derive from `claude/scaffold/`, do not trust the count),
     **plus** the project-root `CLAUDE.md` and `AGENTS.md` (in scope by the owner's 2026-08-06 "In
     scope (Recommended)" ruling).
   - **A class per path**, per §4's six-class table: structural directory / fkit-authored reference
     file / owner-authored seed / wiki-authored living file / placeholder / root context file — each
     with its check and repair semantics as the table states them (owner-authored seeds are
     **never** content-checked; placeholders defer to init's existing `.gitkeep` rule; root context
     files per report §8).
   - **Prose per path** — what it is *for* and what "conforming" means: the *"verbatim explaination"*
     the ruling asks for, the part a raw listing cannot carry.
   - **The ADR-005 routing note on every wiki-vault row**: existence-only checks; `schema.md`
     content-check is report-only; any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s
     exclusively.
   - **No `version:` field** — the wholesale share refresh is the staleness-proofing (report §4).
2. **The scaffold-inventory drift test** — a repo test (sibling of `test/rules-block-budget.test.js`
   in spirit) that mechanically compares the spec's path inventory against `claude/scaffold/` (plus
   the root-file entries) and **fails the build** when they disagree. Run it red first (remove or
   perturb one spec row and watch it fail) per the repo's own "run red first" custom, then green.

### ⛔ Out of scope

- ⛔ The check skill (`0245`), the repair path (`0246`), the launch notice (`0247`), the manifest
  (`0244`).
- ⛔ Any behavior change in `claude/fkit-claude-init.sh` / `claude/fkit-claude.sh` / `install.sh`
  beyond what is needed to ship the new file in the share (the share copy step already copies
  `claude/` wholesale — verify rather than assume).
- ⛔ No consuming-project write of any kind; the spec never becomes a scaffold file copied into
  projects (report §4 rules that shape out).
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005). No commit, no re-rank, no task-file move.
- ⛔ No silent auto-update of anything — this unit ships a **document and a test**, no mutation
  mechanism.

## Verification steps

1. `claude/structure-spec.md` exists; every path under `claude/scaffold/ai-agents/` appears in it,
   plus `CLAUDE.md` and `AGENTS.md`, each with a class from the §4 table and conformance prose.
2. Every wiki-vault row in the spec carries the ADR-005 routing note.
3. The spec contains no `version:` field.
4. The drift test exists, was demonstrated **red** against a deliberately perturbed inventory, and is
   green on the real tree; `npm test` is green.
5. A fresh install/self-host resolves the spec in the share next to the scaffold (verify via the
   launcher's share-resolution logic or `install.sh`'s copy step).
6. `git status --porcelain` shows nothing under `ai-agents/wiki-vault/`, and no consuming-project
   path was mutated.

## Notes

- **Depends on:** `0242` — the companion ADR confirms the spec's home/contract as the durable record
  before this ships.
- **Blocks:** `0245`, `0247`.
- **Source of truth:** report §4 (content scope, home, maintenance), §6 (routing note), §8 (root
  files). Implement the design; do not re-derive it.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board — no sprint named by the owner;
  no re-rank (ADR-035).
