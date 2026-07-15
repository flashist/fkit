#!/bin/sh
# fkit — set up the current project for the fkit agent team (idempotent) and launch a ROLE-LOCKED
# Claude Code session. This is the front door: `fkit` with no role shows a deterministic terminal
# menu (no LLM involved — picking a role is an if/else, not a judgment call), then execs the chosen
# role IN THIS SAME TAB.
#
#   fkit                    # menu → pick a role
#   fkit coder              # skip the menu, straight to the coder
#   fkit producer|architect|reviewer|wiki|adv|lead
#   fkit update             # update fkit itself
#
# A first argument that is not a role and not a known verb is a USAGE ERROR, not a session. It used
# to fall through to `claude` unrecognized, which meant `fkit --resume` resumed ANY session under the
# LEAD's lockdown — the role lock bypassed by accident. Args after a named role still pass through.
#
# Every session is locked two ways:
#   * `--agent fkit-<role>`  — the role's system prompt and tool allowlist (harness-enforced)
#   * `--settings` with skillOverrides — every fkit-* skill the role does NOT own is turned "off":
#     hidden from the / menu AND unrunnable by name. That is what makes "the coder cannot run the
#     reviewer's procedure" a fact rather than a request.
#
# Want two roles at once? Open a terminal tab yourself and run `fkit` again. (We deliberately do not
# automate that: spawning terminals needs AppleScript/Accessibility permissions that fail in ways
# that are worse than pressing Cmd-T.)
#
# Env: FKIT_SETUP_ONLY=1 — set up but don't launch claude.
#      FKIT_NO_SELF_HOST=1 — never re-exec into a checkout's own claude/ (see below).
set -eu
here="$(cd "$(dirname "$0")" && pwd)"                  # .../claude
proj="$PWD"

# --- Self-hosting: dogfood the working tree, not the installed snapshot ------------------------
# `fkit` on PATH execs the INSTALLED copy under ~/.local/share/fkit/, so `here` points there — and
# setup copies agents/skills from `here` into the project's .claude/. Launched inside an fkit
# checkout, that silently overwrites the project with a snapshot of an older fkit: edits to
# claude/ never reach the agents, and no number of relaunches helps (the snapshot only moves on
# `fkit update`). Re-exec into the checkout's own script so the working tree is the source.
# The env guard makes the re-exec run exactly once; the path check is what identifies a checkout.
if [ "${FKIT_NO_SELF_HOST:-0}" != 1 ] \
   && [ -x "$proj/claude/fkit-claude.sh" ] \
   && [ "$proj/claude" != "$here" ]; then
  printf '\n  → self-hosting: running from %s (working tree), not the installed fkit.\n' "$proj/claude"
  FKIT_NO_SELF_HOST=1
  export FKIT_NO_SELF_HOST
  exec "$proj/claude/fkit-claude.sh" "$@"
fi

ROLES="producer coder architect reviewer adversarial-reviewer wiki lead"

# --- Self-update ------------------------------------------------------------------------------
# `fkit` (bare) runs THIS script, which until now had no update logic at all — so everyone on the
# default path sat on whatever version they installed, forever, with nothing telling them otherwise.
#
# Shaped per ADR-009 §Decision 3, and deliberately UNLIKE the Omnigent launcher it replaces:
#   - it NOTIFIES; it never auto-updates and never re-execs itself. Silently swapping the code out
#     from under a running invocation is exactly the behavior we don't want back.
#   - `fkit update` stays an explicit verb the user chooses to run.
#   - the check is throttled, TIME-BOXED, and silent on failure. This sits in the startup path of
#     every single `fkit`, so offline / proxied / captive-portal must cost nothing and print nothing.
#     (Omnigent's check had no timeout and no GIT_TERMINAL_PROMPT guard — a repo that asks for
#     credentials would hang the launcher indefinitely. Both are fixed here.)
#
# Env: FKIT_NO_UPDATE_CHECK=1     never touch the network.
#      FKIT_UPDATE_INTERVAL_MIN   throttle window, minutes (default 60; 0 = check every launch).
#      FKIT_REPO / FKIT_REF       update source (default flashist/fkit@main).
share="$(cd "$here/.." && pwd)"        # install root (~/.local/share/fkit), or the repo root in a checkout
FKIT_NET_TIMEOUT=5                     # seconds — hard ceiling on any update-check network call

