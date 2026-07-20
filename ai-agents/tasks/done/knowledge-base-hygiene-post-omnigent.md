# Knowledge-base hygiene after the Omnigent removal

## ID
0059

## Sprint
Sprint 2

## Priority
10 (Phase 5a)

## Status
✅ Done

## Context

Per the Omnigent-removal plan (`plan-omnigent-removal-2026-07-11.md`, itself filed by this task)
§Phase 5 and §D.

**The governing principle: archive, don't delete.** Nothing here is destroyed; everything is filed.

**Timing matters.** This runs in Phase 5, **not earlier** — an ADR should not claim to be superseded
while the code it describes is still shipping.

> ## ⚠️ Rewritten 2026-07-13 — §2 and §3 are superseded by ADR-013
>
> **This brief originally improvised its own routing rule**, and it was wrong. It sent an evaluation,
> a verification, the audit, the plan **and the 2026-07-10 incident** into `history/` — which would
> have **emptied `incidents/` on the day it was formalized**, and mis-filed four records as superseded
> designs.
>
> [ADR-013](../../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md)
> (task 9) now governs. The correcting principle: **records don't go stale, designs do.** An audit, a
> verification, an evaluation, a plan, an incident — none of them become *false* when the system they
> describe is removed. They stay true; they happened. `history/` is for **superseded design docs
> only** ([ADR-002](../../knowledge-base/decisions/adr-002-archive-pre-omnigent-design-docs.md)), and
> it stays closed at the four it already holds.
>
> **Execute the table below. Do not re-derive it.**

## What to build

**1. Mark ADRs superseded — keep every file.**

- Mark **ADR-003, 004, 005, 006, 007** as `superseded — Omnigent removed`.
- **Delete nothing.** Honest numbering matters. **ADR-008 in particular is the record of _why fkit
  left Omnigent_** — it is already marked superseded, and it **stays**. Stripping it invites someone
  to re-litigate a decision that has already been paid for.
- **ADR-001 — mark `superseded by ADR-011`.** *(Changed 2026-07-13: this brief previously said "stays
  open — do not touch its status." That is stale. The owner ruled on 2026-07-11 that `package.json`
  stays with its `scripts`, and
  [ADR-011](../../knowledge-base/decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md)
  was recorded. The question below is **closed** — do not re-raise it.)*

**2. File the six loose root documents into `reports/`.**

Use `git mv` — preserve history. Renamed date-first to match the `incidents/` convention; they are
moving anyway, so the rename is free.

| From (knowledge-base root) | To |
|---|---|
| `restart-skill-verification-2026-07-10.md` | `reports/2026-07-10-restart-skill-verification.md` |
| `eval-vendored-query-skill-distribution.md` | `reports/2026-07-10-eval-vendored-query-skill-distribution.md` |
| `doc-drift-audit-2026-07-11.md` | `reports/2026-07-11-doc-drift-audit.md` |
| `plan-omnigent-removal-2026-07-11.md` | `reports/2026-07-11-plan-omnigent-removal.md` |
| `onboarding-verification-2026-07-12.md` | `reports/2026-07-12-onboarding-verification.md` |
| `tester-agent-evaluation-2026-07-13.md` | `reports/2026-07-13-tester-agent-evaluation.md` |

*(`eval-vendored-query-skill-distribution.md` carries no date in its name; **2026-07-10** is its
first-commit date, verified by fkit-architect via `git log --diff-filter=A`.)*

**3. Two things that do NOT move.**

- **`incidents/2026-07-10-subagent-runners-disconnected.md` STAYS PUT.** It is a record of something
  that happened. It does not stop having happened because Omnigent is gone. If it risks being read as
  *current*, the fix is **a banner line inside the document**, not a move.
- **`history/` gains nothing.** It stays closed at its four superseded design docs.

**4. Repair the inbound links — ~30 sites.**

Moving six documents breaks every reference to them. fkit-architect inventoried these (2026-07-13);
**verify the list against the tree before starting, as it may have grown:**

- **ADRs:** `adr-007:29,123` · `adr-009:22,131` · `adr-010:130`
- **Sprints:** `sprints/sprint-2.md:12,13,39` · `sprints/done/sprint-1.md:15`
- **Task briefs:** `backlog/decide-whether-fkit-needs-a-tester-agent.md:29,98,145` ·
  `backlog/wiki-sync-post-omnigent.md:15` · **this brief** · `done/build-claude-self-update.md:15` ·
  `done/delete-omnigent-directory.md:15` · `done/extract-scaffold-into-claude.md:15` ·
  `done/make-codex-a-checked-prerequisite.md:15,50` ·
  `done/reconcile-skill-ownership-source-of-truth.md:15` · `done/rewrite-docs-post-omnigent.md:15,16` ·
  `done/rewrite-installer-single-flavor.md:15`
- **Internal (doc-to-doc):** `plan-omnigent-removal-2026-07-11.md:10,209,210` ·
  `tester-agent-evaluation-2026-07-13.md:232`

**This is the bulk of the task.** The moves are six `git mv`s; the link repair is thirty edits, and a
broken link in an ADR is how a decision quietly becomes unfindable.

## Verification steps

- **The acceptance test — `ls ai-agents/knowledge-base/*.md` returns exactly `PROJECT.md` and
  `architecture.md`.** Nothing else. This is ADR-013's own checkable form of the root rule.
- Every ADR file still exists. None deleted.
- ADRs 003–007 read `superseded — Omnigent removed`; ADR-008 still marked superseded; **ADR-001 reads
  `superseded by ADR-011`**.
- `incidents/` still contains the 2026-07-10 incident. `history/` still contains exactly its four
  superseded design docs — **no new arrivals**.
- **No broken links.** Every path in the §4 list resolves. Check by following them, not by reading the
  diff.
- No live doc still presents Omnigent as a supported runtime.

## Notes

- Owner: **fkit-architect** (ADR status is the architect's authority — the plan assigns this
  explicitly). The **producer** owns the tasks/sprints reset; the **wiki agent** owns the vault.
- **Depends on:** Phase 2 (`delete-omnigent-directory` — done) and task 9
  (`formalize-knowledge-base-incidents-folder`), which establishes the conventions this task
  **executes**. Task 9 decides; task 10 files. **Do not re-decide anything here.**
- **Blocks:** the wiki sync (task 11). ADR-013 is a new ingest source for it, and
  `wiki/systems/fkit.md:16` still describes a knowledge base with no `conventions/`, `incidents/`, or
  `reports/`.
- **Independent of task 19** (`repair-knowledge-base-paths-in-product-source`) — that one fixes the
  `conventions/` paths inside `claude/`; this one moves the reports. Different files, either order.
- Risk: **low in mechanism, moderate in volume.** Six file moves are trivial; thirty link repairs are
  where a mistake hides. The acceptance test (`ls` returns two names) catches a missed move; only
  following the links catches a missed link.
