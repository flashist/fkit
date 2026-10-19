# Plan — 0507: pilot comment cleanup of the hook scripts and `skills-for-role.sh`, and the method for the series

## 0. Summary
- **Scope: 7 files, comments only.** I counted 403 comment lines with the brief's grep `^[[:space:]]*(#|//|\*|/\*)` on 2026-10-16. After the cleanup I expect roughly 110–140.

  | File | Comment lines |
  |---|---|
  | `skill-ownership-hook.sh` | 80 |
  | `turn-completion-hook.sh` | 69 |
  | `shiploop-marker-hook.sh` | 33 |
  | `askuserquestion-marker-hook.sh` | 31 |
  | `carry-check-hook.sh` | 21 |
  | `carry-check-hook.mjs` | 116 |
  | `skills-for-role.sh` | 53 |

- **No line of code changes.** The proof is a new parser-based check (M3) plus the brief's diff-line check.
- **No reason moves into the knowledge base.** Every long reason in these files already has a durable home: an ADR, the report `2026-08-02-faithful-carry-of-an-approved-plan.md`, or a closed task's plan, worklog or review. Each comment shrinks to 1–2 lines with a pointer to that home.
- **Two fixes outside the 7 files:** two cites in `ai-agents/knowledge-base/architecture.md` that point into these files.
- ⚠️ **Conflict with 0226 (Q1).** 0226's brief says to keep `skills-for-role.sh`'s mirror-checklist warning block verbatim. It says so in *What to build* step 3 and *Verification* step 4, written under the owner's 2026-08-05 ruling on 0226 (option (b): narrow the checklist to site classes). The comment rule would cut that block as history. The plan leaves the block untouched for 0226.
- **Gap in the brief.** V4 says `test/reference-integrity.test.js` proves that new pointers resolve. That test only scans Markdown under `ai-agents/`, not code comments. The plan adds a manual pointer check (M4e).

## 1. Context checked
- **No overlap with Sprint 12's uncommitted work** (tasks 0516, 0385, 0284, 0334). `git status` shows all 7 in-scope files clean. That work touched:
  - `claude/fkit-claude.sh`
  - the review skills and two agent files
  - `test/prove-red.sh` (now 55 mutations) and `test/harness.mjs`
  - a new test file
  - `architecture.md`: one added line, which is not a line this plan edits.

  The build records `architecture.md`'s existing diff first, so V5 shows only this task's hunk.
