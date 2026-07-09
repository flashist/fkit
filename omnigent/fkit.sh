#!/bin/sh
# fkit — the project entrypoint. Run it inside any project:  fkit
#
# Installed globally as `fkit` (~/.local/bin/fkit) by install.sh, with resources under
# ~/.local/share/fkit/. It decides for itself whether the current folder is a fresh project or an
# already-set-up one, then summons the whole agent team as idle sessions and opens the web UI so you
# can pick any agent to chat with.
#
#   - Fresh folder  → scaffold ai-agents/, vendor the six agents, run a quick terminal intake, summon all.
#   - Set-up folder → just summon all + open the web UI.
#
# It also keeps itself current: `fkit update` reinstalls from GitHub now, and a normal `fkit` does a
# throttled check and auto-updates when a newer commit is published (then continues on the fresh code).
#
# Env: FKIT_NO_BROWSER=1        skip opening the browser.
#      FKIT_NO_AUTO_UPDATE=1    check + notify about updates, but don't auto-apply them.
#      FKIT_NO_UPDATE_CHECK=1   never touch the network for update checks.
#      FKIT_UPDATE_INTERVAL_MIN throttle window in minutes (default 720 = 12h; 0 = check every launch).
#      FKIT_REPO / FKIT_REF     update source (default flashist/fkit@main).
set -eu

here="$(cd "$(dirname "$0")" && pwd)"          # .../omnigent (repo checkout or ~/.local/share/fkit)
share="$(cd "$here/.." && pwd)"                # install root (~/.local/share/fkit) or repo checkout root
INIT="$here/fkit-init.sh"
[ -x "$INIT" ] || { echo "fkit: setup script not found at $INIT" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Self-update. Keep the installed `fkit` in step with the published repo.
#   - `fkit update`  → reinstall from GitHub now (explicit; also `upgrade`).
#   - normal `fkit`  → throttled check; if a newer commit is published, auto-update and re-exec the
#                      freshly installed launcher so the rest of the run uses the new code.
# A source checkout (has .git, or the canonical omnigent/vendor-agents.sh) is never auto-updated —
# update it with git. The installed version is recorded in <install-root>/.version by install.sh.
# ---------------------------------------------------------------------------
_fkit_verfield() {  # _fkit_verfield <key> → its value from the installed .version (empty if none)
  [ -f "$share/.version" ] || return 0
  sed -n "s/^$1=//p" "$share/.version" | head -1
}
repo="${FKIT_REPO:-$(_fkit_verfield repo)}"; repo="${repo:-flashist/fkit}"
ref="${FKIT_REF:-$(_fkit_verfield ref)}";    ref="${ref:-main}"

_fkit_remote_sha() {  # → head commit sha of $repo@$ref, or empty on failure (prefers git; falls back to the API)
  if command -v git >/dev/null 2>&1; then
    git ls-remote "https://github.com/$repo.git" "$ref" 2>/dev/null | awk 'NR==1{print $1}'
  elif command -v curl >/dev/null 2>&1; then
    curl -fsSL "https://api.github.com/repos/$repo/commits/$ref" 2>/dev/null \
      | sed -n 's/.*"sha"[[:space:]]*:[[:space:]]*"\([0-9a-f]\{7,40\}\)".*/\1/p' | head -1
  fi
}
_fkit_reinstall() {  # run the canonical installer for $repo@$ref (refreshes resources + launcher + .version)
  command -v curl >/dev/null 2>&1 || { echo "fkit: curl is required to update" >&2; return 1; }
  FKIT_REPO="$repo" FKIT_REF="$ref" \
    curl -fsSL "https://raw.githubusercontent.com/$repo/$ref/install.sh" | sh
}
_fkit_is_source_checkout() { [ -d "$share/.git" ] || [ -f "$here/vendor-agents.sh" ]; }

# Explicit: `fkit update` / `fkit upgrade`.
case "${1:-}" in
  update|--update|upgrade|--upgrade|self-update)
    if _fkit_is_source_checkout; then
      echo "fkit: this is a source checkout ($share) — update it with 'git pull'." >&2
      echo "      (The installer would instead (re)install the released copy under ~/.local/share/fkit.)" >&2
      exit 1
    fi
    printf '  fkit: updating from %s@%s...\n' "$repo" "$ref"
    if _fkit_reinstall; then
      printf '  fkit: now at %s\n' "$(_fkit_verfield sha | cut -c1-7)"
      exit 0
    fi
    echo "fkit: update failed." >&2; exit 1
    ;;
esac

