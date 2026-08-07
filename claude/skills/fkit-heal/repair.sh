#!/usr/bin/env bash
# repair.sh — the consent-gated propose/apply engine behind /fkit-heal's repair phase (task 0246,
# unit 5 of the 0241 design; licensed by ADR-039). Deterministic byte-mechanics live here, never in
# LLM prose (ADR-017): the LLM's only jobs are to PRESENT the proposal verbatim and collect the
# owner's consent; this script computes what would change and applies exactly what was approved.
#
# Usage:
#   bash repair.sh propose [--share <dir>] [project-root]
#     Runs check.sh (same share/root) and, for every `untouched-stale` row, emits one machine line
#         item<TAB><path><TAB><prehash><TAB><posthash>
#     followed by a `# diff <path>` unified-diff block (the current file vs the exact replacement).
#     Hashes are RAW-BYTE sha256 — deliberately NOT the check's normalized pipeline: the prehash
#     fingerprints the exact on-disk state the proposal shows, the posthash the exact bytes apply
#     would write. An eligible row whose replacement cannot be synthesized (scaffold copy absent,
#     or marker-malformed where markers are needed) — or whose DIFF cannot render (consent is
#     approval of the enumerated list with its diffs in view, ADR-039 Decision 2) — is EXCLUDED
#     with a stated `# excluded:` reason line — never emitted as an approveable item, never
#     applied. Exit 0 (an empty proposal is still exit 0), 2 cannot-run.
#
#   bash repair.sh apply [--share <dir>] [project-root]
#     Reads approved `item` lines VERBATIM on stdin — exactly the lines the owner approved out of a
#     propose run, nothing else, nothing reworded. Re-runs check.sh once for a fresh classification
#     (the eligibility authority — a forged line for an owner-edited file dies on it), then per
#     item, in order:
#       (a) path validation — project-relative, no `..` segment, and NEVER under
#           ai-agents/wiki-vault/ (ADR-005, belt-and-braces: refused before anything else looks);
#       (b) [-L] refusal on the target AND every ancestor component down from $root;
#       (c) eligibility — the path must classify `untouched-stale` in the fresh check;
#       (d) apply-time freshness re-check — the raw re-hash must equal the item's prehash, else the
#           consent given was to a diff that no longer exists (ADR-039 Decision 2): refused;
#       (e) replacement synthesis, buffered ONCE — the buffer's own hash must equal the item's
#           posthash BEFORE any write (0246 review R1/R6: the bytes written are the very bytes
#           verified; a share changed under us — a mid-session `fkit update` — or a synthesis
#           drift/lost-rc partial refuses here, with nothing on disk);
#       (f) the last-instant gauntlet, immediately before the redirect: the [-L] walk re-run (a
#           symlink swapped in after (b) is refused), a multi-hard-link refusal (`find -links +1`
#           — a hardlink is invisible to -L, and the in-place redirect would rewrite every
#           co-linked path's content), and a final on-disk re-hash against the prehash;
#       (g) the in-place write via redirect, then a written-bytes re-hash that must equal the
#           posthash — a mismatch is a loud error, never silence.
#     One announce line per submitted item — applied / refused: … / error: … — refusals included
#     (init's reporting bar: say what actually HAPPENED, not what the exit status implied).
#     An INT/TERM/HUP mid-apply runs a trap that names the in-flight path on stderr and exits
#     nonzero — an interrupted write is never silent (0245's no-atomic-write re-raise clause).
#     Exit 0 all applied; 1 any refusal or error; 2 cannot-run.
#
# v1 scope (ADR-039 Decision 1, binding): consent-gated REPLACEMENT of untouched-stale
# fkit-authored files only. Nothing here can move, rename, or delete anything — this script
# contains no move/remove/delete command of any kind (a repo grep fixture pins the absence of those
# tokens), no temp file (diff reads the replacement through a process substitution), and the only
# write is step (f)'s per-item redirect after every guard has passed. Consent is NEVER stored: no
# file, no config, no env survives the run — the approved item lines live only in the session
# transcript, piped to stdin.
#
# Helper duplication from check.sh (die2/warn, argument+share resolution, do_sha/valid_sha,
# marker_lines, the spec-table parse) is deliberate and small, per the 0246 plan: refactoring the
# just-reviewed check.sh into a sourced library was rejected. Mirror-rot between the two scripts is
# guarded BEHAVIORALLY: the end-to-end fixture "apply, then re-run check.sh -> conforming, exit 0"
# only passes while their marker/hashing contracts agree.
set -u
set -f

