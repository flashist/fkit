#!/bin/sh
# fkit installer — makes `fkit` a global terminal command. Run:
#
#   curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | sh
#
# It installs fkit's resources (the agents, skills, scaffold, and launcher) to ~/.local/share/fkit and
# a `fkit` launcher to ~/.local/bin. After that, run `fkit` inside ANY project directory: it sets the
# project up if needed and opens the team menu. Idempotent — re-run to update.
#
# You only need this one-liner ONCE. After that `fkit` keeps itself current: `fkit update` re-runs this
# script with the source and paths recorded in .version, and a normal `fkit` does a throttled check and
# tells you when a newer version is published. It never updates itself behind your back.
#
# Unconfigured projects retain Claude; configured projects select Claude or Codex.
# Overrides: FKIT_REPO (default flashist/fkit), FKIT_REF (default main), FKIT_SHARE, FKIT_BIN.
set -eu

REPO="${FKIT_REPO:-flashist/fkit}"
REF="${FKIT_REF:-main}"
SHARE="${FKIT_SHARE:-$HOME/.local/share/fkit}"
BIN="${FKIT_BIN:-$HOME/.local/bin}"
case "$SHARE$BIN$REPO$REF" in *'
'*) echo 'error: install paths and source names must not contain newlines' >&2; exit 1 ;; esac

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
if [ -f "$TMP/src/codex/fkit.mjs" ]; then
  [ -f "$TMP/src/bin/fkit" ] || { echo 'error: fetched runtime package is incomplete' >&2; exit 1; }
  for module in fkit settings materialize models server consult owner-question hook diagnostics claude; do
    [ -f "$TMP/src/codex/$module.mjs" ] || { echo "error: fetched runtime package is incomplete: $module" >&2; exit 1; }
  done
  if { [ -e "$SHARE/codex" ] || [ -L "$SHARE/codex" ]; } && [ ! -f "$SHARE/codex/.fkit-runtime" ]; then
    echo "error: refusing to replace unowned runtime directory: $SHARE/codex" >&2; exit 1
  fi
  if { [ -e "$SHARE/bin/fkit" ] || [ -L "$SHARE/bin/fkit" ]; } && [ "$(sed -n '2p' "$SHARE/bin/fkit")" != '# fkit-runtime-dispatch' ]; then
    echo "error: refusing to replace unowned dispatcher: $SHARE/bin/fkit" >&2; exit 1
  fi
fi

# 1. install the resources (agents, skills, scaffold, launcher, init) into the share dir
echo "Installing fkit resources → $SHARE/claude"
mkdir -p "$SHARE"
SHARE="$(CDPATH= cd -- "$SHARE" && pwd)"
rm -rf "$SHARE/claude"
cp -R "$TMP/src/claude" "$SHARE/claude"
for s in fkit-claude.sh fkit-claude-init.sh; do
  [ -f "$SHARE/claude/$s" ] && chmod +x "$SHARE/claude/$s"
done
if [ -f "$SHARE/codex/.fkit-runtime" ]; then rm -rf "$SHARE/codex"; fi
if [ -f "$SHARE/bin/fkit" ] && [ "$(sed -n '2p' "$SHARE/bin/fkit")" = '# fkit-runtime-dispatch' ]; then rm -f "$SHARE/bin/fkit"; fi
if [ -f "$TMP/src/codex/fkit.mjs" ]; then
  cp -R "$TMP/src/codex" "$SHARE/codex"
  printf '%s\n' 'fkit managed runtime resources' > "$SHARE/codex/.fkit-runtime"
  mkdir -p "$SHARE/bin"
  cp "$TMP/src/bin/fkit" "$SHARE/bin/fkit"
  chmod +x "$SHARE/bin/fkit"
