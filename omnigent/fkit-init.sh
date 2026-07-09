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

echo
echo "Done. Next:"
echo "  cd \"$dest\""
echo "  omnigent run .fkit/agents/fkit-producer      # start here (interactive)"
echo
echo "When you change an agent in omnigent/fkit-*, re-run this (or vendor-agents.sh) to refresh .fkit/agents/."
