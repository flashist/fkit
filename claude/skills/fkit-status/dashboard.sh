#!/usr/bin/env bash
# dashboard.sh — render the /fkit-status step-4 board deterministically.
#
#   ⚠️  INVOKE AS:  bash .claude/skills/fkit-status/dashboard.sh <path-to-sprint-plan>
#   ⚠️  NEVER AS:   ./dashboard.sh
#
# The shebang above is DECORATIVE. Do not rely on it, and do not "simplify" the call site to
# ./dashboard.sh because it works on your machine — it works on yours and fails on some consumers'.
# install.sh:44-46 chmod +x's a HARDCODED LIST OF TWO FILENAMES:
#
#     for s in fkit-claude.sh fkit-claude-init.sh; do
#       [ -f "$SHARE/claude/$s" ] && chmod +x "$SHARE/claude/$s"
#     done
#
# This file is not on that list, and it rides a GitHub tarball + `cp -R` chain that does not guarantee
# the exec bit (cp applies the source mode modified by umask). Invoking through `bash` sidesteps the
# bit entirely and needs no installer change. See ADR-017 rule 2.
#
# WHY THIS EXISTS: SKILL.md:198-201 used to *instruct* that "the counts must sum to M". Here that is an
# invariant of construction rather than a request to an LLM. See
# knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md — this script is
# built to that contract; §9 lists what it must not reopen.
#
# CONTRACT: pure function of (sprint-plan path, the briefs it links) -> (stdout, exit code).
#   - The SKILL resolves the argument to a sprint plan. This script never does; it takes a path.
#   - Reads the plan and the briefs it links. Nothing else. Not the code, not git.
#   - Writes nothing. No network.
#   - Non-zero exit + stderr on an unparseable plan; the skill then hand-builds a flagged fallback.
#
# PORTABILITY: bash 3.2 (macOS ships 3.2.57). No `declare -A`, no ${v^^}, no mapfile/readarray.

set -u

# ⚠️ `set -f` (no pathname expansion) is a CORRECTNESS guard, not tidiness. `$DRIFT_TASKS` is
# deliberately word-split UNQUOTED to iterate task ids; without `-f`, any id containing a glob
# metacharacter is expanded against the CURRENT WORKING DIRECTORY — so the legacy `tid="?"` sentinel
# silently becomes the name of any one-character file that happens to sit next to the caller. The
# script would then report drift on a task that does not exist, with the name of an unrelated file.
# Nothing here globs on purpose.
set -f

LC_ALL=C
export LC_ALL

VERSION_MARKER='⟦fkit-dashboard v1⟧'

die() { printf '%s\n' "dashboard.sh: $*" >&2; exit 1; }

