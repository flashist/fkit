#!/usr/bin/env bash
# One-command, idempotent fkit setup for a project; the numbered sections below are its steps.
# Usage:  claude/fkit-claude-init.sh <project-root>    # e.g. `claude/fkit-claude-init.sh .`
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"                  # .../claude
scaffold="$here/scaffold"                              # the scaffold (repo checkout AND install share)
dest_in="${1:?usage: fkit-claude-init.sh <project-root>}"
[ -d "$dest_in" ] || { echo "error: not a directory: $dest_in" >&2; exit 1; }
dest="$(cd "$dest_in" && pwd)"                         # absolute
[ -d "$scaffold/ai-agents" ] || { echo "error: shared scaffold not found at $scaffold" >&2; exit 1; }

# Convergence (ADR-015): NEVER writes to a path that already exists; create-if-absent only in ai-agents/.
# Never make it overwrite "stale" files: that safety IS its limit. Drift repair is /fkit-heal's (ADR-039).

# An if, not [ … ] && set +f: under set -e a failing trailing test kills init.
converge_restore() {
  IFS="$oldifs"
  if [ "$oldglob" = 0 ]; then set +f; fi
}

converge_ai_agents() {
  created=""        # scaffold-relative paths this pass created — the announcement, and the .gitkeep rule
  created_dirs=""   # dirs THIS pass created; the .gitkeep rule keys off exactly this set
  skipped=""        # subtrees we refused to descend into (symlink / wrong type / failed write)

  # keep_out is user input: pin IFS to newline and set -f, so a path with a space never splits and wiki-* is
  # never globbed against the cwd (0023 review R3). Restored at every return.
  oldifs="$IFS"; IFS='
'
  case "$-" in *f*) oldglob=1 ;; *) oldglob=0 ;; esac    # restore only if WE turned it off
  set -f

  # .fkit-keep-out: a deliberate deletion stays deleted. TRACKED in ai-agents/, never the gitignored .fkit/,
  # so a teammate's clone honours it.
  keep_out=""
  ko="$aa/.fkit-keep-out"
  # An opt-out we cannot read fails CLOSED: skip convergence and say why, never guess (0023 review R1).
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

  # LC_ALL=C sort order: a parent always precedes its children, so created_dirs is known in one pass.

  # ⚠️ Fed by heredoc, never find | while: a piped loop runs in a subshell and would announce NOTHING.
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

    # An entry covers the path and everything under it.
    kept=0
    for k in $keep_out; do
      case "$rel" in "$k"|"$k"/*) kept=1; break ;; esac
    done
    [ "$kept" = 1 ] && continue

    # [ -L ] FIRST, ALWAYS: -e/-d dereference, so a symlinked subdir or a dangling link would be written
    # through. -L is the one test that does not lie.
    if [ -L "$dst" ]; then
      skipped="$skipped$rel
"
      echo "⚠ ai-agents/$rel is a symlink — fkit will not write through it" >&2
      continue
    fi

    if [ -e "$dst" ]; then
      # THE INVARIANT: the path exists, do nothing.
      # A scaffold dir over a user FILE is refused, never written into.
      if [ -d "$src" ] && [ ! -d "$dst" ]; then
        skipped="$skipped$rel
"
        echo "⚠ ai-agents/$rel is not a directory — fkit will not converge below it" >&2
      elif [ -d "$dst" ] && { [ ! -r "$dst" ] || [ ! -x "$dst" ]; }; then
        # A dir we cannot read into makes every child look absent: refuse it once (0023 review R4).
        skipped="$skipped$rel
"
        echo "⚠ ai-agents/$rel cannot be read into — fkit will not converge below it (check its permissions)" >&2
      fi
      continue
    fi

    if [ -d "$src" ]; then
      # Non-fatal per write: convergence must never cost the user the rest of setup.
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

    # THE .gitkeep RULE: create one only in a directory THIS pass created; a resurrected .gitkeep in a
    # directory with content would dirty git status on every launch.
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

  # ⚠️ THE OUTPUT TRAP: announce on STDERR — the launcher sends init's stdout to /dev/null on exactly the
  # set-up projects convergence runs on. Say nothing when nothing was created.
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

# Containment: refuse an absolute path, any '..', and a symlink at ANY component, not just the leaf; never
# normalize, then check (0072 review R1, R3; 0046 extended it to writes).
path_contained() {  # path_contained <project-relative-path> <verb> → 0 = safe, non-zero + reason on stdout
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
      echo "'$_seg' is a symlink — fkit will not $2 through one"
      return 1
    fi
  done
  return 0
}

# 1. ai-agents/ working structure, never clobbered; a refusal skips only this step, on STDERR (OUTPUT TRAP).
# PREFLIGHT FIRST, -e/-d dereference: `[ -L ]` is the one test that does not lie, so it has to come first.
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

# 2. CLAUDE.md and AGENTS.md (Claude reads one, Codex the other): created when absent; otherwise fkit
# rewrites only its marker-delimited rules block, never the owner's text outside it (ADR-016).
RULES_BEGIN='<!-- fkit:begin-rules -->'
RULES_END='<!-- fkit:end-rules -->'
# The cap forces an eviction conversation (0130, owner ruling; attention dilution is suspected, unmeasured).
# Raising it needs an owner-signed bump (ADR-016; 0190 set 4352); keep >= 400 B free (0130).

# Measured on specific builds (0130, 0177): Claude Code strips the wrapper's HTML comments, codex does not;
# re-measure when either moves.
RULES_MAX=4352

RULES_TAG='fkit-managed:'   # appears in the block header; how we recognize a region we wrote

rules_src="$scaffold/universal-rules.md"
[ -f "$rules_src" ] || { echo "error: missing $rules_src" >&2; exit 1; }

emit_block() {   # the fkit-managed block, markers included
  printf '%s\n' "$RULES_BEGIN"
  printf '<!-- %s this block is REPLACED on every `fkit` launch. Edits inside the markers\n' "$RULES_TAG"
  printf '     are overwritten. Put your own standing instructions OUTSIDE them — everything outside\n'
  printf '     is yours and fkit never touches it. A marker is recognized only alone on its line, so a\n'
  printf '     bare marker line inside a code fence still reads as a real marker. -->\n\n'
  cat "$rules_src"
  printf '%s\n' "$RULES_END"
}

# Cap the EMITTED block, not the source: the block is what every agent pays for.
block_size="$(emit_block | wc -c | tr -d ' ')"
if [ "$block_size" -gt "$RULES_MAX" ]; then
  echo "error: the fkit rules block is ${block_size}B, over the ${RULES_MAX}B cap." >&2
  echo "       It is injected into every agent's context on every turn. Trim $rules_src." >&2
  exit 1
fi

# Whole-line match, never a substring: a marker quoted in prose must stay inert (it once deleted owner text).
# \r is trimmed too, or a CRLF file never matches its own markers and gains a new block every launch.
marker_lines() {   # <file> <marker> → matching line numbers, one per line
  awk -v m="$2" '{ l = $0; gsub(/^[ \t\r]+|[ \t\r]+$/, "", l); if (l == m) print NR }' "$1"
}

merge_rules() {   # merge_rules <path> <name> — idempotent, in-place, refuses rather than guesses
  f="$1"; name="$2"
  # [ -L ] FIRST: -e/-f dereference, so a symlink would be written through.
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

  # set -- rather than | head -1: under pipefail an early-exiting head SIGPIPEs the producer, and set -e
  # kills init on the path whose job is to refuse gracefully.
  # shellcheck disable=SC2086
  set -- $(marker_lines "$f" "$RULES_BEGIN"); nb=$#; lb="${1:-0}"
  # shellcheck disable=SC2086
  set -- $(marker_lines "$f" "$RULES_END");   ne=$#; le="${1:-0}"

  tmp="$f.fkit-tmp.$$"
  # Clean the temp file on any exit: a set -e abort must not strand it in the owner's project.
  trap 'rm -f "$tmp"' EXIT
  if [ "$nb" = 0 ] && [ "$ne" = 0 ]; then
    # No block yet: append once at EOF, adding the separating newline ourselves.
    { cat "$f"; [ -n "$(tail -c 1 "$f")" ] && printf '\n'; printf '\n'; emit_block; } > "$tmp"
  elif [ "$nb" = 1 ] && [ "$ne" = 1 ] && [ "$lb" -lt "$le" ]; then
    # One well-formed pair: replace the region IN PLACE. Content we did not tag got there another way
    # (a marker in a code fence): proceed, but warn on stderr.

    # Guard the range: for an adjacent pair, sed -n '5,4p' prints the START line, so fkit's own bare pair
    # looked foreign and every new project warned.
    if [ "$le" -gt "$((lb + 1))" ]; then
      region="$(sed -n "$((lb + 1)),$((le - 1))p" "$f")"
      # case, not printf | grep -q: grep exits on its first match, and EPIPE under pipefail inverts the test.
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

  # Unchanged: say NOTHING. A per-launch "rewrote CLAUDE.md" trains people to ignore init's output.
  if cmp -s "$tmp" "$f"; then
    rm -f "$tmp"; trap - EXIT
    return 0
  fi
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

# 3. refresh the fkit-managed agents + skills (rm + cp of the two fkit-* patterns only). A same-type squatter
# is deleted and NOT put back; some wrong-type ones abort init today (shapes: open 0336).

# [ -L ] FIRST, ALWAYS, before the mkdir: rm and cp dereference, and a symlinked .claude once lost the user's
# agents and skills AT THE LINK TARGET with exit 0 (0327).

# Refusals are non-fatal, exit status unchanged (0327, ruling Q1a);
# one call per half, so each half survives alone.

# The fkit-* entries get their own walk, with NO trailing slash: fkit-*/ resolves a live link before rm
# runs, and cannot see a dangling one (0327 review R1, R2).

