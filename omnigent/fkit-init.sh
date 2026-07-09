#!/usr/bin/env bash
# One-command setup to use the fkit agent team on a project. Idempotent — safe to re-run.
#
# Omnigent is a runtime, not a project generator: it has no init/scaffold command, so it
# won't create your working structure, context files, or place the shared agent bundles.
# This does the four things a project needs before `omnigent run`:
#   1. scaffold the ai-agents/ working structure (skipped if it already exists)
#   2. drop project-root CLAUDE.md / AGENTS.md (skipped if they already exist)
#   3. vendor the six agent bundles into <project>/.fkit/agents/  (config_path must stay in-cwd)
#   4. add .fkit/ to the project's .gitignore
#
# Usage:  omnigent/fkit-init.sh <project-root>      # e.g. `omnigent/fkit-init.sh .` for fkit-on-fkit
# Then:   cd <project-root> && omnigent run .fkit/agents/fkit-producer
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"                 # .../omnigent
dest_in="${1:?usage: fkit-init.sh <project-root>}"
[ -d "$dest_in" ] || { echo "error: not a directory: $dest_in" >&2; exit 1; }
dest="$(cd "$dest_in" && pwd)"                         # absolute

# 1. ai-agents/ working structure (never clobber an existing one)
if [ -e "$dest/ai-agents" ]; then
  echo "• ai-agents/ already present — left as-is"
else
  cp -R "$here/scaffold/ai-agents" "$dest/ai-agents"
  echo "• created ai-agents/ (from scaffold)"
fi

# 2. shared context files (never clobber)
for f in CLAUDE.md AGENTS.md; do
  if [ -e "$dest/$f" ]; then
    echo "• $f already present — left as-is"
  else
    cp "$here/scaffold/$f" "$dest/$f"
    echo "• created $f  (fill in its placeholders)"
  fi
done

# 3. vendor the agent bundles (idempotent; refreshes the copy)
"$here/vendor-agents.sh" "$dest" >/dev/null
echo "• vendored the 6 agent bundles → .fkit/agents/"

# 4. gitignore the vendored copy (it is a copy of omnigent/fkit-*)
gi="$dest/.gitignore"
if [ -f "$gi" ] && grep -qxF '.fkit/' "$gi"; then
  echo "• .gitignore already ignores .fkit/"
else
  printf '\n# Vendored fkit agent bundles (re-create with omnigent/vendor-agents.sh)\n.fkit/\n' >> "$gi"
  echo "• added .fkit/ to .gitignore"
fi

# 5. convenience launcher + first-run intake (both live in the gitignored .fkit/, so no repo clutter)

# 5a. first-run intake — a quick TERMINAL questionnaire asked before any LLM starts. It writes the
#     owner's answers to .fkit/intake.md, which the producer's initiate-project skill reads, so the
#     basics are captured deterministically (one question at a time, actually waiting on each answer)
#     instead of over chat. tty-safe: reads the controlling terminal so it works under `curl | sh`.
cat > "$dest/.fkit/interview" <<'INTERVIEW'
#!/bin/sh
# fkit first-run intake. Asks a few project questions on the controlling terminal and writes
# .fkit/intake.md. Exits cleanly (no file) when there is no terminal, so the LLM interviews instead.
set -eu
root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/.fkit/intake.md"
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

printf '\nThanks — captured to .fkit/intake.md. Starting the producer...\n' >&4
INTERVIEW
chmod +x "$dest/.fkit/interview"

# 5b. launcher
cat > "$dest/.fkit/run" <<'RUN'
#!/bin/sh
# fkit launcher — start an agent by short name (default: producer).
# Usage:  .fkit/run [producer|coder|reviewer|architect|wiki|adversarial-reviewer]
# On a brand-new project, launching the producer first runs a quick terminal intake, then opens the
# producer already primed with your answers (instead of a blank prompt).
set -eu
root="$(cd "$(dirname "$0")/.." && pwd)"
agent="${1:-producer}"
case "$agent" in adv|adversarial) agent="adversarial-reviewer" ;; esac
if [ ! -d "$root/.fkit/agents/fkit-$agent" ]; then
  echo "unknown agent 'fkit-$agent'. try: producer coder reviewer architect wiki adversarial-reviewer" >&2
  exit 1
fi
cd "$root"

# Build the launch command; default is just to run the requested agent.
set -- run ".fkit/agents/fkit-$agent"

# First run: if the producer is launched before the project has been initiated, capture a quick
# terminal intake (before any LLM), then seed the opening message so the producer uses those answers
# and lands straight in initiation. "Uninitialized" matches the producer prompt's own test:
# PROJECT.md missing, still carrying the fkit:uninitialized marker, or the placeholder title.
proj="ai-agents/knowledge-base/PROJECT.md"
if [ "$agent" = producer ] && { [ ! -f "$proj" ] \
     || grep -q 'fkit:uninitialized' "$proj" 2>/dev/null \
     || grep -qF '# <Project name>' "$proj" 2>/dev/null; }; then
  if [ -x "$root/.fkit/interview" ]; then "$root/.fkit/interview" || true; fi
  if [ -f "$root/.fkit/intake.md" ]; then
    seed="This is a fresh fkit project. The owner just completed the intake questionnaire in .fkit/intake.md — READ THAT FILE FIRST and use it as the product brief. Then run your initiate-project skill: do NOT re-ask what the intake already answers; only follow up on blank (—) or genuinely ambiguous items, then have the fkit-architect survey the codebase and write PROJECT.md plus the architecture doc."
  else
    seed="This is a fresh fkit project — run project initiation now with your initiate-project skill: interview me about the product, have the fkit-architect survey the codebase, then write PROJECT.md and the architecture doc so we're ready to work."
  fi
  set -- run ".fkit/agents/fkit-producer" -p "$seed"
