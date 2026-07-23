# Plan — 0107: make a Notes-stated dependency visible to `dashboard.sh`

**Approved at the plan gate 2026-07-23. Chosen design: Option B + loud guard.**

## Root cause (verified)
`depends_raw()` in `dashboard.sh` already scans the whole brief (incl. `## Notes`) — siblings'
`- **Depends on: nothing.**` parse fine. Task 84 = `0092` fails because its declaration is
`- **⚠️ Depends on tasks 82, 83 …**`: the bold anchor `**Depends on` breaks when a decoration (`⚠️ `)
sits between `**` and `Depends on`. No canonical anchor (S/BL/BI/P) matches → `none recorded` → false
`ready`. Confirmed empirically.

Note: `0092` is now `✅ Done` (off-board), so the brief's live "task 84 still open → after 83"
acceptance is **stale under any option** (a done row renders nothing). Acceptance moves to a
dashboard-contract **test fixture** replicating `0092`'s exact declaration form. Flagged, not papered over.

Prior art: `0020` review R19/R40 — the free-text `Depends on:` grammar is an *unenforced emergent
convention of one author*, and free-text location is "CommonMark-in-awk" unreliable. That history is
why we do NOT pile more extraction grammar on (Option A rejected); we enforce one form and add a
loud-only safety net.

## The change (three parts)

### 1. Enforce one canonical form (the "B")
- `claude/skills/fkit-task-brief/SKILL.md:78-79` — replace the loose "(`Depends on:` / `Blocks:` in
  `## Notes`)" with a mandate to write the exact canonical line the parser reads reliably:
  `- **Depends on:** <deps | nothing>` (bold, colon, NO decoration before the label).
- New KB convention doc `ai-agents/knowledge-base/conventions/dependency-declaration-form.md` — records
  the single-home canonical form and why (parser reliability; the 0092 misreport).

### 2. Loud guard in `dashboard.sh` (the "+ loud guard")
- Add ONE final locate arm to `depends_raw()`'s END block, AFTER the S/BL/BI/P arms (which `exit` on a
  catch). It fires only on a **declaration-shaped** line — `Depends on` preceded solely by non-letter
  markup/decoration — that the canonical arms did not read:
  ```awk
  for (i = 1; i <= N; i++)
    if (!F[i] && M[i] ~ /^[^A-Za-z]*Depends on/) { print "U\037"; exit }
  ```
  Emitting empty content routes the caller to its EXISTING loud path
  (`⟨derive: UNPARSEABLE — see brief⟩` + `drift depends-unparseable`), never silent `none recorded`.
- **Why this is safe, not a second grammar:** any letter before the label blocks the match, so ordinary
  prose that merely *mentions* dependencies (verified: `0107`'s own Context, `0107` Option-A prose) and
  masked code spans never trip it. It is the ONE grammar's last locate arm; the caller still branches
  only on `depends_raw`'s single answer — honoring the file's "THERE IS ONE GRAMMAR" invariant.
- Blast radius on open briefs: verified ZERO real declarations would newly fire (only `0092`, done).

### 3. Sync + tests
- Sync `.claude/skills/fkit-status/dashboard.sh` and `.claude/skills/fkit-task-brief/SKILL.md` (live copies).
- `test/dashboard-contract.test.js` — add fixtures:
  - positive: `- **⚠️ Depends on task 83 —**` → LOUD `⟨derive: UNPARSEABLE — see brief⟩` + drift (NOT `none recorded`, NOT `ready`).
  - negative: a brief with NO dep still `⟨derive: none recorded⟩` (guard doesn't over-fire).
  - guard/prose: a brief mentioning "Depends on" in prose (letters before the label) does NOT fire drift.

## Verification
- `node --test test/dashboard-contract.test.js` green (baseline 105/0 + new).
- Full suite green.
- Manual: dashboard on sprint-2 shows no NEW drift.

## Out of scope
`0108` (sibling: wiki-task completion visibility) — noted only. No commit; edits left in working tree.
