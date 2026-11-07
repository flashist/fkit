#!/usr/bin/env bash
# Run as bash <path>, never ./: the exec bit may not survive install (ADR-017 rule 2).

# /fkit-heal's conformance check (ADR-039; 0245 plan §2). READ-ONLY IN EVERY BRANCH: its untouched-stale
# verdict is repair.sh's write gate. A script, not prose (ADR-017).

# stdout is the test contract (ADR-017 rule 4): one line per spec-inventory row, in table order, then
# `#` notes and a `# summary:` line. Exit 0 conforming, 1 nonconforming or refused, 2 could not run.

# Outcomes: conforming / missing / untouched-stale / owner-edited / wrong-type / wiki-routed, plus the
# refusals `refused: symlink`, `refused: malformed-markers`, `unreadable`, and `kept-out` (0245 plan §2).

# Reproduces the hashing contract in structure-manifest.tsv's header in bash, not node (ADR-017 rule 3);
# test/structure-check.test.js pins the bash-to-JS parity.

# Verdict once no refusal applies (0245 plan §3): hash == the installed copy's -> conforming;
# hash matches any structure-manifest.tsv row for the path -> untouched-stale; matches nothing -> owner-edited

# set -f: keep-out entries and spec paths match literally, never as globs. No set -e: a checker must never
# die mid-report; every failure is a classified outcome or a loud exit 2.
set -u
set -f

RULES_BEGIN='<!-- fkit:begin-rules -->'
RULES_END='<!-- fkit:end-rules -->'
NL='
'

die2() { printf '%s\n' "fkit-heal check: $*" >&2; exit 2; }
warn() { printf '%s\n' "⚠ $*" >&2; }

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
# A present-but-broken sha tool prints garbage at exit 0, and garbage on both sides reads as conforming:
# every hash must look like a sha256 (0245 review R6).
valid_sha() { case "$1" in *[!0-9a-f]*|'') return 1 ;; esac; [ "${#1}" -eq 64 ]; }
# awk truncates a record at a NUL, so an edit hidden after one could classify untouched-stale, the write
# gate. wc and tr are byte-exact: any NUL refuses to classify (0245 review R1).
has_nul() { [ "$(wc -c < "$1")" -ne "$(tr -d '\0' < "$1" | wc -c)" ]; }

# An unknown class or a missing pinned heading refuses (exit 2): a stale skill copy must not guess against a
# newer spec. The table format is structure-spec.md's "Machine-read contract — pinned".
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
  # Spec paths must be project-relative: an absolute or `..` row would read, and in repair.sh write, outside
  # $root. The spec is trusted input, so such a row is corruption: refuse the run (0245 review R5).
  case "$p" in
    /*) IFS="$oldifs"; die2 "cannot run — spec inventory path '$p' is absolute; spec paths must be project-relative" ;;
  esac
  case "/${p%/}/" in
    */../*) IFS="$oldifs"; die2 "cannot run — spec inventory path '$p' contains a '..' segment (escapes the project root); refusing" ;;
  esac
done
IFS="$oldifs"

# Keep-out uses init's parser semantics. An unreadable keep-out fails CLOSED: no ai-agents/ rows, root
# files still checked, exit 1. Intent was recorded and cannot be read (0245 plan §2, "Keep-out").

# [-L] on ai-agents/ comes first, so a symlinked ai-agents/ never has its keep-out read through the link
# (0245 review R3); the row loop then refuses the subtree as `refused: symlink`.
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

marker_lines() {   # <file> <marker> → matching line numbers, one per line (init's awk, verbatim)
  awk -v m="$2" '{ l = $0; gsub(/^[ \t\r]+|[ \t\r]+$/, "", l); if (l == m) print NR }' "$1"
}

# hash_content <file> <elide:0|1> <lb> <le>. A record's \r is dropped only when a \n ended it: a final \r
# with no newline is content, as in the generator's \r\n-only replace. lb/le from the raw file stay valid.
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
    # Never emit a non-sha "hash": garbage here equals the project side's garbage and reads as conforming.
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