[ $# -eq 1 ] || die "usage: bash dashboard.sh <path-to-sprint-plan>"
PLAN="$1"
[ -f "$PLAN" ] || die "no such sprint plan: $PLAN"

PLAN_DIR=$(cd "$(dirname "$PLAN")" 2>/dev/null && pwd) || die "cannot resolve plan directory"
PLAN_FILE="$PLAN_DIR/$(basename "$PLAN")"

# --- locate ai-agents/ (the dir holding tasks/) by walking up from the plan -----------------------
AGENTS=""
d="$PLAN_DIR"
while [ "$d" != "/" ]; do
  if [ -d "$d/tasks/backlog" ] || [ -d "$d/tasks/done" ] || [ -d "$d/tasks/cancelled" ]; then
    AGENTS="$d"; break
  fi
  d=$(dirname "$d")
done
[ -n "$AGENTS" ] || die "cannot find a tasks/ tree above $PLAN_DIR"

# Relative prefix from the plan's dir back up to AGENTS, so rendered links match the plan's own style
# (../tasks/... from sprints/, ../../tasks/... from sprints/done/).
REL_SUB=${PLAN_DIR#"$AGENTS"}
REL_SUB=${REL_SUB#/}
REL_PREFIX=""
if [ -n "$REL_SUB" ]; then
  OLD_IFS=$IFS; IFS=/
  for _p in $REL_SUB; do REL_PREFIX="../$REL_PREFIX"; done
  IFS=$OLD_IFS
fi

# --- the plan's own sprint name (drift rule 1 compares the brief's ## Sprint against it) -----------
# ⚠️ Rule 1 depends on this. If it resolves empty, the rule-1 skip silently STOPS APPLYING and every
# row falls through to the rule-3 cross-check — failing toward MORE drift, which is exactly the
# "phantom decisions" §5.2 rule 1 exists to prevent. So: try the H1, then fall back to the filename,
# and if it is still unresolved REPORT it rather than quietly disabling the rule.
PLAN_SPRINT=$(sed -n 's/^# \(Sprint [0-9][0-9]*\).*/\1/p' "$PLAN_FILE" | head -1)
if [ -z "$PLAN_SPRINT" ]; then
  # sprint-2.md -> "Sprint 2". A plan whose H1 is prose ("# Hardening — the launcher sprint") is
  # otherwise indistinguishable from one with no sprint identity at all.
  PLAN_SPRINT=$(basename "$PLAN_FILE" .md | sed -n 's/^sprint-\([0-9][0-9]*\)$/Sprint \1/p')
fi
# ⚠️ BASENAME, NOT A FULL PATH — deliberate (owner-ruled 2026-07-18, review R4). Any `backlog.md`
# resolves to the `Backlog` identity, including an archived `sprints/done/backlog.md`. An archived
# backlog board is still a backlog board; tightening this to the canonical path would make the archived
# copy report false `unresolved-plan-sprint` drift instead.
if [ -z "$PLAN_SPRINT" ] && [ "$(basename "$PLAN_FILE" .md)" = "backlog" ]; then
  # THE BACKLOG BOARD (task 67) has a real identity — it just isn't a numbered sprint. Its H1 is prose
  # and its filename is deliberately outside the `sprint-*.md` glob, so both rules above miss it and it
  # would report `unresolved-plan-sprint` on EVERY run: a permanent false drift record on a board that
  # is perfectly well-formed.
  #
  # ⚠️ THIS IS NOT COSMETIC — it is what makes drift rule 1 work on this board. Rule 1 skips the status
  # cross-check when a brief's `## Sprint` names a DIFFERENT sprint than the plan. With PLAN_SPRINT
  # empty, the rule is inert and every row falls through to the full cross-check; with it set to
  # `Backlog`, a backlog brief (which reads `## Sprint: Backlog` since task 67) matches, the rule
  # correctly does NOT skip, and real status drift on backlog rows is still found.
  #
  # ⚠️ The value must match what the briefs actually write. Task 67 normalized all of them from
  # `Backlog (unsprinted)` to `Backlog` for exactly this reason — if they ever diverge again, every
  # backlog row silently takes rule 1's skip and status drift on this board stops being reported.
  PLAN_SPRINT="Backlog"
fi

# --- "is this the ## Status heading?" — ONE definition, used everywhere ----------------------------
# ⚠️ There were THREE grammars for this: `grep -c '^## Status'` (prefix), the awk rule (exact), and the
# existence check (prefix). A plan with a `## Status report` section therefore counted as a second
# Status table, emitted a false `multiple-status-tables`, and could die with a misleading message —
# while the parser itself correctly ignored it. Two grammars for one question is the defect class this
# script's own comments forbid; a third is not better. `[ \t]*$` anchors all three to the same answer.
# ⚠️ REAL TAB, NOT `\t`. The escape is not portable across grep dialects: BSD grep (what a consumer
# actually has) reads `[ \t]` as the literal set {backslash, space, t} and does NOT match a tab, while
# awk expands `\t` and does. Same regex text, two answers — so `## Status<TAB>` made the guard `die`
# while the parser accepted the section. ANSI-C quoting expands the tab HERE, in bash, so both engines
# receive a literal tab and cannot disagree.
#
# ⚠️ This was invisible on the dev machine: `grep` on PATH is ugrep, which matches GNU behaviour and
# agrees with awk. The divergence only appears against /usr/bin/grep. Two reviewers were fooled by the
# same shadowed binary. Do not "simplify" this back to a '\t' literal.
STATUS_HEADING_RE=$'^## Status[ \t]*$'

# `grep -c` prints 0 AND exits 1 on no match, so a `|| echo 0` here would emit BOTH and yield "0\n0",
# which breaks the -gt integer test below. Let it print its own 0.
STATUS_SECTIONS=$(grep -cE "$STATUS_HEADING_RE" "$PLAN_FILE" 2>/dev/null)
[ -n "$STATUS_SECTIONS" ] || STATUS_SECTIONS=0

# --- pull the first ## Status section's table rows -------------------------------------------------
# Emits: status<US>priority<US>task<US>brief-cell, one record per table row.
# Splits on "|" and takes status=$2, priority=$3, brief=$(NF-1), task=join($4..$(NF-2)) — so a pipe
# inside the task wording does not shift the brief column.
#
# ⚠️ The field separator is US (\x1f, `\037`), NOT tab. Tab is IFS *whitespace*, which bash's `read`
# COLLAPSES — so an empty Task cell would silently shift the brief link left into the Task column,
# empty the Filename, and emit a phantom `missing-brief`. US is not IFS whitespace, so empty fields
# hold their position.
#
# ⚠️ A row that does not parse is NOT skipped. Silently dropping it would redefine `M` as "rows that
# survived parsing" and let a task vanish from the board with no row, no fact and no warning — the
# very failure this script exists to prevent, through a different door. It emits a MALFORMED marker
# and the caller hard-fails (owner ruling, 2026-07-16: hard-fail -> SKILL.md's flagged fallback).
# ⚠️ ROW ADMISSION IS A CLASS, NOT A LIST OF CASES. Every candidate data row in the section MUST leave
# this function as exactly one record. `NF < 5` was once the only door that dropped a row; an empty
# Status cell and a pipe-less row were two more. The question to ask of any edit here is not "is this
# row valid?" but **"can any line in the table fail to produce a record?"** — if yes, `M` silently
# becomes "rows that survived parsing" and a task vanishes from the board.
#
# ⚠️ The record TYPE is out-of-band (leading `D`/`M` field), not an in-band `MALFORMED` string: a row
# whose Status cell is literally the word MALFORMED must be data, not a control record.
extract_rows() {
  awk -F'|' -v US=$'\037' -v HRE="$STATUS_HEADING_RE" '
    # GFM escapes a literal pipe in a cell as `\|`. It is CONTENT, not a delimiter — splitting on it
    # shifted every later field and rendered a six-column board with the priority set to cell debris.
    # Park it, split, then restore it still-escaped so the emitted table stays valid markdown.
    # (Index-based, not gsub: gsub replacement escaping for a backslash is ambiguous across awks.)
    function unesc(s,   out, i) {
      out = ""
      while ((i = index(s, "\002")) > 0) { out = out substr(s, 1, i-1) "\\|"; s = substr(s, i+1) }
      return out s
    }
    $0 ~ HRE { if (seen) exit; seen=1; inSec=1; inTbl=0; next }   # HRE: the ONE heading grammar
    inSec && /^## / { exit }
    !inSec { next }
    # ⚠️ THE TWIN CLASS QUESTION, ANSWERED PROPERLY THIS TIME. "Can any line fail to produce a
    # record?" has a mirror: "can any line produce a record that is NOT a row?" Closing it only for
    # prose AFTER the table left two doors open — pipe-bearing prose BEFORE the table, and a block
    # with no separator at all — because `inTbl` was set by the separator but nothing was excluded
    # while waiting for it.
    #
    # GFM: the delimiter row is MANDATORY. A pipe block without one is not a table, so it has no rows.
    # The admission window is therefore exactly: opens AT the separator, closes at the first blank or
    # pipe-less line. Everything before the separator (heading, caption, prose, the header row itself)
    # is outside it. A separator-less `## Status` block yields zero rows and hard-fails to the
    # flagged fallback in SKILL.md — consistent with the R2 owner ruling, and it is not "destroying a
    # usable board": markdown renders that block as prose too, so there was no board to destroy.
    # (NB: no apostrophes in this comment — it lives inside a single-quoted awk program.)
    { line=$0; gsub(/\037/, " ", line); gsub(/\\\|/, "\002", line) }          # US cannot shift fields; \| is content
    !inTbl && line ~ /^[ \t]*\|?[-: \t|]+\|[-: \t|]*$/ { inTbl=1; next }      # |---|---| separator: window OPENS
    !inTbl { next }                                                           # header/caption/prose: not rows
    /^[ \t]*$/ { inSec=0; next }                                              # window CLOSES
    $0 !~ /\|/ { inSec=0; next }                                              # window CLOSES
    {
      n = split(line, cell, "|")
      # GFM allows the leading/trailing pipes to be omitted; normalise both away.
      lo = (line ~ /^[ \t]*\|/) ? 2 : 1
      hi = (line ~ /\|[ \t]*$/) ? n - 1 : n
      ncell = hi - lo + 1
      if (ncell < 4) { printf "M%s%s\n", US, line; next }
      st = cell[lo]; pr = cell[lo+1]; br = cell[hi]
      task = ""
      for (i = lo+2; i <= hi-1; i++) task = (task=="" ? cell[i] : task "|" cell[i])
      gsub(/^[ \t]+|[ \t]+$/, "", st)
      gsub(/^[ \t]+|[ \t]+$/, "", pr)
      gsub(/^[ \t]+|[ \t]+$/, "", task)
      gsub(/^[ \t]+|[ \t]+$/, "", br)
      printf "D%s%s%s%s%s%s%s%s\n", US, unesc(st), US, unesc(pr), US, unesc(task), US, unesc(br)
    }
  ' "$PLAN_FILE"
}

grep -qE "$STATUS_HEADING_RE" "$PLAN_FILE" || die "no '## Status' section in $PLAN"

ROWS=$(extract_rows)
[ -n "$ROWS" ] || die "no parseable rows in the '## Status' table of $PLAN"

# Hard-fail on an unparseable row rather than rendering a board that is quietly missing a task.
# (Owner ruling 2026-07-16: hard-fail -> SKILL.md's flagged hand-built fallback.)
if printf '%s\n' "$ROWS" | grep -q "^M$(printf '\037')"; then
  bad=$(printf '%s\n' "$ROWS" | grep "^M$(printf '\037')" | head -1 | cut -d"$(printf '\037')" -f2-)
  die "unparseable row in the '## Status' table of $PLAN (need 4 cells): $bad"
fi

# --- helpers ---------------------------------------------------------------------------------------

# Canonical key for a status cell, by marker PREFIX. `➡️` is U+27A1 + U+FE0F (VS16); matching the base
# codepoint alone accepts both the VS16 form (what every live plan writes) and a bare hand-edited `➡`.
#
# ⚠️ ABSENT and UNRECOGNIZED are different answers and must not share a sentinel. An empty cell means
# "the source says nothing"; `WIP` means "the source says something outside the vocabulary". Collapsing
# both to `unknown` and then comparing for equality produced a false `waiting on owner` on a brief that
# merely lacks a `## Status` heading — SKILL.md:88 defines disagreement as "the sources say different
# things", and an absent source says nothing.
marker_key() {
  case "$1" in
    '')     printf '' ;;
    '✅'*)  printf 'done' ;;
    '🔄'*)  printf 'inprogress' ;;
    '🚧'*)  printf 'blocked' ;;
    '🔲'*)  printf 'backlog' ;;
    '⛔'*)  printf 'cancelled' ;;
    '➡'*)   printf 'moved' ;;
    *)      printf 'unknown' ;;
  esac
}