# The whole skills half is refused, not one entry: cp -R copies every payload name in one call.
# The message names the offending entry so the user knows which one to move.
skills_entries_contained() {
  for _e in "$dest/.claude/skills/fkit-"*; do
    [ -L "$_e" ] || continue
    path_contained ".claude/skills/${_e##*/}" refresh
    return 1
  done
  return 0
}

# n_agents/n_skills start EMPTY on purpose — under `set -u` a skipped half would otherwise leave them
# unset, and the summary below must report only the halves that actually ran.
n_agents=""
n_skills=""
if ! agents_reason="$(path_contained ".claude/agents" refresh)"; then
  {
    echo "⚠ skipped the .claude/agents refresh: $agents_reason"
    echo "    $dest/.claude/agents"
    echo "  Nothing was written or deleted and nothing is broken. The rest of setup continues — but"
    echo "  your fkit agents were NOT installed here, so a session started now may find none."
    echo "  Replace the symlinked path with a real directory, then re-run: fkit"
  } >&2
else
  mkdir -p "$dest/.claude/agents"
  rm -f "$dest/.claude/agents/fkit-"*.md
  cp "$here/agents/fkit-"*.md "$dest/.claude/agents/"
  n_agents="$(ls "$here/agents/fkit-"*.md | wc -l | tr -d ' ')"
