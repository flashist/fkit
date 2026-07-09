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
# `fkit team` (prototype) opens ONE durable, resumable session instead: a fkit-team root stands up the
# six agents as named children in the web UI's Subagents panel (each directly chattable), caches its
# conversation id in .fkit/team-session, and resumes THAT same session every run — so nothing piles up
# and you return to the same workspace across days.
#
# It also keeps itself current: `fkit update` reinstalls from GitHub now, and a normal `fkit` does a
# throttled check and auto-updates when a newer commit is published (then continues on the fresh code).
#
# Env: FKIT_NO_BROWSER=1        skip opening the browser.
#      FKIT_NO_AUTO_UPDATE=1    check + notify about updates, but don't auto-apply them.
#      FKIT_NO_UPDATE_CHECK=1   never touch the network for update checks.
#      FKIT_UPDATE_INTERVAL_MIN throttle window in minutes (default 60 = 1h; 0 = check every launch).
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

_fkit_remote_version() {  # → the human version string at $repo@$ref (from the repo-root VERSION), or empty
  command -v curl >/dev/null 2>&1 || return 0
  curl -fsSL "https://raw.githubusercontent.com/$repo/$ref/VERSION" 2>/dev/null | head -1 | tr -d '[:space:]'
}
_fkit_banner() {  # print "fkit vX (sha)" + a cached "newer available" hint — no network
  v="$(_fkit_verfield version)"
  [ -n "$v" ] || v="$(head -1 "$share/VERSION" 2>/dev/null | tr -d '[:space:]')"   # root VERSION (source checkout)
  [ -n "$v" ] || v="dev"
  s="$(_fkit_verfield sha)"
  if [ -z "$s" ] && [ -d "$share/.git" ] && command -v git >/dev/null 2>&1; then
    s="$(git -C "$share" rev-parse HEAD 2>/dev/null)"
  fi
  s7="$(printf %s "${s:-unknown}" | cut -c1-7)"
  if _fkit_is_source_checkout; then
    printf '  fkit v%s (%s · source checkout)\n' "$v" "$s7"
    return 0
  fi
  printf '  fkit v%s (%s)\n' "$v" "$s7"
  # freshness hint from the last throttled check (cached in .latest) — no network on this path
  if [ -f "$share/.latest" ]; then
    lsha="$(sed -n 's/^sha=//p' "$share/.latest" | head -1)"
    lver="$(sed -n 's/^version=//p' "$share/.latest" | head -1)"
    if [ -n "$lsha" ] && [ "$lsha" != "$(_fkit_verfield sha)" ]; then
      printf '  ↑ v%s available — run: fkit update\n' "${lver:-$(printf %s "$lsha" | cut -c1-7)}"
    fi
  fi
}

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
      printf '  fkit: now at v%s (%s)\n' "$(_fkit_verfield version)" "$(_fkit_verfield sha | cut -c1-7)"
      exit 0
    fi
    echo "fkit: update failed." >&2; exit 1
    ;;
esac

# Launch mode: `fkit team` opens ONE durable, resumable session with the whole team as named children
# in the web UI's Subagents panel (resume-or-create, so it never proliferates). Anything else uses the
# classic six-top-level-session summon. (Once the team model is proven, this becomes the default.)
mode=summon
case "${1:-}" in
  team|--team) mode=team ;;
esac

# Automatic: throttled check on a normal launch. Silent when already current; skips cleanly offline.
if [ "${FKIT_SKIP_UPDATE:-0}" != 1 ] && [ "${FKIT_NO_UPDATE_CHECK:-0}" != 1 ] \
   && ! _fkit_is_source_checkout && command -v curl >/dev/null 2>&1; then
  stamp="$share/.update-check"
  interval="${FKIT_UPDATE_INTERVAL_MIN:-60}"
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
      rver="$(_fkit_remote_version)"; curver="$(_fkit_verfield version)"
      # cache the newest-known version so the startup banner can show it without a network call
      { printf 'version=%s\n' "${rver:-unknown}"; printf 'sha=%s\n' "$remote"; } > "$share/.latest" 2>/dev/null || true
      if [ "${FKIT_NO_AUTO_UPDATE:-0}" = 1 ]; then
        printf '  fkit: a newer version is available (v%s → v%s). Run: fkit update\n' \
          "${curver:-?}" "${rver:-?}"
      else
        printf '  fkit: updating v%s → v%s...\n' "${curver:-?}" "${rver:-?}"
        if _fkit_reinstall; then
          FKIT_SKIP_UPDATE=1 exec "$0" "$@"              # continue on the freshly installed launcher
        else
          echo "  fkit: update failed — continuing with the current version." >&2
        fi
      fi
    fi
  fi
fi

