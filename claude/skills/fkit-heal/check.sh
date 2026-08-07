#!/usr/bin/env bash
# check.sh — the deterministic conformance checker behind /fkit-heal (task 0245, unit 4 of the
# 0241 design; capability licensed by ADR-039). READ-ONLY IN EVERY BRANCH: this script contains no
# write operation on any checked path — no redirect into the project, no mkdir, no cp, no touch.
# The consent-gated repair phase is repair.sh beside this file (task 0246) — a SEPARATE script;
# this one still never writes, but its `untouched-stale` verdict is now repair.sh's write gate,
# which is why the 0245 residuals R1/R3/R5/R6/R8 are fixed here (their re-raise clauses fired).
#
# Usage:  bash check.sh [--share <dir>] [project-root]
#   project-root defaults to the current directory. Share resolution: --share wins; else a
#   project-root that holds claude/structure-spec.md is a source-checkout self-host and IS the share
#   (mirrors fkit-claude.sh's share="$(cd "$here/.." && pwd)" self-host property); else
#   ${XDG_DATA_HOME:-$HOME/.local/share}/fkit.
#
# Why a script and not prose (ADR-017, all four rules): the classification is byte-mechanics —
# hashing, marker counting, manifest lookup — exactly the silent-wrong LLM arithmetic ADR-017 exists
# to eliminate. It lives inside the skill dir (the only ship path), is invoked `bash …/check.sh`
# never `./` (the exec bit is not guaranteed to survive the install/copy chain), assumes bash and
# the POSIX toolbox and NOTHING more — no Node (ADR-017 rule 3), so it REPRODUCES 0244's hashing
# contract rather than importing it; test/structure-check.test.js pins bash↔JS parity.
#
# The report (stdout is the test contract, ADR-017 rule 4):
#   one line per spec-inventory row, in table order:  <outcome>\t<path>\t<detail>
#   then `#`-prefixed note lines and one `# summary:` line with per-outcome counts.
# Outcomes: conforming / missing / untouched-stale / owner-edited / wrong-type / wiki-routed,
# plus the safety-bar refusals/annotations: `refused: symlink`, `refused: malformed-markers`,
# `unreadable`, `kept-out`.
#   * A row inside a subtree already refused (symlinked or wrong-typed ancestor) carries the
#     ancestor's outcome with a detail naming the ancestor — we refuse once at the root and never
#     probe through it (init's own subtree rule).
#   * THE ONE EXCEPTION to one-line-per-row: an unreadable/symlinked/directory .fkit-keep-out fails
#     CLOSED (init's R1 lesson, carried verbatim): the whole ai-agents/ subtree check is refused
#     with a loud stderr message and NO per-row lines, the root context files are still checked, and
#     the run exits 1. Intent was recorded and cannot be read — guessing is worst exactly then.
#
# The hashing pipeline (the manifest header's contract — consumers MUST apply the same transforms):
#   1. CRLF -> LF, exactly that transform (a lone \r is content — including a final \r on a file
#      with no trailing newline, which is why the transform is ending-aware below);
#   2. root context files only: elide the lines strictly BETWEEN the fkit rules markers, KEEPING
#      the marker lines. Marker recognition is marker_lines' contract (fkit-claude-init.sh:374)
#      carried verbatim: a marker matches only when the WHOLE line, trimmed of [ \t\r], equals the
#      marker string — never a substring match;
#   3. sha256 hex — sha256sum, falling back to `shasum -a 256`; NEITHER present -> every
#      content-checked file reports `unreadable` (refuse to classify, non-fatal, flagged loudly).
#
# Classification precedence (the 0243-R3 residual, resolved by the 0245 plan §3):
#   1. symlink / wrong-type -> refuse before any content read;
#   2. unreadable -> refuse to classify, continue;
#   3. root files: malformed marker set (counts != 1/1, or end before begin) -> refuse-to-classify,
#      report the malformation — the manifest is NEVER consulted (mirrors merge_rules' refusal);
#   4. otherwise hash — elided when exactly one well-formed pair exists, WHOLE-FILE when markers
#      are absent (markers-absent is an input-shaping fact, not a classification) — and the
#      manifest verdict decides:
#        hash == the installed version's (the share scaffold copy, same pipeline) -> conforming
#        hash matches any structure-manifest.tsv row for the path            -> untouched-stale
#        matches nothing                                                     -> owner-edited
#      So a markerless root file byte-equal to a shipped whole-file row (the omnigent-era case)
#      is `untouched-stale`, NOT owner-edited; markerless + unmatched IS owner-edited (deleting
#      the markers is an owner edit).
#
# Exit codes (plan §2, owner-accepted): 0 = ran, fully conforming; 1 = ran, nonconformities or
# refusals found; 2 = could not run (cannot-run is NOT nonconforming). `kept-out` is deliberate
# recorded intent, not a nonconformity — it never turns exit 0 into exit 1.
#
# set -f: keep-out entries and spec paths are matched literally, never globbed (init's R3 lesson —
# a keep-out line of `wiki-*` must not expand against whatever the cwd happens to hold).
# No set -e: a conformance checker must never die mid-report; every failure is a classified outcome
# or a loud exit-2 refusal.
set -u
set -f