fi
if ! skills_reason="$(path_contained ".claude/skills" refresh)" ||
   ! skills_reason="$(skills_entries_contained)"; then
  {
    echo "⚠ skipped the .claude/skills refresh: $skills_reason"
    echo "    $dest/.claude/skills"
    echo "  Nothing was written or deleted and nothing is broken. The rest of setup continues — but"
    echo "  your fkit skills were NOT installed here, so a session started now may find none."
    echo "  Replace the symlinked path with a real directory, then re-run: fkit"
  } >&2
else
  mkdir -p "$dest/.claude/skills"
  for d in "$dest/.claude/skills/fkit-"*/; do
    [ -d "$d" ] && rm -rf "$d"
  done
  cp -R "$here/skills/fkit-"* "$dest/.claude/skills/"
  n_skills="$(ls -d "$here/skills/fkit-"*/ | wc -l | tr -d ' ')"
fi
# Announce only the halves that ran; both → the same line this has always printed.
if [ -n "$n_agents" ] && [ -n "$n_skills" ]; then
  echo "• refreshed $n_agents agents → .claude/agents/, $n_skills skills → .claude/skills/"
elif [ -n "$n_agents" ]; then
  echo "• refreshed $n_agents agents → .claude/agents/"
elif [ -n "$n_skills" ]; then
  echo "• refreshed $n_skills skills → .claude/skills/"
fi

# 4. first-run intake: a terminal questionnaire before any LLM starts, written to .fkit/intake.md.
# [ -L ] over the whole chain first: mkdir -p and cat > dereference (0046). Non-fatal; warns on STDERR.
if ! intake_reason="$(path_contained ".fkit/interview" write)"; then
  {
    echo "⚠ skipped the .fkit/interview intake: $intake_reason"
    echo "    $dest/.fkit/interview"
    echo "  Nothing was written and nothing is broken. The rest of setup continues and your session"
    echo "  will start; the LLM will interview you instead."
  } >&2
else
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
fi

# 5. gitignore the fkit-managed copies, never the whole .claude/: the project's own settings stay tracked.
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