fi
# Remove the retired Omnigent flavor from any pre-existing install (ADR-009). This is what makes an
# upgrade from an older fkit clean rather than leaving a dead runtime behind on disk.
rm -rf "$SHARE/omnigent"
# The read-only board (ADR-058) sits beside claude/, where the reader finds dashboard.sh.
# A ref without it leaves no stale copy behind.
rm -f "$SHARE/bin/fkit-board.mjs"
rm -rf "$SHARE/vendor/aiboard"
if [ -f "$TMP/src/bin/fkit-board.mjs" ] && [ -f "$TMP/src/vendor/aiboard/index.html" ]; then
  mkdir -p "$SHARE/bin" "$SHARE/vendor"
  cp "$TMP/src/bin/fkit-board.mjs" "$SHARE/bin/fkit-board.mjs"
  cp -R "$TMP/src/vendor/aiboard" "$SHARE/vendor/aiboard"
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
# BIN is recorded below and `fkit update` reinstalls into its `bin=` (task 0481), so record it ABSOLUTE
# from the cwd. `CDPATH=`: a CDPATH in the environment can send `cd bin` elsewhere and make it print.
mkdir -p "$BIN"
BIN="$(CDPATH= cd -- "$BIN" && pwd)"
{
  printf 'version=%s\n' "${ver:-unknown}"
  printf 'sha=%s\n' "${sha:-unknown}"
  printf 'repo=%s\n' "$REPO"
  printf 'ref=%s\n' "$REF"
  printf 'bin=%s\n' "$BIN"
} > "$SHARE/.version"
rm -f "$SHARE/.update-check" "$SHARE/.latest" 2>/dev/null || true   # fresh throttle + clear stale "newer" cache
echo "✓ Installed fkit v${ver:-?} ($(printf %s "${sha:-unknown}" | cut -c1-7))"

# Keep the legacy exec fallback so older refs and update provenance remain readable.
#    The "Reinstall:" hint puts the variables AFTER the pipe, on the `sh` that runs the installer, so a
#    reinstall keeps this install's source and paths (task 0481). Known limit: a path containing `'`
#    breaks the printed command (and one with `"` or `$` already breaks the `exec` line below).
mkdir -p "$BIN"
SHARE_Q="$(printf %s "$SHARE" | sed 's/[\\$`"\\]/\\&/g')"
BIN_Q="$(printf %s "$BIN" | sed 's/[\\$`"\\]/\\&/g')"
REPO_Q="$(printf %s "$REPO" | sed 's/[\\$`"\\]/\\&/g')"
REF_Q="$(printf %s "$REF" | sed 's/[\\$`"\\]/\\&/g')"
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
    echo "fkit: '\$1' is gone as a subcommand. Use --runtime codex or --runtime claude." >&2
    exit 1 ;;
  reconnect|restart-team)
    echo "fkit: '\$1' is gone — it only ever worked around Omnigent orchestration failures." >&2
    echo "      A role session is just:  fkit <role>" >&2
    exit 1 ;;
esac
if [ -x "$SHARE_Q/bin/fkit" ]; then exec "$SHARE_Q/bin/fkit" "\$@"; fi
[ -x "$SHARE_Q/claude/fkit-claude.sh" ] || {
  echo "fkit: install looks broken — $SHARE_Q/claude/fkit-claude.sh is missing." >&2
  echo "      Reinstall:  curl -fsSL https://raw.githubusercontent.com/$REPO_Q/$REF_Q/install.sh | FKIT_REPO=$REPO_Q FKIT_REF=$REF_Q FKIT_SHARE='$SHARE_Q' FKIT_BIN='$BIN_Q' sh" >&2
  exit 1
}
exec "$SHARE_Q/claude/fkit-claude.sh" "\$@"
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

# Installation never chooses a runtime or changes CLI authentication.
if ! command -v claude >/dev/null 2>&1; then
  echo
  echo "Claude Code is unavailable. Legacy sessions need it: https://claude.com/claude-code"
  echo "For Codex instead, install Node.js/Codex and run: fkit configure --runtime codex --runtime-default"
fi
if ! command -v codex >/dev/null 2>&1; then
  echo
  echo "Codex is needed for Codex-selected roles; optional but recommended for legacy Claude review."
  echo "    npm install -g @openai/codex   &&   codex login"
fi
if ! command -v node >/dev/null 2>&1; then
  echo
  echo "Node.js is needed for configuration, configured runtimes and fkit board: https://nodejs.org"
  echo "Unconfigured legacy Claude sessions still work without it."
fi
