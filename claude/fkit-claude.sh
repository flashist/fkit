#!/bin/sh
# fkit launcher: set the project up (idempotent), then exec a ROLE-LOCKED Claude Code session in this tab.
# The menu is deterministic: picking a role is an if/else, not a judgment call.

# Locked twice: --agent fkit-<role> (ADR-010) and a PreToolUse hook that denies any `Skill` call whose REAL
# invoking agent's role doesn't own it, at any spawn depth (ADR-018).

# Want two roles at once? Open a terminal tab yourself: automating it needs AppleScript/Accessibility
# permissions that fail in worse ways than pressing Cmd-T.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"                  # .../claude
proj="$PWD"

# In an fkit checkout, re-exec its own claude/fkit-claude.sh: setup copies agents/skills from $here, and the
# installed snapshot would overwrite the project with an older fkit. FKIT_NO_SELF_HOST=1 makes it run once.
if [ "${FKIT_NO_SELF_HOST:-0}" != 1 ] \
   && [ -x "$proj/claude/fkit-claude.sh" ] \
   && [ "$proj/claude" != "$here" ]; then
  printf '\n  → self-hosting: running from %s (working tree), not the installed fkit.\n' "$proj/claude"
  FKIT_NO_SELF_HOST=1
  export FKIT_NO_SELF_HOST
  exec "$proj/claude/fkit-claude.sh" "$@"
fi

ROLES="lead producer coder architect reviewer adversarial-reviewer wiki"

# Self-update NOTIFIES only (ADR-009 Decision 3). Unless FKIT_NO_UPDATE_CHECK=1 or in a checkout, every launch
# runs the check, so offline / proxied / captive-portal must cost nothing and print nothing.
share="$(cd "$here/.." && pwd)"        # install root (~/.local/share/fkit), or the repo root in a checkout
# Each startup-check call gets FKIT_NET_TIMEOUT s and fails silently (git via the watchdog, +1 s if git
# ignores TERM); fkit update's install.sh download gets FKIT_INSTALLER_FETCH_TIMEOUT and fails loudly (0284).
FKIT_NET_TIMEOUT=5
FKIT_INSTALLER_FETCH_TIMEOUT=60        # the user is watching and a slow link is not a failure; install.sh's own downloads stay unbounded

_fkit_verfield() {   # <key> [<root>] → its value from <root>/.version (default: this install's; empty if absent)
  [ -f "${2:-$share}/.version" ] || return 0
  sed -n "s/^$1=//p" "${2:-$share}/.version" | head -1
}
# A source checkout is the fkit repo itself. Key this ONLY on markers install.sh never copies into an
# install (.git, the repo-root package.json) — never on anything inside claude/, which IS copied.
_fkit_is_source_checkout() { [ -d "$share/.git" ] || [ -f "$share/package.json" ]; }

