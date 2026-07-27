# Correct `CLAUDE.md`'s stale `skills_for_role()` location

## ID
0151

## Sprint
Sprint 2

## Priority
123

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

The repo-root `CLAUDE.md` names the wrong file as the home of the single source of truth for
role→skill ownership.

**Verified against the tree 2026-07-26** (every claim below was re-checked, not copied from the
report that surfaced it):

| Site | What it says today | True? |
|---|---|---|
| `CLAUDE.md:43` | *"Role→skill ownership is declared in exactly one place: `skills_for_role()` in `claude/fkit-claude.sh`."* | **No** — the function moved out of that file |
| `claude/skills-for-role.sh` | the file exists; `skills_for_role()` is defined here | — |
| `claude/fkit-claude.sh:257` | `. "$here/skills-for-role.sh"` — it merely **sources** the definition | — |
| `claude/fkit-claude.sh:253-254` | comment: *"the source of truth (moved to `skills-for-role.sh`, task 43, so the `PreToolUse` hook can source it without pulling …)"* | the move is task **43** / **ADR-018** |

**Why it matters — record this, it is the reason the task exists.** `CLAUDE.md` is injected into
**every fkit session**, so every role in every session is currently told the wrong file. That includes
the lead session that surfaced this. It is a one-line prose error on the most-read file in the repo.

**Do not inflate the severity.** The pointer misdirects by **one hop**, not into a wrong edit:
`claude/fkit-claude.sh:253-254` documents the move in a comment right above the `source` line, so a
reader who follows the stale pointer lands next to the correction. The cost is wasted reading and a
weakened claim of "exactly one place", not a broken change.

**`CLAUDE.md:43` is the only live site that still says this.** The two sibling docs are already
correct, and were checked:

- `claude/README.md:41-42` — *"`skills_for_role()` in `skills-for-role.sh`, sourced by both
  `fkit-claude.sh` and the `PreToolUse` skill-ownership hook"* ✅
- `ai-agents/knowledge-base/architecture.md:154-156` — *"`skills_for_role()` at
  `claude/skills-for-role.sh:35`"* ✅

ADRs that cite the old path (ADR-010, ADR-012, ADR-014) are **dated records of their own moment** and
are **out of scope** — do not touch them. ADR-018 is the decision that moved the function.

**`CLAUDE.md:43` sits OUTSIDE the fkit-managed block.** The generated block starts at
`<!-- fkit:begin-rules -->` on `CLAUDE.md:45`; line 43 is hand-written project prose. So this is a
normal file edit, **not** a `universal-rules.md` regeneration, and editing
`claude/scaffold/universal-rules.md` would be wrong. Confirmed 2026-07-26: `grep -rn skills_for_role
claude/scaffold/` returns **nothing** — no scaffold copy carries the claim, so there is no dual-home
twin to keep in step.

## What to build

A one-line prose correction in **one file**.

1. **`CLAUDE.md:43`** — point at `claude/skills-for-role.sh` as the home of `skills_for_role()`.
   Preserve the *"declared in exactly one place"* framing; that claim is still true, only the filename
   was wrong. Optionally note that `claude/fkit-claude.sh` sources it, matching `claude/README.md`'s
   wording — but keep it to one sentence; `CLAUDE.md` competes for context budget in every session.
2. **Change nothing else in `CLAUDE.md`.** Not the ADR-012 paragraph above it, not the `⛔ Owner:`
   banner sentence, and **nothing between `<!-- fkit:begin-rules -->` and `<!-- fkit:end-rules -->`** —
   that block is regenerated on every `fkit` launch and any edit inside it is overwritten.
3. **Do not touch `claude/README.md` or `architecture.md`** — both already correct; re-editing them
   risks introducing the drift this task removes.
4. **Do not touch any ADR.**

## Verification steps

1. `grep -n "skills_for_role" CLAUDE.md` names `claude/skills-for-role.sh`, and no longer names
   `claude/fkit-claude.sh` as the file the function is *declared in*.
2. The corrected sentence agrees with `claude/README.md:41-42` and
   `ai-agents/knowledge-base/architecture.md:154-156`. Read all three and confirm they now say the
   same thing.
3. `claude/skills-for-role.sh` really does define `skills_for_role()`, and `claude/fkit-claude.sh:257`
   really does source it — re-verify at implementation time; both line numbers may have moved.
4. The edit is **outside** the `<!-- fkit:begin-rules -->` … `<!-- fkit:end-rules -->` markers. A diff
   touching a line inside them has exceeded this task.
5. `git diff --stat` shows **one file** changed. Any second file means scope crept.
6. The rules-block byte budget test (`test/rules-block-budget.test.js`) is unaffected — this edit is
   outside the block. Run the suite anyway and confirm no regression.

## Notes

- **Owner:** fkit-coder — a source-tree docs edit.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Source:** surfaced during **task 0120**'s plan step by the `fkit-coder` worker and verified against
  the repo; owner-approved for filing 2026-07-26 during the sprint-loop run that shipped 0120.
- **Cross-reference — task 0142** (priority 120, *investigate the skill-ownership fact-inventory gap*,
  owner `fkit-architect`). **This line is plausibly a live specimen of exactly the failure 0142 exists
  to investigate**: the `claude/skills-for-role.sh:12-24` mirror checklist has failed **twice** (0036,
  then 0124's three missed sites) to name every place a role↔skill ownership fact is asserted. Note
  the specific shape — 0142's inventory question already names *"the generated `CLAUDE.md`/`AGENTS.md`
  blocks"*, but this line is **hand-written prose outside** the generated block, a class the inventory
  does not currently name. A pointer has been added to 0142's brief.
- **Ranking note.** Placed immediately below 0142 so the specimen sits next to the investigation of its
  class. **This is not a dependency** — the fix is a one-line correction and does not wait on the
  investigation. If it lands first, 0142's sweep will find the site already corrected; 0142's brief
  records it either way, and `git log -- CLAUDE.md` preserves the evidence.
- **Do not fold this into 0142.** 0142 is investigation-only and its verification step 5 forbids
  implementation.
- No commit — leave the edit in the working tree.
