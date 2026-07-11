#!/bin/sh
# fkit installer — makes `fkit` a global terminal command. Run:
#
#   curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh
#
# It installs fkit's resources (the agents, skills, scaffold, and launcher) to ~/.local/share/fkit and
# a `fkit` launcher to ~/.local/bin. After that, run `fkit` inside ANY project directory: it sets the
# project up if needed and opens the team menu. Idempotent — re-run to update.
#
# You only need this one-liner ONCE. After that `fkit` keeps itself current: `fkit update` reinstalls
# now (re-running this script), and a normal `fkit` does a throttled check and tells you when a newer
# version is published. It never updates itself behind your back.
#
# fkit runs on Claude Code (required) + Codex (for the reviewer's independent second opinion).
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
# Sanity-gate the fetch on the one thing this installer cannot work without: the launcher it execs.
if [ ! -f "$TMP/src/claude/fkit-claude.sh" ]; then
  echo "error: fetched $REPO@$REF but it has no claude/fkit-claude.sh — wrong ref, or not pushed yet." >&2
  exit 1
fi

# 1. install the resources (agents, skills, scaffold, launcher, init) into the share dir
echo "Installing fkit resources → $SHARE/claude"
mkdir -p "$SHARE"
rm -rf "$SHARE/claude"
cp -R "$TMP/src/claude" "$SHARE/claude"
for s in fkit-claude.sh fkit-claude-init.sh; do
  [ -f "$SHARE/claude/$s" ] && chmod +x "$SHARE/claude/$s"
done
# Remove the retired Omnigent flavor from any pre-existing install (ADR-009). This is what makes an
# upgrade from an older fkit clean rather than leaving a dead runtime behind on disk.
rm -rf "$SHARE/omnigent"

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

# 2. install the global `fkit` launcher (a thin wrapper that execs the installed launcher)
#    One runtime, so this is a direct exec — no flavor dispatch. `update` is NOT intercepted here:
#    it falls through to fkit-claude.sh, which owns self-update (ADR-009 §3).
mkdir -p "$BIN"
cat > "$BIN/fkit" <<EOF
#!/bin/sh
# fkit — run the fkit agent team in the current project. Resources: $SHARE
#
# 'fkit' shows the role menu; 'fkit <role>' goes straight there; 'fkit update' updates fkit itself.
#
# Retired subcommands (they died with the Omnigent runtime — ADR-009). Fail loudly rather than
# silently passing them through to claude as a stray argument, which is a confusing no-op.
case "\${1:-}" in
  omnigent|claude)
    echo "fkit: '\$1' is gone — fkit now has a single runtime (Claude Code + Codex)." >&2
    echo "      Just run:  fkit           …or:  fkit <role>" >&2
    exit 1 ;;
  reconnect|restart-team)
    echo "fkit: '\$1' is gone — it only ever worked around Omnigent orchestration failures." >&2
    echo "      A role session is just:  fkit <role>" >&2
    exit 1 ;;
esac
[ -x "$SHARE/claude/fkit-claude.sh" ] || {
  echo "fkit: install looks broken — $SHARE/claude/fkit-claude.sh is missing." >&2
  echo "      Reinstall:  curl -fsSL https://raw.githubusercontent.com/$REPO/$REF/install.sh | sh" >&2
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
    echo "(From now on: 'fkit update' whenever you want; fkit tells you when a new version is out.)"
    ;;
  *)
    echo "⚠ $BIN is not on your PATH. Add it (then restart your shell):"
    echo "    echo 'export PATH=\"$BIN:\$PATH\"' >> ~/.zshrc"
    echo "Then, in any project:  fkit"
    ;;
esac

# 4. Prerequisites. Claude Code is the runtime; Codex is what makes the reviewer's second opinion an
#    actually-independent one. Both are checked again (and more precisely) at every `fkit` launch —
#    this is the first-run heads-up, so a new user isn't surprised later. Neither blocks the install.
if ! command -v claude >/dev/null 2>&1; then
  echo
  echo "⚠ Required: Claude Code — install from https://claude.com/claude-code"
fi
if ! command -v codex >/dev/null 2>&1; then
  echo
  echo "⚠ Required: Codex — it gives the reviewer an independent second opinion from a different"
  echo "  model. Without it, reviews run on one model and are flagged NOT model-diverse."
  echo "    npm install -g @openai/codex   &&   codex login"
fi