# Show which fkit this is (and, if the last check saw a newer one, a one-line upgrade hint).
_fkit_banner

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

# ---------------------------------------------------------------------------
# `fkit team` — ONE durable, resumable session. A fkit-team root agent stands up the six teammates as
# named standby children in the Subagents panel (each directly chattable). We cache the root's
# conversation id in .fkit/team-session and resume THAT exact session every run, so it never
# proliferates and survives across days. The id isn't printed at launch, so we discover it via the
# local REST API; PATCH names the root in the sidebar. Foreground REPL drives the first-run bootstrap
# reliably; a background poller opens the single web-UI tab.
# ---------------------------------------------------------------------------
if [ "$mode" = team ]; then
  [ -d ".fkit/agents/fkit-team" ] || {
    echo "fkit: the fkit-team bundle is missing (.fkit/agents/fkit-team). Re-run 'fkit' to re-vendor." >&2
    exit 1
  }
  teamfile=".fkit/team-session"
  base="$ui_url"
  seed="Stand up the fkit team now: create each teammate as a named standby session per your instructions, then end your turn."

  _team_open_ui() {
    [ "${FKIT_NO_BROWSER:-0}" = 1 ] && return 0
    if command -v open >/dev/null 2>&1; then open "$base" >/dev/null 2>&1 || true
    elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$base" >/dev/null 2>&1 || true
    fi
  }
  _team_wait_server() {  # poll the local server until it answers (bounded); returns anyway
    n=0
    while [ "$n" -lt 30 ]; do
      command -v curl >/dev/null 2>&1 && curl -s -o /dev/null "$base/" 2>/dev/null && return 0
      n=$((n + 1)); sleep 1
    done
    return 0
  }

  # Decide resume vs. create. A cached id is trusted when the server is down (omnigent validates it on
  # launch and errors loudly on 404); when the server is already up we verify it and drop a stale id.
  id=""; [ -f "$teamfile" ] && id="$(head -1 "$teamfile" 2>/dev/null | tr -d '[:space:]')"
  team_mode=create
  if [ -n "$id" ]; then
    if command -v curl >/dev/null 2>&1 && curl -s -o /dev/null "$base/" 2>/dev/null; then
      code="$(curl -s -o /dev/null -w '%{http_code}' "$base/v1/sessions/$id" 2>/dev/null || echo 000)"
      case "$code" in
        2*) team_mode=resume ;;
        *)  team_mode=create; id=""; : > "$teamfile" 2>/dev/null || true ;;   # stale/deleted → recreate
      esac
    else
      team_mode=resume
    fi
  fi

  if [ "$team_mode" = resume ]; then
    printf '\n  fkit: resuming your team session (%s)...\n' "$(printf %s "$id" | cut -c1-16)"
    ( _team_wait_server; _team_open_ui ) &
    set -- run --resume "$id" ".fkit/agents/fkit-team"
  else
    printf '\n  fkit: creating your team session (one durable workspace)...\n'
    ( # capture the new conversation id → cache it → name the root → open the single web-UI tab
      _team_wait_server
      newid=""; m=0
      while [ "$m" -lt 30 ] && [ -z "$newid" ]; do
        newid="$(curl -s "$base/v1/sessions?agent_name=fkit-team&limit=1&order=desc&sort_by=updated_at" 2>/dev/null \
                  | grep -o 'conv_[A-Za-z0-9]*' | head -1)"
        [ -z "$newid" ] && { m=$((m + 1)); sleep 1; }
      done
      if [ -n "$newid" ]; then
        printf '%s\n' "$newid" > "$teamfile"
        curl -s -o /dev/null -X PATCH "$base/v1/sessions/$newid" \
          -H 'Content-Type: application/json' \
          --data "{\"title\":\"fkit · $(basename "$proj")\"}" 2>/dev/null || true
      fi
      _team_open_ui
    ) &
    set -- run ".fkit/agents/fkit-team" -p "$seed"
  fi

  printf '  Your six teammates appear in the Subagents panel — click any one to chat: %s\n\n' "$base"

  # Foreground REPL (reliable bootstrap). Omnigent's REPL watches stdin with kqueue, which rejects the
  # /dev/tty clone on macOS; if our stdin is not a real terminal (e.g. `curl | sh`), feed it the real
  # controlling-terminal pts (ps -o tty= yields ttysNNN / pts/N — real char devices; /dev/tty is not).
  if ! [ -t 0 ]; then
    tt="$(ps -o tty= -p $$ 2>/dev/null | tr -d ' ')"
    if [ -n "$tt" ] && [ -c "/dev/$tt" ]; then exec omnigent "$@" < "/dev/$tt"; fi
  fi
  exec omnigent "$@"
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
