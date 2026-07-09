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

# 5. convenience launcher (lives in the gitignored .fkit/, so no repo clutter)
cat > "$dest/.fkit/run" <<'RUN'
#!/bin/sh
# fkit launcher — start an agent by short name (default: producer).
# Usage:  .fkit/run [producer|coder|reviewer|architect|wiki|adversarial-reviewer]
set -eu
root="$(cd "$(dirname "$0")/.." && pwd)"
agent="${1:-producer}"
case "$agent" in adv|adversarial) agent="adversarial-reviewer" ;; esac
if [ ! -d "$root/.fkit/agents/fkit-$agent" ]; then
  echo "unknown agent 'fkit-$agent'. try: producer coder reviewer architect wiki adversarial-reviewer" >&2
  exit 1
fi
cd "$root"
exec omnigent run ".fkit/agents/fkit-$agent"
RUN
chmod +x "$dest/.fkit/run"
echo "• created launcher .fkit/run"

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
# Omnigent's REPL watches its stdin with macOS kqueue, which rejects the /dev/tty clone
# device (EINVAL). So: when stdin is already a real terminal, hand it straight through;
# under `curl | sh` (stdin is the pipe) resolve /dev/tty to its underlying pts and feed
# THAT — never /dev/tty itself. If we can't get a real terminal fd, just print how to start.
if [ "$omni_ok" = 1 ] && [ -t 1 ] && { [ -t 0 ] || [ -r /dev/tty ]; }; then
  printf '\n  Start the producer now? [Y/n] '
  reply=y
  if [ -t 0 ]; then read reply || reply=n
  else             read reply < /dev/tty || reply=n
  fi
  case "$reply" in
    ''|y|Y|yes|YES)
      cd "$dest"
      if [ -t 0 ]; then
        printf '\n  launching the producer...\n\n'
        exec "$dest/.fkit/run" producer                     # inherit the real terminal
      else
        real_tty="$(tty < /dev/tty 2>/dev/null || true)"    # pts behind /dev/tty
        if [ -n "$real_tty" ] && [ "$real_tty" != /dev/tty ] && [ -c "$real_tty" ]; then
          printf '\n  launching the producer...\n\n'
          exec "$dest/.fkit/run" producer < "$real_tty"
        else
          printf '\n  Ok — start it with:  .fkit/run\n'
        fi
      fi
      ;;
    *)
      printf '  Ok — start any time with:  .fkit/run\n'
      ;;
  esac
fi
