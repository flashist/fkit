#!/usr/bin/env bash
# One-command setup to use the fkit agent team on a project, Claude Code flavor.
# Idempotent — safe to re-run.
#
# Claude Code discovers agents/skills from a project's .claude/ directory; this script puts the
# fkit team there and scaffolds the shared working structure:
#   1. scaffold the ai-agents/ working structure (from claude/scaffold/ — single source of truth).
#      An existing tree is CONVERGED, not skipped: scaffold paths it lacks are created, and paths it
#      already has are never touched (create-if-absent only — see converge_ai_agents below).
#   2. drop project-root CLAUDE.md (Claude-flavored, with the team map) and AGENTS.md (the codex
#      CLI reads it for the adversarial pass) — skipped if they already exist
#   3. refresh .claude/agents/fkit-*.md and .claude/skills/fkit-*/ from claude/ (fkit-managed:
#      removed and re-copied; other files in .claude/ are never touched)
#   4. install the .fkit/interview terminal intake; on a fresh project, run it → .fkit/intake.md
#   5. gitignore the fkit-managed copies
#   6. delete the Omnigent orphan residue this project may still carry (claude/orphan-targets) — the
#      one destructive thing fkit does; announced per path, gated on a reference check
#
# Usage:  claude/fkit-claude-init.sh <project-root>    # e.g. `claude/fkit-claude-init.sh .`
# Then:   cd <project-root> && fkit                    # pick a role from the menu
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"                  # .../claude
scaffold="$here/scaffold"                              # the scaffold (repo checkout AND install share)
dest_in="${1:?usage: fkit-claude-init.sh <project-root>}"
[ -d "$dest_in" ] || { echo "error: not a directory: $dest_in" >&2; exit 1; }
dest="$(cd "$dest_in" && pwd)"                         # absolute
[ -d "$scaffold/ai-agents" ] || { echo "error: shared scaffold not found at $scaffold" >&2; exit 1; }

# ---------- convergence: top up an EXISTING ai-agents/ with scaffold paths it does not have ----------
#
# THE INVARIANT, and it is not negotiable:
#
#     Convergence NEVER writes to a path that already exists.
#     Create-if-absent only. No overwrite, no move, no delete — ever — inside ai-agents/.
#
# Every safety property here is downstream of that one line. There is no rollback, no dry-run and no
# refuse-on-dirty-tree because there is no torn state: nothing is mutated, only added. Break the
# invariant and all three become mandatory, because this becomes an unattended, every-launch,
# no-consent mutation of the user's own documents — the most dangerous code in fkit.
#
# Why this exists: `[ -e "$dest/ai-agents" ]` used to gate the copy of EVERYTHING beneath it, so the
# guard was doing two jobs — "don't clobber the user's content" (right) and "don't add anything new"
# (never intended). A project scaffolded last month could therefore never gain a scaffold path added
# this month. Separating those two jobs is all this is.
#
# Its price, paid openly: this CANNOT fix content drift. A scaffold-authored file whose contents
# changed (ai-agents/README.md is the standing example) is a path that ALREADY EXISTS, so we step over
# it, forever. That residual is deliberate and owner-accepted. Do NOT "improve" this into overwriting a
# file it thinks is stale: the safety and the limitation are the SAME property.
#
# STATELESS by design. The scaffold and the disk are the only inputs. No cursor, no manifest, no
# version, no "which release is this project at" — a cursor cannot survive a `git clone` anyway,
# because .fkit/ is gitignored (see add_ignore below). If this ever grows a notion of project version,
# it has become the migration mechanism that was rejected on the merits.

# Restore the shell state converge_ai_agents pins (IFS, noglob). An `if` rather than
# `[ … ] && set +f`: under `set -e` a trailing test that FAILS is an unguarded non-zero, which is how
# a tidy one-liner turns "nothing to converge" into "init died". This file has been bitten by that
# shape before (see the marker_lines/`head -1` note below); do not reintroduce it.
converge_restore() {
  IFS="$oldifs"
  if [ "$oldglob" = 0 ]; then set +f; fi
}

converge_ai_agents() {
  created=""        # scaffold-relative paths this pass created — the announcement, and the .gitkeep rule
  created_dirs=""   # dirs THIS pass created; the .gitkeep rule keys off exactly this set
  skipped=""        # subtrees we refused to descend into (symlink / wrong type / failed write)

  # These lists are NEWLINE-delimited and iterated with `for x in $list`, which splits on $IFS. Under
  # the default IFS a path containing a SPACE would split into two bogus entries — and keep_out is USER
  # input, so that is reachable, not theoretical. Pin IFS to newline for the whole function and restore
  # it at every return. (`IFS= read` sets its own per-command, so the parsers below are unaffected.)
  #
  # `set -f` matters just as much, and pinning IFS alone did NOT cover it (round-1 review, R3): an
  # unquoted `$list` is subject to GLOBBING as well as splitting. A keep-out line of `wiki-*` was
  # therefore expanded against the launcher's CURRENT WORKING DIRECTORY — so the same repo with the
  # same opt-out file converged differently depending on where you happened to run `fkit` from
  # (reproduced: kept out from a dir containing a `wiki-vault` file, recreated from /tmp). These are
  # PATH PATTERNS to match literally, never shell globs. No globbing anywhere in this function.
  oldifs="$IFS"; IFS='
'
  case "$-" in *f*) oldglob=1 ;; *) oldglob=0 ;; esac    # restore only if WE turned it off
  set -f

  # The opt-out. A user who deliberately deleted wiki-vault/ (they don't use the wiki) must not have it
  # silently resurrected on every launch forever with no way to stop it — deletion has to be
  # respectable. One scaffold-relative path per line; an entry covers that path AND everything beneath
  # it, which is the whole-tree form. `#` comments and blanks ignored.
  #
  # ⚠️ It lives in ai-agents/ — TRACKED — and NOT in .fkit/, which is gitignored. This is the same trap
  # that killed the version cursor: an opt-out in .fkit/ is invisible to a teammate who clones the repo,
  # and THEIR launch resurrects the folder the owner deliberately removed. It is still stateless: it
  # records INTENT, not progress, so it is not a cursor by the back door.
  keep_out=""
  ko="$aa/.fkit-keep-out"
  # An opt-out we cannot READ must fail CLOSED (round-1 review, R1). The old test silently fell through
  # to "no opt-outs" — so a `chmod 000` (or symlinked, or directory) .fkit-keep-out meant the user's
  # deliberate deletion was resurrected on every launch with NOT ONE WORD said, and the announcement
  # then cheerfully listed the very folder they had opted out of. That was the lone silent fail-open in
  # a file that refuses loudly everywhere else, and it failed in the user's DISfavour: we know intent
  # was recorded and we cannot read it, which is precisely when guessing "they meant nothing" is worst.
  # Skip convergence entirely and say why — the user can always fix the file; they cannot undo a
  # resurrection they never saw.
  if [ -e "$ko" ] || [ -L "$ko" ]; then
    if [ -L "$ko" ] || [ ! -f "$ko" ] || [ ! -r "$ko" ]; then
      {
        echo "⚠ skipped converging ai-agents/ — its .fkit-keep-out cannot be read"
        echo "    $ko"
        echo "  It records which paths fkit must never create, so fkit will not guess. Nothing was"
        echo "  written. Make it a readable regular file (or delete it) and fkit will converge again."
      } >&2
      converge_restore
      return 0
    fi
  fi
  if [ -f "$ko" ]; then
    # `|| [ -n "$line" ]` so a final line with no trailing newline is still read. \r is trimmed for the
    # same reason the rules matcher trims it: a CRLF checkout must not silently match nothing.
    while IFS= read -r line || [ -n "$line" ]; do
      line="$(printf '%s' "$line" | tr -d '\r')"
      case "$line" in ''|'#'*) continue ;; esac
      line="${line#./}"; line="${line#/}"           # normalize to scaffold-relative
      while :; do case "$line" in */) line="${line%/}" ;; *) break ;; esac; done
      [ -n "$line" ] && keep_out="$keep_out$line
