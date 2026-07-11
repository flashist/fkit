#!/bin/sh
# fkit installer — makes `fkit` a global terminal command (like `omnigent`). Run:
#
#   curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh
#
# It installs fkit's resources (the six agent bundles + scaffold) to ~/.local/share/fkit and a `fkit`
# launcher to ~/.local/bin. After that, run `fkit` inside ANY project directory: it sets the project
# up if needed and summons the agent team. Idempotent — re-run to update.
#
# You only need this one-liner ONCE. After that `fkit` self-updates: `fkit update` reinstalls now, and
# a normal `fkit` auto-updates when a newer commit is published (this installer is what it re-runs).
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
for s in fkit.sh fkit-init.sh fkit-reconnect.sh vendor-agents.sh validate-bundles.sh sync-vendored-skills.sh; do
  [ -f "$SHARE/omnigent/$s" ] && chmod +x "$SHARE/omnigent/$s"
done

# 1a. the Claude Code flavor (agents + skills + its init/launcher) — see claude/README.md.
#     The rm -rf sits OUTSIDE the guard so installing a ref without claude/ removes a stale flavor
#     instead of leaving it behind.
rm -rf "$SHARE/claude"
if [ -d "$TMP/src/claude" ]; then
  echo "Installing fkit resources → $SHARE/claude"
  cp -R "$TMP/src/claude" "$SHARE/claude"
  for s in fkit-claude.sh fkit-claude-init.sh; do
    [ -f "$SHARE/claude/$s" ] && chmod +x "$SHARE/claude/$s"
  done
fi

# 1b. record the installed version so `fkit` can show it at startup and tell when a newer one is
#     published (self-update compares this sha against $REPO@$REF's head). Prefer git; fall back to the
#     GitHub API via curl. The human-readable version is the repo-root VERSION file (single source of
#     truth, kept in sync with package.json by bin/release.mjs).
resolve_sha() {
  if command -v git >/dev/null 2>&1; then
    git ls-remote "https://github.com/$REPO.git" "$REF" 2>/dev/null | awk 'NR==1{print $1}'
  else
    curl -fsSL "https://api.github.com/repos/$REPO/commits/$REF" 2>/dev/null \
      | sed -n 's/.*"sha"[[:space:]]*:[[:space:]]*"\([0-9a-f]\{7,40\}\)".*/\1/p' | head -1
  fi
}
sha="$(resolve_sha || true)"
ver="$(head -1 "$TMP/src/VERSION" 2>/dev/null | tr -d '[:space:]')"
{
  printf 'version=%s\n' "${ver:-unknown}"
  printf 'sha=%s\n' "${sha:-unknown}"
  printf 'repo=%s\n' "$REPO"
  printf 'ref=%s\n' "$REF"
} > "$SHARE/.version"
rm -f "$SHARE/.update-check" "$SHARE/.latest" 2>/dev/null || true   # fresh throttle + clear stale "newer" cache
echo "✓ Installed fkit v${ver:-?} ($(printf %s "${sha:-unknown}" | cut -c1-7))"

# 2. install the global `fkit` launcher (a thin wrapper that execs the installed fkit.sh)
mkdir -p "$BIN"
cat > "$BIN/fkit" <<EOF
#!/bin/sh
# fkit — run the fkit agent team in the current project. Resources: $SHARE
#
# Default flavor is Claude Code: 'fkit' shows a role menu, 'fkit <role>' goes straight there.
# The original Omnigent flavor lives at 'fkit omnigent'. Self-update stays on the omnigent script,
# which owns it: 'fkit update'.
case "\${1:-}" in
  omnigent)
    shift; exec "$SHARE/omnigent/fkit.sh" "\$@" ;;
  update|upgrade|reconnect|restart-team)
    exec "$SHARE/omnigent/fkit.sh" "\$@" ;;
  claude)
    shift ;;                      # legacy alias — 'fkit claude [role]' still works
esac
[ -x "$SHARE/claude/fkit-claude.sh" ] || {
  echo "fkit: the Claude Code flavor is not installed (this fkit came from a ref without claude/)." >&2
  echo "      Update it:  fkit update        …or use the Omnigent flavor:  fkit omnigent" >&2
  exit 1
}
exec "$SHARE/claude/fkit-claude.sh" "\$@"
EOF
chmod +x "$BIN/fkit"
echo "✓ Installed  $BIN/fkit"

# 3. PATH check + next steps
echo
case ":$PATH:" in
  *":$BIN:"*)
    echo "Next — cd into any project and run:  fkit"
    echo "(From now on fkit self-updates: 'fkit update' anytime, or it auto-updates on launch.)"
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
