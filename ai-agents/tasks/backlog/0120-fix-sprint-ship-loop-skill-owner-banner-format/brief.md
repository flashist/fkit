# Fix the `fkit-sprint-ship-loop` SKILL.md owner-banner format

## ID
0120

## Sprint
Sprint 2

## Priority
102

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

`claude/skills/fkit-sprint-ship-loop/SKILL.md` (built in 0111) opens its body with a bare heading
`# ⛔ Owner: the lead` (line 8) **before** the standard `> ## ⛔ Owner: the **lead**` blockquote (line
10). Every other skill uses a real title heading followed by the blockquote form — e.g. the sibling
`claude/skills/fkit-task-ship-loop/SKILL.md` reads `# Task Ship-Loop (coder side)` then
`> ## ⛔ Owner: the **coder**`. The sprint-ship-loop instead duplicates the owner banner as its H1,
which reads oddly and diverges from the house convention.

**Purely cosmetic.** It does **not** affect the ADR-018 skill-ownership hook — the hook keys off
`skills_for_role()` in `claude/skills-for-role.sh`, not banner text. No behavior changes.

## What to build

Bring the SKILL.md header into line with the sibling convention:

- Replace the bare `# ⛔ Owner: the lead` H1 (line 8) with a proper descriptive title heading in the
  sibling style (e.g. `# Sprint Ship-Loop (lead side)`).
- Keep the existing `> ## ⛔ Owner: the **lead**` blockquote banner (line 10) as-is — that is the
  correct, house-standard form.
- Refresh the `.claude/` mirror via the normal init path if needed (the mirror is a gitignored copy;
  edit the canonical `claude/` source only).

## Verification steps

1. `claude/skills/fkit-sprint-ship-loop/SKILL.md` has a descriptive H1 title (not the owner banner) as
   its first body heading, matching the `fkit-task-ship-loop` sibling pattern.
2. The `> ## ⛔ Owner: the **lead**` blockquote is present and unchanged.
3. No functional change: `skills_for_role()` and the ADR-018 hook are untouched; the skill still resolves
   to the lead only.

## Notes

- **Owner:** fkit-coder (a SKILL.md source edit).
- **Independent:** no dependency on 0118 or 0119 — a standalone cosmetic fix. Can ship any time.
- **Low priority / cosmetic** — filed as its own small unit because no existing arc task touches this
  file's banner; fold it into any batched doc-consistency pass if the owner prefers.
- No commit — leave the edit in the working tree.