"
    done < "$ko"
  fi

  # Walk the scaffold in `sort` order so a parent ALWAYS precedes its children: a child is its parent's
  # string plus "/…", i.e. the parent is a proper prefix, and a proper prefix always sorts first. That
  # ordering is what lets created_dirs and skipped be built in one pass — by the time we reach
  # `a/b/.gitkeep` we already know whether we made `a/b`. LC_ALL=C keeps it byte-order and
  # locale-independent. (The scaffold is fkit's own tree; no newlines in its filenames.)
  #
  # ⚠️ Collected FIRST, then fed in by heredoc — deliberately NOT `find … | while read`. A piped `while`
  # runs in a SUBSHELL, so every assignment below (created, created_dirs, skipped) would be discarded
  # the moment the loop ended: the walk would work perfectly and then announce NOTHING, on every run.
  # That is invisible to any test that only checks the created files. No pipe into the loop, no bug.
  tree="$(find "$scaffold/ai-agents" -mindepth 1 | LC_ALL=C sort)"
  while IFS= read -r src; do
    [ -n "$src" ] || continue
    rel="${src#"$scaffold/ai-agents/"}"
    dst="$aa/$rel"

    # Inside a subtree we already refused? Stay out of it, silently — we warned once at its root.
    in_skipped=0
    for s in $skipped; do
      case "$rel" in "$s"/*) in_skipped=1; break ;; esac
    done
    [ "$in_skipped" = 1 ] && continue

    # Opted out? An entry covers the path itself and everything under it, so a subtree opt-out needs no
    # separate bookkeeping.
    kept=0
    for k in $keep_out; do
      case "$rel" in "$k"|"$k"/*) kept=1; break ;; esac
    done
    [ "$kept" = 1 ] && continue

    # [ -L ] FIRST, ALWAYS. -e/-d DEREFERENCE. A symlinked ai-agents/ is caught by the preflight above,
    # but per-path writes add a NEW seam the all-or-nothing guard never had: a symlinked SUBDIR
    # (ai-agents/knowledge-base -> /somewhere/else) reads as an existing directory to -d, and we would
    # then mkdir/cp straight THROUGH it, outside the project fkit was pointed at. -L is the one test
    # that does not lie. A broken symlink is caught here too: -e is false for one, so without this we
    # would `cp` through the dangling link and create its target.
    if [ -L "$dst" ]; then
      skipped="$skipped$rel
"
      echo "⚠ ai-agents/$rel is a symlink — fkit will not write through it" >&2
      continue
    fi

    if [ -e "$dst" ]; then
      # THE INVARIANT. The path exists: do nothing. Not a diff, not a compare, not a backup. Nothing.
      # The one exception is not an exception to it — a scaffold DIRECTORY sitting on top of the user's
      # FILE is not a path we can descend into, so we refuse the subtree rather than write into it.
      if [ -d "$src" ] && [ ! -d "$dst" ]; then
        skipped="$skipped$rel
"
        echo "⚠ ai-agents/$rel is not a directory — fkit will not converge below it" >&2
      elif [ -d "$dst" ] && { [ ! -r "$dst" ] || [ ! -x "$dst" ]; }; then
        # An existing dir we cannot read INTO (round-1 review, R4). Without this we descend anyway, and
        # `[ -e ]` is false for every child — not because they are absent, but because we cannot stat
        # them — so we try to create files that already exist and emit a warning per child, on EVERY
        # launch, forever. Refuse the subtree once, with a message naming the actual cause.
        skipped="$skipped$rel
"
        echo "⚠ ai-agents/$rel cannot be read into — fkit will not converge below it (check its permissions)" >&2
      fi
      continue
    fi

    if [ -d "$src" ]; then
      # Non-fatal, per write: a convergence failure must NEVER brick the launcher, and must not even
      # cost the user the REST of setup (their agents and skills are refreshed further down). We warn,
      # refuse the subtree, and carry on — `set -e` never sees a non-zero.
      if mkdir "$dst" 2>/dev/null; then
        created="$created$rel/
"
        created_dirs="$created_dirs$rel
"
      else
        skipped="$skipped$rel
"
        echo "⚠ could not create ai-agents/$rel — skipping it and everything under it" >&2
      fi
      continue
    fi

    # THE .gitkeep RULE — the subtle one a naive create-if-absent pass gets wrong.
    #
    # A user whose tasks/backlog/ holds real briefs has very likely deleted its .gitkeep. Blind
    # create-if-absent RESURRECTS it on every launch and dirties `git status` forever — turning
    # convergence into a thing that quietly edits the user's repo. A .gitkeep is a placeholder for an
    # EMPTY directory; it is meaningless in a directory that has content.
    #
    # Rule: a .gitkeep is created ONLY when its own directory was created by THIS pass. Never added to a
    # directory that already existed.
    case "$rel" in
      */.gitkeep|.gitkeep)
        parent="${rel%/*}"
        [ "$parent" = "$rel" ] && continue          # top-level .gitkeep: its dir is ai-agents/, which exists
        is_new=0
        for d in $created_dirs; do
          [ "$d" = "$parent" ] && { is_new=1; break; }
        done
        [ "$is_new" = 1 ] || continue
        ;;
    esac

    if cp "$src" "$dst" 2>/dev/null; then
      created="$created$rel
