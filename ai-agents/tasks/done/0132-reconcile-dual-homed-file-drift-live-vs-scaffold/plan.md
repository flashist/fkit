# Plan — 0132 Reconcile the dual-homed file drift

**Approved by the owner 2026-08-01** via `AskUserQuestion` in the `fkit-lead` driver session, under
`/fkit-sprint-ship-loop`. Three rulings were signed alongside it (see `worklog.md` §Owner decisions).

## The finding that reshaped the task

The brief assumes two kinds of dual-homed file, matching the convention's litmus: **fkit-authored**
(✅ must be byte-identical) and **project-specific** (⛔ never sync). The sweep found **three**. Nine
files differ between the homes; five of them are neither — they are the *same document*, deliberately
rewritten in the scaffold for a consuming reader (fkit's incident narratives, task/ADR provenance and
relative links into `tasks/`/`sprints/` stripped on purpose). Byte-aligning them, which the brief's
literal reading demands, would ship broken links and fkit-internal history into every consuming
project.

The owner **rejected** byte-aligning (Option A) as a product regression, and chose **Option B** —
recognize "audience-adapted" as a third kind, record it with per-file reasons, and keep byte-parity
enforced on the genuinely-identical set.

## Steps

1. **Write `test/dual-home-parity-exceptions.mjs`** — the real deliverable per the brief
   (*"The exception list is the real deliverable, not the file copy"*). A plain ES module exporting an
   array of `{ path, kind, reason }`, plus a `findException()` helper 0133's test consumes.
2. **Update `conventions/dual-home-parity.md`** — add the human-readable mirror table pointing at the
   module as authoritative; delete the "Known drift at the time of writing" snapshot (the document
   itself says to delete it once reconciliation lands); fix the stale `reviews/README.md` row; fix the
   prescribed check command, which was structurally blind to missing-from-scaffold drift.
3. **Ship `dependency-declaration-form.md` to the scaffold** — **generalized**, not byte-identical, per
   owner ruling 2.
4. **Update `conventions/README.md` in both homes** — live index gains the new convention; scaffold
   index gains it and its "Six conventions ship with the scaffold" count becomes seven.
5. **Verify** — fresh `diff -rq` classified against the module; `node --test test/*.test.js`;
   `bash test/prove-red.sh`; regression check that `dual-home-parity.md` is still absent from the
   scaffold.

## The exception list (as approved)

| path | kind |
|---|---|
| `knowledge-base/conventions/dual-home-parity.md` | fkit-repo-only |
| `knowledge-base/conventions/README.md` | index |
| `knowledge-base/PROJECT.md` | placeholder |
| `wiki-vault/index.md`, `wiki-vault/log.md` | placeholder |
| `knowledge-base/architecture.md` | live-only |
| `README.md`, `conventions/{task-status-vocabulary,one-skill-one-output,evidence-before-assertion,status-report-format,dependency-declaration-form}.md` | audience-adapted, **one entry each with its own specific reason** |
| `knowledge-base/{decisions,history,incidents,reports}/`, `sprints/`, `tasks/{backlog,done,cancelled}/`, `wiki-vault/wiki/` | project-content-dir |
| `.fkit/`, `tasks/backlog/.fkit`, `wiki-vault/.fkit`, `wiki-vault/.wiki-watermark`, `knowledge-base/.gitkeep` | runtime-state |

**Enforced (byte-identical today, must stay so):** `conventions/priority-is-rank-not-identity.md`,
`conventions/task-owner-vocabulary.md`, `tasks/README.md`, `wiki-vault/schema.md`.

## Out of scope — deliberately

- **Amending ADR-027.** Its "six drifted files" figure is stale *in kind*; correcting an ADR is an
  architect/owner act. Named as a follow-up, not done here.
- **Editing task 0178's brief.** Its contested home page resolved in 0178's favour; the brief is the
  producer's to edit.
- **Committing anything.** Edits stay in the working tree.
