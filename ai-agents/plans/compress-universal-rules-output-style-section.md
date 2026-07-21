# Plan — Compress the Output style section of `universal-rules.md` (task 79)

**Task:** `ai-agents/tasks/done/compress-universal-rules-output-style-section.md`
**Task ID:** 0022 · **Sprint 2**, priority 79
**Approved:** 2026-07-20 — owner blanket-approved 79's plan at task 85's plan gate.

## The change
Replace **only** the `## Output style (every role, every session)` section of
`claude/scaffold/universal-rules.md` with the verbatim draft supplied in the brief. No other edit.

The saving is **structural, not wordsmithing**: two bullets stated one rule twice with overlapping
enumerations, and the precedence preamble stated its point five ways. They merge.

## Why it matters
`universal-rules.md` is the single source for the marker-delimited block injected into **every**
consuming project's `CLAUDE.md` and `AGENTS.md` on **every launch**. `RULES_MAX=4096` is a
**launch-blocking** cap — overflow is a hard `exit 1`, not a warning.

## Constraints (where the risk actually is)
1. **The defensive prose is scar tissue and must survive.** Prior review R3 — a bullet became the
   nearest antecedent of *"This preference"* and produced a **real misreading**. R4 — the
   load-bearing-term enumeration was kept **knowingly** by the owner alongside the budget warning.
   **A cut that saves bytes by dropping a qualifier is a regression.** If the draft does not fit a
   constraint found at build time, **raise it — do not trim a qualifier to make the numbers work.**
2. **A review pass is required, not optional** (R3 is direct precedent for a compression-shaped
   clarity regression slipping through this exact section).
3. **Do not touch `## Universal hard rules`.**
4. **Verify the dual-home question with `find`** — do not trust the brief's note.
5. **Do not change `RULES_MAX`.** Raising the cap is not the fix.

## Verification
Source size; **emitted block** size and headroom (measure the emitted block, not the source);
`npm test` incl. `rules-block-budget.test.js`; a launch regenerating both `CLAUDE.md` and `AGENTS.md`
with no `exit 1`; and the **semantic diff** — every rule present before present after — walked
side by side and stated explicitly.

## Explicitly NOT in scope
The **ADR-030 prose addition** (~430 B) — a separate, later, not-yet-filed brief, sequenced *after*
this one, touching the same file and likely the same section. Do not fold it in, and do not let the two
land in one review. No hook code. No `RULES_MAX` change. No edit to `## Universal hard rules`.