"
    else
      echo "⚠ could not create ai-agents/$rel" >&2
    fi
  done <<EOF
$tree
EOF

  # ⚠️ THE OUTPUT TRAP, and it is why this goes to STDERR.
  #
  # Convergence only EVER fires on an already-set-up project — a fresh one takes the `cp -R` branch
  # instead. And the launcher calls init with `>/dev/null` on exactly that kind of project
  # (fkit-claude.sh). So an announcement on stdout is discarded 100% of the time: the feature would be
  # "implemented", invisible, and would pass a naive review that only checked that the code echoes.
  #
  # Of the two honest fixes — print to stderr, or un-silence the call site — this takes STDERR, the
  # channel this file already uses for precisely this reason (see the preflight refusal above). Simply
  # removing the `>/dev/null` was rejected: it restores the wall of per-launch "• already present" noise
  # that the quiet path exists to suppress, and noise is how a real refusal stops being read.
  #
  # Announce ONLY when something was created. The happy path runs on every launch of every project
  # forever and must stay COMPLETELY silent. If fkit adds a path to a user's project it says so, once,
  # on the launch it happens — silent mutation of someone's tree is what makes every other failure mode
  # nasty.
  if [ -z "$created" ]; then converge_restore; return 0; fi
  {
    echo "⚙ fkit added new paths to ai-agents/ (create-if-absent; nothing existing was changed):"
    for p in $created; do echo "    $p"; done
    echo "  Renamed one of these? fkit cannot tell a rename from a deletion, so you now have both —"
    echo "  delete the new one and list it in ai-agents/.fkit-keep-out to stop it coming back."
  } >&2
  converge_restore
  return 0
}

# 1. ai-agents/ working structure (never clobber an existing one)
#
# PREFLIGHT FIRST — `[ -e ]` and `[ -d ]` DEREFERENCE symlinks, so on a symlinked ai-agents/ they
# cheerfully report on a directory somewhere else entirely, and `cp -R` then writes THROUGH the link.
# `[ -L ]` is the one test that does not lie, so it has to come first: any fix that reaches for -e/-d
# ahead of -L puts the bug straight back. fkit must never write outside the project it was pointed at.
#
# Refusing is NOT a failure the user has to fix in order to launch. We skip this one step, say so
# plainly, and carry on with the rest of setup — a weird ai-agents/ must not cost anyone their agents.
# The message goes to STDERR on purpose: the launcher sends init's stdout to /dev/null on an
# already-set-up project, and a live symlink or a file-where-the-dir-belongs looks "already set up" to
# it — so on stdout this warning would be swallowed in exactly the cases it exists for.
aa="$dest/ai-agents"
aa_state=""
if [ -L "$aa" ]; then
  aa_state="a symlink — fkit will not write through it"
elif [ -e "$aa" ] && [ ! -d "$aa" ]; then
  aa_state="not a directory — something else is sitting where the ai-agents/ tree belongs"
elif [ -d "$aa" ] && { [ ! -r "$aa" ] || [ ! -x "$aa" ]; }; then
  aa_state="a directory fkit cannot read into — check its permissions"
fi

if [ -n "$aa_state" ]; then
  {
    echo "⚠ skipped ai-agents/ — it is $aa_state"
    echo "    $aa"
    echo "  Nothing was written to it and nothing is broken. The rest of setup continues and your"
    echo "  session will start. Replace it with a real directory if you want fkit to manage it."
  } >&2
elif [ ! -e "$aa" ]; then
  cp -R "$scaffold/ai-agents" "$aa"
  echo "• created ai-agents/ (from scaffold)"
else
  converge_ai_agents
fi

# 2. shared context files. CLAUDE.md carries the team map + dispatch rules; AGENTS.md is read
#    natively by the codex CLI during the adversarial pass — which is why the universal hard rules
#    have to be in BOTH: Claude reads one, Codex reads the other.
#
#    These files are the OWNER'S. We create them when absent, and otherwise touch exactly one region:
#    a marker-delimited block that fkit owns and rewrites. Everything outside the markers is theirs and
#    is never modified — that promise is what earns the right to write into a file they already had.
#
#    Before this, an existing CLAUDE.md/AGENTS.md was left entirely as-is, so a project that already
#    used Claude Code (i.e. every brownfield one) received NONE of the universal hard rules, and fkit
#    had no channel to ship a correction to them either.
RULES_BEGIN='<!-- fkit:begin-rules -->'
RULES_END='<!-- fkit:end-rules -->'
RULES_MAX=4096   # the block lands in every agent's context on every turn; cap fkit's own verbosity

RULES_TAG='fkit-managed:'   # appears in the block header; how we recognize a region we wrote

rules_src="$scaffold/universal-rules.md"
[ -f "$rules_src" ] || { echo "error: missing $rules_src" >&2; exit 1; }

emit_block() {   # the fkit-managed block, markers included
  printf '%s\n' "$RULES_BEGIN"
  printf '<!-- %s this block is REPLACED on every `fkit` launch. Edits inside these two markers\n' "$RULES_TAG"
  printf '     are overwritten. Put your own standing instructions OUTSIDE them — everything outside\n'
  printf '     is yours and fkit never touches it. Note the markers are recognized only when a marker\n'
  printf '     is ALONE on its line, so quoting one inline in your prose is safe; a bare marker line\n'
  printf '     inside a code fence, however, still reads as a real marker. -->\n\n'
  cat "$rules_src"
  printf '%s\n' "$RULES_END"
}