_fkit_verfield() {   # <key> → its value from the installed .version (empty if absent)
  [ -f "$share/.version" ] || return 0
  sed -n "s/^$1=//p" "$share/.version" | head -1
}
# A source checkout is the fkit repo itself. Key this ONLY on markers install.sh never copies into an
# install (.git, the repo-root package.json) — never on anything inside claude/, which IS copied.
_fkit_is_source_checkout() { [ -d "$share/.git" ] || [ -f "$share/package.json" ]; }

_fkit_remote_sha() {   # → head sha of $repo@$ref, or empty. Never hangs, never fails loudly.
  if command -v git >/dev/null 2>&1; then
    GIT_TERMINAL_PROMPT=0 \
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
_fkit_reinstall() {   # run the canonical installer for $repo@$ref (refreshes resources + .version)
  command -v curl >/dev/null 2>&1 || { echo "fkit: curl is required to update" >&2; return 1; }
  FKIT_REPO="$fkit_repo" FKIT_REF="$fkit_ref" \
    curl -fsSL "https://raw.githubusercontent.com/$fkit_repo/$fkit_ref/install.sh" | sh
}

fkit_repo="${FKIT_REPO:-$(_fkit_verfield repo)}"; fkit_repo="${fkit_repo:-flashist/fkit}"
fkit_ref="${FKIT_REF:-$(_fkit_verfield ref)}";    fkit_ref="${fkit_ref:-main}"

# Explicit: `fkit update`. A real verb the user invokes deliberately.
case "${1:-}" in
  update|--update|upgrade|--upgrade|self-update)
    if _fkit_is_source_checkout; then
      echo "fkit: this is a source checkout ($share) — update it with 'git pull'." >&2
      exit 1
    fi
    printf '  fkit: updating from %s@%s...\n' "$fkit_repo" "$fkit_ref"
    if _fkit_reinstall; then
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
      printf '\n  ↑ fkit v%s → v%s is available. Run:  fkit update\n\n' \
        "${curver:-?}" "${rver:-?}"
    fi
  fi
fi

case "${1:-}" in
  -h|--help)
    cat <<'EOF'
fkit — the fkit agent team, on Claude Code.

Usage: fkit [role] [claude-args…]

With no role you get a menu. Pick a role and it opens IN THIS TAB, locked to that role: it sees only
that role's skills and tools. For two roles at once, open another terminal tab and run `fkit` again.

Roles:
  producer     product & sprint planning, task briefs, task lifecycle
  coder        implementation — the only role that writes source
  architect    architecture, design specs, ADRs, feasibility
  reviewer     code review — its own pass + a Codex second opinion
  adv          adversarial reviewer — hostile pass, findings only
  wiki         the wiki — ingest / lint / sync (the exclusive write gateway)
  lead         the team room — routing help and wiki questions; does no work itself

Within a session, `@fkit-<role> <question>` asks another role and brings the answer back.

Other:
  fkit update           update fkit itself
  FKIT_SETUP_ONLY=1     set the project up, then exit without launching
  FKIT_NO_UPDATE_CHECK=1  never check for updates

A first argument that is not a role is an error. Args AFTER a role pass through to `claude`.
EOF
    exit 0 ;;
esac

# An explicit role as the first bare word skips the menu.
role=""
case "${1:-}" in
  producer|coder|architect|reviewer|wiki|adversarial-reviewer|lead)
    role="$1"; shift ;;
  adv|adversarial)
    role="adversarial-reviewer"; shift ;;
esac