# Automatic: throttled check on a normal launch. Silent when already current; skips cleanly offline.
if [ "${FKIT_SKIP_UPDATE:-0}" != 1 ] && [ "${FKIT_NO_UPDATE_CHECK:-0}" != 1 ] \
   && ! _fkit_is_source_checkout && command -v curl >/dev/null 2>&1; then
  stamp="$share/.update-check"
  interval="${FKIT_UPDATE_INTERVAL_MIN:-720}"
  due=1
  if [ "$interval" -gt 0 ] 2>/dev/null && [ -f "$stamp" ] \
     && [ -z "$(find "$stamp" -mmin +"$interval" 2>/dev/null)" ]; then
    due=0   # checked within the throttle window — stay offline
  fi
  if [ "$due" = 1 ]; then
    : > "$stamp" 2>/dev/null || true                    # record the check time up front
    remote="$(_fkit_remote_sha)"
    installed="$(_fkit_verfield sha)"
    if [ -n "$remote" ] && [ "$remote" != "$installed" ]; then
      if [ "${FKIT_NO_AUTO_UPDATE:-0}" = 1 ]; then
        printf '  fkit: a newer version is available (%s). Run: fkit update\n' \
          "$(printf %s "$remote" | cut -c1-7)"
      else
        printf '  fkit: newer version available (%s → %s) — updating...\n' \
          "$(printf %s "${installed:-unknown}" | cut -c1-7)" "$(printf %s "$remote" | cut -c1-7)"
        if _fkit_reinstall; then
          FKIT_SKIP_UPDATE=1 exec "$0" "$@"              # continue on the freshly installed launcher
        else
          echo "  fkit: update failed — continuing with the current version." >&2
        fi
      fi
    fi
  fi
fi

proj="$(pwd)"
ui_url="http://127.0.0.1:6767"
agents="producer coder reviewer architect wiki adversarial-reviewer"

# 1. Fresh vs. already set up: the presence of vendored agents is the signal.
fresh=0
[ -d "$proj/.fkit/agents" ] || fresh=1

# 2. Set up the project (idempotent). FKIT_SETUP_ONLY makes fkit-init.sh scaffold + vendor + write the
#    .fkit/ launchers WITHOUT its own "start the producer?" prompt — fkit drives the launch here.
FKIT_SETUP_ONLY=1 "$INIT" "$proj" || { echo "fkit: project setup failed" >&2; exit 1; }

# 3. On a fresh project, capture a quick intake on the terminal (before any agent) so the team starts
#    with product context. Skips cleanly with no terminal; writes .fkit/intake.md.
if [ "$fresh" = 1 ] && [ -x "$proj/.fkit/interview" ]; then
  "$proj/.fkit/interview" || true
fi

cd "$proj"

if ! command -v omnigent >/dev/null 2>&1; then
  echo "fkit: 'omnigent' is not on your PATH — install it (https://omnigent.ai) and run 'omnigent setup'," >&2
  echo "      then re-run 'fkit'. The project is set up; only the agent launch is pending." >&2
  exit 1
fi

# 4. Summon all agents as IDLE sessions (no prompt, no task) so each is available to chat with in the
#    web UI. Each `omnigent run` registers its agent + creates a session on the server, then exits on
#    EOF (stdin is /dev/null) — the session persists on the server regardless of the client. The
#    producer is started first and we wait for the shared server to answer, so the other five reuse it
#    instead of each racing to spawn their own server.
#    NB: these summons do NOT each open a browser tab — fkit-init.sh wrote `auto_open_conversation:
#    false` to the project's .omnigent/config.yaml, so per-conversation auto-open is off. We open ONE
#    web-UI tab (the sidebar with all sessions) at step 5.
# nohup so the client outlives this script and can finish creating its session on the server even
# after fkit returns (the session persists server-side; the client exits on EOF once it's created).
summon() { nohup omnigent run ".fkit/agents/fkit-$1" </dev/null >/dev/null 2>&1 & }

printf '\n  fkit: summoning the team (idle — pick one to start a chat)...\n'
first=1
for a in $agents; do
  [ -d ".fkit/agents/fkit-$a" ] || continue
  summon "$a"
  if [ "$first" = 1 ]; then
    first=0
    n=0
    while [ "$n" -lt 20 ]; do
      if command -v curl >/dev/null 2>&1 && curl -s -o /dev/null "$ui_url"; then break; fi
      n=$((n + 1)); sleep 1
    done
  fi
done

# give the remaining sessions a moment to register on the server before we point the browser at them
sleep 3

# 5. Open the web UI — the reliable surface where all summoned agents appear in the sidebar.
if [ "${FKIT_NO_BROWSER:-0}" != 1 ]; then
  if command -v open >/dev/null 2>&1; then open "$ui_url" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$ui_url" >/dev/null 2>&1 || true
  fi
fi

printf '\n  fkit is ready in %s\n\n' "$proj"
printf '  All agents are summoned and idle — open the web UI and pick one from the sidebar:\n'
printf '    %s\n\n' "$ui_url"
printf '    producer   plan sprints, write task briefs   (on a fresh project it offers to initialize)\n'
printf '    coder      implement a task: plan -> code -> test\n'
printf '    reviewer   review a diff (adversarial 2nd opinion)\n'
printf '    architect  design specs, ADRs, evaluate approaches\n'
printf '    wiki       the project knowledge base\n'
printf '    adversarial-reviewer   codex second opinion\n\n'
printf '  (A single agent in your terminal instead:  .fkit/run <agent>)\n\n'