# Cap the EMITTED block, not the source file — the source is only part of what lands in context, and
# the block is what every agent actually pays for on every turn. Capping the input measured the wrong
# thing.
block_size="$(emit_block | wc -c | tr -d ' ')"
if [ "$block_size" -gt "$RULES_MAX" ]; then
  echo "error: the fkit rules block is ${block_size}B, over the ${RULES_MAX}B cap." >&2
  echo "       It is injected into every agent's context on every turn. Trim $rules_src." >&2
  exit 1
fi

# Line numbers where <marker> is the WHOLE line (leading/trailing whitespace tolerated).
#
# This MUST NOT be a substring match. `grep -F` would treat a CLAUDE.md that merely *documents* the
# markers in prose — "the begin marker is `<!-- fkit:begin-rules -->` …" — as a real region, and
# silently delete every line between the two sentences. That is someone else's file, and it happened:
# it is the defect this function exists to prevent. awk compares the trimmed line for equality, so a
# marker quoted inline in a sentence is inert.
# \r is in the trim set on purpose: without it a CRLF file never matches its own markers, so every
# launch appends ANOTHER block — unbounded growth — and the stale block, invisible to the matcher, can
# never receive a rules correction again. That is this feature's original bug, resurrected for Windows.
marker_lines() {   # <file> <marker> → matching line numbers, one per line
  awk -v m="$2" '{ l = $0; gsub(/^[ \t\r]+|[ \t\r]+$/, "", l); if (l == m) print NR }' "$1"
}

merge_rules() {   # merge_rules <path> <name> — idempotent, in-place, refuses rather than guesses
  f="$1"; name="$2"
  # [ -L ] FIRST. -e/-f DEREFERENCE, so on a symlink they report on the target and we would write
  # straight through it, outside the project. Same bug as the ai-agents/ guard above; second seam.
  if [ -L "$f" ]; then
    echo "⚠ skipped $name — it is a symlink; fkit will not write through it" >&2; return 0
  fi
  if [ -e "$f" ] && [ ! -f "$f" ]; then
    echo "⚠ skipped $name — it exists but is not a regular file" >&2; return 0
  fi
  if [ ! -r "$f" ]; then
    echo "⚠ skipped $name — fkit cannot read it (check its permissions)" >&2; return 0
  fi
  if [ ! -w "$f" ] || [ ! -w "$dest" ]; then
    echo "⚠ skipped $name — not writable" >&2; return 0
  fi

  # `set --` rather than `… | head -1`: under `pipefail`, a consumer that exits early (head) SIGPIPEs
  # the producer, and the whole pipeline reports 141 — which under `set -e` kills init outright, on the
  # code path whose entire job is to refuse gracefully. No pipes here, so nothing to break.
  # (Safe inside the function: we already captured the args as $f/$name.)
  # shellcheck disable=SC2086
  set -- $(marker_lines "$f" "$RULES_BEGIN"); nb=$#; lb="${1:-0}"
  # shellcheck disable=SC2086
  set -- $(marker_lines "$f" "$RULES_END");   ne=$#; le="${1:-0}"

  tmp="$f.fkit-tmp.$$"
  # A `set -e` abort between here and the mv would otherwise strand a .fkit-tmp.<pid> file in the
  # owner's project root. Clean it up on any exit; the trap is cleared once the merge is settled.
  trap 'rm -f "$tmp"' EXIT
  if [ "$nb" = 0 ] && [ "$ne" = 0 ]; then
    # No block yet (the brownfield case). Append once, at EOF — a defined, boring position; we do not
    # try to divine where in someone else's document our section "belongs". Guarantee the separating
    # newline ourselves: a file with no trailing newline would otherwise have its last line absorbed
    # into the marker line.
    { cat "$f"; [ -n "$(tail -c 1 "$f")" ] && printf '\n'; printf '\n'; emit_block; } > "$tmp"
  elif [ "$nb" = 1 ] && [ "$ne" = 1 ] && [ "$lb" -lt "$le" ]; then
    # Exactly one well-formed pair → replace the region WHERE IT IS. Not delete-and-append: a block
    # that migrates to EOF on every launch is still us rearranging the owner's file, just slowly.
    #
    # But first: is this region ACTUALLY OURS? An empty region is an opt-in — the scaffold ships a bare
    # marker pair, and an owner may add one to choose where the block goes. A region with content we
    # did not write is a different animal: the markers got there some other way (the classic case is a
    # bare marker line inside a fenced code block in the owner's own prose), and we are about to delete
    # text we do not own. We still proceed — the markers are unambiguous — but we do NOT do it silently.
    # stderr, because init's stdout is /dev/null'd on an already-set-up project, which is precisely when
    # this fires.
    # Guard the range: an ADJACENT pair (le == lb+1) encloses nothing, and `sed -n '5,4p'` does not
    # print nothing — it prints the START line. Without this guard the probe read the end-marker line
    # as if it were the region's content, so the scaffold's own bare marker pair looked like foreign
    # text and EVERY brand-new project warned about the file fkit had just written. A warning that
    # cries wolf on a user's first launch is worth less than no warning at all — and this one is the
    # only thing making the code-fence tradeoff survivable.
    if [ "$le" -gt "$((lb + 1))" ]; then
      region="$(sed -n "$((lb + 1)),$((le - 1))p" "$f")"
      # `case`, not `printf … | grep -q`: grep -q exits on its first match, EPIPEing printf, which under
      # pipefail makes the pipeline non-zero — and the `!` then inverts that into "tag absent", firing
      # the warning on a block we DID write, plus a raw "write error: Broken pipe" leak. No pipe, no bug.
      case "$region" in
        *"$RULES_TAG"*) has_tag=1 ;;
        *)              has_tag=0 ;;
      esac
      if [ -n "$(printf '%s' "$region" | tr -d '[:space:]')" ] && [ "$has_tag" = 0 ]; then
        echo "⚠ $name: replacing the content between the fkit rules markers — fkit did not write it." >&2
        echo "    If those markers are part of your own text (e.g. inside a code fence), rename them;" >&2
        echo "    everything between them is managed by fkit and is overwritten on every launch." >&2
      fi
    fi
    { [ "$lb" -gt 1 ] && sed -n "1,$((lb - 1))p" "$f"; emit_block; sed -n "$((le + 1)),\$p" "$f"; } > "$tmp"
  else
    # Begin without end, end without begin, or several pairs: the extent of the block is UNKNOWABLE and
    # the wrong guess silently deletes the owner's prose. Refuse; never "helpfully" re-close it.
    echo "⚠ skipped $name — its fkit:begin-rules/fkit:end-rules markers are malformed" >&2
    echo "    ($nb begin, $ne end). Fix or remove them and fkit will manage the block again." >&2
    rm -f "$tmp"; trap - EXIT
    return 0
  fi

  if cmp -s "$tmp" "$f"; then
    rm -f "$tmp"; trap - EXIT           # unchanged: say NOTHING. init runs on every single launch, and
    return 0                            # a per-launch "rewrote CLAUDE.md" trains people to ignore init's
  fi                                    # output — which is the channel a real refusal has to get through.
  mv "$tmp" "$f"                        # all-or-nothing: never leave a half-written CLAUDE.md behind
  trap - EXIT
  echo "• updated the fkit rules block in $name"
}

