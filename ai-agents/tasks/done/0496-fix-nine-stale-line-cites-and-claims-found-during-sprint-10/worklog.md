# Worklog — 0496: Fix nine stale line cites and claims found during Sprint 10

- Built 2026-10-14 by a spawned `fkit-coder` **Build worker** under the declared-approval marker
  (caller `fkit-sprint-ship-loop` / `fkit-lead`; owner approval via `AskUserQuestion`, 2026-10-14:
  "Approve (Rec)", OQ1 "Pointer only (Rec)", OQ2 "Full-form only (Rec)", OQ3 "File a Backlog task (Rec)").
- Plan: this folder's `plan.md` (blob `92411a4…`, 18251 B), not re-authored.
- Baseline (`git status --porcelain`, `git diff --numstat`, per-file hashes) saved to the session
  scratchpad before the first edit. Every line number below was re-measured on 2026-10-14 by content.
- Briefs are named by ID plus a quoted section name, never by a task-file line coordinate.

## Verdict lines (30)

Legend: **fixed** / **already correct** / **frozen record, left as is** / **target gone**.

### (a) `claude/skills/fkit-sprint-ship-loop/SKILL.md`, *Process review* row — 4

1. **fixed** — `(fkit-process-stateful-review/SKILL.md:195)` → `(…SKILL.md:208` — *"Step 6 — Apply
   approved fixes + update the shared file"*`)`. Confirmed: line 208 is that heading; 195 is Step 5's.
2. **fixed** — `(…SKILL.md:85)` → `(…SKILL.md:96-97` — *"Status vocabulary"*`)`. Confirmed: 96 is the
   **Status vocabulary** label, 97 the six values; 85 was "by their stable id".