RULES_BEGIN='<!-- fkit:begin-rules -->'
RULES_END='<!-- fkit:end-rules -->'
TAB="$(printf '\t')"
NL='
'

die2() { printf '%s\n' "fkit-heal repair: $*" >&2; exit 2; }
warn() { printf '%s\n' "⚠ $*" >&2; }

here="$(cd "$(dirname "$0")" && pwd)" || { printf '%s\n' "fkit-heal repair: cannot resolve my own directory" >&2; exit 2; }
CHECK="$here/check.sh"
[ -f "$CHECK" ] || die2 "check.sh not found beside repair.sh: $CHECK"

# ── arguments (check.sh's contract, carried verbatim, plus the leading mode) ─────────────────────
mode="${1:-}"
case "$mode" in
  propose|apply) shift ;;
  *) die2 "usage: bash repair.sh propose|apply [--share <dir>] [project-root]" ;;
esac
share=""
root=""
while [ $# -gt 0 ]; do
  case "$1" in
    --share)
      [ $# -ge 2 ] || die2 "--share needs a directory argument"
      share="$2"; shift ;;
    --share=*) share="${1#--share=}" ;;
    -*) die2 "unknown option: $1 (usage: bash repair.sh propose|apply [--share <dir>] [project-root])" ;;
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
scaffold="$share/claude/scaffold"
[ -f "$spec" ]     || die2 "cannot run — spec not found: $spec (is fkit installed in this share?)"
[ -d "$scaffold" ] || die2 "cannot run — scaffold not found: $scaffold"

# ── sha256 (check.sh's fallback chain; repair CANNOT run without one — nothing to verify with) ───
if command -v sha256sum >/dev/null 2>&1; then
  SHA_TOOL="sha256sum"
elif command -v shasum >/dev/null 2>&1; then
  SHA_TOOL="shasum"
else
  die2 "cannot run — no sha256sum and no shasum on PATH; repair verifies every byte it touches"
fi
do_sha() {
  if [ "$SHA_TOOL" = "sha256sum" ]; then sha256sum; else shasum -a 256; fi
}
# 0245-R6, same guard as check.sh: a broken sha tool must refuse, never applies anything.
valid_sha() { case "$1" in *[!0-9a-f]*|'') return 1 ;; esac; [ "${#1}" -eq 64 ]; }
raw_sha() {   # <file> → RAW-BYTE sha256 on stdout; non-zero when unreadable or the tool is broken
  local s
  s="$(do_sha < "$1" 2>/dev/null | awk '{ print $1 }')" || return 1
  valid_sha "$s" || return 1
  printf '%s\n' "$s"
}

marker_lines() {   # <file> <marker> → matching line numbers, one per line (init's awk, verbatim)
  awk -v m="$2" '{ l = $0; gsub(/^[ \t\r]+|[ \t\r]+$/, "", l); if (l == m) print NR }' "$1"
}

