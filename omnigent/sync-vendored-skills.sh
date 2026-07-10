#!/usr/bin/env bash
# Sync the canonical `query` wiki-skill out to the 5 non-wiki bundles that vendor a copy of it.
#
# Why this exists (ADR-005, ADR-006, ADR-007): every fkit agent except fkit-wiki needs a local,
# self-sufficient copy of the `query` skill so it can read the wiki in-process without spawning
# fkit-wiki (ADR-005). ADR-006 tried distributing it as symlinks to avoid hand-copying 6 files in
# sync, but that made every canonical-tree directory->symlink swap untrackable by git ("pathspec ...
# is beyond a symbolic link"). ADR-007 reverted to plain regular-file copies, kept in sync by this
# script instead of by hand — run it whenever omnigent/fkit-wiki/skills/query/SKILL.md changes.
#
# omnigent/validate-bundles.sh's drift-check will fail loudly if this script is skipped after an
# edit to the canonical file — run that before committing to be sure everything is in sync.
#
# Usage:  omnigent/sync-vendored-skills.sh
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"             # .../omnigent
src="$here/fkit-wiki/skills/query/SKILL.md"
[ -f "$src" ] || { echo "error: canonical source not found: $src" >&2; exit 1; }

targets="fkit-producer fkit-coder fkit-reviewer fkit-architect fkit-adversarial-reviewer"
for b in $targets; do
  dest_dir="$here/$b/skills/query"
  mkdir -p "$dest_dir"
  cp "$src" "$dest_dir/SKILL.md"
  echo "synced -> $b/skills/query/SKILL.md"
done

echo
echo "Done. Run omnigent/validate-bundles.sh to confirm no drift remains."