install_root_file() {   # create from the scaffold when absent, then merge the managed block
  name="$1"; f="$dest/$name"
  if [ -L "$f" ]; then
    echo "⚠ skipped $name — it is a symlink; fkit will not write through it" >&2; return 0
  fi
  if [ ! -e "$f" ]; then
    cp "$scaffold/$name" "$f"
    echo "• created $name"
  fi
  merge_rules "$f" "$name"
}
install_root_file CLAUDE.md
install_root_file AGENTS.md

# 3. refresh the fkit-managed agents + skills (rm+cp of fkit-managed names ONLY — a user's own
#    agents/skills in .claude/ are never touched)
mkdir -p "$dest/.claude/agents" "$dest/.claude/skills"
rm -f "$dest/.claude/agents/fkit-"*.md
cp "$here/agents/fkit-"*.md "$dest/.claude/agents/"
n_agents="$(ls "$here/agents/fkit-"*.md | wc -l | tr -d ' ')"
for d in "$dest/.claude/skills/fkit-"*/; do
  [ -d "$d" ] && rm -rf "$d"
done
cp -R "$here/skills/fkit-"* "$dest/.claude/skills/"
n_skills="$(ls -d "$here/skills/fkit-"*/ | wc -l | tr -d ' ')"
echo "• refreshed $n_agents agents → .claude/agents/, $n_skills skills → .claude/skills/"

# 4. first-run intake — a quick TERMINAL questionnaire asked before any LLM starts. It writes the
#    owner's answers to .fkit/intake.md, which /fkit-initiate-project reads, so the basics are
#    captured deterministically. tty-safe: probes the controlling terminal and skips cleanly when
#    headless (the LLM interviews instead).
mkdir -p "$dest/.fkit"
cat > "$dest/.fkit/interview" <<'INTERVIEW'
#!/bin/sh
# fkit first-run intake. Asks a few project questions on the controlling terminal and writes
# .fkit/intake.md. Exits cleanly (no file) when there is no terminal, so the LLM interviews instead.
set -eu
root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/.fkit/intake.md"
# Answers already captured (e.g. a relaunch before initiation completed) — never re-ask or
# overwrite them; delete .fkit/intake.md to redo the intake.
[ -f "$out" ] && exit 0
# Need a usable controlling terminal. `[ -r /dev/tty ]` is unreliable (the device node carries rw bits
# even with no tty), so actually try to OPEN it; if that fails (headless/CI), skip cleanly and let the
# LLM interview instead. `exec 3<file` would exit the shell on failure before any `|| exit`, so probe
# with a subshell first, THEN open it ONCE — fd 3 to read answers, fd 4 to print prompts. Re-opening
# /dev/tty per question can drop a line when all the input arrives at once.
( : < /dev/tty ) 2>/dev/null || exit 0
( : > /dev/tty ) 2>/dev/null || exit 0
exec 3</dev/tty
exec 4>/dev/tty

ask() {  # ask "<question>" "<hint>"  → prints the question to the terminal, echoes the typed answer
  printf '\n%s\n' "$1" >&4
  if [ -n "${2:-}" ]; then printf '  (%s)\n' "$2" >&4; fi
  printf '> ' >&4
  IFS= read -r ans <&3 || ans=""
  printf '%s' "$ans"
}

printf '\n──────────────────────────────────────────────\n' >&4
printf ' fkit — quick project intake\n' >&4
printf ' A few questions so the agents start with context. Press Enter to skip any.\n' >&4
printf '──────────────────────────────────────────────\n' >&4

name=$(ask "1. Project name?")
what=$(ask "2. What is it, in a sentence or two?" "what you're building")
who=$(ask "3. Who is it for, and what problem does it solve for them?")
stage=$(ask "4. What stage is it?" "greenfield / prototype / live / rewrite")
goal=$(ask "5. Near-term goal — what should exist first?")
cons=$(ask "6. Key constraints, deadlines, or non-goals?" "optional")

{
  printf '# fkit intake\n\n'
  printf 'The owner answered these on the terminal before launch. Use them as the product brief and\n'
  printf 'do NOT re-ask what is answered here. A dash (—) means the owner skipped it.\n\n'
  printf -- '- **Project name:** %s\n' "${name:-—}"
  printf -- '- **What it is:** %s\n' "${what:-—}"
  printf -- '- **Who / problem:** %s\n' "${who:-—}"
  printf -- '- **Stage:** %s\n' "${stage:-—}"
  printf -- '- **Near-term goal:** %s\n' "${goal:-—}"
  printf -- '- **Constraints / non-goals:** %s\n' "${cons:-—}"
} > "$out"

printf '\nThanks — captured to .fkit/intake.md.\n' >&4
INTERVIEW
chmod +x "$dest/.fkit/interview"

echo "• created intake .fkit/interview"