# ── spec classes (the 0243 pinned machine-read contract — same awk as check.sh's parse_tables) ───
spec_rows="$(awk '
  /^## /  { insec = 0 }
  $0 == "## Inventory Table A — directories" { insec = 1; foundA = 1; next }
  $0 == "## Inventory Table B — files"       { insec = 1; foundB = 1; next }
  insec && /^\| `/ {
    line = $0
    sub(/^\| `/, "", line)
    p = line; sub(/`.*$/, "", p)
    c = line; sub(/^[^`]*` \| /, "", c); sub(/ \|.*$/, "", c)
    printf "%s\t%s\n", p, c
    rows++
  }
  END { if (!foundA || !foundB || rows == 0) exit 3 }
' "$spec")" || die2 "cannot run — the spec's pinned inventory-table headings were not found (spec/skill version skew?): $spec"

class_of() {   # <project-path> → the spec class on stdout, or nothing when the path is not a row
  printf '%s\n' "$spec_rows" | awk -F '\t' -v p="$1" '$1 == p { print $2; exit }'
}

# ── byte-exact line slicing (head/tail/wc arithmetic — no awk records, no re-encoding) ───────────
# A NUL-bearing file can never get here: check.sh refuses to classify one (0245-R1), so it is never
# untouched-stale, and apply's eligibility re-check holds the same line against forged items.
bytes_through_line() {   # <file> <line> → byte count of lines 1..<line> (0 when <line> is 0)
  if [ "$2" -le 0 ]; then printf '0\n'; else printf '%s\n' "$(( $(head -n "$2" "$1" | wc -c) ))"; fi
}
emit_region() {   # <file> <lb> <le> → the file's lines lb..le RAW, byte-for-byte
  local pre end
  pre="$(bytes_through_line "$1" "$(( $2 - 1 ))")"
  end="$(bytes_through_line "$1" "$3")"
  head -c "$end" "$1" | tail -c "+$(( pre + 1 ))"
}
emit_after_line() {   # <file> <line> → every byte after line <line>
  tail -c "+$(( $(bytes_through_line "$1" "$2") + 1 ))" "$1"
}

# ── synthesis: the exact replacement bytes for one untouched-stale path ──────────────────────────
# fkit-authored reference file: the share scaffold copy, verbatim. Root context file (report §8):
#   markers ABSENT on disk (the omnigent-era shape) — whole-file replace with the scaffold copy
#     (owner ruling Q1, 2026-08-07: include; the rules block self-heals on the next launch);
#   one well-formed pair — the scaffold body OUTSIDE its markers + the project file's marker lines
#     and everything strictly between them, preserved byte-for-byte.
# Malformed markers (either side) or a missing scaffold copy: not synthesizable — the caller
# excludes/refuses with $synth_reason. Never guessed past.
synth_reason=""
synthesize() {   # <project-path> → replacement bytes on stdout; rc 1 + $synth_reason when impossible
  local p sf cls abs nb ne lb le snb sne sb se last suffix_len
  p="$1"
  synth_reason=""
  sf="$scaffold/$p"
  if [ -L "$sf" ] || [ ! -f "$sf" ]; then
    synth_reason="share scaffold has no regular-file copy of $p — nothing to synthesize a replacement from"
    return 1
  fi
  # NUL guard on the scaffold source (mirrors check.sh's 0245-R1 guard on project files): apply
  # buffers the replacement in a shell variable before writing, and a variable cannot carry NUL
  # bytes — so a NUL-bearing source must refuse here rather than silently lose bytes downstream.
  if [ "$(wc -c < "$sf")" -ne "$(tr -d '\0' < "$sf" | wc -c)" ]; then
    synth_reason="share scaffold copy of $p contains NUL byte(s) — refusing to synthesize"
    return 1
  fi
  cls="$(class_of "$p")"
  if [ "$cls" != 'root context file' ]; then
    cat "$sf"
    return 0
  fi
  abs="$root/$p"
  # shellcheck disable=SC2046
  set -- $(marker_lines "$abs" "$RULES_BEGIN"); nb=$#; lb="${1:-0}"
  # shellcheck disable=SC2046
  set -- $(marker_lines "$abs" "$RULES_END");   ne=$#; le="${1:-0}"
  if [ "$nb" = 0 ] && [ "$ne" = 0 ]; then
    cat "$sf"                            # markerless untouched-stale: whole-file replace (Q1)
    return 0
  fi
  if [ "$nb" != 1 ] || [ "$ne" != 1 ] || [ "$lb" -ge "$le" ]; then
    synth_reason="markers on the project's $p are malformed ($nb begin / $ne end) — never untouched-stale, never synthesized"
    return 1
  fi
  # shellcheck disable=SC2046
  set -- $(marker_lines "$sf" "$RULES_BEGIN"); snb=$#; sb="${1:-0}"
  # shellcheck disable=SC2046
  set -- $(marker_lines "$sf" "$RULES_END");   sne=$#; se="${1:-0}"
  if [ "$snb" != 1 ] || [ "$sne" != 1 ] || [ "$sb" -ge "$se" ]; then
    synth_reason="share scaffold copy of $p has malformed rules markers ($snb begin / $sne end) — cannot synthesize"
    return 1
  fi
  head -c "$(bytes_through_line "$sf" "$(( sb - 1 ))")" "$sf"   # scaffold body before its begin marker
  emit_region "$abs" "$lb" "$le"                                # the project's marker region, byte-for-byte
  # Keep the result well-formed when the project's region ends the file without a newline: the
  # scaffold's suffix must start on its own line or the end marker stops being a whole line.
  last="$(head -n "$le" "$abs" | tail -c 1 | od -An -tx1 | tr -d ' \n')"
  suffix_len="$(( $(wc -c < "$sf") - $(bytes_through_line "$sf" "$se") ))"
  if [ "$last" != "0a" ] && [ "$suffix_len" -gt 0 ]; then printf '\n'; fi
  emit_after_line "$sf" "$se"                                   # scaffold body after its end marker
}

synth_sha() {   # <project-path> → sha256 of the synthesized replacement (caller validates)
  synthesize "$1" | do_sha | awk '{ print $1 }'
}

# ── the fresh check run both modes parse (stdout is 0245's pinned contract; stderr passes through) ─
check_out="$(bash "$CHECK" --share "$share" "$root")"
check_rc=$?
if [ "$check_rc" != 0 ] && [ "$check_rc" != 1 ]; then
  die2 "check.sh could not run (rc $check_rc) — see its message above; repair cannot proceed"
fi

row_outcome() {   # <bare-path> → the fresh check's outcome for that row, or nothing when absent
  printf '%s\n' "$check_out" | awk -F '\t' -v p="$1" '/^[^#]/ && $2 == p { print $1; exit }'
}

# ═════════════════════════════════════════════════════════════════════════════════════════════════
if [ "$mode" = "propose" ]; then
  n_items=0
  n_excl=0
  oldifs="$IFS"
  IFS="$NL"
  for line in $check_out; do
    IFS="$oldifs"
    case "$line" in ''|'#'*) IFS="$NL"; continue ;; esac
    outcome="${line%%$TAB*}"
    rest="${line#*$TAB}"
    bare="${rest%%$TAB*}"; bare="${bare%/}"
    if [ "$outcome" = "untouched-stale" ]; then
      case "$bare" in
        ai-agents/wiki-vault|ai-agents/wiki-vault/*)
          # Cannot happen while check.sh's class rules hold — belt-and-braces, ADR-005.
          warn "check reported a wiki-vault path untouched-stale — the vault is fkit-wiki's exclusively (ADR-005); skipping $bare"
          IFS="$NL"; continue ;;
      esac
      if ! pre="$(raw_sha "$root/$bare")"; then
        printf '# excluded: %s — cannot raw-hash the on-disk file\n' "$bare"
        n_excl=$((n_excl + 1))
        IFS="$NL"; continue
      fi
      if ! synthesize "$bare" >/dev/null; then
        printf '# excluded: %s — %s\n' "$bare" "$synth_reason"
        n_excl=$((n_excl + 1))
        IFS="$NL"; continue
      fi
      post="$(synth_sha "$bare")"
      if ! valid_sha "$post"; then
        printf '# excluded: %s — replacement did not hash to a valid sha256\n' "$bare"
        n_excl=$((n_excl + 1))
        IFS="$NL"; continue
      fi
      # 0246 review R5: the diff is BUFFERED and its rc checked BEFORE the item line is emitted —
      # a diff that cannot render (rc > 1) RETRACTS the item entirely, because consent is approval
      # of the enumerated list WITH ITS DIFFS IN VIEW (ADR-039 Decision 2); an approveable item
      # line with no diff would invite consent to bytes unseen. The fixed-width sentinel carries
      # diff's rc through the substitution and keeps its trailing bytes exact; both diff inputs
      # are proven NUL-free (check.sh refuses NUL project files, synthesize refuses NUL scaffold
      # copies), so the buffer holds the diff byte-exactly.
      dout="$(diff -u -L "current/$bare" -L "proposed/$bare" "$root/$bare" <(synthesize "$bare"); printf 'x%03d' "$?")"
      dtag="${dout#"${dout%????}"}"
      dout="${dout%????}"
      drc=$((10#${dtag#x}))
      if [ "$drc" -gt 1 ]; then
        printf '# excluded: %s — diff failed (rc %s): consent requires the diff in view, so the item is retracted\n' "$bare" "$drc"
        n_excl=$((n_excl + 1))
        IFS="$NL"; continue
      fi
      printf 'item\t%s\t%s\t%s\n' "$bare" "$pre" "$post"
      printf '# diff %s\n' "$bare"
      printf '%s' "$dout"
      n_items=$((n_items + 1))
    fi
    IFS="$NL"
  done
  IFS="$oldifs"
  if [ "$n_items" = 0 ]; then
    if [ "$n_excl" = 0 ]; then
      printf '# nothing repair-eligible: no untouched-stale rows in the check\n'
    else
      printf '# nothing proposable: %s repair-eligible row(s) were all excluded — see the reasons above\n' "$n_excl"
    fi
  fi
  exit 0
fi

# ═════════════════════════════════════════════════════════════════════════════════════════════════
# apply — one announce line per submitted item: <result>\t<path>\t<what actually happened>
say()    { printf '%s\t%s\t%s\n' "$1" "$2" "$3"; }

first_symlink_component() {   # <relative-path> → the first path component that is a symlink; rc 1 when none
  local walk comp oldifs
  walk=""; oldifs="$IFS"; IFS='/'
  for comp in $1; do
    IFS="$oldifs"
    walk="${walk:+$walk/}$comp"
    if [ -L "$root/$walk" ]; then printf '%s\n' "$walk"; return 0; fi
    IFS='/'
  done
  IFS="$oldifs"
  return 1
}

# 0246 review R7: an interrupt mid-apply must never die silently — the accepted no-atomic-write
# residual's own re-raise clause ("re-raise only if the failure is SILENT") fired. The trap names
# the in-flight path on stderr and exits nonzero; $inflight spans from the moment a fully-guarded
# item enters its write sequence until its announce line is out.
inflight=""
on_interrupt() {
  if [ -n "$inflight" ]; then
    printf '%s\n' "fkit-heal repair: INTERRUPTED while applying $inflight — the write may be incomplete; run check.sh on the project and inspect that file" >&2
  else
    printf '%s\n' "fkit-heal repair: interrupted — no write was in flight" >&2
  fi
  exit 1
}
trap on_interrupt INT TERM HUP

n_applied=0
n_bad=0
n_seen=0
while IFS= read -r line || [ -n "$line" ]; do
  [ -n "$line" ] || continue
  n_seen=$((n_seen + 1))

  case "$line" in
    "item$TAB"*) ;;
    *) say "refused: malformed-item" "-" "not an 'item' line from a propose run — approved lines must be passed verbatim"
       n_bad=$((n_bad + 1)); continue ;;
  esac
  rest="${line#item$TAB}"
  p="${rest%%$TAB*}"
  rest="${rest#*$TAB}"
  pre="${rest%%$TAB*}"
  post="${rest#*$TAB}"
  if [ -z "$p" ] || [ "$rest" = "$post" ] || ! valid_sha "$pre" || ! valid_sha "$post"; then
    say "refused: malformed-item" "${p:--}" "item line does not carry path + two sha256 hashes"
    n_bad=$((n_bad + 1)); continue
  fi

  # (a) path validation — before anything touches the filesystem.
  case "$p" in
    /*|*/|''|*//*)
      say "refused: bad-path" "$p" "not a clean project-relative file path"
      n_bad=$((n_bad + 1)); continue ;;
  esac
  case "/$p/" in
    */../*)
      say "refused: bad-path" "$p" "contains a '..' segment — escapes the project root"
      n_bad=$((n_bad + 1)); continue ;;
  esac
  case "$p" in
    ai-agents/wiki-vault|ai-agents/wiki-vault/*)
      say "refused: wiki-routed" "$p" "any write under ai-agents/wiki-vault/ is fkit-wiki's exclusively (ADR-005) — this script never touches the vault"
      n_bad=$((n_bad + 1)); continue ;;
  esac

  # (b) [-L] FIRST on the target and every ancestor — a write through a link is never a repair.
  if linked="$(first_symlink_component "$p")"; then
    say "refused: symlink" "$p" "path component '$linked' is a symlink — fkit never writes through symlinks"
    n_bad=$((n_bad + 1)); continue
  fi

  # (c) eligibility — the fresh check is the authority; a forged item line dies here.
  outcome="$(row_outcome "$p")"
  if [ -z "$outcome" ]; then
    say "refused: not-in-spec" "$p" "no row in the structure check for this path — only spec-inventory files are ever repaired"
    n_bad=$((n_bad + 1)); continue
  fi
  if [ "$outcome" != "untouched-stale" ]; then
    say "refused: not-repair-eligible" "$p" "classifies '$outcome' right now — only untouched-stale is repair-eligible (ADR-039 v1)"
    n_bad=$((n_bad + 1)); continue
  fi

  # (d) apply-time freshness re-check (ADR-039 Decision 2).
  if ! cur="$(raw_sha "$root/$p")"; then
    say "refused: changed-since-propose" "$p" "cannot re-hash the on-disk file (gone or unreadable since the proposal?)"
    n_bad=$((n_bad + 1)); continue
  fi
  if [ "$cur" != "$pre" ]; then
    say "refused: changed-since-propose" "$p" "the on-disk file no longer matches the state the proposal showed — the consent given was to a diff that no longer exists"
    n_bad=$((n_bad + 1)); continue
  fi

  # (e) replacement synthesis, buffered ONCE — the buffer IS the write (0246 review R1+R6: the
  # OLD shape hashed one synthesis and wrote a second, unverified one; a target/share change or a
  # lost-rc partial between those reads put unapproved bytes on disk, caught only post-write. Now
  # the exact write buffer is hashed against the approved posthash BEFORE the redirect opens, so
  # a drifted or truncated synthesis refuses with nothing written — R6's intermediate-rc exposure
  # is closed by the same gate).
  # ⚠️ Buffering also keeps the write non-self-referential: `synthesize > target` would truncate
  # the target before synthesize reads its marker region FROM that same target (found live). The
  # trailing `x` sentinel keeps command substitution from stripping trailing newlines; both byte
  # sources are proven NUL-free (check.sh refuses NUL project files; synthesize refuses NUL
  # scaffold copies), so the variable holds the replacement byte-exactly. The parent-shell dry
  # run exists to capture $synth_reason — a command-substitution subshell could not.
  if ! synthesize "$p" >/dev/null; then
    say "refused: replacement-unavailable" "$p" "$synth_reason"
    n_bad=$((n_bad + 1)); continue
  fi
  inflight="$p"
  if ! repl="$(synthesize "$p" && printf x)"; then
    say "error: write-failed" "$p" "replacement synthesis failed at write time — nothing written"
    n_bad=$((n_bad + 1)); inflight=""; continue
  fi
  repl="${repl%x}"
  bufsha="$(printf '%s' "$repl" | do_sha | awk '{ print $1 }')"
  if ! valid_sha "$bufsha"; then
    say "refused: replacement-unavailable" "$p" "the write buffer did not hash to a valid sha256 — nothing written"
    n_bad=$((n_bad + 1)); inflight=""; continue
  fi
  if [ "$bufsha" != "$post" ]; then
    say "refused: replacement-drifted" "$p" "the exact bytes about to be written no longer hash to the approved posthash (share updated mid-session, or the target's marker region just changed?) — nothing written; re-propose"
    n_bad=$((n_bad + 1)); inflight=""; continue
  fi

  # (f) the last-instant gauntlet, immediately before the redirect (0246 review R3/R2/R4): the
  # [-L] walk re-run (a symlink swapped in after (b) must not be written through), the
  # multi-hard-link refusal (a hardlink is invisible to -L and to every path check, and the
  # in-place truncate-redirect preserves the inode — the co-linked path's content would be
  # rewritten, silently), and a final on-disk re-hash against the prehash (ADR-039 "immediately
  # before each replacement"). The residual races between these probes and the redirect are
  # recorded accepted residuals — same-privilege only, and unclosable in pure bash (no
  # O_NOFOLLOW, no file compare-and-swap).
  if linked="$(first_symlink_component "$p")"; then
    say "refused: symlink" "$p" "path component '$linked' became a symlink after the earlier check — fkit never writes through symlinks"
    n_bad=$((n_bad + 1)); inflight=""; continue
  fi
  if [ -n "$(find "$root/$p" -maxdepth 0 -links +1 2>/dev/null)" ]; then
    say "refused: hardlink" "$p" "the target has more than one hard link — an in-place write would rewrite every co-linked path's content; fkit never writes through a hardlink"
    n_bad=$((n_bad + 1)); inflight=""; continue
  fi
  if ! cur="$(raw_sha "$root/$p")" || [ "$cur" != "$pre" ]; then
    say "refused: changed-since-propose" "$p" "the on-disk file changed inside the propose->write window — the consent given was to a diff that no longer exists"
    n_bad=$((n_bad + 1)); inflight=""; continue
  fi

  # (g) the write — in place, via redirect (never a rename), then verify the written bytes.
  if ! printf '%s' "$repl" > "$root/$p"; then
    say "error: write-failed" "$p" "could not write the replacement — the file may now be partial; inspect it"
    n_bad=$((n_bad + 1)); inflight=""; continue
  fi
  if ! wrote="$(raw_sha "$root/$p")" || [ "$wrote" != "$post" ]; then
    say "error: verify-failed" "$p" "written bytes do not hash to the approved posthash — inspect the file NOW"
    n_bad=$((n_bad + 1)); inflight=""; continue
  fi
  say "applied" "$p" "replaced with the installed version (the write buffer AND the written bytes verified against the approved posthash)"
  inflight=""
  n_applied=$((n_applied + 1))
done

[ "$n_seen" = 0 ] && printf '# nothing to apply: no item lines on stdin\n'
[ "$n_bad" -gt 0 ] && exit 1
exit 0