_fkit_deadline() (   # <secs> <cmd> [args…] → the command's stdout if it exits 0 within <secs>; else nothing. Always exits 0.
  exec 2>/dev/null
  _fkit_dl_secs="$1"; shift
  # A file, not the caller's pipe: anything left holding that pipe would hold the launcher open too.
  _fkit_dl_out="$(mktemp)" || exit 0
  "$@" >"$_fkit_dl_out" &
  _fkit_dl_pid=$!
  ( trap 'kill "${_fkit_dl_nap:-}" || :; exit 0' TERM
    sleep "$_fkit_dl_secs" & _fkit_dl_nap=$!
    wait "$_fkit_dl_nap" || :
    # git works in child processes: kill its direct children too, and KILL in case TERM is ignored.
    _fkit_dl_kids="$(ps -A -o pid= -o ppid= | awk -v p="$_fkit_dl_pid" '$2 == p { print $1 }')" || :
    kill $_fkit_dl_kids "$_fkit_dl_pid" || :
    sleep 1 || :
    kill -9 $_fkit_dl_kids "$_fkit_dl_pid" || :
  ) >/dev/null &
  _fkit_dl_dog=$!
  if wait "$_fkit_dl_pid"; then cat "$_fkit_dl_out" || :; fi
  kill "$_fkit_dl_dog" || :
  rm -f "$_fkit_dl_out" || :
  exit 0
)
_fkit_remote_sha() {   # → head sha of $repo@$ref, or empty. Never hangs, never fails loudly.
  if command -v git >/dev/null 2>&1; then
    # env(1), not a prefix: a prefix on a function call is not guaranteed to reach the command inside.
    _fkit_deadline "$FKIT_NET_TIMEOUT" env GIT_TERMINAL_PROMPT=0 \
      GIT_HTTP_LOW_SPEED_LIMIT=1000 GIT_HTTP_LOW_SPEED_TIME="$FKIT_NET_TIMEOUT" \
      git ls-remote "https://github.com/$fkit_repo.git" "$fkit_ref" 2>/dev/null \
      | awk 'NR==1{print $1}' || true
  elif command -v curl >/dev/null 2>&1; then
    curl -fsSL --max-time "$FKIT_NET_TIMEOUT" \
      "https://api.github.com/repos/$fkit_repo/commits/$fkit_ref" 2>/dev/null \
      | sed -n 's/.*"sha"[[:space:]]*:[[:space:]]*"\([0-9a-f]\{7,40\}\)".*/\1/p' | head -1 || true
  fi
  return 0
}
_fkit_remote_version() {   # → the human version string at $repo@$ref, or empty
  command -v curl >/dev/null 2>&1 || return 0
  curl -fsSL --max-time "$FKIT_NET_TIMEOUT" \
    "https://raw.githubusercontent.com/$fkit_repo/$fkit_ref/VERSION" 2>/dev/null \
    | head -1 | tr -d '[:space:]' || true
  return 0
}
_fkit_reinstall() {   # run the canonical installer for $repo@$ref into $fkit_share/$fkit_bin (refreshes resources + .version)
  command -v curl >/dev/null 2>&1 || { echo "fkit: curl is required to update" >&2; return 1; }
  # Download first, then run: piped into sh, a failed download ran an empty script and printed success (0481).
  _fkit_script="$(curl -fsSL --max-time "$FKIT_INSTALLER_FETCH_TIMEOUT" "https://raw.githubusercontent.com/$fkit_repo/$fkit_ref/install.sh")" \
    && [ -n "$_fkit_script" ] \
    || { echo "fkit: could not download install.sh from $fkit_repo@$fkit_ref" >&2; return 1; }
  # The installer's variables go on the sh after the pipe: a prefix reaches only its own command, so the old
  # form gave them to curl and the installer ran on its defaults (0481).
  printf '%s\n' "$_fkit_script" \
    | FKIT_REPO="$fkit_repo" FKIT_REF="$fkit_ref" FKIT_SHARE="$fkit_share" FKIT_BIN="$fkit_bin" sh
}
_fkit_wrapper_share() {   # <bin-dir> → the install root its `fkit` wrapper execs, or empty
  [ -f "$1/fkit" ] || return 0
  sed -n 's|^exec "\(.*\)/claude/fkit-claude\.sh" "\$@"$|\1|p' "$1/fkit" | head -1
}
_fkit_same_dir() {   # <a> <b> → true if both are directories with the same physical path
  [ -d "$1" ] && [ -d "$2" ] && [ "$(cd "$1" && pwd -P)" = "$(cd "$2" && pwd -P)" ]
}

fkit_repo="${FKIT_REPO:-$(_fkit_verfield repo)}"; fkit_repo="${fkit_repo:-flashist/fkit}"
fkit_ref="${FKIT_REF:-$(_fkit_verfield ref)}";    fkit_ref="${fkit_ref:-main}"

