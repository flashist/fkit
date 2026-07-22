# Fix the scaffold — ship the knowledge-base folders its own README promises

## ID
0043

## Sprint
Sprint 2

## Priority
25

## Status
✅ Done

## Owner
fkit-coder

## Context

**The scaffold contradicts itself on day one, and it does so for 100% of projects created from now
on.**

`claude/scaffold/ai-agents/README.md:11` already ships
[ADR-013](../../../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md)'s law,
naming **five** knowledge-base folders — `conventions/`, `decisions/`, `incidents/`, `reports/`,
`history/`. `claude/scaffold/ai-agents/knowledge-base/` creates **one**: `conventions/`. A project
scaffolded today ships with a README instructing its agents to file documents into **four folders that
do not exist on its disk**.

There is a second, independent self-contradiction in the same file. The README's `sprints/` row tells a
new project to name sprint plans **`plan-sprint-N.md`**. The shipped producer skills write
**`sprint-N.md`**, and the file on this repo's disk is `ai-agents/sprints/sprint-2.md`. **The
scaffold's own README disagrees with the scaffold's own skills**, and every new project inherits the
disagreement.

Rationale and evidence:
[`reports/2026-07-14-migration-mechanism.md`](../../../knowledge-base/reports/2026-07-14-migration-mechanism.md)
§3, §4, and follow-up §11.1. The report is emphatic that **this is not a migration problem** — it is a
plain defect in fkit's *current output*, it needs no mechanism, and it is gated on nothing.

**Scope boundary — read this.** This task fixes what **new** projects receive. It does **nothing** for
projects that already exist; those are fixed by task 28 (additive launch convergence). The two are
complementary and independently shippable — ship this one first because it is free and it is today's
bug.

## What to build

### 1. Create the four missing knowledge-base folders in the scaffold

Under `claude/scaffold/ai-agents/knowledge-base/`, add:

| Folder | Ships with |
|---|---|
| `decisions/` | `.gitkeep` |
| `incidents/` | `.gitkeep` |
| `reports/` | `.gitkeep` |
| `history/` | `.gitkeep` |

Empty-with-`.gitkeep` is correct: the folders are *filing destinations*, and their contents are
project-specific. Do not seed them with example documents.

### 2. Add `conventions/README.md`

`claude/scaffold/ai-agents/knowledge-base/conventions/` ships two conventions
(`task-status-vocabulary.md`, `status-report-format.md`) and **no README indexing them**. This repo's
own `ai-agents/knowledge-base/conventions/README.md` exists and is the model — port it, generalized for
a fresh project (it must not carry fkit-specific content). It must list the two shipped conventions and
state the rule that a convention has exactly one home.

### 3. Correct the README's `sprints/` row

In `claude/scaffold/ai-agents/README.md`, the `sprints/` row: **`plan-sprint-N.md` → `sprint-N.md`**.
This aligns the scaffold's README with the shipped skills, which are the authority here — they are what
actually writes the file.

### 4. Housekeeping

`claude/scaffold/ai-agents/knowledge-base/.gitkeep` becomes redundant once the folder has four
`.gitkeep`-bearing children and `PROJECT.md`. Removing it is optional and your call — but if you do,
note it in the commit, because task 28's `.gitkeep` accounting depends on the exact shipped set.

## Verification steps

- `find claude/scaffold/ai-agents/knowledge-base -type d` lists **all five** of `conventions/`,
  `decisions/`, `incidents/`, `reports/`, `history/`.
- `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` exists and names both shipped
  conventions.
- `grep -n 'plan-sprint' claude/scaffold/ai-agents/README.md` returns **nothing**.
- **The end-to-end check that matters:** scaffold a fresh project into an empty directory
  (`claude/fkit-claude-init.sh <tmpdir>`), then confirm **every folder its README names actually exists
  on disk**. Walk the five folders in `<tmpdir>/ai-agents/knowledge-base/` against the README's list.
  The failure this task fixes is precisely "the README promises a path the disk does not have" — so the
  verification has to compare the two, not just eyeball the tree.
- In that fresh project, `git status` after `git init && git add -A` shows the four new `.gitkeep`
  files tracked — i.e. the folders survive a clone.

## Notes

- **Owner: fkit-coder.** Product source under `claude/`.
- **Depends on:** nothing. Unblocked, independent of every other task in this group. Ship today.
- **Blocks:** nothing hard — but task 28 (convergence) is what carries this fix into *existing*
  projects, so landing 25 first means 28's very first run has something worth converging.
- **No ADR.** This is a defect fix. ADR-013 already made the decision; the scaffold simply never
  implemented it.
- **Do not touch `ai-agents/README.md` in this repo.** It has drifted from the scaffold, and the owner
  has **deliberately deferred content drift** (report §3, §12 Q1). That residual is accepted knowingly.
  This task changes the **scaffold**, not this repo's own tree.
- Risk: **low.** Four empty directories, one new README, one word in a table row.
