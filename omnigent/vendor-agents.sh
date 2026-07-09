#!/usr/bin/env bash
# Vendor the fkit agent bundles into a project so Omnigent can spawn them.
#
# Why this exists: Omnigent's sys_session_create refuses a config_path that escapes the
# caller's working directory, so the shared agent bundles the agents spawn each other from
# MUST live under the target project's root. This copies the canonical bundles
# (omnigent/fkit-*) into <project>/.fkit/agents/, where every agent's prompt expects them
# (config_path ".fkit/agents/fkit-<name>").
#
# This is separate from the project scaffold (omnigent/scaffold/ai-agents/ + CLAUDE.md/AGENTS.md).
# A project generally needs BOTH: the scaffold for its ai-agents/ working structure, and these
# vendored agents for the team to run.
#
# Usage:  omnigent/vendor-agents.sh <project-root>
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"          # .../omnigent
dest="${1:?usage: vendor-agents.sh <project-root>}"
[ -d "$dest" ] || { echo "error: not a directory: $dest" >&2; exit 1; }

mkdir -p "$dest/.fkit/agents"
# Copy only the agent bundle DIRECTORIES (fkit-*/) — not sibling files like fkit-init.sh.
for d in "$here"/fkit-*; do
  [ -d "$d" ] || continue
  rm -rf "$dest/.fkit/agents/$(basename "$d")"
  cp -R "$d" "$dest/.fkit/agents/"
done

echo "Vendored fkit agents into $dest/.fkit/agents/:"
ls -1 "$dest/.fkit/agents/"
echo
echo "Run an agent from the project root, e.g.:"
echo "  cd \"$dest\" && omnigent run .fkit/agents/fkit-producer"
echo
echo "Add '.fkit/' to the project's .gitignore unless you want the vendored copy tracked."
