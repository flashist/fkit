# Worklog — 0507: pilot comment cleanup of the hook scripts and `skills-for-role.sh`

- **Step:** Build, spawned by `fkit-sprint-ship-loop` (driver: `fkit-lead`), Sprint 12 run, under the
  ADR-055 declared-approval marker. Plan: this folder's `plan.md`, blob `5ee3cdd5` (checked with
  `git hash-object` before any edit — it matched the carried pointer).
- **Owner approval relayed:** `AskUserQuestion` in the `fkit-lead` session, 2026-10-16 — fixes "All
  recommended (Recommended)", Q2 "Point to it (Recommended)", Q3 "Leave them (Recommended)", plan
  "Approve (Recommended)".
- **Nothing committed or pushed.** No init run. `.claude/skills-for-role.sh` untouched.

## Method for the series

This section is the source for `0508`–`0515`. It is the plan's §2 (M1–M4) with the adopted PC-3 and
PC-5 amendments folded in, and the owner's Q2 and Q3 answers recorded where they apply.

**Who decided what (V7).**
- **Owner, at plan approval (2026-10-16):** Q2 (M1 item 1, last bullet — point to a closed task's
  record, do not copy it); Q3 (M4d — leave ADRs' `path:NNN` cites alone); PC-1 to PC-5 adopted
  ("All recommended"), which brings in the PC-3 proof amendments and the PC-5 wordings below, and
  turns the old Q1 (the `skills-for-role.sh` mirror block) into a plan choice.
- **Owner, review round 1 (2026-10-17, `AskUserQuestion` in the `fkit-lead` session), on review R4:**
  *"Leave the ADRs (Recommended)"* — an ADR that quotes deleted comment words, or cites a deleted
  heading or divider, is left as it is and listed in the unit's V5 (M4d below).
- **Chosen by the plan, not asked:** everything else in M1–M4.
- **Amended after review round 1 (0507 review R1, R2, R4):** M3's JS proof and secondary check, M4d,
  M4h. Each amendment is marked **(R1)**, **(R2)** or **(R4)** where it sits.
- **Amended after review round 2 (0507 review R6, R7):** M3 gains the rule-4 check (shebang, directives,
  file mode); M4h's limits name the shell case. Marked **(R6)** and **(R7)**.
- **Amended after review round 3 (0507 review R8, R9; Codex X1):** M4h's data-run route gains a proof
  that each listed run is really data; M3's mode check compares with HEAD; the directive pattern also
  matches `/*! …`. Marked **(R8)**, **(R9)** and **(X1)**. The owner ruled "Fix and close (Recommended)"
  (2026-10-17, `AskUserQuestion` in the `fkit-lead` session): no round 4.

### M1 — Where a reason goes
1. **Already recorded somewhere durable:** write a one-line pointer; do not copy the reason. Durable
   homes:
   - an ADR, cited by number plus section or heading;
   - a convention, cited by file name;
   - a dated report, cited by file name plus heading;
   - a closed task's own record, cited by task ID + plan / worklog / review + the finding or ruling
     ID, e.g. "0204 review R12". A closed task folder never moves, so these IDs stay valid.
     **(Owner, Q2: "Point to it".)**
2. **Not recorded, and it fits in 1–2 lines:** keep it where it is, shortened.
3. **Not recorded, and it needs more than 2 lines:** move it first, then point to it.
   - A reason behind a decision an ADR already owns → a dated addendum to that ADR. Never rewrite the
     ADR.
   - A rule for how code is written across many files → a convention.
   - A reason specific to one component (a measured gotcha, an analysis of remaining risk) → one
     report per unit, `ai-agents/knowledge-base/reports/<date>-code-comment-reasons-<unit>.md`, one
     section per file and function.

   Each unit's plan names every destination. If the build finds a destination its plan did not name,
   it stops and asks.

### M2 — Task, ADR and ruling tags
- Keep a tag only where it points to a place that holds a reason the reader needs. Check the target
  really holds it.
- Drop a tag that only records which task wrote the line.
- Write a task as its folder ID (`0204`), never "task 43" or "task 70".
- Write findings and rulings with their task: `0127 review R4`, `0204 plan Q3`. Never a bare "R4" or
  "Q3". (Inside one comment that already named the task, a following ID may lean on it: "0204 review
  R8, R1 … (review R1, R13)".)
- If a review ledger reuses a finding ID across rounds, the pointer names the round. Before writing a
  pointer, check the ID is unique in that ledger's findings table.
- Drop dates, unless a date is the only name a ruling has and no better home exists.
- **(PC-5)** `code-comments.md` rule 3 bans a history tag — a note of which review changed the line. A
  pointer to where a still-needed reason is recorded is rule 2's one-line pointer, and is allowed. The
  comment states the reason itself first, then names task and record ("0052 review R1").

### M3 — The comments-only proof for V1
**Shell (primary, parser-based).** Wrap the whole file in a function and print bash's normalized copy,
which has no comments:

```bash
norm() { /bin/bash -c 'eval "__fkit_body() {
$(cat "$1")
}"; declare -f __fkit_body' _ "$1"; }
```

Run `norm` on a temp copy of the HEAD version (`git show HEAD:<file>`) and on the working file; the two
outputs must be byte-identical. Text inside quotes and heredocs is kept, so the `#` lines of an awk
program are data and any change to them shows up.
- **(PC-3)** `norm` must exit 0 and print non-empty output on both sides; otherwise the check FAILS.
  Also run `bash -n` on the HEAD temp copy and the working file. Record the exit codes.
- Use the same `/bin/bash` on both sides (`declare -f` output depends on the bash version; here 3.2.57).
- On bash 3.2 `declare -f` keeps a multi-line `$( … )` verbatim, comments included: a comment edit there
  reads as "different". That is a false alarm, never a false pass — compare that span by hand.

**JS (primary, parser-based).** Tokenize with the acorn copy built into node and hash each token's raw
source text. **(PC-3)** Raw text, not `type:value`: acorn reports every regex as `regexp:[object Object]`,
so a `type:value` hash cannot see a regex edit.

```js
// node --expose-internals jstok.cjs <file>
const fs = require('fs'); const crypto = require('crypto');
const { tokenizer } = require('internal/deps/acorn/acorn/dist/acorn');
const src = fs.readFileSync(process.argv[2], 'utf8');
const h = crypto.createHash('sha256'); let n = 0;
for (const t of tokenizer(src, { ecmaVersion: 'latest', sourceType: 'module' })) { h.update(src.slice(t.start, t.end)); h.update('\0'); n++; }
console.log(h.digest('hex') + ' tokens=' + n);
```

- **(PC-3) Prove it before trusting it** (done in this unit, see V1): a comment edit must give "equal";
  a regex edit, a string edit and a template edit must each give "different".
- The token hash ignores where newlines fall, so the JS proof is all four together: the token hash, the
  diff-line check below, `node --check`, and the file's own test suite under `npm test`.
- ⚠️ The acorn path is internal to node, not a public API. If a later node drops it, fall back to the
  diff-line check plus a written statement that no changed hunk sits inside a string or template.
- Deleting a multi-line `/* … */` could change automatic semicolon insertion without the hash seeing it.
  **(R1)** Close that gap with an AST compare: parse both sides with the same acorn, drop the `start` /
  `end` positions, and hash the rest. Both parses must succeed, or the check FAILS. Comments are not in
  the AST; an ASI change is.

  ```js
  // node --expose-internals jsast.cjs <file>
  const fs = require('fs'); const crypto = require('crypto');
  const { parse } = require('internal/deps/acorn/acorn/dist/acorn');
  const src = fs.readFileSync(process.argv[2], 'utf8');
  const ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', allowHashBang: true });
  const s = JSON.stringify(ast, (k, v) => (k === 'start' || k === 'end' ? undefined : v));
  console.log(crypto.createHash('sha256').update(s).digest('hex'));
  ```

  Proved 2026-10-17 (node v24.13.0): `return /*⏎*/ 1` vs `return /* */ 1` → different (ASI);
  deleting a 3-line `/** … */` and a trailing `//` → equal; regex `{7}` → `{8}` → different;
  `carry-check-hook.mjs` HEAD vs this unit's tree → equal. Run it beside the token hash on every JS
  file with a changed `/*` hunk. If it is unavailable, compare such a hunk by hand.

**Both languages (secondary: the brief's V1 line check).**

```bash
git diff -U0 -- <files> | grep -E '^[-+]' | grep -vE '^(\+\+\+|---) ' | grep -vE '^[-+][[:space:]]*(#|//|$)'
```

It must print only the listed exceptions: code lines whose trailing comment changed. The parser check
proves the code part of those lines is unchanged. ⚠️ On this machine `grep` is aliased to `ugrep` in
the interactive shell; run the checks with `/usr/bin/grep` (or from a `bash` script).

**(R1)** For a unit with JS block comments, the last filter becomes
`grep -vE '^[-+][[:space:]]*(#|//|/\*|\*([[:space:]/]|$)|$)'`, so an edited ` * …` or ` */` line is not
listed as a code exception. It still lists a shell `*)` case arm (checked). It also hides a JS line
that starts with `* ` as a multiplication continuation; the token hash is what proves those lines.

**(R6) Rule 4 — machine-read comments (shebangs, directives) and the file mode.** Every check above
treats a shebang as a comment: `norm`, the raw-token hash and the AST hash are all unchanged when
`#!/usr/bin/env node` becomes `… deno` or is deleted, or `#!/bin/bash` becomes `#!/bin/sh`, and the
secondary grep hides every `#` line. A changed shebang changes how a directly-run file runs, so check it
on its own, per file, HEAD copy vs working file:

```bash
# rule4.sh <HEAD-copy> <working-file> [label]  — exit 1 on any finding
old="$1"; new="$2"; label="${3:-$2}"; rc=0
h1="$(head -n 1 "$old")"; w1="$(head -n 1 "$new")"
case "$h1$w1" in *'#!'*) if [ "$h1" != "$w1" ]; then echo "$label: LINE 1 CHANGED: [$h1] -> [$w1]"; rc=1
  else echo "$label: line 1 equal"; fi ;; *) echo "$label: no shebang either side" ;; esac
hits="$(git diff --no-index -U0 -- "$old" "$new" | /usr/bin/grep -E '^[-+]' | /usr/bin/grep -vE '^(\+\+\+|---) ' \
  | /usr/bin/grep -iE '(#|//|/\*|\*)[[:space:]!]*(shellcheck|eslint|@ts-|istanbul|c8[[:space:]]|prettier-ignore|jshint|global[[:space:]]|noqa|vim:|-\*-|sourceMappingURL|@flow|@license|@preserve)')"
[ -n "$hits" ] && { echo "$label: DIRECTIVE LINE IN DIFF:"; printf '%s\n' "$hits"; rc=1; }
exit $rc
```

- Line 1 must be byte-equal whenever either side starts with `#!` (so a shebang edited, deleted or
  added fails). A directive line must not appear among the changed lines; if a unit must move one, it
  lists it as an exception and shows it still sits directly above the same code line.
- The directive pattern can also match ordinary prose ("global settings"): a false red, read it by eye.
  **(X1)** `[[:space:]!]*` (not `[[:space:]]*`) so a `/*! @license … */` line is caught too (checked).
- Also run `git diff HEAD --summary -- <files> | grep mode`: it must print nothing (no file-mode change).
  **(R9)** `HEAD` is required: without it git compares the index with the working tree, so a staged mode
  change prints nothing. Proved 2026-10-17 in a scratch repo: `chmod 644` on a 100755 file, then
  `git add` → `git diff --summary` empty, `git diff HEAD --summary` prints `mode change 100755 =>
  100644`; after restoring the mode, both are empty.
- Proved 2026-10-17 on HEAD copies: `node` → `deno` in `bin/generate-structure-manifest.mjs`'s shebang →
  LINE 1 CHANGED (the token hash stayed `099cd631…` on both, confirming R6); shebang deleted → CHANGED;
  shebang added to a file without one → CHANGED; `#!/bin/bash` → `#!/bin/sh` in
  `skill-ownership-hook.sh` → CHANGED; its `# shellcheck source=` line deleted → DIRECTIVE LINE; a
  comment reworded on line 3 → clean (exit 0).

### M4 — Refinements to the brief's "Rules for every unit"
- **a. Rule 1:** an awk, sed or jq program inside quotes is data, including the comments inside it. The
  parser check enforces this.
- **b.** Section dividers (`# --- read the payload … ---`) only say WHAT: delete them. If a live
  document quotes one, re-anchor that cite first.
- **c. Rule 5:** re-anchor a live cite on code text (a function name or a line of code), never on
  comment text.
- **d. Rule 5 — which documents to fix and which to leave:**
  - **Fix** live text: skills, agents, conventions, `architecture.md`, tests and code.
  - **Leave** these, because each describes a past revision: ADR `path:NNN` cites **(owner, Q3:
    "Leave them")**, dated reports, closed task folders, review ledgers, sprint boards (the producer
    owns them), and other tasks' open briefs.
  - **One exception:** if the unit deletes the exact text an open brief quotes and depends on, append a
    dated one-line note to that brief and leave its original bytes untouched (0519's form). Cheaper
    when it fits: keep the quoted phrase in the shortened comment, so no brief needs a note (this unit
    did that for 0305 — decision log D3).
  - A line that only shifted position is never a reason to edit any of these documents.
  - **(R4; owner, 2026-10-17: "Leave the ADRs")** An ADR that **quotes** comment words this unit
    deletes, or cites a deleted **heading or divider** (`§"gate: …"`), is treated like Q3: left as a
    record of a past revision. Each such quote or cite is listed in the unit's V5 table, by ADR and the
    quoted words. Search for them on purpose: run S3b's 30-char pieces over
    `ai-agents/knowledge-base/decisions/` too.
  - **(R2)** A deleted divider's label (`SKIP 3`, `pass 1b`, `CHECK A` …) is shorter than an S3b piece,
    so search each label on its own over live text, open briefs and ADRs. A live hit is re-anchored on
    code text (M4b, M4c).
- **e. Rule 3:** reference-integrity does not scan code comments, so check each pointer by hand: `ls`
  the file, then `grep` for the heading, finding ID or ruling ID. Every check goes into V4's table.
- **f. Prove-red seds:**
  - If a prove-red sed matches a whole line of code, that line must not gain a trailing comment.
  - Before editing a file, `grep -F` its name in `test/prove-red.sh` and read every mutation that
    touches it.
  - Never write a comment that contains a mutation's search string, or the sed would change the
    comment too.
- **g. Rule 6 correction:** `.claude/skills-for-role.sh` is tracked in git and init does not refresh it
  (0519). Never edit it in this series.
- **h. How V6 counts comment length:**
  - A run of consecutive full-line comment lines is one comment, including lines that are only `#`.
  - Keep two comments apart with a real blank line.
  - Shebangs and shellcheck directives are not counted.
  - **(PC-5)** Each comment line is 110 columns at most.
  - **(R1)** In a JS file a `/* … */` or `/** … */` block that starts its line is a comment too, every
    line of it, its `/**` and `*/` lines included (as lines that are only `#` count). So a 1-line JSDoc
    written over three lines is a 3-line comment; write it `/** … */` on one line. A run of `//` lines
    and a block that touch count as one comment. The language decides the marker: `#` in shell, `//`
    and `/*` in JS (a JS line starting `#` is a private field, a shell line starting `//` is code).
  - The command (awk once per file, because BSD awk has no ENDFILE). **(R1)** Replaces the `#|//`-only
    version used in this unit's build, which never saw a block comment — a false green for 0508–0515.
    On this unit's 7 files both versions give the same result.

    ```bash
    for f in "$@"; do
      awk -v F="$f" '
        function last(s, t,   i, p) { p = 0; while ((i = index(s, t)) > 0) { p += i; s = substr(s, i + 1) } return p }
        function flush() { if (n > 2) printf "%s:%d: comment run of %d lines\n", F, start, n; n = 0 }
        function count() { if (n == 0) start = NR; n++ }
        BEGIN { js = (F ~ /\.([cm]?js|ts)$/) }
        inblk { count(); if (index($0, "*/")) inblk = 0; next }
        /^#!/ && NR == 1 { flush(); next }
        !js && /^[[:space:]]*# shellcheck / { flush(); next }
        js && /^[[:space:]]*\/\*/ { count(); if (last($0, "/*") > last($0, "*/")) inblk = 1; next }
        (js && /^[[:space:]]*\/\//) || (!js && /^[[:space:]]*#/) { count(); next }
        { flush() }
        END { flush() }' "$f"
    done
    ```

    Width, in Unicode code points, with the same block tracking:

    ```bash
    perl -CSD -ne '
      chomp; my $js = $ARGV =~ /\.([cm]?js|ts)$/; my $c = 0;
      if ($in) { $c = 1; $in = 0 if m{\*/} }
      elsif ($js ? m{^\s*(//|/\*)} : m{^\s*#}) { $c = 1; $in = 1 if m{^\s*/\*} && rindex($_, "/*") > rindex($_, "*/") }
      print "$ARGV:$.: ", length, "\n" if $c && length > 110;
      if (eof) { close ARGV; $in = 0 }' <files>
    ```

    Proved 2026-10-17: on `test/structure-spec.test.js` the old awk finds 2 runs over 2 lines, the new
    one 8 (its JSDoc blocks, e.g. the 10-line one at `/**` "Extract one inventory table"); a 1-line
    `/** one */` is not flagged; a JSDoc line over 110 columns is. Limits: a `/*` or `//` inside a
    string or template that starts its line reads as a comment (a false red: check it by eye); a block
    comment after code on the same line is a trailing comment and is not counted.
  - **(R7) The shell case of that limit, and its route.** A `#` line inside a quoted awk, sed or jq
    program is data (M4a, the brief's rule 1), but the awk above counts it, and the width check
    measures it. Such lines are never edited, so the unit lists each such run (or over-wide line) as a
    **named V6 exception — rule-1 data**, by the program it sits in and its opening words, and the
    `norm` check proves it unchanged. **(R8)** Before listing a run, prove it is data: `norm` keeps
    quoted text and strips real comments, so every line of a data run appears verbatim in the `norm`
    output, and a real comment's lines do not. A run is listed only if all its lines survive:

    ```bash
    # datarun.sh <file> <first-line> <run-length>  (norm as in M3)
    f="$1"; a="$2"; n="$3"
    out="$(mktemp)"; norm "$f" > "$out" || exit 2; [ -s "$out" ] || exit 2; miss=0
    while IFS= read -r l; do /usr/bin/grep -qxF -- "$l" "$out" || miss=$((miss + 1)); done \
      < <(sed -n "${a},$((a + n - 1))p" "$f")
    [ "$miss" = 0 ] && echo "DATA" || { echo "REAL COMMENT ($miss/$n lines stripped)"; exit 1; }
    ```

    Proved 2026-10-17 on `dashboard.sh`: the 33-line run under "# ── U: THE LOUD GUARD" → DATA; the
    62-line file header → REAL COMMENT (62/62 stripped); over all 87 runs the new awk reports, 8 DATA and
    79 REAL COMMENT (the review's count). A very short or generic run (a lone `#`) could match an
    unrelated data line: read such a run by eye. Known case: `claude/skills/fkit-status/dashboard.sh` (0509), whose
    single-quoted awk programs hold such runs — the new awk reports the one under "# ── U: THE LOUD
    GUARD" as 33 lines, and that block says it is "STRING DATA inside the single-quoted awk program".
    The 0509 build must tell these runs from the file's real comments, which also run long. **(R8)**
    Without the data proof above, a real comment wrongly listed as data would pass V6 — a false green;
    with it, the count itself only errs toward a false red.
- **i.** A comment that is wrong today is fixed or deleted (`code-comments.md` rule 6) — e.g.
  skill-ownership-hook's "today (pre-hook) it fails OPEN" (deleted in this unit).
- **j. (new, from this pilot)** The plan's per-file list names the big blocks. Small comments it does
  not name (a one-line trailing comment, a bare "(Q3)") follow M1–M4 too; the build applies the method
  and logs each such call in the decision log. Leaving a short, still-true comment untouched is always
  allowed.

## Baseline (before any edit, 2026-10-17)
- All 7 files equal to HEAD (`cmp` against `git show HEAD:<file>`).
- `ai-agents/knowledge-base/architecture.md` had **no** pre-existing diff (`git diff` empty), so V5's
  `architecture.md` hunk is this task's alone.
- `node --test test/*.test.js` → 1156 tests, 1156 pass, 0 fail.
- `bash test/prove-red.sh`, run alone → exit 0, "✓ hard gate PASSED" (baselines 0a–0p all 16 green, mutations 1–55 all 55 red each red at the named assertion).

## V1 — Comments only
**Proof of the proof (PC-3), on HEAD copies:**

| Edit made to a temp copy | Expected | Got |
|---|---|---|
| `.mjs`: a comment line reworded | equal | equal |
| `.mjs`: regex `{7,64}` → `{8,64}` | different | different |
| `.mjs`: string `'hook payload is not valid JSON'` + `!` | different | different |
| `.mjs`: template `unsafe plan path: ${path}` + one space | different | different |
| turn-completion: a header comment reworded | equal | equal |
| turn-completion: `whats_next_missing=1` → `0` | different | different |
| turn-completion: the awk program's `# toggle fenced region` reworded | different | different |

**Primary check, final tree vs HEAD:** all 7 equal — `bash -n` exit 0 and `norm` exit 0 with non-empty output on both sides for each shell file (normalized sizes HEAD = working: skill-ownership 2441, turn-completion 3889, shiploop 1211, askuq 979, carry-check.sh 278, skills-for-role 1432 bytes); `.mjs` token hash `d176dc41…` on both sides, 1101 tokens. The `.mjs` is also clean under `node --check`.

**Secondary check (brief's diff-line grep), final tree:** prints exactly these lines, all of them the
listed exceptions — a code line whose trailing comment was dropped or changed. The parser check above
proves the code part of each is unchanged.

| File | Function / line | Change |
|---|---|---|
| `skill-ownership-hook.sh` | `deny() {` | 5-line trailing comment → one line above the function |
| `skill-ownership-hook.sh` | `extract_top() {` | trailing comment deleted |
| `skill-ownership-hook.sh` | `extract_tool_input_skill() {` | 3-line trailing comment → one line above |
| `skill-ownership-hook.sh` | `is_identifier() {` | trailing comment deleted |
| `turn-completion-hook.sh` | `allow() { exit 0; }` | trailing comment shortened |
| `turn-completion-hook.sh` | `block() {` | trailing comment shortened |
| `turn-completion-hook.sh` | `extract_top() {`, `extract_bool() {` | trailing comments deleted |
| `turn-completion-hook.sh` | `rm -f "$marker" 2>/dev/null \|\| :` | trailing `# consume — turn-scoped` deleted (D4) |
| `shiploop-marker-hook.sh` | `allow() { exit 0; }`, `extract_top() {` | trailing comments deleted |
| `shiploop-marker-hook.sh` | `is_identifier() {` | trailing comment shortened |
| `askuserquestion-marker-hook.sh` | `allow() { exit 0; }`, `extract_top() {`, `is_identifier() {` | same as shiploop (D2) |
| `carry-check-hook.mjs` | `function skip(reason) {` | trailing comment reworded, bare "(Q3)" → "(0204 plan, ruling Q3)" (D5) |
| `carry-check-hook.mjs` | `if (pointers.length === 0) …` | trailing `// ungated — see THE UNGATED LIMIT above` deleted (its heading is gone) |
| `carry-check-hook.mjs` | `warnNearMisses(nearMisses.filter(…));` | trailing `// R11: …` deleted (D6) |

Raw output: `git diff -U0 -- <the 7 files> | /usr/bin/grep …` printed 36 lines (18 removed, 18 added), exactly the code lines in the table above (no other code line appears).

Also: `bash -n` exit 0 on all 6 shell files (HEAD and working); `node --check claude/carry-check-hook.mjs`
exit 0. `skills_for_role` output byte-identical before and after for `lead producer coder architect
reviewer adversarial-reviewer wiki`, an unknown role and an empty argument (`cmp` of the two captures: identical).

**Review round 1 (2026-10-17) — re-proof after the R2 and R3 fixes.** Files edited in round 1:
`claude/askuserquestion-marker-hook.sh` (R3), `test/prove-red.sh` and `test/turn-completion-hook.test.js`
(R2); each change is to full comment lines only, and no line count changed.
- Shell `norm` vs HEAD (bash 3.2.57; `bash -n` and `norm` exit 0, non-empty, both sides): equal for all
  6 hook shell files and for `test/prove-red.sh`.
- `test/turn-completion-hook.test.js` vs HEAD: raw-token hash equal (2179 tokens), the R1 AST hash equal,
  `node --check` exit 0.
- `carry-check-hook.mjs` HEAD vs tree: the R1 AST hash equal (not edited in round 1).
- Mutation 6's sed, dry-run on the current `turn-completion-hook.sh`: changes exactly one line.
  Mutation 5's search string `"AskUserQuestion" ] || allow` is still on one code line of the askuq hook
  and in no comment.

**Review round 2 (2026-10-17) — re-proof after the R5 fix.** `claude/carry-check-hook.mjs`, one full
comment line changed (the second line of the "A PROXY for the coder's condition (b)" comment):
- raw-token hash `d176dc41…` (1101 tokens) and AST hash `9e3f38bc…`, both equal to HEAD; `node --check`
  exit 0; the `function hashMatches…` / `function containsExactBytes…` lines untouched.
- **(R6) rule-4 check** on every file this unit touched (the 7 files, `test/prove-red.sh`,
  `test/turn-completion-hook.test.js`): line 1 equal on all 6 shell hooks and `test/prove-red.sh`; no
  shebang either side on `skills-for-role.sh`, the `.mjs` and the test file; no directive line among the
  changed lines; `git diff --summary` shows no mode change.
- New M4h awk and width on the `.mjs`: no run over 2 lines; no line over 110 columns (the new line is 108).

Prove-red's mutations on these files (1, 3, 4, 5, 6, 7, 23, 24, the unmutated-copy steps) were read
before editing (M4f). No line they match gained a comment; no new comment contains their unanchored
search strings (`had_marker=1`, `"AskUserQuestion" ] || allow`,
`[ -e "$cwd/.fkit/state/shiploop-$session_id" ]`). The `function hashMatches…` and
`function containsExactBytes…` lines are byte-identical.

## V2 — Tests
Ran (full `npm test`, in its two halves, each alone with the 1-minute load average below 8):
- `node --test test/*.test.js` → 1156 tests, **1156 pass, 0 fail** (same as baseline).
- `bash test/prove-red.sh` → exit 0, **"✓ hard gate PASSED"**: baselines 0a–0p all 16 green, mutations 1–55 all 55 red at their named assertion (same as baseline; no `board-narrow` timeout).
- After this worklog was written: `npm run test:docs` (includes `coordination-citation-policy` and `reference-integrity`) → 410 tests, **410 pass, 0 fail**.
- Also: each prove-red sed on these files (mutations 1, 3, 4, 5, 6, 7, 23, 24) dry-run against the edited files: every one still matches.

Skipped: re-running the live hooks by hand in a real session (comments only, proven by M3). The loop's own Verify step re-runs the full suite.

**Review round 1 (2026-10-17):** `node --test test/turn-completion-hook.test.js
test/askuserquestion-marker-hook.test.js` → 36 tests, **36 pass, 0 fail** (1-minute load average 5.4
before the run). `npm run test:docs` after the worklog and ledger edits (load average 5.75) → 410 tests, **410 pass, 0 fail**.
**Not run in round 1:** the full `npm test` and `test/prove-red.sh` — on the lead's instruction; its
independent Verify runs them. The prove-red edit is one comment line, proven equal by `norm`.

**Review round 2 (2026-10-17):** `node --test test/carry-check-hook.test.js
test/spawned-write-marker.test.js` → 36 tests, **36 pass, 0 fail** (1-minute load average 4.12 before
the run). `npm run test:docs` after the worklog and ledger edits (load average 4.25) → 410 tests,
**410 pass, 0 fail**.
**Not run in round 2:** the full `npm test` and `test/prove-red.sh` (the lead's Verify runs them).

## V3 — Count
Command, both times: `/usr/bin/grep -cE '^[[:space:]]*(#|//|\*|/\*)' <file>` (it counts the shebang too,
both times).

| File | Before | After |
|---|---|---|
| `claude/skill-ownership-hook.sh` | 80 | 22 |
| `claude/turn-completion-hook.sh` | 69 | 20 |
| `claude/shiploop-marker-hook.sh` | 33 | 12 |
| `claude/askuserquestion-marker-hook.sh` | 31 | 10 |
| `claude/carry-check-hook.sh` | 21 | 6 |
| `claude/carry-check-hook.mjs` | 116 | 38 |
| `claude/skills-for-role.sh` | 53 | 23 |
| **Total** | **403** | **131** |

`skills-for-role.sh` keeps 16 lines of the 0226 mirror block unchanged (V6 exception).

## V4 — Nothing lost
**Reasons moved into the knowledge base: none.** Every long reason in these files already had a durable
home (M1 item 1), so each comment became a pointer; no report, convention or ADR addendum was written.

**Pointer table — every pointer in the new comments, checked by hand (M4e).** "Holds it" = `ls` the
file, then `grep` the heading / ID, then read the passage.

| File | Pointer | Target checked | Holds the reason? |
|---|---|---|---|
| skills-for-role | ADR-018 | ADR-018 Decision item 3: "Reads `skills_for_role()` … as the sole source of truth" | yes |
| skills-for-role | ADR-033 | ADR-033 §Decision: movers producer-only, hook-enforced | yes |
| skills-for-role | ADR-047 §4 | heading "### 4. The movers — `/fkit-sprint-done` and `/fkit-sprint-cancelled`": "Producer-only, under ADR-033's reasoning applied verbatim" | yes |
| skills-for-role | ADR-033 "The limit" | heading "## The limit — stated plainly …": separation of the closing identity, not prevention | yes |
| skills-for-role | ADR-025 amendment A2, kept by ADR-033 | ADR-025 "## Amendment (2026-07-19 …)", item "A2 — `fkit-adversarial-reviewer` is excluded from the movers"; ADR-033 §Decision: "The adversarial reviewer never had them and still does not" | yes |
| skill-ownership-hook | ADR-018 | ADR-018 Decision item 3 (the `PreToolUse` gate, real caller's `agent_type` at any depth) | yes |
| skill-ownership-hook | 0052 review R1 | `0052-…/review.md` — R1 is unique in the findings table; the coder response records the live retest: the JSON route blocks only with `hookEventName` present | yes |
| skill-ownership-hook | `test/skill-ownership-hook.test.js` pins the JSON shape | the test asserts `hookEventName` (7 occurrences) | yes |
| skill-ownership-hook | ADR-018 Decision 3 (`set -u`; error → deny) | Decision item 3: "any internal hook error … MUST resolve to an explicit deny" | yes |
| skill-ownership-hook | ADR-018 (no `agent_type` → deny) | ADR-018 Consequences: "Decision 3 already gives for an absent `agent_type`" a deny | yes |
| turn-completion | ADR-030 | ADR-030 §Decision items 2 (presence checks) and 5 (block once) | yes |
| turn-completion | ADR-030 Decision 6 | item 6 "Fail open, always" | yes |
| turn-completion | ADR-030 Decision 7; ADR-030 "Addendum — 2026-07-23", "Two design questions this settles" | item 7 (skip conditions); addendum subsection: "registered on `Stop` only, never `SubagentStop` … the unescapable-block hazard is closed by wiring" | yes |
| turn-completion | ADR-030 "Addendum — 2026-07-23"; 0127 review R4 | addendum "### Marker lifetime / confidence rule": a missing marker is trusted only when the state dir exists and is writable; `0127-…/review.md` R4 unique, response "CORRECT — hardened" | yes |
| turn-completion | ADR-030 Decision 5 | item 5 "Block at most once per turn" | yes |
| turn-completion | ADR-030 Decision 7 (adversarial reviewer) | item 7 lists "the adversarial reviewer" | yes |
| turn-completion | 0129 | `0129-transcript-independent-ship-loop-skip-signal/` — plan: the authoritative `command_name` marker replaces the transcript scan | yes |
| shiploop-marker | 0129 | as above | yes |
| askuq-marker | ADR-030 "Addendum — 2026-07-23" | "### The presupposition this corrects": a `Stop` payload carries no tool-call list; "### The mechanism now shipped": this hook writes, the Stop hook consumes | yes |
| carry-check.sh | 0204; 0204 brief, caveat 4 | `0204-…/brief.md` "FIVE caveats", item 4: the siblings' `"[^"]*"` extraction is insufficient; needs real JSON parsing | yes |
| carry-check.sh | ADR-017 rule 2 | ADR-017 §Decision rule 2: "Invocation is `bash <path>`, never `./<path>`" | yes |
| carry-check.sh | 0204 plan, ruling Q3 | `0204-…/plan.md` rulings: "Q3 (infrastructure faults): Fail open + loud stderr" | yes |
| .mjs | report `2026-08-02-faithful-carry-of-an-approved-plan`, §6 and §10 row 3 | "## 6. Q5 — Is any of this machine-checkable?" (driver-side hook + five caveats); "## 10. Follow-ups", row 3 "Build the `PreToolUse`/`Task` carry-check hook" | yes |
| .mjs | ADR-017 rule 2; ADR-014 | as above; ADR-014 §Decision 4 "Zero devDependencies" | yes |
| .mjs | condition (b) quote; ADR-021 | the quote stays verbatim as `test/spawned-write-marker.test.js`'s header describes it; ADR-021: the owner channel is session-only, so approval leaves no artifact | yes |
| .mjs | 0204 plan, ruling Q1 (and Q3) | plan rulings "Q1 (gate trigger): Pointer line alone"; Q3 as above | yes |
| .mjs | ADR-018 (JSON deny route) | Decision item 3: explicit `hookSpecificOutput.permissionDecision` deny | yes |
| .mjs | 0204 plan, ruling Q4 | plan rulings "Q4 (hash strictness): Prefix, ≥7 hex" | yes |
| .mjs | 0204 review R3 | R3 unique; response: near-miss → one loud stderr line | yes |
| .mjs | 0204 review R11, R14 | R11 (warning fired on file-content lines), R14 (position-blind exclusion residual), each unique | yes |
| .mjs | 0204 review R2 | R2 unique: lexical path safety, symlink residual accepted | yes |
| .mjs | 0204 brief, caveat 2 | caveat 2: hard-gated on `plan.md` existing at spawn time | yes |
| .mjs | 0204 review R8, R1, R13 | R8 (set built from every readable file), R1 (mid-line cut, prefix rule), R13 (glued-tail residual), each unique | yes |
| .mjs | 0204 worklog, "Why PREFIX_MIN = 12" | bold paragraph of that name: the shortest Q2 literal is 12 chars | yes |
| .mjs | 0204 review R7, R9, R12 | R7 (pointer inside a pasted plan), R9 (wider residual), R12 (mutual pair reachable by nonce search; guard keeps it gated), each unique | yes |
| .mjs | 0204 worklog, first smoke run | worklog: smoke run against the real `0204/plan.md`, and decision D1 (scan outside the paste) | yes |
| .mjs | sprint-loop SKILL.md step 5 | `claude/skills/fkit-sprint-ship-loop/SKILL.md` step 5: carry by reference only and say so; a pointer-only spawn fails condition (b) | yes |

Uniqueness (M2): in `0052`, `0127` and `0204`'s `review.md`, every cited ID appears exactly twice — once
in *Reviewer findings*, once in *Coder response* — so no pointer needs a round.

**Spot-check help for the reviewer (V4 asks for ≥ 5):** the deleted text is in `git diff`. Suggested:
the 19-line "DENY IS THE … JSON ROUTE" history (0052 review R1); the 9-line "resolve the REAL caller's
role" block (WHAT plus a now-false "today (pre-hook) it fails OPEN"); turn-completion's "SKIP 3" (0129 /
0127 review R8 history); the `.mjs` "THE UNGATED LIMIT" (0204 plan Q1, report §6); the `.mjs` 15-line
file-content block (0204 review R1, R8, R13 and the 0204 worklog).

## V5 — Inbound references
Searches (re-run at build time; S1/S2 over live text: `claude test bin`, conventions, `architecture.md`,
`PROJECT.md`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `CONTRIBUTING.md`; S1 also over the whole repo):
- **S1** — `path:NNN`, `#L` and "line N" cites:
  `grep -rnE '(skill-ownership-hook|turn-completion-hook|shiploop-marker-hook|askuserquestion-marker-hook|carry-check-hook|skills-for-role)\.(sh|mjs)(:[0-9]+|#L[0-9]+|[^.]{0,40}\blines? [0-9]+)'`
- **S2** — prose about their header or comments: the same names followed within 80 chars by
  `header|comment|own words|warning block`.
- **S3** — quotes of deleted comment text: (a) 24 distinctive phrases (e.g. "resolve the REAL caller's
  role", "THE UNGATED LIMIT", "RECORDS ONLY", "WHAT GREEN MEANS", "ALL FOUR MOVERS ARE PRODUCER-ONLY",
  "carry-fidelity PROXY", "pass 1b", "the paste check") over the whole repo; (b) every deleted or
  changed comment line, cut into 30-char pieces, over live text and every open brief.

| Hit | Kind | Action |
|---|---|---|
| `architecture.md`, ownership sentence: `` `claude/skills-for-role.sh:54` — `skills_for_role() {` `` | live, S1 | **fixed** → `:26` (anchored on the same code) |
| `architecture.md`, hook paragraph: `` `claude/skill-ownership-hook.sh:111-137` ``, *"resolve the REAL caller's role"* | live, S1 + S3 | **fixed** → `:66-81`, re-anchored on code: from `` agent_type="$(extract_top "$payload" agent_type)" `` through the `does not own skill` deny (M4c) |
| `test/spawned-write-marker.test.js` header: the hook's header names condition (b) and paraphrases it as "it carries a concrete APPROVED plan verbatim" | live, S2 | stays true, no edit — both kept verbatim in the `.mjs` header |
| `test/skill-ownership-hook.test.js`, comment above the reviewer-owns-stateful-review test: "the payload has no depth field … see the hook's own header comment" | live, S2 | stays true, no edit — header line 2 now says it (PC-4 C3; D1) |
| open brief 0305: quotes the hook's comment *"the hook is registered with matcher `Skill` in `build_settings()`"* | open brief, S3b | phrase **kept** in the new comment, so the quote still resolves; brief untouched (D3) |
| open brief 0226: quotes the mirror warning block | open brief | block left byte-identical (PC-2) |
| open briefs 0403, 0224, 0225, 0187: line cites into these files | open brief, S1 | left — lines only shifted; quoted code unchanged (M4d, PC-1) |
| `test/*-hook.test.js`, `test/skill-ownership-hook.test.js`, `test/carry-check-hook.test.js`, `claude/fkit-claude.sh`, `test/prove-red.sh`, sprint-loop `SKILL.md`: share phrases ("RECORDS ONLY", "WHAT GREEN MEANS", "time-of-check only", "pass 1b", "the paste check", the movers wording) | live, S3 | their own text, not quotes of these comments — no edit. "pass 1b", "condition (b)" and "paste check" survive in the `.mjs` anyway |
| other S3b hits (filenames, `hookSpecificOutput.permissionDecision`, mover banners in skills, `PROJECT.md`, `sprint-status-vocabulary.md`, `scaffold/CLAUDE.md`) | live | generic shared wording, not a quote of a deleted comment — no edit |
| ADRs 018, 025, 030, 031, 032, 033, 034, 038, 044 (`path:NNN` cites); ADR-055 quotes *"THE UNGATED LIMIT"*; ADR-047 §4 says "the in-file comment above `skills_for_role()` records why" | ADR | left (owner Q3; M4d). ADR-047's claim still holds: the new comment states why the skills, mirrors and map move together |
| ADR-010 quotes "the single source of truth for fkit role" | ADR | left; the phrase survives in the new header anyway |
| **(R4)** ADR-037, its dated note on the carry-check hook, quotes three deleted `.mjs` comments: *"a carry-fidelity PROXY for the coder's condition (b), NEVER (b) ITSELF"*, *"It can NEVER establish that P is what the owner approved."*, and *"A declared pointer-only spawn with a matching hash is ALLOWED here … This hook does not enforce (b)."* | ADR, quote | left (owner, R4: "Leave the ADRs"; M4d). The facts still hold: the new header says "A PROXY for the coder's condition (b) … never (b) itself" and that it does not prove approval; the pointer-only path is unchanged code |
| **(R4)** ADR-049, hook table row for `askuserquestion-marker-hook.sh`: *"RECORDS ONLY — NEVER DENIES"* | ADR, quote | left (owner, R4). Still true: the new header says "Records only, never denies" |
| **(R4)** ADR-050, Claim 2: cites `claude/skill-ownership-hook.sh` §*"gate: only the Skill tool is in scope"*, a divider this unit deleted | ADR, heading cite | left (owner, R4). The gate it names is unchanged code: the `tool_name` check that denies a non-`Skill` payload (*"unexpected tool_name … reached a hook registered for Skill only"* is still in the hook) |
| **(R4)** ADR-055 § Context: quotes the `.mjs` heading §*"THE UNGATED LIMIT"* and its first sentence | ADR, quote + heading cite | left (owner, R4); already listed in the ADR row above. The rule it quotes (trigger = the pointer line alone) is unchanged code |
| **(R2)** `test/prove-red.sh`, Mutation 6 header: "(SKIP 3)"; `test/turn-completion-hook.test.js`, comment above the "a ship-loop session marker present" test: "SKIP 3 is now the …" | live, divider label | **fixed** (round 1): re-anchored on code — prove-red now names `shiploop-$session_id`; the test comment says "The ship-loop skip is …". The divider-label search (M4d, R2 bullet) found no other live hit: `SKIP 1`, `SKIP 2`, `pass 2`, `gate detection`, `FILE CONTENT` and the other labels have none; `CHECK A` / `check A`, `check B`, `pass 1`, `pass 1b` and "the paste check" still resolve in the edited files |
| dated reports, closed task folders and their ledgers, `ai-agents/sprints/` boards (including the Backlog board), `test/fixtures/`, `.fkit/tmp/` scratch files | frozen / not live | left (M4d) |
| `ai-agents/wiki-vault/` (pages and log) | wiki | left for the wiki role's next sync |
| `0507`'s own `plan.md` / `plan-review.md` | this task | not edited (ground rule) |

**Note for 0508:** `claude/fkit-claude.sh` carries a second copy of the mirror-checklist block; PC-2
applies there too (leave it for 0226).

## V6 — Rule followed
Commands: M4h. Result on the final 7 files: the only comment run over 2 lines is `skills-for-role.sh`'s 16-line mirror block (the named exception below); the only line over 110 columns is inside that same block (118).

**Named exception, kept longer on purpose:** `skills-for-role.sh`, the mirror-checklist block — "⚠️
CHANGING A ROLE'S SKILLS?" through "add it HERE FIRST" plus its closing "(Same caution as before this
file existed …)" line, 16 lines. It is 0226's deliverable under the owner's 2026-08-05 ruling (option
(b)); 0226's brief says to keep it verbatim, so 0507 leaves it byte-identical (PC-2). One of its lines
is also over 110 columns; same exception.

## V7 — Method recorded
See "Method for the series" above; its opening paragraph says which answers the owner gave and which
the plan chose.

## Decision log — obvious-winner calls and unattended changes (ADR-019 / ADR-055 audit)

Each entry: what, why it qualified. All are inside the approved plan's intent; none needed a new
knowledge-base destination (M1).

- **D1 — skill-ownership-hook header line 2 reworded to fit 110 columns.** PC-4 C3's text ("…; the
  payload has no depth field, so a 2-hop leaf and a session look alike.") is 118 columns, over PC-5's
  110 limit, and a third line would break V6. Written: "agent_type is the caller's own at any depth;
  with no depth field, a 2-hop leaf and a session look alike." Same facts, same words the test comment
  relies on ("no depth field"). Obvious winner: both adopted fixes satisfied, meaning unchanged.
- **D2 — askuserquestion-marker-hook's trailing comments treated like shiploop-marker-hook's.** The plan
  names "trailing comments → trimmed or deleted" for the shiploop hook only; the askuq hook has the same
  three lines on the same code. Same treatment (allow/extract_top deleted, is_identifier shortened).
  Obvious winner: sibling consistency, WHAT-only text.
- **D3 — skill-ownership-hook's Skill-gate comment keeps the phrase open brief 0305 quotes.** S3b found
  0305 quoting *"the hook is registered with matcher `Skill` in `build_settings()`"* — the plan's §5
  missed it. Instead of M4d's dated note (an edit to another brief, outside this build's file scope),
  the new comment keeps the phrase: "Defensive: the hook is registered with matcher "Skill" in
  build_settings(), but a misconfigured matcher must not open the gate for other tools." (2 lines).
  Obvious winner: the quote still resolves, no brief is touched, the comment still meets V6.
- **D4 — turn-completion: trailing `# consume — turn-scoped` on the `rm -f "$marker"` line deleted.** Not
  named by the plan; it repeats the marker comment two lines above ("Consume the AskUserQuestion
  marker … so it never leaks into the next turn"). WHAT/duplicate, M4 rule 2.
- **D5 — bare ruling and finding IDs given their task (M2).** `.mjs`: `skip()`'s trailing "(Q3)" →
  "(0204 plan, ruling Q3)" (comment reworded to fit); pass-1 item c "(Q4)" folded into a one-line
  "Only a readable, hash-matching file may vouch …" (the prefix rule is already stated at
  `hashMatches`); "(caveat 2)" → "(0204 brief, caveat 2)" (named by the plan).
- **D6 — `.mjs`: trailing `// R11: content lines are not alarms` deleted.** Bare ID (M2) and a duplicate
  of the warn-timing comment above `warnNearMisses`, which now points to 0204 review R11.
- **D7 — `.mjs`: two comments the plan's list did not name were reduced to ≤ 2 lines.** The pass-1 block
  (divider + 3 lines) → 2 lines; `readPointer`'s item a (2 lines, WHAT + "R2 of 0204") → 1 line with
  "0204 review R2" (the plan names "Path safety → 1 line"). Needed for V6; reasons kept by pointer.
- **D8 — `.mjs`: the `PREFIX_MIN = 12` reason kept as its own one-line pointer** ("0204 worklog, 'Why
  PREFIX_MIN = 12'") above the constant, separate from the 2-line file-content comment. The plan's
  file-content draft listed only R8/R1/R13; the "why 12" reason sat in the same 15-line block and is
  recorded in the 0204 worklog, so it gets a pointer rather than being lost (M1 item 1).
- **D9 — left untouched although not named:** turn-completion's one-line `asked_with_tool` comment; the
  `.mjs` one-liners "Every path below MUST end in allow(), deny(), or skip()", `deny()`'s trailing
  comment, `// nothing to check`, "A gated spawn must be checkable…", "The first failure among the gated
  pointers denies…". Each is one line and still true (M4j: leaving one is always allowed).
- **D10 — the mirror block's closing line kept.** "(Same caution as before this file existed — see git
  history on fkit-claude.sh for the original.)" directly follows "add it HERE FIRST…" with no blank
  line and ends the same warning, which 0226 will rewrite. Kept byte-identical with the block (PC-2)
  rather than cut — the cheaper call to reverse.

### Review round 1 (2026-10-17) — Process-review worker, unattended fixes and obvious-winner calls

Spawned by `fkit-sprint-ship-loop` (driver `fkit-lead`) under the ADR-055 marker; plan blob `5ee3cdd5`
re-checked with `git hash-object` before any edit. Every fix below was verified `CORRECT`, is
comments-only or a worklog record, and sits inside the approved plan. `plan.md`, `plan-review.md`,
the *Reviewer findings* section and every ADR are untouched.

- **RR1 — answers R1 (method: V6 and width blind to JS block comments).** Changed: M4h gains the block-
  comment rule and a new awk and perl that track `/* … */` per language; M3's secondary grep gains a
  JS block-comment filter; M3 gains the AST compare that the reviewer's side note proposed. Why it
  qualified: verified (the old awk finds 2 runs over 2 lines in `test/structure-spec.test.js`, the new
  one 8); the lead's brief named the fix ("a method amendment recorded in the worklog's 'Method for the
  series'"); it is a record, not code. The new commands give this unit's 7 files the same result as the
  old ones (only the mirror block, and its one 118-column line).
  - **Obvious-winner call inside RR1:** adopting the AST compare, not just noting it. It only adds a
    check — "compare by hand" stays as the fallback — and it was proved before use (ASI case different,
    comment deletion equal, regex edit different, 0507's `.mjs` equal).
  - **Obvious-winner call inside RR1:** splitting the comment marker by language (`#` shell, `//` and
    `/*` JS). The old pattern counted `//` in shell and `#` in JS, which are not comments there; the
    split is needed to track blocks without miscounting a shell `*)` case arm.
- **RR2 — answers R2 (stale "SKIP 3" label in live tests).** Changed: `test/prove-red.sh` Mutation 6
  header "(SKIP 3)" → "(`shiploop-$session_id`)"; `test/turn-completion-hook.test.js` comment "SKIP 3 is
  now the transcript-INDEPENDENT ship-loop marker" → "The ship-loop skip is the transcript-INDEPENDENT
  marker". Why it qualified: verified (no SKIP label is left in the hook); M4b/M4c and rule 5 say to
  re-anchor a live cite on code text; one comment line each, no line count change; `norm` / token / AST
  hashes equal to HEAD. Added a method line (M4d, R2 bullet) so later units search divider labels.
- **RR3 — answers R3 (askuq hook comment overclaims).** Changed: the second header comment of
  `claude/askuserquestion-marker-hook.sh` now says an unwritable state dir is safe (the Stop hook skips
  check A) and that a write failing in a writable dir can cause one false block, capped by block-once.
  Why it qualified: verified against `turn-completion-hook.sh` (`marker_infra_ok` needs `-d` and `-w`
  only; a missing marker then sets `asked_with_tool=0`; `stop_hook_active` allows the re-run); M4i
  requires fixing a comment that is wrong today; 2 lines, ≤ 110 columns; `norm` equal to HEAD.
  - **Obvious-winner call:** departing from the plan's own draft wording for this comment ("A failed
    write is safe only because …"), since that draft is the overclaim. Same facts minus the false one;
    within the plan's intent (M4i, and §8's "reworded to the real heading" precedent).
- **RR4 — answers R4 (V5 missed ADR quotes).** Changed: M4d gains the owner's R4 ruling (ADR quotes and
  heading cites treated like Q3, each listed in V5, with the decisions folder added to the S3b search);
  V5 gains rows for ADR-037 (three quotes), ADR-049, ADR-050 and ADR-055. No ADR edited. Why it
  qualified: the owner ruled ("Leave the ADRs (Recommended)", 2026-10-17); a records-only change.
  - **Obvious-winner call:** listing more than the three quotes the review named. Re-running S3b over
    `decisions/` found a third ADR-037 quote ("A declared pointer-only spawn … ALLOWED here") and
    ADR-050's heading cite of a deleted divider. The ruling's own description says each such quote is
    listed, so listing all found is the ruling applied, not widened.
- **Observation, not acted on (outside round 1's findings):** the `.mjs` header's "it proves the prompt
  holds the plan's bytes" holds only when no degraded form is declared; the pass-2 comment states the
  exception ("skipped only for a declared degraded form"). HEAD's header made the same claim. Left for
  the reviewer to judge in round 2.

### Review round 2 (2026-10-17) — Process-review worker, unattended fixes and obvious-winner calls

Same spawn marker; plan blob `5ee3cdd5` re-checked with `git hash-object` before any edit. Every fix
below was verified `CORRECT`, is comments-only or a worklog record, and sits inside the approved plan.
`plan.md`, `plan-review.md`, *Reviewer findings* and every ADR are untouched.

- **RR5 — answers R5 (the `.mjs` header said it proves the prompt holds the plan's bytes).** Changed:
  line 2 of the "A PROXY for the coder's condition (b)" comment, from "itself: it proves the prompt
  holds the plan's bytes, never that the owner approved the plan (ADR-021)." to "itself: it checks the
  plan's bytes (only the hash if pointer-only is declared), never approval (ADR-021)." Why it
  qualified: verified (a `declared` prompt skips `containsExactBytes()` in pass 2, while pass 1 still
  checks the hash); M4i; one comment line, 108 columns, still 2 lines; line 1 with the condition-(b)
  quote that `test/spawned-write-marker.test.js` relies on is byte-identical; token and AST hashes
  equal to HEAD; the two suites 36/36.
  - **Obvious-winner call:** fixing the outcome-list gap R5 also names inside this same comment, rather
    than adding a line to the "Ungated by design" list, which would make that comment 3 lines (V6).
  - V5: no live text quotes the replaced words (searched the repo: only this task's own records and
    `.fkit/tmp/` review scratch). The R4 rows for ADR-037 stay true: the header still says "never (b)
    itself" and "never approval".
- **RR6 — answers R6 (M3 cannot see a shebang or directive change).** Changed: M3 gains the rule-4 check
  (line 1 byte-equal when either side has `#!`, no directive among the changed lines, no file-mode
  change). Why it qualified: verified (reproduced: the token hash stays `099cd631…` with `node` →
  `deno`); the lead's brief named the fix ("a separate line-1/shebang and directive byte-equality
  check, proven on a shebang edit"); a record, not code. Proved on six cases before use, and run on all
  9 files this unit touched (clean).
  - **Obvious-winner call:** adding the file-mode check (`git diff --summary`) in the same amendment.
    The same rule-4 risk (a directly-run file) and a one-line command; it only adds a check.
- **RR7 — answers R7 (V6 counts `#` lines inside quoted awk programs; no route).** Changed: M4h's limits
  name the shell case and give the route — list each such run as a named V6 exception (rule-1 data),
  with `norm` proving it unchanged. Why it qualified: verified (the new awk reports a 33-line run under
  "# ── U: THE LOUD GUARD" in `dashboard.sh`); it applies M4a (quoted programs are data), already in
  the approved plan, so it is a method clarification, not a new tradeoff. The reviewer offered a
  second route ("the 0509 plan handles it"), which would be an accepted residual for the owner; the
  method amendment was taken instead, so no residual is recorded and no owner question is needed.

### Review round 3 (2026-10-17) — Process-review worker, fixes and the close

Same spawn marker; plan blob `5ee3cdd5` re-checked with `git hash-object` before any edit. **Owner
ruling for this round**, `AskUserQuestion` in the `fkit-lead` session, 2026-10-17: asked "0507's code is
done; round 3 found 2 more small method gaps (R8, R9). How far do we take it?", he selected **"Fix and
close (Recommended)"** (description shown: "Coder fixes R8 and R9 in the worklog (1–2 lines each),
closes the ledger; final full verify; no round 4."). Worklog only: no code file was edited this round.
`plan.md`, `plan-review.md`, *Reviewer findings* and every ADR are untouched.

- **RR8 — answers R8 (a run listed as "rule-1 data" was never proved to be data).** Changed: M4h's R7
  route now requires `datarun.sh` for each listed run (every line must survive `norm` verbatim, by
  `grep -xF`), and the false sentence "This only ever errs toward a false red, never a false green" is
  corrected. Why it qualified: verified and reproduced (`dashboard.sh`: 8 DATA, 79 REAL COMMENT, the
  review's count; the 33-line "U: THE LOUD GUARD" run DATA, the 62-line header REAL COMMENT); a
  method record; done under the owner's "Fix and close" ruling. Slightly longer than the ruling's
  "1–2 lines" because the check is shown with its proof, as every other M3/M4h check is.
- **RR9 — answers R9 (the mode check compared the index, not HEAD).** Changed: M3's rule-4 mode check
  is now `git diff HEAD --summary`, with the reason. Why it qualified: verified and reproduced in a
  scratch repo (staged `chmod 644`: empty without `HEAD`, `mode change 100755 => 100644` with it); a
  method record; owner's "Fix and close" ruling. Re-run for 0507 with `HEAD`: no mode change; nothing
  is staged (`git status --porcelain` shows working-tree changes only).
- **Obvious-winner call (Codex X1, not a ledger row):** the directive pattern widened from
  `[[:space:]]*` to `[[:space:]!]*` so `/*! @license … */` is caught. It only adds matches (a false red at
  worst); checked on a `/*! @license MIT */` line (flagged) and re-run on all 9 files this unit touched
  (clean).
- **Ledger closed:** header set to `Status: closed-out` by the owner's ruling; no round 4.
