# Knowledge-base hygiene after the Omnigent removal

## Sprint
Sprint 2

## Priority
10 (Phase 5a)

## Status
🔲 Backlog

## Context

Per the Omnigent-removal plan
([`plan-omnigent-removal-2026-07-11.md`](../../knowledge-base/plan-omnigent-removal-2026-07-11.md))
§Phase 5 and §D.

**The governing principle: archive, don't delete.** `ai-agents/knowledge-base/history/` already
exists for exactly this, by the precedent of
[ADR-002](../../knowledge-base/decisions/adr-002-archive-pre-omnigent-design-docs.md) — *"archive
superseded design docs, don't leave them at root."* Reuse it.

**Timing matters.** This runs in Phase 5, **not earlier** — an ADR should not claim to be superseded
while the code it describes is still shipping.

## What to build

**1. Mark ADRs superseded — keep every file.**

- Mark **ADR-003, 004, 005, 006, 007** as `superseded — Omnigent removed`.
- **Delete nothing.** Honest numbering matters. **ADR-008 in particular is the record of _why fkit
  left Omnigent_** — it is already marked superseded, and it **stays**. Stripping it invites someone
  to re-litigate a decision that has already been paid for.
- **ADR-001 stays _open_** — see the open question below. Do not touch its status.

**2. Move Omnigent-only working docs to `history/`:**

- `eval-vendored-query-skill-distribution.md` → `history/`
- `restart-skill-verification-2026-07-10.md` → `history/`
- `incidents/2026-07-10-subagent-runners-disconnected.md` → `history/` — this is an **Omnigent**
  incident (subagent runners dying), describing failure modes that no longer exist on the Claude path.

**3. Retire the removal working docs** once the sprint is done — `plan-omnigent-removal-2026-07-11.md`
and `doc-drift-audit-2026-07-11.md` were written to be *consumed and discarded*. Move them to
`history/` too, rather than leaving them at root implying live work.

## ⚠️ Open question for the owner — ADR-001

**ADR-001 (`package.json` stays metadata-only) is currently falsified by the repo.** `package.json:4-9`
has the `scripts` block the ADR says does not exist, and the ADR's own *"re-raise only if"* trigger
has therefore fired.

This **needs a decision, not a cleanup** — and it is out of scope for this task. Do not quietly fix
either side to make them agree. Flag it and leave it. (Related: the plan puts anything about
`npx fkit` / `package.json` semantics explicitly out of scope for the whole removal.)

## Verification steps

- Every ADR file still exists. None deleted.
- ADRs 003–007 read `superseded — Omnigent removed`; ADR-008 still marked superseded; **ADR-001
  untouched and still open**.
- `history/` contains the three Omnigent-only docs; nothing in the live knowledge-base root refers to
  them as current.
- No live doc still presents Omnigent as a supported runtime.

## Notes

- Owner: **fkit-architect** (ADR status is the architect's authority — the plan assigns this
  explicitly). The **producer** owns the tasks/sprints reset; the **wiki agent** owns the vault.
- **Depends on:** Phase 2 (`delete-omnigent-directory`) and `formalize-knowledge-base-incidents-folder`
  — §D's use of `history/` and `incidents/` depends on those conventions being settled first.
- **Blocks:** the wiki sync (Phase 5b).
- Risk: **low.**
