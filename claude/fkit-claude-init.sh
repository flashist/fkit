#!/usr/bin/env bash
# One-command setup to use the fkit agent team on a project, Claude Code flavor.
# Idempotent — safe to re-run.
#
# Claude Code discovers agents/skills from a project's .claude/ directory; this script puts the
# fkit team there and scaffolds the shared working structure:
#   1. scaffold the ai-agents/ working structure (from claude/scaffold/ — single source of
#      truth; skipped if it already exists)
#   2. drop project-root CLAUDE.md (Claude-flavored, with the team map) and AGENTS.md (the codex
#      CLI reads it for the adversarial pass) — skipped if they already exist
#   3. refresh .claude/agents/fkit-*.md and .claude/skills/fkit-*/ from claude/ (fkit-managed:
#      removed and re-copied; other files in .claude/ are never touched)
#   4. install the .fkit/interview terminal intake; on a fresh project, run it → .fkit/intake.md
#   5. gitignore the fkit-managed copies
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
elif [ -e "$aa" ]; then
  echo "• ai-agents/ already present — left as-is"
else
  cp -R "$scaffold/ai-agents" "$aa"
  echo "• created ai-agents/ (from scaffold)"
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

# ---------- summary ----------
printf '\n'
printf '  fkit is ready in %s\n\n' "$dest"
printf '  Seven roles, each a locked session (only its own skills exist in it):\n'
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