# 6. the Omnigent orphan residue. ⚠️ THE ONLY PLACE FKIT DELETES OUTSIDE THE NAMESPACE IT MANAGES (a path
# named in a list); §3 deletes too, unrecoverably for a squatter (0327 review R3; D1 in its refresh test).

# Why: ADR-009 removed the runtime that left them (0072; report 2026-07-14-migration-mechanism §9). Targets
# live in claude/orphan-targets, never in comments here: the gate below counts comments too.

# Not convergence (its invariant forbids deletes). Self-limiting, so stateless. Consent is announce-only
# (0072, owner ruling): every branch must report what happened. Accepted residuals: 0072 review C3, C4.
orphan_targets="$here/orphan-targets"      # THE list. Exhaustive by ruling — see that file's header.

# THE GATE: re-check at run time that no shipped source still names a target; a referenced target is refused.
# Only orphan-targets itself is excluded, which is why the list is its own file.

# ⚠️ Fails CLOSED: grep rc > 1 → return 2 → refuse (0072 review R2). -i for case-insensitive filesystems
# (0072 C5); the boundary stops a short target matching a longer path (C1). Over-matching only refuses.
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

cleanup_orphans() {
  # Ready-to-print lines, never a list iterated with for: that would split on IFS and glob.
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

  # Same parser shape as .fkit-keep-out's (a final line with no newline; CRLF).
  while IFS= read -r line || [ -n "$line" ]; do
    line="$(printf '%s' "$line" | tr -d '\r')"
    # Trim BEFORE the comment test, or "  # x" is a comment to the tests and a TARGET here (0072 C6).
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    case "$line" in ''|'#'*) continue ;; esac
    # ⚠️ Strip ./ only, never a leading /: an absolute line must reach path_contained's refusal, not become a
    # different in-project path to delete (0072 review R8).
    line="${line#./}"
    while :; do case "$line" in */) line="${line%/}" ;; *) break ;; esac; done
    [ -n "$line" ] || continue

    # Containment + the parent chain. Before ANY stat of the target, before the gate, before everything.
    reason=""
    if ! reason="$(path_contained "$line" delete)"; then
      refused="$refused    $line — refused: $reason
"
      continue
    fi

    p="$dest/$line"
    exists=0
    if [ -e "$p" ] || [ -L "$p" ]; then exists=1; fi

    # Never delete lockdown state, even if listed; lower-cased first (0072 C5). Announced only when the path
    # exists, so a bad line does not nag every launch.
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

    # Already absent, as in every project that never used Omnigent: say nothing.
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

    # rm -rf is not atomic: it can empty a directory and still fail, so count before and after and report the
    # true state (0072 C2).

    # ⛔ ACCEPTED RESIDUAL (0072 review R6, owner-ruled): the count is ONE level deep, so a nested delete can
    # read "left as it is". Honest fix: find "$p" | wc -l, tested on a nested fixture run red first.
    had=""
    if [ -d "$p" ] && [ ! -L "$p" ]; then
      had="$(ls -A "$p" 2>/dev/null | wc -l | tr -d ' ')" || had=""
    fi

    # Non-fatal per path (0088's bar).
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

  # STDERR: THE OUTPUT TRAP, as for convergence.
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

printf '\n'
printf '  fkit is ready in %s\n\n' "$dest"
# ⚠️ No role count on this line (0036 Part D, owner ruling): ADR-028's eighth role is decided, not built.
# Add the tester to the list when its agent exists; do not reintroduce a count.

# This printed list mirrors the launcher's accepted role names by hand; nothing tests that they agree.
printf '  Role-locked sessions — inside each, only its own skills exist:\n'
printf '    • lead         the conductor — who to ask, and routing\n'
printf '    • producer     product & sprint planning, task briefs\n'
printf '    • coder        implementation — the only role that writes source\n'
printf '    • architect    design specs, ADRs, feasibility\n'
printf '    • reviewer     code review (own pass + Codex second opinion)\n'
printf '    • adversarial  hostile pass, findings only\n'
printf '    • wiki         the wiki — ingest / lint / sync\n\n'
printf '  Start:   fkit            (pick a role from the menu)\n'
printf '           fkit coder      (skip the menu)\n'
printf '  Inside a session, @fkit-<role> asks another role and brings the answer back.\n'

# Exit 3 = setup SUCCEEDED but ai-agents/ was refused, so the launcher reads a missing PROJECT.md as
# "refused", not "fresh". A STATUS, never a re-derived predicate: the two copies drifted once.
[ -n "$aa_state" ] && exit 3
exit 0