# 5. gitignore the fkit-managed copies (re-created by this script; canonical sources live in the
#    fkit install/repo). Deliberately NOT the whole .claude/ — a project's own settings.json,
#    agents, and skills stay tracked.
gi="$dest/.gitignore"
add_ignore() {  # add_ignore <pattern> <comment>
  if [ -f "$gi" ] && grep -qxF "$1" "$gi"; then
    echo "• .gitignore already ignores $1"
  else
    printf '\n# %s\n%s\n' "$2" "$1" >> "$gi"
    echo "• added $1 to .gitignore"
  fi
}
add_ignore '.fkit/' 'fkit-managed local state (intake, tmp; re-created by fkit init)'
add_ignore '.claude/agents/fkit-*.md' 'fkit-managed agents (refreshed by fkit-claude-init.sh)'
add_ignore '.claude/skills/fkit-*/' 'fkit-managed skills (refreshed by fkit-claude-init.sh)'

# ---------- 6. the Omnigent orphan residue ----------
#
# ⚠️ THIS IS THE ONLY DESTRUCTIVE OPERATION IN FKIT. Read the whole comment before touching it.
#
# The old Omnigent runtime wrote its own state into the CONSUMING project — vendored agent bundles, a
# runner, session state, its own config dir. ADR-009 deleted that runtime in Sprint 2 and nothing has
# referenced those paths since, but init never cleaned them: every launch of a project that used the old
# flavor steps over orphaned bundles from a runtime that no longer exists. Task 36 / migration report §9.
#
# The paths themselves are in claude/orphan-targets and are NOT repeated here, on purpose. Naming one in
# this comment is a REFERENCE, and the gate below counts references — prose included. It cannot tell
# "we mention this path" from "we use this path", and it must not try: a gate that judges intent is a
# gate that can be argued with. Say what the code does; let the list say which paths.
#
# It is NOT part of convergence, deliberately. Convergence's invariant is "never writes to a path that
# already exists — no overwrite, no move, no delete, ever". A delete folded into that function would
# falsify its own design record and, worse, inherit "runs silently, unattended, on every launch" for the
# one operation that must never be silent. Separate function, separate section, its own bar.
#
# ONE-TIME BY BEING SELF-LIMITING, not by remembering anything. Once the targets are gone, every later
# launch is a no-op and says nothing. No cursor, no manifest, no "did I already clean this" flag — the
# same reason convergence is stateless: .fkit/ is gitignored, so a cursor cannot survive a clone.
#
# CONSENT: announce-only, by owner ruling (2026-07-17) — delete on run, print exactly what was removed.
# No prompt, no stored consent (a stored decision cannot survive a clone either — the same trap).
# The ruling decides THIS cleanup only and sets no precedent: any future destructive operation goes back
# to the owner. It waived the ceremony, NOT the safety bar below.
#
# ⚠️ THE ANNOUNCEMENT IS THE CONSENT. Announce-only means there is no prompt and no stored decision, so
# the printed list is the ONLY thing standing between fkit and deleting something behind the user's back.
# An announcement that is wrong in the destructive direction ("did not remove" about something we
# emptied) is therefore not a cosmetic bug — it is the consent model failing. Every branch below that
# touches the disk MUST report what actually happened, not what the exit status implied.
#
# ACCEPTED RESIDUALS — owner-ruled 2026-07-17, review round 1. Do NOT "fix" these silently:
#   • TOCTOU (C4): between the symlink check and `rm -rf` there is a microsecond window in which the path
#     could be swapped for a symlink. This is NOT closable in shell — it needs openat()-class primitives.
#     A partial mitigation would shrink the window while making the code LOOK safe, which is worse than
#     the honest gap. Accepted knowingly. Anyone attacking that window can already write the tree
#     directly. If this file ever stops being shell, close it properly.
#   • Buffered announcement (C3): the report prints after the loop, so a kill -9 mid-cleanup deletes
#     without ever announcing — and, because the cleanup is self-limiting, it never announces later
#     either. Accepted: announcing per-path would fragment the report for a window you have to be
#     actively killing fkit to hit.
orphan_targets="$here/orphan-targets"      # THE list. Exhaustive by ruling — see that file's header.

# Does a target path still appear anywhere in fkit's own shipped sources? THE GATE.
#
# The list above is a claim that these paths are dead, written down on 2026-07-14. This re-checks that
# claim against the code, at run time, immediately before deleting anything — because the claim has
# already been wrong once: revision 1 of the report named .fkit/settings for deletion, which is live
# lockdown state written on every launch. A target that has GAINED a reference since is refused, not
# deleted, and the discrepancy is printed. Evidence before assertion: the list does not get to be
# trusted just because it is a list.
#
# The exclusion is exactly one file — orphan-targets itself, which necessarily contains every token.
# That is why the list lives in its own data file rather than inline here: a reference that crept into
# THIS script is then still caught by the gate, which it would not be if we had to exclude this file.
#
# ⚠️ IT FAILS CLOSED, and that is the whole point (review round 1, R2). The first version answered
# "could not run the check" and "ran the check, found nothing" with the same empty string — so a grep
# that errored read as "verified dead" and we deleted. A gate whose failure mode is `delete` is not a
# gate. Now: rc>1 from grep (missing, unreadable, broken) → return 2 → the caller REFUSES the target.
# `-i` because macOS filesystems are case-insensitive (C5): a differently-cased list line would find the
# real path on disk while a case-sensitive grep found no references to it. Matching more than we
# strictly need only ever causes a refusal, never a deletion — errors in the safe direction.
# The `($|[^A-Za-z0-9_.-])` boundary stops a short target matching a LONGER unrelated path that merely
# starts with the same bytes (C1) — while still counting a reference to a path INSIDE the target, or one
# followed by a quote, as the real reference it is.
orphan_refs() {  # orphan_refs <path-token> → prints referencing files; rc 0 = check ran, 2 = UNTRUSTWORTHY
  esc="$(printf '%s' "$1" | sed 's/[][\.*^$(){}?+|]/\\&/g')" || return 2
  out=""
  rc=0
  out="$(grep -rlEi -- "$esc(\$|[^A-Za-z0-9_.-])" "$here" 2>/dev/null)" || rc=$?
  # grep's contract: 0 = matched, 1 = no match, >1 = it could not do its job. Only 0 and 1 are answers.
  if [ "$rc" -gt 1 ]; then return 2; fi
  printf '%s' "$out" | grep -vxF -- "$orphan_targets" || true
  return 0
}