- **`.claude/skills-for-role.sh` and task 0519.**
  - The build edits only the canonical `claude/skills-for-role.sh`.
  - The `.claude/` copy is tracked in git, not gitignored, and init does not refresh it (0519's finding). So the brief's rule 6 (*"gitignored copies, refresh with init"*) is wrong for this one file. The copy stays untouched, and the build does not run init.
  - 0519 does not block this task. This repo's launcher settings point the Skill hook at `claude/skill-ownership-hook.sh` (checked in `.fkit/settings/coder.json`), and that hook sources the `claude/` copy. A change to comments only cannot alter behaviour, whichever copy is read.
- **0373 has no effect here.** No comment in these files cites its own file by line number, and `code-comments.md` rule 2 already forbids line numbers in comments.
- **Nothing to regenerate or log.** No structure or heal manifest names these files. No CHANGELOG line is needed, because users see no change.

## 2. Method for the series (copied into the worklog's "Method for the series" on approval)

**M1 — Where a reason goes.**
1. **Already recorded somewhere durable:** write a one-line pointer, and do not copy the reason. Durable homes are:
   - an ADR, cited by number plus section or heading;
   - a convention, cited by file name;
   - a dated report, cited by file name plus heading;
   - a closed task's own record, cited by task ID, plus plan, worklog or review, plus the finding or ruling ID. Example: "0204 review R12". A closed task folder never moves, so these IDs stay valid. Owner question Q2 confirms this last kind.
2. **Not recorded, and it fits in 1–2 lines:** keep it where it is, shortened.
3. **Not recorded, and it needs more than 2 lines:** move it first, then point to it.
   - A reason behind a decision an ADR already owns → a dated addendum to that ADR. Never rewrite the ADR.
   - A rule for how code is written across many files → a convention.
   - A reason specific to one component (a measured gotcha, an analysis of what risk remains) → one report per unit, `ai-agents/knowledge-base/reports/<date>-code-comment-reasons-<unit>.md`, with one section per file and function.

   Each unit's plan names every destination. If the build finds a destination its plan did not name, it stops and asks.

**M2 — Task, ADR and ruling tags.**
- Keep a tag only where it points to a place where a reason the reader needs is written. The build checks that the target really holds that reason.
- Drop a tag that only records which task wrote the line.
- Write a task as its folder ID (`0204`), never as "task 43" or "task 70".
- Write findings and rulings together with their task: `0127 review R4`, `0204 plan Q3`. Never a bare "R4" or "Q3".
- If a review ledger reuses a finding ID across rounds, the pointer names the round. Before writing a pointer, the build checks that the ID is unique in that ledger's findings table.
- Drop dates, unless a date is the only name a ruling has and no better home exists.

**M3 — The comments-only proof for V1.**
- **Shell (primary check, parser-based).** Wrap the whole file in a function and print bash's normalized copy of it. That copy has no comments.

  ```bash
  norm() { /bin/bash -c 'eval "__fkit_body() {
  $(cat "$1")
  }"; declare -f __fkit_body' _ "$1"; }
  ```

  Run `norm` on a temporary copy of the HEAD version (from `git show HEAD:<file>`) and on the working file. The two outputs must be byte-identical.
  - Text inside quotes and heredocs is kept. So the `#` lines inside an awk program are treated as data, and any change to them shows up.
  - Tried on 2026-10-16 on all 6 shell files: a comment edit gives "equal"; a code edit gives "different"; an edit inside the awk string gives "different".
- **JS (primary check, parser-based).** Tokenize the file with the acorn copy built into node: run `node --expose-internals`, load `require('internal/deps/acorn/acorn/dist/acorn')`, call `tokenizer(src,{ecmaVersion:'latest',sourceType:'module'})`, and hash `type:value` for every token.
  - Comments are not tokens; strings and template text are.
  - Tried on `carry-check-hook.mjs` with node v24.13.0: a comment edit gives "equal"; a template-string edit gives "different".
  - The token hash ignores where newlines fall. So the JS proof needs all four of these together:
    - the token hash
    - the diff-line check
    - `node --check`
    - `test/carry-check-hook.test.js`, run as part of `npm test`.
  - ⚠️ The acorn path is internal to node, not a public API. If a later node removes it, fall back to the diff-line check plus a written statement that no changed hunk sits inside a string or template literal.
- **Both languages (secondary check: the brief's V1 line check):**

  ```bash
  git diff -U0 -- <files> | grep -E '^[-+]' | grep -vE '^(\+\+\+|---) ' | grep -vE '^[-+][[:space:]]*(#|//|$)'
  ```

  This must print only the listed exceptions: code lines whose trailing comment changed. The parser check proves the code part of those lines is unchanged.

**M4 — Refinements to the brief's "Rules for every unit".**
- **a. Rule 1:** an awk, sed or jq program inside quotes is data, including the comments inside it. The parser check enforces this.
- **b. Section dividers** such as `# --- read the payload … ---` only say WHAT the code does: delete them. If a live document quotes one, re-anchor that cite first.
- **c. Rule 5:** re-anchor a live cite on code text (a function name or a line of code), never on comment text.
- **d. Rule 5 — which documents to fix and which to leave:**
  - **Fix** live text: skills, agents, conventions, `architecture.md`, tests and code.
  - **Leave** these, because each describes a past revision: ADR `path:NNN` cites (owner question Q3), dated reports, closed task folders, review ledgers, sprint boards (the producer owns them), and other tasks' open briefs.
  - **One exception:** if this unit deletes the exact text an open brief quotes and depends on, append a dated one-line note to that brief and leave its original bytes untouched (0519's form).
  - A line that only shifted position is never a reason to edit any of these documents.
- **e. Rule 3:** reference-integrity does not scan code comments, so each pointer is checked by hand: `ls` the file, then `grep` for the heading, finding ID or ruling ID. Every check goes into V4's table.
- **f. Prove-red seds:**
  - If a prove-red sed matches a whole line of code, that line must not gain a trailing comment.
  - Before editing a file, run `grep -F` for its name in `test/prove-red.sh` and read every mutation that touches it.
  - Never write a comment that contains a mutation's search string, or the sed would change the comment as well.
- **g. Rule 6 correction:** `.claude/skills-for-role.sh` is tracked in git, and init does not refresh it (0519). Never edit it in this series.
- **h. How V6 counts comment length:**
  - A run of consecutive comment lines counts as one comment, including lines that are only `#`.
  - Keep two comments apart with a real blank line.
  - Shebangs and shellcheck directives are not counted.
  - The command goes in the worklog: an awk run once per file, because BSD awk has no ENDFILE.
- **i. A comment that is wrong today** is fixed or deleted (`code-comments.md` rule 6). Example: skill-ownership-hook's "today (pre-hook) it fails OPEN".

## 3. Per-file changes
Each entry: the block, by its opening words → the action → the draft text, at most 2 lines. The build checks every pointer by hand.

**`claude/skills-for-role.sh` (53 lines)**
- **Header** ("the single source of truth…", "Extracted from fkit-claude.sh…", "This is the ONLY place…") → 2 lines:
  - `# The single source of truth for fkit role → skill ownership (ADR-018): source this file, never copy the map.`
  - `# The PreToolUse hook sources it, so it must stay free of top-level side effects.`
- **Mirror checklist and the "THIS LIST SAID "TWO"…" block** → untouched (Q1). It stays verbatim per 0226's brief (*What to build* step 3, *Verification* step 4), under the owner's 2026-08-05 ruling on 0226 (option (b), narrow to site classes). It is a named exception to V6.
- **Movers block** ("ALL FOUR MOVERS ARE PRODUCER-ONLY…" through "…move together", 25 lines) → two comments:
  - `# ⚠️ The four movers are producer-only (ADR-033; sprint movers ADR-047 §4); the hook makes that structural.`
    `# It separates the closing identity only — ADR-033 "The limit"; do not harden past it.`
  - `# Never give adversarial-reviewer the movers (ADR-025 amendment A2, kept by ADR-033).`
    `# A mover's SKILL.md cannot grant what this map denies: change the skills, the mirrors and this file together.`

  Dropped as history: the reversal narrative, "added by task 0341", and "X1 before 0054 shipped". Also dropped: the routing in ADR-033 §3–§5, which that ADR already records.

**`claude/skill-ownership-hook.sh` (80 lines)**
- **Header** → 2 lines:
  - `# PreToolUse gate (ADR-018): deny a Skill call when the caller's own role does not own the skill.`
  - `# agent_type is the real caller at any spawn depth, so the lock holds in consults too.`
- **"DENY IS THE hookSpecificOutput… JSON ROUTE"** (19 lines) → must not break; 2 lines:
  - `# ⚠️ Deny only via hookSpecificOutput JSON with an exact hookEventName — a wrong field fails OPEN silently`
  - `# (0052 review R1). test/skill-ownership-hook.test.js pins the JSON shape; never weaken it to exit codes.`
- **"Every code path below MUST end…"** → `# Every path ends in deny() or allow(). set -u, not -e: an error must become a deny (ADR-018 Decision 3).`
- **The shellcheck directive** → keep.
- **deny()'s 5-line trailing comment** → one line above the function: `# $1 is static or already passed is_identifier(), so it is safe inside the JSON string unescaped.` V1 exception: the `deny() {` line.
- **The "read the payload once" divider** → delete.
- **The jq-free block** (11 lines) → 2 lines:
  - `# jq-free on purpose: every field read is identifier-shaped and is checked by is_identifier before use.`
  - `# grep -o | head -1 takes the first match; a greedy sed would take the last.`
- **The extract_tool_input_skill trailing comment** → `# Narrow to tool_input first so a same-named key elsewhere cannot collide.` The other trailing comments are deleted (V1 exceptions).
- **Gate comments, one line each:**
  - Skill-tool gate → `# Defensive: the matcher is "Skill"; a misconfigured matcher must not open the gate for other tools.`
  - fkit-* gate → `# Non-fkit skills (the project's or the user's own) are out of scope.`
  - agent_type → `# No agent_type means a plain, unrolled session: fail CLOSED for fkit-* skills (ADR-018).`
  - Ownership check → `# Universal skills need no special case: every role's list already includes them.`

**`claude/turn-completion-hook.sh` (69 lines)**
- **Header** (33 lines) → three comments of 2 lines each:
  - The Stop hook (ADR-030) blocks once on a missing "What's next?" (check B, exact match), or on a prose question to the owner with no AskUserQuestion (check A, heuristic). It checks presence only.
  - ⚠️ It fails OPEN, always — the reverse of the skill-ownership hook — because a misfire stops the turn (Decision 6).
  - ⚠️ It is registered on Stop only, never on SubagentStop. A consult has no AskUserQuestion, so a block there could not be escaped (Decision 7).
- **Trailing comments:**
  - `allow()` → `# no stdout: lets the turn complete`
  - `block()` → `# $1 is static, JSON-safe as-is`
  - the `extract_*` functions → delete.
- **Dividers** → delete, or reduce to `# Defensive: registered on Stop only.`
- **Marker block** → 2 lines:
  - `# Consume the AskUserQuestion marker before any skip, so it never leaks into the next turn. Trust its absence`
  - `# only if the state dir is writable; else fail open (ADR-030 "Addendum — 2026-07-23"; 0127 review R4).`
- **SKIP 1** → `# Block once: stop_hook_active is true when a Stop hook already blocked this turn (ADR-030 Decision 5).`
- **SKIP 2** → `# The adversarial reviewer is findings-only (ADR-030 Decision 7).`
- **SKIP 3** → 2 lines:
  - `# Ship-loop sessions skip via shiploop-marker-hook.sh's session marker, never a transcript scan (0129).`
  - `# A missing marker only under-skips (block-once lets it through); it never false-blocks.`
- **last_assistant_message** → 1 line.
- **Check B** → `# Search the whole raw payload: finding the heading errs toward not blocking.`
- **Check A** → 2 lines saying:
  - a question is a line ending in "?", skipping code fences, quotes and the heading line;
  - the JSON keeps each newline as a literal "\n", so awk splits on `/\\n/`, and truncation only drops lines.
- **Untouched, because they are data:** the awk program's own `#` comments, and REASON_A and REASON_B.
- **"decide"** → `# At most one block, combining whichever checks fired.`

**`claude/shiploop-marker-hook.sh` (33 lines)**
- **Header** (22 lines) → two comments:
  - `# UserPromptExpansion hook (0129): marks a session that invoked a ship-loop command, so the Stop hook can`
    `# skip it without a transcript scan. Only this event carries an authoritative command_name.`
  - `# ⚠️ Records only, never blocks: every path exits 0 with no stdout. The marker lasts the session (keyed`
    `# by session_id); a failed write only means the Stop hook enforces as normal.`
- **Inline comments** → 1 line each.
- **Trailing comments** → trimmed or deleted. is_identifier keeps `# the id becomes a file name: no path or quote tricks`.

**`claude/askuserquestion-marker-hook.sh` (31 lines)**
- **Header** (23 lines) → two comments:
  - This is a PreToolUse hook on AskUserQuestion. It records "the owner was asked with the tool this turn" for the Stop hook, because the Stop hook's payload has no tool-call list (ADR-030 "Addendum — 2026-07-23"). The Stop hook consumes the marker.
  - ⚠️ It only records and never denies. A failed write is safe only because the Stop hook trusts a missing marker solely when the state directory is writable.
- **Inline comments** → 1 line each.

**`claude/carry-check-hook.sh` (21 lines)**
- **Header** → three comments:
  - `# PreToolUse Agent|Task carry-check (0204). The check lives in carry-check-hook.mjs: a spawn prompt needs`
    `# real JSON parsing (0204 brief, caveat 4). What a green check means: the .mjs header.`
  - `# Run as bash "<path>" (ADR-017 rule 2). The .mjs is found beside this file, so prove-red's copies run`
    `# their own .mjs.`
  - `# Fail OPEN when node is missing (0204 plan, ruling Q3). stdin is not read here: exec passes it on.`

**`claude/carry-check-hook.mjs` (116 lines)**
- **Header** (39 lines) → five comments, at most 2 lines each:
  1. What it is: the PreToolUse Agent|Task carry-check (0204). Its design is in the report `2026-08-02-faithful-carry-of-an-approved-plan`, F3 and §10. It runs only through the `.sh` (ADR-017 rule 2) and uses only node built-ins (ADR-014).
  2. ⚠️ It is a PROXY for the coder's condition (b) ("it carries a concrete APPROVED plan verbatim"), never (b) itself. It proves the prompt holds the plan's bytes. It does not prove the owner approved the plan (ADR-021).
  3. ⚠️ It checks at one moment only, and only in launcher sessions (`.fkit/settings/<role>.json`). Never describe it as guaranteeing what the worker received, or as covering every session.
  4. Ungated by design (0204 plan, ruling Q1):
     - no valid pointer → allow;
     - a near-miss → allow, plus one stderr WARNING;
     - an infrastructure fault → fail OPEN (Q3);
     - a failed check → DENY via the JSON route (ADR-018).
  5. It uses JSON.parse, not the siblings' quoted-run regex, because a spawn prompt is a multi-line string full of escapes.

  The condition-(b) paraphrase stays on purpose: the header of `test/spawned-write-marker.test.js` says the hook paraphrases it this way.
- **gitBlobId** → `// SHA-1 repos only: equals git hash-object without spawning git.`
- **hashMatches and containsExactBytes** → at most 2 lines each, keeping "a separate function so prove-red can neuter it". ⚠️ The `function hashMatches…` and `function containsExactBytes…` lines stay byte-identical, because prove-red mutations 23 and 24 match them whole.
- **The remaining comments:**
  - Dividers → delete.
  - Tool gate → at most 2 lines ("Task" is the pre-2.1.63 name of Agent).
  - Pointer-form block → 2 lines, with no example line.
  - NEAR_MISS → 1 line (0204 ruling Q1, review R3).
  - Warn timing → 2 lines (0204 review R11; the remaining risk R14).
  - `// ungated — see THE UNGATED LIMIT above` → delete. Its target heading is going away (V1 exception).
  - Path safety → 1 line (0204 review R2).
  - "(caveat 2)" → "(0204 brief, caveat 2)".
  - File-content block (15 lines) → 2 lines (R8; R1; limits R1, R13).
  - Pass 1b (12 lines) → 2 lines: a pair of pointers that quote each other stays gated, because a nonce search can forge one (0204 review R7, R9, R12).
  - Degraded-form → 2 lines (scan driver text only; 0204 worklog, first smoke run).
  - Pass 2 → 2 lines.

## 4. Mutations and tests that touch these files (checked)
- Prove-red mutations on these files:

  | Mutation | Where |
  |---|---|
  | 1 | `skills-for-role.sh`, the `reviewer)` arm |
  | 3, 4, 6 | turn-completion |
  | 5 | the AskUserQuestion marker hook |
  | 7 | the shiploop marker hook |
  | 23, 24 | the `.mjs` function lines |
  | unmutated-copy steps | all of these files |

- Every mutation anchors on a code line; none relies on comment text.
- Three seds have no `^` anchor:
  - mutation 4: `had_marker=1`
  - mutation 5: `"AskUserQuestion" ] || allow`
  - mutation 6: `[ -e "$cwd/.fkit/state/shiploop-$session_id" ]`

  No new comment may contain any of these strings.
- No test reads these files' text. The tests only run them.

## 5. Inbound references (V5)
Three searches:
- **S1:** `path:NNN`, `#L` and "line N" cites of the 7 files.
- **S2:** prose that refers to their header or comments.
- **S3:** quotes of distinctive phrases from the comments being deleted.

Measured 2026-10-16; the build re-runs them.
- **Fix (live): `architecture.md`.**
  1. The ownership sentence cites `claude/skills-for-role.sh` by line number, quoting the code "`skills_for_role() {`" → update the number.
  2. The hook paragraph cites a line range of `claude/skill-ownership-hook.sh` and quotes the comment "resolve the REAL caller's role" → use the new range and re-anchor it on code: from `agent_type="$(extract_top "$payload" agent_type)"` to the `does not own skill` deny.
- **Stays true with no edit:** the header of `test/spawned-write-marker.test.js`.
- **Left as they are:**
  - ADRs 018, 025, 030, 031, 032, 033, 034, 038 and 044 (line cites);
  - ADR-053 and ADR-055, which mention "the header";
  - dated reports;
  - closed task folders;
  - sprint boards;
  - `test/fixtures/`.
- **Left: open briefs whose cited lines only shift:** 0187, 0224, 0225, 0403 and 0226.
- **Wiki:** left for the wiki role's next sync.
- **Note for 0508:** `claude/fkit-claude.sh` carries a second copy of the mirror-checklist block, so the answer to Q1 applies there too.

## 6. Sequence
0. **Baseline.** Record `architecture.md`'s existing diff, the V3 counts, and the M3 hashes from HEAD. Run one full `npm test` alone, with nothing else loading the CPU.
1. **Run searches S1–S3.**
2. **Edit the 7 files one at a time.** After each file, run the M3 parser check, plus `bash -n` or `node --check`.
3. **Fix the two `architecture.md` cites.**
4. **Check every pointer** and fill in V4's table.
5. **Write the worklog:** the method, the evidence for V1–V7, and the decision log.
6. **Verify:**
   - both M3 checks;
   - `skills_for_role` output byte-identical for all 7 roles, plus an unknown role and an empty argument;
   - V6;
   - V3;
   - a full `npm test`.

## 7. Checks
**Run:**
- a full `npm test`. CONTRIBUTING requires it for any non-`.md` file under `claude/`, and prove-red mutates these files;
- the M3 checks;
- `bash -n` on each of the 6 shell files;
- `node --check` on the `.mjs` file.

**Skipped:** re-running the live hooks by hand in a real session. The change is comments only, and the parser check proves that.

## 8. Edge cases
- **Trailing comments on code lines** are listed as V1 exceptions, and the parser check proves their code is unchanged. Never add one to a line that prove-red matches on.
- **A `#` inside an awk or sed program, or inside the REASON strings,** is data, not a comment.
- **Fixed positions.** The shebang stays on line 1. The shellcheck directive stays directly above the `.` line.
- **`declare -f` output depends on the bash version**, so run the same `/bin/bash` (3.2) on both sides.
- **On bash 3.2, `declare -f` keeps text inside `$( … )` exactly as written**, comments included. A comment edit inside a multi-line `$(…)` therefore reads as "different". That is a false alarm, never a false pass: compare that span by hand. Measured: none of the 6 files has a multi-line `$(`.
- **The acorn path is internal to node**, so use the fallback if it is missing. Deleting a multi-line `/* … */` could change automatic semicolon insertion without the token hash seeing it. `carry-check-hook.mjs` has no `/*` comments.
- **Pre-existing uncommitted work** may turn `npm test` red. The baseline run separates those failures from this task's.
- **Prove-red timing is sensitive to machine load**, so run it alone.
- **A pointer to an ADR section that turns out not to exist** is reworded to the real heading. That is mechanical and stays inside the plan.

## 9. Open questions for the owner
- **Q1.** The mirror block: keep it untouched for 0226 (recommended; knock-on: none, checked), or cut it now and add dated notes to 0226 and 0403?
- **Q2.** A reason already recorded in a closed task's plan, worklog or review: point to it (recommended), or copy it into the knowledge base?
- **Q3.** ADRs' `path:NNN` cites into the cleaned files: leave them as records of the revision they read (recommended), or update them in each unit?

## Owner rulings at the plan gate (2026-10-16, AskUserQuestion, fkit-lead session)

This section is the lead's; the plan above and the post-Codex questions below are copied from the
coder's return. Where they differ from the plan above, the rulings and the adopted fixes below govern.

- Post-Codex fixes: **"All recommended (Recommended)"** — PC-1 option 1 (keep the plan; open briefs left alone), PC-2 option 1 (Q1 dropped as an owner question; the mirror block is left byte-identical for 0226), PC-3, PC-4 and PC-5 adopted with their drafted text below.
- Q2: **"Point to it (Recommended)"** — a reason already recorded in a closed task's plan, worklog or review gets a one-line pointer, not a copy.
- Q3: **"Leave them (Recommended)"** — ADRs' `path:NNN` cites into the cleaned files are left as records of a past revision.
- Plan: **"Approve (Recommended)"**.

## Post-Codex questions
The plan above stays as approved. The owner decides what each finding changes. In each question below, option 1 is the recommendation.

**PC-1 (X1): 0403's and 0224's line cites into these files will shift.**
1. **Keep the plan (recommended).** Open briefs are left alone under M4d; the text they quote survives; their planners re-measure. Knock-on: none (checked) — no brief moves and no `Depends on:` line changes.
2. **Append a dated one-line note** to 0403 (beside its *"Context"* cites of `claude/skills-for-role.sh`) and to 0224 (beside its cites of the marker hooks), giving the new coordinates, with the original bytes untouched. Draft: `> 📌 2026-10-1x (0507): comments-only cleanup shifted the cited lines; the quoted text is unchanged — find it by the quote.` Knock-on: none (checked).

**PC-2 (X2): reframe Q1.**
1. **Drop Q1 as an owner question (recommended).** Record it as a plan choice instead, replacing Q1 and the §0 bullet with: *"The mirror-checklist block (from "CHANGING A ROLE'S SKILLS?" through "add it HERE FIRST…") is 0226's deliverable under the owner's settled 2026-08-05 ruling (option (b)). 0507 leaves it byte-identical and does not re-ask. V6 names it as an exception. 0508 does the same for the copy in `claude/fkit-claude.sh`."* Knock-on: none (checked).
2. **Keep Q1 as written.**

**PC-3 (C1 + C2): close the two false-pass holes in M3.** Recommended: apply both edits.
- **JS (C1).** In M3 JS, replace "hash `type:value` of every token" with: *"hash each token's raw source text (`src.slice(t.start, t.end)`), so regex, string and template edits all change the hash. Before trusting the check, prove it: an edited regex must change the hash, and an edited comment must not."*
- **Shell (C2).** In M3 shell, add: *"`norm` must exit 0 and print non-empty output on both sides; otherwise the check FAILS. Also run `bash -n` on the HEAD temp copy. Record both exit codes in the worklog."*

**PC-4 (C3–C6): correct four drafts and pointers.** Recommended: apply all four.
- **C3.** Header line 2 of skill-ownership-hook.sh becomes `# agent_type is the caller's own at any depth; the payload has no depth field, so a 2-hop leaf and a session look alike.` Add `test/skill-ownership-hook.test.js` to V5's "stays true with no edit" list.
- **C4.** The .mjs header pointer becomes "report 2026-08-02-faithful-carry-of-an-approved-plan, §6 and §10 row 3".
- **C5.** The turn-completion pointer becomes "(ADR-030 Decision 7; mechanism: ADR-030 "Addendum — 2026-07-23", "Two design questions this settles")".
- **C6.** The two function comments become:
  - hashMatches: `// Prefix match, ≥7 hex (0204 plan, ruling Q4; POINTER enforces the length).` / `// A separate function so prove-red can neuter it.`
  - containsExactBytes: `// Strict: a driver that trims the file's final newline is denied unless the prompt re-supplies it.` / `// A separate function so prove-red can neuter it.`

**PC-5 (C7 + C8): two method wordings.** Recommended: add both.
- **M2.** Add: *"code-comments.md rule 3 bans a history tag — a note of which review changed the line. A pointer to where a still-needed reason is recorded is rule 2's one-line pointer, and is allowed. The comment states the reason itself first, then names task and record ('0052 review R1')."*
- **M4h.** Add: *"Each comment line is 110 columns at most."*

## Open questions for the owner, at plan approval
- **Q1:** see PC-2. If PC-2 option 1 is accepted, Q1 is gone. Otherwise, recommended (a): leave the block for 0226. Knock-on: none (checked). It blocks only the mirror block.
- **Q2 (M1):** a reason already recorded in a closed task's plan, worklog or review. Recommended: point to it rather than copy it into the knowledge base. Does not block.
- **Q3 (M4d):** ADRs' `path:NNN` cites into the cleaned files. Recommended: leave them as records of a past revision rather than update them in each unit. Does not block.