case "${1:-}" in
  update|--update|upgrade|--upgrade|self-update)
    if _fkit_is_source_checkout; then
      echo "fkit: this is a source checkout ($share) — update it with 'git pull'." >&2
      exit 1
    fi
    # Reinstall into the SAME install (0481): unless FKIT_SHARE names it, refuse a symlinked or copied fkit
    # (install.sh would rm -rf under a wrong root); refuse an unknown bin dir rather than install a 2nd copy.
    if [ -z "${FKIT_SHARE:-}" ] && ! { [ -f "$share/.version" ] && _fkit_same_dir "$here" "$share/claude"; }; then
      echo "fkit: $share is not an fkit install (is this fkit a symlink or a copy?); run the fkit the installer made, or:  FKIT_SHARE=<its install dir> FKIT_BIN=<its bin dir> fkit update" >&2
      exit 1
    fi
    # An explicit FKIT_SHARE holding an install supplies its own repo/ref/bin (env still wins); otherwise
    # a fork or pinned install reached through it would revert to flashist/fkit@main.
    src="$share"
    if [ -n "${FKIT_SHARE:-}" ] && [ -f "$FKIT_SHARE/.version" ]; then
      src="$FKIT_SHARE"
      fkit_repo="${FKIT_REPO:-$(_fkit_verfield repo "$src")}"; fkit_repo="${fkit_repo:-flashist/fkit}"
      fkit_ref="${FKIT_REF:-$(_fkit_verfield ref "$src")}";    fkit_ref="${fkit_ref:-main}"
    fi
    fkit_share="${FKIT_SHARE:-$share}"
    fkit_bin="${FKIT_BIN:-$(_fkit_verfield bin "$src")}"
    if [ -z "$fkit_bin" ]; then
      if [ -n "${HOME:-}" ] && _fkit_same_dir "$(_fkit_wrapper_share "$HOME/.local/bin")" "$src"; then
        fkit_bin="$HOME/.local/bin"
      else
        echo "fkit: cannot tell where your fkit command is installed; run:  FKIT_BIN=<its directory> fkit update" >&2
        exit 1
      fi
    fi
    printf '  fkit: updating from %s@%s...\n' "$fkit_repo" "$fkit_ref"
    if _fkit_reinstall; then
      share="$fkit_share"            # an env FKIT_SHARE moved the install: read and clean the new copy
      printf '  fkit: now at v%s (%s)\n' \
        "$(_fkit_verfield version)" "$(_fkit_verfield sha | cut -c1-7)"
      rm -f "$share/.latest" "$share/.update-check" 2>/dev/null || true
      exit 0
    fi
    echo "fkit: update failed." >&2; exit 1 ;;
esac

# Automatic: a throttled check that only ever PRINTS. Silent when current; silent when offline.
if [ "${FKIT_NO_UPDATE_CHECK:-0}" != 1 ] && ! _fkit_is_source_checkout; then
  stamp="$share/.update-check"
  interval="${FKIT_UPDATE_INTERVAL_MIN:-60}"
  due=1
  if [ "$interval" -gt 0 ] 2>/dev/null && [ -f "$stamp" ] \
     && [ -z "$(find "$stamp" -mmin +"$interval" 2>/dev/null)" ]; then
    due=0                                        # inside the throttle window — stay off the network
  fi
  if [ "$due" = 1 ]; then
    : > "$stamp" 2>/dev/null || true             # stamp up front: a failed check still costs the window
    remote="$(_fkit_remote_sha)"
    installed="$(_fkit_verfield sha)"
    if [ -n "$remote" ] && [ -n "$installed" ] && [ "$remote" != "$installed" ]; then
      rver="$(_fkit_remote_version)"; curver="$(_fkit_verfield version)"
      { printf 'version=%s\n' "${rver:-unknown}"; printf 'sha=%s\n' "$remote"; } \
        > "$share/.latest" 2>/dev/null || true
      # Label what triggered: it is a sha compare, so say "vA → vB" only for two DISTINCT known versions,
      # else name the shas (0257). A remote version is not always knowable (no curl; ls-remote returns refs).

      # Scope (0257): only the empty-version "v?" is gone; nothing is validated, so a garbage VERSION still
      # renders verbatim.
      if [ -n "$rver" ] && [ -n "$curver" ] && [ "$rver" != "$curver" ]; then
        printf '\n  ↑ fkit v%s → v%s is available. Run:  fkit update\n\n' "$curver" "$rver"
      else
        printf '\n  ↑ fkit %s— newer content on %s (%s → %s). Run:  fkit update\n\n' \
          "${curver:+v$curver }" "$fkit_ref" \
          "$(printf %s "$installed" | cut -c1-7)" "$(printf %s "$remote" | cut -c1-7)"
      fi
    fi
  fi
fi

case "${1:-}" in
  -h|--help)
    cat <<'EOF'
fkit — the fkit agent team, on Claude Code.

Usage: fkit [role] [claude-args…]