3. **fixed** — `:103-104` → `:114-118` (Step 0's *"create it"*). Confirmed: 114–118 is the "If it
   doesn't exist … create it" bullet; 103 was "You are a critical filter".
4. **fixed** — `:119-120` → `:132-133` (Step 1's *"If findings arrived as pasted text"*). Confirmed:
   132–133 is that paragraph; 119 was the settled-ADR loading bullet.

### (b) `claude/fkit-claude-init.sh` — 1

5. **fixed** — `probe (fkit-claude.sh:576) just` → `probe (fkit-claude.sh, fresh-project start) just`
   (name, no number, per `code-comments.md` rule 2). Confirmed: the `[ -x "$proj/.fkit/interview" ]`
   probe sits in the launcher's fresh-project start block (line 656 today). The two lines were re-wrapped
   (only those two).

### (c) `test/orphan-cleanup.test.js` — 1

6. **fixed** — `` `claude/fkit-claude.sh:311-312` writes `` → `` `build_settings()` in
   `claude/fkit-claude.sh` writes ``. Confirmed: `build_settings()` writes
   `.fkit/settings/<role>.json` (lines 392–393 today) and runs on every launch path (calls at 662 and
   750). Re-wrapped those two lines into three to keep the width; rest of the comment untouched (0515).

### (d) `RELEASING.md` — 5

7. **fixed** — `:79-91` → `` `claude/fkit-claude.sh:80-92`, `_fkit_remote_sha()` ``. Confirmed: 80 is
   `_fkit_remote_sha() {`, 92 its closing `}`.
8. **fixed** — `:92-98` → `` `claude/fkit-claude.sh:93-99`, `_fkit_remote_version()` ``. Confirmed:
   93–99 is that function.
9. **fixed** — `:202-208` → `` `claude/fkit-claude.sh:203-209`, the `if [ -n "$rver" ] && [ -n
   "$curver" ]` block ``. Confirmed: 203 is that `if`, 209 its `fi`; 202 was a comment.
10. **already correct** — `:124` (`fkit_ref="${FKIT_REF:-…}"; fkit_ref="${fkit_ref:-main}"`). Not touched.
11. **already correct** — `:185` (`if [ -n "$remote" ] && [ -n "$installed" ] …`), cited twice. Not touched.

### (e) Open briefs citing `claude/fkit-claude.sh:<n>` (full form) — 14

12. **frozen record, left as is** — 0284, `:69`, table "Verified on disk 2026-08-13".
13. **frozen record, left as is** — 0284, `:60-63`, same table.
14. **frozen record, left as is** — 0284, `:126-165`, "The defect, measured".
15. **frozen record, left as is** — 0284, `:79-91`, "The defect, measured" / "Verified line by line 2026-08-13".
16. **frozen record, left as is** — 0284, `:99-103`, "Re-measured on disk 2026-08-13".
17. **frozen record, left as is** — 0284, `:101-102`, "Two distinct defects on ONE line … (folded in 2026-08-13)".
18. **frozen record, left as is** — 0284, `:99-103`, same section, "as it stands on disk".
19. **frozen record, left as is** — 0328, `:355-361`, "ONE PREMISE … WAS WRONG" (the 2026-08-23 audit's measured run).
20. **fixed** — 0328, What to build, *"Decide and STATE what init's exit status becomes"*:
    `` `claude/fkit-claude.sh:363-367` `` → `` `claude/fkit-claude.sh:424-431` (the `case "$setup_rc" in`
    block) ``. Confirmed: 424–426 is the three-way-status comment (incl. *"the two copies drifted the
    first time we tried that"*), 427–431 the `case … esac`.
21. **fixed** — 0382, "What is unpinned": `(claude/fkit-claude.sh:606)` → `(claude/fkit-claude.sh:652)`.
    Confirmed: 652 is `if [ "$fresh" = 1 ] && [ -z "$role" ]; then`, the `if` quoted right below it.
22. **frozen record, left as is** — 0382, `:606`, "Verified firsthand on 2026-09-07".
23. **already correct** — 0382, `:606`, Notes, "used deliberately" (describes the citation form; `:606`
    still appears in the dated section).
24. **fixed** — 0403, "The checklist, and its own record of failing": `:259` → `:305`. Confirmed: 305 is
    `# ⚠️ CHANGING A ROLE'S SKILLS? SIX hand-maintained places MIRROR this list …`.
25. **fixed** — 0403, same sentence: `:264` → `:310`. Confirmed: 310 is
    `#   * ai-agents/knowledge-base/architecture.md — the skill count and the role/skill table`.

### (f) Backlog board — 1

26. **frozen record, left as is** — the `➡️ Moved to Sprint 8` row for 0341 (its `CLAUDE.md:58` cite).
    Closed row. No edit.

### (g) ADR-026 — 1

27. **fixed** — dated ⚠️ note appended at the end of §Context → "The real defect R2 exposed was not
    hand-rolling", plus a `Corrections:` header bullet. Architect's corrected text, verbatim. Facts
    re-verified: `package.json` `"test"` = `node --test test/*.test.js && bash test/prove-red.sh`;
    `git log -S` puts that in `0ad055a` (2026-07-18 21:34 +0300), before the ADR's add commit `f50a821`
    (2026-07-19 00:53 +0300), and `git show f50a821:package.json` already has it; `test.yml` added in
    `df55b50` (2026-08-12), triggers `push` to `main` and `pull_request`, runs `npm test`. 16 lines
    added, 0 removed.

### (h) ADR-019 — 1

28. **fixed** — `fkit-coder.md:109-113` cite in §Decision item 4: dated ⚠️ note after item 4's last line,
    plus a 4-line continuation of the `Corrections:` bullet (its original text untouched). Targets
    confirmed by quote: *"But: a genuinely NEW architecture decision goes to the OWNER."* under
    §Consulting a teammate (line 212 today) and *"Make product or scope decisions that belong to the
    producer / owner — surface them instead."* under §What you must not do (line 268 today).
    Lines 109–113 of that file now hold part of the Process-review worker bullet. 12 lines added, 0 removed.

### (i) ADR-052 D8 item 3 and brief 0436 — 2

29. **fixed** — ADR-052 D8 item 3: ⏱ Correction sub-bullet added after "Fixed in the old format first,
    then re-run." Confirmed: 0014's brief `## Status` reads `✅ Done`; `ai-agents/sprints/` has no
    table row for 0014 (its only mention is prose inside 0296's row); R7 per 0472's plan. 4 lines
    added, 0 removed.
30. **already correct** — brief 0436: its 2026-10-02 note already says *"`0014` now falls under the
    **no board row** class"*. No edit.

## Found, not fixed (OQ2 = full-form only)

Short-form `:NNN` cites were **not** swept, per the owner's OQ2 answer:
- 0284: about 42 short-form `` `:NNN` `` cites across the brief (launcher and other files mixed; not
  classified), including about 15 in "What to build". That brief needs a re-scope, not renumbering
  (see out-of-scope item 4).
- 0328: launcher short forms `:373-377`, `:387-392` (twice), `:331`, `:336`; also init-script short
  forms (`:485`, `:500`, `:167`, …) not checked.

## Out of scope — recorded for the follow-up (OQ3 = file a Backlog task; the lead routes it to a producer)

1. The same *Process review* row's `ADR-019 :96` is stale; that rule (*"Every autonomous choice …
   recorded in the task's worklog decision-log"*) was ADR-019 lines 115–116 before this task, and is
   119–120 after it (this task's 4-line header addition sits above it).
2. Other stale ADR-019 line cites: `fkit-coder.md` (`:96`), ADR-025 (`adr-019:97`), ADR-032 (`:96`,
   `:148-150`), two reports (`adr-019:138`, `:96`). This task's ADR-019 inserts shift its later lines
   by 4 (header) for lines up to item 4, and by 12 (4 + 8) for lines after item 4's note; all of these cites were already stale.
3. `claude/skills/fkit-task-ship-loop/SKILL.md` cites `fkit-coder.md:165`; the rule is at `:212` today.
4. Brief 0284 looks partly obsolete: its folded-in "defect 2" (env vars never reach the `sh`) appears
   fixed by 0481 (`_fkit_reinstall` now downloads first, then runs `… | FKIT_REPO=… FKIT_REF=… sh`).
   Needs a producer re-check.
5. Other `CLAUDE.md:NNN` cites on closed Backlog-board rows — closed history, left.
6. ADR-052 has no `Corrections:` header index (architect note; not added, per ruling).
7. ADR-026 does not record which task wired prove-red into `npm test` in `0ad055a` (architect, FYI).

After close: `fkit-wiki` may need a re-sync for its ADR-019, ADR-026 and ADR-052 pages.

## Decision log

- **Architect ruling (plan time, hop 2 of 2, chain lead → coder → architect): CHANGES REQUESTED, all
  adopted** — ADR-026 note widened to the two "not in `npm test`" statements and "awaiting its brief",
  with the `0ad055a`-before-`f50a821` correction; ADR-052 gets no header index.
- **OQ1 → "Pointer only (Rec)":** (b) and (c) fixed the pointer only, by name. Rest of each comment left
  to 0508 / 0515.
- **OQ2 → "Full-form only (Rec)":** short-form cites logged above, not fixed.
- **OQ3 → "File a Backlog task (Rec)":** out-of-scope 1–4 recorded above; not filed by this worker.
- **Obvious-winner calls (within plan intent):**
  1. ADR-019 item-4 note: a blank line before and after the blockquote, matching the existing `0473`
     note's form in the same list. Why: the plan said "check the rendered nesting"; rendered with
     `markdown_it` (CommonMark), items 1–7 stay one ordered list with the note nested in item 4. The
     list was already loose (item 2's note has blank lines), so spacing does not change.
  2. Line re-wraps where the new text pushed a line well past the file's width: (b) 2 lines re-wrapped
     in place; (c) one line split into two (rest of the comment unchanged); `RELEASING.md` 3 lines each
     split once; 0328's fixed line split once. Markdown renders identically; code comments only.
- **Step 10 (init refresh):** `claude/fkit-claude-init.sh .` exit 0. `git status --porcelain`, `git
  diff`, and the hash of every tracked file were byte-identical before and after; untracked baseline
  files unchanged. `.claude/skills/fkit-sprint-ship-loop/SKILL.md` now matches the canonical file. Stop
  condition not hit.
- **Step 11:** no CHANGELOG entry (cite and note fixes only).
- **Fixes applied without asking outside the plan:** none.
- **Review round 1 — Process-review worker (2026-10-14), spawned by `fkit-sprint-ship-loop` / `fkit-lead` under the declared-approval marker (Process-review).** One finding.
  - **R1** (0284's present-tense `claude/fkit-claude.sh:126-165` cite, verdict 14 above): verified CORRECT, classified frontier, severity low. Disposition `won't fix (frontier)`, Action none in 0496, by the owner's ruling (AskUserQuestion, 2026-10-14, fkit-lead session: "Won't fix + 0284 note (Rec)"). Accepted residual written in `review.md` (What / Why / Re-raise only if). A producer adds the one-line pointer to 0284's Notes; this worker did not touch 0284. Ledger `Status:` set to `closed-out`.
  - **Fixes applied without asking:** none. **Obvious-winner calls:** none. No source file changed this round; only `review.md` (Coder response, Accepted residuals, `Status:`) and this worklog.

## Verify — 2026-10-14

Run by the Process-review worker after the round-1 ledger write, on the working tree as it stood. That tree
also held other uncommitted work (0506, 0501, and a producer's same-day edits: brief 0516, a note in
brief 0284, the Backlog board). So these results cover the whole tree, not this task's diff alone.

- **Ran: full `npm test`** (`node --test test/*.test.js && bash test/prove-red.sh`), 17:07–17:30, exit 0.
  - Unit: tests 1112 · suites 24 · pass 1112 · fail 0 · cancelled 0 · skipped 0 · todo 0
    (~114 s). This covers `reference-integrity`, `coordination-citation-policy`, `adr-number-uniqueness`,
    `code-comment-rule` and `orphan-cleanup`.
  - Prove-red: baselines 0a–0p all green; mutations 1–43 all red on their named assertion;
    *"✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion."*
- **Ran: `npm run test:docs`** after the ledger and worklog writes (this section included): exit 0 · tests 389 · pass 389 · fail 0 · cancelled 0 · skipped 0. Re-run once more after this line was written: same result.
- **Skipped: none** of the checks the plan's Verify names. Not re-run: the plan's diff checks against the
  build-time baseline (file list, 0 removed lines in the 3 ADRs). This round changed no source and no ADR;
  it touched only this folder's `review.md` and `worklog.md`.
- **Check by eye, done at build time and not repeated:** `RELEASING.md` (nothing automated covers it).