# Directory a brief with this marker is expected to live in. `moved` may live anywhere.
expected_dir() {
  case "$1" in
    done)                      printf 'done' ;;
    cancelled)                 printf 'cancelled' ;;
    backlog|inprogress|blocked) printf 'backlog' ;;
    *)                         printf '' ;;
  esac
}

# First non-empty value under a `## <field>` heading, marker and all. The value is free text that MAY
# WRAP ACROSS LINES (SKILL.md:56-57) — we take the first line, and callers match a marker prefix
# rather than the whole line.
field_value() {
  awk -v want="## $2" '
    $0 == want { inF=1; next }
    inF && /^## / { exit }
    inF && /^[ \t]*$/ { next }
    inF { gsub(/^[ \t]+|[ \t]+$/, ""); print; exit }
  ' "$1"
}

# Raw `Depends on:` text, single-line, for the sentinel. NEVER interpreted (spec §4.2).
#
# ⚠️ ANCHORED TO THE BOLD DECLARATION `**Depends on:` — not a bare `Depends on:` anywhere in the file.
# A brief may *discuss* the field in prose or a code span (`` `Depends on:` ``), and an unanchored
# `grep -m1` matched that prose instead of the declaration. Live proof at the time of writing: this
# script's own task brief made the sentinel render `⟨derive: ` line is⟩` — the LLM is forbidden to
# re-open the brief (SKILL.md), so it would derive the dependency from garbage. Verified across the
# task tree: 32 of 32 briefs declare with the bold form, and every non-bold hit is prose.
# ⚠️ Do NOT "simplify" this to `^\*\*Depends on:` — real declarations appear mid-line, e.g.
# `date+reason. **Depends on: nothing. Relates to: task 34.**`. Bold is the discriminator, not column 1.
#
# ⚠️ NO LENGTH CAP. An earlier 72-byte trim silently deleted dependencies — `…, and also task 99.`
# lost task 99 and the board read `after 11`, while SKILL.md orders the LLM to name EVERY task and
# forbids re-opening the brief. §4.2 says the sentinel carries the RAW text; a wide cell is a cosmetic
# cost, a dropped dependency is a fabrication.
# ── THE DEPENDENCY GRAMMAR ────────────────────────────────────────────────────────────────────────
# This function has been wrong three times. It is now written as a CLOSED GRAMMAR with ONE code path,
# because every previous bug came from the same two habits: a branch that returned early (skipping the
# join and the sanitiser), and a completion test that its own label satisfied.
#
#   FORM              EXAMPLE                                   TERMINATOR
#   ────────────────  ────────────────────────────────────────  ──────────────────────────────────
#   S  section        `## Depends on` / `- task 12` / `- task 99`  next `##` or blank line
#   BL bold-label     `**Depends on:** [link] **(hard).**`      end of block
#   BI bold-inline    `**Depends on: task 18** trailing prose`  the `**` CLOSING the label's bold
#   P  plain          `Depends on: task 12.`  (fkit-task-brief:70) end of block
#
# ⚠️ RULES, each paid for by a defect:
#  1. ONE exit. Locate → join → extract → sanitise → emit. No branch may `print` and `exit` on its own
#     (that dropped a fan-in's second item and skipped `|` sanitising, rendering a 6-column board).
#  2. NO completion test a LABEL can satisfy. `buf ~ /\*\*Depends on:.*\*\*/` matched `**Depends on:**`
#     itself, so the wrap-join never fired and live task 41 lost its `(hard)` qualifier.
#  3. BI is the ONLY form with an unambiguous in-band terminator. For BL/P/S, OVER-INCLUDE trailing
#     prose rather than guess where the dependency ends: verbose is a cosmetic cost, a dropped
#     dependency is a fabrication, and §4.2 asks for the RAW text anyway.
#  4. The colon is OPTIONAL when bold (`**Depends on nothing.**` — 4 live briefs), REQUIRED when
#     plain: unbolded prose says "this depends on the owner" and must not be mistaken for a
#     declaration.
#  5. A CODE SPAN is prose ABOUT the field, never a declaration (the original R1).
# Emits `<form>␟<content>` when a declaration EXISTS, and nothing at all when none does. That
# distinction is the whole contract:
#   no output        → the brief records no dependency → `none recorded` → the LLM may say `ready`
#   output, content  → the dependency, raw
#   output, EMPTY    → a declaration we could not read → the LOUD path, never `ready`
#
# ⚠️ THERE IS ONE GRAMMAR. There used to be two: this function, plus a `depends_mentioned` guard with
# its own narrower pattern. The loud path was then gated on *this* returning empty while *that* decided
# whether to fire — so a form the guard didn't know silently became `none recorded` → `ready`
# (3 of the 4 live `Depends on nothing` briefs are PLAIN COLONLESS, which the guard missed), and a
# non-empty-but-wrong parse never consulted the guard at all. The caller now branches on this
# function's own answer. Do not reintroduce a second pattern anywhere.
depends_raw() {
  awk '
    function sanitise(s) {
      gsub(/\*\*/, "", s); gsub(/\|/, " ", s); gsub(/\037/, " ", s); gsub(/\t/, " ", s)
      while (s ~ /  /) gsub(/  /, " ", s)
      sub(/^ +/, "", s); sub(/ +$/, "", s)
      return s
    }
    function indent(s,   t) { t = s; sub(/[^ \t].*$/, "", t); gsub(/\t/, "    ", t); return length(t) }
    function blank(s)    { return s ~ /^[ \t]*$/ }
    function heading(s)  { return s ~ /^#/ }
    function listItem(s) { return s ~ /^[ \t]*[-*+][ \t]/ }

    # ⚠️ MASK CODE SPANS, DO NOT VETO THE LINE. Rule 5 says a code span is prose about the field, never
    # a declaration — but it was implemented as `line does not contain a span mention`, which is a
    # LINE-scoped veto, and rule 3 explicitly ORDERS over-including trailing prose. So a real
    # declaration that happened to share a line with a span mention was discarded whole → no
    # declaration found → `none recorded` → the LLM prints `ready`. That is a FABRICATED ABSENCE: the
    # worst direction, and the one this function has now been wrong about twice.
    #
    # ⚠️ LENGTH IS PRESERVED (spans become \001 filler, not deleted) so an index into the masked text
    # is a valid index into the RAW text. That is what lets us LOCATE on the masked copy while
    # EXTRACTING from the raw one — necessary because a real dependency may legitimately BE a code
    # span (`**Depends on:** \`design-…\``), which deleting spans would destroy.
    function maskspans(s,   out, i, j, k) {
      out = ""
      while ((i = index(s, "`")) > 0) {
        out = out substr(s, 1, i - 1)
        s = substr(s, i)
        j = index(substr(s, 2), "`")
        if (j == 0) { for (k = 1; k <= length(s); k++) out = out "\001"; return out }
        for (k = 1; k <= j + 1; k++) out = out "\001"
        s = substr(s, j + 2)
      }
      return out s
    }

    # Join the declaration across wraps. ⚠️ A MORE-INDENTED list item is a SUB-BULLET of the
    # declaration, not the end of it: `**Depends on:** hard prerequisites:` followed by `- task 12`
    # / `- task 13` yielded `hard prerequisites:` — non-empty, so the loud path never fired, and both
    # tasks vanished. Only a sibling-or-shallower item ends it.
    function joinFrom(i, base,   j, out) {
      out = L[i]
      for (j = i + 1; j <= N; j++) {
        if (blank(L[j]) || heading(L[j]) || F[j]) break
        if (listItem(L[j]) && indent(L[j]) <= base) break
        out = out " " L[j]
      }
      return out
    }
    function sectionFrom(i,   j, out, t) {
      out = ""
      for (j = i + 1; j <= N; j++) {
        if (heading(L[j])) break
        if (blank(L[j])) { if (out != "") break; continue }
        if (F[j]) break
        t = L[j]; sub(/^[ \t]*[-*+][ \t]*/, "", t)
        out = (out == "" ? t : out "; " t)
      }
      return out
    }
    # F[n] marks a line that is inside (or is) a fenced code block. ⚠️ Fences were not excluded at all:
    # a declaration written as an EXAMPLE inside ``` parsed as real, and a fence marker leaked into the
    # sentinel (`derive 1 depends="task 99; ```"`). 4 of the 41 live briefs already carry both a fence
    # and a declaration.
    { L[NR] = $0
      if ($0 ~ /^[ \t]*(```|~~~)/) { F[NR] = 1; fence = !fence } else { F[NR] = fence }
      M[NR] = maskspans($0)
    }
    END {
      N = NR
      # ⚠️ CHOOSE BY FORM PRIORITY, NEVER BY LINE ORDER. These rules used to gate on `!form` inside
      # awk s per-LINE loop, so the FIRST LINE won rather than the first FORM — and a prose sentence
      # mentioning the field beat the real bold declaration further down the brief.
      #
      #   S  `## Depends on[.:]`            — trailing punctuation tolerated
      #   B  `**Depends on[: ]…`            — bold; colon OPTIONAL (`**Depends on nothing.**`)
      #   P  `- Depends on[: ]…`            — plain; anchored to line start or a list marker, so
      #                                       ordinary prose ("whether it ships depends on the owner")
      #                                       is not a declaration. Colon optional: 3 of the 4 live
      #                                       `Depends on nothing` briefs omit it.
      # ⚠️ LOCATE on M[] (spans masked, length preserved), EXTRACT from L[] (raw). Never locate on the
      # raw text — a mention inside a span becomes a declaration. Never extract from the masked text —
      # a dependency that IS a span gets destroyed. F[] excludes fenced blocks entirely.
      for (i = 1; i <= N; i++)
        if (!F[i] && M[i] ~ /^##[ \t]+Depends on[.:]?[ \t]*$/) { print "S\037" sanitise(sectionFrom(i)); exit }
      for (i = 1; i <= N; i++)
        if (!F[i] && M[i] ~ /\*\*Depends on[.: ]/) {
          b = joinFrom(i, indent(L[i]))
          s = substr(b, index(maskspans(b), "**Depends on") + 12)
          sub(/^[.:]?[ \t]*/, "", s)
          if (s ~ /^\*\*/) { sub(/^\*\*[ \t]*/, "", s); print "BL\037" sanitise(s) }
          else             { sub(/\*\*.*$/, "", s);     print "BI\037" sanitise(s) }
          exit
        }
      for (i = 1; i <= N; i++)
        if (!F[i] && M[i] ~ /^[ \t]*([-*+][ \t]*)?Depends on[.: ]/) {
          b = joinFrom(i, indent(L[i]))
          s = substr(b, index(maskspans(b), "Depends on") + 10)
          sub(/^[.:]?[ \t]*/, "", s)
          print "P\037" sanitise(s)
          exit
        }
    }
  ' "$1" 2>/dev/null | head -1
}

# Trim a cell to its first clause so the table never wraps (SKILL.md:163-165). Markers carry mandatory
# reasons, which belong in the cell — but a recorded reason that is a paragraph does not.
# The marker and its mandatory reason belong in the cell verbatim — but a reason recorded as a
# PARAGRAPH is trimmed to its FIRST CLAUSE rather than wrapping the table (SKILL.md:163-165).
#
# ⚠️ "First clause" means a clause boundary — `. ` — NOT a byte count. An earlier 120-byte word-cut
# let a 3-clause 100-char cell through untrimmed and sliced a 130-char single clause mid-sentence:
# the opposite of the contract on both sides.
# ⚠️ The boundary is period-SPACE, never a bare period: a live moved cell carries a markdown link
# (`➡️ Moved to [Sprint 2](../sprint-2.md) — priority 12`), and cutting at the first `.` would sever
# it inside `sprint-2.md`. Splitting on `. ` leaves links intact.
one_line_cell() {
  printf '%s' "$1" | tr '\n' ' ' | sed -e 's/[[:space:]][[:space:]]*/ /g' -e 's/^ //' -e 's/ $//' \
    | awk '{
        i = index($0, ". ")
        if (i > 0) { print substr($0, 1, i - 1) "…"; exit }
        print
      }'
}

# A value safe to place inside a `key="value"` FACTS field. `"` in the source (a quoted phrase in a
# Depends on: line — live in sprint-2 task 36) would otherwise close the field early and hand the
# skill an unparseable record. Newlines likewise: FACTS is one record per line.
fact_value() {
  printf '%s' "$1" | tr '\n"' " '"
}

# The numeric task id for a FACTS record. The plan's Priority cell is not always a bare number —
# sprint-1 writes `8 (optional)` — and FACTS records the id POSITIONALLY, so an unstripped cell puts a
# space in the middle of the grammar. The board still renders the cell as the plan wrote it.
task_id() {
  printf '%s' "$1" | sed -n 's/^[^0-9]*\([0-9][0-9]*\).*/\1/p' | head -1
}

# --- pass 1: parse rows, resolve briefs, compute drift + next step ---------------------------------

c_done=0; c_inprogress=0; c_blocked=0; c_backlog=0; c_cancelled=0; c_moved=0; c_unknown=0
total=0
BOARD_ROWS=""
FACTS=""
DRIFT_TASKS=""

add_fact() { FACTS="${FACTS}$1
"; }

# Record drift against the current row. TWO effects, deliberately fused into one call: the plan-level
# `DRIFT_TASKS` list (which feeds the roll-up's drift clause) and the per-row `row_drift` flag (which
# forces the row to RENDER even when its marker is inert).
#
# ⚠️ THE FUSION IS THE POINT. The board now hides done/cancelled/moved rows, and the ONE exception is
# "this row has drift on it". If a future drift fact appends to DRIFT_TASKS without setting row_drift,
# that finding gets reported in ⟦FACTS⟧ while its row silently vanishes from the board — the owner is
# told task 47 is drifted and then cannot find task 47. Hiding a drift buries a finding, which is the
# exact failure the always-render rule exists to prevent. Every drift site calls THIS, never the
# assignment directly.
mark_drift() { DRIFT_TASKS="$DRIFT_TASKS $tid"; row_drift=1; }

while IFS=$'\037' read -r rtype st pr task br; do
  [ "$rtype" = "D" ] || continue
  total=$((total + 1))
  row_drift=""   # per-row; set ONLY via mark_drift(). Forces an inert-marker row to render anyway.

  # ⚠️ SEMANTICS READ `st`; ONLY THE BOARD CELL READS `st_cell`. The clause trim is a PRESENTATION
  # concern, and running it first rewrote the input every downstream check reads: a conforming
  # `⛔ Cancelled (2026-07-16). Superseded — see task 9` was trimmed to `⛔ Cancelled (2026-07-16)…`
  # and then reported as `cancelled-without-reason` — drift manufactured out of formatting.
  st_cell=$(one_line_cell "$st")
  key=$(marker_key "$st")
  tid=$(task_id "$pr")

  case "$key" in
    done)       c_done=$((c_done + 1)) ;;
    inprogress) c_inprogress=$((c_inprogress + 1)) ;;
    blocked)    c_blocked=$((c_blocked + 1)) ;;
    backlog)    c_backlog=$((c_backlog + 1)) ;;
    cancelled)  c_cancelled=$((c_cancelled + 1)) ;;
    moved)      c_moved=$((c_moved + 1)) ;;
    *)          c_unknown=$((c_unknown + 1)) ;;
  esac

  # -- resolve the brief -----------------------------------------------------------------------
  # Post-migration (task 76): the href points at `brief.md` INSIDE a task folder
  # `tasks/<board>/<NNNN>-<slug>/brief.md`. The FOLDER NAME is the recovery key AND the identity; the
  # board is the folder's PARENT (brief.md's grandparent). `brief.md` is the same basename for every
  # task, so it carries no identity — never key a task on it.
  linked=$(printf '%s' "$br" | sed -n 's/.*](\([^)]*\)).*/\1/p' | head -1)
  folder=$(basename "$(dirname "$linked")" 2>/dev/null)
  [ -n "$folder" ] && [ "$folder" != "/" ] && [ "$folder" != "." ] || folder=""

  # -- the FACTS id ---------------------------------------------------------------------------------
  # Normally the Priority number. **The BACKLOG BOARD (task 67) has no numbers** — its Priority cells
  # are `—` by design, because the board is unranked — so every record would key `?`, and the roll-up
  # drift clause would `uniq` several distinct drifted rows down to a single useless `?`. The owner
  # would be told drift exists and given no way to find it.
  #
  # Fall back to the TASK-FOLDER NAME (`<NNNN>-<slug>`), a single token (so the positional
  # `key="value"` grammar is unaffected) and the identifier every other part of fkit uses for a task —
  # it is what the reader would go and open. Post-migration `brief.md` is a SHARED basename and would
  # collapse every unnumbered task to one id, so the folder name is the only usable fallback. `?`
  # survives only when there is neither a number nor a resolvable folder — a genuinely unidentifiable row.
  #
  # ⚠️ ORDER MATTERS: a numbered plan keeps numbering. This is a fallback, not a replacement — changing
  # sprint plans to filename ids would break every `drift on tasks 59, 60` reference the skill narrates.
  # ⚠️ SANITISED, and the sanitising is NOT optional. `tid` is emitted POSITIONALLY into FACTS
  # (`drift nonconformance <tid> kind="…"`) and is later word-split out of `$DRIFT_TASKS`. A filename
  # containing a space therefore becomes TWO task names, and the roll-up invents a task that does not
  # exist — reproduced live before this guard: two rows yielded `drift on tasks my, re[a]d, task`.
  # Glob metacharacters are the same class of hazard through the unquoted split below.
  # This mirrors the invariant `task_id()` already enforces for the Priority cell; a fallback that
  # skipped it was inconsistent with a rule this file established deliberately.
  if [ -z "$tid" ] && [ -n "$folder" ]; then
    tid=$(printf '%s' "$folder" | sed -e 's/[^A-Za-z0-9._-]/-/g')
  fi
  [ -n "$tid" ] || tid="?"

  # ⚠️ `found_dir` is the BOARD (backlog|done|cancelled) — the folder's PARENT, i.e. brief.md's
  # GRANDPARENT. Pre-migration it was brief.md's parent; the extra level is the whole point of the new
  # layout and the single easiest thing to get wrong. `expected_dir` cross-checks below depend on it.
  brief_path=""
  found_dir=""
  folder_dir=""     # the resolved task-folder path
  malformed=""      # folder exists but has no brief.md (ADR-029 Decision 1) — reported, never repaired
  if [ -n "$linked" ] && [ -f "$PLAN_DIR/$linked" ]; then
    brief_path="$PLAN_DIR/$linked"
    folder_dir=$(dirname "$brief_path")
    found_dir=$(basename "$(dirname "$folder_dir")")
  elif [ -n "$linked" ] && [ -d "$PLAN_DIR/$(dirname "$linked")" ]; then
    # The folder is where the link says, but brief.md is missing → malformed, NOT missing/relocated.
    # ⚠️ GUARD: a malformed folder is a BOARD-CHILD without brief.md. If the link's parent dir is a
    # board itself (a stale flat `tasks/<board>/x.md` href), its grandparent is `tasks/`, not a board —
    # that is a missing brief, not a malformed folder. Only fire malformed when the grandparent IS a board.
    folder_dir="$PLAN_DIR/$(dirname "$linked")"
    found_dir=$(basename "$(dirname "$folder_dir")")
    case "$found_dir" in
      # ⚠️ R6 GUARD: a malformed folder is one whose `brief.md` is ACTUALLY absent. Check it directly
      # rather than inferring it from the earlier `-f` branch having failed — the href could point at
      # some OTHER missing file (`…/<folder>/typo.md`) inside a well-formed folder, which is a broken
      # link (→ missing-brief), not a malformed folder.
      backlog|done|cancelled)
        if [ ! -f "$folder_dir/brief.md" ]; then
          malformed=1
        else
          found_dir=""; folder_dir=""   # folder is well-formed; the linked file is just missing
        fi ;;
      *) found_dir=""; folder_dir="" ;;   # not a task folder → fall through to missing-brief
    esac
  elif [ -n "$folder" ]; then
    # Link rot (tasks 21/22): the FOLDER moved between boards. Recover by FOLDER NAME (brief.md is a
    # shared basename and cannot identify a task). Report, and render the CORRECTED link.
    for cand in backlog done cancelled; do
      if [ -f "$AGENTS/tasks/$cand/$folder/brief.md" ]; then
        brief_path="$AGENTS/tasks/$cand/$folder/brief.md"
        folder_dir="$AGENTS/tasks/$cand/$folder"
        found_dir="$cand"
        break
      elif [ -d "$AGENTS/tasks/$cand/$folder" ] && [ ! -f "$AGENTS/tasks/$cand/$folder/brief.md" ]; then
        # Folder exists on this board but has no brief.md → malformed (R6: check brief.md directly).
        folder_dir="$AGENTS/tasks/$cand/$folder"
        found_dir="$cand"
        malformed=1
        break
      fi
    done
  fi

  br_cell="$br"
  if [ -n "$malformed" ]; then
    add_fact "drift malformed-folder $tid folder=\"$(fact_value "$folder")\" location=\"$(fact_value "$found_dir")/\""
    mark_drift
  elif [ -n "$brief_path" ] && [ -n "$linked" ] && [ ! -f "$PLAN_DIR/$linked" ]; then
    corrected="${REL_PREFIX}tasks/${found_dir}/${folder}/brief.md"
    br_cell="[\`${folder}\`](${corrected})"
    add_fact "drift relocated $tid linked=\"$(fact_value "$linked")\" found=\"$(fact_value "$corrected")\""
    mark_drift
  elif [ -z "$brief_path" ]; then
    add_fact "drift missing-brief $tid linked=\"$(fact_value "$linked")\""
    mark_drift
  fi

  # -- id carriers (ADR-029 Decision 5): brief `## ID` vs folder-name prefix ----------------------
  # Two carriers; the FOLDER NAME is authoritative. REPORT disagreement naming both values; never
  # auto-correct either carrier. Sibling of the status cross-check (drift rule 3) below.
  # A brief with NO `## ID` is `brief-missing-id` — the same shape as `brief-missing-status`: an absent
  # second carrier the `id-mismatch` reconciliation cannot see (owner-ruled, review R#4). Post-ADR-029
  # every brief carries `## ID`, so its absence is a real defect, not a legitimate quiet case.
  if [ -n "$brief_path" ] && [ -n "$folder" ]; then
    b_id=$(field_value "$brief_path" "ID")
    folder_id=${folder%%-*}
    if [ -z "$b_id" ]; then
      add_fact "drift nonconformance $tid kind=\"brief-missing-id\" folder=\"$(fact_value "$folder")\""
      mark_drift
    elif [ "$b_id" != "$folder_id" ]; then
      add_fact "drift id-mismatch $tid brief_id=\"$(fact_value "$b_id")\" folder=\"$(fact_value "$folder")\""
      mark_drift
    fi
  fi

  # -- brief fields ----------------------------------------------------------------------------
  b_status=""; b_sprint=""; b_key=""
  if [ -n "$brief_path" ]; then
    b_status=$(field_value "$brief_path" "Status")
    b_sprint=$(field_value "$brief_path" "Sprint")
    b_key=$(marker_key "$b_status")
  fi

  # -- the ➡️ Moved target sprint --------------------------------------------------------------
  moved_target=""
  if [ "$key" = "moved" ]; then
    moved_target=$(printf '%s' "$st" | sed -n 's/.*Moved to \[*\(Sprint [0-9][0-9]*\).*/\1/p' | head -1)
  fi

  # -- nonconformance: sources agree, the marker is written wrong (SKILL.md:90-99) ---------------
  nonconf=""
  case "$key" in
    blocked)
      printf '%s' "$st" | grep -q '—' || nonconf="blocked-without-reason" ;;
    cancelled)
      # ⚠️ The date and the reason are SEPARATE requirements and must be named separately: an
      # `A && B || C` chain reported a missing DATE as `cancelled-without-reason`, telling the owner
      # to supply a reason that was already in the cell while never naming the real defect.
      #
      # ⚠️ STRIP THE AGENT-CLOSED QUALIFIER BEFORE THE REASON TEST (task 64, review R3). The ADR-025
      # marker `⛔ Cancelled (agent-closed — not owner-verified) (YYYY-MM-DD)` carries an em-dash of
      # its OWN, so testing the raw cell for `—` passes a cancellation that has no reason at all — the
      # qualifier satisfies the check meant for the reason. That is worse than a missed lint: it
      # reports CLEAN on the one closure path nobody audits. The date test is unaffected (it matches a
      # parenthesised bare date, which the qualifier is not), but it is run against the stripped value
      # too so both checks see the same string.
      st_reason="$(printf '%s' "$st" | sed 's/(agent-closed[^)]*)//')"
      if ! printf '%s' "$st_reason" | grep -qE '\([0-9]{4}-[0-9]{2}-[0-9]{2}\)'; then
        nonconf="cancelled-without-date"
      elif ! printf '%s' "$st_reason" | grep -q '—'; then
        nonconf="cancelled-without-reason"
      fi ;;
    moved)
      [ -n "$moved_target" ] || nonconf="moved-without-target" ;;
    unknown)
      nonconf="unknown-marker" ;;
    '')
      # The plan recorded no status at all. Previously this row was dropped outright (R17).
      nonconf="missing-status-cell" ;;
  esac
  # A brief with no `## Status` heading is a defect in the BRIEF. It is reported, and it does not by
  # itself make a disagreement — an absent source says nothing (SKILL.md:88). The empty `b_key` now
  # correctly skips the marker comparison below, while the LOCATION cross-check still runs, so real
  # drift on such a row is still found.
  if [ -n "$brief_path" ] && [ -z "$b_key" ]; then
    add_fact "drift nonconformance $tid kind=\"brief-missing-status\" cell=\"$(fact_value "$st")\""
    mark_drift
  fi
  if [ -n "$nonconf" ]; then
    add_fact "drift nonconformance $tid kind=\"$nonconf\" cell=\"$(fact_value "$st")\""
    mark_drift
  fi

  # -- disagreement drift ------------------------------------------------------------------------
  # Rule 1: read the brief's ## Sprint FIRST. If it names a different sprint, SKIP the status
  # cross-check — a ➡️ Moved row's brief reads `🔲 Backlog` in its new sprint CORRECTLY, and flagging
  # it would flag every moved row of every closed sprint forever (SKILL.md:83-88).
  #
  # ⚠️ THE SPLIT IS ABOUT THE OVERRIDE, NOT ABOUT DETECTION (§9: "the override applies to one and not
  # the other"). Gating the whole block on `nonconf` over-corrected and HID REAL DRIFT: a plan cell
  # reading `🚧 Blocked` (no reason) whose brief says `✅ Done` in `done/` reported only the missing
  # em-dash, and the done task rendered as actionable.
  #
  # The true constraint is narrower: a plan marker we could not PARSE (`unknown`/absent) cannot be
  # meaningfully compared to the brief's key — it can never equal it, so rule 3 would fire every time
  # on a purely cosmetic defect. That, and only that, is what must skip the comparison. Every
  # parseable marker gets the full cross-check, and nonconformance is reported alongside it.
  disagree=""
  if [ -n "$brief_path" ] && [ -n "$key" ] && [ "$key" != "unknown" ]; then
    if [ "$key" = "moved" ]; then
      # Rule 2: but DO check the Moved target against the brief's ## Sprint. Disagreement is real drift.
      if [ -z "$b_sprint" ]; then
        # An unresolvable state must not render as a clean `in Sprint N`. Report it; don't guess.
        add_fact "drift missing-sprint $tid plan=\"$(fact_value "$st")\" moved_target=\"$moved_target\""
        mark_drift
      elif [ -n "$moved_target" ] && [ "$b_sprint" != "$moved_target" ]; then
        disagree=1
        add_fact "drift disagreement $tid plan=\"$(fact_value "$st")\" brief_sprint=\"$(fact_value "$b_sprint")\" moved_target=\"$moved_target\""
        mark_drift
      fi
    elif [ "$PLAN_SPRINT" = "Backlog" ]; then
      # ⚠️ RULE 1 DOES NOT APPLY TO THE BACKLOG BOARD, and this arm must come FIRST.
      #
      # Rule 1's premise is that a brief naming a different sprint is LEGITIMATE — on a sprint board it
      # means the task was carried elsewhere, and flagging it would flag every moved row forever. On the
      # BACKLOG board that same condition is inverted: a brief naming a real sprint means the task has
      # been SCHEDULED but its row was never moved off the unscheduled board. That is not noise to
      # skip, it is the single highest-value drift this board can surface.
      #
      # ⚠️ THIS IS A FIX FOR A REGRESSION THIS FILE CAUSED. Before `backlog.md` was given an identity,
      # PLAN_SPRINT was empty here, rule 1's `[ -n "$PLAN_SPRINT" ]` guard was false, and such rows fell
      # through to the rule-3 cross-check and WERE reported. Adding the identity silently activated the
      # skip and lost that reporting. Verified by A/B on a fixture (board `🔲 Backlog`, brief
      # `## Sprint: Sprint 2` + `## Status: 🔄 In progress`): reported before, silent after, reported
      # again with this arm. It also contradicted SKILL.md's own instruction that an in-progress
      # backlog row is "a finding, not a status" — the script was guaranteeing the skill never saw one.
      #
      # A genuinely relocated backlog row is the `➡️ Moved` case, which rule 2 handles above and which
      # never reaches here. So there is nothing left for rule 1 to legitimately excuse on this board.
      :  # fall through to rule 3 — deliberately no skip
      exp=$(expected_dir "$key")
      bad=""
      [ -n "$b_key" ] && [ "$b_key" != "$key" ] && bad=1
      [ -n "$exp" ] && [ -n "$found_dir" ] && [ "$found_dir" != "$exp" ] && bad=1
      [ -n "$b_sprint" ] && [ "$b_sprint" != "Backlog" ] && bad=1   # scheduled, but still on this board
      if [ -n "$bad" ]; then
        disagree=1
        add_fact "drift disagreement $tid plan=\"$(fact_value "$st")\" brief=\"$(fact_value "$b_status")\" brief_sprint=\"$(fact_value "$b_sprint")\" location=\"$found_dir/\""
        mark_drift
      fi
    elif [ -n "$PLAN_SPRINT" ] && [ -n "$b_sprint" ] && [ "$b_sprint" != "$PLAN_SPRINT" ]; then
      : # brief belongs to another sprint — status cross-check skipped, per rule 1
    else
      # Rule 3: cross-check plan cell · brief ## Status · location.
      exp=$(expected_dir "$key")
      bad=""
      [ -n "$b_key" ] && [ "$b_key" != "$key" ] && bad=1
      [ -n "$exp" ] && [ -n "$found_dir" ] && [ "$found_dir" != "$exp" ] && bad=1
      if [ -n "$bad" ]; then
        disagree=1
        add_fact "drift disagreement $tid plan=\"$(fact_value "$st")\" brief=\"$(fact_value "$b_status")\" location=\"$found_dir/\""
        mark_drift
      fi
    fi
  fi

  # -- next step (spec §4.2), in order -----------------------------------------------------------
  # Disagreement takes the `waiting on owner` override. Nonconformance does NOT — a cancelled row
  # stays `dead`; printing `waiting on owner` on five dead rows makes a graveyard look like a
  # to-do list (SKILL.md:96-99).
  if [ -n "$disagree" ]; then
    next="waiting on owner"
  else
    case "$key" in
      done)      next="closed" ;;
      cancelled) next="dead" ;;
      moved)     next="in ${moved_target:-Sprint ?}" ;;
      *)
        # ⚠️ Branch on WHETHER A DECLARATION EXISTS, not on whether we got text out of it. Those are
        # different questions, and conflating them is what let a declaration the parser could not read
        # become `none recorded` — which the LLM renders `ready`, inventing the ABSENCE of a
        # dependency. That is the original R1 with the sign flipped, and it is the worse direction:
        # a wrong dependency is visible, a fabricated `ready` is not.
        draw=""
        [ -n "$brief_path" ] && draw=$(depends_raw "$brief_path" 2>/dev/null)
        if [ -z "$draw" ]; then
          next="⟨derive: none recorded⟩"
          add_fact "derive $tid depends=\"none recorded\""
        else
          dep=${draw#*$'\037'}
          if [ -n "$dep" ]; then
            next="⟨derive: ${dep}⟩"
            add_fact "derive $tid depends=\"$(fact_value "$dep")\""
          else
            next="⟨derive: UNPARSEABLE — see brief⟩"
            add_fact "drift depends-unparseable $tid brief=\"$(fact_value "$linked")\" form=\"${draw%%$'\037'*}\""
            mark_drift
          fi
        fi
        ;;
    esac
  fi

  # --- THE OPEN-WORK FILTER (task 65) ------------------------------------------------------------
  # The board renders OPEN work only: rows whose reconciled state is `done`, `cancelled` or `moved` are
  # omitted. This is a CONSCIOUS REVERSAL of this script's original "show the dead rows" principle
  # (owner ruling, 2026-07-18) — not drift, and not to be "restored" by a later reader who finds the
  # old principle quoted in an ADR or an older SKILL.md revision.
  #
  # ⚠️ THE THREE THINGS THAT MAKE THE REVERSAL SAFE, none of which may be dropped:
  #  1. The ROLL-UP still counts every row and still ends `— of M`. `total` and the c_* counters are
  #     incremented ABOVE this guard, so scope stays visible even though the rows do not. Hiding rows
  #     without keeping the roll-up would make the board lie about scope — the original objection, and
  #     the mitigation the owner ruled in.
  #  2. ⟦FACTS⟧ is UNTOUCHED. Facts are emitted above this guard, so drift on a hidden row is still
  #     reported to the skill and still reaches beat 6.
  #  3. A row carrying ANY drift RENDERS REGARDLESS of its marker (`row_drift`). We filter on the
  #     RECONCILED state, never the raw cell: a row stamped `✅ Done` whose brief disagrees is not
  #     actually known to be done, and hiding it would bury the finding. `cancelled-without-date`
  #     counts — which is why live tasks 59/60 still appear.
  #
  # Deliberately NOT a toggle. One skill, one output (conventions/one-skill-one-output.md, task 44);
  # a `full`/`all` switch would reverse that ruling and needs its own ADR first.
  case "$key" in
    done|cancelled|moved) [ -n "$row_drift" ] || continue ;;
  esac

  BOARD_ROWS="${BOARD_ROWS}| ${st_cell} | ${pr} | ${task} | ${br_cell} | ${next} |