With no role you get a menu. Pick a role and it opens IN THIS TAB, locked to that role: it can run only
that role's skills. For two roles at once, open another terminal tab and run `fkit` again.

Roles:
  lead         the conductor — routes you to a role, or drives the team for you
  producer     product & sprint planning, task briefs, task lifecycle
  coder        implementation — the only role that writes source
  architect    architecture, design specs, ADRs, feasibility
  reviewer     code review — its own pass + a Codex second opinion
  adv          adversarial reviewer — hostile pass, findings only
  wiki         the wiki — ingest / lint / sync (the exclusive write gateway)

Within a session, `@fkit-<role> <question>` asks another role and brings the answer back.

Other:
  fkit update           update fkit itself
  FKIT_SETUP_ONLY=1     set the project up, then exit without launching
  FKIT_NO_UPDATE_CHECK=1  never check for updates
  FKIT_CLEANUP_DRY_RUN=1  report the dead Omnigent paths fkit would delete, and delete nothing

A first argument that is not a role is an error. Args AFTER a role pass through to `claude`.
EOF
    exit 0 ;;
esac

role=""
# team / team room are deliberately NOT accepted, here or at the menu; lead is the only word (0140).
# Read 0139 review R1, R3 before re-adding: argv is split, so fkit team room passes room on as a prompt.
case "${1:-}" in
  producer|coder|architect|reviewer|wiki|adversarial-reviewer|lead)
    role="$1"; shift ;;
  adv|adversarial)
    role="adversarial-reviewer"; shift ;;
esac

# No role named but args remain → usage error, before setup and every claude exec: a stray word once let
# fkit --resume resume ANY session under the lead's lockdown (ADR-010; 0073). Args after a role pass through.
if [ -z "$role" ] && [ "$#" -gt 0 ]; then
  printf 'fkit: "%s" is not a role.\n' "$1" >&2
  printf '      Roles: %s (or: adv)\n' "$ROLES" >&2
  printf '      Try:  fkit          (the menu)   ·   fkit <role>   ·   fkit --help\n' >&2
  exit 2
fi

# skills_for_role() is the one source of role→skill ownership (ADR-012 §1; no skills: frontmatter — it is
# only a preload hint). A PreToolUse hook enforces it at any spawn depth (ADR-018).

# ⚠️ CHANGING A ROLE'S SKILLS? SIX hand-maintained places MIRROR this list (or a role fact it carries)
# for humans and MUST be updated in the same commit, or the docs lie about what a role can do:
#   * claude/skills/fkit-team/SKILL.md  — the roster the /fkit-team skill prints
#   * claude/README.md                  — the skill-ownership table
#   * claude/scaffold/CLAUDE.md         — SHIPS INTO EVERY CONSUMING PROJECT's root CLAUDE.md
#   * ai-agents/knowledge-base/architecture.md — the skill count and the role/skill table
#   * test/skill-ownership-hook.test.js — OWNED, the hard-coded mirror the hook test asserts against
#   * claude/fkit-claude-init.sh        — the printed role roster (mirrors the role list and the lock
#                                         invariant, not the per-role skill lists; nothing tests it)
#
# ⚠️ THIS LIST SAID "TWO" UNTIL 2026-07-18, AND THE OMISSION COST EXACTLY WHAT IT LOOKS LIKE IT WOULD.
# Task 70 followed the two-item list precisely and still shipped a false statement into every consuming
# project (scaffold/CLAUDE.md asserted the lead role has "only" two skills, which had just stopped being
# true). A checklist that is itself incomplete is worse than no checklist: it is followed, and it fails.
# If you add another mirror, add it HERE FIRST. (It said "FOUR" until 2026-08-27 — incomplete a second time; 0142 D4.)
# This has already bitten once: `0012` added the producer's brief-creation skill here and to the
# producer's agent file, but not to fkit-team's roster — so /fkit-team under-reported the producer's
# primary procedure for two days. These are copies FOR READERS, not sources of truth; skills_for_role() is the source of
# truth (moved to skills-for-role.sh, `0052`, so the PreToolUse hook can source it without pulling
# in this script's top-level side effects).
. "$here/skills-for-role.sh"

