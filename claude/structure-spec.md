# fkit structure-spec — what the installed version requires of a consuming project

This file is the **verbatim explanation of what is needed in the structure** of a consuming
project for the fkit version it sits beside — the `.md` the owner's 2026-08-06 ruling asked for
(design report `2026-08-06-design-post-update-structure-check.md` §1, §4; licence recorded in
ADR-039). Agents read it after an update as the reference for what the project's working structure
should contain and what each path *means*; the structure-check procedure (design §6, implementation
unit 4) reads it as its "what should exist, and what class each path is" layer.

**Who reads it:** any role, read-only, from the install share. It is **never copied into a
project** — a project-local copy would be created once and then stepped over by launch
convergence's create-if-absent rule forever, describing a stale version: the exact trap this file
exists to close (design §4, "the trap the spec must not fall into itself").

**Where it lives and why:** the install share (`~/.local/share/fkit/claude/structure-spec.md`),
beside the scaffold it describes. `install.sh` refreshes the share **wholesale** — `rm -rf
"$SHARE/claude"` then `cp -R` (install.sh §"1. install the resources") — so this file is, by
construction, *the installed content's* spec. In a source-checkout self-host the launcher resolves
the share to the checkout root (`claude/fkit-claude.sh`, `share="$(cd "$here/.." && pwd)"`), and
the same co-location property holds.

**Why there is no `version:` field — deliberately.** fkit's distribution is sha-keyed: two installs
can report the same `VERSION` and hold different content (ADR-015 Context §4), so a version field
would be insufficient — and the wholesale share refresh makes it unnecessary. The staleness-proofing
IS the co-location. Do not add one.

