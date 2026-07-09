#!/bin/sh
# fkit quick setup. Run this INSIDE your project directory:
#
#   curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh
#
# It sets up the fkit agent team in the current directory: scaffolds ai-agents/,
# drops CLAUDE.md / AGENTS.md, vendors the six agent bundles into .fkit/agents/, and
# gitignores them. Idempotent — safe to re-run to update. It does NOT install Omnigent:
# install that separately (https://omnigent.ai) and run `omnigent setup` once.
#
# Overrides: FKIT_REPO (default flashist/fkit), FKIT_REF (default main).
set -eu

REPO="${FKIT_REPO:-flashist/fkit}"
REF="${FKIT_REF:-main}"
PROJECT="$(pwd)"

for bin in curl tar bash; do
  command -v "$bin" >/dev/null 2>&1 || { echo "error: '$bin' is required but not found on PATH" >&2; exit 1; }
done

if ! command -v omnigent >/dev/null 2>&1; then
  echo "note: 'omnigent' is not on your PATH — install it (https://omnigent.ai) and run"
  echo "      'omnigent setup' before running the agents. Continuing with project setup."
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Fetching fkit ($REPO@$REF)…"
mkdir -p "$TMP/src"
curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$REF" | tar -xz -C "$TMP/src" --strip-components=1

if [ ! -f "$TMP/src/omnigent/fkit-init.sh" ]; then
  echo "error: fetched $REPO@$REF but it has no omnigent/fkit-init.sh — wrong ref, or not pushed yet." >&2
  exit 1
fi

echo "Setting up fkit in: $PROJECT"
bash "$TMP/src/omnigent/fkit-init.sh" "$PROJECT"
