#!/bin/sh
# fkit installer — makes `fkit` a global terminal command (like `omnigent`). Run:
#
#   curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh
#
# It installs fkit's resources (the six agent bundles + scaffold) to ~/.local/share/fkit and a `fkit`
# launcher to ~/.local/bin. After that, run `fkit` inside ANY project directory: it sets the project
# up if needed and summons the agent team. Idempotent — re-run to update.
#
# It does NOT install Omnigent — install that separately (https://omnigent.ai) and run `omnigent setup`.
# Overrides: FKIT_REPO (default flashist/fkit), FKIT_REF (default main), FKIT_SHARE, FKIT_BIN.
set -eu

REPO="${FKIT_REPO:-flashist/fkit}"
REF="${FKIT_REF:-main}"
SHARE="${FKIT_SHARE:-$HOME/.local/share/fkit}"
BIN="${FKIT_BIN:-$HOME/.local/bin}"

for b in curl tar; do
  command -v "$b" >/dev/null 2>&1 || { echo "error: '$b' is required but not found on PATH" >&2; exit 1; }
done

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Fetching fkit ($REPO@$REF)…"
mkdir -p "$TMP/src"
curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$REF" | tar -xz -C "$TMP/src" --strip-components=1
if [ ! -f "$TMP/src/omnigent/fkit.sh" ]; then
  echo "error: fetched $REPO@$REF but it has no omnigent/fkit.sh — wrong ref, or not pushed yet." >&2
  exit 1
fi

# 1. install the resources (agent bundles + scaffold + scripts) into the share dir
echo "Installing fkit resources → $SHARE/omnigent"
mkdir -p "$SHARE"
rm -rf "$SHARE/omnigent"
cp -R "$TMP/src/omnigent" "$SHARE/omnigent"
for s in fkit.sh fkit-init.sh vendor-agents.sh validate-bundles.sh; do
  [ -f "$SHARE/omnigent/$s" ] && chmod +x "$SHARE/omnigent/$s"
done

# 2. install the global `fkit` launcher (a thin wrapper that execs the installed fkit.sh)
mkdir -p "$BIN"
cat > "$BIN/fkit" <<EOF
#!/bin/sh
# fkit — run the fkit agent team in the current project. Resources: $SHARE/omnigent
exec "$SHARE/omnigent/fkit.sh" "\$@"
EOF
chmod +x "$BIN/fkit"
echo "✓ Installed  $BIN/fkit"

# 3. PATH check + next steps
echo
case ":$PATH:" in
  *":$BIN:"*)
    echo "Next — cd into any project and run:  fkit"
    ;;
  *)
    echo "⚠ $BIN is not on your PATH. Add it (then restart your shell):"
    echo "    echo 'export PATH=\"$BIN:\$PATH\"' >> ~/.zshrc"
    echo "Then, in any project:  fkit"
    ;;
esac
if ! command -v omnigent >/dev/null 2>&1; then
  echo
  echo "Also required: Omnigent — install from https://omnigent.ai and run 'omnigent setup' once."
fi