# No role named, but args remain → a USAGE ERROR, not a session.
#
# This is where the old blanket passthrough was. Any unrecognized first arg used to fall through to
# `claude` with role still empty — so `fkit --resume` hit the "no role → lead" default below and
# silently resumed ANY session (a coder session included) under the LEAD's skill lockdown: no Write,
# no Edit, no warning. A session pinned to exactly one role is the invariant the whole product rests
# on (ADR-010), and a stray argv word was quietly bypassing it. Now it stops here.
#
# Deliberately placed AFTER role parsing (we must know whether a role was named) but BEFORE setup,
# preflight, the fresh-project branch, the menu, and the lead default — all four of which exec
# `claude` with "$@" and would otherwise re-open the same hole one level down. `update` and `--help`
# exit above this, so they can never be swallowed by it. Args after a NAMED role still pass through
# (`fkit coder --debug`): that path is intentional and is not what this guards.
if [ -z "$role" ] && [ "$#" -gt 0 ]; then
  printf 'fkit: "%s" is not a role.\n' "$1" >&2
  printf '      Roles: %s (or: adv)\n' "$ROLES" >&2
  printf '      Try:  fkit          (the menu)   ·   fkit <role>   ·   fkit --help\n' >&2
  exit 2
fi

# ---------------------------------------------------------------------------
# Skill ownership — THE single source of truth (ADR-012 §1). A role session sees ONLY these; every
# other fkit-* skill is turned off. Non-fkit skills (the project's own, the user's own) are never
# touched.
#
# This is now the ONLY place role→skill ownership is expressed. The `skills:` frontmatter that used
# to sit in claude/agents/*.md was DROPPED, not generated: Claude Code treats it as a PRELOAD hint,
# not an allowlist, so it enforced nothing. Keeping it (even generated + drift-checked) would have
# preserved a field that LOOKS like the invariant and isn't — worse than no field at all. Don't
# re-add it.
#
# Scope of the lock, precisely (ADR-012 §2): it is structural in a role SESSION (this JSON is what
# makes `fkit coder` genuinely unable to run /fkit-review — the property reviewer independence rests
# on). In a spawned CONSULT it is advisory only, carried by the agent prompt and each skill's
# `⛔ Owner:` banner. Don't claim more than that in the docs.
#
# ⚠️ CHANGING A ROLE'S SKILLS? Two hand-maintained tables MIRROR this list for humans and MUST be
# updated in the same commit, or the help text lies about what a role can do:
#   * claude/skills/fkit-team/SKILL.md  — the roster the /fkit-team skill prints
#   * claude/README.md                  — the skill-ownership table
# This has already bitten once: task 14 added fkit-task-plan here and to the producer's agent file,
# but not to fkit-team's roster — so /fkit-team under-reported the producer's primary procedure for
# two days. These are copies FOR READERS, not sources of truth; this function is the source of truth.
# ---------------------------------------------------------------------------
skills_for_role() {
  case "$1" in
    lead)      echo "fkit-team fkit-query" ;;
    producer)  echo "fkit-team fkit-query fkit-initiate-project fkit-task-plan fkit-task-done fkit-task-cancelled fkit-status" ;;
    coder)     echo "fkit-team fkit-query fkit-plan-task fkit-process-review fkit-process-stateful-review" ;;
    architect) echo "fkit-team fkit-query fkit-survey-project fkit-inspect fkit-design-spec fkit-evaluate-approach fkit-record-decision" ;;
    reviewer)  echo "fkit-team fkit-query fkit-review fkit-stateful-review" ;;
    adversarial-reviewer) echo "fkit-team fkit-query fkit-adversarial-review" ;;
    wiki)      echo "fkit-team fkit-query fkit-wiki-ingest fkit-wiki-lint fkit-wiki-sync" ;;
    *)         echo "" ;;
  esac
}

