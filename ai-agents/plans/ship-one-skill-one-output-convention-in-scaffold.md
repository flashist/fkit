# Plan — Task 48: ship the one-skill-one-output convention in the scaffold

_Approved by the owner via the task-ship-loop plan gate (2026-07-17). This is the durable autonomy
boundary the loop's changes are measured against (ADR-020)._

## Context

Task 47 recorded the "one skill, one output" convention in **this repo's live** knowledge-base
(`ai-agents/knowledge-base/conventions/one-skill-one-output.md`), but the **scaffold** every consuming
project receives (`claude/scaffold/ai-agents/knowledge-base/conventions/`) still ships only the three
older conventions. Consequence: a fresh fkit install never receives the rule. 4th live-vs-scaffold gap
(task 49 investigates the recurring cause; this task closes this instance and does not wait for it).

## Key decision — de-repo-specify, don't byte-copy (follow the shipped precedent)

The brief's verification wording ("diff is exactly those links and nothing else") didn't anticipate how
repo-specific the live document is (Sprint-2 / task-38/41/44 refs, a `## History` and `## Provenance`
section, `claude/skills/*` paths). The brief's controlling instruction — *"follow whatever precedent the
three already-shipped conventions set"* — points to full **de-repo-specification**: the three siblings
replace dated-incident intros with a generic "starting convention, yours to amend" blurb, generalize
`## Where this must be enforced` → `## Where this is enforced`, drop `## Provenance`, and keep links only
to sibling convention files. Approach (B) de-repo-specify was approved over (A) byte-copy.

## Files to change (only under `claude/scaffold/`)

1. **New** `claude/scaffold/ai-agents/knowledge-base/conventions/one-skill-one-output.md` — a
   de-repo-specified adaptation of the live doc:
   - Keep title, top blockquote **rule** (3 lines), `## The rule`, `## Operands are not variants — the
     litmus test` (+ table, minus the "(Per task 44's brief.)" parenthetical), `## The escape hatch`.
   - Replace the blockquote's provenance paragraph with the generic scaffold "starting convention" blurb.
   - Replace `## History — recorded honestly` with a short generalized rationale (owner's-call lesson,
     no task numbers/dates/sprints).
   - Rename `## Where this must be enforced` → `## Where this is enforced`, generalize bullets (skill
     names not `claude/skills/` paths), drop the self-referential scaffold bullet.
   - Drop `## Provenance`. Result: no repo-specific links/refs.
2. **Edit** `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` — add the index row
   mirroring the live README; fix the preamble count "Three" → "Four".

No file outside `claude/scaffold/` is modified.

## Verification
- Scaffold conventions dir contains the file; README indexes it; count reads "Four".
- grep the new file for `]( / task N / Sprint N / 2026- / OQ / claude/` → zero repo-specific refs.
- Clean-init into a scratch dir → all four conventions + README lists four.
- Convergence into a scratch project missing the file → file created, announced; pre-existing README untouched.
- `git status` shows only the two scaffold paths. Loop does not commit.
- Caveat: scaffold prose; `node --test` proves nothing about content — init/convergence checks are the real verification.