# Settings go in a FILE, not argv: a tab with no title shows the command line, and the JSON makes every tab
# look alike. The retired skillOverrides off-list and CONSULT_SKILLS stay retired (ADR-018).
build_settings() {   # → .fkit/settings/<role>.json containing {"hooks":{…}}
  # bash "<path>", never the bare path: the exec bit may not survive install (ADR-017 rule 2). An absolute
  # $here is safe only because this file is regenerated every launch, never committed.

  # Hooks, each documented in its own script: Skill ownership (ADR-018); AskUserQuestion marker + Stop
  # (ADR-030; never SubagentStop, so a consult is never blocked); ship-loop marker (0129); carry-check (0204).

  # Launcher sessions only: a running session gets it at its NEXT launch, never mid-session.
  hooks="\"hooks\":{\"PreToolUse\":[{\"matcher\":\"Skill\",\"hooks\":[{\"type\":\"command\",\"command\":\"bash \\\"$here/skill-ownership-hook.sh\\\"\"}]},{\"matcher\":\"AskUserQuestion\",\"hooks\":[{\"type\":\"command\",\"command\":\"bash \\\"$here/askuserquestion-marker-hook.sh\\\"\"}]},{\"matcher\":\"Agent|Task\",\"hooks\":[{\"type\":\"command\",\"command\":\"bash \\\"$here/carry-check-hook.sh\\\"\"}]}],\"Stop\":[{\"hooks\":[{\"type\":\"command\",\"command\":\"bash \\\"$here/turn-completion-hook.sh\\\"\"}]}],\"UserPromptExpansion\":[{\"hooks\":[{\"type\":\"command\",\"command\":\"bash \\\"$here/shiploop-marker-hook.sh\\\"\"}]}]}"
  # Best-effort: ensure the marker state dir exists so the Stop hook's "infra ready" proxy holds from
  # turn 1 (a read-only project simply leaves it absent → Stop fails open, suppressing check A).
  mkdir -p "$proj/.fkit/state" 2>/dev/null || :
  # The lockdown is NOT optional (ADR-010): if .fkit/ is unwritable, pass the same JSON inline (ugly tab
  # title, no temp file). The subshell keeps a failed redirect's "Permission denied" inside the 2>/dev/null.
  if mkdir -p "$proj/.fkit/settings" 2>/dev/null &&
     ( printf '{%s}\n' "$hooks" > "$proj/.fkit/settings/$1.json" ) 2>/dev/null; then
    printf '.fkit/settings/%s.json' "$1"        # relative: we always exec from $proj (proj = $PWD)
    return 0
  fi
  echo "⚠ $proj is not writable — passing the role lockdown inline instead of via .fkit/." >&2
  printf '{%s}' "$hooks"
}

# Name the tab until Claude Code auto-titles it, so a wall of fkit tabs is readable.
set_tab_title() {
  [ -t 1 ] || return 0
  printf '\033]0;fkit · %s — %s\007' "$1" "$(basename "$proj")"
}

# Setup runs every launch, quiet on a set-up project, and is best-effort (0088):
# A user must always be able to reach their agents, even when fkit cannot finish setting the project up.
setup_ok=1
aa_refused=0
setup_rc=0
if [ -e "$proj/ai-agents" ] && [ -d "$proj/.claude/agents" ]; then
  "$here/fkit-claude-init.sh" "$proj" >/dev/null || setup_rc=$?
else
  "$here/fkit-claude-init.sh" "$proj" || setup_rc=$?
fi
# init's exit 3 = set up, but ai-agents/ refused: a success. Taken as a STATUS, never re-tested here —
# the two copies drifted the first time we tried that.
case "$setup_rc" in
  0) ;;
  3) aa_refused=1 ;;
  *) setup_ok=0 ;;
esac

if [ "$setup_ok" = 0 ]; then
  echo >&2
  echo "⚠ fkit could not finish setting up this project." >&2
  echo "  Starting the session anyway — but fkit-managed files may be missing or stale" >&2
  echo "  (agents, skills, or the ai-agents/ tree). Fix the cause above, then re-run: fkit" >&2
  echo >&2
fi