# Skills that must stay ON for EVERY role (ADR-012 §3). A spawned consult inherits the *caller's*
# skillOverrides — not its own — so any skill a role is genuinely consulted TO RUN has to be left on
# for everyone, or it is unreachable in the one place it's needed. Concretely: /fkit-initiate-project
# has the PRODUCER spawn the architect to run fkit-survey-project; with survey-project off in the
# producer's settings, the architect inherits that and project initiation cannot run its own survey.
#
# The cost, stated plainly: an owner in any role session can now invoke /fkit-survey-project by name.
# That is a benign leak on a read-heavy doc procedure, traded against an initiation flow that is
# otherwise broken. Deliberately minimal — adding to this set is a decision, not a convenience.
CONSULT_SKILLS="fkit-survey-project fkit-query"

# Writes the role's settings to a file and echoes its (relative) path. It goes in a FILE rather than
# inline on argv because a terminal with no title yet labels the tab with the command line — and a
# ~400-byte JSON blob makes every tab look identical. `--settings` takes a file or JSON; we take file.
build_settings() {   # → .fkit/settings/<role>.json containing {"skillOverrides":{"<not-owned>":"off",…}}
  allowed=" $(skills_for_role "$1") $CONSULT_SKILLS "
  body=""
  for d in "$proj"/.claude/skills/fkit-*/; do
    [ -d "$d" ] || continue
    s="$(basename "$d")"
    case "$allowed" in *" $s "*) continue ;; esac
    body="$body${body:+,}\"$s\":\"off\""
  done
  # The lockdown is NOT optional: a session launched without --settings is a session with no role
  # isolation at all (ADR-010), and it would fail *open* — every fkit skill live in every role. So when
  # the project is not writable (read-only checkout, permissions) we neither skip the lockdown nor die
  # on a raw `mkdir: Permission denied`; we hand the SAME JSON to --settings inline instead, which it
  # also accepts. Inline costs us only the ugly tab title the file exists to avoid — a fair price on a
  # path that is both rare and already degraded, and it beats a temp file: nothing to leak on every
  # launch, and no world-writable /tmp surface to defend.
  #
  # Note the subshell around the write: a redirection that fails to OPEN is reported by the shell, not
  # by printf, so `printf … > f 2>/dev/null` would still leak "Permission denied" to the terminal. The
  # subshell puts the redirection *inside* the scope stderr is silenced for.
  if mkdir -p "$proj/.fkit/settings" 2>/dev/null &&
     ( printf '{"skillOverrides":{%s}}\n' "$body" > "$proj/.fkit/settings/$1.json" ) 2>/dev/null; then
    printf '.fkit/settings/%s.json' "$1"        # relative: we always exec from $proj (proj = $PWD)
    return 0
  fi
  echo "⚠ $proj is not writable — passing the role lockdown inline instead of via .fkit/." >&2
  printf '{"skillOverrides":{%s}}' "$body"
}

# Name the tab for the role, so a wall of fkit tabs is readable. Claude Code overwrites this once the
# conversation has a topic (its own auto-title); until then this is what you see.
set_tab_title() {
  [ -t 1 ] || return 0
  printf '\033]0;fkit · %s — %s\007' "$1" "$(basename "$proj")"
}

# Setup runs every launch (idempotent), but stays QUIET on an already-set-up project — nobody wants
# a wall of "already present" on every single launch. A first-time setup prints its summary in full.
#
# Setup is BEST-EFFORT; the session is not. init runs under `set -euo pipefail`, and this launcher
# under `set -eu` — so an unguarded call meant any init failure (bad permissions, read-only checkout,
# ENOSPC, a weird ai-agents/) killed the launcher before `claude` was ever exec'd, and the user lost
# their whole team over a `cp`. Guard the call, warn loudly, and start the session anyway. A user must
# always be able to reach their agents, even when fkit cannot finish setting the project up.
setup_ok=1
aa_refused=0
setup_rc=0
if [ -e "$proj/ai-agents" ] && [ -d "$proj/.claude/agents" ]; then
  "$here/fkit-claude-init.sh" "$proj" >/dev/null || setup_rc=$?
else
  "$here/fkit-claude-init.sh" "$proj" || setup_rc=$?
fi
# 3 is init's "I set everything up, but I refused to touch ai-agents/" — a success, not a failure.
# Anything else non-zero is a real setup failure. We take this as a STATUS from init rather than
# re-testing the condition here: the two copies drifted the first time we tried that.
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

