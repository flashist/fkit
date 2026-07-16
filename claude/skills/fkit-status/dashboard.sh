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
#   - The SKILL resolves the sprint and the `full` keyword. This script never does; it takes a path.
#   - Reads the plan and the briefs it links. Nothing else. Not the code, not git.
#   - Writes nothing. No network.
#   - Non-zero exit + stderr on an unparseable plan; the skill then hand-builds a flagged fallback.
#
# PORTABILITY: bash 3.2 (macOS ships 3.2.57). No `declare -A`, no ${v^^}, no mapfile/readarray.

set -u

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
PLAN_SPRINT=$(sed -n 's/^# \(Sprint [0-9][0-9]*\).*/\1/p' "$PLAN_FILE" | head -1)

# --- guard: more than one ## Status section (§8 OQ2) — parse the FIRST, report the fact ------------
STATUS_SECTIONS=$(grep -c '^## Status' "$PLAN_FILE" 2>/dev/null || echo 0)

# --- pull the first ## Status section's table rows -------------------------------------------------
# Emits: status<TAB>priority<TAB>task<TAB>brief-cell
# Splits on "|" and takes status=$2, priority=$3, brief=$(NF-1), task=join($4..$(NF-2)) — so a pipe
# inside the task wording does not shift the brief column.
extract_rows() {
  awk -F'|' '
    /^## Status[ \t]*$/ { if (seen) exit; seen=1; inSec=1; next }
    inSec && /^## / { exit }
    !inSec { next }
    /^[ \t]*$/ { next }
    $0 !~ /^\|/ { next }
    { line=$0 }
    line ~ /^\|[ \t]*-*[ \t]*\|/ && line ~ /^\|[-: \t|]*\|[ \t]*$/ { next }   # |---|---| separator
    {
      if (NF < 5) next
      st=$2; pr=$3; br=$(NF-1)
      task=""
      for (i=4; i<=NF-2; i++) task = (task=="" ? $i : task "|" $i)
      gsub(/^[ \t]+|[ \t]+$/, "", st)
      gsub(/^[ \t]+|[ \t]+$/, "", pr)
      gsub(/^[ \t]+|[ \t]+$/, "", task)
      gsub(/^[ \t]+|[ \t]+$/, "", br)
      if (st == "Status") next                                                # header row
      printf "%s\t%s\t%s\t%s\n", st, pr, task, br
    }
  ' "$PLAN_FILE"
}

grep -q '^## Status' "$PLAN_FILE" || die "no '## Status' section in $PLAN"

ROWS=$(extract_rows)
[ -n "$ROWS" ] || die "no parseable rows in the '## Status' table of $PLAN"

# --- helpers ---------------------------------------------------------------------------------------

