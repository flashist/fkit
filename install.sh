#!/bin/sh
# Releases are immutable so a running profile refresh always sees one complete payload.
set -eu
umask 077
repo=${FKIT_REPO:-flashist/fkit}
ref=${FKIT_REF:-fkit-hermes}
share=${FKIT_SHARE:-"$HOME/.local/share/fkit"}
bin=${FKIT_BIN:-"$HOME/.local/bin"}
mkdir -p "$share/releases" "$bin"
share=$(cd "$share" && pwd)
bin=$(cd "$bin" && pwd)
release=$(mktemp -d "$share/releases/hermes-XXXXXXXX")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
if [ -z "${FKIT_SOURCE:-}" ] && [ -f "$0" ] && [ ! -f "$(dirname "$0")/.install.json" ] && [ -f "$(dirname "$0")/hermes/setup.py" ]; then
  FKIT_SOURCE=$(cd "$(dirname "$0")" && pwd)
fi
if [ -n "${FKIT_SOURCE:-}" ]; then
  src=$(cd "$FKIT_SOURCE" && pwd)
else
  curl -fsSL "https://codeload.github.com/$repo/tar.gz/$ref" -o "$tmp/src.tar.gz"
  mkdir "$tmp/src"
  tar -xzf "$tmp/src.tar.gz" -C "$tmp/src" --strip-components=1
  src="$tmp/src"
fi
test -f "$src/bin/fkit" || { echo 'Selected source is missing the Hermes launcher.' >&2; exit 1; }
cp -R "$src/hermes" "$src/vendor" "$src/VERSION" "$src/install.sh" "$release/"
mkdir -p "$release/bin" "$release/claude/skills/fkit-status" "$release/claude/skills/fkit-heal"
cp "$src/bin/fkit" "$src/bin/fkit-board.mjs" "$src/bin/board-narrow.mjs" "$release/bin/"
cp -R "$src/claude/scaffold" "$src/claude/structure-spec.md" "$src/claude/structure-manifest.tsv" \
  "$src/claude/fkit-claude-init.sh" "$src/claude/carry-check-hook.mjs" "$release/claude/"
cp "$src/claude/skills/fkit-status/dashboard.sh" "$src/claude/skills/fkit-status/throughput.mjs" "$release/claude/skills/fkit-status/"
cp "$src/claude/skills/fkit-heal/check.sh" "$src/claude/skills/fkit-heal/repair.sh" "$release/claude/skills/fkit-heal/"
python3 - "$release" "$bin" "$share" "$repo" "$ref" "${FKIT_SOURCE:+$src}" <<'PY'
import json, os, sys, tempfile
from pathlib import Path
release, binary, share, repo, ref, source = sys.argv[1:]
values = dict(FKIT_BIN=binary, FKIT_SHARE=share, FKIT_REPO=repo, FKIT_REF=ref, FKIT_SOURCE=source)
Path(release, ".install.json").write_text(json.dumps(values))
with tempfile.TemporaryDirectory(dir=binary) as tmp:
    link = Path(tmp, "fkit")
    link.symlink_to(Path(release, "bin", "fkit"))
    os.replace(link, Path(binary, "fkit"))
PY
echo "Installed $bin/fkit. Run fkit setup, then fkit in your project."
