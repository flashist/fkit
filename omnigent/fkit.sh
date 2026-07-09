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
# Env: FKIT_NO_BROWSER=1 skips opening the browser.
set -eu

here="$(cd "$(dirname "$0")" && pwd)"          # .../omnigent (repo checkout or ~/.local/share/fkit)
INIT="$here/fkit-init.sh"
[ -x "$INIT" ] || { echo "fkit: setup script not found at $INIT" >&2; exit 1; }

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