# Canonical key for a status cell, by marker PREFIX. `➡️` is U+27A1 + U+FE0F (VS16); matching the base
# codepoint alone accepts both the VS16 form (what every live plan writes) and a bare hand-edited `➡`.
marker_key() {
  case "$1" in
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
depends_raw() {
  grep -m1 'Depends on:' "$1" 2>/dev/null \
    | sed -e 's/.*Depends on:[[:space:]]*//' \
          -e 's/\*\*//g' \
          -e 's/|/ /g' \
          -e 's/[[:space:]][[:space:]]*/ /g' \
          -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' \
    | awk '{
        if (length($0) <= 72) { print; exit }
        out=""
        n=split($0, w, " ")
        for (i=1; i<=n; i++) {
          if (length(out) + length(w[i]) + 1 > 72) break
          out = (out=="" ? w[i] : out " " w[i])
        }
        print out "…"
      }'
}

# Trim a cell to its first clause so the table never wraps (SKILL.md:163-165). Markers carry mandatory
# reasons, which belong in the cell — but a recorded reason that is a paragraph does not.
one_line_cell() {
  printf '%s' "$1" | tr '\n' ' ' | sed -e 's/[[:space:]][[:space:]]*/ /g' -e 's/^ //' -e 's/ $//' \
    | awk '{
        # The marker and its mandatory reason belong in the cell verbatim — but a reason recorded as a
        # PARAGRAPH gets trimmed to its first clause rather than wrapping the table (SKILL.md:163-165).
        # The cap is generous: the longest live cell (a ➡️ Moved with a link and a qualifier) is well
        # under it, so a conforming cell is never touched. Cut on a space so a multibyte char cannot be
        # split in half under LC_ALL=C.
        if (length($0) <= 120) { print; exit }
        out=""
        n=split($0, w, " ")
        for (i=1; i<=n; i++) {
          if (length(out) + length(w[i]) + 1 > 120) break
          out = (out=="" ? w[i] : out " " w[i])
        }
        print out "…"
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

while IFS="$(printf '\t')" read -r st pr task br; do
  [ -n "$st" ] || continue
  total=$((total + 1))

  st=$(one_line_cell "$st")
  key=$(marker_key "$st")
  tid=$(task_id "$pr")
  [ -n "$tid" ] || tid="?"

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
  linked=$(printf '%s' "$br" | sed -n 's/.*](\([^)]*\)).*/\1/p' | head -1)
  fname=$(basename "$linked" 2>/dev/null)
  [ -n "$fname" ] && [ "$fname" != "/" ] || fname=""

  brief_path=""
  found_dir=""
  if [ -n "$linked" ] && [ -f "$PLAN_DIR/$linked" ]; then
    brief_path="$PLAN_DIR/$linked"
    found_dir=$(basename "$(dirname "$brief_path")")
  elif [ -n "$fname" ]; then
    # Link rot (tasks 21/22): the target moved. Find it, report it, and render the CORRECTED link —
    # a script that trusts a stale link renders a broken board.
    for cand in backlog done cancelled; do
      if [ -f "$AGENTS/tasks/$cand/$fname" ]; then
        brief_path="$AGENTS/tasks/$cand/$fname"
        found_dir="$cand"
        break
      fi
    done
  fi

  br_cell="$br"
  if [ -n "$brief_path" ] && [ -n "$linked" ] && [ ! -f "$PLAN_DIR/$linked" ]; then
    corrected="${REL_PREFIX}tasks/${found_dir}/${fname}"
    br_cell="[\`${fname}\`](${corrected})"
    add_fact "drift relocated $tid linked=\"$(fact_value "$linked")\" found=\"$(fact_value "$corrected")\""
    DRIFT_TASKS="$DRIFT_TASKS $tid"
  elif [ -z "$brief_path" ]; then
    add_fact "drift missing-brief $tid linked=\"$(fact_value "$linked")\""
    DRIFT_TASKS="$DRIFT_TASKS $tid"
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
      printf '%s' "$st" | grep -qE '\([0-9]{4}-[0-9]{2}-[0-9]{2}\)' && \
        printf '%s' "$st" | grep -q '—' || nonconf="cancelled-without-reason" ;;
    moved)
      [ -n "$moved_target" ] || nonconf="moved-without-target" ;;
    unknown)
      nonconf="unknown-marker" ;;
  esac
  if [ -n "$nonconf" ]; then
    add_fact "drift nonconformance $tid kind=\"$nonconf\" cell=\"$(fact_value "$st")\""
    DRIFT_TASKS="$DRIFT_TASKS $tid"
  fi

  # -- disagreement drift ------------------------------------------------------------------------
  # Rule 1: read the brief's ## Sprint FIRST. If it names a different sprint, SKIP the status
  # cross-check — a ➡️ Moved row's brief reads `🔲 Backlog` in its new sprint CORRECTLY, and flagging
  # it would flag every moved row of every closed sprint forever (SKILL.md:83-88).
  disagree=""
  if [ -n "$brief_path" ]; then
    if [ "$key" = "moved" ]; then
      # Rule 2: but DO check the Moved target against the brief's ## Sprint. Disagreement is real drift.
      if [ -n "$moved_target" ] && [ -n "$b_sprint" ] && [ "$b_sprint" != "$moved_target" ]; then
        disagree=1
        add_fact "drift disagreement $tid plan=\"$(fact_value "$st")\" brief_sprint=\"$(fact_value "$b_sprint")\" moved_target=\"$moved_target\""
        DRIFT_TASKS="$DRIFT_TASKS $tid"
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
        DRIFT_TASKS="$DRIFT_TASKS $tid"
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
        dep=$(depends_raw "$brief_path" 2>/dev/null)
        [ -n "$dep" ] || dep="none recorded"
        next="⟨derive: ${dep}⟩"
        add_fact "derive $tid depends=\"$(fact_value "$dep")\""
        ;;
    esac
  fi

  BOARD_ROWS="${BOARD_ROWS}| ${st} | ${pr} | ${task} | ${br_cell} | ${next} |
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

# Drift clause — templated, deterministic, deliberately generic. It points at beat 6; it does not try
# to be beat 6. Templating each drift kind into English is prose-generation, not this script's job.
drift_clause=""
if [ -n "$DRIFT_TASKS" ]; then
  uniq_tasks=$(printf '%s\n' $DRIFT_TASKS | sort -n | uniq | tr '\n' ',' | sed -e 's/,$//' -e 's/,/, /g')
  drift_clause="  — as recorded; drift on tasks ${uniq_tasks} — see above."
elif [ "$STATUS_SECTIONS" -gt 1 ]; then
  drift_clause="  — as recorded; see above."
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