# The promise is "a setup failure never costs you a project that ALREADY has its agents" — not "fkit
# can start a session out of nothing". If setup failed AND no fkit agent was ever written to disk,
# there is nothing to launch into: `claude --agent fkit-<role>` cannot resolve an agent file that does
# not exist, and it would die on its own confusing "agent not found". Say so plainly instead.
#
# We deliberately do NOT drop --agent to force *some* session: an unroled session carries no ADR-010
# lockdown, so it would fail OPEN — every role's skills live at once. Refusing is the safe answer.
if [ "$setup_ok" = 0 ] && ! ls "$proj"/.claude/agents/fkit-*.md >/dev/null 2>&1; then
  echo "⚠ fkit has no agents installed here, so there is no session to start." >&2
  echo "  Setup could not write to the project — check that $proj is writable, then: fkit" >&2
  exit 1
fi

# FKIT_SETUP_ONLY is a setup CHECK. A check that reports success on a failed setup is worse than no
# check at all — so it exits non-zero when setup failed, rather than the blanket `exit 0` it used to.
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

# --- Codex preflight: required, but a WARNING, not a wall -------------------------------------
# fkit is Claude Code + Codex. The adversarial reviewer's whole reason to exist is genuine model
# diversity — a second opinion from a DIFFERENT model. A "Codex" review that silently ran on Claude
# is a second opinion from the model that wrote the code: not a second opinion, the illusion of one,
# which is worse than none. So Codex absence has to be loud HERE, where the user can still fix it,
# rather than only in a flag on the review output.
#
# Per the owner's 2026-07-11 ruling this warns and continues — a Codex outage mid-session must not
# wall the user out of their own team. `codex login status` is the check because a binary that cannot
# authenticate is the same failure from the user's point of view (~70ms; it does not touch the model).
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

# --- Fresh project: skip the menu, go straight to the producer's cold start -------------------
# "Fresh" is only a meaningful question when init actually manages ai-agents/. When it REFUSED the tree
# (symlink, a file where the dir belongs, a directory it cannot read), PROJECT.md is missing for a
# reason that has nothing to do with being new — and force-starting the producer's cold start would
# strand the owner in an initiation that can never complete, on every launch, with no way to the menu.
# So: a refused ai-agents/ is NOT fresh. Fall through to the menu and let them work.
#
# `aa_refused` comes from init's exit status (3). Do NOT re-derive it here — an earlier version tested
# `[ -d ] && [ ! -L ]` and silently disagreed with init about a chmod-000 directory.
pm="$proj/ai-agents/knowledge-base/PROJECT.md"
fresh=0
# `setup_ok` is checked as well as `aa_refused`, and not only as a belt-and-braces: one exit status
# cannot carry two facts. If init refuses ai-agents/ AND then fails a later step, `set -e` exits with
# THAT failure (1) and the refusal is never signalled — so `aa_refused` alone would read 0 and the cold
# start would come straight back. That state is not exotic; it is a read-only checkout (task 26) that
# also has a weird ai-agents/ (task 27), i.e. the intersection of this work's own two briefs.
#
# It is independently right, too: the producer's initiation exists to WRITE ai-agents/, and a failed
# setup is direct evidence fkit cannot write this project. Cold-starting into it could only fail.
if [ "$aa_refused" = 0 ] && [ "$setup_ok" = 1 ]; then
  if [ ! -f "$pm" ] \
     || grep -q 'fkit:uninitialized' "$pm" 2>/dev/null \
     || grep -qF '# <Project name>' "$pm" 2>/dev/null; then
    fresh=1
  fi
