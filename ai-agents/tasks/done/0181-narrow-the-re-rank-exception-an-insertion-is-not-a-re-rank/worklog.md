# Worklog — task 0181: narrow the `/fkit-task-brief` step 5 re-rank exception

## Build unit — 2026-08-06, fkit-coder (spawned by fkit-sprint-ship-loop, declared-approval build)

### What changed

One file: `claude/skills/fkit-task-brief/SKILL.md`, step 5 *"Determine priority"*.

Appended the ADR-035 narrowing **inside the owner-ruled re-rank exception bullet** (the bullet
beginning *"**The one exception — an owner-ruled re-rank…"*), directly after its previous last
sentence (*"…not on a precedent read off an earlier addendum."*). The new text, per the approved
plan:

- narrows the exception to *moving an existing row within its own contiguous run of open rows —
  nothing more*;
- forbids the specific act by name: never insert a new row where a `✅ Done`, `⛔ Cancelled` or
  `➡️ Moved` row sits anywhere below the insertion point, and run the check **downward** (encoding
  the 0174 wrong-direction failure);
- gives the remedy in the same breath: out-of-reach merit position → append, record the ordering
  intent in the brief as *the merit-position statement this step already requires* (owner-ruled
  "Reference" wording — canonical `**On merit:**` grammar NOT quoted; that shape is task 0179's);
- states the corollary: the append rule is a forced consequence of the closed-row rule — relaxing it
  means arguing the closed-row rule;
- cites ADR-035 by relative link, no `:NNN` line citations, no bullet ordinals.

The closed-row bullet and every other bullet of step 5 are untouched. No scaffold counterpart exists
(`claude/scaffold/` carries no skills — confirmed in the plan's grounding facts); no scaffold edit
made.

### Also done

- Refreshed the fkit-managed copies via `claude/fkit-claude-init.sh .`;
  `diff claude/skills/fkit-task-brief/SKILL.md .claude/skills/fkit-task-brief/SKILL.md` → empty.
- Spot check: `grep -nE '\.md:[0-9]' claude/skills/fkit-task-brief/SKILL.md` → no match.

### Outstanding (deferred to the driver's Verify unit)

- Full verification suite (`npm test`, incl. `test/skill-frontmatter.test.js` and
  `test/dual-home-parity.test.js`) NOT run in this build unit.
- Plan verification steps 1–5 walkthroughs (0174 scenario walk, remedy/corollary presence read) to be
  re-confirmed by the Verify unit; the build's own read says they hold.

### Decision log

- Line-wrapping of the new text to the file's ~100-char bullet style (mechanical formatting only;
  wording is the approved plan's, byte-content preserved modulo wrapping).
- Autonomous judgment calls beyond that: **none**.

## Verify unit — 2026-08-06, fkit-coder (spawned by fkit-sprint-ship-loop, verify-only)

### Test suite

`npm test` (node --test, zero devDeps): **567/567 pass, 0 fail, 17 suites**, exit 0. Includes the
mutation hard gate: baseline + unmutated copies green; all 14 mutations red their named assertion.
`test/skill-frontmatter.test.js` and `test/dual-home-parity.test.js` both in the passing set.

### Plan verification steps 1–8

1. **Narrowing placement** — PASS. New text sits inside the exception bullet
   (`claude/skills/fkit-task-brief/SKILL.md` step 5, the bullet beginning *"The one exception — an
   owner-ruled re-rank"*), phrased as the exception's limit. Closed-row bullet untouched.
2. **0174-scenario walkthrough** — PASS. Insert new row 0174 mid-board (2026-08-01, sprint-2, explicit
   owner ruling), eight `✅ Done` rows (0151/0147/0150/0157/0161/0148/0159/0160) below the insertion
   point: the sentence *"never insert a new row where a `✅ Done`… row sits anywhere below the
   insertion point"* forbids the act by name; the owner ruling does not rescue it (exception no longer
   covers insertion, closed-row rule *"not even under an owner ruling"*); *"run the check downward"*
   catches the producer's wrong-direction (upward) check; remedy routes 0174 to append + recorded
   merit statement.
3. **Remedy present in the same step** — PASS (append + record ordering intent as the merit-position
   statement this step already requires).
4. **Corollary present** — PASS (append rule is a forced consequence of the closed-row rule; relaxing
   it means arguing the closed-row rule).
5. **Citation discipline** — PASS. `grep -nE '\.md:[0-9]'` → no match; ordinal-phrase grep + manual
   read of the new text → no bullet ordinals. ADR-035 relative link resolves from the skill file.
6. **`npm test`** — PASS (counts above).
7. **Scaffold counterpart** — **none exists**: `claude/scaffold/` carries `AGENTS.md`, `CLAUDE.md`,
   `universal-rules.md`, `ai-agents/` only; `grep -r "Determine priority" claude/scaffold/` → no
   match. Nothing to edit, nothing to diff — stated explicitly per the brief.
8. **Managed-copy parity** — PASS. `diff claude/skills/fkit-task-brief/SKILL.md
   .claude/skills/fkit-task-brief/SKILL.md` → empty.

No source written by this unit. No fixes applied; autonomous judgment calls: **none**.

## Process-review unit — 2026-08-06, fkit-coder (spawned by fkit-sprint-ship-loop)

### What was done

- Read the ledger (`review.md`, Reviewer findings round 1: one finding, R1). Independently verified R1
  against the working tree; verdict **PARTIALLY CORRECT**, classified **defect** (low — wording residue
  of the brief-mandated conditional shape): the operable test states a necessary condition only, and its
  inverse is readable as permission on an all-open board; the two categorical sentences before it
  already forbid the act unconditionally, so no legal reading permits it (Codex's "contradicts ADR-035"
  overstated, matching the reviewer's note).
- Applied the fix, wrote the *Coder response* section of `review.md`, refreshed the managed copy
  (`claude/fkit-claude-init.sh .`; `diff claude/… .claude/…` → empty), re-checked citation discipline
  (`grep -nE '\.md:[0-9]'` → no match; no bullet ordinals in the new clause). Full suite deliberately
  NOT re-run — the driver re-verifies next, per the unit contract.

### Decision log

- **R1 fix — applied under OWNER RULING, not autonomously.** Finding answered: R1 (round 1, the only
  finding). Ruling: live lead session, 2026-08-06, verbatim *"Fix — add clause (Recommended)"* — apply
  the reviewer's recommended clarifying clause. Change: one clause added to the step-5 exception bullet
  of `claude/skills/fkit-task-brief/SKILL.md`, directly after the operable test's parenthetical:
  *"That check names the worst case, not a permission: **even where no closed row sits below, a new row
  still appends — insertion is never the exception's to grant.**"* Why it qualified: owner-ruled in the
  driver session (so no autonomy test needed); it is also in-plan in shape (clarifies the plan's own
  step-5 text, changes no constraint: closed-row bullet untouched, no `:NNN`, no ordinals, wiki
  untouched).
- **One wording call within the ruling's granted latitude** (the ruling itself allows *"exact phrasing
  may be smoothed to fit the sentence"*): the lead-in *"That check names the worst case, not a
  permission:"* was added before the ruled clause so it attaches to the operable test it corrects;
  the owner-ruled meaning is carried verbatim in the bolded clause. Recorded here so a wrong smoothing
  is findable.
- Autonomous judgment calls beyond that: **none**.

## Re-verification after R1 fix (2026-08-06, spawned fkit-coder, sprint-ship-loop verify unit)

- `npm test`: **567/567 pass, 0 fail** (17 suites); mutation hard-gate PASSED (baselines 0a–0i green,
  mutations 1–14 each red their named assertion).
- Spot-checks on the fix surface, all pass: (a) no `.md:NNN` coordinate citations in
  `claude/skills/fkit-task-brief/SKILL.md` (grep no-match); (b) new clause contains no bullet
  ordinals; (c) canonical vs `.claude/` deployed copy: diff empty; (d) `git diff HEAD` on the file is
  a single additions-only hunk inside the step-5 exception bullet — closed-row bullet byte-unchanged.
- No source written this unit; verify-only.