RULES_BEGIN='<!-- fkit:begin-rules -->'
RULES_END='<!-- fkit:end-rules -->'
NL='
'

die2() { printf '%s\n' "fkit-heal check: $*" >&2; exit 2; }
warn() { printf '%s\n' "⚠ $*" >&2; }

# ── arguments ────────────────────────────────────────────────────────────────────────────────────
share=""
root=""
while [ $# -gt 0 ]; do
  case "$1" in
    --share)
      [ $# -ge 2 ] || die2 "--share needs a directory argument"
      share="$2"; shift ;;
    --share=*) share="${1#--share=}" ;;
    -*) die2 "unknown option: $1 (usage: bash check.sh [--share <dir>] [project-root])" ;;
    *)
      [ -z "$root" ] || die2 "at most one project-root argument (got '$root' and '$1')"
      root="$1" ;;
  esac
  shift
done
root="${root:-$PWD}"
[ -d "$root" ] || die2 "project root is not a directory: $root"
root="$(cd "$root" && pwd)" || die2 "cannot resolve project root: $root"

if [ -z "$share" ]; then
  if [ -f "$root/claude/structure-spec.md" ]; then
    share="$root"                       # source-checkout self-host: the project IS the share
  else
    share="${XDG_DATA_HOME:-$HOME/.local/share}/fkit"
  fi
fi
spec="$share/claude/structure-spec.md"
manifest="$share/claude/structure-manifest.tsv"
scaffold="$share/claude/scaffold"
[ -f "$spec" ]     || die2 "cannot run — spec not found: $spec (is fkit installed in this share?)"
[ -f "$manifest" ] || die2 "cannot run — manifest not found: $manifest"
[ -d "$scaffold" ] || die2 "cannot run — scaffold not found: $scaffold"

# ── sha256 tool (plan §3: fallback chain, loud refusal if neither) ───────────────────────────────
if command -v sha256sum >/dev/null 2>&1; then
  SHA_TOOL="sha256sum"
elif command -v shasum >/dev/null 2>&1; then
  SHA_TOOL="shasum"
else
  SHA_TOOL=""
  warn "no sha256sum and no shasum on PATH — every content check will report 'unreadable'"
fi
do_sha() {
  if [ "$SHA_TOOL" = "sha256sum" ]; then sha256sum; else shasum -a 256; fi
}
# 0245-R6: a PRESENT-but-broken sha tool yields garbage with exit 0 — and garbage on both sides of
# the installed-version compare reads as `conforming`, silently hiding every drift. Every hash
# result must look like a sha256 or the caller refuses to classify.
valid_sha() { case "$1" in *[!0-9a-f]*|'') return 1 ;; esac; [ "${#1}" -eq 64 ]; }
# 0245-R1: awk truncates a record at a NUL byte, so an edit hidden after a NUL hashes as if absent
# and can classify untouched-stale — exactly what repair.sh treats as safe-to-replace. wc/tr are
# byte-exact where awk is not: any NUL present -> refuse to classify.
has_nul() { [ "$(wc -c < "$1")" -ne "$(tr -d '\0' < "$1" | wc -c)" ]; }

