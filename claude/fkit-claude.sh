#!/bin/sh
# fkit claude — set up the current project for the Claude Code flavor of the fkit team (idempotent)
# and launch Claude Code as the team lead. Invoked by the global `fkit` wrapper as `fkit claude`.
#
# Env: FKIT_SETUP_ONLY=1 — set up but don't launch claude.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"                  # .../claude
proj="$PWD"

"$here/fkit-claude-init.sh" "$proj"

[ "${FKIT_SETUP_ONLY:-0}" = 1 ] && exit 0

command -v claude >/dev/null 2>&1 || {
  echo >&2
  echo "⚠ Claude Code ('claude') is not installed / not on PATH." >&2
  echo "  Install it from https://claude.com/claude-code, then run:  claude" >&2
  exit 127
}

# Fresh project → run the terminal intake (tty-safe; skips itself when headless), then launch
# claude seeded straight into initiation. "Uninitialized" matches the same three-way test the
# omnigent launcher and /fkit-initiate-project use.
pm="$proj/ai-agents/knowledge-base/PROJECT.md"
if [ ! -f "$pm" ] \
   || grep -q 'fkit:uninitialized' "$pm" 2>/dev/null \
   || grep -qF '# <Project name>' "$pm" 2>/dev/null; then
  if [ -x "$proj/.fkit/interview" ]; then "$proj/.fkit/interview" || true; fi
  if [ -f "$proj/.fkit/intake.md" ]; then
    seed="This is a fresh fkit project. The owner just completed the intake questionnaire in .fkit/intake.md — READ THAT FILE FIRST and use it as the product brief. Then run /fkit-initiate-project: do NOT re-ask what the intake already answers; only follow up on blank (—) or genuinely ambiguous items."
  else
    seed="This is a fresh fkit project — run /fkit-initiate-project now: interview me about the product, have the fkit-architect agent survey the codebase, then write PROJECT.md and the architecture doc so we're ready to work."
  fi
  exec claude "$@" "$seed"
fi

exec claude "$@"
