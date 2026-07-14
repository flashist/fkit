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

# 2. shared context files (never clobber). CLAUDE.md carries the team map + dispatch rules;
#    AGENTS.md is read natively by the codex CLI during the adversarial pass.
if [ -e "$dest/CLAUDE.md" ]; then
  echo "• CLAUDE.md already present — left as-is"
else
  cp "$scaffold/CLAUDE.md" "$dest/CLAUDE.md"
  echo "• created CLAUDE.md  (fill in its placeholders)"
fi
if [ -e "$dest/AGENTS.md" ]; then
  echo "• AGENTS.md already present — left as-is"
else
  cp "$scaffold/AGENTS.md" "$dest/AGENTS.md"
  echo "• created AGENTS.md  (the codex CLI reads it)"
fi

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