"
done <<EOF
$ROWS
EOF

# --- roll-up (spec §5.3) ---------------------------------------------------------------------------
# Non-zero terms only, in vocabulary order, then ALWAYS `— of M`. Sums to M BY CONSTRUCTION: every row
# lands in exactly one bucket, and `unrecognized` exists so a marker outside the six cannot silently
# vanish from the sum (it is reported as nonconformance too).
rollup=""
add_term() { [ "$1" -gt 0 ] && rollup="${rollup}${rollup:+ · }$1 $2"; return 0; }
add_term "$c_done"       "done"
add_term "$c_inprogress" "in progress"
add_term "$c_blocked"    "blocked"
add_term "$c_backlog"    "backlog"
add_term "$c_cancelled"  "cancelled"
add_term "$c_moved"      "moved"
add_term "$c_unknown"    "unrecognized"

if [ "$STATUS_SECTIONS" -gt 1 ]; then
  add_fact "drift multiple-status-tables count=$STATUS_SECTIONS"
fi

# Rule 1 needs the plan's sprint identity. If neither the H1 nor the filename yielded one, the rule is
# inert — say so, rather than letting the board fail silently toward phantom drift.
if [ -z "$PLAN_SPRINT" ]; then
  add_fact "drift unresolved-plan-sprint h1=\"$(fact_value "$(head -1 "$PLAN_FILE")")\""