fi

# Open the web UI shortly after the server answers, so there is always a visual view of the session
# (the terminal TUI can render poorly, notably under `curl | sh`). Backgrounded; FKIT_NO_BROWSER=1 skips.
# Started here — after the intake — so its readiness poll doesn't expire while you're still answering.
ui_url="http://127.0.0.1:6767"
if [ "${FKIT_NO_BROWSER:-0}" != 1 ]; then
  (
    n=0
    while [ "$n" -lt 15 ]; do
      if command -v curl >/dev/null 2>&1; then
        if curl -s -o /dev/null "$ui_url"; then break; fi
        n=$((n + 1)); sleep 1
      else
        sleep 3; break
      fi
    done
    if command -v open >/dev/null 2>&1; then open "$ui_url" >/dev/null 2>&1 || true
    elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$ui_url" >/dev/null 2>&1 || true
    fi
  ) &
  echo "fkit — opening the Omnigent web UI at $ui_url (use it if this terminal looks blank; FKIT_NO_BROWSER=1 to skip)"
fi

# Omnigent's REPL watches its stdin with kqueue, which rejects the /dev/tty clone device on macOS.
# If our stdin is not already a real terminal (e.g. we were launched from `curl | sh`, where it's the
# pipe), resolve the controlling terminal's REAL pts and feed omnigent that. `ps -o tty=` yields
# ttysNNN (macOS) or pts/N (Linux) — both real char devices; /dev/tty is not. No controlling
# terminal (ps prints "??") → just run as-is.
if ! [ -t 0 ]; then
  tt="$(ps -o tty= -p $$ 2>/dev/null | tr -d ' ')"
  if [ -n "$tt" ] && [ -c "/dev/$tt" ]; then
    exec omnigent "$@" < "/dev/$tt"
  fi
fi
exec omnigent "$@"
RUN
chmod +x "$dest/.fkit/run"
echo "• created launcher .fkit/run + intake .fkit/interview"

# ---------- summary ----------
printf '\n'
printf '  fkit is ready in %s\n\n' "$dest"
printf '  6 agents (.fkit/agents/):\n'
printf '    • producer    plan sprints, write task briefs, track status\n'
printf '    • coder       implement a task: plan -> code -> test\n'
printf '    • reviewer    review a diff, with an adversarial 2nd opinion\n'
printf '    • architect   design specs, ADRs, evaluate approaches\n'
printf '    • wiki        the project knowledge base (query / ingest / lint / sync)\n\n'

if command -v omnigent >/dev/null 2>&1; then
  omni_ok=1
else
  omni_ok=0
  printf '  ! Omnigent is not installed. Get it at https://omnigent.ai, then run: omnigent setup\n\n'
fi

printf '  Start an agent (from this directory):\n'
printf '    .fkit/run              # producer (default)\n'
printf '    .fkit/run reviewer     # or coder / architect / wiki / adversarial-reviewer\n\n'
# Only relevant when this project holds the canonical source (i.e. the fkit repo itself,
# dogfooding). An end user installing into their own project has no omnigent/ dir — they'd
# re-run the installer to refresh .fkit/agents/, so don't show them a path that isn't there.
if [ -f "$dest/omnigent/vendor-agents.sh" ]; then
  printf '  After editing an agent in omnigent/fkit-*, re-sync:  omnigent/vendor-agents.sh .\n'
fi

# ---------- optional interactive launch (only when a terminal is reachable) ----------
# On "Yes" we simply hand off to .fkit/run, which self-heals its stdin (it resolves the real
# controlling-terminal pts for the `curl | sh` case — Omnigent's REPL can't use the /dev/tty clone
# device). So there's no tty juggling here: read the answer (from stdin, or /dev/tty when piped) and,
# if yes, exec the launcher — the same thing the user would run by hand.
if [ "$omni_ok" = 1 ] && [ -t 1 ] && { [ -t 0 ] || [ -r /dev/tty ]; }; then
  printf '\n  Start the producer now? [Y/n] '
  reply=y
  if [ -t 0 ]; then read reply || reply=n
  else             read reply < /dev/tty || reply=n
  fi
  case "$reply" in
    ''|y|Y|yes|YES)
      printf '\n  launching the producer...\n\n'
      cd "$dest"
      exec "$dest/.fkit/run" producer
      ;;
    *)
      printf '  Ok — start any time with:  .fkit/run\n'
      ;;
  esac
fi
