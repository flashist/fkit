# Fix the scaffold producer-row mirror omission — add `/fkit-task-brief` + regenerate the manifest

**Source**: `ai-agents/tasks/done/0250-fix-the-scaffold-producer-row-fkit-task-brief-omission/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P9` · ID 0250 · owner `fkit-coder` · shipped 2026-08-23

## Goal

`claude/scaffold/CLAUDE.md:23`'s producer row omitted `/fkit-task-brief`. The producer's skill set is declared canonically in `skills_for_role()` (`claude/skills-for-role.sh:51`) and mirrored in four human-readable checklists; **only the scaffold's row was wrong**, so ⚠️ **every consuming project scaffolded from it shipped a false role table**.

Surfaced as finding **R10 of `0245`'s stateful review** — verified pre-existing against HEAD, so `0245` correctly did not widen its own scope to fix it. Owner ruling 2026-08-07, verbatim label *"File as own task (Recommended)"*.

⭐ **The manifest regen is inseparable, and that was proved rather than argued.** `claude/scaffold/CLAUDE.md` is manifest-hashed; a content edit without `npm run generate:manifest` turns `test/structure-manifest.test.js` red. The build captured the red window before regenerating.

## Key Changes

Exactly two files.

| File | Change |
|---|---|
| `claude/scaffold/CLAUDE.md` | line 23, producer row: `` `/fkit-task-brief`, `` inserted after `` `/fkit-status`, ``. One line rewritten. |
| `claude/structure-manifest.tsv` | regenerated — **one added row, zero deletions** (`1d9a7e3b…` ↔ `CLAUDE.md`); 88 → 89 lines. |

⭐ **The insertion point deliberately does NOT follow `skills_for_role()` order.** The brief's positional instruction was self-inconsistent — the scaffold row puts `/fkit-status` second where canonical puts it fifth. Plan §1d resolved it by matching the nearest twin, `claude/skills/fkit-team/SKILL.md:54`, character-for-character. **No reordering was done.**

### Red-then-green, captured

Pre-regen: `test/structure-manifest.test.js` → `tests 5 / pass 3 / fail 2` — assertion **A** (*"the manifest is STALE"*, committed 8182 B vs regenerated 8257 B) and assertion **D** (*"the CURRENT scaffold CLAUDE.md does not match its own manifest"*). Post-regen: 5/5.

⚠️ **The plan predicted a red at A only; D also failed.** Same root cause, same regen fixed both — *"incomplete, not wrong"*, and recorded rather than absorbed.

### Verification

`npm test` → **730/730, 0 fail** (baseline held); `test/prove-red.sh` → `✓ hard gate PASSED`. All five carriers now agree on the producer's six skills.

## Outcome

**Review round 1: 0 defects in the change surface.** Reviewers: `fkit-reviewer` + Codex via `codex exec --sandbox read-only`; **Codex coverage FULL** on every review angle, with its own test-execution sub-check partial (the read-only sandbox refused `mkdtemp`) — a gap independently covered by the reviewer's own unsandboxed run, ⛔ **not a coverage hole in the verdict**.

### ⭐ Its most valuable find was about a *different* task

**R1 (medium):** this change **silently discharges `0188`'s defect D1** — the same omission, `0188`'s own *"highest of the five"* — and three live records still asserted D1 as open. ⛔ **The hazard is concrete: a later `0188` run reading D1 as still-open would "repair" the row by reordering it to `skills_for_role()` order and undo this task's deliberate choice.** The remedy was fenced out of this diff (producer-owned files) and filed as task `0324`, which the owner then ruled be written the same session (*"Apply the correction now (Recommended)"*).

⚠️ **The landing check took TWO measurements and they disagreed** — a producer was writing the remedy concurrently. Measurement 1 found nothing landed; measurement 2, minutes later, found it complete and verified **by reading the text, not by hit-counting**. ⭐ **Both are recorded in the ledger, not just the favourable one.**

### Two dated corrections against the reviewers' own rows

- ⚠️ **R2's *"stayed green throughout the **years**"* is FALSE — there are no years.** Re-measured: repo first commit `db49851` **2026-07-03**; the repo is **51 days old**; the true green-while-wrong window is **38 days** (2026-07-16 → 2026-08-23). Severity, classification and disposition unchanged — the finding never depended on the duration.
- ⚠️ **R1's *"concrete regression risk"* OVERSTATES the blast radius.** Nothing parses the list positionally. The real cost is wasted work, an undone deliberate choice, and **permanent manifest churn** (the manifest is append-only by design). ⭐ One nuance cuts *toward* safety: a reorder landed without a regen is **loud, not silent** — assertion A goes red. **Severity stays `medium`.**

### Accepted residuals — both open

1. ⛔ **Nothing mechanically enforces scaffold-mirror ↔ `skills_for_role()` agreement**, so this omission class can recur undetected. The hook test's `OWNED` oracle is a deliberately hard-coded mirror too; `test/structure-manifest.test.js` checks byte-equality only, never role-table semantics. Owner: *"Accept as residual (Recommended)"*. Owned elsewhere by open `0189` / `0137`.
2. **Producer skill-list ordering is not normative** — six carriers, **two different orderings**, all six skills. Owner: *"Accept — order is not normative (Recommended)"*. ⭐ **This ledger entry is the durable home of that ruling** — a producer measured that the phrase existed nowhere but this task's own plan proposing it, so the ruling had been relayed and never landed. ⛔ It **specifically pre-empts** the `0188` reorder hazard.

## Related
- [[tasks/repair-the-five-live-ownership-fact-defects]] — `0188`, whose D1 this change discharged silently
- [[tasks/record-that-0250-discharged-0188s-d1-and-warn-off-the-reordering]] — `0324`, the correction note R1 required
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why the coder could not move `0324`'s folder
- [[systems/role-locked-sessions]] — where the canonical `skills_for_role()` role→skill declaration lives
- [[tasks/repair-the-moved-folders-own-self-locators-in-task-done]] — *added 2026-08-29:* `0325`, whose rule this task's folder is the worked specimen for — **seven occurrences splitting 2 repair / 5 freeze**, carrying both of the traps the rule must not fall into