fi

# Drift clause — templated, deterministic, deliberately generic. It points at beat 6; it does not try
# to be beat 6. Templating each drift kind into English is prose-generation, not this script's job.
# ⚠️ EVERY drift record must reach this clause, or SKILL.md's "every drift record is an owner
# decision" is false for the ones that don't. Plan-level drift (multiple status tables, an
# unresolved sprint identity) has no task id, so it cannot ride DRIFT_TASKS — it needs its own arm.
drift_clause=""
plan_level_drift=""
[ "$STATUS_SECTIONS" -gt 1 ] && plan_level_drift=1
[ -z "$PLAN_SPRINT" ] && plan_level_drift=1
if [ -n "$DRIFT_TASKS" ]; then
  uniq_tasks=$(printf '%s\n' $DRIFT_TASKS | sort -n | uniq | tr '\n' ',' | sed -e 's/,$//' -e 's/,/, /g')
  drift_clause="  — as recorded; drift on tasks ${uniq_tasks} — see above."
  [ -n "$plan_level_drift" ] && drift_clause="  — as recorded; drift on tasks ${uniq_tasks}, and on the plan itself — see above."
elif [ -n "$plan_level_drift" ]; then
  drift_clause="  — as recorded; drift on the plan itself — see above."
fi

# --- emit ------------------------------------------------------------------------------------------
printf '%s\n' "$VERSION_MARKER"
printf '%s\n' '⟦BOARD⟧'
printf '%s\n' '| Status | # | Task | Filename | Next step |'
printf '%s\n' '|---|---|---|---|---|'
printf '%s' "$BOARD_ROWS"
printf '\n'
printf '%s  —  of %s%s\n' "$rollup" "$total" "$drift_clause"
printf '%s\n' '⟦FACTS⟧'
printf 'total %s\n' "$total"
[ "$c_done" -gt 0 ]       && printf 'count done %s\n' "$c_done"
[ "$c_inprogress" -gt 0 ] && printf 'count in-progress %s\n' "$c_inprogress"
[ "$c_blocked" -gt 0 ]    && printf 'count blocked %s\n' "$c_blocked"
[ "$c_backlog" -gt 0 ]    && printf 'count backlog %s\n' "$c_backlog"
[ "$c_cancelled" -gt 0 ]  && printf 'count cancelled %s\n' "$c_cancelled"
[ "$c_moved" -gt 0 ]      && printf 'count moved %s\n' "$c_moved"
[ "$c_unknown" -gt 0 ]    && printf 'count unrecognized %s\n' "$c_unknown"
printf '%s' "$FACTS"
printf '%s\n' '⟦END⟧'
exit 0