# Is this list line safe to delete — i.e. does it stay inside the project, with no symlink anywhere in
# the chain? Prints the reason it is NOT, and returns non-zero.
#
# ⚠️ THE PARENT CHAIN, not just the leaf (review round 1, R1 — the one that mattered). `[ -L "$p" ]` on
# the target itself is NOT enough: make any PARENT directory in the chain a symlink to somewhere outside
# the project, and the leaf is then a real directory inside the link target — so -L on the leaf is FALSE,
# -e is TRUE, and `rm -rf` happily deletes outside the project fkit was pointed at. (Reproduced in
# review, not theorized.) §1 of this file already wrote that lesson
# down for convergence ("-L is the one test that does not lie") — but convergence only CREATES. It never
# got applied to the one operation that DELETES. Walk every component.
#
# Pure string work plus one -L per component: no globbing, no IFS splitting, no normalization. We do NOT
# resolve `..` and then check — we refuse it outright (R3). Normalizing is how you get talked into a
# path you did not mean.
orphan_contained() {  # orphan_contained <relative-line> → 0 = safe, non-zero + reason on stdout
  case "$1" in
    /*) echo "it is an absolute path"; return 1 ;;
  esac
  _rest="$1"
  _cur="$dest"
  while [ -n "$_rest" ]; do
    _seg="${_rest%%/*}"
    case "$_rest" in */*) _rest="${_rest#*/}" ;; *) _rest="" ;; esac
    case "$_seg" in
      ''|.) continue ;;
      ..) echo "it contains '..' and would escape the project"; return 1 ;;
    esac
    _cur="$_cur/$_seg"
    if [ -L "$_cur" ]; then
      echo "'$_seg' is a symlink — fkit will not delete through one"
      return 1
    fi
  done
  return 0
}

cleanup_orphans() {
  # Announcement text, assembled as ready-to-print lines. Deliberately NOT a list iterated with
  # `for p in $removed`: that splits on IFS and GLOBS, which is the bug convergence had to pin IFS and
  # `set -f` to avoid. Nothing to split here means nothing to get wrong here.
  removed=""
  partial=""
  refused=""
  dry=0
  if [ "${FKIT_CLEANUP_DRY_RUN:-0}" = 1 ]; then dry=1; fi

  # Missing OR unreadable. An unreadable list is not "no targets" — it is "we do not know", and the one
  # thing we must not do when we do not know is delete. Fail closed, say why, carry on non-fatally.
  if [ ! -f "$orphan_targets" ] || [ ! -r "$orphan_targets" ]; then
    echo "⚠ fkit's orphan-target list is missing or unreadable ($orphan_targets) — skipping the cleanup" >&2
    return 0
  fi

  # `|| [ -n "$line" ]` so a final line with no trailing newline is still read; \r trimmed for a CRLF
  # checkout. Same shape as the .fkit-keep-out parser above, same reasons.
  while IFS= read -r line || [ -n "$line" ]; do
    line="$(printf '%s' "$line" | tr -d '\r')"
    # Trim surrounding whitespace BEFORE the comment test (C6). Without this, "  # a comment" is a
    # comment to a human and to the test suite's parser, and a TARGET PATH to this one — the two parsers
    # disagreeing about which lines are live, in the file that says what to delete.
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    case "$line" in ''|'#'*) continue ;; esac
    # ⚠️ `./` only. Do NOT strip a leading `/` here (R8): the keep-out parser above does, because for it
    # a leading slash is a harmless way of writing "relative to ai-agents/". Here it is not harmless —
    # stripping it turns `/tmp/cache` into `tmp/cache` and makes orphan_contained's absolute-path
    # refusal UNREACHABLE, so we delete a path inside the project that nobody named. An absolute line is
    # a mistake, and a mistake in this file is a delete: refuse it, do not normalize it into a
    # different, silently-plausible path. Reproduced before fixing — it deleted $dest/tmp/cache and
    # announced it as a clean removal.
    line="${line#./}"
    while :; do case "$line" in */) line="${line%/}" ;; *) break ;; esac; done
    [ -n "$line" ] || continue

    # Containment + the parent chain. Before ANY stat of the target, before the gate, before everything.
    reason=""
    if ! reason="$(orphan_contained "$line")"; then
      refused="$refused    $line — refused: $reason
"
      continue
    fi

    p="$dest/$line"
    exists=0
    if [ -e "$p" ] || [ -L "$p" ]; then exists=1; fi

    # Belt and braces over the ruling. The list is not supposed to be able to name lockdown state; if it
    # ever does, we refuse here rather than find out from a user whose role session stopped locking down.
    # Lower-cased first (C5): the guard must not be defeated by `.Fkit/Settings` on a filesystem that
    # would cheerfully match it to the real thing. Announced only when the path is actually there —
    # otherwise a bad list line nags on every launch of every project forever with nothing at stake.
    lc="$(printf '%s' "$line" | tr '[:upper:]' '[:lower:]')"
    case "$lc" in
      *settings*)
        if [ "$exists" = 1 ]; then
          refused="$refused    $line — refused: fkit will never delete lockdown state
"
        fi
        continue
        ;;
    esac

    # Absent already? The overwhelmingly common case — every project that never used Omnigent, on every
    # launch, forever. Say nothing.
    if [ "$exists" = 0 ]; then continue; fi

    # THE GATE. rc 2 = the check could not be trusted → refuse. Never delete on an unproven check.
    refs=""
    gate_rc=0
    refs="$(orphan_refs "$line")" || gate_rc=$?
    if [ "$gate_rc" -gt 1 ]; then
      refused="$refused    $line — refused: the reference check could not be run, so fkit will not assume it is dead
"
      continue
    fi
    if [ -n "$refs" ]; then
      refused="$refused    $line — refused: still referenced in fkit's own sources
"
      while IFS= read -r r; do
        [ -n "$r" ] && refused="$refused        $r
"
      done <<EOF
$refs
EOF
      continue
    fi

    if [ "$dry" = 1 ]; then
      removed="$removed    $line
