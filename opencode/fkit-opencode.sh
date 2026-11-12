#!/bin/sh
set -eu
here="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
if [ -f "$PWD/opencode/setup.mjs" ] && [ "$PWD/opencode" != "$here" ]; then
  exec sh "$PWD/opencode/fkit-opencode.sh" "$@"
fi
case "${1:-}" in
  --help|-h) printf '%s\n' 'Usage: fkit opencode [lead|producer|coder|architect|reviewer|adversarial-reviewer|wiki|init|board] [--models] [--no-plan-review|--plan-review] [OpenCode flags]' 'First run asks for team and adversarial-review providers. --models repeats model setup.'; exit 0 ;;
  board) shift; exec node "$here/../bin/fkit-board.mjs" "$@" ;;
esac
command -v node >/dev/null 2>&1 || { echo 'fkit opencode requires Node.js' >&2; exit 127; }
plan_review=1
plan_on=0
plan_off=0
literal=0
value=0
option=
reset_models=0
explicit_model=0
existing_session=0
model_server="${FKIT_OPENCODE_SERVER:-}"
# Preserve OpenCode option values and everything after --; only FKit switches belong to this parser.
for arg do
  shift
  if [ "$literal" = 1 ] || [ "$value" = 1 ]; then
    if [ "$value" = 1 ] && [ "$option" = --server ]; then model_server="$arg"; fi
    set -- "$@" "$arg"
    value=0
    continue
  fi
  case "$arg" in
    --) literal=1; set -- "$@" "$arg" ;;
    --models) reset_models=1 ;;
    --no-plan-review) plan_off=1; plan_review=0 ;;
    --plan-review) plan_on=1 ;;
    --prompt|--model|-m|--server|--session|-s|--log-level)
      case "$arg" in --model|-m) explicit_model=1 ;; esac
      case "$arg" in --session|-s) existing_session=1 ;; esac
      option="$arg"; set -- "$@" "$arg"; value=1 ;;
    --model=*|-m=*) explicit_model=1; set -- "$@" "$arg" ;;
    --session=*|-s=*) existing_session=1; set -- "$@" "$arg" ;;
    --server=*) model_server="${arg#--server=}"; set -- "$@" "$arg" ;;
    *) set -- "$@" "$arg" ;;
  esac
done
if [ "$plan_on" = 1 ] && [ "$plan_off" = 1 ]; then
  echo 'Choose --plan-review or --no-plan-review, not both.' >&2
  exit 2
fi
role="${1:-lead}"
case "$role" in
  lead|producer|coder|architect|reviewer|adversarial-reviewer|wiki|init) [ "$#" -eq 0 ] || shift ;;
  -*) role=lead ;;
  *) echo "Unknown fkit role: $role" >&2; exit 2 ;;
esac
FKIT_OPENCODE_MODEL_SETUP=1 FKIT_OPENCODE_RESET_MODELS="$reset_models" FKIT_OPENCODE_SERVER="$model_server" FKIT_OPENCODE_PLAN_REVIEW="$plan_review" FKIT_OPENCODE_ROLE="$role" node "$here/setup.mjs" "$PWD"
[ "$role" != init ] || exit 0
command -v opencode >/dev/null 2>&1 || { echo 'Install OpenCode: https://opencode.ai/docs/' >&2; exit 127; }
# OpenCode merges this dedicated source with the consuming project's own configuration.
OPENCODE_CONFIG="${OPENCODE_CONFIG:-$PWD/.opencode/fkit.json}"
export OPENCODE_CONFIG
if [ "$explicit_model" = 0 ] && [ "$existing_session" = 0 ]; then
  model="$(node "$here/models.mjs" "$role")"
  [ -z "$model" ] || set -- --model "$model" "$@"
fi
pm=ai-agents/knowledge-base/PROJECT.md
if [ "$role" = lead ] && { [ ! -f "$pm" ] || grep -q 'fkit:uninitialized\|# <Project name>' "$pm"; }; then
  exec opencode mini --agent fkit-lead --prompt 'Use fkit-producer to check whether PROJECT.md is a placeholder. If so run fkit-initiate-project; otherwise continue with the requested role.' "$@"
fi
exec opencode mini --agent "fkit-$role" "$@"