# Setup failed and no usable agent: claude --agent would die on its own confusing "agent not found", so
# refuse. Never drop --agent — an unroled session fails OPEN (ADR-010). Names alone prove nothing (0334).
agents_usable() {   # → 0 if a readable regular .claude/agents/fkit-*.md exists with no symlink on the way; else one "    <path> — <why>" line per blocker
  for _p in "$proj/.claude" "$proj/.claude/agents"; do
    if [ -L "$_p" ]; then
      printf '    %s — a symlink; fkit will not read agents through one\n' "$_p"; return 1
    elif [ -e "$_p" ] && [ ! -d "$_p" ]; then
      printf '    %s — not a directory\n' "$_p"; return 1
    fi
  done
  _why=""
  for _a in "$proj"/.claude/agents/fkit-*.md; do
    if [ -L "$_a" ]; then
      if [ -e "$_a" ]; then _r="a symlink; fkit will not read an agent through one"
      else _r="a symlink to something that does not exist"; fi
    elif [ -d "$_a" ]; then _r="a directory, not an agent file"
    elif [ -f "$_a" ]; then
      [ -r "$_a" ] && return 0
      _r="not readable; check its permissions"
    elif [ -e "$_a" ]; then _r="not a regular file"
    else continue
    fi
    _why="$_why    $_a — $_r
"
  done
  printf '%s' "$_why"
  return 1
}
if [ "$setup_ok" = 0 ] && ! agents_why="$(agents_usable)"; then
  if [ -z "$agents_why" ]; then
    echo "⚠ fkit has no agents installed here, so there is no session to start." >&2
    echo "  Setup could not write to the project — check that $proj is writable, then: fkit" >&2
  else
    echo "⚠ fkit found nothing here it can launch as an agent, so there is no session to start:" >&2
    printf '%s\n' "$agents_why" >&2
    echo "  An agent must be a readable, regular .claude/agents/fkit-<role>.md, with no symlink on the way." >&2
    echo "  Fix or move what is named above, then: fkit" >&2
  fi
  exit 1
fi

# Launch-time structure notice (0247; ADR-039 Decision 3): ONE stderr line when the project diverges from
# what the installed fkit ships. Awareness only; /fkit-heal repairs. Contract: 0247 plan §2–§3, review R1, R2.

# Reuses the SHARE's check.sh rows (a second classifier would drift). Read-only, no state, no kill-switch;
# every failure is silent and non-fatal; a filter failure retries without suppression before giving up.