# ── spec inventory (the 0243 pinned machine-read contract) ───────────────────────────────────────
# Rows come out as "path<TAB>class", Table A first then Table B, in table order. An unrecognized
# class name or a missing pinned heading refuses LOUDLY (exit 2): a stale skill copy must not guess
# against a newer spec.
parse_tables() {   # <spec-file> → rows on stdout, or non-zero
  awk '
    /^## /  { insec = 0 }
    $0 == "## Inventory Table A — directories" { insec = 1; foundA = 1; next }
    $0 == "## Inventory Table B — files"       { insec = 1; foundB = 1; next }
    insec && /^\| `/ {
      line = $0
      sub(/^\| `/, "", line)
      p = line; sub(/`.*$/, "", p)                    # path: up to the closing backtick
      c = line; sub(/^[^`]*` \| /, "", c); sub(/ \|.*$/, "", c)   # class: the second cell
      printf "%s\t%s\n", p, c
      rows++
    }
    END { if (!foundA || !foundB || rows == 0) exit 3 }
  ' "$1"
}
rows="$(parse_tables "$spec")" || die2 "cannot run — the spec's pinned inventory-table headings were not found (spec/skill version skew?): $spec"

oldifs="$IFS"
IFS="$NL"
for r in $rows; do
  p="${r%%	*}"
  c="${r#*	}"
  case "$c" in
    'structural directory'|'fkit-authored reference file'|'owner-authored seed'|'wiki-authored living file'|'placeholder'|'root context file') ;;
    *) IFS="$oldifs"; die2 "cannot run — unrecognized class '$c' in the spec inventory (row '$p'). This skill copy may be older than the spec; refusing to guess." ;;
  esac
  # 0245-R5: spec paths must be project-relative — a `/`-rooted or `..`-bearing row would probe
  # (and, in repair.sh, WRITE) outside $root. The spec is trusted fkit-authored input, so this can
  # only be corruption: refuse the whole run loudly rather than guess.
  case "$p" in
    /*) IFS="$oldifs"; die2 "cannot run — spec inventory path '$p' is absolute; spec paths must be project-relative" ;;
  esac
  case "/${p%/}/" in
    */../*) IFS="$oldifs"; die2 "cannot run — spec inventory path '$p' contains a '..' segment (escapes the project root); refusing" ;;
  esac
done
IFS="$oldifs"

# ── keep-out (init's parser semantics, carried verbatim; fail CLOSED when unreadable — R1) ───────
# 0245-R3: [-L] FIRST, ALWAYS — the ai-agents/ symlink test precedes ANY keep-out probe, so a
# symlinked ai-agents/ never has its keep-out reached (or a foreign one diagnosed) through the
# link. The row loop below then refuses the whole subtree with `refused: symlink`, which is the
# true cause; init's own top-level preflight does the same.
agents_symlink=0
[ -L "$root/ai-agents" ] && agents_symlink=1
keep_out=""
ko_refused=0
ko="$root/ai-agents/.fkit-keep-out"
if [ "$agents_symlink" = 0 ] && { [ -e "$ko" ] || [ -L "$ko" ]; }; then
  if [ -L "$ko" ] || [ ! -f "$ko" ] || [ ! -r "$ko" ]; then
    ko_refused=1
    warn "refusing to check ai-agents/ — its .fkit-keep-out cannot be read"
    warn "    $ko"
    warn "  It records which paths fkit must never create, so fkit will not guess what it says."
    warn "  Root context files are still checked. Make it a readable regular file (or delete it)."
  else
    while IFS= read -r line || [ -n "$line" ]; do
      line="$(printf '%s' "$line" | tr -d '\r')"
      case "$line" in ''|'#'*) continue ;; esac
      line="${line#./}"; line="${line#/}"
      while :; do case "$line" in */) line="${line%/}" ;; *) break ;; esac; done
      [ -n "$line" ] && keep_out="$keep_out$line$NL"
    done < "$ko"
  fi
fi

# ── the hashing pipeline ─────────────────────────────────────────────────────────────────────────
marker_lines() {   # <file> <marker> → matching line numbers, one per line (init's awk, verbatim)
  awk -v m="$2" '{ l = $0; gsub(/^[ \t\r]+|[ \t\r]+$/, "", l); if (l == m) print NR }' "$1"
}

# hash_content <file> <elide:0|1> <lb> <le> → sha256 hex of the transformed bytes.
# Ending-aware CRLF normalization: a record's trailing \r is stripped only when the record was
# actually terminated by \n — the final line of a newline-less file keeps its \r (lone \r = content,
# exactly normalizeEndings' \r\n-only replacement). Line numbers are stable across the transform
# (\r\n -> \n never changes where \n falls), so lb/le computed on the raw file are valid here.
hash_content() {
  ends_nl=0
  if [ -s "$1" ]; then
    case "$(tail -c 1 "$1" | od -An -tx1 | tr -d ' \n')" in 0a) ends_nl=1 ;; esac
  fi
  awk -v ends_nl="$ends_nl" -v elide="$2" -v lb="$3" -v le="$4" '
    { lines[NR] = $0 }
    END {
      first = 1
      for (i = 1; i <= NR; i++) {
        l = lines[i]
        if (i < NR || ends_nl) sub(/\r$/, "", l)
        if (elide && i > lb && i < le) continue
        if (!first) printf "\n"
        printf "%s", l
        first = 0
      }
      if (ends_nl && NR > 0) printf "\n"
    }' "$1" | do_sha | awk '{ print $1 }'
}

# file_hash <file> <is-root:0|1> → hash on stdout; returns 1 = malformed markers ("nb ne" on stdout).
file_hash() {
  f="$1"
  if [ "$2" = 1 ]; then
    # shellcheck disable=SC2046
    set -- $(marker_lines "$f" "$RULES_BEGIN"); nb=$#; lb="${1:-0}"
    # shellcheck disable=SC2046
    set -- $(marker_lines "$f" "$RULES_END");   ne=$#; le="${1:-0}"
    if [ "$nb" = 0 ] && [ "$ne" = 0 ]; then
      hash_content "$f" 0 0 0                    # markers absent: whole file (input-shaping fact)
    elif [ "$nb" = 1 ] && [ "$ne" = 1 ] && [ "$lb" -lt "$le" ]; then
      hash_content "$f" 1 "$lb" "$le"
    else
      printf '%s %s\n' "$nb" "$ne"
      return 1
    fi
  else
    hash_content "$f" 0 0 0
  fi
}

TAB="$(printf '\t')"
manifest_has() {   # <hash> <project-path> → 0 iff the manifest carries exactly this row
  grep -qxF "$1$TAB$2" "$manifest"
}

# installed_hash <project-path> <is-root> → the share scaffold copy's hash, or "" when the copy is
# absent or (root files) marker-malformed — either is warned once and falls through to the manifest.
installed_hash() {
  local sf ih
  sf="$scaffold/$1"
  [ -f "$sf" ] || { warn "share scaffold has no copy of $1 — current-version match unavailable for it"; return 0; }
  if ih="$(file_hash "$sf" "$2")"; then
    # 0245-R6 belt-and-braces: never emit a non-sha "hash" — garbage here would compare equal to
    # the garbage the caller got for the project file and read as `conforming`.
    if valid_sha "$ih"; then
      printf '%s\n' "$ih"
    else
      warn "share scaffold copy of $1 did not hash to a valid sha256 — current-version match unavailable for it"
    fi
  else
    warn "share scaffold copy of $1 has malformed rules markers — current-version match unavailable for it"
  fi
  return 0
}

# ── classification ───────────────────────────────────────────────────────────────────────────────
report=""
n_conforming=0; n_missing=0; n_stale=0; n_edited=0; n_wrongtype=0; n_wikirouted=0
n_refsym=0; n_refmark=0; n_unreadable=0; n_keptout=0
refused_dirs=""    # newline list of "path<TAB>outcome" for refused/wrong-typed dirs — never probe below

emit() {   # <outcome> <path> <detail>
  report="$report$1$TAB$2$TAB$3$NL"
  case "$1" in
    conforming)                 n_conforming=$((n_conforming + 1)) ;;
    missing)                    n_missing=$((n_missing + 1)) ;;
    untouched-stale)            n_stale=$((n_stale + 1)) ;;
    owner-edited)               n_edited=$((n_edited + 1)) ;;
    wrong-type)                 n_wrongtype=$((n_wrongtype + 1)) ;;
    wiki-routed)                n_wikirouted=$((n_wikirouted + 1)) ;;
    'refused: symlink')         n_refsym=$((n_refsym + 1)) ;;
    'refused: malformed-markers') n_refmark=$((n_refmark + 1)) ;;
    unreadable)                 n_unreadable=$((n_unreadable + 1)) ;;
    kept-out)                   n_keptout=$((n_keptout + 1)) ;;
  esac
}

kept_out_p() {   # <ai-agents-relative path> → 0 iff a keep-out entry covers it (path or subtree)
  local save k
  [ -n "$keep_out" ] || return 1
  save="$IFS"; IFS="$NL"
  for k in $keep_out; do
    case "$1" in "$k"|"$k"/*) IFS="$save"; return 0 ;; esac
  done
  IFS="$save"
  return 1
}

refused_ancestor() {   # <path> → prints "ancestor<TAB>outcome" and 0 iff under a refused subtree
  local save d a
  [ -n "$refused_dirs" ] || return 1
  save="$IFS"; IFS="$NL"
  for d in $refused_dirs; do
    a="${d%%	*}"
    case "$1" in "$a"/*) printf '%s\n' "$d"; IFS="$save"; return 0 ;; esac
  done
  IFS="$save"
  return 1
}

# content_verdict <abs-file> <project-path> <is-root> → verdict in $verdict, detail in $vdetail.
content_verdict() {
  if [ -z "$SHA_TOOL" ]; then
    verdict="unreadable"; vdetail="no sha256 tool on PATH — cannot hash, refusing to classify"
    return
  fi
  if has_nul "$1"; then
    verdict="unreadable"
    vdetail="contains NUL byte(s) — awk-based hashing cannot see past a NUL, so an edit could hide behind one; refusing to classify (0245-R1)"
    return
  fi
  if ! h="$(file_hash "$1" "$3")"; then
    set -- $h
    order=""
    [ "${1:-0}" = 1 ] && [ "${2:-0}" = 1 ] && order=" (end before begin)"
    verdict="refused: malformed-markers"
    vdetail="$1 begin / $2 end marker line(s)$order — the elision region is unknowable; the manifest is never consulted (mirrors merge_rules' refusal)"
    return
  fi
  if ! valid_sha "$h"; then
    verdict="unreadable"; vdetail="hash pipeline produced no valid sha256 (broken sha tool on PATH?) — refusing to classify (0245-R6)"
    return
  fi
  cur="$(installed_hash "$2" "$3")"
  if [ -n "$cur" ] && [ "$h" = "$cur" ]; then
    verdict="conforming"; vdetail="matches the installed version"
  elif manifest_has "$h" "$2"; then
    verdict="untouched-stale"; vdetail="matches an older shipped version — never edited by the owner"
  else
    verdict="owner-edited"; vdetail="matches no version fkit ever shipped — report with diff, never touch"
  fi
}

oldifs="$IFS"
IFS="$NL"
for row in $rows; do
  IFS="$oldifs"
  path="${row%%	*}"
  class="${row#*	}"
  bare="${path%/}"                       # spec dirs carry a trailing /; strip for fs tests
  abs="$root/$bare"

  # Keep-out and the fail-closed subtree refusal apply only under ai-agents/ (the file is
  # ai-agents/-relative, so CLAUDE.md/AGENTS.md are OUTSIDE its reach — stated, not implied).
  case "$bare" in
    ai-agents|ai-agents/*)
      if [ "$ko_refused" = 1 ]; then IFS="$NL"; continue; fi   # refused loudly above; no row lines
      rel="${bare#ai-agents}"; rel="${rel#/}"
      if [ -n "$rel" ] && kept_out_p "$rel"; then
        emit "kept-out" "$path" "listed in ai-agents/.fkit-keep-out — deliberately opted out; not a nonconformity"
        IFS="$NL"; continue
      fi
      ;;
  esac

  # A row below a subtree we already refused: refuse it too, once-per-root warning already given.
  if anc="$(refused_ancestor "$bare")"; then
    aname="${anc%%	*}"; aout="${anc#*	}"
    emit "$aout" "$path" "unreachable — inside refused subtree ai-agents-path '$aname'"
    IFS="$NL"; continue
  fi

  # [ -L ] FIRST, ALWAYS — -e/-d/-f dereference, and a dangling symlink is -e-false; -L is the one
  # test that does not lie (init's rule, both seams).
  if [ -L "$abs" ]; then
    emit "refused: symlink" "$path" "symlink — refusing to classify or traverse; fkit never probes through symlinks"
    warn "$bare is a symlink — refused"
    case "$class" in 'structural directory') refused_dirs="$refused_dirs$bare$TAB""refused: symlink$NL" ;; esac
    IFS="$NL"; continue
  fi

  case "$class" in
    'structural directory')
      if [ ! -e "$abs" ]; then
        emit "missing" "$path" "directory absent — creation is launch convergence's job, never this check's"
      elif [ ! -d "$abs" ]; then
        emit "wrong-type" "$path" "exists but is not a directory — report-only, nothing repairs it"
        warn "$bare exists but is not a directory — refusing to check below it"
        refused_dirs="$refused_dirs$bare$TAB""wrong-type$NL"
      else
        emit "conforming" "$path" "directory present"
      fi
      ;;
    'placeholder')
      # Init's .gitkeep rule governs (never re-implemented, deferred to): a placeholder has no
      # content contract, and a missing .gitkeep in a directory that exists is CONFORMING.
      if [ ! -e "$abs" ]; then
        emit "conforming" "$path" "absent — a placeholder has no content contract; init's .gitkeep rule governs creation"
      elif [ ! -f "$abs" ]; then
        emit "wrong-type" "$path" "exists but is not a regular file"
      else
        emit "conforming" "$path" "present — a placeholder has no content contract"
      fi
      ;;
    'owner-authored seed')
      if [ ! -e "$abs" ]; then
        emit "missing" "$path" "file absent — report-only; never content-checked, never repaired"
      elif [ ! -f "$abs" ]; then
        emit "wrong-type" "$path" "exists but is not a regular file"
      else
        emit "conforming" "$path" "exists — owner-authored seed; divergence is the point, content never checked"
      fi
      ;;
    'wiki-authored living file')
      if [ ! -e "$abs" ]; then
        emit "missing" "$path" "file absent — any repair under ai-agents/wiki-vault/ is fkit-wiki's exclusively (ADR-005)"
      elif [ ! -f "$abs" ]; then
        emit "wrong-type" "$path" "exists but is not a regular file — repair routed to fkit-wiki (ADR-005)"
      elif [ "$bare" = "ai-agents/wiki-vault/schema.md" ]; then
        # The one vault file whose content is compared — and even a nonconformity is REPORT-ONLY,
        # routed to fkit-wiki: this check reads vault paths and never writes them.
        if [ ! -r "$abs" ]; then
          emit "unreadable" "$path" "cannot be read — refusing to classify (non-fatal)"
        else
          content_verdict "$abs" "$bare" 0
          case "$verdict" in
            conforming) emit "conforming" "$path" "matches the installed version" ;;
            *)          emit "wiki-routed" "$path" "$verdict — repair is fkit-wiki's exclusively (ADR-005); consult fkit-wiki, never touch the vault" ;;
          esac
        fi
      else
        emit "conforming" "$path" "exists — wiki-authored living file, supposed to grow (ADR-005)"
      fi
      ;;
    'fkit-authored reference file'|'root context file')
      is_root=0
      [ "$class" = 'root context file' ] && is_root=1
      if [ ! -e "$abs" ]; then
        emit "missing" "$path" "file absent — report-only; creation/repair is out of this check's scope"
      elif [ ! -f "$abs" ]; then
        emit "wrong-type" "$path" "exists but is not a regular file"
      elif [ ! -r "$abs" ]; then
        emit "unreadable" "$path" "cannot be read — refusing to classify (non-fatal)"
      else
        content_verdict "$abs" "$bare" "$is_root"
        emit "$verdict" "$path" "$vdetail"
      fi
      ;;
  esac
  IFS="$NL"
done
IFS="$oldifs"

# ── the report ───────────────────────────────────────────────────────────────────────────────────
printf '%s' "$report"
printf '# note: a renamed directory reports its spec path as missing — this check cannot see the renamed twin (ADR-015'\''s rename consequence).\n'
n_refused=$((n_refsym + n_refmark))
printf '# summary: conforming=%s missing=%s untouched-stale=%s owner-edited=%s wrong-type=%s wiki-routed=%s refused-symlink=%s refused-malformed-markers=%s unreadable=%s kept-out=%s\n' \
  "$n_conforming" "$n_missing" "$n_stale" "$n_edited" "$n_wrongtype" "$n_wikirouted" \
  "$n_refsym" "$n_refmark" "$n_unreadable" "$n_keptout"

# kept-out is recorded intent, not a defect; everything else non-conforming (or a refusal, or the
# fail-closed keep-out) makes the run exit 1.
if [ $((n_missing + n_stale + n_edited + n_wrongtype + n_wikirouted + n_refused + n_unreadable + ko_refused)) -gt 0 ]; then
  exit 1
fi
exit 0