"
      continue
    fi

    # What was in there BEFORE we tried? `rm -rf` is not atomic (C2): it unlinks the contents, then the
    # directory. So it can destroy everything inside and STILL exit non-zero because the directory itself
    # would not go. Reporting that as "did NOT remove" — which is what the first version did — tells the
    # user their data is intact at the moment it is gone. Under announce-only that is the consent model
    # lying in the destructive direction. Count first, compare after, and say the true thing.
    #
    # ⛔ ACCEPTED RESIDUAL — THIS DETECTION IS SHALLOW, AND KNOWINGLY SO (R6, owner-ruled 2026-07-17).
    # `ls -A` counts ONE level; `rm -rf` recurses. Lock the target itself at 0500 with a writable subdir
    # and the nested contents are destroyed while this count is unchanged (1 → 1) — so the branch below
    # reports "left as it is" about a subtree that is gone. That is C2's exact failure, one level down,
    # and it is NOT fixed. It is accepted because the destroyed content is always inside a named target
    # (orphan_contained keeps the walk in-project), so the harm is the wrong sentence rather than the
    # user's data. Do not read the "left as it is" branch as a guarantee — it is a best effort at one
    # level. Re-raise: see the ledger. If you fix it, `find "$p" | wc -l` is the honest count, and the
    # test must use the NESTED fixture and be run red first — the last test written here asserted the
    # wrong message was correct and shipped green.
    had=""
    if [ -d "$p" ] && [ ! -L "$p" ]; then
      had="$(ls -A "$p" 2>/dev/null | wc -l | tr -d ' ')" || had=""
    fi

    # Non-fatal, per path — task 26's bar. A cleanup failure must never brick the launcher, and must not
    # cost the user the rest of setup either. Warn, carry on; `set -e` never sees a non-zero.
    if rm -rf "$p" 2>/dev/null; then
      removed="$removed    $line
"
    elif [ ! -e "$p" ] && [ ! -L "$p" ]; then
      # Non-zero, but the path is gone. It was removed; report what IS, not what rc said.
      removed="$removed    $line
"
    else
      now=""
      if [ -d "$p" ] && [ ! -L "$p" ]; then
        now="$(ls -A "$p" 2>/dev/null | wc -l | tr -d ' ')" || now=""
      fi
      if [ -n "$had" ] && [ -n "$now" ] && [ "$now" != "$had" ]; then
        partial="$partial    $line — PARTLY REMOVED: some of its contents are gone; the rest would not delete
"
      else
        refused="$refused    $line — could not remove it, and it was left as it is (check its permissions)
"
      fi
    fi
  done < "$orphan_targets"

  # STDERR, for the same reason convergence announces on stderr — THE OUTPUT TRAP. The launcher calls
  # init with `>/dev/null` on exactly the projects that carry this residue (an already-set-up one), so a
  # stdout announcement is discarded 100% of the time: implemented, invisible, and green in any review
  # that only checked that the code echoes.
  if [ -z "$removed" ] && [ -z "$partial" ] && [ -z "$refused" ]; then return 0; fi
  {
    if [ -n "$removed" ] && [ "$dry" = 1 ]; then
      echo "⚙ fkit WOULD remove these dead Omnigent paths (dry run — nothing was deleted):"
      printf '%s' "$removed"
      echo "  Unset FKIT_CLEANUP_DRY_RUN to let the next launch remove them."
    elif [ -n "$removed" ]; then
      echo "⚙ fkit removed these dead Omnigent paths, left behind by a runtime removed in Sprint 2:"
      printf '%s' "$removed"
      echo "  They were fkit's own, gitignored, and referenced by nothing. Nothing else was touched."
    fi
    # THE MIDDLE STATE, and it is the reason this block has three branches instead of two. Do not fold
    # it back into "did NOT remove": that sentence is a promise the disk no longer keeps.
    if [ -n "$partial" ]; then
      echo "⚠ fkit PARTLY removed these — their contents are gone, the paths themselves are not:"
      printf '%s' "$partial"
      echo "  This is not recoverable from here. They were dead Omnigent state, so nothing live was lost,"
      echo "  but fkit is telling you because it deleted more than it managed to finish."
    fi
    if [ -n "$refused" ]; then
      echo "⚠ fkit did NOT remove these, and will not without a look from you:"
      printf '%s' "$refused"
    fi
  } >&2
  return 0
}

cleanup_orphans

# ---------- summary ----------
printf '\n'
printf '  fkit is ready in %s\n\n' "$dest"
# ⚠️ NO ROLE COUNT ON THIS LINE — deliberate, owner-ruled 2026-07-20 (task 81 Part D).
# It used to read "Seven roles, …" directly above the seven-item list below. ADR-028 adds an eighth
# role (a sandboxed e2e tester) but that role is DECIDED, NOT BUILT — no agent file ships for it. So
# "Eight" would promise a role that does not exist, and "Seven" goes stale the day it does. Naming no
# number is accurate in both worlds, and the list below stays the single source of what actually ships.
# Add the tester to the list when the agent exists; do not reintroduce a count.
# ⚠️ This list is what the installer PRINTS. It is not the acceptance list — `fkit-claude.sh` decides
# which role names a session will accept. The two must be kept in step by hand; neither derives from
# the other, and nothing tests that they agree.
printf '  Role-locked sessions — inside each, only its own skills exist:\n'
printf '    • producer     product & sprint planning, task briefs\n'
printf '    • coder        implementation — the only role that writes source\n'
printf '    • architect    design specs, ADRs, feasibility\n'
printf '    • reviewer     code review (own pass + Codex second opinion)\n'
printf '    • adversarial  hostile pass, findings only\n'
printf '    • wiki         the wiki — ingest / lint / sync\n'
printf '    • lead         the team room — who to ask, and routing\n\n'
printf '  Start:   fkit            (pick a role from the menu)\n'
printf '           fkit coder      (skip the menu)\n'
printf '  Inside a session, @fkit-<role> asks another role and brings the answer back.\n'

# Exit 3 = "setup SUCCEEDED, but I deliberately did not touch ai-agents/". Distinct from 0 (all done)
# and from any other non-zero (setup actually failed). The launcher needs this to know that a missing
# PROJECT.md means "refused", not "fresh" — otherwise it force-starts the producer's cold start into a
# tree it cannot write, on every launch.
#
# It is a STATUS, not a re-derived predicate, and that is the point: the launcher previously re-tested
# the condition itself with `[ -d ] && [ ! -L ]`, which silently disagreed with this script about a
# chmod-000 directory (`-d` is true for one — stat needs +x on the PARENT, not +r on the dir). The
# predicate lived in two files and drifted on its first outing. It now lives here, once.
[ -n "$aa_state" ] && exit 3
exit 0