# ⚠️ A bad intent file suppresses NOTHING — inverted from keep-out on purpose: keep-out gates a write, this
# gates silence. Do not "fix" it into keep-out's direction.
structure_notice() {
  sn_ck="$here/skills/fkit-heal/check.sh"
  [ -f "$sn_ck" ] || return 0
  command -v bash >/dev/null 2>&1 || return 0
  sn_rc=0
  sn_out="$(bash "$sn_ck" --share "$share" "$proj" 2>/dev/null)" || sn_rc=$?
  case "$sn_rc" in 0|1) ;; *) return 0 ;; esac
  # The intent file counts only as a readable regular file reached without probing through a symlink.
  sn_intent="$proj/ai-agents/.fkit-accepted-drift"
  sn_have=0
  if [ ! -L "$proj/ai-agents" ] && [ ! -L "$sn_intent" ] && [ -f "$sn_intent" ] && [ -r "$sn_intent" ]; then
    sn_have=1
  fi
  sn_prog='
    BEGIN {
      n_acc = 0
      if (have == 1) {
        while ((getline l < intent) > 0) {
          gsub(/\r/, "", l)
          if (l ~ /^[ \t]*$/ || l ~ /^#/) continue
          sub(/^\.\//, "", l)
          sub(/^\//, "", l)
          while (l ~ /\/$/) sub(/\/$/, "", l)
          if (l != "") acc[++n_acc] = l
        }
        close(intent)
      }
    }
    /^#/ { next }
    NF < 2 { next }
    $1 == "missing" || $1 == "untouched-stale" || $1 == "owner-edited" || $1 == "wrong-type" ||
    $1 == "wiki-routed" || $1 == "refused: symlink" || $1 == "refused: malformed-markers" ||
    $1 == "unreadable" {
      bare = $2
      sub(/\/$/, "", bare)
      for (i = 1; i <= n_acc; i++)
        if (bare == acc[i] || index(bare, acc[i] "/") == 1) next
      n++
      if (n <= 3) names = (n == 1 ? bare : names ", " bare)
    }
    END {
      if (n == 0) exit 0
      more = (n > 3 ? sprintf(" +%d more", n - 3) : "")
      printf "⚠ fkit: %d path(s) diverge from what the installed fkit version ships (%s%s) — run /fkit-heal in a producer session to see and repair; nothing was changed. Deliberate? List the path in ai-agents/.fkit-accepted-drift.\n", n, names, more
    }
  '
  # LC_ALL=C: byte semantics — the awk must not die on non-UTF-8 bytes in an intent file or a path.
  # A filter failure drops SUPPRESSION, never the notice: retry unsuppressed (have=0), then give up.
  sn_line="$(printf '%s\n' "$sn_out" | LC_ALL=C awk -F'\t' -v intent="$sn_intent" -v have="$sn_have" "$sn_prog" 2>/dev/null)" ||
    sn_line="$(printf '%s\n' "$sn_out" | LC_ALL=C awk -F'\t' -v intent="$sn_intent" -v have=0 "$sn_prog" 2>/dev/null)" ||
    sn_line=""
  [ -n "$sn_line" ] && printf '%s\n' "$sn_line" >&2
  return 0
}
structure_notice || :

# FKIT_SETUP_ONLY is a setup CHECK: non-zero when setup failed.
if [ "${FKIT_SETUP_ONLY:-0}" = 1 ]; then
  [ "$setup_ok" = 1 ] || exit 1
  exit 0
fi

command -v claude >/dev/null 2>&1 || {
  echo >&2
  echo "⚠ Claude Code ('claude') is not installed / not on PATH." >&2
  echo "  Install it from https://claude.com/claude-code, then run:  claude" >&2
  exit 127
}

# Codex preflight: optional but recommended — a WARNING, never a wall (ADR-054). Loud here, where the user
# can still fix it: a "second opinion" silently run on Claude is not model-diverse.
codex_preflight() {
  if ! command -v codex >/dev/null 2>&1; then
    printf '\n  ⚠ Codex ('\''codex'\'') is not installed / not on PATH.\n' >&2
    printf '    Reviews will run WITHOUT an independent second opinion — not model-diverse.\n' >&2
    printf '    Fix:  npm install -g @openai/codex   &&   codex login\n\n' >&2
  elif ! codex login status >/dev/null 2>&1; then
    printf '\n  ⚠ Codex is installed but NOT logged in.\n' >&2
    printf '    Reviews will run WITHOUT an independent second opinion — not model-diverse.\n' >&2
    printf '    Fix:  codex login\n\n' >&2
  fi
}
codex_preflight

# Fresh project: run the producer's cold start (it owns fkit-initiate-project), then open the lead (ADR-031;
# 0379) — only if the initiation landed; otherwise back to the shell, never a forced session.

# A refused ai-agents/ is NOT fresh: PROJECT.md is missing for another reason, so the cold start could never
# complete. aa_refused comes from init's exit 3; never re-derive it here.
pm="$proj/ai-agents/knowledge-base/PROJECT.md"
# One freshness test, asked before and after the cold start: two hand-copied greps would drift silently.
pm_is_fresh() {
  [ ! -f "$pm" ] \
    || grep -q 'fkit:uninitialized' "$pm" 2>/dev/null \
    || grep -qF '# <Project name>' "$pm" 2>/dev/null
}
fresh=0
# setup_ok too: one exit status cannot carry two facts (a refusal then a failure exits 1, not 3), and a
# setup that cannot write the project cannot be initiated into.
if [ "$aa_refused" = 0 ] && [ "$setup_ok" = 1 ]; then
  if pm_is_fresh; then
    fresh=1
  fi
fi
if [ "$fresh" = 1 ] && [ -z "$role" ]; then
  printf '\n  This project is not initiated yet — starting the producer to set it up.\n'
  printf '  When the initiation is done, this tab opens the lead.\n'
  role="producer"
  [ -x "$proj/.fkit/interview" ] && { "$proj/.fkit/interview" || true; }
  if [ -f "$proj/.fkit/intake.md" ]; then
    seed="This is a fresh fkit project. The owner just completed the intake questionnaire in .fkit/intake.md — READ THAT FILE FIRST and use it as the product brief. Then run your fkit-initiate-project procedure: do NOT re-ask what the intake already answers; only follow up on blank (—) or genuinely ambiguous items."
  else
    seed="This is a fresh fkit project — run your fkit-initiate-project procedure now: interview me about the product, have the fkit-architect agent survey the codebase, then write PROJECT.md and the architecture doc so we're ready to work."
  fi
  settings="$(build_settings producer)"
  set_tab_title producer
  # Not exec, and the || is load-bearing:
  # under set -e a non-zero claude (Ctrl-C) would kill the launcher here.
  cold_rc=0
  claude --agent fkit-producer --settings "$settings" "$@" "$seed" || cold_rc=$?
  # Landed only if it exited 0 AND the tree is no longer fresh; either half alone opens the lead wrongly.
  if [ "$cold_rc" = 0 ] && ! pm_is_fresh; then
    # Fall through to the tail with role=lead: no new exec, no seed.
    role="lead"
  else
    # The owner was promised the lead: say why not, but open nothing; the exit code stays the cold start's.
    printf '\n  Setup did not complete — run `fkit` again when you are ready.\n'
    exit "$cold_rc"
  fi
fi

# The menu (deterministic; no LLM), only with no role, no args and a terminal. Probe /dev/tty by OPENING it:
# [ -r /dev/tty ] is true with no tty, and exec 3</dev/tty would die under set -e (0042).
if [ -z "$role" ] && [ "$#" -eq 0 ] && { [ -t 0 ] || ( exec 3</dev/tty ) 2>/dev/null; }; then
  if [ -t 0 ]; then exec 3<&0; else exec 3</dev/tty; fi
  proj_name="$(basename "$proj")"
  branch="$(git -C "$proj" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '-')"
  dirty=""
  git -C "$proj" diff --quiet 2>/dev/null || dirty=" · uncommitted changes"

  printf '\n  \033[1mfkit\033[0m — %s  (%s%s)\n\n' "$proj_name" "$branch" "$dirty"
  printf '   1) lead         route to a role, or have it drive the work for you\n'
  printf '   2) producer     product & sprint planning, task briefs\n'
  printf '   3) coder        implementation — the only role that writes source\n'
  printf '   4) architect    design specs, ADRs, feasibility\n'
  printf '   5) reviewer     code review (own pass + Codex second opinion)\n'
  printf '   6) adversarial  hostile pass, findings only\n'
  printf '   7) wiki         the wiki — ingest / lint / sync\n\n'
  printf '  Two roles at once? Open another terminal tab and run fkit again.\n\n'

  while [ -z "$role" ]; do
    printf '  role [1-7, Enter=lead, q to quit]: '
    IFS= read -r pick <&3 || { echo; exit 0; }
    case "$pick" in
      1|lead)                role="lead" ;;
      2|producer)            role="producer" ;;
      3|coder)               role="coder" ;;
      4|architect)           role="architect" ;;
      5|reviewer)            role="reviewer" ;;
      6|adv|adversarial)     role="adversarial-reviewer" ;;
      7|wiki)                role="wiki" ;;
      q|Q|quit|exit)         echo; exit 0 ;;
      # Enter → lead, matching the headless default below (0302). EMPTY only: *) still re-prompts, so
      # "anything unmatched means lead" can never return.
      "")                    role="lead" ;;
      *)                     printf '  ? "%s" is not one of 1-7.\n' "$pick" ;;
    esac
  done
  exec 3<&-
fi

# No role and no tty (piped / CI) → lead is the safe default (args were rejected above).
[ -n "$role" ] || role="lead"

if [ "$role" = lead ]; then
  printf '\n  → lead. It routes and answers wiki questions, and can drive the team (spawn and sequence roles) when you hand it a goal.\n\n'
else
  # "runnable", not "exist": a foreign skill still shows in the / menu;
  # the hook denies it (ADR-018 Decision 5).
  printf '\n  → %s session (locked: only the %s'"'"'s skills are runnable here).\n\n' "$role" "$role"
fi
settings="$(build_settings "$role")"
set_tab_title "$role"
exec claude --agent "fkit-$role" --settings "$settings" "$@"
