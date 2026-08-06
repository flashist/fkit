# Make `/fkit-wiki-sync` count and classify its own diff before writing its `log.md` entry

## ID
0231

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ✅ RULED by the owner — 2026-08-06, `AskUserQuestion`, live `fkit lead` session

Selected answer, **verbatim**: **"File a brief for it"**.

### Severity: LOW — stated up front, not buried

**No reader-actionable fact was affected.** No link target was lost and no body prose was deleted. What
was wrong was the sync's **description of its own work** in `log.md`. The vault itself is **already
corrected** — this brief is a skill fix, **not** a vault repair. Do not scope vault edits into it.

### The evidence — from a `/fkit-wiki-lint` run, 2026-08-06

Two claims in the preceding sync's `log.md` entry did not survive checking:

| The entry claimed | What the diff actually showed |
|---|---|
| *"6 created, 31 updated"* | **30 tracked pages updated.** (The "33" figure relayed separately was the raw modified-file count, which includes `index.md`, `log.md` and `.wiki-watermark` — not tracked pages.) |
| *"every edit to an existing page is additive"* | **4 `## Related` bullets and 3 `index.md` bullets were replaced, not appended.** No link target lost, no body prose deleted — but the claim is **stronger than the diff supports**. |

The lint **appended a dated correction** rather than editing the entry, because `log.md` is append-only
with no exceptions (owner ruling 2026-08-03, task `0211`).

### Root cause, as the lint named it

**The sync skill does not count and classify its own diff before writing its log entry.** Verified
against `claude/skills/fkit-wiki-sync/SKILL.md` on 2026-08-06:

- **Step 7 — *Update the watermark and log*** hands the run a template containing
  `Changed source files detected: N` and a per-file `created/updated` line, and
- **Step 8 — *Report*** asks for *"N source files changed, M pages created, K pages updated"*,

but **no step anywhere instructs the run to derive N, M or K from the actual diff**, and **no step asks
it to classify an edit as additive versus replacing**. The numbers and the additivity claim are produced
from the run's recollection of what it did, not measured from what it wrote. That is exactly the failure
mode observed.

### Overlap with `0213` — checked, and there is none

**Checked before filing, as required.** Task `0213` (*give the next lint a procedural reason to read
`log.md`'s correction notes*, owner fkit-coder, backlog) is a **different skill in the opposite
direction**: it adds a **read** step to `claude/skills/fkit-wiki-lint/SKILL.md` so a specimen exemption
parked in `log.md` is found by procedure. This task adds a **measure-and-classify** step to
`claude/skills/fkit-wiki-sync/SKILL.md` before it **writes**. Different file, different skill, different
verb. **They are complementary, not overlapping** — `0213` makes corrections findable; `0231` reduces how
often a correction is needed. Neither blocks the other and they can ship in either order.

## What to build

Add a measurement step to `claude/skills/fkit-wiki-sync/SKILL.md`, positioned **before** step 7 writes
the `log.md` entry.

1. **Measure, do not recall.** The run derives its figures from the actual working-tree diff of
   `ai-agents/wiki-vault/` — not from its own memory of the files it touched.
2. **Count tracked pages, and say so in the label.** The figure that belongs in the log entry is
   **tracked wiki pages**, excluding the vault's own machinery — `index.md`, `log.md`,
   `.wiki-watermark`. Where a raw modified-file count is also reported, it must be **labelled as such**
   so the two can never be confused again. Conflating them is precisely what produced "31" for a true
   30.
3. **Separate created from updated** by measuring, so `M` and `K` are independently derived rather than
   split by recollection.
4. **Classify each edit as additive or replacing**, and require the log entry's wording to match what was
   measured. An **additivity claim may only be written when the diff shows no removed lines** on tracked
   pages. If any line was replaced, the entry says so, with the count — as in *"4 `## Related` bullets
   and 3 `index.md` bullets replaced"*.
5. **Do not let a blanket claim be written unverified.** The phrase *"every edit to an existing page is
   additive"* is a measurable assertion; the skill must either prove it or not make it.
6. **Refresh the gitignored `.claude/skills/fkit-wiki-sync/` mirror** and `diff` it against the canonical
   source in `claude/`.

**Out of scope, explicitly:** repairing `ai-agents/wiki-vault/log.md` — already corrected by the lint —
and any other vault content. `ai-agents/wiki-vault/` is the fkit-wiki agent's exclusive write surface;
this task edits **only** the skill file under `claude/` and its mirror.

## Verification steps

1. `claude/skills/fkit-wiki-sync/SKILL.md` contains a measurement step ordered **before** the `log.md`
   append in step 7. Show it by diff and state its position relative to step 7.
2. The step names the exclusion set — `index.md`, `log.md`, `.wiki-watermark` — and distinguishes
   **tracked pages** from **raw modified files** in the labels it requires.
3. The step requires created and updated counts to be **derived from the diff**, and the skill's prose no
   longer permits either to be written from recollection.
4. The additivity rule is present and conditional: the claim may be written **only** when the diff shows
   no removed lines on tracked pages; otherwise the replaced count is stated.
5. **Replay the 2026-08-06 case against the new procedure.** Following the step as written against that
   sync's diff must yield **30 tracked pages updated**, not 31, and must **refuse** the blanket
   additivity claim, naming the 4 `## Related` and 3 `index.md` replaced bullets. If the diff is no longer
   reconstructable, say so plainly rather than asserting the replay passed.
6. `diff` the `.claude/skills/fkit-wiki-sync/` mirror against `claude/skills/fkit-wiki-sync/`; no
   difference.
7. `git status --porcelain ai-agents/wiki-vault/` shows **no** change from this task — the vault is not
   this task's write surface.
8. `node --test test/*.test.js` is green. ⚠️ **This proves no regression, not the change** — no test reads
   `SKILL.md` body prose at runtime (task 0136's guard covers frontmatter only).

## Notes

- **Owner:** fkit-coder — the skill lives in `claude/skills/fkit-wiki-sync/`. **The task is a skill edit
  under `claude/`, so it is not the wiki role's**, despite being about the wiki.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Related, not blocking:** `0213` — see the overlap check in `## Context`. Complementary; either order.
- **Owner ruling of record:** 2026-08-06, `AskUserQuestion`, live `fkit lead` session — *"File a brief for
  it"*.
- **Source:** a `/fkit-wiki-lint` run, 2026-08-06, which appended the dated correction to `log.md` rather
  than editing it — `log.md` is append-only with no exceptions (owner ruling 2026-08-03, task `0211`).
- **⚠️ Severity is low and the brief says so.** No reader-actionable fact was affected. This is about the
  sync describing its own work accurately, which matters because that description is what a later lint
  and a later reader trust.
- **⚠️ Beware the self-invalidating measurement.** `log.md` has recorded this defect class more than once:
  writing a correction changes what a re-run of the same scan measures. Any count this skill emits must
  state what it counted and when, not imply a live figure.
- **Sibling briefs filed the same day:** `0229` and `0230`.
- No commit — leave the edit in the working tree.