> **Machine-read contract — pinned.** The two inventory tables below (§"Inventory Table A —
> directories" and §"Inventory Table B — files") are parsed by `test/structure-spec.test.js` in the
> fkit repo, which fails the build when the tables and `claude/scaffold/` disagree. Load-bearing
> and not changeable without changing that test in the same commit: the two section heading texts;
> the three-column row shape ``| `path` | class | notes |``; paths backticked, project-relative,
> directories with a trailing `/`; the class cell exactly one of the six class names below; and the
> rule that every row whose path is under `ai-agents/wiki-vault/` names ADR-005 in its notes.

---

## The six classes

Check and repair semantics differ **by class**, so every path in the inventory declares one. The
table is the design's own (report §4), carried faithfully:

| Class | Examples | Check | Repair semantics |
|---|---|---|---|
| **structural directory** | `ai-agents/tasks/backlog/`, `ai-agents/knowledge-base/reports/` | exists, is a real directory (not symlink, not file) | creation is launch convergence's job (ADR-015 Decision §2); wrong-type is report-only |
| **fkit-authored reference file** | `ai-agents/README.md`, `ai-agents/knowledge-base/conventions/*.md`, `ai-agents/tasks/README.md` | content matches what the installed version ships | replace **only** if untouched-stale per the manifest (design §7, ADR-039); touched → report with diff, never touch |
| **owner-authored seed** | `ai-agents/knowledge-base/PROJECT.md` | exists only | **never** content-checked, never repaired — divergence is the point of the file |
| **wiki-authored living file** | `ai-agents/wiki-vault/index.md`, `log.md` | exists only | any write is `fkit-wiki`'s exclusively (ADR-005); `schema.md` content-check is report-only, repair routed to `fkit-wiki` |
| **placeholder** | the 13 `.gitkeep`s | none | governed by init's existing `.gitkeep` rule (documented below, never re-implemented here) |
| **root context file** | `CLAUDE.md`, `AGENTS.md` | body-outside-markers matches a shipped version | see §"Root context files" below; report-only branches for absent/malformed markers |

---

## Inventory Table A — directories

Every directory the installed version requires under a consuming project's root. All rows are class
`structural directory`: existence is created by launch convergence when missing (ADR-015 Decision
§2 — create-if-absent, never overwrite/move/delete); a path that exists but is not a real directory
(a file, a symlink) is **report-only** — nothing repairs it.

| Path | Class | Notes |
|---|---|---|
| `ai-agents/` | structural directory | the whole working structure's root |
| `ai-agents/knowledge-base/` | structural directory | durable project knowledge |
| `ai-agents/knowledge-base/conventions/` | structural directory | children are fkit-authored reference files |
| `ai-agents/knowledge-base/decisions/` | structural directory | ADRs accumulate here; ships empty |
| `ai-agents/knowledge-base/history/` | structural directory | historical records; ships empty |
| `ai-agents/knowledge-base/incidents/` | structural directory | incident write-ups; ships empty |
| `ai-agents/knowledge-base/reports/` | structural directory | design specs and reports; ships empty |
| `ai-agents/sprints/` | structural directory | sprint plans |
| `ai-agents/sprints/done/` | structural directory | archived sprint plans |
| `ai-agents/tasks/` | structural directory | the task boards' root |
| `ai-agents/tasks/backlog/` | structural directory | open task folders |
| `ai-agents/tasks/cancelled/` | structural directory | cancelled task folders |
| `ai-agents/tasks/done/` | structural directory | completed task folders |
| `ai-agents/wiki-vault/` | structural directory | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; the check here is existence-only |
| `ai-agents/wiki-vault/wiki/` | structural directory | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; the check here is existence-only |
| `ai-agents/wiki-vault/wiki/decisions/` | structural directory | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; the check here is existence-only |
| `ai-agents/wiki-vault/wiki/features/` | structural directory | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; the check here is existence-only |
| `ai-agents/wiki-vault/wiki/systems/` | structural directory | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; the check here is existence-only |
| `ai-agents/wiki-vault/wiki/tasks/` | structural directory | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; the check here is existence-only |

## Inventory Table B — files

Every file the installed version requires, project-relative. The class column decides the check and
repair semantics per the six-class table above.

| Path | Class | Notes |
|---|---|---|
| `CLAUDE.md` | root context file | see §"Root context files"; fkit-managed block is self-healing, owner body is the repair target |
| `AGENTS.md` | root context file | see §"Root context files"; fkit-managed block is self-healing, owner body is the repair target |
| `ai-agents/README.md` | fkit-authored reference file | orientation for the whole working structure |
| `ai-agents/knowledge-base/PROJECT.md` | owner-authored seed | never content-checked; divergence is the point |
| `ai-agents/knowledge-base/conventions/README.md` | fkit-authored reference file | what a convention is and how the folder is read |
| `ai-agents/knowledge-base/conventions/dependency-declaration-form.md` | fkit-authored reference file | convention |
| `ai-agents/knowledge-base/conventions/evidence-before-assertion.md` | fkit-authored reference file | convention |
| `ai-agents/knowledge-base/conventions/one-skill-one-output.md` | fkit-authored reference file | convention |
| `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | fkit-authored reference file | convention |
| `ai-agents/knowledge-base/conventions/status-report-format.md` | fkit-authored reference file | convention |
| `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` | fkit-authored reference file | convention |
| `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` | fkit-authored reference file | convention |
| `ai-agents/knowledge-base/decisions/.gitkeep` | placeholder | init's `.gitkeep` rule governs |
| `ai-agents/knowledge-base/history/.gitkeep` | placeholder | init's `.gitkeep` rule governs |
| `ai-agents/knowledge-base/incidents/.gitkeep` | placeholder | init's `.gitkeep` rule governs |
| `ai-agents/knowledge-base/reports/.gitkeep` | placeholder | init's `.gitkeep` rule governs |
| `ai-agents/sprints/.gitkeep` | placeholder | init's `.gitkeep` rule governs |
| `ai-agents/sprints/done/.gitkeep` | placeholder | init's `.gitkeep` rule governs |
| `ai-agents/tasks/README.md` | fkit-authored reference file | the task-folder and board contract |
| `ai-agents/tasks/backlog/.gitkeep` | placeholder | init's `.gitkeep` rule governs |
| `ai-agents/tasks/cancelled/.gitkeep` | placeholder | init's `.gitkeep` rule governs |
| `ai-agents/tasks/done/.gitkeep` | placeholder | init's `.gitkeep` rule governs |
| `ai-agents/wiki-vault/index.md` | wiki-authored living file | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; existence-only check |
| `ai-agents/wiki-vault/log.md` | wiki-authored living file | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; existence-only check |
| `ai-agents/wiki-vault/schema.md` | wiki-authored living file | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; content-check is report-only, repair routed to `fkit-wiki` |
| `ai-agents/wiki-vault/wiki/decisions/.gitkeep` | placeholder | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; init's `.gitkeep` rule governs creation |
| `ai-agents/wiki-vault/wiki/features/.gitkeep` | placeholder | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; init's `.gitkeep` rule governs creation |
| `ai-agents/wiki-vault/wiki/systems/.gitkeep` | placeholder | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; init's `.gitkeep` rule governs creation |
| `ai-agents/wiki-vault/wiki/tasks/.gitkeep` | placeholder | ADR-005: any repair under `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively; init's `.gitkeep` rule governs creation |

---

## What each path is for — the prose a raw listing cannot carry

### Project root — `CLAUDE.md` and `AGENTS.md` (root context files)

The runtime context files Claude Code and Codex read on every session. Created once from the
scaffold by `install_root_file` (in `claude/fkit-claude-init.sh`), then owned by the project. Each
splits into two regions with **different** conformance rules (design §8):

- **The fkit-managed rules block** — the region strictly between the fkit rules markers. Rewritten
  by `merge_rules` on **every launch**, so it is already self-healing and is **out of repair scope
  entirely**: no check, no repair, ever.
- **The owner-side body** — everything outside the markers. "Conforming" means: the body, hashed
  with the marker-delimited region elided (marker lines kept), matches a version fkit ever shipped
  (see the companion manifest below). A matching body is *untouched-stale at worst* — and an
  untouched-stale body is **eligible for consent-gated replacement** (design §8, ADR-039), with
  the markers and the current fkit-managed block preserved through the rewrite; a body that
  matches nothing was edited by the owner — **report with diff, never touch**.
- **Markers malformed** (begin without end, end without begin, multiple pairs): the elision region
  is unknowable — **refuse to classify** the file and report the malformation, mirroring
  `merge_rules`' own refusal contract. Report-only.
- **Markers absent** entirely: an input-shaping fact, **not a classification** (the 0245
  classification precedence, resolving 0243's accepted residual R3 under its recorded re-raise
  clause). Nothing is elided, the **whole file** hashes against shipped bodies, and the manifest
  verdict decides: a hash that matches a shipped row — the manifest carries whole-file hashes of
  markerless omnigent-era root files — classifies **untouched-stale**; a hash that matches nothing
  classifies **owner-edited** (deleting the markers *is* an owner edit). Report-only either way.

### `ai-agents/` — the working structure's root

The folder tree the fkit agents collaborate on; the tree is generic, its contents are
project-specific. `README.md` here is the orientation document for the whole structure — a
fkit-authored reference file: conforming means its content matches what the installed version
ships (the six-class table above); content matching only an older shipped version is
untouched-stale — repair-eligible per the manifest (design §7, ADR-039), not conforming; content
that matches nothing was owner-edited — report, never touch.

### `ai-agents/knowledge-base/` — durable project knowledge

- `PROJECT.md` — **owner-authored seed**. Ships as an `fkit:uninitialized` placeholder brief that
  project initiation replaces with the real product brief. It is *supposed* to diverge from what
  fkit shipped; conforming means only "it exists". It is never content-checked and never repaired.
- `decisions/`, `history/`, `incidents/`, `reports/` — structural directories for ADRs, historical
  records, incident write-ups, and design reports/specs. They ship empty (a `.gitkeep` each);
  everything inside them in a real project is project content this spec says nothing about.

### `ai-agents/knowledge-base/conventions/` — the project's standing law

Holds the conventions every role reads before non-trivial work and defers to as law. The installed
version requires the eight files listed in Table B: the folder's `README.md` (what a convention is)
plus seven conventions. All are fkit-authored reference files: a missing one is created by launch
convergence; one whose content matches no version fkit ever shipped was edited by the project
owner — report it, never touch it.

### `ai-agents/sprints/` — sprint plans

Sprint plan documents live here; `done/` archives the completed ones. Both ship empty. Structural
directories only — no required files beyond the placeholders.

### `ai-agents/tasks/` — the task boards

`README.md` is the fkit-authored contract for task folders and the three boards; `backlog/`,
`done/`, `cancelled/` are the boards themselves, shipped empty. Task folders inside them are
project content — this spec requires the boards to exist, and says nothing about what they hold.

### `ai-agents/wiki-vault/` — the project wiki (ADR-005 territory, all of it)

**Routing note, in force for every path in this subtree:** wiki *reads* are decentralized, but any
**write or repair** under `ai-agents/wiki-vault/` is **`fkit-wiki`'s exclusively** (ADR-005). A
structure check may verify existence here; it must never fix, rewrite, or create content here
itself — a needed repair is routed to `fkit-wiki` (a consult, or an owner-directed
`/fkit-wiki-ingest`), whatever this spec says the vault should contain.

- `index.md` — the master catalog of wiki pages; `log.md` — the append-only wiki activity log.
  Both are **wiki-authored living files**: they are *supposed* to grow; conforming means only
  "exists".
- `schema.md` — the wiki's structure rules. Also wiki-authored territory; it is the one file here
  whose content *can* be compared to shipped versions, and even that check is **report-only**, with
  any repair routed to `fkit-wiki`.
- `wiki/decisions/`, `wiki/features/`, `wiki/systems/`, `wiki/tasks/` — the page categories, shipped
  empty.

### The 13 `.gitkeep` placeholders

Placeholders exist so empty directories survive git. They have **no content contract** (class
`placeholder`: check "none") and their creation is governed by init's existing `.gitkeep` rule —
documented here, never re-implemented: *a `.gitkeep` is created only when its own directory was
created by that same convergence pass; it is never added to a pre-existing directory* (a user whose
`tasks/backlog/` holds real briefs has likely deleted its `.gitkeep` on purpose —
`claude/fkit-claude-init.sh`, §"THE .gitkeep RULE"). A missing `.gitkeep` in a directory that
already exists is therefore **conforming**, not a defect.

---

## The companion manifest — `structure-manifest.tsv`

This spec's sibling in the share. The division of labor (design §7):

- **This spec decides *what should exist* and what class each path is** — the semantic layer.
- **The manifest decides *touched-or-not*** — a pure data table of every content hash fkit has ever
  shipped per project path, so "stale but pristine" and "owner-edited" can be told apart
  byte-mechanically. Its hashing contract (stated in the manifest's own header, and binding on any
  consumer): normalize CRLF → LF, exactly that transform; for `CLAUDE.md`/`AGENTS.md` only, elide
  the lines strictly between the fkit rules markers, keeping the marker lines; sha256, hex.

Two deliberate asymmetries between the manifest's path set and this inventory:

- The manifest also carries **historical-only paths** — paths fkit shipped at some point and no
  longer does (e.g. `ai-agents/reviews/README.md`). Those are *not* part of the current
  requirement and are deliberately **not** inventory rows here.
- `universal-rules.md` appears in **neither**: it is install-side input to the root files' rules
  block, never a project path — it is never copied into a project (design §4), and it is excluded
  from the manifest by the 0244-ruled scope for the same reason.

---

## What this spec is NOT

This file is a **document, not a mechanism**. It performs no check, no repair, no notice — those
are separate, consent-gated capabilities (design §5–§7; implementation units 4–6), licensed by
ADR-039 with ADR-015's invariant **unchanged and in force**: the unattended launch path never
overwrites, moves, or deletes anything inside a consuming project's `ai-agents/`. Nothing in this
spec instructs any agent to mutate a project; it only defines what "conforming" means so that a
consented, in-session procedure can report — and, only where ADR-039 licenses it and the owner
consents in that session, repair.