fi
if [ "$fresh" = 1 ] && [ -z "$role" ]; then
  printf '\n  This project is not initiated yet — starting the producer to set it up.\n'
  role="producer"
  [ -x "$proj/.fkit/interview" ] && { "$proj/.fkit/interview" || true; }
  if [ -f "$proj/.fkit/intake.md" ]; then
    seed="This is a fresh fkit project. The owner just completed the intake questionnaire in .fkit/intake.md — READ THAT FILE FIRST and use it as the product brief. Then run your fkit-initiate-project procedure: do NOT re-ask what the intake already answers; only follow up on blank (—) or genuinely ambiguous items."
  else
    seed="This is a fresh fkit project — run your fkit-initiate-project procedure now: interview me about the product, have the fkit-architect agent survey the codebase, then write PROJECT.md and the architecture doc so we're ready to work."
  fi
  settings="$(build_settings producer)"
  set_tab_title producer
  exec claude --agent fkit-producer --settings "$settings" "$@" "$seed"
fi

# --- The menu (deterministic; no LLM) ----------------------------------------------------------
# Only when no role was named AND no other args were passed AND we have a terminal to ask on.
#
# The "terminal to ask on" test must be whether /dev/tty can actually be OPENED, not `[ -r /dev/tty ]`.
# `-r` checks the device node's permission bits (access()), and /dev/tty is world-rw on macOS/Linux, so
# it reads TRUE even with no controlling terminal — the branch would then be entered and die at the
# `exec 3</dev/tty` below (ENXIO "Device not configured") under `set -e`, never reaching the lead
# default at the bottom. The subshell `( exec 3</dev/tty )` returns 0 only if open() genuinely succeeds
# (non-fatal on failure inside this `||` test; 2>/dev/null swallows the ENXIO noise), so a headless run
# correctly falls through to the team-room default instead of crashing.
if [ -z "$role" ] && [ "$#" -eq 0 ] && { [ -t 0 ] || ( exec 3</dev/tty ) 2>/dev/null; }; then
  if [ -t 0 ]; then exec 3<&0; else exec 3</dev/tty; fi
  proj_name="$(basename "$proj")"
  branch="$(git -C "$proj" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '-')"
  dirty=""
  git -C "$proj" diff --quiet 2>/dev/null || dirty=" · uncommitted changes"

  printf '\n  \033[1mfkit\033[0m — %s  (%s%s)\n\n' "$proj_name" "$branch" "$dirty"
  printf '   1) producer     product & sprint planning, task briefs\n'
  printf '   2) coder        implementation — the only role that writes source\n'
  printf '   3) architect    design specs, ADRs, feasibility\n'
  printf '   4) reviewer     code review (own pass + Codex second opinion)\n'
  printf '   5) adversarial  hostile pass, findings only\n'
  printf '   6) wiki         the wiki — ingest / lint / sync\n'
  printf '   7) team room    not sure who you need? ask here\n\n'
  printf '  Two roles at once? Open another terminal tab and run fkit again.\n\n'

  while [ -z "$role" ]; do
    printf '  role [1-7, q to quit]: '
    IFS= read -r pick <&3 || { echo; exit 0; }
    case "$pick" in
      1|producer)            role="producer" ;;
      2|coder)               role="coder" ;;
      3|architect)           role="architect" ;;
      4|reviewer)            role="reviewer" ;;
      5|adv|adversarial)     role="adversarial-reviewer" ;;
      6|wiki)                role="wiki" ;;
      7|lead|team|"team room") role="lead" ;;
      q|Q|quit|exit)         echo; exit 0 ;;
      "")                    : ;;
      *)                     printf '  ? "%s" is not one of 1-7.\n' "$pick" ;;
    esac
  done
  exec 3<&-
fi

# No role and no tty (piped / CI) → the team room is the safe default. Reaching here with no role now
# implies no args too — the guard above rejected those — so this is the no-args, no-tty case only.
[ -n "$role" ] || role="lead"

if [ "$role" = lead ]; then
  printf '\n  → team room. It routes and answers wiki questions; it does no work itself.\n\n'
else
  printf '\n  → %s session (locked: only the %s'"'"'s skills exist here).\n\n' "$role" "$role"
fi
settings="$(build_settings "$role")"
set_tab_title "$role"
exec claude --agent "fkit-$role" --settings "$settings" "$@"
